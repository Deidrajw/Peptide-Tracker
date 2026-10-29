// Shared outline icons for the contextual compound actions.
// Purely visual: existing buttons retain all classes, data-name and event handlers.
function nxCompoundMenuIcon(kind) {
  const shapes = {
    history:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    settings:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="var(--surface-2)"/><circle cx="15" cy="12" r="2" fill="var(--surface-2)"/><circle cx="10" cy="18" r="2" fill="var(--surface-2)"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18c2 0 3-1 3-2.5 0-1-.7-1.5-.7-2.5 0-1.2 1-1.5 2.2-1.5H18A3 3 0 0 0 21 11a9 9 0 0 0-9-8Z"/><circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7.5" r="1" fill="currentColor" stroke="none"/>',
    pause:'<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    remove:'<path d="M5 12h14M12 5v14" transform="rotate(45 12 12)"/>'
  };
  return '<svg class="nx-compound-menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(shapes[kind]||"")+'</svg>';
}
function peptideCardHTML(name, data, opts={}) {
  const c = cfg(name);
  const status = data.status || "active";
  const doses = [...(data.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const last = doses[0];

  // ── Paused card ───────────────────────────────────────────────────────────────
  if (status === "paused") {
    return `<div class="card" style="border-color:#F9C87D33;opacity:0.85">
      <div class="nx-expanded-compound-head" style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:8px;height:8px;border-radius:50%;background:#555"></div>
        <span class="nx-expanded-name nx-today-compound-name" style="flex:1">${esc(name)}</span>
        ${statusBadge("⏸ Paused", "warning")}
        ${opts.showCollapseChevron?`<button class="compound-collapse-btn nx-today-disclosure" data-name="${esc(name)}" data-view="${esc(opts.view||'active')}" aria-label="Hide ${esc(name)} details" title="Hide details" style="min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;color:var(--t5);font-size:14px;background:transparent;border:none;padding:0">${nxTodayDisclosureInner(true)}</button>`:""}
      </div>
      <div style="font-size:12px;color:var(--t4);line-height:1.5;margin-bottom:12px">
        ${data.pausedAt?`Paused ${fmtDate(data.pausedAt)}`:""}${data.pauseNote?` · <span style="font-style:italic">${esc(data.pauseNote)}</span>`:""}
        <span style="display:block;margin-top:2px;color:var(--t5)">${doses.length} dose${doses.length===1?"":"s"} logged · history in Trends</span>
      </div>
      <div style="display:flex;gap:8px">
        <button class="pausepep" data-name="${esc(name)}" style="flex:1;background:#F9C87D18;border:1px solid #F9C87D44;color:#F9C87D;border-radius:8px;padding:9px 14px;font-size:12px;font-weight:600">▶ Resume</button>
        <button class="histtoggle" data-name="${esc(name)}" style="background:transparent;color:var(--t4);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font-size:12px">History (${doses.length})</button>
      </div>
      <div class="histbox" data-name="${esc(name)}" style="display:none;margin-top:14px;border-top:1px solid var(--border-sub);padding-top:12px">
        ${doses.slice(0,6).map(d=>`<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--surface-2)"><div style="width:2px;align-self:stretch;background:#F9C87D33;border-radius:2px"></div><div style="flex:1;min-width:0"><span style="font-size:12px;color:var(--t3)">${fmtDT(d.date)}</span>${d.sprayCount?` <span style="color:#F9C87D">${esc(d.sprayCount)} spray${d.sprayCount===1?"":"s"}</span> <span style="color:var(--t5);font-size:11px">(${esc(d.dose)} ${c.unit})</span>`:d.dose?` <span style="color:#F9C87D">${esc(d.dose)} ${c.unit}</span>`:""}</div></div>`).join("")}
      </div>
      <div class="nx-compound-remove-row"><button class="archivepep" data-name="${esc(name)}" aria-label="Remove ${esc(name)} from Today">Remove from Today</button></div>
    </div>`;
  }

  const firstDose = doses.length ? doses[doses.length-1] : null;
  // Use the compound's own protocol start date, not the global profile date
  const compProtocol = (state.protocols||[]).find(p=>
    (p.status==="active"||p.status==="in_progress") &&
    (p.compounds||[]).some(c=>c.name===name)
  );
  const protocolStart = compProtocol?.startDate
    || (firstDose ? firstDose.date : null);  // fallback to first dose if no protocol
  const protocolDays = protocolStart ? Math.floor(daysSince(protocolStart)) : null;
  const doseStatus = getDoseStatus(name, data); // shared helper — correct for daily and non-daily
  const left = doseStatus.left;
  const since = last ? daysSince(last.date) : null;
  const od = doseStatus.status === "overdue";
  const trough = c.troughDay && since >= c.troughDay && left !== null && left > 0;
  const sensitivityWindow = c.troughDay && since >= 3 && since < c.troughDay && left !== null && left > 0;
  const siteWarn = data.route!=="Nasal" ? siteRotationWarning(doses) : null; // lipohypertrophy is an injection-tissue risk, not applicable to nostril alternation
  const escalation = escalationReadiness(name, data);
  // Informational timing notes share one low-noise disclosure; rotation safety
  // stays visible as a separate alert. The original guidance text is retained.

  let ring = "";
  if (left !== null) {
    const cycleLen = doseStatus.cycleLengthDays || data.scheduleDays || 7;
    const pct=Math.max(0,Math.min(1,(left||0)/Math.max(1,cycleLen))), r=28, circ=2*Math.PI*r;
    const ringColor=od?"#ff4d4d":c.color;
    const leftAbs=Math.max(0,left);
    const ringVal=od?"!":formatCountdown(leftAbs);
    const ringFontSize = ringVal.length<=2?"15":ringVal.length<=3?"14":"13";
    ring = `<div style="position:relative;width:70px;height:70px;flex-shrink:0"><svg width="70" height="70" style="transform:rotate(-90deg)"><circle cx="35" cy="35" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="5"/><circle cx="35" cy="35" r="${r}" fill="none" stroke="${ringColor}" stroke-width="5" stroke-dasharray="${circ}" stroke-dashoffset="${circ*(od?0:pct)}" stroke-linecap="round"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><span class="mono" style="font-size:${ringFontSize}px;font-weight:700;color:${ringColor}">${ringVal}</span><span style="font-size:8px;color:var(--t4)">${od?"OVERDUE":"LEFT"}</span></div></div>`;
  }
  const currentPh = c.phases ? currentPhase(c.phases, since||0) : null;
  const nxInsightCount = Number(!!(currentPh&&!trough&&!sensitivityWindow))
    + Number(!!sensitivityWindow) + Number(!!trough)
    + Number(!!(escalation && escalation.signal==="may_be_ready"));
  const isProtoPaused = doseStatus.status === "protocol_paused";
  const isResting = doseStatus.status === "resting";
  const badges = [
    isProtoPaused?statusBadge("⏸ Protocol Paused","warning"):"",
    isResting?statusBadge(`⏸ Rest phase${doseStatus.restWeek?` · wk ${doseStatus.restWeek}/${doseStatus.restTotalWeeks}`:""}`,"warning"):"",
    currentPh&&!trough&&!isProtoPaused?statusBadge(currentPh.label, currentPh.color):"",
    trough?statusBadge("Winding Down", "#ff8c00"):"",
    ""
  ].filter(Boolean).join("");
  return `<div class="card nx-hybrid-expanded-compound" style="border-color:${trough?"#ff8c0044":sensitivityWindow?c.color+"55":c.color+"22"};box-shadow:${trough?"0 0 20px #ff8c0015":`0 0 20px ${c.color}08`}">
    <div class="nx-expanded-compound-head" style="display:flex;align-items:center;gap:10px;margin-bottom:${badges?"6":"16"}px">
      <div style="width:8px;height:8px;border-radius:50%;background:${c.color};box-shadow:0 0 8px ${c.color};flex-shrink:0"></div>
      <span class="nx-expanded-name nx-today-compound-name" style="font-size:15px;color:var(--t1);letter-spacing:1.5px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(name)}</span>
      
      ${opts.showCollapseChevron?`<button class="compound-collapse-btn nx-today-disclosure" data-name="${esc(name)}" data-view="${esc(opts.view||'active')}" aria-label="Hide ${esc(name)} details" title="Hide details" style="min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;color:var(--t5);font-size:14px;background:transparent;border:none;padding:0;flex-shrink:0">${nxTodayDisclosureInner(true)}</button>`:""}
    </div>
    ${badges?`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;padding-left:18px">${badges}</div>`:""}
    ${doseStatus.recentSkip?`<div style="font-size:11px;color:var(--t4);margin-bottom:10px;padding-left:18px">✕ Skipped ${esc(fmtDate(doseStatus.recentSkip.date))}${doseStatus.recentSkip.reason?` · ${esc(doseStatus.recentSkip.reason)}`:""} <button class="undoskip" data-name="${esc(name)}" data-date="${esc(doseStatus.recentSkip.date)}" style="color:var(--t4);text-decoration:underline;background:none;border:none;font-size:11px;padding:0;margin-left:4px">Undo</button></div>`:""}
    <section class="nx-compound-timing-row" aria-label="Dose schedule and timing" style="display:flex;gap:14px;margin-bottom:14px;flex-wrap:wrap">${ring}<div class="nx-compound-timing-details" style="flex:1;display:flex;flex-direction:column;gap:8px;justify-content:center;min-width:170px">
      <div class="nx-expanded-facts" style="display:flex;gap:20px;flex-wrap:wrap">${(()=>{const nextDueDisplay=doseStatus.nextDueStr?fmtShort(doseStatus.nextDueStr):doseStatus.nextDueMs?fmtShort(new Date(doseStatus.nextDueMs)):"—";return [["LAST",last?fmtShort(last.date):"—"],["NEXT",nextDueDisplay]]})().map(([l,v])=>`<div class="nx-expanded-fact"><div class="mono nx-expanded-fact-label" style="font-size:9px;color:var(--t4);letter-spacing:1.5px">${l}</div><div class="nx-expanded-fact-value" style="font-size:15px;color:var(--t2);font-weight:600;margin-top:2px">${v}${l==="LAST" && last?.dose ? `<small class="nx-expanded-last-dose">${esc(last.dose)} ${esc(c.unit)}</small>` : ""}</div></div>`).join("")}</div>
      
      
      
    </div></section>
    ${(data.dosesPerDay>1) ? (()=>{
      // Multi-dose-per-day: LAST/NEXT above is a whole-day summary. This strip shows
      // each of TODAY's individual occurrence slots — AM ✓ · PM due 8 PM — each
      // independently actionable (its own Log/Skip/Reschedule), because resolving one
      // occurrence must never affect another the same day.
      const todaySlots = getDayOccurrences(data, localDate());
      if (!todaySlots.length) return "";
      const fmtOccT = dt=>dt.toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"});
      const label12 = t=>{const [h,m]=t.split(":").map(Number); const ap=h>=12?"PM":"AM"; const h12=h%12||12; return `${h12}:${String(m).padStart(2,"0")} ${ap}`;};
      const slotLabel = (slot,i) => { const hour=Number(slot.time?.split(":")[0]); return Number.isFinite(hour) ? (hour<12?"Morning":hour<17?"Afternoon":"Evening") : `Dose ${i+1}`; };
      return `<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:10px 12px;margin-bottom:14px">
        <h3 class="nx-today-slots-title">Today's doses</h3>
        ${todaySlots.map((s,i)=>{
          const statusColor = s.status==="taken"?"#7DF9C0":s.status==="skipped"?"var(--t5)":s.status==="moved"?"#A78BFA":s.status==="missed"?"var(--t5)":s.status==="overdue"?"#FF7C7C":s.status==="due_now"?"#F9C87D":s.status==="paused"?"var(--t4)":"var(--t3)";
          const statusText = s.status==="taken"?`✓ Logged ${fmtOccT(new Date(s.dose.date))}`:s.status==="skipped"?"Skipped":s.status==="moved"?"Moved":s.status==="missed"?"Missed":s.status==="overdue"?"Overdue":s.status==="due_now"?"Due now":s.status==="paused"?"Paused":`Due ${label12(s.time)}`;
          const canAct = ["due_now","overdue","due_later_today","upcoming"].includes(s.status);
          return `<div class="nx-today-slot-row" style="${i<todaySlots.length-1?"border-bottom:1px solid var(--border-sub)":""}">
            <span class="nx-today-slot-period">${esc(slotLabel(s,i))}</span>
            <span class="nx-today-slot-status" style="color:${statusColor}">${statusText}</span>
            ${canAct?`<div class="nx-today-slot-actions"><button class="logdose" data-name="${esc(name)}" data-occ-time="${esc(s.dateTime)}" aria-label="Log ${esc(slotLabel(s,i).toLowerCase())} dose">Log</button>
            <button class="rescheduledose" data-name="${esc(name)}" data-date="${esc(s.dateTime)}" title="Reschedule this dose" aria-label="Reschedule ${esc(slotLabel(s,i).toLowerCase())} dose">Reschedule</button>
            <button class="skipdose" data-name="${esc(name)}" data-date="${esc(s.dateTime)}" title="Skip this dose" aria-label="Skip ${esc(slotLabel(s,i).toLowerCase())} dose">Skip</button></div>`:""}
          </div>`;
        }).join("")}
      </div>`;
    })() : ""}
    <div class="nx-compound-info-tabs" aria-label="Compound information">
      <input type="radio" class="nx-compound-tab-radio" name="nx-info-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}" id="nx-insights-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}" checked>
      <input type="radio" class="nx-compound-tab-radio" name="nx-info-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}" id="nx-history-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}">
      <input type="radio" class="nx-compound-tab-radio" name="nx-info-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}" id="nx-details-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}">
      <div class="nx-info-segments" role="group" aria-label="Select information view">
        <label for="nx-insights-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}">Insights${nxInsightCount || siteWarn? ` <span class="nx-info-count">(${nxInsightCount+Number(!!siteWarn)})</span>` : ""}</label>
        <label for="nx-history-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}">History</label>
        <label for="nx-details-${esc(name).replace(/[^a-zA-Z0-9_-]/g,'-')}">Details</label>
      </div>
      <div class="nx-info-panel nx-info-insights">
        <div class="nx-insight-summary"><span class="nx-insight-eyebrow">At a glance</span><strong>${od?"An occurrence needs attention":isProtoPaused?"Protocol paused":isResting?"Rest period":currentPh?.label||"Scheduled tracking"}</strong><span>${since!=null?`${Math.round(since*10)/10} days since your last entry`:"No dose entries recorded"}${doseStatus.nextDueStr?` · Next scheduled ${esc(fmtShort(doseStatus.nextDueStr))}`:""}</span></div>
        ${(()=>{const tv=getTimingVariance(data);if(!tv)return "";const mag=Math.abs(tv.avgMinutes),dir=tv.avgMinutes>0?"after":"before";return `<div class="nx-insight-fact"><strong>Logging time pattern</strong><span>${mag<5?"Usually logged near the scheduled time":`Usually logged about ${mag} minutes ${dir} the scheduled time`} · ${tv.sampleSize} records</span></div>`;})()}
        ${nxInsightCount || siteWarn || getTimingVariance(data) ? "" : '<p class="nx-info-empty">No additional insights for this schedule.</p>'}
    <div class="nx-insight-list">
    ${currentPh&&!trough&&!sensitivityWindow?`<div style="background:${currentPh.color}0d;border:1px solid ${currentPh.color}33;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:${currentPh.color}">${
      currentPh.id==="activation"  ? `Activation phase — current phase label from this protocol. Compare recorded symptoms and dose history for your own pattern.` :
      currentPh.id==="rising"      ? `Rising phase — compare your tracked check-ins and previous entries to identify any changes you noticed.` :
      currentPh.id==="peak"        ? `Peak phase — this is a schedule-derived phase label, not a measurement of concentration or effect. Review your recorded observations.` :
      currentPh.id==="cruise"      ? `Cruise phase — view your recent dose and check-in records to compare changes across this interval.` :
      currentPh.label
    }</div>`:""}
    ${sensitivityWindow?`<div style="background:${c.color}0d;border:1px solid ${c.color}33;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:${c.color}">Day ${Math.floor(since)+1} since the last recorded dose. This interval was flagged for review; compare your tracked observations.</div>`:""}
    ${trough?`<div><b>Timing window</b><span class="nx-insight-secondary">Day ${Math.floor(since)+1} since the last recorded dose. Compare recent check-ins to see whether your experience has changed.</span></div>`:""}
    ${escalation&&escalation.signal==="may_be_ready"?`<div class="nx-insight-review"><b>Time at recorded dose</b><span class="nx-insight-secondary">${escalation.weeksAtDose.toFixed(1)} weeks recorded at this dose. Compare dose history and your check-ins to review changes over time.</span></div>`:""}

    ${siteWarn?`<div style="background:#F9C87D11;border:1px solid #F9C87D44;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#F9C87D"><b>Site rotation</b><span class="nx-insight-secondary">${esc(siteWarn.site)} · ${siteWarn.countInLast5} of your last 5 recorded administrations. Review the full site history to compare locations.</span></div>`:""}
    </div>      </div>
      <div class="nx-info-panel nx-info-history">
        <div class="nx-info-panel-title">Recent records · ${doses.length} total</div>
        ${doses.length ? [...doses].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4).map(d=>`<div class="nx-info-history-row"><span>${esc(fmtShort(d.date))}</span><strong>${esc(String(d.dose||"—"))} ${esc(c.unit||"")}</strong></div>`).join("") : '<p class="nx-info-empty">No dose records yet.</p>'}
        <button class="histtoggle nx-info-history-action" data-name="${esc(name)}">View complete dose history</button>
      </div>
      <div class="nx-info-panel nx-info-details">
        ${since!=null?`<div class="nx-info-history-row"><span>Since last recorded dose</span><strong>${Math.round(since*10)/10} days</strong></div>`:""}
        <div class="nx-info-panel-title">Schedule information</div>
        <div class="nx-info-history-row"><span>Recorded doses</span><strong>${doses.length}</strong></div>
        <div class="nx-info-history-row"><span>Days on protocol</span><strong>${protocolDays==null?"—":protocolDays}</strong></div>
        ${last&&last.site?`<div class="nx-info-history-row"><span>Last recorded site</span><strong>${esc(last.site)}</strong></div>`:""}
        <button class="compound-intel-btn nx-info-history-action nx-intel-cta" data-name="${esc(name)}" aria-label="Open ${esc(name)} compound Intel">Open compound Intel <span aria-hidden="true">↗</span></button>
      </div>
    </div>
    ${renderCompoundActionArea(name, data, c, doses, doseStatus)}

    <div class="morebox" data-name="${esc(name)}" style="display:none;margin-top:8px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;overflow:hidden">
      
      <button class="ics-export" data-name="${esc(name)}" title="Add to calendar" style="width:100%;min-height:44px;display:flex;align-items:center;gap:8px;text-align:left;padding:0 14px;background:transparent;border:none;border-bottom:1px solid var(--border-sub);color:var(--t3);font-size:12px;font-weight:600">${nxCompoundMenuIcon("calendar")}Add to Calendar</button>
      <button class="tunetoggle" data-name="${esc(name)}" title="Schedule settings" style="width:100%;min-height:44px;display:flex;align-items:center;gap:8px;text-align:left;padding:0 14px;background:transparent;border:none;border-bottom:1px solid var(--border-sub);color:var(--t3);font-size:12px;font-weight:600">${nxCompoundMenuIcon("settings")}Schedule Settings</button>
      <div style="display:flex;align-items:center;gap:10px;min-height:44px;padding:0 14px;border-bottom:1px solid var(--border-sub)">
        <span class="nx-compound-colour-label" style="flex:1;font-size:12px;color:var(--t3);font-weight:600">${nxCompoundMenuIcon("palette")}Colour</span>
        <input type="color" class="colorpick" data-name="${esc(name)}" value="${c.color}" style="width:32px;height:26px;border:none;border-radius:6px;cursor:pointer;padding:2px;background:transparent">
        <button class="resetcolor" data-name="${esc(name)}" style="font-size:10px;color:var(--t4);border:1px solid var(--border);border-radius:6px;padding:3px 8px">Reset</button>
      </div>
      <button class="pausepep" data-name="${esc(name)}" style="width:100%;text-align:left;min-height:44px;display:flex;align-items:center;padding:0 14px;background:transparent;border:none;color:#F9C87D;font-size:12px;font-weight:600">${nxCompoundMenuIcon("pause")}Pause protocol</button>
      <button class="archivepep nx-menu-remove" data-name="${esc(name)}" aria-label="Remove ${esc(name)} from Today" style="width:100%;text-align:left;min-height:44px;display:flex;align-items:center;gap:8px;padding:0 14px;color:var(--t3);font-size:12px;font-weight:600">${nxCompoundMenuIcon("remove")}Remove from Today</button>
    </div>
    <div class="tunebox" data-name="${esc(name)}" style="display:none;margin-top:14px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px;padding:14px 16px">
      <div style="margin-bottom:14px">
        <div class="mono" style="font-size:11px;color:var(--t3);letter-spacing:1px;margin-bottom:8px">ADMINISTRATION</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
          ${ROUTES.map(r=>toggleChip(r, (data.route||"SubQ")===r, {attrs:`class="route-btn" data-name="${esc(name)}" data-route="${r}"`, fontSize:"11px", padding:"7px 10px"})).join("")}
        </div>
        <div class="route-nasal-ui" data-name="${esc(name)}" style="display:${data.route==="Nasal"?"block":"none"}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:10.5px;color:var(--t4)">MCG PER SPRAY</span>
            <input type="number" min="0" step="1" class="route-mcgperspray" data-name="${esc(name)}" value="${data.mcgPerSpray||""}" placeholder="e.g. 100" style="width:90px;height:28px;padding:0 8px;background:var(--surface-3);border:1px solid var(--border);border-radius:6px;color:var(--t1);font-size:12px;text-align:right">
          </div>
          <div style="font-size:9.5px;color:var(--t5)">From the bottle's label — needed to log doses by spray count instead of ${esc(c.unit)}.</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px">
        ${toggleChip("Every N Days", !isWeekdaySchedule(data), {attrs:`class="sched-mode-btn" data-name="${esc(name)}" data-mode="interval"`, fontSize:"11px", padding:"7px"})}
        ${toggleChip("Specific Days", isWeekdaySchedule(data), {attrs:`class="sched-mode-btn" data-name="${esc(name)}" data-mode="weekdays"`, fontSize:"11px", padding:"7px"})}
      </div>
      <div class="sched-interval-ui" data-name="${esc(name)}" style="display:${isWeekdaySchedule(data)?"none":"block"}">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span class="mono" style="font-size:11px;color:var(--t3);letter-spacing:1px">DOSING INTERVAL</span><span class="mono tuneval" style="font-size:14px;color:${c.color};font-weight:700">${data.scheduleDays} days</span></div>
        <input type="range" class="tunerange" data-name="${esc(name)}" min="1" max="14" step="0.5" value="${data.scheduleDays}" style="width:100%;accent-color:${c.color}">
        <div class="mono" style="display:flex;justify-content:space-between;font-size:9px;color:var(--t5);margin-top:2px"><span>1d</span><span>7d</span><span>14d</span></div>
      </div>
      <div class="sched-weekday-ui" data-name="${esc(name)}" style="display:${isWeekdaySchedule(data)?"block":"none"}">
        <div class="mono" style="font-size:11px;color:var(--t3);letter-spacing:1px;margin-bottom:8px">DOSE ON THESE DAYS</div>
        <div style="display:flex;gap:4px">
          ${WD_ABBR.map((wd,i)=>{const on=(data.scheduleWeekdays||[]).includes(i);return `<button class="sched-wd-chip" data-name="${esc(name)}" data-day="${i}" style="flex:1;padding:8px 0;border-radius:8px;font-size:10px;font-weight:600;background:${on?c.color+"22":"var(--surface-3)"};border:1px solid ${on?c.color:"var(--border)"};color:${on?c.color:"var(--t4)"}">${wd[0]}</button>`;}).join("")}
        </div>
      </div>
      <div style="border-top:1px solid var(--border-sub);margin-top:14px;padding-top:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span class="mono" style="font-size:11px;color:var(--t3);letter-spacing:1px">USE PROTOCOL PHASES</span>
          <label style="position:relative;display:inline-block;width:38px;height:22px"><input type="checkbox" class="phases-toggle" data-name="${esc(name)}" ${(data.phases&&data.phases.length)?"checked":""} style="opacity:0;width:0;height:0"><span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:${(data.phases&&data.phases.length)?"#A78BFA":"var(--border)"};border-radius:11px;transition:.2s"></span></label>
        </div>
        ${(data.phases&&data.phases.length) ? `
        <div style="font-size:9px;color:var(--t5);margin-bottom:10px">Each phase can have its own dose, frequency, and times. The schedule automatically switches to the next phase when its duration ends — no manual toggling.</div>
        <div style="margin-bottom:8px">
          <span style="font-size:11px;color:var(--t4)">Protocol start date</span>
          <input type="date" class="phase-startdate" data-name="${esc(name)}" value="${data.startDate||(doses.length?dayKey([...doses].sort((a,b)=>new Date(a.date)-new Date(b.date))[0].date):localDate())}" style="width:100%;height:32px;margin-top:4px;padding:0 8px;background:var(--surface-3);border:1px solid var(--border);border-radius:7px;color:var(--t1);font-size:12px">
        </div>
        ${data.phases.map((ph,pi)=>{
          const isCurrent = getCompoundPhase(data, localDate())===ph;
          const times = ph.schedule?.times || ["08:00"];
          const dpd = ph.schedule?.dosesPerDay||1;
          const isWeekly = !!(ph.schedule?.scheduleWeekdays);
          return `<div style="background:var(--surface-3);border:1px solid ${isCurrent?c.color+"66":"var(--border)"};border-radius:10px;padding:10px 12px;margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-size:11px;font-weight:700;color:${isCurrent?c.color:"var(--t2)"}">PHASE ${pi+1}${isCurrent?" · CURRENT":""}</span>
              <button class="phase-remove" data-name="${esc(name)}" data-pi="${pi}" style="color:var(--t5);font-size:12px">✕</button>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:6px">
              <button class="phase-rest-toggle" data-name="${esc(name)}" data-pi="${pi}" data-rest="0" style="flex:1;padding:6px 0;border-radius:7px;font-size:10px;font-weight:600;background:${!ph.isRest?"var(--surface-2)":"transparent"};border:1px solid ${!ph.isRest?c.color:"var(--border)"};color:${!ph.isRest?c.color:"var(--t4)"}">Dose</button>
              <button class="phase-rest-toggle" data-name="${esc(name)}" data-pi="${pi}" data-rest="1" style="flex:1;padding:6px 0;border-radius:7px;font-size:10px;font-weight:600;background:${ph.isRest?"var(--surface-2)":"transparent"};border:1px solid ${ph.isRest?"#F9C87D":"var(--border)"};color:${ph.isRest?"#F9C87D":"var(--t4)"}">Rest</button>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:6px">
              <div style="flex:1"><span style="font-size:9px;color:var(--t5)">DURATION (weeks)</span><input type="number" min="1" class="phase-duration" data-name="${esc(name)}" data-pi="${pi}" value="${ph.durationWeeks||4}" style="width:100%;height:30px;margin-top:2px;padding:0 6px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;color:var(--t1);font-size:12px"></div>
              ${ph.isRest?"":`<div style="flex:1"><span style="font-size:9px;color:var(--t5)">DOSE (${c.unit})</span><input type="text" inputmode="decimal" class="phase-dose" data-name="${esc(name)}" data-pi="${pi}" value="${ph.dose||""}" style="width:100%;height:30px;margin-top:2px;padding:0 6px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;color:var(--t1);font-size:12px"></div>`}
            </div>
            ${ph.isRest?`<div style="font-size:9px;color:var(--t5);margin-bottom:4px">No doses will be scheduled during this phase.</div>`:`
            <div style="display:flex;gap:6px;margin-bottom:6px">
              <button class="phase-freq-btn" data-name="${esc(name)}" data-pi="${pi}" data-mode="daily" style="flex:1;padding:6px 0;border-radius:7px;font-size:10px;font-weight:600;background:${!isWeekly?"var(--surface-2)":"transparent"};border:1px solid ${!isWeekly?c.color:"var(--border)"};color:${!isWeekly?c.color:"var(--t4)"}">Daily / Interval</button>
              <button class="phase-freq-btn" data-name="${esc(name)}" data-pi="${pi}" data-mode="weekly" style="flex:1;padding:6px 0;border-radius:7px;font-size:10px;font-weight:600;background:${isWeekly?"var(--surface-2)":"transparent"};border:1px solid ${isWeekly?c.color:"var(--border)"};color:${isWeekly?c.color:"var(--t4)"}">Specific Weekday</button>
            </div>
            ${isWeekly ? `<div style="display:flex;gap:4px;margin-bottom:6px">${WD_ABBR.map((wd,wi)=>{const on=(ph.schedule?.scheduleWeekdays||[]).includes(wi);return `<button class="phase-wd-chip" data-name="${esc(name)}" data-pi="${pi}" data-day="${wi}" style="flex:1;padding:6px 0;border-radius:6px;font-size:9px;font-weight:600;background:${on?c.color+"22":"var(--surface-2)"};border:1px solid ${on?c.color:"var(--border)"};color:${on?c.color:"var(--t4)"}">${wd[0]}</button>`;}).join("")}</div>`
            : `<div style="margin-bottom:6px"><span style="font-size:9px;color:var(--t5)">EVERY N DAYS</span><input type="number" min="1" class="phase-interval" data-name="${esc(name)}" data-pi="${pi}" value="${ph.schedule?.scheduleDays||1}" style="width:100%;height:30px;margin-top:2px;padding:0 6px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;color:var(--t1);font-size:12px"></div>`}
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:9px;color:var(--t5)">TIMES/DAY</span>
              <div style="display:flex;align-items:center;gap:8px">
                <button class="phase-dpd-dec" data-name="${esc(name)}" data-pi="${pi}" style="width:22px;height:22px;border-radius:6px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:12px">−</button>
                <span style="font-size:11px;color:${c.color};min-width:10px;text-align:center">${dpd}</span>
                <button class="phase-dpd-inc" data-name="${esc(name)}" data-pi="${pi}" style="width:22px;height:22px;border-radius:6px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:12px">+</button>
              </div>
            </div>
            ${times.slice(0,dpd).map((t,ti)=>`<input type="time" class="phase-time" data-name="${esc(name)}" data-pi="${pi}" data-ti="${ti}" value="${t}" style="width:100%;height:28px;margin-top:4px;padding:0 6px;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;color:var(--t1);font-size:11px">`).join("")}
            `}
          </div>`;
        }).join("")}
        <button class="phase-add" data-name="${esc(name)}" style="width:100%;padding:8px;border-radius:8px;border:1px dashed var(--border-sub);color:#A78BFA;font-size:11px">+ Add Phase</button>
        ` : `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:${data.dosesPerDay>1?"10px":"0"}">
          <span class="mono" style="font-size:11px;color:var(--t3);letter-spacing:1px">TIMES PER SCHEDULED DAY</span>
          <div style="display:flex;align-items:center;gap:10px">
            <button class="dpd-dec" data-name="${esc(name)}" style="width:26px;height:26px;border-radius:7px;background:var(--surface-3);border:1px solid var(--border);color:var(--t2);font-size:14px">−</button>
            <span class="mono dpd-val" style="font-size:14px;color:${c.color};font-weight:700;min-width:14px;text-align:center">${data.dosesPerDay||1}</span>
            <button class="dpd-inc" data-name="${esc(name)}" style="width:26px;height:26px;border-radius:7px;background:var(--surface-3);border:1px solid var(--border);color:var(--t2);font-size:14px">+</button>
          </div>
        </div>
        <div class="dpd-times-ui" data-name="${esc(name)}">
          ${(data.dosesPerDay>1) ? getOccurrenceTimes(data).map((t,i)=>`<div style="display:flex;align-items:center;gap:8px;margin-top:6px">
            <span style="font-size:11px;color:var(--t4);width:56px">${i===0?"Morning":i===getOccurrenceTimes(data).length-1?"Evening":"Dose "+(i+1)}</span>
            <input type="time" class="dpd-time-input" data-name="${esc(name)}" data-i="${i}" value="${t}" style="flex:1;height:32px;padding:0 8px;background:var(--surface-3);border:1px solid var(--border);border-radius:7px;color:var(--t1);font-size:12px">
            <input type="text" inputmode="decimal" class="dpd-amt-input" data-name="${esc(name)}" data-i="${i}" placeholder="amt" value="${occurrenceDoseAmount(data,i)||""}" style="width:56px;height:32px;padding:0 6px;background:var(--surface-3);border:1px solid var(--border);border-radius:7px;color:var(--t1);font-size:12px;text-align:center">
          </div>`).join("")+`<div style="font-size:9px;color:var(--t5);margin-top:6px">Leave amount blank to use the same dose each time. Times apply on every scheduled day.</div>
          <div id="dpd-total-${esc(name)}" class="mono" style="font-size:11px;color:var(--t3);margin-top:8px;padding-top:8px;border-top:1px solid var(--border-sub)">${dpdTotalLine(data, c.unit)}</div>` : ""}
        </div>`}
      </div>
    </div>
    <div class="histbox nx-dose-history" data-name="${esc(name)}" style="display:none;margin-top:16px;border-top:1px solid var(--border-sub);padding-top:14px">
      <div class="nx-dose-history-title"><strong>${doses.length} recorded doses</strong><span>Newest first</span></div>
      ${doses.map((d,i)=>`<div class="nx-dose-history-record ${i>=5?"nx-dose-history-extra":""}" style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--surface-2);align-items:flex-start"><div style="width:2px;align-self:stretch;background:${c.color}44;border-radius:2px"></div><div class="doseretro" data-name="${esc(name)}" data-id="${d.id}" style="flex:1;min-width:0;cursor:pointer"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:3px"><span style="font-size:12px;color:var(--t2)">${fmtDT(d.date)}</span>${d.dose?`<span style="font-size:11px;color:${c.color}">${esc(d.dose)} ${c.unit}</span>`:""}${d.site?`<span style="font-size:10px;color:var(--t4)">${esc(d.site)}</span>`:""}</div>${d.notes?`<div style="font-size:11px;color:var(--t4);font-style:italic">${esc(d.notes)}</div>`:""}${d.allocations&&d.allocations.length>1?`<div style="font-size:10px;color:#A78BFA;margin-top:3px">Source: ${d.allocations.length} vials · ${d.allocations.map(a=>{const k=state.supplies.find(s=>s.id===a.kitId);return `${a.amount}${c.unit}${k?" ("+(k.activeKit?"current":"other")+")":""}`;}).join(", ")}</div>`:""}${d.syringeId?`<button class="view-syringe" data-syringe="${d.syringeId}" style="display:block;font-size:10px;color:#A78BFA;margin-top:3px;background:transparent;border:none;padding:0">💉 Mixed syringe · ${(()=>{const pd=(state.preparedDoses||[]).find(p=>p.id===d.syringeId);return pd?getSyringeComponents(pd).length:"?";})()} compounds · View details ›</button>`:""}</div><button class="nx-history-reaction" type="button" data-name="${esc(name)}" data-id="${d.id}" aria-label="Record reaction for ${esc(name)} dose" style="min-height:44px;min-width:44px;color:var(--t2);font-size:11px;font-weight:650;border:1px solid var(--border);border-radius:8px;padding:8px">Reaction${(d.reactions||[]).length?` (${d.reactions.length})`:""}</button><button class="editdose" data-name="${esc(name)}" data-id="${d.id}" style="color:var(--t4);font-size:11px;border:1px solid var(--border);border-radius:5px;padding:2px 7px;flex-shrink:0;min-width:38px;text-align:center">Edit</button><button class="deldose" data-name="${esc(name)}" data-id="${d.id}" style="color:var(--t5);font-size:13px;flex-shrink:0">✕</button></div>`).join("")}
      ${doses.length>5?`<button class="nx-dose-history-more" type="button" aria-expanded="false" data-count="${doses.length}">Show all ${doses.length} doses</button>`:""}
    </div>
    
  </div>`;
}

function siteTrackerSection(name, doses) {
  if(!doses.length) return `<div style="color:var(--t4);font-size:12px;text-align:center;padding:12px 0">No doses logged yet.</div>`;
  const c=cfg(name);
  const counts={};
  doses.forEach(d=>{ if(d.site){counts[d.site]=(counts[d.site]||0)+1;} });
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!entries.length) return `<div style="color:var(--t4);font-size:12px;padding:8px 0">No injection sites recorded. Add a site when logging doses.</div>`;
  const max=entries[0][1];
  return entries.map(([site,n])=>`<div style="margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:12px;color:var(--t2)">${esc(site)}</span><span style="font-size:11px;color:${c.color}">${n}×</span></div>
    <div style="height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden"><div style="height:100%;width:${Math.round(n/max*100)}%;background:${c.color};border-radius:3px;${n===max?"opacity:1":"opacity:0.5"}"></div></div>
  </div>`).join("")+`<div style="font-size:10px;color:var(--t4);margin-top:8px;line-height:1.4">Brighter bars = most-used. Rotate to avoid lipohypertrophy — any single site used >${Math.floor(doses.length*0.3)+1} times is worth cycling off for a week.</div>`;
}

function sideEffectsSection(name, doses) {
  const tf = state._symptomTF || "1m";
  const TF_DAYS={"2w":14,"1m":30,"3m":90,"all":null};
  const cutoff = TF_DAYS[tf] ? Date.now()-TF_DAYS[tf]*86400000 : 0;
  const tagged = state.dailyLogs.filter(l=>l.compound===name && new Date(l.date).getTime()>=cutoff);
  const dosesInRange = doses.filter(d=>new Date(d.date).getTime()>=cutoff);
  const fromDoses = dosesInRange.flatMap(d=>(d.symptoms||[]).map(s=>({...((typeof s==="string")?{name:s}:s), date:d.date})));
  const allSyms = [...tagged.flatMap(l=>(l.symptoms||[]).map(s=>({...((typeof s==="string")?{name:s}:s), date:l.date}))), ...fromDoses];
  const tfBtn=(k,label)=>`<button class="symtf" data-tf="${k}" style="flex:1;padding:6px 0;border-radius:8px;font-size:11px;font-weight:600;background:${tf===k?"var(--surface-3)":"transparent"};color:${tf===k?"var(--t1)":"var(--t4)"};border:none">${label}</button>`;
  const tfBar=`<div style="display:flex;gap:4px;background:var(--surface-3);border-radius:10px;padding:3px;margin-bottom:14px">${tfBtn("2w","2w")}${tfBtn("1m","1m")}${tfBtn("3m","3m")}${tfBtn("all","All")}</div>`;
  if(!allSyms.length) return tfBar+`<div style="color:var(--t4);font-size:12px;padding:8px 0">No symptoms logged in this window.</div>`;

  const totalLogs = new Set([...tagged.map(l=>dayKey(l.date)), ...dosesInRange.map(d=>dayKey(d.date))]).size || 1;
  const counts={};
  allSyms.forEach(s=>{ counts[s.name]=(counts[s.name]||0)+1; });
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const c=cfg(name); const max=entries[0][1];

  // Category lookup
  const symCategory = sym => {
    const custom = (state.settings.customSymptoms||[]).find(c=>c.name===sym);
    if(custom) return custom.category||"Other";
    return Object.entries(SYMPTOM_GROUPS).find(([,list])=>list.includes(sym))?.[0] || "Other";
  };

  // Dose-timing clustering: for each symptom, find avg days-since-last-dose when it occurred
  const sortedDoses=[...doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const daysSinceDoseFor = date => {
    const t=new Date(date).getTime();
    let best=null;
    sortedDoses.forEach(d=>{ const dt=(t-new Date(d.date).getTime())/86400000; if(dt>=0 && (best===null||dt<best)) best=dt; });
    return best;
  };
  const timingLabel = sym => {
    const occ = allSyms.filter(s=>s.name===sym).map(s=>daysSinceDoseFor(s.date)).filter(v=>v!=null);
    if(occ.length<2) return "";
    const avg = occ.reduce((a,b)=>a+b,0)/occ.length;
    const window = avg<=2?"0–2 days after dose":avg<=5?"3–5 days after dose":"6–7 days after dose";
    return `Most common ${window}`;
  };

  // Phase correlation: which phase did each symptom most often occur in
  const phaseLabel = sym => {
    if(!c.phases) return "";
    const occ = allSyms.filter(s=>s.name===sym).map(s=>{
      const dd=daysSinceDoseFor(s.date); if(dd==null) return null;
      const ph=currentPhase(c.phases,dd); return ph?ph.label:null;
    }).filter(Boolean);
    if(occ.length<2) return "";
    const tally={}; occ.forEach(p=>tally[p]=(tally[p]||0)+1);
    const [topPhase,topN]=Object.entries(tally).sort((a,b)=>b[1]-a[1])[0];
    const pct=Math.round(topN/occ.length*100);
    return pct>=60 ? `${pct}% during ${topPhase}` : `Often during ${topPhase}`;
  };

  // Trend: compare last 14d vs prior 14d for top symptoms
  const trendFor = sym => {
    const now=Date.now();
    const recent=allSyms.filter(s=>s.name===sym && (now-new Date(s.date).getTime())<=14*86400000).length;
    const prior=allSyms.filter(s=>s.name===sym && (now-new Date(s.date).getTime())>14*86400000 && (now-new Date(s.date).getTime())<=28*86400000).length;
    if(prior<2) return null; // not enough baseline data
    const change=Math.round((recent-prior)/prior*100);
    if(Math.abs(change)<25) return {dir:"stable",text:`${esc(sym)} has remained stable.`};
    return change<0
      ? {dir:"down",text:`${esc(sym)} decreased ${Math.abs(change)}% vs. the prior 2 weeks.`}
      : {dir:"up",text:`${esc(sym)} increased ${change}% vs. the prior 2 weeks.`};
  };
  const bars = entries.map(([sym,n])=>{
    const pct = Math.round(n/totalLogs*100);
    const timing = "";
    const phaseInfo = "";
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;margin-bottom:3px">
        <span style="font-size:12px;color:var(--t2)">${esc(sym)}</span>
        <span style="font-size:10px;color:var(--t4)">${n}d · ${pct}% of logs</span>
      </div>
      <div style="height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden"><div style="height:100%;width:${Math.round(n/max*100)}%;background:${c.color};opacity:0.75;border-radius:3px"></div></div>
      ${timing||phaseInfo?`<div style="font-size:10px;color:var(--t5);margin-top:2px">${[timing,phaseInfo].filter(Boolean).join(" · ")}</div>`:""}
    </div>`;
  }).join("");

  // Category grouping
  const byCat={};
  entries.forEach(([sym,n])=>{ const cat=symCategory(sym); (byCat[cat]=byCat[cat]||[]).push(sym); });
  const catLine = Object.entries(byCat).map(([cat,syms])=>`<span style="font-size:10px;color:var(--t4)">${cat}: ${syms.length}</span>`).join("  ·  ");

  // Recent-trend insight: compare last 7 days vs prior period for top symptom
  // Build a stack of natural-language insights, only when confidence is reasonable
  const insights=[];
  if(entries.length){
    const topSym=entries[0][0];
    const last7=allSyms.filter(s=>s.name===topSym && (Date.now()-new Date(s.date).getTime())<=7*86400000).length;
    const last7Logs=new Set([...tagged,...dosesInRange].filter(l=>(Date.now()-new Date(l.date).getTime())<=7*86400000).map(l=>dayKey(l.date))).size||1;
    if(last7>=2) insights.push(`<b style="color:${c.color}">${esc(topSym)}</b> appeared in ${last7} of your last ${last7Logs} logs.`);

    // Trend for top symptom
    const t=trendFor(topSym);
    if(t) insights.push(t.text);

    // Timing observation for top symptom
    const occ=allSyms.filter(s=>s.name===topSym).map(s=>daysSinceDoseFor(s.date)).filter(v=>v!=null);
    if(occ.length>=3){
      const avg=occ.reduce((a,b)=>a+b,0)/occ.length;
      if(avg<=2) insights.push(`${esc(topSym)} is most common within 48 hours after injection.`);
      else if(avg>=5) insights.push(`${esc(topSym)} typically returns around Day ${Math.round(avg)}.`);
    }

    // Persistent symptom flag (appears in >50% of logs across whole window)
    if(Math.round(entries[0][1]/totalLogs*100)>=50) insights.push(`<b style="color:${c.color}">${esc(topSym)}</b> appears to be your most persistent symptom.`);

    // Quiet period observation
    const lateOcc=allSyms.map(s=>daysSinceDoseFor(s.date)).filter(v=>v!=null && v>=4).length;
    const totalOcc=allSyms.filter(s=>daysSinceDoseFor(s.date)!=null).length;
    if(totalOcc>=5 && lateOcc/totalOcc<0.15) insights.push(`You rarely report symptoms after Day 4.`);
  }

  return tfBar
    + `<div class="nx-sym-observed">Observed symptom reports in this window. ${totalLogs} distinct dated log day${totalLogs===1?"":"s"} with dose or check-in records; counts may include multiple reports on one day. These are not incidence rates or evidence of causation.</div>`
    + bars
    + (catLine?`<div style="margin-top:4px;padding-top:8px;border-top:1px solid var(--surface-2)">${catLine}</div>`:"")

    + `<div style="font-size:10px;color:var(--t4);margin-top:8px">From dose logs + check-ins tagged to ${esc(name)}.</div>`;
}

