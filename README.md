# GROCIFY 🥦❄️📦

> **Your fridge, perfectly organized.**  
> Keep track of your groceries and never lose sight of expiry dates.

GROCIFY is a minimal, offline-first mobile application that transforms your smartphone into a virtual fridge. Rather than maintaining tedious spreadsheet-style lists, groceries are visualized inside three realistic, color-coded compartments—**Freezer**, **Packed & Miscellaneous**, and **Veggies**—with proactive local expiry notifications to help eliminate food waste.

---

## Features

- **Virtual Fridge Metaphor:** Seamless tactile interface featuring code-drawn brushed silver fridge rim, retro door styling, glass shelving, and illuminated compartment cavities.
- **Three Dedicated Compartments:**
  - ❄️ **Freezer** (Cool Blue `#D4E3F1` / `#5F96BF`): Frozen produce, prepared meals, ice cream.
  - 📦 **Packed & Miscellaneous** (Warm Beige `#E4DACB` / `#B58E62`): Dairy, jars, bread, eggs, staples.
  - 🥦 **Veggies** (Crisp Garden Green `#D3E2C9` / `#4F9565`): Fresh vegetables, herbs, and produce.
- **Intuitive Add Flow:** 3-column illustrated item picker, quantity stepper (1–99), calendar date picker, and confirmation review card with customizable expiry reminder lead times (1 day, 2 days, 3 days, 1 week).
- **Compartment Inventory:** Sorts items automatically by soonest expiry first, with swipe-to-delete gestures, interactive item edit sheet, and safe deletion confirmation.
- **Automated Local Reminders:** Proactive local push notifications scheduled at 09:00 AM on reminder dates, with Android notification channels, iOS 60-notification reconciliation on startup, and deep linking directly into the relevant compartment.
- **Privacy & Offline First:** Zero external network dependencies, no telemetry or account tracking; all data persists locally on the device using AsyncStorage.

---

## Tech Stack

- **Framework:** Expo SDK 58 (Managed Workflow) & React Native 0.88
- **Language:** TypeScript 5.8 (Strict Mode)
- **Routing:** Expo Router v58 (File-based navigation)
- **State Management:** Zustand v5 with AsyncStorage persistence
- **Animation & Gestures:** React Native Reanimated & React Native Gesture Handler
- **Notifications:** Expo Notifications (`expo-notifications`)
- **Icons & Graphics:** Lucide React Native, React Native SVG, Expo Image
- **Testing:** Jest, Jest Expo, React Native Testing Library

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Ghost5400/grocify.git
cd grocify

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Metro bundler / Expo dev server
npx expo start

# Run on iOS Simulator (macOS required)
npm run ios

# Run on Android Emulator / Connected Device
npm run android

# Run on Web Preview
npm run web
```

---

## Verification & Testing

Run all code quality and test validation suites:

```bash
# Typecheck TypeScript codebase
npm run typecheck

# Lint with ESLint
npm run lint

# Run all unit and integration test suites
npm test

# Build production static web bundle
npm run build
```

---

## EAS Build & Release

GROCIFY is configured for cloud and local builds via Expo Application Services (EAS):

```bash
# Install EAS CLI globally if not already installed
npm install -g eas-cli

# Development Build (for testing native notifications on physical devices)
eas build --profile development --platform android

# Preview Build (generates installable Android standalone APK)
eas build --profile preview --platform android

# Production Release Build
eas build --profile production --platform all
```

Configuration profiles are defined in [`eas.json`](./eas.json).

---

## License

Private repository — All rights reserved.
