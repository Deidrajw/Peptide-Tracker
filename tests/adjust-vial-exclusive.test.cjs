const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const source=fs.readFileSync("assets/js/04-nexus.js","utf8");
const from=source.indexOf("function planExclusiveVialAdjustment(");
const end=source.indexOf("function adjustVialRemainingModal(",from);
assert(from>=0&&end>from,"Must test exact runtime correction planner");
const ctx=vm.createContext({JSON,Number,Math,String,Error,Array,Object});
vm.runInContext(source.slice(from,end),ctx);
const plan=(s,op)=>ctx.planExclusiveVialAdjustment(s,op);
const fixture=()=>({supplies:[{id:"K1",name:"Fictional Compound",vialMg:10,totalVials:2,
 vials:[{id:"V1",status:"open",remainingMg:4.49,vialMg:10,intendedUse:"SubQ"},
        {id:"V2",status:"sealed",remainingMg:10,vialMg:10}],
 wasteLog:[{id:"historical",type:"waste",status:"active",mg:1,vialId:"V1"}]}],
 peptides:{"Fictional Compound":{doses:[{id:"D1",kitId:"K1",allocations:[{vialId:"V1"}]}]}},
 customPeptides:{},profile:{name:"Fictional"}});
const makeInput=(s=fixture(),extra={})=>({kitId:"K1",vialId:"V1",
 expectedKit:JSON.stringify(s.supplies[0]),expectedVial:JSON.stringify(s.supplies[0].vials[0]),
 newMg:3.25,reason:"  Correcting a measured inventory mismatch  ",eventId:"ADJ1",
 date:"2026-10-30",loggedAt:"2026-10-30T19:30:00Z",...extra});
const copy=v=>JSON.parse(JSON.stringify(v));
const expectError=(s,input,re)=>assert.throws(()=>plan(s,input),re);
(async()=>{
 const base=fixture(),op=makeInput(base);
 const result=plan(base,op),next=result.next,kit=next.supplies[0];
 assert.equal(base.supplies[0].vials[0].remainingMg,4.49,"No live mutation prior to persistence");
 assert.equal(kit.vials[0].remainingMg,3.25);
 assert.equal(kit.vials[0].status,"open");
 assert.equal(kit.vials[1].remainingMg,10);
 assert.equal(kit.wasteLog.length,2);
 assert.equal(kit.wasteLog[0].id,"historical");
 const event=kit.wasteLog[1];
 assert.equal(event.id,"ADJ1");assert.equal(event.type,"adjustment");assert.equal(event.status,"active");
 assert.equal(event.vialId,"V1");assert.equal(event.mg,1.24);
 assert.equal(event.adjustmentDeltaMg,-1.24);
 assert.equal(event.reason,"Manual correction: Correcting a measured inventory mismatch");
 assert.equal(event.stockBefore.remainingMg,4.49);
 assert.equal(event.stockAfter.remainingMg,3.25);
 assert.equal(next.peptides["Fictional Compound"].doses[0].id,"D1");
 assert.equal(next.profile.name,"Fictional");
 expectError(base,makeInput(base,{reason:"  "}),/reason is required/);
 expectError(base,makeInput(base,{newMg:-1}),/within 0 and vial capacity/);
 expectError(base,makeInput(base,{newMg:11}),/within 0 and vial capacity/);
 expectError(base,makeInput(base,{newMg:1.234}),/0.01mg/);
 expectError(base,makeInput(base,{newMg:Infinity}),/within 0 and vial capacity/);
 expectError(base,makeInput(base,{vialId:"missing"}),/Exact vial identity/);
 expectError(base,makeInput(base,{expectedKit:"{}"}),/kit changed/i);
 expectError(next,makeInput(next,{eventId:"ADJ1"}),/already exists/);
 const empty=plan(base,makeInput(base,{newMg:0,eventId:"ZERO"})).next;
 assert.equal(empty.supplies[0].vials[0].remainingMg,0);
 assert.equal(empty.supplies[0].vials[0].status,"empty");
 assert.equal(empty.supplies[0].wasteLog[1].adjustmentDeltaMg,-4.49);
 const emptyFixture=copy(base);
 emptyFixture.supplies[0].vials[0].status="empty";
 emptyFixture.supplies[0].vials[0].remainingMg=0;
 const reopened=plan(emptyFixture,makeInput(emptyFixture,{newMg:2.50,eventId:"REOPEN"})).next;
 assert.equal(reopened.supplies[0].vials[0].status,"open");
 assert.equal(reopened.supplies[0].wasteLog[1].adjustmentDeltaMg,2.50);
 const transferred=copy(base);
 transferred.supplies[0].vials[0].status="transferred";
 transferred.supplies[0].vials[0].remainingMg=0;
 expectError(transferred,makeInput(transferred,{newMg:4}),/source-transfer reversal/);
 const shifted=copy(base);
 shifted.supplies[0].vials[0].remainingMg=2;
 expectError(shifted,op,/kit changed/i);
 const duplicate=copy(base);
 duplicate.supplies[0].vials.push({...duplicate.supplies[0].vials[0]});
 expectError(duplicate,makeInput(duplicate),/duplicated/);
 const odd=copy(base);
 odd.supplies[0].vials[0].remainingMg=undefined;
 expectError(odd,makeInput(odd),/reconciliation/);
 let raw=JSON.stringify(base),writes=0;
 const lock=(_name,fn)=>fn();
 const writer=create({read:()=>raw,write:x=>{raw=x;writes++},initialSnapshot:raw,lock});
 const committed=await writer.transaction(JSON.parse(raw),state=>plan(state,op));
 assert.equal(writes,1,"Exactly one canonical stock + audit write");
 assert.equal(JSON.stringify(committed.next),raw,"Persisted and adopted state match");
 assert.equal(JSON.parse(raw).supplies[0].wasteLog.length,2);
 const stale=create({read:()=>raw,write:x=>{raw=x;writes++},initialSnapshot:JSON.stringify(base),lock});
 await assert.rejects(stale.transaction(base,state=>plan(state,op)),/changed/);
 assert.equal(writes,1);
 let quotaRaw=JSON.stringify(base);
 const quota=create({read:()=>quotaRaw,write:()=>{throw Error("quota")},initialSnapshot:quotaRaw,lock});
 await assert.rejects(quota.transaction(JSON.parse(quotaRaw),state=>plan(state,op)),/quota/);
 assert.equal(quotaRaw,JSON.stringify(base));
 assert.equal(quota.status().blocked,true);
 const noLock=create({read:()=>quotaRaw,write:x=>quotaRaw=x,initialSnapshot:quotaRaw});
 await assert.rejects(noLock.transaction(JSON.parse(quotaRaw),state=>plan(state,op)),/lock required/);
 assert.equal(quotaRaw,JSON.stringify(base));
 console.log("PASS: exclusive manual vial correction reason, exact source, signed historical adjustment, stale/quota/lock fail closed");
})().catch(e=>{console.error(e);process.exitCode=1});
