import { perpsNumberFormatter, useSymbolSplit } from 'src/lib/perps'
import { StatItem } from '../../_common'
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

  if (tradeType === 'basis trade') {
    return <BasisTradeStats />
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

const BasisTradeStats = () => {
  const {
    state: { basisTradeAsset, basisTradeSize, tradeSide },
  } = useAssetState()
  const { quoteSymbol: spotQuoteSymbol } = useSymbolSplit({
    asset: basisTradeAsset?.spotAsset,
  })
  const { quoteSymbol: perpQuoteSymbol } = useSymbolSplit({
    asset: basisTradeAsset?.perpAsset,
  })

  if (!basisTradeAsset) return null

  return (
    <div className="flex flex-col gap-2">
      <StatItem
        title="Spot Leg"
        value={`${tradeSide === 'long' ? 'Buy' : 'Sell'} ${basisTradeAsset.spotAsset.symbol}`}
      />
      <StatItem
        title="Perp Leg"
        value={`${tradeSide === 'long' ? 'Short' : 'Long'} ${basisTradeAsset.perpAsset.symbol}`}
      />
      <StatItem
        title="Spot Value"
        value={formatBasisTradeValue(
          basisTradeSize.spot.quote,
          spotQuoteSymbol,
        )}
      />
      <StatItem
        title="Perp Value"
        value={formatBasisTradeValue(
          basisTradeSize.perp.quote,
          perpQuoteSymbol,
        )}
      />
      <StatItem title="Order Type" value="Market" />
    </div>
  )
}

function formatBasisTradeValue(value: string, quoteSymbol: string): string {
  if (Number(value) === 0) return 'N/A'

  return `${perpsNumberFormatter({
    value,
    minFraxDigits: 2,
    maxFraxDigits: 2,
  })} ${quoteSymbol}`
}
