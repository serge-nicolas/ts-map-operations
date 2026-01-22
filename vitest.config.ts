import { defineConfig } from "vitest/config";
import path from "path";

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
      "@": path.resolve(__dirname, "./"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@tests": path.resolve(__dirname, "./tests"),
    },
  },
});
