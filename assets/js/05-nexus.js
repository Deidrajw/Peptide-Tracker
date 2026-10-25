function comboDoseModal() {
  const aps = allPeptides();
  // Combo dose is specifically "compounds drawn into one syringe and injected together"
  // (see the hint text below) — a nasal spray can't be drawn into that syringe, so it's
  // excluded here rather than left selectable with a site list that wouldn't apply to it.
  // A blend's constituent is not an independently available syringe compound
  // solely because it has a tracked library entry. Preserve names that have
  // an actual non-blend kit, independent log, protocol, prepared source, or a
  // previously saved standalone/combo selection (legacy recipes remain valid).
  const blendConstituents = new Set((state.supplies||[]).filter(k=>k.isBlend)
    .flatMap(k=>(k.composition||[]).map(part=>part.compound).filter(Boolean)));
  const standaloneKits = new Set((state.supplies||[]).filter(k=>!k.isBlend).map(k=>k.name));
  const independentlyUsed = new Set([
    ...Object.entries(aps).filter(([,p])=>(p?.doses||[]).some(d=>d?.dose!=null)).map(([n])=>n),
    ...(state.protocols||[]).flatMap(p=>(p.compounds||[]).map(c=>c.name)),
    ...(state.preparedDoses||[]).flatMap(pd=>getSyringeComponents(pd).map(c=>c.compoundName)),
    ...(state.comboPresets||[]).flatMap(p=>p.compounds||[]),
    ...(state._comboSelected||[])
  ]);
  const names = Object.keys(aps).filter(n=>aps[n]?.route!=="Nasal" &&
    (!blendConstituents.has(n)||standaloneKits.has(n)||independentlyUsed.has(n))).sort();
  if (!state._comboSelected) state._comboSelected = [];
  let sel = state._comboSelected.filter(n=>names.includes(n));
  state._comboSelected = [...sel];

  // Prepared & Ready — actual prepared mixed syringes, distinct from favorites below.
  // A favorite is a reusable recipe for what to draw; a prepared syringe is a specific
  // physical syringe that already exists, with inventory already moved out of a vial.
  // Selecting one hands off to administerSyringeModal — the same function Stash's
  // Prepared list and (once matched) Today use — rather than re-implementing "how to
  // administer a prepared syringe" a third time here.
  const readyMixed = (state.preparedDoses||[]).filter(pd=>(pd.remainingCount||0)>0 && getSyringeComponents(pd).length>1);
  const preparedSection = readyMixed.length ? `
    <label class="field-label">PREPARED & READY</label>
    <div style="margin-bottom:16px">
      ${readyMixed.map(pd=>{
        const comps = getSyringeComponents(pd);
        const label = comps.map(c=>`${c.compoundName} ${c.amount}${c.unit||cfg(c.compoundName).unit}`).join(" + ");
        return `<button class="use-prepared-syringe" data-id="${pd.id}" style="display:block;width:100%;text-align:left;padding:12px 14px;border-radius:10px;background:#A78BFA0d;border:1px solid #A78BFA33;margin-bottom:8px">
          <div style="font-size:13px;font-weight:600;color:#A78BFA">💉 ${esc(label)}</div>
          <div style="font-size:11px;color:var(--t5);margin-top:2px">Prepared ${fmtDate(pd.createdAt)} · tap to use this syringe</div>
        </button>`;
      }).join("")}
    </div>
    <div style="height:1px;background:var(--surface-2);margin-bottom:16px"></div>
  ` : "";

  const presets = state.comboPresets||[];
  // Selecting a favorite never deletes it: delete is a separate, named button.
  const presetChips = presets.map(p=>`<span style="display:inline-flex;align-items:stretch;border:1px solid var(--border);border-radius:10px;background:var(--surface-2);overflow:hidden">
    <button type="button" class="combo-preset-chip" data-id="${esc(String(p.id))}" style="min-height:44px;padding:8px 12px;border:0;background:transparent;color:var(--t2);font-size:12px">${esc(p.name)}</button>
    <button type="button" class="combo-preset-del" data-id="${esc(String(p.id))}" aria-label="Delete ${esc(p.name)} favourite" style="width:40px;min-height:44px;border:0;border-left:1px solid var(--border-sub);background:transparent;color:var(--t4)">×</button>
  </span>`).join("");

  const compoundToggles = () => names.map(n=>{
    const on = sel.includes(n);
    const c = cfg(n);
    return `<button type="button" role="checkbox" aria-checked="${on}" class="combo-compound-toggle" data-n="${esc(n)}" style="width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:${on?c.color+"18":"var(--surface-2)"};border:1px solid ${on?c.color:"var(--border)"};margin-bottom:6px;text-align:left">
      <div style="width:16px;height:16px;border-radius:5px;border:2px solid ${on?c.color:"var(--t5)"};background:${on?c.color:"transparent"};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff">${on?"✓":""}</div>
      <span style="font-size:13px;color:var(--t2);font-weight:600">${esc(n)}</span>
    </button>`;
  }).join("");

  const doseInputs = () => sel.map(n=>{
    const c = cfg(n);
    const v = (state._comboDoses||{})[n]||"";
    return `<div style="margin-bottom:10px">
      <label class="field-label">${esc(n)} DOSE (${c.unit})</label>
      <input class="combo-dose-input" data-n="${esc(n)}" type="number" class="inp" placeholder="e.g. 2" value="${esc(v)}" style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface-2);color:var(--t1);font-size:13px">
    </div>`;
  }).join("");

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">LOG COMBO DOSE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:14px">For compounds you draw into one syringe and inject together. Each still logs as its own dose behind the scenes — supply, schedule, and trends stay accurate per compound.</div>
    ${preparedSection}
    ${presets.length?`<label class="field-label">FAVOURITES</label><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">${presetChips}</div>`:""}
    <section class="nx-combo-picker-panel" aria-label="Compounds in this syringe" style="border:1px solid var(--border);border-radius:14px;padding:12px;margin-bottom:16px;background:var(--surface)">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px">
        <label class="field-label" for="combo-search" style="margin:0">COMPOUNDS IN THIS SYRINGE</label>
        <span id="combo-selected-count" style="font-size:11px;color:var(--t4);white-space:nowrap">${sel.length} selected</span>
      </div>
      <input id="combo-search" class="inp" type="search" autocomplete="off" placeholder="Search ${names.length} compounds…" aria-controls="combo-choices" style="margin-bottom:8px;min-height:46px;width:100%">
      <div id="combo-choices" role="group" aria-label="Compound multi-select" tabindex="0" style="max-height:224px;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--border-sub);border-radius:10px;padding:6px;background:var(--surface-2)">
        ${names.length?compoundToggles():`<div style="color:var(--t4);font-size:12px;padding:10px 0">No standalone compounds available.</div>`}
      </div>
      <div style="font-size:11px;color:var(--t4);margin-top:9px;display:flex;align-items:center;justify-content:space-between;gap:8px"><span>Scroll for more compounds</span><span aria-hidden="true">↓</span></div>
    </section>
    <div id="combo-dose-section" style="${sel.length?"":"display:none"}">
      <label class="field-label">DOSE AMOUNTS</label><div id="combo-dose-fields" style="margin-bottom:6px">${doseInputs()}</div>
    </div>
    <label class="field-label">DATE & TIME</label>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <input id="combo-date" type="datetime-local" class="inp" value="${esc(state._comboDate||localDatetime())}" style="flex:1">
      <button id="combo-date-now" type="button" style="padding:0 16px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px;font-weight:600;white-space:nowrap">Now</button>
    </div>
    <label class="field-label">INJECTION SITE</label><select id="combo-site" class="inp" style="margin-bottom:14px">${SITES.map(s=>`<option${s===(state._comboSite||SITES[0])?" selected":""}>${esc(s)}</option>`).join("")}</select>
    <label class="field-label">NOTES (shared)</label><textarea id="combo-notes" class="inp" placeholder="Anything worth capturing…" style="min-height:54px;resize:vertical;margin-bottom:14px">${esc(state._comboNotes||"")}</textarea>
    <label class="field-label">SYMPTOMS AFTER THIS DOSE (shared)</label><div id="combo-sym" style="margin-bottom:14px"></div>
    <div id="combo-fav-section" style="${sel.length>=2?"":"display:none"}">
      <label style="display:flex;align-items:center;gap:10px;margin-bottom:16px;font-size:13px;color:var(--t3)"><input id="combo-savefav" type="checkbox" style="accent-color:#A78BFA"> Save this combo as a favourite</label>
      <div id="combo-favname-wrap" style="display:none;margin-bottom:16px"><input id="combo-favname" class="inp" placeholder="Name this combo, e.g. Morning stack"></div>
    </div>
    <button id="save" class="btn-primary" style="background:#A78BFA">LOG ${sel.length||""} DOSE${sel.length===1?"":"S"}</button>
  `, "#A78BFA");

  // Each wiring block is independently try/caught: previously, if any single block
  // threw during setup (e.g. a null element from an unexpected data shape), every
  // block after it in this function silently never got its onclick attached — which
  // presents as "the whole modal is unresponsive" with zero indication why. Now a
  // failure in one block surfaces via showErrorBanner but doesn't take the rest down.
  try { m.querySelector("#x").onclick = closeModal; } catch(e) { showErrorBanner("comboDoseModal #x wiring: "+e.message); }

  try {
    if (!state._comboSymptoms) state._comboSymptoms = [];
    const symBox = m.querySelector("#combo-sym");
    const renderComboSym = () => {
      symBox.innerHTML = symptomPickerHTML(state._comboSymptoms, "#A78BFA");
      wireSymptomPicker(symBox, state._comboSymptoms, "#A78BFA", renderComboSym);
    };
    renderComboSym();
  } catch(e) { showErrorBanner("comboDoseModal symptom picker wiring: "+e.message); }

  try {
    document.querySelectorAll(".use-prepared-syringe").forEach(btn=>btn.onclick=()=>{
      const pd = readyMixed.find(p=>String(p.id)===btn.dataset.id);
      if (!pd) return;
      closeModal();
      administerSyringeModal(pd);
    });
  } catch(e) { showErrorBanner("comboDoseModal prepared-syringe wiring: "+e.message); }

  try {
    document.querySelectorAll(".combo-preset-chip").forEach(chip=>{
      chip.onclick = (e) => {
        const preset = presets.find(p=>String(p.id)===chip.dataset.id);
        if (preset) {
          state._comboDate = m.querySelector("#combo-date")?.value;
          state._comboSite = m.querySelector("#combo-site")?.value;
          state._comboNotes = m.querySelector("#combo-notes")?.value;
          state._comboDoses = state._comboDoses || {};
          m.querySelectorAll(".combo-dose-input").forEach(inp=>{state._comboDoses[inp.dataset.n]=inp.value;});
          state._comboSelected = [...preset.compounds].filter(n=>names.includes(n));
          closeModal(); comboDoseModal();
        }
      };
    });
    document.querySelectorAll(".combo-preset-del").forEach(x=>x.onclick=(e)=>{
      e.stopPropagation();
      confirmAction("Remove this favourite combo?", ()=>{
        state.comboPresets = presets.filter(p=>String(p.id)!==x.dataset.id);
        saveState(); closeModal(); comboDoseModal();
      });
    });
  } catch(e) { showErrorBanner("comboDoseModal preset wiring: "+e.message); }


  // Search is available at every library size; the list itself never grows taller
  // than 224px even with 50+ tracked compounds. Multi-select updates in place.
  const comboList = m.querySelector("#combo-choices");
  const comboSearch = m.querySelector("#combo-search");
  const filterChoices = () => {
    const q=comboSearch.value.trim().toLocaleLowerCase();
    let visible=0;
    comboList.querySelectorAll(".combo-compound-toggle").forEach(btn=>{
      const show=btn.dataset.n.toLocaleLowerCase().includes(q);
      btn.style.display=show?"flex":"none";
      if(show)visible++;
    });
    let empty=comboList.querySelector("#combo-no-matches");
    if(!visible){if(!empty){empty=document.createElement("div");empty.id="combo-no-matches";empty.style.cssText="padding:12px;color:var(--t4);font-size:12px";empty.textContent="No matching compounds";comboList.appendChild(empty);}}
    else if(empty)empty.remove();
  };
  comboSearch.oninput=filterChoices;
  comboList.onclick=e=>{
    const btn=e.target.closest(".combo-compound-toggle");
    if(!btn)return;
    // Only replace the selection and amount sections, never the whole modal.
    // In-progress date, site, notes, symptoms, keyboard and scroll stay intact.
    state._comboDoses=state._comboDoses||{};
    m.querySelectorAll(".combo-dose-input").forEach(inp=>{state._comboDoses[inp.dataset.n]=inp.value;});
    const n=btn.dataset.n;
    sel=sel.includes(n)?sel.filter(x=>x!==n):[...sel,n];
    state._comboSelected=[...sel];
    const previousScroll=comboList.scrollTop;
    comboList.innerHTML=compoundToggles();
    filterChoices();
    comboList.scrollTop=previousScroll;
    m.querySelector("#combo-selected-count").textContent=sel.length+" selected";
    m.querySelector("#combo-dose-section").style.display=sel.length?"":"none";
    m.querySelector("#combo-dose-fields").innerHTML=doseInputs();
    const fav=m.querySelector("#combo-fav-section");
    fav.style.display=sel.length>=2?"":"none";
    if(sel.length<2){m.querySelector("#combo-savefav").checked=false;m.querySelector("#combo-favname-wrap").style.display="none";}
    m.querySelector("#save").textContent="LOG "+(sel.length||"")+" DOSE"+(sel.length===1?"":"S");
  };
  comboList.querySelectorAll(".combo-compound-toggle").forEach(btn=>{
    btn.setAttribute("role","checkbox");btn.setAttribute("aria-checked",String(sel.includes(btn.dataset.n)));
    btn.style.minHeight="44px";
  });
  const comboDateNowBtn = m.querySelector("#combo-date-now");
  if(comboDateNowBtn)comboDateNowBtn.onclick=()=>{m.querySelector("#combo-date").value=localDatetime();};
  try {
    const favCheck = m.querySelector("#combo-savefav");
    if (favCheck) favCheck.onchange = () => { const w=m.querySelector("#combo-favname-wrap"); if(w) w.style.display = favCheck.checked ? "block" : "none"; };
  } catch(e) { showErrorBanner("comboDoseModal fav-checkbox wiring: "+e.message); }

  try {
    m.querySelector("#save").onclick = () => {
      try {
        if (!sel.length) return;
        const date = m.querySelector("#combo-date").value;
        const site = m.querySelector("#combo-site").value;
        const notes = m.querySelector("#combo-notes").value;
        const comboId = uid();
        const items = sel.map(name => ({ name, doseVal: (m.querySelector(`.combo-dose-input[data-n="${CSS.escape(name)}"]`)||{}).value || "" }));
        const result = planAndApplyComboDoses(items, date, site, notes, comboId, state._comboSymptoms||[]);
        if (!result.ok) {
          const {name, doseVal, unit, have, noOpenVial, kitId, hasSealedBackup} = result.shortfall;
          // Preserve everything typed so far regardless of which path below is taken, so
          // nothing is lost if the person has to come back to this combo.
          state._comboDate = date; state._comboSite = site; state._comboNotes = notes;
          state._comboDoses = state._comboDoses||{};
          items.forEach(it=>{ state._comboDoses[it.name] = it.doseVal; });
          const kit = kitId!=null ? state.supplies.find(s=>s.id===kitId) : null;
          if (noOpenVial) {
            // Nothing open at all — genuinely needs the full reconstitute flow (BAC water
            // amount, etc.), so this goes through the modal and resumes after.
            confirmAction(
              `${name} needs an open vial before this combo can be logged.`,
              () => {
                closeModal();
                if (kit && hasSealedBackup) reconstituteVialModal(kit, () => comboDoseModal());
                else if (kit) openNewVialModal(kit.id);
                else supplyModal(null, name);
              },
              { confirmLabel: hasSealedBackup ? "Open/Reconstitute vial" : "Add a vial", cancelLabel: "Cancel" }
            );
            return;
          }
          if (hasSealedBackup && kit) {
            // Something's open but this dose needs more than what's left — finish that
            // vial (using up the remainder, not discarding it) and open the next sealed
            // one, as one atomic action, then retry the combo immediately. No modal
            // round-trip needed: the next vial already has a known BAC water amount
            // (matches the kit's own), so there's nothing further to ask.
            confirmAction(
              `${name} only has ${have.toFixed(2)}${unit} left — this dose needs ${doseVal}${unit}. Finish this vial and open the next one to cover the rest?`,
              () => {
                finishAndOpenNextVial(kit);
                saveState();
                closeModal();
                comboDoseModal();
              },
              { confirmLabel: "Finish & open next vial", cancelLabel: "Cancel" }
            );
            return;
          }
          showErrorBanner(`Not enough ${name} for this combo dose — needs ${doseVal}${unit}, only ${have.toFixed(2)}${unit} available, and no sealed backup to open. Nothing was saved.`);
          return;
        }
        result.doses.forEach(({name, dose})=>{
          const builtin = !!PEPTIDES[name];
          const tgt = builtin ? state.peptides : state.customPeptides;
          if (!tgt[name]) tgt[name] = { status:"active", scheduleDays:cfg(name).defaultSchedule, doses:[] };
          tgt[name].doses.push(dose);
        });
        const favCheckbox = m.querySelector("#combo-savefav");
        if (favCheckbox && favCheckbox.checked) {
          const nameInput = m.querySelector("#combo-favname");
          const favName = (nameInput?.value||"").trim() || sel.join(" + ");
          state.comboPresets = [...(state.comboPresets||[]), { id: uid(), name: favName, compounds: [...sel] }];
        }
        state._comboSelected = []; state._comboDoses = {}; state._comboDate = null; state._comboSite = null; state._comboNotes = ""; state._comboSymptoms = [];
        saveState(); closeModal(); render();
      } catch(e) { showErrorBanner("comboDoseModal save action: "+e.message); }
    };
  } catch(e) { showErrorBanner("comboDoseModal save-button wiring: "+e.message); }
}

const RESCHED_REASONS = ["Sick","Traveling","Out of supplies","Waiting for symptoms","Doctor recommendation","Personal schedule","Other"];

function rescheduleDoseModal(name, originalDate) {
  const entry = state.peptides[name] || state.customPeptides[name]; if (!entry) return;
  const c = cfg(name);
  const tomorrow = addDays(originalDate, 1);
  let dateMode = "tomorrow";
  let scheduleMode = "keep_schedule";

  const m = openModal(`
    <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:4px">Reschedule ${esc(name)}</div>
    <div class="hint" style="margin-bottom:14px">Originally due ${fmtDate(originalDate)} — this dose will still happen, just on a different day.</div>

    <label class="field-label">NEW DATE</label>
    <div style="display:flex;gap:6px;margin-bottom:12px">
      ${toggleChip("Tomorrow", true, {attrs:'id="rs-opt-tomorrow" class="rs-date-opt" data-mode="tomorrow"', fontSize:"12px", padding:"9px 4px"})}
      ${toggleChip("Pick date", false, {attrs:'id="rs-opt-pick" class="rs-date-opt" data-mode="pick"', fontSize:"12px", padding:"9px 4px"})}
      ${toggleChip("Pick date & time", false, {attrs:'id="rs-opt-picktime" class="rs-date-opt" data-mode="picktime"', fontSize:"12px", padding:"9px 4px"})}
    </div>
    <div id="rs-date-fields" style="display:none;margin-bottom:14px">
      <input id="rs-date" type="date" class="inp" value="${tomorrow}" style="margin-bottom:8px">
      <input id="rs-time" type="time" class="inp" style="display:none">
    </div>

    <label class="field-label">WHAT SHOULD HAPPEN AFTER THIS RESCHEDULED DOSE?</label>
    <button id="rs-schedule-opt-keep" class="rs-schedule-opt" data-mode="keep_schedule" style="display:block;width:100%;text-align:left;border:1px solid #7DF9C0;background:#7DF9C010;border-radius:10px;padding:12px;margin-bottom:8px">
      <div style="font-size:12px;font-weight:700;color:#7DF9C0;margin-bottom:2px">✓ Keep future schedule <span style="font-weight:400;color:var(--t5)">(recommended)</span></div>
      <div style="font-size:11px;color:var(--t4)">Only this dose moves. Future doses stay on the original ${esc(scheduleLabel(entry))} pattern.</div>
    </button>
    <button id="rs-schedule-opt-shift" class="rs-schedule-opt" data-mode="shift_schedule" style="display:block;width:100%;text-align:left;border:1px solid var(--border-sub);background:transparent;border-radius:10px;padding:12px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:700;color:var(--t3);margin-bottom:2px">Shift future schedule</div>
      <div style="font-size:11px;color:var(--t4)">All future doses shift by the same amount, permanently.</div>
    </button>

    <label class="field-label">REASON <span style="color:var(--t5);font-weight:400">(optional)</span></label>
    <select id="rs-reason" class="inp" style="margin-bottom:16px">
      <option value="">— none —</option>
      ${RESCHED_REASONS.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join("")}
    </select>

    <button id="rs-save" class="btn-primary" style="background:#A78BFA">Reschedule</button>
  `, "#A78BFA");

  const setDateMode = (mode) => {
    dateMode = mode;
    document.querySelectorAll(".rs-date-opt").forEach(btn=>{
      const active = btn.dataset.mode===mode;
      btn.style.background = active ? "var(--surface-3)" : "transparent";
      btn.style.borderColor = active ? "var(--border)" : "transparent";
      btn.style.color = active ? "var(--t1)" : "var(--t4)";
    });
    const fields = m.querySelector("#rs-date-fields");
    fields.style.display = mode==="tomorrow" ? "none" : "block";
    m.querySelector("#rs-time").style.display = mode==="picktime" ? "block" : "none";
  };
  m.querySelector("#rs-opt-tomorrow").onclick = () => setDateMode("tomorrow");
  m.querySelector("#rs-opt-pick").onclick = () => setDateMode("pick");
  m.querySelector("#rs-opt-picktime").onclick = () => setDateMode("picktime");

  const setScheduleMode = (mode) => {
    scheduleMode = mode;
    ["keep","shift"].forEach(key=>{
      const btn = m.querySelector(`#rs-schedule-opt-${key}`);
      const active = (key==="keep"?"keep_schedule":"shift_schedule")===mode;
      const color = key==="keep" ? "#7DF9C0" : "var(--t3)";
      btn.style.borderColor = active ? color : "var(--border-sub)";
      btn.style.background = active ? color+"10" : "transparent";
    });
  };
  m.querySelector("#rs-schedule-opt-keep").onclick = () => setScheduleMode("keep_schedule");
  m.querySelector("#rs-schedule-opt-shift").onclick = () => setScheduleMode("shift_schedule");

  m.querySelector("#rs-save").onclick = () => {
    let newDate;
    if (dateMode==="tomorrow") newDate = tomorrow;
    else if (dateMode==="pick") newDate = m.querySelector("#rs-date").value;
    else {
      const d = m.querySelector("#rs-date").value, t = m.querySelector("#rs-time").value;
      newDate = t ? new Date(`${d}T${t}:00`).toISOString() : d;
    }
    if (!newDate) return;

    if (!entry.reschedules) entry.reschedules = [];
    entry.reschedules.push({ id: uid(), originalDate, newDate, mode: scheduleMode, reason: m.querySelector("#rs-reason").value || null, doseId: null });

    // Shift mode on a weekday-scheduled compound: permanently shift the weekday set by the
    // same delta as this move. Interval-scheduled compounds need no special handling here —
    // computing next-due from the actual (moved) dose date, once logged, already produces a
    // natural permanent shift with no extra bookkeeping required.
    if (scheduleMode==="shift_schedule" && isWeekdaySchedule(entry)) {
      const deltaDays = Math.round((safeDate(newDate).getTime()-safeDate(originalDate).getTime())/86400000);
      entry.scheduleWeekdays = entry.scheduleWeekdays.map(d=>((d+deltaDays)%7+7)%7);
    }

    saveState(); closeModal(); render();
  };
}

