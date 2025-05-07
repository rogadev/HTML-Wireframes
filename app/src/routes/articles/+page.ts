import type { PageLoad } from './$types';
import type { ArticleSummary } from '$lib/types/article';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/api/articles');

    if (!response.ok) {
      throw new Error(`Error fetching articles: ${response.status}`);
    }

    const articles: ArticleSummary[] = await response.json();

    return {
      articles
    };
  } catch (error) {
    console.error('Failed to load articles:', error);
    return {
      articles: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 
