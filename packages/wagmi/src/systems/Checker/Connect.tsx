'use client'

import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { Dots } from '@sushiswap/ui'

import { ConnectButton } from '../../components'

const Connect: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const { isDisconnected, isConnecting, isReconnecting } = useAccount()

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
