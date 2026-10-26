"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const seven=fs.readFileSync("assets/js/07-nexus.js","utf8");
const eight=fs.readFileSync("assets/js/08-nexus.js","utf8");
const twelve=fs.readFileSync("assets/js/12-nexus.js","utf8");
for(const [name,code] of [["07",seven],["08",eight],["12",twelve]]) {
 new vm.Script(code,{filename:"assets/js/"+name+"-nexus.js"});
}
const tests={
 "compact explicitly labelled disclosure": seven.includes('nx-compact-disclosure-label">View details') && seven.includes('aria-label="View details for'),
 "expanded explicitly labelled disclosure": eight.includes('>Hide details</button>'),
 "same compound casing": eight.includes('${esc(name)}</span>') && !eight.includes('${esc(name.toUpperCase())}</span>'),
 "no repeated expanded overdue badge": !eight.includes('od?statusBadge("Overdue"'),
 "overdue action opens resolution": seven.includes('class="whathappened') && twelve.includes('resolveOverdueModal(b.dataset.name'),
 "existing log dose handler remains": twelve.includes('document.querySelectorAll(".logdose")'),
 "occurrence retains its identity": eight.includes('data-occ-time="${esc(s.dateTime)}"'),
 "multi-occurrence actions labelled": eight.includes('nx-today-slot-actions') && eight.includes('>Reschedule</button>') && eight.includes('>Skip</button>'),
 "completed-day notice": eight.includes('Taken today'),
 "no duplicate compact History action": !seven.includes('nx-open-compound-history nx-compound-secondary'),
 "separate information sections": ["nx-info-insights","nx-info-history","nx-info-details"].every(c=>eight.includes(c)),
 "no repeated obsolete help": !eight.includes("Tap a dose to see what happened after it"),
 "logging pattern in insights": eight.includes("Logging time pattern"),
 "review stats in details": eight.includes("Since last recorded dose"),
};
Object.entries(tests).forEach(([k,pass])=>{console.log((pass?"PASS":"FAIL")+": "+k);assert.ok(pass,k)});
console.log("Source-level card invariants passed. Browser and inventory behavior require separate validation.");
