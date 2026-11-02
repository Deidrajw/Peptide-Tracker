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
  const visualEvidence=[];
  const captureVisual=async(stage,selector)=>{
    // The synthetic banner is a fixture helper, not part of the app sheet.
    await page.evaluate(()=>{const bar=document.querySelector('#demo-banner');if(bar)bar.style.display='none';});
    const shell=page.locator(selector).first();
    assert.ok(await shell.count()>0,'Missing visual target: '+stage);
    await shell.evaluate(el=>Promise.all(el.getAnimations({subtree:true}).map(a=>a.finished.catch(()=>{}))));
    const geometry=await shell.evaluate(el=>{
      const b=el.getBoundingClientRect(),doc=document.documentElement;
      const style=getComputedStyle(el);
      const top=Math.max(0,b.top),bottom=Math.min(innerHeight,b.bottom);
      const visibleHeight=Math.max(0,bottom-top);
      const sampleX=Math.max(1,Math.min(doc.clientWidth-2,b.left+b.width/2));
      const sampleY=visibleHeight>0?Math.max(1,Math.min(innerHeight-2,top+Math.min(32,visibleHeight/2))):-1;
      const topmost=sampleY>=0?document.elementFromPoint(sampleX,sampleY):null;
      const activeModal=el.closest('.modal');
      const actualModal=document.querySelector('.modal-bg:last-of-type .modal');
      return {
        left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height,
        viewport:doc.clientWidth,viewportHeight:innerHeight,scrollWidth:doc.scrollWidth,
        visibleHeight,opacity:style.opacity,visibility:style.visibility,
        foreground:!!(topmost&&el.contains(topmost)),
        activeSheet:!!activeModal&&activeModal===actualModal,
        topmostNode:topmost?.id||topmost?.className?.toString().slice(0,80)||'none',
        focus:document.activeElement?.id||''
      };
    });
    assert.ok(geometry.scrollWidth<=geometry.viewport+2 &&
      geometry.left>=-2&&geometry.right<=geometry.viewport+2,
      'Visual horizontal clipping '+stage+': '+JSON.stringify(geometry));
    assert.ok(geometry.visibleHeight>=Math.min(48,geometry.height*.4) &&
      geometry.opacity!=='0'&&geometry.visibility==='visible'&&
      geometry.foreground&&geometry.activeSheet,
      'Capture target not actually in foreground viewport '+stage+': '+JSON.stringify(geometry));
    fs.mkdirSync('dist',{recursive:true});
    const basename='Nexus_'+version+'_VISUAL_'+engine.name()+'_'+kind+'_'+theme+'_'+width+'_'+stage;
    const filename=basename+'.png';
    await page.screenshot({path:'dist/'+filename,fullPage:false});
    const targetFile=basename+'_target.png';
    await shell.screenshot({path:'dist/'+targetFile});
    visualEvidence.push({stage,filename,targetFile,geometry});
  };
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
  const kitHeader=await page.locator('.modal.nx-stash-kit-editor').evaluate(modal=>{
    const head=modal.querySelector('.nx-unified-header .nx-dose-head');
    const intro=modal.querySelector('.nx-unified-body>.nx-kit-editor-intro');
    const progress=modal.querySelector('.nx-unified-body>.nx-kit-wizard-progress');
    const close=head?.querySelector('#x');
    const hr=head?.getBoundingClientRect(),cr=close?.getBoundingClientRect();
    return {head:!!head,intro:!!intro,progress:!!progress,
      ordered:!!(intro&&progress&&(intro.compareDocumentPosition(progress)&Node.DOCUMENT_POSITION_FOLLOWING)),
      close:!!close,height:cr?.height,aligned:!!(hr&&cr&&cr.top>=hr.top-2&&cr.bottom<=hr.bottom+2),
      viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth};
  });
  assert.ok(kitHeader.head&&kitHeader.intro&&kitHeader.progress&&kitHeader.ordered&&
    kitHeader.close&&kitHeader.height>=44&&kitHeader.aligned&&kitHeader.scroll<=kitHeader.viewport+2,
    'Add Kit sheet header/intro/progress order or close alignment: '+JSON.stringify(kitHeader));
  await captureVisual('add-kit-first-step','.modal.nx-stash-kit-editor');
  await page.locator('#nx-kit-combobox-input').fill('SLU-PP-332');
  assert.equal(await page.locator('#nx-kit-combobox-list [role="option"]').filter({hasText:'SLU-PP-332'}).count(),1,
    'SLU-PP-332 must now resolve as a curated compound');
  await page.locator('#nx-kit-combobox-input').fill('Fictional Unlisted Compound');
  const createVial=page.locator('#nx-kit-combobox-list button').filter({hasText:'Use "Fictional Unlisted Compound"'});
  assert.equal(await createVial.count(),1,'Unknown compound must offer Add custom action in Vial kits');
  await createVial.click();
  assert.equal(await page.locator('#sname').inputValue(),'Fictional Unlisted Compound','Custom vial selection must set canonical kit field');
  assert.equal(await page.locator('#nx-kit-combobox-input').inputValue(),'Fictional Unlisted Compound');
  assert.equal(await page.evaluate(()=>JSON.stringify(state.supplies)),before,'Selecting custom compound must not save a kit');
  // Reopen picker: dismiss unsaved fictional draft, then test Other forms.
  await page.locator('.modal #x').click();
  await page.evaluate(()=>supplyModal(null,null));
  await page.locator('[data-kit-form="capsule-bottle"]').click();
  // Keep a single custom combobox on iPhone: native datalist duplicates suggestions.
  assert.equal(await page.locator('#nx-form-compound-list').count(),0,
    'Other forms must not display a second browser-native suggestion picker');
  assert.equal(await page.locator('#nx-form-name').getAttribute('aria-label'),
    'Compound · type to search or browse','Other forms compound control needs same accessible intent as Vial kits');
  // Other formulations must share vial picker geometry and compact 5-result UX.
  await page.locator('#nx-form-name').focus();
  assert.equal(await page.locator('#nx-form-match-list [role="option"]').count(),5,
    'Non-vial compound picker must show five compact choices, matching Vials');
  assert.equal(await page.locator('#nx-form-match-list .nx-kit-browse-all').count(),1,
    'Non-vial compound picker must offer View all compounds');
  const rows=await page.locator('#nx-form-match-list [role="option"]').evaluateAll(items=>
    items.map(x=>({height:x.getBoundingClientRect().height,bg:getComputedStyle(x).backgroundColor,border:getComputedStyle(x).borderTopWidth})));
  assert.ok(rows.every(x=>x.height>=44),'Compound result touch targets must be at least 44px');
  const pickerGeometry=await page.locator('.nx-form-compound-combobox').evaluate(combo=>{
    const list=combo.querySelector('#nx-form-match-list');
    const rect=list.getBoundingClientRect();
    return {right:rect.right,viewport:document.documentElement.clientWidth,
      clientHeight:list.clientHeight,scrollHeight:list.scrollHeight,
      overflowY:getComputedStyle(list).overflowY};
  });
  assert.ok(pickerGeometry.right<=pickerGeometry.viewport+2,
    'Other forms picker exceeds iPhone viewport: '+JSON.stringify(pickerGeometry));
  assert.ok(pickerGeometry.scrollHeight<=pickerGeometry.clientHeight+2,
    'Other forms five-result picker must not create nested vertical scrolling: '+JSON.stringify(pickerGeometry));
  await captureVisual('picker-five-results','.nx-form-compound-combobox');
  await page.locator('#nx-form-name').press('ArrowDown');
  assert.equal(await page.locator('#nx-form-match-list [role="option"]').first().evaluate(x=>x===document.activeElement),true,
    'Other forms ArrowDown must focus first compound choice');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#nx-form-match-list').isHidden(),true,
    'Keyboard compound selection must close the suggestion list');
  assert.equal(await page.locator('#nx-form-name').evaluate(el=>el===document.activeElement),true,
    'Selected keyboard compound must return focus to the editable search field');

  await page.locator('#nx-form-name').fill('');
  await page.locator('#nx-form-name').fill('SLU-PP-332');
  assert.equal(await page.locator('#nx-form-match-list [role="option"]').filter({hasText:'SLU-PP-332'}).count(),1,
    'Other forms must resolve curated compound');
  await page.locator('#nx-form-name').fill('Fictional Unlisted Compound');
  // Enter should never silently replace a new custom name with the top search result.
  await page.locator('#nx-form-name').press('Enter');
  assert.equal(await page.locator('#nx-form-name').inputValue(),'Fictional Unlisted Compound',
    'Enter must preserve typed custom compound rather than pick first suggestion');
  await page.locator('#nx-form-name').focus();
  await page.locator('#nx-form-match-list').waitFor({state:'visible',timeout:1500});
  const pickerAfterTyping=await page.locator('#nx-form-match-list').evaluate(list=>({
    hidden:list.hidden,display:getComputedStyle(list).display,
    inputValue:document.querySelector('#nx-form-name')?.value,
    activeId:document.activeElement?.id,
    focusedInside:list.parentElement?.contains(document.activeElement),
    resultLabels:[...list.querySelectorAll('button')].map(b=>b.textContent)
  }));
  assert.ok(!pickerAfterTyping.hidden && pickerAfterTyping.display!=='none',
    'Typing after keyboard choice must reopen compound choices: '+JSON.stringify(pickerAfterTyping));
  await captureVisual('picker-custom','.nx-form-compound-combobox');
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

  // PR124 physical-iPhone failure reproduction: entry and review must use one
  // DS2 sheet and no full-height single-choice detour. Fictional sources only.
  await page.evaluate(()=>{
    const oral=state.formulationStocks.find(x=>x.containerType==='capsule-bottle');
    const nasal=state.formulationStocks.find(x=>x.containerType==='nasal-bottle');
    oral.remainingCount=27;
    nasal.remainingMg=10;nasal.remainingMl=7;nasal.mgPerSpray=0.05;nasal.mlPerSpray=0.1;
    nexusCapsuleDoseModal('Fictional Slew');
  });
  const formLayout=async()=>{
    return page.locator('.modal.nx-form-log-sheet').evaluate(el=>{
      const bounds=el.getBoundingClientRect();
      const head=el.querySelector('.nx-dose-head');
      const close=head.querySelector('#x').getBoundingClientRect();
      return {sheetRight:bounds.right,sheetHeight:bounds.height,
        viewportWidth:document.documentElement.clientWidth,viewportHeight:window.innerHeight,
        scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,
        closeWidth:close.width,closeHeight:close.height,
        outlinedClose:!!head.querySelector('#x svg[aria-hidden="true"]'),
        closeSvgColor:getComputedStyle(head.querySelector('#x svg')).color,
        duplicateIconDisplay:getComputedStyle(head.querySelector('#x'),'::after').display,
        pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+2};
    });
  };
  const oralLayout=await formLayout();
  assert.ok(!oralLayout.pageOverflow&&oralLayout.sheetRight<=oralLayout.viewportWidth+2,
    'Capsule sheet viewport overflow: '+JSON.stringify(oralLayout));
  assert.ok(oralLayout.outlinedClose&&oralLayout.sheetHeight<=oralLayout.viewportHeight+2&&oralLayout.closeWidth>=43.99&&oralLayout.closeHeight>=43.99,
    'Capsule sheet height/close target: '+JSON.stringify(oralLayout));
  assert.ok(oralLayout.closeSvgColor!=='rgba(0, 0, 0, 0)'&&oralLayout.closeSvgColor!=='transparent'&&oralLayout.duplicateIconDisplay==='none',
    'Capsule close must render one visible SVG, not a duplicate masked glyph: '+JSON.stringify(oralLayout));
  await page.locator('#nx-capsule-count').fill('2');
  await page.locator('#nx-capsule-review').click();
  assert.equal(await page.locator('#nx-capsule-entry-fields').isHidden(),true,
    'Capsule review should replace entry controls, not duplicate them');
  assert.equal(await page.locator('#nx-capsule-confirm').isVisible(),true);
  await page.locator('#nx-capsule-back').click();
  assert.equal(await page.locator('#nx-capsule-entry-fields').isVisible(),true);
  assert.equal(await page.locator('#nx-capsule-count').inputValue(),'2',
    'Back must preserve the exact original input');
  await page.evaluate(()=>closeModal());
  await page.evaluate(()=>nexusNasalDoseModal('Fictional Slew'));
  const nasalLayout=await formLayout();
  assert.ok(!nasalLayout.pageOverflow&&nasalLayout.sheetRight<=nasalLayout.viewportWidth+2,
    'Spray sheet viewport overflow: '+JSON.stringify(nasalLayout));
  assert.ok(nasalLayout.outlinedClose&&nasalLayout.sheetHeight<=nasalLayout.viewportHeight+2&&nasalLayout.closeWidth>=44&&nasalLayout.closeHeight>=44,
    'Spray sheet height/close target: '+JSON.stringify(nasalLayout));
  assert.ok(nasalLayout.closeSvgColor!=='rgba(0, 0, 0, 0)'&&nasalLayout.closeSvgColor!=='transparent'&&nasalLayout.duplicateIconDisplay==='none',
    'Spray close must render one visible SVG, not a duplicate masked glyph: '+JSON.stringify(nasalLayout));
  await page.locator('#nx-spray-count').fill('2');
  await page.locator('#nx-spray-review').click();
  assert.equal(await page.locator('#nx-spray-entry-fields').isHidden(),true,
    'Spray review should replace entry controls');
  const reviewedSpray=await page.locator('#nx-spray-summary').textContent();
  assert.ok(reviewedSpray.includes('Estimated bottle balance after saving'),
    'Spray review must name estimated balance');
  assert.ok(!reviewedSpray.includes(String((await page.evaluate(()=>state.formulationStocks.find(x=>x.containerType==='nasal-bottle').id)))),
    'Spray review must not expose raw internal container ID');
  await page.locator('#nx-spray-back').click();
  assert.equal(await page.locator('#nx-spray-entry-fields').isVisible(),true);
  assert.equal(await page.locator('#nx-spray-count').inputValue(),'2');
  await page.evaluate(()=>closeModal());

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

  // Form-specific capsule logging: an independent stocked compound with no
  // protocol gets its own dose history, while the physical vial ledger and
  // unrelated purchased nasal container must remain unchanged.
  await page.evaluate(()=>doseModal('Fictional Slew'));
  assert.equal(await page.locator('#nx-use-capsules').count(),1,'Capsule stock must offer a form-specific logging choice');
  await page.locator('#nx-use-capsules').click();
  assert.equal(await page.locator('#nx-capsule-count').count(),1,'Capsule entry must log whole capsules');
  assert.equal(await page.locator('.nx-method-grid').count(),0,'Oral capsule entry must not show injectable route choices');
  await page.locator('#nx-capsule-count').fill('2');
  await page.locator('#nx-capsule-review').click();
  assert.ok((await page.locator('#nx-capsule-summary').innerText()).includes('10 mg'),'Capsule strength must determine displayed mass');
  const beforeCapsule=await page.evaluate(()=>JSON.stringify(state.supplies));
  await page.locator('#nx-capsule-save').click();
  const loggedCapsule=await page.evaluate(()=>({
    stock:state.formulationStocks.map(x=>({type:x.containerType,remainingCount:x.remainingCount,remainingMg:x.remainingMg,transactions:x.transactions.length})),
    doses:(state.customPeptides['Fictional Slew']?.doses||[]),
    protocols:(state.protocols||[]).length,
    vials:JSON.stringify(state.supplies)
  }));
  assert.equal(loggedCapsule.stock[0].remainingCount,25,'Two capsules should deduct two units from exact capsule bottle');
  assert.equal(loggedCapsule.stock[1].remainingMg,10,'Capsules must never alter a separate nasal container');
  assert.equal(loggedCapsule.doses.length,1,'Capsules should create one independent record');
  assert.equal(loggedCapsule.doses[0].capsuleCount,2,'Capsule-count history must persist');
  assert.equal(Number(loggedCapsule.doses[0].dose),10,'Saved native amount must equal labelled mass times count');
  assert.equal(loggedCapsule.vials,beforeCapsule,'Capsule entry must never mutate vial stock');
  await page.evaluate(()=>{
    const entry=state.customPeptides['Fictional Slew'].doses[0];
    const stock=state.formulationStocks.find(x=>x.containerType==='capsule-bottle');
    const out=NexusFormulationStock.reverseCapsuleDose(state,{
      sourceId:stock.id,transactionId:entry.capsuleTransactionId,
      reversalId:'fictional-capsule-undo',doseId:entry.id,compound:'Fictional Slew'});
    state=out.next;
  });
  assert.equal(await page.evaluate(()=>state.formulationStocks.find(x=>x.containerType==='capsule-bottle').remainingCount),27,
    'Exact capsule reversal restores count after save');
  assert.equal(await page.evaluate(()=>state.customPeptides['Fictional Slew'].doses.length),0,
    'Exact capsule reversal removes only its linked dose');
  await page.evaluate(()=>doseModal('Fictional Slew'));
  await page.locator('#nx-use-capsules').click();
  await page.locator('#nx-capsule-count').fill('999');
  await page.locator('#nx-capsule-review').click();
  assert.equal(await page.locator('#nx-capsule-confirm').isHidden(),true,
    'Overdrawn capsule amount must never reach confirmation');
  await page.locator('.modal #x').click();



  // Multiple physical capsule containers must require an explicit source, not
  // silently pick the first matching compound just because both are Oral.
  const dual=await page.evaluate(()=>{
    state.formulationStocks.push(NexusFormulationStock.create({id:'fictional-second-capsules',
      compound:'Fictional Slew',containerType:'capsule-bottle',method:'Oral',
      count:3,mgPerCapsule:5}));
    return state.formulationStocks.find(s=>s.containerType==='capsule-bottle').id;
  });
  await page.evaluate(()=>doseModal('Fictional Slew'));
  await page.locator('#nx-use-capsules').click();
  assert.equal(await page.locator('#nx-capsule-source').inputValue(),'',
    'Multiple capsule sources must not silently choose a source');
  await page.locator('#nx-capsule-review').click();
  assert.equal(await page.locator('#nx-capsule-confirm').isHidden(),true,
    'Unselected exact capsule source cannot reach review');
  await page.locator('#nx-capsule-source').selectOption('fictional-second-capsules');
  await page.locator('#nx-capsule-review').click();
  await page.locator('#nx-capsule-save').click();
  const dualAfter=await page.evaluate(id=>({
    first:state.formulationStocks.find(s=>String(s.id)===String(id)).remainingCount,
    second:state.formulationStocks.find(s=>s.id==='fictional-second-capsules').remainingCount,
    source:state.customPeptides['Fictional Slew'].doses[0]?.sourceContainerId
  }),dual);
  assert.equal(dualAfter.first,27,'Other capsule container must retain its balance');
  assert.equal(dualAfter.second,2,'Explicit second source must deduct exactly one capsule');
  assert.equal(dualAfter.source,'fictional-second-capsules','Saved source attribution must identify chosen bottle');

  // A nasal-source label is a reservation, not ready-to-use stock. The pure
  // transfer planner must accept that explicit source only when a destination
  // container and exact mass are provided; preview never changes state.
  const nasalPlanner=await page.evaluate(()=>{
    const kit={id:91810,name:'Fictional Nasal Transfer',isBlend:false,vials:[
      {id:'reserved-source',status:'open',intendedUse:'nasal-source',remainingMg:5}]};
    const bottle={id:'empty-nasal',compound:kit.name,containerType:'nasal-bottle',
      method:'Nasal',remainingMl:5,remainingMg:0,mgPerSpray:null,transactions:[]};
    const before={supplies:[kit],formulationStocks:[bottle],preparations:[],
      peptides:{},customPeptides:{}};
    const tx={id:'fictional-transfer',kind:'transfer-to-formulation',
      sourceKitId:kit.id,sourceVialId:'reserved-source',
      destinationContainerId:bottle.id,amountMg:2};
    const planned=NexusPreparationBridge.planFormulation(before,tx);
    let wrongSourceBlocked=false;
    try{
      NexusPreparationBridge.planFormulation(
        {...before,supplies:[{...kit,vials:[{...kit.vials[0],intendedUse:'Injectable'}]}]},
        {...tx,id:'wrong-form'});
    }catch{wrongSourceBlocked=true;}
    return {source:planned.next.supplies[0].vials[0].remainingMg,
      destination:planned.next.formulationStocks[0].remainingMg,
      original:before.supplies[0].vials[0].remainingMg,
      originalBottle:before.formulationStocks[0].remainingMg,
      correctVial:planned.event.sourceVialId,wrongSourceBlocked};
  });
  assert.deepEqual(nasalPlanner,{source:3,destination:2,original:5,originalBottle:0,
    correctVial:'reserved-source',wrongSourceBlocked:true},
    'Reserved nasal-source preview must conserve mass and reject incompatible stock');


  // DEMO-only complete form-aware nasal flow. Physical vial is debited once
  // upon explicit preparation, never on the later spray log or reversal.
  await page.evaluate(()=>{
    const name='Fictional Prepared Spray Test';
    state.customPeptides[name]={doses:[],status:'inactive',route:'Nasal',unit:'mg'};
    state.supplies.push({id:990400,name,activeKit:true,vialMg:5,vials:[
      {id:'nasal-reserved-a',status:'open',intendedUse:'nasal-source',
        sequenceNumber:1,remainingMg:5,vialMg:5}]});
    nexusRecordNasalPreparation(990400,'nasal-reserved-a');
  });
  assert.equal(await page.locator('#nx-nasal-source-mg').count(),1,
    'Reserved nasal-source should have a direct recorded-preparation workflow in isolated DEMO');
  await page.locator('#nx-nasal-source-mg').fill('2');
  await page.locator('#nx-nasal-bac').fill('1');
  await page.locator('#nx-nasal-saline').fill('4');
  await page.locator('#nx-nasal-pump').fill('0.1');
  await captureVisual('nasal-entry','.modal');
  // Entry is not a commit. The user reviews the exact source-to-bottle
  // movement, may edit without losing values, then explicitly confirms once.
  await page.locator('#nx-nasal-record-save').click();
  assert.equal(await page.locator('#nx-nasal-record-review').isVisible(),true,
    'Actual nasal preparation must enter a separate review before confirmation');
  await captureVisual('nasal-review','.modal');
   const nasalReviewUX=await page.locator('#nx-nasal-record-review').evaluate(section=>({
    focused:document.activeElement===section,
    sheetScroll:section.closest('.modal')?.scrollTop ?? -1
  }));
  assert.equal(nasalReviewUX.focused,true,'Nasal review focus should move to its visible summary');
  assert.ok(nasalReviewUX.sheetScroll<=2,'Nasal review must reset the only sheet scroll owner to top');
  const nasalReview=await page.locator('#nx-nasal-record-review').textContent();
  assert.ok(nasalReview.includes('One confirmed transfer')&&
    nasalReview.includes('Source vial after transfer')&&
    nasalReview.includes('Prepared bottle after transfer')&&
    nasalReview.includes('2.00 mg / 5.00 mL'),
    'Structured Review must show exact source debit, destination credit and one confirmed transfer');
  assert.equal(await page.evaluate(()=>state.supplies.find(k=>k.id===990400).vials[0].remainingMg),5,
    'Review alone must not debit physical source');
  await page.locator('#nx-nasal-record-back').click();
  await captureVisual('nasal-back','.modal');
   assert.equal(await page.locator('#nx-nasal-source-mg').inputValue(),'2',
    'Back to edit must preserve source mass');
  await page.locator('#nx-nasal-record-save').click();
  await page.locator('#nx-nasal-record-confirm').check();
  await page.locator('#nx-nasal-record-save').click();
  const preparedFixture=await page.evaluate(()=>{
    const kit=state.supplies.find(k=>k.id===990400);
    const container=state.formulationStocks.find(s=>s.compound==='Fictional Prepared Spray Test');
    return {source:kit.vials[0].remainingMg,bottleMg:container?.remainingMg,
      bottleMl:container?.remainingMl,perSpray:container?.mgPerSpray,
      mlPerSpray:container?.mlPerSpray,sourceId:container?.sourceVialId};
  });
  assert.equal(preparedFixture.source,3,'Nasal preparation must debit exact physical vial once');
  assert.equal(preparedFixture.bottleMg,2,'Destination prepared bottle must credit same mg');
  assert.equal(preparedFixture.bottleMl,5,'Prepared volume must match actual recorded liquid');
  assert.equal(preparedFixture.perSpray,0.04,'Nominal mass per spray should be derived from recorded quantities');
  assert.equal(preparedFixture.mlPerSpray,0.1);
  assert.equal(preparedFixture.sourceId,'nasal-reserved-a','Preparation must retain exact vial link');
  await page.evaluate(()=>doseModal('Fictional Prepared Spray Test'));
  await page.locator('#nx-use-nasal').click();
  assert.equal(await page.locator('#nx-spray-count').count(),1,
    'Prepared nasal should log by whole sprays, not mass or injection route');
  assert.equal(await page.locator('.nx-method-grid').count(),0,
    'Nasal form-specific entry should not show injection route grid');
  await page.locator('#nx-spray-count').fill('2');
  await page.locator('#nx-spray-review').click();
  await page.locator('#nx-spray-save').click();
  const sprayed=await page.evaluate(()=>{
    const source=state.supplies.find(k=>k.id===990400).vials[0];
    const stock=state.formulationStocks.find(s=>s.compound==='Fictional Prepared Spray Test');
    const dose=state.customPeptides['Fictional Prepared Spray Test'].doses[0];
    return {vialMg:source.remainingMg,bottleMg:stock.remainingMg,bottleMl:stock.remainingMl,
      sprays:dose?.sprayCount,amount:dose?.amountMg,transaction:dose?.preparedTransactionId,
      doseId:dose?.id,sourceId:stock.id};
  });
  assert.equal(sprayed.vialMg,3,'Nasal spray dose must not debit the physical vial twice');
  assert.equal(sprayed.bottleMg,1.92,'Two nominal sprays debit the prepared bottle by 0.08 mg');
  assert.equal(sprayed.bottleMl,4.8,'Two sprays debit 0.2 mL from prepared bottle');
  assert.equal(sprayed.sprays,2);
  await page.evaluate(({transaction,doseId,sourceId})=>{
    const r=NexusPreparedDoseTransaction.reverseDose(state,{transactionId:transaction,
      reversalId:'fictional-nasal-undo',compound:'Fictional Prepared Spray Test',
      doseId,sourceId});
    state=r.next;
  },sprayed);
  assert.equal(await page.evaluate(()=>state.formulationStocks.find(s=>s.compound==='Fictional Prepared Spray Test').remainingMg),2,
    'Nasal dose reversal must restore only the prepared bottle');
  assert.equal(await page.evaluate(()=>state.customPeptides['Fictional Prepared Spray Test'].doses.length),0,
    'Nasal dose reversal must remove the matching dose');

  // Form-first NASAL selection goes directly to one conditional actual-prep
  // editor. Opening the sealed source and transferring into a linked bottle
  // must be a SINGLE fictional confirmed state swap with no pre-review debit.
  await page.evaluate(()=>{
    state.supplies.push({id:990405,name:'Fictional One-Step Nasal',vialMg:5,
      totalVials:1,openedVials:0,emptyVials:0,activeKit:false,
      preparationMethod:null,vials:[{id:'one-step-sealed',sequenceNumber:1,status:'sealed',vialMg:5,expectedMg:5,remainingMg:5}]});
    openNewVialModal(990405);
  });
  await captureVisual('open-vial-form-choice','.modal.nx-open-vial-choice-sheet');
  assert.equal(await page.locator('.nx-open-vial-form-options button').count(),2,
    'Open New Vial first step must have only Injectable and Nasal');
  assert.equal(await page.locator('#rv-bacml').count(),0,
    'No reconstitution fields before physical form choice');
  await page.locator('#nx-open-nasal').click();
  assert.equal(await page.locator('#nx-nasal-source-mg').count(),1,
    'Nasal choice must go directly to actual source-to-bottle preparation editor');
  assert.equal(await page.locator('#rv-bacml').count(),0,
    'Nasal editor should not repeat the injectable vial editor');
  for(const [id,value] of [['nx-nasal-source-mg','2'],['nx-nasal-bac','1'],
    ['nx-nasal-saline','4'],['nx-nasal-pump','0.1']])
    await page.locator('#'+id).fill(value);
  await page.locator('#nx-nasal-record-save').click();
  await captureVisual('nasal-sealed-review','.modal');
   const beforeOneStep=await page.evaluate(()=>{
    const k=state.supplies.find(x=>x.id===990405);
    return {status:k.vials[0].status,mg:k.vials[0].remainingMg,
      linked:(state.formulationStocks||[]).filter(b=>String(b.sourceKitId)==='990405').length};
  });
  assert.deepEqual(beforeOneStep,{status:'sealed',mg:5,linked:0},
    'Nasal Review must not open source or transfer inventory early');
  await page.locator('#nx-nasal-record-confirm').check();
  await page.locator('#nx-nasal-record-save').click();
  const afterOneStep=await page.evaluate(()=>{
    const k=state.supplies.find(x=>x.id===990405);
    const b=state.formulationStocks.find(x=>String(x.sourceKitId)==='990405');
    return {sourceId:k.vials[0].id,status:k.vials[0].status,mg:k.vials[0].remainingMg,
      opened:k.openedVials,transfers:k.preparationTransfers?.length||0,
      bottleId:b?.id,bottleSource:b?.sourceVialId,preparedMg:b?.remainingMg,preparedMl:b?.remainingMl,
      events:b?.transactions?.length||0};
  });
  assert.equal(afterOneStep.sourceId,'one-step-sealed','Original sealed vial identity changed');
  assert.equal(afterOneStep.status,'open','Confirmed preparation must open exact sealed source');
  assert.equal(afterOneStep.mg,3,'Confirmed preparation must debit only 2mg exact source');
  assert.equal(afterOneStep.opened,1,'Exactly one new vial opening');
  assert.equal(afterOneStep.transfers,1,'Exactly one source transfer event');
  assert.equal(afterOneStep.bottleSource,'one-step-sealed','Prepared bottle lost source link');
  assert.equal(afterOneStep.preparedMg,2,'Destination bottle mass credit mismatch');
  assert.equal(afterOneStep.preparedMl,5,'Destination bottle volume mismatch');
  assert.equal(afterOneStep.events,1,'Prepared bottle must have one linked transfer event');
  await page.evaluate(()=>openNewVialModal(990405));
  await page.locator('#nx-open-nasal').click();
  assert.equal(await page.locator('#nx-nasal-source-mg').count(),1,
    'Returning to Nasal should reuse the one eligible original open source');
  assert.equal(await page.evaluate(()=>state.supplies.find(k=>k.id===990405).vials[0].remainingMg),3,
    'Opening a second nasal preparation draft must not debit the source');
  await page.evaluate(()=>closeModal());

  // Exact physical-device Oxytocin repro: create a REAL kit via the Add Kit
  // wizard, open a sealed vial as Nasal, confirm one source-to-bottle transfer,
  // inspect Stash identity, and open Log Dose without any SubQ fallback.
  const oxytocinOldIds=await page.evaluate(()=>state.supplies.filter(k=>k.name==='Oxytocin').map(k=>String(k.id)));
  await page.evaluate(()=>supplyModal(null,null));
  await page.locator('[data-kit-form="vial"]').click();
  await page.locator('#nx-kit-combobox-input').fill('Oxytocin');
  await page.locator('#nx-kit-combobox-list [role="option"]').filter({hasText:'Oxytocin'}).first().click();
  await page.locator('#stv').fill('10');
  await page.locator('#svmg').fill('10');
  await page.locator('#nx-kit-next').click();
  await page.locator('#nx-kit-next').click();
  await page.locator('#ssave').click();
  await page.waitForFunction(oldIds=>
    state.supplies.some(k=>k.name==='Oxytocin'&&!oldIds.includes(String(k.id))),oxytocinOldIds);
  const oxyKit=await page.evaluate(oldIds=>{
    const k=state.supplies.find(k=>k.name==='Oxytocin'&&!oldIds.includes(String(k.id)));
    return {kitId:k.id,vialCount:k.vials.length,
      firstVialId:String(k.vials.find(v=>v.status==='sealed').id),
      firstMg:k.vials.find(v=>v.status==='sealed').remainingMg,
      existingBottleCount:(state.formulationStocks||[]).filter(b=>String(b.sourceKitId)===String(k.id)).length};
  },oxytocinOldIds);
  assert.equal(oxyKit.vialCount,10,'Oxytocin Add Kit must create exactly ten vials');
  assert.equal(oxyKit.existingBottleCount,0,'Fresh kit must not pre-create a nasal preparation');
  await page.evaluate(id=>openNewVialModal(id),oxyKit.kitId);
  assert.equal(await page.locator('#nx-open-injectable').count(),1,'Form-first Injectable missing');
  assert.equal(await page.locator('#nx-open-nasal').count(),1,'Form-first Nasal missing');
  await page.locator('#nx-open-nasal').click();
  assert.equal(await page.locator('#nx-nasal-source-mg').count(),1,'Nasal must open its preparation form');
  for(const [id,val] of [['nx-nasal-source-mg','10'],['nx-nasal-bac','1'],
    ['nx-nasal-saline','9'],['nx-nasal-pump','0.1']])
    await page.locator('#'+id).fill(val);
  await page.locator('#nx-nasal-record-save').click();
  assert.equal(await page.locator('#nx-nasal-record-review').isVisible(),true);
  const oxyBefore=await page.evaluate(id=>{
    const k=state.supplies.find(k=>String(k.id)===String(id));
    const v=k.vials.find(v=>v.status==='sealed');
    return {sealed:k.vials.filter(v=>v.status==='sealed').length,
      open:k.vials.filter(v=>v.status==='open'||v.status==='active').length,
      firstId:String(v.id),firstMg:v.remainingMg,
      linked:(state.formulationStocks||[]).filter(b=>String(b.sourceKitId)===String(id)).length};
  },oxyKit.kitId);
  assert.deepEqual(oxyBefore,{sealed:10,open:0,firstId:oxyKit.firstVialId,firstMg:10,linked:0},
    'Review must never create an opened Oxytocin vial or prepared bottle');
  await page.locator('#nx-nasal-record-confirm').check();
  await page.locator('#nx-nasal-record-save').click();
  await page.waitForFunction(id=>(state.formulationStocks||[]).some(b=>String(b.sourceKitId)===String(id)),oxyKit.kitId);
  const oxyAfter=await page.evaluate(id=>{
    const k=state.supplies.find(k=>String(k.id)===String(id));
    const vial=k.vials.find(v=>v.status==='open'||v.status==='active');
    const bottles=(state.formulationStocks||[]).filter(b=>String(b.sourceKitId)===String(id));
    const bottle=bottles[0];
    return {open:k.vials.filter(v=>['open','active'].includes(v.status)).length,
      sealed:k.vials.filter(v=>v.status==='sealed').length,
      vialId:String(vial?.id),vialMg:vial?.remainingMg,form:vial?.intendedUse,
      bottleCount:bottles.length,bottleId:String(bottle?.id),
      sourceVialId:String(bottle?.sourceVialId),bottleMg:bottle?.remainingMg,
      bottleMl:bottle?.remainingMl,mgPerSpray:bottle?.mgPerSpray,
      sourceEvents:k.preparationTransfers?.length||0,
      destinationEvents:bottle?.transactions?.length||0,
      transferId:k.preparationTransfers?.[0]?.id,
      mirroredTransferId:bottle?.transactions?.[0]?.id};
  },oxyKit.kitId);
  assert.equal(oxyAfter.open,1,'Exactly one Oxytocin physical source must be opened');
  assert.equal(oxyAfter.sealed,9,'Nine sealed Oxytocin vials must remain');
  assert.equal(oxyAfter.vialId,oxyKit.firstVialId,'Original physical vial ID must not change');
  assert.equal(oxyAfter.vialMg,0,'10mg source must transfer only once');
  assert.equal(oxyAfter.form,'nasal-source','Original source must remain nasal-labelled');
  assert.equal(oxyAfter.bottleCount,1,'One and only one prepared bottle must be created');
  assert.equal(oxyAfter.sourceVialId,oxyKit.firstVialId,'Prepared bottle must reference exact vial');
  assert.equal(oxyAfter.bottleMg,10,'Full 10mg must be credited to destination');
  assert.equal(oxyAfter.bottleMl,10,'Prepared bottle should contain 10mL');
  assert.equal(oxyAfter.mgPerSpray,0.1,'Recorded 0.1mL pump nominal mass must be 0.1mg');
  assert.equal(oxyAfter.sourceEvents,1,'One source transfer event');
  assert.equal(oxyAfter.destinationEvents,1,'One destination transfer event');
  assert.equal(oxyAfter.transferId,oxyAfter.mirroredTransferId,'Ledger event IDs must match');
  await page.evaluate(()=>{tab='stash';render();});
  // Earlier test explicitly switched Stash to Other Forms. Return to Kits
  // before inspecting the actual newly created Oxytocin physical kit.
  await page.locator('.stash-sub-btn[data-sub="kits"]').click();
  assert.ok((await page.locator('.nx-kit-card').filter({hasText:'Oxytocin'}).allTextContents())
    .some(text=>text.includes('Prepared bottle')&&text.includes('10.00 mg')),
    'Stash must make source-linked prepared Oxytocin mass visible');
  
  const preparedCard=await page.locator('.nx-kit-card').filter({hasText:'Oxytocin'}).first().evaluate(card=>({
    label:card.querySelector('.nx-kit-overview-label')?.textContent?.trim(),
    value:card.querySelector('.nx-kit-primary-value')?.textContent?.trim(),
    badge:card.querySelector('.nx-card-status')?.textContent?.trim(),
    detail:card.textContent
  }));
  assert.equal(preparedCard.label,'PREPARED NASAL BOTTLE',
    'Full nasal transfer should show available prepared bottle in primary card');
  assert.ok(preparedCard.value.includes('10 mg')&&
    preparedCard.value.includes('remaining in prepared bottle')&&
    !/Empty/i.test(preparedCard.badge||'')&&
    preparedCard.detail.includes('Transferred to prepared nasal bottle'),
    'Transferred stock incorrectly represented as empty or consumed: '+JSON.stringify(preparedCard));
  await page.evaluate(()=>doseModal('Oxytocin'));
  const nasalPicker=await page.locator('#nx-use-nasal').count();
  if(nasalPicker)await page.locator('#nx-use-nasal').click();
  assert.equal(await page.locator('#nx-spray-count').count(),1,
    'Oxytocin Log Dose must select prepared nasal spray instead of SubQ');
  assert.equal(await page.locator('.nx-method-grid').count(),0,
    'Prepared nasal source must not expose the injection method grid');
  const selectedOxytocinBottle=await page.locator('#nx-spray-source').inputValue();
  if(selectedOxytocinBottle==='')await page.locator('#nx-spray-source').selectOption(oxyAfter.bottleId);
  assert.equal(await page.locator('#nx-spray-source').inputValue(),oxyAfter.bottleId,
    'Oxytocin prepared Log Dose must use the linked exact bottle');
  await page.locator('#nx-spray-count').fill('2');
  await page.locator('#nx-spray-review').click();
  await page.locator('#nx-spray-save').click();
  const oxyLogged=await page.evaluate(({kitId,bottleId})=>{
    const k=state.supplies.find(k=>String(k.id)===String(kitId));
    const b=state.formulationStocks.find(b=>String(b.id)===String(bottleId));
    const dose=[...(state.peptides.Oxytocin?.doses||[]),...(state.customPeptides.Oxytocin?.doses||[])]
      .find(d=>String(d.sourceContainerId)===String(bottleId));
    return {sourceMg:k.vials.find(v=>['open','active'].includes(v.status)).remainingMg,
      bottleMg:b.remainingMg,bottleMl:b.remainingMl,
      doseMethod:dose?.method,doseBottle:String(dose?.sourceContainerId),sprayCount:dose?.sprayCount};
  },{kitId:oxyKit.kitId,bottleId:oxyAfter.bottleId});
  assert.equal(oxyLogged.sourceMg,0,'Logging nasal sprays must not double-debit source vial');
  assert.equal(oxyLogged.bottleMg,9.8,'Two sprays debit 0.2mg from prepared bottle');
  assert.equal(oxyLogged.bottleMl,9.8,'Two sprays debit 0.2mL from prepared bottle');
  assert.equal(oxyLogged.doseMethod,'Nasal','Oxytocin history must say Nasal');
  assert.equal(oxyLogged.doseBottle,oxyAfter.bottleId,'Dose must link to prepared bottle ID');
  assert.equal(oxyLogged.sprayCount,2,'Dose history must record exactly two sprays');
  results.push({test:'Add Kit Oxytocin → Open New Vial Nasal → one transfer → Stash → prepared Log Dose',result:'PASS'});

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
    const chooser=document.querySelector('.nx-open-vial-choice-sheet');
    if(!chooser || chooser.querySelectorAll('.nx-open-vial-form-options button').length!==2 ||
       chooser.querySelector('#rv-totalvials')) throw Error('Open Vial must ask Injectable/Nasal BEFORE vial details');
    const assertSheetHeader=(sheet,label)=>{
      const head=sheet?.querySelector('.nx-dose-head');
      const close=head?.querySelector('#x');
      const h=head?.getBoundingClientRect(),c=close?.getBoundingClientRect();
      const t=head?.querySelector('.nx-dose-title')?.getBoundingClientRect();
      const width=document.documentElement.clientWidth;
      const modalBounds=sheet?.getBoundingClientRect();
      const kicker=head?.querySelector('.nx-dose-kicker')?.getBoundingClientRect();
      const badShell=label==='Form-first Open Vial'&&sheet.classList.contains('nx2-dose-modal');
      if(!h||!c||!t||!modalBounds||!kicker||badShell||
        kicker.left<modalBounds.left+12||kicker.top<modalBounds.top+10||
        t.left<modalBounds.left+12||c.right>modalBounds.right-8||
        t.top<0||t.right>width+2||
        c.top<h.top-2||c.bottom>h.bottom+2||
        c.width<44||c.height<44||c.left<-2||c.right>width+2||
        document.documentElement.scrollWidth>width+2)
        throw Error(label+' header or close clipped: '+JSON.stringify({top:t?.top,closeTop:c?.top,closeBottom:c?.bottom,headerTop:h?.top,headerBottom:h?.bottom,width}));
    };
    assertSheetHeader(chooser,'Form-first Open Vial');
    chooser.querySelector('#nx-open-injectable').click();
    assertSheetHeader(document.querySelector('.nx-open-vial-editor'),'Injectable Open Vial');
    if(document.querySelector('#rv-purpose')?.value!=='Injectable') throw Error('Injectable choice not preserved into vial editor');
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
  assert.deepEqual(oralEligible.named,['oral-source'],
    'Oral route must resolve only its independently labelled physical vial');
  assert.equal(await page.locator('#kit-picker').isHidden(),true,
    'One eligible oral vial should not visibly ask for another source choice');
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

  // P-14 actual buttons: cancel, bulk pause, bulk resume and data integrity.
  const bulkBefore=await page.evaluate(()=>{
    closeModal();
    state.protocols=[
      {id:'bulk-running',name:'Fictional running',status:'in_progress',startDate:'2026-01-01',compounds:[]},
      {id:'bulk-ready',name:'Fictional ready',status:'active',startDate:'2026-02-01',compounds:[]},
      {id:'bulk-manual',name:'Fictional already paused',status:'paused',pausedAt:'2026-10-20T10:00',compounds:[]},
      {id:'bulk-planned',name:'Fictional future',status:'planned',compounds:[]},
      {id:'bulk-complete',name:'Fictional complete',status:'completed',compounds:[]}
    ];
    const frozen=JSON.stringify({supplies:state.supplies,peptides:state.peptides,custom:state.customPeptides});
    tab='protocols';render();
    return frozen;
  });
  assert.equal(await page.locator('#nx-pause-all-protocols').count(),1,'Pause All missing in Protocols');
  await page.locator('#nx-pause-all-protocols').click();
  assert.equal(await page.locator('#ca-cancel').count(),1,'Pause All must require confirmation');
  await page.locator('#ca-cancel').click();
  assert.equal(await page.evaluate(()=>state.protocols.filter(p=>p.status==='paused').length),1,
    'Cancel must not modify any protocol');
  await page.locator('#nx-pause-all-protocols').click();
  await page.locator('#ca-ok').click();
  await page.waitForFunction(()=>state.protocols.filter(p=>p.nexusBulkPausedFrom).length===2);
  const paused=await page.evaluate(()=>state.protocols.map(p=>({
    status:p.status,from:p.nexusBulkPausedFrom||null,pausedAt:p.pausedAt
  })));
  assert.deepEqual(paused.map(p=>p.status),['paused','paused','paused','planned','completed']);
  assert.deepEqual(paused.slice(0,2).map(p=>p.from),['in_progress','active'],
    'Global pause must preserve each running protocol prior state');
  assert.equal(paused[2].pausedAt,'2026-10-20T10:00','Existing individual pause changed');
  assert.equal(await page.locator('#nx-resume-all-protocols').count(),1,'Resume All missing');
  await page.locator('#nx-resume-all-protocols').click();
  await page.locator('#ca-ok').click();
  await page.waitForFunction(()=>state.protocols.filter(p=>p.nexusBulkPausedFrom).length===0);
  const resumed=await page.evaluate(()=>({
    protocols:state.protocols.map(p=>({status:p.status,history:(p.pauseHistory||[]).length})),
    untouched:JSON.stringify({supplies:state.supplies,peptides:state.peptides,custom:state.customPeptides})
  }));
  assert.deepEqual(resumed.protocols.map(p=>p.status),
    ['in_progress','active','paused','planned','completed'],
    'Resume All must preserve individually paused protocols');
  assert.deepEqual(resumed.protocols.slice(0,2).map(p=>p.history),[1,1],
    'Global pause intervals not preserved historically');
  assert.equal(resumed.untouched,bulkBefore,'Pause/Resume changed inventory or dose history');
  fs.writeFileSync('dist/Nexus_'+version+'_VISUAL_'+engine.name()+'_'+kind+'_'+theme+'_'+width+'.json',
     JSON.stringify({sha:process.env.GITHUB_SHA||'local',engine:engine.name(),kind,theme,width,visualEvidence},null,2));
   results.push({width,theme,kind,result:'PASS'});
  await ctx.close();
 }

 // True Chromium browser-tab concurrency against the production storage key,
 // using an isolated browser context and entirely fictional records.
 // This verifies the exclusive coordinator, not yet the legacy saveState callers.
 if(engine===chromium){
  const context=await browser.newContext();
  const a=await context.newPage(),b=await context.newPage();
  await Promise.all([a.goto('http://127.0.0.1:8777/'),b.goto('http://127.0.0.1:8777/')]);
  const key='peptide-tracker-html-v1';
  const fixture={settings:{theme:'dark'},supplementLogs:[{id:'H1',date:'2026-11-01',taken:['Fictional C']}],
   macroLogs:[],weightLogs:[],measurementLogs:[],activityLogs:[],
   supplies:[{id:'K1',vials:[{id:'V1',remainingMg:10}]}],peptides:{Fictional:{doses:[]}}};
  await a.evaluate(({key,fixture})=>localStorage.setItem(key,JSON.stringify(fixture)),{key,fixture});
  const init=()=>{const raw=localStorage.getItem('peptide-tracker-html-v1');
   globalThis.__raceWriter=NexusWriteCoordinator.create({
    read:()=>localStorage.getItem('peptide-tracker-html-v1'),
    write:value=>localStorage.setItem('peptide-tracker-html-v1',value),
    lock:(name,fn)=>navigator.locks.request(name,{mode:'exclusive'},fn),
    lockName:'peptide-tracker-html-v1:inventory-transfer',initialSnapshot:raw});
   globalThis.__raceSnapshot=JSON.parse(raw);
  };
  await a.evaluate(init);await b.evaluate(init);
  const held=a.evaluate(async()=>{let entered;const started=new Promise(resolve=>entered=resolve);
   globalThis.__raceHeld=true;
   const pending=__raceWriter.transaction(__raceSnapshot,async next=>{
    entered();await new Promise(resolve=>globalThis.__raceRelease=resolve);
    next.supplies[0].vials[0].remainingMg=8;
    next.peptides.Fictional.doses.push({id:'D1',dose:2});
    return {next};
   });
   await started;
   return pending.then(()=>({success:true}),e=>({success:false,error:String(e)}));
  });
  await a.waitForFunction(()=>typeof globalThis.__raceRelease==='function');
  const competing=b.evaluate(async()=>__raceWriter.transaction(__raceSnapshot,next=>{
   next.settings.theme='light';return {next};
  }).then(()=>({success:true}),e=>({success:false,error:String(e)})));
  await b.waitForTimeout(100);
  const blocked=await b.evaluate(async()=>{const result=await navigator.locks.query();
   return result.pending.some(item=>item.name==='peptide-tracker-html-v1:inventory-transfer');});
  assert.equal(blocked,true,'Settings tab did not wait for exclusive inventory lock');
  await a.evaluate(()=>globalThis.__raceRelease());
  const [inventory,settings]=await Promise.all([held,competing]);
  assert.equal(inventory.success,true,'Inventory transaction must commit');
  assert.equal(settings.success,false,'Stale settings tab must reject rather than overwrite inventory');
  let actual=await a.evaluate(()=>JSON.parse(localStorage.getItem('peptide-tracker-html-v1')));
  assert.equal(actual.supplies[0].vials[0].remainingMg,8);
  assert.equal(actual.peptides.Fictional.doses.length,1);
  assert.equal(actual.settings.theme,'dark');
  assert.equal(actual.supplementLogs.length,1);
  // Refresh expected snapshot, then prove a successful settings commit.
  await b.evaluate(init);
  const settingsSaved=await b.evaluate(async()=>__raceWriter.transaction(__raceSnapshot,next=>{
   next.settings.theme='light';return {next};
  }).then(()=>true,()=>false));
  assert.equal(settingsSaved,true);
  // A stale history editor must fail, leaving both stock and settings intact.
  const staleHistory=await a.evaluate(async()=>__raceWriter.transaction(__raceSnapshot,next=>{
   next.supplementLogs=[];return {next};
  }).then(()=>true,()=>false));
  assert.equal(staleHistory,false);
  await a.evaluate(init);
  const historySaved=await a.evaluate(async()=>__raceWriter.transaction(__raceSnapshot,next=>{
   next.supplementLogs=[];return {next};
  }).then(()=>true,()=>false));
  assert.equal(historySaved,true);
  actual=await b.evaluate(()=>JSON.parse(localStorage.getItem('peptide-tracker-html-v1')));
  assert.equal(actual.supplies[0].vials[0].remainingMg,8);
  assert.equal(actual.settings.theme,'light');
  assert.equal(actual.supplementLogs.length,0);
  // A quota/write failure must reject without falsely acknowledging success.
  const failed=await b.evaluate(async()=>{
   const raw=localStorage.getItem('peptide-tracker-html-v1');
   const writer=NexusWriteCoordinator.create({read:()=>localStorage.getItem('peptide-tracker-html-v1'),
    write:()=>{throw Error('simulated quota failure')},
    lock:(name,fn)=>navigator.locks.request(name,{mode:'exclusive'},fn),
    lockName:'peptide-tracker-html-v1:inventory-transfer',initialSnapshot:raw});
   return writer.transaction(JSON.parse(raw),next=>{next.settings.theme='invalid';return {next};})
    .then(()=>({success:true}),e=>({success:false,error:String(e)}));
  });
  assert.equal(failed.success,false);
  assert.match(failed.error,/simulated quota failure/);
  actual=await a.evaluate(()=>JSON.parse(localStorage.getItem('peptide-tracker-html-v1')));
  assert.equal(actual.settings.theme,'light');
  assert.equal(actual.supplies[0].vials[0].remainingMg,8);
  assert.equal(actual.supplementLogs.length,0);
  // Exercise the actual app scoped settings/history handlers, not just the
  // coordinator adapter. Both tabs start with the same persisted snapshot.
  const resetAppTab=()=>{const raw=localStorage.getItem('peptide-tracker-html-v1');
   state=JSON.parse(raw);_demoActive=false;
   _nexusLastSavedSnapshot=raw;_nexusSharedWriter=null;
  };
  await a.evaluate(resetAppTab);await b.evaluate(resetAppTab);
  const appSettings=await a.evaluate(()=>nexusCommitScopedStateChange({
   kind:'setting',key:'phaseRemindersEnabled',value:true}));
  assert.equal(appSettings,true,'Actual settings handler must acknowledge durable save');
  const appHistoryStale=await b.evaluate(()=>nexusCommitScopedStateChange({
   kind:'supplement-log-upsert',date:'2026-11-02',taken:['Fictional C'],id:'H2',expectedId:null}));
  assert.equal(appHistoryStale,false,'Actual stale history handler must not claim success');
  await b.evaluate(resetAppTab);
  const appHistoryFresh=await b.evaluate(()=>nexusCommitScopedStateChange({
   kind:'supplement-log-upsert',date:'2026-11-02',taken:['Fictional C'],id:'H2',expectedId:null}));
  assert.equal(appHistoryFresh,true,'Actual fresh history handler must commit');
  // App-level dated health history commits, with the same inventory
  // and dose-history snapshot preserved throughout.
  for(const [field,id,extra] of [
   ['macroLogs','M1',{calories:'2000'}],
   ['weightLogs','W1',{weight:'180.5'}],
   ['measurementLogs','Z1',{waist:'30'}]
  ]){
   const persisted=await b.evaluate(({field,id,extra})=>
    nexusCommitScopedStateChange({kind:'dated-log-upsert',field,
      record:{id,date:'2026-11-02',...extra}}),{field,id,extra});
   assert.equal(persisted,true,'Actual dated health history save failed for '+field);
  }
  const appSaved=await a.evaluate(()=>JSON.parse(localStorage.getItem('peptide-tracker-html-v1')));
  assert.equal(appSaved.settings.phaseRemindersEnabled,true);
  assert.equal(appSaved.supplementLogs.length,1);
  assert.equal(appSaved.supplementLogs[0].id,'H2');
  for(const field of ['macroLogs','weightLogs','measurementLogs'])assert.equal(appSaved[field].length,1);
  assert.equal(appSaved.supplies[0].vials[0].remainingMg,8);
  assert.equal(appSaved.settings.theme,'light');
  const bulkSaved=await b.evaluate(()=>nexusCommitScopedStateChange({kind:'bulk-delete',target:'del-health-all'}));
  assert.equal(bulkSaved,true,'App bulk health removal must be an acknowledged exclusive transaction');
  const afterBulk=await a.evaluate(()=>JSON.parse(localStorage.getItem('peptide-tracker-html-v1')));
  for(const field of ['macroLogs','weightLogs','measurementLogs','activityLogs'])assert.equal(afterBulk[field].length,0);
  assert.equal(afterBulk.supplies[0].vials[0].remainingMg,8);
  assert.equal(afterBulk.peptides.Fictional.doses.length,1);
  assert.equal(afterBulk.supplementLogs[0].id,'H2');
  // Destructive operation must reject the stale tab and preserve all data.
  const staleErase=await a.evaluate(()=>nexusEraseSavedState());
  assert.equal(staleErase,false,'Stale actual-app Erase Everything must not acknowledge deletion');
  let afterStaleErase=await b.evaluate(()=>JSON.parse(localStorage.getItem('peptide-tracker-html-v1')));
  assert.equal(afterStaleErase.supplies[0].vials[0].remainingMg,8);
  assert.equal(afterStaleErase.supplementLogs[0].id,'H2');
  assert.equal(afterStaleErase.settings.phaseRemindersEnabled,true);
  // The current tab must be able to erase the same isolated fixture.
  const erased=await b.evaluate(()=>nexusEraseSavedState());
  assert.equal(erased,true,'Exclusive erase must acknowledge verified removal');
  assert.equal(await a.evaluate(()=>localStorage.getItem('peptide-tracker-html-v1')),null);
  results.push({test:'real Chromium two-tab stale destructive erase and fresh erase readback',result:'PASS'});
  results.push({test:'real Chromium two-tab application scoped settings/history handlers',result:'PASS'});
  results.push({test:'real Chromium two-tab exclusive coordinator races',result:'PASS'});
  await context.close();
 }
} finally {await browser.close();}
console.log('PASS: '+engine.name()+' unified Add Kit chooser, capsule/nasal kit cards and untouched vial stock in '+results.length+' fictional LIVE/DEMO sessions');
