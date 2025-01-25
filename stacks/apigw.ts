/// <reference path="../.sst/platform/config.d.ts" />

import { appConfig } from "./config";
import { table } from "./dynamo";
import { bucket } from "./s3";
import { lambda } from "./utils/lambda";

const apigw = new sst.aws.ApiGatewayV2(`${appConfig.name}-api`, {
  cors: true,
  accessLog: {
    retention: "1 day",
  },
  transform: {
    api: {
      name: `${appConfig.name}-api`,
    },
  },
});

const environment = {
  BUCKET_NAME: bucket.name,
  TABLE_NAME: table.name,
};

apigw.route(
  "POST /prepare-upload",
  lambda({
    handler: "src/infra/functions/prepare-upload.handler",
    environment,
    timeout: "10 seconds",
    permissions: [
      {
        actions: ["s3:PutObject"],
        effect: "allow",
        resources: [bucket.arn.apply((name) => `${name}/uploads/*`)],
      },
      {
        actions: ["dynamodb:PutItem"],
        effect: "allow",
        resources: [table.arn],
      },
    ],
  })
);

export { apigw };
