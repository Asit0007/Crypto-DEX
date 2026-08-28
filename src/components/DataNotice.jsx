import { hasAlchemyKey } from "helpers/alchemy";

/**
 * Explains why an indexed view is empty, rather than showing a blank table.
 *
 * There are two distinct reasons and they need different fixes, so say which
 * one applies: no key configured at all, or a chain Alchemy's enhanced APIs
 * do not cover (BNB Chain, the local devchain).
 */
function DataNotice({ chainName }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-border bg-ink-raised px-6 py-16 text-center">
      <span className="text-4xl" aria-hidden="true">
        🔌
      </span>
      <p className="mb-0 text-lg font-semibold text-fg">
        {hasAlchemyKey
          ? "Not available on this chain"
          : "No indexer configured"}
      </p>
      <p className="mb-0 max-w-md text-fg-muted">
        {hasAlchemyKey
          ? `Listing tokens, transfers and NFTs needs an indexing provider, and ${
              chainName || "this chain"
            } is not covered by the one configured. Switch to Ethereum, Polygon or Sepolia.`
          : "Listing tokens, transfers and NFTs cannot be done from a plain RPC node. Set VITE_ALCHEMY_API_KEY in your .env to enable these views — everything else in the app works without it."}
      </p>
    </div>
  );
}

export default DataNotice;
