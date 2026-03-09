import { useMemo } from 'react'
import { calculateOrderValue, perpsNumberFormatter } from 'src/lib/perps'
import { StatItem } from '../../_common'
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
      decimals: asset.sizePriceDecimals,
    })
    if (!res) return null

    return perpsNumberFormatter({
      value: res.notionalFormatted,
      minFraxDigits: 2,
      maxFraxDigits: 2,
    })
  }, [asset, tradeType, size.base, markPrice, limitPrice])

  return (
    <StatItem
      title="Order Value"
      value={orderValue ? `${orderValue} USDC` : `N/A`}
    />
  )
}
