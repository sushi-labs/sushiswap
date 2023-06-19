import {
  constantProductPoolFactoryAddress,
  constantProductPoolFactoryAbi,
  ConstantProductPoolFactoryChainId,
} from '@sushiswap/trident-core'
import { Address, useContract, useProvider } from 'wagmi'

export const getConstantProductPoolFactoryContract = (chainId: number | undefined) => ({
  address: (constantProductPoolFactoryAddress?.[chainId as ConstantProductPoolFactoryChainId] ?? '') as Address,
  abi: constantProductPoolFactoryAbi?.[chainId as ConstantProductPoolFactoryChainId] ?? [],
})

export function useConstantProductPoolFactoryContract(chainId: number | undefined) {
  return useContract({
    ...getConstantProductPoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
