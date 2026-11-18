import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
// Full-app actual review UI with invented records only. No production host or user backup.
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
  await page.waitForFunction(()=>typeof nexusReviewHistoricalBlendVial==='function'&&typeof buildDemoState==='function');
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
    const beforeState=JSON.stringify(state);
    const beforeStorage=localStorage.getItem('peptide-tracker-html-v1');
    vialActionsMenu(1777,1888);
    return {beforeState,beforeStorage};
  },theme);
  const menuAction=page.locator('#va-history-review');
  ensure(await menuAction.isVisible(),'Review missing from actual Vial Actions menu');
  ensure(await menuAction.evaluate(el=>el.getBoundingClientRect().height)>=44,'Vial Actions review target below 44px');
  await menuAction.click();
  const review=page.locator('.nx-historical-vial-review');
  await review.waitFor({state:'visible'});
  ensure((await review.innerText()).includes('Physical remainder'),'Physical remainder missing');
  ensure((await review.innerText()).includes('Unknown'),'Missing safe unknown state');
  ensure((await review.innerText()).includes('Dose 9001'),'Missing historical unresolved entry');
  ensure((await review.innerText()).includes('Dose 9003'),'Partially linked entry was hidden');
  ensure((await review.innerText()).includes('Ledger 1999'),'Physical ledger absent');
  ensure(await review.locator('button').count()===2,'Read-only review has extra buttons');
  const geometry=await page.evaluate(()=>{
    const m=document.querySelector('.nx-historical-vial-review'),close=document.querySelector('#nx-history-close'),copy=document.querySelector('#nx-history-copy');
    return {horizontalOverflow:Math.max(0,m.scrollWidth-m.clientWidth),closeWidth:close.getBoundingClientRect().width,closeHeight:close.getBoundingClientRect().height,copyHeight:copy.getBoundingClientRect().height};
  });
  ensure(geometry.horizontalOverflow<=2,'Review overflow '+JSON.stringify(geometry));
  ensure(geometry.closeWidth>=44&&geometry.closeHeight>=44&&geometry.copyHeight>=44,'Touch target under 44px');
  await page.locator('#nx-history-copy').click();
  await page.locator('#nx-history-close').click();
  const after=await page.evaluate(()=>({afterState:JSON.stringify(state),afterStorage:localStorage.getItem('peptide-tracker-html-v1')}));
  ensure(initial.beforeState===after.afterState,'Opening or closing review changed app state');
  ensure(initial.beforeStorage===after.afterStorage,'Review modified localStorage');
  ensure(errors.length===0,'Review browser error '+errors.join('; '));
  results.push({kind,width,theme,status:'PASS',geometry,recordCount:3,physicalRemaining:'unknown',noWrite:true});
  await ctx.close();
 }
}finally{await browser.close()}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/historical-review-browser-QA.json',JSON.stringify(results,null,2));
console.log('PASS '+results.length+' fictional full-app Vial Actions -> historical review sessions; no writes');