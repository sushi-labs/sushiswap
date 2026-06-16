import type { ConnectedWallet } from '@privy-io/react-auth'

export const getEmbeddedPrivyWallet = (connectedWallets: ConnectedWallet[]) => {
  return connectedWallets?.find(
    (wallet) =>
      wallet.meta.name === 'Privy Wallet' &&
      wallet.connectorType === 'embedded',
  )
}
