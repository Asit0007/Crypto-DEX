import { Card, Timeline, Typography } from "antd";

const { Text } = Typography;

export default function QuickStart() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-4 lg:flex-row">
      <Card
        className="flex-1 self-start text-base shadow-card"
        title={
          <>
            🚀 <Text strong>Run Crypto-DEX locally</Text>
          </>
        }
      >
        <Timeline mode="left">
          <Timeline.Item dot="📄">
            <Text delete>
              Clone or fork{" "}
              <a
                href="https://github.com/Asit0007/Crypto-DEX"
                target="_blank"
                rel="noopener noreferrer"
              >
                Crypto-DEX
              </a>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="💿">
            <Text delete>
              Install all dependencies: <Text code>npm install</Text>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🔏">
            <Text>
              Copy <Text code>.env.example</Text> to <Text code>.env</Text>. No
              keys are needed to connect a wallet and read balances; an{" "}
              <Text strong>Alchemy</Text> key unlocks the indexed views (tokens,
              transfers, NFTs) and a <Text strong>WalletConnect</Text> project
              id adds that connector.
            </Text>
            <Text code className="block">
              VITE_ALCHEMY_API_KEY=xxxxxxxxxxxx
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🔁">
            <Text>
              Start the dev server: <Text code>npm run dev</Text>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🛠">
            <Text>BUIDL!</Text>
          </Timeline.Item>
        </Timeline>
      </Card>

      <div className="flex flex-1 flex-col gap-4">
        <Card
          className="shadow-card"
          title={
            <>
              ⚠️ <Text strong>Project status</Text>
            </>
          }
        >
          <p>
            Crypto-DEX was built on <Text strong>Moralis v1</Text> servers,
            which Moralis has since sunset. Moralis is now removed entirely —
            the wallet layer, sends, ENS and the contract console run on{" "}
            <Text strong>wagmi + viem</Text> against public RPC, and balances,
            transfers and NFTs run on Alchemy.
          </p>
          <p className="mb-0 mt-3">
            <Text strong>Swaps are off</Text> until 1inch is reconnected — the
            old path was a Moralis plugin with no server left to call. Track
            progress on{" "}
            <a
              href="https://github.com/Asit0007/Crypto-DEX"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </Card>

        <Card
          className="shadow-card"
          title={
            <>
              💣 <Text strong>Local chain (optional)</Text>
            </>
          }
        >
          <Timeline mode="left">
            <Timeline.Item dot="💿">
              <Text>
                Install{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.npmjs.com/package/truffle"
                >
                  Truffle
                </a>{" "}
                and{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.npmjs.com/package/ganache-cli"
                >
                  ganache-cli
                </a>
                : <Text code>npm install -g ganache-cli truffle</Text>
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="⚙️">
              <Text>
                Start your local devchain: <Text code>npm run devchain</Text> in
                a new terminal
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="📡">
              <Text>
                Compile and deploy the demo contract:{" "}
                <Text code>npm run migrate</Text>
              </Text>
            </Timeline.Item>
            <Timeline.Item dot="✅">
              <Text>
                Open the 📄 <Text strong>Contract</Text> tab
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </div>
  );
}
