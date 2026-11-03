"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const js=n=>fs.readFileSync(path.join(__dirname,"../assets/js",n),"utf8");
const five=js("05-nexus.js"),one=js("01-nexus.js"),nine=js("09-nexus.js"),ten=js("10-nexus.js"),twelve=js("12-nexus.js");
assert.match(ten,/id="nx-stash-search"/);
assert.match(ten,/nexusStashMatches\(s\.name,s\.kitName/);
assert.match(ten,/nexusStashMatches\(x\.compound/);
assert.match(nine,/nexusStashMatches\(item\.type,item\.brand/);
assert.match(twelve,/stashSearch\.oninput/);
assert.match(five,/id="nx-supp-shortcuts"/);
assert.match(five,/nexusWireSupplementShortcuts\(m,/);
assert.match(five,/nexusWireSupplementShortcuts\(modal,/);

const between=(source,a,b)=>{
 const start=source.indexOf(a),end=source.indexOf(b,start+a.length);
 assert.ok(start>=0&&end>start,"source boundaries: "+a);
 return source.slice(start,end).trim();
};
const planner=vm.runInNewContext("("+between(one,"function nexusPlanScopedStateChange(","async function nexusCommitScopedStateChange(")+")",{dayKey:d=>String(d).slice(0,10)});
const fixture={settings:{supplements:["Alpha","Beta"]},supplementLogs:[{id:"OLD",date:"2026-11-01",taken:["Alpha"]}],dailyLogs:[{date:"2026-11-01",mood:3}]};
const unchanged=JSON.stringify(fixture);
const valid={kind:"setting",key:"supplementTemplates",value:[{name:"Morning",taken:["Alpha","Beta"]}]};
const planned=planner(fixture,valid).next;
assert.deepEqual(JSON.parse(JSON.stringify(planned.settings.supplementTemplates)),valid.value);
assert.equal(JSON.stringify(fixture),unchanged,"planning must not mutate old data");
assert.deepEqual(JSON.parse(JSON.stringify(planned.supplementLogs)),fixture.supplementLogs,"history must remain verbatim");
for(const bad of [
 [{name:"",taken:["Alpha"]}],
 [{name:"Morning",taken:["Alpha","Alpha"]}],
 [{name:"Morning",taken:["Alpha"]},{name:"morning",taken:["Beta"]}],
 [{name:"Morning",taken:[null]}]
]) assert.throws(()=>planner(fixture,{kind:"setting",key:"supplementTemplates",value:bad}),/Invalid supplement templates/);

const state={settings:{supplements:["Alpha","Beta"]},supplementLogs:[
 {id:"A",date:"2026-10-30",taken:["Alpha"]},
 {id:"B",date:"2026-11-02",taken:["Beta","Alpha"]},
 {id:"C",date:"2026-11-03",taken:["Same day"]},
 {id:"D",date:"2026-11-04",taken:["Future"]}
 ]};
const historyBefore=JSON.stringify(state.supplementLogs);
const button=()=>({disabled:false,onclick:null,textContent:"",attributes:{},setAttribute(k,v){this.attributes[k]=v;}});
const repeat=button(),browse=button(),save=button();
const bar={querySelector:s=>({"#nx-supp-repeat":repeat,"#nx-supp-templates":browse,"#nx-supp-save-template":save})[s]};
const panel={hidden:true,innerHTML:"",querySelectorAll(){
 return [...this.innerHTML.matchAll(/data-template-index="(\d+)"/g)].map(match=>({dataset:{templateIndex:match[1]},onclick:null}));
}};
const modal={querySelector:s=>({"#nx-supp-shortcuts":bar,"#nx-supp-template-list":panel})[s]};
let refreshed=0,commits=0,promptValue="Morning",allowWrite=true,alerts=[];
const scope={state,dayKey:d=>String(d).slice(0,10),esc:v=>String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;"),prompt:()=>promptValue,alert:m=>alerts.push(m),nexusCommitScopedStateChange:async operation=>{
 commits++;
 if(!allowWrite)return false;
 const next=planner(state,operation).next;
 state.settings=JSON.parse(JSON.stringify(next.settings));return true;
}};
const wire=vm.runInNewContext("("+between(five,"function nexusWireSupplementShortcuts(","function dailyModal(")+")",scope);
const taken=new Set(["Old"]);
wire(modal,()=>"2026-11-03",taken,()=>{refreshed++;});
assert.equal(repeat.disabled,false);
repeat.onclick();
assert.deepEqual([...taken],["Beta","Alpha"],"last strictly earlier selection only");
assert.equal(commits,0,"repeat is draft-only");
assert.equal(JSON.stringify(state.supplementLogs),historyBefore,"repeat cannot alter history");
(async()=>{
 await save.onclick();
 assert.equal(commits,1);
 assert.deepEqual(state.settings.supplementTemplates[0],{name:"Morning",taken:["Beta","Alpha"]});
 assert.equal(JSON.stringify(state.supplementLogs),historyBefore,"templates do not change historical check-ins");
 promptValue="morning";
 await save.onclick();
 assert.equal(commits,1,"duplicate title rejected before writer");
 assert.ok(alerts.some(x=>/already exists/i.test(x)));
 promptValue="Evening";allowWrite=false;
 await save.onclick();
 assert.equal(state.settings.supplementTemplates.length,1,"failed writer must not show phantom template");
 assert.ok(!panel.innerHTML.includes("Evening"),"failed template must not be rendered");
 assert.ok(refreshed>=1);
 console.log("P4 supplement reuse and Stash source contracts PASS");
})().catch(e=>{console.error(e);process.exitCode=1;});
