import { useAccount, useBalance } from "wagmi";

/**
 * The connected wallet's native-coin balance on the active chain.
 *
 * Reads straight from the chain's RPC via wagmi — no indexer and no API key,
 * which is why this was the first read hook migrated off Moralis.
 */
function NativeBalance({ className = "" }) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected || !balance) return null;

  return (
    <div
      className={`whitespace-nowrap text-sm font-semibold text-fg-muted ${className}`}
    >
      {`${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`}
    </div>
  );
}

export default NativeBalance;
