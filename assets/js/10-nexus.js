function stashView() {
  const filter = state._stashFilter || "all";
  const sort = state._stashSort || "attention";
  const group = state._stashGroup || "none";
  const currency = state._stashCurrency || "CAD";
  const aps = allPeptides();

  // ── Filter ────────────────────────────────────────────────────────────────
  let entries = [...state.supplies];
  const preparedCompoundNames = new Set((state.preparedDoses||[]).filter(pd=>pd.remainingCount>0).flatMap(pd=>getSyringeComponents(pd).map(c=>c.compoundName)));
  if (filter!=="all") {
    entries = entries.filter(s=>{
      const st = computeKitStatus(s);
      if (filter==="active") return !!s.activeKit;
      if (filter==="attention") return st.needsAttention;
      if (filter==="low") return st.statusKey==="low";
      if (filter==="expiring") return st.statusKey==="expiring" || st.statusKey==="empty" && st.expiryDaysLeft!==null && st.expiryDaysLeft<0;
      if (filter==="stored") return st.statusKey==="stored";
      if (filter==="prepared") return preparedCompoundNames.has(s.name);
      if (filter==="finished") return st.statusKey==="done";
      return true;
    });
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  const attentionRank = k => ({empty:0,expiring:1,low:2,healthy:3,stored:4,done:5}[k] ?? 6);
  if (sort==="attention")        entries.sort((a,b)=>attentionRank(computeKitStatus(a).statusKey)-attentionRank(computeKitStatus(b).statusKey));
  else if (sort==="expiry")      entries.sort((a,b)=>stashExpiryMs(a)-stashExpiryMs(b));
  else if (sort==="remaining_low")  entries.sort((a,b)=>getKitRemainingMg(a)-getKitRemainingMg(b));
  else if (sort==="remaining_high") entries.sort((a,b)=>getKitRemainingMg(b)-getKitRemainingMg(a));
  else if (sort==="remaining_pct_low")  entries.sort((a,b)=>stashRemPct(a,aps)-stashRemPct(b,aps));
  else if (sort==="remaining_pct_high") entries.sort((a,b)=>stashRemPct(b,aps)-stashRemPct(a,aps));
  else if (sort==="doses_left")  entries.sort((a,b)=>getEstimatedDosesLeft(a)-getEstimatedDosesLeft(b));
  else if (sort==="recon_recent") entries.sort((a,b)=>new Date(b.reconDate||0)-new Date(a.reconDate||0));
  else if (sort==="recon_oldest") entries.sort((a,b)=>new Date(a.reconDate||"9999-12-31")-new Date(b.reconDate||"9999-12-31"));
  else if (sort==="last_used")   entries.sort((a,b)=>{ const la=[...(aps[a.name]?.doses||[])].sort((x,y)=>new Date(y.date)-new Date(x.date))[0], lb=[...(aps[b.name]?.doses||[])].sort((x,y)=>new Date(y.date)-new Date(x.date))[0]; return new Date(lb?.date||0)-new Date(la?.date||0); });
  else if (sort==="name_az")     entries.sort((a,b)=>a.name.localeCompare(b.name));
  else if (sort==="name_za")     entries.sort((a,b)=>b.name.localeCompare(a.name));
  else if (sort==="cost_high")   entries.sort((a,b)=>(parseFloat(b.cost)||0)-(parseFloat(a.cost)||0));
  else if (sort==="cost_low")    entries.sort((a,b)=>(parseFloat(a.cost)||0)-(parseFloat(b.cost)||0));

  // Total invested
  const totalCost = state.supplies.reduce((acc,s)=>acc+(parseFloat(s.cost)||0),0);

  const FILTER_LABELS = {all:"All",active:"Active/Open",attention:"Needs Attention",low:"Low",expiring:"Expiring/Expired",stored:"Stored/Sealed",prepared:"Has Prepared Doses",finished:"Finished/Discarded"};
  const SORT_LABELS = {attention:"Needs Attention first",expiry:"Expiry soonest",remaining_low:"Remaining: low → high",remaining_high:"Remaining: high → low",remaining_pct_low:"Remaining %: low → high",remaining_pct_high:"Remaining %: high → low",doses_left:"Fewest doses left",recon_recent:"Most recently reconstituted",recon_oldest:"Oldest reconstituted",last_used:"Most recently used",name_az:"Name A–Z",name_za:"Name Z–A",cost_high:"Cost high → low",cost_low:"Cost low → high"};

  const stashSub = state._stashSub || "kits";
  const stashSubBtn=(id,label)=>toggleChip(label, stashSub===id, {attrs:`class="stash-sub-btn" data-sub="${id}"`, padding:"9px"});
  let html = `<h1 class="serif greet">Stash</h1>
  <div style="display:flex;gap:6px;margin-bottom:16px">
    ${stashSubBtn("kits","Compound kits")}
    ${stashSubBtn("equipment","Supplies")}
  </div>
`;

  if(stashSub==="equipment") return html + equipmentView();

  // ── Inventory health summary ─────────────────────────────────────────────
  // Counted across ALL kits regardless of the current filter — this is a snapshot of
  // the whole stash, not "what's currently visible." Total Invested moves to a quieter,
  // secondary line — operational health (what needs a decision) matters more day-to-day
  // than historical spend.
  const allStatuses = state.supplies.map(computeKitStatus);
  const activeCount = allStatuses.filter(st=>st.statusKey!=="stored"&&st.statusKey!=="done").length;
  const storedCount = allStatuses.filter(st=>st.statusKey==="stored").length;
  const attentionCount = allStatuses.filter(st=>st.needsAttention).length;
  html += `<section class="nx-stash-hero" aria-label="Inventory overview"><div class="nx-stash-hero-title">Inventory overview</div><div class="nx-stash-stats">
    <div class="nx-stash-stat"><strong>${activeCount}</strong><span>Active</span></div>
    <div class="nx-stash-stat"><strong>${storedCount}</strong><span>Stored</span></div>
    <div class="nx-stash-stat attention"><strong>${attentionCount}</strong><span>Needs attention</span></div>
  </div>${totalCost?`<div class="nx-stash-invested">${totalCost.toLocaleString("en-CA",{minimumFractionDigits:0,maximumFractionDigits:0})} ${currency} total invested</div>`:""}</section>`;

  // ── Quick Actions ─────────────────────────────────────────────────────────
  html += `<div class="nx-stash-actions">
    <button id="qa-addkit">＋ Add kit</button><button id="qa-prepare">Prepare</button><button id="qa-planner">Planner</button>
  </div>`;

  // ── Prepared (conditional) ───────────────────────────────────────────────
  const readyPrepared = (state.preparedDoses||[]).filter(pd=>(pd.remainingCount||0)>0);
  if (readyPrepared.length) {
    html += `<button id="open-prepared-list" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:12px;background:#A78BFA0d;border:1px solid #A78BFA33;margin-bottom:14px">
      <span style="font-size:13px;color:#A78BFA;font-weight:600">Prepared · ${readyPrepared.length} ${readyPrepared.length===1?"syringe":"syringes"} ready</span>
      <span style="color:#A78BFA">›</span>
    </button>`;
  }

  // ── Needs Attention (inventory-specific, conditional) ────────────────────
  // Uses the exact same computeKitStatus/getProtocolRemainingRequirement everything else
  // reads from — this section exists to translate status into an action, not to compute
  // anything new.
  const invNotices = [];
  state.supplies.forEach(s=>{
    const st = computeKitStatus(s);
    if (st.statusKey==="empty" && s.activeKit) {
      const dosesLeft = getEstimatedDosesLeft(s);
      if (dosesLeft < 1) invNotices.push({name:s.name, text:"Less than one scheduled dose remains in current vial.", action:"Open next vial", kitId:s.id, kind:"openvial"});
    } else if (st.statusKey==="expiring" && st.expiryDaysLeft!=null && st.expiryDaysLeft<0) {
      invNotices.push({name:s.name, text:"Current vial expired.", action:"Review vial", kitId:s.id, kind:"review"});
    }
  });
  (state.protocols||[]).filter(p=>["active","in_progress"].includes(p.status)).forEach(proto=>{
    (proto.compounds||[]).forEach(comp=>{
      const req = getProtocolRemainingRequirement(proto, comp);
      if (req.notStartedYet || req.totalMg<=0) return;
      const inv = getCompoundInventorySummary(comp.name);
      const usable = inv.totalMg + inv.preparedMg;
      if (usable < req.totalMg) invNotices.push({name:comp.name, text:`Current stash does not cover the remainder of the protocol.`, sub:`Short approximately ${(req.totalMg-usable).toFixed(0)}${req.unit}.`, action:"View coverage", kind:"coverage"});
    });
  });
  if (invNotices.length) {
    html += `<div style="margin-bottom:16px">
      <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">NEEDS ATTENTION</div>
      ${invNotices.map(n=>`<div style="background:#F9C87D0d;border:1px solid #F9C87D33;border-radius:10px;padding:12px 14px;margin-bottom:8px">
        <div style="font-size:13px;font-weight:600;color:var(--t1);margin-bottom:2px">${esc(n.name)}</div>
        <div style="font-size:12px;color:var(--t3)">${esc(n.text)}</div>
        ${n.sub?`<div style="font-size:12px;color:#F9C87D">${esc(n.sub)}</div>`:""}
        <button class="inv-notice-action" data-kind="${n.kind}" data-kit="${n.kitId||""}" data-name="${esc(n.name)}" style="margin-top:8px;font-size:11px;font-weight:600;color:#F9C87D;background:transparent;border:none;padding:0">${esc(n.action)} →</button>
      </div>`).join("")}
    </div>`;
  }

  html += `<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">YOUR KITS</div>
  <div style="display:flex;gap:8px;margin-bottom:16px">
    <button id="stash-filter-btn" style="flex:1;padding:9px 12px;border-radius:10px;background:${filter!=="all"?"var(--surface-3)":"var(--surface-2)"};border:1px solid ${filter!=="all"?"var(--t3)":"var(--border-sub)"};color:${filter!=="all"?"var(--t1)":"var(--t3)"};font-size:12px;font-weight:600;text-align:left;display:flex;align-items:center;justify-content:space-between">
      <span>Filter: ${esc(FILTER_LABELS[filter])}</span><span class="nx-chevron-slot" aria-hidden="true"></span>
    </button>
    <button id="stash-sort-btn" style="flex:1;padding:9px 12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:12px;font-weight:600;text-align:left;display:flex;align-items:center;justify-content:space-between">
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Sort: ${esc(SORT_LABELS[sort])}</span><span class="nx-chevron-slot" aria-hidden="true"></span>
    </button>
  </div>`;

  if (!entries.length) html += emptyState(filter==="all" ? "No kits tracked yet" : `Nothing matches "${FILTER_LABELS[filter]}"`, filter==="all" ? "Add your first compound kit to start tracking supply, doses, and expiry in one place." : "Try a different filter, or switch back to All.");

  const renderKitCard = (s) => {
    const c = cfg(s.name);
    const sameCompoundKits=state.supplies.filter(k=>k.name===s.name);
    const allCompDoses=(aps[s.name] ? (aps[s.name].doses||[]) : []);
    const compDoses = allCompDoses.filter(d=>d.dose&&parseFloat(d.dose)>0&&(d.kitId===s.id||(sameCompoundKits.length===1&&!d.kitId)));
    const conc = (parseFloat(s.vialMg||0)>0&&parseFloat(s.bacMl||0)>0) ? parseFloat(s.vialMg)/parseFloat(s.bacMl) : null;

    // ── Current reconstituted vial ─────────────────────────────────────────────
    const sCompUnit = cfg(s.name)?.unit || "mg";
    const currentReconDate = s.reconDate || null;
    // Both now read through the same canonical functions every other screen this session
    // was wired to — getActiveVial/getVialRemainingMg already handle a v2-migrated kit
    // correctly (remainingMg direct) and a not-yet-migrated one correctly (history-
    // derived), so this card never needs its own separate formula for the same number.
    // The previous version here recomputed "used from current vial" by re-scanning dose
    // history filtered by date, entirely independent of the vial's own authoritative
    // value — exactly the kind of second formula capable of quietly disagreeing with the
    // real number once a kit is migrated.
    const activeVialForCard = getActiveVial(s);
    const vialRem = activeVialForCard ? getVialRemainingMg(s, activeVialForCard) : null;
    const activeCapacityMg = activeVialForCard ? Number(activeVialForCard.vialMg||s.vialMg) : 0;
    const vialPct = activeCapacityMg>0 && vialRem!=null ? Math.max(0,Math.min(100,Math.round(vialRem/activeCapacityMg*100))) : null;
    // Separate from vialRem above — how much has been logged as OUTFLOW (waste/gift/
    // testing) against the current vial specifically, for the toggle link further down.
    // Untouched by the vialRem fix; this was never part of the competing-formula problem.
    const wasteFromCurrent = currentReconDate ? getKitActiveWasteMg(s, currentReconDate) : 0;
    const lastDoseAmt = compDoses.length ? doseToMg([...compDoses].sort((a,b)=>new Date(a.date)-new Date(b.date))[compDoses.length-1].dose, sCompUnit) : 0;
    const shotsRaw = (vialRem&&lastDoseAmt>0.01) ? Math.floor(vialRem/lastDoseAmt) : null;
    const shotsEst = (shotsRaw!=null && shotsRaw<=500) ? shotsRaw : null;

    // ── Expiry (also serves as the "reconstitute soon" signal — same underlying date, no duplicate calc) ──
    const expiryDate = currentReconDate&&s.expiryDays ? addDays(currentReconDate, s.expiryDays) : null;
    const expiryMs = expiryDate ? new Date(expiryDate).getTime() - Date.now() : null;
    const expiryDaysLeft = expiryMs !== null ? Math.ceil(expiryMs/86400000) : null;
    const expLabel = expiryDaysLeft===null?null:expiryDaysLeft<0?`Expired ${Math.abs(expiryDaysLeft)}d ago`:expiryDaysLeft===0?"Expires today":`Expires in ${expiryDaysLeft}d`;

    // ── Kit totals ─────────────────────────────────────────────────────────────
    const totalMg = (s.totalVials||0) * (s.vialMg||0);
    // When more than one kit shares this compound name (different vial strength,
    // different purchase, a leftover finished kit not yet deleted), the compound name
    // alone can't tell them apart on screen any more than it can in the data — show
    // strength + a stable position so it's visually unambiguous which card is which.
    const sameCompoundKitsSorted = (state.supplies||[]).filter(k=>k.name===s.name).sort((a,b)=>(a.id||0)-(b.id||0));
    const kitDisambigLabel = sameCompoundKitsSorted.length > 1
      ? `${s.vialMg||"?"} mg/vial · Kit ${sameCompoundKitsSorted.findIndex(k=>k.id===s.id)+1}` : null;
    // The single canonical kit-remaining function, same as every other screen — not a
    // third independent formula built from dose history and a waste sum. This is the
    // most visible number on the whole card; it must never be able to disagree with what
    // Log Dose, Prepare Dose, or any other screen just did to this kit's inventory.
    const kitRemMg = getKitRemainingMg(s);
    const vialList = ensureKitVials(s);
    const sealed = getSealedVials(s).length;
    // Transferred vials are deliberately excluded — this list is specifically about vials
    // that were actually reconstituted (have a recon date, a "used X mg" story to tell);
    // a vial that left the stash whole and sealed was never opened at all, and showing it
    // here with reconstitution-shaped fields would misrepresent what actually happened to it.
    const everOpenedVials = vialList.filter(v=>v.status!=="sealed" && v.status!=="transferred");
    const finishedVialsWithHistory = everOpenedVials.filter(v=>v.status==="finished"||v.status==="empty");
    const reconCount = everOpenedVials.length;

    // ── Supply Intelligence ──────────────────────────────────────────────────────
    const recentDoses=[...compDoses].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
    const avgDoseAmtRaw = recentDoses.length ? recentDoses.reduce((a,d)=>a+doseToMg(d.dose, sCompUnit),0)/recentDoses.length : 0;
    const avgDoseAmt = (recentDoses.length>=2 && avgDoseAmtRaw>0.01) ? avgDoseAmtRaw : 0;
    const scheduleDays = (allPeptides()[s.name]?.scheduleDays)||7;
    const mgPerWeek = avgDoseAmt>0 ? avgDoseAmt*(7/scheduleDays) : 0;
    const weeksRemainingRaw = (s.activeKit && kitRemMg>0 && mgPerWeek>0) ? kitRemMg/mgPerWeek : null;
    const weeksRemaining = (weeksRemainingRaw!=null && weeksRemainingRaw<=260) ? weeksRemainingRaw : null;
    const depletionDate = weeksRemaining!=null ? addDays(localDate(), Math.round(weeksRemaining*7)) : null;
    const isFrozenUnopened = !s.activeKit && !currentReconDate;

    // ── One status word, one next action — everything else is detail ───────────
    // Active/Stored is the primary signal (which kit am I actually using?) — health
    // status (Low/Expiring/Empty) only applies to the kit that's actually active.
    let statusKey;
    if (s.kitStatus==="done") statusKey="done";
    else if (!s.activeKit) statusKey="stored";
    else if ((vialRem!==null && vialRem<=0) || kitRemMg<=0) statusKey="empty";
    else if (expiryDaysLeft!==null && expiryDaysLeft<=5) statusKey="expiring";
    else if (vialPct!==null && vialPct<=20) statusKey="low";
    else statusKey="healthy";
    const st = STATUS_META[statusKey] || STATUS_META.stored;
    const statusTappable = statusKey==="stored"; // tap a Stored pill to make this the active kit

    // Open New Vial is always available — reconstituting ahead of time is normal,
    // not something gated behind running low. "First Vial" wording is only accurate when
    // this kit has GENUINELY never had a vial opened — checked against real vial history
    // (everOpenedVials), not just "is one currently active" — so undoing the current
    // vial's reconstitution (leaving a finished vial behind in history) correctly still
    // says "Open New Vial," never "First."
    let action = null;
    if (s.kitStatus==="done") action = {label:"Reopen kit", cls:"reopenkit"};
    else if (!currentReconDate && everOpenedVials.length===0) action = {label:"Open first vial", cls:"opennewvial"};
    else action = {label:"Open new vial", cls:"opennewvial"};
    const actionUrgent = statusKey==="empty"||statusKey==="low"||statusKey==="expiring";

    // Owned stock includes sealed reserves; progress applies only to an actual open vial.
    const displayKitMg = Number.isFinite(kitRemMg) ? kitRemMg : null;
    const displayOpenMg = activeVialForCard && vialRem!=null ? vialRem : null;
    const openCount = vialList.filter(v=>v.status==="active"||v.status==="open").length;
    const kitInventoryLabel = [sealed ? sealed+" sealed" : "", openCount ? openCount+" open" : ""].filter(Boolean).join(" · ") || "No available vials";

    const secondaryBits = [];
    if (shotsEst!=null) secondaryBits.push(`~${shotsEst} shots left`);
    if (expLabel) secondaryBits.push(expLabel);
    if (!currentReconDate && sealed>0) secondaryBits.push(`${sealed} vial${sealed===1?"":"s"} sealed`);

    return `<div class="card nx-kit-card" data-kit-id="${s.id}" style="border-color:var(--border-sub);margin-bottom:12px;padding:16px">
      <div class="nx-kit-heading" style="display:flex;align-items:center;gap:9px;margin-bottom:${kitDisambigLabel?"2":"10"}px">
        <div style="width:9px;height:9px;border-radius:50%;background:${c.color};flex-shrink:0"></div>
        <span style="font-size:16px;font-weight:700;color:var(--t1);letter-spacing:0.2px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${esc(s.name)}</span>
        ${statusTappable?statusBadge(st.label, st.color, {tappable:true, attrs:`class="toggleactivekit" data-id="${s.id}"`}):statusBadge(st.label, st.color)}
      </div>
      ${kitDisambigLabel?`<div class="mono" style="font-size:10.5px;color:var(--t4);margin-bottom:10px;padding-left:18px">${esc(kitDisambigLabel)}</div>`:""}

      <div class="nx-stash-inventory-summary" style="margin-bottom:12px">
        <div style="font-size:10px;letter-spacing:.5px;font-weight:650;color:var(--t4);margin-bottom:5px">KIT INVENTORY REMAINING</div>
        <div style="display:flex;align-items:baseline;gap:7px;flex-wrap:wrap">
          <span class="nx-kit-quantity" style="font-size:27px;font-weight:750;color:var(--t1);line-height:1.15">${displayKitMg!==null?displayKitMg.toFixed(displayKitMg%1===0?0:1):"—"}</span>
          <span style="font-size:13px;color:var(--t4)">mg across this kit</span>
        </div>
        <div style="font-size:12px;color:var(--t3);margin-top:6px">${kitInventoryLabel}</div>
      </div>
      ${displayOpenMg!==null ? `<div class="nx-stash-open-progress" style="margin:0 0 12px">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;margin-bottom:6px">
          <span style="font-size:12px;color:var(--t3)">Current open vial</span>
          <span style="font-size:12px;color:var(--t2);font-weight:650">${displayOpenMg.toFixed(displayOpenMg%1===0?0:1)} / ${activeCapacityMg} mg</span>
        </div>
        ${vialPct!==null?`<div role="progressbar" aria-label="Current vial remaining" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${vialPct}" style="height:6px;background:var(--surface-2);border-radius:7px;overflow:hidden"><div style="height:100%;width:${vialPct}%;background:${st.color};border-radius:7px"></div></div>`:""}
      </div>` : `<div class="nx-stash-sealed-note" style="font-size:12px;color:var(--t4);margin-bottom:12px">No vial currently open${isFrozenUnopened&&s.storageLocation?" · "+esc(s.storageLocation.replace("_"," ")):""}</div>`}
      ${secondaryBits.length?`<div style="font-size:11.5px;color:var(--t4);margin-bottom:12px">${secondaryBits.filter(x=>!x.includes(" sealed")).join(" · ")}</div>`:""}
      ${(()=>{ const pc=getPreparedRemainingCount(s.name, s.id); if(!pc) return ""; return `<div style="font-size:11px;color:#A78BFA;margin-bottom:10px">Prepared · ${pc} dose${pc===1?"":"s"} · ${mgToUnit(getPreparedRemainingMg(s.name, s.id), c.unit).toFixed(1)}${c.unit} ready to log</div>`; })()}

      ${action||s.reconDate?`<div class="nx-kit-actions" style="display:flex;gap:8px;margin-bottom:4px">
        ${action?`<button class="${action.cls}" data-id="${s.id}" style="flex:${s.reconDate?"1.3":"1"};padding:10px;border-radius:10px;background:${actionUrgent?c.color+"15":"transparent"};border:1px solid ${actionUrgent?c.color+"44":"var(--border)"};color:${actionUrgent?c.color:"var(--t3)"};font-size:13px;font-weight:600">${action.label}</button>`:""}
        ${s.reconDate?`<button class="preparedoses" data-name="${esc(s.name)}" aria-label="Prepare ${esc(s.name)} doses" style="flex:1;padding:10px;border-radius:10px;border:1px solid #A78BFA44;color:#A78BFA;font-size:13px;font-weight:600">Prepare</button>`:""}
        <button class="manage-kit-btn icon-btn" data-id="${s.id}" aria-label="Manage ${esc(s.name)} kit" title="Manage kit">⋯</button>
      </div>`:""}

      <details style="margin-top:8px">
        <summary style="font-size:13px;color:var(--t3);cursor:pointer;list-style:none;min-height:44px;display:flex;align-items:center;justify-content:space-between">Kit details & history</summary>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border-sub)">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:12px">
            ${s.cost?`<span style="font-size:11px;color:var(--t4);flex:1">${parseFloat(s.cost).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2})} ${s.currency||"CAD"}</span>`:`<span style="flex:1"></span>`}
            <button class="editsupply" data-id="${s.id}" aria-label="Edit ${esc(s.name)} kit" style="min-height:36px;display:inline-flex;align-items:center;border:1px solid var(--border);border-radius:6px;color:var(--t3);font-size:11px;padding:4px 10px">Edit</button>
            ${!s.reconDate&&sealed>0?`<button class="reconkit" data-id="${s.id}" aria-label="Reconstitute ${esc(s.name)} vial" style="min-height:36px;display:inline-flex;align-items:center;border:1px solid ${c.color}44;border-radius:6px;color:${c.color};font-size:11px;padding:4px 10px">Reconstitute</button>`:""}
            <button class="compound-intel-btn" data-name="${esc(s.name)}" aria-label="View ${esc(s.name)} Intel" style="min-height:36px;display:inline-flex;align-items:center;border:1px solid ${c.color}44;border-radius:6px;color:${c.color};font-size:11px;padding:4px 10px;background:${c.color}10">Intel ›</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
            <div><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:3px">KIT TOTAL</div><div style="font-size:12px;font-weight:600;color:var(--t2)">${kitRemMg.toFixed(0)} / ${totalMg} mg</div></div>
            <div><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:3px">VIALS</div><div style="font-size:11px;color:var(--t2)">${sealed>0?`${sealed} sealed `:""}${vialList.filter(v=>v.status==="active"||v.status==="open").length>0?`· ${vialList.filter(v=>v.status==="active"||v.status==="open").length} open `:""}${vialList.filter(v=>v.status==="finished"||v.status==="empty").length>0?`· ${vialList.filter(v=>v.status==="finished"||v.status==="empty").length} empty`:""}${vialList.filter(v=>v.status==="transferred").length>0?`· ${vialList.filter(v=>v.status==="transferred").length} transferred`:""}</div></div>
            <div><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:3px">CONC</div><div style="font-size:12px;color:var(--t2)">${conc?conc.toFixed(2)+" mg/mL":"—"}</div></div>
          </div>

          ${(()=>{
            // Kit → individual physical vials, in that order — which vial is current,
            // what Nexus estimates is in each, and (once finished) why/how much was
            // used. This is now the ONE vial-history display — it replaced a second,
            // separate "reconstitution history" list that read reconHistory[] directly
            // and could silently drift out of sync with this one.
            if (!everOpenedVials.length) return "";
            return `<details style="margin-bottom:10px">
              <summary style="font-size:11px;color:var(--t4);cursor:pointer;list-style:none">${everOpenedVials.length} vial${everOpenedVials.length===1?"":"s"} opened — show breakdown</summary>
              <div style="margin-top:8px;border-top:1px solid var(--border-sub);padding-top:8px">
                ${[...everOpenedVials].reverse().map((v,vi)=>{
                  const rem = getVialRemainingMg(s, v);
                  const usedMgVal = (v.expectedMg!=null?v.expectedMg:s.vialMg||0) - rem;
                  const isActive = v.status==="active"||v.status==="open";
                  // rem/usedMgVal are canonical mg — convert to the compound's own native
                  // display unit before showing them, the same gap that made "5.0mg
                  // remaining" read as "5.0mcg" here (a thousand-fold-misleading label).
                  const remNative = mgToUnit(rem, c.unit);
                  const usedNative = mgToUnit(usedMgVal, c.unit);
                  return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--surface-2)">
                    <div style="width:6px;height:6px;border-radius:50%;background:${isActive?"#7DF9C0":"var(--t5)"};flex-shrink:0"></div>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:11.5px;color:${isActive?"var(--t1)":"var(--t3)"};font-weight:600">Vial ${v.sequenceNumber||"?"}${v.reconDate?" · "+fmtDate(v.reconDate):" · Date unavailable"}</div>
                      <div style="font-size:10px;color:var(--t5)">${isActive?`~${remNative.toFixed(1)} ${c.unit} estimated remaining`:v.finishReason?`Finished — ${({used_in_dose:"used in dose",discarded:"discarded",discrepancy:"inventory discrepancy",other:"other"})[v.finishReason]||v.finishReason}`:"Finished"} · ${usedNative.toFixed(1)}${c.unit} used</div>
                    </div>
                    <button class="vial-actions-btn" data-kit="${s.id}" data-vial="${v.id}" title="Vial actions" style="color:var(--t5);font-size:14px;background:transparent;border:none;padding:4px 8px;flex-shrink:0">⋯</button>
                  </div>`;
                }).join("")}
              </div>
            </details>`;
          })()}

          ${(()=>{
            const history = getKitDoseHistory(s);
            if (!history.length) return "";
            return `<details style="margin-bottom:10px">
              <summary style="font-size:11px;color:var(--t4);cursor:pointer;list-style:none">Dose History (${history.length})</summary>
              <div style="margin-top:8px;border-top:1px solid var(--border-sub);padding-top:8px">
                ${history.map(ev=>{
                  const amtNative = mgToUnit(ev.amountMg, c.unit);
                  const amtLabel = ev.sprayCount ? `${ev.sprayCount} spray${ev.sprayCount===1?"":"s"} <span style="font-weight:400;color:var(--t5)">(${amtNative.toFixed(amtNative<1?2:1)}${c.unit})</span>` : `${amtNative.toFixed(amtNative<1?2:1)}${c.unit}`;
                  const kindLabel = ev.kind==="prepared" ? "Prepared" : ev.kind==="administered" ? "Administered from prepared dose" : "Logged dose";
                  const kindColor = ev.kind==="prepared" ? "#A78BFA" : ev.kind==="administered" ? "var(--t4)" : "var(--t2)";
                  const vialLines = ev.vials.length>1
                    ? ev.vials.map(v=>`<div style="font-size:10px;color:var(--t5);padding-left:10px">${esc(v.label||"Vial")} → ${mgToUnit(v.amountMg, c.unit).toFixed(v.amountMg<1?2:1)}${c.unit}</div>`).join("")
                    : ev.vials.length===1 ? `<div style="font-size:10px;color:var(--t5);padding-left:10px">${esc(ev.vials[0].label||"Vial")}</div>` : "";
                  return `<div style="padding:8px 0;border-bottom:1px solid var(--surface-2)">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
                      <span style="font-size:11px;color:var(--t4)">${historyDateLabel(ev)}</span>
                      <span style="font-size:11.5px;color:var(--t1);font-weight:600">${amtLabel} <span style="font-weight:400;color:${kindColor};font-size:10.5px">· ${kindLabel}</span></span>
                    </div>
                    ${vialLines}
                  </div>`;
                }).join("")}
              </div>
            </details>`;
          })()}

          ${weeksRemaining!=null?`<div style="font-size:11px;color:var(--t4);margin-bottom:10px">At current pace: ~${weeksRemaining.toFixed(1)} wks remaining, depleting around ${fmtDate(depletionDate)}</div>`:""}

          ${currentReconDate?`<div style="font-size:11px;color:var(--t4);margin-bottom:8px">Reconstituted ${fmtDate(currentReconDate)}${reconCount>1?` · ${reconCount} vials opened total`:""}</div>
          ${wasteFromCurrent>0?`<button class="outflow-history-toggle" data-id="${s.id}" style="display:flex;align-items:center;gap:6px;width:100%;text-align:left;background:transparent;border:none;padding:0;margin-bottom:8px;font-size:10px;color:#ff7c7c">
            <span>${wasteFromCurrent.toFixed(1)}mg outflow · ${getKitActiveTransactions(s,currentReconDate).length} transaction${getKitActiveTransactions(s,currentReconDate).length===1?"":"s"}</span>
            <span style="color:var(--t5)">›</span>
          </button>
          <div class="outflow-history-body" data-id="${s.id}" style="display:none;margin:-4px 0 8px;padding-left:2px">
            ${getKitActiveTransactions(s,currentReconDate).map(w=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--surface-2)">
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;color:var(--t2)">${fmtDate(w.date)} · ${w.mg}mg</div>
                <div style="font-size:10px;color:var(--t4)">${esc(w.reason||"")}${w.notes?" · "+esc(w.notes):""}</div>
              </div>
              <button class="edit-outflow" data-kit="${s.id}" data-tx="${w.id}" style="font-size:10px;color:var(--t3);background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:4px 8px">Edit</button>
              <button class="undo-outflow" data-kit="${s.id}" data-tx="${w.id}" style="font-size:10px;color:#ff7c7c;background:#ff7c7c11;border:1px solid #ff7c7c33;border-radius:6px;padding:4px 8px">Undo</button>
            </div>`).join("")}
          </div>`:""}`:""}

          ${s.notes?`<div style="font-size:11px;color:var(--t4);font-style:italic;margin-bottom:10px">${esc(s.notes)}</div>`:""}

          <button class="manage-kit-btn" data-id="${s.id}" style="width:100%;text-align:center;font-size:11.5px;font-weight:600;color:var(--t4);background:transparent;border:1px solid var(--border-sub);border-radius:8px;padding:9px">⋯ Manage kit</button>
        </div>
      </details>
    </div>`;
  };

  const liveEntries = entries.filter(s=>s.kitStatus!=="done");
  const doneEntries = entries.filter(s=>s.kitStatus==="done");
  const renderBlendKitCard = (s) => {
    const totalMg = (s.totalVials||0) * (s.vialMg||0);
    const doseLog = s.doseLog||[];
    const wasteLog = s.wasteLog||[];
    const currentReconDate = s.reconDate||null;
    const reconDoses = currentReconDate ? doseLog.filter(d=>new Date(d.date)>=new Date(currentReconDate)) : [];
    const usedFromCurrent = reconDoses.reduce((a,d)=>a+(d.totalMgDrawn||0),0);
    const wasteFromCurrent = currentReconDate ? getKitActiveWasteMg(s, currentReconDate) : 0;
    const vialRem = (s.totalVials||0)>0 && (s.emptyVials||0)>=(s.totalVials||0) ? 0 : (s.vialMg>0 ? Math.max(0, s.vialMg-usedFromCurrent-wasteFromCurrent) : null);
    const vialPct = s.vialMg>0 && vialRem!=null ? Math.round(vialRem/s.vialMg*100) : null;

    // Blend kits deliberately stay on their own formula rather than getKitRemainingMg —
    // they track consumption through kit.doseLog/totalMgDrawn, a genuinely different,
    // simpler shape than the vials[]-based peptide kit model (one mixed vial at a time,
    // no reconstitution rollover, no sealed backups). getBlendKitRemainingMg is now the
    // ONE place this formula lives, shared with logBlendDoseModal's own save-time
    // validation — previously this card computed it separately from that modal, and nothing
    // stopped a dose amount from exceeding what the card showed as available.
    const kitRemMg = getBlendKitRemainingMg(s);
    // This one IS safe to fix regardless of the above — it's purely about which vials are
    // physically sealed, unrelated to whichever dose-tracking mechanism this kit uses.
    const vialList = ensureKitVials(s);
    const sealed = getSealedVials(s).length;

    let statusKey = "empty";
    if (currentReconDate && s.activeKit) statusKey = vialPct<=20 ? "low" : "healthy";
    else if (sealed>0 || !s.activeKit) statusKey = "stored";
    const st = STATUS_META[statusKey] || STATUS_META.stored;

    return `<div class="card nx-kit-card nx-blend-kit-card" data-kit-id="${s.id}" style="border-color:var(--border-sub);margin-bottom:12px;padding:16px">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">
        <div style="width:9px;height:9px;border-radius:50%;background:#C9A0FF;flex-shrink:0"></div>
        <span style="font-size:16px;font-weight:700;color:var(--t1);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${esc(s.name)} <span style="font-size:10px;color:var(--t5);font-weight:400">blend</span></span>
        ${statusBadge(st.label, st.color)}
        <button type="button" class="manage-kit-btn" data-id="${s.id}" aria-label="Actions for ${esc(s.name)} blend kit" style="width:44px;height:44px;border:1px solid var(--border);border-radius:11px;background:var(--surface-2);color:var(--t2);font-size:20px;flex-shrink:0">⋯</button>
      </div>
      <div class="nx-stash-inventory-summary" style="margin-bottom:12px">
        <div style="font-size:10px;letter-spacing:.5px;font-weight:650;color:var(--t4);margin-bottom:5px">BLEND INVENTORY REMAINING</div>
        <div style="display:flex;align-items:baseline;gap:7px;flex-wrap:wrap">
          <span class="nx-kit-quantity" style="font-size:27px;font-weight:750;color:var(--t1);line-height:1.15">${Number.isFinite(kitRemMg)?kitRemMg.toFixed(kitRemMg%1===0?0:1):"—"}</span>
          <span style="font-size:13px;color:var(--t4)">mg across this kit</span>
        </div>
        <div style="font-size:12px;color:var(--t3);margin-top:6px">${sealed ? sealed+" sealed" : "No sealed vials"}${currentReconDate?" · current vial open":""} · ${(s.composition||[]).length} components</div>
      </div>
      ${currentReconDate && vialRem!==null ? `<div class="nx-stash-open-progress" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;margin-bottom:6px">
          <span style="font-size:12px;color:var(--t3)">Current open blend vial</span>
          <span style="font-size:12px;font-weight:650;color:var(--t2)">${vialRem.toFixed(vialRem%1===0?0:1)} / ${s.vialMg} mg</span>
        </div>
        ${vialPct!==null?`<div role="progressbar" aria-label="Open blend vial remaining" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${vialPct}" style="height:6px;background:var(--surface-2);border-radius:7px;overflow:hidden"><div style="height:100%;width:${Math.max(0,Math.min(100,vialPct))}%;background:${st.color};border-radius:7px"></div></div>`:""}
      </div>
      <button class="log-blend-dose" data-id="${s.id}" style="width:100%;min-height:44px;padding:10px;border-radius:10px;background:${st.color}15;border:1px solid ${st.color}44;color:${st.color};font-size:13px;font-weight:600;margin-bottom:4px">Log Blend Dose</button>
      ` : `<div class="nx-stash-sealed-note" style="font-size:12px;color:var(--t4);margin-bottom:12px">No blend vial currently open</div>`}

      <details style="margin-top:${currentReconDate?"8":"2"}px">
        <summary style="font-size:13px;color:var(--t3);cursor:pointer;list-style:none;min-height:44px;display:flex;align-items:center;justify-content:space-between">Composition & kit details</summary>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border-sub)">
          <div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:6px">COMPOSITION PER VIAL (${s.vialMg}mg total)</div>
          <div style="margin-bottom:12px">${(s.composition||[]).map(c=>`<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--t3);padding:3px 0"><span>${esc(c.compound)}</span><span>${c.mg}mg (${totalMg>0?Math.round(c.mg/totalMg*100):0}%)</span></div>`).join("")}</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
            <div><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:3px">KIT TOTAL</div><div style="font-size:12px;font-weight:600;color:var(--t2)">${kitRemMg.toFixed(0)} / ${totalMg} mg</div></div>
            <div><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:3px">VIALS</div><div style="font-size:11px;color:var(--t2)">${sealed>0?`${sealed} sealed `:""}${vialList.filter(v=>v.status==="active"||v.status==="open").length>0?`· ${vialList.filter(v=>v.status==="active"||v.status==="open").length} open`:""}${vialList.filter(v=>v.status==="finished"||v.status==="empty").length>0?`· ${vialList.filter(v=>v.status==="finished"||v.status==="empty").length} empty`:""}${vialList.filter(v=>v.status==="transferred").length>0?`· ${vialList.filter(v=>v.status==="transferred").length} transferred`:""}</div></div>
            <div><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:3px">CONC</div><div style="font-size:12px;color:var(--t2)">${(s.bacMl>0)?(s.vialMg/s.bacMl).toFixed(2)+" mg/mL":"—"}</div></div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:12px">
            ${s.cost?`<span style="font-size:11px;color:var(--t4);flex:1">${parseFloat(s.cost).toFixed(2)} ${s.currency||"CAD"}</span>`:`<span style="flex:1"></span>`}
            <button class="manage-kit-btn" data-id="${s.id}" aria-label="Manage ${esc(s.name)} blend kit" style="min-height:44px;padding:9px 12px;border:1px solid var(--border);border-radius:10px;color:var(--t3)">Manage blend</button>
          </div>
          ${currentReconDate?`<div style="font-size:11px;color:var(--t4)">Reconstituted ${fmtDate(currentReconDate)}</div>`:""}
          ${s.notes?`<div style="font-size:11px;color:var(--t4);font-style:italic;margin-top:6px">${esc(s.notes)}</div>`:""}
        </div>
      </details>
    </div>`;
  };
  const renderAnyKitCard = s => s.isBlend ? renderBlendKitCard(s) : renderKitCard(s);
  const GROUP_LABELS_STATUS = {attention:"NEEDS ATTENTION",active:"ACTIVE",stored:"STORED"};
  const GROUP_LABELS_INV = {active:"ACTIVE",sealed:"STORED / SEALED"};
  if (group==="status" || group==="inventory_state") {
    // Same sorted order, just partitioned into labeled sections — grouping never
    // re-sorts, it only adds section breaks over whatever order Sort already produced.
    const buckets = group==="status"
      ? {attention:[],active:[],stored:[]}
      : {active:[],sealed:[]};
    liveEntries.forEach(s=>{
      if (group==="status") {
        const needsAttn = computeKitStatus(s).needsAttention;
        (needsAttn ? buckets.attention : s.activeKit ? buckets.active : buckets.stored).push(s);
      } else {
        (s.activeKit ? buckets.active : buckets.sealed).push(s);
      }
    });
    const labels = group==="status" ? GROUP_LABELS_STATUS : GROUP_LABELS_INV;
    Object.entries(buckets).forEach(([key,list])=>{
      if (!list.length) return;
      html += `<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin:16px 0 8px 2px">${labels[key]} · ${list.length}</div>`;
      list.forEach(s=>{ html+=renderAnyKitCard(s); });
    });
  } else {
    liveEntries.forEach(s=>{ html+=renderAnyKitCard(s); });
  }

  if (doneEntries.length) {
    const open = !!state._showDoneKits;
    html += `<button id="toggle-done-kits" style="width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t4);font-size:12px;margin-bottom:12px">
      ${open?"▾":"▸"} Done / Discarded kits (${doneEntries.length})
    </button>`;
    if (open) doneEntries.forEach(s=>{ html+=renderAnyKitCard(s); });
  }

  html+=`<button id="addvial" style="width:100%;padding:12px;border-radius:12px;background:#C9A0FF18;border:1px solid #C9A0FF44;color:#C9A0FF;font-size:13px;font-weight:600">+ Add Kit</button>`;
  html += `<div style="margin:18px 0 6px;padding:15px;border-radius:14px;background:var(--surface);border:1px solid var(--border-sub);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><strong style="font-size:14px;color:var(--t1)">Need to replenish?</strong><p style="font-size:12px;color:var(--t3);margin:5px 0 0">Your shopping list is linked here for convenience.</p></div><button type="button" id="nx-shopping-from-stash" style="min-height:44px;padding:10px 15px;border-radius:10px;background:#A78BFA20;border:1px solid #A78BFA66;color:var(--t1);font-size:13px;font-weight:600">Open shopping list →</button></div>`;
  return html;
}

