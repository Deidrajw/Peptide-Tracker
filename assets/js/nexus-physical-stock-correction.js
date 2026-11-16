/* Stage B experimental correction gate. NOT loaded by index.html.
 * Never infer physical stock from a historical dose or ledger.
 * Injected exclusive writer and durable backup implementation are mandatory.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.NexusPhysicalStockCorrection=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const copy=x=>JSON.parse(JSON.stringify(x));
 const fail=s=>{throw Error(s)};
 const same=(a,b)=>String(a)===String(b);
 const digest=x=>JSON.stringify(x);
 function plan(snapshot,input){
  if(!snapshot||!Array.isArray(snapshot.supplies))fail("Invalid snapshot");
  if(input?.enabled!==true)fail("Stock correction feature gate OFF");
  const matches=snapshot.supplies.filter(k=>same(k.id,input.kitId)&&k.isBlend===true);
  if(matches.length!==1)fail("Exact blend kit required");
  const kit=matches[0],vials=(kit.vials||[]).filter(v=>same(v.id,input.vialId));
  if(vials.length!==1)fail("Exact vial required");
  const vial=vials[0];
  if(!["open","active","empty","finished"].includes(vial.status))fail("Status not eligible for correction");
  if(!["open","active","empty","finished"].includes(input.newStatus))fail("Invalid observed status");
  if(!Number.isFinite(input.measuredMl)||input.measuredMl<0||
     !Number.isFinite(input.verifiedMgPerMl)||input.verifiedMgPerMl<=0)fail("Independent measured volume and verified concentration required");
  if(input.measuredMl>0&&!["open","active"].includes(input.newStatus))fail("Positive remainder must have open status");
  if(input.measuredMl===0&&!["empty","finished"].includes(input.newStatus))fail("Zero remainder must have empty status");
  if(input.evidenceMethod!=="calibrated-volume-and-documented-concentration")fail("Unsupported verification method");
  if(typeof input.evidenceNote!=="string"||input.evidenceNote.trim().length<12||input.evidenceNote.length>500)fail("Detailed first-hand evidence required");
  if(typeof input.backupLabel!=="string"||input.backupLabel.trim().length<5)fail("Identifiable backup label required");
  const remaining=Number((input.measuredMl*input.verifiedMgPerMl).toFixed(6));
  if(!Number.isFinite(remaining)||remaining<0||remaining>Number(vial.vialMg))fail("Measured balance outside vial capacity");
  if(!Number.isFinite(Number(vial.remainingMg))||Number(vial.remainingMg)<0)fail("Stored balance invalid");
  if(!Array.isArray(kit.doseLog))fail("Missing physical ledger");
  const ids=new Set();
  for(const e of kit.doseLog){if(e.id==null||ids.has(String(e.id)))fail("Duplicate or missing ledger IDs");ids.add(String(e.id));}
  if(typeof input.auditId!=="string"||!/^stock-correction-[a-zA-Z0-9-]{12,}$/.test(input.auditId))fail("Unique audit ID required");
  if((snapshot.historicalStockCorrectionAudit||[]).some(a=>a.id===input.auditId))fail("Correction already recorded");
  return Object.freeze({kind:"NEXUS_PHYSICAL_STOCK_CORRECTION_V1",
   base:digest(snapshot),kitId:kit.id,vialId:vial.id,
   before:{remainingMg:vial.remainingMg,status:vial.status},
   after:{remainingMg:remaining,status:input.newStatus},
   evidence:{method:input.evidenceMethod,measuredMl:input.measuredMl,verifiedMgPerMl:input.verifiedMgPerMl,note:input.evidenceNote.trim()},
   backupLabel:input.backupLabel,auditId:input.auditId,
   stockChange:true,requiresExclusiveWriter:true,requiresVerifiedBackup:true});
 }
 function transform(snapshot,proposal){
  if(digest(snapshot)!==proposal.base)fail("Stale source snapshot");
  const next=copy(snapshot);
  const kit=next.supplies.find(k=>same(k.id,proposal.kitId));
  const vial=kit?.vials?.find(v=>same(v.id,proposal.vialId));
  if(!vial||vial.remainingMg!==proposal.before.remainingMg||vial.status!==proposal.before.status)fail("Vial changed");
  if((next.historicalStockCorrectionAudit||[]).some(a=>a.id===proposal.auditId))fail("Duplicate audit");
  // No changes to historical dose records, blend physical doseLog, or preparation history.
  vial.remainingMg=proposal.after.remainingMg;
  vial.status=proposal.after.status;
  const audit={id:proposal.auditId,kind:proposal.kind,kitId:proposal.kitId,vialId:proposal.vialId,
   before:copy(proposal.before),after:copy(proposal.after),evidence:copy(proposal.evidence),
   backupLabel:proposal.backupLabel,reason:"Independent physical stock observation; historical dose records unchanged"};
  next.historicalStockCorrectionAudit=[...(next.historicalStockCorrectionAudit||[]),audit];
  return {next,audit};
 }
 async function commit(current,proposal,authorization,services){
  if(services?.featureEnabled!==true)fail("Physical correction gate OFF");
  if(!authorization||authorization.confirmed!==true||
     authorization.confirmationText!=="CORRECT PHYSICAL STOCK")fail("Explicit user confirmation required");
  if(!proposal||proposal.kind!=="NEXUS_PHYSICAL_STOCK_CORRECTION_V1"||proposal.stockChange!==true)fail("Invalid proposal");
  if(typeof services?.backup!=="function"||typeof services?.verifyBackup!=="function"||
     typeof services?.writer?.transaction!=="function")fail("Backup and exclusive writer required");
  if(digest(current)!==proposal.base)fail("Stale source snapshot");
  // A verified export exists BEFORE any write attempt. A failed backup aborts untouched.
  const backup=await services.backup(copy(current),proposal.backupLabel);
  if(!backup||await services.verifyBackup(backup,current)!==true)fail("Durable backup verification failed");
  return await services.writer.transaction(current,snapshot=>{
   if(digest(snapshot)!==proposal.base)fail("Concurrent modification; review again");
   return transform(snapshot,proposal);
  });
 }
 function rollbackPlan(current,auditId,backup){
  const audit=(current?.historicalStockCorrectionAudit||[]).find(a=>a.id===auditId);
  if(!audit||!backup||!Array.isArray(backup.supplies))fail("Audit and verified backup required");
  const original=backup.supplies.find(k=>same(k.id,audit.kitId))?.vials?.find(v=>same(v.id,audit.vialId));
  const actual=current.supplies?.find(k=>same(k.id,audit.kitId))?.vials?.find(v=>same(v.id,audit.vialId));
  if(!original||!actual||digest({remainingMg:original.remainingMg,status:original.status})!==digest(audit.before))
   fail("Backup does not match original vial");
  if(digest({remainingMg:actual.remainingMg,status:actual.status})!==digest(audit.after))
   fail("Vial changed since correction; automatic rollback prohibited");
  if((current.historicalStockCorrectionAudit||[]).some(a=>a.rollbackOf===auditId))
   fail("Already rolled back");
  // Never discard unrelated edits by restoring the entire old snapshot.
  return {base:digest(current),auditId,before:copy(audit.after),after:copy(audit.before),
    kitId:audit.kitId,vialId:audit.vialId};
 }
 async function rollback(current,plan,authorization,services){
  if(services?.featureEnabled!==true||authorization?.confirmationText!=="ROLL BACK STOCK CORRECTION")
   fail("Explicit rollback confirmation required");
  if(typeof services?.writer?.transaction!=="function")fail("Exclusive writer required");
  return services.writer.transaction(current,snapshot=>{
   if(digest(snapshot)!==plan.base)fail("Stale rollback snapshot");
   const next=copy(snapshot);
   const vial=next.supplies.find(k=>same(k.id,plan.kitId))?.vials?.find(v=>same(v.id,plan.vialId));
   if(!vial||digest({remainingMg:vial.remainingMg,status:vial.status})!==digest(plan.before))fail("Changed stock");
   vial.remainingMg=plan.after.remainingMg;vial.status=plan.after.status;
   next.historicalStockCorrectionAudit.push({id:"rollback-"+plan.auditId,rollbackOf:plan.auditId,kind:"NEXUS_STOCK_ROLLBACK_V1",
     kitId:plan.kitId,vialId:plan.vialId,before:copy(plan.before),after:copy(plan.after)});
   return {next};
  });
 }
 return Object.freeze({plan,commit,rollbackPlan,rollback});
});
