import { writable } from 'svelte/store';
import type { UserPreferences } from '$lib/types/userPreferences';
import { DEFAULT_PREFERENCES } from '$lib/types/userPreferences';

const STORAGE_KEY = 'techCentralUserPreferences';

// Initialize from localStorage or use defaults
function createUserPreferencesStore() {
  // Initialize with default values
  const initialPreferences = { ...DEFAULT_PREFERENCES };

  // Check for stored preferences if in browser context
  if (typeof window !== 'undefined') {
    try {
      const storedPreferences = localStorage.getItem(STORAGE_KEY);
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);
        Object.assign(initialPreferences, parsedPreferences);
      }
    } catch (error) {
      console.error('Error loading user preferences from localStorage:', error);
    }
  }

  const { subscribe, set, update } = writable<UserPreferences>(initialPreferences);

  return {
    subscribe,

    // Update an individual preference
    updatePreference: <K extends keyof UserPreferences>(
      key: K,
      value: UserPreferences[K]
    ) => {
      update(prefs => {
        const updatedPrefs = { ...prefs, [key]: value };

        // Save to localStorage if in browser context
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrefs));
          } catch (error) {
            console.error('Error saving user preferences to localStorage:', error);
          }
        }

        return updatedPrefs;
      });
    },

    // Set multiple preferences at once
    updatePreferences: (preferences: Partial<UserPreferences>) => {
      update(prefs => {
        const updatedPrefs = { ...prefs, ...preferences };

        // Save to localStorage if in browser context
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrefs));
          } catch (error) {
            console.error('Error saving user preferences to localStorage:', error);
          }
        }

        return updatedPrefs;
      });
    },

    // Toggle a favorite article 
    toggleFavorite: (articleId: string) => {
      update(prefs => {
        const favorites = prefs.favorites || [];
        const updatedFavorites = favorites.includes(articleId)
          ? favorites.filter(id => id !== articleId)
          : [...favorites, articleId];

        const updatedPrefs = {
          ...prefs,
          favorites: updatedFavorites
        };

        // Save to localStorage if in browser context
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrefs));
          } catch (error) {
            console.error('Error saving user preferences to localStorage:', error);
          }
        }

        return updatedPrefs;
      });
    },

    // Reset preferences to defaults
    reset: () => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          console.error('Error removing user preferences from localStorage:', error);
        }
      }
      set(DEFAULT_PREFERENCES);
    }
  };
}

export const userPreferences = createUserPreferencesStore(); 
