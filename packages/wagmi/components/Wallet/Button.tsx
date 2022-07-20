import { ChevronDoubleDownIcon, ExternalLinkIcon, LogoutIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import {
  AppearOnMount,
  Button as UIButton,
  ButtonProps,
  classNames,
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  Loader,
  Menu,
  MetamaskIcon,
  Typography,
  WalletConnectIcon,
} from '@sushiswap/ui'
import React, { ReactNode } from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'

import { useAutoConnect, useWalletState } from '../../hooks'
import { Account } from '..'

const Icons: Record<string, ReactNode> = {
  Injected: <ChevronDoubleDownIcon width={16} height={16} />,
  MetaMask: <MetamaskIcon width={16} height={16} />,
  WalletConnect: <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
  Safe: <GnosisSafeIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
  supportedNetworks?: ChainId[]
}

export const Button = <C extends React.ElementType>({ hack, children, supportedNetworks, ...rest }: Props<C>) => {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { connectors, connect, pendingConnector } = hack || useConnect()
  const { pendingConnection, reconnecting, isConnected } = useWalletState(!!pendingConnector)

  useAutoConnect()

  return (
    <AppearOnMount>
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
              <Menu.Items>
                <div>
                  {isMounted &&
                    connectors
                      .sort((a, b) =>
                        a.name === 'Safe' || b.name == 'safe'
                          ? 1
                          : a.name === 'MetaMask' || b.name === 'MetaMask'
                          ? -1
                          : 0
                      )
                      .map((connector) => (
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

        // Connected state
        // Show account name and balance
        if (isMounted && !children) {
          return (
            <div
              className={classNames(
                'z-10 flex items-center border-[3px] border-slate-900 bg-slate-800 rounded-[14px] transform-all',
                rest.className
              )}
            >
              <div className="hidden px-3 sm:block">
                <Account.Balance supportedNetworks={supportedNetworks} address={address} />
              </div>
              <Menu
                button={
                  <Menu.Button color="gray" className="!h-[36px] !px-3 !rounded-xl flex gap-3">
                    {/* <Account.Avatar address={data?.address} /> */}
                    <Account.AddressToEnsResolver address={address}>
                      {({ data: ens }) => (
                        <Typography variant="sm" weight={700} className="tracking-wide text-slate-50">
                          {ens ? ens : address ? shortenAddress(address) : ''}
                        </Typography>
                      )}
                    </Account.AddressToEnsResolver>
                  </Menu.Button>
                }
              >
                <Menu.Items>
                  <div>
                    {address && chain?.id && (
                      <Menu.Item
                        as="a"
                        target="_blank"
                        href={`https://app.sushi.com/account?account=${address}&chainId=${chain.id}`}
                        className="flex items-center gap-3 group text-blue hover:text-white justify-between !pr-4"
                      >
                        View Portfolio
                        <ExternalLinkIcon width={16} height={16} />
                      </Menu.Item>
                    )}
                    <Menu.Item
                      className="flex items-center gap-3 group justify-between !pr-4"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                      <LogoutIcon height={16} />
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          )
        }

        // Placeholder to avoid content jumping
        return <UIButton {...rest}>{children || 'Connect Wallet'}</UIButton>
      }}
    </AppearOnMount>
  )
}
