import { useQuery } from '@tanstack/react-query'
import { MERKL_SUPPORTED_CHAIN_IDS, type MerklChainId } from 'sushi/config'
import { Amount, Token, type Type } from 'sushi/currency'
import type { Hex } from 'viem'
import type { Address } from 'viem/accounts'
import { useAllPrices } from '../prices'
import { merklRewardsValidator } from './validator'

interface UseClaimableRewardsParams {
  chainIds?: MerklChainId[]
  account: Address | undefined
  enabled?: boolean
}

export type ClaimableRewards = {
  chainId: MerklChainId
  rewardAmounts: Record<string, Amount<Type>>
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
  const { data: prices } = useAllPrices()

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
          const token = new Token(reward.token)
          const unclaimedAmount = Amount.fromRawAmount(token, unclaimed)

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
            accum[chainId].rewardAmounts[tokenAddress]

          if (existingRewardAmount) {
            const amount = existingRewardAmount.add(unclaimedAmount)
            accum[chainId].rewardAmounts[tokenAddress] = amount
          } else {
            accum[chainId].rewardAmounts[tokenAddress] = unclaimedAmount
          }

          return accum
        }, {} as UseClaimableRewardReturn)

      return Object.fromEntries(
        Object.values(data).map((entry) => {
          const { rewardAmounts, chainId } = entry
          const rewardAmountsUSD = Object.entries(rewardAmounts).reduce(
            (prev, [key, amount]) => {
              const price = prices
                ?.get(chainId)
                ?.get(amount.currency.wrapped.address.toLowerCase())

              if (!price) return prev

              const _amountUSD = Number(
                Number(amount.toExact()) * Number(price.toFixed(10)),
              )

              const amountUSD =
                Number.isNaN(price) || +price.toFixed(10) < 0.000001
                  ? 0
                  : _amountUSD

              prev[key] = amountUSD
              return prev
            },
            {} as Record<string, number>,
          )

          const totalRewardsUSD = Object.values(rewardAmountsUSD).reduce(
            (prev, amount) => prev + amount,
            0,
          )

          return [
            chainId,
            {
              ...entry,
              rewardAmountsUSD,
              totalRewardsUSD,
            },
          ]
        }),
      )
    },
    staleTime: 15000, // 15 seconds
    gcTime: 60000, // 1min
    enabled: Boolean(enabled && account && prices),
  })
}
