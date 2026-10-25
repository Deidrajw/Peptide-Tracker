# Nexus v0.9.18-beta — UI surface source audit

**Scope:** Verified against 12 ordered current branch JS modules. This inventory indexes named View/Modal/Screen/Tab/Detail/Sheet/Overlay/Panel/Drawer/Picker/Table/Insights/Guide functions. A function is not necessarily a unique screen. A separate 57-surface heuristic score is not a tested release grade.

## Implemented UI fixes (candidate, pending final regression)

| Area | Source problem | Change |
|---|---|---|
| Navigation | Settings and calculator back actions undersized | Larger touch targets and accessible labels |
| Accessibility | Missing general keyboard focus/reduced-motion parity | Focus-visible and reduced motion CSS; calculator input labels |
| Trust | No Privacy & Data entry | New Settings screen with browser-storage, permission, backup and network explanations |
| Backup | Direct JSON overwrite on restore | File preview, typed RESTORE, recovery copy and rollback |
| Calculator | Unsafe IU conversion and scale-sensitive U-100 display | No generic IU conversion; invalid/capacity/scale guards; syringe-invariant unit reading |
| Onboarding | Previously inconsistent completion cards | Preserve v0.9.17 four outline action cards and safe first-run restore |
| Chevron parity | Mixed disclosure geometry historically | Preserve shared chevron styles and protect existing actions |

## Source-indexed UI and workflow entry points

**Method:** Static regex over the exact PR branch. This provides code coverage traceability, **not** a visual test Pass.

### assets/js/01-nexus.js (1 functions)

`demoPickerModal`

### assets/js/03-nexus.js (2 functions)

`addBlendKitModal`, `logBlendDoseModal`

### assets/js/04-nexus.js (14 functions)

`inventoryReconciliationModal`, `deletePreparedDoseModal`, `reopenVialModal`, `addToOpenVialModal`, `addVialsModal`, `adjustVialRemainingModal`, `editVialReconModal`, `undoReconstitutionModal`, `refineNexusSheet`, `openModal`, `closeModal`, `todayLogDosePicker`, `snoozeModal`, `wireSymptomPicker`

### assets/js/05-nexus.js (19 functions)

`comboDoseModal`, `rescheduleDoseModal`, `resolveOverdueModal`, `skipDoseModal`, `markMissedModal`, `drawFromVialModal`, `doseModal`, `renderAllocPanel`, `prepareMixedSyringeModal`, `administerSyringeModal`, `syringeDetailModal`, `prepareDosesModal`, `reconstituteVialModal`, `nexusConfigureCheckinSheet`, `todayLogSheet`, `addUpdateModal`, `editUpdateModal`, `dailyModal`, `supplementModal`

### assets/js/06-nexus.js (8 functions)

`macroModal`, `moreLogSheet`, `weightModal`, `measureModal`, `whyDateModal`, `featureExplorerView`, `journalView`, `aminoView`

### assets/js/07-nexus.js (6 functions)

`supplyModal`, `healthModal`, `weeklyDigestModal`, `renderUpcomingFullView`, `renderActiveFullView`, `renderAllFullView`

### assets/js/08-nexus.js (10 functions)

`doseRetrospectiveModal`, `phaseDetailModal`, `pkMethodologyModal`, `dayDetailModal`, `weeklyView`, `monthView`, `logsView`, `guideDetail`, `compoundIntelView`, `discoverDetail`

### assets/js/09-nexus.js (21 functions)

`trendsView`, `supplyPlannerModal`, `prepareChoiceModal`, `preparedListModal`, `supplyEstimatorModal`, `cyclePlannerModal`, `nxEvidencePanel`, `nxTrendsDetail`, `chartDetailModal`, `finishVialModal`, `markKitDoneModal`, `undoOutflowModal`, `editOutflowModal`, `logWasteModal`, `openNewVialModal`, `stashFilterModal`, `stashSortModal`, `equipmentView`, `equipmentModal`, `logSupplyUseModal`, `restockSupplyModal`

### assets/js/10-nexus.js (9 functions)

`stashView`, `mixingChartView`, `reconCalcView`, `profileModal`, `exportICSWithTimePicker`, `nxQuickAccessView`, `homeView`, `profileView`, `nxUsageSettingsView`

### assets/js/11-nexus.js (25 functions)

`renderSettingsDetailScreen`, `renderPhaseRemindersDetail`, `renderRemindersDetail`, `renderUnitsDetail`, `renderHealthDataDetail`, `renderPrivacyDataDetail`, `renderBackupDetail`, `renderDataManagementDetail`, `renderDeveloperDetail`, `forceVialRepairModal`, `devResetAllModal`, `wireCompoundPicker`, `protocolBuilderModal`, `rebuildModal`, `protocolCalendarView`, `phaseRoadmapModal`, `recordPastPauseModal`, `protocolsView`, `goalDetailModal`, `plansView`, `goalModal`, `researchModal`, `protocolModal`, `shoppingModal`, `showNexusMorePanel`

### assets/js/12-nexus.js (5 functions)

`nxCloseCompoundSheet`, `nxOpenCompoundSheet`, `appUpdatesView`, `whatsNewModal`, `showPublishedReleaseModal`

**Indexed function total:** 120 (unique within each file). Inline markup, arrow renderers and additional states exist beyond these names.

## Protected regression gates

| Workflow | Needed evidence | Candidate state |
|---|---|---|
| Today, Check-In | one record/date; mood, symptoms, notes, edit | Automated browser tests running |
| Supplements | searchable multi-select and date-specific records | Automated tests running |
| Log Dose, Combo, Stash | drafts, source selection, multi-vial math, supply and history | Automated tests running |
| Calendar, Weight, Nutrition | current month, numeric weight, day-detail, schedules | Automated tests running |
| Goals, Research, Journal, Protocol | approved card hierarchy, navigation and history | Automated tests running |
| Backup and Privacy | preview, typed restore, cancellation, recovery and disclosures | New browser matrix running |
| Calculator | independent unit invariance, finite positivity, IU and capacity rejection | Blocking math assertions running |
| Accessibility | 320/390 light/dark, keyboard, reduced motion | Browser running; real iPhone/VoiceOver not tested |
| LIVE / full DEMO | exact source, no real-data/demo sync | CI generation and validation |
| Cloudflare | deployed SHA and asset parity | Unverified; PR not merged |

**Limitations:** Source inventory and automated simulations cannot certify all visual states, WCAG AA color contrast on every component, real device behaviors, Apple approval, or absence of deployment issues. Failures must remain visible rather than changed to Pass by documentation.
