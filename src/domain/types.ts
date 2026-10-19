// src/domain/types.ts
// Core domain interfaces and types per TRD section 5.

export type CompartmentId = 'freezer' | 'packed' | 'veggies';

export type ItemStatus = 'fresh' | 'expiringSoon' | 'expired';

export interface Item {
  id: string; // unique, generated on creation
  catalogId: string | null; // null for custom items (P1)
  name: string;
  compartment: CompartmentId;
  imageKey: string; // key into itemImages map
  quantity: number; // integer, 1..99
  expiryDate: string; // 'YYYY-MM-DD' (local calendar date, no time or timezone)
  reminderDays: number; // days before expiry, default 2
  notificationId: string | null; // id returned by the notification scheduler
  addedAt: string; // ISO 8601 timestamp
}

export interface Settings {
  defaultReminderDays: number; // default 2
  hasSeenWelcome: boolean;
  hasPromptedNotificationPermission?: boolean;
}

export interface CatalogEntry {
  id: string;
  name: string;
  compartment: CompartmentId;
  imageKey: string;
  defaultShelfLifeDays?: number; // used for suggested expiry (P1)
}

export interface CompartmentInfo {
  id: CompartmentId;
  name: string;
  icon: string;
}

export interface CompartmentSummary {
  count: number;
  expiringSoonCount: number;
  expiredCount: number;
}
