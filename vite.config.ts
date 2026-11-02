import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            // "/api": "https://accountingapp.netraverselabs.com",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/": path.resolve(__dirname, "./src/"),
            "@modules": path.resolve(__dirname, "./src/modules"),
        },
    },
});
