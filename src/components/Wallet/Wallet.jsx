import Transfer from "./components/Transfer";
import NativeBalance from "../NativeBalance";
import Address from "../Address/Address";
import Blockie from "../Blockie";
import { Card } from "antd";

function Wallet() {
  return (
    <Card
      className="w-full max-w-[450px] self-start text-base font-medium shadow-card"
      title={
        <div className="flex flex-col items-center gap-1 py-2">
          <Blockie scale={5} avatar currentWallet style />
          <Address size="6" copyable />
          <NativeBalance />
        </div>
      }
    >
      <Transfer />
    </Card>
  );
}

export default Wallet;
