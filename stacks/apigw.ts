/// <reference path="../.sst/platform/config.d.ts" />

import { appConfig } from "./config";
import { bucket } from "./s3";
import { lambda } from "./utils/lambda";

const apigw = new sst.aws.ApiGatewayV2(`${appConfig.name}-api`, {
  cors: true,
  accessLog: {
    retention: "1 day",
  },
});

const environment = {
  BUCKET_NAME: bucket.name,
};

apigw.route(
  "POST /prepare-upload",
  lambda({ handler: "src/infra/functions/prepare-upload.handler", environment })
);

export { apigw };
