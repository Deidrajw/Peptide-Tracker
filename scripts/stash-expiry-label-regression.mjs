// Read-only source regression. Run: node scripts/stash-expiry-label-regression.mjs
// Synthetic fixtures only; no app storage/imports/user data.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const src=fs.readFileSync(new URL('../assets/js/10-nexus.js',import.meta.url),'utf8');
const start=src.indexOf('function stashExpiryMs(s) {');
const end=src.indexOf('\n}',start)+2;
assert.ok(start>=0 && end>start,'expiry helper exists');
const fn=new Function('getActiveVial','addDays','return ('+src.slice(start,end)+')')(
  kit => kit.vials.find(v=>v.status==='open'||v.status==='active')||null,
  (d,days)=>new Date(new Date(d).getTime()+days*86400000).toISOString()
);
const old={reconDate:'2026-10-11',expiryDays:28,vials:[{status:'empty',reconDate:'2026-10-11'},{status:'sealed',reconDate:null}]};
assert.equal(fn(old),9999999999999,'sealed-only kit ignores historical reconstitution');
const opened={...old,vials:[{status:'open',reconDate:'2026-11-05'}]};
assert.equal(fn(opened),Date.parse('2026-12-03T00:00:00.000Z'),'open vial controls expiry');
assert.equal(fn({...opened,vials:[{status:'open',reconDate:null}]}),9999999999999,'missing date does not imply expired');
assert.ok(src.includes('const currentReconDate = activeVialForCard?.reconDate || null;'),'card uses same open-vial date');
assert.ok(src.includes('const num=displayNumbers.get(v.id)||"—";'),'vial number uses display fallback');
assert.ok(src.includes('while(usedNumbers.has(nextAvailable)) nextAvailable++;'),'fallback avoids existing numbers');
console.log('PASS stash expiry/status source and legacy display label guards (6 assertions)');
