'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const ui=fs.readFileSync('assets/js/05-nexus.js','utf8');
const writer=fs.readFileSync('assets/js/04-nexus.js','utf8');
assert.match(writer,/const NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED = false;/,
  'LIVE nasal writer safety gate must remain OFF');
assert.match(writer,/if\(!NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED\)\s*throw Error/,
  'Exclusive LIVE nasal gate must continue to reject writes');
const first=ui.indexOf('function nexusNasalDoseModal(');
const last=ui.indexOf('function nexusChoosePhysicalForm(',first);
assert(first>=0&&last>first,'Prepared spray UI function must be discoverable');
const fn=ui.slice(first,last);
assert.match(fn,/if\(!_demoActive&&!NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED\)/,
  'LIVE guard must appear before constructing the save form');
assert.match(fn,/nx-spray-save-error/,'DEMO errors should appear inline by Confirm & save');
assert.match(fn,/feedback\.scrollIntoView/,'Save errors should be brought into view on a long sheet');
assert.match(fn,/else result=await nexusCommitPreparedNasalOperation/,
  'LIVE save path must not bypass the exclusive writer gate');
let html='';
let shown=0;
const fakeModal={
 classList:{add(){}},
 querySelector(){return {onclick:null};}
};
const sandbox={
 state:{formulationStocks:[{id:'fictional-bottle',compound:'Oxytocin',containerType:'nasal-bottle',
  method:'Nasal',balanceStatus:'verified',remainingMg:0.45,remainingMl:9,mgPerSpray:0.05,mlPerSpray:0.1}]},
 cfg(){return {unit:'mcg'};},
 _demoActive:false,
 NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED:false,
 showErrorBanner(){throw Error('Unexpected validation failure');},
 esc:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'),
 openModal(x){shown++;html=x;return fakeModal;},
 closeModal(){}
};
vm.runInNewContext(fn+'\nnexusNasalDoseModal("Oxytocin")',sandbox,{timeout:1500});
assert.equal(shown,1,'Blocked LIVE user should receive exactly one notice');
assert.match(html,/Nasal dose logging unavailable/);
assert.match(html,/No dose or bottle balance has been changed/);
assert.match(html,/nx-nasal-gate-close/);
assert.doesNotMatch(html,/Confirm & save|nx-spray-save|Review spray count/,
 'LIVE user must not encounter a button which is guaranteed to fail');
console.log('PASS: 7 nasal LIVE gate/inline-feedback/zero-write static + executable notice assertions');
