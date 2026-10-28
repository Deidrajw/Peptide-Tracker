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
