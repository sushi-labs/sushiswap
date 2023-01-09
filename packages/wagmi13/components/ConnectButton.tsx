import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChevronDoubleDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { classNames } from '@sushiswap/ui13'
import { Button, ButtonProps } from '@sushiswap/ui13/components/button'
import {
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  MetamaskIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from '@sushiswap/ui13/components/icons'
import { List } from '@sushiswap/ui13/components/list/List'
import { Loader } from '@sushiswap/ui13/components/Loader'
import React, { useCallback } from 'react'
import { useConnect } from 'wagmi'

const Icons: Record<string, React.ElementType> = {
  Injected: ChevronDoubleDownIcon,
  MetaMask: MetamaskIcon,
  'Trust Wallet': TrustWalletIcon,
  WalletConnect: WalletConnectIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Safe: GnosisSafeIcon,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
}

export const ConnectButton = <C extends React.ElementType>({ hack, children, ...rest }: Props<C>) => {
  const { connectors, connect, pendingConnector } = useConnect()

  const onSelect = useCallback(
    (connectorId: string) => {
      return connect({
        connector: connectors.find((el) => el.id === connectorId),
      })
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
    <Popover className={rest.fullWidth ? 'w-full' : ''}>
      {({ open }) => (
        <>
          <Popover.Button as={Button} {...rest} variant="outlined" color="default" size="md">
            <span className="hidden md:block">{children || 'Connect Wallet'}</span>
            <span className="block md:hidden">{children || 'Connect'}</span>
            <ChevronDownIcon
              width={24}
              height={24}
              className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
            />
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-300 ease-out"
            enterFrom="transform translate-y-[-16px] opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform translate-y-[-16px] opacity-0"
          >
            <div className="absolute pt-2 -top-[-1] right-0 sm:w-[320px]">
              <Popover.Panel className="p-4 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                <List className="pt-0">
                  <List.Label>Wallet</List.Label>
                  <List.Control className="bg-gray-100 dark:!bg-slate-700">
                    {connectors.map((connector) => (
                      <List.MenuItem
                        onClick={() => onSelect(connector.id)}
                        icon={Icons[connector.name]}
                        title={connector.name == 'Safe' ? 'Gnosis Safe' : connector.name}
                        key={connector.id}
                        hoverIcon={ChevronRightIcon}
                      />
                    ))}
                  </List.Control>
                </List>
              </Popover.Panel>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  )
}
