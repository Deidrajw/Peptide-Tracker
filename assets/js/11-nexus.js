function renderSettingsTabContent() {
  const unseenReleases = CHANGELOG.filter(c=>c.version>(state.settings.lastSeenChangelog||0));
  const hasNewUpdate = unseenReleases.length>0;

  const row = (key,icon,label,rightText,rightColor,badge) => `<button class="settings-row" data-detail="${key}" style="width:100%;display:flex;align-items:center;gap:12px;padding:13px 6px;background:transparent;border:none;border-bottom:1px solid var(--border-sub);text-align:left;min-height:44px">
    <span class="nx-settings-icon">${nxSettingsIcon(key)}</span>
    <span style="flex:1;font-size:14px;color:var(--t1)">${label}</span>
    ${badge?`<span style="background:#A78BFA22;color:#A78BFA;font-size:9px;font-weight:700;padding:2px 7px;border-radius:99px;flex-shrink:0">${badge}</span>`:""}
    ${rightText?`<span style="font-size:12px;color:${rightColor||"var(--t4)"};flex-shrink:0">${rightText}</span>`:""}
    <svg class="nx-settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
  </button>`;
  const sectionLabel = (t) => `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin:18px 0 2px;padding:0 6px">${t}</div>`;

  return `
    ${sectionLabel("NOTIFICATIONS")}
    ${row("reminders","🔔","Dose Alerts",state.settings.remindersEnabled?"On":"Off",state.settings.remindersEnabled?"#7DF9C0":"var(--t4)")}
    ${row("phasereminders","📈","Protocol Phase Alerts",state.settings.phaseRemindersEnabled!==false?"On":"Off",state.settings.phaseRemindersEnabled!==false?"#7DF9C0":"var(--t4)")}
    ${sectionLabel("APP")}
    ${row("appupdates","📋","App Updates",hasNewUpdate?null:"Up to date",null,hasNewUpdate?"NEW":null)}
    ${row("units","📐","Units & Preferences",state.settings.weightUnit)}
    ${row("onboarding","👋","Setup & Onboarding")}
    ${sectionLabel("DATA")}
    ${row("health","🍎","Health & Data")}
    ${row("backup","💾","Backup & Restore")}
    ${row("datamanagement","⚠️","Data Management")}
    ${row("usage","📊","Shortcut Activity",state.settings.nxUsageEnabled===true?"On":"Off")}
    ${sectionLabel("DEVELOPER")}
    ${row("developer","🧪","Developer Options",isDemoMode()?"Demo Active":null,isDemoMode()?"#F9C87D":null)}
  `;
}

function renderSettingsDetailScreen(key) {
  if (key === "appupdates") return appUpdatesView();
  const titles = {reminders:"Dose Alerts", phasereminders:"Protocol Phase Alerts", units:"Units & Preferences", health:"Health & Data", backup:"Backup & Restore", datamanagement:"Data Management", usage:"Shortcut Activity", developer:"Developer Options"};
  const backBtn = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
    <button id="settings-detail-back" style="color:var(--t4);font-size:20px;padding:2px 8px;background:transparent;border:none">‹</button>
    <span style="font-size:17px;font-weight:700;color:var(--t1)">${esc(titles[key]||"Settings")}</span>
  </div>`;
  let content = "";
  if (key==="reminders") content = renderRemindersDetail();
  else if (key==="phasereminders") content = renderPhaseRemindersDetail();
  else if (key==="units") content = renderUnitsDetail();
  else if (key==="health") content = nxHealthImportContext() + renderHealthDataDetail();
  else if (key==="backup") content = renderBackupDetail();
  else if (key==="datamanagement") content = renderDataManagementDetail();
  else if (key==="usage") content = nxUsageSettingsView();
  else if (key==="developer") content = renderDeveloperDetail();
  return backBtn + content;
}

function renderPhaseRemindersDetail() {
  const enabled = state.settings.phaseRemindersEnabled!==false;
  return `<div style="padding:16px 18px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;margin-bottom:14px">
    <div style="display:flex;align-items:center;gap:12px">
      <span style="font-size:22px">📈</span>
      <div style="flex:1"><div style="font-size:14px;color:var(--t1);font-weight:600">Protocol Phase Alerts</div><div style="font-size:11px;color:var(--t4);margin-top:2px">${enabled?"On — you'll see in-app alerts before and when a protocol phase changes":"Off — no phase-transition alerts"}</div></div>
      ${enabled
        ? `<button id="disablephaserem" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;padding:7px 14px;font-size:12px">Turn off</button>`
        : `<button id="enablephaserem" style="background:#7DF9C018;border:1px solid #7DF9C044;color:#7DF9C0;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600">Enable</button>`}
    </div>
  </div>
  <div style="font-size:11px;color:var(--t5);line-height:1.6;padding:0 4px">
    These are <b>in-app alerts only</b> — Nexus can't send background/push notifications while closed in this build, so alerts appear in Needs Attention when you open the app. Fires 3 days before a phase transition, and on the transition day itself, for any compound with a multi-phase protocol configured. Automatically derived from each protocol's phase durations — nothing to set up per-compound.
  </div>`;
}

function renderRemindersDetail() {
  return `<div style="padding:16px 18px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:${state.settings.remindersEnabled?12:0}px">
      <span style="font-size:22px">🔔</span>
      <div style="flex:1"><div style="font-size:14px;color:var(--t1);font-weight:600">Dose Alerts</div><div style="font-size:11px;color:var(--t4);margin-top:2px">${state.settings.remindersEnabled?"On — fires when you open the app on dose day":"Off — get notified in-app when your next dose is due"}</div></div>
      ${state.settings.remindersEnabled
        ? `<button id="disablerem" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;padding:7px 14px;font-size:12px">Turn off</button>`
        : `<button id="enablerem" style="background:#7DF9C018;border:1px solid #7DF9C044;color:#7DF9C0;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600">Enable</button>`}
    </div>
    ${state.settings.remindersEnabled ? `
    <div style="background:var(--surface-2);border-radius:10px;padding:10px 12px">
      ${Object.entries(allPeptides()).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active").map(([n,d])=>{
        const ds2=getDoseStatus(n,d);
        const col=ds2.status==="overdue"?"#ff7c7c":["due_now","due_later_today"].includes(ds2.status)?"#F9C87D":"var(--t3)";
        const label=ds2.status==="overdue"?`${ds2.hoursLate||0}h overdue`:ds2.status==="due_now"?"due now":ds2.status==="due_later_today"?"due later today":ds2.status==="taken_today"?"taken today":ds2.status==="skipped"?"skipped":ds2.nextDueStr?`in ${Math.max(0,Math.ceil((safeDate(ds2.nextDueStr).getTime()-Date.now())/86400000))}d`:"—";
        return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0"><div style="width:6px;height:6px;border-radius:50%;background:${cfg(n).color};flex-shrink:0"></div><span style="font-size:12px;color:var(--t2);flex:1">${esc(n)}</span><span style="font-size:11px;color:${col};font-weight:600">${label}</span></div>`;
      }).join("")}
      <div style="font-size:10px;color:var(--t5);margin-top:8px;line-height:1.4">⚠ In-app only: alerts fire when you open the app. They won't wake a closed phone — that requires a native app.</div>
    </div>` : ""}
  </div>`;
}

function renderUnitsDetail() {
  return `<div style="padding:4px 4px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;overflow:hidden">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 12px;border-bottom:1px solid var(--border-sub)">
      <span style="font-size:13px;color:var(--t2)">Weight unit</span>
      <button id="wunit" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;min-height:32px">${state.settings.weightUnit}</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 12px;border-bottom:1px solid var(--border-sub)">
      <span style="font-size:13px;color:var(--t2)">Measurement unit</span>
      <button id="munit-toggle" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;padding:6px 14px;font-size:12px;font-weight:600;min-height:32px">${state.settings.measureUnit}</button>
    </div>
    <div style="padding:13px 12px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
        <span style="font-size:13px;color:var(--t2)">My day rolls over at</span>
        <select id="dayrollover" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;min-height:32px">
          ${[0,1,2,3,4,5,6].map(h=>`<option value="${h}"${(Number(state.settings.dayRolloverHour)||0)===h?" selected":""}>${h===0?"Midnight (default)":h+":00 AM"}</option>`).join("")}
        </select>
      </div>
      <div style="font-size:11px;color:var(--t5);line-height:1.5;margin-top:8px">For bedtime doses taken after midnight. A shot logged at, say, 12:40 AM counts toward the day you were still in, so it doesn't look like you missed that day — the time itself is saved exactly as you took it. Applies to every compound.</div>
    </div>
  </div>`;
}

function renderHealthDataDetail() {
  const importedCount = ["macroLogs","weightLogs","activityLogs","measurementLogs"].reduce((a,k)=>{
    const isImport=r=>r.sourceType||r.notes?.includes("Apple Health")||r.notes==="Health Auto Export"||r.note==="Apple Health";
    return a + (state[k]||[]).filter(isImport).length;
  },0);
  return `<div style="padding:16px 18px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;margin-bottom:12px">
    <div style="font-size:14px;color:var(--t1);font-weight:600;margin-bottom:4px">Apple Health Import</div>
    <div style="font-size:11.5px;color:var(--t4);line-height:1.5;margin-bottom:12px">Import steps, HRV, resting heart rate, weight, macros, and more from an Apple Health CSV or XML export.</div>
    <button id="imp-health" style="width:100%;background:#FF6B6B18;border:1px solid #FF6B6B44;color:#FF9CC8;border-radius:10px;padding:10px;font-size:13px;font-weight:600">🍎 Import Health Data</button>
  </div>
  <div style="font-size:11px;color:var(--t5);padding:0 4px">${importedCount} imported health record${importedCount===1?"":"s"} currently stored. Automatic sync isn't available in this browser-based build — imports are manual for now.</div>`;
}

function renderBackupDetail() {
  return `<div style="padding:16px 18px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      <button id="exp" style="flex:1;min-width:120px;background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;padding:10px 12px;font-size:13px;font-weight:600">↓ Export Backup</button>
      <label style="flex:1;min-width:120px;text-align:center;background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;padding:10px 12px;font-size:13px;font-weight:600;cursor:pointer">↑ Import Backup<input id="imp" type="file" accept="application/json" style="display:none"></label>
    </div>
    <div style="font-size:11px;color:var(--t5);line-height:1.5">Saved on this device automatically. Export a backup regularly — your history shouldn't live in only one place.</div>
  </div>`;
}

function renderDataManagementDetail() {
  const rows = [
    ["del-health-all","🏥 Remove all health data","Macros, weight, activity, measurements",false],
    ["del-health-imported","📥 Remove all imported health data","Keeps manual entries — removes CSV & XML imports",false],
    ["del-activity","📊 Remove activity & step data","Clears all activity logs (step counts, HR, HRV, etc.)",false],
    ["del-doses","💉 Remove all dose history","Keeps protocols, removes all logged doses",false],
    ["del-logs","📋 Remove all daily check-ins","Clears mood, symptom, and note logs",false],
    ["del-stash","📦 Remove all stash data","Clears all kit and supply records",false],
    ["del-workouts","🏋️ Remove workout sessions","Clears imported workout data only",false],
  ];
  return `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin-bottom:8px;padding:0 4px">DATA TYPES</div>
  <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:22px">
    ${rows.map(([id,label,sub])=>`<button id="${id}" style="width:100%;padding:10px 12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:12px;text-align:left">
      <div style="font-weight:600">${label}</div>
      <div style="font-size:10px;color:var(--t5);margin-top:2px">${sub}</div>
    </button>`).join("")}
  </div>
  <div class="mono" style="font-size:9px;color:#ff4d4d99;letter-spacing:1.5px;margin-bottom:8px;padding:0 4px">DANGER ZONE</div>
  <button id="nuke-data" style="width:100%;padding:10px 12px;border-radius:10px;background:#ff4d4d18;border:1px solid #ff4d4d44;color:#ff4d4d;font-size:12px;text-align:left">
    <div style="font-weight:600">🗑️ Remove ALL data</div>
    <div style="font-size:10px;color:var(--t5);margin-top:2px">Complete reset — cannot be undone</div>
  </button>`;
}

function renderDeveloperDetail() {
  const storageBytes = (() => { try { return new Blob([localStorage.getItem(STORE_KEY)||""]).size; } catch(e) { return 0; } })();
  const storageKb = (storageBytes/1024).toFixed(1);
  const kitCount = (state.supplies||[]).length;
  const vialCount = (state.supplies||[]).reduce((a,s)=>a+((s.vials||[]).length||0),0);
  return `
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">DEMO</div>
    <button id="open-demo-mode" style="width:100%;padding:12px;border-radius:10px;background:${isDemoMode()?"#F9C87D22":"var(--surface-2)"};border:1px solid ${isDemoMode()?"#F9C87D55":"var(--border-sub)"};color:${isDemoMode()?"#F9C87D":"var(--t3)"};font-size:13px;font-weight:600;margin-bottom:20px">${isDemoMode()?"🧪 Demo Mode Active — Change / Exit":"🧪 Developer Demo Mode"}</button>

    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">TESTING</div>
    <button id="load-multikit-test" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:13px;font-weight:600;margin-bottom:6px;text-align:left">🧪 Load multi-kit test scenario<div style="font-size:11px;color:var(--t5);font-weight:400;margin-top:2px">Creates a throwaway test compound with two kits (30mg + 10mg) both open at once — try the "open a second kit" confirmation, the Log Dose vial picker, and remembered-choice behavior without touching your real inventory</div></button>
    <div style="font-size:10px;color:var(--t5);margin-bottom:20px">Uses a dedicated test compound name — never your real kits. Delete both kits from Stash when you're done (Manage kit → Delete).</div>

    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">DATA REPAIR</div>
    <button id="open-reconciliation" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:13px;font-weight:600;margin-bottom:6px;text-align:left">⚖️ Inventory Reconciliation<div style="font-size:11px;color:var(--t5);font-weight:400;margin-top:2px">Checks every kit's starting amount against administered + prepared + outflow + remaining — flags anything that doesn't balance, without changing any data</div></button>
    <button id="force-vial-repair" style="width:100%;padding:12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:13px;font-weight:600;margin-bottom:6px;text-align:left">🔧 Re-run vial data repair<div style="font-size:11px;color:var(--t5);font-weight:400;margin-top:2px">Manually re-checks every kit for missing vial numbers, mis-ordered sequence, or orphaned history — same checks that already run automatically, forced to run again now</div></button>
    <div style="font-size:10px;color:var(--t5);margin-bottom:20px">${kitCount} kit${kitCount===1?"":"s"} · ${vialCount} tracked vial${vialCount===1?"":"s"}</div>

    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">DIAGNOSTICS</div>
    <div style="display:flex;gap:8px;margin-bottom:6px">
      <button id="export-debug-state" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:12px;font-weight:600">⬇ Export Raw State (.json)</button>
      <button id="copy-debug-state" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:12px;font-weight:600">📋 Copy to Clipboard</button>
    </div>
    <div style="font-size:10px;color:var(--t5);margin-bottom:20px">Local storage in use: ${storageKb} KB. Includes everything except the currently-visible demo data, if demo mode is active.</div>

    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">BUILD</div>
    <div style="font-size:12px;color:var(--t3);margin-bottom:20px">Nexus · Changelog v${CURRENT_CHANGELOG_VERSION}</div>

    <div class="mono" style="font-size:9px;color:#ff7c7c;letter-spacing:1.5px;margin-bottom:8px">DANGER ZONE</div>
    <button id="dev-reset-all" style="width:100%;padding:12px;border-radius:10px;background:#ff7c7c0d;border:1px solid #ff7c7c33;color:#ff7c7c;font-size:13px;font-weight:600">🗑 Erase All Local Data</button>
  `;
}

// Creates a safe, disposable scenario for testing multi-kit behavior: one kit already
// open (30mg/vial), one still sealed (10mg/vial) — so opening the second one exercises
// confirmOpenIfOtherKitOpen for real, and once both are open, Log Dose exercises the
// "WHICH VIAL" picker and remembered-choice defaulting. Uses a dedicated test compound
// name specifically so it can never collide with or affect a real tracked compound.
const MULTIKIT_TEST_NAME = "Test Multi-Kit Peptide";
function loadMultiKitTestScenario() {
  // Wipe any previous run of this test first, so re-running it doesn't pile up kits.
  state.supplies = (state.supplies||[]).filter(s=>s.name!==MULTIKIT_TEST_NAME);
  if (state.customPeptides) delete state.customPeptides[MULTIKIT_TEST_NAME];
  if (state.lastSourceKit) delete state.lastSourceKit[MULTIKIT_TEST_NAME];

  const kitA = {
    id: uid(), name: MULTIKIT_TEST_NAME, totalVials: 1, vialMg: 30, activeKit: true,
    reconDate: localDatetime(), bacMl: 3,
    vials: [{ id: uid(), status: "open", vialMg: 30, remainingMg: 22, reconDate: localDatetime() }],
  };
  const kitB = {
    id: uid(), name: MULTIKIT_TEST_NAME, totalVials: 1, vialMg: 10, activeKit: false,
    vials: [{ id: uid(), status: "sealed", vialMg: 10, remainingMg: 10 }],
  };
  state.supplies = [...(state.supplies||[]), kitA, kitB];
  state.customPeptides = state.customPeptides || {};
  state.customPeptides[MULTIKIT_TEST_NAME] = { status: "active", scheduleDays: 1, doses: [] };
  saveState();
  tab = "stash";
  render();
  showUndoToast(`Test scenario loaded — ${esc(MULTIKIT_TEST_NAME)} (30mg kit open, 10mg kit sealed) · Remove`, () => {
    state.supplies = (state.supplies||[]).filter(s=>s.name!==MULTIKIT_TEST_NAME);
    if (state.customPeptides) delete state.customPeptides[MULTIKIT_TEST_NAME];
    if (state.lastSourceKit) delete state.lastSourceKit[MULTIKIT_TEST_NAME];
    saveState(); render();
  });
}

function forceVialRepairModal() {
  const kits = state.supplies||[];
  let touched = 0;
  kits.forEach(kit=>{
    if (!kit.vials) return; // nothing migrated yet for this kit — ensureKitVials will handle it normally on next access
    const before = JSON.stringify(kit.vials);
    kit._vialsBackfilled = false; kit._vialsSeqOrderRepaired = false; kit._vialsRepaired = false;
    ensureKitVials(kit);
    if (JSON.stringify(kit.vials) !== before) touched++;
  });
  saveState(); render();
  const c = touched>0 ? "#7DF9C0" : "var(--t3)";
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${c};letter-spacing:1.5px">REPAIR COMPLETE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:14px;color:var(--t1);margin-bottom:8px">${touched>0 ? `Fixed ${touched} kit${touched===1?"":"s"}.` : "Nothing needed fixing."}</div>
    <div class="hint">Every kit's vial records were re-checked for missing numbers, backwards ordering, and orphaned history, and corrected in place. Nothing was deleted or reset.</div>
  `, c);
  m.querySelector("#x").onclick = closeModal;
}

function devResetAllModal() {
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#ff7c7c;letter-spacing:1.5px">ERASE ALL LOCAL DATA</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:14px;color:var(--t1);font-weight:600;margin-bottom:10px">This cannot be undone.</div>
    <div class="hint" style="margin-bottom:20px">Every compound, dose, kit, vial, prepared syringe, check-in, and setting will be permanently deleted from this device. If you want a copy first, use Export Raw State above, or Backup & Restore.</div>
    <label class="field-label">Type ERASE to confirm</label>
    <input id="erase-confirm" class="inp" style="margin-bottom:16px">
    <div style="display:flex;gap:8px">
      <button id="cancel" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px">Cancel</button>
      <button id="confirm" style="flex:1;padding:11px;border-radius:10px;background:#ff7c7c;color:#000;font-weight:700;font-size:13px">Erase Everything</button>
    </div>
  `, "#ff7c7c");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#cancel").onclick = closeModal;
  m.querySelector("#confirm").onclick = () => {
    if (m.querySelector("#erase-confirm").value.trim().toUpperCase()!=="ERASE") return;
    try { localStorage.removeItem(STORE_KEY); } catch(e) {}
    location.reload();
  };
}

