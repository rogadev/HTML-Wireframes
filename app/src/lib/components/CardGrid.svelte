<script lang="ts">
	export let columns: number = 3;
	export let gap: string = '1.5rem';
</script>

<div class="card-grid" style="--columns: {columns}; --gap: {gap}">
	<slot />
</div>

<style>
	.card-grid {
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: var(--gap);
		width: 100%;
	}

	@media (max-width: 1200px) {
		.card-grid {
			grid-template-columns: repeat(min(var(--columns) - 1, 2), 1fr);
		}
	}

	@media (max-width: 768px) {
		.card-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
