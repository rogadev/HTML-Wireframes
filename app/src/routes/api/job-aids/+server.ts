import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import articles from '$lib/data/articles.json';

export const GET: RequestHandler = async () => {
  // Filter articles to return job aids relevant to the Learning Hub
  const jobAids = articles.filter(article =>
    // Filter articles that have an id and appropriate types/categories for job aids
    article.id &&
    (article.type === 'Guide' ||
      article.type === 'Technology' ||
      article.type === 'Alert' ||
      article.type === 'Comparison' ||
      article.category === 'Installation' ||
      article.category === 'Troubleshooting' ||
      article.category === 'Safety' ||
      article.category === 'Technical Bulletin')
  ).slice(0, 6); // Limit to 6 job aids for now

  // Add a small delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 300));

  return json({
    jobAids
  });
}; 
