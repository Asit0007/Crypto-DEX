import { CreditCardOutlined } from "@ant-design/icons";
import { Button, Input, notification } from "antd";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import { erc20Abi, isAddress, parseEther, parseUnits } from "viem";
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import AddressInput from "../../AddressInput";
import AssetSelector, { NATIVE_ADDRESS } from "./AssetSelector";

function Transfer() {
  const [receiver, setReceiver] = useState();
  const [asset, setAsset] = useState();
  const [tx, setTx] = useState();
  const [amount, setAmount] = useState();
  const [hash, setHash] = useState();
  const [isPending, setIsPending] = useState(false);

  // wagmi v3 exposes these as `mutateAsync`; the `sendTransactionAsync` /
  // `writeContractAsync` aliases are deprecated.
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const { mutateAsync: writeContract } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    asset && amount && receiver ? setTx({ amount, receiver, asset }) : setTx();
  }, [asset, amount, receiver]);

  useEffect(() => {
    if (!receipt) return;
    openNotification({
      message: "📃 New Receipt",
      description: `${receipt.transactionHash}`,
    });
    setIsPending(false);
  }, [receipt]);

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
    });
  };

  async function transfer() {
    const { amount, receiver, asset } = tx;

    if (!isAddress(receiver)) {
      openNotification({
        message: "📃 Error",
        description: "That recipient is not a valid address.",
      });
      return;
    }

    setIsPending(true);
    try {
      const txHash =
        asset.token_address === NATIVE_ADDRESS
          ? await sendTransaction({
              to: receiver,
              value: parseEther(amount),
            })
          : await writeContract({
              address: asset.token_address,
              abi: erc20Abi,
              functionName: "transfer",
              args: [receiver, parseUnits(amount, asset.decimals)],
            });

      setHash(txHash);
      openNotification({
        message: "🔊 New Transaction",
        description: `${txHash}`,
      });
    } catch (error) {
      openNotification({
        message: "📃 Error",
        description: `${error.shortMessage || error.message}`,
      });
      setIsPending(false);
    }
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
