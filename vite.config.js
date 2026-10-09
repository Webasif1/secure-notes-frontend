import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // keep libraries in their own cached files
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["motion/react"],
        },
      },
    },
  },
  server: {
    // in development "/api" requests go to the backend
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
