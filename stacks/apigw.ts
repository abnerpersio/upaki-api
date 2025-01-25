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

// const uploadFileLink = new sst.Linkable("BucketUpload", {
//   properties: {
//     bucket,
//   },
//   include: [
//     sst.aws.permission({
//       actions: ["s3:PutObject"],
//       effect: "allow",
//       resources: [bucket.arn.apply((name) => `${name}/uploads/*`)],
//     }),
//   ],
// });

apigw.route(
  "POST /prepare-upload",
  lambda({
    handler: "src/infra/functions/prepare-upload.handler",
    environment,
    permissions: [
      {
        actions: ["s3:PutObject"],
        effect: "allow",
        resources: [bucket.arn.apply((name) => `${name}/uploads/*`)],
      },
    ],
  })
);

export { apigw };
