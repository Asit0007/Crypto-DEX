export const networkConfigs = {
  "0x1": {
    chainId: 1,
    chainName: "Ethereum Mainnet",
    currencyName: "Ether",
    currencySymbol: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    blockExplorerUrl: "https://etherscan.io",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  "0xaa36a7": {
    chainId: 11155111,
    chainName: "Sepolia Testnet",
    currencyName: "Sepolia Ether",
    currencySymbol: "ETH",
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorerUrl: "https://sepolia.etherscan.io",
  },
  "0x539": {
    chainId: 1337,
    chainName: "Local Chain",
    currencyName: "Ether",
    currencySymbol: "ETH",
    rpcUrl: "http://127.0.0.1:7545",
  },
  "0x38": {
    chainId: 56,
    chainName: "BNB Smart Chain",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org",
    blockExplorerUrl: "https://bscscan.com",
    wrapped: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  "0x61": {
    chainId: 97,
    chainName: "BNB Smart Chain Testnet",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockExplorerUrl: "https://testnet.bscscan.com",
  },
  "0x89": {
    chainId: 137,
    chainName: "Polygon Mainnet",
    currencyName: "POL",
    currencySymbol: "POL",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorerUrl: "https://polygonscan.com",
    wrapped: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  },
  "0xa86a": {
    chainId: 43114,
    chainName: "Avalanche C-Chain",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorerUrl: "https://snowtrace.io",
  },
};

export const getNativeByChain = (chain) =>
  networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getExplorer = (chain) =>
  networkConfigs[chain]?.blockExplorerUrl || null;

export const getWrappedNative = (chain) =>
  networkConfigs[chain]?.wrapped || null;
