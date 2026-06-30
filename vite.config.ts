// ClearWater Ireland — Vercel deploy config (TanStack Start + Nitro)
// Replaces Lovable's Cloudflare-targeted wrapper (@lovable.dev/vite-tanstack-config).
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths(),   // resolves the "@/..." path alias from tsconfig.json
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: "vercel" }),   // compiles the server for Vercel Functions
    viteReact(),
  ],
});
