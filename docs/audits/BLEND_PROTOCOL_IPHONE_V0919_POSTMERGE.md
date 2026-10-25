# Nexus v0.9.19-beta — physical-iPhone issue follow-up and deployment gate

## Evidence
- Baseline production previously verified: v0.9.18-beta at main `2bf40535e2530b3c9d439504d52f3e8045f14fef`.
- User-provided iPhone screenshots show: Deadpool blend Stash missing open-vial action/metadata, separate constituent names leaking into Today dose choices, wrong composition percentage (10 mg reported 3% rather than 33% of 30 mg vial), Protocol Review name field clipping, Phase steppers distorted and Dose/Rest labels undersized.
- Implementation PR #100 merged to main `955c904860b39c5c56472b07cd3521828d5d9d79`, manifest `v0.9.19-beta` publication `unverified`. User data unchanged by release code; old ingredient-level dose histories preserved.

## Source inspection after merge
- `assets/js/10-nexus.js`: visible `openblendvial` button for unopened blend with sealed stock; component percent divides by `s.vialMg` (per vial), not aggregate kit mg.
- `assets/js/03-nexus.js`: `openBlendVialModal` asks BAC mL, recon expiry days, recon date and notes; updates selected sealed vial and kit. `logBlendDoseModal` logs a single dose under blend name and records a matching vial-sourced inventory transaction, rejecting overdraw.
- `assets/js/04-nexus.js`: Today dose picker includes blend kit name and excludes legacy blend constituents unless separately tracked or independently dosed; Manage Kit menu has blend-open/finish/restock.
- `assets/js/11-nexus.js` and `assets/css/nexus-contrast.css`: Review name input box sizing, 44px phase +/- targets and 44px Dose/Rest segments.
- Previous generated docs in `docs/continuity` remain historical until post-merge QA and host deployment are verified.

## Regression and release gate
- PR #100 candidate automated release workflow 40161722598 **PASS** and mobile-form workflow 40161722564 **PASS** for PR source `494a7475`; full LIVE + standalone fictional isolated DEMO packages generated in Actions artifact 12586547731.
- This verification-only branch triggers a **new** Cloudflare comparison from merged v0.9.19 app bytes. The PR remote verification step is nonblocking: inspect `dist/Nexus_CLOUDFLARE_PARITY.json` for `verified:true` and all 16 source files before claiming deployment.
- Do not mark v0.9.19 published unless merged source and Cloudflare match. Keep v0.9.18 backup/data history unchanged and confirm no live writes from demos. Real iPhone acceptance must be observed on the actual phone; headless browser QA does not replace it.

## ONE CONCRETE NEXT ACTION
Run the merged-source Cloudflare parity and 8-mode LIVE/full-DEMO browser matrix, inspect artifact, correct any failures, then publish release status only after proof; request a fresh real-iPhone screenshot of the same Deadpool and Protocol screens for final acceptance.
