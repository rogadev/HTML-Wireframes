import type { Region, Language, Role, TeamType, AudienceGroup, SkillDesignation, ProductFocus } from './userPreferences';

export interface ArticleSection {
  type: string;
  id: string;
  title: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  tags: string[];
  publishDate: string;
  author: string;
  content: ArticleSection[];

  // Personalization fields
  regions?: Region[];
  languages?: Language[];
  roles?: Role[];
  teamTypes?: TeamType[];
  audienceGroups?: AudienceGroup[];
  skillDesignations?: SkillDesignation[];
  productFocus?: ProductFocus[];

  // Additional metadata
  lastUpdated?: string;
  isNew?: boolean;
  isUpdated?: boolean;
}

export type ArticleSummary = Omit<Article, 'content'>; 
