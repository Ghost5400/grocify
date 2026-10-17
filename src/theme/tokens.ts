// src/theme/tokens.ts
// Single source of truth for colors, typography, spacing, radius, elevation, and motion.
// Derived directly from UIUX.md sections 3 and 12.

export const colors = {
  canvas: '#F2EADC',
  white: '#FFFFFF',
  rim: {
    light: '#E4E8E7',
    base: '#C9D0D0',
    shadow: '#A9B2B3',
  },
  base: {
    body: '#CBC9C5',
    grille: '#8E8C88',
  },
  foot: '#3E3E3C',
  brand: {
    forest: '#4A7753',
    forestTop: '#4C7A56',
    forestBottom: '#426F4D',
    sage: '#6D8269',
    logo: '#3E5A3C',
  },
  ink: {
    slate: '#1C2B33',
    slateSoft: '#3F5260',
    title: '#123A28',
    label: '#213836',
    helper: '#304139',
  },
  placeholder: '#69726E',
  field: {
    bg: '#F0F3E7',
    border: '#C3CFBA',
  },
  stepperButton: '#C2D2B7',
  fridgeBlue: {
    top: '#BCCFDF',
    mid: '#B1C5D9',
    bottom: '#A9C0D3',
    handle: '#DCD9D5',
    foot: '#4F6E86',
  },
  card: {
    header: '#DEE9D2',
    name: '#E5EBD9',
    panel: '#E4EBD9',
  },
  status: {
    fresh: {
      fg: '#3F7F55',
      bg: '#DDEBD6',
    },
    expiringSoon: {
      fg: '#9A6410',
      bg: '#F6E5C0',
    },
    expired: {
      fg: '#B23B30',
      bg: '#F3D3CE',
    },
  },
} as const;

export const compartmentTheme = {
  freezer: {
    tint: '#D4E3F1',
    surface: '#C3D5E8',
    surfaceDeep: '#B6C6DB',
    accent: '#5F96BF',
    onAccent: '#FFFFFF',
    ink: '#1F3F5B',
  },
  packed: {
    tint: '#E4DACB',
    surface: '#E8DECE',
    surfaceDeep: '#D0C0AB',
    accent: '#B58E62',
    onAccent: '#FFFFFF',
    ink: '#3A2F22',
  },
  veggies: {
    tint: '#D3E2C9',
    surface: '#CBDFC0',
    surfaceDeep: '#B7CDAA',
    accent: '#4F9565',
    onAccent: '#FFFFFF',
    ink: '#1F4A38',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 28,
  full: 999,
} as const;

export const motion = {
  fast: 90,
  base: 200,
  slide: 300,
  compartment: 350,
  fade: 450,
  easing: {
    standard: [0.4, 0, 0.2, 1] as const,
    decelerate: [0.2, 0.8, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
  },
} as const;

export const fontNames = {
  regular: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semiBold: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
  extraBold: 'Figtree_800ExtraBold',
} as const;

export const typography = {
  wordmark: {
    fontFamily: fontNames.extraBold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: 0.5,
  },
  display: {
    fontFamily: fontNames.bold,
    fontSize: 34,
    lineHeight: 40,
  },
  headline: {
    fontFamily: fontNames.medium,
    fontSize: 24,
    lineHeight: 30,
  },
  titleLg: {
    fontFamily: fontNames.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  titleMd: {
    fontFamily: fontNames.semiBold,
    fontSize: 22,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: fontNames.medium,
    fontSize: 17,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontNames.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    fontFamily: fontNames.semiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  caption: {
    fontFamily: fontNames.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    fontFamily: fontNames.semiBold,
    fontSize: 18,
    lineHeight: 22,
  },
  stepperValue: {
    fontFamily: fontNames.semiBold,
    fontSize: 28,
    lineHeight: 32,
  },
  fieldValue: {
    fontFamily: fontNames.medium,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 1,
  },
} as const;

export const elevation = {
  elev1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  elev2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  elevFridge: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;
