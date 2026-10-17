# GROCIFY — Technical Requirements Document (TRD)

| | |
|---|---|
| **Product** | GROCIFY |
| **Document** | TRD v1.0 |
| **Companion docs** | `PRD.md` (what to build), `UIUX.md` (how it looks and feels) |
| **Audience** | Developers and the AI coding agent (Antigravity) building the app |

> **Rule for the coding agent:** this document defines *how* the app is built. `PRD.md` defines *what* it does and `UIUX.md` defines *how it looks*. Do not improvise on design, naming, or architecture. Where something is not specified, choose the simplest option consistent with this document and note the decision in code comments or a `DECISIONS.md` file.

---

## 1. Technical Summary

GROCIFY is an **offline-first, local-only** mobile app. There is no backend, no account system, and no network dependency in v1. All data lives on the device. Expiry reminders are **local notifications** scheduled on the device.

| Concern | Decision |
|---|---|
| Framework | **Expo (managed workflow) with React Native** |
| Language | **TypeScript** (strict mode) |
| Navigation | **Expo Router** (file-based) |
| State | **Zustand** with `persist` middleware |
| Persistence | **AsyncStorage** behind a storage adapter |
| Animation | **react-native-reanimated** and **react-native-gesture-handler** |
| Notifications | **expo-notifications** (local, scheduled) |
| Date handling | **date-fns** |
| Date input | **@react-native-community/datetimepicker** |
| Images | **expo-image** with bundled local assets |
| Icons | **lucide-react-native** (with **react-native-svg**) |
| Haptics | **expo-haptics** |
| Testing | **Jest (jest-expo)** and **React Native Testing Library** |
| Quality | **ESLint**, **Prettier**, `tsc --noEmit` |
| Builds | **EAS Build** (and Expo Go for fast previews) |

**Versions:** use the latest stable Expo SDK at project creation. Install every Expo-related package with `npx expo install` so versions match the SDK, then pin exact versions in `package.json`. Do not hardcode versions from this document.

**Platforms:** Android and iOS from one codebase, portrait orientation only.

## 2. Project Setup

```bash
npx create-expo-app@latest grocify --template default
cd grocify
npx expo install expo-router react-native-reanimated react-native-gesture-handler \
  react-native-safe-area-context react-native-screens expo-notifications expo-image \
  expo-haptics expo-font expo-splash-screen react-native-svg \
  @react-native-async-storage/async-storage @react-native-community/datetimepicker
npm install zustand date-fns lucide-react-native
npm install -D jest-expo @testing-library/react-native @types/jest eslint prettier
```

**TypeScript config:** `"strict": true`, `"noUncheckedIndexedAccess": true`, path alias `@/*` → `src/*`.

**Orientation:** lock to portrait in `app.json` (`"orientation": "portrait"`).

**Notifications note:** local notifications must be tested on a **development build** or a real device build, not only in Expo Go, because Expo Go limits notification behavior on some platforms and SDK versions.

## 3. Folder Structure

Route files in `app/` stay thin. All logic, components, and data live in `src/`.

```
grocify/
├── app/                          # Expo Router routes (thin)
│   ├── _layout.tsx               # Root layout: fonts, splash, store hydration, stack config
│   ├── index.tsx                 # Welcome screen
│   ├── fridge.tsx                # Fridge (home)
│   ├── compartment/
│   │   └── [id].tsx              # Compartment Inventory
│   └── add/
│       ├── pick.tsx              # Item picker
│       ├── details.tsx           # Add to [Compartment]
│       └── review.tsx            # Confirmation / Review
├── src/
│   ├── components/               # Shared UI (Button, Header, QuantityStepper, DateField, ...)
│   ├── features/
│   │   ├── fridge/               # CompartmentCard, ShelfPreview, FridgeHeader
│   │   ├── inventory/            # ItemRow, StatusBadge, EmptyState
│   │   └── add-item/             # ItemGrid, DetailsForm, ReviewCard
│   ├── store/
│   │   ├── fridgeStore.ts        # Items + settings (persisted)
│   │   └── draftStore.ts         # Add-flow draft (not persisted)
│   ├── services/
│   │   ├── notifications.ts      # Permission, scheduling, reconciliation
│   │   └── storage.ts            # AsyncStorage adapter
│   ├── domain/
│   │   ├── types.ts              # Item, CompartmentId, Status, ...
│   │   ├── status.ts             # daysLeft, getStatus
│   │   └── reminders.ts          # computeTriggerDate
│   ├── data/
│   │   ├── compartments.ts       # The 3 compartments (id, name, icon, colors)
│   │   ├── catalog.ts            # Predefined items
│   │   └── itemImages.ts         # Static image map (require)
│   ├── theme/
│   │   ├── tokens.ts             # Colors, spacing, radii, typography, motion (from UIUX.md)
│   │   └── index.ts
│   └── utils/
│       ├── date.ts               # Format/parse DD/MM/YYYY, ISO helpers
│       └── id.ts                 # ID generation
├── assets/
│   ├── fonts/
│   ├── fridge/                   # Welcome fridge, compartment backgrounds, shelf art
│   └── items/                    # Transparent item cutouts (WebP)
└── __tests__/
```

