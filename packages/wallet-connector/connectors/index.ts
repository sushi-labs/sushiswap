import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector, Web3ReactStore } from "@web3-react/types";
import { metaMaskConnector } from "./metaMask";
import { syncStoreWithWeb3 } from "../state/syncStoreWithWeb3";
import { networkConnector } from "./network";

export interface InitializedConnector {
  name: string;
  instance: Connector;
  hooks: Web3ReactHooks;
  store: Web3ReactStore;
}

const connectors: InitializedConnector[] = [
  metaMaskConnector,
  networkConnector,
];

const getActiveConnector = (): InitializedConnector | undefined => {
  return connectors.filter((c) => {
    const { chainId, accounts, activating, error } = c.store.getState();
    return chainId && accounts && !activating && !error;
  })[0];
};

export const getPriorityConnector = (): InitializedConnector => {
  const connector = getActiveConnector() ?? networkConnector;
  syncStoreWithWeb3(connector);
  return connector;
};

export type ConnectorToActivate = {
  name: string;
  activateFn: () => void;
};

export const getConnectorsToActivate = (): ConnectorToActivate[] => {
  return connectors.map((connector) => ({
    name: connector.name,
    activateFn: () => {
      connector.instance.activate();
      syncStoreWithWeb3(connector);
    },
  }));
};
