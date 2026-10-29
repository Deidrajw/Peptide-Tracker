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
  results.push({width,theme,kind,result:'PASS'});
  await ctx.close();
 }
} finally {await browser.close();}
console.log('PASS: '+engine.name()+' unified Add Kit chooser, capsule/nasal kit cards and untouched vial stock in '+results.length+' fictional LIVE/DEMO sessions');
