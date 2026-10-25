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
        // Single-vial premixed blend regression, in fully isolated fictional DEMO.
        await page.evaluate(()=>{
          const kit={id:975310,name:'QA Premixed Blend',isBlend:true,
            composition:[{compound:'QA A',mg:10},{compound:'QA B',mg:10},{compound:'QA C',mg:10}],
            totalVials:2,vialMg:30,openedVials:0,emptyVials:0,activeKit:false,
            reconDate:null,bacMl:0,expiryDays:28,notes:'',doseLog:[],wasteLog:[],reconHistory:[]};
          state.supplies.push(kit);
          for(const name of ['QA A','QA B','QA C'])
            state.customPeptides[name]={status:'active',scheduleDays:7,doses:[]};
          openBlendVialModal(kit.id);
        });
        await page.locator('#nx-blend-bac').fill('2');
        await page.locator('#nx-blend-expiry').fill('30');
        await page.locator('#nx-blend-notes').fill('Fictional vial');
        await page.locator('#nx-blend-open').click();
        const opened=await page.evaluate(()=>{
          const k=state.supplies.find(k=>k.id===975310);
          return {bac:k.bacMl,expiry:k.expiryDays,remaining:getSealedVials(k).length,
            open:ensureKitVials(k).some(v=>v.status==='open'||v.status==='active')};
        });
        assert.deepEqual(opened,{bac:2,expiry:30,remaining:1,open:true},'blend open vial/recon and sealed-count');
        const parity=await page.evaluate(()=>{
          const normal={id:975311,name:'QA Single',totalVials:2,vialMg:30,activeKit:false,reconDate:null,openedVials:0,emptyVials:0,doseLog:[],wasteLog:[],reconHistory:[]};
          state.supplies.push(normal);
          tab='stash';render();
          const read=id=>{
            const card=document.querySelector('.nx-kit-card[data-kit-id="'+id+'"]');
            if(!card)return null;
            return {label:card.querySelector('.nx-stash-inventory-summary')?.textContent?.includes('KIT INVENTORY REMAINING'),
              action:card.querySelector('.opennewvial,.openblendvial')?.textContent?.trim(),
              summary:card.querySelector('details>summary')?.textContent?.trim(),
              tabs:[...card.querySelectorAll('.nx-stash-tab')].map(x=>x.textContent.trim())};
          };
          return {single:read(normal.id),blend:read(975310)};
        });
        assert.ok(parity.single&&parity.blend,'both standard and premixed cards must render');
        assert.deepEqual(parity.blend,parity.single,'blend and regular kit must share inventory label, action, disclosure and detail tabs');
        await page.evaluate(()=>logBlendDoseModal(975310));
        await page.locator('#bd-amount').fill('3');
        await page.locator('#bd-save').click();
        const doses=await page.evaluate(()=>{
          const k=state.supplies.find(k=>k.id===975310);
          return {blend:state.customPeptides[k.name]?.doses?.length,
            components:['QA A','QA B','QA C'].map(n=>state.customPeptides[n].doses.length),
            ledger:k.doseLog?.length};
        });
        assert.deepEqual(doses,{blend:1,components:[0,0,0],ledger:1},
          'premixed blend records once without creating individual component doses');
        assert.equal(await page.evaluate(()=>getBlendOpenVialRemainingMg(state.supplies.find(k=>k.id===975310))),27,
          'open vial has 27mg after a 3mg draw, not the full kit remainder');
        await page.evaluate(()=>logBlendDoseModal(975310));
        await page.locator('#bd-amount').fill('31');
        await page.locator('#bd-save').click();
        assert.equal(await page.evaluate(()=>state.supplies.find(k=>k.id===975310).doseLog.length),1,
          'draw exceeding a 30mg vial cannot be logged even with sealed stock in kit');
        await page.evaluate(()=>{closeModal();finishBlendVialModal(975310);});
        await page.locator('#ca-ok').click();
        const finished=await page.evaluate(()=>{
          const k=state.supplies.find(k=>k.id===975310);
          return {open:k.reconDate!=null,discarded:k.wasteLog.reduce((x,w)=>x+w.mg,0),
            remaining:getBlendKitRemainingMg(k),sealed:getSealedVials(k).length};
        });
        assert.deepEqual(finished,{open:false,discarded:27,remaining:30,sealed:1},
          'finishing blend vial accounts for discarded balance and preserves sealed backup');

        await page.evaluate(()=>todayLogDosePicker());
        const options=await page.locator('#today-dose-compound option').allTextContents();
        assert.ok(options.includes('QA Premixed Blend'),'blend is one selectable dose entry');
        for(const name of ['QA A','QA B','QA C'])
          assert.ok(!options.includes(name),'blend-only ingredient excluded from dose selector: '+name);
        await page.locator('#x').click();

      }
      await page.close();
    }
  }
}finally{await browser.close();}
fs.writeFileSync('dist/Nexus_'+version+'_TRUST_UI_QA.json',JSON.stringify(results,null,2)+'\n');
console.log('PASS: Privacy, guarded restore and calculator controls across 320/390 × light/dark + isolated restore QA');
