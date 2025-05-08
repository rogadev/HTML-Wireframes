import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This is a mock implementation for demonstration purposes
// In a real app, this would update a database

// Store for out-of-date flags (persists only during session)
const outOfDateFlags = new Map<string, boolean>();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const { articleId, isOutOfDate } = data;

    if (!articleId) {
      return new Response(JSON.stringify({ error: 'Article ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update the out-of-date status
    outOfDateFlags.set(articleId, isOutOfDate);

    return json({
      success: true,
      articleId,
      isOutOfDate
    });
  } catch (error) {
    console.error('Error updating out-of-date status:', error);
    return new Response(JSON.stringify({ error: 'Failed to update status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  const articleId = url.searchParams.get('articleId');

  if (!articleId) {
    return new Response(JSON.stringify({ error: 'Article ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get the current out-of-date status
  // If not in our Map, check if it's in the initial data (for demo purposes)
  let isOutOfDate = outOfDateFlags.has(articleId)
    ? outOfDateFlags.get(articleId)
    : articleId === 'fiber-vs-cable'; // Default "fiber-vs-cable" to out-of-date for demo

  return json({
    articleId,
    isOutOfDate
  });
}; 
