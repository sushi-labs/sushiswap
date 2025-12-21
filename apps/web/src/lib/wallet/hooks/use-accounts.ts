'use client'

import { useMemo } from 'react'
import { useWallet } from '../provider'
import type { WalletNamespace } from '../types'

type AccountsState = {
  evm: { address?: string }
  solana: { address?: string }
  aptos: { address?: string }
}

export function useAccounts(): AccountsState {
  const { connections } = useWallet()

  return useMemo(() => {
    const getFirstAddress = (namespace: WalletNamespace) => {
      for (const c of connections) {
        if (c.namespace !== namespace) continue
        // const addr = c.adapter.getAddress()
        // if (addr) return addr
      }
      return undefined
    }

    return {
      evm: { address: getFirstAddress('evm') },
      solana: { address: getFirstAddress('svm') },
      aptos: { address: getFirstAddress('mvm') },
    }
  }, [connections])
}
