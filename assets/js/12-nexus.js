// iPhone-style compound action sheet; keep the existing .morebox DOM/actions and
// listeners intact, but portal it temporarily out of the scrolling compound card.
let nxActiveCompoundSheet = null;
function nxCloseCompoundSheet(restoreFocus=true) {
  const active=nxActiveCompoundSheet;
  if(!active) return;
  nxActiveCompoundSheet=null;
  document.removeEventListener("keydown",active.onKeydown,true);
  active.scrim.remove();
  active.header.remove();
  active.sheet.classList.remove("nx-compound-sheet-open");
  active.sheet.style.display="none";
  active.sheet.removeAttribute("role");
  active.sheet.removeAttribute("aria-modal");
  active.sheet.removeAttribute("aria-label");
  if(active.marker.parentNode)active.marker.replaceWith(active.sheet);
  else active.sheet.remove();
  document.body.style.overflow=active.previousOverflow;
  const app=document.getElementById("app");
  if(app)app.inert=false;
  active.trigger.setAttribute("aria-expanded","false");
  active.trigger.style.color="var(--t4)";
  if(restoreFocus && active.trigger.isConnected)active.trigger.focus({preventScroll:true});
}
function nxOpenCompoundSheet(trigger) {
  if(nxActiveCompoundSheet && nxActiveCompoundSheet.trigger===trigger) {
    nxCloseCompoundSheet();
    return;
  }
  nxCloseCompoundSheet(false);
  const sheet=document.querySelector(`.morebox[data-name="${CSS.escape(trigger.dataset.name)}"]`);
  if(!sheet)return;
  const marker=document.createComment("compound sheet original position");
  sheet.before(marker);
  const scrim=document.createElement("div");
  scrim.className="nx-compound-sheet-scrim";
  scrim.setAttribute("aria-hidden","true");
  document.body.appendChild(scrim);
  const header=document.createElement("div");
  header.className="nx-compound-sheet-header";
  header.innerHTML='<span class="nx-sheet-drag-handle" aria-hidden="true"></span><div class="nx-compound-sheet-heading"><span class="nx-compound-sheet-kicker">COMPOUND ACTIONS</span><strong></strong></div><button type="button" class="nx-compound-sheet-close" aria-label="Close compound actions"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
  header.querySelector("strong").textContent=trigger.dataset.name;
  sheet.prepend(header);
  sheet.classList.add("nx-compound-sheet-open");
  sheet.setAttribute("role","dialog");
  sheet.setAttribute("aria-modal","true");
  sheet.setAttribute("aria-label",trigger.dataset.name+" actions");
  sheet.style.display="block";
  document.body.appendChild(sheet);
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const app=document.getElementById("app");
  if(app)app.inert=true;
  trigger.setAttribute("aria-expanded","true");
  trigger.style.color="var(--t2)";
  const onKeydown=e=>{
    if(e.key==="Escape"){e.preventDefault();nxCloseCompoundSheet();return;}
    if(e.key!=="Tab")return;
    const focusables=Array.from(sheet.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href]')).filter(el=>el.getClientRects().length);
    if(!focusables.length){e.preventDefault();sheet.focus();return;}
    const first=focusables[0],last=focusables[focusables.length-1];
    if(e.shiftKey && (document.activeElement===first || !sheet.contains(document.activeElement))){e.preventDefault();last.focus();}
    else if(!e.shiftKey && (document.activeElement===last || !sheet.contains(document.activeElement))){e.preventDefault();first.focus();}
  };
  nxActiveCompoundSheet={sheet,trigger,marker,scrim,header,previousOverflow,onKeydown};
  document.addEventListener("keydown",onKeydown,true);
  scrim.onclick=()=>nxCloseCompoundSheet();
  header.querySelector(".nx-compound-sheet-close").onclick=()=>nxCloseCompoundSheet();
  let touchStartY=null;
  header.addEventListener("touchstart",e=>{touchStartY=e.touches[0]?.clientY??null;},{passive:true});
  header.addEventListener("touchend",e=>{
    if(touchStartY!==null && (e.changedTouches[0]?.clientY??touchStartY)-touchStartY>75)nxCloseCompoundSheet();
    touchStartY=null;
  },{passive:true});
  // Bubble AFTER the pre-existing action click handlers. Keep colour picker
  // open until change/confirmation so its native iOS spectrum isn't interrupted.
  sheet.addEventListener("click",function onAction(e){
    const btn=e.target.closest("button");
    if(!btn||btn.closest(".nx-compound-sheet-header"))return;
    const scrollTo=btn.classList.contains("histtoggle")?".histbox":btn.classList.contains("tunetoggle")?".tunebox":null;
    nxCloseCompoundSheet(false);
    if(scrollTo)requestAnimationFrame(()=>{
      const target=document.querySelector(`${scrollTo}[data-name="${CSS.escape(trigger.dataset.name)}"]`);
      if(target?.getClientRects().length)target.scrollIntoView({block:"nearest",behavior:"smooth"});
    });
  },{once:false});
  sheet.addEventListener("change",function onColor(e){
    if(e.target.classList.contains("colorpick"))nxCloseCompoundSheet(false);
  },{once:false});
  header.querySelector(".nx-compound-sheet-close").focus({preventScroll:true});
}

