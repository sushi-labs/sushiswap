import { FC } from "react";
import { useStore } from "../state/store";

export const WalletStatus: FC = () => {
  const { chainId, account, error, activating, name, connector } = useStore(
    (state) => state
  );

  return (
    <div>
      <h2>Active Wallet status</h2>
      <div>Connector name: {name}</div>
      <div>Chain: {chainId}</div>
      <div>Account: {account}</div>
      <div>Activating: {String(activating)}</div>
      <div>Error: {error?.message}</div>
      <button onClick={() => connector.deactivate()}>Disconnect</button>
    </div>
  );
};