// The action this whole feature is about: closing out an overdue occurrence instead of
// letting it sit there indefinitely. All four options here converge on the same state
// machine (getScheduledOccurrenceState) — this is just the entry point that presents the
// choice, never a decision made automatically by time elapsed.
function resolveOverdueModal(name, originalDate, opts={}) {
  const c = cfg(name);
  const data = state.peptides[name] || state.customPeptides[name];
  const proto = data ? protocolForData(data) : null;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span style="font-size:15px;font-weight:600;color:var(--t1)">${opts.takenLateFirst?"What happened?":"Resolve overdue"}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:14px">${esc(name)} was due ${fmtDate(originalDate)}. Choose what actually happened so this stops sitting here as overdue.</div>
    ${opts.takenLateFirst?`<button id="ro-takenlate" class="sheet-row">Taken late<div class="sub">You took it — just log it now, whenever that actually was</div></button>`:""}
    <button id="ro-missed" class="sheet-row">Mark as missed<div class="sub">Didn't take it, not making it up — closes it out permanently</div></button>
    <button id="ro-skip" class="sheet-row">Skip dose<div class="sub">Intentionally skipping this scheduled dose</div></button>
    <button id="ro-reschedule" class="sheet-row">Reschedule<div class="sub">Move this specific dose to another date/time</div></button>
    ${proto?`<button id="ro-pause" class="sheet-row">Pause protocol<div class="sub">Temporarily stopping ${esc(proto.name)} — nothing further shows as due until you resume</div></button>`:""}
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  const tl = m.querySelector("#ro-takenlate"); if (tl) tl.onclick = () => { closeModal(); doseModal(name); };
  m.querySelector("#ro-missed").onclick = () => { closeModal(); markMissedModal(name, originalDate); };
  m.querySelector("#ro-skip").onclick = () => { closeModal(); skipDoseModal(name, originalDate); };
  m.querySelector("#ro-reschedule").onclick = () => { closeModal(); rescheduleDoseModal(name, originalDate); };
  const pb = m.querySelector("#ro-pause");
  if (pb) pb.onclick = () => { closeModal(); pauseProtocol(proto); saveState(); render(); };
}

function skipDoseModal(name, originalDate) {
  const entry = state.peptides[name] || state.customPeptides[name]; if (!entry) return;
  const m = openModal(`
    <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:4px">Skip ${esc(name)}</div>
    <div class="hint" style="margin-bottom:14px">Marks ${fmtDate(originalDate)} as intentionally skipped. It will still count as missed for adherence, but the app records that it was deliberate, not forgotten.</div>
    <label class="field-label">REASON <span style="color:var(--t5);font-weight:400">(optional)</span></label>
    <select id="sk-reason" class="inp" style="margin-bottom:16px">
      <option value="">— none —</option>
      ${RESCHED_REASONS.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join("")}
    </select>
    <button id="sk-save" class="btn-primary" style="background:#ff7c7c">Confirm Skip</button>
  `, "#ff7c7c");
  m.querySelector("#sk-save").onclick = () => {
    if (!entry.skips) entry.skips = [];
    entry.skips.push({ id: uid(), date: originalDate, kind: "skipped", reason: m.querySelector("#sk-reason").value || null });
    saveState(); closeModal(); render();
  };
}

// Resolve Overdue → "Mark as missed": the deliberate, permanent verdict that an old
// overdue occurrence was NOT taken and is NOT being made up. Distinct from Skip (which
// implies a conscious in-the-moment choice not to dose that day) — this is for "time has
// passed, I'm not catching this up." Distinct from the auto-derived "overdue" state
// (getScheduledOccurrenceState) in that it's permanent and only ever created here, never
// inferred just because days elapsed — that's the whole point of Resolve Overdue existing
// instead of an automatic timeout.
function markMissedModal(name, originalDate) {
  const entry = state.peptides[name] || state.customPeptides[name]; if (!entry) return;
  const m = openModal(`
    <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:4px">Mark ${esc(name)} as missed</div>
    <div class="hint" style="margin-bottom:14px">Closes out ${fmtDate(originalDate)} as a genuine missed dose — not taken, not being made up. It stays in history as missed, counts against adherence, and stops showing as overdue or as your next dose.</div>
    <label class="field-label">NOTE <span style="color:var(--t5);font-weight:400">(optional)</span></label>
    <textarea id="mm-note" class="inp" placeholder="Anything worth remembering about why" style="min-height:54px;resize:vertical;margin-bottom:16px"></textarea>
    <button id="mm-save" class="btn-primary" style="background:#ff7c7c">Confirm Missed</button>
  `, "#ff7c7c");
  m.querySelector("#mm-save").onclick = () => {
    if (!entry.skips) entry.skips = [];
    entry.skips.push({ id: uid(), date: originalDate, kind: "missed", reason: m.querySelector("#mm-note").value.trim() || null });
    saveState(); closeModal(); render();
  };
}

// Draw-as-you-go: confirms what was ACTUALLY drawn from a specific vial (never assumed
// to match the target or the calculated remaining), and — only if the actual draw came
// up short of what the vial was expected to hold — asks what happened to the gap right
// here, as part of drawing, rather than as a separate trip to Stash afterward. The vial
// is marked finished as a natural consequence of having now accounted for its full
// expected content (drawn + reconciled), not as a separate manual step.
// A dose's SOURCES have to add up to the dose. Taking far more out of a vial than the dose itself
// is almost always a unit mix-up (e.g. typing the "39 units left" from a pen into a field that is
// in mg) — it used to be accepted, which saved a 3mg dose that took 10.4mg out of a vial and
// emptied it. A little extra (a priming loss, a slightly generous draw) is tolerated; anything
// beyond max(0.05, 25% of the dose) is not. Taking LESS than the dose is the separate shortfall flow.
function allocationOverdrawsDose(plannedMg, neededMg) {
  // + 1e-9: 0.17 - 0.12 is 0.05000000000000002 in floating point, which must still count as "exactly the allowance".
  return plannedMg - neededMg > Math.max(0.05, neededMg * 0.25) + 1e-9;
}
function drawFromVialModal(kit, vial, targetAmount, onComplete, onCancel) {
  const c = cfg(kit.name);
  // Work entirely in the compound's own NATIVE unit throughout this function — targetAmount
  // and whatever the person types are already native-unit (matching every other input in
  // this flow), so vialRemaining is converted ONCE here rather than compared directly
  // against a canonical-mg number. wasteLog.mg is the one place that must stay canonical
  // mg (every other place that reads it assumes that), so the reconciliation amount is
  // converted back via doseToMg() right before it's stored, not before.
  const vialRemaining = mgToUnit(getVialRemainingMg(kit, vial), c.unit);
  // What this specific draw is actually trying to get — capped by what's physically left,
  // but NOT assumed to be the whole vial. A vial only gets finished if it's actually
  // emptied by this draw; drawing a modest amount out of a large, mostly-full vial (the
  // normal case when a syringe pulls partial material from a freshly opened backup) must
  // leave that vial open with its true remainder, not force it closed.
  const intendedDraw = Math.min(targetAmount, vialRemaining);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">DRAW — ${esc(kit.name.toUpperCase())}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div id="draw-step-1">
      <div style="font-size:12px;color:var(--t4);margin-bottom:12px">Vial has ~${vialRemaining.toFixed(1)}${c.unit} remaining. Drawing ~${intendedDraw.toFixed(1)}${c.unit} for this syringe — enter what you actually got, it doesn't need to match exactly.</div>
      <label class="field-label">HOW MUCH DID YOU ACTUALLY DRAW? (${c.unit})</label>
      <input id="draw-actual" type="number" step="0.01" class="inp" value="${intendedDraw.toFixed(2)}" style="margin-bottom:18px">
      <button id="draw-confirm" class="btn-primary" style="background:${c.color}">Confirm Draw</button>
    </div>
    <div id="draw-step-2" style="display:none"></div>
  `, c.color);
  // v0.8.0: Escape/backdrop must behave exactly like the Draw X-button.
  // Do not reconcile or decrement inventory from these dismissal paths.
  if (modalEl) modalEl._nexusOnUserDismiss = () => {
    if (typeof onCancel === "function") onCancel();
  };
  m.querySelector("#x").onclick = () => {
    closeModal();
    // A canceled draw must return to the unfinished dose/prepare entry.
    // Do not reconcile inventory or mark the source row completed.
    if (typeof onCancel === "function") onCancel();
  };
  m.querySelector("#draw-confirm").onclick = () => {
    const rawActual = m.querySelector("#draw-actual").value.trim();
    const actual = Number(rawActual);
    if (!rawActual || !Number.isFinite(actual) || actual < 0) {
      showErrorBanner("Enter a valid non-negative amount actually drawn before continuing.");
      return;
    }
    // This field is in the compound's own unit (mg, mcg…), NOT pen or syringe units. A number from a
    // pen's dial — "39 units left" — typed here used to read as "more than the vial holds", which
    // emptied the vial and locked the row to the whole thing. Refuse it instead.
    if (actual > vialRemaining + 0.01) {
      showErrorBanner(`That's more than the ${vialRemaining.toFixed(1)}${c.unit} this vial holds. This field is in ${c.unit}, not pen or syringe units — convert first, or enter what you actually drew.`);
      return;
    }
    // "Emptied" is judged against the vial's true remaining contents — a draw that used
    // up everything left finishes the vial no matter how small the row's own target was.
    // A draw that fell short of what THIS syringe needed is judged separately, against
    // the intended draw, not the vial's full contents — so a deliberate partial draw from
    // a vial with plenty left over doesn't get treated as a shortfall at all.
    if(kit.isBlend){
      // Preserve the confirmed actual amount in the parent dose/preparation draft.
      // The blend ledger is committed ONLY on final Confirm, never twice here.
      closeModal();onComplete(actual);return;
    }
    const emptiesVial = (vialRemaining - actual) <= 0.01;
    const drawShortfall = Math.round((intendedDraw - actual)*100)/100;
    // For a v2-migrated vial, remainingMg is authoritative and must actually move here —
    // this is the one moment the material leaves the vial. finishVial() already zeroes it
    // when the vial's fully drained; for anything less than that, nothing else was ever
    // going to decrement it, which is exactly what silently let a partial draw's material
    // vanish from the ledger while still being recorded as consumed.
    if (vial.remainingMg !== undefined && !emptiesVial) {
      vial.remainingMg = Math.max(0, Math.round((vial.remainingMg - doseToMg(actual, c.unit))*100)/100);
    }
    if (drawShortfall <= 0.01) {
      // Got at least what this syringe needed — nothing to reconcile. Only finish the
      // vial if that draw also happened to empty it; otherwise it stays active/open with
      // its remainder available for the next preparation.
      if (emptiesVial) finishVial(kit, vial, "used_in_dose");
      saveState(); closeModal();
      onComplete(actual);
      return;
    }
    // Came up short of what THIS draw needed — ask what happened to the gap, right here
    // as part of drawing, rather than a separate trip to Stash afterward.
    const REASONS = [
      { key:"discarded", label:"Discarded / unusable / spilled" },
      { key:"discrepancy", label:"Vial was empty / inventory discrepancy" },
      { key:"other", label:"Other" },
    ];
    m.querySelector("#draw-step-1").style.display = "none";
    const step2 = m.querySelector("#draw-step-2");
    step2.style.display = "block";
    step2.innerHTML = `
      <div style="font-size:13px;font-weight:600;color:var(--t1);margin-bottom:6px">${drawShortfall.toFixed(1)}${c.unit} unaccounted for</div>
      <div class="hint" style="margin-bottom:14px">You drew ${actual.toFixed(1)}${c.unit}, but this draw needed ${intendedDraw.toFixed(1)}${c.unit}. What happened to the remaining ${drawShortfall.toFixed(1)}${c.unit}? This won't be counted as part of your dose.</div>
      ${REASONS.map((r,i)=>`<button class="draw-reason-opt" data-key="${r.key}" style="display:block;width:100%;text-align:left;padding:11px 12px;border-radius:9px;background:${i===0?"var(--surface-3)":"transparent"};border:1px solid ${i===0?"var(--border)":"transparent"};margin-bottom:4px;font-size:13px;color:${i===0?"var(--t1)":"var(--t3)"};font-weight:600">${r.label}</button>`).join("")}
      <div id="draw-other-field" style="display:none;margin:10px 0"><input id="draw-other-text" class="inp" placeholder="What happened?"></div>
      <button id="draw-reconcile-save" class="btn-primary" style="background:${c.color};margin-top:10px">${emptiesVial?"Confirm & Finish Vial":"Confirm"}</button>
    `;
    let reasonKey = "discarded";
    step2.querySelectorAll(".draw-reason-opt").forEach(btn=>btn.onclick=()=>{
      reasonKey = btn.dataset.key;
      step2.querySelectorAll(".draw-reason-opt").forEach(b2=>{ const on=b2.dataset.key===reasonKey; b2.style.background=on?"var(--surface-3)":"transparent"; b2.style.borderColor=on?"var(--border)":"transparent"; b2.style.color=on?"var(--t1)":"var(--t3)"; });
      step2.querySelector("#draw-other-field").style.display = reasonKey==="other" ? "block" : "none";
    });
    step2.querySelector("#draw-reconcile-save").onclick = () => {
      const otherText = step2.querySelector("#draw-other-text")?.value?.trim();
      const reasonLabel = reasonKey==="discarded" ? "Discarded — short draw"
        : reasonKey==="discrepancy" ? "Inventory discrepancy — vial short on draw"
        : (otherText || "Other — short draw");
      if (!kit.wasteLog) kit.wasteLog = [];
      kit.wasteLog.push({ id:uid(), date:localDate(), loggedAt:new Date().toISOString(), mg:doseToMg(drawShortfall, c.unit), type: reasonKey==="discrepancy"?"adjustment":"waste", reason:reasonLabel, notes:"", status:"active", vialId:vial.id });
      // Both what was actually drawn AND the unaccounted shortfall left the vial — for a
      // v2 vial that must be reflected in remainingMg directly, the same as the exact-
      // match branch above; the waste log entry is history/audit, not a substitute for
      // actually moving the authoritative number.
      if (vial.remainingMg !== undefined && !emptiesVial) {
        vial.remainingMg = Math.max(0, Math.round((vial.remainingMg - doseToMg(intendedDraw, c.unit))*100)/100);
      }
      if (emptiesVial) finishVial(kit, vial, reasonKey);
      saveState(); closeModal();
      onComplete(actual);
    };
  };
}

// Debounce — used specifically so live-updating panels (allocation totals, suggested
// splits) recompute after a pause in typing rather than on every keystroke. A full
// panel.innerHTML rebuild firing on every keystroke is a known trigger for iOS Safari to
// dismiss the on-screen keyboard mid-entry, even when the focused input's own DOM node
// isn't the one being replaced — the reflow next to it is enough. Debouncing means the
// heavy rebuild only happens once typing actually pauses.
function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
}

