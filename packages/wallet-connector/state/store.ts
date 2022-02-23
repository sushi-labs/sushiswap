import create from "zustand";
import { Connector, Web3ReactState } from "@web3-react/types";
import { getPriorityConnector } from "../connectors";

interface StoreState {
  name: string;
  account?: string;
  connector: Connector;
  chainId: Web3ReactState["chainId"];
  activating: Web3ReactState["activating"];
  error: Web3ReactState["error"];
}

/* Represents the currently activated wallet */
export const useStore = create<StoreState>(() => {
  const { instance: connector, store, name } = getPriorityConnector();
  const { accounts, chainId, activating, error } = store.getState();
  return {
    name,
    account: accounts?.[0],
    chainId,
    activating,
    error,
    connector,
  };
});
