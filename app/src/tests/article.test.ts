import { describe, it, expect } from 'vitest';
import articles from '$lib/data/articles.json';
import type { Article } from '$lib/types/article';

describe('Article Schema', () => {
  it('all articles should have a lastUpdated field', () => {
    articles.forEach((article: any) => {
      expect(article).toHaveProperty('lastUpdated');
      expect(typeof article.lastUpdated).toBe('string');
      expect(article.lastUpdated.trim()).not.toBe('');

      // Validate the date format (YYYY-MM-DD)
      expect(article.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Parse the date to make sure it's valid
      const date = new Date(article.lastUpdated);
      expect(date.toString()).not.toBe('Invalid Date');
    });
  });

  it('lastUpdated field should be present in article detail view', async () => {
    // For each article, ensure the lastUpdated field is preserved when fetching details
    // This simulates getting article details from the API

    // This is a basic structural test - actual API calls would be mocked
    // in a full test implementation
    const sampleArticle = articles[0] as Article;
    expect(sampleArticle).toHaveProperty('lastUpdated');

    // In a real API test, we would mock fetch and test the API response
  });
}); 
