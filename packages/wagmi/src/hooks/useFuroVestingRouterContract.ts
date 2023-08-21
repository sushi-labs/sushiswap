import { furoVestingRouterAbi, furoVestingRouterAddress, FuroVestingRouterChainId } from '@sushiswap/furo'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getFuroVestingRouterContractConfig = (chainId: FuroVestingRouterChainId) => ({
  address: furoVestingRouterAddress[chainId],
  abi: furoVestingRouterAbi[chainId],
})

export function useFuroVestingRouterContract(chainId: FuroVestingRouterChainId | undefined) {
  const publicClient = usePublicClient({ chainId })

  if (!chainId) return null
  return getContract({ ...getFuroVestingRouterContractConfig(chainId), publicClient })
}

export type FuroVestingRouter = NonNullable<ReturnType<typeof useFuroVestingRouterContract>>
