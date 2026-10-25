# Nexus — iOS / Android Store Readiness (source audit)

**Candidate:** v0.9.18-beta, PR #94. **Status:** NOT STORE-READY; no native package submitted. **Evidence:** GitHub source read 2026-10-24; Apple/Google official policy references below. This is a technical inventory, not legal or regulatory clearance.

## Current browser architecture and data handling
- Current app: root index.html, three CSS stylesheets and ordered 01–12 JavaScript modules. Browser-local state key `peptide-tracker-html-v1` from `assets/js/01-nexus.js`.
- `saveState()` writes directly to localStorage; no account/cross-device sync in current build. Browser data loss remains possible. A pre-upgrade browser snapshot is attempted once; manually initiated restores now preview counts, require typed RESTORE and attempt a local recovery key before replacing data.
- Notification permission: requested only when Dose Alerts is enabled through `enableReminders()`. No background push when browser is closed; Protocol Phase Alerts are in-app.
- Apple Health: manual file import, not native HealthKit permission in web build.
- Current CSS contains an external Google Fonts import; opening the hosted website requires network access to the host and static assets. Source audit did not identify a direct network `fetch()` in the 12 application JS modules, but this is **not proof** of zero data collection by the host, browser, fonts or future native SDKs. Do not make categorical store declarations.
- In-app Settings → Privacy & Data explains browser-local storage, manual backups, permissions, external web resources and limitations. This is a transparency screen, not a complete public privacy policy or a verified third-party data processor inventory.

## Blocking store requirements
1. **Apple dosage calculator rule (critical):** Apple guideline 1.4.2 specifically restricts drug dosage calculators to approved organizations or those receiving appropriate clearance. Renaming a calculator to a measurement tool does not establish an exemption. Obtain qualified policy/regulatory review before presenting this functionality for App Store approval. Distinguish conversions, volume visualizations and individualized dosing behavior; do not hide functionality from review.
2. **Apple completeness and health features:** App Review guideline 1.4.1 scrutinizes inaccurate medical information and measurements. A polished standalone web interface is not automatically a sufficient native iOS app. Verify iOS wrapper, offline behavior, app icons, Info.plist permission strings, safe-area/keyboard, VoiceOver, launch stability, health disclosures and complete final metadata. Beta-only submissions should use TestFlight; App Store distribution requires release-quality builds.
3. **Privacy policy URL:** Apple guideline 5.1.1 and Google Play policies require accessible, accurate disclosures. Publish a reviewed public privacy policy with retention, deletion, hosting/third-party details and contact channel before store submission. In-app text alone is not a substitute for a public URL.
4. **Google Play Health Apps declaration and Data Safety:** Complete the policy forms based on the **actual Android binary and SDK data flows**, including permissions, health data, retention and third parties. Any web app wrapper/analytics must be included in the audit.
5. **Native QA:** Test actual iPhone and Android devices, screen readers, OS notification permissions, file picker/export, browser-to-native data migration choices and loss prevention. Define migration/transfer protocol and obtain user approval before any rewrite of `peptide-tracker-html-v1` state.
6. **Publishing:** Confirm Cloudflare build ID, deployed commit, version and asset parity. An Actions green job or GitHub merge is not independent proof of Cloudflare deployment.
7. **App metadata:** Prepare iOS/Android descriptions, screenshots with fictional data, content/age rating, review notes, support and privacy URLs, icon/splash assets, accessibility and testing instructions. Canonical `release/release.json` already generates synchronized in-app/Apple/Google What's New content, gated on verified publication.

## Engineering mitigations in v0.9.18-beta candidate
- Calculator suppresses a result for zero/negative/nonfinite fields, dose exceeding vial contents, invalid syringe size, volume exceeding syringe capacity, too-small displayed values and generic IU conversion. The numeric formula is a unit conversion, **not** clinical validation or permission to calculate patient-specific doses.
- Backup restore now previews incoming counts, requires explicit typed RESTORE and attempts recovery copy and rollback. Validate quota/failure behavior in browser and on a real phone.
- Onboarding safe first-run and outline quick-action hierarchy are preserved from v0.9.16–v0.9.17; introduction still explains browser-local storage and Restore Backup.
- New permission/Privacy & Data content is present. Release status in manifest remains `unverified` until host evidence is obtained.

## Source/reference links
- Apple Review Guidelines (1.4.1, 1.4.2, 2.1, 2.2, 5.1.1): https://developer.apple.com/app-store/review/guidelines/
- Apple App Review tips: https://developer.apple.com/app-store/review/
- Google Play Health Content and Services: https://support.google.com/googleplay/android-developer/answer/16679511
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469

## Next acceptance gate
Complete candidate browser CI, inspect remote Pages checker evidence, assess calculator and backup edge cases on a physical iPhone, then merge and verify Cloudflare before updating `publication.status`. Store submissions remain blocked on the policy/privacy/native work above.
