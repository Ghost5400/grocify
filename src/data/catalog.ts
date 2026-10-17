// src/data/catalog.ts
// Fixed catalog of 28 items across the 3 compartments per Kickoff section 3 and TRD section 5.

import { CatalogEntry } from '../domain/types';

export const CATALOG: CatalogEntry[] = [
  // Freezer (8 items)
  { id: 'ice-cream', name: 'Ice Cream', compartment: 'freezer', imageKey: 'ice-cream', defaultShelfLifeDays: 90 },
  { id: 'green-peas', name: 'Green Peas', compartment: 'freezer', imageKey: 'green-peas', defaultShelfLifeDays: 180 },
  { id: 'frozen-pizza', name: 'Frozen Pizza', compartment: 'freezer', imageKey: 'frozen-pizza', defaultShelfLifeDays: 60 },
  { id: 'french-fries', name: 'French Fries', compartment: 'freezer', imageKey: 'french-fries', defaultShelfLifeDays: 120 },
  { id: 'sweet-corn', name: 'Sweet Corn', compartment: 'freezer', imageKey: 'sweet-corn', defaultShelfLifeDays: 180 },
  { id: 'mixed-berries', name: 'Mixed Berries', compartment: 'freezer', imageKey: 'mixed-berries', defaultShelfLifeDays: 120 },
  { id: 'frozen-paratha', name: 'Frozen Paratha', compartment: 'freezer', imageKey: 'frozen-paratha', defaultShelfLifeDays: 90 },
  { id: 'frozen-chicken', name: 'Frozen Chicken', compartment: 'freezer', imageKey: 'frozen-chicken', defaultShelfLifeDays: 60 },

  // Packed & Miscellaneous (10 items)
  { id: 'milk', name: 'Milk', compartment: 'packed', imageKey: 'milk', defaultShelfLifeDays: 5 },
  { id: 'eggs', name: 'Eggs', compartment: 'packed', imageKey: 'eggs', defaultShelfLifeDays: 21 },
  { id: 'cheese', name: 'Cheese', compartment: 'packed', imageKey: 'cheese', defaultShelfLifeDays: 14 },
  { id: 'butter', name: 'Butter', compartment: 'packed', imageKey: 'butter', defaultShelfLifeDays: 30 },
  { id: 'curd', name: 'Curd', compartment: 'packed', imageKey: 'curd', defaultShelfLifeDays: 7 },
  { id: 'bread', name: 'Bread', compartment: 'packed', imageKey: 'bread', defaultShelfLifeDays: 5 },
  { id: 'pasta-sauce', name: 'Pasta Sauce', compartment: 'packed', imageKey: 'pasta-sauce', defaultShelfLifeDays: 10 },
  { id: 'cereal', name: 'Cereal', compartment: 'packed', imageKey: 'cereal', defaultShelfLifeDays: 60 },
  { id: 'jam', name: 'Jam', compartment: 'packed', imageKey: 'jam', defaultShelfLifeDays: 45 },
  { id: 'orange-juice', name: 'Orange Juice', compartment: 'packed', imageKey: 'orange-juice', defaultShelfLifeDays: 7 },

  // Veggies (10 items)
  { id: 'tomato', name: 'Tomato', compartment: 'veggies', imageKey: 'tomato', defaultShelfLifeDays: 7 },
  { id: 'brinjal', name: 'Brinjal', compartment: 'veggies', imageKey: 'brinjal', defaultShelfLifeDays: 6 },
  { id: 'broccoli', name: 'Broccoli', compartment: 'veggies', imageKey: 'broccoli', defaultShelfLifeDays: 5 },
  { id: 'carrot', name: 'Carrot', compartment: 'veggies', imageKey: 'carrot', defaultShelfLifeDays: 14 },
  { id: 'capsicum', name: 'Capsicum', compartment: 'veggies', imageKey: 'capsicum', defaultShelfLifeDays: 7 },
  { id: 'cucumber', name: 'Cucumber', compartment: 'veggies', imageKey: 'cucumber', defaultShelfLifeDays: 7 },
  { id: 'lettuce', name: 'Lettuce', compartment: 'veggies', imageKey: 'lettuce', defaultShelfLifeDays: 5 },
  { id: 'spinach', name: 'Spinach', compartment: 'veggies', imageKey: 'spinach', defaultShelfLifeDays: 4 },
  { id: 'cauliflower', name: 'Cauliflower', compartment: 'veggies', imageKey: 'cauliflower', defaultShelfLifeDays: 7 },
  { id: 'green-chilli', name: 'Green Chilli', compartment: 'veggies', imageKey: 'green-chilli', defaultShelfLifeDays: 10 },
];