function doseRetrospectiveModal(name, doseId) {
  const c = cfg(name);
  const p = allPeptides()[name]; if(!p) return;
  const sorted = [...p.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const idx = sorted.findIndex(d=>String(d.id)===String(doseId));
  const dose = sorted[idx]; if(!dose) return;
  const cycleStart = new Date(dose.date).getTime();
  const cycleEnd = sorted[idx+1] ? new Date(sorted[idx+1].date).getTime() : cycleStart + (p.scheduleDays||7)*86400000;

  // Symptoms during this cycle
  const cycleLogs = state.dailyLogs.filter(l=>{const t=new Date(l.date).getTime();return t>=cycleStart&&t<cycleEnd;});
  const cycleSyms = [...cycleLogs.flatMap(l=>(l.symptoms||[]).map(s=>typeof s==="string"?s:s.name)), ...(dose.symptoms||[]).map(s=>typeof s==="string"?s:s.name)];

  // Food noise / appetite return timing — first day a hunger/food-noise symptom appears after dose
  const hungerLog = cycleLogs.filter(l=>(l.symptoms||[]).some(s=>/hunger|food noise|appetite/i.test(typeof s==="string"?s:s.name))).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
  const returnDay = hungerLog ? Math.round((new Date(hungerLog.date)-cycleStart)/86400000) : null;

  // Weight change during cycle
  const wSorted=[...state.weightLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const wBefore=[...wSorted].reverse().find(w=>new Date(w.date).getTime()<=cycleStart);
  const wAfter=[...wSorted].reverse().find(w=>new Date(w.date).getTime()<=cycleEnd && new Date(w.date).getTime()>=cycleStart-2*86400000);
  const weightDelta = wBefore&&wAfter&&wAfter!==wBefore ? parseFloat(wAfter.weight)-parseFloat(wBefore.weight) : null;

  // Mood trend during cycle
  const moodVals=cycleLogs.filter(l=>l.mood!=null).map(l=>l.mood);
  const avgMood = moodVals.length ? moodVals.reduce((a,b)=>a+b,0)/moodVals.length : null;

  // ── Compute averages across ALL other cycles for comparison ──
  const allCycles = sorted.map((d,i)=>{
    const s=new Date(d.date).getTime(); const e=sorted[i+1]?new Date(sorted[i+1].date).getTime():s+(p.scheduleDays||7)*86400000;
    const logs=state.dailyLogs.filter(l=>{const t=new Date(l.date).getTime();return t>=s&&t<e;});
    const syms=[...logs.flatMap(l=>(l.symptoms||[]).map(x=>typeof x==="string"?x:x.name)),...(d.symptoms||[]).map(x=>typeof x==="string"?x:x.name)];
    const hLog=logs.filter(l=>(l.symptoms||[]).some(x=>/hunger|food noise|appetite/i.test(typeof x==="string"?x:x.name))).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
    const rDay = hLog ? Math.round((new Date(hLog.date)-s)/86400000) : null;
    const wB=[...wSorted].reverse().find(w=>new Date(w.date).getTime()<=s);
    const wA=[...wSorted].reverse().find(w=>new Date(w.date).getTime()<=e && new Date(w.date).getTime()>=s-2*86400000);
    const wd = wB&&wA&&wA!==wB ? parseFloat(wA.weight)-parseFloat(wB.weight) : null;
    return {symCount:syms.length, returnDay:rDay, weightDelta:wd};
  });
  const otherCycles = allCycles.filter((_,i)=>i!==idx);
  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
  const avgSymCount = avg(otherCycles.map(x=>x.symCount));
  const avgReturnDay = avg(otherCycles.filter(x=>x.returnDay!=null).map(x=>x.returnDay));
  const avgWeightDelta = avg(otherCycles.filter(x=>x.weightDelta!=null).map(x=>x.weightDelta));

  const comparisons = [];
  if(avgSymCount!=null && otherCycles.length>=2){
    if(cycleSyms.length<avgSymCount*0.7) comparisons.push("✓ Fewer symptoms than your average cycle");
    else if(cycleSyms.length>avgSymCount*1.3) comparisons.push("⚠ More symptoms than your average cycle");
  }
  if(returnDay!=null && avgReturnDay!=null && otherCycles.filter(x=>x.returnDay!=null).length>=2){
    if(returnDay>avgReturnDay+1) comparisons.push("✓ Later food noise return than usual");
    else if(returnDay<avgReturnDay-1) comparisons.push("⚠ Earlier food noise return than usual");
  }
  if(weightDelta!=null && avgWeightDelta!=null && otherCycles.filter(x=>x.weightDelta!=null).length>=2){
    if(weightDelta<avgWeightDelta-0.3) comparisons.push("✓ Faster weight loss than your average cycle");
    else if(weightDelta>avgWeightDelta+0.3) comparisons.push("⚠ Slower weight loss than your average cycle");
  }

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:12px;color:${c.color};letter-spacing:1px">DOSE RETROSPECTIVE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="background:${c.color}10;border:1px solid ${c.color}33;border-radius:12px;padding:14px;margin-bottom:16px">
      <div style="font-size:16px;font-weight:700;color:var(--t1)">${esc(name)} ${dose.dose?esc(dose.dose)+" "+c.unit:""}</div>
      <div style="font-size:12px;color:var(--t4);margin-top:2px">${fmtDT(dose.date)}${dose.site?" · "+esc(dose.site):""}</div>
    </div>

    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">WHAT HAPPENED AFTER</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--surface-2)"><span style="font-size:12px;color:var(--t3)">Symptoms reported</span><span style="font-size:12px;color:var(--t1);font-weight:600">${cycleSyms.length ? [...new Set(cycleSyms)].join(", ") : "None logged"}</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--surface-2)"><span style="font-size:12px;color:var(--t3)">Food noise return</span><span style="font-size:12px;color:var(--t1);font-weight:600">${returnDay!=null?`Day ${returnDay}`:"Not logged"}</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--surface-2)"><span style="font-size:12px;color:var(--t3)">Weight change</span><span style="font-size:12px;color:var(--t1);font-weight:600">${weightDelta!=null?(weightDelta<0?"":"+")+weightDelta.toFixed(1)+" "+(state.settings.weightUnit||"lbs"):"Not enough data"}</span></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0"><span style="font-size:12px;color:var(--t3)">Mood trend</span><span style="font-size:12px;color:var(--t1);font-weight:600">${avgMood!=null?avgMood.toFixed(1)+"/5":"Not logged"}</span></div>
    </div>

    ${comparisons.length ? `<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">COMPARED TO YOUR AVERAGE</div>
    <div style="display:flex;flex-direction:column;gap:6px">${comparisons.map(t=>`<div style="font-size:12px;color:${t.startsWith("✓")?"#7DF9C0":"#F9C87D"};padding:6px 10px;background:${t.startsWith("✓")?"#7DF9C010":"#F9C87D10"};border-radius:8px">${esc(t)}</div>`).join("")}</div>`
    : `<div style="font-size:11px;color:var(--t5);text-align:center;padding:10px 0">Not enough cycle history yet to compare this dose to your average.</div>`}
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  const action=document.createElement("button");
  action.type="button";action.className="nx-reaction-link";action.textContent="Record reaction"+(dose.reactions?.length?" ("+dose.reactions.length+")":"");
  action.onclick=()=>nexusDoseReactionModal(name,dose.id);
  m.appendChild(action);
}

function phaseDetailModal(phase) {
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      ${statusBadge(phase.shortLabel||phase.label, phase.color)}
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:13px;color:var(--t3);line-height:1.6;margin-bottom:16px">${esc(phase.happening||phase.desc)}</div>
    ${phase.sideEffects&&phase.sideEffects.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">POSSIBLE SIDE EFFECTS</div>
    <div style="margin-bottom:16px">${phase.sideEffects.map(s=>`<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--surface-2)"><div style="width:5px;height:5px;border-radius:50%;background:${phase.color};flex-shrink:0;margin-top:5px"></div><span style="font-size:12px;color:var(--t2)">${esc(s)}</span></div>`).join("")}</div>`:""}
    ${phase.watchFor&&phase.watchFor.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">WHAT TO WATCH FOR</div>
    <div>${phase.watchFor.map(s=>`<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--surface-2)"><div style="width:5px;height:5px;border-radius:50%;background:#F9C87D;flex-shrink:0;margin-top:5px"></div><span style="font-size:12px;color:var(--t2)">${esc(s)}</span></div>`).join("")}</div>`:""}
  `, phase.color);
  m.querySelector("#x").onclick = closeModal;
}

function pkMethodologyModal() {
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#8AB4FF;letter-spacing:1.5px">HOW LEVELS ARE ESTIMATED</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:13px;color:var(--t3);line-height:1.6;margin-bottom:16px">This chart models estimated plasma concentration using a one-compartment pharmacokinetic model (the Bateman equation), parameterised with values from published clinical trials.</div>
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">THE MODEL</div>
    <div style="background:var(--bg-deep);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:14px;font-size:12px;color:#8AB4FF;font-family:'DM Mono',monospace;line-height:1.6">C(t) = (ka/(ka−ke)) × (e^−ke·t − e^−ka·t)<br><span style="color:var(--t4)">Where: ke = ln(2)/t½ &nbsp; ka = absorption constant &nbsp; t = days since dose</span></div>
    <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:16px">The chart estimates active medication amount using your logged doses, schedule, and the compound's half-life. Each logged dose contributes to the total — this is why levels rise during the first 4–6 weeks until accumulation levels off.</div>
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">SOURCE STUDIES</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
      <a href="https://www.nejm.org/doi/full/10.1056/NEJMoa2301972" target="_blank" style="display:flex;align-items:flex-start;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px;text-decoration:none">
        <span style="font-size:16px">📄</span>
        <div><div style="font-size:12px;color:#8AB4FF;margin-bottom:2px">Jastreboff et al. — NEJM 2023</div><div style="font-size:11px;color:var(--t4)">Triple–Hormone-Receptor Agonist Retatrutide for Obesity (Phase 2 trial). Primary source for retatrutide half-life and PK parameters.</div></div>
      </a>
      <a href="https://www.nejm.org/doi/full/10.1056/NEJMoa2206038" target="_blank" style="display:flex;align-items:flex-start;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px;text-decoration:none">
        <span style="font-size:16px">📄</span>
        <div><div style="font-size:12px;color:#8AB4FF;margin-bottom:2px">Jastreboff et al. — NEJM 2022</div><div style="font-size:11px;color:var(--t4)">Tirzepatide Once Weekly for the Treatment of Obesity. PK context for dual/triple agonist class.</div></div>
      </a>
      <a href="https://pubmed.ncbi.nlm.nih.gov/37870976/" target="_blank" style="display:flex;align-items:flex-start;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px;text-decoration:none">
        <span style="font-size:16px">📄</span>
        <div><div style="font-size:12px;color:#8AB4FF;margin-bottom:2px">Rosenstock et al. — Lancet 2023</div><div style="font-size:11px;color:var(--t4)">Retatrutide Phase 2b for type 2 diabetes. Dose-response and PK/PD characterisation.</div></div>
      </a>
    </div>
    <div style="font-size:11px;color:var(--t5);line-height:1.5">⚠ This is an educational estimate derived from population PK parameters. Individual pharmacokinetics vary. This is not a clinical measurement — use it for orientation, not dosing decisions.</div>
  `, "#8AB4FF");
  m.querySelector("#x").onclick = closeModal;
}

