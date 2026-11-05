# Nexus PR135 — Shared-session-first Combo Dose Setup

**Version:** v0.9.24-beta candidate only (no release/tag).
**Date:** November 5, 2026.
**Status:** Approved visual direction; coded on draft PR #135, NOT merged or deployed.
**Main baseline:** 21b9e42a213f74e3e372266a9fb65c12a9c731da.
**UI code:** 929ac0e9b9295ddd3eca6e9ebaec651c996fd7ce (JS), f8d5ee00c8c38f7f5fbee06cbf199e61b35d2bb4 (CSS).
**Tests:** 3daaf99c4b5af750c9fd060249d80585a48d9721.

## Approved refinements
- Shared session details appear in a clearly titled panel at the top of Setup, preceding compound-by-compound fields.
- Date/time, SubQ/IM method, mixed-syringe shared site, shared notes and saving a favourite are configured only once.
- Compact live session summary remains readable and can be reopened with Edit; moving to another compound collapses shared details.
- Individual administration sites remain per compound in separate-injections mode.
- Numbered compound navigation, strong compound headings, units, inventory sources, no-vial safety and Step 3 Review stay intact.

## Data impact
No existing data migration, history rewrite or production data edits. Original storage key untouched. Existing source allocation, prepared dose delegation, strict mass shortfall and native historical unit rules preserved. LIVE nasal gates stay OFF.

## Verification
- New regression assertions test DOM order, initial shared settings visibility, collapsing on compound advance, updated method summary and Edit reopen.
- **Exact-source QA pending** on this refinement. Existing PASS #42094294724 applies to the earlier focused setup, not the shared-session-first code.
- Five standard CI workflows had an earlier npm dependency resolution blocker; rerun status unverified for this code.
- Full LIVE ZIP and isolated complete FULL-APP DEMO have not yet been downloaded and CRC-tested for this new application source.
- Actual loaded DM Sans/Fraunces/DM Mono, physical Safari, keyboard, large text and VoiceOver remain NOT TESTED. Calculator safety not independently certified.
- Prior production release-notes gate remains separate.

## Release
PR draft / no new version / not merged / not deployed / no physical iPhone acceptance.
Next action: qualify pinned source-exact browser QA and artifacts, then iPhone UAT; release authorization is separate.

## November 5 iPhone screenshot correction (PR135 unreleased)
- UX feedback: Inventory Source label visually crowded the preceding dose input, and the mg/mcg dropdown lacked a visible chevron.
- JS ecddbd56: dedicated outline SVG chevron and accessible native mg/mcg select inside a unit-control wrapper; Inventory Source field group. Existing unit-change handler and full dose calculation path unchanged.
- CSS 4797c74d: 20px field-group separation, 96px unit control with a persistent SVG cue independent of browser native appearance.
- Data impact: none to persisted records, prepared dose attribution, unit storage, vial deduction, schema or LIVE nasal gates.
- Local test evidence: Chromium set_content complete fictional isolated DEMO, 320/390 light/dark 4/4; mg to mcg 0.3 -> 300, 20px measured input-to-source gap, visible unit SVG, zero page errors; Node JS syntax PASS; exact GitHub JS/CSS blobs match rebuilt 26-file LIVE ZIP; ZIP CRC and offline DEMO parity PASS.
- Incomplete: latest GitHub CI browser/build/WebKit/mobile/writer/nested queued or running at checkpoint; physical iPhone Safari/VoiceOver/Dynamic Type and online-loaded fonts not accepted. No release tag, merge or deploy approved.
