// src/data/compartments.ts
// Metadata and configuration for the three fridge compartments.

import { CompartmentId, CompartmentInfo } from '../domain/types';

export const COMPARTMENTS: Record<CompartmentId, CompartmentInfo> = {
  freezer: {
    id: 'freezer',
    name: 'Freezer',
    icon: 'snowflake',
  },
  packed: {
    id: 'packed',
    name: 'Packed & Miscellaneous',
    icon: 'package',
  },
  veggies: {
    id: 'veggies',
    name: 'Veggies',
    icon: 'leaf',
  },
} as const;

export const COMPARTMENT_LIST: CompartmentInfo[] = [
  COMPARTMENTS.freezer,
  COMPARTMENTS.packed,
  COMPARTMENTS.veggies,
];
