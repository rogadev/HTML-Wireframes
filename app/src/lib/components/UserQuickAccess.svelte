<script lang="ts">
	import { recentlyViewed } from '$lib/stores/recentlyViewed';
	import { userPreferences } from '$lib/stores/userPreferences';
	import { onMount } from 'svelte';
	import FavoritesSection from './FavoritesSection.svelte';
	import RecentlyViewedSection from './RecentlyViewedSection.svelte';

	export let useApiComponents = true;

	// For backward compatibility
	interface Article {
		title: string;
		link: string;
		timeViewed?: string;
	}

	export let recentArticles: Article[] = [];
	export let savedArticles: Article[] = [];

	// Flag to determine if we have any data to show
	let hasRecentlyViewed = false;
	let hasFavorites = false;

	function getArticleSlug(link: string) {
		return link.replace(/^\//, '').split('/').pop();
	}

	onMount(() => {
		// Check if we have recently viewed articles
		const unsubscribe1 = recentlyViewed.subscribe((state) => {
			hasRecentlyViewed = state.articles.length > 0;
		});

		// Check if we have favorites
		const unsubscribe2 = userPreferences.subscribe((prefs) => {
			hasFavorites = prefs.favorites.length > 0;
		});

		return () => {
			unsubscribe1();
			unsubscribe2();
		};
	});
</script>

<section class="quick-access">
	{#if useApiComponents}
		<div class="user-links api-components">
			<div class="recent-articles">
				<RecentlyViewedSection />
			</div>
			<div class="saved-articles">
				<FavoritesSection />
			</div>
		</div>
	{:else}
		<div class="user-links legacy-components">
			<div class="recent-articles">
				<h3><i class="fas fa-history"></i> Recently Viewed</h3>
				<ul>
					{#each recentArticles as article}
						<li>
							<a href={`/article/${getArticleSlug(article.link)}`}>{article.title}</a>
							{#if article.timeViewed}
								<span class="time-viewed">{article.timeViewed}</span>
							{/if}
						</li>
					{/each}
				</ul>
				<a href="/profile/favorites" class="view-all">
					View All <i class="fas fa-chevron-right"></i>
				</a>
			</div>

			<div class="saved-articles">
				<h3><i class="fas fa-bookmark"></i> Bookmarked</h3>
				<ul>
					{#each savedArticles as article}
						<li>
							<a href={`/article/${getArticleSlug(article.link)}`}>{article.title}</a>
						</li>
					{/each}
				</ul>
				<a href="/profile/favorites" class="view-all">
					View All <i class="fas fa-chevron-right"></i>
				</a>
			</div>
		</div>
	{/if}
</section>

<style>
	.quick-access {
		max-width: 1200px;
		margin: 3rem auto;
		padding: 0 1rem;
	}

	.user-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.api-components :global(h2) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 1rem 0;
		color: var(--primary-color);
		font-size: 1.25rem;
	}

	.recent-articles,
	.saved-articles {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 1.5rem;
	}

	h3 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 1rem 0;
		color: var(--primary-color);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem 0;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	li:last-child {
		border-bottom: none;
	}

	a {
		color: var(--text-color);
		text-decoration: none;
		flex: 1;
	}

	a:hover {
		color: var(--primary-color);
	}

	.time-viewed {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.view-all {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	.view-all:hover {
		text-decoration: underline;
	}
</style>
