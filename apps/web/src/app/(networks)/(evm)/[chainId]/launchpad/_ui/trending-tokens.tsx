'use client'

import { useMemo } from 'react'
import { isRobinhoodStockToken } from 'src/lib/robinhood/stock-tokens'
import { useRobinhoodStockTokens } from 'src/lib/robinhood/use-robinhood-stock-tokens'
import { getLaunchpadProvidersForFilter } from '../_lib/launchpad-provider'
import { useLaunchpadTokens } from '../_lib/use-launchpad-tokens'
import type { LaunchpadChainId } from '../constants'
import {
  TrendingTokenCard,
  TrendingTokenCardSkeleton,
} from './trending-token-card'
import { TrendingTokenCarousel } from './trending-token-carousel'

export const TrendingTokens = ({ chainId }: { chainId: LaunchpadChainId }) => {
  const { data: stockTokens } = useRobinhoodStockTokens()
  const { data, isPending, isError } = useLaunchpadTokens(
    {
      chainId,
      providers: getLaunchpadProvidersForFilter('all'),
      sortBy: 'VOLUME_24H',
      sortDirection: 'DESC',
      first: 4,
    },
    true,
  )

  const topTokens = data.edges
  const slides = useMemo(() => {
    return topTokens.map((token) => ({
      id: token.node.id,
      name: token.node.name,
      content: (
        <TrendingTokenCard
          token={token}
          isStockPair={isRobinhoodStockToken(
            {
              chainId: token.node.chainId,
              address: token.node.pool.quoteToken.address,
            },
            stockTokens,
          )}
        />
      ),
    }))
  }, [topTokens, stockTokens])

  return (
    <div className="w-full min-w-0 lg:w-[440px]">
      <h4 className="uppercase font-bold text-sm mb-2">Trending Now</h4>
      {isPending ? (
        <>
          <TrendingTokenCardSkeleton />
          <div aria-hidden="true" className="mt-3 hidden h-9 lg:block" />
        </>
      ) : topTokens.length > 0 ? (
        <TrendingTokenCarousel slides={slides} />
      ) : (
        <div className="flex min-h-[130px] items-center justify-center rounded-2xl bg-white/[0.03] p-4 text-sm text-perps-muted-50 lg:min-h-[224px]">
          {isError
            ? 'Trending tokens are temporarily unavailable.'
            : 'No trending tokens yet.'}
        </div>
      )}
    </div>
  )
}
