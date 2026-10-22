
"use strict";

// ─── Theme ────────────────────────────────────────────────────────────────────
(function() {
  const saved = localStorage.getItem('pep-theme') || 'dark';
  if (saved === 'light') document.documentElement.dataset.theme = 'light';
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = saved === 'light' ? '🌙' : '☀️';
})();
function toggleTheme() {
  const isLight = document.documentElement.dataset.theme === 'light';
  const next = isLight ? 'dark' : 'light';
  if (next === 'dark') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = 'light';
  localStorage.setItem('pep-theme', next);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'light' ? '🌙' : '☀️';
}

// ─── Persistence (localStorage) ────────────────────────────────────────────
const STORE_KEY = "peptide-tracker-html-v1";
function loadState() {
  try { const r = localStorage.getItem(STORE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
// ── DEVELOPER DEMO MODE ──────────────────────────────────────────────────────
let _realState = null;
let _demoActive = false;

function isDemoMode() { return _demoActive; }

// Safety foundation: retain the original browser data before this build writes/migrates it.
// The backup is local to this browser, created once, and never contains demo data.
const PRE_UPGRADE_BACKUP_KEY = STORE_KEY + "-pre-upgrade-backup-20261021";
function preserveOriginalState() {
  try {
    if (localStorage.getItem(PRE_UPGRADE_BACKUP_KEY) !== null) return;
    const original = localStorage.getItem(STORE_KEY);
    if (original !== null) localStorage.setItem(PRE_UPGRADE_BACKUP_KEY, original);
  } catch (e) { console.error("Unable to preserve pre-upgrade state", e); showSaveWarning(); }
}
let _saveWarningShown = false;
function showSaveWarning() {
  if (_saveWarningShown) return;
  _saveWarningShown = true;
  const warning = document.createElement('div');
  warning.id = 'nexus-storage-warning';
  warning.setAttribute('role', 'alert');
  warning.style.cssText = 'position:fixed;z-index:99999;left:12px;right:12px;bottom:calc(82px + env(safe-area-inset-bottom));padding:14px 16px;border-radius:12px;background:#702626;color:#fff;box-shadow:0 6px 25px #0007;font:600 14px/1.5 system-ui,sans-serif';
  warning.textContent = 'Changes could not be saved on this device. Check browser storage and export a backup before closing the app.';
  document.body.appendChild(warning);
}
function saveState() {
  if(_demoActive) return; // never write demo data to localStorage
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
  catch(e) { console.error('Nexus save failed', e); showSaveWarning(); }
}

function enterDemoMode(scenario) {
  if(_demoActive) return;
  _realState = JSON.parse(JSON.stringify(state)); // deep clone real state
  _demoActive = true;
  state = buildDemoState(scenario||"weight_loss");
  // Demo Mode can be entered mid-session, well after the real boot-time migration already
  // ran and set inventoryModelVersion=2 on the PREVIOUS state object — but state here was
  // just replaced wholesale with a fresh object that never went through that. Without
  // this, every demo kit would sit unmigrated until something happened to write to it,
  // relying entirely on the legacy fallback branches for anything that reads it first
  // (which Stash's card render does, immediately). Migrating here is what keeps that
  // fallback path genuinely unnecessary rather than quietly load-bearing.
  migrateToInventoryV2();
  render();
}

function exitDemoMode() {
  if(!_demoActive) return;
  _demoActive = false;
  state = _realState;
  _realState = null;
  render();
}

function buildDemoState(scenario) {
  const now = new Date();
  const daysAgo = n => new Date(now.getTime()-n*86400000).toISOString().slice(0,10);
  const uid2 = () => Math.floor(Math.random()*1e9)+1;
  const randBetween = (a,b) => Math.random()*(b-a)+a;

  // ── Demo helpers ──────────────────────────────────────────────────────────
  // Weekly compound: date only (calendar-day logic is fine)
  const mkDose = (name,daysBack,dose,site) => ({id:uid2(),date:daysAgo(daysBack)+"T08:00:00",dose:String(dose),site:site||"Abdomen",symptoms:[],notes:"",escalation:false});
  // Daily compound: include proper time so 24h datetime logic works correctly
  const mkDoseDaily = (name,daysBack,dose,site,hh=20) => ({id:uid2(),date:daysAgo(daysBack)+"T"+String(hh).padStart(2,"0")+":00:00",dose:String(dose),site:site||"Abdomen",symptoms:[],notes:"",escalation:false});
  const mkLog = (daysBack,mood,symptoms,compound,notes,symptomTags,compoundNotes) => ({
    id:uid2(), date:daysAgo(daysBack), mood:mood||3,
    symptoms:(symptoms||[]).map(s=>({name:s,intensity:2})),
    compound:compound||null,
    symptomTags:symptomTags||{},
    compoundNotes:compoundNotes||{},
    notes:notes||""
  });
  const mkWeight = (daysBack,lbs) => ({id:uid2(),date:daysAgo(daysBack),weight:lbs.toFixed(1),sourceType:"manual"});
  const mkMeasure = (daysBack,waist) => ({id:uid2(),date:daysAgo(daysBack),waist:waist.toFixed(1),hips:"",chest:"",sourceType:"manual"});
  const mkMacro = (daysBack,cal,p,c,f) => ({id:uid2(),date:daysAgo(daysBack)+"T12:00:00",calories:cal,protein:p,carbs:c,fat:f,sourceType:"aggregate_csv",importBatchId:"demo_batch_1"});
  const mkSupp = (daysBack,taken) => ({id:uid2(),date:daysAgo(daysBack),taken});
  const mkActivity = (daysBack,steps,activeCalories,restingHR,hrv,basalCalories) => ({
    id:uid2(), date:daysAgo(daysBack)+"T12:00:00",
    sourceType:"aggregate_csv", importBatchId:"demo_batch_1",
    ...(steps!=null&&{steps}), ...(activeCalories!=null&&{activeCalories}),
    ...(restingHR!=null&&{restingHR}), ...(hrv!=null&&{hrv}),
    ...(basalCalories!=null&&{basalCalories})
  });
  const mkWorkout = (daysBack,activity,durationMin,workoutCal,avgHR,maxHR,distKm,hh=8) => ({
    id:uid2(), date:daysAgo(daysBack)+"T"+String(hh).padStart(2,"0")+":00:00",
    sourceType:"workout_csv", importBatchId:"demo_batch_2",
    isWorkout:true, workoutType:activity,
    workoutStart:daysAgo(daysBack)+"T"+String(hh).padStart(2,"0")+":00:00",
    workoutEnd:daysAgo(daysBack)+"T"+String(hh+Math.floor(durationMin/60)).padStart(2,"0")+":"+String(durationMin%60).padStart(2,"0")+":00",
    durationMin, workoutActiveCalories:workoutCal, avgHR, maxHR,
    ...(distKm!=null&&{distanceKm:distKm})
  });

  // Shared base
  const base = defaultState();
  base.profile = {name:"Demo User",startDate:daysAgo(90),startWeight:"188",goalWeight:"165",height:"",age:"",gender:"",onboardingDone:true};
  base.settings = {...base.settings,weightUnit:"lbs",graceHours:3,supplements:["Magnesium Citrate","Psyllium Husk","Peppermint Oil (Enteric)","Betaine HCl","Vitamin C","Berberine HCl","L-Carnitine","Taurine"]};

  if(scenario==="weight_loss") {
    // 90 days of Retatrutide, titrated 0.5→1→1.5→2mg
    const retaDoses = [
      mkDose("Retatrutide",91,0.5,"Abdomen — upper L"),
      mkDose("Retatrutide",84,0.5,"Abdomen — lower R"),
      mkDose("Retatrutide",77,1.0,"Abdomen — upper R"),
      mkDose("Retatrutide",70,1.0,"Abdomen — lower L"),
      mkDose("Retatrutide",63,1.5,"Thigh — outer L"),
      mkDose("Retatrutide",56,1.5,"Abdomen — upper L"),
      mkDose("Retatrutide",49,1.5,"Abdomen — lower R"),
      mkDose("Retatrutide",42,2.0,"Abdomen — upper R"),
      mkDose("Retatrutide",35,2.0,"Abdomen — lower L"),
      mkDose("Retatrutide",28,2.0,"Thigh — outer R"),
      mkDose("Retatrutide",21,2.0,"Abdomen — upper L"),
      mkDose("Retatrutide",14,2.0,"Abdomen — lower R"),
      mkDose("Retatrutide",7,2.0,"Abdomen — upper R"),
    ];
    retaDoses[2].escalation=true; retaDoses[4].escalation=true; retaDoses[7].escalation=true;
    retaDoses[9].notes="Barely any nausea this time — smaller dinner the night before seemed to help.";
    base.peptides["Retatrutide"] = {doses:retaDoses,scheduleDays:7,status:"active"};

    // Weight logs: 188 → 174 over 90 days
    base.weightLogs = Array.from({length:18},(_, i)=>mkWeight(90-i*5, 188-i*0.78));

    // Measurements: waist shrinking
    base.measurementLogs = Array.from({length:6},(_,i)=>mkMeasure(90-i*15, 36.5-i*0.4));

    // Symptom logs — realistic GLP-1 pattern
    const symptomPatterns = [
      [88,4,["Nausea","Food noise quiet"]],[86,4,["Reduced appetite","Nausea"]],[85,3,["Constipation","Food noise quiet"]],
      [81,4,["Food noise quiet","Good energy"]],[80,3,["Constipation"]],[79,4,["Food noise quiet"]],
      [77,3,["Appetite return","Food noise return"]],[76,3,["Cravings"]],
      [74,4,["Nausea","Food noise quiet"]],[72,4,["Food noise quiet","Good mood"]],[71,3,["Constipation"]],
      [70,3,["Appetite return","Cravings","Food noise return"]],
      [67,5,["Food noise quiet","Good energy","Good mood"]],[65,4,["Food noise quiet"]],[64,4,["Reduced appetite"]],
      [63,3,["Appetite return","Food noise return"]],
      [60,4,["Food noise quiet","Good energy"]],[58,4,["Reduced appetite"]],[57,3,[]],
      [56,3,["Appetite return","Cravings"]],
      [53,4,["Food noise quiet","Good energy","Good mood"]],[52,4,["Reduced appetite"]],[51,5,["Food noise quiet"]],
      [50,3,["Appetite return","Food noise return"]],
      [47,5,["Good energy","Food noise quiet","Good mood"]],[46,4,["Reduced appetite"]],[45,4,[]],
      [44,3,["Appetite return"]],
      [41,4,["Food noise quiet","Good energy"]],[40,4,["Reduced appetite"]],[39,5,["Food noise quiet","Mental clarity"]],
      [38,3,["Food noise return","Cravings"]],
      [34,5,["Food noise quiet","Good energy","Good mood"]],[33,4,["Reduced appetite"]],[32,4,[]],
      [31,3,["Appetite return","Food noise return"]],
      [27,5,["Food noise quiet","Good energy","Good mood"]],[26,4,["Reduced appetite"]],[25,4,["Food noise quiet"]],
      [24,3,["Appetite return"]],
      [20,5,["Food noise quiet","Good mood"]],[19,5,["Reduced appetite"]],[18,5,["Food noise quiet","Good energy"]],
      [17,3,["Food noise return"]],
      [13,5,["Food noise quiet","Good energy","Good mood"]],[12,4,["Reduced appetite"]],[11,5,[]],
      [10,3,["Appetite return","Cravings"]],
      [6,5,["Food noise quiet","Good energy"]],[5,4,["Reduced appetite"]],[4,5,["Food noise quiet","Mental clarity"]],
      [3,4,["Appetite return","Food noise return"]],[2,5,["Food noise quiet","Good energy","Good mood"]],[1,5,["Reduced appetite"]],
    ];
    base.dailyLogs = symptomPatterns.map(([d,m,s])=>mkLog(d,m,s,null,"",
      // symptomTags: link symptoms to compounds
      Object.fromEntries(s.map(sym=>[sym,
        /food noise|appetite|cravings|nausea|constipat|satiety|bloat/i.test(sym)?["Retatrutide"]:
        /skin|glow|redness|injection site/i.test(sym)?["GHK-Cu"]:["Not sure"]
      ])),
      // compound-specific notes on some days
      d%7===0?{"Retatrutide":"Dose day — took at 8am. Mild nausea for 1h after."}:{}
    ));
    // Activity logs — 45 days of aggregate CSV data
    base.activityLogs = Array.from({length:45},(_,i)=>mkActivity(
      44-i,
      Math.round(randBetween(5000,14000)),     // steps
      Math.round(randBetween(250,600)),         // activeCalories
      Math.round(randBetween(52,68)),           // restingHR
      Math.round(randBetween(28,62)),           // HRV ms
      Math.round(randBetween(1600,1900))        // basalCalories
    ));
    // Workout sessions — 12 cycling sessions
    const workouts=[...base.activityLogs];
    base.activityLogs.push(...Array.from({length:12},(_,i)=>mkWorkout(i*3+1,"Cycling",45,380,142,171,18,7)));

    // Macros: improving protein over time
    base.macroLogs = Array.from({length:30},(_,i)=>mkMacro(30-i, Math.round(randBetween(1400,1800)), Math.round(randBetween(100+i*1.5,130+i*1.5)), Math.round(randBetween(100,160)), Math.round(randBetween(45,75))));

    // Supplement logs
    base.supplementLogs = Array.from({length:25},(_,i)=>mkSupp(25-i,["Magnesium Citrate","Psyllium Husk"].concat(i%3===0?["Betaine HCl"]:[])));

    // Stash
    base.supplies = [
      {id:uid2(),name:"Retatrutide",vialMg:30,bacMl:3,totalVials:10,openedVials:3,emptyVials:0,scheduleDays:7,expiryDays:30,reconDate:daysAgo(10),activeKit:true,storageLocation:"fridge",cost:"277",currency:"CAD"},
      {id:uid2(),name:"GHK-Cu",vialMg:5,bacMl:2,totalVials:5,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:daysAgo(7),activeKit:true,storageLocation:"fridge",cost:"85",currency:"CAD"},
    ];
    base.equipmentItems = [
      {id:uid2(),type:"BAC Water",brand:"Bacteriostatic Water USP",unitLabel:"bottle",unitSize:30,unitOfMeasure:"mL",storageLocation:"fridge",notes:"",
        units:[{id:uid2(),status:"active",openedDate:daysAgo(10),emptiedDate:null,consumed:12}],
        usageLog:[{id:uid2(),date:daysAgo(10),amount:4},{id:uid2(),date:daysAgo(6),amount:4},{id:uid2(),date:daysAgo(2),amount:4}]},
    ];

    // Plans + Protocols
    base.plans={goals:[{id:uid2(),name:"Lose 25 lbs",category:"Weight Loss",status:"active",compounds:["Retatrutide"],metrics:"Weekly weight, waist, food noise",targetDate:daysAgo(-60)}],research:[{id:uid2(),compound:"Cagrilintide",status:"considering",reason:"Dual GLP-1/amylin may enhance weight loss",goal:"Lose 25 lbs"},{id:uid2(),compound:"GHK-Cu",status:"researching",reason:"Skin quality alongside Retatrutide"}],shopping:[{id:uid2(),item:"BAC water 30mL",category:"supply",status:"needed",qty:"3"},{id:uid2(),item:"Insulin syringes 31G",category:"equipment",status:"ordered",qty:"100"},{id:uid2(),item:"Cagrilintide 10mg",category:"compound",status:"needed"}]};
    base.protocols=[
      {id:uid2(),name:"Weight Loss — Retatrutide",goal:"Lose 25 lbs",status:"active",startDate:daysAgo(90),notes:"Weekly SubQ, titrating up.",schedule:{type:"Weekly",days:[6],dosesPerDay:1,times:["08:00"]},compounds:[{name:"Retatrutide",route:"SubQ",unit:"mg",multiPhase:true,phases:[{type:"dose",durationWeeks:4,dose:"0.5"},{type:"dose",durationWeeks:4,dose:"1"},{type:"dose",durationWeeks:4,dose:"1.5"},{type:"dose",durationWeeks:16,dose:"2"}]}]},
      {id:uid2(),name:"GHK-Cu Skin Add-on",goal:"Skin quality support",status:"active",startDate:daysAgo(14),notes:"Daily SubQ, evening injection.",schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["20:00"]},compounds:[{name:"GHK-Cu",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"1"}]}]}
    ];
    // GHK-Cu daily doses — using mkDoseDaily for proper timestamps
    base.peptides["GHK-Cu"]={doses:Array.from({length:14},(_,i)=>mkDoseDaily("GHK-Cu",13-i,1,"Abdomen",20)),scheduleDays:1,status:"active"};

  } else if(scenario==="recovery") {
    base.peptides["BPC-157"]={doses:Array.from({length:28},(_,i)=>mkDoseDaily("BPC-157",27-i,500,"Abdomen — near ankle",8)),scheduleDays:1,status:"active"};
    base.peptides["TB-500"]={doses:Array.from({length:4},(_,i)=>mkDose("TB-500",21-i*7,2,"Thigh")),scheduleDays:7,status:"active"};
    base.peptides["GHK-Cu"]={doses:Array.from({length:20},(_,i)=>mkDoseDaily("GHK-Cu",19-i,1,"Abdomen",20)),scheduleDays:1,status:"active"};
    base.peptides["BPC-157"].doses[5].notes="Slight redness at injection site, gone by next morning.";
    base.peptides["GHK-Cu"].doses[12].notes="Noticed some mild darkening of the skin around the injection site — keeping an eye on it.";
    base.dailyLogs=Array.from({length:28},(_,i)=>{
      const d=28-i;
      const s=d>20?["Pain","Swelling","Fatigue"]:d>10?["Reduced pain","Fatigue"]:["Reduced pain","Improved mobility","Good energy"];
      const tags=Object.fromEntries(s.map(sym=>[sym,
        /pain|mobil|swell/i.test(sym)?["BPC-157","TB-500"]:
        /fatigue|energy/i.test(sym)?["Not sure"]:["BPC-157"]
      ]));
      const compoundNotes = d===9 ? {"GHK-Cu":"Site looks a little discolored today — same spot as last week. Will rotate more."} : {};
      return mkLog(27-i,Math.min(5,2+Math.floor(d/7)),s,null,"",tags,compoundNotes);
    });
    base.weightLogs=Array.from({length:14},(_,i)=>mkWeight(28-i*2,175+randBetween(-0.5,0.5)));
    base.supplementLogs=Array.from({length:20},(_,i)=>mkSupp(19-i,["Vitamin C","L-Carnitine"]));
    base.activityLogs=Array.from({length:28},(_,i)=>mkActivity(27-i,Math.round(randBetween(3000,8000)),Math.round(randBetween(150,350)),Math.round(randBetween(58,72)),Math.round(randBetween(22,48)),Math.round(randBetween(1500,1800))));
    base.plans={goals:[{id:uid2(),name:"Heal left ankle",category:"Recovery / Injury",status:"active",compounds:["BPC-157","TB-500","GHK-Cu"],metrics:"Pain (1-10), swelling, range of motion"}],research:[{id:uid2(),compound:"PEG-MGF",status:"researching",reason:"Accelerate tendon repair after BPC-157/TB-500",goal:"Heal left ankle"}],shopping:[{id:uid2(),item:"BPC-157 5mg",category:"compound",status:"ordered"},{id:uid2(),item:"TB-500 10mg",category:"compound",status:"received"}]};
    base.protocols=[{id:uid2(),name:"Ankle Recovery Stack",goal:"Heal left ankle",status:"active",startDate:daysAgo(28),schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]},compounds:[{name:"BPC-157",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.5"}]},{name:"TB-500",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"2"}]},{name:"GHK-Cu",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"1"}]}]}];
    base.supplies=[
      {id:uid2(),name:"BPC-157",vialMg:5,bacMl:2,totalVials:4,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:daysAgo(5),activeKit:true,storageLocation:"fridge",cost:"120",currency:"CAD"},
      {id:uid2(),name:"TB-500",vialMg:10,bacMl:2,totalVials:2,openedVials:1,emptyVials:0,scheduleDays:7,expiryDays:30,reconDate:daysAgo(18),activeKit:true,storageLocation:"fridge",cost:"95",currency:"CAD"},
      {id:uid2(),name:"GHK-Cu",vialMg:5,bacMl:2,totalVials:3,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:daysAgo(8),activeKit:true,storageLocation:"fridge",cost:"70",currency:"CAD"},
    ];
    base.equipmentItems = [
      {id:uid2(),type:"BAC Water",brand:"Hospira Bacteriostatic",unitLabel:"bottle",unitSize:30,unitOfMeasure:"mL",storageLocation:"fridge",notes:"",
        units:[{id:uid2(),status:"active",openedDate:daysAgo(24),emptiedDate:null,consumed:24},{id:uid2(),status:"sealed",openedDate:null,emptiedDate:null,consumed:0}],
        usageLog:[{id:uid2(),date:daysAgo(24),amount:8},{id:uid2(),date:daysAgo(16),amount:8},{id:uid2(),date:daysAgo(8),amount:8}]},
    ];

  } else if(scenario==="longevity") {
    base.peptides["Epithalon"]={doses:Array.from({length:10},(_,i)=>mkDoseDaily("Epithalon",9-i,5,"Abdomen",7)),scheduleDays:1,status:"active"};
    base.peptides["Epithalon"].doses[3].notes="Clearer head by mid-morning than usual.";
    base.peptides["MOTS-c"]={doses:Array.from({length:6},(_,i)=>mkDoseDaily("MOTS-c",11-i*2,5,"Abdomen",7)),scheduleDays:2,status:"active"};
    base.peptides["Glutathione"]={doses:Array.from({length:10},(_,i)=>mkDoseDaily("Glutathione",9-i,600,"Abdomen",8)),scheduleDays:1,status:"active"};
    base.peptides["Selank"]={doses:Array.from({length:14},(_,i)=>mkDoseDaily("Selank",13-i,300,"Intranasal",21)),scheduleDays:1,status:"active"};
    base.dailyLogs=Array.from({length:14},(_,i)=>{
      const s=["Good energy","Mental clarity","Improved sleep","Good mood","Reduced anxiety"];
      const tags={"Good energy":["MOTS-c","Epithalon"],"Mental clarity":["Selank"],"Improved sleep":["Epithalon"],"Good mood":["Selank"],"Reduced anxiety":["Selank"]};
      return mkLog(13-i,4+Math.floor(i/7),s,null,"",tags,i%7===0?{"Epithalon":"AM injection, felt energized by afternoon."}:{});
    });
    base.weightLogs=Array.from({length:10},(_,i)=>mkWeight(20-i*2,162+randBetween(-0.5,0.5)));
    base.activityLogs=[
      ...Array.from({length:14},(_,i)=>mkActivity(13-i,Math.round(randBetween(7000,14000)),Math.round(randBetween(400,700)),Math.round(randBetween(48,58)),Math.round(randBetween(45,78)),Math.round(randBetween(1700,2000)))),
      ...Array.from({length:6},(_,i)=>mkWorkout(i*2+1,i%2===0?"Running":"Strength Training",i%2===0?35:50,i%2===0?320:280,i%2===0?151:138,i%2===0?178:162,i%2===0?5.2:null,7)),
    ];
    base.plans={goals:[{id:uid2(),name:"Longevity optimization",category:"Longevity",status:"active",compounds:["Epithalon","MOTS-c","Glutathione","Selank"],metrics:"Energy, sleep, cognitive sharpness, biological age markers"}],research:[{id:uid2(),compound:"SS-31",status:"researching",reason:"Mitochondrial support to complement MOTS-c",goal:"Longevity optimization"},{id:uid2(),compound:"Dihexa",status:"considering",reason:"Cognitive enhancement alongside Selank"}],shopping:[{id:uid2(),item:"Epithalon 50mg",category:"compound",status:"needed"},{id:uid2(),item:"NAD+ 500mg",category:"compound",status:"ordered"}]};
    base.protocols=[{id:uid2(),name:"Longevity Foundation",goal:"Longevity optimization",status:"active",startDate:daysAgo(14),schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["07:00"]},compounds:[{name:"Epithalon",route:"SubQ",unit:"mg",multiPhase:true,phases:[{type:"dose",durationWeeks:2,dose:"5"},{type:"rest",durationWeeks:12,dose:""}]},{name:"MOTS-c",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"5"}]},{name:"Glutathione",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"600"}]},{name:"Selank",route:"Nasal",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.3"}]}]}];
    base.supplies=[
      {id:uid2(),name:"Epithalon",vialMg:10,bacMl:2,totalVials:5,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:daysAgo(5),activeKit:true,storageLocation:"fridge",cost:"95",currency:"CAD"},
      {id:uid2(),name:"MOTS-c",vialMg:10,bacMl:1,totalVials:3,openedVials:1,emptyVials:0,scheduleDays:2,expiryDays:30,reconDate:daysAgo(8),activeKit:true,storageLocation:"fridge",cost:"180",currency:"CAD"},
      {id:uid2(),name:"Glutathione",vialMg:600,bacMl:3,totalVials:10,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:daysAgo(3),activeKit:true,storageLocation:"fridge",cost:"65",currency:"CAD"},
      {id:uid2(),name:"MOTS-c",vialMg:10,bacMl:1,totalVials:2,openedVials:0,emptyVials:0,scheduleDays:2,expiryDays:30,reconDate:null,activeKit:false,storageLocation:"freezer",cost:"180",currency:"CAD"},
    ];
    base.supplementLogs=Array.from({length:14},(_,i)=>mkSupp(13-i,["Magnesium Glycinate","Vitamin C","Taurine"].concat(i%2===0?["L-Carnitine"]:[])));

  } else if(scenario==="multivial") {
    base.peptides["Placenta"]={doses:Array.from({length:4},(_,i)=>mkDoseDaily("Placenta",6-i*1.5|0,60,"Thigh",9)),scheduleDays:1,status:"active"};
    base.peptides["GHK-Cu"]={doses:Array.from({length:10},(_,i)=>mkDoseDaily("GHK-Cu",9-i,2,"Abdomen",8)),scheduleDays:1,status:"active"};
    base.dailyLogs=Array.from({length:10},(_,i)=>mkLog(9-i,3+Math.floor(i/5),i%4===0?["Stable energy"]:[],null,"",{},{}));
    base.weightLogs=Array.from({length:6},(_,i)=>mkWeight(9-i*2,180+randBetween(-0.5,0.5)));
    // Placenta kit intentionally has TWO reconstitutions on record (reconHistory) — a
    // finished Vial 1 with real prior usage and an active Vial 2 — so this scenario
    // exercises the legacy-vial migration/backfill path, not just a freshly-created kit.
    const placentaKitId = uid2(), bpcKitId = uid2(), bpcBackupKitId = uid2(), ghkKitId = uid2();
    // BPC-157's active vial is deliberately drawn down close to empty by REAL, kit-tagged
    // dose history (not a standalone legacyUsedMg value) — so kit-level and vial-level
    // totals agree with each other the same way they would from genuine usage, and
    // Log Dose naturally shows the "not enough in current vial" split-vial panel against
    // the sealed backup below.
    base.peptides["BPC-157"]={doses:Array.from({length:9},(_,i)=>({...mkDoseDaily("BPC-157",9-i,500,"Abdomen",8),kitId:bpcKitId})),scheduleDays:1,status:"active"};
    base.protocols=[{id:uid2(),name:"Recovery + Support Stack",goal:"General recovery",status:"active",startDate:daysAgo(10),schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["09:00"]},compounds:[{name:"Placenta",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"60"}]},{name:"BPC-157",route:"SubQ",unit:"mcg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"500"}]},{name:"GHK-Cu",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"2"}]}]}];
    base.supplies=[
      {id:placentaKitId,name:"Placenta",vialMg:600,bacMl:5,totalVials:5,openedVials:2,emptyVials:1,scheduleDays:1,expiryDays:30,reconDate:daysAgo(1),activeKit:true,storageLocation:"fridge",cost:"166",currency:"CAD",
        reconHistory:[{id:uid2(),date:daysAgo(6),notes:"Deer"},{id:uid2(),date:daysAgo(1),notes:"Deer"}]},
      {id:bpcKitId,name:"BPC-157",vialMg:5,bacMl:5,totalVials:1,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:daysAgo(9),activeKit:true,storageLocation:"fridge",cost:"137",currency:"CAD"},
      {id:bpcBackupKitId,name:"BPC-157",vialMg:5,bacMl:5,totalVials:1,openedVials:0,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:null,activeKit:false,storageLocation:"freezer",cost:"137",currency:"CAD"},
      {id:ghkKitId,name:"GHK-Cu",vialMg:50,bacMl:3,totalVials:4,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:30,reconDate:daysAgo(9),activeKit:true,storageLocation:"fridge",cost:"82",currency:"CAD"},
    ];
    // A prepared MIXED syringe (BPC-157 + GHK-Cu) sitting ready to administer —
    // showcases the multi-compound prepared-syringe feature directly in the demo. Draws
    // the last ~200mcg out of BPC-157's active vial (4.5mg already used by real doses
    // above, vial holds 5mg), leaving it correctly near-empty.
    base.preparedDoses=[{
      id:uid2(), status:"prepared", count:1, remainingCount:1, createdAt:new Date(now.getTime()-90*60000).toISOString(),
      components:[
        {compoundName:"BPC-157", amount:500, unit:"mcg", allocations:[{kitId:bpcKitId, amount:500}]},
        {compoundName:"GHK-Cu", amount:2, unit:"mg", allocations:[{kitId:ghkKitId, amount:2}]},
      ],
    }];

  } else if(scenario==="newstart") {
    base.profile = {...base.profile, startDate:daysAgo(1), startWeight:"188", goalWeight:"165"};
    base.peptides["Retatrutide"]={doses:[mkDose("Retatrutide",0,0.5,"Abdomen")],scheduleDays:7,status:"active"};
    base.dailyLogs=[mkLog(0,3,[],null,"First dose today — feeling good so far, a little nervous.",{},{})];
    base.weightLogs=[mkWeight(0,188)];
    base.protocols=[{id:uid2(),name:"Getting Started",goal:"Weight management",status:"active",startDate:daysAgo(0),schedule:{type:"Weekly",days:[new Date().getDay()],dosesPerDay:1,times:["09:00"]},compounds:[{name:"Retatrutide",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:4,dose:"0.5"}]}]}];
    base.supplies=[{id:uid2(),name:"Retatrutide",vialMg:30,bacMl:2,totalVials:1,openedVials:1,emptyVials:0,scheduleDays:7,expiryDays:30,reconDate:daysAgo(0),activeKit:true,storageLocation:"fridge",cost:"277",currency:"CAD"}];
  } else if(scenario==="phase_transitions") {
    // Built specifically to showcase the phase-transition reminder system and the
    // tappable phase roadmap — three compounds positioned at exactly the three reminder
    // states (3 days out / tomorrow / today), plus a paused protocol to show the
    // frozen-timeline behavior and Resume.
    base.peptides["MOTS-c"]={doses:Array.from({length:6},(_,i)=>mkDoseDaily("MOTS-c",25-i*4,3,"Abdomen",8)),scheduleDays:4,status:"active"};
    base.peptides["BPC-157"]={doses:Array.from({length:10},(_,i)=>mkDoseDaily("BPC-157",27-i,0.5,"Abdomen",8)),scheduleDays:1,status:"active"};
    base.peptides["GHK-Cu"]={doses:Array.from({length:5},(_,i)=>mkDoseDaily("GHK-Cu",28-i*7,2,"Abdomen",8)),scheduleDays:7,status:"active"};
    base.peptides["Placenta"]={doses:Array.from({length:8},(_,i)=>mkDoseDaily("Placenta",20-i*2,60,"Thigh",9)),scheduleDays:2,status:"active"};
    base.dailyLogs=Array.from({length:10},(_,i)=>mkLog(9-i,3,[],null,"",{},{}));
    base.weightLogs=Array.from({length:4},(_,i)=>mkWeight(9-i*3,180+randBetween(-0.5,0.5)));
    base.protocols=[
      // MOTS-c: 3mg -> 5mg dose change, 3 days out (Upcoming reminder)
      {id:uid2(),name:"Performance",goal:"Performance",status:"in_progress",startDate:daysAgo(25),
        schedule:{type:"3x/Week",days:[1,3,5],dosesPerDay:1,times:["08:00"]},
        compounds:[{name:"MOTS-c",route:"SubQ",unit:"mg",multiPhase:true,phases:[
          {type:"dose",durationWeeks:4,dose:"3"},{type:"dose",durationWeeks:4,dose:"5"},{type:"rest",durationWeeks:2,dose:""},
        ]}]},
      // BPC-157: active dosing -> rest, tomorrow
      {id:uid2(),name:"Recovery / Injury",goal:"Recovery / Injury",status:"in_progress",startDate:daysAgo(27),
        schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]},
        compounds:[{name:"BPC-157",route:"SubQ",unit:"mg",multiPhase:true,phases:[
          {type:"dose",durationWeeks:4,dose:"0.5"},{type:"rest",durationWeeks:2,dose:""},{type:"dose",durationWeeks:4,dose:"0.5"},
        ]}]},
      // GHK-Cu: rest -> active dosing resumes, TODAY
      {id:uid2(),name:"Good ass skin",goal:"Skin & Hair",status:"in_progress",startDate:daysAgo(28),
        schedule:{type:"Weekly",days:[new Date().getDay()],dosesPerDay:1,times:["08:00"]},
        compounds:[{name:"GHK-Cu",route:"SubQ",unit:"mg",multiPhase:true,phases:[
          {type:"dose",durationWeeks:2,dose:"2"},{type:"rest",durationWeeks:2,dose:""},{type:"dose",durationWeeks:2,dose:"2"},
        ]}]},
      // Placenta: paused mid-phase 10 days ago — demonstrates the frozen timeline + Resume
      {id:uid2(),name:"Wellness",goal:"General wellness",status:"paused",startDate:daysAgo(20),
        pausedAt:daysAgo(10)+"T09:00",pauseDaysAccumulated:0,
        schedule:{type:"Every Other Day",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["09:00"]},
        compounds:[{name:"Placenta",route:"SubQ",unit:"mg",multiPhase:true,phases:[
          {type:"dose",durationWeeks:6,dose:"60"},{type:"rest",durationWeeks:4,dose:""},
        ]}]},
    ];
    base.supplies=[
      {id:uid2(),name:"MOTS-c",vialMg:10,bacMl:2,totalVials:5,openedVials:1,emptyVials:0,scheduleDays:4,expiryDays:60,reconDate:daysAgo(25),activeKit:true,storageLocation:"fridge",cost:"87",currency:"CAD"},
      {id:uid2(),name:"BPC-157",vialMg:5,bacMl:5,totalVials:5,openedVials:1,emptyVials:0,scheduleDays:1,expiryDays:60,reconDate:daysAgo(9),activeKit:true,storageLocation:"fridge",cost:"137",currency:"CAD"},
      {id:uid2(),name:"GHK-Cu",vialMg:50,bacMl:3,totalVials:4,openedVials:1,emptyVials:0,scheduleDays:7,expiryDays:60,reconDate:daysAgo(9),activeKit:true,storageLocation:"fridge",cost:"82",currency:"CAD"},
      {id:uid2(),name:"Placenta",vialMg:600,bacMl:5,totalVials:5,openedVials:1,emptyVials:0,scheduleDays:2,expiryDays:60,reconDate:daysAgo(9),activeKit:true,storageLocation:"fridge",cost:"166",currency:"CAD"},
    ];
  }

  return base;
}

