function getScheduledOccurrenceState(data, scheduledDate) {
  const dk = dayKey(scheduledDate);
  const ownSlots = getDayOccurrences(data, dk).filter(s=>!s.isRescheduledIn);
  const unresolved = ownSlots.filter(s=>["due_now","due_later_today","overdue","upcoming","pending"].includes(s.status));
  if (unresolved.length) {
    // Renamed from "missed" to "overdue" — this is the auto-derived, TEMPORARY state for
    // any past day nobody has done anything about yet, not a permanent verdict. It must
    // stay distinct from the "missed" state below, which only exists once the person has
    // actually gone through Resolve Overdue and said "I'm not making this up" — that one
    // is a deliberate, permanent resolution; this one is just "still open, unattended."
    const isPast = dk < localDate();
    return { state: isPast ? "overdue" : "scheduled", scheduledDate:dk, actualDose:null, reschedule:null, skip:null, slots:ownSlots };
  }
  if (ownSlots.length && ownSlots.every(s=>s.status==="skipped")) return { state:"skipped", scheduledDate:dk, actualDose:null, reschedule:null, skip:ownSlots[0].skip, slots:ownSlots };
  // A day resolved via explicit "Mark as missed" (Resolve Overdue) — distinct from a day
  // that's simply still overdue and unattended (the "overdue" state above). This is a
  // real, permanent, deliberate verdict: the person confirmed they didn't take it and
  // aren't making it up. It stops the walk-forward loops the same way skipped/taken do,
  // so it never sits there as "Next" forever, but it's never silently auto-applied just
  // because time passed — only Resolve Overdue creates this.
  if (ownSlots.length && ownSlots.every(s=>s.status==="missed")) return { state:"missed", scheduledDate:dk, actualDose:null, reschedule:null, skip:ownSlots[0].skip, slots:ownSlots };
  if (ownSlots.length && ownSlots.every(s=>s.status==="moved")) return { state:"rescheduled", scheduledDate:dk, actualDose:null, reschedule:ownSlots[0].reschedule, skip:null, slots:ownSlots };
  // A day where every slot fell inside a pause interval was never actually owed — it must
  // resolve to its own state, not fall through to the "missed" default below. This is
  // also what lets the forward-walking loops in getDoseStatus/nextDueDate correctly step
  // PAST paused days (neither "scheduled" nor "overdue" halts them) straight to the first
  // real occurrence after resume, without regenerating a backlog.
  if (ownSlots.length && ownSlots.every(s=>s.status==="paused")) return { state:"paused", scheduledDate:dk, actualDose:null, reschedule:null, skip:null, slots:ownSlots };
  const takenSlot = ownSlots.find(s=>s.status==="taken");
  if (takenSlot) return { state:"taken", scheduledDate:dk, actualDose:takenSlot.dose, reschedule:null, skip:null, slots:ownSlots };
  // A rest-phase day generates ZERO occurrences by design (getOccurrenceTimes returns []),
  // and used to fall straight through to the generic "scheduled"/"overdue" return below —
  // meaning the forward-walking loops in nextDueDate/getDoseStatus saw a rest day as just
  // another unresolved due date and stopped on it. That's how a compound in its rest
  // phase kept showing "Due today" with a live countdown: the day had nothing scheduled,
  // but this function still reported it as something due. It resolves to its own state
  // now, which (like "paused") neither of those loops halts on, so they step straight
  // past the rest phase to the first real dose after it.
  if (!ownSlots.length && getEffectiveSchedule(data, dk).isRest) return { state:"rest", scheduledDate:dk, actualDose:null, reschedule:null, skip:null, slots:ownSlots };
  const isPast = dk < localDate();
  return { state: isPast ? "overdue" : "scheduled", scheduledDate:dk, actualDose:null, reschedule:null, skip:null, slots:ownSlots };
}
function getMostRecentSkip(data) {
  const skips = data.skips||[];
  if (!skips.length) return null;
  return [...skips].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
}
function getMostRecentReschedule(data) {
  const r = data.reschedules||[];
  if (!r.length) return null;
  return [...r].sort((a,b)=>new Date(b.originalDate)-new Date(a.originalDate))[0];
}

