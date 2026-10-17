# GROCIFY — Architectural & Design Decisions

This document tracks all design and technical decisions made during the build.

## Phase 1 Decisions
- **Workspace layout:** Initialized the Expo app directly in repository root `g:\grocify` with specs organized under `docs/` and images in `docs/reference/` for clean repository hierarchy.
- **Image strategy:** Using `ItemImagePlaceholder` component via `src/data/itemImages.ts` for all 28 catalog items during early phases, documenting missing image files in `docs/ASSETS_NEEDED.md`.
- **Preview and testing workflow:** Primary preview via Expo Go / dev client and automated Jest unit and store test suites.
- **Dev-only gallery & seeder:** Supporting both `/_dev/gallery` route and long-press on GROCIFY header wordmark to seed sample shelf items, strictly gated behind `__DEV__`.
- **Notifications stub in Phase 1:** Notifications service stubbed to return `null` and resolve no-ops in Phase 1–5 to isolate store and domain tests from native modules.