function pkCurveFull(name, data) {
  const c = cfg(name);
  if (!c.phases || !c.halfLifeDays || !(data.doses||[]).length) return "";
  const doses = (data.doses||[]).filter(d=>d.date);
  const lastDose = [...doses].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  if (!lastDose) return "";
  const daysSinceLast = (Date.now() - new Date(lastDose.date).getTime()) / 86400000;
  const phase = currentPhase(c.phases, daysSinceLast);
  const origin = new Date(lastDose.date).getTime() - 86400000;
  const W=480, H=130, pad=28;
  const totalDays = 11;
  const px = frac => pad + frac * (W-pad*2);
  const py = v => pad + (1-Math.min(1.3,v)/1.3) * (H-pad*1.8);
  const nowFrac = (Date.now()-origin) / (totalDays*86400000);
  const STEPS=120;
  const pts=[...Array(STEPS+1)].map((_,i)=>{ const t=origin+(i/STEPS)*totalDays*86400000; const v=pkLevelAt(doses,c.halfLifeDays,t); return [px(i/STEPS),py(v)]; });
  const pathD=pts.map(([x,y],i)=>`${i?"L":"M"} ${x} ${y}`).join(" ");
  // Y-axis gridlines
  const gridLines=[0.25,0.5,0.75,1.0].map(v=>{const y=py(v);return `<line x1="${pad}" y1="${y}" x2="${W-pad}" y2="${y}" stroke="#ffffff" stroke-width="0.5" opacity="0.06"/><text x="${pad-3}" y="${y+3}" fill="#555" font-size="8" font-family="monospace" text-anchor="end">${Math.round(v*100)}%</text>`;}).join("");
  const phaseBands=c.phases.map(p=>{ const x1=px(Math.max(0,(p.range[0]+1)/totalDays)); const x2=px(Math.min(1,(Math.min(p.range[1],totalDays-1)+1)/totalDays)); if(x2<=x1) return ""; return `<rect x="${x1}" y="${pad}" width="${x2-x1}" height="${H-pad*1.8}" fill="${p.color}" opacity="0.06"/>`; }).join("");
  const doseMarkers=doses.slice(-10).map(d=>{ const frac=(new Date(d.date).getTime()-origin)/(totalDays*86400000); if(frac<0||frac>1) return ""; const x=px(frac); const dose=doseToMg(d.dose,data.unit||cfg(name)?.unit||"mg"); const doseLabel=c.unit==="mcg"?(dose*1000).toFixed(0)+"mcg":dose.toFixed(2)+"mg"; return `<circle cx="${x}" cy="${H-pad*0.8}" r="3.5" fill="${c.color}" opacity="0.9"/><text x="${x}" y="${H-pad*0.8-7}" fill="${c.color}" font-size="8" font-family="monospace" text-anchor="middle" opacity="0.8">${doseLabel}</text>`; }).join("");
  const nowInRange=nowFrac>=0&&nowFrac<=1;
  const nowX=Math.min(W-pad,Math.max(pad,px(nowFrac)));
  const nowLevel=pkLevelAt(doses,c.halfLifeDays,Date.now());
  const pctLevel=Math.round(Math.min(150,nowLevel*100));
  return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;flex:1">PLASMA ACTIVITY</div>
    <button class="pkinfo" style="background:#8AB4FF18;border:1px solid #8AB4FF44;color:#8AB4FF;border-radius:5px;padding:2px 7px;font-size:9px;white-space:nowrap">ℹ How calculated</button>
  </div>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
    <span style="background:${phase.color}22;color:${phase.color};border:1px solid ${phase.color}55;border-radius:6px;padding:3px 9px;font-size:10px;font-weight:600;white-space:nowrap">${phase.shortLabel||phase.label}</span>
    <span style="font-size:11px;color:var(--t4)">~${pctLevel}% of steady-state peak</span>
    <button class="phaseinfo" data-phaseid="${phase.id}" data-compound="${name}" style="background:${phase.color}18;border:1px solid ${phase.color}44;color:${phase.color};border-radius:5px;padding:3px 8px;font-size:9px;white-space:nowrap;margin-left:auto">ℹ What this means</button>
  </div>
  <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;margin-bottom:12px;display:block">
    ${gridLines}
    ${phaseBands}
    <path d="${pathD} L ${pts[pts.length-1][0]} ${H-pad*0.8} L ${pts[0][0]} ${H-pad*0.8} Z" fill="url(#pk-grad-${name})" opacity="1"/>
    <defs><linearGradient id="pk-grad-${name}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c.color}" stop-opacity="0.35"/><stop offset="100%" stop-color="${c.color}" stop-opacity="0.02"/></linearGradient></defs>
    <path d="${pathD}" fill="none" stroke="${c.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${doseMarkers}
    ${nowInRange?`<line x1="${nowX}" y1="${pad}" x2="${nowX}" y2="${H-pad*0.8}" stroke="#fff" stroke-width="1" stroke-dasharray="3,3" opacity="0.3"/>
    <circle cx="${nowX}" cy="${py(nowLevel)}" r="5" fill="${c.color}" opacity="1"/>
    <circle cx="${nowX}" cy="${py(nowLevel)}" r="2.5" fill="#fff" opacity="0.9"/>
    <text x="${nowX+7}" y="${pad+10}" fill="#aaa" font-size="9" font-family="monospace">now</text>`:""}
    <text x="${pad}" y="${H-6}" fill="#444" font-size="8" font-family="monospace">-1d</text>
    <text x="${W/2-6}" y="${H-6}" fill="#444" font-size="8" font-family="monospace">+${Math.floor(totalDays/2)}d</text>
    <text x="${W-pad-12}" y="${H-6}" fill="#444" font-size="8" font-family="monospace">+${totalDays-1}d</text>
  </svg>
  <div style="background:${phase.color}11;border:1px solid ${phase.color}33;border-radius:10px;padding:12px 14px;margin-bottom:10px">
    <div style="font-size:13px;font-weight:600;color:${phase.color};margin-bottom:4px">${phase.label} — What's happening now</div>
    <div style="font-size:12px;color:var(--t3);line-height:1.55;margin-bottom:8px">${esc(phase.happening||phase.desc)}</div>
    ${phase.sideEffects&&phase.sideEffects.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:5px">POSSIBLE NOW</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">${phase.sideEffects.slice(0,5).map(s=>`<span class="pill" style="background:rgba(255,255,255,.05);color:var(--t3);border:1px solid var(--border);font-size:10px">${esc(s)}</span>`).join("")}</div>`:""}
    ${phase.watchFor&&phase.watchFor.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:5px">WATCH FOR</div>
    <div style="font-size:11px;color:var(--t3);line-height:1.5">${phase.watchFor.slice(0,2).map(s=>`→ ${esc(s)}`).join("<br>")}</div>`:""}
  </div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">${c.phases.map(p=>`<button class="phaseinfo" data-phaseid="${p.id}" data-compound="${name}" style="padding:4px 9px;border-radius:6px;font-size:10px;background:${p===phase?p.color+"22":"transparent"};border:1px solid ${p===phase?p.color+"55":"#222"};color:${p===phase?p.color:"#555"}">${p.label}</button>`).join("")}</div>`;
}

