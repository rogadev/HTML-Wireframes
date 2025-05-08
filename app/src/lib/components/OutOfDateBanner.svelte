<script lang="ts">
	export let visible = false;
	// svelte-ignore export_let_unused
	export let articleId: string;
	export let onToggle: (newStatus: boolean) => void;

	// Mock authentication state (in real app, this would come from an auth store)
	// For demo purposes, everyone can toggle the status
	const isAuthenticated = true;
	const isContentOwner = true;
</script>

{#if visible}
	<div class="out-of-date-banner">
		<div class="banner-content">
			<i class="fas fa-exclamation-triangle"></i>
			<span>This content may be out of date. Our team is reviewing it for accuracy.</span>
		</div>

		{#if isAuthenticated && isContentOwner}
			<button
				class="resolve-button"
				on:click={() => onToggle(false)}
				aria-label="Mark as up-to-date"
			>
				<i class="fas fa-check"></i>
				<span>Resolve</span>
			</button>
		{/if}
	</div>
{:else if isAuthenticated && isContentOwner}
	<div class="action-bar">
		<button class="flag-button" on:click={() => onToggle(true)} aria-label="Flag as out-of-date">
			<i class="fas fa-flag"></i>
			<span>Flag as Out-of-Date</span>
		</button>
	</div>
{/if}

<style>
	.out-of-date-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fef3c7;
		border-left: 4px solid #f59e0b;
		padding: 0.75rem 1rem;
		margin-bottom: 1.5rem;
		border-radius: 0 4px 4px 0;
	}

	.banner-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #92400e;
		font-size: 0.95rem;
	}

	.banner-content i {
		font-size: 1.1rem;
	}

	.resolve-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #fbbf24;
		color: #92400e;
		border: none;
		padding: 0.4rem 0.75rem;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		font-size: 0.85rem;
		transition: background-color 0.2s ease;
	}

	.resolve-button:hover {
		background-color: #f59e0b;
	}

	.action-bar {
		margin-bottom: 1.5rem;
		display: flex;
		justify-content: flex-end;
	}

	.flag-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #f3f4f6;
		color: #4b5563;
		border: 1px solid #d1d5db;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.flag-button:hover {
		background-color: #fef3c7;
		border-color: #f59e0b;
		color: #92400e;
	}

	@media (max-width: 640px) {
		.out-of-date-banner {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.resolve-button {
			align-self: flex-end;
		}
	}
</style>
