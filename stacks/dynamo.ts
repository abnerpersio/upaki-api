/// <reference path="../.sst/platform/config.d.ts" />

export const table = new sst.aws.Dynamo("upaki-table", {
  fields: {
    fileKey: "string",
  },
  primaryIndex: { hashKey: "fileKey" },
  transform: {
    table: {
      name: "upaki-table",
      billingMode: "PAY_PER_REQUEST",
    },
  },
  ttl: "expireAt",
});
