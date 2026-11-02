## 2026-11-02 — PR124 iPhone rejection correction candidate (NOT A RELEASE)
- Internal version v0.9.20-beta unchanged. CSS c7e960d1 aligns Stash Vial Setup and Goal Details label/title/subtitle, option/tab and Goal content typography. Nasal pure planner c7ef6b54 accepts a missing legacy `formulationStocks` collection for first prepared bottle in copied state only, retaining malformed/duplicate/source/confirmation checks. Test 310f0697 adds focused fictional assertions. No production user data touched or migrated; old history/inventory preserved.
- New screenshots from user constitute visual rejection of #04/#16 and a failed nasal Review action; local equivalent isolated Node checks PASS for first transfer, exact accounting, duplicate/malformed/insufficient rejection. CI for new branch head and 320/390 light/dark screenshot review PENDING; no new source-exact DEMO/LIVE artifact certified. Full 16-point real-device acceptance NOT PASSED; PR #124 draft/unmerged/undeployed; P0 release BLOCKING; nasal LIVE gates OFF.

## 2026-11-02 — PR124 screenshot corrective candidate and deterministic race (NOT RELEASED)
- Candidate version remains v0.9.20-beta; user-provided screenshot shows generic seven-method Log Dose and redundant setup controls, not acceptable as final iPhone design. Draft fixes: source-conditional injectable (SubQ/IM/IV), separate verified legacy Oral vial choice, source-aware mixed nasal/injectable routing, optional preferences relocated to Additional dose options and Stash Overview; accessible 48px SVG preference close and distinct 'Confirm vial form' action. IV remains stock-backed safety-gated and disclosed. Physical stock balances, histories and saved configurations preserved; no migration or production writes.
- Real Chromium deterministic held-lock stale-write/failed-write suite at source a62d50ab: shared writer workflow #41467310336 SUCCESS; latest source 9ef1849b re-runs. Initial draft Chromium build failures revealed a stale product-form chooser assertion then an Oral source priority bug; both fixed by subsequent application/test commits. Exact final Chromium/WebKit/mobile/nested/writer results and full-app DEMO/LIVE ZIP artifact to be recorded ONLY after latest CI settles. Do not count earlier failing runs as passing releases.
- Draft PR #124 unmerged, primary Cloudflare production unchanged/unverified from branch; LIVE nasal feature gates OFF, release P0 blocking, physical iPhone/VoiceOver NOT TESTED/NOT ACCEPTED. One consolidated fictional iPhone UAT prepared in docs/qa/IPHONE_MANUAL_TEST_PLAYBOOK.md.

## 2026-11-02 — PR124 source-separated Stash / injectable Log Dose candidate, NOT RELEASED
- Exact code/test 825e2310 (main baseline da585ab3): injectable-vial choices SubQ/IM/IV; legacy Oral route preserved; mixed kit compact Stash displays independent injectable-vial, nasal-source and prepared-bottle stocks without double counting; UI-only stock display, no migration, import, history rewrite or production writes.
- QA all five workflows success: Chromium/build #41413098060 (8 LIVE/DEMO viewport/theme Stash scenarios, 184 Log Dose flows), WebKit #41413098124, mobile #41413098025, nested #41413098462, writer #41413097993. Candidate GitHub artifact #13126781956; source-exact 26-file LIVE ZIP CRC PASS, isolated full-app DEMO generated. Browser ≠ physical iPhone acceptance. Earlier test failures on candidate SHAs were corrected; a 2-tab race-test order flake was rerun successfully but deserves hardening.
- Version remains v0.9.20-beta candidate, NO merge, NO primary Cloudflare deployment, NO real iPhone acceptance. P0 release BLOCKING, both nasal LIVE gates OFF.

## 2026-11-02 — PR124 exact-source candidate #02/#11/#15 CI PASS, NOT RELEASED
- App `1bf5e69d` adds accessible independent-dose/escalation explanations with original checkbox/save/calculation handlers unchanged. #02 runtime unchanged; focused route-site tests `fbdaafea` now enforce no site for five irrelevant methods. Earlier #11 unified demo-only historical nasal action preserved.
- Exact test source `fbdaafea`: Chromium #41394215775, WebKit #41394215749, mobile #41394215762, nested #41394215774, writer #41394215758 all SUCCESS; Chromium artifact #13118603875 source matched, 476-entry outer ZIP CRC, 26-file LIVE ZIP CRC, 3,076,267-byte full-app standalone isolated DEMO and offline ZIP checked. WebKit visual #13119235667 264-entry CRC and sampled screenshots inspected. No production writes, migration, schema or math changes; mixed legacy-writer P0 blocking, nasal LIVE gates OFF. PR DRAFT, no merge/deploy. Physical iPhone not accepted.

## 2026-11-02 — PR124 #11 verified; #15 optional-dose description candidate (NOT RELEASED)
- On `1cb85019`, five workflow groups SUCCESS for demo-only nasal Stash source action; no live writes or ledger modification. Subsequent app `1bf5e69d` adds accessible helper explanations to independent-dose and escalation checkboxes; test `87cfc2c4` adds reversible checkbox expansion state; `fbdaafea` tests clearing noninjectable administration sites, no runtime method change.
- No storage schema change, history rewrite, calculations, production merge/deploy or release version promotion. Latest exact-source Chromium/WebKit pending; physical iPhone acceptance and mixed-writer P0 open. Source-matched new demo/live artifact verification pending.

## 2026-11-02 — PR124 nasal-source Stash direct action candidate, NOT RELEASED
- App commit `7f06617e`: show direct `Prepare nasal bottle` for eligible opened nasal-source in fictional isolated DEMO only; reuse previously approved one-confirmation source→destination transaction. Stop offering action once source has no remaining mg, preserve all historical entries and identifiers. No LIVE gates changed, no schema, storage, calculation or transaction changes.
- Test `1cb85019` exercises the actual user flow; five browser/writer workflows triggered; Chromium/WebKit exact-head not verified as PASS at documentation checkpoint. No merge/deploy or production writes. Physical UAT and writer P0 pending.

## 2026-11-01 — PR124 consolidated form fix candidate PASS CI, NOT RELEASED
- Application source `1cc45e4622baa18250c3105c31990018946a12ef`, draft PR #124: pinned actual nasal preparation Review with its own scroll area and qualification text, shared outline Open Vial X for 3 remaining sheets, responsive narrow numeric fields, Goal Details keyboard tab accessibility. No modification to schema, historical records, source accounting, dosage/planner math, guarded writer or LIVE nasal gates.
- Browser/CI exact source PASS: Chromium/build #41390039557, WebKit #41390039507, mobile #41390039506, nested #41390039533, shared writer #41390039503. Chromium artifact #13117342031 ZIP CRC PASS, LIVE ZIP 26 exact source files, standalone full app isolated DEMO and offline package; WebKit visual artifact #13116139716 CRC PASS. Original nasal CTA offscreen defect reproduced on earlier test and corrected, 320/390 light/dark screenshots visually inspected in both browsers. No deployment, no user data touched, physical iPhone UAT unresolved, 16-point matrix incomplete and mixed legacy writer P0 BLOCKING. Primary Cloudflare candidate parity is not applicable before merge; do NOT call this shipped.

## 2026-11-01 — PR124 Chromium candidate artifacts verified, NOT RELEASED
- CI source d4b18b8; Chromium #41387143307 success; artifact #13116101650 valid (412-entry outer ZIP, 26-file LIVE ZIP and standalone isolated full-app DEMO), 320/390 dark/light capsule and spray Review dock visual evidence inspected. This is QA for unmerged PR #124 only; current release remains v0.9.20-beta, no production data or migration. Cloudflare parity against branch intentionally not verified, mixed-writer P0 blocking and LIVE nasal gates OFF; shared-header/16-point physical acceptance unfinished.

## 2026-11-01 — PR124 #14 capsule/spray Review action-dock candidate (NOT RELEASED)
- App CSS `9d409122`, tests through `d4b18b8`: review-only bounded capsule/spray Log Dose sheet, one scrolling summary, anchored Edit/Confirm controls. No JS, dose math, persisted schema, source attribution, ledger or data migration changes. Entry remains compact.
- Root cause evidenced by WebKit `bb213bb7` SUCCESS screenshot artifact #13115950372: 320 Review confirmation actions below initial visible sheet despite passing header checks. Corrected same-source CI pending; all 16-point and physical iPhone acceptance incomplete. PR draft, P0 BLOCKING, live nasal OFF, unmerged/undeployed.

## 2026-11-01 — PR124 normal Log Dose QA green (NOT RELEASED)
- Source `ddd6e42a` (test-only change) all five CI workflows SUCCESS. Chromium #41385255742 artifact #13115620770 348 entries CRC PASS; standalone FULL APP DEMO and 26-file exact-source LIVE ZIP verified, fictional in-memory demo isolation declared, no live sync. Injectable Log Dose 8/8 fixture cases PASS; 320/390 dark/light Review screenshot grid inspected. WebKit #41385255709 artifact #13114684921 screenshot ZIP CRC PASS and Open Vial chooser inspected at four variants.
- Version remains v0.9.20-beta; no runtime/CSS or schema modifications during this #14 QA fix. Draft PR124 only; not merged or deployed; entire 16-point screen matrix, physical iPhone UAT, and P0 mixed writer release clearance still INCOMPLETE. Both LIVE nasal gates OFF.

## 2026-11-01 — PR124 #14 Log Dose clipping QA (NOT A RELEASE)
- Test-only commits `e0687dc8`, `e301cafa`, `bfa46539`, `ddd6e42a` strengthen Entry/Focused/Review geometry assertions at 320/390 light/dark LIVE/isolated DEMO. First test candidate failed syntax preflight; subsequent `bfa46539` Chromium #41384577261 FAIL was incorrect hidden primary CTA selector in Review; `ddd6e42a` selects active visible CTA. No app runtime, CSS, storage or inventory ledger changes.
- Latest source `ddd6e42a`: WebKit #41385255709, mobile #41385255623, writer #41385255603, nested #41385255591 SUCCESS; Chromium/build #41385255742 still IN PROGRESS when last checked. Earlier failed-run artifact #13115345248 retrieved (ZIP CRC PASS); visually inspected 320px dark LIVE Entry/Focused Log Dose and Add Kit/Open Vial/nasal/compound picker target snapshots; Review missing because test stopped at false assertion. New-source artifact verification, complete 16-point matrix and physical iPhone UAT INCOMPLETE.
- PR draft/unmerged/undeployed; no production changes or data migration. P0 release safety remains BLOCKING, LIVE nasal transfer/administration gates OFF. Next action: inspect completed Chromium #41385255742 Review images, then finish shared form/header #04/#05/#07/#08/#09/#16.

## 2026-11-01 — PR #124 unmerged toast visual correction (not a release)
- Dev-only commits `fb9d7c8f` and `3b3cb5dd`: pause/resume transient Undo feedback under modal, add regression. Data model, stored entries and reversal code unchanged. No user data imported, no production deployment, no merge. Final same-head test/artifact approval PENDING. Chromium #41377738544 and WebKit #41377738574 passed on prior `7bb4e07c`; do not transfer these Pass results to newer head. Shared-writer #41382344475 fails two-tab scenario; P0 remains blocking. Physical iPhone/VoiceOver untested.

## 2026-11-01 — PR124 Open Vial corrected WebKit evidence (NOT RELEASED)
- Test-only `7bb4e07c` with runtime `21efdf23`: WebKit #41377738574 SUCCESS (136-file screenshot artifact #13111679623, CRC verified). 320/390 dark/light screenshots of compact Open Vial show header and title clear of rounded border. Chromium #41377738544 still running when observed; full screenshot matrix/physical iPhone acceptance incomplete.
- Screenshot review also exposed transient `Undo` snackbar overlaying chooser controls after prior fictional dose. OPEN UX risk; do not hide or discard Undo as a test shortcut. No production release, no data migration or ledger edits; PR draft/unmerged, P0 mixed-writer BLOCKING, LIVE nasal gates OFF.

## 2026-11-01 — PR124 Open Vial wrong modal shell fix (NOT RELEASED)
- `21efdf23`: remove incorrect `nx-dose-form` marker on physical form-first Open Vial chooser, which had inherited fixed-height 0-padding dose shell and visibly clipped the left/top heading. `7bb4e07c`: add border-inset and wrong-shell assertions to Chromium/WebKit UI test. Source `30d3f428` all five CI green but screenshot review rejected clipping. Test at corrected head pending, no data/storage/inventory impact, no merge/deploy, P0 mixed writer blocking, nasal LIVE OFF.

## 2026-11-01 — PR124 extra visual checkpoints, NOT RELEASED
- Test-only `80c03bad` adds foreground Add Kit and Open Vial form-choice screenshots to both-engine 320/390 light/dark fictional LIVE/DEMO regression. `6309aabb` foreground picker/nasal WebKit #41373419369 PASS (artifact #13110630210, 96 images). Current-head screenshot CI unfinished. No application/source-ledger changes or release; PR draft, P0 BLOCKING, nasal LIVE OFF.

## 2026-11-01 — PR124 screenshot-capture evidence gate, NOT RELEASED
- Exact application candidate `e3a34c27` passed Chromium #41367429266 / WebKit #41367429235 and three auxiliary workflows. Exact-source FULL DEMO and 26-source-file LIVE ZIP in Chromium artifact #13108271260 pass ZIP CRC; WebKit #13108320099 screenshot artifact retrieved. Visual audit found picker screenshots not reliably foreground, despite green tests. Test-only `6309aabb` adds target foreground/intersection assertions and paired screenshots (Chromium and WebKit); new-head CI pending. No app source/data, user data, production hosting or nasal feature gates altered; draft PR not merged.

## 2026-11-01 — PR124 Add Kit title capitalization follow-up (NOT RELEASED)
- `1fde47f8` restores `Add Kit`/`Edit Kit` title casing in draft modal shell. UI text only, no saved-data impact. CI/physical acceptance outstanding; no merge/deploy; P0 writer blocking; LIVE nasal gates OFF.

## 2026-11-01 — PR124 user screenshot corrective sprint (NOT RELEASED)
- Draft branch commits `33e12915`, `f9f140eb`, `451ad88b`, `5158401c`, `2447f68d`, `26e23dc4`: Add Kit header hierarchy, consistent 48px rounded SVG close, eligible Vial choice visual parity, no-clipping sheet constraints, unified compound picker styling, human-readable nasal intro. `ce5d33d1`: non-exact custom-enter picker visibility after predecessor Chromium failure.
- `9b8bc029`/`5b2e58a4`: computed `Prepared`/available prepared bottle and `Transferred` original-vial display when confirmed source mass exists in nasal bottle; **no underlying quantities, ledger, history, or storage migration changed**. Test `a48e4db1` and `07d4bcaf` added. New-head CI and fully isolated artifact audit pending; prior passes not sufficient for user-rejected geometry. Full 16-point UAT incomplete, no merge/deploy, P0 legacy mixed-writer BLOCKING, LIVE nasal gates OFF.

## 2026-11-01 — PR124 visual CI evidence accepted for narrow QA only (NOT RELEASED)
- At prior test head, Chromium #41363989984 and WebKit #41364638145 passed picker/nasal browser flow: 96 screenshots + 16 JSON reports retrieved and checked, 0 horizontal viewport violations. Chromium Log Dose #41363339799 passed 24 screenshot run, exposed an untested 36px secondary Review target; draft branch CSS `28ccb58d` fixes to 48px and new assertion `38f356b6`; test-only screenshot banner cleanup `50578f77`/`ca31d38d` pending new-head test. Data/schema/ledger unchanged. No Cloudflare production deployment, merge or physical acceptance, full 256 visual cells not completed. P0 mixed writer blocking, LIVE nasal OFF.

## 2026-11-01 — PR124 WebKit screenshot-upload CI candidate (NOT RELEASED)
- `ff824d4e` adds GitHub Actions artifact publishing for WebKit compound-picker/nasal visual screenshots and geometry JSON. Previous WebKit #41363990003 SUCCESS yet no uploaded artifact, so visual review impossible from that run. No runtime/data/storage changes. Keep PR draft and release blocked pending CI, full matrix and physical iPhone, P0 mixed writer, LIVE nasal gates OFF.

## 2026-11-01 — PR124 48px Review Back correction candidate (NOT RELEASED)
- `28ccb58d`: CSS-only override for Log Dose Review Edit details 36px legacy-specificity bug, rendering 48px; `38f356b6`: actual browser assertion for >=44px and viewport containment. Previously green Chromium #41363339799 screenshot artifact #13106129580 contains 24 Log Dose images (8 fictional width/theme/build cells) but did not catch Back target. Local equivalent CSS injection PASS four width/theme screenshots; new-head Chromium #41364394562/WebKit #41364394531 unverified. No app data/schema/ledger change, no production release. P0 writer BLOCKED, LIVE nasal OFF, draft unmerged/undeployed.

## 2026-11-01 — PR124 new screenshot test-only candidate (NOT RELEASED)
- `2f4e8d76` updates `tools/validate-formulation-stock.mjs` to capture 96 planned Chromium/WebKit picker and nasal-preparation screenshots across 320/390 light/dark fictional LIVE/DEMO builds plus JSON geometry; no application runtime or saved-data changes. CI #41363989984/#41363990003 pending. 16-point full matrix and physical acceptance incomplete. PR unmerged/undeployed; P0 blocking; LIVE nasal OFF.

## 2026-11-01 — PR124 exact-head green baseline and visual-evidence test candidate (NOT RELEASED)
- Source `27f24637`: Chromium #41362141111 SUCCESS (176 Log Dose flows/8 fictional LIVE/DEMO configurations, 96 source safety assertions); WebKit #41362141098 SUCCESS (16 fictional form sessions), mobile/nested/writer workflows SUCCESS. Targeted animation-wait regression fixed the earlier in-animation screenshot geometry test, without application changes.
- Exact-source CI artifact #13105393555 manifest `27f24637`, 26 LIVE ZIP source files present, FULL DEMO present and labeled in-memory-only. Test-only `18e63ece` adds 24 Log Dose Entry/Focused/Review screenshots+JSON geometry, pending its own CI. No production data/schema/algorithm changes; no full 256-cell visual acceptance, iPhone UAT or Cloudflare deployment verification. Draft PR/unmerged, mixed writer P0 BLOCKING, nasal LIVE gates OFF.

## 2026-11-01 — PR124 DS2 close parity + optional options test candidate (NOT RELEASED)
- Draft PR124 branch only: nine shared modal close buttons standardized to outline SVG (`0f580936`/`dd4819ea`/`6fff5770`/`cdf5b421`). New assertions for form modal/Goal Details icon/44px geometry (`ff0b050e`/`3a7b8ef1`). Additional dose options responsive and disclosure tests (`7212783e`). No data/schema/source/vial/nasal algorithm changes.
- Old focused picker `ee903da8` WebKit/mobile/writer/nested SUCCESS, Chromium build pending; combined newest application/test SHA `3a7b8ef1` full QA pending, no physical iPhone acceptance. Production unaffected. P0 mixed writer BLOCKING; LIVE nasal OFF. Draft unmerged/undeployed. Release ZIP/full-app DEMO not verified at latest SHA.

## 2026-11-01 — PR124 73e036c9 focused picker repaint candidate, NOT RELEASED
- New Other-form compound picker fix ensures subsequent user typing can reopen custom/results list after keyboard selection and delayed focusout closure. Chromium/WebKit had explicitly failed while input was focused and results present but hidden at `4086417e`. Current 73e036c9 exact-head automation in progress, physical iPhone not accepted. Data impact: none; stock/source/bottle ledger unchanged. P0 blocking, nasal LIVE OFF, PR draft/unmerged/undeployed.

## 2026-11-01 — PR124 16-point picker parity and responsive test candidate, NOT RELEASED
- Branch-only source `e394603f` removes double native/custom Other-form picker; `0ed9d03e` avoids nested five-result scroll; `bc8325a5` fixes Browse all mislabelled as compound option; `f743adba` aligns Vial custom selection accessibility/wording. Tests `bedff373`, `cc568a3f`, `1fab968c` and persistent 16-point design scorecard committed.
- Earlier Chromium/WebKit on pre-correction source failed count 6 instead of 5; newest exact-head five-workflow suite not yet fully verified. No source/bottle ledger implementation changed, historical E2E remains source-specific PASS at `66959ba7`. Existing app version unchanged, no production storage migration or live writes. P0 BLOCKING, LIVE nasal OFF, PR124 draft/unmerged/undeployed, device UAT incomplete.

## 2026-11-01 — PR124 DS2 CSS-only corrective candidate, UNRELEASED
- Commit `2b19a5de` shared form header/48px close/compact review geometry CSS on draft development branch. No JS, accounting, storage schema, production migration, version promotion or release. All 16 physical UI corrections INCOMPLETE; current-code CI/visual/iPhone not verified. Historical fictional Oxytocin browser PASS remains pinned to `66959ba7`. P0 BLOCKING; both LIVE nasal gates OFF; no merge/deploy.

## 2026-11-01 — Draft PR124 fictional Oxytocin E2E verified, NOT RELEASED
- Exact app/test SHA `66959ba7`: Chromium/build #41351301441, WebKit #41351301343, writer/mobile/nested SUCCESS. Fictional Oxytocin kit→single nasal preparation transfer→linked bottle→2-spray dose test PASS, verified original source and destination ledger. Candidate artifact #13101324932 downloaded, nested ZIP CRCs and LIVE 26-file manifest and standalone/full-app DEMO parity PASS; build label v0.9.20-beta unchanged. No user data migrated, merge, production deployment, live nasal enablement or physical iPhone acceptance. Original 16 DS2 requests not complete; P0 release hold remains.

## 2026-11-01 — PR124 Oxytocin E2E candidate, UNRELEASED
- Test commits 9dcc7c6a and bd68be8e provide exact fictional Add Kit to prepared-container Log Dose regression. Matching WebKit run 41350297385 SUCCESS, writer/mobile/nested SUCCESS, Chromium 41350297420 pending. No merge, deployment, live nasal enablement, personal-data changes or physical acceptance. UX 16-item checklist remains unresolved.

## 2026-11-01 — PR124 post-iPhone corrective source through dd4949ab; NOT RELEASED
- Added form-first two-choice Open New Vial Injectable/Nasal, reviewed DEMO-only atomic source-open+nasal prepared-bottle transfer, exact source reuse, contextual Stash linked mg/mL status and Setup, shared close/header/scroll/review corrective styling; extra fictional one-confirmation and no-write-before-review browser assertions. Commits 1e66a38f, 8c19d1f5, f3978fc3, 12735789, ad020476, fba443d3, dd4949ab follow earlier corrective CSS/markup. Current exact-head five QA NOT CERTIFIED; no source-matched new artifact verified. Data migration none; production no change. Physical iPhone UI rejection unresolved, mixed-writer P0 BLOCKED, both LIVE nasal gates OFF, PR draft/unmerged/undeployed. No version bump.

## 2026-11-01 — PR124 corrective iPhone UI sprint started, NOT RELEASED
- Real iPhone screenshots rejected earlier UI claims after corrected Chromium candidate `febed48d` passed automated QA. New source commits 51385e7b (form-first Open Vial Injectable/Nasal), 96658795/e3a94dc2/e5f4f07e/10572d0d (shared header/SVG close across product and legacy sheet), 8a398b59 (linked nasal mg/mL status and contextual guidance), b8fdaf9c (structured one-transfer Review), 58fadba8 (compact iPhone modal/review CSS); browser fixture adjustments 4e12c4c3, bb696e88, c6b918f8. No version promotion. First full/nested CI on 4e12c4c3 failed from tests that assumed old single-step Open Vial; rerun pending, do not certify new source. Remaining 16-item scope incomplete. No physical acceptance, LIVE candidate artifact, storage/schema migration, merge or deploy. P0 blocking; nasal LIVE OFF.

## 2026-11-01 — PR124 corrected Chromium and matched candidate artifacts, NOT RELEASED
- Test-only `febed48d` corrects obsolete left/right site expectations; branch draft PR #124 remains unmerged, main `da585ab3`. All five matching CI workflows SUCCESS (#41343188488 Chromium/build, #41343188622 WebKit, #41343188505 mobile, #41343188428 writer, #41343188427 nested). Exact-source artifact #13098810253 independently downloaded: outer and nested ZIP CRC PASS, 26 LIVE files match manifest, standalone full-app DEMO equals offline index and in-memory/network isolation bootstrap verified. Build retains `v0.9.20-beta` label, no version promotion.
- Data impact: no application/storage/schema change from this correction and no production writes. P0 mixed-writer release hold remains; LIVE nasal gates OFF; no physical iPhone/VoiceOver acceptance, merge, Cloudflare candidate deployment or release. Existing Cloudflare parity report is not an approval or deployment result.

## 2026-11-01 — Draft PR124 shared form consolidation checkpoint, NOT RELEASED
- a6b68f5e shared DS2 inventory/product-form header, f922fa16 Goal Details shared hierarchy, ee087bc7 Goal responsive styles, d471c178 Goal browser assertions. Source-level changes only; exact-head Chromium/WebKit pending. No storage migration, release promotion, artifact verification, merge, deployment or physical iPhone acceptance. P0 blocking; LIVE nasal gates OFF.

## 2026-11-01 — PR124 shared nasal review corrections, NOT RELEASED
- Source commits 38edd27e (actual preparation Review), 1f35b65f (spray balance/opaque bottle label), 1384fc6d (review regression), 5434b01f (responsive shared review CSS). Initial Chromium/WebKit failed; corrected exact-head run pending. No version bump, no artifact parity verification, no live write gate enablement, no merge/deploy or iPhone acceptance. P0 remains blocking.

## 2026-11-01 — Draft PR124 Plans 320px test-race fix verified, NOT RELEASED
- Test-only correction 20079810 stabilizes 320px View goal assertion after awaited Goal status save and render, preserving >=44px check. Full five-workflow CI SUCCESS on ebc09e46: #41332954450 Chromium/build, #41332954367 WebKit, #41332954453 mobile, #41332954503 shared writer, #41332954461 nested. Previously failed browser #41328859453 remains historical FAIL, not retroactively rewritten.
- Source-matched artifact #13094725721 verified outer/inner ZIP CRC, 26 LIVE files, ordered 01–12 JS, isolated standalone/full-app DEMO and manifest source. Build version label v0.9.20-beta, no version promotion. No application storage/schema change from this test fix. Physical iPhone/VoiceOver acceptance outstanding; P0 legacy mixed writer unresolved and live nasal gates OFF. PR draft/unmerged/undeployed; Cloudflare source parity NOT VERIFIED for candidate; user production data unchanged.

## 2026-11-01 — Test-only Plans race stabilization, PR124 NOT RELEASED
- Commit 20079810 amends asynchronous Goal status browser test to await acknowledged sheet dismissal and visible rerendered View goal before retaining 44px geometry assertion. No application behaviour or version change. New exact-head five GitHub Actions checks initiated; no PASS claim yet. Exact-head artifact, real iPhone and VoiceOver outstanding. P0 remains blocking; nasal live gates OFF. No merge or Cloudflare deployment.

