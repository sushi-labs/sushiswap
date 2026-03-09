import { numberFormatter, useSymbolSplit } from 'src/lib/perps'
import { StatItem } from '../_common/stat-item'
import { PerpSpotTransfer } from '../account-management/perp-spot-transfer'
import { useAssetState } from './asset-state-provider'

export const AvailableToTrade = () => {
  const {
    state: { tradeSide, availableToLong, availableToShort, asset, markPrice },
  } = useAssetState()
  const { baseSymbol, quoteSymbol } = useSymbolSplit({ asset })

  if (asset?.marketType === 'spot') {
    return (
      <StatItem
        title={
          tradeSide === 'long' ? (
            <PerpSpotTransfer
              trigger={
                <button
                  className="underline text-muted-foreground"
                  type="button"
                >
                  Available to Trade
                </button>
              }
            />
          ) : (
            'Available to Trade'
          )
        }
        value={
          tradeSide === 'long'
            ? `${numberFormatter.format(Number.parseFloat(availableToLong) * Number(markPrice))} ${quoteSymbol}`
            : `${numberFormatter.format(Number.parseFloat(availableToShort))} ${baseSymbol}`
        }
      />
    )
  }
  return (
    <StatItem
      title="Available to Trade"
      value={`${
        tradeSide === 'long'
          ? numberFormatter.format(Number.parseFloat(availableToLong))
          : numberFormatter.format(Number.parseFloat(availableToShort))
      } USDC`}
    />
  )
}
