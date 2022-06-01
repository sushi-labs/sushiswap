import { ChevronDoubleDownIcon, LogoutIcon } from '@heroicons/react/outline'
import { shortenAddress } from '@sushiswap/format'
import { useIsMounted } from '@sushiswap/hooks'
import {
  Button as UIButton,
  ButtonProps,
  CoinbaseWalletIcon,
  Loader,
  Menu,
  MetamaskIcon,
  Typography,
  WalletConnectIcon,
} from '@sushiswap/ui'
import React, { ReactNode } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { useWalletState } from '../../hooks'
import { Account } from '..'

const Icons: Record<string, ReactNode> = {
  Injected: <ChevronDoubleDownIcon width={16} height={16} />,
  MetaMask: <MetamaskIcon width={16} height={16} />,
  WalletConnect: <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  hack?: ReturnType<typeof useConnect>
}

export const Button = <C extends React.ElementType>({ hack, children, ...rest }: Props<C>) => {
  const { data } = useAccount()
  const isMounted = useIsMounted()
  const { disconnect } = useDisconnect()
  const hook = hack || useConnect()
  const { isConnected, connectors, connect } = hook
  const { pendingConnection, reconnecting } = useWalletState(hook, data?.address)

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (pendingConnection) {
    return (
      <UIButton
        endIcon={<Loader />}
        variant="filled"
        color="blue"
        disabled
        className={rest.className || '!h-[36px] w-[158px] flex justify-between'}
        {...rest}
      >
        Authorize Wallet
      </UIButton>
    )
  }

  // Disconnected state
  // We are mounted on the client, but we're not connected, and we're not reconnecting (address is not available0
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
              connectors.map((conn) => (
                <Menu.Item key={conn.id} onClick={() => connect(conn)} className="flex items-center gap-3 group">
                  <div className="-ml-[6px] group-hover:bg-blue-100 rounded-full group-hover:ring-[5px] group-hover:ring-blue-100">
                    {Icons[conn.name] && Icons[conn.name]}
                  </div>{' '}
                  {conn.name}
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
      <div className="z-10 flex items-center border-[3px] border-slate-900 bg-slate-800 rounded-[14px]">
        <div className="hidden px-3 sm:block">
          <Account.Balance address={data?.address} />
        </div>
        <Menu
          button={
            <Menu.Button color="gray" className="!h-[36px] !px-3 !rounded-xl flex gap-3">
              {/* <Account.Avatar address={data?.address} /> */}
              <Account.Name address={data?.address}>
                {({ name, isEns }) => (
                  <Typography variant="sm" weight={700} className="tracking-wide text-slate-50">
                    {isEns ? name : name ? shortenAddress(name) : ''}
                  </Typography>
                )}
              </Account.Name>
            </Menu.Button>
          }
        >
          <Menu.Items>
            <div>
              <Menu.Item className="flex items-center gap-3 group" onClick={() => disconnect()}>
                <LogoutIcon width={16} height={16} />
                Disconnect
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    )
  }

  // Placeholder to avoid content jumping
  return <UIButton {...rest}>{children || 'Connect Wallet'}</UIButton>
}
