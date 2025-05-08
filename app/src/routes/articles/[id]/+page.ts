import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Article } from '$lib/types/article';
import articles from '$lib/data/articles.json';

export const load: PageLoad = ({ params }) => {
  const article = (articles as Article[]).find(a => a.id === params.id || a.slug === params.id);

  if (!article) {
    throw error(404, {
      message: 'Article not found'
    });
  }

  return {
    article
  };
}; 
