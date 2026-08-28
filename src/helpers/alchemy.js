/**
 * Alchemy read layer — the replacement for Moralis' Web3 API.
 *
 * Why Alchemy at all: enumerating "every ERC-20 this wallet holds", "its
 * transfer history", or "its NFTs" cannot be answered by a plain RPC node.
 * Those need an index. Everything the app can answer without one (native
 * balance, ENS, contract reads/writes, event watching) goes through wagmi's
 * own transports instead — see the phase-2 addendum in claude.md.
 *
 * Why raw fetch rather than `alchemy-sdk`: these are three JSON-RPC methods
 * and one REST call. The SDK would add a sizeable dependency to a vendor
 * chunk that is already ~3.2 MB.
 *
 * The key is `VITE_`-prefixed, so it ships in the browser bundle. That is
 * deliberate but conditional: **set a domain allowlist on the Alchemy app**,
 * which is the only thing preventing someone from lifting the key out of the
 * bundle and spending your quota. Keys without a referrer restriction (1inch,
 * 0x) must never be `VITE_`-prefixed — they belong in a Vercel function.
 */

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

/** Alchemy subdomains, keyed by wagmi's decimal chain id. */
const ALCHEMY_NETWORKS = {
  1: "eth-mainnet",
  137: "polygon-mainnet",
  11155111: "eth-sepolia",
  // Note: Alchemy has no BNB Chain support for the enhanced APIs these hooks
  // use, so chains 56/97 intentionally have no entry and degrade to empty.
};

export const hasAlchemyKey = Boolean(apiKey);

/** True when this chain can serve indexed reads. */
export const isAlchemySupported = (chainId) =>
  hasAlchemyKey && chainId in ALCHEMY_NETWORKS;

const baseUrl = (chainId, path = "v2") => {
  const network = ALCHEMY_NETWORKS[chainId];
  if (!network || !apiKey) return null;
  return `https://${network}.g.alchemy.com/${path}/${apiKey}`;
};

/** A single JSON-RPC call against Alchemy's enhanced API. */
export const alchemyRpc = async (chainId, method, params) => {
  const url = baseUrl(chainId);
  if (!url) return null;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`Alchemy ${method} failed: HTTP ${res.status}`);

  const json = await res.json();
  if (json.error) throw new Error(`Alchemy ${method}: ${json.error.message}`);
  return json.result;
};

/** A GET against Alchemy's NFT REST API, which is not JSON-RPC shaped. */
export const alchemyNft = async (chainId, endpoint, searchParams) => {
  const url = baseUrl(chainId, "nft/v3");
  if (!url) return null;

  const query = new URLSearchParams(searchParams).toString();
  const res = await fetch(`${url}/${endpoint}?${query}`);
  if (!res.ok)
    throw new Error(`Alchemy ${endpoint} failed: HTTP ${res.status}`);
  return res.json();
};
