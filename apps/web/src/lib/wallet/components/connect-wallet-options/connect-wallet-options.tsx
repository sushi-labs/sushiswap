'use client'

import { useMemo } from 'react'
import type { WalletWithState } from '../../types'
import { ConnectWalletButton } from './connect-wallet-button'
import { useWallets } from './use-wallets'

interface ConnectWalletOptionssProps {
  onConnect?: () => void
}

export default function ConnectWalletOptions({
  onConnect,
}: ConnectWalletOptionssProps) {
  const _wallets = useWallets()

  const wallets = useMemo(() => {
    return [..._wallets].sort((a, b) => {
      const priority = (wallet: WalletWithState) =>
        wallet.isRecent ? 0 : wallet.isInstalled ? 1 : 2

      return priority(a) - priority(b)
    })
  }, [_wallets])

  return (
    <div className="space-y-2">
      {wallets.map((w) => (
        <ConnectWalletButton key={w.id} wallet={w} onSuccess={onConnect} />
      ))}
    </div>
  )
}
