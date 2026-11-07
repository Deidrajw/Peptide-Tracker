import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const v=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+v+'_FULL_DEMO.html');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let count=0;
try{
 for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
  const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof buildDemoState==='function'&&typeof nxNasalCalcView==='function');
  await page.evaluate(t=>{
   state=buildDemoState('weight_loss');state.profile.onboardingDone=true;document.documentElement.dataset.theme=t;
   tab='amino';state._aminoSub='learn';state._learnSub='calc';nxCalculatorMode='injection';render();
   window.__qaBefore=JSON.stringify(state);
  },theme);
  assert.equal(await page.locator('#rc-syringe-choice').count(),1);
  await page.getByRole('tab',{name:'Nasal spray'}).click();
  assert.equal(await page.locator('#nx-nasal-mass').count(),1);
  assert.match(await page.locator('#nx-nasal-result').innerText(),/No record will be saved/);
  await page.locator('#nx-nasal-mass').fill('5');
  await page.locator('#nx-nasal-final').fill('5');
  await page.locator('#nx-nasal-pump').fill('0.1');
  assert.match(await page.locator('#nx-nasal-result').innerText(),/1 mg\/mL/);
  assert.match(await page.locator('#nx-nasal-result').innerText(),/100 mcg/);
  await page.locator('#nx-nasal-pump').fill('6');
  assert.match(await page.locator('#nx-nasal-result').innerText(),/Pump volume exceeds/);
  assert.doesNotMatch(await page.locator('#nx-nasal-result').innerText(),/mcg per actuation/i);
  await page.locator('#nx-nasal-pump').fill('0.1');
  await page.locator('#nx-nasal-unit').selectOption('mcg');
  await page.locator('#nx-nasal-mass').fill('5000');
  assert.match(await page.locator('#nx-nasal-result').innerText(),/100 mcg/);
  assert.equal(await page.evaluate(()=>JSON.stringify(state)===window.__qaBefore),true,'Transient nasal inputs must not change persistent app state');
  await page.getByRole('tab',{name:'Injection'}).click();
  assert.equal(await page.locator('#rc-syringe-choice').count(),1);
  assert.deepEqual(errors,[]);
  await context.close();count++;
 }
 console.log('PASS: '+count+' LIVE/DEMO 320/390 dark/light real full app injection-nasal navigation, mass parity, unsafe pump rejection and no writes');
}finally{await browser.close();}
