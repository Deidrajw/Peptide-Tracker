# Nexus — PR146 combined nonproduction preview
Date: 2026-11-06 (Toronto)  
Version: v0.9.25-beta.1 production baseline; integrated candidate UNRELEASED.  
Repo: Deidrajw/Peptide-Tracker; main baseline a0482abc42060ad4b31108538a207bf983df90d7.  
Branch: integration/pr143-search-pr136-pr144-calculators-20261106; draft PR #146.  

## Scope
- Inherits PR143 search-clear interactions and DS2 single thin 16px outline X, 44px control and native WebKit search-cancel suppression only within custom-wrapped inputs.
- Reconciles PR136 injection syringe-capacity recovery without weakening oversized-draw validation.
- Reconciles PR144 read-only theoretical nasal pump concentration and actuation math, with no persistent fields or LIVE nasal administration enablement.
- Added existing independent injection/nasal UI and nasal numerical regression tests to combined CI. 

## Data and safety
No app storage schema modification or data migration intended; production records, plans, inventory and history are not read or written by preview development. Preserve localStorage key peptide-tracker-html-v1. Do not enable LIVE nasal administration, suggest compatibility or claim clinical safety. Exact combined runtime zero-write assertions are pending.

## Evidence and outstanding gates
- Source JS10 merge: all four PR143 patch hunks matched exactly against PR144 JS10, GitHub commit da36a628; no conflicts observed during textual merge. This alone does not prove runtime behaviour.
- Initial integrated six GitHub workflows triggered at commit da970e00; full outcomes/official artifacts pending at report time. Prior independent PR136/144 calculator QA and PR143 search QA cannot qualify the combined branch.
- FULL APP DEMO standalone HTML, offline ZIP and exact-source LIVE ZIP: INCOMPLETE pending build artifact retrieval and parity inspection.
- In-chat interaction sketch is illustrative, NOT full-app runtime and not source-matched.
- 320/390 Chromium/WebKit, light/dark, screen reader, text enlargement, iPhone Safari, zero-write, syringe numerical edge cases and nasal clinical validation: NOT FULLY VERIFIED on integration branch.

## Release status
Coded on draft PR146, NOT merged, NOT deployed, NOT physically accepted. Merge/deployment require separate explicit user approval.  
Next action: retrieve final exact-head six-suite results, correct any failures, and validate official source-matched complete fictional DEMO and LIVE packages prior to iPhone UAT.

## 2026-11-06 — Additional integration quality checkpoint
- Five of six workflows at cd33f205 succeeded; full build #42333716977 failed at the symptom search X target width check. Added **only scoped** CSS protection for true 44 x 44 pixel button in symptom picker at ca8685f3; browser diagnostics 23f01f16 now include measured width, height, viewport, theme and build channel if this assertion fails.
- Local full-app fictional Playwright Chromium in set_content mode (320/390px, dark/light) passed 4/4 for 44px symptom clear geometry with zero page errors, 4/4 for injection 1mL fail-closed and 3mL recovery, 4/4 for nasal theoretical 5mg/5mL/0.1mL, invalid pump and transient no-state-change. These do not certify clinical safety, WebKit, VoiceOver or physical iPhone operation.
- Corrected-css candidate artifacts built from exact prior combined application source and GitHub-matching CSS SHA 581f07df: standalone full-app fictional HTML DEMO 3,181,583 bytes, offline demo ZIP (1 root index byte parity and CRC PASS), complete LIVE 26-member root ZIP CRC PASS. Do not deploy from candidate. New integrated full CI #42334795581 and peers were running at evidence checkpoint; no final overall CI verdict yet.
- No data migration, production writes, main branch changes, or nasal LIVE feature enabling. Draft PR146 remains unmerged and undeployed.


## 2026-11-06 — Full corrected GitHub CI and official artifacts verified
- All six exact-source GitHub workflows completed SUCCESS at eabea3affb976ef145c03513952b2daaf4e70f58: full build/parity #42336062929, pinned Chromium #42336063079, WebKit #42336063104, mobile #42336063015, shared writer #42336062922 and nested DS2 #42336062951.
- Full-browser test log reports 8/8 fictional LIVE/DEMO 320/390 dark/light injection recovery, 8/8 injection/nasal navigation/theoretical mass parity/invalid pump/no app writes, 8/8 search controls preserving selections, Log Dose 256 flows, vial-source 96 assertions. Clinical safety and calibrated hardware performance are NOT validated by these tests.
- Official successful-run artifact #13559388567 independently downloaded and inspected: 549 files in outer ZIP CRC clean, LIVE source ZIP 26 CRC-clean files with root index and ordered 01–12 scripts plus helpers, standalone FULL APP DEMO 3,181,567 bytes exactly equals offline ZIP root index, OFFLINE ZIP 2 entries CRC clean, manifest source commit eabea3af, v0.9.25-beta.1. DEMO intercepts local/sessionStorage in memory and disables HTTP/Beacon APIs; fictional data only.
- Cloudflare expected does not match unmerged candidate (source parity report unverified). Actual primary production was NOT deployed or requalified as this candidate. No migrations or production data writes, nasal LIVE OFF.
- Release gates still pending: user physical iPhone Safari review (single-X, injection error recovery, nasal calculator, scroll, keyboard and theme), VoiceOver/Dynamic Type acceptance and explicit authorisation to merge/deploy. Draft PR146 remains unmerged; release NOT COMPLETE.
