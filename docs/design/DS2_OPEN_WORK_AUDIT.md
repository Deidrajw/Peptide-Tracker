# Nexus DS2 — Open-Work Reconciliation Audit
**Audited:** 2026-10-27. **Source:** draft PR #123 head 8168ca1 at audit start; docs/design/DESIGN_SYSTEM_2_SPRINT_{01,02}.md and docs/continuity/{PROJECT_STATE,DECISIONS,RELEASE_HISTORY,REGRESSION}.md. **Status:** DOCUMENTARY AUDIT, NOT A COMPLETE SOURCE/DEVICE ACCEPTANCE. Main/prod unchanged.

## Rules
- Never infer completed from CODED, prior CI success, screenshots, or a historical "LATEST" heading.
- OPEN = unmet or not evidenced on current release; VERIFY = coded but acceptance missing; DISCOVERY = decision/requirements unresolved.
- Historical records are append-only; this register is the canonical open-work index until each item has evidence and signoff.
- Source/CI and iPhone outcomes must be recorded separately. Do not merge/deploy PR #123 without explicit approval.

## Recovered work, ordered by current user priority
| ID | Workstream | Specific missing closure | Status | Source |
|---|---|---|---|---|
| DS2-01 | Profile / Supplements | Remove Notion import UI/handler safely; lavender Add; inline Check-In creation, duplicate prevention, explicit log save, dated history | VERIFY | PROJECT_STATE Supplements / Stash / Prepare Dose continuation; user correction |
| DS2-02 | Stash / Prepare Dose | Selected tab rounded corners; responsive source rows/keyboard; open-vial status/action alignment, source math unaffected | VERIFY | PROJECT_STATE physical iPhone screenshot correction; user correction |
| DS2-03 | Calendar Month | User-requested Month-view icon revisions were never explicitly signed off | OPEN | PROJECT_STATE Sprint 01 iPhone acceptance checkpoint |
| DS2-04 | Protocol interior | Verify vertical phase roadmap, pause status immediate refresh, schedule-ended vs explicitly completed and one-time post-end review; differing schedules and transition alerts | VERIFY / DISCOVERY | DESIGN_SYSTEM_2_SPRINT_02.md Protocol iPhone feedback; PROJECT_STATE Protocol interior |
| DS2-05 | Protocol / Goal wizards | Full multi-step review, date fields, keyboard, sticky actions, empty Check-In connection, native picker | VERIFY | PROJECT_STATE first-dose + wizard acceptance |
| DS2-06 | Kit / Blend Step 2 | Test-results card vs sticky footer, iPhone keyboard/safe-area, real file picker/viewer, edit/export/restore/quota | VERIFY | PROJECT_STATE Step 2 parity QA and attachment viewer |
| DS2-07 | Supplies actions | Restock/usage modal parity (legacy green), create/edit/restock/use/history individual acceptance | VERIFY | PROJECT_STATE Supplies iPhone feedback |
| DS2-08 | Log Dose | Physical source-row identity, optional observations, keyboard and scrolling; protect multi-vial allocation and draft/edit | VERIFY | PROJECT_STATE Log Dose Review and physical Safari incident |
| DS2-09 | Goal actions | Status action sheet touch targets, workflow, linked protocol unaffected; user iPhone acceptance | VERIFY | PROJECT_STATE Goal quick status |
| DS2-10 | Record Reaction | Post-dose invitation and edit/delete are automated-tested; physical iPhone and VoiceOver outstanding; native timed notifications separate | VERIFY | REGRESSION reaction QA GREEN |
| DS2-11 | Modal scrolling | Full-app inventory of nested scrollers, keyboard and sticky footers beyond scoped Blend editor | OPEN | PROJECT_STATE Blend full-screen; docs/design/MODAL_SCROLLING_STANDARD.md |
| DS2-12 | Required fields | Form-by-form required/optional inventory and approved validation before changing save logic | DISCOVERY | PROJECT_STATE Kit currency/required fields |
| DS2-13 | Typography / tokens | Global font, icon optical weight, chevron, focus, contrast, dark/light, reduced motion and navigation final decisions | OPEN | Sprint 01 approval questions/visual matrix |
| DS2-14 | Onboarding / release | Consent vs optional tour, existing-user non-destructive restore, release note gate, Store readiness | DISCOVERY | Sprint 01 onboarding and PROJECT_STATE release-readiness entries |
| DS2-15 | Shared compound browser | Physical Safari search, Browse All, keyboard and return-state across Kit/Blend/Protocol/Plans | VERIFY | PROJECT_STATE full-library picker |
| DS2-16 | Blend Composition & Dose Analytics | Per-compound display and no-double-count analytics requested for future; design not approved | BACKLOG / NOT COMMITTED | PROJECT_STATE optional test-result request |
| DS2-17 | Data/hosting release | Latest-source full-app DEMO and LIVE package, physical-device acceptance, Cloudflare hash parity, explicit merge/deploy | RELEASE GATE | REGRESSION and project instructions |

## Documentation defects
1. PROJECT_STATE is an append-only 1,700+ line log with many stale headings marked "LATEST" and multiple competing "ONE NEXT ACTION" statements. Add a short current snapshot at top and keep history below.
2. DESIGN_SYSTEM_2_SPRINT_01 and _02 contain frozen planning statuses ("not implemented") even though subsequent code was committed. Treat them as original plans, not current status.
3. RELEASE_HISTORY has draft candidates mixed with shipped releases; never interpret draft version heading as production release.
4. REGRESSION mixes planned assertions, failed CI and historical passes; current-head result and physical iPhone outcome require distinct columns.
5. DECISIONS should distinguish approved principle, exploration, coded decision and user acceptance; no global inferred approval.
6. Missing stable ID/owner/acceptance evidence per requirement caused premature advancement to mandatory-fields audit.

## Next action
Complete DS2-01 and DS2-02 against actual iPhone screenshots and targeted source-matched QA; then revisit DS2-03 onward by priority. Maintain this register on each material update and link from PROJECT_STATE. No production merge/deploy.
