import { useSymbolSplit } from 'src/lib/perps/use-symbol-split'
import { StatItem } from '../../_common/stat-item'
import { useAssetState } from '../asset-state-provider'
import { FeeStat } from './fee-stat'
import { LiquidationStat } from './liquidation-stat'
import { MarginRequiredStat } from './margin-required-stat'
import { OrderValueStat } from './order-value-stat'
import { SlippageStat } from './slippage-stat'

export const OrderStats = () => {
  const {
    state: { tradeType },
  } = useAssetState()

  if (tradeType === 'TWAP') {
    return <TwapStats />
  }

  return (
    <div className="flex flex-col gap-2">
      {tradeType === 'scale' ? (
        <>
          <StatItem title="Start" value={`todo USDC`} />
          <StatItem title="End" value={`todo USDC`} />
        </>
      ) : (
        <LiquidationStat />
      )}
      <OrderValueStat />
      <MarginRequiredStat />
      {tradeType === 'market' ? <SlippageStat /> : null}
      <FeeStat />
    </div>
  )
}

const TwapStats = () => {
  const {
    state: { asset },
  } = useAssetState()
  const { baseSymbol } = useSymbolSplit({ asset })
  return (
    <div className="flex flex-col gap-2">
      <StatItem title="Frequency" value={`-- secs`} />
      <StatItem title="Runtime" value={`-- mins`} />
      <StatItem title="Number of Orders" value={`61`} />
      <StatItem title="Size per Suborder" value={`-- ${baseSymbol}`} />

      <FeeStat />
    </div>
  )
}