// Lightweight status computation reusable at the LIST level (filtering/sorting, before
// any card is rendered) — mirrors the exact thresholds renderKitCard uses internally, so
// a kit categorized "Needs Attention" here is guaranteed to show the same status badge
// once its card actually renders. Kept separate from renderKitCard's own richer
// computation rather than risking a refactor of that already-complex function.
// Compound-level inventory rollup — sums across ALL of a compound's kits, distinguishing
// what's immediately active (drawable right now) from reserve (sealed, real inventory
// the person owns, just not open yet). This is the single fix for a whole class of bad
// calculations: a stored kit with 90mg sealed is NOT "0 doses" just because nothing's
// open — it's 90mg of real reserve. Coverage, Supply Planner, and inventory health all
// read from here rather than each re-deriving their own notion of "how much is there."
function getCompoundInventorySummary(compoundName) {
  const kits = (state.supplies||[]).filter(k=>k.name===compoundName && k.kitStatus!=="done");
  let activeMg = 0, reserveMg = 0;
  kits.forEach(k=>{
    const rem = getKitRemainingMg(k);
    if (k.activeKit) activeMg += rem; else reserveMg += rem;
  });
  const preparedMg = getPreparedRemainingMg(compoundName);
  return { activeMg, reserveMg, preparedMg, totalMg: activeMg+reserveMg, kits };
}

