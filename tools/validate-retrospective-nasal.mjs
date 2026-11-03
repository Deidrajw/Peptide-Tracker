// Isolated FULL-APP DEMO browser regression: fictional retrospective nasal transfer.
// Never loads a personal backup or writes production storage.
import assert from "node:assert/strict";
import fs from "node:fs";
import {chromium,webkit} from "playwright";
const version=JSON.parse(fs.readFileSync("release/release.json","utf8")).version;
const engine=process.env.NEXUS_BROWSER==="webkit"?webkit:chromium;
const browser=await engine.launch({headless:true,...(engine===chromium?{args:["--no-sandbox"]}:{})});
let passed=0;
try{
 for(const width of [320,390])for(const theme of ["light","dark"])for(const prior of ["unknown","known"]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  await page.goto("file://"+process.cwd()+"/dist/Nexus_"+version+"_FULL_DEMO.html",{waitUntil:"domcontentloaded"});
  await page.evaluate(theme=>{
   if(!isDemoMode())enterDemoMode("weight_loss");
   document.querySelectorAll(".modal-bg").forEach(x=>x.remove());
   const banner=document.querySelector("#demo-banner");if(banner)banner.style.display="none";
   document.documentElement.dataset.theme=theme;
   state.supplies.push({id:"fictional-ox-kit",name:"Fictional Oxytocin",activeKit:true,
     isBlend:false,vialMg:5,vials:[{id:"fictional-ox-v1",sequenceNumber:1,
     status:"open",remainingMg:5,expectedMg:5,intendedUse:null},
     {id:"fictional-ox-v2",status:"sealed",expectedMg:5}]});
   nexusStashSetLegacyVialMethod("fictional-ox-kit","fictional-ox-v1");
  },theme);
  const radio=page.locator('input[name="nx-stash-vial-use"]');
  const forms=await radio.evaluateAll(xs=>xs.map(x=>x.value));
  assert.ok(forms.indexOf("nasal-source")>=0&&forms.indexOf("nasal-source")<forms.indexOf("Other"),"Nasal above Other");
  await page.locator('input[name="nx-stash-vial-use"][value="nasal-source"]').check();
  await page.locator("#nx-stash-method-confirm").click();
  assert.equal(await page.locator("#nx-nasal-source-mg").count(),1,"Same nasal preparation form opened");
  const geometry=await page.locator(".nx-nasal-actual-prep").evaluate(el=>{
   const rect=el.getBoundingClientRect(),close=el.querySelector(".nx-dose-close")?.getBoundingClientRect();
   return {left:rect.left,right:rect.right,viewport:document.documentElement.clientWidth,
     scroll:document.documentElement.scrollWidth,closeHeight:close?.height||0};
  });
  assert.ok(geometry.left>=-2&&geometry.right<=geometry.viewport+2&&geometry.scroll<=geometry.viewport+2&&geometry.closeHeight>=44,
    "Mobile nasal sheet overflow/close size: "+JSON.stringify(geometry));
  assert.equal(await page.locator("#nx-nasal-prior-status").inputValue(),"unknown","Legacy vial defaults to unverified prior use");
  await page.locator("#nx-nasal-source-mg").fill("5");
  await page.locator("#nx-nasal-bac").fill("1");
  await page.locator("#nx-nasal-saline").fill("4");
  await page.locator("#nx-nasal-pump").fill("0.1");
  await page.locator("#nx-nasal-occurred").fill("2026-10-29");
  if(prior==="known"){
    await page.locator("#nx-nasal-prior-status").selectOption("known");
    await page.locator("#nx-nasal-prior-count").fill("3");
  }
  await page.locator("#nx-nasal-record-save").click();
  assert.equal(await page.locator("#nx-nasal-record-review").isVisible(),true);
  const summary=await page.locator("#nx-nasal-record-review").innerText();
  assert.ok(summary.includes("2026-10-29"),"Historical date visible in review");
  assert.ok(summary.includes(prior==="unknown"?"Unverified":"Nominal balance reduced"),"Prior use displayed accurately");
  fs.mkdirSync("dist",{recursive:true});
  await page.screenshot({path:"dist/Nexus_"+version+"_RETROSPECTIVE_"+engine.name()+"_"+width+"_"+theme+"_"+prior+".png"});
  await page.locator("#nx-nasal-record-confirm").check();
  await page.locator("#nx-nasal-record-save").click();
  const verification=await page.evaluate(()=>{
   const kit=state.supplies.find(x=>x.id==="fictional-ox-kit");
   const container=(state.formulationStocks||[]).find(x=>x.sourceVialId==="fictional-ox-v1");
   return {vialMg:kit?.vials[0]?.remainingMg,sealed:kit?.vials[1]?.status,
     originalId:kit?.vials[0]?.id,balanceStatus:container?.balanceStatus,
     mg:container?.remainingMg,occurredAt:container?.recordedPreparation?.occurredAt,
     priorEvents:container?.transactions?.filter(x=>x.kind==="retrospective-use-adjustment").length||0};
  });
  assert.equal(verification.vialMg,0,"Vial transferred exactly once");
  assert.equal(verification.sealed,"sealed","Sealed stock untouched");
  assert.equal(verification.originalId,"fictional-ox-v1");
  assert.equal(verification.balanceStatus,prior==="unknown"?"unverified":"verified");
  assert.equal(verification.mg,prior==="unknown"?5:4.7);
  assert.equal(verification.priorEvents,prior==="unknown"?0:1);
  assert.equal(verification.occurredAt,"2026-10-29T12:00:00");
  passed++;await context.close();
 }
 console.log("PASS: "+passed+" isolated fictional demo nasal retrospective form/review/commit scenarios; "+engine.name()+" at 320/390 light/dark.");
}catch(e){console.error(e);process.exitCode=1}
finally{await browser.close()}
