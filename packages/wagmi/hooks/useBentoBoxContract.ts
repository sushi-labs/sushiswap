import { bentoBoxV1Abi, bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export const getBentoBoxContractConfig = (chainId: BentoBoxV1ChainId) => ({
  address: bentoBoxV1Address[chainId],
  abi: bentoBoxV1Abi[chainId],
})

export function useBentoBoxContract(chainId: BentoBoxV1ChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getBentoBoxContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}
export type BentoBox = NonNullable<ReturnType<typeof useBentoBoxContract>>
