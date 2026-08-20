import { useEffect, useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from "./Logos";
import { useChain, useMoralis } from "react-moralis";

// Keep in sync with helpers/networks.js — that file is the source of truth
// for chain metadata; this list only drives the switcher dropdown.
const menuItems = [
  { key: "0x1", value: "Ethereum", icon: <ETHLogo /> },
  { key: "0xaa36a7", value: "Sepolia Testnet", icon: <ETHLogo /> },
  { key: "0x539", value: "Local Chain", icon: <ETHLogo /> },
  { key: "0x38", value: "BNB Chain", icon: <BSCLogo /> },
  { key: "0x61", value: "BNB Testnet", icon: <BSCLogo /> },
  { key: "0x89", value: "Polygon", icon: <PolygonLogo /> },
  { key: "0xa86a", value: "Avalanche", icon: <AvaxLogo /> },
];

function Chains() {
  const { switchNetwork, chainId } = useChain();
  const { isAuthenticated } = useMoralis();
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!chainId) return;
    setSelected(menuItems.find((item) => item.key === chainId) ?? {});
  }, [chainId]);

  if (!chainId || !isAuthenticated) return null;

  const menu = (
    <Menu onClick={(e) => switchNetwork(e.key)}>
      {menuItems.map((item) => (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          className="flex h-10 items-center px-3 text-sm font-medium"
        >
          <span className="ml-1">{item.value}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button
        icon={selected?.icon}
        className="flex h-10 items-center rounded-xl border-ink-border bg-transparent px-3 text-sm font-medium"
      >
        <span className="ml-1.5">{selected?.value ?? "Unsupported chain"}</span>
        <DownOutlined className="ml-1" />
      </Button>
    </Dropdown>
  );
}

export default Chains;
