import { AddressZero } from '@ethersproject/constants'
import furoStreamArtifact from '@sushiswap/furo/artifacts/contracts/base/FuroStream.sol/FuroStream.json'
import furoExports from '@sushiswap/furo/exports.json'
import { useContract, useProvider } from 'wagmi'

export const getFuroStreamContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.address ?? AddressZero,
  contractInterface:
    furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroStream?.abi ??
    furoStreamArtifact.abi,
})

export function useFuroStreamContract(chainId: number | undefined) {
  return useContract({
    ...getFuroStreamContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
