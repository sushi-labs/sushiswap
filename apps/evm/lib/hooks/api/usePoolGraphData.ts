'use client'

import { ChainId, chainShortName } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { useQuery } from '@tanstack/react-query'

interface UsePoolGraphDataParams {
  poolAddress: string
  chainId: ChainId
  enabled?: boolean
}

const sdk = getBuiltGraphSDK()

export const usePoolGraphData = ({ poolAddress, chainId, enabled = true }: UsePoolGraphDataParams) => {
  return useQuery({
    queryKey: ['usePoolGraphData', { poolAddress, chainId }],
    queryFn: async () => {
      const { pair } = await sdk.PairById({
        id: `${chainShortName[chainId]}:${poolAddress}`,
      })

      if (pair) {
        const token0 = new Token({
          chainId: pair.chainId,
          address: pair.token0.id,
          decimals: pair.token0.decimals,
          symbol: pair.token0.symbol,
          name: pair.token0.name,
        })

        const token1 = new Token({
          chainId: pair.chainId,
          address: pair.token1.id,
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
          liquidityNative: Number(pair.liquidityNative),
          liquidityUSD: Number(pair.liquidityUSD),
          liquidity1dChange: Number(pair.liquidity1dChange ?? 0),
          fees1d: Number(pair.fees1d ?? 0),
          fees1dChange: Number(pair.fees1dChange ?? 0),
          volume1d: Number(pair.volume1d ?? 0),
          volume1dChange: Number(pair.volume1dChange ?? 0),
          txCount1d: Number(pair.txCount1d ?? 0),
          txCount1dChange: Number(pair.txCount1dChange ?? 0),
          hourSnapshots: pair.hourSnapshots,
          daySnapshots: pair.daySnapshots,
        }
      }

      return null
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 86400000, // 24hs
    enabled: Boolean(poolAddress && chainId && enabled),
  })
}
