import React from 'react'
import { useConnect } from 'wagmi'
import { useIsMounted } from '@sushiswap/hooks'

function List(): JSX.Element {
  const isMounted = useIsMounted()
  const { activeConnector, connect, connectors, error, isConnecting, isConnected, isDisconnected, pendingConnector } =
    useConnect()
  return (
    <>
      {connectors
        .filter((x) => isMounted && x.ready && x.id !== activeConnector?.id)
        .map((x) => (
          <button key={x.id} onClick={() => connect(x)}>
            {x.name}
            {isConnecting && x.id === pendingConnector?.id && ' (connecting)'}
          </button>
        ))}
    </>
  )
}

export default List
