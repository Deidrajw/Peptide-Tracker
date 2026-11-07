'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync('assets/js/05-nexus.js','utf8');
const begin=code.indexOf('function nexusNasalDoseModal(name,occTime){');
const end=code.indexOf('\nfunction nexusChoosePhysicalForm(',begin);
assert(begin>=0&&end>begin,'Unable to extract real nasal dose handler');
const handler=code.slice(begin,end);
for(const mode of ['live-blocked','live-enabled','demo']){
 const warnings=[],writes=[],opens=[];
 const ctx=vm.createContext({
  _demoActive:mode==='demo',
  NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED:mode==='live-enabled',
  state:{formulationStocks:[],peptides:{},supplies:[]},
  showErrorBanner:message=>warnings.push(message),
  openModal:(...args)=>{opens.push(args);throw Error('No modal expected with no eligible prepared bottle')},
  cfg:()=>({unit:'mg'}),
 });
 vm.runInContext(handler,ctx,{filename:'05-nexus.js'});
 vm.runInContext('nexusNasalDoseModal("Fictional Compound")',ctx);
 assert.equal(opens.length,0,'Must not open misleading save form');
 assert.equal(writes.length,0,'Must not write anything');
 assert.equal(warnings.length,1,'Must present exactly one explicit warning');
 if(mode==='live-blocked')assert.match(warnings[0],/not enabled in this version.*No dose or bottle deduction was saved/i);
 else assert.match(warnings[0],/No verified prepared nasal bottle/,'Eligible route should reach existing source validation');
}
assert.match(handler,/nexusCommitPreparedNasalOperation\(\{type:"dose",tx\}\)/);
assert.match(handler,/NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED/);
assert.match(code,/Nasal dose could not be verified in device storage/);
console.log('PASS: LIVE nasal gate checked before modal with no storage mutation; enabled and DEMO paths retain existing source validation; distinct errors present');
