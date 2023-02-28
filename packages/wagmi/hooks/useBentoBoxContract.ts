import { BentoBoxV1ChainId } from '@sushiswap/bentobox/exports'
import { getBentoBoxContractConfig } from '@sushiswap/wagmi-config'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export function useBentoBoxContract(chainId: BentoBoxV1ChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getBentoBoxContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}
