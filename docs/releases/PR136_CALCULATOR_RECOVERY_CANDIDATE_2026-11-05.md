# PR136 calculator recovery candidate — NOT RELEASED

## Source
- Base main at branch creation: cbd84c93b7fe0a79c9216e1ecc20948d167d42c4; latest observed main a0482abc (subsequent documentation-only commits).
- Implementation: b2905eb8 syringe selector, 7be76b5c concentration hint target, 341467a3 preserve concentration during capacity-only error; expanded regression test 648d2404.
- Verified exact app JS Git blob: 87d82eba8d48b3dd857e2ece2890590705c70d09.
- Draft PR #136. No version bump, merge or deployment.

## Changes
- Syringe capacity choices are available above the error and conditional results so an oversized requested dose cannot trap users in an impossible workflow.
- The 1200 mg / 6 mL / 400 mg scenario displays 200.00 mg/mL concentration while previous 1 mL selection is rejected; changing to 3 mL permits 2.000 mL mathematical result without rewriting entered dose.
- Retained capacity safety: no syringe draw guidance rendered when > selected capacity; no mg/IU unsafe conversion enabled.
- Missing concentration hint ID corrected so concentration updates immediately as input changes without destroying focused inputs.

## Evidence
- CI at original app source b2905eb8: full Nexus build and parity QA #42134349679 SUCCESS; pinned Chromium #42134349676 SUCCESS; WebKit #42134349701 SUCCESS; writer #42134349692 SUCCESS; mobile #42134349658 SUCCESS; DS2 nested #42134349694 SUCCESS.
- That CI artifact #13465261560 was downloaded and verified: 549-entry outer archive CRC PASS, 26-member LIVE source ZIP CRC PASS, isolated full app DEMO present.
- From the exact original build source, applied the two newer JS source modifications locally, producing app JS with Git blob SHA exactly matching branch source 87d82eba. Generated a complete candidate LIVE ZIP (26 CRC PASS) and isolated standalone full-app DEMO with byte-identical offline ZIP index.
- Local actual Chromium browser tests on reconstructed current app via Playwright set_content with fictional full app, 320/390 x light/dark, 4/4 PASS, zero page errors: visible selector on 1mL overflow; 3mL reselect without dose change; 200mg/mL concentration; 600mg input updates to 100mg/mL and triggers 3mL over-capacity warning; 1200 restores 200; 1mL reselect restores warning while retaining selector.
- Does not establish latest branch exact-head CI PASS: the six GitHub checks were from prior app source. Does not establish real-device Safari, VoiceOver, Dynamic Type, downloaded webfonts or independent clinical calculator safety certification.

## Data and status
- Existing production records, localStorage key, Stash inventory, dosage history, administration and nasal gate settings unchanged. No migration.
- Read-only nasal spray calculator is separate proposed issue #138, NOT CODED, LIVE nasal administration gates remain OFF.
- Release status: CODED, locally browser tested, complete isolated candidate artifacts generated. DRAFT PR, NOT MERGED, NOT DEPLOYED, physical iPhone NOT ACCEPTED.
- Next action: rerun all checks at exact latest app source, inspect current source-matched GitHub build and physical iPhone, then request separate explicit merge/deploy approval.

## 2026-11-06 — Independent exact-source candidate qualification (not a release)
- Reconstructed 26-file LIVE candidate, isolated complete standalone FULL-APP DEMO and offline DEMO using earlier source-qualified artifact #13465261560 plus the two later calculator corrections. Git blob of assets/js/10-nexus.js independently matches current GitHub 87d82eba8d48b3dd857e2ece2890590705c70d09; 26 ZIP source members CRC PASS; DEMO/offline byte parity PASS; Node syntax PASS.
- Exact rebuilt fictional full-app Chromium interactive 320/390 × dark/light 4/4 PASS: 1200mg/6mL/400mg chosen 1mL fails closed with accessible syringe selector and concentration 200mg/mL; 3mL selection without dose re-entry yields mathematical 2.000mL and clears capacity warning; zero page errors. Earlier independently evaluated 22/22 finite/invalid/recovery guard assertions PASS.
- These are reconstructed-source browser/structural checks, NOT final exact-GitHub-head CI, real iPhone/VoiceOver or independently clinically certified dosing. Existing candidate source does not change stored data. CI attempted via branch push workflow edits 127fbe62 but no verifiable exact-head workflow result surfaced through the available PR-run lookup. Draft/unmerged/undeployed. Nasal LIVE OFF. No merge/deploy without user approval.
