import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { isEvmChainId } from 'sushi/evm'
import { isStellarChainId } from 'sushi/stellar'
import { isSvmChainId } from 'sushi/svm'
import { useBalanceProvider } from './balance-provider'
import type { BalanceChainId } from './types'

export function useRefetchBalances() {
  const queryClient = useQueryClient()
  const {
    mutate: { refetchChain },
  } = useBalanceProvider()

  return useMemo(() => {
    return {
      refetchChain: (chainId: BalanceChainId) => {
        if (isSvmChainId(chainId)) {
          queryClient.refetchQueries({
            queryKey: ['svm-balances', { chainId }],
            exact: false,
          })
        } else if (isStellarChainId(chainId)) {
          queryClient.refetchQueries({
            queryKey: ['stellar-balances'],
            type: 'active',
          })
        } else if (isEvmChainId(chainId)) {
          refetchChain(chainId, { force: true })
        }
      },
    }
  }, [queryClient.refetchQueries, refetchChain])
}
