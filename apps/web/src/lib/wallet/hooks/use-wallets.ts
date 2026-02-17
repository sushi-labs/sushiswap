'use client'

import { useMemo } from 'react'
import { useWalletContext } from '../provider'
import type {
  ChainIdForNamespace,
  WalletConnection,
  WalletNamespace,
} from '../types'

export function useWallets() {
  const { connections } = useWalletContext()

  return useMemo(() => {
    const getFirstWallet = <TNamespace extends WalletNamespace>(
      namespace: TNamespace,
    ) => {
      for (const c of connections) {
        if (c.namespace !== namespace) continue
        return c as WalletConnection<ChainIdForNamespace<typeof namespace>>
      }
      return undefined
    }

    return {
      evm: getFirstWallet('evm'),
      svm: getFirstWallet('svm'),
      stellar: getFirstWallet('stellar'),
    }
  }, [connections])
}
