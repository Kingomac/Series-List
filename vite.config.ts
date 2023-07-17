import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { isDebug } from "./app.config";

export default defineConfig({
  base: "./",
  root: "./",
  build: {
    outDir: "./dist",
    minify: "terser",
    target: "esnext",
    cssCodeSplit: true,
  },
  plugins: [],
});
