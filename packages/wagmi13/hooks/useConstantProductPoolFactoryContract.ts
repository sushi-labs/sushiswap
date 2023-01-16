import tridentExports from '@sushiswap/trident/exports/all.json'
import { Address, useContract, useProvider } from 'wagmi'

export const getConstantProductPoolFactoryContract = (chainId: number | undefined) => ({
  address: (tridentExports[chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>]?.[0]?.contracts
    ?.ConstantProductPoolFactory?.address ?? '') as Address,
  abi:
    tridentExports[chainId?.toString() as keyof Omit<typeof tridentExports, '31337'>]?.[0]?.contracts
      ?.ConstantProductPoolFactory?.abi ?? [],
})

export function useConstantProductPoolFactoryContract(chainId: number | undefined) {
  return useContract({
    ...getConstantProductPoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
