function measureModal(existing) {
  const f = existing ? {...existing} : {id:uid(), date:localDate(), notes:""};
  const isEdit = !!existing;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><span class="mono" style="font-size:13px;color:#FF9CC8;letter-spacing:1.5px">${isEdit?"EDIT":"LOG"} MEASUREMENTS</span><button id="x" style="color:var(--t4);font-size:18px">✕</button></div>
    <label class="field-label">DATE</label><input id="date" type="date" class="inp" value="${esc(f.date||localDate())}" style="margin-bottom:14px">
    <div style="display:flex;gap:10px">${MEASURES.map(([k,l])=>`<div style="flex:1"><label class="field-label">${l} (${state.settings.measureUnit})</label><input id="${k}" type="number" step="0.1" class="inp" value="${esc(f[k]||"")}" style="margin-bottom:14px"></div>`).join("")}</div>
    <label class="field-label">NOTES</label><input id="notes" class="inp" value="${esc(f.notes||"")}" placeholder="optional" style="margin-bottom:18px">
    <button id="save" class="btn-primary" style="background:#FF9CC8">${isEdit?"SAVE CHANGES":"SAVE"}</button>
  `, "#FF9CC8");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#save").onclick = () => {
    const rec = {id:f.id, date:m.querySelector("#date").value, notes:m.querySelector("#notes").value};
    let any=false; MEASURES.forEach(([k])=>{ const v=m.querySelector("#"+k).value; if(v){rec[k]=v;any=true;} });
    if (!any) return;
    state.measurementLogs = state.measurementLogs.filter(x=>x.id!==rec.id);
    state.measurementLogs.push(rec); saveState(); closeModal(); render();
  };
}

// ─── Supply modal ──────────────────────────────────────────────────────────────
// ─── Amino AI Chat ────────────────────────────────────────────────────────────
function buildAminoContext() {
  const aps = allPeptides();
  const started = Object.entries(aps).filter(([,d])=>(d.doses||[]).length>0);
  const lines = [
    `USER: ${state.profile.name?.trim() || "the user"}, protocol started ${state.profile.startDate||"unknown"}.`,
    `ACTIVE COMPOUNDS:`,
    ...started.map(([n,d])=>{
      const doses=[...d.doses].sort((a,b)=>new Date(b.date)-new Date(a.date));
      const last=doses[0]; const c=cfg(n);
      const next=last?addDays(last.date,d.scheduleDays):null;
      return `  ${n}: ${doses.length} doses. Last: ${last?fmtDate(last.date)+" ("+esc(last.dose||"?")+c.unit+")":"never"}. Next due: ${next?fmtDate(next):"unknown"}. Every ${d.scheduleDays}d.`;
    }),
    `STASH: ${state.supplies.map(s=>{
      // Canonical remaining — the same getKitRemainingMg every other screen (Stash card,
      // Log Dose, Prepare Dose) already reads through, plus this kit's own outstanding
      // prepared draws so "usable" matches what a person would actually call "what I have
      // left." Previously reimplemented from scratch here as totalVials×vialMg minus only
      // tagged doses — blind to waste, transfers, and prepared draws entirely, so the AI
      // chat could tell you a kit still held material that was actually given away,
      // wasted, or already drawn into a syringe. One formula, everywhere.
      const rem = getKitRemainingMg(s) + getPreparedRemainingMg(s.name, s.id);
      const exp=s.reconDate&&s.expiryDays?Math.ceil((new Date(addDays(s.reconDate,s.expiryDays)).getTime()-Date.now())/86400000):null;
      return `${s.name}: ${rem.toFixed(1)}mg left${exp!==null?", vial expires "+exp+"d":""}`;
    }).join("; ")||"none"}`,
    `RECENT CHECK-INS: ${[...state.dailyLogs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,7).map(l=>{
      const mood=MOODS.find(m=>m.v===l.mood); const syms=(l.symptoms||[]).map(s=>typeof s==="string"?s:s.name);
      return `${fmtDate(l.date)} ${mood?mood.label:""}${syms.length?" ["+syms.slice(0,3).join(",")+"]":""}`;
    }).join("; ")||"none"}`,
    `WEIGHT: ${[...state.weightLogs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3).map(w=>`${fmtDate(w.date)}: ${w.weight}${state.settings.weightUnit}`).join(", ")||"none"}`,
    `TODAY: ${new Date().toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}`,
  ];
  return lines.join("\n");
}

// Matches a symptom name mentioned in free text against the known vocabulary — a small
// heuristic (exact substring + a few common aliases), not full NLP.
const SYMPTOM_TEXT_ALIASES = { "tired":"Fatigue", "exhausted":"Fatigue", "can't sleep":"Insomnia", "cant sleep":"Insomnia", "constipated":"Constipation", "diarrhea":"Diarrhea", "bloated":"Bloating", "nauseous":"Nausea", "nauseated":"Nausea" };
function findSymptomInText(text) {
  const q = text.toLowerCase();
  for (const [alias, sym] of Object.entries(SYMPTOM_TEXT_ALIASES)) { if (q.includes(alias)) return sym; }
  const allSymptoms = [...new Set(Object.values(SYMPTOM_GROUPS).flat())];
  return allSymptoms.find(s => q.includes(s.toLowerCase())) || null;
}

function nexusRoute(input, priorTopic) {
  const q = input.toLowerCase().trim();
  const aps = allPeptides();
  const started = Object.entries(aps).filter(([,d])=>(d.doses||[]).length>0);
  const active  = started.filter(([,d])=>(d.status||"active")==="active");
  const activeProtocols = (state.protocols||[]).filter(p=>["active","in_progress"].includes(p.status));
  const kits = state.supplies||[];
  const say = (text, followups=[], topic) => ({text, followups, topic});

  // ══ NEXUS INTELLIGENCE — analytical questions, routed to the shared analysis engine ═══
  // Follow-up resolution checked FIRST since these short questions only make sense against
  // whatever topic the conversation was already on.
  if (/has this happened before|happened before|history of this|seen this before/.test(q)) {
    if (priorTopic?.type === "weight_change") {
      const ev = priorTopic.event;
      const allChanges = detectAndAnalyzeWeightChanges();
      const similar = allChanges.filter(c=>c.startDate!==ev.startDate && c.confounders.some(cf=>ev.confounders.some(pc=>pc.type===cf.type)));
      if (!similar.length) return say("This looks like the only time I've seen a rapid weight change with these same confounders in your logged history.", [], priorTopic);
      return say(`Yes — I found ${similar.length} similar time${similar.length===1?"":"s"}: ${similar.map(s=>`${fmtDate(s.startDate)} (${s.delta>0?"+":""}${s.delta.toFixed(1)} ${s.unit})`).join(", ")}.`, [], priorTopic);
    }
    if (priorTopic?.type === "opposite_transition") {
      const events = getNormalizedSymptomEvents().filter(e=>e.symptom===priorTopic.symptomA);
      const occurrences = [...new Set(events.map(e=>dayKey(e.date)))].length;
      return say(`${priorTopic.symptomA} has been logged on ${occurrences} day${occurrences===1?"":"s"} total in your history. This ${fmtDate(priorTopic.bFirstDate)} transition to ${priorTopic.symptomB.toLowerCase()} is the clearest pattern shift I've found so far.`, [], priorTopic);
    }
    if (priorTopic?.type === "sequence") {
      return say(`I'm tracking ${priorTopic.from} → next-day patterns from your last 60 days of logs — that's the window this is based on.`, [], priorTopic);
    }
    return say("Could you tell me which pattern you'd like me to check the history of?");
  }

  if (/why (did|has|is|does) my weight|weight (drop|fall|change|decreas|increas|rise|went (up|down))/.test(q) && !/trend|goal/.test(q)) {
    const changes = detectAndAnalyzeWeightChanges();
    if (!changes.length) return say("I don't see a rapid weight change in your recent logs to explain — your weight has been fairly stable, or there isn't enough recent data.", ["Show my weight trend"]);
    const top = [...changes].sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta))[0];
    const topic = { type:"weight_change", event: top };
    return say(`${top.narrative}\n\n**Confidence:** ${top.confidence}`, ["Has this happened before?","Show my weight trend"], topic);
  }

  if (/what (usually |typically |normally )?happens after|what follows|what (usually |typically )?comes after/.test(q)) {
    const sym = findSymptomInText(q);
    if (!sym) return say("Which symptom would you like me to check? For example, \"what usually happens after poor sleep\".");
    const sequences = detectSymptomSequences(60).filter(s=>s.from===sym);
    if (!sequences.length) return say(`I don't see a strong recurring pattern after ${sym.toLowerCase()} yet — that needs more repeated occurrences before I'd call it a real pattern.`);
    const top = sequences[0];
    const topic = { type:"sequence", from: sym, to: top.to };
    return say(`On ${top.count} of ${top.aTotal} occasions when ${top.from.toLowerCase()} was logged, ${top.to.toLowerCase()} followed the next day (${Math.round(top.rate*100)}% of the time).`, ["Has this happened before?","What symptoms happen together?"], topic);
  }

  if (/what symptoms (happen|occur|cluster).*(together)|symptoms.*(travel together|cluster together)/.test(q)) {
    const clusters = detectSymptomClusters(60);
    if (!clusters.length) return say("I haven't found a strong recurring symptom cluster in your recent data yet — that needs a handful of days where the same symptoms repeatedly show up together.");
    const lines = clusters.slice(0,3).map(c=>`**${c.symptoms.join(" + ")}** — co-occurred on ${c.sampleDays} day${c.sampleDays===1?"":"s"} recently`);
    return say(lines.join("\n"));
  }

  if (/what changed (this week|recently|lately)|what.?s different|what was different|why am i more/.test(q)) {
    const transitions = detectOppositeTransitions(45);
    const changePoints = detectAllChangePoints(21);
    const weightChanges = detectAndAnalyzeWeightChanges().filter(w=>(Date.now()-safeDate(w.endDate).getTime())/86400000<=14);
    const cmp = comparePeriodToPrevious(7);
    const parts = [];
    let topic;
    if (transitions.length) { parts.push(`Your ${transitions[0].category.toLowerCase()} pattern shifted from ${transitions[0].symptomA.toLowerCase()} to ${transitions[0].symptomB.toLowerCase()} beginning ${fmtDate(transitions[0].bFirstDate)}.`); topic = { type:"opposite_transition", ...transitions[0] }; }
    else if (changePoints.length) { parts.push(`Your ${changePoints[0].category.toLowerCase()} pattern changed around ${fmtDate(changePoints[0].splitDate)}.`); }
    if (weightChanges.length) { const w=weightChanges[0]; parts.push(`Weight ${w.delta<0?"dropped":"rose"} ${Math.abs(w.delta).toFixed(1)} ${w.unit} recently.`); if(!topic) topic={type:"weight_change", event:w}; }
    if (cmp.newlyAppearing.length) parts.push(`New this week: ${cmp.newlyAppearing.join(", ")}.`);
    if (cmp.disappeared.length) parts.push(`Resolved since last week: ${cmp.disappeared.join(", ")}.`);
    if (!parts.length) return say("Nothing stands out as a significant change in the last week or two — things look fairly consistent with your recent baseline.");
    return say(parts.join(" "), ["Has this happened before?"], topic);
  }

  if (/anything paused|what.?s paused|paused (protocol|compound)/.test(q)) {
    const pausedC = started.filter(([,d])=>(d.status||"active")==="paused");
    if (!pausedC.length) return say("Nothing is currently paused.", ["What's due today?"]);
    return say(pausedC.map(([n])=>`**${n}**`).join("\n"), ["What's due today?"]);
  }

  if (/haven.?t started|not started|which protocols.*(start|begin)/.test(q)) {
    const notStartedC = Object.entries(aps).filter(([,d])=>!(d.doses||[]).length && (d.status||"active")!=="paused");
    if (!notStartedC.length) return say("Everything in your library that you've added has at least one dose logged.");
    return say(notStartedC.map(([n])=>`**${n}**`).join("\n"), ["Help me build a protocol for one of these"]);
  }

  // ══ MY PROTOCOLS — TEMPORAL QUERIES ════════════════════════════════════
  // Each compound's next-due date is resolved to a structured {date, relativeDay, status}
  // record ONCE, using the same TZ-safe dayKey()/localDate() calendar-day comparison used
  // everywhere else in the app (never a raw Date.now() ms-diff against a date-only string —
  // that math silently drifts a day in negative-UTC-offset timezones like Toronto). Every
  // temporal question below filters this same structured list deterministically; the LLM-
  // style phrasing never decides what counts as "today".
  const buildDueList = () => active.map(([n,d])=>{
    const next = nextDueDate(d);
    if (!next) return null;
    const nextKey = dayKey(next);
    const todayKey = localDate();
    const relativeDay = Math.round((new Date(nextKey+"T00:00:00").getTime()-new Date(todayKey+"T00:00:00").getTime())/86400000);
    const status = relativeDay<0 ? "overdue" : relativeDay===0 ? "today" : relativeDay===1 ? "tomorrow" : "upcoming";
    // Multi-dose-per-day: name which SPECIFIC occurrence is next (e.g. "evening dose at
    // 8:00 PM") rather than just the date — nextDueDate() already resolved the correct
    // day via the occurrence-aware getScheduledOccurrenceState, this just adds the label.
    let occLabel = null;
    if ((d.dosesPerDay||1)>1) {
      const daySlots = getDayOccurrences(d, nextKey);
      const pendingSlot = daySlots.find(s=>["due_now","due_later_today","overdue","upcoming"].includes(s.status));
      if (pendingSlot) {
        const times = getOccurrenceTimes(d);
        const idx = times.indexOf(pendingSlot.time);
        const slotName = idx===0?"morning":idx===times.length-1?"evening":`dose ${idx+1}`;
        const [h,m]=pendingSlot.time.split(":").map(Number); const ap=h>=12?"PM":"AM"; const h12=h%12||12;
        occLabel = `${slotName} dose at ${h12}:${String(m).padStart(2,"0")} ${ap}`;
      }
    }
    return {name:n, date:nextKey, relativeDay, status, occLabel};
  }).filter(Boolean);

  // "Did I take X today?" — occurrence-aware: for a twice-daily compound this correctly
  // distinguishes "logged this morning, evening still pending" from "done for the day."
  const tookMatch = /did i take|have i taken|logged.*today/.test(q) && Object.keys(allPeptides()).find(n=>q.includes(n.toLowerCase()));
  if (tookMatch) {
    const d = active.find(([n])=>n===tookMatch)?.[1] || allPeptides()[tookMatch];
    if (!d) return say(`I don't have any data for ${tookMatch} yet.`);
    const sum = getDayOccurrenceSummary(d, localDate());
    if (!sum.total) return say(`${tookMatch} isn't on a recurring schedule, so there's nothing due today to check.`);
    if (sum.total===1) {
      const slot = sum.slots[0];
      if (slot.status==="taken") return say(`Yes — you logged your ${tookMatch} dose today at ${new Date(slot.dose.date).toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"})}.`);
      if (slot.status==="skipped") return say(`No — today's ${tookMatch} dose was marked as skipped.`);
      if (slot.status==="missed") return say(`No — today's ${tookMatch} dose was marked as missed.`);
      return say(`Not yet — today's ${tookMatch} dose is still ${slot.status==="overdue"?"overdue":"pending"}.`);
    }
    const parts = sum.slots.map(s=>{
      const label = s===sum.slots[0]?"morning":s===sum.slots[sum.slots.length-1]?"evening":"midday";
      if (s.status==="taken") return `logged your ${label} dose at ${new Date(s.dose.date).toLocaleTimeString("en-CA",{hour:"numeric",minute:"2-digit"})}`;
      if (s.status==="skipped") return `skipped your ${label} dose`;
      if (s.status==="missed") return `marked your ${label} dose as missed`;
      return `your ${label} dose is still ${s.status==="overdue"?"overdue":"scheduled for "+s.time}`;
    });
    return say(`You've ${parts.join("; ")}.`, [`When is my next ${tookMatch} dose?`]);
  }

  const startOfWeek = (dk) => { const d=new Date(dk+"T00:00:00"); const day=d.getDay(); const diff=(day===0?-6:1-day); const s=new Date(d); s.setDate(d.getDate()+diff); return dayKey(s); };
  const endOfWeek = (dk) => addDays(startOfWeek(dk),6);

  // "Due tomorrow" — checked before the generic "due" pattern so it doesn't get swallowed.
  if (/due tomorrow|tomorrow.*due/.test(q)) {
    const due = buildDueList();
    const tmrw = due.filter(x=>x.status==="tomorrow");
    if (!due.length) return say("No active compounds yet — log your first dose to get started.", ["Help me build my first protocol"]);
    if (!tmrw.length) return say("Nothing is scheduled for tomorrow.", ["What's due today?","What's coming up?"]);
    return say(`Tomorrow (${fmtDate(addDays(localDate(),1))}):\n${tmrw.map(x=>x.occLabel?`**${x.name}** — ${x.occLabel}`:`**${x.name}**`).join("\n")}`, ["What's due today?","What's coming up?"]);
  }

  // "What's due this week?" — Mon–Sun window containing today, calendar-date bounded.
  if (/due this week|this week.*due|what.*(have|scheduled).*this week/.test(q)) {
    const due = buildDueList();
    const wStart = startOfWeek(localDate()), wEnd = endOfWeek(localDate());
    const inWeek = due.filter(x=>x.date>=wStart && x.date<=wEnd && x.relativeDay>=0);
    const overdue = due.filter(x=>x.relativeDay<0);
    if (!due.length) return say("No active compounds yet — log your first dose to get started.", ["Help me build my first protocol"]);
    const parts = [];
    if (overdue.length) parts.push(`Overdue: ${overdue.map(x=>x.name).join(", ")}.`);
    if (inWeek.length) parts.push(inWeek.map(x=>`**${x.name}**: ${x.status==="today"?"today":x.status==="tomorrow"?"tomorrow":fmtDate(x.date)}`).join("\n"));
    else parts.push("Nothing else scheduled for the rest of this week.");
    return say(parts.join("\n"), ["What's due today?","What's coming up?"]);
  }

  // "What's coming up?" / "due soon" — everything strictly in the future, not today.
  if (/coming up|due soon|what.?s next|upcoming/.test(q)) {
    const due = buildDueList();
    if (!due.length) return say("No active compounds yet — log your first dose to get started.", ["Help me build my first protocol"]);
    const future = due.filter(x=>x.relativeDay>0).sort((a,b)=>a.relativeDay-b.relativeDay);
    if (!future.length) return say("Nothing scheduled beyond today right now.", ["What's due today?"]);
    return say(future.map(x=>`**${x.name}**: ${x.occLabel?x.occLabel+(x.status!=="tomorrow"?` (${fmtDate(x.date)})`:" (tomorrow)"):x.status==="tomorrow"?"tomorrow":`${fmtDate(x.date)} — in ${x.relativeDay} days`}`).join("\n"), ["What's due today?","How much supply do I have left?"]);
  }

  // "What's due today?" (and generic "what's due" / "next dose" phrasing) — TODAY means
  // calendar date === today in local time, full stop. Overdue items are surfaced
  // separately since they are not "today" either — they're their own state.
  if (/what.{0,4}s? due|due today|next.*(shot|dose|inject|pin)|when.*(do i|should i|is my).*(inject|dose|take|pin)/.test(q)) {
    const due = buildDueList();
    if (!due.length) return say("No active compounds yet — log your first dose to get started.", ["Help me build my first protocol"]);
    const today = due.filter(x=>x.status==="today");
    const overdue = due.filter(x=>x.status==="overdue");
    const nextUp = due.filter(x=>x.relativeDay>0).sort((a,b)=>a.relativeDay-b.relativeDay)[0];
    const parts = [];
    if (overdue.length) parts.push(overdue.map(x=>`**${x.name}**: overdue by ${Math.abs(x.relativeDay)} day${Math.abs(x.relativeDay)===1?"":"s"} (was due ${fmtDate(x.date)})`).join("\n"));
    if (today.length) parts.push(`Due today: ${today.map(x=>x.occLabel?`**${x.name}** — ${x.occLabel}`:`**${x.name}**`).join(", ")}.`);
    else if (!overdue.length) parts.push("Nothing is scheduled for today.");
    if (nextUp && !today.length) parts.push(`Next scheduled dose: **${nextUp.name}**, ${nextUp.status==="tomorrow"?"tomorrow":fmtDate(nextUp.date)}.`);
    return say(parts.join("\n\n"), ["How much supply do I have left?","Which protocol is closest to finishing?"]);
  }

  if (/closest to finish|finishing first|which protocol.*(end|finish|done)/.test(q)) {
    if (!activeProtocols.length) return say("No active protocols yet.", ["Help me build my first protocol"]);
    const withRemaining = activeProtocols.map(p=>{
      const totalWeeks=Math.max(1,...(p.compounds||[]).map(c=>((c.phases||[]).reduce((a,ph)=>a+(ph.durationWeeks||4),0))||8));
      const weeksElapsed = p.startDate ? Math.floor(daysSince(p.startDate)/7) : 0;
      return {name:p.name, remaining: Math.max(0,totalWeeks-weeksElapsed)};
    }).sort((a,b)=>a.remaining-b.remaining);
    const top=withRemaining[0];
    return say(`**${top.name}** is closest — about ${top.remaining} week${top.remaining===1?"":"s"} remaining.`, ["How many weeks remain on my other protocols?","Which kit is linked to this protocol?"]);
  }

  if (/how many weeks|weeks remain|weeks left/.test(q)) {
    if (!activeProtocols.length) return say("No active protocols yet.", ["Help me build my first protocol"]);
    const lines = activeProtocols.map(p=>{
      const totalWeeks=Math.max(1,...(p.compounds||[]).map(c=>((c.phases||[]).reduce((a,ph)=>a+(ph.durationWeeks||4),0))||8));
      const weeksElapsed = p.startDate ? Math.floor(daysSince(p.startDate)/7) : 0;
      const remaining=Math.max(0,totalWeeks-weeksElapsed);
      return `**${p.name}**: ${remaining} week${remaining===1?"":"s"} remaining (of ${totalWeeks})`;
    });
    return say(lines.join("\n"), ["Which protocol is closest to finishing?"]);
  }

  if (/which kit.*(link|protocol)|kit.*linked/.test(q)) {
    if (!activeProtocols.length) return say("No active protocols yet.", ["Help me build my first protocol"]);
    const lines = activeProtocols.map(p=>{
      const comps=(p.compounds||[]).map(c=>c.name||c);
      const linked=comps.map(cn=>{ const k=kits.find(x=>x.name===cn); return k ? `${cn} → ${k.name} kit` : `${cn} → no kit found`; });
      return `**${p.name}**:\n${linked.join("\n")}`;
    });
    return say(lines.join("\n\n"), ["Which compounds are running low?"]);
  }

  // ══ SUPPLY / STASH ══════════════════════════════════════════════════════
  if (/running low|low on|need to (re)?order/.test(q)) {
    if (!kits.length) return say("No stash entries yet. Add a kit in the Stash tab.");
    const low = kits.map(s=>{
      const remMg = getKitRemainingMg(s);
      const totalMg=(s.totalVials||0)*(s.vialMg||0);
      const pctLeft = totalMg>0 ? remMg/totalMg : 1;
      return {name:s.name, remMg, pctLeft};
    }).filter(s=>s.pctLeft<=0.2);
    if (!low.length) return say("Nothing's running low right now — all kits are above 20% remaining.", ["What expires next?"]);
    return say(low.map(s=>`**${s.name}**: ${s.remMg.toFixed(1)}mg left (${Math.round(s.pctLeft*100)}%)`).join("\n"), ["How long will my stash last?","What expires next?"]);
  }

  if (/bac water|reconstitut.*water|which.*water/.test(q)) {
    const openBac = (state.equipmentItems||[]).filter(e=>e.type==="BAC Water"&&(e.units||[]).some(u=>u.status==="active")).map(e=>({...e, openedDate:(e.units||[]).find(u=>u.status==="active")?.openedDate}));
    if (!openBac.length) return say("No open BAC water tracked in Stash. Check Stash → BAC Water to log one.");
    const withAge = openBac.map(e=>({...e, age: e.openedDate?Math.round(daysSince(e.openedDate)):null})).sort((a,b)=>(b.age||0)-(a.age||0));
    const oldest = withAge[0];
    const lines = withAge.map(e=>`**${e.brand||"BAC water"}**: opened ${e.age!=null?e.age+"d ago":"unknown"}`);
    return say(`${lines.join("\n")}\n\nUse the oldest open bottle first (${oldest.brand||"BAC water"}, ${oldest.age}d) to avoid it going past its window unused.`, ["Is any BAC water past its window?"]);
  }

  if (/what expires next|expiring|expiry/.test(q)) {
    if (!kits.length) return say("No kits in Stash yet.");
    const withExp = kits.filter(k=>k.reconDate&&k.expiryDays).map(k=>({name:k.name, days:Math.ceil((new Date(addDays(k.reconDate,k.expiryDays)).getTime()-Date.now())/86400000)})).sort((a,b)=>a.days-b.days);
    if (!withExp.length) return say("No kits have both a recon date and expiry window set, so nothing to compare.");
    const next=withExp[0];
    return say(`**${next.name}** expires soonest — in ${next.days} day${next.days===1?"":"s"}.\n\n${withExp.slice(1,4).map(k=>`${k.name}: ${k.days}d`).join("\n")}`, ["Which compounds are running low?"]);
  }

  // ══ SUPPLY / STASH ══════════════════════════════════════════════════════
  // Distinguishes total usable (vial + prepared) from vial-only and prepared-only, so
  // Nexus never conflates "prepared" with "administered" or claims a vial holds material
  // that's already been drawn into a syringe.
  const invMatch = Object.keys(PEPTIDES).concat(Object.keys(state.customPeptides||{})).find(n=>q.includes(n.toLowerCase()));
  if (invMatch && /how much.*(left|remain|have|usable)|how many.*prepared|prepared doses/.test(q)) {
    const invKits = (state.supplies||[]).filter(k=>k.name===invMatch);
    if (!invKits.length) return say(`No stash entries tracked for ${invMatch} yet.`);
    const vialMg = invKits.reduce((a,k)=>a+getKitRemainingMg(k),0);
    const prepMg = getPreparedRemainingMg(invMatch), prepCount = getPreparedRemainingCount(invMatch);
    const unit = cfg(invMatch)?.unit||"mg";
    if (/how many.*prepared|prepared doses/.test(q)) {
      return say(prepCount ? `${prepCount} prepared dose${prepCount===1?"":"s"} (${prepMg.toFixed(1)}${unit} total).` : `No prepared doses on hand for ${invMatch} right now.`);
    }
    if (/in (my |the )?(current )?vial|in vial/.test(q)) {
      return say(`${vialMg.toFixed(1)}${unit} in vial.`);
    }
    const total = vialMg + prepMg;
    return say(prepCount
      ? `You have ${total.toFixed(1)}${unit} usable: ${vialMg.toFixed(1)}${unit} remains in your vial and ${prepMg.toFixed(1)}${unit} is already prepared across ${prepCount} dose${prepCount===1?"":"s"}.`
      : `${total.toFixed(1)}${unit} usable, all in vial.`, ["Which compounds are running low?"]);
  }

  if (/how long will my stash last|stash last|supply last/.test(q)) {
    if (!kits.length) return say("No stash entries yet.");
    const lines = kits.map(s=>{
      const p=aps[s.name];
      if(!p || !(p.doses||[]).length) return `**${s.name}**: no dose history yet to project from`;
      const remMg = getKitRemainingMg(s) + getPreparedRemainingMg(s.name, s.id);
      const perDoseMg=doseToMg(p.doses[p.doses.length-1].dose,cfg(s.name)?.unit||"mg");
      const doseIntervalDays=p.scheduleDays||7;
      const dosesLeft = perDoseMg>0 ? Math.floor(remMg/perDoseMg) : 0;
      const daysLeft = dosesLeft*doseIntervalDays;
      return `**${s.name}**: ~${dosesLeft} doses left (~${daysLeft} days at current pace)`;
    });
    return say(lines.join("\n"), ["Which compounds are running low?"]);
  }

  if (/enough for my next protocol|enough supply/.test(q)) {
    return say("Supply-vs-protocol matching isn't automated yet — check Stash for current mg remaining and compare against your planned protocol's compounds and duration in Plans → Protocol builder.", ["Which compounds are running low?"]);
  }

  if (/stash|how much|remaining|left|supply|mg|vial/.test(q)) {
    if (!kits.length) return say("No stash entries yet. Add a kit in the Stash tab.");
    // Canonical remaining — same getKitRemainingMg every other Amino handler above (and
    // every other screen this session) already reads through. This was the last spot
    // still reimplementing "total − used" from scratch, and its own version never
    // subtracted prepared draws — a second formula that could quietly disagree with the
    // real vial number the instant material was pre-drawn into a syringe.
    const lines = kits.map(s=>{
      const rem = getKitRemainingMg(s);
      const exp=s.reconDate&&s.expiryDays?Math.ceil((new Date(addDays(s.reconDate,s.expiryDays)).getTime()-Date.now())/86400000):null;
      return `**${s.name}**: ${rem.toFixed(1)} mg remaining (${s.totalVials} vials × ${s.vialMg}mg)${exp!==null?`, vial expires in ${exp}d`:""}`;
    });
    return say(lines.join("\n"), ["Which compounds are running low?","What expires next?"]);
  }

  // ══ MY DATA ═════════════════════════════════════════════════════════════
  if (/hrv/.test(q)) {
    const rows=(state.activityLogs||[]).filter(a=>!a.isWorkout&&a.hrv!=null).sort((a,b)=>new Date(a.date)-new Date(b.date));
    if (rows.length<4) return say("Not enough HRV data yet — this needs a health import with a few weeks of readings.", ["Has my resting heart rate changed?"]);
    const recent=rows.filter(r=>daysSince(r.date)<=14), prior=rows.filter(r=>daysSince(r.date)>14&&daysSince(r.date)<=28);
    if (recent.length<2||prior.length<2) return say(`Latest HRV: ${rows[rows.length-1].hrv}ms on ${fmtDate(rows[rows.length-1].date)}. Not enough data yet to compare trend.`);
    const avgR=recent.reduce((a,r)=>a+r.hrv,0)/recent.length, avgP=prior.reduce((a,r)=>a+r.hrv,0)/prior.length;
    const diff=avgR-avgP;
    return say(`HRV ${diff>=0?"up":"down"} ${Math.abs(diff).toFixed(1)}ms vs. the prior 2 weeks (${avgP.toFixed(1)} → ${avgR.toFixed(1)}).`, ["Has my resting heart rate changed?","Which symptoms have increased recently?"]);
  }

  if (/resting heart rate|resting hr|rhr/.test(q)) {
    const rows=(state.activityLogs||[]).filter(a=>!a.isWorkout&&a.restingHR!=null).sort((a,b)=>new Date(a.date)-new Date(b.date));
    if (rows.length<4) return say("Not enough resting heart rate data yet — import a health export with a few weeks of readings.");
    const recent=rows.filter(r=>daysSince(r.date)<=14), prior=rows.filter(r=>daysSince(r.date)>14&&daysSince(r.date)<=28);
    if (recent.length<2||prior.length<2) return say(`Latest resting HR: ${rows[rows.length-1].restingHR}bpm on ${fmtDate(rows[rows.length-1].date)}.`);
    const avgR=recent.reduce((a,r)=>a+r.restingHR,0)/recent.length, avgP=prior.reduce((a,r)=>a+r.restingHR,0)/prior.length;
    const diff=avgR-avgP;
    return say(`Resting heart rate ${diff<=0?"down":"up"} ${Math.abs(diff).toFixed(1)}bpm vs. the prior 2 weeks (${avgP.toFixed(1)} → ${avgR.toFixed(1)}).`, ["Show my HRV trend"]);
  }

  if (/lowest weight|best weight/.test(q)) {
    if (!state.weightLogs.length) return say("No weight logs yet. Tap ⚖ Weight on Today to start tracking.");
    const lowest=[...state.weightLogs].sort((a,b)=>parseFloat(a.weight)-parseFloat(b.weight))[0];
    const curr=[...state.weightLogs].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    return say(`Lowest: **${lowest.weight} ${state.settings.weightUnit}** on ${fmtDate(lowest.date)}\nCurrent: **${curr.weight} ${state.settings.weightUnit}**`, ["Show my weight trend"]);
  }

  if (/weight trend|show.*weight/.test(q)) {
    if (state.weightLogs.length<2) return say("Not enough weight logs yet for a trend — log a few more entries.", ["What's my lowest weight?"]);
    const sorted=[...state.weightLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const first=sorted[0], last=sorted[sorted.length-1];
    const delta=(parseFloat(last.weight)-parseFloat(first.weight)).toFixed(1);
    return say(`Current: **${last.weight} ${state.settings.weightUnit}** (${fmtDate(last.date)})\nSince ${fmtDate(first.date)}: **${parseFloat(delta)>0?"+":""}${delta} ${state.settings.weightUnit}**\n\nSee Trends for the full chart.`, ["What's my lowest weight?","Why has my weight plateaued?"]);
  }

  if (/weight|weigh|lbs|kg|lost|gained/.test(q)) {
    if (!state.weightLogs.length) return say("No weight logs yet. Tap ⚖ Weight on Today to start tracking.");
    const sorted=[...state.weightLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const first=sorted[0], last=sorted[sorted.length-1];
    const delta=(parseFloat(last.weight)-parseFloat(first.weight)).toFixed(1);
    const sign=parseFloat(delta)>0?"+":"";
    return say(`Current: **${last.weight} ${state.settings.weightUnit}** (${fmtDate(last.date)})\nChange since ${fmtDate(first.date)}: **${sign}${delta} ${state.settings.weightUnit}**`, ["What's my lowest weight?"]);
  }

  if (/food noise.*return|when.*(food noise|appetite|hunger).*(back|return)/.test(q)) {
    const withPhases=active.filter(([n])=>cfg(n)?.phases);
    if(!withPhases.length) return say("Food noise timing tracks best on compounds with defined phases (like Retatrutide). Log a few more cycles of symptoms to build this picture.");
    const [n,p]=withPhases[0];
    const doses=[...p.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const daysSinceDose=date=>{const t=new Date(date).getTime();let best=null;doses.forEach(d=>{const dt=(t-new Date(d.date).getTime())/86400000;if(dt>=0&&(best===null||dt<best))best=dt;});return best;};
    const hunger=state.dailyLogs.filter(l=>(l.symptoms||[]).some(s=>/hunger|food noise|appetite/i.test(typeof s==="string"?s:s.name)));
    if (hunger.length<3) return say(`Not enough food noise/appetite symptom logs yet for ${n} — tag it in your check-ins when it happens.`);
    const days=hunger.map(l=>daysSinceDose(l.date)).filter(v=>v!=null);
    const avg=days.reduce((a,b)=>a+b,0)/days.length;
    return say(`For **${n}**, food noise/appetite has typically returned around **Day ${Math.round(avg)}** post-dose, based on ${days.length} logged occurrences.`, ["Is food noise returning earlier lately?"]);
  }

  if (/which symptoms.*(increas|worse|up)|symptoms.*(increas|worse)/.test(q)) {
    if (!state.dailyLogs.length) return say("No check-ins logged yet.");
    if (state.dailyLogs.length<4) return say(`I only have ${state.dailyLogs.length} check-in${state.dailyLogs.length===1?"":"s"} logged, so there isn't enough history yet to compare recent vs. prior periods. A trend needs check-ins spread across at least a few weeks.`);
    const now=Date.now();
    // Comparative window: last 14 days vs. the 14 days before that. A frequency count on
    // its own is not "increased" — increased requires a same-length comparison period.
    const countWindow=(from,to)=>{const c={};let severitySum={},severityN={};state.dailyLogs.forEach(l=>{const d=(now-new Date(l.date).getTime())/86400000;if(d>=from&&d<to)(l.symptoms||[]).forEach(s=>{const nm=typeof s==="string"?s:s.name;const sev=(s&&typeof s==="object")?s.severity:null;c[nm]=(c[nm]||0)+1;if(sev!=null){severitySum[nm]=(severitySum[nm]||0)+sev;severityN[nm]=(severityN[nm]||0)+1;}});});return {c,severitySum,severityN};};
    const recent=countWindow(0,14), prior=countWindow(14,28);
    const names=new Set([...Object.keys(recent.c),...Object.keys(prior.c)]);
    const rows=[...names].map(nm=>{
      const r=recent.c[nm]||0, p=prior.c[nm]||0;
      const rAvgSev = recent.severityN[nm] ? recent.severitySum[nm]/recent.severityN[nm] : null;
      const pAvgSev = prior.severityN[nm] ? prior.severitySum[nm]/prior.severityN[nm] : null;
      return {nm,r,p,rAvgSev,pAvgSev};
    }).filter(x=>x.r>x.p&&x.r>=2).sort((a,b)=>(b.r-b.p)-(a.r-a.p));
    if (!rows.length) return say("No symptoms have clearly increased in the last 14 days vs. the prior 2 weeks — frequencies look fairly stable, or there's too little data to tell.");
    const lines = rows.slice(0,5).map(x=>{
      const pctText = x.p>0 ? ` (+${Math.round(((x.r-x.p)/x.p)*100)}%)` : "";
      let line = `**${x.nm}**: ${x.p} → ${x.r} logs${pctText}`;
      if (x.rAvgSev!=null && x.pAvgSev!=null) line += `, average severity ${x.pAvgSev.toFixed(1)} → ${x.rAvgSev.toFixed(1)}`;
      return line;
    });
    return say(lines.join("\n"), ["Which symptoms have improved?","Which symptoms happen after dose day?"]);
  }

  if (/which symptoms.*(improv|better|down|decreas|eased|less)|symptoms.*(improv|eased)/.test(q)) {
    if (!state.dailyLogs.length) return say("No check-ins logged yet.");
    if (state.dailyLogs.length<4) return say(`I only have ${state.dailyLogs.length} check-in${state.dailyLogs.length===1?"":"s"} logged, so there isn't enough history yet to establish a trend.`);
    const now=Date.now();
    const countWindow=(from,to)=>{const c={};state.dailyLogs.forEach(l=>{const d=(now-new Date(l.date).getTime())/86400000;if(d>=from&&d<to)(l.symptoms||[]).forEach(s=>{const nm=typeof s==="string"?s:s.name;c[nm]=(c[nm]||0)+1;});});return c;};
    const recent=countWindow(0,14), prior=countWindow(14,28);
    const names=new Set([...Object.keys(recent),...Object.keys(prior)]);
    const rows=[...names].map(nm=>({nm,r:recent[nm]||0,p:prior[nm]||0})).filter(x=>x.p>x.r&&x.p>=2).sort((a,b)=>(b.p-b.r)-(a.p-a.r));
    if (!rows.length) return say("No symptoms have clearly improved (dropped in frequency) in the last 14 days vs. the prior 2 weeks.");
    const lines = rows.slice(0,5).map(x=>{
      const pctText = x.p>0 ? ` (-${Math.round(((x.p-x.r)/x.p)*100)}%)` : "";
      return `**${x.nm}**: ${x.p} → ${x.r} logs${pctText}`;
    });
    return say(lines.join("\n"), ["Which symptoms have increased recently?"]);
  }

  if (/symptom|side effect|nausea|fatigue|feel|feeling|bloat|constip|energy|appetite/.test(q)) {
    if (!state.dailyLogs.length) return say("No check-ins logged yet. Tap + Check-in on Today to start tracking how you feel.");
    const count={};
    state.dailyLogs.forEach(l=>(l.symptoms||[]).forEach(s=>{
      const n=typeof s==="string"?s:s.name; count[n]=(count[n]||0)+1;
    }));
    const sorted=Object.entries(count).sort((a,b)=>b[1]-a[1]);
    if(!sorted.length) return say("You haven't logged any symptoms yet in your check-ins.");
    const top=sorted.slice(0,5).map(([n,c])=>`${n} (×${c})`).join(", ");
    return say(`Your top symptoms across ${state.dailyLogs.length} check-ins:\n${top}`, ["Which symptoms have increased recently?"]);
  }

  if (/what changed since.*dose increase|since.*last.*(increase|escalat)/.test(q)) {
    const withEsc=active.filter(([n,p])=>(p.doses||[]).some(d=>d.escalation));
    if(!withEsc.length) return say("No logged dose escalations yet to compare against.");
    const [n,p]=withEsc[0];
    const escDoses=[...p.doses].filter(d=>d.escalation).sort((a,b)=>new Date(b.date)-new Date(a.date));
    const escDate=escDoses[0].date;
    const before=state.dailyLogs.filter(l=>new Date(l.date)<new Date(escDate)&&daysSince(l.date)<=(daysSince(escDate)+14));
    const after=state.dailyLogs.filter(l=>new Date(l.date)>=new Date(escDate));
    const avgSym=arr=>arr.length?arr.reduce((a,l)=>a+(l.symptoms||[]).length,0)/arr.length:0;
    const b=avgSym(before), a2=avgSym(after);
    return say(`Since your last **${n}** dose increase (${fmtDate(escDate)}):\nSymptom logs per check-in: ${b.toFixed(1)} → ${a2.toFixed(1)}`, ["Which symptoms have increased recently?"]);
  }

  // ══ INSIGHTS (pattern questions — reuses same log data as Nexus → Insights) ══
  if (/plateau/.test(q)) {
    if (state.weightLogs.length<6) return say("Not enough weight logs yet to assess a plateau — a few more entries will help.");
    const sorted=[...state.weightLogs].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const recent=sorted.filter(w=>daysSince(w.date)<=14);
    if (recent.length<3) return say("Not enough recent weigh-ins in the last 14 days to judge a plateau — try weighing in more consistently.");
    const vals=recent.map(w=>parseFloat(w.weight));
    const range=Math.max(...vals)-Math.min(...vals);
    if (range<=1.5) return say(`Weight has stayed within ${range.toFixed(1)} ${state.settings.weightUnit} over your last ${recent.length} entries — that does look like a plateau. Short-term fluctuation is normal; if it holds past 3 weeks, worth reviewing dose timing and food noise in Next Best Review.`, ["Show my weight trend","What's my lowest weight?"]);
    return say(`Weight moved ${range.toFixed(1)} ${state.settings.weightUnit} over your last ${recent.length} entries — that's more variation than a plateau, likely still trending.`, ["Show my weight trend"]);
  }

  if (/symptoms.*after dose day|day after dose|post.dose symptom/.test(q)) {
    if (!active.length) return say("No active compounds with dose history yet.");
    const [n,p]=active[0];
    const doseDays=new Set(p.doses.map(d=>dayKey(d.date)));
    const dayAfter=[...doseDays].map(d=>addDays(d,1));
    const logsAfter=state.dailyLogs.filter(l=>dayAfter.includes(dayKey(l.date)));
    if (logsAfter.length<3) return say(`Not enough check-ins logged the day after a ${n} dose yet to see a pattern.`);
    const count={};
    logsAfter.forEach(l=>(l.symptoms||[]).forEach(s=>{const nm=typeof s==="string"?s:s.name;count[nm]=(count[nm]||0)+1;}));
    const top=Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,4);
    if(!top.length) return say(`No symptoms logged the day after a ${n} dose so far.`);
    return say(`Day after a **${n}** dose, most common:\n${top.map(([nm,c])=>`${nm} (${c}× of ${logsAfter.length} days)`).join("\n")}`, ["Which symptoms have increased recently?"]);
  }

  if (/food noise.*earlier|earlier.*(food noise|appetite)/.test(q)) {
    return say("Comparing trough timing across cycles needs 3+ dose cycles with consistent symptom tagging. Check Trends → your compound → Trough Analysis for the cycle-by-cycle breakdown once you have enough data.", ["When does my food noise usually return?"]);
  }

  // ══ LEARN (surfaces Library content — never generates new info) ═══════════
  const compareMatch = q.match(/compare (.+) (?:and|vs\.?|to) (.+)/);
  if (compareMatch) {
    const names=Object.keys(PEPTIDES);
    const a=names.find(n=>compareMatch[1].includes(n.toLowerCase()));
    const b=names.find(n=>compareMatch[2].includes(n.toLowerCase()));
    if (a&&b) {
      const ca=cfg(a), cb=cfg(b);
      return say(`**${a}** vs **${b}**\n\nDosing unit: ${ca.unit||"mg"} vs ${cb.unit||"mg"}\nHalf-life: ${ca.halfLifeDays?ca.halfLifeDays+"d":"—"} vs ${cb.halfLifeDays?cb.halfLifeDays+"d":"—"}\n\nFull profiles: Nexus → Learn → Discover Peptides.`, [`Explain ${a}`,`Explain ${b}`]);
    }
    return say("I couldn't match both compound names — try \"Compare BPC-157 and TB-500\" using exact names from your Stash or Library.");
  }

  if (/reconstitut/.test(q)) return say("The reconstitution guide (BAC water ratios, mixing steps, storage) lives in Nexus → Learn → Guides. Opening it now would help more than a text summary here.", ["Show dosing guide"]);
  if (/dosing guide/.test(q)) return say("The general dosing guide (titration, timing, cycling) is in Nexus → Learn → Guides.", ["Show reconstitution guide"]);

  const compMatch = (q.match(/what is|what's|tell me about|explain/)) && Object.keys(PEPTIDES).find(n=>q.includes(n.toLowerCase()));
  if (compMatch) {
    const c=cfg(compMatch);
    const d=aps[compMatch];
    const doses=(d?.doses||[]).length;
    // Hybrid answer: general knowledge FIRST (from the Library's own overview/mechanism
    // text — never invented here), then the user's actual Nexus data, clearly separated
    // so general info is never presented as though it came from their logs.
    const parts = [`### ${compMatch}`];
    if (c.overview) parts.push(c.overview);
    if (c.mechanism) parts.push(c.mechanism);
    if (!c.overview && !c.mechanism) parts.push(`${c.unit||"mg"} dosing${c.halfLifeDays?`, ${c.halfLifeDays}-day half-life`:""}.`);

    if (doses>0) {
      const sortedDoses=[...d.doses].sort((a,b)=>new Date(b.date)-new Date(a.date));
      const last=sortedDoses[0];
      const nexusParts=[`**In your Nexus history**`, `You've logged ${doses} dose${doses===1?"":"s"} of ${compMatch}.`, `Last dose: ${fmtDate(last.date)}${last.dose?` (${last.dose} ${c.unit||""})`:""}.`];
      const matchingProtocol=(state.protocols||[]).find(p=>(p.compounds||[]).some(pc=>(pc.name||pc)===compMatch));
      if (matchingProtocol) nexusParts.push(`Current protocol: **${matchingProtocol.name}** (${matchingProtocol.status||"active"}).`);
      const ds=getDoseStatus(compMatch,d);
      const next=nextDueDate(d);
      if (next) {
        const relDay=Math.round((new Date(dayKey(next)+"T00:00:00").getTime()-new Date(localDate()+"T00:00:00").getTime())/86400000);
        let whenStr = relDay<0?`overdue since ${fmtDate(next)}`:relDay===0?"today":relDay===1?"tomorrow":fmtDate(next);
        // Multi-dose-per-day: name the specific pending occurrence (e.g. "tonight at 8 PM")
        // rather than just the day — this is what keeps "next dose" from saying "tomorrow"
        // when today's evening dose is still the actual next thing due.
        if ((d.dosesPerDay||1)>1) {
          const pendingSlot = getDayOccurrences(d, dayKey(next)).find(s=>["due_now","due_later_today","overdue","upcoming"].includes(s.status));
          if (pendingSlot) {
            const [h,m]=pendingSlot.time.split(":").map(Number); const ap=h>=12?"PM":"AM"; const h12=h%12||12;
            whenStr = relDay===0 ? `${h>=18?"tonight":"today"} at ${h12}:${String(m).padStart(2,"0")} ${ap}` : `${whenStr} at ${h12}:${String(m).padStart(2,"0")} ${ap}`;
          }
        }
        nexusParts.push(`Next scheduled dose: ${whenStr}.`);
      }
      parts.push(nexusParts.join("\n"));
    } else {
      parts.push(`**In your Nexus history**\nNo doses logged yet for ${compMatch}.`);
    }
    return say(parts.join("\n\n"), [`Compare ${compMatch} and another compound`,`How has ${compMatch} been going for me?`]);
  }

  // "How has X been going for me?" — purely personal, data-driven (no general knowledge
  // mixed in), and explicitly hedges when there isn't enough data to say anything.
  // Protocol phase questions — reads the same getCompoundPhase()/data.phases the
  // dosing engine and reminders both use; never a separate phase-tracking calculation.
  const phaseMatch = /what phase|phase.*(am i|are you)|dose increase|dose change|rest period|changes next week/.test(q) && Object.keys(allPeptides()).find(n=>q.includes(n.toLowerCase()));
  if (phaseMatch) {
    const pd = allPeptides()[phaseMatch];
    if (!pd.phases || !pd.phases.length || !pd.startDate) {
      return say(`${phaseMatch} isn't on a multi-phase protocol — it's using a single ongoing schedule.`);
    }
    const curPhase = getCompoundPhase(pd, localDate());
    const curIdx = pd.phases.indexOf(curPhase);
    if (!curPhase) return say(`${phaseMatch}'s protocol hasn't started yet based on its start date.`);
    let cursor = pd.startDate;
    for (let i=0;i<=curIdx;i++) cursor = addDays(cursor, Math.round((pd.phases[i].durationWeeks||4)*7));
    const transitionDate = cursor;
    const nextPhase = pd.phases[curIdx+1] || null;
    const c2 = cfg(phaseMatch);
    const curDesc = curPhase.isRest ? "a rest phase" : `the ${curPhase.dose} ${c2.unit} phase`;
    let parts = [`You're currently in ${curDesc}. It ends ${fmtDate(transitionDate)}.`];
    if (nextPhase) parts.push(nextPhase.isRest ? `Your rest phase begins ${fmtDate(transitionDate)}.` : `Your ${nextPhase.dose} ${c2.unit} phase begins ${fmtDate(transitionDate)}.`);
    else parts.push(`No further phase is defined after that — your planned protocol ends there.`);
    return say(parts.join(" "), [`When is my next ${phaseMatch} dose?`]);
  }

  const goingMatch = /how (has|is|s) (.+?) (going|been going|doing)/.exec(q);
  if (goingMatch) {
    const gName = Object.keys(PEPTIDES).find(n=>goingMatch[2].includes(n.toLowerCase())) || Object.keys(state.customPeptides||{}).find(n=>goingMatch[2].includes(n.toLowerCase()));
    if (!gName) return say("Which compound would you like me to check? For example, \"How has Retatrutide been going for me?\"");
    const d=aps[gName];
    if (!d || !(d.doses||[]).length) return say(`No doses logged yet for ${gName}, so I don't have anything to go on yet.`, [`Explain ${gName}`]);
    const doses=[...d.doses].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const c=cfg(gName);
    const doseDays=new Set(doses.map(x=>dayKey(x.date)));
    const relatedLogs=state.dailyLogs.filter(l=>doseDays.has(dayKey(l.date))||[...doseDays].some(dd=>Math.abs(daysSince(dd)-daysSince(l.date))<=1));
    const parts=[`You've logged ${doses.length} dose${doses.length===1?"":"s"} of **${gName}** since ${fmtDate(doses[0].date)}, most recently ${fmtDate(doses[doses.length-1].date)}.`];
    const tv = getTimingVariance(d);
    if (tv) {
      const mag=Math.abs(tv.avgMinutes), dir=tv.avgMinutes>0?"after":"before";
      parts.push(mag<5 ? `You tend to log this right around the planned time (${tv.sampleSize} doses checked).` : `You tend to log this about ${mag} minutes ${dir} the planned time (${tv.sampleSize} doses checked) — normal variation, not flagged as an issue.`);
    }
    if (relatedLogs.length>=3) {
      const count={}; relatedLogs.forEach(l=>(l.symptoms||[]).forEach(s=>{const nm=typeof s==="string"?s:s.name;count[nm]=(count[nm]||0)+1;}));
      const top=Object.entries(count).sort((a,b)=>b[1]-a[1]).slice(0,3);
      if (top.length) parts.push(`Symptoms most often logged around dosing: ${top.map(([nm,ct])=>`${nm} (×${ct})`).join(", ")}. This is a correlation from timing overlap, not a confirmed cause.`);
      else parts.push(`No symptoms have been tagged in check-ins around your ${gName} doses so far.`);
    } else {
      parts.push(`Not enough check-ins logged around dosing days yet to say anything about how it's affecting you day-to-day.`);
    }
    return say(parts.join("\n\n"), [`Explain ${gName}`,`When was my last ${gName} dose?`]);
  }

  // ══ Remaining original handlers ═══════════════════════════════════════
  if (/trough/.test(q)) {
    return say(`The **trough** is the point in your dosing cycle when the medication is at its lowest level — typically a few days before your next injection. You may notice symptoms returning: appetite coming back, food noise increasing, or energy dipping. See Trends → your compound → Trough Analysis.`, ["When does my food noise usually return?"]);
  }
  if (/on track|adherence|missed|adherent|doing/.test(q)) {
    const weekStart=startOfWeek(new Date());
    const wkDoses=Object.values(aps).flatMap(d=>(d.doses||[]).filter(x=>new Date(x.date)>=weekStart));
    const wkLogs=state.dailyLogs.filter(l=>new Date(l.date)>=weekStart);
    return say(`This week: **${wkDoses.length}** dose${wkDoses.length===1?"":"s"} logged, **${wkLogs.length}** check-in${wkLogs.length===1?"":"s"} (out of 7 days).\n${wkDoses.length>0&&wkLogs.length>=3?"Looks like you're staying on top of it ✓":"Keep going — daily check-ins make the trough analysis sharper."}`);
  }
  if (/how long|started|been on/.test(q)) {
    if (!state.profile.startDate) return say("No protocol start date set. Go to Profile → Edit to set it.");
    const days=Math.floor((Date.now()-new Date(state.profile.startDate).getTime())/86400000);
    const weeks=Math.floor(days/7);
    return say(`You've been on protocol for **${days} days** (${weeks} week${weeks===1?"":"s"}), since ${fmtDate(state.profile.startDate)}.`);
  }
  if (/how many dose|total dose|dose count/.test(q)) {
    const lines=active.map(([n,d])=>`**${n}**: ${d.doses.length} doses`);
    return say(lines.length?lines.join("\n"):"No active compounds yet.");
  }
  if (/mood|feel|emotion|mental|how am i/.test(q)) {
    if (!state.dailyLogs.length) return say("No check-ins logged yet.");
    const recent=[...state.dailyLogs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,7);
    const avg=recent.reduce((a,l)=>a+l.mood,0)/recent.length;
    const moodObj=MOODS.reduce((b,m)=>Math.abs(m.v-avg)<Math.abs(b.v-avg)?m:b);
    return say(`Average mood over your last ${recent.length} check-ins: **${moodObj.emoji} ${moodObj.label}**`);
  }
  if (/build my first protocol|help me (build|start|create)/.test(q)) {
    return say("Head to Plans → Protocol, tap + New Protocol, and add your compound, schedule, and phases. Once activated and your first dose is logged, Nexus and Insights come alive.");
  }

  return say(`I can help with:\n\n**My Protocols** — "What's due today?", "How many weeks remain?"\n**Supply** — "Which compounds are running low?", "What expires next?"\n**My Data** — "Show my weight trend", "Show my HRV trend"\n**Insights** — "Why has my weight plateaued?"\n**Learn** — "Explain BPC-157", "Compare BPC-157 and TB-500"\n\nTry one of these, or tap a suggestion below.`);
}

function nexusSuggestions() {
  const aps = allPeptides();
  const active = Object.entries(aps).filter(([,d])=>(d.doses||[]).length>0&&(d.status||"active")==="active");
  const activeProtocols = (state.protocols||[]).filter(p=>["active","in_progress"].includes(p.status));
  const hasHRV = (state.activityLogs||[]).some(a=>!a.isWorkout&&a.hrv!=null);
  const groups = [];
  if (activeProtocols.length) groups.push({label:"My Protocols", items:["What's due today?","How many weeks remain?"]});
  else if (active.length===0) groups.push({label:"Get started", items:["Help me build my first protocol"]});
  if (state.supplies&&state.supplies.length) groups.push({label:"Supply", items:["How much supply do I have left?","Which compounds are running low?"]});
  if (state.weightLogs.length>=2) groups.push({label:"My Data", items:["Show my weight trend","What's my lowest weight?"]});
  if (hasHRV) groups.push({label:"My Data", items:["Show my HRV trend","Has my resting heart rate changed?"]});
  if (state.dailyLogs.length>=5) groups.push({label:"Insights", items:["Which symptoms have increased recently?"]});
  if (active.length) groups.push({label:"Learn", items:[`Explain ${active[0][0]}`]});
  return groups;
}

// ─── Data Health / Audit ────────────────────────────────────────────
// Data-quality checks only — flags gaps that can weaken insights. Never medical advice.
// Statuses: ok = "Looks good" · check = "Worth checking" · missing = "Missing data"
function dataHealthChecks() {
  const checks = [];
  const add = (label, status, detail, gates) => checks.push({label, status, detail, gates: !!gates});
  const aps = allPeptides();
  const active = Object.entries(aps).filter(([,p])=>(p.status||"active")==="active"&&(p.doses||[]).length);
  const kits = state.supplies || [];
  const activeProtocols = (state.protocols||[]).filter(p=>["active","in_progress"].includes(p.status));

  // 1. Active protocols ↔ stash kits
  const protoNoKit = activeProtocols.filter(p=>(p.compounds||[]).length && !(p.compounds||[]).some(c=>kits.some(k=>k.name===(c.name||c))));
  if (!activeProtocols.length) add("Protocols linked to Stash","missing","No active protocol yet. Supply forecasts work best with one running.",true);
  else if (protoNoKit.length) add("Protocols linked to Stash","check",`${protoNoKit.map(p=>p.name).join(", ")} — no stash kit found for any linked compound, so supply math is estimated.`,true);
  else add("Protocols linked to Stash","ok","Every active protocol has at least one kit in Stash.");

  // 2. Doses missing kitId (only where a kit exists to tag against)
  let untagged=0, taggable=0;
  active.forEach(([n,p])=>{ if(kits.some(k=>k.name===n)) (p.doses||[]).forEach(d=>{ taggable++; if(!d.kitId) untagged++; }); });
  if (!taggable) add("Doses tagged to kits","missing","No doses on compounds with kits yet — nothing to tag.");
  else if (untagged) add("Doses tagged to kits","check",`${untagged} of ${taggable} doses aren't tagged to a specific kit (often older logs). Per-kit remaining counts fall back to compound totals.`,true);
  else add("Doses tagged to kits","ok",`All ${taggable} doses are tagged to a kit.`);

  // 3. Compounds missing a dose unit
  const noUnit = active.filter(([n])=>!(cfg(n)?.unit));
  if (noUnit.length) add("Dose units set","check",`${noUnit.map(([n])=>n).join(", ")} — no unit set, so amounts are assumed to be mg.`,true);
  else add("Dose units set","ok","Every active compound has a dose unit.");

  // 4. Active kits missing reconstitution date
  const noRecon = kits.filter(k=>k.activeKit && !k.reconDate);
  if (!kits.length) add("Kit reconstitution dates","missing","No kits in Stash yet.");
  else if (noRecon.length) add("Kit reconstitution dates","check",`${noRecon.map(k=>k.name).join(", ")} — active kit without a recon date, so expiry countdowns can't run.`,true);
  else add("Kit reconstitution dates","ok","All active kits have a reconstitution date.");

  // 5. BAC water use window (typical ~28 days once opened)
  const openBac = (state.equipmentItems||[]).filter(e=>e.type==="BAC Water").map(e=>({...e, openedDate:(e.units||[]).find(u=>u.status==="active")?.openedDate})).filter(e=>e.openedDate);
  const bacPast = openBac.filter(e=>daysSince(e.openedDate)>28);
  const bacNear = openBac.filter(e=>{const d=daysSince(e.openedDate);return d>=21&&d<=28;});
  if (bacPast.length) add("BAC water freshness","check",`${bacPast.map(e=>e.brand||"BAC water").join(", ")} opened ${bacPast.map(e=>Math.round(daysSince(e.openedDate))+"d").join(", ")} ago — past the usual 28-day window. Worth replacing when convenient.`);
  else if (bacNear.length) add("BAC water freshness","check",`${bacNear.map(e=>e.brand||"BAC water").join(", ")} approaching the 28-day window (${bacNear.map(e=>Math.round(daysSince(e.openedDate))+"d").join(", ")} open).`);
  else if (openBac.length) add("BAC water freshness","ok","Open BAC water is within its use window.");
  else add("BAC water freshness","missing","No open BAC water tracked in Stash.");

  // 6. Active compounds with no recent dose log
  const stale = active.filter(([n,p])=>{
    const last=[...p.doses].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
    const gap=(p.scheduleDays||1)*2+1;
    return last && daysSince(dayKey(last.date))>gap;
  });
  if (stale.length) add("Recent dose logs","check",`${stale.map(([n])=>n).join(", ")} — marked active but no dose logged recently. If paused, pausing the compound keeps trends clean.`,true);
  else if (active.length) add("Recent dose logs","ok","All active compounds have recent dose logs.");
  else add("Recent dose logs","missing","No active compounds with doses yet.");

  // 7. Weight logged in last 5 days
  const lastW = [...(state.weightLogs||[])].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  if (!lastW) add("Weight logs","missing","No weight logged yet — weight trends and milestones need it.",true);
  else if (daysSince(dayKey(lastW.date))>=5) add("Weight logs","check",`Last weight was ${Math.round(daysSince(dayKey(lastW.date)))}d ago. A fresh entry keeps the trend current.`,true);
  else add("Weight logs","ok","Weight logged within the last 5 days.");

  // 8. Daily check-in in last 3 days
  const lastCk = [...(state.dailyLogs||[])].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  if (!lastCk) add("Daily check-ins","missing","No check-ins yet — symptom and mood patterns come from these.",true);
  else if (daysSince(dayKey(lastCk.date))>=3) add("Daily check-ins","check",`Last check-in was ${Math.round(daysSince(dayKey(lastCk.date)))}d ago. Even quick entries feed pattern detection.`,true);
  else add("Daily check-ins","ok","Checked in within the last 3 days.");

  // 9. mcg normalization — live self-test of the conversion path
  const mcgComps = active.filter(([n])=>cfg(n)?.unit==="mcg");
  if (mcgComps.length) {
    const mathOk = doseToMg("500","mcg")===0.5 && doseToMg(250,"mcg")===0.25;
    if (mathOk) add("mcg → mg normalization","ok",`${mcgComps.map(([n])=>n).join(", ")} dose in mcg — supply math confirmed normalizing to mg (500 mcg → 0.5 mg).`);
    else add("mcg → mg normalization","check","Conversion self-test returned an unexpected value — supply totals for mcg compounds may be off.",true);
  } else add("mcg → mg normalization","ok","No mcg-dosed compounds active — nothing to normalize.");

  // 10. Health import — HRV / resting HR baselines
  const baselineRows = (state.activityLogs||[]).filter(a=>!a.isWorkout&&(a.hrv!=null||a.restingHR!=null));
  if (!baselineRows.length) add("HRV / resting HR data","missing","No imported HRV or resting heart rate yet. Recovery signals stay hidden until a health import includes them.",true);
  else {
    const newest = baselineRows.reduce((m,a)=>Math.max(m,new Date(a.date).getTime()),0);
    const age = (Date.now()-newest)/86400000;
    if (age>14) add("HRV / resting HR data","check",`Baseline data exists but the newest entry is ${Math.round(age)}d old. A fresh import keeps recovery insights current.`,true);
    else add("HRV / resting HR data","ok",`${baselineRows.length} baseline entries, kept separate from workouts.`);
  }

  return checks;
}

function toggleDataHealthCard(){ state._dataHealthOpen = !state._dataHealthOpen; renderBody(); }

function dataHealthCard() {
  const checks = dataHealthChecks();
  const okN = checks.filter(c=>c.status==="ok").length;
  const meta = {ok:["Looks good","#7DF9C0","✓"], check:["Worth checking","#F9C87D","◐"], missing:["Missing data","#8AB4FF","○"]};
  const open = !!state._dataHealthOpen;
  const worst = checks.some(c=>c.status==="check") ? "check" : checks.some(c=>c.status==="missing") ? "missing" : "ok";
  const summary = okN===checks.length ? "Everything looks good" : `${okN} of ${checks.length} looks good`;
  const rows = checks.map(c=>{
    const [label,color,dot]=meta[c.status];
    return `<div style="display:flex;gap:9px;padding:8px 0;border-bottom:1px solid var(--surface-2);align-items:flex-start">
      <div style="color:${color};font-size:12px;line-height:1.5;flex-shrink:0;width:14px;text-align:center">${dot}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;gap:6px;align-items:baseline;flex-wrap:wrap">
          <span style="font-size:12px;font-weight:600;color:var(--t2)">${esc(c.label)}</span>
          <span style="font-size:9px;font-weight:600;color:${color};background:${color}14;border:1px solid ${color}33;border-radius:8px;padding:0 6px">${label}</span>
          ${c.status!=="ok"&&c.gates?`<span style="font-size:9px;color:var(--t5)">May affect insights</span>`:""}
        </div>
        <div style="font-size:11px;color:var(--t4);line-height:1.45;margin-top:2px">${esc(c.detail)}</div>
      </div>
    </div>`;
  }).join("");
  return `<div class="card" style="border-color:${meta[worst][1]}22;margin-bottom:12px">
    <button onclick="toggleDataHealthCard()" style="display:flex;width:100%;align-items:center;gap:10px;background:none;border:none;padding:0;text-align:left;cursor:pointer">
      <div style="font-size:15px">🩺</div>
      <div style="flex:1;min-width:0">
        <div class="mono" style="font-size:10px;color:var(--t3);letter-spacing:1.5px">DATA HEALTH</div>
        <div style="font-size:11px;color:${meta[worst][1]}">${summary}</div>
      </div>
      <div style="font-size:11px;color:var(--t5)">${open?"▴":"▾"}</div>
    </button>
    ${open?`<div style="margin-top:10px;border-top:1px solid var(--border-sub)">${rows}
      <div style="font-size:10px;color:var(--t5);margin-top:8px;line-height:1.4">A data-quality check, not advice — it only looks at whether the app has enough clean data to generate reliable insights.</div>
    </div>`:""}
  </div>`;
}

// ─── Normalized symptom event layer ─────────────────────────────────────────
// symptomTags (per-symptom -> compound list) is the real linkage source; l.compound
// is a legacy single-value field that's almost always null under the current check-in
// system. This is the ONE place that decides how a symptom gets attributed — every
// Insights calculation should read from here rather than re-parsing dailyLogs itself.
// Reschedule tracking — count, average delay, most common reason. Rescheduled doses are
// never counted as missed here; this is purely descriptive, not an adherence measure.
function getRescheduleStats(compoundName) {
  const aps = allPeptides();
  const targets = compoundName ? [compoundName] : Object.keys(aps);
  const all = targets.flatMap(n => (aps[n]?.reschedules||[]).map(r=>({...r, compound:n})));
  if (!all.length) return { count:0, avgDelayDays:null, mostCommonReason:null, entries:[] };
  const delays = all.map(r => (safeDate(r.newDate).getTime()-safeDate(r.originalDate).getTime())/86400000);
  const avgDelayDays = delays.reduce((a,b)=>a+b,0)/delays.length;
  const reasonCounts = {};
  all.forEach(r => { if (r.reason) reasonCounts[r.reason] = (reasonCounts[r.reason]||0)+1; });
  const mostCommonReason = Object.entries(reasonCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || null;
  return { count: all.length, avgDelayDays, mostCommonReason, entries: all };
}

// ─── Longitudinal analysis engine ───────────────────────────────────────────
// Builds on getNormalizedSymptomEvents() rather than re-parsing logs — every function
// here works for ANY symptom/compound in the system, nothing is hardcoded to GI/Retatrutide.

function getSymptomCategory(name) {
  for (const [cat, syms] of Object.entries(SYMPTOM_GROUPS)) { if (syms.includes(name)) return cat; }
  return "Other";
}

// Time-windowed stats for a rolling period — frequency, streaks, logged-day denominator.
function getPeriodStats(days, endDateStr) {
  endDateStr = endDateStr || localDate();
  const endMs = safeDate(endDateStr).getTime();
  const startMs = endMs - (days-1)*86400000;
  const startDateStr = dayKey(new Date(startMs));
  const inRange = d => { const t=safeDate(d).getTime(); return t>=startMs && t<=endMs; };

  const events = getNormalizedSymptomEvents().filter(e=>inRange(e.date));
  const loggedDates = [...new Set((state.dailyLogs||[]).filter(l=>inRange(l.date)).map(l=>dayKey(l.date)))];

  const byDate = {};
  events.forEach(e=>{ const k=dayKey(e.date); (byDate[k]=byDate[k]||new Set()).add(e.symptom); });

  const bySymptom = {};
  events.forEach(e=>{ (bySymptom[e.symptom]=bySymptom[e.symptom]||new Set()).add(dayKey(e.date)); });

  const symptomStats = Object.entries(bySymptom).map(([sym, dateSet])=>{
    const dates = [...dateSet].sort();
    let streak=0, cursor=dates[dates.length-1];
    while (dates.includes(cursor)) { streak++; cursor = addDays(cursor,-1); }
    return { symptom:sym, category:getSymptomCategory(sym), daysLogged:dates.length, dates, streak };
  }).sort((a,b)=>b.daysLogged-a.daysLogged);

  return { startDate:startDateStr, endDate:endDateStr, days, loggedDatesCount:loggedDates.length, symptomStats, events, byDate };
}

// Compares a period against the equivalent prior period (e.g. last 7 vs previous 7).
function comparePeriodToPrevious(days, endDateStr) {
  endDateStr = endDateStr || localDate();
  const current = getPeriodStats(days, endDateStr);
  const prevEnd = addDays(current.startDate, -1);
  const previous = getPeriodStats(days, prevEnd);
  const currentSymptoms = new Set(current.symptomStats.map(s=>s.symptom));
  const previousSymptoms = new Set(previous.symptomStats.map(s=>s.symptom));
  const newlyAppearing = [...currentSymptoms].filter(s=>!previousSymptoms.has(s));
  const disappeared = [...previousSymptoms].filter(s=>!currentSymptoms.has(s));
  const changed = [...currentSymptoms].filter(s=>previousSymptoms.has(s)).map(s=>{
    const c = current.symptomStats.find(x=>x.symptom===s).daysLogged;
    const p = previous.symptomStats.find(x=>x.symptom===s).daysLogged;
    return { symptom:s, current:c, previous:p, direction: c>p?"increasing":c<p?"decreasing":"stable" };
  });
  return { current, previous, newlyAppearing, disappeared, changed };
}

// Data-driven symptom cluster discovery — finds what actually co-occurs in THIS person's
// data, for any symptoms, rather than checking against a predefined combination list.
function detectSymptomClusters(lookbackDays=60) {
  const cutoff = addDays(localDate(), -lookbackDays);
  const events = getNormalizedSymptomEvents().filter(e=>e.date>=cutoff);
  const byDate = {};
  events.forEach(e=>{ const k=dayKey(e.date); (byDate[k]=byDate[k]||new Set()).add(e.symptom); });
  const days = Object.keys(byDate);

  const symptomDayCount = {};
  const pairCooccur = {};
  days.forEach(d=>{
    const syms = [...byDate[d]];
    syms.forEach(s=>{ symptomDayCount[s]=(symptomDayCount[s]||0)+1; });
    for (let i=0;i<syms.length;i++) for (let j=i+1;j<syms.length;j++) {
      const key = [syms[i],syms[j]].sort().join("|||");
      pairCooccur[key] = (pairCooccur[key]||0)+1;
    }
  });

  const strongPairs = Object.entries(pairCooccur).map(([key,count])=>{
    const [a,b] = key.split("|||");
    const rateA = count/symptomDayCount[a], rateB = count/symptomDayCount[b];
    return { a, b, count, rateA, rateB, maxRate: Math.max(rateA,rateB) };
  }).filter(p=>p.count>=3 && p.maxRate>=0.5);

  const parent = {};
  const find = x => { if(!(x in parent)) parent[x]=x; while(parent[x]!==x) x=parent[x]=parent[parent[x]]; return x; };
  const union = (x,y) => { const rx=find(x), ry=find(y); if(rx!==ry) parent[rx]=ry; };
  strongPairs.forEach(p=>union(p.a,p.b));

  const groups = {};
  strongPairs.forEach(p=>{ [p.a,p.b].forEach(s=>{ const root=find(s); (groups[root]=groups[root]||new Set()).add(s); }); });

  return Object.values(groups).filter(g=>g.size>=2).map(g=>{
    const symptoms = [...g];
    const clusterDays = days.filter(d=>symptoms.filter(s=>byDate[d].has(s)).length>=2).sort();
    return {
      symptoms, sampleDays: clusterDays.length, dates: clusterDays,
      pairs: strongPairs.filter(p=>symptoms.includes(p.a)&&symptoms.includes(p.b)),
    };
  }).sort((a,b)=>b.sampleDays-a.sampleDays);
}

// General change-point detector — finds a date where the DOMINANT symptom within a
// category shifted (e.g. constipation-dominant -> diarrhea-dominant), using binary
// segmentation. Works for any category and any pair of symptoms within it; nothing here
// is specific to GI/Digestive.
function detectCategoryChangePoint(category, lookbackDays=21) {
  const cutoff = addDays(localDate(), -lookbackDays);
  const events = getNormalizedSymptomEvents().filter(e=>getSymptomCategory(e.symptom)===category && e.date>=cutoff);
  const byDate = {};
  events.forEach(e=>{ const k=dayKey(e.date); (byDate[k]=byDate[k]||new Set()).add(e.symptom); });
  const dates = Object.keys(byDate).sort();
  if (dates.length < 4) return null;

  let best = null;
  for (let i=2; i<dates.length-1; i++) {
    const before = dates.slice(0,i), after = dates.slice(i);
    const beforeCounts={}, afterCounts={};
    before.forEach(d=>byDate[d].forEach(s=>beforeCounts[s]=(beforeCounts[s]||0)+1));
    after.forEach(d=>byDate[d].forEach(s=>afterCounts[s]=(afterCounts[s]||0)+1));
    const domBefore = Object.entries(beforeCounts).sort((a,b)=>b[1]-a[1])[0];
    const domAfter = Object.entries(afterCounts).sort((a,b)=>b[1]-a[1])[0];
    if (!domBefore || !domAfter || domBefore[0]===domAfter[0]) continue;
    const overlapScore = (afterCounts[domBefore[0]]||0) + (beforeCounts[domAfter[0]]||0);
    const separationScore = domBefore[1] + domAfter[1] - overlapScore;
    if (!best || separationScore > best.separationScore) {
      best = { splitDate: dates[i], symptomBefore: domBefore[0], symptomAfter: domAfter[0], countBefore: domBefore[1], countAfter: domAfter[1], daysBefore: before.length, daysAfter: after.length, separationScore };
    }
  }
  if (!best || best.separationScore < 3) return null; // require a genuinely clean split, not noise
  return { category, ...best };
}

// Scans every category with enough data for a change point — this is what makes the
// engine work for GI, sleep, mood, skin, or any future category without hardcoding.
function detectAllChangePoints(lookbackDays=21) {
  return Object.keys(SYMPTOM_GROUPS)
    .map(cat => detectCategoryChangePoint(cat, lookbackDays))
    .filter(Boolean)
    .sort((a,b)=>b.separationScore-a.separationScore);
}

// Drill-down: everything relevant in a window around a date — doses, dose changes,
// reschedules, and written notes. This is the "Why did this happen?" timeline.
function buildWhyDateContext(centerDate, windowDays=3) {
  const startMs = safeDate(centerDate).getTime() - windowDays*86400000;
  const endMs = safeDate(centerDate).getTime() + windowDays*86400000;
  const inWindow = d => { const t=safeDate(d).getTime(); return t>=startMs && t<=endMs; };

  const aps = allPeptides();
  const doseEvents = [];
  Object.entries(aps).forEach(([name,p])=>{
    const sorted = [...(p.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
    sorted.forEach((d,i)=>{
      if (!inWindow(d.date)) return;
      const prev = sorted[i-1];
      const changed = prev && parseFloat(prev.dose)!==parseFloat(d.dose);
      doseEvents.push({ date:d.date, compound:name, dose:d.dose, unit:cfg(name).unit||"mg", changed, prevDose:prev?prev.dose:null, isFirst:!prev });
    });
    (p.reschedules||[]).forEach(r=>{ if (inWindow(r.originalDate)) doseEvents.push({ date:r.originalDate, compound:name, type:"rescheduled", to:r.newDate, reason:r.reason }); });
  });

  const notes = [];
  (state.dailyLogs||[]).forEach(l=>{
    if (inWindow(l.date) && (l.notes||"").trim()) notes.push({ date:l.date, text:l.notes });
    (l.updates||[]).forEach(u=>{ if (inWindow(u.time||l.date) && (u.notes||"").trim()) notes.push({ date:u.time||l.date, text:u.notes }); });
  });

  const symptomEvents = getNormalizedSymptomEvents().filter(e=>inWindow(e.date));

  return {
    centerDate,
    doseEvents: doseEvents.sort((a,b)=>new Date(a.date)-new Date(b.date)),
    notes: notes.sort((a,b)=>new Date(a.date)-new Date(b.date)),
    symptomEvents: symptomEvents.sort((a,b)=>new Date(a.date)-new Date(b.date)),
  };
}

// ─── Section 4: Dose → Symptom timing windows ───────────────────────────────
// Bucket every occurrence of a symptom by hours/days since the nearest prior dose of a
// given compound, and flag whether other compounds were also recently active — never
// hides that ambiguity behind a clean-looking number.
function analyzeDoseSymptomTiming(compoundName, symptomName) {
  const aps = allPeptides();
  const events = getNormalizedSymptomEvents().filter(e=>e.symptom===symptomName && e.linkedCompounds.includes(compoundName));
  if (events.length < 3) return { compound:compoundName, symptom:symptomName, totalOccurrences:events.length, tooEarly:true };

  const windows = [
    {label:"0–12h", min:0, max:0.5}, {label:"12–24h", min:0.5, max:1},
    {label:"24–48h", min:1, max:2}, {label:"48–72h", min:2, max:3},
    {label:"3–5 days", min:3, max:5}, {label:"5–7 days", min:5, max:7},
  ].map(w=>({...w, count:0, dates:[]}));

  const activeCompoundNames = Object.entries(aps).filter(([,p])=>(p.doses||[]).length && (p.status||"active")==="active").map(([n])=>n);
  let outsideWindow=0, overlapCount=0;

  events.forEach(e=>{
    const cc = e.compoundContext.find(c=>c.compound===compoundName);
    const days = cc ? cc.daysSinceDose : null;
    if (days==null) outsideWindow++;
    else {
      const bucket = windows.find(w=>days>=w.min && days<w.max);
      if (bucket) { bucket.count++; bucket.dates.push(e.date); } else outsideWindow++;
    }
    const otherRecent = activeCompoundNames.filter(name=>{
      if (name===compoundName) return false;
      return (aps[name].doses||[]).some(d=>{ const diff=(safeDate(e.date).getTime()-safeDate(d.date).getTime())/86400000; return diff>=0 && diff<=3; });
    });
    if (otherRecent.length>0) overlapCount++;
  });

  const strongest = [...windows].sort((a,b)=>b.count-a.count)[0];
  return {
    compound:compoundName, symptom:symptomName, totalOccurrences:events.length, windows,
    outsideWindow, strongestWindow: strongest.count>0?strongest:null,
    overlapCount, overlapRate: events.length?overlapCount/events.length:0,
  };
}

// ─── Section 5: Dose-level comparison, normalized by exposure time ─────────
// Groups dose history into level periods (merging non-contiguous stretches at the same
// amount), then compares symptom RATE per exposure-day at each level — never raw counts,
// since a level held for 20 days will naturally accumulate more raw occurrences than one
// held for 5, regardless of whether it's actually worse.
function compareDoseLevel(compoundName, symptomCategory) {
  const p = allPeptides()[compoundName]; if (!p) return null;
  const doses = [...(p.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (doses.length < 2) return null;

  const periods = [];
  let cur = null;
  doses.forEach(d=>{
    const amt = parseFloat(d.dose);
    if (!cur || cur.amount !== amt) { cur = { amount:amt, startDate:d.date, endDate:null }; periods.push(cur); }
  });
  for (let i=0;i<periods.length;i++) periods[i].endDate = periods[i+1] ? periods[i+1].startDate : localDate();

  const events = getNormalizedSymptomEvents().filter(e=>e.linkedCompounds.includes(compoundName) && (!symptomCategory || getSymptomCategory(e.symptom)===symptomCategory));

  const merged = {};
  periods.forEach(period=>{
    const exposureDays = Math.max(1, Math.round((safeDate(period.endDate).getTime()-safeDate(period.startDate).getTime())/86400000));
    const symptomDays = new Set(events.filter(e=>e.date>=period.startDate && e.date<period.endDate).map(e=>dayKey(e.date))).size;
    if (!merged[period.amount]) merged[period.amount] = { amount:period.amount, exposureDays:0, symptomDays:0, dateRanges:[] };
    merged[period.amount].exposureDays += exposureDays;
    merged[period.amount].symptomDays += symptomDays;
    merged[period.amount].dateRanges.push([period.startDate, period.endDate]);
  });

  const levels = Object.values(merged).map(m=>({...m, rate: m.symptomDays/m.exposureDays})).sort((a,b)=>a.amount-b.amount);
  return { compound:compoundName, category:symptomCategory||"all", levels, unit: cfg(compoundName).unit||"mg" };
}

// ─── Section 6: Before/After a meaningful event ─────────────────────────────
// Detects real events from actual dose history (started, increased, decreased, gap
// long enough to read as a pause, stopped) — never invented, always traceable to a
// specific logged record.
function detectMeaningfulEvents(compoundName) {
  const p = allPeptides()[compoundName]; if (!p) return [];
  const out = [];
  const doses = [...(p.doses||[])].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const scheduleDays = p.scheduleDays || 7;

  doses.forEach((d,i)=>{
    if (i===0) { out.push({ type:"compound_started", date:d.date, detail:`Started ${compoundName}` }); return; }
    const prevAmt = parseFloat(doses[i-1].dose), curAmt = parseFloat(d.dose);
    if (curAmt > prevAmt) out.push({ type:"dose_increase", date:d.date, detail:`Increased from ${doses[i-1].dose} to ${d.dose}${cfg(compoundName).unit||"mg"}`, from:doses[i-1].dose, to:d.dose });
    else if (curAmt < prevAmt) out.push({ type:"dose_decrease", date:d.date, detail:`Decreased from ${doses[i-1].dose} to ${d.dose}${cfg(compoundName).unit||"mg"}`, from:doses[i-1].dose, to:d.dose });
    const gap = (safeDate(d.date).getTime()-safeDate(doses[i-1].date).getTime())/86400000;
    if (gap > scheduleDays*2.5) {
      out.push({ type:"protocol_paused", date:doses[i-1].date, detail:`Gap of ${Math.round(gap)}d began after this dose` });
      out.push({ type:"protocol_resumed", date:d.date, detail:`Resumed after a ${Math.round(gap)}d gap` });
    }
  });
  if (p.status==="archived" && doses.length) out.push({ type:"compound_stopped", date:doses[doses.length-1].date, detail:`${compoundName} stopped` });
  return out.sort((a,b)=>new Date(a.date)-new Date(b.date));
}

function beforeAfterAnalysis(compoundName, eventDate, windowDays=14) {
  const events = getNormalizedSymptomEvents().filter(e=>e.linkedCompounds.includes(compoundName));
  const beforeStart = addDays(eventDate, -windowDays);
  const afterEnd = addDays(eventDate, windowDays);
  const before = events.filter(e=>e.date>=beforeStart && e.date<eventDate);
  const after = events.filter(e=>e.date>=eventDate && e.date<afterEnd);

  const beforeBy = {}, afterBy = {};
  before.forEach(e=>{ (beforeBy[e.symptom]=beforeBy[e.symptom]||new Set()).add(dayKey(e.date)); });
  after.forEach(e=>{ (afterBy[e.symptom]=afterBy[e.symptom]||new Set()).add(dayKey(e.date)); });

  const allSymptoms = [...new Set([...Object.keys(beforeBy), ...Object.keys(afterBy)])];
  const comparison = allSymptoms.map(sym=>({
    symptom:sym, polarity:classifySymptomPolarity(sym),
    beforeDays: beforeBy[sym]?beforeBy[sym].size:0, afterDays: afterBy[sym]?afterBy[sym].size:0,
  })).sort((a,b)=>(b.beforeDays+b.afterDays)-(a.beforeDays+a.afterDays));

  const afterDaysElapsed = Math.min(windowDays, Math.round((Date.now()-safeDate(eventDate).getTime())/86400000));
  return { compound:compoundName, eventDate, windowDays, comparison, afterDaysElapsed, sufficientData: afterDaysElapsed>=5 };
}

// ─── Section 9: Cross-symptom sequences (A commonly precedes B) ────────────
// Data-driven day-over-day sequence detection — no predefined "sleep causes fatigue"
// assumption; discovers whatever sequence actually recurs in this person's own logs.
function detectSymptomSequences(lookbackDays=60) {
  const cutoff = addDays(localDate(), -lookbackDays);
  const events = getNormalizedSymptomEvents().filter(e=>e.date>=cutoff);
  const byDate = {};
  events.forEach(e=>{ const k=dayKey(e.date); (byDate[k]=byDate[k]||new Set()).add(e.symptom); });
  const dates = Object.keys(byDate).sort();

  const pairFollow = {}, aOccurrences = {};
  dates.forEach(d=>{
    const nextDate = addDays(d,1);
    const symsToday = [...byDate[d]];
    const symsNext = byDate[nextDate] ? [...byDate[nextDate]] : [];
    symsToday.forEach(a=>{
      aOccurrences[a] = (aOccurrences[a]||0)+1;
      symsNext.forEach(b=>{
        if (a===b) return;
        const key = a+"→"+b;
        pairFollow[key] = (pairFollow[key]||0)+1;
      });
    });
  });

  return Object.entries(pairFollow).map(([key,count])=>{
    const [a,b] = key.split("→");
    return { from:a, to:b, count, aTotal:aOccurrences[a], rate: count/aOccurrences[a] };
  }).filter(s=>s.count>=3 && s.rate>=0.5).sort((a,b)=>b.rate-a.rate || b.count-a.count);
}

// ─── Section 10: Personal baseline vs current ───────────────────────────────
// Rolling personal baseline (default 30d) vs a recent window (default 7d), expressed as
// a multiplier — always relative to the person's own history, never a universal norm.
function getBaselineVsCurrent(category, currentDays=7, baselineDays=30) {
  const current = getPeriodStats(currentDays);
  const baselineEnd = addDays(current.startDate, -1);
  const baseline = getPeriodStats(baselineDays, baselineEnd);
  const inCategory = e => !category || getSymptomCategory(e.symptom)===category;

  const currentCatDays = new Set(current.events.filter(inCategory).map(e=>dayKey(e.date))).size;
  const baselineCatDays = new Set(baseline.events.filter(inCategory).map(e=>dayKey(e.date))).size;
  const currentRate = current.loggedDatesCount ? currentCatDays/current.loggedDatesCount : null;
  const baselineRate = baseline.loggedDatesCount ? baselineCatDays/baseline.loggedDatesCount : null;
  const multiplier = (baselineRate && baselineRate>0) ? currentRate/baselineRate : null;

  return {
    category: category||"all",
    current: { days:currentCatDays, logged:current.loggedDatesCount, rate:currentRate },
    baseline: { days:baselineCatDays, logged:baseline.loggedDatesCount, rate:baselineRate },
    multiplier,
  };
}

// ─── Symptom-sequence engine: persistent symptom -> opposite symptom ───────
// "Opposite" isn't something the app can honestly infer from category membership alone —
// Nausea and Bloating are both Digestive but aren't opposites. This is a small, explicit,
// defensible table (same pattern as SYMPTOM_POLARITY) rather than a hardcoded C/D special
// case: the DETECTION MECHANISM below is fully general and works for any pair in the table.
const SYMPTOM_OPPOSITE_PAIRS = [
  { a:"Constipation", b:"Diarrhea", category:"Digestive",
    interpretations: ["Overflow diarrhea following a period of constipation","Acute gastrointestinal illness","Food-related gastrointestinal episode","Compound/medication-associated GI effects","Other gastrointestinal change"] },
  { a:"Insomnia", b:"Drowsiness", category:"Energy & Sleep",
    interpretations: ["Sleep-wake rhythm disruption","A rebound effect after a period of poor sleep","Illness or recovery-related fatigue","Other cause"] },
  { a:"Reduced appetite", b:"Appetite return", category:"Appetite & Food",
    interpretations: ["An expected wear-off pattern as dose effects fade","Tolerance developing at the current dose","Other appetite-related change"] },
  { a:"Food noise quiet", b:"Food noise return", category:"Appetite & Food",
    interpretations: ["An expected wear-off pattern as dose effects fade","Tolerance developing at the current dose","Other appetite-related change"] },
];

// Detects: a genuinely PERSISTENT period of symptom A (repeated/streaked logging), followed
// chronologically by a real STREAK of its paired symptom B — not an isolated day, not an
// interleaved back-and-forth. Requires real separation, matching the spirit of a
// change-point rather than noise.
function detectOppositeTransitions(lookbackDays=45) {
  const cutoff = addDays(localDate(), -lookbackDays);
  const events = getNormalizedSymptomEvents().filter(e=>e.date>=cutoff);
  const byDate = {};
  events.forEach(e=>{ const k=dayKey(e.date); (byDate[k]=byDate[k]||new Set()).add(e.symptom); });
  const dates = Object.keys(byDate).sort();

  const results = [];
  SYMPTOM_OPPOSITE_PAIRS.forEach(pair=>{
    const aDates = dates.filter(d=>byDate[d].has(pair.a));
    const bDates = dates.filter(d=>byDate[d].has(pair.b));
    if (aDates.length < 3 || bDates.length < 2) return;

    const lastADate = aDates[aDates.length-1];
    const firstBDateAfterA = bDates.find(d=>d>lastADate);
    if (!firstBDateAfterA) return; // B must genuinely follow A, not interleave with it

    let longestAStreak=1, curStreak=1;
    for (let i=1;i<aDates.length;i++){ if (addDays(aDates[i-1],1)===aDates[i]) { curStreak++; longestAStreak=Math.max(longestAStreak,curStreak); } else curStreak=1; }

    const bAfter = bDates.filter(d=>d>=firstBDateAfterA);
    let bStreak=1;
    for (let i=1;i<bAfter.length;i++){ if (addDays(bAfter[i-1],1)===bAfter[i]) bStreak++; else break; }
    if (bStreak < 2) return; // require a real streak, not one isolated day

    results.push({
      symptomA: pair.a, symptomB: pair.b, category: pair.category,
      aDates, aDaysTotal: aDates.length, aLongestStreak: longestAStreak, aFirstDate: aDates[0], aLastDate: lastADate,
      bDates: bAfter.slice(0,bStreak), bStreakLength: bStreak, bFirstDate: firstBDateAfterA,
      interpretations: pair.interpretations,
    });
  });
  return results;
}

// ─── Rapid weight-change confounder engine ──────────────────────────────────
// Never labels a rapid change as fat loss/gain — actively searches for reasons NOT to
// overinterpret it (GI symptoms, low intake, illness notes, activity spikes), and
// produces a confidence rating that's explicitly capped when data is incomplete.
function detectRapidWeightChanges(minLbChange=2, maxWindowDays=10) {
  const logs = (state.weightLogs||[]).filter(w=>w.weight!=null && w.weight!=="")
    .map(w=>({date:dayKey(w.date), weight:parseFloat(w.weight)})).sort((a,b)=>a.date.localeCompare(b.date));
  if (logs.length < 3) return [];

  const events = [];
  for (let i=0;i<logs.length;i++){
    for (let j=i+1;j<logs.length;j++){
      const daysBetween = (safeDate(logs[j].date).getTime()-safeDate(logs[i].date).getTime())/86400000;
      if (daysBetween > maxWindowDays) break;
      const delta = logs[j].weight - logs[i].weight;
      if (Math.abs(delta) >= minLbChange && daysBetween >= 1) {
        events.push({ startDate:logs[i].date, endDate:logs[j].date, startWeight:logs[i].weight, endWeight:logs[j].weight, delta, days:daysBetween });
      }
    }
  }
  // Keep the strongest (highest rate of change) non-overlapping events, greedily.
  events.sort((a,b)=>(Math.abs(b.delta)/b.days)-(Math.abs(a.delta)/a.days));
  const chosen = [];
  events.forEach(e=>{ if (!chosen.some(c=>e.startDate<=c.endDate && e.endDate>=c.startDate)) chosen.push(e); });
  return chosen.sort((a,b)=>a.startDate.localeCompare(b.startDate));
}

function analyzeWeightChangeConfounders(changeEvent) {
  const { startDate, endDate } = changeEvent;
  const windowStart = addDays(startDate, -2);
  const events = getNormalizedSymptomEvents().filter(e=>e.date>=windowStart && e.date<=endDate);

  const giSymptomNames = new Set(SYMPTOM_GROUPS["Digestive"]||[]);
  const giDays = new Set(events.filter(e=>giSymptomNames.has(e.symptom)).map(e=>dayKey(e.date)));
  const hasDiarrhea = events.some(e=>e.symptom==="Diarrhea");
  const hasVomiting = events.some(e=>e.symptom==="Vomiting");

  const notesInWindow = [];
  (state.dailyLogs||[]).forEach(l=>{
    if (l.date>=windowStart && l.date<=endDate && (l.notes||"").trim()) notesInWindow.push(l.notes);
    (l.updates||[]).forEach(u=>{ const ud=dayKey(u.time||l.date); if (ud>=windowStart && ud<=endDate && (u.notes||"").trim()) notesInWindow.push(u.notes); });
  });
  const hasIllnessNote = notesInWindow.some(n=>/sick|flu|fever|cold\b|illness|vomit|throwing up|virus/i.test(n));
  const hasHydrationNote = notesInWindow.some(n=>/dehydrat|hydration|not drinking/i.test(n));

  const macroLogsInWindow = (state.macroLogs||[]).filter(m=>{ const d=dayKey(m.date); return d>=windowStart && d<=endDate; });
  const avgCaloriesInWindow = macroLogsInWindow.length ? macroLogsInWindow.reduce((a,m)=>a+(parseFloat(m.calories)||0),0)/macroLogsInWindow.length : null;
  const baselineMacroLogs = (state.macroLogs||[]).filter(m=>{ const d=dayKey(m.date); return d<windowStart && d>=addDays(windowStart,-14); });
  const avgCaloriesBaseline = baselineMacroLogs.length ? baselineMacroLogs.reduce((a,m)=>a+(parseFloat(m.calories)||0),0)/baselineMacroLogs.length : null;
  const lowIntake = (avgCaloriesInWindow!=null && avgCaloriesBaseline!=null && avgCaloriesInWindow < avgCaloriesBaseline*0.8);

  const activityInWindow = (state.activityLogs||[]).filter(a=>a.isWorkout && dayKey(a.date)>=windowStart && dayKey(a.date)<=endDate);
  const highActivity = activityInWindow.length >= 3;

  const confounders = [];
  if (hasDiarrhea) confounders.push({ type:"diarrhea", label:"Diarrhea logged during this window", weight:0.9 });
  if (hasVomiting) confounders.push({ type:"vomiting", label:"Vomiting logged during this window", weight:0.9 });
  if (giDays.size>=2 && !hasDiarrhea && !hasVomiting) confounders.push({ type:"gi_general", label:"Other GI symptoms logged during this window", weight:0.5 });
  if (hasIllnessNote) confounders.push({ type:"illness", label:"Notes mention possible illness", weight:0.6 });
  if (lowIntake) confounders.push({ type:"low_intake", label:`Average intake in this window (${Math.round(avgCaloriesInWindow)} cal) was notably lower than your recent baseline (${Math.round(avgCaloriesBaseline)} cal)`, weight:0.5 });
  if (highActivity) confounders.push({ type:"high_activity", label:"Multiple workouts logged in this window", weight:0.4 });
  if (hasHydrationNote) confounders.push({ type:"hydration", label:"Notes mention hydration", weight:0.3 });

  const dataGaps = [];
  if (!macroLogsInWindow.length) dataGaps.push("hydration/calorie intake is not consistently logged");
  if (giDays.size && !hasDiarrhea && !hasVomiting) dataGaps.push("bowel output/severity is not quantified");
  dataGaps.push("short-term weight is sensitive to fluid changes");

  const strongScore = confounders.reduce((a,c)=>a+c.weight,0);
  let confidence = "Low";
  if (confounders.length===0) confidence = "Unclear";
  else if (strongScore>=0.8) confidence = "Moderate";

  return { confounders, dataGaps, confidence, giDaysCount: giDays.size, avgCaloriesInWindow, avgCaloriesBaseline };
}

function analyzeWeightChangeEvent(changeEvent) {
  const cf = analyzeWeightChangeConfounders(changeEvent);
  const { startDate, endDate, startWeight, endWeight, delta, days } = changeEvent;
  const unit = state.settings.weightUnit || "lbs";
  const direction = delta<0 ? "fell" : "rose";

  let narrative = `Your weight ${direction} ${Math.abs(delta).toFixed(1)} ${unit} over ${Math.round(days)} day${days===1?"":"s"} (${fmtDate(startDate)} to ${fmtDate(endDate)}).`;
  const giConfounder = cf.confounders.find(c=>c.type==="diarrhea"||c.type==="vomiting"||c.type==="gi_general");
  if (giConfounder && delta<0) {
    narrative += ` This overlaps ${cf.giDaysCount} day(s) of GI symptoms. Because the change happened over a short window while GI symptoms were being logged, some of it may reflect temporary fluid or digestive-content loss rather than a true change in body tissue.`;
  } else if (cf.confounders.length) {
    narrative += ` ${cf.confounders.map(c=>c.label).join(". ")}.`;
  } else {
    narrative += ` No clear confounders were found in your logged data for this window.`;
  }
  narrative += delta<0 ? ` Watch whether weight stabilizes or partially rebounds over the next several days.` : ` Watch whether this holds over the next several days before treating it as a real shift.`;

  return { ...changeEvent, unit, narrative, confounders: cf.confounders, dataGaps: cf.dataGaps, confidence: cf.confidence };
}

function detectAndAnalyzeWeightChanges() {
  return detectRapidWeightChanges().map(analyzeWeightChangeEvent);
}

// ─── Scale weight vs. underlying trend ──────────────────────────────────────
// Distinguishes the single most recent scale reading from a smoothed trend, and flags
// when a "new low" overlaps a detected symptom episode — so a fluid-driven dip doesn't
// get celebrated as if it were a genuine new baseline.
function getWeightTrendVsScale() {
  const logs = (state.weightLogs||[]).filter(w=>w.weight!=null && w.weight!=="")
    .map(w=>({date:dayKey(w.date), weight:parseFloat(w.weight)})).sort((a,b)=>a.date.localeCompare(b.date));
  if (!logs.length) return null;

  const currentScale = logs[logs.length-1].weight;
  const currentDate = logs[logs.length-1].date;
  const sevenAgo = addDays(currentDate, -7);
  const last7 = logs.filter(l=>l.date>=sevenAgo);
  const trend7 = last7.length ? last7.reduce((a,l)=>a+l.weight,0)/last7.length : null;

  const fourteenAgo = addDays(currentDate, -14);
  const last14 = logs.filter(l=>l.date>=fourteenAgo);
  const recentLow = last14.length ? last14.reduce((a,l)=>l.weight<a.weight?l:a) : null;

  let lowOverlapsEpisode = null;
  if (recentLow) {
    const transitions = detectOppositeTransitions(45);
    const overlapping = transitions.find(t=>recentLow.date>=t.bFirstDate && recentLow.date<=addDays(t.bFirstDate, t.bStreakLength-1));
    if (overlapping) lowOverlapsEpisode = { category:overlapping.category, symptom:overlapping.symptomB, startDate:overlapping.bFirstDate };
    else {
      const nearbyEvents = getNormalizedSymptomEvents().filter(e=>Math.abs((safeDate(e.date).getTime()-safeDate(recentLow.date).getTime())/86400000)<=2 && getSymptomCategory(e.symptom)==="Digestive");
      if (nearbyEvents.length>=2) lowOverlapsEpisode = { category:"Digestive", symptom:nearbyEvents[0].symptom, startDate:nearbyEvents[0].date };
    }
  }

  return { currentScale, currentDate, trend7, recentLow, lowOverlapsEpisode, unit: state.settings.weightUnit||"lbs" };
}

function getNormalizedSymptomEvents() {
  const events = [];
  const aps = allPeptides();

  state.dailyLogs.forEach(log => {
    const tags = log.symptomTags || {};
    (log.symptoms || []).forEach(s => {
      const symName = typeof s === "string" ? s : s.name;
      const intensity = (typeof s === "object" && s.intensity != null) ? s.intensity : null;
      let linkedCompounds = [], source;
      if (tags[symName] && tags[symName].length) {
        // "Not sure" is a real, intentional tag value — keep the symptom in universal/
        // body-level analysis but never attribute it to a specific compound.
        if (tags[symName].includes("Not sure")) { linkedCompounds = []; source = "tagged_not_sure"; }
        else { linkedCompounds = tags[symName].filter(c => c !== "General"); source = "symptomTags"; }
      } else if (log.compound) {
        // Legacy fallback ONLY reached when symptomTags has no entry for this symptom —
        // structurally prevents double-counting between the two sources.
        linkedCompounds = [log.compound]; source = "legacy_compound";
      } else {
        linkedCompounds = []; source = "untagged";
      }
      events.push(buildNormalizedEvent(log.date, symName, intensity, linkedCompounds, source, aps));
    });
  });

  // Symptoms attached directly to a dose record are inherently compound-linked (the dose
  // IS the compound) — a distinct source from daily check-ins, so no overlap risk.
  Object.entries(aps).forEach(([name, p]) => {
    (p.doses || []).forEach(d => {
      (d.symptoms || []).forEach(s => {
        const symName = typeof s === "string" ? s : s.name;
        const intensity = (typeof s === "object" && s.intensity != null) ? s.intensity : null;
        events.push(buildNormalizedEvent(d.date, symName, intensity, [name], "dose_log", aps));
      });
    });
  });

  return events;
}

function buildNormalizedEvent(date, symptom, intensity, linkedCompounds, source, aps) {
  const eventTime = new Date(date).getTime();
  const compoundContext = linkedCompounds.map(cName => {
    const p = aps[cName]; const c = cfg(cName);
    const base = { compound: cName, daysSinceDose: null, hoursSinceDose: null, doseAmount: null, doseUnit: c.unit || "mg", dosePhase: null, injectionSite: null };
    if (!p || !(p.doses || []).length) return base;
    const sorted = [...p.doses].sort((a, b) => new Date(a.date) - new Date(b.date));
    let nearestDose = null, bestDiff = null;
    sorted.forEach(d => {
      const diff = (eventTime - new Date(d.date).getTime()) / 86400000;
      if (diff >= 0 && (bestDiff === null || diff < bestDiff)) { bestDiff = diff; nearestDose = d; }
    });
    const phase = (c.phases && bestDiff != null) ? currentPhase(c.phases, bestDiff) : null;
    return {
      compound: cName, daysSinceDose: bestDiff, hoursSinceDose: bestDiff != null ? Math.round(bestDiff * 24) : null,
      doseAmount: nearestDose ? nearestDose.dose : null, doseUnit: c.unit || "mg",
      dosePhase: phase ? phase.label : null, injectionSite: nearestDose ? nearestDose.site : null,
    };
  });
  return { date, symptom, intensity, linkedCompounds, source, compoundContext };
}

// ─── Insights candidate engine ──────────────────────────────────────────────
// Compound-specific analysis lens — NOT the same template for every compound.
// Unprofiled compounds fall back to "general", which only shows lenses their actual
// logged data supports (no fabricated categories for compounds with no profile).
const COMPOUND_ANALYSIS_CATEGORY = {
  "Retatrutide":"appetite_glp1", "Semaglutide":"appetite_glp1", "Tirzepatide":"appetite_glp1",
  "GHK-Cu":"healing_repair", "BPC-157":"healing_repair", "TB-500":"healing_repair",
  "MOTS-c":"metabolic",
  "Selank":"cognitive", "Semax":"cognitive", "Dihexa":"cognitive",
  "DSIP":"sleep_longevity", "Epithalon":"sleep_longevity",
};
function getCompoundAnalysisCategory(name) { return COMPOUND_ANALYSIS_CATEGORY[name] || "general"; }

function rankInsightCandidates(candidates) {
  return candidates
    .map(c => ({ ...c, score: (c.confidence ?? 0.5) * (c.relevance ?? 0.5) * (c.actionability ?? 0.5) * (c.novelty ?? 0.5) }))
    .sort((a, b) => b.score - a.score);
}

// Event-based dose-change comparison — fixed to only count events actually linked to
// THIS compound (the old code counted every daily log regardless of attribution).
function genDoseChangeCandidates(name, doses, events, c) {
  const out = [];
  const compEvents = events.filter(e => e.linkedCompounds.includes(name));
  for (let i = 1; i < doses.length; i++) {
    if (!(parseFloat(doses[i].dose) > parseFloat(doses[i - 1].dose))) continue;
    const incDate = new Date(doses[i].date).getTime();
    const before = compEvents.filter(e => { const d = new Date(e.date).getTime(); return d < incDate && d >= incDate - 14 * 86400000; });
    const after = compEvents.filter(e => { const d = new Date(e.date).getTime(); return d >= incDate && d < incDate + 14 * 86400000; });
    if (before.length < 3 || after.length < 3) continue;
    const burdenB = before.filter(e => classifySymptomPolarity(e.symptom) === "burden").length;
    const burdenA = after.filter(e => classifySymptomPolarity(e.symptom) === "burden").length;
    const rateB = burdenB / before.length, rateA = burdenA / after.length;
    if (rateB === 0 && rateA === 0) continue;
    const pct = rateB > 0 ? Math.round((rateA - rateB) / rateB * 100) : 100;
    if (Math.abs(pct) < 25 && !(rateB === 0 && rateA > 0)) continue;
    const improved = rateA < rateB;
    out.push({
      id: `dose_change:${name}:${doses[i].date}`, category: "dose_response",
      headline: `${improved ? "Symptoms eased" : "More symptoms appeared"} after increasing ${name} to ${doses[i].dose}${c.unit}`,
      evidence: `Since increasing ${name} from ${doses[i - 1].dose} to ${doses[i].dose}${c.unit} on ${fmtDate(doses[i].date)}, burden-type check-ins went from ${burdenB}/${before.length} to ${burdenA}/${after.length}.`,
      compounds: [name], dateRange: { start: doses[i - 1].date, end: doses[i].date, comparisonBasis: "dose_increase" },
      sampleSize: before.length + after.length, confidence: Math.min(1, (before.length + after.length) / 16),
      relevance: 0.9, novelty: 1, actionability: 0.6, polarity: improved ? "benefit" : "burden", tags: ["changed"],
    });
  }
  return out;
}

// Day-of-cycle symptom clustering — fixed to use the normalized (symptomTags-aware) events
// instead of the broken l.compound filter, which was almost always empty.
function genSymptomPatternCandidates(name, events) {
  const out = [];
  const compEvents = events.filter(e => e.linkedCompounds.includes(name));
  const bySymptom = {};
  compEvents.forEach(e => { (bySymptom[e.symptom] = bySymptom[e.symptom] || []).push(e); });
  Object.entries(bySymptom).forEach(([sym, occs]) => {
    if (occs.length < 4) return;
    const daysList = occs.map(e => e.compoundContext.find(cc => cc.compound === name)?.daysSinceDose).filter(d => d != null);
    if (daysList.length < 4) return;
    const avg = daysList.reduce((a, b) => a + b, 0) / daysList.length;
    const variance = daysList.reduce((a, b) => a + (b - avg) ** 2, 0) / daysList.length;
    if (variance > 3) return;
    out.push({
      id: `symptom_cluster:${name}:${sym}`, category: "symptom_pattern",
      headline: `${sym} consistently appears around Day ${Math.round(avg)}`,
      evidence: `Based on ${daysList.length} occurrences (range Day ${Math.round(Math.min(...daysList))}–${Math.round(Math.max(...daysList))}) after ${name} doses.`,
      compounds: [name], dateRange: { cycles: daysList.length },
      sampleSize: daysList.length, confidence: Math.min(1, daysList.length / 8),
      relevance: 0.8, novelty: 0.7, actionability: 0.7, polarity: classifySymptomPolarity(sym), tags: ["repeating"],
    });
  });
  return out;
}

// Multi-compound overlap attribution — new capability. Flags a symptom that's been
// tagged to more than one active compound rather than silently crediting/blaming one.
function genOverlapCandidates(activeCompoundNames, events) {
  const out = [];
  const bySymptom = {};
  events.forEach(e => { if (e.linkedCompounds.length) (bySymptom[e.symptom] = bySymptom[e.symptom] || []).push(e); });
  Object.entries(bySymptom).forEach(([sym, occs]) => {
    const tally = {};
    occs.forEach(e => e.linkedCompounds.forEach(cn => { tally[cn] = (tally[cn] || 0) + 1; }));
    const involved = Object.keys(tally).filter(cn => activeCompoundNames.includes(cn));
    if (involved.length < 2) return;
    const parts = involved.map(cn => `${cn} in ${tally[cn]} log${tally[cn] === 1 ? "" : "s"}`);
    out.push({
      id: `overlap:${sym}`, category: "symptom_pattern",
      headline: `${sym} attribution is uncertain`,
      evidence: `${sym} was linked to ${parts.join(" and ")}, with overlapping dose windows — not confidently attributable to one compound.`,
      compounds: involved, dateRange: {}, sampleSize: occs.length,
      confidence: 0.3, relevance: 0.6, novelty: 0.5, actionability: 0.4, polarity: "neutral", tags: ["unclear"],
    });
  });
  return out;
}

// "Is it working" goal signal — appetite/GLP-1 category: weight trend against the
// person's own stated goal direction (loss vs. gain), not an assumed "down is good".
function genWeightGoalCandidate(name) {
  const wLogs = [...state.weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (wLogs.length < 4) return [];
  const first = parseFloat(wLogs[0].weight), latest = parseFloat(wLogs[wLogs.length - 1].weight);
  const delta = latest - first;
  if (Math.abs(delta) < 0.5) return [];
  const goal = parseFloat(state.profile.goalWeight), start = parseFloat(state.profile.startWeight);
  const desiredDown = (goal && start) ? goal < start : true; // default assumption only if no goal set
  const onTrack = (delta < 0) === desiredDown;
  return [{
    id: `goal_weight:${name}`, category: "body_composition",
    headline: `Weight ${delta < 0 ? "down" : "up"} ${Math.abs(delta).toFixed(1)} ${state.settings.weightUnit} since starting`,
    evidence: `${fmtDate(wLogs[0].date)}: ${first.toFixed(1)} → ${fmtDate(wLogs[wLogs.length - 1].date)}: ${latest.toFixed(1)} ${state.settings.weightUnit}, across ${wLogs.length} entries.`,
    compounds: [name], dateRange: { start: wLogs[0].date, end: wLogs[wLogs.length - 1].date },
    sampleSize: wLogs.length, confidence: Math.min(1, wLogs.length / 12),
    relevance: 1, novelty: 0.6, actionability: 0.3, polarity: onTrack ? "benefit" : "burden", tags: ["goal_signal"],
  }];
}

// Injection-site reaction pattern — healing/repair category.
function genSiteReactionCandidates(name, doses) {
  const siteDoses = doses.filter(d => d.site && (d.symptoms || []).length);
  if (siteDoses.length < 6) return [];
  const siteRx = s => /redness|irritation|sore|swel|bruis|itch|sting|burn/i.test(s);
  const bySite = {};
  siteDoses.forEach(d => {
    const names = (d.symptoms || []).map(s => typeof s === "string" ? s : s.name);
    const hasRx = names.some(siteRx);
    (bySite[d.site] = bySite[d.site] || { total: 0, rx: 0 }).total++;
    if (hasRx) bySite[d.site].rx++;
  });
  const entries = Object.entries(bySite).filter(([, v]) => v.total >= 3);
  if (entries.length < 2) return [];
  const rates = entries.map(([site, v]) => [site, v.rx / v.total, v]).sort((a, b) => b[1] - a[1]);
  const [worstSite, worstRate, worstV] = rates[0];
  const bestRate = rates[rates.length - 1][1];
  if (worstRate < 0.3 || worstRate < bestRate * 1.8) return [];
  return [{
    id: `site_pattern:${name}:${worstSite}`, category: "injection_site",
    headline: `${worstSite} shows more reactions with ${name}`,
    evidence: `${worstV.rx} of ${worstV.total} doses at ${worstSite} showed a site reaction — noticeably more than your other sites.`,
    compounds: [name], dateRange: {}, sampleSize: worstV.total, confidence: Math.min(1, worstV.total / 8),
    relevance: 0.9, novelty: 0.6, actionability: 0.9, polarity: "burden", tags: ["repeating"],
    action: { label: `Rotate away from ${worstSite}` },
  }];
}

// Generates all candidates for a compound (or every active compound, if null).
function generateInsightCandidates(compoundName) {
  const aps = allPeptides();
  const events = getNormalizedSymptomEvents();
  const activeCompounds = Object.entries(aps).filter(([, p]) => (p.doses || []).length && (p.status || "active") === "active").map(([n]) => n);
  const targets = compoundName ? [compoundName] : activeCompounds;
  const out = [];
  targets.forEach(name => {
    const p = aps[name]; if (!p || !(p.doses || []).length) return;
    const c = cfg(name);
    const doses = [...p.doses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const category = getCompoundAnalysisCategory(name);
    out.push(...genDoseChangeCandidates(name, doses, events, c));
    out.push(...genSymptomPatternCandidates(name, events));
    if (category === "appetite_glp1") out.push(...genWeightGoalCandidate(name));
    if (category === "healing_repair") out.push(...genSiteReactionCandidates(name, doses));
  });
  out.push(...genOverlapCandidates(activeCompounds, events).filter(o => !compoundName || o.compounds.includes(compoundName)));
  return out;
}

function buildInsightsSections(compoundName) {
  const ranked = rankInsightCandidates(generateInsightCandidates(compoundName));
  return {
    mostImportant: ranked.slice(0, 3),
    working: ranked.filter(c => c.tags.includes("goal_signal")).slice(0, 2),
    benefits: ranked.filter(c => c.polarity === "benefit" && !c.tags.includes("goal_signal")).slice(0, 4),
    burden: ranked.filter(c => c.polarity === "burden").slice(0, 4),
    unclear: ranked.filter(c => c.tags.includes("unclear")).slice(0, 3),
    changed: ranked.filter(c => c.tags.includes("changed")).slice(0, 3),
    all: ranked,
  };
}

function buildNarrativeSummary(sections) {
  const top = sections.mostImportant;
  if (!top.length) return "";
  const sentences = top.slice(0, 3).map(c => c.headline + (c.evidence ? " — " + c.evidence.split(".")[0] + "." : "."));
  return sentences.join(" ");
}

function buildTrackThisNext(sections, compoundName) {
  // The single highest-value unanswered question — prefers a candidate with an
  // explicit action, otherwise falls back to what's most conspicuously missing.
  const actionable = sections.all.find(c => c.action);
  if (actionable) return actionable.action.label + (actionable.compounds.length ? ` — based on your ${actionable.compounds.join(", ")} data.` : "");
  if (compoundName) {
    const events = getNormalizedSymptomEvents().filter(e => e.linkedCompounds.includes(compoundName));
    if (events.length < 6) return `Log a few more check-ins tagged to ${compoundName} — ${events.length} logged so far, patterns need at least 4-6 occurrences of the same symptom to confirm timing.`;
  }
  return "Keep logging check-ins and doses consistently — patterns need repeated occurrences before they're reliable.";
}

// "Right Now" — the highest-value cross-compound findings (change points, clusters),
// calm/minimal per the redesign brief: no heavy card borders, just typography + a divider.
function renderRightNowSection() {
  const changePoints = detectAllChangePoints(21);
  const oppositeTransitions = detectOppositeTransitions(45);
  const clusters = detectSymptomClusters(30).filter(c=>c.sampleDays>=3);
  const weightChanges = detectAndAnalyzeWeightChanges().filter(w=>{
    const daysAgo = (Date.now()-safeDate(w.endDate).getTime())/86400000;
    return daysAgo <= 14; // only surface recent-enough changes as "right now"
  });
  const findings = [];

  weightChanges.forEach(w=>{
    findings.push({
      icon: w.delta<0?"⚖️":"⚖️", title:`Weight ${w.delta<0?"drop":"rise"} — ${w.confidence.toLowerCase()} confidence explanation`,
      body: w.narrative, date: w.endDate, score: Math.abs(w.delta)*15 + (w.confounders.length?10:0),
    });
  });

  // Opposite-transition findings are strictly richer than a generic change-point covering
  // the same pair (they include plausible interpretations) — track which categories they
  // cover so the generic change-point for that same category isn't shown redundantly.
  const coveredCategories = new Set();
  oppositeTransitions.forEach(t=>{
    coveredCategories.add(t.category);
    const firstInterp = t.interpretations[0];
    findings.push({
      icon:"🔴", title:`${t.category} pattern shift detected — worth attention`,
      body:`${t.symptomA} was repeatedly logged ${fmtDate(t.aFirstDate)}–${fmtDate(t.aLastDate)} (${t.aDaysTotal} days total, including a ${t.aLongestStreak}-day consecutive streak). Beginning ${fmtDate(t.bFirstDate)}, the pattern changed to ${t.symptomB.toLowerCase()}, now logged for ${t.bStreakLength} consecutive days. Because the ${t.symptomA.toLowerCase()} pattern preceded it, ${firstInterp.toLowerCase()} is one possible explanation worth considering — the logs alone cannot determine whether this is ${firstInterp.toLowerCase()} versus another cause.`,
      date: t.bFirstDate, score: (t.aLongestStreak+t.bStreakLength)*10,
      interpretations: t.interpretations,
    });
  });
  changePoints.filter(cp=>!coveredCategories.has(cp.category)).slice(0,2).forEach(cp=>{
    findings.push({
      icon:"🔴", title:`${cp.category} pattern changed`,
      body:`${cp.symptomBefore} was dominant before ${fmtDate(cp.splitDate)} (${cp.countBefore} of ${cp.daysBefore} days). Since then, ${cp.symptomAfter.toLowerCase()} has been dominant (${cp.countAfter} of ${cp.daysAfter} days). This sequence may be worth watching — the data can't yet establish whether they're related.`,
      date: cp.splitDate, score: cp.separationScore*10,
    });
  });
  clusters.slice(0,2).forEach(cl=>{
    findings.push({
      icon:"🔗", title:"Symptoms traveling together",
      body:`${cl.symptoms.join(", ")} have co-occurred on ${cl.sampleDays} days recently — more often together than apart.`,
      date: cl.dates[cl.dates.length-1], score: cl.sampleDays,
    });
  });
  if (!findings.length) return "";
  findings.sort((a,b)=>b.score-a.score);

  return `<div style="margin-bottom:18px">
    <div class="mono" style="font-size:10px;color:var(--t4);letter-spacing:2px;margin-bottom:10px">RIGHT NOW</div>
    ${findings.slice(0,3).map(f=>`<div style="padding:12px 0;border-bottom:1px solid var(--border-sub)">
      <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:4px">${f.icon} ${esc(f.title)}</div>
      <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px">${esc(f.body)}</div>
      ${f.interpretations?`<div style="margin:8px 0">
        <div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin-bottom:4px">POSSIBLE INTERPRETATIONS</div>
        ${f.interpretations.map(i=>`<div style="font-size:11.5px;color:var(--t4);padding:2px 0">• ${esc(i)}</div>`).join("")}
      </div>`:""}
      <button class="why-date-btn" data-date="${f.date}" style="font-size:11px;color:#A78BFA;font-weight:600;background:none;border:none;padding:0">🔎 Why ${fmtDate(f.date)}? →</button>
    </div>`).join("")}
  </div>`;
}

// The drill-down: everything relevant around a date, gathered from real logged data —
// doses, dose changes, reschedules, notes, and symptoms — never invented.
function whyDateModal(centerDate) {
  const ctx = buildWhyDateContext(centerDate, 3);
  const m = openModal(`
    <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:4px">Why ${esc(fmtDate(centerDate))}?</div>
    <div class="hint" style="margin-bottom:16px">Everything logged within 3 days of this date, for context — not proof of a cause.</div>
    ${ctx.doseEvents.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">DOSES</div>
    ${ctx.doseEvents.map(d=>`<div style="font-size:12px;color:var(--t2);padding:4px 0;border-bottom:1px solid var(--border-sub)">${esc(fmtDate(d.date))} — ${esc(d.compound)}${d.type==="rescheduled"?` rescheduled to ${esc(fmtDate(d.to))}`:` ${esc(d.dose)}${esc(d.unit)}${d.changed?` (changed from ${esc(d.prevDose)}${esc(d.unit)})`:d.isFirst?" (first dose)":""}`}</div>`).join("")}`:""}
    ${ctx.notes.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin:16px 0 8px">NOTES</div>
    ${ctx.notes.map(n=>`<div style="font-size:12px;color:var(--t3);font-style:italic;padding:4px 0;border-bottom:1px solid var(--border-sub)">${esc(fmtDate(n.date))}: "${esc(n.text)}"</div>`).join("")}`:""}
    ${ctx.symptomEvents.length?`<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin:16px 0 8px">SYMPTOMS LOGGED</div>
    ${ctx.symptomEvents.map(e=>`<div style="font-size:12px;color:var(--t3);padding:3px 0">${esc(fmtDate(e.date))}: ${esc(e.symptom)}${e.linkedCompounds.length?` (${esc(e.linkedCompounds.join(", "))})`:""}</div>`).join("")}`:""}
    ${!ctx.doseEvents.length && !ctx.notes.length && !ctx.symptomEvents.length ? `<div style="font-size:12px;color:var(--t5)">Nothing else logged in this window.</div>`:""}
    <button id="wd-close" class="btn-primary" style="background:var(--t3);margin-top:16px">Close</button>
  `, "#A78BFA");
  m.querySelector("#wd-close").onclick = closeModal;
}

function insightsFeed() {
  const aps = allPeptides();
  const activeCompounds = Object.entries(aps).filter(([,p])=>(p.doses||[]).length && (p.status||"active")==="active").map(([n])=>n);
  const selected = state._insightsCompound && activeCompounds.includes(state._insightsCompound) ? state._insightsCompound : null;

  const tabsHtml = activeCompounds.length ? `<div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:14px;padding-bottom:2px">
    <button class="insights-tab" data-compound="" style="flex:0 0 auto;min-height:36px;padding:8px 14px;border-radius:9px;font-size:12px;font-weight:600;background:${!selected?"var(--surface-3)":"transparent"};border:1px solid ${!selected?"var(--border)":"transparent"};color:${!selected?"var(--t1)":"var(--t4)"};white-space:nowrap">Overview</button>
    ${activeCompounds.map(n=>`<button class="insights-tab" data-compound="${esc(n)}" style="flex:0 0 auto;min-height:36px;padding:8px 14px;border-radius:9px;font-size:12px;font-weight:600;background:${selected===n?"var(--surface-3)":"transparent"};border:1px solid ${selected===n?cfg(n).color:"transparent"};color:${selected===n?cfg(n).color:"var(--t4)"};white-space:nowrap">${esc(n)}</button>`).join("")}
  </div>` : "";

  if (!activeCompounds.length) {
    return tabsHtml + emptyState("No active compounds yet", "Insights build once you have at least one active compound with logged doses.");
  }

  const rightNowHtml = !selected ? renderRightNowSection() : "";

  const sections = buildInsightsSections(selected);
  const narrative = buildNarrativeSummary(sections);
  const trackNext = buildTrackThisNext(sections, selected);


  if (!sections.all.length) {
    return tabsHtml + emptyState(
      selected ? `Not enough data yet for ${selected}` : "Not enough data yet",
      "Patterns typically need 4-6 occurrences of the same symptom, or 3+ logs before and after a dose change, before they're reliable enough to show. Keep logging check-ins and doses.",
    );
  }

  const narrativeHtml = narrative ? `<div style="background:linear-gradient(135deg,#A78BFA22,#A78BFA08);border:1px solid #A78BFA44;border-radius:14px;padding:16px;margin-bottom:14px">
    <div class="mono" style="font-size:9px;color:#A78BFA;letter-spacing:1.5px;margin-bottom:8px">OVERVIEW</div>
    <div style="font-size:13px;color:var(--t1);line-height:1.6">${esc(narrative)}</div>
  </div>` : "";

  const bbHtml = (sections.benefits.length || sections.burden.length) ? `<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">
    ${sections.benefits.length?`<div style="flex:1;min-width:140px;background:#7DF9C00d;border:1px solid #7DF9C033;border-radius:12px;padding:12px 14px">
      <div class="mono" style="font-size:9px;color:#7DF9C0;letter-spacing:1.5px;margin-bottom:6px">BENEFITS</div>
      ${sections.benefits.map(c=>`<div style="font-size:11px;color:var(--t2);padding:3px 0;line-height:1.4">• ${esc(c.headline)}</div>`).join("")}
    </div>`:""}
    ${sections.burden.length?`<div style="flex:1;min-width:140px;background:#F9C87D0d;border:1px solid #F9C87D33;border-radius:12px;padding:12px 14px">
      <div class="mono" style="font-size:9px;color:#F9C87D;letter-spacing:1.5px;margin-bottom:6px">BURDEN</div>
      ${sections.burden.map(c=>`<div style="font-size:11px;color:var(--t2);padding:3px 0;line-height:1.4">• ${esc(c.headline)}</div>`).join("")}
    </div>`:""}
  </div>` : "";

  const qCard = c => `<div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:12px;padding:12px 14px;margin-bottom:8px">
    <div style="font-size:13px;color:var(--t1);font-weight:600">${esc(c.headline)}</div>
    <div style="font-size:11px;color:var(--t4);margin-top:4px;line-height:1.5">${esc(c.evidence)}</div>
    <details style="margin-top:6px"><summary style="font-size:10px;color:var(--t5);cursor:pointer;list-style:none">▸ Evidence</summary>
      <div style="font-size:10px;color:var(--t5);margin-top:4px;line-height:1.6">Sample size: ${c.sampleSize} · Confidence: ${Math.round(c.confidence*100)}%${c.compounds.length?` · ${c.compounds.length>1?"Compounds":"Compound"}: ${esc(c.compounds.join(", "))}`:""}${c.dateRange?.comparisonBasis?` · Basis: ${c.dateRange.comparisonBasis.replace(/_/g," ")}`:""}</div>
    </details>
  </div>`;
  const qSection = (title, list) => list.length ? `<div style="margin-bottom:16px"><div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">${title}</div>${list.map(qCard).join("")}</div>` : "";

  const workingHtml = qSection("IS IT WORKING?", sections.working);
  const changedHtml = qSection("WHAT CHANGED?", sections.changed);
  const unclearHtml = qSection("WHAT IS STILL UNCLEAR?", sections.unclear);

  const trackHtml = `<div style="background:#A78BFA11;border:1px solid #A78BFA33;border-radius:12px;padding:14px;margin-bottom:14px">
    <div class="mono" style="font-size:9px;color:#A78BFA;letter-spacing:1.5px;margin-bottom:6px">→ TRACK THIS NEXT</div>
    <div style="font-size:12px;color:var(--t2);line-height:1.5">${esc(trackNext)}</div>
  </div>`;

  // Tracking quality — demoted, collapsed, never outranks actual findings.
  const doses14 = Object.values(aps).flatMap(d=>(d.doses||[]).filter(x=>(Date.now()-new Date(x.date).getTime())<=14*86400000)).length;
  const checkins14 = state.dailyLogs.filter(l=>(Date.now()-new Date(l.date).getTime())<=14*86400000).length;
  const qualityHtml = `<details class="app-detail"><summary style="font-size:11px;font-weight:600;color:var(--t4)">📋 Tracking Quality<span style="margin-left:auto;color:var(--t5)">›</span></summary>
    <div class="app-detail-body" style="font-size:11px;color:var(--t4);line-height:1.8">${doses14} doses and ${checkins14} check-ins logged in the last 14 days. More consistent logging strengthens every finding above.</div>
  </details>`;

  return tabsHtml + rightNowHtml + narrativeHtml + bbHtml + workingHtml + changedHtml + unclearHtml + trackHtml + qualityHtml;
}

async function aminoSend(input) {
  if (/what changed|recent check.ins|compare (my )?(last|recent|check.ins)/i.test(String(input||""))) { nxCheckinComparison(14); return; }
  if (!state._aminoMsgs) state._aminoMsgs = [];
  state._aminoMsgs.push({role:"user", content:input});
  if (!state.settings.recentNexusQuestions) state.settings.recentNexusQuestions=[];
  state.settings.recentNexusQuestions = [input, ...state.settings.recentNexusQuestions.filter(q=>q.toLowerCase()!==input.toLowerCase())].slice(0,5);
  saveState();
  state._aminoLoading = true; render();
  setTimeout(()=>{ const c=document.getElementById("amino-chat"); if(c) c.scrollTop=c.scrollHeight; },50);
  // Small delay for natural feel
  await new Promise(r=>setTimeout(r,400));
  const {text,followups,topic} = nexusRoute(input, state._nexusActiveTopic);
  // A returned topic (even undefined) means "no change" — only overwrite when a branch
  // explicitly set one, so a follow-up question can still resolve against the prior topic.
  if (topic !== undefined) state._nexusActiveTopic = topic;
  state._aminoMsgs.push({role:"assistant", content:text, followups});
  state._aminoLoading = false; render();
  setTimeout(()=>{ const c=document.getElementById("amino-chat"); if(c) c.scrollTop=c.scrollHeight; },50);
}

function featureExplorerView() {
  const CATEGORIES = [
    {icon:"📋",label:"Planning",color:"#A78BFA",features:[
      {name:"Protocol Builder",desc:"6-step guided flow: goal → template → stack → schedule → phases → review",action:()=>{tab="protocols";render();window.scrollTo(0,0);}},
      {name:"Goal selection + Templates",desc:"GLP-1, Wolverine, Longevity, CLO, or custom starting points",action:()=>{tab="protocols";render();window.scrollTo(0,0);}},
      {name:"Stack builder",desc:"Complexity score + interaction analysis when combining compounds",action:()=>{tab="protocols";render();window.scrollTo(0,0);}},
      {name:"Phase designer",desc:"Dose / rest / escalation phases with duration steppers per compound",action:null},
      {name:"Research Queue",desc:"Track compounds you're investigating before committing",action:()=>{tab="plans";state._plansSub="research";render();window.scrollTo(0,0);}},
      {name:"Goals",desc:"Named health goals linked to protocols and compounds",action:()=>{tab="plans";state._plansSub="goals";render();window.scrollTo(0,0);}},
      {name:"Shopping List",desc:"Compound / supply / equipment procurement tracker",action:()=>{tab="plans";state._plansSub="shopping";render();window.scrollTo(0,0);}},
    ]},
    {icon:"💉",label:"Tracking",color:"#7DF9C0",features:[
      {name:"Dose logging",desc:"Amount, site, escalation flag, symptoms per dose",action:()=>{tab="home";render();window.scrollTo(0,0);}},
      {name:"Daily check-in",desc:"Mood, 50+ symptoms (collapsible categories), free notes",action:()=>{tab="home";render();window.scrollTo(0,0);}},
      {name:"Custom symptoms",desc:"Add your own symptoms — they participate in all analysis",action:()=>{tab="home";render();window.scrollTo(0,0);}},
      {name:"Weight + measurements",desc:"Body weight, waist, hips — tracked over time with trend charts",action:()=>{tab="trends";render();window.scrollTo(0,0);}},
      {name:"Macros",desc:"Daily calories, protein, carbs, fat — cross-referenced with symptoms",action:()=>{tab="home";render();window.scrollTo(0,0);}},
    ]},
    {icon:"📦",label:"Inventory (Stash)",color:"#F9C87D",features:[
      {name:"Kit tracking",desc:"Vial size, BAC water, concentration, total vials, expiry",action:()=>{tab="stash";render();window.scrollTo(0,0);}},
      {name:"Reconstitution math",desc:"Live units-to-draw calculation for your exact kit and dose",action:()=>{tab="stash";render();window.scrollTo(0,0);}},
      {name:"Supply forecasting",desc:"Weeks remaining, depletion date, total supply across all kits",action:()=>{tab="stash";render();window.scrollTo(0,0);}},
      {name:"BAC Water Guide",desc:"3 concentration options with SUGGESTED badge and unit examples",action:()=>{tab="stash";render();window.scrollTo(0,0);}},
      {name:"Expiry warnings",desc:"Alerts when a reconstituted vial approaches its recommended limit",action:()=>{tab="stash";render();window.scrollTo(0,0);}},
    ]},
    {icon:"📊",label:"Analysis",color:"#8AB4FF",features:[
      {name:"Plasma accumulation model",desc:"Half-life decay curve showing current level vs steady-state peak",action:()=>{tab="trends";render();window.scrollTo(0,0);}},
      {name:"Phase indicators",desc:"Taking Effect / Peak / Cruise / Wear Off — with compound-specific descriptions",action:()=>{tab="trends";render();window.scrollTo(0,0);}},
      {name:"Dose retrospectives",desc:"Tap any past dose to see what happened after it vs your average cycle",action:()=>{tab="trends";render();window.scrollTo(0,0);}},
      {name:"Symptom frequency chart",desc:"Which symptoms occur most and when in your cycle",action:()=>{tab="trends";render();window.scrollTo(0,0);}},
      {name:"Weight + body comp trends",desc:"1M / 3M / 6M / All timeframes with measurement overlay",action:()=>{tab="trends";render();window.scrollTo(0,0);}},
    ]},
    {icon:"✨",label:"Insights",color:"#C8FF9C",features:[
      {name:"Nexus Chat — ask your data",desc:"Categorized questions (My Protocols, Supply, My Data, Insights, Learn) answered from your own logs first — with follow-up suggestions, not a generic chatbot",action:()=>{tab="amino";state._aminoSub="chat";render();window.scrollTo(0,0);}},
      {name:"Data Health",desc:"10-point check for gaps that could weaken insights — kit links, dose units, recon dates, BAC freshness, HRV coverage, and more",action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);}},
      {name:"Journal",desc:"Search every note you've ever logged — check-in notes, per-compound notes, dose notes — by keyword or compound, across your whole history",action:()=>{tab="amino";state._aminoSub="journal";render();window.scrollTo(0,0);}},
      {name:"Hero insight",desc:"Ranked by confidence × usefulness × rarity — never guesses",action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);}},
      {name:"What Changed",desc:"14-day vs prior 14-day symptom frequency comparison",action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);}},
      {name:"Patterns Discovered",desc:"Supplement correlation, mood-phase, protein-symptom, site reactions",action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);}},
      {name:"Predictions",desc:"Food noise return timing — only fires after 3+ cycles with tight clustering",action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);}},
      {name:"Milestones",desc:"First month, symptom-free streaks, weight milestones, dose counts",action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);}},
      {name:"Monthly recap",desc:"Natural-language summary of your last 30 days",action:()=>{tab="amino";state._aminoSub="insights";render();window.scrollTo(0,0);}},
    ]},
    {icon:"🔬",label:"Compound Library",color:"#FF9CC8",features:[
      {name:"44 compound profiles",desc:"Mechanism, timing, titration, cycle, stacks, safety — all offline",action:()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);}},
      {name:"Compound Intel",desc:"Full-page view with your real kit data, supply forecast, BAC guide",action:()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);}},
      {name:"Typical Titration",desc:"Phase-by-phase progression with YOU ARE HERE badge",action:null},
      {name:"Alias search",desc:"Find PT-141 by searching 'Bremelanotide', SS-31 by 'Elamipretide'",action:()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);}},
      {name:"Category filter",desc:"Browse by Fat Loss, Recovery, Longevity, Hormonal, Cognitive, etc.",action:()=>{tab="amino";state._aminoSub="learn";state._learnSub="discover";renderBody();window.scrollTo(0,0);}},
    ]},
    {icon:"🛠️",label:"Tools",color:"#9DC8FF",features:[
      {name:"Dosing Math Guide",desc:"mg / mcg / mL / units explained with visual quick-reference cards",action:()=>{tab="amino";state._aminoSub="learn";state._guideOpen=GUIDES.findIndex(g=>g.title.includes("mg, mcg"));renderBody();window.scrollTo(0,0);}},
      {name:"Calendar export (.ics)",desc:"Next dose as a recurring calendar event — time-of-day aware",action:()=>{tab="home";render();window.scrollTo(0,0);}},
      {name:"Apple Health import",desc:"Import weight, steps, heart rate, macros from Health export XML",action:()=>{tab="profile";render();window.scrollTo(0,0);}},
      {name:"Demo Mode",desc:"3 sample scenarios (Weight Loss / Recovery / Longevity) — never touches real data",action:()=>{demoPickerModal();}},
      {name:"Export / Import backup",desc:"Full data backup as JSON — export regularly",action:()=>{tab="profile";render();window.scrollTo(0,0);}},
    ]},
  ];

  return `<div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:12px">🗺️ FEATURE EXPLORER</div>
  <div style="font-size:12px;color:var(--t3);margin-bottom:14px;line-height:1.5">Everything this app can do, organized by category. Tap any feature to go there.</div>
  ${CATEGORIES.map(cat=>`<div style="margin-bottom:16px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span style="font-size:16px">${cat.icon}</span>
      <span class="mono" style="font-size:10px;color:${cat.color};letter-spacing:1.5px">${cat.label.toUpperCase()}</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px">
      ${cat.features.map(f=>`<div class="${f.action?"fe-item":"fe-nolink"}" ${f.action?`data-cat="${esc(cat.label)}" data-name="${esc(f.name)}"`:""} style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:8px;padding:9px 12px;display:flex;align-items:center;gap:8px;cursor:${f.action?"pointer":"default"}">
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:600;color:var(--t1)">${esc(f.name)}</div>
          <div style="font-size:11px;color:var(--t4);margin-top:1px">${esc(f.desc)}</div>
        </div>
        ${f.action?`<span style="color:${cat.color};font-size:13px;flex-shrink:0">→</span>`:""}
      </div>`).join("")}
    </div>
  </div>`).join("")}`;
}

