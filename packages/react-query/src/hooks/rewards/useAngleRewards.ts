import { parseUnits } from '@ethersproject/units'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount } from '@sushiswap/currency'
import { ZERO } from '@sushiswap/math'
import { useQuery } from '@tanstack/react-query'
import z from 'zod'

import { usePrices } from '../prices'
import { angleRewardsBaseValidator, angleRewardsPoolsValidator } from './validator'

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
  chainId: ChainId
  distributionData: Array<
    Omit<z.infer<typeof angleRewardsPoolsValidator>['distributionData'][0], 'token'> & { token: Token }
  >
  rewardsPerToken: TransformedRewardsPerToken
  token0: Token
  token1: Token
}

type TransformedPools = Record<string, AngleRewardsPool>

interface UseAngleRewardsParams {
  chainId: ChainId
  account: string | undefined
  enabled?: boolean
}

export const angleRewardsQueryFn = async ({ chainId, account }: UseAngleRewardsParams) => {
  if (account) {
    const res = await (await fetch(`https://api.angle.money/v1/merkl?chainId=${chainId}&user=${account}`)).json()
    return angleRewardsBaseValidator.parse(res)
  }

  return null
}

interface AngleRewardsSelect {
  chainId: ChainId
  data: Awaited<ReturnType<typeof angleRewardsQueryFn>>
  prices: ReturnType<typeof usePrices>['data']
}

export const angleRewardsSelect = ({ chainId, data, prices }: AngleRewardsSelect) => {
  if (!data || !data.pools || !prices) return undefined

  const pools = Object.entries(data.pools).reduce<TransformedPools>((acc, [a, b]) => {
    acc[a] = {
      ...b,
      id: `${chainId}:${b.pool}`,
      chainId,
      distributionData: b.distributionData.reduce<
        Array<Omit<z.infer<typeof angleRewardsPoolsValidator>['distributionData'][0], 'token'> & { token: Token }>
      >((acc, el) => {
        if (el.tokenSymbol !== 'aglaMerkl') {
          acc.push({
            ...el,
            token: new Token({ chainId, address: el.token, symbol: el.tokenSymbol, decimals: 18 }),
          })
        }

        return acc
      }, []),
      token0: new Token({ chainId, address: b.token0, symbol: b.tokenSymbol0, decimals: b.decimalToken0 }),
      token1: new Token({ chainId, address: b.token1, symbol: b.tokenSymbol1, decimals: b.decimalToken1 }),
      rewardsPerToken: Object.entries(b.rewardsPerToken).reduce<TransformedRewardsPerToken>((acc, [k, v]) => {
        const token0 = new Token({ chainId, address: k, decimals: v.decimals, symbol: v.symbol })

        if (token0.symbol !== 'aglaMerkl') {
          acc[k] = {
            accumulatedSinceInception: Amount.fromRawAmount(
              token0,
              parseUnits(v.accumulatedSinceInception.toFixed(18), v.decimals).toString()
            ),
            breakdown: Object.entries(v.breakdown).reduce<Record<string, Amount<Token>>>((acc, [i, j]) => {
              acc[i] = Amount.fromRawAmount(token0, parseUnits(j.toFixed(18), v.decimals).toString())
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
  }, {})

  const unclaimedAmounts = Object.values(
    Object.values(pools ?? []).reduce<Record<string, Amount<Token>>>((acc, cur) => {
      Object.values(cur.rewardsPerToken).forEach((val) => {
        if (!acc[val.unclaimed.currency.address]) {
          acc[val.unclaimed.currency.address] = val.unclaimed
        } else {
          acc[val.unclaimed.currency.address] = acc[val.unclaimed.currency.address].add(val.unclaimed)
        }
      })

      return acc
    }, {})
  )

  const unclaimed = unclaimedAmounts.map((amount) => {
    let amountUSD = 0

    if (amount?.greaterThan(ZERO) && prices?.[amount.currency.wrapped.address]) {
      amountUSD = Number(Number(amount.toExact()) * Number(prices[amount.currency.wrapped.address].toFixed(10)))
    }
    if (isNaN(amountUSD) || amountUSD < 0.000001) {
      amountUSD = 0
    }

    return {
      amount,
      amountUSD,
    }
  })

  const validRewardTokens = (data.validRewardTokens ?? [])
    .map((el) => {
      const token = new Token({ chainId, address: el.token, symbol: el.symbol, decimals: el.decimals })
      return {
        minimumAmountPerEpoch: tryParseAmount(el.minimumAmountPerEpoch.toString(), token),
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

export const useAngleRewards = ({ chainId, account, enabled = true }: UseAngleRewardsParams) => {
  const { data: prices } = usePrices({ chainId })
  return useQuery({
    queryKey: ['getAngleRewards', { chainId, account }],
    queryFn: async () => await angleRewardsQueryFn({ chainId, account }),
    select: (data) => angleRewardsSelect({ chainId, data, prices }),
    staleTime: 15000, // 15 seconds
    cacheTime: 60000, // 1min
    enabled: Boolean(enabled && prices && chainId && account),
  })
}
