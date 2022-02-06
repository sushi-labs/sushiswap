import { FC } from "react";

import { MetaMask } from "@web3-react/metamask";
import MetaMaskWalletView, { MetaMaskStatusView } from "./MetaMaskWalletView";
import { connectors } from "app/lib/connectors";

const ConnectWalletView: FC = () => {
  return (
    <div>
      {connectors.map(([connector, hooks], i) => {
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
