import { AddressZero } from '@ethersproject/constants'
import furoVestingArtifact from '@sushiswap/furo/artifacts/contracts/base/FuroVesting.sol/FuroVesting.json'
import furoExports from '@sushiswap/furo/exports.json'
import { useContract, useProvider } from 'wagmi'

export const getFuroVestingRouterContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroVestingRouter
      ?.address ?? AddressZero,
  contractInterface:
    furoExports[chainId as unknown as keyof Omit<typeof furoExports, '31337'>]?.[0]?.contracts?.FuroVestingRouter
      ?.abi ?? furoVestingArtifact.abi,
})

export function useFuroVestingRouterContract(chainId: number | undefined) {
  return useContract({
    ...getFuroVestingRouterContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
