# Nexus Priority 4 — PR #130 release-candidate notes
Date: 2026-11-03 | Status: DRAFT, NOT RELEASED

## Version and source
- Candidate built from production source v0.9.23-beta (main `1e51840959cd21de01f6e1a48152a486850317fe`). A distinct next release version has not yet been authorized or finalized; current candidate ZIP retains v0.9.23-beta in its build filename.
- Application and focused-test source `9ba0c14756c5a02ff6d9ea5f3423c326746f6b1e`; draft PR #130, branch `feature/p4-stash-search-supplement-repeat-20261103`. Subsequent documentation-only commits are not the app source tested here.

## What changed / affected screens
- Stash: query Vial kits, Other forms and Supplies without changing filtering, ordering or inventory. Separate messages distinguish no matches from empty inventory. Search is ephemeral UI state, not a persisted user field.
- Daily Check-In and standalone Supplements modal: Use previous day (strictly earlier dated supplement log), My templates, Save as template. Selection is draft-only until Save Check-In or Save supplements is explicitly confirmed.
- Templates are opt-in named supplement groups stored as optional `state.settings.supplementTemplates`; saved entries can be applied, renamed or deleted. Deleting a template does not delete past check-ins or supplement history.
- Responsive 44–48px actions and focus styles for 320px and 390px, light and dark themes.

## Data integrity and risk
- Production storage key remains `peptide-tracker-html-v1`; no personal data accessed, no destructive migration, no automatic logging.
- Existing supplementLogs, dailyLogs, history, mood/notes/symptoms, protocols, exact inventory vial IDs, calculated balances, backup/restore and date-specific entries must remain intact.
- Template settings writes use `nexusCommitScopedStateChange` with duplicate/name/count validation and exclusive readback; stale/conflicting/failed saves must not appear as completed. Nasal prepared-dose administration and generic transfers remain gated OFF.
- Existing production v0.9.23-beta and Cloudflare deployment are NOT changed by this PR.

## Verified evidence
- Focused `tests/p4-supplement-reuse.test.cjs` executes in shared writer CI and reports PASS, including rename/delete, rejected and failed writes, unchanged supplement history.
- GitHub Actions source `9ba0c147`: shared writer #41742486753 SUCCESS; mobile #41742486815 SUCCESS; nested #41742486845 SUCCESS; WebKit #41742486586 SUCCESS; full build/Chromium #41742486604 pending final result at note creation.
- Downloaded exact-head shared-writer release artifact #13281293279: outer ZIP CRC pass; 26-file LIVE ZIP CRC pass; offline DEMO index byte-equal to standalone full-app DEMO; direct GitHub blob parity for 5 code/index files PASS.
- Independent local Chromium set-content fictional demo interactions: Stash query across 3 categories, previous-day reuse, create/apply/rename/delete template, no inventory/history mutation, no horizontal overflow at 320/390 light/dark. Direct Daily Check-In date change availability and one-per-day save tested.
- Automated browser tests are NOT real iPhone, Safari/VoiceOver or comprehensive manual UI acceptance.

## Incomplete / release gates
- Physical iPhone/VoiceOver UAT NOT TESTED; no approval for merge or deployment.
- Full candidate-specific Chromium build final status requires final GitHub job check. Candidate packaging is source-exact but release versioning is not finalized.
- Release status: PROPOSED → CODED → PARTIALLY TESTED → DRAFT PR #130 → NOT MERGED → NOT DEPLOYED → NOT PHYSICAL IPHONE ACCEPTED.

## Next action
Review the final full build/Chromium result and artifact, then provide complete user-facing source-matched FULL APP DEMO and LIVE ZIP for physical iPhone acceptance. Keep PR draft, no merge or Cloudflare deploy without explicit approval.
