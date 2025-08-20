import { useQuery } from '@tanstack/react-query'
import { MERKL_SUPPORTED_CHAIN_IDS, type MerklChainId } from 'sushi/config'
import { Amount, Token, type Type } from 'sushi/currency'
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

      return res.reduce((accum, cur) => {
        if (cur.status !== 'fulfilled' || cur.value.length === 0) return accum

        const { chain, rewards } = cur.value[0]

        if (rewards.length === 0) return accum

        const rewardAmounts = {} as Record<string, Amount<Type>>
        const prices = {} as Record<string, number | undefined>

        const claimArgs = {
          users: [] as Address[],
          tokens: [] as Address[],
          amounts: [] as bigint[],
          proofs: [] as Hex[][],
        }

        rewards.forEach((reward) => {
          const unclaimed = reward.amount - reward.claimed

          if (unclaimed === 0n) return

          claimArgs.users.push(account as Address)
          claimArgs.tokens.push(reward.token.address as Address)
          claimArgs.amounts.push(reward.amount)
          claimArgs.proofs.push(reward.proofs)

          const currentValue = rewardAmounts[reward.token.address as Address]

          if (currentValue) {
            const amount = currentValue.add(
              Amount.fromRawAmount(currentValue.currency, unclaimed),
            )
            rewardAmounts[reward.token.address] = amount
          } else {
            const token = new Token(reward.token)
            const amount = Amount.fromRawAmount(token, unclaimed)
            rewardAmounts[reward.token.address] = amount
            prices[reward.token.address] = reward.token.price
          }
        })

        if (Object.keys(rewardAmounts).length === 0) return accum

        const rewardAmountsUSD = Object.entries(rewardAmounts).reduce(
          (prev, [key, amount]) => {
            const price = prices[key]

            if (typeof price === 'undefined') {
              return prev
            }

            const _amountUSD = Number(amount.toExact()) * price

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

        accum[chain.id] = {
          chainId: chain.id,
          rewardAmounts,
          rewardAmountsUSD,
          totalRewardsUSD,
          claimArgs: [
            claimArgs.users,
            claimArgs.tokens,
            claimArgs.amounts,
            claimArgs.proofs,
          ],
        }

        return accum
      }, {} as UseClaimableRewardReturn)
    },
    staleTime: 15000, // 15 seconds
    gcTime: 60000, // 1min
    enabled: Boolean(enabled && account),
  })
}
