import React from 'react'
import { useDisconnect } from 'wagmi'
import { classNames  }from '@sushiswap/ui'

type Props = {
  className?: string
}

function Disconnect({ className }: Props): JSX.Element {
  const { disconnect } = useDisconnect()
  return <button className={classNames(className)} onClick={() => disconnect()}>Disconnect</button>
}

export default Disconnect
