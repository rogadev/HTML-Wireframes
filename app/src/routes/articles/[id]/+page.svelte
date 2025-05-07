<script lang="ts">
	import type { Article } from '$lib/types/article';
	import ArticleTOC from '$lib/components/ArticleTOC.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { goto } from '$app/navigation';

	export let data;

	let article: Article | null = data.article;
	let error = data.error;

	// Format date for display
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
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
	{#if article.content?.length > 0}
		<ArticleTOC sections={article.content} />
	{/if}

	<div class="article-page">
		<article class="article-content">
			<header class="article-header">
				<div class="article-meta">
					<Badge>{article.type}</Badge>
					<time datetime={article.publishDate}>{formatDate(article.publishDate)}</time>
					{#if article.author}
						<span class="author">by {article.author}</span>
					{/if}
				</div>

				<h1>{article.title}</h1>
				<p class="subtitle">{article.subtitle}</p>

				<div class="article-tags">
					{#each article.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			</header>

			<div class="article-body">
				{#each article.content as section (section.id)}
					<section id={section.id} class="article-section">
						<h2>{section.title}</h2>
						<p>{section.content}</p>
					</section>
				{/each}
			</div>
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
</style>
