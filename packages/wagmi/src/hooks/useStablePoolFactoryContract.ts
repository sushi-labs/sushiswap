import { stablePoolFactoryAbi, stablePoolFactoryAddress, StablePoolFactoryChainId } from '@sushiswap/trident-core'
import { Address, usePublicClient } from 'wagmi'
import { getContract } from 'wagmi/actions'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (stablePoolFactoryAddress?.[chainId as StablePoolFactoryChainId] ?? '') as Address,
  abi: stablePoolFactoryAbi?.[chainId as StablePoolFactoryChainId] ?? [],
})

export function useStablePoolFactoryContract(chainId: number | undefined) {
  return getContract({
    ...getStablePoolFactoryContract(chainId),
    walletClient: usePublicClient({ chainId }),
  })
}
