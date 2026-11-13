# PR162 — Real iPhone Stash card source-selection regression (2026-11-12)

## User physical iPhone evidence
Targeted fictional full-app QA edition, prior source 18f7aff4. Screenshot Two Open Vials QA displays status Empty and main OPEN VIAL balance 0mg of 10mg despite Details > Vials displaying Vial 1 Open 0mg and Vial 2 Open 8mg. Expiry says 25d and follows newer usable vial. User: Zero-balance Open QA PASS; Two Open Vials QA FAIL. This is a fictional demo failure, not confirmation of production failing.

## Root cause and fix
Production JS10 card uses getActiveVial(s) first historical open, even if depleted; expiry and status helper were separately patched to select usable open. Commit 12dc34d1 updates card's non-blend selection: first OPEN/ACTIVE with canonical getVialRemainingMg(s,v)>0, else old getActiveVial(s). Blend source logic unchanged. No storage schema, vial ID, ledger, history or personal inventory changes.
Tests updated through bc3159a3 with runtime extraction and VM assertions of card selector. PASS local Node VM actual patched JS10: 0mg first+8mg second selects 8mg, zero-only fallback unchanged, blend selection unchanged. Exact patched JS10 git blob 19486960826cb346df38f490f25ef6f8b709594b confirmed against GitHub. LOCAL isolated full-app QA fixture, offline DEMO ZIP byte-equal to standalone, 26-file LIVE ZIP CRC PASS. These are supplemental candidate files, not official GitHub artifacts. Local Playwright browser engines unavailable, so local rendered browser test BLOCKED. GitHub 6-suite CI on bc3159a3 launched, final outcome pending.

## Remaining gates
Recheck GitHub exact-head CI and official release-source artifact, then user physical iPhone retest on new isolated full-app QA edition. Do NOT transfer earlier iPhone PASS to new card patch. Main b4c83c06; PR160 remains independently draft 006dc03a; PR162 draft/unmerged. No merge/deploy or production data writes without approval.
