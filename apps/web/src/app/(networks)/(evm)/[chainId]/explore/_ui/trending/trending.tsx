'use client'

import type { TrendingPools } from '@sushiswap/graph-client/data-api'
import { useTrendingPools } from 'src/lib/hooks/api/use-trending-pools'
import { EvmChainId, SushiSwapProtocol, getEvmChainById } from 'sushi/evm'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/evm'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import {
  TrendingItem,
  TrendingItemMobile,
  TrendingItemMobileSkeleton,
  TrendingItemSkeleton,
} from './trending-item'

export const Trending = () => {
  const { data: trendingPools, isLoading } = useTrendingPools()
  return (
    <>
      <TrendingDesktop pools={trendingPools} isLoading={isLoading} />
      <TrendingMobile pools={trendingPools} isLoading={isLoading} />
    </>
  )
}

export const TrendingDesktop = ({
  pools,
  isLoading,
}: { pools: TrendingPools | undefined; isLoading: boolean }) => {
  const fallbackChain = EvmChainId.ETHEREUM

  const renderItems = (poolsToShow: TrendingPools | undefined) =>
    poolsToShow?.map((pool, idx) => {
      const href =
        pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
          ? isSushiSwapV3ChainId(pool.chainId as EvmChainId)
            ? `/${getEvmChainById(pool.chainId as EvmChainId).key}/pool/v3/${pool.address}`
            : `/${getEvmChainById(fallbackChain).key}/pool/v3/${pool.address}`
          : isSushiSwapV2ChainId(pool.chainId as EvmChainId)
            ? `/${getEvmChainById(pool.chainId as EvmChainId).key}/pool/v2/${pool.address}`
            : `/${getEvmChainById(fallbackChain).key}/pool/v2/${pool.address}`

      return (
        <TrendingItem
          key={`${pool.token0.symbol}-${pool.token1.symbol}-${idx}`}
          pool={pool}
          position={idx + 1}
          href={href}
        />
      )
    })

  return (
    <>
      <Wrapper className="hidden [@media(min-width:1500px)]:flex border basis-2/3 border-accent !p-5 gap-5 flex-col">
        <div>
          <span className="text-lg font-semibold">Trending</span>
        </div>
        <div className="grid grid-rows-3 grid-flow-col gap-2">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <TrendingItemSkeleton key={`skeleton-wide-${i}`} />
              ))
            : renderItems(pools)}
        </div>
      </Wrapper>

      <Wrapper className="hidden md:flex [@media(min-width:1500px)]:hidden border border-accent !p-5 gap-5 flex-col w-full">
        <div>
          <span className="text-lg font-semibold">Trending</span>
        </div>
        <div className="flex flex-col gap-2">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TrendingItemSkeleton key={`skeleton-narrow-${i}`} />
              ))
            : renderItems(pools?.slice(0, 3))}
        </div>
      </Wrapper>
    </>
  )
}

const TrendingMobile = ({
  pools,
  isLoading,
}: { pools: TrendingPools | undefined; isLoading: boolean }) => {
  return (
    <div className="flex flex-col gap-2 py-5 md:hidden">
      <span className="text-sm font-medium">Trending:</span>
      <div className="flex overflow-x-auto gap-2 snap-x hide-scrollbar">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <TrendingItemMobileSkeleton key={`skeleton-mobile-${idx}`} />
            ))
          : pools?.map((pool, idx) => {
              const fallbackChain = EvmChainId.ETHEREUM

              const href =
                pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
                  ? isSushiSwapV3ChainId(pool.chainId as EvmChainId)
                    ? `/${getEvmChainById(pool.chainId as EvmChainId).key}/pool/v3/${pool.address}`
                    : `/${getEvmChainById(fallbackChain).key}/pool/v3/${pool.address}`
                  : isSushiSwapV2ChainId(pool.chainId as EvmChainId)
                    ? `/${getEvmChainById(pool.chainId as EvmChainId).key}/pool/v2/${pool.address}`
                    : `/${getEvmChainById(fallbackChain).key}/pool/v2/${pool.address}`
              return (
                <TrendingItemMobile
                  key={`${pool.token0.symbol}-${pool.token1.symbol}-${idx}`}
                  pool={pool}
                  position={idx + 1}
                  href={href}
                />
              )
            })}
      </div>
    </div>
  )
}
