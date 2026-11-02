/* Real Chromium two-tab shared-key safety regression.
 * Execute from GitHub Actions with a static server on 8777 and Playwright installed.
 * Uses fictional fixtures, isolated browser context, no production URL or user data.
 */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const ORIGIN='http://127.0.0.1:8777/';
const KEY='peptide-tracker-html-v1';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext();
  const a=await context.newPage(),b=await context.newPage();
  await Promise.all([a.goto(ORIGIN),b.goto(ORIGIN)]);
  await Promise.all([a.addScriptTag({url:ORIGIN+'assets/js/nexus-write-coordinator.js'}),b.addScriptTag({url:ORIGIN+'assets/js/nexus-write-coordinator.js'})]);
  const fixture={supplies:[{id:'KIT',vials:[{id:'V1',remainingMg:10}]}],settings:{theme:'dark',reminders:false},supplementLogs:[{id:'H1',date:'2026-11-01',taken:['fictional']}],peptides:{Fictional:{doses:[]}}};
  await a.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:KEY,value:fixture});
  const init=async page=>page.evaluate(key=>{
   const snapshot=localStorage.getItem(key);
   window.__tabState=JSON.parse(snapshot);
   window.__writer=NexusWriteCoordinator.create({
    read:()=>localStorage.getItem(key),write:x=>localStorage.setItem(key,x),
    lock:(name,fn)=>navigator.locks.request(name,{mode:'exclusive'},fn),
    lockName:key+':inventory-transfer',initialSnapshot:snapshot
   });
  },KEY);
  await Promise.all([init(a),init(b)]);
  // Tab A holds the actual Web Lock until signalled; B must queue, then fail stale.
  const inventory=a.evaluate(async()=>{
   window.__inventoryPromise=window.__writer.transaction(window.__tabState,async next=>{
    window.__inventoryHeld=true;
    await new Promise(resolve=>window.__releaseInventory=resolve);
    next.supplies[0].vials[0].remainingMg=8;
    next.peptides.Fictional.doses.push({id:'D1',dose:2});
    return {next};
   });
   const result=await window.__inventoryPromise;window.__tabState=result.next;
   return {ok:true};
  });
  await a.waitForFunction(()=>window.__inventoryHeld===true);
  const settings=b.evaluate(async()=>{
   try{
    const r=await window.__writer.transaction(window.__tabState,next=>{
     next.settings.theme='light';return {next};
    });
    window.__tabState=r.next;return {ok:true};
   }catch(e){return {ok:false,error:String(e.message)}}
  });
  await pause(200);
  const before=await b.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
  assert.equal(before.settings.theme,'dark','Tab B must not write during held inventory lock');
  await a.evaluate(()=>window.__releaseInventory());
  assert.deepEqual(await inventory,{ok:true});
  const stale=await settings;
  assert.equal(stale.ok,false,'Stale settings tab must not acknowledge success');
  assert.match(stale.error,/changed|blocked|reload/i);
  let saved=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
  assert.equal(saved.supplies[0].vials[0].remainingMg,8);
  assert.equal(saved.peptides.Fictional.doses.length,1);
  assert.equal(saved.settings.theme,'dark');
  // Fresh tab can commit a setting without overwriting stock/history.
  await init(b);
  const good=await b.evaluate(async()=>{
   const r=await window.__writer.transaction(window.__tabState,next=>{
    next.settings.theme='light';return {next};
   });
   window.__tabState=r.next;return true;
  });
  assert.equal(good,true);
  saved=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
  assert.equal(saved.supplies[0].vials[0].remainingMg,8);
  assert.equal(saved.settings.theme,'light');
  // Fresh history edit; concurrent stale inventory sees rejection, and history survives.
  await Promise.all([init(a),init(b)]);
  const history=a.evaluate(async()=>{
   const r=await window.__writer.transaction(window.__tabState,next=>{
    next.supplementLogs.push({id:'H2',date:'2026-11-02',taken:['fictional supplement']});
    return {next};
   });window.__tabState=r.next;return true;
  });
  const competing=b.evaluate(async()=>{
   try{
    const r=await window.__writer.transaction(window.__tabState,next=>{
     next.supplies[0].vials[0].remainingMg=1;return {next};
    });
    window.__tabState=r.next;return {ok:true};
   }catch(e){return {ok:false,error:e.message}}
  });
  const outcomes=await Promise.all([history,competing]);
  // Whichever wins the lock may commit; the other must reject (no lost update).
  const snapshot=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
  assert.ok(!(outcomes[0]===true&&outcomes[1].ok===true),'Two stale full-state snapshots cannot both commit');
  assert.equal(snapshot.settings.theme,'light');
  assert.equal(snapshot.peptides.Fictional.doses.length,1);
  if(outcomes[0])assert.ok(snapshot.supplementLogs.some(x=>x.id==='H2'));
  if(outcomes[1].ok)assert.equal(snapshot.supplies[0].vials[0].remainingMg,1);
  // Explicit failed-write acknowledgement: quota failure cannot swap in-memory state.
  await init(a);
  const failed=await a.evaluate(key=>async function(){
   const prior=JSON.stringify(window.__tabState);
   const writer=NexusWriteCoordinator.create({
    read:()=>localStorage.getItem(key),write:()=>{throw Error('fictional quota exceeded')},
    lock:(name,fn)=>navigator.locks.request(name,{mode:'exclusive'},fn),
    lockName:key+':inventory-transfer',initialSnapshot:localStorage.getItem(key)
   });
   try{const r=await writer.transaction(window.__tabState,next=>{next.settings.theme='invalid';return {next}});
    window.__tabState=r.next;return {ok:true};
   }catch(e){return {ok:false,unchanged:prior===JSON.stringify(window.__tabState),blocked:writer.status().blocked}}
  }(),KEY);
  assert.deepEqual(failed,{ok:false,unchanged:true,blocked:true});
  const after=await b.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
  assert.deepEqual(after,snapshot,'Failed write must leave shared data unchanged');
  console.log('PASS Chromium real two-tab exclusive locking, stale rejection, durable fresh save, stock/history/settings preservation, failed write');
  await context.close();
 }finally{await browser.close()}
})().then(()=>{
 // Run the real application-handler prepared-dose Undo regression in the SAME
 // required Chromium CI job. The separate script uses fresh fictional browser
 // contexts and the already running 8777 static server; failures fail this job.
 require('node:child_process').execFileSync(process.execPath,['tools/validate-cross-tab-lock.mjs'],{stdio:'inherit'});
}).catch(e=>{console.error(e);process.exitCode=1});