function doseModal(name, existing, occTime) {
  const c = cfg(name);
  const cData = allPeptides()[name] || {};
  const blendKits=state.supplies.filter(k=>k.name===name&&k.isBlend);
  const isBlend=blendKits.length>0;
  const blendFormulation=blendKits[0]||null;
  const doseHistory = [...(cData.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const recent = doseHistory.slice(0,3).map(d=>d.site).filter(Boolean);
  const occIndex = occTime ? getOccurrenceTimes(cData).indexOf(timeKeyOf(occTime+":00")) : -1;
  const occAmt = occIndex>=0 ? occurrenceDoseAmount(cData, occIndex) : null;
  // A draft persists across "Open New Vial" mid-dose — restored here so the in-progress
  // dose (amount, date, site, notes, and whatever's already been allocated) is never lost
  // just because the current vial ran out partway through drawing it up.
  const draft = state._pendingDoseDraft && state._pendingDoseDraft.name===name ? state._pendingDoseDraft : null;
  const lastDoseAmt = draft?.dose || occAmt || doseHistory[0]?.dose || "";
  const isNasal = cData.route === "Nasal";
  const siteList = sitesFor(cData);
  const suggestedSite = (() => {
    if (!recent.length) return siteList[0];
    const idx = siteList.indexOf(recent[0]);
    if (idx===-1) return siteList[0];
    for (let i=1;i<=siteList.length;i++){ const s=siteList[(idx+i)%siteList.length]; if(!recent.includes(s)) return s; }
    return siteList[0];
  })();
  const f = existing
    ? { ...existing, symptoms: existing.symptoms||[] }
    : { id:draft?.id||uid(), date:draft?.date||occTime||localDatetime(), dose:lastDoseAmt, site:draft?.site||suggestedSite, symptoms:draft?.symptoms||[], notes:draft?.notes||"", escalation:draft?.escalation||false };
  const isEdit = !!existing;
  const occLabel = (occIndex>=0 && cData.dosesPerDay>1) ? ` — ${occIndex===0?"MORNING":occIndex===getOccurrenceTimes(cData).length-1?"EVENING":"DOSE "+(occIndex+1)}` : "";
  state._pendingDoseDraft = null; // consumed — cleared unless we re-save it below on "Open New Vial"

  const preparedBatches = !isEdit ? (state.preparedDoses||[]).filter(pd=>pd.remainingCount>0 && !(pd.components&&pd.components.length>1) && getSyringeComponents(pd).some(c=>c.compoundName===name)) : [];
  let selectedSource = draft ? "fresh" : (preparedBatches.length===1) ? preparedBatches[0].id : "fresh";

  // Multi-vial allocation rows — {kitId, mg}. Restored from a draft (partial allocation
  // already drawn before the vial ran out), otherwise starts empty and is only populated
  // once the typed dose amount exceeds what the active vial alone can cover.
  let rows = draft?.rows ? draft.rows.map(r=>({...r})) : [];
  let multiMode = !!draft;

  // Which kit a "fresh from vial" dose actually draws from. Previously this was
  // unconditionally "whichever kit has activeKit===true" — fine when only one kit could
  // ever hold that flag, ambiguous now that several can (e.g. a 10mg-vial kit and a
  // 30mg-vial kit both open at once). Defaults to the person's last choice for this
  // compound, or the one with least remaining if there's no memory yet; the picker below
  // lets them override per-dose, and the choice is remembered again on save.
  let selectedKitId = defaultSourceKit(name)?.kit.id ?? null;
  const activeKit = () => selectedKitId!=null ? state.supplies.find(s=>s.id===selectedKitId) : state.supplies.find(s=>s.name===name && s.activeKit);
  const otherKitsWithStock = () => state.supplies.filter(s=>s.name===name && getKitRemainingMg(s)>0.001);
  const eligibleSources = getEligibleSourceKits(name);
  const needsKitPicker = !isEdit && eligibleSources.length > 1;

  const m = openModal(`
    <div class="nx-dose-form">
    <div class="nx-dose-scroll">
    <div class="nx-dose-head">
      <div><div class="nx-dose-kicker">${isEdit?"EDIT ENTRY":"NEW ENTRY"}</div>
      <div class="nx-dose-title">${isEdit?"Edit dose":"Log a dose"}</div>
      <div class="nx-dose-subtitle">${esc(name)}${occLabel}</div></div>
      <button id="x" type="button" class="nx-dose-close" aria-label="Close dose form">✕</button>
    </div>
    ${!isEdit&&recent.length?`<div class="hint" style="margin-bottom:12px">Recent sites: ${recent.map(esc).join(" → ")} · suggested next: ${esc(suggestedSite)}</div>`:""}
    <section class="nx-dose-section" aria-label="Dose source">
      <div class="nx-dose-section-title">Dose source</div>
      <p class="nx-dose-section-desc">${isEdit ? "The saved source is retained when editing this entry." : "Select the prepared dose or vial used for this entry."}</p>
    ${!preparedBatches.length && !isEdit ? `<div class="nx-dose-source-readout" aria-label="Dose source: fresh from vial">
      <span class="nx-dose-source-dot" aria-hidden="true"></span>
      <div><strong>Fresh from vial</strong><small>${eligibleSources.length===0
        ? "No open vial linked. Logging this dose will not deduct inventory."
        : eligibleSources.length===1
          ? `Open ${esc(eligibleSources[0].kit.vialMg||"?")}${esc(c.unit)} vial · ${mgToUnit(getVialRemainingMg(eligibleSources[0].kit,eligibleSources[0].vial),c.unit).toFixed(2)}${esc(c.unit)} remaining`
          : `${eligibleSources.length} open vials available — select which to use below.`}</small></div>
    </div>` : ""}
    ${isEdit ? `<div class="nx-dose-source-readout"><span class="nx-dose-source-dot" aria-hidden="true"></span><div><strong>Existing dose record</strong><small>Original source information stays linked to this dose.</small></div></div>` : ""}
    ${preparedBatches.length?`<div id="source-picker" style="margin-bottom:14px">
      <label class="field-label">SOURCE</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
        ${preparedBatches.map(pd=>`<button class="src-opt" data-src="${pd.id}" style="padding:7px 12px;border-radius:9px;font-size:12px;font-weight:600;background:${selectedSource===pd.id?c.color+"22":"var(--surface-2)"};border:1px solid ${selectedSource===pd.id?c.color:"var(--border)"};color:${selectedSource===pd.id?c.color:"var(--t3)"}">Prepared ${esc(pd.amountEach)}${c.unit} (${pd.remainingCount} left)</button>`).join("")}
        <button class="src-opt" data-src="fresh" style="padding:7px 12px;border-radius:9px;font-size:12px;font-weight:600;background:${selectedSource==="fresh"?c.color+"22":"var(--surface-2)"};border:1px solid ${selectedSource==="fresh"?c.color:"var(--border)"};color:${selectedSource==="fresh"?c.color:"var(--t3)"}">Fresh from vial</button>
      </div>
    </div>`:""}
    <div id="kit-picker" style="margin-bottom:14px;${needsKitPicker&&selectedSource==="fresh"?"":"display:none"}">
      <label class="field-label">WHICH VIAL</label>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
        ${eligibleSources.map(({kit,vial})=>`<button class="kit-opt" data-kit="${kit.id}" style="padding:7px 12px;border-radius:9px;font-size:12px;font-weight:600;background:${selectedKitId===kit.id?c.color+"22":"var(--surface-2)"};border:1px solid ${selectedKitId===kit.id?c.color:"var(--border)"};color:${selectedKitId===kit.id?c.color:"var(--t3)"}">${esc(kit.vialMg||"?")}${c.unit}/vial · ${mgToUnit(getVialRemainingMg(kit,vial),c.unit).toFixed(2)}${c.unit} left</button>`).join("")}
      </div>
    </div>
    </section>
    <section class="nx-dose-section" aria-label="Administration details">
      <div class="nx-dose-section-title">Administration details</div>
      <p class="nx-dose-section-desc">Review the amount, date and administration site.</p>
    <label class="field-label">DATE & TIME</label>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <input id="date" type="datetime-local" class="inp" value="${esc(f.date)}" style="flex:1">
      <button id="date-now" type="button" style="padding:0 16px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px;font-weight:600;white-space:nowrap">Now</button>
    </div>
    <div id="counts-for" style="font-size:11px;color:#A78BFA;line-height:1.4;margin:-8px 0 14px"></div>
    ${isNasal && cData.mcgPerSpray>0 && selectedSource==="fresh" ? `
    <label class="field-label">SPRAYS</label>
    <input id="sprays" type="number" min="0" step="1" class="inp" placeholder="e.g. 2" value="${f.sprayCount||''}" style="margin-bottom:4px">
    <div id="sprays-mg-hint" style="font-size:11px;color:var(--t4);margin-bottom:8px">${f.sprayCount?`= ${mgToUnit(doseToMg(f.sprayCount*cData.mcgPerSpray,"mcg"),c.unit).toFixed(3)}${c.unit}`:`&nbsp;`}</div>
    <input id="dose" type="hidden" value="${esc(f.dose)}">
    ` : `
    <label class="field-label">DOSE (${c.unit})</label><input id="dose" type="number" class="inp" placeholder="e.g. 2" value="${esc(selectedSource!=="fresh"?(preparedBatches.find(p=>p.id===selectedSource)?.amountEach||f.dose):f.dose)}" style="margin-bottom:8px">
    ${isNasal && !(cData.mcgPerSpray>0) ? `<div style="font-size:10.5px;color:var(--t5);margin-bottom:8px">Set MCG PER SPRAY in this compound's settings (⚙ below on its Today card) to log by spray count instead.</div>` : ""}
    `}
    ${isBlend?`<div id="nx-blend-dose-breakdown" style="font-size:11px;line-height:1.6;color:var(--t3);margin:2px 0 12px" aria-live="polite"></div>`:""}
    ${!isEdit ? `<button id="toggle-multi" style="background:transparent;border:none;padding:0;font-size:11px;color:var(--t4);margin-bottom:14px">${multiMode?"− Use a single vial instead":"+ Use multiple vials"}</button>` : ""}
    <div id="alloc-panel" style="margin-bottom:14px"></div>
    <label class="field-label">${siteLabelFor(cData)}</label><select id="site" class="inp" style="margin-bottom:14px">${siteList.map(s=>`<option${s===f.site?" selected":""}>${esc(s)}</option>`).join("")}</select>
    </section>
    <details class="nx-dose-section nx-dose-optional" aria-label="Observations"${isEdit ? " open" : ""}>
      <summary>Observations <span style="font-size:11px;color:var(--t3);font-weight:500;margin-left:auto">Optional</span></summary>
      <div class="nx-dose-optional-body">
      <p class="nx-dose-section-desc">Symptoms and notes associated with this entry.</p>
    <label class="field-label">SYMPTOMS AFTER THIS DOSE</label><div id="sym" style="margin-bottom:14px"></div>
    <label class="field-label">NOTES</label><textarea id="notes" class="inp" placeholder="Anything worth capturing…" style="min-height:54px;resize:vertical;margin-bottom:14px">${esc(f.notes||"")}</textarea>
    <label style="display:flex;align-items:center;gap:10px;margin-bottom:18px;font-size:13px;color:var(--t3)"><input id="esc" type="checkbox" style="accent-color:${c.color}"${f.escalation?" checked":""}> This dose is an escalation</label>
      </div>
    </details>
    </div><!-- scrollable dose form -->
    <div class="nx-dose-footer">
      <div class="nx-dose-review-note">Confirm the date, recorded amount, units and source before saving.</div>
      <button id="save" class="btn-primary" style="background:${c.color}">${isEdit?"SAVE CHANGES":"CONFIRM LOG"}</button>
    </div>
    </div>
  `, c.color);
  // Apply the existing responsive/accessible dose modal rules to EVERY normal entry.
  m.classList.add("nx2-dose-modal");
  m.querySelector("#x").onclick = closeModal;
  const sym = m.querySelector("#sym"); sym.innerHTML = symptomPickerHTML(f.symptoms, c.color); wireSymptomPicker(sym, f.symptoms, c.color);
  m.querySelectorAll(".src-opt").forEach(b=>b.onclick=()=>{
    selectedSource = b.dataset.src==="fresh" ? "fresh" : +b.dataset.src;
    m.querySelectorAll(".src-opt").forEach(o=>{ const on=(o.dataset.src==="fresh"?"fresh":+o.dataset.src)===selectedSource; o.style.background=on?c.color+"22":"var(--surface-2)"; o.style.borderColor=on?c.color:"var(--border)"; o.style.color=on?c.color:"var(--t3)"; });
    if (selectedSource!=="fresh") { const pd=preparedBatches.find(p=>p.id===selectedSource); if(pd) m.querySelector("#dose").value = pd.amountEach; }
    const kp = m.querySelector("#kit-picker");
    if (kp) kp.style.display = (needsKitPicker && selectedSource==="fresh") ? "" : "none";
    renderAllocPanel();
  });
  m.querySelectorAll(".kit-opt").forEach(b=>b.onclick=()=>{
    selectedKitId = +b.dataset.kit;
    m.querySelectorAll(".kit-opt").forEach(o=>{ const on=+o.dataset.kit===selectedKitId; o.style.background=on?c.color+"22":"var(--surface-2)"; o.style.borderColor=on?c.color:"var(--border)"; o.style.color=on?c.color:"var(--t3)"; });
    // Switching source kit invalidates whatever rows were seeded against the previous
    // one — clear and let renderAllocPanel reseed against the newly chosen vial.
    rows = [];
    renderAllocPanel();
  });

  // Renders the "not enough in current vial" / multi-vial allocation UI. Only appears
  // when it's actually needed — a normal dose that the active vial fully covers never
  // shows this at all.
  function renderAllocPanel() {
    const panel = m.querySelector("#alloc-panel");
    if (!panel) return;
    if (isEdit || selectedSource!=="fresh") { panel.innerHTML=""; return; }
    const doseAmtStr = m.querySelector("#dose")?.value || f.dose;
    const neededMg = doseToMg(doseAmtStr, c.unit);
    // The UI is shared. Premixed blends keep one administration record and an
    // explicit vial-ID ledger, rather than independent ingredient administrations.
    if(isBlend){ panel.innerHTML=""; return; } // Blend allocations commit only when Save is tapped.\n    const ak = activeKit();
    // "Current vial" must mean the OPEN vial specifically — not the kit's total including
    // sealed reserve that hasn't been reconstituted yet. getKitRemainingMg is correctly
    // kit-wide (that's its job), but using it here mislabeled "Current vial" with a number
    // that silently included unopened backups — the same gap already fixed in Prepare
    // Dose. It matters even more now: consumeCompoundInventory only ever draws from the
    // truly open vial, so this trigger must agree with what will actually happen on save.
    const akVial = ak ? getActiveVial(ak) : null;
    const akRemaining = akVial ? getVialRemainingMg(ak, akVial) : 0;
    const shortBy = neededMg - akRemaining;

    if (!multiMode && shortBy <= 0.001) { panel.innerHTML=""; return; }

    // Seed rows the first time the panel becomes relevant. Scoped to the OPEN VIAL
    // specifically, same reasoning as the trigger above — suggestAllocation sums a kit's
    // sealed reserve together with its open vial as if all of it were instantly
    // drawable, which would silently re-introduce the exact mismatch just fixed.
    if (!rows.length && neededMg>0) {
      if (akVial && akRemaining > 0.001) rows = [{kitId:ak.id, vialId:akVial.id, mg:Math.round(Math.min(neededMg, akRemaining)*100)/100}];
      else if (ak) rows = [{kitId:ak.id, mg:0}];
    }
    const totalAllocated = rows.reduce((a,r)=>a+(parseFloat(r.mg)||0),0);
    const remaining = Math.round((neededMg-totalAllocated)*100)/100;
    const totalUsableAllKits = otherKitsWithStock().reduce((a,s)=>a+getKitRemainingMg(s),0) + rows.reduce((sum,r)=>{ const k=state.supplies.find(s=>s.id===r.kitId); return sum; },0);
    // ^ total usable across kits with stock already reflects what's not yet allocated; add back what THIS dose has already claimed from those kits to get true total capacity.
    const totalCapacity = state.supplies.filter(s=>s.name===name).reduce((a,s)=>a+getKitRemainingMg(s),0) + totalAllocated;
    // neededMg, akRemaining, shortBy, rows[].mg, totalAllocated, remaining, totalCapacity
    // are all canonical mg internally — every number actually shown to a person needs the
    // compound's own native unit or it's off by 1000x for any mcg compound.
    const fmt = (mg) => mgToUnit(mg, c.unit).toFixed(2);

    panel.innerHTML = `
      <div class="nx-allocation-card" style="background:${shortBy>0.001?"#F9C87D11":"var(--surface-2)"};border:1px solid ${shortBy>0.001?"#F9C87D33":"var(--border-sub)"};border-radius:10px;padding:12px 14px">
        ${shortBy>0.001?`<div class="nx-shortfall-eyebrow">Inventory resolution</div><div class="nx-allocation-heading" role="status">Not enough in current vial</div><p class="nx-shortfall-intro">Review your dose allocation below. You can use another available vial or open a sealed vial without losing this entry.</p>
        <div class="nx-allocation-summary" aria-label="Vial availability">
          <div class="nx-allocation-metric"><small>Dose needed</small><strong>${fmt(neededMg)} ${c.unit}</strong></div>
          <div class="nx-allocation-metric"><small>Open vial</small><strong>${fmt(akRemaining)} ${c.unit}</strong></div>
          <div class="nx-allocation-metric"><small>Short by</small><strong style="color:#F9C87D">${fmt(shortBy)} ${c.unit}</strong></div>
        </div>`
        : `<div style="font-size:11px;color:var(--t4);margin-bottom:10px">Sources for this dose</div>`}
        <div class="nx-shortfall-step">Step 1 · Allocate the dose</div>
        <div class="nx-shortfall-progress" role="progressbar" aria-label="Dose amount allocated" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(Math.max(0,Math.min(100,neededMg>0?totalAllocated/neededMg*100:0)))}"><div style="width:${Math.max(0,Math.min(100,neededMg>0?totalAllocated/neededMg*100:0))}%"></div></div>
        <div class="nx-shortfall-status" aria-live="polite">${remaining>0.01?`${fmt(remaining)} ${c.unit} still needs a source.`:remaining < -0.01?`Allocation exceeds the requested dose by ${fmt(Math.abs(remaining))} ${c.unit}.`:`✓ Allocation matches the requested dose.`}</div>
        <div id="alloc-rows">
          ${rows.map((r,i)=>{
            const kit = state.supplies.find(s=>s.id===r.kitId);
            const units = kit ? mgToUnitsForKit(parseFloat(r.mg)||0, kit) : null;
            const kitFinished = kit && !kit.activeKit && !!r.finished;
            const kitLabel = kit ? (kitFinished?"Finished vial":kit.activeKit?"Current vial":kit.reconDate?"Open vial":"Vial") : "Vial";
            const kitHasStock = kit && !kitFinished && getKitRemainingMg(kit)>0.001;
            return `<div class="nx-alloc-row" style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:11px;color:${kitFinished?"var(--t5)":"var(--t3)"};flex:1;min-width:0">${esc(kitLabel)}${kitFinished?" ✓":""}</span>
              <input type="number" step="0.01" class="alloc-mg-input inp" data-i="${i}" value="${mgToUnit(parseFloat(r.mg)||0, c.unit)}" ${kitFinished?"disabled":""} style="width:78px;height:32px;padding:0 8px;font-size:12px;${kitFinished?"opacity:0.6":""}">
              <span style="font-size:10px;color:var(--t5);width:34px">${c.unit}</span>
              ${units!=null?`<span style="font-size:10px;color:var(--t5);min-width:50px">${units.toFixed(1)}u</span>`:`<span style="width:50px"></span>`}
              ${kitHasStock?`<button class="alloc-draw" data-i="${i}" title="Confirm what you actually drew from this vial" style="font-size:9px;color:#F9C87D;background:#F9C87D14;border:1px solid #F9C87D33;border-radius:5px;padding:4px 6px;white-space:nowrap">Draw</button>`:""}
              <button class="alloc-remove" data-i="${i}" style="color:var(--t5);font-size:13px;background:transparent;border:none;padding:2px 4px">✕</button>
            </div>`;
          }).join("")}
        </div>
        <div class="nx-allocation-help">Use <strong>Draw</strong> to confirm what you actually obtained from each vial. If the draw is short, Nexus will ask you to reconcile the difference. Multiple sources still create <strong>one dose record</strong>.</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-sub)">
          <span style="font-size:11px;color:var(--t4)">Total: <b style="color:${Math.abs(remaining)<0.01?"#7DF9C0":"var(--t2)"}">${fmt(totalAllocated)}${c.unit}</b> / ${fmt(neededMg)}${c.unit}</span>
          ${Math.abs(remaining)<0.01?`<span style="font-size:11px;color:#7DF9C0">✓ Matches dose</span>`:remaining>0?`<span style="font-size:11px;color:#F9C87D">${fmt(remaining)}${c.unit} still needed</span>`:`<span style="font-size:11px;color:#FF7C7C">${fmt(Math.abs(remaining))}${c.unit} over</span>`}
        </div>
        ${remaining>0.01 ? `<div class="nx-shortfall-step">Step 2 · Resolve the remaining amount</div>` : ""}
        ${remaining>0.01 ? (
          otherKitsWithStock().filter(k=>!rows.some(r=>r.kitId===k.id)).length
            ? `<button id="alloc-add-kit" style="width:100%;margin-top:10px;padding:9px;border-radius:8px;background:var(--surface-3);border:1px solid var(--border);color:var(--t2);font-size:12px">+ Use another open vial</button>`
            : (totalCapacity + 0.01 < neededMg
                ? `<div style="margin-top:10px;font-size:11px;color:#FF7C7C">Only ${fmt(totalCapacity)}${c.unit} total usable inventory exists for ${esc(name)} — open a new vial to cover the remaining ${fmt(neededMg-totalCapacity)}${c.unit}.</div>`
                : "")
        ) : ""}
        <button id="alloc-open-new" style="width:100%;margin-top:8px;padding:10px;border-radius:9px;background:${c.color}18;border:1px solid ${c.color}44;color:${c.color};font-size:12px;font-weight:600">+ Open a sealed vial</button>
      </div>`;

    panel.querySelectorAll(".alloc-mg-input").forEach(inp=>inp.oninput=()=>{ rows[+inp.dataset.i].mg = doseToMg(inp.value, c.unit); debouncedRenderAllocPanel(); });
    panel.querySelectorAll(".alloc-remove").forEach(b=>b.onclick=()=>{ rows.splice(+b.dataset.i,1); renderAllocPanel(); });
    panel.querySelectorAll(".alloc-draw").forEach(b=>b.onclick=()=>{
      // Save the in-progress dose as a draft first — drawFromVialModal opens its own
      // modal, which closes this one. onComplete reopens doseModal with the confirmed
      // actual amount locked into this row, exactly like "Open New Vial" mid-dose.
      const i = +b.dataset.i, r = rows[i], kit = state.supplies.find(s=>s.id===r.kitId);
      if (!kit) return;
      const vial = getActiveVial(kit);
      if (!vial) return;
      const target = parseFloat(r.mg)||0;
      state._pendingDoseDraft = {
        name, id:f.id, dose:m.querySelector("#dose").value, date:m.querySelector("#date").value,
        site:m.querySelector("#site").value, notes:m.querySelector("#notes").value,
        escalation:m.querySelector("#esc").checked, symptoms:f.symptoms, rows: rows.map(r2=>({...r2})),
      };
      closeModal();
      drawFromVialModal(kit, vial, target, (actualMg) => {
        r.mg = actualMg; r.vialId = vial.id; r.finished = !kit.isBlend;
        state._pendingDoseDraft.rows = rows.map(r2=>({...r2}));
        doseModal(name);
      }, () => doseModal(name));
    });
    const addKitBtn = panel.querySelector("#alloc-add-kit");
    if (addKitBtn) addKitBtn.onclick = () => {
      const nextKit = otherKitsWithStock().filter(k=>!rows.some(r=>r.kitId===k.id))[0];
      if (nextKit) { const take = Math.min(getKitRemainingMg(nextKit), remaining); rows.push({kitId:nextKit.id, mg:Math.round(take*100)/100}); renderAllocPanel(); }
    };
    const openNewBtn = panel.querySelector("#alloc-open-new");
    if (openNewBtn) openNewBtn.onclick = () => {
      // Preserve everything about this in-progress dose, then hand off to Reconstitute —
      // its own save flow will reopen this exact dose modal afterward with the new vial
      // available and already suggested for the remaining amount.
      const draftRows = rows.map(r=>({...r}));
      state._pendingDoseDraft = {
        name, id:f.id, dose:m.querySelector("#dose").value, date:m.querySelector("#date").value,
        site:m.querySelector("#site").value, notes:m.querySelector("#notes").value,
        escalation:m.querySelector("#esc").checked, symptoms:f.symptoms, rows: draftRows,
      };
      closeModal();
      const sealedKit = state.supplies.find(s=>s.name===name && getSealedVials(s).length>0);
      // A kit qualifies if IT has a sealed vial available — not "has this kit never been
      // opened at all," which is wrong the moment a vial is already active (this exact
      // kit still has sealed backups sitting in it, they just aren't the current one).
      if (sealedKit) {
        reconstituteVialModal(sealedKit, (newVial) => {
          // Append the newly reconstituted vial as its OWN source row rather than letting
          // it silently vanish — reopening doseModal with only the old row was exactly
          // the same bug already found and fixed in Prepare Dose (the new vial "not
          // appearing," "override," and "getting lost" reports). newVial comes directly
          // from reconstituteVialModal's callback, not a re-derived getActiveVial() call
          // — the instant a kit has two vials simultaneously non-empty, that lookup is
          // ambiguous and can silently resolve to the wrong one.
          const draft = state._pendingDoseDraft;
          if (draft && newVial) {
            const alreadyAllocated = draft.rows.reduce((a,r)=>a+(parseFloat(r.mg)||0),0);
            const targetTotal = doseToMg(draft.dose, c.unit);
            const stillNeeded = Math.max(0, Math.round((targetTotal-alreadyAllocated)*100)/100);
            const vialRemaining = getVialRemainingMg(sealedKit, newVial);
            const take = Math.round(Math.min(stillNeeded, vialRemaining)*100)/100;
            if (take>0) draft.rows.push({ kitId: sealedKit.id, vialId: newVial.id, mg: take });
          }
          doseModal(name);
        });
      }
      else { supplyModal(null, name); }
    };
  }
  // Stable debounced reference — must persist across calls so the debounce timer works
  // correctly (a fresh debounce() wrapper on every keystroke would never actually delay
  // anything).
  const debouncedRenderAllocPanel = debounce(renderAllocPanel, 500);
  m.querySelector("#dose").oninput = debouncedRenderAllocPanel;
  const dateNowBtn = m.querySelector("#date-now");
  const countsForEl = m.querySelector("#counts-for"), dateInp = m.querySelector("#date");
  const refreshCountsFor = () => { if (countsForEl) countsForEl.textContent = countsForNote(cData, dateInp.value); };
  dateInp.addEventListener("input", refreshCountsFor); dateInp.addEventListener("change", refreshCountsFor);
  if (dateNowBtn) dateNowBtn.onclick = () => { m.querySelector("#date").value = localDatetime(); refreshCountsFor(); };
  refreshCountsFor();
  const spraysInput = m.querySelector("#sprays");
  if (spraysInput) {
    spraysInput.oninput = () => {
      const sprays = parseFloat(spraysInput.value) || 0;
      const doseMg = doseToMg(sprays * cData.mcgPerSpray, "mcg");
      m.querySelector("#dose").value = mgToUnit(doseMg, c.unit);
      const hint = m.querySelector("#sprays-mg-hint");
      if (hint) hint.innerHTML = sprays ? `= ${mgToUnit(doseMg, c.unit).toFixed(3)}${c.unit}` : "&nbsp;";
      debouncedRenderAllocPanel();
    };
  }
  if(isBlend){
    const refreshBlendBreakdown=()=>{
      const holder=m.querySelector("#nx-blend-dose-breakdown");
      if(!holder)return;
      const dose=Number(m.querySelector("#dose").value);
      const total=Number(blendFormulation?.vialMg)||0;
      if(!Number.isFinite(dose)||dose<=0||!total){holder.textContent="";return;}
      const pieces=(blendFormulation.composition||[]).map(part=>part.compound+": "+(Number(part.mg)/total*dose).toFixed(2)+" mg");
      holder.textContent=pieces.length?"Blend composition · "+pieces.join(" · "):"";
    };
    m.querySelector("#dose").addEventListener("input",refreshBlendBreakdown);
    refreshBlendBreakdown();
  }
  const toggleBtn = m.querySelector("#toggle-multi");
  if (toggleBtn) toggleBtn.onclick = () => { multiMode = !multiMode; if(!multiMode) rows=[]; toggleBtn.textContent = multiMode?"− Use a single vial instead":"+ Use multiple vials"; renderAllocPanel(); };
  renderAllocPanel();

  m.querySelector("#save").onclick = () => {
    const doseAmtStr = m.querySelector("#dose").value;
    if (!doseAmtStr.trim() || !Number.isFinite(Number(doseAmtStr)) || Number(doseAmtStr) <= 0) {
      showErrorBanner("Enter a valid amount greater than zero before confirming. Nothing was saved.");
      return;
    }
    if(isBlend){
      const raw=Number(doseAmtStr),neededMg=doseToMg(raw,c.unit);
      if(!Number.isFinite(neededMg)||neededMg<=0){showErrorBanner("Invalid blend amount.");return;}
      const inputDate=m.querySelector("#date").value,site=m.querySelector("#site").value;
      const notes=m.querySelector("#notes").value,symptoms=f.symptoms;
      const tgt=state.customPeptides[name]||(state.customPeptides[name]={enabled:true,scheduleDays:7,doses:[]});
      tgt.doses=tgt.doses||[];
      if(isEdit){
        if(Math.abs(Number(f.dose)-raw)>.0001){
          showErrorBanner("Changing a saved blend amount requires reconciling its source vial first. The original dose was preserved.");return;
        }
        const old=tgt.doses.find(x=>x.id===f.id);
        if(!old){showErrorBanner("Original blend record not found.");return;}
        Object.assign(old,{date:inputDate,site,notes,symptoms,escalation:m.querySelector("#esc").checked});
        saveState();closeModal();render();return;
      }
      const id=uid(),allocations=[];
      let fromPreparedId;
      if(selectedSource!=="fresh"){
        const pd=(state.preparedDoses||[]).find(p=>String(p.id)===String(selectedSource)&&p.remainingCount>0);
        if(!pd||Math.abs(Number(pd.amountEach)-raw)>.01){showErrorBanner("Prepared dose amount or source does not match.");return;}
        pd.remainingCount--;
        fromPreparedId=pd.id;
        allocations.push(...(pd.allocations||[]).map(a=>({...a})));
      }else{
        const ak=activeKit();
        const plan=rows.length?rows.filter(r=>Number(r.mg)>0):[{kitId:ak?.id,mg:neededMg}];
        const planned=plan.reduce((v,r)=>v+Number(r.mg||0),0);
        if(!plan.length||Math.abs(planned-neededMg)>.01||plan.some(r=>r.finished)){
          showErrorBanner("Confirm the complete amount and sources before saving. No inventory changed.");return;
        }
        const totals=new Map();
        for(const row of plan){
          const kit=blendKits.find(k=>String(k.id)===String(row.kitId));
          const vial=kit&&getActiveVial(kit);
          if(!vial || (row.vialId!=null&&String(row.vialId)!==String(vial.id))){
            showErrorBanner("An allocated blend vial is no longer open. Nothing saved.");return;
          }
          const key=String(kit.id),cur=totals.get(key)||0;
          totals.set(key,cur+Number(row.mg));
        }
        for(const [key,total] of totals){
          const kit=blendKits.find(k=>String(k.id)===key);
          if(total>getBlendOpenVialRemainingMg(kit)+.001){
            showErrorBanner("Insufficient blend inventory in one of the selected open vials.");return;
          }
        }
        const committed=[];
        const tx=uid();
        for(const row of plan){
          const kit=blendKits.find(k=>String(k.id)===String(row.kitId));
          const result=consumeCompoundInventory({kit,amountMg:Number(row.mg),reason:"administered",transactionId:tx});
          if(!result.committed){
            committed.forEach(a=>undoConsumeCompoundInventory(a.kit,{allocations:[{ledgerId:a.ledgerId}]}));
            showErrorBanner("Inventory changed during allocation. The dose was not logged.");return;
          }
          result.allocations.forEach(a=>committed.push({...a,kit}));
        }
        allocations.push(...committed.map(a=>({kitId:a.kitId,vialId:a.vialId,amount:mgToUnit(a.amountMg,c.unit),ledgerId:a.ledgerId})));
      }
      const dose={id,date:inputDate,dose:String(raw),site,notes,symptoms,
        escalation:m.querySelector("#esc").checked,isBlendDose:true,
        blendSource:allocations[0]?.kitId||blendKits[0]?.id,
        allocations,fromPreparedId};
      tgt.doses.push(dose);
      saveState();closeModal();render();return;
    }
    const ak = activeKit();
    // Remember this choice for next time — the whole point of the picker above is that a
    // person doing this daily shouldn't have to re-pick every single time once they've
    // established which vial they're using this stretch.
    if (!isEdit && ak && needsKitPicker) rememberSourceKit(name, ak.id);
    let allocations = isEdit ? (f.allocations ? f.allocations.map(a=>({...a})) : null) : null, fromPreparedId = isEdit ? f.fromPreparedId : null, kitId = isEdit ? f.kitId : (ak?ak.id:null);

    if (isEdit && !fromPreparedId && (f.allocations || f.kitId) && parseFloat(doseAmtStr) !== parseFloat(f.dose)) {
      // Once a vial's remainingMg became a directly-mutated field set at log time, changing
      // dose.dose alone stopped being enough — the vial keeps whatever was deducted
      // originally unless the change is explicitly reconciled. See reapplyEditedDoseInventory.
      const res = reapplyEditedDoseInventory(f, doseAmtStr, c.unit, ak);
      if (!res.ok) { showErrorBanner(res.message); return; }
      allocations = res.allocations;
      kitId = null;
    } else if (!isEdit && selectedSource!=="fresh") {
      fromPreparedId = selectedSource;
      kitId = null;
      const pd = (state.preparedDoses||[]).find(p=>p.id===selectedSource);
      // Administering a prepared dose moves ZERO inventory — the material already left
      // the vial the moment it was prepared. This array is purely descriptive history
      // (which vials it originally came from), never a second deduction.
      allocations = pd ? (pd.allocations||[]).map(a=>({...a})) : [];
      if (pd) pd.remainingCount = Math.max(0, (pd.remainingCount||0)-1);
    } else if (!isEdit && (rows.length || ak)) {
      // Both the multi-vial-panel case and the plain "one kit should cover it" case now
      // go through the same path: actually consume real inventory via
      // consumeCompoundInventory, rather than just tagging kitId/allocations for history
      // while nothing underneath ever moves. Whatever the panel guessed (rows, or
      // nothing at all) is only a STARTING PLAN — the real allocation is whatever
      // consumeCompoundInventory actually draws from each kit's open vial, which is what
      // gets recorded, not the guess.
      const neededMg = doseToMg(doseAmtStr, c.unit);
      const plan = rows.length
        ? rows.filter(r=>(parseFloat(r.mg)||0)>0).map(r=>({kitId:r.kitId, vialId:r.vialId, mg:parseFloat(r.mg)||0, finished:!!r.finished}))
        : [{kitId:ak.id, mg:neededMg}];
      const plannedMg = plan.reduce((a,st)=>a+st.mg,0);
      // Never save a dose larger than its confirmed source allocations.
      // This must happen before changing vial remainingMg or the dose history.
      if (rows.length && plannedMg + 0.01 < neededMg) {
        showErrorBanner(`Only ${mgToUnit(plannedMg,c.unit).toFixed(2)}${c.unit} is allocated, but the entry says ${mgToUnit(neededMg,c.unit).toFixed(2)}${c.unit} — nothing was saved. Add another open vial or correct the amount before confirming.`);
        return;
      }
      if (rows.length && allocationOverdrawsDose(plannedMg, neededMg)) {
        showErrorBanner(`These sources take ${mgToUnit(plannedMg, c.unit)}${c.unit} out of your vial, but this dose is only ${doseAmtStr}${c.unit} — nothing was saved. Change the amount on the source row so it matches the dose. (Recording a loss? Use Log Outflow.)`);
        return;
      }
      const realAllocations = [];
      let shortfall = null;
      for (const step of plan) {
        const k = state.supplies.find(s=>s.id===step.kitId);
        if (!k) { shortfall = { kitName: "?", needed: step.mg, available: 0 }; break; }
        if (step.finished) {
          // Already committed earlier — e.g. Finish Vial's "used in current dose" flow
          // already zeroed this vial directly, or an earlier Draw/Open-New-Vial step in
          // this same in-progress dose already locked it in. Taking it again here would
          // double-deduct against a vial that's already correctly at 0; this step's
          // material has already left inventory, so it only needs to be recorded.
          migrateKitToV2(k);
          realAllocations.push({ kitId:k.id, vialId:step.vialId, amount: mgToUnit(step.mg, c.unit) });
          continue;
        }
        // Pin to the SPECIFIC vial this step already resolved to, if it has one — same
        // reasoning as everywhere else this session: an unpinned lookup falls back to
        // "whatever's open right now," which is only correct when nothing's been pinned.
        migrateKitToV2(k);
        const vial = step.vialId ? ensureKitVials(k).find(v=>v.id===step.vialId) : kitOpenVialV2(k);
        if (!vial) { shortfall = { kitName: k.name, needed: step.mg, available: 0 }; break; }
        const take = Math.min(step.mg, vial.remainingMg);
        vial.remainingMg = Math.round((vial.remainingMg-take)*100)/100;
        if (vial.remainingMg <= 0.01) { vial.remainingMg = 0; vial.status = "empty"; }
        // dose.allocations[].amount is stored in the compound's NATIVE unit everywhere
        // else in this codebase (dose history display, getVialRemainingMg's legacy path,
        // getSyringeComponents) — take/vial.remainingMg are canonical mg internally, so
        // this conversion is required here, not optional, or every mcg-unit compound's
        // allocation amounts come out 1000x wrong the moment anything else reads them.
        realAllocations.push({ kitId:k.id, vialId:vial.id, amount: mgToUnit(take, c.unit) });
        if (take + 0.01 < step.mg) { shortfall = { kitName: k.name, needed: Math.round((step.mg-take)*100)/100, available: 0 }; break; }
      }
      if (shortfall) {
        // Block rather than silently create a partial dose. The currently open vial(s)
        // fell short of what the plan assumed — most often because the plan was built
        // from kit-wide capacity (sealed reserve included) while actual consumption only
        // ever draws from what's physically open. Anything already consumed in this loop
        // before the shortfall was hit gets put back — a save that doesn't fully commit
        // must not leave a half-applied transaction sitting in vial state. Already-
        // finished steps are exempt from refund — that material genuinely already left
        // inventory before this save attempt even began.
        realAllocations.forEach((a,i)=>{
          if (plan[i]?.finished) return;
          const k = state.supplies.find(s=>s.id===a.kitId);
          const v = k ? (k.vials||[]).find(v=>v.id===a.vialId) : null;
          // a.amount is native-unit (see above) — convert back to canonical mg before
          // touching remainingMg, which is always canonical mg.
          if (v) { const wasEmpty=v.status==="empty"; v.remainingMg=Math.round((v.remainingMg+doseToMg(a.amount, c.unit))*100)/100; if(wasEmpty&&v.remainingMg>0.01) v.status="open"; }
        });
        saveState();
        showErrorBanner(`Not enough in the open vial for this dose — ${shortfall.needed.toFixed(2)}${c.unit} short in ${shortfall.kitName}. Open another vial first, then try again.`);
        return;
      }
      allocations = realAllocations; kitId = null;
    }

    const spraysEl = m.querySelector("#sprays");
    const dose = { id: isEdit ? f.id : uid(), date:m.querySelector("#date").value, dose:doseAmtStr, site:m.querySelector("#site").value, symptoms:f.symptoms, notes:m.querySelector("#notes").value, escalation:m.querySelector("#esc").checked, kitId, allocations: allocations||undefined, fromPreparedId: fromPreparedId||undefined, sprayCount: spraysEl ? (parseFloat(spraysEl.value)||undefined) : (isEdit ? f.sprayCount : undefined) };
    const builtin = !!PEPTIDES[name];
    const tgt = builtin ? state.peptides : state.customPeptides;
    if (!tgt[name]) tgt[name] = { enabled:true, scheduleDays:cfg(name).defaultSchedule, doses:[] };
    tgt[name].doses = tgt[name].doses.filter(d=>d.id!==dose.id);
    tgt[name].doses.push(dose);
    const fulfilled = (tgt[name].reschedules||[]).find(r=>!r.doseId && dayKey(r.newDate)===dayKey(dose.date));
    if (fulfilled) fulfilled.doseId = dose.id;
    saveState(); closeModal(); render();
  };
}

// Prepare Doses — moves material from vial(s) into a lightweight "prepared" bucket
// without recording it as administered. Reuses the exact same suggestAllocation() logic
// as split-vial dose logging, so pre-drawing across two vials works identically to
// logging a dose that spans two vials.
// A prepared syringe holding more than one compound. Reuses the same underlying
// inventory primitives as the single-compound flow (getKitRemainingMg, suggestAllocation,
// mgToUnitsForKit) rather than a second parallel system — the only real difference is
// that "one syringe" now maps to N compound components instead of always exactly one.
// Deliberately simpler than the single-compound draw-as-you-go flow: each component gets
// one auto-suggested allocation rather than a full per-vial draw/reconcile sequence — for
// a mixed syringe the more common real need is "let me record what's in this syringe,"
// not a multi-step reconciliation per compound. If a component itself needs a
// split-vial/short-draw correction, prepare it alone first via the single-compound flow,
// then note it here — full draw-as-you-go for every component of a mixed syringe is a
// reasonable future extension, not something this pass builds.
function prepareMixedSyringeModal(draftComponents) {
  let components = draftComponents ? draftComponents.map(c=>({...c})) : [];
  const aps = allPeptides();
  const allCompoundNames = Object.keys(aps).filter(n=>aps[n]?.route!=="Nasal");

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">PREPARE MIXED SYRINGE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:14px">One physical syringe, multiple compounds. Nexus records what's actually in it — it does not imply these compounds are safe or intended to be mixed.</div>
    <div id="components-list" style="margin-bottom:12px"></div>
    <button id="add-compound" style="width:100%;padding:11px;border-radius:10px;background:var(--surface-2);border:1px dashed var(--border);color:var(--t2);font-size:13px;font-weight:600;margin-bottom:16px">+ Add Compound</button>
    <button id="save" class="btn-primary" style="background:#A78BFA">Mark Prepared</button>
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;

  function renderList() {
    const list = m.querySelector("#components-list");
    if (!components.length) { list.innerHTML = `<div style="text-align:center;padding:16px 0;color:var(--t5);font-size:12px">No compounds added yet</div>`; m.querySelector("#save").style.opacity=0.5; m.querySelector("#save").disabled=true; return; }
    list.innerHTML = components.map((c,i)=>{
      const cc = cfg(c.compoundName);
      // Revalidate against the CURRENT canonical vial record every time this renders —
      // never silently trust a stored kitId. A component whose allocation references a
      // kit that's no longer that compound's active one (finished, superseded by a later
      // "Open New Vial", etc.) is flagged explicitly rather than quietly re-checked
      // against a source the person can no longer see reflected in Stash.
      const stale = (c.allocations||[]).some(a=>{
        const k = state.supplies.find(s=>s.id===a.kitId);
        return !k || !k.activeKit;
      });
      const kitNames = (c.allocations||[]).map(a=>{ const k=state.supplies.find(s=>s.id===a.kitId); if(!k) return "vial (no longer exists)"; return `Vial${getActiveVial(k)?" "+(getActiveVial(k).sequenceNumber||""):""}`; }).join(", ");
      return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--surface-2)">
        <div style="width:6px;height:6px;border-radius:50%;background:${cc.color};flex-shrink:0"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;color:var(--t1);font-weight:600">${esc(c.compoundName)}</div>
          <div style="font-size:11px;color:${stale?"#F9C87D":"var(--t4)"}">${c.amount}${c.unit||cc.unit} · Source: ${esc(kitNames||"—")}${stale?" ⚠ no longer the active vial":""}</div>
        </div>
        ${stale?`<button class="reselect-comp" data-i="${i}" style="font-size:10px;color:#F9C87D;background:#F9C87D14;border:1px solid #F9C87D33;border-radius:6px;padding:5px 8px;white-space:nowrap">Re-select</button>`:""}
        <button class="remove-comp" data-i="${i}" style="color:var(--t5);font-size:14px;background:transparent;border:none;padding:4px">✕</button>
      </div>`;
    }).join("");
    list.querySelectorAll(".remove-comp").forEach(b=>b.onclick=()=>{ components.splice(+b.dataset.i,1); renderList(); });
    list.querySelectorAll(".reselect-comp").forEach(b=>b.onclick=()=>{
      const i = +b.dataset.i, c = components[i];
      const alloc = suggestAllocation(c.compoundName, c.amount, c.unit);
      if (!alloc) { renderList(); return; } // still nothing available — leave flagged, don't fabricate a source
      components[i] = { ...c, allocations: alloc.map(a=>({kitId:a.kitId, amount:a.amount})) };
      renderList();
    });
    m.querySelector("#save").style.opacity=1; m.querySelector("#save").disabled=false;
  }
  renderList();

  m.querySelector("#add-compound").onclick = () => {
    const am = openModal(`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">ADD COMPOUND</span>
        <button id="x2" style="color:var(--t4);font-size:18px">✕</button>
      </div>
      <label class="field-label">COMPOUND</label>
      <select id="ac-name" class="inp" style="margin-bottom:14px">${allCompoundNames.filter(n=>!components.some(c=>c.compoundName===n)).map(n=>`<option>${esc(n)}</option>`).join("")}</select>
      <label class="field-label">AMOUNT</label>
      <input id="ac-amount" type="number" class="inp" placeholder="e.g. 500" style="margin-bottom:16px">
      <div id="ac-source" style="font-size:11px;color:var(--t4);margin-bottom:16px"></div>
      <button id="ac-save" class="btn-primary" style="background:#A78BFA">Add to Syringe</button>
    `, "#A78BFA");
    am.querySelector("#x2").onclick = closeModal;
    const updateSource = () => {
      const name = am.querySelector("#ac-name").value;
      const amt = am.querySelector("#ac-amount").value;
      const c = cfg(name);
      const src = am.querySelector("#ac-source");
      if (!amt || !name) { src.textContent = ""; return; }
      const alloc = suggestAllocation(name, amt, c.unit);
      src.textContent = alloc ? (alloc.length>1 ? `Source: split across ${alloc.length} vials` : `Source: current vial`) : "⚠ Not enough usable inventory for this compound";
    };
    am.querySelector("#ac-name").onchange = updateSource;
    am.querySelector("#ac-amount").oninput = debounce(updateSource, 400);
    am.querySelector("#ac-save").onclick = () => {
      const name = am.querySelector("#ac-name").value;
      const amt = am.querySelector("#ac-amount").value;
      const c = cfg(name);
      if (!amt || !name) return;
      const alloc = suggestAllocation(name, amt, c.unit);
      if (!alloc) return; // insufficient inventory — already shown inline, don't silently add
      components.push({ compoundName:name, amount:amt, unit:c.unit, allocations: alloc.map(a=>({kitId:a.kitId, amount:a.amount})) });
      closeModal();
      prepareMixedSyringeModal(components); // reopen the syringe modal with the new component included
    };
  };

  m.querySelector("#save").onclick = () => {
    if (!components.length) return;
    // Never let this be a silent no-op — if a component's inventory situation changed
    // since it was added (another action drew from the same kit, a vial was finished,
    // etc.), say exactly what's wrong instead of the button just doing nothing.
    //
    // Checks the SPECIFIC ACTIVE VIAL the allocation actually sources from (via
    // getVialRemainingMg), not the whole kit's combined total (getKitRemainingMg sums
    // every vial including sealed, undrawable backups — comparing against that overstates
    // what's actually available right now). And always converts the canonical-mg result
    // into the compound's own native unit before comparing or displaying — this exact gap
    // (a raw mg number compared directly against a native-unit request, and displayed with
    // the wrong unit label) is what produced a confusing, backwards "not enough" error.
    const problems = [];
    for (const comp of components) for (const a of (comp.allocations||[])) {
      const k = state.supplies.find(s=>s.id===a.kitId);
      const cUnit = cfg(comp.compoundName).unit;
      if (!k) { problems.push({compound:comp.compoundName, kind:"missing", text:`${comp.compoundName}: its source vial no longer exists — remove and re-add it.`}); continue; }
      if (!k.activeKit) { problems.push({compound:comp.compoundName, kind:"stale", text:`${comp.compoundName}: its source vial is no longer the active one for this compound.`}); continue; }
      const activeVial = getActiveVial(k);
      const vialRemainingNative = activeVial ? mgToUnit(getVialRemainingMg(k, activeVial), cUnit) : mgToUnit(getKitRemainingMg(k), cUnit);
      if (a.amount > vialRemainingNative+0.01) problems.push({compound:comp.compoundName, kind:"insufficient", text:`${comp.compoundName}: needs ${a.amount}${cUnit}, but its current source has ${vialRemainingNative.toFixed(2)}${cUnit} left.`});
    }
    if (problems.length) {
      const em = openModal(`
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <span class="mono" style="font-size:13px;color:#ff7c7c;letter-spacing:1.5px">CAN'T PREPARE YET</span>
          <button id="x2" style="color:var(--t4);font-size:18px">✕</button>
        </div>
        <ul style="margin:0 0 16px 18px;padding:0;font-size:13px;color:var(--t2);line-height:1.7">${problems.map(p=>`<li>${esc(p.text)}</li>`).join("")}</ul>
        <div class="hint" style="margin-bottom:16px">Selecting another vial will re-source these amounts from wherever inventory is actually available — including splitting across more than one vial if needed.</div>
        <div style="display:flex;gap:8px">
          <button id="cancel2" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px">Cancel</button>
          <button id="reselect2" style="flex:1;padding:11px;border-radius:10px;background:#F9C87D;color:#000;font-weight:700;font-size:13px">Select Another Vial</button>
        </div>
      `, "#ff7c7c");
      em.querySelector("#x2").onclick = closeModal;
      em.querySelector("#cancel2").onclick = closeModal;
      em.querySelector("#reselect2").onclick = () => {
        // Re-source every flagged component fresh — suggestAllocation already supports
        // splitting a single component across multiple vials if one alone can't cover it,
        // the same split-source behavior normal prepared doses use.
        problems.forEach(p=>{
          const idx = components.findIndex(c=>c.compoundName===p.compound);
          if (idx<0) return;
          const comp = components[idx];
          const alloc = suggestAllocation(comp.compoundName, comp.amount, comp.unit);
          if (alloc) components[idx] = { ...comp, allocations: alloc.map(a=>({kitId:a.kitId, amount:a.amount})) };
          // If still nothing available, leave it as-is — renderList()'s staleness check
          // will flag it again with a Re-select action rather than silently proceeding.
        });
        closeModal();
        prepareMixedSyringeModal(components);
      };
      return;
    }
    if (!state.preparedDoses) state.preparedDoses = [];
    // Actually move the inventory here — validation above already confirmed each
    // component's specific vial has enough, but confirming isn't consuming. Previously
    // this just tagged history with the planned allocation and never touched
    // vial.remainingMg at all, which was invisible on a legacy kit (the old history-
    // derived calculation would naturally pick it up) but a silent no-op the instant that
    // kit had been migrated to v2 by any other screen — the same gap already found and
    // fixed everywhere else this session.
    const realComponents = components.map(comp=>{
      const cc = cfg(comp.compoundName);
      const realAllocations = (comp.allocations||[]).map(a=>{
        const k = state.supplies.find(s=>s.id===a.kitId);
        if (!k) return {...a};
        migrateKitToV2(k);
        const vial = getActiveVial(k);
        if (!vial) return {...a};
        const neededMg = doseToMg(a.amount, cc.unit);
        const isV2 = vial.remainingMg !== undefined;
        if (isV2) {
          const take = Math.min(neededMg, vial.remainingMg);
          vial.remainingMg = Math.round((vial.remainingMg-take)*100)/100;
          if (vial.remainingMg <= 0.01) { vial.remainingMg = 0; vial.status = "empty"; }
          return { kitId: k.id, vialId: vial.id, amount: mgToUnit(take, cc.unit) };
        }
        return { kitId: k.id, vialId: vial.id, amount: a.amount };
      });
      return { compoundName:comp.compoundName, amount:comp.amount, unit:comp.unit, allocations: realAllocations };
    });
    const entry = {
      id: uid(), status:"prepared", count:1, remainingCount:1, createdAt: localDatetime(),
      components: realComponents,
    };
    // Mirror legacy single-compound fields when there's exactly one component, so every
    // existing single-compound code path (doseModal's source picker, Stash's "N prepared
    // doses ready" line, etc.) keeps working without having to be rewritten to understand
    // the new shape.
    if (entry.components.length===1) {
      entry.compound = entry.components[0].compoundName;
      entry.amountEach = entry.components[0].amount;
      entry.unit = entry.components[0].unit;
      entry.allocations = entry.components[0].allocations;
    }
    state.preparedDoses.push(entry);
    saveState(); closeModal(); render();
    showUndoToast(`Syringe prepared (${entry.components.length} compound${entry.components.length===1?"":"s"}) · Undo`, () => {
      state.preparedDoses = state.preparedDoses.filter(p=>p.id!==entry.id);
      // Reverse each component's real deduction, not just remove the record — mirrors
      // reverseDoseInventoryEffect's approach for regular doses.
      entry.components.forEach(comp=>{
        const cc = cfg(comp.compoundName);
        (comp.allocations||[]).forEach(a=>{
          const k = state.supplies.find(s=>s.id===a.kitId);
          if (!k) return;
          const v = a.vialId ? (k.vials||[]).find(v=>v.id===a.vialId) : null;
          if (!v || v.remainingMg===undefined) return;
          const wasEmpty = v.status==="empty";
          v.remainingMg = Math.round((v.remainingMg + doseToMg(a.amount, cc.unit))*100)/100;
          if (wasEmpty && v.remainingMg>0.01) v.status = "open";
        });
      });
      saveState(); render();
    });
  };
}

// Administers a prepared syringe — ONE administration event that fulfills EACH
// component's own scheduled occurrence. Every resulting dose shares the same date/time
// and a syringeId linking them together for history display, but they're genuinely
// separate dose records so each compound's own protocol history, adherence, and Nexus
// Chat answers see it as taken, correctly, on its own timeline.
function administerSyringeModal(pd) {
  const components = getSyringeComponents(pd);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">LOG SYRINGE AS TAKEN</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <label class="field-label">DATE & TIME ADMINISTERED</label>
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <input id="adm-date" type="datetime-local" class="inp" value="${esc(localDatetime())}" style="flex:1">
      <button id="adm-date-now" type="button" style="padding:0 16px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px;font-weight:600;white-space:nowrap">Now</button>
    </div>
    <label class="field-label">INJECTION SITE</label>
    <select id="adm-site" class="inp" style="margin-bottom:16px">${SITES.map(s=>`<option${s===(state._admSite||SITES[0])?" selected":""}>${esc(s)}</option>`).join("")}</select>
    <div style="margin-bottom:16px">
      ${components.map(c=>{ const cc=cfg(c.compoundName); return `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--surface-2)"><div style="width:6px;height:6px;border-radius:50%;background:${cc.color}"></div><span style="font-size:13px;color:var(--t2);flex:1">${esc(c.compoundName)}</span><span style="font-size:12px;color:${cc.color}">${c.amount}${c.unit||cc.unit}</span></div>`; }).join("")}
    </div>
    <div class="hint" style="margin-bottom:16px">Creates one dose record per compound, sharing this exact time and site — each compound's own protocol history and adherence will show it as taken.</div>
    <button id="save" class="btn-primary" style="background:#A78BFA">Confirm Administered</button>
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;
  const admDateNowBtn = m.querySelector("#adm-date-now");
  if (admDateNowBtn) admDateNowBtn.onclick = () => { m.querySelector("#adm-date").value = localDatetime(); };
  m.querySelector("#save").onclick = () => {
    const date = m.querySelector("#adm-date").value;
    const site = m.querySelector("#adm-site").value;
    state._admSite = site;
    const syringeId = pd.id;
    const batchCount = pd.count||1;
    components.forEach(comp => {
      const builtin = !!PEPTIDES[comp.compoundName];
      const tgt = builtin ? state.peptides : state.customPeptides;
      if (!tgt[comp.compoundName]) tgt[comp.compoundName] = { enabled:true, scheduleDays:cfg(comp.compoundName).defaultSchedule, doses:[] };
      // comp.allocations[].amount is the WHOLE BATCH's total, same as everywhere else in
      // this file — but administering ONE syringe from a multi-syringe batch only
      // accounts for ONE syringe's share of it, not the entire batch again. Without this
      // scaling, administering syringe 1 of 2 would record a dose.allocations entry
      // claiming the full batch amount left inventory here, when only half of it did —
      // the rest is still sitting in the still-unadministered syringe(s).
      const perSyringeAllocations = (comp.allocations||[]).map(a=>({...a, amount: Math.round((a.amount/batchCount)*100)/100}));
      const dose = { id: uid(), date, dose: comp.amount, site, symptoms:[], notes:"", escalation:false, kitId:null, allocations: perSyringeAllocations, fromPreparedId: pd.id, syringeId };
      tgt[comp.compoundName].doses.push(dose);
      const fulfilled = (tgt[comp.compoundName].reschedules||[]).find(r=>!r.doseId && dayKey(r.newDate)===dayKey(date));
      if (fulfilled) fulfilled.doseId = dose.id;
    });
    // Administering one syringe uses up exactly one from the batch — not the whole
    // thing. This previously forced remainingCount straight to 0 regardless of how many
    // syringes the batch actually had, which silently discarded the rest of a
    // multi-syringe prepared batch (e.g. 2 of 2) the instant the first one was logged.
    pd.remainingCount = Math.max(0, (pd.remainingCount||0) - 1);
    if (pd.remainingCount === 0) pd.status = "administered";
    pd.administeredAt = date;
    saveState(); closeModal(); render();
  };
}

function syringeDetailModal(syringeId) {
  const pd = (state.preparedDoses||[]).find(p=>String(p.id)===String(syringeId));
  if (!pd) return;
  const components = getSyringeComponents(pd);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">MIXED SYRINGE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${components.map(c=>{
      const cc=cfg(c.compoundName);
      const srcNames = (c.allocations||[]).map(a=>{ const k=state.supplies.find(s=>s.id===a.kitId); const v=k?ensureKitVials(k).find(vv=>vv.id===a.vialId):null; return v?`Vial ${v.sequenceNumber||"?"}`:(k?k.name:"vial"); }).join(", ");
      return `<div style="padding:10px 0;border-bottom:1px solid var(--surface-2)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px"><div style="width:6px;height:6px;border-radius:50%;background:${cc.color}"></div><span style="font-size:13px;color:var(--t1);font-weight:600">${esc(c.compoundName)}</span></div>
        <div style="font-size:12px;color:${cc.color};margin-left:14px">${c.amount}${c.unit||cc.unit}</div>
        <div style="font-size:11px;color:var(--t4);margin-left:14px">Source: ${esc(srcNames||"—")}</div>
      </div>`;
    }).join("")}
    <div style="margin-top:12px;font-size:11px;color:var(--t4)">
      Prepared: ${fmtDT(pd.createdAt)}${pd.administeredAt?`<br>Administered: ${fmtDT(pd.administeredAt)}`:""}
    </div>
    ${(pd.remainingCount||0)>0?`<button id="del-syringe" style="width:100%;margin-top:16px;padding:11px;border-radius:10px;background:#ff7c7c0d;border:1px solid #ff7c7c33;color:#ff7c7c;font-size:13px;font-weight:600">Delete Prepared Syringe</button>`:""}
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;
  const delBtn = m.querySelector("#del-syringe");
  if (delBtn) delBtn.onclick = () => { closeModal(); deletePreparedDoseModal(pd); };
}

