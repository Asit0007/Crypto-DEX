import metamaskIcon from "./WalletIcons/metamaskWallet.png";

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

const walletConnectIcon =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path d="M14 19.5c5.5-5.4 14.5-5.4 20 0l.7.7c.3.3.3.7 0 1l-2.3 2.2c-.1.2-.4.2-.5 0l-.9-.9c-3.9-3.7-10-3.7-13.9 0l-1 1c-.1.1-.4.1-.5 0L13.3 21c-.3-.3-.3-.7 0-1l.7-.5z" fill="#38BDF8"/>
      <path d="M38.7 24.2l2 2c.3.3.3.7 0 1l-9.2 9c-.3.3-.7.3-1 0l-6.5-6.4c-.1-.1-.2-.1-.3 0l-6.5 6.4c-.3.3-.7.3-1 0l-9.2-9c-.3-.3-.3-.7 0-1l2-2c.3-.3.7-.3 1 0l6.5 6.4c.1.1.2.1.3 0l6.5-6.4c.3-.3.7-.3 1 0l6.5 6.4c.1.1.2.1.3 0l6.5-6.4c.3-.3.7-.3 1 0z" fill="#21BF96"/>
    </svg>`,
  );

/**
 * wagmi supplies the connector list now, so tiles reflect the wallet actually
 * installed rather than the old hardcoded seven — five of which were duplicate
 * "injected" entries that all connected to the same provider (CLAUDE.md §7.2).
 */
export const getConnectorIcon = (connector) => {
  if (connector.icon) return connector.icon;
  if (connector.id === "walletConnect") return walletConnectIcon;
  if ((connector.name || "").toLowerCase().includes("metamask"))
    return metamaskIcon;
  return browserWalletIcon;
};
