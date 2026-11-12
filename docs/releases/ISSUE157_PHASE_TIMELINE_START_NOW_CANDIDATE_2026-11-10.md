# Nexus — Issue #157 Follow-up Release Notes (CANDIDATE, NOT RELEASED)
Date: 2026-11-10
Version: v0.9.26-beta.1 development follow-up (candidate; not a production version)
Development: draft PR #158 feature/protocol-duration-end-date-20261109, stacked on draft PR #156, GitHub main baseline 1c6007fc. Both remain unmerged and undeployed.

## Changes
- Protocol Builder / Duration & changes: original Weeks / End on date stays available, exact selected day preserved; advanced phases now show a compact timeline and focus on one editable phase. Existing phase schedules and doses are not overwritten merely by expanding or collapsing. Remove another phase requires a dedicated Keep / Remove confirmation.
- Protocol cards: earlier active/future start records without a dose attributable to this protocol can offer a visible, explicitly confirmed Start now action. An explicit start updates the protocol and schedule to today's local calendar day, then separately offers optional Log Dose. Cancel/Not now never records a dose. Prior same-compound dose history is retained.
- Card hierarchy: future active protocols without attributed doses appear Scheduled instead of contradictory In Progress / Not started. First-dose action is distinct from Start now. DS2 lavender primary CTA, 44px+ targets and accessible labels.
- Scoped styles in assets/css/nexus.css and browser/DS2 acceptance regressions.

## Data impact and safety
- No destructive migration; retained durationWeeks compatibility and optional exact durationDays. Existing protocols, historical dates, dose logs, inventory/source attribution, Check-In, backups, Stash and Calendar are protected.
- Start now modifies the specifically confirmed protocol's effective startDate and the associated compound scheduling source; this may change Today projections, so it requires explicit confirmation and acknowledged write before any optional dose entry.
- Legacy same-compound history attribution without a linked protocol event ID is conservatively approximated by record date; explicit future-start safety and new-start baseline tested. Shared compound schedules remain a protected multi-protocol limitation and require focused iPhone QA.

## Evidence and limitations
- Earlier six-suite CI qualified superseded app source dc7bd693, but user rejected physical iPhone phase UX and reported missing Start now/status contradiction.
- Source cd641e77 passed six GitHub workflows, including 8/8 full-app LIVE/DEMO at 320px/390px and light/dark. Official artifact #13808244054 passed CRC; latest app commit dcc59f98 differs only by one Pause All count/transaction parity statement. Standalone full-app DEMO, offline DEMO ZIP and complete LIVE ZIP were reconstructed for dcc59 source; ZIP integrity, standalone/offline byte identity and five GitHub blob SHA comparisons all PASS. Latest exact-source six-suite CI run #42915482597 (plus five related workflows) IN PROGRESS, not yet qualified. Do not present previous 6/6 as new-current-source 6/6.
- Full iPhone and VoiceOver/Dynamic Type acceptance: NOT TESTED on new changes. Production Cloudflare parity: NOT VERIFIED. Calculator-safety release blockers remain governed by existing regression docs.

RELEASE STATUS: coded on draft PR; unmerged, undeployed, no production writes, no approval to merge/deploy. Next gate is exact-source six-suite CI and isolated full-app DEMO/LIVE verification, then focused physical iPhone acceptance and separate explicit release approval.

## 2026-11-11 verified final QA addendum (CANDIDATE, NOT RELEASED)
- Source: final application dcc59f98; six GitHub final-source workflows all SUCCESS at docs-only source 2c0d5f92: build 42915482597, WebKit 42915482965, pinned Chromium 42915482660, mobile 42915482516, writer 42915482522 (all three jobs), DS2 nested 42915482936. GitHub full build passed 8 LIVE/DEMO widths/themes fictional browser scenarios. This supersedes earlier release-note text saying final six-suite CI in progress; do not mistake the older historical paragraph for current state.
- Official exact-source artifact #13809602041 independently inspected: 26-file LIVE, complete isolated fictional DEMO and matching offline HTML, ZIP CRC and five critical Git blob checks PASS. Previous user physical iPhone issues resolved on current candidate; latest user-reported 8/8 functional regression PASS including history. VoiceOver/Dynamic Type and independent clinical calculator safety remain unverified.
- No destructive migration; explicit Start Now modifies only confirmed protocol schedule, no automatic logged dose; historical records and inventory preserved per functional QA. Parent draft PR156 and child draft PR158 unmerged. Cloudflare primary-host production source/asset parity NOT verified and build's parity JSON reports existing-source CSS mismatch; perform independent verification only after approved merge/deploy. No release authorization given.
