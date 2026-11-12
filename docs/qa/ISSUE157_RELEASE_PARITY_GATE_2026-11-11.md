# Nexus Issue #157 — exact-byte Cloudflare release parity gate (UNRELEASED)
Date: 2026-11-11

## Current checked baseline
- Repo: Deidrajw/Peptide-Tracker. Verified main 1c6007fce7ea25a68ec29f480f3b4d6ede46477c.
- Parent PR156 head 0c5536b1bc3a3867afa5ad2668c835e10cd3e4fa (draft, unmerged).
- Child PR158 head before this documentation update 3433bd8660cde47c2f46d9fa0b958e68c67f9b1c (draft stacked on PR156, unmerged).
- Final application source dcc59f989d8c69ea1a18cf9135196b9b5631ce0b; official six GitHub CI workflows PASS at docs-only 2c0d5f925ced20be4b0a633dbf2c54aa03a78e07; synthetic math diagnostic 80/80; user-reported iPhone functional QA 8/8.
- User explicitly authorizes ordered release conditional on final safety checks and independent Cloudflare deployment/source parity; STOP on any blocker.

## Verified public reachability vs unavailable byte parity
- TinyFish read-only browser automation run 258feffc-bdb7-467f-a51a-5294eb9e5aeb returned HTTP 200 on 16 files: root index.html, assets/css/{nexus.css,nexus-disclosures.css,nexus-contrast.css}, ordered assets/js/01-nexus.js through 12-nexus.js.
- TinyFish run explicitly returned "hash": "unavailable" on all because JS fetch / crypto.subtle was inaccessible; therefore 16/16 HTTP 200 is NOT a 16/16 exact-source pass.
- Historical GitHub CI premerge parity checker targeted synthetic merge 12a899c3 (candidate, NOT current production main), and its CSS mismatch merely indicated that unreleased candidate CSS was not yet deployed. It did not demonstrate incorrect production CSS.
- No production edit, merge or deployment has occurred.

## Exact verification procedure
1. Before any PR merge, perform a **read-only** exact-byte verification of all 16 required primary-host URLs against checked-out CURRENT DEPLOYED GitHub source (currently main at 1c6007fc), not an undeployed PR or synthetic merge. Use tools/verify-pages.py in the corresponding checkout against https://nexuspeplog.pages.dev/. Generate a timestamped JSON showing expected commit, served URL, HTTP status, SHA-256 and byte lengths of all 16, overall verified=true. Confirm the verifier itself passes its local smoke test separately.
2. If current main vs production fails, investigate Cloudflare build/source/caching before changing main; retain the release hold. If the website can be read only via rendered-content extraction, record availability but **do not** claim raw-byte parity.
3. Reverify both PR heads, base SHA, existing storage migration safeguards, flags and all six source-specific CI workflow conclusions. Merge parent PR156 first ONLY when requirements pass and approval is still applicable. Record actual resulting main SHA. Reverify Cloudflare primary production serves the exact PR156 merged commit across all 16 files before proceeding to child.
4. Reconcile PR158's stacked base after the parent merge, preserve the unchanged approved app source, rerun required checks if integration source changed, then merge PR158. Record actual merged main SHA; independently repeat complete 16-file raw-byte Cloudflare comparison against that SHA. GitHub Pages is secondary and cannot replace primary verification.
5. If ANY required gate fails (especially cross-tab inventory writer, dose math, exact date boundaries, production byte parity), halt and report the exact error. Do not silently change production data, localStorage or feature flags. Do not call a completed GitHub merge a deployed release.
6. Only when the final production bytes match and documented QA is accepted update RELEASE_HISTORY/PROJECT_STATE/REGRESSION, mark release as deployed and return URLs and evidence. Physical VoiceOver/Dynamic Type and independent clinical certification remain distinct from the functional iPhone 8/8 and deterministic math 80/80; do not label untested checks as Pass.

## Implementation mechanics
- The existing verifier at tools/verify-pages.py compares raw bytes with cache-busting and Cache-Control:no-cache, returns non-zero on mismatch, and writes JSON evidence. Its --smoke option is a localhost self-test, NOT proof of Cloudflare.
- Running the verifier from a PR checkout against existing production can *correctly fail* because candidate files are not deployed yet. That failure must not be described as live production drift.
- No connected tool in this session can initiate a standalone GitHub Actions workflow dispatch; TinyFish provides reachability checks but could not compute file hashes. Until a trustworthy runner can execute the existing verifier against CURRENT main and postmerge commits, exact source parity is BLOCKED.

Status: PROCEDURE DOCUMENTED; verification still BLOCKED, PRs unmerged, production unchanged.
