## 2026-10-31 — P-11 immediate correction: physical form versus dose method
- One next implementation priority: distinguish physical product FORM (Injectable/Nasal/Oral/Topical/Other) from per-entry administration METHOD (SubQ/IM/IV), include multi-form source choice, no-protocol stocked compounds in picker, protected native units/historical vial IDs, fail-closed exact-source writer, and cross-tab safety. Preserve past user data and do not silently migrate.
- Then, as separate focused fixes: DS2 button parity with Supplies, Log Dose content hierarchy and checkbox consistency, numeric vial ordering, better nasal planning explanation without pretending to create prepared stock. New iPhone defects recorded in REGRESSION and existing Playbook governs guided testing.

## 2026-10-31 — Compound library breadth (PR124 DRAFT / NOT RELEASED)
- Added 53 named records to curated library (49 existing → 102 total), including 14 bioregulators and SLU-PP-332 non-peptide research entry. Names from user workbook, with independent references where verified and explicit review-pending provenance otherwise. See docs/product/NEXUS_LIBRARY_EXPANSION_2026-10-31.md.
- Preserve custom Add Compound action for unknown names, existing IDs/storage and data. Never auto-fill doses, routes or inventory conversions from supplier claims.
- Open follow-up: searchable aliases (Epitalon/Epithalon, vendor spelling variants) without creating duplicate chemical identities; additional vendor-product/blend classification; IU or non-mg potency products need proper unit-specific inventory representation before being treated as vial mass.
- Exact-source full browser and WebKit QA, complete LIVE/isolated DEMO package review and physical iPhone acceptance required. No merge or deploy approval; existing PR124 cross-tab safety P0 stays open.
- One next priority: confirm corrected custom picker + 102-entry catalogue CI, fix errors and inspect current-source demo.

## 2026-10-31 — NEW USER IDEA P-14: Pause all protocols (BACKLOG / DISCOVERY ONLY)
- **Request:** one convenient global action to temporarily pause every active protocol, with a corresponding Resume All action. Capture as a potential feature; this is NOT approval to implement during PR124 or change existing saved schedules.
- **Suggested UX default for later review:** a single "Pause all protocols" command with clear confirmation, an obvious paused indicator, and "Resume all" available without navigating into every protocol. Explain whether this pauses reminders, due/overdue status and adherence calculations; do not silently delete or mark doses missed. Individual protocol pause states, already completed/ended protocols, future phase dates and PRN entries must be preserved or handled explicitly.
- **Open product decisions:** pause only currently active protocols vs every future schedule; how to distinguish protocols already individually paused before global pause; whether phase dates shift or remain fixed; whether actual doses can still be logged during pause; whether global resume restores the prior per-protocol states. Default recommendation: reversible global overlay preserving prior states; never rewrite past logs, dates or inventory, and offer per-protocol exceptions only after design review.
- **Acceptance before build:** preview iPhone Today/Plans/global controls and confirmation/restart states; test one/multiple active, individually paused, completed, future and PRN protocols; midnight/timezone rollovers, reminders, history, data export/import and rollback. Keep separate from PR124 release blockers and do not implement/deploy without scope approval.

## 2026-10-30 — P-11/12/13 integration progress (CODED; NOT RELEASED)
- P-11 unified use setup: coded on draft PR124 with Injectable/SubQ/IM and Nasal/Topical/Oral/Other, remembered setup choice and exact matching physical vial when available; current model is one preference per compound name, not simultaneous multiple forms. Parallel forms are INCOMPLETE.
- P-12 user-selectable dose units: mg/mcg selector with roundtrip into existing canonical unit and entered unit metadata; IU remains guarded to already IU-native product and has no invented stock conversion. Built-in nasal spray-count path and full prepared-form dose integration still require separate verification.
- P-13 compact Stash: reduced card padding, header and primary stock type, use setup summary/action, preserved expanded Vials/History and kit actions. 320/390 and physical iPhone acceptance NOT YET COMPLETE.
- Tracking mode approved and coded: setup once inventory-backed or untracked with no debit; reactive/protocol followups preserved. GitHub CI pending full source acceptance; no production migration, merge or deployment. Next: verify exact-head full browser and artifacts, test critical prepared/form and device paths before acceptance.

## 2026-10-30 — P-11 decision: BOTH tracking modes approved
- Setup-level choice **Inventory-backed** (verified exact source, appropriate debit and history) or **Track only / no inventory** (explicitly untracked administrations, zero stock mutation). Choice persists per compound/use configuration and is not repeatedly asked on every dose. Mode can be deliberately changed later for future logs, not retroactively. No silent fallback when a source fails; never fabricate a source or create prepared stock from a plan. Unit preference (mg/mcg/conditional IU) and compact Stash remain linked P-12/P-13. Product decision approved; code/schema migration NOT implemented or authorized. Mandatory tests: both onboarding paths, remembered defaults, unavailable-stock transition, mode switching, exports/histories, no hidden debits, multiple use configurations.

## 2026-10-30 — Reaffirmed linked UX priorities (DESIGN PENDING)
- P-11: Unified first-time use setup. Top-level modes Injectable (SubQ/IM secondary detail), Nasal, Topical, Oral, Other. Preserve historical precision and distinct physical-versus-prepared stock.
- P-12: User-selectable dose units, including mg/mcg and IU when meaningfully defined. Keep delivery measures separate, do not invent conversions, retain original values and normalized mass where safe. Requires complete unit-switch, persistence and calculation tests.
- P-13: Compact DS2 Stash cards with essential quantity/status, clear disclosure, ellipsis for secondary actions and protected details/records. Do not drop this priority because source-selection work is ongoing.
- Product review must consider the whole onboarding/setup → routine logging → stock/history experience for first-time and returning users, not merely patch one reported defect. These are user directions, NOT completed implementation. Preview integrated design before schema changes; no merge/deploy approval.

