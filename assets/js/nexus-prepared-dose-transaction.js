/* PR124: prepared nasal administration transactions.
 * No DOM, localStorage or side effects in plan/undo. This module is NOT attached
 * to ordinary Log Dose; legacy saveState writers are not coordinated yet.
 * Call commit only inside a shared exclusive writer after migration to a common
 * write coordinator. Never treat linkedPreparationPlans as stock.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.NexusPreparedDoseTransaction=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const fail=msg=>{throw Error(msg)};
  const finite=x=>typeof x==="number"&&Number.isFinite(x);
  const positive=x=>finite(x)&&x>0;
  const round=x=>Math.round((x+Number.EPSILON)*1e6)/1e6;
  const same=(a,b)=>String(a)===String(b);
  const clone=x=>JSON.parse(JSON.stringify(x));
  const EPS=1e-7;
  function entryFor(snapshot,name){
    const builtin=snapshot.peptides?.[name],custom=snapshot.customPeptides?.[name];
    if(builtin&&custom)fail("Ambiguous compound history");
    const p=builtin||custom;
    if(!p||!Array.isArray(p.doses))fail("Existing compound dose history required");
    return p;
  }
  function uniqueTx(snapshot,transactionId,doseId){
    if(typeof transactionId!=="string"||!transactionId.trim())fail("Unique transaction ID required");
    if(typeof doseId!=="string"||!doseId.trim())fail("Unique dose ID required");
    for(const stock of [...(snapshot.formulationStocks||[]),...(snapshot.preparations||[])]){
      if((stock.transactions||[]).some(t=>t.id===transactionId||same(t.doseId,doseId)))fail("Duplicate source transaction or dose");
    }
    for(const p of [...Object.values(snapshot.peptides||{}),...Object.values(snapshot.customPeptides||{})]){
      if((p.doses||[]).some(d=>same(d.id,doseId)||d.preparedTransactionId===transactionId))fail("Duplicate dose ID");
    }
  }
  function container(snapshot,compound,sourceId){
    if(!Array.isArray(snapshot.formulationStocks))fail("Prepared formulation stock unavailable");
    const matches=snapshot.formulationStocks.filter(c=>same(c.id,sourceId));
    if(matches.length!==1)fail("Explicit unique prepared source required");
    const s=matches[0];
    if(s.compound!==compound||s.containerType!=="nasal-bottle"||s.method!=="Nasal")fail("Prepared container compound or route mismatch");
    if(!positive(s.mgPerSpray)||!positive(s.mlPerSpray))fail("Verified bottle-specific spray and delivery conversion required");
    if(!finite(s.remainingMg)||s.remainingMg<0||!finite(s.remainingMl)||s.remainingMl<0)fail("Invalid prepared stock balances");
    if(!Array.isArray(s.transactions))fail("Source transaction history unavailable");
    return s;
  }
  function planDose(snapshot,tx){
    if(!snapshot||typeof snapshot!=="object"||!tx)fail("Snapshot and transaction required");
    if(tx.method!=="Nasal"||tx.trackingMode!=="backed")fail("Prepared transaction requires nasal inventory-backed use");
    if(typeof tx.compound!=="string"||!tx.compound.trim())fail("Compound required");
    if(!Number.isSafeInteger(tx.sprays)||tx.sprays<=0)fail("Positive whole sprays required");
    if(!["mg","mcg"].includes(tx.nativeUnit))fail("Explicit compound-native mass unit required");
    if(!tx.date||!Number.isFinite(Date.parse(tx.date)))fail("Valid date required");
    uniqueTx(snapshot,tx.id,tx.doseId);
    // Reject a planned-only source or unrelated physical vial before any write.
    if(tx.sourceKind!=="formulation-container")fail("Physical vial or preparation plan is not prepared nasal stock");
    const next=clone(snapshot);
    const s=container(next,tx.compound,tx.sourceId);
    const history=entryFor(next,tx.compound);
    const original=container(snapshot,tx.compound,tx.sourceId);
    const mg=round(tx.sprays*s.mgPerSpray),ml=round(tx.sprays*s.mlPerSpray);
    if(!positive(mg)||!positive(ml))fail("Invalid dose conversion");
    if(mg>s.remainingMg+EPS||ml>s.remainingMl+EPS)fail("Insufficient prepared stock");
    const afterMg=round(s.remainingMg-mg),afterMl=round(s.remainingMl-ml);
    if(afterMg<0||afterMl<0)fail("Negative stock balance forbidden");
    const nativeDose=tx.nativeUnit==="mg"?mg:round(mg*1000);
    const dose={
      id:tx.doseId,date:tx.date,dose:String(nativeDose),method:"Nasal",
      trackingMode:"backed",sourceKind:"formulation-container",
      sourceContainerId:s.id,preparedTransactionId:tx.id,
      amountMg:mg,volumeMl:ml,sprayCount:tx.sprays,
      enteredDose:String(tx.sprays),enteredUnit:"sprays",
      ...(typeof tx.notes==="string"?{notes:tx.notes}:{}),
      ...(typeof tx.site==="string"?{site:tx.site}:{})
    };
    const event={
      id:tx.id,kind:"administer-prepared-nasal",doseId:tx.doseId,
      compound:tx.compound,method:"Nasal",sourceKind:"formulation-container",
      sourceContainerId:s.id,sprays:tx.sprays,amountMg:mg,volumeMl:ml,
      mgPerSpray:s.mgPerSpray,mlPerSpray:s.mlPerSpray,
      nativeUnit:tx.nativeUnit,date:tx.date,
      doseSnapshot:clone(dose) // prevent undo from silently discarding subsequent edits/reactions
    };
    s.remainingMg=afterMg;s.remainingMl=afterMl;s.transactions.push(event);
    history.doses.push(dose);
    // No state.supplies mutation. Debit only the explicit prepared bottle once.
    if(JSON.stringify(snapshot.supplies)!==JSON.stringify(next.supplies))fail("Canonical vial stock unexpectedly changed");
    if(original.remainingMg-s.remainingMg!==mg && Math.abs((original.remainingMg-s.remainingMg)-mg)>1e-6)fail("Prepared mass reconciliation failed");
    if(Math.abs((original.remainingMl-s.remainingMl)-ml)>1e-6)fail("Prepared volume reconciliation failed");
    return {next,event,dose};
  }
  function reverseDose(snapshot,{transactionId,reversalId,compound,doseId,sourceId}={}){
    if(!snapshot||!Array.isArray(snapshot.formulationStocks))fail("Prepared stock unavailable");
    if(typeof reversalId!=="string"||!reversalId.trim())fail("Reversal transaction ID required");
    const next=clone(snapshot);
    const s=next.formulationStocks.find(c=>same(c.id,sourceId));
    if(!s||s.compound!==compound||s.containerType!=="nasal-bottle")fail("Original prepared source missing");
    const ledger=s.transactions||[];
    if(ledger.some(x=>x.id===reversalId))fail("Reversal ID already used");
    const original=ledger.filter(x=>x.id===transactionId&&x.kind==="administer-prepared-nasal"&&same(x.doseId,doseId));
    if(original.length!==1)fail("Original administration transaction missing");
    const e=original[0];
    if(ledger.some(x=>x.reverses===e.id))fail("Prepared administration already reversed");
    if(!positive(e.amountMg)||!positive(e.volumeMl)||e.compound!==compound||!same(e.sourceContainerId,sourceId))fail("Invalid original dose ledger");
    const history=entryFor(next,compound);
    const matches=history.doses.filter(d=>same(d.id,doseId)&&d.preparedTransactionId===transactionId&&same(d.sourceContainerId,sourceId));
    if(matches.length!==1)fail("Exact historical dose mismatch; cannot reverse");
    if(!e.doseSnapshot||JSON.stringify(matches[0])!==JSON.stringify(e.doseSnapshot))
      fail("Dose changed since administration; review its edits and reactions before reversing");
    if(!finite(s.remainingMg)||!finite(s.remainingMl)||s.remainingMg<0||s.remainingMl<0)fail("Invalid stock before reversal");
    s.remainingMg=round(s.remainingMg+e.amountMg);
    s.remainingMl=round(s.remainingMl+e.volumeMl);
    const inverse={id:reversalId,kind:"reverse-prepared-nasal",reverses:e.id,doseId,sourceContainerId:s.id,amountMg:e.amountMg,volumeMl:e.volumeMl};
    ledger.push(inverse);
    history.doses=history.doses.filter(d=>!same(d.id,doseId));
    if(JSON.stringify(snapshot.supplies)!==JSON.stringify(next.supplies))fail("Canonical vial stock unexpectedly changed");
    return {next,event:inverse};
  }
  function commit(snapshot,operation,adapter){
    if(!adapter||typeof adapter.read!=="function"||typeof adapter.write!=="function")fail("Storage adapter required");
    const observed=adapter.read();
    if(typeof observed!=="string"||!observed.length)fail("No saved snapshot");
    let persisted;
    try{persisted=JSON.parse(observed)}catch{fail("Unreadable saved state")}
    if(JSON.stringify(persisted)!==JSON.stringify(snapshot))fail("Stale saved state");
    const result=operation.type==="dose"?planDose(snapshot,operation.tx):
      operation.type==="reverse"?reverseDose(snapshot,operation.tx):fail("Unsupported operation");
    if(adapter.read()!==observed)fail("Concurrent state change detected");
    const serialized=JSON.stringify(result.next);
    adapter.write(serialized);
    if(adapter.read()!==serialized){
      // A malformed or failed write is unsafe to claim successful; never swap
      // in-memory state. Caller must reload/reconcile before further changes.
      fail("Prepared transaction readback failed; reload state");
    }
    return result;
  }
  return {planDose,reverseDose,commit};
});
