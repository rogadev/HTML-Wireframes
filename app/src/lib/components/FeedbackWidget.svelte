<script lang="ts">
	// Convert export props to $props
	const { articleId, articleUrl } = $props<{
		articleId: string;
		articleUrl: string;
	}>();

	// Convert regular variables to $state
	let showModal = $state(false);
	let isHelpful = $state<boolean | null>(null);
	let feedbackSubmitted = $state(false);
	let reportFormData = $state({
		name: '',
		email: '',
		issue: '',
		pageUrl: articleUrl
	});
	let isSubmitting = $state(false);
	let submitError = $state('');

	function toggleModal(open: boolean) {
		showModal = open;
		if (open) {
			// Reset form when opening
			reportFormData = {
				name: '',
				email: '',
				issue: '',
				pageUrl: articleUrl
			};
			submitError = '';
		}
	}

	async function submitHelpfulFeedback(helpful: boolean) {
		isHelpful = helpful;
		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					articleId,
					isHelpful: helpful,
					feedbackType: 'helpfulness'
				})
			});

			if (response.ok) {
				feedbackSubmitted = true;
			} else {
				console.error('Failed to submit feedback');
			}
		} catch (err) {
			console.error('Error submitting feedback:', err);
		}
	}

	async function submitIssueReport() {
		if (!reportFormData.issue.trim()) {
			submitError = 'Please describe the issue';
			return;
		}

		isSubmitting = true;
		submitError = '';

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					articleId,
					feedbackType: 'issue',
					...reportFormData
				})
			});

			if (response.ok) {
				toggleModal(false);
				feedbackSubmitted = true;
			} else {
				submitError = 'Failed to submit. Please try again.';
			}
		} catch (err) {
			submitError = 'An error occurred. Please try again.';
			console.error('Error submitting issue report:', err);
		} finally {
			isSubmitting = false;
		}
	}

	// Event handler functions with explicit event modifications
	function handleBackdropClick() {
		toggleModal(false);
	}

	function handleModalClick(event: MouseEvent) {
		// Stop propagation to prevent the backdrop click handler from firing
		event.stopPropagation();
	}

	function handleModalKeydown(event: KeyboardEvent) {
		// Stop propagation to prevent the backdrop keydown handler from firing
		event.stopPropagation();
	}

	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			toggleModal(false);
		}
	}

	function handleFormSubmit(event: SubmitEvent) {
		// Prevent the default form submission
		event.preventDefault();
		submitIssueReport();
	}
</script>

