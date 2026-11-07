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
