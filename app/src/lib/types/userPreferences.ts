export type Region = 'all' | 'qc' | 'on' | 'ab-bc' | 'atlantic' | 'mb-sk';
export type Language = 'en' | 'fr';
export type Role = 'technician' | 'manager' | 'admin' | 'partner';
export type TeamType = 'home' | 'partner' | 'custom_home';
export type AudienceGroup = 'tech' | 'manager' | 'owner' | 'trainer' | 'partnerTech';
export type SkillDesignation = 'copper' | 'fiber' | 'wifi_plus' | 'shs' | 'tv' | 'clec-qc' | 'ilec-qc';
export type ProductFocus = 'SHS' | 'TV' | 'Internet' | 'WiFi' | 'ValueGen' | 'Custom Home';

export interface UserPreferences {
  language: Language;
  region: Region;
  roles: Role[];
  primaryRole: Role;
  teamType: TeamType;
  audienceGroup: AudienceGroup;
  skillDesignations: SkillDesignation[];
  productFocus: ProductFocus[];
  favorites: string[];
  learningProfile?: {
    newHire: boolean;
    outstandingCourses: string[];
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  region: 'all',
  roles: ['technician'],
  primaryRole: 'technician',
  teamType: 'home',
  audienceGroup: 'tech',
  skillDesignations: [],
  productFocus: [],
  favorites: [],
  learningProfile: {
    newHire: false,
    outstandingCourses: []
  }
}; 
