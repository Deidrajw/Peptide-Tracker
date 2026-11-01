import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit} from 'playwright';
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const engine=process.env.NEXUS_BROWSER==='webkit'?webkit:chromium;
const browser=await engine.launch({headless:true,...(engine===chromium?{args:['--no-sandbox']}:{})});
const results=[];
try {
 for(const width of [320,390])for(const theme of ['light','dark'])for(const kind of ['live','demo']){
  const ctx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+process.cwd()+'/dist/Nexus_'+version+'_FULL_DEMO.html',{waitUntil:'domcontentloaded'});
  await page.evaluate(theme=>{
   if(!isDemoMode())enterDemoMode('weight_loss');
   document.documentElement.dataset.theme=theme;
   state.profile.onboardingDone=true;
   // Dismiss fictional onboarding overlay before testing direct Stash taps.
   document.querySelectorAll('.modal-bg').forEach(bg=>{if(bg.querySelector('#ob-next'))bg.remove();});
   const banner=document.querySelector('#demo-banner');if(banner)banner.style.display='none';
   tab='stash';render();
  },theme);
  const before=await page.evaluate(()=>JSON.stringify(state.supplies));
  await page.evaluate(()=>supplyModal(null,null));
  assert.equal(await page.locator('.nx-kit-type-choice').count(),5,'One Add Kit flow requires five product forms');
  const layout=await page.locator('.nx-kit-type-picker').evaluate(section=>{
    const viewport=document.documentElement.clientWidth;
    const controls=[...section.querySelectorAll('.nx-kit-type-choice')];
    return {viewport,right:section.getBoundingClientRect().right,
      heights:controls.map(x=>x.getBoundingClientRect().height)};
  });
  assert.ok(layout.right<=layout.viewport+2,'Add Kit chooser overflow: '+JSON.stringify(layout));
  assert.ok(layout.heights.every(h=>h>=44),'Kit form below 44px target: '+JSON.stringify(layout));
  // Custom compound path: not in the curated library, intentionally entered by the user.
  // Selecting must NOT persist a kit or mutate the pre-existing inventory.
  await page.locator('[data-kit-form="vial"]').click();
  await page.locator('#nx-kit-combobox-input').fill('SLU-PP-332');
  assert.equal(await page.locator('#nx-kit-combobox-list [role="option"]').filter({hasText:'SLU-PP-332'}).count(),1,
    'SLU-PP-332 must now resolve as a curated compound');
  await page.locator('#nx-kit-combobox-input').fill('Fictional Unlisted Compound');
  const createVial=page.locator('#nx-kit-combobox-list button').filter({hasText:'Add "Fictional Unlisted Compound"'});
  assert.equal(await createVial.count(),1,'Unknown compound must offer Add custom action in Vial kits');
  await createVial.click();
  assert.equal(await page.locator('#sname').inputValue(),'Fictional Unlisted Compound','Custom vial selection must set canonical kit field');
  assert.equal(await page.locator('#nx-kit-combobox-input').inputValue(),'Fictional Unlisted Compound');
  assert.equal(await page.evaluate(()=>JSON.stringify(state.supplies)),before,'Selecting custom compound must not save a kit');
  // Reopen picker: dismiss unsaved fictional draft, then test Other forms.
  await page.locator('.modal #x').click();
  await page.evaluate(()=>supplyModal(null,null));
  await page.locator('[data-kit-form="capsule-bottle"]').click();
  // Other formulations must share vial picker geometry and compact 5-result UX.
  await page.locator('#nx-form-name').focus();
  assert.equal(await page.locator('#nx-form-match-list [role="option"]').count(),5,
    'Non-vial compound picker must show five compact choices, matching Vials');
  assert.equal(await page.locator('#nx-form-match-list .nx-kit-browse-all').count(),1,
    'Non-vial compound picker must offer View all compounds');
  const rows=await page.locator('#nx-form-match-list [role="option"]').evaluateAll(items=>
    items.map(x=>({height:x.getBoundingClientRect().height,bg:getComputedStyle(x).backgroundColor,border:getComputedStyle(x).borderTopWidth})));
  assert.ok(rows.every(x=>x.height>=44),'Compound result touch targets must be at least 44px');
  await page.locator('#nx-form-name').fill('');
  await page.locator('#nx-form-name').fill('SLU-PP-332');
  assert.equal(await page.locator('#nx-form-match-list [role="option"]').filter({hasText:'SLU-PP-332'}).count(),1,
    'Other forms must resolve curated compound');
  await page.locator('#nx-form-name').fill('Fictional Unlisted Compound');
  const createForm=page.locator('#nx-form-match-list button').filter({hasText:'Use "Fictional Unlisted Compound"'});
  assert.equal(await createForm.count(),1,'Unknown compound must offer custom option in Other forms');
  await createForm.click();
  assert.equal(await page.locator('#nx-form-name').inputValue(),'Fictional Unlisted Compound');
  assert.equal(await page.locator('#nx-form-match-list').isHidden(),true,'Explicit custom selection must close matches');
  await page.locator('#nx-form-name').fill('Fictional Slew');
  await page.locator('#nx-form-count').fill('30');
  await page.locator('#nx-form-strength').fill('5');
  await page.locator('#nx-form-save').click();
  assert.equal(await page.locator('.nx-other-stock-row').count(),1,'Capsules must appear in Other forms');
  assert.equal(await page.locator('.stash-sub-btn[data-sub="other"][aria-pressed="true"]').count(),1,
    'Saved capsule should switch to Other forms');
  await page.locator('.stash-sub-btn[data-sub="kits"]').click();
  assert.equal(await page.locator('.nx-other-stock-row').count(),0,
    'Vial kits must not display independent capsule inventory');
  await page.locator('.stash-sub-btn[data-sub="other"]').click();
  await page.evaluate(()=>supplyModal(null,null));
  await page.locator('[data-kit-form="nasal-bottle"]').click();
  await page.locator('#nx-form-name').fill('Fictional Slew');
  await page.locator('#nx-form-volume').fill('7');
  await page.locator('#nx-form-mg').fill('10');
  await page.locator('#nx-form-save').click();
  await page.locator('.nx-form-edit').first().click();
  await page.locator('#nx-form-count').fill('27');
  await page.locator('#nx-form-save').click();
  const editForm=await page.locator('.nx-form-stock-editor').count();
  assert.equal(editForm,0,'Adjustment modal did not close');
  const touch=await page.locator('.nx-form-edit').first().evaluate(el=>({
    height:el.getBoundingClientRect().height,
    right:el.getBoundingClientRect().right,
    viewport:document.documentElement.clientWidth
  }));
  assert.ok(touch.height>=44&&touch.right<=touch.viewport+2,'Adjustment control touch/overflow regression: '+JSON.stringify(touch));
  const after=await page.evaluate(()=>({
   stock:state.formulationStocks,
   demo:isDemoMode(),
   visible:document.querySelectorAll('.nx-other-stock-row').length
  }));
  // Compare original vial state from first snapshot, never infer formulations from kits.
  const current=await page.evaluate(()=>JSON.stringify(state.supplies));
  assert.equal(current,before,'existing vial kits changed');
  assert.equal(after.demo,true,'fictional test escaped demo mode');
  assert.equal(after.visible,2);
  assert.deepEqual(after.stock.map(x=>x.containerType),['capsule-bottle','nasal-bottle']);
  assert.equal(after.stock[0].remainingCount,27);
  assert.equal(after.stock[0].transactions[0].before.remainingCount,30);
  assert.equal(after.stock[1].remainingMl,7);
  assert.equal(after.stock[1].mgPerSpray,null);
  // Two open physical vials of one kit must be independently selectable.
  // No physical transfer or dose is written merely by changing the selected vial.
  await page.evaluate(()=>{
    const demoName='Fictional Source Selector';
    state.customPeptides=state.customPeptides||{};
    state.customPeptides[demoName]={enabled:true,route:'SubQ',doses:[]};
    state.supplies.push({id:992211,name:demoName,activeKit:true,preparationMethod:'SubQ',vialMg:10,bacMl:2,
      totalVials:2,openedVials:1,vials:[
        {id:'source-a',sequenceNumber:1,status:'open',vialMg:10,remainingMg:7,intendedUse:'SubQ'},
        {id:'source-b',status:'sealed',vialMg:10,remainingMg:10}]});
    openNewVialModal(992211);
    document.querySelector('#rv-purpose').value='Injectable';
    document.querySelector('#rvsave').click();
  });
  const afterOpen=await page.evaluate(()=>state.supplies.find(k=>k.id===992211).vials.map(v=>({id:v.id,status:v.status,remainingMg:v.remainingMg,sequenceNumber:v.sequenceNumber})));
  assert.equal(afterOpen.length,2);
  assert.deepEqual(afterOpen.map(v=>v.status),['open','open'],'Opening Vial 2 must leave Vial 1 open');
  assert.deepEqual(afterOpen.map(v=>v.remainingMg),[7,10],'Opening second vial must retain both individual quantities');
  assert.equal(afterOpen[1].sequenceNumber,2,'Second physical vial must have independent sequence');
  await page.evaluate(()=>doseModal('Fictional Source Selector'));
  assert.equal(await page.locator('.nx-dose-source-readout').count(),0,
    'Two verified open vials must not show a redundant Fresh from vial readout');
  assert.ok((await page.locator('.nx-dose-source-exception').innerText()).includes('Which vial did you use?'),
    'Multiple-vial choice requires a direct question');
  assert.equal(await page.locator('#nx-dose-site-field').isVisible(),true,
    'SubQ should offer an optional injection-site field');
  // A saved product form must NOT hide per-dose method choices. Switching
  // SubQ to IM reopens the same verified Injectable physical choices, with
  // no source mass or history mutation until actual dose save.
  assert.equal(await page.locator('[data-admin-method="IM"]').isVisible(),true,
    'IM route must be visibly selectable in a saved injectable setup');
  await page.locator('[data-admin-method="IM"]').click();
  assert.equal(await page.locator('#nx-dose-method').inputValue(),'IM',
    'Selecting IM must apply only to this draft dose');
  assert.equal(await page.locator('.kit-opt[data-kit="992211"]').count(),2,
    'An Injectable vial may be eligible for IM without relabelling physical stock');
  assert.deepEqual(await page.evaluate(()=>state.supplies.find(k=>k.id===992211).vials.map(v=>v.remainingMg)),[7,10],
    'Exploring another injection route cannot debit stock');
  await page.locator('[data-admin-method="SubQ"]').click();
  assert.equal(await page.locator('#nx-dose-method').inputValue(),'SubQ',
    'Returning to SubQ should restore SubQ per-dose method');

  for(const method of ['Nasal','Oral','Topical','IV','Other']){
    await page.evaluate(value=>{
      const select=document.querySelector('#nx-dose-method');
      select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));
    },method);
    assert.equal(await page.locator('#nx-dose-site-field').isVisible(),false,
      method+' should not show an injection-site field');
    assert.equal(await page.locator('#site').inputValue(),'',
      method+' should not retain an incompatible injection site');
  }
  await page.evaluate(()=>{
    const select=document.querySelector('#nx-dose-method');
    select.value='SubQ';select.dispatchEvent(new Event('change',{bubbles:true}));
  });
  assert.equal(await page.locator('#nx-dose-site-field').isVisible(),true,
    'Returning to SubQ must restore the injection-site field');
  await page.locator('#nx-dose-entered').fill('1.5');
  await page.locator('#nx-dose-use-setup').click();
  assert.equal(await page.locator('.nx-use-setup').count(),1,
    'Edit defaults must open the real use-setup editor');
  assert.equal(await page.locator('#nx-use-injection-group').count(),0,
    'Stash use setup should not force a permanent SubQ/IM route');
  assert.equal(await page.locator('#nx-use-family').inputValue(),'Injectable',
    'Injectable is the stored product form, not an injection route');
  const retainedDraft=await page.evaluate(()=>({
    dose:state._pendingDoseDraft?.dose,
    date:state._pendingDoseDraft?.date,
    inventory:state.supplies.find(k=>k.id===992211)?.vials.map(v=>v.remainingMg)
  }));
  assert.equal(Number(retainedDraft.dose),1.5,'Edit defaults must preserve the unsaved dose amount');
  assert.deepEqual(retainedDraft.inventory,[7,10],'Opening defaults must never deduct stock');
  await page.evaluate(()=>{closeModal();doseModal('Fictional Source Selector');});
  assert.equal(Number(await page.locator('#nx-dose-entered').inputValue()),1.5,
    'Returning to the dose should restore the unsaved amount');
  const physicalChoices=page.locator('.kit-opt[data-kit="992211"]');
  assert.equal(await physicalChoices.count(),2,'Two vials in same kit must have separate source choices');
  assert.deepEqual(await physicalChoices.evaluateAll(items=>items.map(b=>b.dataset.vial)),['source-a','source-b']);
  assert.equal(await physicalChoices.evaluateAll(items=>items.filter(b=>b.getAttribute('aria-pressed')==='true').length),0,'Ambiguous kit/vial source must not be preselected');
  await physicalChoices.nth(1).click();
  assert.equal(await physicalChoices.nth(1).getAttribute('aria-pressed'),'true','Explicit source selection must mark only chosen vial');
  const untouchedSources=await page.evaluate(()=>state.supplies.find(k=>k.id===992211).vials.map(v=>v.remainingMg));
  assert.deepEqual(untouchedSources,[7,10],'Selecting a vial must not debit either balance');
  await page.evaluate(()=>{
    document.querySelector('#dose').value='1';
    document.querySelector('#save').click();
  });
  const exactCommitted=await page.evaluate(()=>{
    const k=state.supplies.find(k=>k.id===992211);
    const d=state.customPeptides['Fictional Source Selector'].doses;
    return {balances:k.vials.map(v=>v.remainingMg),doses:d.map(x=>({allocations:x.allocations,kitId:x.kitId}))};
  });
  assert.deepEqual(exactCommitted.balances,[7,9],'Dose must deduct only selected second vial');
  assert.equal(exactCommitted.doses.length,1,'One dose should be saved');
  assert.equal(String(exactCommitted.doses[0].allocations?.[0]?.vialId),'source-b','Dose ledger must retain exact vial ID');
  await page.evaluate(()=>{
    closeModal();
    nexusCreateLinkedPreparation(992211,'source-a');
    document.querySelector('#nx-linked-kind').value='nasal';
    document.querySelector('#nx-linked-notes').value='Fictional preparation plan';
    document.querySelector('#nx-linked-save').click();
  });
  const planCheck=await page.evaluate(()=>{
    const kit=state.supplies.find(k=>k.id===992211);
    return {balances:kit.vials.map(v=>v.remainingMg),plans:kit.linkedPreparationPlans,
      formulations:(state.formulationStocks||[]).filter(x=>x.sourceKitId===992211)};
  });
  assert.deepEqual(planCheck.balances,[7,9],'Linked preparation plan must never debit original vial');
  assert.equal(planCheck.plans.length,1);
  assert.equal(planCheck.plans[0].sourceVialId,'source-a','Plan must link exact original source');
  assert.equal(planCheck.plans[0].status,'planned-no-transfer');
  assert.equal(planCheck.formulations.length,0,'No unvalidated bottle stock must be created');
  await page.evaluate(()=>closeModal());
  // Two distinct PHYSICAL forms sharing a compound must remain isolated.
  // This fixture uses two verified open vials rather than silently assuming
  // the separate capsule-bottle schema has a backed dose transaction.
  await page.evaluate(()=>{
    state.supplies.push({id:992212,name:'Fictional Source Selector',
      activeKit:true,preparationMethod:'Oral',vialMg:5,totalVials:1,
      vials:[{id:'oral-source',sequenceNumber:1,status:'open',vialMg:5,remainingMg:4,intendedUse:'Oral'}]});
    doseModal('Fictional Source Selector');
  });
  await page.locator('[data-admin-method="Oral"]').click();
  assert.equal(await page.locator('#nx-dose-method').inputValue(),'Oral',
    'Oral form must be independently selectable for same compound');
  const oralEligible=await page.evaluate(()=>{
    const named=[...document.querySelectorAll('.kit-opt')].map(x=>x.dataset.vial);
    return {named,source:[...document.querySelectorAll('.nx-dose-stock-status')].map(x=>x.textContent)};
  });
  assert.equal(oralEligible.named.length,0,
    'One oral vial should not show ambiguous multi-vial choices');
  assert.equal(await page.locator('#nx-dose-inventory-status').isVisible(),true,
    'One eligible Oral vial must appear as available stock');
  await page.locator('#nx-dose-entered').fill('1');
  await page.locator('#nx-dose-review-open').click();
  await page.locator('#save').click();
  const oralResult=await page.evaluate(()=>{
    const injection=state.supplies.find(x=>x.id===992211);
    const oral=state.supplies.find(x=>x.id===992212);
    const latest=state.customPeptides['Fictional Source Selector'].doses.at(-1);
    return {injectable:injection.vials.map(v=>v.remainingMg),oral:oral.vials[0].remainingMg,
      method:latest?.method,source:latest?.allocations?.[0]?.vialId};
  });
  assert.deepEqual(oralResult.injectable,[7,9],
    'Oral dose must not debit the same compound injectable stock');
  assert.equal(oralResult.oral,3,'Oral dose must debit only exact oral-form vial');
  assert.equal(oralResult.method,'Oral','Dose history must record per-entry Oral method');
  assert.equal(oralResult.source,'oral-source','Oral source vial ID must remain linked');
  await page.evaluate(()=>closeModal());
  // A physical open compound must be discoverable from Today even with NO
  // associated protocol, without creating a protocol simply by opening the picker.
  await page.evaluate(()=>{
    state.protocols=[];
    tab='home';render();
    todayLogDosePicker();
  });
  assert.equal(await page.locator('#today-dose-compound').locator('option').filter({hasText:'Fictional Source Selector'}).count(),1,
    'Unprotocolled stocked compound must be available in Today Log Dose');
  const protocolCount=await page.evaluate(()=>state.protocols.length);
  assert.equal(protocolCount,0,'Opening Log Dose must not create a protocol');
  await page.evaluate(()=>closeModal());
  // Post-protocol follow-up is optional UI, never a condition of dose persistence.
  const followup=await page.evaluate(()=>{
    state.protocols=[{id:84921,name:'Completed fictional cycle',startDate:'2026-01-01',
      status:'completed',compounds:[{name:'Fictional Source Selector',phases:[{type:'dose',durationWeeks:1}]}]}];
    const existingCount=state.customPeptides['Fictional Source Selector'].doses.length;
    const prn=nexusPostProtocolDoseFollowup('Fictional Source Selector',
      {id:'prn-example',date:'2026-10-29T12:00',asNeeded:true});
    const shown=nexusPostProtocolDoseFollowup('Fictional Source Selector',
      {id:'standalone-example',date:'2026-10-29T12:00',asNeeded:false});
    const visible=!!document.querySelector('#nexus-followup-dismiss');
    document.querySelector('#nexus-followup-dismiss')?.click();
    const acknowledged=!!state.protocolDoseFollowupAcknowledged?.['84921|Fictional Source Selector'];
    const repeated=nexusPostProtocolDoseFollowup('Fictional Source Selector',
      {id:'another-example',date:'2026-10-29T12:05',asNeeded:false});
    return {prn,shown,visible,acknowledged,repeated,existingCount,
      currentCount:state.customPeptides['Fictional Source Selector'].doses.length,
      protocolStatus:state.protocols[0].status};
  });
  assert.equal(followup.prn,false,'PRN doses must not trigger protocol follow-up');
  assert.equal(followup.shown,true,'Completed protocol should trigger follow-up');
  assert.equal(followup.visible,true,'Follow-up actions not visible');
  assert.equal(followup.acknowledged,true,'Dismiss acknowledgement not persisted');
  assert.equal(followup.repeated,false,'Acknowledged follow-up must not repeatedly nag');
  assert.equal(followup.currentCount,followup.existingCount,'Notice must not alter dose history');
  assert.equal(followup.protocolStatus,'completed','Notice must not reactivate protocol');
  results.push({width,theme,kind,result:'PASS'});
  await ctx.close();
 }
} finally {await browser.close();}
console.log('PASS: '+engine.name()+' unified Add Kit chooser, capsule/nasal kit cards and untouched vial stock in '+results.length+' fictional LIVE/DEMO sessions');
