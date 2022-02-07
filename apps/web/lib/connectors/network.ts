import { initializeConnector } from "@web3-react/core";
import { Network } from "@web3-react/network";
import { URLS } from "config/networks";

function getCookie(key: string) {
  const name = key + "=";
  const cookie = decodeURIComponent(document.cookie);
  const entries = cookie.split(";");
  for (let i = 0; i < entries.length; i++) {
    let c = entries[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const [network, hooks] = initializeConnector<Network>(
  (actions) => {
    const provider = new Network(actions, URLS, false);
    void provider.activate(Number(getCookie("chain-id")));
    return provider;
  },
  Object.keys(URLS).map((chainId) => Number(chainId))
);