// Phase-aware remaining requirement for a compound within a specific protocol, from
// TODAY through the end of its planned phases — reuses getProtocolPhaseInfo rather than
// recomputing schedule/phase logic independently. This is what makes Coverage correct
// for a compound whose dose or frequency changes partway through (3mg M/W/F for the rest
// of phase 1, then 5mg M/W/F for 4 weeks, then a 4-week rest) instead of naively doing
// inventory ÷ current dose.
function getProtocolRemainingRequirement(proto, comp) {
  const info = getProtocolPhaseInfo(proto, comp);
  const cUnit = cfg(comp.name)?.unit || "mg";
  if (!info || info.done) return { totalMg:0, totalDoses:0, phases:[], unit:cUnit };
  if (info.notStartedYet) return { totalMg:0, totalDoses:0, phases:[], unit:cUnit, notStartedYet:true };
  const freqPerWeek = (sched) => {
    const s = sched || proto.schedule;
    if (!s) return 7;
    if (s.type==="Every Other Day") return 3.5*(s.dosesPerDay||1);
    if (s.type==="Daily") return 7*(s.dosesPerDay||1);
    return (s.days?.length||7)*(s.dosesPerDay||1);
  };
  let totalMg = 0, totalDoses = 0;
  const phases = info.phases.slice(info.index).map((ph,i)=>{
    if (ph.type!=="dose") return {...ph, doses:0, mg:0};
    const weeksRemaining = i===0
      ? Math.max(0,(new Date(ph.endDate+"T12:00")-new Date(localDate()+"T12:00"))/(7*86400000))
      : (ph.durationWeeks||4);
    const doses = Math.round(weeksRemaining*freqPerWeek(ph.schedule));
    const mg = doseToMg(ph.dose, cUnit)*doses;
    totalMg += mg; totalDoses += doses;
    return {...ph, doses, mg};
  });
  return { totalMg, totalDoses, phases, unit:cUnit };
}

function computeKitStatus(s) {
  const av = getActiveVial(s);
  const vialRem = av ? getVialRemainingMg(s, av) : null;
  const kitRemMg = getKitRemainingMg(s);
  const vialPct = (av && av.expectedMg) ? (vialRem/av.expectedMg*100) : null;
  const expiryMs = stashExpiryMs(s);
  const expiryDaysLeft = expiryMs<9999999999999 ? Math.round((expiryMs-Date.now())/86400000) : null;
  let statusKey;
  if (s.kitStatus==="done") statusKey="done";
  else if (!s.activeKit) statusKey="stored";
  else if ((vialRem!==null && vialRem<=0) || kitRemMg<=0) statusKey="empty";
  else if (expiryDaysLeft!==null && expiryDaysLeft<=5) statusKey="expiring";
  else if (vialPct!==null && vialPct<=20) statusKey="low";
  else statusKey="healthy";
  const needsAttention = ["empty","expiring","low"].includes(statusKey);
  return { statusKey, vialRem, kitRemMg, vialPct, expiryDaysLeft, expiryMs, needsAttention };
}
// Rough "doses worth remaining" estimate, reusing whatever the compound's own recent
// average logged dose amount is — same signal the depletion-forecast text elsewhere
// already relies on, just reduced to a single sortable number.
function getEstimatedDosesLeft(s) {
  const aps = allPeptides();
  const doses = (aps[s.name]?.doses||[]).slice(-6);
  if (!doses.length) return Infinity;
  const compUnit = cfg(s.name)?.unit||"mg";
  const avg = doses.reduce((a,d)=>a+doseToMg(d.dose,compUnit),0)/doses.length;
  if (avg<=0) return Infinity;
  return getKitRemainingMg(s)/avg;
}

function stashRemPct(s, aps) {
  // Percentage of what you actually still own, not the original purchase size — a
  // transferred vial's nominal mg must not sit in the denominator, or a kit you partly
  // gave away reads as having more headroom than it really does. getKitRemainingMg is
  // already canonical (waste/transfer/prepared-aware); this just needed the denominator
  // fixed to match, instead of a separate from-scratch recount.
  const ownedMg = kitOwnedVialCount(s)*(s.vialMg||0);
  if(!ownedMg) return 100;
  return Math.max(0, Math.min(100, getKitRemainingMg(s)/ownedMg*100));
}
function stashExpiryMs(s) {
  if(!s.reconDate||!s.expiryDays) return 9999999999999;
  return new Date(addDays(s.reconDate,s.expiryDays)).getTime();
}

// ─── Reconstitution calculator ────────────────────────────────────────────────
function mixingChartView() {
  const typeInfo={
    avoid:      {bg:"#ef4444", label:"Commonly Avoid",         icon:"✗"},
    caution:    {bg:"#f59e0b", label:"Use Caution",            icon:"⚠"},
    clinic:     {bg:"#22c55e", label:"Clinically Paired",      icon:"✓"},
    compatible: {bg:"#3b82f6", label:"Anecdotally Compatible", icon:"✓"},
  };
  const order=["avoid","caution","clinic","compatible"];

  const q=(state._mixSearch||"").toLowerCase().trim();
  const typeFilter=state._mixTypeFilter||"";

  let pairs=Object.entries(PEPTIDE_INTERACTIONS).map(([k,v])=>{
    const [a,b]=k.split("|");
    return {a,b,type:v.type,note:v.note};
  });
  if(q) pairs=pairs.filter(p=>p.a.toLowerCase().includes(q)||p.b.toLowerCase().includes(q));
  if(typeFilter) pairs=pairs.filter(p=>p.type===typeFilter);

  const counts=Object.fromEntries(order.map(t=>[t,pairs.filter(p=>p.type===t).length]));

  const chips=`<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;margin-bottom:12px">
    <button class="mix-type-chip" data-t="" style="font-size:11px;padding:6px 11px;border-radius:10px;background:${typeFilter===""?"var(--surface-3)":"var(--surface-2)"};border:1px solid ${typeFilter===""?"var(--border)":"transparent"};color:var(--t3);white-space:nowrap;flex-shrink:0">All</button>
    ${order.map(t=>{const s=typeInfo[t];return `<button class="mix-type-chip" data-t="${t}" style="font-size:11px;padding:6px 11px;border-radius:10px;background:${typeFilter===t?s.bg+"22":"var(--surface-2)"};border:1px solid ${typeFilter===t?s.bg:"var(--border)"};color:${typeFilter===t?s.bg:"var(--t3)"};white-space:nowrap;flex-shrink:0">${s.icon} ${s.label}</button>`;}).join("")}
  </div>`;

  const section=(type)=>{
    const items=pairs.filter(p=>p.type===type);
    if(!items.length) return "";
    const s=typeInfo[type];
    return `<div style="margin-bottom:18px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span style="color:${s.bg};font-size:12px">${s.icon}</span>
        <span class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px">${s.label.toUpperCase()} (${items.length})</span>
      </div>
      ${items.map(p=>`<div class="card" style="margin-bottom:8px;border-left:3px solid ${s.bg}">
        <div style="font-size:13px;font-weight:600;color:var(--t1);margin-bottom:3px">${esc(p.a)} + ${esc(p.b)}</div>
        <div style="font-size:11.5px;color:var(--t3);line-height:1.55">${esc(p.note)}</div>
      </div>`).join("")}
    </div>`;
  };

  return `<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
      <button id="mixback" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px">‹</button>
      <h1 class="serif" style="font-size:20px;margin:0;color:var(--t1)">Stacking & Mixing Guide</h1>
    </div>
    <div style="background:#F9C87D11;border:1px solid #F9C87D33;border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:var(--t4);line-height:1.6">
      ⚕ Educational reference only. Based on community experience and published single-agent pharmacology — not clinical trial evidence. Consult your clinician before stacking.
    </div>
    <input id="mix-search" class="inp" placeholder="🔍 Search a compound…" value="${esc(state._mixSearch||"")}" style="margin-bottom:12px">
    ${chips}
    <div style="font-size:10px;color:var(--t5);margin-bottom:12px">${pairs.length} ${pairs.length===1?"pairing":"pairings"}${q||typeFilter?" matching":""}</div>
    ${pairs.length?order.map(section).join(""):`<div style="text-align:center;padding:30px 0;color:var(--t4);font-size:12px">No pairings match. Try a different search or clear the filter.</div>`}
  </div>`;
}