function wireBody() {
  // nexus api key
  const nks=$("#nexus-key-save"); if(nks) nks.onclick=()=>{
    const v=document.getElementById("nexus-key-input").value.trim();
    state.settings.nexusApiKey=v; saveState();
    nks.textContent=v?"✓ Key saved":"Key cleared"; setTimeout(()=>nks.textContent="Save API Key",2000);
  };
  const gnp=$("#goto-profile-nexus"); if(gnp) gnp.onclick=()=>{ state._profileReturn=tab; tab="profile"; render(); window.scrollTo(0,0); };
  const pbk=$("#profile-back"); if(pbk) pbk.onclick=()=>{ const ret=state._profileReturn||"home"; state._profileReturn=null; tab=ret; render(); window.scrollTo(0,0); };
  // amino sub-tabs
  const asc=$("#as-chat"); if(asc) asc.onclick=()=>{state._aminoSub="chat";renderBody();};
  const nxAskChanges=$("#nx-ask-changes");if(nxAskChanges)nxAskChanges.onclick=()=>nxCheckinComparison(14);
  const asi2=$("#as-insights"); if(asi2) asi2.onclick=()=>{state._aminoSub="insights";renderBody();};
  const ase=$("#as-explore"); if(ase) ase.onclick=()=>{state._aminoSub="explore";renderBody();};
  const asl=$("#as-learn"); if(asl) asl.onclick=()=>{state._aminoSub="learn";renderBody();};
  const asj=$("#as-journal"); if(asj) asj.onclick=()=>{state._aminoSub="journal";renderBody();};
  if(state._aminoSub==="journal"){
    const jsearch=$("#journal-search");
    if(jsearch){ jsearch.oninput=()=>{ state._journalQuery=jsearch.value; renderBody(); const n=$("#journal-search"); if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);} }; }
    document.querySelectorAll(".journal-comp-chip").forEach(ch=>ch.onclick=()=>{ state._journalCompound=ch.dataset.c; renderBody(); });
    document.querySelectorAll("[data-jump-type]").forEach(card=>card.onclick=()=>{
      const t=card.dataset.jumpType;
      if(t==="daily"){ const log=(state.dailyLogs||[]).find(l=>String(l.id)===card.dataset.jumpId); if(log) dailyModal(log); }
      else if(t==="dose"){ const p=allPeptides()[card.dataset.jumpName]; const d=p&&(p.doses||[]).find(x=>String(x.id)===card.dataset.jumpId); if(d) doseModal(card.dataset.jumpName, d); }
      else if(t==="weight"){ const w=(state.weightLogs||[]).find(x=>String(x.id)===card.dataset.jumpId); if(w) weightModal(w); }
      else if(t==="measurement"){ const m=(state.measurementLogs||[]).find(x=>String(x.id)===card.dataset.jumpId); if(m) measureModal(m); }
      else if(t==="stash"){ tab="stash"; render(); window.scrollTo(0,0); }
    });
  }
  // Feature Explorer item clicks — re-call featureExplorerView to get action map
  if(state._aminoSub==="explore") {
    document.querySelectorAll(".fe-item").forEach(el=>{
      el.onclick=()=>{
        const name=el.dataset.name;
        const ACTIONS={
          "Protocol Builder":()=>{tab="protocols";render();window.scrollTo(0,0);},
          "Goal selection + Templates":()=>{tab="protocols";render();window.scrollTo(0,0);},
          "Stack builder":()=>{tab="protocols";render();window.scrollTo(0,0);},
          "Research Queue":()=>{tab="plans";state._plansSub="research";render();window.scrollTo(0,0);},
          "Goals":()=>{tab="plans";state._plansSub="goals";render();window.scrollTo(0,0);},
          "Shopping List":()=>{tab="plans";state._plansSub="shopping";render();window.scrollTo(0,0);},
          "Dose logging":()=>{tab="home";render();window.scrollTo(0,0);},
          "Daily check-in":()=>{tab="home";render();window.scrollTo(0,0);},
          "Custom symptoms":()=>{tab="home";render();window.scrollTo(0,0);},
          "Weight + measurements":()=>{tab="trends";render();window.scrollTo(0,0);},
          "Macros":()=>{tab="home";render();window.scrollTo(0,0);},
          "Kit tracking":()=>{tab="stash";render();window.scrollTo(0,0);},
          "Reconstitution math":()=>{tab="stash";render();window.scrollTo(0,0);},
          "Supply forecasting":()=>{tab="stash";render();window.scrollTo(0,0);},
          "BAC Water Guide":()=>{tab="stash";render();window.scrollTo(0,0);},
          "Expiry warnings":()=>{tab="stash";render();window.scrollTo(0,0);},
          "Plasma accumulation model":()=>{tab="trends";render();window.scrollTo(0,0);},
          "Phase indicators":()=>{tab="trends";render();window.scrollTo(0,0);},
          "Dose retrospectives":()=>{tab="trends";render();window.scrollTo(0,0);},
          "Symptom frequency chart":()=>{tab="trends";render();window.scrollTo(0,0);},
          "Weight + body comp trends":()=>{tab="trends";render();window.scrollTo(0,0);},
          "Hero insight":()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);},
          "What Changed":()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);},
          "Patterns Discovered":()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);},
          "Predictions":()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);},
          "Milestones":()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);},
          "Monthly recap":()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);},
          "44 compound profiles":()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);},
          "Compound Intel":()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);},
          "Alias search":()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);},
          "Category filter":()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);},
          "🧮 Dose Calculator":()=>{tab="amino";state._aminoSub="learn";state._learnSub="calc";renderBody();window.scrollTo(0,0);},
          "🔬 Stacking Guide":()=>{tab="amino";state._aminoSub="learn";state._learnSub="mixing";renderBody();window.scrollTo(0,0);},
          "Dosing Math Guide":()=>{tab="amino";state._aminoSub="learn";state._guideOpen=GUIDES.findIndex(g=>g.title.includes("mg, mcg"));renderBody();window.scrollTo(0,0);},
          "Calendar export (.ics)":()=>{tab="home";render();window.scrollTo(0,0);},
          "Apple Health import":()=>{tab="profile";render();window.scrollTo(0,0);},
          "Demo Mode":()=>{demoPickerModal();},
          "Export / Import backup":()=>{tab="profile";render();window.scrollTo(0,0);},
        };
        if(ACTIONS[name]) ACTIONS[name]();
      };
    });
  }
  // amino chat
  const asi=$("#amino-send"); if(asi) asi.onclick=()=>{ const inp=document.getElementById("amino-input"); if(inp){aminoSend(inp.value); inp.value="";} };
  const aclr=$("#amino-clear"); if(aclr) aclr.onclick=()=>{ state._aminoMsgs=[]; render(); };
  document.querySelectorAll(".amino-suggest").forEach(b=>b.onclick=()=>aminoSend(b.dataset.q));
  const ainp=$("#amino-input");
  if(ainp) ainp.addEventListener("keydown",e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();aminoSend(ainp.value);ainp.value="";} });
  document.querySelectorAll(".edit-supp-log").forEach(b=>b.onclick=()=>supplementModal(b.dataset.date));
  document.querySelectorAll(".del-supp-log").forEach(b=>b.onclick=()=>{
    state.supplementLogs=(state.supplementLogs||[]).filter(s=>dayKey(s.date)!==b.dataset.date);
    saveState();render();
  });
  document.querySelectorAll(".qa-supp").forEach(b=>b.onclick=()=>supplementModal());
  const NOTION_SUPPS=["Psyllium Husk","Peppermint Oil (Enteric)","Betaine HCl","Slippery Elm","Papaya Enzyme","Magnesium Citrate","Electrolyte Gummies","Taurine","L-Carnitine","Acetyl L-Carnitine","Berberine HCl","R-Lipoic Acid","Resveratrol","Myo-Inositol","Yohimbine","Magnesium Glycinate + Ashwagandha","Liposomal Magnesium Glycinate","Ionic Magnesium Liquid","Melatonin","Ashwagandha Melatonin/L-Theanine","Vitamin C","Omega-3 Fish Oil","Odorless Garlic","Ginger Root","Creatine (Creapure)","Lactase Enzyme","Caffeine + Green Tea","EGCG (Green Tea Extract)","Caffeine","CLA","Cayenne","Immune Gummies","Hair Skin Nails Gummies","C-Burn","Calm Caps","PMS Gummies","Women's Probiotic","Women's Probiotic + Cranberry","Women's Prebiotic & Probiotic","Bloat & Gas Probiotic","Metabolic Boost Pre-Pro-Postbiotic","Cranberry Gummies","Prenatal Vitamin","Lysine","Maca Root + Ashwagandha","Glucosamine Chondroitin MSM + Turmeric","Gentle Reset Cleanse","Liquid Chlorophyll","Fennel Seed","Diabetic Formula","Melatonin (Mixed Berry)"];
  const lns=$("#load-notion-supps"); if(lns) lns.onclick=()=>{
    if(!state.settings.supplements) state.settings.supplements=[];
    let added=0;
    NOTION_SUPPS.forEach(s=>{ if(!state.settings.supplements.includes(s)){state.settings.supplements.push(s);added++;} });
    saveState(); renderBody();
    lns.textContent=`✓ ${added} added`;
  };
  const tlt=$("#timeline-toggle"); if(tlt) tlt.onclick=()=>{state._timelineOpen=!state._timelineOpen;renderBody();};
  const as=$("#add-supp"); if(as) as.onclick=()=>{
    const inp=document.getElementById("new-supp"); const v=(inp?.value||"").trim();
    if(!v) return;
    if(!state.settings.supplements) state.settings.supplements=[];
    if(state.settings.supplements.some(s=>s.toLocaleLowerCase()===v.toLocaleLowerCase())){
      alert("This supplement is already in your list."); return;
    }
    state.settings.supplements.push(v);
    state.settings.supplements.sort((a,b)=>a.localeCompare(b));
    saveState(); renderBody();
  };
  const ni=document.getElementById("new-supp"); if(ni) ni.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();document.getElementById("add-supp")?.click();}});
  document.querySelectorAll(".del-supp").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name;
    if(!confirm("Remove "+name+" from your supplement list? Historical supplement logs will be preserved.")) return;
    state.settings.supplements=(state.settings.supplements||[]).filter(s=>s!==name);
    saveState(); renderBody();
  });
  const er=$("#enablerem");  if(er) er.onclick=enableReminders;
  const dr=$("#disablerem"); if(dr) dr.onclick=disableReminders;
  const epr=$("#enablephaserem");  if(epr) epr.onclick=()=>{ state.settings.phaseRemindersEnabled=true; saveState(); render(); };
  const dpr=$("#disablephaserem"); if(dpr) dpr.onclick=()=>{ state.settings.phaseRemindersEnabled=false; saveState(); render(); };
  // weekly digest
  const od=$("#opendigest"); if(od) od.onclick=weeklyDigestModal;
  // theme toggle
  const tt=document.getElementById("theme-toggle"); if(tt) tt.onclick=toggleTheme;
  const pb=document.getElementById("profile-btn"); if(pb) pb.onclick=()=>{state._profileReturn=tab;tab="profile";render();window.scrollTo(0,0);};
  // Stash subsection tabs
  document.querySelectorAll(".stash-sub-btn").forEach(b=>b.onclick=()=>{state._stashSub=b.dataset.sub;renderBody();});
  // Equipment items
  const addEq=document.getElementById("add-equipment"); if(addEq)addEq.onclick=()=>equipmentModal(null);
  document.querySelectorAll(".supply-edit").forEach(b=>b.onclick=()=>{const e=(state.equipmentItems||[]).find(x=>x.id===+b.dataset.id);if(e)equipmentModal(e);});
  document.querySelectorAll(".supply-delete").forEach(b=>b.onclick=()=>confirmAction("Delete this supply and its history?",()=>{state.equipmentItems=(state.equipmentItems||[]).filter(x=>x.id!==+b.dataset.id);saveState();render();}));
  document.querySelectorAll(".supply-log-use").forEach(b=>b.onclick=()=>logSupplyUseModal(+b.dataset.id));
  document.querySelectorAll(".supply-activate-next").forEach(b=>b.onclick=()=>activateNextSupplyUnit(+b.dataset.id));
  document.querySelectorAll(".supply-restock").forEach(b=>b.onclick=()=>restockSupplyModal(+b.dataset.id));
  const tds=$("#toggle-done-supplies"); if(tds) tds.onclick=()=>{state._showDoneSupplies=!state._showDoneSupplies;renderBody();};
  document.querySelectorAll(".ob-check-item").forEach(b=>b.onclick=()=>{
    const items=getOnboardingChecklist();
    const item=items.find(i=>i.key===b.dataset.key);
    if(item&&!item.done&&!item.locked) item.action();
  });
  const openDemo=document.getElementById("open-demo-mode"); if(openDemo) openDemo.onclick=demoPickerModal;
  const fvr=document.getElementById("force-vial-repair"); if(fvr) fvr.onclick=forceVialRepairModal;
  const orc=document.getElementById("open-reconciliation"); if(orc) orc.onclick=inventoryReconciliationModal;
  const lmk=document.getElementById("load-multikit-test"); if(lmk) lmk.onclick=loadMultiKitTestScenario;
  const dra=document.getElementById("dev-reset-all"); if(dra) dra.onclick=devResetAllModal;
  const eds=document.getElementById("export-debug-state");
  if(eds) eds.onclick=()=>{
    try {
      const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `nexus-debug-state-${localDate()}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) { console.error(e); }
  };
  const cds=document.getElementById("copy-debug-state");
  if(cds) cds.onclick=async ()=>{
    try {
      await navigator.clipboard.writeText(JSON.stringify(state,null,2));
      cds.textContent = "✓ Copied"; setTimeout(()=>{ cds.textContent = "📋 Copy to Clipboard"; }, 1500);
    } catch(e) { console.error(e); }
  };
  const nd=document.getElementById("nuke-data"); if(nd) nd.onclick=()=>{
    confirmAction("⚠️ Remove ALL data? This cannot be undone.",()=>{localStorage.removeItem(STORE_KEY);state=migrate(null);tab="home";render();});
  };
  const delBtns=[
    ["del-health-all","Remove all health data (macros, weight, activity, measurements)?",()=>{
      state.macroLogs=[];state.weightLogs=[];state.activityLogs=[];state.measurementLogs=[];
    }],
    ["del-health-imported","Remove all imported health data? Manual entries will be kept.",()=>{
      const isImport=r=>r.sourceType||r.notes?.includes("Apple Health")||r.notes==="Health Auto Export"||r.note==="Apple Health";
      state.macroLogs=state.macroLogs.filter(r=>!isImport(r));
      state.weightLogs=state.weightLogs.filter(r=>!isImport(r));
      state.activityLogs=state.activityLogs.filter(r=>!isImport(r));
      state.measurementLogs=state.measurementLogs.filter(r=>!isImport(r));
    }],
    ["del-activity","Remove all activity & step data?",()=>{state.activityLogs=[];}],
    ["del-doses","Remove all dose history? Protocol structure is kept.",()=>{
      Object.keys(state.peptides).forEach(k=>{if(state.peptides[k])state.peptides[k].doses=[];});
      Object.keys(state.customPeptides||{}).forEach(k=>{if(state.customPeptides[k])state.customPeptides[k].doses=[];});
    }],
    ["del-logs","Remove all daily check-ins?",()=>{state.dailyLogs=[];}],
    ["del-stash","Remove all stash & supply data?",()=>{state.supplies=[];}],
    ["del-workouts","Remove all imported workout sessions?",()=>{state.activityLogs=state.activityLogs.filter(r=>!r.isWorkout);}],
  ];
  delBtns.forEach(([id,msg,fn])=>{
    const el=document.getElementById(id);
    if(el) el.onclick=()=>confirmAction("⚠️ "+msg+" This cannot be undone.",()=>{fn();saveState();render();});
  });
  // quick log
  const nxAddLogToggle=document.getElementById("nx-add-log-toggle");
  if(nxAddLogToggle) nxAddLogToggle.onclick=()=>{
    const menu=document.getElementById("nx-add-log-menu");
    if(!menu)return;
    menu.hidden=!menu.hidden;
    nxAddLogToggle.setAttribute("aria-expanded",String(!menu.hidden));
  };
  document.querySelectorAll(".qa-daily").forEach(b=>b.onclick=()=>dailyModal());
  document.querySelectorAll(".qa-more").forEach(b=>b.onclick=()=>moreLogSheet());
  document.querySelectorAll(".ics-export").forEach(b=>b.onclick=()=>exportICSWithTimePicker(b.dataset.name));
  document.querySelectorAll(".reminder-card").forEach(card=>{
    card.onclick=()=>{
      const action=card.dataset.action||"";
      const [type,name]=action.split("|");
      if(type==="dose"&&name){ doseModal(name); }
      else if(type==="checkin"){ todayLogSheet(); }
      else if(type==="stash"){ tab="stash"; render(); window.scrollTo(0,0); }
      else if(type==="ics"&&name){ exportICSWithTimePicker(name); }
      else if(type==="protocol"&&name){ state._compoundIntel=name; state._intelReturn={tab, _aminoSub:state._aminoSub, _learnSub:state._learnSub, _discoverOpen:state._discoverOpen}; render(); window.scrollTo(0,0); }
    };
  });
  const np=$("#new-protocol"); if(np) np.onclick=()=>protocolBuilderModal();
  const esp=$("#empty-setup-protocol"); if(esp) esp.onclick=()=>{tab="protocols";render();window.scrollTo(0,0);};
  document.querySelectorAll(".proto-activate").forEach(b=>b.onclick=()=>{
    const p=state.protocols?.find(x=>String(x.id)===String(b.dataset.id));
    if(p){p.status="active";saveState();renderBody();}
  });
  document.querySelectorAll(".proto-pause").forEach(b=>b.onclick=()=>{
    const p=state.protocols?.find(x=>String(x.id)===String(b.dataset.id));
    if(p){pauseProtocol(p);saveState();renderBody();}
  });
  document.querySelectorAll(".proto-resume").forEach(b=>b.onclick=()=>{
    const p=state.protocols?.find(x=>String(x.id)===String(b.dataset.id));
    if(p&&p.pausedAt){ resumeProtocol(p); saveState(); renderBody(); }
  });
  document.querySelectorAll(".proto-complete").forEach(b=>b.onclick=()=>confirmAction("Mark protocol as completed?",()=>{
    const p=state.protocols?.find(x=>String(x.id)===String(b.dataset.id));
    if(p){p.status="completed";saveState();renderBody();}
  }, { confirmLabel: "Complete", cancelLabel: "Cancel", tone: "success" }));
  document.querySelectorAll(".proto-log-first").forEach(b=>b.onclick=()=>{
    doseModal(b.dataset.name);
  });
  document.querySelectorAll(".manage-proto-btn").forEach(b=>b.onclick=()=>manageProtocolMenu(b.dataset.id));
  const pcm=$("#pcal-month"); if(pcm) pcm.onclick=()=>{state._protoCalSub="month";renderBody();};
  const pcl=$("#pcal-logs"); if(pcl) pcl.onclick=()=>{state._protoCalSub="logs";renderBody();};
  const cp=$("#cal-prev"); if(cp) cp.onclick=()=>{state._calOff=(state._calOff||0)-1;renderBody();};
  const cn=$("#cal-next"); if(cn) cn.onclick=()=>{state._calOff=(state._calOff||0)+1;renderBody();};
  const calPausedToggle = document.getElementById("cal-show-paused");
  if(calPausedToggle) calPausedToggle.onchange = () => { state._calShowPaused=calPausedToggle.checked; renderBody(); };
  document.querySelectorAll(".cal-day").forEach(b=>b.onclick=()=>{
    document.querySelectorAll(".cal-day").forEach(el=>el.classList.toggle("nexus-cal-selected",el===b));
    const date=b.dataset.date;
    const evs=[];
    const aps2=allPeptides();
    // Same canonical getDayOccurrences() as everywhere else — this is what correctly
    // labels Placenta AM vs PM as separate instances, and surfaces a rescheduled MOTS-c
    // occurrence on its actual EFFECTIVE date rather than only where it was originally
    // logged.
    Object.entries(aps2).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active").forEach(([name,d])=>{
      const slots = getDayOccurrences(d, date).filter(slot => state._calShowPaused || slot.status !== "paused");
      const multi = slots.length>1;
      slots.forEach((s,i)=>{
        const label = multi ? `${name} ${i===0?"AM":i===slots.length-1?"PM":"#"+(i+1)}` : name;
        const unit = cfg(name).unit;
        if (s.status==="taken") evs.push({icon:"✓",text:`${label} — Taken${s.dose.dose?` · ${s.dose.dose}${unit}`:""}${s.dose.site?" · "+s.dose.site:""}`});
        else if (s.status==="skipped") evs.push({icon:"⊘",text:`${label} — Skipped`});
        else if (s.status==="moved") evs.push({icon:"↺",text:`${label} — Moved to another day`});
        else if (s.status==="overdue") evs.push({icon:"✗",text:`${label} — Overdue (was due ${s.time})`});
        else evs.push({icon:"○",text:`${label} — ${date>=localDate()?"Scheduled":"Scheduled · not logged"} ${s.time}`});
      });
    });
    state.dailyLogs.filter(l=>dayKey(l.date)===date).forEach(l=>{const syms=(l.symptoms||[]).map(s=>typeof s==="string"?s:s.name);evs.push({icon:"📋",text:`Check-in · Mood ${l.mood||"-"}${syms.length?" · "+syms.slice(0,3).join(", "):""}${l.notes?" · "+l.notes:""}`});});
    state.weightLogs.filter(l=>dayKey(l.date)===date).forEach(l=>evs.push({icon:"⚖️",text:`Weight: ${l.weight} ${state.settings.weightUnit}`}));
    (state.measurementLogs||[]).filter(l=>dayKey(l.date)===date).forEach(l=>evs.push({icon:"📏",text:`Measurement${l.waist?" · Waist: "+l.waist:""}${l.hips?" · Hips: "+l.hips:""}`}));
    const detail=document.getElementById("cal-day-detail");
    if(detail) detail.innerHTML=evs.length?`<div class="card" style="border-color:#A78BFA22"><div style="font-size:12px;font-weight:600;color:var(--t2);margin-bottom:8px">${fmtDate(date)}</div>${evs.map(e=>`<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--surface-2)"><span>${e.icon}</span><span style="font-size:12px;color:var(--t2)">${esc(e.text)}</span></div>`).join("")}</div>`:"";});
  if(tab==="calendar" && state._protoCalSub!=="logs") {
    const todayButton=document.querySelector(`.cal-day[data-date="${localDate()}"]`);
    if(todayButton) todayButton.click();
  }
  document.querySelectorAll(".proto-edit").forEach(b=>b.onclick=()=>{
    const p=state.protocols?.find(x=>String(x.id)===String(b.dataset.id));
    if(p) protocolBuilderModal(p);
  });
  document.querySelectorAll(".proto-del").forEach(b=>b.onclick=()=>confirmAction("Delete this protocol?",()=>{state.protocols=(state.protocols||[]).filter(p=>String(p.id)!==String(b.dataset.id));saveState();renderBody();}));
  document.querySelectorAll(".plans-sub").forEach(b=>b.onclick=()=>{state._plansSub=b.dataset.sub;renderBody();});
  document.querySelectorAll(".manage-plan-btn").forEach(b=>b.onclick=()=>managePlanItemMenu(b.dataset.type, b.dataset.id));
  const ag=$("#add-goal"); if(ag) ag.onclick=()=>goalModal();
  const eag=$("#empty-add-goal"); if(eag) eag.onclick=()=>goalModal();
  const ar=$("#add-research"); if(ar) ar.onclick=()=>researchModal();
  const ear=$("#empty-add-research"); if(ear) ear.onclick=()=>researchModal();
  const ap=$("#add-protocol"); if(ap) ap.onclick=()=>protocolModal();
  const ash=$("#add-shopping"); if(ash) ash.onclick=()=>shoppingModal();
  const eash=$("#empty-add-shopping"); if(eash) eash.onclick=()=>shoppingModal();
  document.querySelectorAll(".plan-edit").forEach(b=>b.onclick=()=>{
    const {type,id}=b.dataset;
    if(!state.plans) return;
    const item=state.plans[type==="goal"?"goals":type==="research"?"research":type==="protocol"?"protocols":"shopping"]?.find(x=>String(x.id)===String(id));
    if(!item) return;
    if(type==="goal") goalModal(item);
    else if(type==="research") researchModal(item);
    else if(type==="protocol") protocolModal(item);
    else shoppingModal(item);
  });
  document.querySelectorAll(".plan-del").forEach(b=>b.onclick=()=>{const {type,id}=b.dataset,label=type==="goal"?"goal":type==="research"?"research item":"shopping item";confirmAction(`Delete this ${label}?`,()=>{if(!state.plans)return;const key=type==="goal"?"goals":type==="research"?"research":"shopping";state.plans[key]=state.plans[key].filter(x=>String(x.id)!==String(id));saveState();renderBody();});});
  document.querySelectorAll(".qa-weight").forEach(b=>b.onclick=()=>weightModal());
  const qd=$("#today-log-dose"); if(qd) qd.onclick=()=>todayLogDosePicker();
  const nxCustomize=$("#nx-qa-customize");if(nxCustomize)nxCustomize.onclick=nxQuickCustomize;
  document.querySelectorAll("[data-nx-quick]").forEach(b=>b.onclick=()=>nxQuickGo(b.dataset.nxQuick));

  const nxChanges=$("#nx-today-changes"); if(nxChanges)nxChanges.onclick=()=>nxCheckinComparison(14);
  const nxLearnCalc=$("#nx-learn-calc"); if(nxLearnCalc)nxLearnCalc.onclick=nxOpenCalculator;
  const qc=$("#qa-combo"); if(qc) qc.onclick=()=>comboDoseModal();
  const restoreAlerts=$("#restore-dismissed-alerts"); if(restoreAlerts) restoreAlerts.onclick=()=>{
    const count=Object.keys(state.settings.dismissedReminders||{}).length;
    confirmAction(`Restore ${count} dismissed alert${count===1?"":"s"}?`,()=>{state.settings.dismissedReminders={};saveState();render();});
  };
  document.querySelectorAll(".qa-measure").forEach(b=>b.onclick=()=>measureModal());
  document.querySelectorAll(".qa-macro").forEach(b=>b.onclick=()=>macroModal());
  // dose logging
  document.querySelectorAll(".logdose").forEach(b=>b.onclick=()=>doseModal(b.dataset.name, null, b.dataset.occTime||null));
  document.querySelectorAll(".quicklogdose").forEach(b=>b.onclick=()=>quickLogDose(b.dataset.name, b.dataset.occTime||null));
  document.querySelectorAll(".snooze-item").forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); snoozeModal(b.dataset.id); });
  const dismissLV=$("#dismiss-lastvisit"); if(dismissLV) dismissLV.onclick=()=>{ sinceLastVisitSummary=null; render(); };
  document.querySelectorAll(".rescheduledose").forEach(b=>b.onclick=()=>rescheduleDoseModal(b.dataset.name, b.dataset.date));
  document.querySelectorAll(".skipdose").forEach(b=>b.onclick=()=>skipDoseModal(b.dataset.name, b.dataset.date));
  document.querySelectorAll(".resolveoverdue").forEach(b=>b.onclick=()=>resolveOverdueModal(b.dataset.name, b.dataset.date));
  document.querySelectorAll(".whathappened").forEach(b=>b.onclick=()=>resolveOverdueModal(b.dataset.name, b.dataset.date, {takenLateFirst:true}));
  document.querySelectorAll(".undoskip").forEach(b=>b.onclick=()=>{
    const entry = state.peptides[b.dataset.name] || state.customPeptides[b.dataset.name];
    if (!entry || !entry.skips) return;
    entry.skips = entry.skips.filter(s => dayKey(s.date) !== dayKey(b.dataset.date));
    saveState(); render();
  });
  document.querySelectorAll(".compound-intel-btn").forEach(b=>b.onclick=e=>{
    e.stopPropagation();
    // Store full nav context so back button can restore exactly where user came from
    state._intelReturn={tab, _aminoSub:state._aminoSub, _learnSub:state._learnSub, _discoverOpen:state._discoverOpen};
    state._compoundIntel=b.dataset.name;
    tab="trends";
    render();
    window.scrollTo(0,0);
  });
  const backIntel=$("#back-intel"); if(backIntel) backIntel.onclick=()=>{
    const ret=state._intelReturn||{};
    state._compoundIntel=null;
    state._intelReturn=null;
    if(ret.tab) tab=ret.tab;
    if(ret._aminoSub!=null) state._aminoSub=ret._aminoSub;
    if(ret._learnSub!=null) state._learnSub=ret._learnSub;
    if(ret._discoverOpen!=null) state._discoverOpen=ret._discoverOpen;
    render();
    window.scrollTo(0,0);
  };
  const idg=$("#intel-dosing-guide"); if(idg) idg.onclick=()=>{state._compoundIntel=null;tab="amino";state._aminoSub="learn";state._guideOpen=GUIDES.findIndex(g=>g.title.includes("mg, mcg"));render();window.scrollTo(0,0);};
  document.querySelectorAll(".doseretro").forEach(b=>b.onclick=()=>doseRetrospectiveModal(b.dataset.name,b.dataset.id));
  document.querySelectorAll(".view-syringe").forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); syringeDetailModal(b.dataset.syringe); });
  document.querySelectorAll(".use-matching-syringe").forEach(b=>b.onclick=()=>{
    const pd = (state.preparedDoses||[]).find(p=>String(p.id)===b.dataset.id);
    if (pd) administerSyringeModal(pd);
  });
  document.querySelectorAll(".editdose").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name; const id=+b.dataset.id;
    const tgt=PEPTIDES[name]?state.peptides:state.customPeptides;
    const dose=tgt[name]&&tgt[name].doses.find(d=>d.id===id);
    if(dose) doseModal(name,dose);
  });
  document.querySelectorAll(".colorpick").forEach(c=>c.onchange=()=>{
    // onchange (not oninput) is deliberate: oninput fires continuously while dragging the
    // native color picker's spectrum/slider, and renderBody() rebuilds the whole page —
    // including this very <input> element — on every single one of those events. That
    // fights the native picker's own drag tracking, which is exactly what made it feel
    // like the slider "snapped back" instead of following a finger. onchange fires once,
    // when the picker is actually confirmed/dismissed, so dragging stays free and the
    // color only commits at the end.
    const name=c.dataset.name; const builtin=!!PEPTIDES[name];
    const tgt=builtin?state.peptides:state.customPeptides;
    if(!tgt[name]) tgt[name]={status:"active",scheduleDays:cfg(name).defaultSchedule,doses:[]};
    tgt[name].customColor=c.value; saveState(); renderBody();
  });
  document.querySelectorAll(".resetcolor").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name; const builtin=!!PEPTIDES[name];
    const tgt=builtin?state.peptides:state.customPeptides;
    if(tgt[name]) delete tgt[name].customColor; saveState(); renderBody();
  });
  document.querySelectorAll(".deldose").forEach(b=>b.onclick=()=>confirmAction("Delete this dose entry?",()=>{
    const name=b.dataset.name,id=+b.dataset.id,builtin=!!PEPTIDES[name],tgt=builtin?state.peptides:state.customPeptides;
    if(tgt[name]){
      const dose = tgt[name].doses.find(d=>d.id===id);
      if (dose) reverseDoseInventoryEffect(dose);
      tgt[name].doses=tgt[name].doses.filter(d=>d.id!==id);
    }
    saveState();render();
  }));
  document.querySelectorAll(".histtoggle").forEach(b=>b.onclick=()=>{
    const box=document.querySelector(`.histbox[data-name="${CSS.escape(b.dataset.name)}"]`);
    if(box) box.style.display=box.style.display==="none"?"block":"none";
  });
  document.querySelectorAll(".tunetoggle").forEach(b=>b.onclick=()=>{
    const box=document.querySelector(`.tunebox[data-name="${CSS.escape(b.dataset.name)}"]`);
    if(box) box.style.display=box.style.display==="none"?"block":"none";
  });
  document.querySelectorAll(".moremenu").forEach(b=>b.onclick=()=>nxOpenCompoundSheet(b));
  document.querySelectorAll(".tunerange").forEach(r=>r.oninput=()=>{
    const name=r.dataset.name; const days=parseFloat(r.value);
    const builtin=!!PEPTIDES[name]; const tgt=builtin?state.peptides:state.customPeptides;
    if(!tgt[name]) tgt[name]={status:"active",scheduleDays:days,doses:[]};
    tgt[name].scheduleDays=days; saveState();
    const tv=r.closest(".tunebox")?.querySelector(".tuneval"); if(tv) tv.textContent=days+" days";
  });
  document.querySelectorAll(".route-btn").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name, route=b.dataset.route;
    const builtin=!!PEPTIDES[name]; const tgt=builtin?state.peptides:state.customPeptides;
    if(!tgt[name]) tgt[name]={status:"active",scheduleDays:7,doses:[]};
    tgt[name].route = route;
    saveState();
    // In place, same reason as sched-mode-btn below — selecting a route shouldn't collapse
    // the panel you're actively adjusting.
    const box = b.closest(".tunebox");
    if (box) {
      box.querySelectorAll(".route-btn").forEach(rb=>{
        const active = rb.dataset.route===route;
        rb.style.background = active ? "var(--surface-3)" : "transparent";
        rb.style.borderColor = active ? "var(--border)" : "transparent";
        rb.style.color = active ? "var(--t1)" : "var(--t4)";
      });
      const nasalUi = box.querySelector(".route-nasal-ui");
      if (nasalUi) nasalUi.style.display = route==="Nasal" ? "block" : "none";
    }
  });
  document.querySelectorAll(".route-mcgperspray").forEach(inp=>inp.onchange=()=>{
    const name=inp.dataset.name;
    const builtin=!!PEPTIDES[name]; const tgt=builtin?state.peptides:state.customPeptides;
    if(!tgt[name]) return;
    const v = parseFloat(inp.value);
    tgt[name].mcgPerSpray = isNaN(v) ? null : v;
    saveState();
  });
  document.querySelectorAll(".sched-mode-btn").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name, mode=b.dataset.mode;
    const builtin=!!PEPTIDES[name]; const tgt=builtin?state.peptides:state.customPeptides;
    if(!tgt[name]) tgt[name]={status:"active",scheduleDays:7,doses:[]};
    tgt[name].scheduleType = mode;
    if(mode==="weekdays" && !(tgt[name].scheduleWeekdays||[]).length) tgt[name].scheduleWeekdays=[1,3,5]; // sensible default: Mon/Wed/Fri
    saveState();
    // Update in place (no full re-render) so the settings panel stays open
    const box = b.closest(".tunebox");
    if (box) {
      box.querySelectorAll(".sched-mode-btn").forEach(mb=>{
        const active = mb.dataset.mode===mode;
        mb.style.background = active ? "var(--surface-3)" : "transparent";
        mb.style.borderColor = active ? "var(--border)" : "transparent";
        mb.style.color = active ? "var(--t1)" : "var(--t4)";
      });
      const iv=box.querySelector(".sched-interval-ui"), wv=box.querySelector(".sched-weekday-ui");
      if(iv) iv.style.display = mode==="weekdays" ? "none" : "block";
      if(wv) wv.style.display = mode==="weekdays" ? "block" : "none";
      if(mode==="weekdays" && wv) wv.querySelectorAll(".sched-wd-chip").forEach(chip=>{
        const on=(tgt[name].scheduleWeekdays||[]).includes(+chip.dataset.day);
        const cc=cfg(name).color;
        chip.style.background = on ? cc+"22" : "var(--surface-3)";
        chip.style.borderColor = on ? cc : "var(--border)";
        chip.style.color = on ? cc : "var(--t4)";
      });
    }
  });
  document.querySelectorAll(".sched-wd-chip").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name, day=+b.dataset.day;
    const builtin=!!PEPTIDES[name]; const tgt=builtin?state.peptides:state.customPeptides;
    if(!tgt[name]) return;
    const cur=new Set(tgt[name].scheduleWeekdays||[]);
    if(cur.has(day)) cur.delete(day); else cur.add(day);
    if(cur.size===0) return; // require at least one day selected
    tgt[name].scheduleWeekdays=[...cur].sort((a,b)=>a-b);
    saveState();
    const on=cur.has(day), cc=cfg(name).color;
    b.style.background = on ? cc+"22" : "var(--surface-3)";
    b.style.borderColor = on ? cc : "var(--border)";
    b.style.color = on ? cc : "var(--t4)";
  });
  // Multi-dose-per-day controls — writes dosesPerDay/times/doseAmounts directly onto the
  // compound record (data), the same place scheduleDays/scheduleWeekdays already live.
  // This is the actual dosing engine's source of truth; full re-render since the number
  // of time-row inputs changes.
  const getTgt = (name) => { const builtin=!!PEPTIDES[name]; const tgt=builtin?state.peptides:state.customPeptides; if(!tgt[name]) tgt[name]={status:"active",scheduleDays:7,doses:[]}; return tgt[name]; };
  document.querySelectorAll(".dpd-inc").forEach(b=>b.onclick=()=>{
    const t=getTgt(b.dataset.name); t.dosesPerDay=Math.min(4,(t.dosesPerDay||1)+1); saveState(); render();
  });
  document.querySelectorAll(".dpd-dec").forEach(b=>b.onclick=()=>{
    const t=getTgt(b.dataset.name); t.dosesPerDay=Math.max(1,(t.dosesPerDay||1)-1); saveState(); render();
  });
  document.querySelectorAll(".dpd-time-input").forEach(inp=>inp.onchange=()=>{
    const t=getTgt(inp.dataset.name), i=+inp.dataset.i;
    if(!t.times) t.times=getOccurrenceTimes(t);
    t.times[i]=inp.value; saveState();
  });
  document.querySelectorAll(".dpd-amt-input").forEach(inp=>{
    inp.oninput = () => {
      // Live-update the total line as they type, without a full re-render (which would
      // steal focus mid-entry) — reads straight from the sibling inputs' current values,
      // not saved state, so it reflects exactly what's on screen right now.
      const container = inp.closest(".dpd-times-ui");
      const totalEl = container?.querySelector(`[id^="dpd-total-"]`);
      if (totalEl) {
        const unit = cfg(inp.dataset.name).unit;
        const amtInputs = [...container.querySelectorAll(".dpd-amt-input")];
        const n = amtInputs.length;
        const vals = amtInputs.map(x=>x.value.trim());
        const filled = vals.filter(v=>v!=="");
        if (!filled.length) totalEl.innerHTML = `<span style="color:var(--t5)">No per-dose amounts set — each logs independently with whatever you enter at the time.</span>`;
        else {
          const sum = filled.reduce((a,x)=>a+(parseFloat(x)||0),0);
          const parts = vals.map(v=>v!==""?`${v}${unit}`:"?").join(" + ");
          totalEl.innerHTML = filled.length<n
            ? `Total so far: <b style="color:var(--t2)">${sum}${unit}</b> (${filled.length}/${n} set) — ${parts}`
            : `Total daily dose: <b style="color:var(--t2)">${sum}${unit}</b> · split ${parts}`;
        }
      }
    };
    inp.onchange=()=>{
      const t=getTgt(inp.dataset.name), i=+inp.dataset.i;
      if(!t.doseAmounts) t.doseAmounts=[];
      t.doseAmounts[i]=inp.value.trim(); saveState();
    };
  });
  // Protocol phase controls — phases live on the compound record itself (t.phases), the
  // same object dosesPerDay/times/scheduleDays already live on. Toggling ON seeds one
  // phase from whatever the compound's current schedule already is, so switching to
  // phases never silently resets a working schedule.
  document.querySelectorAll(".phases-toggle").forEach(cb=>cb.onchange=()=>{
    const t=getTgt(cb.dataset.name);
    if (cb.checked) {
      if (!t.phases || !t.phases.length) {
        t.phases = [{ durationWeeks:4, dose:(t.doses&&t.doses.length?[...t.doses].sort((a,b)=>new Date(b.date)-new Date(a.date))[0].dose:""), schedule:{ scheduleWeekdays:t.scheduleWeekdays||null, scheduleDays:t.scheduleDays||7, dosesPerDay:t.dosesPerDay||1, times:t.times||["08:00"] } }];
        if (!t.startDate) t.startDate = (t.doses&&t.doses.length) ? dayKey([...t.doses].sort((a,b)=>new Date(a.date)-new Date(b.date))[0].date) : localDate();
      }
    } else {
      t.phases = [];
    }
    saveState(); render();
  });
  document.querySelectorAll(".phase-startdate").forEach(inp=>inp.onchange=()=>{ const t=getTgt(inp.dataset.name); t.startDate=inp.value; saveState(); render(); });
  document.querySelectorAll(".phase-remove").forEach(b=>b.onclick=()=>{ const t=getTgt(b.dataset.name); t.phases.splice(+b.dataset.pi,1); saveState(); render(); });
  document.querySelectorAll(".phase-duration").forEach(inp=>inp.onchange=()=>{ const t=getTgt(inp.dataset.name); t.phases[+inp.dataset.pi].durationWeeks=Math.max(1,parseFloat(inp.value)||4); saveState(); render(); });
  document.querySelectorAll(".phase-rest-toggle").forEach(b=>b.onclick=()=>{ const t=getTgt(b.dataset.name); t.phases[+b.dataset.pi].isRest = b.dataset.rest==="1"; saveState(); render(); });
  document.querySelectorAll(".phase-dose").forEach(inp=>inp.onchange=()=>{ const t=getTgt(inp.dataset.name); t.phases[+inp.dataset.pi].dose=inp.value.trim(); saveState(); });
  document.querySelectorAll(".phase-freq-btn").forEach(b=>b.onclick=()=>{
    const t=getTgt(b.dataset.name), ph=t.phases[+b.dataset.pi];
    if (!ph.schedule) ph.schedule={};
    if (b.dataset.mode==="weekly") { ph.schedule.scheduleWeekdays = ph.schedule.scheduleWeekdays&&ph.schedule.scheduleWeekdays.length ? ph.schedule.scheduleWeekdays : [0]; }
    else { ph.schedule.scheduleWeekdays = null; if(!ph.schedule.scheduleDays) ph.schedule.scheduleDays=1; }
    saveState(); render();
  });
  document.querySelectorAll(".phase-wd-chip").forEach(b=>b.onclick=()=>{
    const t=getTgt(b.dataset.name), ph=t.phases[+b.dataset.pi], day=+b.dataset.day;
    const cur=new Set(ph.schedule.scheduleWeekdays||[]);
    if(cur.has(day)) cur.delete(day); else cur.add(day);
    if(cur.size===0) return;
    ph.schedule.scheduleWeekdays=[...cur].sort((a,b)=>a-b); saveState(); render();
  });
  document.querySelectorAll(".phase-interval").forEach(inp=>inp.onchange=()=>{ const t=getTgt(inp.dataset.name); t.phases[+inp.dataset.pi].schedule.scheduleDays=Math.max(1,parseFloat(inp.value)||1); saveState(); });
  document.querySelectorAll(".phase-dpd-inc").forEach(b=>b.onclick=()=>{ const t=getTgt(b.dataset.name), ph=t.phases[+b.dataset.pi]; ph.schedule.dosesPerDay=Math.min(4,(ph.schedule.dosesPerDay||1)+1); saveState(); render(); });
  document.querySelectorAll(".phase-dpd-dec").forEach(b=>b.onclick=()=>{ const t=getTgt(b.dataset.name), ph=t.phases[+b.dataset.pi]; ph.schedule.dosesPerDay=Math.max(1,(ph.schedule.dosesPerDay||1)-1); saveState(); render(); });
  document.querySelectorAll(".phase-time").forEach(inp=>inp.onchange=()=>{
    const t=getTgt(inp.dataset.name), ph=t.phases[+inp.dataset.pi], ti=+inp.dataset.ti;
    if(!ph.schedule.times) ph.schedule.times=[];
    ph.schedule.times[ti]=inp.value; saveState();
  });
  document.querySelectorAll(".phase-add").forEach(b=>b.onclick=()=>{
    const t=getTgt(b.dataset.name);
    const last=t.phases[t.phases.length-1];
    t.phases.push({ durationWeeks:4, dose:last?.dose||"", schedule: last?.schedule ? JSON.parse(JSON.stringify(last.schedule)) : {scheduleDays:7,dosesPerDay:1,times:["08:00"]} });
    saveState(); render();
  });
  // home filters
  // Scroll position is preserved across these re-renders — they're filters/expansion
  // within the same page, not navigation to a different screen, so jumping to the top
  // would be jarring and wrong.
  const preserveScroll = (fn) => { const y = window.scrollY; fn(); requestAnimationFrame(()=>window.scrollTo(0,y)); };
  const weekToggle=$("#week-toggle"); if(weekToggle) weekToggle.onclick=()=>preserveScroll(()=>{ state._weekExpanded=!state._weekExpanded; render(); });
  document.querySelectorAll(".hv-nav").forEach(b=>b.onclick=()=>preserveScroll(()=>{ state._homeView=b.dataset.view; saveState(); render(); }));
  // History is a direct action: expand and reveal records in one tap, without the ellipsis.
  document.querySelectorAll(".nx-open-compound-history").forEach(el=>el.onclick=()=>preserveScroll(()=>{
    if (!(state._todayExpandedCompounds instanceof Set)) state._todayExpandedCompounds = new Set();
    const name=el.dataset.name, view=el.dataset.view||"active";
    state._todayExpandedCompounds.add(view+"::"+name);
    render();
    const historyToggle=Array.from(document.querySelectorAll(".histtoggle")).find(b=>b.dataset.name===name);
    if(historyToggle){
      const box=Array.from(document.querySelectorAll(".histbox")).find(b=>b.dataset.name===name);
      if(box && box.style.display==="none") historyToggle.click();
      if(box) box.scrollIntoView({block:"nearest",behavior:"smooth"});
    }
  }));
  document.querySelectorAll(".compound-compact-tap").forEach(el=>el.onclick=()=>preserveScroll(()=>{
    if (!(state._todayExpandedCompounds instanceof Set)) state._todayExpandedCompounds = new Set();
    const n = el.dataset.name, v = el.dataset.view||"active";
    // Expansion key includes the VIEW the card was tapped in — "upcoming::Retatrutide" is
    // independent from "active::Retatrutide". Opening one never opens or closes the other,
    // and never closes any other compound within the same view either.
    const key = v+"::"+n;
    if (state._todayExpandedCompounds.has(key)) state._todayExpandedCompounds.delete(key);
    else state._todayExpandedCompounds.add(key);
    render();
  }));
  document.querySelectorAll(".compound-collapse-btn").forEach(el=>el.onclick=()=>preserveScroll(()=>{
    const v = el.dataset.view||"active";
    if (state._todayExpandedCompounds instanceof Set) state._todayExpandedCompounds.delete(v+"::"+el.dataset.name);
    render();
  }));
  document.querySelectorAll(".upcoming-row").forEach(el=>el.onclick=()=>preserveScroll(()=>{
    // Only the Today "Upcoming preview" strip still uses this row style — the full
    // Upcoming view now renders real expandable cards (see renderUpcomingFullView).
    // Tapping a preview row navigates into Upcoming AND pre-expands that compound there,
    // in Upcoming's own expansion context — never Active's.
    if (!(state._todayExpandedCompounds instanceof Set)) state._todayExpandedCompounds = new Set();
    state._todayExpandedCompounds.add("upcoming::"+el.dataset.name);
    state._homeView = "upcoming";
    render();
  }));
  const viewUp=$("#view-upcoming"); if(viewUp) viewUp.onclick=()=>preserveScroll(()=>{ state._homeView="upcoming"; render(); });
  document.querySelectorAll(".all-status-chip").forEach(b=>b.onclick=()=>preserveScroll(()=>{ state._allStatusFilter=b.dataset.status; saveState(); render(); }));
  // pause/resume/delete compound
  document.querySelectorAll(".pausepep").forEach(b=>b.onclick=()=>{
    const n=b.dataset.name,builtin=!!PEPTIDES[n],tgt=builtin?state.peptides:state.customPeptides;
    if(tgt[n]){tgt[n].status="paused";saveState();render();}
  });
  document.querySelectorAll(".resumepep").forEach(b=>b.onclick=()=>{
    const n=b.dataset.name,builtin=!!PEPTIDES[n],tgt=builtin?state.peptides:state.customPeptides;
    if(tgt[n]){tgt[n].status="active";saveState();render();}
  });
  // today sheet
  document.querySelectorAll(".opentodaysheet").forEach(b=>b.onclick=()=>{
    const log=state.dailyLogs.find(l=>l.id===+b.dataset.id); if(log) todayLogSheet(log);
  });
  document.querySelectorAll(".editdaily").forEach(b=>b.onclick=()=>dailyModal(state.dailyLogs.find(l=>l.id===+b.dataset.id)));
  document.querySelectorAll(".deldaily").forEach(b=>b.onclick=()=>confirmAction("Delete this check-in?",()=>{state.dailyLogs=state.dailyLogs.filter(l=>l.id!==+b.dataset.id);saveState();render();}));
  document.querySelectorAll(".edit-update").forEach(b=>b.onclick=()=>{
    const uid2=+b.dataset.uid, lid=+b.dataset.lid;
    const entry=state.dailyLogs.find(l=>l.id===lid);
    const update=entry&&(entry.updates||[]).find(u=>u.id===uid2);
    if(update){ closeModal(); editUpdateModal(entry,update); }
  });
  document.querySelectorAll(".del-update").forEach(b=>b.onclick=()=>{
    const uid2=+b.dataset.uid, lid=+b.dataset.lid;
    const entry=state.dailyLogs.find(l=>l.id===lid);
    if(entry){entry.updates=(entry.updates||[]).filter(u=>u.id!==uid2);saveState();render();}
  });
  // weight/measure/macro edit+delete
  document.querySelectorAll(".editweight").forEach(b=>b.onclick=()=>weightModal(state.weightLogs.find(w=>w.id===+b.dataset.id)));
  document.querySelectorAll(".editmeasure").forEach(b=>b.onclick=()=>measureModal(state.measurementLogs.find(m=>m.id===+b.dataset.id)));
  document.querySelectorAll(".editmacro").forEach(b=>b.onclick=()=>macroModal(null,state.macroLogs.find(m=>m.id===+b.dataset.id)));
  document.querySelectorAll(".delmacro").forEach(b=>b.onclick=()=>{state.macroLogs=state.macroLogs.filter(m=>m.id!==+b.dataset.id);saveState();render();});
  document.querySelectorAll(".delmeasure").forEach(b=>b.onclick=()=>confirmAction("Delete this measurement?",()=>{state.measurementLogs=state.measurementLogs.filter(m=>m.id!==+b.dataset.id);saveState();render();}));
  document.querySelectorAll(".delweight").forEach(b=>b.onclick=()=>confirmAction("Delete this weight entry?",()=>{state.weightLogs=state.weightLogs.filter(w=>w.id!==+b.dataset.id);saveState();render();}));
  // stash
  const av=$("#addvial"); if(av)av.onclick=()=>supplyModal();
  const qaAdd=$("#qa-addkit"); if(qaAdd) qaAdd.onclick=()=>supplyModal(null);
  const qaPrep=$("#qa-prepare"); if(qaPrep) qaPrep.onclick=prepareChoiceModal;
  const qaPlan=$("#qa-planner"); if(qaPlan) qaPlan.onclick=()=>supplyPlannerModal();
  const opl=$("#open-prepared-list"); if(opl) opl.onclick=preparedListModal;
  document.querySelectorAll(".inv-notice-action").forEach(b=>b.onclick=()=>{
    const kind=b.dataset.kind, name=b.dataset.name, kitId=b.dataset.kit;
    if (kind==="openvial") { const k=state.supplies.find(s=>String(s.id)===kitId); if(k) reconstituteVialModal(k); }
    else if (kind==="review") { const k=state.supplies.find(s=>String(s.id)===kitId); if(k) supplyModal(k); }
    else if (kind==="coverage") supplyPlannerModal("protocol");
  });
  const sfb=document.getElementById("stash-filter-btn"); if(sfb) sfb.onclick=stashFilterModal;
  document.querySelectorAll(".phase-bar-seg").forEach(b=>b.onclick=()=>phaseRoadmapModal(isNaN(+b.dataset.proto)?b.dataset.proto:+b.dataset.proto, b.dataset.comp));
  const ssb=document.getElementById("stash-sort-btn"); if(ssb) ssb.onclick=stashSortModal;
  document.querySelectorAll(".opennewvial").forEach(b=>b.onclick=()=>openNewVialModal(+b.dataset.id));
  document.querySelectorAll(".log-blend-dose").forEach(b=>b.onclick=()=>logBlendDoseModal(+b.dataset.id));
  document.querySelectorAll(".logwaste").forEach(b=>b.onclick=()=>logWasteModal(+b.dataset.id));
  const tdk=$("#toggle-done-kits"); if(tdk) tdk.onclick=()=>{state._showDoneKits=!state._showDoneKits;renderBody();};
  document.querySelectorAll(".finishvial").forEach(b=>b.onclick=()=>finishVialModal(+b.dataset.id));
  document.querySelectorAll(".vial-actions-btn").forEach(b=>b.onclick=()=>vialActionsMenu(+b.dataset.kit, +b.dataset.vial));
  document.querySelectorAll(".manage-kit-btn").forEach(b=>b.onclick=()=>manageKitMenu(+b.dataset.id));
  document.querySelectorAll(".markkitdone").forEach(b=>b.onclick=()=>markKitDoneModal(+b.dataset.id));
  document.querySelectorAll(".reopenkit").forEach(b=>b.onclick=()=>{
    const kit=state.supplies.find(s=>s.id===+b.dataset.id); if(!kit) return;
    kit.kitStatus=null; saveState(); renderBody();
  });
  document.querySelectorAll(".editsupply").forEach(b=>b.onclick=()=>{
    const kit = state.supplies.find(s=>s.id===+b.dataset.id);
    if (!kit) return;
    // supplyModal has no concept of isBlend at all — its compound dropdown is for a new
    // single-compound kit and doesn't even include blend names, so a blend kit opened
    // there had nowhere sensible to go. Route to the blend editor instead.
    if (kit.isBlend) addBlendKitModal(kit); else supplyModal(kit);
  });
  document.querySelectorAll(".reconkit").forEach(b=>b.onclick=()=>{ const kit=state.supplies.find(s=>s.id===+b.dataset.id); if(kit) reconstituteVialModal(kit); });
  document.querySelectorAll(".outflow-history-toggle").forEach(b=>b.onclick=()=>{
    const body = document.querySelector(`.outflow-history-body[data-id="${b.dataset.id}"]`);
    if (body) body.style.display = body.style.display==="none" ? "block" : "none";
  });
  document.querySelectorAll(".edit-outflow").forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); editOutflowModal(+b.dataset.kit, +b.dataset.tx); });
  document.querySelectorAll(".undo-outflow").forEach(b=>b.onclick=(e)=>{ e.stopPropagation(); undoOutflowModal(+b.dataset.kit, +b.dataset.tx); });
  document.querySelectorAll(".preparedoses").forEach(b=>b.onclick=()=>prepareDosesModal(b.dataset.name));
  document.querySelectorAll(".toggleactivekit").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.id;
    const kit=state.supplies.find(s=>s.id===id); if(!kit) return;
    const willActivate=!kit.activeKit;
    if (!willActivate) { kit.activeKit=false; saveState(); render(); return; }
    // Multiple simultaneously-active kits per compound is now supported by choice —
    // confirm rather than silently retiring whatever else is currently open, same rule as
    // every other "open a vial" entry point.
    confirmOpenIfOtherKitOpen(kit, () => { kit.activeKit=true; saveState(); render(); });
  });
  document.querySelectorAll(".delsupply").forEach(b=>b.onclick=()=>confirmAction("Delete this kit?",()=>{
    const s=state.supplies.find(x=>x.id===+b.dataset.id);
    if(s){const othersExist=state.supplies.filter(x=>x.id!==+b.dataset.id&&x.name===s.name).length>0;if(!othersExist){if(state.peptides[s.name])state.peptides[s.name].status="archived";else if(state.customPeptides[s.name])state.customPeptides[s.name].status="archived";}}
    state.supplies=state.supplies.filter(x=>x.id!==+b.dataset.id);saveState();render();
  }));
  // calendar
  const csw=$("#cs-week"); if(csw)csw.onclick=()=>{state._calSub="week";render();};
  const csm=$("#cs-month"); if(csm)csm.onclick=()=>{state._calSub="month";render();};
  const csl=$("#cs-logs"); if(csl)csl.onclick=()=>{state._calSub="logs";render();};
  const mp=$("#mprev"); if(mp)mp.onclick=()=>{state._monthOff=(state._monthOff||0)-1;render();};
  const mn=$("#mnext"); if(mn)mn.onclick=()=>{if((state._monthOff||0)<0){state._monthOff=(state._monthOff||0)+1;render();}};
  const mt=$("#mtoday"); if(mt)mt.onclick=()=>{state._monthOff=0;render();};
  const wp=$("#wp-prev"); if(wp)wp.onclick=()=>{state._weekOff=(state._weekOff||0)-1;render();};
  const wn=$("#wp-next"); if(wn)wn.onclick=()=>{if((state._weekOff||0)<0){state._weekOff=(state._weekOff||0)+1;render();}};
  for(const period of["1M","3M","6M","all"]) { const b=document.getElementById("wp-"+period); if(b)b.onclick=()=>{state._weightPeriod=period;renderBody();}; }
  for(const period of["1M","3M","6M","all"]) { const b=document.getElementById("hp-"+period); if(b)b.onclick=()=>{state._healthPeriod=period;renderBody();}; }
  document.querySelectorAll('[data-nx-body-tab]').forEach(b=>b.onclick=()=>{
    state._nxBodyTab=b.dataset.nxBodyTab;
    renderBody();
  });
  const nxMeasureRoot=document.querySelector('.nx-md');
  if(nxMeasureRoot)nxMeasureRoot.onclick=e=>{
    const btn=e.target.closest('[data-nx-measure]');
    if(!btn)return;
    state._nxSelectedMeasure=btn.dataset.nxMeasure;
    nxMeasureRoot.outerHTML=nxMeasurementDashboard(state.measurementLogs,state.settings.measureUnit,state._weightPeriod||"all",state._nxSelectedMeasure);
    const nextRoot=document.querySelector('.nx-md');
    if(nextRoot)nextRoot.onclick=nxMeasureRoot.onclick;
  };
  document.querySelectorAll(".chart-tap").forEach(el=>el.onclick=()=>chartDetailModal(el.dataset.kind, el.dataset.period));
  document.querySelectorAll(".nx-trends-open-detail").forEach(b=>b.onclick=()=>nxTrendsDetail(b.dataset.name,b.dataset.kind));
  // calendar day taps + tooltips
  document.querySelectorAll(".calday").forEach(b=>b.onclick=()=>dayDetailModal(b.dataset.date));
  wireCalTips();
  // trends accordion
  const nxPatternButton=document.getElementById("nx-open-pattern");
  if(nxPatternButton)nxPatternButton.onclick=nxPatternExplorer;
  const nxTimingButton=document.getElementById("nx-open-symptom-timing");
  if(nxTimingButton)nxTimingButton.onclick=nxSymptomTimingExplorer;
  const nxManageHealth=document.getElementById("nx-health-manage");
  if(nxManageHealth)nxManageHealth.onclick=()=>{state._settingsDetail="health";state._profileTab="settings";state._profileReturn="trends";tab="profile";render();window.scrollTo(0,0);};
  const nxLibraryJump=document.querySelector(".nx-trends-library-jump");
  if(nxLibraryJump)nxLibraryJump.onclick=()=>document.getElementById("nx-compound-library")?.scrollIntoView({behavior:"smooth",block:"start"});
  const nxLibrarySearch=document.getElementById("nx-library-search");
  if(nxLibrarySearch){
    nxLibrarySearch.oninput=()=>{
      state._nxHistoryQuery=nxLibrarySearch.value;
      const q=nxLibrarySearch.value.trim().toLocaleLowerCase();
      let shown=0;
      document.querySelectorAll(".nx-library-item").forEach(b=>{const match=b.dataset.nxCompound.toLocaleLowerCase().includes(q);b.hidden=!match;if(match)shown++;});
      const empty=document.getElementById("nx-library-empty");if(empty)empty.remove();
      if(!shown)document.getElementById("nx-library-list")?.insertAdjacentHTML("beforeend",'<div class="nx-library-empty" id="nx-library-empty">No matching compounds.</div>');
    };
    nxLibrarySearch.dispatchEvent(new Event("input"));
  }
  document.querySelectorAll(".nx-library-item").forEach(b=>b.onclick=()=>{state._nxHistorySelected=b.dataset.nxCompound;renderBody();document.getElementById("nx-compound-library")?.scrollIntoView({block:"start"});});
  const nxLibraryBack=document.getElementById("nx-library-back");
  if(nxLibraryBack)nxLibraryBack.onclick=()=>{state._nxHistorySelected=null;renderBody();document.getElementById("nx-compound-library")?.scrollIntoView({block:"start"});};

  document.querySelectorAll(".nx-trends-go").forEach(b=>b.onclick=()=>{
    const key=b.dataset.key;
    const ns={...(state._trendsOpen||{})};
    ns[key]=true;state._trendsOpen=ns;
    renderBody();
    const target=[...document.querySelectorAll(".app-acc>.tacc")].find(x=>x.dataset.key===key);
    target?.scrollIntoView({behavior:window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches?"auto":"smooth",block:"start"});
    target?.focus({preventScroll:true});
  });
  document.querySelectorAll(".tacc").forEach(b=>b.onclick=()=>{
    // Preserve native <details> ancestors while rebuilding nested chart content.
    // Otherwise the first click opens the sub-chart but closes its parent.
    const parentDetails=[...document.querySelectorAll(".nx-compound-card")].map(card=>({
      name:card.getAttribute("aria-label"),
      open:[...card.querySelectorAll(":scope > details.nx-compound-details")].map(d=>d.open)
    }));
    const scrollYBefore=window.scrollY;
    const focusKey=b.dataset.key;
    const ns={...(state._trendsOpen||{})};
    ns[focusKey]=!ns[focusKey];
    state._trendsOpen=ns;
    renderBody();
    document.querySelectorAll(".nx-compound-card").forEach(card=>{
      const saved=parentDetails.find(p=>p.name===card.getAttribute("aria-label"));
      if(!saved)return;
      [...card.querySelectorAll(":scope > details.nx-compound-details")].forEach((d,i)=>{d.open=!!saved.open[i];});
    });
    window.scrollTo({top:scrollYBefore,behavior:"instant"});
    const focused=[...document.querySelectorAll(".tacc")].find(x=>x.dataset.key===focusKey);
    focused?.focus({preventScroll:true});
  });
  document.querySelectorAll(".insights-tab").forEach(b=>b.onclick=()=>{ state._insightsCompound = b.dataset.compound || null; renderBody(); });
  document.querySelectorAll(".why-date-btn").forEach(b=>b.onclick=()=>whyDateModal(b.dataset.date));
  document.querySelectorAll(".phaseinfo").forEach(b=>b.onclick=()=>{
    const phaseId=b.dataset.phaseid, compound=b.dataset.compound;
    const phases=compound?cfg(compound).phases:null;
    const phase=phases&&phases.find(p=>p.id===phaseId);
    if(phase) phaseDetailModal(phase);
  });
  document.querySelectorAll(".symtf").forEach(b=>b.onclick=()=>{state._symptomTF=b.dataset.tf;renderBody();});
  document.querySelectorAll(".medlvl-tf").forEach(b=>b.onclick=()=>{state._medLevelTF=b.dataset.tf;renderBody();});
  document.querySelectorAll(".metricinfo").forEach(b=>b.onclick=()=>{
    openModal(`<div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:8px">${esc(b.dataset.title)}</div><div style="font-size:13px;color:var(--t2);line-height:1.6">${esc(b.dataset.text)}</div>`,"#8AB4FF");
    document.querySelector(".modal").style.maxWidth="280px";
  });
  const pkm=$("#pkinfo"); if(pkm)pkm.onclick=pkMethodologyModal;
  document.querySelectorAll(".pkinfo").forEach(b=>b.onclick=pkMethodologyModal);
  // learn/nexus
  const lsg=$("#ls-guides"); if(lsg)lsg.onclick=()=>{state._learnSub="guides";state._discoverSearch="";state._discoverFilter="";state._recon={vialMg:"",bacMl:"",dose:"",unit:"mg",freq:"daily",syringe:"100u"};renderBody();};
  const lsm=$("#ls-mixing"); if(lsm)lsm.onclick=()=>{state._learnSub="mixing";state._recon={vialMg:"",bacMl:"",dose:"",unit:"mg",freq:"daily",syringe:"100u"};renderBody();};
  const lsc=$("#ls-calc"); if(lsc)lsc.onclick=()=>{state._learnSub="calc";renderBody();};
  if(state._learnSub==="calc") wireReconCalc();
  const mixb=$("#mixback"); if(mixb)mixb.onclick=()=>{state._learnSub="guides";renderBody();};
  const mis=$("#mix-search"); if(mis)mis.oninput=()=>{state._mixSearch=mis.value;renderBody();const n=$("#mix-search");if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}};
  document.querySelectorAll(".mix-type-chip").forEach(b=>b.onclick=()=>{state._mixTypeFilter=b.dataset.t;renderBody();});
  const lsd=$("#ls-discover"); if(lsd)lsd.onclick=()=>{state._learnSub="discover";renderBody();};
  document.querySelectorAll(".discitem").forEach(b=>b.onclick=()=>{
    const n=b.dataset.name;
    state._discoverOpen=n;
    // Recently Viewed — most-recent-first, capped at 8, deduped. Settled/persisted state
    // (not session-only) since this is exactly the kind of "remembered where I was
    // browsing" preference worth keeping across visits.
    if (!state.settings.recentDiscoverViews) state.settings.recentDiscoverViews=[];
    state.settings.recentDiscoverViews = [n, ...state.settings.recentDiscoverViews.filter(x=>x!==n)].slice(0,8);
    saveState();
    render(); window.scrollTo(0,0);
  });
  const bd=$("#backdisc"); if(bd)bd.onclick=()=>{state._discoverOpen=null;renderBody();window.scrollTo(0,0);};
  const ds=$("#disc-search"); if(ds)ds.oninput=()=>{ state._discoverSearch=ds.value; renderBody(); const ns=$("#disc-search"); if(ns){ns.focus();ns.setSelectionRange(ns.value.length,ns.value.length);} };
  const dc=$("#disc-clear"); if(dc)dc.onclick=()=>{ state._discoverSearch=""; renderBody(); const ns=$("#disc-search"); if(ns)ns.focus(); };
  document.querySelectorAll(".disc-filter").forEach(b=>b.onclick=()=>{state._discoverFilter=b.dataset.cat;renderBody();});
  document.querySelectorAll(".disc-track").forEach(b=>b.onclick=()=>{ initCompoundTracking(b.dataset.name); saveState(); render(); });
  document.querySelectorAll(".disc-track-blend").forEach(b=>b.onclick=()=>addBlendKitModal(b.dataset.name));
  document.querySelectorAll(".disc-remove").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name;
    openModal(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-size:14px;font-weight:600;color:var(--t1)">Remove from stack?</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
      <div style="font-size:13px;color:var(--t3);margin-bottom:18px;line-height:1.6"><b>${esc(name)}</b> will be hidden from Today and Trends. Your dose history is preserved — you can re-add it anytime from Discover.</div>
      <div style="display:flex;gap:8px">
        <button id="rm-cancel" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t3);font-size:13px">Cancel</button>
        <button id="rm-confirm" data-name="${esc(name)}" style="flex:1;padding:11px;border-radius:10px;background:#ff4d4d18;border:1px solid #ff4d4d44;color:#ff7c7c;font-size:13px;font-weight:600">Remove</button>
      </div>`,"#ff7c7c");
    document.querySelector(".modal #x").onclick=closeModal;
    document.querySelector(".modal #rm-cancel").onclick=closeModal;
    document.querySelector(".modal #rm-confirm").onclick=()=>{
      const n=document.querySelector(".modal #rm-confirm").dataset.name;
      if(state.peptides[n]) state.peptides[n].status="archived";
      else if(state.customPeptides[n]) state.customPeptides[n].status="archived";
      saveState(); closeModal(); render();
    };
  });
  document.querySelectorAll(".archivepep").forEach(b=>b.onclick=()=>{
    const n=b.dataset.name;
    confirmAction(`Remove ${n} from Today?`,()=>{
      if(state.peptides[n]) state.peptides[n].status="archived";
      else if(state.customPeptides[n]) state.customPeptides[n].status="archived";
      saveState(); render();
    });
  });
  const addcust=$("#add-custom-compound"); if(addcust) addcust.onclick=()=>{
    // Compounds in LIBRARY not yet in stack
    const inStack = new Set(Object.keys(allPeptides()));
    const available = LIBRARY.filter(l=>!l.blend).map(l=>l.name).filter(n=>!inStack.has(n)).sort();
    openModal(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">ADD COMPOUND</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:12px;color:var(--t4);margin-bottom:14px;line-height:1.5">Add a compound to track. For best results, add it to <b style="color:var(--t2)">Stash → Add Kit</b> first — that links tracking to your inventory automatically.</div>
    <label class="field-label">COMPOUND</label>
    <select id="cc-name" class="inp" style="margin-bottom:4px">
      <option value="">— select or type below —</option>
      ${available.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join("")}
      <option value="__custom__">✏ Enter custom name…</option>
    </select>
    <input id="cc-custom" class="inp" placeholder="Custom compound name" style="margin-bottom:14px;display:none">
    <div style="display:flex;gap:10px;margin-bottom:18px">
      <div style="flex:1"><label class="field-label">DOSE UNIT</label>
        <select id="cc-unit" class="inp"><option>mg</option><option>mcg</option><option>IU</option><option>ml</option></select>
      </div>
      <div style="flex:1"><label class="field-label">SCHEDULE (days)</label>
        <input id="cc-sched" type="number" class="inp" value="7" min="1" max="90">
      </div>
    </div>
    <button id="cc-save" class="btn-primary" style="background:#A78BFA">Add to Stack</button>`,"#A78BFA");
    document.querySelector(".modal #x").onclick=closeModal;
    // Show/hide custom input
    document.querySelector(".modal #cc-name").onchange=()=>{
      const v=document.querySelector(".modal #cc-name").value;
      const ci=document.querySelector(".modal #cc-custom");
      ci.style.display=v==="__custom__"?"block":"none";
      if(v==="__custom__") ci.focus();
    };
    document.querySelector(".modal #cc-save").onclick=()=>{
      const sel=document.querySelector(".modal #cc-name").value;
      const name=(sel==="__custom__"?document.querySelector(".modal #cc-custom").value:sel).trim();
      if(!name||name==="— select or type below —"){document.querySelector(".modal #cc-name").style.borderColor="#ff7c7c";return;}
      const unit=document.querySelector(".modal #cc-unit").value;
      const sched=parseInt(document.querySelector(".modal #cc-sched").value)||7;
      // If it's a known PEPTIDES compound, initialize it properly
      if(PEPTIDES[name]){ state.peptides[name]={ status:"active", scheduleDays:PEPTIDES[name].defaultSchedule, doses:[] }; }
      else { state.customPeptides[name]={ status:"active", scheduleDays:sched, doses:[], unit }; }
      saveState(); closeModal(); render();
    };
  };
  document.querySelectorAll(".guideitem").forEach(b=>b.onclick=()=>{state._guideOpen=+b.dataset.i;render();window.scrollTo(0,0);});
  const bg=$("#backguide"); if(bg)bg.onclick=()=>{state._guideOpen=null;renderBody();window.scrollTo(0,0);};
  // profile
  const ep=$("#editprofile"); if(ep)ep.onclick=profileModal;
  document.querySelectorAll(".profile-subtab").forEach(b=>b.onclick=()=>{ state._profileTab=b.dataset.tab; state._settingsDetail=null; render(); window.scrollTo(0,0); });
  document.querySelectorAll(".settings-row").forEach(b=>b.onclick=()=>{
    const key=b.dataset.detail;
    if (key==="onboarding") { state.profile.onboardingDone=false; showOnboarding(); return; }
    state._settingsDetail=key; render(); window.scrollTo(0,0);
  });
  const sdBack=$("#settings-detail-back"); if(sdBack) sdBack.onclick=()=>{ state._settingsDetail=null; render(); window.scrollTo(0,0); };
  const muToggle=$("#munit-toggle"); if(muToggle) muToggle.onclick=()=>{ state.settings.measureUnit=state.settings.measureUnit==="in"?"cm":"in"; saveState(); render(); };
  const suppSearch=$("#supp-search");
  if(suppSearch){ suppSearch.oninput=()=>{ state._supplementSearch=suppSearch.value; renderBody(); const n=$("#supp-search"); if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);} }; }
  const ep2=$("#editprofile2"); if(ep2)ep2.onclick=profileModal;
  const auBack=$("#au-back"); if(auBack) auBack.onclick=()=>{ state._settingsDetail=null; render(); window.scrollTo(0,0); };
  document.querySelectorAll(".au-tab").forEach(b=>b.onclick=()=>{ state._appUpdatesTab=b.dataset.tab; render(); });
  // data
  const ex=$("#exp"); if(ex)ex.onclick=exportData;
  const im=$("#imp"); if(im)im.onchange=importData;
  const imh=$("#imp-health"); if(imh)imh.onclick=()=>healthModal();
  const wu=$("#wunit"); if(wu)wu.onclick=()=>{state.settings.weightUnit=state.settings.weightUnit==="lbs"?"kg":"lbs";saveState();render();};
  const dro=$("#dayrollover"); if(dro)dro.onchange=()=>{ const h=parseInt(dro.value,10); state.settings.dayRolloverHour=(h>0&&h<=12)?h:0; saveState(); render(); };
}

