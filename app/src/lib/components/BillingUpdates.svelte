<script lang="ts">
	export let updates: Array<{
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
		if (!linkPath) return '/billing';

		// Ensure link starts with /articles/
		if (!linkPath.startsWith('/articles/')) {
			return `/articles/${getArticleSlug(linkPath)}`;
		}
		return linkPath;
	}
</script>

<section class="billing-updates">
	<div class="section-header">
		<h2>Billing Rules Updates</h2>
		<a href="/billing" class="view-all-btn">
			View All <i class="fas fa-arrow-right"></i>
		</a>
	</div>

	<div class="updates-grid">
		{#if updates && updates.length > 0}
			{#each updates as update}
				<a href={formatLink(update.link)} class="update-card">
					<div class="update-content">
						<h3>{update.title}</h3>
						<p>{update.description}</p>
						<div class="update-meta">
							<span class="date">
								<i class="fas fa-calendar-alt"></i>
								{new Date(update.date).toLocaleDateString()}
							</span>
						</div>
					</div>
				</a>
			{/each}
		{:else}
			<div class="empty-state">
				<p>No billing updates available at this time.</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.billing-updates {
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

	.updates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.update-card {
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

	.update-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.update-content h3 {
		margin: 0 0 0.5rem 0;
		color: var(--primary-color);
	}

	.update-content p {
		margin: 0 0 1rem 0;
		color: var(--text-color);
	}

	.update-meta {
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
