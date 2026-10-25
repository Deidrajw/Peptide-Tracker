import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version, demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
if(!fs.existsSync(demo))throw Error('Complete fictional DEMO missing');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const outcomes=[];const ensure=(test,message)=>{if(!test)throw Error(message)};
try {
 for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
  const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const pg=await ctx.newPage(),errors=[];pg.on('pageerror',e=>errors.push(e.message));
  await pg.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await pg.evaluate(t=>{
    state=buildDemoState('weight_loss');state.profile.onboardingDone=true;
    state.peptides={};state.customPeptides={};
    for(const n of ['Ingredient Only','Independently Stocked','Historically Logged','Not a Blend','Nasal Test']){
      state.customPeptides[n]={status:'active',route:n==='Nasal Test'?'Nasal':'SubQ',unit:'mg',doses:[]};
    }
    state.customPeptides['Historically Logged'].doses=[{dose:'1',date:'2026-10-20T09:00:00'}];
    state.supplies=[
      {id:123,name:'Fictional Blend',isBlend:true,composition:[{compound:'Ingredient Only',mg:5},{compound:'Independently Stocked',mg:5},{compound:'Historically Logged',mg:5}],vialMg:15,totalVials:2},
      {id:124,name:'Independently Stocked',isBlend:false,vialMg:5,totalVials:1}
    ];
    state.comboPresets=[{id:'p',name:'Evening stack',compounds:['Not a Blend','Independently Stocked']}];
    state._comboSelected=[];state._comboDoses={};state._comboSymptoms=[];state._comboNotes='';
    state.preparedDoses=[];state.protocols=[];
    document.documentElement.dataset.theme=t;
    comboDoseModal();
  },theme);
  const labels=await pg.locator('.combo-compound-toggle').evaluateAll(a=>a.map(el=>el.dataset.n));
  ensure(!labels.includes('Ingredient Only'),'Blend-only ingredient selectable as standalone');
  ensure(labels.includes('Independently Stocked'),'Separately stocked component excluded');
  ensure(labels.includes('Historically Logged'),'Standalone historical dose component excluded');
  ensure(labels.includes('Not a Blend'),'Independent ordinary compound excluded');
  ensure(!labels.includes('Nasal Test'),'Nasal compound incorrectly included');
  ensure(await pg.locator('.nx-combo-picker-panel').count()===1,'Bordered compound panel missing');
  ensure(await pg.locator('#combo-choices').evaluate(el=>getComputedStyle(el).overflowY==='auto'),'No bounded inner scrolling');
  ensure(await pg.locator('.nx-combo-picker-panel').innerText().then(x=>x.includes('Scroll for more compounds')),'Scroll affordance missing');
  ensure(await pg.locator('.field-label').allTextContents().then(a=>a.includes('SAVED COMBINATIONS')),'Saved combinations label missing');
  ensure(await pg.locator('.combo-preset-chip').count()===1,'Saved favourite missing');
  await pg.locator('#nx-combo-preset-select').selectOption('p');
  ensure(await pg.locator('.combo-compound-toggle[aria-checked="true"]').count()===2,'Existing favourite selection not retained');
  await pg.evaluate(()=>{closeModal();tab='home';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove())});
  const summary=pg.locator('details.app-detail').filter({has:pg.locator('summary', {hasText:'Needs attention'})}).first();
  if(await summary.count()) {
    const data=await summary.locator('summary').evaluate(e=>({arrow:e.querySelector('span:last-child')?.textContent?.trim(),content:getComputedStyle(e,'::after').content}));
    ensure(data.arrow!=='›','Needs attention still has right arrow');
    ensure(data.content!=='none','Shared CSS chevron absent');
  }
  ensure(errors.length===0,'Browser exceptions '+errors.join('; '));
  outcomes.push({kind,width,theme,status:'PASS'});await ctx.close();
 }
}finally{await browser.close();}
fs.writeFileSync('dist/Nexus_'+VERSION+'_BLEND_PICKER_QA.json',JSON.stringify({version:VERSION,outcomes},null,2));
console.log('Blend Combo Picker QA PASS: '+outcomes.length+' configurations');
