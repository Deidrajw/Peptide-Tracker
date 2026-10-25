import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+version+'_FULL_DEMO.html');
assert.ok(fs.existsSync(demo),'Build full standalone demo first');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
try{
  for(const width of [320,390]){
    for(const theme of ['light','dark']){
      const page=await browser.newPage({viewport:{width,height:844}});
      const label=width+'px '+theme;
      await page.goto('file://'+demo);
      await page.waitForFunction(()=>typeof renderPrivacyDataDetail==='function' && typeof nxReconValidate==='function');
      const output=await page.evaluate(theme=>{
        document.documentElement.dataset.theme=theme;
        const list=renderSettingsTabContent(),privacy=renderPrivacyDataDetail(),backup=renderBackupDetail();
        const recon=nxReconValidate({vialMg:'5',bacMl:'2',dose:'200',unit:'mcg',syringe:'100u'});
        return {
          fictional:window.__NEXUS_FULL_APP_DEMO__===true,
          privacyEntry:list.includes('data-detail="privacy"'),
          privacyCards:(privacy.match(/nx-privacy-card/g)||[]).length,
          backupImport:backup.includes('id="nx-import-open"'),
          guardedBackup:typeof importData==='function',
          mass:recon.mlPerDose,
          badIU:!!nxReconValidate({vialMg:'5',bacMl:'2',dose:'2',unit:'iu',syringe:'100u'}).error,
          reducedMotion:[...document.styleSheets].some(s=>{try{return [...s.cssRules].some(r=>r.conditionText?.includes('prefers-reduced-motion'))}catch{return false}})
        };
      },theme);
      assert.equal(output.fictional,true,label+' isolation');
      assert.equal(output.privacyEntry,true,label+' Privacy entry');
      assert.equal(output.privacyCards,4,label+' privacy disclosures');
      assert.equal(output.backupImport,true,label+' backup control');
      assert.equal(output.guardedBackup,true,label+' restore handler');
      assert.equal(output.mass,0.08,label+' mcg conversion');
      assert.equal(output.badIU,true,label+' reject IU');
      results.push({viewport:width,theme,...output,result:'PASS'});
      if(width===390&&theme==='dark'){
        await page.evaluate(()=>{
          // Synthetic state and browser-local data only: standalone DEMO replaces
          // localStorage with a non-configurable in-memory map.
          localStorage.setItem(STORE_KEY,JSON.stringify(state));
          const fake=JSON.parse(JSON.stringify(state));
          fake.profile.name='Fictional Restore QA';
          const file=new File([JSON.stringify(fake)],'fictional-backup.json',{type:'application/json'});
          importData({target:{files:[file],value:''}});
        });
        await page.locator('#nx-restore-word').waitFor({timeout:7000});
        assert.equal(await page.locator('#nx-import-confirm').isDisabled(),true);
        await page.locator('#nx-restore-word').fill('RESTORE');
        assert.equal(await page.locator('#nx-import-confirm').isEnabled(),true);
        await page.locator('#nx-import-cancel').click();
        assert.equal(await page.evaluate(()=>state.profile.name==='Fictional Restore QA'),false,'cancel must preserve state');
        await page.evaluate(()=>{
          const fake=JSON.parse(JSON.stringify(state));
          fake.profile.name='Fictional Restore QA';
          importData({target:{files:[new File([JSON.stringify(fake)],'fictional-backup.json',{type:'application/json'})],value:''}});
        });
        await page.locator('#nx-restore-word').waitFor();
        await page.locator('#nx-restore-word').fill('RESTORE');
        page.once('dialog',dialog=>dialog.accept());
        await page.locator('#nx-import-confirm').click();
        assert.equal(await page.evaluate(()=>state.profile.name),'Fictional Restore QA','confirmed restore');
        assert.equal(await page.evaluate(()=>[...Array(localStorage.length)].map((_,i)=>localStorage.key(i)).some(k=>k.includes('-before-manual-restore-'))),true,'pre-restore copy');
      }
      await page.close();
    }
  }
}finally{await browser.close();}
fs.writeFileSync('dist/Nexus_'+version+'_TRUST_UI_QA.json',JSON.stringify(results,null,2)+'\n');
console.log('PASS: Privacy, guarded restore and calculator controls across 320/390 × light/dark + isolated restore QA');
