# GROCIFY — UI/UX Specification (UIUX.md)

| | |
|---|---|
| **Product** | GROCIFY |
| **Document** | UIUX v1.0 |
| **Companion docs** | `PRD.md` (what), `TRD.md` (how it is built) |
| **Audience** | Designers, developers, and the AI coding agent (Antigravity) |

> **Rule for the coding agent:** the three reference screens are the source of truth for look and feel. Recreate them faithfully. This document turns them into exact tokens, measurements, and rules, and extends the same visual language to the screens that have not been drawn yet. **Do not invent new styles, colors, fonts, or components.** If something is not covered, reuse the closest existing component and note the choice in `DECISIONS.md`.
>
> Hex values below were sampled from the reference images and rounded. If a value here and the reference image disagree visually, the **reference image wins**; adjust the token and keep it centralized in `src/theme/tokens.ts`.

---

## 1. Reference Screens

Store these in the repo at `docs/reference/`:

| File | Screen | Covers |
|---|---|---|
| `Grocify_Fridge_Welcome_Screen.png` | Welcome | Closed blue fridge, logo, welcome copy, CTA |
| `Smart_Fridge_Inventory_App.png` | Fridge (home) | Three color-coded compartments with item previews |
| `Fridge_Tomato_Add_Item_Screen.png` | Add to Veggies | Item image, name, quantity, expiry date, Continue |

**Not yet drawn (specified in section 9 using the same system):** Item picker, Confirmation / Review, Compartment Inventory, and the Fridge header with item count and **+**.

## 2. Design Principles

1. **It is a real fridge.** Every screen feels like looking into or at a fridge: rounded appliance bodies, glass shelves, soft interior lights, chrome rims, and food sitting on shelves.
2. **Premium and minimal.** Few elements per screen, generous spacing, soft shadows, no clutter, no decorative noise.
3. **Full-screen and edge-to-edge.** The fridge is the screen. No visible app chrome beyond the status bar and the fridge's own parts.
4. **Color means place.** Blue is Freezer, beige is Packed & Miscellaneous, green is Veggies. A compartment's color carries through its entire flow.
5. **Calm motion.** Gentle fades and transitions, never flashy. Motion explains where you are going.
6. **Warm and plain language.** Short, friendly, no jargon, no exclamation-mark overload.

## 3. Foundations

### 3.1 Base viewport and units
- Design base: **393 × 852 pt** (iPhone 15/16 class). All sizes below are in **dp/pt**.
- Layout is flex-based and must adapt from 360 pt to 430 pt wide. Do not hardcode screen heights; panels share height with `flex`.
- Portrait only, light mode only (`userInterfaceStyle: "light"`).
- The **graphite phone frame** seen in the reference images is a **presentation mockup only**. It is not part of the app UI. The real app is full-screen.

### 3.2 Color tokens

**Canvas and neutrals**

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#F2EADC` | App background behind fridge bodies (warm cream) |
| `rim.light` | `#E4E8E7` | Fridge rim highlight |
| `rim.base` | `#C9D0D0` | Fridge rim body (silver) |
| `rim.shadow` | `#A9B2B3` | Fridge rim inner shadow edge |
| `base.body` | `#CBC9C5` | Fridge bottom base panel |
| `base.grille` | `#8E8C88` | Grille bars on the base |
| `foot` | `#3E3E3C` | Fridge feet (home screen) |
| `white` | `#FFFFFF` | Light strips, button text |

**Brand**

| Token | Hex | Use |
|---|---|---|
| `brand.forest` | `#4A7753` | Primary button (Add and Review screens). Use as gradient from `#4C7A56` (top) to `#426F4D` (bottom) |
| `brand.sage` | `#6D8269` | Welcome CTA ("Open My Fridge") |
| `brand.logo` | `#3E5A3C` | GROCIFY wordmark and leaf |
| `ink.slate` | `#1C2B33` | Welcome heading text |
| `ink.slateSoft` | `#3F5260` | "Welcome to" and tagline on the blue fridge |

