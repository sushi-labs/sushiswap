import { stablePoolFactoryAbi, stablePoolFactoryAddress, StablePoolFactoryChainId } from '@sushiswap/trident-core'
import { Address, useContract, useProvider } from 'wagmi'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (stablePoolFactoryAddress?.[chainId as StablePoolFactoryChainId] ?? '') as Address,
  abi: stablePoolFactoryAbi?.[chainId as StablePoolFactoryChainId] ?? [],
})

export function useStablePoolFactoryContract(chainId: number | undefined): ReturnType<typeof useContract> {
  return useContract({
    ...getStablePoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
