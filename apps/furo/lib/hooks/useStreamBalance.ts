import { BentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { Amount, Token } from 'sushi/currency'
import { FuroChainId } from '@sushiswap/furo-sdk'
import {
  Address,
  getBentoBoxContractConfig,
  getFuroStreamContractConfig,
  readContract,
} from '@sushiswap/wagmi'
import { useQuery } from '@tanstack/react-query'

interface UseStreamBalance {
  chainId: FuroChainId
  streamId: string | undefined
  token: Token | undefined
  enabled?: boolean
}

export function useStreamBalance({
  chainId,
  streamId,
  token,
  enabled = true,
}: UseStreamBalance) {
  return useQuery({
    queryKey: ['useStreamBalance', { chainId, streamId }],
    queryFn: async () => {
      if (!streamId || !token) return null

      const [balance, rebase] = await Promise.all([
        readContract({
          ...getFuroStreamContractConfig(chainId),
          functionName: 'streamBalanceOf',
          chainId,
          args: [BigInt(streamId)],
        }),
        readContract({
          ...getBentoBoxContractConfig(chainId as BentoBoxChainId),
          functionName: 'totals',
          chainId,
          args: [token.address as Address],
        }),
      ])

      const [senderBalance, recipientBalance] = balance

      console.log(
        'hook',
        senderBalance.toString(),
        recipientBalance.toString(),
        rebase[0].toString(),
        rebase[1].toString(),
      )

      return Amount.fromShare(token, recipientBalance, {
        elastic: rebase[0],
        base: rebase[1],
      })
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && streamId && token),
  })
}
