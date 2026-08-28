import { Skeleton, Table } from "antd";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";
import { useERC20Balance } from "hooks/useERC20Balance";
import { getNetworkConfig } from "helpers/wagmi";
import { getEllipsisTxt } from "../helpers/formatters";
import DataNotice from "./DataNotice";

function ERC20Balance() {
  const { assets, isLoading, isSupported } = useERC20Balance();
  const chainId = useChainId();

  const columns = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => (
        <img
          src={logo || "https://etherscan.io/images/main/empty-token.png"}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value, item) =>
        parseFloat(formatUnits(BigInt(value), item.decimals)).toFixed(6),
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => getEllipsisTxt(address, 5),
    },
  ];

  return (
    <div className="w-full max-w-5xl px-1 py-2">
      <h1 className="mb-4 text-2xl font-bold text-fg">💰 Token Balances</h1>
      {!isSupported ? (
        <DataNotice chainName={getNetworkConfig(chainId)?.chainName} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-border shadow-card">
          <Skeleton loading={isLoading} active className="p-6">
            <Table
              dataSource={assets}
              columns={columns}
              scroll={{ x: true }}
              rowKey={(record) => record.token_address}
            />
          </Skeleton>
        </div>
      )}
    </div>
  );
}
export default ERC20Balance;
