import {
  tridentConstantPoolFactoryAbi,
  tridentConstantPoolFactoryAddress,
  TridentConstantPoolFactoryChainId,
} from '@sushiswap/trident-sdk'
import { Address } from 'wagmi'

export const getTridentConstantPoolFactoryContract = (chainId: number | undefined) => ({
  address: (tridentConstantPoolFactoryAddress?.[chainId as TridentConstantPoolFactoryChainId] ?? '') as Address,
  abi: tridentConstantPoolFactoryAbi?.[chainId as TridentConstantPoolFactoryChainId] ?? [],
})
