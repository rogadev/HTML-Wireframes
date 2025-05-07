import type { PageLoad } from './$types';
import type { Article } from '$lib/types/article';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const response = await fetch(`/api/articles?id=${params.id}`);

    if (!response.ok) {
      throw new Error(`Error fetching article: ${response.status}`);
    }

    const article: Article = await response.json();

    return {
      article
    };
  } catch (error) {
    console.error('Failed to load article:', error);
    return {
      article: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 
