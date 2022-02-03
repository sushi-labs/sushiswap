import type { Web3ReactHooks } from "@web3-react/core";
import type { Connector, Web3ReactStore } from "@web3-react/types";
import {
  hooks as metaMaskHooks,
  metaMask,
  store as metaMaskStore,
} from "./metaMask";

export const connectors: [Connector, Web3ReactHooks, Web3ReactStore][] = [
  [metaMask, metaMaskHooks, metaMaskStore],
];
