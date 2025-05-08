<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SearchBar from './SearchBar.svelte';
	import OfflineToggle from './OfflineToggle.svelte';
	import { userPreferences } from '$lib/stores/userPreferences';
	import type { Region, Language, Role, SkillDesignation } from '$lib/types/userPreferences';

	export let onLanguageChange: (event: { language: string }) => void = () => {};
	export let onRegionChange: (event: { region: string }) => void = () => {};
	export let onRolesChange: (event: { roles: Role[] }) => void = () => {};
	export let onSkillDesignationsChange: (event: { skills: SkillDesignation[] }) => void = () => {};

	let isPanelOpen = false;
	let isMobile = false;
	let isSearchExpanded = false;
	let panelElement: HTMLElement;

	const languages: { code: Language; label: string }[] = [
		{ code: 'en', label: 'English' },
		{ code: 'fr', label: 'Français' }
	];

	const regions: { code: Region; label: string }[] = [
		{ code: 'all', label: 'All Regions' },
		{ code: 'qc', label: 'Quebec' },
		{ code: 'on', label: 'Ontario' },
		{ code: 'ab-bc', label: 'Alberta/British Columbia' },
		{ code: 'atlantic', label: 'Atlantic' },
		{ code: 'mb-sk', label: 'Manitoba/Saskatchewan' }
	];

	const roles: { code: Role; label: string }[] = [
		{ code: 'technician', label: 'Technician' },
		{ code: 'manager', label: 'Manager' },
		{ code: 'partner', label: 'Partner' },
		{ code: 'admin', label: 'Administrator' }
	];

	const skillDesignations: { code: SkillDesignation; label: string }[] = [
		{ code: 'copper', label: 'Copper' },
		{ code: 'fiber', label: 'Fiber' },
		{ code: 'wifi_plus', label: 'WiFi Plus' },
		{ code: 'shs', label: 'SHS' },
		{ code: 'tv', label: 'TV' },
		{ code: 'clec-qc', label: 'CLEC-QC' },
		{ code: 'ilec-qc', label: 'ILEC-QC' }
	];

	// Function to handle outside clicks
	function handleClickOutside(event: MouseEvent) {
		try {
			// Check if the panel is open and if the click was outside the panel and not on the toggle button
			if (
				isPanelOpen &&
				panelElement &&
				!panelElement.contains(event.target as Node) &&
				!(event.target as Element).classList.contains('profile-dropdown-icon')
			) {
				isPanelOpen = false;
			}
		} catch (err) {
			console.error('Error in TopBar click outside handler:', err);
			// Default to closing the panel on error
			isPanelOpen = false;
		}
	}

	onMount(() => {
		console.log('TopBar component initializing');

		try {
			// Check if we're on mobile
			const checkMobile = () => {
				try {
					isMobile = window.innerWidth <= 768;
				} catch (err) {
					console.error('Error checking mobile state:', err);
				}
			};

			checkMobile();

			// Wrap event listeners in try/catch for safety
			const safeResizeHandler = () => {
				try {
					checkMobile();
				} catch (err) {
					console.error('Error in resize handler:', err);
				}
			};

			const safeClickHandler = (event: MouseEvent) => {
				try {
					handleClickOutside(event);
				} catch (err) {
					console.error('Error in click handler:', err);
				}
			};

			window.addEventListener('resize', safeResizeHandler);
			document.addEventListener('click', safeClickHandler);

			return () => {
				console.log('TopBar component unmounting');
				try {
					window.removeEventListener('resize', safeResizeHandler);
					document.removeEventListener('click', safeClickHandler);
				} catch (err) {
					console.error('Error cleaning up TopBar event listeners:', err);
				}
			};
		} catch (err) {
			console.error('Error initializing TopBar component:', err);
			// Return a no-op cleanup function
			return () => {};
		}
	});

	function togglePanel(event: MouseEvent) {
		// Prevent the click from immediately triggering the outside click handler
		event.stopPropagation();
		isPanelOpen = !isPanelOpen;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			isPanelOpen = !isPanelOpen;
		}
	}

	function handleLanguageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		userPreferences.setLanguage(target.value as Language);
		onLanguageChange({ language: target.value });
	}

	function handleRegionChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		userPreferences.setRegion(target.value as Region);
		onRegionChange({ region: target.value });
	}

	function toggleRole(role: Role) {
		userPreferences.toggleRole(role);
		onRolesChange({ roles: $userPreferences.roles });
	}

	function setPrimaryRole(role: Role) {
		if ($userPreferences.roles.includes(role)) {
			userPreferences.setPrimaryRole(role);
		}
	}

	function toggleSkillDesignation(skill: SkillDesignation) {
		const currentSkills = $userPreferences.skillDesignations || [];
		const isSelected = currentSkills.includes(skill);

		const updatedSkills = isSelected
			? currentSkills.filter((s) => s !== skill)
			: [...currentSkills, skill];

		userPreferences.setSkillDesignations(updatedSkills);
		onSkillDesignationsChange({ skills: updatedSkills });
	}

	function closePanel() {
		isPanelOpen = false;
	}

	function navigateToProfile() {
		closePanel();
		goto('/profile');
	}
