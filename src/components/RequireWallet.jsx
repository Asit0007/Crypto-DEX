import { useMoralis } from "react-moralis";

/**
 * Data views need a connected wallet. Without this guard they render an
 * endless skeleton, because the underlying hooks never resolve.
 */
function RequireWallet({ title, children }) {
  const { isAuthenticated, account } = useMoralis();

  if (isAuthenticated && account) return children;

  return (
    <div className="w-full max-w-5xl px-1 py-2">
      {title && <h1 className="mb-4 text-2xl font-bold text-fg">{title}</h1>}
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-border bg-ink-raised px-6 py-16 text-center">
        <span className="text-4xl" aria-hidden="true">
          👛
        </span>
        <p className="mb-0 text-lg font-semibold text-fg">
          Connect your wallet
        </p>
        <p className="mb-0 max-w-sm text-fg-muted">
          Use the Connect Wallet button in the top right to see your on-chain
          data here.
        </p>
      </div>
    </div>
  );
}

export default RequireWallet;
