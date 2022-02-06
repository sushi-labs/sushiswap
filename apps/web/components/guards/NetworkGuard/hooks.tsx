import priorityConnector from "app/lib/connectors/priorityConnector";
const { usePriorityProvider } = priorityConnector;
import useStore from "app/lib/store";
import { useCallback } from "react";
import METAMASK_NETWORKS from "../../../../../packages/config/METAMASK_NETWORKS";
import { WalletError } from "app/lib/utils/WalletError";

export const useNetworkGuard = (networks: number[]) => {
  const chainId = useStore((state) => state.chainId);
  return chainId ? networks.includes(chainId) : undefined;
};

export const useNetworkHandlers = () => {
  const provider = usePriorityProvider();

  const addNetwork = useCallback(
    async (chainId: number, account?: string) => {
      if (!provider || !account)
        return console.error("Dependencies unavailable");

      const params = METAMASK_NETWORKS[chainId];

      provider.send("wallet_addEthereumChain", [params, account]).catch((e) => {
        if (e instanceof WalletError) {
          console.error(`Add chain error ${e.message}`);
        }
      });
    },
    [provider]
  );

  const switchNetwork = useCallback(
    (chainId: number, account?: string) => {
      if (!provider || !account)
        return console.error("Dependencies unavailable");

      provider
        .send("wallet_switchEthereumChain", [
          { chainId: `0x${chainId.toString(16)}` },
          account,
        ])
        .catch((e) => {
          if (e instanceof WalletError && e.code === 4902) {
            void addNetwork(chainId, account);
          }
        });
    },
    [addNetwork, provider]
  );

  return {
    addNetwork,
    switchNetwork,
  };
};
