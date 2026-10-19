// src/data/itemEmojis.ts
// Central emoji dictionary and resolver for GROCIFY food items.

import { CompartmentId } from '../domain/types';

export const ITEM_EMOJI_MAP: Record<string, string> = {
  // Freezer
  'ice-cream': '🍨',
  'green-peas': '🫛',
  'frozen-pizza': '🍕',
  'french-fries': '🍟',
  'sweet-corn': '🌽',
  'mixed-berries': '🫐',
  'frozen-paratha': '🫓',
  'frozen-chicken': '🍗',

  // Packed & Miscellaneous
  'milk': '🥛',
  'eggs': '🥚',
  'cheese': '🧀',
  'butter': '🧈',
  'curd': '🥣',
  'bread': '🍞',
  'pasta-sauce': '🥫',
  'cereal': '🥣',
  'jam': '🍯',
  'orange-juice': '🧃',

  // Veggies
  'tomato': '🍅',
  'brinjal': '🍆',
  'broccoli': '🥦',
  'carrot': '🥕',
  'capsicum': '🫑',
  'cucumber': '🥒',
  'lettuce': '🥬',
  'spinach': '🥗',
  'cauliflower': '🥦',
  'green-chilli': '🌶️',
};

/**
 * Resolves a food item name or catalog ID to an emoji.
 */
export function getItemEmoji(
  nameOrId: string,
  compartment?: CompartmentId
): string {
  if (!nameOrId) {
    return getCompartmentFallbackEmoji(compartment);
  }

  const normalized = nameOrId
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

  if (ITEM_EMOJI_MAP[normalized]) {
    return ITEM_EMOJI_MAP[normalized];
  }

  // Keyword-based matching for variants or custom names
  if (normalized.includes('tomato')) return '🍅';
  if (normalized.includes('brinjal') || normalized.includes('eggplant')) return '🍆';
  if (normalized.includes('broccoli')) return '🥦';
  if (normalized.includes('cauliflower')) return '🥦';
  if (normalized.includes('carrot')) return '🥕';
  if (
    normalized.includes('capsicum') ||
    normalized.includes('bell-pepper') ||
    normalized.includes('chilli') ||
    normalized.includes('chili') ||
    normalized.includes('pepper')
  ) {
    return normalized.includes('chilli') || normalized.includes('chili') ? '🌶️' : '🫑';
  }
  if (normalized.includes('cucumber')) return '🥒';
  if (normalized.includes('lettuce') || normalized.includes('cabbage')) return '🥬';
  if (normalized.includes('spinach')) return '🥗';
  if (normalized.includes('pea')) return '🫛';
  if (normalized.includes('corn')) return '🌽';
  if (normalized.includes('potato')) return '🥔';
  if (normalized.includes('onion')) return '🧅';
  if (normalized.includes('garlic')) return '🧄';
  if (normalized.includes('mushroom')) return '🍄';
  if (normalized.includes('avocado')) return '🥑';
  if (normalized.includes('apple')) return '🍎';
  if (normalized.includes('banana')) return '🍌';
  if (normalized.includes('orange') || normalized.includes('citrus')) return '🍊';
  if (normalized.includes('lemon') || normalized.includes('lime')) return '🍋';
  if (normalized.includes('strawberry') || normalized.includes('strawberries')) return '🍓';
  if (normalized.includes('berry') || normalized.includes('berries')) return '🫐';
  if (normalized.includes('grape')) return '🍇';
  if (normalized.includes('watermelon') || normalized.includes('melon')) return '🍉';
  if (normalized.includes('pizza')) return '🍕';
  if (normalized.includes('fry') || normalized.includes('fries')) return '🍟';
  if (normalized.includes('ice-cream') || normalized.includes('icecream') || normalized.includes('ice')) return '🍨';
  if (
    normalized.includes('chicken') ||
    normalized.includes('meat') ||
    normalized.includes('beef') ||
    normalized.includes('pork')
  ) {
    return '🍗';
  }
  if (normalized.includes('fish') || normalized.includes('salmon')) return '🐟';
  if (normalized.includes('bread') || normalized.includes('toast') || normalized.includes('loaf')) return '🍞';
  if (normalized.includes('milk')) return '🥛';
  if (normalized.includes('egg')) return '🥚';
  if (normalized.includes('cheese')) return '🧀';
  if (normalized.includes('butter')) return '🧈';
  if (normalized.includes('curd') || normalized.includes('yogurt')) return '🥣';
  if (normalized.includes('cereal') || normalized.includes('oats')) return '🥣';
  if (normalized.includes('jam') || normalized.includes('honey')) return '🍯';
  if (normalized.includes('juice')) return '🧃';
  if (normalized.includes('sauce') || normalized.includes('can')) return '🥫';
  if (
    normalized.includes('paratha') ||
    normalized.includes('roti') ||
    normalized.includes('naan') ||
    normalized.includes('chapati')
  ) {
    return '🫓';
  }

  return getCompartmentFallbackEmoji(compartment);
}

function getCompartmentFallbackEmoji(compartment?: CompartmentId): string {
  switch (compartment) {
    case 'freezer':
      return '🧊';
    case 'packed':
      return '📦';
    case 'veggies':
      return '🥬';
    default:
      return '🍽️';
  }
}
