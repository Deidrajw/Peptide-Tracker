function adherenceCalendar() {
  const today = localDate();
  const aps = allPeptides();
  const allDoses = Object.entries(aps).flatMap(([n,p])=>(p.doses||[]).map(d=>({...d,pep:n,color:cfg(n).color})));
  const scheduledDays = new Set();
  Object.entries(aps).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active").forEach(([n,d])=>{
    const sorted=[...d.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
    sorted.forEach(dose=>scheduledDays.add(dayKey(dose.date)));
    let next=new Date(addDays(sorted[sorted.length-1].date,d.scheduleDays));
    for(let i=0;i<60;i++){
      const k=dayKey(next.toISOString()); if(new Date(k)>new Date(today)) break;
      scheduledDays.add(k); next=new Date(next.getTime()+d.scheduleDays*86400000);
    }
  });
  const gridEnd = new Date(today);
  const gridStart = new Date(today); gridStart.setDate(gridStart.getDate()-83);
  const start = new Date(gridStart);
  const dow=start.getDay(); start.setDate(start.getDate()-(dow===0?6:dow-1));
  const cells=[]; const cur=new Date(start);
  while(calendarDayKey(cur.toISOString())<=today){ cells.push(new Date(cur)); cur.setDate(cur.getDate()+1); }
  let totalSched=0,totalTaken=0;
  cells.forEach(d=>{ const k=calendarDayKey(d.toISOString()); if(scheduledDays.has(k)){ totalSched++; if(allDoses.some(x=>dayKey(x.date)===k)) totalTaken++; } });
  const adherPct=totalSched>0?Math.round(totalTaken/totalSched*100):null;
  const weeks=[]; for(let i=0;i<cells.length;i+=7) weeks.push(cells[i]);
  const cellCol=(d)=>{
    const k=calendarDayKey(d.toISOString());
    if(k>today) return "transparent";
    const hasDose=allDoses.some(x=>dayKey(x.date)===k);
    const hasLog=state.dailyLogs.some(l=>dayKey(l.date)===k);
    if(hasDose) return cfg(allDoses.find(x=>dayKey(x.date)===k).pep).color;
    if(scheduledDays.has(k)) return "#ff7c7c";
    if(hasLog) return "#A78BFA";
    return "var(--surface-3)";
  };
  return `<div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border-sub)">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px">
      <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px">12-WEEK ADHERENCE</div>
      ${adherPct!==null?`<span style="font-size:14px;font-weight:700;color:${adherPct>=80?"#7DF9C0":adherPct>=55?"#F9C87D":"#ff7c7c"}">${adherPct}%</span>`:""}
    </div>
    <div style="overflow-x:auto;padding-bottom:4px">
      <div style="display:inline-flex;gap:2px;min-width:max-content">
        <div style="display:flex;flex-direction:column;gap:2px;margin-right:4px">
          ${["S","M","T","W","T","F","S"].map(l=>`<div style="height:10px;font-size:7px;color:var(--t5);line-height:10px;text-align:right;width:12px">${l}</div>`).join("")}
        </div>
        ${weeks.map(wk=>`<div style="display:flex;flex-direction:column;gap:2px">${[0,1,2,3,4,5,6].map(off=>{
          const d=new Date(wk); d.setDate(d.getDate()+off);
          const k=calendarDayKey(d.toISOString()), isToday=k===today;
          return `<div style="width:10px;height:10px;border-radius:2px;background:${cellCol(d)};outline:${isToday?"1.5px solid #7DF9C0":"none"};outline-offset:1px"></div>`;
        }).join("")}</div>`).join("")}
      </div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
      <div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:2px;background:#7DF9C0"></div><span style="font-size:10px;color:var(--t4)">Dose</span></div>
      <div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:2px;background:#ff7c7c"></div><span style="font-size:10px;color:var(--t4)">Missed</span></div>
      <div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:2px;background:#A78BFA"></div><span style="font-size:10px;color:var(--t4)">Check-in</span></div>
      <div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:2px;background:var(--surface-3)"></div><span style="font-size:10px;color:var(--t4)">No data</span></div>
    </div>
  </div>`;
}

// ─── Dosing Timeline ──────────────────────────────────────────────────────────

