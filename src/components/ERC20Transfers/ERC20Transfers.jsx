import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "../../helpers/formatters";
import { getExplorer } from "../../helpers/networks";
import { Skeleton, Table } from "antd";
import { useERC20Transfers } from "hooks/useERC20Transfers";

function ERC20Transfers() {
  const { ERC20Transfers, chainId } = useERC20Transfers();
  const { Moralis } = useMoralis();
  const explorer = getExplorer(chainId);

  const columns = [
    {
      title: "Token",
      dataIndex: "address",
      key: "address",
      render: (token) => getEllipsisTxt(token, 8),
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
      render: (value, item) =>
        parseFloat(Moralis.Units.FromWei(value, item.decimals)).toFixed(6),
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

  let key = 0;
  return (
    <div className="w-full max-w-5xl px-1 py-2">
      <h1 className="mb-4 text-2xl font-bold text-fg">💸 ERC-20 Transfers</h1>
      <div className="overflow-hidden rounded-2xl border border-ink-border shadow-card">
        <Skeleton loading={!ERC20Transfers} active className="p-6">
          <Table
            dataSource={ERC20Transfers}
            columns={columns}
            scroll={{ x: true }}
            rowKey={(record) => {
              key++;
              return `${record.transaction_hash}-${key}`;
            }}
          />
        </Skeleton>
      </div>
    </div>
  );
}

export default ERC20Transfers;
