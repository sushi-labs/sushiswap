import { Button } from "ui";
import dynamic from "next/dynamic";

const ConnectWalletView = dynamic(
  () => import("../components/connect/ConnectWalletView"),
  { ssr: false }
);

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <ConnectWalletView />
      <Button />
    </div>
  );
}
