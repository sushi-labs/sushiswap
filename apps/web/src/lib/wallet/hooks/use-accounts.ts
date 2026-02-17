'use client'

import { useMemo } from 'react'
import { useWalletContext } from '../provider'
import type { ChainIdForNamespace, WalletNamespace } from '../types'

export function useAccounts() {
  const { connections } = useWalletContext()

  return useMemo(() => {
    const getFirstAddress = <TNamespace extends WalletNamespace>(
      namespace: TNamespace,
    ) => {
      for (const c of connections) {
        if (c.namespace !== namespace) continue
        return c.account as AddressFor<ChainIdForNamespace<typeof namespace>>
      }
      return undefined
    }

    return {
      evm: { address: getFirstAddress('evm') },
      svm: { address: getFirstAddress('svm') },
      stellar: { address: getFirstAddress('stellar') },
    }
  }, [connections])
}
