'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import React, { type FC } from 'react'
import type { WalletNamespace } from 'src/lib/wallet'
import { SelectWalletButton } from 'src/lib/wallet/components/select-wallet-button'
import { useWalletContext } from 'src/lib/wallet/provider'
import { useConnectors } from 'wagmi'
import { useConnect } from '../hooks/wallet/use-connect'

interface ConnectButtonProps extends ButtonProps {
  namespace?: WalletNamespace
  pendingText?: string
}

export const ConnectButton: FC<ConnectButtonProps> = ({
  namespace,
  pendingText,
  ...props
}) => {
  return process.env.NEXT_PUBLIC_APP_ENV === 'test' ? (
    <TestConnectButton pendingText={pendingText} {...props} />
  ) : (
    <SelectWalletButton
      namespace={namespace}
      pendingText={pendingText}
      {...props}
    />
  )
}

const TestConnectButton: FC<
  ButtonProps & Pick<ConnectButtonProps, 'pendingText'>
> = ({ children: _children, pendingText, ...props }) => {
  const { pending, connect } = useConnect()
  const connectors = useConnectors()
  const { isPending } = useWalletContext()

  const onConnect = () => {
    connect({ connector: connectors[0] })
  }

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (pending || isPending) {
    return (
      <Button loading {...props}>
        {pendingText || 'Authorize Wallet'}
      </Button>
    )
  }

  return (
    <Button
      {...props}
      onClick={onConnect}
      onKeyDown={onConnect}
      testId="connect"
    >
      <span className="hidden sm:block">Connect Wallet</span>
      <span className="block sm:hidden">Connect</span>
    </Button>
  )
}
