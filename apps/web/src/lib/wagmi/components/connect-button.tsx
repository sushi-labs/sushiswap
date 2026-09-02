'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import React, { type FC } from 'react'
import type { WalletNamespace } from 'src/lib/wallet'
import { SelectWalletButton } from 'src/lib/wallet/components/select-wallet-button'
import { isLivePrivyE2eEnabled } from 'src/lib/wallet/privy/privy-e2e-mode'
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
  return process.env.NEXT_PUBLIC_APP_ENV === 'test' &&
    !isLivePrivyE2eEnabled() ? (
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
  const connector =
    connectors.find((candidate) => candidate.type === 'mock') ?? connectors[0]

  const onConnect = () => {
    if (connector) connect({ connector })
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
