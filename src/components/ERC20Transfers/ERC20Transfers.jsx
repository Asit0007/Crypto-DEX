import { Skeleton, Table } from "antd";
import { useERC20Transfers } from "hooks/useERC20Transfers";
import { getNetworkConfig } from "helpers/wagmi";
import { getEllipsisTxt } from "../../helpers/formatters";
import { getExplorer } from "../../helpers/networks";
import DataNotice from "../DataNotice";

function ERC20Transfers() {
  const { ERC20Transfers, chainId, isLoading, isSupported } =
    useERC20Transfers();
  // networks.js is keyed by hex chain id; wagmi hands us decimal.
  const explorer = getExplorer(`0x${chainId.toString(16)}`);

  const columns = [
    {
      title: "Token",
      dataIndex: "asset",
      key: "asset",
      render: (asset, item) => asset || getEllipsisTxt(item.address, 8),
    },
    {
      title: "From",
      dataIndex: "from_address",
      key: "from_address",
      render: (from) => getEllipsisTxt(from, 8),
    },
    {
      title: "To",
      dataIndex: "to_address",
      key: "to_address",
      render: (to) => getEllipsisTxt(to, 8),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      // Alchemy returns this already decimalised; raw wei is in rawContract.
      render: (value) => (value == null ? "—" : value.toFixed(6)),
    },
    {
      title: "Hash",
      dataIndex: "transaction_hash",
      key: "transaction_hash",
      render: (hash) =>
        explorer ? (
          <a href={`${explorer}/tx/${hash}`} target="_blank" rel="noreferrer">
            View Transaction
          </a>
        ) : (
          getEllipsisTxt(hash, 8)
        ),
    },
  ];

  return (
    <div className="w-full max-w-5xl px-1 py-2">
      <h1 className="mb-4 text-2xl font-bold text-fg">💸 ERC-20 Transfers</h1>
      {!isSupported ? (
        <DataNotice chainName={getNetworkConfig(chainId)?.chainName} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-border shadow-card">
          <Skeleton loading={isLoading} active className="p-6">
            <Table
              dataSource={ERC20Transfers}
              columns={columns}
              scroll={{ x: true }}
              rowKey={(record, index) => `${record.transaction_hash}-${index}`}
            />
          </Skeleton>
        </div>
      )}
    </div>
  );
}

export default ERC20Transfers;
