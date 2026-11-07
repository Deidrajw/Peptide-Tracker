/* Fictional-only regression: a recorded dose remains visible even if its compound is paused. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const today=fs.readFileSync("assets/js/10-nexus.js","utf8");
const cards=fs.readFileSync("assets/js/07-nexus.js","utf8");
const calendar=fs.readFileSync("assets/js/08-nexus.js","utf8");
assert.ok(today.includes('const recordedInactiveToday=Object.entries(aps).filter(e=>'),
  "Today must consider logged inactive/paused compounds separately");
assert.ok(today.includes('!isActive(e)&&(e[1].doses||[]).some(d=>doseDayFor(e[1],d)===today)'),
  "Inactive/paused visibility must require an actual dose on the selected day");
assert.ok(today.includes('const visibleToday=started.concat(recordedInactiveToday);'),
  "Logged inactive records must supplement normal active-card list");
assert.ok(today.includes('renderTodayCompoundSection(visibleToday)')&&
  today.includes('renderCompletedFullView(visibleToday)'),
  "Today and Completed must share corrected visible compound collection");
assert.ok(today.includes('const todaySlots = [...started, ...firstDoseCandidates]'),
  "Visibility correction must not silently schedule paused compounds");
assert.ok(today.includes('additionalRecordedCount=recordedInactiveToday.reduce(')&&
  today.includes('nx-today-offschedule-history'),
  "Additional logged records must be explained outside active-schedule progress");
assert.ok(cards.includes('if (recordedToday && d.status!=="active") completed.push(pair);'),
  "Inactive recorded doses cannot be classified as due/new future actions");
assert.ok(cards.includes('if (status === "paused" && !((view==="today"||view==="completed")&&hasRecordedDoseToday))'),
  "Paused saved-dose card must use the normal completed card rather than the resume-only card");
assert.ok(calendar.includes('const recordedDoses=Object.entries(aps).flatMap('),
  "Calendar day detail must use every compound dose record, not active-only");
assert.ok(calendar.includes('const allDoses=Object.entries(aps).flatMap('),
  "Calendar monthly actual dots must include every recorded dose");
const sample={
  'Example Active':{status:'active',doses:[{date:'2026-11-05T09:00',dose:'150'}]},
  'Example Paused':{status:'paused',doses:[{date:'2026-11-05T11:24',dose:'150'}]},
  'Example Archived':{status:'archived',doses:[{date:'2026-11-05T10:00',dose:'100'}]},
  'Example Old Paused':{status:'paused',doses:[{date:'2026-11-04T09:00',dose:'150'}]}
};
const current='2026-11-05';
const recordedInactive=Object.entries(sample).filter(([,d])=>d.status!=='active'&&d.doses.some(x=>x.date.slice(0,10)===current));
assert.deepEqual(recordedInactive.map(([n])=>n),['Example Paused','Example Archived']);
assert.equal(Object.entries(sample).filter(([,d])=>d.status==='active').length,1,
  "Historical visibility must not alter active schedule count");
console.log("PASS: fictional paused/archived recorded-dose visibility, active schedule unchanged, Calendar includes all actual logs");
