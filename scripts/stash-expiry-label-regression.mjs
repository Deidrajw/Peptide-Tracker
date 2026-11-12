// Consolidated PR160/PR162 read-only source regression.
// Run: node scripts/stash-expiry-label-regression.mjs
// Fictional fixtures only; no browser storage, network, imports, or user records.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const src=fs.readFileSync(new URL('../assets/js/10-nexus.js',import.meta.url),'utf8');
const start=src.indexOf('function stashExpiryMs(s) {');
const end=src.indexOf('\n}',start)+2;
assert.ok(start>=0 && end>start,'production expiry helper exists');
const fn=new Function('ensureKitVials','getVialRemainingMg','addDays','return ('+src.slice(start,end)+')')(
  kit=>kit.vials||[],
  (_kit,v)=>Number(v.remainingMg)||0,
  (date,days)=>new Date(Date.parse(date)+Number(days)*86400000).toISOString()
);
const opened=(remaining,date,expiryDays)=>({status:'open',remainingMg:remaining,reconDate:date,expiryDays});
const kit=(vials)=>({reconDate:'2026-09-01',expiryDays:28,vials});
const sealed=kit([{status:'empty',remainingMg:0,reconDate:'2026-09-01'},{status:'sealed',remainingMg:10}]);
assert.equal(fn(sealed),Infinity,'sealed-only stock ignores historical kit reconDate');
assert.equal(fn(kit([opened(8,'2026-11-05')])),Date.parse('2026-12-03'),'usable open vial drives expiry');
assert.equal(fn(kit([opened(8,'2026-11-05',7)])),Date.parse('2026-11-12'),'vial-specific days override kit');
assert.equal(fn(kit([opened(0,'2026-09-01'),{status:'sealed',remainingMg:10}])),Infinity,'depleted open cannot expire sealed stock');
assert.equal(fn(kit([opened(0,'2026-09-01'),opened(8,'2026-11-05')])),Date.parse('2026-12-03'),'depleted older open cannot override usable open');
assert.equal(fn(kit([opened(8,'2026-11-05'),opened(9,'2026-11-01')])),Date.parse('2026-11-29'),'soonest usable open expiry wins');
assert.ok(src.includes('const currentReconDate = activeVialForCard?.reconDate || null;'),'card uses vial date');
assert.ok(src.includes('const num=displayNumbers.get(v.id)||"—";'),'legacy vial numbering fallback retained');
assert.ok(src.includes('while(usedNumbers.has(nextAvailable)) nextAvailable++;'),'number fallback remains collision-free');
assert.ok(src.includes('const activeVialForCard = s.isBlend ? getActiveVial(s) :'),'blend source selection stays separate');
assert.ok(src.includes('Number(getVialRemainingMg(s,v))>0) || getActiveVial(s)'),'card prefers usable open vial');
console.log('PASS: 11 consolidated Stash expiry/card/legacy numbering assertions; fictional-only');
