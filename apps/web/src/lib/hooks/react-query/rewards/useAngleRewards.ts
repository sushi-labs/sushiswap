import { useQuery } from '@tanstack/react-query'
import { EvmChainId } from 'sushi/chain'
import { Amount, Token, tryParseAmount } from 'sushi/currency'
import { ZERO } from 'sushi/math'
import { parseUnits } from 'viem'
import z from 'zod'

import { isMerklChainId } from 'sushi/config'

import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { angleRewardsPoolsValidator, angleRewardsValidator } from './validator'

type TransformedRewardsPerToken = Record<
  string,
  {
    accumulatedSinceInception: Amount<Token>
    breakdown: Record<string, Amount<Token>>
    symbol: string
    unclaimed: Amount<Token>
  }
>

export type AngleRewardsPool = Omit<
  z.infer<typeof angleRewardsPoolsValidator>,
  'rewardsPerToken' | 'token0' | 'token1' | 'distributionData'
> & {
  id: string
  chainId: EvmChainId
  distributionData: Array<
    Omit<
      z.infer<typeof angleRewardsPoolsValidator>['distributionData'][0],
      'token'
    > & { token: Token }
  >
  rewardsPerToken: TransformedRewardsPerToken
  token0: Token
  token1: Token
}

type TransformedPools = Record<string, AngleRewardsPool>

interface AngleRewardsQueryParams {
  chainIds: EvmChainId[]
  account?: string | undefined
  enabled?: boolean
}

export const angleRewardsQueryFn = async ({
  chainIds,
  account,
}: AngleRewardsQueryParams) => {
  const url = new URL('https://api.merkl.xyz/v2/merkl')
  url.searchParams.set('AMMs', 'sushiswapv3')
  chainIds.forEach((chainId) =>
    url.searchParams.append('chainIds', chainId.toString()),
  )

  if (account) {
    url.searchParams.set('user', account)
  }

  const res = await fetch(url)
  const json = await res.json()
  return angleRewardsValidator.parse(json)
}

interface AngleRewardsSelect {
  chainId: EvmChainId
  data: z.infer<typeof angleRewardsValidator>[number] | undefined
  prices: ReturnType<typeof usePrices>['data']
}

export const angleRewardsSelect = ({
  chainId,
  data,
  prices,
}: AngleRewardsSelect) => {
  if (!data?.pools || !prices) return undefined

  const pools = Object.entries(data.pools).reduce<TransformedPools>(
    (acc, [a, b]) => {
      acc[a] = {
        ...b,
        id: `${chainId}:${b.pool}`,
        chainId,
        distributionData: b.distributionData.reduce<
          Array<
            Omit<
              z.infer<typeof angleRewardsPoolsValidator>['distributionData'][0],
              'token'
            > & { token: Token }
          >
        >((acc, el) => {
          if (el.symbolRewardToken !== 'aglaMerkl' && !el.whitelist.length) {
            acc.push({
              ...el,
              token: new Token({
                chainId,
                address: el.rewardToken,
                symbol: el.symbolRewardToken,
                decimals: 18,
              }),
            })
          }

          return acc
        }, []),
        token0: new Token({
          chainId,
          address: b.token0,
          symbol: b.symbolToken0,
          decimals: b.decimalsToken0,
        }),
        token1: new Token({
          chainId,
          address: b.token1,
          symbol: b.symbolToken1,
          decimals: b.decimalsToken1,
        }),
        rewardsPerToken: Object.entries(
          b.rewardsPerToken,
        ).reduce<TransformedRewardsPerToken>((acc, [k, v]) => {
          const token0 = new Token({
            chainId,
            address: k,
            decimals: v.decimals,
            symbol: v.symbol,
          })

          if (token0.symbol !== 'aglaMerkl') {
            acc[k] = {
              accumulatedSinceInception: Amount.fromRawAmount(
                token0,
                parseUnits(
                  v.accumulatedSinceInception.toFixed(18),
                  v.decimals,
                ).toString(),
              ),
              breakdown: Object.entries(v.breakdownOfUnclaimed).reduce<
                Record<string, Amount<Token>>
              >((acc, [i, j]) => {
                acc[i] = Amount.fromRawAmount(
                  token0,
                  parseUnits(j.toFixed(18), v.decimals).toString(),
                )
                return acc
              }, {}),
              symbol: v.symbol,
              unclaimed: Amount.fromRawAmount(token0, v.unclaimedUnformatted),
            }
          }
          return acc
        }, {}),
      }

      return acc
    },
    {},
  )

  const unclaimedAmounts = Object.values(
    Object.values(pools ?? []).reduce<Record<string, Amount<Token>>>(
      (acc, cur) => {
        Object.values(cur.rewardsPerToken).forEach((val) => {
          const amount = acc[val.unclaimed.currency.address]
          if (!amount) {
            acc[val.unclaimed.currency.address] = val.unclaimed
          } else {
            acc[val.unclaimed.currency.address] = amount.add(val.unclaimed)
          }
        })

        return acc
      },
      {},
    ),
  )

  const unclaimed = unclaimedAmounts.map((amount) => {
    let amountUSD = 0

    const price = prices.get(amount.currency.wrapped.address)

    if (amount?.greaterThan(ZERO) && price) {
      amountUSD = Number(Number(amount.toExact()) * Number(price.toFixed(10)))
    }
    if (Number.isNaN(amountUSD) || amountUSD < 0.000001) {
      amountUSD = 0
    }

    return {
      amount,
      amountUSD,
    }
  })

  const validRewardTokens = (data.validRewardTokens ?? [])
    .map((el) => {
      const token = new Token({
        chainId,
        address: el.token,
        symbol: el.symbol,
        decimals: el.decimals,
      })
      return {
        minimumAmountPerEpoch: tryParseAmount(
          el.minimumAmountPerEpoch.toString(),
          token,
        ),
        token,
      }
    })
    .filter((el) => el.token.symbol !== 'aglaMerkl')

  return {
    ...data,
    unclaimed,
    pools,
    validRewardTokens,
  }
}

interface UseAngleRewardsParams {
  chainId: EvmChainId
  account?: string | undefined
  enabled?: boolean
}

export const useAngleRewards = ({
  chainId,
  account,
  enabled = true,
}: UseAngleRewardsParams) => {
  const { data: prices } = usePrices({ chainId })
  return useQuery({
    queryKey: ['getAngleRewards', { chainId, account }],
    queryFn: async () =>
      await angleRewardsQueryFn({ chainIds: [chainId], account }),
    select: (data) =>
      angleRewardsSelect({ chainId, data: data[chainId], prices }),
    staleTime: 15000, // 15 seconds
    gcTime: 60000, // 1min
    enabled: Boolean(enabled && prices && chainId && isMerklChainId(chainId)),
  })
}
