'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import { useAccount, useWalletContext } from 'src/lib/wallet'
import { useConnection } from 'wagmi'
import { ConnectButton } from '../../components/connect-button'

interface ConnectProps extends ButtonProps {
  networkType: 'evm' | 'svm' | 'all'
}

function Connect({
  children,
  fullWidth = true,
  size = 'xl',
  networkType,
  ...props
}: ConnectProps) {
  const isMounted = useIsMounted()

  const _networkType = networkType === 'all' ? undefined : networkType

  const isWalletConnected = Boolean(useAccount(_networkType))

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
    const midtext =
      networkType === 'evm' ? 'EVM' : networkType === 'svm' ? 'Solana' : ''

    return (
      <ConnectButton
        namespace={_networkType}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        {`Connect ${midtext} Wallet`}
      </ConnectButton>
    )
  }

  return <>{children}</>
}

export { Connect }