// ─── Day detail sheet ────────────────────────────────────────────────────────
function dayDetailModal(dateIso) {
  const aps=allPeptides();
  const k=dayKey(dateIso);
  const today=localDate();
  const dayLog=state.dailyLogs.find(l=>dayKey(l.date)===k);
  const dayWeight=state.weightLogs.find(w=>dayKey(w.date)===k);
  const dayMacro=state.macroLogs.find(m=>dayKey(m.date)===k);
  const daySupp=(state.supplementLogs||[]).find(s=>dayKey(s.date)===k);
  const mood=dayLog?MOODS.find(m=>m.v===dayLog.mood):null;
  const label=new Date(dateIso).toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric",year:"numeric"});

  // Dose-instance breakdown for this day — same canonical getDayOccurrences() used
  // everywhere else, so this detail view can never disagree with what Today/Upcoming/
  // the week strip already said about this date. Multi-dose compounds correctly show
  // each occurrence (AM/PM) as its own line, with its own status and compound color.
  const label12 = t=>{const [h,m]=t.split(":").map(Number); const ap=h>=12?"PM":"AM"; const h12=h%12||12; return `${h12}:${String(m).padStart(2,"0")} ${ap}`;};
  const instances=[];
  Object.entries(aps).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active").forEach(([n,d])=>{
    getDayOccurrences(d,k).forEach(s=>instances.push({ pep:n, color:cfg(n).color, unit:cfg(n).unit, multi:(d.dosesPerDay||1)>1 || getDayOccurrences(d,k).length>1, ...s }));
  });
  instances.sort((a,b)=>cmpSlotTime(a.time,b.time));
  // Paused instances stay visible in the list (this popup is about what actually happened
  // that day, and "this was paused" is real information) but don't count toward the
  // fraction — they carried no obligation, so they're neither part of what was expected
  // nor what was completed.
  const gradableI = instances.filter(s=>s.status!=="paused");
  const totalI=gradableI.length, completedI=gradableI.filter(s=>s.status==="taken").length;

  // Actual recorded doses are separate from planned occurrences. This also surfaces
  // off-schedule historical logs and preserves their original record identifiers.
  const recordedDoses=Object.entries(aps).flatMap(([name,data])=>(data.doses||[])
    .filter(d=>dayKey(d.date)===k)
    .map(d=>({name,dose:d,color:cfg(name).color,unit:d.unit||cfg(name).unit})))
    .sort((a,b)=>new Date(a.dose.date)-new Date(b.dose.date));
  const loggedDoseRows=recordedDoses.length?`<section class="cal-actual-logs" aria-label="Recorded dose logs" style="margin:16px 0 10px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px">
      <span class="mono" style="font-size:10px;letter-spacing:1px;color:var(--t3)">LOGGED DOSES</span>
      <span style="font-size:11px;color:var(--t4)">${recordedDoses.length} recorded</span>
    </div>
    ${recordedDoses.map(({name,dose,color,unit})=>`<button type="button" class="cal-edit-recorded-dose" data-name="${esc(name)}" data-id="${dose.id}" aria-label="View or edit recorded dose for ${esc(name)}" style="width:100%;display:flex;align-items:center;gap:10px;text-align:left;padding:12px 8px;border:0;border-bottom:1px solid var(--border-sub);background:transparent;color:var(--t2);min-height:54px">
      <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></span>
      <span style="flex:1;min-width:0"><strong style="display:block;font-size:13px;font-weight:600">${esc(name)}</strong><span style="display:block;font-size:11px;color:var(--t4);margin-top:3px">${esc(String(dose.dose??'—'))} ${esc(unit)} · ${label12(timeKeyOf(dose.date))}</span></span>
      <span style="font-size:11px;color:var(--t3)">View / edit ›</span>
    </button><button type="button" class="cal-record-reaction" data-name="${esc(name)}" data-id="${dose.id}" aria-label="Record reaction for ${esc(name)} at ${label12(timeKeyOf(dose.date))}" style="min-height:44px;width:100%;border:1px solid var(--border-sub);border-radius:10px;background:var(--surface-2);color:var(--t1);font-size:12px;font-weight:650;margin:4px 0 12px">Record reaction${dose.reactions?.length?` (${dose.reactions.length})`:""}</button>`).join("")}
  </section>`:`<div style="margin:14px 0;font-size:12px;color:var(--t4)">No doses recorded for this date.</div>`;

  const m=openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><span class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px">${label.toUpperCase()}</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
    ${totalI?`<div style="margin:12px 0 8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px">DOSES</span>
        <span class="mono" style="font-size:11px;font-weight:700;color:${completedI===totalI?"#7DF9C0":"var(--t3)"}">${completedI}/${totalI}</span>
      </div>
      ${instances.map(s=>{
        const label = s.multi ? `${esc(s.pep)} ${s.index===0?"AM":s.index===instances.filter(x=>x.pep===s.pep).length-1?"PM":"#"+(s.index+1)}` : esc(s.pep);
        const symbol = s.status==="taken"?"✓":s.status==="skipped"?"⊘":s.status==="moved"?"↺":s.status==="missed"?"✗":s.status==="overdue"?"✗":s.status==="paused"?"⏸":"○";
        const symColor = s.status==="taken"?"#7DF9C0":s.status==="skipped"?"var(--t5)":s.status==="moved"?"#A78BFA":s.status==="missed"?"var(--t5)":s.status==="overdue"?"#FF7C7C":s.status==="paused"?"var(--t5)":"var(--t4)";
        const detail = s.status==="taken" ? `Taken ${label12(timeKeyOf(s.dose.date))}${s.dose.dose?" · "+esc(s.dose.dose)+" "+s.unit:""}`
          : s.status==="skipped" ? "Skipped"
          : s.status==="moved" ? "Moved to another day"
          : s.status==="missed" ? "Missed"
          : s.status==="overdue" ? `Overdue · was due ${label12(s.time)}`
          : s.status==="paused" ? "Protocol paused"
          : `Due ${label12(s.time)}`;
        return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--surface-2)">
          <span style="color:${symColor};font-size:12px;flex-shrink:0;width:14px">${symbol}</span>
          <div style="width:6px;height:6px;border-radius:50%;background:${s.color};flex-shrink:0"></div>
          <span style="font-size:13px;color:var(--t2);flex:1;min-width:0">${label}</span>
          <span style="font-size:11px;color:${symColor}">${detail}</span>
        </div>`;
      }).join("")}
    </div>`:""}
    ${loggedDoseRows}
    ${mood?`<div style="display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid var(--surface-2)"><span style="font-size:24px">${mood.emoji}</span><div><div style="font-size:13px;color:var(--t2)">${mood.label}</div>${dayLog.compound?`<div style="font-size:11px;color:var(--t4)">re: ${esc(dayLog.compound)}</div>`:""}</div></div>`:""}
    ${dayLog&&dayLog.symptoms&&dayLog.symptoms.length?`<div style="padding:10px 0;border-bottom:1px solid var(--surface-2)"><div style="display:flex;gap:5px;flex-wrap:wrap">${dayLog.symptoms.map(s=>`<span class="pill" style="background:rgba(255,255,255,.05);color:var(--t3);border:1px solid #2e2e2e">${esc(typeof s==="string"?s:s.name+" "+"•".repeat(s.intensity||1))}</span>`).join("")}</div></div>`:""}
    ${dayLog&&dayLog.notes?`<div style="padding:8px 0;border-bottom:1px solid var(--surface-2);font-size:12px;color:var(--t3);font-style:italic">${esc(dayLog.notes)}</div>`:""}
    ${dayWeight?`<div style="padding:8px 0;border-bottom:1px solid var(--surface-2);font-size:12px;color:#8AB4FF">⚖ ${dayWeight.weight} ${state.settings.weightUnit}</div>`:""}
    ${dayMacro?`<div style="padding:8px 0;border-bottom:1px solid var(--surface-2);font-size:12px;color:#F9C87D">🍽 ${dayMacro.calories||"—"} kcal · P: ${dayMacro.protein||"—"}g · C: ${dayMacro.carbs||"—"}g · F: ${dayMacro.fat||"—"}g</div>`:""}
    ${daySupp?.taken?.length?`<div style="padding:8px 0;border-bottom:1px solid var(--surface-2);font-size:12px;color:#C8FF9C">💊 ${daySupp.taken.map(s=>esc(s)).join(" · ")}</div>`:""}
    <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
      ${!dayLog?`<button id="addlog" style="flex:1;padding:10px;border-radius:10px;background:#7DF9C018;border:1px solid #7DF9C044;color:#7DF9C0;font-size:12px;font-weight:600">＋ Check-in</button>`:`<button class="editdaily" data-id="${dayLog.id}" style="flex:1;padding:10px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t3);font-size:12px">Edit check-in</button>`}
      ${!dayWeight?`<button id="addweight" style="flex:1;padding:10px;border-radius:10px;background:#8AB4FF18;border:1px solid #8AB4FF44;color:#8AB4FF;font-size:12px;font-weight:600">⚖ Weight</button>`:""}
      ${!dayMacro?`<button id="addmacro" style="flex:1;padding:10px;border-radius:10px;background:#F9C87D18;border:1px solid #F9C87D44;color:#F9C87D;font-size:12px;font-weight:600">🍽 Macros</button>`:""}
      <button id="addsupp" style="flex:1;padding:10px;border-radius:10px;background:#C8FF9C18;border:1px solid #C8FF9C44;color:#C8FF9C;font-size:12px;font-weight:600">💊 ${daySupp?"Edit":"Add"} Supps</button>
    </div>
  `,"#7DF9C0");
  m.querySelector("#x").onclick=closeModal;
  m.querySelectorAll(".cal-record-reaction").forEach(b=>b.onclick=()=>{
    const name=b.dataset.name, id=b.dataset.id;
    if(!(allPeptides()[name]?.doses||[]).some(d=>String(d.id)===String(id))){
      showErrorBanner("This saved dose could not be found. No reaction was recorded.");return;
    }
    nexusDoseReactionModal(name,id);
  });
  const al=m.querySelector("#addlog"); if(al)al.onclick=()=>{closeModal();dailyModal(null,dateIso);};
  const aw=m.querySelector("#addweight"); if(aw)aw.onclick=()=>{closeModal();weightModal();};
  const am=m.querySelector("#addmacro"); if(am)am.onclick=()=>{closeModal();macroModal(dateIso);};
  const asupp=m.querySelector("#addsupp"); if(asupp)asupp.onclick=()=>{closeModal();supplementModal(k);};
  m.querySelectorAll(".editdaily").forEach(b=>b.onclick=()=>{closeModal();dailyModal(state.dailyLogs.find(l=>l.id===+b.dataset.id));});
}

