import { CreditCardOutlined } from "@ant-design/icons";
import { Button, Input, notification } from "antd";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import AddressInput from "../../AddressInput";
import AssetSelector from "./AssetSelector";

const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

function Transfer() {
  const { Moralis } = useMoralis();
  const [receiver, setReceiver] = useState();
  const [asset, setAsset] = useState();
  const [tx, setTx] = useState();
  const [amount, setAmount] = useState();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    asset && amount && receiver ? setTx({ amount, receiver, asset }) : setTx();
  }, [asset, amount, receiver]);

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
    });
  };

  async function transfer() {
    const { amount, receiver, asset } = tx;

    let options = {};

    switch (asset.token_address) {
      case NATIVE_ADDRESS:
        options = {
          native: "native",
          amount: Moralis.Units.ETH(amount),
          receiver,
          awaitReceipt: false,
        };
        break;
      default:
        options = {
          type: "erc20",
          amount: Moralis.Units.Token(amount, asset.decimals),
          receiver,
          contractAddress: asset.token_address,
          awaitReceipt: false,
        };
    }

    setIsPending(true);
    const txStatus = await Moralis.transfer(options);

    txStatus
      .on("transactionHash", (hash) => {
        openNotification({
          message: "🔊 New Transaction",
          description: `${hash}`,
        });
      })
      .on("receipt", (receipt) => {
        openNotification({
          message: "📃 New Receipt",
          description: `${receipt.transactionHash}`,
        });
        setIsPending(false);
      })
      .on("error", (error) => {
        openNotification({
          message: "📃 Error",
          description: `${error.message}`,
        });
        console.error(error);
        setIsPending(false);
      });
  }

  return (
    <div className="w-full">
      <h3 className="mb-2 text-center text-lg font-bold text-fg">
        Transfer Assets
      </h3>
      <div className="mt-5 flex items-center gap-3">
        <div className="w-20 shrink-0">
          <Text strong>Address:</Text>
        </div>
        <AddressInput autoFocus onChange={setReceiver} />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="w-20 shrink-0">
          <Text strong>Amount:</Text>
        </div>
        <Input
          size="large"
          prefix={<CreditCardOutlined />}
          onChange={(e) => {
            setAmount(`${e.target.value}`);
          }}
        />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="w-20 shrink-0">
          <Text strong>Asset:</Text>
        </div>
        <AssetSelector setAsset={setAsset} style={{ width: "100%" }} />
      </div>
      <Button
        type="primary"
        size="large"
        loading={isPending}
        className="mt-6 w-full rounded-xl font-semibold"
        onClick={() => transfer()}
        disabled={!tx}
      >
        Transfer 💸
      </Button>
    </div>
  );
}

export default Transfer;
