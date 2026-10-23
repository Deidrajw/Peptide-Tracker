# Nexus Calendar — Compact weight-first UI (2026-10-22)

## Visible changes
- Calendar month cells have three stable rows: date, compact dose/schedule/check-in indicators, and full recorded numeric weight.
- Exact weight appears in blue on every day with a logged measurement, not estimated for missing days.
- "X logged" replaced with a purple number badge. Schedule is a small gray marker. Mood remains a compact emoji.
- Selected-day detail continues to provide complete dose, check-in and weight details.
- Calendar still opens to the current Month on every new visit.

## Data impact
None. This change only affects calendar rendering and CSS. No doses, units, weight records, inventory, storage keys or calculations are changed.

## Regression checklist
- [ ] Month opens on current month instead of Logs.
- [ ] Busy date including weight, mood and multiple doses fits in cell without overlap.
- [ ] Full weight number visible on each day with an actual recorded weight; blank otherwise.
- [ ] Dose count badge shows the actual logged instance count.
- [ ] Date selection still opens its full record detail.
- [ ] Scheduled/paused indicators behave as before.
- [ ] 320px and 390px light/dark layouts readable.
- [ ] Logs subview and previous/next month controls still work.
- [ ] LIVE saved data stays unchanged; demo data never syncs to live.

## Automated tests
Workflow tests calendar rendering at 320px and 390px and validates the fixed weight row, signal row and cell bounds. Human iPhone visual verification still needed.
