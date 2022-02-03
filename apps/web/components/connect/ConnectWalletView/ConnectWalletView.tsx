import { FC } from "react";

import { MetaMask } from "@web3-react/metamask";
import { connectors } from "../../../connectors";
import MetaMaskWalletView from "./MetaMaskWalletView";

const ConnectWalletView: FC = () => {
  return (
    <div>
      {connectors.map(([connector, hooks]) => {
        if (connector instanceof MetaMask) {
          return <MetaMaskWalletView connector={connector} hooks={hooks} />;
        }

        return <></>;
      })}
    </div>
  );
};

export default ConnectWalletView;
