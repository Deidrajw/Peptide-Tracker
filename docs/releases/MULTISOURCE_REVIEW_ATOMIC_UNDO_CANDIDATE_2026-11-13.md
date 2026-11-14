## 2026-11-13 — Guided Log Dose final follow-up, current source 95a91a18; CI qualification INCOMPLETE
- Approved development only: three-step Dose details → Vials → Review; PR169 DRAFT / UNMERGED, main b3a67ec4 and published v0.9.27-beta.3 unchanged, production/storage untouched. App CSS last source 95a91a1862b175f9960a73544683eeec2adf4858; test helper updated ae6578ac for three-step save.
- Source 125f2be2 was 5/6 GitHub QA PASS: mobile #43536832482, shared writer #43536832515, DS2 nested #43536832465, WebKit #43536832459, pinned browser #43536832581. Full build/browser #43536832532 FAILED at tools/validate-logdose-ui.mjs:112 due stale one-click test helper leaving final #save hidden; corrected in ae6578ac after run, not yet independently passed.
- On latest observed 95a91a18, GitHub commit workflow lookup returned NO RUNS as checked, so NO full-six-suite PASS is claimed for latest code. Historical browser failure remains open until a new exact-source run passes; DO NOT REQUEST iPhone acceptance as qualified release.
- Exact-source 125f2be2 candidate artifact #14089677445 retrieved: outer ZIP CRC PASS, full 26-file LIVE source ZIP CRC PASS, standalone full-app DEMO equal to offline ZIP index. Separate fictional iPhone-specific isolated FULL APP DEMO built from that exact source preloads 1mg Vial4 + 5mg Vial8 in one kit. **This artifact PRECEDES 95a91a18** (minor CSS + test updates), so it is NOT the final exact-source release package. No full-app demo claimed source-matched to latest 95a.
- Physical iPhone UX acceptance remains FAIL on earlier one-screen version, NOT TESTED for new guided candidate; VoiceOver/Dynamic Type not tested, clinical calculations unverified.
- ONE NEXT ACTION: obtain completed six-workflow QA for latest source and official matching full-app DEMO/LIVE ZIP, fix failures, then invite one focused physical iPhone acceptance round. No merge/deploy without separate explicit approval.

## 2026-11-13 — PR169 GUIDED THREE-STEP LOG DOSE, SOURCE-VALIDATED CANDIDATE (UNRELEASED)
- User authorised development of Dose details → Select physical vials → Review, after physical iPhone UX REJECTION of the prior one-modal/advanced-allocation design; merge/deploy expressly withheld.
- Current app/test candidate 125f2be27903300e2f3670f3314e9c19493217d2; branch fix/multisource-dose-review-atomic-undo-20261113, draft PR169 OPEN, base/main b3a67ec48f5ba982abff042048e30a9549d83467, published production v0.9.27-beta.3 unchanged. New step chooses exact physical vials, preserves explicit multiple-vial intent when source changes, adds a second source even when first alone could cover the dose, shows projected source quantities in final Review; actual exclusive writer and atomic Undo protections untouched. Existing prepared/blend/nasal/untracked/edit paths remain separate.
- Earlier first-pass 4/6 browser CI FAIL (legacy two-step assertions and hidden final Save); updated tests now traverse guided source step and assert visible dual-vial controls. As last independently checked for 125f2be2, PASS: mobile #43536832482, shared writer #43536832515, DS2 nested #43536832465, formulation WebKit #43536832459; build/browser #43536832532 and pinned Chromium #43536832581 IN PROGRESS, NOT PASS. No physical iPhone or VoiceOver/Dynamic Type acceptance. Any future GitHub outcomes must be rechecked at exact head.
- Official GitHub candidate artifact #14089677445 manifest source 125f2be2: outer 9-entry ZIP CRC PASS, nested LIVE 26 files CRC PASS with root index.html, complete standalone fictional full-app DEMO and offline ZIP bytes matched/CRC PASS. Tailored iPhone QA demo adds only two fictional Retatrutide vials (Vial4 1mg, Vial8 5mg) to the same complete isolated in-memory full-app source; no sync or production data writes. Not a newly published release. Calculator clinical safety not certified.
- ONE NEXT ACTION: confirm final two exact-head GitHub workflows and official full artifact before requesting new physical iPhone acceptance. NO MERGE OR DEPLOY WITHOUT SEPARATE USER APPROVAL.

