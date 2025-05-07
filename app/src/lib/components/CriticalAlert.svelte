<script lang="ts">
	export let message: string;
	export let linkText: string = 'Read More';
	export let linkHref: string = '/critical-update';

	let isVisible = true;

	function closeAlert() {
		isVisible = false;
	}
</script>

{#if isVisible}
	<div class="critical-alert-banner">
		<div class="critical-alert-content">
			<div class="alert-icon">
				<i class="fas fa-exclamation-circle"></i>
			</div>
			<div class="alert-message">
				<strong>CRITICAL UPDATE:</strong>
				{message}
				<a href={linkHref} class="alert-link">{linkText}</a>
			</div>
		</div>
		<button class="alert-close-btn" on:click={closeAlert} aria-label="Close alert">
			<i class="fas fa-times"></i>
		</button>
	</div>
{/if}

<style>
	.critical-alert-banner {
		background: #dc3545;
		color: white;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.critical-alert-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		flex: 1;
	}

	.alert-icon {
		font-size: 1.25rem;
	}

	.alert-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.alert-link {
		color: white;
		text-decoration: underline;
		margin-left: 0.5rem;
	}

	.alert-link:hover {
		text-decoration: none;
	}

	.alert-close-btn {
		background: none;
		border: none;
		color: white;
		padding: 0.5rem;
		cursor: pointer;
		opacity: 0.8;
		transition: opacity 0.2s ease;
	}

	.alert-close-btn:hover {
		opacity: 1;
	}
</style>
