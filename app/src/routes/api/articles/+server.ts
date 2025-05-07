import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import articles from '$lib/data/articles.json';

// GET handler for all articles
export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  // If an ID is provided, return the specific article
  if (id) {
    const article = articles.find(article => article.id === id);
    if (article) {
      return json(article);
    }
    return new Response(JSON.stringify({ error: 'Article not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Otherwise return all articles
  return json(articles);
}; 
