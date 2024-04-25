import { useMemo } from 'react'
import { useStablePrices } from 'utils/hooks/use-stable-prices'
import { usePools } from 'utils/hooks/usePools'
import { useTokens } from 'utils/hooks/useTokens'

export type PoolExtended = NonNullable<
  ReturnType<typeof usePoolsExtended>
>[number]

export function usePoolsExtended() {
  const { data: pools } = usePools()

  const tokens = useMemo(() => {
    return [
      ...new Set(
        pools?.flatMap((pool) => [
          pool.data.token_x_details,
          pool.data.token_y_details,
        ]),
      ),
    ]
  }, [pools])

  const prices = useStablePrices({
    currencies: tokens,
  })

  const { data: baseTokens } = useTokens()

  return useMemo(() => {
    if (!pools || !prices || !baseTokens) {
      return undefined
    }

    return pools.map((pool) => {
      let token0 = pool.data.token_x_details
      let token1 = pool.data.token_y_details

      token0 = baseTokens[token0.address] || token0
      token1 = baseTokens[token1.address] || token1

      const tokenPrice0USD = prices[token0.address]
      const tokenPrice1USD = prices[token1.address]

      const reserve0USD =
        tokenPrice0USD *
        (Number(pool.data.balance_x.value) / 10 ** token0.decimals)
      const reserve1USD =
        tokenPrice1USD *
        (Number(pool.data.balance_y.value) / 10 ** token1.decimals)

      return {
        id: pool.id,
        type: pool.type,
        token0,
        token1,
        reserve0: pool.data.balance_x.value,
        reserve0USD: reserve0USD,
        reserve1: pool.data.balance_y.value,
        reserve1USD: reserve1USD,
        reserveUSD: reserve0USD + reserve1USD,
        burnCap: pool.data.burn_cap,
        mintCap: pool.data.mint_cap,
        freezeCap: pool.data.freeze_cap,
        kLast: pool.data.k_last,
        creator: pool.data.creator,
      }
    })
  }, [pools, prices, baseTokens])
}
