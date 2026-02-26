import { useMemo } from 'react'
import { getTwapOrderCount } from 'src/lib/perps/utils'
import { StatItem } from '~evm/perps/_ui/_common/stat-item'
import { useAssetState } from '../../asset-state-provider'

export const NumberOfOrdersStat = () => {
  const {
    state: { totalRunningTimeInMinutes },
  } = useAssetState()

  const orderCount = useMemo(() => {
    return getTwapOrderCount(totalRunningTimeInMinutes)
  }, [totalRunningTimeInMinutes])

  return <StatItem title="Number of Orders" value={orderCount} />
}
