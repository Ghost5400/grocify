# GROCIFY — Architectural & Design Decisions

This document tracks all design and technical decisions made during the build.

## Phase 1 Decisions
- **Workspace layout:** Initialized the Expo app directly in repository root `g:\grocify` with specs organized under `docs/` and images in `docs/reference/` for clean repository hierarchy.
- **Image strategy:** Using `ItemImagePlaceholder` component via `src/data/itemImages.ts` for all 28 catalog items during early phases, documenting missing image files in `docs/ASSETS_NEEDED.md`.
- **Preview and testing workflow:** Primary preview via Expo Go / dev client and automated Jest unit and store test suites.
- **Dev-only gallery & seeder:** Supporting both `/_dev/gallery` route and long-press on GROCIFY header wordmark to seed sample shelf items, strictly gated behind `__DEV__`.
- **Notifications stub in Phase 1:** Notifications service stubbed to return `null` and resolve no-ops in Phase 1–5 to isolate store and domain tests from native modules.

## Phase 2 Decisions
- **Cross-platform SVG Gradients:** Standardized `PrimaryButton` vertical gradient and highlights using `react-native-svg` (`Svg`, `Defs`, `LinearGradient`, `Stop`, `Rect`) to ensure pixel-perfect appearance across iOS, Android, and Web without undeclared native packages.
- **Platform-adaptive DateField:** Implemented native `@react-native-community/datetimepicker` inside an iOS bottom sheet modal with "Done", direct Android dialog, and HTML5 native date input overlay on Web.
- **Vercel deployment setup:** Added `"web"` configuration in `app.json`, installed `@expo/metro-runtime`, `react-dom`, and `react-native-web`, added `build` script in `package.json`, and created `vercel.json` for zero-configuration Vercel deployment.
- **Reanimated & Test Setup for React 19:** Configured `jest.setup.js` with `react-native-reanimated` mock, Lucide icon proxy mock, and async test-renderer compatibility for `@testing-library/react-native` v14.

## Phase 3 Decisions
- **ScrollView wrapper for Welcome:** Wrapped the Welcome fridge in a `ScrollView` (bounces off) to gracefully handle very small devices (< 667 pt height) without content clipping, while still feeling fridge-like on standard sizes.
- **Compartment panel transition = scale 0.985 + haptic (not shared-element expansion):** Shared-element expansion with Reanimated Layout requires a development build. The UIUX Section 8 spec explicitly allows a fade-with-scale fallback; scale 0.985 is implemented and looks faithful. Recorded here per Kickoff Section 5.
- **`StyleSheet.absoluteFill` not `absoluteFillObject`:** RN 0.88 with the new TypeScript typegen removed `absoluteFillObject` from the `StyleSheet` type; `absoluteFill` (a StyleProp spread) is the correct equivalent.
- **`react-native-svg` mock completeness:** Added all 20+ SVG element mocks (`Path`, `Circle`, `G`, `ClipPath`, etc.) to `jest.setup.js` because the Phase 3 `SproutLogo` component introduces `Path` which was absent from the Phase 2 mock, causing test failures.
- [x] Phase 3 Task 3.11 Decision: **Dev menu via long-press on wordmark:** Long-press (500 ms delay) on the compact header wordmark opens an action sheet (iOS) / Alert (Android+Web) offering seed, clear, and gallery actions; invisible in production builds.

## Phase 4 Decisions
- **ItemShowcaseCavity as shared component:** Both Add Details and Review screens share the same `ItemShowcaseCavity` component with a configurable `height` prop (260 pt in Details, 190 pt in Review) rather than duplicating the cavity rendering logic. This keeps the glass shelf, light strip, and gradient exactly consistent.
- **Draft store drives Add Flow state — no prop drilling:** All three screens (Pick → Details → Review) read from `useDraftStore` directly. Navigation between them is a plain `router.push('/add/details')` rather than passing params, keeping screen files thin and avoiding deep prop chains.
- **`isHighlighted` glow pulse on `CompartmentPanel`:** The post-save success animation is a 600 ms Reanimated `withTiming` opacity pulse (0 → 0.4 → 0) on a full-size accent-colored overlay inside `CompartmentPanel`. This is driven by an `isHighlighted` prop from `app/fridge.tsx` reading `justAdded` route param — avoids a global event bus or shared Reanimated value.
- **Notifications stubbed to Phase 6:** `setReminderDays` is stored in the fridge item but no actual notification is scheduled. The stub returns `null` in `src/services/notifications.ts`; full scheduling lands in Phase 6 when EAS and permissions are configured.
- **No unawaited `act()` in synchronous `beforeEach`:** React 19 always returns a thenable from `act()`. Calling it without `await` in a synchronous `beforeEach` causes React to schedule work that bleeds into the next test's `render()`, breaking all element queries. Store mutations on unmounted state (i.e., before any `render`) need no `act()` at all — call Zustand store methods directly.
- **`jest.setTimeout(15000)` for ItemPicker:** VirtualizedList schedules item batch rendering via `setTimeout(0)`. In Jest without fake timers, `waitFor` polls at 50 ms intervals; tests that assert on item grid changes after a state update need enough budget for VirtualizedList's internal scheduling. 15 s is comfortable without making the suite slow overall.
