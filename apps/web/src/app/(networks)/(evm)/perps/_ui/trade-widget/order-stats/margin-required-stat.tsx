import { useMemo } from 'react'
import {
  calculateMarginRequired,
  perpsNumberFormatter,
  useScaleOrders,
} from 'src/lib/perps'
import { StatItem } from '../../_common'
import { useAssetState } from '../asset-state-provider'

export const MarginRequiredStat = () => {
  const {
    state: {
      size,
      asset,
      markPrice,
      currentLeverageForAsset,
      tradeType,
      limitPrice,
    },
  } = useAssetState()
  const { data: scaleOrderData } = useScaleOrders()

  const marginRequired = useMemo(() => {
    if (!asset || !markPrice || !size.base) {
      return null
    }
    let price = markPrice
    if (tradeType === 'scale' && scaleOrderData?.orders) {
      const value = scaleOrderData.totalUsdcValue / currentLeverageForAsset

      return perpsNumberFormatter({
        value,
        minFraxDigits: 2,
        maxFraxDigits: 2,
      })
    }
    if (tradeType.toLowerCase().includes('limit') && limitPrice) {
      price = limitPrice
    }

    const res = calculateMarginRequired({
      baseSize: size.base,
      price,
      leverage: currentLeverageForAsset,
      decimals: asset.formatParseDecimals,
    })
    if (!res) return null

    return perpsNumberFormatter({
      value: res?.marginRequiredFormatted,
      minFraxDigits: 2,
      maxFraxDigits: 2,
    })
  }, [
    asset,
    tradeType,
    size.base,
    markPrice,
    limitPrice,
    currentLeverageForAsset,
    scaleOrderData,
  ])

  return (
    <StatItem
      title="Margin Required"
      value={marginRequired ? `${marginRequired} USDC` : `N/A`}
    />
  )
}
