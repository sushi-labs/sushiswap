'use client'

import { Pool } from '@sushiswap/client'
import { LiquidityPosition, getBuiltGraphSDK } from '@sushiswap/graph-client'
import { useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'

const sdk = getBuiltGraphSDK()

const SUSHI_MAKER_ADDRESS = {
  [ChainId.ETHEREUM]: '0xe11fc0b43ab98eb91e9836129d1ee7c3bc95df50',
}

export const useBarPositions = (enabled = true) => {
  return useQuery({
    queryKey: ['useBarPositions'],
    queryFn: async () => {
      const results = await sdk.LiquidityPositionsByMakers({
        users: Object.entries(SUSHI_MAKER_ADDRESS).reduce<
          { chainId: number; id: string }[]
        >((accum, [chainId, address]) => {
          accum.push({ chainId: Number(chainId), id: address })
          return accum
        }, []),
        where: { balance_gt: '0' },
      })

      return results.liquidityPositions.map((liquidityPosition) => ({
        ...liquidityPosition.pair,
        chainId: liquidityPosition.chainId,
        balance: liquidityPosition.balance,
        balanceUSD:
          (liquidityPosition.pair.liquidityUSD * liquidityPosition.balance) /
          liquidityPosition.pair.liquidity,
        incentives: [],
        protocol: 'SUSHISWAP_V2',
        swapFee: 0.003,
      }))
    },
    keepPreviousData: true,
    staleTime: 30000,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}
