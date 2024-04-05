/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const authUrls = {
	"mojang": "https://sessionserver.mojang.com/session/minecraft/hasJoined",
	"minehut": "https://api.minehut.com/mitm/proxy/session/minecraft/hasJoined"
};

export default {

	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const pathname = url.pathname;

		if (!pathname.startsWith("/session/minecraft/hasJoined/")) return new Response(null, {status: 404});

		const splitPath = pathname.split("/");

		for (const authProvider in authUrls) {
			if (!splitPath.includes(authProvider)) continue;
			// @ts-ignore - authProvider is of type string and not any
			const authUrl = authUrls[authProvider];
			const modifiedUrl = authUrl + url.search;

			const modifiedRequest = new Request(modifiedUrl);
			const response = await fetch(modifiedRequest);

			if (response.status != 200) continue;

			return response;
		}

		return new Response(null, {status: 204});
	}
};
