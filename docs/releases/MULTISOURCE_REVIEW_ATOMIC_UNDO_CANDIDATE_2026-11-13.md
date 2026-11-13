# Nexus — Multi-Source Review + Atomic Undo (Development Candidate)
**Source:** main b3a67ec48f5ba982abff042048e30a9549d83467, released version v0.9.27-beta.3.
**Candidate:** UNRELEASED; no new published version. User approved implementation on separate branch but expressly prohibited merge/deployment without a subsequent separate approval.

## Changes
- Log Dose Review now shows each exact eligible kit and physical vial, allocated quantity, original amount, after-balance, total of requested dose; preserves standard DS2 title and navigation.
- Source shortage, duplicate source, incompatible vial, incomplete or excessive allocations block final confirmation and show actionable correction copy before any save.
- Exclusive backed physical dose save records source-specific before/after amounts and status checkpoints in each allocation. Additive metadata only; old recorded doses and storage key unchanged.
- Two-or-more-source Undo preflights every exact source, native mg/mcg mass equivalence, status, post-dose balance, method, capacity, duplicate identities and latest-event eligibility. It restores all sources and removes one dose only on a validated cloned snapshot under existing exclusive writer/readback. Existing single-vial correction flow untouched. Historical multi-source records without sufficiently complete checkpoints remain fail-closed.
- Preserve finished/confirmed mid-draw rows on their existing protected ledger path. No changes to blend, capsule, prepared/nasal gate or Combo administration.

## Scope and data impact
- Files: assets/js/01-nexus.js, assets/js/05-nexus.js, assets/css/nexus.css.
- Additive per-allocation metadata only on future saved backed doses. No migration, no reset, no rewrite of stored records.
- Real production localStorage untouched; application is not merged/deployed.

## Local evidence (prior to exact GitHub head qualification)
- Chromium under isolated complete fictional full-app DEMO at 320/390: full UI allocation 1mg+2mg, Review shows both vials, 3mg exact total, Save 13→14, exact balances 1→0 & 5→3, Undo 14→13, balances 0→1 & 3→5; no JS page errors.
- 99mg requested on sources allocating 3mg: review alerts shortage 96mg; Confirm disabled, no write.
- Pure planner negative checks at 320/390: missing vial, changed balance/status, method mismatch, duplicate source, capacity exceeded, missing recovery checkpoint, dose sum mismatch, newer dose, repeat Undo all reject without mutating input. Single-source Undo still passes.
- Source-varying browser and exact-head GitHub CI, Writer race, real iPhone/VoiceOver/Dynamic Type, and prepared/legacy flow have NOT been verified at this documentation checkpoint. Calculator clinical safety NOT established.

## Required release gates
- 320/390 both themes, exact-head Chromium + WebKit + writer + nested + full-build CI.
- Complete candidate standalone fictional FULL APP DEMO, exact GitHub source LIVE ZIP, CRC and source comparison; existing LIVE package remains unchanged pending approval.
- Cross-tab stale writer, multi-kit and same-kit vial identities, mg/mcg, confirmed draw/handoff and historic records.
- Physical iPhone UX and accessibility; separate explicit permission for merge/deploy; independently verify primary Cloudflare after merge.

**Status: CODED, LOCAL TESTED, PR/CI PENDING. NOT MERGED OR DEPLOYED.**