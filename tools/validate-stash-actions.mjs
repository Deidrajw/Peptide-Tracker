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
  // Test actual Open New Vial sheet, not only a CSS selector in isolation.
  await page.evaluate(()=>openNewVialModal(88902));
  const cta=await page.locator('#rvsave').evaluate(el=>{
    const s=getComputedStyle(el);
    return {bg:s.backgroundColor,fg:s.color,webkit:s.webkitTextFillColor,
      height:el.getBoundingClientRect().height};
  });
  if(theme==='light'){
    ensure(cta.bg==='rgb(98, 68, 156)' && cta.fg==='rgb(255, 255, 255)'
      && cta.webkit==='rgb(255, 255, 255)',
      'Light Open New Vial CTA must be white text on deep violet: '+JSON.stringify(cta));
  }
  ensure(cta.height>=44,'Open New Vial CTA touch target below 44px');
  await page.evaluate(()=>closeModal());
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
  // Supply deletion is available from Edit details only. Confirm and Cancel
  // operate on fictional supply fixtures; opening either sheet must not mutate it.
  await page.evaluate(()=>{
    state.equipmentItems=[
      {id:881000,type:'Alcohol Wipes',brand:'QA wipes',unitLabel:'packs',
       unitSize:100,unitOfMeasure:'count',storageLocation:'room_temp',notes:'QA only',
       units:[{id:881001,status:'sealed',consumed:0}],usageLog:[]},
      {id:881002,type:'Alcohol Wipes',brand:'Preserve me',unitLabel:'packs',
       unitSize:100,unitOfMeasure:'count',storageLocation:'room_temp',notes:'',
       units:[{id:881003,status:'sealed',consumed:0}],usageLog:[]}
    ];
    tab='stash';render();
  });
  ensure(await page.locator('.nx-supply-detail-footer .supply-delete').count()===0,'Delete supply remains on overview');
  await page.evaluate(()=>equipmentModal(state.equipmentItems.find(x=>x.id===881000)));
  ensure(await page.locator('#eq-delete').count()===1,'Supply Delete missing from Edit details');
  ensure(await page.evaluate(()=>state.equipmentItems.length)===2,'Opening editor mutated supplies');
  await page.locator('#eq-delete').click();
  ensure(await page.locator('#ca-cancel').count()===1,'Delete requires confirmation');
  await page.locator('#ca-cancel').click();
  ensure(await page.evaluate(()=>state.equipmentItems.length)===2,'Cancel deleted supply unexpectedly');
  await page.evaluate(()=>equipmentModal(state.equipmentItems.find(x=>x.id===881000)));
  await page.locator('#eq-delete').click();
  await page.locator('#ca-ok').click();
  ensure(await page.evaluate(()=>state.equipmentItems.length===1&&state.equipmentItems[0].id===881002),'Delete altered unrelated supply');
  ensure(errors.length===0,'Browser exceptions '+errors.join('; '));
  results.push({width,theme,mode,status:'PASS',checks:['standard actions mapped','stored conditional','detail disclosure','blend safe routing','non-mutating open','touch targets']});
  await context.close();
 }
}finally{await browser.close();}
fs.writeFileSync('dist/Nexus_'+version+'_STASH_ACTIONS_QA.json',JSON.stringify({version,results},null,2));
console.log('Stash Actions browser test PASS: '+results.length+' configurations');
