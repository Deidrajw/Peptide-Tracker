const assert=require("node:assert/strict");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const bridge=require("../assets/js/nexus-preparation-bridge.js");
const prepared=require("../assets/js/nexus-prepared-dose-transaction.js");

// This exercises the actual atomic production planners with a shared exclusive
// coordinator. Browser-local DEMO and live state are never accessed by this test.
const initial=()=>({
 supplies:[{id:"K",name:"Fictional A",isBlend:false,vials:[
  {id:"V1",status:"open",intendedUse:"nasal-source",remainingMg:5},
  {id:"V2",status:"open",intendedUse:"Injectable",remainingMg:5}
 ]}],
 formulationStocks:[],preparations:[],peptides:{},customPeptides:{}
});
const recording={
 id:"PREP-1",destinationContainerId:"BOTTLE-1",
 sourceKitId:"K",sourceVialId:"V1",amountMg:5,
 bacMl:1,salineMl:9,volumeMl:10,mlPerSpray:.1,confirmed:true,
 date:"2026-11-01T10:00"
};
const dose={
 id:"DOSE-1",doseId:"LOG-1",compound:"Fictional A",
 sourceId:"BOTTLE-1",sourceKind:"formulation-container",trackingMode:"backed",
 method:"Nasal",sprays:4,nativeUnit:"mg",date:"2026-11-01T11:00"
};
(async()=>{
 const saved=initial();let durable=JSON.stringify(saved),writes=0;
 let tail=Promise.resolve(),attempts=0;
 const lock=(_name,action)=>{
  const task=tail.then(()=>{attempts++;return action()});
  tail=task.catch(()=>{});return task;
 };
 const adapter={read:()=>durable,write:next=>{durable=next;writes++},lock};
 const tabA=create({...adapter,initialSnapshot:durable});
 const tabB=create({...adapter,initialSnapshot:durable});
 const original=JSON.parse(durable);
 const prep=await tabA.transaction(original,s=>bridge.planRecordedNasal(s,recording));
 assert.equal(writes,1,"Preparation must be exactly one durable write");
 assert.equal(prep.next.supplies[0].vials[0].remainingMg,0);
 assert.equal(prep.next.supplies[0].vials[1].remainingMg,5);
 assert.equal(prep.next.formulationStocks[0].remainingMg,5);
 assert.equal(prep.next.formulationStocks[0].remainingMl,10);
 assert.equal(prep.next.formulationStocks[0].mgPerSpray,.05);
 assert.equal(prep.next.formulationStocks[0].sourceVialId,"V1");
 assert.equal(prep.next.formulationStocks[0].transactions.length,1);
 assert.equal(JSON.parse(durable).formulationStocks[0].id,"BOTTLE-1");
 await assert.rejects(tabB.transaction(original,s=>bridge.planRecordedNasal(s,{
  ...recording,id:"PREP-2",destinationContainerId:"BOTTLE-2"
 })),/changed|blocked/);
 assert.equal(writes,1,"Stale tab must not transfer another source amount");

 const preparedSnapshot=JSON.parse(durable);
 const tabDoseA=create({...adapter,initialSnapshot:durable});
 const tabDoseB=create({...adapter,initialSnapshot:durable});
 const both=await Promise.allSettled([
  tabDoseA.transaction(preparedSnapshot,s=>prepared.planDose(s,dose)),
  tabDoseB.transaction(preparedSnapshot,s=>prepared.planDose(s,{
   ...dose,id:"DOSE-2",doseId:"LOG-2"
  }))
 ]);
 assert.deepEqual(both.map(x=>x.status),["fulfilled","rejected"]);
 assert.equal(writes,2,"Only one of two conflicting prepared administrations saved");
 const afterDose=JSON.parse(durable);
 assert.equal(afterDose.formulationStocks[0].remainingMg,4.8);
 assert.equal(afterDose.formulationStocks[0].remainingMl,9.6);
 assert.equal(afterDose.supplies[0].vials[0].remainingMg,0,
  "Spray logging must never debit original vial twice");
 assert.equal(afterDose.customPeptides["Fictional A"].doses.length,1,
  "First spray can create history without a protocol");
 const reversal=await tabDoseA.transaction(afterDose,s=>prepared.reverseDose(s,{
  transactionId:"DOSE-1",reversalId:"UNDO-1",compound:"Fictional A",
  sourceId:"BOTTLE-1",doseId:"LOG-1"
 }));
 assert.equal(reversal.next.formulationStocks[0].remainingMg,5);
 assert.equal(reversal.next.formulationStocks[0].remainingMl,10);
 assert.equal(reversal.next.supplies[0].vials[0].remainingMg,0);
 assert.equal(reversal.next.customPeptides["Fictional A"].doses.length,0);
 assert.equal(writes,3);

 // No write or in-memory snapshot swap on failed atomic validation.
 const wrongSource=create({...adapter,initialSnapshot:durable});
 await assert.rejects(wrongSource.transaction(JSON.parse(durable),s=>
  bridge.planRecordedNasal(s,{...recording,id:"INVALID",destinationContainerId:"WRONG",
    sourceVialId:"V2"})),/nasal-labelled/);
 assert.equal(writes,3);
 const corrupted=durable;
 const bad=create({read:()=>durable,write:()=>{durable="{}"},lock,initialSnapshot:durable});
 await assert.rejects(bad.transaction(JSON.parse(durable),s=>({
  next:{...s,marker:"unverified"}
 })),/readback/);
 assert.equal(bad.status().blocked,true,"Readback mismatch must fail closed");
 durable=corrupted;
 assert.ok(attempts>=6,"Exclusive lock must mediate every attempted transaction");
 console.log("PASS: exact source nasal prep -> prepared spray -> undo; stale tab, validation, readback and no double debit");
})().catch(e=>{console.error(e);process.exitCode=1});
