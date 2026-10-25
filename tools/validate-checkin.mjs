import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const demo=path.resolve('dist/Nexus_v0.9.16-beta_FULL_DEMO.html');
if(!fs.existsSync(demo))throw Error('Build the source-aligned full DEMO first');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
const testDay='2032-11-07', collisionDay='2032-11-08';

function assert(ok,message){if(!ok)throw Error(message)}
async function snapshot(page,day){
  return page.evaluate(date=>({
    entries:state.dailyLogs.filter(l=>dayKey(l.date)===date).map(l=>JSON.parse(JSON.stringify(l))),
    supplements:state.supplementLogs.filter(l=>dayKey(l.date)===date).map(l=>JSON.parse(JSON.stringify(l)))
  }),day);
}
try{
  for(const width of [320,390]){
    for(const theme of ['dark','light']){
      for(const kind of ['live','demo']){
        const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
        const page=await ctx.newPage();
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        page.on('dialog',dialog=>dialog.accept());
        await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
        await page.evaluate((t)=>{
          // CI browser contexts are disposable and isolated from any real user data.
          state=buildDemoState('weight_loss');
          state.profile.onboardingDone=true;
          state.settings.supplements=['Magnesium Citrate','Psyllium Husk'];
          document.documentElement.dataset.theme=t;
        },theme);
        const before=await snapshot(page,testDay);
        assert(!before.entries.length,'Fixture already has chosen test date');
        await page.evaluate(date=>dailyModal(null,date),testDay);
        await page.locator('.modal #moods .moodbtn').first().waitFor();
        const moods=await page.locator('.modal #moods .moodbtn').evaluateAll(btns=>btns.map(btn=>({
          pressed:btn.getAttribute('aria-pressed'),name:btn.getAttribute('aria-label'),
          height:btn.getBoundingClientRect().height,
          font:parseFloat(getComputedStyle(btn.lastElementChild).fontSize),
          foreground:getComputedStyle(btn.lastElementChild).color
        })));
        assert(moods.length===5,'Expected five mood values');
        assert(moods.every(m=>m.name&&m.pressed!==null&&m.font>=11&&m.height>=48),'Mood text, state or target size failed');
        await page.locator('.modal #moods .moodbtn[data-v="4"]').click();
        assert(await page.locator('.modal #moods .moodbtn[data-v="4"]').getAttribute('aria-pressed')==='true','Mood selection not announced');
        assert(await page.locator('.modal #moods .moodbtn[data-v="3"]').getAttribute('aria-pressed')==='false','Old mood state not cleared');
        await page.locator('.modal .nx-checkin-symptoms').evaluate(el=>{el.open=true});
        const search=page.locator('.modal #nx-sym-combobox');
        await search.fill('Constipation');
        await page.locator('.modal .nx-sym-add').filter({hasText:'Constipation'}).first().click();
        await page.locator('.modal .nx-sym-selected-list .nx-sym-level[data-int="3"]').first().click();
        await page.locator('.modal .nx-tag-sym-row[data-sym="Constipation"]').click();
        const comp=page.locator('.modal .tag-pill[data-compound="Retatrutide"]').first();
        assert(await comp.count()>0,'Retatrutide symptom association not offered');
        await comp.click();
        await page.locator('.modal #notes').fill('Synthetic Check-In test note');
        await page.locator('.modal #supp-toggle').click();
        const supplement=page.locator('.modal .supp-add[data-name="Magnesium Citrate"]');
        assert(await supplement.count()>0,'Supplement browse option missing');
        await supplement.click();
        await page.locator('.modal #save').click();
        const created=await snapshot(page,testDay);
        assert(created.entries.length===1,'Create did not save one daily log');
        const saved=created.entries[0];
        assert(saved.mood===4&&saved.notes==='Synthetic Check-In test note','Saved mood or notes incorrect');
        assert(saved.symptoms.some(s=>s.name==='Constipation'&&Number(s.intensity)===3),'Symptom intensity not saved');
        assert((saved.symptomTags?.Constipation||[]).includes('Retatrutide'),'Compound association not saved');
        assert(created.supplements.length===1&&created.supplements[0].taken.includes('Magnesium Citrate'),'Date-specific supplement not saved');

        await page.evaluate(date=>dailyModal(state.dailyLogs.find(l=>dayKey(l.date)===date)),testDay);
        const restored=page.locator('.modal #notes');
        assert((await restored.inputValue())==='Synthetic Check-In test note','Note missing from Edit');
        assert(await page.locator('.modal #moods .moodbtn[data-v="4"]').getAttribute('aria-pressed')==='true','Mood missing from Edit');
        await restored.fill('Edited synthetic Check-In note');
        await page.locator('.modal #save').click();
        const edited=await snapshot(page,testDay);
        assert(edited.entries.length===1,'Edit duplicated Check-In date');
        assert(edited.entries[0].notes==='Edited synthetic Check-In note','Edit did not persist notes');
        assert(edited.entries[0].symptoms.some(s=>s.name==='Constipation'&&Number(s.intensity)===3),'Edit changed symptom intensity');
        assert((edited.entries[0].symptomTags?.Constipation||[]).includes('Retatrutide'),'Edit lost compound link');
        assert(edited.supplements.length===1&&edited.supplements[0].taken.includes('Magnesium Citrate'),'Edit changed existing supplement record');

        await page.evaluate(date=>dailyModal(null,date),collisionDay);
        await page.locator('.modal #notes').fill('Separate date entry');
        await page.locator('.modal #save').click();
        const second=await snapshot(page,collisionDay);
        assert(second.entries.length===1,'Setup collision date failed');
        await page.evaluate(date=>dailyModal(state.dailyLogs.find(l=>dayKey(l.date)===date)),testDay);
        await page.locator('.modal #date').fill(collisionDay);
        await page.locator('.modal #save').click();
        const postCollision=await snapshot(page,testDay);
        const other=await snapshot(page,collisionDay);
        assert(postCollision.entries.length===1&&other.entries.length===1,'Date collision created duplicate/deleted record');
        assert(postCollision.entries[0].notes==='Edited synthetic Check-In note','Collision overwrote original log');
        assert(other.entries[0].notes==='Separate date entry','Collision overwrote target log');
        await page.evaluate(()=>closeModal());
        assert(errors.length===0,'JavaScript exceptions: '+errors.join('; '));
        results.push({kind,width,theme,moodLabels:moods.map(x=>({label:x.name,font:x.font,height:x.height})),create:'PASS',edit:'PASS',compoundTag:'PASS',intensity:'PASS',supplementDateSafety:'PASS',duplicateDateProtection:'PASS'});
        await ctx.close();
      }
    }
  }
}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_v0.9.16-beta_CHECKIN_REGRESSION.json',JSON.stringify(results,null,2));
console.log('Check-In complete data-integrity tests passed: '+results.length+' isolated LIVE/DEMO viewport/theme combinations');
