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
}

export type ArticleSummary = Omit<Article, 'content'>; 
