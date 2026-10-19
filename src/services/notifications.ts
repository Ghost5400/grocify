// src/services/notifications.ts
// Real Expo notification service for GROCIFY per TRD section 8 and UIUX section 9.4.

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Item } from '../domain/types';
import { computeTriggerDate } from '../domain/reminders';
import { daysLeft } from '../domain/status';

export const ANDROID_EXPIRY_CHANNEL_ID = 'expiry-reminders';

// 1. Configure foreground notification presentation handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Ensures the Android notification channel exists.
 */
export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync(ANDROID_EXPIRY_CHANNEL_ID, {
        name: 'Expiry reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A7753',
      });
    } catch {
      // Ignored in unsupported or mocked test environments
    }
  }
}

// Automatically attempt channel setup on module initialization
setupAndroidChannel().catch(() => {});

/**
 * Formats notification body copy from item name and target trigger date per TRD 8 and 7.1.
 */
export function formatNotificationBody(
  item: Pick<Item, 'name' | 'expiryDate'>,
  triggerDate: Date
): string {
  const d = daysLeft(item.expiryDate, triggerDate);
  if (d < 0) {
    return `${item.name} expired`;
  }
  if (d === 0) {
    return `${item.name} expires today`;
  }
  if (d === 1) {
    return `${item.name} expires tomorrow`;
  }
  return `${item.name} expires in ${d} days`;
}

export const notificationsService = {
  /**
   * Checks whether notification permission is currently granted without requesting.
   */
  checkPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  },

  /**
   * Prompts the user for notification permissions if not already granted.
   */
  ensurePermission: async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus === 'granted') {
        return true;
      }
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  },

  /**
   * Schedules a local notification for an item based on its expiry date and reminder lead time.
   * Returns the notificationId or null if trigger cannot be scheduled.
   */
  scheduleItemReminder: async (
    item: Item,
    now: Date = new Date()
  ): Promise<string | null> => {
    if (Platform.OS === 'web') return null;

    try {
      const triggerDate = computeTriggerDate(item.expiryDate, item.reminderDays, now);
      if (!triggerDate) {
        return null;
      }

      await setupAndroidChannel();

      const body = formatNotificationBody(item, triggerDate);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'GROCIFY',
          body,
          data: {
            itemId: item.id,
            compartment: item.compartment,
          },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: ANDROID_EXPIRY_CHANNEL_ID,
        },
      });

      return notificationId;
    } catch {
      return null;
    }
  },

  /**
   * Cancels a single scheduled notification by identifier.
   */
  cancelItemReminder: async (notificationId: string | null): Promise<void> => {
    if (!notificationId || Platform.OS === 'web') return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {
      // Ignored if already removed or missing
    }
  },

  /**
   * Reconciles all notifications:
   * 1. Cancels all currently scheduled GROCIFY notifications.
   * 2. Sorts items with valid future triggers ascending by trigger date.
   * 3. Schedules the soonest 60 (to respect the iOS 64-notification limit).
   * 4. Returns the updated Item[] with refreshed notificationId values.
   */
  reconcileAll: async (
    items: Item[],
    now: Date = new Date()
  ): Promise<Item[]> => {
    if (Platform.OS === 'web') {
      return items.map((item) => ({ ...item, notificationId: null }));
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
      // Ignored
    }

    // 1. Identify items with a valid upcoming trigger date
    const itemsWithTrigger = items.map((item) => ({
      item,
      triggerDate: computeTriggerDate(item.expiryDate, item.reminderDays, now),
    }));

    const validSchedulables = itemsWithTrigger.filter(
      (entry): entry is { item: Item; triggerDate: Date } => entry.triggerDate !== null
    );

    // 2. Sort by trigger date ascending
    validSchedulables.sort(
      (a, b) => a.triggerDate.getTime() - b.triggerDate.getTime()
    );

    // 3. Take at most the soonest 60 items
    const top60 = validSchedulables.slice(0, 60);
    const top60Ids = new Set(top60.map((entry) => entry.item.id));

    // 4. Schedule each item in the top 60
    const scheduledIdMap = new Map<string, string | null>();

    for (const entry of top60) {
      try {
        const body = formatNotificationBody(entry.item, entry.triggerDate);
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'GROCIFY',
            body,
            data: {
              itemId: entry.item.id,
              compartment: entry.item.compartment,
            },
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: entry.triggerDate,
            channelId: ANDROID_EXPIRY_CHANNEL_ID,
          },
        });
        scheduledIdMap.set(entry.item.id, notificationId);
      } catch {
        scheduledIdMap.set(entry.item.id, null);
      }
    }

    // 5. Return mapped items with their new notificationIds
    return items.map((item) => {
      if (top60Ids.has(item.id)) {
        return {
          ...item,
          notificationId: scheduledIdMap.get(item.id) ?? null,
        };
      }
      return {
        ...item,
        notificationId: null,
      };
    });
  },
};