// ── SUPPLEMENTS tab: searchable vertical list ────────────────────────────────
function renderSupplementsTabContent() {
  const all = state.settings.supplements||[];
  const q = (state._supplementSearch||"").trim().toLowerCase();
  const filtered = q ? all.filter(s=>s.toLowerCase().includes(q)) : all;

  return `<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px">
    <span style="font-size:15px;font-weight:700;color:var(--t1)">Supplements</span>
    <span style="font-size:12px;color:var(--t4)">${all.length} supplement${all.length===1?"":"s"}</span>
  </div>
  ${all.length?`<input id="supp-search" class="inp" placeholder="Search supplements" value="${esc(state._supplementSearch||"")}" style="margin-bottom:12px" aria-label="Search supplements">`:""}
  <div style="background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;overflow:hidden;margin-bottom:14px">
    ${filtered.length?filtered.map((s,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:12px;min-height:44px;${i<filtered.length-1?"border-bottom:1px solid var(--border-sub)":""}">
      <span style="flex:1;font-size:13.5px;color:var(--t2)">${esc(s)}</span>
      <button class="del-supp" data-name="${esc(s)}" aria-label="Remove ${esc(s)}" style="color:var(--t5);font-size:14px;padding:10px 12px;min-height:44px;min-width:44px">✕</button>
    </div>`).join(""):`<div style="text-align:center;padding:24px;color:var(--t5);font-size:12px">${q?"No matches":"No supplements added yet"}</div>`}
  </div>
  <div style="display:flex;gap:8px;margin-bottom:10px">
    <input id="new-supp" class="inp" placeholder="e.g. Metamucil, Vitamin C" style="flex:1;padding:10px;font-size:13px">
    <button id="add-supp" style="background:#C8FF9C18;border:1px solid #C8FF9C44;color:#C8FF9C;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600">Add</button>
  </div>
  <button id="load-notion-supps" style="width:100%;font-size:12px;color:#C8FF9C;background:#C8FF9C15;border:1px solid #C8FF9C33;border-radius:8px;padding:10px">↓ Import from Notion</button>`;
}

function exportData() {
  const clean={...state};
  ['_recon','_weekOff','_guideOpen','_addingPep','_trendsOpen','_monthOff','_calSub','_discoverSearch','_aminoLoading','_aminoSub','_learnSub','_stashSort','_homeFilter','_intelReturn','_todayExpandedCompounds','_homeView','_allStatusFilter'].forEach(k=>delete clean[k]);
  const blob=new Blob([JSON.stringify(clean,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  const name=(state.profile.name||"peptide").toLowerCase().replace(/\s+/g,"-");
  const days=state.profile.startDate?Math.floor((Date.now()-new Date(state.profile.startDate).getTime())/86400000):0;
  a.href=url; a.download=`${name}-protocol-day${days}-${localDate()}.json`; a.click(); URL.revokeObjectURL(url);
}
function importAppleHealth(e) {
  const file = e.target.files[0]; if(!file) return;
  e.target.value = "";
  const sizeMB = (file.size/1024/1024).toFixed(1);

  openModal(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <span class="mono" style="font-size:13px;color:#FF9CC8;letter-spacing:1.5px">🍎 APPLE HEALTH IMPORT</span>
    <button id="x" style="color:var(--t4);font-size:18px">✕</button>
  </div>
  <div style="font-size:13px;color:var(--t2);margin-bottom:8px">File: <b>${esc(file.name)}</b> (${sizeMB} MB)</div>
  <div style="font-size:12px;color:var(--t4);margin-bottom:16px;line-height:1.6">Imports: <b style="color:var(--t2)">Weight · Resting HR · HRV · Calories · Protein · Carbs · Fat · Steps · Active Energy · Resting Energy</b>. Processed in chunks.</div>
  <div style="display:flex;gap:8px;margin-bottom:14px">
    <div style="flex:1"><label class="field-label">FROM DATE (optional)</label><input id="ah-from" type="date" class="inp"></div>
    <div style="flex:1"><label class="field-label">TO DATE</label><input id="ah-to" type="date" class="inp" value="${localDate()}"></div>
  </div>
  <div id="ah-progress" style="height:4px;background:var(--surface-3);border-radius:2px;margin-bottom:10px;display:none"><div id="ah-bar" style="height:100%;background:#FF9CC8;border-radius:2px;width:0%;transition:width 0.2s"></div></div>
  <div id="ah-status" style="font-size:12px;color:var(--t4);min-height:18px;margin-bottom:14px"></div>
  <button id="ah-go" class="btn-primary" style="background:#FF9CC8;color:#1a1728">Parse &amp; Import</button>
  `,"#FF9CC8");

  document.querySelector(".modal #x").onclick = closeModal;
  document.querySelector(".modal #ah-go").onclick = () => {
    const fromVal = document.querySelector(".modal #ah-from").value;
    const toVal   = document.querySelector(".modal #ah-to").value;
    const fromDate = fromVal ? fromVal : null;
    const toDate   = toVal   ? toVal   : localDate();
    const status   = document.querySelector(".modal #ah-status");
    const bar      = document.querySelector(".modal #ah-bar");
    const prog     = document.querySelector(".modal #ah-progress");
    prog.style.display = "block";
    status.textContent = "Reading…";
    document.querySelector(".modal #ah-go").disabled = true;

    // Chunked read — 2MB at a time to avoid OOM
    const CHUNK = 2 * 1024 * 1024;
    const total = file.size;
    let offset = 0;
    let tail = ""; // carry-over between chunks for split records
    const results = { weights:{}, restingHR:{}, hrv:{}, calories:{}, protein:{}, carbs:{}, fat:{}, steps:{}, activeEnergy:{}, restingEnergy:{} };

    const recordRe = /<Record\s[^>]+\/>/g;

    const inRange = d => (!fromDate || d >= fromDate) && (!toDate || d <= toDate);

    const processChunk = text => {
      const combined = tail + text;
      // Find last complete record boundary to keep tail
      const lastClose = combined.lastIndexOf("/>") + 2;
      const toProcess = combined.slice(0, lastClose);
      tail = combined.slice(lastClose);

      let m;
      recordRe.lastIndex = 0;
      const re = /<Record\s[^>]+\/>/g;
      while((m = re.exec(toProcess)) !== null) {
        const rec = m[0];
        const type = (rec.match(/\btype="([^"]+)"/)   ||[])[1];
        const val  = (rec.match(/\bvalue="([^"]+)"/)  ||[])[1];
        const date = (rec.match(/\bstartDate="([^"]+)"/)  ||[])[1];
        const unit = (rec.match(/\bunit="([^"]+)"/)   ||[])[1];
        if(!type||!date||!val) continue;
        const d = date.slice(0,10);
        if(!inRange(d)) continue;

        if(type==="HKQuantityTypeIdentifierBodyMass") {
          let w = parseFloat(val);
          if(unit==="kg") w = Math.round(w*2.20462*10)/10;
          else w = Math.round(w*10)/10;
          // Keep latest reading per day
          if(!results.weights[d] || date > results.weights[d].date)
            results.weights[d] = {date:d, weight:String(w)};
        } else if(type==="HKQuantityTypeIdentifierRestingHeartRate") {
          if(!results.restingHR[d]) results.restingHR[d] = {date:d, values:[]};
          results.restingHR[d].values.push(parseFloat(val));
        } else if(type==="HKQuantityTypeIdentifierHeartRateVariabilitySDNN") {
          if(!results.hrv[d]) results.hrv[d] = {date:d, values:[]};
          results.hrv[d].values.push(parseFloat(val));
        } else if(type==="HKQuantityTypeIdentifierDietaryEnergyConsumed") {
          if(!results.calories[d]) results.calories[d] = 0;
          results.calories[d] += parseFloat(val); // kcal, sum across meals
        } else if(type==="HKQuantityTypeIdentifierDietaryProtein") {
          if(!results.protein[d]) results.protein[d] = 0;
          results.protein[d] += parseFloat(val); // grams
        } else if(type==="HKQuantityTypeIdentifierDietaryCarbohydrates") {
          if(!results.carbs[d]) results.carbs[d] = 0;
          results.carbs[d] += parseFloat(val);
        } else if(type==="HKQuantityTypeIdentifierDietaryFatTotal") {
          if(!results.fat[d]) results.fat[d] = 0;
          results.fat[d] += parseFloat(val);
        } else if(type==="HKQuantityTypeIdentifierStepCount") {
          if(!results.steps[d]) results.steps[d] = 0;
          results.steps[d] += parseFloat(val);
        } else if(type==="HKQuantityTypeIdentifierActiveEnergyBurned") {
          if(!results.activeEnergy[d]) results.activeEnergy[d] = 0;
          results.activeEnergy[d] += parseFloat(val); // kcal
        } else if(type==="HKQuantityTypeIdentifierBasalEnergyBurned") {
          if(!results.restingEnergy[d]) results.restingEnergy[d] = 0;
          results.restingEnergy[d] += parseFloat(val); // kcal
        }
      }
    };

    const reader = new FileReader();
    const readNext = () => {
      if(offset >= total) { finish(); return; }
      const slice = file.slice(offset, offset + CHUNK);
      reader.readAsText(slice);
    };

    reader.onload = ev => {
      processChunk(ev.target.result);
      offset += CHUNK;
      const pct = Math.min(100, Math.round(offset/total*100));
      bar.style.width = pct + "%";
      status.textContent = `Processing… ${pct}% (${(offset/1024/1024).toFixed(0)}/${sizeMB} MB)`;
      // Yield to UI thread before next chunk
      setTimeout(readNext, 0);
    };

    reader.onerror = () => { status.innerHTML = `<span style="color:#ff7c7c">Read error — try a smaller date range.</span>`; };

    const finish = () => {
      bar.style.width = "100%";
      status.textContent = "Applying data…";
      setTimeout(() => {
        const existingWt = new Set(state.weightLogs.map(w=>dayKey(w.date)));
        let wtAdded=0, hrAdded=0, hrvAdded=0, macroAdded=0;

        Object.values(results.weights).forEach(w=>{
          if(!existingWt.has(w.date)){
            state.weightLogs.push({id:uid(), date:w.date, weight:w.weight, note:"Apple Health"});
            wtAdded++;
          }
        });

        // Avg HR/HRV per day — merge into the SAME activityLogs source of truth every
        // other screen reads from (previously this wrote into dailyLog notes text instead,
        // which silently dropped the data entirely on any date with no check-in).
        const hrByDay={}, hrvByDay={};
        Object.values(results.restingHR).forEach(r=>{ hrByDay[r.date]=Math.round(r.values.reduce((a,b)=>a+b,0)/r.values.length); hrAdded++; });
        Object.values(results.hrv).forEach(r=>{ hrvByDay[r.date]=Math.round(r.values.reduce((a,b)=>a+b,0)/r.values.length); hrvAdded++; });

        // Macros — merge into macroLogs, skip days already logged
        const existingMacroDates = new Set(state.macroLogs.map(m=>dayKey(m.date)));
        const allMacroDays = new Set([...Object.keys(results.calories), ...Object.keys(results.protein), ...Object.keys(results.carbs), ...Object.keys(results.fat)]);
        allMacroDays.forEach(date=>{
          if(existingMacroDates.has(date)) return; // don't overwrite manual entries
          const cal = results.calories[date];
          const pro = results.protein[date];
          const carb = results.carbs[date];
          const f   = results.fat[date];
          if(!cal && !pro && !carb && !f) return;
          state.macroLogs.push({
            id: uid(), date,
            calories: cal ? Math.round(cal) : null,
            protein:  pro  ? Math.round(pro)  : null,
            carbs:    carb ? Math.round(carb) : null,
            fat:      f    ? Math.round(f)    : null,
            note: "Apple Health"
          });
          macroAdded++;
        });

        // Activity logs — steps, active/resting energy, resting HR, HRV. Merge into the
        // existing non-workout record for a date rather than skipping the whole date just
        // because SOME record already exists there (e.g. from an earlier steps-only import)
        // — that pattern was silently dropping HRV/RHR on any date already touched.
        let activityAdded = 0;
        const allActivityDays = new Set([
          ...Object.keys(results.steps), ...Object.keys(results.activeEnergy), ...Object.keys(results.restingEnergy),
          ...Object.keys(hrByDay), ...Object.keys(hrvByDay),
        ]);
        if(!state.activityLogs) state.activityLogs = [];
        allActivityDays.forEach(date=>{
          const steps = results.steps[date];
          const active = results.activeEnergy[date];
          const resting = results.restingEnergy[date];
          const restingHR = hrByDay[date];
          const hrv = hrvByDay[date];
          if(steps==null && active==null && resting==null && restingHR==null && hrv==null) return;
          const existing = state.activityLogs.find(a=>dayKey(a.date)===date && !a.isWorkout);
          if(existing){
            if(steps!=null && existing.steps==null) existing.steps = Math.round(steps);
            if(active!=null && existing.activeCalories==null) existing.activeCalories = Math.round(active);
            if(resting!=null && existing.restingEnergy==null) existing.restingEnergy = Math.round(resting);
            if(restingHR!=null && existing.restingHR==null) existing.restingHR = restingHR;
            if(hrv!=null && existing.hrv==null) existing.hrv = hrv;
          } else {
            const entry = {id:uid(), date};
            if(steps!=null) entry.steps = Math.round(steps);
            if(active!=null) entry.activeCalories = Math.round(active);
            if(resting!=null) entry.restingEnergy = Math.round(resting);
            if(restingHR!=null) entry.restingHR = restingHR;
            if(hrv!=null) entry.hrv = hrv;
            state.activityLogs.push(entry);
            activityAdded++;
          }
        });

        saveState();
        status.innerHTML = `<span style="color:#7DF9C0">✓ ${wtAdded} weight · ${hrAdded} HR · ${hrvAdded} HRV · ${macroAdded} macro days · ${activityAdded} activity days imported</span>`;
        const btn=document.querySelector(".modal #ah-go");
        if(btn){btn.textContent="Done — Close"; btn.disabled=false; btn.onclick=()=>{closeModal();render();};}
      }, 50);
    };

    readNext();
  };
}



function importData(e) {
  const file=e.target.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=ev=>{ try{ const p=JSON.parse(ev.target.result); if(p&&p.peptides){state=migrate(p);saveState();render();alert("Backup restored ✓");}else alert("Doesn't look like a valid backup."); }catch{alert("Couldn't read that file.");} };
  r.readAsText(file); e.target.value="";
}

// ─── Profile modal ────────────────────────────────────────────────────────────
const ICONS = {
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
  home:'<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1"/>',
  weekly:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  trends:'<path d="M3 17l6-6 4 4 7-7M14 8h6v6"/>',
  stash:'<path d="M5 8h14l-1 12H6zM9 8V5a3 3 0 016 0v3"/>',
  plans:'<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h4"/>',
  protocols:'<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/>',
  amino:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2 2M16.4 16.4l2 2M16.4 5.6l-2 2M5.6 18.4l2-2"/>',
  profile:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};
function tabbarHTML() {
  const tabs=[["home","Today"],["trends","Trends"],["protocols","Protocol"],["stash","Stash"],["plans","Plans"],["amino","Nexus"]];
  return `<div class="tabbar">${tabs.map(([id,l])=>`<button data-tab="${id}" class="${tab===id?"active":""}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[id]||""}</svg>${l}</button>`).join("")}</div>`;
}

