import fs from 'node:fs'; import path from 'node:path'; import {chromium} from 'playwright';
const VERSION='v0.9.14-beta',demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');if(!fs.existsSync(demo))throw Error('Demo missing');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),results=[];const ensure=(x,msg)=>{if(!x)throw Error(msg)};
try { for(const mode of ['live','demo'])for(const width of [320,390])for(const theme of ['light','dark']){
 const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(mode==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
 await page.evaluate(t=>{state=buildDemoState('weight_loss');state.profile.onboardingDone=true;state.plans={goals:[{id:'g',name:'Fictional goal',category:'Recovery',status:'active',notes:'Fictional note',compounds:['Retatrutide']}],research:[{id:'r',compound:'Selank',status:'researching',reason:'Fictional research note',notes:'Research notes'}],shopping:[{id:'s',item:'Fictional supply',status:'needed',category:'supply'}]};state._plansSub='research';document.documentElement.dataset.theme=t;tab='plans';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());},theme);
 ensure(await page.locator('.nx-plan-head').count()===1,'Research header missing');
 ensure(await page.locator('.nx-plan-head .compound-intel-btn').count()===0,'Intel still crowded in header');
 ensure(await page.locator('.nx-plan-secondary .compound-intel-btn').count()===1,'Research Intel lost');
 ensure(await page.locator('.nx-plan-head .manage-plan-btn').evaluate(e=>e.getBoundingClientRect().height)>=44,'Ellipsis touch target too small');
 await page.locator('.nx-plan-head .manage-plan-btn').click();
 ensure(await page.locator('#pm-edit').count()===1,'Manage existing editor missing');
 await page.locator('#x').click();
 await page.evaluate(()=>{state._plansSub='goals';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());});
 ensure(await page.locator('.nx-plan-item details>summary').count()>=1,'Goal disclosure missing');
 const summary=page.locator('.nx-plan-item details>summary').first();
 ensure(await summary.evaluate(e=>e.getBoundingClientRect().height)>=44,'Goal disclosure too small');
 await summary.click();
 ensure(await page.locator('.nx-plan-item details').first().evaluate(e=>e.open),'Goal disclosure did not open');
 await page.evaluate(()=>{state._plansSub='shopping';render();document.querySelectorAll('.modal-bg').forEach(x=>x.remove());});
 ensure(await page.locator('.nx-shopping-row .manage-plan-btn').count()===1,'Shopping edit menu lost');
 ensure(errors.length===0,'Exceptions: '+errors.join('; '));
 results.push({mode,width,theme,status:'PASS'});await ctx.close();
}}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_PLANS_QA.json',JSON.stringify({version:VERSION,results},null,2));console.log('Plans hierarchy QA PASS: '+results.length);
