<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import TopBar from '$lib/components/TopBar.svelte';
	import { userPreferences } from '$lib/stores/userPreferences';

	function handleLanguageChange(event: { language: string }) {
		// Already handled by the TopBar component
	}

	function handleRegionChange(event: { region: string }) {
		// Already handled by the TopBar component
	}

	function handleRoleChange(event: { role: string }) {
		// Already handled by the TopBar component
	}

	function handleTeamTypeChange(event: { teamType: string }) {
		// Already handled by the TopBar component
	}
</script>

<TopBar
	onLanguageChange={handleLanguageChange}
	onRegionChange={handleRegionChange}
	onRoleChange={handleRoleChange}
	onTeamTypeChange={handleTeamTypeChange}
/>

<Navigation />

<main>
	<slot />
</main>

<style>
	main {
		min-height: calc(100vh - 120px); /* Adjust based on header height */
	}
</style>
