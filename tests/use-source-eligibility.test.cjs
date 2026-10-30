const assert=require("node:assert/strict");
const {inspect,planNasalSprays}=require("../assets/js/nexus-use-source-eligibility.js");
const state={
 supplies:[{id:"K1",name:"Sample A",vials:[{id:"V1",status:"open",remainingMg:28,intendedUse:"SubQ"},{id:"V2",status:"open",remainingMg:10,intendedUse:"Nasal"}],linkedPreparationPlans:[{id:"P1",status:"planned-no-transfer"}]}],
 formulationStocks:[{id:"N1",compound:"Sample A",containerType:"nasal-bottle",method:"Nasal",remainingMg:6,remainingMl:3,mgPerSpray:null,mlPerSpray:null}],
 preparedDoses:[],preparations:[]
};
const before=JSON.stringify(state);
let q=inspect(state,{compound:"Sample A",method:"SubQ"});
assert.equal(q.eligible.length,1);assert.equal(q.eligible[0].vialId,"V1");
assert.equal(q.blocked.some(x=>x.vialId==="V2"&&x.reason==="Different confirmed method"),true);
q=inspect(state,{compound:"Sample A",method:"Nasal"});
assert.equal(q.eligible.length,0);assert.equal(q.blocked.some(x=>x.vialId==="V2"&&x.reason==="Physical vial is not prepared stock"),true);
assert.equal(q.blocked.some(x=>x.containerId==="N1"&&x.reason==="Spray conversion not verified"),true);
assert.equal(q.eligible.some(x=>x.preparedId==="P1"),false);
q=inspect(state,{compound:"Sample A",method:"Nasal",trackingMode:"untracked"});
assert.equal(q.eligible.length,0);assert.equal(q.blocked.length,0);
assert.throws(()=>planNasalSprays(state,{compound:"Sample A",containerId:"N1",count:2}),/Verified bottle-specific/);
state.formulationStocks[0].mgPerSpray=.1;state.formulationStocks[0].mlPerSpray=.05;
q=inspect(state,{compound:"Sample A",method:"Nasal"});
assert.equal(q.eligible.length,1);assert.equal(q.eligible[0].containerId,"N1");
const plan=planNasalSprays(state,{compound:"Sample A",containerId:"N1",count:2});
assert.equal(plan.amountMg,.2);assert.equal(plan.volumeMl,.1);
assert.equal(plan.remainingMg,5.8);assert.equal(plan.remainingMl,2.9);
assert.throws(()=>planNasalSprays(state,{compound:"Sample A",containerId:"N1",count:9999}),/Insufficient/);
assert.throws(()=>planNasalSprays(state,{compound:"Sample A",containerId:"N1",count:1.5}),/whole/);
assert.notEqual(JSON.stringify(state),before); // test fixture explicitly changed calibration
assert.equal(state.supplies[0].vials[0].remainingMg,28);
assert.equal(state.formulationStocks[0].remainingMg,6);
assert.equal(state.formulationStocks[0].remainingMl,3);
console.log("PASS: 14 prepared-source/source-eligibility assertions; no stock mutation");
