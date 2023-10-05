import { tridentStablePoolFactoryAbi } from 'sushi/abi'
import { TRIDENT_STABLE_POOL_FACTORY_ADDRESS, TridentChainId } from '@sushiswap/trident-sdk'
import { Address } from 'wagmi'

export const getTridentStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (TRIDENT_STABLE_POOL_FACTORY_ADDRESS?.[chainId as TridentChainId] ?? '') as Address,
  abi: tridentStablePoolFactoryAbi,
})
