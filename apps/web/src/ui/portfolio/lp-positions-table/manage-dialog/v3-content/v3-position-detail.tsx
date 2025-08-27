import { PriceRangeSparklineCLMM } from '../../price-range-sparkline-clmm'
import { Positions } from '../positions'
import { CurrentPrice } from './current-price'
import { Fees } from './fees'
import { MinMaxPrices } from './min-max-prices'
import { Rewards } from './rewards'

export const V3PositionDetail = ({ position }: { position: any }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* @dev the toggle in CurrentPrice should change the content in the sparkline and MinMaxPrices as well */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground dark:text-pink-200">
          Price Range
        </p>
        <PriceRangeSparklineCLMM strokeWidth={1.5} />
      </div>
      <CurrentPrice token0={position.token0} token1={position.token1} />
      <MinMaxPrices />
      <Positions position={position} />
      <Fees position={position} />
      <Rewards position={position} />
    </div>
  )
}
