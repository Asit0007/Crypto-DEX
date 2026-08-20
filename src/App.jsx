import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Tabs } from "antd";
import "antd/dist/antd.dark.css";
import Account from "components/Account/Account";
import Chains from "components/Chains";
import ERC20Balance from "components/ERC20Balance";
import ERC20Transfers from "components/ERC20Transfers";
import DEX from "components/DEX";
import NFTBalance from "components/NFTBalance";
import Wallet from "components/Wallet";
import NativeBalance from "components/NativeBalance";
import QuickStart from "components/QuickStart";
import Contract from "components/Contract/Contract";
import Ramper from "components/Ramper";
import RequireWallet from "components/RequireWallet";
import MenuItems from "./components/MenuItems";

const App = ({ isServerInfo }) => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink-border bg-ink/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <Logo />
          <MenuItems />
          <div className="flex items-center gap-3">
            <Chains />
            <NativeBalance className="hidden md:block" />
            <Account />
          </div>
        </header>

        <main className="flex flex-1 justify-center px-3 py-8 sm:px-6">
          <Switch>
            <Route exact path="/quickstart">
              <QuickStart isServerInfo={isServerInfo} />
            </Route>
            <Route path="/wallet">
              <RequireWallet>
                <Wallet />
              </RequireWallet>
            </Route>
            <Route path="/1inch">
              <Tabs
                defaultActiveKey="1"
                centered
                className="w-full max-w-[480px]"
              >
                <Tabs.TabPane tab="Ethereum" key="1">
                  <div className="flex justify-center">
                    <DEX chain="eth" />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="BNB Chain" key="2">
                  <div className="flex justify-center">
                    <DEX chain="bsc" />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Polygon" key="3">
                  <div className="flex justify-center">
                    <DEX chain="polygon" />
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </Route>
            <Route path="/erc20balance">
              <RequireWallet title="💰 Token Balances">
                <ERC20Balance />
              </RequireWallet>
            </Route>
            <Route path="/onramp">
              <Ramper />
            </Route>
            <Route path="/erc20transfers">
              <RequireWallet title="💸 ERC-20 Transfers">
                <ERC20Transfers />
              </RequireWallet>
            </Route>
            <Route path="/nftBalance">
              <RequireWallet title="🖼 NFT Balances">
                <NFTBalance />
              </RequireWallet>
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route exact path="/">
              <Redirect to="/erc20transfers" />
            </Route>
          </Switch>
        </main>

        <footer className="border-t border-ink-border px-6 py-6 text-center text-sm text-fg-muted">
          <p>
            Built by{" "}
            <a
              href="https://github.com/Asit0007"
              target="_blank"
              rel="noopener noreferrer"
            >
              Asit Minz
            </a>
            {" · "}
            <a
              href="https://github.com/Asit0007/Crypto-DEX"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source on GitHub
            </a>
            {" · "}
            <a href="mailto:asitminz007@gmail.com">Contact</a>
          </p>
          <p className="mt-1">
            ⭐ If this project helps you, a star on GitHub makes my day.
          </p>
        </footer>
      </div>
    </Router>
  );
};

export const Logo = () => (
  <div className="flex select-none items-center gap-2.5">
    <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#21BF96" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0B0E14" />
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="12"
        fill="none"
        stroke="url(#logo-g)"
        strokeWidth="2.5"
      />
      <path
        d="M18 26h22l-6-6"
        fill="none"
        stroke="url(#logo-g)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 38H24l6 6"
        fill="none"
        stroke="url(#logo-g)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
      Crypto-DEX
    </span>
  </div>
);

export default App;
