/* Nexus atomic preparation bridge — pure state transformation.
 * No persistence, migration, implicit vial selection or production writes.
 * Caller must persist the returned full snapshot as one unit after validation.
 */
(function(root,factory){
 const api=factory(typeof module==="object"&&module.exports?require("./nexus-preparation-ledger.js"):root.NexusPreparationLedger);
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.NexusPreparationBridge=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(ledger){
 const fail=m=>{throw Error(m)};
 const round=n=>Math.round((n+Number.EPSILON)*1e6)/1e6;
 function plan(snapshot,tx){
  if(!ledger||!Array.isArray(snapshot?.supplies)||!Array.isArray(snapshot?.preparations))fail("Inventory snapshot unavailable");
  if(!tx||typeof tx.id!=="string"||!tx.id.trim())fail("Transaction ID required");
  const next=JSON.parse(JSON.stringify(snapshot));
  if(next.supplies.some(k=>(k.preparationTransfers||[]).some(t=>t.id===tx.id)) ||
     next.preparations.some(p=>(p.transactions||[]).some(t=>t.id===tx.id)))fail("Duplicate transaction ID");
  if(tx.kind!=="transfer")fail("Only explicit transfers supported");
  const kit=next.supplies.find(k=>String(k.id)===String(tx.sourceKitId));
  if(!kit||kit.isBlend)fail("Explicit non-blend source kit required");
  const vial=(kit.vials||[]).find(v=>String(v.id)===String(tx.sourceVialId));
  if(!vial||!["open","active"].includes(vial.status)||!Number.isFinite(vial.remainingMg))fail("Explicit migrated open vial required");
  const dest=next.preparations.find(p=>p.id===tx.destinationPreparationId);
  if(!dest||dest.method!=="Nasal"||dest.containerType!=="nasal-bottle")fail("Explicit nasal bottle required");
  if(dest.compound!==kit.name)fail("Source and destination compound mismatch");
  if(dest.sourceKitId!=null&&String(dest.sourceKitId)!==String(kit.id))fail("Bottle source kit mismatch");
  if(dest.sourceVialId!=null&&String(dest.sourceVialId)!==String(vial.id))fail("Bottle source vial mismatch");
  if(!Number.isFinite(tx.amountMg)||tx.amountMg<=0)fail("Positive transfer amount required");
  if(vial.remainingMg+1e-7<tx.amountMg)fail("Insufficient source stock");
  if(!Number.isFinite(dest.remainingMg)||dest.remainingMg<0)fail("Invalid destination balance");
  const amount=round(tx.amountMg);
  if(amount<=0||amount>vial.remainingMg+1e-7)fail("Invalid rounded transfer amount");
  const entry={id:tx.id,kind:"transfer",sourceKitId:kit.id,sourceVialId:vial.id,destinationPreparationId:dest.id,amountMg:amount};
  vial.remainingMg=round(vial.remainingMg-amount);
  dest.remainingMg=round(dest.remainingMg+amount);
  dest.sourceKitId=kit.id;dest.sourceVialId=vial.id;
  kit.preparationTransfers=kit.preparationTransfers||[];
  dest.transactions=dest.transactions||[];
  kit.preparationTransfers.push(entry);dest.transactions.push(entry);
  return {next,event:entry};
 }
 return {plan};
});
