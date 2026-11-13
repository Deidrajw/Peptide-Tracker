const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const s=fs.readFileSync(path.join(__dirname,"../assets/js/10-nexus.js"),"utf8");
const start=s.indexOf("function nexusAddFormulationModal(type,existingId=null){");
const end=s.indexOf("// Container actions intentionally preserve exact-source history",start);
assert.ok(start>=0&&end>start,"Formulation editor source present");
const f=s.slice(start,end);
for(const k of ['id="nx-form-pump"','id="nx-form-pump-warning"','id="nx-form-pump-confirm"','id="nx-form-pump-add"','id="nx-form-pump-save-anyway"','allowSaveWithoutPump=false','pumpField.addEventListener("input",refreshPumpWarning)','m.querySelector("#nx-form-pump-add").onclick','m.querySelector("#nx-form-pump-save-anyway").onclick','if(pumpField&&!pumpField.value.trim()&&!allowSaveWithoutPump)'])
  assert.ok(f.includes(k),"Missing pump warning guard "+k);
assert.ok(f.indexOf('if(pumpField&&!pumpField.value.trim()&&!allowSaveWithoutPump)')<f.indexOf('saveButton.disabled=true'),"Confirmation must run before write");
assert.ok(f.includes('if(pump)input.mlPerSpray=Number(pump)'),'Known pump saved');
assert.ok(!f.includes('input.mlPerSpray=0.1'),'Never invent pump volume');
assert.match(f,/won't be able to log sprays until you add the pump's mL per spray/);
console.log("PASS 14 nasal pump warning source assertions");
