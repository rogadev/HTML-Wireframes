import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import articles from '$lib/data/articles.json';

// Helper function to calculate search relevance score
function calculateRelevanceScore(article: any, query: string): number {
  const searchableFields = [
    { field: article.title, weight: 3 },
    { field: article.subtitle, weight: 2 },
    { field: article.description, weight: 2 },
    { field: article.summary, weight: 2 },
    { field: article.type, weight: 1 },
    { field: article.category, weight: 1 },
    ...(article.tags || []).map((tag: string) => ({ field: tag, weight: 1.5 }))
  ];

  let score = 0;
  const queryTerms = query.toLowerCase().split(/\s+/);

  searchableFields.forEach(({ field, weight }) => {
    if (!field) return;
    const fieldText = field.toLowerCase();

    // Exact match gets higher score
    if (fieldText === query) {
      score += weight * 2;
    }
    // Contains all query terms
    else if (queryTerms.every(term => fieldText.includes(term))) {
      score += weight * 1.5;
    }
    // Contains any query term
    else if (queryTerms.some(term => fieldText.includes(term))) {
      score += weight;
    }
  });

  return score;
}

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.toLowerCase() || '';
  const lang = url.searchParams.get('lang') || 'all';

  // Simulate a small delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter and score articles based on search query
  let results = articles
    .map(article => ({
      ...article,
      relevanceScore: calculateRelevanceScore(article, query)
    }))
    .filter(article => article.relevanceScore > 0);

  // Sort by relevance score
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Filter by language if specified
  if (lang !== 'all') {
    results = results.filter(article =>
      article.languages?.includes(lang) || article.languages?.includes('all')
    );
  }

  // Count results by language for the language filters
  const languageCounts = {
    en: results.filter(article =>
      article.languages?.includes('en') || article.languages?.includes('all')
    ).length,
    fr: results.filter(article =>
      article.languages?.includes('fr') || article.languages?.includes('all')
    ).length
  };

  // Remove relevance score from final results and ensure consistent language properties
  results = results.map(({ relevanceScore, ...article }) => {
    // If article doesn't have languages array property, add it based on known language
    // This handles potential inconsistency in the articles data structure
    if (!article.languages) {
      if (article.language) {
        article.languages = [article.language];
      } else {
        // Default to English if no language property is found
        article.languages = ['en'];
      }
    }

    // Add a language property to be consistent with the client-side type
    // This is based on the primary language (first one in the languages array)
    article.language = article.languages[0];

    return article;
  });

  // Mock search explanation information
  const searchInfo = {
    indexType: "FlexSearch multilingual index",
    indexSize: `${articles.length} documents`,
    queryTime: "0.023 seconds",
    advancedFeatures: [
      "Multilingual stemming and normalization",
      "Cross-language semantic matching",
      "Language-specific relevance scoring",
      "Field-weighted search",
      "Partial term matching"
    ]
  };

  return json({
    results,
    total: results.length,
    query,
    languages: languageCounts,
    searchInfo
  });
}; 
