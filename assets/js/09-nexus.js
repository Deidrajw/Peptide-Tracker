function nxMeasurementDashboard(logs, unit, period, selected) {
  const days={"1M":30,"3M":90,"6M":180};
  const cutoff=days[period]?Date.now()-days[period]*86400000:-Infinity;
  const valid=logs.filter(x=>x.date&&Number.isFinite(new Date(x.date).getTime())&&new Date(x.date).getTime()>=cutoff).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
  const keys=MEASURES;
  const key=keys.some(([k])=>k===selected)?selected:keys[0][0];
  const entries=valid.filter(x=>x[key]!==null&&x[key]!==undefined&&x[key]!==""&&Number.isFinite(Number(x[key])));
  const latest=entries.at(-1),previous=entries.at(-2),first=entries[0];
  const fmt=n=>Number(n).toFixed(1);
  const diff=(a,b,metric=key)=>{if(!a||!b)return '—';const n=Number(a[metric])-Number(b[metric]);return `${n>0?'+':n<0?'−':''}${Math.abs(n).toFixed(1)} ${unit}`};
  const selectedLabel=keys.find(([k])=>k===key)?.[1]||key;
  const chart=()=>{
    if(entries.length<2)return `<div class="nx-md-empty">Add another ${esc(selectedLabel.toLowerCase())} entry to see a trend.</div>`;
    const W=560,H=190,L=32,R=18,T=17,B=30;
    const xvals=entries.map(x=>new Date(x.date).getTime()),yvals=entries.map(x=>Number(x[key]));
    const minX=Math.min(...xvals),maxX=Math.max(...xvals),minY=Math.min(...yvals),maxY=Math.max(...yvals),padY=Math.max((maxY-minY)*.2,.3);
    const x=t=>L+(t-minX)/((maxX-minX)||1)*(W-L-R);
    const y=n=>T+(1-(n-(minY-padY))/((maxY-minY+2*padY)||1))*(H-T-B);
    const points=entries.map(e=>`${x(new Date(e.date).getTime()).toFixed(1)},${y(Number(e[key])).toFixed(1)}`);
    return `<svg class="nx-md-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(selectedLabel)} measurement history, ${entries.length} entries plotted by actual date"><line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="var(--border-sub)"/><polyline fill="none" stroke="var(--accent,#A78BFA)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points.join(' ')}"/>${entries.map((e,i)=>`<circle cx="${x(new Date(e.date).getTime())}" cy="${y(Number(e[key]))}" r="4" fill="var(--accent,#A78BFA)"><title>${esc(fmtDate(e.date))}: ${fmt(e[key])} ${esc(unit)}</title></circle>`).join('')}<text x="${L}" y="${H-7}" font-size="11" fill="var(--t3)">${esc(fmtShort(entries[0].date))}</text><text x="${W-R}" y="${H-7}" font-size="11" fill="var(--t3)" text-anchor="end">${esc(fmtShort(latest.date))}</text></svg>`;
  };
  return `<section class="nx-md" aria-label="Body measurements dashboard">
    <div class="nx-md-top"><div><div class="nx-md-eyebrow">BODY PROGRESS</div><h3>Measurements</h3><p>Choose an area to view its recorded history.</p></div><span class="nx-md-count">${valid.length} measurement sessions</span></div>
    <div class="nx-md-tiles" role="group" aria-label="Select measurement">${keys.map(([k,label])=>{
      const a=valid.filter(x=>x[k]!==null&&x[k]!==undefined&&x[k]!==""&&Number.isFinite(Number(x[k]))),last=a.at(-1),prev=a.at(-2);
      return `<button type="button" class="nx-md-tile ${k===key?'is-selected':''}" data-nx-measure="${esc(k)}" aria-pressed="${k===key}"><span class="nx-md-label">${esc(label)}</span><strong>${last?fmt(last[k]):'—'}<small>${last?' '+esc(unit):''}</small></strong><span class="nx-md-tile-foot">${last&&prev?`${diff(last,prev,k)} vs previous`:last?'1 recorded entry':'No entries in period'}</span><span class="nx-md-tile-date">${last?esc(fmtShort(last.date)):'No date'}</span></button>`;
    }).join('')}</div>
    <div class="nx-md-detail"><div class="nx-md-detail-heading"><div><div class="nx-md-eyebrow">SELECTED MEASUREMENT</div><h4>${esc(selectedLabel)}</h4></div><span class="nx-md-count">${entries.length} entries</span></div>
    <div class="nx-md-metrics"><div><small>Latest recorded</small><strong>${latest?fmt(latest[key])+' '+esc(unit):'—'}</strong><span>${latest?esc(fmtDate(latest.date)):'No entries'}</span></div><div><small>Since previous</small><strong>${diff(latest,previous)}</strong><span>${previous?esc(fmtDate(previous.date)):'Need 2 entries'}</span></div><div><small>Within selected period</small><strong>${diff(latest,first&&first!==latest?first:null)}</strong><span>${entries.length>1?'First to latest recorded':'Need 2 entries'}</span></div></div>
    <div class="nx-md-chart">${chart()}</div>
    <details class="nx-md-history"><summary>View ${esc(selectedLabel.toLowerCase())} history <span>${entries.length} entries</span></summary><div class="nx-md-history-list">${entries.length?entries.slice().reverse().map(e=>`<div><time>${esc(fmtDate(e.date))}</time><strong>${fmt(e[key])} ${esc(unit)}</strong></div>`).join(''):'<p>No measurements recorded in this period.</p>'}</div></details>
    <p class="nx-md-footnote">Changes compare recorded values, not estimated body composition. Missing entries are not interpolated.</p></div></section>`;
}

function nxWeightPeriodSummary(logs,unit,period) {
  const days={"1M":30,"3M":90,"6M":180};
  const cutoff=days[period]?Date.now()-days[period]*86400000:-Infinity;
  const rows=logs.filter(x=>x.date&&Number.isFinite(new Date(x.date).getTime())&&new Date(x.date).getTime()>=cutoff&&x.weight!==""&&x.weight!=null&&Number.isFinite(Number(x.weight))).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(!rows.length)return `<div class="nx-md-empty">No weight entries in this period.</div>`;
  const first=Number(rows[0].weight),last=Number(rows[rows.length-1].weight),delta=last-first;
  return `<div class="nx-body-summary"><div class="nx-body-stat-grid"><div class="nx-body-stat"><small>Latest recorded weight</small><strong>${last.toFixed(1)} <em>${esc(unit)}</em></strong><span>${esc(fmtDate(rows[rows.length-1].date))}</span></div><div class="nx-body-stat"><small>Change within period</small><strong>${rows.length<2?'—':`${delta>0?'+':''}${delta.toFixed(1)} ${esc(unit)}`}</strong><span>${rows.length<2?'Need 2 entries':`${rows.length} entries · first ${esc(fmtShort(rows[0].date))}`}</span></div></div></div>`;
}
function nxBodySummary(weightLogs, measurementLogs, unit, munit, period) {
  const days={"1M":30,"3M":90,"6M":180};
  const cutoff=days[period]?Date.now()-days[period]*86400000:-Infinity;
  const within=arr=>arr.filter(x=>x.date&&Number.isFinite(new Date(x.date).getTime())&&new Date(x.date).getTime()>=cutoff).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
  const weights=within(weightLogs).filter(x=>Number.isFinite(Number(x.weight))&&x.weight!=="");
  const waist=within(measurementLogs).filter(x=>x.waist!==""&&x.waist!=null&&Number.isFinite(Number(x.waist)));
  const summary=(items,key,u)=>{
    if(!items.length)return `<div class="nx-body-stat"><small>${key==='weight'?'Weight':'Waist'}</small><strong>—</strong><span>No records in this period</span></div>`;
    const first=Number(items[0][key]),last=Number(items[items.length-1][key]);
    const change=items.length>1?`${last-first>0?'+':''}${(last-first).toFixed(1)} ${esc(u)} since ${esc(fmtShort(items[0].date))}`:'One observation · no change calculated';
    return `<div class="nx-body-stat"><small>${key==='weight'?'Weight':'Waist'} · latest</small><strong>${last.toFixed(1)} <em>${esc(u)}</em></strong><span>${change}</span><small>${items.length} entries · latest ${esc(fmtShort(items[items.length-1].date))}</small></div>`;
  };
  return `<div class="nx-body-summary"><div class="nx-pe-eyebrow">Selected-period overview</div><div class="nx-body-stat-grid">${summary(weights,'weight',unit)}${summary(waist,'waist',munit)}</div><p>Changes compare the earliest and latest recorded values within this selected period. Missing days are not interpolated.</p></div>`;
}
function nxHealthImportContext() {
  const all=(state.activityLogs||[]).filter(a=>!a.isWorkout&&a.date);
  const imported=all.filter(a=>a.importBatchId||a.importedAt||a.source||a.importSource);
  const dates=[...new Set(all.map(a=>dayKey(a.date)))].sort();
  const sourceNames=[...new Set(imported.map(a=>String(a.importSource||a.source||'Imported file')))].slice(0,4);
  return `<section class="nx-health-source"><div class="nx-pe-eyebrow">Data source & coverage</div><strong>Apple Health file imports</strong><p>Health Log currently uses your imported records. Automatic HealthKit syncing is not connected. Imported days are observations, not proof that every metric was captured.</p><div class="nx-health-source-row"><span>${dates.length} recorded calendar days</span><span>${dates.length?`${esc(fmtShort(dates[0]))} – ${esc(fmtShort(dates[dates.length-1]))}`:'No imported dates'}</span></div>${sourceNames.length?`<small>Source labels in records: ${esc(sourceNames.join(', '))}</small>`:''}</section>`;
}

