const assert=require("node:assert/strict");
const bridge=require("../assets/js/nexus-preparation-bridge.js");
const prepared=require("../assets/js/nexus-prepared-dose-transaction.js");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const fixture=()=>({
 supplies:[{id:"K1",name:"Fictional N",isBlend:false,preparationTransfers:[],vials:[
  {id:"V1",status:"open",intendedUse:"Nasal",remainingMg:28},
  {id:"V2",status:"sealed",intendedUse:"Nasal",remainingMg:10}
 ],linkedPreparationPlans:[{id:"P1",sourceKitId:"K1",sourceVialId:"V1",status:"planned-no-transfer"}]}],
 formulationStocks:[{id:"N1",compound:"Fictional N",containerType:"nasal-bottle",method:"Nasal",
   remainingMg:0,remainingMl:7,mgPerSpray:null,transactions:[]}],
 peptides:{"Fictional N":{doses:[]}},customPeptides:{},preparations:[]
});
const tx=()=>({id:"TR1",kind:"transfer-to-formulation",sourceKitId:"K1",sourceVialId:"V1",destinationContainerId:"N1",amountMg:10});
const start=fixture(),before=JSON.stringify(start);
const result=bridge.planFormulation(start,tx());
assert.equal(JSON.stringify(start),before,"Pure transfer mutated input");
assert.equal(result.next.supplies[0].vials[0].remainingMg,18);
assert.equal(result.next.supplies[0].vials[1].remainingMg,10);
assert.equal(result.next.formulationStocks[0].remainingMg,10);
assert.equal(result.next.formulationStocks[0].remainingMl,7);
assert.equal(result.next.formulationStocks[0].mgPerSpray,null);
assert.equal(result.next.formulationStocks[0].sourceKitId,"K1");
assert.equal(result.next.formulationStocks[0].sourceVialId,"V1");
assert.equal(result.next.supplies[0].preparationTransfers[0].id,"TR1");
assert.equal(result.next.formulationStocks[0].transactions[0].id,"TR1");
assert.equal(result.next.peptides["Fictional N"].doses.length,0);
assert.equal(result.next.supplies[0].linkedPreparationPlans[0].status,"planned-no-transfer");
assert.equal(start.supplies[0].vials[0].remainingMg,28);
assert.throws(()=>bridge.planFormulation(result.next,tx()),/Duplicate|already contains/);
const patches=[
 [{sourceVialId:"V2"},/open/],
 [{sourceVialId:"BAD"},/Exact physical/],
 [{destinationContainerId:"BAD"},/Unique destination/],
 [{amountMg:29},/Insufficient/],
 [{amountMg:0},/Positive/],
 [{amountMg:NaN},/Positive/],
 [{id:""},/Explicit unique/]
];
for(const [patch,re] of patches)assert.throws(()=>bridge.planFormulation(start,{...tx(),...patch}),re);
let incompatible=fixture();incompatible.supplies[0].vials[0].intendedUse="SubQ";
assert.throws(()=>bridge.planFormulation(incompatible,tx()),/nasal-labelled/);
let mismatched=fixture();mismatched.formulationStocks[0].compound="Other";
assert.throws(()=>bridge.planFormulation(mismatched,tx()),/mismatch/);
let occupied=fixture();occupied.formulationStocks[0].remainingMg=2;
assert.throws(()=>bridge.planFormulation(occupied,tx()),/empty/);
let prelabelled=fixture();prelabelled.formulationStocks[0].mgPerSpray=.1;
assert.throws(()=>bridge.planFormulation(prelabelled,tx()),/Do not inherit/);
const doseTx={id:"D-TX",doseId:"D1",compound:"Fictional N",method:"Nasal",trackingMode:"backed",sourceKind:"formulation-container",
 sourceId:"N1",sprays:2,nativeUnit:"mg",date:"2026-10-30T12:00:00"};
assert.throws(()=>prepared.planDose(result.next,doseTx),/Verified/,"Missing bottle calibration must prevent a dose");
const calibrated=JSON.parse(JSON.stringify(result.next));
calibrated.formulationStocks[0].mgPerSpray=.1;
calibrated.formulationStocks[0].mlPerSpray=.1;
const administered=prepared.planDose(calibrated,doseTx);
assert.equal(administered.next.supplies[0].vials[0].remainingMg,18,"No double debit to vial");
assert.equal(administered.next.formulationStocks[0].remainingMg,9.8);
assert.equal(administered.next.formulationStocks[0].remainingMl,6.8);
assert.equal(administered.next.peptides["Fictional N"].doses[0].sourceContainerId,"N1");
const reversed=prepared.reverseDose(administered.next,{transactionId:"D-TX",reversalId:"R1",compound:"Fictional N",doseId:"D1",sourceId:"N1"});
assert.equal(reversed.next.supplies[0].vials[0].remainingMg,18);
assert.equal(reversed.next.formulationStocks[0].remainingMg,10);
assert.equal(reversed.next.formulationStocks[0].remainingMl,7);
assert.equal(reversed.next.formulationStocks[0].transactions.length,3);
assert.equal(reversed.next.peptides["Fictional N"].doses.length,0);
(async()=>{
 let raw=JSON.stringify(fixture()),writes=0;
 const writer=create({read:()=>raw,write:v=>{writes++;raw=v},initialSnapshot:raw,lock:(_n,fn)=>fn()});
 const committed=await writer.transaction(JSON.parse(raw),prior=>bridge.planFormulation(prior,tx()));
 assert.equal(writes,1);
 assert.equal(raw,JSON.stringify(committed.next));
 assert.equal(JSON.parse(raw).supplies[0].vials[0].remainingMg,18);
 assert.equal(JSON.parse(raw).formulationStocks[0].remainingMg,10);
 console.log("PASS: exact-source physical-to-formulation one-write transfer; no inferred calibration; distinct nasal administration/undo conserves physical stock and preserves plan");
})().catch(e=>{console.error(e);process.exitCode=1});
