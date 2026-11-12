# Nexus accessibility audit — primary navigation after Issue157
Date: 2026-11-11 (Toronto)
Baseline main: 8be7ef2ea9125d69d21a9b6d0a053f678c362d38, production version v0.9.26-beta.1.
Method: local Playwright Chromium set_content from the independently verified isolated full-app fictional DEMO from Issue157. No production URL, cookies, user backup, network or live writes. 5 primary routes (Today, Calendar, Plans, Stash, More) x viewport widths 320/390 x themes light/dark = 20 scripted samples; visible viewport height 740px. DOM/computed-style checks on visible button or role=button: accessible name by aria/title/innerText, minimum bounds 44x44, horizontal overflow, page JS exceptions. Browser emulation is NOT real physical iPhone/VoiceOver/Dynamic Type, and viewport-only controls do not prove complete screen coverage.

## Results (pre-fix baseline)
- 20/20 route samples loaded without page JavaScript exceptions or page-level horizontal overflow; 0 unnamed visible buttons.
- Today 4/4, Plans 4/4, Stash 4/4: no undersized visible button rectangles under this method.
- Calendar at 320px: 21 of 33 visible controls are 40px-wide 7-column day cells, 67px tall in both themes. At 390px no sub-44px visible calendar control. Day cells have descriptive date/log aria text. This is a **measured exception / needs device accessibility review**, not a new claimed WCAG failure, and should not be fixed by 44px width that would overflow a seven-column 320px grid.
- More/Profile at 320/390 both themes: Edit targets (#editprofile2) 100x42px, below 44px preferred tap height. The direct inline style in assets/js/10-nexus.js sets min-height:42px.
- No real VoiceOver spoken-name, focus trap/return, keyboard/safe-area, zoom, reduced-motion or Dynamic Type testing conducted.

## Scoped code change (draft)
- Increase only Edit targets min-height 42px -> 44px in its existing button. No rearrangement, typography, saved data, storage or account changes.
- Extend existing DS2 global consistency browser guard for Profile to include editprofile2 44px threshold.
- Recheck all 20 routes and six CI suites before release. Keep on draft PR; no merge/deploy without approval.
- Use permanent docs/qa/IPHONE_MANUAL_TEST_PLAYBOOK.md, QA-VOICEOVER-01, for physical device acceptance; do not duplicate it.

## Next action
1. Confirm current-source CI and browser geometry (320/390 light/dark), full-app isolated DEMO/LIVE source artifact integrity.
2. On physical iPhone DEMO, test VoiceOver spoken names, modal focus/return, keyboard and Dynamic Type at Today -> Log Dose, Plans -> protocol phases, Stash -> details and More -> Edit targets; note precise device/iOS, test results and screenshot for any failure. Calendar 320px day-cell touch/VoiceOver discoverability remains a separate unresolved measured exception.
3. Request explicit approval before any merge or production deployment.