function trendsView() {
  if(state._compoundIntel) return compoundIntelView(state._compoundIntel);
  const unit=state.settings.weightUnit, munit=state.settings.measureUnit, aps=allPeptides();
  const open = state._trendsOpen||{};
  const period = state._weightPeriod||"all";
  const accordionHdr=(key,label,color,badge,showIntel=false)=>{
    const dot=`<div style="width:8px;height:8px;border-radius:50%;background:${color};opacity:${open[key]?1:0.4};flex-shrink:0"></div>`;
    // min-width:0 is required for a flex child to actually shrink below its content size —
    // without it, a long compound name would overflow instead of truncating, and push
    // badge/Intel/chevron out of alignment (the original bug).
    const labelSpan=`<span style="font-size:14px;font-weight:600;color:${open[key]?"var(--t1)":"var(--t2)"};flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(label)}</span>`;
    const chevron=`<span class="nx-chevron-slot" aria-hidden="true"></span>`;
    // Fixed width (not content-driven) so Intel/chevron sit in the same column on every row,
    // regardless of whether dose count is 1 or 3 digits.
    const badgeSpan=badge?`<span style="background:${color}18;color:${color};border:1px solid ${color}33;font-size:10px;font-family:'DM Mono',monospace;font-weight:500;border-radius:99px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;height:22px;min-width:${showIntel?"98px":"auto"};padding:0 10px;line-height:1;box-sizing:border-box;white-space:nowrap">${badge}</span>`:"";
    const intelSpan=showIntel?`<span class="compound-intel-btn" data-name="${esc(key)}" style="border-radius:6px;background:${color}15;border:1px solid ${color}33;color:${color};font-size:10px;flex-shrink:0;display:inline-flex;align-items:center;height:22px;padding:0 9px;line-height:1;box-sizing:border-box;white-space:nowrap">Intel ›</span>`:"";
    return `<div class="app-acc" style="border:1px solid ${open[key]?color+"44":"var(--border-sub)"};background:var(--surface)"><button class="tacc" data-key="${esc(key)}" aria-expanded="${!!open[key]}" aria-label="${esc(label)} — ${open[key]?"expanded":"collapsed"}" style="display:flex;align-items:center;gap:8px;width:100%;padding:14px 16px;background:transparent">${dot}${labelSpan}${badgeSpan}${intelSpan}${chevron}</button>`;
  };
  const accordionBody=(key,color,inner)=>`${open[key]?`<div class="app-acc-body" style="background:var(--surface-2);padding:18px">${inner}</div>`:""}</div>`;

  // The summary uses actual stored records, never fixed demonstration metrics.
  const weightSorted=[...state.weightLogs].filter(w=>Number.isFinite(Number(w.weight))).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const firstWeight=weightSorted[0], lastWeight=weightSorted[weightSorted.length-1];
  const delta=weightSorted.length>1?Number(lastWeight.weight)-Number(firstWeight.weight):null;
  const signedDelta=delta===null?"—":`${delta>0?"+":""}${delta.toFixed(1)} ${esc(unit)}`;
  const latestWeight=lastWeight?`${esc(lastWeight.weight)} ${esc(unit)}`:"—";
  const doseCount=Object.values(aps).reduce((sum,p)=>sum+(p.doses||[]).length,0);
  const trackedCount=Object.values(aps).filter(p=>(p.doses||[]).length).length;
  const activityCount=(state.activityLogs||[]).filter(a=>a.restingHR||a.hrv||a.avgHeartRate||a.basalCalories||a.exerciseMinutes||a.standHours).length;
  const summaryStat=(label,value,foot)=>`<div class="nx-trends-stat"><div class="nx-trends-stat-label">${label}</div><div class="nx-trends-stat-value">${value}</div><div class="nx-trends-stat-foot">${foot}</div></div>`;
  let html=`<div class="nx-trends-intro">
    <div class="nx-trends-eyebrow">Your data, over time</div>
    <h1 class="serif greet">Trends</h1>
    <p>Explore your recorded measurements, health activity, and compound history. Summaries reflect logged data, not medical conclusions.</p>
  </div>
  <div class="nx-trends-summary" aria-label="Recorded trends overview">
    ${summaryStat("Latest weight",latestWeight,lastWeight?fmtDate(lastWeight.date):"No weight entries")}
    ${summaryStat("Weight change",signedDelta,delta===null?"Add 2+ entries to compare":"First to latest recorded entry")}
    ${summaryStat("Logged doses",String(doseCount),`${trackedCount} compound${trackedCount===1?"":"s"} with history`)}
    ${summaryStat("Health days",String(activityCount),"Days with recorded health metrics")}
  </div>
  <nav class="nx-trends-jump" aria-label="Explore trends sections">
    <button class="nx-trends-go" data-key="weight">Body metrics</button>
    <button class="nx-trends-go" data-key="healthlog">Health</button>
    <button class="nx-trends-library-jump" type="button">Compounds</button>
  </nav>
  <div class="nx-trends-section-caption">Body &amp; health</div>`;

  // Body Progress — one shared range control, two focused views.
  const bodyTab=state._nxBodyTab==="measurements"?"measurements":"weight";
  const rangeDays={"1M":30,"3M":90,"6M":180};
  const bodyCutoff=rangeDays[period]?Date.now()-rangeDays[period]*86400000:-Infinity;
  const periodWeights=(state.weightLogs||[]).filter(w=>w.date&&Number.isFinite(new Date(w.date).getTime())&&new Date(w.date).getTime()>=bodyCutoff&&w.weight!==""&&w.weight!=null&&Number.isFinite(Number(w.weight))).slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
  const weightHistory=periodWeights.length?`<details class="nx-body-records"><summary>Inspect weight records · ${periodWeights.length} entries</summary><div class="nx-body-records-list">${periodWeights.map(w=>`<div><time>${esc(fmtDate(w.date))}</time><span>${esc(w.weight)} ${esc(unit)}</span><button type="button" class="delweight" data-id="${esc(w.id)}" aria-label="Delete weight entry dated ${esc(fmtDate(w.date))}">×</button></div>`).join("")}</div></details>`:"";
  html+=accordionHdr("weight","Body Progress","#8AB4FF",state.weightLogs.length+state.measurementLogs.length?"Weight & measurements":null);
  html+=accordionBody("weight","#8AB4FF",`
    <div class="nx-body-tabs" role="group" aria-label="Body Progress view">
      <button type="button" class="nx-body-tab ${bodyTab==="weight"?"is-active":""}" data-nx-body-tab="weight" aria-pressed="${bodyTab==="weight"}">Weight</button>
      <button type="button" class="nx-body-tab ${bodyTab==="measurements"?"is-active":""}" data-nx-body-tab="measurements" aria-pressed="${bodyTab==="measurements"}">Measurements</button>
    </div>
    <div class="seg" style="margin-bottom:14px" id="wperiod" aria-label="Body Progress date range">
      ${["1M","3M","6M","all"].map(p=>`<button id="wp-${p}" class="${period===p?"on":""}">${p==="all"?"All":p}</button>`).join("")}
    </div>
    ${bodyTab==="weight"?`
      <div class="nx-body-panel-head"><div><div class="nx-md-eyebrow">BODY PROGRESS</div><h3>Weight</h3><p>Recorded weigh-ins in the selected period</p></div></div>
      ${nxWeightPeriodSummary(state.weightLogs,unit,period)}
      <div class="chart-tap" data-kind="weight" data-period="${period}" style="cursor:pointer" role="button" tabindex="0" aria-label="Inspect weight chart">${weightChart(state.weightLogs,unit,period)}</div>
      ${weightHistory}
      <p class="nx-body-panel-note">All changes reflect recorded measurements within this period. Missing days are not estimated.</p>
    `:`${nxMeasurementDashboard(state.measurementLogs,munit,period,state._nxSelectedMeasure||"waist")}`}
  `);
  html+=`<div style="margin-bottom:10px"></div>`;

  // Health Log accordion
  const healthLogCount = state.activityLogs.filter(a=>a.restingHR||a.hrv||a.avgHeartRate||a.basalCalories||a.exerciseMinutes||a.standHours).length;
  html+=accordionHdr("healthlog","Health Log","#FF9CC8",healthLogCount?healthLogCount+" days":null);
  html+=accordionBody("healthlog","#FF9CC8",`<div class="nx-health-manage"><button type="button" id="nx-health-manage">Manage imported health data ↗</button></div>`+healthLogSection());
  html+=`<div style="margin-bottom:10px"></div>`;

  // Exploratory comparisons belong to Trends, not to an individual compound.
  html+=`<section class="nx-pe-entry" aria-label="Pattern Explorer"><div class="nx-trends-eyebrow">Optional exploration</div>
    <h3>Pattern Explorer</h3><p>Explore supplement check-ins or symptom timing using exact dated records and clear data-coverage limits.</p>
    <div class="nx-pe-actions"><button type="button" id="nx-open-pattern">Supplement patterns →</button>
    <button type="button" id="nx-open-symptom-timing">Symptom timing →</button></div></section>`;

  // Per-compound sections
  const startedPeps=Object.entries(aps).filter(([,d])=>(d.doses||[]).length>0);
  const blendIngredientSources=new Map();
  for(const kit of state.supplies||[]){
    if(!kit.isBlend)continue;
    for(const part of kit.composition||[]){
      if(!part.compound)continue;
      if(!blendIngredientSources.has(part.compound))blendIngredientSources.set(part.compound,new Set());
      blendIngredientSources.get(part.compound).add(kit.name);
    }
  }
  const ingredientLinks=[...blendIngredientSources].filter(([name])=>!startedPeps.some(([tracked])=>tracked===name))
    .map(([name,sources])=>'<button type="button" class="nx-library-item nx-library-ingredient" data-nx-compound="'+esc(name)+'"><span><strong>'+esc(name)+'</strong><span class="nx-library-meta" style="display:block">From blend · '+esc([...sources].join(', '))+'</span></span><span aria-hidden="true">›</span></button>').join('');
  if(startedPeps.length || ingredientLinks) {
    const names=startedPeps.map(([name,data])=>({name,count:(data.doses||[]).length,last:[...(data.doses||[])].sort((a,b)=>safeDate(b.date)-safeDate(a.date))[0]?.date}));
    const selected=state._nxHistorySelected;
    if(selected&&names.some(n=>n.name===selected)) html=`<div class="nx-library-head nx-history-screen-back"><button type="button" class="nx-library-back" id="nx-library-back">← All compounds</button><span class="nx-library-meta">Compound history</span></div>`;
    else html+=`<section class="nx-library" id="nx-compound-library" aria-label="Compound history browser"><div class="nx-library-head"><h3>Compound History</h3><span class="nx-library-meta">${names.length+[...blendIngredientSources.keys()].filter(k=>!names.some(n=>n.name===k)).length} compounds</span></div>
      <input id="nx-library-search" class="nx-library-search" type="search" placeholder="Search compounds…" aria-label="Search compound history" value="${esc(state._nxHistoryQuery||'')}">
      <div id="nx-library-list" class="nx-library-list">${names.map(item=>`<button type="button" class="nx-library-item ${selected===item.name?'is-active':''}" data-nx-compound="${esc(item.name)}"><span><strong>${esc(item.name)}</strong><span class="nx-library-meta" style="display:block">${item.count} logged doses · ${item.last?`Last ${esc(fmtShort(item.last))}`:'No date'}</span></span><span aria-hidden="true">›</span></button>`).join('')}${ingredientLinks}</div></section>`;

  }
  startedPeps.forEach(([name,data])=>{
    if(name!==state._nxHistorySelected) return;
    const c=cfg(name), doses=data.doses||[];
    const chronological=[...doses].sort((a,b)=>safeDate(a.date)-safeDate(b.date));
    const blendSources=(state.supplies||[]).filter(k=>k.isBlend&&k.name===name);
    const isBlendIngredient=(state.supplies||[]).some(k=>k.isBlend&&(k.composition||[]).some(x=>x.compound===name));
    const last=chronological[chronological.length-1];
    const first=chronological[0];
    const validDoses=chronological.filter(d=>Number.isFinite(Number(d.dose)));
    const schedule=Number(data.scheduleDays||c.defaultSchedule||c.scheduleDays);
    const halfLife=Number(c.halfLifeDays);
    const modeled=Number.isFinite(halfLife)&&halfLife>0&&Number.isFinite(schedule)&&schedule>0&&validDoses.length>=3;
    const showAccumulation=modeled&&halfLife/schedule>0.3;
    const isInjection=chronological.some(d=>d.site)||/inject|subcut|intramuscular|\bsc\b|\bim\b/i.test(String(data.route||data.method||c.route||c.method||''));
    const siteRecorded=chronological.some(d=>d.site);
    const loggedSymptoms=(state.dailyLogs||[]).filter(d=>Array.isArray(d.symptoms)&&d.symptoms.length>0);
    const enoughObservations=loggedSymptoms.length>=3;
    const overlappingSupp=(state.supplementLogs||[]).filter(s=>s.date&&first&&safeDate(s.date)>=safeDate(first.date));
    const showSupp=overlappingSupp.length>=5&&enoughObservations;
    const subKey=k=>name+'_'+k;
    const subOpen=k=>!!(state._trendsOpen||{})[subKey(k)];
    const subHdr=(k,label)=>`<div class="app-sub-acc" style="border:1px solid var(--border-sub);background:var(--surface-2)"><button class="tacc" data-key="${esc(subKey(k))}" aria-expanded="${subOpen(k)}" style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:12px;background:transparent"><span style="font-size:12px;font-weight:650;color:var(--t2)">${label}</span></button>`;
    const subBody=(k,content)=>`${subOpen(k)?`<div class="app-sub-body" style="padding:12px">${content}</div>`:''}</div>`;
    const sub=(k,label,content)=>subHdr(k,label)+subBody(k,content);
    const fact=(value,label)=>`<div class="nx-compound-fact"><b>${value}</b><span>${label}</span></div>`;
    const unitText=esc(c.unit||'');
    const latest=last&&last.dose!=null?`${esc(last.dose)} ${unitText}`:'—';
    const latestDate=last?fmtShort(last.date):'—';
    const changes=chronological.reduce((n,d,i)=>i>0&&Number(d.dose)!==Number(chronological[i-1].dose)?n+1:n,0);
    const nameId=esc(name);
    html+=`<article class="nx-compound-card" aria-label="${nameId} recorded trends">
      <div class="nx-compound-top"><div class="nx-compound-mark" style="background:${c.color}"></div>
        <div style="flex:1;min-width:0"><div class="nx-compound-title">${nameId}</div><div class="nx-compound-meta">${doses.length} logged dose${doses.length===1?'':'s'} · Last logged ${latestDate}</div></div>
        <button class="nx-compound-intel compound-intel-btn" data-name="${nameId}" aria-label="Open ${nameId} compound information">Details ›</button>
      </div>
      <div class="nx-compound-facts">${fact(String(doses.length),'Logged doses')}${fact(latest,'Latest dose')}${fact(String(changes),'Dose changes')}</div>
      <div class="nx-compound-main">
        <div class="nx-compound-heading" style="font-size:17px">Dose history</div>
        <div class="nx-compound-desc">Recorded dose amounts, in entry order. Step changes reflect logged amounts—not a modeled drug concentration.</div>
        ${escalationChart(doses,c)}
        <button type="button" class="nx-trends-open-detail" data-name="${nameId}" data-kind="dose">Explore dose records${blendSources.length?" & ingredients":""} →</button>
        ${blendIngredientSources.has(name)?`<button type="button" class="nx-compound-blend-contributions" data-name="${nameId}" style="width:100%;min-height:48px;margin-top:8px;border:1px solid var(--border-sub);border-radius:12px;background:var(--surface-2);color:var(--t1);font-size:14px;font-weight:650">View contributions from blends ›</button>`:""}
        ${isBlendIngredient?'<button type="button" class="nx-open-ingredient-overview nx-trends-open-detail" data-name="'+nameId+'">View direct doses &amp; blend contributions ›</button>':''}
        <div class="nx-compound-caption">First logged ${first?fmtDate(first.date):'—'} · Last logged ${last?fmtDate(last.date):'—'}</div>
      </div>
      <details class="nx-compound-details"><summary>Observations ${enoughObservations?'':'· Limited records'}</summary><div class="nx-compound-details-body">
        ${enoughObservations?`<button type="button" class="nx-trends-open-detail" data-name="${nameId}" data-kind="symptom">Explore symptom records &amp; compare periods <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-left:8px"><path d="m9 18 6-6-6-6"/></svg></button>`+sub('syms','Recorded symptom frequency',sideEffectsSection(name,doses)):`<div class="nx-compound-caption">Symptom comparisons are hidden until at least three dated symptom observations are recorded. This does not establish causation.</div>`}
        ${siteRecorded?sub('sites','Recorded injection sites',siteTrackerSection(name,doses)):''}
        ${!siteRecorded&&isInjection?`<div class="nx-compound-caption">No injection sites have been recorded for this compound.</div>`:''}
        ${changes?`<div class="nx-compound-caption">${changes} recorded dose amount change${changes===1?'':'s'}. This history does not indicate whether a change is appropriate or safe.</div>`:''}
      </div></details>
      <details class="nx-compound-details"><summary>Models &amp; explorations <span class="nx-compound-status">Optional</span></summary><div class="nx-compound-details-body">
        <div class="nx-compound-caption">These are estimates or exploratory comparisons, not measurements of blood concentration or recommendations to change doses.</div>
        ${modeled&&c.phases?sub('pk','Estimated plasma activity',`<div class="nx-model-warning">Illustrative exposure model based on configured half-life and logged doses. Not measured plasma concentration, a therapeutic range, or a dosing recommendation.</div>${pkCurveFull(name,data)}`):''}
        ${showAccumulation?sub('acc','Estimated accumulation',`<div class="nx-model-warning">Simplified repeat-dose model. Its percentages and ranges are mathematical comparisons, not verified effective or safe concentrations.</div>${accumulationSection(name,data,c)}`):''}
        ${!(modeled&&c.phases)&&!showAccumulation?`<div class="nx-compound-caption">No supported advanced models are available from the current records and configuration. Explore symptom timing separately in Pattern Explorer.</div>`:''}
      </div></details>
    </article>`;
  });
  if(!startedPeps.length) html+=`<div style="color:var(--t4);font-size:13px;text-align:center;padding:30px 0">Log your first dose to start seeing compound trends.</div>`;
  // Blend composition remains in the kit and contextual compound details.
  // Do not duplicate full composition cards at the bottom of Trends home.
  return html;
}


// ─── Supply Estimator ────────────────────────────────────────────────────────
// ─── Supply Planner ──────────────────────────────────────────────────────────
// Replaces the separate Estimator and Cycle Coverage entry points — both were really
// answering the same question ("do I have enough for what I plan to do?"), and the old
// Estimator duplicated its own inventory math instead of using getKitRemainingMg. Every
// number here is derived from the same canonical functions Stash/Coverage/reminders use.
function supplyPlannerModal(initialTab) {
  let tab = initialTab || "coverage";
  const aps = allPeptides();
  const compoundNames = [...new Set((state.supplies||[]).map(s=>s.name))].sort();

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#C9A0FF;letter-spacing:1.5px">📊 SUPPLY PLANNER</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">
      ${[["coverage","Coverage"],["protocol","Protocol Coverage"],["purchase","Plan a Purchase"]].map(([id,label])=>
        `<button class="sp-tab" data-tab="${id}" style="padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;background:${tab===id?"#C9A0FF22":"var(--surface-2)"};border:1px solid ${tab===id?"#C9A0FF55":"var(--border-sub)"};color:${tab===id?"#C9A0FF":"var(--t3)"}">${label}</button>`).join("")}
    </div>
    <div id="sp-body"></div>
  `, "#C9A0FF");
  m.querySelector("#x").onclick = closeModal;

  function renderBody() {
    const body = m.querySelector("#sp-body");
    if (tab==="coverage") {
      if (!compoundNames.length) { body.innerHTML = `<div class="hint">No kits tracked yet — add one in Stash first.</div>`; return; }
      body.innerHTML = compoundNames.map(name=>{
        const inv = getCompoundInventorySummary(name);
        const c = cfg(name);
        const doses = (aps[name]?.doses||[]).slice(-6);
        const avgMg = doses.length ? doses.reduce((a,d)=>a+doseToMg(d.dose,c.unit),0)/doses.length : 0;
        const totalUsable = inv.totalMg + inv.preparedMg;
        const dosesLeft = avgMg>0 ? Math.floor(totalUsable/avgMg) : null;
        return `<div style="padding:12px 0;border-bottom:1px solid var(--surface-2)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <span style="font-size:13px;font-weight:600;color:var(--t1)">${esc(name)}</span>
            <span style="font-size:12px;color:${c.color}">${totalUsable.toFixed(1)}${c.unit} total</span>
          </div>
          <div style="font-size:11px;color:var(--t4)">${inv.activeMg.toFixed(1)}${c.unit} active · ${inv.reserveMg.toFixed(1)}${c.unit} reserve${inv.preparedMg>0?` · ${inv.preparedMg.toFixed(1)}${c.unit} prepared`:""}</div>
          <div style="font-size:11px;color:var(--t5);margin-top:2px">${dosesLeft!=null?`~${dosesLeft} doses left at current pace`:"No dose history to project from"}</div>
        </div>`;
      }).join("");
    } else if (tab==="protocol") {
      const activeProtocols = (state.protocols||[]).filter(p=>["active","in_progress","paused"].includes(p.status));
      if (!activeProtocols.length) { body.innerHTML = `<div class="hint">No active protocols to check coverage for.</div>`; return; }
      body.innerHTML = `
        <label class="field-label">PROTOCOL</label>
        <select id="sp-proto" class="inp" style="margin-bottom:16px">${activeProtocols.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select>
        <div id="sp-proto-detail"></div>
      `;
      const renderProtoDetail = () => {
        // .value on a <select> is ALWAYS a string, while p.id (from uid()) is a number —
        // strict equality between them silently fails every time, which is exactly why
        // switching the dropdown never changed anything: the lookup always failed and
        // fell back to activeProtocols[0], regardless of what was actually selected.
        const proto = activeProtocols.find(p=>String(p.id)===m.querySelector("#sp-proto").value) || activeProtocols[0];
        const detail = m.querySelector("#sp-proto-detail");
        detail.innerHTML = (proto.compounds||[]).map(comp=>{
          const c = cfg(comp.name);
          const req = getProtocolRemainingRequirement(proto, comp);
          const inv = getCompoundInventorySummary(comp.name);
          const usable = inv.totalMg + inv.preparedMg;
          const covers = usable >= req.totalMg;
          const shortfall = Math.max(0, req.totalMg - usable);
          if (req.notStartedYet) return `<div style="padding:10px 0;border-bottom:1px solid var(--surface-2);font-size:12px;color:var(--t4)">${esc(comp.name)}: hasn't started yet</div>`;
          return `<div style="padding:12px 0;border-bottom:1px solid var(--surface-2)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:13px;font-weight:600;color:var(--t1)">${esc(comp.name)}</span>
              <span style="font-size:11px;color:${covers?"#7DF9C0":"#ff7c7c"}">${covers?"✓ Covered":"⚠ Shortfall"}</span>
            </div>
            <div style="font-size:11px;color:var(--t4)">Needs ${req.totalMg.toFixed(1)}${c.unit} through end of protocol (${req.totalDoses} doses across ${req.phases.filter(p=>p.type==="dose").length} dose phase${req.phases.filter(p=>p.type==="dose").length===1?"":"s"})</div>
            <div style="font-size:11px;color:var(--t5)">Have ${usable.toFixed(1)}${c.unit} (${inv.activeMg.toFixed(1)} active + ${inv.reserveMg.toFixed(1)} reserve${inv.preparedMg>0?` + ${inv.preparedMg.toFixed(1)} prepared`:""})</div>
            ${!covers?`<div style="font-size:11px;color:#ff7c7c;margin-top:3px;font-weight:600">Short ~${shortfall.toFixed(1)}${c.unit}</div>`:""}
          </div>`;
        }).join("");
      };
      m.querySelector("#sp-proto").onchange = renderProtoDetail;
      renderProtoDetail();
    } else if (tab==="purchase") {
      body.innerHTML = `
        <label class="field-label">COMPOUND</label>
        <select id="pp-name" class="inp" style="margin-bottom:14px">${compoundNames.length?compoundNames.map(n=>`<option>${esc(n)}</option>`).join(""):[...new Set([...Object.keys(PEPTIDES),...Object.keys(state.customPeptides)])].sort().map(n=>`<option>${esc(n)}</option>`).join("")}</select>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          <div><label class="field-label">DOSE</label><input id="pp-dose" type="number" step="0.1" class="inp" placeholder="e.g. 1.5"></div>
          <div><label class="field-label">TIMES/WEEK</label><input id="pp-freq" type="number" step="0.5" class="inp" value="1"></div>
          <div><label class="field-label">DURATION (weeks)</label><input id="pp-weeks" type="number" class="inp" placeholder="e.g. 12"></div>
          <div><label class="field-label">MG PER VIAL</label><input id="pp-vial" class="inp" placeholder="e.g. 30"></div>
        </div>
        <button id="pp-calc" class="btn-primary" style="background:#C9A0FF;margin-bottom:14px">Calculate</button>
        <div id="pp-result"></div>
      `;
      const autofill = () => {
        const name = m.querySelector("#pp-name").value;
        const kit = (state.supplies||[]).find(s=>s.name===name);
        if (kit?.vialMg) m.querySelector("#pp-vial").value = kit.vialMg;
        const last = [...(aps[name]?.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
        if (last?.dose) m.querySelector("#pp-dose").value = last.dose;
      };
      m.querySelector("#pp-name").onchange = autofill; autofill();
      m.querySelector("#pp-calc").onclick = () => {
        const name = m.querySelector("#pp-name").value, c = cfg(name);
        const dose = parseFloat(m.querySelector("#pp-dose").value);
        const freq = parseFloat(m.querySelector("#pp-freq").value)||1;
        const weeks = parseFloat(m.querySelector("#pp-weeks").value);
        const vialMg = parseFloat(m.querySelector("#pp-vial").value);
        const res = m.querySelector("#pp-result");
        if (!dose||!weeks||!vialMg) { res.innerHTML = `<div style="color:#ff7c7c;font-size:12px">Fill in dose, weeks, and mg per vial.</div>`; return; }
        const totalDoses = Math.round(freq*weeks);
        const totalMg = dose*totalDoses;
        const inv = getCompoundInventorySummary(name);
        const usable = inv.totalMg + inv.preparedMg;
        const shortfall = Math.max(0, totalMg-usable);
        const vialsToBuy = shortfall>0 ? Math.ceil(shortfall/vialMg) : 0;
        res.innerHTML = `
          <div style="background:var(--surface-2);border-radius:10px;padding:14px;margin-bottom:10px">
            <div style="font-size:12px;color:var(--t4)">Needs ${totalMg.toFixed(1)}${c.unit} (${totalDoses} doses)</div>
            <div style="font-size:12px;color:var(--t4)">Already have ${usable.toFixed(1)}${c.unit} on hand</div>
          </div>
          <div style="background:${shortfall<=0?"#7DF9C011":"#ff7c7c11"};border:1px solid ${shortfall<=0?"#7DF9C033":"#ff7c7c33"};border-radius:10px;padding:12px 14px">
            <div style="font-size:13px;font-weight:600;color:${shortfall<=0?"#7DF9C0":"#ff7c7c"}">${shortfall<=0?"✓ Already covered — nothing to buy":`Buy ${vialsToBuy} more vial${vialsToBuy===1?"":"s"} (~${shortfall.toFixed(1)}${c.unit} short)`}</div>
          </div>`;
      };
    }
  }
  m.querySelectorAll(".sp-tab").forEach(b=>b.onclick=()=>{ tab=b.dataset.tab; m.querySelectorAll(".sp-tab").forEach(x=>{x.style.background=x===b?"#C9A0FF22":"var(--surface-2)";x.style.color=x===b?"#C9A0FF":"var(--t3)";}); renderBody(); });
  renderBody();
}

