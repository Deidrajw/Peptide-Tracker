# Nexus Design System 2.0 — Complete Surface Coverage Register
**Updated:** 2026-10-27 | **PR:** #123 DRAFT / UNMERGED | **Purpose:** track EVERY screen and subpage; no automatic completion from a passing test.

## Approved direction
Hybrid **Soft Depth + Porcelain + Obsidian precision**. Midnight-lavender dark theme, pearl/porcelain light theme, restrained depth, consistent outline icons, 44–48px targets, legible hierarchy, limited borders, coherent disclosure and sheet design. Do not mistake UI changes for data or clinical recommendations. Existing data/history/math must remain untouched.

## Status semantics
- USER OKAY FOR NOW: user explicitly accepts current appearance; no fresh redesign required. This does NOT certify every keyboard/accessibility case.
- OPEN DS2: requires full styling across screen AND child screens, with screenshots; NOT COMPLETE even if some CSS exists.
- CODED / NEEDS CHECK: selective changes present; real visual/functional acceptance outstanding.
- FINAL POLISH: intentionally last within current DS2 pass.

## Screen and subpage inventory (including hidden and modal surfaces)
| Area | Surfaces to account for | Current DS2 status |
|---|---|---|
| Today | Overview/hero, Today/Active/Completed/All, compound expanded cards, due/recorded, Coming up, Check-In summary, daily supplements, needs-attention, all entry sheets | USER OKAY FOR NOW except specific deferred physical/Record Reaction verification |
| Calendar | Month, Week/Block, Day, Logs Day View, All Logs, Add Log, dated details/edit | USER OKAY FOR NOW; prior Month icon issue deferred, NOT blocking next screen |
| Protocol / Plans | Protocol list, Overview, phase roadmap, schedule/phase details, compound detail, create/edit wizard, Research, Shopping, Goals, action sheets | USER OKAY FOR NOW; don't reopen cosmetic review without new issue |
| Stash kits | Kit cards, expanded Overview/Vials/History, open-vial details, kit/blend create/edit wizard, attachments/viewer, Manage, Inventory Resolution, source actions | OPEN targeted Overview/Vials/History rounded tab fix and Prepare Dose; other prior work user okay for now |
| Supplies | Empty/populated, Add/Edit, usage/restock/details | USER OKAY FOR NOW |
| Profile | Profile hub, edit profile/avatar, preferences/settings, supplement catalogue, backup/export/import, notifications, security/privacy, info/about where present | OPEN DS2 FULL SURFACE PASS; user explicitly says NOT upgraded comprehensively |
| Supplements | Profile catalogue, inline Check-In creation/search, daily logger, date-specific history, Add/Remove and empty results | OPEN final visual and iPhone verification; Notion importer should not reappear |
| Trends / Insights / Nexus | Every trend dashboard, graph, timeframe toggle, data detail, empty/loading states, filters, correlation/pattern explorers and drill-downs currently reachable | OPEN DS2 FULL SURFACE PASS; user explicitly says NOT upgraded |
| More | All section headers and child destinations: Learn, Discover, Intel, saved resources, release notes / What's New, data health/help/privacy, all existing settings | OPEN DS2 FULL SURFACE PASS; inventory routes in actual code before redesign |
| Log Dose / Reaction | Quick/Guided, source selection and review, draft, edit, reaction invitation, event history/edit/delete, Combo Dose, prepared doses | CODED / NEEDS PHYSICAL ACCEPTANCE, preserve vial math |
| Tracking tools | Weight, Nutrition, Check-In modal, symptom picker/associations, measurements, activity, schedule/history, relevant calculators | OPEN DS2 FULL SURFACE CHECK; preserve all existing content and records |
| Onboarding | Consent, welcome, optional tour, data restore, existing-user bypass protections | Separate PRODUCT ROADMAP work; never assume DS2 implementation constitutes store readiness |
| Global | App-wide tab bar, shared design tokens, type scale, icons, contrast, focus, VoiceOver, required/optional fields, nested scrolling, keyboard/safe areas, motion/reduced motion | FINAL POLISH LAST in current DS2 pass per user instruction |

## Priority order confirmed by user 2026-10-27
1. Correct Stash **Overview/Vials/History** pill corners (physical screenshot).
2. Complete design system across skipped subpages: Trends/Nexus/Insights; Profile + Settings + Supplements; all reachable More subsections, Learn/Intel and other unconverted pages. Audit navigation tree first, not just main tabs. Present screen-by-screen preview before major redesign.
3. Check remaining unconverted subpages and modal/actions for true DS2 parity. Treat existing user-accepted Calendar, Protocol/Plans, Supplies as stable and do not gratuitously redesign.
4. **LAST:** accessibility and type/required fields/global scrolling/navigation/motion consistency sweep, incl. VoiceOver. Keep a reminder for this explicitly.
5. Broader PRODUCT ROADMAP stays distinct and is not superseded by this DS2 sprint.

## Closure checklist for EACH surface
- [ ] Current source route and all child actions identified
- [ ] Proposed visual matches approved hybrid tokens, no stale green / square tab / raw IDs
- [ ] At 320px and 390px, light/dark screenshot and interaction QA recorded
- [ ] Real iPhone acceptance where relevant (separate from emulation)
- [ ] Saved-data/backup/history protections and workflow regression established
- [ ] Status, commit, CI artifact, preview SHA and user approval recorded in this register

## Next step
Map actual navigation destinations and mark each child surface by exact route + visual conversion status; implement remaining Profile/Trends/More and other skipped subpages on draft PR #123. Production merge/deploy requires separate user authorization.


## 2026-10-27 DS2 progress: CSS commit dfe4df01 adds Trends summaries/jump, Body Progress tabs, compound library, Pattern Explorer and Profile/Settings hero, subtabs, rows/icons responsive styling. CODED/NEEDS CHECK. Stash tab corner CSS fix present; latest automated result and physical iPhone acceptance still pending. Nexus/Insights/More, settings child pages, supplements and hidden sheets remain OPEN. Accepted Calendar/Plans/Supplies unchanged. Global a11y/type/scroll/navigation/motion LAST.
