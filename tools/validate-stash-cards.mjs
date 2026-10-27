import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version,demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
if(!fs.existsSync(demo))throw Error('Missing full app DEMO');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const ensure=(ok,message)=>{if(!ok)throw Error(message)};
const results=[];
try{
  for(const kind of ['live','demo'])for(const width of [320,390])for(const theme of ['dark','light']){
    const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
    const page=await ctx.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
    await page.evaluate(t=>{
      state=buildDemoState('weight_loss');state.profile.onboardingDone=true;
      document.documentElement.dataset.theme=t;
      state._stashFilter='all';state._stashGroup='none';
      state.supplies=[
        {id:99001,name:'Selank',totalVials:2,vialMg:5,bacMl:1,activeKit:false,reconDate:null,
          vials:[{id:90011,status:'sealed',vialMg:5,remainingMg:5},{id:90012,status:'sealed',vialMg:5,remainingMg:5}],wasteLog:[],doseLog:[]},
        {id:99002,name:'GHK-Cu',totalVials:2,vialMg:50,bacMl:2,activeKit:true,reconDate:'2026-10-22T09:00:00',
          vials:[{id:90021,status:'open',vialMg:50,remainingMg:30,reconDate:'2026-10-22T09:00:00'},{id:90022,status:'sealed',vialMg:50,remainingMg:50}],wasteLog:[],doseLog:[]},
        {id:99003,name:'Fictional Duo Blend',isBlend:true,composition:[{compound:'BPC-157',mg:10},{compound:'TB-500',mg:10}],
          totalVials:1,vialMg:20,bacMl:2,activeKit:false,reconDate:null,
          vials:[{id:90031,status:'sealed',vialMg:20,remainingMg:20}],doseLog:[],wasteLog:[]}
      ];
      tab='stash';render();
    },theme);
    const card=id=>page.locator('.nx-kit-card[data-kit-id="'+id+'"]');
    ensure(await card(99001).count()===1,'Sealed standard kit missing');
    ensure(await card(99002).count()===1,'Open standard kit missing');
    ensure(await card(99003).count()===1,'Sealed blend kit missing');
    ensure(await card(99001).locator('.nx-kit-vial-unopened').count()===1,'Sealed kit must show No vial open');
    ensure(await card(99001).locator('.nx-hybrid-two-actions>button').count()===2,'Sealed standard kit should show primary action and Kit details');
    ensure(await card(99003).locator('.nx-hybrid-two-actions>button').count()===2,'Sealed blend kit should show primary action and Kit details');
    ensure(await card(99002).locator('.nx-hybrid-two-actions>button').count()===2,'Open vial should show contextual action and details');
    ensure(await card(99001).locator('.nx-kit-primary-empty').isVisible(),'No-vial state must be prominent');
    ensure(await card(99001).locator('.nx-kit-primary-vial [role="progressbar"]').count()===0,'Sealed kit shows misleading progress');
    ensure(await card(99001).locator('.nx-kit-primary-value').innerText().then(x=>x.includes('No vial open')),'Sealed kit not labeled');
    ensure(await card(99003).locator('.nx-kit-primary-vial [role="progressbar"]').count()===0,'Unprepared blend shows fake percent progress');
    ensure(await card(99003).locator('.nx-kit-overview-number').count()===1,'Blend missing kit-wide inventory under Overview');
    ensure(await card(99002).locator('.nx-kit-primary-vial [role="progressbar"]').count()===1,'Open vial progress is missing');
    ensure(await card(99002).locator('.nx-kit-overview-number').innerText().then(x=>x.includes('80')),'Kit Overview total should include sealed plus open');
    ensure(await card(99002).locator('.nx-kit-primary-value').innerText().then(x=>x.includes('30') && x.includes('50')),'Open vial remaining display wrong');
    ensure(await card(99002).locator('.nx-kit-primary-vial [role="progressbar"]').getAttribute('aria-valuenow')==='60','Open vial percentage wrong');
    ensure(await card(99003).locator('.manage-kit-btn').count()>=1,'v0.9.9 blend actions were lost');

    for(const id of [99001,99002,99003]){
      const parity=await card(id).locator('.nx-kit-heading-unified').evaluate(header=>{
        const title=header.querySelector('.nx-kit-title-stack'),status=header.querySelector('.nx-card-status'),btn=header.querySelector('.nx-kit-header-manage');
        if(!title||!status||!btn)return false;
        const t=title.getBoundingClientRect(),p=status.getBoundingClientRect(),m=btn.getBoundingClientRect();
        return p.top>t.top && p.left>=t.left-2 && p.right<=m.left+2 && m.width>=44 && m.height>=44 && !!btn.querySelector('.nx-unified-more-svg');
      });
      ensure(parity,'Stash card header missing stacked status/unified ellipsis for kit '+id);
    }

    // Onboarding is independent of these fictional inventory fixtures; close any
    // introductory overlay before testing a real pointer tap on the Stash details.
    await page.evaluate(()=>document.querySelectorAll('.modal-bg').forEach(el=>el.remove()));
    await card(99002).locator('.nx-kit-detail-button').click();
    ensure(await card(99002).locator('.nx-kit-detail-button').getAttribute('aria-expanded')==='true' && await page.locator('#nx-kit-details-99002').evaluate(x=>!x.hidden),'Kit details not expandable');
    ensure(await page.locator('.nx-kit-card').first().evaluate(x=>x.getBoundingClientRect().width<=window.innerWidth+1),'Kit overflows viewport');
    const before=await page.evaluate(()=>JSON.stringify(state.supplies));
    await page.evaluate(()=>supplyModal());
    ensure(await page.locator('.nx-stash-kit-editor').count()===1,'Kit editor styling hook missing');
    ensure(await page.locator('.nx-stash-kit-editor #ssave').count()===1,'Original Save handler target missing');
    ensure(await page.locator('.nx-stash-kit-editor #sname').count()===1 && await page.locator('.nx-stash-kit-editor #stv').count()===1 && await page.locator('.nx-stash-kit-editor #svmg').count()===1 && await page.locator('.nx-stash-kit-editor #sbac').count()===1 && await page.locator('.nx-stash-kit-editor #sloc').count()===1,'Kit fields lost');
    // The guided editor hides Save until final Review. Test the real journey,
    // rather than treating the intentionally hidden step-1 Save as zero-size UI.
    ensure(await page.locator('.nx-stash-kit-editor #ssave').isHidden(),'Kit Save exposed on Step 1');
    ensure(await page.locator('#nx-kit-combobox-input').count()===1,'Kit searchable field missing');
    await page.locator('#nx-kit-combobox-input').fill('GHK');
    ensure(await page.locator('.nx-kit-browse-all').isVisible(),'Regular Kit browse-all missing');
    await page.locator('.nx-kit-browse-all').click();
    ensure(await page.locator('.nx-compound-browser').isVisible(),'Regular Kit full-library view missing');
    ensure(await page.locator('.nx-browser-choice').count()>5,'Regular Kit full library truncated');
    await page.locator('#nx-browser-search').fill('GHK-Cu');
    await page.locator('.nx-browser-choice').first().click();
    ensure(await page.locator('#sname').inputValue()==='GHK-Cu','Regular Kit browse selection not retained');

    await page.screenshot({animations:'disabled',path:'dist/stash-regular-step1-'+kind+'-'+theme+'-'+width+'.png'});
    ensure(await page.locator('#nx-kit-next').isVisible(),'Kit Continue missing');
    ensure(await page.locator('#nx-kit-next').evaluate(el=>{const s=getComputedStyle(el),b=el.getBoundingClientRect();return b.height>=44&&s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.color!==s.backgroundColor;}),'Kit Continue is not a prominent 44px action');
    ensure(await page.locator('#sname').isHidden(),'Duplicate native Kit compound select visible');
    ensure(await page.locator('#nx-kit-combobox-input').isVisible(),'Kit searchable compound field missing');
    ensure(!(await page.locator('.nx-kit-wizard-progress').innerText()).includes('1 / 3'),'Duplicate Kit step count rendered');
    await page.evaluate(()=>{
      const name=document.querySelector('#sname');name.value='GHK-Cu';name.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('#stv').value='2';document.querySelector('#svmg').value='10';
    });
    await page.locator('#nx-kit-next').click();
    ensure(await page.locator('.nx-kit-wizard-stage[data-step="1"]').evaluate(x=>!x.hidden),'Kit preparation step not reachable');
    await page.screenshot({animations:'disabled',path:'dist/stash-regular-step2-'+kind+'-'+theme+'-'+width+'.png'});
    ensure(await page.locator('#ssave').isHidden(),'Kit Save exposed on Step 2');
    await page.locator('#nx-kit-next').click();
    ensure(await page.locator('.nx-kit-wizard-stage[data-step="2"]').evaluate(x=>!x.hidden),'Kit Review not reachable');
    await page.screenshot({animations:'disabled',path:'dist/stash-regular-review-'+kind+'-'+theme+'-'+width+'.png'});
    ensure(await page.locator('#ssave').isVisible(),'Kit Save absent on Review');
    ensure(await page.locator('.nx-stash-kit-editor #ssave').evaluate(x=>x.getBoundingClientRect().height)>=44,'Kit Review Save target too small');

    await page.evaluate(()=>closeModal());
    ensure(await page.evaluate(()=>JSON.stringify(state.supplies))===before,'Kit editor presentation unexpectedly mutated inventory');
    ensure(errors.length===0,'Page errors: '+errors.join('; '));
    results.push({kind,width,theme,status:'PASS',checks:['sealed no 100%','blend no 100%','owned total','open vial percentage','history disclosure','actions retained','viewport']});
    await ctx.close();
  }
}finally{await browser.close()}
fs.writeFileSync('dist/Nexus_'+VERSION+'_STASH_CARDS_QA.json',JSON.stringify({version:VERSION,results},null,2));
console.log('Stash Cards browser QA PASS: '+results.length+' LIVE/DEMO mobile theme configurations');