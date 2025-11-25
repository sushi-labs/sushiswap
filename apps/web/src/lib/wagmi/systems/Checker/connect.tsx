'use client'

import { Button, type ButtonProps } from '@sushiswap/ui'
import type { FC } from 'react'
import { useConnection } from 'wagmi'

import { Dots } from '@sushiswap/ui'

import { useIsMounted } from '@sushiswap/hooks'
import { ConnectButton } from '../../components/connect-button'

const Connect: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const isMounted = useIsMounted()

  const { isDisconnected, isConnecting, isReconnecting } = useConnection()

  if (!isMounted)
    return (
      <Button fullWidth={fullWidth} size={size} {...props}>
        <div className="h-[1ch]" />
      </Button>
    )

  if (isConnecting || isReconnecting) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        <Dots>Checking Wallet</Dots>
      </Button>
    )
  }

  if (isDisconnected)
    return (
      <ConnectButton fullWidth={fullWidth} size={size} {...props}>
        Connect Wallet
      </ConnectButton>
    )

  return <>{children}</>
}

export { Connect }