function demoPickerModal() {
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;margin-bottom:14px"><span class="mono" style="font-size:12px;color:#F9C87D;letter-spacing:1px">🧪 DEVELOPER DEMO MODE</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
    <div style="font-size:12px;color:var(--t3);margin-bottom:16px;line-height:1.6">Loads sample data in memory only. Your real data is never affected. A banner will show while demo is active.</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <button class="demo-scenario" data-s="weight_loss" style="padding:12px;border-radius:10px;background:#7DF9C015;border:1px solid #7DF9C033;color:var(--t1);text-align:left"><div style="font-weight:600;margin-bottom:2px">📉 Weight Loss Journey</div><div style="font-size:11px;color:var(--t4)">90 days Retatrutide, titrated 0.5→2mg, full symptom + weight logs</div></button>
      <button class="demo-scenario" data-s="recovery" style="padding:12px;border-radius:10px;background:#8AB4FF15;border:1px solid #8AB4FF33;color:var(--t1);text-align:left"><div style="font-weight:600;margin-bottom:2px">🦴 Injury Recovery</div><div style="font-size:11px;color:var(--t4)">BPC-157 + TB-500 + GHK-Cu, ankle recovery protocol</div></button>
      <button class="demo-scenario" data-s="longevity" style="padding:12px;border-radius:10px;background:#A78BFA15;border:1px solid #A78BFA33;color:var(--t1);text-align:left"><div style="font-weight:600;margin-bottom:2px">🧬 Longevity Stack</div><div style="font-size:11px;color:var(--t4)">Epithalon + MOTS-c + Glutathione + Selank</div></button>
      <button class="demo-scenario" data-s="multivial" style="padding:12px;border-radius:10px;background:#F9C87D15;border:1px solid #F9C87D33;color:var(--t1);text-align:left"><div style="font-weight:600;margin-bottom:2px">🧪 Multi-Vial & Mixed Syringe</div><div style="font-size:11px;color:var(--t4)">Split-vial dosing, vial history, and a prepared mixed syringe ready to administer</div></button>
      <button class="demo-scenario" data-s="newstart" style="padding:12px;border-radius:10px;background:#8AB4FF15;border:1px solid #8AB4FF33;color:var(--t1);text-align:left"><div style="font-weight:600;margin-bottom:2px">🌱 Brand New User</div><div style="font-size:11px;color:var(--t4)">Day 1 — one dose logged, mostly empty states</div></button>
      <button class="demo-scenario" data-s="phase_transitions" style="padding:12px;border-radius:10px;background:#7DF9C015;border:1px solid #7DF9C033;color:var(--t1);text-align:left"><div style="font-weight:600;margin-bottom:2px">📅 Phase Transitions & Reminders</div><div style="font-size:11px;color:var(--t4)">4 protocols positioned at every transition state: 3 days out, tomorrow, today, and paused</div></button>
    </div>
    ${isDemoMode()?`<button id="exit-demo" style="width:100%;padding:10px;border-radius:10px;background:#ff4d4d18;border:1px solid #ff4d4d44;color:#ff4d4d;font-weight:600">Exit Demo Mode — Restore Real Data</button>`:""}
  `,"#F9C87D");
  m.querySelectorAll(".cal-edit-recorded-dose").forEach(button=>button.addEventListener("click",()=>{
    const name=button.dataset.name, id=Number(button.dataset.id);
    const record=(allPeptides()[name]?.doses||[]).find(d=>Number(d.id)===id);
    if(!record) { alert("This log could not be found. Please refresh and try again."); return; }
    closeModal();
    doseModal(name,record);
  }));
  m.querySelector("#x").onclick=closeModal;
  m.querySelectorAll(".demo-scenario").forEach(b=>b.onclick=()=>{closeModal();enterDemoMode(b.dataset.s);});
  const ex=m.querySelector("#exit-demo"); if(ex) ex.onclick=()=>{closeModal();exitDemoMode();};
}

// ─── Config ─────────────────────────────────────────────────────────────────
const PHASES_RETA = [
  { id:"activation", label:"Activation", shortLabel:"Activation", range:[0,0.5], color:"#6B9FD4",
    desc:"Absorbing into circulation. Most feel little yet.",
    happening:"The injection is being absorbed from subcutaneous tissue into your bloodstream. Drug plasma levels are very low — GLP-1, GIP, and glucagon receptors are not yet meaningfully engaged.",
    sideEffects:["Mild injection-site redness or swelling","Brief local itching (common)","Occasionally a small bleb that resolves in minutes"],
    watchFor:["Unusual swelling or hardness at the site after 24h (see Red Flags guide)","Any sign of allergic reaction — rare but worth knowing"] },
  { id:"rising", label:"Taking Effect", shortLabel:"Rising", range:[0.5,3], color:"#7DF9C0",
    desc:"Levels rising toward peak. Receptor pathways engaging.",
    happening:"Plasma concentration is climbing. GLP-1 receptors slow gastric emptying and signal satiety. GIP receptors enhance insulin release and complement appetite suppression. Glucagon receptors begin raising energy expenditure. This is the window where most GI side effects hit — your gut is adapting to slowed motility.",
    sideEffects:["Nausea (most common here, especially early cycles)","Fatigue / energy dip","Sulfur burps","Constipation beginning","Reflux or heartburn","Early satiety — full after small amounts"],
    watchFor:["Eat smaller, blander meals — this is the most important mitigation","Don't skip meals entirely — protein intake still matters for muscle preservation","Hydrate and fibre up; electrolytes help GI symptoms","Log nausea intensity now — it tells you how fast to titrate"] },
  { id:"peak", label:"Peak Effect", shortLabel:"Peak", range:[3,4.5], color:"#C8FF9C",
    desc:"Maximum estimated plasma activity. Strongest appetite suppression.",
    happening:"All three receptor pathways are fully engaged at estimated peak concentration. Appetite suppression and food-noise quieting are at their strongest. The glucagon component also drives measurable energy expenditure — this is the window where metabolic rate is most elevated above baseline.",
    sideEffects:["Nausea may persist but often plateaus","Constipation most likely here","Reflux","Possible mild elevated resting heart rate (glucagon effect)","Extreme early satiety — very easy to undereat"],
    watchFor:["Do not undereat — low intake + strong suppression risks protein deficit and muscle loss","Log your food noise level now — this is your comparison baseline for trough","If heart rate feels elevated, log it and mention to clinician","Good window for a weight and measurement check — levels are stable"] },
  { id:"cruise", label:"Cruise Phase", shortLabel:"Cruise", range:[4.5,5.5], color:"#F9C87D",
    desc:"Above therapeutic threshold. Effects maintained.",
    happening:"Concentration is above the estimated therapeutic threshold but declining from peak. Most people report this as the most comfortable window — appetite is controlled, GI symptoms have usually settled, energy is stable. The drug is doing sustained work here.",
    sideEffects:["GI effects typically improving or resolved","Stable energy for most","Appetite well-controlled but less extreme than peak"],
    watchFor:["Good window for consistent weigh-ins — stable drug levels mean weight swings reflect biology not drug fluctuation","Great time for a longer workout — body feels most regulated here","Log food noise level for trough comparison"] },
  { id:"winding_down", label:"Winding Down", shortLabel:"Winding Down", range:[5.5,6.5], color:"#FFB84D",
    desc:"Levels declining noticeably. Watch for appetite return.",
    happening:"Plasma levels are falling more steeply. Receptor engagement is decreasing. For people with high receptor sensitivity, early trough signals may appear here. The glucagon component wears off first (shortest PD duration), meaning energy expenditure normalisation often precedes appetite return.",
    sideEffects:["Appetite beginning to return","Food noise may increase","Possible mild energy dip as glucagon activity reduces","Cravings may appear"],
    watchFor:["Log appetite return intensity in your daily check-in — this data directly feeds Trough Analysis","If hunger returns strongly this early, document it — may support a shorter interval discussion with your clinician","Prepare next dose supplies now"] },
  { id:"wear_off", label:"Wear Off Window", shortLabel:"Wear Off", range:[6.5,999], color:"#FF7C7C",
    desc:"Approaching trough. Appetite and food noise likely returning.",
    happening:"At or approaching estimated trough concentration. Receptor engagement is minimal. The body's own hunger and satiety regulation reasserts itself. Food noise, appetite, and cravings typically return. This is the window the Trough Analysis tracks when you log return symptoms in your daily check-in.",
    sideEffects:["Appetite return","Food noise return","Cravings","Energy may feel noticeably lower than during peak phases"],
    watchFor:["Log your symptoms right now — this is the highest-value data moment for trough analysis","If trough symptoms are severe (strong cravings, very noisy food thoughts), document intensity and timing","Have next dose ready — consistent timing is important for stable receptor engagement","Discuss interval reduction with clinician if trough return is consistently earlier than Day 6"] },
];
const PHASES_WEEKLY = PHASES_RETA; // reuse for other weekly compounds

const PEPTIDES = {
  Retatrutide: { halfLifeDays:6, defaultSchedule:7, color:"#7DF9C0", troughDay:5.5, unit:"mg",
    phases: PHASES_RETA,
    returnSymptoms:["Appetite return","Food noise return","Cravings","Energy dip","Fatigue"],
    guide:[
      ["Shot day","Many feel little right away; some notice appetite quiet within hours. Inject at a consistent time of day."],
      ["Day 1–2","Peak drug levels for most. Strongest appetite suppression and quietest food noise. Nausea/fatigue most likely here — smaller, blander meals + hydration help."],
      ["Day 2–3","GI effects (nausea, sulfur burps, constipation) often peak. Fibre, water, and electrolytes are your friends."],
      ["Day 3–4","Your noted trough window. With high receptor sensitivity, appetite and food noise may start returning here — worth logging intensity daily."],
      ["Day 4–6","Effects taper as levels fall toward trough. Hunger usually returns more noticeably."],
      ["Day 6–7","Lowest point before the next dose. If trough return is strong, a 5–6 day interval is something to raise with your clinician."],
    ]},
  "GHK-Cu": { halfLifeDays:0.5, defaultSchedule:1, color:"#F9C87D", troughDay:null, unit:"mg",
    returnSymptoms:[],
    guide:[
      ["Daily rhythm","Usually dosed daily (or 5 on / 2 off). Systemic side effects are uncommon — benefits to skin, hair, and recovery show up cumulatively over weeks."],
      ["At the site","Rotate SubQ sites; mild transient redness can happen. Effects build slowly rather than acutely."],
    ]},
  Placenta: { halfLifeDays:null, defaultSchedule:1, color:"#D4AF6A", troughDay:null, unit:"mg",
    returnSymptoms:[],
    guide:[
      ["Weeks 1–2 (loading)","120mg daily, split 60mg morning + 60mg night. This is the schedule to start on — switch it to weekly via Schedule Settings once week 2 ends. Adjustment phase: increased energy, improved mood, and better sleep are commonly reported first."],
      ["Weeks 3–5 (maintenance begins)","Switch to 120mg once weekly (1 injection/week) here. Early improvement phase: more consistent energy, enhanced focus, and overall sense of well-being."],
      ["Weeks 6–9","Continue weekly. Often described as the 'optimal benefits' window — hormonal balance, improved recovery, skin changes, and sustained vitality."],
      ["Weeks 10–13","Long-term support phase — continued benefits and stabilization. 13 weeks total (2 weeks daily + 11 weeks weekly) is a full protocol length; a 600mg vial lasts roughly 5 weeks at the 120mg/week maintenance dose."],
    ]},
  // Neither of these had a PEPTIDES entry at all before — they were silently falling back
  // to FALLBACK_CFG's unit:"mg", which doesn't match how GH secretagogues are actually
  // dosed or discussed (virtually always mcg, typically 100-300mcg). That's what made
  // "0.3" in a field labeled "(mg)" look right by coincidence — 0.3mg does equal 300mcg —
  // but left real risk of someone eventually typing the bare mcg number (e.g. "300")
  // straight into a field that would then read it as 300mg, a 1000x error. Colors match
  // their existing LIBRARY entries for visual consistency.
  "Ipamorelin": { halfLifeDays:0.08, defaultSchedule:1, color:"#9CDC5C", troughDay:null, unit:"mcg" },
  "CJC-1295 no DAC": { halfLifeDays:0.02, defaultSchedule:1, color:"#7DF9C0", troughDay:null, unit:"mcg" },
  // Same gap, found while checking the rest of the GH-secretagogue family: none of these
  // four had a PEPTIDES entry either, so all were silently defaulting to mg despite every
  // one of them being documented (see their own LIBRARY meta.dose) in the 100-300mcg
  // range. Tesamorelin is deliberately NOT here — its real dose is 1-2mg, so mg was
  // already the correct fallback for it; no gap to fix there.
  "Sermorelin": { halfLifeDays:0.01, defaultSchedule:1, color:"#7DF9C0", troughDay:null, unit:"mcg" },
  "GHRP-2": { halfLifeDays:0.015, defaultSchedule:1, color:"#9DC8FF", troughDay:null, unit:"mcg" },
  "GHRP-6": { halfLifeDays:0.015, defaultSchedule:1, color:"#9DC8FF", troughDay:null, unit:"mcg" },
  "Hexarelin": { halfLifeDays:0.015, defaultSchedule:1, color:"#9DC8FF", troughDay:null, unit:"mcg" },
  "BPC-157": { halfLifeDays:0.1, defaultSchedule:1, color:"#FF9CC8", troughDay:null, unit:"mcg",
    returnSymptoms:["Joint pain","Muscle soreness","Pain return","Reduced flexibility"],
    guide:[
      ["Days 1–3","No dramatic acute effect — BPC works cumulatively, not like a stimulant. Some report mild reduction in soreness within the first few days, but that's early."],
      ["Wk 1–2","First healing signals in the community: reduced pain, less stiffness, quicker morning mobility. Log ROM and pain on movement daily so you have data, not impressions."],
      ["Wk 2–4","Most users report the clearest response here. If running it for a specific injury, objective markers (pain on a scale, strength, flexibility) matter more than general 'feel'."],
      ["Wk 4–6","Typical block length. Pause and assess: has the target issue measurably improved? If yes, rest the cycle. If not, document and discuss with clinician before continuing."],
      ["Site injection","Many protocols inject SubQ near the injured site rather than a standard rotation site. Discuss this approach with your clinician — do not inject directly into a joint."],
    ]},
  "MOTS-c": { halfLifeDays:0.5, defaultSchedule:3, color:"#7DD4F9", troughDay:2, unit:"mg",
    returnSymptoms:["Energy dip","Fatigue","Reduced performance","Appetite increase"],
    guide:[
      ["Shot day + 1–2","Minimal acute effect is normal — MOTS-c is a metabolic signal, not a stimulant. Some notice better energy or exercise tolerance within days; most see nothing this early."],
      ["Wk 1–2","Treat as a tolerance check. If you're seeing insomnia, irritability, or elevated heart rate, hold and consult. Log energy, workout output, and fasted mood each morning so you have actual numbers."],
      ["Wk 3–4","Subtle improvements in exercise recovery and metabolic flexibility reported anecdotally. Best tracked against objective markers: performance logs, energy rating, recovery speed."],
      ["Wk 5–8 (end of cycle)","Pause and review: is there a measurable signal? The honest answer for many is 'not sure' — human evidence is thin. Pause before committing to another cycle."],
      ["Timing","Some protocols time injections pre-workout or in the morning, 2+ hours fasted. No validated human schedule exists. Consistency of timing matters more than precision."],
    ]},
  "Glutathione": { halfLifeDays:0.04, defaultSchedule:2, color:"#C8FF9C", troughDay:null, unit:"mg",
    returnSymptoms:[],
    guide:[
      ["First injections","No dramatic acute feel expected. Some report subtle clarity — treat that as placebo until you have weeks of consistent log data. Real antioxidant effects are biochemical, not acutely felt."],
      ["Light sensitivity","Glutathione degrades rapidly in light — this is one of the most light-sensitive compounds you'll handle. Keep vials covered after reconstitution, minimize time outside the fridge."],
      ["Wk 2–4","Skin brightening/evenness effects, if they appear, develop over weeks to months. Photographs at consistent lighting every few weeks are more honest than mirror impressions."],
      ["Ongoing","Antioxidant support is a long-horizon rationale. If you're running it for a clinical reason, lab markers (oxidative stress panels, liver enzymes) give better signal than subjective feel."],
      ["IV vs SubQ","IV delivers more bioavailably but requires clinical supervision and carries IV-specific risks. SubQ is a practical lower-risk route — just know bioavailability is lower and less characterized."],
    ]},
  "Selank": { halfLifeDays:0.05, defaultSchedule:1, color:"#7DD4F9", troughDay:null, unit:"mcg",
    returnSymptoms:["Anxiety","Brain fog","Low mood","Restlessness"],
    guide:[
      ["Day of dose","Subtle calming effect within 30–60 minutes for most. Not sedating — more a reduction in background anxiety noise. If you feel nothing, that's also common; give it consistent days before judging."],
      ["Days 2–7","Cumulative anxiolytic and mild focus-supporting effects build with daily use. Rate anxiety and mental clarity (1–10) in your daily check-ins so you have a trend, not just impressions."],
      ["Wk 2–4","Standard block length. Hold consistent timing (e.g. morning) so your logs are comparable day to day."],
      ["Intranasal technique","If dosing intranasally: 2–3 drops per nostril, head slightly back, don't blow nose for 5–10 minutes after. SubQ is also used for more predictable absorption — same dose applies."],
      ["Coming off","No consistent rebound anxiety pattern reported — it is not a benzodiazepine. Still, taper frequency (daily → every other day) before stopping if you've run more than 3 weeks."],
    ]},
  "Semax": { halfLifeDays:0.05, defaultSchedule:1, color:"#9CDC5C", troughDay:null, unit:"mcg",
    returnSymptoms:["Brain fog","Low motivation","Low mood","Fatigue"],
    guide:[
      ["Day of dose","Focus and alertness often noticed within 30–60 minutes — more a cognitive sharpening than stimulation. Most find it compatible with focused work; less so before sleep."],
      ["Days 2–7","Cognitive and mood benefits build with consistent daily dosing. Log focus, mood, and productivity — those numbers are your signal, not a general 'felt sharp today' impression."],
      ["Wk 2–4","Standard block length. Some run 5 days on / 2 off to limit receptor tolerance."],
      ["Stacking with Selank","A common combination: Semax in the morning for focus/drive, Selank in the afternoon for anxiety-reduction. Introduce one first and give it a week before adding the second — you need to know what's doing what."],
      ["Intranasal technique","Same technique as Selank: 2–3 drops per nostril, hold slightly back, no nose-blowing right after. Morning or before cognitively demanding work builds the most readable log pattern."],
    ]},
  "DSIP": { halfLifeDays:0.1, defaultSchedule:1, color:"#9CC8FF", troughDay:null, unit:"mcg",
    returnSymptoms:["Insomnia","Poor sleep quality","Fatigue","Restless sleep"],
    guide:[
      ["Evening dose","Typically taken 30–60 minutes before bed. Effect is subtle and variable — for some it noticeably deepens sleep; for others it's imperceptible. Track sleep quality (1–10) in daily logs to find your signal."],
      ["Days 2–5","Response varies more than most peptides — some need several days, others respond immediately. Don't adjust dose based on one night. Three nights of data is a minimum."],
      ["Consistency is everything","Same time each evening, same pre-sleep conditions. Variable timing makes your log data uninterpretable. DSIP is harder to read than most compounds."],
      ["Sleep stack note","Often paired with Selank taken earlier in the evening. If combining: introduce one first, give it a week alone, then add the second — so you know which is producing what."],
      ["Tolerance","Some report diminishing response over a few weeks. Short blocks (1–2 weeks on, 1 week off) are a common community approach to preserve sensitivity."],
    ]},
};
const DEFAULT_GUIDE = [["General","Track your own day-by-day pattern as you log. Rotate sites, stay hydrated, flag anything unexpected to your clinician."]];
const FALLBACK_CFG = { halfLifeDays:1, defaultSchedule:7, color:"#A78BFA", troughDay:null, unit:"mg", returnSymptoms:[], guide:DEFAULT_GUIDE };

const RED_FLAG_SYMPTOMS = new Set(["Hives","Wheezing","Facial swelling","Throat tightness","Dizziness / faintness","Fever with site reaction","Pus or drainage","Red streaking","Spreading redness"]);
// Benefit/burden classification for candidate bucketing (Insights question-based sections).
// Scoped to the actual symptom vocabulary in COMPOUND_SYMPTOMS/SYMPTOM_GROUPS rather than
// attempting a universal classifier — small enough to hand-verify, honest 'neutral' default
// for anything not explicitly known rather than guessing.
const SYMPTOM_POLARITY = {
  benefit: new Set(["Food noise quiet","Extreme satiety","Reduced appetite","Full faster","Good energy","Improved sleep","Good mood","Mental clarity","Increased focus","Improved focus","Reduced anxiety","Improved mood","Skin smoothness","Improved skin tone","Wound healing","Hair growth","Hair thickness","Nail growth","Reduced redness","Joint comfort","Reduced joint pain","Tendon relief","Gut comfort","Reduced inflammation","Improved mobility","Sleep quality improved","Improved energy","Improved endurance","Better glucose tolerance","Skin brightening","Reduced fatigue","Improved recovery","PMS improved","Lighter period","Reduced cramps","Skin glow","Hormone balance"]),
  burden: new Set(["Nausea","Vomiting","Constipation","Diarrhea","Bloating","Heartburn / reflux","Stomach pain","Sulfur burps","Dry mouth","Gas","Metallic taste","Food noise return","Appetite return","Cravings","Fatigue","Energy dip","Insomnia","Poor sleep quality","Restless sleep","Drowsiness","Difficulty falling asleep","Difficulty staying asleep","Unrefreshing sleep","Irritability","Anxiety","Anxiety return","Low mood","Brain fog","Low motivation","Restlessness","Reduced motivation","Headache","Dizziness","Muscle soreness","Joint pain","Pain return","Reduced flexibility","Reduced performance","Elevated heart rate","Injection site reaction","Water retention","Muscle cramps","Hair shedding","PMS worsened","Heavier period","Increased cramps","Acne","Palpitations","Flushing","Hypersensitivity reaction","Redness","Swelling","Soreness","Stinging","Burning","Itching","Bruising","Raised welt","Hard lump","Tenderness","Bleeding","Injection site irritation"]),
};
function classifySymptomPolarity(name) {
  if (RED_FLAG_SYMPTOMS.has(name)) return "burden";
  if (SYMPTOM_POLARITY.benefit.has(name)) return "benefit";
  if (SYMPTOM_POLARITY.burden.has(name)) return "burden";
  return "neutral"; // honest default — never guess polarity for an unrecognized symptom
}
const SYMPTOM_GROUPS = {
  "Digestive": ["Nausea","Vomiting","Constipation","Diarrhea","Bloating","Heartburn / reflux","Stomach pain","Sulfur burps","Early satiety","Dry mouth","Gas","Increased thirst","Metallic taste"],
  "Appetite & Food": ["Reduced appetite","Appetite return","Food noise quiet","Food noise return","Cravings","Full faster"],
  "Energy & Sleep": ["Good energy","Fatigue","Energy dip","Insomnia","Poor sleep quality","Restless sleep","Vivid dreams","Drowsiness","Improved sleep","Difficulty falling asleep","Difficulty staying asleep","Unrefreshing sleep"],
  "Mood & Mind": ["Good mood","Irritability","Anxiety","Anxiety return","Low mood","Brain fog","Mental clarity","Low motivation","Restlessness","Increased focus","Reduced anxiety","Improved mood","Reduced motivation"],
  "Physical": ["Headache","Dizziness","Muscle soreness","Joint pain","Pain return","Reduced flexibility","Reduced performance","Elevated heart rate","Injection site reaction","Water retention","Feeling cold","Increased sweating","Muscle cramps","Hair shedding","Skin glow"],
  "Cycle / Hormonal": ["PMS improved","PMS worsened","Heavier period","Lighter period","Increased cramps","Reduced cramps","Period delayed","Period early"],
  "Injection Site / Reaction": ["Redness","Swelling","Soreness","Stinging","Burning","Itching","Bruising","Raised welt","Hard lump","Warm to touch","Tenderness","Bleeding","Numbness","Tingling","Leakage after injection","Skin discoloration","Pain at injection site"],
  "⚠ Red Flag Reaction": ["Hives","Wheezing","Facial swelling","Throat tightness","Dizziness / faintness","Fever with site reaction","Pus or drainage","Red streaking","Spreading redness"],
};
// Compound-specific symptoms added to picker when compound is active
const COMPOUND_SYMPTOMS = {
  "Retatrutide":  { label:"Retatrutide", color:"#7DF9C0", symptoms:["Food noise quiet","Food noise return","Extreme satiety","Appetite return","Nausea","Constipation","Reflux","Elevated heart rate","Rapid weight loss","Water retention"] },
  "GHK-Cu":       { label:"GHK-Cu", color:"#C8FF9C", symptoms:["Skin smoothness","Improved skin tone","Acne","Wound healing","Hair growth","Hair thickness","Nail growth","Reduced redness","Joint comfort"] },
  "BPC-157":      { label:"BPC-157", color:"#FF9CC8", symptoms:["Reduced joint pain","Tendon relief","Gut comfort","Reduced inflammation","Improved mobility","Wound healing","Sleep quality improved","Fatigue"] },
  "MOTS-c":       { label:"MOTS-c", color:"#7DD4F9", symptoms:["Improved energy","Improved endurance","Palpitations","Insomnia","Better glucose tolerance","Increased warmth","Injection site irritation"] },
  "Placenta":     { label:"Placenta", color:"#D4AF6A", symptoms:["Improved energy","Reduced fatigue","Improved mood","Improved focus","Improved sleep","Hormone balance","Skin glow","Hair growth","Nail growth","Improved recovery","Injection site reaction","Headache"] },
  "Glutathione":  { label:"Glutathione", color:"#C8FF9C", symptoms:["Mental clarity","Skin brightening","Reduced fatigue","Improved recovery","Detox sensation","Flushing","Hypersensitivity reaction"] },
  "Selank":       { label:"Selank", color:"#7DD4F9", symptoms:["Anxiety relief","Improved focus","Calm alertness","Low mood","Brain fog","Drowsiness","Mood lift"] },
  "Semax":        { label:"Semax", color:"#9CDC5C", symptoms:["Mental clarity","Improved focus","Motivation boost","Irritability","Overstimulation","Headache","Brain fog return","Improved recall"] },
  "DSIP":         { label:"DSIP", color:"#9CC8FF", symptoms:["Deeper sleep","Sleep quality improved","Restless sleep","Grogginess","Vivid dreams","No effect on sleep","Headache"] },
  "KPV":          { label:"KPV", color:"#FF9CC8", symptoms:["Reduced gut discomfort","Gut comfort","Reduced bloating","Reduced inflammation","Skin clarity","Reduced redness","Wound healing","Acne improvement","Improved skin texture","Fatigue","Injection site reaction"] },
  "GLOW":         { label:"GLOW Blend", color:"#C8FF9C", symptoms:["Skin smoothness","Improved skin tone","Skin clarity","Wound healing","Hair growth","Collagen improvement","Reduced redness","Joint comfort","Improved recovery","Fatigue","Injection site reaction"] },
  "KLOW":         { label:"KLOW Blend", color:"#FF9CC8", symptoms:["Skin smoothness","Improved skin tone","Reduced gut discomfort","Reduced inflammation","Acne improvement","Wound healing","Skin clarity","Reduced redness","Gut comfort","Improved recovery","Fatigue","Injection site reaction"] },
  "TB-500":       { label:"TB-500", color:"#C9A0FF", symptoms:["Tendon relief","Reduced inflammation","Improved mobility","Reduced muscle soreness","Headache","Fatigue","Flushing"] },
  "CJC-1295 no DAC": { label:"CJC-1295", color:"#7DF9C0", symptoms:["Deeper sleep","Improved recovery","Water retention","Tingling hands","Head rush","Joint comfort","Fatigue"] },
  "Ipamorelin":   { label:"Ipamorelin", color:"#9CDC5C", symptoms:["Deeper sleep","Improved recovery","Increased appetite","Water retention","Head rush","Injection site reaction"] },
  "Epithalon":    { label:"Epithalon", color:"#C9A0FF", symptoms:["Deeper sleep","Vivid dreams","Improved mood","Energy boost","No noticeable effect"] },
  "Cartalax":     { label:"Cartalax", color:"#9CC8FF", symptoms:["Joint comfort","Improved mobility","Reduced joint stiffness","Cartilage/connective tissue support","No noticeable effect","Injection site reaction"] },
  "Tirzepatide":  { label:"Tirzepatide", color:"#7DD4F9", symptoms:["Nausea","Constipation","Reduced appetite","Vomiting","Fatigue","Injection site reaction","Food noise quiet","Appetite return"] },
  "Semaglutide":  { label:"Semaglutide", color:"#9CC8FF", symptoms:["Nausea","Constipation","Reduced appetite","Vomiting","Fatigue","Food noise quiet","Appetite return","Heartburn / reflux"] },
};
const SITES = ["Abdomen — upper L","Abdomen — upper R","Abdomen — lower L","Abdomen — lower R","Left thigh","Right thigh","Left flank","Right flank","Left delt","Right delt","Left glute","Right glute","Near injury site","Ventrogluteal — L (IM)","Ventrogluteal — R (IM)","Vastus lateralis — L (IM)","Vastus lateralis — R (IM)","Deltoid — L (IM)","Deltoid — R (IM)"];
const NOSTRIL_SITES = ["Left nostril","Right nostril","Both nostrils"];
// Injection-site rotation and lipohypertrophy risk are real concerns for repeated
// needle use — meaningless for a nasal spray. Every place that shows a "site" picker or
// warns about site rotation should ask this rather than assuming route.
function sitesFor(data) { return data.route==="Nasal" ? NOSTRIL_SITES : SITES; }
function siteLabelFor(data) { return data.route==="Nasal" ? "NOSTRIL" : "INJECTION SITE"; }
const MOODS = [
  {v:1,label:"Rough",emoji:"😣",color:"#ff5c5c"},{v:2,label:"Low",emoji:"🙁",color:"#ff9c5c"},
  {v:3,label:"Okay",emoji:"😐",color:"#e8d75c"},{v:4,label:"Good",emoji:"🙂",color:"#9cdc5c"},{v:5,label:"Great",emoji:"😄",color:"#7DF9C0"},
];
const RETURN_SYMPTOMS = new Set(["Appetite return","Food noise return","Cravings","Energy dip","Fatigue"]);
const MEASURES = [["waist","Waist","#FF9CC8"],["hips","Hips","#9CC8FF"],["glute","Glute","#C8FF9C"]];
const RECON_SHELF = 30;

const GUIDES = [
  { icon:"📅", title:"Multi-Dose Days & Protocol Phases", min:"5 min", cat:"What's New", body:[
    ["Compounds taken more than once a day","Set 'Times per scheduled day' in a compound's schedule settings — Today, Upcoming, and the calendar now track each occurrence independently. Logging your morning dose never marks the evening one as done; you'll see '1 of 2 taken · Next 10:00 PM' until both are resolved."],
    ["Protocols that change dose or frequency over time","Turn on 'Use Protocol Phases' in a compound's settings to define stages — e.g. daily loading for 2 weeks, then weekly maintenance. Each phase can set its own dose, frequency, and times per day. The schedule switches automatically on the transition day; nothing to remember."],
    ["Rest phases","A phase can be marked Rest — no doses get scheduled for its duration. Useful for on/off cycling protocols where part of the plan is deliberately doing nothing."],
    ["Phase-change alerts","Needs Attention now surfaces a heads-up 3 days before a phase transition and again on the day it happens, describing exactly what's changing (dose, frequency, or moving into/out of rest). Toggle this under Settings → Protocol Phase Alerts."],
    ["Ask Nexus Chat","Try \"what phase am I in?\" or \"when does my dose increase?\" — answers come from your actual protocol phase data, not a guess."],
  ]},
  { icon:"↺", title:"Rescheduling, Skipping & the Today List", min:"4 min", cat:"What's New", body:[
    ["Rescheduling a dose","Tap Reschedule on any due or upcoming dose to move just that occurrence — your regular schedule for every other day is untouched. You can reschedule an already-rescheduled dose again if plans change twice; it stays one tracked occurrence, not several."],
    ["Skip vs. Reschedule vs. Missed","Skip = you're intentionally not taking it. Reschedule = you're taking it, just later. Missed = the window passed with no action. These stay distinct everywhere — This Week, adherence, and Nexus Chat all use the same definitions."],
    ["Today sorts by urgency automatically","The Due/Needs Action list orders itself: overdue first (oldest overdue on top), then due now, then anything scheduled later today in time order. The top card is marked Up Next so it's obvious what to do first when you open the app."],
    ["This Week's numbers only count what's actually happened","Completed and Missed only include today and earlier — a dose scheduled for Thursday can't count against you on Monday. Pending only means 'due later today,' not the rest of the week's plan (those show as a simple planned count per day)."],
  ]},
  { icon:"🧪", title:"Split-Vial Dosing & Draw-As-You-Go", min:"6 min", cat:"What's New", body:[
    ["When one vial isn't enough","If your current vial doesn't have enough left for a full dose, Log Dose shows exactly how short you are and lets you pull the rest from another vial — the result is still ONE dose record, just with more than one source."],
    ["Draw-as-you-go","Tap Draw on a vial and Nexus asks what you actually got — it never assumes the calculated amount matches reality. If it's short, you're asked what happened to the difference (discarded, an inventory discrepancy, or other) right there, and the vial is marked finished as a natural result."],
    ["Opening a new vial mid-dose","Tap Open New Vial without losing anything you've already entered — amount, site, notes, and whatever's already allocated are preserved, and you're brought right back to finish once the new vial is confirmed."],
    ["Different concentrations are handled correctly","If your two source vials were mixed with different amounts of BAC water, Nexus calculates syringe units for each one independently — it never assumes they match."],
    ["Prepared doses support the same workflow","Preparing a syringe ahead of time (Stash → Prepare) now walks through the same draw/reconcile/continue flow as logging a dose — the syringe can be built from multiple vials and marked Prepared without creating a dose record. Administering it later logs one dose and keeps the full source history, with no inventory double-counted."],
  ]},
  { icon:"🧫", title:"Vial Lifecycle: Finish, Undo, Reopen", min:"5 min", cat:"What's New", body:[
    ["Every kit tracks individual vials","Stash shows each physical vial separately — which one's current, Nexus's estimate for it, and (once closed out) why. Tap the ⋯ menu on any vial for its available actions."],
    ["Finish Vial","Closes out just the currently active vial — the kit and any sealed backups stay available. You'll be asked what happened to whatever's left: used in the dose you're about to log, discarded, an inventory discrepancy, or other. It's never assumed to have been administered unless you say so."],
    ["Undo Reconstitution","For 'I didn't mean to open this vial.' Only offered as a one-tap action when nothing's attached to it yet (no doses, prepared syringes, or outflow logged against it) — if something is, you'll see exactly what and be pointed to undo that first."],
    ["Reopen Vial","For 'I marked this finished too early.' Restores a finished vial back to active using its real reconstitution date and full history — it never resets to full and never creates a duplicate vial."],
    ["Vial numbers are permanent","Vial 1 stays Vial 1 forever, however many times it's finished, reopened, or undone elsewhere in the kit."],
  ]},
  { icon:"↩️", title:"Undo & Correcting Mistakes", min:"3 min", cat:"What's New", body:[
    ["Outflow can be undone or edited","Logged the wrong amount as wasted/given away? Tap into a vial's outflow history to Edit the amount/reason/date, or Undo it entirely — the vial's available inventory updates immediately either way."],
    ["Quick Log has an undo toast","After a quick-logged dose, a brief 'Undo' option appears at the bottom of the screen — no need to dig into edit history for an immediate correction."],
    ["Reconstitution can be edited","Got the date or BAC water amount wrong when opening a vial? Edit reconstitution from the vial's ⋯ menu corrects it without touching anything else."],
  ]},
  { icon:"🚀", title:"Getting Started — The Workflow", min:"4 min", cat:"Tutorial", body:[
    ["The natural order","This app follows a lifecycle: Plan → Prepare → Execute → Review. Each step builds on the last. Skipping ahead works, but following this order gets you the most value fastest."],
    ["Step 1 — Complete your profile","Go to Profile (👤 button). Set your name, weight, goal weight, and units. This personalises the app and starts your baseline — you can't measure progress without a starting point."],
    ["Step 2 — Add your inventory (Stash)","Tap Stash → + Add Kit. Enter vial size (mg), BAC water used (mL), and total vials. This unlocks reconstitution math, supply forecasts, and expiry warnings. Compound Intel can't show your real kit data without this."],
    ["Step 3 — Build a protocol","Tap Protocol → New Protocol. Choose a goal, pick a template or build from scratch, add compounds, set your schedule and phases, then review. Save as Draft until you're ready. A protocol connects everything — compounds, kits, doses, and insights — into one named plan."],
    ["Step 4 — Activate the protocol","From the Protocol tab, activate your draft. This makes it live: doses appear in Today, reminders activate, and the accumulation model starts tracking. You can pause or edit it at any time."],
    ["Step 5 — Log doses and daily check-ins","Every time you inject, tap + Log Dose on Today. Once a day, tap + Check-in to log mood, symptoms, and notes. This is the data engine. Without it, Insights has nothing to analyse."],
    ["Step 6 — Review Insights","After 2–3 dose cycles, Nexus → Insights starts generating patterns: when food noise returns, which phase has the most symptoms, whether weight loss correlates with hunger. The more you log, the stronger the signal."],
    ["The six sections","Profile: your baseline and settings. Stash: physical inventory and reconstitution. Protocol: planning and active tracking. Today: daily execution. Nexus: AI, insights, and compound library. Plans: goals, research queue, and future protocols."],
  ]},
  { icon:"🗺️", title:"Everything Nexus Can Do", min:"5 min", cat:"Reference", body:[
    ["Planning","Protocol Builder (6-step guided flow) · Goal selection · Template library (GLP-1, Wolverine, Longevity, CLO) · Stack builder with complexity score and interaction analysis · Phase designer (dose / rest / escalation) · Schedule builder (daily, EOD, weekly, custom days) · Draft protocols before activating · Research Queue · Future Protocols · Goals with linked compounds · Shopping list"],
    ["Tracking","+ Log Dose with site, amount, escalation flag · Daily check-in: mood, symptoms (50+ built-in + custom), notes · Symptom picker with collapsible categories · Compound-specific symptom suggestions · Weight, waist, and body measurement logs · Macro logging · Supplement logging"],
    ["Inventory (Stash)","Kit cards with vial size, BAC water, concentration · Live reconstitution math: units to draw per dose · Supply forecast: weeks remaining, depletion date · Multi-kit tracking: active vs frozen · Expiry warnings · BAC Water Guide with SUGGESTED option · Frozen kit estimated start date · Total compound supply across all kits"],
    ["Analysis","Plasma accumulation model with half-life decay · Phase indicator (Taking Effect, Peak, Cruise, Wear Off) · Medication level chart with expected peak/trough · Symptom frequency chart · Weight and measurement charts with timeframe filter · Macro trends · Dose retrospectives: tap any dose to see what happened after it · Protocol timeline in Profile"],
    ["Insights (Nexus)","Hero insight ranked by confidence × usefulness × rarity · What Changed (14d vs prior 14d) · Patterns Discovered: supplement correlation, mood-phase, protein-symptom, site reactions, escalation outcomes · Looking Ahead: next dose, phase transition, pattern predictions · Milestones: first month, dose counts, symptom-free streaks, weight milestones · Monthly narrative recap · Confidence gating — no insight shows without sufficient data"],
    ["Compound Library","44 compounds with full Intel pages · Mechanism, timing, titration, cycle notes, stacks, safety · Typical Titration section with YOU ARE HERE badge · BAC Water Guide with unit examples · What to Track section · Reconstitution calculator using your real kit data · Supply Forecast from your Stash · Search by name or alias · Filter by category (Fat Loss, Recovery, Longevity, etc.)"],
    ["Tools","Dosing Math Guide: mg/mcg/mL/units explained visually · Calendar export (.ics) with smart time suggestions · Apple Health data import · Demo Mode: 3 sample scenarios (Weight Loss, Recovery, Longevity) — never touches real data · Export / Import full data backup · Onboarding flow + Getting Started guide"],
  ]},
  { icon:"⚗️", title:"mg, mcg, mL & Units — Dosing Math Explained", min:"5 min", cat:"Dosing", body:[
    ["Why this matters","A decimal slip or unit confusion is the single most common peptide dosing error. 1 mg = 1000 mcg. 'Units' on a syringe is a volume, not a weight. Mixing them up can mean a 10× dose."],
    ["mg — milligrams","The amount of medication in the vial. A vial labelled 10mg contains 10 milligrams of peptide powder. This is fixed — you can't change it by adding more or less water."],
    ["mcg — micrograms","One thousandth of a milligram. 1 mg = 1000 mcg. 500 mcg = 0.5 mg. Some compounds (BPC-157, GHK-Cu) are dosed in mcg; GLP-1s are usually dosed in mg. Always confirm which unit your protocol uses."],
    ["mL — millilitres","The volume of liquid (BAC water) you add to the vial. This controls concentration. The peptide amount doesn't change — spreading it across more water makes each mL weaker, giving you more measurable volume per dose."],
    ["Units — syringe markings","On a U-100 insulin syringe, 100 units = 1mL. Units measure volume, not medication. '10 units' means you drew 0.1mL — nothing about the peptide amount without knowing concentration."],
    ["Concentration — the link between mg and units","Concentration (mg/mL) = vial mg ÷ BAC water mL. Then: units to draw = (dose mg ÷ concentration) × 100. Example: 10mg vial + 2mL BAC = 5mg/mL. For a 1mg dose: (1 ÷ 5) × 100 = 20 units."],
    ["Quick reference — 10mg vial","1mL BAC → 10mg/mL: 250mcg=2.5u · 500mcg=5u · 1mg=10u · 1.5mg=15u · 2mg=20u\n2mL BAC → 5mg/mL: 250mcg=5u · 500mcg=10u · 1mg=20u · 1.5mg=30u · 2mg=40u\n3mL BAC → 3.33mg/mL: 250mcg=7.5u · 500mcg=15u · 1mg=30u · 1.5mg=45u · 2mg=60u"],
    ["Quick reference — 30mg vial","1mL BAC → 30mg/mL: 0.5mg=1.7u · 1mg=3.3u · 1.5mg=5u · 2mg=6.7u · 3mg=10u\n2mL BAC → 15mg/mL: 0.5mg=3.3u · 1mg=6.7u · 1.5mg=10u · 2mg=13.3u · 3mg=20u\n3mL BAC → 10mg/mL: 0.5mg=5u · 1mg=10u · 1.5mg=15u · 2mg=20u · 3mg=30u"],
    ["Step-by-step calculation","1. Check your vial size (mg). 2. Decide BAC water amount (mL). 3. Calculate concentration: mg ÷ mL. 4. Enter your dose (in same unit as step 1). 5. Divide dose by concentration. 6. Multiply by 100 to get syringe units. Always double-check before drawing."],
    ["Common mistakes","• Converting mg to mcg: move decimal 3 places right (1mg → 1000mcg). • Assuming 'units' = mg — they don't. • Using different BAC amounts each time — always log your BAC water in Stash so your unit math stays consistent across vials."],
  ]},
  { icon:"⚠️", title:"Mistakes to Avoid — The Big 10", min:"4 min", cat:"Safety", body:[
    ["1 · Shaking the vial","Shaking forces micro-bubbles through the solution and the mechanical shear can damage the peptide's structure. Swirl gently in slow circles instead — most peptides dissolve in 30–60 seconds of swirling."],
    ["2 · Spraying water onto the powder","Blasting BAC water directly onto the powder foams it and can denature it on impact. Aim the stream down the inside glass wall so it runs gently into the powder."],
    ["3 · Reconstituting a cold vial","Cold peptide doesn't dissolve cleanly. Let the vial come to room temperature (15–20 min out of the fridge) before adding water."],
    ["4 · Wrong injection angle","Too shallow and you're intradermal (stings, welts); too deep and you hit muscle. Pinch a fold of fat and go in at roughly 45–90° depending on needle length — the pinch test keeps you in the SubQ layer."],
    ["5 · Injecting before the alcohol dries","Wet alcohol stings going in and, if you rub it, can actually carry surface bacteria toward the site. Swab, then give it ~10 seconds to air-dry."],
    ["6 · Skipping the label","An unlabeled vial is a dosing error waiting to happen — especially if you run more than one compound. Label every vial with name, mg, mL/concentration, and reconstitution date. Log it in your Stash and the app tracks expiry for you."],
    ["7 · Not logging events","If you don't log doses, symptoms, and sites, you can't troubleshoot later — you lose the ability to connect a bad week to a dose change or a site to a reaction. The whole point of the tracker is the paper trail."],
    ["8 · Pushing the dose too fast","Climbing before your body has adapted is the fast track to nausea and quitting. Hold each titration step its full window; let symptoms (and the Trough analysis) tell you when — or whether — to go up."],
    ["9 · Reading the wrong edge of the plunger","Insulin syringe plungers have a rubber stopper with two edges. Always read your dose from the same edge (the top/front edge where it meets the barrel markings) every single time, so your doses are consistent."],
    ["10 · Mixing up mg vs mcg vs units","The single most dangerous error — 1 mg = 1000 mcg, and 'units' on a U-100 syringe are a volume, not a mass. Always convert step by step and double-check with the Reconstitution Calculator before you draw. A decimal slip here is a 10× dose."],
  ]},
  { icon:"🚩", title:"Red Flags & Quality Control", min:"7 min", cat:"Safety", body:[
    ["Sterile technique — the offenders","The mistakes that bite you: reusing needles/syringes (one use, every time), skipping alcohol wipes or not letting them dry, touching the needle tip or vial septum after cleaning, shaking instead of swirling, spraying water onto powder, reconstituting cold vials, not labeling, and using the same syringe between vials. Build pro habits: a dedicated washable prep tray, single direction of flow (clean supplies → mix → inject → sharps), wash hands first, alcohol pads kept at the workspace, sharps container always visible."],
    ["Supply quality — on arrival","Question a batch if you see: vials cloudy or with sediment before reconstitution (powder should be a small white/off-white pellet), powder that looks melted/sticky (heat exposure in shipping), unexpected color shifts, damaged packaging or seals, missing batch numbers/labels/COA, or inconsistent fill levels across vials of the same order."],
    ["Supply quality — vendor red flags","Be wary of a vendor who: refuses third-party testing (Janoshik, Peptide Test), is brand new with no community history, prices far below market (testing is expensive — cheap is a signal), has no COA, gives vague/evasive answers, pushes you to buy more before you've tested the current batch, or is cagey about tracking/shipping. Protect yourself: test independently when you can (~$50/test is worth it), buy small first from new vendors, keep your first good vial as a reference baseline, and document everything."],
    ["BAC water specifics","Real bacteriostatic water (0.9% benzyl alcohol) keeps an opened vial usable ~28 days; plain 'sterile water for injection' has no preservative and only a ~24-hour window once opened — don't use it as a long-term substitute. Discard BAC water showing particulates, cloudiness, color change, a broken seal, or past expiry."],
    ["Injection site — ✅ normal","No action needed: a small fluid bleb right after injecting (dissolves in minutes), mild redness for a few hours, slight bruising in fatty areas, a pinprick mark for a day or two, mild itching in the first 24 hours."],
    ["Injection site — ⚠️ watch","Monitor and adjust technique: redness lasting over 24 hours, persistent itching, a hard lump under the skin (lengthen your rotation gap), tenderness past 48 hours, repeated bruising in one area (lower the angle, push slower), or irritation that builds over multiple injections at one site."],
    ["Injection site — 🛑 stop & consult","Pause the cycle and contact a clinician for: redness spreading beyond the site, warmth + redness worsening over days, pus/drainage/an open wound, a hard lump growing over 48–72 hours, fever alongside site issues, or numbness/tingling around the site."],
    ["Injection site — 🚨 ER now","Go immediately for: red streaking radiating from the site (possible lymphatic infection), fever + chills + site symptoms, difficulty using the limb you injected, or severe pain that doesn't respond to ice and elevation."],
    ["Equipment & storage red flags","Replace/discard: sticky syringe plungers, needles that bend easily or have burrs/bent tips, a damaged sharps container, expired alcohol wipes (the active ingredient evaporates), and insulin syringes without clear unit markings. Storage problems: reconstituted vials sitting in light or a clear container, inconsistent fridge temps, vials on the fridge door (temperature swings), using past-due reconstituted vials 'to not waste,' worn-off date labels, or storing alongside food. A dedicated mini-fridge ($100–200) eliminates door-opening swings and is worth it for serious use."],
    ["When to pause ANY protocol","Universal stop triggers regardless of compound: persistent symptoms beyond the expected adaptation window, a vendor/batch change causing new reactions, lab work trending the wrong way, major life stress making sterile consistency hard, current cold/flu/illness, travel that breaks the cold chain, surgery or a procedure within 2–4 weeks, pregnancy or trying to conceive, starting new prescriptions (unknown interactions), worsening mood/anxiety/depression, or simply losing trust in your supply chain. Pause = skip 1–2 doses and resume at the same dose; Stop = end the cycle (taper weekly compounds like reta if you've been on >12 weeks); Restart later = treat as a new protocol and return to the starting dose for titrated peptides. Don't push through serious symptoms, don't skip the stop-and-seek-care signs because the cycle's been good, and don't restart at full dose after weeks off — your tolerance has reset."],
  ]},
  { icon:"🧪", title:"How to Reconstitute", cat:"How-To", min:"5 min", body:[
    ["What you need","Your peptide vial, a vial of bacteriostatic water (BAC water), two insulin syringes (one for transfer, one for injecting), alcohol wipes, and a clean surface. Never use plain sterile water or saline — they lack the bacteriostatic agent that keeps multi-use vials safe between doses."],
    ["Clean & prep","Wipe both rubber stoppers with a fresh alcohol wipe and let air-dry ~10 seconds. Don't blow on them or touch the cleaned surface. Draw up the BAC water you plan to add — a common choice for a 5 mg vial is 2 mL, giving 2.5 mg/mL."],
    ["Add the water","Insert the needle through the stopper at a slight angle and slowly run the water down the inside glass wall rather than blasting the powder directly. This prevents foaming and protein degradation."],
    ["Dissolve","Gently swirl in slow circles. Do not shake — shaking creates micro-bubbles and can denature the peptide. Most dissolve in 30–60 seconds. If cloudiness lingers, refrigerate 15 min and swirl again."],
    ["Label & store","Label with compound, date reconstituted, concentration, and use-by (typically ~30 days refrigerated). Store upright at 2–8 °C, away from light. Unmixed powder often keeps at room temp for weeks; once mixed, refrigeration is required."],
  ]},
  { icon:"💉", title:"Injection Basics", cat:"How-To", min:"4 min", body:[
    ["Subcutaneous, not deep","Most research peptides are dosed SubQ — into the fat layer just under the skin, not muscle. A short insulin needle (e.g. 29–31g, 1/2\") at a 45–90° pinch is standard."],
    ["Clean the site","Swab with alcohol, let it dry. Pinch a fold of fat, insert smoothly, draw back very slightly to check (optional for SubQ), then push slowly and steadily."],
    ["After","Withdraw, light pressure with a clean cotton pad. Mild redness or a tiny bleb is normal. Log the site so you rotate next time."],
  ]},
  { icon:"🔁", title:"Site Rotation", cat:"How-To", min:"3 min", body:[
    ["Why it matters","Repeatedly pinning the same spot causes irritation, scar tissue, and lipohypertrophy (lumpy fat) that changes absorption. Rotating keeps absorption consistent and tissue healthy."],
    ["A simple system","Work around the available sites — abdomen quadrants, thighs, flanks, delts — moving at least an inch from the last spot. This app shows your last 3 sites in the dose logger so you always know where you've been."],
  ]},
  { icon:"🧊", title:"Storage & Shelf Life", cat:"How-To", min:"4 min", body:[
    ["Reconstituted","Keep refrigerated at 2–8 °C, upright, away from light. Most peptides hold potency ~28–35 days once mixed. Log your reconstitution date — this app warns you as use-by approaches."],
    ["Lyophilized (powder)","Unmixed powder is far more stable — often weeks at room temp, months to years frozen. Check your specific compound."],
    ["Signs a vial's gone bad","Cloudiness that won't clear, floating particulate, discoloration, or a vial left warm too long. When in doubt, don't use it."],
    ["Travel","Use an insulated pouch with a cool pack; avoid freezing the reconstituted solution and avoid heat. Keep vials upright."],
  ]},
  { icon:"📐", title:"Dosing Math", cat:"How-To", min:"5 min", body:[
    ["Concentration","Concentration (mg/mL) = vial strength (mg) ÷ BAC water (mL). A 10 mg vial + 2 mL water = 5 mg/mL."],
    ["Units on a U-100 syringe","A U-100 insulin syringe has 100 units per 1 mL. Units to draw = (your dose ÷ concentration) × 100. So 2 mg at 5 mg/mL = (2÷5)×100 = 40 units = 0.4 mL."],
    ["Use the calculator","The built-in Reconstitution Calculator does this for you with a live syringe visual — vial size, water, dose in, units out."],
  ]},
  { icon:"💧", title:"What is BAC Water?", min:"2 min", cat:"How-To", body:[
    ["Bacteriostatic water","Sterile water with 0.9% benzyl alcohol added. The benzyl alcohol suppresses bacterial growth, which is what makes a multi-dose vial safe to enter repeatedly over weeks."],
    ["Vs other waters","Sterile water and saline have no preservative — fine for single use but not for vials you'll draw from many times. BAC water is the standard for reconstituting research peptides."],
  ]},
  { icon:"🧱", title:"Stacking Basics", min:"5 min", cat:"How-To", body:[
    ["What stacking means","Running two or more compounds together to target complementary goals — e.g. a GLP-1 for fat loss alongside a GH secretagogue for recovery and lean-mass preservation. The logic is synergy, but every addition also adds variables and side-effect surface area."],
    ["One change at a time","The cardinal rule. If you start two new compounds at once and feel off, you can't tell which one did it. Introduce one, give it a couple of weeks, log how you respond, then layer the next."],
    ["Common pairings","Fat-loss + muscle-sparing: a GLP-1/GIP agonist with CJC-1295/Ipamorelin. Recovery: BPC-157 with TB-500. Skin/longevity: GHK-Cu solo or alongside a GH secretagogue. These are popular community combinations, not validated clinical regimens."],
    ["Watch for overlap","Stacking compounds that hit the same pathway (e.g. two GH secretagogues) rarely doubles benefit and can blunt your own signaling. Stacking two things that both suppress appetite can push intake too low — which sabotages the muscle-sparing goal."],
    ["The honest caveat","Almost no peptide stacks have been studied as combined products in humans. You're combining single-agent data and community experience. Track objective markers, not vibes, and keep your clinician in the loop — especially when a GLP-1 is involved."],
  ]},
  { icon:"🔄", title:"Cycling Explained", min:"4 min", cat:"How-To", body:[
    ["Why people cycle","Some compounds lose effect with continuous use (receptor downregulation), some carry cumulative risk, and some are simply used in defined blocks. Cycling means running a compound for a set period, then pausing — 'on' and 'off' phases."],
    ["Healing vs metabolic","Healing peptides (BPC-157, TB-500) are often run in short blocks — e.g. 4–6 weeks during an injury, then off. GLP-1 agonists like retatrutide are different: they're typically titrated and run continuously toward a maintenance dose, more like a medication than a cycle."],
    ["GH secretagogues","CJC-1295/Ipamorelin protocols often use cycles (e.g. 8–12 weeks on, a few weeks off) on the theory of preserving pituitary responsiveness — though the evidence for mandatory cycling is thin."],
    ["Don't cold-turkey a GLP-1","Stopping a GLP-1/GIP agonist abruptly tends to bring appetite and often weight back fast. If you're coming off, a gradual taper (see Weaning Off) is gentler — and a clinician conversation, not a guess."],
  ]},
  { icon:"🪡", title:"Choosing a Syringe", min:"4 min", cat:"How-To", body:[
    ["U-100 insulin syringes","The standard for SubQ peptide dosing. 'U-100' means 100 units per mL, so the unit markings line up directly with the reconstitution math. Common sizes: 0.3 mL (30 units), 0.5 mL (50 units), 1 mL (100 units) — pick one that comfortably holds your draw."],
    ["Needle gauge & length","Higher gauge = thinner needle. 29–31g is typical for SubQ and nearly painless. Length 5/16\" to 1/2\" (8–13 mm) is plenty for the fat layer — you don't want to reach muscle."],
    ["Reading the markings","Each small line is usually 1 unit on a 0.3 mL syringe, 2 units on a 1 mL. Always confirm what one tick equals on your specific syringe before drawing — it's the #1 source of accidental 10x dosing errors."],
    ["Transfer vs inject","Some people use a slightly larger needle to draw (faster) and a fresh fine one to inject (comfort). One needle per injection — never reuse; they dull and contaminate fast."],
  ]},
  { icon:"🧫", title:"Filtering & Drawing", min:"4 min", cat:"How-To", body:[
    ["Do you need to filter?","Most home users don't filter reconstituted peptide — if it's fully dissolved and clear, you draw and inject. Filtering (with a 0.22 micron sterile filter) is an extra sterility step some take, especially with larger batch prep, but it adds handling and loss."],
    ["Drawing cleanly","Swab the stopper, let it dry. Pull a little air into the syringe equal to your draw, inject that air into the vial (equalizes pressure), then invert and draw your dose slowly. Tap out bubbles, push them back, re-draw to your exact unit mark."],
    ["Bubbles","Small bubbles in a SubQ insulin syringe aren't dangerous the way an IV air embolism would be — but they throw off your dose accuracy. Flick them to the top and push them out before you set your final unit count."],
    ["If you filter","Draw through the filter into a clean syringe, then swap to your injecting needle. Expect a little product loss in the filter. Only worth it if you have a sterility reason; otherwise it's added risk of fumbling a sterile field."],
  ]},
  { icon:"📦", title:"I Just Got My Peptides — Now What?", min:"5 min", cat:"Getting Started", body:[
    ["What's in the box","Typically a lyophilized (freeze-dried) peptide vial — a small amount of white powder or a barely-visible film at the bottom. That's normal; the dose is tiny. You'll also need BAC water, insulin syringes, and alcohol wipes, usually bought separately."],
    ["The order of operations","1) Read the reconstitution guide. 2) Mix the vial with BAC water. 3) Use the calculator to find your units. 4) Read injection basics. 5) Log your first dose here. It's a lot the first time and routine by the third."],
    ["Before your first dose","Know your number — run the Reconstitution Calculator so you know exactly how many units to draw. Have your injection site picked. And if a clinician is involved in your protocol, this is the moment to confirm your starting dose with them."],
    ["Storage from day one","Unmixed powder is stable; once you reconstitute, it lives in the fridge with a ~30-day clock. Log the reconstitution date in your Stash so the app tracks the expiry for you."],
  ]},
  { icon:"📈", title:"Titration Schedules", min:"5 min", cat:"Getting Started", body:[
    ["Why titrate","Starting low and increasing gradually lets your body adapt and keeps side effects (especially GI, with GLP-1s) manageable. Jumping straight to a maintenance dose is the fast track to nausea, fatigue, and quitting."],
    ["Retatrutide example","Published trial protocols commonly start around 2 mg weekly and step up every 4 weeks toward a 12 mg maintenance dose. A typical research ladder: 2 → 4 → 6 → 9 → 12 mg, holding each step ~4 weeks. Your tolerance dictates pace — there's no prize for rushing."],
    ["Listen to the data, not the calendar","If a step brings strong nausea or your appetite is already well-controlled, holding longer (or not climbing) is reasonable. The Trends → Trough analysis here helps you see whether you even need more drug yet."],
    ["This is a clinician conversation","Titration pace, target dose, and whether to climb at all are exactly the decisions worth making with a prescriber — not off a generic ladder. The app gives you the data to bring to that conversation."],
  ]},
  { icon:"📉", title:"Weaning Off", min:"4 min", cat:"Getting Started", body:[
    ["Why taper instead of stop","For GLP-1/GIP agonists, stopping cold typically brings appetite — and often weight — back quickly, because the drug was doing the appetite-suppression work. A gradual step-down gives your own regulation time to take back over."],
    ["A gentle approach","The mirror image of titration: step the dose down over several weeks rather than dropping it, while deliberately locking in the habits (protein, training, sleep) that have to carry the maintenance once the drug is gone."],
    ["Healing peptides","Short-block compounds (BPC-157, TB-500) don't generally need a taper — you finish the block and stop. The weaning concern is mostly about the metabolic agonists."],
    ["Plan it with your clinician","When and how to come off — especially the timeline and whether to bridge with anything — is a prescriber decision. Bring your weight trend and measurement data from Trends so it's an informed one."],
  ]},
];

// ─── Peptide library (Discover) ─────────────────────────────────────────────────
// evidence: "established" | "emerging" | "investigational"  — drives the badge & honesty
// Bump CURRENT_CHANGELOG_VERSION and add a new entry at the top whenever shipping
// a user-facing feature worth announcing. Entries are shown newest-first.
const CURRENT_CHANGELOG_VERSION = 70;
