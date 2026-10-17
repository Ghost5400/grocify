// src/utils/id.ts
// Unique ID generator for grocery items.

export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `item_${timestamp}_${randomPart}`;
}
