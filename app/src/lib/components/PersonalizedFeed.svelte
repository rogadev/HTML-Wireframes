<script lang="ts">
	export let onCustomize: () => void;

	interface FeedItem {
		type: string;
		date: string;
		title: string;
		description: string;
		relevance: string;
		link: string;
	}

	export let feedItems: FeedItem[] = [];
</script>

<section class="personalized-feed">
	<div class="section-header">
		<h2>Your Personalized Feed</h2>
		<button type="button" on:click={onCustomize} class="customize-feed-btn">
			<i class="fas fa-sliders-h"></i> Customize
		</button>
	</div>

	<div class="personalization-notice">
		<i class="fas fa-info-circle"></i>
		<span>Content is personalized based on your role, region, and preferences.</span>
		<a href="/profile-dashboard" class="manage-preferences-link">Manage Preferences</a>
	</div>

	<div class="feed-content">
		{#each feedItems as item}
			<div class="feed-item">
				<div class="feed-item-header">
					<span class="feed-item-type">{item.type}</span>
					<span class="feed-item-date">{item.date}</span>
				</div>
				<h3>{item.title}</h3>
				<p>{item.description}</p>
				<div class="feed-item-meta">
					<span class="feed-relevance">
						<i class="fas fa-bullseye"></i>
						{item.relevance}
					</span>
				</div>
				<a href={item.link} class="feed-item-link">View Details</a>
			</div>
		{/each}
	</div>
</section>

<style>
	.personalized-feed {
		max-width: 1200px;
		margin: 3rem auto;
		padding: 0 1rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.customize-feed-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: white;
		border: 1px solid var(--border-color);
		color: var(--text-color);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.customize-feed-btn:hover {
		background: #f8f9fa;
		border-color: var(--primary-color);
	}

	.personalization-notice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #e9ecef;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	.manage-preferences-link {
		color: var(--primary-color);
		text-decoration: none;
		margin-left: auto;
	}

	.manage-preferences-link:hover {
		text-decoration: underline;
	}

	.feed-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.feed-item {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 1.5rem;
	}

	.feed-item-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.feed-item-type {
		background: var(--primary-color-light);
		color: var(--primary-color);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
	}

	.feed-item-date {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.feed-item h3 {
		margin: 0 0 0.5rem 0;
		color: var(--primary-color);
	}

	.feed-item p {
		margin: 0 0 1rem 0;
		color: var(--text-color);
	}

	.feed-item-meta {
		margin-bottom: 1rem;
	}

	.feed-relevance {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.feed-item-link {
		display: inline-block;
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	.feed-item-link:hover {
		text-decoration: underline;
	}
</style>
