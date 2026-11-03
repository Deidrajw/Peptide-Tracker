const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const source=fs.readFileSync("assets/js/09-nexus.js","utf8");
const from=source.indexOf("function planExclusivePhysicalOutflow("),through=source.indexOf("function undoOutflowModal(",from);
const start=source.indexOf("function planExclusivePhysicalOutflowEdit("),end=source.indexOf("function editOutflowModal(",start);
assert(from>=0&&through>from&&start>=0&&end>start,"Use exact live planners");
const ctx=vm.createContext({JSON,Number,Math,String,Error,Array,Object});
vm.runInContext(source.slice(from,through)+source.slice(start,end),ctx);
const out=(s,op)=>ctx.planExclusivePhysicalOutflow(s,op);
const edit=(s,op)=>ctx.planExclusivePhysicalOutflowEdit(s,op);
const undo=(s,op)=>ctx.planUndoExclusivePhysicalOutflow(s,op);
const clone=x=>JSON.parse(JSON.stringify(x));
const fixture=()=>({supplies:[{id:"K",name:"Fictional",vialMg:10,totalVials:2,
 vials:[{id:"OPEN",status:"open",vialMg:10,remainingMg:8},
 {id:"SEALED",status:"sealed",vialMg:10,remainingMg:10}],
 wasteLog:[{id:"PREVIOUS",type:"waste",status:"active",mg:1,vialId:"OTHER"}],
 linkedPreparationPlans:[]}],
 peptides:{Fictional:{doses:[{id:"HISTORIC",date:"2026-10-20",allocations:[{vialId:"OPEN"}]}]}},customPeptides:{},settings:{theme:"dark"}});
function logInput(s,sourceId="OPEN",kind="consumed_open_partial",mg=3,id="OUT"){
 return {kitId:"K",expectedKit:JSON.stringify(s.supplies[0]),vialId:sourceId,
 expectedVial:JSON.stringify(s.supplies[0].vials.find(v=>v.id===sourceId)),
 kind,mg,eventId:id,type:"waste",reason:"Original",notes:"Old note",
 date:"2026-10-31",loggedAt:"2026-10-31T01:00:00Z"};
}
const undoInput=(id="OUT",rid="UNDO")=>({kitId:"K",eventId:id,undoEventId:rid,date:"2026-10-31",loggedAt:"2026-10-31T03:00:00Z"});
const editInput=(s,id="OUT",mg=2,extra={})=>({kitId:"K",eventId:id,expectedKit:JSON.stringify(s.supplies[0]),
 mg,reason:"  Corrected after measurement  ",notes:"New note",date:"2026-10-30",
 editId:"EDIT",editDate:"2026-10-31",loggedAt:"2026-10-31T02:00:00Z",...extra});
