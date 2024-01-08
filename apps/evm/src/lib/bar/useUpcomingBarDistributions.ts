'use client'

import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChainId } from 'sushi/chain'

const sdk = getBuiltGraphSDK()

const UsersToQuery = [
  {
    chainId: ChainId.ETHEREUM,
    id: '0xe11fc0b43ab98eb91e9836129d1ee7c3bc95df50',
  },
  {
    chainId: ChainId.ETHEREUM,
    id: '0x5ad6211cd3fde39a9cecb5df6f380b8263d1e277',
  },
  {
    chainId: ChainId.ARBITRUM,
    id: '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8',
  },
  {
    chainId: ChainId.AVALANCHE,
    id: '0xa19b3b22f29e23e4c04678c94cfc3e8f202137d8',
  },
  {
    chainId: ChainId.BSC,
    id: '0xe2d7460457f55e4786c69d2d3fa81978bf8dd11c',
  },
  {
    chainId: ChainId.BASE,
    id: '0xa2665decd00008a54428c72dc926265a6d2c40cf',
  },
  {
    chainId: ChainId.FANTOM,
    id: '0x194d47464deeafef3b599b81e2984306a315d422',
  },
  {
    chainId: ChainId.POLYGON,
    id: '0xf1c9881be22ebf108b8927c4d197d126346b5036',
  },
]

const fetchDistributions = async ({ pageParam = 0 }) => {
  const results = await sdk.LiquidityPositionsByMakers({
    users: UsersToQuery,
    where: { balance_gt: '0', pair_: { liquidityUSD_gt: '0' } },
    orderBy: 'pair__feesUSD',
    orderDirection: 'desc',
    skip: pageParam,
  })

  return results.liquidityPositions.map((liquidityPosition) => ({
    ...liquidityPosition.pair,
    lastDistributedTx: liquidityPosition.lastDistributedTx,
    lastDistributedTimestamp: liquidityPosition.lastDistributedTimestamp,
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

export const useUpcomingBarDistributions = (enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['useUpcomingBarDistributions'],
    queryFn: fetchDistributions,
    getNextPageParam: (_, pages) => pages.length,
    keepPreviousData: true,
    staleTime: 30000,
    cacheTime: 86400000, // 24hs
    enabled,
  })
}

export type UpcomingBarDistribution = Awaited<
  ReturnType<typeof fetchDistributions>
>[number]
