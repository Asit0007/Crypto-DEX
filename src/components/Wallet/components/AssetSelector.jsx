import { useERC20Balance } from "hooks/useERC20Balance";
import { getNetworkConfig } from "helpers/wagmi";
import { Image, Select } from "antd";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance, useChainId } from "wagmi";

export const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export default function AssetSelector({ setAsset, style }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { assets } = useERC20Balance();
  const { data: nativeBalance } = useBalance({ address });

  // Native comes from the RPC and is always available; the ERC-20 list is
  // still on the sunset Moralis read layer, so treat it as optional rather
  // than gating the whole selector on it (CLAUDE.md phase-2 step 5).
  const fullBalance = useMemo(() => {
    if (!nativeBalance) return null;
    return [
      {
        balance: nativeBalance.value.toString(),
        decimals: nativeBalance.decimals,
        name: getNetworkConfig(chainId)?.currencyName || nativeBalance.symbol,
        symbol: nativeBalance.symbol,
        token_address: NATIVE_ADDRESS,
      },
      ...(assets ?? []),
    ];
  }, [assets, nativeBalance, chainId]);

  function handleChange(value) {
    setAsset(fullBalance?.find((token) => token.token_address === value));
  }

  return (
    <Select onChange={handleChange} size="large" style={style}>
      {fullBalance &&
        fullBalance.map((item) => {
          return (
            <Select.Option
              value={item["token_address"]}
              key={item["token_address"]}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: "8px",
                }}
              >
                <Image
                  src={
                    item.logo ||
                    "https://etherscan.io/images/main/empty-token.png"
                  }
                  alt="nologo"
                  width="24px"
                  height="24px"
                  preview={false}
                  style={{ borderRadius: "15px" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "90%",
                  }}
                >
                  <p>{item.symbol}</p>
                  <p style={{ alignSelf: "right" }}>
                    (
                    {parseFloat(
                      formatUnits(BigInt(item.balance), item.decimals),
                    ).toFixed(6)}
                    )
                  </p>
                </div>
              </div>
            </Select.Option>
          );
        })}
    </Select>
  );
}
