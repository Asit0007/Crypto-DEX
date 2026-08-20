import { useState, useEffect, useMemo } from "react";
import { useMoralis, useTokenPrice } from "react-moralis";
import InchModal from "./components/InchModal";
import useInchDex from "hooks/useInchDex";
import { Button, Image, Input, InputNumber, Modal, Popover } from "antd";
import { ArrowDownOutlined, SettingOutlined } from "@ant-design/icons";
import { tokenValue } from "helpers/formatters";
import { getWrappedNative } from "helpers/networks";

const nativeAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const FALLBACK_LOGO = "https://etherscan.io/images/main/empty-token.png";
const QUOTE_REFRESH_MS = 15000;

const chainIds = {
  "0x1": "eth",
  "0x38": "bsc",
  "0x89": "polygon",
};

const getChainIdByName = (chainName) =>
  Object.keys(chainIds).find((key) => chainIds[key] === chainName) ?? null;

const IsNative = (address) => address === nativeAddress;

const InfoRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 px-1 text-sm text-fg-muted">
    <span>{label}</span>
    <span className="text-right text-fg">{children}</span>
  </div>
);

function DEX({ chain, customTokens = {} }) {
  const { trySwap, tokenList, getQuote } = useInchDex(chain);

  const { Moralis, isInitialized, chainId } = useMoralis();
  const [isFromModalActive, setFromModalActive] = useState(false);
  const [isToModalActive, setToModalActive] = useState(false);
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [quote, setQuote] = useState();
  const [slippage, setSlippage] = useState(1);
  const [currentTrade, setCurrentTrade] = useState();
  const { fetchTokenPrice } = useTokenPrice();
  const [tokenPricesUSD, setTokenPricesUSD] = useState({});

  const tokens = useMemo(() => {
    return { ...customTokens, ...tokenList };
  }, [customTokens, tokenList]);

  const fromTokenPriceUsd = tokenPricesUSD?.[fromToken?.address] ?? null;
  const toTokenPriceUsd = tokenPricesUSD?.[toToken?.address] ?? null;

  const fromTokenAmountUsd = useMemo(() => {
    if (!fromTokenPriceUsd || !fromAmount) return null;
    return `~$${(fromAmount * fromTokenPriceUsd).toFixed(4)}`;
  }, [fromTokenPriceUsd, fromAmount]);

  const toTokenAmount = useMemo(() => {
    if (!quote?.toTokenAmount) return null;
    return Moralis?.Units?.FromWei(quote.toTokenAmount, quote.toToken.decimals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  const toTokenAmountUsd = useMemo(() => {
    if (!toTokenPriceUsd || !toTokenAmount) return null;
    return `~$${(toTokenAmount * toTokenPriceUsd).toFixed(4)}`;
  }, [toTokenPriceUsd, toTokenAmount]);

  const minReceived = useMemo(() => {
    if (!toTokenAmount || !toToken) return null;
    return `${(toTokenAmount * (1 - slippage / 100)).toFixed(6)} ${
      toToken.symbol
    }`;
  }, [toTokenAmount, toToken, slippage]);

  // token prices (functional updates: both effects may resolve in the same tick)
  useEffect(() => {
    if (!isInitialized || !fromToken || !chain) return;
    const validatedChain = getChainIdByName(chain) ?? chainId;
    const tokenAddress = IsNative(fromToken.address)
      ? getWrappedNative(validatedChain)
      : fromToken.address;
    if (!validatedChain || !tokenAddress) return;
    fetchTokenPrice({
      params: { chain: validatedChain, address: tokenAddress },
      onSuccess: (price) =>
        setTokenPricesUSD((prev) => ({
          ...prev,
          [fromToken.address]: price.usdPrice,
        })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, isInitialized, fromToken]);

  useEffect(() => {
    if (!isInitialized || !toToken || !chain) return;
    const validatedChain = getChainIdByName(chain) ?? chainId;
    const tokenAddress = IsNative(toToken.address)
      ? getWrappedNative(validatedChain)
      : toToken.address;
    if (!validatedChain || !tokenAddress) return;
    fetchTokenPrice({
      params: { chain: validatedChain, address: tokenAddress },
      onSuccess: (price) =>
        setTokenPricesUSD((prev) => ({
          ...prev,
          [toToken.address]: price.usdPrice,
        })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, isInitialized, toToken]);

  useEffect(() => {
    if (!tokens || fromToken) return;
    setFromToken(tokens[nativeAddress]);
  }, [tokens, fromToken]);

  const ButtonState = useMemo(() => {
    if (chainIds?.[chainId] !== chain)
      return { isActive: false, text: `Switch to ${chain}` };

    if (!fromAmount) return { isActive: false, text: "Enter an amount" };
    if (fromAmount && currentTrade) return { isActive: true, text: "Swap" };
    return { isActive: false, text: "Select tokens" };
  }, [fromAmount, currentTrade, chainId, chain]);

  useEffect(() => {
    if (fromToken && toToken && fromAmount)
      setCurrentTrade({ fromToken, toToken, fromAmount, chain });
    else setCurrentTrade();
  }, [toToken, fromToken, fromAmount, chain]);

  // keep the quote fresh while a trade is assembled, so the user never
  // signs against a minutes-old price
  useEffect(() => {
    if (!currentTrade) {
      setQuote();
      return;
    }
    let cancelled = false;
    const refreshQuote = () =>
      getQuote(currentTrade)
        .then((freshQuote) => {
          if (!cancelled) setQuote(freshQuote);
        })
        .catch(() => {});
    refreshQuote();
    const id = setInterval(refreshQuote, QUOTE_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrade]);

  const PriceSwap = () => {
    if (!quote || !toTokenPriceUsd) return null;
    if (quote?.statusCode === 400) return <>{quote.message}</>;
    const toValue = tokenValue(quote.toTokenAmount, toToken.decimals);
    if (!toValue) return null;
    const pricePerToken = parseFloat(
      tokenValue(quote.fromTokenAmount, fromToken.decimals) / toValue,
    ).toFixed(6);
    return (
      <InfoRow label="Rate">
        {`1 ${toToken.symbol} = ${pricePerToken} ${
          fromToken.symbol
        } ($${toTokenPriceUsd.toFixed(4)})`}
      </InfoRow>
    );
  };

  const TokenSelect = ({ token, onSelect }) => (
    <Button
      type={token ? "default" : "primary"}
      onClick={onSelect}
      className="flex h-auto items-center gap-2 rounded-xl border-none px-2.5 py-1.5 text-base font-semibold"
    >
      {token ? (
        <Image
          src={token.logoURI || FALLBACK_LOGO}
          fallback={FALLBACK_LOGO}
          alt=""
          width="28px"
          preview={false}
          className="rounded-full"
        />
      ) : (
        <span>Select token</span>
      )}
      <span>{token?.symbol}</span>
      <Arrow />
    </Button>
  );

  const slippageMenu = (
    <div className="w-60">
      <div className="mb-2 text-sm text-fg-muted">Max slippage</div>
      <div className="flex items-center gap-2">
        {[0.5, 1, 3].map((value) => (
          <Button
            key={value}
            size="small"
            type={slippage === value ? "primary" : "default"}
            className="rounded-lg"
            onClick={() => setSlippage(value)}
          >
            {value}%
          </Button>
        ))}
        <InputNumber
          size="small"
          min={0.1}
          max={50}
          step={0.1}
          value={slippage}
          onChange={(value) => setSlippage(value || 1)}
          className="w-20"
        />
      </div>
      <div className="mt-2 text-xs text-fg-muted">
        Your swap reverts if the price moves against you by more than this.
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full max-w-[430px] rounded-2xl border border-ink-border bg-ink-raised p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-lg font-bold">Swap</span>
          <Popover
            content={slippageMenu}
            trigger="click"
            placement="bottomRight"
          >
            <Button
              type="text"
              aria-label="Slippage settings"
              icon={<SettingOutlined />}
              className="text-fg-muted"
            />
          </Popover>
        </div>

        <div className="rounded-2xl border border-ink-border bg-ink-overlay p-3">
          <div className="mb-1 text-sm text-fg-muted">From</div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <InputNumber
                bordered={false}
                placeholder="0.00"
                className="w-full text-2xl font-semibold"
                onChange={setFromAmount}
                value={fromAmount}
              />
              <span className="pl-1 text-sm font-semibold text-fg-muted">
                {fromTokenAmountUsd}
              </span>
            </div>
            <TokenSelect
              token={fromToken}
              onSelect={() => setFromModalActive(true)}
            />
          </div>
        </div>

        <div className="flex justify-center py-2 text-fg-muted">
          <ArrowDownOutlined />
        </div>

        <div className="rounded-2xl border border-ink-border bg-ink-overlay p-3">
          <div className="mb-1 text-sm text-fg-muted">To</div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Input
                bordered={false}
                placeholder="0.00"
                className="w-full p-0 text-2xl font-semibold"
                readOnly
                value={
                  toTokenAmount ? parseFloat(toTokenAmount).toFixed(6) : ""
                }
              />
              <span className="pl-1 text-sm font-semibold text-fg-muted">
                {toTokenAmountUsd}
              </span>
            </div>
            <TokenSelect
              token={toToken}
              onSelect={() => setToModalActive(true)}
            />
          </div>
        </div>

        {quote && (
          <div className="mt-3 flex flex-col gap-1 rounded-xl bg-ink px-2 py-2.5">
            <PriceSwap />
            <InfoRow label="Estimated gas">{quote?.estimatedGas}</InfoRow>
            {minReceived && (
              <InfoRow label={`Min. received (${slippage}% slippage)`}>
                {minReceived}
              </InfoRow>
            )}
          </div>
        )}

        <Button
          type="primary"
          size="large"
          className="mt-4 h-12 w-full rounded-xl text-base font-bold"
          onClick={() => trySwap(currentTrade, slippage)}
          disabled={!ButtonState.isActive}
        >
          {ButtonState.text}
        </Button>
      </div>

      <Modal
        title="Select a token"
        visible={isFromModalActive}
        onCancel={() => setFromModalActive(false)}
        bodyStyle={{ padding: 0 }}
        width="450px"
        footer={null}
        destroyOnClose
      >
        <InchModal
          open={isFromModalActive}
          onClose={() => setFromModalActive(false)}
          setToken={setFromToken}
          tokenList={tokens}
        />
      </Modal>
      <Modal
        title="Select a token"
        visible={isToModalActive}
        onCancel={() => setToModalActive(false)}
        bodyStyle={{ padding: 0 }}
        width="450px"
        footer={null}
        destroyOnClose
      >
        <InchModal
          open={isToModalActive}
          onClose={() => setToModalActive(false)}
          setToken={setToToken}
          tokenList={tokens}
        />
      </Modal>
    </>
  );
}

export default DEX;

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