// ─── Journal (searchable aggregated notes feed) ─────────────────────────
// Read-only view over existing notes fields — no new data model, no new write surface.
// Aggregates: dailyLogs.notes, dailyLogs.compoundNotes, doses.notes (with injection site).
function journalEntries() {
  const entries = [];
  const aps = allPeptides();

  (state.dailyLogs||[]).forEach(l=>{
    const tags = l.symptomTags||{};
    const symptoms = l.symptoms||[];
    // Per-symptom linkage — shown as context under a single entry, not the entry's own
    // filter identity. If every linked symptom points at the same one compound, that
    // compound headlines the entry; otherwise (mixed, or no links) it reads as General.
    const symptomLinks = symptoms.map(s=>{
      const name = typeof s==="string"?s:s.name;
      const raw = tags[name]||[];
      return { name, linked: raw.filter(c=>c && c!=="Not sure"), notSure: raw.includes("Not sure") };
    });
    const distinctLinked = [...new Set(symptomLinks.flatMap(s=>s.linked))];
    const primaryCompound = distinctLinked.length===1 ? distinctLinked[0] : null;
    // Journal is for written observations — requires actual note text. Symptoms/mood ride
    // along as context on a written entry; they never trigger inclusion by themselves.
    if ((l.notes||"").trim()) {
      entries.push({ date:l.date, source:"Check-in", compounds: primaryCompound?[primaryCompound]:[], symptomLinks, text:l.notes, mood:l.mood, jump:{type:"daily", id:l.id} });
    }
    Object.entries(l.compoundNotes||{}).forEach(([comp,txt])=>{
      if ((txt||"").trim()) entries.push({ date:l.date, source:"Check-in note", compounds:[comp], text:txt, jump:{type:"daily", id:l.id} });
    });
    // Later-day updates: same rule — only when there's actually written text.
    (l.updates||[]).forEach(u=>{
      if ((u.notes||"").trim()) {
        const uSymNames = (u.symptoms||[]).map(s=>typeof s==="string"?s:s.name);
        entries.push({ date:u.time||l.date, source:"General update", compounds:[], symptomLinks: uSymNames.map(name=>({name,linked:[],notSure:false})), text:u.notes, jump:{type:"daily", id:l.id} });
      }
    });
  });

  Object.entries(aps).forEach(([name,p])=>{
    (p.doses||[]).forEach(d=>{
      if ((d.notes||"").trim()) entries.push({ date:d.date, source:"Dose log", compounds:[name], text:d.notes, site:d.site||null, jump:{type:"dose", name, id:d.id} });
    });
  });

  // Outflow/waste entries have a structured "reason" (a picked dropdown value) plus an
  // optional free-text note — only the free-text portion counts as a written observation.
  (state.supplies||[]).forEach(s=>{
    (s.wasteLog||[]).forEach(w=>{
      if ((w.notes||"").trim()) entries.push({ date:w.date, source:"Stash note", compounds:[s.name], text:w.notes, jump:{type:"stash", name:s.name, id:s.id} });
    });
  });

  return entries.sort((a,b)=>new Date(b.date)-new Date(a.date));
}

