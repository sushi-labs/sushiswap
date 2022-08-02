import { AddressZero } from '@ethersproject/constants'
import sushiswapArtifact from '@sushiswap/sushiswap/artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import sushiswapExports from '@sushiswap/sushiswap/exports.json'
import { useContract, useProvider } from 'wagmi'

// TODO CELO NOT FOUND?
export const getV2RouterContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    sushiswapExports[chainId as unknown as keyof Omit<typeof sushiswapExports, '31337' | '42220'>]?.[0]?.contracts
      ?.UniswapV2Router02?.address ?? AddressZero,
  contractInterface:
    sushiswapExports[chainId as unknown as keyof Omit<typeof sushiswapExports, '31337' | '42220'>]?.[0]?.contracts
      ?.UniswapV2Router02?.abi ?? sushiswapArtifact.abi,
})

export function useV2RouterContract(chainId: number | undefined) {
  return useContract({
    ...getV2RouterContractConfig(chainId),
    signerOrProvider: useProvider({ chainId }),
  })
}
