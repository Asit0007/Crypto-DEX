import Metamask from "./WalletIcons/metamaskWallet.png";

// Generic glyph for "whatever wallet injected window.ethereum".
const browserWalletIcon =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#21BF96"/>
          <stop offset="1" stop-color="#38BDF8"/>
        </linearGradient>
      </defs>
      <rect x="4" y="10" width="40" height="30" rx="6" fill="none" stroke="url(#g)" stroke-width="3"/>
      <path d="M32 22h12v8H32a4 4 0 0 1 0-8z" fill="none" stroke="url(#g)" stroke-width="3"/>
      <circle cx="34" cy="26" r="1.8" fill="#21BF96"/>
    </svg>`,
  );

// Every entry here uses the injected provider (window.ethereum).
// WalletConnect v1 was removed — its bridge servers are shut down; v2 support
// lands with the wagmi/viem data-layer migration (phase 2).
export const connectors = [
  {
    title: "MetaMask",
    icon: Metamask,
    connectorId: "injected",
  },
  {
    title: "Browser Wallet",
    icon: browserWalletIcon,
    connectorId: "injected",
  },
];
