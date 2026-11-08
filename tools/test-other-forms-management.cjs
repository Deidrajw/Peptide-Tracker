// Fictional regression fixtures only; no browser storage or user backup access.
const assert=require("node:assert/strict");
const stock=require("../assets/js/nexus-formulation-stock.js");
const prepared=require("../assets/js/nexus-prepared-dose-transaction.js");
const base=()=>({peptides:{Semax:{status:"archived",doses:[]}},customPeptides:{},supplies:[],preparedDoses:[],formulationStocks:[]});
let state=stock.add(base(),{id:"fictional-spray",compound:"Semax",containerType:"nasal-bottle",method:"Nasal",volumeMl:10,quantityMg:10}).next;
assert.equal(state.formulationStocks[0].mgPerSpray,null,"unconfigured spray must not infer calibration");
state=stock.edit(state,{id:"fictional-spray",transactionId:"setup-1",remainingMl:10,remainingMg:10,mlPerSpray:0.1}).next;
assert.equal(state.formulationStocks[0].mlPerSpray,0.1);
assert.equal(state.formulationStocks[0].mgPerSpray,0.1);
assert.equal(state.peptides.Semax.status,"archived","calibration must not silently alter tracking");
assert.equal(state.formulationStocks[0].id,"fictional-spray","preserve source ID");
assert.throws(()=>stock.remove(state,{id:"fictional-spray"}),/history/,"history-backed container must not be deleted");
state=stock.edit(state,{id:"fictional-spray",transactionId:"finished-1",remainingMl:10,remainingMg:10,status:"finished"}).next;
assert.equal(state.formulationStocks[0].status,"finished");
const fictionalTx={id:"spray-tx",doseId:"spray-dose",compound:"Semax",sourceId:"fictional-spray",
 method:"Nasal",trackingMode:"backed",sourceKind:"formulation-container",sprays:1,nativeUnit:"mcg",date:"2026-11-08T10:00"};
assert.throws(()=>prepared.planDose(state,fictionalTx),/Finished prepared bottle/,"finished source must reject direct engine call");
assert.throws(()=>stock.edit(state,{id:"fictional-spray",transactionId:"bad-1",remainingMl:10,remainingMg:10,mlPerSpray:0}),/Positive pump/);
state=stock.edit(state,{id:"fictional-spray",transactionId:"reopen-1",remainingMl:10,remainingMg:10,status:"active"}).next;
assert.equal(state.formulationStocks[0].status,"active");
assert.equal(state.formulationStocks[0].transactions.length,3);
const administered=prepared.planDose(state,fictionalTx);
assert.equal(administered.next.formulationStocks[0].remainingMg,9.9);
assert.equal(administered.next.formulationStocks[0].remainingMl,9.9);
assert.equal(administered.next.peptides.Semax.status,"archived");
assert.equal(administered.next.peptides.Semax.doses.length,1);
assert.equal(administered.next.supplies.length,0,"nasal dose cannot debit physical vial stock");
const reversed=prepared.reverseDose(administered.next,{
 transactionId:"spray-tx",reversalId:"spray-undo",compound:"Semax",doseId:"spray-dose",sourceId:"fictional-spray"});
assert.equal(reversed.next.formulationStocks[0].remainingMg,10);
assert.equal(reversed.next.formulationStocks[0].remainingMl,10);
assert.equal(reversed.next.peptides.Semax.doses.length,0);
const unused=stock.add(base(),{id:"unused",compound:"Fictional",containerType:"raw-powder",method:"Unassigned",quantityMg:5}).next;
assert.equal(stock.remove(unused,{id:"unused"}).next.formulationStocks.length,0);
assert.equal(stock.remove(unused,{id:"unused"}).next.supplies.length,0);
console.log("Other Forms fictional engine regression PASS");
