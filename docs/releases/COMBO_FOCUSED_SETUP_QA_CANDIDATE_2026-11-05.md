# Nexus PR135 — Focused Combo Dose Setup (unreleased QA candidate)

**Date:** 2026-11-05  
**Version in source:** v0.9.24-beta (no new version tagged)  
**Main baseline:** 21b9e42a213f74e3e372266a9fb65c12a9c731da  
**Qualified app source:** 0520415df4da9c24a5156899226e5d8fec51ec25  
**PR:** https://github.com/Deidrajw/Peptide-Tracker/pull/135  
**Status:** CODED / targeted Chromium QA PASSED / PR DRAFT / UNMERGED / UNDEPLOYED / real iPhone NOT ACCEPTED.

## Changes and scope
- Combo header simplified; lavender DS2 grouping controls replace native browser-blue radio; retained Select → Setup → Review.
- Setup shows a single active compound with distinctive title, 44px indexed navigation and dose completion count, avoiding six expanded forms at once.
- Consistent SVG control/disclosure chevrons, unavailable source state and exact-vial-only preparation details.
- Same engine for mixed syringe (shared site) and separate injections (individual sites).
- Real QA found and fixed incorrect conversion for preferred mcg units when a typed amount was stored before its displayed unit. Preserve mass in mg↔mcg switching, history native string, and strict vial stock preflight.
- Offline FULL DEMO remains self-contained and fictional with system font fallback; separate online-font QA FULL DEMO allows network loading of approved DM Sans, Fraunces and DM Mono and displays loaded-face status. Network-font PASS not yet independently verified.

## QA evidence
- Pinned stable Playwright 1.64.1 GitHub Actions #42094294724 SUCCESS at app source 0520415d. Combo picker fictional 8/8 LIVE/DEMO, 320/390px, light/dark PASS; vial safety, formulation stock and Check-In tests passed. Initial pinned #42094053764 failed custom mcg unit conversion, then corrected and re-tested successfully.
- Exact-source downloadable artifact #13447181982 CRC checked: 322 outer entries; 26-file LIVE ZIP; standalone FULL DEMO; 2-file offline DEMO ZIP; online-font QA HTML.
- Local isolated Chromium six-compound focused setup across 8 cases PASS (earlier dfe54a8b source), and custom-preferred mcg 300→0.3mg→300 4/4 PASS (0520415d).
- **Not qualified:** five normal workflows failed package installation (npm ETARGET Playwright-core@1.65.0); need to pin and re-run without weakening existing protections. Real iPhone Safari, VoiceOver, Dynamic Type, online loaded font faces and independent clinical calculator certification not tested.

## Data / safety impact
- No user data overwrite, storage migration or production writes. Existing localStorage key, inventories, dose records, histories, check-ins, protocols and prepared-dose controls are protected.
- Live nasal safety gates remain OFF.
- Separate production stale-release-notes gate remains unresolved; no merge/deploy authorization.

## One next action
Restore and independently verify the five original CI workflows using a published stable Playwright version, then test actual online fonts and physical iPhone acceptance before requesting distinct merge/deployment approval.
