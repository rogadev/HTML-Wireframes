<script lang="ts">
	import { onMount } from 'svelte';

	let article = {
		title: 'Learn Hub Basics',
		lastUpdated: '2024-06-01',
		author: 'Tech Central Team',
		content: [
			{
				type: 'section',
				title: 'Welcome to Tech Central',
				content:
					'Tech Central is your one-stop resource for all company information, training materials, and technical documentation. This guide will help you navigate and make the most of our platform.'
			},
			{
				type: 'section',
				title: 'Key Features',
				content: [
					{
						title: 'Personalized Feed',
						description:
							'Your homepage shows content tailored to your role, region, and preferences. Use the customize button to adjust what you see.'
					},
					{
						title: 'Quick Access',
						description:
							'Easily find your recently viewed and bookmarked articles in the Quick Access section.'
					},
					{
						title: 'Technical Resources',
						description:
							'Access technical bulletins, billing updates, and hot offers all in one place.'
					}
				]
			},
			{
				type: 'section',
				title: 'Navigation Tips',
				content: [
					'Use the top navigation menu to access different sections',
					'Bookmark important articles for quick access later',
					'Check the personalized feed for role-specific updates',
					'Use the search function to find specific content'
				]
			},
			{
				type: 'section',
				title: 'Getting Help',
				content:
					"If you need assistance or can't find what you're looking for, contact the Tech Central support team through the Help Center."
			}
		]
	};
</script>

<article class="article-container">
	<header class="article-header">
		<h1>{article.title}</h1>
		<div class="article-meta">
			<span class="last-updated">
				<i class="fas fa-clock"></i> Last updated: {new Date(
					article.lastUpdated
				).toLocaleDateString()}
			</span>
			<span class="author">
				<i class="fas fa-user"></i>
				{article.author}
			</span>
		</div>
	</header>

	<div class="article-content">
		{#each article.content as section}
			<section class="content-section">
				<h2>{section.title}</h2>

				{#if Array.isArray(section.content)}
					{#if section.type === 'section' && typeof section.content[0] === 'object' && 'title' in section.content[0]}
						<div class="feature-grid">
							{#each section.content as item}
								{#if typeof item === 'object' && 'title' in item}
									<div class="feature-item">
										<h3>{item.title}</h3>
										<p>{item.description}</p>
									</div>
								{/if}
							{/each}
						</div>
					{:else}
						<ul class="content-list">
							{#each section.content as item}
								<li>{item}</li>
							{/each}
						</ul>
					{/if}
				{:else}
					<p>{section.content}</p>
				{/if}
			</section>
		{/each}
	</div>
</article>

<style>
	.article-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.article-header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		color: var(--primary-color);
		margin-bottom: 1rem;
	}

	.article-meta {
		display: flex;
		gap: 1.5rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.last-updated,
	.author {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.content-section {
		margin-bottom: 2.5rem;
	}

	h2 {
		font-size: 1.75rem;
		color: var(--text-color);
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.feature-item {
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 1.5rem;
	}

	.feature-item h3 {
		color: var(--primary-color);
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.feature-item p {
		margin: 0;
		color: var(--text-color);
	}

	.content-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0;
	}

	.content-list li {
		padding: 0.5rem 0;
		padding-left: 1.5rem;
		position: relative;
		color: var(--text-color);
	}

	.content-list li::before {
		content: '•';
		color: var(--primary-color);
		position: absolute;
		left: 0;
	}

	p {
		line-height: 1.6;
		color: var(--text-color);
	}
</style>
