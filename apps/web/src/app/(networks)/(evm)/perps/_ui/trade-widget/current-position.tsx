import { classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useUserPositions } from 'src/lib/perps/use-user-positions'
import { getTextColorClass, numberFormatter } from 'src/lib/perps/utils'
import { StatItem } from '../_common/stat-item'
import { useAssetState } from './asset-state-provider'

export const CurrentPosition = () => {
  const {
    state: { activeAsset },
  } = useAssetState()
  const { data } = useUserPositions(activeAsset)

  const { positionSize, side } = useMemo(() => {
    if (!data || data.length === 0) return { positionSize: 0, side: 'C' } //C does not exist, means no position in this component
    const pos = data?.[0]
    const side = pos.side
    return { positionSize: Math.abs(Number.parseFloat(pos.position.szi)), side }
  }, [data])

  return (
    <StatItem
      title="Current Position"
      value={
        <div
          className={classNames(
            side !== 'C' ? getTextColorClass(side === 'A' ? -1 : 1) : '',
          )}
        >
          {numberFormatter.format(positionSize)} {activeAsset}
        </div>
      }
    />
  )
}
