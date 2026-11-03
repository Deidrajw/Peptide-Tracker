const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");

// Exercise the actual Settings → Backup & Restore handler, not a rewritten
// imitation. All inventory below is fictional; no network or LIVE storage.
const script=fs.readFileSync(path.join(__dirname,"../assets/js/11-nexus.js"),"utf8");
const begin=script.indexOf("function importData(e) {");
const end=script.indexOf("// ─── Profile modal",begin);
assert.ok(begin>=0&&end>begin,"Actual settings restore function available");
const handler=script.slice(begin,end);
assert.match(handler,/Array\.isArray\(incoming\.supplies\)/,"Stash counts actual supplies");
assert.match(handler,/writer\.transaction\(original,/,"Restore uses exact durable CAS snapshot");

const original=()=>({peptides:{"Fictional Sample":{doses:[]}},dailyLogs:[{id:"OLD"}],
  supplies:[{id:"OLD-KIT",name:"Fictional Sample",vials:[{id:"OLD-V",status:"sealed",expectedMg:5}]}]});
const incoming=()=>({peptides:{"Fictional New":{doses:[]}},dailyLogs:[{id:"NEW"}],
  weightLogs:[],supplementLogs:[],supplies:[{id:"NEW-KIT",name:"Fictional New",
    vials:[{id:"NEW-V",status:"sealed",expectedMg:2}]}]});
const lock=async(_name,callback)=>callback();
function createHarness({stale=false,quota=false}={}){
 const primary="peptide-tracker-html-v1",storage=new Map([[primary,JSON.stringify(original())]]);
 let writes=0,errors=[],alerts=[],recoveryWrites=0;
 const read=()=>storage.get(primary)??null;
 const write=value=>{writes++;storage.set(primary,value)};
 const writer=create({read,write,lock,initialSnapshot:read()});
 const ui={...original(),plans:{goals:[],research:[],shopping:[]},settings:{showHints:true}};
 const fields={};
 for(const id of ["#nx-import-close","#nx-import-cancel","#nx-restore-word","#nx-import-confirm"]){
  fields[id]={id,value:id==="#nx-restore-word"?"RESTORE":"",style:{},disabled:false,
   onclick:null,oninput:null,focus:()=>{}};
 }
 const box={querySelector:id=>fields[id]};
 class Reader {
  readAsText(file){this.onload({target:{result:file.payload}})}
 }
 const sandbox={
  FileReader:Reader,document:{querySelector:selector=>selector===".modal"?box:null},
  localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>{
    if(key!==primary){if(quota)throw Error("QuotaExceededError");recoveryWrites++;}
    storage.set(key,value);
  }},
  STORE_KEY:primary,state:ui,_demoActive:false,_nexusLastSavedSnapshot:null,
  nexusWriter:()=>writer,
  migrate:record=>({...record,plans:{goals:[],research:[],shopping:[]},settings:{showHints:true}}),
  openModal:html=>{sandbox.reviewHTML=html},closeModal:()=>{},render:()=>{},
  showSaveWarning:()=>{},esc:s=>s,console:{error:(...args)=>errors.push(args)},
  alert:message=>alerts.push(message)
 };
 vm.runInNewContext(handler+"\nthis.importData=importData;",sandbox);
 if(stale){const concurrent={...original(),marker:"OTHER-TAB"};storage.set(primary,JSON.stringify(concurrent))}
 return {sandbox,writer,storage,fields,alerts,errors,
  get writes(){return writes},get recoveryWrites(){return recoveryWrites},
  async submit(){
   sandbox.importData({target:{files:[{size:100,name:"fictional.json",
    payload:JSON.stringify(incoming())}],value:"file"}});
   await fields["#nx-import-confirm"].onclick();
  }};
}
(async()=>{
 const success=createHarness();
 await success.submit();
 assert.match(success.sandbox.reviewHTML,/Stash kits/);
 assert.match(success.sandbox.reviewHTML,/Stash kits[^]*?<strong>1<\/strong>/);
 assert.equal(success.writes,1,"Restore persists once");
 assert.equal(success.recoveryWrites,1,"Previous records get a separate backup");
 assert.equal(JSON.parse(success.storage.get("peptide-tracker-html-v1")).supplies[0].id,"NEW-KIT");
 assert.equal(success.sandbox.state.supplies[0].id,"NEW-KIT");
 const stale=createHarness({stale:true});
 await stale.submit();
 assert.equal(stale.writes,0,"Competing tab data must never be overwritten");
 assert.equal(JSON.parse(stale.storage.get("peptide-tracker-html-v1")).marker,"OTHER-TAB");
 assert.ok(stale.alerts.some(s=>s.includes("Restore blocked")));
 assert.match(stale.errors[0][1].message,/changed|uncertain/);
 const quota=createHarness({quota:true});
 await quota.submit();
 assert.equal(quota.writes,0,"Failure to make recovery copy must cancel restore");
 assert.equal(JSON.parse(quota.storage.get("peptide-tracker-html-v1")).supplies[0].id,"OLD-KIT");
 assert.ok(quota.alerts.some(s=>s.includes("Restore could not be verified")));
 console.log("PASS: real Settings restore handler canonical migrated-state CAS, stash preview count, recovery copy, stale-tab and quota fail-closed");
})().catch(e=>{console.error(e);process.exitCode=1});
