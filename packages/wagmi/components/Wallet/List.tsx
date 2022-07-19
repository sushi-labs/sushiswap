import { useIsMounted } from '@sushiswap/hooks'
import { FC, ReactNode } from 'react'
import { useAccount, useConnect } from 'wagmi'

export type RenderProps = ReturnType<typeof useConnect> & { isMounted: boolean }

export interface List {
  children?: ReactNode | ReactNode[] | ((x: RenderProps) => ReactNode | ReactNode[])
}

export const List: FC = () => {
  const isMounted = useIsMounted()
  const { connector: currentConnector, isConnecting } = useAccount()
  const connect = useConnect()

  return (
    <>
      {connect.connectors
        .filter((connector) => isMounted && connector.ready && connector.id !== currentConnector?.id)
        .sort((a, b) =>
          a.name === 'Safe' || b.name == 'safe' ? 1 : a.name === 'MetaMask' || b.name === 'MetaMask' ? -1 : 0
        )
        .map((connector) => (
          <button key={connector.id} onClick={() => connect.connect({ connector })}>
            {connector.name}
            {isConnecting && connector.id === connect.pendingConnector?.id && ' (connecting)'}
          </button>
        ))}
    </>
  )
}