function prepareChoiceModal() {
  const compoundNames = [...new Set((state.supplies||[]).map(s=>s.name))].sort();
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">PREPARE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <button id="pc-dose" style="width:100%;text-align:left;padding:14px;border-radius:12px;background:var(--surface-2);border:1px solid var(--border-sub);margin-bottom:10px">
      <div style="font-size:14px;font-weight:600;color:var(--t1);margin-bottom:2px">💉 Prepare Dose</div>
      <div style="font-size:12px;color:var(--t4)">One compound, drawn now, administered later</div>
    </button>
    <button id="pc-mixed" style="width:100%;text-align:left;padding:14px;border-radius:12px;background:#A78BFA0d;border:1px solid #A78BFA33">
      <div style="font-size:14px;font-weight:600;color:#A78BFA;margin-bottom:2px">🧪 Prepare Mixed Syringe</div>
      <div style="font-size:12px;color:var(--t4)">One physical syringe, multiple compounds</div>
    </button>
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#pc-mixed").onclick = () => { closeModal(); prepareMixedSyringeModal(); };
  m.querySelector("#pc-dose").onclick = () => {
    closeModal();
    if (compoundNames.length===1) { prepareDosesModal(compoundNames[0]); return; }
    const cm = openModal(`
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">PREPARE DOSE — COMPOUND</span>
        <button id="x2" style="color:var(--t4);font-size:18px">✕</button>
      </div>
      ${compoundNames.map(n=>{ const c=cfg(n); return `<button class="pc-compound" data-name="${esc(n)}" style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:12px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);margin-bottom:6px"><div style="width:6px;height:6px;border-radius:50%;background:${c.color}"></div><span style="font-size:13px;color:var(--t1)">${esc(n)}</span></button>`; }).join("")}
    `, "#A78BFA");
    cm.querySelector("#x2").onclick = closeModal;
    cm.querySelectorAll(".pc-compound").forEach(b=>b.onclick=()=>{ closeModal(); prepareDosesModal(b.dataset.name); });
  };
}

function preparedListModal() {
  const ready = (state.preparedDoses||[]).filter(pd=>(pd.remainingCount||0)>0);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#A78BFA;letter-spacing:1.5px">💉 PREPARED INVENTORY</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${ready.map(pd=>{
      const comps = getSyringeComponents(pd);
      const isMixed = comps.length>1;
      const label = comps.map(c=>{ const cc=cfg(c.compoundName); return `${c.compoundName} ${c.amount}${c.unit||cc.unit}`; }).join(" + ");
      const primary = cfg(comps[0].compoundName);
      return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <button class="prepared-item" data-id="${pd.id}" style="flex:1;min-width:0;text-align:left;padding:12px 14px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub)">
          <div style="font-size:13px;font-weight:600;color:${isMixed?"#A78BFA":primary.color}">${esc(label)}${isMixed?" · Mixed":""}</div>
          <div style="font-size:11px;color:var(--t5);margin-top:2px">Prepared ${fmtDT(pd.createdAt)}${(pd.count||1)>1?` · ${pd.remainingCount}/${pd.count} left`:""}</div>
        </button>
        <button class="prepared-del" data-id="${pd.id}" style="flex-shrink:0;color:var(--t5);font-size:16px;background:transparent;border:none;padding:8px">✕</button>
      </div>`;
    }).join("") || `<div class="hint">Nothing prepared right now.</div>`}
  `, "#A78BFA");
  m.querySelector("#x").onclick = closeModal;
  m.querySelectorAll(".prepared-item").forEach(b=>b.onclick=()=>{
    const pd = ready.find(p=>String(p.id)===b.dataset.id); if(!pd) return;
    closeModal();
    const comps = getSyringeComponents(pd);
    if (comps.length>1) administerSyringeModal(pd);
    else doseModal(comps[0].compoundName, null, null); // opens dose log; existing prepared-batch picker inside handles administering it
  });
  m.querySelectorAll(".prepared-del").forEach(b=>b.onclick=(e)=>{
    e.stopPropagation();
    const pd = ready.find(p=>String(p.id)===b.dataset.id); if(!pd) return;
    deletePreparedDoseModal(pd);
  });
}

function supplyEstimatorModal() {
  const aps = allPeptides();
  const allCompoundNames = [...new Set([...Object.keys(PEPTIDES), ...LIBRARY.filter(l=>!l.blend).map(l=>l.name), ...Object.keys(state.customPeptides)])].sort();
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#C9A0FF;letter-spacing:1.5px">🧮 SUPPLY ESTIMATOR</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:12px;color:var(--t4);margin-bottom:16px">Plan how much stock you need for a protocol</div>
    <label class="field-label">COMPOUND</label>
    <select id="ec" class="inp" style="margin-bottom:14px">
      ${allCompoundNames.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join("")}
    </select>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label class="field-label">DOSE PER INJECTION</label><input id="ed" type="number" step="0.1" class="inp" placeholder="e.g. 1.5" style="margin-bottom:14px"></div>
      <div><label class="field-label">INJECTIONS / WEEK</label><input id="ef" type="number" step="0.5" class="inp" placeholder="e.g. 1" value="1" style="margin-bottom:14px"></div>
      <div><label class="field-label">PROTOCOL LENGTH (weeks)</label><input id="ew" type="number" class="inp" placeholder="e.g. 12" style="margin-bottom:14px"></div>
      <div><label class="field-label">MG PER VIAL</label><input id="ev" type="number" class="inp" placeholder="e.g. 30" style="margin-bottom:14px"></div>
    </div>
    <label class="field-label">COST PER VIAL (optional)</label>
    <div style="display:flex;gap:10px;margin-bottom:18px">
      <input id="ecp" type="number" step="0.01" class="inp" placeholder="e.g. 20.00">
      <select id="ecur" class="inp" style="width:90px">${["CAD","USD","GBP","EUR","AUD"].map(c=>`<option>${c}</option>`).join("")}</select>
    </div>
    <div id="eresult" style="display:none;background:var(--surface-2);border-radius:12px;padding:16px;margin-bottom:16px"></div>
    <button id="ecalc" class="btn-primary" style="background:#C9A0FF">Calculate</button>
  `, "#C9A0FF");
  m.querySelector("#x").onclick = closeModal;

  const autoFill = () => {
    const name = m.querySelector("#ec").value;
    const c = cfg(name);
    if (c.unit === "mg") {
      // Try to pre-fill from last logged dose
      const doses = (aps[name]?.doses||[]);
      if (doses.length) {
        const last = [...doses].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
        if (last.dose) m.querySelector("#ed").value = last.dose;
      }
      // Pre-fill vial mg from stash
      const kit = state.supplies.find(s=>s.name===name);
      if (kit && kit.vialMg) m.querySelector("#ev").value = kit.vialMg;
      if (kit && kit.cost && kit.totalVials) m.querySelector("#ecp").value = (parseFloat(kit.cost)/kit.totalVials).toFixed(2);
    }
  };
  m.querySelector("#ec").onchange = autoFill;
  autoFill();

  m.querySelector("#ecalc").onclick = () => {
    const name    = m.querySelector("#ec").value;
    const dose    = parseFloat(m.querySelector("#ed").value);
    const freq    = parseFloat(m.querySelector("#ef").value)||1;
    const weeks   = parseFloat(m.querySelector("#ew").value);
    const vialMg  = parseFloat(m.querySelector("#ev").value);
    const costPer = parseFloat(m.querySelector("#ecp").value)||0;
    const cur     = m.querySelector("#ecur").value;
    if (!dose||!weeks||!vialMg) { m.querySelector("#eresult").innerHTML=`<div style="color:#ff7c7c;font-size:12px">Fill in dose, weeks, and mg per vial.</div>`; m.querySelector("#eresult").style.display="block"; return; }
    const totalInjections = Math.round(freq * weeks);
    const totalMg = dose * totalInjections;
    const vialsNeeded = Math.ceil(totalMg / vialMg);
    const totalCost = costPer ? vialsNeeded * costPer : null;
    // Check current stash — canonical remaining (accounts for waste, transfers, and
    // prepared draws), not a from-scratch totalVials×vialMg recount. Previously this only
    // ever subtracted doses, so a transferred/gifted vial's mg — or material already
    // wasted or drawn into a prepared syringe — silently counted as "available," telling
    // someone their stash covered a protocol it actually didn't.
    // Check current stash — canonical remaining, summed across EVERY kit of this
    // compound (not just one arbitrarily picked by name when none happens to be active).
    // Previously this only ever subtracted doses, so a transferred/gifted vial's mg — or
    // material already wasted or drawn into a prepared syringe — silently counted as
    // "available," telling someone their stash covered a protocol it actually didn't.
    const stashMg = state.supplies.filter(s=>s.name===name).reduce((a,s)=>a+getKitRemainingMg(s),0) + getPreparedRemainingMg(name);
    const stashCovers = stashMg >= totalMg;
    const shortfall = Math.max(0, totalMg - stashMg);
    const extraVials = shortfall > 0 ? Math.ceil(shortfall / vialMg) : 0;
    const c = cfg(name);
    m.querySelector("#eresult").innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        ${[["INJECTIONS",totalInjections,""],["TOTAL MG",totalMg.toFixed(1),"mg"],["VIALS NEEDED",vialsNeeded,""],totalCost?["EST. COST",totalCost.toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2})+" "+cur,""]:[null]].filter(x=>x[0]).map(([l,v])=>`<div style="background:var(--surface);border-radius:8px;padding:10px 12px"><div class="mono" style="font-size:8px;color:var(--t5);letter-spacing:1.5px;margin-bottom:4px">${l}</div><div style="font-size:16px;font-weight:700;color:${c.color}">${v}</div></div>`).join("")}
      </div>
      <div style="background:${stashCovers?"#7DF9C011":"#ff7c7c11"};border:1px solid ${stashCovers?"#7DF9C033":"#ff7c7c33"};border-radius:10px;padding:12px 14px">
        <div style="font-size:13px;font-weight:600;color:${stashCovers?"#7DF9C0":"#ff7c7c"};margin-bottom:4px">${stashCovers?"✓ Current stash covers this protocol":"⚠ Need to restock"}</div>
        <div style="font-size:12px;color:var(--t3)">${stashCovers?`${stashMg.toFixed(1)} mg on hand — you have ${((stashMg-totalMg)/dose).toFixed(0)} injections to spare`:`${stashMg.toFixed(1)} mg on hand, ${shortfall.toFixed(1)} mg short — buy ${extraVials} more vial${extraVials===1?"":"s"}`}</div>
      </div>`;
    m.querySelector("#eresult").style.display = "block";
  };
}

// ─── Cycle Planner ───────────────────────────────────────────────────────────
function cyclePlannerModal() {
  // Blends belong here, same reasoning as the Protocol Builder fix — a blend is a real
  // thing you cycle on/off, not something being drawn into another syringe.
  const compoundOpts = [...new Set([...Object.keys(PEPTIDES),...LIBRARY.map(l=>l.name),...Object.keys(state.customPeptides||{})])].sort().map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join("");
  const today = localDate();
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:#7DF9C0;letter-spacing:1.5px">📅 CYCLE COVERAGE</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:12px;color:var(--t4);margin-bottom:16px">See how many on/off cycles your current stash covers — e.g. GHK-Cu 8 weeks on, 8 weeks off</div>
    <label class="field-label">COMPOUND</label>
    <select id="cc" class="inp" style="margin-bottom:14px">${compoundOpts}</select>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label class="field-label">ON PERIOD (weeks)</label><input id="con" type="number" class="inp" value="8" style="margin-bottom:14px"></div>
      <div><label class="field-label">OFF PERIOD (weeks)</label><input id="coff" type="number" class="inp" value="8" style="margin-bottom:14px"></div>
      <div><label class="field-label">CYCLES TO SHOW</label><input id="cnum" type="number" class="inp" value="3" min="1" max="6" style="margin-bottom:14px"></div>
      <div><label class="field-label">FIRST CYCLE START</label><input id="cstart" type="date" class="inp" value="${today}" style="margin-bottom:14px"></div>
    </div>
    <div id="cresult" style="display:none"></div>
    <button id="ccalc" class="btn-primary" style="background:#7DF9C0;color:#000">Generate Timeline</button>
  `, "#7DF9C0");
  m.querySelector("#x").onclick = closeModal;

  m.querySelector("#ccalc").onclick = () => {
    const name  = m.querySelector("#cc").value;
    const onW   = parseFloat(m.querySelector("#con").value)||8;
    const offW  = parseFloat(m.querySelector("#coff").value)||8;
    const num   = Math.min(6, parseInt(m.querySelector("#cnum").value)||3);
    const start = m.querySelector("#cstart").value;
    if (!start) return;
    const c = cfg(name);
    const onDays  = Math.round(onW * 7);
    const offDays = Math.round(offW * 7);
    const aps = allPeptides();
    // Same canonical fix as the Supply Estimator — sums remaining across every kit of
    // this compound (waste/transfer/prepared-aware) instead of arbitrarily picking one
    // kit by name when none happens to be currently active.
    const stashMgAvail = state.supplies.some(s=>s.name===name)
      ? state.supplies.filter(s=>s.name===name).reduce((a,s)=>a+getKitRemainingMg(s),0) + getPreparedRemainingMg(name)
      : null;

    let html = `<div style="margin-bottom:14px">`;
    let cur = start;
    const nowDate = today;
    for (let i = 0; i < num; i++) {
      const onStart = cur;
      const onEnd   = addDays(cur, onDays - 1);
      const offStart = addDays(cur, onDays);
      const offEnd   = addDays(cur, onDays + offDays - 1);
      const isActive = nowDate >= onStart && nowDate <= onEnd;
      const isOff    = nowDate >= offStart && nowDate <= offEnd;
      const isPast   = nowDate > offEnd;
      const isFuture = nowDate < onStart;
      const status   = isPast?"Past":isActive?"● Active":isOff?"◌ Off period":isFuture?"Upcoming":"";
      const statusCol = isActive?c.color:isOff?"var(--t4)":isPast?"var(--t5)":"var(--t3)";

      // Progress bar for active cycle
      let progressBar = "";
      if (isActive) {
        const elapsed = (new Date(nowDate) - new Date(onStart)) / 86400000;
        const pct = Math.round(elapsed / onDays * 100);
        const daysLeft = onDays - elapsed;
        progressBar = `<div style="margin:8px 0 4px"><div style="height:6px;background:var(--surface-3);border-radius:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${c.color};border-radius:3px"></div></div><div style="font-size:10px;color:var(--t4);margin-top:3px">Day ${Math.round(elapsed)+1} of ${onDays} · ${Math.ceil(daysLeft)}d remaining</div></div>`;
      } else if (isFuture && i === 0) {
        const daysUntilStart = Math.ceil((new Date(onStart) - new Date(nowDate)) / 86400000);
        progressBar = `<div style="font-size:11px;color:var(--t3);margin-top:4px">Starts in ${daysUntilStart}d · ${fmtDate(onStart)}</div>`;
      }

      html += `<div style="background:${isActive?c.color+"11":"var(--surface-2)"};border:1px solid ${isActive?c.color+"33":"var(--border-sub)"};border-radius:10px;padding:12px 14px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:13px;font-weight:600;color:${isActive?c.color:"var(--t2)"}">Cycle ${i+1} — ON</span>
          <span style="font-size:11px;color:${statusCol};font-weight:600">${status}</span>
        </div>
        <div style="display:flex;gap:16px;font-size:11px;color:var(--t3)">
          <span>${fmtDate(onStart)} → ${fmtDate(onEnd)}</span>
          <span style="color:var(--t4)">${onW}w on</span>
        </div>
        ${progressBar}
        <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border-sub);display:flex;justify-content:space-between;font-size:11px">
          <span style="color:var(--t4)">Off: ${fmtDate(offStart)} → ${fmtDate(offEnd)}</span>
          <span style="color:var(--t5)">${offW}w off</span>
        </div>
      </div>`;
      cur = addDays(cur, onDays + offDays);
    }

    // Stash check
    if (stashMgAvail !== null) {
      // Use the compound's actual configured dosesPerDay/doseAmounts when present — the
      // old heuristic (doses.length>=2 → assume 1/scheduleDays) had no way to know a
      // compound was genuinely dosed more than once per scheduled day.
      const cData = aps[name] || allPeptides()[name] || {};
      const occTimes = getOccurrenceTimes(cData);
      const lastAmt = doseToMg([...(cData.doses||[])].sort((a,b)=>new Date(b.date)-new Date(a.date))[0]?.dose||1.5, cfg(name)?.unit||"mg");
      const mgPerScheduledDay = occTimes.reduce((sum,_,i)=>{
        const amt = occurrenceDoseAmount(cData,i);
        return sum + doseToMg(amt||lastAmt, cfg(name)?.unit||"mg");
      }, 0) || lastAmt;
      const dosesPerDay = (cData.doses||[]).length >= 1 ? 1 / (allPeptides()[name]?.scheduleDays||7) : null;
      const mgPerCycle = dosesPerDay ? dosesPerDay * onDays * mgPerScheduledDay : null;
      if (mgPerCycle) {
        const cyclesCovered = Math.floor(stashMgAvail / mgPerCycle);
        html += `<div style="background:${cyclesCovered>=1?"#7DF9C011":"#ff7c7c11"};border:1px solid ${cyclesCovered>=1?"#7DF9C033":"#ff7c7c33"};border-radius:10px;padding:12px 14px;margin-top:4px">
          <div style="font-size:12px;font-weight:600;color:${cyclesCovered>=1?"#7DF9C0":"#ff7c7c"}">Stash: ~${stashMgAvail.toFixed(0)} mg on hand · covers ~${cyclesCovered} full cycle${cyclesCovered===1?"":"s"}</div>
        </div>`;
      }
    }
    html += `</div>`;
    m.querySelector("#cresult").innerHTML = html;
    m.querySelector("#cresult").style.display = "block";
  };
}

// Tap-to-expand: same chart function, rendered taller for closer inspection — no separate
// chart implementation to maintain, just a bigger canvas via the existing `expanded` param.

// Trends record explorer: read-only, evidence-first; no modifications to app state.



function nxEvidencePanel(title, status, headline, detail) {
  return `<section class="nx-pe-summary" aria-label="Evidence summary">
    <div class="nx-pe-summary-head"><strong>${esc(title)}</strong><span class="nx-pe-evidence">${esc(status)}</span></div>
    <p>${esc(headline)}</p><p class="nx-pe-muted">${esc(detail)}</p>
  </section>`;
}

