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
  if(!["capsule-bottle","nasal-bottle"].includes(type))fail("Unsupported container");
  if((type==="capsule-bottle"&&method!=="Oral")||(type==="nasal-bottle"&&method!=="Nasal"))fail("Container/method mismatch");
  const entry={id:input.id,compound:input.compound.trim(),containerType:type,method,transactions:[]};
  if(type==="capsule-bottle"){
   if(!Number.isSafeInteger(input.count)||input.count<0)fail("Invalid capsule count");
   if(!finite(input.mgPerCapsule)||input.mgPerCapsule<=0)fail("Positive mg per capsule required");
   entry.remainingCount=input.count;entry.mgPerCapsule=input.mgPerCapsule;
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
 return {create,add,commitAdd,edit,commitEdit};
});
