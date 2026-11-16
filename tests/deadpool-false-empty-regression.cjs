'use strict';
// Fictional-only regression. Loads the real production functions, never user backups.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src03=fs.readFileSync('assets/js/03-nexus.js','utf8');
const src04=fs.readFileSync('assets/js/04-nexus.js','utf8');
function extract(src,name) {
  const start=src.indexOf('function '+name+'(');
  assert.ok(start>=0,'Missing production function '+name);
  const end=src.indexOf('\n}',start);
  assert.ok(end>start,'Missing closing brace '+name);
  return src.slice(start,end+2);
}
const names03=['getBlendKitRemainingMg','getBlendOpenVialRemainingMg','isBlendVialLedgerDepleted'];
const names04=['consumeCompoundInventory'];
const sandbox={
 Math,Number,Date,String,JSON,console,
 ensureKitVials:kit=>kit.vials,
 getKitActiveWasteMg:kit=>(kit.wasteLog||[]).filter(w=>w.status!=='reversed').reduce((n,w)=>n+Number(w.mg||0),0),
 safeDate:v=>new Date(v),
 getActiveVial:kit=>kit.vials.find(v=>v.status==='active'||v.status==='open')||null,
 getSealedVials:kit=>kit.vials.filter(v=>v.status==='sealed'),
 migrateKitToV2:()=>{throw Error('Blend must never migrate through non-blend V2')},
 uid:(()=>{let n=0;return()=>++n})(),
 localDatetime:()=> '2026-11-16T12:00:00',
};
vm.createContext(sandbox);
vm.runInContext([...names03.map(n=>extract(src03,n)),...names04.map(n=>extract(src04,n))].join('\n'),sandbox);
function kit(logs){
 return {id:'fictional-kit',isBlend:true,vialMg:30,totalVials:1,emptyVials:0,
   reconDate:'2026-11-10T09:00:00',activeKit:true,
   vials:[{id:'fictional-open',status:'open',reconDate:'2026-11-10T09:00:00',vialMg:30}],
   doseLog:logs.map((x,i)=>({id:'old-'+i,date:'2026-11-12T10:00:00',totalMgDrawn:x.mg,vialId:x.vial}))};
}
const phantom=kit([{mg:29,vial:'unattributed-old-vial'}]);
assert.equal(sandbox.getBlendOpenVialRemainingMg(phantom),1,'global cap yields only 1mg despite open-vial ledger 30mg');
assert.equal(sandbox.isBlendVialLedgerDepleted(phantom,phantom.vials[0]),false);
const result=sandbox.consumeCompoundInventory({kit:phantom,amountMg:1,reason:'administered'});
assert.equal(result.committed,true);
assert.equal(sandbox.getBlendOpenVialRemainingMg(phantom),0,'cap exhausted after dose');
assert.equal(phantom.vials[0].status,'open','historical kit cap must not falsely finish physical vial');
assert.equal(phantom.emptyVials,0,'no phantom completed-vial count');
assert.equal(phantom.doseLog.length,2,'new dose ledger recorded once');
const exhausted=kit([{mg:29,vial:'fictional-open'}]);
const correct=sandbox.consumeCompoundInventory({kit:exhausted,amountMg:1,reason:'administered'});
assert.equal(correct.committed,true);
assert.equal(exhausted.vials[0].status,'empty','real exact vial depletion still finishes');
assert.equal(exhausted.emptyVials,1);
const partial=kit([{mg:9,vial:'fictional-open'}]);
sandbox.consumeCompoundInventory({kit:partial,amountMg:3,reason:'administered'});
assert.equal(partial.vials[0].status,'open','ordinary dose leaves vial open');
assert.equal(sandbox.getBlendOpenVialRemainingMg(partial),18);
const unknown=kit([]);
unknown.vials[0].reconDate=null;unknown.reconDate=null;
assert.equal(sandbox.isBlendVialLedgerDepleted(unknown,unknown.vials[0]),false,'unknown history must not certify depletion');
// A legacy entry with only a timestamp cannot certify the physical source.
const unattributed=kit([{mg:29,vial:null}]);
assert.equal(sandbox.isBlendVialLedgerDepleted(unattributed,unattributed.vials[0]),false);
assert.equal(sandbox.consumeCompoundInventory({kit:unattributed,amountMg:1,reason:'administered'}).committed,true);
assert.equal(unattributed.vials[0].status,'open','legacy unassigned draw must not finish exact vial');
assert.equal(unattributed.emptyVials,0);
// Next-day reload, without a browser mock: serialise/restore the actual persisted
// inventory representation and confirm another genuine 3mg dose remains available.
let nextDay=JSON.parse(JSON.stringify(kit([{mg:9,vial:'fictional-open'}])));
assert.equal(sandbox.consumeCompoundInventory({kit:nextDay,amountMg:3,reason:'administered'}).committed,true);
nextDay=JSON.parse(JSON.stringify(nextDay));
assert.equal(sandbox.getActiveVial(nextDay).status,'open','reload must retain OPEN');
assert.equal(sandbox.getBlendOpenVialRemainingMg(nextDay),18);
assert.equal(sandbox.consumeCompoundInventory({kit:nextDay,amountMg:3,reason:'administered'}).committed,true,'following day dose accepted');
assert.equal(nextDay.vials[0].status,'open');
assert.equal(sandbox.getBlendOpenVialRemainingMg(nextDay),15);
console.log('PASS: fictional exact-vial ledger, unattributed-draw safeguard, normal depletion and next-day JSON reload');
