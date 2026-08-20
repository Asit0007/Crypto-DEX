import { useLocation } from "react-router";
import { Button, Dropdown, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/wallet", icon: "👛", label: "Wallet" },
  { to: "/1inch", icon: "🔄", label: "Dex" },
  { to: "/erc20balance", icon: "💰", label: "Balances" },
  { to: "/erc20transfers", icon: "💸", label: "Transfers" },
  { to: "/nftBalance", icon: "🖼", label: "NFTs" },
  { to: "/contract", icon: "📄", label: "Contract" },
  { to: "/onramp", icon: "💵", label: "On-Ramp" },
  { to: "/quickstart", icon: "🚀", label: "Quick Start" },
];

const Link = ({ to, icon, label }) => (
  <NavLink to={to}>
    <span className="mr-1.5" aria-hidden="true">
      {icon}
    </span>
    {label}
  </NavLink>
);

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop: full horizontal nav. Below lg it cannot fit, so it is
          replaced by the dropdown below rather than overflowing the header. */}
      <Menu
        mode="horizontal"
        className="hidden min-w-0 flex-auto justify-center border-none bg-transparent text-[15px] font-medium lg:flex"
        selectedKeys={[pathname]}
      >
        {items.map((item) => (
          <Menu.Item key={item.to}>
            <Link {...item} />
          </Menu.Item>
        ))}
      </Menu>

      <Dropdown
        trigger={["click"]}
        overlay={
          <Menu selectedKeys={[pathname]}>
            {items.map((item) => (
              <Menu.Item key={item.to}>
                <Link {...item} />
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <Button
          aria-label="Open navigation"
          icon={<MenuOutlined />}
          className="flex h-10 items-center rounded-xl border-ink-border bg-transparent lg:hidden"
        />
      </Dropdown>
    </>
  );
}

export default MenuItems;
