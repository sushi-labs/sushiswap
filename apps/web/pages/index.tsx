import dynamic from "next/dynamic";
const Account = dynamic(() => import("../components/account"), { ssr: false });
const ConnectWalletView = dynamic(
  () => import("../components/connect/ConnectWalletView"),
  { ssr: false }
);

const Web = () => {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Account />
      <ConnectWalletView />
    </div>
  );
};

export default Web;
