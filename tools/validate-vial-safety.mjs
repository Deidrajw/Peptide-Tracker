import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

// All cases run with discarded in-memory fictional browser state; no production URL,
// network writes, real records, reconstitution changes or user inventory are involved.
const VERSION=JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
const demo=path.resolve('dist/Nexus_'+VERSION+'_FULL_DEMO.html');
if(!fs.existsSync(demo))throw Error('Full source-identical DEMO missing');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
const approx=(a,b)=>Math.abs(a-b)<0.011;
try {
 for(const width of [320,390]) for(const theme of ['dark','light']) for(const kind of ['live','demo']){
  const ctx=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();
  const exceptions=[];
  page.on('pageerror',e=>exceptions.push(e.message));
  await page.goto(kind==='live'?'http://127.0.0.1:8777/':'file://'+demo,{waitUntil:'domcontentloaded'});
  const evidence=await page.evaluate(({theme})=>{
    const assert=(cond,desc)=>{if(!cond)throw Error(desc)};
    const near=(x,y)=>Math.abs(x-y)<=0.011;
    document.documentElement.dataset.theme=theme;
    state=buildDemoState('weight_loss');
    state.profile.onboardingDone=true;
    state.preparedDoses=[];
    state.lastSourceKit={};
    state.peptides.Retatrutide={status:'active',doses:[],scheduleDays:7};
    state.supplies=[];
    function kit(id,open,hasSealed=false){
      const vials=[{id:'v'+id,status:'open',vialMg:10,remainingMg:open,
        sequenceNumber:1,reconDate:'2026-10-20T08:00:00'}];
      if(hasSealed)vials.push({id:'s'+id,status:'sealed',vialMg:10,
        remainingMg:10,sequenceNumber:2});
      return {id,name:'Retatrutide',activeKit:true,vialMg:10,
        totalVials:vials.length,openedVials:1, _vialsBackfilled:true,
        _vialsRepaired:true,vials,wasteLog:[]};
    }
    const list=[];
    // (1) Sealed vials may be in Stash but cannot be silently drawn from.
    const sealedKit=kit(9001,1,true);state.supplies=[sealedKit];
    assert(suggestAllocation('Retatrutide',2,'mg')===null,
      'Sealed inventory improperly counted as open source');
    assert(near(sealedKit.vials[0].remainingMg,1) && near(sealedKit.vials[1].remainingMg,10),
      'Insufficient allocation mutated vial stock');
    list.push('sealed stock excluded and rejected allocation preserved');

    // (2) Single-vial normal consumption, then complete rollback.
    sealedKit.vials[0].remainingMg=6;
    const single=consumeCompoundInventory({kit:sealedKit,amountMg:2,transactionId:'qa-single',reason:'dose'});
    assert(single.committed===true && single.allocations.length===1,'Single vial not committed');
    assert(near(sealedKit.vials[0].remainingMg,4),'Single vial incorrectly decremented');
    assert(near(sealedKit.vials[1].remainingMg,10),'Sealed backup was decremented');
    undoConsumeCompoundInventory(sealedKit,single);
    assert(near(sealedKit.vials[0].remainingMg,6),'Single-vial undo not exact');
    list.push('single vial deduction and exact reversal');

    // (3) Dose record deletion reverses the original vial allocation (not
    // kit-wide or sealed stock, and not merely changing the history array).
    const used=consumeCompoundInventory({kit:sealedKit,amountMg:1.5,transactionId:'qa-dose'});
    const dose={id:7001,date:'2026-10-23T08:00',dose:1.5,
      allocations:[{kitId:sealedKit.id,vialId:used.allocations[0].vialId,amount:1.5}]};
    state.peptides.Retatrutide.doses.push(dose);
    assert(near(sealedKit.vials[0].remainingMg,4.5),'Fixture dose stock deduction failed');
    reverseDoseInventoryEffect(dose);
    state.peptides.Retatrutide.doses=state.peptides.Retatrutide.doses.filter(x=>x.id!==dose.id);
    assert(near(sealedKit.vials[0].remainingMg,6),'Deleting dose did not restore source vial');
    list.push('dose record reverse restores original vial');

    // (4) Multi-source allocation uses the smallest open vial first; no new
    // vial opened and no duplication across both allocation source records.
    const a=kit(9002,1.5),b=kit(9003,5);
    state.supplies=[a,b];
    const insufficient=suggestAllocation('Retatrutide',6.6,'mg');
    assert(insufficient===null,'Insufficient two-vial amount was accepted');
    assert(near(a.vials[0].remainingMg,1.5)&&near(b.vials[0].remainingMg,5),
      'Rejected multi-vial allocation changed stock');
    const plan=suggestAllocation('Retatrutide',4,'mg');
    assert(plan?.length===2,'Expected two explicit open source allocations');
    assert(plan[0].kitId===a.id && near(plan[0].amount,1.5)
      && plan[1].kitId===b.id && near(plan[1].amount,2.5),
      'Multi-vial allocation amount/order drifted');
    const tx=plan.map(x=>consumeCompoundInventory({kit:state.supplies.find(k=>k.id===x.kitId),
      amountMg:doseToMg(x.amount,'mg'),transactionId:'qa-multi'}));
    assert(tx.every(x=>x.committed),'Explicit multi-vial source failed');
    assert(near(a.vials[0].remainingMg,0)&&a.vials[0].status==='empty'
      &&near(b.vials[0].remainingMg,2.5),'Multi-vial deduction or automatic empty wrong');
    tx.forEach((x,i)=>undoConsumeCompoundInventory(
      state.supplies.find(k=>k.id===plan[i].kitId),x));
    assert(near(a.vials[0].remainingMg,1.5)&&near(b.vials[0].remainingMg,5)
      &&a.vials[0].status==='open','Multi-vial reversal did not reopen original vial');
    list.push('insufficient two-source rejection, split deduction, and undo');

    // (5) Prepared inventory that is partially used returns ONLY the unused
    // share to the exact source vial when the prepared batch is deleted.
    const pdKit=kit(9004,10);pdKit.vials[0].remainingMg=0;pdKit.vials[0].status='empty';
    state.supplies=[pdKit];
    const prepared={id:8101,compound:'Retatrutide',amountEach:2,unit:'mg',
      count:5,remainingCount:3,allocations:[{kitId:pdKit.id,vialId:pdKit.vials[0].id,amount:10}]};
    state.preparedDoses=[prepared];
    deletePreparedDose(prepared);
    assert(state.preparedDoses.length===0,'Prepared batch not removed');
    assert(near(pdKit.vials[0].remainingMg,6)&&pdKit.vials[0].status==='open',
      'Prepared-dose deletion returned more/less than the three unused syringes');
    list.push('prepared batch deletion returns only unused share');

    // (6) Prepared batch funded from TWO distinct open vials. Only unused
    // fractions return to their original vial IDs; consumed share stays spent.
    const pa=kit(9005,0),pb=kit(9006,0);
    pa.vials[0].status='empty';pb.vials[0].status='empty';
    state.supplies=[pa,pb];
    const splitPrepared={id:8102,compound:'Retatrutide',amountEach:2,unit:'mg',
      count:5,remainingCount:3,allocations:[
        {kitId:pa.id,vialId:pa.vials[0].id,amount:4},
        {kitId:pb.id,vialId:pb.vials[0].id,amount:6}
      ]};
    state.preparedDoses=[splitPrepared];
    assert(deletePreparedDose(splitPrepared)===true,'Split prepared batch deletion rejected');
    assert(near(pa.vials[0].remainingMg,2.4)&&near(pb.vials[0].remainingMg,3.6),
      'Split prepared refund did not conserve the exact unused shares');
    assert(pa.vials[0].status==='open'&&pb.vials[0].status==='open',
      'Split prepared refund failed to reopen original empty vials');
    assert(state.preparedDoses.length===0,'Split prepared batch record not removed');
    list.push('two-vial prepared deletion conserves exact unused share per source');

    // (7) An orphaned explicit source must not delete a partly unused
    // prepared batch or silently refund into an unrelated kit.
    const orphanKit=kit(9007,4);
    state.supplies=[orphanKit];
    const originalOrphanBalance=orphanKit.vials[0].remainingMg;
    const orphan={id:8103,compound:'Retatrutide',amountEach:2,unit:'mg',
      count:5,remainingCount:3,allocations:[
        {kitId:999999,vialId:'missing-vial',amount:10}]};
    state.preparedDoses=[orphan];
    assert(deletePreparedDose(orphan)===false,
      'Prepared batch with missing explicit source was deleted');
    assert(state.preparedDoses.length===1 && state.preparedDoses[0]===orphan &&
      near(orphanKit.vials[0].remainingMg,originalOrphanBalance),
      'Orphan source failed to preserve both batch and unrelated stock');
    const missingVial={id:8104,compound:'Retatrutide',amountEach:2,unit:'mg',
      count:5,remainingCount:3,allocations:[
        {kitId:orphanKit.id,vialId:'not-a-real-vial',amount:10}]};
    state.preparedDoses=[missingVial];
    assert(deletePreparedDose(missingVial)===false,
      'Prepared batch with missing vial ID was deleted');
    assert(state.preparedDoses.length===1 &&
      near(orphanKit.vials[0].remainingMg,originalOrphanBalance),
      'Missing-vial deletion altered unrelated inventory or prepared history');
    list.push('missing kit/vial source blocks deletion and preserves batch');
    // UI-level guard: confirming deletion of an orphaned prepared batch
    // must leave the dialog open, preserve data, and show the warning.
    deletePreparedDoseModal(missingVial);
    const confirm=document.querySelector('#confirm');
    assert(confirm,'Prepared-dose confirmation control was not rendered');
    confirm.click();
    assert(state.preparedDoses.length===1 && state.preparedDoses[0]===missingVial,
      'UI confirmation deleted an orphaned prepared batch');
    assert(near(orphanKit.vials[0].remainingMg,originalOrphanBalance),
      'UI confirmation modified unrelated inventory');
    assert(document.querySelector('#confirm'),
      'Blocked deletion unexpectedly dismissed the confirmation');
    assert(document.body.textContent.includes("original source vial is missing"),
      'Missing-source UI warning not visible');
    closeModal();
    list.push('orphaned prepared deletion UI preserves dialog, batch and source warning');


    // (8) Canonical unit bridge is reversible for mcg and mg, avoiding 1000x
    // over/under deductions in compound preparations.
    assert(near(doseToMg(250,'mcg'),.25)&&near(mgToUnit(.25,'mcg'),250)
      &&near(doseToMg(2,'mg'),2),'Native-unit conversion drift');
    list.push('mcg/mg canonical conversion');

    return {assertions:list,caseCount:list.length,version:document.title};
  },{theme});
  if(exceptions.length)throw Error('Browser JS exception: '+exceptions.join('; '));
  results.push({kind,width,theme,...evidence,result:'PASS'});
  await ctx.close();
 }
}finally{await browser.close()}
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/Nexus_'+VERSION+'_VIAL_SAFETY_REGRESSION.json',JSON.stringify(results,null,2));
console.log('Nexus vial-source core regression PASS: '+results.length+' LIVE/DEMO viewport/theme combinations, '+results.length*9+' safety assertions');
