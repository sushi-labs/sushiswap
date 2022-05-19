import { useIsMounted } from '@sushiswap/hooks'
import { FC, ReactNode } from 'react'
import { useConnect } from 'wagmi'

export type RenderProps = ReturnType<typeof useConnect> & { isMounted: boolean }

export interface List {
  children?: ReactNode | ReactNode[] | ((x: RenderProps) => ReactNode | ReactNode[])
}

export const List: FC = () => {
  const isMounted = useIsMounted()
  const connect = useConnect()

  return (
    <>
      {connect.connectors
        .filter((x) => isMounted && x.ready && x.id !== connect.activeConnector?.id)
        .map((x) => (
          <button key={x.id} onClick={() => connect.connect(x)}>
            {x.name}
            {connect.isConnecting && x.id === connect.pendingConnector?.id && ' (connecting)'}
          </button>
        ))}
    </>
  )
}