## 4. Screens and Routes

| Route | Screen | PRD ref | Params |
|---|---|---|---|
| `/` | Welcome | 8.1 | none |
| `/fridge` | Fridge (home) | 8.2 | none |
| `/compartment/[id]` | Compartment Inventory | 8.6 | `id`: `freezer` \| `packed` \| `veggies` |
| `/add/pick` | Item picker | 8.3 | `compartment` |
| `/add/details` | Add to [Compartment] | 8.4 | none (reads draft) |
| `/add/review` | Confirmation / Review | 8.5 | none (reads draft) |

**Launch logic (`app/_layout.tsx`):** wait for fonts and store hydration while the splash screen stays visible. Then, if `settings.hasSeenWelcome` is false, show `/`; otherwise redirect to `/fridge`.

**Entry points to the add flow:**
- **+** in the Fridge header → `/add/pick` with no compartment selected (user chooses a compartment first; see 4.1).
- **+** in a Compartment Inventory header → `/add/pick?compartment=<id>`.

**4.1 Compartment choice without a preselected compartment:** the picker screen shows a compartment selector (three color-coded chips) at the top when `compartment` is not provided. Selecting a chip filters the item list and recolors the screen.

**Transitions** (details and timings are in `UIUX.md`):
- Welcome → Fridge: fade.
- Fridge → Compartment Inventory: compartment transition (fade plus subtle scale).
- Add flow screens: horizontal slide, with a fade back to the Fridge after saving.

Configure these through the Expo Router `Stack` `screenOptions` (`animation`, `animationDuration`) and per-screen options. Use Reanimated for any custom in-screen animation (compartment highlight, count change).

## 5. Data Model

```ts
// src/domain/types.ts
export type CompartmentId = 'freezer' | 'packed' | 'veggies';

export type ItemStatus = 'fresh' | 'expiringSoon' | 'expired';

export interface Item {
  id: string;                    // unique, generated on creation
  catalogId: string | null;      // null for custom items (P1)
  name: string;
  compartment: CompartmentId;
  imageKey: string;              // key into itemImages map
  quantity: number;              // integer, 1..99
  expiryDate: string;            // 'YYYY-MM-DD' (local calendar date, no time or timezone)
  reminderDays: number;          // days before expiry, default 2
  notificationId: string | null; // id returned by the notification scheduler
  addedAt: string;               // ISO 8601 timestamp
}

export interface Settings {
  defaultReminderDays: number;   // default 2
  hasSeenWelcome: boolean;
}

export interface CatalogEntry {
  id: string;
  name: string;
  compartment: CompartmentId;
  imageKey: string;
  defaultShelfLifeDays?: number; // used for suggested expiry (P1)
}
```

**Date rule:** `expiryDate` is stored as a plain `'YYYY-MM-DD'` string. Never store it as a `Date` or a timestamp with timezone. All "days left" math uses local start-of-day to avoid off-by-one errors across timezones and daylight saving.

**Catalog:** ship a static `catalog.ts` with at least 8 to 10 items per compartment, matching the reference screens (for example: ice cream, green peas, frozen pizza; milk, eggs, cereal, cheese, pasta sauce; tomato, brinjal, broccoli, carrot, capsicum, cucumber, lettuce). Each entry must have a matching transparent image in `assets/items/`.

