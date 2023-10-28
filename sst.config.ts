import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(_input) {
    return {
      name: "aaron-usecase",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(ApiStack).stack(FrontendStack);
    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  }
} satisfies SSTConfig;
