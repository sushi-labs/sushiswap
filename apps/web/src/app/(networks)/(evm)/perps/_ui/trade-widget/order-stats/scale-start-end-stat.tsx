import { useScaleOrders, useSymbolSplit } from 'src/lib/perps'
import { StatItem } from '../../_common'
import { useAssetState } from '../asset-state-provider'

export const ScaleStartEndStat = () => {
  const {
    state: { scaleStartEnd, asset },
  } = useAssetState()
  const { baseSymbol } = useSymbolSplit({ asset })

  const { data } = useScaleOrders()
  const scaleOrders = data?.orders
  return (
    <>
      <StatItem
        title="Start"
        value={
          scaleOrders && scaleOrders.length > 1
            ? `${scaleOrders[0].size} ${baseSymbol} @ ${scaleStartEnd.start} USDC`
            : 'N/A'
        }
      />
      <StatItem
        title="End"
        value={
          scaleOrders && scaleOrders.length > 1
            ? `${scaleOrders[scaleOrders.length - 1].size} ${baseSymbol} @ ${scaleStartEnd.end} USDC`
            : 'N/A'
        }
      />
    </>
  )
}
