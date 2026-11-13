# Nexus PR160 / PR162 source reconciliation and safe release gate — November 12, 2026

## Verified baseline
- Main: b4c83c06ccf447bd88ba4c45d788c41eed2f32d4 (declared v0.9.26-beta.1); PR160 head 006dc03a7ca425e59632b5ff9d5b3b88ce9f52ee; PR162 review baseline c6e8502864e484b6809e28c29f4e5eeee49f7520. Both drafts unmerged and undeployed.
- Prior GitHub compare PR160→PR162: diverged ahead 40, behind 16. Counts describe divergent commit history, NOT missing functionality.
- Source blob checks: JS09 is identical on PR160 and PR162 (6f4e6ff4); JS11 (ed65e58f), JS12 (babab702) also identical across main and both. JS03/04/06/07/08 unchanged main→PR160, modified only by PR162. JS10 differs in all three: main 727881b8, PR160 e5048337, PR162 f20c4c90.

## Exact JS10 changes that PR162 adds beyond PR160
1. Stash card expiry timestamp derives from shared stashExpiryMs() rather than a separate current-vial calculation. It uses Number.isFinite() to detect absence of expiry.
2. computeKitStatus() uses Number.isFinite()/Math.ceil() instead of a sentinel/millisecond rounding.
3. stashExpiryMs() reads all open/active vial-specific reconDate and expiryDays with kit-level fallback (28 days if missing), returns the earliest valid date or Infinity. PR160 handled only the single selected active vial and a 9999999999999 sentinel.
4. Expiry reminders iterate open/active vials with remaining material >0, assign vial-specific reminder IDs, and do not infer active-vial age from a historical kit reconDate. PR160 still used kit-level dates for reminders.

No changes to saved vial IDs, existing historical dose records, or migration are authorized. The PR162 code is a superset of PR160's intended UI fixes, but NOT a commit descendant of PR160. Avoid independent blind merging; overlap must be resolved.

## Acceptance evidence
- Prior official corrected full-app candidate app source 9ec970f8: six GitHub workflows PASS; artifact #13915889162 independently ZIP/source-verified; targeted actual-browser 320/390 dark/light Stash displays PASS; fictional next Vial 3 UI transaction PASS. These tests predate this documentation-only commit and are not automatically new-head CI.
- Physical iPhone user reports: older candidate 76402b84 four protocol/Calendar functional PASS; corrected isolated full-app Stash fixture two PASS (Deadpool numbering, Retatrutide Kit 2 expiry). Do not portray as 6/6 tests of a single exact build. No physical VoiceOver/Dynamic Type or persistent reload acceptance.

## Remaining QA risk
- For an open/active vial with reconDate but zero material remaining, stashExpiryMs() currently includes its date while expiry reminder filtering requires remainingMg > 0. This difference could produce a stale card expiry without a reminder. Treat as a **new edge case to test and reconcile** rather than asserting a demonstrated regression. Additional risk: multiple open vials with different dates, and legacy missing reconDate/expiryDays. Do not change calculations until focused tests establish expected behaviour.
- Verify that no duplicate expiry reminder or phantom label appears after a routine vial finish/open event, and that next-vial identity survives actual persistent transaction on an isolated storage harness; ephemeral DEMO cannot prove reload persistence.

## Recommended safe release strategy — proposal only
1. Maintain both draft PRs. Keep PR160's Stash work recognizably separate; do not discard or silently squash without consent.
2. Perform focused end-to-end browser tests for zero-remaining open vial, two open vials differing expiry, and next-vial persisted identity, using fictional isolated storage. If defect proven, apply a targeted patch on a development branch and rerun source-specific QA.
3. Reconcile dependencies deliberately: preferred if separate releases are desired is **PR160 first, then integrate/rebase PR162 onto the exact post-PR160 main**, ensuring JS09/JS10 retain the later agreed fixes and no duplicate code; review final diff and rerun all six CI suites and full-app packaging. Alternative only with explicit approval: a single consolidated PR162 release that includes PR160 functionality, then retire PR160 explicitly without merging it.
4. Require explicit user approval before any merge/deployment. Verify resulting Cloudflare exact-byte parity, no data migration, and physical iPhone requirements on exact release candidate. Do not infer deployment from merge.

## State
Source reconciliation review complete; edge-case QA and release branch integration **NOT DONE**; no merge or deployment authorization; PR160 remains independently open. Next one action: run isolated zero-remaining open-vial expiry regression, then settle release sequencing with user approval when ready.
