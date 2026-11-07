# PR150 — Integrated P0 writer and prepared nasal handler QA (NOT RELEASED)

**Version:** v0.9.25-beta.1 internal source build; no new published version. **Source SHA:** fc74181c91d68377ccac293a668ceb084ea4bda2. **PR:** #150, DRAFT, unmerged and undeployed.

## Changes and user experience
- Preserve approved PR146 search-clear controls, injectable syringe-capacity recovery and theoretical read-only nasal calculator.
- Integrate PR142 persisted-canonical writer reliability and classification.
- Preserve PR149 clear, early LIVE nasal warning instead of inviting a guaranteed-unsavable entry. The production source flag remains OFF.
- Correct the actual prepared nasal save/Undo handler to use the shared writer's canonical last verified snapshot and ignore only transient root _UI fields; fail closed on any unsaved persistent-field mismatch, stale tab or write failure.
- Add real-function Node VM and real Chromium two-tab application-handler regression, using fictional browser fixture and temporary script-only test activation; does not enable real users.

## Protected screens / data
Today, Calendar history, Check-In, Combo, Stash, Protocol/Plans, existing vials, prepared bottle ledgers, supplies, weight/nutrition and recorded histories. No data migration/import, deletion, production storage access or change to localStorage key `peptide-tracker-html-v1`.

## Exact-source verification
All six GitHub workflows passed: build/browser/parity #42348955146, pinned Chromium #42348955375, WebKit #42348955148, mobile #42348955254, writer #42348955246, DS2 #42348955167. Artifact #13564694441: manifest fc74181c, 549-member outer CRC PASS, 26-file root LIVE ZIP CRC PASS with ordered 01–12 scripts and gate OFF, full standalone isolated DEMO HTML equals offline ZIP HTML byte-for-byte, 8/8 320/390 light/dark browser matrix PASS. Local Chromium replay attempt blocked by container policy, not counted.

## Limitations and release state
No active LIVE prepared nasal dose saving in deployed app; test fixture gate ON is not production enablement. Clinical spray delivery, physical iPhone Safari, VoiceOver and Dynamic Type acceptance not tested. No merge, Cloudflare deployment or live source-parity certification of PR150 (draft Cloudflare parity expected false). Separate user approval required for merge/deploy, separate safety/product decision for enabling LIVE flag.

**Next:** Physical iPhone DEMO acceptance and explicit release decision, without undoing approved UI or existing data.

