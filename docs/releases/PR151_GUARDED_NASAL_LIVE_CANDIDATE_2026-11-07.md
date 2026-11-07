# Nexus v0.9.26-beta — guarded LIVE nasal administration release candidate

**Date:** November 7, 2026  
**Status:** DRAFT PR #151, not merged, not deployed; primary production remains v0.9.25-beta.1.  
**Main baseline:** a0482abc42060ad4b31108538a207bf983df90d7.  
**Stack:** integrated PR #150 with writer PR #142, approved UI PR #146 and fail-closed preflight PR #149.

## User approval scope
User said **GO** in response to recommendation to prepare and test an enabled development version. This authorizes implementation and qualification, **not** an unapproved GitHub merge or production Cloudflare deployment. Scoped authorisation file release/nasal-live-candidate-authorization.json is not deployment permission.

## Changed behaviour
- Prepared nasal dose logging uses verified, exact prepared nasal bottle, a positive whole number of actuations, source-specific mg/spray and mL/spray, reviewed date/time and notes.
- Confirm & Save reaches the real LIVE handler only on this unmerged branch. Under shared Web Lock + optimistic compare-and-swap + verified storage readback, a successful operation records exactly one dose in history, debits exactly one bottle and appends a matching ledger event.
- Undo reverses that exact record and bottle debit. The original physical vial is not debited or recredited a second time.
- Reject stale competing tabs, insufficient stock, unverified formulation, duplicate transaction, unsupported units, failed storage and replay/second Undo. No success feedback until readback.
- Previously accepted iPhone single search clear, injection calculator recovery and theoretical read-only nasal calculator retained. Generic preparation transfer controls remain OFF.

## Screens and data impact
Today / Log Dose / prepared spray sheet / Review / Undo / Calendar recorded history / Stash prepared balance / Settings & backups. No destructive migration, reset, background sync or import. Preserve `peptide-tracker-html-v1`. **Only a user-confirmed successful LIVE administration creates a new dose and deducts prepared stock.** Failed/blocked operations must not update stored state or claim success. No change to existing records.

## Testing and release limitations
- Real DEMO with imported user records and decreasing fictional/demo bottle balance: user-reported PASS, but does not prove enabled production persistence or separate history check.
- New full-app candidate tests: actual enabled-source browser/Node handler, two-tab Web Lock stale rejection, exact bottle debit/history/Undo, no double physical vial deduction, quota/readback failures; old guardrails updated without waiving independent writer checks.
- Release-specific six-suite CI, exact-source artifacts and physical Safari/VoiceOver acceptance: **PENDING at note creation**. Treat any failed calculator assertion as a release blocker.
- Version is v0.9.26-beta; publishedAt and source commit are null because no deployment has occurred. The primary Cloudflare URL is not proof of this unmerged code.
- Medical calibration/stability/clinical suitability is not certified by Nexus; values are recorded from the user-verified bottle.
- Merge/deploy only with separate explicit user approval after evidence review.

**Next action:** Qualify exact-head CI and offline full-app DEMO/LIVE ZIP; remedy failed tests, update continuity, request release decision.
