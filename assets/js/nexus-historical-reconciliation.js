/* Nexus historical physical-vial reconciliation — draft, deliberately NOT loaded by index.html.
 * Pure analysis/proposal engine. Never reads/writes localStorage or commits inventory.
 * Only individually reviewed observations are recorded; physical balances and historical
 * canonical dose/ledger entries remain unchanged. Real inventory repair is a separate gate.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.NexusHistoricalReconciliation=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const copy=value=>JSON.parse(JSON.stringify(value));
  const same=(a,b)=>String(a)===String(b);
  const finitePositive=value=>typeof value==="number"&&Number.isFinite(value)&&value>0;
  function fingerprint(value){return JSON.stringify(value);}
  function getKit(data,kitId){
    if(!data||!Array.isArray(data.supplies))throw Error("Missing supplies");
    const kits=data.supplies.filter(k=>same(k.id,kitId));
    if(kits.length!==1||kits[0].isBlend!==true)throw Error("Expected one exact premixed blend kit");
    return kits[0];
  }
  function getDoses(data,kit){
    const peptide=data.peptides?.[kit.name]||data.compounds?.[kit.name];
    return Array.isArray(peptide?.doses)?peptide.doses:[];
  }
  function review(data,kitId){
    const kit=getKit(data,kitId);
    const vials=(kit.vials||[]).map(v=>({id:v.id,sequenceNumber:v.sequenceNumber??null,
      status:v.status??null,recordedRemainingMg:v.remainingMg??null,
      reconDate:v.reconDate??null,finishedAt:v.finishedAt??null}));
    const ids=new Set(),ledger=[];
    for(const x of kit.doseLog||[]){
      if(x.id==null||ids.has(String(x.id)))throw Error("Duplicate or missing physical ledger ID");
      ids.add(String(x.id));
      ledger.push({id:x.id,vialId:x.vialId??null,amountMg:Number.isFinite(Number(x.totalMgDrawn))?Number(x.totalMgDrawn):null,
        date:x.date??null,transactionId:x.transactionId??null,kind:x.kind??null});
    }
    const entries=getDoses(data,kit).filter(d=>same(d.kitId,kit.id)||same(d.blendSource,kit.id)||
      (d.allocations||[]).some(a=>same(a.kitId,kit.id))).map(d=>{
      const allocations=(d.allocations||[]).filter(a=>same(a.kitId,kit.id)).map(a=>({
        kitId:a.kitId,vialId:a.vialId??null,ledgerId:a.ledgerId??null,
        amount:a.amount??null
      }));
      const sourceKnown=allocations.some(a=>a.vialId!=null&&a.ledgerId!=null&&finitePositive(Number(a.amount)));
      return {id:d.id,date:d.date??null,dose:d.dose??null,allocations,
        sourceKnown,sourceUncertain:!sourceKnown,existingReview:copy(d.historicalSourceReview||null)};
    });
    return {
      kitId:kit.id,kitName:kit.name,blendInventoryMode:kit.blendInventoryMode??null,
      vials,ledger,entries,unresolved:entries.filter(d=>d.sourceUncertain).map(d=>d.id),
      ledgerTotalMg:ledger.reduce((sum,e)=>sum+(finitePositive(e.amountMg)?e.amountMg:0),0),
      // Never derive remaining from the ledger or add unattributed entries to it.
      physicalRemainingMg:null,physicalRemainingVerified:false,
      note:"Totals may overlap. Historical physical stock is not inferred."
    };
  }
  function prepare(data,request){
    if(!request||!Array.isArray(request.decisions)||request.decisions.length===0)
      throw Error("Select individual historical entries to review");
    const report=review(data,request.kitId);
    const vialIds=new Set(report.vials.map(v=>String(v.id)));
    const doseIds=new Set(),changes=[];
    for(const d of request.decisions){
      if(d.doseId==null||doseIds.has(String(d.doseId)))throw Error("Duplicate or missing dose decision");
      doseIds.add(String(d.doseId));
      const existing=report.entries.find(x=>same(x.id,d.doseId));
      if(!existing)throw Error("Dose not attributed to selected kit");
      if(!existing.sourceUncertain)throw Error("Already exact-source attributed; do not overwrite");
      if(d.outcome!=="verified"&&d.outcome!=="unresolved")throw Error("Invalid decision");
      if(d.outcome==="verified"){
        if(d.vialId==null||!vialIds.has(String(d.vialId)))throw Error("Exact vial required");
        if(d.evidence!== "physical-log" && d.evidence!=="user-firsthand")throw Error("Evidence category required");
        if(typeof d.note!=="string"||d.note.trim().length<3)throw Error("Evidence note required");
        if(d.note.length>500)throw Error("Evidence note too long");
      }else if(d.vialId!=null)throw Error("Unresolved cannot have inferred vial");
      changes.push({doseId:existing.id,before:existing.existingReview,
        after:{outcome:d.outcome,vialId:d.outcome==="verified"?d.vialId:null,
          evidence:d.outcome==="verified"?d.evidence:null,note:d.note||""}});
    }
    if(request.physicalObservation!=null){
      // Physical observations do not change stock or imply historical reconciliation.
      const p=request.physicalObservation;
      if(p.vialId==null||!vialIds.has(String(p.vialId)))throw Error("Unknown observed vial");
      if(p.state!=="present"&&p.state!=="discarded"&&p.state!=="unknown")throw Error("Invalid observed state");
      if(p.remainingMg!=null&&!((p.state==="present")&&typeof p.remainingMg==="number"&&
        Number.isFinite(p.remainingMg)&&p.remainingMg>=0))throw Error("Invalid physical observation");
      if(p.remainingMg!=null)throw Error("Measured mg may not be safely derived from vial appearance; stock correction requires separate verified method");
    }
    return {kind:"NEXUS_HISTORICAL_REVIEW_V1",kitId:report.kitId,
      baseFingerprint:fingerprint(data),changes,physicalObservation:request.physicalObservation?copy(request.physicalObservation):null,
      stockChange:false,requiresBackup:true,requiresConfirmation:true};
  }
  function applyToClone(current,proposal,authorization){
    if(!proposal||proposal.kind!=="NEXUS_HISTORICAL_REVIEW_V1"||proposal.stockChange!==false)
      throw Error("Unsupported reconciliation proposal");
    if(!authorization||authorization.confirmed!==true||authorization.backupVerified!==true||
      authorization.confirmationText!=="REVIEW HISTORICAL RECORDS")
      throw Error("Explicit confirmation and verified backup required");
    if(fingerprint(current)!==proposal.baseFingerprint)throw Error("Stale records: review again");
    // Revalidate every proposed decision against the immutable snapshot; never trust
    // a previously prepared proposal or modify canonical dose/ledger/inventory fields.
    const data=copy(current);
    const kit=getKit(data,proposal.kitId),doses=getDoses(data,kit);
    const seen=new Set();
    for(const change of proposal.changes||[]){
      if(seen.has(String(change.doseId)))throw Error("Duplicate decision");
      seen.add(String(change.doseId));
      const dose=doses.find(d=>same(d.id,change.doseId));
      if(!dose)throw Error("Missing historical dose");
      if(fingerprint(dose.historicalSourceReview||null)!==fingerprint(change.before))
        throw Error("Changed historical review");
      if(change.after?.outcome==="verified" &&
        !(kit.vials||[]).some(v=>same(v.id,change.after.vialId)))
        throw Error("Missing physical vial");
      if(!["verified","unresolved"].includes(change.after?.outcome))throw Error("Invalid outcome");
      dose.historicalSourceReview=copy(change.after);
    }
    if(proposal.physicalObservation){
      const obs=proposal.physicalObservation;
      if(obs.remainingMg!=null)throw Error("Stock change prohibited");
      if(!(kit.vials||[]).some(v=>same(v.id,obs.vialId)))throw Error("Missing observed vial");
      if(!["present","discarded","unknown"].includes(obs.state))throw Error("Invalid observed state");
      kit.historicalVialObservations=(kit.historicalVialObservations||[]).concat([copy(obs)]);
    }
    return data; // No persistence, no side effects: caller must independently gate any write.
  }
  return Object.freeze({review,prepare,applyToClone});
});
