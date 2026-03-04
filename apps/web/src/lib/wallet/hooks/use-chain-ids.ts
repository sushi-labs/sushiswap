import { useMemo } from 'react'
import type { ChainId } from 'sushi'
import { useWallets } from './use-wallets'

export const useChainIds = (): ChainId[] => {
  const { evm, svm, stellar } = useWallets()
  return useMemo(() => {
    return [
      ...new Set(
        [evm?.chainId, svm?.chainId, stellar?.chainId].filter(
          (i) => i !== undefined,
        ),
      ),
    ]
  }, [evm?.chainId, svm?.chainId, stellar?.chainId])
}
