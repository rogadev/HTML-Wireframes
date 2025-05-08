<script lang="ts">
	export let links: {
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

	function getArticleSlug(link: string) {
		return link.replace(/^\//, '').split('/').pop();
	}
</script>

<section class="quick-links">
	<div class="section-header">
		<h2>Quick Access</h2>
	</div>

	<div class="links-grid">
		<a href={`/article/${getArticleSlug(links.billingGuide.link)}`} class="link-card">
			<div class="link-content">
				<h3>{links.billingGuide.title}</h3>
				<p>{links.billingGuide.description}</p>
			</div>
		</a>

		<a href={`/article/${getArticleSlug(links.repairGuidelines.link)}`} class="link-card">
			<div class="link-content">
				<h3>{links.repairGuidelines.title}</h3>
				<p>{links.repairGuidelines.description}</p>
			</div>
		</a>
	</div>
</section>

<style>
	.quick-links {
		max-width: 1200px;
		margin: 3rem auto;
		padding: 0 1rem;
	}

	.section-header {
		margin-bottom: 1.5rem;
	}

	.links-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.link-card {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.link-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.link-content h3 {
		margin: 0 0 0.5rem 0;
		color: var(--primary-color);
	}

	.link-content p {
		margin: 0;
		color: var(--text-color);
	}
</style>
