import { FC } from "react";

import { MetaMask } from "@web3-react/metamask";
import { connectors } from "../../../connectors";
import MetaMaskWalletView, { MetaMaskStatusView } from "./MetaMaskWalletView";

const ConnectWalletView: FC = () => {
  return (
    <div>
      {connectors.map(([connector, hooks], i) => {
        if (connector instanceof MetaMask) {
          return (
            <>
              <MetaMaskStatusView connector={connector} hooks={hooks} key={i} />
              <MetaMaskWalletView connector={connector} hooks={hooks} key={i} />
            </>
          );
        }

        return <div key={i} />;
      })}
    </div>
  );
};

export default ConnectWalletView;
