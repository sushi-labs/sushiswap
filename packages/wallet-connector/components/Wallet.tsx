import React, { FC, useState, FunctionComponent } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useIsMounted } from '../hooks'

const List = () => {
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

const Disconnect = () => {
  const { disconnect } = useDisconnect()
  return <button onClick={() => disconnect()}>Disconnect</button>
}

export default { List, Disconnect }
