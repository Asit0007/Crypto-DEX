import { createConfig, http, injected } from "wagmi";
import {
  mainnet,
  bsc,
  bscTestnet,
  polygon,
  sepolia,
  avalanche,
  localhost,
} from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";
import { networkConfigs } from "helpers/networks";

/**
 * Chains the app supports, in menu order: the three swap-capable mainnets
 * first, then testnets and the Truffle devchain.
 *
 * `helpers/networks.js` stays the single source of truth for RPC and explorer
 * URLs (see CLAUDE.md §4.5) — viem supplies the canonical chain definition and
 * we override the transport with our own RPC below.
 */
export const chains = [
  mainnet,
  bsc,
  polygon,
  sepolia,
  bscTestnet,
  avalanche,
  localhost,
];

/** Decimal chain id -> the "0x…" key used throughout networks.js. */
export const toHexChainId = (chainId) =>
  typeof chainId === "number" ? `0x${chainId.toString(16)}` : chainId;

/** Look up a networks.js entry by wagmi's decimal chain id. */
export const getNetworkConfig = (chainId) =>
  networkConfigs[toHexChainId(chainId)];

// Point every chain at the RPC declared in networks.js, falling back to the
// chain's own public RPC when we haven't specified one.
const transports = Object.fromEntries(
  chains.map((chain) => {
    const rpcUrl = getNetworkConfig(chain.id)?.rpcUrl;
    return [chain.id, rpcUrl ? http(rpcUrl) : http()];
  }),
);

// Browser-safe by design: WalletConnect project ids are public identifiers.
// Absent one, the app quietly degrades to injected-only rather than failing.
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected(),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
          metadata: {
            name: "Crypto-DEX",
            description: "Multi-chain DEX aggregator and wallet dashboard",
            url: "https://crypto-dex.vercel.app",
            icons: [],
          },
        }),
      ]
    : []),
];

export const hasWalletConnect = Boolean(walletConnectProjectId);

// wagmi persists the last connection and reconnects on mount by itself, which
// replaces the old localStorage "connectorId" dance in App.jsx.
export const wagmiConfig = createConfig({
  chains,
  connectors,
  transports,
});
