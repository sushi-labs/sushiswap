import { tridentConstantPoolFactoryAbi } from 'sushi/abi'
import {
  TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from 'sushi/config'
import { getContract } from 'viem'
import { Address, usePublicClient } from 'wagmi'

export const getTridentConstantPoolFactoryContract = (
  chainId: number | undefined,
) => ({
  address: (TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS?.[
    chainId as TridentChainId
  ] ?? '') as Address,
  abi: tridentConstantPoolFactoryAbi,
})

export function useTridentConstantPoolFactoryContract(
  chainId: number | undefined,
) {
  return getContract({
    ...getTridentConstantPoolFactoryContract(chainId),
    publicClient: usePublicClient({ chainId }),
  })
}
