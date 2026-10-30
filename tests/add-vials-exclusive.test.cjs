const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const source=fs.readFileSync("assets/js/04-nexus.js","utf8");
const from=source.indexOf("function planExclusiveVialRestock(");
const to=source.indexOf("function addVialsModal(",from);
assert(from>=0&&to>from,"Restock planners must be defined in actual app source");
const sandbox=vm.createContext({JSON,Number,Math,String,Error,Array,Object,Set});
vm.runInContext(source.slice(from,to),sandbox);
const add=(s,op)=>sandbox.planExclusiveVialRestock(s,op);
const undo=(s,op)=>sandbox.planUndoExclusiveVialRestock(s,op);
const fixture=()=>({supplies:[{id:"K1",name:"Fictional Compound",vialMg:5,totalVials:2,cost:60,
  vials:[{id:"V1",status:"open",remainingMg:1,vialMg:5},{id:"V2",status:"sealed",remainingMg:5,vialMg:5}],
  wasteLog:[{id:"H1",type:"waste",vialId:"V1",status:"active",mg:1}]}],
  peptides:{"Fictional Compound":{doses:[{id:"historic",allocations:[{vialId:"V1"}]}]}},customPeptides:{},
  settings:{theme:"dark"}});
const input=()=>({kitId:"K1",expectedKit:JSON.stringify(fixture().supplies[0]),
 count:2,mg:7,cost:30,vialIds:["V3","V4"],eventId:"REST1",date:"2026-10-30",loggedAt:"2026-10-30T12:00:00Z"});
const reverse=()=>({kitId:"K1",eventId:"REST1",undoEventId:"UNDO1",date:"2026-10-30",loggedAt:"2026-10-30T12:01:00Z"});
const clone=v=>JSON.parse(JSON.stringify(v));
function rejectsUndo(snapshot,mutate,re){
 const changed=clone(snapshot);mutate(changed);
 assert.throws(()=>undo(changed,reverse()),re);
}
(async()=>{
 const base=fixture(),result=add(base,input()),saved=result.next,k=saved.supplies[0];
 assert.equal(base.supplies[0].vials.length,2,"Pure planner must not mutate original");
 assert.equal(k.vials.length,4);
 assert.equal(k.vials.slice(2).map(v=>v.id).join(","),"V3,V4");
 assert.equal(k.vials.slice(2).map(v=>v.status).join(","),"sealed,sealed");
 assert.equal(k.totalVials,4);assert.equal(k.vialMg,7);assert.equal(k.cost,90);
 assert.equal(k.restockLog[0].id,"REST1");
 assert.equal(k.restockLog[0].addedVialIds.join(","),"V3,V4");
 assert.equal(k.wasteLog[0].id,"H1");
 assert.equal(saved.peptides["Fictional Compound"].doses[0].id,"historic");
 const restored=undo(saved,reverse()).next,k2=restored.supplies[0];
 assert.equal(k2.vials.length,2);assert.equal(k2.vialMg,5);
 assert.equal(k2.cost,60);assert.equal(k2.totalVials,2);
 assert.equal(k2.restockLog[0].status,"reversed");
 assert.equal(k2.restockLog[1].reversesEventId,"REST1");
 assert.equal(k2.wasteLog.length,1,"Undo must not delete or write outflow history");
 assert.equal(saved.supplies[0].vials.length,4,"Undo planner must not mutate input");
 assert.throws(()=>undo(restored,reverse()),/not available/);
 assert.throws(()=>add(base,{...input(),count:2.5}),/1–1000/);
 assert.throws(()=>add(base,{...input(),count:2,vialIds:["V3","V3"]}),/Unique identifiers/);
 assert.throws(()=>add(base,{...input(),vialIds:["V1","V3"]}),/already exists/);
 assert.throws(()=>add(base,{...input(),mg:7.001}),/two decimals/);
 assert.throws(()=>add(base,{...input(),cost:-5}),/nonnegative/);
 assert.throws(()=>add(base,{...input(),expectedKit:"{}"}),/changed/);
 rejectsUndo(saved,s=>s.supplies[0].vials[2].status="open",/used or changed/);
 rejectsUndo(saved,s=>s.supplies[0].vials[2].remainingMg=6.5,/used or changed/);
 rejectsUndo(saved,s=>s.supplies[0].cost=100,/totals or cost/);
 rejectsUndo(saved,s=>s.supplies[0].restockLog.push({id:"LATER",status:"active"}),/Later restock/);
 rejectsUndo(saved,s=>s.supplies[0].wasteLog.push({id:"W",vialId:"V3"}),/attached history/);
 rejectsUndo(saved,s=>s.supplies[0].linkedPreparationPlans=[{id:"P3",sourceVialId:"V3",status:"planned-no-transfer"}],/attached history/);
 rejectsUndo(saved,s=>s.peptides["Fictional Compound"].doses.push({id:"D3",allocations:[{vialId:"V3"}]}),/attached history/);
 // Preserve unrelated history written after restock; no whole-array snapshot rollback.
 const withUnrelated=clone(saved);
 withUnrelated.settings.theme="light";
 withUnrelated.supplies[0].wasteLog.push({id:"W2",vialId:"V1",status:"active"});
 const safeUndo=undo(withUnrelated,reverse()).next;
 assert.equal(safeUndo.settings.theme,"light");
 assert.equal(safeUndo.supplies[0].wasteLog.length,2);
 let raw=JSON.stringify(fixture()),writes=0;
 const lock=(_name,fn)=>fn();
 const writer=create({read:()=>raw,write:s=>{raw=s;writes++},initialSnapshot:raw,lock});
 const first=await writer.transaction(JSON.parse(raw),state=>add(state,input()));
 assert.equal(writes,1);assert.equal(JSON.stringify(first.next),raw);
 const inverse=await writer.transaction(JSON.parse(raw),state=>undo(state,reverse()));
 assert.equal(writes,2);assert.equal(JSON.stringify(inverse.next),raw);
 const stale=create({read:()=>raw,write:s=>{raw=s;writes++},initialSnapshot:JSON.stringify(fixture()),lock});
 await assert.rejects(stale.transaction(fixture(),state=>add(state,input())),/changed/);
 assert.equal(writes,2,"Stale tab must not overwrite stock");
 let quotaRaw=JSON.stringify(fixture());
 const quota=create({read:()=>quotaRaw,write:()=>{throw Error("quota")},initialSnapshot:quotaRaw,lock});
 await assert.rejects(quota.transaction(JSON.parse(quotaRaw),state=>add(state,input())),/quota/);
 assert.equal(quotaRaw,JSON.stringify(fixture()));
 assert.equal(quota.status().blocked,true);
 const unlocked=create({read:()=>quotaRaw,write:s=>quotaRaw=s,initialSnapshot:quotaRaw});
 await assert.rejects(unlocked.transaction(JSON.parse(quotaRaw),state=>add(state,input())),/lock required/);
 assert.equal(quotaRaw,JSON.stringify(fixture()));
 console.log("PASS: exclusive Add Vials restock and event-specific undo: exact vial IDs, strength/cost restoration, immutable history, stale/quota/lock guards");
})().catch(e=>{console.error(e);process.exitCode=1});
