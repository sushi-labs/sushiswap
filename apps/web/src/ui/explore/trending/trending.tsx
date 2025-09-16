'use client'

import type { TrendingPools } from '@sushiswap/graph-client/data-api-181'
import { useMediaQuery } from '@sushiswap/hooks'
import { useTrendingPools } from 'src/lib/hooks/api/use-trending-pools'
import { Wrapper } from 'src/ui/swap/trade/wrapper'
import { SushiSwapProtocol } from 'sushi'
import { ChainKey, EvmChainId } from 'sushi/chain'
import { isSushiSwapV2ChainId, isSushiSwapV3ChainId } from 'sushi/config'
import { TrendingItem, TrendingItemMobile } from './trending-item'

export const Trending = () => {
  const { data: trendingPools } = useTrendingPools()

  if (!trendingPools) return null

  return (
    <>
      <TrendingDesktop pools={trendingPools} />
      <TrendingMobile pools={trendingPools} />
    </>
  )
}

const TrendingDesktop = ({ pools }: { pools: TrendingPools | undefined }) => {
  const isNarrow = useMediaQuery({ query: '(max-width: 1480px)' })
  const visiblePools = isNarrow ? pools?.slice(0, 3) : pools

  return (
    <Wrapper className="border basis-2/3 border-accent !p-5 gap-5 flex-col hidden lg:flex">
      <div>
        <span className="text-lg font-semibold">Trending</span>
      </div>
      <div className="grid grid-rows-3 grid-flow-col gap-2">
        {visiblePools?.map((pool, idx) => {
          const fallbackChain = EvmChainId.ETHEREUM

          const href =
            pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
              ? isSushiSwapV3ChainId(pool.chainId as EvmChainId)
                ? `/${ChainKey[pool.chainId as EvmChainId]}/pool/v3/${pool.address}`
                : `/${ChainKey[fallbackChain]}/pool/v3/${pool.address}`
              : isSushiSwapV2ChainId(pool.chainId as EvmChainId)
                ? `/${ChainKey[pool.chainId as EvmChainId]}/pool/v2/${pool.address}`
                : `/${ChainKey[fallbackChain]}/pool/v2/${pool.address}`

          return (
            <TrendingItem
              key={`${pool.token0.symbol}-${pool.token1.symbol}-${idx}`}
              pool={pool}
              position={idx + 1}
              href={href}
            />
          )
        })}
      </div>
    </Wrapper>
  )
}

const TrendingMobile = ({ pools }: { pools: TrendingPools | undefined }) => {
  return (
    <div className="flex gap-2 items-center py-5 lg:hidden">
      <span className="text-sm font-medium">Trending:</span>
      <div className="flex overflow-x-auto gap-2 snap-x hide-scrollbar">
        {pools?.map((pool, idx) => {
          const fallbackChain = EvmChainId.ETHEREUM

          const href =
            pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
              ? isSushiSwapV3ChainId(pool.chainId as EvmChainId)
                ? `/${ChainKey[pool.chainId as EvmChainId]}/pool/v3/${pool.address}`
                : `/${ChainKey[fallbackChain]}/pool/v3/${pool.address}`
              : isSushiSwapV2ChainId(pool.chainId as EvmChainId)
                ? `/${ChainKey[pool.chainId as EvmChainId]}/pool/v2/${pool.address}`
                : `/${ChainKey[fallbackChain]}/pool/v2/${pool.address}`
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
