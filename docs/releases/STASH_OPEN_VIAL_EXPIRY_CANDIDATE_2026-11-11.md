# Nexus — Stash per-open-vial expiry candidate (UNRELEASED)
**Date:** 2026-11-11 · **Branch:** fix/stash-open-vial-expiry-20261111 · **PR:** #161 (draft)
**Main baseline:** b4c83c06ccf447bd88ba4c45d788c41eed2f32d4
**Version:** App still declares v0.9.26-beta.1. This candidate has **no new release version**.

## Fix
- Stash card expiry badge/detail/attention, Expiring filter and expiry sort use actual open/active per-vial reconstitution dates. An old kit.reconDate remains preserved as history and does not expire six sealed vials.
- Open/active vials with recorded recon dates and nonzero remaining material still generate per-vial reminders. Multiple opens use the earliest valid expiry for status.
- Amino supply context, expiry answers and Compound Intel reconstitution age no longer report a sealed-only kit as nearing reconstitution expiry.
- Expiry-days fallback remains vial.expiryDays then kit.expiryDays then 28; this is a *tracking setting*, not a clinically validated beyond-use date.

## Data impact
Read-only calculations; **no migration, no automatic correction/erase of kit.reconDate, no changes to saved dose history/allocations, vial statuses or balances.** No uploaded private backup or IDs stored in test fixtures. Manufacturer expiry of unopened stock is not known from a reconstitution date.

## QA evidence / release gate
- Focused fictional source-extracted Node regression in tests/stash-open-vial-expiry.test.cjs; GitHub workflow 43146454668 **SUCCESS** at initial PR head.
- Existing mobile forms workflow 43146454667 **SUCCESS** at initial PR head.
- Full exact-source existing checks, LIVE ZIP/isolated full-app DEMO, 320/390 light/dark, physical iPhone and VoiceOver remain **NOT VERIFIED** until evidence is collected.
- No production verification/deployment is claimed for branch. Prior production PR159 released; this PR is unmerged.

## Limitations and outstanding decisions
Expired genuine open vials still have 'Expiring' card status as existing design; no redesign. Calendar 320px accessibility is a separate documented priority. Release requires full QA and explicit approval; do not merge/deploy by implication.
