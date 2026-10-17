# GROCIFY — Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | GROCIFY |
| **Tagline** | Your fridge, perfectly organized. |
| **Document** | PRD v1.0 |
| **Companion docs** | `TRD.md` (technical), `UIUX.md` (look and feel) |
| **Status** | Draft for build kickoff |

---

## 1. Overview

GROCIFY is a mobile app that turns the phone into a **virtual fridge**. Instead of a plain list of groceries, the user opens a realistic fridge, sees what is inside each compartment, adds items with a quantity and expiry date, and gets reminded **before** food expires.

The core idea is simple: the metaphor of a real fridge makes tracking groceries feel natural, visual, and quick, so people actually keep using it.

## 2. Problem Statement

- People forget what is in their fridge, buy duplicates, and let food expire.
- Food gets wasted, which costs money and is bad for the environment.
- Existing grocery and pantry apps feel like spreadsheets: heavy to set up, boring to maintain, and quickly abandoned.

## 3. Vision and Goals

**Vision:** Make knowing what is in your fridge as effortless as opening the door.

**Product goals**
1. Let a user add a grocery item in under 15 seconds.
2. Make the current state of the fridge understandable at a glance.
3. Reduce food waste by reminding users before items expire.
4. Deliver a premium, minimal, full-screen experience that feels like a real fridge, not a form.

**Non-goals (for v1)**
- Recipe suggestions or meal planning.
- Shopping lists and online grocery ordering.
- Barcode or receipt scanning.
- Multi-user or household sharing and cloud sync.
- Nutrition tracking.

## 4. Target Users

| Persona | Description | Main need |
|---|---|---|
| **Busy professional / student** | Lives alone or with roommates, shops in bulk, cooks irregularly | Stop throwing away forgotten food |
| **Home cook / family manager** | Manages groceries for a household | Quick view of what is in stock before shopping |
| **Budget-conscious shopper** | Wants to avoid waste and duplicate purchases | Timely expiry warnings |

## 5. Core Concept: The Virtual Fridge

- The app is the fridge. A welcome screen shows a closed fridge; **Open My Fridge** opens it.
- The fridge has **three color-coded compartments**:

| Compartment | Color | Holds | Examples |
|---|---|---|---|
| **Freezer** | Blue | Frozen items | Ice cream, green peas, frozen pizza |
| **Packed & Miscellaneous** | Beige | Packaged and general items | Milk, eggs, cereal, sauces, jars, cheese |
| **Veggies** | Green | Fresh produce | Tomato, brinjal, broccoli, carrots, capsicum |

- The compartment color carries through that compartment's entire flow (header, accents, buttons) so the user always knows where they are.

## 6. User Flows

### 6.1 First launch
Welcome screen → tap **Open My Fridge** → Fridge screen.

### 6.2 Add a grocery item
1. On the Fridge screen, tap the **+** button in the header, or open a compartment first.
2. Pick the compartment (if not already inside one).
3. Pick the item (e.g. Tomato) from that compartment's item list.
4. **Add to [Compartment]** screen: set quantity and expiry date.
5. Tap **Continue** → **Confirmation / Review** screen.
6. Tap **Add to fridge** → return to the Fridge screen with the item count updated.

### 6.3 Browse a compartment
Fridge screen → tap a compartment → **Compartment Inventory** screen showing its items, quantities, and expiry status.

### 6.4 Manage an existing item
Compartment Inventory → tap an item → edit quantity or expiry date, or remove it.

### 6.5 Expiry reminder
A local notification is delivered before an item expires; tapping it opens that item's compartment.

## 7. Screens (Scope)

| # | Screen | Status | Purpose |
|---|---|---|---|
| 1 | **Welcome** | Designed | Brand moment; entry into the fridge |
| 2 | **Fridge (home)** | Designed | Overview of the three compartments; compact header with item count and **+** |
| 3 | **Item picker** | To design | Choose which item to add within a compartment |
| 4 | **Add to [Compartment]** | Designed | Set quantity and expiry date |
| 5 | **Confirmation / Review** | To design | Review details and expiry reminder before saving |
| 6 | **Compartment Inventory** | To design | List and manage items in one compartment |

## 8. Functional Requirements

Priority: **P0** = required for MVP, **P1** = should have, **P2** = later.

### 8.1 Welcome
- **FR-W1 (P0):** Show the GROCIFY logo, "Welcome to GROCIFY", a short tagline, and an **Open My Fridge** button.
- **FR-W2 (P0):** Tapping the button transitions to the Fridge screen with a smooth fade.
- **FR-W3 (P1):** Show the welcome screen on first launch only; later launches open the Fridge directly.

### 8.2 Fridge (home)
- **FR-F1 (P0):** Display three compartments (Freezer, Packed & Miscellaneous, Veggies), each with its icon, name, chevron, and a visual preview of its contents.
- **FR-F2 (P0):** Compact header with the **total item count** and a **+** button to begin adding groceries.
- **FR-F3 (P0):** Tapping a compartment opens its Compartment Inventory screen with a compartment transition.
- **FR-F4 (P1):** Show a small badge on a compartment when it has items expiring soon or already expired.
- **FR-F5 (P1):** The shelf preview reflects the items actually stored (up to a limited number of visible items), not a static image.

### 8.3 Item picker
- **FR-P1 (P0):** Show a searchable list of predefined items relevant to the chosen compartment, each with an image and name.
- **FR-P2 (P0):** Selecting an item continues to the Add screen with that item prefilled.
- **FR-P3 (P1):** Allow adding a **custom item** (name and optional image) when it is not in the list.

