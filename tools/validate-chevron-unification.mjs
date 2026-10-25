import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
const version=JSON.parse(fs.readFileSync('release/release.json','utf8')).version, demo=path.resolve("dist/Nexus_"+version+"_FULL_DEMO.html");
if (!fs.existsSync(demo)) throw new Error("Complete DEMO not built");
const b=await chromium.launch({headless:true,args:["--no-sandbox"]}),results=[];
const assert=(x,m)=>{if(!x)throw new Error(m)};
try {
 for (const mode of ["live","demo"]) for (const width of [320,390]) for (const theme of ["light","dark"]) {
  const ctx=await b.newContext({viewport:{width,height:812},hasTouch:true,isMobile:true});
  const pg=await ctx.newPage(),errors=[];
  pg.on("pageerror",e=>errors.push(e.message));
  await pg.goto(mode==="live"?"http://127.0.0.1:8777/":"file://"+demo,{waitUntil:"domcontentloaded"});
  await pg.evaluate(t=>{state=buildDemoState("weight_loss");state.profile.onboardingDone=true;document.documentElement.dataset.theme=t;tab="home";render();document.querySelectorAll(".modal-bg").forEach(x=>x.remove());},theme);
  const inspect=async sel=>{
    const el=pg.locator(sel).first();
    assert(await el.count()>0,"missing "+sel);
    const info=await el.evaluate(e=>({after:getComputedStyle(e,"::after").content,display:getComputedStyle(e,"::after").display,icons:e.querySelectorAll("svg,.nx-proto-chevron,.nexus-quiet-chevron,.nexus-today-details-chevron").length,glyph:e.textContent.includes("▸"),height:e.getBoundingClientRect().height}));
    assert(info.display!=="none"&&info.after!=="none","no shared indicator "+sel);
    assert(info.icons===0,"duplicate authored icon "+sel);
    assert(!info.glyph,"legacy triangle text "+sel);
    assert(info.height>=44,"small tap target "+sel);
    return el;
  };
  // Today deliberately uses a descriptive View tracking / View schedule label;
  // these controls MUST NOT also have a generated chevron.
  const inspectTextDisclosure=async(sel,label)=>{
    const el=pg.locator(sel).first();
    assert(await el.count()>0,"missing text disclosure "+sel);
    const info=await el.evaluate(e=>({
      after:getComputedStyle(e,"::after").content,
      display:getComputedStyle(e,"::after").display,
      text:e.textContent,
      height:e.getBoundingClientRect().height
    }));
    assert(info.display==="none" || info.after==="none","redundant Today chevron "+sel);
    assert(info.text.includes(label),"missing explicit label "+sel);
    assert(info.height>=44,"small text disclosure target "+sel);
  };
  await inspectTextDisclosure(".nexus-today-details>summary","View tracking");
  if(await pg.locator(".nexus-lookahead>summary").count())
    await inspectTextDisclosure(".nexus-lookahead>summary","View schedule");
  if(await pg.locator(".nexus-week-card .nexus-quiet-toggle").count())
    await inspectTextDisclosure(".nexus-week-card .nexus-quiet-toggle","View details");
  const daily=pg.locator(".nexus-today-details").first();
  await daily.locator("summary").click();
  assert(await daily.evaluate(x=>x.open),"Today disclosure failed");
  await pg.evaluate(()=>{tab="protocols";render();document.querySelectorAll(".modal-bg").forEach(x=>x.remove());});
  await inspect(".nexus-protocol-details>summary");
  await pg.locator(".nexus-protocol-details>summary").first().click();
  assert(await pg.locator(".nexus-protocol-details").first().evaluate(x=>x.open),"protocol details not open");
  await pg.evaluate(()=>{tab="stash";render();document.querySelectorAll(".modal-bg").forEach(x=>x.remove());});
  const kitSummary=pg.locator(".nx-kit-card details>summary").first();
  if (await kitSummary.count()) {
    const info=await kitSummary.evaluate(e=>({svg:e.querySelectorAll("svg").length,triangle:e.textContent.includes("▸"),height:e.getBoundingClientRect().height}));
    assert(info.svg===0&&!info.triangle&&info.height>=44,"Stash disclosure duplication");
  }
  assert(errors.length===0,"page errors "+errors.join(";"));
  results.push({mode,width,theme,status:"PASS"});await ctx.close();
 }
} finally {await b.close();}
fs.writeFileSync("dist/Nexus_"+version+"_CHEVRONS_QA.json",JSON.stringify({version,results},null,2));
console.log("Unified chevron browser QA PASS: "+results.length);
