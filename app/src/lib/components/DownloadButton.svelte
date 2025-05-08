<script lang="ts">
	export let articleId: string;
	export let lastUpdated: string;
	export let fileName: string = `${articleId}.pdf`;

	// Construct the download URL with the watermark parameters
	$: downloadUrl = `/api/download?file=${encodeURIComponent(fileName)}&lastUpdated=${encodeURIComponent(lastUpdated)}`;
</script>

<a
	href={downloadUrl}
	class="download-button"
	target="_blank"
	rel="noopener noreferrer"
	aria-label="Download as PDF"
>
	<i class="fas fa-file-pdf"></i>
	<span>Download PDF</span>
</a>

<style>
	.download-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #4b286d;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-weight: 500;
		text-decoration: none;
		transition: background-color 0.2s ease;
	}

	.download-button:hover {
		background-color: #3a1f54;
	}

	.download-button i {
		font-size: 1.1rem;
	}
</style>
