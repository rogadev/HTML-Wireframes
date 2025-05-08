<script lang="ts">
	import { onMount } from 'svelte';
	import { userPreferences } from '$lib/stores/userPreferences';
	import type { Article, ArticleSummary } from '$lib/types/article';

	export let showTitle = true;
	export let maxItems = 5;
	export let showViewAllLink = true;
	export let compact = false;

	let favorites: ArticleSummary[] = [];
	let isLoading = true;
	let error: string | null = null;

	// Load favorite articles
	async function loadFavorites() {
		let favoriteIds: string[] = [];

		// Get favorite IDs from user preferences store
		const unsubscribe = userPreferences.subscribe((prefs) => {
			favoriteIds = prefs.favorites || [];
		});
		unsubscribe();

		// If no favorites, return empty array
		if (favoriteIds.length === 0) {
			isLoading = false;
			return [];
		}

		try {
			// Fetch articles for these IDs
			const response = await fetch(`/api/articles?ids=${favoriteIds.join(',')}`);
			if (!response.ok) {
				throw new Error('Failed to fetch favorite articles');
			}

			const data = await response.json();
			return data.articles || [];
		} catch (err) {
			console.error('Error loading favorites:', err);
			error = 'Failed to load your favorites. Please try again later.';
			return [];
		} finally {
			isLoading = false;
		}
	}

	onMount(async () => {
		favorites = await loadFavorites();
	});

	function removeFavorite(articleId: string) {
		userPreferences.toggleFavorite(articleId);
		favorites = favorites.filter((article) => article.id !== articleId);
	}

	// Format date for display
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<section class="favorites-section" class:compact>
	{#if showTitle}
		<div class="section-header">
			<h2>Saved Articles</h2>
			{#if showViewAllLink && favorites.length > maxItems}
				<a href="/profile/favorites" class="view-all">View all</a>
			{/if}
		</div>
	{/if}

	{#if isLoading}
		<div class="loading">
			<i class="fas fa-circle-notch fa-spin"></i>
			<span>Loading saved articles...</span>
		</div>
	{:else if error}
		<div class="error">
			<i class="fas fa-exclamation-circle"></i>
			<p>{error}</p>
		</div>
	{:else if favorites.length === 0}
		<div class="empty-state">
			<i class="far fa-star"></i>
			<p>You haven't saved any articles yet.</p>
			<p class="empty-hint">
				Click the star icon on any article to save it for quick access later.
			</p>
		</div>
	{:else}
		<ul class="favorites-list">
			{#each favorites.slice(0, maxItems) as article (article.id)}
				<li class="favorite-item">
					<div class="favorite-content">
						<a href={`/articles/${article.id}`} class="favorite-title">{article.title}</a>
						{#if !compact}
							<p class="favorite-subtitle">{article.subtitle}</p>
							<div class="favorite-meta">
								<span class="favorite-type">{article.type}</span>
								<span class="favorite-date"
									>Last updated: {formatDate(article.lastUpdated || new Date().toISOString())}</span
								>
							</div>
						{/if}
					</div>
					<button
						class="remove-favorite"
						on:click={() => removeFavorite(article.id)}
						aria-label="Remove from favorites"
					>
						<i class="fas fa-star"></i>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.favorites-section {
		width: 100%;
		margin-bottom: 2rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-header h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.view-all {
		color: #2563eb;
		text-decoration: none;
		font-size: 0.875rem;
	}

	.view-all:hover {
		text-decoration: underline;
	}

	.favorites-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.favorite-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
		transition: background-color 0.2s;
	}

	.favorite-item:hover {
		background-color: #f9fafb;
	}

	.favorite-content {
		flex: 1;
	}

	.favorite-title {
		display: block;
		color: #2563eb;
		font-weight: 500;
		text-decoration: none;
		margin-bottom: 0.25rem;
	}

	.favorite-title:hover {
		text-decoration: underline;
	}

	.favorite-subtitle {
		color: #4b5563;
		font-size: 0.875rem;
		margin: 0.25rem 0 0.5rem;
	}

	.favorite-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.favorite-type {
		background-color: #e5e7eb;
		color: #4b5563;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
	}

	.favorite-date {
		color: #6b7280;
	}

	.remove-favorite {
		background: transparent;
		border: none;
		color: #fbbf24;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 9999px;
		transition: background-color 0.2s;
		margin-left: 0.5rem;
	}

	.remove-favorite:hover {
		background-color: #f3f4f6;
	}

	.loading,
	.error,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		color: #6b7280;
	}

	.loading i,
	.error i,
	.empty-state i {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.error i {
		color: #ef4444;
	}

	.empty-state i {
		color: #9ca3af;
	}

	.empty-hint {
		font-size: 0.875rem;
		color: #9ca3af;
		margin-top: 0.5rem;
	}

	/* Compact view styles */
	.compact .favorite-item {
		padding: 0.5rem 0;
	}

	.compact .favorite-title {
		font-size: 0.9rem;
	}
</style>
