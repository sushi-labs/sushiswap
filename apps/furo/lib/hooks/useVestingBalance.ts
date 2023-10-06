import { BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Amount, Token } from 'sushi/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import {
  Address,
  getBentoBoxContractConfig,
  getFuroVestingContractConfig,
  readContract,
} from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'

interface UseVestingBalance {
  chainId: FuroChainId
  vestingId: string | undefined
  token: Token | undefined
  enabled?: boolean
}

export function useVestingBalance({
  chainId,
  vestingId,
  token,
  enabled = true,
}: UseVestingBalance) {
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
          ...getBentoBoxContractConfig(chainId as BentoBoxChainId),
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
