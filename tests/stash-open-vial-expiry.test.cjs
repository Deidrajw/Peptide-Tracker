'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

// Exercise the ACTUAL production functions, extracted without loading browser UI.
const source = fs.readFileSync(path.join(__dirname, '..', 'assets/js/10-nexus.js'), 'utf8');
function extract(start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, 'production function markers must exist: ' + start);
  return source.slice(a, b);
}
const runtime = {
  Date, Math, Number, Infinity,
  ensureKitVials: kit => kit.vials || [],
  getActiveVial: kit => (kit.vials || []).find(v => v.status === 'active' || v.status === 'open') || null,
  getVialRemainingMg: (_kit,v) => v.remainingMg,
  getKitRemainingMg: kit => (kit.vials || []).filter(v => v.status !== 'transferred').reduce((n,v) => n + (v.remainingMg || 0), 0),
  addDays: (date,n) => { const d = new Date(date); d.setUTCDate(d.getUTCDate() + n); return d.toISOString(); }
};
vm.createContext(runtime);
vm.runInContext(
  extract('function stashExpiryMs(s) {', '// ─── Reconstitution calculator') +
  extract('function computeKitStatus(s) {', '// Rough "doses worth remaining'),
  runtime
);
const sealed = () => ({status:'sealed',remainingMg:10,reconDate:null});
const relative = days => new Date(Date.now() + days * 86400000).toISOString();
const kit = {
  name:'Fictional compound', activeKit:true, expiryDays:28,
  reconDate:relative(-45), // legacy kit date must NEVER be treated as open-vial expiry
  vials:[{status:'empty',remainingMg:0,reconDate:relative(-45)}, ...Array.from({length:6}, sealed)]
};
assert.equal(runtime.stashExpiryMs(kit), Infinity, 'sealed-only kit ignores stale kit date');
assert.equal(runtime.computeKitStatus(kit).statusKey, 'healthy', 'six sealed vials do not display Expiring');
assert.equal(runtime.computeKitStatus(kit).expiryDaysLeft, null, 'no opened-vial timer');

const opened = {name:'Fictional open source', activeKit:true, expiryDays:28, reconDate:relative(-45),
  vials:[{status:'open',remainingMg:16,reconDate:relative(-3),expiryDays:28}]};
assert.equal(runtime.computeKitStatus(opened).statusKey, 'healthy', 'recently opened vial remains healthy');
assert.ok(Number.isFinite(runtime.stashExpiryMs(opened)), 'open vial has its own expiry');

opened.vials[0].reconDate=relative(-27);
assert.equal(runtime.computeKitStatus(opened).statusKey, 'expiring', 'open vial nearing expiry is flagged');
opened.vials[0].reconDate=relative(-40);
assert.equal(runtime.computeKitStatus(opened).statusKey, 'expiring', 'overdue open vial stays flagged');
opened.vials[0].status='empty';
assert.equal(runtime.stashExpiryMs(opened), Infinity, 'finished vial no longer creates warning');

const mixed={name:'Fictional multi-vial',activeKit:true,expiryDays:28,
  vials:[{status:'open',remainingMg:8,reconDate:relative(-3)}, {status:'open',remainingMg:9,reconDate:relative(-27)}, sealed()]};
const first=runtime.stashExpiryMs(mixed);
assert.ok(first < new Date(relative(20)).getTime(), 'earliest open vial drives expiry');
assert.equal(runtime.computeKitStatus(mixed).statusKey,'expiring', 'earliest open vial drives badge');
const transferred={...kit, vials:[{status:'transferred',remainingMg:0,reconDate:relative(-60)},sealed()]};
assert.equal(runtime.stashExpiryMs(transferred),Infinity,'transferred history cannot expire sealed stock');

assert.match(source,/ensureKitVials\(s\)\.filter\(v=>\["open","active"\]\.includes\(v\.status\) && v\.reconDate && Number\(getVialRemainingMg\(s,v\)\)>0\)/, 'reminders check individual open vial with material');
console.log('PASS: 8 focused fictional open-vial expiry assertions; source logic exercised; no production data');
