<script lang="ts">
	import { onMount } from 'svelte';
	import ArticleCard from './ArticleCard.svelte';
	import RegionSelector from './RegionSelector.svelte';
	import { userPreferences } from '$lib/stores/userPreferences';
	import type { Region } from '$lib/types/userPreferences';

	// Props for the component
	export let title: string = 'Content';
	export let subtitle: string = '';
	export let articles: any[] = []; // The content to be displayed and filtered
	export let showRegionSelector: boolean = true;
	export let showAllRegionsToggle: boolean = true;
	export let showContentLegend: boolean = true;
	export let showEmptyState: boolean = true;
	export let emptyStateMessage: string = 'No content found for this region.';

	// State variables
	let activeRegion: Region = $userPreferences.region;
	let showOtherRegions: boolean = false;
	let filteredArticles: any[] = [];

	// Filter articles based on region and "show other regions" setting
	function filterArticles() {
		if (!articles || articles.length === 0) {
			filteredArticles = [];
			return;
		}

		if (activeRegion === 'all' || showOtherRegions) {
			// When showing all content or content from all regions
			filteredArticles = [...articles];
		} else {
			// Filter to only show content for the active region or "all regions"
			filteredArticles = articles.filter((article) => {
				const regions = article.regions || ['all'];
				return regions.includes('all') || regions.includes(activeRegion);
			});
		}
	}

	// Handle region change
	function handleRegionChange(event: CustomEvent<{ region: Region }>) {
		activeRegion = event.detail.region;
		filterArticles();
	}

	// Toggle showing content from other regions
	function toggleShowOtherRegions() {
		showOtherRegions = !showOtherRegions;
		filterArticles();
	}

	// Initialize filtering when component mounts
	onMount(() => {
		filterArticles();
	});

	// Update filtering when articles or region changes
	$: {
		if (articles) filterArticles();
	}

	$: {
		if (activeRegion) filterArticles();
	}

	// Check if we're showing content from other regions
	$: hasOtherRegionContent = filteredArticles.some((article) => {
		const regions = article.regions || ['all'];
		return !regions.includes('all') && !regions.includes(activeRegion);
	});
</script>

<section class="filterable-content-section">
	<div class="section-header">
		<div class="title-area">
			<h2>{title}</h2>
			{#if subtitle}
				<p class="subtitle">{subtitle}</p>
			{/if}
		</div>

		{#if showRegionSelector}
			<div class="filter-controls">
				<RegionSelector
					bind:activeRegion
					on:regionChange={handleRegionChange}
					showTemporaryNote={false}
				/>

				{#if showAllRegionsToggle}
					<div class="show-all-toggle">
						<label class="toggle-label">
							<input
								type="checkbox"
								bind:checked={showOtherRegions}
								on:change={toggleShowOtherRegions}
							/>
							<span>Show content from all regions</span>
						</label>

						{#if showOtherRegions && activeRegion !== 'all'}
							<div class="region-note">
								<i class="fas fa-info-circle" aria-hidden="true"></i>
								<span>Some content may not be applicable to your current region.</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if filteredArticles.length === 0 && showEmptyState}
		<!-- Empty state -->
		<div class="empty-state">
			<i class="fas fa-search" aria-hidden="true"></i>
			<p>{emptyStateMessage}</p>

			{#if activeRegion !== 'all' && !showOtherRegions}
				<button type="button" class="show-all-button" on:click={toggleShowOtherRegions}>
					Show content from all regions
				</button>
			{/if}
		</div>
	{:else}
		<!-- Content grid -->
		<div class="content-grid">
			{#each filteredArticles as article (article.id)}
				<ArticleCard
					id={article.id}
					title={article.title}
					summary={article.summary || ''}
					category={article.category || article.type || 'article'}
					regions={article.regions || ['all']}
					publishedDate={article.publishedDate || article.publishDate}
					lastUpdated={article.lastUpdated}
					isRegionSpecific={article.regions && !article.regions.includes('all')}
					primaryRegion={activeRegion}
				/>
			{/each}
		</div>

		{#if showContentLegend && (hasOtherRegionContent || activeRegion !== 'all')}
			<div class="content-legend">
				<div class="legend-item">
					<div class="legend-color universal"></div>
					<span>Available in all regions</span>
				</div>
				<div class="legend-item">
					<div class="legend-color match"></div>
					<span>Specific to your selected region</span>
				</div>
				{#if showOtherRegions || activeRegion === 'all'}
					<div class="legend-item">
						<div class="legend-color other"></div>
						<span>Not applicable to your selected region</span>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</section>

<style>
	.filterable-content-section {
		margin-bottom: 3rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.title-area {
		flex: 1;
		min-width: 200px;
	}

	h2 {
		color: var(--telus-purple, #4b286d);
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
	}

	.subtitle {
		color: var(--text-color-secondary, #666);
		margin: 0.25rem 0 0 0;
		font-size: 0.95rem;
	}

	.filter-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 350px;
	}

	.show-all-toggle {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.region-note {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.5rem;
		background-color: rgba(75, 40, 109, 0.05);
		border-radius: 4px;
		font-size: 0.85rem;
		color: var(--text-color, #333);
	}

	.region-note i {
		color: var(--telus-purple, #4b286d);
		margin-top: 0.15rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		text-align: center;
		color: var(--text-color-secondary, #666);
		margin-bottom: 1rem;
	}

	.empty-state i {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: var(--telus-purple-light, #d2ccde);
	}

	.show-all-button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background-color: var(--telus-purple-light, #d2ccde);
		color: var(--telus-purple, #4b286d);
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.show-all-button:hover {
		background-color: #c5bee0;
	}

	.content-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-top: 0.5rem;
		padding: 0.75rem;
		background-color: #f9f9f9;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-color-secondary, #666);
	}

	.legend-color {
		width: 1rem;
		height: 1rem;
		border-radius: 2px;
	}

	.legend-color.universal {
		background-color: white;
		border-left: 4px solid var(--telus-green, #6abf4b);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.legend-color.match {
		background-color: white;
		border-left: 6px solid var(--telus-purple, #4b286d);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.legend-color.other {
		background-color: #f2f2f2;
		border-left: 4px solid #bbb;
		opacity: 0.7;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
		.section-header {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-controls {
			max-width: none;
		}

		.content-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
