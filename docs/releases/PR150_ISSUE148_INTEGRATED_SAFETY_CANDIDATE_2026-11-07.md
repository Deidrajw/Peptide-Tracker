# PR150 — Issue #148 integrated safety candidate (NOT RELEASED)

**Version:** v0.9.25-beta.1 internal build label only; **release status:** DRAFT, unmerged, undeployed.

## Scope
- Base: user-accepted PR146 search clear, injection syringe capacity recovery and independent read-only theoretical nasal calculator (no dose persistence).
- Writer: integrated PR142 changes to exclusive backed-dose save, transient UI vs canonical durable state, error classification, dismissible storage warnings, paused-dose/history visibility and related safety checks.
- Nasal preflight: integrated PR149 early no-save warning and separate failure messages. Preserves NEXUS_PREPARED_NASAL_ADMINISTRATION_ENABLED=false.
- Combined workflow tests across original PR146, PR142, PR149 with source-level fictional unit tests, real-browser test harnesses and two-tab prepared engine tests.

## Screens and flows
Today, Calendar history, Log Dose, Check-In supplements, Stash, calculator, search inputs, prepared nasal entry warning. Existing kit source attribution and historical records must not be rewritten.

## Data impact
No schema migration, storage reset, production data access, writes, import or sync during development. Existing storage key peptide-tracker-html-v1 preserved. Theoretical calculator remains read-only. LIVE nasal administration stays disabled; no new actual spray history or bottle debit/Undo functionality released.

## Verification and limitations
At authorship, combined exact-head six-suite CI and artifacts pending. Previous individual PR149 six-suite success is not proof of combined PR150 passing. Physical iPhone Safari, VoiceOver, Dynamic Type and independent calculation safety qualification NOT TESTED on integration. No claim that LIVE nasal logging exists or that clinical dose calculations are validated.

## Gates before merge or deploy
Full exact-head six-suite CI PASS, source-matched 26-file LIVE and complete isolated offline DEMO, explicit cross-tab and actual application-handler nasal debit/undo history safety, product/physical UAT and separate user authorisation. Never flip LIVE nasal gate on a partial candidate.
