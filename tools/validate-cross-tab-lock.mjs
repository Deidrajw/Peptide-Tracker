import {chromium} from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try{
 const context=await browser.newContext();
 const a=await context.newPage(),b=await context.newPage();
 await Promise.all([
   a.goto("http://127.0.0.1:8777/",{waitUntil:"domcontentloaded"}),
   b.goto("http://127.0.0.1:8777/",{waitUntil:"domcontentloaded"})
 ]);
 const fixture="__nexus_pr124_exclusive_fixture__";
 await a.evaluate(key=>localStorage.setItem(key,JSON.stringify({count:0,source:"fictional"})),fixture);
 const initialize=key=>{
   const read=()=>localStorage.getItem(key);
   window.__coordinator=NexusWriteCoordinator.create({
     read,write:x=>localStorage.setItem(key,x),
     initialSnapshot:read(),
     lock:(name,action)=>navigator.locks.request(name,{mode:"exclusive"},action),
     lockName:"nexus-pr124-browser-cross-tab-test"
   });
 };
 await a.evaluate(initialize,fixture);
 await b.evaluate(initialize,fixture);
 await a.evaluate(key=>{
   window.__txEntered=false;
   window.__txRelease=null;
   window.__txWait=new Promise(resolve=>window.__txRelease=resolve);
   window.__txResult=window.__coordinator.transaction(JSON.parse(localStorage.getItem(key)),async prior=>{
     window.__txEntered=true;
     await window.__txWait;
     return {next:{...prior,count:prior.count+1}};
   });
 },fixture);
 await a.waitForFunction(()=>window.__txEntered===true,{timeout:10000});
 await b.evaluate(key=>{
   window.__txFinished=false;
   window.__txResult=window.__coordinator.transaction(JSON.parse(localStorage.getItem(key)),prior=>{
     return {next:{...prior,count:prior.count+1}};
   }).then(()=>{window.__txFinished="saved"},err=>{window.__txFinished="rejected:"+err.message});
 },fixture);
 await b.waitForTimeout(200);
 assert.equal(await b.evaluate(()=>window.__txFinished),false,"Second tab committed while first tab held Web Lock");
 await a.evaluate(()=>window.__txRelease());
 await a.evaluate(()=>window.__txResult);
 await b.waitForFunction(()=>window.__txFinished!==false,{timeout:10000});
 const second=await b.evaluate(()=>window.__txFinished);
 assert.match(second,/^rejected:/,"Stale second tab must be rejected after lock handoff");
 const count=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)).count,fixture);
 assert.equal(count,1,"Exactly one atomic inventory commit expected");
 const source=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)).source,fixture);
 assert.equal(source,"fictional");
 await a.evaluate(key=>localStorage.removeItem(key),fixture);
 console.log("PASS: real Chromium cross-tab Web Lock serialized exclusive writers; stale second transaction rejected, fictional source preserved");
 // Exercise the actual Stash form event handler in a fictional localhost
 // profile, not merely the coordinator's pure transaction API.
 await a.evaluate(()=>{
   state=buildDemoState("weight_loss");
   state.profile.onboardingDone=true;
   _demoActive=false;
   localStorage.setItem(STORE_KEY,JSON.stringify(state));
   _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);
   _nexusSharedWriter=null;
   supplyModal(null,null);
 });
 // Real UI runtime must reject the prepared nasal path while the shared
 // synchronous writer migration is incomplete, without altering fictional stock.
 const disabled=await a.evaluate(async()=>{
   const before=JSON.stringify(state),durable=localStorage.getItem(STORE_KEY);
   let error="";
   try{
     await nexusCommitPreparedNasalOperation({type:"dose",tx:{id:"fixture",doseId:"fixture-dose"}});
   }catch(e){error=e.message}
   return {error,sameState:before===JSON.stringify(state),sameDurable:durable===localStorage.getItem(STORE_KEY)};
 });
 assert.match(disabled.error,/disabled pending shared-writer/,"Prepared nasal must remain release-gated in actual app runtime");
 assert.equal(disabled.sameState,true,"Gated prepared nasal operation mutated live state");
 assert.equal(disabled.sameDurable,true,"Gated prepared nasal operation wrote saved stock");
 await a.locator('[data-kit-form="capsule-bottle"]').click();
 await a.locator('#nx-form-name').fill('Fictional Exclusive Capsule');
 await a.locator('#nx-form-count').fill('12');
 await a.locator('#nx-form-strength').fill('5');
 await a.locator('#nx-form-save').click();
 await a.waitForFunction(()=>state.formulationStocks?.some(s=>s.compound==="Fictional Exclusive Capsule"),{timeout:10000});
 const saved=await a.evaluate(()=>({
   stock:JSON.parse(localStorage.getItem(STORE_KEY)).formulationStocks.find(s=>s.compound==="Fictional Exclusive Capsule"),
   inMemory:state.formulationStocks.find(s=>s.compound==="Fictional Exclusive Capsule"),
   pending:nexusWriter().status().inFlight
 }));
 assert.equal(saved.stock.remainingCount,12);
 assert.equal(saved.inMemory.remainingCount,12);
 assert.equal(saved.pending,false);
 console.log("PASS: actual Stash formulation Save uses exclusive transaction, persists fictional capsule and leaves no pending write");

 // Exercise the actual Add to Open Vial UI with FICTIONAL data using durable
 // localhost storage and a real browser Web Lock. No production user records.
 await a.evaluate(()=>{
   closeModal();
   const fresh=buildDemoState("weight_loss");
   fresh.profile.onboardingDone=true;
   fresh.supplies.push({id:987654321,name:"Retatrutide",vialMg:5,totalVials:2,
     vials:[{id:"fictional-open",status:"open",vialMg:5,remainingMg:.2},
       {id:"fictional-sealed",status:"sealed",vialMg:5,remainingMg:5,marker:"exact-source"}],
     wasteLog:[]});
   state=fresh;_demoActive=false;
   localStorage.setItem(STORE_KEY,JSON.stringify(state));
   _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);
   _nexusSharedWriter=null;
   addToOpenVialModal(987654321);
 });
 await a.locator("#atv-save").click();
 await a.waitForFunction(()=>{
   const kit=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654321);
   return kit?.wasteLog?.some(e=>e.type==="addition"&&e.status==="active");
 },{timeout:10000});
 const added=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(x=>x.id===987654321);
   return {balance:k.vials.find(v=>v.id==="fictional-open").remainingMg,
     sourceExists:k.vials.some(v=>v.id==="fictional-sealed"),
     count:k.totalVials,record:k.wasteLog.find(e=>e.type==="addition"),
     writerPending:nexusWriter().status().inFlight};
 });
 assert.equal(added.balance,5.2);
 assert.equal(added.sourceExists,false);
 assert.equal(added.count,1);
 assert.equal(added.record.sourceSealedVialId,"fictional-sealed");
 assert.equal(added.writerPending,false);
 await a.locator("#undo-btn").click();
 await a.waitForFunction(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654321);
   return k?.wasteLog?.some(e=>e.type==="addition-reversal");
 },{timeout:10000});
 const undoneUi=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654321);
   return {balance:k.vials.find(v=>v.id==="fictional-open").remainingMg,
     restored:k.vials.find(v=>v.id==="fictional-sealed"),
     count:k.totalVials,events:k.wasteLog};
 });
 assert.equal(undoneUi.balance,.2);
 assert.equal(undoneUi.restored.marker,"exact-source");
 assert.equal(undoneUi.count,2);
 assert.equal(undoneUi.events.length,2);
 assert.equal(undoneUi.events[0].status,"reversed");
 assert.equal(undoneUi.events[1].reversesEventId,added.record.id);
 assert.equal(undoneUi.events[1].mg,0,"Reversal must not create a new outflow");
 console.log("PASS: real Chromium fictional Add to Open Vial form persists exclusive exact-vial source and event-addressed undo");

 await context.close();
}finally{await browser.close()}
