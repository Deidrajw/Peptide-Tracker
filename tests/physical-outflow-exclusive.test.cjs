const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const source=fs.readFileSync("assets/js/09-nexus.js","utf8");
const start=source.indexOf("function planExclusivePhysicalOutflow(");
const end=source.indexOf("function undoOutflowModal(",start);
assert(start>=0&&end>start,"Actual physical outflow planners unavailable");
const context=vm.createContext({JSON,Number,Math,String,Error,Array,Object});
vm.runInContext(source.slice(start,end),context);
const add=(s,op)=>context.planExclusivePhysicalOutflow(s,op);
const undo=(s,op)=>context.planUndoExclusivePhysicalOutflow(s,op);
const clone=x=>JSON.parse(JSON.stringify(x));
const fixture=()=>({supplies:[{id:"K1",name:"Fictional Compound",vialMg:10,totalVials:3,
 vials:[{id:"OPEN",status:"open",remainingMg:8,vialMg:10,reconDate:"2026-10-29"},
        {id:"SEALED1",status:"sealed",remainingMg:10,vialMg:10},
        {id:"SEALED2",status:"sealed",remainingMg:10,vialMg:10}],
 wasteLog:[{id:"W0",type:"waste",status:"active",mg:1,vialId:"OTHER",date:"2026-10-25"}],
 linkedPreparationPlans:[{id:"P0",status:"planned-no-transfer",sourceVialId:"OTHER"}]}],
 peptides:{"Fictional Compound":{doses:[{id:"OLD",date:"2026-10-20",allocations:[{vialId:"OPEN"}]}]}},customPeptides:{}});
const op=(s,vialId,kind,mg,id="OUT1")=>({kitId:"K1",expectedKit:JSON.stringify(s.supplies[0]),
 vialId,expectedVial:JSON.stringify(s.supplies[0].vials.find(v=>v.id===vialId)),
 kind,mg,type:"waste",reason:"Damaged packaging",notes:"Fictional fixture",date:"2026-10-31",
 loggedAt:"2026-10-31T00:10:00Z",eventId:id});
