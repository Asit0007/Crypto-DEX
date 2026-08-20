import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath, URL } from "node:url";

// GitHub Pages serves the site from https://asit0007.github.io/Crypto-DEX/
export default defineConfig({
  base: "/Crypto-DEX/",
  plugins: [
    react(),
    // moralis v1 / web3 libs expect node globals in the browser bundle
    nodePolyfills({ globals: { Buffer: true, global: true, process: true } }),
  ],
  // REACT_APP_ kept so the existing .env files keep working post-CRA
  envPrefix: ["VITE_", "REACT_APP_"],
  resolve: {
    alias: {
      components: fileURLToPath(new URL("./src/components", import.meta.url)),
      helpers: fileURLToPath(new URL("./src/helpers", import.meta.url)),
      hooks: fileURLToPath(new URL("./src/hooks", import.meta.url)),
      contracts: fileURLToPath(new URL("./src/contracts", import.meta.url)),
      uikit: fileURLToPath(new URL("./src/uikit", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          // isolate moralis so it caches independently; antd can't be split
          // out without circular chunks (its rc-* deps import back into it)
          if (/node_modules\/(moralis|react-moralis)\//.test(id))
            return "moralis";
          return "vendor";
        },
      },
    },
  },
});
