/** Isolated, fictional-data Log Dose allocation regression.
 * No real user storage, production origin, import, remote sync, or real injection advice.
 */
import {chromium} from 'playwright';
const origin=process.env.NEXUS_AUDIT_URL||'http://127.0.0.1:4173';
if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(origin))throw Error('Refuse non-local URL');
const browser=await chromium.launch({headless:true});
const results=[];
for(const [name,amount,shouldSave] of [['insufficient',300,false],['valid',2,true]]){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage();
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#app');
 const initial=await page.evaluate(()=>{
   state.profile.onboardingDone=true;
   state.settings.lastSeenChangelog=CURRENT_CHANGELOG_VERSION;
   closeModal();
   enterDemoMode('weight_loss');
   if(!isDemoMode())throw Error('Demo mode required');
   // Only one fictional source for the test compound. Set an open vial to 10mg
   // after canonical inventory migration and remove alternative source kits.
   let kit=state.supplies.find(k=>k.name==='Retatrutide');
   if(!kit)throw Error('Fictional source kit missing');
   state.supplies=[kit];
   // Fictional test source is explicitly labelled: route inference is never allowed.
   kit.preparationMethod='SubQ';
   migrateKitToV2(kit);
   const vial=kitOpenVialV2(kit);
   if(!vial)throw Error('No fictional open vial');
   for(const v of kit.vials||[]){if(v.id!==vial.id){v.status='empty';v.remainingMg=0;}}
   vial.status='open';vial.remainingMg=10;kit.activeKit=true;
   const pep=state.peptides.Retatrutide;
   if(!pep)throw Error('Demo Retatrutide records missing');
   const before={count:(pep.doses||[]).length,remaining:vial.remainingMg,kitId:kit.id,vialId:vial.id};
   doseModal('Retatrutide');
   return before;
 });
 await page.locator((await page.locator('#nx-dose-entered').count())?'#nx-dose-entered':'#dose').fill(String(amount));
 await page.locator((await page.locator('#nx-dose-entered').count())?'#nx-dose-entered':'#dose').dispatchEvent('input');
 await page.waitForTimeout(650);
 await page.locator('#nx-dose-review-open').click();
 await page.locator('#nx-dose-review-rows').waitFor({state:'visible'});
 const review=await page.locator('.nx-dose-review-stage').innerText();
 await page.locator('#save').click();
 const after=await page.evaluate(({kitId,vialId})=>{
   const kit=state.supplies.find(k=>String(k.id)===String(kitId));
   const vial=(kit?.vials||[]).find(v=>String(v.id)===String(vialId));
   return {count:(state.peptides.Retatrutide?.doses||[]).length,remaining:vial?.remainingMg??null,demo:isDemoMode(),
     warning:document.body.innerText.slice(-600)};
 },initial);
 const success=shouldSave
   ? after.count===initial.count+1 && Math.abs(after.remaining-(10-amount))<0.02
   : after.count===initial.count && Math.abs(after.remaining-10)<0.02;
 results.push({name,amountMg:amount,before:initial,after:{count:after.count,remaining:after.remaining,demo:after.demo},
   reviewWarns:review.includes('Inventory review required'),success});
 if(!after.demo || !success)throw Error(name+' transaction violated expected fictitious dose/inventory invariants: '+JSON.stringify(results.at(-1)));
 await ctx.close();
}