**Welcome fridge (blue body)**

| Token | Hex | Use |
|---|---|---|
| `fridge.blue.top` | `#BCCFDF` | Door highlight (upper-left) |
| `fridge.blue.mid` | `#B1C5D9` | Door body |
| `fridge.blue.bottom` | `#A9C0D3` | Door shade (lower area) |
| `fridge.handle` | `#DCD9D5` | Door handles (cream-white, with soft top-left highlight) |
| `fridge.foot.blue` | `#4F6E86` | Welcome fridge feet |

**Compartments**

| Token | Freezer | Packed & Misc. | Veggies |
|---|---|---|---|
| `tint` (header pill) | `#D4E3F1` | `#E4DACB` | `#D3E2C9` |
| `surface` (interior) | `#C3D5E8` | `#E8DECE` | `#CBDFC0` |
| `surfaceDeep` (shelf shadow) | `#B6C6DB` | `#D0C0AB` | `#B7CDAA` |
| `accent` (icon circle, buttons) | `#5F96BF` | `#B58E62` | `#4F9565` |
| `onAccent` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| `ink` (title text) | `#1F3F5B` | `#3A2F22` | `#1F4A38` |

**Add / Review screen surfaces (Veggies example; other compartments swap in their own `tint` and `surface`)**

| Token | Veggies hex | Use |
|---|---|---|
| `card.header` | `#DEE9D2` | Header pill |
| `card.name` | `#E5EBD9` | Item name pill |
| `card.panel` | `#E4EBD9` | Form panel |
| `field.bg` | `#F0F3E7` | Date field, stepper pill background |
| `field.border` | `#C3CFBA` | Date field, stepper pill border (1.5 pt) |
| `stepper.button` | `#C2D2B7` | − / + circles |
| `placeholder` | `#69726E` | Placeholder text (meets contrast) |
| `ink.label` | `#213836` | Field labels |
| `ink.helper` | `#304139` | Helper text |
| `ink.title` | `#123A28` | Item name, header title, stepper value |

**Status (always shown with an icon and text, never color alone)**

| Status | Foreground | Background | Icon |
|---|---|---|---|
| Fresh | `#3F7F55` | `#DDEBD6` | `check-circle` |
| Expiring soon | `#9A6410` | `#F6E5C0` | `clock` |
| Expired | `#B23B30` | `#F3D3CE` | `alert-circle` |

### 3.3 Typography

**Typeface: Figtree** (Google Fonts, via `@expo-google-fonts/figtree`). A friendly geometric sans that matches the reference. Load weights 400, 500, 600, 700, 800. Fallback: system sans.

| Token | Size / Line | Weight | Use |
|---|---|---|---|
| `wordmark` | 40 / 44 | 800, letter-spacing +0.5 | GROCIFY logo wordmark |
| `display` | 34 / 40 | 700 | "GROCIFY" in the welcome heading |
| `headline` | 24 / 30 | 500 | "Welcome to" |
| `titleLg` | 28 / 34 | 700 | Item name (Tomato), Review title |
| `titleMd` | 22 / 28 | 600 | Compartment names, screen header titles |
| `bodyLg` | 17 / 24 | 500 | Item row name |
| `body` | 15 / 22 | 400 | Tagline, descriptive text |
| `label` | 14 / 18 | 600 | Field labels (Quantity, Expiry date) |
| `caption` | 13 / 18 | 400 | Helper text, item subtitle |
| `button` | 18 / 22 | 600 | Button text |
| `stepperValue` | 28 / 32 | 600 | Quantity number |
| `fieldValue` | 17 / 22 | 500, letter-spacing +1 | Date text (and placeholder) |

Text is center-aligned on the Welcome screen and left-aligned elsewhere, except the Add screen's item name and "Quantity" label, which are centered as in the reference.

### 3.4 Spacing, radius, elevation