function supplyModal(existing, presetName) {
  const f = existing ? {...existing} : {
    id:uid(), name:presetName||"", totalVials:"", vialMg:"",
    bacMl:"", reconDate:"", expiryDays:"", cost:"", currency:"CAD", notes:""
  };
  const c = cfg(f.name);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#C9A0FF;letter-spacing:1.5px">${existing?"EDIT KIT":"ADD KIT"}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${!existing?`<button id="sw-blend" style="background:transparent;border:none;padding:0;font-size:11.5px;color:#C9A0FF;margin-bottom:14px;text-align:left">Adding a blend of multiple compounds in one vial? →</button>`:""}
    <label class="field-label">COMPOUND</label>
    <select id="sname" class="inp" style="margin-bottom:14px">
      <option value="">— select compound —</option>
      ${[...new Set([...Object.keys(PEPTIDES), ...LIBRARY.filter(l=>!l.blend).map(l=>l.name), ...Object.keys(state.customPeptides||{})])].sort().map(n=>`<option value="${esc(n)}" ${f.name===n?"selected":""}>${esc(n)}</option>`).join("")}
    </select>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label class="field-label">NUMBER OF VIALS</label><input id="stv" type="number" class="inp" value="${f.totalVials}" placeholder="e.g. 10" ${existing?"disabled style=\"opacity:0.55\"":""} style="margin-bottom:${existing?"4":"14"}px"></div>
      <div><label class="field-label">MG PER VIAL</label><input id="svmg" type="number" class="inp" value="${f.vialMg}" placeholder="e.g. 30" ${existing?"disabled style=\"opacity:0.55\"":""} style="margin-bottom:${existing?"4":"14"}px"></div>
    </div>
    ${existing?`<div class="hint" style="margin-bottom:14px">Vial count and size can't be changed here once a kit exists — use Reconstitute, Finish Vial, or Log Outflow to adjust individual vials instead.</div>`:""}
    ${!existing?`<label style="display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:13px;color:var(--t3)">
      <input id="shasopen" type="checkbox" style="accent-color:#C9A0FF"> I already have a vial open
    </label>
    <div id="sopen-fields" style="display:none">
      <label class="field-label">RECONSTITUTION DATE</label>
      <input id="srecon" type="date" class="inp" value="${esc((f.reconDate||"").slice(0,10))}" style="margin-bottom:14px">
      <label class="field-label">AMOUNT REMAINING IN IT (${c.unit||"mg"})</label>
      <input id="sremaining" type="number" step="0.01" class="inp" placeholder="defaults to a full vial" style="margin-bottom:14px">
    </div>`:""}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label class="field-label">BAC WATER / VIAL (mL)</label><input id="sbac" type="number" step="0.1" class="inp" value="${f.bacMl}" placeholder="e.g. 3" style="margin-bottom:14px"></div>
      <div><label class="field-label">EXPIRY AFTER RECON (days)</label><input id="sexp" type="number" class="inp" value="${f.expiryDays}" placeholder="e.g. 28" style="margin-bottom:14px"></div>
    </div>
    <div id="sconc" style="margin-bottom:14px"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label class="field-label">TOTAL COST (optional)</label><input id="scost" type="number" step="0.01" class="inp" value="${esc(f.cost||"")}" placeholder="e.g. 200.00" style="margin-bottom:14px"></div>
      <div><label class="field-label">CURRENCY</label><select id="scur" class="inp" style="margin-bottom:14px">
        ${[...new Set(["CAD","USD","GBP","EUR","AUD","NZD","CHF","JPY","CNY","HKD","SGD","INR","MXN","BRL","ZAR",f.currency])].filter(Boolean).map(c=>`<option${c===f.currency?" selected":""}>${c}</option>`).join("")}
      </select></div>
    </div>
    <label class="field-label">STORAGE LOCATION</label>
    <select id="sloc" class="inp" style="margin-bottom:14px">
      ${["unknown","fridge","freezer","room_temp"].map(v=>`<option value="${v}"${(f.storageLocation||"unknown")===v?" selected":""}>${{unknown:"Unknown",fridge:"Fridge / Refrigerator",freezer:"Freezer",room_temp:"Room Temperature"}[v]}</option>`).join("")}
    </select>
    <label for="snotes" class="field-label">NOTES (optional)</label>
    <textarea id="snotes" class="inp" rows="2" placeholder="Storage, lot or other kit notes" style="margin-bottom:18px">${esc(f.notes||"")}</textarea>
    <button id="ssave" class="btn-primary" style="background:#C9A0FF">${existing?"Save Changes":"Add to Stash"}</button>
  `, "#C9A0FF");
  const kitTestResult=nexusKitTestResultControl(m,"ssave",existing?.testResultAttachment);
  // Presentation-only layer: shared compact editor anatomy; all original IDs and handlers stay intact.
  m.classList.add("nx-stash-kit-editor");
  const originalTitle=m.querySelector(".mono");
  if(originalTitle){originalTitle.classList.add("nx-kit-editor-eyebrow");originalTitle.parentElement.classList.add("nx-kit-editor-header");
    originalTitle.textContent=existing?"Edit kit":"Add kit";
    const intro=document.createElement("p");intro.className="nx-kit-editor-intro";intro.textContent=existing?"Update kit details without changing vial quantities or history.":"Record a kit and its vial details. You can open a vial later.";
    originalTitle.parentElement.insertAdjacentElement("afterend",intro);
  }
  const openLabel=m.querySelector("#shasopen")?.closest("label");
  if(openLabel)openLabel.classList.add("nx-kit-editor-open-toggle");
  const openFields=m.querySelector("#sopen-fields");
  if(openFields)openFields.classList.add("nx-kit-editor-open-fields");
  const controls=["sname","stv","svmg","srecon","sremaining","sbac","sexp","scost","scur","sloc","snotes"];
  controls.forEach(id=>{
    const control=m.querySelector("#"+id);
    if(!control)return;
    const previous=control.previousElementSibling;
    if(previous?.matches("label.field-label")){
      previous.htmlFor=id;
      previous.classList.add("nx-kit-editor-label");
    }
  });
  const saveAction=m.querySelector("#ssave");
  if(saveAction){saveAction.classList.add("nx-kit-editor-save");const footer=document.createElement("div");footer.className="nx-kit-editor-footer";saveAction.parentNode.insertBefore(footer,saveAction);footer.appendChild(saveAction);}
  const blendSwitch=m.querySelector("#sw-blend");
  if(blendSwitch)blendSwitch.classList.add("nx-kit-editor-blend-switch");
  m.querySelector("#x").onclick = closeModal;
  const swBlend = m.querySelector("#sw-blend");
  if (swBlend) swBlend.onclick = () => { closeModal(); addBlendKitModal(null); };
  const hasOpenToggle = m.querySelector("#shasopen");
  if (hasOpenToggle) hasOpenToggle.onchange = () => { m.querySelector("#sopen-fields").style.display = hasOpenToggle.checked ? "block" : "none"; };
  const concBox = m.querySelector("#sconc");
  const updateConc = () => {
    const v=parseFloat(m.querySelector("#svmg").value), w=parseFloat(m.querySelector("#sbac").value);
    concBox.innerHTML = v&&w ? `<div style="background:#C9A0FF11;border:1px solid #C9A0FF33;border-radius:8px;padding:9px 12px;font-size:12px;color:#C9A0FF">Concentration: <b>${(v/w).toFixed(2)} mg/mL</b> · 1 mg ≈ ${(100/(v/w)).toFixed(1)} units</div>` : "";
  };
  m.querySelector("#svmg").oninput = updateConc;
  m.querySelector("#sbac").oninput = updateConc;
  updateConc();
  m.querySelector("#ssave").onclick = () => {
    if(kitTestResult.isPending()){showErrorBanner("Wait for the test-result file to finish loading.");return;}
    const name=m.querySelector("#sname").value.trim(); if(!name||name==="— select compound —") return;
    const bacMl = +m.querySelector("#sbac").value||0;
    const expiryDays = +m.querySelector("#sexp").value||28;
    const storageLocation = m.querySelector("#sloc").value||"unknown";
    const cost = m.querySelector("#scost").value;
    const currency = m.querySelector("#scur").value;
    const notes = m.querySelector("#snotes").value;

    if (existing) {
      // Metadata only — vial count/size/state is never touched here once a kit already
      // has real vials. Whatever openedVials/emptyVials/vials[] the kit already carries
      // is preserved exactly as-is by simply not overwriting them, rather than the old
      // behavior of blindly re-deriving them from two raw count fields on every edit,
      // which could silently drift out of sync with the kit's actual vial state.
      const rec = { ...existing, bacMl, expiryDays, storageLocation, cost, currency, notes, testResultAttachment:kitTestResult.getValue() };
      state.supplies = state.supplies.filter(x=>x.id!==f.id); state.supplies.push(rec);
      saveState(); closeModal(); render();
      return;
    }

    // New kit: built vial-first, in the canonical v2 shape, from the moment it's created —
    // no legacy openedVials/emptyVials counters, no lazy synthesis needed later. All
    // vials start sealed, except optionally the very first one, if the person says they
    // already have a vial reconstituted and open.
    const totalVials = Math.max(1, +m.querySelector("#stv").value||1);
    const vialMg = +m.querySelector("#svmg").value||0;
    const hasOpen = hasOpenToggle && hasOpenToggle.checked;
    const openReconDate = hasOpen ? (m.querySelector("#srecon").value || localDate()) : null;
    const openRemainingInput = hasOpen ? m.querySelector("#sremaining").value : "";
    const openRemainingMg = hasOpen ? (openRemainingInput ? doseToMg(openRemainingInput, c.unit) : vialMg) : 0;
    const vials = [];
    for (let i=0; i<totalVials; i++) {
      if (i===0 && hasOpen) {
        vials.push({ id:uid(), sequenceNumber:1, status:"open", vialMg, remainingMg: Math.min(vialMg, Math.max(0, openRemainingMg)), reconDate: openReconDate, bacMl });
      } else {
        vials.push({ id:uid(), status:"sealed", vialMg, remainingMg: vialMg });
      }
    }
    const rec = {
      id:f.id, name, totalVials, vialMg, bacMl, expiryDays,
      reconDate: hasOpen ? openReconDate : null,
      activeKit: hasOpen,
      storageLocation, cost, currency, notes,
      testResultAttachment:kitTestResult.getValue(),
      vials,
    };
    const finishCreate = () => {
      state.supplies = state.supplies.filter(x=>x.id!==f.id); state.supplies.push(rec);
      // Inventory does NOT imply tracking. Adding a kit used to silently create a fully
      // "active" tracked peptide entry (empty doses) — which is exactly why compounds you
      // only ever bought/stocked, but never actually started a protocol or logged a dose
      // for, were showing up as "Not Started" cards. defaultState()'s own comment already
      // documents the intended rule: a compound enters tracking only via explicit action
      // (onboarding, Library "Track", protocol creation, or a first logged dose) — every
      // one of those paths already creates its own tracker entry independently when it
      // actually happens, so nothing here needs to pre-create it. Buying/stocking a
      // compound is an inventory fact, not a decision to start tracking it.
      saveState(); closeModal(); render();
    };
    // Only ask if this new kit is ALSO being created with a vial already open — a purely
    // sealed new kit isn't opening anything, so there's nothing to confirm.
    if (hasOpen) confirmOpenIfOtherKitOpen(rec, finishCreate); else finishCreate();
  };

  // Guided presentation over the ORIGINAL fields and authoritative Save handler.
  // The original input nodes stay in the DOM; no independent inventory write occurs.
  const body=m.querySelector(".nx-unified-body")||m;
  const wizardIntro=body.querySelector(".nx-kit-editor-intro");
  const editorFooter=m.querySelector(".nx-kit-editor-footer");
  const allNodes=Array.from(body.children).filter(n=>n!==wizardIntro&&n!==editorFooter);
  const stages=[0,1,2].map(i=>{const el=document.createElement("section");el.className="nx-kit-wizard-stage";el.dataset.step=String(i);el.hidden=i!==0;return el;});
  let stageIndex=0;
  allNodes.forEach(node=>{
    if(node.querySelector?.("#ssave")||node.id==="ssave")return;
    stages[stageIndex].appendChild(node);
    if(node.querySelector?.("#stv")||node.id==="stv")stageIndex=1;
  });
  stages.forEach(el=>body.appendChild(el));
  const review=stages[2];
  review.innerHTML='<div class="nx-kit-wizard-summary" aria-live="polite"></div><p class="nx-kit-wizard-review-note">Confirm these details before saving. Existing vial and dose history remains protected.</p>';
  const stepHeader=document.createElement("div");
  stepHeader.className="nx-kit-wizard-progress";
  stepHeader.innerHTML='<div class="nx-kit-wizard-step-heading"><span id="nx-kit-step-label">Step 1 of 3 · Kit details</span></div><div class="nx-kit-wizard-track"><span></span></div>';
  body.insertBefore(stepHeader,stages[0]);
  const nav=document.createElement("div");nav.className="nx-kit-wizard-navigation";
  nav.innerHTML='<p class="nx-kit-wizard-error" role="alert" hidden></p><div class="nx-kit-wizard-buttons"><button type="button" id="nx-kit-back">Back</button><button type="button" id="nx-kit-next">Continue</button></div>';
  if(editorFooter){editorFooter.classList.add("nx-kit-wizard-footer");editorFooter.appendChild(nav);nav.querySelector(".nx-kit-wizard-buttons").appendChild(saveAction);m.appendChild(editorFooter);}
  const back=m.querySelector("#nx-kit-back"),next=m.querySelector("#nx-kit-next"),error=m.querySelector(".nx-kit-wizard-error");
  let currentStep=0;
  const read=id=>m.querySelector("#"+id)?.value||"";
  const escReview=v=>String(v??"").replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
  const updateReview=()=>{
    const count=existing?f.totalVials:Math.max(1,Number(read("stv"))||1);
    const mg=existing?f.vialMg:Number(read("svmg"));
    const isOpen=existing?!!getActiveVial(existing):!!m.querySelector("#shasopen")?.checked;
    const activeCount=isOpen?1:0;
    const fieldPairs=[["Compound",existing?f.name:read("sname")],["Vial count",count],["Strength per vial",mg+" mg"],["Initially open",isOpen?"Yes":"No"],["Sealed vials",existing?getSealedVials(existing).length:Math.max(0,count-activeCount)],["BAC water per vial",read("sbac")?read("sbac")+" mL":"Not provided"],["Expiry after recon",read("sexp")?read("sexp")+" days":"Default 28 days"],["Storage",m.querySelector("#sloc")?.selectedOptions[0]?.textContent||"Unknown"],["Cost",read("scost")?(read("scost")+" "+read("scur")):"Not provided"],["Notes",read("snotes")||"None"],["Test results",kitTestResult.getValue()?.name||"None"]];
    const compound=existing?f.name:read("sname");
    const summary=review.querySelector(".nx-kit-wizard-summary");
    summary.innerHTML='<div class="nx-kit-review-hero"><span class="nx-kit-review-kicker">YOUR KIT</span><h3>'+escReview(compound)+'</h3><div class="nx-kit-review-total"><strong>'+escReview(mg)+' mg</strong><span>per physical vial</span></div></div>'+
      '<div class="nx-kit-review-section"><h4>Inventory and preparation</h4><div class="nx-kit-review-facts">'+fieldPairs.slice(1).map(([label,val])=>'<div><span>'+escReview(label)+'</span><strong>'+escReview(val)+'</strong></div>').join("")+'</div></div>';
  };
  const validate=()=>{
    if(currentStep===0&&!existing){
      if(!read("sname"))return "Select a compound before continuing.";
      const number=Number(read("stv")), strength=Number(read("svmg"));
      if(!Number.isInteger(number)||number<1)return "Enter a positive whole number of vials.";
      if(!Number.isFinite(strength)||strength<=0)return "Enter a positive mg amount per vial.";
    }
    if(currentStep===1&&m.querySelector("#shasopen")?.checked){
      const rem=read("sremaining");
      if(rem!==""&&(!Number.isFinite(Number(rem))||Number(rem)<0||doseToMg(Number(rem),cfg(read("sname")).unit)>Number(read("svmg"))))return "Remaining amount must be between zero and one full vial.";
    }
    return "";
  };
  const paint=()=>{
    stages.forEach((el,i)=>{el.hidden=i!==currentStep;});
    stepHeader.querySelector("#nx-kit-step-label").textContent="Step "+(currentStep+1)+" of 3 · "+["Kit details","Preparation & storage","Review & save"][currentStep];
    stepHeader.querySelector(".nx-kit-wizard-track span").style.width=((currentStep+1)/3*100)+"%";
    back.hidden=currentStep===0;next.hidden=currentStep===2;
    saveAction.hidden=currentStep!==2;
    saveAction.style.setProperty("display",currentStep===2?"block":"none","important");
    next.style.setProperty("display",currentStep===2?"none":"block","important");
    if(currentStep===2)updateReview();
    error.hidden=true;
    body.scrollTop=0;
  };
  back.onclick=()=>{currentStep=Math.max(0,currentStep-1);paint();};
  next.onclick=()=>{const msg=validate();if(msg){error.textContent=msg;error.hidden=false;return;}currentStep=Math.min(2,currentStep+1);paint();};
  const originalSelect=m.querySelector("#sname");
  if(originalSelect){
    const field=originalSelect.parentElement;
    const combo=document.createElement("div");combo.className="nx-kit-combobox";
    combo.innerHTML='<input id="nx-kit-combobox-input" class="inp" type="search" role="combobox" aria-autocomplete="list" aria-label="Compound · type to search or browse" aria-expanded="false" aria-controls="nx-kit-combobox-list" autocomplete="off" placeholder="Search or choose compound"><div id="nx-kit-combobox-list" role="listbox" hidden></div>';
    originalSelect.insertAdjacentElement("afterend",combo);
    originalSelect.classList.add("nx-kit-original-select");
    const input=combo.querySelector("input"),list=combo.querySelector('[role="listbox"]');
    const options=[...originalSelect.options].filter(o=>o.value).map(o=>({name:o.textContent,value:o.value}));
    input.value=originalSelect.selectedOptions[0]?.value?originalSelect.selectedOptions[0].textContent:"";
    if(existing){input.readOnly=true;input.setAttribute("aria-label","Compound (locked for existing kit)");}
    const closeList=()=>{list.hidden=true;input.setAttribute("aria-expanded","false");};
    const showOptions=()=>{
      if(existing)return;
      const q=input.value.toLowerCase().trim();
      const filtered=options.filter(o=>o.name.toLowerCase().includes(q)).slice(0,5);
      list.replaceChildren();
      filtered.forEach(o=>{const b=document.createElement("button");b.type="button";b.setAttribute("role","option");b.textContent=o.name;b.onclick=()=>{originalSelect.value=o.value;originalSelect.dispatchEvent(new Event("change",{bubbles:true}));input.value=o.name;closeList();};list.appendChild(b);});
      const browse=document.createElement("button");browse.type="button";browse.className="nx-kit-browse-all";
      browse.textContent="View all compounds";
      browse.onpointerdown=e=>e.preventDefault();
      browse.onclick=()=>{closeList();nexusBrowseAllCompounds(m,options,o=>{
        originalSelect.value=o.value;originalSelect.dispatchEvent(new Event("change",{bubbles:true}));
        input.value=o.name;
      });};
      list.appendChild(browse);
      list.hidden=false;input.setAttribute("aria-expanded","true");
    };
    input.onfocus=showOptions;input.oninput=()=>{originalSelect.value="";showOptions();};input.onkeydown=e=>{if(e.key==="Escape"){closeList();return;}if(e.key==="ArrowDown"&&!list.hidden){e.preventDefault();list.querySelector('[role="option"]')?.focus();}else if(e.key==="Enter"&&!list.hidden){e.preventDefault();list.querySelector('[role="option"]')?.click();}};
    list.onkeydown=e=>{if(e.key==="Escape"){e.preventDefault();closeList();input.focus();}if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const bs=[...list.querySelectorAll('[role="option"]')],i=bs.indexOf(document.activeElement);bs[Math.max(0,Math.min(bs.length-1,i+(e.key==="ArrowDown"?1:-1)))]?.focus();}};
    combo.addEventListener("focusout",()=>{requestAnimationFrame(()=>{if(!combo.contains(document.activeElement))closeList();});});
  }
  paint();

}

// ─── Health import modal ─────────────────────────────────────────────────────────
const HK_TYPES = {
  HKQuantityTypeIdentifierBodyMass:"weight",
  HKQuantityTypeIdentifierStepCount:"steps",
  HKQuantityTypeIdentifierActiveEnergyBurned:"activeCalories",
  HKQuantityTypeIdentifierRestingHeartRate:"restingHR",
  HKQuantityTypeIdentifierWaistCircumference:"waist",
  HKQuantityTypeIdentifierDietaryEnergyConsumed:"calories",
  HKQuantityTypeIdentifierDietaryProtein:"protein",
  HKQuantityTypeIdentifierDietaryCarbohydrates:"carbs",
  HKQuantityTypeIdentifierDietaryFatTotal:"fat",
};
function parseHealthExport(file, onProgress) {
  return new Promise((resolve,reject)=>{
    const CHUNK=2*1024*1024; let offset=0, buffer="", total=file.size;
    const result={weight:[],steps:[],activeCalories:[],restingHR:[],waist:[],calories:[],protein:[],carbs:[],fat:[]};
    const recRe=/<Record\s([^>]*?)\/>/g, attrRe=/(\w+)="([^"]*)"/g;
    function attrs(s){const m={};let a;attrRe.lastIndex=0;while((a=attrRe.exec(s))!==null)m[a[1]]=a[2];return m;}
    function process(text){let m;recRe.lastIndex=0;while((m=recRe.exec(text))!==null){const a=attrs(m[1]);const mapped=HK_TYPES[a.type];if(!mapped)continue;const date=a.startDate||a.creationDate;const val=parseFloat(a.value);if(!date||isNaN(val))continue;result[mapped].push({date:new Date(date).toISOString(),value:val,unit:a.unit||"",sourceName:a.sourceName||"Unknown"});}}
    const reader=new FileReader();
    function next(){ if(offset>=total){finish();return;} reader.readAsText(file.slice(offset,offset+CHUNK)); }
    reader.onload=e=>{ buffer+=e.target.result; const tail=buffer.lastIndexOf("<"); if(tail>0&&tail<buffer.length-1){process(buffer.slice(0,tail));buffer=buffer.slice(tail);}else{process(buffer);buffer="";} offset+=CHUNK; onProgress(Math.min(99,Math.round(offset/total*100))); setTimeout(next,0); };
    reader.onerror=reject;
    function byDay(arr){const m={};arr.forEach(r=>{const k=dayKey(r.date);m[k]=(m[k]||0)+r.value;});return Object.entries(m).map(([d,v])=>({date:new Date(d).toISOString(),value:Math.round(v)})).sort((a,b)=>new Date(a.date)-new Date(b.date));}
    function lastPerDay(arr){const m={};arr.forEach(r=>{m[dayKey(r.date)]=r;});return Object.values(m).sort((a,b)=>new Date(a.date)-new Date(b.date));}
    function byDayForSrc(arr,src){const m={};arr.filter(r=>r.sourceName===src).forEach(r=>{const k=dayKey(r.date);m[k]=(m[k]||0)+r.value;});return Object.entries(m).map(([d,v])=>({date:d,value:Math.round(v)})).sort((a,b)=>a.date.localeCompare(b.date));}
    function finish(){
      if(buffer)process(buffer);
      onProgress(100);
      const macroKeys=["calories","protein","carbs","fat"];
      const macroSrcSet=new Set();
      macroKeys.forEach(k=>result[k].forEach(r=>macroSrcSet.add(r.sourceName)));
      // Sort sources — MacroFactor always first
      const macroSources=[...macroSrcSet].sort((a,b)=>{
        if(a.includes("MacroFactor"))return -1;
        if(b.includes("MacroFactor"))return 1;
        return a.localeCompare(b);
      });
      const macroBySrc={};
      macroSources.forEach(src=>{
        macroBySrc[src]={};
        macroKeys.forEach(k=>{ macroBySrc[src][k]=byDayForSrc(result[k],src); });
      });
      resolve({
        weight:lastPerDay(result.weight),
        steps:byDay(result.steps),
        activeCalories:byDay(result.activeCalories),
        restingHR:result.restingHR.sort((a,b)=>new Date(a.date)-new Date(b.date)),
        waist:lastPerDay(result.waist),
        macroSources,
        macroBySrc,
      });
    }
    next();
  });
}
// ─── CSV aggregate parser (Health Auto Export) ──────────────────────────────
function parseCSVDate(str) {
  if (!str) return null;
  const s = str.trim().split(' ')[0].split('T')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;
  return null;
}
function parseAggregateCSV(text) {
  const lines = text.replace(/\r/g,'').trim().split('\n');
  if (lines.length < 2) throw new Error('CSV appears empty');
  const headers = lines[0].split(',').map(h=>h.trim().replace(/"/g,''));
  // Flexible column name map — covers Health Auto Export and common variants
  const COL_MAP = {
    'Date':'date',
    // ── Nutrition (exact Health Auto Export names) ──
    'Energy consumed(Cal)':'calories',
    'Protein(g)':'protein',
    'Carbohydrates(g)':'carbs',
    'Fat total(g)':'fat',
    'Fat saturated(g)':'fatSaturated',
    'Fiber(g)':'fiber',
    'Sugar(g)':'sugar',
    'Cholesterol(mg)':'cholesterol',
    'Caffeine(mg)':'caffeine',
    'Calcium(mg)':'calcium',
    'Iron(mg)':'iron',
    'Magnesium(mg)':'magnesium',
    'Potassium(mg)':'potassium',
    'Sodium(mg)':'sodium',
    'Water(mL)':'water',
    'Vitamin A(mcg)':'vitaminA',
    'Vitamin C(mg)':'vitaminC',
    'Vitamin D(mcg)':'vitaminD',
    // ── Energy ──
    'Active energy burned(Cal)':'activeCalories',
    'Basal energy burned(Cal)':'basalCalories',
    'Exercise time(min)':'exerciseMinutes',
    // ── Activity / movement ──
    'Step count(count)':'steps',
    'Flights climbed(count)':'flightsClimbed',
    'Distance walking / running(km)':'distanceKm',
    'Distance cycling(km)':'distanceCyclingKm',
    'Distance swimming(m)':'distanceSwimmingM',
    'Apple Watch stand hours(hr)':'standHours',
    'Stand time(min)':'standMinutes',
    // ── Heart rate ──
    'Heart rate(count/min)':'avgHeartRate',
    'Resting heart rate(count/min)':'restingHR',
    'Walking heart rate average(count/min)':'walkingHR',
    // ── Body ──
    'Body mass':'weight',                        // lb variants
    'Body Mass (lb)':'weight',
    'Body mass (kg)':'weightKg',
    'Body Mass (kg)':'weightKg',
    'Body fat percentage':'bodyFat',
    'Body Fat Percentage (%)':'bodyFat',
    // ── HRV / other (record-based fallback names) ──
    'Heart rate variability (SDNN)(HKQuantityTypeIdentifierHeartRateVariabilitySDNN)':'hrv',
    'Heart rate variability (SDNN)(ms)':'hrv',
    'Resting heart rate(HKQuantityTypeIdentifierRestingHeartRate)':'restingHR',
    'Body mass(HKQuantityTypeIdentifierBodyMass)':'weight',
    'VO2 Max(HKQuantityTypeIdentifierVO2Max)':'vo2max',
    'Waist circumference(HKQuantityTypeIdentifierWaistCircumference)':'waistCm',
    'Walking heart rate average(HKQuantityTypeIdentifierWalkingHeartRateAverage)':'walkingHR',
    'Time asleep(hr)':'sleepHours',
  };
  const idxMap = {};
  // Exact match first (preserves existing behavior byte-for-byte). Only falls back to a
  // normalized (trimmed, collapsed-whitespace, case-insensitive) match when the exact
  // header isn't recognized — never lets normalization silently override an exact hit.
  const normalizeHeader = h => h.trim().replace(/\s+/g,' ').toLowerCase();
  const normalizedColMap = {};
  Object.entries(COL_MAP).forEach(([k,v])=>{ const nk=normalizeHeader(k); if(!(nk in normalizedColMap)) normalizedColMap[nk]=v; });
  headers.forEach((h,i)=>{
    const exact = COL_MAP[h];
    const k = exact || normalizedColMap[normalizeHeader(h)];
    if (k) idxMap[k]=i;
  });
  if (!('date' in idxMap)) throw new Error('No "Date" column found. Check the file header row.');
  // Raw per-sample exports (e.g. Health Auto Export's full-granularity mode) can put dozens
  // of readings on a single day. Build ALL raw samples first, then aggregate per date below —
  // rate-type readings (HRV, heart rate, VO2max, body fat) are averaged across the day's
  // samples rather than silently keeping whichever sample happened to parse first.
  const RATE_FIELDS = ['avgHeartRate','restingHR','walkingHR','hrv','bodyFat','vo2max'];
  const rawSamples = [];
  for (let i=1; i<lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = lines[i].split(',').map(c=>c.replace(/^"|"$/g,'').trim());
    const date = parseCSVDate(cols[idxMap.date]);
    if (!date) continue;
    const row = {date};
    ['calories','protein','carbs','fat','fatSaturated','fiber','sugar','cholesterol','caffeine','sodium','water','activeCalories','basalCalories','exerciseMinutes','steps','flightsClimbed','standHours','standMinutes','distanceKm','distanceCyclingKm','avgHeartRate','restingHR','walkingHR','hrv','bodyFat','vo2max','sleepHours'].forEach(k=>{
      if (k in idxMap){ const n=parseFloat(cols[idxMap[k]]); if(!isNaN(n)&&n>0) row[k]= RATE_FIELDS.includes(k) ? n : Math.round(n*10)/10; }
    });
    if ('weight' in idxMap){ const n=parseFloat(cols[idxMap.weight]); if(!isNaN(n)&&n>30) row.weight=+(n.toFixed(1)); }
    if ('weightKg' in idxMap && !row.weight){ const n=parseFloat(cols[idxMap.weightKg]); if(!isNaN(n)&&n>10) row.weight=+(n*2.2046).toFixed(1); }
    if (Object.keys(row).length > 1) rawSamples.push(row);
  }
  // Group by date, average rate-type fields across all of that day's samples, keep the
  // last non-null value for everything else (weight, cumulative nutrition/activity totals).
  const byDate = {};
  rawSamples.forEach(row => { (byDate[row.date] = byDate[row.date] || []).push(row); });
  const rows = Object.entries(byDate).map(([date, samples]) => {
    const merged = { date };
    RATE_FIELDS.forEach(k => {
      const vals = samples.map(s => s[k]).filter(v => v != null);
      if (vals.length) merged[k] = Math.round((vals.reduce((a,b)=>a+b,0)/vals.length) * 10) / 10;
      if (k === 'hrv' && vals.length) { merged.hrvSampleCount = vals.length; merged.hrvMetric = 'SDNN'; }
    });
    samples.forEach(s => { Object.keys(s).forEach(k => { if (k!=='date' && !RATE_FIELDS.includes(k) && s[k]!=null) merged[k]=s[k]; }); });
    return merged;
  });
  if (!rows.length) throw new Error('No valid data rows found. Check the file format.');
  return rows.sort((a,b)=>a.date.localeCompare(b.date));
}

function parseWorkoutCSV(text) {
  const lines = text.replace(/\r/g,'').trim().split('\n');
  if (lines.length < 2) throw new Error('Workout CSV appears empty');
  const headers = lines[0].split(',').map(h=>h.trim().replace(/"/g,''));
  const idx = k => headers.indexOf(k);
  // Required columns
  const dateIdx=idx('Date'), actIdx=idx('Activity');
  if (dateIdx<0) throw new Error('No Date column in workout CSV');
  const rows = [];
  for (let i=1; i<lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = lines[i].split(',').map(c=>c.replace(/^"|"$/g,'').trim());
    // Date range format: "2026-05-24 16:08:05 - 2026-05-24 16:24:42"
    const rawDate = cols[dateIdx]||'';
    const dateStr = parseCSVDate(rawDate.split(' - ')[0]);
    if (!dateStr) continue;
    const row = {
      date: dateStr,
      startTime: rawDate.split(' - ')[0]||'',
      endTime: rawDate.split(' - ')[1]||'',
      activity: actIdx>=0 ? (cols[actIdx]||'') : 'Workout',
    };
    const num = (k,mult) => { const n=parseFloat(cols[idx(k)]); return (!isNaN(n)&&n>0) ? Math.round(n*(mult||1)*10)/10 : null; };
    row.activeCalories = num('Active energy burned(Cal)');
    row.durationMin    = num('Duration(s)') != null ? Math.round(num('Duration(s)')/60) : null;
    row.distanceKm     = num('Distance(km)');
    row.avgHR          = num('Heart rate: Average(count/min)');
    row.maxHR          = num('Heart rate: Maximum(count/min)');
    row.mets           = num('METs Average(kcal/hr·kg)');
    // HR zones (store as 0–100 percentages)
    ['A Easy (<115bpm)','B Fat Burn (115-135bpm)','C Moderate Training (135-155bpm)','D Hard Training (155-175bpm)','E Extreme Training (>175bpm)'].forEach((z,zi)=>{
      const k=`Heart rate zone: ${z}(%)`;
      const n=parseFloat(cols[idx(k)]||'');
      if(!isNaN(n)) row[`hrZone${zi+1}`]=Math.round(n*100)/100;
    });
    if (row.activity) rows.push(row);
  }
  if (!rows.length) throw new Error('No valid workout rows found');
  return rows.sort((a,b)=>a.startTime.localeCompare(b.startTime));
}

function healthModal() {
  let parsed=null, macroSource=null;
  const sel={weight:true,steps:true,activeCalories:true,restingHR:false,waist:true,macros:true};
  // CSV-specific state
  let csvRows=null, csvConflictMode="skip", csvActivityConflictMode="merge", csvSel={macros:true,weight:true,activity:true};
  let csvDateFrom="", csvDateTo=""; // date range filter for import
  let workoutRows=null;
  const importBatchId=uid(); // unique batch ID for this import session
  const importedAt=new Date().toISOString();
  let importFileName="";
  const m = openModal(`<div id="body"></div>`, "#FF6B6B");
  const body = m.querySelector("#body");
  function pick() {
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><span class="mono" style="font-size:13px;color:#FF6B6B;letter-spacing:1.5px">IMPORT HEALTH DATA</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
        <label style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 12px;border-radius:12px;background:#7DF9C011;border:2px dashed #7DF9C044;color:#7DF9C0;text-align:center;cursor:pointer">
          <span style="font-size:22px">📊</span>
          <span style="font-size:12px;font-weight:700;letter-spacing:0.5px">CSV</span>
          <span style="font-size:10px;color:var(--t4);line-height:1.4">Health Auto Export<br>aggregate daily file</span>
          <span style="font-size:10px;color:#7DF9C0;font-weight:600">Recommended</span>
          <input id="csv-file" type="file" accept=".csv,text/csv" style="display:none">
        </label>
        <label style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 12px;border-radius:12px;background:#FF6B6B11;border:2px dashed #FF6B6B44;color:#FF6B6B;text-align:center;cursor:pointer">
          <span style="font-size:22px">📄</span>
          <span style="font-size:12px;font-weight:700;letter-spacing:0.5px">XML</span>
          <span style="font-size:10px;color:var(--t4);line-height:1.4">Apple Health<br>export.xml file</span>
          <span style="font-size:10px;color:var(--t5)">Large · may be slow</span>
          <input id="xml-file" type="file" accept=".xml,text/xml" style="display:none">
        </label>
      </div>
      <div style="font-size:11px;color:var(--t5);line-height:1.5;text-align:center">CSV import from Health Auto Export avoids the doubled-nutrition issue caused by multiple Apple Health sources.</div>
      <button id="manage-imports-btn" style="width:100%;margin-top:10px;padding:10px 12px;background:var(--surface-2);border:1px solid var(--border-sub);border-radius:8px;display:flex;align-items:center;gap:10px;text-align:left;color:var(--t3);font-size:12px">
        <span style="font-size:16px">🗂</span>
        <span style="flex:1">Manage / Delete Previous Imports</span>
        <span style="color:var(--t5);font-size:12px">›</span>
      </button>
      <div style="margin-top:10px;padding:10px 12px;background:var(--surface-2);border-radius:8px;display:flex;align-items:center;gap:10px">
        <span style="font-size:18px">🏋️</span>
        <div style="flex:1;font-size:11px;color:var(--t4);line-height:1.4">Import workouts separately from the <b style="color:var(--t3)">Export-workouts.csv</b> file</div>
        <label style="background:#A78BFA22;border:1px solid #A78BFA44;color:#A78BFA;border-radius:7px;padding:6px 10px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap">
          Select CSV<input id="workout-file" type="file" accept=".csv,text/csv" style="display:none">
        </label>
      </div>`;
    body.querySelector("#x").onclick = closeModal;
    const mib=body.querySelector("#manage-imports-btn"); if(mib) mib.onclick=manageImports;
    body.querySelector("#csv-file").onchange = async e => {
      const file = e.target.files[0]; if(!file) return;
      importFileName = file.name;
      try {
        const text = await file.text();
        csvRows = parseAggregateCSV(text);
        csvPreview();
      } catch(err) { body.innerHTML=`<div style="color:#ff7c7c;padding:20px;text-align:center;font-size:13px">⚠ ${esc(err.message)}</div><button id="bp" class="btn-primary" style="background:var(--surface-3);margin-top:8px">← Back</button>`; body.querySelector("#bp").onclick=pick; }
    };
    const wf=body.querySelector("#workout-file");
    if(wf) wf.onchange = async e => {
      const file=e.target.files[0]; if(!file) return;
      try { const text=await file.text(); workoutRows=parseWorkoutCSV(text); workoutPreview(); }
      catch(err){ body.innerHTML=`<div style="color:#ff7c7c;padding:20px;text-align:center;font-size:13px">⚠ ${esc(err.message)}</div><button id="bp" class="btn-primary" style="background:var(--surface-3);margin-top:8px">← Back</button>`; body.querySelector("#bp").onclick=pick; }
    };
    body.querySelector("#xml-file").onchange = async e => {
      const file = e.target.files[0]; if(!file) return; parsing();
      try { parsed = await parseHealthExport(file, p=>{ const b=body.querySelector("#bar"); if(b){b.style.width=p+"%"; body.querySelector("#pct").textContent=p+"%";} }); preview(); }
      catch(err){ alert("Couldn't parse: "+err.message); pick(); }
    };
  }
  // ── CSV preview / import ──────────────────────────────────────────────────
  function csvPreview() {
    if (!csvRows?.length) { pick(); return; }
    // Apply date range filter
    const filteredRows = csvRows.filter(r=>{
      if(csvDateFrom && r.date < csvDateFrom) return false;
      if(csvDateTo   && r.date > csvDateTo)   return false;
      return true;
    });
    const macroRows = filteredRows.filter(r=>r.calories||r.protein||r.carbs||r.fat||r.fiber||r.sugar);
    const weightRows = filteredRows.filter(r=>r.weight);
    const actRows = filteredRows.filter(r=>r.steps||r.activeCalories||r.basalCalories||r.restingHR||r.walkingHR||r.avgHeartRate||r.hrv||r.exerciseMinutes||r.flightsClimbed||r.standHours||r.distanceKm||r.distanceCyclingKm||r.vo2max||r.sleepHours);
    const existMacroK = new Set(state.macroLogs.map(m=>dayKey(m.date)));
    const conflicts = macroRows.filter(r=>existMacroK.has(r.date)).length;
    const newMacro = macroRows.length - conflicts;
    const dateRange = csvRows.length ? `${fmtShort(csvRows[0].date)} – ${fmtShort(csvRows[csvRows.length-1].date)}` : "";
    // Sample preview table (last 5 macro rows)
    const sampleRows = [...macroRows].slice(-5);
    const sampleTable = sampleRows.length ? `
      <div style="overflow-x:auto;margin-top:10px">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <tr>${["Date","Cal","Pro","Carbs","Fat","Active","Steps","RHR","HRV"].map(h=>`<th style="text-align:left;padding:4px 6px;color:var(--t4);font-size:10px;border-bottom:1px solid var(--border-sub);white-space:nowrap">${h}</th>`).join("")}</tr>
          ${sampleRows.map(r=>`<tr>${[fmtShort(r.date),r.calories||"—",(r.protein!=null?r.protein+"g":"—"),(r.carbs!=null?r.carbs+"g":"—"),(r.fat!=null?r.fat+"g":"—"),(r.activeCalories||"—"),(r.steps!=null?r.steps.toLocaleString():"—"),(r.restingHR!=null?r.restingHR+" bpm":"—"),(r.hrv!=null?r.hrv+" ms":"—")].map(v=>`<td style="padding:4px 6px;color:var(--t2);border-bottom:1px solid var(--surface-2);white-space:nowrap">${v}</td>`).join("")}</tr>`).join("")}
        </table>
      </div>` : "";
    const conflictPill = k => `<button class="csv-cm" data-cm="${k}" style="padding:5px 11px;border-radius:99px;font-size:11px;font-weight:600;border:1px solid ${csvConflictMode===k?"#F9C87D":"var(--border-sub)"};background:${csvConflictMode===k?"#F9C87D22":"transparent"};color:${csvConflictMode===k?"#F9C87D":"var(--t4)"}">${{skip:"Skip existing",replace:"Replace existing","merge":"Merge missing only"}[k]}</button>`;
    // Activity conflict stats (per-metric: only check non-workout logs)
    const existActLogs = state.activityLogs.filter(a=>!a.isWorkout);
    const actConflicts = actRows.filter(r=>existActLogs.some(a=>dayKey(a.date)===r.date)).length;
    const newAct = actRows.length - actConflicts;
    const newWeight = weightRows.filter(r=>!new Set(state.weightLogs.map(w=>dayKey(w.date))).has(r.date)).length;
    const conflictPillAct = k => `<button class="csv-cam" data-cm="${k}" style="padding:5px 11px;border-radius:99px;font-size:11px;font-weight:600;border:1px solid ${csvActivityConflictMode===k?"#7DF9C0":"var(--border-sub)"};background:${csvActivityConflictMode===k?"#7DF9C022":"transparent"};color:${csvActivityConflictMode===k?"#7DF9C0":"var(--t4)"}">${{skip:"Skip existing",replace:"Replace existing",merge:"Merge missing only"}[k]}</button>`;
    const sectionCard = (key,label,col,total,isNew,conflictCount,conflictPills,extra)=>total?`
      <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:12px 14px;margin-bottom:8px">
        <div class="csv-row" data-k="${key}" style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:${conflictCount?"10px":"0"}">
          <div style="width:14px;height:14px;border-radius:4px;flex-shrink:0;background:${csvSel[key]?col:"transparent"};border:2px solid ${csvSel[key]?col:"#444"}"></div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--t2)">${label}</div>
          <div style="font-size:11px;color:var(--t4);margin-top:2px">${total} days · <span style="color:#7DF9C0">${isNew} new</span>${conflictCount?` · <span style="color:#F9C87D">${conflictCount} conflict${conflictCount>1?"s":""}</span>`:""}</div></div>
        </div>
        ${conflictCount?`<div style="font-size:10px;color:var(--t5);margin-bottom:6px">CONFLICT HANDLING</div><div style="display:flex;gap:6px;flex-wrap:wrap">${conflictPills}</div>`:""}
        ${extra||""}
      </div>`:"";
    body.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <button id="bp" style="color:var(--t4);font-size:20px;padding:2px 8px">‹</button>
        <span class="mono" style="font-size:13px;color:#7DF9C0;letter-spacing:1.5px">CSV PREVIEW</span>
      </div>
      <div style="background:#7DF9C011;border:1px solid #7DF9C033;border-radius:10px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:var(--t3)">
        <b style="color:#7DF9C0">${filteredRows.length}</b> of ${csvRows.length} days · <span style="font-size:11px;color:var(--t5)">${importFileName||"aggregate CSV"}</span>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
          <span style="font-size:10px;color:var(--t4)">Import range:</span>
          <input type="date" id="csv-from" class="inp" value="${csvDateFrom}" style="flex:1;min-width:0;font-size:11px;padding:4px 8px" placeholder="From">
          <span style="font-size:11px;color:var(--t5)">–</span>
          <input type="date" id="csv-to" class="inp" value="${csvDateTo}" style="flex:1;min-width:0;font-size:11px;padding:4px 8px" placeholder="To">
          ${csvDateFrom||csvDateTo?`<button id="csv-clearrange" style="font-size:10px;color:var(--t4);border:1px solid var(--border-sub);border-radius:6px;padding:3px 8px">Clear</button>`:""}
        </div>
      </div>
      ${sectionCard("macros","Dietary Macros","#F9C87D",macroRows.length,newMacro,conflicts,["skip","replace","merge"].map(conflictPill).join(""),sampleTable)}
      ${(() => {
        const hrvRows = actRows.filter(r=>r.hrv!=null);
        if (!hrvRows.length) return sectionCard("activity","Steps & Activity (daily totals)","#7DF9C0",actRows.length,newAct,actConflicts,["skip","replace","merge"].map(conflictPillAct).join(""),"");
        const totalRawReadings = hrvRows.reduce((a,r)=>a+(r.hrvSampleCount||1),0);
        const hrvRange = `${fmtShort(hrvRows[0].date)} – ${fmtShort(hrvRows[hrvRows.length-1].date)}`;
        const hrvSample = hrvRows.slice(0,5).map(r=>`<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--t3);padding:3px 0"><span>${esc(fmtShort(r.date))}</span><span>${r.hrv} ms</span><span style="color:var(--t5)">${r.hrvSampleCount||1} reading${(r.hrvSampleCount||1)===1?"":"s"}</span></div>`).join("");
        const hrvBlock = `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border-sub)">
          <div style="font-size:12px;font-weight:600;color:#7DD4F9;margin-bottom:4px">❤️ HRV (SDNN) detected</div>
          <div style="font-size:11px;color:var(--t4);margin-bottom:8px">${totalRawReadings} raw readings across ${hrvRows.length} calendar day${hrvRows.length===1?"":"s"} · ${esc(hrvRange)}</div>
          ${hrvSample}
        </div>`;
        return sectionCard("activity","Steps & Activity (daily totals)","#7DF9C0",actRows.length,newAct,actConflicts,["skip","replace","merge"].map(conflictPillAct).join(""),hrvBlock);
      })()}
      ${sectionCard("weight","Body Weight","#8AB4FF",weightRows.length,newWeight,0,"","")}
      ${macroRows.length||weightRows.length||actRows.length?`<button id="csv-imp" class="btn-primary" style="background:#7DF9C0;margin-top:8px">IMPORT SELECTED</button>`:""}`;
    body.querySelector("#bp").onclick = pick;
    body.querySelectorAll(".csv-row").forEach(row=>row.onclick=e=>{ if(e.target.closest(".csv-cm,.csv-cam")) return; const k=row.dataset.k; csvSel[k]=!csvSel[k]; csvPreview(); });
    body.querySelectorAll(".csv-cm").forEach(btn=>btn.onclick=e=>{ e.stopPropagation(); csvConflictMode=btn.dataset.cm; csvPreview(); });
    body.querySelectorAll(".csv-cam").forEach(btn=>btn.onclick=e=>{ e.stopPropagation(); csvActivityConflictMode=btn.dataset.cm; csvPreview(); });
    const cfrom=body.querySelector("#csv-from"); if(cfrom) cfrom.onchange=()=>{ csvDateFrom=cfrom.value; csvPreview(); };
    const cto=body.querySelector("#csv-to"); if(cto) cto.onchange=()=>{ csvDateTo=cto.value; csvPreview(); };
    const ccr=body.querySelector("#csv-clearrange"); if(ccr) ccr.onclick=()=>{ csvDateFrom=""; csvDateTo=""; csvPreview(); };
    const imp=body.querySelector("#csv-imp"); if(imp) imp.onclick=csvDoImport;
  }
  function csvDoImport() {
    if (!csvRows?.length) return;
    const filteredImport = csvRows.filter(r=>{
      if(csvDateFrom && r.date < csvDateFrom) return false;
      if(csvDateTo   && r.date > csvDateTo)   return false;
      return true;
    });
    const macroRows=filteredImport.filter(r=>r.calories||r.protein||r.carbs||r.fat||r.fiber||r.sugar);
    const weightRows=filteredImport.filter(r=>r.weight);
    const actRows=filteredImport.filter(r=>r.steps||r.activeCalories||r.basalCalories||r.restingHR||r.walkingHR||r.avgHeartRate||r.hrv||r.exerciseMinutes||r.flightsClimbed||r.standHours||r.distanceKm||r.distanceCyclingKm||r.vo2max||r.sleepHours);
    const meta={sourceType:"aggregate_csv",importBatchId,importedAt,importSource:importFileName};
    const existWK=new Set(state.weightLogs.map(w=>dayKey(w.date)));
    const ACT_FIELDS=['steps','activeCalories','basalCalories','exerciseMinutes','flightsClimbed','standHours','standMinutes','distanceKm','distanceCyclingKm','avgHeartRate','restingHR','walkingHR','hrv','hrvSampleCount','hrvMetric','bodyFat','vo2max','sleepHours'];
    let imported=0, replaced=0, merged=0, skipped=0;
    // Macros — with conflict mode
    if (csvSel.macros) {
      macroRows.forEach(row=>{
        const dk=row.date;
        const idx=state.macroLogs.findIndex(m=>dayKey(m.date)===dk);
        if (idx===-1) {
          state.macroLogs.push({id:uid(),date:dk+"T12:00:00",...meta,calories:row.calories,protein:row.protein,carbs:row.carbs,fat:row.fat,notes:"Health Auto Export"});
          imported++;
        } else if (csvConflictMode==="replace") {
          state.macroLogs[idx]={...state.macroLogs[idx],...meta,calories:row.calories,protein:row.protein,carbs:row.carbs,fat:row.fat};
          replaced++;
        } else if (csvConflictMode==="merge") {
          const ex=state.macroLogs[idx];
          if(!ex.calories&&row.calories) ex.calories=row.calories;
          if(!ex.protein&&row.protein) ex.protein=row.protein;
          if(!ex.carbs&&row.carbs) ex.carbs=row.carbs;
          if(!ex.fat&&row.fat) ex.fat=row.fat;
          merged++;
        } else { skipped++; }
      });
    }
    // Weight — skip existing dates
    if (csvSel.weight) weightRows.filter(r=>!existWK.has(r.date)).forEach(r=>{
      state.weightLogs.push({id:uid(),date:r.date+"T12:00:00",...meta,weight:String(r.weight),notes:"Health Auto Export"});
      imported++;
    });
    // Activity — PER-METRIC conflict handling (not date-level)
    if (csvSel.activity) {
      actRows.forEach(row=>{
        const dk=row.date;
        const existing=state.activityLogs.find(a=>dayKey(a.date)===dk&&!a.isWorkout);
        if (!existing) {
          const e={id:uid(),date:dk+"T12:00:00",...meta};
          ACT_FIELDS.forEach(k=>{if(row[k]!=null)e[k]=row[k];});
          state.activityLogs.push(e); imported++;
        } else if (csvActivityConflictMode==="replace") {
          ACT_FIELDS.forEach(k=>{if(row[k]!=null)existing[k]=row[k];});
          Object.assign(existing,meta); replaced++;
        } else if (csvActivityConflictMode==="merge") {
          // Only fill in fields that are null/undefined in existing record
          ACT_FIELDS.forEach(k=>{if(row[k]!=null&&existing[k]==null)existing[k]=row[k];});
          merged++;
        } else { skipped++; }
      });
    }
    saveState();
    const parts=[imported&&`${imported} added`,replaced&&`${replaced} replaced`,merged&&`${merged} merged`,skipped&&`${skipped} skipped`].filter(Boolean);
    body.innerHTML=`<div style="text-align:center;padding:30px 0"><div style="font-size:48px;margin-bottom:12px">✓</div><div style="font-size:15px;color:#7DF9C0;font-weight:700;margin-bottom:8px">Import complete</div><div style="font-size:12px;color:var(--t4);line-height:1.6">${parts.join(" · ")}</div><div style="font-size:11px;color:var(--t5);margin-top:8px;color:#A78BFA">Batch ID: ${String(importBatchId).slice(0,8)}</div></div><button id="done" class="btn-primary" style="background:#7DF9C0;margin-top:8px">DONE</button>`;
    body.querySelector("#done").onclick=()=>{closeModal();render();};
  }
  // ── Workout preview / import ──────────────────────────────────────────────
  function workoutPreview() {
    if (!workoutRows?.length) { pick(); return; }
    const byType = {};
    workoutRows.forEach(r=>{ (byType[r.activity]=byType[r.activity]||[]).push(r); });
    const existDates = new Set(state.activityLogs.map(a=>dayKey(a.date)));
    const newCount = workoutRows.filter(r=>!existDates.has(r.date)).length;
    const typeRows = Object.entries(byType).sort((a,b)=>b[1].length-a[1].length);
    const dateRange = workoutRows.length ? `${fmtShort(workoutRows[0].date)} – ${fmtShort(workoutRows[workoutRows.length-1].date)}` : "";
    const sampleRows = [...workoutRows].slice(-5);
    const sampleTable = `<div style="overflow-x:auto;margin-top:10px">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <tr>${["Date","Activity","Duration","Cal","Avg HR","Max HR"].map(h=>`<th style="text-align:left;padding:4px 6px;color:var(--t4);font-size:10px;border-bottom:1px solid var(--border-sub);white-space:nowrap">${h}</th>`).join("")}</tr>
        ${sampleRows.map(r=>`<tr>${[fmtShort(r.date),r.activity||"—",r.durationMin!=null?r.durationMin+"min":"—",r.activeCalories||"—",r.avgHR!=null?r.avgHR+" bpm":"—",r.maxHR!=null?r.maxHR+" bpm":"—"].map(v=>`<td style="padding:4px 6px;color:var(--t2);border-bottom:1px solid var(--surface-2);white-space:nowrap">${v}</td>`).join("")}</tr>`).join("")}
      </table></div>`;
    body.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <button id="bp" style="color:var(--t4);font-size:20px;padding:2px 8px">‹</button>
        <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">WORKOUTS PREVIEW</span>
      </div>
      <div style="background:#A78BFA11;border:1px solid #A78BFA33;border-radius:10px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:var(--t3)">
        <b style="color:#A78BFA">${workoutRows.length}</b> sessions · ${dateRange} · <span style="color:#7DF9C0">${newCount} new</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${typeRows.map(([t,rs])=>`<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:8px;padding:5px 10px;font-size:11px;color:var(--t3)"><b style="color:var(--t2)">${esc(t)}</b> <span style="color:var(--t4)">${rs.length}×</span></div>`).join("")}
      </div>
      ${sampleTable}
      <button id="wk-imp" class="btn-primary" style="background:#A78BFA;margin-top:12px">IMPORT WORKOUTS</button>`;
    body.querySelector("#bp").onclick=pick;
    body.querySelector("#wk-imp").onclick=workoutDoImport;
  }
  function workoutDoImport() {
    if (!workoutRows?.length) return;
    const workoutMeta={sourceType:"workout_csv",isWorkout:true,importBatchId,importedAt,importSource:importFileName};
    let added=0, skipped=0;
    workoutRows.forEach(r=>{
      // Workouts can stack on same day — use startTime as unique key
      const key=r.startTime||r.date;
      const alreadyHas=state.activityLogs.some(a=>(a.workoutStart||a.date)===key&&a.isWorkout);
      if(alreadyHas){ skipped++; return; }
      // Workout calories stored as workoutActiveCalories — NOT activeCalories
      // This prevents workout session data from polluting daily aggregate energy stats
      const e={id:uid(),date:r.date+"T12:00:00",...workoutMeta,workoutStart:r.startTime,workoutEnd:r.endTime,workoutType:r.activity};
      if(r.activeCalories!=null) e.workoutActiveCalories=r.activeCalories; // isolated from daily aggregate
      ['durationMin','distanceKm','avgHR','maxHR','mets','hrZone1','hrZone2','hrZone3','hrZone4','hrZone5'].forEach(k=>{if(r[k]!=null)e[k]=r[k];});
      state.activityLogs.push(e); added++;
    });
    saveState();
    body.innerHTML=`<div style="text-align:center;padding:30px 0"><div style="font-size:48px;margin-bottom:12px">✓</div><div style="font-size:15px;color:#A78BFA;font-weight:700;margin-bottom:8px">Workouts imported</div><div style="font-size:12px;color:var(--t4)">${added} added · ${skipped} already existed</div></div><button id="done" class="btn-primary" style="background:#A78BFA;margin-top:8px">DONE</button>`;
    body.querySelector("#done").onclick=()=>{closeModal();render();};
  }


  function parsing() {
    body.innerHTML = `<div style="text-align:center;padding:20px 0 10px;color:var(--t3);font-size:13px;margin-bottom:16px">Parsing your Health data…</div>
      <div style="background:var(--surface-2);border-radius:99px;height:8px;overflow:hidden"><div id="bar" style="height:100%;width:0;background:linear-gradient(90deg,#7DF9C0,#FF6B6B);border-radius:99px;transition:width .3s"></div></div>
      <div id="pct" class="mono" style="text-align:center;margin-top:10px;font-size:12px;color:var(--t4)">0%</div>`;
  }
  function countNew(arr, existing, keyf) { const ek=new Set(existing.map(keyf)); return arr.filter(r=>!ek.has(dayKey(r.date))).length; }
  function preview() {
    const rows = [
      ["weight","Body weight","#8AB4FF",parsed.weight,state.weightLogs],
      ["steps","Steps","#7DF9C0",parsed.steps,state.activityLogs],
      ["activeCalories","Active calories","#F9C87D",parsed.activeCalories,state.activityLogs],
      ["restingHR","Resting heart rate","#FF9CC8",parsed.restingHR,state.activityLogs],
      ["waist","Waist circumference","#C8FF9C",parsed.waist,state.measurementLogs],
    ].filter(r=>r[3].length>0);
    // Set default macro source on first preview render
    if(!macroSource && parsed.macroSources?.length) macroSource=parsed.macroSources[0];
    // Build macro section
    const hasMacros=(parsed.macroSources||[]).length>0;
    const srcData=hasMacros?(parsed.macroBySrc||{})[macroSource]||{}:{};
    const newMacroDays=srcData.calories?countNew(srcData.calories,state.macroLogs,x=>dayKey(x.date)):0;
    const macroSection=hasMacros?`
      <div style="margin-bottom:8px;border-radius:10px;background:${sel.macros?"#F9C87D11":"var(--surface-2)"};border:1px solid ${sel.macros?"#F9C87D44":"var(--border)"}">
        <div class="hrow" data-k="macros" style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;cursor:pointer">
          <div class="hbox" style="width:14px;height:14px;border-radius:4px;flex-shrink:0;margin-top:2px;background:${sel.macros?"#F9C87D":"transparent"};border:2px solid ${sel.macros?"#F9C87D":"#444"}"></div>
          <div style="flex:1">
            <div style="font-size:13px;color:var(--t2);font-weight:600">Dietary Macros</div>
            <div style="font-size:11px;color:var(--t4);margin-top:2px">${srcData.calories?.length||0} days from <b style="color:#F9C87D">${macroSource||"—"}</b> · <span style="color:#F9C87D">${newMacroDays} new days</span></div>
            ${parsed.macroSources.length>1?`<div style="font-size:10px;color:var(--t5);margin-top:6px;margin-bottom:4px">NUTRITION SOURCE</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap">
              ${parsed.macroSources.map(src=>`<button class="macro-src-btn" data-src="${esc(src)}" style="padding:4px 9px;border-radius:99px;font-size:11px;font-weight:600;border:1px solid ${macroSource===src?"#F9C87D":"var(--border-sub)"};background:${macroSource===src?"#F9C87D22":"transparent"};color:${macroSource===src?"#F9C87D":"var(--t4)"}">${esc(src)}</button>`).join("")}
            </div>`:""}
            <div style="font-size:10px;color:var(--t5);margin-top:8px;line-height:1.5">Only one source is imported per day to prevent double-counting. Apple Health may contain duplicate nutrition data when multiple apps write to it.</div>
          </div>
        </div>
      </div>`:""
    ;
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><span class="mono" style="font-size:13px;color:#FF6B6B;letter-spacing:1.5px">FOUND DATA</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
      <div class="hint" style="margin-bottom:14px">Select what to import. New days only are added — existing logs are preserved.</div>
      ${rows.length||hasMacros?[...rows.map(([k,l,col,arr,exist])=>`
        <div class="hrow" data-k="${k}" style="display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;margin-bottom:8px;background:${sel[k]?col+"11":"var(--surface-2)"};border:1px solid ${sel[k]?col+"44":"var(--border)"}">
          <div class="hbox" style="width:14px;height:14px;border-radius:4px;background:${sel[k]?col:"transparent"};border:2px solid ${sel[k]?col:"#444"}"></div>
          <div style="flex:1"><div style="font-size:13px;color:var(--t2);font-weight:600">${l}</div><div style="font-size:11px;color:var(--t4)">${arr.length.toLocaleString()} records · <span style="color:${col}">${countNew(arr,exist,x=>dayKey(x.date)).toLocaleString()} new</span></div></div>
        </div>`),macroSection].join(""):`<div style="color:var(--t4);font-size:13px;text-align:center;padding:16px 0">No supported data types found.</div>`}
      ${rows.length||hasMacros?`<button id="imp" class="btn-primary" style="background:#FF6B6B;margin-top:8px">IMPORT SELECTED</button>`:""}`;
    body.querySelector("#x").onclick = closeModal;
    body.querySelectorAll(".hrow").forEach(row => row.onclick = e => {
      // Don't toggle the row when clicking a source button inside it
      if(e.target.closest(".macro-src-btn")) return;
      const k=row.dataset.k;
      if(k==="macros"){
        sel.macros=!sel.macros;
        preview(); // re-render to update macro section styling
        return;
      }
      sel[k]=!sel[k]; const col=rows.find(r=>r[0]===k)[2];
      row.style.background=sel[k]?col+"11":"var(--surface-2)"; row.style.border=`1px solid ${sel[k]?col+"44":"var(--border)"}`;
      const box=row.querySelector(".hbox"); box.style.background=sel[k]?col:"transparent"; box.style.border=`2px solid ${sel[k]?col:"#444"}`;
    });
    body.querySelectorAll(".macro-src-btn").forEach(btn => btn.onclick = e => {
      e.stopPropagation();
      macroSource=btn.dataset.src;
      preview(); // re-render with new source selection
    });
    const imp = body.querySelector("#imp"); if (imp) imp.onclick = doImport;
  }
  function doImport() {
    const wk=new Set(state.weightLogs.map(w=>dayKey(w.date)));
    const waistK=new Set(state.measurementLogs.map(x=>dayKey(x.date)));
    const ak=new Set(state.activityLogs.map(a=>dayKey(a.date)));
    const existMacroK=new Set(state.macroLogs.map(m=>dayKey(m.date))); // fix: was wrongly using measurementLogs
    if (sel.weight) parsed.weight.filter(r=>!wk.has(dayKey(r.date))).forEach(r=>state.weightLogs.push({id:uid(),date:r.date,weight:(r.unit==="kg"?(r.value*2.2046):r.value).toFixed(1),notes:"Apple Health"}));
    if (sel.waist) parsed.waist.filter(r=>!waistK.has(dayKey(r.date))).forEach(r=>state.measurementLogs.push({id:uid(),date:r.date,waist:(r.unit==="cm"?(r.value/2.54):r.unit==="m"?(r.value*39.37):r.value).toFixed(1),notes:"Apple Health"}));
    // Macros: import from selected source only — no cross-source summing
    if(sel.macros && macroSource && parsed.macroBySrc?.[macroSource]){
      const src=parsed.macroBySrc[macroSource];
      const macroByDay={};
      ["calories","protein","carbs","fat"].forEach(k=>{
        (src[k]||[]).forEach(r=>{const dk=dayKey(r.date);if(!macroByDay[dk])macroByDay[dk]={date:r.date+"T12:00:00"};macroByDay[dk][k]=r.value;});
      });
      Object.values(macroByDay).forEach(rec=>{
        if(!existMacroK.has(dayKey(rec.date))) state.macroLogs.push({id:uid(),...rec,notes:"Apple Health · "+macroSource});
      });
    }
    parsed.steps.filter(r=>!ak.has(dayKey(r.date))).forEach(r=>{
      const cal=parsed.activeCalories.find(c=>dayKey(c.date)===dayKey(r.date)); const hr=parsed.restingHR.find(x=>dayKey(x.date)===dayKey(r.date));
      const e={id:uid(),date:r.date}; if(sel.steps)e.steps=r.value; if(sel.activeCalories&&cal)e.activeCalories=cal.value; if(sel.restingHR&&hr)e.restingHR=hr.value;
      if(e.steps||e.activeCalories||e.restingHR) state.activityLogs.push(e);
    });
    saveState();
    body.innerHTML = `<div style="text-align:center;padding:30px 0"><div style="font-size:48px;margin-bottom:12px">✓</div><div style="font-size:15px;color:#7DF9C0;font-weight:700;margin-bottom:8px">Import complete</div><div style="font-size:12px;color:var(--t4)">Check Trends to see it overlaid on your cycle.</div></div><button id="done" class="btn-primary" style="background:#7DF9C0">DONE</button>`;
    body.querySelector("#done").onclick = () => { closeModal(); render(); };
  }
  function manageImports() {
    // Helper: detect import fingerprint even without importBatchId
    const inferSrc = r => {
      if (r.sourceType) return r.sourceType;
      const n = r.notes||r.note||"";
      if (n.includes("Apple Health ·")) return "apple_health_xml";
      if (n === "Apple Health" || n === "Health Auto Export Apple Health") return "apple_health_xml";
      if (n === "Health Auto Export") return "aggregate_csv";
      if (r.isWorkout) return "workout_csv";
      return null; // manual entry — ignore
    };
    const isImported = r => r.importBatchId || inferSrc(r);

    // Collect all import records — tracked (have batchId) and legacy (have notes fingerprint)
    const allImported = [
      ...state.macroLogs.filter(isImported).map(r=>({...r,logType:"macros"})),
      ...state.weightLogs.filter(isImported).map(r=>({...r,logType:"weight"})),
      ...state.activityLogs.filter(isImported).map(r=>({...r,logType:"activity"})),
    ];

    // Group tracked records by batchId
    const batches = {};
    const legacy  = { apple_health_xml:{counts:{macros:0,weight:0,activity:0}}, aggregate_csv:{counts:{macros:0,weight:0,activity:0}}, workout_csv:{counts:{macros:0,weight:0,activity:0,workout:0}} };

    allImported.forEach(r => {
      if (r.importBatchId) {
        const k = r.importBatchId;
        if (!batches[k]) batches[k] = {batchId:k,sourceType:r.sourceType||inferSrc(r)||"unknown",importedAt:r.importedAt||"",importSource:r.importSource||"",counts:{macros:0,weight:0,activity:0,workout:0}};
        if (r.isWorkout) batches[k].counts.workout++;
        else batches[k].counts[r.logType]=(batches[k].counts[r.logType]||0)+1;
      } else {
        const src = inferSrc(r);
        if (src && legacy[src]) {
          if (r.isWorkout) legacy[src].counts.workout=(legacy[src].counts.workout||0)+1;
          else legacy[src].counts[r.logType]=(legacy[src].counts[r.logType]||0)+1;
        }
      }
    });

    const batchList = Object.values(batches).sort((a,b)=>b.importedAt.localeCompare(a.importedAt));
    const legacyEntries = Object.entries(legacy).filter(([,v])=>Object.values(v.counts).some(n=>n>0));
    const srcLabel = {aggregate_csv:"📊 Aggregate CSV",workout_csv:"🏋️ Workouts CSV",apple_health_xml:"📄 Apple Health XML",unknown:"❓ Unknown"};

    const isLegacyMatch = (r, srcType) => {
      if (r.importBatchId) return false; // tracked — handle via batch deletion
      return inferSrc(r) === srcType;
    };
    const deleteByBatch = bid => {
      const sidBid = String(bid); // data-bid attrs are strings; importBatchId is a number — compare as strings
      confirmAction("Delete this import batch? This cannot be undone.",()=>{
        state.macroLogs    = state.macroLogs.filter(r=>String(r.importBatchId)!==sidBid);
        state.weightLogs   = state.weightLogs.filter(r=>String(r.importBatchId)!==sidBid);
        state.activityLogs = state.activityLogs.filter(r=>String(r.importBatchId)!==sidBid);
        saveState(); render(); manageImports();
      });
    };
    const deleteByType = srcType => {
      const label = srcLabel[srcType]||srcType;
      confirmAction(`Delete all ${label} imports (tracked and legacy)? Manual entries are not affected.`,()=>{
        const match = r => r.sourceType===srcType || isLegacyMatch(r,srcType);
        state.macroLogs    = state.macroLogs.filter(r=>!match(r));
        state.weightLogs   = state.weightLogs.filter(r=>!match(r));
        state.activityLogs = state.activityLogs.filter(r=>!match(r));
        saveState(); render(); manageImports();
      });
    };

    const countStr = counts => Object.entries(counts).filter(([,n])=>n>0).map(([k,n])=>`${n} ${k}`).join(" · ");

    body.innerHTML=`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <button id="bp" style="color:var(--t4);font-size:20px;padding:2px 8px">‹</button>
        <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">MANAGE IMPORTS</span>
      </div>
      <div style="font-size:11px;color:var(--t4);line-height:1.5;margin-bottom:14px">Delete imported data by batch or source type. Manual entries are never affected.</div>

      ${batchList.length===0&&legacyEntries.length===0?`<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:20px;text-align:center;font-size:12px;color:var(--t4)">No imported records found.<br><span style="font-size:11px;color:var(--t5)">Import data via CSV or XML first.</span></div>`:""}

      ${batchList.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">TRACKED BATCHES</div>`:""}
      ${batchList.map(b=>{
        const dateStr = b.importedAt ? new Date(b.importedAt).toLocaleDateString("en-CA",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : "";
        return `<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:12px 14px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:11px;color:var(--t2);font-weight:600">${srcLabel[b.sourceType]||b.sourceType}</span>
            <span style="font-size:10px;color:var(--t5)">${dateStr}</span>
          </div>
          <div style="font-size:11px;color:var(--t4);margin-bottom:8px">${countStr(b.counts)}${b.importSource?` · <span style="color:var(--t5)">${esc(b.importSource)}</span>`:""}</div>
          <button class="del-batch" data-bid="${esc(b.batchId)}" style="background:#FF7C7C18;border:1px solid #FF7C7C44;color:#FF7C7C;border-radius:7px;padding:5px 12px;font-size:11px">🗑 Delete this batch</button>
        </div>`;
      }).join("")}

      ${legacyEntries.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin:${batchList.length?"14px":0} 0 8px">LEGACY IMPORTS (no batch tracking)</div>
      <div style="font-size:11px;color:var(--t5);line-height:1.5;margin-bottom:10px">These were imported before batch tracking was added. They can still be deleted by type below.</div>`:""}
      ${legacyEntries.map(([srcType,v])=>`
        <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:10px">
          <div style="flex:1">
            <div style="font-size:12px;font-weight:600;color:var(--t2)">${srcLabel[srcType]||srcType}</div>
            <div style="font-size:11px;color:var(--t4);margin-top:2px">${countStr(v.counts)}</div>
          </div>
          <button class="del-type" data-type="${srcType}" style="background:#FF7C7C18;border:1px solid #FF7C7C44;color:#FF7C7C;border-radius:7px;padding:5px 10px;font-size:11px;white-space:nowrap">🗑 Delete all</button>
        </div>`).join("")}

      ${batchList.length||legacyEntries.length?`<div style="margin-top:14px;border-top:1px solid var(--border-sub);padding-top:14px">
        <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">DELETE ALL BY TYPE</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${["apple_health_xml","aggregate_csv","workout_csv"].map(t=>`<button class="del-type" data-type="${t}" style="background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font-size:12px;color:var(--t3);text-align:left">🗑 Delete all ${srcLabel[t]} imports</button>`).join("")}
        </div>
      </div>`:""}`;

    body.querySelector("#bp").onclick = pick;
    body.querySelectorAll(".del-batch").forEach(b=>b.onclick=()=>deleteByBatch(b.dataset.bid));
    body.querySelectorAll(".del-type").forEach(b=>b.onclick=()=>deleteByType(b.dataset.type));
  }

  pick();
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function weightChart(logs, unit, period, expanded) {
  let filtered = [...logs].sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (period && period !== "all") {
    const days = period==="1M"?30:period==="3M"?90:180;
    const cutoff = Date.now() - days*86400000;
    filtered = filtered.filter(w=>new Date(w.date).getTime()>=cutoff);
  }
  if(filtered.length<2) return `<div style="color:var(--t4);font-size:12px;text-align:center;padding:16px 0">Log at least 2 weigh-ins to see your trend.</div>`;
  const W=480,H=expanded?320:130,pad=expanded?36:28;
  const xs=filtered.map(d=>new Date(d.date).getTime());
  const ys=filtered.map(d=>parseFloat(d.weight));
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),rY=(maxY-minY)||1;
  const px=t=>pad+((t-minX)/((maxX-minX)||1))*(W-pad*2), py=v=>pad+(1-(v-minY)/rY)*(H-pad*2);
  const path=filtered.map((d,i)=>`${i?"L":"M"} ${px(xs[i])} ${py(ys[i])}`).join(" ");
  const first=ys[0],last=ys[ys.length-1],ch=(last-first).toFixed(1);
  const goalW = parseFloat(state.profile.goalWeight||0);
  const distGoal = goalW ? (last-goalW).toFixed(1) : null;
  const weeks = filtered.length>1 ? Math.max(1,(new Date(filtered[filtered.length-1].date)-new Date(filtered[0].date))/86400000/7) : 1;
  const weeklyAvg = filtered.length>1 ? ((last-first)/weeks).toFixed(1) : null;
  return `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:12px">
    ${[["CHANGE",(ch>0?"+":"")+ch+" "+unit,ch<=0?"#7DF9C0":"#ff9c5c"],
       ["FROM GOAL",distGoal!=null?(distGoal>0?"+":"")+distGoal+" "+unit:"—",distGoal!=null&&distGoal<=0?"#7DF9C0":"#ff9c5c"],
       ["WEEKLY AVG",weeklyAvg?(weeklyAvg>0?"+":"")+weeklyAvg+" "+unit:"—",weeklyAvg&&weeklyAvg<=0?"#7DF9C0":"#ff9c5c"],
       ["ENTRIES",filtered.length,"#ccc"]].map(([l,v,col])=>`<div style="background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;padding:10px 12px"><div style="font-size:14px;font-weight:700;color:${col}">${v}</div><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-top:3px">${l}</div></div>`).join("")}
  </div>
  <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto"><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8AB4FF" stop-opacity="0.3"/><stop offset="100%" stop-color="#8AB4FF" stop-opacity="0"/></linearGradient></defs>
    <path d="${path} L ${px(maxX)} ${H-pad} L ${px(minX)} ${H-pad} Z" fill="url(#wg)"/>
    <path d="${path}" fill="none" stroke="#8AB4FF" stroke-width="2" stroke-linejoin="round"/>
    ${filtered.map((d,i)=>`<circle cx="${px(xs[i])}" cy="${py(ys[i])}" r="2.5" fill="#8AB4FF"/>`).join("")}
    ${goalW&&goalW>=minY&&goalW<=maxY?`<line x1="${pad}" y1="${py(goalW)}" x2="${W-pad}" y2="${py(goalW)}" stroke="#7DF9C0" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/><text x="${W-pad+2}" y="${py(goalW)+4}" fill="#7DF9C0" font-size="8" font-family="monospace">goal</text>`:""}
  </svg>`;
}

function measureChart(logs, unit, expanded) {
  const present=MEASURES.filter(([k])=>logs.some(l=>l[k]!=null&&l[k]!==""));
  if(logs.length<2||!present.length) return emptyState("No measurement trend yet", "Log at least 2 measurement entries to start seeing how your body composition changes over time.");
  const s=[...logs].sort((a,b)=>new Date(a.date)-new Date(b.date)); const W=480,H=expanded?320:130,pad=expanded?36:26;
  const xs=s.map(d=>new Date(d.date).getTime()),minX=Math.min(...xs),maxX=Math.max(...xs);
  const vals=s.flatMap(l=>present.map(([k])=>parseFloat(l[k])).filter(v=>!isNaN(v))); const minY=Math.min(...vals),maxY=Math.max(...vals),rY=(maxY-minY)||1;
  const px=t=>pad+((t-minX)/((maxX-minX)||1))*(W-pad*2),py=v=>pad+(1-(v-minY)/rY)*(H-pad*2);
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">${present.map(([k,l,col])=>{const pts=s.filter(x=>x[k]!=null&&x[k]!=="");const path=pts.map((x,i)=>`${i?"L":"M"} ${px(new Date(x.date).getTime())} ${py(parseFloat(x[k]))}`).join(" ");return `<path d="${path}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`+pts.map(x=>`<circle cx="${px(new Date(x.date).getTime())}" cy="${py(parseFloat(x[k]))}" r="2.5" fill="${col}"/>`).join("");}).join("")}</svg>
  <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:8px">${present.map(([k,l,col])=>{const pts=s.filter(x=>x[k]!=null&&x[k]!=="");const ch=(parseFloat(pts[pts.length-1][k])-parseFloat(pts[0][k])).toFixed(1);return `<div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:3px;background:${col};border-radius:2px;display:inline-block"></span><span style="font-size:11px;color:var(--t3)">${l} <b style="color:${ch<=0?"#7DF9C0":"#ff9c5c"}">${ch>0?"+":""}${ch} ${unit}</b></span></div>`;}).join("")}</div>`;
}
function escalationChart(doses, c) {
  // Each x coordinate represents elapsed calendar time, not an equally spaced dose number.
  const e=(doses||[]).filter(d=>d.date&&Number.isFinite(Number(d.dose))&&Number(d.dose)>=0)
    .slice().sort((a,b)=>safeDate(a.date)-safeDate(b.date));
  if(!e.length)return `<div class="nx-chart-empty">No dated doses recorded yet.</div>`;
  const values=e.map(d=>Number(d.dose));
  const dates=e.map(d=>safeDate(d.date).getTime());
  const W=520,H=182,L=43,R=16,T=19,B=37;
  const minT=Math.min(...dates),maxT=Math.max(...dates),spanT=Math.max(86400000,maxT-minT);
  const minV=Math.min(0,...values),maxV=Math.max(...values);
  const yMax=maxV>0?maxV*1.18:1;
  const x=t=>L+(t-minT)/spanT*(W-L-R);
  const y=v=>T+(1-(v-minV)/(yMax-minV))*(H-T-B);
  const color=c.color||'#A78BFA';
  let path=`M ${x(dates[0]).toFixed(1)} ${y(values[0]).toFixed(1)}`;
  for(let i=1;i<e.length;i++)path+=` L ${x(dates[i]).toFixed(1)} ${y(values[i-1]).toFixed(1)} L ${x(dates[i]).toFixed(1)} ${y(values[i]).toFixed(1)}`;
  const dateFmt=t=>new Date(t).toLocaleDateString('en-CA',{month:'short',day:'numeric'});
  const ticks=[0,0.5,1].map(f=>{
    const v=minV+(yMax-minV)*f, yy=y(v);
    return `<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="var(--border-sub)" stroke-width="1"/>
    <text x="${L-7}" y="${yy+3}" text-anchor="end" fill="var(--t4)" font-size="10">${Number(v.toFixed(2))}</text>`;
  }).join('');
  const lastIndex=e.length-1;
  const dots=e.map((d,i)=>{
    const change=i>0&&values[i]!==values[i-1];
    if(!change&&i!==0&&i!==lastIndex)return '';
    const title=`${dateFmt(dates[i])}: ${values[i]} ${c.unit||''}${change?' (dose changed)':''}`;
    return `<circle cx="${x(dates[i])}" cy="${y(values[i])}" r="${change?5:3.5}" fill="${color}" stroke="var(--surface)" stroke-width="2"><title>${esc(title)}</title></circle>`;
  }).join('');
  const firstDate=dateFmt(minT),lastDate=dateFmt(maxT);
  const changeCount=values.reduce((n,v,i)=>n+(i>0&&v!==values[i-1]?1:0),0);
  return `<div class="nx-chart-block">
    <div class="nx-chart-meta"><span>Recorded dose · ${esc(c.unit||'units')}</span><span>${e.length} entries · ${changeCount} changes</span></div>
    <svg role="img" aria-label="Recorded doses by calendar date from ${esc(firstDate)} to ${esc(lastDate)}. ${e.length} doses and ${changeCount} dose changes." viewBox="0 0 ${W} ${H}" class="nx-dose-chart">
      ${ticks}<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
      <text x="${L}" y="${H-12}" fill="var(--t4)" font-size="11">${esc(firstDate)}</text>
      <text x="${W-R}" y="${H-12}" fill="var(--t4)" text-anchor="end" font-size="11">${esc(lastDate)}</text>
    </svg>
    <div class="nx-chart-note">Horizontal distance represents elapsed time. Vertical steps mark changes in logged dose, not changes in blood concentration. Tap a marked point for its recorded date and amount where supported.</div>
  </div>`;
}
function supplementCorrelation(compoundName, doses, suppLogs, dailyLogs) {
  if(!suppLogs.length || !dailyLogs.length) return "";
  // Find all supplements logged while this compound was active
  if(!doses.length) return "";
  const firstDoseDate = [...doses].sort((a,b)=>safeDate(a.date)-safeDate(b.date))[0].date;
  // Supplement adherence days
  const suppDays = new Set(suppLogs.map(s=>dayKey(s.date)));
  // Build: for each supplement, compare symptom rates on days taken vs not taken
  const allSupps = [...new Set(suppLogs.flatMap(s=>s.taken||[]))];
  if(!allSupps.length) return "";
  // Get symptom logs after protocol start
  const logs = dailyLogs.filter(l=>dayKey(l.date)>=dayKey(firstDoseDate));
  if(logs.length < 3) return "";
  const rows = allSupps.map(supp=>{
    const takenDays = suppLogs.filter(s=>(s.taken||[]).includes(supp)).map(s=>dayKey(s.date));
    const takenSet = new Set(takenDays);
    const logsWithSupp = logs.filter(l=>takenSet.has(dayKey(l.date)));
    const logsWithout  = logs.filter(l=>!takenSet.has(dayKey(l.date)));
    if(!logsWithSupp.length||!logsWithout.length) return null;
    // Count symptom occurrences per day
    const symRate = arr => {
      const total = arr.reduce((a,l)=>(a+(l.symptoms||[]).length),0);
      return arr.length ? (total/arr.length).toFixed(1) : "0";
    };
    const rateWith = symRate(logsWithSupp);
    const rateWithout = symRate(logsWithout);
    const diff = (parseFloat(rateWith)-parseFloat(rateWithout)).toFixed(1);
    const better = parseFloat(diff) < 0;
    return {supp, rateWith, rateWithout, diff, better, days:takenDays.length};
  }).filter(Boolean);
  if(!rows.length) return "";
  return `<div>
    <div style="font-size:10px;color:var(--t5);margin-bottom:10px">Avg symptoms/day: taken vs not taken</div>
    ${rows.map(r=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--surface-2)">
      <div style="flex:1;font-size:12px;color:var(--t2)">💊 ${esc(r.supp)}</div>
      <div style="font-size:11px;color:var(--t4)">${r.days}d logged</div>
      <div style="font-size:11px;color:#C8FF9C">With: ${r.rateWith}</div>
      <div style="font-size:11px;color:var(--t4)">Without: ${r.rateWithout}</div>
      <div style="font-size:11px;font-weight:700;color:${r.better?"#7DF9C0":"#ff7c7c"}">${r.better?"↓":"↑"}${Math.abs(parseFloat(r.diff))}</div>
    </div>`).join("")}
    <div style="font-size:10px;color:var(--t5);margin-top:8px">↓ fewer symptoms on days taken · ↑ more symptoms</div>
  </div>`;
}

function activityChart(activityLogs, doses, color) {
  if(activityLogs.length<3) return `<div style="color:var(--t4);font-size:12px;text-align:center;padding:12px 0">Import Apple Health step data to see activity patterns across your dose cycle.</div>`;
  // Exclude workout sessions — daily aggregate only for phase analysis
  const recent=[...activityLogs].filter(a=>!a.isWorkout).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-90);
  const hasSteps=recent.some(a=>a.steps);
  if(!hasSteps) return `<div style="color:var(--t4);font-size:12px;text-align:center;padding:12px 0">No step data found. Enable step tracking in Apple Health and re-import.</div>`;

  // ── Phase bucketing ────────────────────────────────────────────────────────
  const sortedDoses=[...doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const buckets={dose:[],peak:[],cruise:[],wearoff:[]};
  recent.forEach(log=>{
    if(!log.steps) return;
    const logT=new Date(log.date).getTime();
    const prev=sortedDoses.filter(d=>new Date(d.date).getTime()<=logT);
    if(!prev.length) return;
    const last=prev[prev.length-1];
    const ds=(logT-new Date(last.date).getTime())/86400000;
    if(ds<0||ds>14) return;
    if(ds<=1)        buckets.dose.push(log.steps);
    else if(ds<=3)   buckets.peak.push(log.steps);
    else if(ds<=5.5) buckets.cruise.push(log.steps);
    else             buckets.wearoff.push(log.steps);
  });
  const avg=arr=>arr.length?Math.round(arr.reduce((a,b)=>a+b,0)/arr.length):null;
  const doseAvg=avg(buckets.dose), peakAvg=avg(buckets.peak), cruiseAvg=avg(buckets.cruise), wearAvg=avg(buckets.wearoff);
  const fmt=n=>n!=null?n.toLocaleString():"—";

  // ── Pattern detection ──────────────────────────────────────────────────────
  const allAvgs=[doseAvg,peakAvg,cruiseAvg,wearAvg].filter(v=>v!=null);
  const overallAvg=allAvgs.length?Math.round(allAvgs.reduce((a,b)=>a+b,0)/allAvgs.length):null;
  let interpretation="";
  const hasSufficient=allAvgs.length>=3&&(buckets.dose.length+buckets.peak.length+buckets.cruise.length+buckets.wearoff.length)>=10;
  if(!hasSufficient){
    interpretation=`<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:12px 14px;margin-bottom:12px;font-size:12px;color:var(--t4);line-height:1.6">Not enough phase data yet. Log more dose cycles with step tracking to detect a pattern.</div>`;
  } else {
    const minPhase=[["Dose day",doseAvg],["Peak (Days 1–3)",peakAvg],["Cruise (Days 3–5)",cruiseAvg],["Wear-off (Day 5+)",wearAvg]].filter(([,v])=>v!=null).sort((a,b)=>a[1]-b[1])[0];
    const maxPhase=[["Dose day",doseAvg],["Peak (Days 1–3)",peakAvg],["Cruise (Days 3–5)",cruiseAvg],["Wear-off (Day 5+)",wearAvg]].filter(([,v])=>v!=null).sort((a,b)=>b[1]-a[1])[0];
    const spread=maxPhase[1]-minPhase[1];
    const pct=overallAvg>0?Math.round(spread/overallAvg*100):0;
    let msg="";
    if(pct<15){
      msg=`Activity is <b style="color:#7DF9C0">stable across your dose cycle</b> — no consistent phase-linked step pattern detected.`;
    } else if(doseAvg!=null&&doseAvg===minPhase[1]){
      msg=`Steps are lowest on <b style="color:#F9C87D">dose day</b> (~${fmt(doseAvg)}) — ${pct}% below your cycle average. This may reflect intentional rest after injection.`;
    } else if(wearAvg!=null&&wearAvg===minPhase[1]){
      msg=`Steps are lowest during <b style="color:#FF7C7C">wear-off (Day 5+)</b> (~${fmt(wearAvg)}) — ${pct}% below your highest phase. Lower energy as levels drop is a common pattern.`;
    } else {
      msg=`Highest steps during <b style="color:${color}">${maxPhase[0]}</b> (~${fmt(maxPhase[1])}), lowest during <b>${minPhase[0]}</b> (~${fmt(minPhase[1])}). ${pct}% spread across the cycle.`;
    }
    interpretation=`<div style="background:${color}10;border:1px solid ${color}33;border-radius:10px;padding:12px 14px;margin-bottom:12px">
      <div style="font-size:12px;color:var(--t2);line-height:1.6;margin-bottom:8px">${msg}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[["💉 Dose",doseAvg,"#A78BFA"],["⚡ Peak",peakAvg,color],["🛤 Cruise",cruiseAvg,"#7DF9C0"],["📉 Wear-off",wearAvg,"#FF7C7C"]].map(([l,v,c2])=>v!=null?`<div style="flex:1;min-width:72px;background:var(--surface-2);border-radius:8px;padding:7px 10px;text-align:center"><div style="font-size:9px;color:var(--t4);margin-bottom:3px">${l}</div><div style="font-size:13px;font-weight:700;color:${c2}">${fmt(v)}</div><div style="font-size:9px;color:var(--t5)">avg steps</div></div>`:"").join("")}
      </div>
    </div>`;
  }

  // ── Chart (unchanged visual, interpretation above) ─────────────────────────
  const W=480,H=90,padL=8;
  const xs=recent.map(d=>new Date(d.date).getTime()),minX=Math.min(...xs),maxX=Math.max(...xs);
  const px=t=>padL+((t-minX)/((maxX-minX)||1))*(W-padL*2);
  const maxStep=Math.max(...recent.map(a=>a.steps||0))||1;
  const path=recent.filter(a=>a.steps).map((a,i)=>`${i?"L":"M"} ${px(new Date(a.date).getTime())} ${padL+(1-a.steps/maxStep)*(H-padL*2)}`).join(" ");
  const dl=(doses||[]).filter(d=>{const t=new Date(d.date).getTime();return t>=minX&&t<=maxX;});
  return interpretation+`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">${dl.map(d=>{const x=px(new Date(d.date).getTime());return `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6"/>`;}).join("")}<path d="${path}" fill="none" stroke="#7DF9C0" stroke-width="1.5" stroke-linejoin="round" opacity="0.85"/></svg>
  <div style="display:flex;gap:14px;margin-top:6px"><div style="display:flex;align-items:center;gap:5px"><span style="width:16px;height:2px;background:#7DF9C0;display:inline-block;border-radius:1px"></span><span style="font-size:11px;color:var(--t3)">Steps (90 days)</span></div><div style="display:flex;align-items:center;gap:5px"><span style="font-size:10px">💉</span><span style="font-size:11px;color:var(--t3)">Injection</span></div></div>`;
}


function analyzeTrough(dailyLogs, doses, returnSymptoms) {
  if (!doses.length || !dailyLogs.length) return [];
  const sorted = [...doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const results = [];
  dailyLogs.forEach(log => {
    const logDate = new Date(log.date);
    const prevDoses = sorted.filter(d=>new Date(d.date)<=logDate);
    if (!prevDoses.length) return;
    const lastDose = prevDoses[prevDoses.length-1];
    const doseIdx = sorted.indexOf(lastDose); // track which cycle this belongs to
    const daysSince = (logDate-new Date(lastDose.date))/86400000;
    if (daysSince<0||daysSince>14) return;
    const allSyms = log.symptoms||[];
    const matching = returnSymptoms ? allSyms.filter(s=>{const n=typeof s==="string"?s:s.name; return returnSymptoms.some(rs=>n.toLowerCase().includes(rs.toLowerCase()));}) : allSyms;
    if (matching.length) results.push({day:Math.round(daysSince*2)/2, symptoms:matching, logDate:log.date, doseIdx});
  });
  return results;
}

function troughHTML(data, scheduleDays, color, troughDay) {
  const MIN_CYCLES = 3;
  const distinctCycles = new Set((data||[]).map(r=>r.doseIdx)).size;

  // ── Not enough data ────────────────────────────────────────────────────────
  if (!data.length || distinctCycles < MIN_CYCLES) {
    const cycleWord = distinctCycles === 1 ? "1 dose cycle" : `${distinctCycles} dose cycles`;
    return `
      <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:14px 16px;margin-bottom:10px">
        <div style="font-size:13px;font-weight:600;color:var(--t2);margin-bottom:6px">Not enough trough data yet</div>
        <div style="font-size:12px;color:var(--t4);line-height:1.6">
          ${data.length===0
            ? "No return symptoms logged yet."
            : `${data.length} event${data.length>1?"s":""} logged across ${cycleWord} — need at least ${MIN_CYCLES} to detect a pattern.`}
          <br>Log daily check-ins and tag symptoms like <b style="color:${color}">appetite return</b>, <b style="color:${color}">food noise</b>, <b style="color:${color}">cravings</b>, or <b style="color:${color}">fatigue</b> across ${MIN_CYCLES}+ dose cycles.
        </div>
        <div style="font-size:10px;color:var(--t5);margin-top:10px;line-height:1.5">Trough Analysis shows when wear-off symptoms typically return in your cycle — helping you assess whether your schedule is well-timed.</div>
      </div>`;
  }

  // ── Enough data — compute statistics ─────────────────────────────────────
  const days = data.map(r=>r.day);
  const avgDay = days.reduce((a,b)=>a+b,0)/days.length;
  const minDay = Math.min(...days);
  const maxDay = Math.max(...days);
  const variance = days.reduce((a,b)=>a+(b-avgDay)**2,0)/days.length;
  const stdDev = Math.sqrt(variance);
  const wearOffDays = Math.max(0, scheduleDays - avgDay);

  // Interpretation
  let interp, interpColor;
  if (wearOffDays >= 2) {
    interp = `Wear-off symptoms return around <b style="color:${color}">Day ${avgDay.toFixed(1)}</b> on average — leaving roughly <b style="color:#FF7C7C">${wearOffDays.toFixed(1)} days</b> of wear-off before your next dose.`;
    interpColor = "#FF7C7C";
  } else if (wearOffDays >= 0.5) {
    interp = `Return symptoms appear close to your next dose (~Day ${avgDay.toFixed(1)}). Your ${scheduleDays}-day schedule appears reasonably timed.`;
    interpColor = "#F9C87D";
  } else {
    interp = `Return symptoms occur at or after your scheduled dose day. Timing appears well-controlled.`;
    interpColor = "#7DF9C0";
  }

  // Bar chart data
  const bins={};
  data.forEach(({day})=>{bins[day]=(bins[day]||0)+1;});
  const maxBin = Math.max(...Object.values(bins));
  const totalDays = Math.ceil(scheduleDays);

  // Phase zone boundaries (approximate)
  const peakEnd = Math.min(3, troughDay ? troughDay*0.4 : 3);
  const cruiseEnd = troughDay ? troughDay-0.5 : scheduleDays*0.7;
  const returnStart = Math.floor(minDay);

  const chartBars = [...Array(totalDays+1)].map((_,i)=>{
    const cnt = bins[i]||0;
    const h = cnt ? Math.max(10,Math.round(cnt/maxBin*52)) : 0;
    const inWindow = i>=returnStart && i<=Math.ceil(maxDay);
    const barColor = cnt ? (inWindow ? color : color+"88") : "transparent";
    const dayLabel = i===0?"💉":String(i);
    const isAvg = Math.abs(i-Math.round(avgDay))<0.6;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;min-width:20px;flex:1">
      ${cnt
        ? `<div style="width:14px;height:${h}px;background:${barColor};border-radius:3px 3px 0 0;${isAvg?`box-shadow:0 0 8px ${color}88`:""};transition:height 0.3s"></div>`
        : `<div style="width:14px;height:4px"></div>`}
      <div class="mono" style="font-size:8px;color:${isAvg?color:cnt?"var(--t3)":"var(--t5)"};font-weight:${isAvg?"700":"400"}">${dayLabel}</div>
    </div>`;
  }).join("");

  // Typical return window highlight bar
  const windowPct = totalDays>0 ? ((maxDay-minDay)/totalDays*100).toFixed(1) : 0;
  const windowLeft = totalDays>0 ? (minDay/totalDays*100).toFixed(1) : 0;

  return `
    <div style="background:${color}10;border:1px solid ${color}33;border-radius:10px;padding:12px 14px;margin-bottom:12px">
      <div style="font-size:12px;color:var(--t2);line-height:1.6;margin-bottom:4px">${interp}</div>
      <div style="font-size:10px;color:var(--t4)">Based on <b>${distinctCycles}</b> dose cycles · ${days.length} logged events · ±${stdDev.toFixed(1)}d spread</div>
    </div>
    <div style="position:relative;margin-bottom:4px">
      <div style="display:flex;align-items:flex-end;height:70px;padding-top:14px;gap:0">${chartBars}</div>
      ${wearOffDays>=1?`<div style="position:absolute;top:0;right:0;font-size:9px;color:#FF7C7C;opacity:0.8">⚠ wear-off zone</div>`:""}
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
      <div style="display:flex;align-items:center;gap:5px"><div style="width:10px;height:10px;border-radius:2px;background:${color}"></div><span style="font-size:10px;color:var(--t4)">Return event</span></div>
      <div style="display:flex;align-items:center;gap:5px"><span style="font-size:10px">💉</span><span style="font-size:10px;color:var(--t4)">Dose day (Day 0)</span></div>
      <div style="display:flex;align-items:center;gap:5px"><span style="font-size:10px;color:var(--t4)">Bold day = avg return</span></div>
    </div>
    <div style="font-size:10px;color:var(--t5);margin-top:10px;line-height:1.5">⚕ Pattern analysis only. Discuss schedule adjustments with your clinician.</div>`;
}

