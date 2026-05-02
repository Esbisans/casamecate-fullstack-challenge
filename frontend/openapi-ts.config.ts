import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/openapi.json",
  output: {
    path: "lib/api/generated",
    postProcess: [],
  },
  plugins: [
    "@hey-api/typescript",
    "@hey-api/sdk",
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./lib/api/runtime-config.ts",
    },
  ],
});
