<script lang="ts">
	import { onMount } from 'svelte';
	import FilterableContentSection from '$lib/components/FilterableContentSection.svelte';

	// This would normally come from an API endpoint, but for our client-side filtering approach,
	// we're mocking the data directly in the component
	let billingArticles: any[] = [
		{
			id: 'billing-001',
			title: 'Standard Billing Procedures',
			summary: 'Overview of common billing procedures for all technicians',
			category: 'billing',
			regions: ['all'],
			publishedDate: '2023-11-15',
			lastUpdated: '2024-03-10'
		},
		{
			id: 'billing-002',
			title: 'Quebec-Specific Billing Rules',
			summary: 'Special billing considerations for Quebec province',
			category: 'billing',
			regions: ['qc'],
			publishedDate: '2023-12-05',
			lastUpdated: '2024-02-15'
		},
		{
			id: 'billing-003',
			title: 'Alberta/BC Billing Guidelines',
			summary: 'Regional billing rules for Alberta and British Columbia',
			category: 'billing',
			regions: ['ab-bc'],
			publishedDate: '2023-10-21',
			lastUpdated: '2024-01-30'
		},
		{
			id: 'billing-004',
			title: 'Ontario Rate Cards',
			summary: 'Current rate cards for services in Ontario',
			category: 'billing',
			regions: ['on'],
			publishedDate: '2023-09-15',
			lastUpdated: '2024-04-05'
		},
		{
			id: 'billing-005',
			title: 'Atlantic Provinces Billing Guide',
			summary: 'Billing procedures for Atlantic region',
			category: 'billing',
			regions: ['atlantic'],
			publishedDate: '2023-11-30',
			lastUpdated: '2024-03-22'
		},
		{
			id: 'billing-006',
			title: 'Manitoba/Saskatchewan Special Considerations',
			summary: 'Region-specific billing rules for Manitoba and Saskatchewan',
			category: 'billing',
			regions: ['mb-sk'],
			publishedDate: '2023-10-10',
			lastUpdated: '2024-02-28'
		}
	];

	// Additional content sections
	let billingForms: any[] = [
		{
			id: 'form-001',
			title: 'Standard Billing Form',
			summary: 'The standard form used for all billing submissions',
			category: 'form',
			regions: ['all'],
			publishedDate: '2024-01-05',
			lastUpdated: '2024-04-10'
		},
		{
			id: 'form-002',
			title: 'Quebec Tax Form',
			summary: 'Special tax form for Quebec billing',
			category: 'form',
			regions: ['qc'],
			publishedDate: '2024-01-10',
			lastUpdated: '2024-03-15'
		},
		{
			id: 'form-003',
			title: 'Ontario HST Form',
			summary: 'HST submission form for Ontario services',
			category: 'form',
			regions: ['on'],
			publishedDate: '2024-02-01',
			lastUpdated: '2024-04-01'
		}
	];

	let billingUpdates: any[] = [
		{
			id: 'update-001',
			title: 'April 2024 Billing Rate Changes',
			summary: 'Updates to national billing rates effective April 1, 2024',
			category: 'update',
			regions: ['all'],
			publishedDate: '2024-03-15',
			lastUpdated: '2024-03-15'
		},
		{
			id: 'update-002',
			title: 'Quebec Tax Changes',
			summary: 'Important updates to Quebec provincial taxes affecting billing',
			category: 'update',
			regions: ['qc'],
			publishedDate: '2024-02-28',
			lastUpdated: '2024-02-28'
		}
	];
</script>

<div class="page-container">
	<div class="page-header">
		<h1>Billing & PSB</h1>
		<p class="description">
			Access billing guides, forms, and updates for Professional Services Billing. Content is
			filtered based on your region, but you can view content from other regions using the filters.
		</p>
	</div>

	<div class="content-sections">
		<FilterableContentSection
			title="Billing Documentation"
			subtitle="Guidelines and procedures for billing across different regions"
			articles={billingArticles}
		/>

		<FilterableContentSection
			title="Billing Forms"
			subtitle="Standardized forms for billing submissions"
			articles={billingForms}
		/>

		<FilterableContentSection
			title="Recent Updates"
			subtitle="Latest changes to billing rates and policies"
			articles={billingUpdates}
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