// ─── Escalation Readiness ────────────────────────────────────────────────────
function escalationReadiness(name, data) {
  const doses = [...(data.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (doses.length < 2) return null;
  const c = cfg(name);
  // Weeks at current dose (since last escalation or start)
  const lastEscIdx = [...doses].reverse().findIndex(d=>d.escalation);
  const currentStart = lastEscIdx >= 0 ? doses[doses.length-1-lastEscIdx] : doses[0];
  const weeksAtDose = (Date.now()-new Date(currentStart.date).getTime()) / (7*86400000);
  const currentDose = parseFloat([...doses].reverse()[0].dose||0);
  // Recent logs tagged to this compound (last 14 days)
  const recentLogs = state.dailyLogs.filter(l=>{
    return (Date.now()-new Date(l.date).getTime()) < 14*86400000 && (l.compound===name||!l.compound);
  });
  const SEVERE = ["Nausea","Vomiting","Diarrhea","Heartburn / reflux"];
  const severeCount = recentLogs.reduce((acc,l)=>{
    return acc + (l.symptoms||[]).filter(s=>{
      const nm=typeof s==="string"?s:s.name, intensity=typeof s==="string"?1:(s.intensity||1);
      return SEVERE.some(sv=>nm.includes(sv)) && intensity>=2;
    }).length;
  },0);
  const troughData = analyzeTrough(state.dailyLogs, doses, c.returnSymptoms||[]);
  const hasTrough = troughData.length >= 2;
  // Signal logic
  if (weeksAtDose < 3 || severeCount >= 3) {
    return { signal:"not_ready", color:"#ff7c7c", label:"Not Ready", icon:"🔴",
      detail: severeCount>=3 ? "Frequent high-intensity side effects in the past 2 weeks — your body is still adjusting." : `Only ${weeksAtDose.toFixed(1)} weeks at this dose. Most protocols suggest at least 3–4 weeks before considering an increase.`,
      weeksAtDose, currentDose };
  }
  if (weeksAtDose >= 4 && severeCount === 0) {
    return { signal:"may_be_ready", color:"#7DF9C0", label:"May Be Ready", icon:"🟢",
      detail: `${weeksAtDose.toFixed(1)} weeks at ${currentDose} ${c.unit} with manageable side effects.${hasTrough?" Trough symptoms suggest appetite is returning before your next shot — a common signal for escalation consideration.":""} Always confirm with your clinician.`,
      weeksAtDose, currentDose };
  }
  return { signal:"getting_there", color:"#F9C87D", label:"Getting There", icon:"🟡",
    detail: `${weeksAtDose.toFixed(1)} weeks at ${currentDose} ${c.unit}. Aim for 4+ weeks minimum. ${severeCount>0?`${severeCount} high-intensity side effects in the past 2 weeks — let those settle first.`:"Side effects appear manageable — keep monitoring."}`,
    weeksAtDose, currentDose };
}

function escalationCard(name, data) {
  const r = escalationReadiness(name, data);
  if (!r) return "";
  return `<div style="background:${r.color}0f;border:1px solid ${r.color}33;border-radius:12px;padding:14px 16px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <span style="font-size:16px">${r.icon}</span>
      <span style="font-size:13px;font-weight:600;color:${r.color}">${r.label}</span>
      <span class="mono" style="font-size:10px;color:var(--t4);margin-left:auto">${r.weeksAtDose.toFixed(1)}w at dose</span>
    </div>
    <div style="font-size:12px;color:var(--t3);line-height:1.55">${r.detail}</div>
    <div style="font-size:10px;color:var(--t5);margin-top:8px">⚕ This is pattern analysis only — not medical advice. Discuss all dose changes with your clinician.</div>
  </div>`;
}

// ─── Site Rotation Warning ────────────────────────────────────────────────────
function siteRotationWarning(doses) {
  const recent = [...doses].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6).filter(d=>d.site);
  if (recent.length < 3) return null;
  const lastSite = recent[0].site;
  const consecutive = recent.findIndex(d=>d.site!==lastSite);
  const countInLast5 = recent.slice(0,5).filter(d=>d.site===lastSite).length;
  if (consecutive === -1 || consecutive >= 3 || countInLast5 >= 3) {
    return { site:lastSite, consecutive: consecutive===-1?recent.length:consecutive, countInLast5 };
  }
  return null;
}

// ─── Body Recomposition ──────────────────────────────────────────────────────
function recompSection(weightLogs, measurementLogs, unit, munit) {
  return progressSummarySection(weightLogs, measurementLogs, unit, munit);
}

function progressSummarySection(weightLogs, measurementLogs, unit, munit) {
  const wSorted=[...weightLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const mSorted=[...measurementLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const now=Date.now();
  const wStart=wSorted.length?parseFloat(wSorted[0].weight):null;
  const wCurrent=wSorted.length?parseFloat(wSorted[wSorted.length-1].weight):null;
  const wLowest=wSorted.length?Math.min(...wSorted.map(w=>parseFloat(w.weight))):null;
  const wLoss=wStart!=null&&wCurrent!=null?wCurrent-wStart:null;
  const wBest=wStart!=null&&wLowest!=null?wLowest-wStart:null;
  const wFromLowest=wCurrent!=null&&wLowest!=null?wCurrent-wLowest:null;
  const w7=wSorted.filter(w=>(now-new Date(w.date).getTime())<=7*86400000);
  const w30=wSorted.filter(w=>(now-new Date(w.date).getTime())<=30*86400000);
  const t7=w7.length>=2?parseFloat(w7[w7.length-1].weight)-parseFloat(w7[0].weight):null;
  const t30=w30.length>=4?parseFloat(w30[w30.length-1].weight)-parseFloat(w30[0].weight):null;
  const wM=mSorted.filter(m=>m.waist);
  const mStart=wM.length?parseFloat(wM[0].waist):null;
  const mCurrent=wM.length?parseFloat(wM[wM.length-1].waist):null;
  const mLowest=wM.length?Math.min(...wM.map(m=>parseFloat(m.waist))):null;
  const mLoss=mStart!=null&&mCurrent!=null?mCurrent-mStart:null;
  const mBest=mStart!=null&&mLowest!=null?mLowest-mStart:null;
  const mFromLowest=mCurrent!=null&&mLowest!=null?mCurrent-mLowest:null;
  if(!wStart&&!mStart) return "";
  const tc=v=>v==null?"var(--t4)":v<0?"#7DF9C0":v>0?"#ff9c5c":"var(--t4)";
  const arrow=v=>v==null?"":v<0?" ↓":v>0?" ↑":"";
  const fmtChg=(v,u)=>v!=null?(v>0?"+":"")+Math.abs(v).toFixed(1)+" "+u+arrow(v):"—";
  const sb=(label,val,col,sub)=>`<div style="background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;padding:10px 12px">
    <div style="font-size:15px;font-weight:700;color:${col};line-height:1.2">${val}</div>
    <div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.2px;margin-top:3px">${label}</div>
    ${sub?`<div style="font-size:10px;color:var(--t5);margin-top:2px">${sub}</div>`:""}
  </div>`;
  let html="";
  if(wStart){
    html+=`<div style="margin-bottom:14px">
      <div class="mono" style="font-size:9px;color:#8AB4FF;letter-spacing:1.5px;margin-bottom:10px">WEIGHT PROGRESS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:7px">
        ${sb("STARTING",wStart.toFixed(1)+" "+unit,"var(--t2)")}
        ${sb("CURRENT",wCurrent.toFixed(1)+" "+unit,tc(wLoss))}
        ${sb("LOWEST LOGGED",wLowest.toFixed(1)+" "+unit,"#A78BFA")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:7px">
        ${sb("CURRENT LOSS",fmtChg(wLoss,unit),tc(wLoss))}
        ${sb("BEST LOSS",fmtChg(wBest,unit),"#7DF9C0")}
      </div>
      ${wFromLowest!=null&&wFromLowest>0.05?`<div style="padding:9px 12px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;font-size:11px;color:var(--t3);line-height:1.6;margin-bottom:7px">Currently <b style="color:var(--t2)">${wFromLowest.toFixed(1)} ${unit} above your lowest logged</b> — and still <b style="color:#7DF9C0">${Math.abs(wLoss).toFixed(1)} ${unit} below where you started</b>. Scale fluctuations are normal.</div>`:""}
      ${t7!=null||t30!=null?`<div style="display:grid;grid-template-columns:${t7!=null&&t30!=null?"1fr 1fr":"1fr"};gap:7px">
        ${t7!=null?sb("7-DAY TREND",fmtChg(t7,unit),tc(t7),w7.length+" readings"):""}
        ${t30!=null?sb("30-DAY TREND",fmtChg(t30,unit),tc(t30),w30.length+" readings"):""}
      </div>`:""}
    </div>`;
  }
  if(mStart){
    html+=`<div style="margin-bottom:14px">
      <div class="mono" style="font-size:9px;color:#FF9CC8;letter-spacing:1.5px;margin-bottom:10px">WAIST PROGRESS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:7px">
        ${sb("STARTING",mStart.toFixed(1)+" "+munit,"var(--t2)")}
        ${sb("CURRENT",mCurrent.toFixed(1)+" "+munit,tc(mLoss))}
        ${sb("LOWEST LOGGED",mLowest.toFixed(1)+" "+munit,"#A78BFA")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
        ${sb("CURRENT CHANGE",fmtChg(mLoss,munit),tc(mLoss))}
        ${sb("BEST CHANGE",fmtChg(mBest,munit),"#7DF9C0")}
      </div>
      ${mFromLowest!=null&&mFromLowest>0.1?`<div style="margin-top:7px;padding:8px 12px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;font-size:11px;color:var(--t4)">${mFromLowest.toFixed(1)} ${munit} above lowest logged waist — measurements shift with hydration and meal timing.</div>`:""}
    </div>`;
  }
  if(wLoss!=null&&mLoss!=null){
    let sig=null;
    if(mLoss<0&&wLoss>-1) sig={label:"Recomping ✓",color:"#7DF9C0",detail:"Waist shrinking while the scale holds steady — you're losing fat while maintaining muscle."};
    else if(wLoss<-2&&mLoss<0) sig={label:"Fat Loss in Progress ↓",color:"#8AB4FF",detail:"Both weight and waist declining together — solid, consistent fat loss progress."};
    if(sig) html+=`<div style="background:${sig.color}11;border:1px solid ${sig.color}33;border-radius:10px;padding:12px 14px">
      <div style="font-size:13px;font-weight:600;color:${sig.color};margin-bottom:4px">${sig.label}</div>
      <div style="font-size:12px;color:var(--t3);line-height:1.5">${sig.detail}</div>
    </div>`;
  }
  return html?`<div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border-sub)">${html}</div>`:"";
}

// ─── Weekly Digest ────────────────────────────────────────────────────────────
function weeklyDigestModal() {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+6);
  const aps = allPeptides();
  // Doses this week
  const weekDoses = Object.entries(aps).flatMap(([n,p])=>(p.doses||[]).filter(d=>{
    const dd=new Date(d.date); return dd>=weekStart&&dd<=weekEnd;
  }).map(d=>({...d,pep:n})));
  // Logs this week
  const weekLogs = state.dailyLogs.filter(l=>{const d=new Date(l.date);return d>=weekStart&&d<=weekEnd;});
  const avgMood = weekLogs.length ? (weekLogs.reduce((a,l)=>a+l.mood,0)/weekLogs.length) : null;
  const moodObj = avgMood ? MOODS.reduce((best,m)=>Math.abs(m.v-avgMood)<Math.abs(best.v-avgMood)?m:best) : null;
  // Symptom counts
  const symCount = {};
  weekLogs.forEach(l=>(l.symptoms||[]).forEach(s=>{const n=typeof s==="string"?s:s.name;symCount[n]=(symCount[n]||0)+1;}));
  const topSyms = Object.entries(symCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  // Weight this week
  const weekWeights = state.weightLogs.filter(w=>{const d=new Date(w.date);return d>=weekStart&&d<=weekEnd;}).map(w=>parseFloat(w.weight));
  const wtChange = weekWeights.length>=2 ? (weekWeights[weekWeights.length-1]-weekWeights[0]).toFixed(1) : null;
  // Date range label
  const rangeLabel = `${weekStart.toLocaleDateString("en-CA",{month:"short",day:"numeric"})} – ${weekEnd.toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"})}`;

  // Plain-text clinician copy
  const plainText = [
    `WEEKLY PROTOCOL SUMMARY`,
    `Week of ${rangeLabel}`,
    ``,
    `DOSES (${weekDoses.length} total)`,
    ...weekDoses.map(d=>`  • ${d.pep} – ${d.dose||"?"} ${cfg(d.pep).unit} – ${new Date(d.date).toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}${d.site?" – "+d.site:""}`),
    weekDoses.length===0?"  None logged":"",
    ``,
    `DAILY CHECK-INS: ${weekLogs.length}/7 days${moodObj?` | Avg mood: ${moodObj.emoji} ${moodObj.label}`:""}`,
    ``,
    topSyms.length ? `TOP SYMPTOMS THIS WEEK\n${topSyms.map(([n,c])=>`  • ${n} (×${c})`).join("\n")}` : "NO SYMPTOMS LOGGED",
    ``,
    wtChange ? `WEIGHT CHANGE THIS WEEK: ${wtChange>0?"+":""}${wtChange} ${state.settings.weightUnit}` : "NO WEIGHT LOGS THIS WEEK",
    ``,
    `Generated by Nexus – ${new Date().toLocaleDateString("en-CA")}`,
  ].filter(l=>l!==undefined).join("\n");

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">WEEKLY REPORT</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:12px;color:var(--t4);margin-bottom:16px">${rangeLabel}</div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px">
      ${[["DOSES",weekDoses.length,"#A78BFA"],["CHECK-INS",weekLogs.length+"/7","#7DF9C0"],["WT CHANGE",wtChange?(wtChange>0?"+":"")+wtChange+" "+state.settings.weightUnit:"—",wtChange&&wtChange<=0?"#7DF9C0":"#ff9c5c"]].map(([l,v,col])=>`<div style="background:var(--surface-2);border-radius:10px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:700;color:${col}">${v}</div><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-top:3px">${l}</div></div>`).join("")}
    </div>

    ${weekDoses.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">DOSES</div>
    ${weekDoses.map(d=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-sub)"><div style="width:6px;height:6px;border-radius:50%;background:${cfg(d.pep).color};flex-shrink:0"></div><div style="flex:1"><div style="font-size:12px;color:var(--t2);font-weight:600">${esc(d.pep)} ${d.dose||"?"} ${cfg(d.pep).unit}</div><div style="font-size:10px;color:var(--t4)">${new Date(d.date).toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}${d.site?" · "+esc(d.site):""}</div></div></div>`).join("")}
    <div style="margin-bottom:14px"></div>`:""}

    ${moodObj?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">MOOD</div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:10px 14px;background:var(--surface-2);border-radius:10px">
      <span style="font-size:28px">${moodObj.emoji}</span>
      <div><div style="font-size:14px;color:${moodObj.color};font-weight:600">${moodObj.label}</div><div style="font-size:11px;color:var(--t4)">Average over ${weekLogs.length} check-in${weekLogs.length===1?"":"s"}</div></div>
    </div>`:""}

    ${topSyms.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">TOP SYMPTOMS</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px">
      ${topSyms.map(([n,c])=>`<span class="pill" style="background:var(--surface-2);color:var(--t3);border:1px solid var(--border)">${esc(n)} ×${c}</span>`).join("")}
    </div>`:""}

    <button id="copydigest" class="btn-primary" style="background:#A78BFA;margin-bottom:8px">📋 Copy for Clinician</button>
    <div style="font-size:10px;color:var(--t4);text-align:center">Copies a plain-text summary to your clipboard</div>
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#copydigest").onclick = () => {
    navigator.clipboard.writeText(plainText).then(()=>{
      const btn = m.querySelector("#copydigest");
      btn.textContent = "✓ Copied!";
      setTimeout(()=>{ btn.textContent = "📋 Copy for Clinician"; }, 2000);
    }).catch(()=>{ alert("Copy failed — try manually selecting the text."); });
  };
}

// ─── Shared dose status helper — single source of truth for all dose status displays ──
// Sorts active compound cards by actual urgency instead of whatever order Object.entries
// happens to return (insertion order — effectively random from the person's perspective).
// due_now/overdue come first (oldest-overdue first within that group, since that's the
// longest-waiting and most urgent), then due later today, then everything else ordered by
// its actual next due date, with a paused protocol sinking to the bottom since there's
// nothing to act on until it's resumed. One shared function so every screen that lists
// active compounds — Today, the Active/All full views — agrees on the same order.
function activeCardSortKey(name, data) {
  const ds = getDoseStatus(name, data);
  const bucket = (ds.status==="due_now"||ds.status==="overdue") ? 0
    : ds.status==="due_later_today" ? 1
    : (ds.status==="protocol_paused"||ds.status==="resting") ? 3
    : 2;
  const timeKey = ds.nextDueMs!=null ? ds.nextDueMs : (ds.lastDoseMs!=null ? ds.lastDoseMs : Infinity);
  return bucket*1e15 + timeKey;
}
function sortActiveCards(entries) {
  return entries.slice().sort((a,b)=>activeCardSortKey(a[0],a[1])-activeCardSortKey(b[0],b[1]));
}
// A compound whose current phase is a REST phase isn't due, upcoming-today, or overdue —
// it's resting, and the honest description is "week 2 of 4, resumes Oct 25," not a
// countdown ring ticking toward a dose that doesn't exist yet. Same shape as
// protocol_paused (nothing to act on, no ring), except it carries the date dosing resumes
// so Upcoming and the "due tomorrow" heads-up still work for the first dose after rest.
function restingStatus(data, today, lastDose, resumesOn) {
  const span = getPhaseSpan(data, today);
  const wk = span ? span.weekInPhase : null, tot = span ? span.totalWeeks : null;
  const weekBit = wk ? ` · wk ${wk}/${tot}` : "";
  const resumeBit = resumesOn ? ` · resumes ${fmtDate(resumesOn)}` : " · no further doses scheduled";
  return {
    status:"resting", label:`⏸ Rest phase${weekBit}${resumeBit}`, color:"var(--t4)", showLogBtn:false,
    left:null, nextDueMs:null, nextDueStr:resumesOn||null,
    lastDoseMs: lastDose ? new Date(lastDose.date).getTime() : null,
    restWeek:wk, restTotalWeeks:tot, resumesOn:resumesOn||null,
  };
}

function getDoseStatus(name, data) {
  const today = localDate();
  const nowMs = Date.now();
  const graceMs = (state.settings.graceHours||3)*3600000;
  // A currently-paused protocol has no "next due" to find at all — the walk-forward loops
  // below step day-by-day (or occurrence-by-occurrence) looking for the first
  // scheduled/missed day, and an open-ended pause (no resumedAt yet) would have every
  // future day come back "paused," meaning those loops would exhaust their guard limit
  // rather than find a real answer. Short-circuit before any of that runs.
  const _proto = protocolForData(data);
  if (_proto && _proto.status === "paused") {
    return {status:"protocol_paused", label:"⏸ Protocol paused", color:"#F9C87D", showLogBtn:false, left:null, nextDueMs:null, nextDueStr:null, lastDoseMs:(data.doses||[]).length?new Date(data.doses[data.doses.length-1].date).getTime():null, protocolId:_proto.id, protocolName:_proto.name};
  }
  // Use the EFFECTIVE schedule for today (phase-aware) to decide which branch applies —
  // a phased compound can be daily during loading and weekly during maintenance, so the
  // static data.scheduleDays alone can't tell you which behavior applies right now.
  const effSched = getEffectiveSchedule(data, today);
  const schedule = effSched.scheduleDays||7;
  const sorted = [...(data.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const last = sorted[sorted.length-1];
  const c2 = cfg(name);
  const fmtT = dt=>dt.toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"});
  const sl = s=>s===1?"daily":s===7?"weekly":s===14?"every 2 wks":`every ${s}d`;
  if(!last) return {status:"no_doses",label:"No doses logged",color:"var(--t5)",showLogBtn:false,left:null,nextDueMs:null,nextDueStr:null,lastDoseMs:null};
  // The final phase being a rest phase means nothing is ever scheduled again — there is no
  // "next dose" to find, and walking forward looking for one would just exhaust the guard
  // and report a made-up date far in the future (or hand a null date to code that expects
  // a real one). Say so plainly instead — unless a dose was logged today, which is its own
  // normal "taken today" state handled below.
  if (effSched.isRest && doseDayFor(data,last)!==today) {
    const span = getPhaseSpan(data, today);
    if (span && !span.nextStartDay) return restingStatus(data, today, last, null);
  }
  const weekdayMode = !!effSched.scheduleWeekdays;
  let result;
  if(schedule===1 && !weekdayMode && (effSched.dosesPerDay||1)<=1){
    const lastMs=new Date(last.date).getTime();
    // Anchor for daily schedules: latest resolved occurrence. If a skip happened after
    // the last real dose, advance from there — walking forward 24h at a time past any
    // further skipped days — but keep the ORIGINAL dose's time-of-day, since a skip has
    // no time of its own and inventing one would silently drift the dosing schedule.
    let anchorMs = lastMs;
    const mostRecentSkipDaily = getMostRecentSkip(data);
    if (mostRecentSkipDaily) {
      const skipDate = safeDate(mostRecentSkipDaily.date);
      const doseTimeSrc = new Date(lastMs);
      const skipAtDoseTime = new Date(skipDate.getFullYear(),skipDate.getMonth(),skipDate.getDate(),doseTimeSrc.getHours(),doseTimeSrc.getMinutes()).getTime();
      if (skipAtDoseTime > anchorMs) anchorMs = skipAtDoseTime;
    }
    let nextMs = anchorMs + 86400000;
    let guardD=0;
    // 400, not 60: this walk now steps one day at a time THROUGH a rest phase, and a rest
    // phase of 9+ weeks (84+ days) is entirely plausible — the old limit would have run out
    // partway through it and reported whatever day it happened to be on as "next due."
    while (guardD++<400) {
      const occ = getScheduledOccurrenceState(data, dayKey(nextMs));
      if (occ.state==="scheduled" || occ.state==="overdue") break;
      nextMs += 86400000;
    }
    const nextDate=new Date(nextMs), nextDk=dayKey(nextDate);
    const leftDays=(nextMs-nowMs)/86400000;
    // Which "bucket" this occurrence is in (due_now / due_later_today / overdue / upcoming)
    // is decided by getDayOccurrences() — the exact same canonical engine every other Today
    // surface (the compact home "UP NEXT" widget, sorting, reminders) already reads. This
    // function still owns its OWN richer return shape (showLogBtn, cycleLengthDays, etc.)
    // that many callers depend on, but the actual due-now/overdue DETERMINATION can no
    // longer be computed independently here and drift from what's shown elsewhere.
    const canonicalSlot = (() => {
      const slots = getDayOccurrences(data, nextDk);
      return slots.find(s=>!["taken","skipped","moved"].includes(s.status)) || slots[0] || null;
    })();
    const canonicalStatus = canonicalSlot?.status;
    if(doseDayFor(data,last)===today) result={status:"taken_today",label:"Taken "+fmtT(new Date(last.date)),color:c2.color,showLogBtn:false,left:leftDays,nextDueMs:nextMs,nextDueStr:nextDk,lastDoseMs:lastMs,cycleLengthDays:1};
    else if(canonicalStatus==="overdue"){const h=Math.round((nowMs-nextMs)/3600000);result={status:"overdue",label:`Overdue · ${h}h late`,color:"#FF7C7C",showLogBtn:true,left:leftDays,nextDueMs:nextMs,nextDueStr:nextDk,lastDoseMs:lastMs,hoursLate:h,cycleLengthDays:1};}
    else if(canonicalStatus==="due_now") result={status:"due_now",label:`Due now · ${sl(schedule)}`,color:"#F9C87D",showLogBtn:true,left:leftDays,nextDueMs:nextMs,nextDueStr:nextDk,lastDoseMs:lastMs,cycleLengthDays:1};
    else if(canonicalStatus==="due_later_today"||nextDk===today){const h=nextDate.getHours();result={status:"due_later_today",label:`${h>=18?"Due tonight":"Due at"} ${fmtT(nextDate)} · ${sl(schedule)}`,color:"var(--t3)",showLogBtn:false,left:leftDays,nextDueMs:nextMs,nextDueStr:nextDk,lastDoseMs:lastMs,cycleLengthDays:1};}
    else result={status:"upcoming",label:`Due tomorrow · ${sl(schedule)}`,color:"var(--t4)",showLogBtn:false,left:leftDays,nextDueMs:nextMs,nextDueStr:nextDk,lastDoseMs:lastMs,cycleLengthDays:1};
  } else {
    const nextDueStr=nextDueDate(data);
    // nextDueDate returns null only when nothing further is scheduled — it never did before
    // (every path produced a date), so nothing here guarded against it, and the line below
    // would have thrown on safeDate(null).getTime(). Treat it as "nothing upcoming."
    if (!nextDueStr) return {status:"upcoming", label:"No upcoming dose scheduled", color:"var(--t4)", showLogBtn:false, left:null, nextDueMs:null, nextDueStr:null, lastDoseMs:new Date(last.date).getTime()};
    const label=scheduleLabel(data);
    const leftDays=(safeDate(nextDueStr).getTime()-nowMs)/86400000;
    const lastMs=new Date(last.date).getTime();
    const cycleLengthDays=Math.max(1,Math.round((safeDate(nextDueStr).getTime()-lastMs)/86400000));
    // Same principle for interval/weekday-scheduled compounds — today-vs-not is decided
    // by the canonical engine, not a second independent date-string comparison.
    const canonicalSlot2 = (() => {
      const slots = getDayOccurrences(data, nextDueStr);
      return slots.find(s=>!["taken","skipped","moved"].includes(s.status)) || slots[0] || null;
    })();
    const canonicalStatus2 = canonicalSlot2?.status;
    if(doseDayFor(data,last)===today) result={status:"taken_today",label:"Taken "+fmtT(new Date(last.date)),color:c2.color,showLogBtn:false,left:leftDays,nextDueMs:null,nextDueStr,lastDoseMs:lastMs,cycleLengthDays};
    else if(nextDueStr<today){const d=Math.round(daysSince(nextDueStr))||1;result={status:"overdue",label:`Overdue · ${d}d past due`,color:"#FF7C7C",showLogBtn:true,left:leftDays,nextDueMs:null,nextDueStr,lastDoseMs:lastMs,daysLate:d,cycleLengthDays};}
    else if(nextDueStr===today) result={status:(canonicalStatus2==="overdue"?"overdue":"due_now"),label:`Due today · ${label}`,color:canonicalStatus2==="overdue"?"#FF7C7C":"#F9C87D",showLogBtn:true,left:leftDays,nextDueMs:null,nextDueStr,lastDoseMs:lastMs,cycleLengthDays};
    else if(nextDueStr===addDays(today,1)) result={status:"upcoming",label:`Due tomorrow · ${label}`,color:"var(--t3)",showLogBtn:false,left:leftDays,nextDueMs:null,nextDueStr,lastDoseMs:lastMs,cycleLengthDays};
    else result={status:"upcoming",label:`Next dose ${fmtDate(nextDueStr)} · ${label}`,color:"var(--t4)",showLogBtn:false,left:leftDays,nextDueMs:null,nextDueStr,lastDoseMs:lastMs,daysUntil:Math.ceil(leftDays),cycleLengthDays};
  }
  // Skip/reschedule status override. nextDueDate() now ALWAYS advances past any resolved
  // A previous skip/reschedule is only the PRIMARY status on its own occurrence day — the
  // moment the calendar advances past it, the underlying (already correctly-advanced)
  // status for the CURRENT occurrence must take over. A skip from yesterday is history,
  // not something that should keep blocking today's Log Dose.
  if (result.status !== "taken_today") {
    const mostRecentSkip = getMostRecentSkip(data);
    const mostRecentResched = getMostRecentReschedule(data);
    const lastDoseDate = last.date;
    const isLaterOrEqual = (a,b) => !b || dayKey(a) >= dayKey(b);

    const skipIsToday = mostRecentSkip && dayKey(mostRecentSkip.date)===today &&
      isLaterOrEqual(mostRecentSkip.date, lastDoseDate) &&
      (!mostRecentResched || dayKey(mostRecentSkip.date) >= dayKey(mostRecentResched.originalDate));
    // Reschedule stays the active status right up through its own target date, since it
    // represents a still-pending commitment (not yet logged) rather than a closed occurrence.
    const stillInReschedWindow = !result.nextDueStr || today <= result.nextDueStr;
    const reschedIsActive = !skipIsToday && mostRecentResched && !mostRecentResched.doseId && stillInReschedWindow &&
      isLaterOrEqual(mostRecentResched.originalDate, lastDoseDate) &&
      (!mostRecentSkip || dayKey(mostRecentResched.originalDate) >= dayKey(mostRecentSkip.date));

    if (skipIsToday) {
      result = {
        ...result, status:"skipped",
        label: `Skipped today${mostRecentSkip.reason?" · "+mostRecentSkip.reason:""}`,
        color:"var(--t4)", showLogBtn:false, skippedDate:mostRecentSkip.date, skipReason:mostRecentSkip.reason,
      };
    } else if (reschedIsActive) {
      const newDateObj = safeDate(mostRecentResched.newDate);
      const hasTime = String(mostRecentResched.newDate).includes("T") && !String(mostRecentResched.newDate).endsWith("T00:00:00.000Z");
      const newLabel = dayKey(mostRecentResched.newDate)===addDays(today,1) ? "tomorrow" : dayKey(mostRecentResched.newDate)===today ? "today" : fmtDate(mostRecentResched.newDate);
      // Still show Log Dose if the rescheduled occurrence is actually due today — the
      // reschedule explains WHY it's due today, it doesn't block acting on it.
      const reschedDueToday = dayKey(mostRecentResched.newDate)===today;
      result = {...result, status:"rescheduled", label:`Rescheduled for ${newLabel}${hasTime?" at "+fmtT(newDateObj):""}`, color:"#A78BFA", showLogBtn:reschedDueToday, rescheduledTo:mostRecentResched.newDate, rescheduleId:mostRecentResched.id};
    }
    // Recent skip history surfaces as supplemental context regardless of whether it's
    // still the primary status — the expanded card can show "Skipped Aug 7 · Sick" even
    // once today's own due/overdue status has correctly taken over as primary.
    if (mostRecentSkip && !skipIsToday && dayKey(mostRecentSkip.date) < today &&
        isLaterOrEqual(mostRecentSkip.date, lastDoseDate)) {
      result = {...result, recentSkip: {date:mostRecentSkip.date, reason:mostRecentSkip.reason, id:mostRecentSkip.id}};
    }
  }
  // In a rest phase with nothing due or overdue, the only thing the walk can have found is
  // the first dose AFTER the rest — present that as what it is. Deliberately only converts
  // a plain "upcoming": a genuinely unresolved overdue dose from BEFORE the rest began
  // still surfaces as overdue (with Resolve Overdue), because nothing here is allowed to
  // quietly resolve a dose on the person's behalf just because a rest phase started after it.
  if (effSched.isRest && result.status === "upcoming") {
    result = {...restingStatus(data, today, last, result.nextDueStr), ...(result.recentSkip?{recentSkip:result.recentSkip}:{})};
  }
  return result;
}

// One canonical compound-card action area. Log Dose is the only action people do daily —
// History, Calendar, and Schedule are all occasional-at-best, so they live inside More
// rather than competing for permanent visual space. When a dose is actually due, offer
// the full Log Dose / Reschedule / Skip choice — a dose not taken on time isn't always
// "missed," and the app shouldn't force that framing.
// After this many days overdue, the primary prompt stops pushing "+ LOG DOSE" (which
// implies logging it fresh, right now, at full dose) and switches to "WHAT HAPPENED?" —
// repeatedly showing OVERDUE with a growing counter past this point isn't informative
// anymore, it's just noise. Never auto-resolves anything by itself; it only changes which
// question gets asked first. 3 days is long enough that a same-day or next-day catch-up
// (the common, unremarkable case) still just sees the normal Log Dose flow.
const OVERDUE_AGED_DAYS = 3;
function renderCompoundActionArea(name, data, c, doses, doseStatus) {
  const isDue = doseStatus && ["due_now","due_later_today","overdue"].includes(doseStatus.status);
  const showScheduledLog = !!doseStatus?.showLogBtn;
  const isAgedOverdue = doseStatus?.status === "overdue" && (doseStatus.daysLate>=OVERDUE_AGED_DAYS || (doseStatus.hoursLate||0)/24>=OVERDUE_AGED_DAYS);
  if (doseStatus?.status === "taken_today") {
    const recorded = doses[0];
    const recordedTime = recorded?.date ? ` · ${esc(new Date(recorded.date).toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"}))}` : "";
    return `<div class="nx-today-completion-actions">
      <div class="nx-today-completion-status" role="status"><span class="nx-today-completion-icon" aria-hidden="true">✓</span><span><strong>Dose completed</strong><small>Scheduled entry recorded${recordedTime}</small></span></div>
      ${recorded?.id!=null?`<button type="button" class="nx-today-record-reaction" data-name="${esc(name)}" data-id="${esc(String(recorded.id))}" aria-label="Record reaction for most recent ${esc(name)} dose">Record reaction</button>`:""}
      <button class="moremenu nx-today-completion-more" data-name="${esc(name)}" aria-expanded="false" aria-label="More actions for ${esc(name)}">More actions</button>
    </div>`;
  }
  if (doseStatus?.status === "skipped") {
    return `<div style="margin-bottom:8px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;padding:10px 12px;background:var(--surface-2);border-radius:10px;margin-bottom:6px">
        <span style="font-size:12px;color:var(--t3);font-weight:600">✕ ${esc(doseStatus.label)}</span>
        ${doseStatus.nextDueStr?`<span style="font-size:11px;color:var(--t4)">Next · ${esc(fmtDate(doseStatus.nextDueStr))}</span>`:""}
      </div>
      <div style="display:flex;gap:8px">
        <button class="undoskip" data-name="${esc(name)}" data-date="${esc(doseStatus.skippedDate)}" style="flex:1;min-height:40px;background:transparent;border:1px solid var(--border-sub);border-radius:9px;color:var(--t4);font-size:11px;font-weight:600">Undo Skip</button>
        <button class="moremenu" aria-expanded="false" data-name="${esc(name)}" title="More actions" aria-label="More actions for ${esc(name)}" style="min-width:44px;min-height:40px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border-sub);border-radius:9px;color:var(--t4);font-size:12px;font-weight:650;line-height:1.2">More actions</button>
      </div>
    </div>`;
  }
  // Rescheduled is NOT a terminal state — it's still one pending occurrence whose due
  // date has moved. It must keep offering Log (if due today)/Reschedule again/Skip,
  // exactly like any other pending dose — never collapse to just Log + More.
  if (doseStatus?.status === "rescheduled") {
    return `<div style="margin-bottom:8px">
      ${doseStatus.showLogBtn?`<button class="logdose" data-name="${esc(name)}" style="width:100%;min-height:44px;background:${c.color};color:#000;border-radius:10px;padding:10px 14px;font-weight:700;font-size:12px;letter-spacing:1px;margin-bottom:6px">+ LOG DOSE</button>`:""}
      <div style="display:flex;gap:8px">
        <button class="rescheduledose" data-name="${esc(name)}" data-date="${esc(doseStatus.nextDueStr)}" style="flex:1;min-height:40px;background:transparent;border:1px solid #A78BFA44;border-radius:9px;color:#A78BFA;font-size:11px;font-weight:600">↺ Reschedule again</button>
        <button class="skipdose" data-name="${esc(name)}" data-date="${esc(doseStatus.nextDueStr)}" style="flex:1;min-height:40px;background:transparent;border:1px solid var(--border-sub);border-radius:9px;color:var(--t4);font-size:11px;font-weight:600">Skip / Miss</button>
        <button class="moremenu" aria-expanded="false" data-name="${esc(name)}" title="More actions" aria-label="More actions for ${esc(name)}" style="min-width:44px;min-height:40px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border-sub);border-radius:9px;color:var(--t4);font-size:12px;font-weight:650;line-height:1.2">More actions</button>
      </div>
    </div>`;
  }
  if (isDue) {
    const isOverdue = doseStatus.status === "overdue";
    return `<div style="margin-bottom:8px">
      ${isAgedOverdue
        ? `<button class="whathappened" data-name="${esc(name)}" data-date="${esc(doseStatus.nextDueStr)}" style="width:100%;min-height:44px;background:#F9C87D22;border:1px solid #F9C87D66;color:#F9C87D;border-radius:10px;padding:10px 14px;font-weight:700;font-size:12px;letter-spacing:1px;margin-bottom:6px">⚠ WHAT HAPPENED?</button>`
        : showScheduledLog ? `<button class="logdose" data-name="${esc(name)}" style="width:100%;min-height:44px;background:${c.color};color:#000;border-radius:10px;padding:10px 14px;font-weight:700;font-size:12px;letter-spacing:1px;margin-bottom:6px">+ LOG DOSE</button>` : ""}
      <div class="nx-dose-contextual-actions" style="display:flex;gap:8px">
        ${isAgedOverdue ? "" : isOverdue
          ? `<button class="resolveoverdue" data-name="${esc(name)}" data-date="${esc(doseStatus.nextDueStr)}" style="flex:1;min-height:44px;background:transparent;border:1px solid var(--border-sub);border-radius:10px;color:var(--t3);font-size:12px;font-weight:600">Resolve overdue</button>`
          : `<button class="rescheduledose" data-name="${esc(name)}" data-date="${esc(doseStatus.nextDueStr)}" style="flex:1;min-height:44px;background:transparent;border:1px solid var(--border-sub);border-radius:10px;color:var(--t3);font-size:12px;font-weight:600">Reschedule</button>`}
        <button class="moremenu" aria-expanded="false" data-name="${esc(name)}" title="More actions" aria-label="More actions for ${esc(name)}" style="min-width:44px;min-height:40px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border-sub);border-radius:9px;color:var(--t4);font-size:12px;font-weight:650;line-height:1.2">More actions</button>
      </div>
    </div>`;
  }
  // A completed, upcoming or paused occurrence should not imply another scheduled dose.
  // Unscheduled and retrospective logging remains available via existing app workflows.
  return `<div class="nx-dose-secondary-only" style="display:flex;gap:8px;align-items:stretch;margin-bottom:8px">
      <button class="moremenu" aria-expanded="false" data-name="${esc(name)}" title="More actions" aria-label="More actions for ${esc(name)}" style="min-width:44px;min-height:44px;flex:1;display:flex;align-items:center;justify-content:center;background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;color:var(--t3);font-size:12px;font-weight:600">More actions ···</button>
    </div>`;
}

// ─── Shared compact compound-card component ─────────────────────────────────
// Compact is the default; expanding reveals the EXISTING peptideCardHTML content
// unchanged, so every action (History, Calendar, Schedule, More, Pause, dose edit/
// delete) keeps working exactly as before — this only changes what's visible by default.
function isCompoundRelevantToday(doseStatus) {
  const today = localDate();
  if (["due_now","due_later_today","overdue"].includes(doseStatus.status)) return "needs_action";
  if (doseStatus.status==="taken_today") return "completed";
  if (doseStatus.status==="skipped" && doseStatus.skippedDate && dayKey(doseStatus.skippedDate)===today) return "completed";
  if (doseStatus.status==="rescheduled" && doseStatus.rescheduledTo && dayKey(doseStatus.rescheduledTo)===today) return "needs_action";
  return null;
}

// Shared visual content for compact and expanded Today disclosures.
// Keep both states structurally identical; only the label and chevron direction change.
function nxTodayDisclosureInner(expanded) {
  return `<span class="nx-today-disclosure-text">${expanded?"Hide details":"View details"}</span><svg class="nx-today-disclosure-icon${expanded?" nx-today-disclosure-icon-up":""}" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
}

function renderCompoundCardCompact(name, data, view, isUpNext) {
  view = view || "active";
  const c = cfg(name);
  const status = data.status || "active";
  // Defensive: state can be reloaded from JSON (import/backup/restore), which always
  // turns a Set into a plain object — never trust it's still a real Set here.
  const expandedSet = (state._todayExpandedCompounds instanceof Set) ? state._todayExpandedCompounds : new Set();
  // Expansion is keyed by BOTH the compound AND the view/context it's being rendered in
  // (e.g. "upcoming::Retatrutide" vs "active::Retatrutide") — the same compound can appear
  // in multiple views at once (Today, Active, Upcoming, All) and expanding it in one must
  // never expand it in another.
  const cardKey = view + "::" + name;
  const isExpanded = expandedSet.has(cardKey);

  // Expanded state IS the full card — no extra outer wrapper/padding/border layered on
  // top of peptideCardHTML's own card, which was creating the card-inside-a-card look.
  if (isExpanded) return peptideCardHTML(name, data, {showCollapseChevron:true, view});

  if (status === "paused") {
    return `<div class="card nx-compound-card" style="padding:14px 16px;margin-bottom:8px;border-color:#F9C87D33;opacity:0.85">
      <div class="compound-compact-tap nx-compound-header" data-name="${esc(name)}" data-view="${esc(view)}" role="button" tabindex="0" aria-expanded="false" aria-label="View details for ${esc(name)}" style="display:flex;align-items:center;gap:10px;cursor:pointer;min-height:44px">
        <div style="width:7px;height:7px;border-radius:50%;background:#555;flex-shrink:0"></div>
        <span class="nx-today-compound-name" style="flex:1;min-width:0">${esc(name)}</span>
        ${statusBadge("⏸ Paused","warning")}
        <span class="nx-compact-disclosure nx-today-disclosure" aria-hidden="true">${nxTodayDisclosureInner(false)}</span>
      </div>
      <button class="resumepep" data-name="${esc(name)}" style="width:100%;min-height:36px;margin-top:8px;background:#F9C87D18;border:1px solid #F9C87D44;color:#F9C87D;border-radius:8px;font-size:11px;font-weight:600">▶ Resume</button>
    </div>`;
  }

  const doses = [...(data.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const last = doses[0];
  const doseStatus = getDoseStatus(name, data);
  const since = last ? daysSince(last.date) : null;
  const siteWarn = data.route!=="Nasal" ? siteRotationWarning(doses) : null; // lipohypertrophy is an injection-tissue risk, not applicable to nostril alternation
  const escalation = escalationReadiness(name, data);
  const trough = c.troughDay && since!=null && since>=c.troughDay && doseStatus.left!==null && doseStatus.left>0;
  // Prefer a specific, meaningful reason over a generic catch-all — "Needs attention" is
  // reserved for cases with no better description available.
  let attentionLabel = null;
  if (trough) attentionLabel = "Winding Down";
  else if (siteWarn) attentionLabel = `Repeated site use · ${siteWarn.countInLast5} of last 5`;
  else if (escalation && escalation.signal==="may_be_ready") attentionLabel = "Protocol review";

  // Via scheduleLabel (phase-aware) rather than re-deriving from the top-level fields — this
  // line used to read data.scheduleDays directly, which is why Placenta said "Daily" while
  // actually on weekly Sunday maintenance. Same capitalisation as before ("Daily", "Weekly",
  // "Every 2 wks"); weekday sets like "Sun/Tue/Thu" are untouched.
  const freqLabel = (() => { const l = scheduleLabel(data); return /^[a-z]/.test(l) ? l.charAt(0).toUpperCase()+l.slice(1) : l; })();
  const doseAmount = last?.dose ? `${esc(last.dose)} ${esc(c.unit)}` : "";

  const statusColors = { taken_today:c.color, skipped:"var(--t4)", rescheduled:"#A78BFA", overdue:"#ff7c7c", due_now:"#F9C87D", due_later_today:"#F9C87D", upcoming:"var(--t4)", no_doses:"var(--t5)" };
  const statusPrefix = { taken_today:"✓ ", skipped:"✕ ", rescheduled:"↺ " };
  const statusLine = (statusPrefix[doseStatus.status]||"") + doseStatus.label;
  const statusColor = statusColors[doseStatus.status] || "var(--t4)";

  const nextDateLabel = doseStatus.nextDueStr ? fmtShort(doseStatus.nextDueStr) : (doseStatus.status==="taken_today" ? "Completed today" : "Not scheduled");
  const lastDateLabel = last ? fmtShort(dayKey(new Date(last.date).getTime())) : "No recorded dose";
  const dueBadge = doseStatus.status==="overdue" ? "Overdue" : doseStatus.status==="taken_today" ? "Logged" : doseStatus.status==="due_now" || doseStatus.status==="due_later_today" ? "Due today" : doseStatus.status==="rescheduled" ? "Rescheduled" : doseStatus.status==="skipped" ? "Skipped" : "Upcoming";
  return `<div class="card nx-compound-card" style="margin-bottom:9px;${isUpNext?`box-shadow:0 0 0 1px ${statusColor}33`:""}">
    <div class="compound-compact-tap nx-compound-header" data-name="${esc(name)}" data-view="${esc(view)}" role="button" tabindex="0" aria-expanded="false" aria-label="View details for ${esc(name)}" style="cursor:pointer">
      <div class="nx-card-top"><div>
        <div class="nx-card-title"><strong class="nx-today-compound-name">${esc(name)}</strong><span class="nx-card-status" style="border-color:${statusColor}55;color:${statusColor}">${esc(dueBadge)}</span></div>
        <div class="nx-card-frequency">${esc(freqLabel)}</div>
      </div><span class="nx-compact-disclosure nx-today-disclosure" aria-hidden="true">${nxTodayDisclosureInner(false)}</span></div>
      <div class="nx-card-facts">
        <div><div class="nx-card-fact-label">Last recorded</div><div class="nx-card-fact-value">${esc(lastDateLabel)}${doseAmount?` · ${doseAmount}`:""}</div></div>
        <div><div class="nx-card-fact-label">Next scheduled</div><div class="nx-card-fact-value">${esc(nextDateLabel)}</div></div>
      </div>
      ${attentionLabel?`<div style="font-size:11px;color:var(--t4);margin-top:9px">${esc(attentionLabel)}</div>`:""}
    </div>
    ${doseStatus.status==="taken_today" ? `<div class="nx-compound-completed" role="status"><span aria-hidden="true">✓</span> Scheduled entry recorded</div>` : ""}
    ${doseStatus.showLogBtn || (doseStatus.nextDueStr && !["taken_today","skipped","overdue"].includes(doseStatus.status)) ? `<div class="nx-compound-actions">
      ${doseStatus.showLogBtn ? (doseStatus.status==="overdue" && (doseStatus.daysLate>=OVERDUE_AGED_DAYS || (doseStatus.hoursLate||0)/24>=OVERDUE_AGED_DAYS)
        ? `<button class="whathappened nx-compound-primary" data-name="${esc(name)}" data-date="${esc(doseStatus.nextDueStr)}" style="--nx-compound-accent:${c.color}">What happened?</button>`
        : `<button class="logdose nx-compound-primary" data-name="${esc(name)}" style="--nx-compound-accent:${c.color}">Log dose</button>`) : ""}
      ${doseStatus.nextDueStr && !["taken_today","skipped","overdue"].includes(doseStatus.status)?`<button class="rescheduledose nx-compound-secondary" data-name="${esc(name)}" data-date="${esc(doseStatus.nextDueStr)}">Reschedule</button>`:""}
    </div>` : ""}
  </div>`;
}

function getUpcomingEvents(started, limit) {
  const today = localDate();
  const events = started.map(([n,d])=>{
    const ds = getDoseStatus(n,d);
    if (isCompoundRelevantToday(ds)) return null; // already covered by the Today section
    const dueDate = ds.nextDueStr || (ds.nextDueMs?dayKey(ds.nextDueMs):null);
    if (!dueDate || dueDate<=today) return null;
    const lastDose=(d.doses||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    return { name:n, date:dueDate, dose:lastDose?.dose, unit:cfg(n).unit, color:cfg(n).color };
  }).filter(Boolean).sort((a,b)=>a.date.localeCompare(b.date));
  return limit ? events.slice(0,limit) : events;
}

function renderUpcomingPreview(started) {
  const events = getUpcomingEvents(started, 3);
  if (!events.length) return "";
  const dateLabel = date => new Date(date + "T12:00:00").toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"});
  const summary = `${dateLabel(events[0].date)} · ${esc(events[0].name)}${events.length>1?` · +${events.length-1} more`:""}`;
  return `<details class="nexus-lookahead nexus-quiet-details nx-today-text-disclosure" aria-label="Coming up next">
    <summary><span><strong>Coming up</strong><small>${summary}</small></span><span class="nx-today-disclosure-label" aria-hidden="true">View schedule</span></summary>
    <div class="nexus-quiet-expanded"><div class="nexus-lookahead-list">${events.map(e=>`<button type="button" class="upcoming-row nexus-lookahead-row" data-name="${esc(e.name)}" aria-label="View ${esc(e.name)} scheduled ${dateLabel(e.date)}"><span class="nexus-lookahead-date">${dateLabel(e.date)}</span><span class="nexus-lookahead-name">${esc(e.name)}</span><span class="nexus-lookahead-arrow" aria-hidden="true">›</span></button>`).join("")}</div>
      <div class="nexus-quiet-expanded-footer"><span>Planned, not logged</span><button type="button" id="view-upcoming" class="nexus-text-action">See all →</button></div></div>
  </details>`;
}

function renderSinceLastVisit() {
  if (!sinceLastVisitSummary) return "";
  return `<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:12px;padding:12px 14px;margin-bottom:12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px">SINCE YOUR LAST VISIT</span>
      <button id="dismiss-lastvisit" style="color:var(--t5);font-size:13px;background:transparent;border:none;padding:2px 6px">✕</button>
    </div>
    ${sinceLastVisitSummary.map(b=>`<div style="font-size:12px;color:var(--t2);padding:1px 0">• ${esc(b)}</div>`).join("")}
  </div>`;
}

function renderTodayCompoundSection(started) {
  const needsAction = [], completed = [];
  started.forEach(pair=>{
    const [n,d] = pair;
    const cat = isCompoundRelevantToday(getDoseStatus(n,d));
    if (cat==="needs_action") needsAction.push(pair);
    else if (cat==="completed") completed.push(pair);
  });
  // Sort Due/Needs Action by actual dose-INSTANCE urgency, not compound order — this is
  // what makes the top of Today read as "what do I need to do next" instead of a static
  // list. Priority: overdue (oldest first) → due now → due later today, chronological.
  // Uses nextDueDate() rather than assuming "today" specifically, because an occurrence
  // that's been overdue for days belongs to its own original due date, not today's
  // calendar day — getDayOccurrences(d, today) would find nothing for it at all.
  // Secondary sorts and the CARD'S OWN displayed status text both come from this exact
  // same occurrence, so a card can never be sorted as overdue while its label says
  // "due tonight" — they're reading the same slot.
  const nextInstanceFor = (d) => {
    const nextDate = nextDueDate(d);
    if (!nextDate) return null;
    const pending = getDayOccurrences(d, nextDate).filter(s=>["overdue","due_now","due_later_today","upcoming"].includes(s.status));
    if (!pending.length) return null;
    return pending.sort((a,b)=>cmpSlotTime(a.time,b.time))[0];
  };
  const sortKeyFor = ([,d]) => {
    const slot = nextInstanceFor(d);
    if (!slot) return [5, Infinity];
    const tier = slot.status==="overdue"?0 : slot.status==="due_now"?1 : slot.status==="due_later_today"?2 : 3;
    return [tier, new Date(slot.dateTime).getTime()];
  };
  needsAction.sort((a,b)=>{ const A=sortKeyFor(a), B=sortKeyFor(b); return A[0]-B[0] || A[1]-B[1]; });
  // "Actions today" counts actual pending dose OCCURRENCES, not compounds — a twice-daily
  // compound with one dose still due contributes 1 to this count, not a whole extra
  // compound's worth, and doesn't get double-counted if BOTH its doses are still pending.
  // This is the same occurrence-level definition Up Next, sorting, and This Week all
  // already use; nothing here computes its own separate notion of "how many things are
  // due today."
  const occurrenceCount = needsAction.reduce((sum,[,d])=>{
    const nextDate = nextDueDate(d);
    if (!nextDate) return sum;
    return sum + getDayOccurrences(d, nextDate).filter(s=>["overdue","due_now","due_later_today","upcoming"].includes(s.status)).length;
  }, 0);
  let out = ``;
  // Prepared-syringe match — purely a convenience surfaced ON TOP of whatever's already
  // due; it never changes due/overdue status itself. The protocol schedule alone decides
  // that (per the canonical occurrence engine above) — a prepared syringe existing is
  // never allowed to make something "due" that wasn't already due. Matches when every
  // compound in a ready mixed syringe is currently among today's due/needs-action items.
  const dueNames = new Set(needsAction.map(([n])=>n));
  const matchingSyringe = (state.preparedDoses||[]).find(pd=>{
    if ((pd.remainingCount||0)<=0) return false;
    const comps = getSyringeComponents(pd);
    return comps.length>1 && comps.every(c=>dueNames.has(c.compoundName));
  });
  if (matchingSyringe) {
    const comps = getSyringeComponents(matchingSyringe);
    const label = comps.map(c=>c.compoundName).join(" + ");
    out += `<button class="use-matching-syringe" data-id="${matchingSyringe.id}" style="display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;padding:12px 14px;border-radius:12px;background:#A78BFA0d;border:1px solid #A78BFA33;margin-bottom:14px">
      <div><div style="font-size:13px;font-weight:600;color:#A78BFA">💉 Prepared syringe ready</div><div style="font-size:11px;color:var(--t4);margin-top:2px">${esc(label)} — fulfills both scheduled doses</div></div>
      <span style="color:#A78BFA;font-size:12px;font-weight:600">Administer →</span>
    </button>`;
  }
  if (needsAction.length) {
    out += `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin-bottom:8px">DUE / NEEDS ACTION</div>`;
    out += needsAction.map(([n,d],i)=>renderCompoundCardCompact(n,d,"today",i===0)).join("");
  }
  if (completed.length) {
    out += `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin:${needsAction.length?"16":"0"}px 0 8px">COMPLETED TODAY</div>`;
    out += completed.map(([n,d])=>renderCompoundCardCompact(n,d,"today")).join("");
  }
  if (!needsAction.length && !completed.length) {
    out += `<div style="text-align:center;padding:16px 0;color:var(--t4);font-size:13px">Nothing due today.</div>`;
  }
  // Single prospective schedule preview now lives at the bottom of Today in homeView().
  return out;
}

function renderUpcomingFullView(started) {
  // Same data source as getUpcomingEvents (compounds with a future nextDue that isn't
  // relevant today), but keeps the actual [name, data] pair instead of a flattened event
  // object, so each entry can be rendered as a REAL, independently-expandable compound
  // card via renderCompoundCardCompact(...,"upcoming") — not a static row with no
  // in-place expansion. This is what makes "tap Retatrutide in Upcoming" actually expand
  // it here, in Upcoming's own state, rather than doing nothing visible.
  const today = localDate();
  const withDate = started.map(([n,d])=>{
    const ds = getDoseStatus(n,d);
    if (isCompoundRelevantToday(ds)) return null;
    const dueDate = ds.nextDueStr || (ds.nextDueMs?dayKey(ds.nextDueMs):null);
    if (!dueDate || dueDate<=today) return null;
    return {n,d,date:dueDate};
  }).filter(Boolean).sort((a,b)=>a.date.localeCompare(b.date));
  if (!withDate.length) return `<div style="text-align:center;padding:30px 0;color:var(--t4);font-size:13px">Nothing scheduled beyond today.</div>`;
  const tomorrow = addDays(today,1);
  const byDate = {};
  withDate.forEach(e=>{ (byDate[e.date]=byDate[e.date]||[]).push(e); });
  return Object.entries(byDate).map(([date,evs])=>{
    const label = date===tomorrow ? "TOMORROW" : `${new Date(date+"T12:00").toLocaleDateString("en-CA",{weekday:"long"}).toUpperCase()} · ${fmtShort(date)}`;
    return `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin:16px 0 8px">${esc(label)}</div>
    ${evs.map(e=>renderCompoundCardCompact(e.n, e.d, "upcoming")).join("")}`;
  }).join("");
}

// Completed means recorded or explicitly skipped TODAY, not all historical doses.
// Retain the same compact/expanded card actions, including Record reaction.
function renderCompletedFullView(started) {
  const completed=started.filter(([name,data])=>isCompoundRelevantToday(getDoseStatus(name,data))==="completed");
  completed.sort((a,b)=>{
    const aDate=(a[1].doses||[]).slice().sort((x,y)=>new Date(y.date)-new Date(x.date))[0]?.date||"";
    const bDate=(b[1].doses||[]).slice().sort((x,y)=>new Date(y.date)-new Date(x.date))[0]?.date||"";
    return new Date(bDate)-new Date(aDate);
  });
  if(!completed.length)return `<div class="nx-completed-empty" role="status" style="padding:24px 16px;text-align:center;color:var(--t4);font-size:13px">No completed doses today. Once a dose is recorded, it will appear here.</div>`;
  return `<div class="nexus-today-section-label" style="margin-bottom:10px">COMPLETED TODAY · ${completed.length}</div>`+
    completed.map(([name,data])=>renderCompoundCardCompact(name,data,"completed")).join("");
}

function renderActiveFullView(started) {
  if (!started.length) return `<div style="text-align:center;padding:20px 0"><div style="color:var(--t4);font-size:13px;margin-bottom:10px">No active compounds yet.</div><button id="empty-setup-protocol" style="padding:9px 16px;border-radius:10px;background:#A78BFA;color:#fff;font-size:12px;font-weight:600">Set up your first protocol</button></div>`;
  return `<div style="font-size:11px;color:var(--t4);margin-bottom:10px">${started.length} active</div>` + started.map(([n,d])=>renderCompoundCardCompact(n,d,"active")).join("");
}

function renderAllFullView(started, notStarted, paused) {
  const statusFilter = state._allStatusFilter || "any";
  const chip = (key,label,count) => `<button class="all-status-chip" data-status="${key}" style="flex:0 0 auto;padding:6px 12px;border-radius:8px;font-size:11px;font-weight:600;background:${statusFilter===key?"var(--surface-3)":"transparent"};border:1px solid ${statusFilter===key?"var(--border)":"var(--border-sub)"};color:${statusFilter===key?"var(--t1)":"var(--t4)"};min-height:32px">${label}${count?` ${count}`:""}</button>`;
  let out = `<div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:14px;padding-bottom:2px">
    ${chip("any","Any")}
    ${chip("active","Active",started.length||"")}
    ${chip("notstarted","Not Started",notStarted.length||"")}
    ${chip("paused","Paused",paused.length||"")}
  </div>`;
  const showActive = statusFilter==="any"||statusFilter==="active";
  const showNotStarted = statusFilter==="any"||statusFilter==="notstarted";
  const showPaused = statusFilter==="any"||statusFilter==="paused";

  let body = "";
  if (showActive && started.length) {
    body += `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin-bottom:8px">ACTIVE (${started.length})</div>`;
    body += started.map(([n,d])=>renderCompoundCardCompact(n,d,"all")).join("");
  }
  if (showNotStarted && notStarted.length) {
    body += `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin:${body?"16":"0"}px 0 8px">NOT STARTED (${notStarted.length})</div>`;
    body += notStarted.map(([n])=>{
      const c=cfg(n);
      return `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;margin-bottom:8px"><div style="width:8px;height:8px;border-radius:50%;background:${c.color};opacity:0.5;flex-shrink:0"></div><span class="mono" style="font-size:13px;color:var(--t3);flex:1">${esc(n)}</span><button class="logdose" data-name="${esc(n)}" style="background:${c.color}18;border:1px solid ${c.color}44;color:${c.color};border-radius:8px;padding:7px 12px;font-size:11px;font-weight:600">+ First dose</button><button class="archivepep" data-name="${esc(n)}" aria-label="Remove ${esc(n)} from tracker" title="Remove from tracker" style="min-width:32px;min-height:32px;display:inline-flex;align-items:center;justify-content:center;color:var(--t5);font-size:14px;padding:4px 7px;border-radius:6px;border:1px solid var(--border-sub)">✕</button></div>`;
    }).join("");
  }
  if (showPaused && paused.length) {
    body += `<div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin:${body?"16":"0"}px 0 8px">PAUSED (${paused.length})</div>`;
    body += paused.map(([n,d])=>renderCompoundCardCompact(n,d,"all")).join("");
  }
  if (!body) body = `<div style="text-align:center;padding:20px 0;color:var(--t4);font-size:13px">Nothing here for this status.</div>`;
  return out + body;
}

