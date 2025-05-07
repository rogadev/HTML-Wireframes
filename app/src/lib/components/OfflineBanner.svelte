<script lang="ts">
	import { onMount } from 'svelte';

	let offlineEnabled = false;
	let storageUsed = 0;
	let storageAvailable = 0;

	onMount(() => {
		// Initialize offline storage status
		if ('storage' in navigator && 'estimate' in navigator.storage) {
			navigator.storage.estimate().then(({ usage = 0, quota = 0 }) => {
				storageUsed = Math.round(usage / (1024 * 1024));
				storageAvailable = Math.round(quota / (1024 * 1024));
			});
		}
	});

	function toggleOfflineMode() {
		offlineEnabled = !offlineEnabled;
	}
</script>

<div class="offline-banner">
	<div class="offline-content">
		<div class="offline-icon">
			<i class="fas fa-wifi"></i>
		</div>
		<div class="offline-message">
			<strong>Offline Access Available</strong>
			<p>Save content for offline use in areas with limited connectivity.</p>
		</div>
		<button class="offline-toggle-btn" on:click={toggleOfflineMode}>
			<i class="fas fa-chevron-down"></i>
		</button>
	</div>
	{#if offlineEnabled}
		<div class="offline-options">
			<div class="offline-option">
				<input
					type="checkbox"
					id="enable-offline"
					class="offline-checkbox"
					bind:checked={offlineEnabled}
				/>
				<label for="enable-offline">Enable offline access</label>
				<div class="offline-status">
					<span class="offline-indicator" class:active={offlineEnabled}></span>
					<span class="offline-status-text">{offlineEnabled ? 'Enabled' : 'Not enabled'}</span>
				</div>
			</div>
			<div class="offline-actions">
				<button class="offline-action-btn" disabled={!offlineEnabled}>
					<i class="fas fa-download"></i> Save content for offline use
				</button>
				<div class="offline-storage-info">
					<div class="storage-bar">
						<div
							class="storage-used"
							style="width: {(storageUsed / storageAvailable) * 100}%"
						></div>
					</div>
					<span class="storage-text">{storageUsed} MB used ({storageAvailable} MB available)</span>
				</div>
			</div>
			<div class="offline-help">
				<a href="/article-template">
					<i class="fas fa-question-circle"></i> How to use offline mode
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.offline-banner {
		background: #f8f9fa;
		border-bottom: 1px solid var(--border-color);
		padding: 1rem;
	}

	.offline-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.offline-options {
		max-width: 1200px;
		margin: 1rem auto 0;
		padding: 1rem;
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 4px;
	}

	.offline-option {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.offline-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.offline-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #dc3545;
	}

	.offline-indicator.active {
		background: #28a745;
	}

	.storage-bar {
		height: 4px;
		background: #e9ecef;
		border-radius: 2px;
		margin: 0.5rem 0;
	}

	.storage-used {
		height: 100%;
		background: var(--primary-color);
		border-radius: 2px;
		transition: width 0.3s ease;
	}

	.offline-help {
		margin-top: 1rem;
		font-size: 0.875rem;
	}

	.offline-help a {
		color: var(--primary-color);
		text-decoration: none;
	}

	.offline-help a:hover {
		text-decoration: underline;
	}
</style>
