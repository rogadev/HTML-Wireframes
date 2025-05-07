import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import articles from '$lib/data/articles.json';

// Enable prerendering for this API route
export const prerender = true;

// GET handler for all articles
export const GET: RequestHandler = async () => {
  // Always return all articles during prerendering
  return json(articles);
}; 
