import dynamic from "next/dynamic";

const ConnectWalletView = dynamic(
  () => import("../components/connect/ConnectWalletView"),
  { ssr: false }
);

const Web = () => {
  return (
    <div>
      <h1>Web</h1>
      <ConnectWalletView />
    </div>
  );
};

export default Web;
