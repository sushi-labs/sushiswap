import { useMemo } from 'react'
import {
  calculateOrderValue,
  perpsNumberFormatter,
  useScaleOrders,
} from 'src/lib/perps'
import { StatItem } from '../../_common'
import { useAssetState } from '../asset-state-provider'

export const OrderValueStat = () => {
  const {
    state: { asset, tradeType, size, markPrice, limitPrice },
  } = useAssetState()
  const { data: scaleOrderData } = useScaleOrders()

  const orderValue = useMemo(() => {
    if (!asset || !markPrice || !size.base) {
      return null
    }
    if (tradeType === 'scale' && scaleOrderData?.orders) {
      return perpsNumberFormatter({
        value: scaleOrderData.totalUsdcValue,
        minFraxDigits: 2,
        maxFraxDigits: 2,
      })
    }
    let price = markPrice
    if (
      tradeType.toLowerCase().includes('limit') &&
      limitPrice &&
      asset?.marketType === 'perp'
    ) {
      price = limitPrice
    }
    const res = calculateOrderValue({
      baseSize: size.base,
      price,
      decimals: asset.formatParseDecimals,
    })
    if (!res) return null

    return perpsNumberFormatter({
      value: res.notionalFormatted,
      minFraxDigits: 2,
      maxFraxDigits: 2,
    })
  }, [asset, tradeType, size.base, markPrice, limitPrice, scaleOrderData])

  return (
    <StatItem
      title="Order Value"
      value={orderValue ? `${orderValue} USDC` : `N/A`}
    />
  )
}
