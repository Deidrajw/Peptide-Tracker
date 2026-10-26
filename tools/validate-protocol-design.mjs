import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
const results=[];
if(!fs.existsSync(demo))throw Error('Missing full app DEMO artifact');
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
    // Today 2.0 smoke: use the exact app's state and handlers, never fixture-only HTML.
    await page.evaluate(()=>render());
    const tracking=page.locator('.nx-daily-tracking');
    check(await tracking.count()===1,'Daily tracking disclosure missing');
    check(!(await tracking.evaluate(el=>el.open)),'Daily tracking must default collapsed');
    await tracking.locator('summary').click();
    check(await tracking.evaluate(el=>el.open),'Daily tracking cannot expand');
    check(await tracking.locator('.nx-track-select').count()===4,'Tracking preferences missing');
    const weightCheckbox=tracking.locator('.nx-track-select[data-activity="weight"]');
    await weightCheckbox.check();
    check(await page.evaluate(()=>state.settings.todayTrackingActivities.includes('weight')),'Selected tracking preferences not saved');
    check(await page.locator('.nx-today-activity .nx-activity-period').count()===2,'Activity periods missing');
    await page.locator('.nx-activity-period[data-period="week"]').click();
    check(await page.locator('.nx-activity-panel[data-activity-panel="week"]').isVisible(),'Weekly activity segment did not open');
    await page.locator('.nx-activity-period[data-period="today"]').click();
    check(await page.locator('.nx-activity-panel[data-activity-panel="today"]').isVisible(),'Daily activity segment did not restore');
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
    await field.fill('GHK-Cu');
    const candidate=page.locator('.pb-cadd[data-name="GHK-Cu"]').first();
    check(await candidate.count()===1,'GHK-Cu search did not filter');
    await candidate.click();
    check(await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).count()===1,'Stack add control failed');
    const select=page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).locator('.pb-route');
    check(await select.count()===1,'Route selection missing after add');
    await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).locator('.pb-crem').click();
    check(await page.locator('.nx-proto-stack-selected').filter({hasText:'GHK-Cu'}).count()===0,'Remove from stack failed');
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
    for(const selector of ['.histtoggle','.ics-export','.tunetoggle','.colorpick','.resetcolor','.pausepep','.archivepep']){
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
    await menu.click();
    await page.locator('body > .morebox .histtoggle').click();
    check((await page.locator('body > .morebox.nx-compound-sheet-open').count())===0,'History action did not dismiss sheet');
    check(await fixture.locator('.histbox').isVisible(),'History action lost existing handler');
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
