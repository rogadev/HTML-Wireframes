<script lang="ts">
	import { page } from '$app/state';

	const animalImage = '/images/404-animal.jpg';
</script>

<div class="error-container">
	<div class="error-content">
		<img src={animalImage} alt="Cute animal illustration" class="error-image" />
		<h1 class="error-title">Error {page.status}</h1>
		<p class="error-message">{page.error?.message || 'Page not found'}</p>
		<a href="/" class="home-button">Return to Home</a>
	</div>
</div>

<style>
	.error-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background-color: #f5f5f5;
	}

	.error-content {
		text-align: center;
		max-width: 600px;
		padding: 2rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.error-image {
		max-width: 300px;
		height: auto;
		margin-bottom: 2rem;
		border-radius: 8px;
	}

	.error-title {
		font-size: 4rem;
		color: #4b286d; /* Telus purple */
		margin: 0 0 1rem;
		font-weight: 700;
	}

	.error-message {
		font-size: 1.25rem;
		color: #333;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.home-button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: #4b286d; /* Telus purple */
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 600;
		transition: background-color 0.2s ease;
	}

	.home-button:hover {
		background-color: #3a1f54; /* Darker Telus purple */
	}

	@media (max-width: 640px) {
		.error-content {
			padding: 1.5rem;
		}

		.error-title {
			font-size: 3rem;
		}

		.error-message {
			font-size: 1.1rem;
		}
	}
</style>
