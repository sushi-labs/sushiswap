import { bentoBoxV1Abi, bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getBentoBoxContractConfig = (chainId: BentoBoxV1ChainId) => ({
  address: bentoBoxV1Address[chainId],
  abi: bentoBoxV1Abi[chainId],
})

export function useBentoBoxContract(chainId: BentoBoxV1ChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getBentoBoxContractConfig(chainId), publicClient })
}
export type BentoBox = NonNullable<ReturnType<typeof useBentoBoxContract>>
