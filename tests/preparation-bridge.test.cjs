const assert=require("node:assert/strict");
const {createPreparation}=require("../assets/js/nexus-preparation-ledger.js");
const {plan,commit}=require("../assets/js/nexus-preparation-bridge.js");
const fixture=()=>({supplies:[{id:"kit-a",name:"Fictional A",activeKit:true,vials:[{id:"vial-a",status:"open",remainingMg:8}]}],preparations:[createPreparation({id:"bottle-a",compound:"Fictional A",method:"Nasal",containerType:"nasal-bottle",quantityMg:0})]});
const tx={id:"transfer-a",kind:"transfer",sourceKitId:"kit-a",sourceVialId:"vial-a",destinationPreparationId:"bottle-a",amountMg:2};
const before=fixture();
const {next}=plan(before,tx);
assert.equal(before.supplies[0].vials[0].remainingMg,8,"original immutable");
assert.equal(next.supplies[0].vials[0].remainingMg,6);
assert.equal(next.preparations[0].remainingMg,2);
assert.equal(next.supplies[0].preparationTransfers.length,1);
assert.equal(next.preparations[0].transactions.length,1);
assert.throws(()=>plan(next,tx),/Duplicate/);
function reject(change,alter){let x=fixture();if(alter)alter(x);let original=JSON.stringify(x);assert.throws(()=>plan(x,{...tx,...change}));assert.equal(JSON.stringify(x),original);}
reject({amountMg:9});
reject({amountMg:-1});
reject({sourceVialId:"missing"});
reject({sourceKitId:"missing"});
reject({destinationPreparationId:"missing"});
reject({},x=>{delete x.supplies[0].vials[0].remainingMg});
reject({},x=>{x.supplies[0].vials[0].status="sealed"});
reject({},x=>{x.supplies[0].name="Different compound"});
reject({},x=>{x.preparations[0].sourceVialId="another-vial"});
reject({},x=>{x.preparations[0].sourceKitId="another-kit"});
reject({},x=>{x.supplies[0].isBlend=true});
reject({},x=>{x.preparations[0].containerType="vial"});
console.log("PASS: immutable atomic transfer planning, replay rejection, 12 fail-closed rollback scenarios");

function storage(initial){let saved=JSON.stringify(initial),writes=0;return {read:()=>saved,write:v=>{saved=v;writes++},get writes(){return writes},get value(){return saved},set value(v){saved=v}}}
{
 const original=fixture(),disk=storage(original),result=commit(original,tx,disk);
 assert.equal(disk.writes,1,"one durable write");
 assert.equal(JSON.parse(disk.value).supplies[0].vials[0].remainingMg,6);
 assert.equal(JSON.parse(disk.value).preparations[0].remainingMg,2);
 assert.equal(original.supplies[0].vials[0].remainingMg,8,"caller swaps only after success");
 assert.equal(result.next.supplies[0].vials[0].remainingMg,6);
 assert.throws(()=>commit(result.next,tx,disk),/Duplicate/);
 assert.equal(disk.writes,1,"duplicate never written");
}
{
 const original=fixture(),disk=storage(original);
 assert.throws(()=>commit(original,{...tx,amountMg:100},disk),/Insufficient/);
 assert.equal(disk.writes,0);
 assert.equal(original.supplies[0].vials[0].remainingMg,8);
}
{
 const original=fixture(),disk=storage(original),prior=disk.value;
 assert.throws(()=>commit(original,tx,{read:disk.read,write:()=>{throw Error("QuotaExceededError")}}),/QuotaExceeded/);
 assert.equal(disk.value,prior,"failed save keeps durable original");
 assert.equal(original.supplies[0].vials[0].remainingMg,8);
}
{
 const original=fixture(),disk=storage(original);
 delete original.supplies[0].vials[0].remainingMg;
 disk.value=JSON.stringify(original);
 assert.throws(()=>commit(original,tx,disk),/migrated open vial/);
 assert.equal(disk.writes,0);
}
{
 const original=fixture(),disk=storage(original);
 disk.value=JSON.stringify({...original,version:2});
 assert.throws(()=>commit(original,tx,disk),/changed/);
 assert.equal(disk.writes,0);
}
{
 const original=fixture(),disk=storage(original);
 assert.throws(()=>commit(original,tx,{read:disk.read,write:()=>{}}),/verification failed/);
 assert.equal(original.supplies[0].vials[0].remainingMg,8);
}
console.log("PASS: canonical source debit and destination credit; one-write persistence, replay, insufficient stock, save failure, legacy and stale snapshot guards");
