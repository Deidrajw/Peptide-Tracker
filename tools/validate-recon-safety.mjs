import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync('assets/js/10-nexus.js','utf8');
const a=source.indexOf('function nxReconValidate(r) {');
const b=source.indexOf('function reconCalcView() {',a);
assert.ok(a>=0&&b>a,'Calculator validation must be defined before rendering');
const check=new Function(source.slice(a,b)+'; return nxReconValidate;')();
const base={vialMg:'5',bacMl:'2',dose:'1',unit:'mg',syringe:'100u'};
assert.equal(check(base).mlPerDose,0.4,'5mg in 2mL, 1mg dose -> 0.4mL');
assert.equal(check({...base,dose:'200',unit:'mcg'}).mlPerDose,0.08,'200mcg -> 0.08mL');
assert.equal(check({...base,dose:''}).mlPerDose,null,'Incomplete inputs show no draw');
const rejected=[
{vialMg:'-1'}, {vialMg:'0'}, {vialMg:'1oops'}, {bacMl:'0'},
{bacMl:'Infinity'}, {dose:'0'}, {dose:'NaN'}, {dose:'5.1'},
{dose:'1',syringe:'30u'}, {dose:'1',unit:'iu'}, {dose:'0.0001'},
{syringe:'unknown'}
];
for(const invalid of rejected){
  const result=check({...base,...invalid});
  assert.ok(result.error,'Expected an explicit error for '+JSON.stringify(invalid));
  assert.equal(result.mlPerDose,null,'Invalid input must never produce a draw volume');
}
console.log('PASS: 14 isolated calculator guards and examples');
