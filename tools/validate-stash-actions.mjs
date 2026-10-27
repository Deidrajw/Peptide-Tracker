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
  ensure(await page.locator('.nx-blend-compound-trigger').first().getAttribute('role')==='combobox','Blend picker is not editable combobox');
  ensure(await page.locator('.nx-blend-compound-trigger').first().getAttribute('type')==='search','Blend picker is not searchable input');
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
  await page.locator('#nx-blend-next').click();
  ensure(await page.locator('.nx-blend-wizard-summary').innerText().then(t=>t.includes('2.5 mL')&&t.includes('CAD $190')),'Review differs from entered BAC/cost');
  await page.screenshot({animations:'disabled',path:'dist/stash-blend-review-'+mode+'-'+theme+'-'+width+'.png'});
  ensure(await page.evaluate(()=>!state.supplies.some(x=>x.name==='QA Fixture Blend')),'Wizard saved before confirmation');
  await page.locator('#bk-save').click();
  const recorded=await page.evaluate(()=>state.supplies.find(x=>x.name==='QA Fixture Blend'));
  ensure(recorded?.bacMl===2.5&&recorded?.cost==='190'&&recorded?.totalVials===3&&recorded?.vialMg===15,'Saved blend differs from Review');
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
