# Nexus — Privacy, permissions and data-flow audit (initial source pass)
Date: 2026-10-25. Baseline main 888d746ce0b4488aa4c0eba0fe83110cd019f746.
Status: INVENTORY / RISK REVIEW ONLY. Privacy wording, store declarations, production network activity and native wrapper behavior are NOT yet certified.

## Confirmed in source
- Browser storage: `assets/js/01-nexus.js` uses `peptide-tracker-html-v1` and `localStorage` to load/save serialized `state`. Backup/export/import, pre-upgrade backup and demo-isolation paths exist. Clearing browser data can remove user records. Browser storage is not encrypted by this app's localStorage code. Do not claim automatic cross-device sync.
- Categories user can store include compound names, dose amounts/history, dates, Check-Ins (symptoms, intensity, mood and notes), weights, nutrition and supplements, goals/protocols, kit/vial inventory, profile photo/name and settings. This data can be health-sensitive even where Nexus is marketed as personal record keeping.
- Optional notification permission: `enableReminders()` in `assets/js/11-nexus.js` invokes `Notification.requestPermission()` when enabled. This is not a requirement of onboarding; add a just-in-time rationale and fallback before enabling in native app.
- Optional API-key field: `state.settings.nexusApiKey` in `assets/js/03-nexus.js`, referenced in 06 and editable in 12; it is saved via localStorage. Never imply that localStorage is an appropriate hardened secret vault or that all future AI processing stays on-device. Verify whether API calls actually occur from active paths before publishing claims.
- Research content `assets/js/08-nexus.js` has external study hyperlinks to NEJM/PubMed. Those visits leave the app if activated and are governed by external destinations.
- No verified app-level analytics or ad trackers identified from the limited string scan of 12 JS modules; this does NOT prove zero network transfers or rule out deployment/CDN logs, CSS/font fetches or future SDKs.

## Store requirements and references
- Apple App Store Connect requires a publicly accessible privacy policy URL and App Privacy disclosures, accounting for embedded third parties: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
- Google Play requires Data safety responses and a privacy policy linked in Play Console and in app: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
- Exact submissions depend on final wrapper, network paths, SDKs, account creation, cloud features and external processors. Never choose 'no collection' just because records use localStorage.

## Draft product information architecture (NOT IMPLEMENTED)
- More → Settings → Privacy & Data: concise 'On this device' / 'Backups & restore' / 'Notifications' / 'External services' / 'Delete my local data' / 'Read full privacy policy'. User data deletion must require backup reminder and double confirmation; no destructive behavior without explicit approval.
- Welcome: concise truthful text: 'Your entries are saved in this browser on this device. They are not automatically synced. Export a backup to keep a copy.'
- First use of reminders: explain requested permission and what happens when denied; user can opt out.
- File/photos: describe user-initiated selection; avoid suggesting uploads without confirming any transmission behavior.
- Public privacy policy: what is recorded, where it resides, security limitations, optional network processing, retention/deletion, external links, contact/support and changes; validate with legal/product owner before App Store submission.

## Release gate
1. Inventory all network requests on the production GitHub Pages and Cloudflare hosts, including fonts, external APIs, CDN, analytics, SW requests; document provider, data sent, triggers and retention.
2. Audit native iOS/Android wrapper configuration, permissions and third-party SDK manifests before composing actual store labels.
3. Implement accessible in-app Privacy & Data and reviewed public policy URL, with no unverified assertions and no changes to core saved-state key.
4. Test permission denied/granted, backup/export, deletion and any external service toggles at 320/390 both themes and physical iPhone.
5. Generate updates from canonical release manifest with accurate privacyChanged / permissionsChanged flags, update continuity, full LIVE and standalone full DEMO, PR/CI/merge and independently verified deployment.

## Blockers and next action
v0.9.17-beta Getting Started correction is ongoing in separate PR #89 (not part of this design audit); calculator PR #67 held. Public host parity and complete network audit unverified.
**One next action: inspect actual network behavior in Cloudflare/GitHub Pages and map every outbound request before drafting final privacy disclosures.**
