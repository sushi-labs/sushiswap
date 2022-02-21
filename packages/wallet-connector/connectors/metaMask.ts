import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

const [connector, hooks, store] = initializeConnector<MetaMask>(
  (actions) => new MetaMask(actions)
);

export const metaMaskConnector = {
  name: "MetaMask",
  instance: connector,
  hooks,
  store,
};