// ── Reusable compound multi-select picker ─────────────────────────────────
function compoundPickerHTML(selected=[], pickerId="cpick") {
  // Blends belong here too (used by Research entries and Protocol Idea notes) — you can
  // absolutely be researching or planning around KLOW by name, same as any compound.
  const ALL = [...new Set([...Object.keys(PEPTIDES),...LIBRARY.map(l=>l.name),...Object.keys(state.customPeptides||{})])].sort();
  const q = (state[`_cpickQ_${pickerId}`]||"").toLowerCase();
  const filtered = q ? ALL.filter(n=>{
    if(n.toLowerCase().includes(q)) return true;
    const lib=LIBRARY.find(l=>l.name===n);
    return (lib?.aliases||[]).some(a=>a.toLowerCase().includes(q));
  }) : ALL;
  return `<div style="margin-bottom:10px">
    <div style="font-size:11px;color:var(--t4);margin-bottom:5px">Compounds${selected.length?` <span style="color:#7DF9C0">(${selected.length} selected)</span>`:""}  <button class="cpick-clear" data-picker="${pickerId}" style="font-size:10px;color:var(--t5);border:none;background:none;text-decoration:underline">${selected.length?"clear all":""}</button></div>
    ${selected.length?`<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">${selected.map(c=>`<span class="pill cpick-remove" data-name="${esc(c)}" data-picker="${pickerId}" style="background:#7DF9C022;color:#7DF9C0;border:1px solid #7DF9C044;cursor:pointer">${esc(c)} ✕</span>`).join("")}</div>`:""}
    <input class="cpick-search inp" data-picker="${pickerId}" placeholder="🔍 Search compounds…" value="${esc(state[`_cpickQ_${pickerId}`]||"")}" style="width:100%;margin-bottom:6px;padding:7px 10px;font-size:12px">
    <div style="max-height:160px;overflow-y:auto;border:1px solid var(--border-sub);border-radius:8px;background:var(--surface-2)">
      ${filtered.slice(0,30).map(n=>{
        const isSel=selected.includes(n);
        const lib=LIBRARY.find(l=>l.name===n);
        const alias=lib?.aliases?.[0]||"";
        return `<button class="cpick-item" data-name="${esc(n)}" data-picker="${pickerId}" style="width:100%;text-align:left;padding:8px 12px;border:none;border-bottom:1px solid var(--surface-3);background:${isSel?"#7DF9C012":"transparent"};color:${isSel?"#7DF9C0":"var(--t2)"};font-size:12px">
          <span style="font-weight:${isSel?"600":"400"}">${isSel?"✓ ":""}${esc(n)}</span>${alias?`<span style="font-size:10px;color:var(--t5);margin-left:6px">${esc(alias)}</span>`:""}
        </button>`;
      }).join("")}
      ${filtered.length>30?`<div style="padding:8px 12px;font-size:10px;color:var(--t5)">Type to narrow — ${filtered.length} total</div>`:""}
      ${filtered.length===0?`<div style="padding:8px 12px;font-size:11px;color:var(--t5)">No match. <button class="cpick-custom" data-picker="${pickerId}" data-q="${esc(q)}" style="color:#7DF9C0;background:none;border:none;text-decoration:underline;font-size:11px">Add "${esc(q)}"</button></div>`:""}
    </div>
  </div>`;
}
function wireCompoundPicker(container, selected, pickerId, onChange) {
  container.querySelectorAll(`.cpick-item[data-picker="${pickerId}"]`).forEach(b=>b.onclick=()=>{
    const n=b.dataset.name, i=selected.indexOf(n);
    if(i>=0) selected.splice(i,1); else selected.push(n);
    onChange(selected);
  });
  container.querySelectorAll(`.cpick-remove[data-picker="${pickerId}"]`).forEach(b=>b.onclick=()=>{
    const i=selected.indexOf(b.dataset.name); if(i>=0) selected.splice(i,1);
    onChange(selected);
  });
  const cl=container.querySelector(`.cpick-clear[data-picker="${pickerId}"]`); if(cl) cl.onclick=()=>{ selected.length=0; onChange(selected); };
  const s=container.querySelector(`.cpick-search[data-picker="${pickerId}"]`); if(s) s.oninput=()=>{ state[`_cpickQ_${pickerId}`]=s.value; onChange(selected); };
  const cc=container.querySelector(`.cpick-custom[data-picker="${pickerId}"]`); if(cc) cc.onclick=()=>{
    const name=(cc.dataset.q||"").trim(); if(!name) return;
    if(!selected.includes(name)) selected.push(name);
    state[`_cpickQ_${pickerId}`]="";
    onChange(selected);
  };
}

// ── Protocol Builder ─────────────────────────────────────────────────────────
const ROUTES = ["SubQ","IM","Oral","Nasal","Topical"];
const DAYS_OF_WEEK = ["S","M","T","W","T","F","S"];

const PROTO_GOALS = [
  {id:"weight_loss",label:"Weight Loss",icon:"📉",desc:"GLP-1s, metabolic support"},
  {id:"recovery",label:"Recovery / Injury",icon:"🦴",desc:"BPC-157, TB-500, peptide repair"},
  {id:"longevity",label:"Longevity",icon:"🧬",desc:"Epithalon, MOTS-c, anti-aging"},
  {id:"performance",label:"Performance",icon:"⚡",desc:"GH peptides, MOTS-c, IGF"},
  {id:"hormonal",label:"Hormonal / Wellness",icon:"🌸",desc:"Kisspeptin, PT-141, Oxytocin"},
  {id:"cognitive",label:"Cognitive / Mood",icon:"🧠",desc:"Selank, Semax, Cerebrolysin"},
  {id:"skin_hair",label:"Skin & Hair",icon:"✨",desc:"GHK-Cu, AHK-Cu, BPC-157"},
  {id:"custom",label:"Custom",icon:"🔬",desc:"Build from scratch"},
];

const PROTO_TEMPLATES = {
  weight_loss:[
    {id:"glp1",label:"GLP-1 Titration",desc:"Commonly researched: weekly Retatrutide with dose escalation phases",note:"Explore this template",compounds:[{name:"Retatrutide",route:"SubQ",unit:"mg",multiPhase:true,phases:[{type:"dose",durationWeeks:4,dose:"0.5"},{type:"dose",durationWeeks:4,dose:"1"},{type:"dose",durationWeeks:4,dose:"1.5"},{type:"dose",durationWeeks:16,dose:"2"}]}],schedule:{type:"Weekly",days:[6],dosesPerDay:1,times:["08:00"]}},
    {id:"glp1_support",label:"GLP-1 + Support Stack",desc:"Commonly researched: GLP-1 + GHK-Cu for body composition and skin quality",note:"Explore this template",compounds:[{name:"Retatrutide",route:"SubQ",unit:"mg",multiPhase:true,phases:[{type:"dose",durationWeeks:8,dose:"1"},{type:"dose",durationWeeks:16,dose:"2"}]},{name:"GHK-Cu",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"1"}]}],schedule:{type:"Weekly",days:[6],dosesPerDay:1,times:["08:00"]}},
    {id:"custom",label:"Start from scratch",desc:"Build your own stack with custom compounds and phases",compounds:[],schedule:{type:"Weekly",days:[6],dosesPerDay:1,times:["08:00"]}},
  ],
  recovery:[
    {id:"wolverine",label:"Wolverine Stack",desc:"Commonly researched: BPC-157 + TB-500 + GHK-Cu for injury recovery",note:"Explore this template",compounds:[{name:"BPC-157",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.5"}]},{name:"TB-500",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"2"}]},{name:"GHK-Cu",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"1"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
    {id:"bpc_tb",label:"BPC-157 + TB-500",desc:"Commonly researched: two-compound repair stack",note:"Explore this template",compounds:[{name:"BPC-157",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.5"}]},{name:"TB-500",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"2"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
    {id:"bpc_simple",label:"BPC-157 Solo",desc:"Commonly researched: targeted daily BPC-157 for isolated recovery",note:"Explore this template",compounds:[{name:"BPC-157",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.5"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:2,times:["08:00","14:00"]}},
    {id:"custom",label:"Start from scratch",desc:"Build your own stack",compounds:[],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
  ],
  longevity:[
    {id:"longevity_foundation",label:"Longevity Foundation",desc:"Commonly researched: Epithalon burst cycle + MOTS-c + Glutathione",note:"Explore this template",compounds:[{name:"Epithalon",route:"SubQ",unit:"mg",multiPhase:true,phases:[{type:"dose",durationWeeks:2,dose:"5"},{type:"rest",durationWeeks:14,dose:""}]},{name:"MOTS-c",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"5"}]},{name:"Glutathione",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"600"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["07:00"]}},
    {id:"mots_solo",label:"MOTS-c Solo",desc:"Commonly researched: mitochondrial and metabolic support",note:"Explore this template",compounds:[{name:"MOTS-c",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"5"}]}],schedule:{type:"Every Other Day",days:[0,2,4,6],dosesPerDay:1,times:["07:00"]}},
    {id:"custom",label:"Start from scratch",desc:"Build your own stack",compounds:[],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
  ],
  cognitive:[
    {id:"clo",label:"CLO / Nootropic Stack",desc:"Commonly researched: Selank + Semax nasal — anxiolytic + cognitive",note:"Explore this template",compounds:[{name:"Selank",route:"Nasal",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.3"}]},{name:"Semax",route:"Nasal",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.3"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
    {id:"selank_solo",label:"Selank Solo",desc:"Commonly researched: anxiety and mood support",note:"Explore this template",compounds:[{name:"Selank",route:"Nasal",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"0.3"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
    {id:"custom",label:"Start from scratch",desc:"Build your own stack",compounds:[],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
  ],
  performance:[
    {id:"gh_stack",label:"GH Peptide Stack",desc:"Commonly researched: CJC-1295 + Ipamorelin for GH pulse amplification",note:"Explore this template",compounds:[{name:"CJC-1295 no DAC",route:"SubQ",unit:"mcg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"100"}]},{name:"Ipamorelin",route:"SubQ",unit:"mcg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"200"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:2,times:["07:00","22:00"]}},
    {id:"mots_perf",label:"MOTS-c Performance",desc:"Commonly researched: metabolic support for training adaptation",note:"Explore this template",compounds:[{name:"MOTS-c",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:8,dose:"5"}]}],schedule:{type:"Every Other Day",days:[0,2,4,6],dosesPerDay:1,times:["07:00"]}},
    {id:"custom",label:"Start from scratch",desc:"Build your own stack",compounds:[],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
  ],
  skin_hair:[
    {id:"ghk_glow",label:"GHK-Cu Glow Stack",desc:"Commonly researched: GHK-Cu for skin regeneration and hair support",note:"Explore this template",compounds:[{name:"GHK-Cu",route:"SubQ",unit:"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:12,dose:"1"}]}],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["20:00"]}},
    {id:"custom",label:"Start from scratch",desc:"Build your own stack",compounds:[],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
  ],
  hormonal:[
    {id:"custom",label:"Start from scratch",desc:"Build your own stack — hormonal protocols vary significantly by individual",compounds:[],schedule:{type:"Weekly",days:[6],dosesPerDay:1,times:["08:00"]}},
  ],
  custom:[
    {id:"custom",label:"Start from scratch",desc:"Build fully custom from the compound library",compounds:[],schedule:{type:"Daily",days:[0,1,2,3,4,5,6],dosesPerDay:1,times:["08:00"]}},
  ],
};

// Stack interaction hints (from library stacks data)
// Interaction types: "clinic"=used in clinics, "compatible"=anecdotal ok, "caution"=anecdotal caution, "avoid"=commonly known avoid
// Source: community/clinic data + Image 1 reference chart. Educational only — not medical advice.
const PEPTIDE_INTERACTIONS = {
  // GH Secretagogue synergies (clinic / well-established)
  "CJC-1295 no DAC|Ipamorelin":   {type:"clinic",    note:"Classic GHRH + GHRP pulse — amplified GH release. Most common secretagogue stack."},
  "CJC+DAC|Ipamorelin":           {type:"clinic",    note:"Long-acting GHRH + GHRP. Less common but used clinically."},
  "GHRP-2|CJC-1295 no DAC":       {type:"clinic",    note:"GHRP-2 + GHRH — strong GH pulse synergy."},
  "GHRP-6|CJC-1295 no DAC":       {type:"clinic",    note:"GHRP-6 + GHRH synergy. Appetite increase expected."},
  "Hexarelin|CJC-1295 no DAC":    {type:"clinic",    note:"Potent GH pulse combination."},
  "Tesamorelin|Ipamorelin":        {type:"clinic",    note:"FDA-approved GHRH analog + GHRP — used in HIV lipodystrophy and off-label."},

  // Recovery / tissue repair (clinic)
  "BPC-157|TB-500":                {type:"clinic",    note:"Classic recovery pairing — BPC-157 for local repair, TB-500 for systemic healing."},
  "BPC-157|GHK-Cu":               {type:"clinic",    note:"Tissue repair + collagen synthesis synergy."},
  "BPC-157|KPV":                   {type:"clinic",    note:"Gut healing combination — both have anti-inflammatory GI actions."},
  "GHK-Cu|TB-500":                 {type:"clinic",    note:"Collagen + actin-sequestering — wound healing stack."},

  // Longevity stacks (clinic/compatible)
  "Epithalon|MOTS-c":              {type:"clinic",    note:"Telomere + mitochondrial longevity — complementary mechanisms."},
  "Epithalon|TA1":                 {type:"clinic",    note:"Pineal + thymic immune modulation — classic longevity clinic stack."},
  "MOTS-c|NAD+":                   {type:"clinic",    note:"Mitochondrial optimization — MOTS-c + NAD+ precursor synergy."},
  "Thymalin|TA1":                  {type:"clinic",    note:"Thymic peptides — complementary immune modulation."},
  "Pinealon|Epithalon":            {type:"clinic",    note:"Pineal gland peptides — used together in longevity protocols."},

  // Cognitive / neuro (compatible)
  "Selank|Semax":                  {type:"clinic",    note:"Anxiolytic + cognitive enhancement — morning Semax / afternoon Selank pattern."},
  "Dihexa|Semax":                  {type:"compatible",note:"Synaptogenesis + BDNF enhancement — experimental cognitive stack."},
  "DSIP|Selank":                   {type:"compatible",note:"Sleep-inducing peptide + anxiolytic — evening calming stack."},
  "PE-22-28|Semax":                {type:"compatible",note:"Antidepressant + cognitive enhancement — anecdotal pairing."},

  // Melanocortin / sexual health (compatible)
  "PT-141|Kisspeptin":             {type:"compatible",note:"Melanocortin + GnRH axis — may amplify libido effects."},
  "Melanotan|HCG":                 {type:"caution",   note:"Both affect gonadal/hormonal axis — monitor testosterone/estrogen. Anecdotal caution."},

  // GHK-Cu combinations
  "GHK-Cu|Retatrutide":            {type:"compatible",note:"Skin/collagen support alongside GLP-1 — no known conflict."},
  "GHK-Cu|Epithalon":             {type:"compatible",note:"Skin + longevity pairing — compatible mechanisms."},

  // Fat-loss / metabolic
  "AOD-9604|Retatrutide":          {type:"compatible",note:"AOD fat-mobilization + GLP-1 appetite suppression — additive fat loss anecdotally."},
  "AOD-9604|Ipamorelin":           {type:"clinic",    note:"Fat loss + GH pulse — commonly used together in body recomp clinics."},
  "AOD-9604|CJC-1295 no DAC":      {type:"clinic",    note:"Fat mobilization + GH pulse — common clinic combination."},

  // HGH-related
  "HGH|Ipamorelin":                {type:"caution",   note:"Exogenous GH + GHRP may over-stimulate — redundant if HGH is already adequate. Use lower doses."},
  "HGH|CJC-1295 no DAC":           {type:"caution",   note:"Exogenous GH + GHRH analog — may suppress natural axis further. Anecdotal caution."},
  "HGH Frag 176-191|Ipamorelin":   {type:"compatible",note:"HGH fragment (fat-only effect) + GHRP — no full HGH overlap."},
  "IGF-1 LR3|Ipamorelin":          {type:"caution",   note:"IGF-1 + GHRP may have redundant downstream effects. Monitor IGF-1 levels."},

  // GHRP redundancy / caution
  "GHRP-2|GHRP-6":                 {type:"caution",   note:"Same receptor mechanism — running two GHRPs rarely adds benefit and increases sides. Choose one."},
  "GHRP-2|Hexarelin":              {type:"caution",   note:"Redundant GHRPs — stacking same-class secretagogues has diminishing returns."},
  "GHRP-6|Hexarelin":              {type:"caution",   note:"Redundant GHRPs — choose one or alternate."},

  // GLP-1 cautions / avoid
  "Retatrutide|GHRP-2":            {type:"caution",   note:"GLP-1/GIP agonist + GHRP — appetite effects may conflict. Anecdotal caution."},
  "Retatrutide|GHRP-6":            {type:"caution",   note:"GLP-1/GIP agonist + GHRP — GI load overlap. Anecdotal caution."},
  "Retatrutide|HGH":               {type:"caution",   note:"GLP-1 + exogenous GH — metabolic complexity. Clinician guidance recommended."},
  "Retatrutide|Hexarelin":          {type:"caution",   note:"GLP-1/GIP + potent GHRP — monitor GH axis and GI symptoms."},

  // Known avoid combinations
  "Melanotan|PT-141":               {type:"avoid",     note:"Both are melanocortin agonists — taking both amplifies receptor stimulation unpredictably. Use one."},
  "CJC+DAC|CJC-1295 no DAC":        {type:"avoid",     note:"Same peptide, different half-lives — redundant, not additive. Use one formulation."},
  "GHRP-2|Kisspeptin":              {type:"caution",   note:"GHRP GH-axis + GnRH-axis activation — anecdotal reports of hormonal imbalance."},
};

// Backwards-compatible STACK_INTERACTIONS for any existing code
const STACK_INTERACTIONS = Object.entries(PEPTIDE_INTERACTIONS).filter(([,v])=>v.type==="clinic"||v.type==="compatible").map(([k,v])=>{const [a,b]=k.split("|");return {a,b,type:v.type==="clinic"?"synergy":"compatible",note:v.note};});

function getInteractions(compounds) {
  const names = compounds.map(c=>c.name);
  const hits = [];
  for(let i=0;i<names.length;i++) for(let j=i+1;j<names.length;j++) {
    const hit = STACK_INTERACTIONS.find(x=>(x.a===names[i]&&x.b===names[j])||(x.a===names[j]&&x.b===names[i]));
    if(hit) hits.push(hit);
  }
  return hits;
}

function stackComplexity(compounds) {
  const n = compounds.length;
  const routes = new Set(compounds.map(c=>c.route));
  if(n<=1) return {label:"Simple",color:"#7DF9C0",score:1};
  if(n<=2&&routes.size<=1) return {label:"Low",color:"#7DF9C0",score:2};
  if(n<=3) return {label:"Medium",color:"#F9C87D",score:3};
  return {label:"High",color:"#ff7c7c",score:4};
}

function protocolBuilderModal(existing) {
  let proto = existing ? JSON.parse(JSON.stringify(existing)) : {
    id:uid(), name:"", goalId:"", goal:"", status:"draft", startDate:localDate(),
    compounds:[], schedule:{type:"Weekly",days:[6],dosesPerDay:1,times:["08:00"]}, notes:""
  };

  // Unlike the Mixed Syringe / Combo Dose compound pickers, blends belong here — a
  // protocol's stack is just "what am I taking," and a blend (KLOW, GLOW, etc.) is one
  // named thing you take, not something that needs drawing into yet another syringe.
  // Previously this filtered blends out the same way those two do, which is why KLOW only
  // ever showed up for someone who'd already added it to Stash (picked up via
  // customPeptides as a side effect) rather than being a real, always-available option.
  const ALL_COMPOUNDS = [...new Set([...Object.keys(PEPTIDES),...LIBRARY.map(l=>l.name),...Object.keys(state.customPeptides||{})])].sort();
  let step = existing ? 2 : 0; // skip goal/template if editing
  const STEPS = existing
    ? ["Stack","Schedule","Phases","Review"]
    : ["Goal","Template","Stack","Schedule","Phases","Review"];

  const curStep = () => STEPS[step];

  function rebuildModal() {
    const count = document.getElementById("proto-builder-count");
    if(count) count.textContent = (step+1)+"/"+STEPS.length;
    const b = document.getElementById("proto-builder-body");
    if(b) b.innerHTML=buildStep();
    const nav=document.getElementById("proto-builder-nav");
    if(nav) nav.innerHTML=buildNav();
    wireStep();
  }

  function buildNav() {
    const isLast=step===STEPS.length-1;
    const isFirst=step===0;
    return `<div style="display:flex;gap:8px">
      <button id="pb-prev" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:${isFirst?"var(--t5)":"var(--t2)"};font-size:13px;pointer-events:${isFirst?"none":"auto"}">← Back</button>
      ${isLast?`<button id="pb-save-draft" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px">Save Draft</button>
      <button id="pb-activate" style="flex:1;padding:11px;border-radius:10px;background:#A78BFA;color:#fff;font-size:13px;font-weight:700">▶ Activate</button>`
      :`<button id="pb-next" style="flex:2;padding:11px;border-radius:10px;background:#A78BFA;color:#fff;font-size:13px;font-weight:700">Next →</button>`}
    </div>`;
  }

  function buildStep() {
    const prog = `<div style="display:flex;gap:3px;margin-bottom:14px">${STEPS.map((_,i)=>`<div style="flex:1;height:3px;border-radius:3px;background:${i<=step?"#A78BFA":"var(--border)"}"></div>`).join("")}</div>
    <div style="font-size:10px;color:#A78BFA;letter-spacing:1.5px;margin-bottom:12px" class="mono">STEP ${step+1} — ${curStep().toUpperCase()}</div>`;

    if(curStep()==="Goal") return prog+`
      <div style="font-size:13px;color:var(--t2);margin-bottom:12px">What is the primary purpose of this protocol?</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${PROTO_GOALS.map(g=>`<button class="pb-goal" data-id="${g.id}" data-label="${esc(g.label)}" style="padding:12px 14px;border-radius:10px;text-align:left;background:${proto.goalId===g.id?"#A78BFA18":"var(--surface-2)"};border:1px solid ${proto.goalId===g.id?"#A78BFA":"var(--border-sub)"};color:var(--t1)">
          <span style="font-size:16px;margin-right:8px">${g.icon}</span><b>${esc(g.label)}</b>
          <div style="font-size:11px;color:var(--t4);margin-top:2px;margin-left:26px">${esc(g.desc)}</div>
        </button>`).join("")}
      </div>`;

    if(curStep()==="Template") {
      const templates = PROTO_TEMPLATES[proto.goalId] || PROTO_TEMPLATES.weight_loss;
      return prog+`
      <div style="font-size:13px;color:var(--t2);margin-bottom:4px">Choose a starting point:</div>
      <div style="font-size:11px;color:var(--t4);margin-bottom:10px">These are commonly researched stack ideas — not medical recommendations. Always consult a clinician.</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${templates.map(t=>`<button class="pb-tmpl" data-id="${t.id}" style="padding:12px 14px;border-radius:10px;text-align:left;background:${proto._templateId===t.id?"#A78BFA18":"var(--surface-2)"};border:1px solid ${proto._templateId===t.id?"#A78BFA":"var(--border-sub)"};color:var(--t1)">
          <div style="font-weight:600;margin-bottom:2px">${esc(t.label)}</div>
          <div style="font-size:11px;color:var(--t4)">${esc(t.desc)}</div>
          ${t.compounds.length?`<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">${t.compounds.map(c=>`<span style="font-size:10px;color:#A78BFA;background:#A78BFA15;padding:1px 6px;border-radius:4px">${esc(c.name)}</span>`).join("")}</div>`:""}
        </button>`).join("")}
      </div>`;
    }

    if(curStep()==="Stack") {
      const cx = stackComplexity(proto.compounds);
      const interactions = getInteractions(proto.compounds);
      const selCards = proto.compounds.map((c,i)=>`<div class="nx-proto-stack-selected" style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:8px;padding:9px 12px;margin-bottom:6px;display:flex;align-items:center;gap:8px">
        <div style="flex:1;font-size:13px;color:var(--t1)">${esc(c.name)}</div>
        <select class="pb-route" data-idx="${i}" style="font-size:11px;color:var(--t3);background:var(--surface-3);border:1px solid var(--border);border-radius:5px;padding:2px 6px">${ROUTES.map(r=>`<option${c.route===r?" selected":""}>${r}</option>`).join("")}</select>
        <button class="pb-crem" data-idx="${i}" type="button" aria-label="Remove ${esc(c.name)}" style="color:var(--t5);font-size:13px">✕</button>
      </div>`).join("");
      return prog+
      (proto.compounds.length?`
        ${cx.score>=3?`<div style="background:${cx.color}12;border:1px solid ${cx.color}33;border-radius:8px;padding:8px 12px;margin-bottom:8px;font-size:11px;color:${cx.color}">Stack complexity: <b>${cx.label}</b>${cx.score>=4?" — consider isolating effects":""}</div>`:""}
        ${selCards}
        ${interactions.length?`<div style="margin-bottom:8px">${interactions.map(x=>`<div style="font-size:11px;padding:4px 0;color:${x.type==="synergy"?"#7DF9C0":"var(--t3)"}">
          ${x.type==="synergy"?"✦":"✓"} <b>${esc(x.a)} + ${esc(x.b)}</b> — ${esc(x.note)}</div>`).join("")}</div>`:""}`:"")
      +`<div class="nx-proto-compound-search">
        <svg viewBox="0 0 24 24" width="19" height="19" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="10.8" cy="10.8" r="6.6"/><path d="m16 16 4.1 4.1"/></svg>
        <input id="pb-csearch" type="search" class="inp" aria-label="Search compounds to add" placeholder="Search compounds…" autocomplete="off">
      </div>
      <div id="pb-clist" style="max-height:150px;overflow-y:auto;border:1px solid var(--border-sub);border-radius:8px;background:var(--surface-2)">
        ${ALL_COMPOUNDS.slice(0,30).map(n=>{const sel=proto.compounds.find(c=>c.name===n);const lib=LIBRARY.find(l=>l.name===n);return`<button class="pb-cadd" data-name="${esc(n)}" style="width:100%;text-align:left;padding:7px 12px;border:none;border-bottom:1px solid var(--surface-3);background:${sel?"#A78BFA10":"transparent"};color:${sel?"#A78BFA":"var(--t2)"};font-size:12px">
          ${sel?"✓ ":""}${esc(n)}${lib?.tags?.length?`<span style="font-size:9px;color:var(--t5);margin-left:6px">${lib.tags.slice(0,2).join(" · ")}</span>`:""}
        </button>`;}).join("")}
      </div>`;
    }

    if(curStep()==="Schedule") {
      const multiComp=proto.compounds.length>1;
      const sameForAll=proto._sameSchedule!==false;
      // Ensure each compound has a schedule
      proto.compounds.forEach(c=>{ if(!c.schedule) c.schedule=JSON.parse(JSON.stringify(proto.schedule)); });

      const schedBlock=(s,ci)=>{
        const dpw=s.dosesPerDay*(s.days?.length||1);
        return`<div class="pb-comp-sched" data-ci="${ci}" style="${ci>-1?"background:var(--surface-3);border-radius:8px;padding:10px;margin-bottom:8px":""}">
          ${ci>-1?`<div style="font-size:11px;font-weight:600;color:#A78BFA;margin-bottom:8px">${esc(proto.compounds[ci]?.name)}</div>`:""}
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">
            ${["Daily","Every Other Day","3x/Week","Weekdays","Weekly"].map(sc=>`<button class="pb-sched" data-ci="${ci}" data-s="${sc}" style="padding:4px 10px;border-radius:99px;font-size:10px;background:${s.type===sc?"#A78BFA22":"transparent"};border:1px solid ${s.type===sc?"#A78BFA":"var(--border)"};color:${s.type===sc?"#A78BFA":"var(--t3)"}">${sc}</button>`).join("")}
          </div>
          <div style="display:flex;gap:4px;justify-content:center;margin-bottom:8px">
            ${DAYS_OF_WEEK.map((d,i)=>`<button class="pb-day" data-ci="${ci}" data-i="${i}" style="width:32px;height:32px;border-radius:50%;font-size:10px;font-weight:600;background:${(s.days||[]).includes(i)?"#A78BFA":"var(--surface-2)"};color:${(s.days||[]).includes(i)?"#fff":"var(--t3)"};border:1px solid ${(s.days||[]).includes(i)?"#A78BFA":"var(--border)"}">${d}</button>`).join("")}
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <span style="font-size:11px;color:var(--t3);flex:1">Doses per day</span>
            <button class="pb-dpdec" data-ci="${ci}" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--border);color:var(--t2);font-size:16px">−</button>
            <span style="font-size:14px;font-weight:700;min-width:20px;text-align:center">${s.dosesPerDay}</span>
            <button class="pb-dpinc" data-ci="${ci}" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--border);color:var(--t2);font-size:16px">+</button>
          </div>
          ${Array.from({length:s.dosesPerDay},(_,i)=>`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><span style="font-size:11px;color:var(--t4)">${s.dosesPerDay>1?"Dose "+(i+1):"Time"}</span><input type="time" class="pb-time inp" data-ci="${ci}" data-i="${i}" value="${s.times[i]||"08:00"}" style="height:32px;padding:0 8px;width:110px"></div>`).join("")}
          <div style="font-size:10px;color:var(--t5);margin-top:4px">→ ${dpw} dose${dpw!==1?"s":""}/week</div>
        </div>`;
      };

      return prog+`
      <input id="pb-start" class="inp" type="date" value="${proto.startDate}" style="width:100%;margin-bottom:12px">
      ${multiComp?`<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--surface-2);border-radius:8px;margin-bottom:10px">
        <span style="font-size:12px;color:var(--t2)">Same schedule for all compounds</span>
        <label style="position:relative;display:inline-block;width:38px;height:22px"><input type="checkbox" id="pb-same-sched" ${sameForAll?"checked":""} style="opacity:0;width:0;height:0"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${sameForAll?"#A78BFA":"var(--border)"};border-radius:11px;transition:.2s"></span></label>
      </div>`:""}
      ${sameForAll||!multiComp
        ? schedBlock(proto.schedule,-1)
        : proto.compounds.map((_,ci)=>schedBlock(proto.compounds[ci].schedule||proto.schedule,ci)).join("")
      }`;
    }

    if(curStep()==="Phases") {
      if(!proto.compounds.length) return prog+`<div style="text-align:center;padding:20px;color:var(--t4)">Add compounds in the Stack step first.</div>`;
      return prog+proto.compounds.map((c,ci)=>`
      <div style="margin-bottom:14px;padding:12px;background:var(--surface-2);border-radius:10px">
        <div style="font-size:12px;font-weight:600;color:#A78BFA;margin-bottom:8px">${esc(c.name)} · ${esc(c.route||"SubQ")}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:11px;color:var(--t4)">Multi-phase (escalation)</span>
          <label style="position:relative;display:inline-block;width:38px;height:22px"><input type="checkbox" class="pb-multiphase" data-ci="${ci}" ${c.multiPhase?"checked":""} style="opacity:0;width:0;height:0"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${c.multiPhase?"#A78BFA":"var(--border)"};border-radius:11px;transition:.2s"></span></label>
        </div>
        ${(c.phases||[{type:"dose",durationWeeks:4,dose:""}]).map((ph,pi)=>`
        <div style="background:var(--surface-3);border-radius:8px;padding:9px;margin-bottom:5px">
          <div style="display:flex;gap:5px;margin-bottom:7px">
            <button class="pb-ptype" data-ci="${ci}" data-pi="${pi}" data-t="dose" style="flex:1;padding:4px;border-radius:6px;font-size:11px;background:${ph.type==="dose"?"#A78BFA22":"transparent"};border:1px solid ${ph.type==="dose"?"#A78BFA":"var(--border)"};color:${ph.type==="dose"?"#A78BFA":"var(--t4)"}">Dose</button>
            <button class="pb-ptype" data-ci="${ci}" data-pi="${pi}" data-t="rest" style="flex:1;padding:4px;border-radius:6px;font-size:11px;background:${ph.type==="rest"?"#F9C87D22":"transparent"};border:1px solid ${ph.type==="rest"?"#F9C87D":"var(--border)"};color:${ph.type==="rest"?"#F9C87D":"var(--t4)"}">Rest</button>
            ${pi>0?`<button class="pb-phrem" data-ci="${ci}" data-pi="${pi}" style="padding:4px 8px;border-radius:6px;border:1px solid var(--border);color:var(--t5);font-size:11px">✕</button>`:""}
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:11px;color:var(--t4);flex:1">Duration (weeks)</span>
            <button class="pb-phdec" data-ci="${ci}" data-pi="${pi}" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--border);color:var(--t2)">−</button>
            <span style="font-size:13px;font-weight:600;min-width:24px;text-align:center">${ph.durationWeeks||4}w</span>
            <button class="pb-phinc" data-ci="${ci}" data-pi="${pi}" style="width:26px;height:26px;border-radius:50%;border:1px solid var(--border);color:var(--t2)">+</button>
          </div>
          ${ph.type==="dose"?`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><input class="pb-phdose inp" data-ci="${ci}" data-pi="${pi}" type="number" placeholder="Amount" value="${ph.dose||""}" style="flex:1;height:34px;padding:0 10px"><span style="font-size:11px;color:var(--t4)">${c.unit||cfg(c.name)?.unit||"mg"}</span></div>`:"<div style='font-size:11px;color:var(--t4);margin-bottom:8px'>Rest — no dosing</div>"}
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:1px solid var(--border-sub)">
            <span style="font-size:10px;color:var(--t4)">Different schedule for this phase</span>
            <label style="position:relative;display:inline-block;width:32px;height:18px"><input type="checkbox" class="pb-ph-sched-toggle" data-ci="${ci}" data-pi="${pi}" ${ph.schedule?"checked":""} style="opacity:0;width:0;height:0"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${ph.schedule?"#A78BFA":"var(--border)"};border-radius:9px;transition:.2s"></span></label>
          </div>
          ${ph.schedule ? (()=>{
            const s = ph.schedule;
            return `<div style="margin-top:8px;background:var(--surface-2);border-radius:7px;padding:8px">
              <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px">
                ${["Daily","Every Other Day","3x/Week","Weekdays","Weekly"].map(sc=>`<button class="pb-ph-sched" data-ci="${ci}" data-pi="${pi}" data-s="${sc}" style="padding:3px 8px;border-radius:99px;font-size:9px;background:${s.type===sc?"#A78BFA22":"transparent"};border:1px solid ${s.type===sc?"#A78BFA":"var(--border)"};color:${s.type===sc?"#A78BFA":"var(--t3)"}">${sc}</button>`).join("")}
              </div>
              <div style="display:flex;gap:3px;justify-content:center;margin-bottom:6px">
                ${DAYS_OF_WEEK.map((d,i)=>`<button class="pb-ph-day" data-ci="${ci}" data-pi="${pi}" data-i="${i}" style="width:24px;height:24px;border-radius:50%;font-size:9px;font-weight:600;background:${(s.days||[]).includes(i)?"#A78BFA":"var(--surface-3)"};color:${(s.days||[]).includes(i)?"#fff":"var(--t3)"};border:1px solid ${(s.days||[]).includes(i)?"#A78BFA":"var(--border)"}">${d}</button>`).join("")}
              </div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span style="font-size:10px;color:var(--t3);flex:1">Doses per day</span>
                <button class="pb-ph-dpdec" data-ci="${ci}" data-pi="${pi}" style="width:22px;height:22px;border-radius:50%;border:1px solid var(--border);color:var(--t2);font-size:13px">−</button>
                <span style="font-size:12px;font-weight:700;min-width:14px;text-align:center">${s.dosesPerDay||1}</span>
                <button class="pb-ph-dpinc" data-ci="${ci}" data-pi="${pi}" style="width:22px;height:22px;border-radius:50%;border:1px solid var(--border);color:var(--t2);font-size:13px">+</button>
              </div>
              ${Array.from({length:s.dosesPerDay||1},(_,i)=>`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px"><span style="font-size:10px;color:var(--t4)">${(s.dosesPerDay||1)>1?"Dose "+(i+1):"Time"}</span><input type="time" class="pb-ph-time inp" data-ci="${ci}" data-pi="${pi}" data-i="${i}" value="${(s.times||[])[i]||"08:00"}" style="height:28px;padding:0 6px;width:100px;font-size:11px"></div>`).join("")}
            </div>`;
          })() : ""}
        </div>`).join("")}
        ${c.multiPhase?`<button class="pb-addphase" data-ci="${ci}" style="width:100%;padding:6px;border-radius:7px;border:1px dashed var(--border-sub);color:#A78BFA;font-size:11px;margin-top:4px">+ Add Phase</button>`:""}
      </div>`).join("");
    }

    if(curStep()==="Review") {
      const totalWeeks=Math.max(1,...proto.compounds.map(c=>((c.phases||[]).reduce((a,p)=>a+(p.durationWeeks||4),0))||8));
      const gantt=proto.compounds.map(c=>{const bars=(c.phases||[{type:"dose",durationWeeks:totalWeeks}]).map(ph=>`<div style="flex:${ph.durationWeeks||4};background:${ph.type==="dose"?"#A78BFA":"#444"};height:10px;border-radius:2px"></div>`).join(""); return`<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px"><span style="font-size:9px;color:var(--t4);width:60px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}</span><div style="flex:1;display:flex;gap:2px">${bars}</div><span style="font-size:9px;color:var(--t5);flex-shrink:0">${totalWeeks}w</span></div>`;}).join("");
      const cx=stackComplexity(proto.compounds);
      const interactions=getInteractions(proto.compounds);
      const dosesPerWeek=proto.schedule.dosesPerDay*(proto.schedule.days?.length||1);
      return prog+`
      <input id="pb-name" class="inp" placeholder="Protocol name *" value="${esc(proto.name)}" style="width:100%;margin-bottom:8px">
      <textarea id="pb-notes" class="inp" placeholder="Notes (optional)" style="width:100%;min-height:50px;resize:vertical;margin-bottom:12px">${esc(proto.notes||"")}</textarea>
      <label for="pb-personal-goal" class="field-label">LINK A PERSONAL GOAL (OPTIONAL)</label>
      <select id="pb-personal-goal" class="inp" style="width:100%;min-height:44px;margin-bottom:6px">
        <option value="">No linked personal goal</option>
        ${(state.plans?.goals||[]).map(g=>`<option value="${esc(String(g.id))}"${String(proto.linkedGoalId||"")===String(g.id)?" selected":""}>${esc(g.name)}</option>`).join("")}
      </select>
      <div class="nx-muted" style="font-size:11px;margin-bottom:14px">This links an existing goal for context. It doesn't change the protocol's purpose, dosing schedule or dose history.</div>
      <div style="background:var(--surface-2);border-radius:10px;padding:12px;margin-bottom:10px">
        <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">📊 PHASE TIMELINE</div>
        ${gantt||"<div style='color:var(--t5);font-size:11px'>No compounds added.</div>"}
        <div style="display:flex;gap:10px;margin-top:6px"><div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;background:#A78BFA;border-radius:2px"></div><span style="font-size:9px;color:var(--t4)">Active</span></div><div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;background:#444;border-radius:2px"></div><span style="font-size:9px;color:var(--t4)">Rest</span></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        <div style="background:var(--surface-2);border-radius:8px;padding:8px 10px"><div style="font-size:9px;color:var(--t4)">COMPOUNDS</div><div style="font-size:14px;font-weight:700;color:var(--t1)">${proto.compounds.length}</div></div>
        <div style="background:var(--surface-2);border-radius:8px;padding:8px 10px"><div style="font-size:9px;color:var(--t4)">DOSES/WEEK</div><div style="font-size:14px;font-weight:700;color:var(--t1)">${dosesPerWeek}</div></div>
        <div style="background:var(--surface-2);border-radius:8px;padding:8px 10px"><div style="font-size:9px;color:var(--t4)">DURATION</div><div style="font-size:14px;font-weight:700;color:var(--t1)">${totalWeeks}w</div></div>
        <div style="background:var(--surface-2);border-radius:8px;padding:8px 10px"><div style="font-size:9px;color:var(--t4)">COMPLEXITY</div><div style="font-size:13px;font-weight:700;color:${cx.color}">${cx.label}</div></div>
      </div>
      ${interactions.length?`<div style="margin-bottom:10px">${interactions.map(x=>`<div style="font-size:11px;padding:3px 0;color:${x.type==="synergy"?"#7DF9C0":"var(--t3)"}">✦ ${esc(x.a)} + ${esc(x.b)} — ${esc(x.note)}</div>`).join("")}</div>`:""}
      <div style="display:flex;flex-wrap:wrap;gap:5px">${proto.compounds.map(c=>`<span class="pill" style="background:#A78BFA18;color:#A78BFA;border:1px solid #A78BFA33">${esc(c.name)} · ${esc(c.route||"SubQ")}</span>`).join("")}</div>`;
    }
    return prog;
  }

  function wireStep() {
    const m=document.getElementById("proto-builder-wrap");if(!m)return;
    m.querySelector("#pb-prev")?.addEventListener("click",()=>{step--;rebuildModal();});
    m.querySelector("#pb-next")?.addEventListener("click",()=>{step++;rebuildModal();});
    m.querySelector("#pb-save-draft")?.addEventListener("click",()=>saveProto("draft"));
    m.querySelector("#pb-activate")?.addEventListener("click",()=>saveProto("active"));
    m.querySelector("#pb-personal-goal")?.addEventListener("change",ev=>{proto.linkedGoalId=ev.target.value||"";});

    m.querySelectorAll(".pb-goal").forEach(b=>b.onclick=()=>{proto.goalId=b.dataset.id;proto.goal=b.dataset.label;rebuildModal();});
    m.querySelectorAll(".pb-tmpl").forEach(b=>b.onclick=()=>{
      const templates=PROTO_TEMPLATES[proto.goalId]||[];
      const tmpl=templates.find(t=>t.id===b.dataset.id);
      if(tmpl){proto._templateId=tmpl.id;if(tmpl.compounds.length)proto.compounds=JSON.parse(JSON.stringify(tmpl.compounds));if(tmpl.schedule)proto.schedule=JSON.parse(JSON.stringify(tmpl.schedule));}
      rebuildModal();
    });
    m.querySelectorAll(".pb-cadd").forEach(b=>b.onclick=()=>toggleCompound(b.dataset.name));
    const cs=m.querySelector("#pb-csearch");
    if(cs) cs.oninput=()=>{
      const q=cs.value.toLowerCase();
      const list=m.querySelector("#pb-clist");
      if(list) list.innerHTML=ALL_COMPOUNDS.filter(n=>n.toLowerCase().includes(q)||(LIBRARY.find(l=>l.name===n)?.aliases||[]).some(a=>a.toLowerCase().includes(q))).slice(0,25).map(n=>{const sel=proto.compounds.find(c=>c.name===n);const lib=LIBRARY.find(l=>l.name===n);return`<button class="pb-cadd" data-name="${esc(n)}" style="width:100%;text-align:left;padding:7px 12px;border:none;border-bottom:1px solid var(--surface-3);background:${sel?"#A78BFA10":"transparent"};color:${sel?"#A78BFA":"var(--t2)"};font-size:12px">${sel?"✓ ":""}${esc(n)}${lib?.tags?.length?`<span style="font-size:9px;color:var(--t5);margin-left:6px">${lib.tags.slice(0,2).join(" · ")}</span>`:""}</button>`;}).join("");
      m.querySelectorAll(".pb-cadd").forEach(b=>b.onclick=()=>toggleCompound(b.dataset.name));
    };
    m.querySelectorAll(".pb-route").forEach(b=>b.onchange=()=>{if(proto.compounds[+b.dataset.idx])proto.compounds[+b.dataset.idx].route=b.value;});
    m.querySelectorAll(".pb-crem").forEach(b=>b.onclick=()=>{proto.compounds.splice(+b.dataset.idx,1);rebuildModal();});
    m.querySelector("#pb-start")?.addEventListener("input",e=>{proto.startDate=e.target.value;});
    m.querySelector("#pb-same-sched")?.addEventListener("change",e=>{
      proto._sameSchedule=e.target.checked;
      if(e.target.checked) proto.compounds.forEach(c=>c.schedule=JSON.parse(JSON.stringify(proto.schedule)));
      rebuildModal();
    });
    const getS=(ci)=>(ci==="-1"||ci===-1||proto._sameSchedule!==false)?proto.schedule:(proto.compounds[+ci]?.schedule||proto.schedule);
    m.querySelectorAll(".pb-sched").forEach(b=>b.onclick=()=>{
      const s=getS(b.dataset.ci);const sc=b.dataset.s;s.type=sc;
      if(sc==="Daily")s.days=[0,1,2,3,4,5,6];
      else if(sc==="Weekdays")s.days=[1,2,3,4,5];
      else if(sc==="Weekly")s.days=[6];
      else if(sc==="Every Other Day")s.days=[0,2,4,6];
      else if(sc==="3x/Week")s.days=[1,3,5];
      if(proto._sameSchedule!==false) proto.compounds.forEach(c=>c.schedule=JSON.parse(JSON.stringify(proto.schedule)));
      rebuildModal();
    });
    m.querySelectorAll(".pb-day").forEach(b=>b.onclick=()=>{
      const s=getS(b.dataset.ci);const i=+b.dataset.i;const idx=(s.days||[]).indexOf(i);
      idx>=0?s.days.splice(idx,1):s.days.push(i);
      if(proto._sameSchedule!==false) proto.compounds.forEach(c=>c.schedule=JSON.parse(JSON.stringify(proto.schedule)));
      rebuildModal();
    });
    m.querySelectorAll(".pb-dpdec").forEach(b=>b.onclick=()=>{const s=getS(b.dataset.ci);if(s.dosesPerDay>1)s.dosesPerDay--;if(proto._sameSchedule!==false)proto.compounds.forEach(c=>c.schedule=JSON.parse(JSON.stringify(proto.schedule)));rebuildModal();});
    m.querySelectorAll(".pb-dpinc").forEach(b=>b.onclick=()=>{const s=getS(b.dataset.ci);if(s.dosesPerDay<4)s.dosesPerDay++;if(proto._sameSchedule!==false)proto.compounds.forEach(c=>c.schedule=JSON.parse(JSON.stringify(proto.schedule)));rebuildModal();});
    m.querySelectorAll(".pb-time").forEach(b=>b.oninput=()=>{const s=getS(b.dataset.ci);s.times[+b.dataset.i]=b.value;});
    m.querySelectorAll(".pb-multiphase").forEach(cb=>cb.onchange=()=>{const ci=+cb.dataset.ci;proto.compounds[ci].multiPhase=cb.checked;if(!proto.compounds[ci].phases||proto.compounds[ci].phases.length<1)proto.compounds[ci].phases=[{type:"dose",durationWeeks:4,dose:""}];rebuildModal();});
    m.querySelectorAll(".pb-ptype").forEach(b=>b.onclick=()=>{const ci=+b.dataset.ci,pi=+b.dataset.pi;if(proto.compounds[ci]?.phases?.[pi])proto.compounds[ci].phases[pi].type=b.dataset.t;rebuildModal();});
    m.querySelectorAll(".pb-phdec").forEach(b=>b.onclick=()=>{const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi];if(ph&&ph.durationWeeks>1)ph.durationWeeks--;rebuildModal();});
    m.querySelectorAll(".pb-phinc").forEach(b=>b.onclick=()=>{const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi];if(ph)ph.durationWeeks=(ph.durationWeeks||4)+1;rebuildModal();});
    m.querySelectorAll(".pb-phdose").forEach(b=>b.oninput=()=>{const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi];if(ph)ph.dose=b.value;});
    m.querySelectorAll(".pb-addphase").forEach(b=>b.onclick=()=>{const c=proto.compounds[+b.dataset.ci];if(c){if(!c.phases)c.phases=[];c.phases.push({type:"dose",durationWeeks:4,dose:""});rebuildModal();}});
    m.querySelectorAll(".pb-phrem").forEach(b=>b.onclick=()=>{const c=proto.compounds[+b.dataset.ci];if(c?.phases){c.phases.splice(+b.dataset.pi,1);rebuildModal();}});
    // Per-phase schedule override — a phase can change BOTH dose and cadence (e.g.
    // Placenta's loading phase is daily/2x while maintenance is weekly). Toggling on
    // seeds the phase's schedule from the compound's Step 4 schedule, so it starts as a
    // sensible default rather than blank.
    m.querySelectorAll(".pb-ph-sched-toggle").forEach(cb=>cb.onchange=()=>{
      const ci=+cb.dataset.ci, pi=+cb.dataset.pi, c=proto.compounds[ci], ph=c?.phases?.[pi];
      if (!ph) return;
      if (cb.checked) ph.schedule = JSON.parse(JSON.stringify(c.schedule||proto.schedule));
      else delete ph.schedule;
      rebuildModal();
    });
    m.querySelectorAll(".pb-ph-sched").forEach(b=>b.onclick=()=>{
      const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi]; if(!ph?.schedule) return;
      const sc=b.dataset.s; ph.schedule.type=sc;
      if(sc==="Daily")ph.schedule.days=[0,1,2,3,4,5,6];
      else if(sc==="Weekdays")ph.schedule.days=[1,2,3,4,5];
      else if(sc==="Weekly")ph.schedule.days=[6];
      else if(sc==="Every Other Day")ph.schedule.days=[0,2,4,6];
      else if(sc==="3x/Week")ph.schedule.days=[1,3,5];
      rebuildModal();
    });
    m.querySelectorAll(".pb-ph-day").forEach(b=>b.onclick=()=>{
      const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi]; if(!ph?.schedule) return;
      const i=+b.dataset.i; const idx=(ph.schedule.days||[]).indexOf(i);
      idx>=0?ph.schedule.days.splice(idx,1):(ph.schedule.days=ph.schedule.days||[],ph.schedule.days.push(i));
      rebuildModal();
    });
    m.querySelectorAll(".pb-ph-dpdec").forEach(b=>b.onclick=()=>{const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi];if(ph?.schedule&&ph.schedule.dosesPerDay>1)ph.schedule.dosesPerDay--;rebuildModal();});
    m.querySelectorAll(".pb-ph-dpinc").forEach(b=>b.onclick=()=>{const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi];if(ph?.schedule){ph.schedule.dosesPerDay=Math.min(4,(ph.schedule.dosesPerDay||1)+1);rebuildModal();}});
    m.querySelectorAll(".pb-ph-time").forEach(b=>b.oninput=()=>{
      const ph=proto.compounds[+b.dataset.ci]?.phases?.[+b.dataset.pi]; if(!ph?.schedule) return;
      if(!ph.schedule.times) ph.schedule.times=[];
      ph.schedule.times[+b.dataset.i]=b.value;
    });
    m.querySelector("#pb-name")?.addEventListener("input",e=>{proto.name=e.target.value;});
    m.querySelector("#pb-notes")?.addEventListener("input",e=>{proto.notes=e.target.value;});
  }

  function toggleCompound(name){
    const idx=proto.compounds.findIndex(c=>c.name===name);
    if(idx>=0)proto.compounds.splice(idx,1);
    else proto.compounds.push({name,route:"SubQ",unit:cfg(name)?.unit||"mg",multiPhase:false,phases:[{type:"dose",durationWeeks:4,dose:""}]});
    rebuildModal();
  }

  function saveProto(status){
    if(!proto.name.trim()){proto.name=proto.goal||"New Protocol";}
    proto.status=status;
    if(!state.protocols)state.protocols=[];
    const idx=state.protocols.findIndex(p=>String(p.id)===String(proto.id));
    idx>=0?state.protocols[idx]=proto:state.protocols.push(proto);
    // Write the actual schedule (and per-phase overrides) onto the compound records the
    // dosing engine reads — a saved protocol drives Today/Next/Log Dose directly, not
    // just its own planning view. Runs on any LIVE save (active or in_progress — a
    // protocol flips to in_progress automatically the moment it has logged doses, which
    // is most of the time you'd actually be editing one), not only the very first
    // activation — otherwise editing a phase's dose or duration mid-protocol updates the
    // Protocol tab and its reminders while the real dosing engine silently keeps using
    // the old numbers.
    if (status==="active" || status==="in_progress") syncProtocolToCompoundData(proto);
    saveState();closeModal();renderBody();
  }

  const m=openModal(`<div id="proto-builder-wrap" style="display:flex;flex-direction:column;max-height:85vh">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-shrink:0">
      <button id="proto-builder-x" style="color:var(--t4);font-size:20px;padding:4px">✕</button>
      <span style="font-size:14px;font-weight:600;color:var(--t1)">${existing?"Edit Protocol":"New Protocol"}</span>
      <span id="proto-builder-count" aria-live="polite" style="font-size:11px;color:#A78BFA">${step+1}/${STEPS.length}</span>
    </div>
    <div id="proto-builder-body" style="flex:1;overflow-y:auto;padding-bottom:8px">${buildStep()}</div>
    <div id="proto-builder-nav" style="flex-shrink:0;padding-top:8px">${buildNav()}</div>
  </div>`,"#A78BFA");
  m.querySelector("#proto-builder-x").onclick=closeModal;
  wireStep();
}

