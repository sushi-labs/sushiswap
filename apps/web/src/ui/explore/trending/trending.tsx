import { Wrapper } from 'src/ui/swap/trade/wrapper'
import { ChainId } from 'sushi/chain'
import { TrendingItem, TrendingItemMobile } from './trending-item'

const POOLS = [
  {
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    token1: {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    fee: '0.05%',
    tvl: '9.8m',
    volume: '5m',
    apr: '14%',
  },
  {
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    token1: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    fee: '0.3%',
    tvl: '15.2m',
    volume: '7.1m',
    apr: '11%',
  },
  {
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'DAI Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    token1: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    fee: '0.01%',
    tvl: '6.7m',
    volume: '2.3m',
    apr: '8%',
  },
  {
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      decimals: 8,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    token1: {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    fee: '0.3%',
    tvl: '12.4m',
    volume: '4.8m',
    apr: '10%',
  },
  {
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'SushiToken',
      symbol: 'SUSHI',
      decimals: 18,
      address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    token1: {
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    fee: '0.3%',
    tvl: '3.1m',
    volume: '1.2m',
    apr: '16%',
  },
  {
    chainId: ChainId.ETHEREUM,
    token0: {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    token1: {
      name: 'DAI Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
      approved: true,
      chainId: ChainId.ETHEREUM,
    },
    fee: '0.01%',
    tvl: '5.6m',
    volume: '2.9m',
    apr: '7%',
  },
]

export const Trending = () => {
  return (
    <>
      <TrendingDesktop pools={POOLS} />
      <TrendingMobile pools={POOLS} />
    </>
  )
}

const TrendingDesktop = ({ pools }: { pools: typeof POOLS }) => {
  return (
    <Wrapper className="border basis-2/3 border-accent !p-5 gap-5 flex-col hidden lg:flex">
      <div>
        <span className="text-lg font-semibold">Trending</span>
      </div>
      <div className="grid grid-rows-3 grid-flow-col gap-2">
        {pools.map((pool, idx) => (
          <TrendingItem
            key={`${pool.token0.symbol}-${pool.token1.symbol}-${idx}`}
            {...pool}
            position={idx + 1}
          />
        ))}
      </div>
    </Wrapper>
  )
}

const TrendingMobile = ({ pools }: { pools: typeof POOLS }) => {
  return (
    <div className="flex gap-2 items-center py-5 lg:hidden">
      <span className="text-sm font-medium">Trending:</span>
      <div className="flex overflow-x-auto gap-2 snap-x">
        {pools.map((pool, idx) => {
          return (
            <TrendingItemMobile
              key={`${pool.token0.symbol}-${pool.token1.symbol}-${idx}`}
              {...pool}
              position={idx + 1}
            />
          )
        })}
      </div>
    </div>
  )
}