function nextDueDate(data) {
  const sorted = [...(data.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const last = sorted[sorted.length-1];
  const skips = data.skips||[];
  const reschedules = data.reschedules||[];

  // A reschedule record is a "chain tip" — still pending, effective due date = its newDate
  // — as long as nothing has resolved that newDate yet: no dose logged there, no skip
  // there, and it hasn't itself been rescheduled again (in which case a LATER record,
  // chained via originalDate===this newDate, is the real tip). This is what lets
  // Fri→Sat→Sun stay ONE traceable chain instead of losing the pending occurrence.
  const isResolved = (dateStr) => {
    if ((data.doses||[]).some(d => doseDayFor(data,d)===dayKey(dateStr))) return true;
    if (skips.some(s => dayKey(s.date)===dayKey(dateStr))) return true;
    if (reschedules.some(r => dayKey(r.originalDate)===dayKey(dateStr))) return true;
    return false;
  };
  const pendingReschedules = reschedules.filter(r => !isResolved(r.newDate));

  // Anchor = the most recent RESOLVED occurrence date — taken (last dose, adjusted for a
  // fulfilled keep-schedule reschedule), skipped, or rescheduled. A skip resolves an
  // occurrence without ever creating a dose record, so anchoring on dose history alone
  // can never advance past one — this is the actual bug being fixed here. This anchor
  // only advances the REGULAR recurring cadence — it never invents new regular slots from
  // a reschedule's newDate, so moving one Friday dose doesn't shift Monday/Wednesday.
  // anchorDay is tracked alongside anchorDate because when the anchor is a DOSE its day is decided
  // by doseDayFor (a late-night dose may count toward the previous day), not by its timestamp alone.
  let anchorDate = null, anchorDay = null;
  if (last) {
    const lastDay = doseDayFor(data, last);
    const resched = reschedules.find(r => r.mode==="keep_schedule" && dayKey(r.newDate)===lastDay);
    anchorDate = resched ? resched.originalDate : last.date;
    anchorDay = resched ? dayKey(resched.originalDate) : lastDay;
  }
  skips.forEach(s => { if (!anchorDate || dayKey(s.date) > anchorDay) { anchorDate = s.date; anchorDay = dayKey(s.date); } });
  reschedules.forEach(r => { if (!anchorDate || dayKey(r.originalDate) > anchorDay) { anchorDate = r.originalDate; anchorDay = dayKey(r.originalDate); } });

  let nextRegular = null;
  if (anchorDate) {
    // The step function is recomputed from the EFFECTIVE schedule at each candidate date,
    // not fixed once from data.scheduleDays — this is what makes a phase boundary (e.g.
    // daily loading → weekly maintenance) transition automatically mid-walk instead of
    // requiring the user to manually flip a schedule toggle on the transition day.
    const stepFrom = (d) => {
      const nextDay = addDays(dayKey(d), 1);
      const sched = getEffectiveSchedule(data, nextDay);
      if (sched.isRest) {
        // A rest phase is one block with nothing in it — jump the whole thing in a single
        // step rather than walking it at the compound's normal interval. Walking it at
        // "every N days" lands on arbitrary days: with a Mon/Wed/Fri phase after the rest,
        // 7-day steps from a Sunday never touch a cadence day and can overshoot the first
        // real dose entirely. Landing on the first cadence day ON OR AFTER the day the
        // next phase begins is correct for both weekday-based and interval-based phases.
        const span = getPhaseSpan(data, nextDay);
        if (!span || !span.nextStartDay) return null; // rest is the final phase — nothing further is ever scheduled
        const resumeDay = span.nextStartDay;
        const after = getEffectiveSchedule(data, resumeDay);
        if (after.isRest) return stepFrom(addDays(resumeDay, -1)); // back-to-back rest phases
        return after.scheduleWeekdays ? nextWeekdayDue(addDays(resumeDay, -1), after.scheduleWeekdays) : resumeDay;
      }
      return sched.scheduleWeekdays ? nextWeekdayDue(d, sched.scheduleWeekdays) : addDays(dayKey(d), sched.scheduleDays||7);
    };
    // Start the check AT the anchor day itself, not one step past it — a multi-dose day
    // can still be its own "next" candidate (e.g. morning logged, evening still pending).
    // getScheduledOccurrenceState only reports "scheduled"/"missed" when a real
    // unresolved occurrence remains, so a fully-resolved anchor day (the legacy
    // single-dose case) correctly falls through to stepping forward exactly as before.
    let candidate = anchorDay;
    let guard = 0;
    while (guard++ < 400) {
      const occ = getScheduledOccurrenceState(data, candidate);
      if (occ.state==="scheduled" || occ.state==="overdue") { nextRegular = candidate; break; }
      candidate = stepFrom(candidate);
      if (!candidate) break; // nothing further is ever scheduled (e.g. the final phase is a rest phase)
    }
  }

  // NEXT = earliest unresolved actionable occurrence, full stop — a still-pending
  // rescheduled dose's effective date, or the next regular-schedule slot, whichever comes
  // first. Every surface (Today, Upcoming, compound card, calendar, Nexus Chat) calls this
  // one function, so there is nowhere else "next" gets independently recalculated.
  const candidates = [...pendingReschedules.map(r=>dayKey(r.newDate)), ...(nextRegular?[nextRegular]:[])];
  if (!candidates.length) return null;
  return candidates.sort()[0];
}
function scheduleLabel(data) {
  // A phased compound's top-level scheduleDays/scheduleWeekdays are just the protocol's
  // starting values — the schedule actually in force today is the CURRENT phase's. Placenta
  // (2 weeks twice daily, then 11 weeks weekly on Sundays) kept reading "Daily" long after
  // it had moved to weekly maintenance, because this read the top-level fields. Rest phases
  // are deliberately left on the top-level label: they have no cadence of their own to
  // describe, and the status label already says "Rest phase".
  if (data.phases && data.phases.length) {
    const eff = getEffectiveSchedule(data, localDate());
    if (eff && !eff.isRest) {
      if (eff.scheduleWeekdays && eff.scheduleWeekdays.length) return eff.scheduleWeekdays.slice().sort((a,b)=>a-b).map(d=>WD_ABBR[d]).join("/");
      const es = eff.scheduleDays||7;
      return es===1?"daily":es===7?"weekly":es===14?"every 2 wks":`every ${es}d`;
    }
  }
  if (isWeekdaySchedule(data)) return data.scheduleWeekdays.slice().sort((a,b)=>a-b).map(d=>WD_ABBR[d]).join("/");
  const s = data.scheduleDays||7;
  return s===1?"daily":s===7?"weekly":s===14?"every 2 wks":`every ${s}d`;
}
// ─── Shared dose unit normalizer ─────────────────────────────────────────────
// ALL supply/reconstitution math MUST go through this — never use raw parseFloat(d.dose)
function doseToMg(dose, unit) {
  const n = parseFloat(dose || 0);
  if (!n || isNaN(n)) return 0;
  const u = (unit||"mg").toLowerCase().trim();
  if (u === "mcg") return n / 1000;
  if (u === "mg")  return n;
  if (u === "iu")  return n * 0.001;
  return n; // unknown unit — pass through
}
// Inverse of doseToMg — converts a canonical-mg value back into a compound's own display
// unit. Allocation amounts (dose.allocations[].amount, prepared syringe component
// allocations) are stored in the compound's NATIVE unit everywhere — matching what's
// shown in UI labels and what a person actually types on the allocation panel — never as
// raw internal mg. Any function doing mg-scale math (like suggestAllocation) must convert
// back through this before returning, or downstream code that (correctly) expects
// native-unit amounts and re-applies doseToMg() once will silently double-convert.
function mgToUnit(mg, unit) {
  const u = (unit||"mg").toLowerCase().trim();
  if (u === "mcg") return mg * 1000;
  if (u === "mg")  return mg;
  if (u === "iu")  return mg / 0.001;
  return mg;
}

// ─── Canonical inventory accounting — vial ↔ prepared ↔ administered ───────
// Physical inventory and administration history are related but NOT the same thing.
// Kit "remaining" has always been derived (total − used), never stored directly — this
// just extends what "used" can mean: a dose can now be split across multiple kits
// (dose.allocations), and material can leave a vial into PREPARED inventory before ever
// being administered (state.preparedDoses). Legacy doses (single kitId, no allocations)
// and legacy kits with no prepared doses behave byte-for-byte as before.
// Canonical outflow accounting — sums only ACTIVE (non-reversed) transactions. Every
// place that needs "how much has left this vial via outflow" reads through here, so
// undoing/editing one transaction updates vial remaining, kit remaining, supply
// forecasting, and Needs Attention all at once — there is nowhere else it could still be
// counted. `sinceDate` optionally scopes to entries on/after a specific reconstitution
// date, for surfaces that show "waste from the CURRENT vial" specifically.
// Syringe units for a specific vial's own concentration — never assume two source vials
// on the same dose share a concentration. concentration (mg/mL) = vialMg / bacMl.
function mgToUnitsForKit(mg, kit) {
  if (!kit || !kit.vialMg || !kit.bacMl) return null;
  const conc = kit.vialMg / kit.bacMl;
  if (!conc) return null;
  return (mg / conc) * 100;
}

// A prepared syringe can contain one component (the original, common case) or several
// (a mixed syringe). Legacy entries only ever had a single top-level {compound,
// amountEach, allocations}; rather than migrating every old record, this reads BOTH
// shapes uniformly — every other function that touches prepared inventory goes through
// here, so a mixed syringe is never a second, parallel system living beside the
// single-compound one.
// Every dose/prepared-syringe event actually attributed to ONE SPECIFIC kit — resolved by
// kitId/vialId, never by compound name alone, so a second kit of the same compound never
// bleeds into this kit's own history. Three event shapes, matching exactly what actually
// happens to inventory:
//   "logged"      — a normal Log Dose entry that drew from this kit
//   "prepared"    — a syringe prepared FROM this kit (inventory already left at this point)
//   "administered"— that same prepared syringe later administered (zero further inventory
//                   change — shown for a complete audit trail, but never double-counted)
// Read-only ledger reconciliation for ONE kit. Never mutates state, never calls
// migrateKitToV2/ensureKitVials (both have side effects) — this only reads whatever
// shape the kit is already in. The invariant being checked:
//   starting == administered(direct) + prepared(ever drawn) + outflow/waste/transferred
//               + remaining(open+sealed)
// "prepared(ever drawn)" intentionally covers BOTH still-outstanding prepared syringes
// AND ones already administered — the mg left the vial at prepare time either way, so
// counting it once there (rather than again at administer time) is what prevents
// prepare+administer from double-counting, per the core invariant this whole audit is
// built around.
function auditKitLedger(kit) {
  const cc = cfg(kit.name);
  const hasVials = (kit.vials||[]).length>0;
  const startingMg = hasVials
    ? kit.vials.reduce((a,v)=>a+(v.vialMg!=null?v.vialMg:(kit.vialMg||0)),0)
    : (kit.totalVials||0)*(kit.vialMg||0);

  const compData = allPeptides()[kit.name];
  const allDoses = compData?.doses||[];
  const attributedToKit = (d) => d.kitId===kit.id || (d.allocations||[]).some(a=>a.kitId===kit.id);

  let administeredDirectMg = 0;   // logged straight from a vial, no prepared step
  let administeredFromPreparedMg = 0; // what the body actually received, for comparison only
  const mismatches = [];
  allDoses.forEach(d=>{
    if (!attributedToKit(d)) return;
    const mg = doseToMg(d.dose, cc.unit);
    if (d.fromPreparedId) {
      administeredFromPreparedMg += mg;
      const pd = (state.preparedDoses||[]).find(p=>p.id===d.fromPreparedId);
      if (pd) {
        const batchTotalForKit = (pd.allocations||[]).filter(a=>a.kitId===kit.id).reduce((a,x)=>a+doseToMg(x.amount, cc.unit),0)
          || getSyringeComponents(pd).reduce((a,c)=>a+(c.compoundName===kit.name?(c.allocations||[]).filter(al=>al.kitId===kit.id).reduce((s,al)=>s+doseToMg(al.amount,cc.unit),0):0),0);
        // A prepared "batch" can be several identical syringes at once (count>1) — the
        // allocation total covers the WHOLE batch, but each administered dose only
        // represents ONE syringe from it. Comparing the batch total against a single
        // dose would flag every normal multi-syringe batch as a false mismatch.
        const preparedMgForKit = batchTotalForKit / (pd.count||1);
        if (Math.abs(preparedMgForKit-mg) > 0.02) {
          mismatches.push({ date:d.date, preparedMg:Math.round(preparedMgForKit*100)/100, administeredMg:Math.round(mg*100)/100, gapMg:Math.round((preparedMgForKit-mg)*100)/100, preparedDoseId: pd.id });
        }
      }
    } else {
      administeredDirectMg += mg;
    }
  });

  // Every mg ever drawn into a prepared syringe from THIS kit — outstanding or already
  // administered, doesn't matter, it left the vial exactly once, right here.
  let preparedTotalMg = 0;
  (state.preparedDoses||[]).forEach(pd=>{
    getSyringeComponents(pd).forEach(comp=>{
      if (comp.compoundName!==kit.name) return;
      (comp.allocations||[]).filter(a=>a.kitId===kit.id).forEach(a=>{ preparedTotalMg += doseToMg(a.amount, cc.unit); });
    });
  });

  // "adjustment" entries are deliberately excluded here — both the migration
  // reconciliation fix and the "Adjust Remaining Amount" tool create them, and both
  // directly mutate vial.remainingMg at the moment they're created. They're a bookkeeping
  // explanation for why remaining is what it is, not an independent physical outflow event
  // on top of it. Summing them here as well would double-count the same mg twice — once
  // via the (already-correct) lower remainingMg, once via this sum.
  const outflowMg = (kit.wasteLog||[]).filter(w=>w.status!=="reversed" && w.type!=="adjustment").reduce((a,w)=>a+(w.mg||0),0);
  const adjustmentMg = (kit.wasteLog||[]).filter(w=>w.status!=="reversed" && w.type==="adjustment").reduce((a,w)=>a+(w.mg||0),0);
  const untaggedHistoricalMg = (kit.wasteLog||[]).filter(w=>w.status!=="reversed" && w.type!=="adjustment" && w.vialId==null).reduce((a,w)=>a+(w.mg||0),0);

  const remainingMg = hasVials
    ? kit.vials.reduce((a,v)=>a+(v.remainingMg!=null?v.remainingMg:0),0)
    : getKitRemainingMg(kit);

  const accountedMg = administeredDirectMg + preparedTotalMg + outflowMg + remainingMg;
  const diffMg = Math.round((startingMg-accountedMg)*100)/100;

  return {
    kitId: kit.id, name: kit.name, unit: cc.unit,
    startingMg: Math.round(startingMg*100)/100,
    administeredDirectMg: Math.round(administeredDirectMg*100)/100,
    administeredFromPreparedMg: Math.round(administeredFromPreparedMg*100)/100,
    preparedTotalMg: Math.round(preparedTotalMg*100)/100,
    outflowMg: Math.round(outflowMg*100)/100,
    adjustmentMg: Math.round(adjustmentMg*100)/100,
    untaggedHistoricalMg: Math.round(untaggedHistoricalMg*100)/100,
    remainingMg: Math.round(remainingMg*100)/100,
    diffMg,
    needsReconciliation: Math.abs(diffMg) > 0.05,
    mismatches, // specific transactions causing gaps (e.g. prepared-vs-administered)
    unmigrated: !hasVials,
  };
}

function auditAllKits() {
  return (state.supplies||[]).filter(s=>!s.isBlend).map(auditKitLedger);
}

function inventoryReconciliationModal() {
  const results = auditAllKits();
  const bad = results.filter(r=>r.needsReconciliation);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">INVENTORY RECONCILIATION</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${bad.length ? `<div style="font-size:12px;color:#F9C87D;margin-bottom:14px">${bad.length} kit${bad.length===1?"":"s"} need reconciliation.</div>` : `<div style="font-size:12px;color:#7DF9C0;margin-bottom:14px">✓ Every kit reconciles.</div>`}
    ${results.map(r=>`
      <div style="background:var(--surface-2);border:1px solid ${r.needsReconciliation?"#F9C87D44":"var(--border-sub)"};border-radius:10px;padding:12px 14px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:700;color:var(--t1)">${esc(r.name)}${r.unmigrated?" (legacy)":""}</span>
          <span style="font-size:11px;font-weight:700;color:${r.needsReconciliation?"#F9C87D":"#7DF9C0"}">${r.needsReconciliation?"⚠ Needs reconciliation":"✓"}</span>
        </div>
        <div style="font-size:11px;color:var(--t3);line-height:1.7">
          Starting: ${r.startingMg}mg<br>
          Administered (direct): ${r.administeredDirectMg}mg<br>
          Prepared (ever drawn): ${r.preparedTotalMg}mg <span style="color:var(--t5)">— includes ${r.administeredFromPreparedMg}mg since administered</span><br>
          Outflow/waste: ${r.outflowMg}mg<br>
          ${r.adjustmentMg>0?`<span style="color:var(--t5)">Manual corrections applied: ${r.adjustmentMg}mg (already reflected in remaining, not a balance input)</span><br>`:""}
          Remaining: ${r.remainingMg}mg<br>
          <b style="color:${Math.abs(r.diffMg)>0.05?"#F9C87D":"var(--t3)"}">Difference: ${r.diffMg}mg ${Math.abs(r.diffMg)<=0.05?"✓":""}</b>
        </div>
        ${r.mismatches.length?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-sub)">
          ${r.mismatches.map(mm=>`<div style="font-size:10px;color:#F9C87D">${fmtDate(mm.date)}: prepared ${mm.preparedMg}mg, only ${mm.administeredMg}mg logged as administered — ${mm.gapMg}mg unaccounted (never logged as waste)</div>`).join("")}
        </div>`:""}
      </div>
    `).join("")}
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;
}

// 12-hour clock text for an HH:MM string ("02:12" -> "2:12 AM").
const time12 = t => { const [h,m] = String(t).split(":").map(Number); return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`; };
// A history row's date. Shows the day the dose COUNTS for, so the list agrees with the day screens,
// Today and the calendar. When that isn't the calendar day it was taken (a bedtime dose logged after
// midnight), the real clock time sits beside it — the timestamp itself is never altered, so nothing
// about when it actually happened is hidden. Unchanged whenever the two days are the same.
function historyDateLabel(ev) {
  if (!ev.countsFor || ev.countsFor === calendarDayKey(ev.date)) return fmtDate(ev.date);
  const real = time12(timeKeyOf(ev.date));
  return `${fmtDate(ev.countsFor)} <span title="Taken ${fmtDate(ev.date)} at ${real} — counts for ${fmtDate(ev.countsFor)}" style="color:#A78BFA;font-size:10px;white-space:nowrap">🌙 ${real}</span>`;
}
// The note on the Log Dose screen: which day this will count toward, shown only when it differs from
// the calendar day being logged on. Empty at the default setting.
function countsForNote(data, dateStr) {
  if (!dateStr || !dayRolloverHours()) return "";
  const cal = calendarDayKey(dateStr), counted = doseDayFor(data, { date: dateStr });
  if (counted === cal) return "";
  return `🌙 After midnight — this will count toward ${fmtDate(counted)}. The time is saved exactly as entered.`;
}
function getKitDoseHistory(kit) {
  const events = [];
  const cc = cfg(kit.name);
  const vialLabel = (vialId) => {
    if (!vialId) return null;
    const v = (kit.vials||[]).find(v=>v.id===vialId);
    return v ? `Vial ${v.sequenceNumber||"?"}` : "Vial";
  };
  const attributedAllocations = (allocations) => (allocations||[]).filter(a=>a.kitId===kit.id);

  // Logged and administered-from-prepared doses both live in each compound's own doses[].
  const compData = allPeptides()[kit.name];
  (compData?.doses||[]).forEach(d=>{
    const allocs = attributedAllocations(d.allocations);
    const directMatch = d.kitId===kit.id;
    if (!allocs.length && !directMatch) return; // not attributed to THIS kit at all
    events.push({
      date: d.date,
      countsFor: doseDayFor(compData, d),
      amountMg: doseToMg(d.dose, cc.unit),
      kind: d.fromPreparedId ? "administered" : "logged",
      sprayCount: d.sprayCount,
      vials: allocs.map(a=>({ label: vialLabel(a.vialId), amountMg: doseToMg(a.amount, cc.unit) })),
    });
  });

  // Prepared syringes — the moment inventory actually left this kit, whether or not
  // they've since been administered.
  (state.preparedDoses||[]).forEach(pd=>{
    getSyringeComponents(pd).forEach(comp=>{
      if (comp.compoundName!==kit.name) return;
      const allocs = attributedAllocations(comp.allocations);
      if (!allocs.length) return;
      events.push({
        date: pd.createdAt,
        amountMg: allocs.reduce((a,x)=>a+doseToMg(x.amount, cc.unit), 0),
        kind: "prepared",
        vials: allocs.map(a=>({ label: vialLabel(a.vialId), amountMg: doseToMg(a.amount, cc.unit) })),
      });
    });
  });

  return events.sort((a,b)=> new Date(b.date) - new Date(a.date));
}

function getSyringeComponents(pd) {
  if (pd.components && pd.components.length) return pd.components;
  if (!pd.compound) return [];
  // Migration fallback: a prepared dose from before per-allocation kit tracking existed
  // might carry only a legacy top-level kitId with no allocations array at all. Rather
  // than losing its source (or worse, letting it silently show as prepared-from-nowhere
  // and appear on every kit of the compound), synthesize a single allocation from
  // whatever legacy kit reference is still on the record.
  let allocations = pd.allocations||[];
  if (!allocations.length && pd.kitId!=null) allocations = [{ kitId: pd.kitId, amount: pd.amountEach }];
  return [{ compoundName: pd.compound, amount: pd.amountEach, unit: pd.unit, allocations }];
}

function getKitActiveWasteMg(kit, sinceDate) {
  // sinceDate is often a reconDate, which can be a bare date ("2026-08-06") or a full
  // timestamp ("2026-08-02T15:56:59.584Z") depending on how that vial was opened —
  // safeDate() handles both, parsing a bare date at local noon instead of letting
  // new Date() silently read it as UTC midnight (which shifts it to the previous evening
  // in a negative-offset timezone like Toronto's). w.loggedAt is the precise moment this
  // outflow was actually recorded (added going forward); w.date alone is only ever a
  // calendar day, so an entry without loggedAt still goes through the same safe,
  // local-noon fallback rather than a raw, timezone-unsafe comparison.
  const since = sinceDate ? safeDate(sinceDate) : null;
  return (kit.wasteLog||[])
    .filter(w => {
      if (w.status==="reversed") return false;
      if (!since) return true;
      const at = w.loggedAt ? new Date(w.loggedAt) : safeDate(w.date);
      return at >= since;
    })
    .reduce((a,w)=>a+(w.mg||0), 0);
}
function getKitActiveTransactions(kit, sinceDate) {
  return (kit.wasteLog||[])
    .filter(w => w.status!=="reversed" && (!sinceDate || new Date(w.date)>=new Date(sinceDate)))
    .sort((a,b)=>new Date(b.date)-new Date(a.date));
}

function getKitUsedMg(kit) {
  const compUnit = cfg(kit.name)?.unit || "mg";
  const doses = (allPeptides()[kit.name]?.doses) || [];
  const sameCompoundKits = (state.supplies||[]).filter(k=>k.name===kit.name);
  let usedMg = 0;
  doses.forEach(d=>{
    if (d.fromPreparedId) return; // already accounted for below, via the prepared batch's own allocation — counting it here too would double-deduct
    if (d.allocations && d.allocations.length) {
      const alloc = d.allocations.find(a=>a.kitId===kit.id);
      if (alloc) usedMg += doseToMg(alloc.amount, compUnit);
    } else if (d.kitId === kit.id) {
      usedMg += doseToMg(d.dose, compUnit);
    } else if (!d.kitId && sameCompoundKits.length===1) {
      usedMg += doseToMg(d.dose, compUnit); // legacy untagged dose, only one kit exists — attribute it here
    }
  });
  usedMg += getKitActiveWasteMg(kit);
  // Prepared inventory already left this vial the moment it was prepared, regardless of
  // whether it's since been administered or is still sitting in a syringe — the vial
  // doesn't get that material back either way, only the PREPARED bucket does.
  (state.preparedDoses||[]).forEach(pd=>{
    getSyringeComponents(pd).forEach(comp=>{
      if (comp.compoundName!==kit.name) return;
      (comp.allocations||[]).forEach(a=>{ if(a.kitId===kit.id) usedMg += doseToMg(a.amount, compUnit); });
    });
  });
  return usedMg;
}
function getKitRemainingMg(kit) {
  // Once a kit's vials carry remainingMg (inventory v2), the kit total is ALWAYS the sum
  // of its vials' remainders — never totalVials×vialMg minus a separately-derived used
  // amount. Two formulas that are each individually reasonable but computed from
  // different inputs is exactly how this kind of number silently drifts apart; only one
  // is allowed to run for a given kit, decided by whether that kit has been migrated yet.
  if ((kit.vials||[]).length && kit.vials.every(v=>v.remainingMg!==undefined)) return kitRemainingMgV2(kit);
  const totalMg = (kit.totalVials||0)*(kit.vialMg||0);
  return Math.max(0, totalMg - getKitUsedMg(kit));
}

// ─── Individual physical vials, within a kit ────────────────────────────────
// A "kit" is a batch of vials of the same compound/strength; a "vial" is one physical
// unit within it. Existing aggregate fields (totalVials/openedVials/emptyVials/
// reconDate/activeKit) stay authoritative for every calculation already built on them
// (supply forecast, low-stock alerts, etc.) — vials[] is additive, real per-unit
// tracking layered on top, lazily migrated the first time a kit is touched by anything
// vial-aware. Nothing that already worked stops working; kits nobody's opened since this
// shipped just get a reconstructed vials[] the first time they're read.
// Self-healing repair: finds a "decoy" vial — active or finished, carrying zero of its
// own history, sharing an EXACT reconDate with a sealed vial that DOES carry real
// legacyUsedMg — and swaps their statuses back. This is exactly the shape of corruption
// the Undo-Reconstitution gap could produce: a vial with real history got sent back to
// sealed, and a different, genuinely blank sealed vial was activated under the same
// manually-matched date. The historical vial reclaims its status; the blank one returns
// to sealed, free for legitimate future use. Runs on every access (idempotent — a
// _vialsRepaired flag skips the check once nothing's left to fix) so existing corrupted
// data self-heals the moment this ships, without the person needing to do anything.
// Backfill — NOT a re-migration. Some persisted kit.vials[] arrays were created by an
// earlier version of this code, before sequenceNumber and legacyUsedMg existed in the
// schema. ensureKitVials()'s early-return on "vials array exists" meant those objects
// were never revisited to receive the newer fields — that's the actual root cause of
// "Vial ?" and "0mg used" appearing on currently-active vials with real reconDates and
// real kit-level usage. This fills in ONLY what's missing, never touches a value that's
// already legitimately set (including a real, computed 0).
function backfillVialMetadata(kit) {
  if (kit._vialsBackfilled || !kit.vials) return;
  const compUnit = cfg(kit.name)?.unit || "mg";
  const doses = (allPeptides()[kit.name]?.doses) || [];
  const sameCompoundKits = (state.supplies||[]).filter(k=>k.name===kit.name);
  const untaggedDoses = doses.filter(d=>!(d.allocations&&d.allocations.some(a=>a.vialId)) && (d.kitId===kit.id || (!d.kitId && sameCompoundKits.length===1)));
  const untaggedWaste = (kit.wasteLog||[]).filter(w=>!w.vialId && w.status!=="reversed");
  const opened = kit.vials.filter(v=>v.status!=="sealed");
  let changed = false;

  // 1. Permanent identity — preserve every sequenceNumber that already exists; assign the
  // rest using the best available ordering signal (reconDate ascending), falling back to
  // array position only for vials with no date on record at all. Continues numbering
  // after the highest existing value so a preserved "Vial 1" never gets renumbered.
  const needsSeq = opened.filter(v=>!v.sequenceNumber);
  if (needsSeq.length) {
    const maxExisting = opened.reduce((m,v)=>Math.max(m, v.sequenceNumber||0), 0);
    // Array position turned out NOT to reliably reflect chronological order in real
    // persisted data — a finished-then-active pair could be stored in either order. Two
    // more reliable signals instead: (1) an ACTIVE vial is, in the overwhelming common
    // case, the most recently opened one — you finish what you were using before opening
    // the next, so any FINISHED vial should sort ahead of the currently ACTIVE one
    // regardless of array position; (2) between two vials of the same status, one with no
    // recorded date is almost always an older legacy record from before per-vial date
    // tracking existed, so it sorts ahead of one that does have a date. Array position is
    // now used only as the true last resort — comparing two undated vials of the same status.
    const idxOf = v => kit.vials.indexOf(v);
    const statusRank = v => (v.status==="active"||v.status==="open") ? 2 : 1; // finished/empty/other < active/open
    needsSeq.sort((a,b) => {
      const sr = statusRank(a)-statusRank(b);
      if (sr !== 0) return sr;
      if (a.reconDate && b.reconDate) return new Date(a.reconDate)-new Date(b.reconDate);
      if (a.reconDate && !b.reconDate) return 1;
      if (!a.reconDate && b.reconDate) return -1;
      return idxOf(a)-idxOf(b);
    });
    let next = maxExisting+1;
    needsSeq.forEach(v=>{ v.sequenceNumber = next++; changed = true; });
  }

  // 2. Historical usage — only for vials where legacyUsedMg is genuinely MISSING
  // (undefined), never overwriting an already-computed value even if it's 0. Uses the
  // same date-window-bucketing as fresh migration, but built from every dated vial's own
  // reconDate directly — not kit.reconHistory, which can itself be incomplete for a kit
  // whose vials[] predates this repair.
  const datedOrdered = opened.filter(v=>v.reconDate).sort((a,b)=>new Date(a.reconDate)-new Date(b.reconDate));
  datedOrdered.forEach((v,i) => {
    if (v.legacyUsedMg != null) return;
    const windowStart = new Date(v.reconDate).getTime();
    const windowEnd = (i+1<datedOrdered.length) ? new Date(datedOrdered[i+1].reconDate).getTime() : Infinity;
    const legacyDoseMg = untaggedDoses.filter(d=>{ const t=new Date(d.date).getTime(); return t>=windowStart && t<windowEnd; }).reduce((a,d)=>a+doseToMg(d.dose,compUnit),0);
    const legacyWasteMg = untaggedWaste.filter(w=>{ const t=new Date(w.date).getTime(); return t>=windowStart && t<windowEnd; }).reduce((a,w)=>a+(w.mg||0),0);
    v.legacyUsedMg = Math.round((legacyDoseMg+legacyWasteMg)*100)/100;
    changed = true;
  });
  // A vial with no reconDate on record at all has no time boundary to attribute usage
  // against — leaving it at 0 is honest; inventing a window would be fabrication.
  opened.filter(v=>!v.reconDate).forEach(v=>{ if (v.legacyUsedMg==null) { v.legacyUsedMg = 0; changed=true; } });

  kit._vialsBackfilled = true;
  if (changed) saveState();
}

// Targeted repair for a specific known bug signature from an earlier version of the
// backfill logic: a FINISHED vial ending up numbered HIGHER than the currently ACTIVE
// one — backwards, since you finish what you were using before opening the next vial.
// This can't be fixed by re-running backfillVialMetadata (it only assigns numbers to
// vials that don't have one yet, and these already do, just in the wrong order) — it
// needs its own pass that specifically detects and corrects this pattern. Only touches
// vials matching that exact signature; anything already correctly ordered is untouched.
function repairVialSequenceOrder(kit) {
  if (kit._vialsSeqOrderRepaired || !kit.vials) return;
  const opened = kit.vials.filter(v=>v.status!=="sealed" && v.sequenceNumber);
  const active = opened.find(v=>v.status==="active"||v.status==="open");
  let changed = false;
  if (active) {
    const wronglyHigher = opened.filter(v=>v.status!=="active"&&v.status!=="open" && v.sequenceNumber>active.sequenceNumber);
    if (wronglyHigher.length) {
      const finished = opened.filter(v=>v.status!=="active").sort((a,b)=>{
        if (a.reconDate && b.reconDate) return new Date(a.reconDate)-new Date(b.reconDate);
        if (a.reconDate && !b.reconDate) return 1;
        if (!a.reconDate && b.reconDate) return -1;
        return (a.sequenceNumber||0)-(b.sequenceNumber||0);
      });
      let next = 1;
      finished.forEach(v=>{ v.sequenceNumber = next++; });
      active.sequenceNumber = next;
      changed = true;
    }
  }
  kit._vialsSeqOrderRepaired = true;
  if (changed) saveState();
}

function repairVialIdentityConflicts(kit) {
  if (kit._vialsRepaired || !kit.vials) return;
  let fixedAny = false;
  // The decoy carries a reconDate (someone typed one in) but zero history. The orphaned
  // true vial carries real legacyUsedMg but NO reconDate — Undo Reconstitution clears
  // that field, which is exactly why matching on date doesn't work here; matching on "the
  // one sealed vial that actually has history" is the reliable signal instead.
  const decoys = kit.vials.filter(v => v.status!=="sealed" && (v.legacyUsedMg||0)<=0.01 && v.reconDate);
  decoys.forEach(decoy => {
    const match = kit.vials.find(v => v!==decoy && v.status==="sealed" && (v.legacyUsedMg||0)>0.01);
    if (!match) return;
    const decoyStatus = decoy.status, decoyFinishedAt = decoy.finishedAt, decoyFinishReason = decoy.finishReason, decoyReconDate = decoy.reconDate;
    decoy.status = "sealed"; decoy.reconDate = null; decoy.finishedAt = null; decoy.finishReason = null;
    match.status = decoyStatus; match.reconDate = decoyReconDate; match.finishedAt = decoyFinishedAt; match.finishReason = decoyFinishReason;
    if (decoyStatus === "active") { kit.activeKit = true; kit.reconDate = match.reconDate; }
    fixedAny = true;
  });
  kit._vialsRepaired = true;
  if (fixedAny) saveState();
}

function ensureKitVials(kit) {
  if (kit.vials) { backfillVialMetadata(kit); repairVialSequenceOrder(kit); repairVialIdentityConflicts(kit); return kit.vials; }
  const vials = [];
  // reconHistory[] (one entry per vial ever opened, oldest first) is the more complete
  // legacy record when it exists — migrate from it rather than just the current
  // reconDate, so prior vials (Vial 1, Vial 2, ...) aren't lost the moment vials[] is
  // first built.
  const history = kit.reconHistory && kit.reconHistory.length ? kit.reconHistory : (kit.reconDate ? [{date:kit.reconDate}] : []);

  // Historical usage attribution — a ONE-TIME migration, not a live calculation. Doses
  // and waste logged BEFORE per-vial allocation existed have no vialId to match against;
  // bucket them into whichever vial's open window [reconDate, next reconDate) they fall
  // in, using the compound's existing kit-level attribution (kitId, or the legacy
  // single-kit fallback) as the source pool. Only untagged records are used here — a dose
  // that already carries a specific vialId is handled live by getVialRemainingMg and must
  // never be double-counted here. The result is persisted on the vial (legacyUsedMg) so
  // it never fluctuates on a later render just because unrelated data changed.
  const compUnit = cfg(kit.name)?.unit || "mg";
  const doses = (allPeptides()[kit.name]?.doses) || [];
  const sameCompoundKits = (state.supplies||[]).filter(k=>k.name===kit.name);
  const untaggedDoses = doses.filter(d=>!(d.allocations&&d.allocations.some(a=>a.vialId)) && (d.kitId===kit.id || (!d.kitId && sameCompoundKits.length===1)));
  const untaggedWaste = (kit.wasteLog||[]).filter(w=>!w.vialId && w.status!=="reversed");

  history.forEach((rh,i)=>{
    const isLast = i===history.length-1;
    const windowStart = new Date(rh.date).getTime();
    const windowEnd = isLast ? Infinity : new Date(history[i+1].date).getTime();
    const legacyDoseMg = untaggedDoses.filter(d=>{ const t=new Date(d.date).getTime(); return t>=windowStart && t<windowEnd; }).reduce((a,d)=>a+doseToMg(d.dose,compUnit),0);
    const legacyWasteMg = untaggedWaste.filter(w=>{ const t=new Date(w.date).getTime(); return t>=windowStart && t<windowEnd; }).reduce((a,w)=>a+(w.mg||0),0);
    vials.push({
      id:uid(), sequenceNumber:i+1,
      status: (isLast && kit.activeKit) ? "active" : "finished",
      reconDate:rh.date, finishedAt: isLast?(kit.finishedAt||null):null,
      expectedMg:kit.vialMg,
      finishReason: (isLast && kit.activeKit) ? null : "other",
      legacyUsedMg: Math.round((legacyDoseMg+legacyWasteMg)*100)/100,
    });
  });
  const trackedOpened = history.length;
  for (let i=trackedOpened; i<(kit.openedVials||0); i++) {
    vials.push({ id:uid(), sequenceNumber:i+1, status:"finished", reconDate:null, finishedAt:null, expectedMg:kit.vialMg, finishReason:"other", historical:true, legacyUsedMg:0 });
  }
  const sealed = Math.max(0, (kit.totalVials||0) - (kit.openedVials||0));
  for (let i=0; i<sealed; i++) vials.push({ id:uid(), status:"sealed", expectedMg:kit.vialMg });
  kit.vials = vials;
  kit._vialsRepaired = true; // freshly migrated — nothing to repair yet
  // Persist immediately — this is a one-time migration; sequence numbers and legacy usage
  // snapshots must never be regenerated on a later render.
  saveState();
  return vials;
}
function getActiveVial(kit) { return ensureKitVials(kit).find(v=>v.status==="active"||v.status==="open") || null; }
// Sealed vials with real prior history (legacyUsedMg from an earlier undo) sort first —
// reconstituting again should naturally pick the vial that already has usage recorded
// against it over one that's never been touched, so an undo-then-reconstitute cycle
// reunites with its own history instead of arbitrarily activating a fresh vial under a
// manually-matched date.
function getSealedVials(kit) {
  return ensureKitVials(kit).filter(v=>v.status==="sealed").sort((a,b)=>(b.legacyUsedMg||0)-(a.legacyUsedMg||0));
}
// A vial's own remaining — its expected starting amount minus whatever's been attributed
// specifically to IT: live vialId-tagged usage for anything logged since per-vial
// tracking existed, PLUS the persisted legacyUsedMg snapshot for anything that predates it.
function getVialRemainingMg(kit, vial) {
  // Once a vial has been migrated to inventory v2, remainingMg is the sole authoritative
  // number for it — a directly-mutated field, never re-derived. Falling through to the
  // history-based computation below for an already-migrated vial would create exactly
  // the two-competing-calculations problem the v2 model exists to eliminate; this
  // function must defer to remainingMg the instant it's present, not just when a global
  // "everything is migrated" flag says so, since migration happens lazily per-kit.
  if (vial.remainingMg !== undefined) return vial.remainingMg;
  const compUnit = cfg(kit.name)?.unit || "mg";
  const doses = (allPeptides()[kit.name]?.doses) || [];
  let used = vial.legacyUsedMg || 0;
  doses.forEach(d=>{
    if (d.fromPreparedId) return;
    if (d.allocations) { const a = d.allocations.find(al=>al.vialId===vial.id); if (a) used += doseToMg(a.amount, compUnit); }
  });
  used += (kit.wasteLog||[]).filter(w=>w.vialId===vial.id && w.status!=="reversed").reduce((a,w)=>a+(w.mg||0),0);
  // Medication drawn into a prepared syringe has already left this vial too, whether or
  // not it's since been administered — same principle as kit-level getKitUsedMg, just
  // scoped to the specific vial a prepared allocation names.
  (state.preparedDoses||[]).forEach(pd=>{
    getSyringeComponents(pd).forEach(comp=>{
      if (comp.compoundName!==kit.name) return;
      (comp.allocations||[]).forEach(a=>{ if (a.vialId===vial.id) used += doseToMg(a.amount, compUnit); });
    });
  });
  return Math.max(0, (vial.expectedMg!=null?vial.expectedMg:kit.vialMg||0) - used);
}
// Marks a specific vial finished — vial LIFECYCLE only. Never itself implies the leftover
// was administered; that's decided separately by whatever transaction (or dose
// allocation) actually accounts for the mg. Keeps the legacy aggregate fields in sync so
// every pre-existing calculation still sees the same picture.
function finishVial(kit, vial, reason) {
  // A v2 vial (remainingMg already the authoritative field) must be finished in the v2
  // vocabulary AND have its remainder actually zeroed — leaving status="finished" while
  // remainingMg still holds a nonzero leftover is exactly the kind of status-and-number
  // disagreement this model exists to eliminate. A vial that's never been migrated keeps
  // the old behavior untouched.
  //
  // Preserved onto the vial before zeroing: "Reopen Vial" exists specifically for
  // "I marked this finished too early by mistake," and needs the real leftover amount to
  // restore — which, for a v2 vial, no longer exists anywhere else once remainingMg is
  // overwritten to 0 (unlike the old history-derived model, where the number could always
  // be recomputed from history regardless of status).
  if (vial.remainingMg !== undefined) { vial._preFinishRemainingMg = vial.remainingMg; vial.status = "empty"; vial.remainingMg = 0; }
  else vial.status = "finished";
  vial.finishedAt = localDatetime();
  vial.finishReason = reason || "other";
  kit.emptyVials = (kit.emptyVials||0)+1;
  if (kit.activeKit && getActiveVial(kit)===null) kit.activeKit = false;
  kit.finishedAt = vial.finishedAt;
}
// Opens a sealed vial (or creates one if none tracked yet) and makes it active.
// Multiple simultaneously-open kits per compound is a supported, deliberate choice now —
// but it should never happen without the person noticing. Both "Open New Vial" entry
// points (the Stash button, and the mid-dose "vial's empty, open a new one" flow) call
// this before activateVial; it's a no-op straight through to proceed() in the ordinary
// case where nothing else is open.
function confirmOpenIfOtherKitOpen(kit, proceed) {
  const others = getEligibleSourceKits(kit.name).filter(x => x.kit.id !== kit.id);
  if (!others.length) { proceed(); return; }
  const otherLabel = `${others[0].kit.vialMg||"?"}mg`;
  const thisLabel = `${kit.vialMg||"?"}mg`;
  confirmAction(
    `You already have a ${esc(otherLabel)} vial open for ${esc(kit.name)} — open the ${esc(thisLabel)} one too?`,
    proceed,
    { confirmLabel: "Open both", cancelLabel: "Cancel" }
  );
}

// Finishes whatever's currently open in this kit and activates the next sealed vial, as
// ONE atomic step — for when a dose needs more than the current vial has left but the
// person isn't done with it yet (using up the remainder, not discarding it unused).
// Deliberately never leaves two vials simultaneously "open" in the same kit: getActiveVial
// only ever tracks one per kit by design, and that's what keeps vial resolution
// unambiguous everywhere else — going through the normal reconstituteVialModal flow here
// instead would risk exactly that ambiguity, since it doesn't close the old vial first.
function finishAndOpenNextVial(kit) {
  const current = getActiveVial(kit);
  if (current) {
    current.status = "empty";
    current.remainingMg = 0;
    current.finishedAt = localDatetime();
    current.finishReason = "Finished — a dose needed more than was left in this vial";
  }
  return activateVial(kit, localDatetime(), kit.bacMl, "Auto-opened to cover a dose that needed more than the previous vial had left");
}

function activateVial(kit, reconDate, bacMl, notes) {
  ensureKitVials(kit);
  let vial = getSealedVials(kit)[0];
  if (!vial) { vial = { id:uid(), status:"sealed", expectedMg:kit.vialMg }; kit.vials.push(vial); kit.totalVials = (kit.totalVials||0)+1; }
  // Stable opening-sequence number, assigned once, the first time this vial is ever
  // activated — never recomputed from array position or order on later renders.
  if (!vial.sequenceNumber) {
    const maxSeq = kit.vials.reduce((m,v)=>Math.max(m, v.sequenceNumber||0), 0);
    vial.sequenceNumber = maxSeq+1;
  }
  // Once a kit has been touched by inventory v2, every vial in it must stay in the v2
  // vocabulary going forward — writing the old "active" string here would make this
  // freshly reconstituted vial invisible to kitOpenVialV2/consumeCompoundInventory the
  // instant this same kit already has v2-migrated siblings, silently stranding whatever
  // gets logged against it next.
  const kitIsV2 = (kit.vials||[]).some(v=>v.remainingMg!==undefined);
  if (kitIsV2) { vial.status = "open"; vial.remainingMg = vial.expectedMg!=null?vial.expectedMg:(kit.vialMg||0); vial.vialMg = vial.expectedMg!=null?vial.expectedMg:(kit.vialMg||0); }
  else vial.status = "active";
  vial.reconDate = reconDate;
  vial.finishedAt = null; vial.finishReason = null;
  kit.reconDate = reconDate;
  kit.bacMl = bacMl || kit.bacMl;
  kit.reconNotes = notes;
  kit.activeKit = true;
  kit.openedVials = (kit.openedVials||0)+1;
  // Exclusivity REMOVED by explicit request: multiple kits of the same compound (e.g. a
  // 10mg-vial kit and a 30mg-vial kit) can now be simultaneously active/open. This used to
  // be force-cleared here unconditionally — that's what made "two kits at once" impossible
  // even when a person genuinely wanted it. The confirmation step now lives at the two
  // call sites (openNewVialModal, reconstituteVialModal) instead, since only they know
  // whether the person just said yes to "open this too" — activateVial itself has no way
  // to ask. getEligibleSourceKits() is what everything downstream now consults instead of
  // assuming a single activeKit.
  return vial;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY MODEL V2 — canonical vial-first inventory.
//
// Everything above this point (openedVials/emptyVials/reconHistory/legacyUsedMg,
// getKitRemainingMg, getVialRemainingMg, ensureKitVials, activateVial, finishVial) is
// the OLD model: remaining inventory re-derived every render from dose/waste/allocation
// history. It stays in the file — every existing screen (Log Dose, Prepare Dose, Combo
// Dose, Stash, Supply Planner) still calls it, and none of them have been rewired to v2
// yet. That rewiring is a deliberately separate, second pass: this domain layer needs to
// exist and be independently correct before anything is asked to depend on it.
//
// Post-migration, a vial's `remainingMg` is a directly-mutated, authoritative field.
// Nothing reads dose/waste/allocation history to compute "how much is left" for a v2
// vial — consumeCompoundInventory() is the only function allowed to change it, and it
// changes it by direct subtraction at the moment inventory actually moves, not by
// recomputing a window of history on every render.
//
// New vial shape (kit.vials[] entries, post-migration):
//   { id, kitId, sequenceNumber, status: "sealed"|"open"|"empty", vialMg, remainingMg,
//     reconDate, bacMl }

function migrateToInventoryV2() {
  if (state.inventoryModelVersion === 2) return;
  state._preV2SuppliesBackup = JSON.parse(JSON.stringify(state.supplies||[]));
  (state.supplies||[]).forEach(kit => migrateKitToV2(kit));
  state.inventoryModelVersion = 2;
  saveState();
}

// Per-kit migration — the actual conversion logic, callable either from the app-wide
// migrateToInventoryV2() above (an explicit, all-at-once action) or lazily, one kit at a
// time, the first time consumeCompoundInventory ever touches that specific kit. Screens
// not yet rewired to v2 keep working against kits nobody has touched yet, exactly as
// before, via the compatibility shims added to getVialRemainingMg/getActiveVial/etc. —
// so wiring one screen to this function never silently breaks any other screen.
// Idempotent: a kit whose vials already carry remainingMg is left untouched.
function migrateKitToV2(kit) {
  if ((kit.vials||[]).length && kit.vials.every(v=>v.remainingMg!==undefined)) return; // already migrated
  // Captured BEFORE anything below touches a single vial — this is the number the old
  // kit-level formula has been showing all along, and it's the one number in this whole
  // function guaranteed to already reflect kit-level waste/usage that was never tagged to
  // a specific vial (a "whole kit discarded" waste entry with no vialId, historical data
  // where a used vial's status was lost and it now sits mislabeled as still "sealed",
  // etc.) — real patterns found auditing an actual export, not hypothetical. The per-vial
  // computation below can only ever see what's explicitly attributed to each vial's own
  // id, so on its own it can silently overstate the true total whenever real history
  // doesn't cleanly attribute everything. oldKitTotal is the reconciliation target below.
  const oldKitTotal = getKitRemainingMg(kit);
  const legacyVials = ensureKitVials(kit);
  legacyVials.forEach(v => {
    if (v.remainingMg !== undefined) return; // this specific vial already migrated
    const legacyRemaining = getVialRemainingMg(kit, v);
    v.vialMg = v.expectedMg != null ? v.expectedMg : (kit.vialMg||0);
    v.remainingMg = Math.max(0, Math.round(legacyRemaining*100)/100);
    if (v.status === "active")       v.status = v.remainingMg <= 0.01 ? "empty" : "open";
    else if (v.status === "finished") v.status = "empty";
    if (v.status === "empty") v.remainingMg = 0;
    delete v.legacyUsedMg; delete v.finishReason; delete v.historical; delete v.expectedMg;
  });
  const openVials = legacyVials.filter(v=>v.status==="open");
  if (openVials.length > 1) {
    openVials.sort((a,b)=> new Date(b.reconDate||0) - new Date(a.reconDate||0));
    openVials.slice(1).forEach(v=>{
      if (v.remainingMg > 0.01) {
        if (!kit.wasteLog) kit.wasteLog = [];
        kit.wasteLog.push({ id:uid(), date:localDate(), loggedAt:new Date().toISOString(), mg:v.remainingMg, type:"adjustment", reason:"Migration to inventory v2: multiple simultaneously-open vials consolidated", notes:"", status:"active", vialId:v.id });
      }
      v.status = "empty"; v.remainingMg = 0;
    });
  }
  // Reconcile against oldKitTotal — never let the migrated per-vial sum exceed what the
  // trusted kit-level number already said, no matter which of the causes above produced
  // the gap. For a medication-dosing app, understating what's left is the safe direction
  // to err in; silently crediting material that untagged history says is already gone is
  // not. Deducted from sealed vials first (least-certain category, and the one real
  // audited cases actually traced back to), then the open vial only if sealed alone can't
  // absorb it — never fabricated as extra material if the sum comes out UNDER instead,
  // since inventing where missing material should go is the riskier failure mode.
  const newTotal = kitRemainingMgV2(kit);
  let excess = Math.round((newTotal - oldKitTotal)*100)/100;
  if (excess > 0.01) {
    const adjustable = [...kitSealedVialsV2(kit), ...(kitOpenVialV2(kit)?[kitOpenVialV2(kit)]:[])];
    for (const v of adjustable) {
      if (excess <= 0.01) break;
      const take = Math.min(v.remainingMg, excess);
      v.remainingMg = Math.round((v.remainingMg-take)*100)/100;
      if (v.remainingMg <= 0.01) { v.remainingMg = 0; v.status = "empty"; }
      excess = Math.round((excess-take)*100)/100;
    }
    if (!kit.wasteLog) kit.wasteLog = [];
    kit.wasteLog.push({ id:uid(), date:localDate(), loggedAt:new Date().toISOString(), mg:Math.round((newTotal-oldKitTotal)*100)/100, type:"adjustment", reason:"Migration to inventory v2: reconciled against prior kit-level total (untagged waste/usage in this kit's history couldn't be attributed to a specific vial)", notes:"", status:"active" });
  }
}

// ── Canonical derived totals — the only formulas allowed to compute these, period ──
function kitRemainingMgV2(kit) {
  return Math.round((kit.vials||[]).reduce((a,v)=>a+(v.remainingMg||0), 0) * 100) / 100;
}
function kitOpenVialV2(kit)   { return (kit.vials||[]).find(v=>v.status==="open"||v.status==="active") || null; }
function kitSealedVialsV2(kit){ return (kit.vials||[]).filter(v=>v.status==="sealed"); }
function kitEmptyVialsV2(kit) { return (kit.vials||[]).filter(v=>v.status==="empty"); }
// A vial that left inventory whole — given away, sold, sent for testing — without ever
// being consumed. Deliberately distinct from "empty": empty means its contents were
// actually used/finished; transferred means the whole physical vial is simply no longer
// in the stash. Conflating the two would misrepresent dose history (a transferred vial
// was never drawn from) and would make "X empty" read as "X used" when some of them
// never were.
function kitTransferredVialsV2(kit) { return (kit.vials||[]).filter(v=>v.status==="transferred"); }
// How many vials are still actually yours — everything except transferred (sealed, open,
// and empty all still physically belong to you; empty just means used up, not gone).
// This is the count "Total kit size," stash sorting, low-stock reminders, and supply
// forecasts must all use instead of kit.totalVials — that field is a purchase record
// (how many you originally bought) and never shrinks when one leaves your possession
// whole. Ungated by v2 migration status: transferred is a real vial status regardless of
// which remaining-mg model a kit is on.
function kitOwnedVialCount(kit) { const vials = ensureKitVials(kit); return vials.length - vials.filter(v=>v.status==="transferred").length; }

// ── THE canonical inventory-consuming function ──────────────────────────────────
// Consumes amountMg from a single kit's currently open vial only. Never reaches into a
// sealed vial on its own (reconstituting one is a real physical/user action — see
// openNextVialV2) and never crosses into a different kit (within-kit rollover is
// automatic; crossing kits is always an explicit separate decision by the caller).
// Auto-empties a vial the instant it's driven to ~0 — no separate "finish" step.
// Returns a plan/result rather than throwing when short, so the caller decides whether
// to prompt for the next vial or block the transaction outright.
function consumeCompoundInventory({ kit, amountMg, reason, transactionId }) {
  migrateKitToV2(kit); // lazy, per-kit only — never touches any other kit
  const allocations = [];
  let remaining = Math.round(amountMg*100)/100;
  const openVial = kitOpenVialV2(kit);
  if (openVial && remaining > 0.001) {
    const take = Math.min(remaining, openVial.remainingMg);
    if (take > 0.001) {
      openVial.remainingMg = Math.round((openVial.remainingMg - take)*100)/100;
      if (openVial.remainingMg <= 0.01) { openVial.remainingMg = 0; openVial.status = "empty"; }
      allocations.push({ vialId: openVial.id, kitId: kit.id, amountMg: take });
      remaining = Math.round((remaining - take)*100)/100;
    }
  }
  const committed = remaining <= 0.01;
  const result = {
    transactionId: transactionId || uid(), totalMg: amountMg, allocations,
    remainingNeeded: committed ? 0 : remaining, committed,
    hasSealedVial: kitSealedVialsV2(kit).length > 0, reason: reason || "dose",
  };
  if (committed) saveState();
  return result;
}

// Opens the next sealed vial in sequence order. Refuses if another vial is still open
// with nonzero remaining — a kit should never carry two simultaneously usable open
// vials; consumeCompoundInventory already drives the current one to empty automatically
// as part of a normal transaction before this would ever need to be called.
function openNextVialV2(kit, { reconDate, bacMl } = {}) {
  const stillOpen = kitOpenVialV2(kit);
  if (stillOpen && stillOpen.remainingMg > 0.01) {
    throw new Error(`Vial ${stillOpen.sequenceNumber||""} still has ${stillOpen.remainingMg}mg remaining — cannot open another vial while it's open.`);
  }
  const sealed = kitSealedVialsV2(kit).sort((a,b)=>(a.sequenceNumber||0)-(b.sequenceNumber||0))[0];
  if (!sealed) return null;
  sealed.status = "open";
  sealed.reconDate = reconDate || localDatetime();
  sealed.bacMl = bacMl != null ? bacMl : kit.bacMl;
  sealed.remainingMg = sealed.vialMg;
  saveState();
  return sealed;
}

// Re-enters consumeCompoundInventory with whatever's still needed after a new vial has
// been opened — same function, same rules, just continuing the same logical transaction.
function continueConsumeCompoundInventory(kit, remainingNeeded, transactionId) {
  return consumeCompoundInventory({ kit, amountMg: remainingNeeded, transactionId });
}

// Reverses a committed transaction exactly — adds each allocation's amount back onto the
// specific vial it came from, and reopens a vial that went empty as a direct result. No
// historical-window recalculation: it only undoes the specific numbers this transaction
// recorded, nothing else.
function undoConsumeCompoundInventory(kit, transactionResult) {  transactionResult.allocations.forEach(a => {
    const v = (kit.vials||[]).find(v=>v.id===a.vialId);
    if (!v) return;
    const wasEmpty = v.status === "empty";
    v.remainingMg = Math.round((v.remainingMg + a.amountMg)*100)/100;
    if (wasEmpty && v.remainingMg > 0.01) v.status = "open";
  });
  saveState();
}

// Reverses whatever inventory effect a dose record had, called right before it's deleted
// or replaced (e.g. during an edit). Deleting a dose used to be safe on its own — the old
// model re-derived "remaining" from history every render, so removing a dose record
// automatically un-counted its usage. Once a vial's remainingMg became a directly-
// mutated, authoritative field, that stopped being true: deleting a dose without this
// would permanently lose that material from the vial's number forever, with no way to
// get it back except manually editing the vial.
//
// - Administered-from-prepared doses never touched vial inventory (that happened at
//   prepare time) — reversing one just gives the prepared batch its slot back.
// - Doses with per-vial allocations (the normal case for anything logged since v2)
//   restore each allocation to its specific vial, converting from the native-unit amount
//   stored in allocations[].amount back to canonical mg.
// - Older records with only a bare kitId (predating per-vial allocation tracking) restore
//   to that kit's currently open vial as a best-effort match — the same single-current-
//   vial assumption those records were created under, rather than leaving the amount
//   unrecoverable because we don't know exactly which vial it came from.
// Re-applies a dose's inventory effect after its AMOUNT was edited: put the old amount back,
// then draw the new amount — from the vial the dose ORIGINALLY came from.
//
// The dose's ALLOCATION is the record of where it came from; a top-level kitId is only a
// legacy field. This used to trust kitId first, and a stale one (pointing at an older kit
// with no open vial) made it refuse a perfectly valid edit — "the new amount needs more than
// the open vial has" — while looking at a vial that had nothing to do with the dose. Worse,
// had that stale kit happened to have an open vial, it would have credited the right vial
// and then debited the WRONG kit, silently corrupting two vials at once.
//
// Resolves the target BEFORE touching anything, and restores exactly what it reversed on any
// failure, so a rejected edit never leaves inventory half-changed. Returns
// { ok:true, allocations } or { ok:false, message }.
function reapplyEditedDoseInventory(f, newAmountStr, unit, fallbackKit) {
  const origAlloc = f.allocations && f.allocations.length ? f.allocations[0] : null;
  const targetKit = origAlloc ? state.supplies.find(s=>s.id===origAlloc.kitId)
    : (f.kitId ? state.supplies.find(s=>s.id===f.kitId) : fallbackKit);
  if (!targetKit) return { ok:false, message:"Can't find the original kit for this dose — edit cancelled, nothing changed." };
  migrateKitToV2(targetKit);

  const isOpen = v => v && (v.status==="open" || v.status==="active");
  const origVial = origAlloc && origAlloc.vialId ? (targetKit.vials||[]).find(v=>v.id===origAlloc.vialId) : null;
  // Reversing a dose credits material back to the vial it came from — and REOPENS that vial if
  // it had been finished. If this dose came from a vial that's since been finished while
  // another vial in the kit is open now, that would leave two vials open in one kit, which is
  // exactly the state getActiveVial can't resolve (it just returns whichever is first, which
  // silently resolves to the wrong one). Refuse that specific edit up front, before anything
  // has been touched, rather than create it.
  if (origVial && !isOpen(origVial) && (targetKit.vials||[]).some(v=>v!==origVial && isOpen(v))) {
    return { ok:false, message:"This dose came from a vial that has since been finished, and another vial in the kit is open now. Changing its amount would reopen the old vial next to your current one — edit not saved. Delete and re-log this dose instead." };
  }

  reverseDoseInventoryEffect(f);
  const neededMg = doseToMg(newAmountStr, unit);
  // Draw from the vial this dose ORIGINALLY came from (it now holds its old amount again). Only a
  // legacy dose with no vial recorded falls back to the kit's open vial. Deliberately NO fallback
  // from one vial to another: after the reversal above, "the kit's open vial" can be the wrong
  // one, and spanning vials is what delete-and-re-log is for.
  const candidate = origVial || kitOpenVialV2(targetKit);
  const available = candidate && candidate.status!=="sealed" && candidate.status!=="transferred" ? candidate.remainingMg : 0;

  if (available + 0.01 < neededMg) {
    // Undo the reversal exactly — a cancelled edit must leave inventory as it was found.
    const orig = f.allocations && f.allocations.length ? f.allocations : (f.kitId ? [{kitId:f.kitId, amount:f.dose}] : []);
    orig.forEach(a=>{
      const k = state.supplies.find(s=>s.id===a.kitId);
      if (!k) return;
      migrateKitToV2(k);
      const v2 = a.vialId ? (k.vials||[]).find(v=>v.id===a.vialId) : kitOpenVialV2(k);
      if (!v2) return;
      const we = v2.status==="empty";
      v2.remainingMg = Math.max(0, Math.round((v2.remainingMg - doseToMg(a.amount, cfg(k.name).unit))*100)/100);
      if (!we && v2.remainingMg<=0.01) { v2.remainingMg = 0; v2.status = "empty"; }
    });
    // `available` was measured while the old amount was still credited back, so it already
    // counts what this dose itself used — which is the honest "most this edit could be".
    return { ok:false, message:`The new amount needs ${mgToUnit(neededMg, unit)}${unit}, but the vial this dose came from can only cover ${mgToUnit(available, unit)}${unit} (counting what this dose already used) — edit not saved. Delete and re-log this dose instead if it needs to span multiple vials.` };
  }
  const take = Math.min(neededMg, candidate.remainingMg);
  candidate.remainingMg = Math.round((candidate.remainingMg-take)*100)/100;
  if (candidate.remainingMg <= 0.01) { candidate.remainingMg = 0; candidate.status = "empty"; }
  return { ok:true, allocations:[{ kitId: targetKit.id, vialId: candidate.id, amount: mgToUnit(take, unit) }] };
}

function reverseDoseInventoryEffect(dose) {
  if (!dose) return;
  if (dose.fromPreparedId) {
    const pd = (state.preparedDoses||[]).find(p=>p.id===dose.fromPreparedId);
    if (pd) pd.remainingCount = (pd.remainingCount||0)+1;
    return;
  }
  if (dose.allocations && dose.allocations.length) {
    dose.allocations.forEach(a=>{
      const k = state.supplies.find(s=>s.id===a.kitId);
      if (!k) return;
      migrateKitToV2(k);
      const v = a.vialId ? (k.vials||[]).find(v=>v.id===a.vialId) : kitOpenVialV2(k);
      if (!v) return;
      const wasEmpty = v.status==="empty";
      v.remainingMg = Math.round((v.remainingMg + doseToMg(a.amount, cfg(k.name).unit))*100)/100;
      if (wasEmpty && v.remainingMg>0.01) v.status = "open";
    });
    return;
  }
  if (dose.kitId) {
    const k = state.supplies.find(s=>s.id===dose.kitId);
    if (!k) return;
    migrateKitToV2(k);
    const v = kitOpenVialV2(k);
    if (!v) return;
    const wasEmpty = v.status==="empty";
    v.remainingMg = Math.round((v.remainingMg + doseToMg(dose.dose, cfg(k.name).unit))*100)/100;
    if (wasEmpty && v.remainingMg>0.01) v.status = "open";
  }
}

// Deletes a prepared syringe that hasn't been (fully) administered, reversing whatever
// portion of its original allocation is still sitting unused back onto the specific
// vial(s) it came from — mirrors reverseDoseInventoryEffect's approach, but for a
// preparedDose's (possibly multi-compound) components instead of a single dose.
//
// For a batch of several identical syringes (count > 1), only the REMAINING share is
// restored: if 2 of 5 have already been administered, those already correctly left
// inventory for good the moment they were prepared, and administering them caused zero
// further inventory change (as designed) — deleting the batch record must only give back
// the 3 still-unused syringes' worth, never the full original amount.
function deletePreparedDose(pd) {
  const totalCount = pd.count || 1;
  const remainingCount = pd.remainingCount || 0;
  const shareRemaining = totalCount>0 ? remainingCount/totalCount : 0;
  if (shareRemaining > 0) {
    getSyringeComponents(pd).forEach(comp=>{
      const cc = cfg(comp.compoundName);
      (comp.allocations||[]).forEach(a=>{
        const k = state.supplies.find(s=>s.id===a.kitId);
        if (!k) return;
        migrateKitToV2(k);
        const v = a.vialId ? (k.vials||[]).find(v=>v.id===a.vialId) : kitOpenVialV2(k);
        if (!v || v.remainingMg===undefined) return; // legacy vial — removing the record itself is enough, its history-derived calculation naturally reflects the deletion
        const wasEmpty = v.status==="empty";
        v.remainingMg = Math.round((v.remainingMg + doseToMg(a.amount, cc.unit)*shareRemaining)*100)/100;
        if (wasEmpty && v.remainingMg>0.01) v.status = "open";
      });
    });
  }
  state.preparedDoses = (state.preparedDoses||[]).filter(p=>p.id!==pd.id);
}

function deletePreparedDoseModal(pd) {
  const components = getSyringeComponents(pd);
  const isMixed = components.length>1;
  const label = components.map(c=>{ const cc=cfg(c.compoundName); return `${c.compoundName} ${c.amount}${c.unit||cc.unit}`; }).join(" + ");
  const partial = (pd.count||1) > (pd.remainingCount||0) && (pd.remainingCount||0) > 0;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#ff7c7c;letter-spacing:1.5px">DELETE PREPARED SYRINGE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:14px;color:var(--t1);font-weight:600;margin-bottom:10px">${esc(label)}${isMixed?" · Mixed":""}</div>
    <div class="hint" style="margin-bottom:20px">${partial
      ? `${pd.remainingCount} of ${pd.count} left unused — deleting will return only that unused portion to the source vial(s). The ${((pd.count||1)-(pd.remainingCount||0))} already administered stay as-is in dose history.`
      : `This will return the material to the source vial(s) it was drawn from, as if it was never prepared. Nothing has been administered from it.`}</div>
    <div style="display:flex;gap:8px">
      <button id="cancel" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px">Cancel</button>
      <button id="confirm" style="flex:1;padding:11px;border-radius:10px;background:#ff7c7c;color:#000;font-weight:700;font-size:13px">Delete & Return to Vial</button>
    </div>
  `, "#ff7c7c");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#cancel").onclick = closeModal;
  m.querySelector("#confirm").onclick = () => {
    deletePreparedDose(pd);
    saveState(); closeModal(); render();
  };
}
// ═══════════════ END INVENTORY MODEL V2 (domain layer only — not yet wired to any screen) ═══════════════

// What's actually attached to a specific vial — the deciding factor for whether
// "Undo Reconstitution" can be a clean reversal or needs to explain why it can't be.
// Prepared-dose allocations only track kitId (not vialId) today, so a prepared batch
// sourced from this kit while THIS was the only/most-recent open vial is treated as
// attached to it too, conservatively — better to block and explain than to silently
// undo a reconstitution that inventory elsewhere is still relying on.
function getVialAttachments(kit, vial) {
  const doses = (allPeptides()[kit.name]?.doses)||[];
  const doseCount = doses.filter(d=>d.allocations && d.allocations.some(a=>a.vialId===vial.id)).length;
  const wasteCount = (kit.wasteLog||[]).filter(w=>w.vialId===vial.id && w.status!=="reversed").length;
  const preparedCount = (state.preparedDoses||[]).filter(pd=>pd.remainingCount>0 && getSyringeComponents(pd).some(comp=>comp.compoundName===kit.name && (comp.allocations||[]).some(a=>a.kitId===kit.id))).length;
  // A vial migrated from pre-per-vial-tracking history carries its real usage as a
  // persisted legacyUsedMg snapshot rather than live vialId-tagged records — but it's
  // just as real and just as irreplaceable. Without this check, Undo Reconstitution would
  // treat a vial with genuine historical usage as pristine, sending it back into the same
  // undifferentiated "sealed" pool as vials that have never been touched — at which point
  // reconstituting again (even with the same date typed back in) activates a DIFFERENT
  // physical vial slot, permanently orphaning the real history from view.
  const hasLegacyUsage = (vial.legacyUsedMg||0) > 0.01;
  return { doseCount, wasteCount, preparedCount, hasLegacyUsage, hasAny: doseCount>0||wasteCount>0||preparedCount>0||hasLegacyUsage };
}

// True reversal — not another adjustment layered on top. Only reachable when nothing is
// actually attached to this vial; the caller is responsible for checking first.
function undoReconstitution(kit, vial) {
  const wasActive = vial.status==="active"||vial.status==="open";
  const wasFinished = vial.status==="finished"||vial.status==="empty";
  vial.status = "sealed";
  vial.reconDate = null; vial.finishedAt = null; vial.finishReason = null;
  kit.openedVials = Math.max(0, (kit.openedVials||0)-1);
  if (wasFinished) kit.emptyVials = Math.max(0, (kit.emptyVials||0)-1);
  if (wasActive) {
    kit.activeKit = false; kit.reconDate = null; kit.bacMl = null; kit.reconNotes = null;
  }
  // Any leftover expiry alert for this vial is keyed off kit.reconDate/activeKit, both of
  // which are now cleared — the next buildReminders() pass simply won't find anything to
  // alert about, no separate cleanup step needed.
}

// Reopens a FINISHED vial back to active — for "I marked this finished too early."
// Distinct from Undo Reconstitution: this preserves the vial's reconDate and full
// transaction history (doses/waste already tagged to it), just moves it back to active
// and restores whatever the ledger says should remain. Never resets to full, never
// creates a new vial, never touches sealed count.
function reopenVial(kit, vial) {
  // A v2 vial needs BOTH the v2-vocabulary status AND its remainingMg actually restored —
  // finishVial() preserved the true pre-finish amount specifically for this moment
  // (nothing else can recover it once it's been zeroed). A vial that was finished/emptied
  // through some other path (Log Outflow, Mark Kit Done) with no preserved amount — a
  // deliberate "this is gone" action, not a mistake to walk back — simply has nothing to
  // restore, and stays at whatever it already is rather than guessing.
  if (vial.remainingMg !== undefined) {
    vial.status = "open";
    if (vial._preFinishRemainingMg !== undefined) { vial.remainingMg = vial._preFinishRemainingMg; delete vial._preFinishRemainingMg; }
  } else {
    vial.status = "active";
  }
  vial.finishedAt = null; vial.finishReason = null;
  kit.emptyVials = Math.max(0, (kit.emptyVials||0)-1);
  kit.activeKit = true;
  kit.reconDate = vial.reconDate;
}

function reopenVialModal(kitId, vialId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  const vial = ensureKitVials(s).find(v=>v.id===vialId); if(!vial) return;
  const c = cfg(s.name);
  const rem = getVialRemainingMg(s, vial);
  // Reopening a finished vial while ANOTHER one in this kit is already open would
  // recreate exactly the "two open vials at once" state fixed elsewhere this session —
  // block it here rather than silently letting it happen.
  const conflictingOpen = (s.vials||[]).find(v=>v.id!==vial.id && (v.status==="open"||v.status==="active") && (v.remainingMg===undefined || v.remainingMg>0.01));
  if (conflictingOpen) {
    const bm = openModal(`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <span class="mono" style="font-size:13px;color:#F9C87D;letter-spacing:1.5px">CAN'T REOPEN YET</span>
        <button id="x" style="color:var(--t4);font-size:18px">✕</button>
      </div>
      <div class="hint" style="margin-bottom:16px">Vial ${conflictingOpen.sequenceNumber||""} is currently open with material left in it. A kit can only have one open vial at a time — finish that one first, then this vial can be reopened.</div>
      <button id="ok" class="btn-primary" style="background:var(--surface-3);color:var(--t1)">Got it</button>
    `, "#F9C87D");
    bm.querySelector("#ok").onclick = closeModal;
    bm.querySelector("#x").onclick = closeModal;
    return;
  }
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">REOPEN VIAL</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:14px;color:var(--t1);font-weight:600;margin-bottom:10px">Reopen this vial?</div>
    <div class="hint" style="margin-bottom:20px">This vial goes back to active, using its existing reconstitution date (${vial.reconDate?fmtDate(vial.reconDate):"—"}) and history — ~${rem.toFixed(1)} ${c.unit} estimated remaining based on what's already been logged against it. It won't reset to full, and no new vial or reconstitution event is created.</div>
    <div style="display:flex;gap:8px">
      <button id="cancel" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px">Cancel</button>
      <button id="confirm" style="flex:1;padding:11px;border-radius:10px;background:${c.color};color:#000;font-weight:700;font-size:13px">Reopen Vial</button>
    </div>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#cancel").onclick = closeModal;
  m.querySelector("#confirm").onclick = () => {
    confirmOpenIfOtherKitOpen(s, () => {
      reopenVial(s, vial);
      saveState(); closeModal(); render();
    });
  };
}

// Vial actions — Edit reconstitution / Undo reconstitution. Kept as a lightweight sheet
// rather than inline buttons per vial, since these are correction actions, not routine ones.
function vialActionsMenu(kitId, vialId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  const vial = ensureKitVials(s).find(v=>v.id===vialId); if(!vial) return;
  const c = cfg(s.name);
  const isFinished = vial.status==="finished"||vial.status==="empty";
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">VIAL ACTIONS</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <button id="va-edit" style="display:block;width:100%;text-align:left;padding:13px 14px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);margin-bottom:8px;font-size:13px;color:var(--t1);font-weight:600">Edit reconstitution<div style="font-size:11px;color:var(--t4);font-weight:400;margin-top:2px">Correct the date, BAC water amount, or notes</div></button>
    <button id="va-adjust" style="display:block;width:100%;text-align:left;padding:13px 14px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);margin-bottom:8px;font-size:13px;color:var(--t1);font-weight:600">Adjust remaining amount<div style="font-size:11px;color:var(--t4);font-weight:400;margin-top:2px">Set this vial's true remaining amount directly, with a logged reason</div></button>
    ${isFinished?`<button id="va-reopen" style="display:block;width:100%;text-align:left;padding:13px 14px;border-radius:10px;background:${c.color}0d;border:1px solid ${c.color}33;margin-bottom:8px;font-size:13px;color:${c.color};font-weight:600">Reopen vial<div style="font-size:11px;color:var(--t4);font-weight:400;margin-top:2px">Marked finished too early — restore it to active, keeping its history</div></button>`:""}
    <button id="va-undo" style="display:block;width:100%;text-align:left;padding:13px 14px;border-radius:10px;background:#ff7c7c0d;border:1px solid #ff7c7c33;font-size:13px;color:#ff7c7c;font-weight:600">Undo reconstitution<div style="font-size:11px;color:var(--t4);font-weight:400;margin-top:2px">Never actually opened this vial — return it to sealed</div></button>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#va-edit").onclick = () => { closeModal(); editVialReconModal(kitId, vialId); };
  m.querySelector("#va-adjust").onclick = () => { closeModal(); adjustVialRemainingModal(kitId, vialId); };
  const reopenBtn = m.querySelector("#va-reopen");
  if (reopenBtn) reopenBtn.onclick = () => { closeModal(); reopenVialModal(kitId, vialId); };
  m.querySelector("#va-undo").onclick = () => { closeModal(); undoReconstitutionModal(kitId, vialId); };
}

// Kit-level maintenance actions (finish vial, log outflow, finish kit, delete kit) — these
// used to render as a permanent stacked column of buttons on every expanded kit card, taking
// real vertical space for actions used a handful of times per vial. Same information, same
// destinations, now reached through one ⋯ tap instead of four always-visible buttons — this
// menu is the ONLY place that content moved to, nothing about what these actions do changed.
function manageKitMenu(kitId) {
  const s = state.supplies.find(x => x.id === kitId);
  if (!s) return;
  const c = cfg(s.name);
  const isBlend = !!s.isBlend;
  const isDone = s.kitStatus === "done";
  const hasOpen = !!s.reconDate && !!s.activeKit && !isDone;
  const hasRecon = !!s.reconDate;
  const sealed = getSealedVials(s).length;
  // Never route blend kits through standard-vial functions: they have their own
  // dose log, composition and reconstitution semantics.
  const actions = [
    {
      label: "VIAL & INVENTORY",
      entries: isBlend ? [
        ...(hasRecon ? [{id:"blend-dose",name:"Log blend dose",desc:"Use the existing blend-specific dose workflow",icon:"◈"}] : [])
      ] : [
        ...(!isDone && sealed > 0 ? [{id:"open",name:hasRecon?"Open another vial":"Open a vial",desc:"Open or reconstitute an available sealed vial",icon:"+"}] : []),
        ...(hasRecon ? [{id:"prepare",name:"Prepare doses",desc:"Use the existing preparation and stock-allocation flow",icon:"◌"}] : []),
        ...(hasOpen ? [{id:"finish-vial",name:"Finish this vial",desc:"Keep sealed backup vials in the kit",icon:"✓"},{id:"add-to-open",name:"Add to open vial",desc:"Record a physical addition with inventory accounting",icon:"+"}] : []),
        {id:"restock",name:"Add vials",desc:"Add sealed inventory to this existing kit",icon:"+"},
        ...(hasRecon ? [{id:"outflow",name:"Log outflow",desc:"Record unused, transferred or discarded amount",icon:"↗"}] : [])
      ]
    },
    {
      label:"KIT & RECORDS",
      entries: [
        {id:"edit",name:"Edit kit",desc:isBlend?"Edit blend composition and metadata":"Change kit metadata without rewriting vial history",icon:"✎"},
        {id:"details",name:"Kit details & history",desc:isBlend?"Composition and kit information":"Inventory, vial and dose history",icon:"▤"},
        ...(!isBlend ? [{id:"intel",name:"Compound intel",desc:"View existing compound insights",icon:"ⓘ"}] : []),
        ...(isBlend ? [] : isDone ? [{id:"reopen",name:"Reopen kit",desc:"Return a finished kit to inventory",icon:"↺"}] : [{id:"finish-kit",name:"Finish this kit",desc:"Record completion or discard using existing checks",icon:"✓"}])
      ]
    },
    {
      label:"DANGER ZONE",
      entries:[{id:"delete",name:"Delete kit",desc:"Permanent removal — confirmation required",icon:"×",danger:true}]
    }
  ];
  const icon = item => '<span aria-hidden="true" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:11px;background:var(--surface-2);font-size:18px;flex-shrink:0;color:'+(item.danger?'#ff8585':'var(--t2)')+'">'+item.icon+'</span>';
  const m = openModal(
    '<div class="nx-stash-sheet" data-kit="'+esc(String(kitId))+'">'+
    '<div aria-hidden="true" style="width:34px;height:4px;border-radius:8px;background:var(--border);margin:0 auto 16px"></div>'+
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">'+
    '<div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700;color:var(--t1)">Kit actions</div>'+
    '<div style="font-size:12px;color:var(--t4);margin-top:4px">'+esc(s.name)+(isBlend?' · Blend':' · '+(hasOpen?'Open':isDone?'Finished':'Stored'))+'</div></div>'+
    '<button type="button" id="x" aria-label="Close kit actions" style="width:44px;height:44px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2);color:var(--t2);font-size:20px">×</button></div>'+
    actions.map(group=>'<section style="margin:0 0 14px">'+
      '<div class="mono" style="font-size:10px;letter-spacing:1.2px;color:var(--t4);margin:0 0 8px 3px">'+group.label+'</div>'+
      group.entries.map(item=>
        '<button type="button" class="nx-stash-action" data-action="'+item.id+'" style="width:100%;min-height:58px;border:0;background:transparent;padding:8px 4px;display:flex;align-items:center;gap:12px;text-align:left;border-radius:12px">'+
        icon(item)+'<span style="min-width:0;flex:1"><span style="display:block;font-size:13.5px;font-weight:650;color:'+(item.danger?'#ff8585':'var(--t1)')+'">'+item.name+'</span>'+
        '<span style="display:block;font-size:11px;line-height:1.4;margin-top:3px;color:var(--t4)">'+item.desc+'</span></span>'+
        '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:var(--t4);flex-shrink:0"><path d="m9 18 6-6-6-6"/></svg></button>'
      ).join('')+'</section>').join('')+
    '</div>', c.color);
  m.querySelector("#x").onclick=closeModal;
  const openDetails=()=>{
    closeModal();
    const card=Array.from(document.querySelectorAll(".nx-kit-card[data-kit-id]")).find(el=>el.dataset.kitId===String(kitId));
    if(!card){showErrorBanner("Kit details are unavailable in this Stash view.");return;}
    const details=card.querySelector("details");
    if(details){details.open=true;card.scrollIntoView({block:"nearest",behavior:"smooth"});details.querySelector("summary")?.focus();}
  };
  m.querySelectorAll(".nx-stash-action").forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.action;
    if(id==="details"){openDetails();return;}
    closeModal();
    if(id==="open") { if(!isBlend) openNewVialModal(kitId); }
    else if(id==="blend-dose") logBlendDoseModal(kitId);
    else if(id==="prepare") prepareDosesModal(s.name);
    else if(id==="finish-vial") finishVialModal(kitId);
    else if(id==="add-to-open") addToOpenVialModal(kitId);
    else if(id==="restock") addVialsModal(kitId);
    else if(id==="outflow") logWasteModal(kitId);
    else if(id==="edit") { if(isBlend) addBlendKitModal(s); else supplyModal(s); }
    else if(id==="intel") { state._intelReturn={tab,_aminoSub:state._aminoSub,_learnSub:state._learnSub,_discoverOpen:state._discoverOpen}; state._compoundIntel=s.name; tab="trends"; render(); window.scrollTo(0,0); }
    else if(id==="finish-kit") markKitDoneModal(kitId);
    else if(id==="reopen") { s.kitStatus=null; saveState(); renderBody(); }
    else if(id==="delete") confirmAction("Delete this kit? This can't be undone.",()=>{
      const kit=state.supplies.find(x=>x.id===kitId);
      if(kit){
        const othersExist=state.supplies.some(x=>x.id!==kitId&&x.name===kit.name);
        if(!othersExist){
          if(state.peptides[kit.name])state.peptides[kit.name].status="archived";
          else if(state.customPeptides[kit.name])state.customPeptides[kit.name].status="archived";
        }
      }
      state.supplies=state.supplies.filter(x=>x.id!==kitId);
      saveState();render();
    });
  });
}

// Restocking an existing kit — buying more of the same product later — previously had no
// path at all: Edit Kit explicitly disables NUMBER OF VIALS and MG PER VIAL once a kit
// exists, so the only option was creating a whole new "kit" for what's really the same
// product, fragmenting Stash into duplicate cards. This adds sealed vials directly to the
// kit that already exists. A different mg/vial than what's already here is allowed (this
// codebase already handles a kit holding vials of different strengths correctly — see
// activateVial's per-vial vialMg locking) but flagged, since it usually means what's
// actually being added is a genuinely different product that deserves its own kit instead.
// Pours a sealed vial's worth of powder into the vial that's already open — a real,
// common practice for someone who isn't done with the current vial and doesn't want a
// second one open. Distinct from both Add Vials (adds a NEW sealed vial to the count) and
// Adjust Remaining Amount (corrects a data error) — this is a genuine physical addition to
// the one vial already in use. Expands both remainingMg and vialMg together so the
// progress bar/fraction stays meaningful (e.g. 5.2/10mg after adding a 5mg vial to 0.2mg
// left), and — when the addition came from one of this kit's own sealed vials, the normal
// case — removes that vial from the count so it isn't double-counted as both "added" and
// "still sealed."
// A sealed vial is only removed from the count when its contents are poured into the open one. A
// partial amount (anything under ~90% of a vial) can't be a whole vial's worth, so removing a whole
// vial for it is almost certainly a mistake — the box starts ticked, and used to stay ticked.
function addToOpenVialWouldOverRemove(addMg, kitVialMg, fromSealed) {
  return !!fromSealed && kitVialMg > 0 && addMg < kitVialMg * 0.9;
}
// Applies the addition and returns what's needed to undo it exactly.
function applyAddToOpenVial(kit, vial, addMg, fromSealed) {
  const snap = { beforeRemaining: vial.remainingMg, beforeVialMg: vial.vialMg, removedSealedId: null };
  vial.remainingMg = Math.round((vial.remainingMg + addMg)*100)/100;
  vial.vialMg = Math.round((vial.vialMg + addMg)*100)/100;
  if (fromSealed) {
    const sealedVial = ensureKitVials(kit).find(v=>v.status==="sealed");
    if (sealedVial) { snap.removedSealedId = sealedVial.id; kit.vials = kit.vials.filter(v=>v.id!==sealedVial.id); kit.totalVials = Math.max(0,(kit.totalVials||0)-1); }
  }
  if (!kit.wasteLog) kit.wasteLog = [];
  // The amount is always MILLIGRAMS (the field is "MG TO ADD") — this used to print it with the
  // compound's own unit, so 0.4mg on an mcg-dosed compound was logged as "0.4mcg", off by 1000x.
  kit.wasteLog.push({ id: uid(), date: localDate(), loggedAt: new Date().toISOString(), mg: -addMg, type: "addition",
    reason: `Added ${addMg}mg to the open vial${fromSealed?" (from a sealed vial, now removed from count)":""} — not done with it yet, chose not to open a separate one.`,
    notes: "", status: "active", vialId: vial.id });
  return snap;
}
function undoAddToOpenVial(kit, vial, snap) {
  vial.remainingMg = snap.beforeRemaining; vial.vialMg = snap.beforeVialMg;
  if (snap.removedSealedId && !kit.vials.find(v=>v.id===snap.removedSealedId)) {
    kit.vials.push({ id: snap.removedSealedId, status:"sealed", vialMg: kit.vialMg, remainingMg: kit.vialMg });
    kit.totalVials = (kit.totalVials||0)+1;
  }
  kit.wasteLog.pop(); // removes the addition-audit entry just added — it's the last one
}

function addToOpenVialModal(kitId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  migrateKitToV2(s);
  const vial = getActiveVial(s);
  if (!vial) { showErrorBanner("No open vial to add to — open one first."); return; }
  const c = cfg(s.name);
  const sealedCount = ensureKitVials(s).filter(v=>v.status==="sealed").length;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">ADD TO OPEN VIAL</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:16px">Pours more ${esc(s.name)} into the vial you already have open (currently ${vial.remainingMg}mg left) — instead of opening a separate one.</div>
    <label class="field-label">MG TO ADD</label>
    <input id="atv-mg" type="number" min="0" step="0.01" class="inp" value="${s.vialMg||''}" style="margin-bottom:14px">
    <label style="display:flex;align-items:center;gap:10px;margin-bottom:6px;font-size:13px;color:var(--t3)">
      <input id="atv-fromsealed" type="checkbox" ${sealedCount>0?"checked":""} ${sealedCount>0?"":"disabled"} style="accent-color:${c.color}">
      This came from one of my sealed vials${sealedCount>0?` (${sealedCount} available)`:" (none sealed right now)"}
    </label>
    <div id="atv-hint" style="font-size:10px;color:var(--t5);margin-bottom:18px">Checked: removes one sealed vial from your count, since its powder is now in this one. Unchecked: just adds the mg (e.g. a vial you hadn't logged into Nexus yet).</div>
    <button id="atv-save" class="btn-primary" style="background:${c.color}">Add to Open Vial</button>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;

  // The "came from a sealed vial" box removes a WHOLE sealed vial from the count. It starts ticked
  // (right for the default amount, a full vial), but it used to stay ticked after the amount was
  // changed to something small — so adding 0.4mg silently deleted an entire 5mg sealed vial from
  // inventory. A partial amount can't be a whole vial's worth, so editing it unticks the box.
  const atvMg = m.querySelector("#atv-mg"), atvBox = m.querySelector("#atv-fromsealed"), atvHint = m.querySelector("#atv-hint");
  const atvHintDefault = atvHint.textContent;
  atvMg.oninput = () => {
    const v = parseFloat(atvMg.value);
    if (!atvBox.disabled && v > 0 && addToOpenVialWouldOverRemove(v, s.vialMg, true)) {
      atvBox.checked = false;
      atvHint.textContent = `That's less than a whole ${s.vialMg}mg vial, so no sealed vial will be removed — this just adds ${v}mg to the open one. Tick the box again only if you poured an entire sealed vial in.`;
    } else {
      atvHint.textContent = atvHintDefault;
    }
  };

  const commitAdd = (addMg, fromSealed) => {
    const snap = applyAddToOpenVial(s, vial, addMg, fromSealed);
    saveState(); closeModal(); render();
    showUndoToast(`Added ${addMg}mg to open ${esc(s.name)} vial · Undo`, () => { undoAddToOpenVial(s, vial, snap); saveState(); render(); });
  };
  m.querySelector("#atv-save").onclick = () => {
    const addMg = parseFloat(atvMg.value);
    if (!addMg || addMg <= 0) { showErrorBanner("Enter a valid mg amount."); return; }
    const fromSealed = atvBox.checked && sealedCount > 0;
    if (addToOpenVialWouldOverRemove(addMg, s.vialMg, fromSealed)) {
      // Still ticked with a partial amount: confirm before deleting a whole vial from inventory.
      confirmAction(
        `You're adding ${addMg}mg, but this will remove a whole sealed ${s.vialMg}mg vial from your count. Remove the sealed vial too?`,
        () => commitAdd(addMg, true),
        { confirmLabel: "Yes, remove the vial", cancelLabel: "Go back" }
      );
      return;
    }
    commitAdd(addMg, fromSealed);
  };
}

function addVialsModal(kitId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  migrateKitToV2(s);
  const c = cfg(s.name);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">ADD VIALS</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:16px">Adds sealed vials to this ${esc(s.name)} kit — for restocking the same product. A genuinely different product or strength is usually clearer as its own kit (Stash → Add Kit).</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label class="field-label">NUMBER OF VIALS</label><input id="av-count" type="number" min="1" step="1" class="inp" value="1" style="margin-bottom:14px"></div>
      <div><label class="field-label">MG PER VIAL</label><input id="av-mg" type="number" step="0.01" class="inp" value="${s.vialMg||''}" style="margin-bottom:14px"></div>
    </div>
    <div id="av-mismatch" style="display:none;background:#F9C87D11;border:1px solid #F9C87D44;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:12px;color:#F9C87D"></div>
    <label class="field-label">ADDITIONAL COST (optional)</label>
    <input id="av-cost" type="number" step="0.01" class="inp" placeholder="e.g. 100.00" style="margin-bottom:18px">
    <button id="av-save" class="btn-primary" style="background:${c.color}">Add to This Kit</button>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  const mgInput = m.querySelector("#av-mg");
  const mismatchBox = m.querySelector("#av-mismatch");
  const checkMismatch = () => {
    const v = parseFloat(mgInput.value);
    if (s.vialMg && v && Math.abs(v - s.vialMg) > 0.001) {
      mismatchBox.style.display = "block";
      mismatchBox.textContent = `This kit's existing vials are ${s.vialMg}mg each — these new ones would be ${v}mg. They'll still be tracked correctly (each vial keeps its own strength), but if this is really a separate product, a new kit would keep Stash clearer.`;
    } else {
      mismatchBox.style.display = "none";
    }
  };
  mgInput.oninput = checkMismatch;
  m.querySelector("#av-save").onclick = () => {
    const count = parseInt(m.querySelector("#av-count").value);
    const mg = parseFloat(mgInput.value);
    if (!count || count<1) { showErrorBanner("Enter at least 1 vial."); return; }
    if (!mg || mg<=0) { showErrorBanner("Enter a valid mg per vial."); return; }
    const cost = parseFloat(m.querySelector("#av-cost").value)||0;
    const addedIds = [];
    s.vials = s.vials || [];
    for (let i=0;i<count;i++) {
      const v = { id: uid(), status: "sealed", vialMg: mg, remainingMg: mg };
      s.vials.push(v);
      addedIds.push(v.id);
    }
    s.totalVials = (s.totalVials||0) + count;
    s.vialMg = mg; // kit-level value tracks the most recently added strength, same as activateVial already treats it
    if (cost) s.cost = (parseFloat(s.cost)||0) + cost;
    saveState(); closeModal(); render();
    showUndoToast(`Added ${count} vial${count===1?"":"s"} to ${esc(s.name)} · Undo`, () => {
      s.vials = (s.vials||[]).filter(v => !addedIds.includes(v.id));
      s.totalVials = Math.max(0, (s.totalVials||0) - count);
      if (cost) s.cost = Math.max(0, (parseFloat(s.cost)||0) - cost);
      saveState(); render();
    });
  };
}

// Direct correction tool — for exactly the situation that motivated it: some other action
// (a bug, a manual miscount, an outflow logged against the wrong vial) left a vial's
// remainingMg not matching what's physically true, and there's no transaction to "undo"
// that would fix it — the true number just needs to be set, with an honest record of why.
// Deliberately NOT a silent overwrite: it always logs the delta as a wasteLog "adjustment"
// entry, same as every other correction path this session, so the audit trail stays
// truthful even when the correction itself isn't a normal consumption event.
function adjustVialRemainingModal(kitId, vialId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  migrateKitToV2(s);
  const vial = (s.vials||[]).find(v=>v.id===vialId); if(!vial || vial.remainingMg===undefined) return;
  const c = cfg(s.name);
  const capMg = vial.vialMg!=null ? vial.vialMg : (s.vialMg||0);
  // Vial capacity/remaining is always plain mg, matching vial.remainingMg's own scale and
  // the "KIT TOTAL: X/Y mg" display everywhere else — never the compound's dose unit
  // (mcg for BPC-157 etc.), which is a different scale for a different kind of number.
  // The Log Outflow whole-vial fix hit this exact same mistake; repeating it here would
  // have made "4.49" silently become 0.00449mg.
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">ADJUST REMAINING AMOUNT</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:16px">Nexus currently shows <b>${vial.remainingMg.toFixed(2)}mg</b> remaining in this vial (capacity: ${capMg}mg). Set what's actually true — the difference is logged as an adjustment, not silently overwritten.</div>
    <label class="field-label">ACTUAL REMAINING AMOUNT (mg)</label>
    <input id="adj-amount" type="number" step="0.01" class="inp" value="${vial.remainingMg.toFixed(2)}" style="margin-bottom:14px">
    <label class="field-label">WHY (required)</label>
    <textarea id="adj-reason" class="inp" placeholder="e.g. Correcting inventory bug — vial was wrongly marked empty by a Log Outflow issue" style="min-height:60px;resize:vertical;margin-bottom:18px"></textarea>
    <button id="adj-save" class="btn-primary" style="background:${c.color}">Save Correction</button>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#adj-save").onclick = () => {
    const newMgRaw = parseFloat(m.querySelector("#adj-amount").value);
    const reasonText = m.querySelector("#adj-reason").value.trim();
    if (isNaN(newMgRaw) || newMgRaw<0) { showErrorBanner("Enter a valid amount, 0 or more."); return; }
    if (!reasonText) { showErrorBanner("A reason is required for a manual inventory correction — this becomes part of your audit trail."); return; }
    const newMg = Math.min(capMg, newMgRaw);
    const deltaMg = Math.round((newMg - vial.remainingMg)*100)/100;
    const wasEmptyOrTransferred = vial.status==="empty"||vial.status==="transferred";
    vial.remainingMg = Math.round(newMg*100)/100;
    if (vial.remainingMg <= 0.01) { vial.remainingMg = 0; if (vial.status!=="sealed") vial.status = "empty"; }
    else if (wasEmptyOrTransferred) { vial.status = "open"; }
    if (!s.wasteLog) s.wasteLog = [];
    s.wasteLog.push({
      id: uid(), date: localDate(), loggedAt: new Date().toISOString(), mg: Math.abs(deltaMg), type: "adjustment",
      reason: `Manual correction: ${reasonText}`, notes: `${deltaMg<0?"Reduced":"Increased"} by ${Math.abs(deltaMg).toFixed(2)}mg — set to ${newMg.toFixed(2)}mg`,
      status: "active", vialId: vial.id,
    });
    saveState(); closeModal(); render();
  };
}

function editVialReconModal(kitId, vialId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  const vial = ensureKitVials(s).find(v=>v.id===vialId); if(!vial) return;
  const c = cfg(s.name);
  const isActiveVial = vial.status==="active"||vial.status==="open";
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">EDIT RECONSTITUTION</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <label class="field-label">RECONSTITUTION DATE</label>
    <input id="ev-date" type="date" class="inp" value="${dayKey(vial.reconDate)}" style="margin-bottom:14px">
    ${isActiveVial?`<label class="field-label">BAC WATER ADDED (mL)</label>
    <input id="ev-bac" type="number" step="0.1" class="inp" value="${esc(s.bacMl||"")}" style="margin-bottom:14px">`:""}
    <button id="ev-save" class="btn-primary" style="background:${c.color}">Save Changes</button>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#ev-save").onclick = () => {
    const newDate = m.querySelector("#ev-date").value;
    vial.reconDate = newDate;
    if (isActiveVial) {
      s.reconDate = newDate;
      const bacInput = m.querySelector("#ev-bac");
      if (bacInput) s.bacMl = parseFloat(bacInput.value)||s.bacMl;
    }
    saveState(); closeModal(); render();
  };
}

