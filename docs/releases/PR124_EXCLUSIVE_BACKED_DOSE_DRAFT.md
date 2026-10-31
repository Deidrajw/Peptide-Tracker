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