## 6. State Management

**`fridgeStore` (persisted)**

```ts
interface FridgeState {
  items: Item[];
  settings: Settings;
  hydrated: boolean;
  addItem: (input: Omit<Item, 'id' | 'addedAt' | 'notificationId'>) => Promise<Item>;
  updateItem: (id: string, patch: Partial<Pick<Item, 'quantity' | 'expiryDate' | 'reminderDays'>>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  markWelcomeSeen: () => void;
}
```

- `addItem`, `updateItem`, and `removeItem` call the notifications service to schedule, reschedule, or cancel, then write the resulting `notificationId` back to the item.
- Persist with `zustand/middleware` `persist`, using the AsyncStorage adapter, storage key `grocify-store`, and `version: 1` with a `migrate` function stub for future schema changes.
- `hydrated` flips to true in `onRehydrateStorage`; the root layout waits for it.

**`draftStore` (not persisted):** holds `{ compartment, catalogEntry, quantity, expiryDate, reminderDays }` for the in-progress add flow. Reset on flow start and after a successful save. **Edit** on the Review screen navigates back without clearing the draft.

**Selectors (memoized, in `fridgeStore` or `selectors.ts`):**
- `selectItemsByCompartment(id)` sorted by `expiryDate` ascending.
- `selectTotalCount()` — see 6.1.
- `selectCompartmentSummary(id)` → `{ count, expiringSoonCount, expiredCount }`.

**6.1 Item count definition:** the header count is the **number of item entries**, not the sum of quantities. (Example: 3 tomatoes in one entry counts as 1.) Compartment inventory screens show both the entry count and each entry's quantity. If product wants the sum of quantities instead, change only this selector.

## 7. Business Logic

### 7.1 Status (`src/domain/status.ts`)

```ts
daysLeft(expiryDate, today = now) = differenceInCalendarDays(parseISO(expiryDate), startOfDay(today))

getStatus(item, today):
  d = daysLeft(item.expiryDate, today)
  if d < 0                  → 'expired'
  if d <= item.reminderDays → 'expiringSoon'   // includes d === 0 (expires today)
  else                      → 'fresh'
```

**Labels:** `d < 0` → "Expired N day(s) ago"; `d === 0` → "Expires today"; `d === 1` → "Expires tomorrow"; otherwise "Expires in N days". Status is always shown as text or an icon as well as color.

### 7.2 Reminder trigger (`src/domain/reminders.ts`)

```
computeTriggerDate(expiryDate, reminderDays, now):
  trigger = startOfDay(expiryDate - reminderDays days) at 09:00 local time
  if trigger > now                      → return trigger
  expiryDay9am = expiryDate at 09:00 local time
  if expiryDay9am > now                 → return expiryDay9am   // already inside the window
  else                                  → return null           // nothing sensible to schedule
```

The 09:00 delivery time is a constant (`REMINDER_HOUR = 9`) in one place so it can become a setting later.

### 7.3 Validation

- `quantity`: integer, minimum 1, maximum 99. The stepper clamps; the − button disables at 1.
- `expiryDate`: required, must not be before today. `Continue` stays disabled until valid.
- `name`: for custom items (P1), 1 to 40 characters, trimmed.

## 8. Notifications (`src/services/notifications.ts`)

**Setup**
- `Notifications.setNotificationHandler` configured so foreground notifications display as banners.
- Android: create a channel `expiry-reminders` ("Expiry reminders", default importance) on startup.
- Request permission **when the first item is saved**, preceded by a short in-app explanation. If denied, the app keeps working; show a small non-blocking hint on the Review screen ("Turn on notifications to get expiry reminders") with a link to system settings.

**API**

```ts
ensurePermission(): Promise<boolean>
scheduleItemReminder(item: Item): Promise<string | null>   // returns notificationId or null
cancelItemReminder(notificationId: string | null): Promise<void>
reconcileAll(items: Item[]): Promise<void>
```

**Content**
- Title: `GROCIFY`
- Body: `Tomato expires in 2 days` (use the label rules in 7.1; "today" and "tomorrow" variants).
- Data: `{ itemId, compartment }`.

