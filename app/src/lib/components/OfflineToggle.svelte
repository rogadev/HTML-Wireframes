<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	let savedPages: { url: string; title: string; date: string }[] = [];
	let isPanelOpen = false;
	let panelElement: HTMLDivElement;

	onMount(() => {
		// Load saved pages from localStorage
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('savedPages');
			if (saved) {
				savedPages = JSON.parse(saved);
			}

			// Add click outside handler
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function handleClickOutside(event: MouseEvent) {
		if (isPanelOpen && panelElement && !panelElement.contains(event.target as Node)) {
			isPanelOpen = false;
		}
	}

	function togglePanel(event: MouseEvent) {
		event.stopPropagation();
		isPanelOpen = !isPanelOpen;
	}

	function saveCurrentPage() {
		const currentPage = {
			url: page.url.pathname,
			title: document.title,
			date: new Date().toISOString()
		};

		// Check if page is already saved
		if (!savedPages.some((p) => p.url === currentPage.url)) {
			savedPages = [...savedPages, currentPage];
			if (typeof window !== 'undefined') {
				localStorage.setItem('savedPages', JSON.stringify(savedPages));
			}
		}
	}

	function removeSavedPage(url: string) {
		savedPages = savedPages.filter((p) => p.url !== url);
		if (typeof window !== 'undefined') {
			localStorage.setItem('savedPages', JSON.stringify(savedPages));
		}
	}

	function downloadPage() {
		// Create a downloadable version of the current page
		const content = document.documentElement.outerHTML;
		const blob = new Blob([content], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;

		// Try to find the first available heading (h1 through h6)
		let filename = '';
		for (let i = 1; i <= 6; i++) {
			const heading = document.querySelector(`h${i}`);
			if (heading && heading.textContent) {
				filename = heading.textContent.trim();
				break;
			}
		}

		// If no heading found, use document title
		if (!filename) {
			filename = document.title;
		}

		// Clean the filename: remove special characters and convert spaces to underscores
		filename = filename
			.replace(/[^a-z0-9\s-]/gi, '') // Remove special characters
			.replace(/\s+/g, '_') // Replace spaces with underscores
			.toLowerCase();

		a.download = `${filename}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<div class="offline-toggle-container">
	<button
		type="button"
		class="offline-toggle"
		on:click={togglePanel}
		aria-label="Save page for offline access"
		aria-expanded={isPanelOpen}
	>
		<i class="fas fa-wifi"></i>
		<span class="offline-status">Save Offline</span>
	</button>

	{#if isPanelOpen}
		<div class="offline-panel" role="dialog" aria-label="Offline pages" bind:this={panelElement}>
			<div class="panel-header">
				<h3>Offline Pages</h3>
				<button type="button" class="close-btn" on:click={togglePanel} aria-label="Close panel">
					<i class="fas fa-times"></i>
				</button>
			</div>

			<div class="panel-actions">
				<button type="button" class="action-btn" on:click={saveCurrentPage}>
					<i class="fas fa-wifi-slash"></i> Save for Offline Access
				</button>
				<button type="button" class="action-btn" on:click={downloadPage}>
					<i class="fas fa-download"></i> Download Page
				</button>
			</div>

			<div class="saved-pages">
				{#if savedPages.length === 0}
					<p class="no-pages">No pages available offline</p>
				{:else}
					{#each savedPages as page}
						<div class="saved-page">
							<div class="page-info">
								<h4>{page.title}</h4>
								<p class="page-date">
									Available offline since {new Date(page.date).toLocaleDateString()}
								</p>
							</div>
							<div class="page-actions">
								<a href={page.url} class="view-link" aria-label="View {page.title}">
									<i class="fas fa-external-link-alt"></i>
								</a>
								<button
									type="button"
									class="remove-btn"
									on:click={() => removeSavedPage(page.url)}
									aria-label="Remove {page.title} from offline pages"
								>
									<i class="fas fa-trash"></i>
								</button>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.offline-toggle-container {
		position: relative;
	}

	.offline-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		color: white;
		padding: 0.5rem;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.offline-toggle:hover {
		opacity: 0.8;
	}

	.offline-status {
		font-size: 0.875rem;
	}

	.offline-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: white;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		width: 300px;
		max-height: 400px;
		overflow-y: auto;
		z-index: 1000;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.panel-header h3 {
		margin: 0;
		font-size: 1rem;
		color: var(--text-color);
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-color);
		cursor: pointer;
		padding: 0.25rem;
	}

	.panel-actions {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--primary-color);
		color: white;
		border: none;
		padding: 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		width: 100%;
		justify-content: center;
	}

	.action-btn:hover {
		background: #3a1f54;
	}

	.saved-pages {
		padding: 1rem;
	}

	.no-pages {
		color: var(--secondary-color);
		text-align: center;
		margin: 1rem 0;
	}

	.saved-page {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		margin-bottom: 0.5rem;
	}

	.page-info h4 {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-color);
	}

	.page-date {
		font-size: 0.75rem;
		color: var(--secondary-color);
		margin: 0.25rem 0 0;
	}

	.page-actions {
		display: flex;
		gap: 0.5rem;
	}

	.view-link,
	.remove-btn {
		background: none;
		border: none;
		color: var(--secondary-color);
		cursor: pointer;
		padding: 0.25rem;
	}

	.view-link:hover,
	.remove-btn:hover {
		color: var(--primary-color);
	}

	@media (max-width: 768px) {
		.offline-status {
			display: none;
		}

		.offline-panel {
			position: fixed;
			top: auto;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			max-height: 80vh;
			border-radius: 8px 8px 0 0;
		}
	}
</style>
