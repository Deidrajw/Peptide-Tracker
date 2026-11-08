const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const prepared=require("../assets/js/nexus-prepared-dose-transaction.js");
const {create}=require("../assets/js/nexus-write-coordinator.js");
// Extract the actual application handler in a fictional Node VM. The release
// candidate flag is enabled; the sandbox never touches browser storage.
const src=fs.readFileSync("assets/js/04-nexus.js","utf8");
assert.match(src,/const NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED\s*=\s*true\s*;/);
const begin=src.indexOf("async function nexusCommitPreparedNasalOperation(");
const end=src.indexOf("\nfunction getEligibleSourceKits(",begin);
assert.ok(begin>0&&end>begin,"real prepared app handler must exist");
const realHandler=src.slice(begin,end);
const fixture=()=>({
  supplies:[{id:"kit-test",name:"Fictional A",vials:[{id:"vial-test",status:"open",remainingMg:12}]}],
  formulationStocks:[{id:"bottle-test",compound:"Fictional A",containerType:"nasal-bottle",method:"Nasal",remainingMg:4,remainingMl:2,mgPerSpray:.1,mlPerSpray:.05,transactions:[]}],
  peptides:{"Fictional A":{doses:[]}},customPeptides:{},preparations:[]
});
const tx=id=>({type:"dose",tx:{id:"t"+id,doseId:"d"+id,compound:"Fictional A",sourceId:"bottle-test",sprays:2,method:"Nasal",trackingMode:"backed",sourceKind:"formulation-container",nativeUnit:"mg",date:"2026-11-07T12:00:00"}});
function context(start,{enabled=true,write}={}){
 let raw=JSON.stringify(start),writes=0,lastSaved=null;
 const writer=create({read:()=>raw,write:x=>{writes++;if(write)write(x);else raw=x},initialSnapshot:raw,lock:(_name,fn)=>fn()});
 const sandbox={
  state:JSON.parse(raw),_demoActive:false,
  NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED:enabled,
  NexusPreparedDoseTransaction:prepared,globalThis:{NexusPreparedDoseTransaction:prepared},
  nexusWriter:()=>writer,_nexusLastSavedSnapshot:null
 };
 vm.runInNewContext(realHandler+"; globalThis.appSave=nexusCommitPreparedNasalOperation",sandbox);
 return {sandbox,writer,get raw(){return raw},set raw(v){raw=v},get writes(){return writes},get saved(){return sandbox._nexusLastSavedSnapshot},async run(op){return await sandbox.globalThis.appSave(op)}};
}
(async()=>{
 const c=context(fixture());
 c.sandbox.state._selectedTab="stash";
 const done=await c.run(tx(1));
 assert.equal(c.writes,1);
 assert.equal(c.saved,c.raw);
 assert.equal(c.sandbox.state._selectedTab,"stash");
 assert.equal(done.next.formulationStocks[0].remainingMg,3.8);
 assert.equal(done.next.formulationStocks[0].remainingMl,1.9);
 assert.equal(done.next.peptides["Fictional A"].doses.length,1);
 assert.equal(done.next.supplies[0].vials[0].remainingMg,12);
 // The second tab changed persistent inventory, so even with matching
 // transient UI fields, a stale snapshot cannot be automatically rebased.
 const old=JSON.parse(c.raw);
 c.sandbox.state.supplies[0].vials[0].remainingMg=11;
 await assert.rejects(c.run(tx(2)),/Unsaved persistent changes/);
 assert.equal(c.writes,1);
 c.sandbox.state=JSON.parse(c.raw);
 c.raw=JSON.stringify({...old,supplies:[{...old.supplies[0],vials:[{...old.supplies[0].vials[0],remainingMg:11}]}]});
 await assert.rejects(c.run(tx(3)),/changed|reload/i);
 assert.equal(c.writes,1);
 const disabled=context(fixture(),{enabled:false});
 await assert.rejects(disabled.run(tx(4)),/disabled/);
 assert.equal(disabled.writes,0);
 const undo=context(fixture());
 await undo.run(tx(5));
 const op={type:"reverse",tx:{transactionId:"t5",reversalId:"r5",compound:"Fictional A",doseId:"d5",sourceId:"bottle-test"}};
 await undo.run(op);
 const state=JSON.parse(undo.raw);
 assert.equal(state.formulationStocks[0].remainingMg,4);
 assert.equal(state.formulationStocks[0].remainingMl,2);
 assert.equal(state.formulationStocks[0].transactions.length,2);
 assert.equal(state.peptides["Fictional A"].doses.length,0);
 assert.equal(state.supplies[0].vials[0].remainingMg,12);
 await assert.rejects(undo.run({...op,tx:{...op.tx,reversalId:"again"}}),/already reversed/);
 assert.equal(undo.writes,2);
 const quota=context(fixture(),{write:()=>{throw Error("quota exceeded")}});
 await assert.rejects(quota.run(tx(6)),/quota/);
 assert.equal(quota.sandbox.state.formulationStocks[0].remainingMg,4);
 assert.equal(quota.writer.status().blocked,true);
 console.log("PASS real nasal app handler: candidate-enabled and simulated OFF protection, transient UI, exact durable writer, stale/persistent rejection, bottle debit, history, exact undo, no double vial debit, quota rollback");
})().catch(e=>{console.error(e);process.exitCode=1});