function nxSymptomTimingExplorer() {
  const compounds=Object.entries(allPeptides()).filter(([,d])=>(d.doses||[]).some(x=>x.date));
  const m=openModal(`<div class="nx-pe-heading"><div><div class="nx-trends-eyebrow">Trends / Pattern Explorer</div>
    <h2>Symptom Timing</h2><p>Explore check-ins by elapsed day after a recorded dose, without interpreting drug levels or dose readiness.</p></div>
    <button type="button" id="nx-st-close" aria-label="Close Symptom Timing">×</button></div>
    <label class="field-label" for="nx-st-compound">Compound</label>
    <select class="inp" id="nx-st-compound">${compounds.length?compounds.map(([n])=>`<option value="${esc(n)}">${esc(n)}</option>`).join(''):'<option value="">No recorded doses</option>'}</select>
    <label class="field-label" for="nx-st-symptom">Symptom</label>
    <select class="inp" id="nx-st-symptom"></select>
    <label class="field-label" for="nx-st-window">Observation window</label>
    <select class="inp" id="nx-st-window"><option value="30">Last 30 days</option><option value="90" selected>Last 90 days</option><option value="180">Last 180 days</option><option value="all">All dates</option></select>
    <div id="nx-st-result" aria-live="polite"></div>
    <button type="button" class="btn-primary" id="nx-st-done" style="width:100%;margin-top:15px">Done</button>`);
  m.classList.add('nx-pe-modal');
  m.querySelector('#nx-st-close').onclick=closeModal;
  m.querySelector('#nx-st-done').onclick=closeModal;
  const symptoms=(state.dailyLogs||[]).flatMap(l=>Array.isArray(l.symptoms)?l.symptoms:[])
    .map(v=>typeof v==='string'?v:(v&&v.name)||'').filter(Boolean);
  const unique=[...new Set(symptoms)].sort((a,b)=>a.localeCompare(b));
  m.querySelector('#nx-st-symptom').innerHTML='<option value="">All recorded symptoms</option>'+unique.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
  const redraw=()=>{
    const name=m.querySelector('#nx-st-compound').value;
    const selected=m.querySelector('#nx-st-symptom').value;
    const window=m.querySelector('#nx-st-window').value;
    const cutoff=window==='all'?-Infinity:Date.now()-Number(window)*86400000;
    const doses=((allPeptides()[name]||{}).doses||[]).filter(d=>d.date&&Number.isFinite(safeDate(d.date).getTime()))
      .slice().sort((a,b)=>safeDate(a.date)-safeDate(b.date));
    const logs=(state.dailyLogs||[]).filter(l=>l.date&&Number.isFinite(safeDate(l.date).getTime()))
      .filter(l=>safeDate(l.date).getTime()>=cutoff);
    const bins=Array.from({length:15},(_,day)=>({day,checkins:new Set(),symptomDays:new Set(),reports:0,cycles:new Set()}));
    const details=[];
    logs.forEach(l=>{
      const when=safeDate(l.date).getTime();
      let idx=-1;
      for(let i=0;i<doses.length;i++){if(safeDate(doses[i].date).getTime()<=when)idx=i;else break;}
      if(idx<0)return;
      const delta=(when-safeDate(doses[idx].date).getTime())/86400000;
      const day=Math.floor(delta);
      if(day<0||day>14)return;
      const bin=bins[day], key=dayKey(l.date), syms=(l.symptoms||[])
        .map(v=>typeof v==='string'?v:(v&&v.name)||'').filter(Boolean);
      const matched=selected?syms.filter(s=>s===selected):syms;
      bin.checkins.add(key);bin.cycles.add(idx);
      if(matched.length){bin.symptomDays.add(key);bin.reports+=matched.length;}
      details.push({date:l.date,day,cycle:idx,matched,checkin:true});
    });
    const days=bins.reduce((n,b)=>n+b.checkins.size,0);
    const cycles=new Set(bins.flatMap(b=>[...b.cycles])).size;
    const supported=cycles>=3&&days>=6;
    const result=m.querySelector('#nx-st-result');
    const visible=bins.filter(b=>b.checkins.size);
    const max=Math.max(1,...visible.map(b=>b.symptomDays.size/b.checkins.size));
    const timingStatus=!doses.length?'No dose records':!days?'No matching check-ins':!supported?'Limited records':'Descriptive timing';
    const timingHeadline=!doses.length?'No dated doses are available for this compound.'
      :!days?'No check-ins could be assigned to the 14 days after a recorded dose in this window.'
      :!supported?`Found ${days} check-in-day positions across ${cycles} recorded dose cycles. The timing chart needs at least 6 check-in-day positions and 3 observed cycles.`
      :`Found ${days} check-in-day positions across ${cycles} observed dose cycles. Explore the chart below to see which elapsed days have recorded symptoms.`;
    const timingSummary=nxEvidencePanel('What the records show',timingStatus,timingHeadline,
      'Timing is relative to logged doses. It does not measure blood concentrations or show when a compound is wearing off.');
    result.innerHTML=timingSummary+`<div class="nx-pe-eyebrow">Observation coverage</div><div class="nx-pe-caution">Days are measured from the last logged dose. A check-in without a symptom is not proof that no symptom occurred. Records may overlap with other compounds. No pharmacological trough or dosing guidance is inferred.</div>
      <div class="nx-pe-stats"><div><small>Check-in days</small><strong>${days}</strong><small>days assigned to a dose interval</small></div>
      <div><small>Observed dose cycles</small><strong>${cycles}</strong><small>distinct preceding dose entries</small></div></div>
      ${supported&&visible.length?`<div class="nx-pe-eyebrow">Timing by elapsed day</div><div class="nx-st-chart" role="img" aria-label="Observed symptom days by elapsed day after dose.">${visible.map(b=>{
        const rate=b.symptomDays.size/b.checkins.size;
        return `<div class="nx-st-bar"><span>${b.symptomDays.size}/${b.checkins.size}</span><div class="nx-st-track"><div style="height:${Math.max(2,Math.round(rate/max*100))}%;background:var(--accent,#A78BFA)"></div></div><small>D${b.day}</small></div>`;
      }).join('')}</div><div class="nx-chart-note">Labels show symptom-report days / check-in days. Bars describe the recorded proportion for each elapsed day, not the probability of a symptom.</div>`:''}
      <details class="nx-pe-records"><summary>Inspect underlying check-ins <span>${details.length} entries · latest 60 shown</span></summary>
      ${details.length?`<div class="nx-detail-rows">${details.sort((a,b)=>safeDate(b.date)-safeDate(a.date)).slice(0,60).map(d=>`<div class="nx-detail-row"><time>${esc(fmtDate(d.date))}</time><div><b>Day ${d.day} after dose</b><small>${d.matched.length?esc(d.matched.join(', ')):'No matching symptom recorded'}</small></div></div>`).join('')}</div>`:'<div class="nx-chart-empty">No dated check-ins fall within 14 days after a logged dose.</div>'}
      </details><div class="nx-pe-disclaimer">Missing check-ins are excluded, not treated as symptom-free days. Incomplete logging and overlapping compounds may distort patterns.</div>`;
  };
  ['#nx-st-compound','#nx-st-symptom','#nx-st-window'].forEach(id=>m.querySelector(id).onchange=redraw);
  redraw();
}

function nxPatternExplorer() {
  const suppLogs=(state.supplementLogs||[]).filter(l=>l.date&&Array.isArray(l.taken));
  const daily=(state.dailyLogs||[]).filter(l=>l.date);
  const names=[...new Set(suppLogs.flatMap(l=>l.taken.map(String)))].sort();
  const m=openModal(`<div class="nx-pe-heading"><div><div class="nx-trends-eyebrow">Trends / Explorations</div><h2>Pattern Explorer</h2>
    <p>Compare logged supplement use with recorded symptom reports. This is descriptive, not causal.</p></div>
    <button id="nx-pe-close" type="button" aria-label="Close Pattern Explorer">×</button></div>
    <label class="field-label" for="nx-pe-supp">Supplement</label>
    <select id="nx-pe-supp" class="inp">${names.length?names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join(""):'<option value="">No supplements recorded</option>'}</select>
    <label class="field-label" for="nx-pe-window">Observation window</label>
    <select id="nx-pe-window" class="inp"><option value="30">Last 30 days</option><option value="90" selected>Last 90 days</option><option value="180">Last 180 days</option><option value="all">All recorded dates</option></select>
    <div id="nx-pe-results" aria-live="polite"></div>
    <button type="button" class="btn-primary" id="nx-pe-done" style="width:100%;margin-top:14px">Done</button>`);
  m.classList.add('nx-pe-modal');
  m.querySelector('#nx-pe-close').onclick=closeModal;
  m.querySelector('#nx-pe-done').onclick=closeModal;
  const redraw=()=>{
    const selected=m.querySelector('#nx-pe-supp').value,range=m.querySelector('#nx-pe-window').value;
    const start=range==='all'?-Infinity:Date.now()-Number(range)*86400000;
    // Only compare days where a supplement check-in exists. Missing logs are unknown, not "not taken".
    const days=new Map();
    suppLogs.forEach(l=>{
      const dt=safeDate(l.date).getTime();if(!Number.isFinite(dt)||dt<start)return;
      const k=dayKey(l.date);
      if(!days.has(k))days.set(k,{date:l.date,taken:new Set(),reports:[],logged:true});
      l.taken.forEach(n=>days.get(k).taken.add(String(n)));
    });
    daily.forEach(l=>{
      const k=dayKey(l.date),d=days.get(k);if(!d)return;
      (l.symptoms||[]).forEach(sym=>d.reports.push(typeof sym==='string'?sym:String(sym?.name||'Unspecified')));
    });
    const rows=[...days.values()].sort((a,b)=>safeDate(b.date)-safeDate(a.date));
    const withRows=rows.filter(d=>d.taken.has(selected)),withoutRows=rows.filter(d=>!d.taken.has(selected));
    const count=arr=>arr.reduce((n,d)=>n+d.reports.length,0);
    const overlap=rows.length, sufficient=withRows.length>=5&&withoutRows.length>=5;
    const el=m.querySelector('#nx-pe-results');
    const status=!selected?'No selection':!overlap?'No overlapping records':!sufficient?'Limited records':'Descriptive comparison';
    const headline=!selected?'Select a supplement to inspect its check-ins.'
      :!overlap?'No explicit supplement check-ins were recorded during this period.'
      :!sufficient?`There are ${withRows.length} marked-taken days and ${withoutRows.length} not-marked-taken days. Both groups need at least five recorded check-in days for a numerical comparison.`
      :`Across recorded check-ins, there were ${(count(withRows)/withRows.length).toFixed(2)} symptom reports per day when marked taken and ${(count(withoutRows)/withoutRows.length).toFixed(2)} when not marked taken.`;
    const summary=nxEvidencePanel('What the records show',status,headline,
      'These groups are based on supplement check-ins only. Differences can reflect incomplete logging, other compounds, or unrelated changes.');
    el.innerHTML=summary+`<div class="nx-pe-eyebrow">Record coverage</div><div class="nx-pe-caution">A missing supplement entry is not treated as a day without supplementation. Only days with an explicit supplement check-in are included. Symptoms may be incompletely logged, and other factors can explain differences.</div>
      <div class="nx-pe-stats">
        <div><small>Supplement logged</small><strong>${withRows.length}</strong><small>check-in days · ${count(withRows)} symptom reports</small></div>
        <div><small>Not marked taken</small><strong>${withoutRows.length}</strong><small>check-in days · ${count(withoutRows)} symptom reports</small></div>
      </div>
      <details class="nx-pe-records"><summary>Inspect recorded check-in days <span>${overlap} total · latest 60 shown</span></summary>
      ${rows.length?`<div class="nx-detail-rows">${rows.slice(0,60).map(d=>`<div class="nx-detail-row"><time>${esc(fmtDate(d.date))}</time><div><b>${d.taken.has(selected)?'Marked taken':'Not marked taken'}</b><small>${d.reports.length?`${d.reports.length} recorded symptom report${d.reports.length===1?'':'s'}: ${esc(d.reports.join(', '))}`:'No symptoms recorded in matching daily logs'}</small></div></div>`).join('')}</div>`:'<div class="nx-chart-empty">No overlapping supplement check-in dates for this window.</div>'}
      </details><div class="nx-pe-disclaimer">Descriptive records only · Not a correlation test, a treatment effect, or evidence of causation.</div>`;
  };
  m.querySelector('#nx-pe-supp').onchange=redraw;
  m.querySelector('#nx-pe-window').onchange=redraw;
  redraw();
}

