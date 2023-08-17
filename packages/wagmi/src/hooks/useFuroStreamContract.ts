import { furoStreamAbi, furoStreamAddress, FuroStreamChainId } from '@sushiswap/furo'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroStreamContractConfig = (chainId: FuroStreamChainId) => ({
  address: furoStreamAddress[chainId],
  abi: furoStreamAbi[chainId],
})

export function useFuroStreamContract(chainId: FuroStreamChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getFuroStreamContractConfig(chainId), publicClient })
}

export type FuroStream = NonNullable<ReturnType<typeof useFuroStreamContract>>
