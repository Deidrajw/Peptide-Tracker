const assert=require("node:assert/strict");
const fs=require("node:fs");
const stash=fs.readFileSync("assets/js/09-nexus.js","utf8");
const settings=fs.readFileSync("assets/js/11-nexus.js","utf8");
const modal=stash.slice(stash.indexOf("function markKitDoneModal("),stash.indexOf("// Exclusive exact-vial physical outflow."));
assert(modal.includes('id="done-impact"'),"Retirement summary must be visible");
assert(modal.includes('id="done-partial-outflow"'),"Partial-outflow alternative must be available");
assert(!modal.includes('id="leftover-mg"'),"Do not force users to retype known stock");
assert(modal.includes("const declaredMg=remainingMg"),"Canonical mass reviewed without duplicate entry");
assert(modal.includes('if(s.isBlend)blendLogOutflowModal(s.id)'),"Blend routes to blend-specific outflow");
assert(modal.includes('else logWasteModal(s.id)'),"Standard kit routes to normal outflow");
assert(modal.includes('reasons.filter(r=>remainingMg===0||r.key!=="used_up")'),
  "Do not offer incompatible completion reason");
assert(modal.includes('await writer.transaction(saved,snapshot=>planExclusiveMarkKitDone(snapshot,input))'),
  "Streamlined UI must retain exclusive safety transaction");
const detail=settings.slice(settings.indexOf("function renderSettingsDetailScreen("),
  settings.indexOf("function renderPhaseRemindersDetail("));
assert(detail.includes('id="settings-detail-back"'),"Preserve navigation ID");
assert(detail.includes('aria-label="Back to settings"'),"Preserve accessible back label");
assert(detail.includes('min-width:44px;min-height:44px'),"Preserve accessible tap target");
assert(detail.includes('<svg width="20" height="20"')&&detail.includes('<path d="m15 18-6-6 6-6"/>'),
  "Settings back uses consistent outline chevron");
assert(!detail.includes('cursor:pointer">‹</button>'),"No font-dependent chevron");
console.log("PASS: streamlined whole-kit retirement, accessible partial route, and Settings child chevron ownership");
