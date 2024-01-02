'use client'

import { Pool } from '@sushiswap/client'
import { LiquidityPosition, getBuiltGraphSDK } from '@sushiswap/graph-client'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'

const sdk = getBuiltGraphSDK()

const SUSHI_MAKER_ADDRESS = {
  [ChainId.ETHEREUM]: '0xe11fc0b43ab98eb91e9836129d1ee7c3bc95df50',
}

const UsersToQuery = [
  {
    chainId: ChainId.ETHEREUM,
    id: '0xe11fc0b43ab98eb91e9836129d1ee7c3bc95df50',
  },
]

const fetchPositions = async ({ pageParam = 0 }) => {
  const results = await sdk.LiquidityPositionsByUsers({
    users: UsersToQuery,
    where: { balance_gt: '0' },
    skip: pageParam,
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
}

export const useBarPositionsInfinite = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['useBarPositions'],
    queryFn: fetchPositions,
    getNextPageParam: (_, pages) => pages.length,
    keepPreviousData: true,
    staleTime: 30000,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}

export type BarPosition = Awaited<ReturnType<typeof fetchPositions>>[number]
