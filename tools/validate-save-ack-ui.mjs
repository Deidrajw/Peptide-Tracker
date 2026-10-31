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
    state.preparedDoses=[];state.lastSourceKit={};
    state.supplies=[{id:91001,name:"Retatrutide",activeKit:true,preparationMethod:"SubQ",totalVials:1,openedVials:1,vialMg:10,bacMl:2,_vialsBackfilled:true,_vialsRepaired:true,vials:[{id:91002,status:"open",intendedUse:"SubQ",vialMg:10,remainingMg:6,reconDate:"2026-10-20T10:00",sequenceNumber:1}],wasteLog:[]}];
    doseModal("Retatrutide");
  },theme);
  await page.locator("#nx-dose-entered").fill("1");
  await page.locator("#nx-dose-review-open").click();
  await page.locator("#save").waitFor({state:"visible"});
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