const throws=(fn,re)=>assert.throws(fn,re);
(async()=>{
 const base=fixture(),recorded=out(base,logInput(base)).next,adjusted=edit(recorded,editInput(recorded)).next;
 assert.equal(base.supplies[0].vials[0].remainingMg,8);
 assert.equal(recorded.supplies[0].vials[0].remainingMg,5);
 assert.equal(adjusted.supplies[0].vials[0].remainingMg,6);
 assert.equal(adjusted.supplies[0].vials[1].remainingMg,10);
 const kit=adjusted.supplies[0],event=kit.wasteLog[1];
 assert.equal(event.id,"OUT");assert.equal(event.mg,2);
 assert.equal(event.reason,"Corrected after measurement");
 assert.equal(event.notes,"New note");assert.equal(event.date,"2026-10-30");
 assert.equal(event.stockBefore.remainingMg,8);assert.equal(event.stockAfter.remainingMg,6);
 assert.equal(event.editHistory[0].previous.mg,3);
 assert.equal(event.editHistory[0].previous.stockAfter.remainingMg,5);
 assert.equal(event.editHistory[0].updated.stockAfter.remainingMg,6);
 assert.equal(kit.wasteLog[0].id,"PREVIOUS");
 assert.equal(kit.wasteLog[2].editsEventId,"OUT");
 assert.equal(kit.wasteLog[2].mg,0);
 assert.equal(kit.wasteLog[2].status,"reversed");
 assert.equal(adjusted.peptides.Fictional.doses[0].id,"HISTORIC");
 const undone=undo(adjusted,undoInput()).next;
 assert.equal(undone.supplies[0].vials[0].remainingMg,8);
 assert.equal(undone.supplies[0].wasteLog[1].status,"reversed");
 assert.equal(undone.supplies[0].wasteLog[3].reversesEventId,"OUT");
 assert.equal(undone.supplies[0].wasteLog[3].mg,0);
 const repeated=edit(adjusted,editInput(adjusted,"OUT",1,{editId:"EDIT2"})).next;
 assert.equal(repeated.supplies[0].vials[0].remainingMg,7);
 assert.equal(repeated.supplies[0].wasteLog[1].editHistory.length,2);
 throws(()=>edit(recorded,editInput(recorded,"OUT",0)),/positive outflow/);
 throws(()=>edit(recorded,editInput(recorded,"OUT",1.234)),/hundredths/);
 throws(()=>edit(recorded,editInput(recorded,"OUT",8)),/Partial outflow/);
 throws(()=>edit(recorded,editInput(recorded,"OUT",2,{reason:" "})),/reason and date/);
 throws(()=>edit(recorded,editInput(recorded,"OUT",2,{date:"bad"})),/reason and date/);
 throws(()=>edit(recorded,editInput(recorded,"OUT",2,{expectedKit:"{}"})),/Kit changed/);
 throws(()=>edit(adjusted,editInput(adjusted)),/Unique edit event ID/);
 throws(()=>edit(undone,editInput(undone)),/Legacy or reversed/);
 const unknown=clone(recorded);delete unknown.supplies[0].wasteLog[1].stockBefore;
 throws(()=>edit(unknown,editInput(unknown)),/Legacy or reversed/);
 const modified=clone(recorded);modified.supplies[0].vials[0].remainingMg=4;
 throws(()=>edit(modified,editInput(modified)),/Source vial changed/);
 const later=clone(recorded);later.supplies[0].wasteLog.push({id:"LATER",vialId:"OPEN",type:"waste",status:"active"});
 throws(()=>edit(later,editInput(later)),/Later vial outflow/);
 const dose=clone(recorded);dose.peptides.Fictional.doses.push({id:"D2",date:"2026-11-02",allocations:[{vialId:"OPEN"}]});
 throws(()=>edit(dose,editInput(dose)),/Later dose/);
 const plan=clone(recorded);plan.supplies[0].linkedPreparationPlans.push({id:"P2",sourceVialId:"OPEN",createdAt:"2026-11-02"});
 throws(()=>edit(plan,editInput(plan)),/Later preparation/);
 const sealed=out(base,logInput(base,"SEALED","transferred_sealed",10,"SEAL")).next;
 const sealedEdit=edit(sealed,editInput(sealed,"SEAL",10,{editId:"SEAL_EDIT"})).next;
 assert.equal(sealedEdit.supplies[0].vials[1].status,"transferred");
 assert.equal(sealedEdit.supplies[0].vials[1].remainingMg,0);
 throws(()=>edit(sealed,editInput(sealed,"SEAL",8)),/sealed whole-vial transfer/);
 const whole=out(base,logInput(base,"OPEN","consumed_open_whole",8,"WHOLE")).next;
 assert.equal(edit(whole,editInput(whole,"WHOLE",8)).next.supplies[0].vials[0].status,"empty");
 throws(()=>edit(whole,editInput(whole,"WHOLE",7)),/Whole open-vial/);
 let raw=JSON.stringify(recorded),writes=0;const lock=(_name,fn)=>fn();
 const writer=create({read:()=>raw,write:s=>{raw=s;writes++},initialSnapshot:raw,lock});
 const result=await writer.transaction(JSON.parse(raw),s=>edit(s,editInput(s)));
 assert.equal(writes,1);assert.equal(raw,JSON.stringify(result.next));
 const stale=create({read:()=>raw,write:s=>{raw=s;writes++},initialSnapshot:JSON.stringify(recorded),lock});
 await assert.rejects(stale.transaction(recorded,s=>edit(s,editInput(s))),/changed/);
 assert.equal(writes,1);
 let broken=JSON.stringify(recorded);
 const quota=create({read:()=>broken,write:()=>{throw Error("quota")},initialSnapshot:broken,lock});
 await assert.rejects(quota.transaction(JSON.parse(broken),s=>edit(s,editInput(s))),/quota/);
 assert.equal(broken,JSON.stringify(recorded));
 const noLock=create({read:()=>broken,write:s=>{broken=s},initialSnapshot:broken});
 await assert.rejects(noLock.transaction(JSON.parse(broken),s=>edit(s,editInput(s))),/lock required/);
 assert.equal(broken,JSON.stringify(recorded));
 console.log("PASS: exclusive Edit Outflow adjusts exact physical vial and event with original edit history, Undo, sealed/whole guards, stale/quota/no-lock");
})().catch(e=>{console.error(e);process.exitCode=1});
