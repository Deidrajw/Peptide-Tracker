import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

// DIAGNOSTIC ONLY. These tests exercise the CURRENT calculator's rendering
// with disposable fictional browser contexts. A red result is not papered
// over as a pass, but does not block this documentation/QA-only branch.
// Before shipping any iOS dose/measurement calculator, all cases must PASS.
const VERSION = 'v0.9.11-beta';
const demoFile = path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
if (!fs.existsSync(demoFile)) throw new Error('Required exact-source full-app DEMO not found');
fs.mkdirSync('dist', {recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
let countFail=0;
try {
  for(const kind of ['live','demo']) for(const width of [320,390]) for(const theme of ['dark','light']) {
    const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
    const page=await ctx.newPage();
    const pageErrors=[];
    page.on('pageerror',error=>pageErrors.push(error.message));
    await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demoFile,{waitUntil:'domcontentloaded'});
    const readings=await page.evaluate(theme=>{
      document.documentElement.dataset.theme=theme;
      // No production user context: every browser context is freshly allocated,
      // and every calculation below uses ephemeral synthetic inputs.
      const previous=state._recon;
      function probe(syringe,unit='mg',amount='1',mass='10',volume='2') {
        state._recon={vialMg:mass,bacMl:volume,dose:amount,unit,freq:'daily',syringe};
        const el=document.createElement('section');
        el.innerHTML=reconCalcView();
        const main=el.querySelector('#rc-results')?.textContent || '';
        const draw=main.match(/Draw\s+([0-9.]+)\s+units/i);
        const onSyringe=main.match(/([0-9.]+)\s+units on your syringe/i);
        return {
          hasRecipe:main.includes('Your Recipe'),
          drawUnits:draw?Number(draw[1]):null,
          displayedUnits:onSyringe?Number(onSyringe[1]):null,
          displayedText:main.slice(0,140).replace(/\s+/g,' ').trim()
        };
      }
      try{
        return {
          u30:probe('30u'),u50:probe('50u'),u100:probe('100u'),
          mcg:probe('100u','mcg','1000'),
          genericIU:probe('100u','iu','1000'),
          negative:probe('100u','mg','-1'),
          empty:probe('100u','mg','','10','2'),
          invalidVolume:probe('100u','mg','1','10','0')
        };
      } finally {state._recon=previous;}
    },theme);
    const checks=[
      ['U-100 syringe size 30: displayed units must equal actual invariant scale',readings.u30.drawUnits!==null&&readings.u30.drawUnits===readings.u30.displayedUnits],
      ['U-100 syringe size 50: displayed units must equal actual invariant scale',readings.u50.drawUnits!==null&&readings.u50.drawUnits===readings.u50.displayedUnits],
      ['U-100 syringe size 100: displayed units must equal actual invariant scale',readings.u100.drawUnits!==null&&readings.u100.drawUnits===readings.u100.displayedUnits],
      ['Capacity selection must never change generic U-100 displayed unit measurement',readings.u30.displayedUnits===readings.u50.displayedUnits&&readings.u50.displayedUnits===readings.u100.displayedUnits],
      ['Mass conversion mg↔mcg yields equal computed measurement',readings.u100.drawUnits!==null&&readings.mcg.drawUnits===readings.u100.drawUnits],
      ['Unqualified IU must not silently create a medication mass/draw recipe',!readings.genericIU.hasRecipe],
      ['Negative amounts must not produce a preparation recipe',!readings.negative.hasRecipe],
      ['Empty amount should not show a result',!readings.empty.hasRecipe],
      ['Zero denominator should not show a result',!readings.invalidVolume.hasRecipe],
      ['No browser exceptions',pageErrors.length===0]
    ].map(([description,pass])=>({description,result:pass?'PASS':'FAIL'}));
    const failures=checks.filter(x=>x.result==='FAIL');
    countFail+=failures.length;
    results.push({kind,width,theme,status:failures.length?'FAIL':'PASS',checks,readings,exceptions:pageErrors});
    await ctx.close();
  }
} finally {await browser.close();}
const summary={
  version:VERSION,source:'current unmodified application source',
  mode:'DIAGNOSTIC_NONBLOCKING_NOT_CLINICAL_CERTIFICATION',
  context:'synthetic examples; LIVE local server and standalone fully isolated DEMO; never production Pages',
  cases:results.length,assertions:results.reduce((a,r)=>a+r.checks.length,0),
  pass:results.reduce((a,r)=>a+r.checks.filter(x=>x.result==='PASS').length,0),
  fail:countFail,results
};
fs.writeFileSync(path.join('dist','Nexus_'+VERSION+'_MEASUREMENT_MATH_DIAGNOSTIC.json'),JSON.stringify(summary,null,2));
console.log('Measurement math DIAGNOSTIC: '+summary.pass+' PASS / '+summary.fail+' FAIL of '+summary.assertions+' assertions across '+summary.cases+' isolated environments.');
for(const c of results.filter(c=>c.status==='FAIL').slice(0,2)){
  console.log(c.kind+' '+c.width+'px '+c.theme+': '+c.checks.filter(t=>t.result==='FAIL').map(t=>t.description).join('; '));
}
if(summary.fail===0)console.log('No diagnostic failures, but clinical and App Review validation still required.');
else console.log('KNOWN FAILURES: Do not use calculator results as validated injection preparation guidance. Diagnostics are nonblocking for QA-doc-only PR; iOS release remains BLOCKED.');