function reconCalcView() {
  const r = state._recon || { vialMg:"", bacMl:"", dose:"", unit:"mg", freq:"daily", syringe:"100u" };
  const vmg=parseFloat(r.vialMg)||0, bac=parseFloat(r.bacMl)||0;
  const doseRaw=parseFloat(r.dose)||0;
  const doseMg = r.unit==="mcg" ? doseRaw/1000 : r.unit==="iu" ? doseRaw*0.001 : doseRaw;
  const conc = vmg&&bac ? vmg/bac : null;
  const mlPerDose = conc&&doseMg ? doseMg/conc : null;
  // Syringe configs
  const SYRINGES = {"30u":{max:30,label:"30-unit (0.3 mL)",mlMax:0.3,isVol:false},"50u":{max:50,label:"50-unit (0.5 mL)",mlMax:0.5,isVol:false},"100u":{max:100,label:"100-unit (1 mL)",mlMax:1,isVol:false},"1mL":{max:100,label:"1 mL",mlMax:1,isVol:true},"3mL":{max:300,label:"3 mL",mlMax:3,isVol:true}};
  const syr = SYRINGES[r.syringe||"100u"];
  const unitsRaw = mlPerDose!=null ? mlPerDose*100 : null; // U-100 units
  const units = unitsRaw!=null ? Math.round(unitsRaw*10)/10 : null;
  // Volume syringes (1mL/3mL): use mL-based fill; insulin syringes: use unit-based fill
  const syringeUnits = !syr.isVol&&unitsRaw!=null ? Math.round(unitsRaw/100*syr.max*10)/10 : null;
  const syringeMl = syr.isVol&&mlPerDose!=null ? mlPerDose : null;
  const fillPct = syr.isVol ? (syringeMl!=null?Math.min(100,(syringeMl/syr.mlMax)*100):0) : (syringeUnits!=null?Math.min(100,syringeUnits/syr.max*100):0);
  // Supply calculation
  const dosesPerDay = r.freq==="twice"?2:r.freq==="weekly"?1/7:1;
  const totalDoses = vmg&&doseMg ? Math.floor(vmg/doseMg) : null;
  const durationDays = totalDoses&&dosesPerDay ? Math.round(totalDoses/dosesPerDay) : null;
  // Syringe SVG — volume syringes (1mL/3mL) use mL scale; insulin syringes use unit scale
  const W=280,BL=24,BR=252,BW=228,BY=28,BH=24;
  const CX=syr.isVol?(v)=>BR-(v/syr.mlMax)*BW:(v)=>BR-(v/syr.max)*BW;
  const fillVal=syr.isVol?(syringeMl||0):(syringeUnits||0);
  const fillX=CX(fillVal),fillW=BR-Math.max(BL,fillX);
  const ticks=syr.isVol
    ?(syr.mlMax<=1?[0,0.25,0.5,0.75,1.0]:[0,0.5,1.0,1.5,2.0,2.5,3.0])
    :(syr.max<=50?[0,10,20,30,40,50].filter(v=>v<=syr.max):[0,10,20,30,40,50,60,70,80,90,100].filter(v=>v<=syr.max));
  const syringeSVG=`<svg viewBox="0 0 ${W} 80" style="width:100%;max-width:380px;display:block;margin:0 auto">
    <!-- Scale: needle=right(min), plunger=left(max). Volume syringes show mL, insulin show units -->
    ${ticks.map(v=>`<line x1="${CX(v)}" y1="${BY}" x2="${CX(v)}" y2="${BY-5}" stroke="var(--t5)" stroke-width="1"/>
    <text x="${CX(v)}" y="${BY-7}" text-anchor="middle" font-size="8" fill="var(--t5)">${syr.isVol?v+"mL":v}</text>`).join("")}
    <!-- Barrel bg -->
    <rect x="${BL}" y="${BY}" width="${BW}" height="${BH}" rx="3" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
    <!-- Fill (fluid) -->
    ${fillW>0?`<rect x="${Math.max(BL+2,fillX)}" y="${BY+2}" width="${fillW-2}" height="${BH-4}" rx="2" fill="#A78BFA" opacity="0.85"/>`:""}
    <!-- Draw mark line -->
    ${syringeUnits!=null&&fillX>=BL&&fillX<=BR?`<line x1="${fillX}" y1="${BY-2}" x2="${fillX}" y2="${BY+BH+2}" stroke="#7DF9C0" stroke-width="2" stroke-linecap="round"/>`:""}
    <!-- Plunger -->
    <rect x="4" y="${BY+4}" width="22" height="${BH-8}" rx="3" fill="var(--surface-3)" stroke="var(--border)"/>
    <rect x="6" y="${BY+8}" width="18" height="${BH-16}" rx="2" fill="var(--border-sub)"/>
    <!-- Needle hub -->
    <polygon points="${BR},${BY+4} ${W-4},${BY+BH/2} ${BR},${BY+BH-4}" fill="var(--surface-3)" stroke="var(--border)" stroke-width="1"/>
    <!-- Unit badge -->
    ${syringeUnits!=null?`<rect x="${Math.max(BL+4,Math.min(BR-36,fillX-18))}" y="${BY+BH+6}" width="36" height="16" rx="8" fill="#A78BFA22" stroke="#A78BFA55"/>
    <text x="${Math.max(BL+22,Math.min(BR-18,fillX))}" y="${BY+BH+18}" text-anchor="middle" font-size="10" font-weight="700" fill="#A78BFA">${Math.round(syringeUnits)}u</text>`:""}
  </svg>`;
  const step=(n,title,body)=>`<div style="display:flex;gap:12px;margin-bottom:18px;align-items:flex-start">
    <div style="width:28px;height:28px;border-radius:50%;background:#A78BFA;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">${n}</div>
    <div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--t1);margin-bottom:8px">${title}</div>${body}</div>
  </div>`;
  const pill=(val,cur,id)=>`<button data-id="${id}" data-val="${val}" onclick="calcPillClick(this)" style="padding:5px 14px;border-radius:99px;font-size:12px;font-weight:600;border:1px solid ${cur===val?"#A78BFA":"var(--border-sub)"};background:${cur===val?"#A78BFA22":"transparent"};color:${cur===val?"#A78BFA":"var(--t4)"}">${val}</button>`;
  return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
    <button id="reconback" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px">‹</button>
    <h1 class="serif" style="font-size:20px;margin:0;color:var(--t1);flex:1">Dose Calculator</h1>
    <button onclick="state._recon=null;renderBody();" style="background:transparent;border:1px solid var(--border-sub);color:var(--t4);border-radius:8px;padding:5px 12px;font-size:11px">Reset</button>
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:14px;padding:16px 18px;margin-bottom:14px">
    ${step(1,"What's in your vial?",`<div style="display:flex;gap:10px;flex-wrap:wrap">
      <div style="flex:1;min-width:120px"><label class="field-label">Peptide amount (mg)</label><input id="rc-vmg" type="number" step="0.1" class="inp" value="${esc(r.vialMg)}" placeholder="e.g. 5"></div>
      <div style="flex:1;min-width:120px"><label class="field-label">BAC water to add (mL)</label><input id="rc-bac" type="number" step="0.1" class="inp" value="${esc(r.bacMl)}" placeholder="e.g. 2">
        <div style="font-size:10px;color:var(--t5);margin-top:4px">Typical: 2 mL per vial</div>
      </div></div>${conc?`<div style="margin-top:10px;font-size:12px;color:#A78BFA">Creates <b>${conc.toFixed(2)} mg/mL</b> solution</div>`:""}`)}
    ${step(2,"Your dose per injection?",`<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
      <div style="flex:2;min-width:100px"><label class="field-label">Dose amount</label><input id="rc-dose" type="number" step="0.1" class="inp" value="${esc(r.dose)}" placeholder="e.g. 2"></div>
      <div style="display:flex;gap:4px;padding-bottom:8px">${["mg","mcg","IU"].map(u=>pill(u.toLowerCase(),r.unit||"mg","unit")).join("")}</div>
    </div>`)}
    ${step(3,"How often?",`<div style="display:flex;gap:6px;flex-wrap:wrap">
      ${[["daily","Daily","1×/day"],["twice","Twice","2×/day"],["weekly","Weekly","1×/wk"]].map(([v,l,s])=>`<button data-id="freq" data-val="${v}" onclick="calcPillClick(this)" style="flex:1;padding:8px 6px;border-radius:10px;font-size:12px;font-weight:600;border:1px solid ${(r.freq||"daily")===v?"#A78BFA":"var(--border-sub)"};background:${(r.freq||"daily")===v?"#A78BFA22":"transparent"};color:${(r.freq||"daily")===v?"#A78BFA":"var(--t4)"};display:flex;flex-direction:column;align-items:center;gap:2px">${l}<span style="font-size:10px;font-weight:400;opacity:0.7">${s}</span></button>`).join("")}
    </div>`)}
  </div>
  <div id="rc-results">${mlPerDose!=null?`<div style="background:var(--surface-2);border:1px solid #A78BFA44;border-radius:14px;padding:16px 18px;margin-bottom:14px">
    <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:14px">Your Recipe</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <div style="display:flex;gap:12px;align-items:center;padding:10px 12px;background:var(--surface);border-radius:10px">
        <div style="width:24px;height:24px;border-radius:50%;background:#A78BFA;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">1</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--t2)">Add ${parseFloat(r.bacMl||2).toFixed(1)} mL diluent</div><div style="font-size:11px;color:var(--t4)">Creates ${(vmg/bac).toFixed(2)} mg/mL solution</div></div>
      </div>
      <div style="display:flex;gap:12px;align-items:center;padding:10px 12px;background:var(--surface);border-radius:10px">
        <div style="width:24px;height:24px;border-radius:50%;background:#A78BFA;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">2</div>
        <div><div style="font-size:13px;font-weight:600;color:var(--t2)">Draw ${Math.round(units||0)} units</div><div style="font-size:11px;color:var(--t4)">${(mlPerDose).toFixed(3)} mL per dose</div></div>
      </div>
    </div>
    <!-- Syringe visual -->
    <div style="background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;padding:14px;margin-bottom:12px">
      ${syringeSVG}
      <div style="text-align:center;font-size:12px;color:#7DF9C0;font-weight:600;margin-top:4px">${syr.isVol?((syringeMl||0).toFixed(2)+"mL"):Math.round(syringeUnits||0)+" units"} on your syringe · ${(mlPerDose).toFixed(3)} mL</div>
      <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-top:12px">
        ${Object.keys(SYRINGES).map(s=>pill(s,r.syringe||"100u","syringe")).join("")}
      </div>
      <div style="text-align:center;font-size:10px;color:var(--t5);margin-top:4px">${syr.label}</div>
    </div>
    <!-- Supply summary -->
    ${totalDoses!=null?`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center">
      ${[["📅",r.freq==="twice"?"Twice daily":r.freq==="weekly"?"Weekly":"Daily","Frequency"],[(""+totalDoses)+" doses","","Doses"],[durationDays+"d","","Duration"]].map(([v,s,l])=>`<div style="background:var(--surface);border-radius:10px;padding:10px 6px"><div style="font-size:16px;font-weight:700;color:var(--t1)">${v}</div>${s?`<div style="font-size:10px;color:var(--t4)">${s}</div>`:""}${l?`<div style="font-size:9px;color:var(--t5);letter-spacing:1px;margin-top:2px">${l.toUpperCase()}</div>`:""}</div>`).join("")}
    </div>`:""}
  </div>`:""}
  </div>
  <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:12px 14px">
    <div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin-bottom:8px">QUICK REFERENCE</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;color:var(--t4)">
      <div>1 mg = 1,000 mcg</div><div>U-100 = 100 units/mL</div><div>1 unit = 0.01 mL</div><div>Swirl, never shake</div>
    </div>
  </div>`;
}

function calcPillClick(btn) {
  if(!state._recon) state._recon={vialMg:"5",bacMl:"2",dose:"",unit:"mg",freq:"daily",syringe:"100u"};
  state._recon[btn.dataset.id] = btn.dataset.val;
  // Update pill visual state
  const isInResults = !!btn.closest("#rc-results");
  const scope = isInResults ? document.getElementById("rc-results") : document;
  scope && scope.querySelectorAll(`[data-id="${btn.dataset.id}"]`).forEach(b=>{
    const on = b.dataset.val === btn.dataset.val;
    b.style.background = on?"#A78BFA22":"transparent";
    b.style.borderColor = on?"#A78BFA":"var(--border-sub)";
    b.style.color = on?"#A78BFA":"var(--t4)";
  });
  // Trigger result update
  const fn = window._calcUpdateResult;
  if(fn) fn();
}

function wireReconCalc() {
  if(!document.querySelector('#rc-vmg')) return; // not on calc tab
  // Targeted result update — does NOT destroy/recreate inputs, preserving cursor position
  const updateResult = () => {
    if(!state._recon) state._recon={vialMg:"5",bacMl:"2",dose:"",unit:"mg",freq:"daily",syringe:"100u"};
    const vmg=parseFloat(state._recon.vialMg)||0, bac=parseFloat(state._recon.bacMl)||0;
    const doseRaw=parseFloat(state._recon.dose)||0;
    const doseMg=state._recon.unit==="mcg"?doseRaw/1000:state._recon.unit==="iu"?doseRaw*0.001:doseRaw;
    const conc=vmg&&bac?vmg/bac:null;
    const mlPerDose=conc&&doseMg?doseMg/conc:null;
    // Update concentration hint inline (no re-render)
    const concEl=document.getElementById("rc-conc-hint");
    if(concEl)concEl.textContent=conc?`Creates ${conc.toFixed(2)} mg/mL solution`:"";
    // Update results section
    const res=document.getElementById("rc-results");
    if(res&&mlPerDose!=null){
      const r2=state._recon, syr2={"30u":{max:30,label:"30-unit (0.3 mL)",mlMax:0.3},"50u":{max:50,label:"50-unit (0.5 mL)",mlMax:0.5},"100u":{max:100,label:"100-unit (1 mL)",mlMax:1},"1mL":{max:100,label:"1 mL",mlMax:1,isVol:true},"3mL":{max:300,label:"3 mL",mlMax:3,isVol:true}}[r2.syringe||"100u"];
      const unitsRaw=mlPerDose*100, units=Math.round(unitsRaw*10)/10;
      const syringeUnits=syr2.isVol?null:Math.round(unitsRaw/100*syr2.max*10)/10;
      const syringeMl2=syr2.isVol?mlPerDose:null; // mL draw for volume syringes
      const dosesPerDay=r2.freq==="twice"?2:r2.freq==="weekly"?1/7:1;
      const totalDoses=vmg&&doseMg?Math.floor(vmg/doseMg):null;
      const durationDays=totalDoses&&dosesPerDay?Math.round(totalDoses/dosesPerDay):null;
      const W=280,BL=24,BR=252,BW=228,BY=28,BH=24;
      const CX=syr2.isVol?(v)=>BR-(v/syr2.mlMax)*BW:(v)=>BR-(v/syr2.max)*BW;
      const fillVal2=syr2.isVol?(mlPerDose||0):(syringeUnits||0);
      const fillX=CX(fillVal2),fillW=BR-Math.max(BL,fillX);
      const ticks=syr2.isVol
        ?(syr2.mlMax<=1?[0,0.25,0.5,0.75,1.0]:[0,0.5,1.0,1.5,2.0,2.5,3.0])
        :(syr2.max<=50?[0,10,20,30,40,50].filter(v=>v<=syr2.max):[0,10,20,30,40,50,60,70,80,90,100].filter(v=>v<=syr2.max));
      const svg=`<svg viewBox="0 0 ${W} 80" style="width:100%;max-width:380px;display:block;margin:0 auto">
        ${ticks.map(v=>`<line x1="${CX(v)}" y1="${BY}" x2="${CX(v)}" y2="${BY-5}" stroke="var(--t5)" stroke-width="1"/>
        <text x="${CX(v)}" y="${BY-7}" text-anchor="middle" font-size="8" fill="var(--t5)">${v}</text>`).join("")}
        <rect x="${BL}" y="${BY}" width="${BW}" height="${BH}" rx="3" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>
        ${fillW>0?`<rect x="${Math.max(BL+2,fillX)}" y="${BY+2}" width="${fillW-2}" height="${BH-4}" rx="2" fill="#A78BFA" opacity="0.85"/>`:""}
        ${fillW>0&&fillX>=BL&&fillX<=BR?`<line x1="${fillX}" y1="${BY-2}" x2="${fillX}" y2="${BY+BH+2}" stroke="#7DF9C0" stroke-width="2" stroke-linecap="round"/>`:""}
        <rect x="4" y="${BY+4}" width="22" height="${BH-8}" rx="3" fill="var(--surface-3)" stroke="var(--border)"/>
        <rect x="6" y="${BY+8}" width="18" height="${BH-16}" rx="2" fill="var(--border-sub)"/>
        <polygon points="${BR},${BY+4} ${W-4},${BY+BH/2} ${BR},${BY+BH-4}" fill="var(--surface-3)" stroke="var(--border)" stroke-width="1"/>
        ${(syr2.isVol?syringeMl2!=null:syringeUnits!=null)?`<rect x="${Math.max(BL+4,Math.min(BR-44,fillX-22))}" y="${BY+BH+8}" width="${syr2.isVol?44:36}" height="16" rx="8" fill="#A78BFA22" stroke="#A78BFA55"/>
        <text x="${Math.max(BL+22,Math.min(BR-22,fillX))}" y="${BY+BH+20}" text-anchor="middle" font-size="10" font-weight="700" fill="#A78BFA">${syr2.isVol?(syringeMl2||0).toFixed(2)+"mL":Math.round(syringeUnits)+"u"}</text>`:""}
      </svg>`;
      const pill2=(val,cur,id)=>`<button data-id="${id}" data-val="${val}" onclick="calcPillClick(this)" style="padding:5px 14px;border-radius:99px;font-size:12px;font-weight:600;border:1px solid ${cur===val?"#A78BFA":"var(--border-sub)"};background:${cur===val?"#A78BFA22":"transparent"};color:${cur===val?"#A78BFA":"var(--t4)"}">${val}</button>`;
      res.innerHTML=`<div style="background:var(--surface-2);border:1px solid #A78BFA44;border-radius:14px;padding:16px 18px;margin-bottom:14px">
        <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:14px">Your Recipe</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
          <div style="display:flex;gap:12px;align-items:center;padding:10px 12px;background:var(--surface);border-radius:10px">
            <div style="width:24px;height:24px;border-radius:50%;background:#A78BFA;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">1</div>
            <div><div style="font-size:13px;font-weight:600;color:var(--t2)">Add ${parseFloat(r2.bacMl||2).toFixed(1)} mL diluent</div><div style="font-size:11px;color:var(--t4)">Creates ${conc.toFixed(2)} mg/mL solution</div></div>
          </div>
          <div style="display:flex;gap:12px;align-items:center;padding:10px 12px;background:var(--surface);border-radius:10px">
            <div style="width:24px;height:24px;border-radius:50%;background:#A78BFA;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">2</div>
            <div><div style="font-size:13px;font-weight:600;color:var(--t2)">Draw ${Math.round(units)} units</div><div style="font-size:11px;color:var(--t4)">${mlPerDose.toFixed(3)} mL per dose</div></div>
          </div>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;padding:14px;margin-bottom:12px">${svg}
          <div style="text-align:center;font-size:12px;color:#7DF9C0;font-weight:600;margin-top:4px">Draw to ${syr2.isVol?(syringeMl2||0).toFixed(2)+"mL":Math.round(syringeUnits)+" units"} on your syringe · ${mlPerDose.toFixed(3)} mL</div>
          <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-top:12px">${Object.keys({"30u":1,"50u":1,"100u":1,"1mL":1,"3mL":1}).map(s=>pill2(s,r2.syringe||"100u","syringe")).join("")}</div>
          <div style="text-align:center;font-size:10px;color:var(--t5);margin-top:4px">${syr2.label}</div>
        </div>
        ${totalDoses!=null?`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center">
          ${[[r2.freq==="twice"?"Twice daily":r2.freq==="weekly"?"Weekly":"Daily","Frequency"],[totalDoses+"","Doses"],[durationDays+"d","Duration"]].map(([v,l])=>`<div style="background:var(--surface);border-radius:10px;padding:10px 6px"><div style="font-size:16px;font-weight:700;color:var(--t1)">${v}</div><div style="font-size:9px;color:var(--t5);letter-spacing:1px;margin-top:2px">${l.toUpperCase()}</div></div>`).join("")}
        </div>`:""}
      </div>`;
      // Syringe pills use inline onclick="calcPillClick(this)" — no re-wiring needed
    } else if(res) { res.innerHTML=""; }
  };
  window._calcUpdateResult = updateResult; // expose for calcPillClick global handler

  const update = () => {
    if(!state._recon) state._recon={vialMg:"5",bacMl:"2",dose:"",unit:"mg",freq:"daily",syringe:"100u"};
    const vmg=document.querySelector('#rc-vmg'), bac=document.querySelector('#rc-bac'), dose=document.querySelector('#rc-dose');
    if(vmg)state._recon.vialMg=vmg.value;
    if(bac)state._recon.bacMl=bac.value;
    if(dose)state._recon.dose=dose.value;
    updateResult(); // targeted update — cursor stays in place
  };
  ['#rc-vmg','#rc-bac','#rc-dose'].forEach(id => {
    const el = document.querySelector(id); if(el) el.oninput = update;
  });
  updateResult(); // initial calculation on load
  const rb = document.querySelector('#reconback');
  if(rb) rb.onclick = () => { state._learnSub="guides"; state._recon={vialMg:"",bacMl:"",dose:"",unit:"mg",freq:"daily",syringe:"100u"}; renderBody(); };
}

// ─── PK modelling ─────────────────────────────────────────────────────────────
function pkLevelAt(doses, halfLifeDays, atMs) {
  const ke = Math.LN2 / halfLifeDays;
  const ka = Math.LN2 / 0.8; // absorption half-life ~19h → tmax ≈ 2.8 days
  let level = 0;
  const recent = [...doses].filter(d=>d.date).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-16);
  recent.forEach(dose => {
    const t = (atMs - new Date(dose.date).getTime()) / 86400000;
    if (t < 0) return;
    level += Math.max(0, Math.exp(-ke*t) - Math.exp(-ka*t));
  });
  // Normalise to single-dose peak
  const tPeak = Math.log(ka/ke) / (ka-ke);
  const peakSingle = Math.exp(-ke*tPeak) - Math.exp(-ka*tPeak);
  // Steady-state accumulation for weekly dosing
  const ssAccum = 1 / (1 - Math.exp(-ke*7));
  return Math.max(0, level / (peakSingle * ssAccum));
}

// ─── Shared health/HRV helpers — single source of truth is state.activityLogs ──────
// Every screen (Trends, Nexus, Data Health, Insights) should read HRV/RHR through these
// rather than re-filtering activityLogs independently.
function getBaselineHealthRows() {
  return (state.activityLogs || []).filter(a => !a.isWorkout && (a.hrv != null || a.restingHR != null));
}
function getHRVRows(timeframe) {
  const rows = (state.activityLogs || []).filter(a => !a.isWorkout && a.hrv != null).sort((a, b) => new Date(a.date) - new Date(b.date));
  if (!timeframe || timeframe === "all") return rows;
  const days = { "2w": 14, "1m": 30, "3m": 90, "6m": 180 }[timeframe];
  if (!days) return rows;
  const cutoff = Date.now() - days * 86400000;
  return rows.filter(r => new Date(r.date).getTime() >= cutoff);
}
// HRV must always be read relative to the person's OWN history, never a universal
// "good"/"bad" number — this returns the vocabulary + confidence tier, not a verdict.
function getHRVBaseline() {
  const rows = getHRVRows("all");
  const n = rows.length;
  if (n === 0) return { count: 0, confidence: "none", baseline: null, label: "No HRV data imported yet" };
  const latest = rows[n - 1];
  if (n < 4) return { count: n, confidence: "latest_only", baseline: null, latest: latest.hrv, latestDate: latest.date, label: "Not enough data yet — showing latest reading only" };
  const last30 = getHRVRows("1m");
  const baselineRows = last30.length ? last30 : rows;
  const baseline = baselineRows.reduce((a, r) => a + r.hrv, 0) / baselineRows.length;
  if (n < 14) return { count: n, confidence: "early_trend", baseline, baselineDays: baselineRows.length, latest: latest.hrv, latestDate: latest.date, label: "Early trend — low confidence" };
  if (n < 30) return { count: n, confidence: "baseline", baseline, baselineDays: baselineRows.length, latest: latest.hrv, latestDate: latest.date, label: "Personal baseline established" };
  return { count: n, confidence: "strong", baseline, baselineDays: baselineRows.length, latest: latest.hrv, latestDate: latest.date, label: "Strong enough for period comparisons" };
}
function getHRVTrend() {
  const baseline = getHRVBaseline();
  if (baseline.confidence === "none" || baseline.confidence === "latest_only") return { ...baseline, direction: null, directionLabel: baseline.label };
  const last7 = getHRVRows("2w").filter(r => (Date.now() - new Date(r.date).getTime()) <= 7 * 86400000);
  if (!last7.length) return { ...baseline, direction: null, directionLabel: "No readings in the last 7 days" };
  const avg7 = last7.reduce((a, r) => a + r.hrv, 0) / last7.length;
  const diff = avg7 - baseline.baseline;
  const pctDiff = baseline.baseline ? (diff / baseline.baseline) * 100 : 0;
  let direction, directionLabel;
  if (Math.abs(pctDiff) < 8) { direction = "within"; directionLabel = "Within your usual range"; }
  else if (pctDiff > 0) { direction = "above"; directionLabel = "Above your recent baseline"; }
  else { direction = "below"; directionLabel = "Below your recent baseline"; }
  return { ...baseline, avg7, diff, pctDiff, direction, directionLabel, sampleSize7d: last7.length };
}
// Matches HRV readings to their nearest prior dose of a given compound — for Insights'
// "first 24-48h after dose vs baseline" and similar comparisons. Never claims causation;
// callers are responsible for that framing.
function getHRVDoseMatches(compoundName) {
  const p = allPeptides()[compoundName];
  if (!p || !(p.doses || []).length) return [];
  const doses = [...p.doses].sort((a, b) => new Date(a.date) - new Date(b.date));
  return getHRVRows("all").map(row => {
    const t = new Date(row.date).getTime();
    let nearestDose = null, bestDiff = null;
    doses.forEach(d => {
      const diff = (t - new Date(d.date).getTime()) / 86400000;
      if (diff >= 0 && (bestDiff === null || diff < bestDiff)) { bestDiff = diff; nearestDose = d; }
    });
    return { date: row.date, hrv: row.hrv, restingHR: row.restingHR, daysSinceDose: bestDiff, doseAmount: nearestDose ? nearestDose.dose : null };
  }).filter(r => r.daysSinceDose != null);
}

function currentPhase(phases, daysSinceLast) {
  if (daysSinceLast == null || !phases) return null;
  return phases.find(p => daysSinceLast >= p.range[0] && daysSinceLast < p.range[1]) || phases[phases.length-1];
}

