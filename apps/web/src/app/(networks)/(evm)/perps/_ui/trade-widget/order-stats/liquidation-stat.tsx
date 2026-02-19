import { formatPrice } from '@nktkas/hyperliquid/utils'
import { useMemo } from 'react'
import { useMarginTable } from 'src/lib/perps/info/use-margin-table'
import { useUserAccountValues } from 'src/lib/perps/use-user-account-values'
import {
  calculateIsolatedMargin,
  estimateLiquidationPrice,
  numberFormatter,
} from 'src/lib/perps/utils'
import { StatItem } from '../../_common/stat-item'
import { useAssetState } from '../asset-state-provider'

export const LiquidationStat = () => {
  const {
    state: {
      tradeSide,
      asset,
      size,
      currentLeverageTypeForAsset,
      currentLeverageForAsset,
      markPrice,
    },
  } = useAssetState()
  const { perpsEquity } = useUserAccountValues()
  const { data: marginTable } = useMarginTable({
    marginTableId: asset?.marginTableId ?? undefined,
  })

  const maxLeverage = useMemo(() => {
    if (!marginTable) return asset?.maxLeverage ?? 1
    let maxLev = asset?.maxLeverage ?? 1
    for (const tier of marginTable.marginTiers) {
      if (Number(tier.lowerBound) <= Number(size.quote)) {
        maxLev = tier.maxLeverage
      } else {
        break
      }
    }
    return maxLev * 2
  }, [marginTable, asset, size])

  const estimatedLiquidationPrice = useMemo(() => {
    if (!asset || !markPrice || !perpsEquity || !size.base) {
      return null
    }
    const positionSize = size.base
    const isCross = currentLeverageTypeForAsset === 'cross'
    const iso = calculateIsolatedMargin({
      baseSize: size.base,
      price: markPrice,
      leverage: currentLeverageForAsset,
      decimals: asset.decimals,
    })

    const liqPrice = estimateLiquidationPrice({
      price: markPrice,
      side: tradeSide === 'short' ? 'A' : 'B',
      accountValue: perpsEquity?.toString(),
      positionSize: positionSize,
      maintenanceLeverage: maxLeverage.toString(),
      isolatedMargin: iso?.isolatedMarginFormatted ?? '0', //pass isolated margin even if cross for completeness
      isCross,
    })

    if (!liqPrice) return null
    try {
      return formatPrice(liqPrice, asset?.decimals, asset?.marketType)
    } catch (e) {
      console.error('Error estimating liquidation price', e)
      return null
    }
  }, [
    maxLeverage,
    asset,
    markPrice,
    perpsEquity,
    currentLeverageTypeForAsset,
    currentLeverageForAsset,
    size.base,
    tradeSide,
  ])

  return (
    <StatItem
      title="Liquidation Price"
      value={
        estimatedLiquidationPrice
          ? numberFormatter.format(Number(estimatedLiquidationPrice))
          : `N/A`
      }
    />
  )
}
