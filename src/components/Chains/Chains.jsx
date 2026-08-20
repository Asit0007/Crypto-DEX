import { useMemo } from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useAccount, useSwitchChain } from "wagmi";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "./Logos";

// Keyed by wagmi's decimal chain id (CLAUDE.md trap #5 — decimal is the
// canonical representation now). helpers/networks.js remains the source of
// truth for chain metadata; this map only supplies dropdown labels and icons.
const chainDisplay = {
  1: { label: "Ethereum", icon: <ETHLogo /> },
  11155111: { label: "Sepolia Testnet", icon: <ETHLogo /> },
  1337: { label: "Local Chain", icon: <ETHLogo /> },
  56: { label: "BNB Chain", icon: <BSCLogo /> },
  97: { label: "BNB Testnet", icon: <BSCLogo /> },
  137: { label: "Polygon", icon: <PolygonLogo /> },
  43114: { label: "Avalanche", icon: <AvaxLogo /> },
};

function Chains() {
  const { chainId, isConnected } = useAccount();
  const { chains, switchChain, isPending } = useSwitchChain();

  const selected = useMemo(() => chainDisplay[chainId], [chainId]);

  if (!isConnected || !chainId) return null;

  const menu = (
    <Menu onClick={({ key }) => switchChain({ chainId: Number(key) })}>
      {chains.map((chain) => (
        <Menu.Item
          key={chain.id}
          icon={chainDisplay[chain.id]?.icon}
          className="flex h-10 items-center px-3 text-sm font-medium"
        >
          <span className="ml-1">
            {chainDisplay[chain.id]?.label ?? chain.name}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} disabled={isPending}>
      <Button
        icon={selected?.icon}
        className="flex h-10 items-center rounded-xl border-ink-border bg-transparent px-3 text-sm font-medium"
      >
        <span className="ml-1.5">{selected?.label ?? "Unsupported chain"}</span>
        <DownOutlined className="ml-1" />
      </Button>
    </Dropdown>
  );
}

export default Chains;
