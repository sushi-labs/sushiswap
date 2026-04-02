import { useMemo } from 'react'
import {
  getTwapOrderCount,
  getTwapSuborderSize,
  perpsNumberFormatter,
  useSymbolSplit,
} from 'src/lib/perps'
import { StatItem } from '~evm/perps/_ui/_common'
import { useAssetState } from '../../asset-state-provider'

export const SizePerSuborderStat = () => {
  const {
    state: { totalRunningTimeInMinutes, asset, size },
  } = useAssetState()
  const { baseSymbol } = useSymbolSplit({ asset })

  const orderCount = useMemo(() => {
    return getTwapOrderCount(totalRunningTimeInMinutes)
  }, [totalRunningTimeInMinutes])

  const sizePerSuborder = useMemo(() => {
    if (Number(size.base) === 0 || !asset || !orderCount) return '0'

    return getTwapSuborderSize({
      totalSize: size.base,
      orderCount,
      decimals: asset.decimals,
    })
  }, [size, orderCount, asset])

  return (
    <StatItem
      title="Size per Suborder"
      value={`${perpsNumberFormatter({ value: sizePerSuborder })} ${baseSymbol}`}
    />
  )
}
