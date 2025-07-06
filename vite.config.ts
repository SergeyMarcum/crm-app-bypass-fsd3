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
    proxy: {
      "/domain-list": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/login": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/logout": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/check-session": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },

      "/all-users-company": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/current-user": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/check-auth": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/edit-user": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },

      "/all-domain-objects": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/parameters": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/all-object-types": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      
      "/object-type-parameters": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/all-cases-of-parameter-non-compliance": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/cases-of-non-compliance": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/edit-parameter": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/add-parameter-non-compliance": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/delete-parameter-non-compliance": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
      "/add-new-object": {
        target: "http://192.168.0.184:82",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});