# PR160 → PR162 release integration gate — 2026-11-12

## Verified checkpoints
- Main baseline: b4c83c06ccf447bd88ba4c45d788c41eed2f32d4 (currently declared v0.9.26-beta.1).
- Separate unmerged draft PR160: 006dc03a7ca425e59632b5ff9d5b3b88ce9f52ee. Six GitHub workflows at this commit SUCCESS: pinned Chromium 43151780393, WebKit 43151780575, mobile 43151780436, shared writer 43151780486, DS2 nested 43151780471, full build/parity 43151780433.
- Separate unmerged draft PR162: source/test 18f7aff4d450f60f84c167bf91266bec110cb464, documentation-only later head 8f70a424 at initial check. Six GitHub workflows at source/test commit SUCCESS: pinned Chromium 43260376362, WebKit 43260376507, mobile 43260376656, writer 43260376676, DS2 nested 43260376616, full build/parity 43260376683.
- Official PR162 final artifact 13964481242 downloaded and independently verified: outer ZIP 573/573 CRC PASS; nested LIVE ZIP 26/26 CRC PASS; JS10 exact Git blob c00cdd5217306bfa2b44c404e892857df9d7446d; standalone full-app DEMO bytes equal offline DEMO ZIP index; build manifest source_commit 18f7aff4. Official 320/390 light/dark browser QA step in run 43260376683 SUCCESS. This is a pre-merge candidate, NOT primary Cloudflare production parity.
- PR162 patched source latest changes: exclude zero-balance OPEN/ACTIVE vials from expiry aggregation and prefer usable OPEN/ACTIVE vial for kit status; source-level fictional regression PASS and GitHub six-suite PASS. User-reported prior 2/2 Stash physical iPhone acceptance was of earlier PR162 app source before latest patch; physical iPhone patched source NOT TESTED. Four protocol/Calendar passes were from older candidate; do not claim same SHA 6/6 physical pass.

## Source dependency review
- PR160/PR162 JS09 identical (blob 6f4e6ff4). PR160 JS10 e5048337 differs from PR162 patched JS10 c00cdd52 (extended per-vial expiry/reminders and depleted-open fix). PR160 lacks PR162 protocol changes JS03/04/07 and other PR162 additions; independently merging drafts without reconciliation could regress expiry handling. Both draft histories diverge.
- PR160-first ordered strategy is a RECOMMENDATION, not authorization. Once expressly approved: qualify PR160 exact-source release; user approves PR160 merge/deploy; verify post-merge primary Cloudflare exact-byte parity; integrate PR162 with the new main WITHOUT overwriting newer PR162 JS10 semantics; verify final JS blob diffs, six CI suites and official full-app artifacts; ask separate approval for PR162 merge/deploy; verify post-merge Cloudflare exact bytes.
- If a consolidated release is preferred, user must explicitly authorize superseding PR160 and document that it is retired/unmerged; full merged package and same deploy gates still required. Do not silently close PR160, rebase, or merge.
- Do not modify production localStorage, personal history, vial IDs, ledger, dose records, kits or inventory. No destructive migration.

## Outstanding before deploying
1. Explicit approval for release order/merge; the user's “next” is NOT merge/deploy approval.
2. Retest/accept latest PR162 patched full-app DEMO on a physical iPhone for the changed Stash expiry/status path, or explicitly document that device test remains unaccepted.
3. Final cross-PR integration must be prepared only after approval to alter branch ancestry, and full exact-source QA must be rerun against final integration source.
4. Recheck primary Cloudflare deployed SHA/assets independently after each approved merge; GitHub CI success is not proof of Cloudflare deployment.

## Current status
Automated QA gate PASSED individually for both draft PR source commits. Artifact integrity PASSED for patched PR162. Integration NOT DONE. Real iPhone latest patched source NOT TESTED. PRs UNMERGED. No deployment. ONE NEXT ACTION: secure physical iPhone test of latest patched PR162 Stash expiry/status source, then request explicit decision on PR160-first vs consolidated release.
