import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";
import { alchemyNft, isAlchemySupported } from "helpers/alchemy";

/**
 * NFTs owned by the connected wallet.
 *
 * Alchemy's NFT API resolves metadata and caches media server-side, which is
 * why the old `useVerifyMetadata` / `useIPFS` dance (lazy token_uri fetches,
 * ipfs:// rewriting, OpenSea throttle retries) is gone — `image.cachedUrl` is
 * already an HTTP URL.
 */
export const useNFTBalances = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const supported = isAlchemySupported(chainId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["nftBalances", chainId, address],
    enabled: Boolean(address) && supported,
    staleTime: 60_000,
    queryFn: async () => {
      const result = await alchemyNft(chainId, "getNFTsForOwner", {
        owner: address,
        withMetadata: "true",
        pageSize: "100",
      });

      return (result?.ownedNfts ?? []).map((nft) => ({
        token_address: nft.contract?.address,
        token_id: nft.tokenId,
        contract_type: nft.contract?.tokenType, // "ERC721" | "ERC1155"
        name: nft.name || nft.contract?.name || "Untitled",
        image: nft.image?.cachedUrl || nft.image?.originalUrl || null,
        amount: nft.balance ?? "1",
      }));
    },
  });

  return { NFTBalances: data, isLoading, error, isSupported: supported };
};
