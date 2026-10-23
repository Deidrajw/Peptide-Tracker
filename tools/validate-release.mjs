import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const demo = path.resolve('dist/Nexus_v0.9.2-beta_FULL_DEMO.html');
if (!fs.existsSync(demo)) throw Error('Build the full demo before testing it');
const browser = await chromium.launch({headless:true, args:['--no-sandbox']});
const results=[];
try {
  for (const width of [320,390]) {
    for (const theme of ['dark','light']) {
      for (const kind of ['live','demo']) {
        const context = await browser.newContext({viewport:{width,height:800},isMobile:true,hasTouch:true});
        const page = await context.newPage();
        const pageErrors=[];
        page.on('pageerror',error=>pageErrors.push(error.message));
        const url = kind==='live' ? 'http://127.0.0.1:8777/' : 'file://' + demo;
        await page.goto(url,{waitUntil:'domcontentloaded'});
        await page.waitForTimeout(800);
        if (theme==='light') await page.evaluate(()=>document.documentElement.dataset.theme='light');
        if (!(await page.locator('[data-tab]').count())) throw Error(kind+' '+width+' tabs missing');
        if (kind==='demo') {
          if (!(await page.evaluate(()=>window.__NEXUS_FULL_APP_DEMO__))) throw Error('Demo isolation flag missing');
          if (await page.locator('link[href^="assets/"],script[src^="assets/"]').count()) throw Error('Demo not standalone');
          // Confirm the storage is memory-only across reloads.
          await page.evaluate(()=>localStorage.setItem('__nx_isolation_test','should-never-persist'));
          await page.reload({waitUntil:'domcontentloaded'});
          await page.waitForTimeout(600);
          const persisted = await page.evaluate(()=>localStorage.getItem('__nx_isolation_test'));
          if (persisted!==null) throw Error('DEMO storage persisted after reload');
        }
        await page.evaluate(()=>dailyModal());
        await page.waitForTimeout(200);
        if (!(await page.locator('.modal').isVisible())) throw Error('Daily Check-In modal failed');
        for(const sel of ['.nx-checkin-symptoms','#nx-sym-combobox','.nx-sym-search-results','.nx-sym-selected-list']){
          if (!(await page.locator(sel).count())) throw Error(kind+' '+width+' Check-In missing '+sel);
        }
        await page.locator('.nx-checkin-symptoms').evaluate(el=>{el.open=true;});
        await page.waitForTimeout(50);
        const combo=page.locator('#nx-sym-combobox');
        await combo.focus();
        await page.waitForTimeout(60);
        if (!(await page.locator('.nx-sym-add').count())) throw Error('Symptom browse list empty in '+kind+' '+width);
        for(const heading of ['Digestive','Energy & Sleep','PMS & Cycle']){
          if (!(await page.locator('.nx-sym-group-toggle').filter({hasText:heading}).count())) throw Error('Missing symptom section '+heading+' in '+kind);
        }
        const digestive=page.locator('.nx-sym-group').filter({has:page.locator('.nx-sym-group-toggle').filter({hasText:'Digestive'})}).first();
        const heading=digestive.locator('.nx-sym-group-toggle');
        await heading.click();
        if ((await heading.getAttribute('aria-expanded'))!=='false' || (await digestive.locator('.nx-sym-add').count())>0) throw Error('Digestive collapse failed');
        await heading.click();
        if ((await heading.getAttribute('aria-expanded'))!=='true' || !(await digestive.locator('.nx-sym-add').count())) throw Error('Digestive expand failed');
        if (kind==='demo' && !(await page.locator('.nx-sym-group-toggle').filter({hasText:'Retatrutide-specific'}).count())) throw Error('Retatrutide-specific category missing from fictional demo');
        await combo.fill('Constipation');
        await page.waitForTimeout(60);
        if (!(await page.locator('.nx-sym-group-toggle').count())) throw Error('Symptom categories missing');
        const hit=page.locator('.nx-sym-add').filter({hasText:'Constipation'}).first();
        if (!(await hit.count())) throw Error('Constipation missing from symptom search');
        await hit.click();
        await page.waitForTimeout(80);
        if (!(await page.locator('.nx-sym-selected-list').getByText('Constipation').count())) throw Error('Symptom selection not reflected');
        if ((await page.locator('.nx-sym-selected-list .nx-sym-level').count())<3) throw Error('Selected symptom intensity controls missing');
        const modalMetrics = await page.locator('.modal').evaluate(el=>({w:el.getBoundingClientRect().width,sw:el.scrollWidth,cw:el.clientWidth}));
        if (modalMetrics.w>width+1 || modalMetrics.sw>modalMetrics.cw+3) throw Error('Check-In horizontal overflow '+JSON.stringify(modalMetrics));
        await page.screenshot({path:'dist/'+kind+'-'+theme+'-'+width+'-checkin.png'});
        await page.evaluate(()=>closeModal());
        const tabs=await page.locator('.tabbar button').allTextContents();
        for(let tabIndex=0;tabIndex<Math.min(5,tabs.length);tabIndex++){
          await page.locator('.tabbar button').nth(tabIndex).click();
          await page.waitForTimeout(90);
        }
        if (pageErrors.length) throw Error(kind+' '+theme+' '+width+' JavaScript exceptions: '+pageErrors.join(' | '));
        results.push({kind,theme,width,modalMetrics,tabs,status:'PASS'});
        await context.close();
      }
    }
  }
} finally {await browser.close();}
fs.writeFileSync('dist/Nexus_v0.9.2-beta_BROWSER_RESULTS.json',JSON.stringify(results,null,2));
console.log('Browser matrix passed: '+results.length+' sessions covering live/demo, widths 320/390 and both themes');
