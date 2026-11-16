const assert=require("node:assert/strict");
const {plan,commit,rollbackPlan,rollback}=require("../assets/js/nexus-physical-stock-correction.js");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const clone=x=>JSON.parse(JSON.stringify(x));
function fixture(){return {supplies:[{id:101,name:"Fictional Blend",isBlend:true,blendInventoryMode:"ledger",
 vials:[{id:501,status:"empty",remainingMg:0,vialMg:30}],
 doseLog:[{id:801,vialId:501,totalMgDrawn:9,date:"2026-10-01"}]}],
 peptides:{"Fictional Blend":{doses:[{id:901,dose:14,allocations:[{kitId:101,amount:0,vialId:null}]}]}}};}
function input(){return {enabled:true,kitId:101,vialId:501,newStatus:"open",measuredMl:1,
 verifiedMgPerMl:5,evidenceMethod:"calibrated-volume-and-documented-concentration",
 evidenceNote:"Calibrated volume recorded against preparation concentration.",
 backupLabel:"fictional-verified-backup",auditId:"stock-correction-fictional-001"};}
function harness(initial){
 let durable=JSON.stringify(initial), backups=[],writes=0, failWrite=false;
 const writer=create({read:()=>durable,write:s=>{if(failWrite)throw Error("Simulated disk fault");durable=s;writes++;},
 lock:async(name,fn)=>fn(),initialSnapshot:durable});
 return {writer,backup:async snapshot=>{const b=clone(snapshot);backups.push(b);return b},
 verifyBackup:async(b,s)=>JSON.stringify(b)===JSON.stringify(s),get:()=>JSON.parse(durable),
 getWrites:()=>writes,getBackups:()=>backups.length,setFail:x=>failWrite=x};
}
const auth={confirmed:true,confirmationText:"CORRECT PHYSICAL STOCK"};
const rollbackAuth={confirmationText:"ROLL BACK STOCK CORRECTION"};
const tests=[];
function test(name,fn){tests.push({name,fn})}
test("feature OFF rejects planning",()=>assert.throws(()=>plan(fixture(),{...input(),enabled:false}),/gate OFF/));
test("plan is read-only and does not infer remaining from ledger",()=>{
 const f=fixture(),before=JSON.stringify(f),p=plan(f,input());assert.equal(JSON.stringify(f),before);
 assert.equal(p.after.remainingMg,5);assert.equal(p.before.remainingMg,0);
});
test("no evidence or unsupported amount rejected",()=>{
 assert.throws(()=>plan(fixture(),{...input(),evidenceNote:"guess"}),/evidence/);
 assert.throws(()=>plan(fixture(),{...input(),measuredMl:7}),/capacity/);
 assert.throws(()=>plan(fixture(),{...input(),verifiedMgPerMl:0}),/concentration/);
});
test("refuses duplicate ledger ids",()=>{
 const f=fixture();f.supplies[0].doseLog.push(clone(f.supplies[0].doseLog[0]));
 assert.throws(()=>plan(f,input()),/Duplicate/);
});
test("confirmation and separate gate required",async()=>{
 const f=fixture(),p=plan(f,input()),h=harness(f);
 await assert.rejects(()=>commit(f,p,auth,{...h,featureEnabled:false}),/gate OFF/);
 await assert.rejects(()=>commit(f,p,{}, {...h,featureEnabled:true}),/confirmation/);
 assert.equal(h.getWrites(),0);
});
test("backups must be independently verified before write",async()=>{
 const f=fixture(),p=plan(f,input()),h=harness(f);
 await assert.rejects(()=>commit(f,p,auth,{...h,featureEnabled:true,verifyBackup:async()=>false}),/backup verification/);
 assert.equal(h.getWrites(),0);
});
test("exclusive writer adjusts only stock and appends audit",async()=>{
 const f=fixture(),p=plan(f,input()),h=harness(f);
 await commit(f,p,auth,{...h,featureEnabled:true});const n=h.get();
 assert.equal(h.getBackups(),1);assert.equal(h.getWrites(),1);
 assert.equal(n.supplies[0].vials[0].remainingMg,5);assert.equal(n.supplies[0].vials[0].status,"open");
 assert.deepEqual(n.supplies[0].doseLog,f.supplies[0].doseLog);
 assert.deepEqual(n.peptides,f.peptides);assert.equal(n.historicalStockCorrectionAudit.length,1);
});
test("stale and failed writes preserve existing durable data",async()=>{
 const f=fixture(),p=plan(f,input());f.peptides["Fictional Blend"].doses[0].notes="changed";
 const h=harness(f);
 await assert.rejects(()=>commit(f,p,auth,{...h,featureEnabled:true}),/Stale/);
 assert.equal(h.getWrites(),0);
 const f2=fixture(),p2=plan(f2,input()),h2=harness(f2);h2.setFail(true);
 await assert.rejects(()=>commit(f2,p2,auth,{...h2,featureEnabled:true}),/disk fault/);
 assert.deepEqual(h2.get(),f2);
});
test("rollback verifies old backup, retains audit and restores only vial",async()=>{
 const f=fixture(),p=plan(f,input()),h=harness(f);
 await commit(f,p,auth,{...h,featureEnabled:true});const after=h.get(),back=h.getBackups()?f:null;
 const rp=rollbackPlan(after,p.auditId,back);
 // Need a new writer instance on reload, as Nexus would rehydrate the committed snapshot.
 const h2=harness(after);await rollback(after,rp,rollbackAuth,{writer:h2.writer,featureEnabled:true});
 const n=h2.get();assert.equal(n.supplies[0].vials[0].remainingMg,0);
 assert.equal(n.supplies[0].vials[0].status,"empty");assert.equal(n.historicalStockCorrectionAudit.length,2);
 assert.deepEqual(n.peptides,f.peptides);
});
test("rollback blocks changed stock and repeat attempts",async()=>{
 const f=fixture(),p=plan(f,input()),h=harness(f);await commit(f,p,auth,{...h,featureEnabled:true});
 const n=h.get();n.supplies[0].vials[0].remainingMg=4;
 assert.throws(()=>rollbackPlan(n,p.auditId,f),/changed since correction/);
});
(async()=>{for(const t of tests){await t.fn();console.log("PASS "+t.name)}console.log("PASS "+tests.length+" fictional stock-correction assertions")})().catch(e=>{console.error(e);process.exitCode=1});