function pkCurveSection(name, data) {
  const c = cfg(name);
  if (!c.phases || !c.halfLifeDays || !(data.doses||[]).length) return "";
  const doses = (data.doses||[]).filter(d=>d.date);
  const lastDose = [...doses].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  if (!lastDose) return "";
  const daysSince = (Date.now() - new Date(lastDose.date).getTime()) / 86400000;
  const phase = currentPhase(c.phases, daysSince);
  // Build curve: from lastDose-1 day to lastDose+8 days
  const origin = new Date(lastDose.date).getTime() - 86400000;
  const W=480, H=100, pad=24;
  const totalDays = 10;
  const px = frac => pad + frac * (W - pad*2);
  const py = v => pad + (1 - Math.min(1.2, v)/1.2) * (H - pad*1.5);
  const nowFrac = (Date.now() - origin) / (totalDays * 86400000);
  const nowX = Math.min(W-pad, Math.max(pad, px(nowFrac)));
  // Sample the curve
  const STEPS = 80;
  const pts = [...Array(STEPS+1)].map((_,i) => {
    const t = origin + (i/STEPS)*totalDays*86400000;
    const v = pkLevelAt(doses, c.halfLifeDays, t);
    return [px(i/STEPS), py(v)];
  });
  const pathD = pts.map(([x,y],i)=>`${i?"L":"M"} ${x} ${y}`).join(" ");
  // Phase background bands
  const phaseBands = c.phases.map(p => {
    const x1 = px(Math.max(0,(p.range[0]+1)/totalDays));
    const x2 = px(Math.min(1,(Math.min(p.range[1],totalDays-1)+1)/totalDays));
    if (x2<=x1) return "";
    return `<rect x="${x1}" y="${pad}" width="${x2-x1}" height="${H-pad*1.5}" fill="${p.color}" opacity="0.07"/>`;
  }).join("");
  // Dose markers
  const doseMarkers = doses.slice(-8).map(d => {
    const frac=(new Date(d.date).getTime()-origin)/(totalDays*86400000);
    if(frac<0||frac>1) return "";
    const x=px(frac);
    return `<line x1="${x}" y1="${pad}" x2="${x}" y2="${H-pad*0.5}" stroke="${c.color}" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.6"/><circle cx="${x}" cy="${H-pad*0.5}" r="3" fill="${c.color}" opacity="0.8"/>`;
  }).join("");
  const nowInRange = nowFrac>=0 && nowFrac<=1;
  return `
  <div style="margin-bottom:10px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;flex:1">ESTIMATED PLASMA ACTIVITY</div>
      ${statusBadge(phase.shortLabel||phase.label, phase.color)}
    </div>
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;margin-bottom:8px">
      ${phaseBands}
      <path d="${pathD}" fill="none" stroke="${c.color}" stroke-width="2" stroke-linejoin="round"/>
      <path d="${pathD} L ${pts[pts.length-1][0]} ${H-pad*0.5} L ${pts[0][0]} ${H-pad*0.5} Z" fill="${c.color}" opacity="0.12"/>
      ${doseMarkers}
      ${nowInRange?`<line x1="${nowX}" y1="${pad*0.5}" x2="${nowX}" y2="${H-pad*0.5}" stroke="#fff" stroke-width="1.5" stroke-dasharray="2,3" opacity="0.5"/>
      <circle cx="${nowX}" cy="${py(pkLevelAt(doses,c.halfLifeDays,Date.now()))}" r="4" fill="#fff" opacity="0.9"/>
      <text x="${nowX+5}" y="${pad*0.9}" fill="#aaa" font-size="9" font-family="monospace">now</text>`:""}
      <text x="${pad}" y="${H-4}" fill="#444" font-size="8" font-family="monospace">-1d</text>
      <text x="${W/2-6}" y="${H-4}" fill="#444" font-size="8" font-family="monospace">+4d</text>
      <text x="${W-pad-10}" y="${H-4}" fill="#444" font-size="8" font-family="monospace">+9d</text>
    </svg>
    <div style="background:${phase.color}11;border:1px solid ${phase.color}33;border-radius:10px;padding:10px 14px">
      <div style="font-size:13px;font-weight:600;color:${phase.color};margin-bottom:4px">${phase.label}</div>
      <div style="font-size:12px;color:var(--t3);line-height:1.5">${phase.desc}</div>
    </div>
    <div style="font-size:10px;color:#3a3a3a;margin-top:8px;line-height:1.4">Model based on published PK parameters (half-life ~${c.halfLifeDays} days, SubQ absorption). Educational estimate — not a clinical reading. <span style="color:var(--t4)">Jastreboff et al., NEJM 2023; Phase 2 PK data.</span></div>
  </div>`;
}

