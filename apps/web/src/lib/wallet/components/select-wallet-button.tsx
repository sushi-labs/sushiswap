'use client'

import { useIsMounted } from '@sushiswap/hooks'
import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, type ButtonProps } from '@sushiswap/ui'
import type React from 'react'
import type { FC } from 'react'
import { useSidebar } from 'src/app/(networks)/_ui/sidebar'
import { SidebarTrigger } from 'src/app/(networks)/_ui/sidebar/sidebar-trigger'
import { useWalletContext } from '../provider'
import type { WalletNamespace } from '../types'

interface SelectWalletButtonProps extends Omit<ButtonProps, 'children'> {
  children?: React.ReactNode
  namespace?: WalletNamespace
  pendingText?: string
}

export const SelectWalletButton: FC<SelectWalletButtonProps> = ({
  namespace,
  children,
  pendingText,
  ...props
}) => {
  const { isOpen, open, close } = useSidebar()
  const isMounted = useIsMounted()

  const { isPending } = useWalletContext()

  // Reconnection can start before a streamed button hydrates. Keep its first
  // client render consistent with the server until this button has mounted.
  if (isMounted && isPending) {
    return (
      <Button loading {...props}>
        {pendingText || 'Authorize Wallet'}
      </Button>
    )
  }

  function onConnect() {
    if (isOpen) close()
    else open('connect', { namespace, closeOnConnect: true })
  }

  return (
    <TraceEvent
      events={[BrowserEvent.onClick]}
      name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
      element={InterfaceElementName.CONNECT_WALLET_BUTTON}
    >
      <SidebarTrigger>
        <Button {...props} onClick={onConnect} testId="connect">
          {children ?? (
            <>
              <span className="hidden sm:block">Connect Wallet</span>
              <span className="block sm:hidden">Connect</span>
            </>
          )}
        </Button>
      </SidebarTrigger>
    </TraceEvent>
  )
}
