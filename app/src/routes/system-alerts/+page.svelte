<script lang="ts">
	import { goto } from '$app/navigation';
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

	// State with runes
	let alerts = $state<SystemAlert[]>([]);
	let filteredAlerts = $state<SystemAlert[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let activeFilter = $state<'all' | 'active' | 'resolved'>('active');
	let typeFilter = $state<'all' | 'outage' | 'maintenance' | 'degraded' | 'resolved'>('all');
	let searchQuery = $state('');

	// Format ISO date string to readable format
	function formatDate(isoString: string): string {
		return new Date(isoString).toLocaleString([], {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
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

	// Navigate to alert details page
	function viewAlertDetails(alertId: string) {
		goto(`/system-alerts/${alertId}`);
	}

	// Handle filter changes
	function handleActiveFilterChange(event: Event) {
		activeFilter = (event.target as HTMLSelectElement).value as 'all' | 'active' | 'resolved';
		applyFilters();
	}

	function handleTypeFilterChange(event: Event) {
		typeFilter = (event.target as HTMLSelectElement).value as
			| 'all'
			| 'outage'
			| 'maintenance'
			| 'degraded'
			| 'resolved';
		applyFilters();
	}

	function handleSearchInput(event: Event) {
		searchQuery = (event.target as HTMLInputElement).value;
		applyFilters();
	}

	// Apply all filters to the alerts
	function applyFilters() {
		filteredAlerts = alerts.filter((alert) => {
			// Filter by active/resolved status
			if (activeFilter === 'active' && !alert.active) return false;
			if (activeFilter === 'resolved' && alert.active) return false;

			// Filter by alert type
			if (typeFilter !== 'all' && alert.type !== typeFilter) return false;

			// Filter by search query
			if (searchQuery.trim() !== '') {
				const query = searchQuery.toLowerCase();
				const matchesTitle = alert.title.toLowerCase().includes(query);
				const matchesMessage = alert.message.toLowerCase().includes(query);
				const matchesSystems = alert.affectedSystems.some((sys) =>
					sys.toLowerCase().includes(query)
				);

				if (!matchesTitle && !matchesMessage && !matchesSystems) return false;
			}

			return true;
		});

		// Sort by active status (active first) and then by start time (newest first)
		filteredAlerts.sort((a, b) => {
			// Active alerts first
			if (a.active && !b.active) return -1;
			if (!a.active && b.active) return 1;

			// Then sort by critical alerts
			if (a.severity === 'critical' && b.severity !== 'critical') return -1;
			if (a.severity !== 'critical' && b.severity === 'critical') return 1;

			// Then sort by most recent first
			return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
		});
	}

	// Fetch alert data
	async function fetchAlerts() {
		isLoading = true;
		error = null;

		try {
			const url = '/api/system-alerts?active=false';
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			alerts = data.alerts;
			applyFilters();
		} catch (err) {
			console.error('Error fetching system alerts:', err);
			error = 'Failed to load system alerts';
			filteredAlerts = [];
		} finally {
			isLoading = false;
		}
	}

	// initialization
	$effect(() => {
		fetchAlerts();
	});

	// Handle keyboard navigation
	function handleCardKeyDown(e: KeyboardEvent, alertId: string) {
		if (e.key === 'Enter') viewAlertDetails(alertId);
	}

	// Clear filters function
	function clearFilters() {
		activeFilter = 'all';
		typeFilter = 'all';
		searchQuery = '';
		applyFilters();
	}
</script>

<svelte:head>
	<title>System Alerts - Tech Central</title>
</svelte:head>

<div class="alerts-page">
	<div class="page-header">
		<h1>System Alerts</h1>
		<p class="page-description">
			View all system alerts, outages, and maintenance notifications. Active critical alerts will
			also appear at the top of every page.
		</p>
	</div>

	<div class="alert-filters">
		<div class="filter-group">
			<label for="status-filter">Status</label>
			<select
				id="status-filter"
				onchange={handleActiveFilterChange}
				class="filter-select"
				value={activeFilter}
			>
				<option value="all">All</option>
				<option value="active">Active Only</option>
				<option value="resolved">Resolved Only</option>
			</select>
		</div>

		<div class="filter-group">
			<label for="type-filter">Type</label>
			<select
				id="type-filter"
				onchange={handleTypeFilterChange}
				class="filter-select"
				value={typeFilter}
			>
				<option value="all">All Types</option>
				<option value="outage">Outage</option>
				<option value="maintenance">Maintenance</option>
				<option value="degraded">Degraded Performance</option>
				<option value="resolved">Resolved</option>
			</select>
		</div>

		<div class="filter-group search-group">
			<label for="search-alerts">Search</label>
			<div class="search-input-wrapper">
				<input
					id="search-alerts"
					type="text"
					placeholder="Search alerts..."
					value={searchQuery}
					oninput={handleSearchInput}
				/>
				<i class="fas fa-search search-icon"></i>
				{#if searchQuery}
					<button
						class="clear-search"
						onclick={() => {
							searchQuery = '';
							applyFilters();
						}}
						aria-label="Clear search"
					>
						<i class="fas fa-times"></i>
					</button>
				{/if}
			</div>
		</div>

		<button class="refresh-button" onclick={fetchAlerts} aria-label="Refresh alerts">
			<i class="fas fa-sync-alt"></i>
			Refresh
		</button>
	</div>

	{#if isLoading}
		<div class="loading-state">
			<i class="fas fa-circle-notch fa-spin"></i>
			<p>Loading system alerts...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<i class="fas fa-exclamation-circle"></i>
			<p>{error}</p>
			<button class="retry-button" onclick={fetchAlerts}>Retry</button>
		</div>
	{:else if filteredAlerts.length === 0}
		<div class="empty-state">
			<i class="fas fa-bell-slash"></i>
			<p>No alerts match your filters</p>
			<button class="clear-filters" onclick={clearFilters}> Clear Filters </button>
		</div>
	{:else}
		<div class="alerts-list">
			{#each filteredAlerts as alert (alert.id)}
				<div
					class="alert-card"
					class:critical={alert.severity === 'critical'}
					class:warning={alert.severity === 'warning'}
					class:moderate={alert.severity === 'moderate'}
					class:resolved={alert.type === 'resolved'}
					onclick={() => viewAlertDetails(alert.id)}
					onkeydown={(e) => handleCardKeyDown(e, alert.id)}
					tabindex="0"
					role="button"
					aria-label={`View details for ${alert.title}`}
				>
					<div class="alert-card-header">
						<div class="alert-icon">
							<i class={getAlertIcon(alert.type)}></i>
						</div>
						<div class="alert-meta">
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
							<h3 class="alert-title">{alert.title}</h3>
						</div>
					</div>

					<p class="alert-message">{alert.message}</p>

					<div class="alert-footer">
						<div class="alert-times">
							<span class="alert-time-item">
								<i class="far fa-clock"></i>
								Started: {formatDate(alert.startTime)}
							</span>
							{#if alert.actualResolution}
								<span class="alert-time-item">
									<i class="fas fa-check-circle"></i>
									Resolved: {formatDate(alert.actualResolution)}
								</span>
							{:else}
								<span class="alert-time-item">
									<i class="far fa-calendar-alt"></i>
									Est. Resolution: {formatDate(alert.estimatedResolution)}
								</span>
							{/if}
						</div>

						<button class="view-details-button">
							View Details
							<i class="fas fa-arrow-right"></i>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.alerts-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		color: #1f2937;
	}

	.page-description {
		color: #6b7280;
		margin: 0;
		line-height: 1.5;
	}

	.alert-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem;
		background-color: #f9fafb;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		min-width: 200px;
	}

	.search-group {
		flex-grow: 1;
	}

	.filter-group label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 0.25rem;
	}

	.filter-select {
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		background-color: white;
		color: #1f2937;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.search-input-wrapper {
		position: relative;
	}

	.search-input-wrapper input {
		width: 100%;
		padding: 0.5rem 2.5rem 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.9rem;
	}

	.search-icon {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: #9ca3af;
	}

	.clear-search {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		color: #6b7280;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.refresh-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 1rem;
		height: 38px;
		margin-top: auto;
		background-color: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		color: #4b5563;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.refresh-button:hover {
		background-color: #e5e7eb;
	}

	.alerts-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.alert-card {
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
		padding: 1.25rem;
		background-color: white;
		transition: all 0.2s;
		cursor: pointer;
		position: relative;
	}

	.alert-card:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
		transform: translateY(-2px);
	}

	.alert-card.critical {
		border-left: 4px solid #dc3545;
	}

	.alert-card.warning {
		border-left: 4px solid #ffc107;
	}

	.alert-card.moderate {
		border-left: 4px solid #17a2b8;
	}

	.alert-card.resolved {
		border-left: 4px solid #28a745;
	}

	.alert-card-header {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.alert-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
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

	.alert-meta {
		flex: 1;
	}

	.alert-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
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

	.alert-title {
		margin: 0;
		font-size: 1.1rem;
		color: #1f2937;
	}

	.alert-message {
		margin: 0 0 1.5rem 0;
		color: #4b5563;
		font-size: 0.95rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.alert-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.alert-times {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.alert-time-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: #6b7280;
	}

	.view-details-button {
		background: none;
		border: none;
		color: #2563eb;
		font-size: 0.9rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		cursor: pointer;
	}

	.view-details-button:hover {
		text-decoration: underline;
	}

	.loading-state,
	.error-state,
	.empty-state {
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
	.error-state i,
	.empty-state i {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: #6b7280;
	}

	.error-state i {
		color: #dc3545;
	}

	.empty-state i {
		color: #9ca3af;
	}

	.retry-button,
	.clear-filters {
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

	.retry-button:hover,
	.clear-filters:hover {
		background-color: #e5e7eb;
	}

	@media (max-width: 768px) {
		.alerts-page {
			padding: 1rem;
		}

		.alert-filters {
			flex-direction: column;
			gap: 0.75rem;
		}

		.filter-group {
			min-width: 0;
			width: 100%;
		}

		.refresh-button {
			margin-top: 0.5rem;
			width: 100%;
			justify-content: center;
		}

		.alert-footer {
			flex-direction: column;
			align-items: flex-start;
		}

		.view-details-button {
			align-self: flex-end;
		}
	}
</style>
