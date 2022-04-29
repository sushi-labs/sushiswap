import React from 'react'
import { useDisconnect } from 'wagmi'

function Disconnect(): JSX.Element {
  const { disconnect } = useDisconnect()
  return <button onClick={() => disconnect()}>Disconnect</button>
}

export default Disconnect
