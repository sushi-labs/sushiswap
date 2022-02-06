import { FC, useCallback, useRef, useState } from "react";
import { NATIVE } from "@sushiswap/core-sdk";
import { Dialog, Select } from "ui";
import useStore from "app/lib/store";
import priorityConnector from "app/lib/connectors/priorityConnector";
import METAMASK_NETWORKS from "config/METAMASK_NETWORKS";
const { usePriorityProvider } = priorityConnector;
import Link from "next/link";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { WalletError } from "app/lib/utils/WalletError";

interface NetworkGuard {
  networks: number[];
}

export const useNetworkGuard = (networks: number[]) => {
  const chainId = useStore((state) => state.chainId);
  return chainId ? networks.includes(chainId) : undefined;
};

export const useNetworkHandlers = () => {
  const provider = usePriorityProvider();

  const addNetwork = useCallback(
    async (chainId: number, account?: string) => {
      if (!provider || !account)
        return console.error("Dependencies unavailable");

      const params = METAMASK_NETWORKS[chainId];

      provider.send("wallet_addEthereumChain", [params, account]).catch((e) => {
        if (e instanceof WalletError) {
          console.error(`Add chain error ${e.message}`);
        }
      });
    },
    [provider]
  );

  const switchNetwork = useCallback(
    (chainId: number, account?: string) => {
      if (!provider || !account)
        return console.error("Dependencies unavailable");

      provider
        .send("wallet_switchEthereumChain", [
          { chainId: `0x${chainId.toString(16)}` },
          account,
        ])
        .catch((e) => {
          if (e instanceof WalletError && e.code === 4902) {
            void addNetwork(chainId, account);
          }
        });
    },
    [addNetwork, provider]
  );

  return {
    addNetwork,
    switchNetwork,
  };
};

const NetworkGuard: FC<NetworkGuard> = ({ networks, children }) => {
  const { chainId, account } = useStore((state) => state);
  const correctNetwork = useNetworkGuard(networks);
  const [desiredChainId, setDesiredChainId] = useState<number>(networks?.[0]);
  const { switchNetwork } = useNetworkHandlers();

  if (!chainId) {
    return <>{children}</>;
  }

  return (
    <>
      <Dialog open={!Boolean(correctNetwork)} onClose={() => {}}>
        <Dialog.Content>
          <Dialog.Header title="Wrong network" />
          <Dialog.Description as="p">
            This page is not available on the <b>{NATIVE[chainId].name}</b>{" "}
            network. Please select one of the networks below to connect to an
            available network.
          </Dialog.Description>
          <Dialog.Description as="div">
            <Select
              onChange={setDesiredChainId}
              value={desiredChainId}
              label={<Select.Label>Available Networks</Select.Label>}
              button={
                <Select.Button>{NATIVE[desiredChainId].name}</Select.Button>
              }
            >
              <Select.Options>
                {networks.map((network) => (
                  <Select.Option key={network} value={network}>
                    {NATIVE[network].name}
                  </Select.Option>
                ))}
              </Select.Options>
            </Select>
          </Dialog.Description>
          <Dialog.Actions>
            <Link
              passHref={true}
              href={`https://${NATIVE[desiredChainId].name}.sushi.com`.toLowerCase()}
            >
              <a className="text-center flex flex-1 gap-1 items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm">
                {`${NATIVE[desiredChainId].name}.sushi.com`.toLowerCase()}{" "}
                <ExternalLinkIcon width={16} />
              </a>
            </Link>
            <button
              disabled={!desiredChainId}
              type="button"
              className="flex-1 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
              onClick={() => switchNetwork(desiredChainId, account)}
            >
              Connect to {NATIVE[desiredChainId].name}
            </button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
      {children}
    </>
  );
};

export default NetworkGuard;
