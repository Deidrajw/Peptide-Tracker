# PR #135 — Combo Dose iPhone UX audit and proposed redesign (2026-11-05)

**Status: AUDITED / PROPOSED ONLY. No application implementation or approval for major UX restructuring.**
**Baseline:** verified latest qualified application 1dd305d9369c6121c012975012a48cfc7458aaab; branch PR #135, main baseline 21b9e42a213f74e3e372266a9fb65c12a9c731da. Physical-device screenshots supplied by the user on Nov 5. Prior exact-source automated CI passed, but that does not constitute visual acceptance.

## Confirmed screenshot/source issues
1. Modal kicker `LOGGING · COMBO` duplicates heading `Log Combo Dose`; header hierarchy is not DS2-consistent.
2. Browser-default radio selected blue, despite lavender DS2; inappropriate product selection appearance.
3. Mixed and separate variants produce inconsistent native picker chevrons/select appearances; native platform rendering is unstable in file-based iPhone preview.
4. Repeated rows of `COMPOUND · DOSE AMOUNT`, `UNIT`, `INVENTORY SOURCE`, per-compound site, and `View vial preparation` flatten hierarchy and become a very long scrolling form at 6 compounds.
5. Inventory source copy is long and visually compressed; the `No eligible open SubQ vial` option is rendered as a selectable-looking dropdown rather than a clear unavailable error/empty state.
6. `View vial preparation` has an unaligned Unicode down-chevron rather than the shared DS2 disclosure treatment; it should only be shown/enabled when an exact selected source has recorded preparation details.
7. Repeated borders, duplicated labels and native chevrons crowd 320/390 px; fixed bottom actions further reduce usable height.
8. **Font parity:** LIVE `assets/css/nexus.css` includes a Google Fonts @import for DM Sans / DM Mono / Fraunces; the standalone FULL DEMO HTML has the import removed and embeds no @font-face assets. It still declares `font-family: 'DM Sans'`, so browsers can render fallback text. Thus an offline/file-based demo does not prove approved typeface rendering. This is expected offline behaviour but must be explicitly labelled, while a network-served demo and computed loaded font-face checks must gate release. Do not bundle/distribute font files through chat artifacts.

## Proposed UX design (requires design preview acceptance before coding)
- Retain approved three-stage `Select → Setup → Review`. Present a plain-language `Combo dose` header with a small progress label; preserve DM Sans for form UI, Fraunces only for editorial headings, DM Mono for selected numerics.
- Select: two full-width lavender/neutral option rows or restrained segmented cards for `One mixed syringe` and `Separate injections`, with explicit selection state, not browser-default blue radios.
- Setup: one active compound at a time, indexed `Compound 2 of 6`, compound name prominent as its own heading, a compact tappable summary/list of completed compounds; Previous/Next preserve every draft value. For mixed, shared administration method/site outside individual panels, shown once; for separate, individual site within each compound panel only.
- Every compound uses identical, concise dose amount + mg/mcg unit, source row, and optional read-only vial information disclosure. Field controls use shared DS2 picker affordances; no Unicode/native arrow mismatch. Source may open a labelled bottom sheet for long source names with available balance, route and vial identity.
- Distinguish `No eligible vial` from `Untracked` with an explicit, safe status. Never imply selected physical vial when none exists. No hidden or invalid vial debit.
- Read-only `View vial preparation` only with exact vialId details; align label and trailing standard chevron to a 44–48px touch row.
- Review: grouped per-compound card summaries, compact source/site information, clear unsupported/shortage validation and one confirm action. No premature stock mutation.
- Support draft preservation, mg↔mcg mass equivalence, 1 mcg precision, stock shortage rejection, legacy histories, multiple vials, nasal LIVE flags OFF, prepared-dose delegation and disabled unsupported routes.
- Reuse approved DS2 surface, spacing, typography and icons; 320 and 390 px + light/dark + keyboard + dynamic type + VoiceOver review.

## New release gates
1. UI screenshot assertions with exact-source browser QA of full 2- and 6-compound mixed/separate variants at 320/390 dark/light; confirm scrolling, sticky footer and hierarchy.
2. Native vs custom picker visual parity and chevron alignment; selected grouping must use approved accent rather than OS-default blue.
3. A network-served preview must load DM Sans / Fraunces / DM Mono and inspect `document.fonts.check` (CSS declaration alone is insufficient). Offline demo is explicitly labelled fallback and must not be used to approve font rendering. Preserve no-live storage/sync writes.
4. End-to-end mass/unit, insufficient-stock, vialId-specific BAC history, separate injection sites, cross-tab writer and protected flows must run after UI changes. No calculator-safety certification inferred.
5. Physical iPhone Safari, larger text, VoiceOver and real keyboard scrolling remain **NOT TESTED** until user verification.
6. Maintain release-notes gate as a separate unresolved issue; no merge or deploy without explicit user approval.

**Next action:** preview and accept revised UI direction, then implement in PR #135 with exact-source tests and matching LIVE/DEMO artifacts. This audit is not a code fix or a deployment.
