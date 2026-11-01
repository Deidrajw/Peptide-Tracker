import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Catalogue-only evaluation: do not boot the app or touch browser storage.
const source=fs.readFileSync('assets/js/03-nexus.js','utf8');
const boundary=source.indexOf('];\nconst EVIDENCE_BADGE');
assert.ok(boundary>0,'Cannot isolate catalogue source');
const library=vm.runInNewContext(source.slice(0,boundary+2)+'\nLIBRARY;',Object.create(null),{timeout:1500});
const names=library.map(x=>x.name);
const normalized=x=>x.trim().toLocaleLowerCase('en-CA');
assert.equal(names.length,103,'Expected 49 baseline + 54 curated additions including ATX-304');
assert.equal(new Set(names.map(normalized)).size,names.length,'Compound names must be unique, case-insensitively');
const requiredBioregulators=['Bronchogen','Cardiogen','Chonluten','Cortagen','Crystagen','Livagen','Ovagen','Pancragen','Prostamax','Testagen','Thymalin','Thymogen','Vesugen','Vilon'];
const additions=['ATX-304','SLU-PP-332','Eloralintide','Follistatin 344','Gonadorelin','L-Carnitine','N-Acetyl Selank Amidate','FOXO4-DRI'];
for(const name of [...requiredBioregulators,...additions]){
 assert.ok(names.includes(name),'Missing catalogue entry: '+name);
 const row=library.find(x=>x.name===name);
 assert.equal(typeof row.overview,'string','Missing research summary: '+name);
 assert.ok(row.overview.length>45,'Insufficient summary: '+name);
 assert.equal(row.evidence,'investigational','New research entry must not be presented as established: '+name);
 assert.ok(!Object.keys(row.meta||{}).some(k=>/dose|route|frequency|schedule|protocol/i.test(k)),'No unverified protocol defaults: '+name);
}
for(const name of requiredBioregulators){
 const row=library.find(x=>x.name===name);
 assert.equal(row.category,'Bioregulator','Category mismatch: '+name);
}
assert.match(library.find(x=>x.name==='SLU-PP-332').overview,/not a peptide/i);
assert.match(library.find(x=>x.name==='ATX-304').overview,/not a peptide/i);
assert.ok(library.find(x=>x.name==='ATX-304').aliases.includes('O304'));
assert.ok(!names.includes('SLU-PP-519'),'Unverified SLU-PP-519 cannot be introduced as a verified compound');
for(const sku of ['SK5','LC216','RT10','5AD','Adamax-1032da']){
 assert.ok(!names.includes(sku),'Vendor SKU must not be canonically imported: '+sku);
}
assert.ok(library.some(x=>x.name==='Cartalax')&&library.some(x=>x.name==='Pinealon'),'Previously approved catalogue records preserved');
console.log('PASS: '+names.length+' catalogue entries; 54 additions, bioregulators, types, duplicate names and no new dosing defaults.');
