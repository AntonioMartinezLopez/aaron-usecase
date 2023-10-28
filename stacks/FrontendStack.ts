import { StackContext, StaticSite, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";

export function FrontendStack({ stack, app }: StackContext) {
    const { api } = use(ApiStack);

    // Define React app
    const site = new StaticSite(stack, "ReactSite", {
        path: "packages/frontend",
        buildCommand: "pnpm run build",
        buildOutput: "dist",
        // Pass in environment variables
        environment: {
            VITE_API_URL: api.url,
            VITE_REGION: app.region,
        },
    });

    // Show the url in the output
    stack.addOutputs({
        SiteUrl: site.url,
    });
}