"use strict";
// Executes Nexus's actual blend accounting functions (not simplified mock versions).
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const src3=fs.readFileSync("assets/js/03-nexus.js","utf8");
const src4=fs.readFileSync("assets/js/04-nexus.js","utf8");
function get(name,source){
  const start=source.indexOf("function "+name+"(");
  assert(start>=0,"Missing application function: "+name);
  const end=source.indexOf("\n}\n",start);
  assert(end>start,"Incomplete application function: "+name);
  return source.slice(start,end+3);
}
let id=1;const state={supplies:[]};
const context={
  state,uid:()=>String(id++),localDatetime:()=>"2026-11-15T12:00:00",
  cfg:()=>({unit:"mg",defaultSchedule:1}),doseToMg:Number,mgToUnit:Number,
  nexusAdminSites:()=>["Abdomen"],
  ensureKitVials:kit=>kit.vials,
  getKitActiveWasteMg:()=>0,
  getActiveVial:kit=>kit.vials.find(v=>["open","active"].includes(v.status))||null,
  getSealedVials:kit=>kit.vials.filter(v=>v.status==="sealed"),
  kitSealedVialsV2:kit=>kit.vials.filter(v=>v.status==="sealed"),
  getEligibleSourceKits:name=>state.supplies.filter(k=>k.name===name)
    .flatMap(kit=>kit.vials.filter(v=>["open","active"].includes(v.status)).map(vial=>({kit,vial})))
};
vm.createContext(context);
for(const name of ["getBlendKitRemainingMg","getBlendOpenVialRemainingMg"])
  vm.runInContext(get(name,src3),context);
for(const name of ["migrateKitToV2","getVialRemainingMg","consumeCompoundInventory","planAndApplyComboDoses"])
  vm.runInContext(get(name,src4),context);
for(const legacy of [false,true]){
  state.supplies=[{
    id:"K1",name:"Fictional premixed blend",isBlend:true,activeKit:true,
    totalVials:2,openedVials:1,emptyVials:0,vialMg:30,
    reconDate:"2026-11-15T08:00",doseLog:[],wasteLog:[],
    ...(legacy?{blendInventoryMode:"legacy-v2"}:{}),
    vials:[{id:"V1",status:"open",vialMg:30,reconDate:"2026-11-15T08:00",remainingMg:legacy?30:0},
      {id:"V2",status:"sealed",vialMg:30,remainingMg:30}]
  },{
    id:"K2",name:"Fictional standard vial",vialMg:10,
    vials:[{id:"V3",status:"open",remainingMg:10}]
  }];
  const kit=state.supplies[0];
  const log=(amount=3)=>context.planAndApplyComboDoses([
    {name:kit.name,doseVal:String(amount)},
    {name:"Fictional standard vial",doseVal:"1"}
  ],"2026-11-15T12:00","Abdomen","",String(id++),[],
  {method:"SubQ",grouping:"mixed"});
  for(let n=1;n<=3;n++){
    const result=log();
    assert(result.ok,result.error||"Combo should be valid");
    const record=result.doses.find(d=>d.name===kit.name).dose;
    assert.equal(record.isBlendDose,true);
    assert.equal(record.allocations.length,1);
    assert.equal(record.allocations[0].amount,3);
    assert(record.allocations[0].ledgerId,"Missing undo-safe blend ledger ID");
    assert.equal(kit.doseLog.length,n);
    assert.equal(context.getBlendOpenVialRemainingMg(kit),30-3*n);
    assert.equal(kit.vials[0].status,"open");
    assert.equal(state.supplies[1].vials[0].remainingMg,10-n);
  }
  const final=context.consumeCompoundInventory({kit,amountMg:21,reason:"administered",transactionId:"finish"});
  assert.equal(final.committed,true);
  assert.equal(kit.vials[0].status,"empty");
  assert.equal(kit.doseLog.reduce((n,x)=>n+x.totalMgDrawn,0),30);
  assert.equal(log(1).ok,false,"A finished vial must not silently reopen");
}
assert.match(src4,/canCorrectPreparation=isActiveVial\|\|vial.status==="empty"\|\|vial.status==="finished"/);
assert.match(src4,/if\(isActiveVial\)\{s.reconDate=newDate;s.bacMl=actualBac;\}/);
assert.match(src4,/vial.bacMl=actualBac/);
assert.match(src4,/vialStatusAtCorrection:vial.status/);
console.log("PASS actual blend ledger, combo planner, both blend models, historical exact-vial BAC correction safeguards");
