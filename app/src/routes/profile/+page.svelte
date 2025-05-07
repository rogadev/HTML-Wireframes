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

		userPreferences.updatePreference('skillDesignations', updatedSkills);
	}

	function toggleProductFocus(product: ProductFocus) {
		const currentProducts = $userPreferences.productFocus || [];
		const isSelected = currentProducts.includes(product);

		const updatedProducts = isSelected
			? currentProducts.filter((p) => p !== product)
			: [...currentProducts, product];

		userPreferences.updatePreference('productFocus', updatedProducts);
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
							on:change={() => userPreferences.updatePreference('language', 'en')}
						/>
						<span>English</span>
					</label>
					<label class="radio-option">
						<input
							type="radio"
							name="language"
							value="fr"
							checked={$userPreferences.language === 'fr'}
							on:change={() => userPreferences.updatePreference('language', 'fr')}
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
						on:change={(e) =>
							userPreferences.updatePreference('region', e.currentTarget.value as Region)}
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
				<h3>Role</h3>
				<div class="setting-options">
					<select
						value={$userPreferences.role}
						on:change={(e) =>
							userPreferences.updatePreference('role', e.currentTarget.value as Role)}
					>
						<option value="technician">Technician</option>
						<option value="manager">Manager</option>
						<option value="admin">Administrator</option>
						<option value="partner">Partner</option>
					</select>
				</div>
			</div>

			<div class="setting-group">
				<h3>Team Type</h3>
				<div class="setting-options">
					<select
						value={$userPreferences.teamType}
						on:change={(e) =>
							userPreferences.updatePreference('teamType', e.currentTarget.value as TeamType)}
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
							userPreferences.updatePreference(
								'audienceGroup',
								e.currentTarget.value as AudienceGroup
							)}
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
		justify-content: flex-end;
		margin-top: 1rem;
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

	@media (max-width: 768px) {
		.checkbox-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
