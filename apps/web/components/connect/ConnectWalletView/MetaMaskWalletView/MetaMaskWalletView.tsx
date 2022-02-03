import { FC, useCallback, useState } from "react";
import MetaMaskSelectView from "./MetaMaskSelectView";
import { getAddChainParameters } from "../../../../chains";
import { MetaMaskWalletView } from "./types";

const MetaMaskWalletView: FC<MetaMaskWalletView> = ({
  connector,
  hooks: { useChainId, useIsActivating, useError, useIsActive },
}) => {
  const currentChainId = useChainId();
  const isActivating = useIsActivating();
  const error = useError();
  const active = useIsActive();

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

  if (error) {
    return (
      <div className="flex flex-col">
        <MetaMaskSelectView
          chainId={desiredChainId}
          setChainId={isActivating ? undefined : setChainId}
        />
        <button
          onClick={() =>
            connector.activate(
              desiredChainId === -1
                ? undefined
                : getAddChainParameters(desiredChainId)
            )
          }
        >
          Try Again?
        </button>
      </div>
    );
  }

  if (active) {
    return (
      <div className="flex flex-col">
        <MetaMaskSelectView
          chainId={desiredChainId}
          setChainId={isActivating ? undefined : setChainId}
        />
        <button disabled>Connected</button>
      </div>
    );
  }

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
