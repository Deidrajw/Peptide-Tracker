/* Additive formulation inventory. Never reads or mutates legacy supplies/vials.
 * No dose or transfer operations are permitted through this module.
 */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.NexusFormulationStock=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
 const fail=m=>{throw Error(m)};
 const finite=n=>typeof n==="number"&&Number.isFinite(n);
 function create(input){
  if(!input||typeof input.id!=="string"||!input.id.trim())fail("Container ID required");
  if(typeof input.compound!=="string"||!input.compound.trim())fail("Compound required");
  const type=input.containerType,method=input.method;
  if(!["capsule-bottle","nasal-bottle","raw-powder","topical-container"].includes(type))fail("Unsupported container");
  if((type==="capsule-bottle"&&method!=="Oral")||(type==="nasal-bottle"&&method!=="Nasal")||(type==="raw-powder"&&method!=="Unassigned")||(type==="topical-container"&&method!=="Topical"))fail("Container/method mismatch");
  const entry={id:input.id,compound:input.compound.trim(),containerType:type,method,transactions:[]};
  if(type==="capsule-bottle"){
   if(!Number.isSafeInteger(input.count)||input.count<0)fail("Invalid capsule count");
   if(!finite(input.mgPerCapsule)||input.mgPerCapsule<=0)fail("Positive mg per capsule required");
   entry.remainingCount=input.count;entry.mgPerCapsule=input.mgPerCapsule;
  } else if(type==="raw-powder"){
   if(!finite(input.quantityMg)||input.quantityMg<0)fail("Invalid raw powder mass");
   entry.remainingMg=input.quantityMg;
  } else if(type==="topical-container"){
   if(!finite(input.volumeMl)||input.volumeMl<0)fail("Invalid topical volume");
   entry.remainingMl=input.volumeMl;
  } else {
   if(!finite(input.volumeMl)||input.volumeMl<0)fail("Invalid bottle volume");
   if(!finite(input.quantityMg)||input.quantityMg<0)fail("Invalid nasal quantity");
   entry.remainingMl=input.volumeMl;entry.remainingMg=input.quantityMg;
   entry.mgPerSpray=null; // Never infer a spray conversion from volume.
  }
  return entry;
 }
 function add(snapshot,input){
  if(!snapshot||!Array.isArray(snapshot.supplies))fail("Inventory state unavailable");
  const stock=create(input);
  const existing=snapshot.formulationStocks||[];
  if(!Array.isArray(existing))fail("Formulation inventory malformed");
  if(existing.some(x=>String(x.id)===stock.id)||(snapshot.supplies||[]).some(x=>String(x.id)===stock.id))fail("Duplicate container ID");
  const next=JSON.parse(JSON.stringify(snapshot));next.formulationStocks=[...(next.formulationStocks||[]),stock];
  return {next,stock};
 }
 function commitAdd(current,input,{read,write}){
  if(typeof read!=="function"||typeof write!=="function")fail("Storage adapter required");
  const baseline=read();
  if(typeof baseline!=="string"||!baseline)fail("No saved inventory snapshot");
  let parsed;try{parsed=JSON.parse(baseline)}catch{fail("Unreadable inventory snapshot")}
  if(JSON.stringify(parsed)!==JSON.stringify(current))fail("Inventory changed; reload before editing");
  const result=add(current,input),serialized=JSON.stringify(result.next);
  if(read()!==baseline)fail("Inventory changed during edit");
  write(serialized);
  if(read()!==serialized)fail("Inventory save verification failed");
  return result;
 }
 function edit(snapshot,{id,remainingCount,remainingMl,remainingMg,transactionId}){
  if(!snapshot||!Array.isArray(snapshot.formulationStocks))fail("Formulation inventory unavailable");
  if(typeof transactionId!=="string"||!transactionId.trim())fail("Adjustment ID required");
  if(snapshot.formulationStocks.some(x=>(x.transactions||[]).some(t=>t.id===transactionId)))fail("Duplicate adjustment ID");
  const next=JSON.parse(JSON.stringify(snapshot));
  const item=next.formulationStocks.find(x=>String(x.id)===String(id));
  if(!item)fail("Unknown container");
  let before,after;
  if(item.containerType==="capsule-bottle"){
   if(!Number.isSafeInteger(remainingCount)||remainingCount<0)fail("Invalid capsule balance");
   before={remainingCount:item.remainingCount};
   item.remainingCount=remainingCount;after={remainingCount};
  }else if(item.containerType==="raw-powder"){
   if(!finite(remainingMg)||remainingMg<0)fail("Invalid raw powder balance");
   before={remainingMg:item.remainingMg};item.remainingMg=remainingMg;after={remainingMg};
  }else if(item.containerType==="topical-container"){
   if(!finite(remainingMl)||remainingMl<0)fail("Invalid topical balance");
   before={remainingMl:item.remainingMl};item.remainingMl=remainingMl;after={remainingMl};
  }else if(item.containerType==="nasal-bottle"){
   if(!finite(remainingMl)||remainingMl<0||!finite(remainingMg)||remainingMg<0)fail("Invalid nasal balance");
   before={remainingMl:item.remainingMl,remainingMg:item.remainingMg};
   item.remainingMl=remainingMl;item.remainingMg=remainingMg;after={remainingMl,remainingMg};
  }else fail("Unsupported container");
  const entry={id:transactionId,kind:"inventory-adjustment",before,after};
  item.transactions=Array.isArray(item.transactions)?item.transactions:[];
  item.transactions.push(entry);
  return {next,stock:item,event:entry};
 }
 function commitEdit(current,input,adapter){
  if(!adapter||typeof adapter.read!=="function"||typeof adapter.write!=="function")fail("Storage adapter required");
  const baseline=adapter.read();
  if(typeof baseline!=="string"||!baseline)fail("No saved inventory snapshot");
  let parsed;try{parsed=JSON.parse(baseline)}catch{fail("Unreadable inventory snapshot")}
  if(JSON.stringify(parsed)!==JSON.stringify(current))fail("Inventory changed; reload before editing");
  const result=edit(current,input),serialized=JSON.stringify(result.next);
  if(adapter.read()!==baseline)fail("Inventory changed during edit");
  adapter.write(serialized);
  if(adapter.read()!==serialized)fail("Inventory save verification failed");
  return result;
 }

 // Pure planners only. The UI must persist the complete result with nexusWriter().transaction.
 function planCapsuleDose(snapshot,tx){
  if(!snapshot||!Array.isArray(snapshot.formulationStocks)||!tx)fail("Complete formulation inventory required");
  if(typeof tx.id!=="string"||!tx.id.trim()||typeof tx.doseId!=="string"||!tx.doseId.trim())fail("Unique IDs required");
  if(!Number.isSafeInteger(tx.count)||tx.count<=0)fail("Positive whole capsule count required");
  if(!tx.date||!Number.isFinite(Date.parse(tx.date)))fail("Valid date required");
  if(!["mg","mcg"].includes(tx.nativeUnit)||typeof tx.compound!=="string"||!tx.compound)fail("Compound mass unit required");
  const next=JSON.parse(JSON.stringify(snapshot));
  if(next.formulationStocks.some(x=>(x.transactions||[]).some(t=>t.id===tx.id||String(t.doseId)===tx.doseId)))fail("Duplicate source transaction");
  if([...Object.values(next.peptides||{}),...Object.values(next.customPeptides||{})].some(p=>(p.doses||[]).some(d=>String(d.id)===tx.doseId)))fail("Duplicate historical dose");
  const matches=next.formulationStocks.filter(x=>String(x.id)===String(tx.sourceId));
  if(matches.length!==1)fail("Unique exact capsule source required");
  const stock=matches[0];
  if(stock.containerType!=="capsule-bottle"||stock.method!=="Oral"||stock.compound!==tx.compound)fail("Capsule source mismatch");
  if(!Number.isSafeInteger(stock.remainingCount)||stock.remainingCount<tx.count)fail("Insufficient capsule stock");
  if(!finite(stock.mgPerCapsule)||stock.mgPerCapsule<=0||!Array.isArray(stock.transactions))fail("Invalid capsule strength or ledger");
  const mg=Math.round(stock.mgPerCapsule*tx.count*1e6)/1e6;
  if(!finite(mg)||mg<=0)fail("Invalid capsule dose");
  const collection=next.peptides?.[tx.compound]?next.peptides:next.customPeptides;
  if(!collection?.[tx.compound]||!Array.isArray(collection[tx.compound].doses))fail("Compound history unavailable");
  const dose={id:tx.doseId,date:tx.date,dose:String(tx.nativeUnit==="mg"?mg:mg*1000),
   method:"Oral",trackingMode:"backed",sourceKind:"formulation-container",sourceContainerId:stock.id,
   capsuleCount:tx.count,mgPerCapsule:stock.mgPerCapsule,amountMg:mg,
   enteredDose:String(tx.count),enteredUnit:"capsules",capsuleTransactionId:tx.id,site:"",
   ...(typeof tx.notes==="string"?{notes:tx.notes}:{})};
  const event={id:tx.id,kind:"administer-capsules",compound:tx.compound,doseId:dose.id,
   sourceContainerId:stock.id,count:tx.count,mgPerCapsule:stock.mgPerCapsule,amountMg:mg,
   date:tx.date,doseSnapshot:JSON.parse(JSON.stringify(dose))};
  stock.remainingCount-=tx.count;stock.transactions.push(event);collection[tx.compound].doses.push(dose);
  if(JSON.stringify(snapshot.supplies)!==JSON.stringify(next.supplies))fail("Capsules changed vial inventory");
  return {next,event,dose};
 }
 function reverseCapsuleDose(snapshot,{sourceId,transactionId,reversalId,doseId,compound}={}){
  if(!snapshot||!Array.isArray(snapshot.formulationStocks)||typeof reversalId!=="string"||!reversalId.trim())fail("Reversal requires saved stock and ID");
  const next=JSON.parse(JSON.stringify(snapshot));
  const matches=next.formulationStocks.filter(x=>String(x.id)===String(sourceId));
  if(matches.length!==1||matches[0].containerType!=="capsule-bottle"||matches[0].compound!==compound)fail("Original capsule container missing");
  const stock=matches[0],ledger=stock.transactions||[];
  if(ledger.some(t=>t.id===reversalId||t.reverses===transactionId))fail("Duplicate or completed reversal");
  const original=ledger.filter(t=>t.id===transactionId&&t.kind==="administer-capsules"&&String(t.doseId)===String(doseId));
  if(original.length!==1)fail("Original capsule transaction missing");
  const event=original[0],collection=next.peptides?.[compound]?next.peptides:next.customPeptides,doses=collection?.[compound]?.doses;
  if(!Array.isArray(doses))fail("Dose history missing");
  const historical=doses.filter(d=>String(d.id)===String(doseId)&&d.capsuleTransactionId===transactionId&&String(d.sourceContainerId)===String(sourceId));
  if(historical.length!==1||JSON.stringify(historical[0])!==JSON.stringify(event.doseSnapshot))fail("Historical dose changed; cannot undo");
  if(!Number.isSafeInteger(stock.remainingCount)||stock.remainingCount<0||!Number.isSafeInteger(event.count)||event.count<=0)fail("Invalid capsule ledger");
  stock.remainingCount+=event.count;
  const inverse={id:reversalId,kind:"reverse-capsules",reverses:transactionId,doseId,sourceContainerId:sourceId,count:event.count};
  stock.transactions.push(inverse);
  collection[compound].doses=doses.filter(d=>String(d.id)!==String(doseId));
  if(JSON.stringify(snapshot.supplies)!==JSON.stringify(next.supplies))fail("Capsule undo changed vial inventory");
  return {next,event:inverse};
 }

 return {create,add,commitAdd,edit,commitEdit,planCapsuleDose,reverseCapsuleDose};
});
