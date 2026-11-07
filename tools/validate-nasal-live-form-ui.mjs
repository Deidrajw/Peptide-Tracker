import assert from 'node:assert/strict';
import {chromium} from 'playwright';
// Full LIVE-source (not demo planner) iPhone-viewport UI proof. Each browser
// context is discarded, with its own exclusively fictional same-origin data.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const key='peptide-tracker-html-v1',checks=[];
try{
 for(const width of [320,390])for(const theme of ['dark','light']){
  const ctx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8777/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof nexusNasalDoseModal==='function'&&
    !document.getElementById('app')?.textContent?.includes('LOADING…')&&
    !nexusWriter().status().inFlight);
  const before=await page.evaluate(({theme,key})=>{
    if(document.querySelector('.modal'))closeModal();
    const fixture=buildDemoState('weight_loss');
    fixture.profile.onboardingDone=true;
    // Match the persisted v2 kit schema. A deliberately incomplete legacy
    // kit is tested separately; a render-time migration must not be mistaken
    // for a nasal Undo failure on a normal, previously saved source.
    fixture.supplies.push({id:'test-kit',name:'Fictional Spray QA',activeKit:true,
      vialMg:24,totalVials:1,openedVials:1,_vialsBackfilled:true,
      _vialsRepaired:true,_vialsSeqOrderRepaired:true,
      vials:[{id:'test-vial',status:'open',remainingMg:24,vialMg:24,
        sequenceNumber:1,intendedUse:'nasal-source',reconDate:'2026-11-01T12:00:00'}]});
    fixture.formulationStocks=fixture.formulationStocks||[];
    fixture.formulationStocks.push({id:'test-bottle',compound:'Fictional Spray QA',
      containerType:'nasal-bottle',method:'Nasal',remainingMg:4,remainingMl:2,
      mgPerSpray:.1,mlPerSpray:.05,transactions:[]});
    fixture.customPeptides=fixture.customPeptides||{};
    fixture.customPeptides['Fictional Spray QA']={status:'active',enabled:true,unit:'mg',route:'Nasal',doses:[]};
    localStorage.setItem(key,JSON.stringify(fixture));
    state=JSON.parse(localStorage.getItem(key));
    _nexusLastSavedSnapshot=localStorage.getItem(key);
    _nexusSharedWriter=null;_demoActive=false;
    document.documentElement.dataset.theme=theme;
    const vialBefore=state.supplies.find(x=>x.id==='test-kit').vials[0].remainingMg;
    nexusNasalDoseModal('Fictional Spray QA');
    return vialBefore;
  },{theme,key});
  assert.equal(await page.locator('.nx-prepared-spray-entry').count(),1,'Enabled LIVE form must open');
  await page.locator('#nx-spray-count').fill('2');
  await page.locator('#nx-spray-review').click();
  assert.equal(await page.locator('#nx-spray-confirm').isVisible(),true);
  assert.match(await page.locator('#nx-spray-summary').innerText(),/No second deduction/);
  await page.locator('#nx-spray-save').click();
  await page.waitForFunction(key=>{
    const saved=JSON.parse(localStorage.getItem(key)||'{}');
    return saved.customPeptides?.['Fictional Spray QA']?.doses?.length===1;
  },key);
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  const bottle=saved.formulationStocks.find(x=>x.id==='test-bottle');
  assert.equal(bottle.remainingMg,3.8);assert.equal(bottle.remainingMl,1.9);
  assert.equal(bottle.transactions.length,1);
  assert.equal(saved.customPeptides['Fictional Spray QA'].doses[0].sourceContainerId,'test-bottle');
  assert.equal(saved.supplies.find(x=>x.id==='test-kit').vials[0].remainingMg,before);
  const undo=page.locator('#undo-btn');
  assert.equal(await undo.isVisible(),true,'Visible LIVE Undo toast required');
  assert.equal(await undo.evaluate(el=>el.getBoundingClientRect().height>=44),true,'Undo touch target below 44px');
  await undo.click();
  await page.waitForTimeout(220);
  const diagnosis=await page.evaluate(({key,txId,doseId})=>{
    const durable=JSON.parse(localStorage.getItem(key)||'{}');
    const persistent=v=>{const copy={...v};for(const k of Object.keys(copy))if(k.startsWith('_'))delete copy[k];return copy};
    const current=persistent(state),saved=persistent(durable);
    const changed=Object.keys({...current,...saved}).filter(k=>JSON.stringify(current[k])!==JSON.stringify(saved[k]));
    let plannerError=null;
    try{NexusPreparedDoseTransaction.reverseDose(durable,{transactionId:txId,reversalId:'diagnostic-only',compound:'Fictional Spray QA',doseId,sourceId:'test-bottle'});}
    catch(error){plannerError=error.message;}
    return {error:document.querySelector('#nx-validation-message')?.textContent||null,
      changed,plannerError,writer:nexusWriter().status(),
      stock:durable.formulationStocks?.find(x=>x.id==='test-bottle'),
      history:durable.customPeptides?.['Fictional Spray QA']?.doses};
  },{key,txId:bottle.transactions[0].id,doseId:bottle.transactions[0].doseId});
  console.log('NASAL LIVE UI UNDO DIAG '+width+'/'+theme,JSON.stringify(diagnosis));
  await page.waitForFunction(key=>{
    const saved=JSON.parse(localStorage.getItem(key)||'{}');
    return saved.customPeptides?.['Fictional Spray QA']?.doses?.length===0&&
      saved.formulationStocks?.find(x=>x.id==='test-bottle')?.transactions?.length===2;
  },key);
  const restored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  const b=restored.formulationStocks.find(x=>x.id==='test-bottle');
  assert.equal(b.remainingMg,4);assert.equal(b.remainingMl,2);
  assert.equal(restored.supplies.find(x=>x.id==='test-kit').vials[0].remainingMg,before);
  assert.deepEqual(errors,[],'No page errors');
  checks.push(width+'/'+theme);
  await ctx.close();
 }
 console.log('PASS real LIVE enabled spray UI at '+checks.join(', ')+': review, save, exact bottle/history debit, accessible Undo, verified restore; fictional contexts only');
}finally{await browser.close()}
