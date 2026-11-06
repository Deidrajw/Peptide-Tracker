const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
// This test deliberately exercises the real restore error handler, rather than
// an independent copy of the classification logic. Fixtures are fictional.
const restore = fs.readFileSync('assets/js/11-nexus.js','utf8');
const core = fs.readFileSync('assets/js/01-nexus.js','utf8');
const anchor = restore.indexOf('Review backup before restore');
const start = restore.indexOf('      }catch(err){', anchor);
const end = restore.indexOf('\n      }\n    };', start);
assert.ok(anchor>=0 && start>anchor && end>start, 'Locate exact backup restore catch');
const body = restore.slice(start + '      }catch(err){'.length, end);
const a = core.indexOf('function nexusBackedDoseStorageError(error){');
const b = core.indexOf('function nexusBackedDoseFailureMessage(error){', a);
assert.ok(a>=0 && b>a, 'Storage classification helper must exist');
const output = [];
const ctx = {
  console:{error:()=>{}},
  alert:msg=>output.push({kind:'alert',msg}),
  showSaveWarning:()=>output.push({kind:'warning'}),
  String, Error, Array
};
vm.runInNewContext(core.slice(a,b),ctx);
const invoke = vm.runInNewContext('(function(err){ let state={flag:"working"}; const oldState={flag:"preserved"}; '+body+';return state; })',ctx);
function exercise(error,warningExpected,alertPattern){
  output.length=0;
  const state=invoke(error);
  assert.equal(state.flag,'preserved','Restore failure preserves in-memory state');
  assert.equal(output.filter(x=>x.kind==='warning').length,warningExpected?1:0,'Only genuine storage failure gets global warning');
  assert.equal(output.filter(x=>x.kind==='alert').length,1);
  assert.match(output.find(x=>x.kind==='alert').msg,alertPattern);
}
exercise(new Error('Saved data changed since expected snapshot'),false,/Restore blocked:/);
exercise(new Error('prior write was uncertain'),false,/Restore blocked:/);
exercise(new Error('Invalid restored state'),false,/Restore could not be verified/);
exercise(Object.assign(new Error('Browser quota exceeded'),{name:'QuotaExceededError'}),true,/storage is full or unavailable/);
exercise(new Error('Storage readback mismatch'),true,/Restore could not be verified/);
assert.match(body,/nexusBackedDoseStorageError\(err\)/);
const success = restore.slice(anchor,start);
assert.match(success,/clearSaveWarningAfterVerifiedWrite\(\)/,'Verified restore clears previous storage error');
console.log('PASS: fictional restore stale/CAS, uncertain, invalid, quota/readback classification and recovery state');
