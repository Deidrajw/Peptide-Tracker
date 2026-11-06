# PR #144 — Independent read-only nasal calculator — development candidate, November 6, 2026

**Status:** Coded, local numerical/browser qualified; exact-head GitHub Actions CI NOT VERIFIED, no physical iPhone/VoiceOver, draft/unmerged/undeployed. Production v0.9.25-beta.1 unchanged; nasal LIVE administration OFF.

**Feature:** On More → Dose Calculator, Injection/Nasal spray mode tabs. Nasal mode requests explicit total compound mass (mg or mcg), confirmed FINAL solution volume (mL), and measured/calibrated pump volume per actuation (mL). Outputs theoretical concentration mg/mL, theoretical mcg per actuation, conservative floor of maximum theoretical actuations; no IU inference or dosing recommendation. Transient variables only, no inventory deduction, administration log, historical record or localStorage writes.

**Source:** Branch feature/read-only-nasal-calculator-issue138-20261106 targeting PR136; assets/js/10-nexus.js Git blob 07da1f2c6b36da107383344b61caeb670c2169e1 independently matched to reconstructed exact GitHub application source. Current branch contains development-only CI workflow adjustment 4715dfbb.

**Automated evidence:** Independent 23/23 pure numerical/invalid-input cases PASS. Reconstructed exact-source 26-file LIVE candidate ZIP CRC PASS, complete isolated fictional standalone FULL-APP DEMO and offline byte parity PASS. Actual Chromium on full-app DEMO × 320/390 × light/dark 4/4 PASS for initial empty state, 5mg/5mL/0.1mL theoretical result (1mg/mL, 100mcg, 50 theoretical actuations), invalid pump 6mL fail-closed, 5000mcg mass-equivalence and zero app-state changes. Additional actual app route Injection ↔ Nasal full-app 4/4 PASS with no modifications to app state. No physical device or pump output calibration tested.

**Data impact:** None. Read-only calculations; no new persisted schema, no writes, no transfer/prepared source operations. Preserve existing injection calculator, exact-vial safeguards, backups and disabled LIVE nasal administration. No unsafe recommendation or clinical certification.

**Limitations and gating:** Final source-head GitHub CI and WebKit/mobile/writer/nested qualification not confirmed; source packages rebuilt from verified prior artifact + byte-exact changed JS, not official current PR144 workflow output. Device priming/residual loss/stability/actual delivered spray volume vary. Physical iPhone/VoiceOver/Dynamic Type NOT TESTED, per user preference defer until independently executable sprint tasks complete. No merge/deployment without separate approval.

**Next:** Obtain/exercise exact-head CI, confirm WebKit/mobile accessibility and package parity before guided iPhone acceptance.
