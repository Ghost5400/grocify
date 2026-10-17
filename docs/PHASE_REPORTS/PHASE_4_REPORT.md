# GROCIFY — Phase 4 Report: Add Flow

**Phase:** 4 — Add Flow
**Date Completed:** 2026-10-17
**Branch / Tag:** `phase-4`
**Gating CI Results:** tsc ✅ · expo lint ✅ · npm test ✅ (14 suites / 79 tests)

---

## 1. Scope

Phase 4 implements the complete item-addition user journey:

1. **Item Picker** (`app/add/pick.tsx`) — 3-column catalog grid, search field, compartment chip selector
2. **Add Details** (`app/add/details.tsx`) — reference-matched FridgeFrame screen, stepper, date picker, gated continue
3. **Confirmation / Review** (`app/add/review.tsx`) — summary card, reminder chip group, save action
4. **Return to Fridge** (`app/fridge.tsx`) — success haptic, draft cleared, 350 ms fade, count-chip bump, 600 ms accent glow pulse on the receiving CompartmentPanel

Notifications remain stubbed (Phase 6). No custom-item creation (P1 deferred).

---

## 2. New & Modified Files

### New components
| File | Purpose |
|------|---------|
| `src/components/common/ItemShowcaseCavity.tsx` | Recessed SVG gradient cavity — LightStrip, guide lines, glass shelf, contact-shadowed item image |
| `src/features/add-item/CompartmentChipSelector.tsx` | 3-chip row (Freezer · Packed & Misc · Veggies) with 28 pt icon circles |
| `src/features/add-item/ReminderChipGroup.tsx` | Single-select chips for 1 d / 2 d / 3 d / 1 w (7 d) reminders |

### Modified components
| File | Change |
|------|--------|
| `src/components/CompartmentIconCircle.tsx` | Extended size prop to accept 28, 44, 52, or any number |
| `src/components/index.ts` | Re-exported ItemShowcaseCavity |
| `src/components/fridge/CompartmentPanel.tsx` | Added isHighlighted prop + 600 ms Reanimated accent glow pulse |
| `app/fridge.tsx` | Handle justAdded route param — pass isHighlighted to receiving panel |

### New screens
| File | Description |
|------|-------------|
| `app/add/pick.tsx` | Full item picker — chip selector, search, 3-col FlatList grid |
| `app/add/details.tsx` | Add details — FridgeFrame, ItemShowcaseCavity, NamePill, QuantityStepper, DateField, gated CTA |
| `app/add/review.tsx` | Confirmation — short cavity, summary card, ReminderChipGroup, Add to Fridge |

### New tests
| File | Tests |
|------|-------|
| `__tests__/features/add/ItemPicker.test.tsx` | 6 tests — header, compartment filter, search filter, empty state, selection, locked compartment |
| `__tests__/features/add/AddDetails.test.tsx` | 3 tests — compartment header, stepper gating, date enable |
| `__tests__/features/add/Review.test.tsx` | 4 tests — summary display, reminder selection, save, edit back |
| `__tests__/features/add/AddFlowIntegration.test.tsx` | 1 integration test — full pick → details → review → fridge round-trip |

---

## 3. Test Results

```
Test Suites: 14 passed, 14 total
Tests:       79 passed, 79 total
Time:        ~89 s
```

---

## 4. Key Technical Decisions

### 4.1 Draft store as single source of truth
All three Add screens read/write useDraftStore directly. Navigation uses plain router.push — no route params carry item data. This eliminates prop drilling and keeps each screen independently testable by seeding the store in beforeEach.

### 4.2 ItemShowcaseCavity — shared between Details and Review
The same cavity renders at height=260 in Details and height=190 in Review. Glass shelf, gradient, and light strip stay pixel-consistent across both screens.

### 4.3 Post-save highlight glow via isHighlighted prop
After router.replace with justAdded param, the fridge screen reads it and sets isHighlighted on the relevant CompartmentPanel. The panel runs a 600 ms Reanimated withTiming pulse (opacity 0 to 0.4 to 0) on an accent overlay.

### 4.4 React 19 / RNTL v14 act() rules (learned and documented)
- act() in React 19 always returns a thenable. Calling it without await in a synchronous beforeEach bleeds into the next test render, breaking all getBy* queries.
- Store mutations outside a mounted React tree need no act() — call Zustand methods directly.
- Inside tests, wrap Zustand calls that trigger re-renders in await act(async () => {...}).

---

## 5. Known Issues / Warnings

- console.error "not configured to support act(...)" on resetDraft() in Review: Zustand notifies subscribers when resetDraft() fires inside handleSave while ReviewScreen is mid-navigation. Benign — all assertions pass.

---

## 6. Deferred (Out of Scope)

- Custom item picker (free-text entry) — P1 deferred
- Real notification scheduling — stubbed until Phase 6
- Deep link into /add/details from compartment inventory — Phase 5

---

## 7. Git Tag

```
git tag phase-4
git push origin phase-4
```
