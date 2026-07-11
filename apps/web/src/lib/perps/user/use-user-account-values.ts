import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserState } from '~evm/perps/user-provider'
import { getCollateralTokenForDex, useAllPerpMetas } from '../info'

export const useUserAccountValues = () => {
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress
  const {
    state: {
      spotStateQuery: {
        data: spotState,
        isLoading: isLoadingSpotState,
        error: errorSpotState,
      },
      allDexClearinghouseStateQuery: {
        data: allDexClearinghouseState,
        isLoading: allDexLoading,
        error: allDexError,
      },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: assetListLoading,
        error: assetListError,
      },
    },
  } = useAssetListState()
  const {
    data: allPerpMetas,
    isLoading: isLoadingAllPerpMetas,
    error: errorAllPerpMetas,
  } = useAllPerpMetas()

  const isLoading = useMemo(() => {
    if (!address) return false
    return (
      isLoadingSpotState ||
      allDexLoading ||
      assetListLoading ||
      isLoadingAllPerpMetas
    )
  }, [
    address,
    isLoadingSpotState,
    allDexLoading,
    assetListLoading,
    isLoadingAllPerpMetas,
  ])

  const error = useMemo(() => {
    if (!address) return null
    return errorSpotState || allDexError || assetListError || errorAllPerpMetas
  }, [address, errorSpotState, allDexError, assetListError, errorAllPerpMetas])

  const spotEquity = useMemo(() => {
    if (!spotState?.spotState?.balances || !assetList) return 0
    return (
      spotState.spotState.balances.reduce((acc, asset) => {
        const balance = Number(asset?.total) ?? 0
        if (asset.coin === 'USDC') {
          return acc + balance
        }
        const tokenIndex = asset?.token
        const spot = Array.from(assetList?.entries() ?? []).find(([, v]) =>
          v?.tokens?.find((t) => t?.index === tokenIndex),
        )?.[1]
        if (!spot) {
          return acc
        }
        const price = Number(spot?.lastPrice) ?? 0
        const val = balance * price
        return acc + val
      }, 0) ?? 0
    )
  }, [spotState?.spotState?.balances, assetList])

  const unrelaizedPnL = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return allDexClearinghouseState.clearinghouseStates.reduce(
      (posAcc, [_dex, pos]) => {
        return pos.assetPositions.reduce((assetAcc, assetPos) => {
          const unrealizedPnl = Number(assetPos.position.unrealizedPnl ?? 0)
          return assetAcc + unrealizedPnl
        }, posAcc)
      },
      0,
    )
  }, [allDexClearinghouseState])

  const perpsEquity = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return allDexClearinghouseState?.clearinghouseStates.reduce(
      (posAcc, [_dex, pos]) => {
        return Number(pos.marginSummary?.accountValue ?? 0) + posAcc
      },
      0,
    )
  }, [allDexClearinghouseState])

  const perpsBalance = useMemo(() => {
    if (!perpsEquity) return 0
    return perpsEquity - (unrelaizedPnL || 0)
  }, [perpsEquity, unrelaizedPnL])

  const maintenanceMargin = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return (
      allDexClearinghouseState?.clearinghouseStates?.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.crossMaintenanceMarginUsed ?? 0) + posAcc
        },
        0,
      ) || 0
    )
  }, [allDexClearinghouseState])

  const crossPortfolioValue = useMemo(() => {
    if (!allDexClearinghouseState) return 0

    return allDexClearinghouseState.clearinghouseStates.reduce(
      (acc, [_dex, state]) => {
        return acc + Number(state.crossMarginSummary?.accountValue ?? 0)
      },
      0,
    )
  }, [allDexClearinghouseState])

  const totalCrossMarginRatio = useMemo(() => {
    return (maintenanceMargin / (crossPortfolioValue || 1)) * 100
  }, [maintenanceMargin, crossPortfolioValue])

  const crossAccountLeverage = useMemo(() => {
    if (!crossPortfolioValue || !allDexClearinghouseState) return 0
    const totalNtlPos =
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.crossMarginSummary?.totalNtlPos ?? 0) + posAcc
        },
        0,
      ) || 0

    return totalNtlPos / (crossPortfolioValue || 1)
  }, [crossPortfolioValue, allDexClearinghouseState])

  const withdrawableBalance = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return (
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.withdrawable ?? 0) + posAcc
        },
        0,
      ) || 0
    )
  }, [allDexClearinghouseState])

  const portfolioValue = useMemo(() => {
    return perpsEquity + spotEquity
  }, [perpsEquity, spotEquity])

  const clearhouseStateTotal = useMemo(() => {
    if (!spotState?.spotState?.balances || !assetList || !allPerpMetas) {
      return 0
    }

    const collateralTokens = new Set(
      allPerpMetas.map((meta) => meta.collateralToken),
    )

    return (
      spotState.spotState.balances.reduce((acc, asset) => {
        const balance = Number(asset?.total) ?? 0
        if (asset.coin === 'USDC') {
          return acc + balance
        }
        const tokenIndex = asset?.token
        if (!collateralTokens.has(tokenIndex)) {
          return acc
        }
        const spot = Array.from(assetList?.entries() ?? []).find(([, v]) =>
          v?.tokens?.find((t) => t?.index === tokenIndex),
        )?.[1]
        const price = Number(spot?.lastPrice) ?? 0
        const val = balance * price
        return acc + val
      }, 0) ?? 0
    )
  }, [spotState?.spotState?.balances, assetList, allPerpMetas])

  const unifiedAccountLeverage = useMemo(() => {
    if (!allDexClearinghouseState) return 0

    const crossValue =
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          const crossPosValue = pos.assetPositions.reduce(
            (assetAcc, assetPos) => {
              if (assetPos.position.leverage.type === 'isolated')
                return assetAcc
              const posValue = Number(assetPos.position.positionValue ?? 0)
              return assetAcc + posValue
            },
            0,
          )
          return posAcc + crossPosValue
        },
        0,
      ) || 0

    return crossValue / (clearhouseStateTotal || 1)
  }, [allDexClearinghouseState, clearhouseStateTotal])

  const unifiedAccountRatio = useMemo(() => {
    // https://hyperliquid.gitbook.io/hyperliquid-docs/trading/account-abstraction-modes#unified-account-ratio
    if (!allDexClearinghouseState || !allPerpMetas) return 0

    const crossMarginByToken: Record<number, number> = {}
    const isolatedMarginByToken: Record<number, number> = {}

    for (const [dexName, dex] of allDexClearinghouseState.clearinghouseStates) {
      const token = getCollateralTokenForDex(allPerpMetas, dexName)

      if (dex === undefined || token === undefined) continue

      crossMarginByToken[token] =
        (crossMarginByToken[token] ?? 0) +
        Number(dex.crossMaintenanceMarginUsed)

      for (const ap of dex.assetPositions) {
        if (ap.position.leverage.type === 'isolated') {
          isolatedMarginByToken[token] =
            (isolatedMarginByToken[token] ?? 0) + Number(ap.position.marginUsed)
        }
      }
    }
    let maxRatio = 0
    for (const [tokenStr, crossMargin] of Object.entries(crossMarginByToken)) {
      const token = Number(tokenStr)
      const spotTotal =
        spotState?.spotState?.balances?.find((b) => b.token === token)?.total ??
        0
      const isolatedMargin = isolatedMarginByToken[token] ?? 0
      const available = Number(spotTotal) - isolatedMargin
      if (available > 0) {
        maxRatio = Math.max(maxRatio, crossMargin / available)
      }
    }

    return maxRatio * 100
  }, [allDexClearinghouseState, allPerpMetas, spotState?.spotState?.balances])

  return {
    isLoading,
    error,
    spotEquity,
    unrelaizedPnL,
    perpsEquity,
    perpsBalance,
    maintenanceMargin,
    totalCrossMarginRatio,
    crossAccountLeverage,
    withdrawableBalance,
    portfolioValue,
    unifiedAccountLeverage,
    unifiedAccountRatio,
  }
}
