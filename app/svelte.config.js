import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use adapter-vercel for Vercel deployment
		adapter: adapter(),
		// Set the base path to match your repository name (if needed)
		// Important: Remove or update this when deploying to a custom domain
		paths: {
			base: process.env.BASE_PATH || ''
		},
		// Handle prerender errors
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Skip API routes during prerendering
				if (path.startsWith('/api/')) {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
