import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Autorise l'import de ../design-system/tokens.css (source unique des tokens)
    fs: { allow: [".."] },
  },
  css: {
    modules: {
      // Button.module.css → classes lisibles en dev : Button_primary__x1y2
      generateScopedName: "[name]_[local]__[hash:base64:4]",
    },
  },
  test: {
    environment: "jsdom",
  },
});
