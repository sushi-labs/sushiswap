import { useMemo } from 'react'
import { calculateOrderValue, enUSFormatNumber } from 'src/lib/perps/utils'
import { StatItem } from '../../_common/stat-item'
import { useAssetState } from '../asset-state-provider'

export const OrderValueStat = () => {
  const {
    state: { asset, tradeType, size, markPrice, limitPrice },
  } = useAssetState()

  const orderValue = useMemo(() => {
    if (!asset || !markPrice || !size.base) {
      return null
    }
    let price = markPrice
    if (tradeType.toLowerCase().includes('limit') && limitPrice) {
      price = limitPrice
    }

    const res = calculateOrderValue({
      baseSize: size.base,
      price,
      decimals: asset.decimals,
    })
    if (!res) return null

    return enUSFormatNumber.format(Number.parseFloat(res.notionalFormatted))
  }, [asset, tradeType, size.base, markPrice, limitPrice])

  return (
    <StatItem
      title="Order Value"
      value={orderValue ? `${orderValue} USDC` : `N/A`}
    />
  )
}