const inv=(id="OUT1",undoId="UNDO1")=>({kitId:"K1",eventId:id,undoEventId:undoId,date:"2026-10-31",loggedAt:"2026-10-31T00:15:00Z"});
const error=(fn,re)=>assert.throws(fn,re);
(async()=>{
 const original=fixture();
 const consumed=add(original,op(original,"OPEN","consumed_open_partial",3)).next;
 assert.equal(original.supplies[0].vials[0].remainingMg,8,"No premature state mutation");
 assert.equal(consumed.supplies[0].vials[0].remainingMg,5);
 assert.equal(consumed.supplies[0].vials[1].remainingMg,10);
 assert.equal(consumed.supplies[0].wasteLog.length,2);
 const tx=consumed.supplies[0].wasteLog[1];
 assert.equal(tx.vialId,"OPEN");assert.equal(tx.mg,3);
 assert.equal(tx.reason,"Damaged packaging");
 assert.equal(tx.outflowKind,"consumed_open_partial");
 assert.equal(tx.stockBefore.remainingMg,8);
 assert.equal(tx.stockAfter.remainingMg,5);
 assert.equal(consumed.peptides["Fictional Compound"].doses[0].id,"OLD");
 const reversed=undo(consumed,inv()).next;
 assert.equal(reversed.supplies[0].vials[0].remainingMg,8);
 assert.equal(reversed.supplies[0].vials[0].status,"open");
 assert.equal(reversed.supplies[0].wasteLog.length,3);
 assert.equal(reversed.supplies[0].wasteLog[1].status,"reversed");
 assert.equal(reversed.supplies[0].wasteLog[2].reversesEventId,"OUT1");
 assert.equal(reversed.supplies[0].wasteLog[2].mg,0);
 assert.equal(consumed.supplies[0].wasteLog[1].status,"active");
 error(()=>undo(reversed,inv("OUT1","R2")),/safe reversible stock snapshot/);
 const whole=add(original,op(original,"OPEN","consumed_open_whole",8,"OW")).next;
 assert.equal(whole.supplies[0].vials[0].status,"empty");
 assert.equal(whole.supplies[0].vials[0].remainingMg,0);
 const wholeUndone=undo(whole,inv("OW","RW")).next;
 assert.equal(wholeUndone.supplies[0].vials[0].status,"open");
 assert.equal(wholeUndone.supplies[0].vials[0].remainingMg,8);
 const sealed=add(original,op(original,"SEALED2","transferred_sealed",10,"S1")).next;
 assert.equal(sealed.supplies[0].vials[2].status,"transferred");
 assert.equal(sealed.supplies[0].vials[2].remainingMg,0);
 assert.equal(sealed.supplies[0].vials[0].remainingMg,8,"Never touch open vial for sealed transfer");
 const sealedUndo=undo(sealed,inv("S1","RS1")).next;
 assert.equal(sealedUndo.supplies[0].vials[2].status,"sealed");
 assert.equal(sealedUndo.supplies[0].vials[2].remainingMg,10);
 assert.equal(sealedUndo.supplies[0].vials[0].remainingMg,8);
 error(()=>add(original,op(original,"OPEN","consumed_open_partial",9)),/exceeds/);
 error(()=>add(original,op(original,"OPEN","consumed_open_partial",8)),/Use whole/);
 error(()=>add(original,op(original,"OPEN","consumed_open_whole",3)),/entire open vial/);
 error(()=>add(original,op(original,"SEALED1","transferred_sealed",5)),/exact untouched/);
 error(()=>add(original,op(original,"SEALED1","consumed_open_partial",1)),/open vial/);
 error(()=>add(original,{...op(original,"OPEN","consumed_open_partial",3),mg:1.234}),/exact mg/);
 error(()=>add(original,{...op(original,"OPEN","consumed_open_partial",3),reason:" "}),/reason/);
 error(()=>add(original,{...op(original,"OPEN","consumed_open_partial",3),vialId:"missing"}),/source vial/);
 error(()=>add(original,{...op(original,"OPEN","consumed_open_partial",3),expectedKit:"{}"}),/Kit changed/);
 error(()=>add(consumed,{...op(consumed,"OPEN","consumed_open_partial",2),eventId:"OUT1"}),/already exists/);
 const changed=clone(consumed);changed.supplies[0].vials[0].remainingMg=4;
 error(()=>undo(changed,inv()),/balance or status/);
 const altered=clone(consumed);altered.supplies[0].vials[0].reconDate="2026-11-01";
 error(()=>undo(altered,inv()),/metadata changed/);
 const later=clone(consumed);later.supplies[0].wasteLog.push({id:"LATER",vialId:"OPEN",type:"waste",status:"active"});
 error(()=>undo(later,inv()),/Later vial history/);
 const other=clone(consumed);other.supplies[0].wasteLog.push({id:"OTHER",vialId:"SEALED1",type:"testing",status:"active"});
 assert.equal(undo(other,inv()).next.supplies[0].wasteLog[2].id,"OTHER","Unrelated event must remain intact");
 const dose=clone(consumed);
 dose.peptides["Fictional Compound"].doses.push({id:"POST",date:"2026-11-01",allocations:[{vialId:"OPEN"}]});
 error(()=>undo(dose,inv()),/Later dose allocation/);
 const planned=clone(sealed);
 planned.supplies[0].linkedPreparationPlans.push({id:"NEXT",sourceVialId:"SEALED2",createdAt:"2026-11-01",status:"planned-no-transfer"});
 error(()=>undo(planned,inv("S1","R2")),/Later preparation reference/);
 const legacy=clone(consumed);delete legacy.supplies[0].wasteLog[1].stockBefore;
 error(()=>undo(legacy,inv()),/safe reversible stock snapshot/);
 let raw=JSON.stringify(fixture()),writes=0;
 const lock=(_name,fn)=>fn();
 const writer=create({read:()=>raw,write:x=>{raw=x;writes++},lock,initialSnapshot:raw});
 const committed=await writer.transaction(JSON.parse(raw),s=>add(s,op(s,"OPEN","consumed_open_partial",3)));
 assert.equal(writes,1);assert.equal(raw,JSON.stringify(committed.next));
 const undone=await writer.transaction(JSON.parse(raw),s=>undo(s,inv()));
 assert.equal(writes,2);assert.equal(raw,JSON.stringify(undone.next));
 const stale=create({read:()=>raw,write:x=>{raw=x;writes++},lock,initialSnapshot:JSON.stringify(fixture())});
 await assert.rejects(stale.transaction(fixture(),s=>add(s,op(s,"OPEN","consumed_open_partial",3))),/changed/);
 assert.equal(writes,2);
 let bad=JSON.stringify(fixture());
 const quota=create({read:()=>bad,write:()=>{throw Error("quota")},lock,initialSnapshot:bad});
 await assert.rejects(quota.transaction(JSON.parse(bad),s=>add(s,op(s,"OPEN","consumed_open_partial",3))),/quota/);
 assert.equal(bad,JSON.stringify(fixture()));
 assert.equal(quota.status().blocked,true);
 const noLock=create({read:()=>bad,write:x=>{bad=x},initialSnapshot:bad});
 await assert.rejects(noLock.transaction(JSON.parse(bad),s=>add(s,op(s,"OPEN","consumed_open_partial",3))),/lock required/);
 assert.equal(bad,JSON.stringify(fixture()));
 console.log("PASS: exclusive physical outflow and event-ID Undo (partial, whole-open, sealed-transfer), exact source, unchanged history, stale/quota/lock fail closed");
})().catch(e=>{console.error(e);process.exitCode=1});
