# PR #143 — App search clear controls — development candidate, November 6, 2026

**Status:** Draft, unmerged, undeployed; complete app-wide search audit still open. Production remains v0.9.25-beta.1. No localStorage migration or user-data writes.

**Intent:** Accessible query-clear actions across searchable pickers, without removing selected supplements, protocol compounds, combo compounds, logged history, saved drafts, inventory or symptom intensity. Clear action is 44px or larger, SVG outline X, shown only for a nonempty query, returns keyboard focus after rerender. Existing Discover clear X raised to 44px/ARIA-labelled.

**Screens and workflows:** Check-In supplement search, supplement logging, Settings supplement catalogue, Combo Dose compound select, Stash kit search, Activity Logs, Journal, Stacking, compound History library, All Compounds browser, Check-In symptom picker, Protocol Builder compound search, Discover.

**Protected:** No mutation of chosen items, saved data, history, exact-vial allocations or LIVE nasal flags. Search state only, preserve DS2 styling and interaction.

**Automated evidence:** Source candidate c426ae525c2bd15ed74e60841405666a099cec5e had six GitHub workflows SUCCESS (#42196655286 build, #42196654635 pinned Chromium, #42196660252 WebKit, #42196656891 mobile, #42196656405 writer, #42196657272 DS2). Its official artifact #13493046725 independently downloaded: outer 549-file CRC PASS, build manifest matches c426ae52, 26-file LIVE ZIP CRC PASS, isolated full-app standalone DEMO equals offline ZIP HTML byte-for-byte. Later source changes (Protocol Builder clear, Discover 44px, tests) are NOT covered by this older artifact. Full build #42254391969 FAILED at a protected Protocol Builder test's generic SVG count after Protocol Builder gained a second legitimate outline X; test correction 683b049c now asserts the outline magnifier separately and checks the clear's accessible name/44px/action. Current exact-head rerun #42256170024 pending; do NOT call latest source fully qualified before verdict.

**Known limitations:** Existing vial/kit, other-form and blend comboboxes use their visible input as both search query and selected value; blindly clearing could make a selected compound invisible while leaving it chosen. These require selection-aware design and browser verification. Local Chromium 320/390 light/dark has passed six clear contexts, but not every searchable field. Physical iPhone/VoiceOver/Dynamic Type NOT TESTED. Main version unchanged.

**Release state:** Proposed/coded development only; not merged, deployed or physical-device accepted. No deployment authorized.

**Next action:** Validate current protected CI, implement safe final search selection/query separation in outstanding comboboxes, rerun exact-source full-app QA, then qualify final LIVE/DEMO packages; request physical iPhone acceptance only when independent sprint work complete.