// Resolve individual ingredient estimates using only immutable vial composition or
// a USER-CONFIRMED historical recipe with a bounded date range. Never rewrite doses.
// Historical attribution windows use local calendar dates (00:00–23:59).
// safeDate(date-only) intentionally uses noon for displays and must NOT be used
// as the starting instant for matching an entire date of recorded injections.
function nxBlendHistoryCalendarDay(value){
  const d=safeDate(value);
  if(!d||!Number.isFinite(d.getTime()))return "";
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function nxBlendDoseAttribution(name,dose) {
  const kits=(state.supplies||[]).filter(k=>k.isBlend&&k.name===name);
  if(!kits.length)return null;
  const allocations=Array.isArray(dose.allocations)?dose.allocations:[];
  const segments=[];
  for(const a of allocations){
    const k=kits.find(x=>String(x.id)===String(a.kitId));
    const vial=k?.vials?.find(x=>String(x.id)===String(a.vialId));
    const composition=vial?.composition;
    if(!k)return null;
    const amount=doseToMg(a.amount,cfg(name).unit);
    if(Array.isArray(composition)&&composition.length>=2){
      segments.push({composition,amount,source:"vial snapshot"});
    }else if(allocations.length===1){
      const day=nxBlendHistoryCalendarDay(dose.date);
      const approved=(k.blendHistoryAttributions||[]).filter(x=>x.status==="confirmed"&&
        day!==""&&day>=x.from&&day<=x.to);
      if(approved.length!==1)return null;
      segments.push({composition:approved[0].composition,amount,source:"user-confirmed historical recipe"});
    }else return null;
  }
  if(!segments.length){
    // No unique physical source: allow interpretation only when exactly one approved
    // historical attribution covers this date for this named blend.
    const day=nxBlendHistoryCalendarDay(dose.date);
    const matches=kits.flatMap(k=>(k.blendHistoryAttributions||[])
      .filter(a=>a.status==="confirmed"&&day!==""&&day>=a.from&&day<=a.to)
      .map(a=>({composition:a.composition,amount:doseToMg(dose.dose,cfg(name).unit),source:"user-confirmed historical recipe"})));
    if(matches.length!==1)return null;
    segments.push(matches[0]);
  }
  const amounts=new Map();
  for(const s of segments){
    const total=s.composition.reduce((n,x)=>n+Number(x.mg||0),0);
    if(!Number.isFinite(s.amount)||s.amount<=0||total<=0)return null;
    for(const x of s.composition){
      if(!x.compound||!(Number(x.mg)>0))return null;
      amounts.set(x.compound,(amounts.get(x.compound)||0)+s.amount*Number(x.mg)/total);
    }
  }
  return {items:[...amounts].map(([name,mg])=>({name,mg})),
    provenance:segments.some(s=>s.source==="user-confirmed historical recipe")?"User-confirmed historical recipe":"Saved vial recipe"};
}

// Historical reconciliation creates an interpretation overlay only, not an
// inventory event. User must confirm source kit and exact time window.
function nxReconcileBlendHistory(name,onDone) {
  const kits=(state.supplies||[]).filter(k=>k.isBlend&&k.name===name);
  const m=openModal('<h2 style="margin:0 0 12px;font-size:19px">Reconcile earlier blend records</h2>'+
    '<p style="font-size:13px;line-height:1.5;color:var(--t3)">If this exact formulation was already in use before it was recorded as a blend, confirm which dated records used it. This adds a labelled interpretation without changing dose records or inventory.</p>'+
    '<label class="field-label" for="nx-reconcile-kit">SOURCE KIT</label>'+
    '<select class="inp" id="nx-reconcile-kit" style="width:100%;margin-bottom:12px">'+kits.map(k=>'<option value="'+esc(String(k.id))+'">'+esc(k.name)+' · '+esc(String(k.vialMg))+' mg/vial</option>').join('')+'</select>'+
    '<details class="nx-reconcile-date-options" style="margin-bottom:12px"><summary style="min-height:44px;padding:10px 0;color:var(--t2)">Refine historical date range (optional)</summary>'+
    '<label class="field-label" for="nx-reconcile-from">FIRST DATE INCLUDED</label><input class="inp" type="date" id="nx-reconcile-from" style="width:100%;margin-bottom:12px">'+
    '<label class="field-label" for="nx-reconcile-to">LAST DATE INCLUDED</label><input class="inp" type="date" id="nx-reconcile-to" style="width:100%;margin-bottom:12px"></details>'+
    '<div id="nx-reconcile-preview" role="status" style="font-size:12px;color:var(--t2);padding:12px;background:var(--surface-2);border-radius:10px;margin-bottom:12px">Select dates to preview the records.</div>'+
    '<div style="display:flex;gap:8px"><button id="nx-reconcile-cancel" style="flex:1;min-height:48px">Cancel</button>'+
    '<button class="btn-primary" id="nx-reconcile-save" style="flex:1;min-height:48px">Review attribution</button></div>');
  m.querySelector("#nx-reconcile-cancel").onclick=closeModal;
  const kitSelect=m.querySelector("#nx-reconcile-kit"),from=m.querySelector("#nx-reconcile-from"),to=m.querySelector("#nx-reconcile-to");
  const original=(allPeptides()[name]?.doses||[]).filter(d=>d.date);
  const candidateDates=original.filter(d=>!nxBlendDoseAttribution(name,d))
    .map(d=>nxBlendHistoryCalendarDay(d.date)).filter(Boolean).sort();
  if(candidateDates.length){from.value=candidateDates[0];to.value=candidateDates[candidateDates.length-1];}
  const refresh=()=>{
    const k=kits.find(x=>String(x.id)===kitSelect.value);
    const rows=original.filter(d=>{
      const day=nxBlendHistoryCalendarDay(d.date);
      if(day===""||!from.value||!to.value||day<from.value||day>to.value)return false;
      // Only legacy unlinked doses or one explicitly matching physical kit are
      // eligible. A recorded allocation to another kit is never silently remapped.
      const allocations=Array.isArray(d.allocations)?d.allocations:[];
      return !allocations.length||(allocations.length===1&&
        String(allocations[0].kitId)===String(k?.id));
    });
    m.querySelector("#nx-reconcile-preview").textContent=k&&from.value&&to.value?
      rows.length+' recorded doses in period · '+(k.composition||[]).map(x=>x.compound+' '+x.mg+' mg').join(' · ')+
      '. This recipe will be labelled user-confirmed, not independently verified.':'Select dates to preview the records.';
    return rows;
  };
  [kitSelect,from,to].forEach(x=>x.onchange=refresh);
  refresh();
  m.querySelector("#nx-reconcile-save").onclick=()=>{
    const k=kits.find(x=>String(x.id)===kitSelect.value),rows=refresh();
    const components=k?.composition||[],sum=components.reduce((n,x)=>n+Number(x.mg||0),0);
    if(!k||!from.value||!to.value||from.value>to.value||!rows.length||components.length<2||
       components.some(x=>!x.compound||!(Number(x.mg)>0))||Math.abs(sum-Number(k.vialMg))>.01){
      showErrorBanner("Choose a valid kit, formulation and date range with recorded doses.");return;
    }
    const other=kits.flatMap(x=>(x.blendHistoryAttributions||[]).filter(a=>a.status==="confirmed"&&!(to.value<a.from||from.value>a.to)));
    if(other.length){showErrorBanner("This period overlaps a previous confirmed attribution. Review existing history before proceeding.");return;}
    const overlay={id:uid(),status:"confirmed",from:from.value,to:to.value,
      composition:components.map(x=>({compound:x.compound,mg:Number(x.mg)})),
      confirmedAt:localDatetime(),source:"user confirmation"};
    closeModal();
    confirmAction("Apply the displayed recipe to "+rows.length+" older blend record(s) between "+from.value+" and "+to.value+"? Original doses, physical inventory and vial history will not change.",()=>{
      const live=(state.supplies||[]).find(x=>String(x.id)===String(k.id));
      if(!live||!live.isBlend)return;
      live.blendHistoryAttributions=live.blendHistoryAttributions||[];
      if(live.blendHistoryAttributions.some(a=>a.status==="confirmed"&&!(overlay.to<a.from||overlay.from>a.to))){
        showErrorBanner("A confirmation for this period already exists. Nothing was changed.");return;
      }
      live.blendHistoryAttributions.push(overlay);
      saveState();if(typeof onDone==="function")onDone();
    },{tone:"primary",confirmLabel:"Confirm historical recipe",cancelLabel:"Keep unchanged"});
  };
}

// Read-only ingredient history, with direct administrations clearly distinguished
// from calculated blend contributions. One blend injection is never duplicated.
function nxIngredientHistoryDetail(ingredient, returnBlend) {
  const direct=allPeptides()[ingredient]?.doses||[];
  const blendRows=[];
  const seenBlendNames=new Set();
  for(const kit of state.supplies||[]){
    if(!kit.isBlend || !(kit.composition||[]).some(x=>x.compound===ingredient))continue;
    if(seenBlendNames.has(kit.name))continue;
    seenBlendNames.add(kit.name);
    const blend=allPeptides()[kit.name];
    if(!blend)continue;
    for(const d of blend.doses||[]){
      const attribution=nxBlendDoseAttribution(kit.name,d);
      const item=attribution?.items?.find(x=>x.name===ingredient);
      if(item)blendRows.push({date:d.date,mg:item.mg,source:kit.name,provenance:attribution.provenance});
    }
  }
  const rows=[...direct.map(d=>({date:d.date,mg:doseToMg(d.dose,cfg(ingredient).unit||"mg"),source:"Direct",provenance:"Recorded dose"})),...blendRows]
    .filter(x=>x.date).sort((a,b)=>safeDate(b.date)-safeDate(a.date));
  const detail=openModal('<div class="nx-detail-head"><div><div class="nx-trends-eyebrow">Ingredient history</div><h2>'+esc(ingredient)+'</h2><p>Direct doses and estimated blend contributions are distinct.</p></div>'+
    '<button id="nx-ingredient-close" aria-label="Close ingredient history">✕</button></div>'+
    '<div class="nx-detail-counts"><div><span>Direct records</span><strong>'+direct.length+'</strong></div>'+
    '<div><span>Blend contributions</span><strong>'+blendRows.length+'</strong></div></div>'+
    '<div class="nx-detail-subtitle">Recorded history</div><div class="nx-detail-rows">'+
    (rows.length?rows.slice(0,100).map(x=>'<div class="nx-detail-row"><time>'+esc(fmtDate(x.date))+'</time><div><b>'+esc(x.mg.toFixed(3))+' mg</b><small>'+esc(x.source==="Direct"?"Direct":"From blend · "+x.source)+'</small></div></div>').join(''):'<p class="nx-chart-empty">No attributable records yet.</p>')+
    '</div><div style="display:flex;gap:10px;margin-top:14px"><button id="nx-ingredient-back" style="flex:1;min-height:48px">Back to blend</button><button id="nx-ingredient-intel" class="btn-primary" style="flex:1;min-height:48px">Compound Intel ›</button></div>');
  detail.classList.add("nx-trends-detail-modal");
  detail.querySelector("#nx-ingredient-close").onclick=closeModal;
  detail.querySelector("#nx-ingredient-back").onclick=()=>{closeModal();if(returnBlend)nxTrendsDetail(returnBlend,"dose");else{state._nxHistorySelected=null;tab="trends";render();window.scrollTo(0,0);}};
  detail.querySelector("#nx-ingredient-intel").onclick=()=>{
    closeModal();state._intelReturn={tab:"trends"};state._compoundIntel=ingredient;tab="trends";render();window.scrollTo(0,0);
  };
}
function nxTrendsDetail(name, kind="dose") {
  const compound=allPeptides()[name]; if(!compound)return;
  const c=cfg(name), all=(compound.doses||[]).filter(d=>d.date&&Number.isFinite(safeDate(d.date).getTime()))
    .slice().sort((a,b)=>safeDate(b.date)-safeDate(a.date));
  const now=Date.now();
  const isBlend=kind==="dose"&&(state.supplies||[]).some(k=>k.isBlend&&k.name===name);
  const confirmedHistory=isBlend?(state.supplies||[]).filter(k=>k.isBlend&&k.name===name)
    .flatMap(k=>(k.blendHistoryAttributions||[]).filter(a=>a.status==="confirmed").map(a=>({kit:k,entry:a}))):[];
  const m=openModal(`<div class="nx-detail-head">
    <div><div class="nx-trends-eyebrow">Recorded evidence</div>
    <h2>${esc(name)}</h2><p>${kind==="symptom"?"Symptom reports":"Dose history"} · Exact entries and period comparison</p></div>
    <button id="nx-detail-close" aria-label="Close chart details">✕</button></div>
    <div class="nx-detail-filter" role="group" aria-label="Select observation period">
    ${[["30","30 days"],["90","90 days"],["180","180 days"],["all","All"]].map(([v,l])=>`<button type="button" data-range="${v}" aria-pressed="${v==="90"}">${l}</button>`).join("")}</div>
    <div id="nx-detail-body" aria-live="polite"></div>
    ${isBlend&&confirmedHistory.length?'<button type="button" id="nx-blend-review-attributions" style="width:100%;min-height:48px;margin-top:10px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);color:var(--t1)">Review '+confirmedHistory.length+' confirmed historical attribution(s)</button>':''}
        ${isBlend?'<button type="button" id="nx-blend-reconcile" style="width:100%;margin-top:12px;min-height:48px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);color:var(--t1)">Review historical blend attribution</button>':''}
    <button id="nx-detail-done" class="btn-primary" style="width:100%;margin-top:14px">Done</button>
  `,c.color||"#A78BFA");
  m.classList.add("nx-trends-detail-modal");
  m.querySelector("#nx-detail-close").onclick=closeModal;
  m.querySelector("#nx-detail-done").onclick=closeModal;
  let range="90", selectedDoseId=null;
  const getStart=(days)=>days==="all"?-Infinity:now-Number(days)*86400000;
  const inRange=(d,low,high)=>{const t=safeDate(d.date).getTime();return t>=low&&t<high;};
  const symName=s=>typeof s==="string"?s:(s&&s.name)||"Unspecified";
  const observed=(low,high)=>{
    const logs=(state.dailyLogs||[]).filter(l=>l.compound===name&&l.date&&inRange(l,low,high));
    const doses=all.filter(d=>inRange(d,low,high));
    const reports=[...logs.flatMap(l=>(l.symptoms||[]).map(s=>({date:l.date,name:symName(s)}))),
      ...doses.flatMap(d=>(d.symptoms||[]).map(s=>({date:d.date,name:symName(s)})))];
    const days=new Set([...logs,...doses].map(x=>dayKey(x.date)));
    return {logs,doses,reports,days:days.size};
  };
  const show=()=>{
    m.querySelectorAll("[data-range]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.range===range)));
    const start=getStart(range), width=range==="all"?null:Number(range)*86400000;
    const current=observed(start,now+86400000);
    const previous=width===null?null:observed(start-width,start);
    const count=(x)=>kind==="dose"?x.doses.length:x.reports.length;
    const n=count(current), p=previous?count(previous):null;
    const label=kind==="dose"?"doses":"symptom reports";
    const rows=kind==="dose"?current.doses.map(d=>({date:d.date,detail:`${d.dose} ${c.unit||""}`,note:d.site?`Site: ${d.site}`:"Recorded dose"}))
      :current.reports.map(r=>({date:r.date,detail:r.name,note:"Recorded symptom report"})).sort((a,b)=>safeDate(b.date)-safeDate(a.date));
    const safeRows=rows.slice(0,80);
    // Summarize only saved administered records within the selected period.
    // Unknown historic recipes stay un-attributed; never add them to component totals.
    const periodIngredientTotals=new Map();
    let attributedInjections=0,periodBlendMg=0;
    if(isBlend)for(const d of current.doses){
      const mg=doseToMg(d.dose,c.unit||"mg");
      if(Number.isFinite(mg)&&mg>0)periodBlendMg+=mg;
      const parts=nxBlendDoseAttribution(name,d);
      if(!parts)continue;
      attributedInjections++;
      for(const item of parts.items)
        periodIngredientTotals.set(item.name,(periodIngredientTotals.get(item.name)||0)+item.mg);
    }
    const periodCoverage=attributedInjections===current.doses.length?"All injections attributed":
      attributedInjections+" of "+current.doses.length+" injections attributed";
    const blendPeriodSummary=isBlend?'<section class="nx-blend-period-summary" style="margin:12px 0 18px;padding:14px;border:1px solid var(--border-sub);border-radius:14px;background:var(--surface-2)">'+
      '<div style="font-size:16px;font-weight:750;color:var(--t1);margin-bottom:8px">Period summary</div>'+
      '<div style="display:flex;justify-content:space-between;gap:8px"><span>Recorded blend doses</span><strong>'+periodBlendMg.toFixed(3)+' mg</strong></div>'+
      '<div style="font-size:11px;color:var(--t3);margin:8px 0">'+esc(periodCoverage)+'</div>'+
      [...periodIngredientTotals].map(([ingredient,mg])=>'<div style="display:flex;justify-content:space-between;gap:12px;padding:5px 0"><span>'+esc(ingredient)+'</span><strong>'+mg.toFixed(3)+' mg</strong></div>').join('')+
      (attributedInjections<current.doses.length?'<div style="font-size:11px;color:var(--t3);margin-top:9px">Ingredient totals are partial because some older doses lack a confirmed recipe.</div>':'')+
      '</section>':'';
    m.querySelector("#nx-detail-body").innerHTML=`
      <div class="nx-detail-counts">
        <div><span>Selected period</span><strong>${n}</strong><small>${label}</small></div>
        <div><span>Previous equal period</span><strong>${p===null?"—":p}</strong><small>${p===null?"All-time view":label}</small></div>
        <div><span>Observed days</span><strong>${current.days}</strong><small>days with dose or check-in records</small></div>
      </div>
      <div class="nx-detail-caution">Comparisons are counts of records, not normalized rates. Missing entries and differences in logging frequency can affect comparisons. A symptom report does not establish causation.</div>
      ${isBlend?`<div class="nx-detail-subtitle" style="font-size:17px">Recorded dose trend</div>
      ${current.doses.length>1?escalationChart(current.doses,c):'<div class="nx-chart-empty">Add more dated injections to see the trend.</div>'}
      ${blendPeriodSummary}
      <div class="nx-detail-subtitle" style="font-size:17px">Select an injection <span>${rows.length} records</span></div>
      <div id="nx-blend-date-list" class="nx-blend-date-list">${current.doses.slice(0,80).map(d=>
        '<button type="button" class="nx-blend-dose-pick" data-dose-id="'+esc(String(d.id))+'" style="width:100%;min-height:52px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 4px;border:0;border-bottom:1px solid var(--border-sub);background:transparent;color:var(--t1);text-align:left"><span>'+esc(fmtDate(d.date))+'</span><span style="display:flex;align-items:center;gap:12px"><strong>'+esc(String(d.dose))+' '+esc(c.unit||'mg')+'</strong><span aria-hidden="true">›</span></span></button>').join('')}</div>
      <div id="nx-blend-selected-dose" aria-live="polite" hidden></div>
      <div class="nx-detail-caution" style="margin-top:12px">Ingredient amounts are mathematical estimates from recorded recipes, not laboratory measurements or dosing recommendations.</div>`
      :`<div class="nx-detail-subtitle">Exact recorded entries <span>${rows.length}${rows.length>80?" · first 80 shown":""}</span></div>
      ${safeRows.length?`<div class="nx-detail-rows">${safeRows.map(r=>`<div class="nx-detail-row">
        <time>${esc(fmtDate(r.date))}</time><div><b>${esc(r.detail)}</b><small>${esc(r.note)}</small></div>
      </div>`).join("")}</div>`:`<div class="nx-chart-empty">No ${label} in this period.</div>`}
      ${kind==="dose"&&current.doses.length>1?`<div class="nx-detail-subtitle">Recorded dose timeline</div>${escalationChart(current.doses,c)}`:""}`}
      <div class="nx-chart-note">All values are from saved records. This view does not calculate treatment effects, safety, or dosing readiness.</div>`;
    if(isBlend){
      if(!current.doses.some(d=>String(d.id)===String(selectedDoseId)))selectedDoseId=current.doses[0]?.id||null;
      const selected=m.querySelector("#nx-blend-selected-dose");
      const paint=()=>{
        const d=current.doses.find(x=>String(x.id)===String(selectedDoseId));
        m.querySelector("#nx-blend-date-list").hidden=true;
        m.querySelector("#nx-blend-date-list").style.display="none";
        selected.hidden=false;selected.style.display="block";
        if(!d){selected.innerHTML='<div class="nx-chart-empty">No injections in this period.</div>';return;}
        const attributed=nxBlendDoseAttribution(name,d);
        selected.innerHTML='<button type="button" id="nx-blend-date-back" style="min-height:48px;background:transparent;border:0;color:var(--t1);text-align:left">‹ All injection dates</button><section class="nx-blend-injection-detail" style="border:1px solid var(--border);border-radius:14px;background:var(--surface-2);padding:16px">'+
          '<div style="font-size:12px;color:var(--t3)">Selected injection · '+esc(fmtDate(d.date))+'</div>'+
          '<h3 style="margin:7px 0 14px;font-size:22px;color:var(--t1)">'+esc(String(d.dose))+' '+esc(c.unit||'mg')+'</h3>'+
          (attributed?'<div style="font-size:13px;font-weight:700;margin-bottom:8px">Estimated ingredient amounts</div>'+
            attributed.items.map(x=>'<button type="button" class="nx-blend-ingredient-link" data-ingredient="'+esc(x.name)+'" style="display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;min-height:48px;padding:8px 0;border:0;border-bottom:1px solid var(--border-sub);background:transparent;color:var(--t1);text-align:left"><span>'+esc(x.name)+'</span><strong>'+x.mg.toFixed(3)+' mg ›</strong></button>').join('')+
            '<p style="font-size:11px;color:var(--t3);line-height:1.45">Source: '+esc(attributed.provenance)+'</p>'
          :'<p style="font-size:12px;line-height:1.5;color:var(--t3)">Ingredient amounts are not yet attributed to this historical injection. Its original dose remains intact.</p>')+'</section>';
        selected.querySelector("#nx-blend-date-back")?.addEventListener("click",()=>{
          selected.hidden=true;selected.style.display="none";selected.innerHTML="";
          m.querySelector("#nx-blend-date-list").hidden=false;
          m.querySelector("#nx-blend-date-list").style.display="";
        });
        selected.querySelectorAll(".nx-blend-ingredient-link").forEach(button=>button.onclick=()=>{
          const ingredient=button.dataset.ingredient;closeModal();
          nxIngredientHistoryDetail(ingredient,name);
        });
      };
      m.querySelectorAll(".nx-blend-dose-pick").forEach(b=>b.onclick=()=>{selectedDoseId=b.dataset.doseId;paint();});
      selected.hidden=true;selected.style.display="none";
      const review=m.querySelector("#nx-blend-review-attributions");
      if(review)review.onclick=()=>{
        const items=confirmedHistory.map(({kit,entry},i)=>'<label style="display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-sub)"><input type="radio" name="nx-revoke-choice" value="'+i+'"><span>'+esc(entry.from)+' — '+esc(entry.to)+' · '+esc(kit.name)+'<small style="display:block;color:var(--t3)">Confirmed '+esc(entry.confirmedAt||'unknown date')+'</small></span></label>').join('');
        const audit=openModal('<h2 style="font-size:18px;margin-bottom:12px">Historical attribution records</h2><p style="font-size:12px;color:var(--t3)">Reversing an attribution only removes its interpretation from Trends; original doses and vial inventory are preserved.</p>'+items+'<div style="display:flex;gap:8px;margin-top:14px"><button id="nx-audit-close" style="flex:1;min-height:48px">Cancel</button><button id="nx-audit-reverse" class="btn-primary" style="flex:1;min-height:48px">Review reversal</button></div>');
        audit.querySelector('#nx-audit-close').onclick=closeModal;
        audit.querySelector('#nx-audit-reverse').onclick=()=>{
          const index=Number(audit.querySelector('input[name="nx-revoke-choice"]:checked')?.value);
          if(!Number.isInteger(index)||index<0||index>=confirmedHistory.length){showErrorBanner("Choose a historical attribution to reverse.");return;}
          const {kit,entry}=confirmedHistory[index];closeModal();
          confirmAction("Reverse the selected historical attribution? This will not change any saved dose or physical inventory record.",()=>{
            const live=(state.supplies||[]).find(k=>String(k.id)===String(kit.id));
            const existing=live?.blendHistoryAttributions?.find(a=>String(a.id)===String(entry.id));
            if(!existing||existing.status!=="confirmed")return;
            existing.status="reversed";existing.reversedAt=localDatetime();
            saveState();closeModal();nxTrendsDetail(name,"dose");
          },{tone:"warning",confirmLabel:"Reverse interpretation",cancelLabel:"Keep attribution"});
        };
      };
      const reconcile=m.querySelector("#nx-blend-reconcile");
      if(reconcile)reconcile.onclick=()=>nxReconcileBlendHistory(name,()=>{closeModal();nxTrendsDetail(name,"dose");});
    }
  };
  m.querySelectorAll("[data-range]").forEach(b=>b.onclick=()=>{range=b.dataset.range;show();});
  show();
}

function chartDetailModal(kind, period) {
  let title, color, body;
  if (kind==="weight") {
    title="WEIGHT TREND"; color="#8AB4FF";
    body = weightChart(state.weightLogs, state.settings.weightUnit, period||"all", true);
  } else if (kind==="measure") {
    title="BODY MEASUREMENTS"; color="#C9A0FF";
    const cutoffDays={"1M":30,"3M":90,"6M":180}[period];
    const measurements=cutoffDays?state.measurementLogs.filter(x=>x.date&&new Date(x.date).getTime()>=Date.now()-cutoffDays*86400000):state.measurementLogs;
    body = measureChart(measurements, state.settings.measureUnit, true);
  } else return;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:12px;color:${color};letter-spacing:1.5px">${title}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${body}
  `, color);
  m.querySelector("#x").onclick = closeModal;
}

// Finish Vial — closes out just the CURRENTLY ACTIVE vial within a kit, distinct from
// Finish Kit (which retires the whole batch including any sealed backups). Vial
// lifecycle status (finished/active) is kept separate from what happened to the leftover
// mg — "finished" never itself implies "administered." The calculated remaining amount
// only becomes a logged dose if the user explicitly says so.
function finishVialModal(supplyId) {
  const s = state.supplies.find(x=>x.id===supplyId); if(!s) return;
  const c = cfg(s.name);
  const vial = getActiveVial(s);
  const remainingMg = vial ? getVialRemainingMg(s, vial) : getKitRemainingMg(s);
  const REASONS = [
    { key:"used_in_dose", label:"Used in current dose", desc:"The leftover was drawn into a syringe as part of a dose you're logging now." },
    { key:"discarded", label:"Discarded / unusable / spilled", desc:"Logged as outflow so your supply totals stay accurate." },
    { key:"discrepancy", label:"Vial was actually empty / inventory discrepancy", desc:"The calculated amount wasn't real — nothing to log as lost, the number was just off." },
    { key:"other", label:"Other", desc:"" },
  ];
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#F9C87D;letter-spacing:1.5px">FINISH VIAL — ${esc(s.name).toUpperCase()}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="background:var(--surface-2);border:1px solid var(--border-sub);border-radius:10px;padding:12px 14px;margin-bottom:16px">
      <div style="font-size:11px;color:var(--t4);margin-bottom:2px">CURRENT CALCULATED REMAINING</div>
      <div style="font-size:18px;font-weight:700;color:var(--t1)">${remainingMg.toFixed(1)} ${c.unit}</div>
      ${vial?.reconDate?`<div style="font-size:10px;color:var(--t5);margin-top:2px">Reconstituted ${fmtDate(vial.reconDate)}</div>`:""}
    </div>
    <label class="field-label">WHAT HAPPENED TO THE REMAINING AMOUNT?</label>
    <div style="margin-top:8px;margin-bottom:14px">
      ${REASONS.map((r,i)=>`<button class="finish-reason-opt" data-key="${r.key}" style="display:block;width:100%;text-align:left;padding:11px 12px;border-radius:9px;background:${i===0?"var(--surface-3)":"transparent"};border:1px solid ${i===0?"var(--border)":"transparent"};margin-bottom:4px">
        <div style="font-size:13px;color:${i===0?"var(--t1)":"var(--t3)"};font-weight:600">${r.label}</div>
        ${r.desc?`<div style="font-size:10.5px;color:var(--t5);margin-top:1px">${r.desc}</div>`:""}
      </button>`).join("")}
    </div>
    <div id="finish-other-field" style="display:none;margin-bottom:14px">
      <label class="field-label">REASON</label>
      <input id="finish-other-text" class="inp" placeholder="What happened?">
    </div>
    <button id="finish-save" class="btn-primary" style="background:#F9C87D">Finish Vial</button>
  `, "#F9C87D");
  m.querySelector("#x").onclick = closeModal;
  let reasonKey = "used_in_dose";
  const setReason = (key) => {
    reasonKey = key;
    m.querySelectorAll(".finish-reason-opt").forEach(btn=>{
      const active = btn.dataset.key===key;
      btn.style.background = active ? "var(--surface-3)" : "transparent";
      btn.style.borderColor = active ? "var(--border)" : "transparent";
      btn.querySelector("div").style.color = active ? "var(--t1)" : "var(--t3)";
    });
    m.querySelector("#finish-other-field").style.display = key==="other" ? "block" : "none";
  };
  m.querySelectorAll(".finish-reason-opt").forEach(btn=>btn.onclick=()=>setReason(btn.dataset.key));

  m.querySelector("#finish-save").onclick = () => {
    if (reasonKey==="used_in_dose") {
      // For a v2 vial, finishVial() zeroes remainingMg immediately, right here — not
      // deferred until the resulting dose gets saved. The draft below exists purely to
      // pre-fill Log Dose with the right amount and record proper history; it is not what
      // makes the inventory change, and is marked finished:true so Log Dose's own save
      // doesn't try to deduct this same material a second time.
      if (vial) finishVial(s, vial, "used_in_dose"); else { s.emptyVials=(s.emptyVials||0)+1; s.activeKit=false; s.finishedAt=localDatetime(); }
      // finishVial() has ALREADY zeroed this vial's remainingMg (for a v2 vial) — this row
      // represents material that's already left inventory, not something doseModal's save
      // should try to deduct again. finished:true tells it to just record the allocation.
      state._pendingDoseDraft = { name: s.name, id: uid(), dose: remainingMg.toFixed(2), date: localDatetime(), site: "", notes: "", escalation:false, symptoms:[], rows: [{kitId: s.id, vialId: vial?.id, mg: Math.round(remainingMg*100)/100, finished:true}] };
      saveState(); closeModal(); render();
      doseModal(s.name);
      return;
    }

    if (vial) finishVial(s, vial, reasonKey); else { s.emptyVials=(s.emptyVials||0)+1; s.activeKit=false; s.finishedAt=localDatetime(); }
    if (remainingMg > 0.01) {
      const otherText = m.querySelector("#finish-other-text")?.value?.trim();
      const reasonLabel = reasonKey==="discarded" ? "Discarded — vial finished"
        : reasonKey==="discrepancy" ? "Inventory discrepancy — vial was already empty"
        : (otherText || "Other — vial finished");
      if (!s.wasteLog) s.wasteLog = [];
      // "discrepancy" is tagged as an adjustment, not waste — nothing was actually lost,
      // the calculated number just didn't match reality. Both still zero the vial out;
      // the type is what keeps history honest about which one actually happened. Tagged
      // with vialId so it's attributed to THIS specific vial, not the kit in general.
      s.wasteLog.push({ id: uid(), date: localDate(), loggedAt: new Date().toISOString(), mg: remainingMg, type: reasonKey==="discrepancy"?"adjustment":"waste", reason: reasonLabel, notes:"", status:"active", vialId: vial?.id });
    }
    saveState(); closeModal(); render();
  };
}

function markKitDoneModal(supplyId) {
  const s = state.supplies.find(x=>x.id===supplyId); if(!s) return;
  const c = cfg(s.name);
  // getKitRemainingMg is the one canonical source for this number — it already defers to
  // the sum of vial.remainingMg for a v2-migrated kit. The previous separate dose-history
  // scan here only matched doses carrying this kit's OWN kitId directly; any dose logged
  // through the multi-vial engine (which always records allocations[] instead of a bare
  // kitId, even for a single-kit dose) was invisible to it the moment more than one kit
  // existed for the same compound — silently showing a wildly inflated "leftover" amount.
  const remainingMg = getKitRemainingMg(s);

  const REASONS = [
    { key:"used_up", label:"Used up completely" },
    { key:"bad_batch", label:"Bad batch / discarded" },
    { key:"other", label:"Other" },
  ];

  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:var(--t3);letter-spacing:1.5px">MARK KIT DONE — ${esc(s.name).toUpperCase()}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:14px">Moves this kit out of your active list into a collapsed "Done" section — it stays in your history, just out of the way while scrolling.</div>
    <label class="field-label">WHY IS IT DONE</label>
    <div style="display:flex;gap:6px;margin-bottom:14px">
      ${REASONS.map((r,i)=>toggleChip(r.label, i===0, {attrs:`class="donereason-toggle" data-key="${r.key}"`, fontSize:"11px", padding:"9px 6px"})).join("")}
    </div>
    ${remainingMg>0?`<div id="leftover-notice" style="background:#ff7c7c11;border:1px solid #ff7c7c33;border-radius:10px;padding:12px 14px;margin-bottom:14px">
      <div style="font-size:12px;color:#ff7c7c;font-weight:600;margin-bottom:4px">This kit still shows ${remainingMg.toFixed(1)}mg remaining</div>
      <div style="font-size:11px;color:var(--t4);line-height:1.5">Marking it done will log that as waste so your supply totals stay accurate. Adjust if only part of it was actually lost.</div>
      <label class="field-label" style="margin-top:10px">MG TO LOG AS WASTE</label>
      <input id="leftover-mg" type="number" step="0.01" class="inp" value="${remainingMg.toFixed(2)}">
    </div>`:""}
    <label class="field-label">NOTES (optional)</label>
    <textarea id="done-notes" class="inp" placeholder="Anything worth remembering…" style="min-height:50px;resize:vertical;margin-bottom:18px"></textarea>
    <button id="done-save" class="btn-primary" style="background:var(--t3)">Mark Done</button>
  `, "#888");

  m.querySelector("#x").onclick = closeModal;
  let reasonKey = "used_up";
  m.querySelectorAll(".donereason-toggle").forEach(btn=>btn.onclick=()=>{
    reasonKey = btn.dataset.key;
    m.querySelectorAll(".donereason-toggle").forEach(b=>{
      const active = b.dataset.key===reasonKey;
      b.style.background = active ? "var(--surface-3)" : "transparent";
      b.style.borderColor = active ? "var(--border)" : "transparent";
      b.style.color = active ? "var(--t1)" : "var(--t4)";
    });
  });

  m.querySelector("#done-save").onclick = () => {
    const reasonLabel = REASONS.find(r=>r.key===reasonKey).label;
    const notes = m.querySelector("#done-notes").value;
    const leftoverInput = m.querySelector("#leftover-mg");
    const leftoverMg = leftoverInput ? parseFloat(leftoverInput.value)||0 : 0;
    if (leftoverMg > 0) {
      if (!s.wasteLog) s.wasteLog = [];
      s.wasteLog.push({ id: uid(), date: localDate(), loggedAt: new Date().toISOString(), mg: leftoverMg, type: reasonKey==="bad_batch"?"waste":"waste", reason: reasonKey==="bad_batch"?"Bad batch — kit discarded":"Kit marked done", notes });
    }
    // The whole kit is retiring, not just one vial — every vial in it needs to actually
    // zero out for a v2-migrated kit, or the kit total would still show whatever material
    // its vials claim to have left even after being marked done. wasteLog alone (above)
    // is audit history only; it doesn't move the authoritative number by itself.
    migrateKitToV2(s);
    (s.vials||[]).forEach(v => { if (v.remainingMg > 0) { v.remainingMg = 0; v.status = "empty"; } });
    s.kitStatus = "done";
    s.doneReason = reasonLabel;
    s.activeKit = false;
    saveState(); closeModal(); render();
  };
}

// Undo Outflow — reverses a specific transaction, on the SAME kit/vial it came from.
// Since kit "remaining" is always derived (never a stored balance), reversal is just
// marking the transaction status:"reversed" — getKitActiveWasteMg/getKitUsedMg then skip
// it automatically, which is what propagates the restored amount through vial remaining,
// kit remaining, supply forecast, and Needs Attention in one place, with nothing else to
// update by hand. No fake compensating dose or adjustment record is created.
function undoOutflowModal(kitId, txId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  const tx = (s.wasteLog||[]).find(w=>w.id===txId); if(!tx) return;
  const c = cfg(s.name);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#ff7c7c;letter-spacing:1.5px">UNDO OUTFLOW</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="font-size:14px;color:var(--t1);font-weight:600;margin-bottom:8px">Undo ${tx.mg}mg outflow?</div>
    <div class="hint" style="margin-bottom:20px">This will restore the exact vial this came from — reopening it if it was transferred or finished as part of this transaction. The transaction stays in history, marked as reversed.</div>
    <div style="display:flex;gap:8px">
      <button id="cancel-undo" style="flex:1;padding:11px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);color:var(--t2);font-size:13px">Cancel</button>
      <button id="confirm-undo" style="flex:1;padding:11px;border-radius:10px;background:#ff7c7c;color:#000;font-weight:700;font-size:13px">Undo Outflow</button>
    </div>
  `, "#ff7c7c");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#cancel-undo").onclick = closeModal;
  m.querySelector("#confirm-undo").onclick = () => {
    // Reverse the actual vial-level effect, not just flag the transaction — the old
    // comment here described the pre-v2 history-derived model, where marking a wasteLog
    // entry "reversed" was enough because remaining was always recomputed from live
    // history on every render. Once a vial's remainingMg became a directly-mutated field,
    // that stopped being true: this needs to explicitly put the material back on the
    // specific vial the transaction actually came from, branching on exactly what that
    // transaction did so undo restores the right status, not just the right number.
    migrateKitToV2(s);
    const v = tx.vialId ? (s.vials||[]).find(v=>v.id===tx.vialId) : null;
    if (v && v.remainingMg !== undefined && tx.status!=="reversed") {
      if (tx.outflowKind === "transferred_sealed") {
        v.status = "sealed"; v.remainingMg = v.vialMg!=null ? v.vialMg : (s.vialMg||0);
      } else {
        const wasEmpty = v.status==="empty";
        v.remainingMg = Math.round((v.remainingMg + tx.mg)*100)/100;
        if (wasEmpty && v.remainingMg>0.01) v.status = "open";
      }
    }
    tx.status = "reversed";
    tx.reversedAt = localDatetime();
    saveState(); closeModal(); render();
  };
}

