import { furoVestingRouterAbi, furoVestingRouterAddress, FuroVestingRouterChainId } from '@sushiswap/furo'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export const getFuroVestingRouterContractConfig = (chainId: FuroVestingRouterChainId) => ({
  address: furoVestingRouterAddress[chainId],
  abi: furoVestingRouterAbi[chainId],
})

export function useFuroVestingRouterContract(chainId: FuroVestingRouterChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getFuroVestingRouterContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}

export type FuroVestingRouter = NonNullable<ReturnType<typeof useFuroVestingRouterContract>>
