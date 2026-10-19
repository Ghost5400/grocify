// __tests__/data/itemEmojis.test.ts
import { getItemEmoji, ITEM_EMOJI_MAP } from '@/data/itemEmojis';

describe('itemEmojis', () => {
  it('returns exact match for all catalog items', () => {
    expect(getItemEmoji('tomato')).toBe('🍅');
    expect(getItemEmoji('Tomato')).toBe('🍅');
    expect(getItemEmoji('ice-cream')).toBe('🍨');
    expect(getItemEmoji('milk')).toBe('🥛');
    expect(getItemEmoji('eggs')).toBe('🥚');
    expect(getItemEmoji('cheese')).toBe('🧀');
    expect(getItemEmoji('broccoli')).toBe('🥦');
    expect(getItemEmoji('carrot')).toBe('🥕');
  });

  it('matches keyword variants correctly', () => {
    expect(getItemEmoji('Organic Tomato')).toBe('🍅');
    expect(getItemEmoji('Fresh Broccoli')).toBe('🥦');
    expect(getItemEmoji('Whole Milk')).toBe('🥛');
    expect(getItemEmoji('Vanilla Ice Cream')).toBe('🍨');
    expect(getItemEmoji('Red Apple')).toBe('🍎');
  });

  it('falls back to compartment icon when item is unknown', () => {
    expect(getItemEmoji('mysterious food', 'veggies')).toBe('🥬');
    expect(getItemEmoji('mysterious food', 'freezer')).toBe('🧊');
    expect(getItemEmoji('mysterious food', 'packed')).toBe('📦');
    expect(getItemEmoji('mysterious food')).toBe('🍽️');
  });
});
