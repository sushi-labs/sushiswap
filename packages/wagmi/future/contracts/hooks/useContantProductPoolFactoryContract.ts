import { useContract, useProvider } from 'wagmi'
import { getConstantProductPoolFactoryContract } from '../../../hooks'

export function useConstantProductPoolFactoryContract(chainId: number | undefined) {
  return useContract({
    ...getConstantProductPoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
