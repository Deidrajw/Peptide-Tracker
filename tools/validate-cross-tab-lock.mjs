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
 await context.close();
}finally{await browser.close()}
