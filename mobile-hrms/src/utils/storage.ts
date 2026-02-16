import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Secure storage for sensitive data
export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error saving secure value for key ${key}:`, error);
    }
  },

  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error retrieving secure value for key ${key}:`, error);
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing secure value for key ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await SecureStore.getAllKeysAsync();
      for (const key of keys) {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  },
};

// Regular async storage for app data
export const appStorage = {
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonString = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonString);
    } catch (error) {
      console.error(`Error saving app data for key ${key}:`, error);
    }
  },

  async get<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error retrieving app data for key ${key}:`, error);
      return defaultValue || null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing app data for key ${key}:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing app storage:', error);
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  LAST_CHECK_IN: 'last_check_in',
  LAST_CHECK_OUT: 'last_check_out',
  THEME_PREFERENCE: 'theme_preference',
  NOTIFICATION_PREFERENCES: 'notification_preferences',
  APP_SETTINGS: 'app_settings',
};
