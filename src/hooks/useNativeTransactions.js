import { useAssetTransfers } from "./useAssetTransfers";

const useNativeTransactions = () => {
  const { transfers, ...rest } = useAssetTransfers(["external"]);
  return { nativeTransactions: transfers, ...rest };
};

export default useNativeTransactions;