- **Spacing scale (4 pt grid):** `4, 8, 12, 16, 20, 24, 32, 40`.
- **Screen edge inset (fridge rim to screen edge):** 12 pt on Fridge, 10 pt on Add/Review, 20 pt on Welcome.
- **Radius tokens:** `sm 12`, `md 18` (date field), `lg 24` (cards, pills, panels), `xl 28` (primary button on Add), `full 999` (circles, stepper, welcome CTA).
- **Elevation (soft, warm, low contrast):**
  - `elev1`: offset 0/2, blur 6, color `#000000` at 8%.
  - `elev2`: offset 0/6, blur 16, color `#000000` at 12%.
  - `elevFridge`: offset 0/16, blur 32, color `#000000` at 18% (the whole fridge body floating on the canvas).
- **Glass and rim:** surfaces that are "glass" (shelves, door trays) use a 1 pt inner border of `rgba(255,255,255,0.6)` and a bottom shadow of `rgba(0,0,0,0.08)`.

### 3.5 Iconography
- Library: `lucide-react-native`. Stroke width 2, size 24 (20 inside small badges), color from the context's ink or `onAccent`.
- Icon map:

| Use | Icon |
|---|---|
| Freezer | `snowflake` |
| Packed & Miscellaneous | `package` |
| Veggies | `leaf` |
| Compartment row chevron | `chevron-right` |
| Back | `chevron-left` |
| Expiry date | `calendar-days` |
| Stepper | `minus`, `plus` |
| Continue | `arrow-right` |
| Confirm | `check` |
| Reminder | `bell` |
| Delete | `trash-2` |
| Search | `search` |
| Add | `plus` |

- **Compartment icon circle:** 44 pt circle filled with the compartment `accent`, glyph 22 pt in `onAccent` (white). A subtle inner top highlight (white at 20%) gives it a soft, slightly glossy look.

### 3.6 Imagery
- **Item images:** photoreal, soft-lit, transparent-background cutouts with a faint contact shadow ellipse beneath. Light comes from the top-left. Consistent saturation across all items. 512 px max, WebP.
- **Fridge art:** the interiors, glass shelves, and light strips are layered assets plus code-drawn gradients. Prefer code (gradients, borders, shadows) for rims, pills, and shelves; use bitmap art only for the welcome fridge texture and item photos.

## 4. Core Components

### 4.1 Compartment icon circle
44 × 44, `full` radius, fill `accent`, centered 22 pt white glyph. On the Add/Review headers it is 52 × 52.

### 4.2 Header pill (compartment header)
- Height 56, radius `lg` (24), fill compartment `tint`, 1 pt inner white border at 60%, `elev1`.
- Left padding 10. Contents: icon circle, 12 gap, title in `titleMd` + compartment `ink`. On the Fridge screen a `chevron-right` (24, compartment `ink`) sits at the right with 16 padding.
- On Add/Review screens, a `chevron-left` back button (24, `ink`, 44 × 44 touch area) sits **left of** the icon circle, then the circle, then the title ("Add to Veggies").

### 4.3 Light strip
A white rounded bar at the top of every compartment interior, simulating the fridge light: height 6, width 70% of the panel, radius `full`, fill white at 80%, with a soft glow (blur 12, white at 50%). Static in v1.

### 4.4 Primary button (Add / Review)
- Height 64, full width of its container (inset 4 inside the rim), radius `xl` (28).
- Fill: vertical gradient `#4C7A56` → `#426F4D`; top inner highlight line `rgba(255,255,255,0.25)`; `elev2`.
- Label `button` in white, centered; `arrow-right` icon (26) pinned at the right with 24 padding (`check` on the Review screen).
- Disabled: fill `#9DB5A3`, label white at 85%, no shadow, no arrow animation.
- Pressed: scale 0.98 over 90 ms, gradient darkens 6%.

### 4.5 Welcome CTA ("Open My Fridge")
- Height 48, width 200, radius `full`, solid `brand.sage`, label in white `button` (17), `arrow-right` (20) after the label with 8 gap, `elev1`. Centered.