// ── Onboarding ────────────────────────────────────────────────────────────────
function appUpdatesView() {
  const tabKey = state._appUpdatesTab || "whatsnew";
  const knownIssues = APP_ISSUES.filter(i=>i.status!=="Fixed");
  const fixedIssues = [...APP_ISSUES.filter(i=>i.status==="Fixed")].sort((a,b)=>(b.fixedVersion||0)-(a.fixedVersion||0));

  // Opening What's New marks the current release as seen — Known Issues never gets this
  // treatment since a status can change later and shouldn't silently look "already read".
  if (tabKey === "whatsnew" && (state.settings.lastSeenChangelog||0) < CURRENT_CHANGELOG_VERSION) {
    state.settings.lastSeenChangelog = CURRENT_CHANGELOG_VERSION; saveState();
  }

  const tabBtn = (key,label,count) => `<button class="au-tab" data-tab="${key}" style="flex:1;padding:10px 6px;border-radius:9px;font-size:12px;font-weight:600;background:${tabKey===key?"var(--surface-3)":"transparent"};border:1px solid ${tabKey===key?"var(--border)":"transparent"};color:${tabKey===key?"var(--t1)":"var(--t4)"}">${label}${count?` <span style="color:${tabKey===key?"var(--t3)":"var(--t5)"}">${count}</span>`:""}</button>`;

  let content;
  if (tabKey === "whatsnew") {
    content = CHANGELOG.map((entry,i)=>`
      <div style="margin-bottom:20px;${i<CHANGELOG.length-1?"padding-bottom:20px;border-bottom:1px solid var(--border-sub)":""}">
        <div class="mono" style="font-size:10px;color:#A78BFA;letter-spacing:1.5px;margin-bottom:2px">${esc((entry.date||"").toUpperCase())} · V${entry.version}</div>
        <div style="font-size:15px;font-weight:700;color:var(--t1);margin-bottom:10px">${esc(entry.title)}</div>
        ${entry.items.map(it=>`<div style="display:flex;gap:10px;margin-bottom:10px">
          <div style="font-size:15px;flex-shrink:0;line-height:1.4">${it.icon}</div>
          <div><div style="font-size:13px;font-weight:600;color:var(--t2);margin-bottom:2px">${esc(it.title)}</div>
          <div style="font-size:11.5px;color:var(--t4);line-height:1.5">${esc(it.desc)}</div></div>
        </div>`).join("")}
      </div>`).join("");
  } else if (tabKey === "fixed") {
    content = fixedIssues.length ? fixedIssues.map(iss=>`
      <div style="padding:12px 0;border-bottom:1px solid var(--border-sub)">
        <div style="color:#7DF9C0;font-size:11px;font-weight:700;letter-spacing:0.5px;margin-bottom:4px">✓ FIXED</div>
        <div style="font-size:13px;font-weight:600;color:var(--t1);margin-bottom:2px">${esc(iss.title)}</div>
        <div style="font-size:10.5px;color:var(--t5);margin-bottom:6px">${esc(iss.area)} · ${esc(iss.fixedDate||iss.reportedDate)}</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.5;margin-bottom:4px">${esc(iss.description)}</div>
        ${iss.fixedVersion?`<div style="font-size:10.5px;color:var(--t5)">Fixed in v${iss.fixedVersion}</div>`:""}
      </div>`).join("") : `<div style="text-align:center;padding:30px 0;color:var(--t4);font-size:12px">No fixes to show yet.</div>`;
  } else {
    content = knownIssues.length ? knownIssues.map(iss=>{
      const statusColor = {"Investigating":"var(--t4)","Identified":"#F9C87D","Fix in progress":"#8AB4FF"}[iss.status] || "var(--t4)";
      return `<div style="padding:12px 0;border-bottom:1px solid var(--border-sub)">
        <div style="font-size:10px;color:var(--t5);letter-spacing:1px;margin-bottom:4px">KNOWN ISSUE</div>
        <div style="font-size:13px;font-weight:600;color:var(--t1);margin-bottom:4px">${esc(iss.title)}</div>
        <div style="font-size:11px;margin-bottom:6px"><span style="color:${statusColor}">● ${esc(iss.severity)} · ${esc(iss.status)}</span>${iss.updatedDate?` <span style="color:var(--t5)">· Updated ${esc(iss.updatedDate)}</span>`:""}</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.5;margin-bottom:${iss.workaround?"8":"0"}px">${esc(iss.description)}</div>
        ${iss.workaround?`<div style="background:var(--surface-2);border-radius:8px;padding:8px 10px;margin-top:4px"><div style="font-size:10px;color:var(--t4);font-weight:600;margin-bottom:2px">WORKAROUND</div><div style="font-size:11.5px;color:var(--t3)">${esc(iss.workaround)}</div></div>`:""}
      </div>`;
    }).join("") : `<div style="text-align:center;padding:30px 0"><div style="font-size:22px;margin-bottom:6px">✓</div><div style="font-size:13px;color:var(--t3)">No known issues</div></div>`;
  }

  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
    <button id="au-back" style="color:var(--t4);font-size:20px;padding:2px 8px;background:transparent;border:none">‹</button>
    <span style="font-size:17px;font-weight:700;color:var(--t1)">App Updates</span>
  </div>
  <div style="display:flex;gap:6px;margin-bottom:18px">
    ${tabBtn("whatsnew","What's New")}
    ${tabBtn("fixed","Fixed",fixedIssues.length)}
    ${tabBtn("known","Known Issues",knownIssues.length)}
  </div>
  ${content}`;
}

function whatsNewModal(entries) {
  const toShow = entries || CHANGELOG;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">🆕 WHAT'S NEW</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="max-height:60vh;overflow-y:auto">
      ${toShow.map(entry=>`<div style="margin-bottom:18px">
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px">
          <span style="font-size:14px;font-weight:700;color:var(--t1)">${esc(entry.title)}</span>
          <span style="font-size:10px;color:var(--t5)">${esc(entry.date)}</span>
        </div>
        ${entry.items.map(it=>`<div style="display:flex;gap:10px;margin-bottom:12px">
          <div style="font-size:16px;flex-shrink:0;line-height:1.3">${it.icon}</div>
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--t2);margin-bottom:2px">${esc(it.title)}</div>
            <div style="font-size:11.5px;color:var(--t4);line-height:1.5">${esc(it.desc)}</div>
          </div>
        </div>`).join("")}
      </div>`).join("")}
    </div>
    <button id="wn-dismiss" class="btn-primary" style="background:#A78BFA;margin-top:6px">Got it</button>
  `, "#A78BFA");
  const dismiss = () => { state.settings.lastSeenChangelog = CURRENT_CHANGELOG_VERSION; saveState(); closeModal(); };
  m.querySelector("#x").onclick = dismiss;
  m.querySelector("#wn-dismiss").onclick = dismiss;
}

