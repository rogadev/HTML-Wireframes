<script lang="ts">
	import { onMount } from 'svelte';
	import CriticalAlert from '$lib/components/CriticalAlert.svelte';
	import HotOffers from '$lib/components/HotOffers.svelte';
	import TechnicalBulletins from '$lib/components/TechnicalBulletins.svelte';
	import BillingUpdates from '$lib/components/BillingUpdates.svelte';
	import QuickLinks from '$lib/components/QuickLinks.svelte';
	import PersonalizedFeed from '$lib/components/PersonalizedFeed.svelte';
	import UserQuickAccess from '$lib/components/UserQuickAccess.svelte';
	import { userPreferences } from '$lib/stores/userPreferences';
	import type { UserPreferences } from '$lib/types/userPreferences';

	let homepageData: {
		hotOffers: Array<{
			title: string;
			description: string;
			validUntil: string;
			link: string;
		}>;
		technicalBulletins: Array<{
			title: string;
			description: string;
			date: string;
			link: string;
		}>;
		billingUpdates: Array<{
			title: string;
			description: string;
			date: string;
			link: string;
		}>;
		quickLinks: {
			billingGuide: {
				title: string;
				description: string;
				link: string;
			};
			repairGuidelines: {
				title: string;
				description: string;
				link: string;
			};
		};
		personalizedFeed: Array<{
			type: string;
			date: string;
			title: string;
			description: string;
			relevance: string;
			link: string;
		}>;
		recentArticles: Array<{
			title: string;
			link: string;
			timeViewed: string;
		}>;
		savedArticles: Array<{
			title: string;
			link: string;
		}>;
	};

	let loading = true;

	// Reactive statement to fetch data when preferences change
	$: fetchHomepageData($userPreferences);

	async function fetchHomepageData(preferences: UserPreferences) {
		loading = true;
		try {
			// Build query parameters based on preferences
			const params = new URLSearchParams({
				region: preferences.region,
				language: preferences.language,
				role: preferences.role,
				teamType: preferences.teamType,
				audienceGroup: preferences.audienceGroup
			});

			if (preferences.skillDesignations && preferences.skillDesignations.length > 0) {
				params.append('skillDesignations', preferences.skillDesignations.join(','));
			}

			const response = await fetch(`/api/homepage?${params.toString()}`);
			homepageData = await response.json();
		} catch (error) {
			console.error('Error fetching homepage data:', error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// Initial data load happens via the reactive statement
	});

	function handleSearch(query: string) {
		// TODO: Implement search functionality
		console.log('Searching for:', query);
	}

	function handleCustomizeFeed() {
		// Open user preferences panel
		document
			.querySelector('.profile-dropdown-icon')
			?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	}
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
		<a href="/articles/learn-hub-basics" class="hero-btn primary-btn">
			<i class="fas fa-bolt"></i> Learn Hub Basics
		</a>
		<a href="/articles" class="hero-btn secondary-btn">
			<i class="fas fa-book"></i> Browse All Articles
		</a>
	</div>
</section>

{#if loading}
	<div class="loading-container">
		<div class="loading-spinner"></div>
		<p>Loading personalized content...</p>
	</div>
{:else if homepageData}
	<div class="personalization-info">
		<p>
			<i class="fas fa-info-circle"></i>
			Content personalized for:
			<span class="personalization-tag">{$userPreferences.region.toUpperCase()}</span>
			<span class="personalization-tag">{$userPreferences.role}</span>
			{#if $userPreferences.teamType !== 'home'}
				<span class="personalization-tag">{$userPreferences.teamType}</span>
			{/if}
			{#if $userPreferences.skillDesignations && $userPreferences.skillDesignations.length > 0}
				{#each $userPreferences.skillDesignations as skill}
					<span class="personalization-tag">{skill}</span>
				{/each}
			{/if}
		</p>
	</div>

	<PersonalizedFeed feedItems={homepageData.personalizedFeed} onCustomize={handleCustomizeFeed} />

	<UserQuickAccess
		recentArticles={homepageData.recentArticles}
		savedArticles={$userPreferences.favorites?.map((id) => ({
			title: `Saved Article ${id}`,
			link: `/articles/${id}`
		})) || []}
	/>

	<HotOffers offers={homepageData.hotOffers} />
	<TechnicalBulletins bulletins={homepageData.technicalBulletins} />
	<BillingUpdates updates={homepageData.billingUpdates} />
	<QuickLinks links={homepageData.quickLinks} />
{/if}

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

	.hero-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.primary-btn {
		background: white;
		color: var(--primary-color);
	}

	.primary-btn:hover {
		background: #f8f9fa;
		transform: translateY(-2px);
	}

	.secondary-btn {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.secondary-btn:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 0;
		color: var(--secondary-color);
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		border-top-color: var(--primary-color);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.personalization-info {
		background-color: #f8f9fa;
		border-radius: 4px;
		padding: 0.75rem 1rem;
		margin: 1rem 0;
		font-size: 0.9rem;
		color: var(--secondary-color);
	}

	.personalization-tag {
		display: inline-block;
		background-color: var(--primary-color-light);
		color: var(--primary-color);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		margin-left: 0.5rem;
		font-size: 0.8rem;
		font-weight: 500;
	}
</style>
