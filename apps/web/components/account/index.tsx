import { FC } from "react";
import priorityConnector from "app/connectors/priorityConnector";
import useStore from "app/store";
const { usePriorityWeb3React } = priorityConnector;

const Account: FC = () => {
  const { chainId, account } = usePriorityWeb3React(undefined);
  const { getState } = useStore((state) => state.web3);
  const { accounts: accountsFromStore, chainId: chainIdFromStore } = getState();

  return (
    <div className="flex flex-col">
      <h2>ChainId Using Hook: {chainId}</h2>
      <h3>Account Using Hook: {account}</h3>
      <h2>ChainId From Store: {chainIdFromStore}</h2>
      <h3>Account From Store: {accountsFromStore}</h3>
    </div>
  );
};

export default Account;
