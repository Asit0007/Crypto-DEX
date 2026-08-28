import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";
import { alchemyRpc, isAlchemySupported } from "helpers/alchemy";

/**
 * Every ERC-20 the connected wallet holds on the active chain.
 *
 * Needs an indexer: no RPC method enumerates a wallet's token holdings, you
 * can only ask a token you already know about for its balance. Alchemy's
 * `alchemy_getTokenBalances` does the enumeration; metadata is a second call
 * per token, which is why zero balances are filtered out first.
 */
export const useERC20Balance = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const supported = isAlchemySupported(chainId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["erc20Balances", chainId, address],
    enabled: Boolean(address) && supported,
    staleTime: 30_000,
    queryFn: async () => {
      const result = await alchemyRpc(chainId, "alchemy_getTokenBalances", [
        address,
        "erc20",
      ]);

      const held = (result?.tokenBalances ?? []).filter(
        (token) => !token.error && BigInt(token.tokenBalance ?? 0) > 0n,
      );

      return Promise.all(
        held.map(async (token) => {
          const meta = await alchemyRpc(chainId, "alchemy_getTokenMetadata", [
            token.contractAddress,
          ]);
          return {
            token_address: token.contractAddress,
            balance: BigInt(token.tokenBalance).toString(),
            decimals: meta?.decimals ?? 18,
            name: meta?.name ?? "Unknown token",
            symbol: meta?.symbol ?? "?",
            logo: meta?.logo ?? null,
          };
        }),
      );
    },
  });

  return { assets: data, isLoading, error, isSupported: supported };
};
