import { useMemo } from 'react'
import { calculateOrderValue, enUSFormatNumber } from 'src/lib/perps/utils'
import { StatItem } from '../../_common/stat-item'
import { useAssetState } from '../asset-state-provider'

export const OrderValueStat = () => {
  const {
    state: { asset, size, markPrice },
  } = useAssetState()

  const orderValue = useMemo(() => {
    if (!asset || !markPrice || !size.base) {
      return null
    }

    const res = calculateOrderValue({
      baseSize: size.base,
      price: markPrice,
      decimals: asset.decimals,
    })
    if (!res) return null

    return enUSFormatNumber.format(Number.parseFloat(res.notionalFormatted))
  }, [asset, markPrice, size.base])

  return (
    <StatItem
      title="Order Value"
      value={orderValue ? `${orderValue} USDC` : `N/A`}
    />
  )
}
