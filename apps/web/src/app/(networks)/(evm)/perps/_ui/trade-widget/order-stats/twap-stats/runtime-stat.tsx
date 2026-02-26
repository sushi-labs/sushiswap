import { useMemo } from 'react'
import { StatItem } from '~evm/perps/_ui/_common/stat-item'
import { useAssetState } from '../../asset-state-provider'

export const RuntimeStat = () => {
  const {
    state: { totalRunningTimeInMinutes },
  } = useAssetState()

  const { hours, minutes } = useMemo(() => {
    const hours = Math.floor(totalRunningTimeInMinutes / 60)
    const minutes = totalRunningTimeInMinutes % 60
    return { hours, minutes }
  }, [totalRunningTimeInMinutes])

  return (
    <StatItem
      title="Runtime"
      value={
        hours === 0 && minutes === 0
          ? '--'
          : `${hours > 0 ? `${hours} hours ` : ''}${minutes > 0 ? `${minutes} minutes` : ''}`
      }
    />
  )
}
