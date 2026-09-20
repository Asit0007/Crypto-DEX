import { notification } from "antd";

/**
 * Swap engine — currently unavailable, deliberately and visibly.
 *
 * This hook used to be a thin wrapper over `Moralis.Plugins.oneInch`, a server-side
 * plugin that ran on a Moralis v1 server. Moralis sunset v1 hosting, so that plugin
 * has had nothing to call for a long time: the swap path in this app was already
 * dead, it just failed at runtime instead of saying so.
 *
 * It was removed rather than left in place because of what it dragged in. `moralis`
 * and `react-moralis` pull `ethers@5.6.0`, and through it `elliptic` and
 * `crypto-js@4.1.1` — six criticals in the *production* bundle of an app that asks
 * people to connect a wallet. `elliptic`'s advisory range is `*`: no version of it is
 * fixed, so no amount of pinning helped and the only real fix was dropping the
 * dependency. wagmi/viem sign with `@noble/curves` and do not need it.
 *
 * What replaces it: nothing yet. 1inch's current API (v5/v6) is a direct REST call
 * that needs an API key from portal.1inch.dev, plus `sendTransaction` through wagmi
 * for the approve and swap steps. That is a real piece of work and it is not a
 * security fix, so it is tracked rather than rushed — see README "Swap: what it takes
 * to turn this back on".
 *
 * The interface is kept exactly as it was so `DEX.jsx` needs no restructuring when
 * it is implemented: fill in the three functions and delete this note.
 */

const SWAP_DISABLED_REASON =
  "Swapping is disabled. It ran on a Moralis v1 plugin whose servers are gone; " +
  "reconnecting it needs a 1inch API key. Quotes and swaps are off until then.";

const useInchDex = () => {
  const notifyDisabled = () =>
    notification.info({
      message: "Swapping is off",
      description: SWAP_DISABLED_REASON,
      placement: "bottomRight",
      duration: 8,
    });

  // An empty token list is what DEX.jsx already renders a chooser from, so the
  // modal opens to "no tokens" rather than throwing.
  const tokenList = undefined;

  const getQuote = async () => undefined;

  const trySwap = async () => {
    notifyDisabled();
    return undefined;
  };

  return {
    getQuote,
    trySwap,
    tokenList,
    swapDisabledReason: SWAP_DISABLED_REASON,
  };
};

export default useInchDex;
