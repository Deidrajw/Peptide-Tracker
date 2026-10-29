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
   // Compare the actual rendered components, not just selector or class presence.
   let disclosureParity={tested:false};
   const compact=page.locator(".nx-compound-card .compound-compact-tap").first();
   if(await compact.count()){
     // Regression: the compact schedule summary and action row must have no rails.
     const compactBorders=await compact.evaluate(node=>{
       const card=node.closest(".nx-compound-card");
       const facts=card?.querySelector(".nx-card-facts");
       const actions=card?.querySelector(".nx-compound-actions");
       const px=(element,side)=>element?parseFloat(getComputedStyle(element)[side])||0:null;
       return {factsTop:px(facts,"borderTopWidth"),factsBottom:px(facts,"borderBottomWidth"),
         actionsTop:px(actions,"borderTopWidth")};
     });
     if(compactBorders.factsTop!==0||compactBorders.factsBottom!==0||
       (compactBorders.actionsTop!==null&&compactBorders.actionsTop!==0))
       throw Error("Compact Today dividers persist at "+width+"/"+theme+": "+JSON.stringify(compactBorders));
     const collapsed=await compact.evaluate(node=>{
       const pill=node.querySelector(".nx-today-disclosure");
       const title=node.querySelector(".nx-today-compound-name");
       if(!pill||!title)return null;
       const p=getComputedStyle(pill), t=getComputedStyle(title);
       return {pill:{background:p.backgroundColor,borderRadius:p.borderRadius,borderWidth:p.borderTopWidth,
         fontFamily:p.fontFamily,fontSize:p.fontSize,fontWeight:p.fontWeight,height:p.height,padding:p.padding},
         name:{text:title.textContent.trim(),fontFamily:t.fontFamily,fontSize:t.fontSize,
         fontWeight:t.fontWeight,letterSpacing:t.letterSpacing,lineHeight:t.lineHeight}};
     });
     await compact.click();
     const expanded=page.locator(".nx-hybrid-expanded-compound .compound-collapse-btn.nx-today-disclosure").first();
     if(!collapsed||!(await expanded.count())) throw Error("Today disclosure missing in compact or expanded "+width+"/"+theme);
     const shown=await expanded.evaluate(node=>{
       const root=node.closest(".nx-hybrid-expanded-compound");
       const title=root?.querySelector(".nx-today-compound-name");
       if(!title)return null;
       const p=getComputedStyle(node),t=getComputedStyle(title);
       return {pill:{background:p.backgroundColor,borderRadius:p.borderRadius,borderWidth:p.borderTopWidth,
         fontFamily:p.fontFamily,fontSize:p.fontSize,fontWeight:p.fontWeight,height:p.height,padding:p.padding},
         name:{text:title.textContent.trim(),fontFamily:t.fontFamily,fontSize:t.fontSize,
         fontWeight:t.fontWeight,letterSpacing:t.letterSpacing,lineHeight:t.lineHeight}};
     });
     const parity=!!shown && JSON.stringify(collapsed)===JSON.stringify(shown);
     disclosureParity={tested:true,pass:parity,collapsed,expanded:shown};
     if(!parity)throw Error("Today disclosure/name visual parity failed at "+width+"/"+theme+": "+JSON.stringify(disclosureParity));
   }else throw Error("No Today compact card found for UI acceptance at "+width+"/"+theme);
   cases.push({width,theme,...info,disclosureParity,errors:errors.slice(0,5),pass:ok&&disclosureParity.pass});
   await page.screenshot({path:path.resolve(__dirname,`hybrid-${width}-${theme}.png`),fullPage:true});
   // Source-faithful mobile form visual evidence, isolated to full-app DEMO.
   await page.evaluate(()=>{state.profile.onboardingDone=true;state.plans={goals:[],research:[],shopping:[]};tab="plans";state._plansSub="research";render();});
   for(const editor of ["research","shopping"]){
     await page.evaluate(kind=>{state._plansSub=kind;render();if(kind==="research")researchModal();else shoppingModal();},editor);
     const form=page.locator(".nx-plan-"+editor+"-edit");
     if(await form.count()!==1)throw Error(editor+" editor missing at "+width+"/"+theme);
     const layout=await form.evaluate(el=>{
       const save=el.querySelector(".nx-plan-edit-footer .btn-primary");
       const labels=[...el.querySelectorAll(".nx-plan-edit-field>label")];
       const all=[...el.querySelectorAll(".nx-plan-edit-field>input,.nx-plan-edit-field>select,.nx-plan-edit-field>textarea")];
       return {saveHeight:save?.getBoundingClientRect().height||0,labels:labels.length,
         horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,
         minHeight:Math.min(...all.map(n=>n.getBoundingClientRect().height))};
     });
     if(layout.saveHeight<44||layout.minHeight<44||layout.horizontalOverflow||layout.labels<(editor==="research"?5:6))
       throw Error(editor+" mobile form layout failed "+width+"/"+theme+" "+JSON.stringify(layout));
     await page.screenshot({path:path.resolve(__dirname,`hybrid-${editor}-form-${width}-${theme}.png`),fullPage:true});
     await page.evaluate(()=>closeModal());
   }

   await page.close();
 }
 await browser.close();
 console.log(JSON.stringify({sourceDemo:demoPath,cases},null,2));
 if(cases.some(c=>!c.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
