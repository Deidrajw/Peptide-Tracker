/* PR124: pure source-eligibility gate for use configurations.
 * Read-only. Never treats saved plans as prepared inventory; never writes/debits stock.
 * Browser integration is deliberately disabled until coordinated atomic writer approval.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.NexusUseSourceEligibility=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 const finite=n=>typeof n==="number"&&Number.isFinite(n);
 const positive=n=>finite(n)&&n>0;
 const same=(a,b)=>String(a)===String(b);
 const methodOf=(kit,vial)=>vial?.intendedUse||kit?.preparationMethod||kit?.administrationMethod||kit?.route||null;
 function inspect(snapshot,{compound,method,trackingMode="backed"}={}){
  if(typeof compound!=="string"||!compound.trim())throw Error("Compound required");
  if(!["SubQ","IM","IV","Nasal","Oral","Topical","Other"].includes(method))throw Error("Explicit supported method required");
  if(!["backed","untracked"].includes(trackingMode))throw Error("Explicit tracking mode required");
  if(trackingMode==="untracked")return {mode:"untracked",eligible:[],blocked:[],needsSource:false};
  const eligible=[],blocked=[];
  const add=(candidate,why)=>{(why?blocked:eligible).push(why?{...candidate,reason:why}:candidate)};
  for(const kit of snapshot?.supplies||[]){
   if(kit.name!==compound||kit.isBlend)continue;
   for(const vial of kit.vials||[]){
    if(!["open","active"].includes(vial.status)||!positive(vial.remainingMg))continue;
    const source={kind:"physical-vial",kitId:kit.id,vialId:vial.id,method:methodOf(kit,vial),remainingMg:vial.remainingMg};
    const reason=!["SubQ","IM","IV"].includes(method)?"Physical vial is not prepared stock":!source.method?"Method not confirmed":source.method!==method?"Different confirmed method":null;
    add(source,reason);
   }
  }
  for(const pd of snapshot?.preparedDoses||[]){
   if(!Number.isSafeInteger(pd.remainingCount)||pd.remainingCount<=0)continue;
   const components=Array.isArray(pd.components)?pd.components:[];
   const names=components.map(c=>c.compoundName);
   if(names.length!==1||names[0]!==compound)continue;
   const source={kind:"prepared-syringe",preparedId:pd.id,remainingCount:pd.remainingCount,method:pd.method||"SubQ"};
   add(source,!["SubQ","IM","IV"].includes(method)?"Prepared syringe is injectable only":source.method!==method?"Different prepared route":!positive(pd.amountEach)?"Unverified prepared dose amount":null);
  }
  for(const s of snapshot?.formulationStocks||[]){
   if(s.compound!==compound)continue;
   const source={kind:"formulation-container",containerId:s.id,containerType:s.containerType,method:s.method,remainingMg:s.remainingMg,remainingMl:s.remainingMl,remainingCount:s.remainingCount};
   let why=null;
   if(s.method!==method)why="Different administration method";
   else if(s.containerType==="nasal-bottle"){
    if(!positive(s.remainingMg)||!positive(s.remainingMl))why="No measured prepared stock";
    else if(!positive(s.mgPerSpray)||!positive(s.mlPerSpray))why="Spray conversion not verified";
   }else if(s.containerType==="capsule-bottle"){
    if(!Number.isSafeInteger(s.remainingCount)||s.remainingCount<=0||!positive(s.mgPerCapsule))why="Capsule balance or strength unavailable";
   }else if(s.containerType==="topical-container"){
    if(!positive(s.remainingMl))why="No available topical volume";
    else why="Topical delivery conversion not verified";
   }else why="Unprepared or unsupported formulation";
   add(source,why);
  }
  return {mode:"backed",eligible,blocked,needsSource:eligible.length!==1};
 }
 function planNasalSprays(snapshot,{compound,containerId,count}={}){
  if(!Number.isSafeInteger(count)||count<=0)throw Error("Positive whole spray count required");
  const stock=(snapshot?.formulationStocks||[]).find(s=>same(s.id,containerId));
  if(!stock||stock.compound!==compound||stock.containerType!=="nasal-bottle"||stock.method!=="Nasal")throw Error("Verified exact nasal container required");
  if(!positive(stock.mgPerSpray)||!positive(stock.mlPerSpray))throw Error("Verified bottle-specific spray and volume conversion required");
  if(!finite(stock.remainingMg)||!finite(stock.remainingMl))throw Error("Malformed prepared source balance");
  const mg=count*stock.mgPerSpray,ml=count*stock.mlPerSpray;
  if(!Number.isFinite(mg)||!Number.isFinite(ml)||mg<=0||ml<=0)throw Error("Invalid conversion");
  if(mg>stock.remainingMg+1e-8||ml>stock.remainingMl+1e-8)throw Error("Insufficient prepared source");
  return {containerId:stock.id,compound,method:"Nasal",sprays:count,amountMg:mg,volumeMl:ml,remainingMg:stock.remainingMg-mg,remainingMl:stock.remainingMl-ml,sourceKind:"formulation-container"};
 }
 return {inspect,planNasalSprays};
});
