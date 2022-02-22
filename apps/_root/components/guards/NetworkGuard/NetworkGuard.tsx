import { FC, useState } from 'react'
import useStore from 'app/lib/store'
import { Dialog, Select } from 'ui'
import { NATIVE } from '@sushiswap/core-sdk'
import { ChainId } from 'chain'
import Link from 'next/link'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { useNetworkGuard, useNetworkHandlers } from 'app/components/guards/NetworkGuard/hooks'

interface NetworkGuard {
  networks: number[]
}

const NetworkGuard: FC<NetworkGuard> = ({ networks, children }) => {
  const { chainId, account } = useStore((state) => state)
  const correctNetwork = useNetworkGuard(networks)
  const [desiredChainId, setDesiredChainId] = useState<ChainId>(networks[0]!)
  const { switchNetwork } = useNetworkHandlers()

  if (!chainId) {
    return <>{children}</>
  }

  return (
    <>
      <Dialog open={!Boolean(correctNetwork)} onClose={() => {}}>
        <Dialog.Content>
          <Dialog.Header title="Wrong network" />
          <Dialog.Description as="p">
            This page is not available on the <b>{NATIVE[chainId]?.name}</b> network. Please select one of the networks
            below to connect to an available network.
          </Dialog.Description>
          <Dialog.Description as="div">
            <Select
              onChange={setDesiredChainId}
              value={desiredChainId}
              label={<Select.Label>Available Networks</Select.Label>}
              button={<Select.Button>{NATIVE[desiredChainId]?.name}</Select.Button>}
            >
              <Select.Options>
                {networks.map((network) => (
                  <Select.Option key={network} value={network}>
                    {NATIVE[network]?.name}
                  </Select.Option>
                ))}
              </Select.Options>
            </Select>
          </Dialog.Description>
          <Dialog.Actions className="!flex-col">
            <button
              disabled={!desiredChainId}
              type="button"
              className="justify-center flex-1 px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
              onClick={() => switchNetwork(desiredChainId, account)}
            >
              Connect to {NATIVE[desiredChainId]?.name}
            </button>
            <Link passHref={true} href={`https://${NATIVE[desiredChainId]?.name}.sushi.com`.toLowerCase()}>
              <a className="flex items-center justify-center flex-1 gap-1 px-4 py-2 text-base font-medium text-center text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm">
                {`${NATIVE[desiredChainId]?.name}.sushi.com`.toLowerCase()} <ExternalLinkIcon width={16} />
              </a>
            </Link>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
      {children}
    </>
  )
}

export default NetworkGuard