function prepareDosesModal(name) {
  const c = cfg(name);
  const lastDose = [...(allPeptides()[name]?.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  const draft = state._pendingPrepareDraft && state._pendingPrepareDraft.name===name ? state._pendingPrepareDraft : null;
  let count = draft?.count || 1, amountEach = draft?.amountEach || lastDose?.dose || "";
  let rows = draft?.rows ? draft.rows.map(r=>({...r})) : [];
  state._pendingPrepareDraft = null;

  const activeKit = () => state.supplies.find(s=>s.name===name && s.activeKit);
  const otherKitsWithStock = () => state.supplies.filter(s=>s.name===name && getKitRemainingMg(s)>0.001);

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">PREPARE DOSE — ${esc(name.toUpperCase())}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:14px">This moves material out of your vial(s) into a prepared syringe — it does NOT log an administered dose. Draw now, administer whenever you actually take it.</div>
    <label class="field-label">HOW MANY SYRINGES (identical amount each)</label>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
      <button id="pd-dec" style="width:34px;height:34px;border-radius:9px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:16px">−</button>
      <span id="pd-count" class="mono" style="font-size:18px;font-weight:700;color:${c.color};min-width:20px;text-align:center">${count}</span>
      <button id="pd-inc" style="width:34px;height:34px;border-radius:9px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:16px">+</button>
    </div>
    <label class="field-label">TARGET AMOUNT EACH (${c.unit})</label>
    <input id="pd-amt" type="number" class="inp" value="${esc(amountEach)}" style="margin-bottom:10px">
    <div id="alloc-panel" style="margin-bottom:14px"></div>
    <button id="pd-save" class="btn-primary" style="background:${c.color}">Mark Prepared</button>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#pd-dec").onclick = () => { if(count>1){count--; m.querySelector("#pd-count").textContent=count; if(count>1) rows=[]; renderAllocPanel();} };
  m.querySelector("#pd-inc").onclick = () => { count++; m.querySelector("#pd-count").textContent=count; rows=[]; renderAllocPanel(); };
  // Stable debounced reference — must persist across calls so the debounce timer works
  // correctly (a fresh debounce() wrapper on every keystroke would never actually delay
  // anything). Declared before renderAllocPanel's body runs, but after its declaration —
  // safe, since the function isn't invoked until after this line executes.
  const debouncedRenderAllocPanel = debounce(renderAllocPanel, 500);
  m.querySelector("#pd-amt").oninput = debouncedRenderAllocPanel;

  // Whether the detailed, manually-editable source breakdown is showing. Defaults closed —
  // normal use never needs it; it's the audit/exception view for when the computed amounts
  // need manual correction, per "detailed source breakdown can stay expandable."
  let showDetails = false;
  function renderAllocPanel() {
    const panel = m.querySelector("#alloc-panel");
    const amt = m.querySelector("#pd-amt")?.value || amountEach;
    const totalMg = doseToMg(amt, c.unit) * count;
    const saveBtn = m.querySelector("#pd-save");

    if (count>1) {
      const alloc = suggestAllocation(name, totalMg, "mg");
      panel.innerHTML = `<div style="font-size:11px;color:var(--t4)">Total: ${count} × ${amt||0}${c.unit} = ${totalMg}${c.unit}</div>
        <div style="font-size:11px;color:var(--t4);margin-top:4px">${alloc ? (alloc.length>1?`Source: split across ${alloc.length} vials`:`Source: current vial`) : `<span style="color:#FF7C7C">Not enough usable inventory across your kits for this compound.</span>`}</div>`;
      saveBtn.disabled = !alloc; saveBtn.style.opacity = alloc?1:0.5;
      rows = alloc ? alloc.map(a=>({kitId:a.kitId, mg:a.amount})) : [];
      return;
    }

    const ak = activeKit();
    const akRemaining = ak ? getKitRemainingMg(ak) : 0;
    const shortBy = totalMg - akRemaining;
    const akVial = ak ? getActiveVial(ak) : null;
    const vialCap = akVial ? getVialRemainingMg(ak, akVial) : 0;
    if (!rows.length && totalMg>0) {
      // Scoped to the OPEN VIAL specifically, not the kit's total (sealed backups included).
      // suggestAllocation sums a kit's sealed reserve together with its active vial as if all
      // of it were instantly drawable in one go — which is exactly what previously made the
      // very first row lie about how much was actually in the open vial. What's physically
      // in the open vial right now is the only thing that can be allocated without an
      // explicit reconstitution step, so that's what the first row must reflect.
      if (akVial && vialCap > 0.001) {
        const take = Math.round(Math.min(totalMg, vialCap)*100)/100;
        rows = [{kitId:ak.id, vialId:akVial.id, mg:take}];
      } else if (ak) rows = [{kitId:ak.id, mg:0}];
    } else if (rows.length===1 && !rows[0].finished && rows[0].vialId===akVial?.id && totalMg>0) {
      // The modal renders once immediately when it opens, using whatever amount was
      // pre-filled (defaults to the compound's last logged dose) — before the person has
      // typed anything. That first render locks row 0 in at that stale amount, and since
      // the population guard above only fires when rows is completely empty, changing the
      // target amount afterward never re-derived it — the row stayed frozen at the
      // original default while only the "still needed" shortfall math kept moving,
      // silently under-using a vial that actually had plenty left. A single, not-yet-
      // finished row still pinned to the currently active vial always tracks the live
      // target amount — only a row that's actually been drawn/locked (finished) or is
      // part of a completed rollover is left alone.
      rows[0].mg = Math.round(Math.min(totalMg, vialCap)*100)/100;
    }
    const totalAllocated = rows.reduce((a,r)=>a+(parseFloat(r.mg)||0),0);
    const remaining = Math.round((totalMg-totalAllocated)*100)/100;
    const totalCapacity = state.supplies.filter(s=>s.name===name).reduce((a,s)=>a+getKitRemainingMg(s),0) + totalAllocated;
    // A kit is only "spoken for" by an existing UNRESOLVED row (no vialId yet — still
    // drawing from whatever's currently active). A row that's already locked to a specific
    // finished vial (vialId + finished) does NOT block that same kit from being offered
    // again once a fresh vial has been opened in it — kits can hold several physical
    // vials, and each locked row is pinned to the one vial it actually drew from, not to
    // the kit as a whole. This is what lets a second, independent source row appear for
    // Vial B after Vial A is finished, instead of Vial B silently taking over Vial A's row.
    const kitHasUnresolvedRow = (kitId) => rows.some(r=>r.kitId===kitId && !r.vialId);

    // ── Simple summary (the default view) ──────────────────────────────────────
    // What each row actually means in plain terms: which vial, how much, and whether
    // taking that amount finishes the vial — computed the same way the engine itself
    // decides to auto-finish a vial (draining it to ~0), so the summary never says
    // something different from what actually happens on Mark Prepared / Open Next Vial.
    const sourceLines = rows.map(r=>{
      const kit = state.supplies.find(s=>s.id===r.kitId);
      const rvial = kit ? (r.vialId ? ensureKitVials(kit).find(v=>v.id===r.vialId) : getActiveVial(kit)) : null;
      const label = rvial ? `Vial${rvial.sequenceNumber?" "+rvial.sequenceNumber:""}` : "vial";
      const willFinish = !!r.finished || (kit && rvial && (getVialRemainingMg(kit, rvial) - (parseFloat(r.mg)||0)) <= 0.01);
      return { label, mg: parseFloat(r.mg)||0, finished: !!r.finished, willFinish };
    });
    // rows[].mg, totalMg, totalAllocated, remaining, akRemaining, shortBy, totalCapacity
    // are all canonical mg internally (that's what every comparison against
    // vial.remainingMg needs) — but every number actually shown to a person must be in
    // the compound's own native unit, or it's off by 1000x for any mcg compound. fmt()
    // is the one place that conversion happens, so nothing downstream in this render
    // accidentally displays a raw canonical-mg number again.
    const fmt = (mg) => mgToUnit(mg, c.unit).toFixed(2);
    const kitOutOfSealed = !ak || getSealedVials(ak).length===0;
    const stuckShort = remaining>0.01 && kitOutOfSealed && !kitHasUnresolvedRow(ak?.id);

    let simpleHtml = `<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:12px 14px">`;
    if (rows.length<=1 && remaining<=0.01) {
      const s = sourceLines[0];
      simpleHtml += `<div style="font-size:13px;color:var(--t2)">Using ${esc(s?s.label:"current vial")} — <b style="color:${c.color}">${fmt(s?s.mg:0)}${c.unit}</b></div>`;
      if (s?.willFinish) simpleHtml += `<div style="font-size:11px;color:#F9C87D;margin-top:5px">This vial will be finished.</div>`;
    } else {
      simpleHtml += sourceLines.map(s=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:13px;color:${s.finished?"#7DF9C0":"var(--t2)"}">
        <span>${s.finished?"✓ ":""}${esc(s.label)}${(s.willFinish&&!s.finished)?" — will finish":""}</span>
        <span>${fmt(s.mg)}${c.unit}</span>
      </div>`).join("");
      simpleHtml += remaining>0.01
        ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-sub);font-size:12px;color:#F9C87D">${fmt(remaining)}${c.unit} still needed${stuckShort?"":" — next vial required"}</div>`
        : `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-sub);font-size:12px;color:#7DF9C0">✓ ${fmt(totalAllocated)}${c.unit} / ${fmt(totalMg)}${c.unit} ready</div>`;
    }
    if (stuckShort) {
      const otherKits = otherKitsWithStock().filter(k=>!ak || k.id!==ak.id);
      simpleHtml += `<div style="margin-top:10px;padding-top:10px;border-top:1px solid #FF7C7C33">
        <div style="font-size:12px;font-weight:600;color:#FF7C7C;margin-bottom:2px">Not enough inventory in this kit</div>
        <div style="font-size:11px;color:var(--t4);margin-bottom:10px">Need ${fmt(totalMg)}${c.unit} · Available ${fmt(totalAllocated)}${c.unit} · Short ${fmt(remaining)}${c.unit}</div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${otherKits.length?`<button id="palloc-use-other-kit" style="padding:9px;border-radius:8px;background:var(--surface-3);border:1px solid var(--border);color:var(--t2);font-size:12px">Use another kit</button>`:""}
          <button id="palloc-add-inventory" style="padding:9px;border-radius:8px;background:var(--surface-3);border:1px solid var(--border);color:var(--t2);font-size:12px">Add inventory</button>
          <button id="palloc-change-amount" style="padding:9px;border-radius:8px;background:transparent;border:1px solid var(--border-sub);color:var(--t4);font-size:12px">Change amount</button>
        </div>
      </div>`;
    } else if (remaining>0.01) {
      simpleHtml += `<button id="palloc-open-new-simple" style="width:100%;margin-top:10px;padding:10px;border-radius:9px;background:${c.color}18;border:1px solid ${c.color}44;color:${c.color};font-size:12px;font-weight:600">🧪 Open Next Vial</button>`;
    }
    simpleHtml += `</div>
      <button id="palloc-toggle-details" style="width:100%;margin-top:6px;padding:6px;background:transparent;border:none;color:var(--t5);font-size:11px;text-align:center">${showDetails?"▾ Hide":"▸ View"} source details</button>`;

    panel.innerHTML = simpleHtml + (showDetails ? `<div id="alloc-detailed">` : `<div id="alloc-detailed" style="display:none">`) + `
      <div style="background:${shortBy>0.001?"#F9C87D11":"var(--surface-2)"};border:1px solid ${shortBy>0.001?"#F9C87D33":"var(--border-sub)"};border-radius:10px;padding:12px 14px;margin-top:8px">
        ${shortBy>0.001?`<div style="font-size:12px;font-weight:600;color:#F9C87D;margin-bottom:2px">Not enough in current vial</div>
        <div style="font-size:11px;color:var(--t4);margin-bottom:10px">Target: ${fmt(totalMg)}${c.unit} · Current vial: ${fmt(akRemaining)}${c.unit} · Remaining needed: ${fmt(shortBy)}${c.unit}</div>`
        : `<div style="font-size:11px;color:var(--t4);margin-bottom:10px">Sources for this syringe</div>`}
        <div id="alloc-rows">
          ${rows.map((r,i)=>{
            const kit = state.supplies.find(s=>s.id===r.kitId);
            const units = kit ? mgToUnitsForKit(parseFloat(r.mg)||0, kit) : null;
            // Finished-ness is a property of the SPECIFIC VIAL this row drew from (set once,
            // permanently, the moment drawFromVialModal confirmed it) — never re-derived from
            // the kit's current activeKit flag, which flips independently as other vials in
            // the same kit get opened/activated later and would otherwise make an already-
            // finished row look "current" again.
            const kitFinished = !!r.finished;
            // Label reflects the SPECIFIC vial this row is pinned to (once pinned), not just
            // "is this kit currently active" — a pinned-but-not-yet-drawn row for an older
            // vial must read as that vial, not as "Current vial," once a newer vial has taken
            // over as the kit's active one.
            const rvial = kit ? (r.vialId ? ensureKitVials(kit).find(v=>v.id===r.vialId) : getActiveVial(kit)) : null;
            const isTrulyCurrent = kit && kit.activeKit && rvial && getActiveVial(kit)?.id===rvial.id;
            const kitLabel = kit ? (kitFinished?"Finished vial": isTrulyCurrent?"Current vial": rvial?`Vial${rvial.sequenceNumber?" "+rvial.sequenceNumber:""}`:(kit.reconDate?"Open vial":"Vial")) : "Vial";
            const kitHasStock = kit && !kitFinished && rvial && getVialRemainingMg(kit, rvial)>0.001;
            return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:11px;color:${kitFinished?"var(--t5)":"var(--t3)"};flex:1;min-width:0">${esc(kitLabel)}${kitFinished?" ✓":""}</span>
              <input type="number" step="0.01" class="alloc-mg-input inp" data-i="${i}" value="${mgToUnit(parseFloat(r.mg)||0, c.unit)}" ${kitFinished?"disabled":""} style="width:78px;height:32px;padding:0 8px;font-size:12px;${kitFinished?"opacity:0.6":""}">
              <span style="font-size:10px;color:var(--t5);width:34px">${c.unit}</span>
              ${units!=null?`<span style="font-size:10px;color:var(--t5);min-width:50px">${units.toFixed(1)}u</span>`:`<span style="width:50px"></span>`}
              ${kitHasStock?`<button class="palloc-draw" data-i="${i}" title="Confirm what you actually drew from this vial" style="font-size:9px;color:#F9C87D;background:#F9C87D14;border:1px solid #F9C87D33;border-radius:5px;padding:4px 6px;white-space:nowrap">Actual amount different?</button>`:""}
              <button class="palloc-remove" data-i="${i}" style="color:var(--t5);font-size:13px;background:transparent;border:none;padding:2px 4px">✕</button>
            </div>`;
          }).join("")}
        </div>
        <div style="font-size:9px;color:var(--t5);margin-bottom:6px">Amounts are computed automatically. Only use this if what you actually drew differs from what's shown.</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-sub)">
          <span style="font-size:11px;color:var(--t4)">Total: <b style="color:${Math.abs(remaining)<0.01?"#7DF9C0":"var(--t2)"}">${fmt(totalAllocated)}${c.unit}</b> / ${fmt(totalMg)}${c.unit}</span>
          ${Math.abs(remaining)<0.01?`<span style="font-size:11px;color:#7DF9C0">✓ Matches target</span>`:remaining>0?`<span style="font-size:11px;color:#F9C87D">${fmt(remaining)}${c.unit} still needed</span>`:`<span style="font-size:11px;color:#FF7C7C">${fmt(Math.abs(remaining))}${c.unit} over</span>`}
        </div>
        ${remaining>0.01 ? (
          otherKitsWithStock().filter(k=>!kitHasUnresolvedRow(k.id)).length
            ? `<button id="palloc-add-kit" style="width:100%;margin-top:10px;padding:9px;border-radius:8px;background:var(--surface-3);border:1px solid var(--border);color:var(--t2);font-size:12px">+ Add another vial</button>`
            : (totalCapacity + 0.01 < totalMg
                ? `<div style="margin-top:10px;font-size:11px;color:#FF7C7C">Only ${fmt(totalCapacity)}${c.unit} total usable inventory exists for ${esc(name)} — open a new vial to cover the remaining ${fmt(totalMg-totalCapacity)}${c.unit}.</div>`
                : "")
        ) : ""}
        <button id="palloc-open-new" style="width:100%;margin-top:8px;padding:10px;border-radius:9px;background:${c.color}18;border:1px solid ${c.color}44;color:${c.color};font-size:12px;font-weight:600">🧪 Open New Vial</button>
      </div></div>`;
    saveBtn.disabled = Math.abs(remaining)>0.01; saveBtn.style.opacity = Math.abs(remaining)>0.01?0.5:1;

    panel.querySelector("#palloc-toggle-details").onclick = () => { showDetails = !showDetails; renderAllocPanel(); };
    if (stuckShort) {
      panel.querySelector("#palloc-use-other-kit")?.addEventListener("click", () => { showDetails = true; renderAllocPanel(); });
      panel.querySelector("#palloc-add-inventory")?.addEventListener("click", () => { closeModal(); supplyModal(null); });
      panel.querySelector("#palloc-change-amount")?.addEventListener("click", () => { m.querySelector("#pd-amt")?.focus(); });
    }
    const openNewSimpleBtn = panel.querySelector("#palloc-open-new-simple");
    if (openNewSimpleBtn) openNewSimpleBtn.onclick = () => panel.querySelector("#palloc-open-new").click();

    panel.querySelectorAll(".alloc-mg-input").forEach(inp=>inp.oninput=()=>{ rows[+inp.dataset.i].mg = doseToMg(inp.value, c.unit); debouncedRenderAllocPanel(); });
    panel.querySelectorAll(".palloc-remove").forEach(b=>b.onclick=()=>{ rows.splice(+b.dataset.i,1); renderAllocPanel(); });
    panel.querySelectorAll(".palloc-draw").forEach(b=>b.onclick=()=>{
      // Resolve against the vial THIS row is actually pinned to (r.vialId) once it has
      // one — only an unpinned row still means "whatever's active in this kit right now."
      // Using getActiveVial() unconditionally here was the same bug as the label issue:
      // after a second vial opens in this kit, it would silently retarget an old row.
      const i = +b.dataset.i, r = rows[i], kit = state.supplies.find(s=>s.id===r.kitId);
      if (!kit) return;
      const vial = r.vialId ? ensureKitVials(kit).find(v=>v.id===r.vialId) : getActiveVial(kit);
      if (!vial) return;
      const target = parseFloat(r.mg)||0;
      state._pendingPrepareDraft = { name, count, amountEach: m.querySelector("#pd-amt").value, rows: rows.map(r2=>({...r2})) };
      closeModal();
      drawFromVialModal(kit, vial, target, (actualMg) => {
        r.mg = actualMg; r.vialId = vial.id; r.finished = !kit.isBlend;
        state._pendingPrepareDraft.rows = rows.map(r2=>({...r2}));
        prepareDosesModal(name);
      }, () => prepareDosesModal(name));
    });
    const addKitBtn = panel.querySelector("#palloc-add-kit");
    if (addKitBtn) addKitBtn.onclick = () => {
      const nextKit = otherKitsWithStock().filter(k=>!kitHasUnresolvedRow(k.id))[0];
      if (nextKit) { const take = Math.min(getKitRemainingMg(nextKit), remaining); rows.push({kitId:nextKit.id, mg:Math.round(take*100)/100}); renderAllocPanel(); }
    };
    const openNewBtn = panel.querySelector("#palloc-open-new");
    if (openNewBtn) openNewBtn.onclick = () => {
      const draftRows = rows.map(r2=>({...r2}));
      // Every not-yet-finished row for the kit we're about to open a new vial in must be
      // settled first — pinned (if it wasn't already) and finished if its amount drains
      // the vial it points to. Rows are now pinned from the moment they're first created
      // (see the initial-population change above), so this can no longer assume "only
      // unresolved rows need handling" — an already-pinned row that hasn't been through
      // Draw yet is just as capable of draining its vial, and must be finished here too,
      // or Vial 1 stays "active" the instant Vial 2 opens and becomes active alongside it.
      draftRows.forEach(r=>{
        if (r.finished) return;
        const k = state.supplies.find(s=>s.id===r.kitId);
        if (!k) return;
        const vial = r.vialId ? ensureKitVials(k).find(v=>v.id===r.vialId) : getActiveVial(k);
        if (!vial) return;
        r.vialId = vial.id;
        // The row's mg can be larger than what THIS vial actually holds — suggestAllocation
        // (which fills the very first row) sums a kit's sealed reserve together with its
        // open vial as if all of it were instantly drawable from the one active vial. Once
        // pinned to a specific vial, the row must be capped to that vial's own real
        // remainder, or the "still needed" math below thinks the target's already covered
        // and never creates a row for the new vial at all.
        const vialCap = getVialRemainingMg(k, vial);
        if ((parseFloat(r.mg)||0) > vialCap + 0.001) r.mg = Math.round(vialCap*100)/100;
        // If this draw uses up everything the vial has, finish it right here — same
        // lifecycle rule as tapping Draw and getting an exact/emptying match. Without
        // this, Vial 1 stays "active" while Vial 2 also becomes active the moment it's
        // opened, and a kit ends up with two simultaneously open vials even though
        // Vial 1 has nothing left — exactly the bad state being reported.
        if (vialCap - (parseFloat(r.mg)||0) <= 0.01) { finishVial(k, vial, "used_in_dose"); r.finished = true; }
      });
      state._pendingPrepareDraft = { name, count, amountEach: m.querySelector("#pd-amt").value, rows: draftRows };
      closeModal();
      const sealedKit = state.supplies.find(s=>s.name===name && getSealedVials(s).length>0);
      // A kit qualifies if IT has a sealed vial available — not "has this kit never been
      // opened at all," which is wrong the moment a vial is already active (this exact
      // kit still has sealed backups sitting in it, they just aren't the current one).
      if (sealedKit) {
        reconstituteVialModal(sealedKit, (newVial) => {
          // The vial that was just reconstituted is now active on sealedKit — append it
          // as a fresh, independent source row rather than letting it silently replace
          // the existing row for this same kit (which, thanks to the pinning above, is
          // now locked to the specific vial it actually referred to). Sized to whatever's
          // still needed, capped by what this new vial actually has.
          //
          // newVial is taken directly from reconstituteVialModal's callback, NOT re-derived
          // via getActiveVial(sealedKit) — the instant this kit has two vials simultaneously
          // marked "active" (old one not yet drawn, new one just opened), getActiveVial's
          // .find() just returns whichever is first in the array, which is the OLD vial, not
          // the one that was actually just created.
          const draft = state._pendingPrepareDraft;
          if (draft) {
            const alreadyRepresented = newVial && draft.rows.some(r=>r.vialId===newVial.id);
            const hasUnresolvedForKit = draft.rows.some(r=>r.kitId===sealedKit.id && !r.vialId);
            if (newVial && !alreadyRepresented && !hasUnresolvedForKit) {
              const alreadyAllocated = draft.rows.reduce((a,r)=>a+(parseFloat(r.mg)||0),0);
              const targetTotal = doseToMg(draft.amountEach, c.unit) * (draft.count||1);
              const stillNeeded = Math.max(0, Math.round((targetTotal-alreadyAllocated)*100)/100);
              const vialRemaining = getVialRemainingMg(sealedKit, newVial);
              const take = Math.round(Math.min(stillNeeded, vialRemaining)*100)/100;
              // Pinned directly with vialId — we already know exactly which vial this is
              // (it's the one we just created), so there's no reason to leave it "unresolved"
              // and let a later Draw tap re-derive it via the same ambiguous getActiveVial()
              // lookup that caused this whole issue.
              if (take>0) draft.rows.push({ kitId: sealedKit.id, vialId: newVial.id, mg: take });
            }
          }
          prepareDosesModal(name);
        });
      }
      else supplyModal(null, name);
    };
  }
  renderAllocPanel();

  m.querySelector("#pd-save").onclick = () => {
    const amt = m.querySelector("#pd-amt").value;
    if (!state.preparedDoses) state.preparedDoses = [];
    // All kits—including premixed blends—use this same Prepare sheet. Blends
    // retain the physical one-vial ledger instead of using direct v2 mutations.
    if(state.supplies.some(k=>k.name===name&&k.isBlend)){
      const amount=Number(amt),required=amount*count;
      if(!Number.isFinite(amount)||amount<=0||!Number.isSafeInteger(count)||count<1){
        showErrorBanner("Enter a valid amount and syringe count.");return;
      }
      const expectedMg=doseToMg(required,c.unit);
      const plan=rows.filter(r=>Number.isFinite(Number(r.mg))&&Number(r.mg)>0);
      const allocated=plan.reduce((sum,r)=>sum+Number(r.mg),0);
      if(!plan.length||Math.abs(allocated-expectedMg)>0.01){
        showErrorBanner("Allocate the full prepared amount to open vial(s) before confirming.");return;
      }
      const tx=uid(),saved=[];
      for(const row of plan){
        const kit=state.supplies.find(k=>String(k.id)===String(row.kitId)&&k.isBlend);
        if(!kit||!getActiveVial(kit)){
          saved.forEach(a=>undoConsumeCompoundInventory(a.kit,{allocations:[{ledgerId:a.ledgerId}]}));
          showErrorBanner("Select a prepared blend vial with sufficient available inventory.");return;
        }
        const result=consumeCompoundInventory({kit,amountMg:Number(row.mg),reason:"prepared",transactionId:tx});
        if(!result.committed){
          saved.forEach(a=>undoConsumeCompoundInventory(a.kit,{allocations:[{ledgerId:a.ledgerId}]}));
          showErrorBanner("Insufficient open-vial stock. No prepared doses were saved.");return;
        }
        for(const al of result.allocations)saved.push({...al,kit});
      }
      const allocations=saved.map(a=>({kitId:a.kitId,vialId:a.vialId,amount:mgToUnit(a.amountMg,c.unit),ledgerId:a.ledgerId}));
      const entry={id:uid(),compound:name,amountEach:amt,unit:c.unit,count,remainingCount:count,allocations,createdAt:localDatetime()};
      state.preparedDoses.push(entry);saveState();closeModal();render();
      showUndoToast(`${count} ${name} doses prepared · Undo`,()=>{
        state.preparedDoses=state.preparedDoses.filter(p=>p.id!==entry.id);
        allocations.forEach(a=>{const kit=state.supplies.find(k=>k.id===a.kitId);if(kit)undoConsumeCompoundInventory(kit,{allocations:[a]});});
        render();
      });
      return;
    }
    if (count>1) {
      if (!rows.length) return;
      // Route through the same canonical consumption function as everything else —
      // rows here are only a kit-level PLAN (from suggestAllocation); what actually gets
      // recorded is whatever consumeCompoundInventory really draws from each kit's open
      // vial, not the guess. Previously this just tagged kitId/amount for history while
      // never touching vial.remainingMg at all — harmless for a kit still on the old
      // history-derived model, but silently wrong the instant that kit has been migrated
      // to v2 by any other screen (Log Dose), since v2 vials no longer re-derive their
      // remaining amount from history.
      const txId = uid();
      const realAllocations = [];
      let shortfall = null;
      for (const step of rows) {
        const k = state.supplies.find(s=>s.id===step.kitId);
        if (!k) { shortfall = true; break; }
        const r = consumeCompoundInventory({ kit:k, amountMg: parseFloat(step.mg)||0, reason:"prepared", transactionId: txId });
        // preparedDose.allocations[].amount follows the same native-unit convention as
        // dose.allocations[].amount — r.allocations[].amountMg is canonical mg internally
        // and must be converted before storage here.
        realAllocations.push(...r.allocations.map(a=>({kitId:a.kitId, vialId:a.vialId, amount: mgToUnit(a.amountMg, c.unit)})));
        if (!r.committed) { shortfall = true; break; }
      }
      if (shortfall) {
        realAllocations.forEach(a=>{
          const k = state.supplies.find(s=>s.id===a.kitId);
          const v = k ? (k.vials||[]).find(v=>v.id===a.vialId) : null;
          if (v) { const wasEmpty=v.status==="empty"; v.remainingMg=Math.round((v.remainingMg+doseToMg(a.amount, c.unit))*100)/100; if(wasEmpty&&v.remainingMg>0.01) v.status="open"; }
        });
        saveState();
        showErrorBanner(`Not enough inventory to prepare all ${count} syringes — nothing was saved.`);
        return;
      }
      const entry = { id:uid(), compound:name, amountEach:amt, unit:c.unit, count, remainingCount:count, allocations:realAllocations, createdAt:localDatetime() };
      state.preparedDoses.push(entry);
      saveState(); closeModal(); render();
      showUndoToast(`${count} ${name} doses prepared · Undo`, () => {
        state.preparedDoses = state.preparedDoses.filter(p=>p.id!==entry.id);
        realAllocations.forEach(a=>{ const k=state.supplies.find(s=>s.id===a.kitId); if(k) undoConsumeCompoundInventory(k, {allocations:[{...a, amountMg: doseToMg(a.amount, c.unit)}]}); });
        render();
      });
      return;
    }
    const totalMg = doseToMg(amt, c.unit);
    const totalAllocated = rows.reduce((a,r)=>a+(parseFloat(r.mg)||0),0);
    if (Math.abs(totalAllocated-totalMg) > 0.02) return; // panel already shows the mismatch
    // Same canonical path for the single-syringe case. Rows already carry vialId from the
    // earlier allocation-panel work, but that only decided WHICH vial and roughly how
    // much — consumeCompoundInventory is what actually moves the number and handles
    // auto-emptying uniformly for both a full drain AND a partial draw (the old
    // finish-only-if-draining logic here never touched remainingMg at all for a partial
    // draw against an already-migrated vial, which is exactly what silently produced a
    // prepared-dose record claiming material that the vial's own number never reflected).
    const realAllocations = [];
    let shortfall = null;
    for (const r of rows) {
      if ((parseFloat(r.mg)||0) <= 0) continue;
      const k = state.supplies.find(s=>s.id===r.kitId);
      if (!k) { shortfall = true; break; }
      migrateKitToV2(k);
      if (r.finished) {
        // Already committed earlier in the interactive flow (Draw, or the auto-finish
        // that happens when "Open Next Vial" is tapped on a row that would drain its
        // vial) — that vial's remainingMg was already brought to 0 at that moment. Taking
        // this amount AGAIN here would double-deduct against a vial that's correctly
        // already empty; this row's material already left inventory, so it only needs to
        // be recorded on the prepared-dose record, not consumed a second time.
        // dose/preparedDose allocations[].amount is always native-unit — r.mg here is
        // canonical mg (matches vial.remainingMg's own scale throughout this session's
        // work), so it must be converted before it's stored where display code and the
        // legacy history-derivation both expect native units.
        realAllocations.push({ kitId:r.kitId, vialId:r.vialId, amount: mgToUnit(parseFloat(r.mg)||0, c.unit) });
        continue;
      }
      // Pin consumption to the SPECIFIC vial this row already resolved to, not whichever
      // vial happens to be open right now — same reasoning as everywhere else this
      // session: an unpinned lookup is ambiguous the moment more than one vial exists.
      const vial = r.vialId ? ensureKitVials(k).find(v=>v.id===r.vialId) : kitOpenVialV2(k);
      if (!vial) { shortfall = true; break; }
      const need = parseFloat(r.mg)||0;
      const take = Math.min(need, vial.remainingMg);
      vial.remainingMg = Math.round((vial.remainingMg-take)*100)/100;
      if (vial.remainingMg <= 0.01) { vial.remainingMg = 0; vial.status = "empty"; }
      realAllocations.push({ kitId:k.id, vialId:vial.id, amount: mgToUnit(take, c.unit) });
      if (take + 0.01 < need) { shortfall = true; break; }
    }
    if (shortfall) {
      realAllocations.forEach(a=>{
        const k = state.supplies.find(s=>s.id===a.kitId);
        const v = k ? (k.vials||[]).find(v=>v.id===a.vialId) : null;
        if (v) { const wasEmpty=v.status==="empty"; v.remainingMg=Math.round((v.remainingMg+doseToMg(a.amount, c.unit))*100)/100; if(wasEmpty&&v.remainingMg>0.01) v.status="open"; }
      });
      saveState();
      showErrorBanner(`Not enough in the source vial(s) to prepare this dose — nothing was saved.`);
      return;
    }
    const entry = { id:uid(), compound:name, amountEach:amt, unit:c.unit, count:1, remainingCount:1, allocations:realAllocations, createdAt:localDatetime() };
    state.preparedDoses.push(entry);
    saveState(); closeModal(); render();
    showUndoToast(`${name} syringe prepared${realAllocations.length>1?` (${realAllocations.length} vials)`:""} · Undo`, () => {
      state.preparedDoses = state.preparedDoses.filter(p=>p.id!==entry.id);
      realAllocations.forEach(a=>{ const k=state.supplies.find(s=>s.id===a.kitId); if(k) undoConsumeCompoundInventory(k, {allocations:[{...a, amountMg: doseToMg(a.amount, c.unit)}]}); });
      render();
    });
  };
}

// Reconstitute Vial — an explicit action independent of dose logging, so a vial can be
// marked "reconstituted / in use" days before its first dose is ever administered. Reuses
// the existing kit edit form's fields rather than building a second reconstitution UI.
function reconstituteVialModal(kit, onDone) {
  if(kit.isBlend)return openNewVialModal(kit.id,onDone);
  const c = cfg(kit.name);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">RECONSTITUTE — ${esc(kit.name.toUpperCase())}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${onDone?`<div class="hint" style="margin-bottom:14px">Your in-progress ${esc(kit.name)} dose is saved — you'll come right back to it after this.</div>`:""}
    <label class="field-label">RECONSTITUTION DATE & TIME</label>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <input id="rc-date" type="datetime-local" class="inp" value="${esc(localDatetime())}" style="flex:1">
      <button id="rc-date-now" type="button" style="padding:0 16px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px;font-weight:600;white-space:nowrap">Now</button>
    </div>
    <label class="field-label">BAC WATER ADDED (mL)</label>
    <input id="rc-bac" type="number" step="0.1" class="inp" value="${esc(kit.bacMl||"")}" style="margin-bottom:14px">
    <div id="rc-conc" style="font-size:11px;color:var(--t4);margin-bottom:16px"></div>
    <label class="field-label">NOTES <span style="color:var(--t5);font-weight:400">(optional)</span></label>
    <textarea id="rc-notes" class="inp" style="min-height:44px;resize:vertical;margin-bottom:16px"></textarea>
    <button id="rc-save" class="btn-primary" style="background:${c.color}">Confirm Reconstitution</button>
  `, c.color);
  m.querySelector("#x").onclick = () => { if(onDone) state._pendingDoseDraft=null; closeModal(); };
  const updateConc = () => { const bac=parseFloat(m.querySelector("#rc-bac").value)||0; const conc = bac>0 ? (kit.vialMg/bac).toFixed(2) : "—"; m.querySelector("#rc-conc").textContent = `Concentration: ${conc} ${c.unit}/mL`; };
  updateConc();
  m.querySelector("#rc-bac").oninput = updateConc;
  const rcDateNowBtn = m.querySelector("#rc-date-now");
  if (rcDateNowBtn) rcDateNowBtn.onclick = () => { m.querySelector("#rc-date").value = localDatetime(); };
  m.querySelector("#rc-save").onclick = () => {
    confirmOpenIfOtherKitOpen(kit, () => {
      const prevVials = JSON.parse(JSON.stringify(ensureKitVials(kit)));
      const prevAgg = { reconDate:kit.reconDate, activeKit:kit.activeKit, bacMl:kit.bacMl, openedVials:kit.openedVials, totalVials:kit.totalVials };
      const newVial = activateVial(kit, m.querySelector("#rc-date").value, parseFloat(m.querySelector("#rc-bac").value)||kit.bacMl, m.querySelector("#rc-notes").value);
      saveState(); closeModal(); render();
      // Pass the exact vial that was just created through to onDone. getActiveVial(kit)
      // is ambiguous the instant a kit has more than one vial with status "active" at once
      // (the old one not yet drawn, the new one just opened) — it just returns whichever
      // is first in the array, which silently resolves to the WRONG (old) vial. Callers
      // that need to know specifically what was just opened must use this, not re-derive it.
      if (onDone) { onDone(newVial); return; } // resumes the in-progress dose — no undo toast here, the draft itself is the safety net
      showUndoToast(`${kit.name} vial reconstituted · Undo`, () => {
        kit.vials = prevVials; Object.assign(kit, prevAgg);
        saveState(); render();
      });
    });
  };
}
// exact same smart defaults as the full modal (last dose amount, rotation-suggested
// site, current time or a specific occurrence's time), with zero taps beyond confirming.
// Falls back to the full modal when there's not enough history to derive a dose amount
// safely, or when multiple occurrences are still pending and none was specified — Quick
// Log must never guess which of several same-day doses it's logging.
function quickLogDose(name, occTime) {
  // Quick Log's legacy direct inventory mutation is not blend-ledger aware.
  // Always use the canonical form/confirmation for premixed preparations.
  if((state.supplies||[]).some(k=>k.name===name&&k.isBlend))return doseModal(name,null,occTime);
  const cData = allPeptides()[name] || {};
  const doseHistory = [...(cData.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (!occTime && cData.dosesPerDay>1) {
    const pending = getDayOccurrenceSummary(cData, localDate()).pending;
    if (pending.length>1) { doseModal(name); return; } // ambiguous — which occurrence? Don't guess.
    if (pending.length===1) occTime = pending[0].dateTime;
  }
  const occIndex = occTime ? getOccurrenceTimes(cData).indexOf(timeKeyOf(occTime+":00")) : -1;
  const occAmt = occIndex>=0 ? occurrenceDoseAmount(cData, occIndex) : null;
  const lastDoseAmt = occAmt || doseHistory[0]?.dose || "";
  if (!lastDoseAmt) { doseModal(name, null, occTime); return; } // nothing to derive a dose from yet — don't invent one
  const recent = doseHistory.slice(0,3).map(d=>d.site).filter(Boolean);
  const suggestedSite = (() => {
    if (!recent.length) return SITES[0];
    const idx = SITES.indexOf(recent[0]);
    for (let i=1;i<=SITES.length;i++){ const s=SITES[(idx+i)%SITES.length]; if(!recent.includes(s)) return s; }
    return SITES[0];
  })();
  // Multiple kits can now be simultaneously eligible for the same compound (e.g. a 10mg
  // and a 30mg vial both open). Quick Log's whole premise is "don't make the person
  // answer anything" — so it only proceeds silently once there's an established
  // preference for this compound; the first time it's genuinely ambiguous, this defers to
  // the full modal (which has the picker) rather than guessing, same principle as the
  // existing "which of several same-day occurrences" guard above.
  const eligible = getEligibleSourceKits(name);
  let activeKit;
  if (eligible.length > 1) {
    const remembered = state.lastSourceKit?.[name];
    const rememberedMatch = remembered!=null ? eligible.find(x=>x.kit.id===remembered) : null;
    if (!rememberedMatch) { doseModal(name, null, occTime); return; }
    activeKit = rememberedMatch.kit;
  } else {
    activeKit = eligible[0]?.kit || state.supplies.find(s=>s.name===name && s.activeKit);
  }
  // This was the one dose-logging path in the whole app that never went through the
  // canonical inventory engine at all — no consumeCompoundInventory call, no
  // allocations, nothing. Every tap recorded a dose as taken while leaving vial.remainingMg
  // completely untouched, silently inflating what Nexus believed was still available.
  // Found via a real reconciliation audit against live data: a Quick-logged dose left
  // remainingMg unchanged while administeredMg went up, breaking the ledger balance by
  // exactly the dose amount. Now routes through the same engine as every other dose path.
  let allocations = null, kitId = activeKit ? activeKit.id : null;
  if (activeKit) {
    const cc = cfg(name);
    const neededMg = doseToMg(lastDoseAmt, cc.unit);
    migrateKitToV2(activeKit);
    const vial = kitOpenVialV2(activeKit);
    // No open vial at all (needs reconstituting) is treated the same as "not enough" —
    // both need the full flow to resolve properly, not a silent unaccounted quick-log.
    if (!vial || vial.remainingMg + 0.01 < neededMg) { doseModal(name, null, occTime); return; }
    const take = Math.min(neededMg, vial.remainingMg);
    vial.remainingMg = Math.round((vial.remainingMg-take)*100)/100;
    if (vial.remainingMg <= 0.01) { vial.remainingMg = 0; vial.status = "empty"; }
    allocations = [{ kitId: activeKit.id, vialId: vial.id, amount: mgToUnit(take, cc.unit) }];
    kitId = null;
  }
  const dose = { id:uid(), date:occTime||localDatetime(), dose:lastDoseAmt, site:suggestedSite, symptoms:[], notes:"", escalation:false, kitId, allocations: allocations||undefined };
  const builtin = !!PEPTIDES[name];
  const tgt = builtin ? state.peptides : state.customPeptides;
  if (!tgt[name]) tgt[name] = { enabled:true, scheduleDays:cfg(name).defaultSchedule, doses:[] };
  tgt[name].doses.push(dose);
  const fulfilled = (tgt[name].reschedules||[]).find(r=>!r.doseId && dayKey(r.newDate)===dayKey(dose.date));
  if (fulfilled) fulfilled.doseId = dose.id;
  saveState(); render();
  showUndoToast(`${name} logged · ${dose.dose} ${cfg(name).unit}`, () => {
    tgt[name].doses = tgt[name].doses.filter(d=>d.id!==dose.id);
    reverseDoseInventoryEffect(dose);
    if (fulfilled) fulfilled.doseId = null;
    saveState(); render();
  });
}


/* v0.7.4 check-in sheet: move existing action buttons, not clones, so
   previously registered listeners / selectors / data semantics stay intact. */
function nexusConfigureCheckinSheet(modal, actionIds) {
  if(!modal || !modal.classList.contains('nx-structured')) return;
  modal.classList.add('nx-checkin-sheet');
  const body=modal.querySelector(':scope > .nx-unified-body');
  if(!body) return;
  let footer=modal.querySelector(':scope > .nx-unified-footer');
  if(!footer){ footer=document.createElement('div');footer.className='nx-unified-footer';modal.appendChild(footer); }
  actionIds.forEach(id=>{const btn=modal.querySelector('#'+id); if(btn && !footer.contains(btn))footer.appendChild(btn);});
  if(!footer.children.length)footer.remove();
}

// ─── Daily check-in modal ────────────────────────────────────────────────────
function todayLogSheet(log) {
  const mood = MOODS.find(m=>m.v===log.mood);
  const updates = log.updates||[];
  const symList = (syms) => syms.length
    ? `<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">${syms.map(s=>`<span class="pill" style="background:var(--surface-3);color:var(--t3);border:1px solid var(--border);font-size:10px">${esc(typeof s==="string"?s:s.name+(s.intensity>1?" "+"•".repeat(s.intensity):""))}</span>`).join("")}</div>`
    : `<div style="font-size:11px;color:var(--t5);margin-top:4px">No symptoms logged</div>`;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span class="mono" style="font-size:13px;letter-spacing:1.5px">TODAY'S CHECK-IN</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:11px;color:var(--t4);margin-bottom:12px">${new Date().toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}</div>

    <button id="addupdate" class="btn-primary" style="background:#A78BFA;margin-bottom:14px;display:flex;align-items:center;justify-content:center;gap:8px"><span style="font-size:16px">＋</span> Add Symptom Update</button>

    <div style="background:${mood?mood.color+"11":"var(--surface-2)"};border:1px solid ${mood?mood.color+"33":"var(--border)"};border-radius:12px;padding:14px 16px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
        <span style="font-size:26px">${mood?mood.emoji:"—"}</span>
        <div><div style="font-size:14px;font-weight:600;color:${mood?mood.color:"var(--t2)"}">${mood?mood.label:"No mood logged"}</div>
        ${log.compound?`<div style="font-size:10px;color:var(--t4)">re: ${esc(log.compound)}</div>`:""}
        <div style="font-size:10px;color:var(--t4)">Morning / primary check-in</div></div>
      </div>
      ${symList(log.symptoms||[])}
      ${log.notes?`<div style="font-size:11px;color:var(--t3);font-style:italic;margin-top:8px">"${esc(log.notes)}"</div>`:""}
    </div>

    ${updates.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">UPDATES (${updates.length})</div>
    ${updates.map(u=>`<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-sub)">
      <div style="width:2px;align-self:stretch;background:var(--border);border-radius:2px;flex-shrink:0"></div>
      <div style="flex:1"><div style="font-size:11px;color:var(--t4);margin-bottom:5px">${new Date(u.time).toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"})}</div>
        ${symList(u.symptoms||[])}
        ${u.notes?`<div style="font-size:11px;color:var(--t3);font-style:italic;margin-top:6px">"${esc(u.notes)}"</div>`:""}
      </div>
      <button class="edit-update" data-uid="${u.id}" style="color:var(--t4);font-size:11px;border:1px solid var(--border);border-radius:6px;padding:2px 7px;align-self:flex-start;margin-right:4px">✏</button>
      <button class="del-update" data-uid="${u.id}" style="color:var(--t5);font-size:13px;align-self:flex-start">✕</button>
    </div>`).join("")}
    <div style="margin-bottom:14px"></div>`:""}

    <button id="editlog" style="width:100%;padding:12px;border-radius:10px;background:transparent;border:1px solid var(--border);color:var(--t4);font-size:12px">Edit primary check-in</button>
  `, "#A78BFA");
  nexusConfigureCheckinSheet(m, ["addupdate","editlog"]);
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#addupdate").onclick = () => { closeModal(); addUpdateModal(log); };
  m.querySelector("#editlog").onclick  = () => { closeModal(); dailyModal(log); };
  m.querySelectorAll(".edit-update").forEach(b=>b.onclick=()=>{
    const uid2=+b.dataset.uid;
    const entry=state.dailyLogs.find(l=>l.id===log.id);
    const update=entry&&(entry.updates||[]).find(u=>u.id===uid2);
    if(update){ closeModal(); editUpdateModal(log,update); }
  });
  m.querySelectorAll(".del-update").forEach(b=>b.onclick=()=>{
    const uid2=+b.dataset.uid;
    const entry = state.dailyLogs.find(l=>l.id===log.id);
    if(entry){ entry.updates=(entry.updates||[]).filter(u=>u.id!==uid2); saveState(); closeModal(); render(); }
  });
}

function addUpdateModal(log) {
  const now = new Date();
  const timeStr = now.toTimeString().slice(0,5); // HH:MM
  const f = { symptoms:[], notes:"" };
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">ADD SYMPTOM UPDATE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:12px;color:var(--t4);margin-bottom:16px">Adding to today's check-in · captures a specific moment</div>
    <label class="field-label">TIME</label>
    <input id="utime" type="time" class="inp" value="${timeStr}" style="margin-bottom:14px">
    <details class="nx-checkin-symptoms" open><summary><span>Symptoms right now · Optional</span></summary><div id="sym"></div></details>
    <label class="field-label">NOTE</label>
    <textarea id="notes" class="inp" placeholder="e.g. nausea started after dinner, appetite spiked…" style="min-height:50px;resize:vertical;margin-bottom:18px"></textarea>
    <button id="save" class="btn-primary" style="background:#A78BFA">SAVE UPDATE</button>
  `, "#A78BFA");
  nexusConfigureCheckinSheet(m, ["save"]);
  m.querySelector("#x").onclick = closeModal;
  const sym=m.querySelector("#sym"); sym.innerHTML=symptomPickerHTML(f.symptoms,"#A78BFA"); wireSymptomPicker(sym,f.symptoms,"#A78BFA");
  m.querySelector("#save").onclick = () => {
    const timeVal = m.querySelector("#utime").value;
    const [hh,mm] = timeVal.split(":").map(Number);
    const updateTime = new Date(now); updateTime.setHours(hh,mm,0,0);
    const update = { id:uid(), time:updateTime.toISOString(), symptoms:f.symptoms, notes:m.querySelector("#notes").value };
    const entry = state.dailyLogs.find(l=>l.id===log.id);
    if(entry){ if(!entry.updates) entry.updates=[]; entry.updates.push(update); saveState(); closeModal(); render(); }
  };
}

function editUpdateModal(log, update) {
  const t = new Date(update.time);
  const timeStr = t.toTimeString().slice(0,5);
  const syms = JSON.parse(JSON.stringify(update.symptoms||[]));
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">EDIT UPDATE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:11px;color:var(--t4);margin-bottom:12px">Update time</div>
    <input type="time" id="utime" class="inp" value="${timeStr}" style="width:100%;margin-bottom:14px">
    <details class="nx-checkin-symptoms" open><summary><span>Symptoms · Optional</span></summary><div id="sym"></div></details>
    <textarea id="notes" class="inp" placeholder="Notes…" style="min-height:50px;resize:vertical;margin-bottom:18px">${esc(update.notes||"")}</textarea>
    <button id="save" class="btn-primary" style="background:#A78BFA">SAVE CHANGES</button>
  `,"#A78BFA");
  nexusConfigureCheckinSheet(m, ["save"]);
  m.querySelector("#x").onclick=closeModal;
  const sym=m.querySelector("#sym"); sym.innerHTML=symptomPickerHTML(syms,"#A78BFA"); wireSymptomPicker(sym,syms,"#A78BFA");
  m.querySelector("#save").onclick=()=>{
    const [hh,mm]=m.querySelector("#utime").value.split(":").map(Number);
    const newTime=new Date(t); newTime.setHours(hh,mm,0,0);
    const entry=state.dailyLogs.find(l=>l.id===log.id);
    const u=entry&&(entry.updates||[]).find(u=>u.id===update.id);
    if(u){ u.time=newTime.toISOString(); u.symptoms=syms; u.notes=m.querySelector("#notes").value; saveState(); closeModal(); render(); }
  };
}

