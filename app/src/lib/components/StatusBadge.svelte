<script lang="ts">
	import Badge from './Badge.svelte';

	const { publishDate, lastUpdated } = $props<{
		publishDate: string;
		lastUpdated: string;
	}>();

	// Constants for badge display timeframes (in milliseconds)
	const NEW_BADGE_DAYS = 30;
	const UPDATED_BADGE_DAYS = 14;
	const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000

	// Calculate if we should show badges
	const showNewBadge = $derived(isNew(publishDate));
	const showUpdatedBadge = $derived(isUpdated(publishDate, lastUpdated));

	// Check if an article is considered "new" (published within the last 30 days)
	function isNew(pubDate: string): boolean {
		const now = new Date();
		const published = new Date(pubDate);
		const diffTime = now.getTime() - published.getTime();
		const diffDays = diffTime / DAY_IN_MS;

		return diffDays <= NEW_BADGE_DAYS;
	}

	// Check if an article is considered "updated" (updated within the last 14 days
	// but not "new")
	function isUpdated(pubDate: string, updateDate: string): boolean {
		const now = new Date();
		const published = new Date(pubDate);
		const updated = new Date(updateDate);

		// Calculate if update is recent (within 14 days)
		const diffTimeUpdate = now.getTime() - updated.getTime();
		const diffDaysUpdate = diffTimeUpdate / DAY_IN_MS;
		const isRecentUpdate = diffDaysUpdate <= UPDATED_BADGE_DAYS;

		// Calculate if publish date and update date are different
		const hasBeenUpdated = updated.getTime() > published.getTime();

		// Show UPDATED badge only if:
		// 1. Article has been updated since publication
		// 2. Update was recent
		// 3. Article is not "new" (to prevent showing both badges)
		return hasBeenUpdated && isRecentUpdate && !isNew(pubDate);
	}
</script>

{#if showNewBadge}
	<Badge variant="success" size="small" pill={true} icon="fas fa-star">NEW</Badge>
{:else if showUpdatedBadge}
	<Badge variant="info" size="small" pill={true} icon="fas fa-sync-alt">UPDATED</Badge>
{/if}
