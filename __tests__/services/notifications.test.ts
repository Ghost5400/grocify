// __tests__/services/notifications.test.ts
// Unit tests for GROCIFY notifications service per TRD section 8 and 14.

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Item } from '@/domain/types';
import {
  ANDROID_EXPIRY_CHANNEL_ID,
  formatNotificationBody,
  notificationsService,
  setupAndroidChannel,
} from '@/services/notifications';

describe('Notifications Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
      granted: true,
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
      granted: true,
    });
    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue('mock-notif-123');
  });

  describe('formatNotificationBody', () => {
    const item = {
      name: 'Broccoli',
      expiryDate: '2026-10-25',
    };

    it('formats label for item expiring in multiple days', () => {
      const trigger = new Date('2026-10-23T09:00:00');
      const body = formatNotificationBody(item, trigger);
      expect(body).toBe('Broccoli expires in 2 days');
    });

    it('formats label for item expiring tomorrow', () => {
      const trigger = new Date('2026-10-24T09:00:00');
      const body = formatNotificationBody(item, trigger);
      expect(body).toBe('Broccoli expires tomorrow');
    });

    it('formats label for item expiring today', () => {
      const trigger = new Date('2026-10-25T09:00:00');
      const body = formatNotificationBody(item, trigger);
      expect(body).toBe('Broccoli expires today');
    });

    it('formats label for expired item', () => {
      const trigger = new Date('2026-10-26T09:00:00');
      const body = formatNotificationBody(item, trigger);
      expect(body).toBe('Broccoli expired');
    });
  });

  describe('Permissions', () => {
    it('returns true if permission is already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      const granted = await notificationsService.ensurePermission();
      expect(granted).toBe(true);
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('requests permission if existingStatus is not granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      const granted = await notificationsService.ensurePermission();
      expect(granted).toBe(true);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('returns false when user denies permission', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });
      const granted = await notificationsService.ensurePermission();
      expect(granted).toBe(false);
    });

    it('checkPermission returns true when granted without requesting', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      const isGranted = await notificationsService.checkPermission();
      expect(isGranted).toBe(true);
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('checkPermission returns false when denied without requesting', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });
      const isGranted = await notificationsService.checkPermission();
      expect(isGranted).toBe(false);
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  describe('setupAndroidChannel', () => {
    it('configures channel on Android', async () => {
      const originalPlatform = Platform.OS;
      (Platform as any).OS = 'android';

      await setupAndroidChannel();

      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        ANDROID_EXPIRY_CHANNEL_ID,
        expect.objectContaining({
          name: 'Expiry reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
        })
      );

      (Platform as any).OS = originalPlatform;
    });
  });

  describe('scheduleItemReminder', () => {
    const item: Item = {
      id: 'item-101',
      catalogId: 'tomato',
      name: 'Tomato',
      compartment: 'veggies',
      imageKey: 'tomato',
      quantity: 3,
      expiryDate: '2026-10-30',
      reminderDays: 2,
      notificationId: null,
      addedAt: '2026-10-20T10:00:00.000Z',
    };

    it('schedules notification when trigger date is in the future', async () => {
      const now = new Date('2026-10-20T12:00:00.000Z');
      const id = await notificationsService.scheduleItemReminder(item, now);

      expect(id).toBe('mock-notif-123');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'GROCIFY',
            body: 'Tomato expires in 2 days',
            data: { itemId: 'item-101', compartment: 'veggies' },
          }),
          trigger: expect.objectContaining({
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: ANDROID_EXPIRY_CHANNEL_ID,
          }),
        })
      );
    });

    it('returns null when reminder trigger is in the past', async () => {
      const now = new Date('2026-11-01T12:00:00.000Z');
      const id = await notificationsService.scheduleItemReminder(item, now);

      expect(id).toBeNull();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('handles unexpected errors gracefully without throwing', async () => {
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Scheduling failed')
      );
      const now = new Date('2026-10-20T12:00:00.000Z');
      const id = await notificationsService.scheduleItemReminder(item, now);

      expect(id).toBeNull();
    });
  });

  describe('cancelItemReminder', () => {
    it('cancels scheduled notification when id exists', async () => {
      await notificationsService.cancelItemReminder('notif-999');
      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'notif-999'
      );
    });

    it('does nothing when notificationId is null or empty', async () => {
      await notificationsService.cancelItemReminder(null);
      expect(Notifications.cancelScheduledNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('reconcileAll', () => {
    const createItem = (id: string, expiryDate: string, reminderDays: number = 2): Item => ({
      id,
      catalogId: 'sample',
      name: `Item ${id}`,
      compartment: 'veggies',
      imageKey: 'sample',
      quantity: 1,
      expiryDate,
      reminderDays,
      notificationId: `old-${id}`,
      addedAt: '2026-10-20T00:00:00.000Z',
    });

    it('cancels all notifications, sorts by trigger date, and assigns new IDs', async () => {
      const now = new Date(2026, 9, 15, 0, 0, 0); // 15 Oct 2026 local time
      const items: Item[] = [
        createItem('3', '2026-10-25'), // trigger 2026-10-23
        createItem('1', '2026-10-20'), // trigger 2026-10-18
        createItem('2', '2026-10-22'), // trigger 2026-10-20
        createItem('past', '2026-10-10'), // trigger past -> null
      ];

      (Notifications.scheduleNotificationAsync as jest.Mock)
        .mockResolvedValueOnce('new-notif-1')
        .mockResolvedValueOnce('new-notif-2')
        .mockResolvedValueOnce('new-notif-3');

      const updated = await notificationsService.reconcileAll(items, now);

      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(3);

      const item1 = updated.find((i) => i.id === '1');
      const item2 = updated.find((i) => i.id === '2');
      const item3 = updated.find((i) => i.id === '3');
      const itemPast = updated.find((i) => i.id === 'past');

      expect(item1?.notificationId).toBe('new-notif-1');
      expect(item2?.notificationId).toBe('new-notif-2');
      expect(item3?.notificationId).toBe('new-notif-3');
      expect(itemPast?.notificationId).toBeNull();
    });

    it('enforces the 60-notification ceiling (iOS limit compliance)', async () => {
      const now = new Date(2026, 9, 15, 0, 0, 0);
      // Create 70 items with future expiry dates using date-fns
      const items: Item[] = [];
      for (let i = 1; i <= 70; i++) {
        // Expiry dates from 5 days to 74 days in the future
        const futureDate = new Date(2026, 9, 20 + i, 0, 0, 0);
        const y = futureDate.getFullYear();
        const m = String(futureDate.getMonth() + 1).padStart(2, '0');
        const d = String(futureDate.getDate()).padStart(2, '0');
        items.push(createItem(`item-${i}`, `${y}-${m}-${d}`));
      }

      await notificationsService.reconcileAll(items, now);

      // Must schedule at most 60 notifications
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(60);
    });

    it('handles empty items array gracefully', async () => {
      const updated = await notificationsService.reconcileAll([]);
      expect(updated).toEqual([]);
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });
});
