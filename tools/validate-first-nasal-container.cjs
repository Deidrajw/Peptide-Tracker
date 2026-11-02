/* PR124 first-bottle migration-free ledger regression; fictional source only.
 * Run: node tools/validate-first-nasal-container.cjs
 */
'use strict';
const assert=require('node:assert/strict');
const bridge=require('../assets/js/nexus-preparation-bridge.js');

const start={
 supplies:[{id:'fictional-kit',name:'Fictional Compound',isBlend:false,
  vials:[{id:'fictional-vial',status:'open',intendedUse:'nasal-source',remainingMg:30,vialMg:30}]}],
 peptides:{},customPeptides:{}
};
const tx={
 id:'fictional-transfer',confirmed:true,destinationContainerId:'fictional-bottle',
 sourceKitId:'fictional-kit',sourceVialId:'fictional-vial',
 amountMg:30,bacMl:1,salineMl:9,volumeMl:10,mlPerSpray:0.1
};
const result=bridge.planRecordedNasal(start,tx);
assert.equal(result.next.supplies[0].vials[0].remainingMg,0,'exact source debit');
assert.equal(result.next.formulationStocks.length,1,'one linked new container');
assert.equal(result.next.formulationStocks[0].remainingMg,30,'exact destination credit');
assert.equal(result.next.formulationStocks[0].remainingMl,10,'recorded destination volume');
assert.equal(result.next.supplies[0].preparationTransfers.length,1,'one transfer event');
assert.equal(start.supplies[0].vials[0].remainingMg,30,'planner must not mutate input');
assert.equal(Object.hasOwn(start,'formulationStocks'),false,'legacy input stays unchanged');
console.log('PASS first prepared bottle from legacy snapshot: exact single debit/credit, no input mutation');

function reject(label,snapshot,transaction,pattern){
 const before=JSON.stringify(snapshot);
 assert.throws(()=>bridge.planRecordedNasal(snapshot,transaction),pattern,label);
 assert.equal(JSON.stringify(snapshot),before,label+' must not modify input');
 console.log('PASS rejection:',label);
}
reject('duplicate destination',result.next,tx,/identifier/i);
reject('malformed existing container collection',{...start,formulationStocks:{corrupt:true}},tx,/invalid/i);
reject('insufficient source',{
 ...start,supplies:[{...start.supplies[0],
 vials:[{...start.supplies[0].vials[0],remainingMg:20}]}]
},tx,/insufficient/i);
reject('unconfirmed transfer',start,{...tx,confirmed:false},/confirmed/i);
