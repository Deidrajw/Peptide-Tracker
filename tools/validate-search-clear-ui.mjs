import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const v=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+v+'_FULL_DEMO.html');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const ok=(a,m)=>{if(!a)throw Error(m)};
let count=0;
try{
 for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
  const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof buildDemoState==='function'&&typeof nexusWireSearchClear==='function');
  await page.evaluate(t=>{state=buildDemoState('weight_loss');state.profile.onboardingDone=true;document.documentElement.dataset.theme=t;state.settings.supplements=['Magnesium','Creatine'];supplementModal('2026-11-06')},theme);
  const clear=async selector=>{
   const btn=page.locator('.nx-search-clear-wrap:has('+selector+') .nx-search-clear');
   ok(await btn.isVisible(),selector+' clear hidden');
   const m=await btn.boundingBox();ok(m&&m.width>=44&&m.height>=44,selector+' clear size');
   ok((await btn.getAttribute('aria-label')||'').includes('Clear'),selector+' accessible label');
   await btn.click();
  };
  await page.locator('.modal #supp-search').fill('Mag');await page.locator('#supp-results button.add').first().click();
  const selected=await page.locator('#supp-selected-count').innerText();await clear('.modal #supp-search');
  ok(await page.locator('.modal #supp-search').inputValue()===''&&await page.locator('#supp-selected-count').innerText()===selected,'Supplement selection lost');
  await page.evaluate(()=>{closeModal();state.peptides.Retatrutide={enabled:true,status:'active',route:'SubQ',scheduleDays:7,doses:[]};state.peptides['GHK-Cu']={enabled:true,status:'active',route:'SubQ',scheduleDays:7,doses:[]};comboDoseModal()});
  await page.locator('#combo-search').fill('Reta');await page.locator('#combo-choices .combo-compound-toggle:visible').first().click();
  const comboSelected=await page.locator('#combo-selected-count').innerText();await clear('#combo-search');
  ok(await page.locator('#combo-search').inputValue()===''&&await page.locator('#combo-selected-count').innerText()===comboSelected,'Combo selection lost');
  await page.evaluate(()=>{closeModal();state._stashFilter='all';state._stashGroup='none';state._stashSub='kits';state.supplies=[
   {id:99001,name:'Selank',totalVials:2,vialMg:5,bacMl:1,activeKit:false,vials:[{id:90011,status:'sealed',vialMg:5,remainingMg:5},{id:90012,status:'sealed',vialMg:5,remainingMg:5}],wasteLog:[],doseLog:[]},
   {id:99002,name:'GHK-Cu',totalVials:2,vialMg:50,bacMl:2,activeKit:true,vials:[{id:90021,status:'open',vialMg:50,remainingMg:30},{id:90022,status:'sealed',vialMg:50,remainingMg:50}],wasteLog:[],doseLog:[]}];
   nexusStashSearchTerm='';tab='stash';render()});
  await page.locator('#nx-stash-search').fill('Selank');
  ok(await page.locator('.nx-kit-card[data-kit-id="99001"]').count()===1,'Stash filtered kit missing');
  await clear('#nx-stash-search');
  ok(await page.locator('#nx-stash-search').inputValue()==='','Stash clear failed');
  ok(await page.locator('.nx-kit-card[data-kit-id="99002"]').count()===1,'Stash clear did not restore cards');
  ok(await page.evaluate(()=>document.activeElement?.id)==='nx-stash-search','Stash focus not restored');
  await page.evaluate(()=>{tab='calendar';state._protoCalSub='logs';state._logsMode='all';state._logsSearch='';render()});
  await page.locator('#nx-journal-search').fill('nomatchinghistory');await clear('#nx-journal-search');
  ok(await page.locator('#nx-journal-search').inputValue()===''&&await page.evaluate(()=>state._logsSearch)==='','History query clear failed');
  ok(!errors.length,'JS page errors: '+errors.join('; '));count++;await ctx.close();
 }
 console.log('PASS: '+count+' LIVE/DEMO viewport/theme sessions for supplement, combo, Stash and history search clear without lost selections');
}finally{await browser.close()}
