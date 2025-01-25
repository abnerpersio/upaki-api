/// <reference path="../.sst/platform/config.d.ts" />

import { table } from "./dynamo";
import { bucket } from "./s3";
import { lambda } from "./utils/lambda";

const environment = {
  TABLE_NAME: table.name,
};

bucket.notify({
  notifications: [
    {
      name: "UploadedFile",
      events: ["s3:ObjectCreated:Put"],
      filterPrefix: "uploads/",
      function: lambda({
        handler: "src/infra/functions/uploaded-file.handler",
        timeout: "10 seconds",
        environment,
        permissions: [
          {
            actions: ["dynamodb:UpdateItem"],
            effect: "allow",
            resources: [table.arn],
          },
        ],
      }),
    },
  ],
});
