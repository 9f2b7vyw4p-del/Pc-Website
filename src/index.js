let pcState = {
    status: "sleeping",
    updated: Date.now()
};

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        /*
         * API
         */

        if (url.pathname === "/api/pc/status" && request.method === "GET") {
            if (
                pcState.status === "waking" &&
                Date.now() - pcState.updated >= 5000
            ) {
                pcState = {
                    status: "online",
                    updated: Date.now()
                };
            }

            return Response.json({
                status: pcState.status
            });
        }

        if (url.pathname === "/api/pc/wake" && request.method === "POST") {
            if (pcState.status === "online") {
                return Response.json({
                    status: "online",
                    message: "PC is already online."
                });
            }

            pcState = {
                status: "waking",
                updated: Date.now()
            };

            return Response.json({
                status: "waking",
                message: "Wake request accepted."
            });
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
