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
 // The lock-race fixture mutates localStorage in a different synthetic test
 // context. Reload the fictional app before testing real Stash form actions;
 // do not suppress an actual app storage warning or force blocked clicks.
 await a.reload({waitUntil:"domcontentloaded"});
 await a.waitForFunction(()=>typeof supplyModal==="function",{timeout:10000});

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
 await a.locator("#atv-source").selectOption("fictional-sealed");
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


 // PR124 Add Vials: exercise actual UI with separate fictional local-only kit.
 await a.evaluate(()=>{
   closeModal();
   const demo=buildDemoState("weight_loss");
   demo.profile.onboardingDone=true;
   demo.supplies.push({id:987654322,name:"Retatrutide",vialMg:5,totalVials:2,cost:30,
     vials:[{id:"restock-open",status:"open",vialMg:5,remainingMg:1,sequenceNumber:1,legacyUsedMg:0},
       {id:"restock-sealed",status:"sealed",vialMg:5,remainingMg:5}],
     wasteLog:[],_vialsBackfilled:true,_vialsSeqOrderRepaired:true,_vialsRepaired:true});
   state=demo;_demoActive=false;
   localStorage.setItem(STORE_KEY,JSON.stringify(state));
   _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);
   _nexusSharedWriter=null;
   addVialsModal(987654322);
 });
 await a.locator("#av-count").fill("2");
 await a.locator("#av-mg").fill("7");
 await a.locator("#av-cost").fill("20");
 await a.locator("#av-save").click();
 await a.waitForFunction(()=>{
   const kit=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(k=>k.id===987654322);
   return kit?.restockLog?.some(e=>e.type==="vial-restock"&&e.status==="active");
 },{timeout:10000});
 const restock=await a.evaluate(()=>{
   const kit=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(k=>k.id===987654322);
   return {total:kit.totalVials,strength:kit.vialMg,cost:kit.cost,
     event:kit.restockLog.find(e=>e.type==="vial-restock"),
     added:kit.vials.filter(v=>v.vialMg===7),pending:nexusWriter().status().inFlight};
 });
 assert.equal(restock.total,4);
 assert.equal(restock.strength,7);
 assert.equal(restock.cost,50);
 assert.equal(restock.added.length,2);
 assert.equal(restock.event.addedVialIds.length,2);
 assert.equal(restock.pending,false);
 await a.locator("#undo-btn").click();
 await a.waitForFunction(()=>{
   const kit=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(k=>k.id===987654322);
   return kit?.restockLog?.some(e=>e.type==="vial-restock-reversal");
 },{timeout:10000});
 const restoredRestock=await a.evaluate(()=>{
   const kit=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(k=>k.id===987654322);
   return {total:kit.totalVials,strength:kit.vialMg,cost:kit.cost,
     ids:kit.vials.map(v=>v.id),events:kit.restockLog};
 });
 assert.equal(restoredRestock.total,2);
 assert.equal(restoredRestock.strength,5);
 assert.equal(restoredRestock.cost,30);
 assert.ok(restoredRestock.ids.includes("restock-open")&&restoredRestock.ids.includes("restock-sealed"));
 assert.equal(restoredRestock.events[0].status,"reversed");
 assert.equal(restoredRestock.events[1].reversesEventId,restock.event.id);
 console.log("PASS: Chromium actual Add Vials UI + event-specific Undo under exclusive writer, exact-vial audit, strength/cost restoration");


 // Manual correction: real form and canonical stock/audit save in a fictional profile.
 await a.evaluate(()=>{
   closeModal();
   const fresh=buildDemoState("weight_loss");fresh.profile.onboardingDone=true;
   fresh.supplies.push({id:987654323,name:"Retatrutide",vialMg:10,totalVials:1,
     vials:[{id:"correction-open",status:"open",vialMg:10,remainingMg:4.49,sequenceNumber:1}],
     wasteLog:[{id:"prior-correction-fixture",type:"waste",status:"active",mg:1,vialId:"correction-open"}],
     _vialsBackfilled:true,_vialsSeqOrderRepaired:true,_vialsRepaired:true});
   state=fresh;_demoActive=false;
   localStorage.setItem(STORE_KEY,JSON.stringify(state));
   _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);_nexusSharedWriter=null;
   adjustVialRemainingModal(987654323,"correction-open");
 });
 await a.locator("#adj-amount").fill("3.25");
 await a.locator("#adj-save").click();
 const reasonRequired=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654323);
   return {amount:k.vials[0].remainingMg,events:k.wasteLog.length,formVisible:!!document.querySelector("#adj-reason")};
 });
 assert.equal(reasonRequired.amount,4.49,"Missing required reason must not persist a change");
 assert.equal(reasonRequired.events,1);
 assert.equal(reasonRequired.formVisible,true);
 await a.locator("#adj-reason").fill("Measured correction from fictional physical count");
 await a.locator("#adj-save").click();
 await a.waitForFunction(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654323);
   return k?.wasteLog?.some(e=>e.type==="adjustment"&&e.vialId==="correction-open");
 },{timeout:10000});
 const correction=await a.evaluate(()=>{
   const saved=JSON.parse(localStorage.getItem(STORE_KEY));
   const kit=saved.supplies.find(s=>s.id===987654323);
   const memory=state.supplies.find(s=>s.id===987654323);
   return {amount:kit.vials[0].remainingMg,inMemory:memory.vials[0].remainingMg,
     events:kit.wasteLog,stillPending:nexusWriter().status().inFlight};
 });
 assert.equal(correction.amount,3.25);
 assert.equal(correction.inMemory,3.25);
 assert.equal(correction.events.length,2,"Historical outflow must be preserved");
 assert.equal(correction.events[0].id,"prior-correction-fixture");
 assert.equal(correction.events[1].type,"adjustment");
 assert.equal(correction.events[1].mg,1.24);
 assert.equal(correction.events[1].adjustmentDeltaMg,-1.24);
 assert.equal(correction.events[1].reason,"Manual correction: Measured correction from fictional physical count");
 assert.equal(correction.events[1].vialId,"correction-open");
 assert.equal(correction.stillPending,false);
 console.log("PASS: Chromium actual correction form refuses blank reason; exclusive exact-vial stock + historical adjustment readback");


 // PR124 physical outflow: exercise actual form and exact event-linked Undo.
 // All data below is fictional in the isolated localhost browser profile.
 await a.evaluate(()=>{
   closeModal();
   const d=buildDemoState("weight_loss");d.profile.onboardingDone=true;
   d.supplies.push({id:987654324,name:"Retatrutide",vialMg:10,totalVials:3,
     vials:[{id:"outflow-open",status:"open",vialMg:10,remainingMg:8,sequenceNumber:1},
       {id:"outflow-sealed-1",status:"sealed",vialMg:10,remainingMg:10,sequenceNumber:2},
       {id:"outflow-sealed-2",status:"sealed",vialMg:10,remainingMg:10,sequenceNumber:3}],
     wasteLog:[{id:"historical-outflow",type:"waste",status:"active",mg:1,vialId:"other"}],
     _vialsBackfilled:true,_vialsSeqOrderRepaired:true,_vialsRepaired:true});
   state=d;_demoActive=false;
   localStorage.setItem(STORE_KEY,JSON.stringify(state));
   _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);_nexusSharedWriter=null;
   logWasteModal(987654324);
 });
 await a.locator("#waste-partial").click();
 await a.locator("#waste-mg").fill("3");
 await a.locator("#waste-save").click();
 await a.waitForFunction(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return k?.wasteLog?.some(e=>e.outflowKind==="consumed_open_partial"&&e.status==="active");
 },{timeout:10000});
 const outflow=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return {k,mem:state.supplies.find(s=>s.id===987654324),pending:nexusWriter().status().inFlight};
 });
 assert.equal(outflow.k.vials[0].remainingMg,5);
 assert.equal(outflow.k.vials[1].remainingMg,10);
 assert.equal(outflow.k.vials[2].remainingMg,10);
 assert.equal(outflow.mem.vials[0].remainingMg,5);
 assert.equal(outflow.k.wasteLog.length,2);
 assert.equal(outflow.k.wasteLog[0].id,"historical-outflow");
 assert.equal(outflow.pending,false);
 const tx=outflow.k.wasteLog[1];
 assert.equal(tx.vialId,"outflow-open");assert.equal(tx.mg,3);
 await a.evaluate(id=>undoOutflowModal(987654324,id),tx.id);
 await a.locator("#confirm-undo").click();
 await a.waitForFunction(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return k?.wasteLog?.some(e=>e.reversesEventId);
 },{timeout:10000});
 const undone=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return {k,mem:state.supplies.find(s=>s.id===987654324)};
 });
 assert.equal(undone.k.vials[0].remainingMg,8);
 assert.equal(undone.mem.vials[0].remainingMg,8);
 assert.equal(undone.k.wasteLog[1].status,"reversed");
 assert.equal(undone.k.wasteLog[2].reversesEventId,tx.id);
 assert.equal(undone.k.wasteLog[2].mg,0);
 console.log("PASS: Chromium real partial Log Outflow and exact event-ID Undo commits, preserves unrelated historical entries");
 // Whole-vial chooser must reject no selection; sealed source is explicitly chosen.
 await a.evaluate(()=>logWasteModal(987654324));
 await a.locator("#waste-save").click();
 assert.equal(await a.locator("#waste-source").count(),1,"Whole outflow must show exact source chooser");
 await a.locator("#waste-source-confirm").click();
 const noAutoSource=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return k.vials.find(v=>v.id==="outflow-sealed-2").status;
 });
 assert.equal(noAutoSource,"sealed");
 await a.locator("#waste-source").selectOption("outflow-sealed-2");
 await a.locator("#waste-source-confirm").click();
 await a.waitForFunction(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return k.vials.find(v=>v.id==="outflow-sealed-2")?.status==="transferred";
 },{timeout:10000});
 const transferred=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return {open:k.vials.find(v=>v.id==="outflow-open").remainingMg,
     other:k.vials.find(v=>v.id==="outflow-sealed-1").remainingMg,
     sealed:k.vials.find(v=>v.id==="outflow-sealed-2").remainingMg,
     tx:k.wasteLog.find(e=>e.outflowKind==="transferred_sealed")};
 });
 assert.equal(transferred.open,8);
 assert.equal(transferred.other,10);
 assert.equal(transferred.sealed,0);
 assert.equal(transferred.tx.vialId,"outflow-sealed-2");
 console.log("PASS: Chromium whole-vial source picker requires explicit choice and touches exact sealed source only");


 // Real outflow modal: exact sealed source choice, persistent event, inverse.
 await a.evaluate(()=>{
   closeModal();
   const fresh=buildDemoState("weight_loss");fresh.profile.onboardingDone=true;
   fresh.supplies.push({id:987654324,name:"Retatrutide",vialMg:10,totalVials:3,
     vials:[{id:"out-open",status:"open",vialMg:10,remainingMg:4,sequenceNumber:1},
       {id:"out-sealed-1",status:"sealed",vialMg:10,remainingMg:10,sequenceNumber:2},
       {id:"out-sealed-2",status:"sealed",vialMg:10,remainingMg:10,sequenceNumber:3}],
     wasteLog:[],_vialsBackfilled:true,_vialsSeqOrderRepaired:true,_vialsRepaired:true});
   state=fresh;_demoActive=false;
   localStorage.setItem(STORE_KEY,JSON.stringify(state));
   _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);_nexusSharedWriter=null;
   logWasteModal(987654324);
 });
 await a.locator("#waste-save").click();
 await a.locator("#waste-source").selectOption("out-sealed-2");
 await a.locator("#waste-source-confirm").click();
 await a.waitForFunction(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return k?.wasteLog?.some(e=>e.vialId==="out-sealed-2"&&e.status==="active");
 },{timeout:10000});
 const exactOutflow=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return {vials:k.vials,events:k.wasteLog};
 });
 assert.equal(exactOutflow.vials.find(v=>v.id==="out-sealed-2").status,"transferred");
 assert.equal(exactOutflow.vials.find(v=>v.id==="out-sealed-2").remainingMg,0);
 assert.equal(exactOutflow.vials.find(v=>v.id==="out-open").remainingMg,4);
 assert.equal(exactOutflow.vials.find(v=>v.id==="out-sealed-1").remainingMg,10);
 const outId=exactOutflow.events[0].id;
 await a.evaluate(id=>undoOutflowModal(987654324,id),outId);
 await a.locator("#confirm-undo").click();
 await a.waitForFunction(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return k?.wasteLog?.some(e=>e.reversesEventId);
 },{timeout:10000});
 const reversedOutflow=await a.evaluate(()=>{
   const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654324);
   return {vials:k.vials,events:k.wasteLog};
 });
 assert.equal(reversedOutflow.vials.find(v=>v.id==="out-sealed-2").status,"sealed");
 assert.equal(reversedOutflow.vials.find(v=>v.id==="out-sealed-2").remainingMg,10);
 assert.equal(reversedOutflow.events[0].status,"reversed");
 assert.equal(reversedOutflow.events[1].reversesEventId,outId);
 console.log("PASS: Chromium actual outflow exact sealed-vial picker and exclusive event-linked Undo readback");


 // Exact physical Edit Outflow UI. Scoped to avoid a collision with other tests.
 {
   await a.evaluate(()=>{
     closeModal();
     const fresh=buildDemoState("weight_loss");fresh.profile.onboardingDone=true;
     fresh.supplies.push({id:987654325,name:"Retatrutide",vialMg:10,totalVials:1,
       vials:[{id:"edit-outflow-open",status:"open",vialMg:10,remainingMg:8}],
       wasteLog:[],linkedPreparationPlans:[],
       _vialsBackfilled:true,_vialsSeqOrderRepaired:true,_vialsRepaired:true});
     state=fresh;_demoActive=false;
     localStorage.setItem(STORE_KEY,JSON.stringify(state));
     _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);_nexusSharedWriter=null;
     logWasteModal(987654325);
   });
   await a.locator("#waste-partial").click();
   await a.locator("#waste-mg").fill("3");
   await a.locator("#waste-save").click();
   await a.waitForFunction(()=>{
     const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654325);
     return k?.wasteLog?.some(x=>x.outflowKind==="consumed_open_partial"&&x.status==="active");
   },{timeout:10000});
   const first=await a.evaluate(()=>{
     const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654325);
     return {balance:k.vials[0].remainingMg,id:k.wasteLog[0].id};
   });
   assert.equal(first.balance,5);
   await a.evaluate(id=>editOutflowModal(987654325,id),first.id);
   await a.locator("#eo-mg").fill("2");
   await a.locator("#eo-reason").fill("Measured correction");
   await a.locator("#eo-notes").fill("Fictional exact-vial check");
   await a.locator("#eo-save").click();
   await a.waitForFunction(()=>{
     const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654325);
     return k?.wasteLog?.[0]?.editHistory?.length===1;
   },{timeout:10000});
   const modified=await a.evaluate(()=>{
     const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654325);
     return {balance:k.vials[0].remainingMg,mg:k.wasteLog[0].mg,
       original:k.wasteLog[0].editHistory[0].previous.mg,
       current:k.wasteLog[0].editHistory[0].updated.mg,
       linked:k.wasteLog[1].editsEventId,memory:state.supplies.find(s=>s.id===987654325).vials[0].remainingMg,
       pending:nexusWriter().status().inFlight};
   });
   assert.equal(modified.balance,6);
   assert.equal(modified.mg,2);
   assert.equal(modified.original,3);
   assert.equal(modified.current,2);
   assert.equal(modified.linked,first.id);
   assert.equal(modified.memory,6);
   assert.equal(modified.pending,false);
   await a.evaluate(id=>undoOutflowModal(987654325,id),first.id);
   await a.locator("#confirm-undo").click();
   await a.waitForFunction(()=>{
     const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654325);
     return k?.wasteLog?.some(x=>x.reversesEventId);
   },{timeout:10000});
   const final=await a.evaluate(()=>{
     const k=JSON.parse(localStorage.getItem(STORE_KEY)).supplies.find(s=>s.id===987654325);
     return {balance:k.vials[0].remainingMg,original:k.wasteLog[0],
       audit:k.wasteLog[1],reversal:k.wasteLog[2]};
   });
   assert.equal(final.balance,8);
   assert.equal(final.original.status,"reversed");
   assert.equal(final.original.editHistory[0].previous.mg,3);
   assert.equal(final.audit.mg,0);
   assert.equal(final.reversal.mg,0);
   console.log("PASS: browser Edit Outflow modifies saved exact vial plus event, retains old revision, and Undo restores original stock");
 }

 await context.close();
}finally{await browser.close()}
