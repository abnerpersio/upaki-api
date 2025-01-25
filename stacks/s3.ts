/// <reference path="../.sst/platform/config.d.ts" />

const name = "upaki-2s8zcbflakdmghmkpet7go3htq4";

const bucket = new sst.aws.Bucket(name, {
  cors: {
    allowOrigins: ["http://localhost:5173"],
    allowHeaders: ["*"],
    allowMethods: ["PUT"],
  },
  transform: {
    bucket: {
      bucket: name,
    },
  },
});

export { bucket };
