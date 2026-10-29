import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const engine=process.env.NEXUS_BROWSER==='webkit'?webkit:chromium;
const browser=await engine.launch({headless:true,...(engine===chromium?{args:['--no-sandbox']}:{})});
const results=[];
try {
 for(const width of [320,390])for(const theme of ['light','dark'])for(const kind of ['live','demo']){
  const ctx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+process.cwd()+'/dist/Nexus_'+version+'_FULL_DEMO.html',{waitUntil:'domcontentloaded'});
  await page.evaluate(theme=>{
   if(!isDemoMode())enterDemoMode('weight_loss');
   document.documentElement.dataset.theme=theme;
   state.profile.onboardingDone=true;
   // Dismiss fictional onboarding overlay before testing direct Stash taps.
   document.querySelectorAll('.modal-bg').forEach(bg=>{if(bg.querySelector('#ob-next'))bg.remove();});
   const banner=document.querySelector('#demo-banner');if(banner)banner.style.display='none';
   tab='stash';render();
  },theme);
  const before=await page.evaluate(()=>JSON.stringify(state.supplies));
  await page.evaluate(()=>supplyModal(null,null));
  assert.equal(await page.locator('.nx-kit-type-choice').count(),5,'One Add Kit flow requires five product forms');
  const layout=await page.locator('.nx-kit-type-picker').evaluate(section=>{
    const viewport=document.documentElement.clientWidth;
    const controls=[...section.querySelectorAll('.nx-kit-type-choice')];
    return {viewport,right:section.getBoundingClientRect().right,
      heights:controls.map(x=>x.getBoundingClientRect().height)};
  });
  assert.ok(layout.right<=layout.viewport+2,'Add Kit chooser overflow: '+JSON.stringify(layout));
  assert.ok(layout.heights.every(h=>h>=44),'Kit form below 44px target: '+JSON.stringify(layout));
  await page.locator('[data-kit-form="capsule-bottle"]').click();
  await page.locator('#nx-form-name').fill('Fictional Slew');
  await page.locator('#nx-form-count').fill('30');
  await page.locator('#nx-form-strength').fill('5');
  await page.locator('#nx-form-save').click();
  assert.equal(await page.locator('.nx-form-kit-card').count(),1,'capsules kit card missing');
  await page.evaluate(()=>supplyModal(null,null));
  await page.locator('[data-kit-form="nasal-bottle"]').click();
  await page.locator('#nx-form-name').fill('Fictional Slew');
  await page.locator('#nx-form-volume').fill('7');
  await page.locator('#nx-form-mg').fill('10');
  await page.locator('#nx-form-save').click();
  await page.locator('.nx-form-edit').first().click();
  await page.locator('#nx-form-count').fill('27');
  await page.locator('#nx-form-save').click();
  const editForm=await page.locator('.nx-form-stock-editor').count();
  assert.equal(editForm,0,'Adjustment modal did not close');
  const touch=await page.locator('.nx-form-edit').first().evaluate(el=>({
    height:el.getBoundingClientRect().height,
    right:el.getBoundingClientRect().right,
    viewport:document.documentElement.clientWidth
  }));
  assert.ok(touch.height>=44&&touch.right<=touch.viewport+2,'Adjustment control touch/overflow regression: '+JSON.stringify(touch));
  const after=await page.evaluate(()=>({
   stock:state.formulationStocks,
   demo:isDemoMode(),
   visible:document.querySelectorAll('.nx-form-kit-card').length
  }));
  // Compare original vial state from first snapshot, never infer formulations from kits.
  const current=await page.evaluate(()=>JSON.stringify(state.supplies));
  assert.equal(current,before,'existing vial kits changed');
  assert.equal(after.demo,true,'fictional test escaped demo mode');
  assert.equal(after.visible,2);
  assert.deepEqual(after.stock.map(x=>x.containerType),['capsule-bottle','nasal-bottle']);
  assert.equal(after.stock[0].remainingCount,27);
  assert.equal(after.stock[0].transactions[0].before.remainingCount,30);
  assert.equal(after.stock[1].remainingMl,7);
  assert.equal(after.stock[1].mgPerSpray,null);
  // Two open physical vials of one kit must be independently selectable.
  // No physical transfer or dose is written merely by changing the selected vial.
  await page.evaluate(()=>{
    const demoName='Fictional Source Selector';
    state.customPeptides=state.customPeptides||{};
    state.customPeptides[demoName]={enabled:true,route:'SubQ',doses:[]};
    state.supplies.push({id:992211,name:demoName,activeKit:true,preparationMethod:'SubQ',vialMg:10,
      totalVials:2,openedVials:2,vials:[
        {id:'source-a',sequenceNumber:1,status:'open',vialMg:10,remainingMg:7,intendedUse:'SubQ'},
        {id:'source-b',sequenceNumber:2,status:'open',vialMg:10,remainingMg:9,intendedUse:'SubQ'}]});
    doseModal(demoName);
  });
  const physicalChoices=page.locator('.kit-opt[data-kit="992211"]');
  assert.equal(await physicalChoices.count(),2,'Two vials in same kit must have separate source choices');
  assert.deepEqual(await physicalChoices.evaluateAll(items=>items.map(b=>b.dataset.vial)),['source-a','source-b']);
  assert.equal(await physicalChoices.evaluateAll(items=>items.filter(b=>b.getAttribute('aria-pressed')==='true').length),0,'Ambiguous kit/vial source must not be preselected');
  await physicalChoices.nth(1).click();
  assert.equal(await physicalChoices.nth(1).getAttribute('aria-pressed'),'true','Explicit source selection must mark only chosen vial');
  const untouchedSources=await page.evaluate(()=>state.supplies.find(k=>k.id===992211).vials.map(v=>v.remainingMg));
  assert.deepEqual(untouchedSources,[7,9],'Selecting a vial must not debit either balance');
  await page.evaluate(()=>{
    document.querySelector('#dose').value='1';
    document.querySelector('#save').click();
  });
  const exactCommitted=await page.evaluate(()=>{
    const k=state.supplies.find(k=>k.id===992211);
    const d=state.customPeptides['Fictional Source Selector'].doses;
    return {balances:k.vials.map(v=>v.remainingMg),doses:d.map(x=>({allocations:x.allocations,kitId:x.kitId}))};
  });
  assert.deepEqual(exactCommitted.balances,[7,8],'Dose must deduct only selected second vial');
  assert.equal(exactCommitted.doses.length,1,'One dose should be saved');
  assert.equal(String(exactCommitted.doses[0].allocations?.[0]?.vialId),'source-b','Dose ledger must retain exact vial ID');
  await page.evaluate(()=>closeModal());
  results.push({width,theme,kind,result:'PASS'});
  await ctx.close();
 }
} finally {await browser.close();}
console.log('PASS: '+engine.name()+' unified Add Kit chooser, capsule/nasal kit cards and untouched vial stock in '+results.length+' fictional LIVE/DEMO sessions');
