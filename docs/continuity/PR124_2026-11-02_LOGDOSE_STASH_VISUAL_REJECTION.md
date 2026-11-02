# PR #124 — November 2 user screenshot rejection, dose-site and Stash restoration
**Status:** draft implementation, no production release. Main baseline da585ab3, branch feature/dose-administration-method-20261029.

## User-observed failures (physical screenshot; not accepted)
1. **#15 Log Dose Additional dose options:** typography/size/weight/colour visibly not cohesive with the rest of Log Dose. Preserve all checkbox and dose behaviour; do not substitute helper prose for visual consistency.
2. **SubQ/IM sites:** mid-abdomen choices previously present were omitted; site options redundantly display route suffixes '(SubQ)' and '(IM)' even though method is selected.
3. **Stash mixed injectable/nasal kit:** compact card lost familiar OPEN VIAL label, per-vial 'X mg of Y mg remaining', progress indicator, and regular status semantics. The dense three-row physical stock breakdown on compact card was not approved. User wants the original card preserved, with only a subtle nasal balance line; detailed physical-source accounting belongs in expanded Details.

## Targeted code on draft branch (not physical accepted)
- assets/js/05-nexus.js: added 'Abdomen — mid-left/right'; display-only nexusAdminSiteLabel removes route suffix while keeping old option values, historical dose data and route eligibility intact; removed unrequested helper paragraph.
- assets/css/nexus-hybrid-preview.css: scoped Additional dose options and preferences typography to same 14px/500, theme primary, inherited font as neighbouring Log Dose form; slimmed preference row. Scoped secondary nasal compact summary to a simple line with no additional container.
- assets/js/10-nexus.js: restored OPEN VIAL, a single identified injectable current-vial mg/total and its progressbar for mixed kits, retaining separate injectable and nasal source accounting. Nasal source/prepared balances shown on one supporting line; expanded Overview contains exact separate injectable mg, nasal source mg and prepared bottle mg/mL. Preserves original vial IDs and balances, and regular active kit badge behaviour.
- Tests: tools/validate-logdose-ui.mjs compares computed font/size/weight/colour to neighbouring controls and checks display-only method site names; tools/validate-stash-cards.mjs requires preserved compact card, 70% example single-source progress, and exact unchanged 7/3/2 mg fixture accounting.

## Blockers and next action
Exact-source five-workflow Chromium, WebKit, mobile, nested, writer CI and screenshots must pass on final branch commit. Confirm no 320/390 light/dark clipping and that isolated full-app DEMO, LIVE ZIP and manifest match exactly. Physical iPhone acceptance for #15 and Stash remains FAIL/pending device retest. Preserve all original 16 items and 19-item supplemental checklist; no score may be marked physical PASS from green CI alone.
Do not merge/deploy or enable either LIVE nasal feature gate; release P0 remains BLOCKING. No storage migration or production user-data writes.