**Behavior**
- Use a date trigger with the value from `computeTriggerDate`. If it returns `null`, store `notificationId: null`.
- **Edit item:** cancel the old notification, then schedule a new one.
- **Delete item:** cancel its notification.
- **Tap handling:** register `addNotificationResponseReceivedListener` in the root layout; on tap, navigate to `/compartment/<compartment>` (P1, FR-R5).

**Reconciliation (important):** on every app launch, after hydration, call `reconcileAll`. It cancels all scheduled GROCIFY notifications and reschedules from the current item list. This keeps reminders correct after reinstalls, OS cleanups, or clock and timezone changes.

**iOS limit:** iOS allows at most **64 pending local notifications** per app. `reconcileAll` must sort items by trigger date ascending and schedule only the soonest 60. Because it re-runs on every launch, later reminders are scheduled as the earlier ones pass.

## 9. UI Implementation Rules

All visual values come from `src/theme/tokens.ts`, which is populated from `UIUX.md`. **No hardcoded colors, font sizes, spacing, or radii in components.**

**Shared components (build once, reuse):**

| Component | Notes |
|---|---|
| `Button` | Primary (filled green, with arrow icon), secondary (text/outline) |
| `ScreenHeader` | Back arrow, compartment icon, title; takes a compartment tint |
| `CompartmentCard` | Icon, name, chevron, `ShelfPreview` |
| `ShelfPreview` | Up to 6 item images in a row, newest first; empty shelf state |
| `QuantityStepper` | − / value / +, clamped 1 to 99, haptic on press |
| `DateField` | Pressable field with calendar icon; opens the date picker; shows `DD / MM / YYYY` placeholder |
| `StatusBadge` | Fresh / Expiring soon / Expired with text and icon |
| `ItemRow` | Image, name, quantity, expiry label, status |
| `EmptyState` | Friendly message and add action |

**Date picker behavior**
- Tapping the field or its calendar icon opens the native picker with `minimumDate` set to today.
- Android: native dialog. iOS: picker presented in a bottom sheet with a Done button.
- The chosen date is displayed as `DD / MM / YYYY` and stored as `YYYY-MM-DD`. Manual typing is out of scope for MVP.

**Compartment theming:** `compartments.ts` defines for each compartment its `id`, `name`, `icon`, and color set (`tint`, `surface`, `accent`, `onAccent`). Screens receive the active compartment and read colors from this single source.

**Safe areas and layout:** use `react-native-safe-area-context` on every screen; support small and large phones; no content hidden behind the notch or home indicator. Full-screen, edge-to-edge layouts.

**Haptics:** light impact on stepper taps, selection feedback on compartment tap, success notification on "Add to fridge".

## 10. Assets Pipeline

- **Item images:** transparent WebP cutouts, max 512 px on the longest side, named `{catalogId}.webp`, stored in `assets/items/`.
- **Fridge art:** welcome fridge, compartment backgrounds, and shelf/glass details exported from the reference screens as WebP at 2x and 3x, stored in `assets/fridge/`.
- **Image map:** `src/data/itemImages.ts` exports an object mapping `imageKey` to `require('../../assets/items/...')`. Metro requires static `require` paths, so no dynamic string building.
- **Rendering:** use `expo-image` with `contentFit="contain"` and `cachePolicy="memory-disk"`.
- **Budget:** total bundled image assets should stay under roughly 15 MB.

## 11. Performance

- Inventory lists use `FlatList` with `keyExtractor`, memoized rows (`React.memo`), and `getItemLayout` where row height is fixed.
- Select store slices with narrow selectors so screens do not re-render on unrelated changes.
- Animations run on the UI thread via Reanimated; avoid animating layout properties on large trees.
- Cold start target: Welcome or Fridge visible within 2 seconds on a mid-range Android phone.
- Avoid large inline images; keep assets compressed.

## 12. Accessibility

- Every pressable has an `accessibilityRole` and `accessibilityLabel` (for example "Add item", "Open Freezer, 4 items").
- Minimum touch target 44 × 44 pt.
- Status uses text and icon in addition to color.
- Support system font scaling; layouts must not clip at larger sizes.
- Meet WCAG AA color contrast for text and controls (verify tokens from `UIUX.md`).

## 13. Error Handling and Edge Cases

