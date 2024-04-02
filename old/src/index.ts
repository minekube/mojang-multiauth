/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
		const url = new URL(request.url);

		if(url.pathname != "/mitm/session/minecraft/hasJoined") return new Response();

		console.log(url.href);


		async function getAuthenticatedUser() {
			const newURLList = ["https://sessionserver.mojang.com/session/minecraft/hasJoined", "https://api.minehut.com/mitm/proxy/session/minecraft/hasJoined"];
			for (const newURL of newURLList) {
				const newRequestURL = newURL + url.search;
				const modifiedRequest = new Request(newRequestURL);
				const response = await fetch(modifiedRequest);
				if(response.status == 204) {
					continue;
				}
				return response;
			}
			//return page with no content
			return new Response(null, {status: 204});
		}

		return getAuthenticatedUser();
	},
};
