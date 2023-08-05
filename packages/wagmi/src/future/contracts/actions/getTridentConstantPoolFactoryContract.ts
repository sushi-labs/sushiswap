import {
  constantProductPoolFactoryAbi as tridentConstantPoolFactoryAbi,
  constantProductPoolFactoryAddress as tridentConstantPoolFactoryAddress,
  ConstantProductPoolFactoryChainId as TridentConstantPoolFactoryChainId,
} from '@sushiswap/trident-core'
import { Address } from 'wagmi'

export const getTridentConstantPoolFactoryContract = (chainId: number | undefined) => ({
  address: (tridentConstantPoolFactoryAddress?.[chainId as TridentConstantPoolFactoryChainId] ?? '') as Address,
  abi: tridentConstantPoolFactoryAbi?.[chainId as TridentConstantPoolFactoryChainId] ?? [],
})
