import { FC, ReactNode } from 'react'
import { App, CoinbaseWalletIcon, Container, Menu, SushiIcon, Typography, WalletConnectIcon } from '@sushiswap/ui'
import { Account, Wallet } from '@sushiswap/wallet-connector'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import Link from 'next/link'
import { MetamaskIcon } from '@sushiswap/ui/icons/MetamaskIcon'
import { LogoutIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

const Icons: Record<string, ReactNode> = {
  MetaMask: <MetamaskIcon width={16} height={16} />,
  WalletConnect: <WalletConnectIcon width={16} height={16} />,
  'Coinbase Wallet': <CoinbaseWalletIcon width={16} height={16} />,
}

const Header: FC = () => {
  const router = useRouter()
  const { data } = useAccount()
  const { activeChain } = useNetwork()
  const { disconnect } = useDisconnect()

  return (
    <div className="border-b border-dark-900">
      <Container maxWidth="5xl" className="mx-auto px-2">
        <App.Header
          className="h-[54px]"
          brand={<SushiIcon width={32} height={32} onClick={() => router.push('/')} className="cursor-pointer" />}
          nav={
            <div className="flex gap-2 items-center">
              {data?.address && activeChain && (
                <Link passHref={true} href={`/users/${data.address.toLowerCase()}?chainId=${activeChain.id}`}>
                  <Typography
                    variant="sm"
                    weight={700}
                    className="text-white border-b-2 hover:border-blue border-transparent cursor-pointer px-3 flex items-center h-[54px]"
                    component="a"
                  >
                    Dashboard
                  </Typography>
                </Link>
              )}
            </div>
          }
        >
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
                          <Menu.Item
                            key={conn.id}
                            onClick={() => connect(conn)}
                            className="group flex gap-3 items-center"
                          >
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
                  <Menu
                    button={
                      <Menu.Button className="!py-2 ring-1 ring-black !bg-dark-900 border border-dark-700/40 hover:border-dark-700">
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
                )
              }
            }}
          </Wallet.List>
        </App.Header>
      </Container>
    </div>
  )
}

export default Header
