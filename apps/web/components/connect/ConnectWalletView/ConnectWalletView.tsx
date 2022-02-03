import { FC } from "react";

import { MetaMask } from "@web3-react/metamask";
import { connectors } from "../../../connectors";
import MetaMaskWalletView, { MetaMaskStatusView } from "./MetaMaskWalletView";

const ConnectWalletView: FC = () => {
  return (
    <div>
      {connectors.map(([connector, hooks, store], i) => {
        console.log(store);
        if (connector instanceof MetaMask) {
          return (
            <div key={i}>
              <MetaMaskStatusView connector={connector} hooks={hooks} />
              <MetaMaskWalletView connector={connector} hooks={hooks} />
            </div>
          );
        }

        return <div key={i} />;
      })}
    </div>
  );
};

export default ConnectWalletView;
