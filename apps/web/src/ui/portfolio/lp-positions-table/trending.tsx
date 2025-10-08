'use client'

import { useEffect, useRef, useState } from 'react'
import {
  EvmChainId,
  SushiSwapProtocol,
  getEvmChainById,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { TrendingItemMobile } from '~evm/[chainId]/explore/_ui/trending/trending-item'
import { PLACEHOLDER_POOLS_DATA } from '../../explore/trending/trending'

export const Trending = () => {
  const overflowRef = useRef<HTMLDivElement>(null)
  const { hasOverflow } = useOverflow(overflowRef)

  return (
    <div className="flex relative gap-4 items-center px-4 py-3 border-b border-accent">
      <p className="text-sm font-medium">Trending:</p>
      <div
        ref={overflowRef}
        className="flex overflow-x-auto gap-2 pr-4 snap-x hide-scrollbar"
      >
        {PLACEHOLDER_POOLS_DATA.map((pool, idx) => {
          const fallbackChain = EvmChainId.ETHEREUM

          const href =
            pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
              ? isSushiSwapV3ChainId(pool.chainId)
                ? `/${getEvmChainById(pool.chainId).key}/pool/v3/${pool.address}`
                : `/${getEvmChainById(fallbackChain).key}/pool/v3/${pool.address}`
              : isSushiSwapV2ChainId(pool.chainId)
                ? `/${getEvmChainById(pool.chainId).key}/pool/v2/${pool.address}`
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