// True undo — only offered as a one-tap action when nothing is attached to this vial. If
// something is (a dose, prepared allocation, or outflow already references it), this
// explains why and points to the right correction path instead of silently corrupting
// those records.
function undoReconstitutionModal(kitId, vialId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  const vial = ensureKitVials(s).find(v=>v.id===vialId); if(!vial) return;
  const c = cfg(s.name);
  const att = getVialAttachments(s, vial);

  if (att.hasAny) {
    const reasons = [];
    if (att.doseCount) reasons.push(`${att.doseCount} logged dose${att.doseCount===1?"":"s"} drawn from it`);
    if (att.preparedCount) reasons.push(`${att.preparedCount} prepared dose${att.preparedCount===1?"":"s"} sourced from this kit while it was open`);
    if (att.wasteCount) reasons.push(`${att.wasteCount} outflow/reconciliation transaction${att.wasteCount===1?"":"s"}`);
    if (att.hasLegacyUsage) reasons.push(`${(vial.legacyUsedMg||0).toFixed(1)}${c.unit} of real historical usage recorded against it`);
    const bm = openModal(`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <span class="mono" style="font-size:13px;color:#F9C87D;letter-spacing:1.5px">CAN'T UNDO DIRECTLY</span>
        <button id="x" style="color:var(--t4);font-size:18px">✕</button>
      </div>
      <div class="hint" style="margin-bottom:14px">This vial can't be simply undone because it already has:</div>
      <ul style="margin:0 0 16px 18px;padding:0;font-size:13px;color:var(--t2);line-height:1.7">${reasons.map(r=>`<li>${esc(r)}</li>`).join("")}</ul>
      <div class="hint" style="margin-bottom:16px">${att.hasLegacyUsage && !att.doseCount && !att.wasteCount && !att.preparedCount
        ? "This vial's history predates per-dose vial tracking, so its usage lives as a single recorded total rather than individual entries — but it's real and can't be safely reset. If this vial genuinely was never reconstituted, use Finish Vial instead and log the full amount as a discrepancy, which keeps the history intact rather than erasing it."
        : "Undoing without reversing those first would leave dose or outflow records pointing at a vial that no longer exists. Undo or delete each of those individually first (from dose history or this vial's outflow list) — once nothing references it, Undo Reconstitution becomes available here."}</div>
      <button id="ok" class="btn-primary" style="background:var(--surface-3);color:var(--t1)">Got it</button>
    `, "#F9C87D");
    bm.querySelector("#ok").onclick = closeModal;
    bm.querySelector("#x").onclick = closeModal;
    return;
  }

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#ff7c7c;letter-spacing:1.5px">UNDO RECONSTITUTION</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:14px;color:var(--t1);font-weight:600;margin-bottom:10px">Return this vial to sealed?</div>
    <div class="hint" style="margin-bottom:20px">This will remove its reconstitution record, change it back to Sealed, restore the kit's sealed/open vial counts, and clear any expiry tracking for it. Nothing has been drawn or logged from this vial yet, so this is a full reversal — not an adjustment.</div>
    <div style="display:flex;gap:8px">
      <button id="cancel" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px">Cancel</button>
      <button id="confirm" style="flex:1;padding:11px;border-radius:10px;background:#ff7c7c;color:#000;font-weight:700;font-size:13px">Undo Reconstitution</button>
    </div>
  `, "#ff7c7c");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#cancel").onclick = closeModal;
  m.querySelector("#confirm").onclick = () => {
    undoReconstitution(s, vial);
    saveState(); closeModal(); render();
  };
}

// Prepared inventory still outstanding (not yet administered or discarded) for a
// compound — optionally scoped to a SPECIFIC KIT via its actual source allocations, not
// just compound name. Without kitId, a prepared dose is credited to whichever kit(s) it
// actually drew from; with kitId, only the portion genuinely sourced from that kit
// counts. This is what makes a kit that's never had a vial opened correctly show nothing
// prepared, even when a sibling kit of the same compound has material waiting to log.
function getPreparedRemainingMg(compoundName, kitId) {
  const unit = cfg(compoundName)?.unit || "mg";
  return (state.preparedDoses||[]).reduce((a,pd)=>{
    if ((pd.remainingCount||0)<=0) return a;
    const comp = getSyringeComponents(pd).find(c=>c.compoundName===compoundName);
    if (!comp) return a;
    if (kitId!=null) {
      // comp.allocations[].amount is the WHOLE BATCH total (count syringes' worth
      // combined) — the same field, same semantics, as everywhere else this session that
      // reads prepared-dose allocations. Multiplying it by remainingCount again treats an
      // already-total number as if it were per-syringe, which is exactly how 2 syringes
      // at 60mg each (batch total 120mg, remainingCount 2) became "240mg ready to log."
      // The correct remaining share is the batch total scaled by what fraction of the
      // batch is still unused — remainingCount / count — not remainingCount alone.
      const batchTotalFromThisKit = (comp.allocations||[]).filter(al=>al.kitId===kitId).reduce((s,al)=>s+doseToMg(al.amount, comp.unit||unit),0);
      return a + batchTotalFromThisKit * ((pd.remainingCount||0) / (pd.count||1));
    }
    return a + doseToMg(comp.amount, comp.unit||unit)*pd.remainingCount;
  }, 0);
}
function getPreparedRemainingCount(compoundName, kitId) {
  return (state.preparedDoses||[]).filter(pd=>{
    if ((pd.remainingCount||0)<=0) return false;
    const comp = getSyringeComponents(pd).find(c=>c.compoundName===compoundName);
    if (!comp) return false;
    if (kitId!=null) return (comp.allocations||[]).some(al=>al.kitId===kitId);
    return true;
  }).reduce((a,pd)=>a+Math.max(0,pd.remainingCount||0),0);
}
function getTotalUsableMg(compoundName) {
  const kits = (state.supplies||[]).filter(k=>k.name===compoundName);
  return kits.reduce((a,k)=>a+getKitRemainingMg(k),0) + getPreparedRemainingMg(compoundName);
}
// Smart split-vial allocation — given a needed amount and the compound's kits (active
// first, then any other kit with remaining material), greedily fills from the kit with
// the least remaining first (use up partial vials before cracking into a fuller one),
// stopping once the amount is covered. Returns null if total available < needed.
// Every kit of this compound that currently has an OPEN vial with material left — the
// actual set of eligible dose sources now that more than one kit can be active for the
// same compound at once (e.g. a 10mg-vial kit and a 30mg-vial kit open simultaneously).
// activeKit no longer implies "the only one" — it just means "currently open," and a
// compound can have several.
function getEligibleSourceKits(name) {
  return (state.supplies||[]).filter(s=>s.name===name && s.activeKit)
    .map(s => { migrateKitToV2(s); return { kit: s, vial: getActiveVial(s) }; })
    .filter(x => x.vial && getVialRemainingMg(x.kit, x.vial) > 0.01);
}
// Which kit to default to when more than one is eligible: the person's own last choice
// for this compound, if it's still valid — otherwise the one with the LEAST remaining, a
// "finish this one first" default that matches suggestAllocation's own fill order below.
function defaultSourceKit(name) {
  const eligible = getEligibleSourceKits(name);
  if (!eligible.length) return null;
  const remembered = state.lastSourceKit?.[name];
  const rememberedMatch = remembered!=null ? eligible.find(x=>x.kit.id===remembered) : null;
  if (rememberedMatch) return rememberedMatch;
  return eligible.slice().sort((a,b)=>getVialRemainingMg(a.kit,a.vial)-getVialRemainingMg(b.kit,b.vial))[0];
}
function rememberSourceKit(name, kitId) {
  state.lastSourceKit = state.lastSourceKit || {};
  state.lastSourceKit[name] = kitId;
}

function suggestAllocation(compoundName, neededAmount, unit) {
  const neededMg = doseToMg(neededAmount, unit);
  if (neededMg<=0) return [];
  // Only kits with an actual OPEN vial are physically drawable — a sealed kit's
  // "remaining" equals its full vialMg (nothing's been used yet), which made it look like
  // valid available inventory here even though nobody's reconstituted it. Drawing from it
  // silently would record medication as used from a vial that was never opened.
  //
  // And within a kit that DOES have an open vial, only that vial's own remainder counts
  // here — not the kit's total including its own sealed backups. A kit can hold several
  // physical vials; the ones still sealed require an explicit reconstitution action this
  // function has no business triggering on its own. Summing them into "available" was
  // exactly the same overstatement already found and fixed for Log Dose and Prepare
  // Dose's own row population, just one level removed — this is the shared function all
  // four of those (and Mixed Syringe's add/re-select) ultimately call through.
  const kits = (state.supplies||[]).filter(k=>k.name===compoundName && k.activeKit)
    .map(k=>({ kit:k, vial: getActiveVial(k) }))
    .filter(x=>x.vial && getVialRemainingMg(x.kit, x.vial)>0.001)
    .sort((a,b)=>getVialRemainingMg(a.kit,a.vial)-getVialRemainingMg(b.kit,b.vial));
  let left = neededMg;
  const allocations = [];
  for (const {kit, vial} of kits) {
    if (left<=0.001) break;
    const avail = getVialRemainingMg(kit, vial);
    const take = Math.min(avail, left);
    // Convert back to the compound's own requested unit before returning — everything
    // downstream (the allocation panel's row inputs, dose.allocations, getKitUsedMg's
    // doseToMg(amount, unit) call) expects a native-unit amount, not raw internal mg.
    allocations.push({ kitId: kit.id, kitName: kit.name, vialId: vial.id, amount: mgToUnit(take, unit) });
    left -= take;
  }
  if (left>0.001) return null; // not enough total inventory in currently OPEN vials — opening another vial is the correct next step, not silently drawing from a sealed one
  return allocations;
}

// ── Day rollover ───────────────────────────────────────────────────────────────
// How many hours past midnight a person's "day" actually ends — for someone who takes a
// bedtime dose at 12:40 AM, that shot belongs to the day they're still in, not the next one.
// 0 (the default) is plain midnight and makes everything below behave EXACTLY as it always
// has. Wrapped in try/catch because `state` is read before it exists during first load.
//
// The STORED timestamp is never altered — a 12:40 AM dose is saved as 12:40 AM. This only
// changes which DAY it is counted toward, so history, curves and timing stats keep the true
// clock time while adherence sees the day you were actually living.
const dayRolloverHours = () => {
  try { const h = Number(state && state.settings && state.settings.dayRolloverHour); return h > 0 && h <= 12 ? h : 0; }
  catch (e) { return 0; }
};
const shiftedDayKey = (d, R) => {
  // Date-only strings (YYYY-MM-DD) must NOT go through new Date() — that parses as UTC midnight
  // which shifts to the previous day in negative-offset timezones (e.g. Toronto UTC-4/UTC-5).
  // They also carry no time-of-day to roll over, so they are returned as-is.
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = R ? new Date(new Date(d).getTime() - R*3600000) : new Date(d);
  return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');
};
const dayKey = d => shiftedDayKey(d, dayRolloverHours());
// The plain calendar day of a timestamp, ignoring the rollover setting.
const calendarDayKey = d => shiftedDayKey(d, 0);
// The real calendar date right now, ignoring rollover — only for building real timestamps.
const realLocalDate = () => { const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
// "Today" as the person lives it: before the rollover hour it is still yesterday.
// The person's "now": the real moment shifted back by the rollover hours. Screens that show "this week"
// or "this month" anchor to this, so between midnight and the rollover hour they still show the period
// their day belongs to (e.g. early Sunday morning is still last week's Saturday).
const logicalNow = () => new Date(Date.now() - dayRolloverHours()*3600000);
const localDate = () => { const R=dayRolloverHours(); const d=new Date(R ? Date.now()-R*3600000 : Date.now()); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
// A REAL timestamp: real date + real clock time. Must never use the rolled-over date, or a
// dose logged at 12:40 AM would be stamped as 12:40 AM of the previous day.
const localDatetime = () => { const d=new Date(); return realLocalDate()+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); };
// Slot times and dose times live on one shifted clock: any time of day earlier than the
// rollover hour belongs to the END of the previous day, so it counts as 24h+ on that day's
// clock. Keeps a 12:40 AM dose closest to the late-evening slot it satisfies (not the 9 AM one).
const logicalMinutes = t => { const m = timeToMinutes(t); const R = dayRolloverHours(); return (R && m < R*60) ? m + 1440 : m; };
// The real moment a slot at time `t` on logical day `dk` occurs: a time before the rollover
// hour falls on the next calendar day.
// Which day a DOSE counts toward. A dose logged between midnight and the rollover hour counts
// toward the PREVIOUS day only if that day was a scheduled dose day for this compound AND still
// needed a dose; otherwise it stays on its own calendar day.
//
// A single global "the day ends at 4 AM" rule gets this wrong for any compound that isn't taken
// every day: a Sunday-only dose taken at 1:41 AM Sunday would be moved onto Saturday — a day it
// was never scheduled — and Sunday would show as due again. Bedtime doses (scheduled the day
// before, not yet taken) are exactly the ones that should move — including on a daily compound's rest
// days, since someone can keep dosing through one. With the setting at its default this is exactly
// the plain calendar day, as it always was.
// Is a REST-phase day one the compound would normally be dosed on? isCadenceDay can't say: a rest
// phase's effective schedule drops the weekday pattern, so a Sun/Tue/Thu compound in rest falls
// back to a plain 7-day interval anchored on whatever dose it finds first and gets Saturday wrong.
// The rest phase's OWN configured schedule still carries the real cadence, so read it from there.
// Anything it can't tell (a multi-day interval) counts as "not on the cadence", which leaves the
// dose on the day it was logged — the safe direction.
function restDayOnCadence(data, day) {
  const span = getPhaseSpan(data, day);
  const sch = span && span.phase && span.phase.schedule;
  if (!sch) return false;
  if (sch.scheduleWeekdays && sch.scheduleWeekdays.length) return sch.scheduleWeekdays.includes(new Date(day+"T12:00:00").getDay());
  return (sch.scheduleDays || 1) === 1;
}
function doseDayFor(data, d) {
  const R = dayRolloverHours();
  if (!d || !d.date) return dayKey(d && d.date);
  const cal = calendarDayKey(d.date);
  if (!R) return cal;
  if (typeof d.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.date)) return cal;   // no time of day to roll over
  if (timeToMinutes(timeKeyOf(d.date)) >= R*60) return cal;                             // not a late-night dose
  const prev = addDays(cal, -1);
  // Judged by the compound's CADENCE, not by whether the day happens to have slots: a rest phase
  // leaves a day with no slots, but a compound on a daily cadence whose protocol marks a stretch as
  // "rest" is still one a person can be dosing through (DSIP, taken at the same bedtime as CJC and
  // Ipamorelin, was left on the wrong day for exactly that reason). A weekly compound's off-days
  // are still not on its cadence, so a Sunday-only dose taken at 1:41 AM Sunday still stays Sunday.
  const effPrev = getEffectiveSchedule(data, prev);
  const needed = effPrev && effPrev.isRest
    ? (restDayOnCadence(data, prev) ? 1 : 0)
    : (isCadenceDay(data, prev) ? getOccurrenceTimes(data, prev).length : 0);
  if (!needed) return cal;                                                               // previous day wasn't a dose day
  const dMs = new Date(d.date).getTime();
  // Doses that already cover the previous day: ordinary doses logged on it, plus any EARLIER
  // late-night dose in this same window (the first one claims it; a second is a new day's dose).
  const claims = (data.doses||[]).filter(x => {
    if (x === d || !x.date || (typeof x.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x.date))) return false;
    const xc = calendarDayKey(x.date), late = timeToMinutes(timeKeyOf(x.date)) < R*60;
    return (xc === prev && !late) || (xc === cal && late && new Date(x.date).getTime() < dMs);
  }).length;
  return claims >= needed ? cal : prev;
}
// Orders two clock times on the shifted day: with a 4 AM rollover, 00:30 sorts AFTER 21:00 (it is
// the end of that same day), not before it. At the default setting this is the plain HH:MM order.
const cmpSlotTime = (a, b) => (logicalMinutes(a) - logicalMinutes(b)) || String(a).localeCompare(String(b));
const slotDateTime = (dk, t) => { const R = dayRolloverHours(); return (R && timeToMinutes(t) < R*60) ? addDays(dk,1)+"T"+t : dk+"T"+t; };
function startOfWeek(d){ const x=new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate()-x.getDay()); return x; }
const DAY_LABELS=["S","M","T","W","T","F","S"];
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// ─── Shared design-system components ────────────────────────────────────────
// One badge style for every status concept in the app (Active, Healthy, Low, Warning,
// Completed, etc.) — pass a semantic tone, not a hand-picked color, so status pills stay
// visually identical no matter which screen renders them.
const BADGE_TONES = {
  success: "#7DF9C0", info: "#8AB4FF", warning: "#F9C87D",
  danger: "#ff7c7c", accent: "#A78BFA", neutral: "var(--t5)",
};
// Shared status vocabulary for anything with a lifecycle (Compound Kit, Supply unit, etc.) —
// one definition so both renderers always agree on label/color per status.
const STATUS_META = {
  healthy: {label:"Healthy", color:"#7DF9C0"},
  low:     {label:"Low",     color:"#F9C87D"},
  expiring:{label:"Expiring",color:"#ff8c00"},
  expired: {label:"Expired", color:"#ff4d4d"},
  empty:   {label:"Empty",   color:"#ff7c7c"},
  stored:  {label:"Stored",  color:"#8AB4FF"},
  done:    {label:"Done",    color:"var(--t5)"},
};
function statusBadge(label, tone, opts={}) {
  const color = BADGE_TONES[tone] || tone; // allow a raw hex, or a CSS var(), for one-off cases
  const isVar = color.startsWith("var(");
  const bg = isVar ? "var(--surface-2)" : color+"18";
  const border = isVar ? "var(--border-sub)" : color+"44";
  const tag = opts.tappable ? "button" : "span";
  const attrs = opts.attrs || "";
  const touchTarget = opts.tappable ? "min-height:32px;" : "";
  return `<${tag} ${attrs} style="display:inline-flex;align-items:center;justify-content:center;${touchTarget}font-size:11px;font-weight:600;color:${color};background:${bg};border:1px solid ${border};border-radius:7px;padding:3px 9px;line-height:1.3;flex-shrink:0;white-space:nowrap;box-sizing:border-box">${esc(label)}</${tag}>`;
}
// One toggle-chip formula for every segmented control / mode switch in the app (tab bars,
// schedule mode, outflow type, etc.) — same active/inactive treatment everywhere instead of
// each screen retyping the same background/border/color ternary by hand.
function toggleChip(label, active, opts={}) {
  const attrs = opts.attrs || "";
  return `<button ${attrs} style="flex:${opts.flex!=null?opts.flex:1};min-height:36px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;padding:${opts.padding||"9px 6px"};border-radius:9px;font-size:${opts.fontSize||"12px"};font-weight:600;background:${active?"var(--surface-3)":"transparent"};border:1px solid ${active?"var(--border)":"transparent"};color:${active?"var(--t1)":"var(--t4)"};white-space:nowrap">${label}</button>`;
}
// One empty-state pattern everywhere: what's missing, why it matters, and (when there's a
// clear next step) a single action button — never a bare "No data".
function emptyState(title, subtitle, action) {
  return `<div style="text-align:center;padding:28px 20px;color:var(--t4)">
    <div style="font-size:13px;color:var(--t3);margin-bottom:${subtitle?"6":"14"}px">${esc(title)}</div>
    ${subtitle?`<div style="font-size:12px;color:var(--t5);line-height:1.5;margin-bottom:14px">${esc(subtitle)}</div>`:""}
    ${action?`<button id="${action.id}" style="padding:9px 18px;border-radius:10px;background:${action.color||"#A78BFA"}18;border:1px solid ${action.color||"#A78BFA"}44;color:${action.color||"#A78BFA"};font-size:12px;font-weight:600">${esc(action.label)}</button>`:""}
  </div>`;
}
// Renders simple **bold** markdown as real <b> tags — escapes first, so safe against injection.
const mdLite = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const uid = () => Date.now() + Math.floor(Math.random()*100000);

// ─── Tiny DOM helper ───────────────────────────────────────────────────────────
function h(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
const $ = sel => document.querySelector(sel);


/* Safe structural adapter: existing selectors and event handlers continue targeting descendants. */
function applyNexusSheetStructure(modal) {
  if (!modal || modal.classList.contains('nx2-dose-modal') || modal.querySelector(':scope > .nx-dose-form') || modal.classList.contains('nx-structured')) return;
  const originalNodes = Array.from(modal.childNodes);
  const content = document.createElement('div'); content.className = 'nx-unified-body';
  const heading = document.createElement('div'); heading.className = 'nx-unified-header';
  heading.setAttribute('aria-hidden','true');
  heading.innerHTML = '<span class="nx-unified-grip"></span>';
  originalNodes.forEach(node => content.appendChild(node));
  modal.appendChild(heading); modal.appendChild(content);
  // Only move an unambiguous trailing row of buttons. Confirmation modals and
  // specialized dose sheets maintain their own action layout intentionally.
  const last = content.lastElementChild;
  const candidate = last && last.tagName === 'DIV' && last.children.length >= 2 && last.children.length <= 3 &&
    Array.from(last.children).every(el => el.tagName === 'BUTTON') &&
    !last.querySelector('input,textarea,select') &&
    !last.hasAttribute('id');
  if (candidate && !modal.querySelector('.nx-dose-footer')) {
    const footer = document.createElement('div'); footer.className = 'nx-unified-footer';
    while (last.firstChild) footer.appendChild(last.firstChild);
    last.remove(); modal.appendChild(footer);
  }
  modal.classList.add('nx-structured');
  const label = content.querySelector('h1,h2,h3,[class="modal-title"]');
  if(label && !label.id) label.id = 'nx-modal-label-' + (++window.nexusSheetLabelCounter);
  if(label) modal.setAttribute('aria-labelledby',label.id);
}
window.nexusSheetLabelCounter = 0;


/* v0.7.3: recognize existing legacy close/title rows, never clone button nodes. */
function refineNexusSheet(modal) {
  if (!modal || !modal.classList.contains('nx-structured')) return;
  const header=modal.querySelector(':scope > .nx-unified-header');
  const body=modal.querySelector(':scope > .nx-unified-body');
  if (!header || !body) return;
  const top=body.firstElementChild;
  // Migrate only a simple top row: a single close #x button and a title-like
  // element, with no editable fields or nested form actions.
  if (top && top.tagName==='DIV' && top.children.length>=2 && top.children.length<=3 &&
      top.querySelector(':scope > #x') &&
      top.querySelectorAll('button').length===1 &&
      !top.querySelector('input,select,textarea,form') &&
      /display\s*:\s*flex/i.test(top.getAttribute('style')||'')) {
    top.classList.add('nx-sheet-title-row');
    header.appendChild(top); // node identity and #x onclick remain intact
  }
  // Keep a single tab stop for native dialogs, preserve the previously active
  // element so focus can be restored when closed.
  if (!modal.hasAttribute('aria-label') && !modal.hasAttribute('aria-labelledby')) {
    const titleRow=header.querySelector('.nx-sheet-title-row');
    const textNode=titleRow && Array.from(titleRow.children).find(el=>el.id!=='x');
    const title=textNode && textNode.textContent.trim();
    if(title) modal.setAttribute('aria-label',title.slice(0,120));
  }
  // If the header already contains the close control, provide an immediate
  // close target without adding another button.
}
function nexusVisibleSheetHeight() {
  const viewport=window.visualViewport;
  if (!viewport) return;
  document.documentElement.style.setProperty('--nx-visible-height',Math.max(240,viewport.height-8)+'px');
}
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize',nexusVisibleSheetHeight,{passive:true});
  nexusVisibleSheetHeight();
}

// ─── Modal system ──────────────────────────────────────────────────────────────
let modalEl = null;
let nexusPriorFocus = null;
function openModal(innerHTML, color="#7DF9C0") {
  closeModal();
  nexusPriorFocus = document.activeElement;
  modalEl = h(`<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true" tabindex="-1" style="border-color:${color}33;box-shadow:0 0 40px ${color}22"></div></div>`);
  modalEl.querySelector(".modal").innerHTML = innerHTML;
  modalEl.querySelector(".modal").classList.add("nx-sheet");
  if (modalEl.querySelector(".modal > .nx-dose-form")) modalEl.querySelector(".modal").classList.add("nx2-dose-modal");
  modalEl.addEventListener("click", e => { if (e.target === modalEl) closeModal("backdrop"); });
  document.body.appendChild(modalEl);
  applyNexusSheetStructure(modalEl.querySelector(".modal"));
  refineNexusSheet(modalEl.querySelector(".modal"));
  return modalEl.querySelector(".modal");
}
function closeModal(reason) {
  if (!modalEl) return;
  // A user dismissal of a nested Draw sheet must take the same recovery path as its X button.
  // Programmatic closes (successful draw, reconciliation and explicit cancel) never trigger it.
  const dismissed = reason === "backdrop" || reason === "escape";
  const onDismiss = dismissed ? modalEl._nexusOnUserDismiss : null;
  const prior=nexusPriorFocus;
  modalEl.remove(); modalEl=null; nexusPriorFocus=null;
  if (prior && prior.isConnected && typeof prior.focus === "function") try { prior.focus({preventScroll:true}); } catch(e) {}
  if (typeof onDismiss === "function") onDismiss();
}
document.addEventListener("keydown", e => { if(e.key === "Escape" && modalEl) { e.preventDefault(); closeModal("escape"); } });

