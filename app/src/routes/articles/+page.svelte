<script lang="ts">
	import type { ArticleSummary } from '$lib/types/article';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import { goto } from '$app/navigation';

	export let data;

	let articles: ArticleSummary[] = data.articles;
	let error = data.error;

	const handleArticleClick = (id: string) => {
		goto(`/articles/${id}`);
	};
</script>

<svelte:head>
	<title>Articles - Tech Central</title>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
	/>
</svelte:head>

<div class="articles-container">
	<header class="articles-header">
		<h1>Learning Resources</h1>
		<p class="description">
			Browse our collection of guides, articles, and resources to help you get the most out of our
			products and services.
		</p>
	</header>

	{#if error}
		<div class="error-container">
			<i class="fas fa-exclamation-circle"></i>
			<p>Error loading articles: {error}</p>
			<button class="retry-button" on:click={() => window.location.reload()}> Retry </button>
		</div>
	{:else if articles.length > 0}
		<div class="articles-grid">
			{#each articles as article (article.id)}
				<ArticleCard {article} onClick={() => handleArticleClick(article.id)} />
			{/each}
		</div>
	{:else}
		<div class="loading-indicator">
			<i class="fas fa-circle-notch fa-spin"></i>
			<span>Loading articles...</span>
		</div>
	{/if}
</div>

<style>
	.articles-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.articles-header {
		margin-bottom: 2.5rem;
		text-align: center;
	}

	.articles-header h1 {
		font-size: 2.25rem;
		color: #1f2937;
		margin-bottom: 0.75rem;
	}

	.description {
		font-size: 1.1rem;
		color: #4b5563;
		max-width: 700px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.articles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.loading-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: #6b7280;
		font-size: 1.125rem;
	}

	.loading-indicator i {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: #2563eb;
	}

	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: #b91c1c;
		text-align: center;
	}

	.error-container i {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.retry-button {
		margin-top: 1rem;
		padding: 0.5rem 1.25rem;
		background-color: #2563eb;
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.retry-button:hover {
		background-color: #1d4ed8;
	}

	@media (max-width: 768px) {
		.articles-grid {
			grid-template-columns: 1fr;
		}

		.articles-header h1 {
			font-size: 1.875rem;
		}

		.description {
			font-size: 1rem;
		}
	}
</style>
