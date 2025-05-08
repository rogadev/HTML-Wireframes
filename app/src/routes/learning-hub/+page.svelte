<script lang="ts">
	import { onMount } from 'svelte';

	// Define the type for job aids
	interface JobAid {
		id: string;
		title: string;
		description: string;
		category: string;
		link: string;
		imageUrl: string;
		tags: string[];
		publishDate: string;
		lastUpdated: string;
	}

	let jobAids: JobAid[] = [];
	let loading = true;
	let error = false;

	// Fetch job aids from the API
	onMount(async () => {
		try {
			const response = await fetch('/api/job-aids');

			if (!response.ok) {
				throw new Error(`Error fetching job aids: ${response.status}`);
			}

			const data = await response.json();
			jobAids = data.jobAids.map((aid: any) => ({
				id: aid.id,
				title: aid.title,
				description: aid.subtitle || aid.description || aid.summary || '',
				category: aid.category || aid.type || 'General',
				link: `/articles/${aid.id}`,
				imageUrl: aid.imageUrl || '/images/default-article.jpg',
				tags: aid.tags || [],
				publishDate: aid.publishDate || aid.publishedDate || '',
				lastUpdated: aid.lastUpdated || ''
			}));
		} catch (err) {
			console.error('Failed to fetch job aids:', err);
			error = true;
		} finally {
			loading = false;
		}
	});
</script>

<div class="container">
	<header class="page-header">
		<h1>Learning Hub</h1>
		<p class="subtitle">Technical resources and job aids for technicians</p>
	</header>

	<section class="job-aids">
		<h2>Job Aids & Resources</h2>

		{#if loading}
			<div class="loading-container">
				<div class="loading-spinner"></div>
				<p>Loading job aids...</p>
			</div>
		{:else if error}
			<div class="error-message">
				<p>Failed to load job aids. Please try again later.</p>
				<button onclick={() => window.location.reload()}>Retry</button>
			</div>
		{:else if jobAids.length === 0}
			<p>No job aids available at this time.</p>
		{:else}
			<div class="grid">
				{#each jobAids as aid}
					<a href={aid.link} class="card">
						<div class="card-image" style="background-image: url({aid.imageUrl})"></div>
						<div class="card-content">
							<span class="category">{aid.category}</span>
							<h3>{aid.title}</h3>
							<p>{aid.description}</p>
							{#if aid.tags.length > 0}
								<div class="tags">
									{#each aid.tags.slice(0, 3) as tag}
										<span class="tag">{tag}</span>
									{/each}
								</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		color: var(--primary-color);
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: var(--text-muted);
		font-size: 1.1rem;
	}

	.job-aids {
		margin-top: 2rem;
	}

	h2 {
		font-size: 1.75rem;
		color: var(--text-color);
		margin-bottom: 1.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.2s ease;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.card-image {
		height: 160px;
		background-size: cover;
		background-position: center;
	}

	.card-content {
		padding: 1.5rem;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.category {
		display: inline-block;
		background: rgba(75, 40, 109, 0.1);
		color: var(--primary-color);
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-size: 0.875rem;
		margin-bottom: 0.75rem;
	}

	h3 {
		color: var(--text-color);
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	p {
		color: var(--text-muted);
		margin: 0;
		line-height: 1.5;
		flex-grow: 1;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.tag {
		font-size: 0.75rem;
		background: #f5f5f5;
		color: #555;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid rgba(75, 40, 109, 0.1);
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

	.error-message {
		text-align: center;
		padding: 2rem;
		color: #d32f2f;
	}

	button {
		background: var(--primary-color);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 1rem;
	}

	button:hover {
		background: var(--primary-dark);
	}
</style>
