import {
  constantProductPoolFactoryAbi,
  constantProductPoolFactoryAddress,
  ConstantProductPoolFactoryChainId,
} from '@sushiswap/trident-core'
import { Address } from 'wagmi'

export const getConstantProductPoolFactoryContract = (chainId: number | undefined) => ({
  address: (constantProductPoolFactoryAddress?.[chainId as ConstantProductPoolFactoryChainId] ?? '') as Address,
  abi: constantProductPoolFactoryAbi?.[chainId as ConstantProductPoolFactoryChainId] ?? [],
})
