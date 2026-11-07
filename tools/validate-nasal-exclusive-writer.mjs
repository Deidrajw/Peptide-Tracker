import {chromium} from 'playwright';
import assert from 'node:assert/strict';
// Intentionally exercises the prepared transaction engine behind an isolated
// fictional test-only gate. Does NOT change app LIVE nasal gate or app storage key.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const key='__nexus_nasal_exclusive_qa_fictional__';
try{
 const ctx=await browser.newContext(),a=await ctx.newPage(),b=await ctx.newPage();
 await Promise.all([a.goto('http://127.0.0.1:8777/',{waitUntil:'domcontentloaded'}),b.goto('http://127.0.0.1:8777/',{waitUntil:'domcontentloaded'})]);
 const initial={supplies:[{id:'K',name:'Fictional A',vials:[{id:'V',remainingMg:24,status:'open',intendedUse:'nasal-source'}]}],
  formulationStocks:[{id:'N',compound:'Fictional A',containerType:'nasal-bottle',method:'Nasal',remainingMg:6,remainingMl:3,mgPerSpray:0.1,mlPerSpray:0.05,transactions:[]}],
  peptides:{'Fictional A':{doses:[]}},customPeptides:{},preparations:[]};
 await a.evaluate(({key,initial})=>localStorage.setItem(key,JSON.stringify(initial)),{key,initial});
 const init=key=>{
  const read=()=>localStorage.getItem(key);
  window.__nasalFixture={snapshot:JSON.parse(read()),writer:NexusWriteCoordinator.create({
   read,write:x=>localStorage.setItem(key,x),initialSnapshot:read(),lockName:'nexus:test:prepared-nasal:exclusive',
   lock:(name,action)=>navigator.locks.request(name,{mode:'exclusive'},action)
  })};
 };
 await Promise.all([a.evaluate(init,key),b.evaluate(init,key)]);
 const tx=id=>({id:'T'+id,doseId:'D'+id,compound:'Fictional A',sourceId:'N',sprays:2,method:'Nasal',trackingMode:'backed',sourceKind:'formulation-container',nativeUnit:'mg',date:'2026-11-06T12:00:00'});
 const results=await Promise.all([a.evaluate(t=>NexusPreparedDoseTransaction.executeExclusive(window.__nasalFixture.writer,window.__nasalFixture.snapshot,{type:'dose',tx:t},{enabled:true}).then(()=>({ok:true}),e=>({ok:false,error:e.message})),tx(1)),
 b.evaluate(t=>NexusPreparedDoseTransaction.executeExclusive(window.__nasalFixture.writer,window.__nasalFixture.snapshot,{type:'dose',tx:t},{enabled:true}).then(()=>({ok:true}),e=>({ok:false,error:e.message})),tx(2))]);
 assert.equal(results.filter(x=>x.ok).length,1,'Only one stale-tab prepared spray transaction may win');
 assert.match(results.find(x=>!x.ok).error,/changed|uncertain|reload|blocked/i);
 const winner=results[0].ok?a:b;
 const after=await a.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 assert.equal(after.formulationStocks[0].remainingMg,5.8);
 assert.equal(after.formulationStocks[0].remainingMl,2.9);
 assert.equal(after.formulationStocks[0].transactions.length,1);
 assert.equal(after.peptides['Fictional A'].doses.length,1);
 assert.equal(after.supplies[0].vials[0].remainingMg,24,'Original source vial must not be deducted twice');
 const event=after.formulationStocks[0].transactions[0];
 const reverse={transactionId:event.id,reversalId:'R1',compound:'Fictional A',doseId:event.doseId,sourceId:'N'};
 const undone=await winner.evaluate(({key,reverse})=>{
  const before=JSON.parse(localStorage.getItem(key));
  return NexusPreparedDoseTransaction.executeExclusive(window.__nasalFixture.writer,before,{type:'reverse',tx:reverse},{enabled:true})
    .then(()=>true,()=>false);
 },{key,reverse});
 assert.equal(undone,true,'Winner must reverse its exact saved prepared spray transaction');
 const restored=await a.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 assert.equal(restored.formulationStocks[0].remainingMg,6);
 assert.equal(restored.formulationStocks[0].remainingMl,3);
 assert.equal(restored.peptides['Fictional A'].doses.length,0);
 assert.equal(restored.formulationStocks[0].transactions.length,2);
 assert.equal(restored.supplies[0].vials[0].remainingMg,24);
 const repeat=await winner.evaluate(({key,reverse})=>
  NexusPreparedDoseTransaction.executeExclusive(window.__nasalFixture.writer,JSON.parse(localStorage.getItem(key)),{type:'reverse',tx:{...reverse,reversalId:'R2'}},{enabled:true})
    .then(()=>true,()=>false),{key,reverse});
 assert.equal(repeat,false,'Second reversal must fail closed');
 assert.equal(await a.evaluate(k=>JSON.parse(localStorage.getItem(k)).formulationStocks[0].transactions.length,key),2);
 await a.evaluate(k=>localStorage.removeItem(k),key);
 await ctx.close();
 console.log('PASS: real two-tab Chromium prepared nasal engine, one winner, stale loser rejected, single bottle debit, exact undo, duplicate undo blocked and physical vial unchanged');
}finally{await browser.close();}
