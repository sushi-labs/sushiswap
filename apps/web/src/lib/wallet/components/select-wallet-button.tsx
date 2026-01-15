'use client'

import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, type ButtonProps } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { useWalletContext } from '../provider'
import type { WalletNamespace } from '../types'

interface SelectWalletButtonProps extends Omit<ButtonProps, 'children'> {
  namespace?: WalletNamespace
}

export const SelectWalletButton: FC<SelectWalletButtonProps> = ({
  namespace,
  children,
  ...props
}) => {
  const { open } = useSidebar()

  const { isPending } = useWalletContext()

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (isPending) {
    return (
      <Button loading {...props}>
        Authorize Wallet
      </Button>
    )
  }

  const onConnect = () => open('connect', { namespace, closeOnConnect: true })

  return (
    <TraceEvent
      events={[BrowserEvent.onClick]}
      name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
      element={InterfaceElementName.CONNECT_WALLET_BUTTON}
    >
      <Button
        {...props}
        onClick={onConnect}
        onKeyDown={onConnect}
        testId="connect"
      >
        {children ?? (
          <>
            <span className="hidden sm:block">Connect Wallet</span>
            <span className="block sm:hidden">Connect</span>
          </>
        )}
      </Button>
    </TraceEvent>
  )
}
