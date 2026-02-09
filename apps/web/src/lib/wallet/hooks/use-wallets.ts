'use client'

import { useMemo } from 'react'
import { useWalletContext } from '../provider'
import type { WalletNamespace } from '../types'

export function useWallets() {
  const { connections } = useWalletContext()

  return useMemo(() => {
    const getFirstWallet = (namespace: WalletNamespace) => {
      for (const c of connections) {
        if (c.namespace !== namespace) continue
        return c
      }
      return undefined
    }

    return {
      evm: getFirstWallet('evm'),
      svm: getFirstWallet('svm'),
    }
  }, [connections])
}
