import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["truing-multidentate-julio.ngrok-free.dev"],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      },
      '/e-veda-profiles': {
        target: 'http://127.0.0.1:9000', // Port 9000 for MinIO
        changeOrigin: true,
        // No rewrite needed here, MinIO expects the bucket name in the path!
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
