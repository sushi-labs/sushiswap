'use client'

import { useMemo } from 'react'
import type { WalletNamespace, WalletWithState } from '../../types'
import { ConnectWalletButton } from './connect-wallet-button'
import { useWallets } from './use-wallets'

type WalletOption =
  | { type: 'single'; wallet: WalletWithState }
  | { type: 'multi'; wallets: WalletWithState[] }

interface ConnectWalletOptionsProps {
  namespace?: WalletNamespace
  onConnect?: () => void
  onSelectMultiNamespaceWallet?: (wallets: WalletWithState[]) => void
}

export default function ConnectWalletOptions({
  namespace,
  onConnect,
  onSelectMultiNamespaceWallet,
}: ConnectWalletOptionsProps) {
  const wallets = useWallets()

  const options: WalletOption[] = useMemo(() => {
    const sortedWallets = [...wallets].sort((a, b) => {
      const priority = (wallet: WalletWithState) =>
        wallet.isRecent ? 0 : wallet.isInstalled ? 1 : 2

      return priority(a) - priority(b)
    })

    if (namespace) {
      return sortedWallets
        .filter((wallet) => wallet.namespace === namespace)
        .map((wallet) => ({ type: 'single', wallet }))
    }

    const byName = new Map<string, WalletWithState[]>()

    for (const wallet of sortedWallets) {
      const key = wallet.name.toLowerCase()
      byName.set(key, [...(byName.get(key) ?? []), wallet])
    }

    return Array.from(byName.values()).map((wallets) =>
      wallets.length === 1
        ? { type: 'single', wallet: wallets[0] }
        : { type: 'multi', wallets: wallets },
    )
  }, [wallets, namespace])

  return (
    <div>
      {options.map((option) =>
        option.type === 'multi' ? (
          <ConnectWalletButton
            key={option.wallets[0].id}
            wallet={option.wallets[0]}
            onClick={() => onSelectMultiNamespaceWallet?.(option.wallets)}
          />
        ) : (
          <ConnectWalletButton
            key={option.wallet.id}
            wallet={option.wallet}
            onSuccess={onConnect}
          />
        ),
      )}
    </div>
  )
}