// ─── Global error surfacing ─────────────────────────────────────────────────────
// Diagnostic net, not a fix: on iOS PWA there's no console to read. If any uncaught
// error fires — most dangerously mid-render, where it can silently abort a modal's
// event-wiring loop and leave every button in it inert — this puts the actual error
// message and stack on screen so it can be read, copied, and reported instead of
// just observing "nothing responds" with no way to know why.
let errBannerEl = null;
function showErrorBanner(msg) {
  if (errBannerEl) errBannerEl.remove();
  errBannerEl = h(`<div style="position:fixed;top:0;left:0;right:0;z-index:99999;background:#3a0d0d;border-bottom:1px solid #ff7c7c66;padding:10px 12px;padding-top:calc(10px + env(safe-area-inset-top));font-family:monospace;font-size:11px;color:#ffb3b3;max-height:40vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px">
      <span style="font-weight:700;color:#ff7c7c">⚠ SCRIPT ERROR — tap to copy, then send to Claude</span>
      <button id="err-x" style="flex-shrink:0;color:#ffb3b3;font-size:16px;background:transparent;border:none">✕</button>
    </div>
    <div id="err-text" style="white-space:pre-wrap;word-break:break-word">${esc(msg)}</div>
  </div>`);
  errBannerEl.querySelector("#err-x").onclick = () => { errBannerEl.remove(); errBannerEl = null; };
  errBannerEl.querySelector("#err-text").onclick = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(()=>{});
  };
  document.body.appendChild(errBannerEl);
}
window.addEventListener("error", (e) => {
  showErrorBanner(`${e.message}\n${e.filename||""}:${e.lineno||"?"}:${e.colno||"?"}\n${(e.error&&e.error.stack)||""}`);
});
window.addEventListener("unhandledrejection", (e) => {
  showErrorBanner(`Unhandled promise rejection: ${(e.reason&&e.reason.message)||e.reason}\n${(e.reason&&e.reason.stack)||""}`);
});

