'use strict';
const assert=require('node:assert/strict');
const prepared=require('../assets/js/nexus-prepared-dose-transaction.js');
const fixture=()=>({supplies:[{id:'vial-kit',vials:[{id:'vial',remainingMg:20}]}],
 formulationStocks:[{id:'bottle',compound:'Fictional A',containerType:'nasal-bottle',
 method:'Nasal',remainingMg:5,remainingMl:2.5,mgPerSpray:.1,mlPerSpray:.05,transactions:[]}],
 peptides:{'Fictional A':{doses:[]}},customPeptides:{},preparations:[]});
const observed={id:'bottle',remainingMg:5,remainingMl:2.5,mgPerSpray:.1,mlPerSpray:.05,transactionCount:0};
const tx={id:'test-1',doseId:'dose-1',compound:'Fictional A',method:'Nasal',
 trackingMode:'backed',sourceKind:'formulation-container',sourceId:'bottle',
 nativeUnit:'mg',sprays:2,date:'2026-11-07T12:00:00',expectedSource:observed};
const good=prepared.planDose(fixture(),tx);
assert.equal(good.next.formulationStocks[0].remainingMg,4.8);
for(const [label,modify] of [
 ['calibration',s=>s.formulationStocks[0].mgPerSpray=.2],
 ['pump calibration',s=>s.formulationStocks[0].mlPerSpray=.07],
 ['source volume',s=>s.formulationStocks[0].remainingMl=2.4],
 ['source mass',s=>s.formulationStocks[0].remainingMg=4.9],
 ['new ledger event',s=>s.formulationStocks[0].transactions.push({id:'intervening'})]
]){
 const snap=fixture(),before=JSON.stringify(snap);modify(snap);
 const staged=JSON.stringify(snap);
 assert.throws(()=>prepared.planDose(snap,tx),/changed since review/i,label);
 assert.equal(JSON.stringify(snap),staged,'Rejected '+label+' mutated caller snapshot');
 assert.notEqual(staged,before);
}
assert.throws(()=>prepared.planDose(fixture(),{...tx,expectedSource:{...observed,id:'another'}}),/changed since review/i);
assert.throws(()=>prepared.planDose(fixture(),{...tx,sprays:200}),/Insufficient prepared stock/);
assert.throws(()=>prepared.planDose(fixture(),{...tx,sourceId:'physical-vial'}),/source required|unique prepared source/i);
console.log('PASS: exact prepared bottle preflight rejects all source-calibration/balance/ledger changes, insufficient dose and wrong vial with zero caller-state writes');
