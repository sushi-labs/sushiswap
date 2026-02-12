import { useMemo } from 'react'
import { useWallets } from './use-wallets'

export const useChainIds = () => {
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
