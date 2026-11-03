/* Browser acceptance of the real LIVE nasal preparation form.
 * All data is invented in a fresh Chromium context on a local test server.
 * The production feature gate remains OFF: only the intercepted 04-nexus.js
 * response is changed for this automated browser run.
 */
const fs=require("node:fs");
const assert=require("node:assert/strict");
const {chromium}=require("playwright");
const application=fs.readFileSync("assets/js/04-nexus.js","utf8");
const from="const NEXUS_RECORDED_NASAL_PREPARATION_ENABLED = false;";
assert.ok(application.includes(from),"Preparation release gate must remain disabled in source");
const testOnly=application.replace(from,"const NEXUS_RECORDED_NASAL_PREPARATION_ENABLED = true;");
assert.match(testOnly,/const NEXUS_PREPARATION_TRANSFER_CONTROLS_ENABLED = false;/);
assert.match(testOnly,/const NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED = false;/);
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390]){
   for(const theme of ["light","dark"]){
    const context=await browser.newContext({viewport:{width,height:844}});
    const page=await context.newPage();
    await page.route("**/assets/js/04-nexus.js",route=>route.fulfill({
     status:200,contentType:"application/javascript",body:testOnly
    }));
    await page.goto("http://127.0.0.1:8777/",{waitUntil:"domcontentloaded"});
    await page.waitForFunction(()=>typeof nexusRecordNasalPreparation==="function");
    const seeded=await page.evaluate(async theme=>{
     localStorage.setItem("pep-theme",theme);
     state.supplies=state.supplies||[];
     state.supplies.push({id:"qa-fictional-kit",name:"Fictional QA Sample",
      activeKit:false,openedVials:0,isBlend:false,vialMg:5,
      vials:[{id:"qa-fictional-vial",status:"sealed",expectedMg:5}]});
     return await nexusCommitCurrentState();
    },theme);
    assert.equal(seeded,true,"Fictional source fixture must be saved by exclusive writer");
    await page.evaluate(()=>nexusRecordNasalPreparation("qa-fictional-kit","qa-fictional-vial",{openSealed:true}));
    for(const [id,value] of Object.entries({
     "nx-nasal-source-mg":"5","nx-nasal-bac":"1",
     "nx-nasal-saline":"9","nx-nasal-pump":"0.1"
    }))await page.locator("#"+id).fill(value);
    await page.locator("#nx-nasal-record-save").click();
    assert.equal(await page.locator("#nx-nasal-record-review").isVisible(),true);
    await page.locator("#nx-nasal-record-confirm").check();
    await page.locator("#nx-nasal-record-save").click();
    await page.waitForFunction(()=>{
     const saved=JSON.parse(localStorage.getItem("peptide-tracker-html-v1")||"{}");
     return (saved.formulationStocks||[]).some(b=>b.sourceVialId==="qa-fictional-vial");
    },null,{timeout:15000});
    const result=await page.evaluate(()=>{
     const saved=JSON.parse(localStorage.getItem("peptide-tracker-html-v1"));
     const kit=saved.supplies.find(k=>k.id==="qa-fictional-kit");
     const bottle=saved.formulationStocks.find(b=>b.sourceVialId==="qa-fictional-vial");
     return {remaining:kit.vials[0].remainingMg,status:kit.vials[0].status,
      containerMass:bottle.remainingMg,linked:bottle.sourceKitId,
      savedMatches:JSON.stringify(saved)===_nexusLastSavedSnapshot,
      error:!!document.querySelector("#nexus-storage-warning")};
    });
    assert.equal(result.status,"open");
    assert.equal(result.remaining,0);
    assert.equal(result.containerMass,5);
    assert.equal(result.linked,"qa-fictional-kit");
    assert.equal(result.savedMatches,true);
    assert.equal(result.error,false);
    console.log("PASS: fictional LIVE form and verified source-to-bottle save",width,theme);
    await context.close();
   }
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
