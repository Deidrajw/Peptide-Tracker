# Nexus v0.9.19-beta — Premixed Blend & Protocol iPhone Corrections

**Status:** IMPLEMENTED IN PR #100 / NOT MERGED / NOT DEPLOYED. Source base main `2bf40535e2530b3c9d439504d52f3e8045f14fef`. Canonical manifest `release/release.json`: publication `unverified`.

## Fixes
- **Stash / Blend:** Add direct `Open first blend vial` action and kit menu action. Opening records BAC water (mL), recon date, expiry-after-reconstitution days and notes, moves one sealed vial to open and updates the blend kit without creating new constituent kits.
- **Blend lifecycle:** Finish current vial with an explicit confirmation and auditable remainder outflow. New draws are capped to the current open vial, **not the whole kit**; new blend ledger records reference the opened vial ID. Sealed backup inventory is preserved.
- **Today / Log Dose:** Premixed blend (for example Deadpool) appears as one selectable compound. A new draw records one blend dose and a matching kit ledger entry; it does not create new ingredient-specific dose entries. Blend-only ingredients are hidden from the picker, but independent ingredient tracking and all old records remain.
- **Stash presentation:** Correct component ratios (10 mg of a 30 mg vial = about 33%, not 3%), show BAC water, expiry and notes in blend details.
- **Protocol builder:** Normalized 44px phase increase/decrease buttons, consistent Dose/Rest segments, proper labels and box sizing for the Review name field. Target iPhone 320/390 widths and both themes.

## Data integrity
No automatic migration. Existing Check-In, Protocol, Stash, dose, backup, Journal and Calendar records remain untouched on upgrade. Old ingredient-level blend dose records are *not* rewritten or deleted; only new doses follow the corrected representation. An explicit user action is required to open or finish each vial. Vial-specific waste records and remaining-mass calculations protect inventory against overdrawing from unopened stock.

## Testing and limitations
Required GitHub Actions gates: JavaScript syntax, canonical version and generated notes, complete root-index LIVE ZIP and same-source fictional isolated full DEMO HTML/ZIP, browser matrix at 320px and 390px in light/dark, Check-In, Combo, Protocol, Stash and Log Dose regressions. New synthetic test covers open/date/BAC/expiry, dose-as-one, hidden blend-only ingredients, open-vial capacity, and finish/waste accounting. **Do not report Pass before the latest PR-head CI finishes.**

Physical iPhone keyboard behavior, VoiceOver, independent device usability acceptance and Cloudflare exact-source deployment are NOT TESTED for this candidate. Publication state must remain `unverified` until merge and remote byte parity confirmation. The previously published v0.9.18-beta is preserved.
