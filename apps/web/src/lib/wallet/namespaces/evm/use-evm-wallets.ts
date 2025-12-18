'use client'

import { useEffect, useMemo, useState } from 'react'
import { useConnectors } from 'wagmi'
import type { WalletWithState } from '../../types'
import { isInjectedConnector } from './adapters/injected'
import { isSafeAppAvailable } from './adapters/safe'
import { EvmWalletConfig } from './config'

const EVM_INJECTED_ID_MAP: Record<string, string> = {
  'io.rabby': 'evm-rabby',
  'io.metamask': 'evm-metamask',
}

export function useEvmWallets() {
  const connectors = useConnectors()

  const injectedConnectors = useMemo(
    () => connectors.filter(isInjectedConnector),
    [connectors],
  )

  const [safeAvailable, setSafeAvailable] = useState(false)

  // Safe app environment
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const ok = await isSafeAppAvailable()
      if (!cancelled) setSafeAvailable(ok)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    const map = new Map<string, WalletWithState & { uid?: string }>()
    for (const connector of injectedConnectors) {
      const walletId =
        EVM_INJECTED_ID_MAP[connector.id] ?? `evm-injected:${connector.id}`

      map.set(walletId, {
        id: walletId,
        namespace: 'eip155',
        name: connector.name,
        icon: connector.icon ?? '', // TODO: placeholder
        adapterId: 'evm-injected',
        installed: true,
        available: true,
        uid: connector.uid,
      })
    }

    for (const wallet of EvmWalletConfig.all) {
      // skip if already added by detection (installed injected)
      if (map.has(wallet.id)) continue

      // always available
      if (
        wallet.adapterId === 'evm-walletconnect' ||
        wallet.adapterId === 'evm-porto' ||
        wallet.id === 'evm-injected'
      ) {
        map.set(wallet.id, { ...wallet, installed: false, available: true })
        continue
      }

      // todo, remove available flag and just don't include safe
      // safe
      if (wallet.adapterId === 'evm-safe') {
        map.set(wallet.id, {
          ...wallet,
          installed: safeAvailable,
          available: safeAvailable,
        })
        continue
      }

      // default
      map.set(wallet.id, { ...wallet, installed: false, available: false })
    }

    return Array.from(map.values())
  }, [injectedConnectors, safeAvailable])
}
