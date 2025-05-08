<script lang="ts">
	import { page } from '$app/state';
	import Card from '$lib/components/Card.svelte';
	import CardGrid from '$lib/components/CardGrid.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import type { PageData } from './$types';

	const props = $props<{ data: PageData }>();

	let activeLanguage = $state<'en' | 'fr' | 'all'>('all');
	let isLoading = $state(false);
	let isFirstLoad = $state(true);
	let isIndexBuilding = $state(true);

	// Get search parameters from URL
	const searchQuery = $derived(page.url.searchParams.get('q') || '');
	const urlLang = $derived(page.url.searchParams.get('lang') || 'all');

	// Access data from props
	const searchResults = $derived(props.data.searchResults || []);
	const languageCounts = $derived(props.data.languages || { en: 0, fr: 0 });
	const error = $derived(props.data.error);

	// Function to create language badge for each result
	function createLanguageBadge(language: string) {
		return () => {
			// Return an object structure that will render a badge with proper styling
			return {
				component: Badge,
				props: {
					variant: 'info',
					size: 'small',
					pill: true
				},
				children: () => (language === 'fr' ? 'FR' : 'EN'),
				wrapperClass: 'language-indicator'
			};
		};
	}

	// Set the active language filter based on URL param
	$effect(() => {
		activeLanguage = (urlLang as 'en' | 'fr' | 'all') || 'all';
	});

	// Simulate index building on first load
	$effect(() => {
		if (isFirstLoad) {
			isIndexBuilding = true;
			const timer = setTimeout(() => {
				isIndexBuilding = false;
				isFirstLoad = false;
			}, 1500);

			return () => clearTimeout(timer);
		}
	});

	function setLanguageFilter(lang: 'en' | 'fr' | 'all') {
		isLoading = true;

		// Update URL with new language parameter
		const url = new URL(window.location.href);
		if (lang === 'all') {
			url.searchParams.delete('lang');
		} else {
			url.searchParams.set('lang', lang);
		}
		window.location.href = url.toString();
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

		{#if activeLanguage === 'all'}
			<div class="bilingual-info">
				<i class="fas fa-check-circle"></i>
				<p>
					You're viewing results in <strong>both English and French</strong>. Perfect for bilingual
					users who want to choose the best content regardless of language.
				</p>
			</div>
		{/if}
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
		<p class="results-count">
			{searchResults.length} results found
			{#if activeLanguage !== 'all'}
				in {activeLanguage === 'en' ? 'English' : 'French'}
			{:else}
				across both languages
			{/if}
		</p>

		{#if activeLanguage === 'all' && languageCounts.en > 0 && languageCounts.fr > 0}
			<div class="bilingual-match-info">
				<i class="fas fa-lightbulb"></i>
				<div>
					<p>
						<strong>Matching content found in both languages!</strong>
					</p>
					<p>
						We found similar content in both English ({languageCounts.en}) and French ({languageCounts.fr}).
						Each result is clearly labeled with its language so you can choose your preference.
					</p>
				</div>
			</div>
		{/if}

		<CardGrid columns={3}>
			{#each searchResults as result}
				<Card {...result} children={createLanguageBadge(result.language)} />
			{/each}
		</CardGrid>

		<div class="search-features-info">
			<h3>About Tech Central's Search Features</h3>
			<div class="features-grid">
				<div class="feature-card">
					<i class="fas fa-language"></i>
					<h4>Multilingual Search</h4>
					<p>
						Our search engine indexes content in both English and French, allowing you to find
						relevant information regardless of language preference.
					</p>
				</div>
				<div class="feature-card">
					<i class="fas fa-filter"></i>
					<h4>Smart Filtering</h4>
					<p>
						Filter search results by language, content type, or date to quickly find exactly what
						you're looking for.
					</p>
				</div>
				<div class="feature-card">
					<i class="fas fa-sync"></i>
					<h4>Real-time Updates</h4>
					<p>
						New content is automatically indexed as soon as it's published, ensuring search results
						always include the latest information.
					</p>
				</div>
			</div>
		</div>
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

	.bilingual-info {
		background-color: #f0ffed;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.bilingual-info i {
		color: #22c55e;
		font-size: 1.25rem;
	}

	.bilingual-info p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
		color: #166534;
	}

	.bilingual-match-info {
		background-color: #fffbeb;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.bilingual-match-info i {
		color: #eab308;
		font-size: 1.25rem;
		padding-top: 0.25rem;
	}

	.bilingual-match-info p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.bilingual-match-info p:first-child {
		margin-bottom: 0.25rem;
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

	.results-count {
		color: var(--secondary-color);
		margin-bottom: 2rem;
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

	.language-indicator {
		margin-top: 0.5rem;
	}

	.search-features-info {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid #eee;
	}

	.search-features-info h3 {
		text-align: center;
		margin-bottom: 2rem;
		color: var(--text-color);
		font-size: 1.5rem;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background: #f9fafb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		text-align: center;
	}

	.feature-card i {
		font-size: 2rem;
		color: var(--primary-color);
		margin-bottom: 1rem;
	}

	.feature-card h4 {
		font-size: 1.25rem;
		margin-bottom: 0.75rem;
		color: var(--text-color);
	}

	.feature-card p {
		color: var(--secondary-color);
		font-size: 0.875rem;
		line-height: 1.5;
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
</style>
