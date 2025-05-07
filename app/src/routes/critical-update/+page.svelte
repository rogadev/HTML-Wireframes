<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to the critical update article
		goto('/articles/critical-update');
	});
</script>

<div class="redirect-container">
	<i class="fas fa-circle-notch fa-spin"></i>
	<p>Redirecting to Critical Update information...</p>
</div>

<style>
	.redirect-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-size: 1.125rem;
		color: #6b7280;
	}

	.redirect-container i {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: #2563eb;
	}
</style>
