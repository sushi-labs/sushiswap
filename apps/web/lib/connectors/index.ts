import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector, Web3ReactStore } from "@web3-react/types";
import {
  hooks as metaMaskHooks,
  metaMask,
  store as metaMaskStore,
} from "./metaMask";

export const connectors: [Connector, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
];

export const connectorsWithStore: [
  Connector,
  Web3ReactHooks,
  Web3ReactStore
][] = [[metaMask, metaMaskHooks, metaMaskStore]];

export const getPriorityConnectorWithStore = () => {
  const values = connectorsWithStore.map(([, , store]) => {
    const { chainId, accounts, activating, error } = store.getState();
    return Boolean(chainId && accounts && !activating && !error);
  });
  const index = values.findIndex((isActive) => isActive);
  return connectorsWithStore[index === -1 ? 0 : index];
};