## 2026-11-13 — Three-step guided Log Dose redesign CODED ON DRAFT PR169, QA PENDING
- USER APPROVAL: development of Dose details → Select vials → Review on PR169 only. No merge/deployment authorised. Physical iPhone acceptance of prior multi-vial UI FAILED: advanced toggle looked inert, source was buried, allocations confused user, and no-verified-open-vial message lacked clarity.
- GitHub app code commits 06da2a0c (JS05), 825ff1e6 (CSS), c2b2b7a (same-kit second-vial split when first vial covers dose). Draft PR169 remains OPEN/UNMERGED. Current main baseline b3a67ec4, published v0.9.27-beta.3 unchanged. Candidate code is not newly qualified or released; existing six successes at e02a8fe3 are HISTORICAL, not passes for guided code.
- Guided physical fresh-dose modal keeps original authoritative dose commit, inventory validation, exact-source Review and atomic Undo; separates dose details, vial/source selection and final Review, preserves Back and typed draft, makes explicit multi-vial panel persist and reveals source reasons when no compatible open vial is eligible. Other legacy/prepared/nasal/blend/edit paths intentionally remain on prior controls.
- LOCAL JS syntax PASS; a full Chromium page run was blocked by this runtime's browser network policy (ERR_BLOCKED_BY_ADMINISTRATOR), not counted Pass. New head six-workflow GitHub CI initiated, final conclusions and exact-source official LIVE/isolated DEMO artifacts PENDING. Physical iPhone, VoiceOver/Dynamic Type, data reload, clinical calculator calibration NOT TESTED. No migration, live user storage writes, merge or deployment.
- ONE NEXT ACTION: verify all six exact-source GitHub workflows, fix any failures and retrieve/CRC-check full-app LIVE and fictional DEMO before requesting a new physical iPhone acceptance round.

## FINAL QA update — November 13, 2026 (NOT A DEPLOYMENT)
- App/test source e02a8fe338485cb3dd5c1e933ded98e8d1dffa68. Six exact-code-source GitHub Actions workflows SUCCESS: full build/browser 43384267995, shared writer 43384267993, DS2 nested 43384268096, mobile 43384267985, pinned browser 43384268045, formulation WebKit 43384267983.
- Final full artifact #14017808892 (outer 573-entry ZIP CRC PASS; nested 26-file LIVE ZIP CRC PASS, root index.html; isolated fictional full-app DEMO). Manifest source SHA e02a8fe3; browser 8/8, dose end-to-end 8/8 (264 recorded verifications), with same-kit multi-source dose Undo and stale two-tab writer tests supported by individual regression evidence.
- Previous CI build and DS2 failures were resolved by adding fail-closed legacy validation before the new planner and updating old tests to check the new blocked-confirm behaviour. Final status is six-suite PASS; no physical iPhone or accessibility acceptance.
- Candidate release metadata still says v0.9.27-beta.3; new published version not assigned. No migration or destructive storage write. Draft PR169 remains unmerged and undeployed, pending user testing and separate release approval.

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
## Follow-up exact-source qualification — 2026-11-13
- Candidate source `e02a8fe338485cb3dd5c1e933ded98e8d1dffa68` extends selection to two *different open vials within one kit*, keyed by physical vial ID; never reuses a kit-level default to guess another source. Multi-candidate cases render explicit choices. User's original implementation approval covers targeted multi-source Log Dose recovery; merge/deploy still withheld.
- Official source-qualified GitHub artifact #14017607635: complete FULL APP fictional isolated DEMO and 26-file LIVE ZIP, outer + nested CRC PASS. Local 320/390 light/dark exact-source Chromium 4/4 confirms same-kit split 1+2=3mg with one dose, two distinct source records, Undo restores both balances and removes dose; no page errors.
- **PASS 5/6 workflow groups** on e02a8fe3: writer #43384267993 (including persisted two-tab exclusive multi-source Undo), mobile #43384267985, nested DS2 #43384268096, WebKit #43384267983, pinned browser #43384268045. Build/browser #43384267995 IN PROGRESS at last verification, NOT PASS. Browser history includes prior failure #43383023454 on old test trying to click newly disabled shortage Confirm; corrected test asserts no-write and disabled Confirm. No new release version or production change.
- Still required: final build/browser workflow, independent final artifact validation, physical iPhone UX, VoiceOver/Dynamic Type and separate explicit merge/deploy approval. Clinical math certification not implied.
