import { useMemo } from 'react'
import { perpsNumberFormatter, useSymbolSplit } from 'src/lib/perps'
import { StatItem } from '../_common'
import { PerpSpotTransferDialog } from '../account-management'
import { useAssetState } from './asset-state-provider'

export const AvailableToTrade = () => {
  const {
    state: { tradeSide, availableToLong, availableToShort, asset, markPrice },
  } = useAssetState()
  const { baseSymbol, quoteSymbol } = useSymbolSplit({ asset })

  const { availToLong, availToShort } = useMemo(() => {
    if (asset?.marketType === 'spot') {
      const longValue = (
        Number.parseFloat(availableToLong) * Number(markPrice)
      ).toString()
      return {
        availToLong: perpsNumberFormatter({
          value: longValue,
          minFraxDigits: 2,
          maxFraxDigits: 2,
        }),
        availToShort: perpsNumberFormatter({
          value: availableToShort,
          maxFraxDigits: asset?.formatParseDecimals,
        }),
      }
    }
    return {
      availToLong: perpsNumberFormatter({
        value: availableToLong,
        minFraxDigits: 2,
        maxFraxDigits: 2,
      }),
      availToShort: perpsNumberFormatter({
        value: availableToShort,
        minFraxDigits: 2,
        maxFraxDigits: 2,
      }),
    }
  }, [availableToLong, availableToShort, asset, markPrice])

  if (asset?.marketType === 'spot') {
    return (
      <StatItem
        title={
          tradeSide === 'long' ? (
            <PerpSpotTransferDialog
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
            ? `${availToLong} ${quoteSymbol}`
            : `${availToShort} ${baseSymbol}`
        }
      />
    )
  }
  return (
    <StatItem
      title="Available to Trade"
      value={`${tradeSide === 'long' ? availToLong : availToShort} USDC`}
    />
  )
}
