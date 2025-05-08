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
		children = undefined,
		isOutOfDate = false,
		isUpdated = false,
		isNew = false,
		lastUpdated = undefined
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
		isOutOfDate?: boolean;
		isUpdated?: boolean;
		isNew?: boolean;
		lastUpdated?: string;
	}>();

	// Calculate if the article was updated recently (within the last 7 days)
	const isRecentlyUpdated = $derived(
		lastUpdated && new Date(lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
	);
</script>

<div class="card" role="article">
	{#if link}
		<a href={link} class="card-link" aria-label={`Read article: ${title}`}>
			{#if imageUrl}
				<div class="card-image">
					<img src={imageUrl} alt={title} />
				</div>
			{/if}
			<div class="card-content">
				<div class="card-header">
					{#if category}
						<Badge variant="primary" size="small">{category}</Badge>
					{/if}
					<div class="status-indicators">
						{#if isOutOfDate}
							<Badge variant="warning" size="small" icon="fas fa-exclamation-triangle"
								>Out of Date</Badge
							>
						{:else if isNew}
							<Badge variant="success" size="small" icon="fas fa-star">New</Badge>
						{:else if isUpdated || isRecentlyUpdated}
							<Badge variant="info" size="small" icon="fas fa-sync">Updated</Badge>
						{/if}
					</div>
				</div>
				<h3 class="card-title">
					{title}
				</h3>
				<p class="card-description">{description}</p>
				{#if tags.length > 0}
					<div class="card-tags" role="list" aria-label="Article tags">
						{#each tags as tag}
							<Badge variant="info" size="small" pill>{tag}</Badge>
						{/each}
					</div>
				{/if}
				<div class="card-meta">
					{#if date}
						<span class="card-date">
							<i class="fas fa-calendar" aria-hidden="true"></i>
							<span>{date}</span>
						</span>
					{/if}
					{#if author}
						<span class="card-author">
							<i class="fas fa-user" aria-hidden="true"></i>
							<span>{author}</span>
						</span>
					{/if}
					{@render children()}
				</div>
			</div>
		</a>
	{:else}
		{#if imageUrl}
			<div class="card-image">
				<img src={imageUrl} alt={title} />
			</div>
		{/if}
		<div class="card-content">
			<div class="card-header">
				{#if category}
					<Badge variant="primary" size="small">{category}</Badge>
				{/if}
				<div class="status-indicators">
					{#if isOutOfDate}
						<Badge variant="warning" size="small" icon="fas fa-exclamation-triangle"
							>Out of Date</Badge
						>
					{:else if isNew}
						<Badge variant="success" size="small" icon="fas fa-star">New</Badge>
					{:else if isUpdated || isRecentlyUpdated}
						<Badge variant="info" size="small" icon="fas fa-sync">Updated</Badge>
					{/if}
				</div>
			</div>
			<h3 class="card-title">
				{title}
			</h3>
			<p class="card-description">{description}</p>
			{#if tags.length > 0}
				<div class="card-tags" role="list" aria-label="Article tags">
					{#each tags as tag}
						<Badge variant="info" size="small" pill>{tag}</Badge>
					{/each}
				</div>
			{/if}
			<div class="card-meta">
				{#if date}
					<span class="card-date">
						<i class="fas fa-calendar" aria-hidden="true"></i>
						<span>{date}</span>
					</span>
				{/if}
				{#if author}
					<span class="card-author">
						<i class="fas fa-user" aria-hidden="true"></i>
						<span>{author}</span>
					</span>
				{/if}
				{@render children()}
			</div>
		</div>
	{/if}
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
		position: relative;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.card-link {
		text-decoration: none;
		color: inherit;
		display: block;
		height: 100%;
	}

	.card-link:hover {
		text-decoration: none;
	}

	.card-link:hover .card-title {
		color: var(--primary-color);
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

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.status-indicators {
		display: flex;
		gap: 0.5rem;
	}

	/* Add warning styles for out-of-date articles */
	.card:has(.badge.warning) {
		border-left: 4px solid var(--warning-color, #f59e0b);
	}

	/* Add success styles for new articles */
	.card:has(.badge.success) {
		border-left: 4px solid var(--success-color, #10b981);
	}

	/* Add info styles for updated articles */
	.card:has(.badge.info) {
		border-left: 4px solid var(--info-color, #3b82f6);
	}
</style>
