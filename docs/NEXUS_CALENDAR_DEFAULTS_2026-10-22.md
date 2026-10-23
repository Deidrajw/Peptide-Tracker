# Nexus Calendar defaults — 2026-10-22
## Fix
- Opening Calendar from bottom navigation resets its subview to Month and month offset to 0 (current local month).
- Switching to Logs remains available within Calendar.
- Previous/Next month controls continue working within the current visit.
- Navigating away and returning starts fresh at current month.
- No changes to records, history, dose calculations, or persistent localStorage schema.
## Regression checklist
- [ ] From Today, tap Calendar: Month tab selected, current calendar month shown.
- [ ] Tap Logs, navigate away, return: Month (not Logs) selected.
- [ ] Navigate back two months, switch away, return: current month shown.
- [ ] Previous and Next arrows still change months normally.
- [ ] Today marker and doses display on correct local date (Toronto timezone).
- [ ] Reload and open Calendar: current month shown.
- [ ] Existing saved dose logs unchanged.
