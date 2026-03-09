import { useMemo } from 'react'
import { calculateMarginRequired, enUSFormatNumber } from 'src/lib/perps'
import { StatItem } from '../../_common/stat-item'
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

  const marginRequired = useMemo(() => {
    if (!asset || !markPrice || !size.base) {
      return null
    }
    let price = markPrice
    if (tradeType.toLowerCase().includes('limit') && limitPrice) {
      price = limitPrice
    }

    const res = calculateMarginRequired({
      baseSize: size.base,
      price,
      leverage: currentLeverageForAsset,
      decimals: asset.decimals,
    })
    if (!res) return null

    return enUSFormatNumber.format(
      Number.parseFloat(res?.marginRequiredFormatted),
    )
  }, [
    asset,
    tradeType,
    size.base,
    markPrice,
    limitPrice,
    currentLeverageForAsset,
  ])

  return (
    <StatItem
      title="Margin Required"
      value={marginRequired ? `${marginRequired} USDC` : `N/A`}
    />
  )
}
