import { useState } from "react";
import { useMoralis } from "react-moralis";
import { Button, Card, Modal } from "antd";
import { SelectOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { getEllipsisTxt } from "helpers/formatters";
import { getExplorer } from "helpers/networks";
import Blockie from "../Blockie";
import Address from "../Address/Address";
import { connectors } from "./config";

function Account() {
  const { authenticate, isAuthenticated, account, chainId, logout } =
    useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const explorer = getExplorer(chainId);

  if (!isAuthenticated || !account) {
    return (
      <>
        <Button
          type="primary"
          className="rounded-xl font-semibold"
          onClick={() => setIsAuthModalVisible(true)}
        >
          Connect Wallet
        </Button>
        <Modal
          visible={isAuthModalVisible}
          footer={null}
          onCancel={() => setIsAuthModalVisible(false)}
          width={340}
          bodyStyle={{ padding: "24px 16px" }}
        >
          <div className="mb-4 text-center text-lg font-bold">
            Connect Wallet
          </div>
          <div className="grid grid-cols-2 gap-1">
            {connectors.map(({ title, icon, connectorId }, key) => (
              <button
                key={key}
                type="button"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-0 bg-transparent px-1 py-5 hover:bg-ink-overlay"
                onClick={async () => {
                  try {
                    await authenticate({ provider: connectorId });
                    window.localStorage.setItem("connectorId", connectorId);
                    setIsAuthModalVisible(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <img src={icon} alt={title} className="h-8" />
                <Text className="text-sm">{title}</Text>
              </button>
            ))}
          </div>
          <p className="mb-0 mt-4 text-center text-xs text-fg-muted">
            More wallets (WalletConnect v2) arrive with the data-layer upgrade.
          </p>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div
        className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-ink-border bg-ink-overlay px-3"
        onClick={() => setIsModalVisible(true)}
      >
        <p className="mb-0 font-semibold text-brand">
          {getEllipsisTxt(account, 6)}
        </p>
        <Blockie currentWallet scale={3} />
      </div>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={400}
        bodyStyle={{ padding: 16 }}
      >
        <div className="text-base font-semibold">Account</div>
        <Card className="mt-3" bodyStyle={{ padding: 16 }}>
          <Address
            avatar="left"
            size={6}
            copyable
            style={{ fontSize: "20px" }}
          />
          {explorer && (
            <div className="mt-3 px-1">
              <a
                href={`${explorer}/address/${account}`}
                target="_blank"
                rel="noreferrer"
              >
                <SelectOutlined className="mr-1.5" />
                View on Explorer
              </a>
            </div>
          )}
        </Card>
        <Button
          size="large"
          type="primary"
          className="mt-3 w-full rounded-xl font-semibold"
          onClick={async () => {
            await logout();
            window.localStorage.removeItem("connectorId");
            setIsModalVisible(false);
          }}
        >
          Disconnect Wallet
        </Button>
      </Modal>
    </>
  );
}

export default Account;
