import { furoStreamRouterAbi, furoStreamRouterAddress, FuroStreamRouterChainId } from '@sushiswap/furo'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export const getFuroStreamRouterContractConfig = (chainId: FuroStreamRouterChainId) => ({
  address: furoStreamRouterAddress[chainId],
  abi: furoStreamRouterAbi[chainId],
})

export function useFuroStreamRouterContract(chainId: FuroStreamRouterChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getFuroStreamRouterContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}

export type FuroStreamRouter = NonNullable<ReturnType<typeof useFuroStreamRouterContract>>
