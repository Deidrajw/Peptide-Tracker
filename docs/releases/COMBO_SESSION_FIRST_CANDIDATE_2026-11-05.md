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
