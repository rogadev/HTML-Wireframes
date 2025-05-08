<script lang="ts">
	import { onMount } from 'svelte';
	import { recentlyViewed } from '$lib/stores/recentlyViewed';
	import type { ArticleSummary } from '$lib/types/article';

	export let showTitle = true;
	export let maxItems = 5;
	export let compact = false;

	let recentArticles: ArticleSummary[] = [];
	let isLoading = true;
	let error: string | null = null;

	// Load recently viewed articles
	async function loadRecentArticles(): Promise<ArticleSummary[]> {
		let articleIds: string[] = [];

		// Get article IDs from recently viewed store
		const unsubscribe = recentlyViewed.subscribe((state) => {
			articleIds = state.articles || [];
		});
		unsubscribe();

		// If no recent articles, return empty array
		if (articleIds.length === 0) {
			isLoading = false;
			return [];
		}

		try {
			// Fetch articles for these IDs
			const response = await fetch(`/api/articles?ids=${articleIds.join(',')}`);
			if (!response.ok) {
				throw new Error('Failed to fetch recently viewed articles');
			}

			const data = await response.json();

			// Preserve the order from the articleIds array
			if (data.articles && data.articles.length > 0) {
				// Create a map for quick lookup
				const articlesMap = new Map(
					data.articles.map((article: ArticleSummary) => [article.id, article])
				);

				// Filter and order according to articleIds
				return articleIds
					.filter((id) => articlesMap.has(id))
					.map((id) => articlesMap.get(id)) as ArticleSummary[];
			}

			return [];
		} catch (err) {
			console.error('Error loading recently viewed articles:', err);
			error = 'Failed to load your recently viewed articles. Please try again later.';
			return [];
		} finally {
			isLoading = false;
		}
	}

	onMount(async () => {
		recentArticles = await loadRecentArticles();
	});

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

<section class="recently-viewed-section" class:compact>
	{#if showTitle}
		<div class="section-header">
			<h2>Recently Viewed</h2>
		</div>
	{/if}

	{#if isLoading}
		<div class="loading">
			<i class="fas fa-circle-notch fa-spin"></i>
			<span>Loading recently viewed articles...</span>
		</div>
	{:else if error}
		<div class="error">
			<i class="fas fa-exclamation-circle"></i>
			<p>{error}</p>
		</div>
	{:else if recentArticles.length === 0}
		<div class="empty-state">
			<i class="far fa-clock"></i>
			<p>You haven't viewed any articles yet.</p>
			<p class="empty-hint">Browse the site to see your recently viewed articles here.</p>
		</div>
	{:else}
		<ul class="recently-viewed-list">
			{#each recentArticles.slice(0, maxItems) as article (article.id)}
				<li class="recently-viewed-item">
					<div class="recently-viewed-content">
						<a href={`/articles/${article.id}`} class="recently-viewed-title">{article.title}</a>
						{#if !compact}
							<p class="recently-viewed-subtitle">{article.subtitle}</p>
							<div class="recently-viewed-meta">
								<span class="recently-viewed-type">{article.type}</span>
								<span class="recently-viewed-date"
									>Last viewed: {formatDate(new Date().toISOString())}</span
								>
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.recently-viewed-section {
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

	.recently-viewed-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.recently-viewed-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
		transition: background-color 0.2s;
	}

	.recently-viewed-item:hover {
		background-color: #f9fafb;
	}

	.recently-viewed-content {
		flex: 1;
	}

	.recently-viewed-title {
		display: block;
		color: #2563eb;
		font-weight: 500;
		text-decoration: none;
		margin-bottom: 0.25rem;
	}

	.recently-viewed-title:hover {
		text-decoration: underline;
	}

	.recently-viewed-subtitle {
		color: #4b5563;
		font-size: 0.875rem;
		margin: 0.25rem 0 0.5rem;
	}

	.recently-viewed-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.recently-viewed-type {
		background-color: #e5e7eb;
		color: #4b5563;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
	}

	.recently-viewed-date {
		color: #6b7280;
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
	.compact .recently-viewed-item {
		padding: 0.5rem 0;
	}

	.compact .recently-viewed-title {
		font-size: 0.9rem;
	}
</style>
