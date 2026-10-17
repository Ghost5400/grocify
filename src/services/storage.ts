// src/services/storage.ts
// AsyncStorage adapter for Zustand persistence and app storage.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

export const storageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch (error) {
      if (__DEV__) {
        console.warn(`[storageAdapter] Failed to get item "${name}":`, error);
      }
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      if (__DEV__) {
        console.warn(`[storageAdapter] Failed to set item "${name}":`, error);
      }
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      if (__DEV__) {
        console.warn(`[storageAdapter] Failed to remove item "${name}":`, error);
      }
    }
  },
};
