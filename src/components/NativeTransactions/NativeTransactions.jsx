import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "../../helpers/formatters";
import { getExplorer } from "../../helpers/networks";
import useNativeTransactions from "hooks/useNativeTransactions";
import { Skeleton, Table } from "antd";

function NativeTransactions() {
  const { nativeTransactions, chainId } = useNativeTransactions();
  const { Moralis } = useMoralis();
  const explorer = getExplorer(chainId);

  const columns = [
    {
      title: "From",
      dataIndex: "from_address",
      key: "from_address",
      render: (from) => getEllipsisTxt(from, 5),
    },
    {
      title: "To",
      dataIndex: "to_address",
      key: "to_address",
      render: (to) => getEllipsisTxt(to, 5),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => parseFloat(Moralis.Units.FromWei(value)).toFixed(6),
    },
    {
      title: "Hash",
      dataIndex: "hash",
      key: "hash",
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
      <h1 className="mb-4 text-2xl font-bold text-fg">
        💸 Native Transactions
      </h1>
      <div className="overflow-hidden rounded-2xl border border-ink-border shadow-card">
        <Skeleton loading={!nativeTransactions} active className="p-6">
          <Table
            dataSource={nativeTransactions}
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

export default NativeTransactions;
