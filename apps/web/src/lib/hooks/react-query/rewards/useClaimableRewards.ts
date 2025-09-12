import { useQuery } from '@tanstack/react-query'
import { Amount } from 'sushi'
import {
  type EvmCurrency,
  EvmToken,
  MERKL_SUPPORTED_CHAIN_IDS,
  type MerklChainId,
} from 'sushi/evm'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import { merklRewardsValidator } from './validator'

interface UseClaimableRewardsParams {
  chainIds?: MerklChainId[]
  account: Address | undefined
  enabled?: boolean
}

export type ClaimableRewards = {
  chainId: MerklChainId
  rewardAmounts: Record<string, Amount<EvmCurrency>>
  rewardAmountsUSD: Record<string, number>
  totalRewardsUSD: number
  claimArgs: [Address[], Address[], bigint[], Hex[][]]
}

type UseClaimableRewardReturn = Record<MerklChainId, ClaimableRewards>

export const useClaimableRewards = ({
  chainIds = MERKL_SUPPORTED_CHAIN_IDS,
  account,
  enabled = true,
}: UseClaimableRewardsParams) => {
  return useQuery({
    queryKey: ['claimableMerklRewards', { account }],
    queryFn: async () => {
      const url = new URL(`https://api.merkl.xyz/v4/users/${account}/rewards`)
      url.searchParams.set('test', `${false}`)

      const res = await Promise.allSettled(
        chainIds.map(async (chainId) => {
          const _url = new URL(url)
          _url.searchParams.set('chainId', `${chainId}`)

          const res = await fetch(_url)
          const json = await res.json()
          return merklRewardsValidator.parse(json)
        }),
      )

      const data = res
        .flatMap((result) =>
          result.status === 'fulfilled' && result.value.length > 0
            ? result.value[0].rewards
            : [],
        )
        .reduce((accum, reward) => {
          const unclaimed = reward.amount - reward.claimed
          if (unclaimed === 0n) return accum

          const chainId = reward.token.chainId as MerklChainId
          const tokenAddress = reward.token.address as Address
          const token = new EvmToken({ ...reward.token, name: '' })
          const unclaimedAmount = new Amount(token, unclaimed)

          if (!accum[chainId]) {
            accum[chainId] = {
              chainId,
              rewardAmounts: {},
              rewardAmountsUSD: {},
              totalRewardsUSD: 0,
              claimArgs: [[], [], [], []],
            }
          }

          accum[chainId].claimArgs[0].push(account as Address)
          accum[chainId].claimArgs[1].push(tokenAddress)
          accum[chainId].claimArgs[2].push(reward.amount)
          accum[chainId].claimArgs[3].push(reward.proofs)

          const existingRewardAmount =
            accum[chainId].rewardAmounts[tokenAddress.toLowerCase()]

          const amount = existingRewardAmount
            ? existingRewardAmount.add(unclaimedAmount)
            : unclaimedAmount
          const amountUSD =
            Number(amount.toString()) * (reward.token.price ?? 0)

          accum[chainId].rewardAmounts[tokenAddress.toLowerCase()] = amount
          accum[chainId].rewardAmountsUSD[tokenAddress.toLowerCase()] =
            amountUSD
          accum[chainId].totalRewardsUSD += amountUSD

          return accum
        }, {} as UseClaimableRewardReturn)

      return data
    },
    staleTime: 15000, // 15 seconds
    gcTime: 60000, // 1min
    enabled: Boolean(enabled && account),
  })
}
