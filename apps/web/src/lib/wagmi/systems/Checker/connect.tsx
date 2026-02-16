'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import {
  type WalletNamespace,
  useAccount,
  useWalletContext,
} from 'src/lib/wallet'
import { ConnectButton } from '../../components/connect-button'

export interface ConnectProps extends ButtonProps {
  namespace?: WalletNamespace
}

function Connect({
  children,
  fullWidth = true,
  size = 'xl',
  namespace,
  ...props
}: ConnectProps) {
  const isMounted = useIsMounted()

  const { isPending, isConnected } = useWalletContext()
  const isNamespaceConnected = Boolean(useAccount(namespace))
  const requiresNamespaceConnection = Boolean(
    namespace && !isNamespaceConnected,
  )

  if (!isMounted)
    return (
      <Button fullWidth={fullWidth} size={size} {...props}>
        <div className="h-[1ch]" />
      </Button>
    )

  if (isPending) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        <Dots>Checking Wallet</Dots>
      </Button>
    )
  }

  if (!isConnected || requiresNamespaceConnection) {
    const shouldRestrictNamespace = Boolean(namespace)
    const midtext =
      namespace === 'evm' ? 'EVM' : namespace === 'svm' ? 'Solana' : ''

    return (
      <ConnectButton
        namespace={shouldRestrictNamespace ? namespace : undefined}
        fullWidth={fullWidth}
        size={size}
        {...props}
      >
        {shouldRestrictNamespace
          ? `Connect ${midtext} Wallet`
          : 'Connect Wallet'}
      </ConnectButton>
    )
  }

  return <>{children}</>
}

export { Connect }
