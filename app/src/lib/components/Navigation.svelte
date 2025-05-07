<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/managers', label: 'Managers' },
		{ href: '/news', label: 'News' },
		{ href: '/learning-hub', label: 'Learning Hub' },
		{ href: '/valuegen', label: 'ValueGen' },
		{ href: '/billing', label: 'Billing' },
		{ href: '/partners', label: 'Partners' },
		{ href: '/training', label: 'Training' }
	];

	let isMobileMenuOpen = false;
	let navElement: HTMLElement;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (isMobileMenuOpen && navElement && !navElement.contains(event.target as Node)) {
			isMobileMenuOpen = false;
		}
	}

	function handleNavigation() {
		isMobileMenuOpen = false;
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	$: currentPath = page.url.pathname;
	$: if (currentPath) handleNavigation();
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
