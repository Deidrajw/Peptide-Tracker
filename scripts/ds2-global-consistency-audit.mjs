/** Nexus DS2 cross-app visual-token inventory. Localhost + fictional state ONLY.
 * Records actual computed styles; nonmatching values are candidates, not automatic defects.
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.NEXUS_AUDIT_URL||'http://127.0.0.1:4173';
if(!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(base))throw Error('Local-only: refusing remote host');
const root='artifacts/ds2-global-consistency';
await fs.mkdir(root,{recursive:true});
const views=[
 ['Today','home'],['Calendar','calendar'],['Plans','plans'],['Protocols','protocols'],['Stash','stash'],['Stash Supplies','stash'],
 ['Trends','trends'],['Ask','amino','chat'],['Journal','amino','journal'],
 ['Learn','amino','learn'],['Explore','amino','explore'],
 ['Profile','profile',null,'profile'],['Settings','profile',null,'settings'],
 ['Supplements','profile',null,'supplements'],
 ...['reminders','phasereminders','units','health','privacy','backup','datamanagement','usage','developer','appupdates']
 .map(x=>['Settings '+x,'profile',null,'settings',x])
];
const browser=await chromium.launch({headless:true});
const observations=[],errors=[];
for(const width of [320,390])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:740},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await context.addInitScript(()=>{try{localStorage.clear()}catch{}});
 const page=await context.newPage();
 page.on('pageerror',err=>errors.push({width,theme,pageError:String(err)}));
 try{
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.render==='function'&&typeof window.enterDemoMode==='function',{timeout:20000});
  const fixture=await page.evaluate(()=>{
   state.profile.onboardingDone=true;
   state.settings.lastSeenChangelog=CURRENT_CHANGELOG_VERSION;
   closeModal();enterDemoMode('weight_loss');render();
   return {demo:isDemoMode(),kits:state.supplies?.length||0,checkins:state.dailyLogs?.length||0};
  });
  if(!fixture.demo||!fixture.kits||!fixture.checkins)throw Error('Fictional data guard failed '+JSON.stringify(fixture));
  for(const [name,pageTab,sub,profile,detail] of views){
   try{
    await page.evaluate(({name,pageTab,sub,profile,detail,theme})=>{
     document.documentElement.dataset.theme=theme;
     closeModal();tab=pageTab;
     if(sub)state._aminoSub=sub;
     if(profile)state._profileTab=profile;
     if(pageTab==='stash')state._stashSub=name==='Stash Supplies'?'equipment':'kits';
     state._settingsDetail=detail||null;
     state._guideOpen=null;state._discoverOpen=null;render();
    },{name,pageTab,sub,profile,detail,theme});
    await page.waitForTimeout(60);
    const report=await page.evaluate(()=>{
     const isVisible=e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);
      return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};
     const label=e=>(e.innerText||e.getAttribute('aria-label')||e.getAttribute('title')||'').trim().replace(/\s+/g,' ').slice(0,80);
     const info=(e,role)=>{let s=getComputedStyle(e),r=e.getBoundingClientRect();
      return {role,tag:e.tagName,id:e.id||'',cls:typeof e.className==='string'?e.className.slice(0,110):'',
       label:label(e),font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,
       bg:s.backgroundColor,fg:s.color,border:s.borderColor,radius:s.borderRadius,
       width:Math.round(r.width),height:Math.round(r.height),disabled:!!e.disabled,
       aria:e.getAttribute('aria-label')||'',location:Math.round(r.top)}};
     const selectors=[
      ['title','h1,.nx2-page-title,.page-title'],['heading','h2,h3,.section-title,.card-title'],
      ['body','p,.sub,.hint,.description'],['label','label,.field-label'],
      ['metric','.mono,.metric,.stat-val,.nx2-metric'],['button','button,[role="button"]'],
      ['input','input,select,textarea'],['dialog','[role="dialog"],.modal,.sheet,.bottom-sheet,.nx-sheet']
     ];
     let all=[];
     for(const [role,selector] of selectors)for(const el of document.querySelectorAll('#app '+selector))
      if(isVisible(el))all.push(info(el,role));
     return {overflow:document.documentElement.scrollWidth>innerWidth+2,items:all,modalVisible:
      [...document.querySelectorAll('#app [role="dialog"],#app .modal,#app .sheet')].filter(isVisible).length};
    });
    // Auditable regressions for confirmed 44px tap targets and descriptive action names.
    // A DOM/computed check is distinct from later real iPhone VoiceOver acceptance.
    if(['Calendar','Plans','Stash','Settings appupdates','Settings reminders','Settings phasereminders','Learn','Profile','Today'].includes(name)){
      const violations=await page.evaluate(screen=>{
        const errors=[];
        const required=screen==='Calendar'?['cal-prev','cal-next','theme-toggle','profile-btn']:
          screen==='Plans'||screen==='Stash'?['theme-toggle','profile-btn']:
          screen==='Settings appupdates'?['au-back']:[];
        for(const id of required){
          const el=document.getElementById(id);
          if(!el){errors.push('missing '+id);continue}
          const rect=el.getBoundingClientRect();
          if(rect.width<43.5||rect.height<43.5)errors.push(id+' target '+Math.round(rect.width)+'x'+Math.round(rect.height));
        }
        // Phase 2: test only visible secondary actions; mutually exclusive
        // reminder buttons vary by saved fixture state.
        const extra=screen==='Settings reminders'?['enablerem','disablerem']:
          screen==='Settings phasereminders'?['enablephaserem','disablephaserem']:
          screen==='Stash'?['qa-addkit']:
          screen==='Profile'?['timeline-toggle']:
          screen==='Learn'?['ls-guides','ls-mixing','ls-calc']:[];
        for(const id of extra){
          const el=document.getElementById(id);
          if(!el)continue;
          const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
          if(style.display==='none'||style.visibility==='hidden'||rect.width===0)continue;
          if(rect.height<43.5)errors.push(id+' secondary target height '+Math.round(rect.height));
        }
        if(screen==='Settings appupdates' && document.getElementById('au-back')?.getAttribute('aria-label')!=='Back to Settings')errors.push('App Updates Back missing contextual accessible name');
        if(screen==='Calendar'){
          for(const [id,text] of [['cal-prev','Previous calendar month'],['cal-next','Next calendar month']])
            if(document.getElementById(id)?.getAttribute('aria-label')!==text)
              errors.push('missing contextual name '+id);
        }
        if(screen==='Today'){
          const buttons=[...document.querySelectorAll('.nx-daily-tracking .nx-track-action')];
          if(buttons.length!==4)errors.push('expected four daily tracking actions, got '+buttons.length);
          for(const btn of buttons){
            const name=btn.getAttribute('aria-label')||'';
            if(!/^(Log|Edit|Update) (Daily check-in|Supplements|Weight|Nutrition)$/.test(name))
              errors.push('ambiguous daily activity action '+name);
          }
        }
        return errors;
      },name);
      if(violations.length)throw Error('A11Y scoped target regression: '+violations.join('; '));
    }
    // Approved font-family decision (2026-11-04): ensure actual computed
    // family roles across every route and both iPhone viewport widths.
    const typeErrors=await page.evaluate(screen=>{
      const errors=[],font=el=>getComputedStyle(el).fontFamily;
      const contains=(el,value)=>el&&font(el).includes(value);
      if(!contains(document.body,'DM Sans'))errors.push('body does not use DM Sans');
      const root=document.querySelector('#app');
      if(root&&!contains(root,'DM Sans'))errors.push('application root does not use DM Sans');
      for(const el of document.querySelectorAll('#app :is(.nx2-page-title,.page-title,.serif)')){
        const rect=el.getBoundingClientRect();
        if(rect.width>0&&rect.height>0&&!contains(el,'Fraunces'))
          errors.push('editorial title missing Fraunces: '+(el.className||el.tagName));
      }
      for(const el of document.querySelectorAll('#app .mono:not(.nx-technical-value):not(.nx-mono-number)')){
        const rect=el.getBoundingClientRect();
        if(rect.width>0&&rect.height>0&&!contains(el,'DM Sans'))
          errors.push('categorical .mono missing DM Sans: '+(el.textContent||'').trim().slice(0,32));
        if(errors.length>20)break;
      }
      // Technical measurements must retain the explicitly approved DM Mono role.
      // Check rendered values only: hidden review stages and inactive sheets are not visible UI.
      for(const el of document.querySelectorAll('#app :is(.nx-technical-value,.nx-mono-number,#pd-count,.nx-cal-weight,.nx-dose-confirm-hero strong)')){
        const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
        if(rect.width>0&&rect.height>0&&style.visibility!=='hidden'&&style.display!=='none'&&!contains(el,'DM Mono'))
          errors.push('technical numeric value missing DM Mono: '+(el.id||el.className||el.tagName));
      }
      for(const el of document.querySelectorAll('#app :is(button,input,textarea,select)')){
        const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
        if(rect.width>0&&rect.height>0&&style.visibility!=='hidden'&&style.display!=='none'&&!contains(el,'DM Sans'))
          errors.push('interactive control missing DM Sans: '+(el.id||el.tagName));
        if(errors.length>20)break;
      }
      for(const el of document.querySelectorAll('#app .nx-category-eyebrow')){
        const rect=el.getBoundingClientRect();
        if(rect.width>0&&rect.height>0&&parseFloat(getComputedStyle(el).fontSize)<10.5)
          errors.push('category eyebrow under 11px');
      }
      for(const el of document.querySelectorAll('#app :is(.nx-daily-track-note,.nx-cal-hub p,.nx-cal-hub-note,.nx2-supp-catalogue-note,.nx-explanatory-copy,.nx-health-source p)')){
        const rect=el.getBoundingClientRect();
        if(rect.width>0&&rect.height>0&&parseFloat(getComputedStyle(el).fontSize)<12.5)
          errors.push('explanatory copy under 13px '+(el.className||el.tagName));
      }
      if(screen==='Stash Supplies'){
        const cards=[...document.querySelectorAll('#app .nx-supply-kit-card')];
        if(!cards.length)errors.push('fictional Supplies fixture missing');
        for(const card of cards){
          const amount=card.querySelector('.nx-supply-quantity-number');
          if(!amount)continue; // Sealed supplies intentionally have no numeric remaining balance.
          const context=card.querySelector('.nx-supply-quantity-context');
          const label=card.querySelector('.nx-kit-overview-label');
          const notes=[...card.querySelectorAll('.nx-supply-subtle')];
          if(!contains(amount,'DM Mono'))errors.push('supply quantity missing DM Mono');
          if(!contains(context,'DM Sans')||getComputedStyle(context).letterSpacing!=='normal')
            errors.push('supply context family/spacing mismatch');
          if(!label||parseFloat(getComputedStyle(label).fontSize)<10.5)
            errors.push('supply eyebrow under 11px');
          for(const note of notes)
            if(parseFloat(getComputedStyle(note).fontSize)<12.5)
              errors.push('supply explanatory copy under 13px');
        }
      }
      if(screen==='Journal'){
        for(const el of document.querySelectorAll('#app :is(.nx-journal-search-label,.nx-journal-filter-label)'))
          if(parseFloat(getComputedStyle(el).fontSize)<12.5)errors.push('journal label under 13px');
      }
      return errors;
    },name);
    if(typeErrors.length)throw Error('DS2 approved font-role regression: '+typeErrors.join('; '));
    observations.push({width,theme,screen:name,tab:pageTab,overflow:report.overflow,items:report.items,modalVisible:report.modalVisible});
    await page.screenshot({path:path.join(root,`${width}-${theme}-${name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.png`),fullPage:true,animations:'disabled'});
   }catch(err){errors.push({width,theme,screen:name,error:String(err)});}
  }
  // Explicit known safe openers; screenshots of dialogs must reflect actual rendered state.
  for(const opener of [
   {screen:'Today Log Dose',tab:'home',selector:'#today-log-dose'},
   {screen:'Plans Add Goal',tab:'plans',selector:'#add-goal'},
   {screen:'Stash Add Kit',tab:'stash',selector:'#qa-addkit'},
   {screen:'Trends Pattern',tab:'trends',selector:'#nx-open-pattern'},
   {screen:'Trends Symptom Timing',tab:'trends',selector:'#nx-open-symptom-timing'}
  ]){
   try{
    await page.evaluate(({tab:pageTab,profile,detail,theme})=>{
     closeModal();document.documentElement.dataset.theme=theme;tab=pageTab;
     // The previous screen may have left Stash in Supplies. Modal checks need Vial kits.
     if(pageTab==='stash')state._stashSub='kits';
     if(profile)state._profileTab=profile;state._settingsDetail=detail||null;render();
    },{...opener,pageTab:opener.tab,theme});
    const el=page.locator(opener.selector).first();
    if(!(await el.count())||!(await el.isVisible())){errors.push({width,theme,screen:opener.screen,status:'NOT_REACHED',selector:opener.selector});continue}
    await el.click({timeout:5000});
    await page.waitForTimeout(100);
    const stats=await page.evaluate(()=>{
     let candidates=[...document.querySelectorAll('.sheet,.modal,[role="dialog"],.nx2-sheet')].filter(e=>{
      const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden';
     });
     return {candidates:candidates.map(e=>({cls:typeof e.className==='string'?e.className:'',text:e.innerText.slice(0,120),
      scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,rect:(()=>{let r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,width:r.width}})(),
      buttons:[...e.querySelectorAll('button')].slice(0,15).map(b=>{let s=getComputedStyle(b),r=b.getBoundingClientRect();return {label:(b.innerText||b.getAttribute('aria-label')||'').slice(0,60),font:s.fontFamily,size:s.fontSize,width:r.width,height:r.height}})}))};
    });
    observations.push({width,theme,screen:opener.screen,opener:opener.selector,dialogs:stats.candidates});
    await page.screenshot({path:path.join(root,`${width}-${theme}-dialog-${opener.screen.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.png`),fullPage:true,animations:'disabled'});
   }catch(err){errors.push({width,theme,screen:opener.screen,error:String(err)});}
  }
 }catch(err){errors.push({width,theme,setupError:String(err)});}
 await context.close();
}
await browser.close();
const aggregate={baseline:'main 755dea5eed417c1515543779fd81be77b6a504de',matrix:[320,390],themes:['light','dark'],
states:observations.length,errors,observations};
await fs.writeFile(path.join(root,'computed-style-inventory.json'),JSON.stringify(aggregate,null,2));
const summarized={states:observations.length,failures:errors.length,failuresByType:errors.reduce((o,e)=>(o[e.status||'error']=(o[e.status||'error']||0)+1,o),{}),
overflow:observations.filter(x=>x.overflow).map(x=>({screen:x.screen,width:x.width,theme:x.theme})),
typography:Object.fromEntries(['title','heading','body','label','metric','button'].map(role=>{
 const arr=observations.flatMap(x=>x.items||[]).filter(x=>x.role===role);
 return [role,{sampleCount:arr.length,fontStacks:[...new Set(arr.map(x=>x.font))],sizes:[...new Set(arr.map(x=>x.size))].sort()}];
}))};
await fs.writeFile(path.join(root,'summary.json'),JSON.stringify(summarized,null,2));
console.log(JSON.stringify(summarized,null,2));
// CI must fail on ANY captured assertion/opening failure, not just setup/page errors.
// An informational summary with failed screens must never produce a green check.
if(errors.length || summarized.overflow.length)process.exitCode=1;
