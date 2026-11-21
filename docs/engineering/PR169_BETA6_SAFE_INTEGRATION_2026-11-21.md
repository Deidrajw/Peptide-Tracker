# PR169 multi-source Log Dose — beta.6 safe integration plan

Date: 2026-11-21
State: DEVELOPMENT PREPARATION ONLY. Not an implemented or tested change. No merge or deployment approval.
Verified base: main 657ad6a8f1de534f337c74420bb5f45d89bc2e6a; Cloudflare published v0.9.27-beta.6 (PR173, merge 169cf617).
Historical source: draft PR169 head 2de7024a86225a66e2d249bc4529520c5632f876 based on b3a67ec48f5ba982abff042048e30a9549d83467.

## Why a fresh integration branch
GitHub comparison main...PR169 diverged 231 commits behind / 87 ahead. PR169 changes JS01 physical dose writer, JS05 dose UI, CSS and browser regressions. Blindly merging the old draft would risk replacing released per-vial BAC, Deadpool false-empty and no-write historical safeguards. This branch starts from current main; the old PR169 remains separate, unmerged.

## Approved experience to preserve
- Guided Dose details → Select vials → Review; exact physical-vial selection only when relevant, not a forced historical inventory audit
- Automatic single safe source selection when exactly one verified compatible open vial exists
- Show every selected exact source and current/projected balance, with shortage/allocation mismatch before final Confirm
- All-or-nothing multi-source save and Undo under the existing exclusive writer with durable readback; older records lacking exact Undo checkpoints fail closed
- Maintain single-source, Combo, prepared, blend, nasal-gate, untracked, edit and history flows

## Implementation order and gates
1. Compare modern main writer allocation and Undo transaction signatures against PR169 JS01 patch; port only additive checkpoint/atomic logic with current invariants and no stale-state overwrites.
2. Reconcile JS05 three-step UI with current DS2 and background-first Stash protections; avoid restoring unrelated old code or changing approved designs.
3. Bring focused tests onto this branch; create synthetic 3mg split (1+2), exact projected source balances, stale/missing/duplicate/incompatible/insufficient allocations, atomic Undo and negative no-write assertions. Verify no silent historic stock reconciliation.
4. Run complete current-head full-app browser Chromium/WebKit 320px/390px light/dark and cross-tab persistent writer tests, including Deadpool and BAC regression. Treat any failed calculator-safety assertion as release blocker.
5. Generate and verify standalone complete fictional full-app DEMO, offline demo, and separate exact-source LIVE ZIP. Get physical iPhone acceptance; update continuity and release notes.
6. Only after separate explicit release approval: version new candidate, final CI, PR, approved merge, independent primary Cloudflare parity.

## Current evidence and limitations
- Current beta.6 published; 16/16 Cloudflare main source parity succeeded. Last observed postpublication full-app QA #44879975536 IN PROGRESS; no final PASS claim.
- PR169 code and tests have NOT been ported into this branch.
- No source code or user data modified by this plan. Production storage key peptide-tracker-html-v1 preserved.
- No live nasal enablement, automatic historical correction, or PR169 merge/deploy authorized.

ONE NEXT ACTION: port and unit-test exact multi-source atomic writer logic from PR169 into current beta.6 JS01 without changing old records.
