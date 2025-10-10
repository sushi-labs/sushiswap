'use client'

import { useEffect, useRef, useState } from 'react'
import { useTrendingPools } from 'src/lib/hooks/api/use-trending-pools'
import {
  SushiSwapProtocol,
  getEvmChainById,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import {
  TrendingItemMobile,
  TrendingItemMobileSkeleton,
} from '~evm/[chainId]/explore/_ui/trending/trending-item'

export const Trending = () => {
  const overflowRef = useRef<HTMLDivElement>(null)
  const { hasOverflow } = useOverflow(overflowRef)
  const { data: trendingPools, isLoading } = useTrendingPools()

  return (
    <div className="flex relative gap-4 items-center px-4 py-3 border-b border-accent">
      <p className="text-sm font-medium">Trending:</p>
      <div
        ref={overflowRef}
        className="flex overflow-x-auto gap-2 pr-4 snap-x hide-scrollbar"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <TrendingItemMobileSkeleton key={`skeleton-narrow-${i}`} />
            ))
          : trendingPools?.map((pool, idx) => {
              const href =
                pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
                  ? isSushiSwapV3ChainId(pool.chainId)
                    ? `/${getEvmChainById(pool.chainId).key}/pool/v3/${pool.address}`
                    : ''
                  : isSushiSwapV2ChainId(pool.chainId)
                    ? `/${getEvmChainById(pool.chainId).key}/pool/v2/${pool.address}`
                    : ``

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
      {hasOverflow ? (
        <div className="h-full z-10 w-20 bg-gradient-to-r absolute right-0 top-1/2 -translate-y-1/2 from-transparent to-85% to-white dark:to-slate-800" />
      ) : null}
    </div>
  )
}

export const useOverflow = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (element) {
      setHasOverflow(element.scrollWidth > element.clientWidth)
    }

    const handleResize = () => {
      if (element) {
        setHasOverflow(element.scrollWidth > element.clientWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref])

  return { hasOverflow }
}
