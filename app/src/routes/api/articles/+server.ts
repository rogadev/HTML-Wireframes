import articlesData from '$lib/data/articles.json';
import type { Article, ArticleSummary } from '$lib/types/article';
import type { Region } from '$lib/types/userPreferences';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  // Get query parameters
  const category = url.searchParams.get('category');
  const region = url.searchParams.get('region') as Region | null;
  const query = url.searchParams.get('query')?.toLowerCase();
  const ids = url.searchParams.get('ids')?.split(',') || [];
  const fullArticles = url.searchParams.get('full') === 'true';

  // Load articles
  let filteredArticles = [...(articlesData as Article[])];

  // Priority 1: Filter by IDs if provided
  if (ids.length > 0) {
    filteredArticles = filteredArticles.filter(article => ids.includes(article.id));
  }
  // Otherwise, apply other filters
  else {
    // Filter by category
    if (category) {
      filteredArticles = filteredArticles.filter(article =>
        article.type === category ||
        article.category === category ||
        (article.tags && article.tags.includes(category))
      );
    }

    // Filter by region if specified (include articles for 'all' regions always)
    if (region && region !== 'all') {
      filteredArticles = filteredArticles.filter(article =>
        !article.regions ||
        (Array.isArray(article.regions) &&
          (article.regions.includes(region) ||
            article.regions.includes('all')))
      );
    }

    // Filter by search query
    if (query) {
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        (article.subtitle && article.subtitle.toLowerCase().includes(query)) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Sort by publishDate (most recent first) by default
    filteredArticles.sort((a, b) => {
      const dateA = a.lastUpdated || a.publishDate || a.publishedDate || '';
      const dateB = b.lastUpdated || b.publishDate || b.publishedDate || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }

  // Map to article summaries if full articles not requested
  let response: { articles: Article[] | ArticleSummary[]; } = {
    articles: fullArticles
      ? filteredArticles
      : filteredArticles.map(({ content, ...summary }) => summary as ArticleSummary)
  };

  return json(response);
}; 