function weeklyView() {
  const sub = state._calSub || "week";
  const subBtn = (id,l) => `<button id="cs-${id}" class="${sub===id?"on":""}">${l}</button>`;
  let html = `<h1 class="serif greet">Calendar</h1>
  <div class="seg" style="margin:14px 0 18px">${subBtn("week","Week")}${subBtn("month","Month")}${subBtn("logs","Logs")}</div>`;
  if (sub==="month") return html + monthView();
  if (sub==="logs")  return html + logsView();
  // ── Week ──────────────────────────────────────────────────────────────────
  const off = state._weekOff||0;
  const base = startOfWeek(logicalNow()); base.setDate(base.getDate()+off*7);
  const week = [...Array(7)].map((_,i)=>{const d=new Date(base);d.setDate(d.getDate()+i);return d;});
  const aps=allPeptides(), allDoses=Object.entries(aps).flatMap(([n,p])=>(p.doses||[]).map(d=>({...d,pep:n,color:cfg(n).color})));
  const dd=week.map(d=>{const k=calendarDayKey(d);return{date:d,doses:allDoses.filter(x=>dayKey(x.date)===k),weight:state.weightLogs.find(w=>dayKey(w.date)===k),daily:state.dailyLogs.find(l=>dayKey(l.date)===k),macro:state.macroLogs.find(m=>dayKey(m.date)===k)};});
  const shots=dd.reduce((a,d)=>a+d.doses.length,0);
  const symCount={}; dd.forEach(d=>{(d.daily&&d.daily.symptoms||[]).forEach(s=>{const n=typeof s==="string"?s:s.name;symCount[n]=(symCount[n]||0)+1;});});
  const top=Object.entries(symCount).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const label=off===0?"This week":off===-1?"Last week":`${fmtShort(week[0].toISOString())} – ${fmtShort(week[6].toISOString())}`;
  html+=`<div class="card" style="border-color:#7DF9C022">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><button id="wp-prev" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px">‹</button><span class="mono" style="font-size:13px;color:#7DF9C0;letter-spacing:1px">${label.toUpperCase()}</span><button id="wp-next" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px;opacity:${off>=0?0.3:1}">›</button></div>
    <div style="display:flex;gap:4px;margin-bottom:16px">${dd.map((d,i)=>{
      const mood=d.daily?MOODS.find(m=>m.v===d.daily.mood):null;
      const today=calendarDayKey(d.date)===dayKey(new Date());
      const pepCols=[...new Set(d.doses.map(x=>x.color))].slice(0,3);
      return `<div style="flex:1;text-align:center">
        <div class="mono" style="font-size:9px;color:${today?"#7DF9C0":"#555"};margin-bottom:4px">${DAY_LABELS[i]}</div>
        <button class="calday" data-date="${d.date.toISOString()}" style="width:100%;height:62px;border-radius:10px;background:${today?"#7DF9C00f":"var(--surface-2)"};border:1px solid ${today?"#7DF9C033":"var(--border-sub)"};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:3px">
          ${pepCols.length?`<div style="display:flex;gap:2px;justify-content:center">${pepCols.map(col=>`<div style="width:5px;height:5px;border-radius:50%;background:${col}"></div>`).join("")}</div>`:""}
          ${mood?`<span style="font-size:14px;line-height:1">${mood.emoji}</span>`:""}
          ${d.weight?`<span style="font-size:7.5px;color:#8AB4FF">${parseFloat(d.weight.weight)}</span>`:""}
          ${!d.doses.length&&!mood&&!d.weight?`<span style="font-size:9px;color:var(--border)">+</span>`:""}
        </button>
        <div style="font-size:8px;color:${today?"#7DF9C0":"#444"};margin-top:3px">${d.date.getDate()}</div>
      </div>`;
    }).join("")}</div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:${top.length?12:0}px">${[["SHOTS",shots],["WEIGH-INS",dd.filter(d=>d.weight).length],["CHECK-INS",dd.filter(d=>d.daily).length]].map(([l,v])=>`<div><div class="nx-expanded-fact-label">${l}</div><div style="font-size:16px;font-weight:700;color:var(--t2)">${v}</div></div>`).join("")}</div>
    ${top.length?`<div><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:6px">MOST LOGGED SYMPTOMS</div><div style="display:flex;gap:6px;flex-wrap:wrap">${top.map(([n,c])=>`<span class="pill" style="background:rgba(255,255,255,.05);color:var(--t3);border:1px solid #2e2e2e">${esc(n)} ×${c}</span>`).join("")}</div></div>`:""}
  </div>`;
  return html;
}

function monthView() {
  const off = state._monthOff||0;
  const now = logicalNow(), yr=now.getFullYear(), mo=now.getMonth()+off;
  const firstDay=new Date(yr,mo,1), lastDay=new Date(yr,mo+1,0);
  const monthLabel=firstDay.toLocaleDateString("en-CA",{month:"long",year:"numeric"});
  const aps=allPeptides();
  const allDoses=Object.entries(aps).flatMap(([n,p])=>(p.doses||[]).map(d=>({...d,pep:n,color:cfg(n).color})));

  // Build projected dose map for this month
  const projectedMap = {};
  Object.entries(aps).filter(([,d])=>(d.doses||[]).length&&(d.status||"active")==="active").forEach(([n,d])=>{
    const last=[...d.doses].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    if(!last) return;
    const col=cfg(n).color;
    let next=new Date(new Date(last.date).getTime()+d.scheduleDays*86400000);
    for(let i=0;i<26;i++){
      if(next>lastDay) break;
      if(next>=firstDay){ const k=dayKey(next.toISOString()); if(!projectedMap[k])projectedMap[k]=[]; projectedMap[k].push(col); }
      next=new Date(next.getTime()+d.scheduleDays*86400000);
    }
  });

  const startPad=firstDay.getDay(); // Sunday=0
  const totalCells=Math.ceil((startPad+lastDay.getDate())/7)*7;
  const cells=[...Array(totalCells)].map((_,i)=>{const d=new Date(firstDay);d.setDate(1-startPad+i);return d;});
  const today=dayKey(new Date());
  const isCurrentMonth=off===0;
  return `<div class="card" style="border-color:#7DF9C022">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <button id="mprev" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px">‹</button>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="mono" style="font-size:13px;color:#7DF9C0;letter-spacing:1px">${monthLabel.toUpperCase()}</span>
        ${!isCurrentMonth?`<button id="mtoday" style="background:#7DF9C018;border:1px solid #7DF9C044;color:#7DF9C0;border-radius:7px;padding:3px 10px;font-size:11px;font-weight:600">Today</button>`:""}
      </div>
      <button id="mnext" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px;opacity:${off>=0?0.3:1}">›</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:6px">
      ${DAY_LABELS.map(d=>`<div class="mono" style="text-align:center;font-size:9px;color:var(--t4);padding-bottom:4px">${d}</div>`).join("")}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">
      ${cells.map(d=>{
        const k=calendarDayKey(d),inMonth=d.getMonth()===(firstDay.getMonth());
        const doses=allDoses.filter(x=>dayKey(x.date)===k);
        const proj=(projectedMap[k]||[]).filter(col=>!doses.some(x=>x.color===col)).slice(0,3);
        const log=state.dailyLogs.find(l=>dayKey(l.date)===k);
        const wt=state.weightLogs.find(w=>dayKey(w.date)===k);
        const macro=state.macroLogs.find(m=>dayKey(m.date)===k);
        const mood=log?MOODS.find(m=>m.v===log.mood):null;
        const isToday=k===today;
        const pepCols=[...new Set(doses.map(x=>x.color))].slice(0,3);
        const projCols=[...new Set(proj)];
        return `<button class="calday" data-date="${d.toISOString()}" style="height:46px;border-radius:8px;background:${isToday?"#7DF9C015":inMonth?"var(--surface-2)":"var(--bg)"};border:1px solid ${isToday?"#7DF9C033":inMonth?"var(--border-sub)":"var(--bg-deep)"};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;opacity:${inMonth?1:0.3}">
          <span style="font-size:11px;color:${isToday?"#7DF9C0":inMonth?"var(--t2)":"var(--t5)"};font-weight:${isToday?"700":"400"};line-height:1">${d.getDate()}</span>
          <div style="display:flex;gap:2px;min-height:6px;align-items:center">
            ${pepCols.map(col=>`<div style="width:4px;height:4px;border-radius:50%;background:${col}"></div>`).join("")}
            ${projCols.map(col=>`<div style="width:4px;height:4px;border-radius:50%;background:${col};opacity:0.35;box-shadow:0 0 0 1px ${col}55"></div>`).join("")}
            ${!pepCols.length&&!projCols.length&&mood?`<span style="font-size:9px;line-height:1">${mood.emoji}</span>`:""}
            ${!pepCols.length&&!projCols.length&&!mood&&wt?`<div style="width:4px;height:4px;border-radius:50%;background:#8AB4FF"></div>`:""}
            ${!pepCols.length&&!projCols.length&&!mood&&!wt&&macro?`<div style="width:4px;height:4px;border-radius:50%;background:#F9C87D"></div>`:""}
          </div>
        </button>`;
      }).join("")}
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;padding-top:10px;border-top:1px solid var(--border-sub)">
      <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#7DF9C0"></div><span style="font-size:10px;color:var(--t4)">Dose logged</span></div>
      <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#7DF9C0;opacity:0.35;box-shadow:0 0 0 1.5px #7DF9C055"></div><span style="font-size:10px;color:var(--t4)">Projected</span></div>
      <div style="display:flex;align-items:center;gap:5px"><span style="font-size:11px">😐</span><span style="font-size:10px;color:var(--t4)">Check-in</span></div>
      <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#8AB4FF"></div><span style="font-size:10px;color:var(--t4)">Weight</span></div>
      <div style="display:flex;align-items:center;gap:5px"><div style="width:6px;height:6px;border-radius:50%;background:#F9C87D"></div><span style="font-size:10px;color:var(--t4)">Macros</span></div>
    </div>
  </div>`;
}

function logsView() {
  const icon=(name)=>{const paths={
    "clipboard-check":'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6M9 12l2 2 4-4"/>',
    "scale":'<path d="M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Z"/><path d="M9 10a3 3 0 0 1 6 0M12 10l2-2"/>',
    "ruler":'<path d="m3 17 14-14 4 4L7 21zM8 12l3 3M12 8l3 3"/>',
    "utensils":'<path d="M4 3v8a4 4 0 0 0 8 0V3M8 3v18M19 3v18M16 9h3"/>',
    "pill":'<path d="m10 4 10 10a5 5 0 0 1-7 7L3 11a5 5 0 0 1 7-7ZM8 16l8-8"/>',
    "syringe":'<path d="m4 20 6-6M14 3l7 7M11 6l7 7M13 4l7 7M7 10l7 7-3 3-7-7z"/>',
    "plus":'<path d="M12 5v14M5 12h14"/>',
    "ellipsis":'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
  };return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths["clipboard-check"])+'</svg>';};
  const byDate={};
  const put=(date,type,label,detail,actions="",extra="",time="")=>{
    const key=dayKey(date);if(!key)return;
    (byDate[key] ||= []).push({type,label,detail,actions,extra,time});
  };
  const actionButtons=(cls,del,id,date)=>{
    const attr=date?'data-date="'+esc(date)+'"':'data-id="'+esc(id)+'"';
    return '<button type="button" class="'+cls+'" '+attr+'>Edit</button><button type="button" class="'+del+'" '+attr+'>Delete</button>';
  };
  (state.dailyLogs||[]).forEach(l=>{
    const mood=MOODS.find(m=>m.v===l.mood);
    const symptoms=(l.symptoms||[]).map(v=>typeof v==="string"?v:v.name).filter(Boolean);
    const updates=(l.updates||[]);
    put(l.date,"Check-in",mood?mood.label:"Check-in recorded",symptoms.length?symptoms.length+" symptoms recorded":"Daily reflection recorded",
      (dayKey(l.date)===localDate()?'<button class="opentodaysheet" data-id="'+esc(l.id)+'">View / edit</button>':'<button class="editdaily" data-id="'+esc(l.id)+'">Edit</button>')+'<button class="deldaily" data-id="'+esc(l.id)+'">Delete</button>',
      (l.notes?'<p>'+esc(l.notes)+'</p>':'')+(symptoms.length?'<p>Symptoms: '+esc(symptoms.join(", "))+'</p>':'')+
      updates.map(u=>'<div class="nx-journal-update"><span>'+esc(u.time?new Date(u.time).toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"}):"Update")+'</span><p>'+esc(u.notes||"Symptom update")+'</p><button class="edit-update" data-lid="'+esc(l.id)+'" data-uid="'+esc(u.id)+'">Edit update</button><button class="del-update" data-lid="'+esc(l.id)+'" data-uid="'+esc(u.id)+'">Delete update</button></div>').join(""),
      l.date);
  });
  (state.weightLogs||[]).forEach(w=>put(w.date,"Weight",w.weight+" "+(state.settings.weightUnit||"lb"),"Weight recorded",actionButtons("editweight","delweight",w.id),w.notes?'<p>'+esc(w.notes)+'</p>':""));
  (state.measurementLogs||[]).forEach(m=>put(m.date,"Measurements","Body measurements","Measurements recorded",actionButtons("editmeasure","delmeasure",m.id),
    '<p>'+MEASURES.filter(([k])=>m[k]!=null&&m[k]!=="").map(([k,label])=>esc(label)+": "+esc(m[k])).join(" · ")+'</p>'));
  (state.macroLogs||[]).forEach(m=>put(m.date,"Nutrition",(m.calories||0)+" kcal","Protein "+(m.protein||0)+" g · Carbs "+(m.carbs||0)+" g",actionButtons("editmacro","delmacro",m.id),
    m.notes?'<p>'+esc(m.notes)+'</p>':""));
  (state.supplementLogs||[]).forEach(m=>{if(!(m.taken||[]).length)return;const k=dayKey(m.date);put(m.date,"Supplements",(m.taken||[]).length+" supplements recorded",(m.taken||[]).slice(0,3).join(" · "),
    '<button class="edit-supp-log" data-date="'+esc(k)+'">Edit</button><button class="del-supp-log" data-date="'+esc(k)+'">Delete</button>',
    '<p>'+esc((m.taken||[]).join(", "))+'</p>');});
  // Dose events belong in Full Day History as well as Calendar. They are read-only
  // here; existing dose-history editing is preserved in its original workflow.
  Object.entries(allPeptides()).forEach(([name,compound])=>{
    (compound.doses||[]).forEach(d=>{
      if(!d.date)return;
      const unit=cfg(name).unit||"";
      put(d.date,"Dose",name,(d.dose?d.dose+" "+unit+" · ":"")+"Recorded dose","",
        '<p>'+esc([d.method?"Method: "+d.method:"",d.site?"Site: "+d.site:"",d.notes||""].filter(Boolean).join(" · ")||"View compound history for full dose details.")+'</p>');
    });
  });
  const allDates=Object.keys(byDate).sort((a,b)=>b.localeCompare(a));
  const mode=state._logsMode||"day";
  const chosen=state._logsDate||localDate();
  const filter=state._logsFilter||"All";
  const search=(state._logsSearch||"").trim().toLowerCase();
  const matches=(e)=>!search||[e.type,e.label,e.detail].some(v=>String(v||"").toLowerCase().includes(search));
  const types=["All","Dose","Check-in","Weight","Measurements","Nutrition","Supplements"];
  const row=(entry,index,date)=>{
    const symbol={"Dose":"syringe","Check-in":"clipboard-check","Weight":"scale","Measurements":"ruler","Nutrition":"utensils","Supplements":"pill"}[entry.type];
    const id="nx-journal-"+date+"-"+index;
    return '<div class="nx-journal-row"><div class="nx-journal-mark">'+icon(symbol)+'</div><div class="nx-journal-main"><div class="nx-journal-line"><strong>'+esc(entry.type)+'</strong><span>'+esc(entry.time?new Date(entry.time).toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"}):date)+'</span></div><div class="nx-journal-title">'+esc(entry.label)+'</div><div class="nx-journal-desc">'+esc(entry.detail)+'</div><div class="nx-journal-extra" id="'+id+'" hidden>'+entry.extra+'<div class="nx-journal-actions">'+entry.actions+'</div></div></div><button type="button" class="nx-journal-more" data-panel="'+id+'" aria-label="View '+esc(entry.type)+' details" aria-expanded="false">'+icon("ellipsis")+'</button></div>';
  };
  const renderDate=(date)=>{
    const items=(byDate[date]||[]).filter(e=>mode==="day"||((filter==="All"||e.type===filter)&&matches(e)));
    return '<section class="nx-journal-day"><div class="nx-journal-date"><h3>'+esc(fmtDate(date))+'</h3><span>'+items.length+' entr'+(items.length===1?'y':'ies')+'</span></div><div class="nx-journal-rows">'+(items.map((e,i)=>row(e,i,date)).join("")||'<p class="nx-journal-empty">No records for this date.</p>')+'</div></section>';
  };
  const visible=allDates.filter(date=>byDate[date].some(e=>(filter==="All"||e.type===filter)&&matches(e)));
  return '<div class="nx-journal" aria-label="Activity logs"><div class="nx-journal-top"><div><h2>Activity logs</h2><p>Your complete personal history</p></div><div class="nx-log-add-wrap"><button type="button" id="nx-add-log-toggle" class="nx-add-log-btn" aria-expanded="false" aria-controls="nx-add-log-menu">'+icon("plus")+' Add log</button><div id="nx-add-log-menu" class="nx-add-log-menu" hidden><button class="qa-daily" type="button">Check-in</button><button class="qa-weight" type="button">Weight</button><button class="qa-measure" type="button">Measurements</button><button class="qa-macro" type="button">Nutrition</button><button class="qa-supp" type="button">Supplements</button></div></div></div>'+
  '<div class="seg nx-journal-modes"><button type="button" class="nx-journal-mode '+(mode==="day"?"on":"")+'" data-mode="day">Day view</button><button type="button" class="nx-journal-mode '+(mode==="all"?"on":"")+'" data-mode="all">All logs</button></div>'+
  (mode==="day"?'<div class="nx-journal-picker"><label for="nx-journal-date">View a whole day</label><input type="date" id="nx-journal-date" value="'+esc(chosen)+'"><button type="button" id="nx-journal-today">Today</button><button type="button" class="nx-journal-day-step" data-offset="-1" aria-label="Previous day">Previous</button><button type="button" class="nx-journal-day-step" data-offset="1" aria-label="Next day">Next</button></div>'+renderDate(chosen)
  :'<label class="nx-journal-search-label" for="nx-journal-search">Search your history</label><input id="nx-journal-search" class="nx-journal-search" type="search" placeholder="Search records" value="'+esc(state._logsSearch||"") +'" autocomplete="off"><div class="nx-journal-filters" role="group" aria-label="Filter logs">'+types.map(type=>'<button type="button" data-type="'+type+'" class="nx-journal-filter '+(filter===type?"on":"")+'">'+type+'</button>').join("")+'</div>'+(visible.length?visible.map(renderDate).join(""):'')+'<p id="nx-journal-search-empty" class="nx-journal-empty" '+(visible.length?'hidden':'')+'>No matching entries.</p>')+
  '</div>';
}

function learnContent() {
  const sub = state._learnSub || "guides";
  const subBtn = (id,l) => `<button id="ls-${id}" class="${sub===id?"on":""}">${l}</button>`;
  let html = `<div class="seg" style="margin:0 0 18px">${subBtn("guides","Guides")}${subBtn("discover","Discover")}${subBtn("mixing","Stacking")}${subBtn("calc","Dose Calc")}</div>`;
  if(sub!=="calc") html += `<div class="nx-learn-quick"><div style="font-weight:650;color:var(--t1);margin-bottom:7px">Quick tool</div><button type="button" id="nx-learn-calc">Dose calculator →</button><p style="font-size:11px;color:var(--t4);margin:8px 0 0">Concentration and volume conversions only; not a clinical dose verification.</p></div>`;
  if (sub === "mixing") { return html+mixingChartView(); }
  if (sub === "calc")    { return html+reconCalcView(); }
  if (sub === "discover") {
    const q = (state._discoverSearch||"").toLowerCase();
    const af = state._discoverFilter||"";
    const CATS = ["All","Fat Loss","Recovery","Skin & Hair","Sleep","Cognitive","Hormonal","Longevity","Immune","Blends"];
    const CAT_MAP = {"Fat Loss":["Fat Loss","Metabolic"],"Recovery":["Recovery","Injury"],"Skin & Hair":["Skin","Hair"],"Sleep":["Sleep"],"Cognitive":["Cognitive","Focus","Mood","Nootropic"],"Hormonal":["Hormonal","Sexual Wellness","Libido"],"Longevity":["Longevity","Mitochondrial","Anti-aging"],"Immune":["Immune","Anti-viral","Anti-inflammatory"],"Blends":["Blend"]};
    const sortedLib = [...LIBRARY].sort((a,b)=>a.name.localeCompare(b.name));
    const filtered = sortedLib.filter(l=>{
      const matchQ = !q || l.name.toLowerCase().includes(q) || l.sub.toLowerCase().includes(q) || (l.aliases||[]).some(a=>a.toLowerCase().includes(q)) || (l.tags||[]).some(t=>t.toLowerCase().includes(q));
      const matchCat = !af || af==="All" || (CAT_MAP[af]||[af]).some(c=>(l.tags||[]).some(t=>t.toLowerCase().includes(c.toLowerCase())));
      return matchQ && matchCat;
    });
    const recentNames = (state.settings.recentDiscoverViews||[]).filter(n=>LIBRARY.some(l=>l.name===n));
    const showRecent = recentNames.length && !q && (!af||af==="All");
    return html + `
    ${showRecent?`<div style="margin-bottom:14px">
      <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">RECENTLY VIEWED</div>
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:2px">
        ${recentNames.slice(0,6).map(n=>{const it=LIBRARY.find(l=>l.name===n); return it?`<button class="discitem" data-name="${esc(n)}" style="flex:0 0 auto;padding:8px 14px;border-radius:10px;background:var(--surface-2);border:1px solid ${it.color}44;color:${it.color};font-size:12px;font-weight:600">${esc(n)}</button>`:"";}).join("")}
      </div>
    </div>`:""}
    <div style="position:relative;margin-bottom:10px">
      <input id="disc-search" class="inp" placeholder="🔍  Search by name, alias, or use…" value="${esc(state._discoverSearch||"")}" style="width:100%;padding-right:${state._discoverSearch?"36px":"14px"}">
      ${state._discoverSearch?`<button id="disc-clear" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--t4);font-size:15px;line-height:1;padding:4px">✕</button>`:""}
    </div>
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px">
      ${CATS.map(c=>`<button class="disc-filter" data-cat="${c}" style="padding:4px 10px;border-radius:99px;font-size:11px;background:${af===c||(!af&&c==="All")?"var(--surface-3)":"transparent"};border:1px solid ${af===c||(!af&&c==="All")?"var(--border)":"var(--border-sub)"};color:${af===c||(!af&&c==="All")?"var(--t1)":"var(--t4)"}">${c}</button>`).join("")}
    </div>
    ${filtered.length===0?`<div style="text-align:center;padding:30px;color:var(--t4)">No compounds match.</div>`:""}
    ${filtered.map(item=>{
      const evBg=item.evidence==="established"?"#7DF9C022":item.evidence==="emerging"?"#F9C87D22":"#9CC8FF22";
      const evCol=item.evidence==="established"?"#7DF9C0":item.evidence==="emerging"?"#F9C87D":"#9CC8FF";
      const inStack=item.blend ? item.blend.every(c=>isInStack(c)) : isInStack(item.name);
      return `<div class="card discitem" data-name="${esc(item.name)}" style="border-color:${item.color}22;cursor:pointer">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
          <div style="width:8px;height:8px;border-radius:50%;background:${item.color};flex-shrink:0"></div>
          <span class="mono" style="font-size:14px;color:var(--t1);letter-spacing:1px;flex:1">${esc(item.name)}</span>
          ${inStack?statusBadge("In Stack", "success"):""}
        </div>
        ${item.aliases?.length?`<div style="font-size:10px;color:var(--t5);margin-bottom:3px;margin-left:18px">aka ${item.aliases.join(", ")}</div>`:""}
        <div style="font-size:12px;color:var(--t4);margin-bottom:8px;margin-left:18px">${esc(item.sub)}</div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-left:18px">
          <span class="pill" style="background:${evBg};color:${evCol};border:1px solid ${evCol}44">${item.evidence}</span>
          ${(item.tags||[]).map(t=>`<span class="pill" style="background:rgba(255,255,255,.05);color:var(--t4);border:1px solid var(--border)">${esc(t)}</span>`).join("")}
        </div>
      </div>`;
    }).join("")}`;
  }
  // Guides
  const cats=[...new Set(GUIDES.map(g=>g.cat))];
  return html + cats.map(cat=>`
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin:${cat===cats[0]?"0":"16px"} 0 10px">${cat.toUpperCase()}</div>
    ${GUIDES.filter(g=>g.cat===cat).map((g,idx)=>{
      const i=GUIDES.indexOf(g);
      return `<button class="guideitem" data-i="${i}" style="display:flex;align-items:center;gap:14px;width:100%;padding:14px 16px;background:var(--surface);border:1px solid var(--border-sub);border-radius:12px;text-align:left;margin-bottom:8px;cursor:pointer"><span style="font-size:22px;flex-shrink:0">${g.icon}</span><div style="flex:1;min-width:0"><div style="font-size:14px;color:var(--t2);font-weight:500;margin-bottom:2px">${esc(g.title)}</div><div style="font-size:11px;color:var(--t4)">${g.min||""}</div></div><span style="color:var(--t5);font-size:18px">›</span></button>`;
    }).join("")}
  `).join("");
}

function guideDetail(i) {
  const g = GUIDES[i];
  if (!g) return `<div style="color:var(--t4);padding:40px;text-align:center">Guide not found.</div>`;
  const backBtn = `<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><button id="backguide" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px">‹</button><h1 class="serif" style="font-size:20px;color:var(--t1);flex:1;margin:0">${esc(g.title)}</h1></div>`;

  // Special visual layout for the dosing math guide
  if(g.title.includes("mg, mcg, mL")) {
    const refCard = (vialMg, bacOpts) => `<div style="margin-bottom:12px">
      <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">${vialMg}mg VIAL</div>
      ${bacOpts.map(([bac,conc,examples])=>`<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:10px 12px;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:12px;font-weight:700;color:var(--t1)">${bac}mL BAC → ${conc}mg/mL</span>
          ${bac===2?`<span style="font-size:9px;color:#7DF9C0;background:#7DF9C015;border:1px solid #7DF9C033;border-radius:8px;padding:1px 7px">COMMON</span>`:""}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px">
          ${examples.map(([dose,units])=>`<div style="display:flex;justify-content:space-between;padding:3px 6px;background:var(--surface-3);border-radius:5px"><span style="font-size:11px;color:var(--t4)">${dose}</span><span style="font-size:11px;color:var(--t2);font-weight:600">${units} u</span></div>`).join("")}
        </div>
      </div>`).join("")}
    </div>`;

    const collapse = (label, content) => `<details class="app-detail" style="margin-bottom:8px"><summary style="font-size:12px;font-weight:600;color:var(--t2)">${label}<span style="margin-left:auto;color:var(--t5);font-size:12px">›</span></summary><div class="app-detail-body">${content}</div></details>`;

    return backBtn + `
    <!-- HERO: Quick Reference -->
    <div style="background:linear-gradient(135deg,#7DF9C022,#7DF9C008);border:1px solid #7DF9C044;border-radius:14px;padding:16px;margin-bottom:16px">
      <div class="mono" style="font-size:10px;color:#7DF9C0;letter-spacing:2px;margin-bottom:14px">⚡ QUICK REFERENCE</div>
      ${refCard(10,[[1,"10",[[".25mg",2],[".5mg",5],["1mg",10],["1.5mg",15],["2mg",20]]],[2,"5",[[".25mg",5],[".5mg",10],["1mg",20],["1.5mg",30],["2mg",40]]],[3,"3.3",[[".25mg",8],[".5mg",15],["1mg",30],["1.5mg",45],["2mg",60]]]])}
      ${refCard(30,[[1,"30",[["0.5mg",2],["1mg",3],["1.5mg",5],["2mg",7],["3mg",10]]],[2,"15",[["0.5mg",3],["1mg",7],["1.5mg",10],["2mg",13],["3mg",20]]],[3,"10",[["0.5mg",5],["1mg",10],["1.5mg",15],["2mg",20],["3mg",30]]]])}
    </div>

    <!-- Formula card -->
    <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:12px;padding:14px;margin-bottom:14px">
      <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">THE FORMULA</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div style="background:var(--surface-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--t2)">① Concentration = Vial mg ÷ BAC mL</div>
        <div style="background:var(--surface-3);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--t2)">② Units = (Dose mg ÷ Concentration) × 100</div>
      </div>
      <div style="margin-top:10px;padding:10px 12px;background:#A78BFA12;border:1px solid #A78BFA33;border-radius:8px">
        <div class="mono" style="font-size:9px;color:#A78BFA;letter-spacing:1px;margin-bottom:5px">WORKED EXAMPLE</div>
        <div style="font-size:12px;color:var(--t2);line-height:1.7">10mg vial + 2mL BAC = <b>5mg/mL</b><br>Dose: 1.5mg → (1.5 ÷ 5) × 100 = <b style="color:#7DF9C0">30 units</b></div>
      </div>
    </div>

    <!-- Units explainer -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[["mg","Amount of medication in the vial","#7DF9C0"],["mcg","1000 mcg = 1 mg","#C8FF9C"],["mL","Volume of BAC water added","#8AB4FF"],["units","Syringe markings (volume, not dose)","#F9C87D"]].map(([lbl,desc,col])=>`<div style="background:var(--surface-2);border:1px solid ${col}33;border-radius:10px;padding:10px 12px"><div style="font-size:16px;font-weight:700;color:${col};margin-bottom:3px">${lbl}</div><div style="font-size:11px;color:var(--t3);line-height:1.4">${desc}</div></div>`).join("")}
    </div>

    <!-- Collapsed sections -->
    ${collapse("⚠️ Common mistakes",`<ul style="margin:0;padding:0 0 0 16px;font-size:12px;color:var(--t3);line-height:1.8"><li>Confusing units with mg — they are not the same</li><li>Using different BAC amounts each time without re-logging</li><li>Decimal slip: 1mg ≠ 1mcg (1mg = 1000mcg)</li><li>Reading the wrong edge of the plunger stopper</li></ul>`)}
    ${collapse("📐 Full conversion reference",`<div style="font-size:12px;color:var(--t3);line-height:2">1 mg = 1000 mcg<br>1 mL = 100 units (U-100 syringe)<br>0.1 mL = 10 units<br>0.01 mL = 1 unit<br>500 mcg = 0.5 mg<br>250 mcg = 0.25 mg</div>`)}
    ${collapse("📖 Explanations — read when you have time", g.body.map(([heading,text])=>`<div style="margin-bottom:14px"><div style="font-size:12px;font-weight:700;color:var(--t2);margin-bottom:5px">${esc(heading)}</div><div style="font-size:12px;color:var(--t3);line-height:1.65">${esc(text).replace(/\n/g,"<br>")}</div></div>`).join(""))}
    `;
  }

  // Default generic renderer for all other guides
  return backBtn +
  `<div class="hint" style="margin-bottom:20px">${esc(g.cat)} · ${g.min||""}</div>
  ${g.body.map(([heading,text])=>`<div style="margin-bottom:18px"><div style="font-size:13px;font-weight:700;color:var(--t2);margin-bottom:6px">${esc(heading)}</div><div style="font-size:13px;color:var(--t3);line-height:1.65">${esc(text).replace(/\n/g,"<br>")}</div></div>`).join("")}`;
}

