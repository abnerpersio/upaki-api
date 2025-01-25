/// <reference path="../.sst/platform/config.d.ts" />

const bucket = new sst.aws.Bucket("upaki-2ryudRo16thowOd3R", {
  cors: {
    allowOrigins: ["http://localhost:5173"],
    allowHeaders: ["*"],
    allowMethods: ["PUT"],
  },
});

export { bucket };
