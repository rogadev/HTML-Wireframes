<script lang="ts">
	import { page } from '$app/state';

	type BreadcrumbSegment = {
		label: string;
		path: string;
		isLast: boolean;
	};

	// Track the current path segments and create breadcrumb items
	let pathSegments: BreadcrumbSegment[] = [];

	$: {
		try {
			// Ensure page.url.pathname is available before processing
			if (page && page.url && page.url.pathname) {
				const paths = page.url.pathname.split('/').filter(Boolean);
				pathSegments = paths.map((segment, index) => {
					const path = '/' + paths.slice(0, index + 1).join('/');
					return {
						label: formatSegment(segment),
						path,
						isLast: index === paths.length - 1
					};
				});
			} else {
				// Default to empty array if pathname not available
				pathSegments = [];
			}
		} catch (err) {
			console.error('Error processing breadcrumbs:', err);
			// Set empty breadcrumbs to avoid breaking the UI
			pathSegments = [];
		}
	}

	// Format segment to be more readable
	function formatSegment(segment: string): string {
		// Replace hyphens with spaces and capitalize each word
		return segment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Handle keyboard navigation for accessibility
	function handleKeydown(e: KeyboardEvent, path: string) {
		if (e.key === 'Enter' || e.key === ' ') {
			window.location.href = path;
		}
	}
</script>

<nav aria-label="Breadcrumb" class="breadcrumb">
	<ol>
		<li>
			<a href="/" onkeydown={(e) => handleKeydown(e, '/')} tabindex="0">Home</a>
		</li>
		{#each pathSegments as { label, path, isLast }}
			<li>
				{#if isLast}
					<span aria-current="page">{label}</span>
				{:else}
					<a href={path} onkeydown={(e) => handleKeydown(e, path)} tabindex="0">{label}</a>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	.breadcrumb {
		margin: 1rem 0;
		font-size: 0.9rem;
	}

	ol {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		display: flex;
		align-items: center;
	}

	li:not(:first-child)::before {
		content: '/';
		margin: 0 0.5rem;
		color: var(--text-muted, #6b7280);
	}

	a {
		color: var(--primary-color, #4b286d);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	a:hover,
	a:focus {
		color: var(--secondary-color, #248700);
		text-decoration: underline;
	}

	span {
		color: var(--text-muted, #6b7280);
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.breadcrumb {
			overflow-x: auto;
			white-space: nowrap;
			padding-bottom: 0.5rem;
		}
	}
</style>
