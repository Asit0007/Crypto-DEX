import { useMemo, useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const FALLBACK_LOGO = "https://etherscan.io/images/main/empty-token.png";
// The full 1inch list is 1000+ tokens; rendering it all makes the modal crawl.
const MAX_RESULTS = 100;

function InchModal({ open, onClose, setToken, tokenList }) {
  const [query, setQuery] = useState("");

  const tokens = useMemo(() => {
    const all = Object.values(tokenList || {});
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter(
          (token) =>
            token.symbol?.toLowerCase().includes(q) ||
            token.name?.toLowerCase().includes(q) ||
            token.address?.toLowerCase() === q,
        )
      : all;
    return filtered.slice(0, MAX_RESULTS);
  }, [tokenList, query]);

  if (!open) return null;

  return (
    <div>
      <div className="px-4 pb-3 pt-2">
        <Input
          allowClear
          autoFocus
          prefix={<SearchOutlined className="text-fg-muted" />}
          placeholder="Search name or symbol, or paste an address"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="h-[420px] overflow-auto pb-2">
        {tokens.map((token) => (
          <button
            key={token.address}
            type="button"
            className="flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent px-5 py-2 text-left hover:bg-ink-overlay"
            onClick={() => {
              setToken(token);
              onClose();
            }}
          >
            <img
              className="h-8 w-8 rounded-full"
              src={token.logoURI || FALLBACK_LOGO}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_LOGO;
              }}
              alt=""
            />
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold text-fg">{token.symbol}</span>
              <span className="truncate text-sm text-fg-muted">
                {token.name}
              </span>
            </span>
          </button>
        ))}
        {!tokens.length && (
          <div className="px-5 py-10 text-center text-fg-muted">
            No tokens found
          </div>
        )}
      </div>
    </div>
  );
}

export default InchModal;
