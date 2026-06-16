'use client'

import { useWalletInfo } from '@solana/connector'
import { useMemo } from 'react'
import { useRecentWallets } from 'src/lib/wallet/hooks/use-recent-wallets'
import type { WalletWithState } from '../../../types'
import { SVM_WALLETS, SvmAdapterId } from '../config'

const PrivyName = 'Email'
const PrivyIcon =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHJ4PSI3IiBmaWxsPSJibGFjayIvPgogIDxwYXRoIGQ9Ik03LjI1IDkuMjVDNy4yNSA4LjY5NzcyIDcuNjk3NzIgOC4yNSA4LjI1IDguMjVIMTkuNzVDMjAuMzAyMyA4LjI1IDIwLjc1IDguNjk3NzIgMjAuNzUgOS4yNVYxOC43NUMyMC43NSAxOS4zMDIzIDIwLjMwMjMgMTkuNzUgMTkuNzUgMTkuNzVIOC4yNUM3LjY5NzcyIDE5Ljc1IDcuMjUgMTkuMzAyMyA3LjI1IDE4Ljc1VjkuMjVaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDxwYXRoIGQ9Ik03LjkgOS41NUwxNCAxNC4yTDIwLjEgOS41NSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjY1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+'
const PrivyId = 'wallet-standard:privy'

const isPrivy = (connectorId: string) => connectorId === PrivyId

export function useSvmWallets() {
  const { wallets } = useWalletInfo()
  const { isRecentWallet } = useRecentWallets()

  return useMemo(() => {
    const map = new Map<string, WalletWithState>()
    for (const wallet of wallets) {
      const walletId = `svm:${wallet.name.toLowerCase()}`

      map.set(walletId, {
        id: walletId,
        namespace: 'svm',
        name: isPrivy(wallet.connectorId) ? PrivyName : wallet.name,
        icon: isPrivy(wallet.connectorId) ? PrivyIcon : (wallet.icon ?? ''),
        adapterId: isPrivy(wallet.connectorId)
          ? SvmAdapterId.Privy
          : SvmAdapterId.Standard,
        isInstalled: true,
        isAvailable: true,
        isRecent: isRecentWallet(walletId),
      })
    }

    for (const wallet of SVM_WALLETS) {
      // skip if already added
      if (map.has(wallet.id)) continue

      // default
      map.set(wallet.id, {
        ...wallet,
        isInstalled: false,
        isAvailable: false,
        isRecent: isRecentWallet(wallet.id),
      })
    }

    return Array.from(map.values())
  }, [wallets, isRecentWallet])
}