// ── Protocols Tab View ────────────────────────────────────────────────────────
// Canonical month-scale instance collection — reuses getDayOccurrences() per compound
// per day, the same function powering Today/This Week/Nexus. No separate calendar-only
// dose calculation, and no fixed compound list: whichever compounds actually have
// activity (logged, skipped, rescheduled, or projected) in the given month show up here,
// automatically, for any number of compounds.
function getMonthInstances(year, month) {
  const aps = allPeptides();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const dayInstances = {};
  Object.entries(aps).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active").forEach(([n,d])=>{
    for (let day=1; day<=daysInMonth; day++) {
      const k = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      const slots = getDayOccurrences(d,k);
      if (!slots.length) continue;
      (dayInstances[k]=dayInstances[k]||[]).push(...slots.map(s=>({pep:n,color:cfg(n).color,unit:cfg(n).unit,...s})));
    }
  });
  return dayInstances;
}

function protocolCalendarView() {
  const calSub = state._protoCalSub||"month";
  const subBar=`<div class="seg nx-cal-segment" style="margin-bottom:14px">
    <button id="pcal-month" class="${calSub==="month"?"on":""}" onclick="">Month</button>
    <button id="pcal-logs" class="${calSub==="logs"?"on":""}" onclick="">Logs</button>
  </div>`;

  if(calSub==="logs") return subBar+logsView();

  const off = state._calOff||0;
  const now = new Date();
  const viewDate = new Date(now.getFullYear(), now.getMonth()+off, 1);
  const month = viewDate.getMonth(), year = viewDate.getFullYear();
  const firstDay = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const monthLabel = viewDate.toLocaleString("default",{month:"long",year:"numeric"});
  const todayStr = localDate();
  const showPaused = !!state._calShowPaused;
  const monthInstancesRaw = getMonthInstances(year, month);
  // Preserve real history. Only suppress schedule placeholders for paused periods.
  const monthInstances = Object.fromEntries(Object.entries(monthInstancesRaw).map(([day, slots]) =>
    [day, slots.filter(slot => showPaused || slot.status !== "paused")]
  ));

  // Day-cell auxiliary data (check-ins, weight) stays a simple date lookup — only the
  // dose/occurrence side needs the canonical engine.
  const dayData={};
  const addD=(date,key,val)=>{const k=dayKey(date);if(!dayData[k])dayData[k]={};dayData[k][key]=dayData[k][key]||[];dayData[k][key].push(val);};
  state.dailyLogs.forEach(l=>addD(l.date,"logs",l));
  state.weightLogs.forEach(l=>addD(l.date,"weight",l));
  (state.measurementLogs||[]).forEach(l=>addD(l.date,"measure",l));

  const dayCell=(day)=>{
    if(!day) return `<div></div>`;
    const k=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const d=dayData[k]||{};
    const isToday=k===todayStr;
    const slots=monthInstances[k]||[];
    // A fixed status vocabulary scales regardless of the number of compounds.
    const loggedCount = slots.filter(s=>s.status==="taken").length;
    const upcomingCount = slots.filter(s=>["pending","due_now","due_later_today","upcoming","overdue"].includes(s.status)).length;
    const pausedCount = slots.filter(s=>s.status==="paused").length;
    const mood=d.logs?.[0]?MOODS.find(m=>m.v===d.logs[0].mood):null;
    const wt=d.weight?.[0];
    const weightNum = wt && Number.isFinite(Number(wt.weight)) ? Number(wt.weight) : null;
    const weightLabel = weightNum === null ? '' : weightNum.toFixed(1);
    const dayDescription = [loggedCount+' logged',upcomingCount+' scheduled',mood?'Check-in '+mood.label:'',weightLabel?'Weight '+weightLabel+' pounds':''].filter(Boolean).join(', ');
    return `<button class="cal-day nx-cal-compact-day" data-date="${k}" aria-label="${k}: ${dayDescription}" ${isToday?'data-today="true"':''}>
      <span class="nx-cal-day-number">${day}</span>
      <span class="nx-cal-day-signals">
        ${loggedCount?`<span class="nx-cal-log-count" title="${loggedCount} logged">${loggedCount}</span>`:''}
        ${upcomingCount?`<span class="nx-cal-scheduled" title="${upcomingCount} scheduled"></span>`:''}
        ${pausedCount?`<span class="nx-cal-paused" title="Paused"></span>`:''}
        ${mood?`<span class="nx-cal-mood" title="Check-in: ${esc(mood.label)}">${mood.emoji}</span>`:''}
      </span>
      <span class="nx-cal-weight">${weightLabel || '&nbsp;'}</span>
    </button>`;
  };

  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);

  return subBar+`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
    <button id="cal-prev" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border);color:var(--t2);background:var(--surface-2)">‹</button>
    <span style="font-size:14px;font-weight:600;color:var(--t1)">${monthLabel}</span>
    <button id="cal-next" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border);color:var(--t2);background:var(--surface-2)">›</button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;margin-bottom:3px">
    ${["S","M","T","W","T","F","S"].map(d=>`<div style="text-align:center;font-size:9px;color:var(--t5);padding:3px 0">${d}</div>`).join("")}
  </div>
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:12px">
    ${cells.map(dayCell).join("")}
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:10px;padding-top:8px;border-top:1px solid var(--border-sub);align-items:center">
    <span style="font-size:11px;color:var(--t4)"><span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#A78BFA;margin-right:5px"></span>Logged</span>
    <span style="font-size:11px;color:var(--t4)"><span style="display:inline-block;width:12px;height:5px;border-radius:4px;background:var(--t4);opacity:.65;margin-right:5px;vertical-align:middle"></span>Scheduled</span>
    <span style="font-size:11px;color:var(--t4)">😐 Check-in</span>
    <span style="font-size:11px;color:var(--t4)"><span style="color:#8AB4FF">●</span> Weight</span>
  </div>
  <label style="display:flex;align-items:center;gap:9px;font-size:12px;color:var(--t3);margin-bottom:14px;cursor:pointer">
    <input type="checkbox" id="cal-show-paused" ${showPaused?"checked":""} style="accent-color:#A78BFA;width:17px;height:17px">
    Show paused scheduled entries
  </label>
  <div id="cal-day-detail"></div>`;
}

