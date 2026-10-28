/**
 * DS2 deep-route screenshot and action-style audit.
 * Usage: npm install playwright && npx playwright install chromium
 *        NEXUS_AUDIT_URL=http://127.0.0.1:4173 node scripts/ds2-nested-navigation-audit.mjs
 * Serve a LOCAL checkout on that port. NEVER target production or preview: this
 * script changes transient state and clears LOCAL-ORIGIN storage per new context.
 * Browser emulation is not physical iPhone acceptance.
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin=process.env.NEXUS_AUDIT_URL || 'http://127.0.0.1:4173';
if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(origin))
  throw Error('Localhost-only audit: refusing remote or production origin');
const out='artifacts/ds2-nested-audit';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const views=[
 {id:'today',tab:'home'},
 {id:'calendar',tab:'calendar'},
 {id:'plans',tab:'plans'},
 {id:'stash',tab:'stash'},
 {id:'trends',tab:'trends'},
 {id:'nexus-ask',tab:'amino',sub:'chat'},
 {id:'nexus-journal',tab:'amino',sub:'journal'},
 {id:'nexus-learn',tab:'amino',sub:'learn'},
 {id:'nexus-explore',tab:'amino',sub:'explore'},
 {id:'learn-standalone',tab:'learn'},
 {id:'profile',tab:'profile',profile:'profile'},
 {id:'settings',tab:'profile',profile:'settings'},
 {id:'supplements',tab:'profile',profile:'supplements'},
 ...['reminders','phasereminders','units','health','privacy','backup','datamanagement','usage','developer','appupdates']
 .map(detail=>({id:'settings-'+detail,tab:'profile',profile:'settings',detail}))
];
const evidence=[]; 
const fixtureEvidence=[];
for(const width of [320,390]) for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:740},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await context.addInitScript(()=>{try{localStorage.clear()}catch{}});
 const page=await context.newPage();
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.waitForSelector('#app',{timeout:15000});
 // Fresh isolated storage intentionally displays onboarding. Dismiss only in this
 // ephemeral localhost context or the overlay hides all nested route screenshots.
 await page.evaluate(()=>{
   state.profile.onboardingDone=true;
   state.settings.lastSeenChangelog=CURRENT_CHANGELOG_VERSION;
   closeModal();
   enterDemoMode('weight_loss');
   if (!isDemoMode() || !state.supplies?.length || !state.dailyLogs?.length ||
       !Object.keys(state.peptides||{}).length || !state.weightLogs?.length)
     throw Error('Isolated fictional data fixture missing compound, inventory, check-in or weight records');
   render();
 });
 if(await page.locator('.nx-ob-intro').count()) throw Error('Onboarding overlay still blocks nested route audit');
 const fictional=await page.evaluate(()=>({demo:isDemoMode(),kits:state.supplies.length,logs:state.dailyLogs.length,doses:Object.values(state.peptides||{}).reduce((n,p)=>n+(p.doses||[]).length,0)}));
 if(!fictional.demo || !fictional.kits || !fictional.logs) throw Error('Not in populated isolated demo mode');
 fixtureEvidence.push({width,theme,...fictional});
 // The app can show first-run onboarding above every route. Never count its overlay as a child screenshot.
 const onboardingVisible=await page.locator('text=Welcome to Nexus').first().isVisible().catch(()=>false);
 if(onboardingVisible){
   const skip=page.getByRole('button',{name:/^Skip$/i});
   if(await skip.count()) await skip.first().click();
   await page.waitForTimeout(150);
 }
 if(await page.locator('text=Welcome to Nexus').first().isVisible().catch(()=>false))
   throw Error('Audit blocked by first-run onboarding; cannot claim route screenshot coverage');
 for(const v of views){
  let problem=null, buttons=[], overflow=false;
  try{
   await page.evaluate(({tab:tabName,sub,profile,detail,themeName})=>{
    document.documentElement.dataset.theme=themeName;
    tab=tabName;
    if(sub)state._aminoSub=sub;
    if(profile)state._profileTab=profile;
    state._settingsDetail=detail||null;
    state._guideOpen=null;state._discoverOpen=null;
    render();
   },{...v,tab:v.tab,themeName:theme});
   await page.waitForTimeout(100);
   const reached=await page.evaluate(({tab:tabName,sub,profile,detail})=>{
     const pageRoot=document.querySelector('.nx2-page--'+tabName);
     if(!pageRoot)return false;
     if(detail)return !!pageRoot.querySelector('#settings-detail-back') &&
       pageRoot.textContent.trim().length>40;
     if(tabName==='amino')return !!pageRoot.querySelector('#as-'+sub+'[aria-selected="true"]');
     if(tabName==='profile'&&profile)return !!pageRoot.querySelector('.profile-subtab[data-tab="'+profile+'"]');
     return pageRoot.textContent.trim().length>20;
   },v);
   if(!reached)throw Error('Requested route not actually rendered: '+v.id);
   const report=await page.evaluate(()=>{
     const getEl=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {
       text:(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,90),
       id:e.id||null,className:typeof e.className==='string'?e.className.slice(0,100):'',
       background:s.backgroundColor,color:s.color,border:s.borderColor,radius:s.borderRadius,
       shadow:s.boxShadow,disabled:e.disabled,visible:r.width>0&&r.height>0
     }};
     return {overflow:document.documentElement.scrollWidth>innerWidth+2,
       buttons:[...document.querySelectorAll('#app button')].filter(e=>getEl(e).visible).map(getEl)};
   });
   buttons=report.buttons;overflow=report.overflow;
   await page.screenshot({path:path.join(out,`${width}-${theme}-${v.id}.png`),fullPage:true,animations:'disabled'});
  }catch(err){problem=String(err);}
  evidence.push({screen:v.id,width,theme,overflow,buttons,error:problem});
 }

 // Open safe in-DOM nested dialogs/actions (no save, import, delete or reset).\n // Backup Import opens a browser-native file chooser, not an in-DOM sheet; audit separately.
 // These are additional path screenshots, not a substitute for save-path QA.
 const childOpeners=[
  {id:'today-dose-chooser',tab:'home',selector:'#today-log-dose'},
  {id:'plans-add-goal',tab:'plans',selector:'#add-goal'},
  {id:'stash-add-kit',tab:'stash',selector:'#qa-addkit'},
  {id:'trends-pattern-sheet',tab:'trends',selector:'#nx-open-pattern'},
  {id:'trends-symptom-sheet',tab:'trends',selector:'#nx-open-symptom-timing'}
 ];
 for(const action of childOpeners){
  let error=null,buttons=[],overflow=false,opened=false;
  try{
   opened=await page.evaluate(({tab:nextTab,detail,selector})=>{
    closeModal();
    document.querySelector('#nexus-more-panel')?.remove();
    tab=nextTab;
    state._profileTab='settings';
    state._settingsDetail=detail||null;
    render();
    const target=document.querySelector(selector);
    if(!target)throw Error('Opener not found: '+selector);
    target.click();
    return !!(document.querySelector('.modal')||document.querySelector('#nexus-more-panel'));
   },action);
   await page.waitForTimeout(180);
   const shot=await page.evaluate(()=>{
    const els=[...document.querySelectorAll('button')].filter(e=>{
      const r=e.getBoundingClientRect(),s=getComputedStyle(e);
      return r.width>0&&r.height>0&&s.visibility!=='hidden';
    });
    return {overflow:document.documentElement.scrollWidth>innerWidth+2,
      buttons:els.map(e=>{const s=getComputedStyle(e);return {
       text:(e.innerText||e.getAttribute('aria-label')||'').trim().slice(0,90),
       id:e.id||null,className:typeof e.className==='string'?e.className.slice(0,100):'',
       background:s.backgroundColor,color:s.color,border:s.borderColor,radius:s.borderRadius,
       shadow:s.boxShadow,disabled:e.disabled,visible:true
      }})};
   });
   overflow=shot.overflow;buttons=shot.buttons;
   if(!opened)throw Error('No modal or sheet after opener '+action.selector);
   await page.screenshot({path:path.join(out,`${width}-${theme}-${action.id}.png`),fullPage:true,animations:'disabled'});
  }catch(e){error=String(e);}
  evidence.push({screen:action.id,width,theme,overflow,buttons,error,opened});
 }
 await context.close();
}
// Semantic classification is deliberately conservative: an unfamiliar label is
// UNCLASSIFIED, never a purported colour defect. Selection and disabled states
// are valid reasons for a different treatment. All records remain reviewable.
function actionRole(button){
 const label=String(button.text||'').toLowerCase();
 const id=String(button.id||'').toLowerCase();
 const cls=String(button.className||'').toLowerCase();
 if(button.disabled)return 'disabled';
 if(/^(nuke-data|del-)/.test(id)||/^(delete|remove all|erase|clear all|reset all)/.test(label))return 'destructive';
 if(/tab|segmented|filter|toggle|chip|switch/.test(cls)||/^(quick log|guided log|day|week|month)$/.test(label))return 'selection';
 if(/^(back|cancel|close|done|dismiss|not now|skip)$/.test(label)||/^(nx-(pe|st)-done|settings-detail-back|nx-.*-close)$/.test(id))return 'secondary';
 if(/^(continue|confirm log|save|add|create|start|next|log dose|log a dose|send)$/.test(label)||/^(today-log-dose|add-goal|qa-addkit|add-supp|nx-kit-next)$/.test(id))return 'primary';
 return 'unclassified';
}
const roleInventory=evidence.flatMap(e=>e.buttons.map(button=>({
 screen:e.screen,width:e.width,theme:e.theme,role:actionRole(button),
 ...button
})));
const roleSummary={};
for(const button of roleInventory){
 const role=button.role;
 (roleSummary[role]??={count:0,styles:{}}).count++;
 const style=[button.background,button.radius,button.shadow].join(' | ');
 roleSummary[role].styles[style]=(roleSummary[role].styles[style]||0)+1;
}
await fs.writeFile(path.join(out,'button-role-audit.json'),
 JSON.stringify({fixture:'fictional local demo',roles:roleSummary,observations:roleInventory,
 note:'Unclassified and role-specific variants require human review; differences across distinct roles are not failures.'},null,2));
await fs.writeFile(path.join(out,'action-inventory.json'),JSON.stringify({source:origin,generated:new Date().toISOString(),fixture:'built-in weight_loss fictional Demo Mode; local isolated context; saves disabled',fixtureEvidence,evidence},null,2));
await browser.close();

const expectedPrimary='rgb(198, 166, 242)';
const primaryActions=[
 ['today','today-log-dose'],['plans','add-goal'],
 ['stash','qa-addkit'],['supplements','add-supp'],
 ['stash-add-kit','nx-kit-next']
];
const semanticFailures=[];
for(const width of [320,390])for(const theme of ['light','dark']){
 for(const [screen,id] of primaryActions){
  const entry=evidence.find(x=>x.screen===screen&&x.width===width&&x.theme===theme);
  const button=entry?.buttons.find(x=>x.id===id);
  if(!button)semanticFailures.push(`${width}/${theme} ${screen}: missing ${id}`);
  else if(button.background!==expectedPrimary)semanticFailures.push(`${width}/${theme} ${screen}: ${id} fill ${button.background} != ${expectedPrimary}`);
 }
 for(const screen of ['trends-pattern-sheet','trends-symptom-sheet']){
  const entry=evidence.find(x=>x.screen===screen&&x.width===width&&x.theme===theme);
  const id=screen==='trends-pattern-sheet'?'nx-pe-done':'nx-st-done';
  const button=entry?.buttons.find(x=>x.id===id);
  if(!button)semanticFailures.push(`${width}/${theme} ${screen}: missing ${id}`);
  else if(button.background===expectedPrimary)semanticFailures.push(`${width}/${theme} ${screen}: informational Done incorrectly has primary fill`);
 }
}

const failures=evidence.filter(x=>x.error||x.overflow);
console.log(`Captured ${evidence.length} deep-route screenshots; errors/overflow ${failures.length}; evidence: ${out}`);
if(semanticFailures.length){console.error('Semantic action hierarchy failures:',semanticFailures);process.exitCode=1;}
if(failures.length){console.error(failures.map(x=>[x.screen,x.width,x.theme,x.error||'overflow']));process.exitCode=1;}
