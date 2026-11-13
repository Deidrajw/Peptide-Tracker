# PR162 — Depleted Open Vial Expiry Edge Case, 2026-11-12

**Scope:** targeted no-migration source fix in assets/js/10-nexus.js + production-function regression in tests/stash-open-vial-expiry.test.cjs. Main b4c83c06. App commit d8dd615d; test commit 18f7aff4. Draft PR162 only; PR160 remains separate, unmerged. No production merge/deploy or personal inventory access.

## Original reproduction (FAIL)
Extracted *actual production* functions stashExpiryMs and computeKitStatus from verified PR162 prepatch LIVE zip JS10 blob f20c4c90. Node v22 local isolated JS VM with fictional vials, no production data:
- Sealed-only kit -> no expiry, PASS.
- Zero-remaining historical open vial with stale reconDate + sealed stock -> computed old expiry date, FAIL: null expected.
- Zero-remaining historical open vial + usable newer open vial -> old expiry wins, FAIL: newer usable vial should determine date. Status additionally incorrectly Empty because getActiveVial returns first depleted vial.
- Single usable open vial -> future expiry, PASS.
Original assertion exited nonzero: -30 !== null. This is an actual source-level reproducible issue, not user-observed production failure.

## Targeted source fix (PR162 ONLY)
- stashExpiryMs now requires Number(getVialRemainingMg(s,v))>0 for open/active vial candidates, aligning expiry-card and status sorting with existing reminder filter.
- computeKitStatus prefers an open/active vial with positive balance, then falls back to getActiveVial to retain empty status where *no* usable open vial exists.
- No mutation of vial IDs, dose ledger, stock amounts, localStorage schema, protocols, or migrations. Preserve PR160 draft; no automatic integration.

## Source-level retest (PASS with qualification)
Node VM against patched JS10 code, syntactic node --check PASS:
- Sealed-only no expiry: PASS.
- Zero-remaining open plus sealed-only: expiryDaysLeft null, PASS; status Empty remains expected for stale open + no usable open, not a failed empty count.
- Zero-remaining old open plus newer usable open: expiryDaysLeft 27 (test run on 2026-11-12), status Healthy, PASS. Note date/time relative, do not rely on a fixed day count across test dates.
- Single usable open: future expiry, status Healthy, PASS.
- JS10 patched blob independently checked against GitHub contents API SHA c00cdd5217306bfa2b44c404e892857df9d7446d using git hash-object on local extracted/modified full LIVE JS.
- Added five focused assertions to tests/stash-open-vial-expiry.test.cjs; GitHub CI will be authoritative for new branch tests.

## Artifact and browser status
- An isolated full-app demo edition with fictional fixtures was rebuilt from previous official target QA DEMO with *exact patch bytes*; accompanying offline HTML zip index byte-equal/CRC PASS. Supplemental 26-file LIVE ZIP was rebuilt from previously verified full source with updated JS10, and ZIP CRC PASS. These are LOCAL QA copies only, **not** official GitHub source-validated release artifacts.
- Local Playwright Chromium navigation returned net::ERR_BLOCKED_BY_ADMINISTRATOR (both file:// and localhost). Browser UI test in this session BLOCKED, not Pass. GitHub six-suite workflows triggered at commit 18f7aff4; results must be rechecked.
- Real iPhone postpatch NOT TESTED. Earlier corrected iPhone Stash 2/2 PASS applies to prepatch candidate only; earlier protocol/Calendar 4/4 PASS also from older candidate.
- Exact-head release readiness is NOT established. Official full-app build and all GitHub automated gates must complete; physical validation or explicit acceptance decision should account for the new change.

**ONE NEXT ACTION:** retrieve and inspect six GitHub Actions results and new official artifact for exact patched app SHA. Do not merge/deploy without explicit user authorization.
