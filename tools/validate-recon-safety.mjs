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

const glutathione={vialMg:'1200',bacMl:'6',dose:'400',unit:'mg',syringe:'1mL'};
assert.equal(check(glutathione).mlPerDose,null,'An oversized selected syringe must suppress drawing guidance');
assert.match(check(glutathione).error,/exceeds the selected syringe capacity/i);
assert.equal(check({...glutathione,syringe:'3mL'}).mlPerDose,2,'Changing syringe without changing dose should recover 2 mL mathematical draw');
const viewEnd=source.indexOf('function calcPillClick(btn)',b);
assert.ok(viewEnd>b,'Calculator view source must exist');
const view=new Function('state','esc',source.slice(a,viewEnd)+';return reconCalcView();');
const markup=view({_recon:glutathione},String);
const pickerPos=markup.indexOf('id="rc-syringe-choice"');
const validationPos=markup.indexOf('id="rc-validation"');
const resultPos=markup.indexOf('id="rc-results"');
assert.ok(pickerPos>=0&&pickerPos<validationPos&&validationPos<resultPos,
  'Syringe selector must appear before capacity warning and conditional result');
assert.match(markup,/data-id="syringe" data-val="3mL"/,
  '3 mL selector must remain accessible while previous 1 mL is over capacity');
assert.ok(!markup.slice(resultPos).includes('data-id="syringe"'),
  'Conditional results must not contain duplicate syringe controls');
assert.match(markup,/Calculated volume exceeds the selected syringe capacity/,
  'Capacity warning is still shown with no drawing instruction');
const refreshed=view({_recon:{...glutathione,syringe:'3mL'}},String);
assert.ok(refreshed.includes('2.000 mL per dose'),
  'Valid 3 mL selection can render result without changing entered dose');
assert.match(markup,/id="rc-conc-hint"/,
  'Concentration hint must have the live-update target ID');
assert.ok(markup.includes('Creates 200.00 mg/mL solution'),
  '1200 mg in 6 mL should show 200 mg/mL, not a stale prior concentration');
assert.ok(source.includes('if(concEl)concEl.textContent=conc?'),
  'Changed input must refresh the concentration without rebuilding focused inputs');
assert.ok(source.includes('selectedSyringeLabel.textContent'),
  'Dynamic selection must update visible capacity label');
console.log('PASS: calculator guards + 1200mg/6mL/400mg syringe recovery and selector placement');

