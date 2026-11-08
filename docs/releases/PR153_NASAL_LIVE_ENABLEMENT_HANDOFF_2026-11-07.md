# NEXUS — CONTINUITY HANDOFF: LIVE NASAL ENABLEMENT (NOV 7, 2026)

**Main:** a0482abc42060ad4b31108538a207bf983df90d7. **Draft PR153:** https://github.com/Deidrajw/Peptide-Tracker/pull/153. **Branch:** release/nasal-live-enablement-candidate-20261107. **Candidate code/test SHA before docs:** 974f7187c9854ae77b05efed0668b639480c96ad. **Release:** NOT MERGED, NOT DEPLOYED.

## User intent
User is tired of blocked LIVE spray logging; explicitly said GO on development and requests continuity note due to timeouts. User loaded a real backup into isolated DEMO, logged nasal doses and observed bottle deduction. This is useful UI acceptance but not production storage acceptance. Do NOT ask user to repeat it. Do not re-import demo export to LIVE.

## Completed
PR150 previously reconciled PR142 exclusive backed-dose writer, PR146 iPhone-accepted search/injection/nasal calculator UI and PR149 gated warning; six workflows PASS at fc74181c. New PR153 is based on PR150, sets NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED=true in assets/js/04-nexus.js; does not touch recorded-preparation gate, generic transfer OFF or production data. Updated tests: tests/nasal-app-handler-writer.test.cjs, tools/validate-nasal-app-handler-browser.mjs (NO TEST-ONLY INTERCEPT, tests actual ON source), tools/validate-nasal-live-preflight-ui.mjs, tools/validate-storage-writers.mjs, tools/validate-cross-tab-lock.mjs and tests/nasal-live-exclusive-pipeline.test.cjs. Earlier CI failed because tests demanded OFF, these were corrected while retaining safety invariants.

## Next exact task
Retrieve CI at latest PR153 exact-head 974f7187 and resolve failures; inspect complete official artifacts, LIVE source paths/CSS/ordered JS/manifest and full isolated DEMO, run focused two-tab prepared bottle save/Undo + history cross tab. Check preserve existing data, storage key peptide-tracker-html-v1 and no hidden overwrite; check primary production only after separately approved merge/deploy. Update four continuity docs and provide downloads.

## Mandatory status
Candidate flag ON only on UNMERGED branch; deployed production still OFF. No merge/deploy approved or performed. UI testing on real iPhone for new ON branch and VoiceOver still not done. No production records or backups committed. Require explicit release approval before merge/deploy.

**Copy forward:** Continue Nexus Issue #148 from main a0482abc, new draft PR153 branch release/nasal-live-enablement-candidate-20261107, candidate head 974f7187 (before docs). User authorized GO on enabling nasal LIVE candidate and already verified DEMO dose logging with real data lowered bottle. Source flag ON only in unmerged branch, production still OFF. Inspect exact-head six CI suites, resolve true failures, verify FULL-APP DEMO/LIVE ZIP, update docs, request separate merge/deploy approval. Preserve PR146 UI, localStorage and history.
