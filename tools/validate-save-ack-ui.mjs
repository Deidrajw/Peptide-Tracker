import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";
const version=JSON.parse(fs.readFileSync("release/release.json","utf8")).version;
const demo=path.resolve("dist/Nexus_"+version+"_FULL_DEMO.html");
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
let checks=0;
try{
 for(const width of [320,390])for(const theme of ["dark","light"])for(const mode of ["live","demo"]){
  const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(mode==="live"?"http://127.0.0.1:8777/":"file://"+demo,{waitUntil:"domcontentloaded"});
  await page.evaluate(t=>{
    state=buildDemoState("weight_loss");
    state.profile.onboardingDone=true;
    document.documentElement.dataset.theme=t;
    state.peptides.Retatrutide={enabled:true,status:"active",route:"SubQ",scheduleDays:7,doses:[],lastDose:2};
    // Isolate this failure-ack test to one injectable source. The default
    // fictional demo may also contain prepared capsule/nasal stocks, which
    // correctly opens the product-form picker instead of #nx-dose-entered.
    state.formulationStocks=[];state.preparedDoses=[];state.lastSourceKit={};
    state.supplies=[{id:91001,name:"Retatrutide",activeKit:true,preparationMethod:"SubQ",totalVials:1,openedVials:1,vialMg:10,bacMl:2,_vialsBackfilled:true,_vialsRepaired:true,vials:[{id:91002,status:"open",intendedUse:"SubQ",vialMg:10,remainingMg:6,reconDate:"2026-10-20T10:00",sequenceNumber:1}],wasteLog:[]}];
    doseModal("Retatrutide");
  },theme);
  // Fail with a useful regression message if product-form selection changes.
  if(await page.locator(".nx-form-choice-sheet").count())throw Error("Save-ack injectable fixture unexpectedly opened product-form picker");
  try {
    await page.locator("#nx-dose-entered").waitFor({state:"visible",timeout:5000});
  } catch (error) {
    const diagnostic=await page.evaluate(()=>({
      heading:document.querySelector(".modal")?.innerText?.slice(0,500),
      doseInputCount:document.querySelectorAll("#nx-dose-entered").length,
      formChoiceCount:document.querySelectorAll(".nx-form-choice-sheet").length,
      modalCount:document.querySelectorAll(".modal").length,
      reviewCount:document.querySelectorAll("#nx-dose-review-open").length,
      route:state.peptides?.Retatrutide?.route,
      kits:(state.supplies||[]).map(s=>({name:s.name,id:s.id,activeKit:s.activeKit,vials:s.vials?.map(v=>({id:v.id,status:v.status,remainingMg:v.remainingMg}))})),
      formulationStocks:state.formulationStocks?.length,
      preparedDoses:state.preparedDoses?.length
    }));
    throw Error("Save-ack amount field unavailable "+width+"/"+theme+"/"+mode+": "+JSON.stringify(diagnostic)+"; "+String(error));
  }
  await page.locator("#nx-dose-entered").fill("1");
  // Assert what a person sees before Review. The canonical hidden field may
  // be empty until its normal input handler/review reconciliation runs.
  const visibleBeforeReview=await page.locator("#nx-dose-entered").inputValue();
  if(visibleBeforeReview!=="1")throw Error("Visible dose amount changed before review: "+JSON.stringify({width,theme,mode,visibleBeforeReview}));
  await page.locator("#nx-dose-review-open").click();
  // Review must expose Confirm Log. Diagnose a rejected review rather than
  // waiting 30 seconds for an intentionally hidden control.
  if(!(await page.locator("#save").isVisible())){
    const review=await page.evaluate(()=>({
      date:document.querySelector(".modal #date")?.value,
      amount:document.querySelector(".modal #dose")?.value,
      visibleAmount:document.querySelector(".modal #nx-dose-entered")?.value,
      unit:document.querySelector(".modal #nx-dose-unit")?.value,
      method:document.querySelector(".modal #nx-dose-method")?.value,
      reviewHidden:document.querySelector(".modal .nx-dose-review-stage")?.hidden,
      note:document.querySelector(".modal #nx-validation-message")?.textContent,
      source:document.querySelector(".modal .nx-dose-source-exception")?.innerText.slice(0,250),
      visibleAlerts:[...document.querySelectorAll('[role="alert"]')].filter(x=>x.getBoundingClientRect().width>0).map(x=>x.textContent.slice(0,200))
    }));
    throw Error("Save-ack review failed "+width+"/"+theme+"/"+mode+": "+JSON.stringify(review));
  }
  // Fresh inventory-backed dosing no longer calls synchronous saveState().
  // Simulate the EXCLUSIVE commit failing, not a retired persistence path.
  // Synthetic fixtures remain isolated in memory and never write real storage.
  await page.evaluate(()=>{
    _demoActive=true;
    window.__originalCommitBacked=nexusCommitBackedPhysicalDose;
    window.__saveAckBefore=JSON.stringify(state);
    nexusCommitBackedPhysicalDose=async()=>null;
  });
  await page.locator("#save").click();
  await page.getByText("No dose was committed.",{exact:false}).waitFor({state:"visible",timeout:5000});
  if(await page.locator(".nx-reaction-invite").count())throw Error("False success invitation after exclusive commit rejection");
  if(!(await page.locator(".nx2-dose-modal").count()))throw Error("Dose modal closed after exclusive commit rejection");
  const saved=await page.evaluate(()=>({
    before:JSON.parse(window.__saveAckBefore),
    after:state
  }));
  if(saved.after.peptides.Retatrutide.doses.length!==0||
     saved.after.supplies[0].vials[0].remainingMg!==6)
    throw Error("Failed exclusive save changed fictional stock or history");
  await page.evaluate(()=>{nexusCommitBackedPhysicalDose=window.__originalCommitBacked;closeModal()});
  if(errors.length)throw Error("Browser errors: "+errors.join("; "));
  checks++;
  await context.close();
 }
 console.log("PASS: dose-save failure remains open, no false success invitation in "+checks+" fictional LIVE/DEMO width/theme configurations");
}finally{await browser.close()}