<div class="feedback-widget">
	{#if !feedbackSubmitted}
		<div class="feedback-prompt">
			<p>Was this page helpful?</p>
			<div class="feedback-buttons">
				<button
					type="button"
					class="feedback-button thumbs-up"
					onclick={() => submitHelpfulFeedback(true)}
					aria-label="This page was helpful"
				>
					<i class="fas fa-thumbs-up"></i>
					<span>Yes</span>
				</button>
				<button
					type="button"
					class="feedback-button thumbs-down"
					onclick={() => submitHelpfulFeedback(false)}
					aria-label="This page was not helpful"
				>
					<i class="fas fa-thumbs-down"></i>
					<span>No</span>
				</button>
			</div>
		</div>
		<div class="report-issue">
			<button
				type="button"
				class="report-button"
				onclick={() => toggleModal(true)}
				aria-label="Report an issue with this page"
			>
				<i class="fas fa-flag"></i>
				<span>Report an issue</span>
			</button>
		</div>
	{:else}
		<div class="feedback-thankyou">
			<i class="fas fa-check-circle"></i>
			<p>Thank you for your feedback!</p>
		</div>
	{/if}
</div>

{#if showModal}
	<div
		class="modal-backdrop"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		tabindex="0"
		role="button"
		aria-label="Close modal"
	>
		<div
			class="modal-content"
			onclick={handleModalClick}
			onkeydown={handleModalKeydown}
			tabindex="0"
			role="dialog"
			aria-labelledby="modal-title"
		>
			<div class="modal-header">
				<h3 id="modal-title">Report an Issue</h3>
				<button
					type="button"
					class="close-modal"
					onclick={() => toggleModal(false)}
					aria-label="Close modal"
				>
					<i class="fas fa-times"></i>
				</button>
			</div>

			<form onsubmit={handleFormSubmit}>
				<div class="form-group">
					<label for="name">Name (optional)</label>
					<input id="name" type="text" bind:value={reportFormData.name} />
				</div>

				<div class="form-group">
					<label for="email">Email (optional)</label>
					<input id="email" type="email" bind:value={reportFormData.email} />
				</div>

				<div class="form-group">
					<label for="pageUrl">Page URL</label>
					<input id="pageUrl" type="text" bind:value={reportFormData.pageUrl} readonly />
				</div>

				<div class="form-group">
					<label for="issue">Describe the issue <span class="required">*</span></label>
					<textarea
						id="issue"
						rows="4"
						bind:value={reportFormData.issue}
						placeholder="Please describe what's incorrect or missing"
						required
					></textarea>
				</div>

				{#if submitError}
					<div class="error-message">
						<i class="fas fa-exclamation-circle"></i>
						<span>{submitError}</span>
					</div>
				{/if}

				<div class="form-actions">
					<button type="button" class="cancel-button" onclick={() => toggleModal(false)}>
						Cancel
					</button>
					<button type="submit" class="submit-button" disabled={isSubmitting}>
						{#if isSubmitting}
							<i class="fas fa-spinner fa-spin"></i>
							Submitting...
						{:else}
							Submit
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.feedback-widget {
		margin-top: 3rem;
		padding: 1.5rem;
		border-top: 1px solid #e5e7eb;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.feedback-prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.feedback-prompt p {
		margin: 0;
		font-size: 1rem;
		color: #4b5563;
		font-weight: 500;
	}

	.feedback-buttons {
		display: flex;
		gap: 1rem;
	}

	.feedback-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 1px solid #d1d5db;
	}

	.thumbs-up {
		background-color: #f0fdf4;
		color: #15803d;
	}

	.thumbs-up:hover {
		background-color: #dcfce7;
		border-color: #15803d;
	}

	.thumbs-down {
		background-color: #fef2f2;
		color: #b91c1c;
	}

	.thumbs-down:hover {
		background-color: #fee2e2;
		border-color: #b91c1c;
	}

	.report-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		color: #4b5563;
		font-size: 0.875rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		transition: background 0.2s;
	}

	.report-button:hover {
		background-color: #f3f4f6;
		text-decoration: underline;
	}

	.feedback-thankyou {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: #15803d;
	}

	.feedback-thankyou i {
		font-size: 1.5rem;
	}

	.feedback-thankyou p {
		margin: 0;
		font-weight: 500;
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}

	.modal-content {
		background: white;
		border-radius: 0.5rem;
		width: 100%;
		max-width: 500px;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h3 {
		margin: 0;
		font-size: 1.25rem;
		color: #1f2937;
	}

	.close-modal {
		background: none;
		border: none;
		color: #6b7280;
		cursor: pointer;
		font-size: 1.25rem;
		line-height: 1;
		padding: 0.25rem;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-modal:hover {
		background-color: #f3f4f6;
		color: #1f2937;
	}

	form {
		padding: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #4b5563;
		margin-bottom: 0.5rem;
	}

	.required {
		color: #b91c1c;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.625rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: #1f2937;
	}

	input:read-only {
		background-color: #f3f4f6;
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #b91c1c;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.cancel-button {
		padding: 0.5rem 1rem;
		background-color: #f3f4f6;
		color: #4b5563;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-button {
		padding: 0.5rem 1rem;
		background-color: #2563eb;
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.submit-button:hover:not(:disabled) {
		background-color: #1d4ed8;
	}

	.submit-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		.feedback-buttons {
			flex-direction: column;
			width: 100%;
		}

		.feedback-button {
			justify-content: center;
		}

		.form-actions {
			flex-direction: column;
		}

		.submit-button,
		.cancel-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
