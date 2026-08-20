# Crypto-DEX

> A multi-chain DEX aggregator and Web3 wallet dashboard — swap tokens via 1inch, track balances, transfers and NFTs, and talk to your own smart contracts. Built as a fully client-side React app by [Asit Minz](https://github.com/Asit0007).

![React](https://img.shields.io/badge/React-17-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-21bf96)

## Features

| Route             | What it does                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/1inch`          | Token swaps with 1inch-aggregated quotes on Ethereum, BNB Chain, and Polygon — with user-set slippage and bounded token approvals |
| `/wallet`         | Send native coins or ERC-20 tokens, with ENS / Unstoppable Domains resolution                                                     |
| `/erc20balance`   | Full ERC-20 portfolio for the connected wallet                                                                                    |
| `/erc20transfers` | ERC-20 transfer history (default landing page)                                                                                    |
| `/nftBalance`     | NFT gallery (ERC-721 + ERC-1155) with metadata resolution and transfers                                                           |
| `/contract`       | Drop a Truffle/Hardhat artifact JSON and get auto-generated read/write forms                                                      |
| `/onramp`         | Fiat-to-crypto on-ramp (sandboxed iframe)                                                                                         |

## ⚠️ Project status

This app's data layer was built on **Moralis v1 servers**, which Moralis has
sunset. The UI, wallet connection, routing, and local-chain contract workflow
all work — but live balances, prices, and swaps stay empty until the data layer
is migrated.

**Phase 2 roadmap:** `wagmi` + `viem` wallet layer, WalletConnect v2, and a
modern swap/price API (1inch REST or 0x). Contributions welcome.

## Quick start

Requires **Node 18+**.

```sh
git clone https://github.com/Asit0007/Crypto-DEX.git
cd Crypto-DEX
npm install
cp .env.example .env   # fill in your Moralis credentials
npm run dev            # http://localhost:5173/Crypto-DEX/
```

Without a `.env` the app boots into an onboarding page instead of crashing.

## Scripts

| Script                                    | What it does                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`                             | Vite dev server                                                          |
| `npm run build`                           | Production build → `dist/`                                               |
| `npm run preview`                         | Preview the production build                                             |
| `npm run deploypage`                      | Build + publish `dist/` to GitHub Pages                                  |
| `npm run devchain`                        | Local Ganache chain on `:7545` (chain id `1337`)                         |
| `npm run migrate`                         | Compile + deploy the demo Truffle contract, copy its ABI to the frontend |
| `npm run lint:check` / `lint:fix`         | ESLint                                                                   |
| `npm run prettier:check` / `prettier:fix` | Prettier                                                                 |

## Local contract workflow (optional)

```sh
npm install -g ganache-cli truffle
npm run devchain    # terminal 1 — deterministic local chain (⚠️ dev keys are public; never send real funds)
npm run migrate     # terminal 2 — deploy MetaCoin + copy ABI
```

Then connect your wallet, switch to **Local Chain** (`0x539`), and open `/contract`.

## Deployment

Pushes to `main` build and deploy to GitHub Pages automatically via GitHub
Actions. Deep links work through a `404.html` SPA redirect. Manual deploys:
`npm run deploypage`.

## Security notes

- Token approvals are **bounded to the swap amount** — never unlimited.
- Slippage is user-configurable per swap (default 1%).
- The on-ramp iframe is sandboxed with a minimal permission set.
- The local devchain uses Ganache's public deterministic keys — never reuse
  them on a real network.

## Credits & license

Originally bootstrapped from
[ethereum-boilerplate](https://github.com/ethereum-boilerplate/ethereum-boilerplate),
since heavily rebuilt: Vite toolchain, Tailwind dark UI, security hardening,
and a long list of bug fixes. Licensed under [MIT](LICENSE).
