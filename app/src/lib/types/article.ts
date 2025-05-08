import type { Region, Language, Role, TeamType, AudienceGroup, SkillDesignation, ProductFocus } from './userPreferences';

export interface ArticleSection {
  type?: string;
  id: string;
  title: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  type?: string;
  category?: string;
  tags?: string[];
  publishDate?: string;
  publishedDate?: string; // Alternative date field
  author?: string;
  content?: ArticleSection[] | string; // Content can be string or ArticleSection[]
  imageUrl?: string;
  slug?: string;

  // Personalization fields - allowing both typed and string arrays
  regions?: string[] | Region[];
  languages?: string[] | Language[];
  roles?: string[] | Role[];
  teamTypes?: string[] | TeamType[];
  audienceGroups?: string[] | AudienceGroup[];
  skillDesignations?: string[] | SkillDesignation[];
  productFocus?: string[] | ProductFocus[];

  // Additional metadata
  lastUpdated?: string;
  isNew?: boolean;
  isUpdated?: boolean;
  isOutOfDate?: boolean; // Flag indicating content needs review/update

  // Technical bulletin specific fields
  bulletinID?: string;
  severity?: 'critical' | 'standard' | 'informational';
  priority?: number;
  impactedRegions?: string[] | Region[];
  impactedRoles?: string[] | Role[];
  impactedSkills?: string[] | SkillDesignation[];
  requiredAction?: {
    actionable?: boolean;
    deadline?: string;
    verificationRequired?: boolean;
  };

  // Billing update specific fields
  updateID?: string;
  effectiveDate?: string;
  acknowledgementRequired?: boolean;

  // Offer specific fields
  validUntil?: string;
  validFrom?: string;
  offerID?: string;
  eligibleRegions?: string[] | Region[];
  eligibleTeamTypes?: string[] | TeamType[];
  productCategory?: string;
}

export type ArticleSummary = Omit<Article, 'content'>; 
