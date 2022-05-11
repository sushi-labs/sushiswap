import { FC, ReactNode } from 'react'
import { CoinbaseWalletIcon, Menu, WalletConnectIcon } from '@sushiswap/ui'
import { useAccount, useDisconnect } from 'wagmi'
import { MetamaskIcon } from '@sushiswap/ui'
import { LogoutIcon } from '@heroicons/react/outline'
import { Account, Wallet } from '..'

const Icons: Record<string, ReactNode> = {
  MetaMask: <MetamaskIcon width={16} height={16} />,
  WalletConnect: <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
}

const Button: FC = () => {
  const { data } = useAccount()
  const { disconnect } = useDisconnect()

  return (
    <Wallet.List>
      {({ connectors, isConnected, isReconnecting, isConnecting, connect, isMounted }) => {
        if (isMounted && !isConnected && !isReconnecting && !isConnecting) {
          return (
            <Menu
              button={
                <Menu.Button className="!py-2 ring-1 ring-neutral-900 !bg-blue/40 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-300/40">
                  Connect
                </Menu.Button>
              }
            >
              <Menu.Items>
                <div>
                  {connectors.map((conn) => (
                    <Menu.Item key={conn.id} onClick={() => connect(conn)} className="group flex gap-3 items-center">
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

        if (isMounted && (isConnected || isReconnecting)) {
          return (
            <div className="z-10 flex items-center border-[3px] border-dark-900 bg-dark-900 rounded-[14px]">
              <div className="px-3">
                <Account.Balance address={data?.address} />
              </div>
              <Menu
                button={
                  <Menu.Button className="!rounded-xl !py-2 !bg-dark-800 p-px border-dark-1000 hover:ring-1 hover:ring-dark-700 flex gap-3">
                    <Account.Avatar address={data?.address} />
                    <Account.Name address={data?.address} />
                  </Menu.Button>
                }
              >
                <Menu.Items>
                  <div>
                    <Menu.Item className="group flex gap-3 items-center" onClick={() => disconnect()}>
                      <LogoutIcon width={16} height={16} />
                      Disconnect
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          )
        }
      }}
    </Wallet.List>
  )
}

export default Button