// One clear logging entry point. Existing individual dose modal and combo modal remain authoritative.
function todayLogDosePicker() {
  const names=Object.entries(allPeptides()).filter(([,d])=>(d.status||"active")==="active").map(([n])=>n);
  const m=openModal(`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px"><div><div class="mono" style="font-size:11px;letter-spacing:1px;color:var(--t4)">TODAY</div><h2 style="font-size:20px;color:var(--t1);margin:3px 0">Log a dose</h2></div><button type="button" id="x" aria-label="Close" style="font-size:20px;color:var(--t3)">✕</button></div>
    <p style="font-size:12px;color:var(--t3);margin:0 0 12px">Choose a compound or log multiple compounds together.</p>
    ${names.length ? `<label for="today-dose-compound" class="field-label">COMPOUND</label><select id="today-dose-compound" class="inp" style="width:100%;margin:6px 0 12px"><option value="">Select a compound…</option>${names.map((n,i)=>`<option value="${i}">${esc(n)}</option>`).join("")}</select><button type="button" id="today-dose-single" class="btn-primary nexus-dose-continue" style="display:block!important;width:100%;min-height:48px;margin-bottom:10px;background:#A78BFA!important;color:#211630!important;opacity:1!important;visibility:visible!important;text-align:center;font-weight:700;border:1px solid #A78BFA;border-radius:12px">Continue to dose log</button>` : `<p style="color:var(--t3);font-size:13px">No active compounds yet. Add a compound in Your schedule first.</p>`}
    ${names.length>=2 ? `<button type="button" id="today-dose-combo" style="width:100%;min-height:44px;border:1px solid var(--border);border-radius:10px;color:var(--t1);background:var(--surface-2);font-weight:600">Log combo dose →</button>` : ""}
  `,"#A78BFA");
  m.classList.add("nx-dose-picker");
  m.querySelector("#x").onclick=closeModal;
  const single=m.querySelector("#today-dose-single");
  if(single) single.onclick=()=>{
    const index=m.querySelector("#today-dose-compound").value;
    if(index==="") {m.querySelector("#today-dose-compound").focus();return;}
    const name=names[Number(index)];if(!name)return;
    closeModal();doseModal(name);
  };
  const combo=m.querySelector("#today-dose-combo");
  if(combo) combo.onclick=()=>{closeModal();comboDoseModal();};
}