function compoundIntelView(name) {
  const c = cfg(name);
  const lib = LIBRARY.find(l=>l.name===name);
  const aps = allPeptidesIncArchived();
  const p = aps[name];
  const doses = [...(p?.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const kits = state.supplies.filter(s=>s.name===name);
  // Same resolution Log Dose actually uses now — the person's remembered choice for this
  // compound, or least-remaining if there's no memory yet. Previously this was its own
  // separate priority chain (active+reconstituted > active > most-recently-recon'd >
  // first), which could easily disagree with which kit a dose would actually draw from
  // the instant more than one kit is genuinely open at once.
  const activeKit = defaultSourceKit(name)?.kit
    || [...kits].filter(k=>k.reconDate).sort((a,b)=>new Date(b.reconDate)-new Date(a.reconDate))[0]
    || kits[0];

  // ── Reconstitution math ─────────────────────────────────────────────
  const hasKit = !!activeKit;
  const vialMg = hasKit ? parseFloat(activeKit.vialMg||0) : null;
  const bacMl  = hasKit ? parseFloat(activeKit.bacMl||0) : null;
  const conc   = (vialMg && bacMl) ? vialMg/bacMl : null; // mg/mL
  const compUnit = c.unit || "mg"; // compound's native dose unit (mg, mcg, etc.)
  // doseAmt is ALWAYS in mg for all supply math — use doseToMg to normalize
  const doseAmt = doses.length ? doseToMg(doses[0].dose, compUnit) : null;
  const units  = (conc && doseAmt) ? Math.round(doseAmt/conc*100) : null; // U-100 units to draw
  const scheduleDays = p?.scheduleDays || 7;
  const dosesPerVial = (conc && doseAmt) ? Math.floor(vialMg/doseAmt) : null;
  const vialDays = (dosesPerVial && scheduleDays) ? dosesPerVial*scheduleDays : null;

  // Kit-level supply intelligence — all values in mg. Uses the canonical
  // getKitRemainingMg (allocation/prepared-aware) rather than a local recount, and adds
  // prepared inventory on top so "remaining" never claims the vial holds material that's
  // already been drawn into a prepared syringe.
  const remMg = hasKit ? getKitRemainingMg(activeKit) + getPreparedRemainingMg(name) : null;
  const preparedMg = getPreparedRemainingMg(name), preparedCount = getPreparedRemainingCount(name);
  // Vials currently owned, not kit.totalVials (a purchase record that never shrinks when
  // a vial is given away whole) — a transferred vial is gone from your stash and must not
  // inflate "how much I currently have."
  const ownedVialCount = hasKit ? kitOwnedVialCount(activeKit) : null;
  // Sum each owned vial's OWN vialMg, not ownedVialCount × the kit's current top-level
  // vialMg — a kit's top-level vialMg is just whatever was typed into "Open New Vial"
  // most recently, and activateVial() deliberately locks each vial's own vialMg in at
  // the moment IT was opened, specifically so an older, different-strength vial already
  // in this kit is never silently reinterpreted as the newer strength. Multiplying by the
  // current top-level value would do exactly that the moment a kit's vial strength ever
  // changes (e.g. reordered at a different mg/vial than last time).
  const totalKitMg = hasKit ? (activeKit.vials||[]).filter(v=>v.status!=="transferred").reduce((a,v)=>a+(v.vialMg!=null?v.vialMg:vialMg),0) : null;
  const transferredCount = hasKit ? kitTransferredVialsV2(activeKit).length : 0;
  const mgPerWeek = doseAmt ? doseAmt*(7/scheduleDays) : null;
  const weeksRem = (remMg!=null && mgPerWeek) ? remMg/mgPerWeek : null;
  const depletionDate = weeksRem!=null ? addDays(localDate(), Math.round(weeksRem*7)) : null;

  // Reconstitution age
  const reconDate = activeKit?.reconDate;
  const reconAge = reconDate ? Math.floor(daysSince(reconDate)) : null;
  const expiryDays = activeKit?.expiryDays || 30;

  // What to track
  const trackItems = c.returnSymptoms || (COMPOUND_SYMPTOMS[name]?.symptoms?.slice(0,6)) || [];

  const section = (title, color, content) => `<div class="card" style="border-color:${color||c.color}22;margin-bottom:14px">
    <div class="mono" style="font-size:10px;color:${color||"var(--t4)"};letter-spacing:2px;margin-bottom:12px">${title}</div>
    ${content}
  </div>`;
  const row = (label,val,valColor) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--surface-2)">
    <span style="font-size:12px;color:var(--t4)">${label}</span>
    <span style="font-size:13px;color:${valColor||"var(--t1)"};font-weight:600">${val}</span>
  </div>`;

  return `
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
    <button id="back-intel" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px">‹</button>
    <div style="flex:1">
      <h1 class="serif" style="font-size:20px;margin:0;color:${c.color}">${esc(name)}</h1>
      <div style="font-size:12px;color:var(--t4)">${lib?esc(lib.sub):(c.unit||"mg")+" · peptide"}</div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
      ${hasKit?`<span style="font-size:10px;color:${activeKit.activeKit?"#7DF9C0":"var(--t4)"}">● ${activeKit.activeKit?"Active kit":"Kit in stash"}</span>`:""}
      ${doses.length?`<span style="font-size:10px;color:var(--t4)">${doses.length} doses logged</span>`:""}
    </div>
  </div>

  ${lib?`<div class="card" style="border-color:${c.color}22;margin-bottom:14px">
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">WHAT IS THIS</div>
    <div style="font-size:13px;color:var(--t3);line-height:1.65;margin-bottom:${lib.mechanism?"12px":"0"}">${esc(lib.overview||"")}</div>
    ${lib.mechanism?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:6px;margin-top:8px">HOW IT WORKS</div><div style="font-size:12px;color:var(--t3);line-height:1.6">${esc(lib.mechanism)}</div>`:""}
  </div>`:""}

  ${lib?.meta?section("AT A GLANCE","var(--t4)",`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${Object.entries(lib.meta).map(([k,v])=>`<div><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1px;margin-bottom:2px">${k.toUpperCase()}</div><div style="font-size:12px;color:var(--t2)">${esc(v)}</div></div>`).join("")}</div>`):""}

  ${section("🧪 RECONSTITUTION" + (hasKit?" · YOUR KIT":"· GENERIC GUIDE"), hasKit?"#C8FF9C":"var(--t4)",
    hasKit ? `
      ${row("Vial size", vialMg+"mg", c.color)}
      ${row("BAC water added", bacMl+"mL", c.color)}
      ${row("Concentration", conc?conc.toFixed(2)+"mg/mL":"—", "#7DF9C0")}
      ${doseAmt?row("Your current dose", (()=>{if(!doseAmt)return "—"; return compUnit==="mcg"?Math.round(doseAmt*1000)+"mcg":doseAmt+"mg";})(), c.color):""}
      ${units!=null?row("Units to draw", units+" units (on 100-unit syringe)", "#C8FF9C"):""}
      ${dosesPerVial?row("Doses per vial", dosesPerVial+" doses", "var(--t2)"):""}
      ${vialDays?row("Vial duration", "~"+vialDays+" days at current pace", "var(--t2)"):""}
      ${reconAge!=null?row("Vial opened", reconAge+"d ago", reconAge>=expiryDays-5?"#F9C87D":"var(--t2)"):""}
      ${reconAge!=null&&reconAge>=expiryDays-5?`<div style="background:#F9C87D10;border:1px solid #F9C87D33;border-radius:8px;padding:8px 10px;margin-top:8px;font-size:11px;color:#F9C87D">⏰ Approaching ${expiryDays}-day expiry — consider opening a new vial soon</div>`:""}
      <div style="font-size:10px;color:var(--t5);margin-top:10px;line-height:1.5">Tip: draw to the unit mark that matches your dose. For example, if concentration is 2mg/mL and your dose is 0.5mg, draw to 25 units.</div>
    ` : `
      <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:10px">No kit found in your Stash for this compound. Add a kit to get live reconstitution math.</div>
      <div style="font-size:12px;color:var(--t3);line-height:1.6"><b style="color:var(--t2)">General formula:</b> Concentration (mg/mL) = Vial mg ÷ BAC water mL<br>Units to draw = (Dose mg ÷ Concentration) × 100</div>
    `
  )}

  ${(()=>{
    // BAC suggestion section — shown when we know vial size (from kit or skip if unknown)
    const suggestVialMg = vialMg || null;
    if(!suggestVialMg) return "";

    // Generate 3 BAC options: 1mL, 2mL, 3mL (skip if resulting volume > practical ~3mL or concentration < 0.5mg/mL)
    const bacOptions = [1,2,3].map(ml=>({ml, conc: suggestVialMg/ml})).filter(o=>o.conc>=0.5&&o.ml<=3);

    // Score each option: prefer units that are clean multiples of 5/10 for the intended dose
    // "clean" = units value is integer multiple of 5
    const scoreUnits = u => { if(u<=0) return 0; const r=u%5; return r===0?3:(r<=2||r>=3?1:2); };

    const bestIdx = bacOptions.reduce((bestI,opt,i)=>{
      if(!doseAmt) {
        // No dose: prefer 2mL (balanced default)
        return opt.ml===2?i:bestI;
      }
      const u = Math.round(doseAmt/opt.conc*100);
      const uScore = scoreUnits(u);
      const volScore = opt.ml<=2?2:1; // prefer smaller injection volume
      const score = uScore*2+volScore;
      const bestOpt = bacOptions[bestI];
      const bestU = Math.round(doseAmt/bestOpt.conc*100);
      const bestScore = scoreUnits(bestU)*2+(bestOpt.ml<=2?2:1);
      return score>bestScore?i:bestI;
    }, 0);

    const optLabels = ["More concentrated","Balanced dosing","More diluted"];
    const optDescs = [
      "Smaller injection volume. Good for larger doses.",
      "Easiest syringe math for most doses.",
      "More precise measurement for very small doses."
    ];

    const commonDoses = doseAmt
      ? [doseAmt*0.5, doseAmt, doseAmt*2].filter(d=>d>0&&d<=suggestVialMg)
      : suggestVialMg<=5
        ? [0.25,0.5,1].filter(d=>d<=suggestVialMg)
        : suggestVialMg<=30
          ? [0.5,1,1.5,2].filter(d=>d<=suggestVialMg)
          : [1,2,5].filter(d=>d<=suggestVialMg);

    const optCards = bacOptions.map((opt,i)=>{
      const isBest = i===bestIdx;
      const unitExamples = commonDoses.map(d=>{
        const u=Math.round(d/opt.conc*100);
        const dLabel = d<1 ? (d*1000)+"mcg" : d+"mg";
        return `<div style="display:flex;justify-content:space-between;padding:3px 0"><span style="font-size:11px;color:var(--t4)">${dLabel}</span><span style="font-size:11px;color:var(--t2);font-weight:600">${u} units</span></div>`;
      }).join("");
      return `<div style="background:var(--surface-2);border:1px solid ${isBest?"#7DF9C0":"var(--border-sub)"};border-radius:10px;padding:12px 14px;margin-bottom:8px;position:relative">
        ${isBest?`<div style="position:absolute;top:10px;right:10px;font-size:9px;font-weight:700;color:#7DF9C0;background:#7DF9C018;border:1px solid #7DF9C044;border-radius:10px;padding:2px 7px">SUGGESTED</div>`:""}
        <div style="font-size:12px;font-weight:700;color:var(--t1);margin-bottom:2px">${suggestVialMg}mg + ${opt.ml}mL BAC = ${opt.conc%1===0?opt.conc:opt.conc.toFixed(2)}mg/mL</div>
        <div style="font-size:11px;color:var(--t3);margin-bottom:8px">${optLabels[i]} — ${optDescs[i]}</div>
        ${unitExamples?`<div style="border-top:1px solid var(--border-sub);padding-top:8px">${unitExamples}</div>`:""}
      </div>`;
    }).join("");

    return section("💉 BAC WATER GUIDE","#8AB4FF",`
      <div style="font-size:12px;color:var(--t3);line-height:1.5;margin-bottom:12px">
        Common reconstitution options for a <b style="color:var(--t2)">${suggestVialMg}mg vial</b>.${doseAmt?` Based on your current dose of ${doseAmt}${c.unit}.`:" Choose based on your intended dose size."}
      </div>
      ${optCards}
      <div style="font-size:10px;color:var(--t5);line-height:1.5;margin-top:4px">Units based on U-100 insulin syringe (100 units = 1mL). Educational math only — not a dosing recommendation.</div>
    `);
  })()}

  ${(()=>{
    // dqWarnings computed here — in compoundDoseCard scope where activeKit/conc/c are available
    const dqW=[];
    if(!activeKit?.bacMl||parseFloat(activeKit.bacMl||0)<=0) dqW.push("BAC water amount not set — concentration and unit math may be inaccurate");
    if(!activeKit?.reconDate&&activeKit) dqW.push("No reconstitution date — expiry tracking unavailable");
    if(!c?.unit) dqW.push("Dose unit not configured for this compound");
    return dqW.length?dqW.map(w=>`<div style="background:#F9C87D11;border-left:3px solid #F9C87D;padding:6px 10px;margin-bottom:8px;font-size:10px;color:#F9C87D;border-radius:0 6px 6px 0">⚠ ${esc(w)}</div>`).join(""):"";
  })()}
  ${(remMg!=null || weeksRem!=null)?section("📦 SUPPLY FORECAST","#C8FF9C",`
    ${row("Currently own", totalKitMg+"mg across "+ownedVialCount+" vial"+(ownedVialCount>1?"s":""), "var(--t2)")}
    ${transferredCount?row("Given/transferred away", transferredCount+" vial"+(transferredCount>1?"s":"")+" (not counted above)", "var(--t4)"):""}
    ${row("Used so far", getKitUsedMg(activeKit).toFixed(1)+"mg", "var(--t4)")}
    ${row("In vial", getKitRemainingMg(activeKit).toFixed(1)+"mg", "#7DF9C0")}
    ${preparedCount?row("Prepared", preparedMg.toFixed(1)+"mg · "+preparedCount+" dose"+(preparedCount===1?"":"s"), "#A78BFA"):""}
    ${preparedCount?row("Total usable", remMg.toFixed(1)+"mg", "#7DF9C0"):""}
    ${weeksRem!=null?row("Est. weeks remaining", weeksRem.toFixed(1)+" weeks", "#7DF9C0"):""}
    ${depletionDate?row("Est. depletion", fmtDate(depletionDate), "var(--t2)"):""}
    ${(()=>{
      // Exclude the active kit by identity — prevents double-counting
      const storedKits=kits.filter(k=>k!==activeKit);
      // Each stored kit's own currently-owned remaining — not its nominal totalVials×vialMg,
      // which would count material already used, wasted, or given away from that kit too.
      const storedMg=storedKits.reduce((a,k)=>a+getKitRemainingMg(k),0);
      const totalAll=(remMg||0)+storedMg;
      if(storedKits.length===0) return "";
      const totalWeeks=mgPerWeek>0?Math.round(totalAll/mgPerWeek):null;
      // "Other" kits can now genuinely be open too (multiple simultaneously-active kits),
      // not just sealed/stored — the label needs to say which, or an open 10mg kit next to
      // an open 30mg one would confusingly read as "in storage" when it's just as live.
      const otherOpenCount = storedKits.filter(k=>k.activeKit).length;
      const storedLabel = otherOpenCount>0
        ? (otherOpenCount===storedKits.length ? "Also open ("+storedKits.length+")" : "Also open ("+otherOpenCount+") + stored ("+(storedKits.length-otherOpenCount)+")")
        : (storedKits.length===1&&storedKits[0].storageLocation==="freezer"?"Frozen kit (1)":"Stored kits ("+storedKits.length+")");
      return `<div style="border-top:1px solid var(--border-sub);margin-top:8px;padding-top:8px">
        ${row(storedLabel, storedMg.toFixed(1)+"mg across "+storedKits.reduce((a,k)=>a+kitOwnedVialCount(k),0)+" vials owned","#8AB4FF")}
        ${row("Total "+name+" supply", totalAll.toFixed(1)+"mg total", "#7DF9C0")}
        ${totalWeeks?row("Est. total duration", "~"+totalWeeks+" weeks at current pace","var(--t2)"):""}
      </div>`;
    })()}
  `):""}

  ${lib?.timingInfo?section("⏱ TIMING","#F9C87D",`<div style="font-size:13px;color:var(--t2);line-height:1.65">${esc(lib.timingInfo)}</div>`):""}
  ${lib?.cycleInfo?section("🔁 CYCLE","#A78BFA",`<div style="font-size:13px;color:var(--t2);line-height:1.65">${esc(lib.cycleInfo)}</div>`):""}

  ${lib?.timeline?.length?section("WEEK-BY-WEEK","var(--t4)",lib.timeline.map(([wk,txt])=>`<div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--surface-2)"><div style="width:2px;align-self:stretch;background:${c.color}55;border-radius:2px;flex-shrink:0"></div><div><div style="font-size:11px;font-weight:600;color:${c.color};margin-bottom:2px">${esc(wk)}</div><div style="font-size:12px;color:var(--t3);line-height:1.5">${esc(txt)}</div></div></div>`).join("")):""}

  ${trackItems.length?section("📊 WHAT TO TRACK","var(--t4)",`
    <div style="font-size:12px;color:var(--t3);margin-bottom:10px">Key signals to log for meaningful trend data:</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${trackItems.map(s=>`<span class="pill" style="background:${c.color}18;color:${c.color};border:1px solid ${c.color}33">${esc(s)}</span>`).join("")}</div>
    <div style="font-size:10px;color:var(--t5);margin-top:10px">Log these in your daily check-in and dose logs to unlock phase correlations, timing analysis, and trend insights.</div>
  `):""}

  ${lib?.stacks?.length?section("🔗 COMMON STACKS","var(--t4)",`
    <div style="font-size:12px;color:var(--t3);margin-bottom:10px;line-height:1.5">What this compound is commonly combined with — educational only. Not a protocol recommendation.</div>
    ${lib.stacks.map(s=>`<div style="padding:8px 0;border-bottom:1px solid var(--surface-2);font-size:12px;color:var(--t2)">${esc(s)}</div>`).join("")}
    <div style="font-size:10px;color:var(--t5);margin-top:8px">Discuss combinations with your clinician before stacking.</div>
  `):""}

  ${lib?.safety?section("⚠️ SAFETY NOTES","#ff7c7c",`
    <div style="font-size:12px;color:var(--t3);line-height:1.65">${esc(lib.safety)}</div>
    <div style="font-size:10px;color:var(--t5);margin-top:10px">Educational context only — not medical advice. Discuss your protocol with your prescriber.</div>
  `):""}

  ${lib?.titration?(()=>{
    const tit=lib.titration;
    // Current user context: find dose number, weeks on protocol, current dose amount
    const userWeeks = doses.length && p ? Math.round((Date.now()-new Date([...p.doses].sort((a,b)=>new Date(a.date)-new Date(b.date))[0].date).getTime())/(7*86400000)) : null;
    const userDose = doseAmt;
    // Guess current stage by dose amount vs stage dose ranges
    let userStage = null;
    if(userDose && tit.stages) {
      tit.stages.forEach(st=>{
        const nums=[...(st.dose.match(/[\d.]+/g)||[])].map(Number);
        if(nums.length&&userDose>=nums[0]-0.01) userStage=st.label;
      });
    }
    return section("📈 TYPICAL TITRATION","#A78BFA",`
      <div style="font-size:12px;color:var(--t3);line-height:1.5;margin-bottom:12px">${esc(tit.why)}</div>

      ${tit.stages.map((st,i)=>`<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--surface-2)">
        <div style="width:2px;align-self:stretch;background:#A78BFA55;border-radius:2px;flex-shrink:0"></div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px">
            <span style="font-size:12px;font-weight:600;color:#A78BFA">${esc(st.label)}</span>
            <span style="font-size:11px;color:var(--t4)">${esc(st.dose)} · ${esc(st.duration)}</span>
            ${userStage===st.label?`<span style="font-size:9px;font-weight:700;color:#7DF9C0;background:#7DF9C018;border:1px solid #7DF9C044;border-radius:8px;padding:1px 6px">YOU ARE HERE</span>`:""}
          </div>
          <div style="font-size:11px;color:var(--t3);line-height:1.4">${esc(st.note)}</div>
        </div>
      </div>`).join("")}

      ${userWeeks!=null?`<div style="background:#A78BFA10;border:1px solid #A78BFA33;border-radius:8px;padding:10px 12px;margin-top:10px;font-size:11px;color:var(--t2)">
        You are <b>Week ${userWeeks}</b> on protocol${userDose?` at <b>${userDose}${c.unit}</b>`:""}${userStage?` — <b>${esc(userStage)}</b> phase`:""}. ${doses.length>=1&&doses[0].escalation?"Your last log was marked as an escalation dose.":""}
      </div>`:""}

      ${tit.holdReasons?.length?`<div style="margin-top:10px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:6px">COMMON REASONS TO HOLD</div>${tit.holdReasons.map(r=>`<div style="font-size:11px;color:var(--t3);padding:3px 0">• ${esc(r)}</div>`).join("")}</div>`:""}
      ${tit.increaseReasons?.length?`<div style="margin-top:10px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:6px">COMMON REASONS TO INCREASE</div>${tit.increaseReasons.map(r=>`<div style="font-size:11px;color:var(--t3);padding:3px 0">• ${esc(r)}</div>`).join("")}</div>`:""}
      ${tit.monitor?.length?`<div style="margin-top:10px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:6px">WHAT TO MONITOR</div><div style="display:flex;flex-wrap:wrap;gap:5px">${tit.monitor.map(m=>`<span class="pill" style="background:#A78BFA18;color:#A78BFA;border:1px solid #A78BFA33">${esc(m)}</span>`).join("")}</div></div>`:""}

      <div style="font-size:10px;color:var(--t5);margin-top:12px;line-height:1.4">Common patterns from studies and educational sources — not a dosing protocol. Titration decisions belong with your clinician.</div>
    `);
  })():""}

  <button id="intel-dosing-guide" style="width:100%;margin-top:4px;padding:10px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t3);font-size:12px">📐 Learn mg / mcg / mL / units — Dosing Math Guide</button>
  `;
}

function discoverDetail(name) {
  const item = LIBRARY.find(l=>l.name===name);
  if (!item) return `<div style="color:var(--t4);padding:40px;text-align:center">Compound not found.</div>`;
  const evBg=item.evidence==="established"?"#7DF9C022":item.evidence==="emerging"?"#F9C87D22":"#ff8c0018";
  const evCol=item.evidence==="established"?"#7DF9C0":item.evidence==="emerging"?"#F9C87D":"#ff8c00";
  const isBlend = !!item.blend;
  const inStack = isBlend ? item.blend.every(c=>isInStack(c)) : isInStack(item.name);
  const partiallyInStack = isBlend && !inStack && item.blend.some(c=>isInStack(c));
  const hasData=(allPeptidesIncArchived()[item.name]?.doses||[]).length>0;
  return `<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><button id="backdisc" style="background:var(--surface-2);border:1px solid var(--border);color:var(--t3);border-radius:8px;width:32px;height:32px;font-size:18px">‹</button><div style="flex:1"><h1 class="serif" style="font-size:20px;margin:0;color:${item.color}">${esc(item.name)}</h1><div style="font-size:12px;color:var(--t4)">${esc(item.sub)}</div></div></div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px"><span class="pill" style="background:${evBg};color:${evCol};border:1px solid ${evCol}44">${item.evidence}</span>${(item.tags||[]).map(t=>`<span class="pill" style="background:rgba(255,255,255,.05);color:var(--t4);border:1px solid var(--border)">${esc(t)}</span>`).join("")}</div>
  ${isBlend?`<div class="card" style="border-color:${item.color}44;background:${item.color}0a;margin-bottom:14px">
    <div class="mono" style="font-size:9px;color:${item.color};letter-spacing:1.5px;margin-bottom:8px">THIS IS A BLEND OF</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${item.blend.map(c=>`<span style="font-size:12px;font-weight:600;color:${cfg(c).color};background:${cfg(c).color}18;border:1px solid ${cfg(c).color}44;border-radius:8px;padding:5px 10px">${esc(c)}${isInStack(c)?" ✓":""}</span>`).join("")}</div>
    <div style="font-size:11px;color:var(--t4);margin-top:8px;line-height:1.5">Adding this tracks it as ONE physical vial with a fixed compound ratio — not separate kits for each compound. Logging a dose means entering the one total amount you drew; Nexus splits it proportionally across each compound's own dose history automatically. Each compound still gets its own symptom tracking and dose timeline, just no separate inventory of its own.</div>
  </div>`:""}
  <div class="card" style="border-color:${item.color}22;margin-bottom:14px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">OVERVIEW</div><div style="font-size:13px;color:var(--t3);line-height:1.65">${esc(item.overview||"")}</div></div>
  <div class="card" style="border-color:${item.color}22;margin-bottom:14px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">MECHANISM</div><div style="font-size:13px;color:var(--t3);line-height:1.65">${esc(item.mechanism||"")}</div></div>
  ${item.benefits&&item.benefits.length?`<div class="card" style="border-color:${item.color}22;margin-bottom:14px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">BENEFITS</div>${item.benefits.map(b=>`<div style="display:flex;gap:9px;padding:6px 0;align-items:flex-start"><span style="color:${item.color};font-size:13px;line-height:1.5;flex-shrink:0">•</span><span style="font-size:12.5px;color:var(--t3);line-height:1.55">${esc(b)}</span></div>`).join("")}<div style="font-size:10px;color:var(--t5);margin-top:6px;line-height:1.4">Reported/researched effects, not guaranteed outcomes — evidence quality varies by compound (see the tag above).</div></div>`:""}
  ${item.meta?`<div class="card" style="border-color:${item.color}22;margin-bottom:14px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:12px">AT A GLANCE</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${Object.entries(item.meta).map(([k,v])=>`<div><div class="mono" style="font-size:8.5px;color:var(--t4);letter-spacing:1.5px;margin-bottom:3px">${k.toUpperCase()}</div><div style="font-size:12px;color:var(--t2)">${esc(v)}</div></div>`).join("")}</div></div>`:""}
  ${item.cycleInfo?`<div class="card" style="border-color:#A78BFA33;margin-bottom:14px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:16px">🔁</span><div class="mono" style="font-size:10px;color:#A78BFA;letter-spacing:2px">CYCLE LENGTH</div></div><div style="font-size:13px;color:var(--t2);line-height:1.65">${esc(item.cycleInfo)}</div></div>`:""}
  ${item.timingInfo?`<div class="card" style="border-color:#F9C87D33;margin-bottom:14px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:16px">⏱</span><div class="mono" style="font-size:10px;color:#F9C87D;letter-spacing:2px">BEST TIME TO TAKE</div></div><div style="font-size:13px;color:var(--t2);line-height:1.65">${esc(item.timingInfo)}</div></div>`:""}
  ${item.timeline&&item.timeline.length?`<div class="card" style="border-color:${item.color}22;margin-bottom:14px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:12px">WEEK-BY-WEEK</div>${item.timeline.map(([wk,txt])=>`<div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--surface-2)"><div style="width:2px;align-self:stretch;background:${item.color}55;border-radius:2px;flex-shrink:0"></div><div><div style="font-size:12px;font-weight:600;color:${item.color};margin-bottom:2px">${esc(wk)}</div><div style="font-size:12px;color:var(--t3);line-height:1.5">${esc(txt)}</div></div></div>`).join("")}</div>`:""}
  ${item.stacks&&item.stacks.length?`<div class="card" style="border-color:${item.color}22;margin-bottom:14px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">COMMON STACKS</div>${item.stacks.map(s=>`<div style="font-size:12px;color:var(--t3);padding:5px 0;border-bottom:1px solid var(--surface-2)">${esc(s)}</div>`).join("")}</div>`:""}
  ${item.safety?`<div class="card" style="border-color:#ff4d4d22;margin-bottom:14px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:10px">SAFETY NOTES</div><div style="font-size:12px;color:var(--t3);line-height:1.6">${esc(item.safety)}</div></div>`:""}
  <div style="display:flex;gap:8px;margin-top:4px">
    ${!inStack
      ? `<button class="${isBlend?"disc-track-blend":"disc-track"}" data-name="${esc(item.name)}" style="flex:1;padding:13px;border-radius:12px;background:${item.color}18;border:1px solid ${item.color}44;color:${item.color};font-size:13px;font-weight:700">${isBlend?(partiallyInStack?"+ Add remaining compound(s)":"+ Add Blend to My Stack"):"+ Add to My Stack"}</button>`
      : `<div style="display:flex;flex-direction:column;gap:8px;width:100%">
           <div style="text-align:center;padding:10px;font-size:12px;color:#7DF9C0;background:#7DF9C010;border:1px solid #7DF9C033;border-radius:12px">✓ In your stack${hasData?" · doses logged":""}</div>
           ${!isBlend?`<button class="disc-remove" data-name="${esc(item.name)}" style="width:100%;padding:11px;border-radius:12px;background:#ff4d4d0a;border:1px solid #ff4d4d33;color:#ff7c7c;font-size:12px">Remove from stack${hasData?" (keeps dose history)":""}</button>`:""}
         </div>`
    }
  </div>`;
}

function accumulationSection(name, data, c) {
  if (!c.halfLifeDays) return "";
  const doses = [...(data.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const lastDose = doses[0];
  const _pkUnit = data.unit||cfg(name)?.unit||"mg";
  const validDoses = doses.map(d=>doseToMg(d.dose,_pkUnit)).filter(v=>v>0);
  const doseAmt = lastDose && doseToMg(lastDose.dose,_pkUnit) > 0 ? doseToMg(lastDose.dose,_pkUnit) : (validDoses.length ? validDoses[0] : null);
  const interval = data.scheduleDays || 7;
  const ke = Math.LN2 / c.halfLifeDays;
  const decayPerInterval = Math.exp(-ke * interval);
  const ssPeak = 1 / (1 - decayPerInterval);
  const ssTrough = ssPeak * decayPerInterval;
  const weeksTo95 = Math.ceil(Math.log(0.05) / Math.log(decayPerInterval));
  const fmt = v => doseAmt ? (v * doseAmt).toFixed(2) + " " + c.unit : (v * 100).toFixed(0) + "%";

  // Current level from real dose history
  const now = Date.now();
  const allDosesSorted=[...doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
  let currentLevel = 0;
  doses.forEach(d => {
    const t = (now - new Date(d.date).getTime()) / 86400000;
    const _dMg=doseToMg(d.dose,data.unit||cfg(name)?.unit||"mg"); if (t >= 0) currentLevel += Math.exp(-ke * t) * (_dMg||1);
  });
  const ssPeakAbs = ssPeak * (doseAmt||1);
  const pctOfPeak = Math.round(Math.min(150, currentLevel / ssPeakAbs * 100));
  const daysSince = lastDose ? (now - new Date(lastDose.date).getTime()) / 86400000 : null;

  // Range thresholds (relative to ssPeak)
  const EFFECTIVE_LOW = 0.55, EFFECTIVE_HIGH = 0.9;
  const rangeStatus = currentLevel/ssPeakAbs < EFFECTIVE_LOW ? "below" : currentLevel/ssPeakAbs > EFFECTIVE_HIGH ? "peak" : "effective";
  const rangeColor = rangeStatus==="below" ? "#8AB4FF" : rangeStatus==="peak" ? c.color : "#7DF9C0";
  const rangeLabel = rangeStatus==="below" ? "Lower modeled level" : rangeStatus==="peak" ? "Higher modeled level" : "Intermediate modeled level";

  // Timeframe selector
  const TF_DAYS={"2w":14,"1m":30,"3m":90,"all":null};
  const tf = state._medLevelTF || "1m";
  const firstDoseT = allDosesSorted.length ? new Date(allDosesSorted[0].date).getTime() : now;
  const windowDays = TF_DAYS[tf] || Math.max(14, Math.ceil((now-firstDoseT)/86400000)+7);

  const GW=480, GH=180, PT=12, GFONT=9;
  const projDays = Math.min(interval, 7);
  const gEnd = now + 86400000*projDays;
  const gStart = tf==="all" ? firstDoseT-86400000 : Math.max(firstDoseT-86400000*1.5, gEnd - 86400000*windowDays);
  const gSpan = gEnd-gStart;
  const levelAt = t => { let lv=0; allDosesSorted.forEach(d=>{const dt=(t-new Date(d.date).getTime())/86400000; if(dt>=0) lv+=Math.exp(-ke*dt)*(doseToMg(d.dose,data.unit||cfg(name)?.unit||"mg")||0);}); return lv; };
  const STEPS=100;
  const sampled=[...Array(STEPS+1)].map((_,i)=>levelAt(gStart+(i/STEPS)*gSpan));
  const maxLevel=Math.max(...sampled, currentLevel, 0.1)*1.15;
  // Nice, evenly-spaced Y ticks computed BEFORE the plot margins, so the margin can be
  // sized to whatever these labels actually turn out to be — a 1-2mg range and a
  // 100+mg range need very different left margins, and guessing one fixed number for
  // both is exactly what clipped values like "10.0 mg" down to ".0 mg" before.
  const { ticks: yTickVals, decimals: yDecimals } = niceAxisTicks(maxLevel, 3);
  const yLabelStrs = yTickVals.map(v => v.toFixed(yDecimals)+" "+c.unit);
  const widestYLabelPx = Math.max(0, ...yLabelStrs.map(s=>monoTextWidth(s, GFONT)));
  const sampleXLabel = new Date(now).toLocaleDateString("en-CA",{month:"short",day:"numeric"});
  const halfXLabelPx = monoTextWidth(sampleXLabel, GFONT)/2;
  const PL = Math.ceil(Math.max(widestYLabelPx + 12, halfXLabelPx + 6));
  const PR = Math.ceil(Math.max(16, halfXLabelPx + 6));
  const PB = 22;
  const gpx = t => PL + (t-gStart)/gSpan*(GW-PL-PR);
  const gpy = v => PT + (1-v/maxLevel)*(GH-PT-PB);
  const allPts = sampled.map((v,i)=>[gpx(gStart+(i/STEPS)*gSpan), gpy(v), gStart+(i/STEPS)*gSpan]);
  const histPts = allPts.filter(p=>p[2]<=now);
  const projPts = allPts.filter(p=>p[2]>=now);
  const pathD = pts => pts.map(([x,y],i)=>`${i?"L":"M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const histPathD = pathD(histPts);
  const projPathD = pathD(histPts.length?[histPts[histPts.length-1],...projPts]:projPts);
  const baseY = GH-PB;
  const yTicks = yTickVals.map((v,i)=>({ y: gpy(v), label: yLabelStrs[i] }));
  const xTickCount = tf==="2w"?3:4;
  const xTicks=[...Array(xTickCount)].map((_,i)=>{ const t=gStart+(i/(xTickCount-1))*(now-gStart); return {x:gpx(t), label:new Date(t).toLocaleDateString("en-CA",{month:"short",day:"numeric"})}; });
  const nowX=gpx(now);
  // Axis labels use the theme-aware --t3 var, not a hardcoded hex — a fixed #666 reads
  // fine on the dark theme but is low-contrast against the light theme's pale gradient
  // background, which is why these numbers were hard to read.
  const gridLines = yTicks.map(t=>`<line x1="${PL}" y1="${t.y.toFixed(1)}" x2="${GW-PR}" y2="${t.y.toFixed(1)}" stroke="var(--border)" stroke-width="0.5" opacity="0.35"/><text x="${PL-5}" y="${(t.y+3).toFixed(1)}" fill="var(--t3)" font-size="${GFONT}" font-family="monospace" text-anchor="end">${t.label}</text>`).join("");
  const xLabels = xTicks.map(t=>`<text x="${t.x.toFixed(1)}" y="${GH-5}" fill="var(--t3)" font-size="${GFONT}" font-family="monospace" text-anchor="middle">${t.label}</text>`).join("");
  const graph=`<svg viewBox="0 0 ${GW} ${GH}" style="width:100%;height:auto;display:block;overflow:visible">
    ${gridLines}
    <path d="${histPathD} L ${(histPts[histPts.length-1]?.[0]||0).toFixed(1)} ${baseY} L ${(histPts[0]?.[0]||0).toFixed(1)} ${baseY} Z" fill="url(#acc-grad)"/>
    <defs><linearGradient id="acc-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c.color}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c.color}" stop-opacity="0"/></linearGradient></defs>
    <path d="${histPathD}" fill="none" stroke="${c.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${projPathD}" fill="none" stroke="${c.color}" stroke-width="2" stroke-dasharray="4,4" stroke-linejoin="round" opacity="0.65"/>
    <line x1="${nowX.toFixed(1)}" y1="${PT}" x2="${nowX.toFixed(1)}" y2="${baseY}" stroke="var(--t4)" stroke-width="0.5" stroke-dasharray="2,3" opacity="0.5"/>
    <circle cx="${nowX.toFixed(1)}" cy="${gpy(currentLevel).toFixed(1)}" r="5" fill="${c.color}"/>
    <circle cx="${nowX.toFixed(1)}" cy="${gpy(currentLevel).toFixed(1)}" r="2" fill="#fff"/>
    ${xLabels}
  </svg>`;
  const tfBtn = (k,label) => `<button class="medlvl-tf" data-tf="${k}" style="flex:1;padding:6px 0;border-radius:8px;font-size:11px;font-weight:600;background:${tf===k?"var(--surface-3)":"transparent"};color:${tf===k?"var(--t1)":"var(--t4)"};border:none">${label}</button>`;

  const ph = c.phases ? currentPhase(c.phases, daysSince||0) : null;
  const phaseStr = ph ? `${ph.label} · Day ${Math.floor(daysSince)+1}` : "";

  return `
  <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px">
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px">MEDICATION LEVELS</div>
    <button class="pkinfo" style="background:#8AB4FF18;border:1px solid #8AB4FF44;color:#8AB4FF;border-radius:5px;padding:2px 6px;font-size:9px">ℹ</button>
  </div>

  <div style="text-align:center;margin-bottom:4px">
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:3px">CURRENT LEVEL</div>
    <div style="font-size:24px;font-weight:700;color:var(--t1)">${currentLevel.toFixed(2)} ${c.unit}</div>
    <div style="font-size:11px;color:var(--t4);margin-top:2px">${pctOfPeak}% of recent peak${phaseStr?" · "+phaseStr:""}</div>
  </div>

  <div style="display:flex;gap:4px;background:var(--surface-3);border-radius:10px;padding:3px;margin:12px 0 14px">
    ${tfBtn("2w","2w")}${tfBtn("1m","1m")}${tfBtn("3m","3m")}${tfBtn("all","All")}
  </div>

  <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:16px;padding:14px 10px 8px;margin-bottom:8px">
    ${graph}
  </div>
  <div style="font-size:10px;color:var(--t5);text-align:center;margin-bottom:14px">Includes contribution from previous doses, decayed by half-life.</div>


  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div style="background:${c.color}11;border:1px solid ${c.color}33;border-radius:10px;padding:10px 12px">
      <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px">
        <span class="mono" style="font-size:9px;color:var(--t3);letter-spacing:1px">EXPECTED PEAK</span>
        <button class="metricinfo" data-title="Expected Peak" data-text="Highest estimated medication level after full accumulation at your current dose and schedule." style="width:14px;height:14px;border-radius:50%;background:var(--surface-3);color:var(--t3);font-size:9px;border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0">i</button>
      </div>
      <div style="font-size:17px;font-weight:700;color:${c.color}">${doseAmt?(ssPeak*doseAmt).toFixed(2)+" "+c.unit:ssPeak.toFixed(2)+"×"}</div>
      <div style="font-size:10px;color:var(--t3);margin-top:2px">After full accumulation</div>
    </div>
    <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:10px 12px">
      <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px">
        <span class="mono" style="font-size:9px;color:var(--t3);letter-spacing:1px">EXPECTED TROUGH</span>
        <button class="metricinfo" data-title="Expected Trough" data-text="Lowest estimated medication level before your next scheduled dose after full accumulation." style="width:14px;height:14px;border-radius:50%;background:var(--surface-3);color:var(--t3);font-size:9px;border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;padding:0;flex-shrink:0">i</button>
      </div>
      <div style="font-size:17px;font-weight:700;color:${c.color}cc">${doseAmt?(ssTrough*doseAmt).toFixed(2)+" "+c.unit:ssTrough.toFixed(2)+"×"}</div>
      <div style="font-size:10px;color:var(--t3);margin-top:2px">Before next dose</div>
    </div>
  </div>
  <div style="font-size:9px;color:var(--t5);line-height:1.4;margin-top:8px">Single-compartment PK estimate · t½ = ${c.halfLifeDays}d · Individual levels vary. Not a clinical reading.</div>`;
}

