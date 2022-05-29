import { AddressZero } from '@ethersproject/constants'
import furoVestingArtifact from '@sushiswap/furo/artifacts/contracts/base/FuroVesting.sol/FuroVesting.json'
import furoExports from '@sushiswap/furo/exports.json'
import { useContract, useProvider } from 'wagmi'

export const getFuroVestingContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.address ?? AddressZero,
  contractInterface:
    furoExports[chainId as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.abi ??
    furoVestingArtifact.abi,
})

export function useFuroVestingContract(chainId: number | undefined) {
  return useContract({
    ...getFuroVestingContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
