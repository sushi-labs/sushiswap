import { FC, useCallback, useState } from "react";
import { WalletView } from "../types";
import MetaMaskSelectView from "./MetaMaskSelectView";
import { MetaMask } from "@web3-react/metamask";
import { getAddChainParameters } from "../../../../chains";

interface MetaMaskWalletView extends WalletView {
  connector: MetaMask;
}

const MetaMaskWalletView: FC<MetaMaskWalletView> = ({
  connector,
  hooks: { useChainId, useIsActivating },
}) => {
  const currentChainId = useChainId();
  const isActivating = useIsActivating();

  const [desiredChainId, setDesiredChainId] = useState<number>(-1);
  const setChainId = useCallback(
    (chainId: number) => {
      setDesiredChainId(chainId);
      if (chainId !== -1 && chainId !== currentChainId) {
        return connector.activate(getAddChainParameters(chainId));
      }
    },
    [setDesiredChainId, currentChainId, connector]
  );

  return (
    <div className="flex flex-col">
      <MetaMaskSelectView
        chainId={desiredChainId}
        setChainId={isActivating ? undefined : setChainId}
      />
      <button
        onClick={
          isActivating
            ? undefined
            : () =>
                connector.activate(
                  desiredChainId === -1
                    ? undefined
                    : getAddChainParameters(desiredChainId)
                )
        }
        disabled={isActivating}
      >
        {isActivating ? "Connecting..." : "Connect"}
      </button>
    </div>
  );
};

export default MetaMaskWalletView;
