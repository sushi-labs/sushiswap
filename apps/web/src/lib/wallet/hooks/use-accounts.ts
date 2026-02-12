'use client'

import { useMemo } from 'react'
import { useWalletContext } from '../provider'
import type { WalletNamespace } from '../types'

type AccountsState = Record<WalletNamespace, { address: string | undefined }>

export function useAccounts(): AccountsState {
  const { connections } = useWalletContext()

  return useMemo(() => {
    const getFirstAddress = (namespace: WalletNamespace) => {
      for (const c of connections) {
        if (c.namespace !== namespace) continue
        return c.account
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
