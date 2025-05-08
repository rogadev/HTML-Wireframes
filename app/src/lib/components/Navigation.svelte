<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/news', label: 'News' },
		{ href: '/learning-hub', label: 'Learning Hub' },
		{ href: '/valuegen', label: 'Deals & Offers' },
		{ href: '/billing', label: 'Billing' },
		{ href: '/training', label: 'Training' },
		{ href: '/partners', label: 'Partners' },
		{ href: '/managers', label: 'Managers' }
	];

	let isMobileMenuOpen = false;
	let navElement: HTMLElement;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		try {
			if (isMobileMenuOpen && navElement && !navElement.contains(event.target as Node)) {
				isMobileMenuOpen = false;
			}
		} catch (err) {
			console.error('Error in Navigation click outside handler:', err);
			// Default to closing the menu on error
			isMobileMenuOpen = false;
		}
	}

	function handleNavigation() {
		try {
			isMobileMenuOpen = false;
		} catch (err) {
			console.error('Error in Navigation handleNavigation:', err);
		}
	}

	onMount(() => {
		console.log('Navigation component initializing');

		try {
			// Create a safe handler with error handling
			const safeClickHandler = (event: MouseEvent) => {
				try {
					handleClickOutside(event);
				} catch (err) {
					console.error('Error in Navigation click handler:', err);
				}
			};

			document.addEventListener('click', safeClickHandler);

			return () => {
				console.log('Navigation component unmounting');
				try {
					document.removeEventListener('click', safeClickHandler);
				} catch (err) {
					console.error('Error cleaning up Navigation event listeners:', err);
				}
			};
		} catch (err) {
			console.error('Error initializing Navigation component:', err);
			// Return a no-op cleanup function
			return () => {};
		}
	});

	// Safe reactive statements
	let currentPath = '';
	$: {
		try {
			if (page && page.url && page.url.pathname) {
				currentPath = page.url.pathname;
			}
		} catch (err) {
			console.error('Error processing page path in Navigation:', err);
			currentPath = '/';
		}
	}

	$: {
		try {
			if (currentPath) handleNavigation();
		} catch (err) {
			console.error('Error in Navigation path change handler:', err);
		}
	}
</script>

<nav bind:this={navElement}>
	<a href="/" class="logo" aria-label="Navigate to home" style="text-decoration: none;"
		>Tech Central</a
	>
	<button
		type="button"
		class="mobile-menu-btn"
		on:click={toggleMobileMenu}
		aria-label="Toggle mobile menu"
		aria-expanded={isMobileMenuOpen}
		aria-controls="mobile-menu"
	>
		<i class="fas fa-bars"></i>
	</button>
	<ul id="mobile-menu" class="nav-links" class:open={isMobileMenuOpen} role="menu">
		{#each navItems as item}
			<li role="none">
				<a
					href={item.href}
					class:active={currentPath === item.href}
					role="menuitem"
					aria-current={currentPath === item.href ? 'page' : undefined}
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		position: relative;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--primary-color);
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-links a {
		text-decoration: none;
		color: var(--text-color);
		font-weight: 500;
		padding: 0.5rem;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.nav-links a:hover {
		color: var(--primary-color);
		background: rgba(75, 40, 109, 0.1);
	}

	.nav-links a.active {
		color: var(--primary-color);
		background: rgba(75, 40, 109, 0.1);
	}

	.mobile-menu-btn {
		display: none;
		background: none;
		border: none;
		font-size: 1.25rem;
		color: var(--text-color);
		cursor: pointer;
		padding: 0.5rem;
	}

	@media (max-width: 1200px) {
		.mobile-menu-btn {
			display: block;
		}

		.nav-links {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: white;
			padding: 1rem;
			flex-direction: column;
			gap: 0.5rem;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			z-index: 1000;
		}

		.nav-links.open {
			display: flex;
		}

		.nav-links a {
			display: block;
			padding: 0.75rem;
		}
	}
</style>
