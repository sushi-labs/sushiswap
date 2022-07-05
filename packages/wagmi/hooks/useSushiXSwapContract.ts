import { AddressZero } from '@ethersproject/constants'
import sushiXSwapArtifact from '@sushiswap/sushixswap/artifacts/contracts/SushiXSwap.sol/SushiXSwap.json'
import sushiXSwapExports from '@sushiswap/sushixswap/exports.json'
import { SushiXSwap } from '@sushiswap/sushixswap/typechain'
import { useContract, useSigner } from 'wagmi'

export const getSushiXSwapContractConfig = (chainId: number | undefined) => ({
  addressOrName:
    sushiXSwapExports[chainId as unknown as keyof Omit<typeof sushiXSwapExports, '31337'>]?.[0]?.contracts?.SushiXSwap
      ?.address ?? AddressZero,
  contractInterface:
    sushiXSwapExports[chainId as unknown as keyof Omit<typeof sushiXSwapExports, '31337'>]?.[0]?.contracts?.SushiXSwap
      ?.abi ?? sushiXSwapArtifact.abi,
})

export function useSushiXSwapContract(chainId: number | undefined) {
  const { data: signerOrProvider } = useSigner()
  return useContract<SushiXSwap>({
    ...getSushiXSwapContractConfig(chainId),
    signerOrProvider,
  })
}