// Canonical phase-position calculator for a compound WITHIN a specific protocol — the
// ONE source every phase-aware surface reads from (Protocol card, Needs Attention
// reminders, the tappable phase bar, Nexus Chat), so none of them can ever disagree about
// where a protocol actually sits in its own timeline. Replaces the previous arrangement
// where the Protocol card computed this itself while the separate phase-transition
// reminder system read a different, not-always-synced copy of the same data — which is
// exactly why a phase change visible right on the card was never surfacing in Needs
// Attention.
function getProtocolPhaseInfo(p, c) {
  if (!p.startDate || !(c.phases||[]).length) return null;
  // Paused time doesn't count against phase progression — the effective start date shifts
  // forward by however many days the protocol has spent paused in total, and while
  // CURRENTLY paused, elapsed time is frozen at the moment pausing began rather than
  // continuing to accrue against real-world "today". Resuming picks up exactly where the
  // protocol left off instead of silently having jumped through phases while paused.
  const pauseDaysAccumulated = p.pauseDaysAccumulated||0;
  const effectiveStartDate = addDays(p.startDate, pauseDaysAccumulated);
  const today = (p.status==="paused" && p.pausedAt) ? dayKey(p.pausedAt) : localDate();
  let cursorDate = effectiveStartDate;
  const phaseDates = c.phases.map(ph=>{
    const dur = ph.durationWeeks||4;
    const start = cursorDate;
    const end = addDays(cursorDate, Math.round(dur*7));
    cursorDate = end;
    return { ...ph, startDate:start, endDate:end };
  });
  if (today < effectiveStartDate) return { notStartedYet:true, phases:phaseDates };
  const idx = phaseDates.findIndex(ph=>today>=ph.startDate && today<ph.endDate);
  if (idx===-1) return { done:true, phases:phaseDates };
  const cur = phaseDates[idx];
  const next = phaseDates[idx+1] || null;
  const weeksElapsed = Math.max(0,(new Date(today+"T12:00")-new Date(cur.startDate+"T12:00"))/(7*86400000));
  const weekInPhase = Math.floor(weeksElapsed)+1;
  const daysLeft = Math.max(0, Math.round((new Date(cur.endDate+"T12:00")-new Date(today+"T12:00"))/86400000));
  return { index:idx, isRest: cur.type!=="dose", weekInPhase, totalWeeks: cur.durationWeeks||4, daysLeft, current:cur, next, phases:phaseDates, isPaused: p.status==="paused" };
}

