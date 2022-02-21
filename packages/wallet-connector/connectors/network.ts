import { initializeConnector } from "@web3-react/core";
import { Network } from "@web3-react/network";
import { URLS } from "chain/networkConfig";

const [connector, hooks, store] = initializeConnector<Network>(
  (actions) => {
    return new Network(actions, URLS, false);
  },
  Object.keys(URLS).map((chainId) => Number(chainId))
);

export const networkConnector = {
  name: "Network",
  instance: connector,
  hooks,
  store,
};
