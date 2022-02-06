import dynamic from "next/dynamic";
import NetworkGuard from "app/components/guards/NetworkGuard";
import { ChainId } from "@sushiswap/core-sdk";

const Account = dynamic(() => import("../components/account"), { ssr: false });
const ConnectWalletView = dynamic(
  () => import("../components/connect/ConnectWalletView"),
  { ssr: false }
);

const Web = () => {
  return (
    <NetworkGuard networks={[ChainId.ETHEREUM]}>
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <Account />
        <ConnectWalletView />
      </div>
    </NetworkGuard>
  );
};

export default Web;
