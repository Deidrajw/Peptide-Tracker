import fs from "node:fs";
const source=fs.readFileSync("assets/js/05-nexus.js","utf8");
const root=fs.readFileSync("assets/js/01-nexus.js","utf8");
const start=source.indexOf('m.querySelector("#save").onclick = async () => {',source.indexOf("const preparedBatches"));
const end=source.indexOf("\n// Prepare Doses",start);
if(start<0||end<0)throw Error("Dose modal boundary missing");
const handler=source.slice(start,end);
const refs=[...handler.matchAll(/if\(!await nexusCommitCurrentState\(\)\)\{showErrorBanner\("Dose could not be saved/g)];
if(refs.length!==3)throw Error("Expected 3 guarded exclusive-CAS Log Dose paths, found "+refs.length);
if(!handler.includes("await nexusCommitUntrackedDose(name,dose,editingUntracked)")||!root.includes("writer.transaction(state,prior=>({next:apply(prior)}))"))throw Error("Exclusive untracked Log Dose acknowledgement missing");
if(!handler.includes("await nexusCommitBackedPhysicalDose(")||!root.includes("writer.transaction(state,prior=>nexusPlanBackedPhysicalDose(prior,entry))"))throw Error("Exclusive backed physical dose acknowledgement missing");
if(!root.includes("async function nexusCommitCurrentState()")||!root.includes("await writer.transaction(before,()=>({next:proposed}))"))throw Error("Exclusive CAS readback acknowledgement missing");
if(!root.includes("async function nexusCommitCurrentState(){\n if(_demoActive)return true;")||!root.includes("// DEMO remains strictly in memory; no live localStorage writes or locks."))throw Error("DEMO save acknowledgement or isolated memory boundary missing");
if(!source.includes('if(!await nexusCommitCurrentState()){showErrorBanner("Combo doses were not saved.'))throw Error("Combo save acknowledgement missing");
if(!source.includes('if(!await nexusCommitCurrentState()){showErrorBanner("Quick dose could not be saved.'))throw Error("Quick save acknowledgement missing");
for(const flag of ["NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED = false","NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED = false"]){
 if(!fs.readFileSync("assets/js/04-nexus.js","utf8").includes(flag))throw Error("Safety release flag removed: "+flag);
}
console.log("PASS: 3 exclusive-CAS + 2 specialized Log Dose branches, combo and quick logging require verified persistence before success; prepared stock remains gated");
