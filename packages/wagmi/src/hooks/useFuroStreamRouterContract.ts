import { furoStreamRouterAbi, furoStreamRouterAddress, FuroStreamRouterChainId } from '@sushiswap/furo'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroStreamRouterContractConfig = (chainId: FuroStreamRouterChainId) => ({
  address: furoStreamRouterAddress[chainId],
  abi: furoStreamRouterAbi[chainId],
})

export function useFuroStreamRouterContract(chainId: FuroStreamRouterChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getFuroStreamRouterContractConfig(chainId), publicClient })
}

export type FuroStreamRouter = NonNullable<ReturnType<typeof useFuroStreamRouterContract>>
