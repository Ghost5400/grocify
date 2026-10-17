// src/services/notifications.ts
// Notification service stub for Phases 1–5.
// Full Expo notification scheduling, channels, and iOS 60-cap reconciliation are implemented in Phase 6.

import { Item } from '../domain/types';

export const notificationsService = {
  ensurePermission: async (): Promise<boolean> => {
    return false;
  },

  scheduleItemReminder: async (_item: Item): Promise<string | null> => {
    return null;
  },

  cancelItemReminder: async (_notificationId: string | null): Promise<void> => {
    // No-op in stub
  },

  reconcileAll: async (_items: Item[]): Promise<void> => {
    // No-op in stub
  },
};
