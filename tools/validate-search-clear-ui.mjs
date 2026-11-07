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
   const m=await btn.boundingBox();ok(m&&m.width>=44&&m.height>=44,selector+' clear size '+JSON.stringify(m)+' viewport '+width+' '+theme+' '+kind);
   ok((await btn.getAttribute('aria-label')||'').includes('Clear'),selector+' accessible label');
   const visual=await btn.evaluate(el=>{
    const svg=el.querySelector('svg'),a=el.getBoundingClientRect(),g=svg?.getBoundingClientRect();
    const css=getComputedStyle(el);
    return {iconWidth:g?.width,iconHeight:g?.height,stroke:svg?.getAttribute('stroke-width'),
      midOffset:g?Math.abs((g.top+g.height/2)-(a.top+a.height/2)):999,
      border:css.borderTopWidth,background:css.backgroundColor,
      colour:css.color,textColour:getComputedStyle(document.querySelector('.nx-search-clear-wrap input')).color};
   });
   ok(visual.iconWidth===16&&visual.iconHeight===16&&visual.stroke==='1.6',selector+' DS2 SVG geometry');
   ok(visual.midOffset<1,selector+' SVG not vertically centred');
   ok(visual.border==='0px'&&visual.background==='rgba(0, 0, 0, 0)',selector+' unexpected button chrome');
   ok(visual.colour!==visual.textColour,selector+' icon should be muted relative to input');
   await btn.click();
   ok(!(await btn.isVisible()),selector+' clear control remains visible with empty query');
  };
  await page.locator('.modal #supp-search').fill('Mag');await page.locator('#supp-results button.add').first().click();
  const selected=await page.locator('#supp-selected-count').innerText();await clear('#supp-search');
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
  await page.evaluate(()=>{
   const modal=openModal('<div>Fictional compound form</div>','#A78BFA');
   window.__qaBrowseChoice=[];
   nexusBrowseAllCompounds(modal,[{name:'Selank'},{name:'Retatrutide'}],o=>window.__qaBrowseChoice.push(o.name),'Sela');
  });
  ok(await page.locator('#nx-browser-search').inputValue()==='Sela','Browser query fixture missing');
  await clear('#nx-browser-search');
  ok(await page.locator('#nx-browser-search').inputValue()===''&&await page.locator('.nx-browser-choice').count()===2,'Compound browser query not cleared');
  ok(await page.evaluate(()=>window.__qaBrowseChoice.length)===0,'Compound browser clear incorrectly selected item');
  await page.evaluate(()=>{
   document.querySelector('.nx-compound-browser')?.remove();
   const container=document.createElement('div');container.id='qa-symptom-search';
   window.__qaSymptoms=[{name:'Headache',intensity:2}];
   container.innerHTML=symptomPickerHTML(window.__qaSymptoms,'#A78BFA');
   document.querySelector('.modal').appendChild(container);
   wireSymptomPicker(container,window.__qaSymptoms,'#A78BFA',()=>{});
   const input=container.querySelector('#nx-sym-combobox');
   input.value='Head';input.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await clear('#nx-sym-combobox');
  ok(await page.locator('#nx-sym-combobox').inputValue()==='','Symptom query not cleared');
  ok(await page.evaluate(()=>window.__qaSymptoms.length===1&&window.__qaSymptoms[0].intensity===2),'Symptom clear modified selected symptom');
  ok(!errors.length,'JS page errors: '+errors.join('; '));count++;await ctx.close();
 }
 console.log('PASS: '+count+' LIVE/DEMO viewport/theme sessions for supplement, combo, Stash, history, compound browser and symptom search clear without lost selections');
}finally{await browser.close()}
