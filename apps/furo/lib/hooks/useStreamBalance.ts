import { Amount, Token } from '@sushiswap/currency'
import { FuroStreamChainId } from '@sushiswap/furo'
import { JSBI } from '@sushiswap/math'
import { Address, getBentoBoxContractConfig, getFuroStreamContractConfig, readContract } from '@sushiswap/wagmi'
import { BigNumber } from 'ethers'
import { useQuery } from '@tanstack/react-query'

interface UseStreamBalance {
  chainId: FuroStreamChainId
  streamId: string | undefined
  token: Token | undefined
  enabled?: boolean
}

export function useStreamBalance({ chainId, streamId, token, enabled = true }: UseStreamBalance) {
  return useQuery({
    queryKey: ['useStreamBalance', { chainId, streamId }],
    queryFn: async () => {
      if (!streamId || !token) return null

      const [balance, rebase] = await Promise.all([
        readContract({
          ...getFuroStreamContractConfig(chainId),
          functionName: 'streamBalanceOf',
          chainId,
          args: [BigNumber.from(streamId)],
        }),
        readContract({
          ...getBentoBoxContractConfig(chainId),
          functionName: 'totals',
          chainId,
          args: [token.address as Address],
        }),
      ])
      console.log('hook', balance.senderBalance.toString(), balance.recipientBalance.toString(), rebase[0].toString(), rebase[1].toString())

      return Amount.fromShare(token, JSBI.BigInt(balance[1]), {
        elastic: JSBI.BigInt(rebase[0]),
        base: JSBI.BigInt(rebase[1]),
      })
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && streamId && token),
  })
}
