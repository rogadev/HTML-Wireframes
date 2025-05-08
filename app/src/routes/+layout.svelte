<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import SystemAlert from '$lib/components/SystemAlert.svelte';

	const pollingInterval = $state(30000);
	let { children } = $props();
</script>

<TopBar />

<Navigation />

<SystemAlert {pollingInterval} />

<main>
	{@render children()}
</main>

<style>
	main {
		min-height: calc(100vh - 120px); /* Adjust based on header height */
	}
</style>
