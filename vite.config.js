import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyLibFiles } from "@builder.io/partytown/utils";

const rootDir = dirname(fileURLToPath(import.meta.url));

await copyLibFiles(resolve(rootDir, "public/~partytown"));

export default defineConfig({
  plugins: [react()],
  base: "/",
});
