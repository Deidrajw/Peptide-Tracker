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
 // Persist a complete validated state in exactly one storage write.
 // Detect stale tabs / mutated storage before attempting the write.
 // No in-memory state swap is performed here: the caller swaps only on success.
 function commit(current,tx,{read,write}){
  if(typeof read!=="function"||typeof write!=="function")fail("Storage adapter required");
  const observed=read();
  if(typeof observed!=="string"||!observed.length)fail("No saved inventory snapshot");
  let stored;
  try{stored=JSON.parse(observed)}catch{fail("Saved inventory unreadable")}
  if(JSON.stringify(stored)!==JSON.stringify(current))fail("Saved inventory changed; reload before transfer");
  const planned=plan(current,tx);
  const next=planned.next;
  const source=current.supplies.find(k=>String(k.id)===String(tx.sourceKitId));
  const updated=next.supplies.find(k=>String(k.id)===String(tx.sourceKitId));
  const beforeTotal=source.vials.reduce((sum,v)=>sum+(Number.isFinite(v.remainingMg)?v.remainingMg:NaN),0);
  const afterTotal=updated.vials.reduce((sum,v)=>sum+(Number.isFinite(v.remainingMg)?v.remainingMg:NaN),0);
  if(!Number.isFinite(beforeTotal)||!Number.isFinite(afterTotal)||
     Math.abs((beforeTotal-afterTotal)-planned.event.amountMg)>1e-6)fail("Canonical inventory debit mismatch");
  const beforeDestination=current.preparations.find(p=>p.id===tx.destinationPreparationId);
  const afterDestination=next.preparations.find(p=>p.id===tx.destinationPreparationId);
  if(Math.abs((afterDestination.remainingMg-beforeDestination.remainingMg)-planned.event.amountMg)>1e-6)fail("Destination credit mismatch");
  // A second pre-write check closes ordinary stale-tab windows; callers must
  // still prohibit concurrent writers while this synchronous operation executes.
  if(read()!==observed)fail("Saved inventory changed during transfer");
  const serialized=JSON.stringify(next);
  write(serialized); // throws on quota/security failures; no state mutation
  if(read()!==serialized)fail("Transfer save verification failed; reload inventory before retry");
  return planned;
 }
 return {plan,commit};
});
