# Crypto-DEX

> A multi-chain DEX aggregator and Web3 wallet dashboard — swap tokens via 1inch, track balances, transfers and NFTs, and talk to your own smart contracts. Built as a fully client-side React app by [Asit Minz](https://github.com/Asit0007).

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![wagmi](https://img.shields.io/badge/wagmi-3-1c1b1b?logo=ethereum&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-21bf96)

## Features

| Route             | What it does                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/1inch`          | Token swaps with 1inch-aggregated quotes on Ethereum, BNB Chain, and Polygon — with user-set slippage and bounded token approvals |
| `/wallet`         | Send native coins or ERC-20 tokens, with ENS name resolution                                                                      |
| `/erc20balance`   | Full ERC-20 portfolio for the connected wallet                                                                                    |
| `/erc20transfers` | ERC-20 transfer history (default landing page)                                                                                    |
| `/nftBalance`     | NFT gallery (ERC-721 + ERC-1155) with metadata resolution and transfers                                                           |
| `/contract`       | Drop a Truffle/Hardhat artifact JSON and get auto-generated read/write forms                                                      |

## ⚠️ Project status — migration in progress

This app's data layer was built on **Moralis v1 servers**, which Moralis has
sunset. A phased migration off it is underway — and as of this commit **Moralis
is gone from the dependency tree entirely**, ahead of the roadmap order below.

It was pulled forward for a security reason rather than a feature one.
`moralis` + `react-moralis` drag `ethers@5.6.0`, and with it `elliptic` and
`crypto-js@4.1.1` — **six critical advisories in the production bundle** of an
app that asks people to connect a wallet. `elliptic`'s vulnerable range is `*`:
no published version is fixed, so no amount of pinning helped and dropping the
dependency was the only thing that would. wagmi/viem sign with `@noble/curves`
and never needed it. `npm audit --omit=dev` now reports **0 vulnerabilities**,
down from 13 (6 critical).

**Working now**, all rebuilt on `wagmi` + `viem` and all keyless — they run
against public RPC endpoints with nothing to configure:

- the wallet layer (WalletConnect v2, chain switching, automatic reconnect)
- your native-coin balance
- sending native coin and ERC-20 tokens, to an address or an **ENS name**
- the `/contract` console — reads, writes, and a live event feed

**Needs an Alchemy key** (free): the ERC-20 balance table, transfer history,
and the NFT gallery. Enumerating what a wallet holds cannot be done from a
plain RPC node — it needs an index. Set `VITE_ALCHEMY_API_KEY` and they work;
without it each shows a short notice saying so.

**Off, and says so:** swaps. The swap panel renders, remembers your token
selection and shows a notice instead of a quote. See _Swap: what it takes to
turn this back on_ below.

The fiat on-ramp route was **removed** — it ran on the sunset Moralis fiat
plugin, and every replacement requires a commercial KYC-onboarded account.

**Roadmap:**

| Phase 2 step                                     | Status  |
| ------------------------------------------------ | ------- |
| React 18, wagmi/viem providers                   | ✅ done |
| Wallet connect, chain switching, address display | ✅ done |
| Native balance, sends, ENS, contract console     | ✅ done |
| Balances / transfers / NFTs via Alchemy          | ✅ done |
| Remove Moralis entirely                          | ✅ done |
| Swaps via 1inch REST behind a Vercel function    | ⬜ next |

### Swap: what it takes to turn this back on

The old swap path was `Moralis.Plugins.oneInch`, a server-side plugin that ran on
a Moralis v1 server. That had been dead for a while before it was deleted — the
servers are gone, so the plugin had nothing to call and the page failed at
runtime rather than saying so. It now says so.

Reconnecting it is a contained piece of work, deliberately not rushed into a
security commit:

1. An API key from [portal.1inch.dev](https://portal.1inch.dev) — the v5/v6 API
   requires auth, unlike the version this was written against.
2. A serverless function to hold it. The key must **not** be `VITE_`-prefixed:
   anything with that prefix is inlined into the browser bundle, which is how
   `VITE_ALCHEMY_API_KEY` works and why that one needs a domain allowlist.
3. Fill in the three functions in [`src/hooks/useInchDex.js`](src/hooks/useInchDex.js)
   — `getQuote`, `trySwap` and the `tokenList` fetch. The interface is unchanged
   from the Moralis version, so `DEX.jsx` needs no restructuring.
4. `approve` and `swap` go through wagmi's `useSendTransaction` rather than the
   plugin's own signer.

USD price rows went with Moralis' oracle and are wired to render null; a spot
price from the same provider as the quote is the natural place to restore them.

Contributions welcome.

## Quick start

Requires **Node 22+**. Production builds run on Node 24 (Vercel and CI).

```sh
git clone https://github.com/Asit0007/Crypto-DEX.git
cd Crypto-DEX
npm install
cp .env.example .env   # optional — see below
npm run dev            # http://localhost:5173
```

**The app runs with no `.env` at all.** Wallet connect, chain switching, sends,
ENS, the contract console and routing all work; the three indexed views need an
Alchemy key, and swaps are off entirely (see Project status).

| Variable                        | Required? | What it does                                                                                                                                                                                                             |
| ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_WALLETCONNECT_PROJECT_ID` | optional  | Adds WalletConnect to the connect modal. Get one free at [WalletConnect Cloud](https://cloud.walletconnect.com). Without it, injected wallets (MetaMask etc.) only.                                                      |
| `VITE_ALCHEMY_API_KEY`          | optional  | Enables the balance table, transfer history and NFT gallery on Ethereum, Polygon and Sepolia. Get one free at [Alchemy](https://dashboard.alchemy.com) — and **set a domain allowlist**, since this ships in the bundle. |

`VITE_*` variables are inlined into the browser bundle and are public by
design. Anything **without** that prefix stays server-side — that distinction
is the security boundary for the API keys the roadmap adds later.

## Scripts

| Script                                    | What it does                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`                             | Vite dev server                                                          |
| `npm run build`                           | Production build → `dist/`                                               |
| `npm run preview`                         | Preview the production build                                             |
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

Hosted on **Vercel**, deployed automatically from `main` via Vercel's Git
integration. Pull requests get their own preview deployment. SPA routing and
cache headers are configured in `vercel.json`.

GitHub Actions (`.github/workflows/ci.yml`) runs lint, format, and build
checks on every PR — it does not deploy.

## Security notes

- Token approvals are **bounded to the swap amount** — never unlimited.
- Slippage is user-configurable per swap (default 1%).
- The local devchain uses Ganache's public deterministic keys — never reuse
  them on a real network.

## Credits & license

Originally bootstrapped from
[ethereum-boilerplate](https://github.com/ethereum-boilerplate/ethereum-boilerplate),
since heavily rebuilt: Vite toolchain, Tailwind dark UI, security hardening,
and a long list of bug fixes. Licensed under [MIT](LICENSE).
