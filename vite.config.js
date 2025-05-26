import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    include: ["**/*.test.js*"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
