# GROCIFY — Antigravity Kickoff (Master Prompt)

## How to use this file

1. Create a new project folder `grocify/` and open it in Antigravity.
2. Create this structure and drop the files in:
   ```
   grocify/
   └── docs/
       ├── PRD.md
       ├── TRD.md
       ├── UIUX.md
       ├── ANTIGRAVITY-KICKOFF.md      (this file)
       └── reference/
           ├── Grocify_Fridge_Welcome_Screen.png
           ├── Smart_Fridge_Inventory_App.png
           └── Fridge_Tomato_Add_Item_Screen.png
   ```
3. Paste **everything between `BEGIN MASTER PROMPT` and `END MASTER PROMPT`** into the Antigravity agent as the first message (or tell it to read `docs/ANTIGRAVITY-KICKOFF.md` and follow it).
4. The agent will read the docs, confirm its understanding, and wait. After that, you drive the project with short commands:
   - `APPROVED` — approves the plan for the current phase; the agent starts coding.
   - `PROCEED TO PHASE N` — approves the finished phase and starts planning the next one.
   - `FIX: <issue>` — asks for changes inside the current phase before moving on.

---

<!-- ===================== BEGIN MASTER PROMPT ===================== -->

# MASTER PROMPT: Build GROCIFY

## 1. Your role and mission

You are the lead engineer building **GROCIFY**, an offline-first mobile app that turns the phone into a **virtual fridge**: the user opens a realistic fridge, sees three color-coded compartments (Freezer, Packed & Miscellaneous, Veggies), adds groceries with a quantity and expiry date, and gets reminded before items expire.

You will build it **in 6 phases**, stopping for my review at the end of each phase. Quality, fidelity to the design, and following the specs matter more than speed. **Do not improvise on design, naming, or architecture.**

## 2. Sources of truth (read these first, in full)

| File | Governs | 
|---|---|
| `docs/PRD.md` | **What** the product does: flows, screens, functional requirements (FR-xx), priorities (P0/P1/P2) |
| `docs/TRD.md` | **How** it is built: stack, folder structure, data model, state, notifications, testing, build |
| `docs/UIUX.md` | **How it looks and feels**: tokens, components, measurements, motion, microcopy |
| `docs/reference/*.png` | **Visual ground truth** for the Welcome, Fridge, and Add screens |

**Precedence when documents disagree:**
1. For anything visual: the **reference images** win over `UIUX.md`, and `UIUX.md` wins over everything else.
2. For behavior and scope: `PRD.md`.
3. For technology and architecture: `TRD.md`.
4. If a conflict or gap is not resolved by the above, **pick the simplest option consistent with the docs, record it in `docs/DECISIONS.md`, and mention it in the phase report.** Ask me only if the choice is expensive to reverse.

## 3. Decisions already made (do not reopen)

The open questions in the docs are settled as follows. Change them only if I tell you to.

- **Stack:** Expo (managed) + React Native + TypeScript (strict) + Expo Router + Zustand (persist) + AsyncStorage + Reanimated + expo-notifications + date-fns. Package manager: **npm**.
- **Platforms:** Android and iOS from one codebase, portrait only, light mode only.
- **Scope:** implement **P0 only** from the PRD. P1 and P2 items (custom items, suggested expiry, compartment badges, sorting options, reminder settings screen, notification deep links beyond the basic tap handler, "used" tracking, sync) are **out of scope** unless I explicitly ask in Phase 6.
- **Header count:** number of item **entries**, not the sum of quantities (TRD 6.1).
- **Reminder time:** fixed at **09:00 local** (`REMINDER_HOUR = 9`), default lead time **2 days**.
- **Storage:** AsyncStorage through the `services/storage.ts` adapter.
- **Local-only:** no backend, no analytics, no network calls, no accounts.
- **Item catalog** (ids are fixed; each needs a matching `{id}.webp` in `assets/items/`):
  - **Freezer:** `ice-cream`, `green-peas`, `frozen-pizza`, `french-fries`, `sweet-corn`, `mixed-berries`, `frozen-paratha`, `frozen-chicken`
  - **Packed & Miscellaneous:** `milk`, `eggs`, `cheese`, `butter`, `curd`, `bread`, `pasta-sauce`, `cereal`, `jam`, `orange-juice`
  - **Veggies:** `tomato`, `brinjal`, `broccoli`, `carrot`, `capsicum`, `cucumber`, `lettuce`, `spinach`, `cauliflower`, `green-chilli`
  - Display names are the title-cased ids (for example "Ice Cream", "Green Peas", "Green Chilli").

