"use strict";
const {chromium}=require("playwright");
const path=require("node:path");
const {pathToFileURL}=require("node:url");
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const cases=[];
 for(const width of [320,390]){
  for(const theme of ["dark","light"]){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2});
   const errors=[];page.on("pageerror",e=>errors.push(String(e)));
   await page.goto(pathToFileURL(path.resolve(__dirname,"../preview/NEXUS_HYBRID_FULL_APP_DEMO.html")).href,{waitUntil:"load"});
   await page.waitForTimeout(1200);
   if(theme==="light")await page.evaluate(()=>toggleTheme());
   const info=await page.evaluate(()=>({
    theme:document.documentElement.dataset.theme||"dark",
    isolated:document.documentElement.dataset.storageIsolationFailure!=="true",
    demo:typeof isDemoMode==="function"&&isDemoMode(),
    appText:document.querySelector("#app")?.innerText?.slice(0,100)||"",
    htmlWidth:document.documentElement.scrollWidth,
    innerWidth:window.innerWidth,
    cssLoaded:Array.from(document.querySelectorAll("style[data-source]")).length,
    jsLoaded:Array.from(document.querySelectorAll("script[data-source]")).length,
    background:getComputedStyle(document.body).backgroundColor,
    storageKey:localStorage.getItem("peptide-tracker-html-v1")
   }));
   const result={width,theme,...info,errors:errors.slice(0,5),pass:info.isolated&&info.demo&&info.cssLoaded===4&&info.jsLoaded===12&&info.theme===theme&&info.innerWidth===width&&!/LOADING…/.test(info.appText)&&errors.length===0};
   cases.push(result);
   await page.screenshot({path:path.resolve(__dirname,`hybrid-${width}-${theme}.png`),fullPage:true});
   await page.close();
  }
 }
 await browser.close();
 console.log(JSON.stringify(cases,null,2));
 if(cases.some(c=>!c.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