| Case | Behavior |
|---|---|
| Notification permission denied | App works; show hint on Review screen and link to settings |
| Storage read fails or data is corrupt | Start with an empty fridge; log the error; never crash |
| Expiry date in the past | `Continue` disabled; inline message "Pick today or a later date" |
| Expiry is today | Allowed; status "Expires today"; reminder scheduled for today 09:00 only if still in the future |
| Reminder time already passed | Per 7.2: schedule at expiry day 09:00 if still ahead, otherwise none |
| User changes device timezone or clock | `reconcileAll` on next launch corrects schedules |
| More than 60 items needing reminders (iOS) | Soonest 60 scheduled; rest on next launch |
| Same item added twice | Stored as separate entries in v1 |
| App killed or restarted mid add-flow | Draft is discarded; user restarts the flow |

## 14. Testing

**Unit tests (Jest)**
- `daysLeft` and `getStatus`, including today, tomorrow, and past dates, and across a daylight saving change.
- `computeTriggerDate` for all three branches in 7.2.
- `date.ts` formatting and parsing between `DD / MM / YYYY` and `YYYY-MM-DD`.
- Store actions: add, update, and remove, with the notifications service mocked and asserting schedule and cancel calls.
- `reconcileAll` ordering and the 60-item cap.

**Component tests (React Native Testing Library)**
- `QuantityStepper` clamping.
- `DateField` disabled and enabled `Continue` behavior.
- `StatusBadge` text for each status.

**Manual test checklist (real device)**
- Full add flow end to end; the Fridge count updates.
- Reminder fires at the expected time (use a near-future expiry for testing).
- Tapping a notification opens the correct compartment.
- Kill and reopen the app; data persists.
- Airplane mode; everything still works.

## 15. Build, Preview, and Release

- **Development:** `npx expo start`; use Expo Go for UI work and a **development build** (`eas build --profile development`) for notification testing.
- **Preview builds:** EAS Build `preview` profile producing an installable Android APK and an iOS internal build, shareable by link or QR code for demos.
- **Production:** EAS Build `production` profile; app version and build numbers managed in `app.json`.
- **Config to set in `app.json`:** app name `GROCIFY`, slug `grocify`, portrait orientation, splash screen using the brand color, Android notification permission, and the iOS notification usage as required by `expo-notifications`.

## 16. Security and Privacy

- No network calls, analytics, or third-party SDKs that collect data in v1.
- No account or personal data collected; all data stays on the device.
- The only runtime permission requested is **notifications**.
- Do not log item data in production builds.

## 17. Future-Proofing (Not in MVP)

- **Storage adapter:** all persistence goes through `services/storage.ts`, so AsyncStorage can be swapped for `expo-sqlite` later if the dataset grows.
- **Sync:** `Item` ids are unique and stable and records carry `addedAt`, which leaves room for a future cloud sync layer.
- **Units:** `quantity` is a plain integer now; a `unit` field can be added through the store `migrate` function.
- **Custom compartments:** the `CompartmentId` union and `compartments.ts` are the only places to extend.

## 18. Requirements Traceability

| PRD area | Implemented in |
|---|---|
| Welcome (8.1) | `app/index.tsx`, `settings.hasSeenWelcome` |
| Fridge (8.2) | `app/fridge.tsx`, `CompartmentCard`, `ShelfPreview`, `selectTotalCount` |
| Item picker (8.3) | `app/add/pick.tsx`, `catalog.ts`, `itemImages.ts` |
| Add (8.4) | `app/add/details.tsx`, `QuantityStepper`, `DateField`, `draftStore` |
| Review (8.5) | `app/add/review.tsx`, `status.ts`, `notifications.ts` |
| Inventory (8.6) | `app/compartment/[id].tsx`, `ItemRow`, `StatusBadge` |
| Reminders (8.7) | `services/notifications.ts`, `domain/reminders.ts` |
| Persistence (8.8) | `fridgeStore.ts`, `services/storage.ts` |

## 19. Open Technical Decisions

1. **Item count:** entries versus sum of quantities (default: entries; see 6.1).
2. **Reminder time:** fixed at 09:00 local (default) or user-configurable.
3. **Storage:** AsyncStorage (default) or `expo-sqlite` from the start.
4. **Item cutout images:** generated from the reference visuals or sourced as a separate asset pack.
5. **Target platforms for the first demo build:** Android only, or both.
