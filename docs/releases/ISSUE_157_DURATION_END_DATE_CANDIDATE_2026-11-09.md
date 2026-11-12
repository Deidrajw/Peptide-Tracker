# Nexus Issue #157 — Duration & changes candidate notes

**Status:** Coded draft; NOT MERGED, NOT DEPLOYED, physical iPhone acceptance NOT TESTED.
**Version:** Existing published source v0.9.26-beta.1; no release version bump.
**Branch/PR:** feature/protocol-duration-end-date-20261109 / draft PR #158 (stacked on unmerged PR #156), baseline main 1c6007fc.
**User approval:** Simplified Duration & changes design was approved Nov 9, 2026. Approval did not include production merge/deploy.

## Changes
- Protocol Builder now uses a simple Duration & changes step with start date, Weeks or End on date, a single phase in the foreground and progressively revealed advanced multi-phase/override controls. Native date fields; clear approximate weeks and an exact last planned calendar date on final Review. DS2 typography, consistent outline chevron and 44px iPhone controls.
- Optional `durationDays` models the exact number of calendar days with inclusive last planned date; existing `durationWeeks` data stays unchanged. Select Dec 1, 2026 through Jan 1, 2027 = 32 inclusive days, exclusive schedule boundary Jan 2. UTC calendar-day arithmetic handles DST changes.
- Protocol timeline, Today source-linked schedule and planned after-end suppression, Supply Planner projections, phase summary/alerts and companion phase editor honor date-backed duration. Paused date-backed protocol effective timeline follows explicit owning protocol ID and cumulative pause days. Old week-only maintenance schedule remains unchanged.
- Browser regression additions cover legacy 4w=28d, exact-day boundary, invalid date, draft save and unchanged history, paused suppression and resumed extension, advanced disclosure, narrow iPhone geometry and screenshots in eight LIVE/isolated-DEMO × 320/390 × dark/light sessions.

## Data impact
- No destructive schema conversion, backfill, history rewrite, localStorage clearing or personal data migration. New optional fields are only written on user-confirmed protocol save. Existing protocols remain in their original model until the user changes them.
- Exact last day is informative and schedule-backed, not a clinically recommended treatment duration.

## Test evidence and limitations
- JavaScript static parse checks passed for modified JS; exact-head six CI workflow conclusions, official full-app isolated DEMO / LIVE ZIP verification and screenshots must be recorded after tests finish. Not automatically a pass.
- Physical iPhone Safari, keyboard/safe areas, VoiceOver, all 16 protected manual cases, and independent Cloudflare production parity: **NOT TESTED / NOT VERIFIED**.
- Candidate cannot be merged/deployed without explicit separate authorization and prior PR156 disposition. If any calculator/source safety or writer regression fails, hold release.

## QA playbook
Use `docs/qa/IPHONE_MANUAL_TEST_PLAYBOOK.md`, including Issue #157 cases plus original grouped #01–#16; record Pass/Fail/Not Tested/Blocked and actual screenshots. Never use personal backups or production data in the DEMO.

## Release status
Proposed: approved design. Coded: yes. Browser QA: pending. PR: draft #158. Merged: no. Deployed: no. Physical iPhone accepted: no.
