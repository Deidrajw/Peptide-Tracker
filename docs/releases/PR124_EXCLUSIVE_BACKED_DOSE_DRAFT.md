# Nexus PR #124 — Draft release notes (NOT RELEASED)

Status: PROPOSED / CODED CANDIDATE; PR #124 draft and unmerged. Version remains existing main v0.9.20-beta; no new published version assigned.

## User-facing candidate
- 3×2 administration method selector with detailed native site dropdown and method-scoped source eligibility.
- Stash kit-first Add Kit product form chooser: Vials, Capsules, Raw Powder, Topical and purchased Nasal Spray, retaining legacy identity.
- Fresh physical Log Dose stores exact-vial deduction and history under a single exclusive browser transaction, with event-specific Undo and a guarded most recent single-vial edit path.
- Untracked doses and guarded writer behave separately with no stock debit; prepared-stock routes remain disabled.

## Data impact
- No destructive migration or automatic reclassification of legacy vials. Existing saved records must be protected. Additive nexusDoseAudit on successful new correction/Undo only. No live production user data changed by this draft work.

## Evidence and limitations
- Prior real Chromium two-tab fresh dose collision PASS on #41230450954, but full browser job FAILED legacy test fixture. Node dedicated writer tests for latest single-source edit/Undo PASS on #41230950876. Latest browser/actual two-tab edit-vs-undo, source-matched LIVE/DEMO, WebKit/mobile/visual and physical iPhone acceptance PENDING exact-head CI.
- Historical multi-vial, prepared, blend, missing/ambiguous original source corrections intentionally blocked in new exclusive route.
- No merge, no deploy, no primary host source-parity verification. Prepared transfer controls OFF. Real iPhone Safari/VoiceOver acceptance NOT TESTED.


## Follow-up: exact-source multi-kit Log Dose
- Additional-vial allocation now must name the actual open vial ID; when more than one candidate exists, save remains blocked pending explicit selection. Runtime ecad706c, browser metadata assertions c7d9477b/c4c64d7d. No historical records altered or automatic fallback added. Full exact-head browser/WebKit CI pending at checkpoint.


## Candidate QA and exact-source artifact checkpoint (2026-10-31)
- Five workflows SUCCESS at 653beee2, including full run #41232054165; Log Dose browser 176 flows/8 matrices PASS. Independently downloaded #13054077913 and proved 26/26 LIVE files Git blob parity against PR head, offline/standalone DEMO HTML equality, ZIP integrity and no external runtime assets. Real iPhone remains NOT TESTED.
- Correct manifest source_commit metadata to head SHA (09acddcd), not GitHub's synthetic PR merge SHA. Follow-up CI and refreshed package pending. PR draft/unmerged; no deployment, no user-data migration, no prepared-transfer activation. Candidate version remains v0.9.20-beta until separate approved release revision.


## Verified candidate artifact record — 2026-10-31 (UNMERGED)
- **Source SHA:** 6e3a00f39c490455bf402a31e39f311cd5262cbc; **CI run:** 41242891963 SUCCESS; five corresponding workflows SUCCESS. Artifact ID 13057674228 (Nexus-release-artifacts). Manifest records PR head SHA, not synthetic merge ref; 26/26 LIVE package Git blob hashes match source; ZIP CRC valid and offline DEMO index.html matches standalone HTML. Browser QA includes 176 Log Dose checks, real cross-tab stale Undo protection, false-save warning, 320/390 both themes, 80/80 measurement-math DIAGNOSTIC (not approval of untested clinical calculations). Demo is complete, fictional, in-memory, network blocked.
- **Screens:** Today/Log Dose, Stash/Kit choice, dose edit/undo, Administration method/site and source picker; protected Calendar, Plans, More, daily Check-In, supplements, calculator and histories exercised in CI. **Data impact:** additive audit on corrections; safe exact-vial reconciliation; no old record rewrite/migration. Prepared transfer/nasal feature gates OFF.
- **Limitations:** newest backed physical dose latest one-vial only edit/undo; ambiguous historical or multi-vial corrections fail closed, real iPhone/VoiceOver and production parity not yet tested. Release status CODED + AUTOMATED TESTED + SOURCE-QUALIFIED CANDIDATE; PR DRAFT, UNMERGED, UNDEPLOYED.


## Stash user-feedback refinement (2026-10-31), UNRELEASED
- Three reported UI defects fixed as development candidate: oversize Stash kits tightened; nasal/capsule/raw/topical stock moved from mixed large kit-card display into new compact Other forms segment (with Vial kits and Supplies segments); non-vial compound input aligned to Vials' five visible suggestions plus View all browser. Saved formulation IDs, vial stock and history unchanged. No data migration or transfer feature; no new dosing features. 320/390, light/dark CI underway for newest code. Device Safari/VoiceOver acceptance and exact-source artifacts still pending; no production deploy/merge authorization.


## 2026-10-31 — Focused Stash UI redesign qualification
- **Code tested:** 3848c87d078fd763800265020fce1840877b57cd. Full #41249830807 plus writer/mobile/WebKit/DS2 four companion workflows all SUCCESS. Test includes 8 fictional LIVE/DEMO 320/390 light/dark formulation picker/category cases and protected Stash/Log Dose regressions. Artifact #13060877682 inspected, matching manifest/source, 26 LIVE files, offline DEMO matches full standalone; zero live sync and ephemeral storage.
- **User priorities delivered in candidate:** smaller Stash kit cards, consistent five-option + View all compound picker across non-vial forms, separate Vial kits/Other forms/Supplies with compact non-vial stock rows. Supersedes inline mixed stock-card layout. **Limitations:** physical iPhone user acceptance pending, no production/source parity, no merge/deploy/transfer activation; version unchanged v0.9.20-beta.
