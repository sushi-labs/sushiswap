import { useMemo } from 'react'
import {
  calculateIsolatedMargin,
  calculateMarginRequired,
  estimateLiquidationPrice,
  formatPrice,
  perpsNumberFormatter,
  useMarginTable,
  useUserAccountValues,
  useUserPositions,
} from 'src/lib/perps'
import { StatItem } from '../../_common'
import { useUserSettingsState } from '../../account-management'
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
  const { perpsEquity, portfolioValue } = useUserAccountValues()
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

    let orderPrice = markPrice
    if (tradeType.toLowerCase().includes('limit') && limitPrice) {
      orderPrice = limitPrice
    }

    const isCross = currentLeverageTypeForAsset === 'cross'

    const existingSignedSize = Number(existingPosition?.position.szi ?? 0)
    const existingEntry = Number(
      existingPosition?.position.entryPx ?? orderPrice,
    )

    const orderAbsSize = Number(size.base)
    const orderSignedSize = _tradeSide === 'long' ? orderAbsSize : -orderAbsSize

    let nextSignedSize = existingSignedSize

    if (reduceOnly) {
      // clamp so it cannot flip
      if (existingSignedSize > 0) {
        nextSignedSize = Math.max(existingSignedSize - orderAbsSize, 0)
      } else if (existingSignedSize < 0) {
        nextSignedSize = Math.min(existingSignedSize + orderAbsSize, 0)
      }
    } else {
      nextSignedSize = existingSignedSize + orderSignedSize
    }

    const nextAbsSize = Math.abs(nextSignedSize)
    if (nextAbsSize === 0) return null

    const nextSide: 'A' | 'B' = nextSignedSize > 0 ? 'B' : 'A'

    let nextEntry = Number(orderPrice)

    if (existingSignedSize === 0) {
      nextEntry = Number(orderPrice)
    } else if (Math.sign(existingSignedSize) === Math.sign(orderSignedSize)) {
      nextEntry =
        (Math.abs(existingSignedSize) * existingEntry +
          Math.abs(orderSignedSize) * Number(orderPrice)) /
        (Math.abs(existingSignedSize) + Math.abs(orderSignedSize))
    } else {
      if (Math.abs(orderSignedSize) < Math.abs(existingSignedSize)) {
        nextEntry = existingEntry
      } else if (Math.abs(orderSignedSize) > Math.abs(existingSignedSize)) {
        nextEntry = Number(orderPrice)
      } else {
        return null
      }
    }

    const maintenanceLev = Number(maxLeverage)
    if (!Number.isFinite(maintenanceLev) || maintenanceLev <= 0) {
      return null
    }

    const nextMaintenanceMarginRequired =
      (nextAbsSize * nextEntry) / maintenanceLev

    const iso = calculateIsolatedMargin({
      baseSize: nextAbsSize.toString(),
      price: nextEntry.toString(),
      leverage: currentLeverageForAsset,
      decimals: asset.formatParseDecimals,
    })

    const liqPrice = estimateLiquidationPrice({
      price: nextEntry.toString(),
      side: nextSide,
      accountValue: isUnifiedAccountModeEnabled
        ? portfolioValue!.toString()
        : perpsEquity!.toString(),
      positionSize: nextAbsSize.toString(),
      maintenanceMarginRequired: nextMaintenanceMarginRequired.toString(),
      maintenanceLeverage: maintenanceLev.toString(),
      isolatedMargin: iso?.isolatedMarginFormatted ?? '0',
      isCross,
    })

    if (!liqPrice) return null

    try {
      return formatPrice(liqPrice, asset.decimals, asset.marketType)
    } catch {
      return null
    }
  }, [
    asset,
    markPrice,
    portfolioValue,
    perpsEquity,
    size.base,
    tradeType,
    limitPrice,
    currentLeverageTypeForAsset,
    existingPosition,
    _tradeSide,
    reduceOnly,
    currentLeverageForAsset,
    maxLeverage,
    isUnifiedAccountModeEnabled,
  ])
  return (
    <StatItem
      title={title ?? 'Liquidation Price'}
      value={
        estimatedLiquidationPrice
          ? perpsNumberFormatter({ value: estimatedLiquidationPrice })
          : `N/A`
      }
    />
  )
}
