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
    const card=id=>page.locator('.nx-kit-card[data-kit-id="'+id+'"]');
    ensure(await card(99001).count()===1,'Sealed standard kit missing');
    ensure(await card(99002).count()===1,'Open standard kit missing');
    ensure(await card(99003).count()===1,'Sealed blend kit missing');
    ensure(await card(99001).locator('.nx-kit-vial-unopened').count()===1,'Sealed kit must show No vial open');
    ensure(await card(99001).locator('.nx-kit-primary-vial [role="progressbar"]').count()===0,'Sealed kit shows misleading progress');
    ensure(await card(99001).locator('.nx-kit-primary-value').innerText().then(x=>x.includes('No vial open')),'Sealed kit not labeled');
    ensure(await card(99003).locator('.nx-kit-primary-vial [role="progressbar"]').count()===0,'Unprepared blend shows fake percent progress');
    ensure(await card(99003).locator('.nx-kit-overview-number').count()===1,'Blend missing kit-wide inventory under Overview');
    ensure(await card(99002).locator('.nx-kit-primary-vial [role="progressbar"]').count()===1,'Open vial progress is missing');
    ensure(await card(99002).locator('.nx-kit-overview-number').innerText().then(x=>x.includes('80')),'Kit Overview total should include sealed plus open');
    ensure(await card(99002).locator('.nx-kit-primary-value').innerText().then(x=>x.includes('30') && x.includes('50')),'Open vial remaining display wrong');
    ensure(await card(99002).locator('.nx-kit-primary-vial [role="progressbar"]').getAttribute('aria-valuenow')==='60','Open vial percentage wrong');
    ensure(await card(99003).locator('.manage-kit-btn').count()>=1,'v0.9.9 blend actions were lost');
    // Onboarding is independent of these fictional inventory fixtures; close any
    // introductory overlay before testing a real pointer tap on the Stash details.
    await page.evaluate(()=>document.querySelectorAll('.modal-bg').forEach(el=>el.remove()));
    await card(99002).locator('.nx-kit-detail-button').click();
    ensure(await card(99002).locator('.nx-kit-detail-button').getAttribute('aria-expanded')==='true' && await page.locator('#nx-kit-details-99002').evaluate(x=>!x.hidden),'Kit details not expandable');
    const preserved=await page.evaluate(()=>JSON.stringify(state.supplies));
    const group=card(99002).locator('.nx-stash-tabs');
    ensure(await group.count()===1,'Overview/Vials/History tabs missing');
    ensure(await group.locator('[role="tab"]').count()===3,'Missing detail tabs');
    ensure(await card(99002).locator('.nx-stash-pane[data-pane="overview"]').isVisible(),'Overview hidden by default');
    ensure(!(await card(99002).locator('.nx-stash-pane[data-pane="vials"]').isVisible()),'Vials prematurely shown');
    await group.locator('[data-panel="vials"]').click();
    ensure(await card(99002).locator('.nx-stash-pane[data-pane="vials"]').isVisible(),'Vials panel not shown');
    ensure(!(await card(99002).locator('.nx-stash-pane[data-pane="overview"]').isVisible()),'Overview not hidden');
    await group.locator('[data-panel="history"]').focus();
    await group.locator('[data-panel="history"]').press('Home');
    ensure(await group.locator('[data-panel="overview"]').getAttribute('aria-selected')==='true','Tab keyboard Home broken');
    await group.locator('[data-panel="history"]').click();
    ensure(await card(99002).locator('.nx-stash-pane[data-pane="history"]').isVisible(),'History not visible');
    ensure(await card(99002).locator('.nx-stash-pane[data-pane="history"] details').count()===0,'Nested dose-history chevrons remain');
    ensure(await page.evaluate(()=>JSON.stringify(state.supplies))===preserved,'Switching panels changed inventory state');
    ensure(await group.locator('button').first().evaluate(el=>el.getBoundingClientRect().height)>=44,'Detail tab target too small');

    ensure(await page.locator('.nx-kit-card').first().evaluate(x=>x.getBoundingClientRect().width<=window.innerWidth+1),'Kit overflows viewport');
    ensure(errors.length===0,'Page errors: '+errors.join('; '));
    results.push({kind,width,theme,status:'PASS',checks:['sealed no 100%','blend no 100%','owned total','open vial percentage','history disclosure','actions retained','viewport']});
    await ctx.close();
  }
}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_STASH_PANELS_QA.json',JSON.stringify({version:VERSION,results},null,2));
console.log('Stash Panels browser QA PASS: '+results.length+' LIVE/DEMO mobile theme configurations');