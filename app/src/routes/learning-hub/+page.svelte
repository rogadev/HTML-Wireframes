<script lang="ts">
	let jobAids = [
		{
			title: 'Fiber Installation Guide',
			description: 'Step-by-step guide for fiber optic installation procedures',
			category: 'Installation',
			link: '/learning-hub/fiber-installation-guide'
		},
		{
			title: 'Network Troubleshooting',
			description: 'Common network issues and their solutions',
			category: 'Troubleshooting',
			link: '/articles/network-troubleshooting'
		},
		{
			title: 'Safety Protocols',
			description: 'Essential safety guidelines for field technicians',
			category: 'Safety',
			link: '/articles/safety-protocols'
		}
	];
</script>

<div class="container">
	<header class="page-header">
		<h1>Learning Hub</h1>
		<p class="subtitle">Technical resources and job aids for technicians</p>
	</header>

	<section class="job-aids">
		<h2>Job Aids & Resources</h2>
		<div class="grid">
			{#each jobAids as aid}
				<a href={aid.link} class="card">
					<div class="card-content">
						<span class="category">{aid.category}</span>
						<h3>{aid.title}</h3>
						<p>{aid.description}</p>
					</div>
				</a>
			{/each}
		</div>
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
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.card-content {
		padding: 1.5rem;
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
	}
</style>
