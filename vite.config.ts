// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  server: {
    proxy: { // This is the correct proxy object.
      '/api': { // Key for the proxy rule.
        target: 'http://192.168.0.185:82', // Your backend server
        changeOrigin: true, // Changes the origin of the host header to the target URL
        rewrite: (path: string) => path.replace(/^\/api/, ''), // Add type annotation for 'path'
        secure: false, // For development with self-signed certs (if applicable)
      },
    },
  },
});