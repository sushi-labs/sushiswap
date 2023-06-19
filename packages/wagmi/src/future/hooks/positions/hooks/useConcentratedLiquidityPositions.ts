import { useQuery } from '@tanstack/react-query'
import { getConcentratedLiquidityPositions } from '../actions'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { Address } from 'wagmi'
import { getConcentratedLiquidityPool } from '../../pools'
import { getTokenWithCacheQueryFn, getTokenWithQueryCacheHydrate } from '../../tokens'
import { useCustomTokens } from '@sushiswap/hooks'

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

  return useQuery({
    queryKey: ['useConcentratedLiquidityPositions', { chainIds, account }],
    queryFn: async () => {
      const data = await getConcentratedLiquidityPositions({
        account: account,
        chainIds,
      })

      if (data) {
        const pools = await Promise.all(
          data.map(async (el) => {
            const [token0Data, token1Data] = await Promise.all([
              getTokenWithCacheQueryFn({ chainId: el.chainId, hasToken, customTokens, address: el.token0 }),
              getTokenWithCacheQueryFn({ chainId: el.chainId, hasToken, customTokens, address: el.token1 }),
            ])

            const token0 = getTokenWithQueryCacheHydrate(el.chainId, token0Data, false)
            const token1 = getTokenWithQueryCacheHydrate(el.chainId, token1Data, false)
            return await getConcentratedLiquidityPool({
              chainId: el.chainId,
              token0,
              token1,
              feeAmount: el.fee,
            })
          })
        )

        return data.map((el, i) => ({
          ...el,
          pool: pools[i],
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
