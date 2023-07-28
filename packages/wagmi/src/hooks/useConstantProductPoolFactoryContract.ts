import {
  constantProductPoolFactoryAbi,
  constantProductPoolFactoryAddress,
  ConstantProductPoolFactoryChainId,
} from '@sushiswap/trident-core'
import { getContract } from 'viem'
import { Address, usePublicClient } from 'wagmi'

export const getConstantProductPoolFactoryContract = (chainId: number | undefined) => ({
  address: (constantProductPoolFactoryAddress?.[chainId as ConstantProductPoolFactoryChainId] ?? '') as Address,
  abi: constantProductPoolFactoryAbi?.[chainId as ConstantProductPoolFactoryChainId] ?? [],
})

export function useConstantProductPoolFactoryContract(chainId: number | undefined) {
  return getContract({
    ...getConstantProductPoolFactoryContract(chainId),
    publicClient: usePublicClient({ chainId }),
  })
}
