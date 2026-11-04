## v0.9.24-beta — final pre-merge scope (2026-11-03)
- User reported physical iPhone acceptance 7/7 Pass for P4 Stash search, supplement reuse/templates, Check-In record protection, keyboard, light/dark, VoiceOver; user explicitly requested deployment. This covers the P4 features before the subsequent small Stash entrypoint fix, not fresh physical acceptance of that fix.
- Additional same-session side quest: primary bottom-tab entry into Stash now starts on Vial kits instead of remembered Other forms/Supplies. Explicit in-screen category selections remain until departure; a saved Other form still opens Other forms. This is transient view state only, no persistent data or inventory impact. Added 8-configuration browser leave/reenter test.
- Release version moved from v0.9.23-beta (previous production baseline) to v0.9.24-beta, including canonical JSON, app title, runtime metadata and three generated note formats; source baseline main 1e518409 and PR #130. Publication remains unverified until actual source-matched Cloudflare deployment.
- Five new-source CI workflows for metadata source a2823b5b: Chromium/build #41775888216 IN PROGRESS at writing; WebKit #41775888249 SUCCESS, mobile #41775888274 SUCCESS, shared writer #41775888287 SUCCESS, nested #41775888218 SUCCESS. Do not claim full candidate QA before Chromium results.
- Release gate: verified full-app DEMO and exact-source LIVE ZIP for v0.9.24-beta; approved GitHub merge then independent Cloudflare 16-file byte parity. No new live nasal dose controls or destructive state changes.

## Final corrected-source CI qualification (2026-11-03; NOT RELEASED)
- Current qualified test/source SHA: `575c419d22982a2a26e608fb202c92cbc9ba4341` (application source remains unchanged since `9ba0c14756c5a02ff6d9ea5f3423c326746f6b1e`).
- GitHub Actions five workflow groups PASS: full Chromium/build #41743566053, WebKit #41743566091, mobile #41743566060, shared writer and real 2-tab #41743566133, nested DS2 #41743566086. Prior failed Chromium #41742486604 retained as historical test-fixture failure, resolved by test-only change to initialize synthetic Retatrutide fixture after boot.
- #41743566053 browser logs: Check-In 8 configurations PASS; 8 Log Dose LIVE/DEMO configurations/256 flows PASS; vial-source 96 assertions PASS; nasal/stock/protocol/Plans protections PASS. Calculator's standalone 14 guard/examples PASS is not independent clinical validation.
- Exact corrected-source artifact #13283570424: 548-entry outer archive CRC PASS, 26-file root LIVE ZIP CRC PASS, source manifest matches 575c419d, isolated full-app DEMO and offline index byte-equal, 8 Chromium 320/390 light/dark LIVE/DEMO PASS. Full original release packages, not feature-only mockups.
- Retained gates: manual physical iPhone and VoiceOver/keyboard acceptance NOT TESTED, next release version unassigned, no user approval to merge or deploy; production unaffected.

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
