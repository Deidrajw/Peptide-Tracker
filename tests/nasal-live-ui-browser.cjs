/* Browser acceptance of the real LIVE nasal preparation form.
 * All data is invented in a fresh Chromium context on a local test server.
 * The release-candidate preparation gate is ON, but the test browser uses
 * only fictional inventory on an isolated local origin.
 */
const fs=require("node:fs");
const assert=require("node:assert/strict");
const {chromium}=require("playwright");
const application=fs.readFileSync("assets/js/04-nexus.js","utf8");
const from="const NEXUS_RECORDED_NASAL_PREPARATION_ENABLED = true;";
assert.ok(application.includes(from),"Preparation-only release gate must be enabled in candidate");
const testOnly=application;
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
  // Regression for real imported backups: localStorage contains an older
  // sparse snapshot, while migrate(loadState()) adds UI defaults in memory.
  // The prior LIVE handler rejected that harmless difference as a stale save.
  const legacyContext=await browser.newContext({viewport:{width:390,height:844}});
  const legacyPage=await legacyContext.newPage();
  await legacyPage.goto("http://127.0.0.1:8777/",{waitUntil:"domcontentloaded"});
  const oldBackup={profile:{onboardingDone:true,name:"Fictional QA"},
   peptides:{},customPeptides:{},dailyLogs:[],
   supplies:[{id:"legacy-qa-kit",name:"Fictional QA Sample",activeKit:false,
    openedVials:0,isBlend:false,vialMg:5,
    vials:[{id:"legacy-qa-vial",status:"sealed",expectedMg:5}]}]};
  await legacyPage.evaluate(saved=>localStorage.setItem("peptide-tracker-html-v1",JSON.stringify(saved)),oldBackup);
  await legacyPage.reload({waitUntil:"domcontentloaded"});
  await legacyPage.waitForFunction(()=>typeof nexusRecordNasalPreparation==="function");
  const initialDifference=await legacyPage.evaluate(()=>{
   const before=JSON.stringify(state)!==localStorage.getItem("peptide-tracker-html-v1");
   // Model an unsaved, UI-only migrated/default value without editing stock.
   state._qaUiOnlyTransient="not-persisted";
   return {before,after:JSON.stringify(state)!==localStorage.getItem("peptide-tracker-html-v1")};
  });
  assert.equal(initialDifference.after,true,"UI-only state must differ from durable JSON");
  console.log("INFO: sparse backup boot mismatch observed",initialDifference.before);
  await legacyPage.evaluate(()=>
   nexusRecordNasalPreparation("legacy-qa-kit","legacy-qa-vial",{openSealed:true}));
  for(const [id,value] of Object.entries({"nx-nasal-source-mg":"5","nx-nasal-bac":"1",
   "nx-nasal-saline":"9","nx-nasal-pump":"0.1"}))
   await legacyPage.locator("#"+id).fill(value);
  await legacyPage.locator("#nx-nasal-record-save").click();
  await legacyPage.locator("#nx-nasal-record-confirm").check();
  await legacyPage.locator("#nx-nasal-record-save").click();
  await legacyPage.waitForFunction(()=>{
   const saved=JSON.parse(localStorage.getItem("peptide-tracker-html-v1")||"{}");
   return (saved.formulationStocks||[]).some(b=>b.sourceVialId==="legacy-qa-vial");
  },null,{timeout:15000});
  assert.equal(await legacyPage.evaluate(()=>{
   const saved=JSON.parse(localStorage.getItem("peptide-tracker-html-v1"));
   return saved.supplies[0].vials[0].remainingMg;
  }),0);
  console.log("PASS: actual LIVE nasal Review/Confirm/Save after sparse backup boot migration");
  await legacyContext.close();

  // Exercise the actual Settings restore modal with an existing raw backup
  // and a migrated UI state. No production origin or user data involved.
  const restoreContext=await browser.newContext({viewport:{width:390,height:844}});
  const restorePage=await restoreContext.newPage();
  restorePage.on("dialog",dialog=>dialog.accept());
  await restorePage.goto("http://127.0.0.1:8777/",{waitUntil:"domcontentloaded"});
  await restorePage.evaluate(saved=>
   localStorage.setItem("peptide-tracker-html-v1",JSON.stringify(saved)),oldBackup);
  await restorePage.reload({waitUntil:"domcontentloaded"});
  await restorePage.waitForFunction(()=>typeof importData==="function");
  await restorePage.evaluate(()=>{
   const next={peptides:{"Fictional New":{doses:[]}},profile:{name:"QA",onboardingDone:true},
    dailyLogs:[],weightLogs:[],supplementLogs:[],
    supplies:[{id:"restored-qa-kit",name:"Fictional New",
     vials:[{id:"restored-qa-vial",status:"sealed",expectedMg:2}]}]};
   importData({target:{files:[new File([JSON.stringify(next)],"fictional-backup.json",
     {type:"application/json"})],value:""}});
  });
  await restorePage.locator("#nx-restore-word").fill("RESTORE");
  await restorePage.locator("#nx-import-confirm").click();
  await restorePage.waitForFunction(()=>{
   const saved=JSON.parse(localStorage.getItem("peptide-tracker-html-v1")||"{}");
   return (saved.supplies||[]).some(k=>k.id==="restored-qa-kit");
  },null,{timeout:15000});
  console.log("PASS: actual Settings Backup & Restore modal with migrated initial state");
  await restoreContext.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
