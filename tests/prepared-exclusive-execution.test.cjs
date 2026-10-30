const assert=require("node:assert/strict");
const prepared=require("../assets/js/nexus-prepared-dose-transaction.js");
const {create}=require("../assets/js/nexus-write-coordinator.js");
const fixture=()=>({
 supplies:[{id:"K1",name:"Fictional C",vials:[{id:"V1",status:"open",remainingMg:24,intendedUse:"SubQ"}],linkedPreparationPlans:[{id:"P1",status:"planned-no-transfer"}]}],
 formulationStocks:[{id:"N1",compound:"Fictional C",method:"Nasal",containerType:"nasal-bottle",remainingMg:6,remainingMl:3,mgPerSpray:.1,mlPerSpray:.05,transactions:[]}],
 peptides:{"Fictional C":{doses:[]}},customPeptides:{},preparations:[]
});
const dose={type:"dose",tx:{id:"tx1",doseId:"dose1",compound:"Fictional C",method:"Nasal",trackingMode:"backed",sourceKind:"formulation-container",sourceId:"N1",sprays:2,nativeUnit:"mg",date:"2026-10-30T12:00:00"}};
const reverse={type:"reverse",tx:{transactionId:"tx1",reversalId:"rev1",compound:"Fictional C",doseId:"dose1",sourceId:"N1"}};
(async()=>{
 let raw=JSON.stringify(fixture()),writes=0;
 const before=raw;
 const writer=create({read:()=>raw,write:x=>{writes++;raw=x},initialSnapshot:raw,lock:(_key,fn)=>fn()});
 const initial=JSON.parse(raw);
 await assert.rejects(prepared.executeExclusive(writer,initial,dose),/disabled/);
 assert.equal(writes,0);
 await assert.rejects(prepared.executeExclusive({},initial,dose,{enabled:true}),/writer required/);
 assert.equal(writes,0);
 await assert.rejects(prepared.executeExclusive(writer,initial,{type:"erase"},{enabled:true}),/Explicit prepared operation/);
 assert.equal(writes,0);
 const result=await prepared.executeExclusive(writer,initial,dose,{enabled:true});
 assert.equal(writes,1,"One complete source and history write");
 assert.equal(raw,JSON.stringify(result.next),"Durable state must equal returned snapshot");
 assert.equal(JSON.stringify(initial),before,"Caller state may not be mutated before adoption");
 assert.equal(result.next.supplies[0].vials[0].remainingMg,24);
 assert.equal(result.next.formulationStocks[0].remainingMg,5.8);
 assert.equal(result.next.formulationStocks[0].remainingMl,2.9);
 assert.equal(result.next.peptides["Fictional C"].doses[0].sourceContainerId,"N1");
 const next=JSON.parse(raw);
 const undone=await prepared.executeExclusive(writer,next,reverse,{enabled:true});
 assert.equal(writes,2);
 assert.equal(undone.next.formulationStocks[0].remainingMg,6);
 assert.equal(undone.next.formulationStocks[0].remainingMl,3);
 assert.equal(undone.next.supplies[0].vials[0].remainingMg,24);
 assert.equal(undone.next.peptides["Fictional C"].doses.length,0);
 assert.equal(undone.next.formulationStocks[0].transactions.length,2);
 assert.equal(JSON.parse(raw).formulationStocks[0].transactions[1].reverses,"tx1");
 // The coordinator must permanently block a stale second attempt until reload.
 await assert.rejects(prepared.executeExclusive(writer,initial,dose,{enabled:true}),/changed/);
 assert.equal(writes,2);
 assert.equal(writer.status().blocked,true);
 // A fresh coordinator evaluates replay safety after the stale writer is blocked.
 const replay=create({read:()=>raw,write:x=>{writes++;raw=x},initialSnapshot:raw,lock:(_key,fn)=>fn()});
 await assert.rejects(prepared.executeExclusive(replay,JSON.parse(raw),{...reverse,tx:{...reverse.tx,reversalId:"rev2"}},{enabled:true}),/already reversed/);
 assert.equal(writes,2);
 let errorRaw=JSON.stringify(fixture());
 const quota=create({read:()=>errorRaw,write:()=>{throw Error("quota")},initialSnapshot:errorRaw,lock:(_key,fn)=>fn()});
 const untouched=JSON.parse(errorRaw);
 await assert.rejects(prepared.executeExclusive(quota,untouched,dose,{enabled:true}),/quota/);
 assert.equal(errorRaw,JSON.stringify(untouched));
 assert.equal(untouched.supplies[0].vials[0].remainingMg,24);
 let corruptRaw=JSON.stringify(fixture());
 const corrupt=create({read:()=>corruptRaw,write:()=>{corruptRaw="{}"},initialSnapshot:corruptRaw,lock:(_key,fn)=>fn()});
 await assert.rejects(prepared.executeExclusive(corrupt,JSON.parse(corruptRaw),dose,{enabled:true}),/readback/);
 assert.equal(corrupt.status().blocked,true);
 let staleRaw=JSON.stringify(fixture());
 const stale=create({read:()=>staleRaw,write:x=>{staleRaw=x},initialSnapshot:staleRaw,lock:(_key,fn)=>fn()});
 const snap=JSON.parse(staleRaw);
 staleRaw=JSON.stringify({...snap,externalTab:true});
 await assert.rejects(prepared.executeExclusive(stale,snap,dose,{enabled:true}),/changed/);
 assert.equal(JSON.parse(staleRaw).externalTab,true);
 console.log("PASS: exclusive prepared administration and inverse, one durable write per event, unchanged vial ledger, default-off gate, quota/stale/corrupt failure guards");
})().catch(e=>{console.error(e);process.exitCode=1});
