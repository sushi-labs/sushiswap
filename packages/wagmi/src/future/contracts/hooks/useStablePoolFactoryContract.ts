import { useContract, useProvider } from 'wagmi'
import { getStablePoolFactoryContract } from '../../../hooks'

export function useStablePoolFactoryContract(chainId: number | undefined): ReturnType<typeof useContract> {
  return useContract({
    ...getStablePoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