### 4.6 Quantity stepper
- Pill, width 220, height 60, radius `full`, fill `field.bg`, border 1.5 `field.border`.
- Two 44 pt circles (`stepper.button`) at left and right with 8 inset; glyphs `minus` and `plus`, 22 pt, color `ink.title`.
- Value centered, `stepperValue`, `ink.title`.
- − disabled at 1 (glyph at 35% opacity). + disabled at 99. Light haptic on every tap.

### 4.7 Date field
- Full width of the panel, height 52, radius `md` (18), fill `field.bg`, border 1.5 `field.border`.
- Left: `calendar-days` icon (24, `#2F4A47`) with 16 padding, then 12 gap, then text.
- Empty: `DD / MM / YYYY` in `placeholder`. Filled: same format in `ink.title`, `fieldValue`.
- The whole field is pressable and opens the native date picker (minimum date today).
- Error state: border `#B23B30`, helper text replaced with "Pick today or a later date" in `#B23B30`.

### 4.8 Name pill
Full width, height 60, radius `lg`, fill `card.name`, centered `titleLg` text in `ink.title`, 1 pt inner white border at 60%.

### 4.9 Status badge
Pill, height 28, horizontal padding 10, radius `full`, background and foreground from the status table, 16 pt icon, 6 gap, `caption` weight 600 label (for example "Expires in 5 days").

### 4.10 Fridge base
Light gray panel at the bottom of the Fridge screen: height 64, fill `base.body`, top radius 0, bottom radius 20, with two grille bars centered (168 × 4, radius 2, `base.grille`, 8 gap), and two feet (28 × 10, radius 4, `foot`) at the bottom left and right corners, inset 28.

## 5. Screen 1: Welcome

**Reference:** `Grocify_Fridge_Welcome_Screen.png`

**Layout (top to bottom)**
- Canvas `canvas` fills the screen. Safe area respected.
- **Fridge body** floats centered, inset 20 from the left and right edges, extending from just below the status bar to about 40 above the bottom safe area. Two-door retro fridge:
  - **Freezer door** (top): about 22% of the fridge height, top radius 24, bottom radius 8.
  - **Main door** (bottom): the remaining height, top radius 8, bottom radius 24.
  - A 2 pt dark seam (`rgba(60,80,100,0.35)`) between the doors, with a 1 pt highlight below it.
  - Both doors: vertical gradient `fridge.blue.top` → `fridge.blue.mid` → `fridge.blue.bottom`, a soft vertical sheen band on the right third (white at 12%), `elevFridge`.
  - **Handles:** vertical rounded bars, width 17, radius 9, `fridge.handle`, with a soft shadow to the right. Left-aligned at 24 from the door's left edge. Freezer handle height about 105, vertically centered in its door. Main handle height about 300, starting about 24 below the seam.
  - **Feet:** two small rounded feet (`fridge.foot.blue`, 34 × 12, radius 6) under the body at left and right, inset 30.
- **Content group** centered horizontally in the main door, vertically centered in the area right of the handle:
  1. **Logo:** GROCIFY wordmark (`wordmark`, `brand.logo`) with a small two-leaf sprout (24 × 20) above the "O". Embossed look: 1 pt white highlight at the bottom-right of the letters.
  2. 40 gap, then "Welcome to" (`headline`, `ink.slateSoft`).
  3. "GROCIFY" (`display`, `ink.slate`), 4 below.
  4. 28 gap, then the tagline in `body`, `ink.slateSoft`, centered, max width 250, 3 lines: *"Your fridge, perfectly organized. Keep track of your groceries and never lose sight of expiry dates."*
  5. 36 gap, then the **Open My Fridge** CTA (section 4.5).

**Behavior**
- Tapping the CTA triggers the Welcome → Fridge transition (section 8).
- The welcome screen is shown on first launch only.

## 6. Screen 2: Fridge (Home)

**Reference:** `Smart_Fridge_Inventory_App.png`

