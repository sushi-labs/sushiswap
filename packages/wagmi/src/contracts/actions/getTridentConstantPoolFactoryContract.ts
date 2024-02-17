import { tridentConstantPoolFactoryAbi } from 'sushi/abi'
import {
  TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS,
  TridentChainId,
} from 'sushi/config'
import { Address } from 'wagmi'

export const getTridentConstantPoolFactoryContract = (
  chainId: number | undefined,
) => ({
  address: (TRIDENT_CONSTANT_POOL_FACTORY_ADDRESS?.[
    chainId as TridentChainId
  ] ?? '') as Address,
  abi: tridentConstantPoolFactoryAbi,
})