function phaseRoadmapModal(protocolId, compoundName) {
  const p = state.protocols.find(x=>x.id===protocolId); if(!p) return;
  const c = (p.compounds||[]).find(x=>x.name===compoundName); if(!c) return;
  const cc = cfg(compoundName);
  const info = getProtocolPhaseInfo(p, c);
  const phases = info ? info.phases : (c.phases||[]).map(ph=>({...ph, startDate:null, endDate:null}));
  const today = localDate();
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${cc.color};letter-spacing:1.5px">${esc(compoundName.toUpperCase())} — PHASE ROADMAP</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${phases.map((ph,i)=>{
      const isPast = ph.endDate && today>=ph.endDate;
      const isCurrent = ph.startDate && ph.endDate && today>=ph.startDate && today<ph.endDate;
      const isFuture = !isPast && !isCurrent;
      const label = ph.type==="dose" ? `${ph.dose||"—"}${cc.unit||"mg"}` : "Rest";
      const status = isPast ? "✓" : isCurrent ? "— Next".replace("Next","Now") : "";
      return `<div style="padding:12px 0;border-bottom:1px solid var(--surface-2);opacity:${isFuture&&!isCurrent?0.6:1}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px">
          <span style="font-size:13px;font-weight:700;color:${isCurrent?cc.color:"var(--t1)"}">Phase ${i+1}${isPast?" ✓":isCurrent?" — Now":""}</span>
        </div>
        <div style="font-size:12px;color:${ph.type==="dose"?cc.color:"var(--t4)"};margin-bottom:2px">${label} · ${ph.durationWeeks||4} weeks</div>
        <div style="font-size:11px;color:var(--t5)">${ph.startDate?`${fmtDate(ph.startDate)} – ${fmtDate(addDays(ph.endDate,-1))}`:"Date unavailable"}</div>
      </div>`;
    }).join("")}
    ${!info?`<div class="hint" style="margin-top:12px">This protocol doesn't have a start date set, so exact phase dates can't be calculated yet.</div>`:""}
  `, cc.color);
  m.querySelector("#x").onclick = closeModal;
}

// Protocol lifecycle + edit/delete actions — previously an always-visible Edit pill and ✕
// button in every card header, plus separate Pause/Complete/Resume buttons per status.
// Activate and Log First Dose stay on the card (the one thing you're likely to do next);
// everything else — editing, pausing, completing, resuming, deleting — moves here.
function manageProtocolMenu(protoId) {
  const p = state.protocols?.find(x=>String(x.id)===String(protoId)); if(!p) return;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span style="font-size:15px;font-weight:600;color:var(--t1)">Manage ${esc(p.name)}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <button id="mp-edit" class="sheet-row">Edit protocol<div class="sub">Change compounds, schedule, or phases</div></button>
    ${p.status==="in_progress"?`<button id="mp-pause" class="sheet-row">Pause protocol<div class="sub">Temporarily stop — phase timing picks up where it left off on resume</div></button>
    <button id="mp-complete" class="sheet-row">Mark completed<div class="sub">This protocol has run its course</div></button>`:""}
    ${p.status==="paused"?`<button id="mp-resume" class="sheet-row">Resume protocol<div class="sub">Continue from where you paused, with the paused time excluded</div></button>`:""}
    <button id="mp-pastpause" class="sheet-row">Record a past pause<div class="sub">For a pause that already happened but wasn't tracked — corrects adherence/overdue for that window</div></button>
    <button id="mp-delete" class="sheet-row danger">Delete protocol<div class="sub">Permanently removes this protocol — cannot be undone</div></button>
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#mp-edit").onclick = () => { closeModal(); protocolBuilderModal(p); };
  const pauseBtn = m.querySelector("#mp-pause");
  if (pauseBtn) pauseBtn.onclick = () => { closeModal(); pauseProtocol(p); saveState(); renderBody(); };
  const completeBtn = m.querySelector("#mp-complete");
  if (completeBtn) completeBtn.onclick = () => { closeModal(); confirmAction("Mark protocol as completed?", () => {
    p.status="completed"; saveState(); renderBody();
  }, { confirmLabel: "Complete", cancelLabel: "Cancel", tone: "success" }); };
  const resumeBtn = m.querySelector("#mp-resume");
  if (resumeBtn) resumeBtn.onclick = () => { closeModal(); resumeProtocol(p); saveState(); renderBody(); };
  m.querySelector("#mp-pastpause").onclick = () => { closeModal(); recordPastPauseModal(protoId); };
  m.querySelector("#mp-delete").onclick = () => { closeModal(); confirmAction("Delete this protocol?", () => {
    state.protocols=(state.protocols||[]).filter(x=>String(x.id)!==String(protoId)); saveState(); renderBody();
  }); };
}

// Retroactive correction for a pause that already happened but predates pauseHistory
// tracking (or was simply never recorded). Nothing downstream persists a "missed"
// verdict anywhere — overdue/missed/adherence are always computed live from
// wasDoseExpected() — so the moment this interval exists, every screen for that window
// self-corrects on next render. No separate recalculation pass needed.
function recordPastPauseModal(protoId) {
  const p = state.protocols?.find(x=>String(x.id)===String(protoId)); if (!p) return;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span style="font-size:15px;font-weight:600;color:var(--t1)">Record a past pause</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:14px">For ${esc(p.name)}. This corrects overdue, missed, and adherence for that window everywhere in the app — Today, Needs Attention, weekly score, Trends — automatically.</div>
    <label class="field-label">Paused from</label>
    <input id="rpp-start" type="date" class="inp" style="margin-bottom:10px">
    <label class="field-label">Resumed on</label>
    <input id="rpp-end" type="date" class="inp" style="margin-bottom:14px">
    <div id="rpp-err" style="color:#FF7C7C;font-size:12px;margin-bottom:10px;display:none"></div>
    <button id="rpp-save" class="btn-primary">Save pause interval</button>
  `, "#F9C87D");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#rpp-save").onclick = () => {
    const startVal = m.querySelector("#rpp-start").value;
    const endVal = m.querySelector("#rpp-end").value;
    const errEl = m.querySelector("#rpp-err");
    const showErr = (msg) => { errEl.textContent = msg; errEl.style.display = "block"; };
    if (!startVal || !endVal) return showErr("Both dates are required.");
    const pausedAt = startVal + "T00:00";
    const resumedAt = endVal + "T00:00";
    const newStart = new Date(pausedAt).getTime(), newEnd = new Date(resumedAt).getTime();
    if (newEnd <= newStart) return showErr("Resume date must be after the pause start.");
    // A currently-active pause is already covered by protocolPauseIntervals live — only
    // guard against overlapping a previously CLOSED interval, which would be redundant,
    // sloppy data entry rather than a real second pause.
    const overlaps = (p.pauseHistory||[]).some(h => newStart < new Date(h.resumedAt).getTime() && newEnd > new Date(h.pausedAt).getTime());
    if (overlaps) return showErr("This overlaps a pause interval already recorded for this protocol.");
    p.pauseHistory = p.pauseHistory || [];
    p.pauseHistory.push({ pausedAt, resumedAt });
    saveState(); closeModal(); renderBody();
  };
}

function protocolsView() {


  const protos = state.protocols||[];
  const STATUS_CFG = {
    draft:    {label:"Draft",    color:"var(--t4)",  bg:"var(--surface-2)"},
    planned:  {label:"Planned",  color:"#8AB4FF",    bg:"#8AB4FF18"},
    active:   {label:"Ready",    color:"#F9C87D",    bg:"#F9C87D18"},
    in_progress:{label:"In Progress",color:"#7DF9C0",bg:"#7DF9C018"},
    paused:   {label:"Paused",   color:"#A78BFA",    bg:"#A78BFA18"},
    completed:{label:"Completed",color:"var(--t4)",  bg:"var(--surface-2)"},
    archived: {label:"Archived", color:"var(--t5)",  bg:"var(--surface-2)"},
  };
  const hasDoses=(p)=>(p.compounds||[]).some(c=>{const pd=state.peptides[c.name]||state.customPeptides[c.name];return pd?.doses?.length>0;});
  protos.forEach(p=>{if(p.status==="active"&&hasDoses(p))p.status="in_progress";});
  const filter=state._protocolStatusFilter||"all";
  const filterGroups={
    all:()=>true,
    not_started:p=>["draft","planned","active"].includes(p.status),
    in_progress:p=>p.status==="in_progress",
    paused:p=>p.status==="paused",
    completed:p=>p.status==="completed",
    archived:p=>p.status==="archived"
  };
  const matchesFilter=filterGroups[filter]||filterGroups.all;
  const visibleProtos=protos.filter(matchesFilter);
  const filters=[["all","All"],["not_started","Not started"],["in_progress","In progress"],["paused","Paused"],["completed","Completed"],["archived","Archived"]];
  const filterBar='<div class="nx-protocol-filter-row" role="group" aria-label="Filter protocols by status" style="display:flex;gap:7px;overflow-x:auto;padding:3px 0 10px;scrollbar-width:none;max-width:100%">'+filters.map(([key,label])=>'<button type="button" class="nx-protocol-filter" data-status="'+key+'" aria-pressed="'+(filter===key)+'" style="min-height:44px;padding:8px 10px;white-space:nowrap;flex:0 0 auto;border-radius:999px;border:1px solid '+(filter===key?'#A78BFA':'var(--border)')+';background:'+(filter===key?'#A78BFA22':'var(--surface-2)')+';color:'+(filter===key?'#A78BFA':'var(--t3)')+';font-size:12px;font-weight:650">'+label+'</button>').join('')+'</div>';
  const live=visibleProtos.filter(p=>["active","in_progress","paused"].includes(p.status));
  const planned=visibleProtos.filter(p=>p.status==="planned");
  const drafts=protos.filter(p=>p.status==="draft");
  const done=visibleProtos.filter(p=>["completed","archived"].includes(p.status));
  const miniGantt=(p)=>{const tw=Math.max(1,...(p.compounds||[]).map(c=>((c.phases||[]).reduce((a,ph)=>a+(ph.durationWeeks||4),0))||8));return(p.compounds||[]).map(c=>{const bars=(c.phases||[{type:"dose",durationWeeks:tw}]).map((ph,pi)=>`<div class="phase-bar-seg" data-proto="${p.id}" data-comp="${esc(c.name)}" data-phase="${pi}" style="flex:${ph.durationWeeks||4};background:${ph.type==="dose"?"#A78BFA":"#333"};height:6px;border-radius:2px;cursor:pointer"></div>`).join("");return`<div style="display:flex;align-items:center;gap:5px;margin-bottom:2px"><span style="font-size:9px;color:var(--t5);width:55px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c.name)}</span><div style="flex:1;display:flex;gap:1px">${bars}</div></div>`;}).join("");};
  const compoundPhaseStatus = getProtocolPhaseInfo; // kept as an alias — same calls below, same function now
  const to12h = (hhmm) => {
    if (!hhmm) return null;
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2,"0")} ${period}`;
  };
  const compoundDetailRow = (p, c) => {
    const time = to12h(suggestReminderTime(c.name));
    const phase = compoundPhaseStatus(p, c);
    const compData = allPeptides()[c.name];
    const doseStatus = compData ? getDoseStatus(c.name, compData) : null;
    const bits = [];
    if (doseStatus?.status==="rescheduled") bits.push(`↺ ${doseStatus.label}`);
    if (doseStatus?.status==="skipped") bits.push(`✕ ${doseStatus.label}${doseStatus.nextDueStr?` · Next ${fmtDate(doseStatus.nextDueStr)}`:""}`);
    if (time) bits.push(`⏰ ${time}`);
    if (phase?.done) bits.push(`✓ Phases complete`);
    else if (phase) bits.push(`${phase.isRest?"⏸ Rest":"● Active dosing"} · wk ${phase.weekInPhase}/${phase.totalWeeks}${phase.daysLeft<=7?` · ${phase.daysLeft}d left`:""}`);
    if (!bits.length) return "";
    const accentColor = doseStatus?.status==="rescheduled" ? "#A78BFA" : doseStatus?.status==="skipped" ? "var(--t4)" : "var(--t4)";
    // "Next: X · starts DATE" line — only appears near a real transition (within 7 days),
    // generated purely from the phase data itself, never hardcoded per compound.
    const nextLine = (phase && !phase.done && phase.next && phase.daysLeft<=7)
      ? `<div style="font-size:10px;color:#A78BFA;margin-top:2px;padding-left:2px">Next: ${phase.next.type==="dose"?`${phase.next.dose||"—"}${cfg(c.name).unit||"mg"}`:"Rest"} · starts ${fmtDate(phase.next.startDate)}</div>`
      : "";
    return `<div style="font-size:10px;color:${accentColor};margin-top:3px;padding-left:2px">${bits.join("  ·  ")}</div>${nextLine}`;
  };
  const protoCard = (p) => {
    const sc = STATUS_CFG[p.status] || STATUS_CFG.draft;
    const needsFirstDose = p.status === "active" && !hasDoses(p);
    const fc = (p.compounds||[])[0]?.name;
    const compounds = p.compounds||[];
    const names = compounds.map(c=>c.name).filter(Boolean);
    const shortNames = names.slice(0,2).map(esc).join(" · ") + (names.length>2 ? ` · +${names.length-2} more` : "");
    return `<div class="card nexus-protocol-card" style="border-color:${sc.color}33;margin-bottom:10px">
      <div class="nexus-protocol-card-head">
        <div style="flex:1;min-width:0">
          <div class="nx-proto-title">${esc(p.name)}</div>
          ${p.goal?`<div class="nexus-protocol-muted">${esc(p.goal)}</div>`:""}
          ${p.linkedGoalId?(()=>{const g=(state.plans?.goals||[]).find(g=>String(g.id)===String(p.linkedGoalId));return g?`<div class="nexus-protocol-muted">Goal: ${esc(g.name)}</div>`:`<div class="nexus-protocol-muted">Linked goal unavailable · edit to relink</div>`;})():""}
        </div>
        ${statusBadge(sc.label, sc.color)}
        <button class="manage-proto-btn icon-btn" data-id="${p.id}" aria-label="Manage ${esc(p.name)} protocol" title="Manage protocol">⋯</button>
      </div>
      <div class="nexus-protocol-summary">${shortNames||"No compounds added"}</div>
      <div class="nexus-protocol-meta">${compounds.length} ${compounds.length===1?"compound":"compounds"}${p.startDate?` · Started ${fmtDate(p.startDate)}`:""}</div>
      <details class="nexus-protocol-details">
        <summary><span>Schedule &amp; phases</span></summary>
        <div class="nexus-protocol-details-body">
          <div class="nexus-protocol-timeline">${miniGantt(p)}</div>
          <div class="nexus-protocol-meta" style="margin-bottom:10px">${p.schedule?.type||"Weekly"} · ${p.schedule?.dosesPerDay||1}×/day</div>
          ${compounds.map(c=>`<div class="nexus-protocol-compound"><span class="pill" style="background:#A78BFA18;color:#A78BFA;border:1px solid #A78BFA33">${esc(c.name)} · ${esc(c.route||"SubQ")}</span>${compoundDetailRow(p,c)}</div>`).join("")}
        </div>
      </details>
      ${needsFirstDose&&fc?`<div class="nexus-protocol-start">
        <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#7DF9C0">Ready for first log</div><div class="nexus-protocol-muted">Logging activates tracking and forecasts</div></div>
        <button class="proto-log-first" data-name="${esc(fc)}" style="padding:9px 12px;border-radius:8px;background:#7DF9C0;color:#000;font-size:12px;font-weight:700;flex-shrink:0">+ Log dose</button>
      </div>`:""}
      ${(p.status==="draft"||p.status==="planned")?`<button class="proto-activate" data-id="${p.id}" style="width:100%;margin-top:10px;padding:10px;border-radius:9px;background:#A78BFA;color:#fff;font-size:12px;font-weight:700">▶ Activate</button>`:""}
    </div>`;
  };

  const section=(title,color,cards)=>cards.length?`<div class="nexus-protocol-section-label" style="color:${color}">${title} <span style="opacity:.7">${cards.length}</span></div>${cards.map(protoCard).join("")}`:"";
  return `<h1 class="serif greet">Protocol</h1><button id="new-protocol" class="btn-primary nx-proto-create"><span aria-hidden="true">＋</span> Create protocol</button>${filterBar}${!visibleProtos.length&&protos.length?`<div class="nx-protocol-empty-filter" role="status" style="padding:20px 10px;text-align:center;color:var(--t4);font-size:12px">No protocols match this status.<br><button type="button" id="nx-protocol-reset-filter" style="min-height:44px;margin-top:8px;padding:9px 14px;border-radius:10px;border:1px solid var(--border);color:var(--t2);background:var(--surface-2)">Show all protocols</button></div>`:""}${!live.length&&!planned.length&&!drafts.length&&!done.length&&!protos.length?`<div style="text-align:center;padding:24px;color:var(--t4);font-size:12px;line-height:1.6">No protocols yet.<br>Build one to connect your goal, inventory, and doses.</div>`:""}${section("LIVE","#7DF9C0",live)}${section("PLANNED","#8AB4FF",planned)}${section("DRAFTS","var(--t4)",drafts)}${done.length?`<details class="nexus-protocol-archive"><summary>Completed & archived (${done.length})</summary>${section("COMPLETED","var(--t5)",done)}</details>`:""}`;

}

// One Edit/Delete sheet shared by goals, research items, and shopping items — these used to
// render as a permanent Edit pill + ✕ button on every single row across all three lists.
// Same two destinations (goalModal/researchModal/shoppingModal, and the same confirmAction
// delete), just reached through one ⋯ per row instead of two buttons per row.
function managePlanItemMenu(type, id) {
  if(!state.plans) return;
  const key = type==="goal"?"goals":type==="research"?"research":"shopping";
  const item = state.plans[key]?.find(x=>String(x.id)===String(id));
  if(!item) return;
  const label = type==="goal"?"goal":type==="research"?"research item":"shopping item";
  const itemName = item.name || item.compound || item.item || label;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span style="font-size:15px;font-weight:600;color:var(--t1)">${esc(itemName)}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <button id="pm-edit" class="sheet-row">Edit</button>
    <button id="pm-delete" class="sheet-row danger">Delete<div class="sub">Removes this ${esc(label)} — cannot be undone</div></button>
  `, "#7DF9C0");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#pm-edit").onclick = () => {
    closeModal();
    if(type==="goal") goalModal(item);
    else if(type==="research") researchModal(item);
    else shoppingModal(item);
  };
  m.querySelector("#pm-delete").onclick = () => { closeModal(); confirmAction(`Delete this ${label}?`, () => {
    if(!state.plans) return;
    state.plans[key]=state.plans[key].filter(x=>String(x.id)!==String(id)); saveState(); renderBody();
  }); };
}