## 4. Working agreement (applies to every phase)

For **each phase**, follow this loop exactly:

1. **Re-read** the relevant sections of the three docs and the reference images.
2. **Plan:** produce an implementation plan and a task list for the phase (as artifacts). List the files you will create or change and any decision you need to make. **Then stop and wait for my `APPROVED`.** Do not write code before approval.
3. **Implement** in small, logical steps. Commit after each task with a conventional commit message (`feat:`, `fix:`, `chore:`, `test:`, `docs:`).
4. **Verify** against the phase's acceptance criteria: run `npx tsc --noEmit`, `npx eslint .`, and `npx jest`; run the app and check it visually against the reference at **393 × 852**; take screenshots.
5. **Report:** write `docs/PHASE_REPORTS/PHASE_N_REPORT.md` using the template in section 8, update `docs/PROGRESS.md` and `docs/DECISIONS.md`, tag the repo `phase-N`.
6. **Stop.** Do not start the next phase until I say `PROCEED TO PHASE N`.

**Persistent context files (keep them current so a fresh session can resume):**
- `docs/PROGRESS.md`: one line per completed task, current phase, what is next.
- `docs/DECISIONS.md`: every judgment call, with the reason, in one or two lines each.
- `docs/ASSETS_NEEDED.md`: assets that are missing or placeholders (see section 6).

## 5. Non-negotiable rules

**Code**
- TypeScript `strict` and `noUncheckedIndexedAccess`. **No `any`**, no `@ts-ignore` without a comment explaining why.
- Route files in `app/` stay thin; logic lives in `src/` exactly as in TRD section 3.
- **No hardcoded colors, font sizes, spacing, radii, or durations in components.** Everything comes from `src/theme/tokens.ts` (values from UIUX section 3 and 12).
- Dates: `expiryDate` is a `'YYYY-MM-DD'` string. Never store `Date` objects or timestamps for it. "Days left" uses local start-of-day.
- Build every reusable component once, in `src/components` or its feature folder, and reuse it.
- No network calls, no analytics, no third-party data collection. The only permission is notifications.
- Handle errors gracefully (corrupt storage means empty fridge, never a crash). Never log item data in production.

**Design**
- Match the reference screens first, then apply `UIUX.md`. Use the exact copy in UIUX section 10.
- Use **custom** stepper, date field, and buttons as specified (only the native date picker itself is allowed).
- Compartment color theming (blue / beige / green) must carry through picker, add, review, and inventory.
- Status is always icon + text + color, never color alone.
- Do **not** put the graphite phone frame in the app (it is a presentation mockup only).
- Do **not** paste the reference screenshot or a flat fridge picture onto the welcome screen; build the layered fridge from code-drawn gradients and shapes as UIUX section 5 describes.
- Do not add dark mode, extra animations, extra colors, extra fonts, or decorative elements.

**Process**
- Never skip the plan-approval gate or the phase-end stop.
- Never mark something done that you did not run and check.
- If you are unsure, record the question in `DECISIONS.md` and choose the simplest option; do not stall.

## 6. Assets policy

