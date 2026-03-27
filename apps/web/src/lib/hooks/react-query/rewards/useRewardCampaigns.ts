import { useQuery } from '@tanstack/react-query'
import { type EvmAddress, type EvmChainId, EvmToken } from 'sushi/evm'
import { getAddress } from 'viem/utils'
import type * as z from 'zod'
import { merklCampaignsValidator } from './validator'

interface UseRewardCampaignsParams {
  pool: EvmAddress | undefined
  chainId: EvmChainId | undefined
  enabled?: boolean
}

export type RewardCampaign = Omit<
  z.infer<typeof merklCampaignsValidator>[number],
  'rewardToken' | 'amount'
> & {
  isLive: boolean
  rewardToken: EvmToken
  amount: number
}

export const useRewardCampaigns = ({
  pool,
  chainId,
  enabled = true,
}: UseRewardCampaignsParams) => {
  return useQuery({
    queryKey: ['merklRewardCampaigns', { pool, chainId }],
    queryFn: async () => {
      if (!pool || !chainId) throw new Error()

      const url = new URL(`https://api.merkl.xyz/v4/campaigns`)
      url.searchParams.set('chainId', `${chainId}`)
      url.searchParams.set('mainParameter', `${getAddress(pool)}`)
      url.searchParams.set('test', `${false}`)

      const res = await fetch(url)
      const json = await res.json()
      const parsed = merklCampaignsValidator.parse(json)

      const now = Date.now() / 1000

      return parsed.map((parsed) => ({
        ...parsed,
        rewardToken: new EvmToken(parsed.rewardToken),
        isLive: now >= +parsed.startTimestamp && now <= +parsed.endTimestamp,
        amount: +parsed.amount / 10 ** parsed.rewardToken.decimals,
      }))
    },
    staleTime: 15000, // 15 seconds
    gcTime: 60000, // 1min
    enabled: Boolean(enabled && pool && chainId),
  })
}
