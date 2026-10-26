"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const seven=fs.readFileSync("assets/js/07-nexus.js","utf8");
const eight=fs.readFileSync("assets/js/08-nexus.js","utf8");
const twelve=fs.readFileSync("assets/js/12-nexus.js","utf8");
const disclosureCss=fs.readFileSync("assets/css/nexus-disclosures.css","utf8");
const hybridCss=fs.readFileSync("assets/css/nexus-hybrid-preview.css","utf8");
for(const [name,code] of [["07",seven],["08",eight],["12",twelve]]) {
 new vm.Script(code,{filename:"assets/js/"+name+"-nexus.js"});
}
const tests={
 "compact explicitly labelled disclosure": seven.includes('nxTodayDisclosureInner(false)') && seven.includes('aria-label="View details for'),
 "expanded explicitly labelled disclosure": eight.includes('nxTodayDisclosureInner(true)') && eight.includes('compound-collapse-btn nx-today-disclosure'),
 "same compound casing": eight.includes('nx-today-compound-name') && seven.includes('nx-today-compound-name') && !eight.includes('${esc(name.toUpperCase())}</span>'),
 "same disclosure renderer": seven.includes('function nxTodayDisclosureInner(expanded)') && eight.includes('nxTodayDisclosureInner(true)'),
 "paused compact shares disclosure": seven.includes('class="card nx-compound-card" style="padding:14px 16px') && seven.includes('nxTodayDisclosureInner(false)'),
 "matching title typography hook": seven.includes('class="nx-today-compound-name"') && eight.includes('nx-expanded-name nx-today-compound-name'),
 "no repeated expanded overdue badge": !eight.includes('od?statusBadge("Overdue"'),
 "overdue action opens resolution": seven.includes('class="whathappened') && twelve.includes('resolveOverdueModal(b.dataset.name'),
 "existing log dose handler remains": twelve.includes('document.querySelectorAll(".logdose")'),
 "occurrence retains its identity": eight.includes('data-occ-time="${esc(s.dateTime)}"'),
 "multi-occurrence actions labelled": eight.includes('nx-today-slot-actions') && eight.includes('>Reschedule</button>') && eight.includes('>Skip</button>'),
 "completed action state": seven.includes('class="nx-today-completion-status"') && seven.includes('Dose completed') && !eight.includes('class="nx-compound-completed"'),
 "no duplicate compact History action": !seven.includes('nx-open-compound-history nx-compound-secondary'),
 "separate information sections": ["nx-info-insights","nx-info-history","nx-info-details"].every(c=>eight.includes(c)),
 "no repeated obsolete help": !eight.includes("Tap a dose to see what happened after it"),
 "evidence-based insight snapshot": eight.includes("nx-insight-summary") && eight.includes("days since your last entry"),
 "Intel explicit action": eight.includes("nx-intel-cta") && eight.includes("Open compound Intel"),
 "site history remains visible": eight.includes("siteWarn.countInLast5"),
 "no globally generated duplicate chevron": disclosureCss.includes(".compound-collapse-btn:not(.nx-today-disclosure))::after") && !disclosureCss.includes("body #app .compound-collapse-btn::after{"),
 "compact facts intentionally unruled": /\.nx-compound-card \.nx-card-facts\s*\{[^}]*border:0!important/.test(hybridCss) && !hybridCss.includes("padding:15px 0 13px!important;border-top:1px solid var(--border-sub)!important"),
 "compact actions no separator": /\.nx-compound-card \.nx-compound-actions\s*\{[^}]*border-top:0!important/.test(hybridCss),
 "insight container has no border": hybridCss.includes("border:0;border-radius:0;background:transparent;box-shadow:none;"),
 "insight observations have no divider": !hybridCss.includes("border-bottom:1px solid var(--border-sub)!important;border-radius:0!important"),
 "one svg chevron shared": seven.includes('nx-today-disclosure-icon') && eight.includes('nxTodayDisclosureInner(true)'),
 "no speculative phase countdown": !eight.includes("days remaining in phase"),
 "logging pattern in insights": eight.includes("Logging time pattern"),
 "review stats in details": eight.includes("Since last recorded dose"),
};
Object.entries(tests).forEach(([k,pass])=>{console.log((pass?"PASS":"FAIL")+": "+k);assert.ok(pass,k)});
console.log("Source-level card invariants passed. Browser and inventory behavior require separate validation.");
