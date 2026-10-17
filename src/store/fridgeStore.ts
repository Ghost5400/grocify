// src/store/fridgeStore.ts
// Persisted Zustand store for Grocify inventory and settings.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CompartmentId, CompartmentSummary, Item, Settings } from '../domain/types';
import { getStatus } from '../domain/status';
import { notificationsService } from '../services/notifications';
import { storageAdapter } from '../services/storage';
import { generateId } from '../utils/id';

export interface FridgeState {
  items: Item[];
  settings: Settings;
  hydrated: boolean;
  addItem: (input: Omit<Item, 'id' | 'addedAt' | 'notificationId'>) => Promise<Item>;
  updateItem: (
    id: string,
    patch: Partial<Pick<Item, 'quantity' | 'expiryDate' | 'reminderDays'>>
  ) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  markWelcomeSeen: () => void;
  setHydrated: (hydrated: boolean) => void;
  resetAllForDev: () => void;
  seedSampleItemsForDev: (sampleItems: Item[]) => void;
}

const initialSettings: Settings = {
  defaultReminderDays: 2,
  hasSeenWelcome: false,
};

export const useFridgeStore = create<FridgeState>()(
  persist(
    (set, get) => ({
      items: [],
      settings: initialSettings,
      hydrated: false,

      addItem: async (input) => {
        const id = generateId();
        const addedAt = new Date().toISOString();

        const newItem: Item = {
          ...input,
          id,
          addedAt,
          notificationId: null,
        };

        // Attempt scheduling reminder
        const notificationId = await notificationsService.scheduleItemReminder(newItem);
        newItem.notificationId = notificationId;

        set((state) => ({
          items: [newItem, ...state.items],
        }));

        return newItem;
      },

      updateItem: async (id, patch) => {
        const existingItem = get().items.find((item) => item.id === id);
        if (!existingItem) return;

        const updatedItem: Item = {
          ...existingItem,
          ...patch,
        };

        // Reschedule reminder if expiry or reminderDays changed
        let notificationId = existingItem.notificationId;
        if (
          (patch.expiryDate && patch.expiryDate !== existingItem.expiryDate) ||
          (patch.reminderDays !== undefined && patch.reminderDays !== existingItem.reminderDays)
        ) {
          if (existingItem.notificationId) {
            await notificationsService.cancelItemReminder(existingItem.notificationId);
          }
          notificationId = await notificationsService.scheduleItemReminder(updatedItem);
        }

        updatedItem.notificationId = notificationId;

        set((state) => ({
          items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        }));
      },

      removeItem: async (id) => {
        const existingItem = get().items.find((item) => item.id === id);
        if (existingItem?.notificationId) {
          await notificationsService.cancelItemReminder(existingItem.notificationId);
        }

        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      markWelcomeSeen: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            hasSeenWelcome: true,
          },
        }));
      },

      setHydrated: (hydrated: boolean) => {
        set({ hydrated });
      },

      resetAllForDev: () => {
        set({
          items: [],
          settings: initialSettings,
        });
      },

      seedSampleItemsForDev: (sampleItems: Item[]) => {
        set({
          items: sampleItems,
        });
      },
    }),
    {
      name: 'grocify-store',
      storage: createJSONStorage(() => storageAdapter),
      version: 1,
      migrate: (persistedState: unknown, _version: number) => {
        return persistedState as FridgeState;
      },
      partialize: (state) => ({
        items: state.items,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selectors
export function selectItemsByCompartment(items: Item[], compartmentId: CompartmentId): Item[] {
  return items
    .filter((item) => item.compartment === compartmentId)
    .sort((a, b) => {
      const dateComparison = a.expiryDate.localeCompare(b.expiryDate);
      if (dateComparison !== 0) return dateComparison;
      return a.id.localeCompare(b.id);
    });
}

export function selectTotalCount(items: Item[]): number {
  return items.length;
}

export function selectCompartmentSummary(
  items: Item[],
  compartmentId: CompartmentId,
  today: Date = new Date()
): CompartmentSummary {
  const compartmentItems = items.filter((item) => item.compartment === compartmentId);
  let expiringSoonCount = 0;
  let expiredCount = 0;

  for (const item of compartmentItems) {
    const status = getStatus(item, today);
    if (status === 'expiringSoon') {
      expiringSoonCount += 1;
    } else if (status === 'expired') {
      expiredCount += 1;
    }
  }

  return {
    count: compartmentItems.length,
    expiringSoonCount,
    expiredCount,
  };
}
