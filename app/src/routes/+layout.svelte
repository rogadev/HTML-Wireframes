<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import TopBar from '$lib/components/TopBar.svelte';

	function handleLanguageChange(event: { language: string }) {
		// TODO: Implement language change logic
		console.log('Language changed to:', event.language);
	}

	function handleRegionChange(event: { region: string }) {
		// TODO: Implement region change logic
		console.log('Region changed to:', event.region);
	}
</script>

<TopBar onLanguageChange={handleLanguageChange} onRegionChange={handleRegionChange} />

<Navigation />

<main>
	<slot />
</main>

<style>
	main {
		min-height: calc(100vh - 120px); /* Adjust based on header height */
	}
</style>