/* PR124 use setup: independent fictional scenario, no production records touched. */
{
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await ctx.newPage();
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#app');
 const base=await page.evaluate(()=>{
   state.profile.onboardingDone=true;
   state.settings.lastSeenChangelog=CURRENT_CHANGELOG_VERSION;
   closeModal();enterDemoMode('weight_loss');
   if(!isDemoMode())throw Error('Demo isolation missing');
   const kit=state.supplies.find(k=>k.name==='Retatrutide');
   if(!kit)throw Error('No fictional kit');
   state.supplies=[kit];kit.preparationMethod='SubQ';
   migrateKitToV2(kit);
   const vial=kitOpenVialV2(kit);
   if(!vial)throw Error('No fictional open vial');
   for(const v of kit.vials||[]){if(v.id!==vial.id){v.status='empty';v.remainingMg=0;}}
   vial.status='open';vial.remainingMg=10;kit.activeKit=true;
   nexusUseSetupModal('Retatrutide');
   return {kitId:kit.id,vialId:vial.id};
 });
 await page.locator('#nx-use-unit').selectOption('mcg');
 await page.locator('input[name="nx-use-mode"][value="untracked"]').check();
 await page.locator('#nx-use-save').click();
 const untrackedSetup=await page.evaluate(()=>({...state.nexusUseSetups.Retatrutide}));
 if(untrackedSetup.unit!=='mcg'||untrackedSetup.trackingMode!=='untracked'||untrackedSetup.method!=='SubQ')
   throw Error('Setup preferences did not persist '+JSON.stringify(untrackedSetup));
 const untrackedBefore=await page.evaluate(({kitId,vialId})=>{
   const k=state.supplies.find(k=>k.id===kitId),v=k.vials.find(v=>v.id===vialId);
   return {mg:v.remainingMg,count:state.peptides.Retatrutide.doses.length};
 },base);
 await page.evaluate(()=>doseModal('Retatrutide'));
 await page.locator('#nx-dose-entered').fill('250');
 await page.locator('#nx-dose-review-open').click();
 const untrackedReview=await page.locator('#nx-dose-review-rows').innerText();
 if(!untrackedReview.includes('Untracked'))throw Error('Untracked review source not explicit');
 await page.locator('#save').click();
 const untrackedAfter=await page.evaluate(({kitId,vialId})=>{
   const k=state.supplies.find(k=>k.id===kitId),v=k.vials.find(v=>v.id===vialId);
   const logs=state.peptides.Retatrutide.doses;
   return {mg:v.remainingMg,count:logs.length,dose:logs.at(-1)};
 },base);
 if(untrackedAfter.count!==untrackedBefore.count+1||untrackedAfter.mg!==untrackedBefore.mg||
    untrackedAfter.dose.trackingMode!=='untracked'||Number(untrackedAfter.dose.dose)!==0.25||
    untrackedAfter.dose.allocations||untrackedAfter.dose.kitId)
   throw Error('Untracked mode changed stock or unit arithmetic '+JSON.stringify(untrackedAfter));
 await page.evaluate(()=>nexusUseSetupModal('Retatrutide'));
 await page.locator('input[name="nx-use-mode"][value="backed"]').check();
 await page.locator('#nx-use-save').click();
 const backedSetup=await page.evaluate(()=>({...state.nexusUseSetups.Retatrutide}));
 if(backedSetup.trackingMode!=='backed'||String(backedSetup.sourceVialId)!==String(base.vialId))
   throw Error('Exact source not remembered '+JSON.stringify(backedSetup));
 await page.evaluate(()=>doseModal('Retatrutide'));
 await page.locator('#nx-dose-entered').fill('250');
 await page.locator('#nx-dose-unit').selectOption('mg');
 const switched=await page.locator('#nx-dose-entered').inputValue();
 if(Math.abs(Number(switched)-0.25)>0.0000001)throw Error('mcg to mg switch incorrect '+switched);
 await page.locator('#nx-dose-unit').selectOption('mcg');
 if(Number(await page.locator('#nx-dose-entered').inputValue())!==250)throw Error('mg to mcg roundtrip failed');
 await page.locator('#nx-dose-review-open').click();
 await page.locator('#save').click();
 const backedAfter=await page.evaluate(({kitId,vialId})=>{
   const k=state.supplies.find(k=>k.id===kitId),v=k.vials.find(v=>v.id===vialId);
   return {mg:v.remainingMg,log:state.peptides.Retatrutide.doses.at(-1)};
 },base);
 if(Math.abs(backedAfter.mg-9.75)>0.0001||backedAfter.log.trackingMode!=='backed'||
    backedAfter.log.enteredUnit!=='mcg'||backedAfter.log.enteredDose!=='250')
   throw Error('Backed exact-source dose or unit mismatch '+JSON.stringify(backedAfter));
 await page.evaluate(({kitId,vialId})=>{
   const k=state.supplies.find(k=>k.id===kitId),v=k.vials.find(v=>v.id===vialId);
   v.intendedUse='Nasal';
   doseModal('Retatrutide');
 },base);
 const mismatch=await page.locator('#alloc-panel').innerText();
 if(!mismatch.includes('not an inventory shortage'))throw Error('Missing method-mismatch explanation '+mismatch);
 await page.locator('#nx-dose-entered').fill('250');
 await page.locator('#nx-dose-review-open').click();
 if(await page.locator('.nx-dose-review-stage').isVisible())throw Error('Unresolved source was allowed into Review');
 const mismatchAfter=await page.evaluate(({kitId,vialId})=>{
   const k=state.supplies.find(k=>k.id===kitId),v=k.vials.find(v=>v.id===vialId);
   return {mg:v.remainingMg,count:state.peptides.Retatrutide.doses.length};
 },base);
 if(mismatchAfter.mg!==backedAfter.mg||mismatchAfter.count!==untrackedAfter.count+1)
   throw Error('Mismatch mutated stock or history '+JSON.stringify(mismatchAfter));
 results.push({name:'use-setup-untracked-backed-unit-roundtrip-method-mismatch',success:true,
   untracked:{count:untrackedAfter.count,mg:untrackedAfter.mg},backed:{mg:backedAfter.mg},
   mismatch:'blocked without stock mutation'});
 await ctx.close();
}

await browser.close();
console.log('Fictional Log Dose source regression PASS '+JSON.stringify(results));
