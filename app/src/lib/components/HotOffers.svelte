<script lang="ts">
	export let offers: Array<{
		title: string;
		description: string;
		validUntil: string;
		link: string;
	}>;
</script>

<section class="hot-offers">
	<div class="section-header">
		<h2>Today's Hot Offers</h2>
		<a href="/valuegen" class="view-all-btn">
			View All <i class="fas fa-arrow-right"></i>
		</a>
	</div>

	<div class="offers-grid">
		{#each offers as offer}
			<a href={offer.link} class="offer-card">
				<div class="offer-content">
					<h3>{offer.title}</h3>
					<p>{offer.description}</p>
					<div class="offer-meta">
						<span class="valid-until">
							<i class="fas fa-clock"></i> Valid until {new Date(
								offer.validUntil
							).toLocaleDateString()}
						</span>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	.hot-offers {
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

	.offers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.offer-card {
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

	.offer-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.offer-content h3 {
		margin: 0 0 0.5rem 0;
		color: var(--primary-color);
	}

	.offer-content p {
		margin: 0 0 1rem 0;
		color: var(--text-color);
	}

	.offer-meta {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.valid-until {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
