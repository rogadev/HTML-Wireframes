<script lang="ts">
	import { onMount } from 'svelte';

	// State for controlling menu visibility
	let isOpen = $state(false);
	let activeCategory = $state<string | null>(null);

	// Define the link type with optional external property
	type LinkItem = {
		label: string;
		href: string;
		external?: boolean;
	};

	// Quick link categories and their items
	const quickLinks: Record<string, LinkItem[]> = {
		'Billing & PSB': [
			{ label: 'Quick Billing Guide', href: '/quick-guide' },
			{ label: 'Repair Guidelines', href: '/repair-guidelines' },
			{ label: 'Rate Cards', href: '/rate-cards' },
			{ label: 'Regional Rules', href: '/regional-rules' }
		],
		'Job Aids': [
			{ label: 'Installation Guides', href: '/installation-guides' },
			{ label: 'Troubleshooting', href: '/troubleshooting' },
			{ label: 'Device Library', href: '/device-library' },
			{ label: 'Network Topology', href: '/network-topology' }
		],
		'Hardware Business Rules': [
			{ label: 'Current HBRs', href: '/hardware-rules' },
			{ label: 'Equipment Safety', href: '/equipment-safety' },
			{ label: 'Technical Specifications', href: '/technical-specs' }
		],
		'Apps & Tools': [
			{ label: 'Insight', href: 'https://insight.telus.com', external: true },
			{ label: 'eFulfillment', href: 'https://efulfillment.telus.com', external: true },
			{ label: 'DST', href: 'https://dst.telus.com', external: true },
			{ label: 'DSLE', href: 'https://dsle.telus.com', external: true },
			{ label: 'ADC', href: 'https://adc.telus.com', external: true },
			{ label: 'BOLD', href: 'https://bold.telus.com', external: true }
		],
		'Customer Apps': [
			{ label: 'SmartHome Connect', href: 'https://smarthome.telus.com', external: true },
			{ label: 'MyTELUS', href: 'https://my.telus.com', external: true },
			{ label: 'TELUS Health', href: 'https://health.telus.com', external: true },
			{ label: 'TELUS Pet', href: 'https://pet.telus.com', external: true }
		]
	};

	// Toggle the menu open/closed
	function toggleMenu() {
		isOpen = !isOpen;
		// Reset active category when closing
		if (!isOpen) {
			activeCategory = null;
		}
	}

	// Toggle category to show its links
	function toggleCategory(category: string) {
		activeCategory = activeCategory === category ? null : category;
	}

	// Handle keydown events for accessibility
	function handleMenuKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isOpen = false;
			activeCategory = null;
		}
	}

	function handleToggleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			toggleMenu();
		}
	}

	function handleCategoryKeydown(e: KeyboardEvent, category: string) {
		if (e.key === 'Enter' || e.key === ' ') {
			toggleCategory(category);
		}
	}

	// Close menu when clicking outside
	let menuElement: HTMLElement;

	function handleClickOutside(event: MouseEvent) {
		if (
			isOpen &&
			menuElement &&
			!menuElement.contains(event.target as Node) &&
			!(event.target as Element).classList.contains('menu-toggle')
		) {
			isOpen = false;
			activeCategory = null;
		}
	}

	onMount(() => {
		console.log('QuickLinksMenu component initializing');
		try {
			// Add event listener with error handling wrapper
			const safeClickHandler = (event: MouseEvent) => {
				try {
					handleClickOutside(event);
				} catch (err) {
					console.error('Error in QuickLinksMenu click handler:', err);
				}
			};

			document.addEventListener('click', safeClickHandler);

			return () => {
				console.log('QuickLinksMenu component unmounting');
				try {
					document.removeEventListener('click', safeClickHandler);
				} catch (err) {
					console.error('Error cleaning up QuickLinksMenu:', err);
				}
			};
		} catch (err) {
			console.error('Error setting up QuickLinksMenu event handlers:', err);
			// Return a no-op cleanup function
			return () => {};
		}
	});
</script>

<div class="quick-links-menu-container" bind:this={menuElement}>
	<button
		type="button"
		class="menu-toggle"
		onclick={toggleMenu}
		onkeydown={handleToggleKeydown}
		aria-expanded={isOpen}
		aria-label="Quick links menu"
	>
		<i class="fas fa-toolbox"></i>
		<span>Quick Links</span>
	</button>

	{#if isOpen}
		<div class="menu-panel" role="menu" tabindex="0" onkeydown={handleMenuKeydown}>
			<div class="panel-header">
				<h3>Quick Access Tools</h3>
				<button type="button" onclick={toggleMenu} aria-label="Close quick links menu">
					<i class="fas fa-times"></i>
				</button>
			</div>

			<div class="categories">
				{#each Object.entries(quickLinks) as [category, links]}
					<div class="category">
						<div
							class="category-header"
							onclick={() => toggleCategory(category)}
							onkeydown={(e) => handleCategoryKeydown(e, category)}
							role="button"
							tabindex="0"
							aria-expanded={activeCategory === category}
						>
							<span>{category}</span>
							<i class="fas fa-chevron-{activeCategory === category ? 'up' : 'down'}"></i>
						</div>

						{#if activeCategory === category}
							<ul class="links-list" role="menu">
								{#each links as link}
									<li role="none">
										<a
											href={link.href}
											target={link.external ? '_blank' : undefined}
											rel={link.external ? 'noopener noreferrer' : undefined}
											role="menuitem"
										>
											{link.label}
											{#if link.external}
												<i class="fas fa-external-link-alt"></i>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.quick-links-menu-container {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		z-index: 1000;
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--primary-color, #4b286d);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.75rem 1rem;
		font-weight: 500;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.menu-toggle:hover {
		background-color: #3a1f57;
	}

	.menu-panel {
		position: absolute;
		bottom: calc(100% + 0.5rem);
		right: 0;
		width: 300px;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
		max-height: 70vh;
		overflow-y: auto;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color, #e5e7eb);
	}

	.panel-header h3 {
		margin: 0;
		font-size: 1.15rem;
		color: var(--primary-color, #4b286d);
	}

	.panel-header button {
		background: none;
		border: none;
		color: var(--text-muted, #6b7280);
		cursor: pointer;
		font-size: 1.1rem;
	}

	.categories {
		display: flex;
		flex-direction: column;
	}

	.category {
		border-bottom: 1px solid var(--border-color, #e5e7eb);
	}

	.category:last-child {
		border-bottom: none;
	}

	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.875rem 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
		font-weight: 500;
	}

	.category-header:hover {
		background-color: rgba(75, 40, 109, 0.05);
	}

	.links-list {
		list-style: none;
		padding: 0;
		margin: 0;
		background-color: #f9fafc;
	}

	.links-list li {
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	.links-list a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.5rem;
		color: var(--text-color, #1f2937);
		text-decoration: none;
		transition: background-color 0.2s ease;
	}

	.links-list a:hover {
		background-color: rgba(75, 40, 109, 0.05);
		color: var(--primary-color, #4b286d);
	}

	@media (max-width: 640px) {
		.quick-links-menu-container {
			bottom: 1rem;
			right: 1rem;
		}

		.menu-panel {
			width: 280px;
			max-height: 60vh;
		}
	}
</style>
