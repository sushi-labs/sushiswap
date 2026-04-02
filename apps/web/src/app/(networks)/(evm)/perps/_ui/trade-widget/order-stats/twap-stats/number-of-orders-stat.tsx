import { useMemo } from 'react'
import { getTwapOrderCount } from 'src/lib/perps'
import { StatItem } from '~evm/perps/_ui/_common'
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