// Edit Outflow — correct the amount/reason/note/date of an existing transaction rather
// than undo-then-redo. Since remaining is derived from the live wasteLog value, changing
// mg here automatically restores/consumes the difference on next render — no manual
// compensating math.
function editOutflowModal(kitId, txId) {
  const s = state.supplies.find(x=>x.id===kitId); if(!s) return;
  const tx = (s.wasteLog||[]).find(w=>w.id===txId); if(!tx) return;
  const c = cfg(s.name);
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:var(--t3);letter-spacing:1.5px">EDIT OUTFLOW</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <label class="field-label">AMOUNT (mg)</label>
    <input id="eo-mg" type="number" step="0.01" class="inp" value="${tx.mg}" style="margin-bottom:14px">
    <label class="field-label">REASON</label>
    <input id="eo-reason" class="inp" value="${esc(tx.reason||"")}" style="margin-bottom:14px">
    <label class="field-label">DATE</label>
    <input id="eo-date" type="date" class="inp" value="${dayKey(tx.date)}" style="margin-bottom:14px">
    <label class="field-label">NOTES (optional)</label>
    <textarea id="eo-notes" class="inp" style="min-height:50px;resize:vertical;margin-bottom:18px">${esc(tx.notes||"")}</textarea>
    <button id="eo-save" class="btn-primary" style="background:var(--t3)">Save Changes</button>
  `, "#888");
  m.querySelector("#x").onclick = closeModal;
  m.querySelector("#eo-save").onclick = () => {
    const newMg = parseFloat(m.querySelector("#eo-mg").value)||0;
    tx.mg = newMg;
    tx.reason = m.querySelector("#eo-reason").value.trim();
    tx.date = m.querySelector("#eo-date").value || tx.date;
    tx.notes = m.querySelector("#eo-notes").value;
    saveState(); closeModal(); render();
  };
}

// Which vial a WHOLE-vial outflow comes out of, decided in one place (and testable) rather
// than inline in a click handler. If a kit has BOTH an open vial and a sealed backup, this
// is a real physical choice the person must make explicitly — never inferred, because
// silently preferring one is exactly how giving away a sealed vial used to close out the
// vial actually in use. "sealed"/"open" mean only one kind exists, so there's nothing to ask.
function resolveWholeVialOutflow(openVial, sealedVials) {
  if (openVial && sealedVials.length) return "choose";
  if (sealedVials.length) return "sealed";
  if (openVial) return "open";
  return "none";
}
// Applies a whole-vial outflow to exactly ONE vial and touches no other. A sealed vial
// leaving inventory whole is a TRANSFER, not consumption — it was never opened or drawn
// from — so the open vial (and its reconDate/bacMl/status) is completely untouched by it.
function applyWholeVialOutflow(kit, target, kind, { outflowType, reason, notes, date }) {
  const targetMg = kind==="transferred_sealed" ? (target.vialMg!=null?target.vialMg:kit.vialMg||0) : target.remainingMg;
  if (kind==="transferred_sealed") {
    target.status = "transferred";
    target.remainingMg = 0;
  } else {
    target.remainingMg = 0;
    target.status = "empty";
  }
  if (!kit.wasteLog) kit.wasteLog = [];
  kit.wasteLog.push({ id: uid(), date, loggedAt: new Date().toISOString(), mg: targetMg, type: outflowType, reason, notes, status:"active", vialId: target.id, outflowKind: kind });
}

function logWasteModal(supplyId) {
  const s = state.supplies.find(x=>x.id===supplyId); if(!s) return;
  const c = cfg(s.name);
  // Add a new outflow reason here — no other code changes needed. `field` is "select" (a
  // fixed reason list) or "text" (a free-text detail, e.g. who/where it went).
  const OUTFLOW_TYPES = [
    { key:"waste", icon:"⚠", label:"Wasted / Lost", field:"select", fieldLabel:"REASON",
      options:["Didn't reconstitute (undissolved)","Contaminated / dropped","Equipment failure (needle broke, etc.)","Expired before use","Other"],
      buildReason:v=>v },
    { key:"gifted", icon:"🎁", label:"Given Away", field:"text", fieldLabel:"GIVEN TO (optional)", placeholder:"e.g. a friend",
      buildReason:v=>v?`Given to ${v}`:"Given away" },
    { key:"testing", icon:"🧪", label:"Sent for Testing", field:"text", fieldLabel:"SENT TO (optional)", placeholder:"e.g. a lab or testing service",
      buildReason:v=>v?`Sent to ${v} for testing`:"Sent for testing" },
  ];
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:#ff7c7c;letter-spacing:1.5px">LOG OUTFLOW — ${esc(s.name).toUpperCase()}</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div class="hint" style="margin-bottom:14px">For product that leaves your stash without a dose being logged. Keeps your remaining supply accurate either way.</div>
    <label class="field-label">WHAT HAPPENED</label>
    <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
      ${OUTFLOW_TYPES.map((t,i)=>toggleChip(`${t.icon} ${t.label}`, i===0, {attrs:`class="outflow-type-toggle" data-type="${t.key}"`, fontSize:"11.5px", padding:"9px 6px"})).join("")}
    </div>
    <label class="field-label">AMOUNT</label>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      ${toggleChip(`Whole vial (${s.vialMg||"?"}mg)`, true, {attrs:`id="waste-whole" class="waste-amt-toggle" data-mode="whole"`})}
      ${toggleChip("Partial amount", false, {attrs:`id="waste-partial" class="waste-amt-toggle" data-mode="partial"`})}
    </div>
    <div id="waste-partial-input" style="display:none;margin-bottom:14px">
      <label class="field-label">MG</label>
      <input id="waste-mg" type="number" step="0.01" class="inp" placeholder="e.g. 1.5">
    </div>
    <div id="outflow-select-field">
      <label class="field-label">REASON</label>
      <select id="waste-reason" class="inp" style="margin-bottom:14px">${OUTFLOW_TYPES[0].options.map(r=>`<option>${esc(r)}</option>`).join("")}</select>
    </div>
    <div id="outflow-text-field" style="display:none">
      <label id="outflow-text-label" class="field-label">GIVEN TO (optional)</label>
      <input id="outflow-text-input" class="inp" placeholder="" style="margin-bottom:14px">
    </div>
    <label class="field-label">DATE</label>
    <input id="waste-date" type="date" class="inp" value="${localDate()}" style="margin-bottom:14px">
    <label class="field-label">NOTES (optional)</label>
    <textarea id="waste-notes" class="inp" placeholder="Anything worth remembering…" style="min-height:50px;resize:vertical;margin-bottom:18px"></textarea>
    <button id="waste-save" class="btn-primary" style="background:#ff7c7c">Log It</button>
  `, "#ff7c7c");

  m.querySelector("#x").onclick = closeModal;

  let mode = "whole";
  const setMode = (m2) => {
    mode = m2;
    m.querySelector("#waste-whole").style.background = mode==="whole" ? "var(--surface-3)" : "transparent";
    m.querySelector("#waste-whole").style.borderColor = mode==="whole" ? "var(--border)" : "transparent";
    m.querySelector("#waste-whole").style.color = mode==="whole" ? "var(--t1)" : "var(--t4)";
    m.querySelector("#waste-partial").style.background = mode==="partial" ? "var(--surface-3)" : "transparent";
    m.querySelector("#waste-partial").style.borderColor = mode==="partial" ? "var(--border)" : "transparent";
    m.querySelector("#waste-partial").style.color = mode==="partial" ? "var(--t1)" : "var(--t4)";
    m.querySelector("#waste-partial-input").style.display = mode==="partial" ? "block" : "none";
  };
  m.querySelector("#waste-whole").onclick = () => setMode("whole");
  m.querySelector("#waste-partial").onclick = () => setMode("partial");

  let outflowType = OUTFLOW_TYPES[0].key;
  const setType = (key) => {
    outflowType = key;
    const conf = OUTFLOW_TYPES.find(t=>t.key===key);
    m.querySelectorAll(".outflow-type-toggle").forEach(btn=>{
      const active = btn.dataset.type===key;
      btn.style.background = active ? "var(--surface-3)" : "transparent";
      btn.style.borderColor = active ? "var(--border)" : "transparent";
      btn.style.color = active ? "var(--t1)" : "var(--t4)";
    });
    const selectField = m.querySelector("#outflow-select-field");
    const textField = m.querySelector("#outflow-text-field");
    if (conf.field==="select") {
      selectField.style.display = "block"; textField.style.display = "none";
    } else {
      selectField.style.display = "none"; textField.style.display = "block";
      m.querySelector("#outflow-text-label").textContent = conf.fieldLabel;
      m.querySelector("#outflow-text-input").placeholder = conf.placeholder;
    }
  };
  m.querySelectorAll(".outflow-type-toggle").forEach(btn=>btn.onclick=()=>setType(btn.dataset.type));

  m.querySelector("#waste-save").onclick = () => {
    const mode0 = mode;
    const date = m.querySelector("#waste-date").value || localDate();
    const notes = m.querySelector("#waste-notes").value;
    const conf = OUTFLOW_TYPES.find(t=>t.key===outflowType);
    const value = conf.field==="select" ? m.querySelector("#waste-reason").value : m.querySelector("#outflow-text-input").value.trim();
    const reason = conf.buildReason(value);
    migrateKitToV2(s);
    const openVial = kitOpenVialV2(s);
    const sealedVials = kitSealedVialsV2(s);

    if (mode0==="partial") {
      const mg = parseFloat(m.querySelector("#waste-mg").value)||0;
      if (mg<=0) return;
      // A partial amount only makes sense as coming out of the vial actually in use.
      if (!openVial) { showErrorBanner("No open vial to draw a partial outflow from."); return; }
      openVial.remainingMg = Math.max(0, Math.round((openVial.remainingMg-mg)*100)/100);
      if (openVial.remainingMg <= 0.01) { openVial.remainingMg = 0; openVial.status = "empty"; }
      if (!s.wasteLog) s.wasteLog = [];
      s.wasteLog.push({ id: uid(), date, loggedAt: new Date().toISOString(), mg, type: outflowType, reason, notes, status:"active", vialId: openVial.id, outflowKind:"consumed_open_partial" });
      saveState(); closeModal(); render();
      return;
    }

    // Whole vial — a real physical choice with real consequences, never inferred. If
    // there's genuinely only one kind of vial available, there's nothing to ask; if both
    // a sealed backup and an open vial exist, this MUST be an explicit choice — silently
    // preferring one over the other is exactly the bug this flow is being rebuilt to fix.
    const proceedWhole = (target, kind) => {
      applyWholeVialOutflow(s, target, kind, { outflowType, reason, notes, date });
      saveState(); closeModal(); render();
    };

    const wholeRoute = resolveWholeVialOutflow(openVial, sealedVials);
    if (wholeRoute === "choose") {
      // Genuine ambiguity — ask, and default the selection (not the action) toward the
      // sealed vial for anything that isn't "wasted," since giving away/testing a vial
      // you've never opened is by far the more common real case; the person still has to
      // confirm either way.
      const preferSealed = outflowType!=="waste";
      const dm = openModal(`
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <span class="mono" style="font-size:13px;color:#ff7c7c;letter-spacing:1.5px">WHICH VIAL IS LEAVING?</span>
          <button id="x2" style="color:var(--t4);font-size:18px">✕</button>
        </div>
        <div class="hint" style="margin-bottom:16px">This kit has both a sealed backup and a vial already in use. Pick exactly which physical vial is leaving your stash.</div>
        <button class="whole-vial-choice" data-choice="sealed" style="display:block;width:100%;text-align:left;padding:13px 14px;border-radius:10px;background:${preferSealed?"#ff7c7c14":"var(--surface-2)"};border:1px solid ${preferSealed?"#ff7c7c44":"var(--border-sub)"};margin-bottom:8px">
          <div style="font-size:13px;font-weight:600;color:var(--t1)">Sealed vial — ${(sealedVials[0].vialMg!=null?sealedVials[0].vialMg:s.vialMg||0)}mg</div>
          <div style="font-size:11px;color:var(--t5);margin-top:2px">Never opened · your open vial is untouched</div>
        </button>
        <button class="whole-vial-choice" data-choice="open" style="display:block;width:100%;text-align:left;padding:13px 14px;border-radius:10px;background:${preferSealed?"var(--surface-2)":"#ff7c7c14"};border:1px solid ${preferSealed?"var(--border-sub)":"#ff7c7c44"}">
          <div style="font-size:13px;font-weight:600;color:var(--t1)">Current open vial — ${openVial.remainingMg.toFixed(1)}mg remaining</div>
          <div style="font-size:11px;color:var(--t5);margin-top:2px">This closes out your currently reconstituted vial</div>
        </button>
      `, "#ff7c7c");
      dm.querySelector("#x2").onclick = closeModal;
      dm.querySelectorAll(".whole-vial-choice").forEach(btn=>btn.onclick=()=>{
        closeModal();
        if (btn.dataset.choice==="sealed") proceedWhole(sealedVials[0], "transferred_sealed");
        else proceedWhole(openVial, "consumed_open_whole");
      });
      return;
    }
    if (wholeRoute === "sealed") { proceedWhole(sealedVials[0], "transferred_sealed"); return; }
    if (wholeRoute === "open") { proceedWhole(openVial, "consumed_open_whole"); return; }
    showErrorBanner("No vial available in this kit to log an outflow against.");
  };
}

