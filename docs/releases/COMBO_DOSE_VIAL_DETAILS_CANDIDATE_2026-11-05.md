# Nexus — Combo Dose stepper and View Vial (unreleased candidate)

Date: 2026-11-05 (Toronto). Production version remains v0.9.24-beta. Base main 21b9e42a213f74e3e372266a9fb65c12a9c731da. Development draft PR #135, never merged or deployed by this work.

## Changes (candidate)
- **Combo Dose, Select:** Searchable multi-select, saved combination picker, one mixed syringe vs separate injections.
- **Combo Dose, Setup:** Draw now vs Prepared. Prepared delegates to the existing prepared-syringe confirmation to avoid double stock consumption. Explicit SubQ/IM only, using the exact nexusAdminSites method-specific options already shared with regular Log Dose. One site for a shared mixed syringe, individual sites for separate injections.
- **Combo Dose, source choice:** Select an eligible open vial or the explicit automatic eligible-vial option, with a read-only preparation disclosure for the exact vial. Missing preparation values are labelled, not inferred from kit defaults. The existing planner additionally checks selected vial and method eligibility, positive amounts and site attribution before allocating.
- **Combo Dose, Review:** Concise per-compound doses, source, method and applicable sites before the established writer attempts a save.
- **Stash, Vial kits → Kit details → Vials:** Discoverable View vial action opens a read-only per-vial preparation sheet (recorded liquid, date, physical form, quantity, notes). Exact matching reconHistory may supply missing vial-specific detail; unrelated kit defaults must not be substituted.

## Data impact
No schema migration, no localStorage resets, no imports, no deletion, no live feature flags enabled, and no production data modified by development. New administrations, when saved in the future, carry method, site, combo grouping and source allocations; per-compound dose records remain distinct. Nasal LIVE gating unchanged.

## Safety boundaries
- A mixed-syringe record describes what was administered, **not** a medical compatibility determination.
- Never count sealed or incompatible-form vials as open injectable sources.
- Do not rewrite historical dose records, recon history or balances merely by opening a read-only sheet.
- A live supported physical dose needs recorded method, site and exact source eligibility.
- Existing planner and nexusCommitCurrentState exclusive commit path retained; cross-tab stale rejection must be tested. Failed calculator-safety assertions remain blockers, not validation.

## Verification
- Historic PR135 application revision 06e00aa1: mobile SUCCESS #41981657821; shared writer SUCCESS #41981657816; nested SUCCESS #41981657931; WebKit SUCCESS #41981657820; build/browser #41981657892 FAIL due obsolete test attempting hidden Setup input. Browser test was updated to advance Select → Setup.
- Later tests added for individual SubQ site attribution, mixed IM method attribution, selected source isolation, read-only vial disclosure, 44px Stash action and prepared mode.
- Final exact-head browser and full release artifact qualification: **NOT VERIFIED** at time of this record. Final WebKit/mobile/writer/nested: **NOT VERIFIED** until rechecked at final source.
- Physical iPhone Safari, keyboard, Dynamic Type, VoiceOver, downloaded fonts: **NOT TESTED**. Calculator clinical safety: **NOT CERTIFIED**.

## Delivery
- In-chat fictional UI preview was supplied in the approved design conversation.
- Standalone full-app fictional DEMO HTML, offline DEMO ZIP and exact LIVE ZIP: **INCOMPLETE** pending successful exact-source artifacts/download verification.
- GitHub: draft PR #135, unmerged, undeployed. Cloudflare primary remains previously reported source-parity verified at main.
- Unrelated production release-artifact stale-release-notes gate #41971160513 remains open and must be fixed in a **separate PR** with no weakening of strict production safeguards.

## Next action
Verify exact-head full build/updated browser QA, inspect 320/390 light/dark screenshots and source-matched DEMO/LIVE artifacts, correct failures, then seek physical iPhone acceptance. Do not merge or deploy without explicit user approval.
