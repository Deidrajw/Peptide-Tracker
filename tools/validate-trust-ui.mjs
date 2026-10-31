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
      // Settings Backup & Restore child acceptance: each width/theme uses the
      // full standalone, in-memory-only fictional DEMO. No live writes/imports.
      await page.evaluate(()=>{
        state.profile.onboardingDone=true;
        tab='profile';state._profileTab='settings';state._settingsDetail='backup';
        render();
      });
      const importButton=page.locator('#nx-import-open');
      await importButton.waitFor();
      const beforeCancel=await page.evaluate(()=>({
        raw:localStorage.getItem(STORE_KEY),name:state.profile.name,
        keys:Object.keys(localStorage).sort().join('|')
      }));
      const launchFictionalPreview=()=>page.evaluate(()=>{
        const fake=JSON.parse(JSON.stringify(state));
        fake.profile.name='Fictional Uncommitted Import';
        const file=new File([JSON.stringify(fake)],
          'fictional-very-long-filename-with-multiple-sections-backup-2026-10-31.json',
          {type:'application/json'});
        importData({target:{files:[file],value:''}});
      });
      await launchFictionalPreview();
      await page.locator('#nx-restore-word').waitFor({timeout:7000});
      const previewLayout=await page.evaluate(()=>{
        const modal=document.querySelector('.modal');
        const cancel=modal.querySelector('#nx-import-cancel').getBoundingClientRect();
        const confirm=modal.querySelector('#nx-import-confirm').getBoundingClientRect();
        const viewport=innerWidth;
        return {
          viewport,overflow:document.documentElement.scrollWidth>viewport+2,
          modalOverflow:modal.scrollWidth>modal.clientWidth+2,
          cancelWidth:cancel.width,confirmWidth:confirm.width,
          cancelHeight:cancel.height,confirmHeight:confirm.height,
          actionsInViewport:cancel.left>=0&&confirm.right<=viewport+1,
          filenameWrap:!!modal.querySelector('[style*="overflow-wrap:anywhere"]')
        };
      });
      assert.equal(previewLayout.overflow,false,label+' global overflow');
      assert.equal(previewLayout.modalOverflow,false,label+' restore modal overflow');
      assert.equal(previewLayout.actionsInViewport,true,label+' restore actions fit');
      assert.ok(previewLayout.cancelHeight>=44&&previewLayout.confirmHeight>=44,
        label+' action target heights');
      assert.equal(previewLayout.filenameWrap,true,label+' long filename wraps');
      assert.equal(await page.locator('#nx-import-confirm').isDisabled(),true,
        label+' confirmation starts disabled');
      await page.locator('#nx-restore-word').focus();
      await page.keyboard.type('RESTORE');
      assert.equal(await page.locator('#nx-import-confirm').isEnabled(),true,
        label+' keyboard enables confirmation');
      // Capture the settled sheet; an entering bottom-sheet animation can yield
      // translucent screenshots despite passing hit-target/overflow assertions.
      await page.waitForTimeout(500);
      await page.screenshot({path:'dist/Nexus_'+version+'_BACKUP_'+width+'_'+theme+'.png',animations:'disabled'});
      await page.locator('#nx-import-cancel').click();
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'nx-import-open',
        label+' cancel returns keyboard focus');
      assert.deepEqual(await page.evaluate(()=>({
        raw:localStorage.getItem(STORE_KEY),name:state.profile.name,
        keys:Object.keys(localStorage).sort().join('|')
      })),beforeCancel,label+' cancel is no-write');
      await launchFictionalPreview();
      await page.locator('#nx-import-close').waitFor();
      await page.locator('#nx-import-close').click();
      assert.equal(await page.evaluate(()=>document.activeElement?.id),'nx-import-open',
        label+' close returns keyboard focus');
      assert.deepEqual(await page.evaluate(()=>({
        raw:localStorage.getItem(STORE_KEY),name:state.profile.name,
        keys:Object.keys(localStorage).sort().join('|')
      })),beforeCancel,label+' close is no-write');
      results.push({viewport:width,theme,...output,backupChild:previewLayout,
        keyboardTypedConsent:true,focusReturned:true,cancelNoWrite:true,closeNoWrite:true,result:'PASS'});
      // Fictional backup preview: keyboard, focus return, overflow and no-write.
      await page.evaluate(()=>{tab='profile';state._profileTab='settings';state._settingsDetail='backup';render();});
      const importOpen=page.locator('#nx-import-open');
      const original=await page.evaluate(()=>({raw:localStorage.getItem(STORE_KEY),profile:JSON.stringify(state.profile)}));
      for(const dismiss of ['nx-import-cancel','nx-import-close']){
        await importOpen.focus();
        await page.evaluate(()=>{
          const fake=JSON.parse(JSON.stringify(state));
          fake.profile.name='Fictional Must Not Import';
          importData({target:{files:[new File([JSON.stringify(fake)],
            'fictional-very-long-backup-filename-2026-10-31-with-extra-description.json',
            {type:'application/json'})],value:''}});
        });
        await page.locator('#nx-restore-word').waitFor({timeout:7000});
        assert.equal(await page.locator('#nx-import-confirm').isDisabled(),true,label+' disabled until typed');
        const metrics=await page.evaluate(()=>{
          const box=document.querySelector('.modal'),r=box.querySelector('#nx-restore-word').getBoundingClientRect();
          return {wrap:!!box.querySelector('p[style*="overflow-wrap"]'),
            overflow:document.documentElement.scrollWidth>innerWidth+2,
            inputFits:r.left>=-1&&r.right<=innerWidth+1,
            cancel:box.querySelector('#nx-import-cancel').getBoundingClientRect().height,
            confirm:box.querySelector('#nx-import-confirm').getBoundingClientRect().height};
        });
        assert.equal(metrics.wrap,true,label+' filename wrapping');
        assert.equal(metrics.overflow,false,label+' no horizontal overflow');
        assert.equal(metrics.inputFits,true,label+' input within viewport');
        assert.ok(metrics.cancel>=44&&metrics.confirm>=44,label+' action touch targets');
        await page.locator('#nx-restore-word').focus();
        await page.keyboard.type('RESTORE');
        assert.equal(await page.locator('#nx-import-confirm').isEnabled(),true,label+' keyboard confirmation');
        await page.locator('#'+dismiss).click();
        assert.equal(await importOpen.evaluate(el=>document.activeElement===el),true,label+' focus returned');
        const after=await page.evaluate(()=>({raw:localStorage.getItem(STORE_KEY),profile:JSON.stringify(state.profile)}));
        assert.deepEqual(after,original,label+' cancel/close must not write');
      }
      results.push({viewport:width,theme,backupKeyboardFocusNoWrite:'PASS'});
      if(width===390&&theme==='dark'){
        await page.evaluate(()=>{
          // Synthetic state and browser-local data only: standalone DEMO replaces
          // localStorage with a non-configurable in-memory map.
          localStorage.setItem(STORE_KEY,JSON.stringify(state));
          // Fixture installation bypasses Nexus's writer on purpose. Reset
          // only the isolated test's expected snapshot to that known fixture;
          // a real externally changed snapshot must still be rejected.
          _nexusLastSavedSnapshot=localStorage.getItem(STORE_KEY);
          _nexusSharedWriter=null;
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
        // Route-specific sites stay granular; do not regress to three generic regions.
        const granularSites=await page.evaluate(()=>({
          subq:nexusAdminSites('SubQ'),im:nexusAdminSites('IM'),oral:nexusAdminSites('Oral')
        }));
        for(const site of ['Abdomen — upper L','Abdomen — lower R','Abdomen — lower middle'])
          assert.ok(granularSites.subq.includes(site),'SubQ detail preserved: '+site);
        for(const site of ['Deltoid — L (IM)','Vastus lateralis — R (IM)','Ventrogluteal — L (IM)'])
          assert.ok(granularSites.im.includes(site),'IM detail preserved: '+site);
        assert.deepEqual(granularSites.oral,[],'Oral doses have no injection site');
        // Single-vial premixed blend regression, in fully isolated fictional DEMO.
        await page.evaluate(()=>{
          const kit={id:975310,name:'QA Premixed Blend',isBlend:true,preparationMethod:'SubQ',
            composition:[{compound:'QA A',mg:10},{compound:'QA B',mg:10},{compound:'QA C',mg:10}],
            totalVials:2,vialMg:30,openedVials:0,emptyVials:0,activeKit:false,
            reconDate:null,bacMl:0,expiryDays:28,notes:'',doseLog:[],wasteLog:[],reconHistory:[]};
          state.supplies.push(kit);
          for(const name of ['QA A','QA B','QA C'])
            state.customPeptides[name]={status:'active',scheduleDays:7,doses:[]};
          openBlendVialModal(kit.id);
        });
        await page.locator('#rv-bacml').fill('2');
        await page.locator('#rv-expiry').fill('30');
        await page.locator('#rvn').fill('Fictional vial');
        await page.locator('#rvsave').click();
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
            return {label:card.querySelector('.nx-kit-overview-label')?.textContent?.includes('CURRENT OPEN VIAL'),
              actionPresent:!!card.querySelector('.opennewvial,.openblendvial'),
              summary:card.querySelector('.nx-kit-detail-button')?.textContent?.trim(),
              tabs:[...card.querySelectorAll('.nx-stash-tab')].map(x=>x.textContent.trim())};
          };
          return {single:read(normal.id),blend:read(975310)};
        });
        assert.ok(parity.single&&parity.blend,'both standard and premixed cards must render');
        assert.equal(parity.single.label,true);assert.equal(parity.blend.label,true);
        assert.deepEqual(parity.blend.tabs,parity.single.tabs,'shared kit details tabs');
        assert.equal(parity.blend.summary,parity.single.summary,'shared kit detail disclosure');
        const legacy=await page.evaluate(()=>{
          const kit={id:975320,name:"QA Legacy Blend",isBlend:true,blendInventoryMode:"legacy-v2",
            composition:[{compound:"Test A",mg:50},{compound:"Test B",mg:30}],
            vialMg:80,totalVials:3,bacMl:3,reconDate:localDatetime(),activeKit:true,
            vials:[{id:975321,status:"empty",vialMg:80,remainingMg:0},
                   {id:975322,status:"open",vialMg:80,remainingMg:48.5},
                   {id:975323,status:"sealed",vialMg:80,remainingMg:80}],
            doseLog:[],wasteLog:[],expiryDays:28};
          state.supplies.push(kit);
          const initial=getBlendKitRemainingMg(kit),openStart=getBlendOpenVialRemainingMg(kit);
          const tx=consumeCompoundInventory({kit,amountMg:1.5,reason:"administered",transactionId:uid()});
          const after=getBlendOpenVialRemainingMg(kit);
          undoConsumeCompoundInventory(kit,{allocations:tx.allocations});
          const restored=getBlendOpenVialRemainingMg(kit);
          return {initial,openStart,committed:tx.committed,after,restored,
             totalBack:getBlendKitRemainingMg(kit),oldVial:kit.vials[0].remainingMg,
             sealed:kit.vials[2].remainingMg};
        });
        assert.deepEqual(legacy,{
          initial:128.5,openStart:48.5,committed:true,after:47,restored:48.5,
          totalBack:128.5,oldVial:0,sealed:80
        },"legacy premixed kit preserves physical vial balances through new draw and Undo");
        await page.evaluate(()=>logBlendDoseModal(975310));
        await page.locator((await page.locator('#nx-dose-entered').count())?'#nx-dose-entered':'#dose').fill('3');
        if(await page.locator('#nx-dose-review-open').isVisible())await page.locator('#nx-dose-review-open').click();
        await page.locator('#save').click();
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

        const preparedLedger=await page.evaluate(()=>{
          const k=state.supplies.find(k=>k.id===975310);
          const before=getBlendOpenVialRemainingMg(k);
          const doseHistory=getKitDoseHistory(k);
          const tx=consumeCompoundInventory({kit:k,amountMg:2,reason:'prepared',transactionId:uid()});
          const after=getBlendOpenVialRemainingMg(k);
          undoConsumeCompoundInventory(k,{allocations:tx.allocations});
          const restored=getBlendOpenVialRemainingMg(k);
          tab='stash';render();
          const card=document.querySelector('.nx-kit-card[data-kit-id="975310"]');
          return {before,after,restored,committed:tx.committed,history:doseHistory.length,
            prepareVisible:(()=>{manageKitMenu(k.id);const available=!!document.querySelector('.nx-stash-action[data-action="prepare"]');document.querySelector('.nx-stash-sheet #x')?.click();return available;})(),detailsTabs:card?.querySelectorAll('.nx-stash-tab').length};
        });
        assert.deepEqual(preparedLedger,{before:27,after:25,restored:27,committed:true,history:1,prepareVisible:true,detailsTabs:3},
          'kit sheet Prepare entry and reversible premixed stock transaction must preserve kit history');


        // Prepared-syringe write and delete must use exactly one premixed ledger
        // allocation and restore ONLY the unused share, never ingredient stock.
        const prepPartial=await page.evaluate(()=>{
          const kit=state.supplies.find(k=>k.id===975310);
          const original=getBlendOpenVialRemainingMg(kit);
          const tx=consumeCompoundInventory({kit,amountMg:6,reason:'prepared',transactionId:uid()});
          const allocation=tx.allocations[0];
          const prepared={id:uid(),compound:kit.name,amountEach:'2',unit:'mg',count:3,remainingCount:2,
            allocations:[{kitId:kit.id,vialId:allocation.vialId,amount:6,ledgerId:allocation.ledgerId}],createdAt:localDatetime()};
          state.preparedDoses=state.preparedDoses||[];
          state.preparedDoses.push(prepared);
          const afterPrepare=getBlendOpenVialRemainingMg(kit);
          const ok=deletePreparedDose(prepared);
          const afterDelete=getBlendOpenVialRemainingMg(kit);
          const logged=kit.doseLog.find(d=>String(d.id)===String(allocation.ledgerId));
          const oldRecord=state.customPeptides[kit.name].doses[0];
          const oldId=oldRecord.id;
          const doseReversal=reverseDoseInventoryEffect(oldRecord);
          const afterDoseReversal=getBlendOpenVialRemainingMg(kit);
          // Restore the original dose allocation within the isolated QA fixture.
          const reconsume=consumeCompoundInventory({kit,amountMg:3,reason:'administered',transactionId:uid()});
          oldRecord.allocations=reconsume.allocations.map(a=>({kitId:a.kitId,vialId:a.vialId,amount:a.amountMg,ledgerId:a.ledgerId}));
          return {original,afterPrepare,ok,afterDelete,logged:logged?.totalMgDrawn,
            doseReversal,afterDoseReversal,restoredDose:oldRecord.id===oldId,
            afterRestore:getBlendOpenVialRemainingMg(kit)};
        });
        assert.deepEqual(prepPartial,{
          original:27,afterPrepare:21,ok:true,afterDelete:25,logged:2,
          doseReversal:true,afterDoseReversal:28,restoredDose:true,afterRestore:25
        },'partial prepared deletion returns only unused share and exact dose reversal uses the linked ledger');
        // Return fixture to the 27mg remaining expected by the finishing test.
        await page.evaluate(()=>{
          const kit=state.supplies.find(k=>k.id===975310);
          const dose=state.customPeptides[kit.name].doses[0];
          reverseDoseInventoryEffect(dose);
          const remainingPrepared=(kit.doseLog||[]).find(d=>d.kind==='prepared');
          if(remainingPrepared) refundBlendLedgerAmount(kit,remainingPrepared.id,remainingPrepared.totalMgDrawn);
          const restored=consumeCompoundInventory({kit,amountMg:3,reason:'administered',transactionId:uid()});
          dose.allocations=restored.allocations.map(a=>({kitId:a.kitId,vialId:a.vialId,amount:a.amountMg,ledgerId:a.ledgerId}));
        });
        await page.evaluate(()=>logBlendDoseModal(975310));
        await page.locator((await page.locator('#nx-dose-entered').count())?'#nx-dose-entered':'#dose').fill('31');
        if(await page.locator('#nx-dose-review-open').isVisible())await page.locator('#nx-dose-review-open').click();
        await page.locator('#save').click();
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
