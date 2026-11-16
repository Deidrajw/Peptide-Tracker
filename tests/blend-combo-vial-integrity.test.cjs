"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("assets/js/04-nexus.js","utf8");
const head=source.indexOf("function planAndApplyComboDoses(");
const tail=source.indexOf("\n}\n",head)+3;
assert.ok(head>=0&&tail>head,"Live combo-dose planner must exist");
const planner=source.slice(head,tail);
let nextId=1;
const state={supplies:[]};
const context={
  state,
  cfg:(name)=>({unit:"mg",defaultSchedule:1}),
  doseToMg:(amount,unit)=>unit==="mcg"?Number(amount)/1000:Number(amount),
  mgToUnit:(mg,unit)=>unit==="mcg"?mg*1000:mg,
  uid:()=>nextId++,
  nexusAdminSites:(method)=>method==="SubQ"?["Abdomen"]:["Deltoid"],
  getEligibleSourceKits:(name)=>state.supplies.filter(k=>k.name===name)
    .flatMap(kit=>kit.vials.filter(v=>v.status==="open"||v.status==="active").map(vial=>({kit,vial}))),
  migrateKitToV2:(kit)=>{if(!kit.isBlend&&kit.vials.some(v=>v.remainingMg===undefined))throw Error("bad fixture");},
  getVialRemainingMg:(kit,vial)=>kit.isBlend
    ? Math.max(0,Number(kit.vialMg)-kit.doseLog.filter(x=>String(x.vialId)===String(vial.id)).reduce((n,x)=>n+x.totalMgDrawn,0))
    : vial.remainingMg,
  consumeCompoundInventory:({kit,amountMg,reason,transactionId})=>{
    if(kit.forceFailure)return {committed:false,allocations:[]};
    const vial=kit.vials.find(v=>v.status==="open");
    const available=context.getVialRemainingMg(kit,vial);
    if(amountMg>available+0.001)return {committed:false,allocations:[]};
    const entry={id:nextId++,vialId:vial.id,totalMgDrawn:amountMg,kind:reason,transactionId};
    kit.doseLog.push(entry);
    if(context.getVialRemainingMg(kit,vial)<=0.01)vial.status="empty";
    return {committed:true,allocations:[{kitId:kit.id,vialId:vial.id,amountMg,ledgerId:entry.id}]};
  }
};
vm.createContext(context);
vm.runInContext(planner,context);
const blend={id:"blend",name:"Deadpool",isBlend:true,vialMg:30,doseLog:[],
  vials:[{id:"blend-vial",status:"open",bacMl:3}]};
const ordinary={id:"ordinary",name:"Fictional Test",isBlend:false,vialMg:10,
  vials:[{id:"regular-vial",status:"open",remainingMg:10}]};
state.supplies=[blend,ordinary];
function logCombo(){
  return context.planAndApplyComboDoses([
    {name:"Deadpool",doseVal:"3"},{name:"Fictional Test",doseVal:"1"}
  ],"2026-11-15T12:00","Abdomen","",nextId++,[],
  {method:"SubQ",grouping:"mixed"});
}
for(let i=1;i<=3;i++){
  const result=logCombo();
  assert.equal(result.ok,true,"blend combo should save");
  const d=result.doses.find(x=>x.name==="Deadpool").dose;
  assert.equal(d.isBlendDose,true,"blend Undo must use exact ledger path");
  assert.equal(d.allocations.length,1);
  assert.equal(d.allocations[0].amount,3);
  assert.ok(d.allocations[0].ledgerId,"physical blend ledger identity required");
  assert.equal(state.supplies[0].vials[0].status,"open","nonempty blend must stay open");
  assert.equal(state.supplies[0].doseLog.length,i);
  assert.equal(state.supplies[1].vials[0].remainingMg,10-i);
}
assert.equal(state.supplies[0].vials[0].remainingMg,undefined,"never use ordinary v2 balance for historical blend");
state.supplies[0].vials[0].remainingMg=0; // historical stale field must not drive balance
let res=logCombo();
assert.equal(res.ok,true);assert.equal(res.doses[0].dose.allocations[0].amount,3);
assert.equal(state.supplies[0].vials[0].status,"open");
assert.equal(state.supplies[0].doseLog.length,4);
// A failed late source must undo both earlier source and ledger mutations.
const before=JSON.stringify(state.supplies);
state.supplies[1].vials[0].remainingMg=6;
const beforeFailure=JSON.stringify(state.supplies);
state.supplies[1].vials[0].remainingMg=7;
// Force the second source to fail after the blend ledger has been written.
const originalGet=context.getVialRemainingMg;
let count=0;
context.getVialRemainingMg=(kit,vial)=>{
  if(kit.isBlend&&++count>3)throw Error("stale ledger");
  return originalGet(kit,vial);
};
res=logCombo();
assert.equal(res.ok,false);
assert.equal(JSON.stringify(state.supplies),JSON.stringify(JSON.parse(beforeFailure).map((k,i)=>i===1?{...k,vials:[{...k.vials[0],remainingMg:7}]}:k)),"on failure stock snapshot is restored");
const after=fs.readFileSync("assets/js/04-nexus.js","utf8");
assert.match(after,/vial\.bacMl=actualBac/,"exact vial BAC correction persisted");
assert.match(after,/vialId:vial\.id,date:newDate\\|\\|null,bacMl:actualBac/,"BAC correction linked to physical vial");
assert.match(after,/kit default:.*unverified/,"legacy display identifies unverified kit value");
console.log("PASS fictional repeated blend combos, exact ledger allocations, rollback and per-vial BAC source checks");
