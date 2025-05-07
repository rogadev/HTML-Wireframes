<script lang="ts">
	import { onMount } from 'svelte';
	import type { ArticleSection } from '$lib/types/article';

	export let sections: ArticleSection[];

	let isOpen = false;
	let activeSection = sections[0]?.id;
	let observer: IntersectionObserver;
	let closeOnNavigation = false; // Default to keeping TOC open after navigation

	const toggleTOC = () => {
		isOpen = !isOpen;
	};

	const toggleCloseOnNavigation = () => {
		closeOnNavigation = !closeOnNavigation;
		// Save preference to localStorage
		try {
			localStorage.setItem('tocCloseOnNavigation', JSON.stringify(closeOnNavigation));
		} catch (e) {
			// Ignore localStorage errors
		}
	};

	onMount(() => {
		// Load preference from localStorage
		try {
			const savedPref = localStorage.getItem('tocCloseOnNavigation');
			if (savedPref) {
				closeOnNavigation = JSON.parse(savedPref);
			}
		} catch (e) {
			// Ignore localStorage errors
		}

		// Set up intersection observer to highlight the current section in TOC
		// We use rootMargin to detect sections slightly before they reach the top
		// and use higher threshold to better detect which section is most visible
		const options = {
			root: null,
			rootMargin: '-80px 0px -70% 0px', // Top offset for header, bottom offset to prefer sections near the top
			threshold: [0.1, 0.2, 0.3] // Multiple thresholds to better determine visibility
		};

		let visibleSections = new Map(); // Track sections and their visibility ratio

		observer = new IntersectionObserver((entries) => {
			// Update the visibility of each section
			entries.forEach((entry) => {
				const id = entry.target.id;

				if (entry.isIntersecting) {
					visibleSections.set(id, entry.intersectionRatio);
				} else {
					visibleSections.delete(id);
				}
			});

			// If there are visible sections, highlight the one with highest visibility ratio
			if (visibleSections.size > 0) {
				const sortedSections = [...visibleSections.entries()].sort((a, b) => b[1] - a[1]);
				activeSection = sortedSections[0][0]; // Most visible section
			} else if (entries.length > 0) {
				// If no sections are visible and we're at the top of the page, highlight first section
				if (window.scrollY < 200) {
					activeSection = sections[0]?.id;
				}
				// If we're at the bottom, highlight last section
				else if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
					activeSection = sections[sections.length - 1]?.id;
				}
			}
		}, options);

		// Observe all section elements
		sections.forEach((section) => {
			const element = document.getElementById(section.id);
			if (element) observer.observe(element);
		});

		// Handle scrolling to determine active section
		const handleScroll = () => {
			// If at top of page, highlight first section
			if (window.scrollY < 100) {
				activeSection = sections[0]?.id;
			}
			// If at bottom of page, highlight last section
			else if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
				activeSection = sections[sections.length - 1]?.id;
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			// Clean up observer and event listeners
			sections.forEach((section) => {
				const element = document.getElementById(section.id);
				if (element) observer.unobserve(element);
			});
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Scroll to section when clicking on TOC item
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			// Set active section immediately for better user feedback
			activeSection = id;

			// Close TOC if preference is set
			if (closeOnNavigation) {
				isOpen = false;
			}
		}
	};
</script>

<div class="toc-container" class:open={isOpen}>
	<div
		class="toc-toggle-btn"
		on:click={toggleTOC}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && toggleTOC()}
	>
		<i class="fas fa-chevron-{isOpen ? 'right' : 'left'}"></i>
		<span class="sr-only">{isOpen ? 'Close' : 'Open'} table of contents</span>
	</div>

	<div class="floating-toc">
		<div class="floating-toc-header">
			<span>On this page</span>
			<button class="close-toc-btn" on:click={toggleTOC} aria-label="Close table of contents">
				<i class="fas fa-times"></i>
			</button>
		</div>

		<ul class="floating-toc-list">
			{#each sections as section}
				<li>
					<a
						href={`#${section.id}`}
						class:active={activeSection === section.id}
						on:click|preventDefault={() => scrollToSection(section.id)}
					>
						{section.title}
					</a>
				</li>
			{/each}
		</ul>

		<div class="toc-settings">
			<label class="toc-setting-toggle">
				<input type="checkbox" checked={closeOnNavigation} on:change={toggleCloseOnNavigation} />
				<span class="setting-label">Close after navigation</span>
			</label>
		</div>
	</div>
</div>

<style>
	.toc-container {
		position: fixed;
		right: 0;
		top: 25%;
		z-index: 100;
		transition: transform 0.3s ease;
	}

	.toc-toggle-btn {
		position: absolute;
		left: -30px;
		top: 50px;
		background-color: #2563eb;
		color: white;
		width: 30px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px 0 0 4px;
		cursor: pointer;
		box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
		border: none;
		transition: background-color 0.2s ease;
	}

	.toc-toggle-btn:hover {
		background-color: #1d4ed8;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.floating-toc {
		width: 280px;
		background-color: #fff;
		box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 4px 0 0 4px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
	}

	.floating-toc-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #e5e7eb;
		font-weight: 600;
		color: #1f2937;
	}

	.close-toc-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		color: #4b5563;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-toc-btn:hover {
		color: #1f2937;
	}

	.floating-toc-list {
		list-style: none;
		padding: 0.75rem 0;
		margin: 0;
		overflow-y: auto;
		flex-grow: 1;
	}

	.floating-toc-list li {
		padding: 0;
		margin: 0;
	}

	.floating-toc-list a {
		display: block;
		padding: 0.5rem 1rem 0.5rem 1.5rem;
		color: #4b5563;
		text-decoration: none;
		font-size: 0.875rem;
		border-left: 2px solid transparent;
		transition:
			background-color 0.1s ease,
			color 0.1s ease,
			border-color 0.1s ease;
	}

	.floating-toc-list a:hover {
		background-color: #f9fafb;
		color: #2563eb;
	}

	.floating-toc-list a.active {
		color: #2563eb;
		border-left-color: #2563eb;
		background-color: #eff6ff;
		font-weight: 500;
	}

	.toc-settings {
		padding: 0.75rem 1rem;
		border-top: 1px solid #e5e7eb;
		font-size: 0.875rem;
		color: #4b5563;
	}

	.toc-setting-toggle {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.toc-setting-toggle input {
		margin-right: 0.5rem;
	}

	.setting-label {
		font-size: 0.875rem;
		user-select: none;
	}

	/* Handle the slide in/out animation */
	.toc-container {
		transform: translateX(280px);
	}

	.toc-container.open {
		transform: translateX(0);
	}

	@media (max-width: 768px) {
		.floating-toc {
			width: 250px;
		}

		.toc-container {
			transform: translateX(250px);
		}
	}
</style>
