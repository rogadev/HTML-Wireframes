<script lang="ts">
	import { userPreferences } from '$lib/stores/userPreferences';
	import type { Region } from '$lib/types/userPreferences';

	// Get the default region from the store
	let defaultRegion: Region = 'on'; // Fallback default
	$effect(() => {
		// Update it when the store value changes
		const storeValue = userPreferences;
		if (storeValue && 'region' in storeValue) {
			defaultRegion = storeValue.region as Region;
		}
	});

	const {
		id,
		title,
		summary = '',
		category,
		regions = [],
		publishedDate,
		lastUpdated,
		isRegionSpecific = false,
		primaryRegion = defaultRegion,
		selectedRegions = [] // For explicit region filtering, empty means use primaryRegion
	} = $props<{
		id: string;
		title: string;
		summary?: string;
		category: string;
		regions?: Region[];
		publishedDate: string;
		lastUpdated: string;
		isRegionSpecific?: boolean;
		primaryRegion?: Region;
		selectedRegions?: Region[];
	}>();

	// Calculate display properties
	const isForAllRegions = $derived(regions.includes('all'));
	const effectiveFilterRegions = $derived(
		selectedRegions.length > 0 ? selectedRegions : [primaryRegion]
	);
	const isRelevantToUser = $derived(
		isForAllRegions || regions.some((r: Region) => effectiveFilterRegions.includes(r))
	);

	// Set component styling based on content relevance
	const cardClasses = $derived(
		[
			'article-card',
			isRegionSpecific ? 'region-specific' : 'region-universal',
			!isRelevantToUser ? 'region-other' : '',
			regions.includes(primaryRegion) ? 'region-match' : ''
		]
			.filter(Boolean)
			.join(' ')
	);

	// Get region display name
	function getRegionDisplayName(regionCode: Region): string {
		const regionMap: Record<Region, string> = {
			all: 'All Regions',
			qc: 'Quebec',
			on: 'Ontario',
			'ab-bc': 'Alberta/BC',
			atlantic: 'Atlantic',
			'mb-sk': 'Manitoba/Saskatchewan'
		};
		return regionMap[regionCode] || regionCode.toUpperCase();
	}

	// Format dates for display
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-CA', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Get category display name
	function getCategoryDisplay(category: string): string {
		const categories: Record<string, string> = {
			billing: 'Billing',
			installation: 'Installation',
			hardware: 'Hardware',
			troubleshooting: 'Troubleshooting',
			valuegen: 'ValueGen',
			documentation: 'Documentation',
			guide: 'Guide',
			training: 'Training',
			manager: 'Manager',
			alert: 'Alert'
		};
		return (
			categories[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1)
		);
	}

	// Get region badge label
	function getRegionBadgeLabel(): string {
		if (isForAllRegions) {
			return 'All Regions';
		}

		const regionLabels: Record<Region, string> = {
			all: 'All',
			qc: 'QC',
			on: 'ON',
			'ab-bc': 'AB/BC',
			atlantic: 'Atlantic',
			'mb-sk': 'MB/SK'
		};

		if (regions.length === 1) {
			return regionLabels[regions[0] as Region];
		}

		return `${regionLabels[regions[0] as Region]}+`;
	}
</script>

<div class={cardClasses} aria-labelledby={`article-title-${id}`}>
	<div class="card-header">
		<div class="category-badge">{getCategoryDisplay(category)}</div>

		{#if isRegionSpecific}
			<div
				class="region-badge"
				title={regions.map((r: Region) => getRegionDisplayName(r)).join(', ')}
			>
				{getRegionBadgeLabel()}
			</div>
		{/if}
	</div>

	<div class="card-content">
		<h3 class="card-title" id={`article-title-${id}`}>
			<a href="/articles/{id}">{title}</a>
		</h3>

		<p class="card-summary">{summary}</p>
	</div>

	<div class="card-footer">
		<div class="dates">
			<div class="date-item">
				<span class="date-label">Published:</span>
				<span class="date-value">{formatDate(publishedDate)}</span>
			</div>
			<div class="date-item">
				<span class="date-label">Last updated:</span>
				<span class="date-value">{formatDate(lastUpdated)}</span>
			</div>
		</div>

		{#if !isRelevantToUser}
			<div class="region-notice" aria-live="polite">
				<i class="fas fa-info-circle" aria-hidden="true"></i>
				<span>Not applicable for your selected region</span>
			</div>
		{/if}
	</div>

	{#if !isForAllRegions}
		<div class="region-indicator" aria-hidden="true">
			<span class="sr-only"
				>Available in: {regions.map((r: Region) => getRegionDisplayName(r)).join(', ')}</span
			>
		</div>
	{/if}
</div>

<style>
	.article-card {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		padding: 1rem;
		margin-bottom: 1.5rem;
		border-left: 4px solid transparent;
		display: flex;
		flex-direction: column;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	.article-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.region-universal {
		border-left-color: var(--telus-green, #6abf4b);
	}

	.region-specific {
		border-left-color: var(--telus-purple, #4b286d);
	}

	.region-other {
		opacity: 0.7;
		border-left-color: #bbb;
	}

	.region-match {
		border-left-color: var(--telus-purple, #4b286d);
		border-left-width: 6px;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.category-badge {
		font-size: 0.75rem;
		background-color: var(--telus-purple-light, #d2ccde);
		color: var(--telus-purple, #4b286d);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-weight: 500;
	}

	.region-badge {
		font-size: 0.75rem;
		background-color: var(--telus-purple, #4b286d);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-weight: 500;
	}

	.card-title {
		font-size: 1.125rem;
		margin: 0 0 0.5rem 0;
		line-height: 1.3;
	}

	.card-title a {
		color: var(--text-color, #333);
		text-decoration: none;
	}

	.card-title a:hover {
		color: var(--telus-purple, #4b286d);
		text-decoration: underline;
	}

	.card-summary {
		color: var(--text-color-secondary, #555);
		margin: 0 0 1rem 0;
		line-height: 1.5;
		font-size: 0.95rem;
	}

	.card-footer {
		margin-top: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.8rem;
	}

	.dates {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.date-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.date-label {
		color: var(--text-color-secondary, #555);
	}

	.date-value {
		color: var(--text-color, #333);
		font-weight: 500;
	}

	.region-notice {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--text-color-secondary, #555);
		font-size: 0.8rem;
		background-color: #f5f5f5;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.region-indicator {
		position: absolute;
		top: 0;
		right: 0;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 40px 40px 0;
		border-color: transparent var(--telus-purple, #4b286d) transparent transparent;
		opacity: 0.3;
	}

	.region-match .region-indicator {
		opacity: 0.8;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
