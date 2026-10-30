const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const source=fs.readFileSync("assets/js/04-nexus.js","utf8");
const from=source.indexOf("function addToOpenVialWouldOverRemove(");
const to=source.indexOf("function addToOpenVialModal(",from);
assert(from>=0&&to>from,"Audit exact runtime planner functions");
const context=vm.createContext({JSON,Number,Math,String,Error,Array});
vm.runInContext(source.slice(from,to),context);
const add=input=>context.planAddToOpenVial(input.state,input.op);
const undo=input=>context.planUndoAddToOpenVial(input.state,input.op);
const fixture=()=>({supplies:[{id:"K1",name:"Fictional Compound",vialMg:5,totalVials:2,
 vials:[{id:"V1",status:"open",remainingMg:.2,vialMg:5,intendedUse:"SubQ"},
        {id:"V2",status:"sealed",remainingMg:5,vialMg:5,sourceTag:"original"}],
 wasteLog:[{id:"history-1",status:"active",type:"waste",vialId:"other",mg:1}]}],
 peptides:{"Fictional Compound":{doses:[{id:"old-dose"}]}}});
const tx={kitId:"K1",vialId:"V1",expectedRemainingMg:.2,expectedVialMg:5,
 addMg:5,fromSealed:true,sourceSealedId:"V2",eventId:"A1",date:"2026-10-30",loggedAt:"2026-10-30T12:00:00Z"};
const rev={kitId:"K1",eventId:"A1",undoEventId:"R1",date:"2026-10-30",loggedAt:"2026-10-30T13:00:00Z"};
function runAdd(state=fixture(),op=tx){return add({state,op}).next}
function runUndo(state,op=rev){return undo({state,op}).next}
(async()=>{
 const initial=fixture(),changed=runAdd(initial);
 assert.equal(initial.supplies[0].vials.length,2,"Input must not mutate");
 assert.equal(changed.supplies[0].vials.length,1);
 assert.equal(changed.supplies[0].vials[0].remainingMg,5.2);
 assert.equal(changed.supplies[0].vials[0].vialMg,10);
 assert.equal(changed.supplies[0].totalVials,1);
 assert.equal(changed.supplies[0].wasteLog[1].id,"A1");
 assert.equal(changed.supplies[0].wasteLog[1].sourceSealedVialId,"V2");
 assert.equal(changed.peptides["Fictional Compound"].doses.length,1,"Never rewrite dose history");
 const reversed=runUndo(changed);
 assert.equal(reversed.supplies[0].vials.find(v=>v.id==="V1").remainingMg,.2);
 assert.equal(reversed.supplies[0].vials.find(v=>v.id==="V1").vialMg,5);
 assert.equal(reversed.supplies[0].vials.find(v=>v.id==="V2").sourceTag,"original");
 assert.equal(reversed.supplies[0].totalVials,2);
 assert.equal(reversed.supplies[0].wasteLog.length,3,"Append compensating inverse, never pop history");
 assert.equal(reversed.supplies[0].wasteLog[1].status,"reversed");
 assert.equal(reversed.supplies[0].wasteLog[2].reversesEventId,"A1");
 assert.equal(reversed.supplies[0].wasteLog[0].id,"history-1");
 assert.throws(()=>runAdd(changed),/already recorded|changed/);
 assert.throws(()=>runUndo(reversed),/cannot be reversed/);
 assert.throws(()=>runAdd(fixture(),{...tx,addMg:3}),/match the exact sealed/);
 assert.throws(()=>runAdd(fixture(),{...tx,sourceSealedId:"unknown"}),/no longer available/);
 assert.throws(()=>runAdd(fixture(),{...tx,expectedRemainingMg:4}),/changed/);
 const later=JSON.parse(JSON.stringify(changed));
 later.supplies[0].wasteLog.push({id:"later",type:"waste",vialId:"V1",status:"active"});
 assert.throws(()=>runUndo(later),/Later vial events/);
 const unrelated=JSON.parse(JSON.stringify(changed));
 unrelated.supplies[0].wasteLog.push({id:"unrelated",type:"waste",vialId:"OTHER",status:"active"});
 assert.equal(runUndo(unrelated).supplies[0].wasteLog[2].id,"unrelated");
 const modified=JSON.parse(JSON.stringify(changed));
 modified.supplies[0].vials[0].remainingMg=4;
 assert.throws(()=>runUndo(modified),/balance changed/);
 let raw=JSON.stringify(fixture()),writes=0;
 const lock=async(_name,task)=>task();
 const w=create({read:()=>raw,write:x=>{writes++;raw=x},lock,initialSnapshot:raw});
 const result=await w.transaction(JSON.parse(raw),snapshot=>add({state:snapshot,op:tx}));
 assert.equal(writes,1,"One atomic saved stock/history write");
 assert.equal(raw,JSON.stringify(result.next));
 const undone=await w.transaction(JSON.parse(raw),snapshot=>undo({state:snapshot,op:rev}));
 assert.equal(writes,2,"Undo is one additional complete write");
 assert.equal(raw,JSON.stringify(undone.next));
 const stale=create({read:()=>raw,write:x=>{writes++;raw=x},lock,initialSnapshot:JSON.stringify(fixture())});
 await assert.rejects(stale.transaction(fixture(),snapshot=>add({state:snapshot,op:tx})),/changed/);
 assert.equal(writes,2);
 let bad=JSON.stringify(fixture());
 const quota=create({read:()=>bad,write:()=>{throw Error("quota")},lock,initialSnapshot:bad});
 await assert.rejects(quota.transaction(JSON.parse(bad),snapshot=>add({state:snapshot,op:tx})),/quota/);
 assert.equal(bad,JSON.stringify(fixture()),"Quota failure cannot commit physical balance");
 assert.equal(quota.status().blocked,true);
 const noLock=create({read:()=>bad,write:x=>bad=x,initialSnapshot:bad});
 await assert.rejects(noLock.transaction(JSON.parse(bad),snapshot=>add({state:snapshot,op:tx})),/lock required/);
 assert.equal(bad,JSON.stringify(fixture()));
 console.log("PASS: exact-vial exclusive addition and event-specific inverse, immutable source audit, later-event protection, stale/quota/no-lock fail closed");
})().catch(e=>{console.error(e);process.exitCode=1});
