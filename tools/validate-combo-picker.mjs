import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

// Disposable synthetic state only — no production Pages/localStorage access.
const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
if(!fs.existsSync(demo))throw Error('Missing full app DEMO');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
const ensure=(ok,msg)=>{if(!ok)throw Error(msg)};
try {
 for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
  const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await page.evaluate(theme=>{
    state=buildDemoState('weight_loss');
    state.profile.onboardingDone=true;
    state.peptides={};state.customPeptides={};
    for(let i=1;i<=50;i++){
      const name='Test Compound '+String(i).padStart(2,'0');
      state.customPeptides[name]={enabled:true,status:'active',route:'SubQ',unit:'mg',scheduleDays:7,doses:[]};
    }
    state._comboSelected=[];state._comboDoses={};state._comboSymptoms=[];state._comboDate=null;state._comboSite=null;state._comboNotes='';
    state.preparedDoses=[];state.comboPresets=[{id:'pair-1',name:'Favorite pair',compounds:['Test Compound 01','Test Compound 02']}];
    document.documentElement.dataset.theme=theme;
    comboDoseModal();
  },theme);
  const list=page.locator('#combo-choices');
  ensure(await list.count()===1,'Combo selection list missing');
  ensure(await page.locator('.combo-compound-toggle').count()>=50,'50 tracked compounds not offered');
  ensure(await list.evaluate(el=>el.clientHeight)<=225,'List exceeds bounded 224px height');
  ensure(await list.evaluate(el=>el.scrollHeight>el.clientHeight),'Large library does not scroll internally');
  const search=page.locator('#combo-search');
  const originalNode=await search.evaluate(el=>{el.dataset.preserved='yes';return true});
  await search.fill('Test Compound 49');
  ensure(await page.locator('.combo-compound-toggle:visible').count()===1,'Search results not filtered');
  await page.locator('.combo-compound-toggle:visible').click();
  ensure(await page.locator('#combo-selected-count').innerText().then(s=>s.includes('1 selected')),'Selected count failed');
  ensure(await page.locator('.combo-dose-input[data-n="Test Compound 49"]').count()===1,'Dose field not revealed');
  await page.locator('.combo-dose-input[data-n="Test Compound 49"]').fill('1.25');
  await page.locator('#combo-notes').fill('Fictional combo draft note');
  await search.fill('Test Compound 50');
  await page.locator('.combo-compound-toggle:visible').click();
  ensure(await page.locator('#combo-selected-count').innerText().then(s=>s.includes('2 selected')),'Multi-select count failed');
  ensure(await page.locator('.combo-dose-input[data-n="Test Compound 49"]').inputValue()==='1.25','Re-select discarded typed dose');
  ensure(await page.locator('#combo-notes').inputValue()==='Fictional combo draft note','Shared notes lost on selection');
  ensure(await search.evaluate(el=>el.dataset.preserved==='yes'),'Selection destroyed search field or dialog');
  ensure(await page.locator('#combo-fav-section').isVisible(),'Favorite affordance not revealed at 2 compounds');
  await page.locator('#combo-date').fill('2026-10-24T11:45');
  await page.locator('.combo-preset-chip').click();
  ensure(await page.locator('#combo-notes').inputValue()==='Fictional combo draft note','Favorite selection erased notes');
  ensure(await page.locator('#combo-date').inputValue()==='2026-10-24T11:45','Favorite selection erased date');
  ensure(await page.locator('.combo-dose-input[data-n="Test Compound 01"]').count()===1,'Favorite did not select first compound');
  ensure(await page.locator('.combo-preset-del').count()===1,'Favorite delete action missing');
  ensure(await page.locator('.combo-preset-del').getAttribute('aria-label')!==null,'Favorite delete action unlabeled');
  ensure(errors.length===0,'Page exceptions: '+errors.join('; '));
  results.push({kind,width,theme,status:'PASS',cases:['50-item bounded scroll','filter','multi-select','draft notes/amount','saved favorite and date','separate delete','no exceptions']});
  await ctx.close();
 }
}finally{await browser.close();}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/Nexus_'+VERSION+'_COMBO_PICKER_QA.json',JSON.stringify({version:VERSION,source:'fictional browser LIVE-local/full-demo',results},null,2));
console.log('Combo picker browser QA PASS: '+results.length+' live/demo 320/390 theme environments, 50 fictional compounds per case');