### 8.4 Add to [Compartment]
- **FR-A1 (P0):** Show the selected compartment in the header (icon, name, back arrow) and a large image of the item.
- **FR-A2 (P0):** Item name display.
- **FR-A3 (P0):** **Quantity selector** with − and + buttons, minimum 1, default 1.
- **FR-A4 (P0):** **Expiry date** field in `DD / MM / YYYY` format with a calendar icon that opens a date picker.
- **FR-A5 (P0):** Helper text: "We'll remind you before it expires."
- **FR-A6 (P0):** **Continue** is disabled until a valid, non-past expiry date is set.
- **FR-A7 (P1):** Suggest a default expiry date based on the item's typical shelf life, which the user can change.

### 8.5 Confirmation / Review
- **FR-C1 (P0):** Summary card showing item image, name, quantity, compartment (with its color), and expiry date.
- **FR-C2 (P0):** Show days remaining (e.g. "Expires in 5 days") with a status color: green (fresh), amber (expiring soon), red (expired).
- **FR-C3 (P0):** Show the expiry reminder setting (default: 2 days before expiry) and let the user change it.
- **FR-C4 (P0):** Primary action **Add to fridge** saves the item and returns to the Fridge screen with a fade; the header count updates and the compartment briefly highlights.
- **FR-C5 (P0):** Secondary action **Edit** returns to the Add screen without losing entered values.

### 8.6 Compartment Inventory
- **FR-I1 (P0):** List all items in the compartment with image, name, quantity, and expiry date/status.
- **FR-I2 (P0):** Header in the compartment's color with a back arrow and the item count for that compartment.
- **FR-I3 (P0):** A **+** action to add a new item directly into this compartment.
- **FR-I4 (P0):** Edit an item's quantity or expiry date; delete an item (with confirmation).
- **FR-I5 (P1):** Sort by expiry date (soonest first) by default; allow switching sort order.
- **FR-I6 (P1):** Empty state with a friendly message and an add action.
- **FR-I7 (P2):** Mark an item as "used" or "finished" separately from deleting it.

### 8.7 Expiry reminders
- **FR-R1 (P0):** Schedule a local notification for each item at the chosen reminder lead time before its expiry date.
- **FR-R2 (P0):** Request notification permission at a sensible moment (when the first item is added), with a clear explanation.
- **FR-R3 (P0):** Rescheduled or cancelled automatically when an item is edited or deleted.
- **FR-R4 (P1):** Notification text names the item and the days left (e.g. "Tomato expires in 2 days").
- **FR-R5 (P1):** Tapping a notification opens the relevant compartment inventory.
- **FR-R6 (P1):** Users can change the default reminder lead time in settings.

### 8.8 Data and persistence
- **FR-D1 (P0):** All data is stored on the device and works fully offline.
- **FR-D2 (P0):** Data persists across app restarts and is not lost on update.
- **FR-D3 (P2):** Optional cloud backup and sync.

## 9. Data Model (Product Level)

**Item**
- Name
- Compartment (Freezer, Packed & Miscellaneous, or Veggies)
- Image or icon reference
- Quantity (integer, 1 or more)
- Expiry date
- Reminder lead time (days before expiry)
- Date added

**Derived status**
- *Fresh*: more than the reminder window remaining.
- *Expiring soon*: within the reminder window.
- *Expired*: past the expiry date.

## 10. Non-Functional Requirements

- **Performance:** screens open instantly; transitions run at a smooth frame rate on mid-range phones.
- **Offline-first:** every core feature works without a network connection.
- **Privacy:** no account required; data stays on the device.
- **Accessibility:** readable text sizes, sufficient color contrast, and status never conveyed by color alone (always paired with text or an icon); tap targets are comfortably large.
- **Reliability:** reminders fire correctly even if the app has not been opened recently.
- **Polish:** consistent fridge visual language, no layout jumps, and graceful empty and error states.

## 11. Success Metrics

- Median time to add an item is 15 seconds or less.
- A user adds at least 5 items in their first session.
- Share of users who keep notifications enabled.
- Items acted on (used or edited) after a reminder, versus expiring unnoticed.
- Weekly returning users.

## 12. Release Scope

**MVP (P0):** Welcome, Fridge, Item picker, Add, Confirmation, Compartment Inventory, local storage, and expiry reminders.

**Next (P1):** Custom items, suggested expiry defaults, compartment badges, sorting, notification deep links, and reminder settings.

**Later (P2):** Cloud sync and backup, "used" tracking, household sharing, and shopping list ideas.

## 13. Assumptions

- The app targets smartphones and is designed portrait-first; the exact framework is decided in `TRD.md`.
- A predefined item catalog ships with the app, grouped by compartment.
- The default reminder is 2 days before expiry and is user-adjustable.
- Expiry dates use the `DD / MM / YYYY` format, as shown in the current design.
- Visuals (fridge interior, item images) follow the generated reference screens; see `UIUX.md`.

## 14. Open Questions

1. Which platforms ship first: Android, iOS, or both?
2. Should items have units (pieces, kg, litres), or is a plain count enough for v1?
3. Should expired items stay in the fridge until removed, or be flagged and auto-archived?
4. Is the item catalog fixed, or editable by the user from day one?
5. Should the Veggies, Freezer, and Packed compartments be fixed, or can users add custom compartments later?
