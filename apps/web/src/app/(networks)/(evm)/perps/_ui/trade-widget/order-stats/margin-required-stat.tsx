import { useMemo } from 'react'
import { calculateMarginRequired, enUSFormatNumber } from 'src/lib/perps/utils'
import { StatItem } from '../../_common/stat-item'
import { useAssetState } from '../asset-state-provider'

export const MarginRequiredStat = () => {
  const {
    state: { size, asset, markPrice, currentLeverageForAsset },
  } = useAssetState()

  const marginRequired = useMemo(() => {
    if (!asset || !markPrice || !size.base) {
      return null
    }

    const res = calculateMarginRequired({
      baseSize: size.base,
      price: markPrice,
      leverage: currentLeverageForAsset,
      decimals: asset.decimals,
    })
    if (!res) return null

    return enUSFormatNumber.format(
      Number.parseFloat(res?.marginRequiredFormatted),
    )
  }, [asset, markPrice, size.base, currentLeverageForAsset])

  return (
    <StatItem
      title="Margin Required"
      value={marginRequired ? `${marginRequired} USDC` : `N/A`}
    />
  )
}
