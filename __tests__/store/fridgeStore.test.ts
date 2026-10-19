// __tests__/store/fridgeStore.test.ts

import {
  selectCompartmentSummary,
  selectItemsByCompartment,
  selectTotalCount,
  useFridgeStore,
} from '@/store/fridgeStore';
import { notificationsService } from '@/services/notifications';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

describe('fridgeStore & selectors', () => {
  beforeEach(() => {
    useFridgeStore.getState().resetAllForDev();
    jest.clearAllMocks();
  });

  describe('store actions', () => {
    it('initializes with empty items and hasSeenWelcome: false', () => {
      const state = useFridgeStore.getState();
      expect(state.items).toEqual([]);
      expect(state.settings.hasSeenWelcome).toBe(false);
      expect(state.settings.defaultReminderDays).toBe(2);
    });

    it('adds an item with generated ID, addedAt, and calls notificationsService', async () => {
      const scheduleSpy = jest.spyOn(notificationsService, 'scheduleItemReminder');

      const added = await useFridgeStore.getState().addItem({
        catalogId: 'tomato',
        name: 'Tomato',
        compartment: 'veggies',
        imageKey: 'tomato',
        quantity: 3,
        expiryDate: '2026-10-25',
        reminderDays: 2,
      });

      expect(added.id).toBeDefined();
      expect(added.addedAt).toBeDefined();
      expect(added.name).toBe('Tomato');
      expect(added.quantity).toBe(3);

      const items = useFridgeStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0]?.id).toBe(added.id);
      expect(scheduleSpy).toHaveBeenCalledTimes(1);
    });

    it('updates item quantity and expiryDate', async () => {
      const added = await useFridgeStore.getState().addItem({
        catalogId: 'milk',
        name: 'Milk',
        compartment: 'packed',
        imageKey: 'milk',
        quantity: 1,
        expiryDate: '2026-10-20',
        reminderDays: 2,
      });

      await useFridgeStore.getState().updateItem(added.id, {
        quantity: 4,
        expiryDate: '2026-10-22',
      });

      const updated = useFridgeStore.getState().items.find((i) => i.id === added.id);
      expect(updated?.quantity).toBe(4);
      expect(updated?.expiryDate).toBe('2026-10-22');
    });

    it('removes an item by id and cancels its reminder', async () => {
      const cancelSpy = jest.spyOn(notificationsService, 'cancelItemReminder');
      jest.spyOn(notificationsService, 'scheduleItemReminder').mockResolvedValueOnce('notif-123');

      const added = await useFridgeStore.getState().addItem({
        catalogId: 'ice-cream',
        name: 'Ice Cream',
        compartment: 'freezer',
        imageKey: 'ice-cream',
        quantity: 2,
        expiryDate: '2026-12-31',
        reminderDays: 2,
      });

      expect(added.notificationId).toBe('notif-123');
      expect(useFridgeStore.getState().items).toHaveLength(1);

      await useFridgeStore.getState().removeItem(added.id);
      expect(useFridgeStore.getState().items).toHaveLength(0);
      expect(cancelSpy).toHaveBeenCalledWith('notif-123');
    });

    it('marks welcome screen as seen', () => {
      expect(useFridgeStore.getState().settings.hasSeenWelcome).toBe(false);
      useFridgeStore.getState().markWelcomeSeen();
      expect(useFridgeStore.getState().settings.hasSeenWelcome).toBe(true);
    });

    it('sets hasPromptedNotificationPermission', () => {
      expect(useFridgeStore.getState().settings.hasPromptedNotificationPermission).toBe(false);
      useFridgeStore.getState().setHasPromptedNotificationPermission(true);
      expect(useFridgeStore.getState().settings.hasPromptedNotificationPermission).toBe(true);
    });

    it('reconciles notifications via notificationsService.reconcileAll', async () => {
      const reconcileSpy = jest
        .spyOn(notificationsService, 'reconcileAll')
        .mockResolvedValueOnce([
          {
            id: 'item-1',
            catalogId: 'tomato',
            name: 'Tomato',
            compartment: 'veggies',
            imageKey: 'tomato',
            quantity: 1,
            expiryDate: '2026-10-25',
            reminderDays: 2,
            notificationId: 'reconciled-notif-1',
            addedAt: '2026-10-20T00:00:00.000Z',
          },
        ]);

      await useFridgeStore.getState().reconcileNotifications();

      expect(reconcileSpy).toHaveBeenCalledTimes(1);
      expect(useFridgeStore.getState().items[0]?.notificationId).toBe('reconciled-notif-1');
    });
  });

  describe('selectors', () => {
    it('selectTotalCount returns count of distinct item entries, not sum of quantities', async () => {
      await useFridgeStore.getState().addItem({
        catalogId: 'tomato',
        name: 'Tomato',
        compartment: 'veggies',
        imageKey: 'tomato',
        quantity: 5, // quantity 5
        expiryDate: '2026-10-25',
        reminderDays: 2,
      });

      await useFridgeStore.getState().addItem({
        catalogId: 'carrot',
        name: 'Carrot',
        compartment: 'veggies',
        imageKey: 'carrot',
        quantity: 12, // quantity 12
        expiryDate: '2026-10-28',
        reminderDays: 2,
      });

      const items = useFridgeStore.getState().items;
      // TRD 6.1: Must be 2 (entries count), NOT 17 (sum of quantities)
      expect(selectTotalCount(items)).toBe(2);
    });

    it('selectItemsByCompartment filters and sorts by soonest expiry first', async () => {
      await useFridgeStore.getState().addItem({
        catalogId: 'broccoli',
        name: 'Broccoli',
        compartment: 'veggies',
        imageKey: 'broccoli',
        quantity: 1,
        expiryDate: '2026-10-29', // later
        reminderDays: 2,
      });

      await useFridgeStore.getState().addItem({
        catalogId: 'tomato',
        name: 'Tomato',
        compartment: 'veggies',
        imageKey: 'tomato',
        quantity: 2,
        expiryDate: '2026-10-20', // sooner
        reminderDays: 2,
      });

      await useFridgeStore.getState().addItem({
        catalogId: 'milk',
        name: 'Milk',
        compartment: 'packed', // different compartment
        imageKey: 'milk',
        quantity: 1,
        expiryDate: '2026-10-18',
        reminderDays: 2,
      });

      const veggieItems = selectItemsByCompartment(useFridgeStore.getState().items, 'veggies');
      expect(veggieItems).toHaveLength(2);
      expect(veggieItems[0]?.catalogId).toBe('tomato');
      expect(veggieItems[1]?.catalogId).toBe('broccoli');
    });

    it('selectCompartmentSummary calculates accurate fresh, expiringSoon, and expired counts', async () => {
      const testToday = new Date(2026, 9, 17); // 17 Oct 2026

      await useFridgeStore.getState().addItem({
        catalogId: 'milk',
        name: 'Milk',
        compartment: 'packed',
        imageKey: 'milk',
        quantity: 1,
        expiryDate: '2026-10-15', // expired
        reminderDays: 2,
      });

      await useFridgeStore.getState().addItem({
        catalogId: 'eggs',
        name: 'Eggs',
        compartment: 'packed',
        imageKey: 'eggs',
        quantity: 6,
        expiryDate: '2026-10-18', // expiringSoon (1 day left <= 2)
        reminderDays: 2,
      });

      await useFridgeStore.getState().addItem({
        catalogId: 'cheese',
        name: 'Cheese',
        compartment: 'packed',
        imageKey: 'cheese',
        quantity: 1,
        expiryDate: '2026-11-15', // fresh
        reminderDays: 2,
      });

      const summary = selectCompartmentSummary(
        useFridgeStore.getState().items,
        'packed',
        testToday
      );

      expect(summary.count).toBe(3);
      expect(summary.expiredCount).toBe(1);
      expect(summary.expiringSoonCount).toBe(1);
    });
  });
});
