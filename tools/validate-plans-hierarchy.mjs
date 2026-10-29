import fs from 'node:fs'; import path from 'node:path'; import {chromium} from 'playwright';
const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version,demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');if(!fs.existsSync(demo))throw Error('Demo missing');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),results=[];const ensure=(x,msg)=>{if(!x)throw Error(msg)};
try { for(const mode of ['live','demo'])for(const width of [320,390])for(const theme of ['light','dark']){
 const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(mode==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
 await page.evaluate(t=>{state=buildDemoState('weight_loss');state.profile.onboardingDone=true;state.plans={goals:[{id:'g',name:'Fictional goal',category:'Recovery',status:'active',notes:'Fictional note',compounds:['Retatrutide']}],research:[{id:'r',compound:'Selank',status:'researching',reason:'Fictional research note',notes:'Research notes'}],shopping:[{id:'s',item:'Fictional supply',status:'needed',category:'supply'}]};state._plansSub='research';document.documentElement.dataset.theme=t;tab='plans';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());},theme);

 const status=JSON.parse(fs.readFileSync('release/release.json','utf8')).publication.status;
 ensure(await page.evaluate(expected=>typeof NEXUS_RELEASE==='object'&&NEXUS_RELEASE.version===document.title.replace('Nexus · ','')&&NEXUS_RELEASE.publicationStatus===expected&&(expected==='published'||!shouldShowPublishedRelease()),status),'Runtime publication status must match manifest; unpublished release must stay silent');
 const releasePopup=await page.evaluate(()=>{
   const previous=NEXUS_RELEASE.publicationStatus;
   const key=NEXUS_SEEN_RELEASE_KEY;
   const old=localStorage.getItem(key),laterKey=NEXUS_RELEASE_LATER_KEY,oldLater=sessionStorage.getItem(laterKey),originalIsDemoMode=isDemoMode;
   try{
     NEXUS_RELEASE.publicationStatus='published';localStorage.removeItem(key);
     if(isDemoMode()&&shouldShowPublishedRelease())throw Error('Demo Mode release suppression broken');
     // The stand-alone full-app DEMO intentionally suppresses publication popups;
     // test the fictional eligible-user path separately and restore the guard.
     isDemoMode=()=>false;
     sessionStorage.removeItem(laterKey);
     showPublishedReleaseModal();
     const first=document.querySelector('#nx-release-dismiss');
     if(!first)return false;
     document.querySelector('#nx-release-later').click();
     if(shouldShowPublishedRelease())return false; // Later defers for this app session
     sessionStorage.removeItem(laterKey); // simulate a new app session, without real data writes
     if(!shouldShowPublishedRelease())return false;
     showPublishedReleaseModal();document.querySelector('#nx-release-dismiss').click();
     return localStorage.getItem(key)===NEXUS_RELEASE.version&&!shouldShowPublishedRelease();
   }finally{
     NEXUS_RELEASE.publicationStatus=previous;
     isDemoMode=originalIsDemoMode;
     if(old===null)localStorage.removeItem(key);else localStorage.setItem(key,old);
     if(oldLater===null)sessionStorage.removeItem(laterKey);else sessionStorage.setItem(laterKey,oldLater);
     document.querySelectorAll('.modal-bg').forEach(x=>x.remove());
   }
 });
 ensure(releasePopup,'Published version must show once, Later defer and acknowledgement persist');

 // Broader diagnostic sweep of main navigation surfaces. Scans computed foreground
 // vs the nearest visible surface for text-bearing elements. It reports candidates,
 // while the separately enforced release modal action check is a hard blocker.
 // Transparency, pseudo-elements and imagery require human visual review.
 const themeAudit=await page.evaluate(()=>{
   const tabs=['home','calendar','protocols','stash','plans','profile','trends','amino','learn'];
   const out=[];
   const parse=(raw)=>{
     const m=(raw||'').match(/^rgba?\(([^)]+)\)$/);if(!m)return null;
     const vals=m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
     return vals.length>=3?[vals[0],vals[1],vals[2],vals[3]??1]:null;
   };
   const over=(a,b)=>{const k=Math.min(1,Math.max(0,a[3]));return [0,1,2].map(i=>a[i]*k+b[i]*(1-k)).concat([1]);};
   const lum=c=>{const q=c.slice(0,3).map(n=>{let v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return .2126*q[0]+.7152*q[1]+.0722*q[2]};
   const ratio=(a,b)=>{let x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
   const bgFor=el=>{
     let chain=[],p=el;while(p&&p.nodeType===1){chain.unshift(p);p=p.parentElement;}
     let bg=[255,255,255,1];
     for(const node of chain){const cs=getComputedStyle(node),rgb=parse(cs.backgroundColor);if(rgb)bg=over(rgb,bg);}
     return bg;
   };
   const previous=tab;
   try{for(const name of tabs){
     tab=name;render();
     for(const el of document.querySelectorAll('#app button,#app a,#app label,#app p,#app h1,#app h2,#app h3,#app span,#app small,#app strong,#app summary')){
       const direct=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
       if(!direct||direct.length<2)continue;
       const cs=getComputedStyle(el),rect=el.getBoundingClientRect();
       if(rect.width<2||rect.height<2||cs.display==='none'||cs.visibility!=='visible'||Number(cs.opacity)<.2)continue;
       const ink=parse(cs.color);if(!ink)continue;
       const bg=bgFor(el),fg=over(ink,bg),value=ratio(fg,bg);
       if(value<4.5)out.push({tab:name,tag:el.tagName,cls:String(el.className||'').slice(0,65),text:direct.slice(0,65),ratio:Math.round(value*100)/100,foreground:cs.color,background:'rgb('+bg.slice(0,3).map(v=>Math.round(v)).join(',')+')',fontSize:cs.fontSize,fontWeight:cs.fontWeight,rect:{x:Math.round(rect.x),y:Math.round(rect.y),w:Math.round(rect.width),h:Math.round(rect.height)}});
     }
   }}finally{tab=previous;render();}
   return {tabs:tabs.length,total:out.length,candidates:out};
 });
 if(mode==='demo'&&width===390){console.log('THEME CONTRAST AUDIT '+theme+' '+JSON.stringify(themeAudit));fs.writeFileSync('dist/Nexus_'+VERSION+'_CONTRAST_ELEMENT_EVIDENCE_'+theme+'.json',JSON.stringify({version:VERSION,mode,width,theme,audit:themeAudit},null,2));}


 // Verify rendered visibility and WCAG AA text contrast, not merely click handlers.
 const releaseContrast=await page.evaluate(()=>{
   const old=NEXUS_RELEASE.publicationStatus,key=NEXUS_SEEN_RELEASE_KEY,seen=localStorage.getItem(key),originalIsDemoMode=isDemoMode,oldLater=sessionStorage.getItem(NEXUS_RELEASE_LATER_KEY);
   const luminance=(str)=>{
     const raw=str.match(/[0-9.]+/g)||[];
     if(raw.length<3)return null;
     const cs=raw.slice(0,3).map(n=>{let v=Math.min(255,Math.max(0,Number(n)))/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
     return .2126*cs[0]+.7152*cs[1]+.0722*cs[2];
   };
   const ratio=(a,b)=>{let x=luminance(a),y=luminance(b);return x===null||y===null?0:(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
   try{
     NEXUS_RELEASE.publicationStatus='published';localStorage.removeItem(key);
     isDemoMode=()=>false; // fictional eligible user for accessibility geometry test
     sessionStorage.removeItem(NEXUS_RELEASE_LATER_KEY);
     showPublishedReleaseModal();
     return ['#nx-release-later','#nx-release-dismiss'].map(sel=>{
       const el=document.querySelector(sel),cs=el&&getComputedStyle(el),rect=el&&el.getBoundingClientRect();
       const bg=cs?.backgroundColor,fg=cs?.color;
       return {sel,visible:!!el&&cs.visibility!=='hidden'&&cs.display!=='none'&&Number(cs.opacity)>.2&&rect.width>=44&&rect.height>=44,fg,bg,contrast:ratio(fg,bg)};
     });
   } finally {
     NEXUS_RELEASE.publicationStatus=old;
     isDemoMode=originalIsDemoMode;
     if(seen===null)localStorage.removeItem(key);else localStorage.setItem(key,seen);
     if(oldLater===null)sessionStorage.removeItem(NEXUS_RELEASE_LATER_KEY);else sessionStorage.setItem(NEXUS_RELEASE_LATER_KEY,oldLater);
     document.querySelectorAll('.modal-bg').forEach(x=>x.remove());
   }
 });
 ensure(releaseContrast.length===2&&releaseContrast.every(x=>x.visible&&x.contrast>=4.5),'Release modal actions must have visible 44px+ targets and >=4.5:1 foreground contrast: '+JSON.stringify(releaseContrast));

 const themeTokenContrast=await page.evaluate(()=>{
   const css=getComputedStyle(document.documentElement),vars=['--t3','--t4','--t5'],surfaces=['--surface','--surface-2','--surface-3'];
   const rgb=(x)=>{x=x.trim().replace('#','');if(x.length===3)x=x.split('').map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(x.slice(i,i+2),16))};
   const lum=(s)=>{const v=rgb(s).map(x=>{const c=x/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return .2126*v[0]+.7152*v[1]+.0722*v[2]};
   const ratio=(a,b)=>{let l=lum(a),r=lum(b);return (Math.max(l,r)+.05)/(Math.min(l,r)+.05)};
   const result=[];for(const text of vars)for(const surface of surfaces){
     const contrast=ratio(css.getPropertyValue(text),css.getPropertyValue(surface));
     result.push({text,surface,contrast:Math.round(contrast*100)/100});
   }
   return result;
 });
 ensure(themeTokenContrast.every(x=>x.contrast>=4.5),'Muted token text must remain AA legible on all neutral cards: '+JSON.stringify(themeTokenContrast));




 await page.evaluate(()=>showOnboarding());
 ensure(await page.locator('#ob-fresh').count()===1 && await page.locator('#ob-restore').count()===1,'Welcome must offer both first-run choices');
 ensure(await page.locator('#ob-wrap').innerText().then(t=>t.includes('local storage')&&t.includes('Clearing browser data')),'Welcome must explain browser-local data loss risk');
 const restoreSafety=await page.evaluate(async()=>{
   const old=localStorage.getItem(STORE_KEY);
   const protectedCopy={...JSON.parse(JSON.stringify(state)),dailyLogs:[{id:'protected-live',date:'2026-10-11',notes:'must preserve'}]};
   const protectedRaw=JSON.stringify(protectedCopy);
   let result=false;
   try{
     localStorage.setItem(STORE_KEY,protectedRaw);
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
       const hasButton=!!document.querySelector('#ob-confirm-restore');
       document.querySelector('#ob-confirm-restore')?.click();
       result={preview,hasOriginal:localStorage.getItem(STORE_KEY)===protectedRaw,backupAbsent:!JSON.stringify(loadState()).includes('backup-only'),hasButton};
     }finally{window.alert=originalAlert;window.confirm=originalConfirm;}
   }finally{
     if(old===null)localStorage.removeItem(STORE_KEY);else localStorage.setItem(STORE_KEY,old);
     closeModal();
   }
   return result;
 });
 ensure(restoreSafety.preview.includes('1 Check-Ins')&&restoreSafety.hasOriginal&&restoreSafety.backupAbsent&&restoreSafety.hasButton,'Restore preview or saved-record guard failed: '+JSON.stringify(restoreSafety));
 await page.evaluate(()=>showOnboarding());
 await page.locator('#ob-fresh').click();
 ensure(await page.locator('.ob-goal').count()>0,'Start Fresh must preserve goal setup steps');
 await page.evaluate(()=>closeModal());

 await page.evaluate(()=>showOnboarding());
 await page.locator('#ob-fresh').click();
 await page.locator('#ob-next').click();
 await page.locator('#ob-next').click();
 ensure(await page.locator('.nx-ob-next-card').count()===4,'Getting Started must show all four feature cards');
 ensure(await page.locator('.nx-ob-next-icon svg').count()===4,'Feature cards must use matching outline SVG icons');
 ensure(await page.locator('.nx-ob-guide svg').count()===1,'Getting Started guide must use matching outline SVG icon');
 ensure(await page.locator('.nx-ob-next-card').first().innerText().then(x=>x.includes('Log a dose')&&x.includes('Today')),'Log Dose quick action missing context');
 ensure(await page.locator('.nx-ob-next-card').first().evaluate(e=>parseFloat(getComputedStyle(e).minHeight)>=60),'Getting Started cards too small');
 await page.evaluate(()=>closeModal());
 ensure(await page.locator('.nx-plan-head').count()===1,'Research header missing');
 ensure(await page.locator('.nx-plan-head .compound-intel-btn').count()===0,'Intel still crowded in header');
 ensure(await page.locator('.nx-plan-secondary .compound-intel-btn').count()===1,'Research Intel lost');
 ensure(await page.locator('.nx-plan-head .manage-plan-btn').evaluate(e=>e.getBoundingClientRect().height)>=44,'Ellipsis touch target too small');
 ensure(await page.locator('.nx-plan-head .manage-plan-btn svg.nx-unified-more-svg').count()===1,'Management outline SVG missing');

 ensure(await page.locator('.nx-research-title').count()===1,'Research compound title hierarchy missing');
 ensure(await page.locator('#add-research').count()===1,'Top Add Research missing or duplicated');
 ensure(await page.locator('.nx-research-page-header #add-research').count()===1,'Add Research not at top of queue');
 ensure(await page.locator('.nx-research-card .nx-plan-link-icon').count()===1,'Research card must have exactly one visible navigation chevron');
 ensure(await page.locator('.nx-research-note-toggle svg path').count()===1,'Notes toggle icon unexpected: use notebook, not a chevron');
 ensure(await page.locator('.nx-research-note-toggle').getAttribute('aria-expanded')==='false','Notes should start collapsed');
 ensure(await page.locator('.nx-research-note-body').isHidden(),'Research notes initially visible');
 await page.locator('.nx-research-note-toggle').click();
 ensure(await page.locator('.nx-research-note-body').isVisible(),'Research notes did not expand');
 ensure(await page.locator('.nx-research-note-toggle').getAttribute('aria-expanded')==='true','Research notes missing expanded aria state');
 await page.locator('.nx-research-note-toggle').click();
 ensure(await page.locator('.nx-research-note-body').isHidden(),'Research notes failed to collapse');
 const dividers=await page.locator('.nx-research-card').first().evaluate(card=>{
   const wrapper=card.querySelector('.nx-plan-secondary'),button=card.querySelector('.nx-plan-intel');
   return {wrapper:getComputedStyle(wrapper).borderTopWidth,button:getComputedStyle(button).borderTopWidth};
 });
 ensure(dividers.wrapper==='1px'&&dividers.button==='0px','Research Intel has double divider: '+JSON.stringify(dividers));
 await page.locator('.nexus-tabbar-v2 button[data-tab="more"]').click();
 await page.locator('.nexus-more-item').filter({hasText:'Plans'}).click();
 ensure(await page.locator('.plans-sub[data-sub="goals"]').getAttribute('aria-selected')==='true','Opening Plans from More must default to Goals');
 await page.locator('.plans-sub[data-sub="research"]').click();
 ensure(await page.locator('.plans-sub[data-sub="research"]').getAttribute('aria-selected')==='true','Research subtab should stay navigable');
 await page.locator('.nexus-tabbar-v2 button[data-tab="more"]').click();
 await page.locator('.nexus-more-item').filter({hasText:'Plans'}).click();
 ensure(await page.locator('.plans-sub[data-sub="goals"]').getAttribute('aria-selected')==='true','Returning to Plans must reset to Goals');
 await page.locator('.plans-sub[data-sub="research"]').click();
 await page.locator('#add-research').click();
 ensure(await page.locator('#rcomp-picker').count()===1&&await page.locator('#r-status').count()===1&&await page.locator('#r-reason').count()===1&&await page.locator('#r-goal').count()===1&&await page.locator('#r-notes').count()===1,'Research editor lost required fields');
 ensure(await page.locator('.nx-plan-research-edit .nx-plan-edit-header h2').innerText().then(t=>t.includes('research')),'Research editor title missing');
 ensure(await page.locator('.nx-plan-research-edit .nx-plan-edit-fields > .nx-plan-edit-field').count()===5,'Research field group count changed');
 ensure(await page.locator('.nx-plan-research-edit label[for="r-status"]').count()===1,'Research status not visibly labelled');
 ensure(await page.locator('.nx-plan-research-edit #r-save').evaluate(e=>e.getBoundingClientRect().height)>=44,'Research save action too small');
 await page.locator('#x').click();

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

 // Goal status changes directly from ellipsis, without rewriting linked protocols or check-in history.
 await page.locator('.nx-plan-2-goal .manage-plan-btn').first().click();
 ensure(await page.locator('.nx-goal-quick-status').count()===4,'Goal quick status options missing');
 ensure(await page.locator('.nx-goal-quick-status').first().evaluate(e=>e.getBoundingClientRect().height)>=44,'Goal quick status target undersized');
 const beforeGoal=await page.evaluate(()=>({
   protocol:JSON.stringify(state.protocols||[]),
   doses:JSON.stringify(Object.values(state.peptides||{}).map(p=>p.doses||[])),
   checkIns:JSON.stringify(state.dailyLogs||[]),
   goalId:state.plans.goals[0].id
 }));
 await page.locator('.nx-goal-quick-status[data-status="planned"]').click();
 ensure(await page.evaluate(before=>state.plans.goals[0].status==='planned'&&state.plans.goals[0].id===before.goalId&&
   JSON.stringify(state.protocols||[])===before.protocol&&
   JSON.stringify(Object.values(state.peptides||{}).map(p=>p.doses||[]))===before.doses&&
   JSON.stringify(state.dailyLogs||[])===before.checkIns,beforeGoal),
   'Quick status changed non-goal records or failed to update goal');
 ensure(await page.locator('.nx-plan-2-goal').count()===1,'Planned goal disappeared from list');
 await page.locator('.nx-plan-2-goal .manage-plan-btn').first().click();
 ensure(await page.locator('.nx-goal-quick-status[data-status="planned"]').getAttribute('aria-pressed')==='true','Quick status selected state not retained');
 await page.locator('.nx-goal-quick-status[data-status="active"]').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].status==='active'),'Goal status could not be restored');

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
 await page.locator('#nx-g-next').click(); // Basics -> Progress
 await page.locator('#nx-g-next').click(); // Progress -> Connections
 ensure(await page.locator('#g-evidence-symptom').isVisible(),'Connections field must be visible');
 await page.locator('#g-evidence-symptom').selectOption('Skin irritation');
 while(await page.locator('#nx-g-next').isVisible())await page.locator('#nx-g-next').click();
 ensure(await page.locator('#g-save').isVisible(),'Review save not visible');
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
 await page.locator('#nx-g-next').click(); // Basics -> Progress
 await page.locator('#g-progress-type').selectOption('numeric');
 await page.locator('#g-p-baseline').fill('200');
 await page.locator('#g-p-target').fill('180');
 await page.locator('#g-p-unit').fill('lb');
 await page.locator('#g-p-source').selectOption('weightLogs');
 while(await page.locator('#nx-g-next').isVisible())await page.locator('#nx-g-next').click();
 ensure(await page.locator('#g-save').isVisible(),'Review save not visible');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.source==='weightLogs'&&state.weightLogs.length===2),'Numeric model save or weight history preservation failed');
 await page.locator('.nx-open-goal').first().click();
 ensure(await page.locator('#nx-goal-detail-content').innerText().then(t=>t.includes('185')&&t.includes('75%')),'Goal weight progress did not use latest dated record');
 await page.locator('#nx-goal-detail-close').click();
 await page.evaluate(()=>goalModal(state.plans.goals[0]));
 await page.locator('#nx-g-next').click(); // Basics -> Progress
 await page.locator('#g-progress-type').selectOption('subjective');
 await page.locator('#g-p-rating').selectOption('4');
 while(await page.locator('#nx-g-next').isVisible())await page.locator('#nx-g-next').click();
 ensure(await page.locator('#g-save').isVisible(),'Review save not visible');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.rating===4),'Subjective rating save failed');
 await page.evaluate(()=>goalModal(state.plans.goals[0]));
 await page.locator('#nx-g-next').click(); // Basics -> Progress
 await page.locator('#g-progress-type').selectOption('milestones');
 await page.locator('#g-p-milestones').fill(['One','Two'].join(String.fromCharCode(10)));
 while(await page.locator('#nx-g-next').isVisible())await page.locator('#nx-g-next').click();
 ensure(await page.locator('#g-save').isVisible(),'Review save not visible');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.milestones.length===2),'Milestones save failed');
 await page.evaluate(()=>goalModal(state.plans.goals[0]));
 await page.locator('#nx-g-next').click(); // Basics -> Progress
 await page.locator('#g-progress-type').selectOption('exploratory');
 while(await page.locator('#nx-g-next').isVisible())await page.locator('#nx-g-next').click();
 ensure(await page.locator('#g-save').isVisible(),'Review save not visible');
 await page.locator('#g-save').click();
 ensure(await page.evaluate(()=>state.plans.goals[0].progressModel.type==='exploratory'&&state.plans.goals[0].notes==='Fictional note'),'Exploratory save or legacy notes preservation failed');

 await page.evaluate(()=>{state._plansSub='shopping';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());});
 ensure(await page.locator('.nx-shopping-row .manage-plan-btn').count()===1,'Shopping edit menu lost');
 await page.locator('#add-shopping').click();
 ensure(await page.locator('.nx-plan-shopping-edit .nx-plan-edit-fields > .nx-plan-edit-field').count()===6,'Shopping editor missing field groups');
 ensure(await page.locator('.nx-plan-shopping-edit #s-item').count()===1&&await page.locator('#s-cat').count()===1&&await page.locator('#s-status').count()===1&&await page.locator('#s-qty').count()===1&&await page.locator('#s-goal').count()===1&&await page.locator('#s-notes').count()===1,'Shopping editor missing original fields');
 ensure(await page.locator('.nx-plan-shopping-edit #s-save').evaluate(e=>e.getBoundingClientRect().height)>=44,'Shopping save action too small');
 await page.locator('.nx-plan-shopping-edit #x').click();

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
 // Actual hard reload: the unpublished draft must not reopen a release notice.
 // This runs only on isolated localhost LIVE and offline fictional DEMO contexts.
 await page.reload({waitUntil:'domcontentloaded'});
 const reloadGate=await page.evaluate(()=>NEXUS_RELEASE.publicationStatus!=='published' &&
   !shouldShowPublishedRelease() && !document.querySelector('#nx-release-dismiss'));
 ensure(reloadGate,'Unpublished release unexpectedly prompted after hard reload');
 results.push({mode,width,theme,status:'PASS',unpublishedHardReload:'PASS'});await ctx.close();
}}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_PLANS_QA.json',JSON.stringify({version:VERSION,results},null,2));console.log('Plans hierarchy QA PASS: '+results.length);
