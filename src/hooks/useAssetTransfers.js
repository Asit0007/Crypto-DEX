import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";
import { alchemyRpc, isAlchemySupported } from "helpers/alchemy";

/**
 * Transfer history for the connected wallet, in one shared hook because the
 * ERC-20 and native views differ only by Alchemy's `category`.
 *
 * Alchemy cannot OR `fromAddress` with `toAddress` in a single query, so
 * outgoing and incoming are two calls merged newest-first here.
 *
 * `value` comes back already decimalised as a JS number — the raw wei sits in
 * `rawContract.value` if precision ever matters.
 */
export const useAssetTransfers = (categories, { maxCount = 100 } = {}) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const supported = isAlchemySupported(chainId);
  const categoryKey = categories.join(",");

  const { data, isLoading, error } = useQuery({
    queryKey: ["assetTransfers", chainId, address, categoryKey, maxCount],
    enabled: Boolean(address) && supported,
    staleTime: 30_000,
    queryFn: async () => {
      const base = {
        fromBlock: "0x0",
        toBlock: "latest",
        category: categories,
        order: "desc",
        maxCount: `0x${maxCount.toString(16)}`,
        excludeZeroValue: false,
      };

      const [sent, received] = await Promise.all([
        alchemyRpc(chainId, "alchemy_getAssetTransfers", [
          { ...base, fromAddress: address },
        ]),
        alchemyRpc(chainId, "alchemy_getAssetTransfers", [
          { ...base, toAddress: address },
        ]),
      ]);

      return [...(sent?.transfers ?? []), ...(received?.transfers ?? [])]
        .sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16))
        .slice(0, maxCount)
        .map((transfer) => ({
          address: transfer.rawContract?.address ?? null,
          from_address: transfer.from,
          to_address: transfer.to,
          value: transfer.value,
          asset: transfer.asset,
          transaction_hash: transfer.hash,
          block_number: parseInt(transfer.blockNum, 16),
        }));
    },
  });

  return {
    transfers: data,
    isLoading,
    error,
    chainId,
    isSupported: supported,
  };
};
