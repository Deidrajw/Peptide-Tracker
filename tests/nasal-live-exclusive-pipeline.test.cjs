const assert=require("node:assert/strict");
const fs=require("node:fs");
const appSource=fs.readFileSync(require("node:path").join(__dirname,"../assets/js/04-nexus.js"),"utf8");
assert.match(appSource,/const NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED = false;/,
 "Preparation writes must remain gated until LIVE acceptance");
assert.match(appSource,/const NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED = false;/,
 "Prepared-dose writes must remain independently gated");

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
 // Invalid spray overdraw and replay must not change durable state.
 const guarded=create({...adapter,initialSnapshot:durable});
 const beforeInvalid=durable,invalidWrites=writes;
 await assert.rejects(guarded.transaction(JSON.parse(durable),snapshot=>prepared.planDose(snapshot,{
  ...dose,id:"OVERDRAW",doseId:"OVERDRAW-LOG",sprays:1000
 })),/Insufficient|exceed|available|balance|stock/i);
 assert.equal(durable,beforeInvalid,"Overdraw must not change physical or prepared stock");
 assert.equal(writes,invalidWrites,"Overdraw must not write");
 const replay=create({...adapter,initialSnapshot:durable});
 await assert.rejects(replay.transaction(JSON.parse(durable),snapshot=>prepared.planDose(snapshot,dose)),
  /Duplicate|already|exists/i);
 assert.equal(writes,invalidWrites,"Duplicate dose must not write");
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
 // Retrospective LIVE-planner safety: known prior use must debit only the prepared
 // bottle, and unknown prior use must never become verified available stock.
 const retrospectiveSource=()=>({
  supplies:[{id:"RET-K",name:"Fictional Retrospective",activeKit:true,isBlend:false,
   vials:[{id:"RET-V",status:"open",remainingMg:5,expectedMg:5,intendedUse:null}]}],
  formulationStocks:[],preparations:[],peptides:{},customPeptides:{}
 });
 const retroInput={id:"RET-T",destinationContainerId:"RET-B",sourceKitId:"RET-K",
  sourceVialId:"RET-V",amountMg:5,bacMl:1,salineMl:9,volumeMl:10,
  mlPerSpray:.1,confirmed:true,adoptUnlabelled:true,
  occurredAt:"2026-10-29T12:00:00",recordedAt:"2026-11-02T20:00:00",
  priorUseStatus:"known",priorSprays:4};
 for(const prior of ["known","unknown"]){
  let retroDurable=JSON.stringify(retrospectiveSource()),retroWrites=0;
  const retroAdapter={read:()=>retroDurable,write:s=>{retroDurable=s;retroWrites++},lock};
  const retroWriter=create({...retroAdapter,initialSnapshot:retroDurable});
  const outcome=await retroWriter.transaction(JSON.parse(retroDurable),s=>
   bridge.planRecordedNasal(s,{...retroInput,priorUseStatus:prior,
    ...(prior==="unknown"?{priorSprays:undefined}:{})}));
  const bottle=outcome.next.formulationStocks[0];
  assert.equal(retroWrites,1,"Retrospective transfer must be a single durable write");
  assert.equal(outcome.next.supplies[0].vials[0].remainingMg,0);
  assert.equal(bottle.sourceVialId,"RET-V");
  assert.equal(bottle.balanceStatus,prior==="known"?"verified":"unverified");
  assert.equal(bottle.remainingMg,prior==="known"?4.8:5);
  assert.equal(bottle.recordedPreparation.occurredAt,retroInput.occurredAt);
  assert.deepEqual(outcome.next.peptides,{},"Do not invent historical dose records");
  const stale=create({...retroAdapter,initialSnapshot:JSON.stringify(retrospectiveSource())});
  await assert.rejects(stale.transaction(retrospectiveSource(),s=>
   bridge.planRecordedNasal(s,{...retroInput,id:"RET-REPLAY",
    destinationContainerId:"RET-REPLAY-B"})),/changed|blocked/);
  assert.equal(retroWrites,1,"Stale retrospective replay must not persist");
 }
 // A sealed source opening and stock transfer must share exactly one
 // exclusively verified persistence operation, without mutating the input.
 const sealedStart=()=>({
  supplies:[{id:"SEALED-K",name:"Fictional Sealed",activeKit:false,isBlend:false,
   vialMg:5,openedVials:0,vials:[{id:"SEALED-V",status:"sealed",expectedMg:5}]}],
  formulationStocks:[],preparations:[],peptides:{},customPeptides:{}
 });
 let sealedDurable=JSON.stringify(sealedStart()),sealedWrites=0;
 const sealedWriter=create({
  read:()=>sealedDurable,write:s=>{sealedDurable=s;sealedWrites++},lock,
  initialSnapshot:sealedDurable
 });
 const sealedInput={id:"SEALED-TRANSFER",destinationContainerId:"SEALED-BOTTLE",
  sourceKitId:"SEALED-K",sourceVialId:"SEALED-V",amountMg:5,
  bacMl:1,salineMl:9,volumeMl:10,mlPerSpray:.1,openSealed:true,
  confirmed:true,priorUseStatus:"none",date:"2026-11-02T10:00:00"};
 const beforeSealed=sealedStart();
 const sealedResult=await sealedWriter.transaction(beforeSealed,s=>
  bridge.planRecordedNasalLocked(s,sealedInput));
 assert.equal(sealedWrites,1,"Opening and transfer must be a single write");
 assert.equal(beforeSealed.supplies[0].vials[0].status,"sealed",
  "Planner cannot mutate input source");
 assert.equal(sealedResult.next.supplies[0].vials[0].status,"open");
 assert.equal(sealedResult.next.supplies[0].vials[0].remainingMg,0);
 assert.equal(sealedResult.next.supplies[0].vials[0].id,"SEALED-V");
 assert.equal(sealedResult.next.supplies[0].openedVials,1);
 assert.equal(sealedResult.next.formulationStocks[0].sourceVialId,"SEALED-V");
 assert.equal(sealedResult.next.formulationStocks[0].remainingMg,5);
 assert.deepEqual(sealedResult.next.peptides,{});
 const previousSaved=sealedDurable;
 const invalidSealed=create({read:()=>sealedDurable,write:s=>{
  sealedDurable=s;sealedWrites++;
 },lock,initialSnapshot:sealedDurable});
 await assert.rejects(invalidSealed.transaction(JSON.parse(sealedDurable),s=>
  bridge.planRecordedNasalLocked(s,{...sealedInput,id:"REPEAT",
   destinationContainerId:"REPEAT-BOTTLE"})),/sealed|Source/i);
 assert.equal(sealedDurable,previousSaved,"Duplicate source opening must not change stock");
 assert.equal(sealedWrites,1);
 assert.ok(attempts>=6,"Exclusive lock must mediate every attempted transaction");
 console.log("PASS: exact source nasal prep -> prepared spray -> undo; stale tab, validation, readback and no double debit");
})().catch(e=>{console.error(e);process.exitCode=1});
