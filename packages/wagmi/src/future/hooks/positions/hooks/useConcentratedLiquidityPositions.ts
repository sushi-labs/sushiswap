import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositions } from '../actions'
import { Pool, Position, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { Address } from 'wagmi'
import { getConcentratedLiquidityPool } from '../../pools'
import { getTokenWithCacheQueryFn, getTokenWithQueryCacheHydrate } from '../../tokens'
import { useCustomTokens } from '@sushiswap/hooks'
import { useAllPrices } from '@sushiswap/react-query'
import { JSBI, ZERO } from '@sushiswap/math'
import { Amount, Token } from '@sushiswap/currency'

interface UseConcentratedLiquidityPositionsParams {
  account: Address | undefined
  chainIds: SushiSwapV3ChainId[]
  enabled?: boolean
}

export const useConcentratedLiquidityPositions = ({
  account,
  chainIds,
  enabled = true,
}: UseConcentratedLiquidityPositionsParams) => {
  const { data: customTokens, hasToken } = useCustomTokens()
  const { data: prices } = useAllPrices()

  return useQuery({
    queryKey: ['useConcentratedLiquidityPositions', { chainIds, account, prices }],
    queryFn: async () => {
      const data = await getConcentratedLiquidityPositions({
        account: account,
        chainIds,
      })

      if (data && prices) {
        const pools = await Promise.all(
          data.map(async (el) => {
            const [token0Data, token1Data] = await Promise.all([
              getTokenWithCacheQueryFn({ chainId: el.chainId, hasToken, customTokens, address: el.token0 }),
              getTokenWithCacheQueryFn({ chainId: el.chainId, hasToken, customTokens, address: el.token1 }),
            ])

            const token0 = getTokenWithQueryCacheHydrate(el.chainId, token0Data, false)
            const token1 = getTokenWithQueryCacheHydrate(el.chainId, token1Data, false)

            const pool = (await getConcentratedLiquidityPool({
              chainId: el.chainId,
              token0,
              token1,
              feeAmount: el.fee,
            })) as Pool

            const position = new Position({
              pool,
              liquidity: JSBI.BigInt(el.liquidity),
              tickLower: el.tickLower,
              tickUpper: el.tickUpper,
            })

            const amountToUsd = (amount: Amount<Token>) => {
              if (!amount?.greaterThan(ZERO) || !prices?.[el.chainId]?.[amount.currency.wrapped.address]) return 0
              const price = Number(
                Number(amount.toExact()) * Number(prices[el.chainId][amount.currency.wrapped.address].toFixed(10))
              )
              if (isNaN(price) || price < 0.000001) {
                return 0
              }

              return price
            }

            const positionUSD = amountToUsd(position.amount0) + amountToUsd(position.amount1)
            const unclaimedUSD =
              amountToUsd(Amount.fromRawAmount(pool.token0, JSBI.BigInt(el.fees?.[0] || 0))) +
              amountToUsd(Amount.fromRawAmount(pool.token1, JSBI.BigInt(el.fees?.[1] || 0)))

            return {
              pool,
              position: {
                position,
                positionUSD,
                unclaimedUSD,
              },
            }
          })
        )

        return data.map((el, i) => ({
          ...el,
          ...pools[i],
        }))
      }

      return []
    },
    refetchInterval: 10000,
    enabled: Boolean(account && chainIds && enabled),
    staleTime: 15000,
    cacheTime: 60000,
  })
}