// Snooze — non-critical items only (Needs Attention grouped items). Never offered on
// urgent dose-due/overdue cards, so a real safety-relevant alert can't be silently
// hidden indefinitely.
function snoozeModal(id) {
  const opts = [["Tomorrow",1],["In 3 days",3],["Next week",7]];
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;letter-spacing:1.5px">REMIND ME</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <p style="font-size:12px;color:var(--t3);margin:0 0 12px">Remind me later, or dismiss this informational alert. This does not delete any records or change your schedule.</p>
    ${opts.map(([label,days])=>`<button class="snooze-opt" data-days="${days}" style="width:100%;text-align:left;padding:12px 14px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t2);font-size:13px;margin-bottom:8px">${label}</button>`).join("")}
    <button type="button" id="dismiss-reminder" style="width:100%;min-height:44px;text-align:left;padding:12px 14px;border-radius:10px;background:transparent;border:1px solid var(--border);color:var(--t2);font-size:13px">Dismiss this alert</button>
  `, "#7DF9C0");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#dismiss-reminder").onclick=()=>{
    if(!state.settings.dismissedReminders) state.settings.dismissedReminders={};
    state.settings.dismissedReminders[id]=Date.now();
    saveState();closeModal();render();
    showUndoToast("Alert dismissed",()=>{delete state.settings.dismissedReminders[id];saveState();render();});
  };
  m.querySelectorAll(".snooze-opt").forEach(b=>b.onclick=()=>{
    if (!state.settings.snoozedReminders) state.settings.snoozedReminders={};
    state.settings.snoozedReminders[id] = Date.now() + (+b.dataset.days)*86400000;
    saveState(); closeModal(); render();
  });
}

// ─── Universal undo toast ────────────────────────────────────────────────────
// One shared snackbar for any reversible action. `undoFn` restores prior state and
// re-renders; nothing else builds its own bespoke undo UI. Auto-dismisses after 6s.
let toastEl = null, toastTimer = null;
function showUndoToast(message, undoFn) {
  if (toastEl) { toastEl.remove(); clearTimeout(toastTimer); }
  toastEl = h(`<div style="position:fixed;left:16px;right:16px;bottom:86px;z-index:9999;display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--surface-3);border:1px solid var(--border);border-radius:12px;padding:12px 14px;box-shadow:0 8px 24px #0006">
    <span style="font-size:12.5px;color:var(--t1)">${esc(message)}</span>
    <button id="undo-btn" style="flex-shrink:0;font-size:12px;font-weight:700;color:#7DF9C0;background:transparent;border:none;padding:4px 6px">UNDO</button>
  </div>`);
  toastEl.querySelector("#undo-btn").onclick = () => { clearTimeout(toastTimer); toastEl.remove(); toastEl=null; undoFn(); };
  document.body.appendChild(toastEl);
  toastTimer = setTimeout(()=>{ if(toastEl){toastEl.remove();toastEl=null;} }, 6000);
}

// ─── Symptom picker (shared) ────────────────────────────────────────────────────
function symptomPickerHTML(selected, color) {
  // Get compound-specific symptoms for active compounds
  const activeCompounds = Object.keys(allPeptides()).filter(n=>(allPeptides()[n].doses||[]).length>0||(allPeptides()[n].status||"active")==="active");
  const compoundGroups = activeCompounds
    .filter(n=>COMPOUND_SYMPTOMS[n])
    .map(n=>COMPOUND_SYMPTOMS[n])
    .filter(g=>g.symptoms.length>0);

  if(!state._symPickerOpen) state._symPickerOpen={};
  const isOpen = key => !!state._symPickerOpen[key];

  const chipRow = (syms, groupColor) => `
    <div class="nx-sym-list">
      ${syms.map(sym => {
        const sel = selected.find(s=>s.name===sym);
        const c = groupColor||color;
        const level = sel ? Math.min(3,Math.max(1,+sel.intensity||2)) : 0;
        return `<div class="nx-sym-row" data-nx-sym-name="${esc(sym)}" style="--nx-sym-accent:${c}">
          <button type="button" data-sym="${esc(sym)}" aria-pressed="${!!sel}" class="symbtn nx-sym-name"><span class="nx-sym-check" aria-hidden="true">${sel?'✓':'+'}</span><span>${esc(sym)}</span></button>
          ${sel?`<div class="symint nx-sym-int" data-sym="${esc(sym)}" role="group" aria-label="${esc(sym)} intensity">
            ${[1,2,3].map(i=>`<button type="button" data-int="${i}" class="nx-sym-level ${level===i?'is-active':''}" aria-label="${esc(sym)} intensity ${i} of 3" aria-pressed="${level===i}">${i}</button>`).join('')}
          </div>`:''}
        </div>`;
      }).join('')}
    </div>`;
  const renderGroup = (key, groupLabel, syms, groupColor) => {
    const selCount = syms.filter(sym=>selected.find(s=>s.name===sym)).length;
    // selected symptoms first within the category
    const ordered = [...syms].sort((a,b)=>{
      const aSel=selected.some(s=>s.name===a), bSel=selected.some(s=>s.name===b);
      return (bSel?1:0)-(aSel?1:0);
    });
    const open = isOpen(key);
    const c = groupColor||"var(--t3)";
    return `<div style="margin-bottom:8px;border:1px solid var(--border-sub);border-radius:12px;overflow:hidden;background:var(--surface)">
      <button class="symcat-toggle" data-nx-open="${open}" aria-expanded="${open}" data-key="${key}" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:${open?"var(--surface-2)":"transparent"}">
        <span class="mono" style="font-size:10px;color:${selCount?c:"var(--t3)"};letter-spacing:1px">${groupLabel.toUpperCase()}${selCount?` <span style="color:${c}">(${selCount} selected)</span>`:""}</span>
        <span class="nx-chevron-slot" aria-hidden="true"></span>
      </button>
      ${open?chipRow(ordered,groupColor):""}
    </div>`;
  };

  const customSyms = state.settings.customSymptoms||[];
  const view = state._symPickerView || "all";
  const recentSyms = [];
  [...state.dailyLogs].sort((a,b)=>new Date(b.date)-new Date(a.date)).forEach(l=>{
    (l.symptoms||[]).forEach(s=>{const nm=typeof s==="string"?s:s.name;if(nm&&!recentSyms.includes(nm))recentSyms.push(nm);});
  });
  // Keep every currently selected symptom reachable, even if not in the recent history.
  const selectedNames=selected.map(s=>s.name);
  const recentList=[...new Set([...selectedNames,...recentSyms.slice(0,8)])];
  const pickerGroups=[];
  if(recentList.length)pickerGroups.push({key:"recent",label:"Recently logged",items:recentList});
  compoundGroups.forEach(g=>pickerGroups.push({key:"compound:"+g.label,label:g.label+"-specific",items:g.symptoms}));
  Object.entries(SYMPTOM_GROUPS).forEach(([label,items])=>pickerGroups.push({key:"general:"+label,label:label==="Cycle / Hormonal"?"PMS & Cycle":label,items}));
  if(customSyms.length)pickerGroups.push({key:"custom",label:"Custom symptoms",items:customSyms.map(c=>c.name)});
  const others=selectedNames.filter(n=>!pickerGroups.some(g=>g.items.includes(n)));
  if(others.length)pickerGroups.push({key:"other",label:"Other recorded",items:others});
  const selectedRowHTML = selected.map(item => {
    const level=Math.max(1,Math.min(3,+item.intensity||2));
    return `<div class="nx-sym-selected-item" style="padding:10px 0;border-bottom:1px solid var(--border-sub)">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><strong style="font-size:13px;color:var(--t1)">${esc(item.name)}</strong><button type="button" class="nx-sym-remove" data-sym="${esc(item.name)}" aria-label="Remove ${esc(item.name)}" style="min-width:44px;min-height:44px;color:var(--t2)">×</button></div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span style="font-size:12px;color:var(--t3)">Intensity</span><div class="symint nx-sym-int" data-sym="${esc(item.name)}" role="group" aria-label="${esc(item.name)} intensity">${[1,2,3].map(i=>`<button type="button" data-int="${i}" class="nx-sym-level ${level===i?"is-active":""}" aria-label="${esc(item.name)} intensity ${i} of 3" aria-pressed="${level===i}">${i}</button>`).join("")}</div></div>
    </div>`;
  }).join("");
  let html=`<div class="nx-sym-picker" aria-label="Symptom selector">
    <label class="nx-sym-search-label" for="nx-sym-combobox">Symptoms</label>
    <div class="nx-sym-combobox-wrap">
      <input id="nx-sym-combobox" type="search" class="nx-sym-search inp" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="nx-sym-options" placeholder="Choose or search symptoms…" autocomplete="off">
    </div>
    <div id="nx-sym-options" class="nx-sym-search-results" role="listbox" aria-label="Available symptoms" hidden style="max-height:260px;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--border-sub);border-radius:11px;margin:8px 0"></div>
    <div style="font-size:12px;font-weight:700;color:var(--t2);margin-top:14px">Selected symptoms (${selected.length})</div>
    <div class="nx-sym-selected-list">${selectedRowHTML||`<p class="nx-sym-empty">No symptoms selected</p>`}</div>
    <template class="nx-sym-search-data">${esc(JSON.stringify(pickerGroups))}</template>`;  html+=`</div>`;
  // Red flag warning if any red flag symptom is selected
  const hasRedFlag = selected.some(s=>RED_FLAG_SYMPTOMS.has(s.name));
  if(hasRedFlag) html = `<div style="background:#FF7C7C18;border:1px solid #FF7C7C55;border-radius:10px;padding:10px 14px;margin-bottom:10px;font-size:11px;color:#FF7C7C;line-height:1.6">⚠️ Some reaction symptoms can be serious. Consider urgent medical advice if symptoms are severe, spreading, or involve breathing, swelling, fever, or faintness.</div>` + html;
  html += `<button id="add-custom-symptom" style="width:100%;padding:9px;border-radius:10px;border:1px dashed var(--border);color:var(--t3);font-size:12px;margin-top:8px">➕ Add Custom Symptom</button>`;
  return html;
}
function wireSymptomPicker(container, selected, color, onUpdate) {
  const search=container.querySelector(".nx-sym-search");
  const results=container.querySelector(".nx-sym-search-results");
  const source=container.querySelector(".nx-sym-search-data");
  // HTMLTemplateElement owns its markup in .content, not in element.textContent.
  let groups=[]; try{groups=JSON.parse(source.content.textContent||"[]")}catch(e){console.error("Symptom categories failed",e)}
  const draw=()=>{
    const query=search.value.trim().toLocaleLowerCase(), visible=!!state._symPickerBrowseOpen;
    results.hidden=!visible; results.style.display=visible?"block":"none";
    search.setAttribute("aria-expanded",String(visible));
    // A symptom can belong to Recently logged, a compound and a general category.
    // Keep EVERY category and item in browse mode, but show each matching name once
    // in search results. Prefer its stable general category, then active compound,
    // then custom/recent, so e.g. Constipation appears under Digestive rather than
    // three identical selectable rows. This is display-only: never mutate catalog,
    // selected names, intensities or stored compound associations.
    const owner=new Map();
    if(query){
      const priority=g=>g.key.startsWith("general:")?0:g.key.startsWith("compound:")?1:g.key==="custom"?2:g.key==="recent"?3:4;
      [...groups].sort((a,b)=>priority(a)-priority(b)).forEach(g=>{
        g.items.forEach(name=>{
          const key=name.toLocaleLowerCase();
          if(key.includes(query)&&!owner.has(key))owner.set(key,g.key);
        });
      });
    }
    let count=0;
    results.innerHTML=groups.map(group=>{
      let matches=group.items.filter(n=>n.toLocaleLowerCase().includes(query));
      if(query){
        const seen=new Set();
        matches=matches.filter(n=>{
          const key=n.toLocaleLowerCase();
          if(owner.get(key)!==group.key||seen.has(key))return false;
          seen.add(key);return true;
        });
      }
      if(!matches.length)return ""; count+=matches.length;
      const closed=!query&&((state._symPickerCollapsed||{})[group.key]??true);
      return `<section class="nx-sym-group"><button type="button" class="nx-sym-group-toggle" data-group="${esc(group.key)}" aria-expanded="${!closed}"><span>${esc(group.label)}</span><small>${matches.length}</small></button>${closed?"":matches.map(n=>`<button type="button" role="option" class="nx-sym-add" data-sym="${esc(n)}" aria-selected="${selected.some(x=>x.name===n)}"><span>${esc(n)}</span><span aria-hidden="true">${selected.some(x=>x.name===n)?"✓":"+"}</span></button>`).join("")}</section>`;
    }).join("");
    if(!count)results.innerHTML=`<p class="nx-sym-empty">No matching symptoms</p>`;
    results.querySelectorAll(".nx-sym-group-toggle").forEach(btn=>btn.onclick=()=>{
      state._symPickerCollapsed=state._symPickerCollapsed||{};
      state._symPickerCollapsed[btn.dataset.group]=!((state._symPickerCollapsed[btn.dataset.group])??true);draw();
    });
    results.querySelectorAll(".nx-sym-add").forEach(btn=>btn.onclick=()=>{
      const i=selected.findIndex(x=>x.name===btn.dataset.sym);
      if(i>=0)selected.splice(i,1);else selected.push({name:btn.dataset.sym,intensity:2});
      refresh(search.value);
    });
  };
  search.onfocus=()=>{state._symPickerBrowseOpen=true;draw()};
  search.onclick=()=>{state._symPickerBrowseOpen=true;draw()};
  search.oninput=()=>{state._symPickerBrowseOpen=true;draw()};
  search.onkeydown=e=>{if(e.key==="Escape"){state._symPickerBrowseOpen=false;draw();search.blur()}
    if(e.key==="ArrowDown"){state._symPickerBrowseOpen=true;draw();const first=results.querySelector(".nx-sym-add");if(first){e.preventDefault();first.focus()}}};
  draw();
  container.querySelectorAll(".nx-sym-remove").forEach(btn=>btn.onclick=()=>{const idx=selected.findIndex(x=>x.name===btn.dataset.sym);if(idx>=0)selected.splice(idx,1);refresh(search.value);});
  draw();
  container.querySelectorAll(".symcat-toggle").forEach(btn=>{
    btn.onclick = () => { const k=btn.dataset.key; state._symPickerOpen[k]=!state._symPickerOpen[k]; refresh(); };
  });
  container.querySelectorAll(".symbtn").forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.sym;
      const idx = selected.findIndex(s=>s.name===name);
      if (idx>=0) selected.splice(idx,1); else selected.push({name,intensity:2});
      refresh();
    };
  });
  container.querySelectorAll(".symint").forEach(box => {
    box.querySelectorAll("button").forEach(b => {
      b.onclick = () => { const s = selected.find(x=>x.name===box.dataset.sym); if (s) { s.intensity = +b.dataset.int; refresh(); } };
    });
  });
  const addBtn = container.querySelector("#add-custom-symptom");
  if(addBtn) addBtn.onclick = () => {
    // Inject inline form instead of opening a new modal (which would close the check-in)
    addBtn.style.display="none";
    const form=document.createElement("div");
    form.style.cssText="background:var(--surface-2);border:1px solid #C9A0FF44;border-radius:10px;padding:12px;margin-top:8px";
    form.innerHTML=`<div style="font-size:11px;color:#C9A0FF;margin-bottom:8px;letter-spacing:1px" class="mono">ADD CUSTOM SYMPTOM</div>
      <input id="cs-name-inline" class="inp" placeholder="Symptom name" style="width:100%;margin-bottom:8px;padding:9px 12px">
      <div style="display:flex;gap:6px">
        <button id="cs-cancel" style="flex:1;padding:8px;border-radius:8px;border:1px solid var(--border);color:var(--t3);font-size:12px">Cancel</button>
        <button id="cs-save" style="flex:1;padding:8px;border-radius:8px;background:#C9A0FF;color:#fff;font-size:12px;font-weight:700">Add</button>
      </div>`;
    addBtn.parentNode.insertBefore(form,addBtn);
    form.querySelector("#cs-cancel").onclick=()=>{form.remove();addBtn.style.display="";};
    form.querySelector("#cs-save").onclick=()=>{
      const name=(form.querySelector("#cs-name-inline").value||"").trim();
      if(!name) return;
      if(!state.settings.customSymptoms) state.settings.customSymptoms=[];
      if(!state.settings.customSymptoms.find(c=>c.name.toLowerCase()===name.toLowerCase())){
        state.settings.customSymptoms.push({name,category:"Other"});
        saveState();
      }
      selected.push({name,intensity:2});
      state._symPickerOpen=state._symPickerOpen||{};
      state._symPickerOpen.custom=true;
      form.remove();
      addBtn.style.display="";
      refresh();
    };
    form.querySelector("#cs-name-inline").focus();
  };
  function refresh(query="") { container.innerHTML = symptomPickerHTML(selected, color); wireSymptomPicker(container, selected, color, onUpdate); const input=container.querySelector(".nx-sym-search");if(input&&query){input.value=query;input.dispatchEvent(new Event("input"));} if(onUpdate) onUpdate(); }
}

// ─── Dose modal ───────────────────────────────────────────────────────────────
// Pure, testable core of "log several compounds at once." Builds an allocation plan for
// every selected compound and validates ALL of them before mutating any inventory — the
// combo succeeds or fails as one atomic unit, never a partial save. This is the single
// place that decides whether a dose ends up with a real vialId allocation; nothing
// downstream re-derives that later. Extracted out of comboDoseModal's onclick handler
// specifically so it's unit-testable without a DOM — see
// test_comboDose_noOrphanedDose in the regression suite, which guards the exact failure
// mode that once produced an untagged dose (kitId set, no allocations) that silently
// never touched vial.remainingMg.
function planAndApplyComboDoses(items, date, site, notes, comboId, symptoms=[]) {
  const plan = [];
  for (const {name, doseVal} of items) {
    const cc = cfg(name);
    if (!doseVal || parseFloat(doseVal)<=0) { plan.push({ name, doseVal, eligible:[], neededMg:0, tracked:false }); continue; }
    // A compound with NO kit at all isn't inventory-tracked — nothing to validate (e.g. a
    // supplement never added to Stash).
    const anyKitExists = (state.supplies||[]).some(s=>s.name===name);
    if (!anyKitExists) { plan.push({ name, doseVal, eligible:[], neededMg:0, tracked:false }); continue; }
    // Sum across EVERY currently-open vial for this compound — across DIFFERENT kits (two
    // separate strengths/batches both active at once is a real, supported state) — not
    // just one "default" kit. Note this does NOT mean multiple open vials within the SAME
    // kit: getActiveVial only ever tracks one per kit by design, and that invariant is
    // what keeps vial resolution unambiguous everywhere else in the app, so it's
    // deliberately left alone here too. The same-kit "not enough in this one, more exists
    // sealed" case is resolved differently below, by finishing the old vial and opening a
    // new one atomically rather than ever having two open at once in one kit.
    const eligible = getEligibleSourceKits(name)
      .sort((a,b)=>getVialRemainingMg(a.kit,a.vial)-getVialRemainingMg(b.kit,b.vial));
    eligible.forEach(e=>migrateKitToV2(e.kit));
    const neededMg = doseToMg(doseVal, cc.unit);
    plan.push({ name, doseVal, eligible, neededMg, tracked:true });
  }
  const shortfall = plan.find(p => {
    if (!p.tracked) return false;
    const totalAvailable = p.eligible.reduce((s,e)=>s+getVialRemainingMg(e.kit,e.vial), 0);
    return totalAvailable + 0.01 < p.neededMg;
  });
  if (shortfall) {
    const cc = cfg(shortfall.name);
    const totalAvailableMg = shortfall.eligible.reduce((s,e)=>s+getVialRemainingMg(e.kit,e.vial), 0);
    const have = mgToUnit(totalAvailableMg, cc.unit);
    // "Nothing open at all" (have=0) vs "something's open but not quite enough" (have>0)
    // both need the SAME real fix — open another vial — just worded differently. Either
    // way, offering that action (when a sealed backup exists) is the actual point of this
    // fix, rather than a flat dead-end error either case previously produced.
    const noOpenVial = shortfall.eligible.length === 0;
    const kitForAction = shortfall.eligible[0]?.kit || (state.supplies||[]).find(s=>s.name===shortfall.name);
    const hasSealedBackup = kitForAction ? ensureKitVials(kitForAction).some(v=>v.status==="sealed") : false;
    return { ok:false, shortfall: { name: shortfall.name, doseVal: shortfall.doseVal, unit: cc.unit, have, noOpenVial, kitId: kitForAction?.id ?? null, hasSealedBackup } };
  }
  const doses = plan.map(p=>{
    const cc = cfg(p.name);
    let allocations;
    if (p.eligible.length) {
      // Drain smallest-first until the needed amount is covered — may span more than one
      // vial, which is exactly the point: a dose that doesn't fit in one vial but does fit
      // across two no longer has to dead-end.
      let remaining = p.neededMg;
      allocations = [];
      for (const {kit, vial} of p.eligible) {
        if (remaining <= 0.001) break;
        const take = Math.min(remaining, vial.remainingMg);
        vial.remainingMg = Math.round((vial.remainingMg-take)*100)/100;
        if (vial.remainingMg <= 0.01) { vial.remainingMg = 0; vial.status = "empty"; }
        allocations.push({ kitId: kit.id, vialId: vial.id, amount: mgToUnit(take, cc.unit) });
        remaining -= take;
      }
    }
    return { name: p.name, dose: { id: uid(), date, dose: p.doseVal, site, symptoms: symptoms.map(s=>({...s})), notes, escalation:false, kitId: (p.eligible.length&&!allocations)?p.eligible[0].kit.id:null, allocations, comboId } };
  });
  return { ok:true, doses };
}

