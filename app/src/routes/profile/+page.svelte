<script lang="ts">
	import { userPreferences } from '$lib/stores/userPreferences';
	import type {
		Region,
		Language,
		Role,
		TeamType,
		SkillDesignation,
		AudienceGroup,
		ProductFocus
	} from '$lib/types/userPreferences';

	function toggleSkillDesignation(skill: SkillDesignation) {
		const currentSkills = $userPreferences.skillDesignations || [];
		const isSelected = currentSkills.includes(skill);

		const updatedSkills = isSelected
			? currentSkills.filter((s) => s !== skill)
			: [...currentSkills, skill];

		userPreferences.setSkillDesignations(updatedSkills);
	}

	function toggleProductFocus(product: ProductFocus) {
		const currentProducts = $userPreferences.productFocus || [];
		const isSelected = currentProducts.includes(product);

		const updatedProducts = isSelected
			? currentProducts.filter((p) => p !== product)
			: [...currentProducts, product];

		userPreferences.setProductFocus(updatedProducts);
	}

	function toggleRole(role: Role) {
		userPreferences.toggleRole(role);
	}

	function setPrimaryRole(role: Role) {
		if ($userPreferences.roles.includes(role)) {
			userPreferences.setPrimaryRole(role);
		}
	}
</script>

<div class="profile-container">
	<h1>Profile Settings</h1>

	<div class="profile-content">
		<div class="settings-section">
			<h2>Display Preferences</h2>

			<div class="setting-group">
				<h3>Language</h3>
				<div class="setting-options">
					<label class="radio-option">
						<input
							type="radio"
							name="language"
							value="en"
							checked={$userPreferences.language === 'en'}
							on:change={() => userPreferences.setLanguage('en')}
						/>
						<span>English</span>
					</label>
					<label class="radio-option">
						<input
							type="radio"
							name="language"
							value="fr"
							checked={$userPreferences.language === 'fr'}
							on:change={() => userPreferences.setLanguage('fr')}
						/>
						<span>Français</span>
					</label>
				</div>
			</div>

			<div class="setting-group">
				<h3>Region</h3>
				<div class="setting-options">
					<select
						value={$userPreferences.region}
						on:change={(e) => userPreferences.setRegion(e.currentTarget.value as Region)}
					>
						<option value="all">All Regions</option>
						<option value="qc">Quebec</option>
						<option value="on">Ontario</option>
						<option value="ab-bc">Alberta/British Columbia</option>
						<option value="atlantic">Atlantic</option>
						<option value="mb-sk">Manitoba/Saskatchewan</option>
					</select>
				</div>
			</div>

			<div class="setting-group">
				<h3>Roles</h3>
				<p class="setting-description">
					Select all roles that apply to you. Your primary role determines what you see by default.
				</p>
				<div class="role-grid">
					{#each ['technician', 'manager', 'admin', 'partner'] as role}
						<div class="role-item">
							<div class="role-checkbox">
								<input
									type="checkbox"
									id="role-{role}"
									checked={$userPreferences.roles.includes(role as Role)}
									on:change={() => toggleRole(role as Role)}
								/>
								<label for="role-{role}">{role.charAt(0).toUpperCase() + role.slice(1)}</label>
							</div>
							{#if $userPreferences.roles.includes(role as Role)}
								<div class="primary-role">
									<input
										type="radio"
										id="primary-{role}"
										name="primary-role"
										checked={$userPreferences.primaryRole === role}
										on:change={() => setPrimaryRole(role as Role)}
									/>
									<label for="primary-{role}">Primary Role</label>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="setting-group">
				<h3>Team Type</h3>
				<div class="setting-options">
					<select
						value={$userPreferences.teamType}
						on:change={(e) => userPreferences.setTeamType(e.currentTarget.value as TeamType)}
					>
						<option value="home">Home</option>
						<option value="partner">Partner</option>
						<option value="custom_home">Custom Home</option>
					</select>
				</div>
			</div>
		</div>

		<div class="settings-section">
			<h2>Content Filters</h2>

			<div class="setting-group">
				<h3>Audience Group</h3>
				<div class="setting-options">
					<select
						value={$userPreferences.audienceGroup}
						on:change={(e) =>
							userPreferences.setAudienceGroup(e.currentTarget.value as AudienceGroup)}
					>
						<option value="tech">Technician</option>
						<option value="manager">Manager</option>
						<option value="owner">Owner</option>
						<option value="trainer">Trainer</option>
						<option value="partnerTech">Partner Tech</option>
					</select>
				</div>
			</div>

			<div class="setting-group">
				<h3>Skill Designations</h3>
				<p class="setting-description">Select all skills that apply to your current position.</p>
				<div class="setting-options checkbox-grid">
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.skillDesignations?.includes('copper')}
							on:change={() => toggleSkillDesignation('copper')}
						/>
						<span>Copper</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.skillDesignations?.includes('fiber')}
							on:change={() => toggleSkillDesignation('fiber')}
						/>
						<span>Fiber</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.skillDesignations?.includes('wifi_plus')}
							on:change={() => toggleSkillDesignation('wifi_plus')}
						/>
						<span>WiFi Plus</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.skillDesignations?.includes('shs')}
							on:change={() => toggleSkillDesignation('shs')}
						/>
						<span>SHS</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.skillDesignations?.includes('tv')}
							on:change={() => toggleSkillDesignation('tv')}
						/>
						<span>TV</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.skillDesignations?.includes('clec-qc')}
							on:change={() => toggleSkillDesignation('clec-qc')}
						/>
						<span>CLEC-QC</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.skillDesignations?.includes('ilec-qc')}
							on:change={() => toggleSkillDesignation('ilec-qc')}
						/>
						<span>ILEC-QC</span>
					</label>
				</div>
			</div>

			<div class="setting-group">
				<h3>Product Focus</h3>
				<p class="setting-description">
					Select all products that you specialize in or need to access regularly.
				</p>
				<div class="setting-options checkbox-grid">
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.productFocus?.includes('SHS')}
							on:change={() => toggleProductFocus('SHS')}
						/>
						<span>Smart Home Security</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.productFocus?.includes('TV')}
							on:change={() => toggleProductFocus('TV')}
						/>
						<span>TV</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.productFocus?.includes('Internet')}
							on:change={() => toggleProductFocus('Internet')}
						/>
						<span>Internet</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.productFocus?.includes('WiFi')}
							on:change={() => toggleProductFocus('WiFi')}
						/>
						<span>WiFi</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.productFocus?.includes('ValueGen')}
							on:change={() => toggleProductFocus('ValueGen')}
						/>
						<span>ValueGen</span>
					</label>
					<label class="checkbox-option">
						<input
							type="checkbox"
							checked={$userPreferences.productFocus?.includes('Custom Home')}
							on:change={() => toggleProductFocus('Custom Home')}
						/>
						<span>Custom Home</span>
					</label>
				</div>
			</div>
		</div>

		<div class="actions">
			<button type="button" class="reset-button" on:click={() => userPreferences.reset()}>
				Reset to Defaults
			</button>
			<div class="test-profiles">
				<h4>Development Profiles</h4>
				<div class="test-buttons">
					<button
						type="button"
						class="test-data-button"
						on:click={() => userPreferences.loadTechProfile()}
					>
						<i class="fas fa-user-hard-hat"></i> Tech Profile
					</button>
					<button
						type="button"
						class="test-data-button"
						on:click={() => userPreferences.loadManagerProfile()}
					>
						<i class="fas fa-user-tie"></i> Manager Profile
					</button>
					<button
						type="button"
						class="test-data-button"
						on:click={() => userPreferences.loadPartnerProfile()}
					>
						<i class="fas fa-handshake"></i> Partner Profile
					</button>
				</div>
				<div class="profile-info">
					<span class="info-text"
						>Current profile: <strong>{$userPreferences.primaryRole}</strong></span
					>
					<span class="info-text">Region: <strong>{$userPreferences.region}</strong></span>
					<span class="info-text">Language: <strong>{$userPreferences.language}</strong></span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.profile-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		color: var(--telus-purple, #4b286d);
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #eee;
	}

	.profile-content {
		display: grid;
		gap: 2rem;
	}

	.settings-section {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	h2 {
		color: var(--telus-purple, #4b286d);
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.setting-group {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
	}

	.setting-group:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	h3 {
		font-size: 1rem;
		margin-bottom: 0.75rem;
		color: #2a2c32;
	}

	.setting-description {
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 1rem;
	}

	.setting-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-option,
	.checkbox-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.role-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	}

	.role-item {
		background-color: #f9f9f9;
		border-radius: 8px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.role-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.primary-role {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #eee;
	}

	.primary-role label {
		font-size: 0.85rem;
		color: #555;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background-color: white;
	}

	.checkbox-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.reset-button {
		background-color: #f2f2f2;
		color: #444;
		border: 1px solid #ddd;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.reset-button:hover {
		background-color: #e5e5e5;
	}

	.test-data-button {
		background-color: #eef0ff;
		color: #4b286d;
		border: 1px solid #d1d5ff;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		margin-left: 0.5rem;
		font-weight: 500;
	}

	.test-data-button:hover {
		background-color: #d1d5ff;
	}

	.test-profiles {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		padding: 1rem;
		border-radius: 8px;
		max-width: 500px;
	}

	.test-profiles h4 {
		margin-top: 0;
		margin-bottom: 0.75rem;
		color: #4b286d;
		font-size: 0.9rem;
	}

	.test-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
		color: #555;
	}

	.info-text {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	@media (max-width: 768px) {
		.checkbox-grid,
		.role-grid {
			grid-template-columns: 1fr;
		}

		.actions {
			flex-direction: column;
			align-items: stretch;
		}

		.test-profiles {
			width: 100%;
		}
	}
</style>
