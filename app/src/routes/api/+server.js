// This prevents SvelteKit from trying to prerender API routes
export const prerender = false;

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
	return new Response(JSON.stringify({ message: 'API is working' }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
