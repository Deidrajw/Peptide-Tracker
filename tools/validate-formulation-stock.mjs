import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
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
   tab='stash';render();
  },theme);
  const before=await page.evaluate(()=>JSON.stringify(state.supplies));
  assert.equal(await page.locator('#nx-add-capsules').count(),1);
  await page.locator('#nx-add-capsules').click();
  await page.locator('#nx-form-name').fill('Fictional Slew');
  await page.locator('#nx-form-count').fill('30');
  await page.locator('#nx-form-strength').fill('5');
  await page.locator('#nx-form-save').click();
  assert.equal(await page.locator('.nx-form-stock-item').count(),1,'capsules card missing');
  await page.locator('#nx-add-nasal').click();
  await page.locator('#nx-form-name').fill('Fictional Slew');
  await page.locator('#nx-form-volume').fill('7');
  await page.locator('#nx-form-mg').fill('10');
  await page.locator('#nx-form-save').click();
  const after=await page.evaluate(()=>({
   sameSupplies:JSON.stringify(state.supplies)===window.__formStockBefore,
   stock:state.formulationStocks,
   demo:isDemoMode(),
   visible:document.querySelectorAll('.nx-form-stock-item').length
  }));
  // Compare original vial state from first snapshot, never infer formulations from kits.
  const current=await page.evaluate(()=>JSON.stringify(state.supplies));
  assert.equal(current,before,'existing vial kits changed');
  assert.equal(after.demo,true,'fictional test escaped demo mode');
  assert.equal(after.visible,2);
  assert.deepEqual(after.stock.map(x=>x.containerType),['capsule-bottle','nasal-bottle']);
  assert.equal(after.stock[0].remainingCount,30);
  assert.equal(after.stock[1].remainingMl,7);
  assert.equal(after.stock[1].mgPerSpray,null);
  results.push({width,theme,kind,result:'PASS'});
  await ctx.close();
 }
} finally {await browser.close();}
console.log('PASS: additive capsule and nasal Stash controls, untouched legacy kits in '+results.length+' LIVE/DEMO viewport/theme sessions');
