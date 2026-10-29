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
 await page.locator('#dose').fill(String(amount));
 await page.locator('#dose').dispatchEvent('input');
 await page.waitForTimeout(650);
 await page.locator('.nx-dose-inline-review > summary').click();
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
await browser.close();
console.log('Fictional Log Dose source regression PASS '+JSON.stringify(results));
