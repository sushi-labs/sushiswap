'use client'

import { useQuery } from '@tanstack/react-query'
import { SushiSwapV2ChainId } from 'sushi/config'
import { Amount, Token } from 'sushi/currency'
import { getSushiHistoricPool } from '../../../../../../packages/graph-client/dist/composite/sushi-historic-pool'

interface UsePoolGraphDataParams {
  poolAddress: string
  chainId: SushiSwapV2ChainId
  enabled?: boolean
}

export const usePoolGraphData = ({
  poolAddress,
  chainId,
  enabled = true,
}: UsePoolGraphDataParams) => {
  return useQuery({
    queryKey: ['usePoolGraphData', { poolAddress, chainId }],
    queryFn: async () => {
      const pair = await getSushiHistoricPool({
        chainId,
        id: poolAddress,
      })

      if (pair) {
        const token0 = new Token({
          chainId: pair.chainId,
          address: pair.token0.address,
          decimals: pair.token0.decimals,
          symbol: pair.token0.symbol,
          name: pair.token0.name,
        })

        const token1 = new Token({
          chainId: pair.chainId,
          address: pair.token1.address,
          decimals: pair.token1.decimals,
          symbol: pair.token1.symbol,
          name: pair.token1.name,
        })

        return {
          token0,
          token1,
          swapFee: Number(pair.swapFee),
          reserve0: Amount.fromRawAmount(token0, pair.reserve0),
          reserve1: Amount.fromRawAmount(token1, pair.reserve1),
          liquidityUSD: Number(pair.liquidityUSD),
          liquidity1dChange: Number(pair.liquidityUSD1dChange),
          fees1d: Number(pair.feesUSD1d),
          fees1dChange: Number(pair.feesUSD1dChange),
          volume1d: Number(pair.volumeUSD1d),
          volume1dChange: Number(pair.volumeUSD1dChange),
          txCount1d: Number(pair.txCount1d),
          txCount1dChange: Number(pair.txCount1dChange),
          hourSnapshots: pair.poolHourData,
          daySnapshots: pair.poolDayData,
        }
      }

      return null
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 3600, // 1hr
    enabled: Boolean(poolAddress && chainId && enabled),
  })
}
