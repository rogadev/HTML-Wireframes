<script lang="ts">
	import { onMount } from 'svelte';
	import CriticalAlert from '$lib/components/CriticalAlert.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardGrid from '$lib/components/CardGrid.svelte';

	// Sample content for demonstration
	const featuredContent = [
		{
			title: 'Installing Fiber Optic in Your New Home',
			description:
				'A comprehensive guide to installing fiber optic internet in your new home, including best practices and common pitfalls to avoid.',
			imageUrl: '/images/getting-started.jpg',
			link: '/articles/fiber-installation-guide',
			category: 'Guide',
			tags: ['Fiber', 'Installation', 'Home'],
			date: 'June 1, 2024',
			author: 'John Doe'
		},
		{
			title: 'Understanding Fiber Optic Technology',
			description:
				"Learn about the technology behind fiber optic internet and why it's the future of high-speed connectivity.",
			imageUrl: '/images/technical-resources.jpg',
			link: '/articles/fiber-technology-understanding',
			category: 'Technology',
			tags: ['Fiber', 'Technology', 'Internet'],
			date: 'May 28, 2024',
			author: 'Jane Smith'
		},
		{
			title: 'Fiber vs. Cable: Making the Right Choice',
			description:
				'Compare fiber optic and cable internet to make an informed decision for your home or business.',
			imageUrl: '/images/product-updates.jpg',
			link: '/articles/fiber-vs-cable',
			category: 'Comparison',
			tags: ['Fiber', 'Cable', 'Internet'],
			date: 'May 25, 2024',
			author: 'Tech Central Team'
		}
	];
</script>

<CriticalAlert
	message="All RT-3000 series routers must be updated to firmware v6.2.1 by June 15th."
	linkText="Read More"
	linkHref="/critical-update"
/>

<section class="hero">
	<h1>Welcome to Tech Central</h1>
	<p>Your centralized portal for all company resources and information</p>
	<div class="hero-buttons">
		<a href="/articles/fiber-installation-guide" class="hero-btn primary-btn">
			<i class="fas fa-bolt"></i> Fiber Installation Guide
		</a>
		<a href="/articles" class="hero-btn secondary-btn">
			<i class="fas fa-book"></i> Browse All Articles
		</a>
	</div>
</section>

<section class="featured-content">
	<div class="section-header">
		<h2>Featured Content</h2>
		<a href="/articles" class="view-all-btn">
			View All <i class="fas fa-arrow-right"></i>
		</a>
	</div>
	<CardGrid columns={3}>
		{#each featuredContent as content}
			<Card {...content} />
		{/each}
	</CardGrid>
</section>

<section class="personalized-feed">
	<div class="section-header">
		<h2>Your Personalized Feed</h2>
		<button class="customize-feed-btn">
			<i class="fas fa-sliders-h"></i> Customize
		</button>
	</div>
	<div class="personalization-notice">
		<i class="fas fa-info-circle"></i>
		<span>Content is personalized based on your role, region, and preferences.</span>
		<a href="/profile-dashboard" class="manage-preferences-link">Manage Preferences</a>
	</div>
</section>

<style>
	.hero {
		text-align: center;
		padding: 4rem 1rem;
		background: linear-gradient(to right, var(--primary-color), #6c5ce7);
		color: white;
	}

	.hero h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.hero-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 2rem;
	}

	.featured-content {
		max-width: 1200px;
		margin: 3rem auto;
		padding: 0 1rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.view-all-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		color: var(--primary-color);
		font-weight: 500;
		cursor: pointer;
		padding: 0.5rem;
		text-decoration: none;
	}

	.view-all-btn:hover {
		text-decoration: underline;
	}

	.personalized-feed {
		max-width: 1200px;
		margin: 3rem auto;
		padding: 0 1rem;
	}

	.personalization-notice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #e9ecef;
		padding: 0.75rem;
		border-radius: 4px;
	}

	.manage-preferences-link {
		color: var(--primary-color);
		text-decoration: none;
		margin-left: auto;
	}

	.manage-preferences-link:hover {
		text-decoration: underline;
	}

	.customize-feed-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: white;
		border: 1px solid var(--border-color);
		color: var(--text-color);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.customize-feed-btn:hover {
		background: #f8f9fa;
		border-color: var(--primary-color);
	}
</style>
