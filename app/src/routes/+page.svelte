<script lang="ts">
	import { onMount } from 'svelte';
	import HotOffers from '$lib/components/HotOffers.svelte';
	import TechnicalBulletins from '$lib/components/TechnicalBulletins.svelte';
	import BillingUpdates from '$lib/components/BillingUpdates.svelte';
	import QuickLinks from '$lib/components/QuickLinks.svelte';
	import PersonalizedFeed from '$lib/components/PersonalizedFeed.svelte';
	import UserQuickAccess from '$lib/components/UserQuickAccess.svelte';
	import { userPreferences } from '$lib/stores/userPreferences';
	import type { UserPreferences } from '$lib/types/userPreferences';

	type HomepageData = {
		hotOffers?: {
			image?: string;
			items?: Array<{
				title: string;
				description: string;
				validUntil: string;
				link: string;
			}>;
		};
		technicalBulletins?: {
			image?: string;
			items?: Array<{
				title: string;
				description: string;
				date: string;
				link: string;
			}>;
		};
		billingUpdates?: {
			image?: string;
			items?: Array<{
				title: string;
				description: string;
				date: string;
				link: string;
			}>;
		};
		quickLinks?: {
			billingGuide?: {
				title: string;
				description: string;
				link: string;
			};
			repairGuidelines?: {
				title: string;
				description: string;
				link: string;
			};
		};
		personalizedFeed?: Array<{
			type: string;
			date: string;
			title: string;
			description: string;
			relevance: string;
			link: string;
		}>;
		recentArticles?: {
			image?: string;
			items?: Array<{
				title: string;
				link: string;
				timeViewed: string;
			}>;
		};
		savedArticles?: {
			image?: string;
			items?: Array<{
				title: string;
				link: string;
			}>;
		};
	};

	let homepageData: HomepageData = {};
	let loading = true;
	let error: string | null = null;

	async function fetchHomepageData(preferences: UserPreferences) {
		loading = true;
		error = null;
		try {
			const params = new URLSearchParams({
				region: preferences.region,
				language: preferences.language,
				roles: preferences.roles ? preferences.roles.join(',') : '',
				teamType: preferences.teamType,
				audienceGroup: preferences.audienceGroup
			});
			if (preferences.skillDesignations && preferences.skillDesignations.length > 0) {
				params.append('skillDesignations', preferences.skillDesignations.join(','));
			}
			const response = await fetch(`/api/homepage?${params.toString()}`);

			if (!response.ok) {
				throw new Error(`Failed to load homepage data: ${response.status} ${response.statusText}`);
			}

			homepageData = await response.json();
		} catch (err) {
			console.error('Error fetching homepage data:', err);
			error =
				err instanceof Error
					? err.message
					: 'Failed to load personalized content. Please try again later.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		let unsubscribe = userPreferences.subscribe((prefs) => {
			fetchHomepageData(prefs);
		});
		return unsubscribe;
	});

	function handleSearch(query: string) {
		console.log('Searching for:', query);
	}

	function handleCustomizeFeed() {
		document
			.querySelector('.profile-dropdown-icon')
			?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	}
</script>

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
{:else if error}
	<div class="error-container">
		<i class="fas fa-exclamation-circle"></i>
		<p>{error}</p>
		<button class="retry-button" on:click={() => fetchHomepageData($userPreferences)}>
			<i class="fas fa-sync"></i> Retry
		</button>
	</div>
{:else}
	<PersonalizedFeed
		feedItems={homepageData.personalizedFeed || []}
		onCustomize={handleCustomizeFeed}
		{loading}
		{error}
	/>

	<UserQuickAccess
		recentArticles={homepageData.recentArticles?.items || []}
		savedArticles={($userPreferences.favorites || [])
			.filter((id) => id)
			.map((id) => ({
				title: `Saved Article ${id}`,
				link: `/articles/${id}`
			}))}
	/>

	<HotOffers offers={homepageData.hotOffers?.items || []} />
	<TechnicalBulletins bulletins={homepageData.technicalBulletins?.items || []} />
	<BillingUpdates updates={homepageData.billingUpdates?.items || []} />
	<QuickLinks links={homepageData.quickLinks || {}} />
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
		padding: 3rem 0;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		border-top-color: var(--primary-color);
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 0;
		text-align: center;
		max-width: 1200px;
		margin: 0 auto;
	}

	.error-container i {
		font-size: 2.5rem;
		color: #e53e3e;
		margin-bottom: 1rem;
	}

	.error-container p {
		margin-bottom: 1.5rem;
		color: #4b5563;
	}

	.retry-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		background: var(--primary-color);
		color: white;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.retry-button:hover {
		background: #4f46e5;
		transform: translateY(-2px);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
