import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+version+'_FULL_DEMO.html');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const fixture=()=>({id:'fictional-container-a',compound:'Fictional Compound A',
 containerType:'nasal-bottle',method:'Nasal',balanceStatus:'verified',
 remainingMg:0.45,remainingMl:9,mgPerSpray:0.05,mlPerSpray:0.1});
// Browsers: production-shaped gate and isolated fictional DEMO error both
// exercised against the full exact-source app, never private records.
let passed=0;
try {
 for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
  const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof buildDemoState==='function'&&typeof nexusNasalDoseModal==='function');
  const before=await page.evaluate(({mode,theme})=>{
   state=buildDemoState('weight_loss');state.profile.onboardingDone=true;
   document.documentElement.dataset.theme=theme;
   // The offline full-app DEMO is a fictional in-memory app; LIVE is a test
   // page with injected fictional state and no interaction with personal data.
   if(mode==='live')_demoActive=false;
   state.formulationStocks=[{id:'fictional-container-a',compound:'Fictional Compound A',
    containerType:'nasal-bottle',method:'Nasal',balanceStatus:'verified',
    remainingMg:0.45,remainingMl:9,mgPerSpray:0.05,mlPerSpray:0.1}];
   const snapshot=JSON.stringify(state.formulationStocks);
   nexusNasalDoseModal('Fictional Compound A');
   return snapshot;
  },{mode:kind,theme});
  if(kind==='live'){
   const gate=page.locator('.nx-nasal-save-gate');
   assert.equal(await gate.isVisible(),true,'LIVE nasal save gate should be visible');
   assert.match(await gate.innerText(),/temporarily disabled/i);
   assert.equal(await page.locator('#nx-spray-save').count(),0,'LIVE must not show Confirm & save');
   assert.equal(await page.locator('#nx-spray-review').count(),0,'LIVE must not show bogus review');
   const close=page.locator('#nx-nasal-gate-close');
   const bounds=await close.boundingBox();
   assert(bounds&&bounds.height>=44,'Close action needs 44px minimum height');
   await close.click();
  }else{
   assert.equal(await page.locator('#nx-spray-save').count(),1,'DEMO planner should remain accessible');
   await page.locator('#nx-spray-count').fill('4');
   await page.locator('#nx-spray-review').click();
   assert.equal(await page.locator('#nx-spray-confirm').isVisible(),true);
   await page.locator('#nx-spray-save').click();
   assert.equal(await page.locator('#nx-spray-save-error').isVisible(),true,
    'Rejected DEMO entry must show inline error adjacent to save');
   assert.match(await page.locator('#nx-spray-save-error').innerText(),/Nothing was saved/i);
   assert.equal(await page.locator('#nx-spray-save').isEnabled(),true,
    'User should be able to edit and retry after validation');
   // Repair ONLY fictional ledger metadata and retry the exact same entry.
   // A valid DEMO planner save must complete atomically, not remain stuck.
   await page.evaluate(()=>{state.formulationStocks[0].transactions=[];});
   await page.locator('#nx-spray-save').click();
   assert.equal(await page.locator('#nx-spray-confirm').count(),0,
    'Valid fictional confirmation should close after save');
   assert.equal(await page.evaluate(()=>state.formulationStocks[0].remainingMl),8.6,
    'Valid DEMO spray save must debit prepared bottle volume exactly once');
   assert.equal(await page.evaluate(()=>
     (state.customPeptides['Fictional Compound A']?.doses||[]).some(x=>x.method==='Nasal'&&x.sprayCount===4)
       ||(state.peptides['Fictional Compound A']?.doses||[]).some(x=>x.method==='Nasal'&&x.sprayCount===4)),true,
    'Valid DEMO save must create a matching fictional historical dose');
  }
  if(kind==='live')assert.equal(await page.evaluate(()=>JSON.stringify(state.formulationStocks)),before,
   'Gated LIVE dose must not change prepared inventory');
  assert.deepEqual(errors,[],'No browser page errors');
  await ctx.close();passed++;
 }
 console.log('PASS: '+passed+' FULL APP LIVE/DEMO nasal save gate or inline error viewport/theme browser configurations');
}finally{await browser.close()}
