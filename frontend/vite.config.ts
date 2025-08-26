import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: "https://api-ui-neon.vercel.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