function dailyModal(existing, prefillDate) {
  // Intercept: if called fresh and today already has a check-in, show the today sheet instead
  if (!existing && !prefillDate) {
    const todayLog = state.dailyLogs.find(l=>dayKey(l.date)===localDate());
    if (todayLog) { todayLogSheet(todayLog); return; }
  }
  const aps = allPeptides();
  const activePeps = Object.entries(aps).filter(([,d])=>(d.doses||[]).length>0 && (d.status||"active")==="active").map(([n])=>n);
  const f = existing ? JSON.parse(JSON.stringify(existing)) : { id:uid(), date:prefillDate||localDate(), mood:3, symptoms:[], notes:"", compound:null, symptomTags:{}, compoundNotes:{} };
  if(!f.symptomTags) f.symptomTags={};
  if(!f.compoundNotes) f.compoundNotes={};
  let color = (MOODS.find(x=>x.v===f.mood)||MOODS[4]).color;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;letter-spacing:1.5px">DAILY CHECK-IN</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <label class="field-label">DATE</label><input id="date" type="date" class="inp" value="${f.date}" style="margin-bottom:14px">
    <label class="field-label">MOOD TODAY</label>
    <div id="moods" style="display:flex;gap:6px;margin-bottom:14px">
      ${MOODS.map(mo=>`<button data-v="${mo.v}" class="moodbtn" aria-label="${mo.label} mood" aria-pressed="${f.mood===mo.v}" style="flex:1;padding:9px 0;border-radius:10px;background:${f.mood===mo.v?mo.color+"22":"transparent"};border:1px solid ${f.mood===mo.v?mo.color:"var(--border)"};display:flex;flex-direction:column;align-items:center;gap:3px">
        <span style="font-size:20px">${mo.emoji}</span><span style="font-size:8.5px;color:${f.mood===mo.v?mo.color:"#666"}">${mo.label}</span></button>`).join("")}
    </div>
    <details class="nx-checkin-symptoms" ${f.symptoms.length?"open":""}><summary><span>Symptoms <span id="nx-sym-count" style="color:var(--t4);font-weight:400">${f.symptoms.length?`· ${f.symptoms.length} selected`:"· Optional"}</span></span></summary><div id="sym"></div></details>
    <div id="compound-tag-section"></div>
    <div id="compound-notes-section"></div>
    <label class="field-label">NOTES</label><textarea id="notes" class="inp" placeholder="e.g. more nauseous than yesterday…" style="min-height:54px;resize:vertical;margin-bottom:18px">${esc(f.notes||"")}</textarea>
    ${(state.settings.supplements||[]).length?`
    <label class="field-label">SUPPLEMENTS TODAY <span style="color:var(--t4);font-weight:400;letter-spacing:0">(optional)</span></label>
    <input id="supp-search" class="inp" type="search" autocomplete="off" placeholder="Search supplements..." aria-label="Find a supplement" style="margin-bottom:8px">
    <button type="button" id="supp-toggle" aria-expanded="false" style="width:100%;min-height:48px;display:flex;align-items:center;justify-content:space-between;text-align:left;padding:12px 14px;border:1px solid var(--border);border-radius:11px;color:var(--t2);margin-bottom:8px"><span>Browse all supplements</span><span class="nx-chevron-slot" aria-hidden="true"></span></button><div id="supp-results" style="max-height:224px;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--border);border-radius:12px;margin-bottom:14px" hidden></div><button type="button" id="supp-selected-toggle" aria-expanded="false" style="display:flex;align-items:center;justify-content:space-between;width:100%;min-height:44px;padding:10px 12px;border-radius:10px;background:var(--surface-2);color:var(--t2);margin-bottom:8px"><span id="supp-selected-count">Selected today (0)</span><span class="nx-chevron-slot" aria-hidden="true"></span></button><div id="supp-chips" style="margin-bottom:8px" aria-label="Selected supplements" hidden></div>`:""}
    <button id="save" class="btn-primary" style="background:${color}">SAVE CHECK-IN</button>
  `, color);
  nexusConfigureCheckinSheet(m, ["save"]);
  m.querySelector("#x").onclick = closeModal;
  const sym = m.querySelector("#sym"); sym.innerHTML = symptomPickerHTML(f.symptoms, color); wireSymptomPicker(sym, f.symptoms, color, ()=>{renderCompoundSections(); const c=m.querySelector("#nx-sym-count");if(c)c.textContent=f.symptoms.length?`· ${f.symptoms.length} selected`:"· Optional";});
  m.querySelectorAll(".moodbtn").forEach(b => b.onclick = () => {
    f.mood = +b.dataset.v; color = MOODS.find(x=>x.v===f.mood).color;
    m.querySelectorAll(".moodbtn").forEach(bb => { const mo=MOODS.find(x=>x.v==bb.dataset.v); const on=+bb.dataset.v===f.mood; bb.style.background=on?mo.color+"22":"transparent"; bb.style.border=`1px solid ${on?mo.color:"var(--border)"}`; bb.lastElementChild.style.color=on?mo.color:"#666"; bb.setAttribute("aria-pressed",String(on)); });
    m.querySelector("#save").style.background = color;
  });

  // Compound tag + notes rendering (called after each symptom picker refresh)
  // Only show actively-dosed compounds — active/in-progress protocol OR has dose history
  const _aps2 = allPeptides();
  const _activeProtocols = (state.protocols||[]).filter(p=>["active","in_progress"].includes(p.status));
  const _activeProtoNames = new Set(_activeProtocols.flatMap(p=>(p.compounds||[]).map(c=>c.name)));
  const _dosedNames = new Set(Object.keys(_aps2).filter(n=>(_aps2[n].doses||[]).length>0));
  const allCompounds = [...new Set([..._activeProtoNames,..._dosedNames])].filter(Boolean).sort();
  const tagOptions=["Not sure","General",...allCompounds];

  // Compact tagging editor: only one symptom expands at a time.
  // The existing symptomTags/compoundNotes objects remain the source of truth.
  let nxActiveSymptom = null;
  let nxNotesOpen = false;
  function renderCompoundSections(){
    const tagSection=m.querySelector("#compound-tag-section");
    const notesSection=m.querySelector("#compound-notes-section");
    if(!tagSection||!notesSection) return;
    const selectedNames=new Set(f.symptoms.map(s=>s.name));
    if(nxActiveSymptom&&!selectedNames.has(nxActiveSymptom)) nxActiveSymptom=null;
    if(!f.symptoms.length){tagSection.innerHTML="";notesSection.innerHTML="";return;}
    const tagSummary = tags => tags.length ? tags.join(", ") : "Not linked";
    tagSection.innerHTML=`<section class="nx-compact-tagging" aria-label="Link symptoms to compounds">
      <div class="nx-compact-tagging-head"><strong>COMPOUND LINKS</strong><span>Optional · ${f.symptoms.length} symptoms</span></div>
      <p class="nx-compact-tagging-hint">Select a symptom to manage its compound links.</p>
      <div class="nx-compact-tagging-list">${f.symptoms.map(s=>{
        const tags=f.symptomTags[s.name]||[];
        const open=nxActiveSymptom===s.name;
        return `<div class="nx-compact-tagging-item">
          <button type="button" class="nx-tag-sym-row" data-sym="${esc(s.name)}" aria-expanded="${open}" aria-label="${esc(s.name)}: ${esc(tagSummary(tags))}">
            <span class="nx-tag-sym-main"><strong>${esc(s.name)}</strong><small>${esc(tagSummary(tags))}</small></span><span class="nx-chevron-slot" aria-hidden="true"></span>
          </button>
          ${open?`<div class="nx-tag-options" aria-label="Compounds for ${esc(s.name)}">
            ${tagOptions.map(c=>{const on=tags.includes(c);return `<button type="button" class="tag-pill" data-sym="${esc(s.name)}" data-compound="${esc(c)}" aria-pressed="${on}" style="background:${on?'#A78BFA22':'transparent'};border-color:${on?'#A78BFA':'var(--border-sub)'};color:${on?'#A78BFA':'var(--t2)'}">${esc(c)}</button>`}).join("")}
          </div>`:""}
        </div>`;
      }).join("")}</div></section>`;
    const visibleLinks = [...new Set(f.symptoms.flatMap(s=>f.symptomTags[s.name]||[]).filter(c=>c!=="Not sure"&&c!=="General"))];
    // Preserve pre-existing compound notes for editing, but only show notes for
    // relevant compounds. Unsaved note text lives in f.compoundNotes on input.
    const noteCompounds=[...new Set([...visibleLinks,...Object.keys(f.compoundNotes).filter(c=>(f.compoundNotes[c]||"").trim())])];
    notesSection.innerHTML=noteCompounds.length?`<section class="nx-compact-tagging nx-compound-notes">
      <button type="button" class="nx-notes-toggle" id="nx-toggle-compound-notes" aria-expanded="${nxNotesOpen}">
        <span><strong>COMPOUND NOTES</strong><small>${noteCompounds.length} compound${noteCompounds.length===1?'':'s'} · Optional</small></span><span class="nx-chevron-slot" aria-hidden="true"></span>
      </button>${nxNotesOpen?`<div class="nx-note-list">${noteCompounds.map(c=>`<label class="nx-note-label">${esc(c)}<textarea class="inp compound-note" data-compound="${esc(c)}" placeholder="Notes for ${esc(c)}…" rows="2">${esc(f.compoundNotes[c]||"")}</textarea></label>`).join("")}</div>`:""}
    </section>`:"";
    tagSection.querySelectorAll(".nx-tag-sym-row").forEach(btn=>btn.onclick=()=>{
      nxActiveSymptom=nxActiveSymptom===btn.dataset.sym?null:btn.dataset.sym;
      renderCompoundSections();
    });
    tagSection.querySelectorAll(".tag-pill").forEach(btn=>btn.onclick=()=>{
      const sym=btn.dataset.sym,cmp=btn.dataset.compound;
      if(!f.symptomTags[sym]) f.symptomTags[sym]=[];
      const index=f.symptomTags[sym].indexOf(cmp);
      if(index>=0)f.symptomTags[sym].splice(index,1);else f.symptomTags[sym].push(cmp);
      renderCompoundSections();
    });
    const notesToggle=notesSection.querySelector("#nx-toggle-compound-notes");
    if(notesToggle)notesToggle.onclick=()=>{nxNotesOpen=!nxNotesOpen;renderCompoundSections();};
    notesSection.querySelectorAll(".compound-note").forEach(ta=>ta.oninput=()=>{f.compoundNotes[ta.dataset.compound]=ta.value;});
  }
  renderCompoundSections();

  // Search-first supplements: selections stay visible, results only appear while searching.
  const suppDate2=f.date||localDate();
  const suppTaken2=new Set(state.supplementLogs.find(l=>dayKey(l.date)===suppDate2)?.taken||[]);
  let suppSelectionTouched=false;
  const suppLibrary=state.settings.supplements||[];
  const suppSearch=m.querySelector("#supp-search");
  const suppSelected=m.querySelector("#supp-chips");
  const suppResults=m.querySelector("#supp-results");
  let suppDropdownOpen=false;
  const suppToggle=m.querySelector("#supp-toggle");
  if(suppToggle)suppToggle.onclick=()=>{suppDropdownOpen=!suppDropdownOpen;renderSuppSearch();};
  let suppSelectedOpen=false;
  const suppSelectedToggle=m.querySelector("#supp-selected-toggle");
  if(suppSelectedToggle)suppSelectedToggle.onclick=()=>{suppSelectedOpen=!suppSelectedOpen;renderSuppSearch();};
  const renderSuppSearch=()=>{
    if(!suppSearch) return;
    suppSelected.hidden=!suppSelectedOpen; suppSelected.style.display=suppSelectedOpen?"block":"none";
    suppSelectedToggle.setAttribute("aria-expanded",String(suppSelectedOpen));
    m.querySelector("#supp-selected-count").textContent="Selected today ("+suppTaken2.size+")";
    suppSelected.innerHTML=[...suppTaken2].map(n=>`<div style="display:flex;align-items:center;justify-content:space-between;min-height:40px;padding:6px 10px;border-bottom:1px solid var(--border-sub);color:var(--t2);font-size:12px"><span>${esc(n)}</span><button type="button" aria-label="Remove ${esc(n)}" class="supp-remove" data-name="${esc(n)}" style="min-width:44px;min-height:36px;color:var(--t3)">×</button></div>`).join("")||'<span style="font-size:12px;color:var(--t4)">None selected</span>';
    suppSelected.querySelectorAll(".supp-remove").forEach(b=>b.onclick=()=>{suppTaken2.delete(b.dataset.name);suppSelectionTouched=true;renderSuppSearch();});
    const q=suppSearch.value.trim().toLocaleLowerCase();
    const matches=suppLibrary.filter(n=>n.toLocaleLowerCase().includes(q));
    const visible=suppDropdownOpen||!!q;
    suppResults.hidden=!visible; suppResults.style.display=visible?"block":"none";
    suppToggle.setAttribute("aria-expanded",String(visible));
    suppResults.innerHTML=matches.map(n=>`<button type="button" class="supp-add" data-name="${esc(n)}" aria-pressed="${suppTaken2.has(n)}" style="display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;padding:11px 12px;min-height:44px;border-bottom:1px solid var(--border-sub);color:var(--t1)"><span>${esc(n)}</span><span aria-hidden="true">${suppTaken2.has(n)?"✓":"＋"}</span></button>`).join("")||'<span style="display:block;padding:12px;font-size:12px;color:var(--t4)">No matches</span>';
    suppResults.querySelectorAll(".supp-add").forEach(b=>b.onclick=()=>{if(suppTaken2.has(b.dataset.name))suppTaken2.delete(b.dataset.name);else suppTaken2.add(b.dataset.name);suppSelectionTouched=true;renderSuppSearch();});
  };
  if(suppSearch){suppSearch.oninput=()=>{suppDropdownOpen=true;renderSuppSearch();};renderSuppSearch();}
  const suppDateInput=m.querySelector("#date");
  if(suppDateInput)suppDateInput.addEventListener("change",()=>{
    const log=state.supplementLogs.find(l=>dayKey(l.date)===suppDateInput.value);
    suppTaken2.clear();(log?.taken||[]).forEach(n=>suppTaken2.add(n));
    suppSelectionTouched=false;renderSuppSearch();
  });
  m.querySelector("#save").onclick = () => {
    const chosenDate=m.querySelector("#date").value;
    if(!chosenDate || Number.isNaN(new Date(chosenDate+"T12:00:00").getTime())) {
      alert("Choose a valid check-in date before saving."); return;
    }
    if(state.dailyLogs.some(x=>x.id!==f.id && dayKey(x.date)===chosenDate)) {
      alert("A check-in already exists on this date. Open it to edit instead."); return;
    }
    f.date=chosenDate; f.notes=m.querySelector("#notes").value;
    f.symptomTags = f.symptomTags||{}; f.compoundNotes = f.compoundNotes||{};
    state.dailyLogs = state.dailyLogs.filter(x=>x.id!==f.id); state.dailyLogs.push(f);
    // Also save supplement selection if any chips were shown
    if(suppSearch && (suppSelectionTouched || !state.supplementLogs.some(l=>dayKey(l.date)===f.date))){
      state.supplementLogs=(state.supplementLogs||[]).filter(l=>dayKey(l.date)!==f.date);
      if(suppTaken2.size) state.supplementLogs.push({id:uid(),date:f.date,taken:[...suppTaken2]});
    }
    saveState(); closeModal(); render();
  };
}

// ─── Macro modal ──────────────────────────────────────────────────────────────
function supplementModal(prefillDate) {
  const today = prefillDate || localDate();
  const existing = state.supplementLogs.find(l=>dayKey(l.date)===today);
  const supps = state.settings.supplements||[];
  const taken = new Set(existing?.taken||[]);
  if(!supps.length) {
    openModal(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span class="mono" style="font-size:13px;color:#C8FF9C;letter-spacing:1.5px">SUPPLEMENTS</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
      <div style="font-size:13px;color:var(--t3);margin-bottom:16px">No supplements set up yet. Add your supplements in Profile first.</div>
      <button id="goprofile" class="btn-primary" style="background:#C8FF9C;color:#1a1728">Go to Profile</button>`,"#C8FF9C");
    document.querySelector(".modal #x").onclick=closeModal;
    document.querySelector(".modal #goprofile").onclick=()=>{closeModal();tab="profile";render();window.scrollTo(0,0);};
    return;
  }
  openModal(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span style="font-weight:700">Supplements · ${fmtDate(today)}</span><button id="x" aria-label="Close">✕</button></div>
    <input id="supp-search" type="search" class="inp" autocomplete="off" placeholder="Search supplements..." aria-label="Find a supplement" style="margin-bottom:10px">
    
    <button type="button" id="supp-toggle" aria-expanded="false" style="width:100%;min-height:48px;display:flex;align-items:center;justify-content:space-between;text-align:left;padding:12px 14px;border:1px solid var(--border);border-radius:11px;color:var(--t2);margin-bottom:8px"><span>Browse all supplements</span><span aria-hidden="true" style="font-size:23px;line-height:1">⌄</span></button><div id="supp-results" style="max-height:224px;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--border);border-radius:12px;margin-bottom:14px" hidden></div>
    <button type="button" id="supp-selected-toggle" aria-expanded="false" style="display:flex;align-items:center;justify-content:space-between;width:100%;min-height:44px;padding:10px 12px;border-radius:10px;background:var(--surface-2);color:var(--t2);font-weight:600;margin:8px 0"><span id="supp-selected-count">Selected today (0)</span><span class="nx-chevron-slot" aria-hidden="true"></span></button><div id="supp-selected" style="margin-bottom:12px" hidden></div>
    <button id="suppsave" class="btn-primary" style="background:#C8FF9C;color:#1A1728">Save supplements</button>`,"#C8FF9C");
  const modal=document.querySelector(".modal");
  modal.querySelector("#x").onclick=closeModal;
  const input=modal.querySelector("#supp-search"),selected=modal.querySelector("#supp-selected"),results=modal.querySelector("#supp-results");
  let dropdownOpen=false;
  const toggle=modal.querySelector("#supp-toggle");
  toggle.onclick=()=>{dropdownOpen=!dropdownOpen;paint();};
  let selectedOpen=false;
  const selectedToggle=modal.querySelector("#supp-selected-toggle");
  selectedToggle.onclick=()=>{selectedOpen=!selectedOpen;paint();};
  const paint=()=>{
    selected.hidden=!selectedOpen;selected.style.display=selectedOpen?"block":"none";selectedToggle.setAttribute("aria-expanded",String(selectedOpen));modal.querySelector("#supp-selected-count").textContent="Selected today ("+taken.size+")";
    selected.innerHTML=[...taken].map(n=>`<div style="display:flex;align-items:center;justify-content:space-between;min-height:40px;padding:6px 10px;border-bottom:1px solid var(--border-sub);color:var(--t2);font-size:12px"><span>${esc(n)}</span><button type="button" class="remove" aria-label="Remove ${esc(n)}" data-name="${esc(n)}" style="min-width:44px;min-height:36px;color:var(--t3)">×</button></div>`).join("")||'<span style="color:var(--t4);font-size:12px">None selected</span>';
    selected.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{taken.delete(b.dataset.name);paint();});
    const q=input.value.trim().toLocaleLowerCase();
    const matches=supps.filter(n=>n.toLocaleLowerCase().includes(q));
    const visible=dropdownOpen||!!q;results.hidden=!visible;results.style.display=visible?"block":"none";toggle.setAttribute("aria-expanded",String(visible));
    results.innerHTML=matches.map(n=>`<button type="button" class="add" data-name="${esc(n)}" aria-pressed="${taken.has(n)}" style="display:flex;justify-content:space-between;align-items:center;width:100%;min-height:44px;text-align:left;border-bottom:1px solid var(--border-sub);padding:10px;color:var(--t1)"><span>${esc(n)}</span><span aria-hidden="true">${taken.has(n)?"✓":"＋"}</span></button>`).join("")||'<span style="display:block;padding:12px;font-size:12px;color:var(--t4)">No matches</span>';
    results.querySelectorAll(".add").forEach(b=>b.onclick=()=>{if(taken.has(b.dataset.name))taken.delete(b.dataset.name);else taken.add(b.dataset.name);paint();});
  };
  input.oninput=()=>{dropdownOpen=true;paint();};paint();
  modal.querySelector("#suppsave").onclick=()=>{
    state.supplementLogs=state.supplementLogs.filter(l=>dayKey(l.date)!==today);
    if(taken.size)state.supplementLogs.push({id:uid(),date:today,taken:[...taken]});
    saveState();closeModal();render();
  };
}

