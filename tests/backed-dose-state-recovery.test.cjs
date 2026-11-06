/* P0 save safety: entirely fictional vial/data, never users' backups. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const coordinator=require('../assets/js/nexus-write-coordinator.js');
const source=fs.readFileSync('assets/js/01-nexus.js','utf8');
const from=source.indexOf('function nexusPlanBackedPhysicalDose(snapshot,entry){');
const until=source.indexOf('/* PR124 backed-dose correction boundary',from);
assert.ok(from>=0&&until>from,'Backed planner and transactional handler must be present');
function fixture(){
 return {version:1,peptides:{Example:{doses:[]}},supplies:[{id:10,name:'Example',vialMg:5,activeKit:true,vials:[{id:20,status:'open',remainingMg:1.84,vialMg:5,intendedUse:'Injectable'}]}],_profileTab:'profile'};
}
function launch({changeObserved=false,writeFails=false}={}){
 const durable=fixture();let raw=JSON.stringify(durable),writes=0,warnings=0;
 const writer=coordinator.create({
  read:()=>raw,
  write:data=>{writes++;if(writeFails){const e=Error('Storage quota exceeded');e.name='QuotaExceededError';throw e;}raw=data;},
  lock:(_name,fn)=>fn(),initialSnapshot:raw
 });
 const ctx={state:{...durable,_profileTab:'settings'},_demoActive:false,
  _nexusLastSavedSnapshot:raw,nexusWriter:()=>writer,
  showSaveWarning:()=>warnings++,
  nexusPhysicalVialCompatible:(route,method)=>route==='Injectable'&&method==='SubQ',
  console:{error:()=>{}},Number,JSON,Math,String,Error};
 vm.createContext(ctx);
 vm.runInContext(source.slice(from,until),ctx);
 if(changeObserved)raw=JSON.stringify({...durable,_profileTab:'other-tab',_marker:'changed elsewhere'});
 const entry={name:'Example',dose:{id:100,date:'2026-11-05T11:24',dose:'150',method:'SubQ',trackingMode:'backed'},
  method:'SubQ',steps:[{kitId:10,vialId:20,mg:0.15}],nativeUnit:'mcg',
  expectedMassMg:0.15,builtin:true};
 return {ctx,entry,get raw(){return raw},get writes(){return writes},get warnings(){return warnings}};
}
(async()=>{
 const happy=launch();
 const saved=await happy.ctx.nexusCommitBackedPhysicalDose(happy.entry);
 assert.ok(saved,'Transient non-durable UI state must not block a valid backed dose');
 assert.equal(happy.ctx.state.supplies[0].vials[0].remainingMg,1.69);
 assert.equal(happy.ctx.state.peptides.Example.doses.length,1);
 assert.equal(happy.ctx.state.peptides.Example.doses[0].allocations[0].amount,150);
 assert.equal(happy.warnings,0,'Successful write must not show device-storage warning');
 assert.equal(JSON.parse(happy.raw).peptides.Example.doses.length,1,'Durable write required');

 const stale=launch({changeObserved:true});
 const before=stale.raw;
 assert.equal(await stale.ctx.nexusCommitBackedPhysicalDose(stale.entry),null,
  'Actually divergent storage must fail closed');
 assert.equal(stale.raw,before,'Stale tab must never overwrite concurrent changes');
 assert.equal(stale.writes,0,'Stale tab must not call write');
 assert.equal(stale.warnings,0,'Real stale-state conflict is not proof of device storage failure');
 assert.match(stale.ctx._nexusBackedPhysicalDoseFailure,/Saved data changed/i);

 const bad=launch();bad.entry.steps[0].vialId=999;
 assert.equal(await bad.ctx.nexusCommitBackedPhysicalDose(bad.entry),null);
 assert.equal(bad.writes,0,'Planner rejection must not write');
 assert.equal(bad.warnings,0,'Invalid vial should not trigger false device-storage warning');
 assert.match(bad.ctx._nexusBackedPhysicalDoseFailure,/selected vial/i);

 const failed=launch({writeFails:true});
 assert.equal(await failed.ctx.nexusCommitBackedPhysicalDose(failed.entry),null);
 assert.equal(failed.warnings,1,'True write failure still needs prominent storage warning');
 assert.equal(JSON.parse(failed.raw).peptides.Example.doses.length,0);
 assert.equal(failed.ctx.state.peptides.Example.doses.length,0);

 assert.match(source,/Dismiss storage warning/,'Storage warning must be user-dismissible');
 assert.match(source,/_saveWarningShown=false/,'Dismissal must allow future failure warnings');
 const ui=fs.readFileSync('assets/js/05-nexus.js','utf8');
 assert.ok(ui.includes('_nexusBackedPhysicalDoseFailure||'),
  'Review must explain the actual rejection category');
 console.log('PASS: fictional backed-dose write, real stale conflict, invalid vial, quota fail, warning lifecycle');
})().catch(error=>{console.error(error);process.exitCode=1;});
