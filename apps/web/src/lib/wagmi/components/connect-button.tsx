'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import React, { type FC } from 'react'
import { SelectWalletButton } from 'src/lib/wallet/components/select-wallet-button'
import { useConnectors } from 'wagmi'
import { useConnect } from '../hooks/wallet/useConnect'

export const ConnectButton: FC<ButtonProps> = ({
  children: _children,
  ...props
}) => {
  return process.env.NEXT_PUBLIC_APP_ENV === 'test' ? (
    <TestConnectButton {...props} />
  ) : (
    <SelectWalletButton {...props} />
  )
}

const TestConnectButton: FC<ButtonProps> = ({
  children: _children,
  ...props
}) => {
  const { pending, connect } = useConnect()
  const connectors = useConnectors()

  const onConnect = () => {
    connect({ connector: connectors[0] })
  }

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