## 2026-11-01 — PR124 QA evidence update, NOT RELEASED
- Tested candidate 2457a657: all five exact-application-source GitHub workflows SUCCESS (#41327745230 Chromium/full, #41327745218 WebKit, #41327745251 mobile, #41327745323 writer, #41327745216 nested). Prior reported 26-file LIVE ZIP/isolated full-app DEMO artifact #13092541470 not re-downloaded/reverified this session.
- Follow-up continuity-only head 62e0c126 has a new failed full browser workflow #41328859453 due to 320px zero-height Plans View goal target. Other four follow-up workflows succeeded. No change labelled tested release or deployed; failure needs triage and a fresh source-matched green run.
- Guided device acceptance expanded in the existing permanent iPhone QA Playbook; results remain NOT TESTED physically. P0 mixed legacy writers and live nasal gates are BLOCKED/OFF. Version bump, physical acceptance, approved merge, Cloudflare deployment and release verification NOT DONE. Production data unchanged.

## 2026-11-01 — Draft actual-handler concurrency test, NOT RELEASED
- e1d3966f adds true Chromium two-tab tests invoking application settings/history commit helpers. No test pass evidence, remaining ordinary save callers unconverted, no live nasal/merge/deploy.

## 2026-11-01 — Draft Chromium cross-tab regression, NOT RELEASED
- 6db79cd6 adds real Chromium two-tab actual-storage-key coordinator race coverage, including stale rejection and quota simulation. Results pending; full caller migration not complete. No live nasal, merge or deployment.

## 2026-11-01 — Draft Today tracking persistence fix, NOT RELEASED
- 77f3e722 converts Today tracking activity selection to awaited exclusive scoped writer. Other ordinary saves remain unsafe; no release or deployment.

## 2026-11-01 — Draft exclusive history validation fix, NOT RELEASED
- 9d4c3548 fixes double-escaped date validation for scoped supplement history upsert; dff9ace2 / 322f7d26 add/order targeted tests. P0 not resolved, no merge or deployment.

## 2026-11-01 — Draft partial writer migration, NOT RELEASED
- 39b63fc8 validated scoped Quick Access settings; 3a87012e awaited UI commit for toggle/reset; c100806d targeted fictional regression tests. No global ordinary-writer migration, no live nasal enablement, no merge/deployment.

## 2026-11-01 — Draft safety gate, NOT RELEASED
- 105f5e25 adds deliberately failing mixed-writer release gate; c3971a8f adds nasal overdraw and replay tests. No claim of P0 resolution, live activation, artifact verification, merge or deployment.

## 2026-11-01 — Additional corrective code/test, NOT RELEASED
- 0e385399 320/390 page QA; f1d1347d two-stage entry/review; 1e9f0ba4 DS2 stage styling; 6a670778 fix first prepared nasal history; 4db8f6a7 correct DEMO spray error; c6572fa1 first-nasal-dose/undo unit fixture. Draft PR124 only. Checks pending, no production activation, merge, or deployment. No data migration.

## 2026-11-01 — Additional draft commits, NOT RELEASED
- 392998ac DEMO new-vial nasal preparation continuation; 6c90120e linked prepared-vs-source card label; b8c04888 prepared summary style. Latest app checkpoint b8c04888941b7e07a0a78aa56138d73d2bf1d5bc. CI initiated, no results claimed, package/merge/deploy incomplete.

## 2026-11-01 — PR124 corrective working commits, NOT RELEASED
- Draft-only commits: 1fc20386 (oral/nasal single-choice navigation and modal tags), faa9d6b5 (DS2 responsive modal treatment), 0d841fc9 (nasal demo legacy handoff and action placement), fc49debb (action styling). Base main da585ab3.
- No merge/deployment, no production storage modification, no safety gate enablement. Latest-head CI, complete matching LIVE/DEMO package and physical iPhone reacceptance NOT VERIFIED. Existing prior QA on 9752ab64 cannot validate these new commits. LIVE prepared nasal transfers and spray writes remain P0 blocked.

## 2026-11-01 — PR124 exact-source capsule/P14 and DEMO-only nasal QA candidate (UNRELEASED)
- Candidate app/test 9752ab6415a1f815ce6e6696ab21609ea7651cb4; full Chromium #41273119998 and four associated WebKit/mobile/nested/scoped-writer runs SUCCESS. Capsule count exact source, independent log, overdraw guard, history and undo implemented; isolated fictional DEMO direct nasal preparation and spray count with transfer attribution; Pause All/Resume All and DS2 retained. Live nasal transfer/admin safety gates remain OFF due mixed legacy writer P0; topical and retrospectively edited container-backed log unsupported.
- GitHub artifact #13069419875 downloaded, exact source SHA and 26-file LIVE ZIP/standalone isolated full-app DEMO/CRC/source hashes verified and exported; no new production version bump, no data migration or live writes, PR draft/unmerged/undeployed; physical iPhone NOT TESTED.

## 2026-11-01 — PR124 capsule and isolated nasal-form candidate (UNRELEASED)
- Current development app/test SHA 9c84350e3dc8ab8ff243d41a959a9ad424a1c000. New exact-container capsule dose planner+undo (455d672/a9510e2), adaptive capsule Log Dose (4555428/aca8af7), reserved nasal source planner correction (0d113f0), recorded nasal preparation pure planner (9c32d37), isolated DEMO Stash nasal form (1737f37), isolated DEMO nasal spray-count Log Dose (b3f253c) and extended Chromium/WebKit fictional regression (2847ba8/78b2aca/9c84350). P14 Pause All and prior DS2 remain preserved.
- Code is DRAFT; exact-head full browser/WebKit and artifact inspection pending. Live nasal transfer/administration gates OFF pending unresolved legacy mixed-writer P0; nominal values do not validate actual delivery or product preparation. No production storage writes, migration, PR merge or deployment. Real iPhone acceptance NOT TESTED.

## 2026-10-31 / Nov 1 UTC — PR124 form/route/DS2 build candidate TESTED, NOT RELEASED
- Source 2081b9009ca6399ab4aff0462c8311f91a16220c, manifest v0.9.20-beta (no production version increment). Exact-source full Chromium #41266959886 SUCCESS; WebKit #41266959863, mobile #41266959817, nested #41266959810, scoped writer #41266959808 SUCCESS. Previous #41266681030 FAILED nasal guidance; fixed and rerun.
- Source changes across branch: Stash form-only setup (Injectable/Nasal/Oral/Topical/Other) and numeric vial list; per-dose method visibility, conditional injection site, independent no-protocol picker, exact-source compatible physical-vial matching, safeguarded exclusive writer; DS2 Supplies-matched buttons and clearer Log Dose hierarchy/options; nasal plan clarity without creating prepared stock. 176 Log Dose, 96 source assertions, 8 mobile matrices, 80 math diagnostics pass (nonclinical).
- Downloaded/verified artifact #13067263622. Outer/inner archive CRC PASS, LIVE root index + 26 files and exact manifest file list, six Git source blob matches, standalone full-app DEMO = offline index bytes, in-memory storage and network block confirmed. LIVE/DEMO user-facing deliverables and release notes exported in chat.
- No destructive migration/user-data write, PR124 still draft/unmerged, production not deployed, physical iPhone acceptance pending, mixed writer P0 open, oral-container exclusive debit and nasal prepared transfer unsupported. Release INCOMPLETE.

## 2026-10-31 / Nov 1 UTC — Unreleased shared physical form lookup correction
- Code 0e247f5 aligns shared getEligibleSourceKits with canonical nexusPhysicalVialCompatible form mapping; tests e07c623/42e09f update legacy form expectations and e49853f covers SubQ/IM shared physical family with IV/nasal guarded. Previous full #41266340372 failed stale SubQ assertion despite early actual browser writer checks passing; latest full #41266633696 and WebKit #41266633690 pending. No migration, merge, deploy, or user-data writes.

## 2026-10-31 / Nov 1 UTC — PR124 coordinated form/route integration checks (UNRELEASED)
- Updated stale DS2 test expectation in 8a983222 to match stored Injectable family, not old SubQ method. Extended browser/WebKit source-choice checks in ab89db0 for route-switch no-write and no-protocol physical stock discovery. Existing draft code includes family/route separation, DS2 style work and numeric vial ordering from prior branch work, but exact current release source must pass integrated CI. Full app demo and LIVE bundle NOT REGENERATED/VERIFIED on this latest test SHA. No merge/deploy, no data migration. Existing P0 writer open.

## 2026-10-31 — New PR124 physical feedback and source-model discovery (NOT RELEASED)
- Main da585ab3, draft PR124 2dad70b at start, last tested DEMO 9ef27f9. User visual Stash cases 01/02 Pass; case 03 Not Tested. New screenshots show product-form versus per-dose-route mismatch, hidden dose method, no-protocol compound discovery gap, unsorted vials and DS2 visual problems.
- Verified exact-match route source filters and authoritative writer; nasal plan only metadata. Work logged as source-model rework requirement. No migration, source change, new artifact, merge or deployment in this discovery step. Mixed writer P0 open.

## 2026-10-31/Nov 1 UTC — PR124 purple Stash candidate QA (NOT RELEASED)
- App/CSS 9ef27f986d28d9278c521f5493811316e69f259f; full Chromium #41263023868 SUCCESS; WebKit #41263023879 SUCCESS; mobile #41263023829 SUCCESS; nested #41263023831 SUCCESS; scoped writer #41263023853 SUCCESS. Corrected purple primary and lavender open-vial secondary in light theme. Standalone full app DEMO and complete LIVE ZIP obtained from source-matched GitHub artifact #13065749673, CRC and contents verified. No data migration, merge or deployment. Physical iPhone acceptance pending and P0 cross-tab mixed writer remains unresolved.

## 2026-10-31 — PR124 light-mode Stash purple correction (UNRELEASED)
- CSS 9ef27f9 replaces near-black primary Set up vial with purple and softens expanded Open new vial secondary to lavender in light theme. No business logic, inventory or storage changes. Pre-fix browser run #41261696707 success does not verify post-fix colour. Post-fix artifact and physical device acceptance pending; draft PR #124 unmerged and not deployed; mixed-writer P0 still open.

## 2026-10-31 — PR124 Stash light/dark action styling candidate (NOT RELEASED)
- CSS d9cb70a6; Stash browser regression extensions 5e9f73e/754e3a8. Collapsed card hierarchy unchanged; buttons/focus, expanded use setup, warning and secondary open-vial action themed consistently. No data migration or production storage writes.
- Exact-source QA #41261696707/#41261696687 and complete LIVE/DEMO artifacts NOT VERIFIED at this note; previous source tests do not validate new CSS. Physical iPhone not yet accepted. Mixed writer P0 unresolved. Unmerged draft PR #124; no deploy.

## 2026-10-31 — PR124 Log Dose conditional source candidate (TESTED ON CI; NOT RELEASED)
- Code commits ece3780, d574c5dd; test commits ef8b297, 200db956e513166e5420d5533e570f49088d6023. One actionable vial source panel, method-appropriate site, functional Edit defaults handoff; legacy exact-source safety preserved.
- Exact app/test SHA 200db956 full Chromium #41259356814 SUCCESS (176 Log Dose flows; 231/233px card heights, 80/80 measurement diagnostics) and WebKit #41259356810 SUCCESS; mobile #41259356838, shared writer #41259356777, nested #41259356808 SUCCESS.
- Release artifact 13064338609, outer 180 files integrity verified; LIVE ZIP 26 files, complete standalone DEMO (2,949,147 bytes), offline demo ZIP CRC verified; build manifest reports version v0.9.20-beta and source 200db956. Documentation commits later do not change source. User data not modified; no migration, not merged, not deployed, physical iPhone not accepted. Outstanding mixed-writer P0. Next: physical acceptance, then writer safety closure before merge.

## 2026-10-31 — PR124 Log Dose cleanup (UNRELEASED)
- Code d574c5d, Stash test ef8b297, WebKit/Chromium test 200db95, prior Log Dose handler code ece3780. Fix Edit defaults wiring, contextual site, simplify source cards and conditional legacy confirmation. Source-only candidate, no merge/deploy or migrations.
- Historical full QA 41258715620: Log Dose 176 flows PASS, Stash 320=231px and 390=233px PASS, overall FAILED on stale sealed-vial test. Latest-source QA/artifact and iPhone acceptance NOT VERIFIED. P0 mixed writer remains blocker.

## 2026-10-31 — Exclusive backed physical Log Dose source audit and additional failure tests
- Verified main da585ab3 and draft PR124 source cc0d293a at start. Previous untracked slice full Chromium #41228001797, WebKit #41228001558, nested #41228001621, shared writer #41228001525 and mobile #41228001521 all SUCCESS. Full-build artifact #13053211462 exists (16,721,290 bytes, not expired); archive contents NOT independently inspected.
- Current PR source already implements nexusPlanBackedPhysicalDose and nexusCommitBackedPhysicalDose in assets/js/01-nexus.js and fresh physical dose branch in assets/js/05-nexus.js. Pinned open exact-vial IDs, compatible kit/name/method, source mass and totals, no sealed/finished sources, duplicate dose IDs; debit physical mg and record native-unit allocations + dose history in one exclusive Web-Locked transaction with readback and stale fail-closed. DEMO in-memory only; no migration or production writes.
- Existing backed source CI at cc0d293a: shared writer #41228600611, WebKit #41228600577, mobile #41228600582, nested #41228600578 SUCCESS; full browser #41228600708 IN PROGRESS when checked. Tests include simulated two-tab stale conflict, split mg/mcg, insufficiency, route/kit mismatch, duplicate allocations, sealed/finished, quota and DEMO isolation. New tests for missing lock and corrupt readback committed a601392b; their CI result NOT YET VERIFIED.
- Remaining P0: blend, backed edits, prepared-source history, quick dose, undo and unrelated legacy synchronous whole-state writes bypass cross-tab lock. Actual two independent browser tabs and physical iPhone acceptance NOT TESTED. Current-source FULL_DEMO and LIVE ZIP NOT VERIFIED. PR draft/unmerged/undeployed, prepared flags OFF. NEXT ONE ACTION: verify a601392b CI/artifacts then migrate backed dose edit/undo with exact event attribution and two-browser-tab tests.

## 2026-10-31 — First exclusive Log Dose vertical slice CODED / targeted writer CI PASS; full QA pending
- Baseline main da585ab3458394ddf5e88e283b210933beeab810; PR124 draft. Implemented **UNTRACKED** Log Dose create/edit only, not backed physical-vial dose: assets/js/01-nexus.js helper nexusCommitUntrackedDose and assets/js/05-nexus.js async Confirm. Clone state, acquire existing cross-tab exclusive Web Lock via nexusWriter().transaction, validate stale snapshot, add/edit dose + reschedule association inside one durable state commit, update in-memory state only after verified storage readback; failed commit keeps modal and draft open. Prevent double submission while pending. Fictional DEMO commits only to in-memory clone, no production storage writes. Does not debit physical inventory. No migration or storage-key change.
- Added actual helper source-based two isolated-tab tests in tests/write-coordinator.test.cjs (exclusive lock, stale second tab, edit, no inventory debit, demo isolation, quota failure). Updated tools/validate-save-acknowledgement.mjs from 4 synchronous Log Dose guarded paths to 3 synchronous + 1 exclusive guarded path. First implementation CI runs failed due to wrong onclick async anchor and outdated validator, then corrected at a14f2143 and 0343a20b. Latest shared writer CI #41228001525 COMPLETED/SUCCESS. Latest full browser #41228001797 IN PROGRESS at last check; do not mark full pass until result. This is NOT proof of actual two-browser-tab timing or physical iPhone acceptance.
- **P0 still OPEN:** ordinary inventory-backed Log Dose, blend dose, quick dose, undo, edits and unrelated synchronous whole-state writes still bypass cross-tab lock. Two independent real browser tabs still not tested. No release/merge/deploy; prepared gates OFF. P-14 Pause All Protocols remains backlog only.
- NEXT ONE ACTION: verify final source-head full browser, WebKit and mobile CI; inspect release artifact and run physical iPhone untracked create/edit and failed-save acceptance; then migrate backed Log Dose exact-source inventory transaction with fail-closed tests.

## 2026-10-31 — PR124 mixed-tab legacy/exclusive writer audit: REPRODUCED P0 GAP
- Baseline main da585ab3, feature head before tests 97842bfd; draft PR124 unmerged. Exact coordinator assets/js/nexus-write-coordinator.js blob dbd34b0a extracted from source-matched CI artifact #13051662254.
- Source: assets/js/01-nexus.js saveState() uses synchronous nexusWriter().saveLegacy(state). Writer saveLegacy checks only its OWN inFlight boolean and snapshot but never takes navigator.locks; transaction holds a real exclusive Web Lock. Each tab has separate writer inFlight. Thus cross-tab ordinary save is not mutually excluded.
- Repro committed tools/diagnose-mixed-tab-writes.cjs at ed1af2a0 (manual invocation node tools/diagnose-mixed-tab-writes.cjs). Two isolated V8 tab contexts, shared fictional backing store/lock: Tab A acquired exclusive stock lock and paused; Tab B saveLegacy COMMITTED settings while A held lock; A then REJECTED stale state. Vial remained fictional 10 mg, zero doses: NO data loss observed in this interleaving. Same-tab legacy save correctly rejected during own transaction. Diagnostic intentionally exits 1 as FAIL_SAFETY_GATE.
- LIMIT: this is deterministic two-tab-isolate simulation, not two live browser processes. Actual Playwright local-origin navigation blocked by ERR_BLOCKED_BY_ADMINISTRATOR in this environment; true two-browser-tab timing tests BLOCKED, not PASS. No production or personal data touched.
- P0 resolution: unify ALL ordinary dose/history and stock-changing full-state writers under a shared exclusive cross-tab transaction protocol or a separately proven equivalent; preserve fail-closed stale/quota/readback and exact IDs. Then run real two-tab conflicts dose/dose, dose/stock, outflow/undo, setting/check-in vs stock and crash/reload; verify no lost records, no phantom stock or success UI. Prepared transfer and nasal administration flags remain OFF.
- P-14 global Pause All Protocols idea added to docs/product/NEXUS_MASTER_ROADMAP.md (commit e0890898), IDEA ONLY, reversible overlay default, preserve individually paused/completed states, phase dates, reminders and history. Not approved for implementation.
- PR124 status safety BLOCKED, no merge/deploy. NEXT ONE ACTION: implement or design one fully exclusive ordinary Log Dose save vertical slice, with real-browser conflict regression before broader writer migration.

## 2026-10-31 — CURRENT PR124 calculator diagnostic 80/80 PASS (historical 40/80 FAIL superseded for tested cases)
- PR124 head before report d927ac52c442ea2f934b660f0879a7c9520ae289, main da585ab3458394ddf5e88e283b210933beeab810, draft/unmerged. Full release workflow #41224547836 SUCCESS, artifact #13051662254 independently downloaded; outer ZIP CRC PASS, exact 26-file LIVE ZIP CRC PASS. Build manifest uses GitHub PR merge test commit 959d972d0de1d0064772cd0fbf0ddad5ea6de6b3. Calculator assets/js/10-nexus.js blob 9d84d5bed45f7c4a51fa3932e5e486ff472a9e1c and gate module 04-nexus.js blob 208200e6b441c609be9325c1a2e1743ab566575a EXACTLY match PR feature branch files.
- Artifact's Nexus_v0.9.20-beta_MEASUREMENT_MATH_DIAGNOSTIC.json: 8 GitHub isolated contexts (LIVE localhost and standalone FULL DEMO × 320/390 × light/dark), 10 checks per context = 80 PASS / 0 FAIL. All historical failure groups now PASS: 30u/50u displayed equals U-100 equivalent, capacity invariant, unsupported IU and negative input rejected. Also 100u, mg↔mcg equality, empty, zero-volume and no JS exceptions PASS. Fictional 10mg vial + 2mL diluent + 1mg input gives 20 U-100 units in 30/50/100 syringes; 1000mcg equivalent. TESTED DIAGNOSTIC only, not clinical or comprehensive dose safety clearance.
- Independent Playwright Chromium evaluated exact verified standalone FULL_DEMO HTML in ephemeral in-memory browser contexts: 80 PASS/0 FAIL across eight repetitions of synthetic configurations. Sandbox blocked localhost/file URL navigation, so independent reproduction used in-memory set_content for both labels, establishing four UNIQUE width/theme DEMO settings, not eight distinct LIVE/DEMO origins; GitHub CI supplies actual LIVE+DEMO comparison. Initial custom harness over-escaped regex text captures, causing misleading 48/32; correcting only the test harness (not app) yielded 80/0; those 32 were NOT app failures.
- CLASSIFICATION: historical 40/80 remains recorded as past failure; current candidate 80/80 PASS for same deterministic assertions. This calculator diagnostic P0 gate is RESOLVED for tested cases, but mixed synchronous/exclusive cross-tab stock writers, untested dose/source combinations, physical iPhone calculator interaction, and release approval remain blockers. Prepared-transfer and prepared-nasal gates both verified FALSE. No app calculator source modification, real data writes, merge or deployment.
- NEXT ONE ACTION: audit two-tab conflicting inventory and legacy whole-state writers on exact PR source and address verified failures, preserving production data and disabled feature flags.

## 2026-10-31 — PR124 Backup/Restore child physical acceptance achieved (NOT RELEASED)
- Physical iPhone Safari acceptance provided by user: all 9 checks PASS, Notes None, fictional DEMO/backup only, no production user data. Includes keyboard and focus with external keyboard/VoiceOver, responsive light/dark modal, Cancel/Close no-write. Separate corrected Chromium run #41178820238 SUCCESS and screenshot timing CI #41211810566 SUCCESS. Draft PR124 unmerged, undeployed; no approval to merge/deploy; no version change. Does not validate all PR124 feature gates, calculator safety or real historical data.

## 2026-10-31 — PR124 expanded restore automated acceptance (NOT A RELEASE)
- Full expanded Chromium #41178820238 SUCCESS; artifact #13034107579 verified CRC 180 outer / 26 LIVE, manifest f12d63e. 320/390 light/dark fictional restored-preview keyboard/focus/no-write PASS (QA JSON). Four screenshots inspected, but some captured mid-animation/faded; timing-only test follow-up b445679eb8ad346c4906f558271ad0615647f91b pending. No runtime feature changes, no saved-data writes, production unchanged. Physical iPhone/VoiceOver NOT TESTED, PR124 draft/unmerged/undeployed.

## 2026-10-31 — PR124 corrected Settings child QA verified, NOT RELEASED
- Corrected full build Chromium #41178615573 SUCCESS, source-matched artifact #13033234592 outer ZIP CRC PASS / LIVE 26 file CRC PASS / isolated standalone FULL_DEMO included. Independent corrected-source Playwright fictional restore modal matrix 4/4 PASS 320/390 light/dark: keyboard typing, enabled/disabled confirmation, 44px layout, focus return, no-write dismissals, long filename. Reduced-height viewport approximation also checked. New expanded CI #41178820238 pending, physical iPhone and VoiceOver not accepted. PR remains draft, main da585ab3, production v0.9.20-beta, no merge/deploy.

## 2026-10-31 — Backup/Restore child QA evidence only (NOT RELEASED)
- No code change or release triggered by independent earlier-source four-viewport Chromium DEMO test (4/4 PASS). Existing draft PR124 screenshot evidence 13034276111 passed nested audit. Requested current-head Chromium runs 41178615573, 41178814456 and newer 41178820238 remain IN PROGRESS (not PASS); no verified current-head LIVE/DEMO package, real iPhone acceptance, merge or Cloudflare deployment. Both prepared gates OFF.

## 2026-10-31 — PR124 automated restore-child QA expansion (NOT A RELEASE)
- No production code change beyond earlier Settings child acddbe2d and correction f4aba4f. New test commit 1e7b647 adds four-width/theme keyboard/focus/no-write browser assertions and screenshots to existing full-app DEMO build gate. Existing DS2 evidence 13034276111 inspected; full corrected Chromium 41178615573 and new assertions 41178820238 not yet conclusively verified. Remains draft/unmerged/undeployed, published version v0.9.20-beta, physical iPhone unaccepted.

## 2026-10-31 — PR124 Profile/Settings child fixes (NOT RELEASED)
- Draft code acddbe2d0f72c2323c3a4bc3f24d82a2e4110f08 touches assets/js/11-nexus.js only: 44px Units controls, restore filename wrapping, responsive action buttons, close/cancel focus return, truthful conditional recovery-copy success message. No schema migration or intended stock/dose data writes. Existing published product remains v0.9.20-beta; prior full Chromium run 41170672260 PASS is PRE-PATCH evidence only. New-head automated/mobile/WebKit/physical tests, complete matching LIVE ZIP and isolated standalone full-app DEMO INCOMPLETE. No merge/deploy.

## 2026-10-31 — Draft PR124 retirement UX visual QA evidence (no release)
- Simplified sheet source b6a5b778 and browser assertion 67b6f5b; DS2 nested visual 41170672326 SUCCESS, real screenshots checked at 320 light/dark and 390 light/dark (artifact 13030633352). Writer safety 41170672364, mobile 41170672321, WebKit 41170672264 SUCCESS. Full Chromium 41170672260 still pending final result. Latest full LIVE/DEMO artifact 13030787463 independently verified (26 LIVE, CRC, 09 Git blob af138ad3, DEMO byte parity, gates off). Not merged, deployed or physically accepted; product version still v0.9.20-beta.

## 2026-10-31 — Screenshot-informed retirement sheet copy iteration, draft only
- Nested visual #41170501525 SUCCESS and evidence artifact #13030128989 showed multi-line title and CTA at 320px in both themes. Source-only UX b6a5b778 simplifies labels and explanation, browser assertion 67b6f5b updates expectation; current head browser/visual/dedicated checks pending. Exact-source original candidate artifact #13031181162 was independently CRC / 26 LIVE / isolated full-demo verified before copy iteration; must regenerate for latest code. No release, merge, primary Cloudflare deploy, production storage writes or iPhone acceptance.

## 2026-10-31 — UX refinement of draft Mark Kit Done and Settings Back, NOT RELEASED
- Previous exact-vial Mark Kit Done full browser workflow 41169592533 SUCCESS confirmed (pre-refinement). Subsequent draft commits 9d64d3ff/ fb15280b /f9b29abd simplify retirement summary, disable irrelevant reasons and route partial flow (including blends), 51770aa9 makes consistent Settings child chevron; browser updated 454e3988, UX static source test c71f4e90, CI e6c5b536/306b3f2b. New-source QA and exact-matching LIVE/DEMO PENDING. No version bump, release, merge, deploy, personal user data migration or iPhone acceptance. Both prepared flags OFF.

## 2026-10-31 — Mark Kit Done exact physical multi-vial candidate, NOT RELEASED
- Earlier Edit Outflow browser #41168309682 SUCCESS. New code 1239b519, Node regression 295336d3, CI 04d82e44/bd01526b, browser e68b4797, static guard 798386bc. New-head tests and exact-source 26-file LIVE/isolated full-app DEMO still PENDING. Addresses unallocated kit-level partial waste vs unconditional physical zeroing. Future audit is additive; no existing production user records changed or migrated. Main da585ab3 unchanged; PR draft, unmerged, undeployed, physical iPhone not accepted, both prepared flags OFF.

## 2026-10-31 — PR124 Edit Outflow candidate QA and artifact, NOT RELEASED
- Edit Outflow physical-vial atomic edit code `513b6818` plus tests `a4385850`/`ff356c4b`, static ownership `36b7fd19`, browser fixture reload `4d7bdaf3`. Writer `41168309957` SUCCESS, mobile `41168309676` SUCCESS, WebKit `41168309805` SUCCESS. Full Chromium `41168156470` FAILED due to synthetic test storage banner blocking unrelated Stash Save; corrected browser fixture, rerun `41168309682` IN PROGRESS. Artifact `13030115952` complete source-matched LIVE/DEMO verified (outer/nested ZIP CRC PASS, 26 file LIVE and DEMO byte parity). No release tag, merge, deploy, production storage changes, iPhone approval or feature gate activation.

## 2026-10-31 — PR124 exclusive Edit Outflow development candidate, NOT RELEASED
- Existing physical outflow full browser #41167155593 verified SUCCESS (earlier source). New immutable Edit Outflow planner/UI in 513b6818, fictional Node test a4385850, safety/full CI dca36354/f13a3d56, actual Chromium form edit/Undo parity test ff356c4b, static ownership guard 36b7fd19. Current head CI/artifact FULL DEMO parity PENDING; no production releases, migration, main merge, Cloudflare deploy, personal-data writes or physical iPhone acceptance. Keep both prepared flags off.

## 2026-10-31 — PR124 physical outflow/inverse candidate, NOT RELEASED
- Previous correction full browser `41145959949` SUCCESS, including browser and artifact steps. New physical Log Outflow and Undo on draft PR124: exact-source immutable planner and UI, exclusive writer, event-linked inverse, and new Chromium picker/undo test `efe9b7cc`; reconciled duplicate inverse in `6e0c7cd1`. Dedicated new-head QA and complete LIVE/DEMO source-parity verification PENDING; no physical iPhone, merge, deploy, production localStorage migration or real-user writes. Main `da585ab3`, version `v0.9.20-beta`, both prepared gates OFF.

## 2026-10-30 — PR124 manual correction isolated CI PASS, NOT RELEASED
- Manual correction application `a56c4c0d`, VM fictional tests `fa2aa482`, typo fix `68df4f39` (original CI failed), browser form test `3a122e8e`, ownership guard `e35de363`. Dedicated shared writer `41145959785` SUCCESS, complete LIVE/DEMO artifact `13021610850` downloaded/exact-source inspected, mobile `41145959902` SUCCESS. Full browser `41145959949` pending at time of documentation; not a release. No main change, production storage impact, merge, deploy, real-iPhone acceptance or prepared-feature activation.

## 2026-10-30 — PR124 Adjust Remaining Amount exclusivity candidate, NOT RELEASED
- Main `da585ab3`, version remains `v0.9.20-beta`. Restock full-browser `41142799429` is newly verified SUCCESS for prior source only. New manual correction candidate: `da856e63` immutable exact-vial adjustment, `a56c4c0d` transferred-source fail-closed, `fa2aa482` Node tests, `87c78289` and `c5edb926` CI wiring, `3a122e8e` actual Chromium form test and `e35de363` static guard. Independent model-level planner/coordinator fictional checks PASS; GitHub current-head CI/browser/artifact parity PENDING. No user data writes, localStorage migration, release tag, merge, Cloudflare deploy or iPhone physical acceptance. Other synchronous writers/transfer inverse/calibration remain blockers; prepared flags OFF.

## 2026-10-30 — Add Vials dedicated safety / package verified, still NOT RELEASED
- Application/guard `546441ab`; dedicated writer CI `41142799501` SUCCESS, mobile `41142799457` SUCCESS, nested `41142799419` SUCCESS. Dedicated full-app artifact `13019931495` obtained and CRC PASS, LIVE 26 files and isolated DEMO parity PASS. Full Chromium `41142799429` and WebKit `41142799430` pending. No physical iPhone test, merge/deploy, production localStorage writes or schema migration. Runtime prepared gates false.

## 2026-10-30 — PR124 Add Vials exclusive restock candidate, NOT RELEASED
- Development v0.9.20-beta unchanged. `fa40d091` immutable exact-ID Add Vials + inverse, `33d036cf`/`17313adb` fictional Node regression, `014d85c2`/`b346f1e2` dedicated/full CI, `bce66ebc` actual browser UI test, `546441ab` static writer guard. Previously pending full browser `41139878373` for pre-restock application source `4a3d9a0e` verified SUCCESS, NOT transferable to new head. Current restock writer CI/artifact parity PENDING, real iPhone NOT TESTED. No production migration, writes, release tag, merge or Cloudflare deployment; nasal/transfer live gates remain FALSE.

## 2026-10-30 — PR124 exact source picker candidate, NOT RELEASED
- Source `4a3d9a0e`: `bd4218d5` requires explicit sealed-vial picker and `4a3d9a0e` extends fictional Chromium UI test. Dedicated writer-safety workflow `41139878408` SUCCESS with 26-file source-matched LIVE ZIP and isolated full-app DEMO artifact `13018531897`; downloaded ZIP CRC checks PASS, offline DEMO/standalone parity PASS. Full browser and remaining visual/mobile workflows PENDING at time recorded. No user data writes, merge, production deploy or iPhone physical acceptance. All prepared nasal/transfer gates OFF.

## 2026-10-30 — PR124 exclusive Add to Open Vial candidate, NOT RELEASED
- Draft development branch only. `4328b015` exclusive add/inverse; `895b282c` stale/unmigrated and metadata guard; `a15c4e3c` zero-outflow inverse; `cbca5db7` and `59ef6473` fictional Node tests; `b615f054` and `ba7cc67f` CI integration; `c35ddb95` actual browser form+Undo fixture. **New-head checks NOT VERIFIED yet**, so test and complete LIVE/DEMO package states remain PENDING. No release number increment, production data writes, destructive migration, merge, Cloudflare deploy or physical iPhone acceptance. Stock mutation retains exact source and audit; existing legacy synchronous writer race remains an explicit blocker; nasal/transfer gates OFF.

## 2026-10-30 — PR124 prepared formulation source lifecycle, fully browser-tested candidate, NOT RELEASED
- Application/test commit 20417719, draft PR124, source main da585ab3. Five CI workflows SUCCESS: full/browser 41124614826, writer safety 41124614657, WebKit 41124614736, mobile 41124614764, nested 41124614854. Complete full run artifact 13009354265; source-matched dedicated 13009662729 LIVE ZIP 26/26 Git blob parity, CRC PASS, standalone and offline DEMO byte match. New immutable source-to-container ledger and guarded prepared dose/reverse preserve canonical vial stock; no data migration, live feature activation, app release tag, merge, Cloudflare deploy or physical iPhone acceptance. No real source transfer reversible editing yet; legacy cross-tab lock gap still P0 blocker.

## 2026-10-30 — PR124 prepared source transfer-to-formulation candidate, NOT RELEASED
- Development version v0.9.20-beta continued; main da585ab3 unmodified. Commits 87b9eb2a (pure vial-to-nasal-formulation transfer), 8cea4f99 (fictional lifecycle regression), 02fbc658 (disabled runtime destination routing), 01b6e6f3 (negative balance fail closed), cc331116/20417719 (CI). Dedicated safety run 41124614657 SUCCESS, artifact 13009662729 LIVE 26 entries CRC, offline DEMO 2 entries CRC, standalone/offline byte match; local full-app Chromium four-theme/width fictional transfer/dose/reverse tests PASS. No physical vial ledger migration, historical rewrite, production storage write, user-data import, merge, Cloudflare deployment or iPhone acceptance. Prepared live transfer and nasal stock administration controls OFF due legacy cross-tab writer and reversal gaps. Full browser 41124614826 pending at documentation.

## 2026-10-30 — PR124 exclusive prepared nasal writer path CODED, NOT RELEASED
- Development v0.9.20-beta candidate. 8dbf9bfa engine; 40f2d869 tests; 48ca4187/868c181f test corrections; 1daea05f/d5f7e34a CI gates; 2ebbd2c1 existing runtime call-through; 0a7df0ed actual browser disabled-path test; bd4bcd2b static no-bypass. Exact-source dedicated artifact 13009791082 LIVE 26 files CRC PASS, isolated full-app DEMO/offline ZIP CRC and byte parity PASS. Dedicated safety 41123512792 SUCCESS; full 41123512664 in progress. No storage migration, prepared stock activation, user data write, historical rewrite, PR merge, Cloudflare deploy, or real-iPhone acceptance. Live stock deduction remains disabled until legacy synchronous cross-tab writer gap is resolved.

## 2026-10-30 — PR124 guarded prepared nasal operation boundary, NOT RELEASED
- Development-only executeExclusive in assets/js/nexus-prepared-dose-transaction.js, commit 8dbf9bfa; added fictional Node one-write/undo/stale/quota/readback tests 40f2d869, wired into two CI workflows at 1daea05f/d5f7e34a, corrected stale lockout test sequencing 48ca4187. No UI activation, storage migration or historical records touched, preserved stock ledger, demonstration remains isolated. Prior 16673efc exact-source full archive 13008115990 CRC verified, full browser and safety tests SUCCESS. New-code CI pending. Status CODED, NOT LIVE, PR DRAFT/UNMERGED/UNDEPLOYED; iPhone NOT TESTED.

## 2026-10-30 — PR124 Stash formulation exclusive writer candidate, NOT RELEASED
- Application commit 8cef8157 migrated Stash Add/Edit to awaited browser Web Lock transaction; static guard 1244e29c, Node stale two-tab/ledger/vial preservation tests b82b8265, Chromium actual Stash Save browser test d58e75b6. Dedicated safety CI 41117925738 SUCCESS on b82b8265; new exact-head browser CI pending. No storage migration, no production write, no merge/deploy, prepared nasal/transfer controls OFF. Physical iPhone NOT TESTED.

## 2026-10-30 — PR124 failed-save acknowledgement hardening candidate, NOT RELEASED
- Commits 9c0c266f (save acknowledgement), 30c5afac (four Log Dose routes), 87424455 (combo + quick), a9b34047/b07ffd29 (static CI), ede6fc1f/eb544d66 (fictional 8-config LIVE/DEMO browser failure regression). Data: no migration and no production writes. New dedicated source test run 41116725844 SUCCESS and exact-source complete app packages (artifact 13005203507) CRC + offline-vs-standalone parity validated. New FULL/browser run 41116725723 IN PROGRESS at entry; mobile, WebKit, nested checks SUCCESS; real iPhone untested. PR draft/unmerged/undeployed, prepared nasal features still OFF due unresolved synchronous writer cross-tab atomicity.

## 2026-10-30 — PR124 shared writer development build source-matched, NOT RELEASED
- Source candidate c003f77a (PR124 draft/unmerged), version remains v0.9.20-beta development. Dedicated safety workflow #41099893634 SUCCESS, artifact #12998570703. Downloaded LIVE ZIP 26 files with CRC and 26/26 Git source parity, isolated full-app DEMO + offline archive verified identical; no user records imported. Shared guarded writing for legacy save, Stash formulation, explicit backup/onboarding restores and confirmed erase; async inventory transaction wrapper shares coordinator, release gates remain false. Data: no migration or production write. Full browser QA and real iPhone acceptance incomplete, no Cloudflare deploy. Safety blocker: sync legacy saves still not truly Web-Lock atomic across tabs. Release status CODED/DEDICATED TESTED/ARTIFACT VERIFIED, NOT FULLY ACCEPTED OR RELEASED.

## 2026-10-30 — PR124 guarded shared storage gateway coded, NOT RELEASED
- New pure writer coordinator c7c70bfe; Node race/stale/quota/rollback tests e3cdba1f, 73a18b17 and 65a4009f; integrations for regular saves, inventory form add/edit, confirmed restore/onboarding and erase, prepared-source gated operations. Build includes new module; direct-writer CI guard 0b4fbe44/49d886b9. Dedicated fast safety CI run 41099075003 SUCCESS on application branch e7581fc9, including complete LIVE/isolated full-app DEMO construction and checkout parity. Full browser source-e7581fc9 workflow 41099074857 pending; 320/390 light/dark and physical iPhone acceptance NOT YET VERIFIED. No production data migration/overwrite; primary Cloudflare not deployed, draft PR124 unmerged; route-specific prepared stock logging disabled due remaining sync/cross-tab lock limitation.

## 2026-10-30 — PR124 prepared nasal transaction history guard + tests, NOT RELEASED
- App source updated 7905e9e5 and test 3a33dd7f for fail-closed inverse after dose record edits/reactions; acceptance checklist fae5ad39 added. Full-app build and source validation of candidate #41095238842 PASS at workflow step level, browser step IN PROGRESS; mobile/WebKit/nested SUCCESS. No production migration, no live UI enablement, no merge/deploy, no physical acceptance.

## 2026-10-30 — PR124 prepared nasal transaction planner coded but DISABLED, NOT RELEASED
- Corrected full browser 41084097074 SUCCESS at source 5bd5a204. Added prepared nasal one-state transaction module 349e86a3, fictional test suite f5e5d1bf, index/complete release builder and CI script inclusion (1874ff7, 1bafdbf, 8bd0449), fail-closed browser writer boundary b0340e3a. Model covers exact container debit of both mg and mL, historical per-dose source link, replay/shortage/cross-route rejection, reversal, guarded one-write persistence and pre-write snapshot validation. No changes to legacy vial counts and no production storage/schema migration. Live prepared nasal dose logging disabled until shared concurrency design; tests/complete-source artifact for new head pending at doc commit. PR draft, unmerged, undeployed, iPhone NOT TESTED.

## 2026-10-30 — PR124 source-e4945d24 packages VERIFIED but overall full QA FAILED; NOT RELEASED
- GitHub run 41083204564 uploaded artifact 12990628004. Downloaded outer ZIP CRC PASS; LIVE 24-file CRC PASS; full standalone DEMO (2,819,815 bytes) matches offline DEMO index exactly; 24/24 LIVE Git blob SHA parity directly verified against application commit e4945d24 (manifest's 2fe765ca is checkout merge commit). Mobile/WebKit/nested PASS on e4945d24; full browser finished FAILURE at legacy route-unknown Stash test fixture, following Log Dose browser 8 configurations/168 flows PASS. Corrected test-only fixture at 5bd5a204, new full run 41084097074 pending. No migration, user data modifications, merger, production deployment or iPhone acceptance. Complete prepared nasal debit/undo writer not enabled.

## 2026-10-30 — PR124 prepared-syringe auto-fill fix + complete LIVE byte parity gate, NOT RELEASED
- Added conditional prefill for unique auto-selected prepared batch (db756749), exact-source LIVE ZIP archive CRC + per-file checkout byte hash gate (0a415aea), test assertions for canonical+visible amount (e4945d24). Underlying dose ledger, prepared-count writer, history, storage schema and production records unchanged. Source/packaging validation portions of #41083204564 PASS; full browser QA remains IN PROGRESS and no completed new-head archive delivery verified yet. Version remains v0.9.20-beta development candidate; draft/unmerged/undeployed, physical iPhone not accepted.

## 2026-10-30 — PR124 prepared source safety scaffold, NOT RELEASED
- Unmerged draft PR124 branch adds assets/js/nexus-use-source-eligibility.js (commit 1d176390), independent fictional test file (4700362e) and release CI gating (bdf26759). Route-aware source inspector and non-mutating nasal spray proposal prevent planned-only inventory and unverifiable bottle calibration from being counted as eligible. Neither browser use-setup wiring nor formulation-stock atomic debit/save was enabled. Data impact: additive source/test files only; no saved state migration, existing records or production localStorage changed. CI new head pending; artifact exact parity and iPhone acceptance NOT VERIFIED. Primary Cloudflare not deployed.

## 2026-10-30 — PR124 integrated Use Setup candidate, NOT RELEASED
- Additive use preference + dose-unit selector + backed/untracked mode + compact Stash candidate coded (commits 54961dc, df4cca9, da964e0, b5875ab, fbc4313, 64831b4, ac0d213, b95b3a7, 50d15a7, 2ab7dd0, b5b8534, 2552815). Test selectors updated to match visible dose input (1991add, 640103a, 46766df); new fictional regression appended a4a80a3. No existing saved records changed; new schema fields additive only. Mobile/WebKit/nested CI pass at 46766df; full/browser and artifacts pending; physical device not accepted. Nasal prepared stock logging and parallel use configurations remain incomplete. Draft PR124, no merge or Cloudflare deployment. See docs/qa/PR124_USE_SETUP_RELEASE_NOTES.md.

## 2026-10-30 — PR124 staged UX candidate QA recovered, NOT RELEASED
- Full source-8a28433a browser workflow 41004313957 SUCCESS, artifact 12955052803, full LIVE archive and isolated standalone DEMO CRC PASS; 24/24 exact GitHub blob source parity; VUX-01..06 partial/full browser evidence as documented in REGRESSION, VUX-07/08 incomplete and physical iPhone NOT TESTED. No production migration, merge or deployment. Previous v0.9.20-beta remains production baseline until approved release.

## 2026-10-30 — PR124 vial-row UX refinement CODED, NOT RELEASED
- User-approved targeted action hierarchy: existing ellipsis owns Set method and Plan preparation, direct View plan shown only on saved plan, clearer plan-vs-inventory language. Commits 089d9e0/8cedd29/8a28433. No changes to stock model, calculators, histories or storage schema, no migration. Automated checks and exact new-head LIVE/full DEMO pending; PR draft unmerged, primary Cloudflare not deployed, physical iPhone not accepted.

## 2026-10-29 — PR124 preparation planning UX update, NOT RELEASED
- In response to a0f6466 iPhone feedback, implemented Plan preparation → View preparation plan/Edit plan in JS 864d202 and responsive styling 2eb292d. Linked plan remains audit metadata status planned-no-transfer; zero stock transfer, no nasal bottle, no preparation completed, no data migration. Original planning CTA was misleading and repeated after save; code now labels state accurately and updates existing plan instead of creating duplicates. CI and physical iPhone acceptance pending; release ZIP/DEMO for this source not yet validated; unmerged, undeployed.

## 2026-10-29 — Stash-first legacy vial setup QA COMPLETE; matching development packages VERIFIED
- Source application: 9efe73da (Stash setup prompt and exact-vial navigation), 51724abb (44px touch-target styling), dose-first JS 4f5137c/CSS 6d9f0ef; test selector fixes 3d5bacc and a0f64666537ccacc8f0061080b07a5cc877331c8. Main baseline da585ab3458394ddf5e88e283b210933beeab810, draft PR124 unmerged/undeployed. Four source-a0f6466 workflows SUCCESS: full release 40991755367, mobile 40991755317, nested 40991755280, WebKit 40991755381. Prior full failures 40989505829 and 40991421290 were outdated review/source UI label test assertions, corrected and rerun successfully. Full artifact 12948949511 downloaded to conversation container. Outer ZIP CRC PASS (176 entries), LIVE ZIP CRC PASS (24 root files), offline DEMO ZIP CRC PASS (2 files), standalone full-app DEMO 2,794,450 bytes. Four Git blob SHA matches against development branch: index 3c6233c2, CSS c952eb15, JS05 beb3bfc0, JS10 933a9e3c. Manifest CI merge commit 6632b777 (not direct feature commit), demo ephemeral in-memory fictional buildDemoState(weight_loss), sync disabled. 8/8 LIVE/DEMO 320/390 dark/light Log Dose end-to-end PASS, including Stash-first method confirmation preserves stock and unblocks verified single-source logging, exact-vial debit and legacy fallback; browser QA 8/8 PASS. Physical iPhone NOT TESTED for this new build; no live production data touched. NEXT ONE ACTION: guided physical iPhone acceptance for Stash prompt → Vials → Set method, confirm zero stock/history mutation, return Log Dose automatic verified source, multi-vial exception, and back draft; then seek separate merge/deploy approval.

## 2026-10-29 — Stash-first legacy vial method setup completed in draft PR124 (QA pending)
- Verified existing exact-vial Stash method-confirmation sheet in assets/js/10-nexus.js: open vial only, positive balance, no existing confirmed route; method explicitly selected; exact kit/vial re-read before save; only vial.intendedUse changes; no inventory deduction or historical dose changes. New 9efe73da adds discoverable per-kit Stash setup prompt for unresolved open vials and guided navigation to Vials tab and exact Set method control. New 51724abb styles callout with 44px targets and 320px stacking. Log Dose legacy explicit fallback preserved and no implicit route inference. 3d5bacc updates a stale test selector for dose-first source section; preceding full CI 40989505829 FAILED due test label mismatch (other suites passed). New four CI workflows for 3d5bacc running at last observation. No matching new-head artifact verified, physical iPhone NOT TESTED, no merge/deploy. ONE NEXT ACTION: finish four CI, fix any failures, download and hash-check full-app isolated DEMO and LIVE ZIP from matching release artifact; guide physical iPhone acceptance.

## 2026-10-29 — PR124 dose-first source UX candidate (NOT RELEASED)
- User-approved contextual source redesign implemented incrementally at 4f5137c and 6d9f0ef. Permanent source section removed from normal one-source entry presentation, conditional chooser moved below dose essentials, reviewed source relabelled. No data migration or production writes. Stash-first legacy setup not fully implemented; new CI/DEMO/LIVE packages and physical iPhone acceptance pending. PR remains draft, unmerged and undeployed.

## 2026-10-29 — APPROVED: inventory as background, exception-only source UI (CODED, QA PENDING)
- User explicitly approved removing permanent Inventory source section, auto-selecting only ONE verified compatible open physical vial, subtle stock status, exact-vial chooser only for multiple compatible open vials or prepared/legacy exception, and moving ordinary preparation/method setup into Stash (existing Stash Create Preparation and vial details retained). Targeted app commit 155dcf97 changes normal Log Dose source section to exception-only, simplifies stock status and human-visible vial labels; CSS commit 8958076 adds restrained stock styling. Existing physical vial eligibility, source IDs, ledger, shortages, legacy method confirmation fallback, two-stage review/Back, PRN and calculations unchanged. No Stash navigation move or storage migration; one-time legacy fallback still available in Log Dose for existing records, routine vial setup stays in Stash. Exact-head CI and complete matching LIVE/DEMO NOT YET VERIFIED; iPhone acceptance NOT TESTED for these changes. Main baseline da585ab3, PR124 draft/unmerged/undeployed. ONE NEXT ACTION: verify latest four CI checks and resolve failures; then download/verify matching isolated full-app DEMO and LIVE ZIP before guided physical iPhone review.

## 2026-10-29 — PR124 two-stage iPhone review candidate packaged; NOT RELEASED
- Premium two-stage Log Dose app b53979b / CSS 8bd1f56 / tests to 1da9f3c; full 40987007250, mobile 40987007230, nested 40987007233, WebKit 40987007221 all SUCCESS. Artifact #12948125531 downloaded; release ZIP, root 24-file LIVE ZIP and offline DEMO integrity checked, 4 sampled app Git blobs match branch; 8/8 fictional Log Dose browser matrix PASS. Standalone isolated DEMO and LIVE ZIP packaged. No user data migration/history change; old Save ledger and PRN semantics maintained; user physical iPhone acceptance and production release remain pending. Primary Cloudflare untouched. Next: physical iPhone acceptance before any separately approved merge/deploy.

## 2026-10-29 — PR124 premium two-stage Log Dose design coded, NOT RELEASED
- User explicitly approved Enter dose → Review & confirm in SAME modal, premium iPhone hierarchy. Coded JS b53979b/CSS 8bd1f56; subsequent QA adapters through 1da9f3c. Source identifiers excluded from review display but exact IDs retained in source allocations. The existing Save handler, prepared-source/PRN semantics and user data remain unchanged; no migration, merge or deployment. Tests: full #40986618254 and #40986828510 FAILED due outdated direct-save browser assertions; updated trust UI tests at 5943663 and 1da9f3c and review tests 46b9184. Current #40987007250 full browser QA still IN PROGRESS at last observation; mobile #40987007230, nested #40987007233 and WebKit #40987007221 SUCCESS. New-source LIVE/DEMO artifacts and physical iPhone test NOT YET VERIFIED. Do not claim released or accepted.


## 2026-10-29 — APPROVED two-stage iPhone Log Dose redesign IN DEVELOPMENT
- User explicitly APPROVED replacing inline Review entry with a premium two-stage SAME-modal Enter dose → Review & confirm flow, matching DS2 typography, without displaying raw database kit/vial IDs on normal review. The request is to make the overall design substantially more native-iPhone quality, not just reproduce the old wizard; one unified entry workflow, never Quick/Guided. Code commits b53979b (two-stage entry/review, Back preserves mounted form state, original authoritative #save handler retained), 8bd1f56 CSS (review typography/card, footer, 320px), a8e8f47 / bb12084 regression changes. This is CODED but new CI/test artifact/physical iPhone acceptance NOT VERIFIED. Source picks exact physical vial when multiple eligible, method confirmation and asNeeded semantics preserved; no source/ledger migration. No merge or deployment.
- ONE NEXT ACTION: inspect new CI and repair failures, then package exact-head isolated full-app DEMO and root LIVE ZIP; verify at 320/390 light/dark and physically on iPhone with guided test cases including back-preserves-draft, insufficient source, saved-vial attribution and cancel.


## 2026-10-29 — PR124 Log Dose UX refinement build candidate VERIFIED, NOT DEPLOYED
- User-approved direction app commit 2f31ff6/test 1159aa3. Four CI workflows successful: full 40982813383, nested 40982813381, mobile 40982813421, WebKit 40982813437. Source-matched artifact #12945533720 downloaded and validated: 24-file LIVE ZIP, isolated complete DEMO HTML and offline DEMO ZIP, CRC PASS, four app Git blob hashes matched development branch. Tested CI merge source 1a8b5389; app version string remains v0.9.20-beta (not production release). Changes: easier wording for one-time legacy method confirmation, one Review entry accordion, optional Protocol options retaining asNeeded semantics. No data migration, production update, PR merge or iPhone acceptance. Next physical iPhone test required.

## 2026-10-29 — PR124 targeted Log Dose UX preview (NOT RELEASED)
- Draft app commit 2f31ff6, QA test 1159aa3. Reword one-time legacy method confirmation and remove misleading technical explanation, flatten nested source audit into single Review entry accordion, move unchanged PRN checkbox under optional protocol settings. No inventory math/storage migration/history modification. New exact-head CI and artifacts pending; not merged, not deployed, not physical-iPhone accepted.

## 2026-10-29 — PR124 single-screen Log Dose candidate fully automated-tested (NOT RELEASED)
- App/test source e50873c, CI generated merge f11ad0f; full 40973779952, mobile 40973779992, nested 40973780138 and WebKit 40973780112 all SUCCESS. Release artifact #12942405718 downloaded, archive and LIVE ZIP CRC pass, LIVE index/css/05/10 JS Git blob SHA match GitHub branch, contains complete in-memory fictional DEMO and root-path LIVE ZIP (24 files). No data migration. Not merged, not deployed, no personal iPhone test for this candidate. Physical acceptance remains.

## 2026-10-29 — Single-screen Log Dose coded on PR124 (NOT RELEASED)
- Draft commits fd6520b, 2397043, test 5160747 remove UI-only Quick/Guided/Review-step navigation from normal dose modal, expose optional inline review with hidden source IDs, retain original source math and Save handler. NEW HEAD CI NOT VERIFIED; matching LIVE/DEMO downloads not yet generated/validated; physical iPhone acceptance pending. No migrations, merge or deploy; production remains main da585ab3 / prior v0.9.20-beta.

## 2026-10-29 — PR124 progressive disclosure Log Dose + user-reported allocation blocker (DRAFT)
- User approved simplified single-screen intent, conditional exact-source auto selection, contextual inventory; physical iPhone retest still FAIL for existing open vial / BLOCKED history integrity. Targeted 05-nexus.js 53e2ddeb removes permanent source section for one eligible vial and prevents stale provisional 2mg allocation against full sufficient selected vial, protecting confirmed rows. Fictional regression 936a20a added. Full UI conversion not finished, no deployed package; exact-head CI pending 40963691257, 40963691267, 40963691316, 40963691309. No data migrations, user backup in repo, merge or Cloudflare production deployment. Compact Stash cards remain requested but unapproved design.

## 2026-10-29 — PR124 inventory fix CI-verified, NOT RELEASED
- Draft source 14cad5da (vial confirmation app fix d1040e77), CI test merge 67dc7014, full build 40955096642 SUCCESS, artifact #12932968493 downloaded and inspected; LIVE ZIP 24 root files and six Git blob parity checks, isolated full-app DEMO in-memory/no sync; eight LIVE/DEMO viewport/theme Log Dose scenarios PASS, other mobile/WebKit/nested CI SUCCESS. Physical iPhone acceptance pending; primary Cloudflare deployment unchanged, PR draft/unmerged. No data migration or live inventory/history writes. Compact Stash cards next proposed visual preview, not approved.

## 2026-10-29 — PR124 legacy-vial eligibility blocker (DRAFT, NOT RELEASED)
- Physical iPhone found positive open vial inventory but Log Dose emitted 0mg source and false shortage. Privately inspected an uploaded backup; established that absence of administration-method metadata excludes legacy OPEN vials in new route filter. Targeted work-in-progress commits a52999a, d5e360c add explicit per-vial method confirmation + draft preservation, 81d6907 adds fictional fictional 6.75-to-5.50mg exact source regression; no personal JSON in repository, no automatic balance migration. Full build/WebKit pending, no new verified artifact or physical acceptance. Main remains da585ab3, PR124 draft/unmerged/undeployed.

## 2026-10-29 — PR124 in-app reminder expanded implementation and QA (DRAFT, NOT RELEASED)
- Application/test head b9545a6; changes: phase1 upcoming/today, phase transition 7/3/1 day, final protocol 7/1 day and elapsed-schedule review, planned-start support without auto-activating an overdue plan. Regression in tools/validate-protocol-design.mjs. Preliminary browser run 40950394101 FAILED test expectation; corrected fixture and latest run 40951124701 pending. Other latest checks 40951124650/40951124030/40951124448 pending. No verified same-head artifact or real-device acceptance. No migration, no merged PR, no primary production deployment. Push notification implementation separate and NOT CODED.

## 2026-10-29 — PR124 in-app protocol reminder sprint (DRAFT, NOT RELEASED)
- User approved in-app phase/protocol start/end reminder priority, separate from future iPhone push notifications. Added derived phase-one starts-today, 7-day phase change, final 7/1-day ending and scheduled-end review to 10-nexus.js, refreshed explanatory settings in 11-nexus.js. Source checkpoints 45264ec, 9737c44, d8a4768, c373081b. No automatic completion, protocol migration, history/inventory update or production change. Exact-head CI, standalone full-app DEMO/LIVE artifacts and physical iPhone acceptance PENDING; existing d42fd3cb artifact is older and MUST NOT be relabelled as the latest source. PR remains draft/unmerged/undeployed.

## 2026-10-29 — PR124 verified build and end-reminder audit (DRAFT, not released)
- Application head d42fd3cb confirmed, workflows 40932209177 / 40932208627 / 40932208817 / 40932208482 SUCCESS. Release artifact #12922869213 verified: standalone fictional in-memory full DEMO, 24-file root LIVE ZIP, 320/390 light/dark browser checks, CI test-merge source b276f67f, application blob parity against PR head (index/CSS/05/10/11). User identified end-of-RETA notification/status gap: current phase reminders skip final boundary, protocol may persist in_progress despite elapsed scheduled timeline. Fix NOT CODED; no changed user data, no merge/deploy, no physical iPhone acceptance.

## 2026-10-29 — PR124 follow-up notification addenda (DRAFT, not released)
- Coded post-protocol informational in-app nudge, per-dose PRN exemption and non-destructive protocol acknowledgement. Added Quick Log PRN carryover 7bc3474e and active replacement protocol suppression 13dcdd9d. New CI pending, Stash card redesign not implemented/approved, real iPhone pending, branch draft/unmerged/no production deployment.

## 2026-10-29 — PR124 continued dosing with PRN exception (DRAFT, NOT RELEASED)
- Added after-save informational follow-up for completed/elapsed same-compound protocol, explicit per-dose PRN flag, Update existing / Start new / Not now, per-protocol+compound acknowledgement, preserved Quick Log undo and reaction invitation. No protocol migration, no dose inventory alteration, no production merge/deployment. Fictional browser regression c548369e added; CI pending. Compact Stash redesign remains proposed/not coded.

## 2026-10-29 — PR124 release QA success and artifact inspection (DRAFT, NOT RELEASED)
- Full build 40913649262 SUCCESS after legacy shortfall test adjusted to explicit source selection. Artifact id 12915741154 downloaded: standalone full-app fictional DEMO, exact-source LIVE root ZIP, build manifest and browser evidence; six sampled live source files Git blob match PR branch. Artifact manifest source commit 55d3ba21; latest head 555f5a1b is documentation-only. No production deploy and primary hosting parity false by design. Physical iPhone acceptance PENDING; route-specific transfers/deductions disabled. Status: TESTED AUTOMATED/PR DRAFT, NOT MERGED OR DEPLOYED.

## 2026-10-29 — PR124 CI recovery checkpoint (NOT RELEASED)
- Full build 40913124098 FAILED outdated shortfall UI assertion (no explicit source selection). Corrected regression at 4c6cf6ee; targeted browser 40913649295, WebKit 40913649202 and nested 40913649436 passed; full build 40913649262 still running at checkpoint. Preview bot reports commit 4c6cf6e deployed to Cloudflare branch preview but independent verification unavailable. Never imply production merged or certified release.

## 2026-10-29 — PR124 browser and WebKit test evidence (DRAFT/UNRELEASED)
- Source c95e439d (test-only final change after application 3693c899): second-vial opening through actual modal, route-compatible Log Dose source selection, independent balance/history, and no-transfer linked plan verified by browser 40913124073, WebKit 40913124222, nested 40913124963, all SUCCESS. Release artifact run 40913124098 unfinished, physical iPhone retest not accepted, production not touched. Never imply full release.

## 2026-10-29 — Draft PR124 final same-kit safety source checkpoint (NOT RELEASED)
- Latest application commit 3693c899: previously implemented exact-vial Log Dose, independent non-blend open-vial handling, per-vial linked non-transfer preparation plans, and legacy Prepare Doses fail-closed multiple-source guard. No historical data migration, no transfer or route-specific formulation deductions. CI/DEMO/LIVE latest source parity and iPhone acceptance pending. PR draft/unmerged, Cloudflare production unchanged by this session.

## 2026-10-29 — PR124 exact-vial/source-plan checkpoint (NOT RELEASED)
- Coded same-kit two-open non-blend source picker, exact vial dose allocation, named opened-vial mid-dose continuation and attached in-kit no-transfer preparation plans. Latest application source dab844ab; exact-head browser/artifact CI PENDING, prior 2680aba5 browser run 40912034303 SUCCESS. Data: additive linkedPreparationPlans only, no destructive migration/transfer, no route-specific non-vial deduction, historical IDs preserved. Draft PR, unmerged and not deployed; iPhone retest pending.

## 2026-10-29 — PR124 exact-vial UI and linked preparation plan (DRAFT, NOT A RELEASE)
- Implementation on feature/dose-administration-method-20261029: source linked no-transfer preparation plan (fa88b464/8ae43d30), Log Dose exact kit-vial selector (6489e538/2fad1b6f/5e41c990), fictional UI assertion (bc9a8c77). Existing historical doses/vials not migrated; no stock transfer or new route-specific deduction.
- Validation: latest CI PENDING; full-app source-equivalent DEMO/LIVE and real iPhone NOT YET VERIFIED. Branch preview unaccepted; production not merged/deployed.

# Nexus — Release History

> Append-only history. Chat version labels may not correspond to GitHub releases. Verify PRs, SHA and Pages workflow before asserting deployed. Never rewrite earlier entries to hide errors.

| PR / release | User-visible changes | Evidence/status known at 2026-10-23 handoff |
|---|---|---|
| #7 | Calendar current local month, Month tab fresh default | Historically merged; inspect PR for further detail |
| #8 | Compact Calendar cells retain saved numeric weight and date details | Historically merged |
| #9 | Check-In date validation and duplicate-date prevention | Historically merged |
| #10 | Supplement date safety, deduplication, deletion confirmation and history protection | Historically merged |
| #11 | Search-first supplement selector | Historically merged |
| #12 | Today Check-In status with top-level Edit | Historically merged |
| #13 | Scrollable searchable browseable multi-select Supplements in both entry points | Historically merged |
| #14 | Selected Today count and supplement UI hierarchy; initial contrast changes | Historically merged, NOT a complete accessibility audit |
| #15 / v0.8.9-beta | Searchable Symptoms, general/compound groups and intensity 1–3 | Reported merged and deployed in previous handoff |
| #16 / v0.9.0-beta | Targeted chevrons in Symptoms and Supplements | Verified merged at a4dcad6f9d8c1a8599945af5fcefcbbc66b07107; Pages https://github.com/Deidrajw/Peptide-Tracker/actions/runs/39973924397 and mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/39973926348 |
| v0.9.1-beta | Proposed application-wide disclosure consistency, demo/source parity and metadata reconciliation | PROPOSED — NOT IMPLEMENTED OR DEPLOYED |

## Documentation bootstrap — 2026-10-23
- Creates docs/continuity/PROJECT_STATE.md, DECISIONS.md, RELEASE_HISTORY.md and REGRESSION.md in a documentation-only branch.
- **No application source changes; no data migration; not an app version or deployment.** Verify PR, merge and eventual current main SHA separately.

## Release entry template (append below)
### vX.Y.Z — PROPOSED / CODED / TESTED / MERGED / DEPLOYED
- Date and version metadata:
- Baseline SHA → merged release SHA:
- Branch / PR:
- Features/fixes and affected screens:
- Data impact and migrations (including none):
- LIVE ZIP / complete DEMO parity and paths:
- Automated/browser tests, 320px/390px dark/light, device testing (only if done):
- GitHub Pages workflow and resulting SHA:
- Known limitations and outstanding regressions:

### v0.9.1-beta — IMPLEMENTED / MERGED, release artifacts under verification (2026-10-23)
- Application baseline: PR #18 merge e58e6750a2ef000384c8d1084ffe22d5467a202d; index displays v0.9.1-beta.
- Changes: shared CSS disclosure geometry; targeted glyph cleanup in Check-In, Symptoms, history and Stash; version title correction.
- Screens: Today, Protocol, Check-In, Supplements, Stash/inventory and expandable history/trends.
- Data impact/migrations: none intended; no storage key changes.
- Packaging remediation in separate branch `release/nexus-v091-validation-artifacts`: standalone self-contained fictional-data full-app DEMO, source-identical LIVE ZIP and responsive/browser matrix. Artifacts currently INCOMPLETE pending CI.
- Actual iPhone visual acceptance: NOT TESTED; deployment for this SHA NOT VERIFIED here.

### PR #19 symptom combobox remediation — CODED, NOT DEPLOYED
- Fixed empty catalog via template.content; unified search/browse into one scrollable combobox; current symptom logging values/intensity untouched.
- Scoped CSS; extended 320px/390px light/dark browser checks for option display and Constipation selection. Data impact: none intended.
- Remains open pending CI; physical iPhone and production deployment not verified.

### v0.9.1-beta follow-up — PR #19 MERGED, Pages UNVERIFIED (2026-10-23)
- Merge: `5b44b1e187b37059f7e63c399c8463f6e4782745` from PR #19.
- Bug fix: Daily Check-In symptom catalog empty because template.textContent did not read the stored choices; use template.content.textContent. Replaced separate search/Browse button with a single searchable combobox; existing symptom intensity and saved records unchanged.
- Build: corrected isolated whole-app fictional DEMO compiler; LIVE root-index ZIP generated from matching source; GitHub Actions artifact 12516393327.
- Automated checks: release + browser workflow 39988223654 SUCCESS, mobile form regression 39988223703 SUCCESS; run belongs to PR branch SHA 9336139. No physical iPhone retest yet.
- No planned production data migrations.
- GitHub Pages for merge commit: UNVERIFIED. Do not mark deployed solely from merge.

### v0.9.2-beta — CODED, PR/TEST/DEPLOY pending
- Baseline main a82017daad493dbbff9920ad66788ddb5c5d61de. Branch release/grouped-symptom-picker-20261023.
- Compact grouped selector returns recent, compound-specific, general and custom category headings within combobox. Search, multi-select, intensity and historical records retained; avoids deep nested card borders.
- Affected: Daily Check-In symptom selector and shared picker. Data impact: none intended. Test/live artifact and deployment: not yet verified.

### v0.9.2-beta — grouped symptom category follow-up (PR #21, PENDING FINAL CI)
- User-facing organization: searchable grouped combobox with Digestive, Energy & Sleep, PMS & Cycle, active compound-specific (e.g. Retatrutide-specific), Recently logged and Custom sections.
- Expand/collapse categories for browsing; search across groups; multi-select and intensity 1–3 unchanged. No data schema/storage migration.
- Responsive 320/390 light/dark and full-app LIVE/DEMO checks strengthened; actual CI outcome and Pages deployment require independent verification.

### v0.9.2-beta — PR #21 MERGED, Pages UNVERIFIED (2026-10-23)
- Merge SHA `dea438e63dd11fce263429e6ee47f32f6df24ea2`; baseline `a82017daad493dbbff9920ad66788ddb5c5d61de`.
- Sections in Symptoms combobox: Digestive, Appetite & Food, Energy & Sleep, PMS & Cycle, Mood & Mind, Physical, Injection Site/Reaction, Red Flag, custom, recent and dynamically active compound-specific (e.g. Retatrutide-specific). Default collapsed browse for scannability; search reveals matches across categories; selected symptoms/intensity persist according to existing app state.
- Data impact: presentation and selector changes only; no migrations, real data overwrite, dose math or inventory mutations intended.
- Browser QA https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583792 SUCCESS, 8 LIVE/DEMO width/theme combinations, DOM, search, category toggle, selection, demo isolation, screenshots; mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40030583750 SUCCESS. Artifacts on workflow run, ID 12534692167, valid full-app HTML and root-level LIVE ZIP.
- Limitations: physical iPhone untested, full edit/persistence/vial maths suite untested, Pages deployment SHA unverified, known light-mode Save Check-In contrast concern. Delivery status MERGED; deployment INCOMPLETE verification.

### v0.9.3-beta — CODED / QA PENDING (October 23, 2026)
- Baseline main `6a19a76813aced836f7f9a8dc78400f8bd6d7b22`, branch `release/v0.9.3-contrast-legibility`.
- Affected screens: Daily Check-In, custom symptom input, relevant purple action buttons elsewhere, keyboard focus on disclosures, light-mode secondary helper text. Added `assets/css/nexus-contrast.css` and linked it after the existing CSS; version/title + exact-source release packaging + browser contrast QA updated.
- Color audit: white on #C9A0FF = ~2.1:1, white on #A78BFA = ~2.7:1; dark #1A1728 on those colors ~8.3:1 and ~6.45:1. Computed browser tests required prior to PASS claim.
- No migrations or modification to saved localStorage, check-ins, supplements, dose math, inventory. QA, full-app DEMO, LIVE ZIP, PR, Pages and physical iPhone statuses remain INCOMPLETE/NOT TESTED until verified evidence.

### v0.9.3-beta — MERGED, production deployment unverified (2026-10-23)
- Baseline `6a19a76813aced836f7f9a8dc78400f8bd6d7b22` → merged `f2fef99de4ea8c7cf28b9ed677054ca712bb77b4` (PR #23).
- Screens: Daily Check-In, custom symptom Add, solid lavender action buttons, helper text/focus-visible in selectors and disclosures. Added CSS `assets/css/nexus-contrast.css`; index displays v0.9.3-beta. No data model, migrations, localStorage, user saved history or vial-math edits.
- Automated LIVE/full standalone DEMO browser validation PASS: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037977087, 8 combinations 320/390px dark/light; WCAG normal text contrast on tested Check-In/custom buttons; keyboard focus. Complete root-index LIVE ZIP/full-app isolated DEMO generated same release checkout, GitHub artifact 12538366105.
- Existing mobile form regression PASS on same application source earlier branch SHA: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40037868319. Later mobile rerun 40037977076 pending at last check (final change only browser QA test script).
- Limitations: no actual iPhone tests, no complete history/dose/inventory full regression, no site-wide WCAG certification. Pages publication for merge SHA NOT VERIFIED; delivery status CODED/TESTED/MERGED, deployment INCOMPLETE.

### v0.9.4-beta — IMPLEMENTED ON BRANCH / VALIDATION PENDING (2026-10-23)
- Baseline `56f2f4b7eda2fad201c801cafad72e19229afc5e`; branch `release/v0.9.4-checkin-a11y-regression`.
- Change: Check-In Mood 1–5 now exposes `aria-label`/`aria-pressed`, with readable >=11px text and 52px button targets. Release metadata/build/test set to v0.9.4.
- New `tools/validate-checkin.mjs` asserts fictional create/edit/notes/intensity/compound tag, date-specific supplements, date collision safety across both builds, dark/light and 320/390px. This is a new regression suite, NOT yet proven passed.
- Affected page: Daily Check-In modal only, plus testing/build. Data impact: no model key changes, no migration, no production writes.
- Mandatory DEMO HTML and source-identical LIVE ZIP: builder updated but files INCOMPLETE until CI. GitHub PR, merge, Pages deployment, real iPhone signoff and full-app deep regression: PENDING.

### v0.9.4-beta — IMPLEMENTED / AUTOMATED TESTED / MERGED (2026-10-23)
- GitHub app PR #25 merged `cab5cd8479fbfb537151c2db070a322ca7d01587` from baseline `56f2f4b7eda2fad201c801cafad72e19229afc5e`; title declares v0.9.4-beta.
- UI: Daily Check-In mood options have 11px theme-visible text, >=52px target, ARIA selected feedback. No change to mood numeric values, date semantics, existing supplement/symptom data and vial math; migration none.
- Full-app source-aligned DEMO and root-index LIVE ZIP in GitHub Actions artifact #12540338019; archived standalone HTML 1,784,233 bytes, LIVE ZIP 492,353 bytes, ZIP includes 3 CSS + 12 ordered JS. DEMO in-memory fixture isolation confirmed.
- Branch CI success: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524923 (8 display and 8 Check-In functional test matrices) and https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40043524934 (mobile forms). Tested synthetic Check-In create/edit, Retatrutide association, intensity, dated supplements, conflicting date protection; actual production records not touched.
- Limitations: Pages deployment for this merge SHA not independently verified; physical iPhone real tests NOT TESTED; whole-app WCAG and vial-dose deep functional tests NOT TESTED. Release status MERGED, deployment INCOMPLETE.

### v0.9.5-beta — PROPOSED/CODED, validation pending (2026-10-23)
- Base `1af0cfddf3780b7f08524b3b1ede9e878d645bd9`, branch `release/v0.9.5-unique-symptom-search`.
- Affects the shared Symptoms combobox: search dedupes names across overlapping Recent, Retatrutide-specific and Digestive/general categories and keeps each match under the general category when one exists. Browse with no query remains unchanged; selection values, history, intensity 1–3 and compound tags unchanged. No data migration.
- Source-aligned complete standalone fictional-data DEMO HTML and root-index LIVE ZIP builder versions updated; browser test asserts Constipation/Nausea exactly one visible option, with Constipation classified Digestive, while all prior Save/Edit safety and main-tab regressions remain. Actual tests, CI artifacts, merge and Pages deployment INCOMPLETE pending evidence. Real iPhone untested.

### v0.9.5-beta — MERGED, Pages UNVERIFIED (2026-10-23)
- Baseline `1af0cfddf3780b7f08524b3b1ede9e878d645bd9`, app PR #27 merged at `4addc72b8fdbb9906170d116af3f4a8183687e11`.
- Screen: shared Symptoms combobox under Check-In and other usage contexts. Query displays each symptom name once, placing Constipation under Digestive instead of repeating in active Retatrutide/recent; the initial category browse remains unchanged. Saved selection, intensity 1–3, associations, custom terms and medical logs untouched. Data migration: none.
- Branch CI: source and standalone DEMO/full root-index LIVE ZIP PASS, 8 width/theme/kind visual and search DOM checks, 8 deep Check-In data-integrity checks: https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902230; existing mobile regression PASS https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40054902171. Artifact #12544887723 contains both release files, manifests, JSON results and screenshots.
- GitHub Pages publication for this merge SHA: UNVERIFIED/INCOMPLETE. Real iPhone Safari, site-wide WCAG, complete Log Dose stock math: NOT TESTED. No claim of fully deployed release.

### v0.9.6-beta Protocol UI candidate — PROPOSED / BRANCH CODED, NOT RELEASED (2026-10-23)
- Baseline `ed1db9e6f384c06d6aa882458ef41e51be69955b`; candidate branch `design/v0.9.6-protocol-card-density`.
- New Protocol stack selection: outline search SVG replaces emoji, compact accessible search field, enlarged compound list rows/route targets, wizard header step counter now advances. Expanded compound cards: informational insights compact accordion, meaningful injection-site warning still visible, secondary menu actions use outline SVG and include Remove from Today; retained existing handlers and collapse/Log Dose.
- Affected: Today compound card, Protocol builder Stack step, associated menu and alert disclosures. No clinical or inventory data change/migration; medical guidance copy preserved but not medically audited. Automated responsiveness and functional design checks added; TEST RESULTS PENDING. Exact-source standalone full-app DEMO, LIVE ZIP, PR approval, merge and Pages publication INCOMPLETE pending reviews.

### v0.9.6-beta candidate — BRANCH TESTED / APPROVAL PENDING (2026-10-23)
- PR #31 https://github.com/Deidrajw/Peptide-Tracker/pull/31; app main remains v0.9.5-beta. Branch implementation of outline Protocol wizard compound search, corrected step counter, larger targets, condensed informational Insights, and menu outline icons + Remove from Today under ellipsis; existing action handlers retained. No migration.
- Full PR-source test merge build v0.9.6 at synthetic checkout `1b0dd618f8e0d51905623bf5535dbaa4345283be` from PR head `edb9d9c`: browser/build workflow 40056553001 PASS, mobile regression 40056552959 PASS, artifact #12545936209 with self-contained demo, complete LIVE ZIP, 8 protocol UI screenshots, full Check-In QA and manifests.
- Observed limitation: opening inline more menu pushes choices beneath viewport; a true bottom sheet is proposed for further approval. No release merge, no verified Pages deployment, no physical iPhone QA; medical content not audited. Status is TESTED DESIGN CANDIDATE, NOT LIVE.

### v0.9.6-beta candidate final responsive QA — PASS on design branch, NOT MERGED (2026-10-23)
- Final narrow-screen refinements to avoid Retatrutide title ellipsis, preserve horizontal ring+date summary at 320px and remove redundant emoji in status badge. No data/logic changes or migrations.
- CI https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857750 PASS (build/live standalone full-app demo, 8 legacy visual, 8 functional Check-In and 8 Protocol candidate DOM workflows); mobile regression https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40056857769 PASS. Artifact ID `12545847021` has versioned HTML and ZIP (16 app source files), screenshots, manifests, JSON QA.
- Approval and release remain **INCOMPLETE**: PR #31 OPEN; no main merge, no new Pages deployment, physical iPhone not tested. Card menu inline is an interim design, proposed upgrade to bottom action sheet requires approval and retesting.

### v0.9.6-beta design preview packaging follow-up — CODED, QA PENDING (2026-10-23)
- User reported browser opening problem with direct standalone full-app DEMO attachment. Existing 1,794,663-byte standalone complete HTML matched previously QA-passed GitHub release artifact. Added a second deliverable: extractable offline ZIP containing the same exact full-app isolated HTML as root `index.html` and a README. No app logic or production schema changes; PR #31 unmerged, deployment incomplete.
- Browser and build/archive parity CI rerun pending. Preview does not require a user to rename or overwrite live `index.html`: extracted file is separate and should not be uploaded over the live app.

### v0.9.6 design candidate — offline DEMO ZIP packaging verified (2026-10-23)
- Still unmerged PR #31; no production changes. Source builder now emits both standalone full-app HTML and a separate ZIP containing **the exact same HTML** as root `index.html` with opening instructions, in addition to the complete independent LIVE ZIP. Designed for users whose chat attachment viewer cannot execute JavaScript.
- Verified GitHub Actions run `40057610410` PASS (artifact `12545973188`, exact-byte ZIP parity, full UI + Check-In matrix), mobile forms `40057610653` PASS. User local browser opening is NOT TESTED; this is a reviewed candidate delivery artifact, not a deployed public preview.

### v0.9.6 bottom action sheet — CODED, awaiting CI/merge evidence (2026-10-23)
- Approved user interaction change to replace overflow inline menu with fixed iPhone bottom sheet and scrim, role dialog, focus trap, Escape/dismiss, swipe header, safe-area and scroll lock; History, Calendar, Schedule, Colour, Pause, Remove use existing handlers and no data changes. New protocol wizard search and compact Insights from pending PR #31 remain part of same candidate.
- Separate research-backed clinical-content audit drafted in `docs/ios/MEDICAL_CONTENT_AUDIT.md`; no clinical text modified. Critical unresolved pre-App-Store issues include precise plasma predictions, weeks-at-dose escalation suggestion and Apple App Review guideline §1.4.2 for dose calculators. CI and final release artifacts pending; Pages and physical iPhone unverified.

### v0.9.6-beta — IMPLEMENTED, TESTED, MERGED; Pages deployment UNVERIFIED (2026-10-23)
- Baseline app main `ed1db9e6f384c06d6aa882458ef41e51be69955b` → app PR #31 merged `ddd38eeb7b78cda3e3cc63c5f57a13ef665143e0`, `main/index.html` shows v0.9.6-beta.
- Changes: Today expanded compound card has nonurgent timing/escalation Insights disclosure, important site-rotation notice remains visible, dense Remove from Today row moved under ellipsis, true modal bottom sheet with six original actions and SVG icons; name and 320px ring alignment, New Protocol search icon and corrected step progress. Behaviour preserved for collapse, Log Dose, history/calendar/schedule/colour/pause/remove; stored records/formats untouched. No data migrations, schemas or dosing logic changes.
- PASS branch CI for tested PR head `80bd01b`: `https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40059005979` source/ZIP/HTML parity, Playwright 8 LIVE/DEMO × 320/390 × light/dark, functional Back/Next/Stack search, sheet scrim/focus/backdrop/Escape/focus/scroll, History and Schedule after action; Check-In state/date safety. Mobile forms CI PASS `https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40059005978`. GitHub artifact ID `12546861220` includes standalone full app DEMO, extractable isolated-demo ZIP, deployable complete LIVE ZIP, QA JSON, 8 open-sheet screenshots. No physical iPhone validation.
- Contents in `docs/ios/MEDICAL_CONTENT_AUDIT.md` are separately researched proposed replacements, not shipped UI copy. Retatrutide status and Apple drug dosage calculator provenance are unresolved App Store gates. Pages publication not independently verified; release status MERGED, DEPLOYMENT **INCOMPLETE**.

### v0.9.6-beta QA/Pages assurance follow-up — CODED / CI PENDING (2026-10-23)
- No visible app release/version change: QA-only PR branch `qa/v096-pages-inventory-assurance` from `25ca6e7`, preserves the complete v0.9.6 app files and storage.
- Added 16-file Pages deployment byte-parity verification workflow (run after main push), paired with local verifier self-test; added 8 × 6 synthetic inventory core assertions across LIVE/isolated DEMO, 320px/390px, light/dark. GitHub CI status, PR merge, Pages attestation, physical iPhone outcome PENDING. Full app DEMO + complete LIVE ZIP builder unaffected and required for QA artifact.
- No data migrations and no production writes. App Store clinical-content and dosage calculator risk remain unresolved.

### v0.9.6-beta QA assurance merged; Pages remote check pending (2026-10-23)
- QA-only PR #33 merged to `main` at `89d5066251eaf49462e3128a17cf62fb3bc4bf32`. App source remains v0.9.6-beta, no UI, calculator, storage, schema or migration changes. Release/build/48 vial safety assertions PASS `40060006633`; mobile form PASS `40060006632`. Artifact `12547102223` contains complete isolated full-app DEMO, offline ZIP, full LIVE ZIP and JSON QA. Local Pages verifier smoke PASS only; remote Pages deployment unverified at merge.
- Follow-up PR-observable live Pages checker coded in `ops/v096-pages-evidence-handoff` to record remote HTTP/16-file hash evidence; result pending. Physical iPhone and App Store medical review incomplete.

### v0.9.6-beta production Pages VERIFIED for app files — 2026-10-23
- GitHub App PR #31 merged app `ddd38ee`; QA-only PR #33 merged `89d5066251eaf49462e3128a17cf62fb3bc4bf32`. Actual GitHub Pages remote HTTPS byte parity PASS for 16/16 source files: PR #34 workflow `40060285190`, evidence `12546599640/Nexus_PAGES_REMOTE_CHECK_PR.json`, first remote request pass, not local smoke. App source unchanged through both ops branches. No migrations, version change or protected-data writes.
- Physical iPhone and native Safari colour picker, actual local home-screen cache, full dose-form inventory/draft workflow NOT TESTED. App Store medical-content and calculator compliance review still incomplete. Status v0.9.6 app code: MERGED, AUTOMATED TESTED, PAGES VERIFIED; real-device acceptance and medical review remain open.

### Public iOS measurements planning + synthetic diagnostic — QA-only, NO NEW APP RELEASE (2026-10-24)
- Branch `qa/ios-measurements-approval-math-diagnostics`, PR #36, baseline `df5b1ab4a6924a4594422b22077930aa178d4d42` v0.9.6-beta. User approved the two-tool design **Measurements & Preparation** as a public iOS direction, with both calculators retained. No visible app change/version increment, no storage/migration change, no LIVE Pages publish performed.
- CI workflow adds synthetic numerical diagnostic, source files untouched. PR head `a5861cb` run [40061025452](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061025452): eight LIVE-local/full-demo contexts 320/390 dark/light, 80 math checks, **40 PASS / 40 FAIL**; recurring calculator problems: syringe 30u/50u scaling and capacity mismatch, unqualified IU conversion, negative input. **Calculator validation FAIL** and iOS release blocked pending fixes/review.
- Other existing test results unaffected: browser/Check-In/Protocol matrices and 48 vial safety assertions PASS, mobile [40061025531](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061025531) PASS. Artifact `12547685887` includes exact-source v0.9.6 LIVE ZIP, full isolated standalone DEMO, JSON and screenshots; these are unmodified builds, not newly deployed app version. Device tests, professional clinical validation, App Store review and iOS packaging NOT TESTED. PR merge outcome pending at entry.

### v0.9.6-beta unchanged — iOS planning/QA PR #36 MERGED (2026-10-24)
- PR #36 merged `d2e77f155ccf7f19a0d7644e47338bb10689788d`, **NO USER-VISIBLE APP RELEASE**; only approved design documentation, synthetic calculator safety diagnostic `tools/audit-measurement-math.mjs` and release QA workflow updated. No stored records, schema, imported data, app CSS/JS/HTML or GitHub Pages publication changed.
- CI latest branch run [40061188674](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061188674) PASS for suite execution; mobile [40061188614](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40061188614) PASS; artifact `12547830430` contains unchanged source FULL DEMO + LIVE ZIP and diagnostics. **Critical measurement calculator results still 40 FAIL/40 PASS of 80 tests; not medically validated.** iOS App Store, physical iPhone and clinical/legal verification incomplete.

### v0.9.7-beta — rebased safety release proposal after concurrent main updates (2026-10-24)
- Previous PR #35 data-integrity guard/test PASS run `40061288470`, mobile `40061288551` and release archive #12546878570, but branch unmergeable because #36/#37 concurrently changed main; old archive is only evidence for its tested source.
- New source baseline `b382a978` contains approved iOS Measurements & Preparation design docs and 40 PASS/40 FAIL diagnostic tests, all PRESERVED. New branch `release/v097-logdose-confirmation-from-latest-main` reimplements only Log Dose reject underallocation and invalid amount + full real UI regression; display/ZIP/demo version v0.9.7. No existing history migration, storage overwrite, reconstitution formula change or calculator math change. New branch CI and deployment NOT VERIFIED.

### v0.9.7-beta — APP MERGED / PAGES PENDING (2026-10-24)
- GitHub application PR #38 merged `2a27f155e3b174bbfaa5347e5f785e8a8fcddadc` onto main previously at `b382a9781a90c67349a0e0708e3843cadfe83e5f`. v0.9.7 title verified on main. Fix: Log Dose cannot save incomplete source amount or zero/negative/nonfinite input. Source-vial accounting math, prepared history, existing records and storage schema untouched. User-visible error explains that nothing was saved.
- Branch QA PASS `40061915470` (8 LIVE/full isolated DEMO × dark/light × 320/390, 40 real-form Log Dose workflows, 48 vial source safety, existing Check-In/Protocol), `40061915446` mobile PASS. GitHub artifact `12548340363`: standalone COMPLETE DEMO HTML, offline DEMO ZIP, root-index LIVE ZIP with 3 CSS + 12 JS, screenshot matrix and QA JSON. Medical calculator diagnostic still 40 FAIL of 80; not addressed by this release. Physical iPhone not tested. Postmerge Github Pages production version NOT YET INDEPENDENTLY CONFIRMED; scheduled to check via remote CI artifact.

### v0.9.7-beta — LIVE PAGES VERIFIED (2026-10-24)
- App PR #38 merged `2a27f155e3b174bbfaa5347e5f785e8a8fcddadc`. Postmerge docs PR #39 run `40062278673`, artifact #12547383562, `Nexus_PAGES_REMOTE_CHECK_PR.json`: HTTPS `smoke_only:false`, `verified:true`, 16 app source files byte-identical on first attempt, so v0.9.7 published code parity VERIFIED. PR #39 mobile `40062278638` PASS.
- Real Log Dose underallocated/invalid input protection shipped, no history migrations; 40 end-to-end Log Dose cases, 48 vial-core cases and all existing display/Check-In/Protocol checks passed. Entire isolated DEMO HTML and browser ZIP, complete LIVE ZIP and release manifest delivered. Medical measurement math 40/80 failures, App Store requirements and physical iPhone remain incomplete.


### v0.9.8-beta — Log Combo Dose scalable picker (CODED ON PR #42, QA PENDING, 2026-10-24)
- Baseline main `2da1001` (public v0.9.7-beta). Branch `release/v098-combo-picker-20261024`, draft PR #42. New searchable, capped-height 50+ compound multi-select avoids whole-modal rebuild, preserves in-progress amount, date, site, notes and symptom UI, separates favorite selection from deletion, keeps prepared physical syringes and existing source allocation/dose logging logic. Code and build metadata display v0.9.8-beta. Add Kit and Stash redesign NOT IMPLEMENTED.
- Data impact: no migrations; no history, calculation, localStorage or inventory schema changes. Complete full-app isolated DEMO HTML, offline DEMO ZIP and complete LIVE ZIP implemented in existing same-source builder; **delivery artifacts INCOMPLETE pending passing CI**. Automated test target 8 × 50-compound search and protected existing suites. Physical iPhone NOT TESTED. PR, merge, deployment all INCOMPLETE until verified. Medical calculator diagnostic unrelated and still BLOCKED, not fixed by this release.

### v0.9.8-beta Combo picker — BRANCH VALIDATED, NOT YET DEPLOYED (2026-10-24)
- Draft PR #42 `release/v098-combo-picker-20261024`; original main `2da1001` to tested source `89d253d`. Screen: Log Combo Dose; searchable 50+ compound selection in max-height scroll panel, dynamic selected dose fields with amount/date/site/notes draft retention, separate favorite apply/delete controls. No alteration to planAndApplyComboDoses, prepared physical syringe routing, kit inventory or saved historical records; no migration.
- PASS browser/build [run 40067532927](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532927) and PASS mobile [run 40067532954](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532954). 8/8 fictional 50-compound picker cases at 320/390 dark/light, 8/8 baseline and Check-In and Protocol; 48 vial safety core assertions, 40 Log Dose real form workflows. Complete exact-source full-app DEMO HTML, offline HTML ZIP and LIVE root-index 16-file ZIP in Actions artifact #12550276253; actual ZIP CRC and byte-identical standalone/offline HTML verified.
- Existing unrelated measurement math diagnostic **40 FAIL/80** remains blocking for clinical calculator safety, not represented as a pass. Physical iPhone/Safari/VoiceOver NOT TESTED. PR merge, GitHub Pages public v0.9.8 parity and device acceptance INCOMPLETE at this entry.

### v0.9.8-beta — RELEASED: CODED, AUTOMATED TESTED, MERGED, PUBLIC PAGES VERIFIED (2026-10-24)
- Baseline main `2da1001a43812819266066159cb7f2d73746e3c1` → PR #42 merge `253544b46c014675c18d4c2e6255228e28333028`. Public URL `https://deidrajw.github.io/Peptide-Tracker/`, Pages deployment workflow [40068083410](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40068083410) SUCCESS and actual **16/16 exact byte source parity** [40068084296](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40068084296), artifact `12550490662`; postmerge mobile form [40068084355](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40068084355) SUCCESS.
- Screen: Log Combo Dose. 50-compound-scale scroll-bounded search-first multi-select, in-place selection, preserved draft amounts/shared date/site/notes, separate favorites apply/delete; prepared syringes, inventory deductions, symptom recording, historical dose records and all other tabs unchanged. No database/storage migration and no intentional data impact.
- Browser/run [40067532927](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40067532927) PASS: 8 LIVE-local / complete isolated DEMO × 320/390 × light/dark 50-compound picker; 8 other display/browser, 8 Check-In, 8 Protocol, 48 vial core, 40 real Log Dose workflows. Complete full-app DEMO HTML, browser-openable offline ZIP, complete root-index 16-file LIVE ZIP, manifest, screenshots and JSON QA in artifact `12550276253`; ZIP CRC and HTML byte parity checked. In-chat interactive picker and checklist delivered.
- Limitations: real physical iPhone/VoiceOver/PWA cache NOT TESTED; separate original Measurement Calculator still **40 FAIL/80 assertions** (not changed), clinical/iOS App Store release gate remains BLOCKED. Stash/Add Kit designs in draft PR #41, unimplemented.

### v0.9.9-beta — proposed Stash Actions sheet, CODED ON RELEASE PR #44 (2026-10-24)
- Baseline public v0.9.8-beta main `6d616856`; branch `release/v099-stash-sheet`, PR #44 DRAFT. Stash kit action bottom sheet with grouped conditional inventory, kit/history and destructive rows. Standard and blend kit cards receive ellipsis paths; blend uses its own Edit/Log handlers. Source version/build/tests aligned v0.9.9. No migrations, saved record or inventory math changes; public LIVE remains v0.9.8 pending release.
- Full-app fictional isolated DEMO HTML, offline DEMO ZIP, complete 16-file root-index LIVE ZIP assembled by retained same-source release builder; CI run, actual artifact QA, merge, Pages parity, physical iPhone all **INCOMPLETE/NOT TESTED** until evidence arrives. Existing calculator medical-math 40/80 failure on old public baseline unaffected.

### v0.9.9-beta — RELEASED / PAGES VERIFIED 2026-10-24
- Baseline `6d616856` → release PR [#44](https://github.com/Deidrajw/Peptide-Tracker/pull/44) merge `704fdb16b6720fc36929d2183a2c4651e91771ef`. Affected screen Stash: grouped compound actions bottom sheet, added blend ellipsis, preserved standard and blend inventory operation handlers and all history. No data migrations or storage/record updates.
- All six: fictional in-chat interactive sheet PREVIEW delivered; exact-source complete isolated standalone full-app DEMO HTML and byte-parity offline DEMO ZIP, complete 16-file deployable LIVE ZIP in Actions artifact **12550214994**; GitHub branch/PR checks passing and merge completed; release notes and regression checklist delivered; production Pages independently VERIFIED as 16/16 source bytes [run 40069938848](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40069938848), proof artifact #12550612521; GitHub Pages run `40069938543` and main mobile `40069938840` SUCCESS.
- Automated browser validation `40069652295`: Stash actions 8/8 standard open/stored/blend, standard browser 8, Check-In 8, Protocol 8, vial source core 48, Log Dose full UI 40, Combo Dose 50 compounds 8. ZIP CRC and DEMO HTML offline index identical. Physical iPhone/manual VoiceOver and keyboard NOT TESTED. **Separate preexisting calculator diagnostics 40 FAIL/80** remains a safety blocker and no medical-release clearance is implied.

### v0.9.10-beta — actual Stash cards CODED on draft PR #46 (2026-10-24; TEST/DEPLOY PENDING)
- Baseline main `870105ce` v0.9.9. Stash standard and blend cards display owned kit remaining, sealed/open counts, state-aware open-vial progress and no manufactured 100% bar for unopened products. Detail disclosures raised to 44px with matching outline chevrons; preserved full history and v0.9.9 actions menu.
- No data migration or saved inventory math edits. Source/full app DEMO and LIVE ZIP version v0.9.10; new 8-environment synthetic Stash card QA added with protected prior regression suites. Source-verified artifacts, PR merge, LIVE Pages parity and physical iPhone all INCOMPLETE until proof. Existing separate clinical measurement math 40/80 synthetic failures not fixed.

### v0.9.10-beta — RELEASED AND PUBLIC PAGES VERIFIED (2026-10-24)
- Baseline `870105ce` (v0.9.9) → PR [#46](https://github.com/Deidrajw/Peptide-Tracker/pull/46) merge `f13b79639b968bfafd5b38df64c7456381799721`. Updated actual Stash standard/blend card body: canonical kit inventory headline, sealed/open labels, open-vial-only percentage bar, consistent Details/History disclosure. Preserves all existing actions, dose and vial history, protocols, localStorage storage key, backups and math. No migration or data loss; user data not touched.
- Automated release run [40071176740](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071176740) PASS; 8/8 actual Stash card 320/390 dark/light LIVE/isolated DEMO, general browser 8, Check-In 8, Protocol 8, vial safety 48, Log Dose 40, Combo 50 compounds 8 and Stash Actions 8. Complete same-source isolated full-app DEMO HTML, offline demo ZIP (byte-identical index), full LIVE root-index 16-file ZIP; QA source artifact #12550884240 CRC validated. In-chat interactive preview, release notes and copyable checklist supplied.
- GitHub Pages deployment [40071480385](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071480385) SUCCESS, main mobile [40071480104](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071480104) SUCCESS, **public exact 16/16 file parity** [40071479984](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40071479984) SUCCESS, artifact #12551731208. Physical iPhone Safari/PWA/VoiceOver NOT TESTED. Separate known measurement calculator 40 FAIL/80 diagnostic assertions, no clinical safety clearance, PR #40 unmerged.

### v0.9.11-beta — PROPOSED/IMPLEMENTED BRANCH, NOT RELEASED (2026-10-24)
- Baseline `17657d682e6c601774c79b603e761f9830085038` public v0.9.10-beta. [PR #49](https://github.com/Deidrajw/Peptide-Tracker/pull/49): remove doubled authored disclosure icons from Today, Protocol, Stash; rely on one CSS pseudo-chevron for native disclosure, retain one for custom This Week button. No schema changes, saved data changes, migrations, history edits or math changes. Source and full-app/demo bundle version v0.9.11.
- Automated browser QA, generated full-app DEMO/LIVE ZIP checks, PR merge and production Pages parity **INCOMPLETE** until CI evidence. Physical iPhone Safari/VoiceOver NOT TESTED. Separate pre-existing measurement calculator audit 40/80 failing remains an independent blocker.

### v0.9.11-beta — deployed October 24, 2026
- Issue #48 first phase, PR #49 merged as `1ef9337f61a45b012c0d6da21fc35b92e38939c8` from v0.9.10 baseline `17657d68`. Today, Protocol and Stash now use one shared disclosure chevron without redundant authored glyphs. No data migrations, inventory/dose calculations changed, or prior workflows removed.
- Browser suite `40107079456` PASS, including new chevron 8/8, protected Check-In/Protocol, Stash Cards and Actions, vial core (48), Log Dose (40), Combo (50 compounds). Isolated full-app DEMO HTML and offline ZIP identical, LIVE root-index 16-file ZIP verified, artifact #12564833867. Pages deployment `40107472341`, post-merge mobile `40107472461`, exact public 16/16 file parity `40107472550` PASS; proof #12565656097. Manual iPhone NOT TESTED. Unrelated calculator math diagnostics 40/80 failed; no clinical safety clearance. Further Combo Dose blend eligibility and Plans/Stash density remain pending.

### v0.9.12-beta — SOURCE IMPLEMENTED, PR #51 DRAFT, NOT DEPLOYED (2026-10-24)
- Baseline production v0.9.11-beta, main `533a3766`. PR [#51](https://github.com/Deidrajw/Peptide-Tracker/pull/51) includes missing Needs attention duplicate arrow correction, Combo Dose blend-only eligibility (protects independently stocked, historical and preset names), bordered search panel with bounded scroll and Canadian Favourites. Changes only rendering/filter logic, not localStorage or vial calculations.
- Full isolated full-app DEMO, offline ZIP, source LIVE ZIP, in-chat preview, test evidence, PR merge and production Pages verification all **INCOMPLETE pending CI**. New blend-specific regression 8 configurations added; protected prior tests remain required. Manual iPhone NOT TESTED; unrelated calculator diagnostic 40/80 FAIL.

### v0.9.12-beta — RELEASED, October 24 2026
- PR #51 merged 1253b2c2f64043b449c75e8f21b484f3aaaea636. Removed Today Needs attention duplicate arrow. Combo Dose blend-only constituent filtering retains independent and historical selections, contains bounded search in a bordered panel, displays Canadian Favourites. No migration or record loss; no calculation changes.
- Browser CI 40109066287 SUCCESS: new blend-picker 8/8, protected Combo 50-compound 8/8, Check-In 8, Protocol 8, vial core 48, Log Dose 40, Stash Cards/Actions 8 each, chevrons 8. Complete standalone isolated full-app DEMO, offline DEMO ZIP byte-identical HTML, 16-file root LIVE ZIP verified from artifact 12565752103. Mobile CI 40109066248 SUCCESS.
- Pages deploy 40109401334 SUCCESS; public 16/16 exact merged source integrity 40109401930 SUCCESS; main mobile 40109401939 SUCCESS. Physical iPhone NOT TESTED. Separate calculator diagnostic 40 failures of 80 uncorrected, PR #40 not merged. Next Stash history hierarchy/Plans layout.

### v0.9.13-beta — STASH DETAILS CODED, NOT YET RELEASED (2026-10-24)
- Base v0.9.12 SHA `225252be`. Standard Stash expanded kit details separated into Overview, Vials and History; removed nested vial/dose disclosure controls, kept detailed rows and actions, moved forecast/notes into Overview and outflow into History, preserved blend card and all stored data. Files `assets/js/10-nexus.js`, `12-nexus.js`, `assets/css/nexus-disclosures.css`, versioned build/CI. New 8-environment Stash panels test. PR, release artifacts, tests and Pages deployment **INCOMPLETE until checked**. Physical iPhone not tested; clinical calculator remains separate 40 FAIL/80.

### v0.9.13-beta — RELEASED / PAGES VERIFIED (2026-10-24)
- Source baseline v0.9.12 main `225252be` → [PR #53](https://github.com/Deidrajw/Peptide-Tracker/pull/53) merge `895d6bfd846755807a20bf7f43809bad515b2104`. Stash expanded standard kit reorganized into Overview, Vials, History tabs (44px, keyboard Left/Right/Home/End). Retains kit metadata, editable vial/dose/outflow histories, forecast, notes, Intel/reconstitution and existing ellipsis actions. Removed redundant nested history disclosures and bottom Manage link, not any records. Blend kits unchanged; localStorage, data formats and inventory calculations unchanged.
- CI [40110883172](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40110883172) SUCCESS including 8/8 new Stash panel tests in isolated LIVE-local/full DEMO × 320/390 × light/dark, protected Stash Card/Actions, Check-In, Protocol, Log Dose 40, vial core 48, Combo 50, blend selection and chevrons. Mobile branch 40110883132 PASS. Complete source artifact #12565814124 delivered: standalone isolated FULL APP DEMO HTML and byte-identical offline ZIP; CRC valid root-index LIVE ZIP (3 CSS+12 JS+index). In-chat fictional preview, release notes and copyable checklist provided.
- GitHub Pages deployment 40111253972 SUCCESS, post-merge mobile 40111254716 SUCCESS, **16/16 exact public source files** [40111254674](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40111254674) match release merge SHA. Actual iPhone Safari/PWA/VoiceOver NOT TESTED. Separate known measurement calculator 40 FAIL/80, no clinical sign-off.

### v0.9.14-beta — Plans controls CODED, NOT YET TESTED / DEPLOYED
- On `release/v0914-plans-card-hierarchy`, starting main `491b1a00` v0.9.13. Research status/ellipsis/Intel separation, 44px management controls and 44px Goal detail disclosure. No schema/data/dose/inventory changes. New 8-matrix fictional Plans QA and protected full-app build/tests; expected same-source DEMO + LIVE ZIP. Branch PR, CI results, merge, Pages and physical iPhone INCOMPLETE. Calculator diagnostic 40/80 remains unresolved.

### v0.9.14-beta — RELEASED / PAGES VERIFIED 2026-10-24
- Baseline v0.9.13 main `491b1a00` → [PR #55](https://github.com/Deidrajw/Peptide-Tracker/pull/55) merged `529f81ea55f521e7f4df3b7611617fdcf29e9fc0`. Plans Research Intel separated from title/status/ellipsis, all management controls 44px and Goal details disclosure 44px. Existing record fields/notes, Goal/Research/Shopping save and delete, Intel navigation preserved. No localStorage migrations or source calculations modified.
- CI browser [40113456056](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113456056) PASS: Plans 8/8 320/390 dark/light LIVE-local/full isolated DEMO, plus Check-In, Protocol, Stash Cards/Actions/Panels, Combo search and blend eligibility, vial core 48, Log Dose 40 and chevrons. Full fictional standalone DEMO HTML and offline DEMO index byte-identical; root index and all 16 LIVE files CRC PASS, artifact #12567208936. Deployment [40113804812](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113804812) SUCCESS, postmerge mobile 40113805479 SUCCESS; production 16/16 source equality [40113805546](https://github.com/Deidrajw/Peptide-Tracker/actions/runs/40113805546) SUCCESS, proof #12567481902. Physical iPhone NOT TESTED. Separate diagnostic calculator remains 40 FAIL/80, no clinical approval.

### v0.9.15-beta — CANDIDATE, not released (2026-10-24)
- Baseline main `6645f375`; branch `release/v0915-plans-icon-coherence`; Plans management and Research Intel icons changed from font glyphs to consistent SVG outline controls; CSS preserves >=44px management hit area. Index candidate title v0.9.15-beta.
- Affected: Plans Goals/Research/Shopping. Data impact: none intended; no saved records, Stash/Combo math, protocol or calculator changes. PR/CI/LIVE ZIP/full-app DEMO/merge/Pages deployment: INCOMPLETE until independently verified. Physical iPhone: NOT TESTED. Separate calculator #40 still hold.

### Cloudflare hosting decision — 2026-10-24 (not an application release)
- User approved GitHub-connected Cloudflare Pages `https://nexuspeplog.pages.dev/` as future primary hosting; GitHub Pages retained as fallback. No code deployment/merge, changes to localStorage, version bump or migrations in this decision. Cloudflare published SHA, 16-file parity and user data restoration NOT VERIFIED. Existing v0.9.14-beta source remains latest confirmed main, PR #57 v0.9.15 candidate unmerged.

### v0.9.15-beta icon integration candidate — 2026-10-24
- User uploaded four approved PNGs to `main` commit before release branch. Candidate branch `release/nexus-icon-integration-v0915`: iPhone 180 and browser 192/512 references, updated LIVE/DEMO packaging. Intended data impact none. CI, merge and Cloudflare publication NOT YET VERIFIED. Prior Plans v0.9.15 merged separately; calculator PR #40 held.

### Today disclosure hierarchy pilot (unreleased) — 2026-10-24
- User approved UI redesign direction. Branch `release/today-disclosure-hierarchy` keeps all underlying data and handlers but changes three repetitive chevron affordances into text-labeled expanders. Source version remains v0.9.15-beta until release finalized. CI, merged commit, Cloudflare parity, manual iPhone acceptance currently INCOMPLETE. Separate PR #61 Stash work and PR #40 calculator review unaffected.

### PR #62 follow-up: Today disclosure text-only correction — 2026-10-24
- User found extra `summary::after` chevron in Daily tracking candidate demo. Added scoped CSS override on branch; no JS business behavior, stored data or calculations changed. Previous PR #62 head had both workflows PASS, but new head requires fresh validation. Merge, publication and real iPhone acceptance UNVERIFIED.

### 2026-10-24 — Today icon QA gate corrected
- Full workflow 40127200163 FAILED at legacy `tools/validate-chevron-unification.mjs` assertion requiring a visible chevron on Daily tracking, contradicting user-approved explicit View tracking label. Earlier browser, data and Stash assertions passed before this point. Corrected automated expectations to assert the labeled Today disclosures have NO generated chevron; remaining generic Protocol/Stash chevron tests preserved. Re-run on new head required; do not mark release passed or merged until success.

### Post-Today Stash header candidate — 2026-10-24
- Applied previously approved and CI-validated PR #61 UI-only changes on latest Today release baseline main `44b04728` to avoid old PR merge conflicts. Candidate branch `release/stash-consistency-current-main`. Version title remains v0.9.15-beta until release bookkeeping; new branch CI/merge/deployment NOT YET VERIFIED, data migration none.

### Informational empty-state audit / Stash menu pilot — 2026-10-24 (candidate)
- Branch `release/stash-empty-states-20261024` from main `62fae531` implements placeholder for zero eligible Kit actions menu entries, specifically unopened/unreconstituted blend; existing action buttons and safety guards unchanged. Broader cross-app source audit documented. LIVE/DEMO builds, CI, merge and Cloudflare deployment UNVERIFIED. Data impact none; no migration.

### 2026-10-24 — Connected Goals product specification (design only)
- `docs/design/CONNECTED_GOALS_SPEC.md` authored on design branch from main `051f8203`; maps approved Goal/Protocol/Check-In/Journal/Insights experience, staged releases, additive schema plan and regression gates. No code, migration, PR merge, app release or deployment implied. Status SPEC DRAFT.

### Connected Goals Release A Protocol status filter — candidate 2026-10-24
- On branch `release/connected-goals-a-protocol-filter`, after design PR #68 merge `7abdc7e1`, added UI filter chips and reset to Protocol view in JS 11/12. No saved data changes. CI/merge/Cloudflare/physical iPhone still UNVERIFIED; displayed version unchanged until real release. Goal association and progress are staged separately.

### Connected Goals A2 explicit goal association — candidate 2026-10-24
- Branch `release/connected-goals-a2-linking` from main `17182101` adds Protocol Builder Review personal-goal selector and protocol-card linked goal display via new optional `linkedGoalId`. Legacy template `goalId` unchanged. No migration, no data loss intended; normal protocol Save writes new optional reference. QA, merge, artifacts, Pages/Cloudflare remain UNVERIFIED.

### Connected Goals A3 detail sheet — candidate 2026-10-24
- On branch `release/connected-goals-a3-detail` from verified main `d25a5a36`, add read-only Goal Details Overview, Connections, Activity accessible through active and other goal cards. No data migration, no calculation changes, no deployment. CI and full release artifacts PENDING.

### 2026-10-24 — A4 flexible progress modes candidate
- Based on A3 main `223fea3c`, A4 branch adds progressModel editor, truthful Goal Overview and opt-in weight-history comparison, no record duplication or migration. Added browser matrix functional assertions; CI/merge/deployment unverified pending PR.

### 2026-10-24 — A5 Goal Check-In evidence candidate
- Proposed additive `goal.evidenceSymptom` selection and read-only existing `dailyLogs` evidence in Goal Activity. No Check-In data writes or duplication. Code staged on release branch only, CI/merge/deployment UNVERIFIED.

### 2026-10-24 — A6a Check-In reflections candidate (NOT RELEASED)
- On branch `release/connected-goals-a6a-checkin-reflections` from A5 main f980a283, coded source-linked Goal Activity daily reflections and navigation to original Check-In; no migration, no copied Journal content, no changes to original logging. New browser assertions cover source matching, exclusion, edit/removal, and storage preservation. CI, exact-source LIVE/full DEMO artifact, merge, deployment and iPhone QA INCOMPLETE.

### 2026-10-24 — Combined UX consistency candidate (UNRELEASED)
- Branch `release/unified-ui-research-journal-insights` from A6a main. Research title/Intel/reason hierarchy, Journal dropdown filter, single-focus Check-In changes modal, shared style adjustments. No persisted schema or data migration. Full-browser mobile 320/390 light/dark LIVE/DEMO, artifact parity, merge/deployment, physical iPhone PENDING. Do not call release shipped based on branch code.

### 2026-10-25 — Card header parity corrective candidate (UNRELEASED)
- From main dded5084, user-reported visual mismatch remains after PR #80. Branch `release/card-header-parity-20261025` applies DOM-level status-below-title structure and unified menu SVG to Research/Goals/Protocol/Stash, preserves all actions/status semantics and storage. CSS parity rules and targeted browser assertions added. CI, packaging, PR merge and host parity pending; physical screenshot defects are confirmed in current live UI, not signed off.

### 2026-10-24 — Store readiness and neutral avatar audit candidate (NOT RELEASED)
- Branch `feature/release-readiness-onboarding-avatar-audit` from main `7624c4d3`: scoped no-photo profile avatar replaced with user outline in shell/profile editor (candidate), detailed release/onboarding/privacy audit committed. No migrations, no final changelog popup, no release manifest implementation. CI/merge/host/artifacts INCOMPLETE; no app store submission. Calculator #67 held.

### 2026-10-25 — Release manifest foundation candidate (NOT PUBLISHED)
- Branch `feature/unified-release-manifest-foundation` adds machine-readable `release/release.json` for current v0.9.15-beta (publication status `unverified`), three derived note outputs and build-time parity gate. It does not claim a new release, activate a popup or change user records. LIVE/full isolated DEMO CI, branch PR, deployment and iPhone testing pending. Legacy numeric CHANGELOG remains intact. Neutral avatar fix remains separately in PR #84 pending final merge.

### 2026-10-25 — Release notes and publish-gated popup candidate (UNRELEASED)
- PR #85 now includes generator/output parity, ordered runtime metadata in 02 JS, first-launch publication-gated modal in 12 JS, and browser assertions for unverified silence, Later and acknowledgement. Current release manifest status UNVERIFIED so no popup triggers for that build. Legacy numeric changelog not erased; no record migration. CI/merge/Cloudflare/real device pending.

### 2026-10-25 — v0.9.16-beta onboarding candidate (UNRELEASED)
- Branch `release/onboarding-safe-first-run` at main base a3318973, changes first-run welcome, local storage explanation, Start Fresh, guarded import with JSON shape checking/count preview/confirmation/empty-state backup, and standard CSS. Canonical manifest and generated three note formats updated to v0.9.16-beta (status UNVERIFIED); browser/source/CI and packaging unverified, no merge/Cloudflare/physical iPhone. No destructive migration or automatic import. Calculator #67 held.

### 2026-10-25 — v0.9.17-beta Getting Started polish (NOT RELEASED)
- New candidate branch `release/onboarding-getting-started-polish` from v0.9.16 main 888d746c. Changes onboarding Done-step visuals and guide button only, no migration/storage/calculation changes; aligns canonical release manifest and three notes with v0.9.17-beta (publication unverified). CI/artifact/merge/deployment pending.


### 2026-10-24 — v0.9.18-beta unified UI/trust/release (CANDIDATE / NOT DEPLOYED)
- Branch `audit/unified-experience-trust-release-20261024`, PR #94 from main b6737fad (PR #89 merged v0.9.17-beta). Publication metadata still unverified, no deploy commit claimed.
- Added Privacy & Data, notification context, backup restore preview/typed confirmation/recovery, 44px navigation, reduced-motion/focus controls, strict calculator input/capacity/IU guards and fixed 30/50/100 U-100 invariant math.
- Synchronized `release/release.json`, in-app metadata, Apple and Google notes and HTML title to v0.9.18-beta. CI and 13 browser scripts now obtain version from canonical manifest. Added protected restore/privacy browser tests and blocking math assertions. No schema migration.
- At entry: latest-head LIVE/full isolated DEMO/QA, PR merge, Cloudflare site parity, iPhone/VoiceOver and native stores are INCOMPLETE. Final evidence and mapping must be appended, not inferred.

### 2026-10-24 — v0.9.18-beta merged source and package verification (WEB PUBLICATION UNVERIFIED)
- PR #94 merged at main `623025665c549dadbe3fb467b6d556f5d44e7e34`. Prior candidate note marked NOT MERGED is retained as historical state.
- GitHub Actions PR release run 40158486843 successful; mobile-form run 40158486825 successful. Candidate artifact 12584823539 contains standalone full-app DEMO HTML, offline DEMO ZIP, complete LIVE ZIP and JSON browser evidence. Inspected LIVE ZIP: root index, all three CSS, twelve ordered JS, four icons. All 16 index/CSS/JS Git blob SHAs match merged main. No storage migration; user-initiated restore remains explicitly gated.
- Pre-merge host comparison `Nexus_CLOUDFLARE_PARITY.json` was FAIL (`index.html` hash mismatch), so no actual Cloudflare publication is certified. Manifest status remains `unverified`. Physical iPhone, VoiceOver, native store policy/privacy signoff NOT TESTED.

### 2026-10-24 — v0.9.18-beta verified Cloudflare live and publication acknowledgment candidate
- Web app PR #94 merged in main `623025665c549dadbe3fb467b6d556f5d44e7e34`. Docs PR #96 merged `1a5b6f231dd279db306d2a17906a4fbbab2303d9`.
- Remote comparison in Actions run 40159182188: `verified:true`, 16/16 HTML/CSS/JS byte hashes match target web source. Full CI and mobile forms run 40159182258 PASS. Earlier pre-merge host mismatch was correctly treated as a temporary unpublished source, not covered up.
- Next staged follow-up `release/v0918-publish-verified-manifest`: manifest status `published`, source commit `623025...`, UTC verification timestamp `2026-10-25T03:45:21Z`, updated in-app/runtime metadata, same app version and no record migration. Follow-up PR CI, merge and new Cloudflare deployed byte parity still pending.
- Physical iPhone, VoiceOver, native store approvals and public privacy policy remain NOT TESTED / INCOMPLETE.

### 2026-10-24 — v0.9.18-beta PUBLISHED WEB, FINAL CLOUDFLARE PARITY PASS
- PR #94 implementation merged `623025665c549dadbe3fb467b6d556f5d44e7e34`; PR #96 docs merged `1a5b6f231dd279db306d2a17906a4fbbab2303d9`; PR #97 publisher metadata merged `3625462a04c1eb124e350f6989b57019e3256380`; PR #98 final remote comparison docs merged `8c3d874c549f2e3ef3b8004bb961ec29b7f4743f`.
- **LIVE:** Cloudflare `https://nexuspeplog.pages.dev/`; post-publication remote byte compare Actions run 40160165392 `verified:true` for all 16 app entry files (HTML/3 CSS/12 JS). Final published manifest source includes the once-per-version What's New popup. Browser/build and mobile forms PASS in runs 40160165392/40160165348; previous independent conversion math 80/80 and backup trust matrix PASS.
- LIVE 20-file package, standalone full-app fictional isolated DEMO HTML and offline DEMO ZIP were generated from the same v0.9.18-beta published source; data impact: no automatic migration, manual restore requires typed confirmation and attempts local recovery/rollback. Historical changelog preserved.
- Not equivalent to native-store approval: human iPhone/VoiceOver, all surfaces manual usability/contrast, policy/privacy processor declarations, and Apple/Google submissions remain incomplete.

### 2026-10-25 — v0.9.19-beta corrective candidate (NOT YET RELEASED)
- Targeted response to physical iPhone issues: blend open vial and reconstitution metadata, blend-as-one-entry in Today picker/dose logs, composition percentages, and Protocol phase/review input geometry. Source branch `release/v0919-blend-protocol-iphone-fixes`; baseline v0.9.18 main `2bf40535`.
- Data impact: additive blend vial metadata, new single blend-dose logs, no automatic migration; existing constituent dose logs retained. Version manifest `unverified`. Full CI/live Cloudflare/iPhone acceptance pending. Published v0.9.18 unaffected until safe merge.

### 2026-10-25 — v0.9.19-beta merged and Cloudflare-confirmed application source
- Implementation PR #100 merged `955c904860b39c5c56472b07cd3521828d5d9d79`. Release CI 40161722598 and mobile form 40161722564 PASSED. Post-merge PR #101 remote site audit 40162047192 verified 16/16 primary Cloudflare application entry files; docs PR #101 merged `c6b64c113c703fcfcb7fb372172fcf8c966d7266`.
- Data effect: no migration; explicit open/finish blend entries and new blend-level dose logs only, with existing ingredient doses preserved. Full LIVE ZIP and fictional isolated standalone DEMO/ZIP generated from identical source. Physical iPhone review outstanding.
- Publication metadata follow-up `release/v0919-verified-publication` is an UNMERGED candidate; generated runtime and notes updated, not yet verified on live host.

### 2026-10-25 — Published release modal theme contrast hotfix candidate (NOT RELEASED)
- v0.9.19-beta in live screenshot, published What's New light theme primary acknowledgment appears absent. Candidate branch `fix/issue-109-theme-visibility-audit` adds explicit modal action colors/geometry and Playwright contrast/visibility gate. No data model/storage changes, real dose logs unaffected.
- Branch awaiting latest-head CI, version/manifest decision, complete isolated FULL DEMO + LIVE ZIP, merge and independent Cloudflare host parity. Real iPhone revalidation and broad full-app theme audit remain incomplete. Do not mark deployed from a PR merge.

### 2026-10-25 — PR #111 extended theme audit candidate (still NOT DEPLOYED)
- Scope grew from published release Got it invisible on physical light-mode iPhone to targeted source-confirmed repeated contrast defects in Protocol actions, inline lavender buttons/badges, Calendar numerical weights and dark/light muted token palette. CSS only; 9-tab diagnostic + block on 4.5:1 release modal and neutral token combos in 8 browser modes.
- PR #111, independent of unfinished PR #110. First CI failed due audit regex bug, corrected; run 40165287614 passed after correction. *Later* commits require new latest-head CI. No changes to localStorage/data history; no actual iPhone recheck or independently verified deployment yet.

### 2026-10-25 — v0.9.19-beta theme contrast hotfix — CODED / TESTED / MERGED, CLOUDFARE UNVERIFIED
- PR #111 merged with squash `da18b2fb243a57e3023e493093dac70bfe8056f9`; unchanged version v0.9.19-beta (patch delivery to published channel, not a new published What's New entry).
- Fixed published release Got it/Later visibility in light/dark, AA muted palette on neutral surfaces, Protocol CTA, inline white-on-lavender buttons/badges, and Calendar compact weight/day colours. CSS + QA/doc code only; no localStorage changes, history edits or changes to dose math. Browser matrix 40165612214 and mobile forms 40165612207 PASS on PR head, 8 LIVE/full DEMO theme/width configurations; 9-main-surface contrast diagnostic still requires manual candidate review.
- FULL DEMO/LIVE ZIP generated in passing workflow artifact; independent postmerge Cloudflare 16-file verification pending; physical iPhone, VoiceOver, all modal AA certification NOT TESTED. Issue #112 remains open. Separate blend parity PR #110 remains unmerged.

### 2026-10-25 — v0.9.19-beta accessibility hotfix: WEB DEPLOYED / CLOUDFLARE VERIFIED
- App PR #111 squash merge `da18b2fb243a57e3023e493093dac70bfe8056f9`. No version bump: original v0.9.19-beta published acknowledgment remains as-is. Fixes blank-looking Got it/Later action, muted palette, Protocol Create, inline light-lavender text, Calendar small weights/today marker. No data migration, inventory or dose-math change.
- PR #111 release/full DEMO and browser build run 40165612214 PASS, mobile forms 40165612207 PASS; LIVE ZIP 20 files, standalone full fictional isolated DEMO plus offline demo ZIP artifact #12588676170. Version source app files match main merge.
- **Independent primary host audit:** docs-only PR #113 run 40165897243 artifact #12588721468 `Nexus_CLOUDFLARE_PARITY.json` `verified:true` for 16/16 index+CSS+JS remote SHA256 hashes. Mobile forms #40165897242 PASS. Hence web implementation deployed. Human device acceptance and full all-modal AA contrast are **NOT TESTED**, Issue #112 remains open. PR #110 still unmerged.


### 2026-10-25 — Release reliability guard (candidate)
- Intended version v0.9.20-beta exists on unmerged `release/issue-109-kit-experience-parity` / Cloudflare preview deployment `a3c0ce76-5176-406a-91b2-08bf73763ceb`; production and current main confirmed v0.9.19-beta at audit. Preview SUCCESS does not imply production deployed.
- Dedicated read-only post-main-push and manually invokable version + exact 16-file remote parity gate authored on `safety/release-deployment-parity-gate-20261025`. Candidate, not merged or CI verified at writing. Does not modify release.json, app source, data or published assets.
- v0.9.20 application release still blocked by unverified inventory/KLOW/legacy edit, full LIVE/full isolated DEMO and responsive functional regression on PR #110. Promotion not claimed.

### 2026-10-25 — Approved mobile hierarchy candidate (unreleased)
- Candidate on `feature/approved-ui-hierarchy-20261025`: compact vial ellipsis, responsive empty/open kit actions, multi-vial action styling, injection-site guidance relocation, Combo favourite dropdown, single-compound Trends detail/back navigation and duplicate glyph removal. No data schema changes. Blend Today card parity outstanding; branch/PR validation and Cloudflare production NOT COMPLETE.

### 2026-10-25 — PR #119 follow-up (candidate; not a production release)
- From iPhone preview evidence, fixed cramped multi-vial control and oversized Stash per-vial ellipsis by CSS-only overrides. User accepted the rest of the previewed UI, but latest-head automated and release artifact verification pending; PR draft and Cloudflare production unchanged.

### 2026-10-25 — v0.9.20-beta UX hierarchy patch — MERGED; DEPLOYMENT UNVERIFIED
- PR #119 squash merge SHA `3ef22b98326fc54777dbbef8ca9b013082f8f9fb` includes adaptive Stash kit actions/empty state and compact vial ellipsis, injection-site guidance relocation, corrected multi-vial button with 20px horizontal/12px vertical padding, compact Combo favourites selector, and compound Trends dedicated detail/back; targeted browser fixture updates.
- User preview iPhone acceptance for displayed changes recorded. CI mobile `40212593190` PASS, release browser and packaging `40212593263` PASS. Application version remains 0.9.20-beta; no destructive migration. Main merge is proven, Cloudflare Production source parity PENDING. The specific old expanded blend-card parity and app-wide divider/contrast PR #118 remain separately unresolved.


### 2026-10-25 — Hybrid Design System 2.0 preview (UNRELEASED CANDIDATE)
- Draft PR #123; experimental CSS, source-derived standalone full-app preview, branch-only builder support and browser QA. Main/Cloudflare unaffected. Version still v0.9.20-beta; this entry is *not a release* or deployed version. No data schema change. Build/browser results pending latest CI; full artifact parity and isolated storage require verification before approval.


### 2026-10-25 — Hybrid Today screen source-level redesign (UNRELEASED)
- Design draft PR #123: Today presentation in `assets/js/10-nexus.js` + experimental CSS; responsive progress ring uses existing schedule percentage, Check-In action event classes preserved. All historical data and JS calculations unchanged. Workflow results pending. This is not a deployed release.


### 2026-10-25 — Phase 2 Stash hybrid visual preview (UNRELEASED)
- Draft PR #123 visual-only Stash CSS commit `157a4128`; layered inventory summary, elevated kit/vial surfaces, action control hierarchy and two themes. Source math/data unchanged. Branch-only; CI and design approval pending; not a versioned production release.


### 2026-10-25 — Hybrid Stash refinement pass 2 (UNRELEASED)
- Draft PR #123 code `e29cb50f` / `5134978f`: native-style category segments, toned-down Inventory Overview and kit gradients, structured Needs Attention list, modal styling baseline. No data migration or logic change. Latest-head QA pending. Not merged or deployed; production unaffected.


### 2026-10-25 — Visual cleanup candidate (NOT RELEASED)
- Design PR #123 commit `7fa1a893`: reduced kit-button shadow, paired Today CTA consistency, Needs Attention rail removed. Visual-only CSS; no migrations. Latest-head tests pending, no production deployment.


### 2026-10-25 — Kit-card action hierarchy Phase 2D (UNRELEASED)
- Draft PR #123 commits `bba65429` and `ac9a4f27`: remove persistent Prepare button from Stash cards, retain menu Prepare and global shortcut; responsive two-action card styling. Data impact none; branch-only candidate pending QA. No production changes.


### 2026-10-25 — Inventory source allocation clarity (UNRELEASED)
- Draft PR #123 source commits `3875da06`/`74228713`: numbered source labels, kit identity and explicit Draw confirmation wording, CSS grouping. Previous Stash open-card test updated `3dc44b22`. Math and persistence logic unchanged; testing and design approval pending. No production deployment.


### 2026-10-25 — Stash modal audit / responsive control preview (UNRELEASED)
- Draft PR #123 audit doc `1a2c3540`, CSS `0bd28df5`: larger Prepare count hit targets, readable concentration output and 50px buttons. No data changes; latest-head QA/visual signoff pending. No production merge or deployment.


### 2026-10-25 — Today lower-page visual refinement (UNRELEASED)
- Draft PR #123 CSS commit `287cd89d`: schedule nav, compact cards, facts, actions and chevrons. Functional renderer/recorded data unchanged. Expanded rich card parity and iPhone visual validation still incomplete; no merge/deploy.


### 2026-10-25 — Today expanded/tracking/week visuals (UNRELEASED)
- Design PR #123 commits `685a6aab` and `593e6d19`: expanded compound presentation hook and scoped style treatment for expanded cards, tracking and weekly disclosure. Does not alter dose logic or saved records. Browser visual/functional QA pending; no release.


### 2026-10-25 — Today expanded-card follow-up
- 2026-10-25 Today expanded detail hierarchy coded at 464e07de + fd66a187; branch-only, not merged, not deployed. No storage or math migrations. Exact-head QA and release artifacts INCOMPLETE.


### 2026-10-25 — Segmented Today information follow-up
- PR #123 preview commits cf74e60b and 6ff6ec2c: Today expanded card gained segmented Insights, History, Details; moved site rotation notice into Insights and removed rotation emoji. No intended dose data, schedule, storage or math changes; no merge or deployment; exact-head test/artifact status NOT VERIFIED.


### Today compact action cleanup
- 2026-10-25 PR #123 CODED / NOT MERGED: Today UX clarity follow-up, commits c0124a0, d969527, 8b27bab. Affects compact card disclosure/action row and expanded history menu/helper. No dose math, localStorage migration, or production user data writes. LIVE ZIP / FULL isolated DEMO artifacts and latest head QA still INCOMPLETE. No Cloudflare deployment.


### Log Dose preview trial
- 2026-10-25 PR #123 preview-only code 2dfae668: conditional expanded Log Dose presentation, no changes to doseModal or storage. Browser and physical iPhone NOT TESTED, deployment unverified; no merge to main.


### 2026-10-25 — Log Dose preview release checkpoint
- 2026-10-25 — DESIGN PREVIEW CODED / CLOUDFLARE PREVIEW DEPLOYED / PRODUCTION UNCHANGED. PR #123 commits 0819acc1, 9fe7803. Today compact scheduled dose CTA, overdue entry, completed state and conditional action styling. No localStorage schema or accounting logic migrations intended. Cloudflare reports success at 9fe7803; preview https://fce7e142.nexuspeplog.pages.dev. Exact-head full browser/iPhone acceptance INCOMPLETE. GitHub LIVE/DEMO bundles must be validated against final branch head before release.


### 2026-10-25 — Today expanded screenshot audit
- 2026-10-25 preview-only PR #123 commits 4c1ba682, 56f215c8, 59c6e7b6: expanded Today overdue de-duplication, visual timing/data hierarchy, per-occurrence labels and hit targets, completed-state notice. No persistent schema, calculation or inventory edits intended. QA NOT TESTED at this head. LIVE ZIP/isolated FULL DEMO INCOMPLETE; Cloudflare and merge not verified/authorized.


### 2026-10-25 — Critical preview syntax hotfix
- 2026-10-25 unreleased preview hotfix on draft PR #123: `77de882432af2ec48a0d44b3342af13f5b68df26` repairs missing `}` in `assets/js/08-nexus.js` expanded completed-dose presentation. Data impact: none intended; source code-only syntax correction. V8 syntax parse of scripts 07-12 PASS; browser UX, builds, Cloudflare deploy, physical iPhone NOT TESTED. No merge or production release. Standalone DEMO and LIVE ZIP INCOMPLETE.


### 2026-10-25 — Today card milestone consolidation
- 2026-10-25 — Draft PR #123 unmerged Today-card consolidation: `5ef99dea` heading/insight cleanup, `91cf8bce` Today invariant test, `99c12afc` CI gate. Data impact none intended; source assertions 14/14 pass by independent string inspection, but browser startup, runtime flows and physical iPhone are not yet validated. LIVE ZIP, full-app standalone DEMO INCOMPLETE. Not deployed to production.


### Today milestone — source-derived QA gate (2026-10-25)
- 2026-10-25 draft PR #123: 5ef99dea improved expanded text presentation; 91cf8bce + 99c12afc added Today source-invariant CI; b397ac12 + 0513998a changed preview QA to generate and test exact-source isolated full-app demo. Data impact: no migration or dose engine changes. V8 source parse PASS (12/12), source invariants 14/14 reviewed. Latest CI/browser, artifacts and deployment not verified. Not released.


### Today disclosure / typography parity (2026-10-25)
- 2026-10-25 draft PR #123 continued: shared disclosure/typography changes 1b4feb9f, 12da3fa7, 6405c0db, 853e58e3, b9cc9a7a, 4c52a898; tests 87a32f82, 5d555d70, 6fee66f0. Impact: Today compact, paused compact, expanded cards. Data changes: none intended; no schedule, dose, ledger or inventory algorithm modifications. JS syntax checks PASS; full browser/cross-theme parity and iPhone NOT TESTED. DEMO/LIVE artifacts not delivered; no production release.


### Today grouped correction pass — 2026-10-25
2026-10-25 PR #123 draft changes c38b9a0 and bdb0da6: Today expanded disclosure CSS, insight grouping, Intel button, record-grounded protocol review copy. No dose math, localStorage, history or migration changes intended. JS 08 syntax checked by V8. Browser QA, 320/390 screenshots, full-app artifacts and Cloudflare preview NOT VERIFIED. Not released.


### 2026-10-25 — Root disclosure and Insight cleanup
- 2026-10-25 unmerged design PR #123 commits 77a86a43, e2245f91, 74409b57, 353b2a31: remove legacy double-chevron generator, reconcile nested insights CSS, update current-source invariant, neutralize speculative phase descriptions. Changes affect Today display and QA only; no changes to stored records, dosing engine or inventory. JavaScript parse PASS for changed module; full browser regression pending; DEMO/LIVE artifacts INCOMPLETE; Cloudflare preview and production deployment not verified/authorized.


### 2026-10-25 — Root cause of persistent duplicate chevron / insight borders
- 2026-10-25 draft PR #123 corrections d4174ac0 (source of duplicate generated-chevron in nexus-disclosures.css), b6222ea9 (remove unnecessary outer Insights border and per-entry dividers), f65255af (CI guard checks). No application storage, history or dose math changes. Browser visual pass and physical iPhone NOT VERIFIED. LIVE ZIP and full isolated DEMO artifacts INCOMPLETE. No release.


### 2026-10-25 — Compact Today divider correction
- 2026-10-25 PR #123 unmerged preview correction: 73ec2a05 targeted compact-card divider CSS; 4208fe9b source regression assertion. No storage, dose, or inventory logic changes. Browser rendered QA NOT TESTED at this commit. DEMO HTML/LIVE ZIP INCOMPLETE; no production release.


### 2026-10-25 — Unreleased candidate: Today 2.0 (DRAFT, NOT A RELEASE)
- PR #123 design/design-system-2-preview-20261025, ongoing implementation based on user-approved interactive Today design.
- Source commits include Protocol regression test replacement `0ea163c`, saved tracking + activity sections `8e14733`, handlers `73dc37b`, styling `b0dcf5f`, upcoming `3c8e952`.
- Changes to Today and test suite; optional non-destructive settings preference addition, no dose/inventory/storage migration.
- Status: coded; not verified as fully passing, not merged, not deployed, physical iPhone not tested. Release artifacts/manifest and final version-to-commit mapping INCOMPLETE until passing CI and authorized release.


### 2026-10-25 — PR #123 continued; unreleased hybrid Today candidate
- Additional candidate commits: `ebfd769` weekly reporting consolidated under Your Activity, `07c3d42` period persistence on rerender, `e11a69f` reschedule/canonical week collection and adhoc exclusion, `9f9aafc` Protocol History tab test parity, `29d81b1` Stash selector QA parity. No version bump or live release authorized.
- Release/artifact state INCOMPLETE pending exact-head green full-app tests and independent package review. CI pass on individual suites does not supersede failed full workflow. Cloudflare not deployed by these commits; real iPhone untested.


### 2026-10-26 — PR #123 Today pre-release QA candidate (NOT DEPLOYED)
- QA/code corrections: 3f128dc (relocated weekly disclosure test), ef600d1 (restore exact CSS path), 640d594 (default-dark computed-gradient and 320/390 bounds assertions).
- Full GitHub Actions build & parity run 40267178763 PASS; mobile form regression run 40267178912 PASS. Downloaded artifact 12627006318 independently inspected for LIVE ZIP complete 21 files and standalone full-app DEMO inline CSS/JS. Local Chromium screenshots for Today 320/390 both themes verified gradient and tap/action behavior, not physical iPhone.
- Version metadata unchanged v0.9.20-beta (unverified publication). Draft PR #123 remains open, no merge, no Cloudflare production deploy. No production storage/data migration. Final release commit, version bump, deployment verification and real-device acceptance remain INCOMPLETE.


### 2026-10-26 — Calendar 2.0 initial implementation, UNRELEASED
- Draft PR #123: `ef93fc2` Calendar Week/Month activity overview, `060c583` categorized selected-day source-backed records, `5480de2` Calendar hub CSS, `9ed4c89` eight-case browser QA assertions. Affected Calendar screen, zero destructive migrations, Today weekly pulse unchanged.
- Candidate NOT a release: tests, final packages, iPhone, merge and deployment still incomplete.


### 2026-10-26 — Calendar 2.0 candidate validated, NOT RELEASED
- Source commits: `ef93fc2` activity hub, `060c583` categorized day records, `5480de2` visual styles, `9ed4c89` browser tests, `ce2b54e` cross-month week integrity. Test updates `4f63119`, `137adc0`, `ed0fc8c` align protected Today controls with approved compact weekly pulse.
- 320/390 dark/light LIVE/DEMO full QA run `40273196256` PASS, mobile run `40273196254` PASS; download artifact #12629580963 inspected (full 21-file LIVE package + standalone isolated full DEMO). No production migrations. Version metadata remains v0.9.20-beta; no new release label authorized.
- Draft PR #123 open/unmerged, Cloudflare preview/production parity and physical iPhone remain NOT VERIFIED. Calendar analytics trending/filtering/history edit UX remains subsequent implementation before sign-off.


### 2026-10-26 — Calendar Logs Day/All candidate, UNRELEASED
- PR #123 draft: `e465049` source-backed Day/All log journal with outline icons, `044f9c7` handlers, `6d921a0` Calendar selected-date handoff, `5c7e241` responsive styles, `aa84611` browser QA extension. No historical data rewrite or schema migration, existing editing handlers preserved. Full QA and LIVE/DEMO package acceptance pending; no merge or production deployment.


### 2026-10-26 — Logs Day View navigation candidate (unreleased)
- Commits `25b5124` date controls, `bcb8cd7` handler, `8d2c616` styling, `5167a87` browser tests; builds on existing Day/All journal. No saved data migration; candidate on draft PR #123. Latest full build/isolated DEMO artifacts and preview deployment not yet verified; no merge/release.


### 2026-10-26 — Logs candidate QA verified, NOT DEPLOYED
- Candidate at `5167a87`: complete QA workflow `40275552699` and mobile `40275552720` PASS. Artifact #12630341125 inspected: complete root LIVE ZIP, standalone isolated full app DEMO. No storage migration. PR #123 remains draft, no production deployment/Cloudflare parity confirmation. Final version remains v0.9.20-beta pending approved release.


### 2026-10-26 — Logs current candidate QA evidence, still UNRELEASED
- Latest tested PR head `3eb6bf4`, full pipeline `40276022471` PASS, mobile forms `40276022466` PASS, exact-source artifact #12630810614 inspected: 21-file LIVE ZIP, self-contained isolated DEMO, 16 log screenshots across viewports/themes and LIVE/DEMO. Existing version metadata v0.9.20-beta; no schema changes or saved-data migration. Draft PR #123 unmerged; Cloudflare deployment and physical iPhone not verified.


### 2026-10-26 — PR #123 Calendar Logs validation checkpoint (DRAFT, NOT RELEASED)
- PR #123 head `d6e3dfc4bf60592c7eb7296aa3038785d40fbef7`; source main base `c1c95e1da2749c3aa8c4459b81a04fc51d9b7f7e` at observation. User-approved Calendar Logs Day View + All Logs coded on design branch; not merged or deployed.
- Mobile forms workflow 40334643562 PASS; full release workflow 40334643538 exact-source build/required files steps PASS, browser matrix still in progress and downloadable artifacts unavailable at observation. Physical iPhone NOT TESTED. No production data touched; migration effect requires final source review. This entry records QA progress only, not a new release.


### 2026-10-26 — PR #123 optical patch (CODED; NOT RELEASED)
- Scoped Add Log plus-only, tile centering/wrapping, and Today This week label gap to hybrid CSS. New automated mobile matrix assertions added. Branch commits `799f254` CSS and `bf5a4b1` test. No saved-data migration or business logic changes. New CI, artifacts, physical iPhone approval and deployment **PENDING**. Draft PR #123 remains unmerged.


### 2026-10-26 — Sprint 01 physical iPhone acceptance (CONDITIONAL, NOT RELEASED)
- User reported PASS WITH MINOR VISUAL ISSUES and requested Calendar Month icon modifications. Exact correction pending clarification and implementation. Full browser/build workflow 40339121469 PASS, mobile workflow 40339121261 PASS at pre-doc head 375b8879. No Sprint 01 final acceptance or production release claim. No app code or data migration in this docs-only checkpoint; PR #123 stays draft/unmerged.


### 2026-10-26 — Sprint 02 Stash card visual patch (DRAFT; UNRELEASED)
- Commit `76f232d` adds long-kit-name wrapping, 44px Manage action, focus outlines and narrower-tab labeling in hybrid CSS. Affected: Stash kit cards only. Data impact: none (CSS only). **New-head QA and physical iPhone checks pending;** no LIVE/DEMO artifact claim for this commit, no merge/deployment.


### 2026-10-26 — Sprint 02A Protocol visual refinement (DRAFT; NOT RELEASED)
- Prior head `137306ab`: workflows mobile 40341448639 PASS, browser/build 40341448649 PASS, validating prior Stash patch.
- Protocol CSS commit `6479eea`: improved card spacing and long-name wrapping, minimum 44px controls, keyboard-visible focus and compact viewport styling. Affected: Protocol cards and existing disclosure/actions; no JS, business logic, storage or migration changes. Latest-head QA, complete LIVE/DEMO artifacts, physical iPhone and deployment **pending**. Draft PR #123 not merged.


### 2026-10-26 — Sprint 02 vial form layout (CODED, UNRELEASED)
- Commits `d21f2cf` (shared form grid class) and `e6eacc6` (responsive field layout and visible confirm/focus). Affected: Stash Open New Vial sheet for blends and singles. No data migration or business-logic change. Fresh-head CI/browser and physical iPhone tests **NOT YET VERIFIED**. Draft PR #123; no deployment.


### 2026-10-26 — Sprint 02A Protocol + Plans actual implementation (DRAFT, NOT RELEASED)
- `3d318602` actual Protocol card markup current phase/schedule and collapsed goal details; Goals/Research styling hooks. `0f1fd7eb` hybrid responsive Protocol/Plans CSS. `3063af12` Manage sheet header structure for Protocol and Plans; `666e2483` shared accessible action sheet styling. Affected: Protocol cards/details/action sheets and Plans Goals/Research cards/action sheets. Existing navigation and handlers retained. No data migration. QA and same-source release artifact verification **PENDING**; production untouched.


### 2026-10-26 — Protocol interior features (DRAFT, NOT RELEASED)
- Verified current draft source includes `protocolCountdownSummary`, `protocolCompletionCelebration`, and compound `phaseRoadmapModal`, with existing phase alert configuration. `177e25fa` corrects paused roadmap marker day. Data impact: none from marker correction. Latest-head tests, full-app packages and physical iPhone QA incomplete; no deployment.


### 2026-10-26 — Protocol interior enhancement candidate (DRAFT / UNRELEASED)
- Commits `de2ee577`, `6cdd1174`, `7b0c2b9`, `94b66f88`: per-protocol countdown from existing phase data, in-card per-compound roadmap shortcuts and current phase interior, post-confirmation completion celebration (reduced-motion support), existing in-app phase reminder ID collision fix. Screens: Protocol cards, phase roadmap modal, completion modal, in-app notifications. No storage migration or inventory/dose math modifications. QA, FULL DEMO HTML/LIVE ZIP and physical iPhone tests PENDING. Draft PR #123 unmerged, no deployment.


## 2026-10-26 — Approved vertical phase timeline
DRAFT UNRELEASED: `e87e984b` vertical compound roadmap HTML and `8ecc6caf` responsive CSS. Visual-only; no data migrations. QA/latest-head DEMO/LIVE artifacts pending; no deployment.


### 2026-10-26 — Expanded Protocol detail refinement (DRAFT, UNRELEASED)
- `fd6fda06`: remove duplicated mini Gantt/route pill/dose-status cluster and show current compound phase progress rows; `23f3d666`: mobile responsive CSS; `da015ec0`: Plans Research ellipsis contrast adjustment after browser QA 40351719788 failed assertion at validate-plans-hierarchy.mjs:180. Affected: Protocol expanded card and Plans Research ellipsis styling. Data impact: none expected (markup/CSS only). Latest-head browser/mobile QA and exact-source full-app artifacts pending, physical iPhone untested, PR #123 unmerged/deployment unchanged.


### 2026-10-26 — Protocol dedicated overview (DRAFT, NOT RELEASED)
- `89f33fbe`: actual Overview/Compound/Completion detail surface and phase-aware progress ring; `be3fa15f`: list card View protocol overview action; `3c10f974`: action binding; `c8353f0e`: responsive CSS. Preview concept source is user-approved, implementation and exact-source parity NOT TESTED. No data schema or dose migration. Latest-head CI/real iPhone/full-app standalone DEMO/LIVE ZIP incomplete; PR #123 unmerged.


### 2026-10-26 — Protocol detail status semantics (DRAFT)
- `5764db48`: fix detail Overview active status `In progress` and paused status precedence over elapsed schedule. Presentation only, no user data migration. Latest-head QA, full-app DEMO/LIVE ZIP, physical iPhone validation incomplete; PR #123 draft and production unchanged.


### 2026-10-26 — Protocol list/Overview IA cleanup (DRAFT, NOT RELEASED)
- `ed6b984a` removes duplicated Compound/Completion tabs and list-card expanded details, preserves Overview with compound roadmap and Manage action. `48784383` computes list progress using pause-aware scheduled phase dates; `0d3a3d33` compact card CSS. Affected: Protocol list and dedicated detail navigation. No schema or recorded dose/history changes. QA, user iPhone acceptance, standalone full DEMO/LIVE ZIP, merge/deployment incomplete.


### 2026-10-26 — Navigation QA corrective commits (DRAFT, UNRELEASED)
- `49484971`: replace obsolete Protocol chevron regression assertion with approved end-to-end navigation journey in 8 LIVE/DEMO × 320/390 × light/dark contexts. `80289b93`: Plans Research management control background selector specificity fix. No schema/data changes. New CI and full-app artifacts pending at documentation time; no merge/deployment.


### 2026-10-26 — Sprint 2A QA candidate verified (DRAFT, NOT RELEASED)
- Verified PR head `17112406`, merge SHA `c6885efd`: mobile run 40359787123 SUCCESS, build/parity run 40359787121 SUCCESS. GitHub artifact 12667882258 contains 2.49 MB standalone FULL DEMO HTML, 0.88 MB offline DEMO ZIP, 1.79 MB 21-file LIVE ZIP and QA evidence; manifest reports ephemeral demo storage and no sync, physical iPhone untested. Browser matrix 8 cases and amended chevron navigation 8/8 PASS; Plans Research contrast 8/8 PASS. Cloudflare mismatch expected because draft not deployed. Commit `b155134c` adds screenshot capture; latest-head screenshot run pending. No data migration, merge, deployment, or published version bump.


### 2026-10-26 — Screenshot visual QA refinement (DRAFT)
- Successful merge-ref test `2adf5eea` completed mobile and full-browser suites, produced full DEMO HTML, 21-file LIVE ZIP, offline demo ZIP and 16 Protocol screen captures. Inspecting captures revealed opening-frame fade/blur, so `2d67b356` adds 450ms settling and bounds checks to visual QA; latest-head visual validation pending. Application data/code unchanged by test correction. PR draft, no release.


### 2026-10-26 — Sprint 02A validated DEMO candidate (DRAFT / NOT DEPLOYED)
- Test merge source `08bd02b7`, PR branch head `ae49c851`: GitHub browser/build 40361824665 SUCCESS; GitHub artifact 12668996607 contains COMPLETE isolated standalone FULL DEMO HTML, offline full-app DEMO ZIP, 21-file LIVE ZIP, QA reports, and 16 320/390 light/dark LIVE/DEMO Protocol screenshots. Downloaded and verified archive integrity. Screenshot settle test `2d67b356` validated final state. No code/schema/data migration; stored production history untouched. Physical iPhone review, VoiceOver, and Cloudflare/GitHub Pages deployment NOT performed. Version manifest still `v0.9.20-beta` as draft baseline; not a new published release.


### 2026-10-26 — Plans/Protocol contextual navigation (DRAFT)
- `3b692b1e`: Goals Connections linked protocol action opens Protocol Overview; singular compound count fixed. Existing Protocol Overview linked-goal path retained. No schema/data changes. Latest-head QA/artifacts pending; no merge/deploy.

### 2026-10-26 — Goals-first Plans UI (DRAFT / UNRELEASED)
- PR #123; commits `8393d955` and `1ead81b6`. Affected Plans → Goals list: title/status/date hierarchy, honest measurement summary and progress track, connected-protocol count, unified details target, 320px adaptation.
- Progress is read-only from existing `progressModel` and comparable recorded weight logs; no saved state/schema/measurement/dose migration. Original goal detail navigation and management remain.
- QA for new head, complete full-app DEMO/LIVE packages, iPhone and VoiceOver all **NOT VERIFIED**. Draft/unmerged; Cloudflare remains unchanged.

### 2026-10-26 — Goals visual density correction (DRAFT)
- `457652a8`, `f5be4806`: remove duplicate Plans counts, shorten repeat progress copy and tighten Goal cards while retaining detail/management handlers. No data schema change; newest-head QA/artifacts and iPhone acceptance pending. Not deployed.


### 2026-10-26 Approved Goals preview restored (DRAFT)
- Commits d98d7b78 and 7727191f restore originally accepted spacious Goals card in place of compact experiment. No migration. New-head QA pending; not deployed.

### 2026-10-26 — Goal Add/Edit four-stage wizard (DRAFT / UNRELEASED)
- PR #123: `23aa6e04` wizard markup reusing existing controls; `d7a8026c` hybrid theme/step styling; `a44cdcb8` preserve unsaved progress method choices. No intended schema or localStorage migration. Existing save handler still writes only on final Save. Latest-head QA/source-parity artifacts and physical acceptance incomplete. Log Dose unchanged; not deployed.

### 2026-10-26 — Goal wizard QA harness correction, DRAFT
- Commit `c9b6782c` changes Plans browser test to navigate wizard steps before field selection and saving. Pre-patch build/parity workflow 40386863855 FAILED (hidden Connections input). Other suites passed, but full release QA not passed. No production merge/deployment, new-head retest pending.

### 2026-10-26 — Goal wizard automated acceptance candidate (DRAFT, NOT DEPLOYED)
- Tested PR #123 head `701c6c7e`, workflows 40389965572 full build/Plans/browser SUCCESS, 40389965592 mobile SUCCESS, 40389962603 hybrid SUCCESS. Artifact 12684590713 contains builder-produced full-app LIVE/standalone fictional DEMO/offline demo packages; internal build assertions PASS, independent extraction pending. Data schema migration none intended. Physical iPhone/VoiceOver and contrast-wide acceptance pending; PR draft/unmerged and production unchanged.

### 2026-10-26 — Quick/Guided Log Dose UI (DRAFT / UNRELEASED)
- `56d0b7ef` existing dose form step-navigation and `69dace51` styling. No intended dose schema or storage changes, existing `#save` remains authoritative. Full separate Quick review and source allocation evidence in Guided review require further implementation. New-head CI, packages, Safari/VoiceOver incomplete. No merge/deploy.

### 2026-10-26 — Log Dose Review gate + validation (DRAFT)
- `2649a11a` implements separate Quick final Review and Guided final Review, positive amount/date Continue validation and original Save visibility gate; `c0b882d0` styles sticky step controls and errors. No migration or intended dose math change; automated/physical verification pending, no merge/deploy.

### 2026-10-26 — Draft Log Dose source-review iteration (UNRELEASED)
- `3fe3f1a9` structured allocation review, `631c36a8` browser regression helper follows final Review, `14981bf6` visual refinement. No storage change. New-head full QA, exact-source artifacts, manual mobile testing pending. No merge/deploy.

### 2026-10-26 — DRAFT source identity review (NOT RELEASED)
- `8abba0bb` source ID/selected vial/prepared batch readout; `fb8a7c40` browser assertions. No storage migration, no production release; latest-head QA and source-matched artifacts pending.

### 2026-10-26 — Goals Add Goal top placement (DRAFT / UNRELEASED)
- `efbbd544`: moves existing Add Goal action to top of Goals section and removes bottom duplicate; `7706e8f7`: responsive 46px header styling. No schema or persistent data changes. New-head automated/mobile/physical QA pending; no merge/deploy. Next: Research and Shopping design audit.

### 2026-10-26 — Research card density and Shopping action placement (DRAFT / UNRELEASED)
- `5a060265` Research header/card semantic structure and single Intel chevron, `dd654713` chevron-free Show/Hide notes disclosure, `fca17f95` Shopping top Add Item, `cbd286c4` hybrid spacing/focus CSS, `477e6e59` and `d860c2d9` research browser assertions. No persistent schema modification and existing Add/Edit/Intel/inventory actions retained. Latest-head CI, full-app DEMO, LIVE ZIP and physical iPhone signoff INCOMPLETE. PR #123 draft/unmerged.

### 2026-10-26 — Plans Goals-default and single Research separator (DRAFT)
- `d794a215` More→Plans defaults Goals; `daf9acdb` generic quick Plans same; `af4cd980` single Intel divider; `d4a5b488` regression assertions. Existing source data, add/edit forms and workflows untouched; no storage migration. Prior head `1d0815d4` full/mobile/hybrid success, new-head QA and exact-source packages pending. No merge/deployment.

### 2026-10-26 — Research/Shopping Add/Edit visual parity (DRAFT, UNRELEASED)
- `d4a55d5e` shared labelled modal markup; `23064980` spacing, 46px form fields, 48px sticky save, theme colors, focus and reduced motion; `9ddfac17` regression assertions. Saved field definitions and original save code retained, no schema change. Prior `c7ffe1bb` all three QA workflows SUCCESS, latest commit QA and artifacts not verified. No merge or production deployment.

### 2026-10-26 — Stash kit editor parity polish (DRAFT / UNRELEASED)
- `9cfb316e`, `8a223e78`, `bdd7532c`, `9b03db6c` add form styling hooks, SVG navigation, light border polish and validation assertions without changing inventory handler math or data schema. New-head QA, complete artifacts, and physical iPhone NOT VERIFIED. PR #123 remains draft/unmerged; no production deploy.

### 2026-10-26 — Proposed guided Add/Edit Kit and Prepared screens redesign (DESIGN ONLY)
- User-requested design study and Stash secondary-screen audit; no new kit/prepared workflow implementation, schema migration, merge, or deployment. Retain same original inventory/save calculations. Draft PR #123 remains unmerged.

### 2026-10-26 — Stash guided wizard source reconciliation (DRAFT / NOT RELEASED)
- PR #123 branch head `5a9d6c7a` already contains three-step ordinary Kit wizard and searchable compound picker in `assets/js/07-nexus.js`; previously documented as merely proposed. Found during code review; no new app code, storage migration, merge or deployment in this documentation update.
- Current-head PR workflows 40417820123 mobile and 40417820282 build/parity SUCCESS. Artifact 12696280782 exists but extraction and source integrity unverified; real-device/VoiceOver and blend parity NOT TESTED. Separate authoritative inventory handler remains. Proposed design not accepted as finished.

### 2026-10-26 — Guided Blend Kit and browse selector (CODED DRAFT / NOT RELEASED)
- PR #123 `design/design-system-2-preview-20261025`: commits `8f47c431`, `c28302e9`, `0af72826` add 3-stage blend editor layout and screenshot-inspired compound browse/search picker with responsive CSS. Reuses `#bk-save` inventory pathway and in-memory composition input values; intended no data schema or storage migration. Existing opened vial and recorded dose accounting must be verified, not assumed.
- Current-head CI, exact full-app DEMO/LIVE ZIP, physical iPhone and a11y tests PENDING. PR stays DRAFT/UNMERGED/UNDEPLOYED; no Cloudflare production change authorized.

## 2026-10-26 — Guided blend workflow acceptance follow-up
- User approved the three-step guided Blend Kit workflow and the screenshot-style dropdown with embedded search. Current source `assets/js/03-nexus.js` already includes a three-step blend wizard and component dropdown search, preserving original `#bk-save` handler. Review uncovered two BAC inputs on new blends (`#bk-bac` and `#bk-bac-edit`) with potentially divergent displayed review/save semantics. Existing edit must preserve opened-vial ratios and historical allocations. Do not merge/deploy until targeted validation, UI acceptance, and full-app artifact inspection. Next action: reconcile BAC UI and test blend save and history at 320/390 light/dark.

### 2026-10-26 — Guided Blend BAC single-source fix (CODED DRAFT; NOT RELEASED)
- PR #123 commits d87600cb, b1586e20 and 6407d532. Remove duplicated creation BAC field and reconcile `#bk-bac-edit` between Review and authoritative `#bk-save`; add cost/notes Review, and test create/review/save with fictional 10 mg + 5 mg blend. No intended schema migration, production writes, per-component accounting or history edits. Latest-head CI and independent DEMO/LIVE artifact validation pending; no merge/deploy or real iPhone acceptance.

### 2026-10-26 — Guided Stash iPhone rejection corrective branch changes (CODED DRAFT; NOT RELEASED)
- Physical iPhone screenshots show substantial UI failures in Add Kit and Blend: duplicated select, broken step count/action hierarchy, premature Save and default opened blend vial. User rejected the design. Targeted fixes on draft PR #123 regular Kit staged save/combobox, Blend editable combo + sealed default, consistent CSS, progress count removal and browser regression assertions. No planned data migration, authoritative inventory handler/maths unchanged. Newest-head QA and exact-source full-app DEMO/LIVE artifacts NOT VERIFIED; no merge or deployment.

### 2026-10-26 — Guided Kit corrective QA fails (DRAFT, NOT RELEASED)
- Source UI fixes at `b8f8f2db` mobile run `40421697072` PASS, full build/parity `40421697164` FAIL at browser QA step. Exact error not retrieved; release artifacts not verified, physical iPhone acceptance outstanding, no merge/deployment. Draft PR #123 remains open.

### 2026-10-26 — Stash test harness correction (DRAFT, unreleased)
- `6d209ed5` updates outdated card QA for guided Kit staged Save: hidden before Review, visible and >=44px on Review. Triggered after full build `40421697164` failed on hidden-button sizing; preceding Stash Actions, Combo, Log Dose, vial-source checks passed in that run. New-head CI and artifacts pending; production unchanged.

### 2026-10-26 — Guided Stash correction automated candidate (DRAFT / NOT RELEASED)
- At `6d209ed5`, GitHub mobile workflow 40422263763 SUCCESS and browser build 40422263758 SUCCESS after test updated to navigate to Kit Review; original authoritative inventory handlers unchanged. New later test-only commits ed77a3e7 and dac2ba4a capture 320/390 × dark/light × LIVE/DEMO real Kit/Blend step screenshots. Their CI and images pending independent inspection. Production unchanged; no iPhone acceptance or merge/deploy.

### 2026-10-26 — Candidate package inspection (NOT RELEASED)
- Successful source build 40422263758 at app/test SHA 6d209ed5 produced artifact 12698436592. Downloaded and verified 21-file ZIP, root index, standalone full-app DEMO, manifest source merge ref 7203418d, and Stash Actions/Cards QA reports 8/8 each. Physical iPhone acceptance not achieved; new screenshot-run CI pending; no merge/deployment.

### 2026-10-26 — Guided Stash visual rejection follow-up (DRAFT, NOT RELEASED)
- Inspected actual browser captures from preceding Actions artifact 12698781391 and discovered poor button hierarchy, unstyled ordinary review rows and wasted Blend preparation space despite passing automation. Targeted draft CSS/markup changes 83d374c3, be382d87, 4d34e265; screenshot settling and CSS regression 7eb10d09, e29d2443, 5129b2d3, 5f210026. No intended schema, stored record or inventory math changes. Full build/visual tests on latest app source and independent full-app LIVE/DEMO checks pending; PR #123 unmerged and production unchanged.

## 2026-10-26 — Guided Stash screenshot-led polish (DRAFT)
- Inspected actual source-generated 390px dark Kit/Blend screenshots from artifact `12698781391` (run `40422827201`, SUCCESS): regular Review values collide with labels; Step 2 Continue renders as a text link; Blend footer also has detached Continue styling. New CSS commit `4a1e090b` makes Continue a 48px full-width lavender button, Back a 48px secondary control, Review a two-column wrapped label/value grid, and normalizes Blend sticky footer. No data model or save-handler change.
- This is a corrective UI candidate, NOT approved on physical iPhone. Re-run newest-head CI, inspect 320/390 both themes and actual step screenshots. No merge/deploy without user approval.
- **ONE NEXT ACTION:** Inspect newest-head browser screenshot artifact for action visibility, scroll, keyboard and review readability; confirm iPhone user acceptance before merge.

### 2026-10-26/27 — Guided Kit/Blend screenshot-led corrective candidate (DRAFT, NOT RELEASED)
- PR #123 at head `455404bb`, baseline main `c1c95e1`; tested PR merge ref `d4e0ff1d`. Changes: unify stage progress and sticky 48px CTA; conceal native backing compound selects, expose one editable browse/search field; sealed blend default; consistent persistent Blend header; separate legible Kit Review rows, full-width Blend compound search fields and concise instructions. Existing authoritative `#ssave` and `#bk-save`, inventory ID/schema/history and component allocations untouched; no migration intended.
- Tested: mobile Actions `40424506766` SUCCESS, full build and eight-configuration browser parity `40424506746` SUCCESS. Downloaded artifact `12699630393`: version display remains `v0.9.20-beta` draft baseline, 21-file root-index LIVE ZIP 1,807,846 B, isolated standalone complete DEMO 2,564,463 B, 112 screenshots; manifest source `d4e0ff1d` matches PR merge-ref. Independently inspected 390 dark/light regular/blend Step 1/2/Review and 320 dark Blend Step 1. Physical iPhone/VoiceOver and exhaustive blend ledger refund testing NOT VERIFIED. Branch remains draft, unmerged, undeployed; no production data modified.

### 2026-10-26 — Blend component one-row UI (CODED DRAFT / UNRELEASED)
- PR #123 `a9a3643e` stylesheet now places compound search, per-vial mg and remove in one responsive row; `269f468d` adds multi-viewport browser assertion. No data migration/inventory math modification. QA and artifacts pending; production unchanged.

### 2026-10-26/27 — One-row Blend browser-tested candidate, clipped-placeholder correction (DRAFT/UNRELEASED)
- Exact app/test commit `269f468d`: mobile 40426868694 and full-browser 40426868293 SUCCESS; artifact 12700776008 downloaded and checked: complete full-app DEMO, 21-file root-index LIVE ZIP, Stash Actions 8/8; four 320/390 dark/light Blend step-one screenshots independently inspected and same-row layout correct. Review exposed truncated placeholder, so later draft commit `3bab1d9a` uses shorter `Search…`, with latest CI pending (40427570891, 40427570879). Authoritative blend math/storage untouched; PR draft/unmerged/undeployed, no physical iPhone acceptance.

### 2026-10-26/27 — One-row Blend candidate verified in browser (DRAFT/NOT RELEASED)
- Code `a9a3643e`, browser assertion `269f468d`, compact placeholder `3bab1d9a`. Full-browser workflow `40427570891` SUCCESS with 320/390 × dark/light × LIVE/DEMO 8/8 Stash Actions; artifact `12700422861` extracted and independently verified ZIPs/source and four screenshots. Four-way visual shows compound, mg, remove aligned horizontally and `Search…` readable. No schema or authoritative inventory math changes. Mobile current-head `40427570879` awaiting outcome; physical iPhone signoff/VoiceOver outstanding. PR #123 remains DRAFT/UNMERGED/UNDEPLOYED.

### 2026-10-26 — Blend popup and Review UX follow-up (DRAFT; unreleased)
- Draft commits 416e6217, 7720cef8, 0ad6d4c8 and e130934c address an expanding compound list, opaque footer backdrop and flat Blend Review. Floating suggestions show up to five items with no list scrollbar; Review prioritizes blend identity, total mg and individual components. Additional mobile browser checks added. Production inventory handlers and data schema unchanged. Physical iPhone feedback and an app-wide nested-scroll audit remain outstanding. No merge or deployment.

### 2026-10-26 — Blend full-screen mobile editing candidate (DRAFT, not released)
- Commits 6db7acf7, 767c2ae8 and dd26fdc9 add full-viewport Blend editor for narrow phones, fix grouped Review CSS override and assert mobile modal geometry. This builds on floating picker / Review hierarchy revisions without changing blend IDs, storage schema or inventory accounting. Latest source QA and visual screenshots pending; no merge/deployment.

### 2026-10-26 — Full-screen Blend search/review candidate validated (DRAFT, UNRELEASED)
- Exact tested app commit dd26fdc9; merge-ref 723b06cb; GitHub Actions full build 40428711527 SUCCESS, artifact 12701700107 independently inspected. Source updates: floating max-five suggestion list, no row expansion; transparent footer; hierarchical Blend Review; full-viewport mobile editor replacing short nested-scrolling sheet. Complete isolated full-app DEMO 2,572,777 B; 21-file root-index LIVE ZIP 1,809,501 B. Visual screenshots inspected 320/390 dark/light search and Review. No accounting, storage or historical data change; actual iPhone test and other modal audits pending, PR draft/unmerged/undeployed.

### 2026-10-26 — Approved compound browser foundation (DRAFT / NOT RELEASED)
- Commits c7b4784b, 3ecc008d, a2a9d24a, dcc32a6e, ad2b74b3, c7b06b2a: full-library browse-all screen added to single and blend kit compound comboboxes, five-option popup, cross-screen helper and 320/390 LIVE+isolated DEMO browser tests. No live schema, vial math, dose history or inventory handler changes. Mobile QA pass 40430545528; full build, exact-source full-app artifacts and real iPhone acceptance pending. PR remains draft, unmerged, undeployed.

### 2026-10-26 — Full-library browsing QA candidate validated (DRAFT / UNRELEASED)
- Application/test SHA c7b06b2a passed mobile 40430545528 and full browser 40430545381. Artifact 12702105755 exact-source full-app DEMO (2,578,053 B) and root LIVE ZIP (1,810,764 B; 21 valid files, ordered JS) independently downloaded/inspected; merge-source manifest 8069de53 parent is c7b06b2a. Independent Chromium browse-all tests also passed 4/4 at 320/390 dark/light, 45 fictional compounds, filter/choose, backing state unchanged except user selection. No migration, active production storage write, PR merge or deployment; physical iPhone and broader app-wide picker rollout remain pending.

### 2026-10-26 — Compound browser expanded to Protocol and Plans (DRAFT/UNRELEASED)
- Commits 8da177d2, 472c211b, 642b74d2, fd266141, cb1144af and 471fdeed implement reusable five-result and Browse All compound selector across Protocol Stack and Plans/Research multi-select, preserving original state and save paths; add browser regression tests and remove nested quick-list scroll. CI latest head pending, no source-matched artifacts inspected yet, no production data impact/migration/merge/deployment.

### 2026-10-26 — Protocol/Plans compound picker cross-screen QA verified (DRAFT, NOT RELEASED)
- Tested application source 471fdeed; GitHub Actions mobile 40432425967 and browser 40432426016 SUCCESS. Artifact 12703425376 manifest merge 15acd041 (parents main c1c95e1d and tested source 471fdeed), independent ZIP integrity PASS and extracted standalone full-app DEMO and 21-file LIVE ZIP. Independent Chromium 320/390 dark/light Protocol library browse/filter/selection passed 4/4. Production main unmodified; PR #123 draft/unmerged. No code fixes necessary for CI; physical iPhone keyboard acceptance, VoiceOver and global modal audit still incomplete.


### 2026-10-26 — Kit creation currency and footer parity (DRAFT / UNRELEASED)
- User screenshot feedback prompted unified Standard/Blend footer insets and expanded cost-currency selector for both kit workflows. Standard previously supported CAD/USD/GBP/EUR/AUD while Blend hardcoded CAD and lacked a selector.
- Draft branch code commits aaea7807 (blend input), 27675f3 (standard currency list), 7d1fad2 (footer inset), 4e7c685 (CAD display preservation). Validation updated in 7d19ea0 and 8307987 to cover non-CAD Blend save and selector choices. User requested a separate future mandatory-fields audit; no required-field migrations or new constraints implemented.
- Last previously completed full browser workflow 40441021070 SUCCESS and mobile 40441021069 SUCCESS **predate** these edits; latest workflow 40441896108 and mobile 40441896055 require status verification. Source-matched updated LIVE ZIP/isolated DEMO, native iPhone keyboard and visual reacceptance not yet confirmed. PR #123 stays draft, no merge or deployment. No existing data migration, kit math change or production write.


### 2026-10-27 — Standard/Blend Kit Step 2 parity (DRAFT / UNRELEASED)
- Draft PR #123 adds unified Cost/Currency paired layout, BAC water/Expiry pairing and common ordering, multiline Notes, matched optional labels, open-vial toggle treatment and 320px equal-width label alignment. Recent code includes `02e0ce9`, `f0bca60`, `551c13b`, and `9d3e54f`; tests `7dba19a` and `c131144`.
- Source-matched full-browser 40448545857 **SUCCESS** and mobile 40448545887 **SUCCESS**; artifact 12708814792 manifest source `fb6d089edf98b48d8e4b1ad2afc2be3357d9c9cf` with validated 21-file LIVE ZIP and standalone/offline full-app DEMO parity. No migration, production storage writes, merge or deployment. Blend Test Results initially partially behind sticky footer despite scroll-to-clear passing; real iPhone keyboard/safe-area approval outstanding. Mandatory fields/global nested scroll audits separately unfinished.


### 2026-10-27 — Supplies empty state + form/card hierarchy (DRAFT, NOT RELEASED)
- Draft PR #123 implemented user-approved compact empty Supplies state (5d85c6e, eaa92a3) and continuation into Add/Edit Supply form/populated-card styling (cb49d73, 5a8f1b6), tests (c6f1085, 49e2298, 327141d). Prior empty-state full CI failed due welcome overlay intercepting test click; corrected fixture on draft. No storage schema changes, changes to unit history, consumption, restock, forecaster or save actions. Latest head CI and artifacts unverified as of this documentation, no deployment or merge.


### 2026-10-27 — Supplies screenshot QA fixes (DRAFT / UNRELEASED)
- Full-browser runs 40451096484 and 40451199358, mobile 40451199390 PASSED for preceding source; artifact 12710184475 manifest 506244fe, integrity verified. Screenshot review uncovered onboarding-overlay capture (test fixture) and narrow 320px initial-status chip clipping (UI issue). Scoped test and CSS corrections at commits 248e1c2 and ef9f6fe, now awaiting complete latest-head CI/artifact acceptance. No changes to supply data shape, quantities or history; no merge, deployment or production writes. Native iPhone acceptance remains not tested.


### 2026-10-27 — Supplies corrected QA, still DRAFT/UNRELEASED
- Corrected fictional onboarding-overlay screenshot issue and 320px Initial Status button clipping (commits 248e1c2, ef9f6fe). Automated full-browser `40452358905` and mobile `40452358894` SUCCESS. Artifact `12711520065` source manifest `727686bae253bb5ef4f3a1c2cd4c25234dbdf86a`, 21-file LIVE ZIP integrity and 17/17 application blob parity confirmed, full isolated DEMO equals offline ZIP index, screenshots reviewed at 320/390 dark/light. No schema or inventory math modification, no merge/deploy or production writes. Native iPhone keyboard/VoiceOver and complete stateful Supply save/use/restock acceptance remain unverified; PR #123 retained draft.


### 2026-10-27 — First-dose Today and wizard polish (DRAFT / UNRELEASED)
- Draft PR #123 commits `b538f0f` (Today first-dose inclusion), `b1302de` (Back/Continue, start/target date labels), `20df1d9` and `1d2d412` (Protocol schedule groups/touch styling), `06c0617` and `9924be2` (Goal Check-In connection empty state). Preserves existing storage/schema, protocol sync, dose history and inventory handlers; no migration or production data mutation.
- Affected: Today hero summary, New Protocol Schedule/navigation, Add/Edit Goal wizard. At documentation time current-head browser/mobile CI, standalone full-app DEMO/LIVE ZIP and real-device acceptance are **INCOMPLETE**; do not inherit passes from older releases. PR unmerged, undeployed; production unchanged.


### 2026-10-27 — First-dose scheduling/wizard preview QA verified (DRAFT / NOT DEPLOYED)
- Browser/build run `40529783789` **SUCCESS**, mobile form run `40529783780` **SUCCESS** for test head `370a826e`; exact-source CI artifact `12746621222` (21-file LIVE ZIP, full standalone/offline DEMO equality, 320/390 dark/light Protocol browser suite 8/8). First-dose regression fixture verified Today `0 of 1` when eligible, absent when paused/future/other weekday. An earlier test-escape FAIL `40529630932` was corrected, not erased.
- Affected screens: Today hero, Protocol Schedule/Back-Continue, Add/Edit Goal/optional Check-In connection. Data impact: no migration or production write; canonical dose history and inventory code unchanged. Remaining limitations: physical Safari, keyboard, VoiceOver, full Goal wizard visual acceptance, more advanced multi-protocol scenarios. PR #123 draft/unmerged, no Cloudflare production deployment or user release signoff.


### 2026-10-27 — Expanded first-dose/wizard regression, code unchanged (DRAFT / UNRELEASED)
- Test-only commits `d48a0003` and `8771ce94` extend Protocol browser suite for distinct concurrent active protocols, two same-day occurrences for one compound, rest phase and read-only summary; plus Protocol/Goal wizard tap geometry and navigation checks. No new app logic, schema or UI changes, no production data effect. CI pending at documentation write; real iPhone Safari/keyboard/VoiceOver not tested. PR #123 draft/unmerged, no production deployment.


### 2026-10-27 — Preview discrepancy follow-up (DRAFT / NOT RELEASED)
- User reports that preview does not reflect Today first-dose fix. Previously asserted passing CI did not establish deployed preview SHA or user real-case scheduling behaviour. Draft changes `aa8472b` extend zero-dose Today first-dose eligibility to linked active/in_progress protocols and `ef7eb116` adds test through Protocol sync. No dose/inventory writes or schema changes. Latest source QA/artifacts and Cloudflare branch preview deployment pending; PR #123 draft/unmerged, production untouched.


### 2026-10-27 — Goal quick-status action sheet (DRAFT / NOT RELEASED)
- Draft PR #123 commits `e7f3df6` (status options and save), `9e055e1` (light/dark action sheet styling) and `4c32d42` (browser regression). Affects Plans > Goals ellipsis only. Existing saved goal schema/status values retained, no data migration, linked protocols/check-ins/history/inventory untouched by code; current-head CI and iPhone acceptance pending, no preview deployment verified. PR unmerged and production unchanged.

- Additional draft styling (2026-10-27): `acda2604`/`1c636bca` remove neon green from Protocol first-log status and align CTA to DS2 lavender, source check `172c1f07`. No data or handler changes; QA pending, not released.


### 2026-10-27 — Today header action alignment (DRAFT / NOT RELEASED)
- Draft PR #123 Today home view now composes bell, Profile and theme as one header action group, reused IDs/handlers; Goal quick status and Protocol first-log updates carried forward. CSS light/dark + 320/390 touch alignment, browser action regression added. No schema change, production localStorage or dose history writes. Latest-head CI and isolated artifact verification pending, physical Safari/VoiceOver not tested. PR remains draft/unmerged; no production deployment.

- QA corrective change `6dec6a49`: explicitly sets Goal quick-status touch options to 48px in modal, after failing rendered height assertion in browser run `40536801200`. Current-head outcome pending, production remains unchanged.


### 2026-10-27 — Log Dose review readability (DRAFT / NOT DEPLOYED)
- Draft PR #123 commits `befe2a2` (human-readable Review source and nested IDs disclosure), `b6d901b` (responsive scoped styling) and `988b315` (browser regression). Affects Log Dose Quick/Guided Review, Observations. Data impact: none by design; dose ID/source allocations, history, stock reconciliation and saves not rewritten; no storage/schema migration. Current-head 320/390 light/dark CI, source-matched LIVE ZIP and full DEMO, physical iPhone unverified at writing. PR unmerged, no production deployment.


### 2026-10-27 — Supplements / vial details / Prepare source UI (DRAFT / NOT RELEASED)
- Draft PR #123 commits `a9e54daf` inline daily supplement add, `15038801` Profile supplements cleanup, `86ae622a` retired Notion handler, `d24bbada` lavender inline styling, `647b1368` browser fixture, `84a00064` Stash vial detail hierarchy, `2eb7c11c`/`3da1a412` Prepare source responsive styling. No migration, no intentional changes to dosing, vial calculations, prior supplement histories or protocol source. Current-head CI + complete source-parity artifacts and physical iPhone QA pending. PR remains unmerged; no preview/production deployment confirmed.

- Draft extension: `78bafc1d` adds supplement-creation control in Check-In; `36b81eea` adds no-auto-log browser coverage. Prior records and save validation untouched. CI pending; not deployed.


### 2026-10-27 — Screenshot-driven Supplements and source-identity correction (DRAFT / UNRELEASED)
- PR #123 commits `4b8eaa67` reorder supplement add under search/browse/selected and replace main editable Log Dose Kit ID with readable source label plus optional IDs disclosure; `8df3711a` scoped source layout; `801b62a6` supplement order regression assertion. Screens: Check-In Supplements, standalone Supplements logger, Log Dose source details. Data impact: none by design; internal kit/vial IDs preserved and no migration. CI/full-app packages/device retest pending; PR draft, not merged/deployed.


### 2026-10-27 — DS2 screenshot fixes QA clearance and preview (DRAFT / NOT RELEASED)
- App head `e743c2fd` of draft PR #123 passed browser/package workflow `40549029521` and mobile workflow `40549029721`. Generated full-app LIVE ZIP (21 files) and ephemeral standalone/offline DEMO with application blob parity checks. Cloudflare bot confirms successful **preview** deployment `https://fd8194f6.nexuspeplog.pages.dev` for `e743c2f` (stable branch alias `https://design-design-system-2-previ.nexuspeplog.pages.dev`). No production merge/deployment, no migration and no change to production localStorage. Physical iPhone acceptance remains outstanding; preview files not independently fetched for hash comparison.


### v0.9.20-beta DS2 iPhone corrections — CODED ON DRAFT, NOT RELEASED (2026-10-27)
- Branch `design/design-system-2-preview-20261025`, PR #123 DRAFT and UNMERGED, baseline main `c1c95e1d`.
- Code `f2b31d2e`, style `aaf3998b`, tests `f39458e7`: unified search/Add combobox in Check-In and Supplements logger, standalone Add removed; Source identifiers disclosure full-width beneath source actions; existing separate optional Observations disclosure preserved.
- No planned production data migration, storage-key change, catalogue auto-log, allocation ID remapping, vial maths change or live user writes.
- Actions on `f39458e7`: mobile `40555517593` SUCCESS; full browser `40555517407` FAILURE at obsolete test DOM nesting assumption after disclosure relocation. Test locator fixed `e14d78e3`, current-head rerun PENDING; retain historical failure.
- Cloudflare bot reports immutable preview `https://bbdc78c4.nexuspeplog.pages.dev` for `f39458e7`; independently rendered content parity and physical iPhone acceptance UNVERIFIED. Full-app release artifact available from failed Actions run 40555517407 but NOT release-cleared until green CI and exact-source review. LIVE ZIP / complete isolated DEMO current-head delivery INCOMPLETE. No merge or production deployment.


### DS2 v0.9.20-beta latest-head test milestone — TESTED IN CI, UNMERGED (2026-10-27)
- PR #123 checked branch head `63a6a863`; full build/browser `40557050146` SUCCESS, mobile `40557050089` SUCCESS, hybrid preview `40557040475` SUCCESS. Source test-fix `e14d78e3` now validated.
- Actions artifact `12758495941`: complete source-based LIVE ZIP, standalone full-app fictional DEMO HTML, offline browser-opening DEMO ZIP. CI manifest source commit `bdd95f87753b21585b6bdf5b4821cd13686347f2` (GitHub synthetic merge SHA); branch byte-for-byte equivalence not independently established here.
- Automated matrix checks include 320/390 light/dark LIVE/DEMO; Check-In, Log Dose (40 flows), Protocol, vial source (48), stash/blends, other protected pages, math diagnostic 80/80; clinical safety and WCAG-AA independent acceptance not implied.
- Data impact: no intended schema migration or production writes. PR remains draft/unmerged, Cloudflare exact app asset fetch and physical iPhone validation pending; no production release.


### v0.9.20-beta post-dose reactions — PARTIALLY CODED, QA PENDING (2026-10-27)
- PR #123 draft branch, source commits `126ca799` (isolated reaction form/event on dose), `06177e4b` (scoped accessibility CSS), `24b98949` (end-to-end regression additions).
- Removes visible legacy Observations from new dose form and retains legacy fields on prior saved entries with data; new reaction records `observedAt` and `recordedAt` separately, `intensity`, `notes` on the existing dose ID. Existing inventory/dose math not intentionally changed. No destructive migration.
- Saved-dose Edit provides Record Reaction. Saved-dose action menu and post-save entry not implemented; cannot claim full approved UX complete. Tests/current-head artifacts, Cloudflare served hashes, iPhone and VoiceOver **PENDING/NOT TESTED**. Version candidate unchanged, no merge or production deploy.


### DS2 v0.9.20-beta — direct Record Reaction entry points (DRAFT / NOT RELEASED)
- App head 9d8ad41e adds Record reaction to compound dose-history row, saved-dose retrospective detail and Calendar day detail without opening Edit Dose. Existing standalone reaction form appends distinct events to same dose, preserving vial deductions and dose data. App-head mobile 40569192074 and full 40569192089 SUCCESS.
- Stronger targeted test commit 85afbd03 adds retrospective, three reactions, note-history and zero-deduction assertions; current-head CI PENDING. Cloudflare bot preview for app head https://d8c3286f.nexuspeplog.pages.dev reported successful, but no independent served-asset hash comparison or real iPhone acceptance. Complete FULL DEMO/LIVE artifact availability to verify from current-head CI; no merge, no production deployment, no schema migration.


### v0.9.20-beta — direct Record Reaction test milestone GREEN (DRAFT / NOT RELEASED)
- Source/test head 85afbd03: browser/build run 40569926373 SUCCESS; mobile 40569926374 SUCCESS. Test suite confirms 8 LIVE/DEMO 320/390 light/dark cases and Log Dose 64 flows including Calendar and retrospective direct reaction, 3 reaction history, legacy note preservation, unchanged vial counts and original dose ID. All fictional/isolated data; no production data exercised.
- CI artifact 12765770553 bundles full LIVE ZIP and isolated full-app DEMO. Cloudflare bot reports draft preview deployment https://32aef596.nexuspeplog.pages.dev for docs head a783546; raw served asset hashes and physical iPhone acceptance unverified. PR #123 remains draft/unmerged; no production release or migration.


### DS2 v0.9.20-beta — compound View details render hotfix (DRAFT / NOT RELEASED)
- User-reported draft-only render blocker: undefined fmtT when compound’s latest dose counts as taken today. Fixed at e5bb5d93 in assets/js/07-nexus.js, regression assertion at 7097d07c. No changes to saved data, math or source allocations. Browser/mobile QA, full DEMO/LIVE packages and Cloudflare preview for this head pending; physical iPhone not retested, PR #123 unmerged and production unchanged.


### v0.9.20-beta — Today Record reaction discoverability (DRAFT / NOT RELEASED)
- One-tap button added to completed Today compound cards by 55232dd9, wired to existing saved-dose standalone reaction form in e8d5e762, scoped responsive CSS 2a1038e0, tests 6142ff10 and 305481bc. Optional action remains available after saving in Today; no blocking new post-save dialog. Existing dose math, inventory and storage unchanged. Native timed notification concept separate, NOT CODED.
- CI, complete LIVE ZIP/isolated full-app DEMO artifact, Cloudflare latest-head deploy and physical iPhone acceptance PENDING. PR #123 draft/unmerged, production unchanged.


### v0.9.20-beta — Today navigation filter cleanup (DRAFT / NOT RELEASED)
- Top navigation Upcoming replaced with Completed (bf3ef4db, 61103bf9); Completed shows only compounds completed today using existing status logic with the same compact and expanded cards / Record reaction action. Existing lower Coming up preview and Calendar drill-down kept. Browser regression assertion e8c685fa protects current-day inclusion and historical exclusion.
- Data impact: none intended; no change to production storage, dose records, reaction events or inventory. Full new-head CI, exact-source artifacts, immutable Cloudflare preview and real iPhone acceptance PENDING. PR #123 draft/unmerged, no production deploy.

- 2026-10-27 correction: browser run 40583259646 FAILED new Completed inclusion test, despite other suites passing. Fixed date-of-dose filter code ebd66e42; await replacement CI. No deployment or approval of failed build.


### v0.9.20-beta — Completed/Coming up regression investigation (DRAFT / NOT RELEASED)
- Previous full browser QA 40583699831 failed at Completed test expecting expanded action in collapsed card (test mismatch). Targeted test correction dff7ea52 validates both states, and 79c7bd35 tests Coming up → Calendar and revised nav. Full QA at new head PENDING. No migration, merge or production release.

- 2026-10-27: 40585053600 full browser FAILED newly added Coming up → Calendar click because fixture onboarding modal intercepted; test-only correction at 3d4ae796. No application code or production data changed. Full rerun pending.


### v0.9.20-beta — Today Completed + Coming up automated QA passed (DRAFT / NOT RELEASED)
- App/filter code up to ebd66e42; regression fixture correction 3d4ae796. CI mobile 40585601628 and full/browser 40585602137 both SUCCESS. 8 LIVE/DEMO 320/390 light/dark configurations; Log Dose 96 E2E flows, including Completed filter, saved-dose Record reaction, historical exclusion, Coming up → Calendar. Full LIVE ZIP and fictional isolated complete DEMO artifact 12771971424 generated and uploaded.
- Cloudflare bot reports draft preview https://2d04bd1c.nexuspeplog.pages.dev at source/doc commit f88ec7e. Physical iPhone UX and independent served asset hash comparison not verified; no production deployment, merge, migration or saved data modification.


### v0.9.20-beta Reaction management draft (NOT RELEASED)
- Code e5b9b14f introduces optional post-save invitation and individual reaction edit/delete; responsive CSS 7e1a94f and targeted browser tests 6a34b432. Mobile 40590709765 PASS, full browser run 40590709842 pending. No migration; PR #123 draft and production unchanged.


## 2026-10-27 DS2 v0.9.20-beta draft not released: dfe4df01 on PR #123 extends Trends and Profile/Settings visual styling only. No intended schema, data, clinical calculation or production changes. Current-head QA, source-built LIVE/DEMO packages, iPhone acceptance, Cloudflare parity INCOMPLETE. No merge or deployment authorized.


## 2026-10-27 DS2 Nexus and Settings styling: draft commit bd26e3d6 extends scoped CSS for Nexus navigation, Ask/chat, Learn/Journal/Explore shared surfaces, Profile privacy cards, Settings details and narrow layouts. No JS logic/schema/production writes or calculator change. Prior commit dfe4df01 passed full workflow 40601194237 and mobile 40601194692; new-head QA, artifacts, Cloudflare parity and physical acceptance NOT VERIFIED. Unmerged, not released.


## 2026-10-27 DRAFT ONLY: 9ed589e6 shared DS2 styling of Nexus child surfaces, More panels, Settings child cards. CSS only, no data migration. Current-head QA, physical iPhone, standalone full DEMO and LIVE ZIP not independently verified; PR #123 unmerged and production unchanged.


## 2026-10-27 DS2 unreleased candidate: fdc1d608 hybrid polish for Journal, Explore, Insights UI and Settings detail surfaces; 81adc534 More bottom sheet and Learn route CSS. Visual only, no intended persistence, schema or calculator change, no live deployment. Prior bd26e3d6 browser 40614785248 and mobile 40614785307 SUCCESS; new-head QA, standalone full DEMO/LIVE ZIP, iPhone acceptance and independent preview parity INCOMPLETE. PR #123 draft.


## 2026-10-27 UNRELEASED DS2 action hierarchy candidate: afced369 scoped Log Dose Quick/Guided primary/secondary/confirm shading; test scaffold 4c24b27 nested page screenshots and computed button inventory. No JS/save/storage or clinical dose math changes. New-head test runner has NOT RUN; exact-head CI, physical iPhone, demo/live ZIP parity and safety allocation test incomplete. Draft PR #123 unchanged; no merge/deployment.


## 2026-10-27 — Log Dose review correction 03d83f64 (DRAFT)
Source review found original non-blend Save path validates plan totals and available open-vial quantities, rolls back partial deductions upon shortfall and shows an error; screenshot alone did not prove dose was saved. The earlier review UI displayed only a selected vial balance, potentially misleading for a multi-vial dose, and unformatted ISO date. Commit 03d83f64 adds a review-stage warning when current plan/selected vial is short and formats date/time for readability. Underlying save, source allocation, inventory math and stored records unchanged. CURRENT-HEAD JS/browser and modal screenshot verification PENDING; caution: warning is informational, save guard remains authoritative. 320/390 light/dark nested screenshots and all action-style taxonomy review INCOMPLETE. PR #123 draft, production untouched.


## 2026-10-27 DS2 DRAFT: d7a45b4b initial dose chooser primary+secondary family; a08f62f9 adds PR/dispatch nested screenshot workflow with isolated localhost browser and no production writes. Current runs queued; screenshots not inspected. All changes unreleased, PR #123 unmerged; no data migrations. Full-app DEMO/LIVE ZIP independently downloadable exact-head packages INCOMPLETE.


## 2026-10-27 unreleased DS2 CSS 49271c54 gives Settings per-category delete and full data wipe distinct restrained/strong danger treatment; no changes to JS, storage, migration or computations. Revised deep screenshot runner 48e3293b bypasses onboarding in isolated local context; rendered outcome and exact-head artifact status pending. No merge or deployment.


## 2026-10-27 UNRELEASED DS2 screenshot and button evidence at e00d802a: 40618241161 nested Playwright visual SUCCESS (92 route-state screenshots 320/390 light/dark) after correcting invalid onboarding-overlay capture. Downloaded artifact 12785574088, reviewed actual rendered results and computed button styling. Four top-level primary actions share #C6A6F2; deletion controls use differentiated danger family. Mobile #40618241156 SUCCESS. Full build #40618241138 pending on record; full app DEMO/LIVE ZIP delivery, deep modal safety and native iPhone QA incomplete. No schema/data changes, merge or deployment.


## 2026-10-27 DRAFT-only QA augmentation 528b3da1 adds six safe action-modal screenshot cases and keeps server localhost-only. New CI pending. No app logic/data migration or production deployment. Exact-head full LIVE/DEMO build and parity not independently inspected; release not complete.


## 2026-10-27 v0.9.20-beta DRAFT additional button hierarchy candidate: CSS 42560603 changes Stash kit wizard progression button to flat primary and Trends Pattern/Symptom Done informational buttons to neutral secondary; no event or calculation changes. Browser test 1d1d9679 excludes OS-native file picker from modal screenshots; run 40619001108 pass at previous CSS. New a00109b2 explicit semantic button assertions; current-head CI, full build artifacts, independent release parity, physical iPhone acceptance and 300mg/10mg stock validation incomplete. Draft/unmerged/not deployed.


## 2026-10-27 v0.9.20-beta DRAFT verification checkpoint at code 1f9fda2b: GitHub Actions nested visual 40619363394 SUCCESS (112 screenshots: 28 states x 320/390 x dark/light), mobile 40619363338 SUCCESS. Semantic action variants match targeted DS2 roles; source unchanged for saved records, clinical math and storage by intended changes. Full build/parity 40619363343 pending at check; physical iPhone acceptance, complete nested flow inventory, LIVE/DEMO exact-source delivery and deployment NOT COMPLETE. PR #123 draft/unmerged, no production release.


## 2026-10-27 — Unreleased DS2 QA-only update
Test script commits 8c78d9d8 / ef61fbf0 / aaaca022 add populated local fictional Demo Mode fixture, reached-child-route checks and button semantic role/shading inventory. No app behaviour, storage schema, migration or production changes. Current-head CI/screenshots and full-app LIVE/DEMO independent deliverables PENDING; PR #123 unmerged/not deployed. 300mg requested dose against vial showing 10mg remains unresolved and blocks release acceptance.


## 2026-10-27 QA-only draft: commits 8c78d9d8, ef61fbf0, aaaca022, d66fd3e1 add populated isolated demo fixture, button role inventory and actual-route assertions, with dedicated App Updates back-button support. No UI/data/clinical algorithm changes, no deployment. Current-head nested CI pending; full-app artifacts and inventory safety acceptance incomplete.


## 2026-10-27 DS2 v0.9.20-beta candidate UNRELEASED: full build/parity QA 40619363343 SUCCESS at PR merge snapshot 387e32814bd4320d3313b8d8dc7e93079e0d573a corresponding to app code 1f9fda2b. Exact-source FULL_DEMO.html, OFFLINE DEMO ZIP, LIVE ZIP generated/validated via workflow artifact 12787100570. Mobile regression 40619363338 PASS; nested screenshots 40619363394 PASS 112 320/390 light/dark; Log Dose 8/8, vial safety 8/8, measurement math 80/80. User screenshot 300mg selected when visible vial 10mg remains unreproduced in this audit, no physical iPhone acceptance or production merge/deploy. CSS-only changes to button hierarchy, test/CI and docs; no intended data migration.


## 2026-10-27 FINAL FICTIONAL-DATA EVIDENCE
Local-only built-in Demo Mode run 40619990770 SUCCESS: 112 screenshot route/action states at 320/390 light/dark; verified 2 fictional kits, 54 check-ins and 27 doses; zero capture errors or document overflow. Semantic action-role breakdown in docs/design/DS2_BUTTON_ROLE_AUDIT.md, commit fcbf5bf3. Current review does not cover all editor paths, native file import, 300mg-versus-10mg source safety, real iPhone or full-app artifact release. Mobile CI 40619990814 SUCCESS. No production deployment/merge.


## 2026-10-27 unreleased QA-only: targeted fictitious one-vial Log Dose stock test added (de42c0f3) and wired into nested screenshot workflow (86e09376). No application JS/CSS modifications, migration, production writes or deployment. 300mg vs 10mg safety result pending CI 40621540795, and full LIVE/DEMO release parity and device acceptance remain incomplete.


## 2026-10-27 Verified single-vial save-path QA
Run 40621540795 SUCCESS for isolated localhost fictional Demo Mode UI Log Dose regression: 300mg requested with only 10mg available did not save or deduct; valid 2mg added one dose and left 8mg. No production storage writes. This is limited to one open vial, 390px Chromium; multi-vial, prepared-dose, edits and physical iPhone remain NOT TESTED. Detailed role audit updated at docs/design/DS2_BUTTON_ROLE_AUDIT.md. PR #123 draft/unmerged and not deployed. NEXT ACTION: add multi-vial and prepared-dose tests, then expand nested action classification.


## 2026-10-27 v0.9.20-beta draft-only focused DS2 action pass
fb05e322 and 5f0be242 CSS normalize Stash Add/Save and reaction Save/Open gradients/colour; Protocol first-log card stacked/full-width action; 0445f6b0 renames CTA 'Log first dose' without routing change; bd6c374e adds Protocol screenshot route to localhost fictional QA. No schema, inventory math or saved data changes. CI, exact-source artifacts, real iPhone and deep nested state screenshots pending; draft PR #123 unmerged, not deployed.


## 2026-10-27 DRAFT-only screen/button refinement: fb05e322, 5f0be242, 0445f6b0 style/label Protocol first-log and Stash/Reaction named CTA family; 3820d731/9c5f5c65 extend populated fictional screenshot assertions. CI 40623390625 screenshot PASS with 124 captures, mobile 40623390895 PASS; full build workflow 40623390612 pending at record. No storage/migration/math change, no approved release/merge/Cloudflare deploy, full-app demo/live packages not delivered.


## 2026-10-27 draft-only CTA correction f238e6d2 removes inline Today dose chooser bright violet inconsistency by enforcing standard primary action treatment. Stash final step screenshot runner 1b8964cf 40623724305 PASS; expanded assertion a1cf67c6 current run pending. CSS only beyond Protocol label change earlier; no state/storage/algorithm changes, no deployment, no finished exact-source DEMO/LIVE delivery.


## 2026-10-27 unreleased DS2 fix at 9436f41e: targeted Today dose chooser JS presentation-only inline style replacement, prompted by confirmed FAIL in nested CI #40623795341. Existing click action, localStorage and vial math unaffected. Current-head rerun #40623977189 pending; no merge/deployment.


## 2026-10-27 unreleased v0.9.20-beta DS2 CTA current verification: source 9436f41e + test a1cf67c6, nested CI #40623977189 SUCCESS with 128 fictional route/action screenshots 320/390 dark/light and 0 capture/overflow errors; action-inventory inspected. Mobile regression #40623977210 SUCCESS; full build/artifact #40623977248 pending. Data/storage/vial calculations unchanged; draft PR #123 not merged or deployed. Full-app DEMO/LIVE ZIP, physical iPhone and all-depth action coverage incomplete.


## 2026-10-27 — VERIFIED REQUEST: BUTTON HIERARCHY + PROTOCOL FIRST-LOG
- Latest source already contains targeted DS2 fix: primary solid lavender #C6A6F2 / dark ink #24182F, flat fill and aligned radii for Add to Stash, kit Continue, Today chooser Continue, reaction save, dose wizard Continue/Confirm; secondary/selection/danger remain differentiated by semantic role. Protocol 'Ready for first log' now stacks its context copy above a full-width lavender 'Log first dose' CTA (existing handler retained). This resolves user-screenshot discrepancy on draft branch, not production.
- Verified GitHub Actions nested visual run 40623977189 **SUCCESS**, 128 fictional populated route/action screenshot cases (320/390 light/dark), including four targeted primary CTAs; mobile regression 40623977210 **SUCCESS**, build/parity artifact workflow 40623977248 **SUCCESS** checked after prior 'in progress' notes. These are browser CI, not physical iPhone acceptance or complete depth.
- App logic, dose allocations, history, localStorage schema unchanged. Draft PR #123 not merged/deployed. Standalone full-app DEMO and LIVE ZIP independent download/pixel inspection still INCOMPLETE in this turn. ONE NEXT ACTION: download and inspect exact-head LIVE/DEMO artifacts then verify physical iPhone UI when available; continue residual nested button role coverage. Global polish LAST.


## 2026-10-28 — Blend analytics Phase 1 on draft PR #123
- User approved blends appearing in Trends, and requested continuing blend kit feature parity. Existing per-component physical recipe data and physical draw ledger verified; historic locked vial ratios not consistently retrievable in all schemas. To avoid incorrect retrospective ingredient totals, commit `287e8ca4` adds a **read-only** Blend composition & history section within Trends, showing each blend's current recorded recipe, physical blend draw count and total mg drawn, with explicit unavailable historic constituent attribution when a locked snapshot is missing. Does not create duplicate ingredient dose entries, dose calculations, or saved-data writes. This is a first reporting surface, **NOT COMPLETE** per-compound over-time totals.
- Test `af2bab34` adds fictional-data Trends rendering assertion at 320/390 light/dark. Current CI and screenshot review pending, physical Safari untested. Later stages: preserve vial-level snapshots when opened; ledger-derived ingredient amounts per dose, aggregate time windows and source attribution; blend Log Outflow/Finish Kit/Reopen Kit/Add to Open handling with physical inventory ledger regression. These are still REQUIRED/INCOMPLETE, not deferred approval requests.
- PR #123 draft/unmerged, production unchanged. Next action: verify new Trends screenshot and build/mobile/nested QA, then implement blend-aware menu transaction workflows and historical-safe constituent reporting. Global app polish LAST.


## 2026-10-28 — Blend transactions and ingredient reporting implementation checkpoint
- Verified prior app head `5b599835`: build/parity 40633892291 SUCCESS, mobile 40633892297 SUCCESS, nested 40633892309 SUCCESS. These predate new changes and do NOT prove latest updates.
- Draft-only new code: `651e4bbd` adds dedicated blend `Log Outflow` with positive/available mg guards, explicit warning confirmation, physical waste ledger and no duplicate constituent dose. `6352b6e6` exposes it in blend Kit actions. `096b3f0d` saves an immutable copy of kit composition on a blend vial at its new opening; never retroactively infers composition of existing vials. `7aef09de` computes estimated ingredient amounts in Trends solely for physical blend ledger entries with saved per-vial snapshots; unlinked historic rows are excluded/marked unavailable, original blend draws remain one physical event. `dfe743cd` adds fictional cancel check to nested audit.
- **INCOMPLETE/SAFETY BLOCKER:** blend `Add to Open Vial` is NOT implemented: existing physical blend ledger total/open-vial balance must support merging sealed and external material with precise volume/strength accounting; no regular-kit handler reuse. Blend finish/reopen full transaction and historical ratio changes also need strong validation; existing test only covers cancel. Latest CI and artifacts after these commits NOT YET VERIFIED. Do not claim release completeness, physical acceptance, production write or deployment. Keep PR #123 DRAFT.
- ONE NEXT ACTION: inspect latest branch CI; add isolated blend outflow commit/overspend, finish/reopen and composition-snapshot per-vial regression, then safely design/implement Add to Open Vial mass-balance without rewriting history. Global polish LAST.


## 2026-10-28 — User clarifies Add to Open Vial means CORRECT FOUND REMAINING (blend)
- User explicitly corrected the interpretation: no physical substance is added or mixed; actual open-vial remainder is greater than expected. This supersedes prior mass-mixing blocker for this use case. Existing ordinary-kit `Add to open vial` wording remains unchanged; blend menu now says **Correct open vial balance** to avoid implying physical addition.
- `9602572c` implements explicit confirmed positive balance correction on the currently open blend vial with `balanceCorrections[]` transaction ledger, no sealed vial deduction, no component/dose event, and no changes to immutable vial recipe. `3f21ee05` exposes the action on blend menu; legacy-v2 path adjusts direct physical vial balance. Balance derivation counts active corrections only. `20efc274` adds fictional correction/consumption/reversal math checks.
- `76195155` and `ade739c0` add Trends blend period filtering (7/30/90/all) and administered-only versus all physical draws; contributions continue to require original vial composition snapshots, and old unverified histories are not backfilled. `6be513ee` adds fictional blend transaction matrix for rejection, valid outflow, finish and reopen preservation, without live data access.
- Latest source changes and new exact-source QA **NOT YET VERIFIED**; no production deployment/merge. Remaining risks: existing historical data lacking vial snapshots; blend transaction undo and reopened-state presentation; full iPhone 320/390 light/dark/keyboard acceptance, new LIVE/DEMO packaging, and analytics data parity. Test/inspect before claiming passes.
- ONE NEXT ACTION: read new CI workflow outcomes and screenshots, repair any failing transaction tests or source issues, then complete package QA and physical preview acceptance. Global accessibility/typography/scroll/navigation/motion LAST.


## 2026-10-28 — Release candidate artifact byte-level parity VERIFIED, no deployment
- Build workflow #40637795436 completed SUCCESS (mobile #40637795363 SUCCESS; nested #40637795575 SUCCESS). Downloaded exact CI artifact #12794665751. Artifact ZIP CRC PASS. Manifest version v0.9.20-beta, workflow PR merge-source SHA `00d21e7f91586f9b4b2ec4199c91c66d8d026a83`; this is a synthetic workflow checkout, NOT branch SHA.
- Extracted LIVE ZIP with exact 21 manifest paths: root index.html, 4 CSS, 12 ordered JS, 4 icons. ZIP CRC PASS. Independently compared all 21 Git blob hashes byte-for-byte with current draft application files; all MATCH. Branch head before docs: 818131c7498ab326ea565b9cf0fd5ec68487e17a. Compare `f08e9be9..818131c7` confirms only `scripts/ds2-nested-navigation-audit.mjs` and 3 continuity MD files changed; app source unchanged.
- Standalone full-app DEMO HTML present ~2.69 MB, inline JS (no external script src), memory-only localStorage/sessionStorage substitution with explicit fail-closed assertion, fictional buildDemoState, sync disabled. Offline demo ZIP CRC PASS includes index.html + instructions. Browser results: LIVE and DEMO 320/390 dark/light 8/8 PASS in automated Chromium. Not native iPhone proof. Both LIVE and DEMO files were extracted from SAME CI artifact and exact app source.
- Cloudflare parity manifest verified=false as expected for unmerged draft; production main c1c95e1d unchanged. Full release artifacts now AVAILABLE/VERIFIED for application content; physical iPhone acceptance, deep manual workflow sign-off, merge, Pages/Cloudflare deployment INCOMPLETE. No production data writes. User explicitly prohibited merge/deploy without approval.
- ONE NEXT ACTION (ASSISTANT): provide exact-source LIVE and DEMO downloads, request hands-on iPhone acceptance for current preview, then seek explicit release approval separately. USER ACTION NEEDED only for physical iPhone acceptance and later merge/deploy decision. Global polish LAST.


## 2026-10-28 — Approved historical blend explorer: reversible attribution checkpoint
- Verified prior implementation on branch: `b63497ca` non-destructive `blendHistoryAttributions[]` confirmation, `f80f9e54` chart-first Explore Dose Records child screen, `d768390b` inclusive dates/one-vial mapping. Parent inline 80-row blend ledger removed. These commits predate current turn, not new work.
- NEW commit `c995a493`: add auditable review and explicit reversal UI for user-confirmed historical date ranges. Reversal changes only `blendHistoryAttributions[].status` to `reversed` with timestamp; does NOT edit dose events, physical inventory, composition snapshots or original transaction histories. NEW `90aba392`: isolated fictional 2mg old dose and 80mg 50/10/10/10 recipe tests attribution 1.25/.25/.25/.25, then reversal to unknown, with immutable dose/vial/waste ledger. Script only; execution status PENDING.
- Risks: multi-kit/vial ambiguous histories intentionally remain unknown; date-range confirmation requires review; no automatic destructive migration. UI transaction confirmation/overlap/cancel and legacy conversion edges still need deeper browser tests. FULL-app LIVE/DEMO refreshed for these changes INCOMPLETE; physical iPhone acceptance NOT TESTED. PR #123 remains DRAFT, no merge/deploy.
- ONE NEXT ACTION (ASSISTANT): check branch CI for 90aba392, inspect chart-first screenshot and regression evidence, repair failures; then update release artifacts and device acceptance separately. USER ACTION: Nothing needed right now. Global polish LAST.


## 2026-10-28 — VERIFICATION: chart-first blend explorer and historical reconciliation candidate
- Verified app source on draft branch (app JS/CSS unchanged after source commit `99c2c864`); tests through `cbbdd18b`. Nested GitHub Actions #40641541861 **SUCCESS**, artifact #12795234120 downloaded/inspected: ZIP CRC PASS; 196 evidence observations, zero `error` and zero overflow across 320/390 light/dark. Tests PASS: 4 fictional injections (7/5/4/3 mg), chart and 19.000mg period total, 13.571/2.714/2.714mg ingredient coverage, selected 5mg injection -> 3.571mg Ingredient A; 2mg historical legacy dose -> 1.25/.25/.25/.25mg; Stash legacy kit classification Cancel/Confirm preserving saved dose, waste and physical vial mg; reconciliation Cancel/Confirm/date overlap/other-kit exclusion/reversal, preserved dose & waste logs; morning date boundaries. Mobile regression #40641541769 **SUCCESS**.
- Build/parity #40641541756 **SUCCESS**, artifact #12796340141 downloaded: outer ZIP CRC PASS, LIVE ZIP CRC PASS, 21/21 Git blob hashes match current draft app assets and ordered scripts. Standalone 2.70MB full-app DEMO has inline resources and memory-only local/session storage fail-closed, disabled network; Offline DEMO ZIP CRC PASS; LIVE/DEMO 320/390 light/dark 8/8 browser checks PASS. Manifest `v0.9.20-beta`, synthetic workflow merge SHA `f91c348b...` not branch head; direct Git hash comparison independently establishes application-content parity. Cloudflare parity false as expected for unmerged draft.
- Physical iPhone acceptance of new explorer and real historical data **NOT TESTED**; actual KLOW/Deadpool historical recipes are not silently inferred. Before old-record component estimates appear, user must opt in to kit/date/recipe confirmation; ambiguity remains unknown. No destructive migration, no original dose/ledger rewrite, no production user storage touched in tests.
- GitHub PR #123 remains DRAFT/unmerged, main `c1c95e1d` unchanged, no deployment. **ONE NEXT ACTION (ASSISTANT):** hand off refreshed source-matched LIVE and isolated full-app DEMO files with an exact physical iPhone acceptance checklist; after user acceptance, seek separate explicit permission to merge/deploy. **USER ACTION:** preview the explorer and opt-in reconciliation on physical iPhone when ready; no action required immediately. Global polish LAST.


## 2026-10-28 — Trends drilldown iteration: source/QA handoff (DRAFT, NOT DEPLOYED)
- Approved UX implemented as targeted source changes on PR #123: chronological vertical dose-date rows, separate injection detail, tappable ingredient direct/from-blend history, independent Intel action, labeled contribution browser entries, fresh Trends home on tab entry, page top on compound navigation, removal of redundant bottom Blend composition section, scoped DS2 semantic button styling and chevron, no nested date scroller, optional date refinement after automatic whole-history candidate discovery. Historical reconciliation remains explicitly opt-in and reversible; no old doses or physical inventory modified.
- Source hardening: `nxIngredientHistoryDetail` avoids double-counting the same blend name across multiple kits; direct unit values converted to mg, and already-attributed historic doses excluded from reconciliation candidates. No stored data migration. Protect previously accepted Calendar, Plans and Supplies.
- First nested workflow #40704187987 FAILED due date-list `[hidden]` overridden by authored CSS; source corrected at `9ebd57b6`. Follow-up nested #40704880841 SUCCESS; downloaded artifact #12823228513: ZIP CRC PASS, 196 observations, zero recorded errors; eight 320/390 light/dark explorer and ingredient-history screenshots present/inspected. Later nested #40705326292 SUCCESS and mobile #40705326516 SUCCESS, both preceding final wording/logic changes; final post-hardening head QA NOT YET VERIFIED. Current full-app LIVE/DEMO build for this source INCOMPLETE until exact-head workflow artifact available. Physical iPhone NOT TESTED. No merge or Cloudflare deployment approved.
- ONE NEXT ACTION (ASSISTANT): verify latest automated nested/mobile/build results, inspect exact current screenshots and artifact LIVE/DEMO parity, then request physical iPhone acceptance. USER ACTION: nothing now; review on iPhone only when ready. Global polish remains LAST.


## 2026-10-28 — v0.9.20-beta Compact Intel draft UX checkpoint (NOT RELEASED)
- PR #123 `design/design-system-2-preview-20261025` application SHA `50eb4faaf39a8fb5cb978d7f121210606624f17d`, main PR base `c1c95e1d`. Changes: compact secondary Back and outlined Compound Intel single-line footer replacing earlier full-width actions; unified Trends chevrons; balanced two-stat ingredient summary; no data/storage migrations or dose/inventory/calculation changes. Affected screens: More → Trends → Compound History → blend injection → ingredient history and return navigation.
- User iPhone visual design acceptance: **APPROVED** (“perfect looks good”), **not** full iOS regression acceptance. Cloudflare preview deployment for `50eb4fa` bot-confirmed https://a86e0d00.nexuspeplog.pages.dev/ ; production **NOT** merged/deployed, DRAFT PR.
- CI exact application SHA: nested 196 screenshot/navigational + fictional inventory #40770526500 SUCCESS; mobile forms #40770526570 SUCCESS. Build + LIVE/DEMO parity #40770526457 still IN PROGRESS at last verification, no artifact published; exact-source standalone full DEMO HTML, DEMO ZIP, LIVE ZIP **INCOMPLETE**. User historical conservation/provenance and full physical Safari/VoiceOver release gates remain **NOT TESTED**.
- **Next:** unblock/verify build job, download exact-source artifacts, validate contents/isolation and update continuity. No release version bump or production release claimed.


## 2026-10-28 — FINAL EVIDENCE: Compact Intel QA + artifact parity VERIFIED (draft)
- User accepted Compact Intel visual design on physical iPhone (“perfect looks good”). This is **scoped visual approval**, not full iOS/VoiceOver acceptance and not merge/deploy authorisation.
- **Verified app source:** draft PR #123 application commit `50eb4faaf39a8fb5cb978d7f121210606624f17d`; main base `c1c95e1d`; PR draft/unmerged. Cloudflare bot successfully deployed this commit to **draft preview only** https://a86e0d00.nexuspeplog.pages.dev/ . Production Cloudflare parity report in artifact `Nexus_CLOUDFLARE_PARITY.json` has `verified:false` / mismatched root index, EXPECTED because draft was not promoted to production. Do not mistake this for a failed source package.
- **All exact-app-code QA successful:** #40770526570 mobile form SUCCESS; #40770526500 nested navigation visual SUCCESS (196 screens 320/390 light/dark, 0 overflow/errors; fictional insufficient/vial deduction passes); #40770526457 build and parity SUCCESS after previously pending browser QA. Built browser results 8/8 LIVE/DEMO PASS and vial safety results 8/8 configurations PASS. Downloaded workflow release artifact ID **12852152849** (`Nexus-release-artifacts`) and screenshot evidence ID **12851898105**.
- **Artifact validation performed independently on extracted ZIP**: archive CRC PASS; standalone `Nexus_v0.9.20-beta_FULL_DEMO.html` ~2.7 MB, NO external script tags, inline full application with fictional demo `buildDemoState`, `localStorage` / `sessionStorage` replaced with ephemeral memory and fail-closed validation, `fetch`/XHR/beacon disabled. Offline zip CRC PASS, exactly HTML+README, inner `index.html` byte-for-byte equal to standalone HTML. LIVE ZIP CRC PASS, exactly 21/21 expected root/asset files (index, 4 CSS, ordered 01–12 JS, 4 icons), zero missing/extras. **Every LIVE ZIP file's Git blob SHA-1 matched the actual `50eb4faa` GitHub file SHA (21/21)**, proving PR-head source parity despite build manifest recording internally generated combined source SHA `e18b1a4f41728fbafe35c4d505e928a68c4e2cea`; do not misrepresent synthetic build SHA as PR HEAD. Local Pages source parity `verified:true`; production Cloudflare remains distinct and intentionally unchanged.
- **Release delivery status:** in-chat preview DELIVERED; standalone full-app isolated DEMO HTML and offline ZIP VERIFIED; exact-source LIVE ZIP VERIFIED; release notes/QA in docs VERIFIED; GitHub draft PR UPDATED; automated checks PASSED; **merge and production deploy ON HOLD by user's explicit instruction**. Physical full-app iPhone functional checks, VoiceOver and real personal inventory/historical attribution acceptance **NOT TESTED / remain release gates**; no user backup imported or production storage altered.
- **ONE NEXT ACTION:** finish user-facing exact-source handoff and review remaining inventory/provenance acceptance gate without altering production; keep PR #123 draft. **USER NEXT ACTION: Nothing needed immediately**; compact design visual review already accepted. Separate explicit approval is required before any production merge/deployment.

## 2026-10-28 — UNRELEASED draft source fix, historical blend history
- `21ac2094` removes present-day kit ingredient prefilter from read-only Ingredient History so dated confirmed old formulations can contribute historical-only ingredients. `3ca0f351` adds a fictional dated historical-formulation browser regression. No schema migration or writes to user doses, allocations or inventory intended. Exact-head CI, source-matched new LIVE/DEMO packaging, physical Safari and VoiceOver are NOT YET VERIFIED. PR #123 remains draft, unmerged, no production deployment.

## 2026-10-28 — UNRELEASED What's New lifecycle candidate
- `f34a847f` manual history close no longer persists legacy main-state key; `1341376b` fixes semver parser and marks verified published vs earlier unverified legacy history; `5dc3d1df` adds isolated fictional lifecycle browser cases. Release candidate remains `v0.9.20-beta`, `release/release.json` publication `unverified`; no automatic draft popup. No storage migration or automatic history edits. Latest CI, packages and physical acceptance **PENDING**. Draft PR #123, not merged, primary production unchanged.

## 2026-10-28 — What's New canonical published-history archive, UNRELEASED
- GitHub draft commits `b637c0e6` historical published v0.9.18/v0.9.19 archive based on dated Cloudflare-parity evidence, `c4c35f81` generator incorporation, `d71ae6f2` generated in-app notes, `c91bb91c` generated runtime, `f31e5f51` display integration, `a8962e0a` chronology fix, `9a1838ca` browser archive regression. No new app version or published entry created; candidate v0.9.20-beta stays `unverified`. No intended user data impact. Browser CI and complete exact-source LIVE/full-app DEMO artifacts pending; PR draft/unmerged, production untouched.

## 2026-10-28 — Draft What's New test correction and QA checkpoint
- `599f1de8` test-only change separates Demo Mode suppression from eligible published-user scenario. On this exact application source: nested visual audit `40776200367` SUCCESS (208 captures/0 errors/overflow), mobile forms `40776200395` SUCCESS, hybrid preview browser `40776192105` SUCCESS; source validation and exact-source packaging steps already passed inside in-progress build run `40776200351`, full run and download validation pending. No storage migration, PR #123 remains draft/unmerged, production unchanged, physical iPhone/VoiceOver untested.

## 2026-10-28 — What's New build failure and test correction, UNRELEASED
- Exact app source `599f1de8`, build run `40776200351` FAIL at stale Plans release-notification test after source, release package, structure and preceding browser suites succeeded. Failed-run artifact #12854219443 may be inspected only as unapproved candidate. `68cf3356` test-only correction aligns `Later` with same-session suppression and future-session prompt; new CI not yet verified. No production merge/deploy, no user data/storage migration.

## 2026-10-28 — Latest What's New QA correction, still UNRELEASED
- After failed full build #40776896536, test-only commits `29c4066f`, `f8d16a48` mock eligible fictional non-Demo mode while preserving real Demo suppress safeguard; `2537ee40` adds hard-reload unpublished check to Plans browser matrix. No production app runtime changes or migration. Fresh full QA and artifact release clearance pending. PR #123 remains draft/unmerged, no deployment.

## 2026-10-28 — Unreleased What's New test harness follow-up
- Runtime source unchanged since `599f1de8`; browser test corrections `29c4066f`, `f8d16a48`, `2537ee40`, `4c5b23cd`, `a8292e57`. Failed build #40776896536 was due archived Plans popup assertion under Demo Mode. Current build #40777876259 and nested #40777876220 pending, mobile #40777876462 SUCCESS, hybrid preview #40777868652 SUCCESS. No merge/deployment, physical acceptance still blocked.

## 2026-10-28 — v0.9.20-beta What's New overhaul: DRAFT automated QA PASS, NOT DEPLOYED
- Runtime fix `1341376b` repairs semantic-version comparison, `f34a847f` makes manual history read-only, `b637c0e6`/`c4c35f81`/`c91bb91c` establish verified v0.9.18/v0.9.19 canonical historical release archive in generated notes, `f31e5f51`/`a8962e0a` show chronological published-first App Updates with legacy notes distinguished. Synthetic lifecycle tests `5dc3d1df`, `599f1de8`; latest test-only correctness through `a8292e57` preserves Demo Mode and checks unpublished hard reload. Final GitHub build #40777876259 **SUCCESS**, nested #40777876220 SUCCESS, mobile #40777876462 SUCCESS, hybrid #40777868652 SUCCESS. Artifact #12855962516 includes exact-version full LIVE ZIP, isolated standalone FULL DEMO HTML and offline DEMO ZIP; GitHub pipeline integrity and 8 live/demo configurations PASS. No localStorage schema migration, dose or inventory rewrite. Full physical iPhone/VoiceOver and real-user integrity acceptance NOT TESTED. PR #123 draft, unmerged; **NO PRODUCTION DEPLOYMENT**. Publication stays `unverified` until approved release and independent Cloudflare parity.

## 2026-10-28 — v0.9.20-beta draft What's New visual consistency refinement, NOT RELEASED
- User's physical iPhone feedback on previous preview `757f68e`: 8/8 preview checks PASS; no automatic notice (expected because publication `unverified`); noted emoji/new-style mismatch and inconsistent old numeric labels. Draft `69399ef1` unifies release-history visual rows, displays verified `v0.9.18/19-beta` versions, distinguishes archived numeric legacy Update #N and adds transparent popup logic copy. `27be794a` updates fictional-history test. No destructive deletion, storage migration, personal record changes or production deployment; new-head CI and new design physical acceptance pending. Public App Store release-history curation remains proposed, not authorized.

## 2026-10-28 — What's New physical visual acceptance, UNRELEASED
- User confirmed revised preview What's New screen looks fine on physical iPhone; automatic popup NOT physically tested, because candidate `v0.9.20-beta` stays `unverified` (correctly silent). Latest application source head before docs `7d73889c` passed GitHub mobile #40796526082, nested #40796526234, full build/parity #40796526094, hybrid #40796519629. Cloudflare preview bot reports `b9cede6b` deployed; direct served hash comparison not independently available. Added release maintenance contract `docs/product/WHATS_NEW_RELEASE_PROCESS.md` in `6e3f712a`. No version bump, user data change, merge or production deployment. Popup triggered on physically published update remains NOT TESTED.

## 2026-10-28 — Release readiness gate CODED/CI PARTIAL, UNRELEASED
- `a06bff39` adds source-diff/manifest consistency readiness CLI and six synthetic tests; `da88994a` integrates into build workflow with strict main/release versus warning PR mode, including complete Git history; `36acb33c` documents Cloudflare deployment and human-completeness limitations. No runtime state/visual/calculator changes. CI gate step #40797868119 PASS; broad source-matched build/nested still pending at checkpoint. Draft PR #123 not merged, primary Cloudflare production not deployed and user data untouched.

## 2026-10-28 — DS2 safety test-only candidate, NOT RELEASED
- `56dc3f16` adds fictional prepared-dose two-vial partial-refund conservation assertions to existing full LIVE/DEMO 320/390 light/dark safety matrix; no runtime/source calculation changes or saved-data migration. New exact-source CI pending, draft PR #123 remains unmerged and production unchanged. Existing release-readiness gate remains strict on main/release, warning on draft; not a substitute for verified human notes and Cloudflare parity.

## 2026-10-28 — DS2 prepared-dose orphan-source safety fix, draft only
- Runtime `4968983c` blocks removal of unused prepared batch with missing explicit source kit/vial; fictional negative tests `b8ca5abf`, following two-vial partial refund test `56dc3f16`. No storage schema/data migration or live writes intended. Full build, exact-source LIVE/isolated DEMO artifacts and protected-flow verification **PENDING**. PR #123 draft/unmerged, primary Cloudflare production unchanged.

## 2026-10-28 — v0.9.20-beta DS2 source verification checkpoint, UNRELEASED
- Full CI #40798440095 PASS on original 56-check split-prepared vial regression `56dc3f16`; artifact #12864843167 includes complete LIVE/isolated DEMO candidate packages. Subsequent fail-closed prepared-source integrity fix `4968983c` and 64-check expanded test `b8ca5abf` are NEWER than this pass; latest build #40798876625 still running. No production deployment/merge, no user data touched; external clinical/device acceptance not implied.

## 2026-10-28 — v0.9.20-beta prepared-dose source fail-closed protection — DRAFT QA PASS, NOT DEPLOYED
- Runtime `4968983c` retains prepared batch with unused inventory when an explicitly referenced kit or vial is missing; tests `56dc3f16` and `b8ca5abf` verify two-vial partial refund conservation and missing-source refusal. Exact code/test source `b8ca5abf` full workflow #40798876625 SUCCESS: 64 fictional vial safety cases in eight LIVE/DEMO viewport/theme contexts, Plans 8, broad browser 8, math diagnostics 80/80; artifact #12864798683 with LIVE ZIP/standalone full-app DEMO/offline ZIP. Nested/mobile/hybrid checks SUCCESS. No intended migration, primary production unchanged; PR #123 unmerged, physical Safari and historical-data acceptance pending. No release is published.

## 2026-10-28 — DS2 inventory safety verification checkpoint, draft only
- Exact source `ccd3b032` full #40799634203 SUCCESS, 64 fictional vial-source assertions PASS across eight LIVE/DEMO device/theme variants, source-matched full packages artifact #12865312949. New test-only `f70b5c26` extends to blocked deletion confirmation dialog + visible warning, target 72 cases; full #40801104052 pending at checkpoint. No runtime/source changes in this step, no data migration, production unchanged, PR #123 unmerged.

## 2026-10-28 — DS2 blocked prepared-deletion UI regression exact-source PASS — NOT RELEASED
- Test-only `f70b5c26` verified in full #40801104052 SUCCESS, 72/72 fictional vial safety assertions in eight source-matched LIVE/DEMO viewport/theme cases. Complete candidate files/artifact #12866491578 validated in GitHub CI. No feature runtime edit, schema change, saved data change, merge or deployment. Production Cloudflare remained unchanged; published release status is still unverified.

## 2026-10-28 — v0.9.20-beta legacy source attribution protection — DRAFT / NOT RELEASED
- Candidate source `0ad1f6cb` prevents unused historical prepared batches from being deleted/refunded to a merely currently-open vial when source provenance is absent. Test `af1b789b` adds isolated fictional 96-assertion target. New CI not yet confirmed; no schema migration, historical edits, merge, live deployment or physical iPhone acceptance. Prior 72/72 was for predecessor `f70b5c26`, not current source.

## 2026-10-28/29 — v0.9.20-beta isolated historical warning-preview artifact candidate (NOT RELEASED)
- `4c5c6988` builder generates extra standalone full-app orphan warning HTML + iPhone ZIP without modifying LIVE assets, `c93b1bac` adds real-modal browser test. CI not yet verified. Fictional storage isolated/no network, no schema migration or historical data change. Draft PR #123 unmerged; Cloudflare production unchanged.

## 2026-10-28 — v0.9.20-beta DS2 candidate final QA and iPhone acceptance (NOT RELEASED)
- Draft PR #123 application source `441d22a0847e536cbb5a0e6bc27463b74e2de34d` (Compound History scroll `fb601b97`; Profile fresh-entry overview `441d22a0`); main base `c1c95e1d`. No merge/deployment SHA or production publication.
- Full/parity CI #40812666592 PASS, mobile #40812666510 PASS, nested navigation #40812666504 PASS; release artifact #12870988417 downloaded and exact-source LIVE ZIP + isolated fictional full-app DEMO verified. Nested evidence #12870992426 reviewed.
- Physical iPhone focused retest user reported 4/4 PASS: history single scroll, bottom actions, fresh Profile entry, Settings Back; notes None. No destructive migration or intentional localStorage changes. Whole-app VoiceOver and live-data acceptance not established; preview URL source identity and production deployment not independently verified. Release status: approval review, draft/unmerged/undeployed.

## 2026-10-28 — v0.9.20-beta PR #123 merged, publication NOT VERIFIED
- User explicitly authorised merge + Cloudflare deployment conditional on exact-head CI PASS. Three checks SUCCESS at PR head `8c3fbf9c`: build/parity #40813703596, mobile #40813703634, nested #40813703782. PR #123 merged with exact SHA guard; GitHub merge commit `6737d9c7cbd25a8b3fc557310904cf7c97d72706`.
- App updates include Hybrid DS2 UI, historical source-integrity protection, Compound History single-scroll and fresh Profile overview. Focused user-reported iPhone 4/4 PASS; no planned destructive migration.
- Release **MERGED, DEPLOYMENT NOT VERIFIED**. Direct Cloudflare verification failed from session tools; no source/asset parity result or post-merge workflow proof. Do not claim publication or set release manifest `published` until verified.

## 2026-10-28 — v0.9.20-beta post-merge production verification BLOCKED
- GitHub merge `6737d9c7` confirmed. Expected main index title Nexus · v0.9.20-beta, scripts 01–12 and four CSS assets verified from repository. Live Cloudflare page, JS and CSS requests could not resolve through container DNS; web retrieval unavailable. No independent Cloudflare deployment SHA, live asset parity, publication timestamp or post-merge workflow result obtained. Release manifest remains `publication.status=unverified`; **not certified deployed**.


### PR #124 — Preparation atomic planner candidate (2026-10-29; NOT A RELEASE)
- Main baseline `da585ab3`; draft branch feature/dose-administration-method-20261029. Pure copy-based vial-to-nasal-bottle transfer planner with explicit origin/target IDs, migration fail-closed and duplicate/replay guards. Fictional test added and workflow hooked; CI result pending.
- Screens: no new committed UI. Data impact: none in production; no migration or live writes. Incomplete: canonical reconciliation, durable persistence, Stash editor, Log Dose, full-app artifacts and browser/iPhone QA. Not merged or deployed.


## 2026-10-29 — Draft PR #124 checkpoint (NOT RELEASED)
- Branch changes: restored SubQ/IM granular administration-site values in dose editor, preserving previously recorded site labels; corrected two fictional CI fixtures to declare explicit SubQ inventory route instead of relaxing source eligibility; added granular-site regression assertions.
- Active route/formulation work: injectables, nasal bottles and capsules must become distinct inventory types. This is not yet implemented, and no historical stock reclassification has been performed.
- Transfer bridge retains canonical debit/credit and guarded storage validation. Ordinary synchronous saves use stale-state/readback guards but cannot participate in an asynchronous Web Lock without changing persistence timing; internal transfer callable is explicitly fail-closed until coordination is resolved.
- CI evidence: pre-fix release browser run 40820869183 failed blend recording; nested run 40820869207 failed fictional valid-dose. After isolated fixture correction, mobile and nested navigation jobs succeeded on 1f3c5f5e; full browser job was still in progress. Later granular-site assertions require fresh CI validation.
- Release: PROPOSED/CODED only. PR #124 remains DRAFT and UNMERGED; LIVE/DEMO artifacts and primary deployment NOT VERIFIED; no physical iPhone acceptance. No production data changes.


## 2026-10-29 — PR #124 formulation-aware inventory (DRAFT, NOT RELEASED)
- Additive oral capsule/nasal bottle model, guarded create and audited balance adjustment; Stash creation/display/edit controls and isolated fictional browser/node regressions. Existing vial records and historical dose logs not rewritten; no conversion, sync or real transfer controls. Exact-source LIVE/DEMO builder updated for added script.
- At implementation checkpoint, CI on new code is still running; browser results not to be marked pass. Previous head a403d6d had full browser/mobile/nested runs SUCCESS. Draft PR unmerged, Cloudflare production not deployed or source-parity-verified, physical iPhone not accepted. Standalone artifacts from new code not locally downloaded/verified.


## 2026-10-29 — Draft PR #124 validation checkpoint (UNRELEASED)
- Stash capsule/nasal additive inventory build 4484dc5d passed full browser, mobile and nested-navigation CI (runs 40891595782, 40891595812, 40891595726). Artifact 12906345167 from build. Browser emulation does not equal physical iPhone acceptance.
- Additional 44px and 320/390 overflow assertions committed c8507b74; exact new-head tests pending. Route-specific deduction is proposed only in docs/product/NEXUS_FORMULATION_DOSE_LEDGER_PLAN.md; no production merge, deploy, stock migration, or dose deduction activation.


## 2026-10-29 — PR #124 Add Kit redesign checkpoint (NOT RELEASED)
- Replaced rejected standalone formulation controls with single Add Kit form selector (Vials/Capsules/Raw Powder/Topical/purchased Nasal Spray). Non-vial physical products render as regular Stash cards; source vial intended-use metadata added to Open New Vial; no transfer or dose deductions enabled.
- Existing vial stock, dose history, capsule/nasal formulationStocks and backups retain their IDs/data; no implicit source attribution or destructive migration. Tests updated for button targets, kit cards, nasal-reserved vial isolation and raw/topical balances. Exact-head full QA still pending; production not merged/deployed; physical iPhone untested.


## 2026-10-31 — PR #124 exclusive backed dose QA, draft only, NOT RELEASED
- Current observed main da585ab3; draft head 96b1de7a. Exact-head shared writer #41228823226 PASS, WebKit #41228823147 PASS, mobile #41228823156 PASS, nested #41228823165 PASS. Full build/browser #41228823152 FAILED at legacy exact-vial dose-save assertion, despite earlier real Chromium two-tab fresh backed-dose PASS in its logs. Artifact #13052578702 uploaded, not fully QA certified.
- Test-only follow-up commit 32de6c1e waits for async exclusive dose completion before legacy assertion. Its outcome remains PENDING; no runtime dosing logic, source identity, schema, localStorage migration or production data changed by this commit.
- Incomplete: exclusive backed-dose edit/undo, full exact-head browser green, real iPhone acceptance. No merge/deploy; prepared transfer gates OFF; publication remains unverified.


## 2026-10-31 — PR #124 fresh backed-dose edit/undo candidate, UNRELEASED
- Branch feature/dose-administration-method-20261029, baseline main da585ab3. 5f5af5b2 isolates direct fictional UI fixtures from real locked persistence. 933c2e33 adds exact-vial exclusive edit/undo planner; 22562eb9 wires UI edit and fresh dose Undo; 8d9d8b1a adds focused Node single-vial/edit/undo and stale-tab assertions; bfbc3682 adds static writer path guard; 21e0fec7/38fb0796 adds/fixes browser dose-sheet regression; 665eb9f9 extends real Chromium two-tab edit-versus-stale Undo test.
- Dedicated writer workflow at 8d9d8b1a and 22562eb9 passed, full exact-head browser outcome PENDING; #41231034162 failed syntax-only duplicate test variable, fixed 38fb0796. No UI/visual/physical iPhone acceptance yet. Data scope: additive audit, original vial ID, no migration of prior dose records. Prepared transfer gates OFF. PR draft/unmerged, Cloudflare unchanged/unverified.


## 2026-10-31 — PR #124 exact-vial multi-kit allocation fix, CANDIDATE ONLY
- Runtime ecad706c pins second physical vial ID when exactly one eligible source; ambiguous additional kits are blocked with no stock change. Tests c7d9477b/c4c64d7d assert exact ID despite collapsed technical source disclosure. These follow a real browser failure on prior full #41231285603 (unidentified secondary vial).
- Latest source-target CI: writer #41231568131 PASS, mobile #41231568083 PASS, nested #41231568051 PASS; full #41231568003 IN PROGRESS; WebKit #41231568008 IN PROGRESS at documentation time. Source-matched full LIVE/fictional DEMO artifacts must be verified after latest CI. No migration, user storage rewrite, merge/deploy, Cloudflare parity or real iPhone acceptance.


## 2026-10-31 — PR124 draft browser validation continuation, not released
- #41231568003 proves browser Log Dose 176 flow matrix PASS on c4c64d7d after exact second-vial fix, but **full suite FAIL** at stale save acknowledgment test. 2e6ed2c7 updates test to target exclusive failed backed-dose commit, not retired synchronous saveState. #41231974659 exact-head full and artifacts pending. No runtime change from this test-only fix, no production-data migration/merge/deploy; primary parity and real iPhone acceptance incomplete.


## 2026-10-31 — PR #124 full QA green at source 653beee2 (NOT RELEASED)
- Five exact-head CI workflows SUCCESS; full build/parity/browser #41232054165 and artifact 13054077913. Standalone fictional full-app DEMO and full source LIVE ZIP passed GitHub CI validation; independently matched all 26 LIVE package file Git blobs to PR branch. DEMO isolates storage, embeds scripts/styles, has no live sync or writes; Log Dose 176 flows/8 browser matrices PASS. Real device/VoiceOver NOT TESTED.
- Initial manifest erroneously used PR synthetic merge SHA 864c6c40 as source_commit; artifact source bytes correctly matched 653beee2. Build metadata fix 09acddcd to record event.pull_request.head.sha; follow-up candidate artifacts and CI require revalidation before final source metadata certification. Full-app candidate remains draft; no version bump, merge, deploy or production change authorized. Prepared transfer gates OFF.


## 2026-10-31 — PR124 exact-source verified candidate, NOT RELEASED
- Candidate tested head 6e3a00f39c490455bf402a31e39f311cd5262cbc, base main da585ab3; all five CI checks SUCCESS (full browser #41242891963, writer #41242891995, mobile #41242892020, WebKit #41242892064, DS2 #41242891975). Artifacts #13057674228 contain exact-source LIVE ZIP, isolated FULL_DEMO HTML and offline DEMO ZIP; manifest source_commit correct and all 26 LIVE Git blobs independently matched to head. 176 Log Dose browser flows and failure acknowledgement plus protected navigation/inventory suites pass. No destructive migration or production user data writes. Physical Safari/VoiceOver NOT TESTED; no PR merge, production deployment or release approval. Current in-app version v0.9.20-beta unchanged.


## 2026-10-31 — PR #124 compact Stash and segmented forms UI (UNRELEASED)
- User-identified visual defects: oversized kit cards, inconsistent vertical outlined compound suggestion rows for non-vials, and nasal/capsule package cards mixed with large vial kits. Draft branch updates 3bd53037, 3addc141, 5408ca8b implement Vial kits/Other forms/Supplies segment, compact physical kit and other-form cards, shared five-result + View all compounds picker. Test update 18533dc8 covers segmented saving, preserving old vial stock and 44px picker targets; latest docs checkpoint 3848c87d. No schema change, migrated source record, data deletion, prepared transfer or production deployment.
- At 3848c87d, writer, mobile form, WebKit formulation and DS2 nested visual workflows PASS; full build/browser/artifact workflow #41249830807 IN PROGRESS at time of note. Real iPhone visual acceptance NOT TESTED. PR draft/unmerged, main da585ab3, live v0.9.20-beta unchanged.


## 2026-10-31 — Stash UI candidate automated acceptance PASS, NOT RELEASED
- Exact application source 3848c87d, five GitHub Actions workflows SUCCESS, full browser #41249830807, artifact #13060877682. New Vial kits/Other forms/Supplies tabs; tighter vial-kit cards; independent capsule/nasal/raw/topical compact rows; Vials-style compact compound combobox for all forms. Full LIVE ZIP 26 paths verified, standalone and offline full DEMO byte-equal HTML, fictional in-memory isolation. Source schema unchanged; no historical inventory or dose mutation, transfer gates OFF. PR draft/unmerged; live Cloudflare untouched. Physical iPhone Safari UX and VoiceOver acceptance NOT TESTED. Demo/UI user approval pending.

## 2026-10-31 — PR124 custom compound picker enhancement (UNRELEASED)
- Added visible create/use custom compound action for unmatched search in Vial kit and Other forms selectors; Vial options also include existing saved supply and formulation names. Existing kit records, physical source IDs, history and calculation routes unchanged. Selection itself does not save inventory. Compounds such as SLU-PP-332 can be added as a named inventory item without inventing built-in research metadata.
- Source commits 0b6f031b, d80e8111, db8a6a44; PR #124 remains draft, main da585ab3. Full suite current-head result, current-source LIVE/DEMO packages and physical iPhone acceptance: NOT YET VERIFIED. No production deployment, migration, or user-data access. Known cross-tab legacy writer P0 remains open separately.

## 2026-10-31 — Custom compound WebKit acceptance in progress (no physical iPhone assertion)
- Verified main da585ab3458394ddf5e88e283b210933beeab810 and draft PR124 starting 31690709. Existing current-start-head formulation WebKit, mobile forms, nested navigation and shared writer workflows SUCCESS; full build #41253018302 FAILED in tools/validate-stash-cards.mjs, locator('.nx-kit-browse-all') strict mode matched both Browse and newly added Add custom control. This is an actual test regression, not a Pass.
- Added targeted custom picker interactions in tools/validate-formulation-stock.mjs (77024d08), across 320/390 x light/dark x LIVE/isolated DEMO (eight intended sessions): type SLU-PP-332, click explicit Add custom in vial combobox, verify underlying selected kit name and no inventory saved merely on selection, cancel draft, open Other forms and click explicit Use custom. Retains existing capsule save and stock-preservation assertions. New targeted CI RESULT PENDING.
- Fixed distinct class names for Browse versus custom create in 07-nexus.js (beecb0d8) and 10-nexus.js (13071e84); preserved 44px touch styling in assets/css/nexus-hybrid-preview.css (212172b3). Five workflows triggered on 212172b3, results not yet independently verified.
- NOT TESTED: actual physical iPhone new custom picker flow, existing+custom duplicate comparison beyond case-insensitive matching, custom vial save and reopen, keyboard safe area/VoiceOver, real data. No merge, deployment, migration or production storage writes. Known mixed-tab writer P0 remains a separate blocker. NEXT: inspect 212172b3 targeted WebKit + full browser workflow and resolve any failures before requesting user iPhone acceptance.

## 2026-10-31 — Supplier-informed compound library expansion (DRAFT PR124)
- Main independently verified da585ab3458394ddf5e88e283b210933beeab810. On draft PR124 feature/dose-administration-method-20261029, added 53 curated catalogue records to assets/js/03-nexus.js; evaluated total catalogue 102 (49 baseline + 53 additions). Includes 14 bioregulators, SLU-PP-332 (non-peptide ERR agonist), investigational molecules, neuropeptides, hormone/biologic and modified peptide names. No existing LIBRARY entries overwritten and no production records/migrations touched.
- Source: user's Peptide_Supplier_Comparison_v7.xlsx (LISTS 248 product labels from multi-vendor price workbook, not proof of identity); Peptilogical homepage accessible but lacked readable catalogue content; independent research for SLU-PP-332, bioregulator sequences, P21/P021, N-Acetyl Epitalon, Brenipatide (Lilly pipeline) cited in docs/product/NEXUS_LIBRARY_EXPANSION_2026-10-31.md. 37 vendor-derived records have empty researchSources and marked sourceStatus pending independent compound-specific verification; do NOT call 53 research monographs fully verified.
- All new records have descriptive type/category and conservative evidence label and no dose, route, timing or reconstitution defaults. PEPTIDES tracker configuration unchanged; Stash, Today, plans, dose history and browser storage unchanged. No vendor SKU, blend, diluent, typo variants imported as canonical chemicals.
- Added tools/validate-library-expansion.mjs wired into .github/workflows/nexus-formulation-webkit.yml. First CI run #41253927043 FAILED because check expected 101 rather than verified 102 entries; test corrected at 880c271a. Earlier targeted Stash WebKit also FAILED on custom-add for SLU-PP-332, which is now curated; test changed to check known library match and fictional unknown-name custom add at 079c522d. Both are test-expectation changes; do not mark corrected exact-head CI Pass before it completes.
- Core changed commits include 68308465, 02e7fa2b, fec21c7c, 401c4518, 073bed1c, 880c271a, da1ca490, 079c522d. Source-level assertions and WebKit/full browser current-head runs PENDING. Physical iPhone acceptance, exact-head full-app LIVE ZIP, isolated complete DEMO and primary deployment unverified. No merge/deploy approved. Previously documented PR124 cross-tab writer P0 remains release blocker.
- NEXT ONE ACTION: verify exact-head WebKit catalogue + custom-picker test and full app browser QA; fix failures, inspect source-matched demo/live artifacts; request physical iPhone check after demo is verified.

## 2026-10-31 — CORRECTED custom picker WebKit PASS at application commit 079c522d
- GitHub workflow #41254050361 completed SUCCESS on 079c522dff70d69cf3341806e70c8fa9016390d2 (after adding 53 library entries and correcting test to check known SLU-PP-332 vs unknown fictional custom name). Existing tools/validate-formulation-stock.mjs executes 320/390 x light/dark x LIVE/isolated DEMO; targeted custom vial and Other forms picker selections are covered. This is automated WebKit iPhone viewport emulation, NOT actual iPhone acceptance.
- Earlier WebKit #41253972543 at 880c271a FAILED because it wrongly expected the newly curated SLU-PP-332 to prompt custom addition; catalogue static validation in that run itself PASSED 102 records. Corrected 079c522d run supersedes that test-expectation failure for application behaviour.
- Latest docs-only PR head after successful application test remains draft/unmerged, no deploy. Full browser #41254050365 IN PROGRESS at last check. Current-head LIVE ZIP and complete isolated DEMO not independently validated; actual iPhone/VoiceOver NOT TESTED. Cross-tab whole-state inventory writer P0 remains open separately. NEXT ONE ACTION: verify complete full browser QA and source-matched artifact, then physical iPhone custom kit save/reopen and library browse acceptance.

## 2026-10-31 — ATX-304 added; SLU-PP-519 identity not verified
- Verified main da585ab3458394ddf5e88e283b210933beeab810 and draft PR124; ATX-304 (formerly O304) not previously catalogued, added as one new investigational non-peptide small-molecule entry in assets/js/03-nexus.js at d30fb1bf with developer and primary-literature source links. No auto dose, route, preparation, frequency, assumptions about vial vs capsule, inventory conversion or tracking side effects. 49 baseline + 54 proposed additions = 103 library entries.
- Explicit aliases O304, O-304, ATX304 embedded as non-canonical metadata; these are not separate rows.
- User also requested 'SLU-PP-519'; exact designation NOT independently verified after targeted searches. Published research uses SLU-PP-332 and SLU-PP-915 (distinct agonists); do not silently conflate 519 with 915. Pending name confirmation or exact supplier label; existing user-created custom name remains possible. No 519 scientific claims entered.
- Sources ATX-304: https://www.cambrianbio.com/pipeline and https://pubmed.ncbi.nlm.nih.gov/29925691/ . SLU-PP-915 evidence e.g. https://pubmed.ncbi.nlm.nih.gov/41421047/ .
- Test update at 33c4d766: expect 103, assert ATX-304 and O304 alias, reject inclusion of unverified SLU-PP-519. Exact-head WebKit/full-browser results, downloadable full-app demo/LIVE ZIP and physical iPhone acceptance NOT VERIFIED. PR draft/unmerged; no production writes or deployment. Existing inventory writer P0 remains separately unresolved.
- NEXT ONE ACTION: verify corrected library test + targeted WebKit workflow at code head; then clarify SLU-PP-519 designation with the actual product label if needed.

## 2026-10-31 — User-confirmed SLU-PP-519 exact designation; identity remains unverified
- User unequivocally confirmed spelling SLU-PP-519, not SLU-PP-915. Public exact-string research searches did not verify independent chemical structure, registry or peer-reviewed compound-specific research. Do NOT silently map it to SLU-PP-915, SLU-PP-332, ERR agonist class, peptide category, or vendor product.
- Added one independent searchable **provisional** record in assets/js/03-nexus.js (b528c600): name SLU-PP-519, category Identity unverified, identityVerified false, researchSources empty, sourceStatus requiring proof. No mechanism, benefits, clinical claims, dose, route, vial/reconstitution or schedule defaults. State and saved data untouched. New proposed catalogue total: 104 entries (49 baseline + 54 prior additions + 1 provisional user designation).
- Strengthened tools/validate-library-expansion.mjs at 5768394a to verify 104 unique names and SLU-PP-519 nonconflation, missing identity verification, empty source references/defaults. Exact-head CI not yet verified; full-app LIVE ZIP and isolated FULL DEMO, actual iPhone acceptance NOT VERIFIED. Branch PR124 draft/unmerged/undeployed, inventory writer P0 remains unresolved.
- NEXT ONE ACTION: verify exact-head catalogue and iPhone-sized WebKit CI; inspect full-browser artifact before requesting user physical iPhone testing.

## 2026-10-31 — User corrected designation to SLU-PP-915; provisional 519 superseded
- User explicitly clarified previous SLU-PP-519 designation: correct name is **SLU-PP-915**. Verified primary animal/cell publication PubMed PMID 41421047 (2026 JPET) and independent analytical/metabolic study PMID 41588687. This is a chemically distinct pan-ERR small molecule, not a peptide and not the same record as SLU-PP-332. Oral activity was observed in mice, NOT validated for human dosing.
- Draft PR #124 code f75abc72 replaces the provisional static SLU-PP-519 catalogue record with single SLU-PP-915 research record (aliases SLU-915, SLU915), without changing localStorage, existing custom-user entries, PEPTIDES tracking settings, inventory, routes or calculations. No dose, frequency, preparation or protocol defaults. Static catalogue remains 104 total records if previous 104-entry baseline remained unchanged (count must be validated by CI).
- Test 836d147e updated tools/validate-library-expansion.mjs to require 915 and research source, reject superseded provisional 519 and ensure 332 distinct. Exact-head WebKit/full browser CI and matching LIVE/DEMO artifacts remain NOT VERIFIED; physical iPhone NOT TESTED; PR draft/unmerged, production unchanged. Existing cross-tab writer P0 remains unresolved.
- NEXT ONE ACTION: verify corrected WebKit catalogue assertions and source-matched artifact before any physical device acceptance; do not merge/deploy without explicit approval.

## 2026-10-31 — Stash collapsed card structural reduction (DRAFT / candidate, not deployed)
- User's real iPhone screenshot: KLOW card remained very tall after prior font-size compression. Approved requested hierarchy is collapsed identity / remaining inventory / next action, not merely smaller typography. Protected card detail workflows remain available.
- Verified main da585ab3458394ddf5e88e283b210933beeab810 and PR124 baseline 1d2c878e (draft, unmerged); five workflows on 1d2c878e completed SUCCESS, including full browser #41257218343, WebKit #41257218211, mobile #41257218253, writer #41257218316 and nested #41257218205. This proves PRE-REDESIGN baseline, not the new card.
- Implemented assets/js/10-nexus.js 2185e4c0: collapsed kit card now renders one inline identity/status with management control, brief vial-count/strength, remaining open-vial or total stored mg, small inline urgency cue and ONE relevant primary action plus Details. Unresolved open-vial method makes Set up vial primary; Open new vial stays inside expanded detail section. Existing Use setup and full Overview/Vials/History remain inside expanded details; original handlers, IDs, vials, calculations, dose histories and storage unchanged.
- assets/css/nexus-hybrid-preview.css 37e65754: removes nested collapsed visual boxes and space, retains prominent 26px balance and 44px controls at 320px/390px, focus, themes. tools/validate-stash-cards.mjs 981f7319: asserts actual collapsed card height <255px, in-width geometry, controls >=44px, legible title and expanded Use setup across eight fictional LIVE/DEMO x 320/390 x light/dark sessions.
- First full QA #41258079351 FAILED in tools/validate-trust-ui.mjs line224 because old sealed-kit label assertion expected CURRENT OPEN VIAL; accurate new sealed view now AVAILABLE STOCK. Updated test at 8eb7b791 to allow OPEN VIAL / AVAILABLE STOCK while preserving standard/blend parity. New exact-code run build #41258211331, WebKit #41258211357, mobile #41258211329, nested #41258211564 IN PROGRESS at last check, writer #41258211443 SUCCESS. Not yet accepted or released.
- Full-app LIVE/isolated DEMO generated and file list validated by build step on 8eb7b791 but FINAL exact-source downloadable artifacts, full QA result, settled iPhone screenshots and personal physical iPhone acceptance NOT VERIFIED. No merge, deploy or production data changes. Existing PR124 mixed legacy writer P0 remains a separate release blocker.
- NEXT ONE ACTION: inspect 8eb7b791 full browser and target card-height results; correct any failure, then inspect exact-source artifact and request physical iPhone acceptance.

## 2026-10-31 — Measured Stash card-height regression and second structural revision
- Verified starting PR/main: main da585ab3458394ddf5e88e283b210933beeab810, draft PR124. Baseline pre-card five CI workflow runs at 1d2c878e SUCCESS (full #41257218343, WebKit #41257218211, mobile #41257218253, writer #41257218316, nested #41257218205).
- First compact implementation 2185e4c0 with CSS 37e65754; expanded setup/stock/history preserved. First measured full browser #41258211331 FAILED: tools/validate-stash-cards.mjs at 320px reports collapsed standard kit height **277.578125px** (>255px acceptance threshold), width 296 within 320 viewport, both actions 44px, title 15px, expanded Use setup found. Important: this is a real failed geometry assertion. Original earlier #41258079351 FAILED obsolete unopened label; test fixed 8eb7b791.
- The 277.6px failure prompted additional structural reduction at ed826206: remove collapsed method-warning text, expiry/shot estimate and prepared-quantity rows; move nonessential details into expanded panel. Primary action still Set up vial for unresolved method; full kit/vial action access retained. Light mode nested panel and primary CTA specificity fixed d23c8ca2, secondary detail typography e4e29354. Geometry assertion now logs exact observed height for 8 configurations and rejects nested background.
- WebKit #41258211357 on prior 8eb7b791 SUCCESS; nested #41258211564 SUCCESS; writer #41258211443 SUCCESS. These DO NOT validate final e4e29354 styling or new height. At last check final code e4e29354 workflows #41258715620 full QA QUEUED, #41258715562 WebKit IN PROGRESS, #41258715595 mobile IN PROGRESS, #41258715606 shared writer IN PROGRESS, #41258715541 nested IN PROGRESS. Latest final-source full release artifacts and physical iPhone test NOT VERIFIED. PR remains draft/unmerged; no deploy, data migration or production browser storage modifications.
- NEXT ONE ACTION: inspect measured 320/390 card height in e4e29354 full-browser QA; only if Pass verify complete LIVE/isolated DEMO artifact and request iPhone acceptance. Do not merge/deploy without explicit approval. Existing cross-tab writer P0 remains a release blocker.


## 2026-11-01 — PR124 development-only storage writer gate correction (no release)
- Draft branch commits 10f7cd638983b45e931ef10bcc00a013dd121a08 (repair line-comment regex syntax in exclusive writer gate), 5e6b5a258b07c4fcc8863abd7d7aa161e32de068 (replace obsolete saveLegacy-based mixed-writer failure diagnostic with exclusive contention/stale/fresh-retry safety assertions). Prior e323d8f1 Chromium job SUCCESS but full and writer CI FAILED at syntax gate.
- Source schema/data unchanged; no migration or production writes; nasal preparation gates remain OFF. Exact-head CI, LIVE ZIP, FULL-APP DEMO, physical iPhone testing, merge and deployment all PENDING/NOT TESTED. Release version unchanged (documented production v0.9.20-beta); P0 remains BLOCKING.


## 2026-11-01 — Additional development-only safety correction, no release
- 3ce0e793 fixes outdated DEMO save acknowledgement assertion; 3ce0e793 shared-writer #41280418868 and mobile #41280418877 SUCCESS. a3bc6c15 guards startup inventory migration against unacknowledged save; exact-head full QA and artifact pending. No destructive data operation, schema change, merge or deployment. Current production version unchanged; release P0 BLOCKING.


## 2026-11-01 — PR124 QA fixture follow-up (development only)
- Test-only commit 0eda5bcd6f41baab129530abafc000a365d7c413 adds missing activityLogs array to fictional Chromium two-tab bulk-health delete fixture; no application code or data schema change. Previous a3bc6c15 full CI FAILED on test fixture, while its writer/mobile/DS2/WebKit passed and artifact #13072478870 integrity/source manifest were inspected. Current exact-head full QA and artifact pending; no release bump, merge, deployment or real data modification. Nasal gates OFF, P0 blocking.


## 2026-11-01 — PR124 full QA diagnostic, development only
- Test-only commits 930d77c9 (initial render wait), 32233c14 (immediate modal probe), 13ff65da (persist fictional LIVE fixture via exclusive writer), 22df3072 (trace modal removal). Full browser #41281222118, #41281738778, #41281825163 FAILED on Check-In search input disappearance, although prior storage/stock suites passed and focused writer/mobile/DS2/WebKit at 13ff65da succeeded. No application code change since a3bc6c15; no schema migration or real data writes. Latest diagnostic pending. P0 blocking; no release/merge/deploy.


## 2026-11-01 — PR124 test-only Check-In date correction (no release)
- 49018ee2 fixes false editor expectation in tools/validate-checkin.mjs by specifying fictional date 2032-11-10; no application source or data schema changes. CI and exact-source artifact qualification pending. P0 release blocker open, draft PR #124, nasal gates OFF; not merged or deployed.


## 2026-11-01 — QA-only Check-In instrumentation and WebKit geometry tolerance
- 49018ee2 adds explicit fictional Check-In date but full CI #41283705756 still FAILED at second search. 33b67722 captures second modal state; 526300aa allows 0.01px floating rounding on a designed 44px WebKit capsule close target. No app CSS/JS behaviour or production data changed by these commits; P0 release blocking, draft PR #124, nasal gates OFF, exact-head artifact pending; no merge/deploy.


## 2026-11-01 — PR124 test ordering correction, not a release
- 77a759aff589a6636e9becd7bfb315199722e220 ensures fictional supplement Save is fully acknowledged/closed before browser test opens the next Check-In sheet. Previous 33b67722 full #41284103097 FAIL at second search despite valid initial DOM; 526300aa corrected WebKit fractional pixel assertion. Test-only commits, no production app JS/CSS/data change, no merge/deploy, nasal gates OFF, P0 blocking pending exact-head CI.


## 2026-11-01 — Test-only durable inline supplement acknowledgement
- Commit 861b9d84 adds awaited exclusive writer readback for fictional inline Check-In supplement Add and fixture reset, resolving unsequenced test actions after prior 77a759af full #41284493052 FAIL. No application code or schema change, no production data write, no release. Latest full/browser and WebKit pending, P0 blocking; draft PR #124, nasal gates OFF.


## 2026-11-01 — PR124 browser harness acknowledged Check-In saves (test-only)
- 0aaed043597ea50d08995cc2f23e903fe95ae18c awaits post-save sheet dismissal after successful Check-In creates/edits; prior 861b9d84 full QA #41284836788 FAIL due premature Edit sheet opening while prior save still closing. Application code/data schema untouched; exact-head CI pending, nasal gates OFF, draft unmerged/undeployed, P0 blocked.


## 2026-11-01 — PR124 Protocol/Today QA fixture migration; no release
- 57a483233459ba0c87ccbe3c15c16e56acc5a0b5 adjusts only tools/validate-protocol-design.mjs to initialize fictional LIVE fixture under Web Lock after app boot. Check-In eight LIVE/DEMO browser combinations passed in prior failed overall run #41285215207, which stopped at Protocol QA stale fixture. No application change or data migration, no merge/deploy, P0 release blocked pending exact-source CI and artefact certification.


## 2026-11-01 — Draft PR124 Protocol/Today test-only correction
- 39e504d94e3b342ccf8cbf0bf057ca598245a863 fixes premature browser check for async Today tracking preference, verifies durable exclusive writer result. No product JS/CSS, schema change, deployment or release; full QA and exact-source artifact acceptance pending. P0 BLOCKING, nasal gates OFF, draft PR #124.


## 2026-11-01 — PR124 scoped writer & Protocol/Today fixture follow-up (development only)
- Code e8213af1: scoped setting writer compares persistent fields to its expected durable snapshot (ignoring root _transient only), then commits the requested setting under exclusive Web Lock and verified readback; preserves UI-only fields. Prevents false setting rejection due purely transient render data without allowing stale or unsaved stock overwrite. Test 71db3f9b exposed fictional uncommitted lazy vial metadata, and test aca48a79 boot-normalizes/persists fictional legacy starter kits prior to Protocol/Today QA. Exact-head CI pending; no release, schema migration, deployment or production data writes; P0 blocking and nasal preparation gates OFF.


## 2026-11-01 — PR124 Stash attachment browser-test repair (no release)
- Test-only commit 74f798b1 fixes Stash action test to save fictional LIVE fixture and wait for exclusive blend Save acknowledgement/durable attached PDF readback and Kit Details re-render. Previous aca48a79 full QA passed Protocol/Today and many prior suites but overall FAILED on stale immediate Kit Details attachment assertion. Product JS still e8213af1. Current exact-source full QA/artifacts pending; PR remains draft and unmerged; primary production unchanged; P0 release BLOCKING.


## 2026-11-01 — PR124 goal tap-target correction, not a release
- Stash attachment accepted in browser #41325584431, but full QA failed later on legacy Plans View goal touch target. CSS source commit cdffdab2 increases target to 48px; test diagnostic 741865f6 preserves minimum 44px safety assertion. Exact-head full QA / artifact certification pending. No merge/deploy; production untouched, nasal gates OFF, P0 blocking.


## 2026-11-01 — PR124 Plans Goals QA Save acknowledgment (no release)
- Test-only a2e0321 fixes premature reopening of Goals wizard before preceding async Save completion, and commits fictional LIVE Plans fixture through exclusive writer. Previous #41326571439 full failed later in Plans though source CTA 48px touch assertion cleared; all four focused suites PASS. No new application code beyond prior 48px CSS and scoped writer change, no release/merge/deploy. P0 blocking and exact-source artifacts still unqualified.


## 2026-11-01 — PR124 Goal wizard QA correction, not a release
- Commit 2457a657 updates only tools/validate-plans-hierarchy.mjs for unstable/detached rapid Playwright Goal Continue actions; retains actual onclick execution and assertions. Previous full #41326571439 FAILED despite substantial preceding browser PASS. Full/physical iPhone and exact-head artifact qualifications pending; no live deployment or production data writes; nasal gates OFF, P0 blocking.


## 2026-11-01 — PR124 CI-qualified development candidate, NOT RELEASED
- Source/test commit 2457a657 (Plans Goal wizard stepwise test), preceding CSS cdffdab2 (48px View goal action), app JS e8213af1 (exclusive scoped settings persistent-vs-transient state), previous Stash test 74f798b1 and Protocol fixture aca48a79. All five GitHub workflows SUCCESS: #41327745230 full Chromium, #41327745323 writer, #41327745251 mobile, #41327745216 DS2, #41327745218 WebKit. Artifact #13092541470 verified 26-file exact-source LIVE + full isolated offline DEMO + manifest; v0.9.20-beta is internal build version only, not a new published release. No user data/schema destructive change or production deploy. Unmerged draft PR124; physical iPhone/VoiceOver NOT TESTED, release publication/version notes pending, P0 BLOCKING, nasal gates OFF.

## 2026-11-02 — PR #124 16-point browser evidence verified, NOT RELEASED
- No version promotion; v0.9.20-beta candidate source 653a7f78, main baseline da585ab3, draft PR #124 unmerged and undeployed. Test harness repair b4bd969c resolves prior Chromium ReferenceError; no new runtime UI/data change in this correction.
- Chromium/build #41400223943 PASS 8/8 Log Dose including #15 font family/size/weight/theme-colour computed assertions and all 8 expanded-panel screenshots. WebKit #41400223773 PASS. Mobile/nested/scoped writer #41400223658/#41400223790/#41400223736 PASS.
- Manifest exact source 653a7f78; chromium artifact #13121900154 484 entries CRC PASS, 26-source-file LIVE ZIP CRC PASS, complete 3,076,903-byte ephemeral isolated DEMO and offline ZIP CRC PASS. WebKit artifact #13120714805 264 entries CRC PASS. 256 selected dual-engine visual observations in-bounds; representative 320 screenshots inspected.
- No user-data writes, destructive migration, changes to clinical calculations or production release. 16-point physical acceptance NOT TESTED, legacy/Goal broad coverage incomplete, mixed legacy writer P0 release gate BLOCKING and nasal LIVE flags OFF. No merge/deploy or physical acceptance. See design/PR124_16_POINT_UI_SCORECARD.md.

## 2026-11-02 — PR124 engineering closeout candidate 7b66191d, NOT RELEASED
- Displayed version v0.9.20-beta unchanged; main da585ab3, PR #124 draft/unmerged/undeployed, primary Cloudflare production not altered. Code 4a7a9355 adds rejected optimistic legacy save rollback; test source fa5277a0 / 7b66191d includes actual two-tab stale/failed-write safety assertions plus cross-engine Goal Details screen/keyboard coverage. No schema/data migration, no clinical calculator or original stock/historical rewrite, no user/production data writes.
- Exact source 7b66191d five workflow groups SUCCESS: Chromium/build #41405000968, WebKit #41405001103, mobile #41405001050, nested #41405000996, writer #41405001163. Chromium artifact #13123581821 524 entries CRC; 26-file root LIVE ZIP exact manifest 7b66191d; 3,077,472-byte isolated full-app DEMO and byte-equal offline ZIP. WebKit artifact #13122918246 296 entries CRC; 32 new Goal screenshots. P0 mixed-writer engineering now RESOLVED IN DRAFT BRANCH; two nasal LIVE flags OFF, physical iPhone/VoiceOver untested, merge/deploy not authorized. Single user UAT playbook prepared.

## 2026-11-02 — PR124 corrective draft after real-device DEMO rejection; NOT RELEASED
- User Edge iPhone screenshots identify failed DEMO nasal prep confirmation ("Unique new nasal container required") and inconsistent Stash legacy Vial Setup typography. This is failed physical acceptance for affected flows and supersedes any previous blanket visual PASS.
- Coded on draft branch: 9676046c safe new/legacy formulationStocks initialization; bf6aaed4 error specificity; a7d58b68 source-checked destination ID generation; 3967d800 and bfb6c618 DS2 shared header/title geometry; 68e15b45 new shape/preservation regression. No destructive migration or changes to existing valid stock arrays, saved history or calculated deductions. Do not imply nasal administration approved.
- Exact-source CI/artifact/physical re-test **PENDING** at documentation time; no release promotion, merge or Cloudflare deployment. Main da585ab3, v0.9.20-beta candidate, PR #124 DRAFT, P0 release BLOCKING, two nasal LIVE flags OFF.

## 2026-11-02 — PR124 Goal typography refinement, CI failed predecessor; NOT RELEASED
- Source-only Goal Overview hierarchy CSS 47c4894e: modest 15px section headings, 13px detail, 12px subdued guidance and lightweight section dividers, retains data and controls. Source-only QA correction 0657a259 resolves a wrong font/size assertion at 23px Stash title. Predecessor eda83573 Chromium #41491503562 and WebKit #41491503765 failed (3/5 workflows passed). Full current five workflows/ZIP/screenshots pending. No version change, migration, merge, deployment or nasal LIVE enablement; user physical Goal screenshot remains UAT FAIL, release P0 BLOCKING.

## 2026-11-02 — PR124 compact Stash and Log Dose visual-restoration QA, NOT RELEASED
- Candidate remains v0.9.20-beta, exact source 6aa89c009caecb898e8086d1566f75689c6c5d6b, main da585ab3, PR #124 draft/unmerged, no production deployment. Restored traditional mixed-form OPEN VIAL remaining/capacity bar, regular status, single secondary nasal line and detailed separate-source balances; added mid-abdomen site options and display-only removal of route suffix, simplified optional dose typography. No existing saved data rewritten, schema reset, clinical arithmetic altered or LIVE nasal gates enabled. Historical site strings preserved.
- Exact five-workflow Chromium/WebKit/mobile/nested/writer success #41498659381/#41498659384/#41498659226/#41498659617/#41498659437. Artifact #13167988571 540 files outer CRC valid, 26-source LIVE ZIP CRC valid, 3,093,558-byte isolated full-app DEMO and matching offline HTML. WebKit artifact #13166574820 312 CRC PASS. Prior e0da9d6c Chromium harness selector failure fixed before this successful source; no physical acceptance. P0 BLOCKING, nasal LIVE gates OFF, no merge/deploy.
