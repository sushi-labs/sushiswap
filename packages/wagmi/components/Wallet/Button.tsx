import { ChevronDoubleDownIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import {
  AppearOnMount,
  Button as UIButton,
  ButtonProps,
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  Loader,
  Menu,
  MetamaskIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from '@sushiswap/ui'
import React, { ReactNode } from 'react'
import { useConnect } from 'wagmi'

import { useAutoConnect, useWalletState } from '../../hooks'

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
  appearOnMount?: boolean
}

export const Button = <C extends React.ElementType>({
  hack,
  children,
  supportedNetworks,
  appearOnMount = true,
  ...rest
}: Props<C>) => {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { connectors, connect, pendingConnector } = useConnect()

  const { pendingConnection, reconnecting, isConnected, connecting } = useWalletState(!!pendingConnector)

  useAutoConnect()

  if (connecting && appearOnMount) {
    return <></>
  }

  return (
    <AppearOnMount enabled={appearOnMount}>
      {(isMounted) => {
        // Pending confirmation state
        // Awaiting wallet confirmation
        if (pendingConnection) {
          return (
            <UIButton endIcon={<Loader />} variant="filled" color="blue" disabled {...rest}>
              Authorize Wallet
            </UIButton>
          )
        }

        // Disconnected state
        // We are mounted on the client, but we're not connected, and we're not reconnecting (address is not available)
        if (!isConnected && !reconnecting && isMounted) {
          return (
            <Menu
              className={rest.fullWidth ? 'w-full' : ''}
              button={
                <Menu.Button {...rest} as="div">
                  {children || 'Connect Wallet'}
                </Menu.Button>
              }
            >
              <Menu.Items className="z-[100]">
                <div>
                  {isMounted &&
                    connectors.map((connector) => (
                      <Menu.Item
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        className="flex items-center gap-3 group"
                      >
                        <div className="-ml-[6px] group-hover:bg-blue-100 rounded-full group-hover:ring-[5px] group-hover:ring-blue-100">
                          {Icons[connector.name] && Icons[connector.name]}
                        </div>{' '}
                        {connector.name == 'Safe' ? 'Gnosis Safe' : connector.name}
                      </Menu.Item>
                    ))}
                </div>
              </Menu.Items>
            </Menu>
          )
        }

        return <UIButton {...rest}>{children || 'Connect Wallet'}</UIButton>
      }}
    </AppearOnMount>
  )
}
