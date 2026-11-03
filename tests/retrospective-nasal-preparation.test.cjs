const assert=require("node:assert/strict");
const {planRecordedNasal}=require("../assets/js/nexus-preparation-bridge.js");
const {planDose}=require("../assets/js/nexus-prepared-dose-transaction.js");
const fixture=()=>({
 supplies:[{id:"fictional-kit",name:"Fictional Compound",activeKit:true,isBlend:false,
  vials:[{id:"fictional-open-vial",status:"open",remainingMg:5,expectedMg:5,sequenceNumber:1,intendedUse:null},
  {id:"sealed-2",status:"sealed",expectedMg:5}]}],
 formulationStocks:[],preparations:[],peptides:{},customPeptides:{}
});
const prep=(extra={})=>({
 id:"fictional-transfer-1",destinationContainerId:"fictional-bottle-1",
 sourceKitId:"fictional-kit",sourceVialId:"fictional-open-vial",
 amountMg:5,bacMl:1,salineMl:4,volumeMl:5,mlPerSpray:0.1,
 confirmed:true,adoptUnlabelled:true,
 occurredAt:"2026-10-29T12:00:00",recordedAt:"2026-11-02T20:00:00",
 priorUseStatus:"known",priorSprays:3,...extra
});
const input=fixture(),original=JSON.stringify(input);
const result=planRecordedNasal(input,prep());
assert.equal(JSON.stringify(input),original,"source snapshot must remain unchanged");
const vial=result.next.supplies[0].vials[0],bottle=result.container;
assert.equal(vial.id,"fictional-open-vial");
assert.equal(vial.intendedUse,"nasal-source");
assert.equal(vial.remainingMg,0);
assert.equal(result.next.supplies[0].vials[1].status,"sealed");
assert.equal(bottle.sourceVialId,"fictional-open-vial");
assert.equal(bottle.remainingMg,4.7);
assert.equal(bottle.remainingMl,4.7);
assert.equal(bottle.recordedPreparation.occurredAt,"2026-10-29T12:00:00");
assert.equal(bottle.recordedPreparation.recordedAt,"2026-11-02T20:00:00");
assert.equal(bottle.transactions.filter(e=>e.kind==="retrospective-use-adjustment").length,1);
assert.equal(bottle.balanceStatus,"verified");
assert.deepEqual(result.next.peptides,{},"prior spray accounting must not invent doses");
assert.throws(()=>planRecordedNasal(result.next,prep()),/already|unlabelled|Unique|source/i,"duplicate transfer rejected");
const unknown=planRecordedNasal(fixture(),prep({priorUseStatus:"unknown",priorSprays:undefined}));
assert.equal(unknown.container.balanceStatus,"unverified");
assert.equal(unknown.container.remainingMg,5,"unverified nominal starting stock is not asserted available");
assert.equal(unknown.container.recordedPreparation.reconciliationStatus,"pending");
assert.throws(()=>planDose(unknown.next,{
 id:"dose-1",doseId:"history-1",compound:"Fictional Compound",method:"Nasal",
 trackingMode:"backed",sourceKind:"formulation-container",sourceId:"fictional-bottle-1",
 sprays:1,nativeUnit:"mg",date:"2026-11-02T20:00:00"
}),/balance must be reconciled/);
const noPrior=planRecordedNasal(fixture(),prep({priorUseStatus:"none",priorSprays:undefined}));
assert.equal(noPrior.container.remainingMg,5);
assert.equal(noPrior.container.balanceStatus,"verified");
for(const bad of [
 {priorUseStatus:"known",priorSprays:51},
 {priorUseStatus:"known",priorSprays:0},
 {priorUseStatus:"unknown",priorSprays:3},
 {priorUseStatus:"not-recorded"},
 {amountMg:6},
 {sourceVialId:"another-vial"},
 {occurredAt:"invalid-date"}
]){
 const snapshot=fixture(),prior=JSON.stringify(snapshot);
 assert.throws(()=>planRecordedNasal(snapshot,prep(bad)),JSON.stringify(bad));
 assert.equal(JSON.stringify(snapshot),prior,"failed scenario may not mutate source");
}
console.log("PASS: fictional retrospective transfer, historical dates, known/unknown prior use, no fabricated history, immutable source, duplicate/overspend rejection");
