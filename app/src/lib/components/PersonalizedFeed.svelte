<script lang="ts">
	import { userPreferences } from '$lib/stores/userPreferences';

	export let onCustomize: () => void;
	export let loading = false;
	export let error: string | null = null;

	interface FeedItem {
		type: string;
		date: string;
		title: string;
		description: string;
		relevance: string;
		link: string;
	}

	export let feedItems: FeedItem[] = [];

	function getArticleSlug(link: string) {
		return link.replace(/^\//, '').split('/').pop();
	}
</script>

<section class="personalized-feed">
	<div class="section-header">
		<h2>Your Personalized Feed</h2>
		<button
			type="button"
			on:click={onCustomize}
			class="customize-feed-icon"
			aria-label="Customize Feed"
			title="Customize Feed"
		>
			<i class="fas fa-sliders-h"></i>
		</button>
	</div>

	<div class="personalization-banner">
		<i class="fas fa-info-circle"></i>
		<span class="personalization-text">
			Personalized for: <span class="personalization-tags">
				<!-- Example: ALL, technician, etc. You can pass these as props if needed -->
				{#if $userPreferences.region}<span class="tag">{$userPreferences.region.toUpperCase()}</span
					>{/if}
				{#if $userPreferences.roles && $userPreferences.roles.length > 0}
					{#each $userPreferences.roles as role}
						<span class="tag">{role}</span>
					{/each}
				{/if}
				{#if $userPreferences.teamType !== 'home'}<span class="tag"
						>{$userPreferences.teamType}</span
					>{/if}
				{#if $userPreferences.skillDesignations && $userPreferences.skillDesignations.length > 0}
					{#each $userPreferences.skillDesignations as skill}
						<span class="tag">{skill}</span>
					{/each}
				{/if}
			</span>
		</span>
		<a
			href="/profile-dashboard"
			class="manage-link"
			aria-label="Manage Preferences"
			title="Manage Preferences"
		>
			<i class="fas fa-cog"></i>
		</a>
	</div>

	{#if loading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Loading personalized content...</p>
		</div>
	{:else if error}
		<div class="error-container">
			<i class="fas fa-exclamation-circle"></i>
			<p>{error}</p>
		</div>
	{:else if feedItems.length === 0}
		<div class="empty-state">
			<i class="fas fa-newspaper"></i>
			<p>No personalized content available at this time.</p>
		</div>
	{:else}
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
					<a href={`/article/${getArticleSlug(item.link)}`} class="feed-item-link">View Details</a>
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	.personalized-feed {
		max-width: 1200px;
		margin: 1rem auto 1rem auto;
		padding: 0 1rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.section-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.customize-feed-icon {
		background: none;
		border: none;
		color: var(--primary-color);
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		transition: background 0.2s;
	}
	.customize-feed-icon:hover {
		background: #f1f2f6;
	}

	.personalization-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #f1f2f6;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.95rem;
		margin-bottom: 0.5rem;
		color: var(--secondary-color);
	}
	.personalization-banner .personalization-text {
		flex: 1 1 auto;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.personalization-banner .personalization-tags {
		margin-left: 0.5rem;
	}
	.personalization-banner .tag {
		display: inline-block;
		background: var(--primary-color-light);
		color: var(--primary-color);
		padding: 0.1rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85em;
		margin-right: 0.25rem;
	}
	.manage-link {
		color: var(--primary-color);
		margin-left: 0.5rem;
		font-size: 1.1em;
		text-decoration: none;
		padding: 0.15rem 0.3rem;
		border-radius: 4px;
		transition: background 0.2s;
	}
	.manage-link:hover {
		background: #e9ecef;
	}

	.loading-container,
	.error-container,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem 0;
		color: var(--secondary-color);
		text-align: center;
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		border-top-color: var(--primary-color);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 0.5rem;
	}

	.error-container {
		color: var(--error-color);
	}

	.empty-state i {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--text-muted);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.feed-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.2rem;
	}

	.feed-item {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 1.1rem;
	}

	.feed-item-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.7rem;
	}

	.feed-item-type {
		background: var(--primary-color-light);
		color: var(--primary-color);
		padding: 0.18rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.feed-item-date {
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	.feed-item h3 {
		margin: 0 0 0.3rem 0;
		color: var(--primary-color);
		font-size: 1.1rem;
	}

	.feed-item p {
		margin: 0 0 0.7rem 0;
		color: var(--text-color);
		font-size: 0.97rem;
	}

	.feed-item-meta {
		margin-bottom: 0.7rem;
	}

	.feed-relevance {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--text-muted);
		font-size: 0.85rem;
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
