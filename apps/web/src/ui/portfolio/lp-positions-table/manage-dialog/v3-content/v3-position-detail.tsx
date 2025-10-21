import type { PortfolioV2PositionV3PoolType } from '@sushiswap/graph-client/data-api-portfolio'
import { useState } from 'react'
import { useV3PositionData } from 'src/lib/wagmi/hooks/portfolio/use-v3-position-data'
import type {
  EvmAddress,
  SushiSwapProtocol,
  SushiSwapV3ChainId,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import { PriceRangeSparklineCLMM } from '../../price-range-sparkline-clmm'
import { Positions } from '../positions'
import { CurrentPrice } from './current-price'
import { Fees } from './fees'
import { MinMaxPrices } from './min-max-prices'
import { Rewards } from './rewards'

export const V3PositionDetail = ({
  position,
}: { position: PortfolioV2PositionV3PoolType }) => {
  const chainId = position.pool.chainId as SushiSwapV3ChainId
  const { address } = useAccount()
  const [invert, setInvert] = useState(false)
  const {
    priceLower,
    priceUpper,
    amounts,
    token0,
    token1,
    token0Price,
    token1Price,
    fullRange,
    positionDetails,
    v3Position,
    range,
    isLoading,
    outOfRange,
    tickAtLimit,
  } = useV3PositionData({ data: position, invert, address })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground dark:text-pink-200">
          Price Range
        </p>
        <PriceRangeSparklineCLMM
          strokeWidth={1.5}
          poolAddress={position.pool.address as EvmAddress}
          chainId={position.pool.chainId as SushiSwapV3ChainId}
          protocol={position.pool.protocol as SushiSwapProtocol}
          invert={invert}
          priceLower={priceLower}
          priceUpper={priceUpper}
          outOfRange={outOfRange}
          range={range}
          isLoading={isLoading}
        />
      </div>
      <CurrentPrice
        token0Price={token0Price}
        token1Price={token1Price}
        token0={token0}
        token1={token1}
        invert={invert}
        setInvert={setInvert}
        isLoading={isLoading}
      />
      <MinMaxPrices
        token0={token0}
        token1={token1}
        token0Price={token0Price}
        token1Price={token1Price}
        priceLower={priceLower}
        priceUpper={priceUpper}
        tickAtLimit={tickAtLimit}
        invert={invert}
        fullRange={fullRange}
      />
      <Positions position={position} />
      <Fees
        position={v3Position}
        chainId={chainId}
        token0={token0}
        token1={token1}
        amounts={amounts}
        positionDetails={positionDetails}
        account={address}
      />
      <Rewards position={position} />
    </div>
  )
}
