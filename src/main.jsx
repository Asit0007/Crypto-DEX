import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MoralisProvider } from "react-moralis";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "helpers/wagmi";
import App from "./App";
import "./index.css";

/** Moralis server credentials — see .env.example. */
const APP_ID = import.meta.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = import.meta.env.REACT_APP_MORALIS_SERVER_URL;
const isServerInfo = Boolean(APP_ID && SERVER_URL);

const queryClient = new QueryClient();

/**
 * Moralis v1 servers are sunset, so the provider is mounted in its
 * non-initialized mode when credentials are absent. That keeps the context
 * alive for the read hooks still awaiting migration without attempting a
 * connection — and, unlike before, lets the rest of the app render. The whole
 * provider goes away in step 9 of the phase-2 plan.
 */
const WithMoralis = ({ children }) =>
  isServerInfo ? (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      {children}
    </MoralisProvider>
  ) : (
    <MoralisProvider initializeOnMount={false}>{children}</MoralisProvider>
  );

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WithMoralis>
          <App isServerInfo={isServerInfo} />
        </WithMoralis>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
