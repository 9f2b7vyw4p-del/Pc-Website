const PC_AGENT_URL = "https://pc-agent.osayona.com";

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "https://osayona.com",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
}

function json(data, status = 200) {
    return Response.json(data, {
        status,
        headers: corsHeaders()
    });
}

async function agentRequest(path, method, env) {
    return fetch(`${PC_AGENT_URL}${path}`, {
        method,
        headers: {
            "CF-Access-Client-Id": env.CF_ACCESS_CLIENT_ID,
            "CF-Access-Client-Secret": env.CF_ACCESS_CLIENT_SECRET
        }
    });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        /*
         * CORS preflight
         */
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders()
            });
        }

        /*
         * PC status
         */
        if (url.pathname === "/api/pc/status" && request.method === "GET") {
            try {
                const response = await agentRequest("/status", "GET", env);
                const data = await response.json();

                return json(data, response.status);
            } catch (error) {
                return json({
                    status: "offline",
                    message: "Unable to contact PC agent."
                }, 502);
            }
        }

        /*
         * Wake PC
         */
        if (url.pathname === "/api/pc/wake" && request.method === "POST") {
            try {
                const response = await agentRequest("/wake", "POST", env);
                const data = await response.json();

                return json(data, response.status);
            } catch (error) {
                return json({
                    status: "offline",
                    message: "Unable to contact PC agent."
                }, 502);
            }
        }

        /*
         * Canonical PC page
         */
        if (url.pathname === "/pc") {
            return Response.redirect(`${url.origin}/pc/`, 301);
        }

        /*
         * Static assets
         */
        return env.ASSETS.fetch(request);
    }
};
