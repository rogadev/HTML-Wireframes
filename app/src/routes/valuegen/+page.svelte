<script lang="ts">
	import FilterableContentSection from '$lib/components/FilterableContentSection.svelte';
	import { userPreferences } from '$lib/stores/userPreferences';

	// Sample offers data with region-specific content
	let currentOffers = [
		{
			id: 'offer-001',
			title: 'Unlimited Internet Bundle - Spring Promotion',
			summary: 'Special pricing on unlimited internet packages for all regions',
			category: 'offer',
			regions: ['all'],
			publishedDate: '2024-03-01',
			lastUpdated: '2024-04-15',
			endDate: '2024-05-31'
		},
		{
			id: 'offer-002',
			title: 'Quebec Fiber Expansion Offer',
			summary: 'Special 3-month pricing for new fiber customers in Quebec regions',
			category: 'offer',
			regions: ['qc'],
			publishedDate: '2024-02-15',
			lastUpdated: '2024-04-01',
			endDate: '2024-06-30'
		},
		{
			id: 'offer-003',
			title: 'Ontario Smart Home Promotion',
			summary: 'Bundle smart home security with internet services at a discounted rate',
			category: 'offer',
			regions: ['on'],
			publishedDate: '2024-03-05',
			lastUpdated: '2024-03-20',
			endDate: '2024-06-15'
		},
		{
			id: 'offer-004',
			title: 'Alberta/BC Mountain Communities Special',
			summary: 'Reduced installation fees for mountain and remote communities',
			category: 'offer',
			regions: ['ab-bc'],
			publishedDate: '2024-02-01',
			lastUpdated: '2024-03-10',
			endDate: '2024-07-31'
		},
		{
			id: 'offer-005',
			title: 'Atlantic Triple Play Bundle',
			summary: 'Special pricing on internet, TV, and phone bundles for Atlantic provinces',
			category: 'offer',
			regions: ['atlantic'],
			publishedDate: '2024-01-15',
			lastUpdated: '2024-03-30',
			endDate: '2024-05-15'
		}
	];

	// Region-specific qualification guides
	let qualificationGuides = [
		{
			id: 'qual-001',
			title: 'Standard Qualification Guidelines',
			summary: 'Basic qualification criteria applicable to all regions',
			category: 'qualification',
			regions: ['all'],
			publishedDate: '2024-01-10',
			lastUpdated: '2024-03-15'
		},
		{
			id: 'qual-002',
			title: 'Quebec Regulatory Compliance Guide',
			summary: 'Special qualification considerations for Quebec province',
			category: 'qualification',
			regions: ['qc'],
			publishedDate: '2024-02-10',
			lastUpdated: '2024-04-01'
		},
		{
			id: 'qual-003',
			title: 'Rural Ontario Qualification Exceptions',
			summary: 'Modified qualification guidelines for rural Ontario communities',
			category: 'qualification',
			regions: ['on'],
			publishedDate: '2024-01-20',
			lastUpdated: '2024-03-05'
		},
		{
			id: 'qual-004',
			title: 'Manitoba/Saskatchewan Low-Population Areas',
			summary: 'Special qualification considerations for low-population areas',
			category: 'qualification',
			regions: ['mb-sk'],
			publishedDate: '2024-02-05',
			lastUpdated: '2024-04-10'
		}
	];

	// Upcoming promotions data with region-specific content
	let upcomingPromotions = [
		{
			id: 'upcoming-001',
			title: 'Summer Internet Promotion',
			summary: 'Preview of upcoming nationwide summer promotion',
			category: 'upcoming',
			regions: ['all'],
			publishedDate: '2024-04-01',
			lastUpdated: '2024-04-15',
			launchDate: '2024-06-01'
		},
		{
			id: 'upcoming-002',
			title: 'Ontario Student Back-to-School Offer',
			summary: 'Preview of student-focused offer for Ontario college and university areas',
			category: 'upcoming',
			regions: ['on'],
			publishedDate: '2024-04-10',
			lastUpdated: '2024-04-10',
			launchDate: '2024-07-15'
		},
		{
			id: 'upcoming-003',
			title: 'Quebec Saint-Jean-Baptiste Special',
			summary: "Special promotion launching for Quebec's Saint-Jean-Baptiste holiday",
			category: 'upcoming',
			regions: ['qc'],
			publishedDate: '2024-03-25',
			lastUpdated: '2024-04-05',
			launchDate: '2024-06-15'
		}
	];
</script>

<div class="page-container">
	<div class="page-header">
		<h1>ValueGen</h1>
		<p class="description">
			Access current promotions, qualification guides, and upcoming offers. Content is filtered
			based on your region ({$userPreferences.region === 'all'
				? 'All Regions'
				: $userPreferences.region.toUpperCase()}), but you can view offers from other regions using
			the region selectors below.
		</p>
	</div>

	<div class="content-sections">
		<FilterableContentSection
			title="Current Offers"
			subtitle="Active promotions and special offers available to customers"
			articles={currentOffers}
		/>

		<FilterableContentSection
			title="Qualification Guidelines"
			subtitle="Requirements and evaluation criteria for offer eligibility"
			articles={qualificationGuides}
		/>

		<FilterableContentSection
			title="Upcoming Promotions"
			subtitle="Preview of promotions launching soon"
			articles={upcomingPromotions}
		/>
	</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	h1 {
		color: var(--telus-purple, #4b286d);
		margin-bottom: 1rem;
	}

	.description {
		max-width: 800px;
		color: var(--text-color, #333);
		line-height: 1.6;
	}

	.content-sections {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}
</style>
