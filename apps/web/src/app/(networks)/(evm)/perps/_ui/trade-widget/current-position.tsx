import { classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  getTextColorClass,
  perpsNumberFormatter,
  useSymbolSplit,
  useUserPositions,
} from 'src/lib/perps'
import { StatItem } from '../_common'
import { useAssetState } from './asset-state-provider'

export const CurrentPosition = () => {
  const {
    state: { activeAsset, asset },
  } = useAssetState()
  const { data } = useUserPositions(activeAsset)
  const { baseSymbol } = useSymbolSplit({ asset })

  const { positionSize, side } = useMemo(() => {
    if (!data || data.length === 0 || asset?.marketType === 'spot')
      return { positionSize: 0, side: 'C' } //C does not exist, means no position in this component
    const pos = data?.[0]
    const side = pos.side
    return { positionSize: Math.abs(Number.parseFloat(pos.position.szi)), side }
  }, [data, asset?.marketType])

  if (asset?.marketType === 'spot') return null

  return (
    <StatItem
      title="Current Position"
      value={
        <div
          className={classNames(
            side !== 'C' ? getTextColorClass(side === 'A' ? -1 : 1) : '',
          )}
        >
          {perpsNumberFormatter({ value: positionSize })} {baseSymbol}
        </div>
      }
    />
  )
}
