const assert=require("node:assert/strict");
const {review,prepare,applyToClone}=require("../assets/js/nexus-historical-reconciliation.js");
function fixture(){return {
  supplies:[{id:101,name:"Deadpool",isBlend:true,blendInventoryMode:"ledger",
    vials:[{id:501,status:"empty",remainingMg:0,finishedAt:null},{id:502,status:"sealed",remainingMg:30}],
    doseLog:[{id:801,vialId:501,totalMgDrawn:5,date:"2026-10-01"},
      {id:802,vialId:501,totalMgDrawn:4,date:"2026-10-02"}]}],
  peptides:{"Deadpool":{doses:[
    {id:901,date:"2026-10-03",dose:"3",blendSource:101,allocations:[{kitId:101,vialId:null,amount:0}]},
    {id:902,date:"2026-10-04",dose:"2",blendSource:101,allocations:[{kitId:101,vialId:501,amount:2,ledgerId:802}]}
  ]}}};}
let count=0;function t(name,fn){fn();console.log("PASS "+name);count++;}
t("read only never mutates input and preserves unknown physical amount",()=>{
  const f=fixture(),before=JSON.stringify(f),r=review(f,101);
  assert.equal(JSON.stringify(f),before);
  assert.equal(r.ledgerTotalMg,9);assert.equal(r.physicalRemainingMg,null);
  assert.deepEqual(r.unresolved,[901]);assert.equal(r.vials[0].finishedAt,null);
});
t("plan requires explicit per-dose evidence and does not add missing doses to ledger",()=>{
  const f=fixture(),p=prepare(f,{kitId:101,decisions:[{doseId:901,outcome:"verified",vialId:501,evidence:"user-firsthand",note:"Source independently documented"}]});
  assert.equal(p.stockChange,false);assert.equal(p.changes.length,1);
  assert.equal(f.supplies[0].doseLog.length,2);
});
t("commit requires verified backup and typed confirmation",()=>{
  const f=fixture(),p=prepare(f,{kitId:101,decisions:[{doseId:901,outcome:"unresolved"}]});
  assert.throws(()=>applyToClone(f,p,{confirmed:true,backupVerified:false,confirmationText:"REVIEW HISTORICAL RECORDS"}),/backup/);
  assert.throws(()=>applyToClone(f,p,{confirmed:true,backupVerified:true,confirmationText:"YES"}),/confirmation/);
});
t("explicit confirmed review annotates only a clone, preserving canonical dose and stock",()=>{
  const f=fixture(),before=JSON.stringify(f),p=prepare(f,{kitId:101,decisions:[{doseId:901,outcome:"verified",vialId:501,evidence:"physical-log",note:"Compared against physical source log"}]});
  const updated=applyToClone(f,p,{confirmed:true,backupVerified:true,confirmationText:"REVIEW HISTORICAL RECORDS"});
  assert.equal(JSON.stringify(f),before);assert.equal(JSON.stringify(updated.supplies),JSON.stringify(f.supplies));
  assert.equal(updated.peptides.Deadpool.doses[0].historicalSourceReview.vialId,501);
  assert.equal(updated.peptides.Deadpool.doses[0].allocations[0].amount,0);
});
t("rejects stale source snapshot",()=>{
  const f=fixture(),p=prepare(f,{kitId:101,decisions:[{doseId:901,outcome:"unresolved"}]});
  f.peptides.Deadpool.doses[0].notes="changed in another tab";
  assert.throws(()=>applyToClone(f,p,{confirmed:true,backupVerified:true,confirmationText:"REVIEW HISTORICAL RECORDS"}),/Stale/);
});
t("rejects wrong kit, duplicate and unknown dose, unsupported outcome and unknown vial",()=>{
  const f=fixture(),good={doseId:901,outcome:"verified",vialId:501,evidence:"physical-log",note:"Verified from physical log"};
  assert.throws(()=>review(f,999),/exact/);
  assert.throws(()=>prepare(f,{kitId:101,decisions:[good,good]}),/Duplicate/);
  assert.throws(()=>prepare(f,{kitId:101,decisions:[{...good,doseId:999}]}),/not attributed/);
  assert.throws(()=>prepare(f,{kitId:101,decisions:[{...good,vialId:999}]}),/Exact vial/);
  assert.throws(()=>prepare(f,{kitId:101,decisions:[{...good,outcome:"magic"}]}),/Invalid/);
  assert.throws(()=>prepare(f,{kitId:101,decisions:[{...good,doseId:902}]}),/Already exact/);
});
t("physical observation never sets an unsupported balance",()=>{
  const f=fixture();
  assert.throws(()=>prepare(f,{kitId:101,decisions:[{doseId:901,outcome:"unresolved"}],
    physicalObservation:{vialId:501,state:"present",remainingMg:17}}),/Measured mg/);
  const p=prepare(f,{kitId:101,decisions:[{doseId:901,outcome:"unresolved"}],
    physicalObservation:{vialId:501,state:"unknown",note:"Status not confirmed"}});
  const u=applyToClone(f,p,{confirmed:true,backupVerified:true,confirmationText:"REVIEW HISTORICAL RECORDS"});
  assert.equal(u.supplies[0].vials[0].status,"empty");
  assert.equal(u.supplies[0].historicalVialObservations[0].state,"unknown");
});
t("duplicate physical ledger ids fail closed",()=>{
  const f=fixture();f.supplies[0].doseLog.push({...f.supplies[0].doseLog[0]});
  assert.throws(()=>review(f,101),/Duplicate/);
});
console.log("PASS "+count+" isolated reconciliation assertions");
