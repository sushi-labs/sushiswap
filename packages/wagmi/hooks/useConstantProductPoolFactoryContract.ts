import { AddressZero } from '@ethersproject/constants'
import CPPARTIFACT from '@sushiswap/trident/artifacts/contracts/pool/constant-product/ConstantProductPoolFactory.sol/ConstantProductPoolFactory.json'
import TRIDENT from '@sushiswap/trident/exports/all.json'
import { useContract, useProvider } from 'wagmi'

export const getConstantProductPoolFactoryContract = (chainId: number | undefined) => ({
  // @ts-ignore
  addressOrName: TRIDENT[chainId]?.[0]?.contracts?.ConstantProductPoolFactory?.address ?? AddressZero,
  // @ts-ignore
  contractInterface: TRIDENT[chainId]?.[0]?.contracts?.ConstantProductPoolFactory?.abi ?? CPPARTIFACT.abi,
})

export function useConstantProductPoolFactoryContract(chainId: number | undefined) {
  return useContract({
    ...getConstantProductPoolFactoryContract(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
