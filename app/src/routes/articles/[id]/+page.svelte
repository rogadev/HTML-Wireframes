<script lang="ts">
	import type { Article } from '$lib/types/article';
	import ArticleTOC from '$lib/components/ArticleTOC.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import OutOfDateBanner from '$lib/components/OutOfDateBanner.svelte';
	import FeedbackWidget from '$lib/components/FeedbackWidget.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userPreferences } from '$lib/stores/userPreferences';
	import { recentlyViewed } from '$lib/stores/recentlyViewed';

	export let data: { article: Article };

	let article = data.article;
	let error: string | null = null;
	let isOutOfDate = false;
	let currentUrl = '';
	let isFavorite = false;

	// Format date for display
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Fetch the out-of-date status on mount
	onMount(() => {
		// Get the current full URL for the feedback form
		currentUrl = window.location.href;
		let unsubscribe: () => void = () => {};

		if (article) {
			// Add to recently viewed
			recentlyViewed.addArticle(article.id);

			// Check if this article is a favorite
			unsubscribe = userPreferences.subscribe((prefs) => {
				isFavorite = prefs.favorites?.includes(article?.id || '') || false;
			});

			// First check if it's set in the article data (initial state)
			if (article.isOutOfDate !== undefined) {
				isOutOfDate = article.isOutOfDate;
			} else {
				// Otherwise fetch from API
				fetch(`/api/articles/out-of-date?articleId=${article.id}`)
					.then((response) => {
						if (response.ok) return response.json();
						throw new Error('Failed to fetch out-of-date status');
					})
					.then((data) => {
						isOutOfDate = !!data.isOutOfDate;
					})
					.catch((err) => {
						console.error('Failed to fetch out-of-date status:', err);
					});
			}
		}

		return unsubscribe;
	});

	// Toggle the out-of-date status
	async function toggleOutOfDate(newStatus: boolean) {
		if (!article) return;

		try {
			const response = await fetch('/api/articles/out-of-date', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					articleId: article.id,
					isOutOfDate: newStatus
				})
			});

			if (response.ok) {
				isOutOfDate = newStatus;
			} else {
				// Handle error
				console.error('Failed to update out-of-date status');
			}
		} catch (err) {
			console.error('Error toggling out-of-date status:', err);
		}
	}

	// Toggle favorite status
	function toggleFavorite() {
		if (article) {
			userPreferences.toggleFavorite(article.id);
			isFavorite = !isFavorite;
		}
	}
</script>