function healthLogSection() {
  // Only daily aggregate logs — exclude workout sessions (isWorkout flag)
  const allLogs = [...state.activityLogs]
    .filter(a=>!a.isWorkout&&(["restingHR","hrv","avgHeartRate","walkingHR","basalCalories","exerciseMinutes","standHours","standMinutes","distanceKm","activeCalories","steps"].some(k=>a[k]!=null)))
    .sort((a,b)=>dayKey(b.date).localeCompare(dayKey(a.date)));

  if (!allLogs.length) return `<div style="color:var(--t4);font-size:12px;line-height:1.6;text-align:center;padding:20px 0">
    No health metrics imported yet.<br>
    <span style="font-size:11px">Profile → 🍎 Health Import → CSV → select your aggregate daily file.</span>
  </div>`;

  const period = state._healthPeriod||"3M";
  const cutoffDays = {all:null,"1M":30,"3M":90,"6M":180}[period];
  const cutoff = cutoffDays ? addDays(localDate(),-cutoffDays) : null;
  const logs = cutoff ? allLogs.filter(a=>dayKey(a.date)>=cutoff) : allLogs;

  // ── Stat helpers ───────────────────────────────────────────────────────────
  const vals = (k) => logs.filter(a=>a[k]!=null).map(a=>a[k]);
  const avg  = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length*10)/10 : null;
  const trend= arr => {
    if(arr.length<4) return "";
    const half=Math.floor(arr.length/2);
    const a1=avg(arr.slice(0,half)), a2=avg(arr.slice(half));
    const diff=a2-a1;
    if(Math.abs(diff)<1) return `<span style="color:var(--t4);font-size:10px"> →</span>`;
    return diff>0
      ? `<span style="color:#7DF9C0;font-size:10px"> ↑ +${Math.abs(diff).toFixed(1)}</span>`
      : `<span style="color:#FF7C7C;font-size:10px"> ↓ −${Math.abs(diff).toFixed(1)}</span>`;
  };

  // ── Sparkline ──────────────────────────────────────────────────────────────
  const sparkline = (arr, color, W=100, H=28) => {
    const chrono = [...arr].reverse(); // logs are desc; reverse for chronological chart
    if (chrono.length < 2) return `<div style="width:${W}px;height:${H}px"></div>`;
    const min=Math.min(...chrono), max=Math.max(...chrono), range=max-min||1;
    const pts = chrono.map((v,i)=>`${(i/(chrono.length-1)*W).toFixed(1)},${(H-1-(v-min)/range*(H-2)).toFixed(1)}`).join(" ");
    return `<svg viewBox="0 0 ${W} ${H}" style="width:${W}px;height:${H}px;flex-shrink:0"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" opacity="0.9"/></svg>`;
  };

  // ── Metric summary cards ───────────────────────────────────────────────────
  const rhrArr=vals("restingHR"), hrvArr=vals("hrv"), avgHRArr=vals("avgHeartRate");
  const walkArr=vals("walkingHR"), activeArr=vals("activeCalories"), basalArr=vals("basalCalories");
  const exArr=vals("exerciseMinutes"), standArr=vals("standHours").concat(vals("standMinutes").map(v=>+(v/60).toFixed(1)));
  const distArr=vals("distanceKm");

  const statCard = (label, value, unit, arr, color) => !arr.length ? "" : `
    <div style="background:${color}11;border:1px solid ${color}33;border-radius:10px;padding:10px 12px;min-width:0">
      <div style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:4px">${label}</div>
      <div style="font-size:18px;font-weight:700;color:${color}">${value!=null?value:"—"}<span style="font-size:11px;font-weight:400;color:var(--t3);margin-left:3px">${unit}</span>${trend(arr)}</div>
      <div style="margin-top:6px">${sparkline(arr,color)}</div>
      <div style="font-size:9px;color:var(--t5);margin-top:4px">${arr.length} days · avg ${avg(arr)!=null?avg(arr)+""+unit:"—"}</div>
    </div>`;

  const simpleCard = (label, value, unit, arr, color) => !arr.length ? "" : `
    <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:10px 12px;min-width:0">
      <div style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:4px">${label}</div>
      <div style="font-size:16px;font-weight:700;color:${color}">${value!=null?value:"—"}<span style="font-size:11px;font-weight:400;color:var(--t3);margin-left:3px">${unit}</span></div>
      <div style="font-size:9px;color:var(--t5);margin-top:4px">${arr.length} days · avg ${avg(arr)!=null?+(avg(arr)).toFixed(1)+""+unit:"—"}</div>
    </div>`;

  // ── Day-by-day table ───────────────────────────────────────────────────────
  const hasCol = k => logs.some(a=>a[k]!=null&&a[k]!==undefined);
  const cols = [
    {h:"Date",   fn:a=>fmtShort(a.date),                                     always:true},
    {h:"RHR",    fn:a=>a.restingHR!=null?a.restingHR+" bpm":"—",             show:hasCol("restingHR")},
    {h:"HRV",    fn:a=>a.hrv!=null?a.hrv+" ms":"—",                          show:hasCol("hrv")},
    {h:"Avg HR", fn:a=>a.avgHeartRate!=null?a.avgHeartRate+" bpm":"—",       show:hasCol("avgHeartRate")},
    {h:"Walk HR",fn:a=>a.walkingHR!=null?a.walkingHR+" bpm":"—",             show:hasCol("walkingHR")},
    {h:"Active", fn:a=>a.activeCalories!=null?a.activeCalories+" cal":"—",   show:hasCol("activeCalories")},
    {h:"Basal",  fn:a=>a.basalCalories!=null?a.basalCalories+" cal":"—",     show:hasCol("basalCalories")},
    {h:"Exercise",fn:a=>a.exerciseMinutes!=null?a.exerciseMinutes+" min":"—",show:hasCol("exerciseMinutes")},
    {h:"Stand",  fn:a=>a.standHours!=null?a.standHours+" hr":(a.standMinutes!=null?a.standMinutes+" min":"—"), show:hasCol("standHours")||hasCol("standMinutes")},
    {h:"Steps",  fn:a=>a.steps!=null?a.steps.toLocaleString():"—",           show:hasCol("steps")},
    {h:"Dist",   fn:a=>a.distanceKm!=null?a.distanceKm.toFixed(1)+" km":"—",show:hasCol("distanceKm")},
  ].filter(c=>c.always||c.show);

  const thStyle = `text-align:left;padding:5px 8px;color:var(--t4);font-size:10px;letter-spacing:1px;border-bottom:1px solid var(--border-sub);white-space:nowrap;position:sticky;top:0;background:var(--surface-2)`;
  const tdStyle = (highlight) => `padding:5px 8px;font-size:11px;color:${highlight||"var(--t2)"};border-bottom:1px solid var(--surface);white-space:nowrap`;
  const rowColor = (a) => {
    // Highlight rows where RHR seems elevated or HRV seems low vs period avg
    const rhr=a.restingHR, hrv=a.hrv;
    const rhrAvg=avg(rhrArr), hrvAvg=avg(hrvArr);
    if(rhr&&rhrAvg&&rhr>rhrAvg+8) return "#FF7C7C18";
    if(hrv&&hrvAvg&&hrv<hrvAvg*0.7) return "#FF7C7C18";
    if(hrv&&hrvAvg&&hrv>hrvAvg*1.3) return "#7DF9C018";
    return "";
  };

  // Workout summary
  const workouts = [...state.activityLogs]
    .filter(a=>a.isWorkout)
    .sort((a,b)=>dayKey(b.date).localeCompare(dayKey(a.date)))
    .slice(0,20);
  const workoutSummary = workouts.length ? `
    <div style="margin-top:14px;border-top:1px solid var(--border-sub);padding-top:14px">
      <div class="mono" style="font-size:10px;color:#A78BFA;letter-spacing:1.5px;margin-bottom:10px">WORKOUT SESSIONS (${workouts.length} recent)</div>
      <div style="overflow-x:auto;border-radius:8px;border:1px solid var(--border-sub)">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead><tr>${["Date","Activity","Duration","Cal","Avg HR","Max HR","Distance"].map(h=>`<th style="text-align:left;padding:5px 8px;color:var(--t4);font-size:10px;letter-spacing:1px;border-bottom:1px solid var(--border-sub);white-space:nowrap;background:var(--surface-2)">${h}</th>`).join("")}</tr></thead>
          <tbody>${workouts.map(w=>`<tr>
            <td style="padding:5px 8px;color:var(--t3);border-bottom:1px solid var(--surface);white-space:nowrap">${fmtShort(w.date)}</td>
            <td style="padding:5px 8px;color:var(--t2);border-bottom:1px solid var(--surface);white-space:nowrap">${esc(w.workoutType||"Workout")}</td>
            <td style="padding:5px 8px;color:var(--t3);border-bottom:1px solid var(--surface);white-space:nowrap">${w.durationMin!=null?w.durationMin+"min":"—"}</td>
            <td style="padding:5px 8px;color:#F9C87D;border-bottom:1px solid var(--surface);white-space:nowrap">${w.workoutActiveCalories||"—"}</td>
            <td style="padding:5px 8px;color:#FF9CC8;border-bottom:1px solid var(--surface);white-space:nowrap">${w.avgHR!=null?w.avgHR+" bpm":"—"}</td>
            <td style="padding:5px 8px;color:#FF9CC8;border-bottom:1px solid var(--surface);white-space:nowrap">${w.maxHR!=null?w.maxHR+" bpm":"—"}</td>
            <td style="padding:5px 8px;color:#8AB4FF;border-bottom:1px solid var(--surface);white-space:nowrap">${w.distanceKm!=null?w.distanceKm.toFixed(1)+" km":"—"}</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
      <div style="font-size:10px;color:var(--t5);margin-top:6px">Imported from Workouts CSV · calories shown are session-level only, not included in daily active energy totals</div>
    </div>` : "";

  const tableRows = logs.slice(0,90).map(a=>{
    const bg=rowColor(a);
    return `<tr style="${bg?`background:${bg}`:""}">
      ${cols.map((c,ci)=>`<td style="${tdStyle(ci===0?"var(--t3)":c.h==="RHR"?"#FF9CC8":c.h==="HRV"?"#A78BFA":null)}">${c.fn(a)}</td>`).join("")}
    </tr>`;
  }).join("");

  return `
    <div class="seg" style="margin-bottom:14px" id="hperiod">
      ${["1M","3M","6M","all"].map(p=>`<button id="hp-${p}" class="${period===p?"on":""}">${p==="all"?"All":p}</button>`).join("")}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${statCard("RESTING HEART RATE",avg(rhrArr)!=null?Math.round(avg(rhrArr)):"—","bpm",rhrArr,"#FF9CC8")}
      ${statCard("HRV (SDNN)",avg(hrvArr)!=null?+(avg(hrvArr)).toFixed(1):"—","ms",hrvArr,"#A78BFA")}
      ${simpleCard("AVG HEART RATE",avg(avgHRArr)!=null?Math.round(avg(avgHRArr)):"—","bpm",avgHRArr,"#F9C87D")}
      ${simpleCard("WALKING HR",avg(walkArr)!=null?Math.round(avg(walkArr)):"—","bpm",walkArr,"#F9C87D")}
      ${simpleCard("ACTIVE ENERGY",avg(activeArr)!=null?Math.round(avg(activeArr)):"—","cal/day",activeArr,"#7DF9C0")}
      ${simpleCard("BASAL ENERGY",avg(basalArr)!=null?Math.round(avg(basalArr)):"—","cal/day",basalArr,"#7DF9C0")}
      ${simpleCard("EXERCISE TIME",avg(exArr)!=null?Math.round(avg(exArr)):"—","min/day",exArr,"#8AB4FF")}
      ${simpleCard("STAND HOURS",avg(standArr)!=null?+(avg(standArr)).toFixed(1):"—","hr/day",standArr,"#8AB4FF")}
    </div>
    ${rhrArr.length>=3||hrvArr.length>=3?`<div style="font-size:11px;color:var(--t4);line-height:1.6;margin-bottom:12px">
      ${rhrArr.length>=3?`RHR avg ${Math.round(avg(rhrArr))} bpm over ${logs.length} days. `:""}
      ${hrvArr.length>=3?`HRV avg ${+(avg(hrvArr)).toFixed(1)} ms. `:""}
      <span style="color:var(--t3)">These are descriptive averages from imported records; changes alone do not establish recovery, illness, or treatment effects.</span>
    </div>`:""}
    <div style="overflow-x:auto;border-radius:8px;border:1px solid var(--border-sub)">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr>${cols.map(c=>`<th style="${thStyle}">${c.h}</th>`).join("")}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    ${logs.length>90?`<div style="font-size:10px;color:var(--t5);text-align:center;margin-top:8px">Showing most recent 90 days · ${logs.length} total</div>`:""}
    <div style="font-size:10px;color:var(--t5);margin-top:10px;line-height:1.5">🟢 Highlighted rows: HRV above avg. 🔴 Rows: RHR elevated or HRV below avg. Reflects imported data only.</div>
    ${workoutSummary}`;
}