# Nexus — Multi-Sprint Product Roadmap (Persistent)
**Created:** 2026-10-27 | **Authority:** user direction, continuity logs, current GitHub source. **Status:** reconstructed roadmap INDEX, not a claim that all historical plans were recovered verbatim.

## Principle
A sprint is not the whole product roadmap. Preserve ALL user-approved directions independently of the latest code task, and maintain stable IDs, approval state, implementation state, tests, acceptance and release status. Never silently drop a future project because the current sprint shifted.

## Workstreams explicitly reaffirmed by the user
| Roadmap lane | Scope | Status |
|---|---|---|
| P-01 Design System 2.0 | Hybrid Soft Depth + Porcelain + Obsidian visual language across **all screens, subpages, sheets and states**, not just Today/Stash/Calendar; see DS2_SCREEN_COVERAGE.md | ACTIVE, NOT FINISHED |
| P-02 Core workflow design | Review end-to-end capture → plan/schedule → log dose → reaction/check-in → trends/history → stash and restore, minimize friction and missed context | LONG-TERM ROADMAP; details require reconciliation with historical docs, not assumed approved in full |
| P-03 Onboarding | Public-app welcome, consent/informational safeguards, optional tour, first-run setup and existing-user non-destructive restoration, What's New/change log | ROADMAP, some prior draft work; public acceptance/release pending |
| P-04 Personalization | Individual preferences, home/dashboard choices, layout or tracking preferences, settings and accessibility needs; specific settings should be checked against older decisions before implementation | ROADMAP, discovery required |
| P-05 Platform expansion | Public iOS App Store and Android conversion; native capabilities, policy classification and review, device notifications and deep links, backups/import/restore protection | ROADMAP, not authorized as current web release |
| P-06 Reliability & data trust | Source-backed release proof, exact source demo vs live, local-first/backup safety, migration discipline, test/CI, real iPhone checks and accessible records | CONTINUOUS QUALITY GATE |
| P-07 Additional future functionality | Blend composition/per-component analytics, broader insights, feature requests already scattered across decisions/continuity; preserve individual approval states | BACKLOG / DISCOVERY, not automatically approved |

## Open decisions that must not be misrepresented as completed
- Design System 2.0 is a **whole-app rollout**, including Trends/Nexus, Profile/Settings and child screens.
- Do not infer that an App Store product can avoid medical regulatory/app review simply by renaming calculators.
- Retain dose, reconstitution, vial and blend calculations without introducing unsupported clinical advice.
- Native timed reaction notification design belongs to platform lane, not current draft browser release.
- User-approved or user-accepted surfaces should not be redone casually.
- This roadmap is not a rewrite of previous discussions; missing historical specificity is marked as needing reconciliation.

## Milestone control (fill from verified evidence)
For every requirement: ID | user decision/source | design status | coded commit | tests | native device acceptance | PR | release SHA | deployment | next step.
An item cannot become DONE because only code or CI is green.

## Sequencing
**NOW:** finish DS2 whole-app screen coverage and residual screenshot defect on PR #123; see docs/design/DS2_SCREEN_COVERAGE.md.
**LAST IN DS2:** global accessibility, required fields, scrolling, typography, navigation and motion audit (user explicit ordering).
**LATER, WITHOUT FORGETTING:** core workflow, onboarding, personalization, platform expansion and any approved functional backlog.

## Next action
Cross-link legacy decisions and issues to these product lanes, recover exact previously approved scope, and only then plan implementation sprints. Keep current PR #123 draft and do not deploy without explicit approval.


## 2026-10-27 — Newly requested potential features (discovery only; not implementation approval)

| ID | Potential feature | Expected value / examples | Status and safeguards |
|---|---|---|---|
| P-08 | Contextual swipe actions | Native-feeling left/right swipe on appropriate list rows to reveal actions such as Delete, Edit, Archive, Mark Complete; preview design by screen and determine whether left/right mapping should be consistent | IDEA — explore and prototype after current DS2 scope; never destructive on gesture alone; confirm or allow Undo, keep visible alternatives, protect existing records |
| P-09 | Drag-and-drop interactions | Reorder relevant lists/cards, protocols or priorities where user-defined order makes sense; clarify draggable surfaces, touch handles and persistence rules | IDEA — not every list should be draggable; prevent accidental scroll conflicts, preserve existing ordering/history, accessible non-drag alternatives |
| P-10 | Nexus Ask assistant capability and conversation UX | Evaluate more robust use of existing records/context, helpful follow-up questions, reliable handling of complex questions, clear provenance/uncertainty, readable message layout, suggestions, history and composer UX | IDEA / DISCOVERY — audit current Ask implementation and available backend/data before promising features; protect privacy, offline behaviour, user records and avoid unsupported clinical recommendations |

**User intent:** capture these as *potential future things*, not approval to code, deploy or change the current design sprint. Next for each: inventory candidate screens and interaction examples, present UI previews and implementation tradeoffs, obtain scope approval. The current DS2 child-page verification remains the immediate priority; global a11y/typography/forms/scroll/navigation/motion stays last within DS2. Future onboarding/core workflows/personalization/platform expansion remain on the roadmap.


## 2026-10-29 — Stash/Add Kit approved architecture checkpoint
- Active draft PR #124: single Add Kit entry point with Vials / Capsules / Raw Powder / Topical / purchased Nasal Spray. Non-vial stock appears as kit/package cards, not standalone Other formulations. Per-vial intended use may be labelled on open (no transfer), with source-anchored homemade nasal preparation deferred until coordinated atomic inventory writer and ledger validation. No migrated historical source IDs. Browser and real-iPhone gates pending; no production deployment approval.
