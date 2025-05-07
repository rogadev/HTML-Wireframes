<script lang="ts">
	export let variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
	export let size: 'small' | 'medium' = 'medium';
	export let icon: string | undefined = undefined;
	export let pill = false;
</script>

<span
	class="badge"
	class:primary={variant === 'primary'}
	class:success={variant === 'success'}
	class:warning={variant === 'warning'}
	class:danger={variant === 'danger'}
	class:info={variant === 'info'}
	class:small={size === 'small'}
	class:medium={size === 'medium'}
	class:pill
>
	{#if icon}
		<i class={icon}></i>
	{/if}
	<slot />
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: 500;
		white-space: nowrap;
	}

	/* Variants */
	.primary {
		background: var(--primary-color);
		color: white;
	}

	.success {
		background: #28a745;
		color: white;
	}

	.warning {
		background: #ffc107;
		color: #212529;
	}

	.danger {
		background: #dc3545;
		color: white;
	}

	.info {
		background: #17a2b8;
		color: white;
	}

	/* Sizes */
	.small {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
	}

	.medium {
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
	}

	/* Pill shape */
	.pill {
		border-radius: 9999px;
	}

	/* Icon styles */
	.badge i {
		font-size: 0.875em;
	}
</style>
