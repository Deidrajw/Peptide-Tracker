const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const bridge=require("../assets/js/nexus-preparation-bridge.js");

// Execute the unchanged LIVE application handler in an isolated Node context.
// This turns ON only the test context's recorded-preparation gate; the actual
// source file and production flags remain OFF.
const app=fs.readFileSync(path.join(__dirname,"../assets/js/04-nexus.js"),"utf8");
const begin=app.indexOf("async function nexusCommitRecordedNasalPreparation(input)");
const end=app.indexOf("const NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED",begin);
assert.ok(begin>0&&end>begin,"Actual LIVE handler must be present");
const handler=app.slice(begin,end);
assert.match(handler,/NEXUS_RECORDED_NASAL_PREPARATION_ENABLED/);
assert.doesNotMatch(handler,/NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED/);
const lock=async(_name,callback)=>callback();
function fixture(){
 return {supplies:[{id:"fictional-kit",name:"Fictional Sample",vialMg:5,
  activeKit:false,openedVials:0,isBlend:false,
  vials:[{id:"fictional-vial",status:"sealed",expectedMg:5}]}],
  formulationStocks:[],preparations:[],peptides:{},customPeptides:{}};
}
const input={id:"fictional-transfer",destinationContainerId:"fictional-bottle",
 sourceKitId:"fictional-kit",sourceVialId:"fictional-vial",
 amountMg:5,bacMl:1,salineMl:9,volumeMl:10,mlPerSpray:0.1,
 confirmed:true,openSealed:true,priorUseStatus:"none",date:"2026-11-02T12:00:00"};
function harness(initial,{writeOverride}={}){
 let durable=JSON.stringify(initial),writes=0;
 const coordinator=create({initialSnapshot:durable,read:()=>durable,
  write:value=>{writes++;durable=writeOverride?writeOverride(value):value},lock});
 const sandbox={state:initial,_demoActive:false,
  NEXUS_RECORDED_NASAL_PREPARATION_ENABLED:true,
  NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED:false,
  _nexusLastSavedSnapshot:null,
  nexusWriter:()=>coordinator,globalThis:{NexusPreparationBridge:bridge}};
 vm.runInNewContext(handler+"\nthis.commit=nexusCommitRecordedNasalPreparation;",sandbox);
 return {sandbox,coordinator,get durable(){return durable},get writes(){return writes},
  replaceDurable:value=>{durable=value}};
}
(async()=>{
 const initial=fixture(),h=harness(initial);
 const result=await h.sandbox.commit(input);
 const stored=JSON.parse(h.durable);
 assert.equal(h.writes,1,"Source open and bottle transfer require a single write");
 assert.equal(initial.supplies[0].vials[0].status,"sealed","Input state must not mutate");
 assert.equal(stored.supplies[0].vials[0].status,"open");
 assert.equal(stored.supplies[0].vials[0].remainingMg,0);
 assert.equal(stored.supplies[0].vials[0].id,"fictional-vial");
 assert.equal(stored.formulationStocks[0].sourceVialId,"fictional-vial");
 assert.equal(stored.formulationStocks[0].remainingMg,5);
 assert.equal(result.container.id,"fictional-bottle");
 assert.equal(h.sandbox.state.formulationStocks[0].id,"fictional-bottle",
  "In-memory snapshot changes only after verified persistence");
 assert.equal(h.sandbox._nexusLastSavedSnapshot,h.durable);
 assert.equal(stored.customPeptides["Fictional Sample"],undefined,
  "Preparation must not invent logged administrations");
 const blocked=harness(fixture());
 blocked.sandbox.NEXUS_RECORDED_NASAL_PREPARATION_ENABLED=false;
 await assert.rejects(blocked.sandbox.commit(input),/unavailable|acceptance/i);
 assert.equal(blocked.writes,0);
 const legacy=fixture();
 legacy.supplies[0].activeKit=true;
 legacy.supplies[0].vials[0]={id:"fictional-vial",status:"open",expectedMg:5};
 const missing=harness(legacy);
 await assert.rejects(missing.sandbox.commit({...input,openSealed:false,
  adoptUnlabelled:true}),/unverified|legacy|canonical|balance/i);
 assert.equal(missing.writes,0,"Unknown remaining source must not save");
 assert.equal(missing.sandbox.state,legacy);
 const stale=harness(fixture());
 const newer=fixture();newer.marker="other-tab-saved";
 stale.replaceDurable(JSON.stringify(newer));
 await assert.rejects(stale.sandbox.commit(input),/changed|blocked/i);
 assert.equal(stale.writes,0,"Stale tab cannot overwrite inventory");
 const mismatch=harness(fixture(),{writeOverride:()=>JSON.stringify({invalid:true})});
 await assert.rejects(mismatch.sandbox.commit(input),/readback|reload/i);
 assert.equal(mismatch.coordinator.status().blocked,true);
 assert.equal(mismatch.sandbox.state.supplies[0].vials[0].status,"sealed");
 console.log("PASS: actual LIVE handler test-only gate, single-save source transfer, stale rejection, failed readback, legacy block, gated default");
})().catch(error=>{console.error(error);process.exitCode=1});
