import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "helpers/wagmi";
import App from "./App";
import "./index.css";

/**
 * Step 9 of the phase-2 plan, done: MoralisProvider is gone and there is no
 * Moralis in the tree at all.
 *
 * It was removed for what it pulled in rather than for what it did. `moralis` +
 * `react-moralis` drag `ethers@5.6.0`, and with it `elliptic` and `crypto-js@4.1.1`
 * — six critical advisories in the production bundle of an app that asks people to
 * connect a wallet. `elliptic`'s vulnerable range is `*`, so no version pin fixed
 * it; dropping the dependency was the only thing that did. wagmi/viem sign with
 * `@noble/curves`.
 *
 * `isServerInfo` went with it. Nothing reads a Moralis server any more, so the
 * question "are Moralis credentials configured?" has no meaning — every remaining
 * data path is wagmi/viem for chain reads and Alchemy for indexed views, each of
 * which reports its own configuration state (see `helpers/alchemy.js`,
 * `components/DataNotice.jsx`).
 */
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
