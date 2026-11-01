const assert=require("node:assert/strict");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const {planDose}=require("../assets/js/nexus-prepared-dose-transaction.js");
const formulation=require("../assets/js/nexus-formulation-stock.js");
const make=()=>({supplies:[{id:"K1",name:"Sample A",vials:[{id:"V1",status:"open",remainingMg:24}]}],formulationStocks:[{id:"N1",compound:"Sample A",containerType:"nasal-bottle",method:"Nasal",remainingMg:6,remainingMl:3,mgPerSpray:.1,mlPerSpray:.05,transactions:[]}],peptides:{"Sample A":{doses:[]}},customPeptides:{}});
const tx={id:"T1",doseId:"D1",compound:"Sample A",method:"Nasal",trackingMode:"backed",sourceKind:"formulation-container",sourceId:"N1",sprays:2,nativeUnit:"mg",date:"2026-10-30T12:00:00"};
(async()=>{
 let snap=make(),raw=JSON.stringify(snap),writes=0;
 const adapters={read:()=>raw,write:s=>{raw=s;writes++},lock:(_name,fn)=>fn()};
 const c=create({...adapters,initialSnapshot:raw});
 c.saveLegacy({...snap,profile:{name:"fictional"}});
 assert.equal(writes,1);
 assert.equal(c.expected(),raw);
 const latest=JSON.parse(raw);
 const done=await c.transaction(latest,prior=>planDose(prior,tx));
 assert.equal(writes,2);
 assert.equal(done.next.formulationStocks[0].remainingMg,5.8);
 assert.equal(done.next.supplies[0].vials[0].remainingMg,24);
 assert.equal(JSON.parse(raw).peptides["Sample A"].doses.length,1);
 const stale=create({...adapters,initialSnapshot:"old"});
 assert.throws(()=>stale.saveLegacy(snap),/changed/);
 assert.equal(stale.status().blocked,true);
 assert.rejects(stale.transaction(snap,x=>({next:x})),/blocked/);
 let release;const barrier=new Promise(resolve=>{release=resolve});
 let entered;const started=new Promise(resolve=>{entered=resolve});
 const queued=create({read:()=>raw,write:s=>{raw=s},initialSnapshot:raw,lock:async(_name,fn)=>{entered();await barrier;return fn()}});
 const task=queued.transaction(JSON.parse(raw),x=>({next:{...x,marker:"locked"}}));
 await started;
 assert.throws(()=>queued.saveLegacy({...JSON.parse(raw),marker:"unsafe"}),/running/);
 release();await task;
 assert.equal(JSON.parse(raw).marker,"locked");
 const noLock=create({read:()=>raw,write:s=>{raw=s},initialSnapshot:raw});
 await assert.rejects(noLock.transaction(JSON.parse(raw),x=>({next:x})),/cross-tab lock/);
 const crash=create({read:()=>raw,write:()=>{throw Error("quota")},initialSnapshot:raw,lock:(_n,fn)=>fn()});
 assert.throws(()=>crash.saveLegacy(JSON.parse(raw)),/quota/);assert.equal(crash.status().blocked,true);
 let divergent=raw;const corrupt=create({read:()=>divergent,write:()=>{divergent="{}"},initialSnapshot:raw,lock:(_n,fn)=>fn()});
 await assert.rejects(corrupt.transaction(JSON.parse(raw),x=>({next:{...x,broken:true}})),/readback/);
 assert.equal(corrupt.status().blocked,true);
 let race=raw,count=0;const racing=create({read:()=>{count++;return count===3?"{}":race},write:s=>{race=s},initialSnapshot:raw,lock:(_n,fn)=>fn()});
 await assert.rejects(racing.transaction(JSON.parse(raw),x=>({next:x})),/changed/);
 let empty=null;
 const emptyWriter=create({read:()=>empty,write:x=>{empty=x},remove:()=>{empty=null},initialSnapshot:null});
 empty="written in another tab";
 assert.throws(()=>emptyWriter.saveLegacy({}),/changed/);
 let erasable=JSON.stringify(make()),removed=0;
 const erase=create({read:()=>erasable,write:v=>{erasable=v},remove:()=>{erasable=null;removed++},initialSnapshot:erasable});
 erase.removeLegacy();
 assert.equal(removed,1);
 assert.equal(erasable,null);
 erase.saveLegacy({profile:{fictional:true}});
 assert.equal(JSON.parse(erasable).profile.fictional,true);
 const staleErase=create({read:()=>erasable,remove:()=>{removed++},write:v=>{erasable=v},initialSnapshot:"old"});
 assert.throws(()=>staleErase.removeLegacy(),/changed/);
 assert.equal(removed,1);
 // Two separate tab-like coordinators share an exclusive async lock.
 // Once the first commits, the second must reject its stale original snapshot.
 let shared=JSON.stringify(make()),tail=Promise.resolve(),turns=0;
 const exclusive=(_name,fn)=>{const run=tail.then(async()=>{turns++;return fn()});tail=run.catch(()=>{});return run};
 const first=create({read:()=>shared,write:s=>{shared=s},initialSnapshot:shared,lock:exclusive});
 const second=create({read:()=>shared,write:s=>{shared=s},initialSnapshot:shared,lock:exclusive});
 const snapshot=JSON.parse(shared);
 const both=await Promise.allSettled([
   first.transaction(snapshot,x=>({next:{...x,session:"first"}})),
   second.transaction(snapshot,x=>({next:{...x,session:"second"}}))
 ]);
 assert.equal(both[0].status,"fulfilled");
 assert.equal(both[1].status,"rejected");
 assert.equal(turns,2);
 assert.equal(JSON.parse(shared).session,"first");
 // A real Stash formulation add and edit must be one exclusive commit,
 // preserving unrelated physical vial records and rejecting stale tabs.
 let inv=JSON.stringify(make()), invTail=Promise.resolve();
 const invLock=(_name,fn)=>{const job=invTail.then(fn);invTail=job.catch(()=>{});return job};
 const invAdapter={read:()=>inv,write:v=>{inv=v},lock:invLock};
 const stashA=create({...invAdapter,initialSnapshot:inv});
 const stashB=create({...invAdapter,initialSnapshot:inv});
 const invBefore=JSON.parse(inv);
 const addForm={id:"F1",compound:"Fictional Sample",containerType:"nasal-bottle",method:"Nasal",volumeMl:7,quantityMg:10};
 const newForm=await stashA.transaction(invBefore,s=>formulation.add(s,addForm));
 assert.equal(newForm.next.formulationStocks.length,2);
 assert.deepEqual(newForm.next.supplies,invBefore.supplies);
 assert.equal(newForm.next.formulationStocks[1].mgPerSpray,null);
 await assert.rejects(stashB.transaction(invBefore,s=>formulation.add(s,{...addForm,id:"F2"})),/changed/);
 assert.equal(JSON.parse(inv).formulationStocks.length,2);
 const editForm=await stashA.transaction(JSON.parse(inv),s=>formulation.edit(s,{id:"F1",remainingMl:6,remainingMg:9,transactionId:"adjust-F1"}));
 assert.equal(editForm.next.formulationStocks[1].remainingMg,9);
 assert.equal(editForm.next.formulationStocks[1].remainingMl,6);
 assert.equal(editForm.next.formulationStocks[1].transactions.length,1);
 assert.deepEqual(editForm.next.supplies,invBefore.supplies);


 // P0 incremental migration: actual scoped settings/history application helper
 // races a stock transaction under one exclusive writer, preserving exact stock.
 const scopedVm=require("node:vm"),scopedFs=require("node:fs"),scopedPath=require("node:path");
 const scopedSource=scopedFs.readFileSync(scopedPath.join(__dirname,"../assets/js/01-nexus.js"),"utf8");
 const scopedBegin=scopedSource.indexOf("function nexusPlanScopedStateChange(");
 const scopedEnd=scopedSource.indexOf("/* PR124 first exclusive Log Dose slice:",scopedBegin);
 assert.ok(scopedBegin>0&&scopedEnd>scopedBegin,"Production scoped writer must exist");
 const scopedCode=scopedSource.slice(scopedBegin,scopedEnd);
 let scopedRaw=JSON.stringify({
  supplies:[{id:"KIT",name:"Fictional A",vials:[{id:"V1",remainingMg:10,status:"open"}]}],
  settings:{nexusApiKey:"",phaseRemindersEnabled:false,theme:"dark"},
  supplementLogs:[{date:"2026-11-01",supplements:["Fictional C"]}],
  macroLogs:[],weightLogs:[],measurementLogs:[],activityLogs:[],dailyLogs:[],
  peptides:{"Fictional A":{doses:[]}},customPeptides:{}
 }),scopedWrites=0,scopedTail=Promise.resolve();
 const scopedLock=(_key,fn)=>{const run=scopedTail.then(fn);scopedTail=run.catch(()=>{});return run};
 const scopedAdapter={read:()=>scopedRaw,write:x=>{scopedRaw=x;scopedWrites++},lock:scopedLock};
 const scopedTab=({demo=false,adapter=scopedAdapter}={})=>{
  const coordinator=create({...adapter,initialSnapshot:scopedRaw});
  const ctx={state:JSON.parse(scopedRaw),_demoActive:demo,_nexusLastSavedSnapshot:scopedRaw,
   nexusWriter:()=>coordinator,showSaveWarning:()=>{},dayKey:value=>value.slice(0,10),
   console,globalThis:{},JSON,Error,String,Number};
  scopedVm.createContext(ctx);
  scopedVm.runInContext(scopedCode+
    ";globalThis.commitScoped=nexusCommitScopedStateChange;globalThis.planScoped=nexusPlanScopedStateChange;",ctx);
  return {ctx,writer:coordinator,commit:ctx.globalThis.commitScoped,plan:ctx.globalThis.planScoped};
 };
 const settingsTab=scopedTab(),stockTab=scopedTab();
 const originalScoped=JSON.parse(scopedRaw);
 const settingsVsStock=await Promise.all([
  stockTab.writer.transaction(originalScoped,prior=>{
   prior.supplies[0].vials[0].remainingMg=8;
   prior.peptides["Fictional A"].doses.push({id:"DOSE-1",dose:"2"});
   return {next:prior};
  }),
  settingsTab.commit({kind:"setting",key:"phaseRemindersEnabled",value:true})
 ]);
 assert.equal(settingsVsStock[1],false,"Stale settings tab must not overwrite inventory");
 assert.equal(scopedWrites,1,"Exactly one competing full-state write");
 assert.equal(JSON.parse(scopedRaw).supplies[0].vials[0].remainingMg,8);
 assert.equal(JSON.parse(scopedRaw).peptides["Fictional A"].doses.length,1);
 assert.equal(JSON.parse(scopedRaw).settings.phaseRemindersEnabled,false);
 assert.equal(settingsTab.ctx.state.settings.phaseRemindersEnabled,false,
  "Failed settings tab cannot claim in-memory success");
 const afterStock=scopedTab();
 assert.equal(await afterStock.commit({kind:"setting",key:"phaseRemindersEnabled",value:true}),true);
 assert.equal(JSON.parse(scopedRaw).supplies[0].vials[0].remainingMg,8);
 assert.equal(JSON.parse(scopedRaw).peptides["Fictional A"].doses.length,1);
 // Newly migrated Quick Access preference controls must use the same lock,
 // and must not write over the previously committed inventory/history.
 const quickTab=scopedTab();
 assert.equal(await quickTab.commit({kind:"setting",key:"nxUsageEnabled",value:true}),true);
 assert.equal(JSON.parse(scopedRaw).settings.nxUsageEnabled,true);
 assert.equal(JSON.parse(scopedRaw).supplies[0].vials[0].remainingMg,8);
 const quickReset=scopedTab();
 assert.equal(await quickReset.commit({kind:"setting",key:"nxUsageCounts",value:{}}),true);
 assert.deepEqual(JSON.parse(scopedRaw).settings.nxUsageCounts,{});
 const invalidQuick=scopedTab(),beforeQuickInvalid=scopedRaw;
 assert.equal(await invalidQuick.commit({kind:"setting",key:"nxUsageCounts",value:{"shortcut":-1}}),false);
 assert.equal(scopedRaw,beforeQuickInvalid);
 const historyTab=scopedTab(),reminderTab=scopedTab();
 const historyAndSettings=await Promise.all([
  historyTab.commit({kind:"supplement-log-delete",date:"2026-11-01"}),
  reminderTab.commit({kind:"setting",key:"nexusApiKey",value:"fictional-key"})
 ]);
 assert.deepEqual(historyAndSettings,[true,false],
  "Concurrent history/settings saves must reject the stale tab");
 assert.equal(JSON.parse(scopedRaw).supplementLogs.length,0);
 assert.equal(JSON.parse(scopedRaw).settings.nexusApiKey,"");
 assert.equal(JSON.parse(scopedRaw).supplies[0].vials[0].remainingMg,8);
 // Regression: valid YYYY-MM-DD upsert must reach the locked writer;
 // malformed date must never write. This previously used a double-escaped
 // regex and rejected every valid date.
 const upsertTab=scopedTab();
 const beforeUpsert=scopedRaw;
 assert.equal(await upsertTab.commit({kind:"supplement-log-upsert",date:"not-a-date",taken:["Fictional C"],id:"H-2"}),false);
 assert.equal(scopedRaw,beforeUpsert);
 assert.equal(await upsertTab.commit({kind:"supplement-log-upsert",date:"2026-11-02",taken:["Fictional C"],id:"H-2",expectedId:null}),true);
 assert.equal(JSON.parse(scopedRaw).supplementLogs.some(x=>x.date==="2026-11-02"&&x.id==="H-2"),true);
 // Nutrition, weight and measurements must preserve vial stock while
 // allowing only a validated exact dated record to be persisted.
 for(const [field,id,extra] of [
  ["macroLogs","M1",{calories:"2000",protein:"120"}],
  ["weightLogs","W1",{weight:"180.5"}],
  ["measurementLogs","Z1",{waist:"30"}]
 ]){
  const tab=scopedTab();
  const accepted=await tab.commit({kind:"dated-log-upsert",field,record:{id,date:"2026-11-02",...extra}});
  assert.equal(accepted,true,field+" was not durably committed");
  const saved=JSON.parse(scopedRaw);
  assert.equal(saved[field].some(x=>x.id===id),true);
  assert.equal(saved.supplies[0].vials[0].remainingMg,8);
  assert.equal(saved.peptides["Fictional A"].doses.length,1);
 }
 const beforeBulk=JSON.parse(scopedRaw);
 const bulkTab=scopedTab();
 assert.equal(await bulkTab.commit({kind:"bulk-delete",target:"del-health-all"}),true);
 const bulkAfter=JSON.parse(scopedRaw);
 for(const key of ["macroLogs","weightLogs","activityLogs","measurementLogs"])assert.equal(bulkAfter[key].length,0);
 assert.equal(bulkAfter.supplies[0].vials[0].remainingMg,8);
 assert.equal(bulkAfter.peptides["Fictional A"].doses.length,1);
 assert.equal(bulkAfter.supplementLogs.length,beforeBulk.supplementLogs.length);
 const invalidBulk=scopedTab(),priorBulk=scopedRaw;
 assert.equal(await invalidBulk.commit({kind:"bulk-delete",target:"erase-everything"}),false);
 assert.equal(scopedRaw,priorBulk);
 const invalidDated=scopedTab(),beforeDatedInvalid=scopedRaw;
 assert.equal(await invalidDated.commit({kind:"dated-log-upsert",field:"supplies",record:{id:"K1",date:"2026-11-02"}}),false);
 assert.equal(scopedRaw,beforeDatedInvalid);
 const savedBeforeInvalid=scopedRaw;
 const invalidScoped=scopedTab();
 assert.equal(await invalidScoped.commit({kind:"setting",key:"theme",value:"light"}),false,
  "Unreviewed settings mutation must fail closed");
 assert.equal(scopedRaw,savedBeforeInvalid);
 const demoScoped=scopedTab({demo:true});
 assert.equal(await demoScoped.commit({kind:"setting",key:"phaseRemindersEnabled",value:false}),true);
 assert.equal(scopedRaw,savedBeforeInvalid,"DEMO may not touch real saved state");
 const failScoped=scopedTab({adapter:{...scopedAdapter,write:()=>{throw Error("quota")}}});
 assert.equal(await failScoped.commit({kind:"setting",key:"nexusApiKey",value:"never-saved"}),false);
 assert.equal(scopedRaw,savedBeforeInvalid,"Quota failure cannot overwrite storage");
 console.log("PASS: scoped settings/history vs stock, competing full snapshots, stale rejection, DEMO and quota");
 // Actual application untracked Log Dose helper: two tab-like contexts,
 // one lock, stale fail-closed, editing, demo isolation and quota failure.
 const vm=require("node:vm"),fs=require("node:fs"),path=require("node:path");
 const appSource=fs.readFileSync(path.join(__dirname,"../assets/js/01-nexus.js"),"utf8");
 const begin=appSource.indexOf("async function nexusCommitUntrackedDose(");
 const end=appSource.indexOf("\nfunction enterDemoMode(",begin);
 assert.ok(begin>0&&end>begin,"real Log Dose helper must exist");
 const helper=appSource.slice(begin,end);
 let durable=JSON.stringify({peptides:{"Sample A":{enabled:true,doses:[],reschedules:[{newDate:"2026-10-31",doseId:null}]}},customPeptides:{},supplies:[{id:"V1",remainingMg:10}]});
 let queue=Promise.resolve(),acquired=0;
 const gate=(_name,fn)=>{const job=queue.then(async()=>{acquired++;return fn()});queue=job.catch(()=>{});return job};
 const context=({demo=false,write=serialized=>{durable=serialized}}={})=>{
   const scope={state:JSON.parse(durable),_demoActive:demo,_nexusLastSavedSnapshot:durable,
     PEPTIDES:{"Sample A":{}},cfg:()=>({defaultSchedule:7}),
     dayKey:s=>String(s).slice(0,10),showSaveWarning:()=>{},console,
     JSON,Error,String,globalThis:{}};
   const coordinator=create({read:()=>durable,write,lock:gate,initialSnapshot:durable});
   scope.nexusWriter=()=>coordinator;
   vm.createContext(scope);
   vm.runInContext(helper+";globalThis.commit=nexusCommitUntrackedDose;",scope);
   return {scope,commit:scope.globalThis.commit,coordinator};
 };
 const dose={id:"D-A",date:"2026-10-31T10:00",dose:"1",trackingMode:"untracked",kitId:null};
 const tabA=context(),tabB=context();
 const competing=await Promise.all([tabA.commit("Sample A",dose,false),tabB.commit("Sample A",{...dose,id:"D-B"},false)]);
 assert.deepEqual(competing,[true,false],"stale tab must fail closed");
 assert.equal(acquired,2,"both dose attempts must acquire the shared exclusive lock");
 assert.equal(JSON.parse(durable).peptides["Sample A"].doses.length,1);
 assert.equal(JSON.parse(durable).supplies[0].remainingMg,10,"untracked dose must not debit inventory");
 assert.equal(JSON.parse(durable).peptides["Sample A"].reschedules[0].doseId,"D-A");
 assert.equal(tabB.scope.state.peptides["Sample A"].doses.length,0,"failed tab retains its original state");
 const editTab=context();
 assert.equal(await editTab.commit("Sample A",{...dose,notes:"edited"},true),true);
 assert.equal(JSON.parse(durable).peptides["Sample A"].doses.length,1);
 assert.equal(JSON.parse(durable).peptides["Sample A"].doses[0].notes,"edited");
 const missing=context();
 assert.equal(await missing.commit("Sample A",{...dose,id:"missing"},true),false);
 const beforeDemo=durable,demoTab=context({demo:true});
 assert.equal(await demoTab.commit("Sample A",{...dose,id:"DEMO"},false),true);
 assert.equal(durable,beforeDemo,"demo must not touch durable storage");
 assert.equal(demoTab.scope.state.peptides["Sample A"].doses.length,2);
 const quotaTab=context({write:()=>{throw Error("quota")}});
 assert.equal(await quotaTab.commit("Sample A",{...dose,id:"QUOTA"},false),false);
 assert.equal(durable,beforeDemo);
 assert.equal(quotaTab.scope.state.peptides["Sample A"].doses.length,1,"failed quota keeps memory unchanged");
 console.log("PASS: exclusive untracked Log Dose 2-tab stale rejection, edit, no debit, DEMO isolation, quota fail-closed");

 // Actual inventory-backed source helper: immutable exact-vial planner and
 // locked two isolated-tab conflict; all fixtures are entirely fictional.
 const startBacked=appSource.indexOf("function nexusPhysicalForm(");
 const endBacked=appSource.indexOf("\nfunction enterDemoMode(",startBacked);
 assert.ok(startBacked>0&&endBacked>startBacked);
 const backedSource=appSource.slice(startBacked,endBacked);
 const fixture=()=>({peptides:{"Sample A":{enabled:true,doses:[],reschedules:[]}},
   customPeptides:{},supplies:[{id:"K1",name:"Sample A",activeKit:true,
    vials:[{id:"V1",status:"open",remainingMg:10,intendedUse:"SubQ"},
           {id:"V2",status:"open",remainingMg:8,intendedUse:"SubQ"},
           {id:"V3",status:"sealed",remainingMg:10,intendedUse:"SubQ"}]},
    {id:"K2",name:"Other",activeKit:true,
      vials:[{id:"V4",status:"open",remainingMg:10,intendedUse:"SubQ"}]}]});
 const firstDose={id:"d-1",date:"2026-10-31T08:00",dose:"2500",method:"SubQ",trackingMode:"backed",enteredUnit:"mcg"};
 const one={name:"Sample A",dose:firstDose,method:"SubQ",
   steps:[{kitId:"K1",vialId:"V1",mg:2.5}],nativeUnit:"mcg",expectedMassMg:2.5,builtin:true};
 const buildScope=(raw,writer,mode=false)=>{
   const scope={state:JSON.parse(raw),_demoActive:mode,_nexusLastSavedSnapshot:raw,
     nexusWriter:()=>writer,showSaveWarning:()=>{},console,JSON,Error,String,Number,Math,globalThis:{}};
   vm.createContext(scope);
   vm.runInContext(backedSource+";globalThis.plan=nexusPlanBackedPhysicalDose;globalThis.commit=nexusCommitBackedPhysicalDose;globalThis.change=nexusCommitBackedDoseChange;globalThis.planChange=nexusPlanBackedDoseChange;",scope);
   return {scope,plan:scope.globalThis.plan,commit:scope.globalThis.commit,change:scope.globalThis.change,planChange:scope.globalThis.planChange};
 };
 let physical=JSON.stringify(fixture()),countWrites=0,lockChain=Promise.resolve();
 const serializedLock=(_name,fn)=>{const job=lockChain.then(fn);lockChain=job.catch(()=>{});return job};
 const physicalAdapter={read:()=>physical,write:v=>{physical=v;countWrites++},lock:serializedLock};
 const sourceA=buildScope(physical,create({...physicalAdapter,initialSnapshot:physical}));
 const sourceB=buildScope(physical,create({...physicalAdapter,initialSnapshot:physical}));
 const resultA=sourceA.commit(one),resultB=sourceB.commit({...one,dose:{...firstDose,id:"d-2"}});
 const [doneA,doneB]=await Promise.all([resultA,resultB]);
 assert.ok(doneA&&doneA.dose.id==="d-1","first exclusive dose committed");
 assert.equal(doneB,null,"stale second physical dose rejected");
 assert.equal(countWrites,1,"one durable atomic state commit");
 assert.equal(JSON.parse(physical).supplies[0].vials[0].remainingMg,7.5);
 assert.equal(JSON.parse(physical).peptides["Sample A"].doses.length,1);
 assert.equal(sourceB.scope.state.supplies[0].vials[0].remainingMg,10,"rejected tab retains original in-memory stock");
 const planning=buildScope(JSON.stringify(fixture()),null);
 const throws=(tx,match)=>assert.throws(()=>planning.plan(fixture(),tx),match);
 throws({...one,steps:[{kitId:"K1",vialId:"V3",mg:2.5}]},/Open migrated vial/);
 throws({...one,steps:[{kitId:"K1",vialId:"V1",mg:11}],expectedMassMg:11},/Insufficient/);
 throws({...one,steps:[{kitId:"K2",vialId:"V4",mg:2.5}]},/Incompatible physical kit/);
 throws({...one,steps:[{kitId:"K1",vialId:"V1",mg:2.5,finished:true}]},/Previously drawn/);
 throws({...one,steps:[{kitId:"K1",vialId:"V1",mg:2},{kitId:"K1",vialId:"V1",mg:.5}]},/Duplicate vial/);
 throws({...one,steps:[{kitId:"K1",vialId:"V1",mg:2}]},/match dose/);
 throws({...one,method:"Nasal"},/Unsupported physical/);
 // Historical SubQ/IM vial labels are the same injectable product family.
 // Per-dose method remains historical; no vial records are relabelled.
 const legacyIM=fixture();legacyIM.supplies[0].vials[0].intendedUse="IM";
 const compatible=planning.plan(legacyIM,one);
 assert.equal(compatible.next.peptides["Sample A"].doses[0].method,"SubQ");
 assert.equal(compatible.next.supplies[0].vials[0].intendedUse,"IM");
 const mismatch=fixture();mismatch.supplies[0].vials[0].intendedUse="Oral";
 assert.throws(()=>planning.plan(mismatch,one),/formulation incompatible/);
 const intravenous={...one,method:"IV"};
 assert.throws(()=>planning.plan(fixture(),intravenous),/Unsupported physical/);

 const split=planning.plan(fixture(),{...one,steps:[{kitId:"K1",vialId:"V1",mg:1},{kitId:"K1",vialId:"V2",mg:1.5}]});
 assert.equal(split.next.supplies[0].vials[0].remainingMg,9);
 assert.equal(split.next.supplies[0].vials[1].remainingMg,6.5);
 assert.equal(split.dose.allocations[0].amount,1000);
 assert.equal(split.dose.allocations[1].amount,1500);
 assert.equal(fixture().supplies[0].vials[0].remainingMg,10);
 const double=fixture();double.peptides["Sample A"].doses.push(firstDose);
 assert.throws(()=>planning.plan(double,one),/Duplicate dose ID/);
 const beforeBackedDemo=physical,demo=buildScope(physical,null,true);
 const demoSaved=await demo.commit({...one,dose:{...firstDose,id:"demo-dose"}});
 assert.ok(demoSaved);
 assert.equal(physical,beforeBackedDemo,"demo never writes durable storage");
 const brokenWriter=create({read:()=>physical,write:()=>{throw Error("quota")},lock:serializedLock,initialSnapshot:physical});
 const failure=buildScope(physical,brokenWriter);
 assert.equal(await failure.commit({...one,dose:{...firstDose,id:"quota-dose"}}),null);
 assert.equal(physical,beforeBackedDemo);
 assert.equal(failure.scope.state.peptides["Sample A"].doses.length,1,"quota failure must not alter in-memory dose history");
 const noLockPhysical=buildScope(physical,create({read:()=>physical,write:v=>{physical=v},initialSnapshot:physical}));
 assert.equal(await noLockPhysical.commit({...one,dose:{...firstDose,id:"no-lock"}}),null,
   "physical dose cannot commit without a cross-tab lock");
 assert.equal(physical,beforeBackedDemo);
 let corruptRaw=physical;
 const corruptPhysical=buildScope(physical,create({read:()=>corruptRaw,write:()=>{corruptRaw="{}"},lock:serializedLock,initialSnapshot:physical}));
 assert.equal(await corruptPhysical.commit({...one,dose:{...firstDose,id:"bad-readback"}}),null,
   "unverified storage readback cannot report a dose saved");
 assert.equal(corruptPhysical.scope.state.peptides["Sample A"].doses.length,1,
   "readback failure retains original in-memory dose history");
 assert.equal(corruptPhysical.scope.state.supplies[0].vials[0].remainingMg,7.5);

 // A backed dose correction must reconcile the original exact vial AND dose history
 // under one shared exclusive transaction. No refund to a guessed source.
 const originalSaved=planning.plan(fixture(),one);
 const corrected=planning.planChange(originalSaved.next,{
   name:"Sample A",doseId:"d-1",operation:"edit",nativeUnit:"mcg",builtin:true,
   patch:{dose:"3000",notes:"corrected"}
 });
 assert.equal(corrected.next.supplies[0].vials[0].remainingMg,7);
 assert.equal(corrected.next.supplies[0].vials[1].remainingMg,8);
 assert.equal(corrected.next.peptides["Sample A"].doses.length,1);
 assert.equal(corrected.next.peptides["Sample A"].doses[0].allocations[0].amount,3000);
 assert.equal(corrected.next.nexusDoseAudit.length,1);
 const undone=planning.planChange(corrected.next,{
   name:"Sample A",doseId:"d-1",operation:"undo",nativeUnit:"mcg",builtin:true
 });
 assert.equal(undone.next.supplies[0].vials[0].remainingMg,10);
 assert.equal(undone.next.peptides["Sample A"].doses.length,0);
 assert.equal(undone.next.nexusDoseAudit.length,2);
 const lostSource=JSON.parse(JSON.stringify(originalSaved.next));
 lostSource.supplies[0].vials.splice(0,1);
 assert.throws(()=>planning.planChange(lostSource,{name:"Sample A",doseId:"d-1",operation:"undo",nativeUnit:"mcg",builtin:true}),/unavailable/);
 const ambiguous=JSON.parse(JSON.stringify(originalSaved.next));
 ambiguous.peptides["Sample A"].doses[0].allocations.push({kitId:"K1",vialId:"V2",amount:1});
 assert.throws(()=>planning.planChange(ambiguous,{name:"Sample A",doseId:"d-1",operation:"undo",nativeUnit:"mcg",builtin:true}),/Unsupported historic/);
 const staleOld=JSON.parse(JSON.stringify(originalSaved.next));
 staleOld.peptides["Sample A"].doses.push({...firstDose,id:"newer"});
 assert.throws(()=>planning.planChange(staleOld,{name:"Sample A",doseId:"d-1",operation:"undo",nativeUnit:"mcg",builtin:true}),/most recent/);
 let editRaw=JSON.stringify(originalSaved.next),editChain=Promise.resolve(),editWrites=0;
 const editLock=(_name,fn)=>{const run=editChain.then(fn);editChain=run.catch(()=>{});return run};
 const editAdapter={read:()=>editRaw,write:v=>{editRaw=v;editWrites++},lock:editLock};
 const edA=buildScope(editRaw,create({...editAdapter,initialSnapshot:editRaw}));
 const edB=buildScope(editRaw,create({...editAdapter,initialSnapshot:editRaw}));
 const chg={name:"Sample A",doseId:"d-1",operation:"edit",nativeUnit:"mcg",builtin:true,patch:{dose:"3000"}};
 const [editSuccess,staleUndo]=await Promise.all([edA.change(chg),edB.change({...chg,operation:"undo"})]);
 assert.ok(editSuccess&&editSuccess.source.vialId==="V1");
 assert.equal(staleUndo,null,"stale tab must not undo a committed edit");
 assert.equal(editWrites,1);
 assert.equal(JSON.parse(editRaw).supplies[0].vials[0].remainingMg,7);
 assert.equal(edB.scope.state.supplies[0].vials[0].remainingMg,7.5);
 const undoLive=buildScope(editRaw,create({...editAdapter,initialSnapshot:editRaw}));
 assert.ok(await undoLive.change({...chg,operation:"undo"}));
 assert.equal(JSON.parse(editRaw).supplies[0].vials[0].remainingMg,10);
 assert.equal(JSON.parse(editRaw).peptides["Sample A"].doses.length,0);
 assert.equal(editWrites,2);
 console.log("PASS: exclusive backed dose EDIT/UNDO single exact vial, immutable audit, no guessed refund, real coordinated stale-tab rejection, no duplicate history");
 console.log("PASS: backed physical exact-vial source, split mg/mcg, stale second tab, no double debit, insufficient/route/legacy failures, quota, demo isolation");
 console.log("PASS: shared coordinator legacy writes, exclusive transaction, stale detection, no-save while in-flight, fail-closed quota/readback/race");
})().catch(e=>{console.error(e);process.exitCode=1});