function journalView() {
  const q = (state._journalQuery||"").trim().toLowerCase();
  const filterComp = state._journalCompound||"";
  const all = journalEntries();
  const compounds = [...new Set(all.flatMap(e=>e.compounds||[]))].sort();
  let entries = all;
  // One filter dimension now: All Notes, General Notes (unlinked), or a specific compound.
  // Never touches anything outside Journal — weight/supplements/measurements have their
  // own dedicated views and were never part of this list to begin with.
  if (filterComp === "__general__") entries = entries.filter(e=>(e.compounds||[]).length===0);
  else if (filterComp) entries = entries.filter(e=>(e.compounds||[]).includes(filterComp));
  if (q) entries = entries.filter(e =>
    (e.text||"").toLowerCase().includes(q) ||
    (e.compounds||[]).some(c=>c.toLowerCase().includes(q)) ||
    (e.symptomLinks||[]).some(s=>s.name.toLowerCase().includes(q)));

  const fmtTime = iso => { const t = String(iso); const hasTime = t.includes("T") && !t.endsWith("T00:00:00.000Z"); if(!hasTime) return null; const d = new Date(iso); return d.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"}); };

  const rows = entries.slice(0,150).map(e=>{
    const time = fmtTime(e.date);
    const label = e.compounds.length===1 ? e.compounds[0] : "General Note";
    const labelColor = e.compounds.length===1 ? (cfg(e.compounds[0]).color||"var(--t2)") : "var(--t4)";
    const symptomLines = (e.symptomLinks||[]).length ? `<div style="margin:6px 0">
      <div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1px;margin-bottom:3px">SYMPTOMS</div>
      ${e.symptomLinks.map(s=>{
        // Only annotate linkage when it diverges from the entry's own headline compound —
        // avoids redundantly repeating "-> Retatrutide" under a card already labeled Retatrutide.
        const showLink = s.linked.length && !(e.compounds.length===1 && s.linked.length===1 && s.linked[0]===e.compounds[0]);
        const tag = showLink ? ` <span style="color:${cfg(s.linked[0]).color||"var(--t3)"}">→ ${esc(s.linked.join(", "))}</span>` : (s.notSure ? ` <span style="color:var(--t5)">→ not sure</span>` : "");
        return `<div style="font-size:12px;color:var(--t3)">• ${esc(s.name)}${tag}</div>`;
      }).join("")}
    </div>` : "";
    return `<div class="card" data-jump-type="${e.jump.type}" data-jump-id="${esc(String(e.jump.id||""))}" data-jump-name="${esc(e.jump.name||"")}" style="margin-bottom:10px;cursor:pointer">
      <div style="font-size:11px;color:var(--t4);margin-bottom:2px">${fmtDate(e.date)}${time?` · ${time}`:""}</div>
      <div style="font-size:13px;font-weight:700;color:${labelColor};margin-bottom:4px">${esc(label)}</div>
      ${symptomLines}
      ${e.mood!=null?`<div style="font-size:11px;color:var(--t4);margin-bottom:4px">Mood: ${esc(String(e.mood))}</div>`:""}
      <div style="font-size:12.5px;color:var(--t2);line-height:1.5;font-style:italic">"${esc(e.text)}"</div>
    </div>`;
  }).join("");

  const chips = [["", "All Notes"], ["__general__", "General Notes"], ...compounds.map(c=>[c,c])]
    .map(([val,label])=>`<button class="journal-comp-chip" data-c="${val}" style="font-size:11px;padding:5px 10px;border-radius:10px;background:${filterComp===val?(val&&val!=="__general__"?cfg(val).color+"22":"var(--surface-3)"):"var(--surface-2)"};border:1px solid ${filterComp===val?(val&&val!=="__general__"?cfg(val).color:"var(--border)"):"transparent"};color:${filterComp===val?(val&&val!=="__general__"?cfg(val).color:"var(--t1)"):"var(--t3)"};white-space:nowrap;flex-shrink:0">${esc(label)}</button>`).join("");

  return `<div style="margin-bottom:10px">
    <input id="journal-search" class="inp" placeholder="Search notes, symptoms, compounds…" value="${esc(state._journalQuery||"")}" style="margin-bottom:8px">
    <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:2px">${chips}</div>
  </div>
  <div style="font-size:10px;color:var(--t5);margin-bottom:10px">${entries.length} ${entries.length===1?"note":"notes"}${q||filterComp?" matching":""} · what you actually wrote</div>
  ${entries.length?rows:`<div style="text-align:center;padding:30px 0;color:var(--t4);font-size:12px">
    ${all.length===0?"No written notes yet. Anything you write during a check-in, dose log, or later update will show up here.":"No entries match. Try a different word or clear the filter."}
  </div>`}`;
}

function aminoView() {
  const aminoSub = state._aminoSub === "insights" ? "chat" : (state._aminoSub || "chat");
  const msgs = state._aminoMsgs||[];
  const apiKey = state.settings.nexusApiKey||"";
  const subBtn = (id, label, icon) => `<button id="as-${id}" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:7px 2px;border-radius:9px;font-size:10.5px;font-weight:600;background:${aminoSub===id?"var(--surface-3)":"transparent"};border:1px solid ${aminoSub===id?"var(--border)":"transparent"};color:${aminoSub===id?"var(--t1)":"var(--t4)"}"><span style="font-size:14px;line-height:1">${icon}</span><span style="line-height:1;white-space:nowrap">${label}</span></button>`;
  let content = "";
  if (aminoSub === "chat") {
    {
      content = `<div id="amino-chat" style="height:54vh;overflow-y:auto;display:flex;flex-direction:column;gap:10px;margin-bottom:10px">
        ${msgs.length===0?`<div style="text-align:center;padding:20px 0">
          
          <div style="font-size:17px;font-weight:700;color:var(--t1);margin-bottom:6px">What would you like to explore?</div>
          <div class="nx-muted" style="margin-bottom:15px">Start with a question about your recorded information.</div>
          <div style="display:flex;flex-direction:column;gap:10px;text-align:left">
            ${nexusSuggestions().map(g=>`<div>
              <div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin-bottom:5px">${esc(g.label.toUpperCase())}</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px">${g.items.map(q=>`<button class="amino-suggest" data-q="${esc(q)}" style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:5px 10px;font-size:11px;color:var(--t3)">${esc(q)}</button>`).join("")}</div>
            </div>`).join("")}
            ${(state.settings.recentNexusQuestions||[]).length?`<div>
              <div class="mono" style="font-size:9px;color:var(--t5);letter-spacing:1.5px;margin-bottom:5px">RECENT QUESTIONS</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px">${state.settings.recentNexusQuestions.map(q=>`<button class="amino-suggest" data-q="${esc(q)}" style="background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:5px 10px;font-size:11px;color:var(--t3)">${esc(q)}</button>`).join("")}</div>
            </div>`:""}
          </div>
        </div>`:""}
        ${msgs.map((m,i)=>`<div style="display:flex;flex-direction:column;${m.role==="user"?"align-items:flex-end":"align-items:flex-start"}">
          <div style="display:flex;${m.role==="user"?"justify-content:flex-end":""};width:100%">
            <div style="max-width:86%;padding:9px 12px;border-radius:${m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px"};background:${m.role==="user"?"#A78BFA":"var(--surface-2)"};color:${m.role==="user"?"#fff":"var(--t1)"};font-size:13px;line-height:1.5;white-space:pre-wrap">${mdLite(m.content)}</div>
          </div>
          ${m.role==="assistant"&&i===msgs.length-1&&(m.followups||[]).length?`<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px">${m.followups.map(q=>`<button class="amino-suggest" data-q="${esc(q)}" style="background:var(--surface-3);border:1px solid var(--border);border-radius:12px;padding:4px 9px;font-size:10.5px;color:var(--t3)">${esc(q)}</button>`).join("")}</div>`:""}
        </div>`).join("")}
        ${state._aminoLoading?`<div style="display:flex"><div style="padding:9px 12px;border-radius:16px;background:var(--surface-2);color:var(--t4);font-size:13px">Thinking…</div></div>`:""}
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <textarea id="amino-input" class="inp" placeholder="Ask about your protocol…" style="flex:1;min-height:40px;max-height:80px;resize:none;padding:9px 12px;border-radius:12px;line-height:1.4;font-size:13px" rows="1"></textarea>
        <button id="amino-send" style="background:#A78BFA;color:#fff;border-radius:12px;padding:9px 16px;font-size:13px;font-weight:600;flex-shrink:0">Send</button>
      </div>
      ${msgs.length>0?`<button id="amino-clear" style="margin-top:6px;width:100%;font-size:11px;color:var(--t5);background:none;border:none;text-align:center">Clear conversation</button>`:""}
      <div style="font-size:10px;color:var(--t5);text-align:center;margin-top:6px">Answers from your data first · no internet needed</div>`;
    }
  } else if (aminoSub === "insights") {
    content = dataHealthCard() + insightsFeed();
  } else if (aminoSub === "journal") {
    content = journalView();
  } else if (aminoSub === "explore") {
    content = featureExplorerView();
  } else {
    if (state._discoverOpen != null) { content = discoverDetail(state._discoverOpen); }
    else if (state._guideOpen != null) content = guideDetail(state._guideOpen);
    else content = learnContent();
  }
  return `<div class="nx-page-intro"><h1 class="serif greet">Nexus</h1><p>Ask questions about your records or explore descriptive insights.</p></div>
  <nav class="nx-direct-nav" aria-label="Nexus navigation">
    <button id="as-chat" aria-selected="${aminoSub==="chat"}">Ask</button>
    <button id="as-journal" aria-selected="${aminoSub==="journal"}">Journal</button>
    <button id="as-learn" aria-selected="${aminoSub==="learn"}">Learn</button>
    <button id="as-explore" aria-selected="${aminoSub==="explore"}">Explore</button>
  </nav>
  ${aminoSub==="chat"?`<button type="button" id="nx-ask-changes" class="nx-report-shortcut" style="margin:10px 0;padding:10px 14px;border:1px solid var(--border-sub);background:var(--surface-2);color:var(--t1);border-radius:11px;width:100%;text-align:left;font-size:13px">What changed in my recent check-ins? →</button>`:""}
  ${content}`;
}

// ─── Adherence Calendar (12-week grid) ────────────────────────────────────────
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

