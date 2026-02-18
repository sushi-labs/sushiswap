import { enUSFormatNumber } from 'src/lib/perps/utils'
import { StatItem } from '../_common/stat-item'
import { useAssetState } from './asset-state-provider'

export const AvailableToTrade = () => {
  const {
    state: { tradeSide, availableToLong, availableToShort },
  } = useAssetState()

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
