<script lang="ts">
	import { page } from '$app/state';
	import Badge from '$lib/components/Badge.svelte';

	// Types
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

	let alert = $state<SystemAlert | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	// Get the alert ID from the route params using $derived
	const alertId = $derived(page.params.id);

	// Format ISO date string to readable format
	function formatDate(isoString: string): string {
		return new Date(isoString).toLocaleString([], {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Format relative time (e.g., "2 hours ago")
	function formatRelativeTime(isoString: string): string {
		const date = new Date(isoString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);

		if (diffDay > 0) {
			return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`;
		}
		if (diffHour > 0) {
			return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
		}
		if (diffMin > 0) {
			return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
		}
		return 'just now';
	}

	// Get the appropriate badge variant based on alert type and severity
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

	// Get a descriptive string for the alert severity
	function getSeverityDescription(severity: string): string {
		switch (severity) {
			case 'critical':
				return 'Critical - Severe impact, immediate attention required';
			case 'warning':
				return 'Warning - Significant impact, prompt attention needed';
			case 'moderate':
				return 'Moderate - Limited impact, affects some functionality';
			case 'low':
				return 'Low - Minimal impact, minor inconvenience';
			default:
				return severity;
		}
	}

	// Get icon for alert type
	function getAlertIcon(type: string): string {
		switch (type) {
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

	// Fetch the alert data based on ID
	async function fetchAlertDetails() {
		isLoading = true;
		error = null;

		try {
			// Fetch all alerts, then find the specific one we need
			// In a real app, there would be an endpoint to get a specific alert by ID
			const response = await fetch('/api/system-alerts');

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			const foundAlert = data.alerts.find((a: SystemAlert) => a.id === alertId);

			if (foundAlert) {
				alert = foundAlert;
			} else {
				error = 'Alert not found';
			}
		} catch (err) {
			console.error('Error fetching alert details:', err);
			error = 'Failed to load alert details';
		} finally {
			isLoading = false;
		}
	}

	// Fetch data when alertId changes using $effect
	$effect(() => {
		if (alertId) {
			fetchAlertDetails();
		}
	});
</script>

<svelte:head>
	<title>{alert ? `${alert.title} | System Alert` : 'System Alert Details'} - Tech Central</title>
</svelte:head>

<div class="alert-details-page">
	<div class="breadcrumbs">
		<a href="/">Home</a>
		<span class="separator">/</span>
		<a href="/system-alerts">System Alerts</a>
		<span class="separator">/</span>
		<span class="current">{alert?.title || 'Alert Details'}</span>
	</div>

	{#if isLoading}
		<div class="loading-state">
			<i class="fas fa-circle-notch fa-spin"></i>
			<p>Loading alert details...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<i class="fas fa-exclamation-circle"></i>
			<p>{error}</p>
			<button class="retry-button" onclick={fetchAlertDetails}>Retry</button>
		</div>
	{:else if alert}
		<div
			class="alert-banner"
			class:critical={alert.severity === 'critical'}
			class:warning={alert.severity === 'warning'}
			class:moderate={alert.severity === 'moderate'}
			class:resolved={alert.type === 'resolved'}
		>
			<div class="alert-header">
				<div class="alert-icon">
					<i class={getAlertIcon(alert.type)}></i>
				</div>
				<div class="alert-title-section">
					<h1>{alert.title}</h1>
					<div class="alert-badges">
						<Badge variant={getBadgeVariant(alert)} size="small" pill={true}>
							{alert.type.toUpperCase()}
						</Badge>
						{#if alert.active}
							<span class="status-indicator active">ACTIVE</span>
						{:else}
							<span class="status-indicator resolved">RESOLVED</span>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="alert-content">
			<div class="alert-message-box">
				<p class="alert-message">{alert.message}</p>
			</div>

			<div class="alert-metadata">
				<div class="metadata-item">
					<span class="metadata-label">Alert ID</span>
					<span class="metadata-value">{alert.id}</span>
				</div>

				<div class="metadata-item">
					<span class="metadata-label">Severity</span>
					<span class="metadata-value severity-value">
						<Badge variant={getBadgeVariant(alert)} size="small">
							{alert.severity.toUpperCase()}
						</Badge>
						<span class="severity-description">
							{getSeverityDescription(alert.severity)}
						</span>
					</span>
				</div>

				<div class="metadata-item">
					<span class="metadata-label">Started</span>
					<span class="metadata-value">
						{formatDate(alert.startTime)}
						<span class="relative-time">({formatRelativeTime(alert.startTime)})</span>
					</span>
				</div>

				<div class="metadata-item">
					<span class="metadata-label">Estimated Resolution</span>
					<span class="metadata-value">{formatDate(alert.estimatedResolution)}</span>
				</div>

				{#if alert.actualResolution}
					<div class="metadata-item">
						<span class="metadata-label">Resolved At</span>
						<span class="metadata-value">
							{formatDate(alert.actualResolution)}
							<span class="relative-time">({formatRelativeTime(alert.actualResolution)})</span>
						</span>
					</div>
				{/if}

				<div class="metadata-item full-width">
					<span class="metadata-label">Affected Systems</span>
					<div class="metadata-value affected-systems-list">
						{#each alert.affectedSystems as system}
							<span class="affected-system">{system}</span>
						{/each}
					</div>
				</div>
			</div>

			{#if alert.updates && alert.updates.length > 0}
				<div class="updates-section">
					<h2>Updates</h2>
					<div class="timeline">
						{#each alert.updates as update}
							<div class="timeline-item">
								<div class="timeline-marker"></div>
								<div class="timeline-content">
									<div class="timeline-date">
										{formatDate(update.timestamp)}
										<span class="relative-time">({formatRelativeTime(update.timestamp)})</span>
									</div>
									<div class="timeline-message">{update.message}</div>
								</div>
							</div>
						{/each}
						{#if !alert.actualResolution && alert.active}
							<div class="timeline-item current">
								<div class="timeline-marker current"></div>
								<div class="timeline-content">
									<div class="timeline-date">Current Status</div>
									<div class="timeline-message">
										<span class="status-label">Status:</span>
										<span class="status-value">
											{#if alert.type === 'outage'}
												Service unavailable
											{:else if alert.type === 'maintenance'}
												Maintenance in progress
											{:else if alert.type === 'degraded'}
												Degraded performance
											{:else}
												Issue being investigated
											{/if}
										</span>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<div class="actions-bar">
				<a href="/" class="action-button secondary">
					<i class="fas fa-home"></i>
					Return to Home
				</a>
				<a href="/system-alerts" class="action-button primary">
					<i class="fas fa-bell"></i>
					View All Alerts
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.alert-details-page {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.breadcrumbs {
		display: flex;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
		color: #6b7280;
	}

	.breadcrumbs a {
		color: #4b5563;
		text-decoration: none;
	}

	.breadcrumbs a:hover {
		text-decoration: underline;
		color: #2563eb;
	}

	.separator {
		margin: 0 0.5rem;
		color: #9ca3af;
	}

	.current {
		font-weight: 500;
		color: #1f2937;
	}

	.loading-state,
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
		background-color: #f9fafb;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.loading-state i,
	.error-state i {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: #6b7280;
	}

	.error-state i {
		color: #dc3545;
	}

	.retry-button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background-color: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		color: #4b5563;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.retry-button:hover {
		background-color: #e5e7eb;
	}

	.alert-banner {
		padding: 1.5rem;
		border-radius: 0.5rem 0.5rem 0 0;
		margin-bottom: 2rem;
	}

	.alert-banner.critical {
		background-color: #fecaca;
		border-left: 5px solid #dc3545;
	}

	.alert-banner.warning {
		background-color: #fef3c7;
		border-left: 5px solid #f59e0b;
	}

	.alert-banner.moderate {
		background-color: #e0f2fe;
		border-left: 5px solid #0ea5e9;
	}

	.alert-banner.resolved {
		background-color: #d1fae5;
		border-left: 5px solid #10b981;
	}

	.alert-header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.alert-icon {
		font-size: 1.75rem;
		flex-shrink: 0;
		margin-top: 0.25rem;
	}

	.critical .alert-icon {
		color: #dc3545;
	}

	.warning .alert-icon {
		color: #f59e0b;
	}

	.moderate .alert-icon {
		color: #0ea5e9;
	}

	.resolved .alert-icon {
		color: #10b981;
	}

	.alert-title-section h1 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		line-height: 1.3;
		color: #1f2937;
	}

	.alert-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.status-indicator {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: 9999px;
	}

	.status-indicator.active {
		background-color: rgba(220, 53, 69, 0.1);
		color: #dc3545;
	}

	.status-indicator.resolved {
		background-color: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}

	.alert-content {
		background-color: white;
		border-radius: 0 0 0.5rem 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		margin-top: -2rem;
	}

	.alert-message-box {
		background-color: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.alert-message {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.6;
		color: #1f2937;
	}

	.alert-metadata {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem 2rem;
		margin-bottom: 2.5rem;
	}

	.metadata-item {
		display: flex;
		flex-direction: column;
	}

	.metadata-item.full-width {
		grid-column: 1 / -1;
	}

	.metadata-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #6b7280;
		margin-bottom: 0.5rem;
	}

	.metadata-value {
		font-size: 1rem;
		color: #1f2937;
	}

	.severity-value {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.severity-description {
		font-size: 0.9rem;
		color: #4b5563;
	}

	.relative-time {
		margin-left: 0.5rem;
		font-size: 0.85rem;
		color: #6b7280;
		font-style: italic;
	}

	.affected-systems-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	.affected-system {
		background-color: #f3f4f6;
		color: #4b5563;
		padding: 0.3rem 0.75rem;
		border-radius: 0.25rem;
		font-size: 0.9rem;
	}

	.updates-section {
		margin-bottom: 2.5rem;
	}

	.updates-section h2 {
		font-size: 1.25rem;
		margin: 0 0 1.5rem 0;
		color: #1f2937;
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 0.5rem;
	}

	.timeline {
		position: relative;
		padding-left: 2rem;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 0.4rem;
		top: 0;
		bottom: 0;
		width: 2px;
		background-color: #e5e7eb;
	}

	.timeline-item {
		position: relative;
		margin-bottom: 1.5rem;
	}

	.timeline-item:last-child {
		margin-bottom: 0;
	}

	.timeline-marker {
		position: absolute;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background-color: #6b7280;
		border: 2px solid white;
		left: -2.1rem;
		top: 0.25rem;
	}

	.timeline-marker.current {
		background-color: #3b82f6;
		animation: pulse 1.5s infinite;
	}

	.timeline-content {
		padding: 0.5rem 0 0.5rem 1rem;
	}

	.timeline-date {
		font-size: 0.85rem;
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 0.25rem;
	}

	.timeline-message {
		font-size: 0.95rem;
		color: #1f2937;
		line-height: 1.5;
	}

	.status-label {
		font-weight: 600;
		margin-right: 0.5rem;
	}

	.actions-bar {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.action-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		font-size: 0.95rem;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.2s;
	}

	.action-button.primary {
		background-color: #2563eb;
		color: white;
	}

	.action-button.primary:hover {
		background-color: #1d4ed8;
	}

	.action-button.secondary {
		background-color: #f3f4f6;
		color: #4b5563;
		border: 1px solid #d1d5db;
	}

	.action-button.secondary:hover {
		background-color: #e5e7eb;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
		}
	}

	@media (max-width: 768px) {
		.alert-details-page {
			padding: 1rem;
		}

		.alert-banner {
			padding: 1rem;
		}

		.alert-header {
			flex-direction: column;
			gap: 0.5rem;
		}

		.alert-title-section h1 {
			font-size: 1.25rem;
		}

		.alert-content {
			padding: 1.5rem 1rem;
		}

		.alert-metadata {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.actions-bar {
			justify-content: center;
		}

		.action-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
