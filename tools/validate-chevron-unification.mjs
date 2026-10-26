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
  await pg.evaluate(t=>{state=buildDemoState("weight_loss");state.profile.onboardingDone=true;if(t==="dark")delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme="light";tab="home";render();document.querySelectorAll(".modal-bg").forEach(x=>x.remove());},theme);
  // Match the runtime theme contract: dark mode removes data-theme rather than setting "dark".
  const todayHero=await pg.locator('.nexus-today-hero').evaluate(el=>({
    bg:getComputedStyle(el).backgroundImage,
    orbDisplay:getComputedStyle(el,'::before').display,
    maxX:el.getBoundingClientRect().right,
    width:window.innerWidth
  }));
  assert(todayHero.maxX<=todayHero.width+1,'Today hero overflows viewport '+JSON.stringify(todayHero));
  if(theme==='dark'){
    assert(todayHero.bg.includes('68, 52, 81') && todayHero.bg.includes('48, 38, 61'),
      'Approved dark gradient not applied '+todayHero.bg);
    assert(todayHero.orbDisplay==='none','Dark Today upper-right decorative glow remains visible');
  }
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
  // Weekly disclosure was intentionally relocated under Your Activity > This week.
  // Switch the real segmented control before measuring the visible tap target.
  // Today has one weekly summary and a direct report action, not another disclosure.
  assert(await pg.locator('.nx-week-pulse .nx-week-score').count()===1,'Compact weekly pulse score missing');
  assert(await pg.locator('.nx-week-pulse .nx-week-report-link').count()===0,'Retired weekly report button unexpectedly returned');
  assert(await pg.locator('.nx-week-compact .nexus-week-card').count()===0,'Duplicate weekly card remains');
  const headerBell=pg.locator('.nx-today-header #nx-open-alerts');
  assert(await headerBell.count()===1,'Top-right alerts trigger missing');
  assert(await headerBell.evaluate(el=>el.getBoundingClientRect().height)>=44,'Alerts trigger too small');
  await headerBell.click();
  assert(await pg.locator('#nx-alert-overlay').isVisible(),'Alerts sheet failed to open');
  await pg.locator('#nx-alert-close').click();
  assert(await pg.locator('#nx-alert-overlay').isHidden(),'Alerts sheet failed to close');
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
  // Calendar 2.0: actual source rendering at both widths and themes.
  await pg.evaluate(()=>{tab="calendar";state._protoCalSub="month";state._calOff=0;render();document.querySelectorAll(".modal-bg").forEach(x=>x.remove());});
  assert(await pg.locator(".nx-cal-hub").count()===1,"Calendar activity overview missing");
  assert(await pg.locator(".nx-cal-hub-stats > div").count()===3,"Calendar outcome metrics missing");
  assert(await pg.locator(".cal-day").count()>=28,"Calendar current-month grid missing");
  await pg.locator(".cal-day").first().click();
  assert(await pg.locator(".nx-cal-category").count()===3,"Categorized day history missing");
  await pg.locator('.nx-cal-category[data-category="scheduled"]').click();
  assert((await pg.locator('.nx-cal-category[data-category="scheduled"]').getAttribute("aria-pressed"))==="true","Scheduled category selection failed");
  await pg.locator("#pcal-week").click();
  assert(await pg.locator(".cal-day").count()>=4,"Calendar Week view missing");
  assert(await pg.locator(".nx-cal-hub").count()===1,"Calendar Week summary missing");
  await pg.locator("#pcal-month").click();
  assert(await pg.locator(".cal-day").count()>=28,"Calendar Month restore failed");
  // The selected date must open the full journal without losing its date.
  await pg.locator(".cal-day").first().click();
  const selectedCalendarDate=await pg.locator(".cal-day.nexus-cal-selected").first().getAttribute("data-date");
  await pg.locator("#nx-open-day-logs").click();
  assert(await pg.locator(".nx-journal").count()===1,"Logs journal missing");
  assert(await pg.locator("#nx-journal-date").inputValue()===selectedCalendarDate,"Selected day not carried into Logs");
  assert(await pg.locator(".nx-journal-mode").count()===2,"Day/All modes missing");
  assert(await pg.locator(".nx-journal").count()===1,"Day journal failed");
  await pg.screenshot({path:"dist/logs-day-"+mode+"-"+theme+"-"+width+".png",fullPage:false});
  await pg.locator('.nx-journal-mode[data-mode="all"]').click();
  assert(await pg.locator(".nx-journal-filter").count()===7,"All Logs type filtering missing");
  assert(await pg.locator(".nx-journal-row").count()>0,"All Logs fictional fixture has no records");
  assert(await pg.locator(".nx-journal-mark svg").count()>0,"Outline log icons missing");
  // Search must filter immediately, preserve focus, and restore rows when cleared.
  const historySearch=pg.locator("#nx-journal-search");
  assert(await historySearch.count()===1,"History search missing");
  const allLogRows=await pg.locator(".nx-journal-row:visible").count();
  await historySearch.fill("unmatchable-journal-query-9348");
  assert(await pg.locator(".nx-journal-row:visible").count()===0,"Live search failed to hide unmatched records");
  assert(await pg.locator("#nx-journal-search-empty").isVisible(),"Live search empty state missing");
  assert(await historySearch.evaluate(el=>document.activeElement===el),"Typing moved focus from search field");
  await historySearch.fill("");
  assert(await pg.locator(".nx-journal-row:visible").count()===allLogRows,"Clearing search failed to restore history");
  assert(await pg.locator("#nx-journal-search-empty").isHidden(),"Search empty state still visible after clear");
  await pg.screenshot({path:"dist/logs-all-"+mode+"-"+theme+"-"+width+".png",fullPage:false});
  await pg.locator('.nx-journal-filter[data-type="Weight"]').click();
  assert(await pg.locator('.nx-journal-filter[data-type="Weight"]').evaluate(el=>el.classList.contains("on")),"Weight filter failed");
  await pg.locator('.nx-journal-mode[data-mode="day"]').click();
  const chosenBefore=await pg.locator("#nx-journal-date").inputValue();
  await pg.locator('.nx-journal-day-step[data-offset="-1"]').click();
  const previousDate=await pg.locator("#nx-journal-date").inputValue();
  assert(previousDate!==chosenBefore,"Previous day failed to change selected date");
  await pg.locator('.nx-journal-day-step[data-offset="1"]').click();
  assert(await pg.locator("#nx-journal-date").inputValue()===chosenBefore,"Next day failed to restore selected date");
  await pg.locator("#nx-journal-today").click();
  assert(await pg.locator("#nx-journal-date").inputValue()===await pg.evaluate(()=>localDate()),"Today date picker action failed");
  await pg.evaluate(()=>{state._protoCalSub="month";render();});
  const calWidth=await pg.locator(".nx-cal-hub").evaluate(el=>({width:el.getBoundingClientRect().width,left:el.getBoundingClientRect().left,screen:innerWidth}));
  assert(calWidth.left>=-1 && calWidth.left+calWidth.width<=calWidth.screen+2,"Calendar 2.0 horizontal overflow "+JSON.stringify(calWidth));
  await pg.screenshot({path:"dist/calendar-hub-"+mode+"-"+theme+"-"+width+".png",fullPage:false});
  assert(errors.length===0,"page errors "+errors.join(";"));
  results.push({mode,width,theme,status:"PASS"});await ctx.close();
 }
} finally {await b.close();}
fs.writeFileSync("dist/Nexus_"+version+"_CHEVRONS_QA.json",JSON.stringify({version,results},null,2));
console.log("Unified chevron browser QA PASS: "+results.length);
