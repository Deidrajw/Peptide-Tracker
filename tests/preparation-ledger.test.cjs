const assert=require("node:assert/strict");
const {createPreparation,transact}=require("../assets/js/nexus-preparation-ledger.js");
const nasal=createPreparation({id:"nasal",compound:"Oxytocin",method:"Nasal",containerType:"nasal-bottle",quantityMg:0,mgPerSpray:0.01});
const subq=createPreparation({id:"subq",compound:"Oxytocin",method:"SubQ",containerType:"vial",quantityMg:10});
const stock=[nasal,subq];
transact(stock,{id:"transfer-1",kind:"transfer",fromId:"subq",toId:"nasal",amountMg:2});
assert.equal(nasal.remainingMg,2);assert.equal(subq.remainingMg,8);
transact(stock,{id:"nasal-dose",kind:"dose",preparationId:"nasal",method:"Nasal",sprays:5});
assert.equal(nasal.remainingMg,1.95);assert.equal(subq.remainingMg,8);
transact(stock,{id:"subq-dose",kind:"dose",preparationId:"subq",method:"SubQ",amountMg:0.5});
assert.equal(subq.remainingMg,7.5);assert.equal(nasal.remainingMg,1.95);
function blocked(tx){const before=JSON.stringify(stock);assert.throws(()=>transact(stock,tx));assert.equal(JSON.stringify(stock),before);}
blocked({id:"nasal-dose",kind:"dose",preparationId:"nasal",method:"Nasal",sprays:1});
blocked({id:"wrong-method",kind:"dose",preparationId:"subq",method:"Nasal",amountMg:0.1});
blocked({id:"overdraw",kind:"dose",preparationId:"nasal",method:"Nasal",amountMg:20});
blocked({id:"wrong-transfer",kind:"transfer",fromId:"nasal",toId:"subq",amountMg:0.1});
blocked({id:"unknown",kind:"dose",preparationId:"missing",method:"Nasal",amountMg:0.1});
console.log("PASS: fictional independent nasal/SubQ source and transfer ledger scenarios");
