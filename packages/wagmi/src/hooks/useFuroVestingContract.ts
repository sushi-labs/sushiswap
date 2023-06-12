import { furoVestingAbi, furoVestingAddress, FuroVestingChainId } from '@sushiswap/furo'
import { getContract } from '@wagmi/core'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'

export const getFuroVestingContractConfig = (chainId: FuroVestingChainId) => ({
  address: furoVestingAddress[chainId],
  abi: furoVestingAbi[chainId],
})

export function useFuroVestingContract(chainId: FuroVestingChainId | undefined) {
  const signerOrProvider = useProvider({ chainId })

  return useMemo(() => {
    if (!chainId) return null

    return getContract({ ...getFuroVestingContractConfig(chainId), signerOrProvider })
  }, [chainId, signerOrProvider])
}

export type FuroVesting = NonNullable<ReturnType<typeof useFuroVestingContract>>
