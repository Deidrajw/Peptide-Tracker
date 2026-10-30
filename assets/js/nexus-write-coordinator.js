/* Nexus PR124 shared write coordinator.
 * A single synchronous guarded writer for legacy calls, and one asynchronous
 * exclusive writer for inventory operations. This intentionally does NOT
 * claim that legacy synchronous calls hold a cross-tab Web Lock; the live
 * prepared administration feature remains disabled until every writer is
 * converted to the exclusive contract.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.NexusWriteCoordinator=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 const fail=message=>{throw Error(message)};
 const clone=value=>JSON.parse(JSON.stringify(value));
 function create({read,write,remove,lock,lockName="nexus:state-writer",initialSnapshot=null}={}){
  if(typeof read!=="function"||typeof write!=="function")fail("Storage adapter required");
  if(typeof lockName!=="string"||!lockName)fail("Lock name required");
  let last=initialSnapshot, inFlight=false, blocked=false;
  const status=()=>({inFlight,blocked});
  const expected=()=>last;
  function markConflict(){blocked=true;fail("Saved data changed or a prior write was uncertain; reload before saving")}
  function compare(){
   if(blocked)fail("Writes blocked until reloaded");
   const observed=read();
   if(observed!==last)markConflict();
   return observed;
  }
  function persist(next,{beforeWrite}={}){
   const observed=compare();
   if(typeof beforeWrite==="function")beforeWrite(observed);
   if(read()!==observed)markConflict();
   const serialized=JSON.stringify(next);
   if(serialized===undefined)fail("Serializable state required");
   try {write(serialized)}catch(e){blocked=true;throw e}
   // Do not advertise success when readback differs; never change a
   // caller's state reference until the caller receives a result.
   let verified;
   try{verified=read()}catch(e){blocked=true;throw e}
   if(verified!==serialized){blocked=true;fail("Storage readback mismatch; reload before retry")}
   last=serialized;
   return {serialized};
  }
  function saveLegacy(next){
   if(inFlight)fail("Inventory transaction running; save blocked");
   return persist(next);
  }
  function removeLegacy(){
   if(inFlight)fail("Inventory transaction running; erase blocked");
   if(typeof remove!=="function")fail("Removal adapter unavailable");
   const observed=compare();
   if(read()!==observed)markConflict();
   try{remove()}catch(e){blocked=true;throw e}
   let after;
   try{after=read()}catch(e){blocked=true;throw e}
   if(after!==null){blocked=true;fail("Removal readback mismatch; reload before retry")}
   last=null;
   return {removed:true};
  }
  async function transaction(current,transform){
   if(typeof transform!=="function")fail("Transaction transform required");
   if(typeof lock!=="function")fail("Exclusive cross-tab lock required");
   if(inFlight)fail("Inventory operation already pending");
   inFlight=true;
   try{
    return await lock(lockName,async()=>{
     const observed=compare();
     // The current in-memory snapshot must be identical to durable state
     // before a destructive stock transaction; never merge silently.
     if(observed!==JSON.stringify(current))markConflict();
     const proposed=await transform(clone(current));
     if(!proposed||!proposed.next||typeof proposed.next!=="object")fail("Transaction did not return a complete state");
     if(read()!==observed)markConflict();
     persist(proposed.next);
     return proposed;
    });
   }finally{inFlight=false}
  }
  return {saveLegacy,removeLegacy,transaction,expected,status};
 }
 return {create};
});
