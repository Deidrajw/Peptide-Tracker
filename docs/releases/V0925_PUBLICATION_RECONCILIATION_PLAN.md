# Nexus v0.9.25-beta.1 — Publication Metadata Reconciliation (draft plan)

Date: 2026-11-05. Status: PROPOSED, no application change or new deployment approval.

## Independently verified release evidence
- Approved PR #135 merged via squash fe51ace9bc9fd82ed78072038f335917e995562c.
- Canonical release application/source commit: 1eb093cb692a77f45528c4c03ba40c86c8bff68e, version v0.9.25-beta.1.
- Cloudflare primary live source/version parity SUCCESS: GitHub Actions #42132318807; same app source verified on docs-only latest main #42134136341.
- GitHub Pages deployment #42132317702 SUCCESS; Pages integrity #42132318774 SUCCESS.
- Post-release complete build/browser #42132318868 SUCCESS. Artifact #13464777105 independently downloaded: 549 outer ZIP entries CRC PASS, 26 member LIVE ZIP CRC PASS, ordered scripts, full fictional isolated DEMO and byte-equal offline demo. Eight browser states PASS.

## Current metadata inconsistency
- release/release.json publication.status is **unverified**, publishedAt and commit null; LIVE source and version have nevertheless been independently verified.
- release/generated/in-app.json and embedded assets/js/02-nexus.js correspond to the unverified marker by design.
- release/published-history.json lists older releases; tools/generate-release-notes.mjs explicitly disallows including active manifest.version among historical entries. Do not insert v0.9.25-beta.1 into this archive while it is the active manifest version.
- tools/check-release-readiness.mjs production guard rejects any changed app JS with the same release version. Directly changing generated 02-nexus.js to status published without an explicitly narrow, tested publication-only allowance would fail CI. Never bypass or loosen the general application-change/version gate.

## Proposed scoped next implementation
1. Use immutable Cloudflare evidence for v0.9.25-beta.1 and source commit 1eb093cb as the publication provenance. Record verified timestamp from the successful verification output; do not claim it equals the first moment the host deployed.
2. Implement an explicitly bounded publication-metadata-only release-readiness path: only the canonical manifest, generated release notes and the exact generated NEXUS_RELEASE marker in 02-nexus.js may change; verify all other 02 JS bytes unchanged; ensure same version/notes/data-impact and checked provenance, reject any general app-source modifications.
3. Extend self-tests: valid verified transition PASS; unverified provenance, stale/incorrect source commit, changed normal JS, title or dosing logic, version mismatch, missing publishedAt, duplicated current release in history all FAIL.
4. Generate in-app/Apple/Google release outputs from the canonical manifest with generator --check, rerun full exact-head Chromium/WebKit/mobile/writer/nested and full build; independently inspect candidate artifacts and ensure LIVE nasal gates OFF.
5. Keep this change as a separate DRAFT PR until explicit approval; successful publication metadata should not imply clinical certification or physical VoiceOver acceptance. Only after an approved merge and Cloudflare exact-commit parity may documentation say the publication marker is reconciled.

## Safety and scope
- No change to production localStorage key peptide-tracker-html-v1, user data, inventory, dose calculations, historical log records, prepared transfers, or LIVE nasal flags.
- No new product features, layout redesign, or font-binary distribution.
- Current production release is deployed and source/version verified. This draft merely describes the remaining publication metadata task.

## Next action
Implement the narrowly verified publication-only readiness gate and regression cases on this release-maintenance branch, without merging or deploying until explicitly approved.
