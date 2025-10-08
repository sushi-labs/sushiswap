'use client'

import type { TrendingPool } from '@sushiswap/graph-client/data-api-181'
import { useMediaQuery } from '@sushiswap/hooks'
import { ChainId } from 'sushi'
import {
  type EvmChainId,
  SushiSwapProtocol,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  getEvmChainById,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import {
  TrendingItem,
  TrendingItemMobile,
} from '~evm/[chainId]/explore/_ui/trending/trending-item'

export const PLACEHOLDER_POOLS_DATA: TrendingPool[] = [
  {
    liquidityUSD: 9800000,
    volumeUSD1d: 5000000,
    totalApr1d: 14,
    id: '1',
    name: 'USDC/USDT',
    protocol: SushiSwapProtocol.SUSHISWAP_V2,
    swapFee: 0.05,
    volumeUSD1w: 10000000,
    address: '0xfa6e8e97ececdc36302eca534f63439b1e79487b',
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '1',
    },
    token1: {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '2',
    },
  },
  {
    id: '2',
    liquidityUSD: 15200000,
    volumeUSD1d: 7100000,
    totalApr1d: 11,
    name: 'WETH/USDC',
    protocol: SushiSwapProtocol.SUSHISWAP_V2,
    swapFee: 0.05,
    volumeUSD1w: 10000000,
    address: '0x397ff1542f962076d0bfe58ea045ffa2d347aca0',
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '3',
    },
    token1: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '4',
    },
  },
  {
    id: '3',
    liquidityUSD: 6700000,
    volumeUSD1d: 2300000,
    totalApr1d: 7,
    name: 'DAI/USDC',
    protocol: SushiSwapProtocol.SUSHISWAP_V2,
    swapFee: 0.05,
    volumeUSD1w: 10000000,
    address: '0xaaf5110db6e744ff70fb339de037b990a20bdace',
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'DAI Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '5',
    },
    token1: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '6',
    },
  },
  {
    id: '4',
    liquidityUSD: 5600000,
    volumeUSD1d: 2900000,
    totalApr1d: 7,
    name: 'WBTC/WETH',
    protocol: SushiSwapProtocol.SUSHISWAP_V2,
    swapFee: 0.05,
    volumeUSD1w: 10000000,
    address: '0xceff51756c56ceffca006cd410b03ffc46dd3a58',
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      decimals: 8,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '7',
    },
    token1: {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '8',
    },
  },
  {
    id: '5',
    liquidityUSD: 3100000,
    volumeUSD1d: 1200000,
    totalApr1d: 16,
    name: 'SUSHI/WETH',
    protocol: SushiSwapProtocol.SUSHISWAP_V2,
    swapFee: 0.05,
    volumeUSD1w: 10000000,
    address: '0x795065dcc9f64b5614c407a6efdc400da6221fb0',
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'SushiToken',
      symbol: 'SUSHI',
      decimals: 18,
      address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '9',
    },
    token1: {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '10',
    },
  },
  {
    id: '6',
    liquidityUSD: 5600000,
    volumeUSD1d: 2900000,
    totalApr1d: 7,
    name: 'USDT/DAI',
    protocol: SushiSwapProtocol.SUSHISWAP_V2,
    swapFee: 0.05,
    volumeUSD1w: 10000000,
    address: '0x055cedfe14bce33f985c41d9a1934b7654611aac',
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '11',
    },
    token1: {
      name: 'DAI Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
      chainId: ChainId.ETHEREUM,
      id: '12',
    },
  },
]

export const Trending = () => {
  return (
    <>
      <TrendingDesktop pools={PLACEHOLDER_POOLS_DATA} />
      <TrendingMobile pools={PLACEHOLDER_POOLS_DATA} />
    </>
  )
}

const TrendingDesktop = ({
  pools,
}: { pools: typeof PLACEHOLDER_POOLS_DATA }) => {
  const isNarrow = useMediaQuery({ query: '(max-width: 1480px)' })
  const visiblePools = isNarrow ? pools.slice(0, 3) : pools

  return (
    <Wrapper className="border basis-2/3 border-accent !p-5 gap-5  flex-col hidden lg:flex">
      <div>
        <span className="text-lg font-semibold">Trending</span>
      </div>
      <div className="grid grid-rows-3 grid-flow-col gap-2">
        {visiblePools.map((pool, idx) => {
          const fallbackChain = ChainId.ETHEREUM

          const href =
            pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
              ? isSushiSwapV3ChainId(pool.chainId as SushiSwapV3ChainId)
                ? `/${getEvmChainById(pool.chainId as EvmChainId).key}/pool/v3/${pool.address}`
                : `/${getEvmChainById(fallbackChain).key}/pool/v3/${pool.address}`
              : isSushiSwapV2ChainId(pool.chainId as SushiSwapV2ChainId)
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
        })}
      </div>
    </Wrapper>
  )
}

const TrendingMobile = ({
  pools,
}: { pools: typeof PLACEHOLDER_POOLS_DATA }) => {
  return (
    <div className="flex gap-2 items-center py-5 lg:hidden">
      <span className="text-sm font-medium">Trending:</span>
      <div className="flex overflow-x-auto gap-2 snap-x hide-scrollbar">
        {pools.map((pool, idx) => {
          const fallbackChain = ChainId.ETHEREUM

          const href =
            pool.protocol === SushiSwapProtocol.SUSHISWAP_V3
              ? isSushiSwapV3ChainId(pool.chainId as SushiSwapV3ChainId)
                ? `/${getEvmChainById(pool.chainId as EvmChainId).key}/pool/v3/${pool.address}`
                : `/${getEvmChainById(fallbackChain).key}/pool/v3/${pool.address}`
              : isSushiSwapV2ChainId(pool.chainId as SushiSwapV2ChainId)
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
