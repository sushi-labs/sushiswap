import type { ConnectedWallet } from '@privy-io/react-auth'
import type { ConnectedStandardSolanaWallet } from '@privy-io/react-auth/solana'

export function getEmbeddedPrivyWallet(
  connectedWallets: ConnectedWallet[],
  namespace: 'evm',
): ConnectedWallet | undefined

export function getEmbeddedPrivyWallet(
  connectedWallets: ConnectedStandardSolanaWallet[],
  namespace: 'svm',
): ConnectedStandardSolanaWallet | undefined

export function getEmbeddedPrivyWallet(
  connectedWallets: ConnectedWallet[] | ConnectedStandardSolanaWallet[],
  namespace: 'evm' | 'svm',
): ConnectedWallet | ConnectedStandardSolanaWallet | undefined {
  if (namespace === 'svm') {
    return (connectedWallets as ConnectedStandardSolanaWallet[]).find(
      (wallet) => wallet?.standardWallet?.name === 'Privy',
    )
  }

  return (connectedWallets as ConnectedWallet[]).find(
    (wallet) =>
      wallet.meta.name === 'Privy Wallet' &&
      wallet.connectorType === 'embedded',
  )
}
