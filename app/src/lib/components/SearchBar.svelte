<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	export let isMobile = false;
	export let isExpanded = false;

	let searchQuery = '';

	function handleSearch() {
		if (searchQuery.trim()) {
			const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;

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
</script>

<div class="search-container" class:expanded={isExpanded}>
	{#if !isMobile}
		<div class="search-wrapper">
			<i class="fas fa-search search-icon"></i>
			<input
				type="text"
				class="search-input"
				bind:value={searchQuery}
				on:keydown={handleKeydown}
				placeholder="Search for articles, documentation, or guides..."
				aria-label="Search"
			/>
			<button class="search-button" on:click={handleSearch} aria-label="Submit search">
				Search
			</button>
		</div>
	{:else if isExpanded}
		<div class="search-wrapper mobile">
			<input
				type="text"
				class="search-input"
				bind:value={searchQuery}
				on:keydown={handleKeydown}
				placeholder="Search..."
				aria-label="Search"
			/>
			<button
				type="button"
				class="search-button purple-background"
				on:click={handleSearch}
				aria-label="Submit search"
			>
				<div class="search-icon-bg">
					<i class="fas fa-search"></i>
				</div>
			</button>
		</div>
	{:else}
		<button type="button" class="search-toggle" on:click={toggleSearch} aria-label="Toggle search">
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
