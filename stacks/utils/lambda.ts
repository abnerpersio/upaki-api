type Args = Omit<
  sst.aws.FunctionArgs,
  "architecture" | "nodejs" | "runtime" | "logging"
>;

export function lambda(args: Args): sst.aws.FunctionArgs {
  return {
    architecture: "arm64",
    memory: "128 MB",
    runtime: "nodejs22.x",
    nodejs: {
      esbuild: {
        bundle: true,
        minify: true,
        sourcemap: false,
        external: ["@aws-sdk/*"],
      },
    },
    logging: {
      retention: "1 week",
    },
    ...args,
  };
}
