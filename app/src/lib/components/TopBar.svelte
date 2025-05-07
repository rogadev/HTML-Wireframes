<script lang="ts">
	import { onMount } from 'svelte';
	import SearchBar from './SearchBar.svelte';
	import OfflineToggle from './OfflineToggle.svelte';

	export let onLanguageChange: (event: { language: string }) => void;
	export let onRegionChange: (event: { region: string }) => void;

	let selectedLanguage = 'en';
	let selectedRegion = 'all';
	let rememberPreference = true;
	let isPanelOpen = false;
	let isMobile = false;
	let isSearchExpanded = false;

	const languages = [
		{ code: 'en', label: 'English' },
		{ code: 'fr', label: 'Français' }
	];

	const regions = [
		{ code: 'all', label: 'All Regions' },
		{ code: 'qc', label: 'Quebec' },
		{ code: 'on', label: 'Ontario' },
		{ code: 'ab-bc', label: 'Alberta/British Columbia' },
		{ code: 'atlantic', label: 'Atlantic' }
	];

	onMount(() => {
		// Check if we're on mobile
		const checkMobile = () => {
			isMobile = window.innerWidth <= 768;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	// Load saved preferences on component mount
	$: {
		if (typeof window !== 'undefined') {
			const savedLanguage = localStorage.getItem('preferredLanguage');
			const savedRegion = localStorage.getItem('preferredRegion');
			if (savedLanguage) selectedLanguage = savedLanguage;
			if (savedRegion) selectedRegion = savedRegion;
		}
	}

	function togglePanel() {
		isPanelOpen = !isPanelOpen;
		console.log('Panel toggled:', isPanelOpen);
	}

	function handleLanguageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		selectedLanguage = target.value;
		onLanguageChange({ language: selectedLanguage });
		if (rememberPreference && typeof window !== 'undefined') {
			localStorage.setItem('preferredLanguage', selectedLanguage);
		}
	}

	function handleRegionChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedRegion = target.value;
		onRegionChange({ region: selectedRegion });
		if (rememberPreference && typeof window !== 'undefined') {
			localStorage.setItem('preferredRegion', selectedRegion);
		}
	}

	function savePreferences() {
		if (rememberPreference && typeof window !== 'undefined') {
			localStorage.setItem('preferredLanguage', selectedLanguage);
			localStorage.setItem('preferredRegion', selectedRegion);
		}
		isPanelOpen = false;
	}
</script>

<div class="top-bar">
	<div class="top-bar-container">
		<SearchBar {isMobile} isExpanded={isSearchExpanded} />

		<div class="top-bar-right">
			<OfflineToggle />
			<div class="language-display">
				<span class="selected-region">
					{regions.find((r) => r.code === selectedRegion)?.label || 'All Regions'}
				</span>
				<span class="divider">|</span>
				<span class="selected-language">
					{selectedLanguage.toUpperCase()}
				</span>
				<button
					type="button"
					class="language-dropdown-icon"
					on:click={togglePanel}
					on:keydown={(e) => e.key === 'Enter' && togglePanel()}
					aria-expanded={isPanelOpen}
					aria-label="Language preferences"
				>
					<i class="fas fa-chevron-down"></i>
				</button>
			</div>
		</div>

		{#if isPanelOpen}
			<div class="language-preferences-panel" role="dialog" aria-label="Language preferences">
				<div class="language-pref-section">
					<h4>Language</h4>
					{#each languages as lang}
						<div class="language-option">
							<input
								type="radio"
								id="lang-{lang.code}"
								name="language"
								value={lang.code}
								checked={selectedLanguage === lang.code}
								on:change={handleLanguageChange}
							/>
							<label for="lang-{lang.code}">{lang.label}</label>
						</div>
					{/each}
					<div class="remember-preference">
						<input type="checkbox" id="remember-lang" bind:checked={rememberPreference} />
						<label for="remember-lang">Remember my language preference</label>
					</div>
				</div>
				<div class="region-pref-section">
					<h4>Region</h4>
					<select id="region-selector" bind:value={selectedRegion} on:change={handleRegionChange}>
						{#each regions as region}
							<option value={region.code}>{region.label}</option>
						{/each}
					</select>
					<div class="region-info">
						<i class="fas fa-info-circle"></i>
						<span>Content will be filtered based on your region.</span>
					</div>
				</div>
				<div class="pref-actions">
					<button class="save-pref-btn" on:click={savePreferences}> Save Preferences </button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.top-bar {
		background: var(--telus-purple, #4b286d);
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--border-color);
		position: relative;
	}

	.top-bar-container {
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 2rem;
	}

	.top-bar-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.language-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
		flex-shrink: 0;
	}

	.selected-region {
		font-weight: 500;
		color: white;
	}

	.divider {
		color: rgba(255, 255, 255, 0.5);
	}

	.selected-language {
		font-weight: 500;
		color: white;
	}

	.language-dropdown-icon {
		cursor: pointer;
		padding: 0.25rem;
		color: white;
		background: none;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.language-dropdown-icon:hover {
		color: rgba(255, 255, 255, 0.8);
	}

	.language-dropdown-icon[aria-expanded='true'] {
		transform: rotate(180deg);
	}

	.language-preferences-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: white;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 300px;
		margin-top: 0.5rem;
		display: block;
	}

	.language-pref-section,
	.region-pref-section {
		margin-bottom: 1.5rem;
	}

	h4 {
		margin-bottom: 0.75rem;
		color: var(--text-color);
	}

	.language-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.remember-preference {
		margin-top: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		margin-bottom: 0.5rem;
	}

	.region-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--secondary-color);
	}

	.pref-actions {
		margin-top: 1rem;
		text-align: right;
	}

	.save-pref-btn {
		background: var(--primary-color);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.save-pref-btn:hover {
		background: #3a1f54;
	}

	@media (max-width: 768px) {
		.top-bar-container {
			justify-content: flex-end;
			gap: 1rem;
			position: relative;
		}

		.top-bar-right {
			gap: 0.5rem;
		}

		.language-display {
			display: flex;
			font-size: 0.875rem;
			position: relative;
			z-index: 1001;
		}

		.selected-region {
			display: none;
		}

		.divider {
			display: none;
		}

		.selected-language {
			font-weight: 500;
		}

		.language-dropdown-icon {
			padding: 0.25rem;
		}

		.language-preferences-panel {
			right: 0;
			left: 0;
			width: 100%;
			max-width: none;
			border-radius: 0;
			margin-top: 0;
		}
	}
</style>
