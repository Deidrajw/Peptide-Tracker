const assert=require("node:assert/strict");
const api=require("../assets/js/nexus-prepared-dose-transaction.js");
const base=()=>({
 supplies:[{id:"K1",name:"Sample A",vials:[{id:"V1",status:"open",remainingMg:24,intendedUse:"Nasal"}],linkedPreparationPlans:[{id:"P1",status:"planned-no-transfer"}]}],
 formulationStocks:[{id:"N1",compound:"Sample A",containerType:"nasal-bottle",method:"Nasal",remainingMg:6,remainingMl:3,mgPerSpray:.1,mlPerSpray:.05,transactions:[]}],
 peptides:{"Sample A":{enabled:true,doses:[]}},customPeptides:{},preparations:[]
});
const tx=()=>({id:"T1",doseId:"D1",compound:"Sample A",method:"Nasal",trackingMode:"backed",sourceKind:"formulation-container",sourceId:"N1",sprays:2,nativeUnit:"mg",date:"2026-10-30T12:30:00",notes:"fictional"});
let start=base(),before=JSON.stringify(start),p=api.planDose(start,tx());
assert.equal(JSON.stringify(start),before,"planner mutated input");
assert.equal(p.next.formulationStocks[0].remainingMg,5.8);
assert.equal(p.next.formulationStocks[0].remainingMl,2.9);
assert.equal(p.next.supplies[0].vials[0].remainingMg,24);
assert.equal(p.next.peptides["Sample A"].doses.length,1);
assert.equal(p.dose.sourceContainerId,"N1");
assert.equal(p.dose.preparedTransactionId,"T1");
assert.equal(p.dose.trackingMode,"backed");
assert.equal(p.next.formulationStocks[0].transactions.length,1);
assert.throws(()=>api.planDose(p.next,tx()),/Duplicate/);
for(const patch of [{sourceId:"P1"},{sourceKind:"physical-vial"},{method:"SubQ"},{trackingMode:"untracked"},{sprays:0},{sprays:1.5},{nativeUnit:"IU"},{compound:"Other"},{sourceId:"BAD"},{date:"bad"}]){
 assert.throws(()=>api.planDose(start,{...tx(),...patch}));
}
const insufficient=base();insufficient.formulationStocks[0].remainingMl=.01;
assert.throws(()=>api.planDose(insufficient,tx()),/Insufficient/);
const unsafe=base();unsafe.formulationStocks[0].mgPerSpray=null;
assert.throws(()=>api.planDose(unsafe,tx()),/Verified/);
const duplicate=base();duplicate.peptides["Sample A"].doses.push({id:"D1"});
assert.throws(()=>api.planDose(duplicate,tx()),/Duplicate/);
const edited=JSON.parse(JSON.stringify(p.next));edited.peptides["Sample A"].doses[0].reactions=[{id:"RX1",note:"preserve"}];
assert.throws(()=>api.reverseDose(edited,{transactionId:"T1",reversalId:"R1",compound:"Sample A",doseId:"D1",sourceId:"N1"}),/Dose changed/);
assert.equal(edited.formulationStocks[0].remainingMg,5.8);
const rev=api.reverseDose(p.next,{transactionId:"T1",reversalId:"R1",compound:"Sample A",doseId:"D1",sourceId:"N1"});
assert.equal(rev.next.formulationStocks[0].remainingMg,6);
assert.equal(rev.next.formulationStocks[0].remainingMl,3);
assert.equal(rev.next.supplies[0].vials[0].remainingMg,24);
assert.equal(rev.next.peptides["Sample A"].doses.length,0);
assert.equal(rev.next.formulationStocks[0].transactions.length,2);
assert.throws(()=>api.reverseDose(rev.next,{transactionId:"T1",reversalId:"R2",compound:"Sample A",doseId:"D1",sourceId:"N1"}),/already reversed/);
const memory={raw:JSON.stringify(start),writes:0};const adapter={read:()=>memory.raw,write:x=>{memory.writes++;memory.raw=x}};
const commit=api.commit(start,{type:"dose",tx:tx()},adapter);
assert.equal(memory.writes,1);assert.equal(JSON.parse(memory.raw).peptides["Sample A"].doses.length,1);
assert.throws(()=>api.commit(start,{type:"dose",tx:{...tx(),id:"T2",doseId:"D2"}},adapter),/Stale/);
const reversed=api.commit(commit.next,{type:"reverse",tx:{transactionId:"T1",reversalId:"R1",compound:"Sample A",doseId:"D1",sourceId:"N1"}},adapter);
assert.equal(memory.writes,2);assert.equal(reversed.next.peptides["Sample A"].doses.length,0);
const failure={read:()=>JSON.stringify(start),write:()=>{throw Error("quota")}};
assert.throws(()=>api.commit(start,{type:"dose",tx:tx()},failure),/quota/);
const stale={read:()=>JSON.stringify({...start,external:true}),write:()=>{throw Error("should not write")}};
assert.throws(()=>api.commit(start,{type:"dose",tx:tx()},stale),/Stale/);
const drift={raw:JSON.stringify(start),readCount:0,write:()=>{throw Error("not reached")},read(){this.readCount++;return this.readCount===1?this.raw:"{}"}};
assert.throws(()=>api.commit(start,{type:"dose",tx:tx()},drift),/Concurrent/);
const malformed={raw:JSON.stringify(start),read(){return this.raw},write(){this.raw="{}"}};
assert.throws(()=>api.commit(start,{type:"dose",tx:tx()},malformed),/readback/);
console.log("PASS: prepared nasal dose/reversal pure ledger, attribution, canonical vial isolation and storage failures");
