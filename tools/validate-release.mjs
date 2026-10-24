import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const demo = path.resolve('dist/Nexus_v0.9.6-beta_FULL_DEMO.html');
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
        if (!(await page.locator('[data-tab]').count())) throw Error(kind+' '+width+' tabs missing');
        if (kind==='demo') {
          if (!(await page.evaluate(()=>window.__NEXUS_FULL_APP_DEMO__))) throw Error('Demo isolation flag missing');
          if (await page.locator('#demo-banner button').count()) throw Error('Standalone demo exposes mode exit controls');
          if (await page.locator('link[href^="assets/"],script[src^="assets/"]').count()) throw Error('Demo not standalone');
          // Confirm the storage is memory-only across reloads.
          await page.evaluate(()=>localStorage.setItem('__nx_isolation_test','should-never-persist'));
          await page.reload({waitUntil:'domcontentloaded'});
          await page.waitForTimeout(600);
          const persisted = await page.evaluate(()=>localStorage.getItem('__nx_isolation_test'));
          if (persisted!==null) throw Error('DEMO storage persisted after reload');
        }
        await page.evaluate(desired=>{document.documentElement.dataset.theme=desired},theme);
        const appliedTheme=await page.evaluate(()=>document.documentElement.dataset.theme);
        if (appliedTheme!==theme) throw Error('Theme test setup failed: '+kind+' '+width+' '+theme);
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
        if (!(await page.locator('.nx-sym-group-toggle').count())) throw Error('Symptom category browse missing in '+kind+' '+width);
        for(const heading of ['Digestive','Energy & Sleep','PMS & Cycle']){
          if (!(await page.locator('.nx-sym-group-toggle').filter({hasText:heading}).count())) throw Error('Missing symptom section '+heading+' in '+kind);
        }
        const digestive=page.locator('.nx-sym-group').filter({has:page.locator('.nx-sym-group-toggle').filter({hasText:'Digestive'})}).first();
        const heading=digestive.locator('.nx-sym-group-toggle');
        if ((await heading.getAttribute('aria-expanded'))!=='false') throw Error('Digestive category should be collapsed by default');
        await heading.click();
        if ((await heading.getAttribute('aria-expanded'))!=='true' || !(await digestive.locator('.nx-sym-add').count())) throw Error('Digestive expand failed');
        await heading.click();
        if ((await heading.getAttribute('aria-expanded'))!=='false' || (await digestive.locator('.nx-sym-add').count())>0) throw Error('Digestive collapse failed');
        if (kind==='demo' && !(await page.locator('.nx-sym-group-toggle').filter({hasText:'Retatrutide-specific'}).count())) throw Error('Retatrutide-specific category missing from fictional demo');
        await combo.fill('Constipation');
        await page.waitForTimeout(60);
        if (!(await page.locator('.nx-sym-group-toggle').count())) throw Error('Symptom categories missing');
        const hit=page.locator('.nx-sym-add').filter({hasText:'Constipation'}).first();
        if (!(await hit.count())) throw Error('Constipation missing from symptom search');
        if((await page.locator('.nx-sym-add').filter({hasText:'Constipation'}).count())!==1)
          throw Error('Constipation should appear once across search categories');
        const ownerLabel=await hit.locator('xpath=ancestor::section[contains(@class,"nx-sym-group")]').locator('.nx-sym-group-toggle span').first().textContent();
        if(ownerLabel.trim()!=='Digestive') throw Error('Constipation should be classified under Digestive in search, got '+ownerLabel);
        await combo.fill('Nausea');
        if((await page.locator('.nx-sym-add').filter({hasText:'Nausea'}).count())!==1)
          throw Error('Nausea should appear once across search categories');
        await combo.fill('Constipation');
        await hit.click();
        await page.waitForTimeout(80);
        if (!(await page.locator('.nx-sym-selected-list').getByText('Constipation').count())) throw Error('Symptom selection not reflected');
        if ((await page.locator('.nx-sym-selected-list .nx-sym-level').count())<3) throw Error('Selected symptom intensity controls missing');
        // Actual computed foreground and background; do not assume declaration order
        // implies WCAG AA. Transparent backgrounds are not accepted for this CTA check.
        const contrastCheck = await page.evaluate(()=>{
          const c = value => {
            const vals=String(value).match(/[0-9.]+/g)?.slice(0,3).map(Number)||[];
            return vals.length===3?vals:null;
          };
          const l = v => v.map(n=>{const x=n/255;return x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4);}).reduce((a,x,i)=>a+x*[0.2126,0.7152,0.0722][i],0);
          const ratio=(a,b)=>{const x=c(a),y=c(b);if(!x||!y)return null;const z=l(x),w=l(y);return (Math.max(z,w)+0.05)/(Math.min(z,w)+0.05)};
          const el=document.querySelector('.modal #save.btn-primary');
          if(!el)throw Error('Check-In CTA missing');
          const style=getComputedStyle(el);
          return {ratio:ratio(style.color,style.backgroundColor),color:style.color,background:style.backgroundColor};
        });
        if(!contrastCheck.ratio||contrastCheck.ratio<4.5)throw Error('Check-In CTA contrast below 4.5:1: '+JSON.stringify(contrastCheck));
        const customTrigger=page.locator('.modal #add-custom-symptom');
        if(await customTrigger.count()){
          await customTrigger.click();
          const addContrast=await page.locator('.modal #cs-save').evaluate(el=>{
            const nums=s=>String(s).match(/[0-9.]+/g).slice(0,3).map(Number);
            const lum=col=>nums(col).map(v=>{v/=255;return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4)}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
            const s=getComputedStyle(el),a=lum(s.color),b=lum(s.backgroundColor);
            return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
          });
          if(addContrast<4.5)throw Error('Custom Add button contrast below 4.5:1: '+addContrast);
          await page.locator('.modal #cs-cancel').click();
        }
        // Light-mode lavender outline must remain visible against light surfaces.
        if(theme==='light'){
          const ring=page.locator('.modal .nx-sym-group-toggle').first();
          if(await ring.count()){
            await ring.focus();
            // Programmatic focus after a pointer action does not activate :focus-visible.
            // Travel away and back using keyboard Tab to test the actual user pathway.
            await page.keyboard.press('Shift+Tab');
            await page.keyboard.press('Tab');
            const focus=await ring.evaluate(el=>({color:getComputedStyle(el).outlineColor,style:getComputedStyle(el).outlineStyle,width:getComputedStyle(el).outlineWidth,visible:el.matches(':focus-visible')}));
            if(!focus.visible||focus.style==='none'||parseFloat(focus.width)<2||!focus.color.includes('91, 63, 168'))throw Error('Keyboard focus-visible outline missing: '+JSON.stringify(focus));
          }
        }
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
fs.writeFileSync('dist/Nexus_v0.9.6-beta_BROWSER_RESULTS.json',JSON.stringify(results,null,2));
console.log('Browser matrix passed: '+results.length+' sessions covering live/demo, widths 320/390 and both themes');
