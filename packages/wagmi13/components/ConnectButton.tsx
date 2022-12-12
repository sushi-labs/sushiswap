'use client'

import { Listbox } from '@headlessui/react'
import { ChevronDoubleDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Button, ButtonProps } from '@sushiswap/ui13/components/button'
import {
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  MetamaskIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from '@sushiswap/ui13/components/icons'
import { Loader } from '@sushiswap/ui13/components/Loader'
import React, { ReactNode, useCallback } from 'react'
import { useConnect } from 'wagmi'

import { useAutoConnect } from '../hooks'

const Icons: Record<string, ReactNode> = {
  Injected: <ChevronDoubleDownIcon width={16} height={16} />,
  MetaMask: <MetamaskIcon width={16} height={16} />,
  'Trust Wallet': <TrustWalletIcon width={16} height={16} />,
  WalletConnect: <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
  Safe: <GnosisSafeIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
  supportedNetworks?: ChainId[]
}

export const ConnectButton = <C extends React.ElementType>({
  hack,
  children,
  supportedNetworks,
  ...rest
}: Props<C>) => {
  const { connectors, connect, pendingConnector } = useConnect()
  useAutoConnect()

  const onSelect = useCallback(
    (connectorId: string) => {
      return connect({ connector: connectors.find((el) => el.id === connectorId) })
    },
    [connect, connectors]
  )

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (pendingConnector) {
    return (
      <Button endIcon={<Loader />} variant="filled" color="blue" disabled {...rest}>
        Authorize Wallet
      </Button>
    )
  }

  return (
    <Listbox as="div" onChange={onSelect} className={rest.fullWidth ? 'w-full' : ''}>
      <Listbox.Button {...rest} as="div">
        {children || 'Connect Wallet'}
      </Listbox.Button>
      <Listbox.Options
        as="div"
        className="p-2 min-w-[240px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-md shadow-black/[0.3] bg-slate-900 border border-slate-200/20"
      >
        <p className="text-[10px] p-2 font-semibold uppercase text-slate-400">Connectors</p>
        {connectors.map((connector) => (
          <Listbox.Option
            key={connector.id}
            value={connector.id}
            className="cursor-pointer gap-2 flex text-sm font-semibold hover:text-slate-50 w-full text-slate-400 items-center hover:bg-white/[0.04] rounded-xl p-2 pr-1 py-2.5"
          >
            <div className="group-hover:bg-blue-100 rounded-full group-hover:ring-[5px] group-hover:ring-blue-100">
              {Icons[connector.name] && Icons[connector.name]}
            </div>{' '}
            {connector.name == 'Safe' ? 'Gnosis Safe' : connector.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
