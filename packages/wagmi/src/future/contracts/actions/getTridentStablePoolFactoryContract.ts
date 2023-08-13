import {
  tridentStablePoolFactoryAbi,
  tridentStablePoolFactoryAddress,
  TridentStablePoolFactoryChainId,
} from '@sushiswap/trident-sdk'
import { Address } from 'wagmi'

export const getStablePoolFactoryContract = (chainId: number | undefined) => ({
  address: (tridentStablePoolFactoryAddress?.[chainId as TridentStablePoolFactoryChainId] ?? '') as Address,
  abi: tridentStablePoolFactoryAbi?.[chainId as TridentStablePoolFactoryChainId] ?? [],
})
