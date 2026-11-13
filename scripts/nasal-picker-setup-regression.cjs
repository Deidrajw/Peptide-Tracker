const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const src=fs.readFileSync(path.join(__dirname,"../assets/js/04-nexus.js"),"utf8");
const start=src.indexOf("function todayLogDosePicker() {");
const end=src.indexOf("// Snooze —",start);
assert.ok(start>=0&&end>start,"Log Dose picker source anchor");
const fn=src.slice(start,end);
function check(forms,active=false){
 let html="",editor=null,doseCalls=0;
 const selected={value:""},single={};
 const modal={classList:{add(){}},querySelector(q){
   if(q==="#x")return {};
   if(q==="#today-dose-compound")return selected;
   if(q==="#today-dose-single")return single;
   if(q==="#today-dose-combo")return null;
   return null;
 }};
 const state={supplies:[],formulationStocks:forms,customPeptides:{Semax:{status:active?"active":"archived",doses:[]}}};
 const scope={state,allPeptides:()=>state.customPeptides,getVialRemainingMg:()=>0,esc:s=>s,
   openModal:s=>(html=s,modal),closeModal(){},nexusAddFormulationModal:(...args)=>editor=args,
   nexusChoosePhysicalForm:()=>{doseCalls++;return true;},doseModal:()=>{doseCalls++;}};
 vm.createContext(scope);vm.runInContext(fn+"\ntodayLogDosePicker();",scope);
 return {html,select(name){
   const found=[...html.matchAll(/<option value="(\d+)">([^<]+)<\/option>/g)].find(x=>x[2].startsWith(name));
   assert.ok(found,"Missing "+name);selected.value=found[1];single.onclick();
   return {editor,doseCalls};
 }};
}
const partial={id:"form-semax",compound:"Semax",method:"Nasal",containerType:"nasal-bottle",remainingMl:10,remainingMg:10,mgPerSpray:null};
const complete={...partial,mlPerSpray:.1,mgPerSpray:.1};
let x=check([partial]);assert.match(x.html,/Semax · Pump volume missing/);
let r=x.select("Semax");assert.deepEqual(r.editor,["nasal-bottle","form-semax"]);assert.equal(r.doseCalls,0);
x=check([partial],true);r=x.select("Semax");assert.ok(r.editor);assert.equal(r.doseCalls,0);
x=check([complete]);assert.doesNotMatch(x.html,/Pump volume missing/);r=x.select("Semax");assert.equal(r.editor,null);assert.equal(r.doseCalls,1);
x=check([partial,{id:"ox",compound:"Oxytocin",method:"Nasal",containerType:"nasal-bottle",remainingMl:9,remainingMg:4.5,mlPerSpray:.1,mgPerSpray:.05}]);
assert.match(x.html,/Oxytocin/);assert.match(x.html,/Semax · Pump volume missing/);
x=check([{...partial,status:"finished"}]);assert.doesNotMatch(x.html,/Pump volume missing/);
console.log("PASS 5 fictional nasal-picker regressions: archived/active unconfigured, configured, other stock, finished");
