import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "aaron-usecase",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(API);
    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
  }
} satisfies SSTConfig;