**Layout (top to bottom)**
- Canvas `canvas`. Status bar area on top.
- **Compact header (new, 48 tall):** left, small wordmark ("GROCIFY", 18 / 700, `brand.logo`, with a 14 pt leaf). Right, a **count chip** (height 32, radius `full`, fill `#E6E9DC`, text `caption` 600 `ink.title`, for example "12 items", with a 16 pt box icon) and a **+ button** (40 × 40 circle, `brand.forest`, white `plus` 22, `elev1`), 10 apart. Header horizontal padding 16.
- **Fridge body** below the header, inset 12 from the screen edges: outer rim in `rim.*` gradient (width 6 around), 1 pt white inner highlight, radius 28, `elevFridge`.
- Inside the rim, **three compartment panels stacked**, separated by 6 pt glass dividers (`rim.light` to `rim.base`). Panels share the height equally (`flex: 1` each; Veggies may be slightly shorter to fit the base).
- **Fridge base** (section 4.10) closes the fridge at the bottom.

**Compartment panel**
- Radius 20 (top corners of the first panel 24), interior fill is a vertical gradient from compartment `surface` (top) to `surfaceDeep` (bottom edge), 1 pt inner white border at 50%.
- **Light strip** (section 4.3) 8 from the top.
- **Header pill** (section 4.2) 14 below the light strip, inset 12 from the panel sides: icon circle, name, chevron.
- **Shelf area** below the pill: a recessed glass shelf. Items stand on the shelf bottom edge. A glass shelf line (2 pt, white at 60%, with a 1 pt shadow below) runs along the bottom of the panel, inset 10.
- **Shelf preview (item row):** up to 6 item images in a row, bottom-aligned on the shelf, each about 72 pt tall, slightly overlapping (−8) if they do not fit, newest first, each with a soft contact shadow. Empty compartments show the empty shelf only, plus a faint centered caption "Empty" (`caption`, compartment `ink` at 50%).
- **Expiry badge (P1):** a 20 pt red or amber dot with `alert-circle` at the top-right of the header pill when the compartment holds expiring or expired items.

**Default compartment content (sample data for demo mode):**
- Freezer: ice cream, green peas, frozen pizza, two plastic tubs.
- Packed & Miscellaneous: milk carton, tomato sauce jar, pasta jar, eggs in a tray, cereal box, nuts jar, cheese, two small containers.
- Veggies: tomatoes, lettuce, brinjal, cucumbers, carrots, broccoli, yellow and red capsicum.

**Behavior**
- Tap anywhere on a compartment panel (not only the pill) to open its inventory. Pressed state: panel scales to 0.985.
- The **+** opens the Item picker with compartment chips visible (section 9.1).

## 7. Screen 3: Add to [Compartment]

**Reference:** `Fridge_Tomato_Add_Item_Screen.png`

The whole screen is the **door-tray interior of the compartment**, in that compartment's color. Shown here for Veggies.

**Layout (top to bottom)**
- Canvas `canvas`; status bar.
- **Fridge rim frame:** inset 10 from the screen edges, silver rim (width 12) using `rim.*` gradient with a white inner highlight and inner shadow, radius 28, extends down to the bottom safe area minus 12.
- Inside the rim, a vertical stack with 12 gaps and 12 side padding:
  1. **Header pill** (section 4.2) with back arrow, icon circle (52), title "Add to Veggies" (`titleMd`). Height 72 here.
  2. **Item showcase cavity:** height about 258, radius 20, fill is the compartment interior gradient (light green, brighter at the center top), a **light strip** (6 high, 64% width, centered, 16 from the top), faint back-wall panel lines, and a **glass shelf** along the bottom (2 pt white line, 14 pt translucent glass band with `rgba(255,255,255,0.35)`). The item image (about 190 pt tall, contain) sits on the shelf, with its contact shadow. A sliced piece beside the whole item is allowed for produce when the asset has it.
  3. **Name pill** (section 4.8): the item name, for example "Tomato".
  4. **Form panel:** radius `lg`, fill `card.panel`, padding 16, 1 pt inner white border at 50%. Contents, centered:
     - Label "Quantity" (`label`, `ink.label`).
     - **Quantity stepper** (section 4.6), 8 below the label.
     - 16 gap; label "Expiry date" (`label`, left-aligned).
     - **Date field** (section 4.7), 8 below.
     - Helper text centered, 10 below: *"We'll remind you before it expires."* (`caption`, `ink.helper`).
  5. **Continue** primary button (section 4.4), pinned at the bottom inside the rim.

