<script lang="ts">
	import { page } from '$app/state';
	import Card from '$lib/components/Card.svelte';
	import CardGrid from '$lib/components/CardGrid.svelte';

	interface SearchResult {
		title: string;
		description: string;
		imageUrl: string;
		link: string;
		category: string;
		tags: string[];
		date: string;
		author: string;
	}

	interface SearchResponse {
		results: SearchResult[];
		total: number;
		query: string;
	}

	let searchResults: SearchResult[] = [];
	let isLoading = true;
	let error: string | null = null;

	$: searchQuery = page.url.searchParams.get('q') || '';

	$: {
		if (searchQuery) {
			loadSearchResults();
		}
	}

	async function loadSearchResults() {
		isLoading = true;
		error = null;
		try {
			const response = await fetch(`/search?q=${encodeURIComponent(searchQuery)}`);
			if (!response.ok) throw new Error('Failed to fetch search results');
			const data: SearchResponse = await response.json();
			searchResults = data.results;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred while searching';
			searchResults = [];
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="search-results">
	<h1>Search Results for "{searchQuery}"</h1>

	{#if isLoading}
		<div class="loading">
			<i class="fas fa-spinner fa-spin"></i>
			<span>Searching...</span>
		</div>
	{:else if error}
		<div class="error">
			<i class="fas fa-exclamation-circle"></i>
			<span>{error}</span>
		</div>
	{:else if searchResults.length === 0}
		<div class="no-results">
			<i class="fas fa-search"></i>
			<p>No results found for "{searchQuery}"</p>
			<p class="suggestion">Try different keywords or check your spelling</p>
		</div>
	{:else}
		<p class="results-count">{searchResults.length} results found</p>
		<CardGrid columns={3}>
			{#each searchResults as result}
				<Card {...result} />
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

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--text-color);
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
	}
</style>
