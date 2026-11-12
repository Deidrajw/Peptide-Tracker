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


// Depleted-but-still-open legacy vials must NOT control badge, expiry sort,
// or the soonest-usable-vial date. No production data or migration involved.
const depleted = {name:'Fictional depleted open',activeKit:true,expiryDays:28,
  vials:[{status:'open',remainingMg:0,reconDate:relative(-50)},sealed()]};
assert.equal(runtime.stashExpiryMs(depleted), Infinity, 'depleted open vial cannot expire sealed stock');
assert.equal(runtime.computeKitStatus(depleted).expiryDaysLeft, null, 'depleted open vial has no expiry timer');
const otherOpen={name:'Fictional mixed open balances',activeKit:true,expiryDays:28,
  vials:[{status:'open',remainingMg:0,reconDate:relative(-50)}, {status:'open',remainingMg:8,reconDate:relative(-3)}]};
assert.equal(runtime.computeKitStatus(otherOpen).statusKey,'healthy', 'depleted historical open cannot override usable open vial expiry');
assert.equal(runtime.computeKitStatus(otherOpen).vialRem,8, 'status tracks remaining of usable open vial, not zero-balance legacy first vial');

assert.ok(runtime.stashExpiryMs(otherOpen) > Date.now(), 'expiry follows usable open vial instead of depleted old vial');
assert.match(source,/function stashExpiryMs\(s\)[\s\S]*?ensureKitVials\(s\)\.filter\(v=>\["open","active"\]\.includes\(v\.status\) && v\.reconDate && Number\(getVialRemainingMg\(s,v\)\)>0\)/, 'badge and sorting exclude depleted open vials as reminders already do');


// Evaluate the card's ACTUAL source selection against the user's screenshot case,
// not just a separate computeKitStatus() helper.
const cardSource = source.match(/const activeVialForCard = s\.isBlend \? getActiveVial\(s\) :[\s\S]*?getActiveVial\(s\)\);/)?.[0];
assert.ok(cardSource, 'production Stash card selection expression must be extractable');
function selectedCardVial(kit) {
  return vm.runInNewContext(cardSource + '\nactiveVialForCard', {
    s: kit,
    ensureKitVials: runtime.ensureKitVials,
    getActiveVial: runtime.getActiveVial,
    getVialRemainingMg: runtime.getVialRemainingMg,
    Number
  });
}
assert.equal(selectedCardVial(otherOpen).remainingMg, 8, 'rendered card selects second OPEN vial with 8 mg');
assert.equal(selectedCardVial(depleted).remainingMg, 0, 'no usable OPEN vial: original empty fallback remains');
assert.equal(selectedCardVial({...otherOpen,isBlend:true}).remainingMg,0, 'blend source selection remains untouched');

// The rendered card must select the same usable non-blend vial as status/expiry.
// Prevent the historical zero-balance OPEN record from driving 0mg / Empty UI.
assert.match(source,/const activeVialForCard = s\.isBlend \? getActiveVial\(s\)\s*:\s*\(ensureKitVials\(s\)\.find\(v=>\["open","active"\]\.includes\(v\.status\) && Number\(getVialRemainingMg\(s,v\)\)>0\) \|\| getActiveVial\(s\)\)/, 'Stash card uses usable OPEN source for non-blend kit');

assert.match(source,/ensureKitVials\(s\)\.filter\(v=>\["open","active"\]\.includes\(v\.status\) && v\.reconDate && Number\(getVialRemainingMg\(s,v\)\)>0\)/, 'reminders check individual open vial with material');
console.log('PASS: focused fictional open-vial expiry assertions including zero-balance open vials; source logic exercised; no production data');
