import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "**/*.spec.unit.ts",
      "**/*.spec.unit.tsx",
      "**/*.test.unit.ts",
      "**/*.test.unit.tsx",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "*.config.*",
        "**/*.d.ts",
        "**/*.spec.*",
        "**/*.test.*",
      ],
    },
  },
  resolve: {
    alias: {
      "@lib": "./lib",
      "@tests": "./tests",
    },
  },
});
