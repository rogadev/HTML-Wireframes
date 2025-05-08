<script lang="ts">
	export let bulletins: Array<{
		title: string;
		description: string;
		date: string;
		link: string;
	}> = [];

	function getArticleSlug(link: string) {
		if (!link) return '';
		return link.replace(/^\//, '').split('/').pop();
	}

	function formatLink(linkPath: string): string {
		if (!linkPath) return '/learning-hub';

		// Ensure link starts with /articles/
		if (!linkPath.startsWith('/articles/')) {
			const slug = getArticleSlug(linkPath);
			return slug ? `/articles/${slug}` : '/learning-hub';
		}

		// Ensure there's actually an ID in the path
		const articleId = linkPath.split('/').pop();
		return articleId ? linkPath : '/learning-hub';
	}
</script>

<section class="technical-bulletins">
	<div class="section-header">
		<h2>Technical Bulletins & Policy Changes</h2>
		<a href="/learning-hub" class="view-all-btn">
			View All <i class="fas fa-arrow-right"></i>
		</a>
	</div>

	<div class="bulletins-grid">
		{#if bulletins && bulletins.length > 0}
			{#each bulletins as bulletin}
				<a href={formatLink(bulletin.link)} class="bulletin-card">
					<div class="bulletin-content">
						<h3>{bulletin.title}</h3>
						<p>{bulletin.description}</p>
						<div class="bulletin-meta">
							<span class="date">
								<i class="fas fa-calendar-alt"></i>
								{new Date(bulletin.date).toLocaleDateString()}
							</span>
						</div>
					</div>
				</a>
			{/each}
		{:else}
			<div class="empty-state">
				<p>No technical bulletins available at this time.</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.technical-bulletins {
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
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	.view-all-btn:hover {
		text-decoration: underline;
	}

	.bulletins-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.bulletin-card {
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

	.bulletin-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.bulletin-content h3 {
		margin: 0 0 0.5rem 0;
		color: var(--primary-color);
	}

	.bulletin-content p {
		margin: 0 0 1rem 0;
		color: var(--text-color);
	}

	.bulletin-meta {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.date {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 2rem;
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-muted);
	}
</style>
