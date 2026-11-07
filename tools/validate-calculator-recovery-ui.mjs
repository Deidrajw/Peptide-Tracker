import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+version+'_FULL_DEMO.html');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let passed=0;
try{
 for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
  const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof buildDemoState==='function'&&typeof reconCalcView==='function');
  // Complete the initial UI overlay before interacting with the injected fictional calculator fixture.
  if(await page.locator('#ob-skip').isVisible()) await page.locator('#ob-skip').click();
  await page.evaluate(t=>{
   state=buildDemoState('weight_loss');state.profile.onboardingDone=true;
   document.documentElement.dataset.theme=t;
   state._recon={vialMg:'1200',bacMl:'6',dose:'400',unit:'mg',freq:'daily',syringe:'1mL'};
   document.getElementById('app').innerHTML=reconCalcView();wireReconCalc();
  },theme);
  assert.equal(await page.locator('#rc-syringe-choice').count(),1);
  assert.equal(await page.locator('#rc-validation').isVisible(),true);
  assert.match(await page.locator('#rc-validation').innerText(),/exceeds the selected syringe capacity/i);
  assert.equal((await page.locator('#rc-results').innerText()).trim(),'','An invalid 1mL draw must show no result');
  assert.match(await page.locator('#rc-conc-hint').innerText(),/200\.00 mg\/mL/);
  await page.locator('[data-id="syringe"][data-val="3mL"]').click();
  assert.equal(await page.locator('#rc-validation').isVisible(),false);
  assert.match(await page.locator('#rc-results').innerText(),/2\.000 mL/);
  assert.deepEqual(errors,[],'No browser page errors');
  await ctx.close();passed++;
 }
 console.log('PASS: '+passed+' LIVE/DEMO 320/390 dark/light full-app syringe recovery, fail-closed warning and concentration');
}finally{await browser.close();}
