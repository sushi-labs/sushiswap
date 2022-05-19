import { LogoutIcon } from '@heroicons/react/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { Button as UIButton, CoinbaseWalletIcon, Loader, Menu, MetamaskIcon, WalletConnectIcon } from '@sushiswap/ui'
import { FC, ReactElement, ReactNode } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { Account } from '../Account'

const Icons: Record<string, ReactNode> = {
  MetaMask: <MetamaskIcon width={16} height={16} />,
  WalletConnect: <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
}

export type Props = {
  label?: string
  button?: ReactElement<typeof Menu.Button>
  hack?: ReturnType<typeof useConnect>
}

export const Button: FC<Props> = ({ hack, label, button }) => {
  const { data } = useAccount()
  const isMounted = useIsMounted()
  const { disconnect } = useDisconnect()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isConnected, isReconnecting, isConnecting, connectors, connect, pendingConnector } = hack || useConnect()

  if (!!pendingConnector && isConnecting) {
    return (
      <UIButton
        endIcon={<Loader />}
        variant="filled"
        color="blue"
        disabled
        className="!h-[36px] w-[158px] flex justify-between"
      >
        Authorize Wallet
      </UIButton>
    )
  }

  if (isMounted && !isConnected && !isReconnecting && !isConnecting) {
    return (
      <Menu
        button={
          button || (
            <Menu.Button className="w-full min-w-[158px] !h-[36px] btn !bg-blue btn-blue btn-default" as="div">
              {label || 'Connect Wallet'}
            </Menu.Button>
          )
        }
      >
        <Menu.Items>
          <div>
            {connectors.map((conn) => (
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

  if (isMounted && (isConnected || isReconnecting || isConnecting)) {
    if (!data?.address) return null

    return (
      <div className="z-10 flex items-center border-[3px] border-slate-900 bg-slate-800 rounded-[14px]">
        <div className="px-3">
          <Account.Balance address={data?.address} />
        </div>
        <Menu
          button={
            button || (
              <Menu.Button className="!rounded-xl !py-2 !bg-slate-700 p-px border-slate-1000 hover:ring-2 hover:ring-slate-600 flex gap-3">
                <Account.Avatar address={data?.address} />
                <Account.Name address={data?.address} />
              </Menu.Button>
            )
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

  return <></>
}