**Behavior**
- `Continue` is disabled until a valid, non-past expiry date is chosen.
- The back arrow returns to the Item picker, keeping the draft.
- Compartment color theming: Freezer uses blue tokens and a snowflake circle; Packed uses beige and the box icon; Veggies uses green and the leaf. The primary button stays `brand.forest` in all compartments.

## 8. Motion

Easing tokens: `standard = cubic-bezier(0.4, 0, 0.2, 1)`, `decelerate = cubic-bezier(0.2, 0.8, 0.2, 1)`, `accelerate = cubic-bezier(0.4, 0, 1, 1)`.

| Interaction | Animation | Duration |
|---|---|---|
| **Welcome → Fridge** | CTA press scale to 0.97 (90 ms). The welcome fridge scales 1.0 → 1.04 and fades out while the Fridge screen fades in underneath (cross-fade, overlapping) | 450 ms, `standard` |
| **Fridge → Compartment inventory** | The tapped panel expands (scale about 1.0 → fill) and cross-fades into the inventory screen; the other panels fade to 0 over the first 200 ms | 350 ms, `decelerate` |
| **Inventory → Fridge (back)** | Reverse of the above | 300 ms, `standard` |
| **Add flow screens (picker → details → review)** | Horizontal slide from the right with a slight fade; back slides out to the right | 300 ms, `standard` |
| **Save → Fridge** | Fade back to the Fridge | 350 ms, `standard` |
| **Item added feedback** | Header count chip scales 1.0 → 1.15 → 1.0; the target compartment shows a soft glow pulse (accent at 0 → 40% → 0) | 200 ms and 600 ms |
| **Press feedback** (buttons, panels, rows) | Scale to 0.97–0.985 | 90 ms in, 120 ms out |
| **Stepper value change** | Number cross-fades with a 4 pt vertical slide | 120 ms |
| **List item delete** | Row collapses height and fades | 220 ms, `accelerate` |

**Reduced motion:** if the system "reduce motion" setting is on, remove all scale and slide effects and use opacity cross-fades only (200 ms).

**Haptics:** light impact on stepper taps and Continue; selection feedback on compartment taps and item selection; success notification on "Add to fridge"; warning on delete confirmation.

## 9. Screens Not Yet Drawn (Same System)

These follow the same fridge-interior frame, tokens, and components as the Add screen. Build them exactly as described.

### 9.1 Item picker (`/add/pick`)
- **Frame:** same rim and layout as the Add screen, in the active compartment's colors.
- **Header pill:** back arrow, icon circle, title "Add to Veggies". When no compartment is preselected, the title is "Add item" with a neutral `tint` (`#E4E8DC`), and a **compartment selector** row sits below it: three chips (height 44, radius `full`), each with its icon circle (28) and name; the selected chip is filled with its `accent` and white text, the others use their `tint` and `ink`.
- **Search field:** same style as the date field, `search` icon, placeholder "Search items".
- **Item grid:** 3 columns, 12 gap, scrolls vertically. **Tile:** radius `lg`, fill compartment `tint` at 70%, 1 pt inner white border, height 124. Item image 64 pt (contain) centered in the upper area, name below in `label` (centered, 1–2 lines, `ink`). Pressed: scale 0.97.
- **Custom item tile (P1):** dashed border (1.5, compartment `accent` at 60%), `plus` icon 28 in `accent`, label "Custom item".
- Tapping a tile goes straight to the Add screen with that item prefilled (no extra Continue).
- **Empty search result:** centered `body` text "No items match. Try another name."

