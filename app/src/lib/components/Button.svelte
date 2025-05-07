<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let variant: 'primary' | 'secondary' | 'outline' | 'text' = 'primary';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let icon: string | undefined = undefined;
	export let iconPosition: 'left' | 'right' = 'left';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let fullWidth = false;

	const dispatch = createEventDispatcher<{
		click: MouseEvent;
	}>();

	function handleClick(event: MouseEvent) {
		if (!disabled) {
			dispatch('click', event);
		}
	}
</script>

<button
	{type}
	class="btn"
	class:primary={variant === 'primary'}
	class:secondary={variant === 'secondary'}
	class:outline={variant === 'outline'}
	class:text={variant === 'text'}
	class:small={size === 'small'}
	class:medium={size === 'medium'}
	class:large={size === 'large'}
	class:disabled
	class:full-width={fullWidth}
	on:click={handleClick}
	{disabled}
>
	{#if icon && iconPosition === 'left'}
		<i class={icon}></i>
	{/if}
	<slot />
	{#if icon && iconPosition === 'right'}
		<i class={icon}></i>
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		border: none;
		white-space: nowrap;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Variants */
	.primary {
		background: var(--primary-color);
		color: white;
	}

	.primary:hover:not(:disabled) {
		background: #3a1f54;
	}

	.secondary {
		background: white;
		color: var(--primary-color);
		border: 1px solid var(--primary-color);
	}

	.secondary:hover:not(:disabled) {
		background: rgba(75, 40, 109, 0.1);
	}

	.outline {
		background: transparent;
		color: var(--text-color);
		border: 1px solid var(--border-color);
	}

	.outline:hover:not(:disabled) {
		border-color: var(--primary-color);
		color: var(--primary-color);
	}

	.text {
		background: transparent;
		color: var(--primary-color);
		padding: 0;
	}

	.text:hover:not(:disabled) {
		text-decoration: underline;
	}

	/* Sizes */
	.small {
		padding: 0.375rem 0.75rem;
		font-size: 0.875rem;
	}

	.medium {
		padding: 0.5rem 1rem;
		font-size: 1rem;
	}

	.large {
		padding: 0.75rem 1.5rem;
		font-size: 1.125rem;
	}

	/* Full width */
	.full-width {
		width: 100%;
	}

	/* Icon styles */
	.btn i {
		font-size: 1em;
	}
</style>
