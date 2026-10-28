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
 {id:'protocols',tab:'protocols'},
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
     if(detail)return !!pageRoot.querySelector(
       detail==='appupdates'?'#au-back':'#settings-detail-back'
     ) && pageRoot.textContent.trim().length>40;
     if(tabName==='amino')return !!pageRoot.querySelector('#as-'+sub+'[aria-selected="true"]');
     if(tabName==='profile'&&profile)return !!pageRoot.querySelector('.profile-subtab[data-tab="'+profile+'"]');
     return pageRoot.textContent.trim().length>20;
   },v);
   if(!reached)throw Error('Requested route not actually rendered: '+v.id);
   if(v.id==='trends'){
     const blendState=await page.evaluate(()=>{
       const kits=(state.supplies||[]).filter(x=>x.isBlend);
       const section=document.querySelector('#nx-blend-analytics');
       return {kits:kits.length,section:!!section,text:section?.textContent||''};
     });
     if(blendState.kits>0 && (!blendState.section||!blendState.text.includes('Blend composition')))
       throw Error('Trends blend read-only reporting missing: '+JSON.stringify(blendState));
   }
   if(v.id==='today'){
     const icons=await page.evaluate(()=>[...document.querySelectorAll('.nx-qa-tile .nx-qa-icon')].map(el=>{
       const outer=el.getBoundingClientRect(),svg=el.querySelector('svg');
       if(!svg)return {error:'Shortcut lacks SVG'};
       const inner=svg.getBoundingClientRect();
       return {outerW:outer.width,outerH:outer.height,svgW:inner.width,svgH:inner.height,
         offsetX:Math.abs(inner.left+inner.width/2-outer.left-outer.width/2),
         offsetY:Math.abs(inner.top+inner.height/2-outer.top-outer.height/2)};
     }));
     if(icons.length!==4||icons.some(x=>x.error||x.outerW!==38||x.outerH!==38||x.svgW!==20||x.svgH!==20||x.offsetX>1||x.offsetY>1))
       throw Error('Quick-access icons inconsistent or off centre: '+JSON.stringify(icons));
   }
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

 // Protocol first-log CTA is conditional on fictional protocol status and dose history.
 // Capture presence/absence explicitly so a missing fixture is not mistaken for styling acceptance.
 const protocolCTA=evidence.find(x=>x.screen==='protocols'&&x.width===width&&x.theme===theme);
 fixtureEvidence.push({width,theme,protocolFirstLogVisible:!!protocolCTA?.buttons.some(x=>x.className.includes('nx-proto-firstlog-action'))});
 

 // Dedicated fictional active protocol with no dose history; the default
 // weight-loss fixture already has doses and cannot show "Ready for first log".
 try {
   await page.evaluate(()=>{
     closeModal();
     tab='protocols';
     const target=state.protocols?.find(p=>(p.compounds||[]).some(c=>c.name==='Retatrutide'));
     if(!target)throw Error('Fictional Retatrutide protocol missing');
     window.__ds2PriorDoses=state.peptides.Retatrutide.doses;
     state.peptides.Retatrutide.doses=[];
     target.status='active';
     target.startDate=new Date(Date.now()-86400000).toISOString().slice(0,10);
     render();
   });
   const btn=page.locator('.nx2-page--protocols .proto-log-first');
   await btn.waitFor({state:'visible',timeout:4000});
   const styles=await btn.evaluate(el=>{
     const s=getComputedStyle(el);
     return {text:el.textContent.trim(),background:s.backgroundColor,radius:s.borderRadius,shadow:s.boxShadow};
   });
   if(styles.text!=='Log first dose'||styles.background!=='rgb(198, 166, 242)')
      throw Error('Protocol first-log CTA mismatch '+JSON.stringify(styles));
   await page.screenshot({path:path.join(out,`${width}-${theme}-protocol-first-log.png`),fullPage:true,animations:'disabled'});
   evidence.push({screen:'protocol-first-log',width,theme,overflow:false,buttons:[{id:'protocol-first-log',className:'proto-log-first',text:styles.text,background:styles.background,radius:styles.radius,shadow:styles.shadow,disabled:false,visible:true}],error:null});
 } catch(err){evidence.push({screen:'protocol-first-log',width,theme,overflow:false,buttons:[],error:String(err)});}
 finally{
   await page.evaluate(()=>{
      if(window.__ds2PriorDoses){state.peptides.Retatrutide.doses=window.__ds2PriorDoses;delete window.__ds2PriorDoses;}
      render();
   });
 }


 // Inspect a populated saved-dose reaction editor without invoking save/delete.
 try{
  const result=await page.evaluate(()=>{
    closeModal();
    const first=state.peptides.Retatrutide?.doses?.[0];
    if(!first)throw Error('No fictional saved dose available for reaction editor');
    nexusDoseReactionModal('Retatrutide',first.id);
    const button=document.querySelector('.nx-reaction-editor #nx-reaction-save');
    if(!button)throw Error('Reaction Save button missing');
    const style=getComputedStyle(button);
    return {text:button.textContent.trim(),background:style.backgroundColor,
      radius:style.borderRadius,shadow:style.boxShadow};
  });
  if(result.background!=='rgb(198, 166, 242)')throw Error('Save reaction not primary lavender '+JSON.stringify(result));
  await page.screenshot({path:path.join(out,`${width}-${theme}-reaction-editor.png`),fullPage:true,animations:'disabled'});
  evidence.push({screen:'reaction-editor',width,theme,overflow:false,
    buttons:[{id:'nx-reaction-save',text:result.text,className:'btn-primary',background:result.background,
    radius:result.radius,shadow:result.shadow,disabled:false,visible:true}],error:null});
 }catch(err){evidence.push({screen:'reaction-editor',width,theme,overflow:false,buttons:[],error:String(err)});}
 await page.evaluate(()=>closeModal());


 // Stash final review action: reach step 3 using fictional fields, but NEVER save.
 try {
  const result=await page.evaluate(()=>{
    closeModal();tab='stash';render();
    document.querySelector('#qa-addkit')?.click();
    const modal=document.querySelector('.modal.nx-stash-kit-editor');
    if(!modal)throw Error('Add Kit modal not open');
    const sel=modal.querySelector('#sname');
    if(!sel)throw Error('Compound select missing');
    const val=[...sel.options].find(o=>o.value==='Retatrutide')?.value;
    if(!val)throw Error('Fictional Retatrutide not available in kit selector');
    sel.value=val;sel.dispatchEvent(new Event('change',{bubbles:true}));
    modal.querySelector('#stv').value='2';
    modal.querySelector('#svmg').value='10';
    const next=modal.querySelector('#nx-kit-next');
    next.click();next.click();
    const save=modal.querySelector('#ssave');
    if(!save||save.hidden||getComputedStyle(save).display==='none')
      throw Error('Did not reach visible Add to Stash final review');
    const style=getComputedStyle(save);
    return {text:save.textContent.trim(),background:style.backgroundColor,radius:style.borderRadius,
      shadow:style.boxShadow};
  });
  if(result.background!=='rgb(198, 166, 242)'||result.shadow!=='none')
    throw Error('Stash final Save CTA does not follow primary token '+JSON.stringify(result));
  await page.screenshot({path:path.join(out,`${width}-${theme}-stash-final-save.png`),fullPage:true,animations:'disabled'});
  evidence.push({screen:'stash-final-save',width,theme,overflow:false,
    buttons:[{id:'ssave',className:'nx-kit-editor-save',text:result.text,background:result.background,
      radius:result.radius,shadow:result.shadow,disabled:false,visible:true}],error:null});
 }catch(err){evidence.push({screen:'stash-final-save',width,theme,overflow:false,buttons:[],error:String(err)});}
 await page.evaluate(()=>closeModal());

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
 // Screenshot-specific primary actions and input focus: no persistent saves.
 const verifyNamed=async (name, setup, selector, expectedFocus=false)=>{
   try{
     await page.evaluate(()=>{closeModal();tab='home';render();});
     await page.evaluate(setup);
     const control=page.locator(selector).first();
     await control.waitFor({state:'visible',timeout:4000});
     if(expectedFocus)await control.focus();
     const style=await control.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {
       background:s.backgroundColor,backgroundImage:s.backgroundImage,shadow:s.boxShadow,
       color:s.color,radius:s.borderRadius,outline:s.outlineStyle,outlineOffset:s.outlineOffset,
       boxShadow:s.boxShadow,rect:{x:r.x,width:r.width},viewport:innerWidth
     }});
     if(expectedFocus){
       if(style.rect.x<0||style.rect.x+style.rect.width>width+1||style.boxShadow==='none')
         throw Error('Protocol Name focused field has no contained visible focus or overflows '+JSON.stringify(style));
     } else if(style.background!=='rgb(198, 166, 242)'||style.backgroundImage!=='none'||style.shadow!=='none')
       throw Error('Same-role primary treatment mismatch '+JSON.stringify(style));
     await page.screenshot({path:path.join(out,`${width}-${theme}-${name}.png`),animations:'disabled'});
     evidence.push({screen:name,width,theme,overflow:false,buttons:[{id:selector,background:style.background,radius:style.radius,shadow:style.shadow}],error:null});
   }catch(err){evidence.push({screen:name,width,theme,overflow:false,buttons:[],error:String(err)});}
   finally{await page.evaluate(()=>closeModal());}
 };
 await verifyNamed('protocol-wizard-continue',()=>protocolBuilderModal(), '#pb-next');
 await verifyNamed('onboarding-next',()=>showOnboarding(), '#ob-next');
 await verifyNamed('stash-wizard-continue',()=>{tab='stash';render();document.querySelector('#qa-addkit')?.click()}, '#nx-kit-next');
 await verifyNamed('log-reconstitution',()=>{
   const s=state.supplies.find(x=>!x.isBlend && x.name);
   if(!s)throw Error('Fictional single compound kit missing');
   openNewVialModal(s.id);
 }, '#rvsave');
 await verifyNamed('protocol-name-focus',()=>{
   protocolBuilderModal();
   for(let i=0;i<5;i++)document.querySelector('#pb-next')?.click();
 }, '#pb-name',true);
 // Nested Stash outflow role checks: purely fictional record, no Save/Log clicks.
 try {
   const result=await page.evaluate(()=>{
     closeModal();
     const kit=state.supplies.find(x=>!x.isBlend);
     if(!kit)throw Error('No fictional Stash kit');
     kit.wasteLog=kit.wasteLog||[];
     const tx={id:'ds2-audit-fictional-outflow',mg:1,reason:'fictional QA',date:localDate(),notes:''};
     kit.wasteLog.push(tx);
     editOutflowModal(kit.id,tx.id);
     const btn=document.querySelector('#eo-save');
     if(!btn)throw Error('Edit Outflow Save missing');
     const cs=getComputedStyle(btn);
     return {background:cs.backgroundColor,image:cs.backgroundImage,shadow:cs.boxShadow};
   });
   if(result.background!=='rgb(198, 166, 242)'||result.image!=='none'||result.shadow!=='none')
     throw Error('Edit Outflow Save semantic mismatch '+JSON.stringify(result));
   await page.screenshot({path:path.join(out,`${width}-${theme}-stash-edit-outflow.png`),animations:'disabled'});
   evidence.push({screen:'stash-edit-outflow',width,theme,overflow:false,buttons:[{id:'eo-save',background:result.background,shadow:result.shadow}],error:null});
 }catch(err){evidence.push({screen:'stash-edit-outflow',width,theme,overflow:false,buttons:[],error:String(err)});}
 finally{await page.evaluate(()=>{closeModal();const kit=state.supplies.find(x=>!x.isBlend);if(kit)kit.wasteLog=(kit.wasteLog||[]).filter(x=>x.id!=='ds2-audit-fictional-outflow');});}
 try {
   await page.evaluate(()=>{const kit=state.supplies.find(x=>!x.isBlend);if(!kit)throw Error('Missing fictional kit');logWasteModal(kit.id);});
   await page.locator('#waste-save').waitFor({state:'visible',timeout:4000});
   const warn=await page.locator('#waste-save').evaluate(el=>{const s=getComputedStyle(el);return {background:s.backgroundColor,color:s.color,image:s.backgroundImage,shadow:s.boxShadow};});
   if(warn.background!=='rgb(166, 44, 74)'||warn.color!=='rgb(255, 255, 255)'||warn.image!=='none'||warn.shadow!=='none')
     throw Error('Outflow danger role incorrect '+JSON.stringify(warn));
   await page.screenshot({path:path.join(out,`${width}-${theme}-stash-log-outflow.png`),animations:'disabled'});
   evidence.push({screen:'stash-log-outflow',width,theme,overflow:false,buttons:[],error:null});
 }catch(err){evidence.push({screen:'stash-log-outflow',width,theme,overflow:false,buttons:[],error:String(err)});}
 finally{await page.evaluate(()=>closeModal());}
 // Blend Kit action parity: inspect Finish Kit confirmation + cancellation without committing.
 try {
   const result=await page.evaluate(()=>{
     closeModal();
     let kit=(state.supplies||[]).find(k=>k.isBlend);
     if(!kit){
       kit={id:'ds2-fictional-blend-only',name:'QA Blend',isBlend:true,
         composition:[{compound:'A',mg:5},{compound:'B',mg:5}],vialMg:10,totalVials:1,
         vials:[{id:'ds2-fictional-vial',status:'sealed',vialMg:10,remainingMg:10}],
         doseLog:[],wasteLog:[],reconHistory:[]};
       state.supplies.push(kit);
       window.__ds2BlendFixtureId=kit.id;
     }
     kit.kitStatus=null;
     manageKitMenu(kit.id);
     const entry=document.querySelector('[data-action="blend-finish-kit"]');
     if(!entry)throw Error('Blend Finish This Kit menu action missing');
     entry.click();
     const cancel=document.querySelector('#ca-cancel');
     const confirm=document.querySelector('#ca-ok');
     if(!cancel||!confirm||!confirm.textContent.includes('Finish kit'))throw Error('Blend finish confirmation controls missing');
     const before=JSON.stringify(kit.doseLog||[]);
     cancel.click();
     if(kit.kitStatus==='done'||JSON.stringify(kit.doseLog||[])!==before)throw Error('Cancel mutated blend history/state');
     return {cancelled:true};
   });
   if(!result.cancelled)throw Error('Blend Finish Kit cancel did not work');
   evidence.push({screen:'blend-finish-kit-cancel',width,theme,overflow:false,buttons:[],error:null});
 }catch(err){evidence.push({screen:'blend-finish-kit-cancel',width,theme,overflow:false,buttons:[],error:String(err)});}
 finally{await page.evaluate(()=>{closeModal();if(window.__ds2BlendFixtureId){state.supplies=state.supplies.filter(k=>k.id!==window.__ds2BlendFixtureId);delete window.__ds2BlendFixtureId;}});}
 // Blend outflow cancellation: no physical ledger entries or saved history.
 try{
   const result=await page.evaluate(()=>{
     closeModal();const kit=(state.supplies||[]).find(k=>k.isBlend);
     if(!kit)return {skipped:'No fictional blend fixture'};
     const v=getActiveVial(kit);
     if(!v)return {skipped:'No open fictional blend vial'};
     const before=(kit.wasteLog||[]).length;
     blendLogOutflowModal(kit.id);
     const cancel=document.querySelector('#blend-out-cancel');
     if(!cancel)throw Error('Blend Log Outflow cancel missing');
     cancel.click();
     if((kit.wasteLog||[]).length!==before)throw Error('Blend outflow cancelled yet waste history changed');
     return {cancelled:true};
   });
   evidence.push({screen:'blend-outflow-cancel',width,theme,overflow:false,buttons:[],error:null,fixture:result});
 }catch(err){evidence.push({screen:'blend-outflow-cancel',width,theme,overflow:false,buttons:[],error:String(err)});}
 finally{await page.evaluate(()=>closeModal());}
 // Isolated blend balance correction: use a local fictional kit, never call Save.
 try {
   const test=await page.evaluate(()=>{
     closeModal();
     const id='ds2-balance-fixture';
     const kit={id,name:'Fictional Balance Blend',isBlend:true,kitStatus:null,
       vialMg:10,totalVials:1,openedVials:1,emptyVials:0,activeKit:true,
       reconDate:localDatetime(),composition:[{compound:'A',mg:7},{compound:'B',mg:3}],
       vials:[{id:'ds2-balance-vial',status:'open',vialMg:10,remainingMg:10,reconDate:localDatetime(),composition:[{compound:'A',mg:7},{compound:'B',mg:3}]}],
       doseLog:[],wasteLog:[],balanceCorrections:[]};
     state.supplies.push(kit);
     const initial=getBlendOpenVialRemainingMg(kit);
     kit.balanceCorrections.push({id:'ds2-correction',vialId:'ds2-balance-vial',mg:2,status:'active'});
     const after=getBlendOpenVialRemainingMg(kit);
     const total=getBlendKitRemainingMg(kit);
     kit.doseLog.push({id:'ds2-draw',vialId:'ds2-balance-vial',date:localDatetime(),totalMgDrawn:3,kind:'administered'});
     const drawn=getBlendOpenVialRemainingMg(kit);
     const recipe=JSON.stringify(kit.vials[0].composition);
     kit.balanceCorrections[0].status='reversed';
     const reversed=getBlendOpenVialRemainingMg(kit);
     state.supplies=state.supplies.filter(k=>k.id!==id);
     return {initial,after,total,drawn,reversed,recipe};
   });
   if(Math.abs(test.initial-10)>.001||Math.abs(test.after-12)>.001||Math.abs(test.total-12)>.001||
      Math.abs(test.drawn-9)>.001||Math.abs(test.reversed-7)>.001||!test.recipe.includes('A'))
      throw Error('Blend correction math/reversal check failed: '+JSON.stringify(test));
   evidence.push({screen:'blend-correct-balance-math',width,theme,overflow:false,buttons:[],error:null});
 }catch(err){evidence.push({screen:'blend-correct-balance-math',width,theme,overflow:false,buttons:[],error:String(err)});}
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
 ['stash-add-kit','nx-kit-next'],
 ['today-dose-chooser','today-dose-single'],
 ['protocol-first-log','protocol-first-log'],
 ['reaction-editor','nx-reaction-save'],
 ['stash-final-save','ssave']
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
