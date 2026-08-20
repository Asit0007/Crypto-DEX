import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { notification } from "antd";

const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const notify = (type, message, description) =>
  notification[type]({ message, description, placement: "bottomRight" });

const useInchDex = (chain) => {
  const { Moralis, account } = useMoralis();
  const [tokenList, setTokenlist] = useState();

  useEffect(() => {
    if (!Moralis?.Plugins?.oneInch) return;
    Moralis.Plugins.oneInch
      .getSupportedTokens({ chain })
      .then((tokens) => setTokenlist(tokens.tokens))
      .catch(() => setTokenlist({}));
  }, [Moralis, Moralis.Plugins, chain]);

  const getQuote = (params) =>
    Moralis.Plugins.oneInch.quote({
      chain: params.chain,
      fromTokenAddress: params.fromToken.address,
      toTokenAddress: params.toToken.address,
      amount: Moralis.Units.Token(
        params.fromAmount,
        params.fromToken.decimals,
      ).toString(),
    });

  async function trySwap(params, slippage = 1) {
    const { fromToken, toToken, fromAmount, chain } = params;
    const amount = Moralis.Units.Token(
      fromAmount,
      fromToken.decimals,
    ).toString();
    try {
      if (fromToken.address !== NATIVE_ADDRESS) {
        const allowance = await Moralis.Plugins.oneInch.hasAllowance({
          chain,
          fromTokenAddress: fromToken.address,
          fromAddress: account,
          amount,
        });
        if (!allowance) {
          // Bounded approval: only the amount being swapped, never unlimited.
          await Moralis.Plugins.oneInch.approve({
            chain,
            tokenAddress: fromToken.address,
            fromAddress: account,
            amount,
          });
          notify(
            "success",
            "Approval granted",
            `Approved ${fromAmount} ${fromToken.symbol} for swapping.`,
          );
        }
      }
      const receipt = await doSwap(params, slippage);
      if (receipt?.error || receipt?.statusCode >= 400)
        throw new Error(receipt?.message || "Swap failed");
      notify(
        "success",
        "Swap complete",
        `Swapped ${fromAmount} ${fromToken.symbol} for ${toToken.symbol}.`,
      );
      return receipt;
    } catch (e) {
      notify("error", "Swap failed", e.message);
    }
  }

  function doSwap(params, slippage) {
    return Moralis.Plugins.oneInch.swap({
      chain: params.chain,
      fromTokenAddress: params.fromToken.address,
      toTokenAddress: params.toToken.address,
      amount: Moralis.Units.Token(
        params.fromAmount,
        params.fromToken.decimals,
      ).toString(),
      fromAddress: account,
      slippage,
    });
  }

  return { getQuote, trySwap, tokenList };
};

export default useInchDex;