### 9.2 Confirmation / Review (`/add/review`)
- **Frame:** same as Add, in the compartment's colors. Header title "Review" with the back arrow (back to Add, draft kept).
- **Showcase cavity:** shorter version (height about 190) with the item image (140 pt).
- **Summary card:** radius `lg`, fill `card.panel`, padding 16, stacked with 12 gaps:
  1. Item name (`titleLg`, `ink.title`), left-aligned, with a **quantity chip** at the right ("× 3": height 32, radius `full`, fill `field.bg`, `label`).
  2. **Compartment row:** small icon circle (28) plus compartment name (`bodyLg`).
  3. **Expiry row:** `calendar-days` icon plus the date formatted like "12 Dec 2026" (`bodyLg`).
  4. **Status badge** (section 4.9), for example "Expires in 5 days".
  5. **Reminder row:** `bell` icon, label "Remind me", and a **chip group** of options: `1 day`, `2 days`, `3 days`, `1 week` before. Chip height 36, radius `full`; selected chip filled with `brand.forest` and white text, others use `field.bg` with `field.border`. Default selection is 2 days. A line under the group in `caption`: "You'll get a notification on the morning of that day."
  6. If notification permission is denied: an inline notice (radius `md`, fill `#F6E5C0`, `clock` icon, `caption` text "Turn on notifications to get expiry reminders." plus a "Settings" text link).
- **Actions at the bottom:** primary **Add to fridge** button (with `check` icon, section 4.4), and below it a centered text button **Edit** (`button` size, weight 500, `ink.title`, 44 pt touch target).

### 9.3 Compartment Inventory (`/compartment/[id]`)
- **Frame:** same rim and layout as the Add screen, in the compartment's colors, full screen.
- **Header pill:** back arrow, icon circle (52), compartment name (`titleMd`), and at the right a **count chip** ("6 items") and a **+** button (40 circle, compartment `accent`, white `plus`).
- **Light strip** under the header.
- **List** (scrollable) of item rows, sorted by soonest expiry first, 10 gap, inside the cavity:
  - **Item row:** height 76, radius `lg`, fill compartment `tint` at 80%, 1 pt inner white border, `elev1`.
  - Left: 60 × 60 rounded square (radius 16, fill white at 55%) with the item image (48 pt, contain), 12 padding.
  - Middle: name (`bodyLg`, `ink`) and subtitle (`caption`): "Qty 3 · Expires 12 Dec".
  - Right: **status badge**.
  - **Swipe left** reveals a delete action (fill `#B23B30`, white `trash-2`, width 80). Tap deletes only after a confirmation sheet ("Remove Tomato?" with "Remove" and "Cancel").
  - **Tap a row** opens an **edit sheet** (bottom sheet, radius 28 at the top, fill `card.panel`): item image and name, quantity stepper, date field, reminder chip group, **Save** primary button.
- **Empty state:** centered, an empty glass shelf illustration (code-drawn: 2 pt white line, glass band, faint dashed rounded outline of an item), title "Nothing here yet" (`titleMd`, compartment `ink`), `body` "Add your first item to this compartment.", and a primary button **Add item**.

### 9.4 Notification permission prompt (pre-prompt)
Bottom sheet shown before the system prompt when the first item is saved: bell icon circle (52, `brand.forest`), title "Stay ahead of expiry" (`titleMd`), body "Allow notifications and GROCIFY will remind you before your food expires." (`body`), primary **Allow notifications** and a text button **Not now**.

## 10. Content and Microcopy

| Place | Text |
|---|---|
| Welcome heading | Welcome to GROCIFY |
| Welcome tagline | Your fridge, perfectly organized. Keep track of your groceries and never lose sight of expiry dates. |
| Welcome CTA | Open My Fridge |
| Compartment names | Freezer, Packed & Miscellaneous, Veggies |
| Add header | Add to {Compartment} |
| Add labels | Quantity, Expiry date |
| Date placeholder | DD / MM / YYYY |
| Add helper | We'll remind you before it expires. |
| Add button | Continue |
| Review button | Add to fridge |
| Review secondary | Edit |
| Status labels | Fresh, Expiring soon, Expired; "Expires today", "Expires tomorrow", "Expires in N days", "Expired N days ago" |
| Empty compartment (fridge) | Empty |
| Empty compartment (inventory) | Nothing here yet |
| Delete confirmation | Remove {item}? |
| Date error | Pick today or a later date |

