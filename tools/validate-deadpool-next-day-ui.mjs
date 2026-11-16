import fs from 'node:fs';
import {chromium} from 'playwright';
// Only a disposable localhost browser context with fictional fixtures.
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[],key='peptide-tracker-html-v1';
const ensure=(value,message)=>{if(!value)throw Error(message)};
async function seed(page,theme,unknown){
  await page.goto('http://127.0.0.1:8777/',{waitUntil:'load'});
  await page.waitForFunction(()=>typeof buildDemoState==='function'&&typeof doseModal==='function');
  await page.evaluate(({theme,unknown,key})=>{
    state=buildDemoState('weight_loss');
    state.profile.onboardingDone=true;
    state.peptides={};state.customPeptides={};state.protocols=[];state.preparedDoses=[];
    state.customPeptides['Fictional Premix']={enabled:true,status:'active',route:'SubQ',unit:'mg',scheduleDays:1,doses:[]};
    state.supplies=[{id:9101,name:'Fictional Premix',isBlend:true,activeKit:true,
      preparationMethod:'SubQ',vialMg:30,totalVials:2,openedVials:1,emptyVials:0,
      reconDate:'2026-11-10T08:00:00',bacMl:3,
      composition:[{compound:'Fictional Alpha',mg:10},{compound:'Fictional Beta',mg:10},{compound:'Fictional Gamma',mg:10}],
      vials:[{id:9111,status:'open',sequenceNumber:1,vialMg:30,remainingMg:0,
        reconDate:'2026-11-10T08:00:00',intendedUse:'Injectable',bacMl:3},
        {id:9112,status:'sealed',sequenceNumber:2,vialMg:30,remainingMg:30}],
      doseLog:[{id:'fixture-prior',date:'2026-11-11T09:00:00',totalMgDrawn:9,vialId:9111},
        ...(unknown?[{id:'fixture-unknown',date:'2026-11-12T09:00:00',totalMgDrawn:1}]:[])],
      wasteLog:[],balanceCorrections:[]}];
    state.lastSourceKit={};state._pendingDoseDraft=null;
    _demoActive=false;
    const raw=JSON.stringify(state);
    localStorage.setItem(key,raw);
    _nexusLastSavedSnapshot=raw;
    _nexusSharedWriter=null;
    document.documentElement.dataset.theme=theme;
    render();
  },{theme,unknown,key});
}
async function log(page,date,expected){
  await page.evaluate(()=>{document.querySelectorAll('.modal-bg').forEach(x=>x.remove());doseModal('Fictional Premix')});
  ensure(await page.locator('.nx2-dose-modal').count()===1,'Actual Log Dose sheet missing');
  await page.locator('#date').fill(date);
  await page.locator('#dose').fill('3');
  await page.locator('#nx-dose-review-open').click();
  ensure(await page.locator('.nx-dose-review-stage').isVisible(),'Review screen missing');
  await page.locator('.nx2-dose-modal #save').click();
  await page.waitForFunction(expected=>{
    const k=state.supplies.find(x=>x.id===9101);
    return k?.doseLog?.length===expected;
  },expected,{timeout:15000});
  const result=await page.evaluate(key=>{
    const k=state.supplies.find(x=>x.id===9101);
    const persisted=JSON.parse(localStorage.getItem(key));
    return {status:k.vials[0].status,emptyVials:k.emptyVials,
      remaining:getBlendOpenVialRemainingMg(k),entries:k.doseLog.length,
      doses:state.customPeptides['Fictional Premix'].doses.length,
      durable:persisted.supplies[0].doseLog.length===k.doseLog.length,
      vial:k.doseLog.at(-1)?.vialId};
  },key);
  ensure(result.durable,'Dose not durably saved to localStorage');
  ensure(result.vial===9111,'Exact physical vial ledger mismatch');
  ensure(result.status==='open'&&result.emptyVials===0,'False EMPTY after UI save '+JSON.stringify(result));
  return result;
}
try{
 for(const width of [320,390])for(const theme of ['dark','light'])for(const unknown of [false,true]){
  const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await seed(page,theme,unknown);
  const prior=unknown?2:1;
  const first=await log(page,'2026-11-15T10:00',prior+1);
  ensure(first.doses===1,'First dose duplicated or missing');
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>typeof state==='object'&&state.supplies?.some(k=>k.id===9101));
  const loaded=await page.evaluate(()=>{
    const k=state.supplies.find(x=>x.id===9101);
    return {status:k.vials[0].status,remaining:getBlendOpenVialRemainingMg(k),
      doses:state.customPeptides['Fictional Premix']?.doses?.length};
  });
  ensure(loaded.status==='open'&&loaded.doses===1,'Reload lost vial or dose '+JSON.stringify(loaded));
  const second=await log(page,'2026-11-16T10:00',prior+2);
  ensure(second.doses===2&&second.remaining>0,'Next day actual dose blocked/duplicate');
  ensure(errors.length===0,'Uncaught browser exception '+errors.join('; '));
  results.push({width,theme,unknown,first,loaded,second,status:'PASS'});
  await ctx.close();
 }
}finally{await browser.close()}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/deadpool-next-day-browser-QA.json',JSON.stringify(results,null,2));
console.log('PASS real local-app UI, persisted localStorage, reload, next-day UI: '+results.length+' fictional scenarios');
