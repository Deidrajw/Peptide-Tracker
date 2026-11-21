import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
// PR173 background-first: real full-app fictional Vial Actions, no routine audit prompt.
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+version+'_FULL_DEMO.html');
const ensure=(ok,message)=>{if(!ok)throw Error(message)};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
try{
  for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['light','dark']){
    const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof vialActionsMenu==='function'&&typeof buildDemoState==='function'&&!!globalThis.NexusHistoricalReconciliation);
    const initial=await page.evaluate(theme=>{
      state=buildDemoState('weight_loss');
      state.profile.onboardingDone=true;
      state.peptides={'Fictional Blend':{doses:[
        {id:9001,date:'2026-11-10',dose:3,blendSource:1777,allocations:[{kitId:1777,vialId:null,ledgerId:null,amount:0}]},
        {id:9002,date:'2026-11-11',dose:2,blendSource:1777,allocations:[{kitId:1777,vialId:1888,ledgerId:1999,amount:2}]},
        {id:9003,date:'2026-11-12',dose:1,blendSource:1777,allocations:[{kitId:1777,vialId:1888,ledgerId:1999,amount:1},{kitId:1777,vialId:null,ledgerId:null,amount:0}]}
      ]}};
      state.customPeptides={};
      state.supplies=[{id:1777,name:'Fictional Blend',isBlend:true,blendInventoryMode:'ledger',
        vials:[{id:1888,status:'empty',sequenceNumber:1,remainingMg:0,finishedAt:null}],
        doseLog:[{id:1999,vialId:1888,totalMgDrawn:9,date:'2026-11-09'}]}];
      document.documentElement.dataset.theme=theme;
      const beforeStorage=localStorage.getItem('peptide-tracker-html-v1');
      const beforeRead=JSON.stringify(state);
      const report=globalThis.NexusHistoricalReconciliation.review(state,1777);
      const afterRead=JSON.stringify(state);
      vialActionsMenu(1777,1888);
      const afterMenu=JSON.stringify(state);
      return {beforeStorage,beforeRead,afterRead,afterMenu,unresolved:report.unresolved,
        physicalRemaining:report.physicalRemainingMg,known:report.entries.find(e=>e.id===9002)?.sourceKnown};
    },theme);
    ensure(initial.beforeRead===initial.afterRead,'Internal reader modified app state');
    ensure(JSON.stringify(initial.unresolved)===JSON.stringify([9001,9003]),'Missing source evidence was silently attributed');
    ensure(initial.physicalRemaining===null,'Physical remaining inferred from historical evidence');
    ensure(initial.known===true,'Valid same-vial ledger evidence was lost');
    ensure(await page.locator('#va-history-review').count()===0,'Routine historical audit CTA exposed');
    ensure((await page.locator('body').innerText()).includes('VIAL ACTIONS'),'Normal vial menu missing');
    const geometry=await page.evaluate(()=>{
      const m=document.querySelector('#modal')||document.querySelector('.modal');
      return {bodyOverflow:Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
        menuExists:!!document.querySelector('#va-adjust')};
    });
    ensure(geometry.bodyOverflow<=2,'Horizontal overflow '+JSON.stringify(geometry));
    ensure(geometry.menuExists,'Existing adjust-remaining action missing');
    await page.locator('#x').click();
    await page.evaluate(()=>{
      state.peptides['Fictional Blend'].doses=[{id:9010,date:'2026-11-13',dose:2,
        blendSource:1777,allocations:[{kitId:1777,vialId:1888,ledgerId:1999,amount:2}]}];
      vialActionsMenu(1777,1888);
    });
    ensure(await page.locator('#va-history-review').count()===0,'Clean vial exposed audit CTA');
    await page.locator('#x').click();
    const after=await page.evaluate(()=>({storage:localStorage.getItem('peptide-tracker-html-v1')}));
    ensure(initial.beforeStorage===after.storage,'Read-only menu wrote production storage');
    ensure(errors.length===0,'Browser error '+errors.join('; '));
    results.push({kind,width,theme,status:'PASS',noRoutineAudit:true,sourceUncertainSafely:true,physicalRemaining:'unknown',noWrite:true,geometry});
    await ctx.close();
  }
}finally{await browser.close()}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/historical-review-browser-QA.json',JSON.stringify(results,null,2));
console.log('PASS '+results.length+' fictional background-first full-app Vial Actions sessions; no audit CTA or writes');
