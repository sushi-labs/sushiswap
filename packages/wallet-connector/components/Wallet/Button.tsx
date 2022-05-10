import { FC, ReactNode } from 'react'
import { Account, Wallet } from '../index'
import { Menu } from '@sushiswap/ui'
import { useAccount } from 'wagmi'
import { MetamaskIcon } from '@sushiswap/ui'

const Icons: Record<string, ReactNode> = {
  MetaMask: <MetamaskIcon width={24} height={24} />,
}

const Button: FC = () => {
  const { data } = useAccount()

  return (
    <Wallet.List>
      {({ connectors, isConnected, isReconnecting, isConnecting, connect, isMounted }) => {
        if (isMounted && !isConnected && !isReconnecting && !isConnecting) {
          return (
            <Menu
              button={
                <Menu.Button className="bg-blue/40 text-blue-400 hover:text-blue-500 border border-blue-300 hover:border-blue-500">
                  Connect
                </Menu.Button>
              }
            >
              <Menu.Items>
                <div>
                  {connectors.map((conn) => (
                    <Menu.Item key={conn.id} onClick={() => connect(conn)}>
                      {Icons[conn.name] && Icons[conn.name]} {conn.name}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>
          )
        }

        if (isMounted && (isConnected || isReconnecting)) {
          return (
            <div>
              <Account.Name address={data?.address} />
              <Account.Disconnect className="ml-4" />
            </div>
          )
        }
      }}
    </Wallet.List>
  )
}

export default Button
