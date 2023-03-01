import { kashiPairMediumRiskV1Address, kashiPairMediumRiskV1Abi, KashiPairMediumRiskV1ChainId } from '@sushiswap/kashi'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export const getKashiMediumRiskV1ContractConfig = (chainId: KashiPairMediumRiskV1ChainId) => ({
  address: kashiPairMediumRiskV1Address[chainId],
  abi: kashiPairMediumRiskV1Abi[chainId],
})

export function useKashiMediumRiskV1Contract(chainId: KashiPairMediumRiskV1ChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getKashiMediumRiskV1ContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}

export type KashiPairMediumRiskV1 = NonNullable<ReturnType<typeof useKashiMediumRiskV1Contract>>