function goalDetailModal(goalId) {
  const g=(state.plans?.goals||[]).find(x=>String(x.id)===String(goalId));
  if(!g)return;
  const linked=(state.protocols||[]).filter(p=>String(p.linkedGoalId||"")===String(g.id));
  const el=(v)=>esc(String(v||""));
  let active="overview";
  const pm=g.progressModel||{type:"exploratory"};
  const modelLabel={numeric:"Measurable target",subjective:"Personal rating",milestones:"Milestones",exploratory:"Exploratory review"}[pm.type]||"Exploratory review";
  const modelSummary=()=>pm.type==="numeric"
    ? (()=>{if(!Number.isFinite(pm.baseline)||!Number.isFinite(pm.target))return 'Add a starting value and target to configure measurable progress.';
       const goalUnit=String(pm.unit||"").toLowerCase().trim(),appUnit=String(state.settings?.weightUnit||"lbs").toLowerCase().trim();
       const comparable=(goalUnit==="lb"||goalUnit==="lbs")&&(appUnit==="lb"||appUnit==="lbs")||(goalUnit==="kg"&&appUnit==="kg");
       const points=(state.weightLogs||[]).filter(w=>w.date&&Number.isFinite(Number(w.weight))&&Number(w.weight)>0).sort((a,b)=>new Date(b.date)-new Date(a.date));
       const header='Starting '+el(pm.baseline)+' '+el(pm.unit)+' · Target '+el(pm.target)+' '+el(pm.unit)+'. ';
       if(pm.source!=="weightLogs")return header+'No automatic measurement source selected.';
       if(!comparable)return header+'Weight history not compared: goal unit and app weight unit do not match.';
       if(!points.length)return header+'No weight records available yet.';
       const latest=points[0],value=Number(latest.weight),range=pm.target-pm.baseline,ratio=range!==0?(value-pm.baseline)/range:null;
       const completion=ratio===null?'':ratio>=1?' Target reached or exceeded (confirm manually).':' '+Math.max(0,Math.min(100,Math.round(ratio*100)))+'% toward numerical target.';
       return header+'Latest recorded weight: '+el(value)+' '+el(pm.unit)+' on '+el(fmtDate(latest.date))+'.'+completion+' Based only on recorded measurements; protocol effects are not inferred.';
     })()
    :pm.type==="subjective"?(pm.rating?'Current self-rating: '+el(pm.rating)+' / 5. This is a personal observation, not an objective clinical measure.':'No rating recorded yet.')
    :pm.type==="milestones"?((pm.milestones||[]).length+' milestones planned. Completion tracking is planned for the next update.'):'Exploration and regular reflection; no automatic progress percentage.';
  const matchingCheckIns=()=>g.evidenceSymptom?(state.dailyLogs||[]).filter(l=>l.date&&(l.symptoms||[]).some(v=>(typeof v==="string"?v:v?.name)===g.evidenceSymptom)).sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,12):[];
  const checkInEvidence=()=>!g.evidenceSymptom?'<div class="nx-muted" role="status">No Check-In symptom selected. Edit this goal to connect one.</div>':matchingCheckIns().length?'<div class="nx-muted" style="margin-bottom:9px">Recorded observations for '+el(g.evidenceSymptom)+'. No protocol causality is implied.</div>'+matchingCheckIns().map(l=>{const item=(l.symptoms||[]).find(v=>(typeof v==="string"?v:v?.name)===g.evidenceSymptom);const intensity=item&&typeof item==="object"&&item.intensity!=null?' · Intensity: '+el(item.intensity):'';return '<div style="border-bottom:1px solid var(--border-sub);padding:12px 0"><div style="font-size:12px;font-weight:650;color:var(--t1)">'+el(fmtDate(l.date))+'</div><div class="nx-muted">'+el(g.evidenceSymptom)+intensity+'</div></div>';}).join(''):'<div class="nx-muted" role="status">No existing Check-Ins contain this symptom.</div>';
  const content=()=>active==="overview"
    ? '<div class="nx-goal-detail-section"><div style="font-size:12px;font-weight:650;color:var(--t2);margin-bottom:7px">'+el(modelLabel)+'</div><div class="nx-muted" style="margin-bottom:14px">'+modelSummary()+'</div><div class="mono" style="font-size:10px;color:var(--t4);letter-spacing:1px;margin-bottom:9px">GOAL CONTEXT</div><div style="font-size:13px;line-height:1.6;color:var(--t2)">'+(g.metrics?el(g.metrics):'No success metric defined yet. You can add one when editing this goal.')+'</div>'+(g.targetDate?'<div class="nx-muted" style="margin-top:10px">Target date: '+el(fmtDate(g.targetDate))+'</div>':'')+(g.notes?'<div class="nx-muted" style="margin-top:10px">'+el(g.notes)+'</div>':'')+'<div class="nx-muted" style="margin-top:12px">Progress tracking will appear here once a measurement or review method is configured. No progress is inferred from protocol activity alone.</div></div>'
    :active==="connections"
    ? '<div class="mono" style="font-size:10px;color:var(--t4);letter-spacing:1px;margin-bottom:9px">LINKED PROTOCOLS</div>'+(linked.length?linked.map(p=>'<div style="padding:12px 0;border-bottom:1px solid var(--border-sub)"><div style="font-size:13px;color:var(--t1);font-weight:650">'+el(p.name)+'</div><div class="nx-muted">'+el(p.status||'draft')+' · Linked by personal goal ID</div></div>').join(''):'<div class="nx-muted" role="status">No protocols linked yet. Edit a protocol and choose this goal in its Review step.</div>')+'<div class="nx-muted" style="margin-top:12px">Connections provide context, not evidence of treatment effectiveness.</div>'
    : '<div class="mono" style="font-size:10px;color:var(--t4);letter-spacing:1px;margin-bottom:9px">GOAL ACTIVITY · CHECK-IN</div>'+checkInEvidence()+'<div class="nx-muted" style="margin-top:12px">Journal links and goal reviews are planned separately. Original Check-Ins remain unchanged.</div>';
  const modal=openModal('<div class="nx-goal-detail" style="padding-bottom:8px"><div style="display:flex;gap:10px;align-items:start;margin-bottom:14px"><div style="flex:1;min-width:0"><div class="mono" style="color:#A78BFA;font-size:10px;letter-spacing:1px">GOAL DETAILS</div><div style="font-size:19px;font-weight:700;color:var(--t1);margin-top:4px">'+el(g.name)+'</div><div class="nx-muted">'+el(g.category||'Personal goal')+' · '+el(g.status||'active')+'</div></div><button id="nx-goal-detail-close" aria-label="Close goal details" style="min-height:44px;min-width:44px;border-radius:12px;color:var(--t2);background:var(--surface-2);border:1px solid var(--border)">×</button></div><div style="display:flex;gap:6px;margin-bottom:16px" role="tablist" aria-label="Goal details sections">'+['overview','connections','activity'].map(t=>'<button class="nx-goal-detail-tab" role="tab" data-tab="'+t+'" style="min-height:44px;flex:1;border-radius:10px;font-size:12px;border:1px solid var(--border);background:var(--surface-2);color:var(--t2)">'+t[0].toUpperCase()+t.slice(1)+'</button>').join('')+'</div><div id="nx-goal-detail-content" role="tabpanel"></div></div>','#A78BFA');
  const paint=()=>{modal.querySelectorAll('.nx-goal-detail-tab').forEach(b=>{const chosen=b.dataset.tab===active;b.setAttribute('aria-selected',chosen);b.style.background=chosen?'#A78BFA22':'var(--surface-2)';b.style.borderColor=chosen?'#A78BFA':'var(--border)';});modal.querySelector('#nx-goal-detail-content').innerHTML=content();};
  modal.querySelector('#nx-goal-detail-close').onclick=closeModal;
  modal.querySelectorAll('.nx-goal-detail-tab').forEach(b=>b.onclick=()=>{active=b.dataset.tab;paint();});
  paint();
}

function plansView() {
  if(!state.plans) state.plans={goals:[],research:[],shopping:[]};
  const {goals,research,shopping}=state.plans;
  const sub=state._plansSub||"goals";
  const subBtn=(k,label,count)=>`<button class="plans-sub" data-sub="${k}" aria-selected="${sub===k}">${label}${count?` <span style="color:#7DF9C0;font-size:9px">${count}</span>`:""}</button>`;
  // removed protocols sub-tab — protocols now live exclusively in the Protocol tab
  const statusPill=(s,map)=>{const[col,label]=(map[s])||["var(--t4)",s];return statusBadge(label,col);};
  const goalStatus={active:["#7DF9C0","Active"],planned:["#8AB4FF","Planned"],paused:["#F9C87D","Paused"],completed:["#A78BFA","Completed"]};
  const resStatus={researching:["#F9C87D","Researching"],considering:["#8AB4FF","Considering"],planned:["#7DF9C0","Planned"],"not now":["var(--t4)","Not now"]};
  const protoStatus={idea:["var(--t4)","Idea"],researching:["#F9C87D","Researching"],planned:["#8AB4FF","Planned"],ready:["#7DF9C0","Ready"]};
  const shopStatus={needed:["#F9C87D","Needed"],ordered:["#8AB4FF","Ordered"],received:["#7DF9C0","Received"]};
  const shopCat={compound:"Compound",supply:"Supply",equipment:"Equipment"};
  const manageBtn=(type,id)=>`<button class="manage-plan-btn icon-btn" data-type="${type}" data-id="${id}" aria-label="Manage ${type}" title="Manage" style="width:44px;height:44px;min-width:44px;border-radius:11px;flex:0 0 44px"><svg class="nx-plan-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg></button>`;
  let content="";

  if(sub==="goals"){
    const active=goals.filter(g=>!g.status||g.status==="active");
    const other=goals.filter(g=>g.status&&g.status!=="active");
    content=`${!goals.length?emptyState("No goals set yet", "Add a goal to connect your compounds to a purpose.", {id:"empty-add-goal", label:"+ Add Goal"}):""}
    ${active.map(g=>`<div class="nx-plan-item">
      <div class="nx-plan-head"><div style="flex:1;min-width:0"><div class="nx-plan-item-title">${esc(g.name)}</div><button type="button" class="nx-open-goal" data-id="${esc(String(g.id))}" style="margin-top:2px;min-height:44px;padding:8px 0;color:#A78BFA;background:transparent;text-align:left;font-size:12px;font-weight:650">View goal</button><div class="nx-plan-item-sub">${esc(g.category||"")}${g.targetDate?` · Target: ${fmtDate(g.targetDate)}`:""}</div></div>${statusPill(g.status||"active",goalStatus)}${manageBtn("goal",g.id)}</div>

    </div>`).join("")}
    ${other.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin:12px 0 6px">OTHER GOALS</div>${other.map(g=>`<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:9px 12px;margin-bottom:7px;display:flex;align-items:center;gap:7px"><div style="flex:1;min-width:0"><div style="font-size:12px;color:var(--t2)">${esc(g.name)}</div><button type="button" class="nx-open-goal" data-id="${esc(String(g.id))}" style="display:block;min-height:44px;padding:8px 0;color:#A78BFA;font-size:12px;background:transparent">View goal</button><div style="font-size:10px;color:var(--t4)">${esc(g.category||"")}</div></div>${statusPill(g.status,goalStatus)}${manageBtn("goal",g.id)}</div>`).join("")}`:""}
    <button id="add-goal" class="btn-primary" style="width:100%;margin-top:10px;background:#7DF9C0;color:#000">＋ Add Goal</button>`;
  } else if(sub==="research"){
    content=`${!research.length?emptyState("No compounds researched yet", "Compounds you're considering or researching appear here.", {id:"empty-add-research", label:"+ Add Research", color:"#8AB4FF"}):""}
    ${research.map(r=>`<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:12px;padding:12px 14px;margin-bottom:8px">
      <div class="nx-plan-head"><div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;color:var(--t1)">${esc(r.compound)}</div>${r.goal?`<div style="font-size:10px;color:var(--t4)">→ ${esc(r.goal)}</div>`:""}</div>${statusPill(r.status||"researching",resStatus)}${manageBtn("research",r.id)}</div>
      <div class="nx-plan-secondary"><button class="compound-intel-btn nx-plan-intel" data-name="${esc(r.compound)}" aria-label="View Intel for ${esc(r.compound)}">Compound intel <svg class="nx-plan-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></div>${r.reason?`<div class="nx-muted">${esc(r.reason)}</div>`:""}
      ${r.notes?`<div style="font-size:11px;color:var(--t4);font-style:italic;margin-top:3px">${esc(r.notes)}</div>`:""}
    </div>`).join("")}
    <button id="add-research" class="btn-primary" style="width:100%;margin-top:10px;background:#F9C87D;color:#000">＋ Add to Research Queue</button>`;
  } else if(sub==="shopping"){
    const needed=shopping.filter(s=>!s.status||s.status==="needed");
    const ordered=shopping.filter(s=>s.status==="ordered");
    const received=shopping.filter(s=>s.status==="received");
    const row=s=>`<div class="nx-shopping-row">
      <span class="nx-shopping-category">${shopCat[s.category]||"Item"}</span>
      <div class="nx-shopping-main"><div class="nx-shopping-name">${esc(s.item)}${s.qty?` <span class="nx-shopping-qty">×${esc(s.qty)}</span>`:""}</div>${s.goal?`<div class="nx-shopping-goal">${esc(s.goal)}</div>`:""}</div>
      ${manageBtn("shopping",s.id)}
    </div>`;
    const grp=(label,col,items)=>items.length?`<div class="mono" style="font-size:9px;color:${col};letter-spacing:1.5px;margin-bottom:4px;margin-top:10px">${label}</div><div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:0 12px">${items.map(row).join("")}</div>`:"";
    content=`${!shopping.length?emptyState("Your procurement list is empty", "Add items you need to order or restock.", {id:"empty-add-shopping", label:"+ Add Item", color:"#F9C87D"}):""}
    ${grp("NEEDED","#F9C87D",needed)}${grp("ORDERED","#8AB4FF",ordered)}${grp("RECEIVED","#7DF9C0",received)}
    <button id="add-shopping" class="btn-primary" style="width:100%;margin-top:12px;background:var(--surface-3);color:var(--t1);border:1px solid var(--border)">＋ Add Item</button>`;
  }

  return `<div class="nx-page-intro"><h1 class="serif greet">Plans</h1><p>Track your goals, research queue, and shopping needs.</p></div>
  <div class="nx-plan-summary"><div><strong>${goals.filter(g=>!g.status||g.status==="active").length}</strong><span>Active goals</span></div><div><strong>${research.length}</strong><span>Research items</span></div><div><strong>${shopping.filter(s=>!s.status||s.status==="needed").length}</strong><span>To purchase</span></div></div>
  <nav class="nx-plan-nav" aria-label="Plans sections">
    ${subBtn("goals","Goals",goals.filter(g=>!g.status||g.status==="active").length||"")}
    ${subBtn("research","Research",research.length||"")}
    ${subBtn("shopping","Shopping",shopping.filter(s=>!s.status||s.status==="needed").length||"")}
  </nav>${content}`;
}