<svelte:head>
	{#if article}
		<title>{article.title} - Tech Central</title>
	{:else}
		<title>Article - Tech Central</title>
	{/if}
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
	/>
</svelte:head>

<div class="breadcrumb-container">
	<nav class="breadcrumb" aria-label="Breadcrumb">
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/articles">Articles</a></li>
			<li aria-current="page">{article?.title || 'Article'}</li>
		</ul>
	</nav>
</div>

{#if error}
	<div class="error-container">
		<i class="fas fa-exclamation-circle"></i>
		<p>Error: {error}</p>
		<div class="error-actions">
			<button class="btn-back" on:click={() => goto('/articles')}>
				<i class="fas fa-arrow-left"></i> Back to Articles
			</button>
			<button class="btn-retry" on:click={() => window.location.reload()}>
				<i class="fas fa-sync"></i> Retry
			</button>
		</div>
	</div>
{:else if article}
	{#if article.content && Array.isArray(article.content) && article.content.length > 0}
		<ArticleTOC sections={article.content} />
	{/if}

	<div class="article-page">
		<article class="article-content">
			<div class="last-updated-banner">
				<i class="fas fa-clock"></i>
				<span
					>Last updated: {formatDate(
						article.lastUpdated ||
							article.publishDate ||
							article.publishedDate ||
							new Date().toISOString()
					)}</span
				>
			</div>

			<OutOfDateBanner visible={isOutOfDate} articleId={article.id} onToggle={toggleOutOfDate} />

			<header class="article-header">
				<div class="article-meta">
					{#if article.type}
						<Badge>{article.type}</Badge>
					{:else if article.category}
						<Badge>{article.category}</Badge>
					{/if}
					<div class="status-badge">
						<StatusBadge
							publishDate={article.publishDate || article.publishedDate || ''}
							lastUpdated={article.lastUpdated || ''}
						/>
					</div>
					{#if article.publishDate || article.publishedDate}
						<time datetime={article.publishDate || article.publishedDate}
							>{formatDate(article.publishDate || article.publishedDate || '')}</time
						>
					{/if}
					{#if article.author}
						<span class="author">by {article.author}</span>
					{/if}
				</div>

				<h1>{article.title}</h1>
				{#if article.subtitle}
					<p class="subtitle">{article.subtitle}</p>
				{/if}

				<div class="article-actions">
					<button
						class="favorite-button"
						on:click={toggleFavorite}
						aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
					>
						{#if isFavorite}
							<i class="fas fa-star"></i>
							<span>Saved</span>
						{:else}
							<i class="far fa-star"></i>
							<span>Save</span>
						{/if}
					</button>
					<DownloadButton articleId={article.id} lastUpdated={article.lastUpdated || ''} />
				</div>

				{#if article.tags && article.tags.length > 0}
					<div class="article-tags">
						{#each article.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</header>

			<div class="article-body">
				{#if article.content && typeof article.content !== 'string' && article.content.length > 0}
					{#each article.content as section (section.id)}
						<section id={section.id} class="article-section">
							<h2>{section.title}</h2>
							<p>{section.content}</p>
						</section>
					{/each}
				{:else if typeof article.content === 'string'}
					<section class="article-section">
						<div>
							{article.content}
						</div>
					</section>
				{:else if article.description}
					<section class="article-section">
						<div>
							{article.description}
						</div>
					</section>
				{/if}
			</div>

			<FeedbackWidget articleId={article.id} articleUrl={currentUrl} />
		</article>
	</div>
{:else}
	<div class="loading-container">
		<i class="fas fa-circle-notch fa-spin"></i>
		<span>Loading article...</span>
	</div>
{/if}

<style>
	.breadcrumb-container {
		background-color: #f9fafb;
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.breadcrumb ul {
		display: flex;
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 0.875rem;
	}

	.breadcrumb li:not(:last-child)::after {
		content: '/';
		margin: 0 0.5rem;
		color: #9ca3af;
	}

	.breadcrumb a {
		color: #4b5563;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: #2563eb;
		text-decoration: underline;
	}

	.breadcrumb li:last-child {
		color: #1f2937;
		font-weight: 500;
	}

	.loading-container,
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		padding: 2rem;
		text-align: center;
	}

	.loading-container i,
	.error-container i {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: #2563eb;
	}

	.error-container i {
		color: #b91c1c;
	}

	.error-container p {
		color: #b91c1c;
		font-size: 1.125rem;
		margin-bottom: 1.5rem;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
	}

	.btn-back,
	.btn-retry {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-back {
		background-color: #f3f4f6;
		color: #4b5563;
		border: 1px solid #d1d5db;
	}

	.btn-retry {
		background-color: #2563eb;
		color: white;
		border: none;
	}

	.article-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.article-content {
		width: 100%;
	}

	.article-header {
		margin-bottom: 2.5rem;
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.article-meta time,
	.article-meta .author {
		color: #6b7280;
		font-size: 0.875rem;
	}

	.article-header h1 {
		font-size: 2.25rem;
		color: #1f2937;
		margin: 0 0 0.75rem;
		line-height: 1.2;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #4b5563;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.tag {
		background-color: #f3f4f6;
		color: #4b5563;
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
	}

	.article-section {
		margin-bottom: 2.5rem;
		scroll-margin-top: 2rem;
	}

	.article-section h2 {
		font-size: 1.5rem;
		color: #1f2937;
		margin: 0 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.article-section p {
		font-size: 1.05rem;
		line-height: 1.7;
		color: #374151;
	}

	@media (max-width: 768px) {
		.article-header h1 {
			font-size: 1.75rem;
		}

		.subtitle {
			font-size: 1.125rem;
		}
	}

	.last-updated-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #f9f5ff;
		border-left: 4px solid #7c3aed;
		padding: 0.75rem 1rem;
		margin-bottom: 1.5rem;
		border-radius: 0 4px 4px 0;
		font-size: 0.875rem;
		color: #6b21a8;
	}

	.last-updated-banner i {
		font-size: 1rem;
	}

	.article-actions {
		display: flex;
		margin: 1rem 0;
	}

	.status-badge {
		margin-left: 0.5rem;
	}

	.favorite-button {
		display: flex;
		align-items: center;
		background-color: transparent;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		color: #4b5563;
		cursor: pointer;
		transition: all 0.2s;
		margin-right: 0.5rem;
	}

	.favorite-button:hover {
		background-color: #f3f4f6;
	}

	.favorite-button i {
		margin-right: 0.5rem;
	}

	.fa-star {
		color: #fbbf24;
	}
</style>
