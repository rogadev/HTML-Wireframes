import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const query = url.searchParams.get('q');
  const lang = url.searchParams.get('lang') || 'all';

  if (!query) {
    return {
      searchResults: [],
      query: '',
      languages: { en: 0, fr: 0 },
      searchInfo: null
    };
  }

  try {
    const searchUrl = `/search?q=${encodeURIComponent(query)}&lang=${lang}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`Search request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      searchResults: data.results,
      query,
      languages: data.languages,
      searchInfo: data.searchInfo
    };
  } catch (error) {
    console.error('Error fetching search results:', error);

    return {
      searchResults: [],
      query,
      error: 'Failed to load search results. Please try again.',
      languages: { en: 0, fr: 0 },
      searchInfo: null
    };
  }
}; 
