'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import type { FC } from 'react'
import { useAccount } from 'src/lib/wallet'
import { useConnection } from 'wagmi'
import { ConnectButton } from '../../components/connect-button'

const Connect: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const isMounted = useIsMounted()

  const isWalletConnected = Boolean(useAccount())
  const isEvmWalletConnected = Boolean(useAccount('evm'))

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

  if (isDisconnected) {
    const shouldRestrictToEvm = isWalletConnected && !isEvmWalletConnected

    return (
      <ConnectButton
        namespace={shouldRestrictToEvm ? 'evm' : undefined}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        {shouldRestrictToEvm ? 'Connect EVM Wallet' : 'Connect Wallet'}
      </ConnectButton>
    )
  }

  return <>{children}</>
}

export { Connect }
