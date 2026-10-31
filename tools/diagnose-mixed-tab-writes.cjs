/* PR124 expected-failure diagnostic: cross-tab ordinary saves bypass Web Lock.
 * Fictional isolated V8 tab simulations, not real two-browser-tab timing.
 * Run manually: node tools/diagnose-mixed-tab-writes.cjs
 * While the issue exists, exits 1 and must remain a release blocker.
 */
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../assets/js/nexus-write-coordinator.js'),'utf8');
function isolate(){const module={exports:{}};vm.runInNewContext(source,{module});return module.exports}
async function main(){
 let raw=JSON.stringify({supplies:[{id:'Fictional vial',remainingMg:10}],peptides:{Fictional:{doses:[]}},settings:{theme:'dark'}});
 const held=new Set(),name='peptide-tracker-html-v1:inventory-transfer';
 const lock=async(k,fn)=>{assert.equal(held.has(k),false);held.add(k);try{return await fn()}finally{held.delete(k)}};
 const tab=()=>isolate().create({read:()=>raw,write:value=>{raw=value},lock,lockName:name,initialSnapshot:raw});
 const a=tab(),b=tab();let begin,release;
 const entered=new Promise(r=>begin=r),paused=new Promise(r=>release=r);
 const original=JSON.parse(raw);
 const stockSave=a.transaction(original,async next=>{
   begin();await paused;next.supplies[0].remainingMg-=2;
   next.peptides.Fictional.doses.push({id:'D1',dose:2});return {next};
 });
 await entered;
 assert.equal(held.has(name),true);
 let ordinary='REJECTED';
 try{b.saveLegacy({...original,settings:{theme:'light'}});ordinary='COMMITTED'}
 catch(e){ordinary='REJECTED: '+e.message}
 release();let inventory;
 try{await stockSave;inventory='COMMITTED'}catch(e){inventory='REJECTED: '+e.message}
 const final=JSON.parse(raw);
 assert.equal(final.supplies[0].remainingMg,10);
 assert.equal(final.peptides.Fictional.doses.length,0);
 assert.equal(final.settings.theme,'light');
 const gap=ordinary==='COMMITTED';
 console.log(JSON.stringify({status:gap?'FAIL_SAFETY_GATE':'PASS',
   scenario:'Tab A holds exclusive inventory lock; Tab B ordinary whole-state save',
   ordinary,inventory,lockHeldDuringOrdinary:true,final,
   limitation:'isolated V8 tab simulation; true browser-process timing NOT TESTED'},null,2));
 if(gap)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});
