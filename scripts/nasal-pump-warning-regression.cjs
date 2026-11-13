const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const js=fs.readFileSync(path.join(__dirname,"../assets/js/10-nexus.js"),"utf8");
const css=fs.readFileSync(path.join(__dirname,"../assets/css/nexus.css"),"utf8");
const start=js.indexOf("function nexusAddFormulationModal(type,existingId=null){");
const end=js.indexOf("// Container actions intentionally preserve exact-source history",start);
assert.ok(start>=0&&end>start,"Formulation editor source present");
const f=js.slice(start,end);
for(const k of ['id="nx-form-pump"','id="nx-form-pump-confirm"','class="nx-pump-confirm"','id="nx-form-pump-add"','id="nx-form-pump-save-anyway"','allowSaveWithoutPump=false','pumpField.addEventListener("input",()=>','m.querySelector("#nx-form-pump-add").onclick','m.querySelector("#nx-form-pump-save-anyway").onclick','if(pumpField&&!pumpField.value.trim()&&!allowSaveWithoutPump)','pumpConfirm.hidden=false']){
  assert.ok(f.includes(k),"Missing conditional pump warning guard "+k);
}
assert.ok(!f.includes('id="nx-form-pump-warning"'),"Warning must not be visible on form open");
assert.ok(f.includes('aria-describedby="nx-form-pump-confirm-detail" hidden'),"Confirmation starts hidden");
assert.ok(f.indexOf('if(pumpField&&!pumpField.value.trim()&&!allowSaveWithoutPump)')<f.indexOf('saveButton.disabled=true'),"Confirmation must run before write");
assert.ok(f.includes('if(pump)input.mlPerSpray=Number(pump)'),'Known pump saved');
assert.ok(!f.includes('input.mlPerSpray=0.1'),'Never invent pump volume');
assert.ok(css.includes('.nx-shared-inventory-sheet .nx-pump-confirm[hidden]{display:none!important}'),"Hidden warning must override any display style");
assert.ok(css.includes('color:var(--t2)'),"Explanatory copy uses theme secondary colour");
assert.ok(css.includes('min-height:48px'),"Confirmation actions retain 48px tap target");
console.log("PASS 19 nasal pump warning source/style assertions");
