import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
const results=[];
if(!fs.existsSync(demo))throw Error('Missing full app DEMO artifact');
if(!fs.readFileSync('assets/js/11-nexus.js','utf8').includes('nx-proto-firstlog-action'))throw Error('DS2 first-log action missing');
if(!fs.readFileSync('assets/css/nexus-hybrid-preview.css','utf8').includes('.nx-proto-firstlog-action'))throw Error('DS2 first-log lavender styling missing');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
function check(pass,message){if(!pass)throw Error(message)}
try{
 for(const width of [320,390]){
  for(const theme of ['dark','light']){
   for(const kind of ['live','demo']){
    const ctx=await browser.newContext({viewport:{width,height:840},isMobile:true,hasTouch:true});
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
    await page.evaluate(value=>{state=buildDemoState('weight_loss');document.documentElement.dataset.theme=value},theme);
    // Source-backed fictional protocol reminders: day boundaries, pauses and
    // non-destructive manual completion. Run in LIVE and standalone DEMO.
    const protocolAlerts=await page.evaluate(()=>{
      const previous=JSON.parse(JSON.stringify(state));
      try {
        const name=Object.keys(PEPTIDES)[0],today=localDate();
        const phase=(weeks=1)=>({type:"dose",durationWeeks:weeks,dose:1});
        state.peptides={};state.customPeptides={};state.supplies=[];
        state.settings.phaseRemindersEnabled=true;
        const proto={id:"qa-reminder-protocol",name:"Fictional reminder schedule",status:"active",
          startDate:today,compounds:[{name,phases:[phase(),phase()]}]};
        state.protocols=[proto];
        const alerts=()=>buildReminders().filter(x=>x.type==="phase").map(x=>x.title);
        const first=alerts();
        // A seven-day phase warning must not compete with a Phase 1 starts-today
        // alert. Use a 2-week opening phase to test the pure upcoming transition.
        proto.compounds[0].phases=[phase(2),phase()];
        proto.startDate=addDays(today,-7);const inSeven=alerts();
        proto.compounds[0].phases=[phase(),phase()];
        proto.startDate=addDays(today,-6);const nextDay=alerts();
        proto.startDate=addDays(today,-7);const transition=alerts();
        proto.compounds[0].phases=[phase()];
        proto.startDate=today;const seven=alerts();
        proto.startDate=addDays(today,-6);const one=alerts();
        proto.startDate=addDays(today,-7);const ended=alerts();
        proto.status="paused";proto.pausedAt=today;const paused=alerts();
        proto.status="completed";const completed=alerts();
        proto.status="active";proto.startDate=addDays(today,1);const future=alerts();
        const stateBefore=JSON.stringify({protocols:state.protocols,peptides:state.peptides,supplies:state.supplies});
        alerts();
        const unchanged=stateBefore===JSON.stringify({protocols:state.protocols,peptides:state.peptides,supplies:state.supplies});
        return {first,inSeven,nextDay,transition,seven,one,ended,paused,completed,future,unchanged};
      } finally {state=previous;}
    });
    check(protocolAlerts.first.some(x=>x.includes("Phase 1 starts today")) &&
      protocolAlerts.inSeven.some(x=>x.includes("phase change in 7 days")),
      "Protocol Phase 1/7-day transition alert missing: "+JSON.stringify(protocolAlerts));
    check(protocolAlerts.nextDay.some(x=>x.includes("enters Phase 2 tomorrow")) &&
      protocolAlerts.transition.some(x=>x.includes("enters Phase 2 today")),
      "Phase transition day alerts missing: "+JSON.stringify(protocolAlerts));
    check(protocolAlerts.seven.some(x=>x.includes("ends in 7 days")) &&
      protocolAlerts.one.some(x=>x.includes("ends in 1 day")) &&
      protocolAlerts.ended.some(x=>x.includes("protocol schedule ended")),
      "Protocol 7-day/1-day/end-day reminders missing: "+JSON.stringify(protocolAlerts));
    check(!protocolAlerts.paused.length && !protocolAlerts.completed.length &&
      protocolAlerts.future.some(x=>x.includes("Phase 1 starts tomorrow")) &&
      protocolAlerts.unchanged,
      "Protocol pause/completion/future/non-destructive reminder regression: "+JSON.stringify(protocolAlerts));

    // Today 2.0 smoke: use the exact app's state and handlers, never fixture-only HTML.
    await page.evaluate(()=>{render();closeModal();}); // Dismiss fictional onboarding overlay before Today interaction smoke.

    // Today DS2 header: all three actions share one vertical rail at 320/390.
    // Existing trigger IDs and handlers remain usable in both themes.
    const header=await page.evaluate(()=>{
      const ids=["#nx-open-alerts","#profile-btn","#theme-toggle"];
      const nodes=ids.map(id=>document.querySelector(id));
      if(nodes.some(n=>!n))return {missing:ids.filter((_,i)=>!nodes[i])};
      const rects=nodes.map(n=>n.getBoundingClientRect());
      const parent=document.querySelector(".nx-today-header-actions");
      return {inside:nodes.every(n=>parent?.contains(n)),centres:rects.map(r=>r.top+r.height/2),
        heights:rects.map(r=>r.height),overflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    check(header.inside && !header.overflow && header.heights.every(h=>h>=44) &&
      Math.max(...header.centres)-Math.min(...header.centres)<=2,
      "Today header alignment failed: "+JSON.stringify(header));
    await page.locator("#theme-toggle").click();
    check(await page.evaluate(()=>document.documentElement.dataset.theme==="light") === (theme==="dark"),
      "Today theme action did not toggle");
    await page.locator("#theme-toggle").click();
    await page.locator("#profile-btn").click();
    check(await page.evaluate(()=>tab==="profile"),"Today Profile action did not navigate");
    await page.evaluate(()=>{tab="home";renderBody();});
    await page.locator("#nx-open-alerts").click();
    check(await page.locator("#nx-alert-overlay").count()===1,"Today alert action did not open inbox");
    await page.evaluate(()=>{closeModal();renderBody();});


    // Regression: activation must not require a first dose log before Today schedules it.
    // Isolate fictional test data and restore the fixture before existing UX assertions.
    const firstDose=await page.evaluate(()=>{
      const before=JSON.parse(JSON.stringify(state)),priorTab=tab;
      try {
        state.peptides={};state.customPeptides={};state.protocols=[];
        const name=Object.keys(PEPTIDES)[0],today=localDate();
        const weekday=new Date(today+"T12:00:00").getDay();
        initCompoundTracking(name);
        const data=state.peptides[name];
        data.status="active";data.doses=[];data.scheduleWeekdays=[weekday];
        data.dosesPerDay=1;data.times=["08:00"];
        const protocol={id:"qa-first-dose",name:"Fictional weekly schedule",status:"active",startDate:today,compounds:[{name}]};
        state.protocols=[protocol];tab="home";renderBody();
        const due=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        protocol.status="paused";renderBody();
        const paused=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        protocol.status="active";protocol.startDate=addDays(today,7);renderBody();
        const future=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        protocol.startDate=today;data.scheduleWeekdays=[(weekday+1)%7];renderBody();
        const otherWeekday=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        return {due,paused,future,otherWeekday};
      }finally{state=before;tab=priorTab;renderBody();}
    });
    check(/0\s*of\s*1/.test(firstDose.due),"First scheduled protocol dose missing from Today: "+JSON.stringify(firstDose));
    check([firstDose.paused,firstDose.future,firstDose.otherWeekday].every(v=>/No scheduled doses/.test(v)),
      "Paused/future/wrong-weekday protocol incorrectly scheduled: "+JSON.stringify(firstDose));


    // Additional first-dose invariants: multiple active compounds, multi-dose,
    // unrelated no-dose compound excluded, rest phase and read-only rendering.
    const extended=await page.evaluate(()=>{
      const original=JSON.parse(JSON.stringify(state)),oldTab=tab;
      try{
        state.peptides={};state.customPeptides={};state.protocols=[];
        const names=Object.keys(PEPTIDES).slice(0,3),today=localDate();
        const dow=new Date(today+"T12:00:00").getDay();
        for(const name of names){initCompoundTracking(name);const d=state.peptides[name];d.status="active";d.doses=[];d.scheduleWeekdays=[dow];d.dosesPerDay=1;d.times=["08:00"];}
        const first=state.peptides[names[0]],second=state.peptides[names[1]];
        first.dosesPerDay=2;first.times=["08:00","20:00"];
        state.protocols=[
          {id:"qa-a",name:"Fictional A",status:"active",startDate:today,compounds:[{name:names[0]}]},
          {id:"qa-b",name:"Fictional B",status:"active",startDate:today,compounds:[{name:names[1]}]}
        ];
        tab="home";
        const snapshot=JSON.stringify({doses:names.map(n=>state.peptides[n].doses),protocols:state.protocols});
        renderBody();
        const combined=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        const unchanged=JSON.stringify({doses:names.map(n=>state.peptides[n].doses),protocols:state.protocols})===snapshot;
        second.phases=[{type:"rest",isRest:true,durationWeeks:1}];second.startDate=today;
        renderBody();
        const rest=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        return {combined,rest,unchanged};
      } finally {state=original;tab=oldTab;renderBody();}
    });
    check(/0\s*of\s*3/.test(extended.combined),"Two protocols/multiple daily slots not represented once each: "+JSON.stringify(extended));
    check(/0\s*of\s*2/.test(extended.rest),"Rest-phase occurrence unexpectedly counted: "+JSON.stringify(extended));
    check(extended.unchanged,"Rendering Today mutated protocol or dosing records");

    // Wizard parity and tap geometry in both themes/widths.
    await page.evaluate(()=>protocolBuilderModal());
    for(let k=0;k<3;k++) await page.locator("#pb-next").click();
    check((await page.locator("#proto-builder-count").innerText()).trim()==="4/6","Protocol Schedule step not reached");
    check(await page.locator("#pb-start").count()===1,"Protocol start date control missing");
    check((await page.locator("#pb-next").innerText()).trim()==="Continue","Protocol wizard action differs from Continue");
    const dimensions=await page.evaluate(()=>{
      const ids=["#pb-start",".pb-sched",".pb-day",".pb-dpinc",".pb-dpdec",".pb-time","#pb-next"];
      return ids.map(id=>({id,heights:[...document.querySelectorAll(id)].map(n=>n.getBoundingClientRect().height)}));
    });
    check(dimensions.every(x=>x.heights.length&&x.heights.every(h=>h>=43.5)),
      "Protocol schedule control smaller than 44px: "+JSON.stringify(dimensions));
    await page.evaluate(()=>closeModal());
    await page.evaluate(()=>goalModal());
    check(await page.locator("#nx-g-step-label").count()===1,"Goal wizard missing");
    check(await page.locator("#g-target").count()===1,"Goal target date missing");
    const target=page.locator("#g-target");
    check((await target.getAttribute("aria-label")||"").includes("calendar"),"Goal date calendar not discoverable");
    await page.locator("#g-name").fill("Fictional QA goal");
    await page.locator("#nx-g-next").click();
    await page.locator("#nx-g-next").click();
    check((await page.locator("#nx-g-step-label").innerText()).includes("Connections"),"Goal Connections step unavailable");
    const choiceCount=await page.locator("#g-evidence-symptom option").count();
    if(choiceCount===1)check(await page.locator("#g-evidence-symptom").isDisabled(),"Empty Goal connection picker is misleading");
    check((await page.locator("#nx-g-next").innerText()).trim()==="Continue","Goal step action differs from Continue");
    await page.evaluate(()=>closeModal());


    // Exercise the same schedule synchronisation called by saving/activating
    // a real Protocol; old tests assigned compound scheduling fields directly.
    const synced=await page.evaluate(()=>{
      const original=JSON.parse(JSON.stringify(state)),oldTab=tab;
      try{
        state.peptides={};state.customPeptides={};state.protocols=[];
        const today=localDate(),weekday=new Date(today+"T12:00:00").getDay();
        const name=Object.keys(PEPTIDES)[0];
        const proto={
          id:"qa-synced-protocol",name:"Fictional synced first dose",
          status:"active",startDate:today,compounds:[{name}],
          schedule:{type:"Weekly",days:[weekday],dosesPerDay:1,times:["08:00"]}
        };
        state.protocols=[proto];syncProtocolToCompoundData(proto);
        tab="home";renderBody();
        const active=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        proto.status="in_progress";renderBody();
        const inProgress=document.querySelector(".nexus-today-big")?.textContent?.trim()||"";
        const doseCount=(state.peptides[name]?.doses||[]).length;
        return {active,inProgress,doseCount};
      }finally{state=original;tab=oldTab;renderBody();}
    });
    check(/0\s*of\s*1/.test(synced.active)&&/0\s*of\s*1/.test(synced.inProgress)&&synced.doseCount===0,
      "Synced activation/first dose not reflected in Today without inventory writes: "+JSON.stringify(synced));

    const tracking=page.locator('.nx-daily-tracking');
    check(await tracking.count()===1,'Daily tracking disclosure missing');
    check(!(await tracking.evaluate(el=>el.open)),'Daily tracking must default collapsed');
    await tracking.locator('summary').click();
    check(await tracking.evaluate(el=>el.open),'Daily tracking cannot expand');
    check(await tracking.locator('.nx-track-select').count()===4,'Tracking preferences missing');
    const weightCheckbox=tracking.locator('.nx-track-select[data-activity="weight"]');
    await weightCheckbox.check();
    check(await page.evaluate(()=>state.settings.todayTrackingActivities.includes('weight')),'Selected tracking preferences not saved');
    check(await page.locator('.nx-today-activity.nx-week-pulse').count()===1,'Compact weekly pulse missing');
    check(await page.locator('.nx-today-activity .nx-activity-period').count()===0,'Retired activity periods unexpectedly reappeared');
    check(await page.locator('.nx-today-activity .nx-week-score').count()===1,'Weekly pulse score missing');
    check(await page.locator('.nx-today-coming-up').count()===1,'Coming Up section missing');
    await page.locator('#nx-open-calendar').click();
    check(await page.locator('h1.greet').first().innerText().then(s=>s.includes('Calendar')),'View Calendar failed to navigate');
    await page.evaluate(()=>{tab='home';render()});
    await page.evaluate(()=>protocolBuilderModal());
    check((await page.locator('#proto-builder-count').textContent()).trim()==='1/6','New Protocol opens at 1/6');
    await page.locator('#proto-builder-body #pb-next').count(); // Back/Next live in footer.
    await page.locator('#pb-next').click();
    await page.locator('#pb-next').click();
    const head=(await page.locator('#proto-builder-count').textContent()).trim();
    check(head==='3/6','Progress counter does not follow Stack: '+head);
    check((await page.locator('#proto-builder-body').innerText()).includes('STEP 3'),'Step 3 Stack content missing');
    const field=page.locator('#pb-csearch');
    check(await field.count()===1,'Search input missing');
    check((await field.getAttribute('placeholder')).includes('Search compounds'),'Search placeholder incorrect');
    check(!(await field.getAttribute('placeholder')).includes('🔍'),'Search emoji still present');
    check(await page.locator('.nx-proto-compound-search svg').count()===1,'Outline magnifier missing');

    check(await page.locator('#pb-browse-all').count()===1,'Protocol full-library action missing');
    await page.locator('#pb-browse-all').click();
    check(await page.locator('.nx-compound-browser').isVisible(),'Protocol browser did not open');
    check(await page.locator('.nx-browser-choice').count()>5,'Protocol full library truncated');
    await page.locator('#nx-browser-search').fill('GHK-Cu');
    check(await page.locator('.nx-browser-choice').count()===1,'Protocol library search filtering failed');
    await page.locator('.nx-browser-choice').click();
    check(await page.locator('.nx-compound-browser').count()===0,'Protocol full-library did not close');
    check(await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).count()===1,'Protocol full-library selection did not update stack');
    await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).locator('.pb-crem').click();
    await field.fill('GHK-Cu');
    const candidate=page.locator('.pb-cadd[data-name="GHK-Cu"]').first();
    check(await candidate.count()===1,'GHK-Cu search did not filter');
    await candidate.click();
    check(await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).count()===1,'Stack add control failed');
    const select=page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).locator('.pb-route');
    check(await select.count()===1,'Route selection missing after add');
    await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).locator('.pb-crem').click();
    check(await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).count()===0,'Remove from stack failed');
    await page.evaluate(()=>{
      const selected=[];
      const modal=openModal('<div id="nx-picker-qa"></div>');
      const root=modal.querySelector('#nx-picker-qa');
      const refresh=()=>{root.innerHTML=compoundPickerHTML(selected,'nxqa');wireCompoundPicker(root,selected,'nxqa',refresh);};
      refresh();
    });
    check(await page.locator('.cpick-browse-all[data-picker="nxqa"]').count()===1,'Plans reusable picker missing browse-all');
    await page.locator('.cpick-browse-all[data-picker="nxqa"]').click();
    check(await page.locator('.nx-compound-browser').isVisible(),'Plans full-library did not open');
    await page.locator('#nx-browser-search').fill('BPC-157');
    check(await page.locator('.nx-browser-choice').count()===1,'Plans full-library search failed');
    await page.locator('.nx-browser-choice').click();
    check(await page.locator('.cpick-remove[data-name="BPC-157"]').count()===1,'Plans multi-select lost full-library choice');

    await page.evaluate(()=>closeModal());

    await page.evaluate(()=>{
      const d={...allPeptides().Retatrutide,status:'active',route:'SubQ',scheduleDays:7,
        doses:[{id:789001,dose:2,site:'Abdomen',date:new Date(Date.now()-6*86400000).toISOString()}]};
      const mount=document.createElement('section');
      mount.id='nx-proto-design-fixture';
      mount.style.cssText='margin:12px;max-width:430px';
      mount.innerHTML=peptideCardHTML('Retatrutide',d,{showCollapseChevron:true,view:'active'});
      document.querySelector('#app').appendChild(mount);
      wireBody();
    });
    const fixture=page.locator('#nx-proto-design-fixture');
    if(width===320){
      const titleMetrics=await fixture.locator('.nx-expanded-compound-head > .nx-expanded-name').evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
      check(titleMetrics.scroll<=titleMetrics.client+1,'320px compound title still truncated: '+JSON.stringify(titleMetrics));
      const timing=await fixture.locator('.nx-compound-timing-row').evaluate(el=>{
        const a=el.firstElementChild?.getBoundingClientRect(),b=el.querySelector('.nx-compound-timing-details')?.getBoundingClientRect();
        return {ringTop:a?.top||0,summaryTop:b?.top||0};
      });
      check(Math.abs(timing.ringTop-timing.summaryTop)<24,'320px ring and Last/Next wrapped: '+JSON.stringify(timing));
    }
    // Hybrid Today replaces the old timing <details> with three radio-backed panels.
    const insights=fixture.locator('.nx-compound-info-tabs');
    check(await insights.count()===1,'Hybrid compound information tabs missing');
    check(await fixture.locator('.nx-info-insights').count()===1,'Insights panel missing');
    check(await fixture.locator('.nx-info-insights').innerText().then(s=>s.includes('At a glance')),'Record-grounded insights missing');
    check(await fixture.locator('.nx-info-history').count()===1,'History panel missing');
    check(await fixture.locator('.nx-info-details').count()===1,'Details panel missing');
    check(await fixture.locator('.nx-compound-tab-radio:checked').count()===1,'Exactly one information segment must be selected');
    await fixture.locator('label[for^="nx-history-"]').first().click();
    check(await fixture.locator('input[id^="nx-history-"]').isChecked(),'History segment cannot be selected');
    await fixture.locator('label[for^="nx-details-"]').first().click();
    check(await fixture.locator('input[id^="nx-details-"]').isChecked(),'Details segment cannot be selected');
    await fixture.locator('label[for^="nx-insights-"]').first().click();
    check(await fixture.locator('input[id^="nx-insights-"]').isChecked(),'Insights segment cannot be reselected');
    const menu=fixture.locator('.moremenu');
    check(await menu.count()===1 && !!(await menu.getAttribute('aria-label')),'Accessible compound menu trigger missing');
    await menu.click();
    check((await menu.getAttribute('aria-expanded'))==='true','More menu accessibility state missing');
    const box=page.locator('body > .morebox.nx-compound-sheet-open');
    check(await box.count()===1 && await box.isVisible(),'Sheet must portal to body and be visible');
    check(await fixture.locator('.morebox').count()===0,'Sheet must not expand inside compound card');
    check(await page.locator('.nx-compound-sheet-scrim').count()===1,'Bottom sheet scrim missing');
    check(await box.getAttribute('role')==='dialog','Sheet role dialog missing');
    check(await box.getAttribute('aria-modal')==='true','Sheet aria-modal missing');
    check(await page.locator('#app').evaluate(el=>el.inert),'Underlying app not inert');
    // The drawer animates upward by 16px. Evaluate its final geometry, not a
    // transient subframe before the entrance animation settles.
    await box.evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished.catch(()=>{}))));
    const sheetBounds=await box.boundingBox();
    check(sheetBounds && sheetBounds.y > 180 && sheetBounds.y+sheetBounds.height <= 843,'Sheet not bottom-docked within viewport: '+JSON.stringify(sheetBounds));
    await page.screenshot({path:'dist/proto-open-sheet-'+kind+'-'+theme+'-'+width+'.png',fullPage:false});
    check((await page.evaluate(()=>document.body.style.overflow))==='hidden','Body scroll not locked');
    const hdr=box.locator('.nx-compound-sheet-heading strong');
    check((await hdr.textContent()).trim()==='Retatrutide','Sheet title not compound-specific');
    for(const selector of ['.ics-export','.tunetoggle','.colorpick','.resetcolor','.pausepep','.archivepep']){
      check(await box.locator(selector).count()===1,'Missing contextual action '+selector);
    }
    check(await box.locator('.nx-compound-menu-icon').count()>=5,'Missing outline menu icons');
    check(await fixture.locator('.nx-compound-remove-row .archivepep').count()===0,'Remove action still cluttering main compound card');
    // Keyboard: Tab must remain in dialog and Escape restores the trigger.
    await box.locator('.nx-compound-sheet-close').focus();
    await page.keyboard.press('Shift+Tab');
    check(await box.evaluate(el=>el.contains(document.activeElement)),'Keyboard escaped sheet focus trap');
    await page.keyboard.press('Escape');
    check(await page.locator('body > .nx-compound-sheet-scrim').count()===0,'Escape did not clear backdrop');
    check(!(await page.locator('#app').evaluate(el=>el.inert)),'Escape did not restore app interaction');
    check((await page.evaluate(()=>document.body.style.overflow))!=='hidden','Escape did not unlock scroll');
    check((await menu.getAttribute('aria-expanded'))==='false','Escape did not restore ellipsis ARIA');
    await menu.click();
    await page.locator('.nx-compound-sheet-scrim').click({position:{x:8,y:8}});
    check((await page.locator('body > .morebox.nx-compound-sheet-open').count())===0,'Backdrop did not dismiss menu');
    // Hybrid History has a dedicated information segment, not a duplicate sheet action.
    check(await fixture.locator(".nx-info-history .histtoggle").count()===1,"Full history action missing from History panel");
    await menu.click();
    await page.locator('body > .morebox .tunetoggle').click();
    check(await fixture.locator('.tunebox').isVisible(),'Schedule settings action lost handler');
    check((await page.locator('body > .morebox.nx-compound-sheet-open').count())===0,'Schedule action did not close sheet');
    await menu.click();
    check((await page.locator('body > .morebox .colorpick').count())===1,'Colour picker missing on repeat open');
    await page.locator('body > .morebox .nx-compound-sheet-close').click();
    check((await menu.getAttribute('aria-expanded'))==='false','Close button did not reset ARIA');
    const metrics=await fixture.evaluate(el=>({width:el.getBoundingClientRect().width,scroll:el.scrollWidth,client:el.clientWidth}));
    check(metrics.scroll<=metrics.client+3,'Compound card overflows horizontally: '+JSON.stringify(metrics));
    await page.screenshot({path:'dist/proto-design-'+kind+'-'+theme+'-'+width+'.png'});
    check(!errors.length,'Browser exception: '+errors.join('; '));
    results.push({kind,theme,width,wizardProgress:'PASS',compoundSearch:'PASS',compoundAddRemove:'PASS',insights:'PASS',menuActions:'PASS',sheetEscape:'PASS',sheetBackdrop:'PASS',existingHistorySchedule:'PASS',bodyScrollRestore:'PASS',metrics});
    await ctx.close();
   }
  }
 }
}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_PROTOCOL_DESIGN_QA.json',JSON.stringify(results,null,2));
console.log('Protocol design candidate passed '+results.length+' LIVE/DEMO light/dark 320/390 suites');
