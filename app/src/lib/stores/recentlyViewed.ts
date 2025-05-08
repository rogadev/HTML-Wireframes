import { writable } from 'svelte/store';

// Maximum number of recently viewed articles to track
const MAX_RECENT_ITEMS = 10;

// Type for the recently viewed articles
interface RecentlyViewedStore {
  articles: string[]; // Array of article IDs
}

function createRecentlyViewedStore() {
  // Initialize with empty array
  const defaultState: RecentlyViewedStore = { articles: [] };

  // Create the writable store
  const { subscribe, set, update } = writable<RecentlyViewedStore>(defaultState);

  // Initialize with stored values if available
  if (typeof window !== 'undefined') {
    const storedItems = localStorage.getItem('recentlyViewed');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        set(parsedItems);
      } catch (e) {
        console.error('Failed to parse stored recently viewed items:', e);
      }
    }
  }

  return {
    subscribe,

    // Add an article to the recently viewed list
    addArticle: (articleId: string) => update(state => {
      // Remove the articleId if it already exists (to avoid duplicates)
      const filteredArticles = state.articles.filter(id => id !== articleId);

      // Add the new articleId to the beginning of the array
      const newArticles = [articleId, ...filteredArticles].slice(0, MAX_RECENT_ITEMS);

      // Create the new state
      const newState = { articles: newArticles };

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentlyViewed', JSON.stringify(newState));
      }

      return newState;
    }),

    // Clear the recently viewed list
    clear: () => {
      const newState = { articles: [] };

      if (typeof window !== 'undefined') {
        localStorage.setItem('recentlyViewed', JSON.stringify(newState));
      }

      set(newState);
    }
  };
}

// Export the store
export const recentlyViewed = createRecentlyViewedStore(); 
