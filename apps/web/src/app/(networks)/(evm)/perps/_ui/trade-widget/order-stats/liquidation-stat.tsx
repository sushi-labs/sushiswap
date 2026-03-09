import { formatPrice } from '@nktkas/hyperliquid/utils'
import { useMemo } from 'react'
import { useMarginTable } from 'src/lib/perps/info'
import { useUserAccountValues } from 'src/lib/perps/use-user-account-values'
import { useUserPositions } from 'src/lib/perps/use-user-positions'
import {
  calculateIsolatedMargin,
  estimateLiquidationPrice,
  numberFormatter,
} from 'src/lib/perps/utils'
import { StatItem } from '../../_common/stat-item'
import { useUserSettingsState } from '../../account-management/settings-provider'
import { useAssetState } from '../asset-state-provider'

export const LiquidationStat = ({ title }: { title?: string }) => {
  const {
    state: {
      tradeSide,
      asset,
      size,
      currentLeverageTypeForAsset,
      currentLeverageForAsset,
      markPrice,
      activeAsset,
      reduceOnly,
      tradeType,
      limitPrice,
    },
  } = useAssetState()
  const { perpsEquity, maintenanceMargin, portfolioValue } =
    useUserAccountValues()
  const { data: marginTable } = useMarginTable({
    marginTableId: asset?.marginTableId ?? undefined,
  })
  const { data: existingPositions } = useUserPositions(activeAsset)
  const {
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()

  const existingPosition = useMemo(() => {
    if (!existingPositions || existingPositions.length === 0) return undefined
    return existingPositions?.find((i) => i.position.coin === activeAsset)
  }, [existingPositions, activeAsset])

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

  const _tradeSide = useMemo(() => {
    if (reduceOnly) {
      //reverse them for reduceOnly
      return tradeSide === 'long' ? 'short' : 'long'
    }
    return tradeSide
  }, [reduceOnly, tradeSide])

  const estimatedLiquidationPrice = useMemo(() => {
    if (
      !asset ||
      !markPrice ||
      (isUnifiedAccountModeEnabled && !portfolioValue) ||
      (!isUnifiedAccountModeEnabled && !perpsEquity) ||
      !size.base
    ) {
      return null
    }
    let price = markPrice
    if (tradeType.toLowerCase().includes('limit') && limitPrice) {
      price = limitPrice
    }

    const positionSize = size.base
    const isCross = currentLeverageTypeForAsset === 'cross'
    const iso = calculateIsolatedMargin({
      baseSize: size.base,
      price: price,
      leverage: currentLeverageForAsset,
      decimals: asset.decimals,
    })

    const existingPositionSize = existingPosition
      ? Number(existingPosition.position.szi)
      : 0
    const existingForCurrentSide =
      (tradeSide === 'long' && existingPosition?.side === 'B') ||
      (tradeSide === 'short' && existingPosition?.side === 'A')

    //todo: something wrong here when the size is small, innacurate price returned
    const liqPrice = estimateLiquidationPrice({
      price: reduceOnly ? (existingPosition?.position.entryPx ?? price) : price,
      side: _tradeSide === 'long' ? 'B' : 'A',
      accountValue: isUnifiedAccountModeEnabled
        ? portfolioValue?.toString()
        : perpsEquity?.toString(),
      positionSize: reduceOnly
        ? (
            Math.abs(existingPositionSize) - Math.abs(Number(positionSize))
          ).toString()
        : (
            Number(positionSize) +
            (!existingForCurrentSide && isCross ? existingPositionSize : 0)
          ).toString(),
      maintenanceMarginRequired: (
        Number(size.quote) / maxLeverage +
        Number(maintenanceMargin)
      ).toString(),
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
    tradeSide,
    existingPosition,
    maintenanceMargin,
    maxLeverage,
    asset,
    markPrice,
    perpsEquity,
    currentLeverageTypeForAsset,
    currentLeverageForAsset,
    size,
    _tradeSide,
    reduceOnly,
    tradeType,
    limitPrice,
    portfolioValue,
    isUnifiedAccountModeEnabled,
  ])

  return (
    <StatItem
      title={title ?? 'Liquidation Price'}
      value={
        estimatedLiquidationPrice
          ? numberFormatter.format(Number(estimatedLiquidationPrice))
          : `N/A`
      }
    />
  )
}
