import assert from 'node:assert/strict';
import {chromium} from 'playwright';
// Fictional same-origin Chromium coverage of the actual candidate-enabled LIVE handler.
// No interception or modification of the checked-in release source.
const url='http://127.0.0.1:8777/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
 const context=await browser.newContext();
 const a=await context.newPage(),b=await context.newPage(),errors=[];
 for(const page of [a,b])page.on('pageerror',err=>errors.push(err.message));
 await Promise.all([a.goto(url,{waitUntil:'domcontentloaded'}),b.goto(url,{waitUntil:'domcontentloaded'})]);
 await Promise.all([a.waitForFunction(()=>typeof nexusCommitPreparedNasalOperation==='function'&&typeof buildDemoState==='function'&&NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED===true),b.waitForFunction(()=>typeof nexusCommitPreparedNasalOperation==='function'&&typeof buildDemoState==='function'&&NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED===true)]);
 const fixture=await a.evaluate(()=>{
  const f=buildDemoState('weight_loss');
  f.profile.onboardingDone=true;
  f.supplies.push({id:'qa-kit',name:'Fictional Spray QA',activeKit:true,vials:[{id:'qa-vial',status:'open',remainingMg:18,intendedUse:'nasal-source'}]});
  f.formulationStocks=f.formulationStocks||[];
  f.formulationStocks.push({id:'qa-nasal',compound:'Fictional Spray QA',containerType:'nasal-bottle',method:'Nasal',remainingMg:4,remainingMl:2,mgPerSpray:.1,mlPerSpray:.05,transactions:[]});
  f.customPeptides=f.customPeptides||{};
  f.customPeptides['Fictional Spray QA']={doses:[],status:'inactive',unit:'mg',route:'Nasal'};
  return f;
 });
 const key='peptide-tracker-html-v1';
 await a.evaluate(({key,fixture})=>localStorage.setItem(key,JSON.stringify(fixture)),{key,fixture});
 await Promise.all([a,b].map(page=>page.evaluate(({key})=>{
  const canonical=localStorage.getItem(key);
  state=JSON.parse(canonical);
  state._qaVisiblePanel='today';
  _nexusSharedWriter=null;_nexusLastSavedSnapshot=canonical;
 },{key})));
 const tx=id=>({type:'dose',tx:{id:'qa-t'+id,doseId:'qa-d'+id,compound:'Fictional Spray QA',sourceId:'qa-nasal',sprays:2,method:'Nasal',trackingMode:'backed',sourceKind:'formulation-container',nativeUnit:'mg',date:'2026-11-07T12:00:00'}});
 const pair=await Promise.all([a.evaluate(op=>nexusCommitPreparedNasalOperation(op).then(()=>({ok:true}),e=>({ok:false,error:e.message})),tx(1)),b.evaluate(op=>nexusCommitPreparedNasalOperation(op).then(()=>({ok:true}),e=>({ok:false,error:e.message})),tx(2))]);
 assert.equal(pair.filter(r=>r.ok).length,1,'Only one real application handler save can win');
 assert.match(pair.find(r=>!r.ok).error,/changed|uncertain|reload|blocked/i);
 const after=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 const bottle=after.formulationStocks.find(x=>x.id==='qa-nasal');
 assert.equal(bottle.remainingMg,3.8);assert.equal(bottle.remainingMl,1.9);
 assert.equal(bottle.transactions.length,1);
 const dose=after.customPeptides['Fictional Spray QA'].doses[0];
 assert.ok(dose&&dose.sourceContainerId==='qa-nasal');
 assert.equal(after.supplies.find(x=>x.id==='qa-kit').vials[0].remainingMg,18);
 const winner=pair[0].ok?a:b,event=bottle.transactions[0];
 const reverse={type:'reverse',tx:{transactionId:event.id,reversalId:'qa-reverse',compound:'Fictional Spray QA',doseId:event.doseId,sourceId:'qa-nasal'}};
 const undone=await winner.evaluate(op=>nexusCommitPreparedNasalOperation(op).then(()=>({ok:true}),e=>({ok:false,error:e.message})),reverse);
 assert.equal(undone.ok,true,'Real application handler must reverse exact saved spray');
 const restored=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 assert.equal(restored.formulationStocks.find(x=>x.id==='qa-nasal').remainingMg,4);
 assert.equal(restored.formulationStocks.find(x=>x.id==='qa-nasal').remainingMl,2);
 assert.equal(restored.formulationStocks.find(x=>x.id==='qa-nasal').transactions.length,2);
 assert.equal(restored.customPeptides['Fictional Spray QA'].doses.length,0);
 assert.equal(restored.supplies.find(x=>x.id==='qa-kit').vials[0].remainingMg,18);
 assert.deepEqual(errors,[]);
 console.log('PASS fictional real Chromium app-handler two-tab: one winner, stale reject, dose history, exact bottle debit/Undo, physical vial unchanged, no page errors');
 await context.close();
}finally{await browser.close()}
