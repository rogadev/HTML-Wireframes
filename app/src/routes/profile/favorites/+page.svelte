<script lang="ts">
	import { goto } from '$app/navigation';
	import FavoritesSection from '$lib/components/FavoritesSection.svelte';
</script>

<div class="favorites-page">
	<header class="page-header">
		<div class="breadcrumb">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/profile">Profile</a></li>
				<li>Saved Articles</li>
			</ul>
		</div>

		<div class="header-content">
			<h1>Your Saved Articles</h1>
			<p class="subtitle">Access your favorite articles and resources in one place</p>

			<button class="back-button" on:click={() => goto('/profile')}>
				<i class="fas fa-arrow-left"></i>
				Back to Profile
			</button>
		</div>
	</header>

	<main class="favorites-container">
		<FavoritesSection showTitle={false} maxItems={100} showViewAllLink={false} />
	</main>
</div>

<style>
	.favorites-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.breadcrumb {
		margin-bottom: 1.5rem;
	}

	.breadcrumb ul {
		display: flex;
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 0.875rem;
	}

	.breadcrumb li:not(:last-child)::after {
		content: '/';
		margin: 0 0.5rem;
		color: #9ca3af;
	}

	.breadcrumb a {
		color: #4b5563;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: #2563eb;
		text-decoration: underline;
	}

	.breadcrumb li:last-child {
		color: #1f2937;
		font-weight: 500;
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	h1 {
		font-size: 1.875rem;
		font-weight: 700;
		color: #111827;
		margin: 0;
	}

	.subtitle {
		color: #4b5563;
		font-size: 1.125rem;
		margin: 0 0 1.5rem;
	}

	.back-button {
		align-self: flex-start;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #f3f4f6;
		border: none;
		border-radius: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		color: #4b5563;
		cursor: pointer;
		transition: all 0.2s;
	}

	.back-button:hover {
		background-color: #e5e7eb;
	}

	.favorites-container {
		background-color: white;
		border-radius: 0.5rem;
		box-shadow:
			0 1px 3px 0 rgba(0, 0, 0, 0.1),
			0 1px 2px 0 rgba(0, 0, 0, 0.06);
		padding: 1.5rem;
	}

	@media (max-width: 640px) {
		.favorites-page {
			padding: 1rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		.subtitle {
			font-size: 1rem;
		}
	}
</style>
