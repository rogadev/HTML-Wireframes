<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Badge from './Badge.svelte';

	export let pollingInterval = 60000; // Default to checking every minute

	interface SystemAlertUpdate {
		timestamp: string;
		message: string;
	}

	interface SystemAlert {
		id: string;
		type: 'outage' | 'maintenance' | 'degraded' | 'resolved';
		severity: 'low' | 'moderate' | 'warning' | 'critical';
		title: string;
		message: string;
		startTime: string;
		estimatedResolution: string;
		actualResolution?: string;
		affectedSystems: string[];
		updates: SystemAlertUpdate[];
		active: boolean;
	}

	let alerts: SystemAlert[] = [];
	let isLoading = true;
	let error: string | null = null;
	let expandedAlertId: string | null = null;
	let lastPolled: Date | null = null;
	let pollingIntervalId: ReturnType<typeof setInterval> | null = null;

	// Get and format current time for the "last checked" info
	$: formattedLastPolled = lastPolled
		? new Date(lastPolled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		: '';

	/**
	 * Fetch active system alerts
	 */
	async function fetchAlerts() {
		isLoading = true;
		error = null;

		try {
			const response = await fetch('/api/system-alerts?min_severity=warning');

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			alerts = data.alerts;
			lastPolled = new Date();
		} catch (err) {
			console.error('Error fetching system alerts:', err);
			error = 'Failed to load system alerts';
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Initialize polling for alerts
	 */
	function initializePolling() {
		// Clear any existing interval first
		if (pollingIntervalId) {
			clearInterval(pollingIntervalId);
		}

		// Set up the polling interval
		pollingIntervalId = setInterval(fetchAlerts, pollingInterval);
	}

	/**
	 * Toggle expanded view for an alert
	 */
	function toggleAlertDetails(alertId: string) {
		expandedAlertId = expandedAlertId === alertId ? null : alertId;
	}

	/**
	 * Navigate to the alert details page
	 */
	function viewFullDetails(alertId: string) {
		goto(`/system-alerts/${alertId}`);
	}

	/**
	 * Format ISO date string to readable format
	 */
	function formatDate(isoString: string): string {
		return new Date(isoString).toLocaleString([], {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	/**
	 * Calculate time remaining until estimated resolution
	 */
	function getTimeRemaining(estimatedResolution: string): string {
		const now = new Date();
		const resolution = new Date(estimatedResolution);
		const diffMs = resolution.getTime() - now.getTime();

		if (diffMs <= 0) {
			return 'Overdue';
		}

		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

		if (diffHours > 24) {
			const days = Math.floor(diffHours / 24);
			return `${days} day${days > 1 ? 's' : ''} remaining`;
		}

		if (diffHours > 0) {
			return `${diffHours}h ${diffMinutes}m remaining`;
		}

		return `${diffMinutes} min remaining`;
	}

	/**
	 * Get the appropriate badge variant based on alert type and severity
	 */
	function getBadgeVariant(
		alert: SystemAlert
	): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
		if (alert.type === 'resolved') return 'success';

		switch (alert.severity) {
			case 'critical':
				return 'danger';
			case 'warning':
				return 'warning';
			case 'moderate':
				return 'info';
			default:
				return 'primary';
		}
	}

	/**
	 * Get icon for alert type
	 */
	function getAlertIcon(alert: SystemAlert): string {
		switch (alert.type) {
			case 'outage':
				return 'fas fa-exclamation-triangle';
			case 'maintenance':
				return 'fas fa-wrench';
			case 'degraded':
				return 'fas fa-exclamation-circle';
			case 'resolved':
				return 'fas fa-check-circle';
			default:
				return 'fas fa-info-circle';
		}
	}

	// Initialize on component mount
	onMount(() => {
		fetchAlerts();
		initializePolling();
	});

	// Clean up on component destruction
	onDestroy(() => {
		if (pollingIntervalId) {
			clearInterval(pollingIntervalId);
		}
	});
</script>

{#if isLoading && alerts.length === 0}
	<!-- Don't show loading state if we already have alerts displayed -->
	<div class="system-alert-loading">
		<i class="fas fa-circle-notch fa-spin"></i>
		<span>Checking system status...</span>
	</div>
{:else if error}
	<div class="system-alert-error">
		<i class="fas fa-exclamation-circle"></i>
		<span>{error}</span>
		<button class="retry-button" on:click={fetchAlerts} aria-label="Retry">
			<i class="fas fa-sync-alt"></i>
		</button>
	</div>
{:else if alerts.length > 0}
	<div class="system-alerts-container">
		{#each alerts as alert (alert.id)}
			<div
				class="system-alert-banner"
				class:expanded={expandedAlertId === alert.id}
				class:critical={alert.severity === 'critical'}
				class:warning={alert.severity === 'warning'}
				class:moderate={alert.severity === 'moderate'}
				class:resolved={alert.type === 'resolved'}
			>
				<!-- Alert header (always visible) -->
				<div
					class="alert-header"
					on:click={() => toggleAlertDetails(alert.id)}
					on:keydown={(e) => e.key === 'Enter' && toggleAlertDetails(alert.id)}
					tabindex="0"
					role="button"
					aria-expanded={expandedAlertId === alert.id}
				>
					<div class="alert-icon">
						<i class={getAlertIcon(alert)}></i>
					</div>
					<div class="alert-summary">
						<div class="alert-title">
							<span class="title-text">{alert.title}</span>
							<Badge variant={getBadgeVariant(alert)} size="small" pill={true}
								>{alert.type.toUpperCase()}</Badge
							>
						</div>
						<p class="alert-message">{alert.message}</p>
					</div>
					<div class="alert-actions">
						<i class={expandedAlertId === alert.id ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}
						></i>
					</div>
				</div>

				<!-- Expanded details (only visible when expanded) -->
				{#if expandedAlertId === alert.id}
					<div class="alert-details">
						<div class="alert-details-info">
							<div class="alert-detail">
								<span class="alert-detail-label">Started:</span>
								<span class="alert-detail-value">{formatDate(alert.startTime)}</span>
							</div>

							<div class="alert-detail">
								<span class="alert-detail-label">Estimated Resolution:</span>
								<span class="alert-detail-value">
									{formatDate(alert.estimatedResolution)}
									<span class="time-remaining">({getTimeRemaining(alert.estimatedResolution)})</span
									>
								</span>
							</div>

							{#if alert.actualResolution}
								<div class="alert-detail">
									<span class="alert-detail-label">Resolved At:</span>
									<span class="alert-detail-value">{formatDate(alert.actualResolution)}</span>
								</div>
							{/if}

							<div class="alert-detail affected-systems">
								<span class="alert-detail-label">Affected Systems:</span>
								<div class="alert-detail-value systems-list">
									{#each alert.affectedSystems as system}
										<span class="affected-system">{system}</span>
									{/each}
								</div>
							</div>
						</div>

						{#if alert.updates && alert.updates.length > 0}
							<div class="alert-updates">
								<h4>Updates</h4>
								<ul class="updates-list">
									{#each alert.updates as update}
										<li class="update-item">
											<div class="update-timestamp">{formatDate(update.timestamp)}</div>
											<div class="update-message">{update.message}</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						<div class="view-more">
							<button class="view-more-button" on:click={() => viewFullDetails(alert.id)}>
								View Full Details
								<i class="fas fa-arrow-right"></i>
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/each}

		<div class="alerts-footer">
			<span class="last-checked">
				Status last checked at {formattedLastPolled}
				<button class="refresh-button" on:click={fetchAlerts} aria-label="Refresh system status">
					<i class="fas fa-sync-alt"></i>
				</button>
			</span>
		</div>
	</div>
{/if}

<style>
	.system-alerts-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
	}

	.system-alert-banner {
		margin-bottom: 0;
		overflow: hidden;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.system-alert-banner:last-child {
		border-bottom: none;
	}

	.system-alert-banner.critical {
		background-color: #fcecec;
		border-left: 4px solid #dc3545;
	}

	.system-alert-banner.warning {
		background-color: #fff8e6;
		border-left: 4px solid #ffc107;
	}

	.system-alert-banner.moderate {
		background-color: #e6f7ff;
		border-left: 4px solid #17a2b8;
	}

	.system-alert-banner.resolved {
		background-color: #f0fff0;
		border-left: 4px solid #28a745;
	}

	.alert-header {
		display: flex;
		align-items: flex-start;
		padding: 0.85rem 1rem;
		cursor: pointer;
		position: relative;
		gap: 0.75rem;
		transition: background-color 0.2s;
	}

	.alert-header:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.alert-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		flex-shrink: 0;
		padding-top: 0.1rem;
	}

	.critical .alert-icon {
		color: #dc3545;
	}

	.warning .alert-icon {
		color: #ffc107;
	}

	.moderate .alert-icon {
		color: #17a2b8;
	}

	.resolved .alert-icon {
		color: #28a745;
	}

	.alert-summary {
		flex: 1;
	}

	.alert-title {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.3rem;
	}

	.title-text {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.alert-message {
		margin: 0;
		font-size: 0.9rem;
		color: #4b5563;
		line-height: 1.4;
	}

	.alert-actions {
		display: flex;
		align-items: center;
		padding-left: 0.5rem;
		color: #6b7280;
	}

	.alert-details {
		padding: 0.5rem 1rem 1rem 3rem;
		background-color: rgba(255, 255, 255, 0.5);
		border-top: 1px solid rgba(0, 0, 0, 0.05);
		animation: fadeIn 0.3s ease;
	}

	.alert-details-info {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.alert-detail {
		display: flex;
		flex-direction: column;
		font-size: 0.85rem;
	}

	.alert-detail-label {
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 0.25rem;
	}

	.alert-detail-value {
		color: #1f2937;
	}

	.time-remaining {
		margin-left: 0.5rem;
		font-size: 0.8rem;
		font-style: italic;
		color: #6b7280;
	}

	.affected-systems {
		grid-column: 1 / -1;
	}

	.systems-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.affected-system {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
	}

	.alert-updates {
		margin-bottom: 1rem;
	}

	.alert-updates h4 {
		font-size: 0.9rem;
		margin: 0 0 0.5rem 0;
		color: #4b5563;
	}

	.updates-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.update-item {
		padding: 0.5rem;
		border-left: 2px solid #d1d5db;
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.7);
	}

	.update-timestamp {
		font-size: 0.75rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.update-message {
		font-size: 0.85rem;
		color: #1f2937;
	}

	.view-more {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}

	.view-more-button {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: none;
		border: none;
		color: #2563eb;
		font-size: 0.85rem;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		text-decoration: none;
	}

	.view-more-button:hover {
		text-decoration: underline;
	}

	.alerts-footer {
		display: flex;
		justify-content: flex-end;
		padding: 0.5rem 1rem;
		background-color: #f9fafb;
		border-top: 1px solid #e5e7eb;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.last-checked {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.refresh-button {
		background: none;
		border: none;
		color: #6b7280;
		cursor: pointer;
		padding: 0.2rem;
		display: inline-flex;
		font-size: 0.8rem;
	}

	.refresh-button:hover {
		color: #4b5563;
	}

	.system-alert-loading,
	.system-alert-error {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: #6b7280;
		background-color: #f9fafb;
	}

	.system-alert-error {
		color: #dc3545;
	}

	.retry-button {
		background: none;
		border: none;
		color: #6b7280;
		cursor: pointer;
		padding: 0.2rem;
		margin-left: 0.5rem;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.alert-header {
			padding: 0.75rem;
		}

		.alert-details {
			padding: 0.5rem 0.75rem 0.75rem 2.5rem;
		}

		.alert-details-info {
			grid-template-columns: 1fr;
		}

		.alert-message {
			font-size: 0.85rem;
		}
	}
</style>
