import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+version+'_FULL_DEMO.html');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let count=0;
try{
 for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
  const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof nexusNasalDoseModal==='function'&&typeof buildDemoState==='function');
  await page.evaluate(t=>{
   // Fully fictional app state: even the LIVE-source page never receives real user data.
   if(document.querySelector('.modal'))closeModal();
   state=buildDemoState('weight_loss');state.profile.onboardingDone=true;
   document.documentElement.dataset.theme=t;
   window.__nasalQABefore=JSON.stringify(state);
   window.__nasalQAStorage=localStorage.getItem('peptide-tracker-html-v1');
   // Exercise candidate-enabled source validation in both channels with no prepared bottle.
   _demoActive=false;
   nexusNasalDoseModal('Fictional Compound');
  },theme);
  const warning=page.locator('#nx-validation-message');
  assert.equal(await warning.isVisible(),true,'LIVE gate must show accessible warning');
  assert.match(await warning.innerText(),/No verified prepared nasal bottle/i);
  assert.equal(await warning.getAttribute('role'),'alert');
  assert.equal(await page.locator('.nx-prepared-spray-entry').count(),0,'Missing prepared source must never open a save form');
  assert.equal(await page.evaluate(()=>JSON.stringify(state)===window.__nasalQABefore),true,'No app state mutation');
  assert.equal(await page.evaluate(()=>localStorage.getItem('peptide-tracker-html-v1')===window.__nasalQAStorage),true,'No storage mutation');
  assert.deepEqual(errors,[],'No JS errors');
  await context.close();count++;
 }
 console.log('PASS: '+count+' LIVE/DEMO 320/390 dark/light fictional sessions: candidate-enabled missing-source warning, no misleading form, no state/storage writes');
}finally{await browser.close();}
