"use strict";
// Real app's View Vial and Edit Reconstitution handlers with a fictional DOM shim.
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const source=fs.readFileSync("assets/js/04-nexus.js","utf8");
function extract(name){
 const start=source.indexOf("function "+name+"(");
 assert(start>=0,"Application function missing "+name);
 const end=source.indexOf("\n}\n",start);
 assert(end>start,"Application function truncated "+name);
 return source.slice(start,end+3);
}
let counter=0,modal=null,edits={date:"2026-11-03",bac:"3"};
const kit={id:"fictional-kit",name:"Fictional peptide",vialMg:30,bacMl:2,
  reconDate:"2026-11-14",reconHistory:[],
  vials:[{id:"finished-1",status:"empty",vialMg:30,
    reconDate:"2026-11-03",remainingMg:0},
    {id:"current-2",status:"open",vialMg:30,
    reconDate:"2026-11-14",remainingMg:21},
    {id:"sealed-3",status:"sealed",vialMg:30,remainingMg:30}]};
const state={supplies:[kit]};const errors=[];
const context={
 state,uid:()=>String(++counter),cfg:()=>({color:"#aabbcc"}),
 ensureKitVials:s=>s.vials,getVialRemainingMg:(_,v)=>v.remainingMg,
 fmtDate:x=>x,dayKey:x=>String(x||"").slice(0,10),esc:x=>String(x),
 showErrorBanner:m=>errors.push(m),closeModal:()=>{},render:()=>{},
 nexusCommitCurrentState:async()=>true,
 openModal:(html)=>{
  modal={html,querySelector:(sel)=>{
   if(!modal.controls)modal.controls={};
   if(!modal.controls[sel])modal.controls[sel]={value:sel==="#ev-date"?edits.date:sel==="#ev-bac"?edits.bac:"",onclick:null};
   return modal.controls[sel];
  }};
  return modal;
 }
};
vm.createContext(context);
for(const n of ["viewVialPreparationModal","editVialReconModal"])
 vm.runInContext(extract(n),context);
function view(id){context.viewVialPreparationModal(kit.id,id);return modal.html;}
async function edit(id,date,bac){
 edits={date,bac};context.editVialReconModal(kit.id,id);
 assert(modal.controls?.["#ev-save"]?.onclick,"Save handler missing");
 await modal.controls["#ev-save"].onclick();
}
assert.match(view("finished-1"),/kit default: 2 mL \(unverified\)/);
const before={status:kit.vials[0].status,remainingMg:kit.vials[0].remainingMg,
  reconDate:kit.reconDate,bacMl:kit.bacMl};
await edit("finished-1","2026-11-03","3");
assert.equal(kit.vials[0].bacMl,3);
assert.equal(kit.vials[0].status,before.status);
assert.equal(kit.vials[0].remainingMg,before.remainingMg);
assert.equal(kit.reconDate,before.reconDate);
assert.equal(kit.bacMl,before.bacMl);
assert.equal(kit.reconHistory.length,1);
assert.equal(kit.reconHistory[0].vialId,"finished-1");
assert.equal(kit.reconHistory[0].vialStatusAtCorrection,"empty");
assert.match(view("finished-1"),/BAC water added.*3 mL/s);
assert.doesNotMatch(view("current-2"),/BAC water added.*3 mL/s);
edits={date:"2026-11-14",bac:"1.5"};
await edit("current-2","2026-11-14","1.5");
assert.equal(kit.vials[1].bacMl,1.5);
assert.equal(kit.bacMl,1.5);
assert.equal(kit.vials[0].bacMl,3,"editing current must not rewrite historical vial");
assert.equal(kit.reconHistory.length,2);
const previous=JSON.stringify(kit);
context.editVialReconModal(kit.id,"sealed-3");
assert.equal(JSON.stringify(kit),previous);
assert.match(errors.at(-1),/previously reconstituted/);
console.log("PASS exact-vial historical BAC modal round trip without reopening, balance changes, or kit default overwrite");
