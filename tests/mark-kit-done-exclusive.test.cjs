const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const source=fs.readFileSync("assets/js/09-nexus.js","utf8");
const start=source.indexOf("function planExclusiveMarkKitDone("),end=source.indexOf("function markKitDoneModal(",start);
assert(start>=0&&end>start,"Exact runtime retirement planner is required");
const context=vm.createContext({JSON,Number,Math,String,Error,Array,Object,Set});
vm.runInContext(source.slice(start,end),context);
const plan=(s,input)=>context.planExclusiveMarkKitDone(s,input);
const clone=x=>JSON.parse(JSON.stringify(x));
const state=()=>({supplies:[{id:"kit",name:"Fictional",vialMg:10,totalVials:3,activeKit:true,kitStatus:"active",
  vials:[{id:"open",status:"open",remainingMg:3.25,vialMg:10},{id:"sealed",status:"sealed",remainingMg:10,vialMg:10},
         {id:"used",status:"empty",remainingMg:0,vialMg:10}],
  wasteLog:[{id:"prior",date:"2026-10-20",status:"active",mg:1,vialId:"used",type:"waste"}],
  linkedPreparationPlans:[]}],peptides:{Fictional:{doses:[{id:"old-dose"}]}},customPeptides:{}});
const mk=(s=state(),extra={})=>({kitId:"kit",expectedKit:JSON.stringify(s.supplies[0]),reasonKey:"bad_batch",
 declaredMg:13.25,notes:"Discarded after physical inspection",eventIds:["evt-open","evt-sealed"],
 completionId:"done",date:"2026-10-31",loggedAt:"2026-10-31T11:00:00Z",...extra});
const error=(s,input,re)=>assert.throws(()=>plan(s,input),re);
(async()=>{
  const original=state(),out=plan(original,mk()).next,kit=out.supplies[0];
  assert.equal(original.supplies[0].vials[0].remainingMg,3.25,"No mutation before commit");
  assert.equal(original.supplies[0].kitStatus,"active");
  assert.equal(kit.kitStatus,"done");assert.equal(kit.activeKit,false);
  assert.equal(kit.doneReason,"Bad batch / discarded");
  assert.equal(kit.vials[0].remainingMg,0);assert.equal(kit.vials[0].status,"empty");
  assert.equal(kit.vials[1].remainingMg,0);assert.equal(kit.vials[1].status,"empty");
  assert.equal(kit.vials[2].status,"empty");
  assert.equal(kit.wasteLog.length,3);assert.equal(kit.wasteLog[0].id,"prior");
  assert.equal(kit.wasteLog[1].mg,3.25);assert.equal(kit.wasteLog[2].mg,10);
  assert.equal(kit.wasteLog[1].vialId,"open");assert.equal(kit.wasteLog[2].vialId,"sealed");
  assert.equal(kit.wasteLog[1].retirementId,"done");
  assert.equal(kit.wasteLog[1].stockBefore.status,"open");
  assert.equal(kit.wasteLog[2].stockBefore.status,"sealed");
  assert.equal(kit.kitDoneHistory[0].totalMg,13.25);
  assert.equal(kit.kitDoneHistory[0].vialEvents.length,2);
  assert.equal(out.peptides.Fictional.doses[0].id,"old-dose");
  error(original,mk(original,{declaredMg:2}),/must match all remaining/);
  error(original,mk(original,{declaredMg:14}),/must match all remaining/);
  error(original,mk(original,{reasonKey:"used_up"}),/requires zero/);
  error(original,mk(original,{eventIds:["evt-open","evt-open"]}),/Unique per-vial/);
  error(original,mk(original,{expectedKit:"{}"}),/Kit changed/);
  const dup=clone(original);dup.supplies[0].vials[1].id="open";
  error(dup,mk(dup),/unique/);
  const bad=clone(original);delete bad.supplies[0].vials[0].remainingMg;
  error(bad,mk(bad),/ambiguous/);
  const linked=clone(original);linked.supplies[0].linkedPreparationPlans.push({sourceVialId:"open",status:"planned-no-transfer"});
  error(linked,mk(linked),/linked preparation/);
  const zero=clone(original);zero.supplies[0].vials.forEach(v=>{v.remainingMg=0;v.status="empty"});
  const finished=plan(zero,mk(zero,{reasonKey:"used_up",declaredMg:0,eventIds:[]})).next;
  assert.equal(finished.supplies[0].wasteLog.length,1);
  assert.equal(finished.supplies[0].kitDoneHistory[0].totalMg,0);
  error(out,mk(out),/Kit changed|already done/);
  let raw=JSON.stringify(original),writes=0;const lock=(_key,fn)=>fn();
  const writer=create({read:()=>raw,write:s=>{raw=s;writes++},initialSnapshot:raw,lock});
  const committed=await writer.transaction(JSON.parse(raw),s=>plan(s,mk(s)));
  assert.equal(writes,1);assert.equal(raw,JSON.stringify(committed.next));
  const stale=create({read:()=>raw,write:s=>{raw=s;writes++},initialSnapshot:JSON.stringify(original),lock});
  await assert.rejects(stale.transaction(original,s=>plan(s,mk(s))),/changed/);
  assert.equal(writes,1);
  let quotaRaw=JSON.stringify(original);
  const quota=create({read:()=>quotaRaw,write:()=>{throw Error("quota")},initialSnapshot:quotaRaw,lock});
  await assert.rejects(quota.transaction(JSON.parse(quotaRaw),s=>plan(s,mk(s))),/quota/);
  assert.equal(quotaRaw,JSON.stringify(original));
  const noLock=create({read:()=>quotaRaw,write:s=>{quotaRaw=s},initialSnapshot:quotaRaw});
  await assert.rejects(noLock.transaction(JSON.parse(quotaRaw),s=>plan(s,mk(s))),/lock required/);
  assert.equal(quotaRaw,JSON.stringify(original));
  console.log("PASS: exclusive Mark Kit Done, per-vial audit and original history, partial mismatch/legacy/linked source/stale/quota/no lock fail closed");
})().catch(e=>{console.error(e);process.exitCode=1});
