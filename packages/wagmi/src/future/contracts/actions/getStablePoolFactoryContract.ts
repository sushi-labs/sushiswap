import { stablePoolFactoryAbi, stablePoolFactoryAddress, StablePoolFactoryChainId } from '@sushiswap/trident-core'
import { Address } from 'wagmi'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (stablePoolFactoryAddress?.[chainId as StablePoolFactoryChainId] ?? '') as Address,
  abi: stablePoolFactoryAbi?.[chainId as StablePoolFactoryChainId] ?? [],
})
