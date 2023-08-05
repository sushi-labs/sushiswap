import {
  stablePoolFactoryAbi as tridentStablePoolFactoryAbi,
  stablePoolFactoryAddress as tridentStablePoolFactoryAddress,
  StablePoolFactoryChainId as TridentStablePoolFactoryChainId,
} from '@sushiswap/trident-core'
import { Address } from 'wagmi'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (tridentStablePoolFactoryAddress?.[chainId as TridentStablePoolFactoryChainId] ?? '') as Address,
  abi: tridentStablePoolFactoryAbi?.[chainId as TridentStablePoolFactoryChainId] ?? [],
})
