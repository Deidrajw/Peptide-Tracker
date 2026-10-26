"use strict";
const {chromium}=require("playwright");
const fs=require("node:fs");
const path=require("node:path");
const {pathToFileURL}=require("node:url");
(async()=>{
 const version=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../release/release.json"),"utf8")).version;
 const demoPath=path.resolve(__dirname,`../dist/Nexus_${version}_FULL_DEMO.html`);
 if(!fs.existsSync(demoPath)) throw Error("Exact-source full-app demo missing: "+demoPath);
 const html=fs.readFileSync(demoPath,"utf8");
 if(!html.includes("window.__NEXUS_FULL_APP_DEMO__")) throw Error("Storage isolation bootstrap missing");
 if(!html.includes("nx-today-slots-title") || !html.includes("nx-compact-disclosure-label"))
   throw Error("Latest Today design source missing from built DEMO");
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const cases=[];
 for(const width of [320,390]) for(const theme of ["dark","light"]){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2});
   const errors=[];page.on("pageerror",e=>errors.push(String(e)));
   await page.goto(pathToFileURL(demoPath).href,{waitUntil:"load"});
   await page.waitForTimeout(850);
   if(theme==="light")await page.evaluate(()=>toggleTheme());
   const info=await page.evaluate(()=>({
     theme:document.documentElement.dataset.theme||"dark",
     demo:window.__NEXUS_FULL_APP_DEMO__===true,
     isolated:document.documentElement.dataset.storageIsolationFailure!=="true",
     appText:document.querySelector("#app")?.innerText?.slice(0,140)||"",
     htmlWidth:document.documentElement.scrollWidth,
     innerWidth:window.innerWidth,
     cards:document.querySelectorAll(".nx-compound-card,.nx-hybrid-expanded-compound").length,
     compactDisclosure:document.querySelectorAll(".nx-compact-disclosure-label").length,
     cssLoaded:document.querySelectorAll("style").length,
     jsLoaded:document.querySelectorAll("script").length
   }));
   const ok=info.demo && info.isolated && info.theme===theme
      && info.innerWidth===width && info.htmlWidth<=width+1
      && !/LOADING…/.test(info.appText) && info.appText.length>0
      && info.jsLoaded>=12 && errors.length===0;
   cases.push({width,theme,...info,errors:errors.slice(0,5),pass:ok});
   await page.screenshot({path:path.resolve(__dirname,`hybrid-${width}-${theme}.png`),fullPage:true});
   await page.close();
 }
 await browser.close();
 console.log(JSON.stringify({sourceDemo:demoPath,cases},null,2));
 if(cases.some(c=>!c.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
