import { useEffect, useMemo, useRef, useState } from "react";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { mainnet } from "wagmi/chains";
import { useEnsAddress } from "wagmi";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

/**
 * Recipient field that accepts a raw 0x address or an ENS name.
 *
 * ENS resolution is a viem read against mainnet (ENS lives there regardless of
 * the chain the wallet is on), so it needs no API key. Unstoppable Domains was
 * dropped with the Moralis read layer — it has no keyless replacement.
 */
function AddressInput({ onChange, placeholder, autoFocus, style }) {
  const input = useRef(null);
  const [address, setAddress] = useState("");
  const [validatedAddress, setValidatedAddress] = useState("");
  const [isDomain, setIsDomain] = useState(false);

  // `normalize` throws on malformed names, so a failed normalize simply means
  // "not a resolvable name yet" while the user is still typing.
  const ensName = useMemo(() => {
    if (!address.endsWith(".eth")) return undefined;
    try {
      return normalize(address);
    } catch {
      return undefined;
    }
  }, [address]);

  const { data: ensAddress } = useEnsAddress({
    name: ensName,
    chainId: mainnet.id,
    query: { enabled: Boolean(ensName) },
  });

  useEffect(() => {
    if (ensName) {
      setValidatedAddress(ensAddress || "");
      setIsDomain(Boolean(ensAddress));
    } else if (isAddress(address)) {
      setValidatedAddress(getEllipsisTxt(address, 10));
      setIsDomain(false);
    } else {
      setValidatedAddress("");
      setIsDomain(false);
    }
  }, [address, ensName, ensAddress]);

  useEffect(() => {
    if (validatedAddress) onChange(isDomain ? validatedAddress : address);
  }, [onChange, validatedAddress, isDomain, address]);

  const Cross = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#E33132"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={() => {
        setAddress("");
        setValidatedAddress("");
        setIsDomain(false);
        setTimeout(function () {
          input.current.focus();
        });
      }}
      style={{ cursor: "pointer" }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  return (
    <Input
      ref={input}
      size="large"
      placeholder={placeholder ? placeholder : "Public address or ENS name"}
      prefix={
        isDomain || isAddress(address) ? (
          <Blockie
            address={(isDomain ? validatedAddress : address).toLowerCase()}
            size={8}
            scale={3}
          />
        ) : (
          <SearchOutlined />
        )
      }
      suffix={validatedAddress && <Cross />}
      autoFocus={autoFocus}
      value={
        isDomain
          ? `${address} (${getEllipsisTxt(validatedAddress)})`
          : validatedAddress || address
      }
      onChange={(e) => setAddress(e.target.value)}
      disabled={Boolean(validatedAddress)}
      style={
        validatedAddress
          ? { ...style, border: "1px solid rgb(33, 191, 150)" }
          : { ...style }
      }
    />
  );
}

export default AddressInput;
