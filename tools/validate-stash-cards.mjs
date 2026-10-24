import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const VERSION='v0.9.11-beta',demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
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
    ensure(await card(99001).locator('.nx-stash-inventory-summary').count()===1,'Sealed kit total summary missing');
    ensure(await card(99001).locator('.nx-stash-open-progress').count()===0,'Sealed kit shows a misleading percent bar');
    ensure(await card(99001).locator('.nx-stash-sealed-note').count()===1,'Sealed kit is not clearly labeled');
    ensure(await card(99003).locator('.nx-stash-open-progress').count()===0,'Unprepared blend shows fake percent progress');
    ensure(await card(99003).locator('.nx-stash-inventory-summary').count()===1,'Blend missing total inventory summary');
    ensure(await card(99002).locator('.nx-stash-open-progress [role="progressbar"]').count()===1,'Open vial progress is missing');
    ensure(await card(99002).locator('.nx-stash-inventory-summary').innerText().then(x=>x.includes('80')),'Canonical kit remaining should include sealed + open');
    ensure(await card(99002).locator('.nx-stash-open-progress').innerText().then(x=>x.includes('30 / 50')),'Vial remaining display wrong');
    ensure(await card(99002).locator('.nx-stash-open-progress [role="progressbar"]').getAttribute('aria-valuenow')==='60','Open vial percentage wrong');
    ensure(await card(99003).locator('.manage-kit-btn').count()>=1,'v0.9.9 blend actions were lost');
    // Onboarding is independent of these fictional inventory fixtures; close any
    // introductory overlay before testing a real pointer tap on the Stash details.
    await page.evaluate(()=>document.querySelectorAll('.modal-bg').forEach(el=>el.remove()));
    const summary=card(99002).locator('details').first();
    await summary.locator('summary').first().click();
    ensure(await summary.evaluate(x=>x.open),'History/details not expandable');
    ensure(await page.locator('.nx-kit-card').first().evaluate(x=>x.getBoundingClientRect().width<=window.innerWidth+1),'Kit overflows viewport');
    ensure(errors.length===0,'Page errors: '+errors.join('; '));
    results.push({kind,width,theme,status:'PASS',checks:['sealed no 100%','blend no 100%','owned total','open vial percentage','history disclosure','actions retained','viewport']});
    await ctx.close();
  }
}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_STASH_CARDS_QA.json',JSON.stringify({version:VERSION,results},null,2));
console.log('Stash Cards browser QA PASS: '+results.length+' LIVE/DEMO mobile theme configurations');