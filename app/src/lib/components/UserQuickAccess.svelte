<script lang="ts">
	interface Article {
		title: string;
		link: string;
		timeViewed?: string;
	}

	export let recentArticles: Article[] = [];
	export let savedArticles: Article[] = [];
</script>

<section class="quick-access">
	<div class="user-links">
		<div class="recent-articles">
			<h3><i class="fas fa-history"></i> Recently Viewed</h3>
			<ul>
				{#each recentArticles as article}
					<li>
						<a href={article.link}>{article.title}</a>
						{#if article.timeViewed}
							<span class="time-viewed">{article.timeViewed}</span>
						{/if}
					</li>
				{/each}
			</ul>
			<a href="/articles/recent" class="view-all">
				View All <i class="fas fa-chevron-right"></i>
			</a>
		</div>

		<div class="saved-articles">
			<h3><i class="fas fa-bookmark"></i> Bookmarked</h3>
			<ul>
				{#each savedArticles as article}
					<li>
						<a href={article.link}>{article.title}</a>
					</li>
				{/each}
			</ul>
			<a href="/articles/saved" class="view-all">
				View All <i class="fas fa-chevron-right"></i>
			</a>
		</div>
	</div>
</section>

<style>
	.quick-access {
		max-width: 1200px;
		margin: 3rem auto;
		padding: 0 1rem;
	}

	.user-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.recent-articles,
	.saved-articles {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 1.5rem;
	}

	h3 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 1rem 0;
		color: var(--primary-color);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem 0;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color);
	}

	li:last-child {
		border-bottom: none;
	}

	a {
		color: var(--text-color);
		text-decoration: none;
		flex: 1;
	}

	a:hover {
		color: var(--primary-color);
	}

	.time-viewed {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.view-all {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
	}

	.view-all:hover {
		text-decoration: underline;
	}
</style>
