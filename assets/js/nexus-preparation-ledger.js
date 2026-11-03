/* Nexus preparation ledger v1 — pure, isolated model; not wired to live inventory.
 * Quantities in canonical mg, with explicit physical container IDs.
 * No conversion of mg to sprays without product-specific mgPerSpray.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.NexusPreparationLedger=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  const METHODS=["SubQ","IM","IV","Oral","Nasal","Topical"];
  const round=n=>Math.round((n+Number.EPSILON)*1e6)/1e6;
  function assert(condition,message){if(!condition)throw new Error(message);}
  function createPreparation({id,compound,method,containerType,quantityMg,sourceKitId=null,sourceVialId=null,mgPerSpray=null}){
    assert(typeof id==="string"&&id.trim(),"Preparation ID required");
    assert(typeof compound==="string"&&compound.trim(),"Compound required");
    assert(METHODS.includes(method),"Unsupported administration method");
    assert(["vial","nasal-bottle","other"].includes(containerType),"Invalid container type");
    assert(method!=="Nasal"||containerType==="nasal-bottle","Nasal method requires nasal bottle");
    assert(method==="Nasal"||containerType!=="nasal-bottle","Nasal bottle must use nasal method");
    assert(Number.isFinite(quantityMg)&&quantityMg>=0,"Invalid starting quantity");
    assert(mgPerSpray==null||(method==="Nasal"&&Number.isFinite(mgPerSpray)&&mgPerSpray>0),"Invalid spray conversion");
    return {id,compound,method,containerType,remainingMg:round(quantityMg),sourceKitId,sourceVialId,mgPerSpray,transactions:[]};
  }
  function transact(preparations,{id,kind,fromId=null,toId=null,preparationId=null,method=null,amountMg=null,sprays=null}){
    assert(Array.isArray(preparations),"Preparations required");
    assert(typeof id==="string"&&id.trim(),"Transaction ID required");
    assert(!preparations.some(p=>(p.transactions||[]).some(t=>t.id===id)),"Duplicate transaction ID");
    const byId=x=>preparations.find(p=>p.id===x);
    const from=byId(fromId),to=byId(toId),target=byId(preparationId);
    let amount=amountMg;
    if(kind==="dose"&&sprays!=null){
      assert(target&&target.method==="Nasal"&&Number.isFinite(target.mgPerSpray)&&target.mgPerSpray>0,"No verified nasal spray conversion");
      assert(Number.isInteger(sprays)&&sprays>0,"Invalid spray count");
      assert(amountMg==null,"Supply either sprays or mg, not both");
      amount=round(sprays*target.mgPerSpray);
    }
    assert(Number.isFinite(amount)&&amount>0,"Positive mg amount required");
    if(kind==="transfer"){
      assert(from&&to&&from!==to,"Distinct source and destination required");
      assert(from.compound===to.compound,"Cross-compound transfer forbidden");
      assert(to.method==="Nasal"&&to.containerType==="nasal-bottle","Destination must be nasal preparation");
      assert(from.containerType==="vial","Transfer source must be a vial");
      assert(from.remainingMg+1e-7>=amount,"Insufficient source stock");
      // Validate first, then atomically write both sides. Never count transfer as a dose.
      from.remainingMg=round(from.remainingMg-amount);to.remainingMg=round(to.remainingMg+amount);
      const event={id,kind,amountMg:amount,fromId,toId};
      from.transactions.push(event);to.transactions.push(event);
      return event;
    }
    assert(kind==="dose","Unsupported transaction kind");
    assert(target&&METHODS.includes(method)&&target.method===method,"Dose method/source mismatch");
    assert(target.remainingMg+1e-7>=amount,"Insufficient source stock");
    target.remainingMg=round(target.remainingMg-amount);
    const event={id,kind,amountMg:amount,preparationId,method,...(sprays!=null?{sprays}:{})};
    target.transactions.push(event);return event;
  }
  return {METHODS,createPreparation,transact};
});
