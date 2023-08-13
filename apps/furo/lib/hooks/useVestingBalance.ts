import { Amount, Token } from '@sushiswap/currency'
import { FuroStreamChainId } from '@sushiswap/furo'
import { Address, getBentoBoxContractConfig, getFuroVestingContractConfig, readContract } from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'

interface UseVestingBalance {
  chainId: FuroStreamChainId
  vestingId: string | undefined
  token: Token | undefined
  enabled?: boolean
}

export function useVestingBalance({ chainId, vestingId, token, enabled = true }: UseVestingBalance) {
  return useQuery({
    queryKey: ['useVestingBalance', { chainId, vestingId }],
    queryFn: async () => {
      if (!vestingId || !token) return null

      const [balance, rebase] = await Promise.all([
        readContract({
          ...getFuroVestingContractConfig(chainId),
          functionName: 'vestBalance',
          chainId,
          args: [BigInt(vestingId)],
        }),
        readContract({
          ...getBentoBoxContractConfig(chainId),
          functionName: 'totals',
          chainId,
          args: [token.address as Address],
        }),
      ])

      return Amount.fromShare(token, balance, {
        elastic: rebase[0],
        base: rebase[1],
      })
    },
    refetchInterval: 2000,
    enabled: Boolean(enabled && vestingId && token),
  })
}