</script>

<div class="top-bar">
	<div class="top-bar-container">
		<SearchBar {isMobile} isExpanded={isSearchExpanded} />

		<div class="top-bar-right">
			<OfflineToggle />
			<div class="profile-display">
				<span class="selected-region">
					{regions.find((r) => r.code === $userPreferences.region)?.label || 'All Regions'}
				</span>
				<span class="divider">|</span>
				<span class="selected-language">
					{$userPreferences.language.toUpperCase()}
				</span>
				<button
					type="button"
					class="profile-dropdown-icon"
					onclick={togglePanel}
					onkeydown={handleKeydown}
					aria-expanded={isPanelOpen}
					aria-label="User preferences"
				>
					<i class="fas fa-user-cog"></i>
				</button>
			</div>
		</div>

		{#if isPanelOpen}
			<div
				class="user-preferences-panel"
				role="dialog"
				aria-label="User preferences"
				bind:this={panelElement}
			>
				<h3>User Preferences</h3>

				<div class="pref-section">
					<h4>Language</h4>
					{#each languages as lang}
						<div class="pref-option">
							<input
								type="radio"
								id="lang-{lang.code}"
								name="language"
								value={lang.code}
								checked={$userPreferences.language === lang.code}
								onchange={handleLanguageChange}
							/>
							<label for="lang-{lang.code}">{lang.label}</label>
						</div>
					{/each}
				</div>

				<div class="pref-section">
					<h4>Region</h4>
					<select
						id="region-selector"
						value={$userPreferences.region}
						onchange={handleRegionChange}
					>
						{#each regions as region}
							<option value={region.code}>{region.label}</option>
						{/each}
					</select>
					<div class="pref-info">
						<i class="fas fa-info-circle"></i>
						<span>Content will be filtered based on your region</span>
					</div>
				</div>

				<div class="pref-section">
					<h4>Roles</h4>
					<div class="roles-grid">
						{#each roles as role}
							<div class="role-option">
								<input
									type="checkbox"
									id="role-{role.code}"
									checked={$userPreferences.roles.includes(role.code)}
									onchange={() => toggleRole(role.code)}
								/>
								<label for="role-{role.code}">{role.label}</label>
								{#if $userPreferences.roles.includes(role.code)}
									<div class="primary-role-selector">
										<input
											type="radio"
											id="primary-{role.code}"
											name="primary-role"
											checked={$userPreferences.primaryRole === role.code}
											onchange={() => setPrimaryRole(role.code)}
										/>
										<label for="primary-{role.code}" class="primary-label">Primary</label>
									</div>
								{/if}
							</div>
						{/each}
					</div>
					<div class="pref-info">
						<i class="fas fa-info-circle"></i>
						<span>Select your roles and designate a primary role for default view</span>
					</div>
				</div>

				<div class="pref-section">
					<h4>Skills</h4>
					<div class="skills-grid">
						{#each skillDesignations as skill}
							<div class="skill-option">
								<input
									type="checkbox"
									id="skill-{skill.code}"
									checked={$userPreferences.skillDesignations?.includes(skill.code)}
									onchange={() => toggleSkillDesignation(skill.code)}
								/>
								<label for="skill-{skill.code}">{skill.label}</label>
							</div>
						{/each}
					</div>
					<div class="pref-info">
						<i class="fas fa-info-circle"></i>
						<span>Select skills to customize your content experience</span>
					</div>
				</div>

				<div class="pref-section profile-link-section">
					<a href="/profile" class="profile-full-link" onclick={navigateToProfile}>
						<i class="fas fa-user-cog"></i>
						Advanced profile settings
					</a>
					<div class="pref-info">
						<i class="fas fa-info-circle"></i>
						<span>Manage additional preferences in the profile settings</span>
					</div>
				</div>

				<div class="pref-actions">
					<button class="save-pref-btn" onclick={closePanel}>Save & Close</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.top-bar {
		background: var(--telus-purple, #4b286d);
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--border-color);
		position: relative;
	}

	.top-bar-container {
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 2rem;
	}

	.top-bar-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.profile-display {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		position: relative;
		flex-shrink: 0;
	}

	.selected-region,
	.selected-language {
		font-weight: 500;
		color: white;
	}

	.divider {
		color: rgba(255, 255, 255, 0.5);
	}

	.profile-dropdown-icon {
		cursor: pointer;
		padding: 0.25rem;
		color: white;
		background: none;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.profile-dropdown-icon:hover {
		color: rgba(255, 255, 255, 0.8);
	}

	.profile-dropdown-icon[aria-expanded='true'] {
		transform: rotate(20deg);
	}

	.user-preferences-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: white;
		padding: 1.5rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		min-width: 320px;
		margin-top: 0.5rem;
		display: block;
		color: var(--text-color, #333);
		max-height: 85vh;
		overflow-y: auto;
	}

	.user-preferences-panel h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.25rem;
		color: var(--telus-purple, #4b286d);
		border-bottom: 1px solid #eee;
		padding-bottom: 0.5rem;
	}

	.pref-section {
		margin-bottom: 1.25rem;
	}

	.profile-link-section {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid #eee;
	}

	.profile-full-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--telus-purple, #4b286d);
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 0;
		margin-bottom: 0.5rem;
	}

	.profile-full-link:hover {
		text-decoration: underline;
	}

	h4 {
		margin-bottom: 0.75rem;
		color: var(--text-color, #333);
		font-size: 1rem;
	}

	.pref-option,
	.skill-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.role-option {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
		border-radius: 4px;
		background-color: #f9f9f9;
	}

	.primary-role-selector {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.primary-label {
		font-size: 0.8rem;
		color: #666;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border-color, #ddd);
		border-radius: 4px;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	.roles-grid,
	.skills-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.pref-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: var(--secondary-color, #666);
	}

	.pref-actions {
		margin-top: 1rem;
		display: flex;
		justify-content: flex-end;
	}

	.save-pref-btn {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		background: var(--telus-purple, #4b286d);
		color: white;
		border: none;
	}

	.save-pref-btn:hover {
		background: #3a1f54;
	}

	@media (max-width: 768px) {
		.top-bar-container {
			justify-content: flex-end;
			gap: 1rem;
			position: relative;
		}

		.top-bar-right {
			gap: 0.5rem;
		}

		.profile-display {
			display: flex;
			font-size: 0.875rem;
			position: relative;
			z-index: 1001;
		}

		.selected-region {
			display: none;
		}

		.divider {
			display: none;
		}

		.selected-language {
			font-weight: 500;
		}

		.profile-dropdown-icon {
			padding: 0.25rem;
		}

		.user-preferences-panel {
			right: 0;
			left: 0;
			width: 100%;
			max-width: none;
			border-radius: 0;
			margin-top: 0;
		}

		.skills-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
