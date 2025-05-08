<script lang="ts">
	import type { ArticleSummary } from '$lib/types/article';
	import Badge from './Badge.svelte';
	import StatusBadge from './StatusBadge.svelte';

	export let article: ArticleSummary;
	export let onClick: () => void = () => {
		window.location.href = `/articles/${article.id}`;
	};

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

<div
	class="article-card"
	role="button"
	tabindex="0"
	on:click={onClick}
	on:keydown={(e) => e.key === 'Enter' && onClick()}
>
	<div class="article-type">
		<Badge>{article.type}</Badge>

		<div class="status-badge-container">
			<StatusBadge publishDate={article.publishDate} lastUpdated={article.lastUpdated} />
		</div>
	</div>

	<div class="article-content">
		<h3>{article.title}</h3>
		<p class="subtitle">{article.subtitle}</p>

		<div class="article-meta">
			<span class="publish-date">{formatDate(article.publishDate)}</span>
			{#if article.author}
				<span class="author">by {article.author}</span>
			{/if}
		</div>

		<div class="article-tags">
			{#each article.tags as tag}
				<span class="tag">{tag}</span>
			{/each}
		</div>
	</div>
</div>

<style>
	.article-card {
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 0.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		cursor: pointer;
	}

	.article-card:hover,
	.article-card:focus {
		transform: translateY(-4px);
		box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
	}

	.article-card:focus {
		outline: 2px solid #2563eb;
	}

	.article-type {
		margin-bottom: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status-badge-container {
		display: flex;
		align-items: center;
	}

	.article-content h3 {
		font-size: 1.25rem;
		margin: 0 0 0.5rem 0;
		color: #1f2937;
	}

	.subtitle {
		font-size: 0.95rem;
		color: #4b5563;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.article-meta {
		display: flex;
		font-size: 0.85rem;
		color: #6b7280;
		margin-bottom: 0.75rem;
	}

	.article-meta .publish-date {
		margin-right: 0.5rem;
	}

	.article-meta .author {
		font-style: italic;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-size: 0.75rem;
		background-color: #f3f4f6;
		color: #4b5563;
		padding: 0.25rem 0.5rem;
		border-radius: 9999px;
	}
</style>
