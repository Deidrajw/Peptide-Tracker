import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version,demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
if(!fs.existsSync(demo))throw Error('Missing full app DEMO');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const ensure=(ok,message)=>{if(!ok)throw Error(message)};
const results=[];
try{
  for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
    const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
    await page.evaluate(t=>{
      state=buildDemoState('weight_loss');state.profile.onboardingDone=true;
      document.documentElement.dataset.theme=t;
      state._stashFilter='all';state._stashGroup='none';
      state.supplies=[
        {id:99001,name:'Selank',totalVials:2,vialMg:5,bacMl:1,activeKit:false,reconDate:null,
          vials:[{id:90011,status:'sealed',vialMg:5,remainingMg:5},{id:90012,status:'sealed',vialMg:5,remainingMg:5}],wasteLog:[],doseLog:[]},
        {id:99002,name:'GHK-Cu',totalVials:2,vialMg:50,bacMl:2,activeKit:true,reconDate:'2026-10-22T09:00:00',
          vials:[{id:90021,status:'open',vialMg:50,remainingMg:30,reconDate:'2026-10-22T09:00:00'},{id:90022,status:'sealed',vialMg:50,remainingMg:50}],wasteLog:[],doseLog:[]},
        {id:99003,name:'Fictional Duo Blend',isBlend:true,composition:[{compound:'BPC-157',mg:10},{compound:'TB-500',mg:10}],
          totalVials:1,vialMg:20,bacMl:2,activeKit:false,reconDate:null,
          vials:[{id:90031,status:'sealed',vialMg:20,remainingMg:20}],doseLog:[],wasteLog:[]}
      ];
      tab='stash';render();
    },theme);
    // Supplies first-run UI uses one accessible action; established inventory keeps it.
    await page.evaluate(()=>{state._stashSub='equipment';state.equipmentItems=[];render();});
    ensure(await page.locator('.nx-supplies-empty').count()===1,'Supplies empty state missing');
    ensure(await page.locator('#add-equipment').count()===1,'Supplies has duplicate add actions');
    ensure(await page.locator('.nx-supplies-empty h2').innerText()==='Keep your supplies in one place','Supplies onboarding title incorrect');
    const addMetrics=await page.locator('#add-equipment').evaluate(el=>{
      const b=el.getBoundingClientRect(),root=el.closest('.nx-supplies-empty').getBoundingClientRect();
      return {height:b.height,width:b.width,left:b.left,right:b.right,containerLeft:root.left,containerRight:root.right};
    });
    ensure(addMetrics.height>=44&&addMetrics.width>=170&&addMetrics.left>=addMetrics.containerLeft+12&&addMetrics.right<=addMetrics.containerRight-12,
      'Supplies CTA is clipped or below minimum touch target');
    await page.evaluate(()=>document.querySelectorAll('.modal-bg').forEach(el=>el.remove()));
    await page.screenshot({animations:'disabled',path:'dist/stash-supplies-empty-'+kind+'-'+theme+'-'+width+'.png'});
    await page.locator('#add-equipment').click();
    ensure(await page.locator('#eq-type').count()===1,'Supplies Add action did not open original form');
    ensure(await page.locator('.nx-equipment-form-heading').innerText()==='Add supply','Supply editor heading missing');
    ensure(await page.locator('#eq-save').innerText()==='Add to Supplies','Supply create CTA inconsistent');
    ensure(await page.locator('#eq-save').evaluate(el=>el.getBoundingClientRect().height>=44),'Supply save target too small');
    const statusesFit=await page.locator('.modal:has(#eq-save) .eq-status-toggle').evaluateAll(buttons=>{
      if(buttons.length!==2)return false;
      return buttons.every(b=>{const r=b.getBoundingClientRect(),p=b.parentElement.getBoundingClientRect();return r.width>=90&&r.height>=44&&r.left>=p.left-1&&r.right<=p.right+1;});
    });
    ensure(statusesFit,'Supply initial status buttons are clipped at narrow iPhone width');
    await page.screenshot({animations:'disabled',path:'dist/stash-supply-form-'+kind+'-'+theme+'-'+width+'.png'});
    await page.evaluate(()=>{
      closeModal();
      state.equipmentItems=[{id:88992,type:'BAC Water',brand:'Fictional',unitLabel:'bottle',unitSize:30,unitOfMeasure:'mL',
        storageLocation:'fridge',units:[{id:88993,status:'sealed',consumed:0}],usageLog:[],notes:''}];
      render();
    });
    ensure(await page.locator('#add-equipment').count()===1,'Add supply absent with inventory');
    ensure(await page.locator('.nx-supply-kit-card').count()===1,'Populated supply card missing');
    ensure(await page.locator('.nx-supply-actions>button').count()===2,'Supply card actions missing');
    ensure(await page.locator('.nx-supply-actions>button').first().evaluate(el=>el.getBoundingClientRect().height>=44),'Supply action too small');
    await page.screenshot({animations:'disabled',path:'dist/stash-supplies-filled-'+kind+'-'+theme+'-'+width+'.png'});
    await page.evaluate(()=>{state.equipmentItems=[];state._stashSub='kits';render();});


    const card=id=>page.locator('.nx-kit-card[data-kit-id="'+id+'"]');
    ensure(await card(99001).count()===1,'Sealed standard kit missing');
    ensure(await card(99002).count()===1,'Open standard kit missing');
    ensure(await card(99003).count()===1,'Sealed blend kit missing');
    ensure(await card(99001).locator('.nx-kit-compact-context').innerText().then(x=>x.includes('0 open')),'Sealed kit must identify zero open vials');
    ensure(await card(99001).locator('.nx-hybrid-two-actions>button').count()===2,'Sealed standard kit should show primary action and Kit details');
    ensure(await card(99003).locator('.nx-hybrid-two-actions>button').count()===2,'Sealed blend kit should show primary action and Kit details');
    ensure(await card(99002).locator('.nx-hybrid-two-actions>button').count()===2,'Open vial should show contextual action and details');
    ensure(await card(99001).locator('.nx-kit-primary-value').innerText().then(x=>x.includes('mg')),'Sealed kit must show available mg');
    ensure(await card(99001).locator('.nx-kit-primary-vial [role="progressbar"]').count()===0,'Sealed kit shows misleading progress');
    ensure(await card(99001).locator('.nx-kit-primary-vial .nx-kit-overview-label').innerText().then(x=>x.includes('AVAILABLE STOCK')),'Sealed kit must distinguish stored stock from an open vial');
    // Actual compact structure, not a typography-only reduction. Assertions run at 320/390,
    // both themes, LIVE and isolated DEMO fixtures.
    const compact=await card(99002).evaluate(el=>{
      const r=el.getBoundingClientRect();
      const actions=[...el.querySelectorAll('.nx-kit-actions-three>button')];
      return {height:r.height,width:r.width,viewport:document.documentElement.clientWidth,
        actionHeights:actions.map(x=>x.getBoundingClientRect().height),
        titleSize:parseFloat(getComputedStyle(el.querySelector('.nx-kit-card-title')).fontSize),
        nestedVisible:!!el.querySelector('.nx-kit-primary-vial .nx-kit-overview-track'),
        setupInDetails:!!el.querySelector('.nx-kit-detail-panel .nx-stash-use-setup')};
    });
    ensure(compact.width<=compact.viewport+2,'Compact card overflows iPhone: '+JSON.stringify(compact));
    ensure(compact.height<255,'Collapsed card remains excessively tall: '+JSON.stringify(compact));
    ensure(compact.actionHeights.length===2&&compact.actionHeights.every(h=>h>=44),'Compact actions must have 44px touch targets: '+JSON.stringify(compact));
    ensure(compact.titleSize>=15,'Compact typography must remain readable: '+JSON.stringify(compact));
    ensure(compact.setupInDetails,'Use setup must remain accessible in expanded details');
    const actionVisual=await card(99002).evaluate(el=>{
      const p=el.querySelector('.nx-kit-next-action'),d=el.querySelector('.nx-kit-detail-button');
      const a=getComputedStyle(p),b=getComputedStyle(d);
      const rgb=str=>{const v=(str.match(/[0-9.]+/g)||[]).slice(0,3).map(Number);return v};
      const lum=v=>{let c=v.map(x=>{const y=x/255;return y<=.04045?y/12.92:Math.pow((y+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
      const ratio=(x,y)=>{const a=lum(rgb(x)),b=lum(rgb(y));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
      return {primaryBg:a.backgroundColor,secondaryBg:b.backgroundColor,
        primaryContrast:ratio(a.color,a.backgroundColor),secondaryContrast:ratio(b.color,b.backgroundColor),
        radiusP:parseFloat(a.borderTopLeftRadius),radiusD:parseFloat(b.borderTopLeftRadius),
        primaryHeight:p.getBoundingClientRect().height,secondaryHeight:d.getBoundingClientRect().height};
    });
    ensure(actionVisual.primaryBg!==actionVisual.secondaryBg,'Primary and Details lost hierarchy: '+JSON.stringify(actionVisual));
    ensure(actionVisual.primaryContrast>=4.5&&actionVisual.secondaryContrast>=4.5,
      'Stash actions fail AA text contrast: '+JSON.stringify(actionVisual));
    ensure(Math.abs(actionVisual.radiusP-actionVisual.radiusD)<1 &&
      actionVisual.primaryHeight>=44&&actionVisual.secondaryHeight>=44,
      'Stash actions inconsistent geometry: '+JSON.stringify(actionVisual));

    const vialSurface=await card(99002).locator('.nx-kit-primary-vial').evaluate(el=>({
      background:getComputedStyle(el).backgroundColor,
      border:getComputedStyle(el).borderTopWidth
    }));
    ensure(vialSurface.background==='rgba(0, 0, 0, 0)'&&vialSurface.border==='0px',
      'Compact card still has nested vial panel surface: '+JSON.stringify(vialSurface));
    ensure(await card(99002).locator('.nx-kit-condensed').count()===0,'Nested compact card regression');
    ensure(await card(99003).locator('.nx-kit-primary-vial [role="progressbar"]').count()===0,'Unprepared blend shows fake percent progress');
    ensure(await card(99003).locator('.nx-kit-overview-number').count()===1,'Blend missing kit-wide inventory under Overview');
    ensure(await card(99002).locator('.nx-kit-primary-vial [role="progressbar"]').count()===1,'Open vial progress is missing');
    ensure(await card(99002).locator('.nx-kit-overview-number').innerText().then(x=>x.includes('80')),'Kit Overview total should include sealed plus open');
    ensure(await card(99002).locator('.nx-kit-primary-value').innerText().then(x=>x.includes('30') && x.includes('50')),'Open vial remaining display wrong');
    ensure(await card(99002).locator('.nx-kit-primary-vial [role="progressbar"]').getAttribute('aria-valuenow')==='60','Open vial percentage wrong');
    ensure(await card(99003).locator('.manage-kit-btn').count()>=1,'v0.9.9 blend actions were lost');
    // Regression for real iPhone screenshot: selected Overview/Vials/History
    // must be a rounded pill, never legacy squared underlined tabs.
    const tabGeometry=await card(99002).locator('.nx-stash-tabs').evaluate(group=>{
      const tab=group.querySelector('.nx-stash-tab[aria-selected="true"]');
      const g=getComputedStyle(group),t=getComputedStyle(tab);
      return {containerRadius:parseFloat(g.borderTopLeftRadius),containerBottom:parseFloat(g.borderBottomLeftRadius),
        selectedRadius:parseFloat(t.borderBottomLeftRadius),selectedTop:parseFloat(t.borderTopLeftRadius),
        selectedBottomBorder:parseFloat(t.borderBottomWidth),containerOverflow:g.overflow};
    });
    ensure(tabGeometry.containerRadius>=12 && tabGeometry.containerBottom>=12 &&
      tabGeometry.selectedRadius>=8 && tabGeometry.selectedTop>=8 &&
      tabGeometry.selectedBottomBorder<=1.1,
      'Stash Overview selected tab still square/underlined: '+JSON.stringify(tabGeometry));


    for(const id of [99001,99002,99003]){
      const parity=await card(id).locator('.nx-kit-heading-unified').evaluate(header=>{
        const title=header.querySelector('.nx-kit-title-stack'),status=header.querySelector('.nx-card-status'),btn=header.querySelector('.nx-kit-header-manage');
        if(!title||!status||!btn)return false;
        const t=title.getBoundingClientRect(),p=status.getBoundingClientRect(),m=btn.getBoundingClientRect();
        return p.top>t.top && p.left>=t.left-2 && p.right<=m.left+2 && m.width>=44 && m.height>=44 && !!btn.querySelector('.nx-unified-more-svg');
      });
      ensure(parity,'Stash card header missing stacked status/unified ellipsis for kit '+id);
    }

    // Physical iPhone report: Stored and Healthy badges must share one baseline,
    // and the light primary action must not expose the older underlying background.
    const badgeAndCta=await page.evaluate(()=>{
      const cards=[...document.querySelectorAll('.nx-kit-card.nx-kit-condensed')];
      const badges=cards.map(c=>c.querySelector('.nx-card-status > *')).filter(Boolean);
      const primary=cards[0]?.querySelector('.nx-kit-next-action');
      const styles=primary?getComputedStyle(primary):null;
      return {badgeHeights:badges.map(b=>Math.round(b.getBoundingClientRect().height)),
        badgeFont:badges.map(b=>getComputedStyle(b).fontSize),
        ctaBgImage:styles?.backgroundImage||'',ctaWidth:primary?.getBoundingClientRect().width||0,
        ctaClientWidth:primary?.clientWidth||0};
    });
    ensure(badgeAndCta.badgeHeights.every(x=>x===26)&&new Set(badgeAndCta.badgeFont).size===1,
      'Stash status pills lack identical DS2 geometry: '+JSON.stringify(badgeAndCta));
    ensure(badgeAndCta.ctaClientWidth>0&&badgeAndCta.ctaWidth>=44,
      'Stash primary CTA clipped by grid: '+JSON.stringify(badgeAndCta));
    if(theme==='light')ensure(badgeAndCta.ctaBgImage.includes('linear-gradient'),
      'Light primary CTA lost the Supplies lavender gradient: '+JSON.stringify(badgeAndCta));

    // Green-tinted vial details came from compound-specific inline CSS, not DS2.
    await page.evaluate(()=>openNewVialModal(99001));
    ensure(await page.locator('.nx-open-vial-form-options button').count()===2, 'Form choices missing');
    await page.locator('#nx-open-injectable').click();
    ensure(await page.locator('.nx-open-vial-details').count()===1,
      'Open New Vial lacks neutral DS2 details panel');
    const detailsBg=await page.locator('.nx-open-vial-details').evaluate(el=>{
      const st=getComputedStyle(el);
      return {bg:st.backgroundColor,border:st.borderTopColor};
    });
    ensure(!detailsBg.bg.includes('0, 255, 0')&&detailsBg.border!=='rgba(0, 0, 0, 0)',
      'Open New Vial details panel missing neutral surface: '+JSON.stringify(detailsBg));
    await page.evaluate(()=>closeModal());
    // Onboarding is independent of these fictional inventory fixtures; close any
    // introductory overlay before testing a real pointer tap on the Stash details.
    await page.evaluate(()=>document.querySelectorAll('.modal-bg').forEach(el=>el.remove()));
    await card(99002).locator('.nx-kit-detail-button').click();
    ensure(await card(99002).locator('.nx-kit-detail-button').getAttribute('aria-expanded')==='true' && await page.locator('#nx-kit-details-99002').evaluate(x=>!x.hidden),'Kit details not expandable');
    const expandedSetup=await card(99002).evaluate(el=>{
      const row=el.querySelector('.nx-stash-pane[data-pane="overview"] .nx-kit-use-setup-row'),
        btn=el.querySelector('.nx-stash-use-setup');
      const a=getComputedStyle(row),b=getComputedStyle(btn);
      return {rowBackground:a.backgroundColor,rowBorder:a.borderTopWidth,
        buttonBorder:b.borderTopWidth,buttonHeight:btn.getBoundingClientRect().height,
        buttonBackground:b.backgroundColor};
    });
    ensure(expandedSetup.buttonHeight>=44&&expandedSetup.buttonBorder!=='0px',
      'Secondary dose preferences must remain an accessible, visible action: '+JSON.stringify(expandedSetup));
    await page.screenshot({animations:'disabled',path:'dist/stash-expanded-setup-'+kind+'-'+theme+'-'+width+'.png'});

    ensure(await page.locator('.nx-kit-card').first().evaluate(x=>x.getBoundingClientRect().width<=window.innerWidth+1),'Kit overflows viewport');
    const before=await page.evaluate(()=>JSON.stringify(state.supplies));
    await page.evaluate(()=>supplyModal());
    ensure(await page.locator('.nx-kit-type-choice').count()===5,'Unified Add Kit form options missing');
    await page.locator('[data-kit-form="vial"]').click();
    ensure(await page.locator('.nx-stash-kit-editor').count()===1,'Kit editor styling hook missing');
    ensure(await page.locator('.nx-stash-kit-editor #ssave').count()===1,'Original Save handler target missing');
    ensure(await page.locator('.nx-stash-kit-editor #sname').count()===1 && await page.locator('.nx-stash-kit-editor #stv').count()===1 && await page.locator('.nx-stash-kit-editor #svmg').count()===1 && await page.locator('.nx-stash-kit-editor #sbac').count()===1 && await page.locator('.nx-stash-kit-editor #sloc').count()===1,'Kit fields lost');
    // The guided editor hides Save until final Review. Test the real journey,
    // rather than treating the intentionally hidden step-1 Save as zero-size UI.
    ensure(await page.locator('.nx-stash-kit-editor #ssave').isHidden(),'Kit Save exposed on Step 1');
    ensure(await page.locator('#nx-kit-combobox-input').count()===1,'Kit searchable field missing');
    await page.locator('#nx-kit-combobox-input').fill('GHK');
    ensure(await page.locator('.nx-kit-browse-all').isVisible(),'Regular Kit browse-all missing');
    await page.locator('.nx-kit-browse-all').click();
    ensure(await page.locator('.nx-compound-browser').isVisible(),'Regular Kit full-library view missing');
    ensure(await page.locator('.nx-browser-choice').count()>5,'Regular Kit full library truncated');
    await page.locator('#nx-browser-search').fill('GHK-Cu');
    await page.locator('.nx-browser-choice').first().click();
    ensure(await page.locator('#sname').inputValue()==='GHK-Cu','Regular Kit browse selection not retained');

    await page.screenshot({animations:'disabled',path:'dist/stash-regular-step1-'+kind+'-'+theme+'-'+width+'.png'});
    ensure(await page.locator('#nx-kit-next').isVisible(),'Kit Continue missing');
    ensure(await page.locator('#nx-kit-next').evaluate(el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return b.height>=44&&(s.backgroundImage!=='none'||(s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent'))&&s.color!==s.backgroundColor;}),'Kit Continue is not a prominent 44px action');
    ensure(await page.locator('#sname').isHidden(),'Duplicate native Kit compound select visible');
    ensure(await page.locator('#nx-kit-combobox-input').isVisible(),'Kit searchable compound field missing');
    ensure(!(await page.locator('.nx-kit-wizard-progress').innerText()).includes('1 / 3'),'Duplicate Kit step count rendered');
    await page.evaluate(()=>{
      const name=document.querySelector('#sname');name.value='GHK-Cu';name.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('#stv').value='2';document.querySelector('#svmg').value='10';
    });
    await page.locator('#nx-kit-next').click();
    ensure(await page.locator('.nx-kit-wizard-stage[data-step="1"]').evaluate(x=>!x.hidden),'Kit preparation step not reachable');
    ensure(await page.locator('.nx-kit-wizard-stage[data-step="1"] .nx-kit-attachment').isVisible(),'Standard test-result upload missing from Step 2');
    await page.locator('.nx-kit-attachment-input').setInputFiles({name:'fictional-coa.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nQA sample only')});
    await page.waitForFunction(()=>document.querySelector('.nx-kit-attachment-info')?.textContent.includes('fictional-coa.pdf'));
    ensure(await page.locator('.nx-kit-attachment-view').isVisible(),'Uploaded standard kit attachment is not previewable');
    await page.locator('.nx-kit-attachment-view').click();
    ensure(await page.locator('.nx-kit-file-viewer iframe').count()===1,'PDF preview is missing inside standard editor');
    ensure(await page.locator('.nx-kit-file-download').getAttribute('download')==='fictional-coa.pdf','PDF viewer missing download');
    await page.locator('.nx-kit-file-close').click();
    ensure(await page.locator('.nx-kit-file-viewer').count()===0,'PDF viewer did not close');

    ensure(await page.locator('#scur option').count()>=15,'Regular Kit currency selector has incomplete options');
    await page.locator('#scur').selectOption('SGD');
    ensure(await page.locator('#scost').evaluate(el=>{
      const other=document.querySelector('#scur');
      const a=el.getBoundingClientRect(),b=other.getBoundingClientRect();
      return Math.abs(a.width-b.width)<=2&&Math.abs(a.top-b.top)<=2&&a.width>=90;
    }),'Standard cost/currency fields are not equal-width peers');
    ensure(await page.locator('#snotes').evaluate(el=>el.tagName==='TEXTAREA'),'Standard kit notes must be multiline');
    await page.screenshot({animations:'disabled',path:'dist/stash-regular-step2-'+kind+'-'+theme+'-'+width+'.png'});
    ensure(await page.locator('#ssave').isHidden(),'Kit Save exposed on Step 2');
    await page.locator('#nx-kit-next').click();
    ensure(await page.locator('.nx-kit-wizard-stage[data-step="2"]').evaluate(x=>!x.hidden),'Kit Review not reachable');
    await page.screenshot({animations:'disabled',path:'dist/stash-regular-review-'+kind+'-'+theme+'-'+width+'.png'});
    ensure(await page.locator('#ssave').isVisible(),'Kit Save absent on Review');
    ensure((await page.locator('.nx-kit-wizard-summary').innerText()).includes('fictional-coa.pdf'),'Standard Review missing selected test-results file');
    ensure((await page.locator('.nx-kit-wizard-summary').innerText()).includes('SGD') || !await page.locator('#scost').inputValue(),'Kit Review omitted selected currency');
    ensure(await page.locator('.nx-stash-kit-editor #ssave').evaluate(x=>x.getBoundingClientRect().height)>=44,'Kit Review Save target too small');

    await page.evaluate(()=>closeModal());
    ensure(await page.evaluate(()=>JSON.stringify(state.supplies))===before,'Kit editor presentation unexpectedly mutated inventory');
    // Saved Stash attachment access must work for both regular and blend kits.
    await page.evaluate(()=>{
      const sample={name:'sample.png',type:'image/png',size:68,dataUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+nFfoAAAAASUVORK5CYII='};
      state.supplies.find(x=>x.id===99001).testResultAttachment={...sample};
      state.supplies.find(x=>x.id===99003).testResultAttachment={...sample};
      render();
    });
    for(const id of [99001,99003]){
      await card(id).locator('.nx-kit-detail-button').click();
      ensure(await card(id).locator('.nx-kit-test-view').isVisible(),'Saved kit missing View file '+id);
      await card(id).locator('.nx-kit-test-view').click();
      ensure(await page.locator('.nx-kit-file-viewer img').count()===1,'Image preview missing for kit '+id);
      ensure(await page.locator('.nx-kit-file-download').getAttribute('download')==='sample.png','Viewer download wrong for kit '+id);
      await page.locator('.nx-kit-file-close').click();
      ensure(await page.locator('.nx-kit-file-viewer').count()===0,'Viewer failed to close for kit '+id);
    }

    // Regression: the displayed vial sequence must be numeric, not the
    // storage array's arbitrary insertion order (real iPhone report 5,2,1,4).
    await page.evaluate(()=>{
      const kit=state.supplies.find(k=>k.id===99002);
      kit.vials=[
        {id:99025,sequenceNumber:5,status:'finished',vialMg:50,remainingMg:0,legacyUsedMg:50},
        {id:99022,sequenceNumber:2,status:'finished',vialMg:50,remainingMg:0,legacyUsedMg:50},
        {id:99021,sequenceNumber:1,status:'finished',vialMg:50,remainingMg:0,legacyUsedMg:50},
        {id:99024,sequenceNumber:4,status:'finished',vialMg:50,remainingMg:0,legacyUsedMg:50}
      ];
      kit.activeKit=false;
      render();
    });
    await card(99002).locator('.nx-kit-detail-button').click();
    await card(99002).locator('.nx-stash-tab[data-panel="vials"]').click();
    const vialOrder=await card(99002).locator('.nx-kit-vial-row .nx-kit-list-top strong').allTextContents();
    ensure(vialOrder.join('|')==='Vial 1|Vial 2|Vial 4|Vial 5',
      'Opened vial details must display numeric sequence order: '+JSON.stringify(vialOrder));
    // Fictional mixed physical stock: source-specific numbers must remain distinct.
    await page.evaluate(()=>{
      state._stashSub='kits';state._stashFilter='all';state._stashGroup='none';
      state.supplies=[{id:88001,name:'Selank',activeKit:true,totalVials:2,vialMg:10,bacMl:2,
        _vialsBackfilled:true,_vialsRepaired:true,reconDate:'2026-10-20T09:00:00',
        vials:[{id:88011,status:'open',intendedUse:'Injectable',vialMg:10,remainingMg:7,sequenceNumber:1,reconDate:'2026-10-20T09:00:00'},
               {id:88012,status:'open',intendedUse:'nasal-source',vialMg:10,remainingMg:3,sequenceNumber:2,reconDate:'2026-10-20T09:00:00'}],
        doseLog:[],wasteLog:[]}];
      state.formulationStocks=[{id:'fictional-bottle',compound:'Selank',sourceKitId:88001,
        containerType:'nasal-bottle',method:'Nasal',recordedPreparation:true,
        remainingMg:2,remainingMl:4,mgPerSpray:0.05,mlPerSpray:0.1}];
      render();
    });
    const mixed=card(88001),breakdown=mixed.locator('.nx-kit-source-breakdown');
    ensure(await breakdown.count()===1,'Mixed physical stock breakdown missing');
    const lines=await breakdown.innerText();
    ensure(lines.includes('Injectable vials · 7.00 mg'),'Injectable stock incorrect: '+lines);
    ensure(lines.includes('Nasal source vial · 3.00 mg'),'Nasal source incorrect: '+lines);
    ensure(lines.includes('Prepared nasal bottle · 2.00 mg / 4.00 mL'),'Prepared bottle incorrect: '+lines);
    ensure((await mixed.locator('.nx-kit-primary-value').innerText()).includes('7.00 mg'),'Mixed card primary balance must be injectable-only');
    ensure(await mixed.locator('.nx-kit-prepared-summary').count()===1,'Mixed card repeats nasal stock summary');
    ensure(await mixed.locator('.nx-kit-primary-vial .nx-kit-overview-track').count()===0,'Mixed compact card shows misleading single-vial progress');
    ensure(await page.evaluate(()=>state.supplies[0].vials.map(v=>v.remainingMg).join(',')+':'+state.formulationStocks[0].remainingMg)==='7,3:2','Stash render mutated stock');
    ensure(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mixed card horizontal overflow at mobile width');
    await page.evaluate(()=>{
      const kit=state.supplies[0];
      kit.vials[0].intendedUse='';
      kit.vials[1].status='sealed';
      state.formulationStocks=[];
      render();
    });
    const pending=card(88001);
    ensure((await pending.locator('.nx-stash-go-vial-method').innerText()).trim()==='Confirm vial form',
      'Unlabelled inventory must prioritize physical confirmation, not preferences');
    await pending.locator('.nx-kit-detail-button').click();
    ensure((await pending.locator('.nx-kit-detail-warning').innerText()).includes('Vial form not confirmed'),
      'Physical-vial status warning missing');
    ensure(await pending.locator('.nx-kit-detail-panel > .nx-kit-detail-setup .nx-stash-use-setup').count()===0,
      'Optional preferences interrupt urgent vial status');
    ensure((await pending.locator('.nx-stash-pane[data-pane="overview"] .nx-stash-use-setup').innerText()).trim()==='Dose preferences',
      'Dose preferences must be secondary to source confirmation');
    const prePreferences=await page.evaluate(()=>JSON.stringify(state.supplies));
    await pending.locator('.nx-stash-pane[data-pane="overview"] .nx-stash-use-setup').click();
    ensure(await page.locator('.nx-use-setup').isVisible(),'Stash Dose preferences button did not open editor');
    ensure(await page.locator('#nx-use-close').evaluate(el=>el.getBoundingClientRect().height)>=48,
      'Dose preferences close target must be at least 48px');
    await page.locator('#nx-use-close').click();
    ensure(await page.evaluate(()=>JSON.stringify(state.supplies))===prePreferences,
      'Opening/cancelling preferences altered stock');
    ensure(errors.length===0,'Page errors: '+errors.join('; '));
    results.push({kind,width,theme,status:'PASS',compactCardHeightPx:Math.round(compact.height),checks:['sealed no 100%','blend no 100%','owned total','open vial percentage','history disclosure','actions retained','viewport']});
    await ctx.close();
  }
}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_STASH_CARDS_QA.json',JSON.stringify({version:VERSION,results},null,2));
console.log('Stash Cards browser QA PASS: '+results.length+' LIVE/DEMO mobile theme configurations; collapsed open-vial card heights '+results.map(x=>x.width+'px/'+x.theme+'/'+x.kind+'='+x.compactCardHeightPx+'px').join(', '));