import fs from "node:fs";
const source=fs.readFileSync("assets/js/05-nexus.js","utf8");
const root=fs.readFileSync("assets/js/01-nexus.js","utf8");
const start=source.indexOf('m.querySelector("#save").onclick = () => {',source.indexOf("const preparedBatches"));
const end=source.indexOf("\n// Prepare Doses",start);
if(start<0||end<0)throw Error("Dose modal boundary missing");
const handler=source.slice(start,end);
const refs=[...handler.matchAll(/if\(!saveState\(\)\)\{showErrorBanner\("Dose could not be saved/g)];
if(refs.length!==4)throw Error("Expected 4 guarded Log Dose success paths, found "+refs.length);
if(!root.includes("return false; // callers must not display success"))throw Error("saveState failure acknowledgement missing");
if(!root.includes("return true; // fictional demo never touches production storage"))throw Error("DEMO save acknowledgement missing");
if(!source.includes('if(!saveState()){showErrorBanner("Combo doses were not saved.'))throw Error("Combo save acknowledgement missing");
if(!source.includes('if(!saveState()){showErrorBanner("Quick dose could not be saved.'))throw Error("Quick save acknowledgement missing");
for(const flag of ["NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED = false","NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED = false"]){
 if(!fs.readFileSync("assets/js/04-nexus.js","utf8").includes(flag))throw Error("Safety release flag removed: "+flag);
}
console.log("PASS: all 4 Log Dose flows, combo and quick logging require verified persistence before success; prepared stock remains gated");
