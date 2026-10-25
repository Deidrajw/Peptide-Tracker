import fs from 'node:fs'; import path from 'node:path'; import {chromium} from 'playwright';
const VERSION='v0.9.16-beta',demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');if(!fs.existsSync(demo))throw Error('Demo missing');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),results=[];const ensure=(x,msg)=>{if(!x)throw Error(msg)};
try { for(const mode of ['live','demo'])for(const width of [320,390])for(const theme of ['light','dark']){
 const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(mode==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
 await page.evaluate(t=>{state=buildDemoState('weight_loss');state.profile.onboardingDone=true;state.plans={goals:[{id:'g',name:'Fictional goal',category:'Recovery',status:'active',notes:'Fictional note',compounds:['Retatrutide']}],research:[{id:'r',compound:'Selank',status:'researching',reason:'Fictional research note',notes:'Research notes'}],shopping:[{id:'s',item:'Fictional supply',status:'needed',category:'supply'}]};state._plansSub='research';document.documentElement.dataset.theme=t;tab='plans';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());},theme);

 ensure(await page.evaluate(()=>typeof NEXUS_RELEASE==='object'&&NEXUS_RELEASE.version==='v0.9.16-beta'&&NEXUS_RELEASE.publicationStatus==='unverified'&&!shouldShowPublishedRelease()),'Unverified release must never auto-present as published');
 const releasePopup=await page.evaluate(()=>{
   const previous=NEXUS_RELEASE.publicationStatus;
   const key=NEXUS_SEEN_RELEASE_KEY;
   const old=localStorage.getItem(key);
   try{
     NEXUS_RELEASE.publicationStatus='published';localStorage.removeItem(key);
     showPublishedReleaseModal();
     const first=document.querySelector('#nx-release-dismiss');
     if(!first)return false;
     document.querySelector('#nx-release-later').click();
     if(!shouldShowPublishedRelease())return false;
     showPublishedReleaseModal();document.querySelector('#nx-release-dismiss').click();
     return localStorage.getItem(key)===NEXUS_RELEASE.version&&!shouldShowPublishedRelease();
   }finally{
     NEXUS_RELEASE.publicationStatus=previous;
     if(old===null)localStorage.removeItem(key);else localStorage.setItem(key,old);
     document.querySelectorAll('.modal-bg').forEach(x=>x.remove());
   }
 });
 ensure(releasePopup,'Published version must show once, Later defer and acknowledgement persist');


 await page.evaluate(()=>showOnboarding());
 ensure(await page.locator('#ob-fresh').count()===1 && await page.locator('#ob-restore').count()===1,'Welcome must offer both first-run choices');
 ensure(await page.locator('#ob-wrap').innerText().then(t=>t.includes('local storage')&&t.includes('Clearing browser data')),'Welcome must explain browser-local data loss risk');
 const restoreSafety=await page.evaluate(async()=>{
   const old=localStorage.getItem(STORE_KEY);
   let result=false;
   try{
     closeModal();showOnboarding();
     const picker=document.querySelector('#ob-restore-file');
     const valid={peptides:{},profile:{name:'Test'},settings:{},dailyLogs:[{id:'backup-only',date:'2026-10-01'}],supplies:[],protocols:[]};
     picker.files=new DataTransfer().files;
     const originalAlert=window.alert,originalConfirm=window.confirm;
     window.alert=()=>{};window.confirm=()=>true;
     try{
       const blob=new File([JSON.stringify(valid)],'backup.json',{type:'application/json'});
       const transfer=new DataTransfer();transfer.items.add(blob);picker.files=transfer.files;
       picker.dispatchEvent(new Event('change',{bubbles:true}));
       await new Promise(done=>setTimeout(done,50));
       const preview=document.querySelector('#ob-restore-preview')?.textContent||'';
       document.querySelector('#ob-confirm-restore')?.click();
       result=preview.includes('1 Check-Ins') && JSON.stringify(loadState())===old && !JSON.stringify(loadState()).includes('backup-only');
     }finally{window.alert=originalAlert;window.confirm=originalConfirm;}
   }finally{
     if(old===null)localStorage.removeItem(STORE_KEY);else localStorage.setItem(STORE_KEY,old);
     closeModal();
   }
   return result;
 });
 ensure(restoreSafety,'Restore preview or existing saved-record guard failed');
 await page.evaluate(()=>showOnboarding());
 await page.locator('#ob-fresh').click();
 ensure(await page.locator('.ob-goal').count()>0,'Start Fresh must preserve goal setup steps');
 await page.evaluate(()=>closeModal());

 ensure(await page.locator('.nx-plan-head').count()===1,'Research header missing');
 ensure(await page.locator('.nx-plan-head .compound-intel-btn').count()===0,'Intel still crowded in header');
 ensure(await page.locator('.nx-plan-secondary .compound-intel-btn').count()===1,'Research Intel lost');
 ensure(await page.locator('.nx-plan-head .manage-plan-btn').evaluate(e=>e.getBoundingClientRect().height)>=44,'Ellipsis touch target too small');
 ensure(await page.locator('.nx-plan-head .manage-plan-btn svg.nx-unified-more-svg').count()===1,'Management outline SVG missing');

 ensure(await page.locator('.nx-research-title').count()===1,'Research compound title hierarchy missing');

 const headRules=async(sel)=>page.locator(sel).first().evaluate(el=>{
   const title=el.querySelector('.nx-card-status'),button=el.querySelector('button.manage-plan-btn,button.manage-proto-btn,button.nx-kit-header-manage');
   if(!title||!button)return {ok:false,reason:'missing status or menu'};
   const sr=title.getBoundingClientRect(),br=button.getBoundingClientRect(),icon=button.querySelector('svg.nx-unified-more-svg');
   return {ok:sr.top>el.getBoundingClientRect().top&&br.height>=44&&br.width>=44&&!!icon&&sr.right<br.left+2,reason:'position/size/icon'};
 });
 const researchHeader=await headRules('.nx-research-card .nx-plan-head');
 ensure(researchHeader.ok,'Research title/status/menu parity '+researchHeader.reason);

 ensure(await page.locator('.nx-research-title').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))>=17,'Research title remains visually undersized');
 ensure(await page.locator('.nx-research-reason-label').innerText().then(t=>t.includes('RESEARCH REASON')),'Research reason label missing');
 ensure(await page.locator('.nx-research-card .nx-plan-intel').evaluate(e=>getComputedStyle(e).minHeight==='44px'),'Secondary Intel must keep accessible touch target');
 ensure(await page.locator('.nx-research-card .manage-plan-btn').evaluate(e=>getComputedStyle(e).backgroundColor!==getComputedStyle(e.closest('.nx-research-card')).backgroundColor),'Management surface must contrast against Research card');
 await page.evaluate(()=>{tab='amino';state._aminoSub='journal';state.dailyLogs=[{id:'j1',date:'2026-10-19',notes:'Fictional general reflection',symptoms:[]}];state._journalCompound='';render();});
 ensure(await page.locator('#journal-compound-filter').count()===1,'Journal compact source filter missing');
 ensure(await page.locator('.journal-comp-chip').count()===0,'Legacy horizontal Journal chip rail still present');
 await page.locator('#journal-compound-filter').selectOption('__general__');
 ensure(await page.evaluate(()=>state._journalCompound==='__general__'),'Journal filter change did not update view state');
 ensure(await page.locator('.nx-journal-entry').count()>=1,'General note filter hid valid source note');
 await page.evaluate(()=>{tab='plans';state._plansSub='research';render();});
 await page.evaluate(()=>nxCheckinComparison(7));
 ensure(await page.locator('#nx-report-focus').count()===1,'Check-In changes metric picker missing');
 ensure(await page.locator('.nx-focus-result').count()===1,'Focused Check-In comparison missing');
 ensure(await page.locator('.nx-report-records').count()===0,'Legacy nested Check-In scroll returned');
 await page.locator('#nx-report-focus').selectOption('__mood__');
 ensure(await page.locator('#nx-report-focus').inputValue()==='__mood__','Mood focus does not persist on comparison rerender');
 await page.locator('#nx-report-close').click();

 ensure(await page.locator('.nx-plan-intel svg.nx-plan-link-icon').count()===1,'Intel navigation outline SVG missing');
 await page.locator('.nx-plan-head .manage-plan-btn').click();
 ensure(await page.locator('#pm-edit').count()===1,'Manage existing editor missing');
 await page.locator('#x').click();
 await page.evaluate(()=>{state._plansSub='goals';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());});
 ensure(await page.locator('.nx-plan-item details>summary').count()===0,'Legacy duplicate Goal disclosure persists');
 ensure(await page.locator('.nx-plan-item .nx-open-goal').count()===1,'Single View goal entry missing');
 ensure((await headRules('.nx-plan-item .nx-plan-head')).ok,'Goal status/menu parity failed');
 ensure(await page.locator('.nx-plan-item .nx-open-goal').first().evaluate(e=>e.getBoundingClientRect().height)>=44,'View goal touch target too small');
 await page.locator('.nx-plan-item .nx-open-goal').first().click();
 ensure(await page.locator('.nx-goal-detail').count()===1,'Goal detail sheet did not open');
 ensure(await page.locator('.nx-goal-detail-tab').count()===3,'Goal detail sections missing');
 await page.locator('.nx-goal-detail-tab[data-tab="connections"]').click();
 ensure(await page.locator('#nx-goal-detail-content').innerText().then(t=>t.includes('No protocols linked yet')),'Missing linked protocols should show honest empty state');
 await page.locator('#nx-goal-detail-close').click();
 await page.evaluate(()=>{state.dailyLogs=[{id:'sym1',date:'2026-10-18',notes:'Skin felt calmer today',symptoms:[{name:'Skin irritation',intensity:2}],updates:[{time:'2026-10-18T18:00:00',notes:'Later unrelated update'}]},{id:'sym2',date:'2026-10-20',notes:'Unrelated headache reflection',symptoms:[{name:'Headache',intensity:4}]}];goalModal(state.plans.goals[0]);});
 await page.locator('#g-evidence-symptom').selectOption('Skin irritation');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].evidenceSymptom==='Skin irritation'&&state.dailyLogs.length===2),'Evidence selection or original Check-In history mutated');
 await page.locator('.nx-open-goal').first().click();
 await page.locator('.nx-goal-detail-tab[data-tab="activity"]').click();
 ensure(await page.locator('#nx-goal-detail-content').innerText().then(v=>v.includes('Skin irritation')&&v.includes('Intensity: 2')&&!v.includes('Headache')),'Activity must show only matched symptom and recorded intensity');
 ensure(await page.locator('#nx-goal-detail-content').innerText().then(v=>v.includes('Skin felt calmer today')&&v.includes('CHECK-IN REFLECTION FROM THE SAME ENTRY')&&!v.includes('Unrelated headache reflection')&&!v.includes('Later unrelated update')),'A6a must show only the exact matched source Check-In daily reflection');
 ensure(await page.evaluate(()=>state.plans.goals[0].notes!== 'Skin felt calmer today'&&state.dailyLogs[0].notes==='Skin felt calmer today'&&state.dailyLogs.length===2),'A6a source reflection may not mutate or clone saved notes');
 ensure(await page.locator('.nx-goal-checkin-source').count()===1,'A6a must link only to original matched Check-In ID');
 await page.evaluate(()=>{state.dailyLogs[0].notes='Edited original reflection';});
 await page.locator('.nx-goal-detail-tab[data-tab="overview"]').click();await page.locator('.nx-goal-detail-tab[data-tab="activity"]').click();
 ensure(await page.locator('#nx-goal-detail-content').innerText().then(v=>v.includes('Edited original reflection')&&!v.includes('Skin felt calmer today')),'Edited canonical Check-In note must update Goal view without copied state');
 await page.evaluate(()=>{state.dailyLogs[0].notes='';});
 await page.locator('.nx-goal-detail-tab[data-tab="overview"]').click();await page.locator('.nx-goal-detail-tab[data-tab="activity"]').click();
 ensure(await page.locator('.nx-goal-reflection').count()===0,'Empty original note must not appear as reflection');
 await page.evaluate(()=>{state.dailyLogs[0].notes='Restored original note';});
 await page.locator('.nx-goal-detail-tab[data-tab="overview"]').click();await page.locator('.nx-goal-detail-tab[data-tab="activity"]').click();
 await page.locator('.nx-goal-checkin-source').click();
 ensure(await page.locator('#nx-goal-detail-content').count()===0,'Source action should close Goal Details before opening existing Check-In');
 await page.evaluate(()=>closeModal()); // Close the original Check-In modal opened via source link.

 await page.evaluate(()=>{state.weightLogs=[{id:'w1',date:'2026-10-01',weight:190},{id:'w2',date:'2026-10-20',weight:185}];state.settings.weightUnit='lbs';goalModal(state.plans.goals[0]);});
 await page.locator('#g-progress-type').selectOption('numeric');
 await page.locator('#g-p-baseline').fill('200');
 await page.locator('#g-p-target').fill('180');
 await page.locator('#g-p-unit').fill('lb');
 await page.locator('#g-p-source').selectOption('weightLogs');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.source==='weightLogs'&&state.weightLogs.length===2),'Numeric model save or weight history preservation failed');
 await page.locator('.nx-open-goal').first().click();
 ensure(await page.locator('#nx-goal-detail-content').innerText().then(t=>t.includes('185')&&t.includes('75%')),'Goal weight progress did not use latest dated record');
 await page.locator('#nx-goal-detail-close').click();
 await page.evaluate(()=>goalModal(state.plans.goals[0]));
 await page.locator('#g-progress-type').selectOption('subjective');
 await page.locator('#g-p-rating').selectOption('4');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.rating===4),'Subjective rating save failed');
 await page.evaluate(()=>goalModal(state.plans.goals[0]));
 await page.locator('#g-progress-type').selectOption('milestones');
 await page.locator('#g-p-milestones').fill(['One','Two'].join(String.fromCharCode(10)));
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.milestones.length===2),'Milestones save failed');
 await page.evaluate(()=>goalModal(state.plans.goals[0]));
 await page.locator('#g-progress-type').selectOption('exploratory');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.type==='exploratory'&&state.plans.goals[0].notes==='Fictional note'),'Exploratory save or legacy notes preservation failed');

 await page.evaluate(()=>{state._plansSub='shopping';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());});
 ensure(await page.locator('.nx-shopping-row .manage-plan-btn').count()===1,'Shopping edit menu lost');

 await page.evaluate(()=>{state.protocols=[{id:'qa-proto',name:'Fictional Protocol',status:'draft',compounds:[],schedule:{type:'weekly'}}];tab='protocols';render();});
 ensure(await page.locator('.nexus-protocol-card-head .nx-card-status').count()===1,'Protocol status must be in title stack');
 const protoHeader=await page.locator('.nexus-protocol-card-head').first().evaluate(h=>{
   const status=h.querySelector('.nx-card-status'),btn=h.querySelector('.manage-proto-btn'),title=h.querySelector('.nx-proto-title');
   if(!status||!btn||!title)return false;
   const p=status.getBoundingClientRect(),t=title.getBoundingClientRect(),b=btn.getBoundingClientRect();
   return p.top>t.top&&p.right<=b.left+2&&b.width>=44&&b.height>=44&&!!btn.querySelector('.nx-unified-more-svg');
 });
 ensure(protoHeader,'Protocol title/status/ellipsis visual parity failed');

 ensure(errors.length===0,'Exceptions: '+errors.join('; '));
 results.push({mode,width,theme,status:'PASS'});await ctx.close();
}}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_PLANS_QA.json',JSON.stringify({version:VERSION,results},null,2));console.log('Plans hierarchy QA PASS: '+results.length);
