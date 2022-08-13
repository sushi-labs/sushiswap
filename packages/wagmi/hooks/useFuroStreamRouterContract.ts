import { AddressZero } from '@ethersproject/constants'
import furoStreamArtifact from '@sushiswap/furo/artifacts/contracts/FuroStreamRouter.sol/FuroStreamRouter.json'
import furoExports from '@sushiswap/furo/exports.json'
import { useContract, useProvider } from 'wagmi'

export const getFuroStreamRouterContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    // @ts-ignore
    furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroStreamRouter
      ?.address ?? AddressZero,
  contractInterface:
    // @ts-ignore
    furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroStreamRouter?.abi ??
    furoStreamArtifact.abi,
})

export function useFuroStreamRouterContract(chainId: number | undefined) {
  return useContract({
    ...getFuroStreamRouterContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
