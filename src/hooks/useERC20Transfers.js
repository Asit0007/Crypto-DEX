import { useAssetTransfers } from "./useAssetTransfers";

export const useERC20Transfers = () => {
  const { transfers, ...rest } = useAssetTransfers(["erc20"]);
  return { ERC20Transfers: transfers, ...rest };
};
