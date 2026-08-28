import { Card, Form, notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import Address from "components/Address/Address";
import { readContract } from "wagmi/actions";
import {
  useChainId,
  useConfig,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { getEllipsisTxt } from "helpers/formatters";
import ContractMethods from "./ContractMethods";
import ContractResolver from "./ContractResolver";

/**
 * Antd form fields are always strings; viem wants correctly typed args in ABI
 * order. Coerce per input type rather than trusting the string through.
 */
const coerceArg = (value, type) => {
  if (type.endsWith("]")) return JSON.parse(value);
  if (type.startsWith("uint") || type.startsWith("int")) return BigInt(value);
  if (type === "bool") return value === "true";
  return value;
};

const buildArgs = (method, params) =>
  method.inputs.map((input) => coerceArg(params[input.name], input.type));

export default function Contract() {
  const chainId = useChainId();
  const config = useConfig();
  const [responses, setResponses] = useState({});
  const [contract, setContract] = useState();
  const [events, setEvents] = useState([]);
  const [pending, setPending] = useState();

  const { mutateAsync: writeContract } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: pending?.hash,
  });

  /** Automatically builds write and read components for interacting with contract*/
  const displayedContractFunctions = useMemo(() => {
    if (!contract?.abi) return [];
    return contract.abi.filter((method) => method["type"] === "function");
  }, [contract]);

  /** Returns true in case if contract is deployed to active chain in wallet */
  const isDeployedToActiveChain = useMemo(() => {
    if (!contract?.networks) return undefined;
    return chainId in contract.networks;
  }, [contract, chainId]);

  const contractAddress = useMemo(() => {
    if (!isDeployedToActiveChain) return null;
    return contract.networks[chainId]?.["address"] || null;
  }, [chainId, contract, isDeployedToActiveChain]);

  /**
   * Live event feed. This replaces the Moralis "Events" live query, which read
   * a server-side table that no longer exists. viem watches from the current
   * block onward, so there is no history — only events emitted while this page
   * is open.
   */
  useWatchContractEvent({
    address: contractAddress ?? undefined,
    abi: contract?.abi,
    enabled: Boolean(contractAddress && contract?.abi),
    onLogs: (logs) => setEvents((prev) => [...logs, ...prev].slice(0, 20)),
  });

  useEffect(() => {
    setEvents([]);
  }, [contractAddress]);

  useEffect(() => {
    if (!receipt || !pending) return;
    setResponses((prev) => ({
      ...prev,
      [pending.name]: { result: null, isLoading: false },
    }));
    openNotification({
      message: "📃 New Receipt",
      description: `${receipt.transactionHash}`,
    });
    setPending(undefined);
  }, [receipt, pending]);

  /** Default function for showing notifications*/
  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 lg:flex-row">
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Your contract: {contract?.contractName}
            <Address
              avatar="left"
              copyable
              address={contractAddress}
              size={8}
            />
          </div>
        }
        size="large"
        className="w-full shadow-card lg:w-3/5"
      >
        <ContractResolver setContract={setContract} contract={contract} />

        {isDeployedToActiveChain === true && (
          <Form.Provider
            onFormFinish={async (name, { forms }) => {
              const params = forms[name].getFieldsValue();
              const method = contract.abi.find(
                (item) => item.type === "function" && item.name === name,
              );
              const isView = ["view", "pure"].includes(method?.stateMutability);

              try {
                const args = buildArgs(method, params);

                if (isView) {
                  const result = await readContract(config, {
                    address: contractAddress,
                    abi: contract.abi,
                    functionName: name,
                    args,
                  });
                  setResponses((prev) => ({
                    ...prev,
                    [name]: { result, isLoading: false },
                  }));
                  return;
                }

                setResponses((prev) => ({
                  ...prev,
                  [name]: { result: null, isLoading: true },
                }));
                const hash = await writeContract({
                  address: contractAddress,
                  abi: contract.abi,
                  functionName: name,
                  args,
                });
                setPending({ hash, name });
                openNotification({
                  message: "🔊 New Transaction",
                  description: `${hash}`,
                });
              } catch (error) {
                setResponses((prev) => ({
                  ...prev,
                  [name]: { result: null, isLoading: false },
                }));
                openNotification({
                  message: "📃 Error",
                  description: `${error.shortMessage || error.message}`,
                });
              }
            }}
          >
            <ContractMethods
              displayedContractFunctions={displayedContractFunctions}
              responses={responses}
            />
          </Form.Provider>
        )}
        {isDeployedToActiveChain === false && (
          <>{`The contract is not deployed to the active chain (${chainId}). Switch your active chain or try again later.`}</>
        )}
      </Card>
      <Card
        title={"Contract Events"}
        size="large"
        className="w-full self-start shadow-card lg:w-2/5"
      >
        {events.length === 0 && (
          <p className="text-sm text-fg-muted">
            {contractAddress
              ? "Watching for new events. Only events emitted while this page is open appear here — there is no history."
              : "Load a contract deployed to the active chain to watch its events."}
          </p>
        )}
        {events.map((event, key) => (
          <Card
            title={`${event.eventName} event`}
            size="small"
            style={{ marginBottom: "20px" }}
            key={`${event.transactionHash}-${event.logIndex ?? key}`}
          >
            {getEllipsisTxt(event.transactionHash, 14)}
          </Card>
        ))}
      </Card>
    </div>
  );
}
