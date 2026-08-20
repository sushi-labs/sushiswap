'use client'

import { useConnector } from '@solana/connector/react'
import { useIsMounted } from '@sushiswap/hooks'
import { Button, type ButtonProps } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
import {
  type WalletNamespace,
  getNameFromNamespace,
  useAccount,
  useIsEvmWalletLoading,
  useIsSvmWalletLoading,
  useWalletContext,
} from 'src/lib/wallet'
import { useConnection } from 'wagmi'
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

  const { isPending, isConnected: isWalletConnected } = useWalletContext()
  const { address: wagmiAddress } = useConnection()
  const { wallet: svmConnector } = useConnector()
  const isEvmConnected = Boolean(wagmiAddress)
  const isSvmConnected = svmConnector.status === 'connected'
  const isConnected = isWalletConnected || isEvmConnected || isSvmConnected
  const isNamespaceConnected =
    Boolean(useAccount(namespace)) ||
    (namespace === 'evm' && isEvmConnected) ||
    (namespace === 'svm' && isSvmConnected)
  const isEvmWalletLoading = useIsEvmWalletLoading()
  const isSvmWalletLoading = useIsSvmWalletLoading()
  const requiresNamespaceConnection = Boolean(
    namespace && !isNamespaceConnected,
  )
  const requiresConnection = !isConnected || requiresNamespaceConnection
  const isWalletLoading = getIsWalletLoading({
    namespace,
    evm: isEvmWalletLoading,
    svm: isSvmWalletLoading,
  })

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

  if (requiresConnection && isWalletLoading) {
    return (
      <Button loading fullWidth={fullWidth} size={size} {...props}>
        Checking Wallet
      </Button>
    )
  }

  if (requiresConnection) {
    const shouldRestrictNamespace = Boolean(namespace)
    const midtext = namespace ? getNameFromNamespace(namespace) : ''

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

function getIsWalletLoading({
  namespace,
  evm,
  svm,
}: {
  namespace: WalletNamespace | undefined
  evm: boolean
  svm: boolean
}): boolean {
  switch (namespace) {
    case 'evm':
      return evm
    case 'svm':
      return svm
    case 'stellar':
      return false
    default:
      return evm || svm
  }
}

export { Connect }
