import fs from 'node:fs';
const files=Array.from({length:12},(_,i)=>'assets/js/'+String(i+1).padStart(2,'0')+'-nexus.js');
let count=0;
for(const file of files){
 const text=fs.readFileSync(file,'utf8');
 const writes=[...text.matchAll(/localStorage\s*\.\s*(setItem|removeItem)\s*\(\s*STORE_KEY\s*[,)]/g)];
 if(file==='assets/js/01-nexus.js'){
   if(writes.length!==2)throw Error('Canonical storage gateway missing/duplicated: '+writes.length);
   if(!text.includes('writer.saveLegacy(state)')||!text.includes('writer.removeLegacy()'))
     throw Error('Legacy writes no longer use shared coordinator');
 }else if(writes.length)throw Error(file+' has '+writes.length+' direct main storage writes outside coordinator');
 count+=writes.length;
}
for(const file of ['assets/js/04-nexus.js','assets/js/10-nexus.js','assets/js/11-nexus.js','assets/js/12-nexus.js']){
 const text=fs.readFileSync(file,'utf8');
 if(file.includes('04-')&&!text.includes('writer.transaction(state,'))
   throw Error('Prepared/source transactions bypass shared writer');
 if(file.includes('10-')&&(!text.includes('await writer.transaction(saved,')||!text.includes('saveButton.disabled=true')))
   throw Error('Formulation stock bypasses exclusive shared writer');
 if(file.includes('11-')&&!text.includes('writer.saveLegacy(next)'))
   throw Error('Manual restoration bypasses shared writer');
 if(file.includes('12-')&&!text.includes('writer.saveLegacy(next)'))
   throw Error('Onboarding restoration bypasses shared writer');
}
const runtime=fs.readFileSync('assets/js/04-nexus.js','utf8');
// The migrated Add to Open Vial flow must not fall back to last-entry
// history removal or uncoordinated legacy stock persistence.
if(!runtime.includes('planAddToOpenVial(snapshot,input)')||
   !runtime.includes('planUndoAddToOpenVial(snapshot,inverse)')||
   !runtime.includes('const writer=nexusWriter();')||
   !runtime.includes('await writer.transaction(saved,snapshot=>planAddToOpenVial(snapshot,input))')||
   !runtime.includes('await writer.transaction(JSON.parse(raw),')||
   runtime.includes('kit.wasteLog.pop(); // removes the addition-audit entry'))
  throw Error('Exact-vial addition/undo does not use exclusive event-addressed writer');

if(!runtime.includes('await writer.transaction(saved,snapshot=>planExclusiveVialRestock(snapshot,event))')||
   !runtime.includes('snapshot=>planUndoExclusiveVialRestock(snapshot,inverse)')||
   !runtime.includes('This kit needs inventory reconciliation before exclusive restocking')||
   !runtime.includes('Added vial has attached history; automatic undo blocked'))
  throw Error('Add Vials restock/Undo must use exclusive exact-ID transaction');

// Manual vial correction must stay inside the same exclusive writer; reject
// accidental fallback to legacy synchronous save or non-attributed history.
if(!runtime.includes('function planExclusiveVialAdjustment(snapshot,input)')||
   !runtime.includes('await writer.transaction(saved,snapshot=>planExclusiveVialAdjustment(snapshot,input))')||
   !runtime.includes('A reason is required for every correction')||
   !runtime.includes('adjustmentDeltaMg:deltaMg,stockBefore:before,stockAfter:after')||
   !runtime.includes('Transferred source must use the source-transfer reversal'))
  throw Error('Adjust Remaining Amount bypasses exclusive exact-vial/required-reason correction');

const physicalOutflow=fs.readFileSync('assets/js/09-nexus.js','utf8');
if(!physicalOutflow.includes('function planExclusivePhysicalOutflow(snapshot,input)')||
   !physicalOutflow.includes('function planUndoExclusivePhysicalOutflow(snapshot,input)')||
   !physicalOutflow.includes('await writer.transaction(saved,snapshot=>planExclusivePhysicalOutflow(snapshot,input))')||
   !physicalOutflow.includes('return planUndoExclusivePhysicalOutflow(snapshot,{kitId,eventId:txId,undoEventId:input.inverseId,date:input.date,loggedAt:input.reversedAt})')||
   !physicalOutflow.includes('Exact source vial unavailable or duplicated')||
   !physicalOutflow.includes('Choose the exact physical source')||
   !physicalOutflow.includes('Later vial history exists; undo blocked'))
  throw Error('Log Outflow / Undo must retain exclusive exact-vial transaction and event history');

// Edits to historic physical outflows must not mutate the event independently
// of the exact physical vial, or fall back to saveState() without a Web Lock.
if(!physicalOutflow.includes('function planExclusivePhysicalOutflowEdit(snapshot,input)')||
   !physicalOutflow.includes('await writer.transaction(saved,snapshot=>planExclusivePhysicalOutflowEdit(snapshot,input))')||
   !physicalOutflow.includes('tx.editHistory.push(')||
   !physicalOutflow.includes('Source vial changed since outflow; edit blocked')||
   !physicalOutflow.includes('A sealed whole-vial transfer cannot have its physical amount edited'))
  throw Error('Edit Outflow must be an exclusive exact-source stock-and-history transaction');

// Whole-kit retirement must not zero every vial after a smaller, unallocated
// kit-level waste record. Require one Web-Locked state write and per-vial audit.
if(!physicalOutflow.includes('function planExclusiveMarkKitDone(snapshot,input)')||
   !physicalOutflow.includes('await writer.transaction(saved,snapshot=>planExclusiveMarkKitDone(snapshot,input))')||
   !physicalOutflow.includes('Entered waste amount must match all remaining physical vial stock')||
   !physicalOutflow.includes('outflowKind:"retired_kit_vial",retirementId:input.completionId')||
   !physicalOutflow.includes('kit.kitDoneHistory.push('))
  throw Error('Mark Kit Done must be exclusive and exact-vial attributed');

if(!runtime.includes('NexusPreparedDoseTransaction.executeExclusive(') ||
   runtime.includes('NexusPreparedDoseTransaction.planDose(snapshot,') ||
   runtime.includes('NexusPreparedDoseTransaction.reverseDose(snapshot,'))
  throw Error('Prepared nasal runtime bypasses exclusive transaction execution boundary');
for(const lock of ['NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED = false','NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED = false']){
 if(!runtime.includes(lock))throw Error('Unapproved live stock transfer enablement: '+lock);
}
console.log('PASS: canonical writer ownership and prepared stock release gates intact; direct gateway adapters='+count);