**Voice:** warm, short, plain English. No jargon, no slang, no exclamation marks in system messages.

## 11. Accessibility

- Touch targets at least 44 × 44 pt (visual size can be smaller, with `hitSlop`).
- Text contrast at least 4.5:1 for body text and 3:1 for large text and icons. Verify every `ink` on its `tint` or `surface`.
- Status is conveyed with icon plus text plus color.
- All interactive elements have `accessibilityRole` and `accessibilityLabel`, for example "Open Freezer, 4 items" and "Increase quantity".
- Support dynamic type up to 130% without clipping; panels grow, not truncate.
- Respect reduced motion (section 8).

## 12. Implementation Mapping to `tokens.ts`

```ts
// src/theme/tokens.ts (shape; values from section 3)
export const colors = {
  canvas: '#F2EADC',
  rim: { light: '#E4E8E7', base: '#C9D0D0', shadow: '#A9B2B3' },
  base: { body: '#CBC9C5', grille: '#8E8C88' },
  foot: '#3E3E3C',
  brand: { forest: '#4A7753', forestTop: '#4C7A56', forestBottom: '#426F4D', sage: '#6D8269', logo: '#3E5A3C' },
  ink: { slate: '#1C2B33', slateSoft: '#3F5260', title: '#123A28', label: '#213836', helper: '#304139' },
  placeholder: '#69726E',
  field: { bg: '#F0F3E7', border: '#C3CFBA' },
  stepperButton: '#C2D2B7',
  fridgeBlue: { top: '#BCCFDF', mid: '#B1C5D9', bottom: '#A9C0D3', handle: '#DCD9D5', foot: '#4F6E86' },
  status: {
    fresh: { fg: '#3F7F55', bg: '#DDEBD6' },
    expiringSoon: { fg: '#9A6410', bg: '#F6E5C0' },
    expired: { fg: '#B23B30', bg: '#F3D3CE' },
  },
} as const;

export const compartmentTheme = {
  freezer: { tint: '#D4E3F1', surface: '#C3D5E8', surfaceDeep: '#B6C6DB', accent: '#5F96BF', onAccent: '#FFFFFF', ink: '#1F3F5B' },
  packed:  { tint: '#E4DACB', surface: '#E8DECE', surfaceDeep: '#D0C0AB', accent: '#B58E62', onAccent: '#FFFFFF', ink: '#3A2F22' },
  veggies: { tint: '#D3E2C9', surface: '#CBDFC0', surfaceDeep: '#B7CDAA', accent: '#4F9565', onAccent: '#FFFFFF', ink: '#1F4A38' },
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 } as const;
export const radius = { sm: 12, md: 18, lg: 24, xl: 28, full: 999 } as const;

export const motion = {
  fast: 90, base: 200, slide: 300, compartment: 350, fade: 450,
  easing: { standard: [0.4, 0, 0.2, 1], decelerate: [0.2, 0.8, 0.2, 1], accelerate: [0.4, 0, 1, 1] },
} as const;
```

## 13. Do and Don't (for the coding agent)

**Do**
- Match the reference screens first, then apply this document.
- Pull every color, size, radius, and duration from `tokens.ts`.
- Keep the compartment color theming consistent across picker, add, review, and inventory.
- Build each reusable component once and reuse it.
- Use code-drawn gradients, borders, and shadows for rims, pills, and shelves.

**Don't**
- Don't add new colors, fonts, icon sets, or component styles.
- Don't use stock Material or iOS default controls for the stepper, date field, or buttons; use the custom ones described here (the native date picker itself is allowed).
- Don't put the graphite phone frame inside the app.
- Don't convey status with color alone.
- Don't add dark mode, extra animations, or decorative elements that are not specified.
- Don't paste the fridge image onto the welcome screen as a flat picture; build the layered fridge as described.