- **Fonts:** Figtree (400, 500, 600, 700, 800) via `@expo-google-fonts/figtree`.
- **Icons:** `lucide-react-native` per the UIUX icon map. No other icon sets.
- **Item images** (`assets/items/{id}.webp`, transparent, max 512 px, top-left light, soft contact shadow, per UIUX 3.6): if you can generate or source matching images, follow that style. **If you cannot, do not fake them with unrelated stock photos.** Use a single `ItemImagePlaceholder` component (a neutral rounded shape with the item's first letter, in the compartment tint) wired through `src/data/itemImages.ts`, and list every missing file in `docs/ASSETS_NEEDED.md` with its exact filename. I will supply the final images. The app must work end to end with placeholders.
- `src/data/itemImages.ts` must use **static `require` paths** (Metro requirement). Design it so swapping a placeholder for a real file is a one-line change.
- Everything else visual (rims, pills, shelves, light strips, welcome fridge) is **drawn in code** (gradients, borders, shadows) per `UIUX.md`.

---

## 7. The phases

### PHASE 1 — Foundation

**Goal:** a clean, tested skeleton with all non-UI logic in place and navigation working with placeholder screens.

**Tasks**
1. Initialize the project per TRD section 2 (Expo, TypeScript strict, Expo Router, `@/*` alias, portrait lock, light mode, app name `GROCIFY`, slug `grocify`). Initialize git.
2. Install and configure all dependencies listed in TRD section 2; set up ESLint, Prettier, Jest (`jest-expo`), and scripts: `lint`, `typecheck`, `test`.
3. Create the full folder structure from TRD section 3 (empty folders get a `.gitkeep`).
4. Implement `src/theme/tokens.ts` and `src/theme/index.ts` from UIUX section 12, including `colors`, `compartmentTheme`, `spacing`, `radius`, `motion`, plus the **typography** and **elevation** tokens from UIUX 3.3 and 3.4.
5. Implement `src/domain/types.ts` exactly as in TRD section 5.
6. Implement `src/domain/status.ts` (`daysLeft`, `getStatus`, and the label function per TRD 7.1) and `src/domain/reminders.ts` (`computeTriggerDate`, `REMINDER_HOUR`, per TRD 7.2).
7. Implement `src/utils/date.ts` (format and parse between `DD / MM / YYYY` and `YYYY-MM-DD`, and a "12 Dec 2026" formatter) and `src/utils/id.ts`.
8. Implement `src/services/storage.ts` (AsyncStorage adapter) and `src/store/fridgeStore.ts` (items, settings, `hydrated`, `addItem`, `updateItem`, `removeItem`, `markWelcomeSeen`, persist `version: 1` with a `migrate` stub) and `src/store/draftStore.ts`. For now, `addItem` / `updateItem` / `removeItem` call a **stub** notifications service (`scheduleItemReminder`, `cancelItemReminder`) that returns `null`; the real service comes in Phase 6.
9. Implement the selectors from TRD section 6 (`selectItemsByCompartment` sorted by soonest expiry, `selectTotalCount`, `selectCompartmentSummary`).
10. Implement `src/data/compartments.ts` (id, name, icon, theme) and `src/data/catalog.ts` (the fixed catalog from section 3 above).
11. Root layout `app/_layout.tsx`: load fonts, keep the splash screen visible until fonts and store hydration are ready, configure the `Stack` (headerless, fade as default), and apply the launch logic (welcome on first launch, otherwise `/fridge`).
12. Create **placeholder** screens for all six routes (`/`, `/fridge`, `/compartment/[id]`, `/add/pick`, `/add/details`, `/add/review`) showing only their route name and a link to the next screen, so navigation can be verified.
13. Create `src/data/itemImages.ts` with the placeholder strategy from section 6, and `docs/ASSETS_NEEDED.md` listing all 28 catalog images.

**Tests (Jest)**
- `daysLeft` and `getStatus`: past, today, tomorrow, within and beyond the reminder window, across a daylight saving change.
- `computeTriggerDate`: all three branches in TRD 7.2.
- `date.ts` formatting and parsing round trips and invalid input.
- Store: add, update, remove, selector ordering, and `selectTotalCount` counting entries.

**Acceptance criteria**
- `tsc`, `eslint`, and `jest` all pass with zero errors.
- The app launches on a device or simulator, shows the splash, then the placeholder Welcome screen; navigating through all six placeholders works; killing and reopening the app skips Welcome (after calling `markWelcomeSeen`).
- No hardcoded design values exist outside `tokens.ts`.

### PHASE 2 — Design system and shared components

**Goal:** every reusable building block exists, matches `UIUX.md`, and can be reviewed in isolation.

**Tasks**
1. Create a dev-only **component gallery** route (`app/_dev/gallery.tsx`, reachable only when `__DEV__` is true) that renders every component below in every state, on the `canvas` background, with a compartment switcher (Freezer / Packed / Veggies).
2. Build these components exactly per UIUX section 4 (names and props are yours to define cleanly, but they must be reused everywhere later):
   - `CompartmentIconCircle` (44 and 52 sizes, glossy highlight)
   - `ScreenHeader` / header pill (with and without back arrow, with and without chevron, with optional right-side slot)
   - `LightStrip`
   - `GlassShelf` (glass shelf line and band)
   - `FridgeFrame` (silver rim, inner highlight and shadow, radius 28, `elevFridge`) used by Add, Review, Picker, and Inventory screens
   - `PrimaryButton` (arrow and check variants, disabled and pressed states, gradient, press scale) and `WelcomeCta`
   - `TextButton`
   - `QuantityStepper` (clamped 1 to 99, disabled states, light haptic, value cross-fade)
   - `DateField` (placeholder and filled states, error state, calendar icon, opens the native picker with `minimumDate` today; iOS picker in a bottom sheet with Done, Android native dialog)
   - `NamePill`
   - `StatusBadge` (all three statuses, correct labels from `status.ts`)
   - `ItemRow` (image, name, `Qty N · Expires D Mon`, status badge)
   - `EmptyState`
   - `ItemImage` (uses `itemImages.ts`, falls back to `ItemImagePlaceholder`)
   - `FridgeBase` (grille bars and feet, UIUX 4.10)
3. Add `accessibilityRole` and `accessibilityLabel` to every pressable and enforce 44 pt touch targets with `hitSlop`.
4. Add a shared `usePressScale` (or equivalent) hook for the press feedback, and a `useReducedMotion` helper that all animations respect.

**Tests**
- `QuantityStepper` clamping and disabled states.
- `StatusBadge` text for each status.
- `DateField` renders placeholder vs value and error text.
- Snapshot or render tests for `PrimaryButton` states.

**Acceptance criteria**
- The gallery shows all components in all states and compartment themes with correct tokens; nothing is hardcoded.
- Side by side with the Add screen reference, the header pill, name pill, stepper, date field, and primary button are visually indistinguishable at a glance (same colors, proportions, radii).
- Lint, typecheck, and tests pass.

### PHASE 3 — Welcome and Fridge home

**Goal:** the first two screens are pixel-faithful and the Welcome → Fridge transition works.

**Tasks**
1. **Welcome screen** (`/`) per UIUX section 5: code-drawn two-door blue fridge (gradients, seam, handles, sheen, feet), GROCIFY wordmark with sprout leaf, "Welcome to GROCIFY", tagline, and the **Open My Fridge** CTA. Respect safe areas. On tap: `markWelcomeSeen()` then the Welcome → Fridge transition (UIUX section 8: fridge scales 1.0 → 1.04 while fading, Fridge fades in underneath, 450 ms).
2. **Fridge screen** (`/fridge`) per UIUX section 6:
   - Compact header: small wordmark on the left; item-count chip (from `selectTotalCount`, for example "12 items", "1 item", "0 items") and the **+** button on the right.
   - Fridge body with silver rim, three stacked compartment panels with gradient interiors, light strips, header pills (icon circle, name, chevron), glass dividers, glass shelf lines, and the `FridgeBase`.
   - `ShelfPreview`: up to 6 item images in a row, newest first, bottom-aligned on the shelf, slightly overlapping if needed; empty compartments show the faint caption "Empty".
3. Panels are fully tappable with press feedback (scale 0.985) and a selection haptic; they navigate to `/compartment/[id]` with the compartment transition from UIUX section 8 (the full expand animation may be implemented with Reanimated; a fade-with-scale is acceptable if shared-element expansion proves unreliable, but record it in `DECISIONS.md`).
4. **+** navigates to `/add/pick` (no compartment preselected).
5. Add a `__DEV__`-only **"Load sample data"** action (for example a long-press on the header wordmark) that seeds the store with the sample items from UIUX section 6, so the shelf previews can be reviewed and screenshotted. It must not exist in production builds.
6. The count chip animates (scale 1.0 → 1.15 → 1.0, 200 ms) whenever the count increases.

**Tests**
- Count chip text and pluralization.
- `ShelfPreview` shows at most 6 images, newest first, and the empty caption when there are none.
- Launch logic: first launch shows Welcome, later launches go straight to `/fridge`.

**Acceptance criteria**
- Welcome and Fridge, run at 393 × 852 and compared with the reference images, match in layout, color, proportions, and copy. Provide screenshots of both next to the references and list every remaining deviation.
- The Welcome → Fridge fade runs smoothly; compartment taps navigate with the compartment transition; the dev sample data renders all three shelves correctly.
- Works on small (360 wide) and large (430 wide) viewports without clipping.

### PHASE 4 — Add flow

**Goal:** a user can add an item end to end: picker → details → review → saved into the fridge.

**Tasks**
1. **Item picker** (`/add/pick`) per UIUX 9.1: compartment chips when no compartment is passed (otherwise preselected via the `compartment` param), search field, 3-column item grid from `catalog.ts`, tile press feedback, empty-search message. Tapping a tile writes to `draftStore` and goes straight to details. (No custom-item tile; that is P1.)
2. **Add to [Compartment]** (`/add/details`) per UIUX section 7, built to match `Fridge_Tomato_Add_Item_Screen.png`: `FridgeFrame`, header pill ("Add to Veggies"), showcase cavity with light strip and glass shelf and the item image, name pill, form panel (Quantity stepper, Expiry date field, helper text), and `PrimaryButton` "Continue". `Continue` is disabled until a valid, non-past expiry date exists; the error state shows "Pick today or a later date". Draft values persist when navigating back.
3. **Review** (`/add/review`) per UIUX 9.2: shortened showcase cavity, summary card (name, quantity chip, compartment row, formatted expiry, status badge), **reminder chip group** (`1 day`, `2 days`, `3 days`, `1 week`, default 2 days, the 1-week chip stores `7`), the caption about the morning notification, **Add to fridge** button (check icon) and the **Edit** text button (returns to details with the draft intact).
4. On **Add to fridge**: call `addItem`, run the success haptic, clear the draft, then **fade back to `/fridge`** (350 ms). On arrival, run the count-chip bump and the **compartment glow pulse** (accent 0 → 40% → 0 over 600 ms) on the compartment that received the item.
5. Compartment theming flows through all three screens (colors and icon change by compartment; the primary button stays `brand.forest`).
6. Entry from a compartment's future **+** button (`/add/pick?compartment=<id>`) must already work, even though that button is built in Phase 5.
7. Notification permission and scheduling are **not** part of this phase (stubbed from Phase 1).

**Tests**
- Picker filters by compartment and by search text.
- Details: `Continue` disabled and enabled logic, including past dates and today.
- Review: status badge and reminder selection map to the stored `reminderDays`.
- Full flow test: pick Tomato, quantity 3, a valid date, review, save; the store contains one entry with the right fields and the count is 1.

**Acceptance criteria**
- The details screen, run at 393 × 852 with Veggies and Tomato, matches the Add reference closely (provide a side-by-side screenshot and list deviations).
- The complete flow works for all three compartments; data persists after killing and reopening the app.
- Back navigation never loses the draft; saving clears it.

### PHASE 5 — Compartment inventory and item management

**Goal:** users can browse a compartment and edit or remove items.

**Tasks**
1. **Compartment Inventory** (`/compartment/[id]`) per UIUX 9.3: `FridgeFrame` in the compartment colors, header pill with back arrow, icon circle, name, count chip ("6 items"), and the compartment-colored **+** button (goes to `/add/pick?compartment=<id>`); light strip; scrollable `FlatList` of `ItemRow`s sorted by soonest expiry first (memoized rows, `keyExtractor`, fixed-height `getItemLayout`).
2. **Edit sheet** (tap a row): a bottom sheet (radius 28 at the top, `card.panel` fill) with item image and name, `QuantityStepper`, `DateField`, the reminder chip group, and **Save** (calls `updateItem`).
3. **Delete:** swipe left reveals the red delete action (80 pt wide, `trash-2`); tapping it shows a confirmation sheet "Remove {item}?" with **Remove** and **Cancel**; removal collapses the row (220 ms) with a warning haptic. Also provide a delete action inside the edit sheet for users who do not discover the swipe.
4. **Empty state** per UIUX 9.3 (code-drawn empty glass shelf, "Nothing here yet", supporting text, **Add item** button).
5. Handle the `id` param safely (unknown id redirects to `/fridge`).
6. The Fridge screen's `ShelfPreview` and count chip update immediately after edits and deletes.

**Tests**
- Sort order by expiry, ties stable.
- Edit updates quantity and date and recomputes the status badge.
- Delete removes the entry and updates counts on both screens.
- Empty state shows when the compartment has no items; unknown `id` redirects.

**Acceptance criteria**
- All three compartments list, edit, and delete correctly; counts stay in sync everywhere.
- Swipe, sheet, and animations are smooth with 50+ items (seed them in dev) and respect reduced motion.
- Visual style matches the Add screen's system (same pills, fills, radii, and shadows).

### PHASE 6 — Reminders, polish, and release

**Goal:** real expiry reminders, a final quality pass, and installable builds.

**Tasks**
1. **Notifications service** `src/services/notifications.ts` per TRD section 8: replace the stub with the real implementation: handler for foreground display, Android channel `expiry-reminders`, `ensurePermission`, `scheduleItemReminder` (date trigger from `computeTriggerDate`, title `GROCIFY`, body from the status labels such as "Tomato expires in 2 days", data `{ itemId, compartment }`), `cancelItemReminder`, and `reconcileAll` (cancel all GROCIFY notifications, sort by trigger date, schedule the soonest **60**, update each item's `notificationId`). Wire `addItem`, `updateItem`, and `removeItem` to it, and call `reconcileAll` on every launch after hydration.
2. **Permission pre-prompt** (UIUX 9.4): bottom sheet shown when the first item is saved, then the system prompt. If denied, the app keeps working and Review shows the inline "Turn on notifications to get expiry reminders" notice with a **Settings** link.
3. **Basic tap handling:** tapping a notification opens `/compartment/<compartment>` (register the response listener in the root layout).
4. **Polish pass:**
   - Verify every animation in UIUX section 8 (durations, easings, reduced-motion behavior, haptics).
   - Accessibility audit per UIUX section 11 and TRD section 12 (labels, roles, contrast, 44 pt targets, dynamic type up to 130%).
   - Performance check per TRD section 11 (cold start under 2 seconds on a mid-range device, list performance).
   - Edge cases from TRD section 13 (denied permission, corrupt storage, expiry today, passed reminder time, timezone change, more than 60 items).
   - Remove or gate all dev tooling (`gallery`, sample data) so none of it ships in production.
5. **Release setup:** `app.json` (name, slug, icon, splash with brand colors, notification config), `eas.json` with `development`, `preview`, and `production` profiles, an app icon and splash that follow `UIUX.md` (cream canvas, brand green, leaf sprout wordmark), and a short `README.md` with run, test, and build instructions.
6. Produce the **manual test checklist** results from TRD section 14, performed on a real device or the closest available environment, and note anything you could not test.

**Tests**
- `notifications.ts` with the Expo module mocked: schedule, cancel, reschedule on edit, cancel on delete, `reconcileAll` ordering and the 60 cap, `null` trigger handling.
- Permission-denied path renders the notice.

**Acceptance criteria**
- A reminder fires for a test item (use a near-future expiry and a 1-day lead with a temporary dev override of the trigger time, which is removed before finishing).
- Tapping the notification opens the right compartment.
- All TRD edge cases behave as specified; no dev-only code in production builds.
- `preview` build instructions work; lint, typecheck, and the full test suite pass.

---

## 8. Phase report template

At the end of every phase write `docs/PHASE_REPORTS/PHASE_N_REPORT.md`:

```
# Phase N Report: <name>

## Summary
<3 to 5 sentences: what was built>

## Acceptance criteria
- [x] / [ ] each criterion from the phase, with a one-line note

## Verification
- tsc: pass/fail
- eslint: pass/fail
- jest: X tests, pass/fail
- Run on: <device/simulator/Expo Go/dev build>
- Screenshots: <paths>, with side-by-side comparison against the references where relevant

## Deviations from the specs
<every place that differs from PRD/TRD/UIUX, and why>

## Decisions made
<also appended to docs/DECISIONS.md>

## Known issues and risks
<anything incomplete, flaky, or untested>

## Assets still needed
<from docs/ASSETS_NEEDED.md>

## Proposed plan for the next phase (high level)
<5 bullets>
```

## 9. Your first action now

Do **not** write any code yet. Do this:

1. Read `docs/PRD.md`, `docs/TRD.md`, `docs/UIUX.md`, and view the three images in `docs/reference/`.
2. Reply with:
   - A summary of GROCIFY in **no more than 12 bullets**, proving you understood the product, the three compartments, the six screens, the data model, the stack, and the design language.
   - Any **contradictions, gaps, or risks** you found across the documents (with section references), and your proposed resolution for each.
   - Your list of **questions for me**, only if they block progress (otherwise say "none").
3. Then produce the **Phase 1 implementation plan and task list** and **wait for my `APPROVED`**.

<!-- ====================== END MASTER PROMPT ====================== -->
