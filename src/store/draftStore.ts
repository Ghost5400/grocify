// src/store/draftStore.ts
// Ephemeral in-memory Zustand store for the Add-Item multi-screen flow.

import { create } from 'zustand';
import { CatalogEntry, CompartmentId } from '../domain/types';

export interface DraftState {
  compartment: CompartmentId | null;
  catalogEntry: CatalogEntry | null;
  quantity: number;
  expiryDate: string | null;
  reminderDays: number;

  setCompartment: (compartment: CompartmentId | null) => void;
  setCatalogEntry: (entry: CatalogEntry | null) => void;
  setQuantity: (quantity: number) => void;
  setExpiryDate: (date: string | null) => void;
  setReminderDays: (days: number) => void;
  resetDraft: () => void;
}

const initialDraft = {
  compartment: null,
  catalogEntry: null,
  quantity: 1,
  expiryDate: null,
  reminderDays: 2,
};

export const useDraftStore = create<DraftState>((set) => ({
  ...initialDraft,

  setCompartment: (compartment) => set({ compartment }),
  setCatalogEntry: (catalogEntry) =>
    set({
      catalogEntry,
      compartment: catalogEntry ? catalogEntry.compartment : null,
    }),
  setQuantity: (quantity) => set({ quantity: Math.max(1, Math.min(99, quantity)) }),
  setExpiryDate: (expiryDate) => set({ expiryDate }),
  setReminderDays: (reminderDays) => set({ reminderDays }),
  resetDraft: () => set(initialDraft),
}));