function openNewVialModal(supplyId, onDone) {
  const s = state.supplies.find(x=>x.id===supplyId); if(!s) return;
  const c = cfg(s.name);
  if(s.isBlend && (!getSealedVials(s).length || getActiveVial(s))) { showErrorBanner(getActiveVial(s)?"Finish the open vial before opening another.":"No sealed vials remain."); return; }
  const today = localDate();
  const vialNum = ((s.reconHistory||[]).length)+1;
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <span class="mono" style="font-size:13px;color:${c.color};letter-spacing:1.5px">OPEN NEW VIAL</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="background:${c.color}11;border:1px solid ${c.color}33;border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="font-size:11px;color:${c.color};font-weight:600;margin-bottom:10px">VIAL ${vialNum} DETAILS</div>
      <div class="nx-open-vial-fields" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        <div>
          <label class="field-label">VIALS IN KIT</label>
          <input id="rv-totalvials" type="number" ${s.isBlend?"readonly":""} class="inp" value="${s.totalVials||""}" placeholder="e.g. 10" style="padding:6px 8px;font-size:12px">
        </div>
        <div>
          <label class="field-label">MG PER VIAL</label>
          <input id="rv-vialmg" type="number" ${s.isBlend?"readonly":""} class="inp" value="${s.vialMg||""}" placeholder="e.g. 30" style="padding:6px 8px;font-size:12px">
        </div>
        <div>
          <label class="field-label">BAC WATER (mL)</label>
          <input id="rv-bacml" type="number" step="0.1" class="inp" value="${s.bacMl||""}" placeholder="e.g. 3" style="padding:6px 8px;font-size:12px">
        </div>
      </div>
      <div id="rv-conc-preview" style="font-size:11px;color:var(--t4);margin-top:8px;text-align:center"></div>
    </div>
    <label class="field-label">RECONSTITUTION DATE</label>
    <input id="rvd" type="date" class="inp" value="${today}" style="margin-bottom:14px">
    <label class="field-label">EXPIRY AFTER RECON (DAYS)</label>
    <input id="rv-expiry" type="number" step="1" min="1" class="inp" value="${s.expiryDays||28}" style="margin-bottom:14px">
    <label class="field-label">NOTES (lot #, batch, anything notable)</label>
    <input id="rvn" class="inp" placeholder="optional" style="margin-bottom:18px">
    <button id="rvsave" class="btn-primary" style="background:${c.color};color:#1A1728!important">Log Reconstitution</button>
  `, c.color);
  m.querySelector("#x").onclick = closeModal;

  // Live concentration preview
  const updatePreview = () => {
    const mg = parseFloat(m.querySelector("#rv-vialmg").value)||0;
    const bac = parseFloat(m.querySelector("#rv-bacml").value)||0;
    const tv = parseInt(m.querySelector("#rv-totalvials").value)||0;
    const prev = m.querySelector("#rv-conc-preview");
    if(mg && bac) {
      const conc = (mg/bac).toFixed(2);
      const unit = PEPTIDES[s.name]?.unit||"mg";
      prev.textContent = `Concentration: ${conc} mg/mL · 1 ${unit} ≈ ${(1/conc*1000).toFixed(1)} units${tv?" · "+tv+" vials total":""}`;
      prev.style.color = c.color;
    } else { prev.textContent = ""; }
  };
  m.querySelector("#rv-vialmg").oninput = updatePreview;
  m.querySelector("#rv-bacml").oninput = updatePreview;
  m.querySelector("#rv-totalvials").oninput = updatePreview;
  updatePreview();

  m.querySelector("#rvsave").onclick = () => {
    const entry = state.supplies.find(x=>x.id===supplyId); if(!entry) return;
    // Save any edits back to the kit
    const newMg = parseFloat(m.querySelector("#rv-vialmg").value);
    const newBac = parseFloat(m.querySelector("#rv-bacml").value);
    const newTv = parseInt(m.querySelector("#rv-totalvials").value);
    const expiryDays=Number(m.querySelector("#rv-expiry").value);
    if(!Number.isFinite(newBac)||newBac<=0||!Number.isInteger(expiryDays)||expiryDays<1||expiryDays>3650){showErrorBanner("Enter valid BAC water and expiry interval.");return;}
    if(!entry.isBlend && !isNaN(newMg)) entry.vialMg = newMg;
    if(!entry.isBlend && !isNaN(newTv)) entry.totalVials = newTv;
    // If reconstituting today, capture the actual time (not just the date). Otherwise a dose
    // logged earlier today (from the vial being finished) would share the same calendar date
    // as this new vial's reconDate and get miscounted as "used from the new vial."
    const pickedDate = m.querySelector("#rvd").value;
    const reconTimestamp = (pickedDate === localDate()) ? new Date().toISOString() : pickedDate;
    if(entry.isBlend){
      const sealed=getSealedVials(entry);if(!sealed.length||getActiveVial(entry)){showErrorBanner("No available sealed vial to open.");return;}
      const vial=sealed[0],notes=m.querySelector("#rvn").value.trim();
      vial.status="open";vial.reconDate=reconTimestamp;vial.bacMl=newBac;vial.expiryDays=expiryDays;vial.notes=notes;
      // Immutable recipe for this physical vial; later kit edits cannot rewrite it.
      if(!Array.isArray(vial.composition) && Array.isArray(entry.composition))
        vial.composition=entry.composition.map(x=>({compound:x.compound,mg:Number(x.mg)}));
      entry.bacMl=newBac;entry.expiryDays=expiryDays;entry.reconDate=reconTimestamp;entry.openedVials=(entry.openedVials||0)+1;entry.activeKit=true;
      entry.reconHistory=entry.reconHistory||[];
      entry.reconHistory.push({id:uid(),date:reconTimestamp,notes,vialId:vial.id,bacMl:newBac,expiryDays});
      saveState();closeModal();render();if(typeof onDone==='function')onDone(vial);return;
    }
    entry.expiryDays=expiryDays;
    confirmOpenIfOtherKitOpen(entry, () => {
      // Single canonical path for opening a vial — the same activateVial() used by the
      // mid-dose "Open New Vial" flow, so this button and that one can never drift apart
      // the way openNewVialModal's own inline bookkeeping and reconstituteVialModal's
      // vials[]-based bookkeeping just did. No more forced deactivation of other same-name
      // kits here — multiple can now be open at once, by explicit confirmation above.
      activateVial(entry, reconTimestamp, isNaN(newBac)?entry.bacMl:newBac, m.querySelector("#rvn").value);
      saveState(); closeModal(); render();
      if(typeof onDone==='function')onDone(getActiveVial(entry));
    });
  };
}

// ─── Equipment & Supplies view ────────────────────────────────────────────────
// ─── Supplies (unit-tracked, mirrors Compound Kits architecture) ────────────
function supplyForecast(item) {
  // Forecasting only kicks in once there's real usage history to learn from —
  // same "don't project from nothing" philosophy as Compound Kits' EST REMAINING.
  const log = item.usageLog||[];
  if (log.length < 2) return null;
  const sorted = [...log].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const spanDays = Math.max(1, (new Date(sorted[sorted.length-1].date)-new Date(sorted[0].date))/86400000);
  const totalUsed = sorted.reduce((a,l)=>a+(l.amount||0),0);
  const avgDailyUse = totalUsed/spanDays;
  if (avgDailyUse<=0) return null;
  const activeUnit = (item.units||[]).find(u=>u.status==="active");
  const sealedCount = (item.units||[]).filter(u=>u.status==="sealed").length;
  const remainingInActive = activeUnit ? Math.max(0, item.unitSize-activeUnit.consumed) : 0;
  const totalRemaining = remainingInActive + sealedCount*item.unitSize;
  const daysRemaining = totalRemaining/avgDailyUse;
  const depletionDate = addDays(localDate(), Math.round(daysRemaining));
  return { avgDailyUse, daysRemaining, depletionDate, totalRemaining, sampleSize: log.length };
}

function stashFilterModal() {
  const FILTERS = [
    ["all","All"],["active","Active/Open"],["attention","Needs Attention"],["low","Low"],
    ["expiring","Expiring/Expired"],["stored","Stored/Sealed"],["prepared","Has Prepared Doses"],["finished","Finished/Discarded"],
  ];
  const current = state._stashFilter||"all";
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:var(--t2);letter-spacing:1.5px">FILTER</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    ${FILTERS.map(([id,label])=>`<button class="stash-filter-opt" data-id="${id}" style="display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;padding:12px;border-radius:10px;background:${current===id?"var(--surface-3)":"transparent"};border:1px solid ${current===id?"var(--border)":"transparent"};margin-bottom:2px;font-size:13px;color:${current===id?"var(--t1)":"var(--t3)"};font-weight:${current===id?"600":"400"}"><span>${label}</span>${current===id?`<span style="color:#7DF9C0">✓</span>`:""}</button>`).join("")}
  `, "#888");
  m.querySelector("#x").onclick = closeModal;
  m.querySelectorAll(".stash-filter-opt").forEach(b=>b.onclick=()=>{ state._stashFilter=b.dataset.id; closeModal(); render(); });
}

