'use client'

import type { WalletWithState } from '../../types'
import { ConnectWalletButton } from './connect-wallet-button'

interface NamespaceConnectorsListProps {
  wallets: WalletWithState[]
  onConnect?: () => void
}

export default function NamespaceConnectorsList({
  wallets,
  onConnect,
}: NamespaceConnectorsListProps) {
  return (
    <div>
      {wallets.map((wallet) => (
        <ConnectWalletButton
          key={wallet.id}
          wallet={wallet}
          onSuccess={onConnect}
          variant="namespace"
        />
      ))}
    </div>
  )
}
