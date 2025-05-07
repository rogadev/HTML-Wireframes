import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use adapter-static for GitHub Pages deployment
		adapter: adapter({
			// Default options are shown
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false
		}),
		// Set the base path to match your repository name (if needed)
		// Important: Remove or update this when deploying to a custom domain
		paths: {
			base: process.env.BASE_PATH || ''
		}
	}
};

export default config;
