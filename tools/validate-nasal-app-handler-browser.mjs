import assert from 'node:assert/strict';
import {chromium} from 'playwright';
// TEST-ONLY Chromium route rewrites the one OFF constant in a private browser
// context. Checked-in LIVE source and deployed app always keep the gate OFF.
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
 // End-to-end ACTUAL enabled LIVE UI path, not just the pure planner:
 // review/confirm writes the one prepared bottle and history, and visible Undo
 // reverses exactly that entry. Every browser context uses fictional storage.
 for(const width of [320,390]){
  const uiCtx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});
  const page=await uiCtx.newPage(),uiErrors=[];
  page.on('pageerror',e=>uiErrors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof nexusNasalDoseModal==='function'&&typeof buildDemoState==='function'&&NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED===true);
  await page.evaluate(()=>{
   if(document.querySelector('.modal'))closeModal();
   const f=buildDemoState('weight_loss');
   f.profile.onboardingDone=true;
   f.customPeptides=f.customPeptides||{};
   f.customPeptides['Fictional Spray UI']={enabled:true,status:'active',unit:'mg',route:'Nasal',doses:[]};
   f.supplies.push({id:'ui-kit',name:'Fictional Spray UI',activeKit:true,
    vials:[{id:'ui-vial',status:'open',intendedUse:'nasal-source',remainingMg:15}]});
   f.formulationStocks=f.formulationStocks||[];
   f.formulationStocks.push({id:'ui-bottle',compound:'Fictional Spray UI',containerType:'nasal-bottle',
    method:'Nasal',remainingMg:4,remainingMl:2,mgPerSpray:.1,mlPerSpray:.05,transactions:[]});
   localStorage.setItem(STORE_KEY,JSON.stringify(f));
   state=f;_nexusSharedWriter=null;_nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);_demoActive=false;
   nexusNasalDoseModal('Fictional Spray UI');
  });
  assert.equal(await page.locator('.nx-prepared-spray-entry').count(),1,'Enabled verified bottle must open LIVE nasal form');
  await page.locator('#nx-spray-count').fill('2');
  await page.locator('#nx-spray-review').click();
  assert.equal(await page.locator('#nx-spray-confirm').isVisible(),true,'Review must be accessible before save');
  await page.locator('#nx-spray-save').click();
  await page.waitForFunction(()=>{
   const raw=localStorage.getItem('peptide-tracker-html-v1');
   if(!raw)return false;
   const s=JSON.parse(raw);
   return s.customPeptides?.['Fictional Spray UI']?.doses?.length===1;
  },null,{timeout:15000});
  const saved=await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem(STORE_KEY));
   return {b:s.formulationStocks.find(x=>x.id==='ui-bottle'),
    dose:s.customPeptides['Fictional Spray UI'].doses[0],
    vial:s.supplies.find(k=>k.id==='ui-kit').vials[0].remainingMg,
    matches:JSON.stringify(s)===_nexusLastSavedSnapshot};
  });
  assert.equal(saved.b.remainingMg,3.8);
  assert.equal(saved.b.remainingMl,1.9);
  assert.equal(saved.b.transactions.length,1);
  assert.equal(saved.dose.sourceContainerId,'ui-bottle');
  assert.equal(saved.vial,15,'Original physical vial must not be double deducted');
  assert.equal(saved.matches,true,'LIVE save acknowledgement requires durable readback');
  await page.locator('#undo-btn').click();
  await page.waitForFunction(()=>{
   const s=JSON.parse(localStorage.getItem('peptide-tracker-html-v1')||'{}');
   return s.customPeptides?.['Fictional Spray UI']?.doses?.length===0 &&
    s.formulationStocks?.find(x=>x.id==='ui-bottle')?.transactions?.length===2;
  },null,{timeout:15000});
  const after=await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem(STORE_KEY));
   return {b:s.formulationStocks.find(x=>x.id==='ui-bottle'),
    vial:s.supplies.find(k=>k.id==='ui-kit').vials[0].remainingMg};
  });
  assert.equal(after.b.remainingMg,4);
  assert.equal(after.b.remainingMl,2);
  assert.equal(after.vial,15);
  assert.deepEqual(uiErrors,[]);
  console.log('PASS real LIVE nasal Review/Save/Undo UI, fictional exact bottle & history',width);
  await uiCtx.close();
 }
}finally{await browser.close()}
