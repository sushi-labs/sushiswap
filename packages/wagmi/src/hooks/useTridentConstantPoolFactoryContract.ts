import {
  constantProductPoolFactoryAbi as tridentConstantPoolFactoryAbi,
  constantProductPoolFactoryAddress as tridentConstantPoolFactoryAddress,
  ConstantProductPoolFactoryChainId as TridentConstantPoolFactoryChainId,
} from '@sushiswap/trident-core'
import { getContract } from 'viem'
import { Address, usePublicClient } from 'wagmi'

export const getTridentConstantPoolFactoryContract = (chainId: number | undefined) => ({
  address: (tridentConstantPoolFactoryAddress?.[chainId as TridentConstantPoolFactoryChainId] ?? '') as Address,
  abi: tridentConstantPoolFactoryAbi?.[chainId as TridentConstantPoolFactoryChainId] ?? [],
})

export function useTridentConstantPoolFactoryContract(chainId: number | undefined) {
  return getContract({
    ...getTridentConstantPoolFactoryContract(chainId),
    publicClient: usePublicClient({ chainId }),
  })
}
