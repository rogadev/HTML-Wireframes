<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { userPreferences } from '$lib/stores/userPreferences';

	let { isMobile, isExpanded } = $props<{
		isMobile: boolean;
		isExpanded: boolean;
	}>();

	let searchQuery = $state('');
	let searchLanguage = $state('en');
	let showLanguageFilters = $state(false);

	// Set default language from user preferences
	$effect(() => {
		userPreferences.subscribe((prefs) => {
			searchLanguage = prefs.language || 'en';
		});
	});

	function handleSearch() {
		if (searchQuery.trim()) {
			const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}&lang=${searchLanguage}`;

			// If we're already on the search page, force a page reload
			if (page.url.pathname === '/search') {
				window.location.href = searchUrl;
			} else {
				goto(searchUrl);
			}

			// Reset the search input after navigation
			searchQuery = '';
			// Collapse the mobile search if it's expanded
			if (isMobile && isExpanded) {
				isExpanded = false;
			}
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSearch();
		}
	}

	function toggleSearch() {
		isExpanded = !isExpanded;
		if (isExpanded) {
			// Focus the input when expanded
			setTimeout(() => {
				const input = document.querySelector('.search-input') as HTMLInputElement;
				if (input) input.focus();
			}, 0);
		}
	}

	function toggleLanguageFilters() {
		showLanguageFilters = !showLanguageFilters;
	}

	function setLanguage(lang: 'en' | 'fr') {
		searchLanguage = lang;
		showLanguageFilters = false;
	}
</script>

<div class="search-container" class:expanded={isExpanded}>
	{#if !isMobile}
		<div class="search-wrapper">
			<i class="fas fa-search search-icon"></i>
			<input
				type="text"
				class="search-input"
				bind:value={searchQuery}
				onkeydown={handleKeydown}
				placeholder="Search for articles, documentation, or guides..."
				aria-label="Search"
			/>
			<button
				type="button"
				class="language-toggle"
				onclick={toggleLanguageFilters}
				aria-label="Toggle language filters"
				aria-haspopup="true"
				aria-expanded={showLanguageFilters}
			>
				<span class="language-indicator">{searchLanguage.toUpperCase()}</span>
				<i class="fas fa-chevron-down"></i>
			</button>
			{#if showLanguageFilters}
				<div class="language-dropdown">
					<button
						type="button"
						class:active={searchLanguage === 'en'}
						onclick={() => setLanguage('en')}
					>
						English
					</button>
					<button
						type="button"
						class:active={searchLanguage === 'fr'}
						onclick={() => setLanguage('fr')}
					>
						Français
					</button>
					<div class="dropdown-info">Search results will be filtered to your selected language</div>
				</div>
			{/if}
			<button type="button" class="search-button" onclick={handleSearch} aria-label="Submit search">
				Search
			</button>
		</div>
	{:else if isExpanded}
		<div class="search-wrapper mobile">
			<input
				type="text"
				class="search-input"
				bind:value={searchQuery}
				onkeydown={handleKeydown}
				placeholder="Search..."
				aria-label="Search"
			/>
			<button
				type="button"
				class="language-toggle-mobile"
				onclick={toggleLanguageFilters}
				aria-label="Toggle language filters"
			>
				{searchLanguage.toUpperCase()}
			</button>
			{#if showLanguageFilters}
				<div class="language-dropdown mobile">
					<button
						type="button"
						class:active={searchLanguage === 'en'}
						onclick={() => setLanguage('en')}
					>
						English
					</button>
					<button
						type="button"
						class:active={searchLanguage === 'fr'}
						onclick={() => setLanguage('fr')}
					>
						Français
					</button>
				</div>
			{/if}
			<button
				type="button"
				class="search-button purple-background"
				onclick={handleSearch}
				aria-label="Submit search"
			>
				<div class="search-icon-bg">
					<i class="fas fa-search"></i>
				</div>
			</button>
		</div>
	{:else}
		<button type="button" class="search-toggle" onclick={toggleSearch} aria-label="Toggle search">
			<i class="fas fa-search"></i>
		</button>
	{/if}
</div>

<style>
	.purple-background {
		background: #4b286d;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
	}

	.search-container {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex: 1;
		max-width: 600px;
		margin-right: auto;
	}

	.search-wrapper {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		background: white;
		border-radius: 4px;
		padding: 0.25rem;
		position: relative;
	}

	.search-wrapper.mobile {
		background: transparent;
		padding: 0;
	}

	.search-icon {
		color: var(--secondary-color);
		padding: 0.5rem;
	}

	.search-input {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 0.875rem;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px rgba(75, 40, 109, 0.1);
	}

	.language-toggle {
		background: #f0f0f0;
		color: #333;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		transition: background-color 0.2s;
	}

	.language-toggle:hover {
		background: #e5e5e5;
	}

	.language-toggle-mobile {
		background: #4b286d;
		color: white;
		border: none;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.language-indicator {
		font-weight: 600;
	}

	.language-dropdown {
		position: absolute;
		top: 100%;
		right: 70px;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 100;
		min-width: 150px;
		padding: 0.5rem;
		margin-top: 0.25rem;
	}

	.language-dropdown.mobile {
		right: 55px;
		top: 45px;
	}

	.language-dropdown button {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.5rem;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: 4px;
	}

	.language-dropdown button:hover {
		background: #f5f5f5;
	}

	.language-dropdown button.active {
		background: rgba(75, 40, 109, 0.1);
		font-weight: 600;
		color: var(--primary-color);
	}

	.dropdown-info {
		font-size: 0.7rem;
		color: #666;
		padding: 0.5rem;
		border-top: 1px solid #eee;
		margin-top: 0.5rem;
	}

	.search-button {
		background: var(--primary-color);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.search-button:hover {
		background: #3a1f54;
	}

	.search-toggle {
		background: none;
		border: none;
		color: white;
		padding: 0.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-toggle:hover {
		color: rgba(255, 255, 255, 0.8);
	}

	@media (max-width: 768px) {
		.search-container {
			margin: 0;
			max-width: none;
			width: auto;
			justify-content: flex-end;
		}

		.search-container.expanded {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: var(--telus-purple);
			padding: 1rem;
			z-index: 1000;
			width: 100%;
		}

		.search-wrapper.mobile {
			width: 100%;
			gap: 0.5rem;
		}

		.search-wrapper.mobile .search-input {
			width: 100%;
			background: white;
			height: 48px;
			font-size: 1rem;
			padding: 0 1rem;
		}

		.search-wrapper.mobile .purple-background {
			padding: 0;
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
			background: transparent;
		}

		.search-wrapper.mobile .search-icon-bg {
			background: #4b286d;
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 3rem;
			height: 3rem;
		}

		.search-wrapper.mobile .search-icon-bg i {
			color: white;
			font-size: 1.1rem;
			padding: 0;
		}
	}
</style>
