'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { getConnectors } from '@wagmi/core'
import React, { type FC, useCallback, useState } from 'react'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { useConnect } from 'wagmi'
import { useWallet } from '../provider'
import { ConnectModal } from './connect-modal'

export const ConnectButton: FC<ButtonProps> = ({
  children: _children,
  ...props
}) => {
  const { isPending } = useWallet()
  const { mutate: connect } = useConnect()
  const [open, setOpen] = useState(false)

  const onClick = useCallback(async () => {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'test') {
      const first = getConnectors(getWagmiConfig())?.[0]
      if (first) await connect({ connector: first })
      return
    }

    setOpen(true)
  }, [connect])

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (isPending) {
    return (
      <Button loading {...props}>
        Authorize Wallet
      </Button>
    )
  }

  return (
    <>
      <ConnectModal open={open} onOpenChange={setOpen} />
      <TraceEvent
        events={[BrowserEvent.onClick]}
        name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
        element={InterfaceElementName.CONNECT_WALLET_BUTTON}
      >
        <Button
          {...props}
          onClick={onClick}
          onKeyDown={onClick}
          testId="connect"
        >
          <span className="hidden sm:block">Connect Wallet</span>
          <span className="block sm:hidden">Connect</span>
        </Button>
      </TraceEvent>
    </>
  )
}
