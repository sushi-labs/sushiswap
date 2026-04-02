import { useAssetState } from '../asset-state-provider'
import { FeeStat } from './fee-stat'
import { LiquidationStat } from './liquidation-stat'
import { MarginRequiredStat } from './margin-required-stat'
import { OrderValueStat } from './order-value-stat'
import { ScaleStartEndStat } from './scale-start-end-stat'
import { SlippageStat } from './slippage-stat'
import { TwapStats } from './twap-stats/twap-stats'

export const OrderStats = () => {
  const {
    state: { tradeType, asset },
  } = useAssetState()

  if (tradeType === 'TWAP') {
    return <TwapStats />
  }

  return (
    <div className="flex flex-col gap-2">
      {tradeType === 'scale' ? (
        <ScaleStartEndStat />
      ) : asset?.marketType === 'perp' ? (
        <LiquidationStat />
      ) : null}
      <OrderValueStat />
      {asset?.marketType === 'perp' ? <MarginRequiredStat /> : null}
      {tradeType === 'market' ? <SlippageStat /> : null}
      <FeeStat />
    </div>
  )
}
