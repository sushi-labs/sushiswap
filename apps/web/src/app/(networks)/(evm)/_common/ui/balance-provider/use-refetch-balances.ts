import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { EvmChainId } from 'sushi/evm'
import { type SvmChainId, isSvmChainId } from 'sushi/svm'
import { useBalanceProvider } from './balance-provider'

export function useRefetchBalances() {
  const queryClient = useQueryClient()
  const {
    mutate: { refetchChain },
  } = useBalanceProvider()

  return useMemo(() => {
    return {
      refetchChain: (chainId: EvmChainId | SvmChainId) => {
        if (isSvmChainId(chainId)) {
          queryClient.refetchQueries({
            queryKey: ['svm-balances', { chainId }],
            exact: false,
          })
        } else {
          refetchChain(chainId)
        }
      },
    }
  }, [queryClient.refetchQueries, refetchChain])
}
