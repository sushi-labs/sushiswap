import { furoStreamAbi, furoStreamAddress, FuroStreamChainId } from '@sushiswap/furo'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export const getFuroStreamContractConfig = (chainId: FuroStreamChainId) => ({
  address: furoStreamAddress[chainId],
  abi: furoStreamAbi[chainId],
})

export function useFuroStreamContract(chainId: FuroStreamChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getFuroStreamContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}

export type FuroStream = NonNullable<ReturnType<typeof useFuroStreamContract>>
