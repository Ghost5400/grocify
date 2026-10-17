// src/data/itemImages.ts
// Static map of item cutout assets per Metro requirements.
// When an asset file is dropped into assets/items/{id}.webp,
// change null to require('../../assets/items/{id}.webp').

export const ITEM_IMAGE_MAP: Record<string, number | null> = {
  // Freezer
  'ice-cream': null,
  'green-peas': null,
  'frozen-pizza': null,
  'french-fries': null,
  'sweet-corn': null,
  'mixed-berries': null,
  'frozen-paratha': null,
  'frozen-chicken': null,

  // Packed & Miscellaneous
  'milk': null,
  'eggs': null,
  'cheese': null,
  'butter': null,
  'curd': null,
  'bread': null,
  'pasta-sauce': null,
  'cereal': null,
  'jam': null,
  'orange-juice': null,

  // Veggies
  'tomato': null,
  'brinjal': null,
  'broccoli': null,
  'carrot': null,
  'capsicum': null,
  'cucumber': null,
  'lettuce': null,
  'spinach': null,
  'cauliflower': null,
  'green-chilli': null,
};

export function getItemImageSource(key: string): number | null {
  return ITEM_IMAGE_MAP[key] ?? null;
}
