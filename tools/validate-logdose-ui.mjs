import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
const results=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const ensure=(ok,why)=>{if(!ok)throw Error(why)};
async function seed(page, theme) {
  await page.evaluate(t=>{
    state=buildDemoState('weight_loss');
    state.profile.onboardingDone=true;
    document.documentElement.dataset.theme=t;
    state.peptides.Retatrutide={enabled:true,status:'active',route:'SubQ',
      scheduleDays:7,doses:[],lastDose:2};
    state.preparedDoses=[];
    state.lastSourceKit={};
    state.supplies=[];
    state._pendingDoseDraft=null;
    window.__fixtureKit=(id,remaining,sealed=0)=>{
      const vials=[{id:10000+id,status:'open',vialMg:10,remainingMg:remaining,
        sequenceNumber:1,reconDate:'2026-10-20T09:00:00'}];
      for(let i=0;i<sealed;i++)vials.push({id:20000+id+i,status:'sealed',
        vialMg:10,remainingMg:10,sequenceNumber:i+2});
      return {id,name:'Retatrutide',preparationMethod:'SubQ',activeKit:true,totalVials:1+sealed,
        openedVials:1,vialMg:10,bacMl:2,_vialsBackfilled:true,
        _vialsRepaired:true,vials,wasteLog:[]};
    };
  },theme);
}
async function stateSnapshot(page){return page.evaluate(()=>({
  entries:state.peptides.Retatrutide.doses.map(d=>JSON.parse(JSON.stringify(d))),
  kits:state.supplies.map(k=>({id:k.id,remaining:k.vials.map(v=>v.remainingMg),
    statuses:k.vials.map(v=>v.status)})),
  prepared:state.preparedDoses.map(p=>({...p})),
  draft:state._pendingDoseDraft
}));}
async function setDose(page,amount){await page.locator('#dose').fill(String(amount));}
async function openDose(page){await page.evaluate(()=>doseModal('Retatrutide'));}
async function clickSave(page){
  const modal=page.locator('.nx2-dose-modal');
  const next=modal.locator('#nx-dose-step-next');
  for(let i=0;i<3 && !(await modal.locator('#save').isVisible());i++){
    ensure(await next.isVisible(),'Continue unavailable before review');
    await next.click();
    if(!(await modal.locator('#save').isVisible()) && !(await next.isVisible()))break;
  }
  if(await modal.locator('#save').isVisible()){
    await modal.locator('#save').click();
    // New doses have a skippable invitation; edits must not show it.
    const prompt=page.locator('.nx-reaction-invite');
    if(await prompt.count()){
      ensure(await prompt.locator('#nx-reaction-later').isVisible(),'Post-dose invitation cannot be skipped');
      await prompt.locator('#nx-reaction-later').click();
    }
  }
  // Invalid entry must remain unsaved on Entry, with feedback from step validation.
  else ensure(await modal.locator('.nx-dose-step-error').isVisible(),'Invalid entry lacks step validation feedback');
}
try {
  for(const width of [320,390])for(const theme of ['dark','light'])for(const kind of ['live','demo']){
    const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('dialog',async d=>d.accept());
    await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
    await seed(page,theme);let verified=[];
    const routeIsolation=await page.evaluate(()=>{
      const subq=window.__fixtureKit(9331,8),nasal=window.__fixtureKit(9332,7);
      const unknown=window.__fixtureKit(9333,5),unlabelled=window.__fixtureKit(9334,4);
      subq.preparationMethod='SubQ';nasal.preparationMethod='Nasal';
      unknown.preparationMethod='Unknown';
      delete unlabelled.preparationMethod; // factory defaults SubQ; explicitly test absent metadata
      state.supplies=[subq,nasal,unknown,unlabelled];
      const result={
        subq:getEligibleSourceKits('Retatrutide','SubQ').map(x=>x.kit.id),
        nasal:getEligibleSourceKits('Retatrutide','Nasal').map(x=>x.kit.id),
        oral:getEligibleSourceKits('Retatrutide','Oral').map(x=>x.kit.id)
      };
      state.supplies=[];
      return result;
    });
    ensure(JSON.stringify(routeIsolation)==='{"subq":[9331],"nasal":[9332],"oral":[]}',
      'Route-labelled open vials were combined or unlabelled stock guessed: '+JSON.stringify(routeIsolation));
    verified.push('same compound separate SubQ/nasal physical stock remains route-isolated');
    // Regression: compound View details/taken-today action must not throw ReferenceError fmtT.
    const completedAction=await page.evaluate(()=>{
      const entry={id:91827,date:'2026-10-27T15:03',dose:'2.5',site:'Abdomen'};
      return renderCompoundActionArea('Retatrutide',state.peptides.Retatrutide,
        cfg('Retatrutide'),[entry],{status:'taken_today'});
    });
    ensure(completedAction.includes('Dose completed') &&
      completedAction.includes('3:03') &&
      completedAction.includes('nx-today-record-reaction') &&
      completedAction.includes('data-id="91827"') &&
      completedAction.includes('More actions'),
      'Compound View details / completed-dose UI did not render a formatted local time');
    verified.push('compound completed-dose details render without undefined fmtT');
    // Exercise the actual compound card HTML path, not only the action helper.
    const fullCard=await page.evaluate(()=>{
      const data=state.peptides.Retatrutide;
      data.doses=[{id:91827,date:localDate()+'T15:03',dose:'2.5',site:'Abdomen'}];
      try{return peptideCardHTML('Retatrutide',data);}
      finally{data.doses=[];}
    });
    ensure(fullCard.includes('Dose completed') && fullCard.includes('nx-today-record-reaction') && fullCard.includes('data-id="91827"') && fullCard.includes('More actions'),
      'Full compound card / View Details rendered without completed-dose controls');
    verified.push('actual compound card completed-dose details render without blank screen');
    // Completed filter is a day-specific view; it must not list a historical dose
    // just because the compound is active, and it must expose the reaction action.
    const completedTab=await page.evaluate(()=>{
      const data=state.peptides.Retatrutide;
      data.doses=[{id:91827,date:localDate()+'T15:03',dose:'2.5',site:'Abdomen'}];
      const collapsed=renderCompletedFullView([['Retatrutide',data]]);
      const oldExpanded=state._todayExpandedCompounds;
      state._todayExpandedCompounds=new Set(['completed::Retatrutide']);
      const recent=renderCompletedFullView([['Retatrutide',data]]);
      state._todayExpandedCompounds=oldExpanded;
      data.doses=[{id:91828,date:'2025-01-05T15:03',dose:'2.5',site:'Abdomen'}];
      const historical=renderCompletedFullView([['Retatrutide',data]]);
      data.doses=[];
      return {collapsed,recent,historical};
    });
    ensure(completedTab.collapsed.includes('COMPLETED TODAY') &&
      completedTab.collapsed.includes('compound-compact-tap') &&
      completedTab.collapsed.includes('completed'),
      'Completed tab has no expandable today dose card');
    ensure(completedTab.recent.includes('COMPLETED TODAY') &&
      completedTab.recent.includes('nx-today-record-reaction') &&
      completedTab.recent.includes('91827'),
      'Completed tab lost today dose or Record reaction action');
    ensure(completedTab.historical.includes('No completed doses today') &&
      !completedTab.historical.includes('nx-today-record-reaction'),
      'Completed tab incorrectly includes old historical dose');
    verified.push('Completed filter is today-only with saved-dose reaction action');
    // Upcoming no longer needs a top tab. Keep the lower Coming up preview
    // and its Calendar drill-down reachable from Today.
    await page.evaluate(()=>{tab='home';state._homeView='today';render();});
    ensure(await page.locator('.nexus-today-view-nav .hv-nav[data-view="completed"]').count()===1,
      'Completed navigation tab missing from Today');
    ensure(await page.locator('.nexus-today-view-nav .hv-nav[data-view="upcoming"]').count()===0,
      'Redundant Upcoming top tab still exists');
    ensure(await page.locator('.nx-today-coming-up').count()===1 &&
      await page.locator('#nx-open-calendar').count()===1,
      'Coming up preview or Calendar action missing from Today');
    // Browser fixture starts with onboarding modal mounted before fictional state
    // replaces real initialization; dismiss only that fixture overlay before tapping.
    await page.evaluate(()=>{document.querySelectorAll('.modal-bg').forEach(bg=>{
      if(bg.querySelector('#ob-next'))bg.remove();
    });});
    await page.locator('#nx-open-calendar').click();
    ensure(await page.evaluate(()=>tab==='calendar'),'Coming up Calendar action did not navigate to Calendar');
    await page.evaluate(()=>{tab='home';state._homeView='today';render();});
    verified.push('Coming up preview remains and opens Calendar without Upcoming top tab');




    // Approved administration UI: six tap targets, grouped site selection and
    // method changes must keep native storage fields synchronised.
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9101,6,1)]);
    await openDose(page);
    ensure(await page.locator('.nx-method-option').count()===6,
      'Approved six-method button grid missing');
    ensure(await page.locator('.nx-method-option[data-admin-method="SubQ"]').getAttribute('aria-pressed')==='true',
      'SubQ not marked as selected');
    await page.locator('#site').selectOption('Abdomen — lower L');
    ensure(await page.locator('#site').inputValue()==='Abdomen — lower L',
      'SubQ site button did not synchronise saved site value');
    await page.locator('.nx-method-option[data-admin-method="IM"]').click();
    ensure(await page.locator('#nx-dose-method').inputValue()==='IM' &&
      await page.locator('#site option[value="Deltoid — L (IM)"]').count()===1,
      'Method switching failed to update IM regions and canonical value');
    await page.locator('.nx-method-option[data-admin-method="Nasal"]').click();
    ensure(await page.locator('#nx-nasal-method-note').isVisible(),
      'Nasal guidance did not appear within administration fields');
    await page.locator('.nx-method-option[data-admin-method="SubQ"]').click();
    ensure(await page.locator('#nx-nasal-method-note').isHidden(),
      'Nasal guidance persisted after switching out of nasal mode');
    await page.locator('#x').click();
    verified.push('six 3x2 method buttons, region/site selection and saved value synchronisation');
    // Log Combo Dose must not solicit symptoms; legacy symptom data must survive.
    const historicalSymptoms=await page.evaluate(()=>{
      state._comboSymptoms=[{name:'Fictional historical symptom',intensity:2}];
      const before=JSON.stringify(state._comboSymptoms);
      comboDoseModal();
      return {before,after:JSON.stringify(state._comboSymptoms)};
    });
    ensure(historicalSymptoms.before===historicalSymptoms.after,
      'Opening Combo Dose modified previously retained symptom data');
    ensure(await page.locator('#combo-sym').count()===0 &&
      await page.getByText('SYMPTOMS AFTER THIS DOSE (shared)').count()===0,
      'Combo Dose still exposes the removed symptom picker');
    await page.locator('#x').click();
    verified.push('Combo Dose has no symptom picker and historical symptom data remains unchanged');
    // A: Actual user confirmation, same recorded ID preserved after edit,
    // reapply edited amount to the original open vial only.
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9101,6,1)]);
    await openDose(page);
    // Physical Safari regression guard: title and mode must stay visible while only dose fields scroll.
    const fixedHeader=page.locator('.nx2-dose-modal > .nx-dose-form > .nx-dose-fixed-header');
    ensure(await fixedHeader.count()===1,'Dose title and mode switch are not in fixed header');
    ensure(await fixedHeader.locator('.nx-dose-head > #x').count()===1,
      'Close control escaped fixed header (invalid modal HTML nesting)');
    ensure(await page.locator('.nx2-dose-modal .nx-dose-scroll > .nx-dose-section[aria-label="Dose source"]').count()===1 &&
      await page.locator('.nx2-dose-modal .nx-dose-scroll > .nx-dose-section[aria-label="Administration details"]').count()===1,
      'Dose sections escaped scrolling body (invalid modal HTML nesting)');
    const layout=await page.locator('.nx2-dose-modal').evaluate(modal=>{
      const h=modal.querySelector('.nx-dose-fixed-header').getBoundingClientRect();
      const body=modal.querySelector('.nx-dose-scroll').getBoundingClientRect();
      const footer=modal.querySelector('.nx-dose-footer').getBoundingClientRect();
      return {headerBottom:h.bottom,bodyTop:body.top,bodyBottom:body.bottom,footerTop:footer.top,bodyHeight:body.height};
    });
    ensure(layout.bodyHeight>80 && layout.bodyTop>=layout.headerBottom-2 &&
      layout.bodyBottom<=layout.footerTop+2,
      'Scroll body overlaps sticky header/footer: '+JSON.stringify(layout));
    ensure(await fixedHeader.locator('.nx-dose-head').count()===1 &&
      await fixedHeader.locator('.nx-dose-mode-switch').count()===1,
      'Quick/Guided selector incorrectly lives inside the scrolling fields');
    await page.locator('.nx2-dose-modal .nx-dose-scroll').evaluate(el=>{el.scrollTop=el.scrollHeight});
    ensure(await fixedHeader.locator('[data-dose-mode="quick"]').isVisible() &&
      await fixedHeader.locator('[data-dose-mode="guided"]').isVisible(),
      'Quick / Guided mode switch disappears after body scrolling');
    await page.locator('.nx2-dose-modal .nx-dose-scroll').evaluate(el=>{el.scrollTop=0});
    ensure(await page.locator('.nx2-dose-modal').count()===1,'Log Dose modal absent');
    ensure(await page.locator('.nx2-dose-modal #save').innerText().then(x=>x.includes('CONFIRM LOG')),'Confirm footer missing');
    await setDose(page,2);
    await page.waitForTimeout(650);
    // DS2 review must show useful source labels while retaining full traceability.
    await page.locator('#nx-dose-step-next').click();
    ensure(await page.locator('.nx-dose-review-stage').isVisible(),'Review stage missing');
    const preview=await page.locator('#nx-dose-review-rows').innerText();
    ensure(preview.includes('Retatrutide') && !preview.includes('9101') && !preview.includes('19101'),
      'Raw kit/vial IDs leaked into primary Review rows: '+preview);
    const idDetails=page.locator('#nx-dose-source-ids');
    ensure(await idDetails.count()===1 && await idDetails.isVisible(),
      'Optional source IDs disclosure missing');
    await idDetails.locator('summary').click();
    ensure((await idDetails.innerText()).includes('9101'),'Traceable source ID missing from disclosure');
    ensure((await page.evaluate(()=>state.peptides.Retatrutide.doses.length))===0,
      'Opening Review unexpectedly persisted a dose');
    await page.locator('#nx-dose-step-back').click();
    ensure(!(await page.locator('.nx-dose-optional').isVisible()),'New Log Dose still exposes old observations');
    await clickSave(page);
    let first=await stateSnapshot(page);
    ensure(first.entries.length===1,'Single vial confirmation failed to create one dose');
    ensure(Math.abs(first.kits[0].remaining[0]-4)<.01,'Confirmed 2 mg did not deduct exactly 2 mg');
    ensure(Math.abs(first.kits[0].remaining[1]-10)<.01,'Sealed backup was erroneously consumed');
    const originalId=first.entries[0].id;
    // Test invitation independently: must target existing saved dose and not deduct.
    await page.evaluate(()=>nexusPostDoseReactionPrompt('Retatrutide',state.peptides.Retatrutide.doses[0].id));
    ensure(await page.locator('.nx-reaction-invite').isVisible(),'Optional post-save invitation not displayed');
    await page.locator('#nx-reaction-open').click();
    ensure(await page.locator('.nx-reaction-editor').isVisible(),'Invitation did not open reaction editor');
    ensure((await stateSnapshot(page)).entries.length===1,'Invitation unexpectedly changed dose history');
    await page.locator('#nx-reaction-cancel').click();
    verified.push('post-dose optional invitation and link to original dose');
    await page.evaluate(()=>doseModal('Retatrutide',state.peptides.Retatrutide.doses[0]));
    await setDose(page,3);await clickSave(page);
    let edited=await stateSnapshot(page);
    ensure(edited.entries.length===1 && edited.entries[0].id===originalId,'Editing duplicated a dose record');
    ensure(Math.abs(edited.kits[0].remaining[0]-3)<.01,'Edit failed to reverse and reapply deduction');
    ensure((edited.entries[0].reactions||[]).length===0,'Dose edit unexpectedly created a reaction');
    // Reactions are a separate, timestamped event and cannot deduct vial inventory.
    await page.evaluate(()=>doseModal('Retatrutide',state.peptides.Retatrutide.doses[0]));
    await page.locator('#nx-record-reaction').click();
    ensure(await page.locator('.nx-reaction-editor').isVisible(),'Standalone reaction editor did not open');
    await page.locator('#nx-reaction-label').selectOption({label:'Flushing / warmth'});
    await page.locator('#nx-reaction-time').fill('2032-11-07T21:05');
    await page.locator('#nx-reaction-intensity').selectOption('2');
    await page.locator('#nx-reaction-notes').fill('Fictional immediate observation');
    await page.locator('#nx-reaction-save').click();
    const reactionSaved=await stateSnapshot(page);
    ensure(reactionSaved.entries.length===1&&reactionSaved.entries[0].id===originalId,'Reaction changed dose identity');
    ensure(reactionSaved.entries[0].reactions?.length===1,'Reaction failed to append to saved dose');
    ensure(reactionSaved.entries[0].reactions[0].observedAt==='2032-11-07T21:05','Reaction observation timestamp missing');
    ensure(reactionSaved.entries[0].reactions[0].recordedAt,'Reaction entry timestamp missing');
    ensure(Math.abs(reactionSaved.kits[0].remaining[0]-3)<.01,'Reaction changed inventory');
    // The Calendar saved-dose action must open reaction capture directly, not Edit Dose.
    await page.evaluate(()=>dayDetailModal(state.peptides.Retatrutide.doses[0].date));
    const calAction=page.locator('.cal-record-reaction[data-name="Retatrutide"]');
    ensure(await calAction.count()===1,'Calendar saved dose missing direct reaction action');
    await calAction.click();
    ensure(await page.locator('.nx-reaction-editor').isVisible(),
      'Calendar reaction action did not open standalone editor');
    ensure(!(await page.locator('.nx2-dose-modal').isVisible()),
      'Calendar reaction action incorrectly opened Edit Dose');
    await page.locator('#nx-reaction-label').selectOption({label:'Head rush'});
    await page.locator('#nx-reaction-time').fill('2032-11-07T22:15');
    await page.locator('#nx-reaction-notes').fill('Fictional later observation');
    await page.locator('#nx-reaction-save').click();
    const fromCalendar=await stateSnapshot(page);
    ensure(fromCalendar.entries.length===1 && fromCalendar.entries[0].id===originalId,
      'Calendar reaction changed dose history or original dose ID');
    ensure(fromCalendar.entries[0].reactions?.length===2 &&
      fromCalendar.entries[0].reactions[0].label==='Flushing / warmth' &&
      fromCalendar.entries[0].reactions[1].label==='Head rush',
      'Calendar reaction failed to append without replacing previous event');
    ensure(Math.abs(fromCalendar.kits[0].remaining[0]-3)<.01 &&
      JSON.stringify(fromCalendar.kits)===JSON.stringify(reactionSaved.kits),
      'Calendar reaction changed vial inventory');
    verified.push('Calendar saved-dose reaction opens directly, appends history with zero deduction');
    // Saved-dose retrospective offers Record reaction directly, with no dose editor.
    await page.evaluate(()=>doseRetrospectiveModal('Retatrutide',state.peptides.Retatrutide.doses[0].id));
    const retroAction=page.locator('.nx-reaction-link').filter({hasText:'Record reaction'});
    ensure(await retroAction.isVisible(),'Saved-dose retrospective has no direct Record reaction control');
    await retroAction.click();
    ensure(await page.locator('.nx-reaction-editor').isVisible() &&
      !(await page.locator('.nx2-dose-modal').isVisible()),
      'Retrospective reaction incorrectly routed through dose editor');
    await page.locator('#nx-reaction-label').selectOption({label:'Injection-site redness'});
    await page.locator('#nx-reaction-time').fill('2032-11-08T09:00');
    await page.locator('#nx-reaction-notes').fill('Fictional delayed site note');
    await page.locator('#nx-reaction-save').click();
    const fromRetro=await stateSnapshot(page);
    ensure(fromRetro.entries.length===1 && fromRetro.entries[0].id===originalId &&
      fromRetro.entries[0].reactions?.length===3,
      'Retrospective reaction replaced history or created another dose');
    ensure(JSON.stringify(fromRetro.kits)===JSON.stringify(fromCalendar.kits),
      'Retrospective reaction deducted inventory');
    verified.push('retrospective saved-dose direct action, 3 reactions, zero inventory deduction');
    // Editing one reaction preserves its event ID, originally recorded timestamp,
    // other reactions and all dose/source allocations.
    const editTarget=fromRetro.entries[0].reactions[0];
    await page.evaluate(()=>nexusDoseReactionModal('Retatrutide',state.peptides.Retatrutide.doses[0].id));
    const editButton=page.locator('.nx-reaction-edit').filter({hasText:'Edit'}).first();
    ensure(await editButton.isVisible(),'Saved reaction Edit action missing');
    await editButton.click();
    ensure(await page.locator('.nx-reaction-editor h2').innerText()==='Edit reaction','Reaction editing form not opened');
    await page.locator('#nx-reaction-notes').fill('Updated fictional immediate observation');
    await page.locator('#nx-reaction-save').click();
    const afterReactionEdit=await stateSnapshot(page);
    ensure(afterReactionEdit.entries[0].reactions.length===3 &&
      afterReactionEdit.entries[0].reactions[0].id===editTarget.id &&
      afterReactionEdit.entries[0].reactions[0].recordedAt===editTarget.recordedAt &&
      afterReactionEdit.entries[0].reactions[0].notes==='Updated fictional immediate observation' &&
      afterReactionEdit.entries[0].reactions[1].label==='Head rush',
      'Reaction edit changed identity, timestamp or another reaction');
    ensure(JSON.stringify(afterReactionEdit.kits)===JSON.stringify(fromRetro.kits) &&
      afterReactionEdit.entries[0].id===originalId,
      'Reaction edit changed inventory or dose identity');
    // Delete one event only after confirmation; dose and vial usage cannot change.
    await page.evaluate(()=>nexusDoseReactionModal('Retatrutide',state.peptides.Retatrutide.doses[0].id));
    ensure(await page.locator('.nx-reaction-delete').count()===3,'Reaction Delete actions missing');
    await page.locator('.nx-reaction-delete').last().click();
    const confirmDelete=page.getByRole('button',{name:'Delete reaction',exact:true}).last();
    ensure(await confirmDelete.isVisible(),'Reaction delete confirmation missing');
    await confirmDelete.click();
    const afterReactionDelete=await stateSnapshot(page);
    ensure(afterReactionDelete.entries.length===1 &&
      afterReactionDelete.entries[0].id===originalId &&
      afterReactionDelete.entries[0].reactions.length===2 &&
      !afterReactionDelete.entries[0].reactions.some(r=>r.label==='Injection-site redness') &&
      JSON.stringify(afterReactionDelete.kits)===JSON.stringify(fromRetro.kits),
      'Reaction deletion changed another entry, dose ID or vial inventory');
    await page.evaluate(()=>closeModal());
    verified.push('individual reaction edit/delete retains other events and zero vial deduction');


    // Legacy observations remain on old saved entries; adding new reaction must not rewrite them.
    await page.evaluate(()=>{
      const d=state.peptides.Retatrutide.doses[0];
      d.notes='Legacy historical note preserved';
    });
    await page.evaluate(()=>doseModal('Retatrutide',state.peptides.Retatrutide.doses[0]));
    ensure(await page.locator('.nx-dose-optional').isVisible(),
      'Old saved entry with notes cannot access legacy observations');
    await clickSave(page);
    const afterEdit=await stateSnapshot(page);
    ensure(afterEdit.entries[0].notes==='Legacy historical note preserved',
      'Editing dose erased legacy historical note');

    ensure(afterEdit.entries[0].reactions.length===2,'Subsequent dose edit erased reaction history');
    verified.push('post-dose reaction timestamp, history & zero inventory changes');
    verified.push('single vial confirm/edit/original-ID and exact deduction');

    // B: Impossible request across current open sources must not silently
    // log a partial allocation or touch inventory.
    await seed(page,theme);
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9102,1.5),window.__fixtureKit(9103,5)]);
    await openDose(page);
    // Invalid recorded amounts must not create inventory out of thin air.
    for(const amount of [-1,0]){
      await setDose(page,amount);await clickSave(page);
      const invalid=await stateSnapshot(page);
      ensure(invalid.entries.length===0 && invalid.kits[0].remaining[0]===1.5 &&
        invalid.kits[1].remaining[0]===5,'Invalid amount '+amount+' was saved or changed inventory');
    }
    await setDose(page,7);
    await page.waitForTimeout(650);
    ensure(await page.locator('#alloc-panel').innerText().then(x=>x.includes('Not enough in current vial')),'Shortfall UI not visible');
    let before=await stateSnapshot(page);await clickSave(page);let after=await stateSnapshot(page);
    ensure(after.entries.length===0,'UNDERALLOCATED_FORM_SAVED_PARTIAL_DOSE: 7 mg recorded despite only 6.5 mg open');
    ensure(JSON.stringify(after.kits)===JSON.stringify(before.kits),'Rejected entry altered source stock');
    verified.push('insufficient open stock and invalid amounts cannot log partial dose');

    // C: Multi-vial UI allocation across explicit current sources and
    // one saved dose record, with correct allocation source IDs.
    await seed(page,theme);
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9104,1.5),window.__fixtureKit(9105,5)]);
    await openDose(page);await setDose(page,4);await page.waitForTimeout(650);
    ensure(await page.locator('#alloc-add-kit').count()===1,'Use another vial action absent');
    await page.locator('#alloc-add-kit').click();
    ensure(await page.locator('.alloc-mg-input').count()===2,'Second vial allocation not rendered');
    const editableSource=page.locator('#alloc-rows .nx-hybrid-source-row').first();
    ensure(await editableSource.count()===1,'Editable source row missing in multi-vial mode');
    const technical=editableSource.locator('xpath=following-sibling::details[contains(concat(" ", normalize-space(@class), " "), " nx2-source-identifiers ")][1]');
    ensure(await technical.count()===1,'Source identifiers disclosure missing from multi-vial editor');
    ensure(!(await technical.evaluate(el=>el.open)),'Technical source identifiers should start collapsed');
    await technical.locator('summary').click();
    ensure((await technical.innerText()).includes('9104'),'Kit ID must remain accessible for reconciliation');
    const sourceNames=await page.locator('#alloc-rows .nx-hybrid-source-row > span:first-child').allInnerTexts();
    ensure(sourceNames.length===2 && sourceNames.some(x=>x.includes('Kit 1')) &&
      sourceNames.some(x=>x.includes('Kit 2')) && sourceNames.every(x=>!x.includes('9104')&&!x.includes('9105')),
      'Multi-kit sources should use distinct human-readable ordinals: '+JSON.stringify(sourceNames));
    await page.locator('#nx-dose-step-next').click();
    const splitReview=await page.locator('#nx-dose-review-rows').innerText();
    ensure(splitReview.includes('Source 1')&&splitReview.includes('Source 2')&&splitReview.includes('Total allocated'),'Multi-vial Review omits structured source rows');
    ensure(!splitReview.includes('Kit 9104')&&!splitReview.includes('Kit 9105'),'Primary multi-vial Review should not expose raw kit IDs');
    const splitIds=page.locator('#nx-dose-source-ids');
    await splitIds.locator('summary').click();
    const auditIds=await splitIds.innerText();
    ensure(auditIds.includes('9104')&&auditIds.includes('9105'),'Multi-vial Review loses selected kit identity in source identifiers');
    await clickSave(page);
    const split=await stateSnapshot(page);
    ensure(split.entries.length===1,'Multi-vial save generated zero/duplicate records');
    ensure(split.entries[0].allocations?.length===2,'Multi-vial allocation lost vial identity');
    ensure(Math.abs(split.kits[0].remaining[0])<.01 &&
      Math.abs(split.kits[1].remaining[0]-2.5)<.01,'Two-source inventory math wrong');
    verified.push('actual UI multi-vial selection & one dose record');

    // D: Recording a prepared syringe changes prepared remaining count,
    // never deducts the source vial again.
    await seed(page,theme);
    await page.evaluate(()=>{
      state.supplies=[window.__fixtureKit(9106,4)];
      state.preparedDoses=[{id:8109,compound:'Retatrutide',amountEach:2,
        unit:'mg',count:3,remainingCount:3,createdAt:'2026-10-23T11:00',
        allocations:[{kitId:9106,vialId:19106,amount:6}]}];
    });
    await openDose(page);
    ensure(await page.locator('.src-opt[data-src="8109"]').count()===1,'Prepared source selector missing');
    await page.locator('#nx-dose-step-next').click();
    const preparedReview=await page.locator('#nx-dose-review-rows').innerText();
    ensure(preparedReview.includes('Prepared dose')&&preparedReview.includes('8109')===false,'Prepared review source is unclear');
    await clickSave(page);
    const prepared=await stateSnapshot(page);
    ensure(prepared.entries.length===1 && prepared.entries[0].fromPreparedId===8109,
      'Prepared source not recorded');
    ensure(prepared.prepared[0].remainingCount===2,'Prepared batch decrement wrong');
    ensure(Math.abs(prepared.kits[0].remaining[0]-4)<.01,'Prepared administration double-deducted the vial');
    verified.push('prepared-source confirmation without second vial deduction');

    // E: Real modal handoff to "Open sealed vial" preserves everything
    // entered without actually opening/altering a physical vial.
    await seed(page,theme);
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9107,1,1)]);
    await openDose(page);
    await setDose(page,3);
    ensure(!(await page.locator('.nx-dose-optional').isVisible()),'New dose includes old observations');
    await page.locator('#site').selectOption({index:1});
    const selectedSite=await page.locator('#site').inputValue();
    await page.waitForTimeout(650);
    ensure(await page.locator('#alloc-open-new').count()===1,'Open sealed vial action missing');
    await page.locator('#alloc-open-new').click();
    const draft=await stateSnapshot(page);
    ensure(draft.draft?.name==='Retatrutide' && draft.draft.dose==='3'
      && draft.draft.site===selectedSite,
      'New-vial handoff lost typed draft values');
    ensure(draft.entries.length===0 && Math.abs(draft.kits[0].remaining[0]-1)<.01 &&
      Math.abs(draft.kits[0].remaining[1]-10)<.01,'Draft handoff unexpectedly changed inventory/history');
    verified.push('new-vial handoff preserves unsaved draft with no deduction');
    ensure(errors.length===0,'Browser JS errors: '+errors.join(' | '));
    results.push({width,theme,kind,status:'PASS',verified});
    await context.close();
  }
}finally{await browser.close();}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/Nexus_'+VERSION+'_LOG_DOSE_END_TO_END.json',
  JSON.stringify(results,null,2));
console.log('Log Dose browser end-to-end PASS',results.length,'configurations;',results.reduce((x,r)=>x+r.verified.length,0),'flows');
