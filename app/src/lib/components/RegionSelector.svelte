<script lang="ts">
	import { userPreferences } from '$lib/stores/userPreferences';
	import type { Region } from '$lib/types/userPreferences';

	// The currently selected/active region for viewing content
	export let activeRegion: Region = $userPreferences.region;
	export let label = 'Region';
	export let showAllOption = true;
	export let compact = false;
	export let showResetButton = true;
	export let showTemporaryNote = true;

	// Emits when the region is changed
	function handleRegionChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		activeRegion = target.value as Region;
		dispatchEvent('regionChange', { region: activeRegion });
	}

	// Resets to the user's default region from preferences
	function resetToUserDefault() {
		activeRegion = $userPreferences.region;
		dispatchEvent('regionChange', { region: activeRegion });
	}

	// Custom dispatch event function (instead of createEventDispatcher)
	function dispatchEvent(name: string, detail: any) {
		const customEvent = new CustomEvent(name, {
			detail,
			bubbles: true,
			cancelable: true
		});
		const element = document.querySelector('.region-selector') as HTMLElement;
		if (element) element.dispatchEvent(customEvent);
	}

	// Define regions for the dropdown
	const regions: { code: Region; label: string }[] = [
		{ code: 'all', label: 'All Regions' },
		{ code: 'qc', label: 'Quebec' },
		{ code: 'on', label: 'Ontario' },
		{ code: 'ab-bc', label: 'Alberta/British Columbia' },
		{ code: 'atlantic', label: 'Atlantic' },
		{ code: 'mb-sk', label: 'Manitoba/Saskatchewan' }
	];

	// Remove "All Regions" option if showAllOption is false
	$: displayRegions = showAllOption ? regions : regions.filter((r) => r.code !== 'all');

	// Determine if we're viewing a temporary region different from the user's default
	$: isTemporaryRegion = activeRegion !== $userPreferences.region;

	// Get the current active region label for display
	$: activeRegionLabel = regions.find((r) => r.code === activeRegion)?.label || 'All Regions';

	// Get the user's default region label for display
	$: defaultRegionLabel =
		regions.find((r) => r.code === $userPreferences.region)?.label || 'All Regions';
</script>

<div class="region-selector {compact ? 'compact' : ''}">
	<div class="selector-container">
		{#if label}
			<label for="region-selector" class="region-label">{label}</label>
		{/if}

		<div class="select-wrapper">
			<select
				id="region-selector"
				value={activeRegion}
				on:change={handleRegionChange}
				class:temporary={isTemporaryRegion}
				aria-label="Select region for content filtering"
			>
				{#each displayRegions as region}
					<option value={region.code}>{region.label}</option>
				{/each}
			</select>

			{#if isTemporaryRegion}
				<span class="temporary-indicator" aria-hidden="true">Temporary</span>
			{/if}
		</div>

		{#if showResetButton && isTemporaryRegion}
			<button
				type="button"
				class="reset-button"
				on:click={resetToUserDefault}
				aria-label="Reset to your default region"
			>
				<i class="fas fa-sync-alt"></i>
			</button>
		{/if}
	</div>

	{#if showTemporaryNote && isTemporaryRegion}
		<div class="region-note">
			<i class="fas fa-info-circle" aria-hidden="true"></i>
			<span>
				Viewing {activeRegionLabel} content. Your default region is
				{defaultRegionLabel}.
			</span>
		</div>
	{/if}
</div>

<style>
	.region-selector {
		margin-bottom: 1rem;
	}

	.selector-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.region-label {
		font-weight: 500;
		color: var(--text-color, #333);
		font-size: 0.9rem;
	}

	.select-wrapper {
		position: relative;
		flex-grow: 1;
		max-width: 300px;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		padding-right: 2rem;
		border: 1px solid var(--border-color, #ddd);
		border-radius: 4px;
		font-size: 0.9rem;
		background-color: white;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%234B286D' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: calc(100% - 0.5rem) center;
	}

	select.temporary {
		border-color: var(--telus-purple, #4b286d);
		background-color: rgba(75, 40, 109, 0.05);
	}

	.temporary-indicator {
		position: absolute;
		top: -0.5rem;
		right: 0.5rem;
		font-size: 0.7rem;
		background-color: var(--telus-purple, #4b286d);
		color: white;
		padding: 0.1rem 0.3rem;
		border-radius: 2px;
		pointer-events: none;
	}

	.reset-button {
		background: none;
		border: none;
		color: var(--telus-purple, #4b286d);
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.reset-button:hover {
		color: var(--telus-purple-dark, #3a1f54);
	}

	.region-note {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-top: 0.5rem;
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

	.compact .region-label {
		display: none;
	}

	.compact select {
		font-size: 0.85rem;
		padding: 0.35rem 0.5rem;
	}

	.compact .region-note {
		font-size: 0.8rem;
	}
</style>