function stashSortModal() {
  const SORTS = [
    ["attention","Needs Attention first"],["expiry","Expiry soonest"],
    ["remaining_low","Remaining: low → high"],["remaining_high","Remaining: high → low"],
    ["remaining_pct_low","Remaining %: low → high"],["remaining_pct_high","Remaining %: high → low"],
    ["doses_left","Fewest doses left"],
    ["recon_recent","Most recently reconstituted"],["recon_oldest","Oldest reconstituted"],
    ["last_used","Most recently used"],
    ["name_az","Name A–Z"],["name_za","Name Z–A"],
    ["cost_high","Cost high → low"],["cost_low","Cost low → high"],
  ];
  const GROUPS = [["none","None"],["status","Status"],["inventory_state","Inventory state"]];
  const currentSort = state._stashSort||"attention";
  const currentGroup = state._stashGroup||"none";
  const m = openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span class="mono" style="font-size:13px;color:var(--t2);letter-spacing:1.5px">SORT</span>
      <button id="x" style="color:var(--t4);font-size:18px">✕</button>
    </div>
    <div style="max-height:44vh;overflow-y:auto;margin-bottom:18px">
      ${SORTS.map(([id,label])=>`<button class="stash-sort-opt" data-id="${id}" style="display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;padding:11px 12px;border-radius:10px;background:${currentSort===id?"var(--surface-3)":"transparent"};border:1px solid ${currentSort===id?"var(--border)":"transparent"};margin-bottom:2px;font-size:13px;color:${currentSort===id?"var(--t1)":"var(--t3)"};font-weight:${currentSort===id?"600":"400"}"><span>${label}</span>${currentSort===id?`<span style="color:#7DF9C0">✓</span>`:""}</button>`).join("")}
    </div>
    <div class="mono" style="font-size:9px;color:var(--t4);letter-spacing:1.5px;margin-bottom:8px">GROUP BY</div>
    <div style="display:flex;gap:6px">
      ${GROUPS.map(([id,label])=>`<button class="stash-group-opt" data-id="${id}" style="flex:1;padding:9px;border-radius:9px;font-size:12px;font-weight:600;background:${currentGroup===id?"var(--surface-3)":"var(--surface-2)"};border:1px solid ${currentGroup===id?"var(--border)":"var(--border-sub)"};color:${currentGroup===id?"var(--t1)":"var(--t4)"}">${label}</button>`).join("")}
    </div>
  `, "#888");
  m.querySelector("#x").onclick = closeModal;
  m.querySelectorAll(".stash-sort-opt").forEach(b=>b.onclick=()=>{ state._stashSort=b.dataset.id; closeModal(); render(); });
  m.querySelectorAll(".stash-group-opt").forEach(b=>b.onclick=()=>{ state._stashGroup=b.dataset.id; closeModal(); render(); });
}

function equipmentView() {
  const items = state.equipmentItems || [];
  items.forEach(normalizeSupplyUnits); // defensive: never render a silently-ignored second active unit
  const isDone = (item) => (item.units||[]).length>0 && (item.units||[]).every(u=>u.status==="empty");
  const liveItems = items.filter(i=>!isDone(i));
  const doneItems = items.filter(isDone);

  const renderSupplyCard = (item) => {
    const units = item.units||[];
    const activeUnit = units.find(u=>u.status==="active");
    const sealedCount = units.filter(u=>u.status==="sealed").length;
    const emptyUnits = units.filter(u=>u.status==="empty");
    const emptyCount = emptyUnits.length;
    const remaining = activeUnit ? Math.max(0, item.unitSize-activeUnit.consumed) : null;
    const pct = activeUnit ? Math.round((remaining/item.unitSize)*100) : null;
    const isBacWater = item.type==="BAC Water";
    const isFullyDone = units.length>0 && units.every(u=>u.status==="empty");

    // BAC water's status has to account for how long the active bottle has been open, not
    // just how much liquid is left — a bottle opened 40 days ago is not "Healthy" just
    // because it's still mostly full. Priority: expired > expiring > low > healthy.
    const daysOpen = (isBacWater && activeUnit?.openedDate) ? Math.floor(daysSince(activeUnit.openedDate)) : null;
    const useByDate = (isBacWater && activeUnit?.openedDate) ? addDays(activeUnit.openedDate, 28) : null;
    const daysUntilUseBy = useByDate!=null ? Math.ceil((new Date(useByDate).getTime()-Date.now())/86400000) : null;

    let statusKey = "empty";
    if (activeUnit) {
      if (isBacWater && daysOpen!=null && daysOpen>=28) statusKey = "expired";
      else if (isBacWater && daysOpen!=null && daysOpen>=21) statusKey = "expiring";
      else if (pct<=20) statusKey = "low";
      else statusKey = "healthy";
    } else if (sealedCount>0) statusKey = "stored";
    const st = STATUS_META[statusKey] || STATUS_META.stored;

    const forecast = supplyForecast(item);

    // ── Fully-completed item: show history, not "no active unit" live-use language ──
    if (isFullyDone) {
      const sortedByOpen = [...emptyUnits].filter(u=>u.openedDate).sort((a,b)=>new Date(a.openedDate)-new Date(b.openedDate));
      const sortedByEmptied = [...emptyUnits].filter(u=>u.emptiedDate).sort((a,b)=>new Date(a.emptiedDate)-new Date(b.emptiedDate));
      const firstOpened = sortedByOpen[0]?.openedDate;
      const lastCompleted = sortedByEmptied[sortedByEmptied.length-1]?.emptiedDate;
      const totalConsumed = emptyUnits.reduce((a,u)=>a+(u.consumed||0),0);
      return `<div class="card" style="border-color:var(--border-sub);margin-bottom:12px;padding:16px">
        <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">
          <div style="width:9px;height:9px;border-radius:50%;background:${isBacWater?"#7DD4F9":"#C9A0FF"};flex-shrink:0"></div>
          <span style="font-size:15px;font-weight:700;color:var(--t1);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${esc(item.type)}${item.brand?` · ${esc(item.brand)}`:""}</span>
          ${statusBadge("Done","neutral")}
        </div>
        <div style="font-size:12px;color:var(--t4);margin-bottom:2px">${emptyCount} ${item.unitLabel}${emptyCount===1?"":"s"} completed</div>
        ${firstOpened?`<div style="font-size:11px;color:var(--t5)">First opened ${fmtDate(firstOpened)}${lastCompleted?` · last completed ${fmtDate(lastCompleted)}`:""}</div>`:""}
        <div style="font-size:11px;color:var(--t5);margin-bottom:12px">Total consumed: ${totalConsumed%1===0?totalConsumed:totalConsumed.toFixed(1)} ${item.unitOfMeasure}</div>
        <button class="supply-restock" data-id="${item.id}" >+ Restock</button>
      </div>`;
    }

    // ── Forecasting context (item #8): sample size, and for BAC water, whichever
    // constraint (volume depletion vs. the 28-day use-by window) arrives first ──
    let forecastLine = "";
    if (forecast) {
      forecastLine = `Estimated from ${forecast.sampleSize} logged use${forecast.sampleSize===1?"":"s"} · depleting around ${fmtDate(forecast.depletionDate)}`;
      if (isBacWater && useByDate) {
        const depletionMs = new Date(forecast.depletionDate).getTime();
        const useByMs = new Date(useByDate).getTime();
        forecastLine += useByMs < depletionMs
          ? " · use-by date arrives before estimated depletion"
          : " · estimated depletion arrives before the use-by date";
      }
    }

    return `<div class="card nx-supply-kit-card" data-supply-id="${item.id}">
      <div class="nx-supply-kit-header">
        <div class="nx-supply-kit-name"><span class="nx-supply-dot" style="background:${isBacWater?"#7DD4F9":"#C9A0FF"}"></span>
          <strong>${esc(item.type)}${item.brand?` · ${esc(item.brand)}`:""}</strong>
        </div>
        ${statusBadge(st.label,st.color)}
      </div>
      <div class="nx-supply-current">
        <div class="nx-kit-overview-label">CURRENT OPEN ${esc((item.unitLabel||"UNIT").toUpperCase())}</div>
        ${activeUnit?`
          <div class="nx-kit-primary-value">${remaining%1===0?remaining:remaining.toFixed(1)} <span>of ${item.unitSize} ${esc(item.unitOfMeasure)} left</span></div>
          <div class="nx-kit-overview-track" role="progressbar" aria-label="Current supply remaining" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%;background:${st.color}"></span></div>
        `:`<div class="nx-kit-primary-value"><span>No ${esc(item.unitLabel)} open</span></div><div class="nx-supply-subtle">${sealedCount} sealed available</div>`}
        ${isBacWater&&activeUnit?.openedDate?`<div class="nx-supply-subtle">Opened ${fmtDate(activeUnit.openedDate)} · use by ${fmtDate(useByDate)}</div>`:""}
        ${forecastLine?`<div class="nx-supply-subtle">${forecastLine}</div>`:""}
      </div>
      <div class="nx-supply-actions">
        ${activeUnit?`<button class="supply-log-use" data-id="${item.id}">Log use</button>`:sealedCount>0?`<button class="supply-activate-next" data-id="${item.id}">Open ${esc(item.unitLabel)}</button>`:`<button class="supply-restock" data-id="${item.id}">Restock</button>`}
        <button class="nx-supply-detail-toggle" type="button" data-id="${item.id}" aria-controls="nx-supply-details-${item.id}" aria-expanded="false">Details <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
      </div>
      <div class="nx-supply-detail-panel" id="nx-supply-details-${item.id}" hidden>
        <div class="nx-kit-history-heading"><span>Inventory overview</span><span>${units.length} total ${esc(item.unitLabel)}${units.length===1?"":"s"}</span></div>
        <div class="nx-kit-stat-list">
          <div><span>Available</span><strong>${(activeUnit?1:0)+sealedCount}</strong></div>
          <div><span>Open</span><strong>${activeUnit?1:0}</strong></div>
          <div><span>Sealed</span><strong>${sealedCount}</strong></div>
          <div><span>Completed</span><strong>${emptyCount}</strong></div>
          <div><span>Pack size</span><strong>${item.unitSize} ${esc(item.unitOfMeasure)} per ${esc(item.unitLabel)}</strong></div>
        </div>
        ${item.notes?`<div class="nx-kit-note"><div class="nx-kit-overview-label">NOTES</div><p>${esc(item.notes)}</p></div>`:""}
        <div class="nx-kit-overview-actions">
          <button class="supply-edit" data-id="${item.id}">Edit details</button>
          <button class="supply-restock" data-id="${item.id}">Restock</button>
        </div>
        <div class="nx-supply-detail-footer"><button class="supply-delete" data-id="${item.id}" aria-label="Delete ${esc(item.type)}" title="Permanently deletes this supply and its history">Delete supply</button></div>
      </div>
    </div>`;
  };

  // One clear add action: within the empty state until inventory exists, then above the list.
  const supplyAddButton = '<button type="button" id="add-equipment" class="nx-supplies-add"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Add supply</span></button>';
  if (!items.length) return '<section class="nx-supplies-empty" aria-labelledby="nx-supplies-empty-title">'+
    '<span class="nx-supplies-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M9 7V4h6v3M4 12h16M11 16h2"/></svg></span>'+
    '<h2 id="nx-supplies-empty-title">Keep your supplies in one place</h2>'+
    '<p>Track BAC water, syringes, wipes and more. Know what you have and when it’s time to restock.</p>'+
    supplyAddButton+'</section>';
  let html = '<div class="nx-supplies-toolbar">'+supplyAddButton+'</div>';
  liveItems.forEach(item=>{ html += renderSupplyCard(item); });
  if (doneItems.length) {
    const open = !!state._showDoneSupplies;
    html += `<button id="toggle-done-supplies" style="width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border-sub);color:var(--t4);font-size:12px;margin-bottom:12px">${open?"▾":"▸"} Completed Inventory (${doneItems.length})</button>`;
    if (open) doneItems.forEach(item=>{ html += renderSupplyCard(item); });
  }
  return html;
}

const EQ_TYPES=["BAC Water","Syringes","Needles","Alcohol Wipes","Sharps Container","Labels / Stickers","Storage Supplies","Other"];
const EQ_DEFAULTS = {
  "BAC Water": {unitLabel:"bottle", unitSize:30, unitOfMeasure:"mL"},
  "Syringes": {unitLabel:"box", unitSize:100, unitOfMeasure:"syringes"},
  "Needles": {unitLabel:"box", unitSize:100, unitOfMeasure:"needles"},
  "Alcohol Wipes": {unitLabel:"pack", unitSize:100, unitOfMeasure:"wipes"},
  "Sharps Container": {unitLabel:"unit", unitSize:1, unitOfMeasure:"units"},
  "Labels / Stickers": {unitLabel:"pack", unitSize:50, unitOfMeasure:"units"},
  "Storage Supplies": {unitLabel:"pack", unitSize:1, unitOfMeasure:"units"},
  "Other": {unitLabel:"unit", unitSize:1, unitOfMeasure:"units"},
};
const EQ_UNIT_LABELS = ["bottle","box","pack","unit"];
const EQ_UOM_OPTIONS = ["mL","syringes","wipes","needles","units"];

function equipmentModal(existing) {
  const isNew = !existing;
  const e = existing ? {...existing} : {id:uid(), type:"BAC Water", brand:"", storageLocation:"fridge", notes:"", ...EQ_DEFAULTS["BAC Water"]};
  const units = e.units||[];
  const activeUnit = units.find(u=>u.status==="active");
  const sealedCount = units.filter(u=>u.status==="sealed").length;
  const emptyCount = units.filter(u=>u.status==="empty").length;
  // Once real history exists (an active unit, completed units, or logged uses), changing
  // unitSize/unitOfMeasure/unitLabel would silently corrupt everything computed from it —
  // remaining amounts, consumption history, forecasting. Lock instead of allowing that.
  const hasHistory = !isNew && (!!activeUnit || emptyCount>0 || (e.usageLog||[]).length>0);
  const lockNote = `<span style="color:var(--t5);font-weight:400"> — locked, this supply already has usage history</span>`;

  openModal(`<div class="nx-equipment-form-heading">${isNew?"Add supply":"Edit supply"}</div>
    <label class="field-label">TYPE</label>
    <select id="eq-type" class="inp" style="margin-bottom:12px">${EQ_TYPES.map(t=>`<option value="${t}" ${e.type===t?"selected":""}>${t}</option>`).join("")}</select>
    <label class="field-label">BRAND / NAME <span style="color:var(--t5);font-weight:400">(optional)</span></label>
    <input id="eq-brand" class="inp" value="${esc(e.brand||"")}" placeholder="e.g. Sterile BAC Water" style="margin-bottom:12px">

    <label class="field-label">UNIT LABEL${hasHistory?lockNote:""}</label>
    <select id="eq-unitlabel" class="inp" style="margin-bottom:12px" ${hasHistory?"disabled":""}>${EQ_UNIT_LABELS.map(l=>`<option value="${l}" ${e.unitLabel===l?"selected":""}>${l}</option>`).join("")}</select>
    <div style="display:flex;gap:10px;margin-bottom:12px">
      <div style="flex:1"><label class="field-label">SIZE PER UNIT${hasHistory?lockNote:""}</label><input id="eq-unitsize" type="number" class="inp" value="${esc(e.unitSize)}" placeholder="e.g. 30" ${hasHistory?"disabled":""}></div>
      <div style="flex:1"><label class="field-label">UNIT OF MEASURE${hasHistory?lockNote:""}</label><select id="eq-uom" class="inp" ${hasHistory?"disabled":""}>${EQ_UOM_OPTIONS.map(u=>`<option value="${u}" ${e.unitOfMeasure===u?"selected":""}>${u}</option>`).join("")}</select></div>
    </div>

    ${isNew?`
    <label class="field-label">QUANTITY OWNED</label>
    <input id="eq-qty" type="number" min="1" class="inp" value="1" style="margin-bottom:12px">
    <label class="field-label">INITIAL STATUS</label>
    <div style="display:flex;gap:8px;margin-bottom:12px">
      ${toggleChip("All sealed / unopened", true, {attrs:'id="eq-status-sealed" class="eq-status-toggle" data-mode="sealed"', fontSize:"12px", padding:"9px 6px"})}
      ${toggleChip("One open, rest sealed", false, {attrs:'id="eq-status-open" class="eq-status-toggle" data-mode="open"', fontSize:"12px", padding:"9px 6px"})}
    </div>
    <div id="eq-open-fields" style="display:none">
      <div style="display:flex;gap:10px;margin-bottom:12px">
        <div style="flex:1"><label class="field-label">OPENED DATE</label><input id="eq-openeddate" type="date" class="inp" value="${localDate()}"></div>
        <div style="flex:1"><label class="field-label">ALREADY USED</label><input id="eq-preused" type="number" step="0.1" class="inp" value="0" placeholder="0"></div>
      </div>
    </div>
    `:`
    <div style="background:var(--surface-2);border-radius:10px;padding:10px 12px;margin-bottom:12px">
      <div style="font-size:11px;color:var(--t4);margin-bottom:8px">${activeUnit?"1 open":"0 open"} · ${sealedCount} sealed · ${emptyCount} completed</div>
      <label class="field-label">SEALED ${(e.unitLabel||"unit").toUpperCase()}S <span style="color:var(--t5);font-weight:400">(raise to add, lower to remove — never touches your active or completed history)</span></label>
      <input id="eq-sealed-count" type="number" min="0" class="inp" value="${sealedCount}">
    </div>
    `}

    <label class="field-label">STORAGE</label>
    <select id="eq-storage" class="inp" style="margin-bottom:12px">${["fridge","freezer","room_temp","unknown"].map(s=>`<option value="${s}" ${(e.storageLocation||"unknown")===s?"selected":""}>${{fridge:"Fridge",freezer:"Freezer",room_temp:"Room temp",unknown:"Unknown"}[s]}</option>`).join("")}</select>
    <label class="field-label">NOTES <span style="color:var(--t5);font-weight:400">(optional)</span></label>
    <textarea id="eq-notes" class="inp" style="min-height:50px;margin-bottom:16px">${esc(e.notes||"")}</textarea>
    <button id="eq-save" class="btn-primary">${isNew?"Add to Supplies":"Save changes"}</button>`);

  document.querySelector("#eq-type").onchange = function() {
    if (hasHistory) return; // locked fields must not shift just because Type changed
    const d = EQ_DEFAULTS[this.value];
    if (d) { document.getElementById("eq-unitsize").value=d.unitSize; document.getElementById("eq-uom").value=d.unitOfMeasure; document.getElementById("eq-unitlabel").value=d.unitLabel; }
  };
  let initialStatusMode = "sealed";
  if (isNew) {
    const setInitialStatus = (mode) => {
      initialStatusMode = mode;
      document.querySelectorAll(".eq-status-toggle").forEach(btn=>{
        const active = btn.dataset.mode===mode;
        btn.style.background = active ? "var(--surface-3)" : "transparent";
        btn.style.borderColor = active ? "var(--border)" : "transparent";
        btn.style.color = active ? "var(--t1)" : "var(--t4)";
      });
      document.getElementById("eq-open-fields").style.display = mode==="open" ? "block" : "none";
    };
    document.getElementById("eq-status-sealed").onclick = () => setInitialStatus("sealed");
    document.getElementById("eq-status-open").onclick = () => setInitialStatus("open");
  }

  document.querySelector("#eq-save").onclick = () => {
    e.type = document.querySelector("#eq-type").value;
    e.brand = document.querySelector("#eq-brand").value.trim();
    if (!hasHistory) {
      e.unitSize = parseFloat(document.querySelector("#eq-unitsize").value)||1;
      e.unitOfMeasure = document.querySelector("#eq-uom").value;
      e.unitLabel = document.querySelector("#eq-unitlabel").value;
    } // else: e already carries the original locked values from the {...existing} copy above
    e.storageLocation = document.querySelector("#eq-storage").value;
    e.notes = document.querySelector("#eq-notes").value.trim();

    if (isNew) {
      const qty = Math.max(1, parseInt(document.querySelector("#eq-qty").value)||1);
      const oneOpen = initialStatusMode==="open";
      const openedDate = oneOpen ? document.getElementById("eq-openeddate").value || localDate() : null;
      const preUsed = oneOpen ? Math.min(e.unitSize, Math.max(0, parseFloat(document.getElementById("eq-preused").value)||0)) : 0;
      e.units = Array.from({length:qty},(_,i)=>({
        id: uid()+i,
        status: (i===0&&oneOpen) ? "active" : "sealed",
        openedDate: (i===0&&oneOpen) ? openedDate : null,
        emptiedDate: null,
        consumed: (i===0&&oneOpen) ? preUsed : 0,
      }));
      e.usageLog = [];
    } else {
      // Quantity editing only ever adds/removes SEALED units — active units and completed
      // (empty) units, and all of their history, are never touched by this control.
      const targetSealed = Math.max(0, parseInt(document.querySelector("#eq-sealed-count").value)||0);
      const sealedUnits = e.units.filter(u=>u.status==="sealed");
      const others = e.units.filter(u=>u.status!=="sealed");
      let newSealed;
      if (targetSealed >= sealedUnits.length) {
        const toAdd = targetSealed - sealedUnits.length;
        newSealed = [...sealedUnits, ...Array.from({length:toAdd},(_,i)=>({ id: uid()+i, status:"sealed", openedDate:null, emptiedDate:null, consumed:0 }))];
      } else {
        newSealed = sealedUnits.slice(0, targetSealed); // removes only from the sealed pool
      }
      e.units = [...others, ...newSealed];
    }
    state.equipmentItems = (state.equipmentItems||[]).filter(x=>x.id!==e.id);
    state.equipmentItems.push(e);
    saveState(); closeModal(); render();
  };
}

function logSupplyUseModal(itemId) {
  const item = (state.equipmentItems||[]).find(x=>x.id===itemId); if (!item) return;
  const activeUnit = (item.units||[]).find(u=>u.status==="active"); if (!activeUnit) return;
  const remaining = Math.max(0, item.unitSize-activeUnit.consumed);
  const m = openModal(`
    <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:6px">Log Use — ${esc(item.type)}</div>
    <div class="hint" style="margin-bottom:14px">${remaining} ${item.unitOfMeasure} left in this ${item.unitLabel}.</div>
    <label class="field-label">AMOUNT USED (${item.unitOfMeasure})</label>
    <input id="su-amount" type="number" step="0.1" class="inp" value="${item.unitOfMeasure==="mL"?"":"1"}" placeholder="${item.unitOfMeasure==="mL"?"e.g. 2":"1"}" style="margin-bottom:6px">
    <div id="su-error" style="color:#ff7c7c;font-size:11px;margin-bottom:10px;display:none"></div>
    <button id="su-save" class="btn-primary" style="background:#7DF9C0;color:#000">Log It</button>
  `, "#7DF9C0");
  m.querySelector("#su-save").onclick = () => {
    const amount = parseFloat(m.querySelector("#su-amount").value);
    const errEl = m.querySelector("#su-error");
    if (!amount || amount<=0) return;
    // Never let a logged amount exceed what's actually left — an oversized entry would both
    // silently overstate real usage in the log (corrupting the forecast average) AND get
    // clamped on the unit separately, so the two numbers would quietly disagree forever.
    if (amount > remaining) {
      errEl.textContent = `Only ${remaining} ${item.unitOfMeasure} remains in this ${item.unitLabel}.`;
      errEl.style.display = "block";
      return;
    }
    if (!item.usageLog) item.usageLog = [];
    item.usageLog.push({ id: uid(), date: localDate(), amount });
    activeUnit.consumed = Math.min(item.unitSize, activeUnit.consumed+amount);
    let justEmptied = false;
    if (activeUnit.consumed >= item.unitSize) {
      activeUnit.status = "empty";
      activeUnit.emptiedDate = localDate();
      justEmptied = true;
    }
    saveState(); closeModal();
    // Render BEFORE showing the confirm prompt — the underlying screen reflects the newly
    // empty unit immediately. If the person declines opening the next one, nothing further
    // needs to happen; there's no stale state left behind because this render already ran.
    render();
    const nextSealed = (item.units||[]).find(u=>u.status==="sealed");
    if (justEmptied && nextSealed) {
      confirmAction(`This ${item.unitLabel} is empty. Open the next one now?`, () => {
        nextSealed.status = "active"; nextSealed.openedDate = localDate();
        saveState(); render();
      }, { confirmLabel: "Open next " + item.unitLabel, cancelLabel: "Not now", tone: "success" });
    }
  };
}

function activateNextSupplyUnit(itemId) {
  const item = (state.equipmentItems||[]).find(x=>x.id===itemId); if (!item) return;
  const next = (item.units||[]).find(u=>u.status==="sealed"); if (!next) return;
  next.status = "active"; next.openedDate = localDate();
  saveState(); render();
}

function restockSupplyModal(itemId) {
  const item = (state.equipmentItems||[]).find(x=>x.id===itemId); if (!item) return;
  const m = openModal(`
    <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:14px">Restock — ${esc(item.type)}</div>
    <label class="field-label">SEALED ${item.unitLabel.toUpperCase()}S TO ADD</label>
    <input id="rs-count" type="number" class="inp" value="1" style="margin-bottom:16px">
    <button id="rs-save" class="btn-primary" style="background:#7DF9C0;color:#000">Add to Inventory</button>
  `, "#7DF9C0");
  m.querySelector("#rs-save").onclick = () => {
    const count = Math.max(1, parseInt(m.querySelector("#rs-count").value)||1);
    if (!item.units) item.units = [];
    for (let i=0;i<count;i++) item.units.push({ id: uid()+i, status:"sealed", openedDate:null, emptiedDate:null, consumed:0 });
    saveState(); closeModal(); render();
  };
}

