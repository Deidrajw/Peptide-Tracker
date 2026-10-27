import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version, demo=path.resolve('dist/Nexus_'+version+'_FULL_DEMO.html');
if(!fs.existsSync(demo))throw Error('Full-app demo not built');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[],ensure=(ok,msg)=>{if(!ok)throw Error(msg)};
try{
 for(const width of [320,390])for(const theme of ['dark','light'])for(const mode of ['live','demo']){
  const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(mode==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  await page.evaluate(t=>{
    state=buildDemoState('weight_loss');state.profile.onboardingDone=true;
    document.documentElement.dataset.theme=t;
    state.supplies=[
      {id:88901,name:'GHK-Cu',totalVials:3,vialMg:50,bacMl:2,activeKit:true,reconDate:'2026-10-20T12:00:00',vials:[{id:88911,status:'open',vialMg:50,remainingMg:40,reconDate:'2026-10-20T12:00:00'},{id:88912,status:'sealed',vialMg:50,remainingMg:50},{id:88913,status:'sealed',vialMg:50,remainingMg:50}]},
      {id:88902,name:'Selank',totalVials:1,vialMg:5,bacMl:1,activeKit:false,reconDate:null,vials:[{id:88914,status:'sealed',vialMg:5,remainingMg:5}]},
      {id:88903,name:'Deadpool Test Blend',isBlend:true,composition:[{compound:'BPC-157',mg:10},{compound:'TB-500',mg:10}],totalVials:1,vialMg:20,bacMl:2,activeKit:false,reconDate:null,vials:[{id:88915,status:'sealed',vialMg:20,remainingMg:20}],doseLog:[],wasteLog:[]}
    ];
    tab='stash';render();
  },theme);
  const snap=()=>page.evaluate(()=>JSON.stringify(state.supplies));
  const before=await snap();
  ensure(await page.locator('.nx-kit-card[data-kit-id="88903"] .manage-kit-btn').count()>=1,'Blend kit has no actions button');
  await page.evaluate(()=>manageKitMenu(88901));
  ensure(await page.locator('.nx-stash-sheet').count()===1,'Standard action sheet missing');
  for(const id of ['finish-vial','add-to-open','restock','outflow','edit','details','intel','finish-kit','delete','prepare'])ensure(await page.locator('.nx-stash-action[data-action="'+id+'"]').count()===1,'Missing standard action '+id);
  ensure(await page.locator('.nx-stash-action').first().evaluate(el=>el.getBoundingClientRect().height)>=44,'Touch target too small');
  ensure(await snap()===before,'Opening standard sheet mutated inventory');
  await page.locator('#x').click();
  await page.evaluate(()=>manageKitMenu(88902));
  ensure(await page.locator('.nx-stash-action[data-action="finish-vial"]').count()===0,'Sealed kit shows Finish Vial');
  ensure(await page.locator('.nx-stash-action[data-action="open"]').count()===1,'Sealed kit missing Open');
  await page.locator('.nx-stash-action[data-action="details"]').click();
  ensure(await page.locator('.nx-kit-card[data-kit-id="88902"] .nx-kit-detail-button').getAttribute('aria-expanded')==='true' && await page.locator('#nx-kit-details-88902').evaluate(el=>!el.hidden),'Kit details did not expand');
  await page.evaluate(()=>manageKitMenu(88903));
  ensure(await page.locator('.nx-stash-action[data-action="edit"]').count()===1,'Blend kit edit absent');
  ensure(await page.locator('.nx-stash-action[data-action="prepare"]').count()===0,'Blend incorrectly routed to standard preparation');
  ensure(await page.locator('.nx-stash-action[data-action="finish-vial"]').count()===0,'Blend incorrectly routed to standard finish');
  ensure(await page.locator('.nx-stash-action[data-action="delete"]').count()===1,'Blend missing delete');
  ensure(await snap()===before,'Viewing blend actions changed inventory');
  await page.locator('.nx-stash-action[data-action="edit"]').click();
  ensure(await page.locator('#bk-save').count()===1,'Blend editor form did not open');
  ensure(await page.locator('#bk-save').isHidden(),'Blend Save visible before Review');
  ensure(await page.locator('#nx-blend-next').isVisible(),'Blend Continue missing on first step');
  ensure(await page.locator('#nx-blend-next').evaluate(el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return b.height>=44&&(s.backgroundImage!=='none' || (s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent'));}),'Blend Continue is not a prominent 44px action');
  ensure(await page.locator('.nx-guided-stash-title').isVisible(),'Persistent Blend title is missing');
  const fullEditor=await page.locator('.nx-guided-blend-editor').evaluate(el=>{
    const rect=el.getBoundingClientRect();
    return {height:rect.height,viewport:window.innerHeight,width:rect.width,screen:window.innerWidth};
  });
  ensure(fullEditor.height>=fullEditor.viewport-25&&fullEditor.width<=fullEditor.screen+2,
    'Blend editor should use one full-height mobile editing surface: '+JSON.stringify(fullEditor));

  ensure(await page.locator('.comp-select').first().isHidden(),'Duplicate native Blend component picker visible');
  ensure(await page.locator('.nx-blend-compound-trigger').first().getAttribute('role')==='combobox','Blend picker is not editable combobox');
  ensure(await page.locator('.nx-blend-compound-trigger').first().getAttribute('type')==='search','Blend picker is not searchable input');
  const oneLine=await page.locator('.comp-row').first().evaluate(row=>{
    const p=row.querySelector('.nx-blend-compound-picker')?.getBoundingClientRect(),
      mg=row.querySelector('.comp-mg-input')?.getBoundingClientRect(),
      remove=row.querySelector('.comp-remove')?.getBoundingClientRect();
    return Boolean(p&&mg&&remove&&Math.abs(p.top-mg.top)<12&&Math.abs(mg.top-remove.top)<12
      &&p.right<=mg.left+2&&mg.right<=remove.left+2&&remove.right<=window.innerWidth+1);
  });
  ensure(oneLine,'Blend compound, mg and remove do not share one non-overlapping row');
  // Guided blend regression: no state mutation while navigating; single BAC field is
  // both the review source and the value the canonical #bk-save handler persists.
  await page.evaluate(()=>{closeModal();addBlendKitModal(null);});
  ensure(await page.locator('#bk-bac').count()===0,'Obsolete duplicate BAC field still exists');
  ensure(await page.locator('#bk-bac-edit').count()===1,'Canonical blend BAC field missing');
  ensure(await page.locator('#nx-blend-next').count()===1,'Guided blend navigation missing');
  ensure(!(await page.locator('#bk-active').isChecked()),'New blend unexpectedly opens first vial by default');
  ensure(await page.locator('#bk-save').isHidden(),'New blend Save visible before Review');
  await page.screenshot({animations:'disabled',path:'dist/stash-blend-step1-'+mode+'-'+theme+'-'+width+'.png'});
  await page.locator('.nx-blend-compound-trigger').first().fill('BPC');
  ensure(await page.locator('.nx-blend-compound-option').count()>0,'Blend combobox search did not return options');
  const pickerLayout=await page.locator('.comp-row').first().evaluate(row=>{
    const menu=row.querySelector('.nx-blend-compound-popup'),results=row.querySelector('.nx-blend-compound-results');
    const a=row.getBoundingClientRect(),b=menu.getBoundingClientRect(),css=getComputedStyle(menu);
    return {rowHeight:a.height,menuHeight:b.height,position:css.position,scrollable:results.scrollHeight>results.clientHeight+2,count:results.querySelectorAll('button').length};
  });
  ensure(pickerLayout.position==='absolute'&&pickerLayout.rowHeight<100&&!pickerLayout.scrollable&&pickerLayout.count<=5,
    'Compound suggestions stretch row or create nested scrolling: '+JSON.stringify(pickerLayout));
  await page.screenshot({animations:'disabled',path:'dist/stash-blend-search-'+mode+'-'+theme+'-'+width+'.png'});


  await page.locator('.nx-blend-browse-all').first().click();
  ensure(await page.locator('.nx-compound-browser').isVisible(),'Blend full-library screen missing');
  ensure(await page.locator('.nx-compound-browser .nx-browser-choice').count()>5,'Blend browser is not showing complete library');
  await page.locator('#nx-browser-search').fill('BPC-157');
  ensure(await page.locator('.nx-browser-choice').count()===1,'Blend full-library search failed');
  await page.locator('.nx-browser-choice').first().click();
  ensure(await page.locator('.nx-compound-browser').count()===0,'Blend browser did not close after selection');
  ensure(await page.locator('.comp-select').first().inputValue()==='BPC-157','Blend browser did not update native backing value');
  await page.locator('#bk-name').fill('QA Fixture Blend');
  await page.evaluate(()=>{
    const selects=[...document.querySelectorAll('.comp-select')];
    selects[0].value='BPC-157';selects[0].dispatchEvent(new Event('change',{bubbles:true}));
    const refreshed=[...document.querySelectorAll('.comp-select')];
    refreshed[1].value='TB-500';refreshed[1].dispatchEvent(new Event('change',{bubbles:true}));
  });
  await page.locator('.comp-mg-input').nth(0).fill('10');
  await page.locator('.comp-mg-input').nth(1).fill('5');
  await page.locator('#nx-blend-next').click();
  ensure(await page.locator('.nx-blend-wizard-panel[data-step="1"]').evaluate(el=>!el.hidden),'Preparation step not visible');
  await page.screenshot({animations:'disabled',path:'dist/stash-blend-step2-'+mode+'-'+theme+'-'+width+'.png'});
  await page.locator('#bk-bac-edit').fill('2.5');
  await page.locator('#bk-vials').fill('3');
  await page.locator('#bk-cost').fill('190');
  ensure(await page.locator('#bk-currency option').count()>=15,'Blend currency selector has incomplete options');
  await page.locator('#bk-currency').selectOption('USD');
  await page.locator('#nx-blend-next').click();
  ensure(await page.locator('.nx-blend-wizard-summary').innerText().then(t=>t.includes('2.5 mL')&&t.includes('USD 190')),'Review differs from entered BAC/cost');
  ensure(await page.locator('.nx-blend-review-hero h3').innerText()==='QA Fixture Blend','Review missing prominent blend name');
  ensure(await page.locator('.nx-blend-review-total').innerText().then(t=>t.includes('15 mg')),'Review missing emphasized total strength');
  ensure(await page.locator('.nx-blend-review-component').count()===2,'Review missing component composition');
  ensure(await page.locator('.nx-blend-wizard-footer').evaluate(el=>getComputedStyle(el).backgroundColor==='rgba(0, 0, 0, 0)'),
    'Blend sticky actions retain opaque dark background');

  await page.screenshot({animations:'disabled',path:'dist/stash-blend-review-'+mode+'-'+theme+'-'+width+'.png'});
  ensure(await page.evaluate(()=>!state.supplies.some(x=>x.name==='QA Fixture Blend')),'Wizard saved before confirmation');
  await page.locator('#bk-save').click();
  const recorded=await page.evaluate(()=>state.supplies.find(x=>x.name==='QA Fixture Blend'));
  ensure(recorded?.bacMl===2.5&&recorded?.cost==='190'&&recorded?.currency==='USD'&&recorded?.totalVials===3&&recorded?.vialMg===15,'Saved blend differs from Review');
  ensure(recorded?.composition?.length===2&&recorded.composition[0].mg===10&&recorded.composition[1].mg===5,'Saved component amounts incorrect');
  await page.evaluate(()=>{state.supplies=state.supplies.filter(x=>x.name!=='QA Fixture Blend');render();});
  // iPhone regression: legacy ID rule must not collapse secondary multi-vial padding.
  await page.evaluate(()=>{closeModal();doseModal('GHK-Cu');});
  const multi=await page.locator('#toggle-multi').evaluate(el=>{
    const s=getComputedStyle(el),r=el.getBoundingClientRect();
    return {top:parseFloat(s.paddingTop),bottom:parseFloat(s.paddingBottom),
      left:parseFloat(s.paddingLeft),right:parseFloat(s.paddingRight),height:r.height,
      width:r.width,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};
  });
  ensure(multi.top>=12&&multi.bottom>=12&&multi.left>=20&&multi.right>=20,
    'Use multiple vials has compressed padding: '+JSON.stringify(multi));
  ensure(multi.height>=48&&multi.scrollWidth<=multi.clientWidth+1,
    'Use multiple vials clips or undersizes text: '+JSON.stringify(multi));
  await page.evaluate(()=>closeModal());
  ensure(errors.length===0,'Browser exceptions '+errors.join('; '));
  results.push({width,theme,mode,status:'PASS',checks:['standard actions mapped','stored conditional','detail disclosure','blend safe routing','non-mutating open','touch targets']});
  await context.close();
 }
}finally{await browser.close();}
fs.writeFileSync('dist/Nexus_'+version+'_STASH_ACTIONS_QA.json',JSON.stringify({version,results},null,2));
console.log('Stash Actions browser test PASS: '+results.length+' configurations');
