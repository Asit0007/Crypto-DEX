import { useMoralis, useNativeBalance } from "react-moralis";

function NativeBalance({ className = "", ...props }) {
  const { data: balance } = useNativeBalance(props);
  const { account, isAuthenticated } = useMoralis();

  if (!account || !isAuthenticated || !balance?.formatted) return null;

  return (
    <div
      className={`whitespace-nowrap text-sm font-semibold text-fg-muted ${className}`}
    >
      {balance.formatted}
    </div>
  );
}

export default NativeBalance;
