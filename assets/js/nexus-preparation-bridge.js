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
 // Explicit, one-way transfer from a confirmed physical vial into a NEW,
 // empty nasal formulation container. Pure plan; no storage write, auto
 // preparation, recipe inference, or dose unit conversion. This does not
 // change the legacy preparations ledger or linked no-transfer plans.
 function planFormulation(snapshot,tx){
  if(!snapshot||!Array.isArray(snapshot.supplies)||!Array.isArray(snapshot.formulationStocks))
   fail("Complete physical and formulation inventory required");
  if(!tx||tx.kind!=="transfer-to-formulation"||typeof tx.id!=="string"||!tx.id.trim())
   fail("Explicit unique formulation transfer ID required");
  if(!Number.isFinite(tx.amountMg)||tx.amountMg<=0)fail("Positive measured mass required");
  const allEvents=[
    ...(snapshot.supplies||[]).flatMap(k=>k.preparationTransfers||[]),
    ...(snapshot.formulationStocks||[]).flatMap(c=>c.transactions||[]),
    ...(snapshot.preparations||[]).flatMap(p=>p.transactions||[])
  ];
  if(allEvents.some(e=>String(e.id)===tx.id))fail("Duplicate transfer ID");
  const next=JSON.parse(JSON.stringify(snapshot));
  const kits=next.supplies.filter(k=>String(k.id)===String(tx.sourceKitId));
  if(kits.length!==1||kits[0].isBlend)fail("Unique non-blend source kit required");
  const kit=kits[0];
  const vials=(kit.vials||[]).filter(v=>String(v.id)===String(tx.sourceVialId));
  if(vials.length!==1)fail("Exact physical source vial required");
  const vial=vials[0];
  if(!["open","active"].includes(vial.status)||!["Nasal","nasal-source"].includes(vial.intendedUse))
   fail("Explicitly nasal-labelled open physical vial required");
  if(!Number.isFinite(vial.remainingMg)||vial.remainingMg<0)
   fail("Canonical source balance unavailable");
  const dests=next.formulationStocks.filter(c=>String(c.id)===String(tx.destinationContainerId));
  if(dests.length!==1)fail("Unique destination container required");
  const dest=dests[0];
  if(dest.compound!==kit.name||dest.method!=="Nasal"||dest.containerType!=="nasal-bottle")
   fail("Destination formulation compound or route mismatch");
  if(!Number.isFinite(dest.remainingMg)||dest.remainingMg!==0 ||
     !Number.isFinite(dest.remainingMl)||dest.remainingMl<=0)
   fail("New empty nasal container with measured delivery volume required");
  if((dest.transactions||[]).length||dest.sourceKitId!=null||dest.sourceVialId!=null)
   fail("Destination already contains or references stock");
  if(dest.mgPerSpray!=null||dest.mlPerSpray!=null)
   fail("Do not inherit or infer a dose calibration on preparation");
  const amount=round(tx.amountMg);
  if(amount<=0||amount>vial.remainingMg+1e-7)fail("Insufficient exact source stock");
  const before=round(vial.remainingMg+dest.remainingMg);
  vial.remainingMg=round(vial.remainingMg-amount);
  dest.remainingMg=round(dest.remainingMg+amount);
  if(vial.remainingMg<0||dest.remainingMg<0)fail("Negative inventory balance forbidden");
  if(Math.abs(round(vial.remainingMg+dest.remainingMg)-before)>1e-6)
   fail("Preparation mass conservation mismatch");
  dest.sourceKitId=kit.id;dest.sourceVialId=vial.id;
  const event={
   id:tx.id,kind:"transfer-to-formulation",
   sourceKitId:kit.id,sourceVialId:vial.id,
   destinationContainerId:dest.id,compound:kit.name,amountMg:amount
  };
  kit.preparationTransfers=kit.preparationTransfers||[];
  dest.transactions=dest.transactions||[];
  kit.preparationTransfers.push(event);
  dest.transactions.push(event);
  if(JSON.stringify(snapshot.peptides)!==JSON.stringify(next.peptides)||
     JSON.stringify(snapshot.customPeptides)!==JSON.stringify(next.customPeptides))
   fail("Preparation must not alter historical dose records");
  return {next,event};
 }

 // One pure, explicit source-to-container preparation record. No save occurs
 // here; production callers must commit the entire returned snapshot under a
 // validated exclusive writer (feature remains gated while legacy writers exist).
 function planRecordedNasal(snapshot,input){
  if(!input||input.confirmed!==true||typeof input.destinationContainerId!=="string"||!input.destinationContainerId.trim())
   fail("Confirmed, uniquely identified actual preparation required");
  for(const key of ["amountMg","bacMl","salineMl","volumeMl","mlPerSpray"]){
   if(!Number.isFinite(input[key])||input[key]<0)fail("Invalid recorded preparation volume or mass");
  }
  if(input.amountMg<=0||input.volumeMl<=0||input.mlPerSpray<=0||input.mlPerSpray>input.volumeMl)
   fail("Positive source, final volume and pump calibration required");
  if(Math.abs(input.bacMl+input.salineMl-input.volumeMl)>0.000001)
   fail("Record the actual total liquid volume; components do not reconcile");
  if(!Array.isArray(snapshot?.formulationStocks)||snapshot.formulationStocks.some(c=>String(c.id)===input.destinationContainerId))
   fail("Unique new nasal container required");
  const kits=(snapshot.supplies||[]).filter(k=>String(k.id)===String(input.sourceKitId));
  if(kits.length!==1)fail("Unique physical source kit required");
  const kit=kits[0];
  const next=JSON.parse(JSON.stringify(snapshot));
  next.formulationStocks.push({
   id:input.destinationContainerId,compound:kit.name,containerType:"nasal-bottle",
   method:"Nasal",remainingMl:input.volumeMl,remainingMg:0,mgPerSpray:null,
   transactions:[]
  });
  const transferred=planFormulation(next,{
   id:input.id,kind:"transfer-to-formulation",
   sourceKitId:input.sourceKitId,sourceVialId:input.sourceVialId,
   destinationContainerId:input.destinationContainerId,amountMg:input.amountMg
  });
  const bottle=transferred.next.formulationStocks.find(c=>String(c.id)===input.destinationContainerId);
  const nominal=Math.round((input.amountMg/input.volumeMl)*input.mlPerSpray*1e6)/1e6;
  if(!Number.isFinite(nominal)||nominal<=0)fail("Nominal per-spray arithmetic invalid");
  bottle.mlPerSpray=input.mlPerSpray;bottle.mgPerSpray=nominal;
  bottle.recordedPreparation={
   bacMl:input.bacMl,salineMl:input.salineMl,finalVolumeMl:input.volumeMl,
   recordedPumpMl:input.mlPerSpray,calibrationKind:"recorded-nominal",
   sourceKitId:input.sourceKitId,sourceVialId:input.sourceVialId,
   sourceAmountMg:input.amountMg,createdAt:input.date||null
  };
  // This is an arithmetic record of user-entered values, not proof of actual
  // spray delivery, sterility, stability, compatibility or route suitability.
  return {...transferred,container:bottle};
 }

 return {plan,commit,planFormulation,planRecordedNasal};
});
