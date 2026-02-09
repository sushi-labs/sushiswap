import { useMemo } from 'react'
import { useWallets } from './use-wallets'

export const useChainIds = () => {
  const { evm, svm } = useWallets()
  return useMemo(() => {
    return [
      ...new Set([evm?.chainId, svm?.chainId].filter((i) => i !== undefined)),
    ]
  }, [evm?.chainId, svm?.chainId])
}
