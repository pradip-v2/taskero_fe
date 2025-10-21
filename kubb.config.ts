import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
  root: ".",
  input: {
    path: "./api_schema.yaml",
  },
  output: {
    path: "./src/api",
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginReactQuery({
      output: {
        path: "./hooks",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Hooks`,
      },
      client: {
        importPath: "@/api/client.ts",
      },
      mutation: {
        methods: ["post", "put", "delete", "patch"],
      },
      query: {
        methods: ["get"],
        importPath: "@tanstack/react-query",
      },
      suspense: {},
    }),
  ],
});
