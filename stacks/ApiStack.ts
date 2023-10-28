import { Api, StackContext, use } from "sst/constructs";

export function ApiStack({ stack }: StackContext) {

    // Create the API
    const api = new Api(stack, "Api", {
        routes: {
            "GET /api/health": "packages/functions/src/health.main",
            "GET /api/germany": "packages/functions/src/germany.main",
            "GET /api/germany/cases": "packages/functions/src/germany.cases",
            "GET /api/germany/cases/{days}": "packages/functions/src/germany.cases",
            "GET /api/states/{state}": "packages/functions/src/states.main",
            "GET /api/states/{state}/cases": "packages/functions/src/states.cases",
            "GET /api/states/{state}/cases/{days}": "packages/functions/src/states.cases",
            "GET /test/{name}": "packages/functions/src/test.main",
        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    // Return the API resource
    return {
        api,
    };
}