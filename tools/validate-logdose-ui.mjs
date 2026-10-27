import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
const results=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const ensure=(ok,why)=>{if(!ok)throw Error(why)};
async function seed(page, theme) {
  await page.evaluate(t=>{
    state=buildDemoState('weight_loss');
    state.profile.onboardingDone=true;
    document.documentElement.dataset.theme=t;
    state.peptides.Retatrutide={enabled:true,status:'active',route:'SubQ',
      scheduleDays:7,doses:[],lastDose:2};
    state.preparedDoses=[];
    state.lastSourceKit={};
    state.supplies=[];
    state._pendingDoseDraft=null;
    window.__fixtureKit=(id,remaining,sealed=0)=>{
      const vials=[{id:10000+id,status:'open',vialMg:10,remainingMg:remaining,
        sequenceNumber:1,reconDate:'2026-10-20T09:00:00'}];
      for(let i=0;i<sealed;i++)vials.push({id:20000+id+i,status:'sealed',
        vialMg:10,remainingMg:10,sequenceNumber:i+2});
      return {id,name:'Retatrutide',activeKit:true,totalVials:1+sealed,
        openedVials:1,vialMg:10,bacMl:2,_vialsBackfilled:true,
        _vialsRepaired:true,vials,wasteLog:[]};
    };
  },theme);
}
async function stateSnapshot(page){return page.evaluate(()=>({
  entries:state.peptides.Retatrutide.doses.map(d=>JSON.parse(JSON.stringify(d))),
  kits:state.supplies.map(k=>({id:k.id,remaining:k.vials.map(v=>v.remainingMg),
    statuses:k.vials.map(v=>v.status)})),
  prepared:state.preparedDoses.map(p=>({...p})),
  draft:state._pendingDoseDraft
}));}
async function setDose(page,amount){await page.locator('#dose').fill(String(amount));}
async function openDose(page){await page.evaluate(()=>doseModal('Retatrutide'));}
async function clickSave(page){
  const modal=page.locator('.nx2-dose-modal');
  const next=modal.locator('#nx-dose-step-next');
  for(let i=0;i<3 && !(await modal.locator('#save').isVisible());i++){
    ensure(await next.isVisible(),'Continue unavailable before review');
    await next.click();
    if(!(await modal.locator('#save').isVisible()) && !(await next.isVisible()))break;
  }
  if(await modal.locator('#save').isVisible())await modal.locator('#save').click();
  // Invalid entry must remain unsaved on Entry, with feedback from step validation.
  else ensure(await modal.locator('.nx-dose-step-error').isVisible(),'Invalid entry lacks step validation feedback');
}
try {
  for(const width of [320,390])for(const theme of ['dark','light'])for(const kind of ['live','demo']){
    const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('dialog',async d=>d.accept());
    await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
    await seed(page,theme);let verified=[];
    // A: Actual user confirmation, same recorded ID preserved after edit,
    // reapply edited amount to the original open vial only.
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9101,6,1)]);
    await openDose(page);
    ensure(await page.locator('.nx2-dose-modal').count()===1,'Log Dose modal absent');
    ensure(await page.locator('.nx2-dose-modal #save').innerText().then(x=>x.includes('CONFIRM LOG')),'Confirm footer missing');
    await setDose(page,2);
    // DS2 review must show useful source labels while retaining full traceability.
    await page.locator('#nx-dose-step-next').click();
    ensure(await page.locator('.nx-dose-review-stage').isVisible(),'Review stage missing');
    const preview=await page.locator('#nx-dose-review-rows').innerText();
    ensure(preview.includes('Retatrutide') && !preview.includes('9101') && !preview.includes('19101'),
      'Raw kit/vial IDs leaked into primary Review rows: '+preview);
    const idDetails=page.locator('#nx-dose-source-ids');
    ensure(await idDetails.count()===1 && await idDetails.isVisible(),
      'Optional source IDs disclosure missing');
    await idDetails.locator('summary').click();
    ensure((await idDetails.innerText()).includes('9101'),'Traceable source ID missing from disclosure');
    ensure((await page.evaluate(()=>state.peptides.Retatrutide.doses.length))===0,
      'Opening Review unexpectedly persisted a dose');
    await page.locator('#nx-dose-step-back').click();
    await page.locator('.nx-dose-optional > summary').click();
    await page.locator('#notes').fill('Fictional day 1 note');
    await clickSave(page);
    let first=await stateSnapshot(page);
    ensure(first.entries.length===1,'Single vial confirmation failed to create one dose');
    ensure(Math.abs(first.kits[0].remaining[0]-4)<.01,'Confirmed 2 mg did not deduct exactly 2 mg');
    ensure(Math.abs(first.kits[0].remaining[1]-10)<.01,'Sealed backup was erroneously consumed');
    const originalId=first.entries[0].id;
    await page.evaluate(()=>doseModal('Retatrutide',state.peptides.Retatrutide.doses[0]));
    await setDose(page,3);await clickSave(page);
    let edited=await stateSnapshot(page);
    ensure(edited.entries.length===1 && edited.entries[0].id===originalId,'Editing duplicated a dose record');
    ensure(Math.abs(edited.kits[0].remaining[0]-3)<.01,'Edit failed to reverse and reapply deduction');
    ensure(edited.entries[0].notes==='Fictional day 1 note','Edit unexpectedly wiped notes');
    verified.push('single vial confirm/edit/original-ID and exact deduction');

    // B: Impossible request across current open sources must not silently
    // log a partial allocation or touch inventory.
    await seed(page,theme);
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9102,1.5),window.__fixtureKit(9103,5)]);
    await openDose(page);
    // Invalid recorded amounts must not create inventory out of thin air.
    for(const amount of [-1,0]){
      await setDose(page,amount);await clickSave(page);
      const invalid=await stateSnapshot(page);
      ensure(invalid.entries.length===0 && invalid.kits[0].remaining[0]===1.5 &&
        invalid.kits[1].remaining[0]===5,'Invalid amount '+amount+' was saved or changed inventory');
    }
    await setDose(page,7);
    await page.waitForTimeout(650);
    ensure(await page.locator('#alloc-panel').innerText().then(x=>x.includes('Not enough in current vial')),'Shortfall UI not visible');
    let before=await stateSnapshot(page);await clickSave(page);let after=await stateSnapshot(page);
    ensure(after.entries.length===0,'UNDERALLOCATED_FORM_SAVED_PARTIAL_DOSE: 7 mg recorded despite only 6.5 mg open');
    ensure(JSON.stringify(after.kits)===JSON.stringify(before.kits),'Rejected entry altered source stock');
    verified.push('insufficient open stock and invalid amounts cannot log partial dose');

    // C: Multi-vial UI allocation across explicit current sources and
    // one saved dose record, with correct allocation source IDs.
    await seed(page,theme);
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9104,1.5),window.__fixtureKit(9105,5)]);
    await openDose(page);await setDose(page,4);await page.waitForTimeout(650);
    ensure(await page.locator('#alloc-add-kit').count()===1,'Use another vial action absent');
    await page.locator('#alloc-add-kit').click();
    ensure(await page.locator('.alloc-mg-input').count()===2,'Second vial allocation not rendered');
    await page.locator('#nx-dose-step-next').click();
    const splitReview=await page.locator('#nx-dose-review-rows').innerText();
    ensure(splitReview.includes('Source 1')&&splitReview.includes('Source 2')&&splitReview.includes('Total allocated'),'Multi-vial Review omits structured source rows');
    ensure(!splitReview.includes('Kit 9104')&&!splitReview.includes('Kit 9105'),'Primary multi-vial Review should not expose raw kit IDs');
    const splitIds=page.locator('#nx-dose-source-ids');
    await splitIds.locator('summary').click();
    const auditIds=await splitIds.innerText();
    ensure(auditIds.includes('9104')&&auditIds.includes('9105'),'Multi-vial Review loses selected kit identity in source identifiers');
    await clickSave(page);
    const split=await stateSnapshot(page);
    ensure(split.entries.length===1,'Multi-vial save generated zero/duplicate records');
    ensure(split.entries[0].allocations?.length===2,'Multi-vial allocation lost vial identity');
    ensure(Math.abs(split.kits[0].remaining[0])<.01 &&
      Math.abs(split.kits[1].remaining[0]-2.5)<.01,'Two-source inventory math wrong');
    verified.push('actual UI multi-vial selection & one dose record');

    // D: Recording a prepared syringe changes prepared remaining count,
    // never deducts the source vial again.
    await seed(page,theme);
    await page.evaluate(()=>{
      state.supplies=[window.__fixtureKit(9106,4)];
      state.preparedDoses=[{id:8109,compound:'Retatrutide',amountEach:2,
        unit:'mg',count:3,remainingCount:3,createdAt:'2026-10-23T11:00',
        allocations:[{kitId:9106,vialId:19106,amount:6}]}];
    });
    await openDose(page);
    ensure(await page.locator('.src-opt[data-src="8109"]').count()===1,'Prepared source selector missing');
    await page.locator('#nx-dose-step-next').click();
    const preparedReview=await page.locator('#nx-dose-review-rows').innerText();
    ensure(preparedReview.includes('Prepared dose')&&preparedReview.includes('8109')===false,'Prepared review source is unclear');
    await clickSave(page);
    const prepared=await stateSnapshot(page);
    ensure(prepared.entries.length===1 && prepared.entries[0].fromPreparedId===8109,
      'Prepared source not recorded');
    ensure(prepared.prepared[0].remainingCount===2,'Prepared batch decrement wrong');
    ensure(Math.abs(prepared.kits[0].remaining[0]-4)<.01,'Prepared administration double-deducted the vial');
    verified.push('prepared-source confirmation without second vial deduction');

    // E: Real modal handoff to "Open sealed vial" preserves everything
    // entered without actually opening/altering a physical vial.
    await seed(page,theme);
    await page.evaluate(()=>state.supplies=[window.__fixtureKit(9107,1,1)]);
    await openDose(page);
    await setDose(page,3);
    await page.locator('.nx-dose-optional > summary').click();
    await page.locator('#notes').fill('Retain this fictional draft');
    await page.waitForTimeout(650);
    ensure(await page.locator('#alloc-open-new').count()===1,'Open sealed vial action missing');
    await page.locator('#alloc-open-new').click();
    const draft=await stateSnapshot(page);
    ensure(draft.draft?.name==='Retatrutide' && draft.draft.dose==='3'
      && draft.draft.notes==='Retain this fictional draft',
      'New-vial handoff lost typed draft values');
    ensure(draft.entries.length===0 && Math.abs(draft.kits[0].remaining[0]-1)<.01 &&
      Math.abs(draft.kits[0].remaining[1]-10)<.01,'Draft handoff unexpectedly changed inventory/history');
    verified.push('new-vial handoff preserves unsaved draft with no deduction');
    ensure(errors.length===0,'Browser JS errors: '+errors.join(' | '));
    results.push({width,theme,kind,status:'PASS',verified});
    await context.close();
  }
}finally{await browser.close();}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/Nexus_'+VERSION+'_LOG_DOSE_END_TO_END.json',
  JSON.stringify(results,null,2));
console.log('Log Dose browser end-to-end PASS',results.length,'configurations;',results.reduce((x,r)=>x+r.verified.length,0),'flows');
