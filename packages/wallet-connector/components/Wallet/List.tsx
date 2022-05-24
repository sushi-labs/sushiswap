import { FC, ReactNode } from 'react'
import { useConnect } from 'wagmi'
import { useIsMounted } from '@sushiswap/hooks'

type RenderProps = ReturnType<typeof useConnect> & { isMounted: boolean }

interface List {
  children?: ReactNode | ReactNode[] | ((x: RenderProps) => ReactNode | ReactNode[])
}

const List: FC = () => {
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

export default List
