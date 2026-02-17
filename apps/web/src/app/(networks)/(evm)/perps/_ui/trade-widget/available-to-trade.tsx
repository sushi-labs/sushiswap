import { useMemo } from 'react'
import { enUSFormatNumber } from 'src/lib/perps/utils'
import { StatItem } from '../_common/stat-item'
import { useAssetState } from '../asset-state-provider'

export const AvailableToTrade = () => {
  const {
    state: {
      tradeSide,
      activeAssetDataQuery: { data: activeAssetData },
    },
  } = useAssetState()

  const [availableToLong, availableToShort] = useMemo(
    () => activeAssetData?.availableToTrade || ['0', '0'],
    [activeAssetData?.availableToTrade],
  )

  return (
    <StatItem
      title="Available to Trade"
      value={`${
        tradeSide === 'long'
          ? enUSFormatNumber.format(Number.parseFloat(availableToLong))
          : enUSFormatNumber.format(Number.parseFloat(availableToShort))
      } USDC`}
    />
  )
}
