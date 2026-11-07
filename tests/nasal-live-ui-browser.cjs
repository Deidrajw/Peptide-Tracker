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
const manifest=JSON.parse(fs.readFileSync("release/release.json","utf8"));
const candidate=manifest.version==="v0.9.26-beta.1"&&
 manifest.changes.some(c=>c.key==="prepared-nasal-live");
assert.match(testOnly,new RegExp("const NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED = "+(candidate?"true":"false")+";"),
 "LIVE nasal gate must match the explicitly approved release candidate");
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
  // Real browser reproduction: use Settings → Backup & Restore to load a
  // fictional sparse older backup, then record a nasal preparation on that
  // restored inventory with an in-memory-only view field. This exercises both
  // distinct user-reported problem paths without touching production origin.
  const legacyContext=await browser.newContext({viewport:{width:390,height:844}});
  const legacyPage=await legacyContext.newPage();
  legacyPage.on("dialog",dialog=>dialog.accept());
  await legacyPage.goto("http://127.0.0.1:8777/",{waitUntil:"domcontentloaded"});
  await legacyPage.waitForFunction(()=>typeof nexusRecordNasalPreparation==="function"&&typeof importData==="function");
  const oldBackup={profile:{onboardingDone:true,name:"Fictional QA"},
   peptides:{"Fictional QA Sample":{doses:[]}},customPeptides:{},dailyLogs:[],
   supplies:[{id:"legacy-qa-kit",name:"Fictional QA Sample",activeKit:false,
    openedVials:0,isBlend:false,vialMg:5,
    vials:[{id:"legacy-qa-vial",status:"sealed",expectedMg:5}]}]};
  await legacyPage.evaluate(saved=>{
   const jsonFile=new File([JSON.stringify(saved)],"fictional-old-backup.json",
    {type:"application/json"});
   importData({target:{files:[jsonFile],value:""}});
  },oldBackup);
  await legacyPage.locator("#nx-restore-word").fill("RESTORE");
  await legacyPage.locator("#nx-import-confirm").click();
  await legacyPage.waitForFunction(()=>{
   const raw=localStorage.getItem("peptide-tracker-html-v1");
   return raw&&JSON.parse(raw).supplies.some(k=>k.id==="legacy-qa-kit");
  },null,{timeout:15000});
  const imported=await legacyPage.evaluate(()=>{
   const raw=localStorage.getItem("peptide-tracker-html-v1");
   const before=JSON.stringify(state)!==raw;
   state._qaUiOnlyTransient="not-persisted";
   return {before,after:JSON.stringify(state)!==raw,
    source:state.supplies.find(k=>k.id==="legacy-qa-kit")?.vials?.[0]?.status};
  });
  assert.equal(imported.after,true,"In-memory-only display fields must differ from durable JSON");
  assert.equal(imported.source,"sealed","Imported exact source vial must exist");
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
   return saved.supplies.find(k=>k.id==="legacy-qa-kit").vials[0].remainingMg;
  }),0);
  console.log("PASS: actual Settings restore of fictional old backup followed by LIVE nasal save despite UI-only state difference");
  await legacyContext.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
