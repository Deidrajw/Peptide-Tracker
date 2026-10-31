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
  await page.evaluate(()=>{
    window.__originalSaveState=saveState;
    saveState=()=>false; // simulated storage failure, without real writes
  });
  await page.locator("#save").click();
  if(await page.locator(".nx-reaction-invite").count())throw Error("False success invitation after failing persistence");
  if(!(await page.locator(".nx2-dose-modal").count()))throw Error("Dose modal closed after failing persistence");
  const message=await page.locator("body").innerText();
  if(!message.includes("Dose could not be saved"))throw Error("Failure warning absent");
  await page.evaluate(()=>{saveState=window.__originalSaveState;closeModal()});
  if(errors.length)throw Error("Browser errors: "+errors.join("; "));
  checks++;
  await context.close();
 }
 console.log("PASS: dose-save failure remains open, no false success invitation in "+checks+" fictional LIVE/DEMO width/theme configurations");
}finally{await browser.close()}
