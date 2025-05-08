<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/Card.svelte';
	import CardGrid from '$lib/components/CardGrid.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import type { PageData } from './$types';

	const props = $props<{ data: PageData }>();

	// Define a type for search result
	type SearchResult = {
		id: string;
		slug?: string;
		title: string;
		description: string;
		languages: string[];
		isNew?: boolean;
		isUpdated?: boolean;
		isOutOfDate?: boolean;
		lastUpdated?: string;
	};

	let activeLanguage = $state<'en' | 'fr' | 'all'>('all');
	let isLoading = $state(false);
	let isFirstLoad = $state(true);
	let isIndexBuilding = $state(false);
	let searchResults = $state<SearchResult[]>(props.data.searchResults || []);
	let languageCounts = $state(props.data.languages || { en: 0, fr: 0 });
	let error = $state(props.data.error);

	// Get search parameters from URL
	const searchQuery = $derived(page.url.searchParams.get('q') || '');
	const urlLang = $derived(page.url.searchParams.get('lang') || 'all');

	// Calculate accurate language counts based on current search results
	$effect(() => {
		if (searchResults && searchResults.length > 0) {
			const counts = {
				en: searchResults.filter((result: SearchResult) => result.languages?.includes('en')).length,
				fr: searchResults.filter((result: SearchResult) => result.languages?.includes('fr')).length
			};
			languageCounts = counts;
		}
	});

	// Cache key constructor
	const getCacheKey = (query: string, lang: string) => `search_cache_${query}_${lang}`;

	// Check and load from cache if available
	$effect(() => {
		if (typeof window !== 'undefined' && searchQuery) {
			const cacheKey = getCacheKey(searchQuery, 'all'); // Always look for all languages in cache
			const cachedData = localStorage.getItem(cacheKey);

			if (cachedData) {
				try {
					const parsedData = JSON.parse(cachedData);
					if (parsedData.results && parsedData.timestamp) {
						// Check if cache is still valid (1 hour expiration)
						const now = new Date().getTime();
						const cacheAge = now - parsedData.timestamp;
						const cacheExpirationMs = 60 * 60 * 1000; // 1 hour

						if (cacheAge < cacheExpirationMs) {
							const allResults = parsedData.results;

							// Filter results based on selected language
							if (activeLanguage !== 'all') {
								searchResults = allResults.filter((result: SearchResult) =>
									result.languages?.includes(activeLanguage)
								);
							} else {
								searchResults = allResults;
							}

							// Make sure language counts are accurate for all results
							languageCounts = {
								en: allResults.filter((result: SearchResult) => result.languages?.includes('en'))
									.length,
								fr: allResults.filter((result: SearchResult) => result.languages?.includes('fr'))
									.length
							};

							isLoading = false;
							return;
						}
					}
				} catch (e) {
					console.error('Error parsing cached search data', e);
				}
			}
		}
	});

	// Save results to cache
	function cacheSearchResults() {
		if (typeof window !== 'undefined' && searchQuery && searchResults.length > 0) {
			const cacheKey = getCacheKey(searchQuery, 'all'); // Always cache all results
			const cacheData = {
				results: searchResults,
				languageCounts,
				timestamp: new Date().getTime()
			};

			try {
				localStorage.setItem(cacheKey, JSON.stringify(cacheData));
			} catch (e) {
				console.error('Error caching search results', e);
			}
		}
	}

	// Update cache when new results are loaded
	$effect(() => {
		if (!isLoading && !isFirstLoad && searchResults.length > 0) {
			cacheSearchResults();
		}
	});

	// Function to create language badge for each result
	function createLanguageBadge(languages: string[]) {
		return () => {
			return {
				component: Badge,
				props: {
					variant: 'info',
					size: 'small',
					pill: true
				},
				children: () => (languages.includes('fr') ? 'FR' : 'EN'),
				wrapperClass: 'language-indicator'
			};
		};
	}

	// Set the active language filter based on URL param
	$effect(() => {
		activeLanguage = (urlLang as 'en' | 'fr' | 'all') || 'all';
	});

	async function setLanguageFilter(lang: 'en' | 'fr' | 'all') {
		isLoading = true;

		// Update URL with new language parameter
		const url = new URL(window.location.href);
		if (lang === 'all') {
			url.searchParams.delete('lang');
		} else {
			url.searchParams.set('lang', lang);
		}

		// Use client-side navigation
		await goto(url.toString(), { keepFocus: true, noScroll: true });

		// Try to use cached results for filtering if available
		if (typeof window !== 'undefined' && searchQuery) {
			const cacheKey = getCacheKey(searchQuery, 'all');
			const cachedData = localStorage.getItem(cacheKey);

			if (cachedData) {
				try {
					const parsedData = JSON.parse(cachedData);
					if (parsedData.results && parsedData.timestamp) {
						const now = new Date().getTime();
						const cacheAge = now - parsedData.timestamp;
						const cacheExpirationMs = 60 * 60 * 1000; // 1 hour

						if (cacheAge < cacheExpirationMs) {
							const allResults = parsedData.results;

							// Apply language filter
							if (lang !== 'all') {
								searchResults = allResults.filter((result: SearchResult) =>
									result.languages?.includes(lang)
								);
							} else {
								searchResults = allResults;
							}

							// Recalculate language counts based on all results
							languageCounts = {
								en: allResults.filter((result: SearchResult) => result.languages?.includes('en'))
									.length,
								fr: allResults.filter((result: SearchResult) => result.languages?.includes('fr'))
									.length
							};

							isLoading = false;
							return;
						}
					}
				} catch (e) {
					console.error('Error parsing cached search data for filtering', e);
				}
			}
		}

		isLoading = false;
	}

	// Handle article navigation
	async function handleArticleClick(event: MouseEvent, articleId: string) {
		event.preventDefault();

		// Store current search state in history
		const searchState = {
			results: searchResults,
			query: searchQuery,
			language: activeLanguage,
			counts: languageCounts
		};

		// Push current state to history before navigating
		history.pushState(searchState, '', window.location.href);

		// Navigate to article
		const url = `/articles/${articleId}`;
		await goto(url, { keepFocus: true });
	}

	// Handle browser back/forward navigation
	$effect(() => {
		const handlePopState = (event: PopStateEvent) => {
			if (event.state?.results) {
				// Restore search results from history state
				searchResults = event.state.results;
				activeLanguage = event.state.language;
				languageCounts = event.state.counts;
				isLoading = false;
				isFirstLoad = false;
			}
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});

	// Set firstLoad to false after initial load
	$effect(() => {
		if (isFirstLoad && !isLoading && searchResults.length > 0) {
			isFirstLoad = false;
		}
	});

	// Clear cache function that can be used for debugging or adding a clear cache button
	function clearSearchCache() {
		if (typeof window !== 'undefined') {
			// Find all search cache keys
			const searchCacheKeys = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith('search_cache_')) {
					searchCacheKeys.push(key);
				}
			}

			// Remove all search cache entries
			searchCacheKeys.forEach((key) => localStorage.removeItem(key));
			console.log(`Cleared ${searchCacheKeys.length} search cache entries`);
		}
	}
