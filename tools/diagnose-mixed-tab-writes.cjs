/* PR124 release gate: simulated mixed settings and inventory writes share the
 * same exclusive coordinator. This is an isolated V8 contention test; actual
 * Chromium application handlers are exercised by the browser regression.
 */
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../assets/js/nexus-write-coordinator.js'),'utf8');
function isolate(){const module={exports:{}};vm.runInNewContext(source,{module});return module.exports}
async function main(){
 let raw=JSON.stringify({supplies:[{id:'Fictional vial',remainingMg:10}],peptides:{Fictional:{doses:[]}},settings:{theme:'dark'}});
 const name='peptide-tracker-html-v1:inventory-transfer';
 let tail=Promise.resolve(),active=0,maxActive=0;
 const lock=async(key,fn)=>{
  assert.equal(key,name);
  const prior=tail;let release;
  tail=new Promise(resolve=>{release=resolve});
  await prior;active++;maxActive=Math.max(maxActive,active);
  try{return await fn()}finally{active--;release()}
 };
 const tab=()=>isolate().create({read:()=>raw,write:value=>{raw=value},lock,lockName:name,initialSnapshot:raw});
 const a=tab(),b=tab();let begin,resume;
 const entered=new Promise(resolve=>begin=resolve),paused=new Promise(resolve=>resume=resolve);
 const original=JSON.parse(raw);
 const stockSave=a.transaction(original,async next=>{
  begin();await paused;next.supplies[0].remainingMg-=2;
  next.peptides.Fictional.doses.push({id:'D1',dose:2});return {next};
 });
 await entered;
 let settingsResult='PENDING';
 const settingsSave=b.transaction(original,next=>{
  next.settings.theme='light';return {next};
 }).then(()=>{settingsResult='COMMITTED'},e=>{settingsResult='REJECTED: '+e.message});
 await Promise.resolve();
 assert.equal(settingsResult,'PENDING','Settings save must queue behind stock transaction');
 resume();
 await stockSave;
 await settingsSave;
 assert.match(settingsResult,/^REJECTED:/,'Stale settings save must reject, not overwrite stock');
 assert.equal(maxActive,1,'Cross-tab transactions must never overlap inside the lock');
 let final=JSON.parse(raw);
 assert.equal(final.supplies[0].remainingMg,8);
 assert.equal(final.peptides.Fictional.doses.length,1);
 assert.equal(final.settings.theme,'dark');
 const fresh=tab(),current=JSON.parse(raw);
 await fresh.transaction(current,next=>{next.settings.theme='light';return {next}});
 final=JSON.parse(raw);
 assert.equal(final.supplies[0].remainingMg,8);
 assert.equal(final.peptides.Fictional.doses.length,1);
 assert.equal(final.settings.theme,'light');
 assert.equal(typeof a.saveLegacy,'undefined');
 assert.equal(typeof b.removeLegacy,'undefined');
 const sourceDir=path.resolve(__dirname,'../assets/js');
 const remaining=[];
 for(let i=1;i<=12;i++){
  const filename=String(i).padStart(2,'0')+'-nexus.js';
  const lines=fs.readFileSync(path.join(sourceDir,filename),'utf8').split('\n');
  for(let n=0;n<lines.length;n++){
   const line=lines[n];
   if(/^\s*(?:\/\/|\*)/.test(line))continue;
   if(/\bsaveState\s*\(|\b(?:saveLegacy|removeLegacy)\s*\(/.test(line) ||
       (/\bnexusEraseSavedState\s*\(/.test(line) &&
        !/^\s*(?:async\s+)?function\s+nexusEraseSavedState\s*\(/.test(line) &&
        !/\bawait\s+nexusEraseSavedState\s*\(/.test(line)))remaining.push(filename+':'+(n+1));
  }
 }
 assert.deepEqual(remaining,[],'Unlocked save/erase caller paths remain');
 console.log(JSON.stringify({status:'PASS',unlockedCallSites:remaining,
  scenario:'Two simulated tabs contend over inventory and settings through one exclusive lock',
  staleSettings:settingsResult,maxConcurrentTransactions:maxActive,final,
  limitation:'isolated V8 contention test; actual Chromium handlers tested separately'},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