// ─── Week schedule strip ───────────────────────────────────────────────────────
// Canonical per-day instance aggregation for a week — the ONE place This Week's strip,
// its summary line, and the weekly score all pull from. A day's instances are only ever
// "eligible" for missed/adherence once their own scheduled time (+ grace) has actually
// passed — a future-today occurrence is PENDING, never counted against you, no matter
// which surface is looking at it.
function getWeekInstances(weekKeys) {
  const aps = allPeptides();
  const activeCompounds = Object.entries(aps).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active");
  const cadenceDays = {};
  activeCompounds.forEach(([n,d])=>{
    const sorted=[...d.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const stepProj2 = (from) => { const sched=getEffectiveSchedule(d, addDays(dayKey(from),1)); return sched.scheduleWeekdays ? nextWeekdayDue(from, sched.scheduleWeekdays) : addDays(dayKey(from), sched.scheduleDays||7); };
    let next=stepProj2(sorted[sorted.length-1].date);
    for(let i=0;i<20;i++){
      if(next>weekKeys[weekKeys.length-1]) break;
      if(next>=weekKeys[0]) (cadenceDays[next]=cadenceDays[next]||new Set()).add(n);
      next=stepProj2(next);
    }
  });
  activeCompounds.forEach(([n,d])=>(d.doses||[]).forEach(dd=>{ const k=dayKey(dd.date); if(weekKeys.includes(k)) (cadenceDays[k]=cadenceDays[k]||new Set()).add(n); }));

  const dayInstances = {};
  weekKeys.forEach(k=>{
    const instances=[];
    (cadenceDays[k]||new Set()).forEach(n=>{
      const d=aps[n]; if(!d) return;
      getDayOccurrences(d,k).forEach(s=>instances.push({ pep:n, color:cfg(n).color, unit:cfg(n).unit, ...s }));
    });
    dayInstances[k]=instances;
  });
  return dayInstances;
}

function weekScheduleStrip() {
  const aps = allPeptides();
  const base = startOfWeek(logicalNow());
  const week = [...Array(7)].map((_,i)=>{ const d=new Date(base); d.setDate(d.getDate()+i); return d; });
  const today = localDate();
  const weekKeys = week.map(d=>calendarDayKey(d.toISOString()));
  const dayInstances = getWeekInstances(weekKeys);

  return `<div style="padding:0 14px 12px">
    <div style="display:flex;gap:3px;margin-bottom:4px">
      ${["Su","Mo","Tu","We","Th","Fr","Sa"].map((lbl,i)=>`<div style="flex:1;text-align:center;font-size:9px;color:${calendarDayKey(week[i].toISOString())===today?"#7DF9C0":"var(--t5)"};font-weight:600">${lbl}</div>`).join("")}
    </div>
    <div style="display:flex;gap:3px">
      ${week.map((d)=>{
        const k=calendarDayKey(d.toISOString()), isToday=k===today;
        const isPast=k<today, isFuture=k>today;
        // Paused occurrences carry no obligation at all — excluded here, not just from the
        // numerator, so a fully-paused day can't be counted as "missed" for having nothing
        // resolved. A day with nothing scheduled (paused or genuinely off-cadence) must
        // never read as missed just because it has zero occurrences.
        const inst = (dayInstances[k]||[]).filter(s=>s.status!=="paused");
        const total = inst.length;
        const completed = inst.filter(s=>s.status==="taken").length;
        const skipped = inst.filter(s=>s.status==="skipped").length;
        const overdue = inst.some(s=>s.status==="overdue");
        const allResolved = total>0 && inst.every(s=>["taken","skipped","moved","missed"].includes(s.status));
        const isDone = isPast && allResolved && overdue===false && (completed+skipped)===total && completed>0;
        const isMissed = isPast && total>0 && !allResolved; // past day with something never resolved
        const hasCheckin=!!state.dailyLogs.find(l=>dayKey(l.date)===k);
        const bg=isToday?"#7DF9C015":isDone?"#7DF9C00a":isMissed?"#ff7c7c0a":"transparent";
        const border=isToday?"#7DF9C055":isDone?"#7DF9C022":isMissed?"#ff7c7c33":"var(--border-sub)";
        const fracColor = total===0 ? "var(--t5)" : isMissed ? "#ff7c7c" : (isFuture) ? "var(--t4)" : completed===total ? "#7DF9C0" : "var(--t3)";
        // Future days show a plain count ("6 doses") — nothing to grade yet. Today/past
        // show a completion fraction, which is what actually scales as compound count
        // and multi-dose protocols grow, instead of packing in one dot per compound.
        const mainText = total===0 ? "" : isFuture ? `${total}` : `${completed}/${total}`;
        const subText = total===0 ? "" : isFuture ? (total===1?"dose":"doses") : "";
        return `<button class="calday" data-date="${d.toISOString()}" style="flex:1;min-height:52px;border-radius:8px;background:${bg};border:1px solid ${border};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:4px 2px">
          <span style="font-size:10px;color:${isToday?"#7DF9C0":"var(--t4)"};font-weight:${isToday?"700":"500"}">${d.getDate()}</span>
          ${mainText?`<span class="mono" style="font-size:11px;font-weight:700;color:${fracColor};line-height:1.3">${mainText}</span>`:hasCheckin?`<span style="font-size:8px;color:var(--t5)">·</span>`:""}
          ${subText?`<span style="font-size:7px;color:var(--t5)">${subText}</span>`:""}
        </button>`;
      }).join("")}
    </div>
  </div>`;
}

// ─── Profile modal ─────────────────────────────────────────────────────────────
function profileModal() {
  const p = state.profile;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#C9A0FF;letter-spacing:1.5px">EDIT PROFILE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
      <div id="avatar-preview" style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#7DF9C0,#C9A0FF);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#000;flex-shrink:0;overflow:hidden">
        ${p.avatar?`<img src="${p.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:`<span>${(p.name||"?")[0].toUpperCase()}</span>`}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:6px">
        <label style="background:#C9A0FF18;border:1px solid #C9A0FF44;color:#C9A0FF;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;text-align:center">
          📷 ${p.avatar?"Change photo":"Upload photo"}
          <input id="avatar-input" type="file" accept="image/*" style="display:none">
        </label>
        ${p.avatar?`<button id="remove-avatar" style="background:transparent;border:1px solid var(--border-sub);color:var(--t4);border-radius:8px;padding:5px 12px;font-size:11px">Remove photo</button>`:""}
      </div>
    </div>
    <label class="field-label">NAME</label><input id="pname" class="inp" value="${esc(p.name||"")}" style="margin-bottom:14px">
    <label class="field-label">PROTOCOL START DATE</label><input id="pstart" type="date" class="inp" value="${esc(p.startDate||"")}" style="margin-bottom:14px">
    <div style="display:flex;gap:10px">
      <div style="flex:1"><label class="field-label">GOAL WEIGHT (${state.settings.weightUnit})</label><input id="pgw" type="number" step="0.1" class="inp" value="${esc(p.goalWeight||"")}" placeholder="e.g. 140" style="margin-bottom:14px"></div>
    </div>
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">MEASUREMENT GOALS (${state.settings.measureUnit})</div>
    <div style="display:flex;gap:10px">
      ${MEASURES.map(([k,l,col])=>`<div style="flex:1"><label class="field-label" style="color:${col}66">${l}</label><input id="pg_${k}" type="number" step="0.1" class="inp" value="${esc(p['goal'+k[0].toUpperCase()+k.slice(1)]||"")}" placeholder="goal" style="margin-bottom:14px"></div>`).join("")}
    </div>
    <label class="field-label">PROTOCOL NOTES</label>
    <textarea id="pnotes" class="inp" placeholder="Clinician name, current protocol, reminders to self…" style="min-height:70px;resize:vertical;margin-bottom:18px">${esc(p.protocolNotes||"")}</textarea>
    <button id="psave" class="btn-primary" style="background:#C9A0FF">SAVE PROFILE</button>
  `, "#C9A0FF");
  m.querySelector("#x").onclick = closeModal;
  // Avatar upload with canvas compression (max 300×300, JPEG 80%)
  const avatarInput = m.querySelector("#avatar-input");
  const avatarPreview = m.querySelector("#avatar-preview");
  if(avatarInput) avatarInput.onchange = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX=300;
        const scale=Math.min(1,MAX/Math.max(img.width,img.height));
        const canvas=document.createElement("canvas");
        canvas.width=Math.round(img.width*scale);
        canvas.height=Math.round(img.height*scale);
        canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
        const dataUrl=canvas.toDataURL("image/jpeg",0.8);
        state.profile.avatar=dataUrl;
        // Update preview live
        avatarPreview.innerHTML=`<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  const removeAvatar = m.querySelector("#remove-avatar");
  if(removeAvatar) removeAvatar.onclick = () => {
    state.profile.avatar = null;
    avatarPreview.innerHTML=`<span>${(state.profile.name||"?")[0].toUpperCase()}</span>`;
    removeAvatar.remove();
  };
  m.querySelector("#psave").onclick = () => {
    state.profile = {
      ...state.profile,
      name:          m.querySelector("#pname").value,
      startDate:     m.querySelector("#pstart").value,
      goalWeight:    m.querySelector("#pgw").value,
      goalWaist:     m.querySelector("#pg_waist").value,
      goalHips:      m.querySelector("#pg_hips").value,
      goalGlute:     m.querySelector("#pg_glute").value,
      protocolNotes: m.querySelector("#pnotes").value,
    };
    saveState(); closeModal(); render();
  };
}

// ─── Profile view ──────────────────────────────────────────────────────────────
function buildReminders() {
  const reminders=[]; // {id, type, priority, icon, title, detail, color, action, actionLabel}
  const now=Date.now(), today=localDate(), aps=allPeptides();
  const r=(id,type,priority,icon,title,detail,color,action,actionLabel)=>reminders.push({id,type,priority,icon,title,detail,color,action,actionLabel});

  Object.entries(aps).forEach(([name,p])=>{
    if((p.status||"active")!=="active"||(p.doses||[]).length===0) return;
    const c=cfg(name);
    const sorted=[...p.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const last=sorted[sorted.length-1];
    const ds=daysSince(last.date)||0;
    const schedule=p.scheduleDays||7;
    const nextDueStr=addDays(dayKey(last.date),schedule);

    // Dose reminders — use getDoseStatus for consistent logic across the whole app
    const dStat=getDoseStatus(name,p);
    if(dStat.status==="overdue") r(`overdue_${name}`,"dose",0,"🚨",`${name} dose overdue`,dStat.label,c.color,"dose|"+name,"Log dose");
    else if(dStat.status==="due_now") r(`today_${name}`,"dose",1,"💉",`${name} dose due`,dStat.label,c.color,"dose|"+name,"Log dose");
    else if(dStat.status==="due_later_today") {} // shown in Today card / timeline only, not as alert card
    else if(dStat.nextDueStr&&dStat.nextDueStr===addDays(today,1)&&(state.settings._calDismissed||{})[name]!==dStat.nextDueStr) r(`tomorrow_${name}`,"dose",2,"📅",`${name} dose due tomorrow`,`${fmtDate(dStat.nextDueStr)} · Prepare your kit tonight`,c.color,"ics|"+name,"Add to calendar");

    // Phase reminders — wear off window approaching/entered
    // Suppress if user already logged a check-in today
    const hasCheckinToday = state.dailyLogs.some(l=>l.date===today);
    if(c.phases && !hasCheckinToday){
      const phase=currentPhase(c.phases,ds);
      if(phase?.id==="winding_down"||phase?.id==="wear_off") r(`phase_${name}`,"phase",3,"📉",`${name} entering Wear Off Window`,`Day ${Math.floor(ds)+1} — food noise may return. Good time to log symptoms.`,c.color,"checkin","Log check-in");
      else if(c.troughDay&&ds>=c.troughDay-1&&ds<c.troughDay+1) r(`trough_${name}`,"phase",3,"📊",`${name} trough window`,`Based on your pattern, trough symptoms may appear soon.`,c.color,"checkin","Log symptoms");
    }

    // Protocol phase-TRANSITION reminders moved below, out of this per-compound loop —
    // they now iterate state.protocols[] directly (the same source the Protocol tab
    // reads), not this compound's own data.phases copy, which is what let a phase change
    // visible on the Protocol card go completely unnoticed by Needs Attention.

    // Pattern-based: food noise / hunger RETURN only (not suppression symptoms)
    const RETURN_SYMS = /food noise return|appetite return|cravings|hunger return|increased hunger|\bcraving\b|\bhunger\b/i;
    const SUPPRESS_SYMS = /quiet|reduced|suppress|early satiety|full faster|less hungry/i;
    const allSymsRaw = [...state.dailyLogs.filter(l=>l.compound===name),...p.doses].flatMap(l=>(l.symptoms||[]).map(s=>({name:typeof s==="string"?s:s.name,date:l.date})));
    const returnSyms = allSymsRaw.filter(s=>RETURN_SYMS.test(s.name) && !SUPPRESS_SYMS.test(s.name));

    if(returnSyms.length>=3){
      const dsd=d=>{const t=new Date(d).getTime();let b=null;sorted.forEach(dose=>{const dt=(t-new Date(dose.date).getTime())/86400000;if(dt>=0&&(b===null||dt<b))b=dt;});return b;};
      const returnDays=returnSyms.map(s=>dsd(s.date)).filter(v=>v!=null);
      const minDay=(p.scheduleDays||7)>=6?3.5:2;
      const lateReturnDays=returnDays.filter(d=>d>=minDay);

      // Require 3+ distinct dose cycles
      const distinctCycles=new Set(lateReturnDays.map(d=>{
        const sym=returnSyms.find(s=>dsd(s.date)===d);
        return sorted.findIndex(dose=>{const dt=(new Date(sym?.date||0)-new Date(dose.date).getTime())/86400000;return dt>=0&&dt<(p.scheduleDays||7);});
      })).size;

      if(distinctCycles>=3 && lateReturnDays.length>=3){
        const avg=lateReturnDays.reduce((a,b)=>a+b,0)/lateReturnDays.length;

        // Require tight clustering: std deviation ≤ 1.0 day — otherwise data is too scattered to predict
        const variance=lateReturnDays.reduce((a,b)=>a+(b-avg)**2,0)/lateReturnDays.length;
        const stdDev=Math.sqrt(variance);

        if(stdDev<=1.0){
          // Only fire AHEAD of the predicted window, not after it's already passed
          // Current day must be within [-0.5, +0.5] of predicted day (upcoming or right now)
          // If ds > avg+0.5, the window has passed — suppress
          const earlyPhase=c.phases&&["activation","rising","peak"].includes(currentPhase(c.phases,ds)?.id);
          if(!earlyPhase && ds>=avg-0.5 && ds<=avg+0.5){
            r(`pattern_${name}`,"pattern",4,"💡",`${name} — hunger return expected today`,
              `Return typically occurs around Day ${avg.toFixed(1)} (±${stdDev.toFixed(1)}d) across ${distinctCycles} cycles.`,
              c.color,"checkin","Log check-in");
          }
        }
      }
    }
  });

  // Protocol phase-TRANSITION reminders — iterates state.protocols[] directly via
  // getProtocolPhaseInfo(), the exact same function the Protocol card and the tappable
  // phase roadmap use. This is what makes a phase change visible on the Protocol tab
  // guaranteed to also surface here — there's no second copy of the phase timeline for
  // these two surfaces to disagree about. Paused protocols are skipped entirely, since
  // pausing means "don't quietly progress," which extends to not alerting about
  // transitions that aren't actually approaching in real terms.
  if (state.settings.phaseRemindersEnabled!==false) {
    (state.protocols||[]).filter(proto=>["active","in_progress"].includes(proto.status)).forEach(proto=>{
      (proto.compounds||[]).forEach(comp=>{
        const info = getProtocolPhaseInfo(proto, comp);
        if (!info || info.done || info.notStartedYet) return;
        const c2 = cfg(comp.name);
        const today = localDate();

        // TODAY — detected by comparing today's date directly against the current
        // phase's own startDate, NOT by counting daysLeft down to 0. On the actual
        // transition day, info.current has already become the NEW phase with its full
        // duration still ahead (daysLeft equals the whole new phase's length, never 0) —
        // counting down could structurally never catch this moment. index>0 excludes the
        // very first phase, which has no "previous" phase to describe a change from.
        if (info.current.startDate===today && info.index>0) {
          const prev = info.phases[info.index-1], cur = info.current;
          const prevIsRest = prev.type!=="dose", curIsRest = cur.type!=="dose";
          const idBase = `ptransition_${comp.name}_${cur.startDate}`;
          if (!prevIsRest && curIsRest) r(idBase,"phase",2,"⏸",`${comp.name} rest phase begins today`,`Your active dosing ends. No doses will be scheduled during this rest period.`,c2.color,"protocol|"+comp.name,"View Protocol");
          else if (prevIsRest && !curIsRest) r(idBase,"phase",2,"▶",`${comp.name} dosing resumes today`,`Next phase: ${cur.dose||"—"} ${c2.unit} · ${cur.durationWeeks||4} weeks`,c2.color,"protocol|"+comp.name,"View Protocol");
          else r(idBase,"phase",2,"📈",`${comp.name} enters Phase ${info.index+1} today`,`New dose: ${cur.dose||"—"} ${c2.unit}`,c2.color,"protocol|"+comp.name,"View Protocol");
          return; // today's message takes priority — don't also fire a forward-looking one for the same compound today
        }

        // TOMORROW / 3-DAYS-OUT — forward-looking via info.next, unchanged from before.
        if (!info.next) return;
        const daysUntil = info.daysLeft;
        if (![1,3].includes(daysUntil)) return;
        const cur = info.current, next = info.next;
        const curIsRest = cur.type!=="dose", nextIsRest = next.type!=="dose";
        const describeChange = () => {
          if (!curIsRest && nextIsRest) return null;
          if (curIsRest && !nextIsRest) return null;
          if (next.dose && cur.dose && next.dose!==cur.dose) return `${cur.dose} ${c2.unit} → ${next.dose} ${c2.unit}`;
          return next.dose ? `${next.dose} ${c2.unit}` : null;
        };
        const enteringRest = !curIsRest && nextIsRest;
        const exitingRest = curIsRest && !nextIsRest;
        const idBase = `ptransition_${comp.name}_${next.startDate}`;
        if (daysUntil===1) {
          if (enteringRest) r(idBase,"phase",2,"⏸",`${comp.name} rest phase begins tomorrow`,`Your active dosing ends tomorrow.`,c2.color,"protocol|"+comp.name,"View Protocol");
          else if (exitingRest) r(idBase,"phase",2,"▶",`${comp.name} dosing resumes tomorrow`,`Next phase: ${next.dose||"—"} ${c2.unit} · ${next.durationWeeks||4} weeks`,c2.color,"protocol|"+comp.name,"View Protocol");
          else r(idBase,"phase",2,"📈",`${comp.name} enters Phase ${info.index+2} tomorrow`,`Your dose changes from ${cur.dose||"—"} to ${next.dose||"—"} ${c2.unit}.`,c2.color,"protocol|"+comp.name,"View Protocol");
        } else if (daysUntil===3) {
          const changeDesc = describeChange();
          const detail = enteringRest ? `Your active dosing ends in 3 days. Rest phase begins ${fmtDate(next.startDate)}.`
            : exitingRest ? `Your rest phase ends in 3 days. Dosing resumes ${fmtDate(next.startDate)} at ${next.dose||"—"} ${c2.unit}.`
            : `Phase change in 3 days.${changeDesc?" "+changeDesc+".":""}`;
          r(idBase+"_soon","phase",3, enteringRest?"⏸":exitingRest?"▶":"📈", `${comp.name} phase change in 3 days`, detail, c2.color,"protocol|"+comp.name,"View Protocol");
        }
      });
    });
  }

  // Reconstitution reminders — only for a kit that is actually still active, eligible
  // inventory: reconstituted, not marked done/discarded, and still has usable material
  // left. A kit that's been marked "Done" (used up, bad batch, or otherwise retired) or
  // fully depleted stops being a source of alerts the moment it's no longer active — its
  // history (recon date, discard reason) stays intact, it just can't keep generating
  // "expires soon" reminders forever. Alert identity is already per-kit (vial_expired_
  // ${s.id}), so once the kit is excluded here the specific alert simply stops
  // regenerating on the next render — no separate invalidation step needed.
  state.supplies.forEach(s=>{
    if(!s.reconDate) return; // never reconstituted — a sealed/stored kit has no expiry clock running
    if(s.kitStatus==="done") return; // explicitly retired (used up / bad batch / other) via Mark Done
    if(!s.activeKit) return; // not the currently in-use vial for this compound
    if(getKitRemainingMg(s)<=0) return; // depleted — nothing left to expire, regardless of kitStatus bookkeeping
    const age=Math.floor(daysSince(s.reconDate)||0);
    const limit=s.expiryDays||30;
    const c=cfg(s.name);
    if(age>=limit) r(`vial_expired_${s.id}`,"recon",0,"🚫",`${s.name} vial expired`,`Reconstituted ${age}d ago (${limit}-day limit) — discard and open a fresh vial`,c.color,"stash","Go to Stash");
    else if(age>=limit-5) r(`vial_expiring_${s.id}`,"recon",1,"⏰",`${s.name} vial expires in ${limit-age}d`,`Reconstituted ${age}d ago — ${limit}-day limit approaching`,c.color,"stash","Go to Stash");
  });

  // Supply reminders — same terminal-state guard as expiry above, explicit rather than
  // relying solely on activeKit (which Mark Done also flips off, but being explicit here
  // keeps this block correct even if a kit is ever depleted without going through Mark Done).
  state.supplies.filter(s=>s.activeKit && s.kitStatus!=="done").forEach(s=>{
    const c=cfg(s.name);
    // Canonical remaining and owned capacity — a vial given away must not sit in either
    // side of this calculation. Previously this recomputed "total − doses" from scratch
    // (no waste, no transfers, no prepared draws), so a kit with a transferred vial could
    // sit well under real depletion while this reminder stayed silent.
    const rem = getKitRemainingMg(s);
    const total = kitOwnedVialCount(s)*(s.vialMg||0);
    const pct = total>0 ? rem/total : 1;
    if(pct<=0.1) r(`supply_low_${s.id}`,"supply",1,"📦",`${s.name} kit almost depleted`,`${rem.toFixed(1)}mg remaining (${Math.round(pct*100)}%) — reorder soon`,c.color,"stash","Go to Stash");
    else if(pct<=0.25) r(`supply_25_${s.id}`,"supply",2,"📦",`${s.name} kit running low`,`${rem.toFixed(1)}mg remaining (${Math.round(pct*100)}%) — consider reordering`,c.color,"stash","Go to Stash");
  });

  // Sort by priority
  reminders.sort((a,b)=>a.priority-b.priority);
  return reminders;
}

function suggestReminderTime(name) {
  // 1. Use last logged dose time if it has a time component
  const p = allPeptides()[name];
  const sorted = [...(p?.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const last = sorted[sorted.length-1];
  if(last?.date && last.date.includes("T")) {
    const d = new Date(last.date);
    if(!isNaN(d)) return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  }
  // 2. Infer from compound timing guidance
  const lib = LIBRARY.find(l=>l.name===name);
  const timing = (lib?.timingInfo||"").toLowerCase();
  if(/evening|before bed|night|sleep/i.test(timing)) return "21:00";
  if(/morning|fasted|wake/i.test(timing)) return "08:00";
  if(/pre-workout|workout/i.test(timing)) return "09:00";
  // 3. Stored user preference
  const prefs = state.settings._reminderTimes||{};
  if(prefs[name]) return prefs[name];
  // 4. GLP-1 weekly default
  return "08:00";
}

function exportICSWithTimePicker(name) {
  const p = allPeptides()[name]; if(!p) return;
  const sorted = [...p.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const last = sorted[sorted.length-1]; if(!last) return;
  const c = cfg(name);
  const isPhased = p.phases && p.phases.length && p.startDate;
  const nextDue = isPhased ? (nextDueDate(p)||localDate()) : addDays(dayKey(last.date), p.scheduleDays||7);
  const suggestedTime = suggestReminderTime(name);

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:12px;color:${c.color};letter-spacing:1px">📅 ADD TO CALENDAR</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:13px;color:var(--t2);margin-bottom:16px"><b>${esc(name)}</b>${isPhased?"":` · every ${p.scheduleDays||7} days`}<br><span style="color:var(--t4);font-size:12px">Next due: ${fmtDate(nextDue)}</span></div>
    ${isPhased ? `<div style="font-size:11px;color:var(--t4);margin-bottom:14px">This compound has ${p.phases.length} protocol phases — the calendar export will include a separate recurring block for each phase's date range and schedule, so it changes automatically the same way Today does.</div>`
      : (p.dosesPerDay||1)>1 ? `<div style="font-size:11px;color:var(--t4);margin-bottom:14px">This compound is scheduled ${p.dosesPerDay}×/day — each configured time (${getOccurrenceTimes(p).join(", ")}) gets its own calendar event automatically.</div>` : `
    <div style="margin-bottom:12px">
      <label style="font-size:11px;color:var(--t4);display:block;margin-bottom:6px">REMINDER TIME</label>
      <input id="ics-time" type="time" class="inp" value="${suggestedTime}" style="box-sizing:border-box;width:100%;max-width:100%">
    </div>`}
    <div style="font-size:10px;color:var(--t5);margin-bottom:14px">${isPhased?"":p.scheduleDays===1?"Creates a recurring daily event.":p.scheduleDays===7?"Creates a recurring weekly event.":`Creates an event every ${p.scheduleDays} days.`} Works with iOS Calendar, Google Calendar, and Outlook.</div>
    <div style="display:flex;gap:8px">
      <button id="ics-save" style="flex:1;padding:12px;border-radius:10px;background:${c.color};color:#000;font-weight:700;font-size:13px">⬇ Download .ics</button>
    </div>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#ics-save").onclick = () => {
    const time = m.querySelector("#ics-time")?.value || suggestedTime;
    if(!state.settings._reminderTimes) state.settings._reminderTimes={};
    state.settings._reminderTimes[name]=time;
    saveState();

    let blocks;
    if (isPhased) {
      // One bounded recurrence block PER PHASE, using each phase's own effective
      // schedule/times/dose and the date range it actually covers — this is what makes
      // a daily-loading→weekly-maintenance protocol export correctly instead of as one
      // schedule that never changes.
      let cursor = p.startDate;
      blocks = p.phases.map((ph,pi)=>{
        const durDays = Math.round((ph.durationWeeks||4)*7);
        const phaseStart = cursor;
        const isLast = pi===p.phases.length-1;
        const phaseEnd = isLast ? null : addDays(cursor, durDays-1);
        cursor = addDays(cursor, durDays);
        const sched = getEffectiveSchedule(p, phaseStart);
        const times = getOccurrenceTimes(p, phaseStart);
        const occurrences = times.map((t,i)=>{
          const [hh,mm]=t.split(":");
          const label = times.length>1 ? (i===0?"Morning":i===times.length-1?"Evening":`Dose ${i+1}`) : null;
          return { hh, mm, label, dose: occurrenceDoseAmount(p,i,phaseStart)||ph.dose||last.dose };
        });
        return { startDate: phaseStart, untilDate: phaseEnd, scheduleWeekdays: sched.scheduleWeekdays, scheduleDays: sched.scheduleDays, occurrences, label: `Phase ${pi+1}` };
      }).filter(b=>b.occurrences.some(o=>o.dose)); // skip pure rest phases with nothing to dose
    } else if ((p.dosesPerDay||1)>1) {
      const times = getOccurrenceTimes(p);
      blocks = [{ startDate: nextDue, untilDate:null, scheduleWeekdays:null, scheduleDays:p.scheduleDays||7,
        occurrences: times.map((t,i)=>{ const [hh,mm]=t.split(":"); const label=i===0?"Morning":i===times.length-1?"Evening":`Dose ${i+1}`; return {hh,mm,label,dose:occurrenceDoseAmount(p,i)||last.dose}; }) }];
    } else {
      const [hh,mm] = time.split(":");
      blocks = [{ startDate: nextDue, untilDate:null, scheduleWeekdays:null, scheduleDays:p.scheduleDays||7, occurrences:[{hh,mm,label:null,dose:last.dose}] }];
    }

    const ics = generateICS(name, `${name} dose${last.dose?" — "+last.dose+(c.unit||"mg"):""} · Logged in Nexus`, blocks);
    const blob = new Blob([ics],{type:"text/calendar"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`${name}-schedule.ics`; a.click();
    URL.revokeObjectURL(a.href);
    if(!state.settings._calDismissed) state.settings._calDismissed={};
    state.settings._calDismissed[name]=nextDue;
    saveState();
    closeModal();
  };
}

function generateICS(name, notes, blocks) {
  const c=cfg(name);
  // blocks: [{ startDate, untilDate (null = open-ended), scheduleWeekdays, scheduleDays,
  // occurrences:[{hh,mm,label,dose}] }] — one bounded recurrence set per protocol phase,
  // so a compound that's daily for 2 weeks then weekly forever doesn't get exported as a
  // single never-changing daily event.
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//PeptideTracker//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH"];
  blocks.forEach((block,bi)=>{
    const rrule = block.scheduleWeekdays ? null // weekday-specific handled via BYDAY below
      : block.scheduleDays===1?"RRULE:FREQ=DAILY;INTERVAL=1"
      : block.scheduleDays===7?"RRULE:FREQ=WEEKLY;INTERVAL=1"
      : block.scheduleDays%7===0?`RRULE:FREQ=WEEKLY;INTERVAL=${block.scheduleDays/7}`
      : `RRULE:FREQ=DAILY;INTERVAL=${block.scheduleDays}`;
    const byDayMap=["SU","MO","TU","WE","TH","FR","SA"];
    const weekdayRule = block.scheduleWeekdays ? `RRULE:FREQ=WEEKLY;BYDAY=${block.scheduleWeekdays.map(d=>byDayMap[d]).join(",")}` : null;
    const untilSuffix = block.untilDate ? `;UNTIL=${block.untilDate.replace(/-/g,"")}T235959Z` : "";
    const finalRule = (weekdayRule||rrule) + untilSuffix;
    block.occurrences.forEach((occ,i)=>{
      const hh=String(occ.hh).padStart(2,"0"), mm=String(occ.mm).padStart(2,"0");
      const dtStart=block.startDate.replace(/-/g,"")+`T${hh}${mm}00`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:dose-${name}-block${bi}-${i}@peptidetracker`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g,"").slice(0,15)}Z`,
        `DTSTART:${dtStart}`,
        `DURATION:PT15M`,
        finalRule,
        `SUMMARY:${name}${block.label?" — "+block.label:""}${occ.label?" — "+occ.label:""} dose${occ.dose?" — "+occ.dose+(c.unit||"mg"):""}`,
        `DESCRIPTION:${notes||"Logged from Nexus"}`,
        "STATUS:CONFIRMED","TRANSP:OPAQUE","END:VEVENT"
      );
    });
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function getOnboardingChecklist() {
  const p=state.profile, s=state;
  return [
    {key:"profile",label:"Complete your profile",done:!!(p.name?.trim()||p.startWeight),action:()=>{tab="profile";render();window.scrollTo(0,0);},hint:"Profile → set name, weight, goal"},
    {key:"stash",label:"Add your first kit",done:s.supplies.length>0,action:()=>{tab="stash";render();window.scrollTo(0,0);},hint:"Stash → + Add Kit"},
    {key:"protocol",label:"Create your first protocol",done:(s.protocols||[]).length>0,action:()=>{tab="protocols";render();window.scrollTo(0,0);},hint:"Protocol → New Protocol"},
    {key:"activate",label:"Activate a protocol",done:(s.protocols||[]).some(p=>["active","in_progress","paused","completed"].includes(p.status)),action:()=>{tab="protocols";render();window.scrollTo(0,0);},hint:"Protocol → Activate"},
    {key:"dose",label:"Log your first dose",done:Object.values({...s.peptides,...s.customPeptides}).some(p=>p.doses?.length>0),action:()=>{tab="home";render();window.scrollTo(0,0);},hint:"Today → + Log Dose"},
    {key:"checkin",label:"Complete a daily check-in",done:s.dailyLogs.length>0,action:()=>{tab="home";render();window.scrollTo(0,0);},hint:"Today → + Check-in"},
    {key:"intel",label:"Explore Compound Intel",done:Object.values({...s.peptides,...s.customPeptides}).some(p=>p.doses?.length>0),action:()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);},hint:"Nexus → Learn → Discover → tap any compound"},
    {key:"insight",label:"Review your first insight",
     done:(()=>{try{const f=insightsFeed();return f.includes("insights-tab")&&(f.includes("OVERVIEW")||f.includes("TRACK THIS NEXT"));}catch{return false;}})(),
     locked:(Object.values({...s.peptides,...s.customPeptides}).flatMap(p=>p.doses||[]).length < 2 || s.dailyLogs.length < 3),
     action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);},
     hint:"Keep logging — insights generate after 2+ dose cycles with check-ins"},
  ];
}

function onboardingChecklistCard() {
  const items=getOnboardingChecklist();
  const done=items.filter(i=>i.done).length;
  if(done===items.length) return "";
  const pct=Math.round(done/items.length*100);
  return `<div class="card" style="border-color:#A78BFA33;margin-bottom:14px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--t1)">Getting Started</div><div style="font-size:11px;color:var(--t4)">${done}/${items.length} complete</div></div>
      <div style="font-size:11px;color:#A78BFA">${pct}%</div>
    </div>
    <div style="background:var(--border);border-radius:3px;height:4px;margin-bottom:10px"><div style="background:#A78BFA;width:${pct}%;height:4px;border-radius:3px"></div></div>
    ${items.map(item=>`<button class="ob-check-item" data-key="${item.key}" style="width:100%;display:flex;align-items:center;gap:9px;padding:7px 0;border:none;background:transparent;border-bottom:1px solid var(--surface-2);cursor:${item.done||item.locked?"default":"pointer"}">
      <span style="font-size:16px;flex-shrink:0">${item.done?"✅":item.locked?"🔒":"⬜"}</span>
      <div style="flex:1;text-align:left"><div style="font-size:12px;color:${item.done?"var(--t4)":item.locked?"var(--t5)":"var(--t1)"};text-decoration:${item.done?"line-through":"none"}">${item.label}</div>${(!item.done)?`<div style="font-size:10px;color:var(--t5)">${item.hint}</div>`:""}</div>
      ${!item.done&&!item.locked?`<span style="font-size:10px;color:#A78BFA;flex-shrink:0">→</span>`:""}
    </button>`).join("")}
  </div>`;
}


// v0.5.4 — same-day entry point and evidence-first contextual comparison.

// v0.5.5 — Local-first, customizable navigation. No health data in usage events.
const NX_QUICK_TOOLS=[
  {id:"calc",label:"Dose calculator",hint:"Conversion tool",icon:"▦"},
  {id:"changes",label:"What's changed?",hint:"Compare check-ins",icon:"↗"},
  {id:"stash",label:"Inventory",hint:"Stock & kits",icon:"▤"},
  {id:"supplies",label:"Supplies",hint:"Manage stock",icon:"▣"},
  {id:"history",label:"Compound history",hint:"Recorded doses",icon:"◷"},
  {id:"learn",label:"Learn",hint:"Guides & tools",icon:"◇"},
  {id:"journal",label:"Journal",hint:"Your entries",icon:"▤"},
  {id:"plans",label:"Plans",hint:"Goals & research",icon:"◎"}
];
function nxQuickIds(){
  const ids=state.settings?.nxQuickAccess;
  const defaults=["calc","changes","stash","history"];
  return Array.isArray(ids)?ids.filter((id,i)=>NX_QUICK_TOOLS.some(t=>t.id===id)&&ids.indexOf(id)===i).slice(0,4):defaults;
}
function nxQuickAccessView(){
  const selected=nxQuickIds();
  return `<section class="nx-qa" aria-label="Customizable quick access"><div class="nx-qa-head"><div><div class="nx-qa-eyebrow">YOUR SHORTCUTS</div><h2>Quick access</h2></div><button type="button" id="nx-qa-customize" aria-label="Customize quick access">Customize</button></div><div class="nx-qa-grid">${selected.map(id=>{const t=NX_QUICK_TOOLS.find(x=>x.id===id);return `<button type="button" class="nx-qa-tile" data-nx-quick="${t.id}" aria-label="Open ${t.label}"><span class="nx-qa-icon" aria-hidden="true">${t.icon}</span><span class="nx-qa-copy"><strong>${t.label}</strong><small>${t.hint}</small></span></button>`}).join("")}</div></section>`;
}
function nxUsageEvent(feature){
  // Deliberately track only feature IDs and aggregate counts, never dates, doses, symptoms or personal values.
  if(_demoActive||state.settings?.nxUsageEnabled!==true)return;
  const allowed=new Set(NX_QUICK_TOOLS.map(t=>t.id));if(!allowed.has(feature))return;
  const usage=state.settings.nxUsageCounts||{};
  usage[feature]=Math.min(999999,(Number(usage[feature])||0)+1);
  state.settings.nxUsageCounts=usage;saveState();
}
function nxQuickGo(id){
  nxUsageEvent(id);
  if(id==="calc")return nxOpenCalculator();
  if(id==="changes")return nxCheckinComparison(14);
  if(id==="stash"||id==="supplies"){tab="stash";state._stashSub=id==="supplies"?"equipment":"kits";render();window.scrollTo(0,0);return;}
  if(id==="history"){tab="trends";state._trendsOpen={...(state._trendsOpen||{}),compound:true};render();window.scrollTo(0,0);requestAnimationFrame(()=>{const el=document.querySelector("#nx-compound-library");if(el)el.scrollIntoView({behavior:"smooth",block:"start"});});return;}
  if(id==="learn"||id==="journal"){tab="amino";state._aminoSub=id;render();window.scrollTo(0,0);return;}
  if(id==="plans"){tab="plans";render();window.scrollTo(0,0);}
}
function nxQuickCustomize(){
  const selected=new Set(nxQuickIds());
  const m=openModal(`<h2 style="font-size:19px;color:var(--t1);margin:0 0 8px">Customize quick access</h2><p style="font-size:13px;color:var(--t3);margin-bottom:15px">Choose up to four shortcuts. Log Dose and New Check-in remain on Today.</p><div class="nx-qa-picker">${NX_QUICK_TOOLS.map(t=>`<label><input type="checkbox" value="${t.id}" ${selected.has(t.id)?"checked":""}/><span>${t.label}</span></label>`).join("")}</div><p id="nx-qa-error" role="status" style="font-size:12px;color:var(--t3);min-height:18px"></p><button type="button" id="nx-qa-save" class="btn-primary" style="width:100%;min-height:44px">Save shortcuts</button>`,"#A78BFA");
  if(!m)return;
  const boxes=[...m.querySelectorAll('.nx-qa-picker input')];
  boxes.forEach(b=>b.addEventListener('change',()=>{
    const chosen=boxes.filter(x=>x.checked);
    if(chosen.length>4){b.checked=false;m.querySelector('#nx-qa-error').textContent='You can choose up to four shortcuts.';}
    else m.querySelector('#nx-qa-error').textContent='';
  }));
  m.querySelector('#nx-qa-save').onclick=()=>{
    state.settings.nxQuickAccess=boxes.filter(x=>x.checked).map(x=>x.value);
    saveState();closeModal();render();
  };
}

function nxOpenCalculator(){
  // Reuse the original calculator renderer and wiring; do not duplicate calculations.
  const previousTab=tab;
  state._aminoSub="learn";state._learnSub="calc";
  state._guideOpen=null;state._discoverOpen=null;
  tab="amino";
  render();
  window.scrollTo(0,0);
}
function nxCheckinComparison(days=14){
  const end=new Date();end.setHours(23,59,59,999);
  const start=new Date(end.getTime()-days*86400000);start.setHours(0,0,0,0);
  const priorStart=new Date(start.getTime()-days*86400000);
  const logs=(state.dailyLogs||[]).filter(l=>l&&l.date&&Number.isFinite(new Date(l.date).getTime()));
  const inWindow=(l,a,b)=>{const t=new Date(l.date).getTime();return t>=a.getTime()&&t<b.getTime()};
  const recent=logs.filter(l=>inWindow(l,start,new Date(end.getTime()+1)));
  const previous=logs.filter(l=>inWindow(l,priorStart,start));
  const uniqueDays=arr=>new Set(arr.map(l=>dayKey(l.date))).size;
  const symDays=arr=>new Set(arr.filter(l=>Array.isArray(l.symptoms)&&l.symptoms.length).map(l=>dayKey(l.date))).size;
  const moodValues=arr=>arr.map(l=>Number(l.mood)).filter(v=>Number.isFinite(v)&&v>0);
  const mean=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:null;
  const currentDays=uniqueDays(recent),previousDays=uniqueDays(previous);
  const fmt=v=>v==null?"Not enough ratings":v.toFixed(1)+" / 5";
  const rate=(n,d)=>d?Math.round(n/d*100)+"% of logged days":"Not available";
  const recordList=(arr)=>arr.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(l=>`<div><b>${esc(dayKey(l.date))}</b> · Mood: ${Number(l.mood)>0?esc(String(l.mood))+"/5":"not recorded"} · Symptoms: ${Array.isArray(l.symptoms)&&l.symptoms.length?esc(l.symptoms.map(s=>typeof s==="string"?s:s.name||"Unspecified").join(", ")):"none listed"}</div>`).join("")||"<div>No check-ins recorded in this period.</div>";
  const thin=currentDays<3||previousDays<3;
  const m=openModal(`<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2 style="font-size:21px;margin:0;color:var(--t1)">Check-in changes</h2><button id="nx-report-close" class="btn-ghost" type="button">Close</button></div>
    <p style="color:var(--t3);font-size:13px;line-height:1.5">Compare two equal-length periods using your saved check-ins. No missing day is assumed symptom-free.</p>
    <div class="nx-report-toolbar">${[7,14,30].map(d=>`<button type="button" data-nx-report-days="${d}" aria-pressed="${d===days}">${d} days</button>`).join("")}</div>
    <div class="nx-report-row"><strong>Record coverage</strong><p>Recent: ${currentDays} of ${days} days · Previous: ${previousDays} of ${days} days</p>${thin?`<p>Limited comparable data: interpret changes cautiously.</p>`:""}</div>
    <div class="nx-report-row"><strong>Symptom reporting</strong><p>Recent: ${symDays(recent)} days (${rate(symDays(recent),currentDays)}) · Previous: ${symDays(previous)} days (${rate(symDays(previous),previousDays)})</p><p>This reflects symptoms listed in check-ins, not a diagnosis or proof of improvement.</p></div>
    <div class="nx-report-row"><strong>Recorded mood</strong><p>Recent: ${fmt(mean(moodValues(recent)))} · Previous: ${fmt(mean(moodValues(previous)))}</p><p>Only check-ins with a recorded mood rating contribute.</p></div>
    <details class="nx-report-row"><summary style="cursor:pointer;font-weight:650;color:var(--t1)">Inspect recent check-ins (${recent.length})</summary><div class="nx-report-records">${recordList(recent)}</div></details>
    <details class="nx-report-row"><summary style="cursor:pointer;font-weight:650;color:var(--t1)">Inspect previous check-ins (${previous.length})</summary><div class="nx-report-records">${recordList(previous)}</div></details>
    <p style="color:var(--t4);font-size:11px;line-height:1.5">Descriptive comparison only. Differences may reflect reporting frequency, missing data, or other factors. No causal claims are made.</p>`,"#A78BFA");
  m.querySelector('#nx-report-close').onclick=closeModal;
  m.querySelectorAll('[data-nx-report-days]').forEach(b=>b.onclick=()=>nxCheckinComparison(Number(b.dataset.nxReportDays)));
}

function homeView() {
  const now=new Date(), hr=now.getHours();
  const greeting=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";
  const aps=allPeptides();
  const filter=state._homeFilter||"active";
  const today=localDate();
  const allDosesToday=Object.entries(aps).flatMap(([n,p])=>(p.doses||[]).filter(d=>dayKey(d.date)===today).map(d=>({...d,pep:n})));
  const todayLog=state.dailyLogs.find(l=>dayKey(l.date)===today);
  const todayWeight=state.weightLogs.find(w=>dayKey(w.date)===today);
  const todayMacro=state.macroLogs.find(m=>dayKey(m.date)===today);
  const todaySupp=(state.supplementLogs||[]).find(s=>dayKey(s.date)===today);
  const weekStart=startOfWeek(now);
  const weekLogs2=state.dailyLogs.filter(l=>{ const d=safeDate(l.date); return d>=weekStart; });
  const needsWeekly=weekLogs2.length===0;
  const mood=todayLog?MOODS.find(m=>m.v===todayLog.mood):null;
  const isActive=([,d])=>(d.status||"active")==="active";
  const isPaused=([,d])=>d.status==="paused";
  const hasStarted=([,d])=>(d.doses||[]).length>0;
  const started=sortActiveCards(Object.entries(aps).filter(e=>isActive(e)&&hasStarted(e)));
  const notStarted=Object.entries(aps).filter(e=>isActive(e)&&!hasStarted(e));
  const paused=Object.entries(aps).filter(e=>isPaused(e));
  let html=`<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px"><div><h1 class="serif greet">${greeting}, ${esc(state.profile.name||"there")}</h1><div class="hint">${now.toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})}</div></div></div>`;
  const suppLoggedToday = (state.supplementLogs||[]).find(s=>dayKey(s.date)===today);
  // Phase 2B: compact, read-only daily orientation using the existing occurrence engine.
  // Never infer completion from inventory, and never change any schedule or dose record.
  const todaySlots = started.flatMap(([name, record]) => {
    if (!isCompoundRelevantToday(getDoseStatus(name, record))) return [];
    return getDayOccurrences(record, today).filter(slot => slot.status !== "paused");
  });
  const scheduledCount = todaySlots.length;
  const takenCount = todaySlots.filter(slot => slot.status === "taken").length;
  const pendingCount = todaySlots.filter(slot => ["overdue", "due_now", "due_later_today", "upcoming"].includes(slot.status)).length;
  const progressPct = scheduledCount ? Math.round(takenCount / scheduledCount * 100) : 0;
  html += `<section class="nexus-today-hero" aria-label="Today's scheduled dose overview">
    <div class="nexus-today-eyebrow">TODAY</div>
    <div class="nexus-today-hero-row">
      <div><div class="nexus-today-big">${scheduledCount ? `${takenCount} <span>of ${scheduledCount}</span>` : `No scheduled doses`}</div>
        <div class="nexus-today-sub">${scheduledCount ? `logged · ${pendingCount} remaining` : `Nothing scheduled for today`}</div></div>
      
    </div>
    ${scheduledCount ? `<div class="nexus-today-track" role="progressbar" aria-label="Scheduled doses logged" aria-valuemin="0" aria-valuemax="${scheduledCount}" aria-valuenow="${takenCount}"><div style="width:${progressPct}%"></div></div>` : ``}
    
  </section>`;
  html+=`<div class="nexus-today-actions nexus-today-actions-b4"><button type="button" id="today-log-dose" class="nexus-today-action-primary">＋ Log dose</button><button type="button" class="${todayLog?"editdaily":"qa-daily"} nexus-today-action-secondary" data-id="${todayLog?todayLog.id:""}">${todayLog?"Edit check-in":"＋ New check-in"}</button></div>`;
  html+=`<section aria-label="Daily check-in status" style="margin:12px 0 18px;padding:16px;background:var(--surface);border:1px solid var(--border-sub);border-radius:16px;display:flex;align-items:center;gap:12px"><span aria-hidden="true" style="font-size:24px;color:var(--t2)">${todayLog?"✓":"○"}</span><span style="flex:1;min-width:0"><strong style="font-size:14px;color:var(--t1)">Daily check-in</strong><span style="display:block;margin-top:4px;font-size:12px;color:var(--t3)">${todayLog?"Completed · "+(mood?esc(mood.label):"Recorded"):"Not completed today"}</span></span><button type="button" class="${todayLog?"editdaily":"qa-daily"}" data-id="${todayLog?todayLog.id:""}" style="padding:10px 13px;min-height:44px;border:1px solid var(--border);border-radius:10px;color:var(--t2);font-size:12px">${todayLog?"Edit":"Check in"}</button></section>`;
  html+=nxQuickAccessView();
  const hasWeightThisWeek = state.weightLogs.some(w=>{ const d=safeDate(w.date); return d>=weekStart; });
  const hasMeasureThisWeek = state.measurementLogs.some(m=>{ const d=safeDate(m.date); return d>=weekStart; });

  // Soft nudges — collected here; vial expiry handled entirely by buildReminders (no duplicate)
  const softNudges=[];
  if(needsWeekly) softNudges.push({icon:"📋",color:"#F9C87D",title:"No check-ins this week",detail:"A quick daily log keeps your trough analysis sharp.",btnClass:"qa-daily",btnLabel:"Log now"});
  if(!hasWeightThisWeek) softNudges.push({icon:"⚖️",color:"#8AB4FF",title:"No weigh-in this week",detail:"Weekly weight helps track your body recomposition trend.",btnClass:"qa-weight",btnLabel:"Log now"});
  if(!hasMeasureThisWeek&&state.measurementLogs.length>0) softNudges.push({icon:"📏",color:"#FF9CC8",title:"No measurements this week",detail:"Monthly is fine — weekly shows the recomp shift faster.",btnClass:"qa-measure",btnLabel:"Log now"});

  // GETTING STARTED CHECKLIST
  const onboardingHtml = onboardingChecklistCard();
  if (onboardingHtml) html += `<details class="nexus-today-onboarding"><summary>Getting started <span aria-hidden="true">⌄</span></summary>${onboardingHtml}</details>`;

  // REMINDERS FEED — split urgent (priority 0-1) vs grouped (priority 2+)
  const reminders=buildReminders();
  // Dose due/overdue is already covered by the inline TODAY'S DOSES rows above
  // (doseRows, using the same getDoseStatus()) — no separate standalone alert card here,
  // that was restating the exact same compound/status/action a second time.
  const urgentRems=reminders.filter(r=>r.type==="dose"&&r.priority<=1);
  const softRems=reminders.filter(r=>!(r.type==="dose"&&r.priority<=1));
  // Collapsible "Needs Attention" group
  // Snooze only ever applies here — never to urgentRems (dose due/overdue), which are
  // safety-relevant and always shown regardless of snooze state.
  const snoozed = state.settings.snoozedReminders||{};
  const nowMs = Date.now();
  const notSnoozed = (id) => !(snoozed[id] && snoozed[id] > nowMs);
  const dismissedReminders = state.settings.dismissedReminders || {};
  const groupedItems=[
    ...softRems.map(r=>({id:r.id,icon:r.icon,color:r.color,title:r.title,detail:r.detail,action:r.action,actionLabel:r.actionLabel,isRem:true,isInfo:r.type==="pattern"})),
    ...softNudges.map(n=>({...n,id:"nudge_"+n.title}))
  ].filter(item=>notSnoozed(item.id) && !dismissedReminders[item.id]);
  // Split into two buckets using data that already distinguishes them — reminder type
  // "pattern" (a detected behavioral pattern, purely informational) vs everything else
  // (expiring/low supply, phase windows, missed check-ins — all worth acting on). This
  // reuses the exact same buildReminders() output, just grouped differently; nothing new
  // is computed, and nothing is shown in both places.
  const needsAttnItems = groupedItems.filter(i=>!i.isInfo);
  const forYouItems = groupedItems.filter(i=>i.isInfo);
  const renderGroupCard = (item, idx, total) => item.isRem
    ?`<div style="display:flex;gap:6px;align-items:center;padding:10px 14px;background:${item.color}0d;border-bottom:${idx<total-1?"1px solid var(--surface-2)":"none"}">
        <div class="reminder-card" data-action="${esc(item.action)}" data-name="${esc(item.title.split(" ")[0])}" style="display:flex;gap:10px;align-items:center;flex:1;min-width:0;cursor:pointer">
          <div style="font-size:16px;flex-shrink:0">${item.icon}</div>
          <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:var(--t1)">${esc(item.title)}</div><div style="font-size:11px;color:var(--t4)">${esc(item.detail)}</div></div>
          ${item.actionLabel?`<div style="font-size:10px;color:${item.color};background:${item.color}18;border:1px solid ${item.color}33;border-radius:6px;padding:3px 7px;white-space:nowrap;flex-shrink:0">${esc(item.actionLabel)}</div>`:""}
        </div>
        <button class="snooze-item" data-id="${esc(item.id)}" title="Manage alert" aria-label="Manage this alert" style="flex-shrink:0;min-width:32px;min-height:32px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border-sub);border-radius:8px;color:var(--t4);font-size:13px">⋯</button>
      </div>`
    :`<div style="display:flex;gap:6px;align-items:center;padding:10px 14px;background:var(--surface-2);border-bottom:${idx<total-1?"1px solid var(--surface)":"none"}">
        <div style="display:flex;gap:10px;align-items:center;flex:1;min-width:0">
          <div style="font-size:16px;flex-shrink:0">${item.icon}</div>
          <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:var(--t2)">${esc(item.title)}</div><div style="font-size:11px;color:var(--t4)">${esc(item.detail)}</div></div>
          ${item.btnClass?`<button class="${item.btnClass}" style="background:${item.color}18;border:1px solid ${item.color}44;color:${item.color};border-radius:7px;padding:5px 10px;font-size:11px;font-weight:600;flex-shrink:0">${item.btnLabel}</button>`:""}
        </div>
        <button class="snooze-item" data-id="${esc(item.id)}" title="Manage alert" aria-label="Manage this alert" style="flex-shrink:0;min-width:32px;min-height:32px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border-sub);border-radius:8px;color:var(--t4);font-size:13px">⋯</button>
      </div>`;
  const renderGroup = (items, icon, label) => items.length ? `<details class="app-detail" style="margin-bottom:14px" ${items.length<=1?"open":""}>
      <summary>
        <span style="font-size:14px">${icon}</span>
        <span style="font-size:12px;font-weight:600;color:var(--t2);flex:1">${label}</span>
        <span style="font-size:11px;color:var(--t4)">${items.length} item${items.length===1?"":"s"}</span>
        
      </summary>
      <div class="app-detail-body" style="padding:0;overflow:hidden">
        ${items.map((item,idx)=>renderGroupCard(item,idx,items.length)).join("")}
      </div>
    </details>` : "";
  const dismissedCount=Object.keys(dismissedReminders).length;
  const todayAttentionHtml = renderGroup(needsAttnItems, "🔔", "Needs attention") + renderGroup(forYouItems, "✨", "For you") + (dismissedCount ? `<div class="nexus-dismissed-alerts"><button type="button" id="restore-dismissed-alerts">Manage dismissed alerts (${dismissedCount})</button></div>` : "");

  // THIS WEEK — merged schedule strip + summary
  // (dosingTimeline now embedded in Today card above)
  const weekStart2=startOfWeek(logicalNow());
  const weekEnd2=new Date(weekStart2); weekEnd2.setDate(weekEnd2.getDate()+6);
  const weekRangeLabel=`${weekStart2.toLocaleDateString("en-CA",{month:"short",day:"numeric"})} – ${weekEnd2.toLocaleDateString("en-CA",{month:"short",day:"numeric"})}`;
  const weekStartStr = calendarDayKey(weekStart2.toISOString());
  const weekEndStr = calendarDayKey(weekEnd2.toISOString());
  const weekKeys2 = [...Array(7)].map((_,i)=>addDays(weekStartStr,i));
  // Same canonical per-instance source as the strip above — Today, This Week, and the
  // score can never disagree about whether something is missed, because they're reading
  // the same numbers, not three independent calculations.
  const weekInstances2 = getWeekInstances(weekKeys2);
  let wkTaken=0, wkMissed=0, wkPending=0, wkSkipped=0;
  const todayStr2 = localDate();
  // Completed/missed roll up every day THIS WEEK THAT HAS ACTUALLY STARTED (today and
  // earlier) — a future day hasn't happened yet, so it contributes to neither bucket.
  // Pending is scoped to TODAY specifically: a future day's occurrences are "planned"
  // (shown per-day in the strip above), not "pending" in the sense of something currently
  // awaiting action — conflating the two would make the summary balloon with next
  // Saturday's dose count and no longer describe "where things stand right now."
  Object.entries(weekInstances2).forEach(([k,list])=>{
    if (k>todayStr2) return;
    list.forEach(s=>{
      if (s.status==="taken") wkTaken++;
      else if (s.status==="overdue" || s.status==="missed") wkMissed++;
      else if (s.status==="skipped") wkSkipped++;
      else if (k===todayStr2 && ["due_now","due_later_today"].includes(s.status)) wkPending++;
    });
  });
  // Adherence-so-far is completed vs. completed+missed — occurrences that haven't come
  // due yet are excluded from the denominator entirely, not just from the numerator.
  // Otherwise every future dose this week silently drags the score down before it's even
  // had a chance to happen.
  const eligible = wkTaken + wkMissed;
  const adherencePct = eligible>0 ? Math.round(wkTaken/eligible*100) : null;
  const checkInPct=Math.round(weekLogs2.length/7*100);
  // Early in the week, almost everything is still pending — a blended score at that point
  // is mostly measuring the future, not the present. Only compute a numeric score once
  // there's enough eligible (actually-happened) data to be meaningful; otherwise say so
  // plainly instead of assigning a misleadingly low number.
  const hasEnoughData = eligible>=2 || weekLogs2.length>=1;
  const score = hasEnoughData ? (adherencePct!==null?Math.round(adherencePct*0.6+checkInPct*0.4):(checkInPct>0?checkInPct:null)) : null;
  const scoreColor=score===null?"var(--t4)":score>=80?"#7DF9C0":score>=55?"#F9C87D":"#ff7c7c";
  const scoreLabel=score===null?(wkPending>0?"Week in progress":"—"):score>=80?"Great":score>=55?"On Track":"Needs Attention";
  // ── THIS WEEK card — clean hierarchy ────────────────────────────────────────
  const statsLine=[
    [wkTaken,"Completed","#7DF9C0"],
    ...(wkSkipped>0?[[wkSkipped,"Skipped","var(--t4)"]]:[]),
    [wkMissed,"Missed",wkMissed>0?"#FF7C7C":"var(--t4)"],
    [wkPending,"Pending Today","var(--t3)"],
  ].map(([v,l,c])=>`<span style="color:${c};font-weight:600">${v}</span><span style="color:var(--t5);font-size:10px"> ${l}</span>`).join(`<span style="color:var(--border-sub);margin:0 6px">·</span>`);
  // The seven-day strip is collapsible — This Week's one job is a compact overview
  // (statsLine below), and the day-by-day grid is the "more detail" layer under it, not
  // something that needs to be visible every time. Session-only preference: doesn't
  // persist across app restarts, and never auto-expands on its own.
  const weekExpanded = !!state._weekExpanded;
  const thisWeekCardHtml=`<section class="nexus-week-card nexus-week-quiet" aria-label="Weekly progress">
    <div class="nexus-quiet-header"><button type="button" id="week-toggle" class="nexus-quiet-toggle" aria-expanded="${weekExpanded}" aria-controls="nexus-week-expanded" aria-label="${weekExpanded?"Hide":"Show"} weekly details"><span class="nexus-quiet-copy"><h3>This week</h3><p>${wkTaken} completed · ${wkMissed} missed${wkPending ? ` · ${wkPending} due today` : ``}</p></span><span class="nexus-quiet-chevron" aria-hidden="true"></span></button></div>
    <div id="nexus-week-expanded" ${weekExpanded?"":"hidden"}>
      <div class="nexus-week-expanded-top"><span>${weekRangeLabel}</span><button type="button" id="opendigest" class="nexus-text-action">Full report →</button></div>
      <div class="nexus-week-metrics" aria-label="Weekly dose outcomes"><div><strong>${wkTaken}</strong><span>Completed</span></div><div><strong>${wkPending}</strong><span>Due today</span></div><div><strong>${wkMissed}</strong><span>Missed</span></div></div>
      ${wkSkipped>0?`<p class="nexus-week-footnote">${wkSkipped} skipped this week</p>`:""}
      ${weekExpanded?weekScheduleStrip():""}
    </div>
  </section>`;
  // PRIMARY NAV — Today/Active/Upcoming/All. Today is the default: what needs attention
  // right now, not every active compound regardless of relevance.
  const homeViewKey = state._homeView || "today";
  const navBtn = (key,label,count) => `<button class="hv-nav" data-view="${key}" aria-pressed="${homeViewKey===key}" style="flex:1;padding:8px 4px;border-radius:9px;font-size:12px;font-weight:600;background:${homeViewKey===key?"var(--surface-3)":"transparent"};border:1px solid ${homeViewKey===key?"var(--border)":"var(--border-sub)"};color:${homeViewKey===key?"var(--t1)":"var(--t4)"};min-height:36px">${label}${count?` ${count}`:""}</button>`;
  html+=`<div id="nexus-today-schedule" class="nexus-today-section-label">Your schedule</div>`;
  html+=`<div class="nexus-today-view-nav">
    ${navBtn("today","Today")}
    ${navBtn("active","Active",started.length||"")}
    ${navBtn("upcoming","Upcoming")}
    ${navBtn("all","All")}
    <button id="add-custom-compound" title="Add custom compound" style="min-width:44px;min-height:36px;padding:8px 10px;border-radius:9px;background:transparent;border:1px solid var(--border-sub);color:var(--t3);font-size:16px;flex-shrink:0">＋</button>
  </div>`;
  // Combo logging is now a visible option inside Today’s Log dose action.
  // COMPOUND CARDS — every view routes through the SAME compact-card component
  // (renderCompoundCardCompact), so there's one place that fixes/breaks, not several.
  if (homeViewKey==="today") html += renderSinceLastVisit() + renderTodayCompoundSection(started);
  else if (homeViewKey==="active") html += renderActiveFullView(started);
  else if (homeViewKey==="upcoming") html += renderUpcomingFullView(started);
  else html += renderAllFullView(started, notStarted, paused);
  html += todayAttentionHtml; // contextual alerts appear after the schedule, not between progress and schedule
  html+=`<details class="nexus-today-details"><summary><span class="nexus-today-details-copy"><span class="nexus-today-details-title">Daily tracking</span><span class="nexus-today-details-meta">${todayLog?"Check-in complete":"Check-in pending"} · ${todaySupp?.taken?.length||0} supplements logged</span></span></summary><div class="nexus-today-details-body" style="padding:8px 16px 14px"><div style="display:flex;align-items:center;gap:10px;min-height:56px;border-bottom:1px solid var(--border-sub)"><div style="flex:1;min-width:0;font-size:13px;font-weight:600;color:var(--t1)">Check-in<div style="font-size:12px;font-weight:400;color:var(--t3);margin-top:3px">${todayLog?"Completed · "+(mood?esc(mood.label):"Recorded"):"Not completed"}</div></div><button type="button" class="${todayLog?"editdaily":"qa-daily"}" data-id="${todayLog?todayLog.id:""}" style="min-height:44px;padding:8px 12px;border-radius:10px;border:1px solid var(--border);color:var(--t2);font-size:12px">${todayLog?"Edit":"Log"}</button></div><div style="display:flex;align-items:center;gap:10px;min-height:56px;border-bottom:1px solid var(--border-sub)"><div style="flex:1;min-width:0;font-size:13px;font-weight:600;color:var(--t1)">Supplements<div style="font-size:12px;font-weight:400;color:var(--t3);margin-top:3px">${todaySupp?.taken?.length?todaySupp.taken.length+" taken":"Not logged"}</div></div><button type="button" class="${"qa-supp"}" style="min-height:44px;padding:8px 12px;border-radius:10px;border:1px solid var(--border);color:var(--t2);font-size:12px">${todaySupp?.taken?.length?"Edit":"Log"}</button></div><div style="display:flex;align-items:center;gap:10px;min-height:56px;border-bottom:1px solid var(--border-sub)"><div style="flex:1;min-width:0;font-size:13px;font-weight:600;color:var(--t1)">Weight<div style="font-size:12px;font-weight:400;color:var(--t3);margin-top:3px">${todayWeight?esc(todayWeight.weight)+" "+esc(state.settings.weightUnit):"Not logged"}</div></div><button type="button" class="${"qa-weight"}" style="min-height:44px;padding:8px 12px;border-radius:10px;border:1px solid var(--border);color:var(--t2);font-size:12px">${todayWeight?"Update":"Log"}</button></div><div style="display:flex;align-items:center;gap:10px;min-height:56px;border-bottom:1px solid var(--border-sub)"><div style="flex:1;min-width:0;font-size:13px;font-weight:600;color:var(--t1)">Nutrition<div style="font-size:12px;font-weight:400;color:var(--t3);margin-top:3px">${todayMacro?.calories?esc(todayMacro.calories)+" kcal":"Not logged"}</div></div><button type="button" class="${"qa-macro"}" style="min-height:44px;padding:8px 12px;border-radius:10px;border:1px solid var(--border);color:var(--t2);font-size:12px">${todayMacro?.calories?"Edit":"Log"}</button></div></div></details>`;

  // This Week recedes below the actual compound/dose list — it's a secondary weekly
  // summary, not the thing Today exists to answer.
  html += thisWeekCardHtml;
  return html;
}

function protocolTimeline() {
  const aps = allPeptides();
  const events = []; // {date, icon, text, color}
  const ev = (date,icon,text,color) => events.push({date:new Date(date).getTime(),icon,text,color});

  Object.entries(aps).forEach(([n,p])=>{
    if(!(p.doses||[]).length) return;
    const c = cfg(n);
    const sorted=[...p.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
    ev(sorted[0].date, "🚀", `Started ${n} ${sorted[0].dose?sorted[0].dose+" "+c.unit:""}`, c.color);
    // Dose changes
    for(let i=1;i<sorted.length;i++){
      const prev=parseFloat(sorted[i-1].dose), cur=parseFloat(sorted[i].dose);
      if(prev&&cur&&prev!==cur) ev(sorted[i].date, cur>prev?"📈":"📉", `${n} ${cur>prev?"increased":"decreased"} to ${cur} ${c.unit}`, c.color);
    }
  });

  // Kit events: new kit added, reconstitution
  state.supplies.forEach(s=>{
    const c=cfg(s.name);
    if(s.id) ev(s.id, "📦", `New ${s.name} kit added (${s.totalVials||1}× ${s.vialMg||"?"}${c.unit})`, c.color);
    (s.reconHistory||[]).forEach(rh=>{ if(rh.date) ev(rh.date,"🧪",`Opened ${s.name} vial`,c.color); });
    if(s.reconDate && !(s.reconHistory||[]).length) ev(s.reconDate,"🧪",`Opened ${s.name} vial`,c.color);
  });

  // Weight milestones (5/10/15/20 unit marks toward goal)
  if(state.weightLogs.length){
    const sorted=[...state.weightLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const start=parseFloat(state.profile.startWeight||sorted[0].weight);
    let lastMarked=0;
    sorted.forEach(w=>{
      const delta=Math.abs(start-parseFloat(w.weight));
      [5,10,15,20,25,30].forEach(m=>{ if(delta>=m && lastMarked<m){ ev(w.date,"🎯",`Reached ${m} ${state.settings.weightUnit||"lbs"} ${parseFloat(w.weight)<start?"lost":"gained"}`,"#7DF9C0"); lastMarked=m; } });
    });
  }

  // Major symptom shift: first week without a previously frequent symptom (reuse simplified check)
  if(state.dailyLogs.length>=14){
    const sortedLogs=[...state.dailyLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const allNames=[...new Set(sortedLogs.flatMap(l=>(l.symptoms||[]).map(s=>typeof s==="string"?s:s.name)))];
    allNames.forEach(sym=>{
      const occurrences=sortedLogs.filter(l=>(l.symptoms||[]).some(s=>(typeof s==="string"?s:s.name)===sym));
      if(occurrences.length<5) return;
      const lastOcc=occurrences[occurrences.length-1];
      const daysSinceLast=Math.floor((Date.now()-new Date(lastOcc.date).getTime())/86400000);
      if(daysSinceLast>=14) ev(addDays(dayKey(lastOcc.date),14),"✨",`Longest ${sym}-free streak begins`,"#C8FF9C");
    });
  }

  if(!events.length) return "";
  events.sort((a,b)=>b.date-a.date); // newest first
  const shown = state._timelineOpen ? events : events.slice(0,6);

  return `<div style="margin-bottom:18px;padding:16px 18px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px">
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:12px">📜 PROTOCOL TIMELINE</div>
    <div style="display:flex;flex-direction:column">
      ${shown.map((e,i)=>`<div style="display:flex;gap:10px;padding:8px 0;${i<shown.length-1?"border-bottom:1px solid var(--surface-2)":""}">
        <div style="font-size:15px;flex-shrink:0">${e.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;color:var(--t2)">${esc(e.text)}</div>
          <div style="font-size:10px;color:var(--t5);margin-top:1px">${fmtDate(dayKey(new Date(e.date).toISOString()))}</div>
        </div>
      </div>`).join("")}
    </div>
    ${events.length>6 ? `<button id="timeline-toggle" style="width:100%;margin-top:10px;padding:8px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:11px">${state._timelineOpen?"Show less":`Show all ${events.length} events`}</button>` : ""}
  </div>`;
}

function profileView() {
  if (state._settingsDetail) return renderSettingsDetailScreen(state._settingsDetail);

  const profileReturnTab = state._profileReturn;
  const subTab = state._profileTab || "profile";
  return `${profileReturnTab?`<button id="profile-back" style="display:flex;align-items:center;gap:6px;color:var(--t3);font-size:13px;margin-bottom:12px;padding:4px 0;background:transparent;border:none">‹ Back</button>`:""}
  <h1 class="serif greet">Profile</h1>
  ${renderProfileSubNav(subTab)}
  ${subTab==="profile"?renderProfileTabContent():subTab==="settings"?renderSettingsTabContent():renderSupplementsTabContent()}`;
}

function renderProfileSubNav(active) {
  const tabs = [["profile","Profile"],["settings","Settings"],["supplements","Supplements"]];
  return `<div style="display:flex;gap:4px;margin-bottom:18px;background:var(--surface-2);border-radius:12px;padding:4px">
    ${tabs.map(([key,label])=>`<button class="profile-subtab" data-tab="${key}" style="flex:1;min-height:44px;border-radius:9px;font-size:13px;font-weight:600;background:${active===key?"var(--surface)":"transparent"};border:none;color:${active===key?"var(--t1)":"var(--t4)"};box-shadow:${active===key?"0 1px 4px rgba(0,0,0,0.15)":"none"}">${label}</button>`).join("")}
  </div>`;
}

// ── PROFILE tab: identity, stats, goals, protocol notes, timeline ──────────
function renderProfileTabContent() {
  const p=state.profile||{};
  const goalNames=[p.goalWeight?"Weight":null,p.goalWaist?"Waist":null,p.goalHips?"Hips":null,p.goalGlute?"Glute":null].filter(Boolean);
  return `<div class="nx-page-intro"><p>Your personal details and preferences. Progress and activity history live in Trends.</p></div>
  <section class="nx-panel nx-profile-hero">
    <div class="nx-profile-avatar">${p.avatar?`<img src="${p.avatar}" alt="" style="width:100%;height:100%;object-fit:cover">`:esc((p.name||"?").charAt(0).toUpperCase())}</div>
    <div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:700;color:var(--t1)">${esc(p.name||"My profile")}</div><div class="nx-muted">${p.startDate?`Tracking since ${fmtDate(p.startDate)}`:"Add your personal details"}</div></div>
    <button id="editprofile" style="background:var(--surface-3);border:1px solid var(--border-sub);color:var(--t1);border-radius:10px;padding:10px 14px;min-height:44px;font-size:13px;font-weight:650">Edit</button>
  </section>
  <section class="nx-panel"><div class="nx-kicker">Your goals</div><div class="nx-panel-title">Personal targets</div>
    <p class="nx-muted" style="margin:0 0 12px">${goalNames.length?`${goalNames.length} target${goalNames.length===1?"":"s"} configured: ${goalNames.join(", ")}. View changes and trends in Body Progress.`:"No personal targets set yet. Add them in your profile."}</p>
    <button id="editprofile2" style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;min-height:42px;padding:9px 13px;color:var(--t1);font-size:13px;font-weight:650">${goalNames.length?"Edit targets":"Set targets"}</button>
  </section>
  ${p.protocolNotes?`<section class="nx-panel"><details><summary style="font-size:14px;font-weight:650;color:var(--t1);cursor:pointer">Protocol notes</summary><div class="nx-muted" style="white-space:pre-wrap;margin-top:10px">${esc(p.protocolNotes)}</div></details></section>`:""}
  <section class="nx-panel"><div class="nx-panel-title">Your tracking journey</div><p class="nx-muted" style="margin:0 0 10px">Past protocols and milestones are available on demand.</p><details><summary style="cursor:pointer;font-size:13px;font-weight:650;color:var(--t3);min-height:35px">Show timeline</summary><div style="margin-top:12px">${protocolTimeline()}</div></details></section>`;
}

// ── SETTINGS tab: iOS-style navigable row list ──────────────────────────────

// Lavender Atelier: shared minimalist Settings icon paths, no emoji glyph dependency.
const NX_SETTINGS_ICON_PATHS={'reminders':'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>','phasereminders':'<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/>','appupdates':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h7"/>','units':'<path d="M4 19h16M5 16l11-11 3 3-11 11H5z"/>','onboarding':'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>','health':'<path d="M12 21s-9-5.8-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.2-9 12-9 12z"/><path d="M7 12h3l2-3 2 6 2-3h2"/>','backup':'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v6h8V3M8 17h8"/>','datamanagement':'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>','developer':'<path d="M8 3h8M10 3v7L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3M8 17h8"/>'};
function nxSettingsIcon(key){
  return `<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${NX_SETTINGS_ICON_PATHS[key]||NX_SETTINGS_ICON_PATHS.appupdates}</svg>`;
}


// Nexus v0.5.6: local-only, opt-in shortcut analytics settings.
function nxUsageSettingsView(){
 const enabled=state.settings.nxUsageEnabled===true;
 const counts=state.settings.nxUsageCounts||{};
 const rows=NX_QUICK_TOOLS.map(t=>({label:t.label,count:Math.max(0,Number(counts[t.id])||0)})).sort((a,b)=>b.count-a.count);
 const total=rows.reduce((n,r)=>n+r.count,0);
 return `<section class="nx-usage-panel" aria-label="Shortcut usage preferences">
 <p style="font-size:14px;line-height:1.55;color:var(--t3)">Optional, on-device counters for Quick Access shortcuts only. No health values, dates, or external analytics are collected. Counts do not represent usage from other navigation paths.</p>
 <label style="display:flex;align-items:center;gap:12px;padding:16px;background:var(--surface);border:1px solid var(--border-sub);border-radius:14px;font-size:14px;color:var(--t1)"><input type="checkbox" id="nx-usage-toggle" ${enabled?'checked':''} style="width:22px;height:22px;accent-color:#A78BFA"/><span><strong>Track shortcut opens</strong><small style="display:block;color:var(--t3);font-size:12px;margin-top:3px">${enabled?'Enabled':'Disabled'} · off by default</small></span></label>
 <h3 style="font-size:17px;margin:22px 0 6px;color:var(--t1)">Shortcut activity</h3>
 <p style="font-size:12px;color:var(--t3);margin-bottom:12px">${total} recorded opens${enabled?'':' · tracking paused'}</p>
 ${rows.map(r=>`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 3px;border-bottom:1px solid var(--border-sub);font-size:14px"><span style="color:var(--t1)">${esc(r.label)}</span><strong style="color:var(--t3);font-variant-numeric:tabular-nums">${r.count}</strong></div>`).join('')}
 <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:20px"><button type="button" id="nx-usage-export" class="btn-primary" style="min-height:44px;padding:10px 16px">Export counts</button><button type="button" id="nx-usage-reset" style="min-height:44px;padding:10px 16px;border:1px solid var(--border-sub);border-radius:10px;color:var(--t1);background:var(--surface)">Reset counts</button></div>
 <p role="status" id="nx-usage-status" style="font-size:12px;color:var(--t3);margin-top:10px"></p>
 </section>`;
}
function nxUsageDownload(){
 const data={format:'nexus-shortcut-counts-v1',scope:'quick-access-only',counts:state.settings.nxUsageCounts||{}};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nexus-shortcut-counts.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('change',e=>{if(e.target?.id==='nx-usage-toggle'){
 state.settings.nxUsageEnabled=!!e.target.checked;saveState();render();
}});
document.addEventListener('click',e=>{
 const btn=e.target.closest?.('#nx-usage-export,#nx-usage-reset,#nx-shopping-from-stash');if(!btn)return;
 if(btn.id==='nx-usage-export'){nxUsageDownload();return;}
 if(btn.id==='nx-usage-reset'){if(!confirm('Reset all locally recorded shortcut counts?'))return;state.settings.nxUsageCounts={};saveState();render();return;}
 if(btn.id==='nx-shopping-from-stash'){tab='plans';state._plansSub='shopping';render();window.scrollTo(0,0);}
});

