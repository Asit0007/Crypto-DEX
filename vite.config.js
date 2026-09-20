import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath, URL } from "node:url";

// Deployed on Vercel from the domain root; SPA rewrites live in vercel.json.
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    // Was added because moralis v1 / ethers 5 expected node globals in the browser
    // bundle. Moralis is gone, and wagmi/viem are pure ESM that need none of this,
    // so this plugin is probably removable now — but some WalletConnect builds
    // still reach for Buffer at runtime, which a passing `vite build` would not
    // catch. Left in place until someone removes it and actually connects a
    // wallet through WalletConnect in a browser to confirm.
    //
    // It is not a security exposure in the meantime: the plugin pulls
    // crypto-browserify -> elliptic (critical, range `*`) into the *dev* tree, but
    // nothing imports node crypto any more, so none of it is bundled. Verify with
    // `npm run build && grep -c crypto-browserify dist/assets/*.js` (expect 0) and
    // `npm audit --omit=dev` (expect 0 vulnerabilities).
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
