import { writable } from 'svelte/store';
import type { Region, Language, Role, TeamType, AudienceGroup, SkillDesignation, ProductFocus, UserPreferences } from '$lib/types/userPreferences';

// Default preferences
const defaultPreferences: UserPreferences = {
  language: 'en' as Language,
  region: 'all' as Region,
  roles: ['technician'] as Role[],
  primaryRole: 'technician' as Role,
  teamType: 'home' as TeamType,
  audienceGroup: 'tech' as AudienceGroup,
  skillDesignations: [],
  productFocus: [],
  favorites: []
};

// Test data for development - Tech profile
const techProfile: UserPreferences = {
  language: 'en' as Language,
  region: 'ab-bc' as Region,
  roles: ['technician'] as Role[],
  primaryRole: 'technician' as Role,
  teamType: 'home' as TeamType,
  audienceGroup: 'tech' as AudienceGroup,
  skillDesignations: ['copper', 'fiber', 'wifi_plus'],
  productFocus: ['Internet', 'WiFi', 'SHS'],
  favorites: []
};

// Test data for development - Manager profile
const managerProfile: UserPreferences = {
  language: 'en' as Language,
  region: 'on' as Region,
  roles: ['manager', 'technician'] as Role[],
  primaryRole: 'manager' as Role,
  teamType: 'home' as TeamType,
  audienceGroup: 'manager' as AudienceGroup,
  skillDesignations: ['copper', 'fiber', 'tv'],
  productFocus: ['Internet', 'TV', 'WiFi'],
  favorites: []
};

// Test data for development - Partner profile
const partnerProfile: UserPreferences = {
  language: 'fr' as Language,
  region: 'qc' as Region,
  roles: ['partner'] as Role[],
  primaryRole: 'partner' as Role,
  teamType: 'partner' as TeamType,
  audienceGroup: 'partnerTech' as AudienceGroup,
  skillDesignations: ['clec-qc', 'ilec-qc'],
  productFocus: ['Internet', 'TV'],
  favorites: []
};

// Try to load from localStorage on browser
function createUserPreferencesStore() {
  const { subscribe, set, update } = writable<UserPreferences>(defaultPreferences);

  // Initialize with stored values if available
  if (typeof window !== 'undefined') {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      try {
        const parsedPreferences = JSON.parse(storedPreferences);

        // Handle migration from old format (single role) to new format (roles array)
        if (parsedPreferences.role && !parsedPreferences.roles) {
          parsedPreferences.roles = [parsedPreferences.role];
          parsedPreferences.primaryRole = parsedPreferences.role;
          delete parsedPreferences.role;
        }

        set({ ...defaultPreferences, ...parsedPreferences });
      } catch (e) {
        console.error('Failed to parse stored preferences:', e);
      }
    } else {
      // No stored preferences - if in development, set test data
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development environment detected - loading test user profile');
        set(techProfile);
        localStorage.setItem('userPreferences', JSON.stringify(techProfile));
      }
    }
  }

  return {
    subscribe,
    // Add methods to load test profiles for development
    loadTechProfile: () => {
      set(techProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(techProfile));
      }
      console.log('Tech profile loaded for development');
      return techProfile;
    },
    loadManagerProfile: () => {
      set(managerProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(managerProfile));
      }
      console.log('Manager profile loaded for development');
      return managerProfile;
    },
    loadPartnerProfile: () => {
      set(partnerProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(partnerProfile));
      }
      console.log('Partner profile loaded for development');
      return partnerProfile;
    },
    // Legacy method for backward compatibility
    loadTestData: () => {
      set(techProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(techProfile));
      }
      console.log('Test data loaded for development');
      return techProfile;
    },
    setLanguage: (lang: Language) => update(prefs => {
      const newPrefs = { ...prefs, language: lang };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    setRegion: (region: Region) => update(prefs => {
      const newPrefs = { ...prefs, region };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    // Replace setRole with methods to manage roles array
    addRole: (role: Role) => update(prefs => {
      // Don't add duplicates
      if (prefs.roles.includes(role)) return prefs;

      const roles = [...prefs.roles, role];
      const newPrefs = { ...prefs, roles };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    removeRole: (role: Role) => update(prefs => {
      // Don't allow removing all roles - technician is default
      if (prefs.roles.length === 1 && role === 'technician') return prefs;

      const roles = prefs.roles.filter(r => r !== role);
      // Ensure at least technician remains
      if (roles.length === 0) roles.push('technician');

      // Update primaryRole if it was removed
      let primaryRole = prefs.primaryRole;
      if (primaryRole === role) {
        primaryRole = roles[0];
      }

      const newPrefs = { ...prefs, roles, primaryRole };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    toggleRole: (role: Role) => update(prefs => {
      const hasRole = prefs.roles.includes(role);

      // If trying to remove the only role or removing technician when it's the only role, do nothing
      if (hasRole && (prefs.roles.length === 1 || (role === 'technician' && prefs.roles.length === 1))) {
        return prefs;
      }

      let roles;
      if (hasRole) {
        roles = prefs.roles.filter(r => r !== role);
        // Ensure at least technician remains
        if (roles.length === 0) roles.push('technician');
      } else {
        roles = [...prefs.roles, role];
      }

      // Update primaryRole if it was removed
      let primaryRole = prefs.primaryRole;
      if (primaryRole === role && !roles.includes(role)) {
        primaryRole = roles[0];
      }

      const newPrefs = { ...prefs, roles, primaryRole };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    setPrimaryRole: (role: Role) => update(prefs => {
      // Can only set primary role to a role the user has
      if (!prefs.roles.includes(role)) return prefs;

      const newPrefs = { ...prefs, primaryRole: role };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    setTeamType: (teamType: TeamType) => update(prefs => {
      const newPrefs = { ...prefs, teamType };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    setAudienceGroup: (audienceGroup: AudienceGroup) => update(prefs => {
      const newPrefs = { ...prefs, audienceGroup };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    setSkillDesignations: (skills: SkillDesignation[]) => update(prefs => {
      const newPrefs = { ...prefs, skillDesignations: skills };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    setProductFocus: (products: ProductFocus[]) => update(prefs => {
      const newPrefs = { ...prefs, productFocus: products };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    toggleFavorite: (articleId: string) => update(prefs => {
      const favorites = prefs.favorites || [];
      const newFavorites = favorites.includes(articleId)
        ? favorites.filter(id => id !== articleId)
        : [...favorites, articleId];

      const newPrefs = { ...prefs, favorites: newFavorites };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
      }
      return newPrefs;
    }),
    reset: () => {
      set(defaultPreferences);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userPreferences');
      }
    }
  };
}

export const userPreferences = createUserPreferencesStore();

// Make language and region properties accessible directly
export const language = {
  subscribe: (callback: (value: Language) => void) => {
    return userPreferences.subscribe(prefs => callback(prefs.language));
  }
};

export const region = {
  subscribe: (callback: (value: Region) => void) => {
    return userPreferences.subscribe(prefs => callback(prefs.region));
  }
}; 
