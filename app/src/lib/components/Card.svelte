<script lang="ts">
	import Badge from './Badge.svelte';

	const {
		title,
		description,
		imageUrl = undefined,
		link = undefined,
		tags = [],
		date = undefined,
		author = undefined,
		category = undefined,
		children = undefined
	} = $props<{
		title: string;
		description: string;
		imageUrl?: string;
		link?: string;
		tags?: string[];
		date?: string;
		author?: string;
		category?: string;
		children?: any;
	}>();
</script>

<div class="card">
	{#if imageUrl}
		<div class="card-image">
			<img src={imageUrl} alt={title} />
		</div>
	{/if}
	<div class="card-content">
		{#if category}
			<Badge variant="primary" size="small">{category}</Badge>
		{/if}
		<h3 class="card-title">
			{#if link}
				<a href={link}>{title}</a>
			{:else}
				{title}
			{/if}
		</h3>
		<p class="card-description">{description}</p>
		{#if tags.length > 0}
			<div class="card-tags">
				{#each tags as tag}
					<Badge variant="info" size="small" pill>{tag}</Badge>
				{/each}
			</div>
		{/if}
		<div class="card-meta">
			{#if date}
				<span class="card-date">
					<i class="fas fa-calendar"></i>
					{date}
				</span>
			{/if}
			{#if author}
				<span class="card-author">
					<i class="fas fa-user"></i>
					{author}
				</span>
			{/if}
			{@render children()}
		</div>
	</div>
</div>

<style>
	.card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.card-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-content {
		padding: 1.5rem;
	}

	.card-title {
		margin: 0.75rem 0;
		font-size: 1.25rem;
		line-height: 1.4;
	}

	.card-title a {
		color: var(--text-color);
		text-decoration: none;
	}

	.card-title a:hover {
		color: var(--primary-color);
	}

	.card-description {
		color: var(--secondary-color);
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.card-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.875rem;
		color: var(--secondary-color);
	}

	.card-date,
	.card-author {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.card-date i,
	.card-author i {
		font-size: 0.875rem;
	}
</style>