function goalModal(existing) {
  const g=existing||{id:uid(),name:"",category:"",status:"active",compounds:[],metrics:"",notes:"",targetDate:""};
  const GOAL_CATS=["Weight Loss","Recovery / Injury","Skin & Hair","Sleep","Cognitive","Longevity","Hormonal Health","Custom"];
  const compNames=Object.keys(allPeptidesIncArchived());
  let selC=g.compounds?[...g.compounds]:[];
  const refresh=()=>{m.querySelectorAll(".goal-comp").forEach(b=>{const sel=selC.includes(b.dataset.name);b.style.background=sel?"#A78BFA22":"transparent";b.style.borderColor=sel?"#A78BFA":"var(--border)";b.style.color=sel?"#A78BFA":"var(--t4)";});};
  const m=openModal(`<div style="display:flex;justify-content:space-between;margin-bottom:14px"><span class="mono" style="font-size:12px;color:#7DF9C0;letter-spacing:1px">${existing?"EDIT":"ADD"} GOAL</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
    <input id="g-name" class="inp" placeholder="Goal name *" value="${esc(g.name)}" style="width:100%;margin-bottom:8px">
    <select id="g-cat" class="inp" style="width:100%;margin-bottom:8px"><option value="">Category...</option>${GOAL_CATS.map(c=>`<option${g.category===c?" selected":""}>${c}</option>`).join("")}</select>
    <select id="g-status" class="inp" style="width:100%;margin-bottom:8px"><option value="active"${g.status==="active"?" selected":""}>Active</option><option value="planned"${g.status==="planned"?" selected":""}>Planned</option><option value="paused"${g.status==="paused"?" selected":""}>Paused</option><option value="completed"${g.status==="completed"?" selected":""}>Completed</option></select>
    <div style="font-size:11px;color:var(--t4);margin-bottom:6px">Compounds (tap to link)</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">${compNames.map(c=>`<button class="goal-comp" data-name="${esc(c)}" style="padding:4px 10px;border-radius:99px;font-size:11px;background:${selC.includes(c)?"#A78BFA22":"transparent"};border:1px solid ${selC.includes(c)?"#A78BFA":"var(--border)"};color:${selC.includes(c)?"#A78BFA":"var(--t4)"}">${esc(c)}</button>`).join("")}</div>
    <input id="g-metrics" class="inp" placeholder="Success metrics (e.g. pain level, weight, energy)" value="${esc(g.metrics||"")}" style="width:100%;margin-bottom:8px">
    <div style="margin:12px 0 7px;font-size:12px;font-weight:650;color:var(--t2)">How will you recognize progress?</div>
    <select id="g-progress-type" aria-label="Goal progress method" class="inp" style="width:100%;min-height:44px;margin-bottom:8px">
      ${[["exploratory","Exploratory · reflection and review"],["numeric","Measurable · numbers and a target"],["subjective","Subjective · personal 1–5 rating"],["milestones","Milestones · steps completed"]].map(([v,t])=>`<option value="${v}"${(g.progressModel?.type||"exploratory")===v?" selected":""}>${t}</option>`).join("")}
    </select>
    <div id="g-progress-settings" style="padding:10px 0 12px"></div>
    <label for="g-evidence-symptom" style="display:block;font-size:12px;color:var(--t3);margin-bottom:6px">Check-In symptom connection (optional)</label>
    <select id="g-evidence-symptom" class="inp" style="width:100%;min-height:44px;margin-bottom:8px"><option value="">No Check-In connection</option>${[...new Set((state.dailyLogs||[]).flatMap(l=>(l.symptoms||[]).map(v=>typeof v==="string"?v:v?.name).filter(Boolean)))].sort().map(n=>`<option value="${esc(n)}"${g.evidenceSymptom===n?" selected":""}>${esc(n)}</option>`).join("")}</select>
    <div class="nx-muted" style="font-size:11px;margin-bottom:10px">Selected observations remain in their original Check-In history.</div>
    <input id="g-target" class="inp" type="date" value="${g.targetDate||""}" style="width:100%;margin-bottom:8px">
    <textarea id="g-notes" class="inp" placeholder="Notes" style="width:100%;min-height:60px;resize:vertical;margin-bottom:14px">${esc(g.notes||"")}</textarea>
    <button id="g-save" class="btn-primary" style="background:#7DF9C0;color:#000">${existing?"Save changes":"Add Goal"}</button>`,"#7DF9C0");

  const model=g.progressModel||{};
  const progressSettings=m.querySelector("#g-progress-settings");
  const renderProgressSettings=()=>{
    const type=m.querySelector("#g-progress-type").value;
    const numberInput=(id,label,val,placeholder)=>'<label for="'+id+'" style="display:block;font-size:11px;color:var(--t3);margin-bottom:5px">'+label+'</label><input id="'+id+'" class="inp" inputmode="decimal" type="number" step="any" placeholder="'+placeholder+'" value="'+esc(String(val??""))+'" style="width:100%;min-height:44px;margin-bottom:10px">';
    progressSettings.innerHTML=type==="numeric"
      ? numberInput("g-p-baseline","Starting value",model.baseline,"e.g. 200")+numberInput("g-p-target","Target value",model.target,"e.g. 180")+'<label for="g-p-unit" style="display:block;font-size:11px;color:var(--t3);margin-bottom:5px">Unit or measurement</label><input id="g-p-unit" class="inp" value="'+esc(model.unit||"")+'" placeholder="e.g. lb, cm, hours" style="width:100%;min-height:44px">'+'<label for="g-p-source" style="display:block;font-size:11px;color:var(--t3);margin:10px 0 5px">Progress source</label><select id="g-p-source" class="inp" style="width:100%;min-height:44px"><option value="">Manual target only (no live value)</option><option value="weightLogs"'+(model.source==="weightLogs"?' selected':'')+'>Existing Nexus weight history</option></select><p class="nx-muted">Weight history can only be used when your goal unit matches the app weight unit.</p>'
      :type==="subjective"
      ? '<label for="g-p-rating" style="display:block;font-size:11px;color:var(--t3);margin-bottom:5px">Current self-rating (1–5)</label><select id="g-p-rating" class="inp" style="width:100%;min-height:44px">'+['','1','2','3','4','5'].map(v=>'<option value="'+v+'"'+(String(model.rating||"")===v?' selected':'')+'>'+(v||'Not rated yet')+'</option>').join('')+'</select><p class="nx-muted">Personal observations only. They do not measure biological function.</p>'
      :type==="milestones"
      ? '<label for="g-p-milestones" style="display:block;font-size:11px;color:var(--t3);margin-bottom:5px">Milestones (one per line)</label><textarea id="g-p-milestones" class="inp" style="width:100%;min-height:75px" placeholder="e.g. Establish a routine">'+esc((model.milestones||[]).join("\n"))+'</textarea>'
      : '<p class="nx-muted">Use your notes, reviews, and connected observations to explore progress. No artificial score is assigned.</p>';
  };
  m.querySelector("#g-progress-type").addEventListener("change",renderProgressSettings);
  renderProgressSettings();
  m.querySelector("#x").onclick=closeModal;
  m.querySelectorAll(".goal-comp").forEach(b=>b.onclick=()=>{const n=b.dataset.name,i=selC.indexOf(n);i>=0?selC.splice(i,1):selC.push(n);refresh();});
  m.querySelector("#g-save").onclick=()=>{
    const name=(m.querySelector("#g-name").value||"").trim();if(!name)return;
    const type=m.querySelector("#g-progress-type").value;
    const val=id=>m.querySelector("#"+id)?.value?.trim()||"";
    const numeric=value=>value!==""&&Number.isFinite(Number(value))?Number(value):null;
    const progressModel=type==="numeric"
      ? {type,baseline:numeric(val("g-p-baseline")),target:numeric(val("g-p-target")),unit:val("g-p-unit"),source:val("g-p-source")}
      : type==="subjective"?{type,rating:numeric(val("g-p-rating"))}
      : type==="milestones"?{type,milestones:val("g-p-milestones").split("\n").map(v=>v.trim()).filter(Boolean).slice(0,25)}
      : {type:"exploratory"};
    if(type==="numeric"&&((val("g-p-baseline")&&progressModel.baseline===null)||(val("g-p-target")&&progressModel.target===null))){return;}
    const updated={...g,name,category:m.querySelector("#g-cat").value,status:m.querySelector("#g-status").value,compounds:selC,metrics:m.querySelector("#g-metrics").value,targetDate:m.querySelector("#g-target").value,notes:m.querySelector("#g-notes").value,evidenceSymptom:m.querySelector("#g-evidence-symptom").value,progressModel:{...(g.progressModel||{}),...progressModel}};
    if(!state.plans)state.plans={goals:[],research:[],shopping:[]};
    const idx=state.plans.goals.findIndex(x=>x.id===g.id);idx>=0?state.plans.goals[idx]=updated:state.plans.goals.push(updated);
    saveState();closeModal();renderBody();
  };
}
function researchModal(existing) {
  const r=existing||{id:uid(),compound:"",reason:"",goal:"",status:"researching",notes:""};
  const goalNames=(state.plans?.goals||[]).map(g=>g.name);
  let selComp=r.compound?[r.compound]:[];
  state._cpickQ_rcomp="";
  const m=openModal(`<div style="display:flex;justify-content:space-between;margin-bottom:14px"><span class="mono" style="font-size:12px;color:#F9C87D;letter-spacing:1px">${existing?"EDIT":"ADD"} RESEARCH</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
    <div id="rcomp-picker">${compoundPickerHTML(selComp,"rcomp")}</div>
    <select id="r-status" class="inp" style="width:100%;margin-bottom:8px"><option value="researching"${r.status==="researching"?" selected":""}>Researching</option><option value="considering"${r.status==="considering"?" selected":""}>Considering</option><option value="planned"${r.status==="planned"?" selected":""}>Planned</option><option value="not now"${r.status==="not now"?" selected":""}>Not now</option></select>
    <input id="r-reason" class="inp" placeholder="Why interested?" value="${esc(r.reason||"")}" style="width:100%;margin-bottom:8px">
    <select id="r-goal" class="inp" style="width:100%;margin-bottom:8px"><option value="">Link to goal...</option>${goalNames.map(g=>`<option${r.goal===g?" selected":""}>${esc(g)}</option>`).join("")}</select>
    <textarea id="r-notes" class="inp" placeholder="Notes" style="width:100%;min-height:55px;resize:vertical;margin-bottom:14px">${esc(r.notes||"")}</textarea>
    <button id="r-save" class="btn-primary" style="background:#F9C87D;color:#000">${existing?"Save":"Add"}</button>`,"#F9C87D");
  m.querySelector("#x").onclick=closeModal;
  const rp=m.querySelector("#rcomp-picker");
  const refreshR=()=>{rp.innerHTML=compoundPickerHTML(selComp,"rcomp");wireCompoundPicker(rp,selComp,"rcomp",refreshR);};
  wireCompoundPicker(rp,selComp,"rcomp",refreshR);
  m.querySelector("#r-save").onclick=()=>{
    const compound=selComp[0]||"";if(!compound)return;
    const updated={...r,compound,status:m.querySelector("#r-status").value,reason:m.querySelector("#r-reason").value,goal:m.querySelector("#r-goal").value,notes:m.querySelector("#r-notes").value};
    if(!state.plans)state.plans={goals:[],research:[],shopping:[]};
    const idx=state.plans.research.findIndex(x=>String(x.id)===String(r.id));idx>=0?state.plans.research[idx]=updated:state.plans.research.push(updated);
    saveState();closeModal();renderBody();
  };
}
function protocolModal(existing) {
  const pr=existing||{id:uid(),name:"",goal:"",compounds:[],status:"idea",startDate:"",duration:"",notes:""};
  const goalNames=(state.plans?.goals||[]).map(g=>g.name);
  let selC=pr.compounds?[...pr.compounds]:[];
  state._cpickQ_pcomp="";
  const m=openModal(`<div style="display:flex;justify-content:space-between;margin-bottom:14px"><span class="mono" style="font-size:12px;color:#8AB4FF;letter-spacing:1px">${existing?"EDIT":"ADD"} PROTOCOL</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
    <input id="p-name" class="inp" placeholder="Protocol name *" value="${esc(pr.name)}" style="width:100%;margin-bottom:8px">
    <select id="p-goal" class="inp" style="width:100%;margin-bottom:8px"><option value="">Link to goal...</option>${goalNames.map(g=>`<option${pr.goal===g?" selected":""}>${esc(g)}</option>`).join("")}</select>
    <select id="p-status" class="inp" style="width:100%;margin-bottom:8px"><option value="idea"${pr.status==="idea"?" selected":""}>Idea</option><option value="researching"${pr.status==="researching"?" selected":""}>Researching</option><option value="planned"${pr.status==="planned"?" selected":""}>Planned</option><option value="ready"${pr.status==="ready"?" selected":""}>Ready to start</option></select>
    <div id="pcomp-picker">${compoundPickerHTML(selC,"pcomp")}</div>
    <input id="p-start" class="inp" type="date" value="${pr.startDate||""}" style="width:100%;margin-bottom:8px">
    <input id="p-dur" class="inp" placeholder="Duration (e.g. 12 weeks)" value="${esc(pr.duration||"")}" style="width:100%;margin-bottom:8px">
    <textarea id="p-notes" class="inp" placeholder="Notes" style="width:100%;min-height:55px;resize:vertical;margin-bottom:14px">${esc(pr.notes||"")}</textarea>
    <button id="p-save" class="btn-primary" style="background:#8AB4FF;color:#000">${existing?"Save":"Add Protocol"}</button>`,"#8AB4FF");
  m.querySelector("#x").onclick=closeModal;
  const pp=m.querySelector("#pcomp-picker");
  const refreshP=()=>{pp.innerHTML=compoundPickerHTML(selC,"pcomp");wireCompoundPicker(pp,selC,"pcomp",refreshP);};
  wireCompoundPicker(pp,selC,"pcomp",refreshP);
  m.querySelector("#p-save").onclick=()=>{
    const name=(m.querySelector("#p-name").value||"").trim();if(!name)return;
    const updated={...pr,name,goal:m.querySelector("#p-goal").value,status:m.querySelector("#p-status").value,compounds:selC,startDate:m.querySelector("#p-start").value,duration:m.querySelector("#p-dur").value,notes:m.querySelector("#p-notes").value};
    if(!state.plans)state.plans={goals:[],research:[],shopping:[]};
    const idx=state.plans.protocols.findIndex(x=>String(x.id)===String(pr.id));idx>=0?state.plans.protocols[idx]=updated:state.plans.protocols.push(updated);
    saveState();closeModal();renderBody();
  };
}
function shoppingModal(existing) {
  const s=existing||{id:uid(),item:"",category:"supply",status:"needed",qty:"",goal:"",notes:""};
  const linkedNames=[...(state.plans?.goals||[]).map(g=>g.name),...(state.protocols||[]).map(p=>p.name)];
  const m=openModal(`<div style="display:flex;justify-content:space-between;margin-bottom:14px"><span class="mono" style="font-size:12px;color:var(--t2);letter-spacing:1px">${existing?"EDIT":"ADD"} ITEM</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
    <input id="s-item" class="inp" placeholder="Item name *" value="${esc(s.item)}" style="width:100%;margin-bottom:8px">
    <select id="s-cat" class="inp" style="width:100%;margin-bottom:8px"><option value="compound"${s.category==="compound"?" selected":""}>💊 Compound</option><option value="supply"${s.category==="supply"?" selected":""}>🧪 Supply</option><option value="equipment"${s.category==="equipment"?" selected":""}>🔧 Equipment</option></select>
    <select id="s-status" class="inp" style="width:100%;margin-bottom:8px"><option value="needed"${s.status==="needed"?" selected":""}>Needed</option><option value="ordered"${s.status==="ordered"?" selected":""}>Ordered</option><option value="received"${s.status==="received"?" selected":""}>Received</option></select>
    <input id="s-qty" class="inp" placeholder="Quantity (optional)" value="${esc(s.qty||"")}" style="width:100%;margin-bottom:8px">
    <select id="s-goal" class="inp" style="width:100%;margin-bottom:8px"><option value="">Link to goal/protocol (optional)</option>${linkedNames.map(n=>`<option${s.goal===n?" selected":""}>${esc(n)}</option>`).join("")}</select>
    <textarea id="s-notes" class="inp" placeholder="Notes" style="width:100%;min-height:50px;resize:vertical;margin-bottom:14px">${esc(s.notes||"")}</textarea>
    <button id="s-save" class="btn-primary" style="background:var(--surface-3);color:var(--t1);border:1px solid var(--border)">${existing?"Save":"Add Item"}</button>`,"var(--t3)");
  m.querySelector("#x").onclick=closeModal;
  m.querySelector("#s-save").onclick=()=>{
    const item=(m.querySelector("#s-item").value||"").trim();if(!item)return;
    const updated={...s,item,category:m.querySelector("#s-cat").value,status:m.querySelector("#s-status").value,qty:m.querySelector("#s-qty").value,goal:m.querySelector("#s-goal").value,notes:m.querySelector("#s-notes").value};
    if(!state.plans)state.plans={goals:[],research:[],shopping:[]};
    const idx=state.plans.shopping.findIndex(x=>x.id===s.id);idx>=0?state.plans.shopping[idx]=updated:state.plans.shopping.push(updated);
    saveState();closeModal();renderBody();
  };
}

function renderBody() {
  const app=$("#app"); let inner="";
  if(tab==="home")    inner=homeView();
  else if(tab==="trends") inner=trendsView();
  else if(tab==="calendar") inner=`<h1 class="serif greet">Calendar</h1>${protocolCalendarView()}`;
  else if(tab==="stash")  inner=stashView();
  else if(tab==="plans")  inner=plansView();
  else if(tab==="protocols") inner=protocolsView();
  else if(tab==="profile") inner = profileView();
  else if(tab==="amino")   inner=aminoView();
  else if(tab==="learn") {
    if (state._guideOpen!=null) inner = guideDetail(state._guideOpen);
    else if (state._discoverOpen!=null) inner = discoverDetail(state._discoverOpen);
    else inner = `<h1 class="serif greet">Learn</h1>${learnContent()}`;
  }
  // Product-wide screen boundary: shared design and accessible content region.
  const nx2Screen = ['home','trends','calendar','stash','plans','protocols','profile','amino','learn'].includes(tab)?tab:'other';
  inner = `<section class="nx2-page nx2-page--${nx2Screen}" aria-label="${({home:'Today',trends:'Trends',calendar:'Calendar',stash:'Stash',plans:'Plans',protocols:'Protocols',profile:'Profile and settings',amino:'Nexus',learn:'Learn'})[nx2Screen]||'Nexus'}">${inner}</section>`;
  const themeIcon = document.documentElement.dataset.theme==="light"
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const hasUnseenUpdate = CURRENT_CHANGELOG_VERSION > (state.settings.lastSeenChangelog||0);
  const profileBtn = tab==="profile" ? "" : `<div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:8px"><button id="profile-btn" style="position:relative;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);border-radius:20px;padding:4px 12px 4px 4px;font-size:12px;display:flex;align-items:center;gap:6px">
  ${state.profile.avatar
    ?`<img src="${state.profile.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;flex-shrink:0">`
    :`<span style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#7DF9C0,#C9A0FF);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#000;flex-shrink:0">${(state.profile.name||"?")[0].toUpperCase()}</span>`}
  <span style="color:var(--t3)">Profile</span>${hasUnseenUpdate?`<span style="position:absolute;top:2px;right:2px;width:8px;height:8px;border-radius:50%;background:#A78BFA;border:1.5px solid var(--bg)"></span>`:""}</button><button id="theme-toggle" title="Toggle light/dark">${themeIcon}</button></div>`;
  app.innerHTML = `<div id="body" class="nexus-screen-${tab}">${profileBtn}${inner}</div>`;
  wireBody();
}

// ─── Missing helpers ──────────────────────────────────────────────────────────
function wireCalTips() {
  document.querySelectorAll(".calday").forEach(b=>{
    b.addEventListener("mouseenter",()=>{
      const tip=document.getElementById("cal-tip"); if(!tip) return;
      const content=buildTipContent(b.dataset.date);
      if(!content){tip.style.display="none";return;}
      tip.innerHTML=content; tip.style.display="block";
      const rect=b.getBoundingClientRect();
      tip.style.left=Math.min(rect.left,window.innerWidth-200)+"px";
      tip.style.top=(rect.top+window.scrollY-tip.offsetHeight-6)+"px";
    });
    b.addEventListener("mouseleave",()=>{ const t=document.getElementById("cal-tip");if(t)t.style.display="none"; });
  });
}
function buildTipContent(dateIso) {
  if(!dateIso) return "";
  const k=dayKey(dateIso);
  const aps=allPeptides();
  const doses=Object.entries(aps).flatMap(([n,p])=>(p.doses||[]).filter(d=>dayKey(d.date)===k).map(d=>({...d,pep:n})));
  const log=state.dailyLogs.find(l=>dayKey(l.date)===k);
  const wt=state.weightLogs.find(w=>dayKey(w.date)===k);
  const reschedFrom=Object.entries(aps).flatMap(([n,p])=>(p.reschedules||[]).filter(r=>dayKey(r.originalDate)===k).map(r=>({...r,pep:n})));
  if(!doses.length&&!log&&!wt&&!reschedFrom.length) return "";
  const lines=[];
  if(doses.length) lines.push(doses.map(d=>`💉 ${esc(d.pep)}${d.dose?" "+esc(d.dose)+cfg(d.pep).unit:""}`).join("<br>"));
  if(reschedFrom.length) lines.push(reschedFrom.map(r=>`↺ ${esc(r.pep)} rescheduled → ${fmtDate(r.newDate)}`).join("<br>"));
  if(log){const mood=MOODS.find(m=>m.v===log.mood);if(mood)lines.push(mood.emoji+" "+mood.label);}
  if(wt) lines.push(`⚖ ${esc(wt.weight)} ${state.settings.weightUnit}`);
  return lines.join("<br>");
}
function checkAndNotify() {
  if(!state.settings.remindersEnabled) return;
  const today=localDate();
  if(state.settings.lastNotifyDate===today) return;
  const aps=allPeptides();
  const due=[], overdue=[];
  Object.entries(aps).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active").forEach(([n,d])=>{
    const last=[...d.doses].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    if(!last) return;
    const nextDay=addDays(dayKey(last.date),d.scheduleDays);
    if(nextDay===today) due.push(n);
    else if(nextDay<today) overdue.push(n);
  });
  if((due.length||overdue.length)&&"Notification" in window&&Notification.permission==="granted"){
    const msg=overdue.length?`💉 ${overdue[0]} overdue`:`💉 ${due[0]} due today`;
    try{new Notification("Nexus",{body:msg,icon:"/icon.png"});}catch(e){}
    state.settings.lastNotifyDate=today; saveState();
  }
}
function enableReminders() {
  if(!("Notification" in window)){alert("Notifications not supported in this browser.");return;}
  Notification.requestPermission().then(p=>{ state.settings.remindersEnabled=p==="granted"; if(p!=="granted")alert("Please allow notifications in your browser settings."); saveState(); render(); });
}
function disableReminders() {
  state.settings.remindersEnabled=false; saveState(); render();
}
// Phase 2A: five primary destinations, with secondary destinations retained in More.
// The existing screen renderers and application state are unchanged.
function renderTabbar() {
  // Keyboard users can bypass the persistent navigation and reach the current screen.
  if(!document.querySelector('.nx-a11y-skip')){
    const skip=document.createElement('a');
    skip.className='nx-a11y-skip';skip.href='#app';skip.textContent='Skip to app content';
    document.body.prepend(skip);
  }
  document.getElementById('app')?.setAttribute('tabindex','-1');
  document.querySelector('.tabbar')?.remove();
  document.querySelector('#nexus-more-panel')?.remove();
  const nav = document.createElement('nav');
  nav.className = 'tabbar nexus-tabbar-v2';
  nav.setAttribute('aria-label', 'Primary navigation');
  const moreTabs = ['trends','plans','amino','profile'];
  const tabs = [['home','Today'],['calendar','Calendar'],['protocols','Protocol'],['stash','Stash'],['more','More']];
  const goTo = (id) => {
    // A fresh Calendar visit always opens the current month's calendar,
    // not the previously selected Logs tab or an old month offset.
    if (id === 'calendar') {
      state._protoCalSub = 'month';
      state._calOff = 0;
    }
    tab=id;
    state._guideOpen=null; state._discoverOpen=null;
    state._compoundIntel=null; state._intelReturn=null;
    state._profileReturn=null;
    render(); window.scrollTo(0,0);
  };
  tabs.forEach(([id,label]) => {
    const button = document.createElement('button');
    button.type='button'; button.dataset.tab=id;
    const selected = tab===id || (id==='more' && moreTabs.includes(tab));
    if(selected) button.className='active';
    button.setAttribute('aria-label',label);
    button.setAttribute('aria-pressed',selected?'true':'false');
    if(selected) button.setAttribute('aria-current','page');
    const path=id==='more' ? '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>' : (ICONS[id]||'');
    button.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg><span>${label}</span>`;
    button.onclick=()=>id==='more' ? showNexusMorePanel(goTo) : goTo(id);
    nav.appendChild(button);
  });
  document.body.appendChild(nav);
}
function showNexusMorePanel(goTo) {
  document.querySelector('#nexus-more-panel')?.remove();
  const backdrop=document.createElement('div');
  backdrop.id='nexus-more-panel'; backdrop.className='nexus-more-backdrop';
  const sheet=document.createElement('section');
  sheet.className='nexus-more-sheet'; sheet.setAttribute('role','dialog');
  sheet.setAttribute('aria-modal','true'); sheet.setAttribute('aria-label','More destinations');
  sheet.innerHTML=`<div class="nexus-more-handle" aria-hidden="true"></div><div class="nexus-more-heading"><strong>More</strong><button type="button" aria-label="Close menu" class="nexus-more-close">✕</button></div><p>Explore additional Nexus tools</p><div class="nexus-more-items"></div>`;
  const close=()=>{backdrop.remove();document.removeEventListener('keydown',onKey);};
  const onKey=(e)=>{if(e.key==='Escape')close();};
  document.addEventListener('keydown',onKey);
  backdrop.onclick=(e)=>{if(e.target===backdrop)close();};
  sheet.querySelector('.nexus-more-close').onclick=close;
  [['trends','Trends','History and analytics'],['plans','Plans','Schedules and planning'],['amino','Nexus','AI assistant and insights'],['profile','Profile & Settings','Preferences and account']].forEach(([id,label,detail])=>{
    const item=document.createElement('button'); item.type='button'; item.className='nexus-more-item';
    const title=document.createElement('strong');title.textContent=label;
    const desc=document.createElement('small');desc.textContent=detail;
    const arrow=document.createElement('span');arrow.textContent='›';arrow.setAttribute('aria-hidden','true');
    const texts=document.createElement('span');texts.append(title,desc);item.append(texts,arrow);
    item.onclick=()=>{close();goTo(id);};
    sheet.querySelector('.nexus-more-items').appendChild(item);
  });
  backdrop.appendChild(sheet);document.body.appendChild(backdrop);
  sheet.querySelector('.nexus-more-close').focus();
}

function render() {
  try {
    renderBody();
  } catch(e) {
    console.error("renderBody failed:", e);
    const app = document.getElementById("app");
    if(app) app.innerHTML = `<div id="body"><div class="card" style="border-color:#ff4d4d44;margin-top:20px"><div style="color:#ff4d4d;font-size:13px;margin-bottom:6px">⚠️ Something failed to render</div><div style="font-size:11px;color:var(--t4);font-family:monospace">${e.message}</div></div></div>`;
  }
  renderTabbar();
  // Demo banner
  const demoBanner = document.getElementById("demo-banner");
  if(demoBanner) {
    demoBanner.style.display = isDemoMode() ? "block" : "none";
    const appEl = document.getElementById("app");
    if(appEl) appEl.style.paddingTop = isDemoMode() ? "calc(env(safe-area-inset-top) + 42px)" : "calc(env(safe-area-inset-top) + 8px)";
  }
  checkAndNotify();
}

