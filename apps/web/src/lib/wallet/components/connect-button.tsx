'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, type ButtonProps } from '@sushiswap/ui'
import React, { type FC, useCallback, useMemo, useState } from 'react'
import { EvmWalletConfig } from '../namespaces/evm/config'
import { useWallet } from '../provider'
import { ConnectDialog } from './connect-dialog'

export const ConnectButton: FC<ButtonProps> = ({
  children: _children,
  ...props
}) => {
  const { connect, pending } = useWallet()
  const [open, setOpen] = useState(false)

  const evmOptions = useMemo(() => {
    return EvmWalletConfig.all
      .filter((w) => w.namespace === 'eip155')
      .map((w) => w.id)
  }, [])

  const onClick = useCallback(async () => {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'test') {
      const first = evmOptions[0]
      if (first) await connect(first)
      return
    }

    setOpen(true)
  }, [connect, evmOptions])

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (pending) {
    return (
      <Button loading {...props}>
        Authorize Wallet
      </Button>
    )
  }

  return (
    <>
      <ConnectDialog open={open} onOpenChange={setOpen} />
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
