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
  await search.fill('Test Compound 50');
  await page.locator('.combo-compound-toggle:visible').click();
  ensure(await page.locator('#combo-selected-count').innerText().then(s=>s.includes('2 selected')),'Multi-select count failed');
  await page.locator('#nx-combo-continue').click();
  ensure(await page.locator('#nx-combo-setup-step').isVisible(),'Setup step not displayed');
  await page.locator('.combo-dose-input[data-n="Test Compound 49"]').fill('1.25');
  await page.locator('#combo-notes').fill('Fictional combo draft note');
  await page.locator('#nx-combo-back').click();
  ensure(await page.locator('#nx-combo-select-step').isVisible(),'Back did not restore Select');
  await page.locator('#nx-combo-continue').click();
  ensure(await page.locator('.combo-dose-input[data-n="Test Compound 49"]').inputValue()==='1.25','Back navigation discarded typed dose');
  ensure(await page.locator('#combo-notes').inputValue()==='Fictional combo draft note','Shared notes lost on selection');
  ensure(await search.evaluate(el=>el.dataset.preserved==='yes'),'Selection destroyed search field or dialog');
  ensure(await page.locator('#combo-fav-section').isVisible(),'Favorite affordance not revealed at 2 compounds');
  await page.locator('#combo-date').fill('2026-10-24T11:45');
  ensure(await page.locator('#nx-combo-preset-select').count()===1,'Compact saved combinations selector missing');
  await page.locator('#nx-combo-back').click();
  await page.locator('#nx-combo-preset-select').selectOption('pair-1');
  ensure(await page.locator('#combo-notes').inputValue()==='Fictional combo draft note','Favorite selection erased notes');
  ensure(await page.locator('#combo-date').inputValue()==='2026-10-24T11:45','Favorite selection erased date');
  ensure(await page.locator('.combo-dose-input[data-n="Test Compound 01"]').count()===1,'Favorite did not select first compound');
  ensure(await page.locator('.combo-preset-del').count()===1,'Favorite delete action missing');
  ensure(await page.locator('.combo-preset-del').getAttribute('aria-label')!==null,'Favorite delete action unlabeled');
  // Method + individual site behavior: the new source-aware planner must encode
  // separate records with their actual site, not copy the shared mixed site.
  await page.locator('input[name="nx-combo-grouping"][value="separate"]').check();
  await page.locator('#nx-combo-continue').click();
  ensure(await page.locator('#nx-combo-setup-step').isVisible(),'Separate setup not displayed');
  await page.locator('.combo-dose-input[data-n="Test Compound 01"]').fill('1');
  await page.locator('.combo-dose-input[data-n="Test Compound 02"]').fill('1');
  ensure(await page.locator('.nx-combo-individual-site-select:visible').count()===2,'Separate injection sites are not independently visible');
  await page.locator('.nx-combo-individual-site-select[data-n="Test Compound 01"]').selectOption('Abdomen — upper left');
  await page.locator('.nx-combo-individual-site-select[data-n="Test Compound 02"]').selectOption('Thigh — right (SubQ)');
  ensure(!await page.locator('#nx-combo-shared-site').isVisible(),'Shared site still visible for separate injections');
  await page.locator('#nx-combo-continue').click();
  ensure(await page.locator('#nx-combo-review-step').isVisible(),'Separate review not shown');
  ensure((await page.locator('#nx-combo-review-summary').innerText()).includes('Thigh — right (SubQ)'),'Separate site missing in review');
  await page.locator('#save').click();
  ensure(await page.evaluate(()=>{
    const a=state.customPeptides['Test Compound 01'].doses;
    const b=state.customPeptides['Test Compound 02'].doses;
    return a.length===1&&b.length===1&&a[0].method==='SubQ'&&b[0].method==='SubQ'&&
      a[0].site==='Abdomen — upper left'&&b[0].site==='Thigh — right (SubQ)'&&
      a[0].comboId===b[0].comboId&&a[0].comboAdministration==='separate_injection'&&
      b[0].comboAdministration==='separate_injection';
  }),'Separate injections were not attributed correctly');
  // The IM choices must be exactly the regular Log Dose method-specific list.
  await page.evaluate(()=>{
    state._comboSelected=['Test Compound 01','Test Compound 02'];
    comboDoseModal();
  });
  await page.locator('#nx-combo-continue').click();
  await page.locator('#nx-combo-method').selectOption('IM');
  ensure(await page.locator('#combo-site option').count()===6,'IM sites do not match regular Log Dose');
  await page.locator('#combo-site').selectOption('Deltoid — left (IM)');
  await page.locator('.combo-dose-input[data-n="Test Compound 01"]').fill('2');
  await page.locator('.combo-dose-input[data-n="Test Compound 02"]').fill('2');
  await page.locator('#nx-combo-continue').click();
  ensure(await page.locator('#nx-combo-review-step').isVisible(),'IM review not shown');
  await page.locator('#save').click();
  ensure(await page.evaluate(()=>{
    const a=state.customPeptides['Test Compound 01'].doses;
    const b=state.customPeptides['Test Compound 02'].doses;
    return a.length===2&&b.length===2&&a[1].method==='IM'&&b[1].method==='IM'&&
      a[1].site==='Deltoid — left (IM)'&&b[1].site==='Deltoid — left (IM)'&&
      a[1].comboAdministration==='mixed_syringe'&&b[1].comboAdministration==='mixed_syringe';
  }),'IM method/site not preserved on every dose record');


  // A labelled nasal vial must never be an injectable source, even when
  // the compound's name matches. Selecting an unavailable exact vial fails
  // before any physical inventory deduction.
  const backed=await page.evaluate(()=>{
    state.supplies=[
      {id:'K1',name:'Test Compound 03',activeKit:true,vialMg:10,totalVials:1,openedVials:1,
       _vialsBackfilled:true,_vialsRepaired:true,vials:[{id:'V1',status:'open',vialMg:10,remainingMg:8,bacMl:1.5,reconDate:'2026-10-28T08:00',intendedUse:'Injectable'}]},
      {id:'K2',name:'Test Compound 03',activeKit:true,vialMg:10,totalVials:1,openedVials:1,
       _vialsBackfilled:true,_vialsRepaired:true,vials:[{id:'V2',status:'open',vialMg:10,remainingMg:7,bacMl:2,reconDate:'2026-10-29T09:00',intendedUse:'Nasal'}]}
    ];
    const items=[{name:'Test Compound 03',doseVal:'2'},{name:'Test Compound 04',doseVal:'1'}];
    const opts={method:'SubQ',grouping:'mixed',sources:{'Test Compound 03':'K2:V2'}};
    const bad=planAndApplyComboDoses(items,'2026-11-05T09:00','Abdomen — upper left','', 'combo-bad',[],opts);
    const unchanged=state.supplies[0].vials[0].remainingMg===8&&state.supplies[1].vials[0].remainingMg===7;
    opts.sources['Test Compound 03']='K1:V1';
    const good=planAndApplyComboDoses(items,'2026-11-05T09:00','Abdomen — upper left','', 'combo-good',[],opts);
    return {bad:!bad.ok&&!!bad.error,unchanged,good:good.ok&&
      good.doses[0].dose.allocations.length===1&&
      good.doses[0].dose.allocations[0].vialId==='V1'&&
      good.doses[0].dose.method==='SubQ'&&
      state.supplies[0].vials[0].remainingMg===6&&
      state.supplies[1].vials[0].remainingMg===7};
  });
  ensure(backed.bad&&backed.unchanged&&backed.good,'Selected-source or nasal-vial safety assertions failed: '+JSON.stringify(backed));
  await page.evaluate(()=>{
    state._comboSelected=['Test Compound 03','Test Compound 04'];
    comboDoseModal();
  });
  await page.locator('#nx-combo-continue').click();
  ensure(await page.locator('.nx-combo-source[data-n="Test Compound 03"] option').count()===2,
    'Incorrect eligible source options; nasal vial should not appear');
  await page.locator('.nx-combo-source[data-n="Test Compound 03"]').selectOption('K1:V1');
  await page.locator('.nx-combo-vial-info[data-n="Test Compound 03"]').click();
  const preparation=await page.locator('.nx-combo-vial-detail[data-n="Test Compound 03"]').innerText();
  ensure(preparation.includes('1.5 mL')&&!preparation.includes('2 mL'),'Vial preparation disclosure mixed different physical vials');
  await page.locator('.nx-combo-mode-btn[data-source-mode="prepared"]').click();
  ensure(await page.locator('#nx-combo-prepared-sources').isVisible(),'Prepared state did not open');
  ensure(!await page.locator('#nx-combo-draw-fields').isVisible(),'Prepared state exposed draw-now inventory fields');
  await page.locator('.nx-combo-mode-btn[data-source-mode="draw"]').click();
  ensure(await page.locator('#nx-combo-draw-fields').isVisible(),'Draw now state did not restore inputs');

  ensure(errors.length===0,'Page exceptions: '+errors.join('; '));
  results.push({kind,width,theme,status:'PASS',cases:['50-item bounded scroll','filter','multi-select','draft notes/amount','saved favorite and date','separate sites and attribution','mixed IM attribution','source vial isolation','prepared-mode disclosure','no exceptions']});
  await ctx.close();
 }
}finally{await browser.close();}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/Nexus_'+VERSION+'_COMBO_PICKER_QA.json',JSON.stringify({version:VERSION,source:'fictional browser LIVE-local/full-demo',results},null,2));
console.log('Combo picker browser QA PASS: '+results.length+' live/demo 320/390 theme environments, 50 fictional compounds per case');