</script>

<svelte:head>
	<title>Search Results: {searchQuery} - Tech Central</title>
</svelte:head>

<div class="search-results">
	<div class="search-header">
		<h1>Search Results for "{searchQuery}"</h1>

		<div class="language-filter-chips">
			<span class="filter-label">Filter by language:</span>
			<div class="filter-chip-container">
				<button
					class="filter-chip bilingual"
					class:active={activeLanguage === 'all'}
					onclick={() => setLanguageFilter('all')}
				>
					<div class="bilingual-flag">
						<span class="flag-part en">EN</span>
						<span class="flag-divider">+</span>
						<span class="flag-part fr">FR</span>
					</div>
					All languages
					<span class="chip-count">{(languageCounts.en || 0) + (languageCounts.fr || 0)}</span>
				</button>
				<button
					class="filter-chip"
					class:active={activeLanguage === 'en'}
					onclick={() => setLanguageFilter('en')}
				>
					English only
					<span class="chip-count">{languageCounts.en || 0}</span>
				</button>
				<button
					class="filter-chip"
					class:active={activeLanguage === 'fr'}
					onclick={() => setLanguageFilter('fr')}
				>
					Français seulement
					<span class="chip-count">{languageCounts.fr || 0}</span>
				</button>
			</div>
		</div>
	</div>

	{#if isIndexBuilding}
		<div class="loading index-building">
			<div class="index-building-animation">
				<div class="index-bar"></div>
				<div class="index-bar"></div>
				<div class="index-bar"></div>
				<div class="index-bar"></div>
			</div>
			<i class="fas fa-database"></i>
			<span>Building multilingual search index...</span>
			<div class="index-details">
				<div class="index-detail">
					<i class="fas fa-language"></i>
					<span>Processing English and French content</span>
				</div>
				<div class="index-detail">
					<i class="fas fa-cogs"></i>
					<span>Generating language-specific stemming rules</span>
				</div>
				<div class="index-detail">
					<i class="fas fa-chart-line"></i>
					<span>Optimizing search relevancy scores</span>
				</div>
			</div>
		</div>
	{:else if isLoading}
		<div class="loading">
			<i class="fas fa-spinner fa-spin"></i>
			<span>Searching across English and French content...</span>
		</div>
	{:else if error}
		<div class="error">
			<i class="fas fa-exclamation-circle"></i>
			<span>{error}</span>
		</div>
	{:else if !searchResults || searchResults.length === 0}
		<div class="no-results">
			<i class="fas fa-search"></i>
			<p>No results found for "{searchQuery}"</p>
			<p class="suggestion">
				Try different keywords or check your spelling. You can also try searching in
				{activeLanguage === 'en' ? 'French' : 'English'} by using the language filter above.
			</p>
		</div>
	{:else}
		<CardGrid columns={3}>
			{#each searchResults as result}
				<Card
					{...result}
					link={`/articles/${result.slug || result.id}`}
					isOutOfDate={result.isOutOfDate}
					isUpdated={result.isUpdated}
					isNew={result.isNew}
					lastUpdated={result.lastUpdated}
					children={createLanguageBadge(result.languages)}
				/>
			{/each}
		</CardGrid>
	{/if}
</div>

<style>
	.search-results {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.search-header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: var(--text-color);
	}

	.language-filter-chips {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.filter-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--secondary-color);
	}

	.filter-chip-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: #f0f0f0;
		border: 1px solid #ddd;
		border-radius: 9999px;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-chip:hover {
		background: #e5e5e5;
	}

	.filter-chip.active {
		background: var(--primary-color);
		color: white;
		border-color: var(--primary-color);
	}

	.filter-chip.active .chip-count {
		background: rgba(255, 255, 255, 0.3);
	}

	.filter-chip.bilingual {
		padding-left: 0.5rem;
	}

	.bilingual-flag {
		display: flex;
		align-items: center;
		border-radius: 4px;
		overflow: hidden;
		font-size: 0.7rem;
		font-weight: 600;
		margin-right: 0.25rem;
	}

	.flag-part {
		padding: 0.15rem 0.3rem;
	}

	.flag-part.en {
		background-color: #2563eb;
		color: white;
	}

	.flag-part.fr {
		background-color: #dc2626;
		color: white;
	}

	.flag-divider {
		background-color: white;
		color: #333;
		padding: 0 0.15rem;
		font-size: 0.65rem;
	}

	.filter-chip.active .bilingual-flag .flag-divider {
		color: var(--primary-color);
	}

	.chip-count {
		background: rgba(0, 0, 0, 0.1);
		color: inherit;
		font-size: 0.7rem;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
		font-weight: 600;
	}

	.loading,
	.error,
	.no-results {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		gap: 1rem;
	}

	.loading i,
	.error i,
	.no-results i {
		font-size: 2rem;
		color: var(--secondary-color);
	}

	.error i {
		color: #dc3545;
	}

	.suggestion {
		color: var(--secondary-color);
		font-size: 0.875rem;
		max-width: 400px;
	}

	/* Index building animation styles */
	.index-building {
		background-color: rgba(75, 40, 109, 0.05);
		border-radius: 8px;
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.index-building i {
		color: var(--primary-color);
		margin-bottom: 0.5rem;
	}

	.index-building span {
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--primary-color);
	}

	.index-building-animation {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		height: 50px;
		gap: 5px;
		margin-bottom: 1rem;
	}

	.index-bar {
		background-color: var(--primary-color);
		width: 8px;
		height: 20px;
		border-radius: 4px;
		animation: indexBuild 1.2s infinite ease-in-out;
	}

	.index-bar:nth-child(1) {
		animation-delay: 0s;
	}

	.index-bar:nth-child(2) {
		animation-delay: 0.3s;
	}

	.index-bar:nth-child(3) {
		animation-delay: 0.6s;
	}

	.index-bar:nth-child(4) {
		animation-delay: 0.9s;
	}

	@keyframes indexBuild {
		0%,
		100% {
			height: 20px;
		}
		50% {
			height: 40px;
		}
	}

	.index-details {
		margin-top: 1.5rem;
		text-align: left;
		border-top: 1px solid rgba(75, 40, 109, 0.1);
		padding-top: 1rem;
		width: 100%;
	}

	.index-detail {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
		color: var(--secondary-color);
		font-size: 0.875rem;
	}

	.index-detail i {
		font-size: 1rem;
		margin: 0;
		color: var(--secondary-color);
	}

	@media (max-width: 768px) {
		.language-filter-chips {
			flex-direction: column;
			align-items: flex-start;
		}

		.filter-chip-container {
			width: 100%;
		}
	}

	/* Add smooth transition for loading states */
	.loading,
	.error,
	.no-results {
		transition: opacity 0.2s ease-in-out;
	}

	/* Preserve scroll position during navigation */
	:global(body) {
		scroll-behavior: smooth;
	}

	@keyframes loading {
		0% {
			transform: scaleX(0);
		}
		50% {
			transform: scaleX(0.5);
		}
		100% {
			transform: scaleX(1);
		}
	}

	/* Card wrapper styles for event handling */
	:global(div[onclick]) {
		cursor: pointer;
		display: contents;
	}
</style>