function showOnboarding() {
  let step=0;
  const data={name:"",weightUnit:"lbs",measureUnit:"in",startWeight:"",goalWeight:"",goals:[],experience:"new"};
  const GOALS=[{id:"weight_loss",l:"📉 Weight Loss"},{id:"recovery",l:"🦴 Recovery"},{id:"longevity",l:"🧬 Longevity"},{id:"performance",l:"⚡ Performance"},{id:"hormonal",l:"🌸 Hormonal"},{id:"cognitive",l:"🧠 Cognitive"},{id:"skin_hair",l:"✨ Skin & Hair"},{id:"custom",l:"🔬 Custom"}];
  const STEPS=["Welcome","Goal","Stats","Done"];
  function buildNav(){return `<div style="display:flex;gap:8px;margin-top:12px">${step>0?`<button id="ob-back" style="flex:1;padding:11px;border-radius:10px;border:1px solid var(--border);color:var(--t2);background:var(--surface-2)">← Back</button>`:`<button id="ob-skip" style="flex:1;padding:11px;border-radius:10px;border:1px solid var(--border);color:var(--t4);background:transparent;font-size:12px">Skip</button>`}${step<STEPS.length-1?`<button id="ob-next" style="flex:2;padding:11px;border-radius:10px;background:#A78BFA;color:#fff;font-weight:700">Next →</button>`:`<button id="ob-done" style="flex:1;padding:11px;border-radius:10px;background:#7DF9C0;color:#000;font-weight:700">Let's go →</button>`}</div>`;}
  function rebuild(){const b=document.getElementById("ob-body");if(b){b.innerHTML=buildOb();}const n=document.getElementById("ob-nav");if(n){n.innerHTML=buildNav();}wireOb();}
  function buildOb(){
    const prog=`<div style="display:flex;gap:3px;margin-bottom:16px">${STEPS.map((_,i)=>`<div style="flex:1;height:3px;border-radius:3px;background:${i<=step?"#A78BFA":"var(--border)"}"></div>`).join("")}</div>`;
    if(step===0)return prog+`<div style="text-align:center;padding:8px 0 14px"><div style="font-size:32px;margin-bottom:8px">💉</div><h2 style="font-size:20px;color:var(--t1);margin-bottom:8px">Welcome to Nexus</h2><p style="font-size:13px;color:var(--t3);line-height:1.6;margin-bottom:14px">Plan protocols, track doses, manage inventory, and understand your patterns.</p></div><div style="font-size:12px;color:var(--t4);margin-bottom:5px">Your name</div><input id="ob-name" class="inp" placeholder="First name" value="${esc(data.name)}" style="width:100%;margin-bottom:10px"><div style="display:flex;gap:8px"><div style="flex:1"><div style="font-size:11px;color:var(--t4);margin-bottom:4px">Weight unit</div><div style="display:flex;gap:5px">${["lbs","kg"].map(u=>`<button class="ob-wu" data-u="${u}" style="flex:1;padding:7px;border-radius:8px;border:1px solid ${data.weightUnit===u?"#A78BFA":"var(--border)"};background:${data.weightUnit===u?"#A78BFA22":"transparent"};color:${data.weightUnit===u?"#A78BFA":"var(--t3)"};font-size:12px">${u}</button>`).join("")}</div></div><div style="flex:1"><div style="font-size:11px;color:var(--t4);margin-bottom:4px">Measure unit</div><div style="display:flex;gap:5px">${["in","cm"].map(u=>`<button class="ob-mu" data-u="${u}" style="flex:1;padding:7px;border-radius:8px;border:1px solid ${data.measureUnit===u?"#A78BFA":"var(--border)"};background:${data.measureUnit===u?"#A78BFA22":"transparent"};color:${data.measureUnit===u?"#A78BFA":"var(--t3)"};font-size:12px">${u}</button>`).join("")}</div></div></div>`;
    if(step===1)return prog+`<div style="font-size:15px;font-weight:600;color:var(--t1);margin-bottom:4px">What are your goals?</div><div style="font-size:12px;color:var(--t4);margin-bottom:10px">Select all that apply.</div><div style="display:flex;flex-wrap:wrap;gap:8px">${GOALS.map(g=>`<button class="ob-goal" data-id="${g.id}" style="padding:9px 14px;border-radius:99px;background:${data.goals.includes(g.id)?"#A78BFA22":"var(--surface-2)"};border:1px solid ${data.goals.includes(g.id)?"#A78BFA":"var(--border-sub)"};color:${data.goals.includes(g.id)?"#A78BFA":"var(--t2)"};font-size:13px">${g.l}</button>`).join("")}</div>`;
    if(step===2)return prog+`<div style="font-size:15px;font-weight:600;color:var(--t1);margin-bottom:10px">A few quick numbers <span style="font-size:11px;color:var(--t4);font-weight:400">(optional)</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div><div style="font-size:11px;color:var(--t4);margin-bottom:4px">Current weight (${data.weightUnit})</div><input id="ob-sw" class="inp" type="number" placeholder="e.g. 185" value="${data.startWeight}" style="width:100%;height:40px"></div><div><div style="font-size:11px;color:var(--t4);margin-bottom:4px">Goal weight (${data.weightUnit})</div><input id="ob-gw" class="inp" type="number" placeholder="e.g. 160" value="${data.goalWeight}" style="width:100%;height:40px"></div></div><div style="font-size:12px;color:var(--t4);margin-bottom:6px">Experience level</div><div style="display:flex;gap:6px">${[["new","New"],["some","Some"],["advanced","Advanced"]].map(([id,l])=>`<button class="ob-exp" data-id="${id}" style="flex:1;padding:8px 4px;border-radius:8px;border:1px solid ${data.experience===id?"#A78BFA":"var(--border)"};background:${data.experience===id?"#A78BFA22":"transparent"};color:${data.experience===id?"#A78BFA":"var(--t3)"};font-size:11px">${l}</button>`).join("")}</div>`;
    if(step===3)return prog+`<div style="text-align:center;padding:10px 0"><div style="font-size:36px;margin-bottom:8px">🎉</div><h2 style="font-size:18px;color:var(--t1);margin-bottom:8px">You're all set${data.name?", "+esc(data.name):""}!</h2><p style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:12px">Here's how to get started:</p><div style="display:flex;flex-direction:column;gap:7px">${[["💉","Log a dose","Today → + Log Dose"],["📋","Create a protocol","Protocol → New Protocol"],["📦","Add inventory","Stash → + Add Kit"],["🔬","Browse compounds","Nexus → Learn → Discover"]].map(([icon,title,desc])=>`<div style="background:var(--surface-2);border-radius:8px;padding:9px 12px;display:flex;gap:10px;align-items:center"><span style="font-size:16px">${icon}</span><div><div style="font-size:12px;font-weight:600;color:var(--t1)">${title}</div><div style="font-size:10px;color:var(--t4)">${desc}</div></div></div>`).join("")}</div><button id="ob-tutorial" style="width:100%;margin-top:12px;padding:10px;border-radius:10px;border:1px solid var(--border-sub);color:#A78BFA;background:#A78BFA12;font-size:12px">📖 View Getting Started Guide</button></div>`;
    return prog;
  }
  function wireOb(){
    const m=document.getElementById("ob-wrap");if(!m)return;
    m.querySelector("#ob-skip")?.addEventListener("click",()=>finish());
    m.querySelector("#ob-back")?.addEventListener("click",()=>{step--;rebuild();});
    m.querySelector("#ob-next")?.addEventListener("click",()=>{step++;rebuild();});
    m.querySelector("#ob-done")?.addEventListener("click",()=>finish());
    m.querySelector("#ob-tutorial")?.addEventListener("click",()=>{
      finish();
      tab="amino";state._aminoSub="learn";state._guideOpen=GUIDES.findIndex(g=>g.title.includes("Getting Started"));
      render();window.scrollTo(0,0);
    });
    m.querySelector("#ob-name")?.addEventListener("input",e=>{data.name=e.target.value;});
    m.querySelectorAll(".ob-wu").forEach(b=>b.onclick=()=>{data.weightUnit=b.dataset.u;rebuild();});
    m.querySelectorAll(".ob-mu").forEach(b=>b.onclick=()=>{data.measureUnit=b.dataset.u;rebuild();});
    m.querySelectorAll(".ob-goal").forEach(b=>b.onclick=()=>{const i=data.goals.indexOf(b.dataset.id);i>=0?data.goals.splice(i,1):data.goals.push(b.dataset.id);rebuild();});
    m.querySelectorAll(".ob-exp").forEach(b=>b.onclick=()=>{data.experience=b.dataset.id;rebuild();});
    m.querySelector("#ob-sw")?.addEventListener("input",e=>{data.startWeight=e.target.value;});
    m.querySelector("#ob-gw")?.addEventListener("input",e=>{data.goalWeight=e.target.value;});
  }
  function finish(){
    if(data.name)state.profile.name=data.name;
    if(data.startWeight)state.profile.startWeight=data.startWeight;
    if(data.goalWeight)state.profile.goalWeight=data.goalWeight;
    state.settings.weightUnit=data.weightUnit;
    state.settings.measureUnit=data.measureUnit;
    state.profile.onboardingDone=true;
    state.profile.primaryGoal=data.goals[0]||"";
    state.profile.goals=data.goals;
    // Auto-create Goals from onboarding selections
    if(data.goals.length && (!state.plans.goals||state.plans.goals.length===0)){
      const GOAL_LABELS={weight_loss:"Weight Loss",recovery:"Recovery / Injury",longevity:"Longevity",performance:"Performance",hormonal:"Hormonal / Wellness",cognitive:"Cognitive / Mood",skin_hair:"Skin & Hair",custom:"Custom"};
      if(!state.plans) state.plans={goals:[],research:[],shopping:[]};
      if(!state.plans.goals) state.plans.goals=[];
      data.goals.forEach(gid=>{
        state.plans.goals.push({id:uid(),name:GOAL_LABELS[gid]||gid,category:GOAL_LABELS[gid]||gid,status:"active",compounds:[],metrics:"",notes:"Set during onboarding"});
      });
    }
    saveState();closeModal();render();
  }
  const m=openModal(`<div id="ob-wrap"><div id="ob-body">${buildOb()}</div><div id="ob-nav">${buildNav()}</div></div>`,"#A78BFA");
  wireOb();
}

sinceLastVisitSummary = computeSinceLastVisit();
// One-time, guarded by its own inventoryModelVersion check — migrateToInventoryV2()
// no-ops immediately if already run. Runs here, once, at actual app startup, rather than
// staying purely lazy-per-kit forever: every consumer this session touched (Log Dose,
// Prepare Dose, Combo Dose, Mixed Syringe, Finish Vial, Log Outflow, Mark Kit Done,
// Reopen Vial, Stash's own card display, Supply Planner) has been made to correctly
// handle a v2-migrated kit, so there's no remaining screen left that a global migration
// could silently break by running early. This is what actually eliminates the two-model
// coexistence for good, rather than leaving every kit to migrate lazily whenever
// something first happens to touch it.
preserveOriginalState();
migrateToInventoryV2();
saveState();
if(!state.profile.onboardingDone){render();showOnboarding();}
else if((state.settings.lastSeenChangelog||0)<CURRENT_CHANGELOG_VERSION){render();whatsNewModal();}
else render();
